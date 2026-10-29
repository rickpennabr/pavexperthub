'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { bootstrapAction, loginAction } from '@/app/admin/actions'
import { ErrorNote, FullScreenLock, PrimaryButton, fieldClass } from '@/components/admin/ui'

interface AdminLoginProps {
  hasAdmin: boolean
  gateError?: string
}

export function AdminLogin({ hasAdmin, gateError }: AdminLoginProps) {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [error, setError] = useState<string | null>(gateError ?? null)
  const [busy, setBusy] = useState(false)
  const [logoOk, setLogoOk] = useState(true)

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    setBusy(true)
    setError(null)
    const result = hasAdmin
      ? await loginAction({ username, password, remember })
      : await bootstrapAction({ username, displayName, password, confirmPassword })
    setBusy(false)
    if (!result.ok) {
      setError(result.error || 'Could not sign in.')
      return
    }
    router.refresh()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
      <FullScreenLock />
      <div className="w-full max-w-md rounded-lg border-2 border-red-500 bg-white p-8 text-black shadow-2xl">
        <div className="mb-6 flex flex-col items-center text-center">
          {logoOk && (
            <Image
              src="/images/logo/pav-expert-hub-logo.png"
              alt="PavExpert Hub"
              width={180}
              height={64}
              className="mb-3 h-12 w-auto"
              onError={() => setLogoOk(false)}
              priority
            />
          )}
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-500">PavExpert Hub</p>
          <h1 className="mt-2 text-2xl font-bold">
            {hasAdmin ? 'Sign in' : 'Create administrator'}
          </h1>
          <p className="mt-2 text-sm text-neutral-600">
            {hasAdmin
              ? 'Use your administrator username and password.'
              : 'This first account can sign in and manage the catalog.'}
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <ErrorNote message={error} />
          <label className="block">
            <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-neutral-600">Username</span>
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
              required
              className={fieldClass}
            />
          </label>
          {!hasAdmin && (
            <label className="block">
              <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-neutral-600">Display name</span>
              <input
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                autoComplete="name"
                className={fieldClass}
              />
            </label>
          )}
          <label className="block">
            <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-neutral-600">Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete={hasAdmin ? 'current-password' : 'new-password'}
              required
              className={fieldClass}
            />
          </label>
          {!hasAdmin && (
            <label className="block">
              <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-neutral-600">Confirm password</span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                autoComplete="new-password"
                required
                className={fieldClass}
              />
            </label>
          )}
          {hasAdmin && (
            <label className="flex items-center gap-2 text-sm font-medium">
              <input
                type="checkbox"
                checked={remember}
                onChange={(event) => setRemember(event.target.checked)}
                className="h-4 w-4 accent-red-500"
              />
              Remember me
            </label>
          )}
          <PrimaryButton type="submit" disabled={busy}>
            {busy ? 'Please wait...' : hasAdmin ? 'Log in' : 'Create account'}
          </PrimaryButton>
        </form>

        <p className="mt-6 text-center text-sm">
          <Link href="/" className="font-bold text-black hover:text-red-600">
            Back to the site
          </Link>
        </p>
      </div>
    </div>
  )
}

export function AdminSetup() {
  const router = useRouter()
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
      <FullScreenLock />
      <div className="w-full max-w-lg rounded-lg border-2 border-red-500 bg-white p-8 text-black shadow-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-500">PavExpert Hub</p>
        <h1 className="mt-2 text-2xl font-bold">Install the admin database</h1>
        <p className="mt-3 text-sm text-neutral-700">
          The catalog tools use the same sign-in as the public site. Open the SQL editor, run both migrations, then reload and sign in from the site.
        </p>
        <p className="mt-4 rounded-md border-2 border-black bg-neutral-100 px-3 py-2 font-mono text-sm">
          database/migrations/admin.sql
        </p>
        <p className="mt-2 rounded-md border-2 border-black bg-neutral-100 px-3 py-2 font-mono text-sm">
          database/migrations/admin-from-account.sql
        </p>
        {process.env.NEXT_PUBLIC_SUPABASE_URL && (
          <a
            href={`https://supabase.com/dashboard/project/${process.env.NEXT_PUBLIC_SUPABASE_URL.replace(/^https:\/\//, '').split('.')[0]}/sql/new`}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-block text-sm font-bold text-red-600 hover:text-black"
          >
            Open the Supabase SQL editor
          </a>
        )}
        <div className="mt-6 flex flex-wrap gap-3">
          <PrimaryButton onClick={() => router.refresh()}>Reload</PrimaryButton>
          <Link
            href="/"
            className="rounded-md border-2 border-black bg-white px-4 py-2 text-sm font-bold text-black hover:border-red-500 hover:text-red-600"
          >
            Back to the site
          </Link>
        </div>
      </div>
    </div>
  )
}
