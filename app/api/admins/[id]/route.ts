import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { supabase } from '@/lib/supabase';

// Admin email - this would typically be stored in environment variables
const ADMIN_EMAIL = 'jimmytole1262@gmail.com';

// Delete an admin
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
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
  
  // Check if trying to delete the default admin
  const { data: targetAdmin } = await supabase
    .from('admin_users')
    .select('email')
    .eq('id', params.id)
    .single();
    
  if (targetAdmin && targetAdmin.email === ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Cannot delete the default admin' }, { status: 403 });
  }
  
  // Delete the admin
  const { error } = await supabase
    .from('admin_users')
    .delete()
    .eq('id', params.id);
    
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json({ success: true });
}
