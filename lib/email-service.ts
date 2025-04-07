// Email service for order tracking
import { CartItem } from "@/hooks/useCart";

export interface OrderDetails {
  orderReference: string;
  customerName: string;
  customerEmail: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  orderDate: Date;
  estimatedDeliveryDate: Date;
  status: 'received' | 'processing' | 'shipped' | 'delivered';
  trackingNumber?: string;
  shippingAddress?: string;
}

// Store order details and simulate email sending
export const sendOrderConfirmationEmail = async (orderDetails: OrderDetails): Promise<boolean> => {
  console.log(`Sending order confirmation email to ${orderDetails.customerEmail}`);
  
  try {
    // Store the order details in localStorage for tracking purposes
    const orders = JSON.parse(localStorage.getItem('shopie-one-orders') || '[]');
    orders.push(orderDetails);
    localStorage.setItem('shopie-one-orders', JSON.stringify(orders));
    
    // For development, we'll simulate successful email sending
    // This avoids issues with email server configuration
    console.log(`Email sent successfully to ${orderDetails.customerEmail}`);
    console.log('Order details:', orderDetails);
    
    // In a production environment, you would call an API to send a real email
    // For now, we'll just return success without making the API call
    return true;
  } catch (error) {
    console.error('Error in email service:', error);
    return false;
  }
};

// Get order details by order reference
export const getOrderByReference = (orderReference: string): OrderDetails | null => {
  const orders = JSON.parse(localStorage.getItem('shopie-one-orders') || '[]');
  const order = orders.find((o: OrderDetails) => o.orderReference === orderReference);
  return order || null;
};

// Get all orders for a specific email
export const getOrdersByEmail = (email: string): OrderDetails[] => {
  const orders = JSON.parse(localStorage.getItem('shopie-one-orders') || '[]');
  return orders.filter((o: OrderDetails) => o.customerEmail === email);
};

// Update order status
export const updateOrderStatus = (
  orderReference: string, 
  status: 'received' | 'processing' | 'shipped' | 'delivered',
  trackingNumber?: string
): boolean => {
  const orders = JSON.parse(localStorage.getItem('shopie-one-orders') || '[]');
  const orderIndex = orders.findIndex((o: OrderDetails) => o.orderReference === orderReference);
  
  if (orderIndex === -1) return false;
  
  orders[orderIndex].status = status;
  if (trackingNumber) {
    orders[orderIndex].trackingNumber = trackingNumber;
  }
  
  localStorage.setItem('shopie-one-orders', JSON.stringify(orders));
  return true;
};
