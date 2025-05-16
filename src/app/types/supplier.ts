export interface Supplier {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  types: string[];
  category?: string;
  subcategory?: string;
  description: string;
} 