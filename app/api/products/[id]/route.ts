import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { supabase } from '@/lib/supabase';

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

// Get a single product
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  if (!data) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }
  
  return NextResponse.json(data);
}

// Update a product
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await currentUser();
  
  // Check if user is admin
  if (!user || !await isAdmin(user)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
  
  const id = params.id;
  const { name, description, price, image_url, category, stock, is_popular, is_new, discount, original_price } = await request.json();
  
  const { data, error } = await supabase
    .from('products')
    .update({
      name,
      description,
      price,
      image_url,
      category,
      stock,
      is_popular: is_popular !== undefined ? is_popular : true, // Maintain popular status or default to true
      is_new,
      discount,
      original_price
    })
    .eq('id', id)
    .select();
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json(data);
}

// Delete a product
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await currentUser();
  
  // Check if user is admin
  if (!user || !await isAdmin(user)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
  
  const id = params.id;
  
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json({ success: true });
}
