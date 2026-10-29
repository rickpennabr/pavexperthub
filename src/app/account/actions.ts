'use server'

import { createServerSupabase } from '@/lib/supabase/server'

const installMessage =
  'Account deletion is not installed yet. Run database/migrations/delete-my-account.sql in the Supabase SQL editor, then try again.'

interface DeleteBody {
  ok?: boolean
  error?: string
  has_password?: boolean
  detail?: string
}

function readBody(data: unknown): DeleteBody {
  try {
    const value = typeof data === 'string' ? JSON.parse(data) as unknown : data
    if (!value || typeof value !== 'object') return { ok: false }
    return value as DeleteBody
  } catch {
    return { ok: false }
  }
}

function missingFunction(message: string) {
  return /could not find the function|schema cache/i.test(message)
}

function proofError(code: string | undefined) {
  if (code === 'incorrect_password') return 'That password is incorrect.'
  if (code === 'email_mismatch') return 'That email does not match this account.'
  if (code === 'password_required') return 'Enter your password.'
  if (code === 'email_required') return 'Enter the email on this account.'
  if (code === 'not_authenticated') return 'Sign in again before deleting this account.'
  return 'Could not delete this account. Try again.'
}

/** Password accounts confirm with a password. Google-only accounts confirm with their email. */
export async function getAccountDeleteMethod(): Promise<
  { ok: true; hasPassword: boolean } | { ok: false; error: string }
> {
  const supabase = await createServerSupabase()
  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError || !userData.user) {
    return { ok: false, error: 'Sign in again before deleting this account.' }
  }

  const { data, error } = await supabase.rpc('account_delete_method')
  if (error) {
    return {
      ok: false,
      error: missingFunction(error.message) ? installMessage : 'Could not start account deletion. Try again.',
    }
  }

  const body = readBody(data)
  if (!body.ok) return { ok: false, error: 'Sign in again before deleting this account.' }
  return { ok: true, hasPassword: body.has_password === true }
}

/**
 * Permanently delete the signed-in user.
 * The database function checks the password or email, then removes that auth user only.
 */
export async function deleteMyAccount(proof: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createServerSupabase()
  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError || !userData.user) {
    return { success: false, error: 'Sign in again before deleting this account.' }
  }

  const { data, error } = await supabase.rpc('delete_my_account', { p_proof: proof })
  if (error) {
    return {
      success: false,
      error: missingFunction(error.message) ? installMessage : 'Could not delete this account. Try again.',
    }
  }

  const body = readBody(data)
  if (!body.ok) {
    if (body.detail) console.error('delete_my_account', body.detail)
    return { success: false, error: proofError(body.error) }
  }

  return { success: true }
}
