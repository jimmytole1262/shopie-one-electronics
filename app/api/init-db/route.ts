import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Add featured column if it doesn't exist
    const { error: alterError } = await supabase.rpc('add_column_if_not_exists', {
      table_name: 'products',
      column_name: 'featured',
      column_type: 'boolean',
      column_default: 'false'
    });

    if (alterError) {
      throw alterError;
    }

    // Add some sample products if the table is empty
    const { data: existingProducts } = await supabase
      .from('products')
      .select('id')
      .limit(1);

    if (!existingProducts || existingProducts.length === 0) {
      const sampleProducts = [
        {
          name: "Premium Wireless Headphones",
          price: 249.99,
          image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
          category: "Audio",
          featured: true,
          stock: 10,
          description: "High-quality wireless headphones with noise cancellation"
        },
        {
          name: "Wireless Earbuds Pro",
          price: 149.99,
          image_url: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=500&h=500&fit=crop",
          category: "Audio",
          featured: true,
          stock: 15,
          description: "Premium wireless earbuds with active noise cancellation"
        },
        {
          name: "Gaming Headset Elite",
          price: 199.99,
          image_url: "https://images.unsplash.com/photo-1600086827875-a63b01f1335c?w=500&h=500&fit=crop",
          category: "Gaming",
          featured: true,
          stock: 8,
          description: "Professional gaming headset with surround sound"
        }
      ];

      const { error: insertError } = await supabase
        .from('products')
        .insert(sampleProducts);

      if (insertError) {
        throw insertError;
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Database initialized successfully' 
    });

  } catch (error) {
    console.error('Database initialization error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to initialize database' },
      { status: 500 }
    );
  }
}
