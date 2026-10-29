'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AccountPageFrame } from '@/components/auth/account-chrome'
import { ManageAccount } from '@/components/auth/manage-account'
import { SignInPanel } from '@/components/auth/sign-in-panel'
import { useCustomerSession } from '@/components/auth/customer-session'
import { AUTH_NEXT_KEY, safeNextPath } from '@/lib/customer-auth'

export default function AccountPage() {
  const router = useRouter()
  const { user, ready, profileReady, isAdmin } = useCustomerSession()
  const [authError, setAuthError] = useState<string | null>(null)
  const [deleted, setDeleted] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const next = params.get('next')
    if (next && next.startsWith('/') && !next.startsWith('//')) {
      sessionStorage.setItem(AUTH_NEXT_KEY, next)
    }
    const message = params.get('auth_error')
    if (message) setAuthError(message)
    if (params.get('deleted') === '1') setDeleted(true)
  }, [])

  useEffect(() => {
    if (!ready || !user) return
    const next = new URLSearchParams(window.location.search).get('next')
    if (next && next.startsWith('/') && !next.startsWith('//')) {
      router.replace(next)
    }
  }, [ready, user, router])

  function onSignedIn() {
    const next = safeNextPath(sessionStorage.getItem(AUTH_NEXT_KEY))
    sessionStorage.removeItem(AUTH_NEXT_KEY)
    if (next !== '/account') router.push(next)
  }

  if (!ready || (user && !profileReady)) {
    return (
      <AccountPageFrame>
        <div className="flex min-h-[320px] items-center justify-center">
          <div className="h-8 w-8 animate-spin rotate-45 rounded-sm border-2 border-black bg-red-500" />
        </div>
      </AccountPageFrame>
    )
  }

  if (!user) {
    return (
      <AccountPageFrame>
        <div className="mx-auto max-w-md">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-500">PavExpert Hub</p>
          <h2 className="mt-1 text-3xl font-bold text-black">Your account</h2>
          {deleted && (
            <p className="mt-3 rounded-md border-2 border-red-500 bg-black px-4 py-2 text-sm font-bold text-white">
              Your account was deleted.
            </p>
          )}
          <p className="mb-6 mt-2 text-sm text-neutral-600">
            Sign in with Google or email to keep your profile.
          </p>
          <SignInPanel onSuccess={onSignedIn} initialError={authError} />
        </div>
      </AccountPageFrame>
    )
  }

  return <ManageAccount user={user} isAdmin={isAdmin} />
}
