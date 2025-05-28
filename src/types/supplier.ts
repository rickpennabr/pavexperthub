export interface BrandLogo {
  id: string;
  logo_url: string;
}

export interface HardscapeMaterial {
  id: string;
  material_name: string;
}

export interface SupplierWebsite {
  website_url: string;
}

export interface Supplier {
  id: string;
  supplier_name: string;
  brand_logos: BrandLogo[];
  website?: SupplierWebsite[];
  address?: string;
  types: string[];
}

export interface SupplierMaterial {
  hardscape_material: HardscapeMaterial;
}

export interface Branch {
  id: string;
  cross_street: string;
  branch_name: string;
  phone?: string;
  address?: string;
  supplier: Supplier;
  materials: SupplierMaterial[];
}

export interface TransformedBranch extends Omit<Branch, 'materials' | 'supplier'> {
  supplier: {
    id: string;
    supplier_name: string;
    brand_logos: BrandLogo[];
    materials: HardscapeMaterial[];
    website_url?: string;
  };
}
