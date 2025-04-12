# Vercel Deployment Guide for Shopie One Electronics

This guide will help you deploy your Shopie One Electronics project to Vercel without errors.

## Prerequisites

1. A GitHub account (already set up with your repository)
2. A Vercel account (sign up at [vercel.com](https://vercel.com))
3. Your Supabase and Clerk credentials

## Step 1: Prepare Your Project

✅ We've already fixed the `next.config.mjs` file by removing the deprecated `serverComponents` option.

## Step 2: Set Up Environment Variables

You'll need to set up the following environment variables in Vercel:

```
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Email Configuration (if using email services)
EMAIL_SERVICE_ID=your_email_service_id
EMAIL_TEMPLATE_ID=your_email_template_id
EMAIL_USER_ID=your_email_user_id
EMAIL_JS_PUBLIC_KEY=your_email_js_public_key

# Admin Email
ADMIN_EMAIL=jimmytole1262@gmail.com
```

## Step 3: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with your GitHub account
2. Click "Add New..." and select "Project"
3. Find your "shopie-one-electronics" repository and click "Import"
4. Configure your project:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: next build
   - Output Directory: .next
5. Expand "Environment Variables" and add all the variables listed in Step 2
6. Click "Deploy"

## Step 4: Verify Deployment

1. Once deployment is complete, Vercel will provide you with a URL (e.g., `shopie-one-electronics.vercel.app`)
2. Visit the URL and test all functionality:
   - Dashboard products page (verify stock and images display correctly)
   - Shopping cart
   - Checkout process
   - User authentication

## Troubleshooting Common Issues

### 1. Images Not Loading
- Ensure your image paths are correct
- Check that Supabase storage is properly configured
- Verify the `images` configuration in `next.config.mjs`

### 2. API Routes Not Working
- Check environment variables are correctly set in Vercel
- Verify API endpoints are using the correct URL format
- Ensure Supabase connection is working

### 3. Authentication Issues
- Verify Clerk domains are configured correctly
- Check that all Clerk environment variables are set

## Maintaining Your Deployment

1. **Automatic Deployments**: Vercel will automatically deploy new changes when you push to your GitHub repository
2. **Preview Deployments**: Each pull request will get its own preview deployment
3. **Rollbacks**: You can roll back to previous deployments if needed

## Production Optimizations

1. **Custom Domain**: Add your own domain in the Vercel dashboard
2. **Performance Monitoring**: Enable Vercel Analytics
3. **Edge Functions**: Consider using Vercel Edge Functions for improved performance

Remember to never commit sensitive environment variables to your repository. Always use Vercel's environment variable management for production deployments.
