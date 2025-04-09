# Shopie One Electronics

An e-commerce platform built with Next.js, Supabase, and modern web technologies.

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Fill in your Supabase credentials:
     - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
   
   You can find these credentials in your Supabase project settings under Project Settings > API.

4. Run the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

The following environment variables are required:

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key

Make sure to create a `.env` file with these variables before starting the application.

## Important Notes

- Never commit your `.env` file to version control
- Always use the `.env.example` file to document required environment variables
- When deploying, make sure to set up these environment variables in your hosting platform
