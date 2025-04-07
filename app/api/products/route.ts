import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { currentUser } from '@clerk/nextjs/server';

// Admin email - this would typically be stored in environment variables
const ADMIN_EMAIL = 'jimmytole1262@gmail.com';

// Helper function to check if user is admin
async function isAdmin(user: any) {
  if (!user) return false;
  
  // Check if user is the primary admin
  if (user.emailAddresses[0].emailAddress === ADMIN_EMAIL) {
    return true;
  }
  
  // Check if user exists in admin_users table
  const { data } = await supabase
    .from('admin_users')
    .select('*')
    .eq('email', user.emailAddresses[0].emailAddress)
    .single();
  
  return !!data;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const category = url.searchParams.get('category');
  const query = url.searchParams.get('query');
  const isPopular = url.searchParams.get('isPopular');
  
  let supabaseQuery = supabase.from('products').select('*');
  
  if (category) {
    supabaseQuery = supabaseQuery.eq('category', category);
  }
  
  if (query) {
    supabaseQuery = supabaseQuery.ilike('name', `%${query}%`);
  }
  
  if (isPopular === 'true') {
    supabaseQuery = supabaseQuery.eq('is_popular', true);
  }
  
  const { data, error } = await supabaseQuery;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const user = await currentUser();
  
  // Check if user is admin
  if (!user || !await isAdmin(user)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
  
  try {
    const productData = await request.json();
    
    // Create a minimal product object with only the required fields
    // This avoids schema cache issues by only using core fields
    const productToInsert = {
      name: productData.name,
      description: productData.description,
      price: productData.price,
      image_url: productData.image_url,
      category: productData.category,
      stock: productData.stock || 0
    };
    
    console.log('Inserting product with data:', productToInsert);
    
    // Insert the product with only the required fields
    const { data, error } = await supabase
      .from('products')
      .insert(productToInsert)
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    // If successful, update with additional fields in a separate query
    if (data && data.length > 0) {
      const productId = data[0].id;
      
      // Update with additional fields
      const updateFields: Record<string, any> = {
        // Set default values
        is_popular: true,
        is_new: true
      };
      
      // Override with values from request if they exist
      if (productData.is_popular !== undefined) {
        updateFields.is_popular = productData.is_popular;
      }
      
      if (productData.is_new !== undefined) {
        updateFields.is_new = productData.is_new;
      }
      
      // Try to update with additional fields
      try {
        await supabase
          .from('products')
          .update(updateFields)
          .eq('id', productId);
          
        console.log('Updated product with additional fields:', updateFields);
      } catch (updateError) {
        console.error('Error updating additional fields:', updateError);
        // Continue even if this fails - we already have the product created
      }
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 400 });
  }
}