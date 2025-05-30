import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('name')

    if (error) {
      console.error('Error fetching services:', error)
      return NextResponse.json(
        { error: `Failed to fetch services: ${error.message}` },
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

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const { data, error } = await supabase
      .from('services')
      .insert([body])
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
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