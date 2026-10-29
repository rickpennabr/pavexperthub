import { cookies } from 'next/headers'

const COOKIE = 'pav_admin_session'

export async function readAdminToken() {
  const jar = await cookies()
  return jar.get(COOKIE)?.value ?? null
}

export async function writeAdminToken(token: string, remember: boolean) {
  const jar = await cookies()
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: remember ? 60 * 60 * 24 * 14 : 60 * 60 * 12,
  })
}

export async function clearAdminToken() {
  const jar = await cookies()
  jar.delete(COOKIE)
}
