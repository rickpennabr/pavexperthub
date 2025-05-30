import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import { Branch, TransformedBranch } from '@/types/supplier'

export async function GET() {
  try {
    console.log('API Route - Starting branches fetch...');
    
    const { data, error } = await supabase
      .from('supplier_branches')
      .select(`
        id,
        cross_street,
        branch_name,
        phone,
        address,
        latitude,
        longitude,
        is_main_branch,
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

    console.log('Raw data from Supabase:', JSON.stringify(data, null, 2));

    // Transform the data to flatten the materials array and get the first website URL
    const transformedData = (data as unknown as Branch[]).map((branch): TransformedBranch => {
      console.log('Processing branch:', {
        id: branch.id,
        name: branch.branch_name,
        coordinates: {
          lat: branch.latitude,
          lng: branch.longitude
        }
      });

      return {
        id: branch.id,
        cross_street: branch.cross_street,
        branch_name: branch.branch_name,
        phone: branch.phone || '',
        address: branch.address || '',
        latitude: branch.latitude,
        longitude: branch.longitude,
        is_main_branch: branch.is_main_branch,
      supplier: {
          id: branch.supplier.id,
          supplier_name: branch.supplier.supplier_name,
          brand_logos: branch.supplier.brand_logos || [],
        materials: branch.materials
            .map(m => m.hardscape_material)
          .filter(Boolean), // Remove any null values
        website_url: branch.supplier.website?.[0]?.website_url
      }
      };
    });

    // Log branches with missing coordinates
    const branchesWithoutCoordinates = transformedData.filter(
      branch => !branch.latitude || !branch.longitude
    );
    if (branchesWithoutCoordinates.length > 0) {
      console.warn('Branches missing coordinates:', branchesWithoutCoordinates.map(branch => ({
        id: branch.id,
        name: branch.branch_name,
        address: branch.address
      })));
    }

    // Log coordinate types
    transformedData.forEach(branch => {
      if (branch.latitude && branch.longitude) {
        console.log(`Branch ${branch.branch_name} coordinates:`, {
          lat: branch.latitude,
          latType: typeof branch.latitude,
          lng: branch.longitude,
          lngType: typeof branch.longitude
        });
      }
    });

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
    
    const { data, error } = await supabase
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