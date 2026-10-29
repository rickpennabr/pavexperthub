import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient, User } from '@supabase/supabase-js'

let browserClient: SupabaseClient | null = null

export function getBrowserSupabase() {
  if (typeof window === 'undefined') {
    throw new Error('Customer sign-in runs in the browser.')
  }
  if (!browserClient) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !key) {
      throw new Error('Supabase is not configured.')
    }
    browserClient = createBrowserClient(url, key)
  }
  return browserClient
}

export type AccountRole = 'customer' | 'installer'
export type AccountType = AccountRole | 'admin'

export function accountRole(user: User): AccountRole | null {
  const role = metaRecord(user).account_role
  return role === 'customer' || role === 'installer' ? role : null
}

/** One account type. Admin is granted on the profile. Otherwise installer, or customer. */
export function accountType(user: User, isAdmin: boolean): AccountType {
  if (isAdmin) return 'admin'
  return accountRole(user) === 'installer' ? 'installer' : 'customer'
}

export async function saveAccountRole(role: AccountRole) {
  const supabase = getBrowserSupabase()
  const { error } = await supabase.auth.updateUser({ data: { account_role: role } })
  if (error) throw error
  const { error: syncError } = await supabase.rpc('sync_my_profile')
  if (syncError) throw syncError
}

export function customerLabel(user: User) {
  const meta = user.user_metadata as Record<string, string | undefined>
  return meta.display_name || meta.full_name || meta.name || user.email?.split('@')[0] || 'Account'
}

export interface AccountDetails {
  firstName: string
  lastName: string
  phone: string
  address1: string
  address2: string
  city: string
  state: string
  zip: string
}

function metaRecord(user: User) {
  return (user.user_metadata ?? {}) as Record<string, unknown>
}

function metaString(user: User, key: string) {
  const value = metaRecord(user)[key]
  return typeof value === 'string' ? value : ''
}

/** Name, phone, and address stored on the Supabase user. */
export function readAccountDetails(user: User): AccountDetails {
  const hasNameParts =
    typeof metaRecord(user).first_name === 'string' || typeof metaRecord(user).last_name === 'string'
  const full = (
    metaString(user, 'display_name') ||
    metaString(user, 'full_name') ||
    metaString(user, 'name')
  ).trim()
  const parts = full.split(/\s+/).filter(Boolean)

  return {
    firstName: hasNameParts ? metaString(user, 'first_name') : parts[0] || '',
    lastName: hasNameParts ? metaString(user, 'last_name') : parts.slice(1).join(' '),
    phone: metaString(user, 'phone'),
    address1: metaString(user, 'address_line1'),
    address2: metaString(user, 'address_line2'),
    city: metaString(user, 'city'),
    state: metaString(user, 'state'),
    zip: metaString(user, 'zip_code'),
  }
}

export function accountDisplayName(details: AccountDetails) {
  return `${details.firstName} ${details.lastName}`.replace(/\s+/g, ' ').trim()
}

export function customerAvatar(user: User) {
  const meta = user.user_metadata as Record<string, string | undefined>
  return meta.avatar_url || meta.picture || ''
}

export function customerInitial(user: User) {
  return customerLabel(user).trim().charAt(0).toUpperCase() || 'P'
}

export function authErrorMessage(message: string) {
  if (/provider is not enabled|unsupported provider/i.test(message)) {
    return 'Google sign-in is not enabled yet. Use email for now, then turn on Google under Authentication providers in Supabase.'
  }
  if (/email not confirmed/i.test(message)) {
    return 'Confirm your email first. Check your inbox for the PavExpert Hub message.'
  }
  if (/invalid login credentials/i.test(message)) {
    return 'That email and password do not match.'
  }
  if (/code verifier|auth code and code verifier/i.test(message)) {
    return 'That link expired for this browser. Request a new sign-in link here, then open it in this same browser.'
  }
  if (/user already registered/i.test(message)) {
    return 'An account with that email already exists. Sign in instead.'
  }
  return message
}

export function safeNextPath(value: string | null) {
  if (!value || !value.startsWith('/') || value.startsWith('//')) return '/account'
  return value
}

export const AUTH_NEXT_KEY = 'pav_auth_next'
