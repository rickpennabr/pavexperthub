import { supabase } from '@/lib/supabaseClient'
import type { ActionResult } from '@/types/admin'
import { createServerSupabase } from '@/lib/supabase/server'

interface RpcBody<T> {
  ok?: boolean
  error?: string
  data?: T
  token?: string
  username?: string
  display_name?: string
  has_admin?: boolean
  is_admin?: boolean
  email?: string
}

export function isMissingAdminSchema(message: string) {
  return /could not find the function/i.test(message) || /schema cache/i.test(message)
}

export function asRpcBody<T>(data: unknown): RpcBody<T> {
  const value = typeof data === 'string' ? JSON.parse(data) as RpcBody<T> : data
  if (!value || typeof value !== 'object') {
    return { ok: false, error: 'Unexpected response from the database.' }
  }
  return value as RpcBody<T>
}

export function friendlyRpcError(message: string) {
  if (isMissingAdminSchema(message)) {
    return 'Admin database is not installed yet. Run database/migrations/admin.sql and database/migrations/admin-from-account.sql in the Supabase SQL editor, then reload.'
  }
  return 'Something went wrong. Try again.'
}

export async function callAdmin<T>(
  action: string,
  payload: Record<string, unknown> = {},
): Promise<ActionResult<T>> {
  const server = await createServerSupabase()
  const { data: userData } = await server.auth.getUser()
  if (!userData.user) return { ok: false, error: 'unauthorized' }

  const synced = await server.rpc('sync_my_profile')
  if (synced.error) return { ok: false, error: friendlyRpcError(synced.error.message) }
  const profile = asRpcBody(synced.data)
  if (!profile.ok || !profile.is_admin) return { ok: false, error: 'unauthorized' }

  const session = await server.rpc('admin_session_from_auth')
  if (session.error) return { ok: false, error: friendlyRpcError(session.error.message) }
  const sessionBody = asRpcBody(session.data)
  if (!sessionBody.ok || !sessionBody.token) {
    return { ok: false, error: sessionBody.error || 'unauthorized' }
  }

  const { data, error } = await supabase.rpc('admin_api', {
    p_token: sessionBody.token,
    p_action: action,
    p_payload: payload,
  })

  if (error) return { ok: false, error: friendlyRpcError(error.message) }

  const result = asRpcBody<T>(data)
  if (!result.ok) return { ok: false, error: result.error || 'Request failed.' }
  return { ok: true, data: result.data }
}
