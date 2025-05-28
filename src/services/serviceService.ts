import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseKey)

export interface Service {
  id?: string
  name: string
  description: string
  price: string
  link: string
  details: string
}

export async function getServices() {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('name')

  if (error) {
    throw error
  }

  return data as Service[]
}

// This function is only used by the populate script
export async function createService(service: Service) {
  const { data, error } = await supabase
    .from('services')
    .insert([service])
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
} 