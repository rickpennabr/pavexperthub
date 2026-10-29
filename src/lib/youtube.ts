export function youtubeEmbedUrl(url: string) {
  try {
    const parsed = new URL(url)
    const host = parsed.hostname.replace(/^www\./, '')
    if (host === 'youtu.be') {
      const id = parsed.pathname.split('/').filter(Boolean)[0]
      return id ? `https://www.youtube.com/embed/${id}` : null
    }
    if (host === 'youtube.com' || host === 'm.youtube.com') {
      const watchId = parsed.searchParams.get('v')
      if (watchId) return `https://www.youtube.com/embed/${watchId}`
      const parts = parsed.pathname.split('/').filter(Boolean)
      const marker = parts.findIndex((part) => part === 'embed' || part === 'shorts')
      if (marker >= 0 && parts[marker + 1]) {
        return `https://www.youtube.com/embed/${parts[marker + 1]}`
      }
    }
  } catch {
    return null
  }
  return null
}
