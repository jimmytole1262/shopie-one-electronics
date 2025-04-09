import { NextResponse } from 'next/server';
import { OrderDetails } from '@/lib/email-service';

export async function POST(request: Request) {
  try {
    const orderDetails: OrderDetails = await request.json();
    
    // Store order in localStorage (client-side storage)
    // This is handled in the frontend after API response
    
    // In a real application, you would send an actual email here
    // using a service like SendGrid, Mailgun, or AWS SES
    console.log('Sending email for order:', orderDetails.orderReference);
    
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate a random tracking number
    const trackingNumber = `SP-${Math.floor(100000 + Math.random() * 900000)}`;
    
    // Return success with tracking number
    return NextResponse.json({ 
      success: true, 
      message: 'Order confirmation email sent successfully',
      trackingNumber,
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
