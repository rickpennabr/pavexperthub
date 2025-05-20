import { createSupplier } from '../src/services/supabaseService'

const ewingSupplier = {
  supplier_id: 'EWING-001',
  name: 'Ewing Supplier',
  address: '123 Ewing St, Las Vegas, NV 89101',
  lat: 36.1699,
  lng: -115.1398,
  types: ['Pavers', 'Landscaping Materials', 'Irrigation'],
  category: 'Landscape Supply',
  description: 'Full-service landscape supply company',
  phone: '(702) 555-0123',
  website: 'https://www.ewing.com'
}

async function main() {
  try {
    const supplier = await createSupplier(ewingSupplier)
    console.log('Successfully added Ewing Supplier:', supplier)
  } catch (error) {
    console.error('Failed to add Ewing Supplier:', error)
  }
}

main() 