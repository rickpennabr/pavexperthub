export interface ActionResult<T = undefined> {
  ok: boolean
  error?: string
  data?: T
}

export interface AdminUser {
  username: string
  displayName: string
}

export interface AdminGate {
  ready: boolean
  hasAdmin: boolean
  user: AdminUser | null
  gateError?: string
  access?: 'ok' | 'signed-out' | 'forbidden'
}

export interface DashboardData {
  counts: {
    products: number
    services: number
    suppliers: number
    posts: number
    videos: number
  }
  products: Array<{
    base_product_id: number
    product_name: string
    product_type: string
    brand_name: string | null
  }>
  services: Array<{
    id: string
    name: string
    price: string
  }>
}

export interface ProductVariant {
  variant_id: number
  color_name: string | null
  size: string
  thickness_mm: string | null
  thickness_in: string | null
}

export interface AdminProduct {
  base_product_id: number
  product_name: string
  product_type: string
  product_note: string
  brand_name: string | null
  updated_at: string
  variants: ProductVariant[]
}

export interface AdminService {
  id: string
  name: string
  description: string
  price: string
  link: string
  details: string
  image_url: string
}

export interface SupplierBranch {
  id: string
  branch_name: string
  cross_street: string
  phone: string
  address: string
  is_main_branch: boolean
}

export interface AdminSupplier {
  id: string
  supplier_name: string
  created_at: string
  websites: Array<{ id: string; website_url: string }>
  branches: SupplierBranch[]
}

export interface AdminPost {
  id: string
  title: string
  excerpt: string
  body: string
  category: string
  author_name: string
  author_role: string
  tags: string[] | null
  read_time: string
  published: boolean
  created_at: string
}

export interface AdminVideo {
  id: string
  title: string
  description: string
  category: string
  video_url: string
  duration: string
  author_name: string
  author_role: string
  tags: string[] | null
  published: boolean
  created_at: string
}
