import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('product_variants')
      .select(`
        *,
        color:colors(*),
        thickness:thicknesses(*),
        images:product_images(*)
      `)
      .order('product_name')

    if (error) {
      console.error('Error fetching products:', error)
      return NextResponse.json(
        { error: `Failed to fetch products: ${error.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (err) {
    console.error('API route error:', err)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
} 