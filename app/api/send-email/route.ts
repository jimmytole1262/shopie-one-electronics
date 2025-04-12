import { NextResponse } from 'next/server';
import { OrderDetails } from '@/lib/email-service';
import nodemailer from 'nodemailer';

// Create a transporter using Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com', // Use environment variable or default
    pass: process.env.EMAIL_PASSWORD || 'your-app-password', // Use environment variable or default
  },
});

export async function POST(request: Request) {
  try {
    const orderDetails: OrderDetails = await request.json();
    
    // Generate a tracking number if not provided
    const trackingNumber = orderDetails.trackingNumber || `SP-${Math.floor(100000 + Math.random() * 900000)}`;
    
    // Format items for email
    const itemsList = orderDetails.items.map(item => 
      `<tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">KES ${(item.price * item.quantity).toLocaleString()}</td>
      </tr>`
    ).join('');
    
    // Create HTML email content
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #333;">Order Confirmation</h1>
          <p style="color: #666;">Thank you for your order!</p>
        </div>
        
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
          <p><strong>Order Reference:</strong> ${orderDetails.orderReference}</p>
          <p><strong>Tracking Number:</strong> ${trackingNumber}</p>
          <p><strong>Order Date:</strong> ${new Date(orderDetails.orderDate).toLocaleDateString()}</p>
          <p><strong>Estimated Delivery:</strong> ${new Date(orderDetails.estimatedDeliveryDate).toLocaleDateString()}</p>
        </div>
        
        <h2 style="color: #333; border-bottom: 2px solid #eee; padding-bottom: 10px;">Order Summary</h2>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="background-color: #f5f5f5;">
              <th style="padding: 10px; text-align: left;">Product</th>
              <th style="padding: 10px; text-align: center;">Quantity</th>
              <th style="padding: 10px; text-align: right;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsList}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold;">Subtotal:</td>
              <td style="padding: 10px; text-align: right;">KES ${orderDetails.subtotal.toLocaleString()}</td>
            </tr>
            <tr>
              <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold;">Shipping:</td>
              <td style="padding: 10px; text-align: right;">KES ${orderDetails.shipping.toLocaleString()}</td>
            </tr>
            <tr>
              <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold;">Tax (16%):</td>
              <td style="padding: 10px; text-align: right;">KES ${orderDetails.tax.toLocaleString()}</td>
            </tr>
            <tr style="background-color: #f9f9f9;">
              <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold; font-size: 16px;">Total:</td>
              <td style="padding: 10px; text-align: right; font-weight: bold; font-size: 16px;">KES ${orderDetails.total.toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>
        
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
          <h3 style="color: #333; margin-top: 0;">Shipping Address:</h3>
          <p style="margin-bottom: 0;">${orderDetails.shippingAddress}</p>
        </div>
        
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
          <h3 style="color: #333; margin-top: 0;">Payment Method:</h3>
          <p style="margin-bottom: 0;">${orderDetails.paymentMethod === 'card' ? 'Credit/Debit Card' : 'M-Pesa'}</p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p>You can track your order status using your tracking number.</p>
          <a href="http://localhost:3000/tracking?number=${trackingNumber}" style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Track Your Order</a>
        </div>
        
        <div style="text-align: center; margin-top: 30px; color: #666; font-size: 12px;">
          <p>If you have any questions, please contact our customer service at support@shopie-one.com</p>
          <p>Thank you for shopping with Shopie One Electronics!</p>
        </div>
      </div>
    `;
    
    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to: orderDetails.customerEmail,
      subject: `Order Confirmation - ${orderDetails.orderReference}`,
      html: htmlContent,
    };

    try {
      // Send email
      await transporter.sendMail(mailOptions);
      console.log('Email sent successfully to:', orderDetails.customerEmail);
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      // Continue with the response even if email fails
    }
    
    // Return success with tracking number
    return NextResponse.json({ 
      success: true, 
      message: 'Order confirmation email sent successfully',
      trackingNumber,
      orderDetails
    });
  } catch (error) {
    console.error('Error processing order:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send order confirmation email' },
      { status: 500 }
    );
  }
}
