// Supabase schema management utilities
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Function to check and create the products table with all required columns
export async function ensureProductsTableStructure() {
  if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase credentials are missing');
    return { success: false, error: 'Supabase credentials are missing' };
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    // First, check if the products table exists
    const { data: tableInfo, error: tableError } = await supabase
      .from('products')
      .select('*')
      .limit(1);
    
    if (tableError) {
      console.error('Error checking products table:', tableError);
      return { success: false, error: tableError };
    }
    
    // If we got here, the table exists. Now check what columns it has
    if (tableInfo && tableInfo.length > 0) {
      const existingColumns = Object.keys(tableInfo[0]);
      console.log('Existing columns in products table:', existingColumns);
      
      // Define the columns that should exist in the products table
      const requiredColumns = [
        'id', 'name', 'description', 'price', 'image_url', 'category', 'stock',
        'is_popular', 'is_new', 'discount', 'original_price', 'featured', 'created_at'
      ];
      
      // Check if any required columns are missing
      const missingColumns = requiredColumns.filter(col => !existingColumns.includes(col));
      
      if (missingColumns.length > 0) {
        console.log('Missing columns in products table:', missingColumns);
        return { 
          success: true, 
          message: 'Products table exists but is missing some columns',
          missingColumns,
          existingColumns
        };
      }
      
      return { 
        success: true, 
        message: 'Products table exists with all required columns',
        existingColumns
      };
    } else {
      console.log('Products table exists but is empty');
      return { 
        success: true, 
        message: 'Products table exists but is empty'
      };
    }
  } catch (error) {
    console.error('Error checking products table structure:', error);
    return { success: false, error };
  }
}

// Function to safely save a product to Supabase, handling missing columns
export async function saveProductToSupabase(product: any, isEditing: boolean = false) {
  if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase credentials are missing');
    return { success: false, error: 'Supabase credentials are missing' };
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    // First check the table structure
    const tableCheck = await ensureProductsTableStructure();
    
    if (!tableCheck.success) {
      return { success: false, error: tableCheck.error };
    }
    
    // Create a product object with only the columns that exist in the table
    const productData: Record<string, any> = {};
    
    // Always include these required fields
    productData.name = product.name;
    productData.description = product.description;
    productData.price = product.price;
    productData.image_url = product.image_url;
    productData.category = product.category;
    productData.stock = product.stock;
    
    // Only add optional fields if they exist in the table
    if (tableCheck.existingColumns) {
      if (tableCheck.existingColumns.includes('is_popular') && product.is_popular !== undefined) {
        productData.is_popular = product.is_popular;
      }
      
      if (tableCheck.existingColumns.includes('is_new') && product.is_new !== undefined) {
        productData.is_new = product.is_new;
      }
      
      if (tableCheck.existingColumns.includes('discount') && product.discount !== undefined) {
        productData.discount = product.discount;
      }
      
      if (tableCheck.existingColumns.includes('original_price') && product.original_price !== undefined) {
        productData.original_price = product.original_price;
      }
      
      if (tableCheck.existingColumns.includes('featured') && product.featured !== undefined) {
        productData.featured = product.featured;
      }
    }
    
    console.log('Saving product with data:', productData);
    
    if (isEditing && product.id) {
      // Update existing product
      const { data, error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', product.id)
        .select();
      
      if (error) {
        console.error('Supabase update error:', error);
        return { success: false, error };
      }
      
      return { success: true, data };
    } else {
      // Create new product
      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select();
      
      if (error) {
        console.error('Supabase insert error:', error);
        return { success: false, error };
      }
      
      return { success: true, data };
    }
  } catch (error) {
    console.error('Error saving product to Supabase:', error);
    return { success: false, error };
  }
}
