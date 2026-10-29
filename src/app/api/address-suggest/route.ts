import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { parseAddressSuggestion } from '@/lib/address-suggest'

const querySchema = z.object({
  q: z.string().trim().min(3).max(120),
})

const SUGGEST_URL = 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest'

/**
 * Address suggestions for the estimate form.
 * Biased to the Las Vegas valley and limited to Nevada street addresses.
 */
export async function GET(request: NextRequest) {
  try {
    const parsed = querySchema.safeParse({
      q: request.nextUrl.searchParams.get('q') ?? '',
    })

    if (!parsed.success) {
      return NextResponse.json({ error: 'Enter at least 3 characters' }, { status: 400 })
    }

    const params = new URLSearchParams({
      text: parsed.data.q,
      f: 'json',
      countryCode: 'USA',
      category: 'Address',
      maxSuggestions: '6',
      // Las Vegas valley: lon,lat and xmin,ymin,xmax,ymax
      location: '-115.14,36.17',
      searchExtent: '-115.55,35.95,-114.85,36.45',
    })

    const response = await fetch(`${SUGGEST_URL}?${params.toString()}`, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 0 },
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Address search is unavailable' }, { status: 502 })
    }

    const data = (await response.json()) as { suggestions?: Array<{ text?: string }> }
    const suggestions = (data.suggestions ?? [])
      .map((item) => (item.text ? parseAddressSuggestion(item.text) : null))
      .filter((item): item is NonNullable<typeof item> => item !== null)

    return NextResponse.json({ suggestions })
  } catch (error) {
    console.error('Address suggest failed:', error instanceof Error ? error.message : error)
    return NextResponse.json({ error: 'Address search is unavailable' }, { status: 500 })
  }
}
