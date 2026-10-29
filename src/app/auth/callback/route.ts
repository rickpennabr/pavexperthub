import { NextResponse } from 'next/server'
import type { EmailOtpType } from '@supabase/supabase-js'
import { createServerSupabase } from '@/lib/supabase/server'
import { authErrorMessage, safeNextPath } from '@/lib/customer-auth'

const otpTypes = new Set<EmailOtpType>([
  'signup',
  'invite',
  'magiclink',
  'recovery',
  'email_change',
  'email',
])

function accountError(origin: string, message: string) {
  const url = new URL('/account', origin)
  url.searchParams.set('auth_error', authErrorMessage(message))
  return NextResponse.redirect(url)
}

/**
 * Finishes Google and email sign-in. The link arrives with a one-time code
 * that is exchanged for a session cookie.
 */
export async function GET(request: Request) {
  const url = new URL(request.url)
  const described = url.searchParams.get('error_description') || url.searchParams.get('error')
  if (described) return accountError(url.origin, described)

  const next = safeNextPath(url.searchParams.get('next'))
  const supabase = await createServerSupabase()
  const code = url.searchParams.get('code')
  const tokenHash = url.searchParams.get('token_hash')
  const type = url.searchParams.get('type')

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) return accountError(url.origin, error.message)
    return NextResponse.redirect(new URL(next, url.origin))
  }

  if (tokenHash && type && otpTypes.has(type as EmailOtpType)) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: type as EmailOtpType,
    })
    if (error) return accountError(url.origin, error.message)
    return NextResponse.redirect(new URL(next, url.origin))
  }

  return accountError(url.origin, 'We could not finish signing you in. Request a new link and try again.')
}
