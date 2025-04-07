import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { OrderDetails } from '@/lib/email-service';

// Create a transporter using Gmail
// For production, use environment variables for these credentials

/*
 * IMPORTANT: To make this work with Gmail, you need to:
 * 1. Enable 2-Step Verification on your Google account
 * 2. Generate an App Password:
 *    - Go to your Google Account > Security
 *    - Under "Signing in to Google", select "App passwords"
 *    - Select "Mail" as the app and "Other" as the device
 *    - Enter a name like "Shopie-one App"
 *    - Click "Generate"
 *    - Use the 16-character password that appears
 */

// For demonstration purposes, we'll use a more reliable approach
// that doesn't require actual email sending for now
let emailSent = false;

// This is a mock transporter for development
// In production, uncomment and configure this with your actual credentials
/*
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com', // Replace with your Gmail address
    pass: 'your-app-password',     // Replace with your Gmail app password
  },
});
*/

export async function POST(request: Request) {
  try {
    const orderDetails: OrderDetails = await request.json();
    
    // Generate the HTML email content
    const htmlContent = generateOrderConfirmationEmail(orderDetails);
    
    // In a production environment, you would send an actual email
    // For now, we'll simulate successful email sending
    
    // Set up email options (for reference)
    const mailOptions = {
      from: '"Shopie-one Electronics" <your-email@gmail.com>', // Replace with your email
      to: orderDetails.customerEmail,
      subject: `Order Confirmation #${orderDetails.orderReference}`,
      html: htmlContent,
    };
    
    // Simulate email sending
    // In production, uncomment this code and replace with actual credentials
    /*
    const info = await transporter.sendMail(mailOptions);
    const messageId = info.messageId;
    */
    
    // For development, we'll just simulate a successful send
    emailSent = true;
    const messageId = `simulated-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    
    // Log the email content to console for debugging
    console.log('Email would be sent with the following content:');
    console.log(`To: ${orderDetails.customerEmail}`);
    console.log(`Subject: Order Confirmation #${orderDetails.orderReference}`);
    console.log('HTML Content Preview:', htmlContent.substring(0, 300) + '...');
    
    return NextResponse.json({ 
      success: true, 
      message: 'Order confirmation email sent successfully (simulated)',
      messageId: messageId
    });
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send order confirmation email', error: String(error) },
      { status: 500 }
    );
  }
}

// Generate the HTML for the order confirmation email
function generateOrderConfirmationEmail(order: OrderDetails): string {
  // Format the order date
  const orderDate = new Date(order.orderDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Format the estimated delivery date
  const estimatedDelivery = new Date(order.estimatedDeliveryDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Generate product rows HTML
  const productRows = order.items.map(item => {
    const itemTotal = item.price * item.quantity;
    return `
      <div class="product-item" style="border: 1px solid #eee; border-radius: 4px; padding: 8px; display: flex; align-items: center; margin-bottom: 8px;">
        <img src="${item.image || 'https://via.placeholder.com/50'}" alt="${item.name}" class="product-image" style="width: 50px; height: 50px; object-fit: cover; margin-right: 10px;" />
        <div class="product-details" style="font-size: 12px;">
          <div class="product-name" style="font-weight: bold;">${item.name}</div>
          <div class="product-price">Ksh ${item.price.toLocaleString()}</div>
          <div class="product-qty">Qty: ${item.quantity}</div>
        </div>
      </div>
    `;
  }).join('');
  
  // Create a grid layout for products
  const productGrid = `
    <div class="product-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 10px; margin: 10px 0;">
      ${productRows}
    </div>
  `;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.4;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 15px;
            }
            .header {
                text-align: center;
                padding-bottom: 15px;
                border-bottom: 1px solid #eee;
            }
            .logo {
                max-width: 120px;
                margin-bottom: 10px;
            }
            .confirmation-message {
                font-size: 18px;
                margin: 15px 0 5px 0;
            }
            .order-number {
                color: #666;
                margin-bottom: 15px;
            }
            .section {
                margin: 15px 0;
            }
            .section-title {
                font-weight: bold;
                margin-bottom: 5px;
                color: #444;
            }
            .product-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 10px;
                margin: 10px 0;
            }
            .product-item {
                border: 1px solid #eee;
                border-radius: 4px;
                padding: 8px;
                display: flex;
                align-items: center;
            }
            .product-image {
                width: 50px;
                height: 50px;
                object-fit: cover;
                margin-right: 10px;
            }
            .product-details {
                font-size: 12px;
            }
            .product-name {
                font-weight: bold;
            }
            .summary-table {
                width: 100%;
                font-size: 13px;
                margin-top: 15px;
            }
            .summary-table td {
                padding: 3px 0;
            }
            .amount {
                text-align: right;
            }
            .total-row {
                font-weight: bold;
                font-size: 16px;
                padding-top: 5px;
            }
            .button {
                display: inline-block;
                background-color: #f60;
                color: white;
                padding: 8px 16px;
                text-decoration: none;
                border-radius: 4px;
                margin-top: 15px;
                font-size: 14px;
            }
            .footer {
                margin-top: 20px;
                padding-top: 15px;
                border-top: 1px solid #eee;
                font-size: 11px;
                color: #999;
                text-align: center;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <img src="https://via.placeholder.com/120x40" alt="Shopie-one Electronics" class="logo" />
        </div>

        <h1 class="confirmation-message">Order Confirmation</h1>
        <div class="order-number">Order #${order.orderReference} | ${orderDate}</div>
        
        <p>Thank you for your purchase, ${order.customerName}! Here's a summary of your order:</p>

        <div class="section">
            <div class="section-title">ITEMS PURCHASED</div>
            ${productGrid}
        </div>

        <div class="section">
            <div class="section-title">ORDER SUMMARY</div>
            <table class="summary-table">
                <tr>
                    <td>Subtotal</td>
                    <td class="amount">Ksh ${order.subtotal.toLocaleString()}</td>
                </tr>
                <tr>
                    <td>Shipping</td>
                    <td class="amount">Ksh ${order.shipping.toLocaleString()}</td>
                </tr>
                <tr>
                    <td>Tax (8%)</td>
                    <td class="amount">Ksh ${order.tax.toLocaleString()}</td>
                </tr>
                <tr class="total-row">
                    <td>Total</td>
                    <td class="amount">Ksh ${order.total.toLocaleString()}</td>
                </tr>
            </table>
        </div>

        <div class="section">
            <div class="section-title">DELIVERY INFORMATION</div>
            <p style="font-size: 13px; margin: 5px 0;">
                ${order.customerName}<br>
                Payment: Completed<br>
                Estimated delivery: ${estimatedDelivery}
            </p>
        </div>

        <center>
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/order/track?ref=${order.orderReference}" class="button">TRACK YOUR ORDER</a>
        </center>

        <div class="footer">
            <p>Questions? Contact us at jimmytole1262@gmail.com</p>
            <p>© ${new Date().getFullYear()} Shopie-one Electronics</p>
        </div>
    </body>
    </html>
  `;
}
