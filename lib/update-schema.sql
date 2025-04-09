-- Simple SQL script to update products table schema
-- For Supabase PostgreSQL database

-- Add discount column
ALTER TABLE products ADD discount INTEGER DEFAULT 0;

-- Add original_price column
ALTER TABLE products ADD original_price DECIMAL(10, 2);

-- Add is_new column
ALTER TABLE products ADD is_new BOOLEAN DEFAULT false;

-- Add is_popular column
ALTER TABLE products ADD is_popular BOOLEAN DEFAULT false;

-- Add featured column
ALTER TABLE products ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;
