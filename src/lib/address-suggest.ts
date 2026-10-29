export type ServiceCity = 'Las Vegas' | 'Henderson' | 'North Las Vegas' | 'Other'

export interface AddressSuggestion {
  label: string
  street: string
  city: ServiceCity
  zip: string
}

/** Clark County places that use a Las Vegas mailing city on this form. */
const LAS_VEGAS_PLACES = new Set([
  'las vegas',
  'enterprise',
  'paradise',
  'spring valley',
  'summerlin',
  'summerlin south',
  'winchester',
  'sunrise manor',
  'whitney',
  'lone mountain',
])

export function toServiceCity(city: string): ServiceCity {
  const normalized = city.trim().toLowerCase()
  if (normalized === 'north las vegas') return 'North Las Vegas'
  if (normalized === 'henderson') return 'Henderson'
  if (LAS_VEGAS_PLACES.has(normalized)) return 'Las Vegas'
  return 'Other'
}

/**
 * ArcGIS suggest text looks like:
 * "6323 Silverfield Dr, Las Vegas, NV, 89103, USA"
 */
export function parseAddressSuggestion(text: string): AddressSuggestion | null {
  const parts = text.split(',').map((part) => part.trim()).filter(Boolean)
  if (parts.length < 4) return null

  const zip = parts[parts.length - 2]
  const state = parts[parts.length - 3]
  const city = parts.slice(1, parts.length - 3).join(', ')
  const street = parts[0]

  if (state !== 'NV' || !/^\d{5}$/.test(zip) || !street || !city) return null

  return {
    label: `${street}, ${city}, NV ${zip}`,
    street,
    city: toServiceCity(city),
    zip,
  }
}
