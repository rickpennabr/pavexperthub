import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

function hasSessionCookie(request: NextRequest) {
  return request.cookies.getAll().some((cookie) => {
    if (cookie.name.includes('code-verifier')) return false
    return cookie.name.startsWith('sb-') && cookie.name.includes('auth-token')
  })
}

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return response

  // getUser() on a signed-out request deletes the PKCE verifier cookie.
  // The email and Google links need that cookie at /auth/callback.
  if (request.nextUrl.pathname.startsWith('/auth/callback') || !hasSessionCookie(request)) {
    return response
  }

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        response = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options)
        })
      },
    },
  })

  await supabase.auth.getUser()
  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)'],
}
