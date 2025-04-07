import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { currentUser } from '@clerk/nextjs/server';

// Admin email - this would typically be stored in environment variables
const ADMIN_EMAIL = 'jimmytole1262@gmail.com';

// Helper function to check if user is admin
async function isAdmin(user: any) {
  if (!user) return false;
  
  // Check if user is the primary admin
  if (user.emailAddresses[0].emailAddress === ADMIN_EMAIL) {
    return true;
  }
  
  // Check if user exists in admin_users table
  const { data } = await supabase
    .from('admin_users')
    .select('*')
    .eq('email', user.emailAddresses[0].emailAddress)
    .single();
  
  return !!data;
}

export async function GET(request: Request) {
  const user = await currentUser();
  
  // Check if user is admin
  if (!user || !await isAdmin(user)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
  
  try {
    // Get total products count
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, price, stock, category');
    
    if (productsError) {
      return NextResponse.json({ error: productsError.message }, { status: 500 });
    }
    
    // Get orders data
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*');
    
    if (ordersError) {
      return NextResponse.json({ error: ordersError.message }, { status: 500 });
    }
    
    // Calculate total revenue
    const totalRevenue = orders ? orders.reduce((sum, order) => sum + (order.total_amount || 0), 0) : 0;
    
    // Calculate product sales by category
    const productsByCategory = products ? products.reduce((acc, product) => {
      const category = product.category || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = {
          count: 0,
          revenue: 0,
          stock: 0
        };
      }
      acc[category].count += 1;
      acc[category].stock += product.stock || 0;
      
      // Find orders for this product to calculate revenue
      const productOrders = orders ? orders.filter(order => 
        order.items && order.items.some((item: any) => item.product_id === product.id)
      ) : [];
      
      const productRevenue = productOrders.reduce((sum, order) => {
        const item = order.items.find((item: any) => item.product_id === product.id);
        return sum + (item ? (item.price * item.quantity) : 0);
      }, 0);
      
      acc[category].revenue += productRevenue;
      
      return acc;
    }, {} as Record<string, { count: number, revenue: number, stock: number }>) : {};
    
    // Calculate top selling products
    const productSales = products.map(product => {
      const productOrders = orders ? orders.filter(order => 
        order.items && order.items.some((item: any) => item.product_id === product.id)
      ) : [];
      
      const totalQuantity = productOrders.reduce((sum, order) => {
        const item = order.items.find((item: any) => item.product_id === product.id);
        return sum + (item ? item.quantity : 0);
      }, 0);
      
      const totalSales = productOrders.reduce((sum, order) => {
        const item = order.items.find((item: any) => item.product_id === product.id);
        return sum + (item ? (item.price * item.quantity) : 0);
      }, 0);
      
      return {
        id: product.id,
        name: product.name,
        quantity: totalQuantity,
        sales: totalSales,
        stock: product.stock || 0
      };
    }).sort((a, b) => b.sales - a.sales);
    
    // Generate monthly revenue data
    const monthlyRevenue = generateMonthlyRevenueData(orders);
    
    // Generate weekly revenue data
    const weeklyRevenue = generateWeeklyRevenueData(orders);
    
    // Generate order volume data
    const orderVolume = generateOrderVolumeData(orders);
    
    return NextResponse.json({
      summary: {
        totalRevenue,
        totalProducts: products.length,
        totalOrders: orders.length,
        activeUsers: Math.round(orders.length * 0.4) // Approximation for demo
      },
      productsByCategory,
      topProducts: productSales.slice(0, 5),
      monthlyRevenue,
      weeklyRevenue,
      orderVolume
    });
  } catch (error: any) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Helper function to generate monthly revenue data
function generateMonthlyRevenueData(orders: any[]) {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  const monthlyData = months.map(month => ({
    name: month,
    revenue: 0,
    profit: 0
  }));
  
  if (!orders || !orders.length) return monthlyData;
  
  orders.forEach(order => {
    if (!order.created_at) return;
    
    const date = new Date(order.created_at);
    const monthIndex = date.getMonth();
    
    monthlyData[monthIndex].revenue += order.total_amount || 0;
    // Estimate profit as 40% of revenue for demo purposes
    monthlyData[monthIndex].profit += (order.total_amount || 0) * 0.4;
  });
  
  return monthlyData;
}

// Helper function to generate weekly revenue data
function generateWeeklyRevenueData(orders: any[]) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  const weeklyData = days.map(day => ({
    name: day,
    revenue: 0,
    profit: 0
  }));
  
  if (!orders || !orders.length) return weeklyData;
  
  // Get orders from the last 7 days
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  const recentOrders = orders.filter(order => {
    if (!order.created_at) return false;
    const orderDate = new Date(order.created_at);
    return orderDate >= oneWeekAgo;
  });
  
  recentOrders.forEach(order => {
    if (!order.created_at) return;
    
    const date = new Date(order.created_at);
    const dayIndex = date.getDay() - 1; // Convert from 0-6 (Sun-Sat) to 0-6 (Mon-Sun)
    const adjustedIndex = dayIndex < 0 ? 6 : dayIndex; // Handle Sunday
    
    weeklyData[adjustedIndex].revenue += order.total_amount || 0;
    // Estimate profit as 40% of revenue for demo purposes
    weeklyData[adjustedIndex].profit += (order.total_amount || 0) * 0.4;
  });
  
  return weeklyData;
}

// Helper function to generate order volume data
function generateOrderVolumeData(orders: any[]) {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  const orderData = months.map(month => ({
    name: month,
    orders: 0
  }));
  
  if (!orders || !orders.length) return orderData;
  
  orders.forEach(order => {
    if (!order.created_at) return;
    
    const date = new Date(order.created_at);
    const monthIndex = date.getMonth();
    
    orderData[monthIndex].orders += 1;
  });
  
  return orderData;
}
