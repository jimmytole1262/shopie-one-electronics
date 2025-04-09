import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { phone, amount, orderReference } = await request.json();
    
    if (!phone || !amount || !orderReference) {
      return NextResponse.json(
        { success: false, message: 'Phone number, amount, and order reference are required' },
        { status: 400 }
      );
    }
    
    // Validate phone number format (should be a Kenyan number)
    const phoneRegex = /^(?:\+254|0)[17]\d{8}$/;
    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        { success: false, message: 'Invalid phone number format. Use format: +254XXXXXXXXX or 07XXXXXXXX' },
        { status: 400 }
      );
    }
    
    // In a real application, you would integrate with the M-Pesa API here
    // This is a simulation of the M-Pesa payment process
    console.log(`Processing M-Pesa payment of ${amount} from ${phone} for order ${orderReference}`);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate a random transaction ID
    const transactionId = `M-${Math.floor(100000 + Math.random() * 900000)}`;
    
    // Return success response
    return NextResponse.json({
      success: true,
      message: 'M-Pesa payment request initiated successfully',
      transactionId,
      orderReference
    });
  } catch (error) {
    console.error('Error processing M-Pesa payment:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process M-Pesa payment' },
      { status: 500 }
    );
  }
}
