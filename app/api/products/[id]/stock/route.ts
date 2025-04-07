import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { supabase } from '@/lib/supabase';

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

// Get current stock for a product
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  
  const { data, error } = await supabase
    .from('products')
    .select('id, stock')
    .eq('id', id)
    .single();
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  if (!data) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }
  
  return NextResponse.json({ id: data.id, stock: data.stock });
}

// Update stock for a product
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  // For stock updates, we don't require admin privileges
  // This allows the client-side inventory system to update stock
  // However, we could add authentication if needed
  
  const id = params.id;
  const { stock } = await request.json();
  
  // Validate stock value
  if (stock === undefined || stock < 0) {
    return NextResponse.json({ error: 'Invalid stock value' }, { status: 400 });
  }
  
  // Update the stock in the database
  const { data, error } = await supabase
    .from('products')
    .update({ stock })
    .eq('id', id)
    .select('id, name, stock');
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  if (!data || data.length === 0) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }
  
  // Log the stock update for audit purposes
  await supabase
    .from('inventory_logs')
    .insert({
      product_id: id,
      product_name: data[0].name,
      new_stock: stock,
      updated_at: new Date().toISOString(),
      // If we had user authentication, we could add user info here
    })
    .select();
  
  return NextResponse.json({ 
    success: true, 
    message: 'Stock updated successfully',
    data: data[0]
  });
}
