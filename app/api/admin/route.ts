import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { supabase } from '@/lib/supabase';

// Admin email - this would typically be stored in environment variables
const ADMIN_EMAIL = 'jimmytole1262@gmail.com';

export async function GET(request: Request) {
  try {
    const user = await currentUser();
    
    if (!user || !user.emailAddresses || user.emailAddresses.length === 0) {
      console.log('No authenticated user or email found');
      return NextResponse.json({ isAdmin: false, message: 'Not authenticated' }, { status: 401 });
    }
    
    const userEmail = user.emailAddresses[0].emailAddress;
    console.log('Checking admin status for:', userEmail);
    
    // First check if the email matches the hardcoded admin email
    if (userEmail === ADMIN_EMAIL) {
      console.log('User matches hardcoded admin email');
      
      // Check if user already exists in admin_users table
      const { data: existingAdmin, error: queryError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', userEmail)
        .single();
      
      // If not in database, add them
      if (!existingAdmin) {
        console.log('Adding default admin to database');
        const { data: newAdmin, error: insertError } = await supabase
          .from('admin_users')
          .insert({
            user_id: user.id,
            email: userEmail,
            role: 'admin'
          })
          .select();
          
        if (insertError) {
          console.error('Error adding default admin:', insertError);
          // Even if DB insert fails, still grant admin access since email matches
        }
      }
      
      return NextResponse.json({ isAdmin: true, message: 'Admin access granted' });
    }
    
    // If not the default admin, check if they're in the admin_users table
    const { data: adminUser, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', userEmail)
      .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 is the "not found" error code
      console.error('Error checking admin status:', error);
    }
    
    return NextResponse.json({ 
      isAdmin: !!adminUser,
      message: adminUser ? 'Admin access granted' : 'Not an admin'
    });
  } catch (error) {
    console.error('Unexpected error in admin check:', error);
    return NextResponse.json({ isAdmin: false, message: 'Server error' }, { status: 500 });
  }
}

// Add a new admin user
export async function POST(request: Request) {
  const user = await currentUser();
  
  if (!user) {
    return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
  }
  
  // Check if the current user is an admin
  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('*')
    .eq('email', user.emailAddresses[0].emailAddress)
    .single();
    
  // Only admins can add other admins
  if (!adminUser && user.emailAddresses[0].emailAddress !== ADMIN_EMAIL) {
    return NextResponse.json({ success: false, message: 'Not authorized to add admins' }, { status: 403 });
  }
  
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json({ success: false, message: 'Email is required' }, { status: 400 });
    }
    
    // Check if already an admin
    const { data: existingAdmin } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', email)
      .single();
      
    if (existingAdmin) {
      return NextResponse.json({ success: false, message: 'User is already an admin' }, { status: 400 });
    }
    
    // Add to admin_users table
    const { data: newAdmin, error } = await supabase
      .from('admin_users')
      .insert({
        user_id: 'manual-entry', // Since we don't have access to Clerk's user list, we'll use a placeholder
        email: email,
        role: 'admin'
      });
      
    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ success: true, message: 'Admin added successfully' });
  } catch (error) {
    console.error('Error adding admin:', error);
    return NextResponse.json({ success: false, message: 'Failed to add admin' }, { status: 500 });
  }
}
