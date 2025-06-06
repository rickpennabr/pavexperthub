import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseKey)

interface Supplier {
  supplier_id: string
  name: string
  address: string
  lat: number
  lng: number
  types: string[]
  category: string
  description: string
  phone: string
  website: string
}

export async function createSupplier(supplier: Supplier) {
  const { data, error } = await supabase
    .from('suppliers')
    .insert([supplier])
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
} 