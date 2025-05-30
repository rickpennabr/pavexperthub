"use server"

export async function getGoogleMapsApiKey(): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  if (!apiKey) {
    throw new Error("Google Maps API key is not configured")
  }
  return apiKey
} 