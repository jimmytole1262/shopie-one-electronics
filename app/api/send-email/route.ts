import { NextResponse } from 'next/server';
import { OrderDetails } from '@/lib/email-service';

export async function POST(request: Request) {
  try {
    const orderDetails: OrderDetails = await request.json();
    
    // In a real application, you would send an actual email here
    // using a service like SendGrid, Mailgun, or AWS SES
    console.log('Sending email for order:', orderDetails.orderReference);
    
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate a tracking number if not provided
    const trackingNumber = orderDetails.trackingNumber || `SP-${Math.floor(100000 + Math.random() * 900000)}`;
    
    // Email content that would be sent
    const emailContent = `
      Dear ${orderDetails.customerName},
      
      Thank you for your order!
      
      Order Reference: ${orderDetails.orderReference}
      Tracking Number: ${trackingNumber}
      
      Your order is being processed and will be shipped soon.
      You can track your order status using the tracking number above.
      
      Order Summary:
      ${orderDetails.items.map(item => `- ${item.name} x${item.quantity}: KES ${item.price * item.quantity}`).join('\n')}
      
      Subtotal: KES ${orderDetails.subtotal}
      Shipping: KES ${orderDetails.shipping}
      Tax: KES ${orderDetails.tax}
      Total: KES ${orderDetails.total}
      
      Shipping Address:
      ${orderDetails.shippingAddress}
      
      If you have any questions, please contact our customer service.
      
      Thank you for shopping with Shopie One Electronics!
    `;
    
    console.log('Email content:', emailContent);
    
    // Return success with tracking number
    return NextResponse.json({ 
      success: true, 
      message: 'Order confirmation email sent successfully',
      trackingNumber,
      emailContent, // Include email content in response for testing
      orderDetails
    });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send order confirmation email' },
      { status: 500 }
    );
  }
}
