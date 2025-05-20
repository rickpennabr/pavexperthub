export interface Supplier {
  id: string;
  supplier_id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  types: string[];
  category?: string;
  subcategory?: string;
  description?: string;
  phone?: string;
  website?: string;
  created_at: string;
  updated_at: string;
  user_id?: string;
} 