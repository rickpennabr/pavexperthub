import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseClient'

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin.client
      .from('services')
      .select('*')
      .order('name')

    if (error) {
      console.error('Error fetching services:', error)
      return NextResponse.json(
        { error: 'Failed to fetch services' },
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

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const { data, error } = await supabaseAdmin.client
      .from('services')
      .insert([body])
      .select()
      .single()

    if (error) {
      console.error('Error creating service:', error)
      return NextResponse.json(
        { error: 'Failed to create service' },
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