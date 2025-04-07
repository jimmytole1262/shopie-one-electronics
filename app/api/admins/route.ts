import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { supabase } from '@/lib/supabase';

// Admin email - this would typically be stored in environment variables
const ADMIN_EMAIL = 'jimmytole1262@gmail.com';

// Get all admins
export async function GET(request: Request) {
  const user = await currentUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  
  // Check if user is an admin
  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('*')
    .eq('email', user.emailAddresses[0].emailAddress)
    .single();
    
  if (!adminUser && user.emailAddresses[0].emailAddress !== ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
  }
  
  // Get all admins
  const { data: admins, error } = await supabase
    .from('admin_users')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json(admins);
}

// Add a new admin
export async function POST(request: Request) {
  const user = await currentUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  
  // Check if user is an admin
  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('*')
    .eq('email', user.emailAddresses[0].emailAddress)
    .single();
    
  if (!adminUser && user.emailAddresses[0].emailAddress !== ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
  }
  
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }
    
    // Check if already an admin
    const { data: existingAdmin } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', email)
      .single();
      
    if (existingAdmin) {
      return NextResponse.json({ error: 'User is already an admin' }, { status: 400 });
    }
    
    // Add to admin_users table
    const { data, error } = await supabase
      .from('admin_users')
      .insert({
        user_id: 'manual-entry',
        email: email,
        role: 'admin'
      })
      .select()
      .single();
      
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error adding admin:', error);
    return NextResponse.json({ error: 'Failed to add admin' }, { status: 500 });
  }
}
