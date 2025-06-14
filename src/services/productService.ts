// ============================================================================
// Product Service
// Handles all product-related API calls and data transformations
// ============================================================================

// Dependencies
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Types
export interface ProductWithDetails {
  base_product_id: number;
  product_name: string;
  product_type: string;
  product_note: string;
  created_at: string;
  updated_at: string;
  brand?: {
    brand_name: string;
  };
  variants?: Array<{
    color?: {
      color_name: string;
    };
    size?: string;
    thickness?: {
      thickness_mm: string;
      thickness_in: string;
    };
    sqft_pallet?: number;
    sqft_layer?: number;
    lnft_pallet?: number;
    layer_pallet?: number;
    pcs_pallet?: number;
    images?: Array<{
      image_path: string;
    }>;
  }>;
}

interface ServiceResponse<T> {
  data: T | null;
  error: string | null;
}

// Get all products with their details
export async function getProducts(): Promise<ServiceResponse<ProductWithDetails[]>> {
  try {
  const { data, error } = await supabase
    .from('base_products')
    .select(`
      *,
        brand:brands(brand_name),
      variants:product_variants(
          color:colors(color_name),
          size,
          thickness:thicknesses(thickness_mm, thickness_in),
          sqft_pallet,
          sqft_layer,
          lnft_pallet,
          layer_pallet,
          pcs_pallet,
          images:product_images(image_path)
      )
    `)
      .order('product_name');

  if (error) {
      console.error('Error fetching products:', error);
      return { data: null, error: error.message };
    }

    return { data: data as ProductWithDetails[], error: null };
  } catch (error) {
    console.error('Error in getProducts:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    };
  }
}

// Get a single product by ID
export async function getProductById(id: string): Promise<ServiceResponse<ProductWithDetails>> {
  try {
  const { data, error } = await supabase
    .from('base_products')
    .select(`
      *,
        brand:brands(brand_name),
      variants:product_variants(
          color:colors(color_name),
          size,
          thickness:thicknesses(thickness_mm, thickness_in),
          sqft_pallet,
          sqft_layer,
          lnft_pallet,
          layer_pallet,
          pcs_pallet,
          images:product_images(image_path)
      )
    `)
      .eq('base_product_id', id)
      .single();

  if (error) {
      console.error('Error fetching product:', error);
      return { data: null, error: error.message };
  }

    return { data: data as ProductWithDetails, error: null };
  } catch (error) {
    console.error('Error in getProductById:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    };
  }
}

// Get all unique product types
export async function getProductTypes(): Promise<ServiceResponse<string[]>> {
  try {
    const { data, error } = await supabase
      .from('base_products')
      .select('product_type')
      .not('product_type', 'is', null)
      .order('product_type');

    if (error) {
      console.error('Error fetching product types:', error);
      return { data: null, error: error.message };
    }

    // Get unique product types and filter out null/undefined
    const uniqueTypes = Array.from(new Set(data.map(item => item.product_type).filter(Boolean)));
    return { data: uniqueTypes, error: null };
  } catch (error) {
    console.error('Error in getProductTypes:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    };
  }
}

// Get all brands
export async function getBrands(): Promise<ServiceResponse<{ brand_id: number; brand_name: string }[]>> {
  try {
    const { data, error } = await supabase
      .from('brands')
      .select('brand_id, brand_name')
      .order('brand_name');

    if (error) {
      console.error('Error fetching brands:', error);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error in getBrands:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    };
  }
}

// Get all unique thicknesses
export async function getThicknesses(): Promise<ServiceResponse<{ thickness_mm: string; thickness_in: string }[]>> {
  try {
    const { data, error } = await supabase
      .from('thicknesses')
      .select('thickness_mm, thickness_in')
      .order('thickness_mm');

    if (error) {
      console.error('Error fetching thicknesses:', error);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error in getThicknesses:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    };
  }
}

// Get all unique colors
export async function getColors(): Promise<ServiceResponse<{ color_id: number; color_name: string }[]>> {
  try {
    const { data, error } = await supabase
      .from('colors')
      .select('color_id, color_name')
      .order('color_name');

    if (error) {
      console.error('Error fetching colors:', error);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error in getColors:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    };
  }
} 