import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Sample product data
const products = [
  {
    name: 'Wireless Headphones',
    description: 'Premium wireless headphones with noise cancellation and 30-hour battery life.',
    price: 16899,
    image_url: '/images/products/wireless-headphones.jpg',
    category: 'Audio',
    stock: 25
  },
  {
    name: 'Smart Watch Pro',
    description: 'Advanced smartwatch with health tracking, GPS, and a beautiful AMOLED display.',
    price: 25999,
    image_url: '/images/products/smartwatch.jpg',
    category: 'Wearables',
    stock: 15
  },
  {
    name: 'Bluetooth Speaker',
    description: 'Portable bluetooth speaker with 360° sound and 20-hour battery life.',
    price: 9359,
    image_url: '/images/products/bluetooth-speaker.jpg',
    category: 'Audio',
    stock: 30
  },
  {
    name: 'Wireless Earbuds',
    description: 'True wireless earbuds with active noise cancellation and touch controls.',
    price: 12499,
    image_url: '/images/products/wireless-earbuds.jpg',
    category: 'Audio',
    stock: 40
  },
  {
    name: 'Fitness Tracker',
    description: 'Lightweight fitness tracker with heart rate monitoring and sleep tracking.',
    price: 5999,
    image_url: '/images/products/fitness-tracker.jpg',
    category: 'Wearables',
    stock: 50
  }
];

export async function GET() {
  try {
    // Clear existing products
    await supabase.from('products').delete().neq('id', 0);
    
    // Insert new products
    const { data, error } = await supabase.from('products').insert(products).select();
    
    if (error) {
      console.error('Error seeding products:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ 
      message: 'Database seeded successfully', 
      products: data 
    });
  } catch (error) {
    console.error('Error in seed route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
