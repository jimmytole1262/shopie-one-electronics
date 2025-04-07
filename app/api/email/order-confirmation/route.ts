import { NextResponse } from 'next/server';
import { OrderDetails } from '@/lib/email-service';

// This is a simulated email API endpoint
// In a real application, this would connect to an email service provider

export async function POST(request: Request) {
  try {
    const orderDetails: OrderDetails = await request.json();
    
    // In a real implementation, you would:
    // 1. Validate the order details
    // 2. Generate the HTML email using the template
    // 3. Send the email using your email service provider
    
    // For demonstration, we'll just return a success response
    return NextResponse.json({ 
      success: true, 
      message: 'Order confirmation email sent successfully',
      emailHtml: generateOrderConfirmationEmail(orderDetails)
    });
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send order confirmation email' },
      { status: 500 }
    );
  }
}

// Generate the HTML for the order confirmation email
function generateOrderConfirmationEmail(order: OrderDetails): string {
  const productRows = order.items.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
        <div style="display: flex; align-items: center;">
          <img src="${item.image || 'https://via.placeholder.com/50'}" alt="${item.name}" width="50" height="50" style="border-radius: 4px; margin-right: 12px;" />
          <div>
            <p style="margin: 0; font-weight: 500;">${item.name}</p>
            <p style="margin: 0; color: #6b7280; font-size: 14px;">Qty: ${item.quantity}</p>
          </div>
        </div>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 500;">
        KES ${(item.price * item.quantity).toLocaleString()}
      </td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation - Shopie-one Electronics</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9fafb; color: #111827;">
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width: 600px; margin: 0 auto;">
        <tr>
          <td style="padding: 24px 0; text-align: center; background-color: #f97316;">
            <h1 style="margin: 0; color: white; font-size: 24px;">Shopie-one Electronics</h1>
          </td>
        </tr>
        <tr>
          <td style="background-color: white; padding: 32px 24px; border-radius: 0 0 8px 8px; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);">
            <h2 style="margin: 0 0 24px; font-size: 20px; font-weight: 600;">Order Confirmation</h2>
            
            <p style="margin: 0 0 16px; color: #4b5563;">
              Hello ${order.customerName},
            </p>
            
            <p style="margin: 0 0 24px; color: #4b5563;">
              Thank you for your order! We're pleased to confirm that we've received your order and it's being processed.
            </p>
            
            <div style="margin-bottom: 24px; padding: 16px; background-color: #f3f4f6; border-radius: 8px;">
              <p style="margin: 0 0 8px; font-weight: 500;">Order Reference:</p>
              <p style="margin: 0; font-size: 18px; font-weight: 600;">${order.orderReference}</p>
            </div>
            
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px; border-collapse: collapse;">
              <tr>
                <th style="text-align: left; padding: 12px; background-color: #f3f4f6; border-top-left-radius: 8px;">Item</th>
                <th style="text-align: right; padding: 12px; background-color: #f3f4f6; border-top-right-radius: 8px;">Price</th>
              </tr>
              ${productRows}
            </table>
            
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 32px;">
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Subtotal</td>
                <td style="padding: 8px 0; text-align: right;">KES ${order.subtotal.toLocaleString()}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Shipping</td>
                <td style="padding: 8px 0; text-align: right;">KES ${order.shipping.toLocaleString()}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Tax (8%)</td>
                <td style="padding: 8px 0; text-align: right;">KES ${order.tax.toLocaleString()}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; font-weight: 600; border-top: 2px solid #e5e7eb;">Total</td>
                <td style="padding: 12px 0; text-align: right; font-weight: 600; font-size: 18px; border-top: 2px solid #e5e7eb;">KES ${order.total.toLocaleString()}</td>
              </tr>
            </table>
            
            <div style="text-align: center; margin-bottom: 32px;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/order/track?ref=${order.orderReference}" style="display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: white; text-decoration: none; font-weight: 500; border-radius: 6px;">
                Track Your Order
              </a>
            </div>
            
            <p style="margin: 0 0 8px; color: #4b5563;">
              If you have any questions about your order, please contact our customer service team at <a href="mailto:jimmytole1262@gmail.com" style="color: #3b82f6; text-decoration: none;">jimmytole1262@gmail.com</a> or call us at 0711692245.
            </p>
            
            <p style="margin: 0; color: #4b5563;">
              Thank you for shopping with Shopie-one Electronics!
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding: 24px; text-align: center; color: #6b7280; font-size: 14px;">
            <p style="margin: 0 0 8px;">
              &copy; ${new Date().getFullYear()} Shopie-one Electronics. All rights reserved.
            </p>
            <p style="margin: 0;">
              This email was sent to you because you made a purchase on our website.
            </p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}
