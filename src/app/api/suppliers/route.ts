import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseClient'
import { Branch, TransformedBranch } from '@/types/supplier'

export async function GET() {
  try {
    console.log('API Route - Starting branches fetch...');
    
    const { data, error } = await supabaseAdmin.client
      .from('supplier_branches')
      .select(`
        id,
        cross_street,
        branch_name,
        phone,
        address,
        supplier:suppliers(
          id,
          supplier_name,
          brand_logos(
            id,
            logo_url
          ),
          website:supplier_websites(
            website_url
          )
        ),
        materials:supplier_materials(
          hardscape_material:hardscape_materials(
            id,
            material_name
          )
        )
      `)
      .order('cross_street')

    if (error) {
      console.error('Error fetching branches:', error)
      return NextResponse.json(
        { error: 'Failed to fetch branches' },
        { status: 500 }
      )
    }

    // Transform the data to flatten the materials array and get the first website URL
    const transformedData = (data as unknown as Branch[]).map((branch): TransformedBranch => ({
      ...branch,
      supplier: {
        ...branch.supplier,
        materials: branch.materials
          .map(m => m.hardscape_material)
          .filter(Boolean), // Remove any null values
        website_url: branch.supplier.website?.[0]?.website_url
      }
    }))

    console.log('API Route - Transformed branches data:', JSON.stringify(transformedData, null, 2))
    return NextResponse.json(transformedData)
  } catch (error) {
    console.error('API route error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const { data, error } = await supabaseAdmin.client
      .from('supplier_branches')
      .insert([body])
      .select()
      .single()

    if (error) {
      console.error('Error creating branch:', error)
      return NextResponse.json(
        { error: 'Failed to create branch' },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('API route error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
} 