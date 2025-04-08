import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define public routes that don't require authentication
const publicPaths = [
  '/',
  '/shop',
  '/products(.*)',
  '/about-us',
  '/contact',
  '/api/products(.*)',  // Allow all product API routes to be public for now
  '/api/admin(.*)',
  '/api/admins(.*)',
  '/admin(.*)',        // Allow admin routes to be public for debugging
  '/seller-dashboard(.*)' // Allow seller dashboard to be public for debugging
];

export default clerkMiddleware(async (auth, req) => {
  // Get the pathname of the request
  const { pathname } = new URL(req.url);
  
  // Check if the path is public
  if (publicPaths.some(path => {
    const regex = new RegExp(`^${path.replace(/\(.*\)/g, '.*')}$`);
    return regex.test(pathname);
  })) {
    return NextResponse.next();
  }
  
  // For seller dashboard, we need to check if user is authenticated first
  if (pathname.startsWith('/seller-dashboard')) {
    const authObj = await auth();
    if (!authObj.userId) {
      return NextResponse.redirect(new URL('/sign-in', req.url));
    }
    
    // Allow the request to proceed - the page will handle admin check internally
    return NextResponse.next();
  }
  
  // For all other routes, proceed with authentication
  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};