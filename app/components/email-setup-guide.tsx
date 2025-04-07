"use client"

import { useState } from "react"
import { motion } from "framer-motion"

export default function EmailSetupGuide() {
  const [step, setStep] = useState(1)
  
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Email Service Setup Guide</h1>
      
      <div className="mb-8">
        <div className="flex items-center mb-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= i ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-600"
              }`}>
                {i}
              </div>
              {i < 4 && (
                <div className={`h-1 w-16 ${step > i ? "bg-orange-500" : "bg-gray-200"}`}></div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <motion.div
        key={step}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        {step === 1 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Step 1: Create an EmailJS Account</h2>
            <ol className="list-decimal pl-6 space-y-4 mb-6">
              <li>Go to <a href="https://www.emailjs.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">EmailJS.com</a> and sign up for a free account</li>
              <li>Verify your email address</li>
              <li>Log in to your EmailJS dashboard</li>
            </ol>
            <img src="/placeholder.svg?height=200&width=400" alt="EmailJS Signup" className="rounded-lg border mb-6" />
          </div>
        )}
        
        {step === 2 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Step 2: Create an Email Service</h2>
            <ol className="list-decimal pl-6 space-y-4 mb-6">
              <li>In your EmailJS dashboard, go to "Email Services"</li>
              <li>Click "Add New Service"</li>
              <li>Select your email provider (Gmail, Outlook, etc.)</li>
              <li>Follow the authentication steps</li>
              <li>Name your service (e.g., "Shopie-one-emails")</li>
              <li>Save your service and note down the Service ID</li>
            </ol>
            <img src="/placeholder.svg?height=200&width=400" alt="EmailJS Service Setup" className="rounded-lg border mb-6" />
          </div>
        )}
        
        {step === 3 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Step 3: Create an Email Template</h2>
            <ol className="list-decimal pl-6 space-y-4 mb-6">
              <li>In your EmailJS dashboard, go to "Email Templates"</li>
              <li>Click "Create New Template"</li>
              <li>Name your template (e.g., "order-confirmation")</li>
              <li>Copy and paste the HTML template below into the template editor</li>
              <li>Save your template and note down the Template ID</li>
            </ol>
            <div className="bg-gray-100 p-4 rounded-lg mb-6 overflow-auto max-h-80">
              <pre className="text-xs">
{`<!DOCTYPE html>
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
    <div class="order-number">Order #{{order_reference}} | {{order_date}}</div>
    
    <p>Thank you for your purchase, {{to_name}}! Here's a summary of your order:</p>

    <div class="section">
        <div class="section-title">ITEMS PURCHASED</div>
        <div class="product-grid" id="product-container">
            <!-- Products will be inserted here dynamically -->
        </div>
    </div>

    <div class="section">
        <div class="section-title">ORDER SUMMARY</div>
        <table class="summary-table">
            <tr>
                <td>Subtotal</td>
                <td class="amount">Ksh {{subtotal}}</td>
            </tr>
            <tr>
                <td>Shipping</td>
                <td class="amount">Ksh {{shipping}}</td>
            </tr>
            <tr>
                <td>Tax (8%)</td>
                <td class="amount">Ksh {{tax}}</td>
            </tr>
            <tr class="total-row">
                <td>Total</td>
                <td class="amount">Ksh {{total}}</td>
            </tr>
        </table>
    </div>

    <div class="section">
        <div class="section-title">DELIVERY INFORMATION</div>
        <p style="font-size: 13px; margin: 5px 0;">
            {{to_name}}<br>
            Payment: Completed<br>
            Estimated delivery: {{estimated_delivery}}
        </p>
    </div>

    <center>
        <a href="{{tracking_url}}" class="button">TRACK YOUR ORDER</a>
    </center>

    <div class="footer">
        <p>Questions? Contact us at jimmytole1262@gmail.com</p>
        <p>© 2025 Shopie-one Electronics</p>
    </div>

    <script>
        // This script will run in EmailJS to populate products
        try {
            const productContainer = document.getElementById('product-container');
            const items = JSON.parse('{{items_json}}');
            
            items.forEach(item => {
                const productDiv = document.createElement('div');
                productDiv.className = 'product-item';
                productDiv.innerHTML = \`
                    <img src="\${item.image}" alt="\${item.name}" class="product-image" />
                    <div class="product-details">
                        <div class="product-name">\${item.name}</div>
                        <div class="product-price">Ksh \${item.price.toLocaleString()}</div>
                        <div class="product-qty">Qty: \${item.quantity}</div>
                    </div>
                \`;
                productContainer.appendChild(productDiv);
            });
        } catch (error) {
            console.error('Error parsing items:', error);
        }
    </script>
</body>
</html>`}
              </pre>
            </div>
          </div>
        )}
        
        {step === 4 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Step 4: Update Your Code</h2>
            <ol className="list-decimal pl-6 space-y-4 mb-6">
              <li>Open the file <code className="bg-gray-100 px-2 py-1 rounded">lib/email-service.ts</code></li>
              <li>Replace the placeholder values with your actual EmailJS credentials:
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li><code className="bg-gray-100 px-2 py-1 rounded">YOUR_PUBLIC_KEY</code> with your EmailJS public key</li>
                  <li><code className="bg-gray-100 px-2 py-1 rounded">YOUR_SERVICE_ID</code> with your EmailJS service ID</li>
                  <li><code className="bg-gray-100 px-2 py-1 rounded">YOUR_TEMPLATE_ID</code> with your EmailJS template ID</li>
                </ul>
              </li>
              <li>Save the file and restart your development server</li>
            </ol>
            <div className="bg-gray-100 p-4 rounded-lg mb-6">
              <pre className="text-xs">
{`// Initialize EmailJS with your public key
emailjs.init('YOUR_PUBLIC_KEY'); // Replace with your actual EmailJS public key

// Send the email using EmailJS
const response = await emailjs.send(
  'YOUR_SERVICE_ID', // Replace with your EmailJS service ID
  'YOUR_TEMPLATE_ID', // Replace with your EmailJS template ID
  templateParams
);`}
              </pre>
            </div>
          </div>
        )}
      </motion.div>
      
      <div className="flex justify-between mt-8">
        <button
          onClick={() => setStep(prev => Math.max(prev - 1, 1))}
          className={`px-4 py-2 rounded-md ${
            step === 1 ? "bg-gray-200 text-gray-500" : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
          disabled={step === 1}
        >
          Previous
        </button>
        
        <button
          onClick={() => setStep(prev => Math.min(prev + 1, 4))}
          className={`px-4 py-2 rounded-md ${
            step === 4 ? "bg-gray-200 text-gray-500" : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
          disabled={step === 4}
        >
          Next
        </button>
      </div>
    </div>
  )
}
