export interface Product {
  product_id: string;
  product_name: string;
  product_description: string;
  product_price: number;
  product_image_thumbnail: string;
  product_brand: string;
  product_category: string;
  product_subcategory?: string;
  product_tags: string[];
  product_rating: number;
  product_reviews: number;
  product_in_stock: boolean;
  product_featured?: boolean;
  product_new?: boolean;
  product_sale?: boolean;
  product_sale_price?: number;
  product_colors?: string[];
  product_sizes?: string[];
  product_specifications?: Record<string, string>;
  product_related?: string[];
  color: string;
  size: string;
  thickness: string;
  sqft_pallet: number;
  sqft_layer: number;
} 