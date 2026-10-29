'use client'

import { useEffect, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { PehChoice } from '@/components/forms/peh-field'
import { AUTH_NEXT_KEY, authErrorMessage, getBrowserSupabase, type AccountRole } from '@/lib/customer-auth'

type Mode = 'signin' | 'signup' | 'magic'

const fieldClass =
  'h-10 w-full rounded-md border-2 border-red-500 px-3 text-sm text-black outline-none focus:border-red-600'

const primaryClass =
  'w-full rounded-md border-2 border-red-500 bg-black px-4 py-2.5 text-sm font-bold text-white hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60'

function GoogleMark() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className="h-4 w-4">
      <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.9z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C40 35.2 44 30.1 44 24c0-1.3-.1-2.7-.4-3.9z" />
    </svg>
  )
}

function isEmail(value: string) {
  return /^\S+@\S+\.\S+$/.test(value)
}

interface SignInPanelProps {
  onSuccess?: () => void
  initialError?: string | null
}

function callbackUrl() {
  const next = sessionStorage.getItem(AUTH_NEXT_KEY) || window.location.pathname
  const url = new URL('/auth/callback', window.location.origin)
  if (next.startsWith('/') && !next.startsWith('//')) {
    url.searchParams.set('next', next)
  }
  return url.toString()
}

export function SignInPanel({ onSuccess, initialError = null }: SignInPanelProps) {
  const [mode, setMode] = useState<Mode>('signin')
  const [role, setRole] = useState<AccountRole | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(initialError)

  useEffect(() => {
    if (initialError) setError(initialError)
  }, [initialError])
  const [notice, setNotice] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  function resetMessages() {
    setError(null)
    setNotice(null)
  }

  async function onGoogle() {
    resetMessages()
    setBusy(true)
    try {
      if (!sessionStorage.getItem(AUTH_NEXT_KEY)) {
        sessionStorage.setItem(AUTH_NEXT_KEY, window.location.pathname)
      }
      const { error: oauthError } = await getBrowserSupabase().auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: callbackUrl() },
      })
      if (oauthError) {
        setError(authErrorMessage(oauthError.message))
        setBusy(false)
      }
    } catch (caught) {
      setError(authErrorMessage(caught instanceof Error ? caught.message : 'Could not start Google sign-in.'))
      setBusy(false)
    }
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    resetMessages()
    const cleanEmail = email.trim().toLowerCase()
    if (!isEmail(cleanEmail)) {
      setError('Enter a valid email address.')
      return
    }

    setBusy(true)
    const supabase = getBrowserSupabase()

    if (mode === 'magic') {
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: cleanEmail,
        options: { emailRedirectTo: callbackUrl() },
      })
      setBusy(false)
      if (otpError) {
        setError(authErrorMessage(otpError.message))
        return
      }
      setNotice('Check your email for a sign-in link.')
      return
    }

    if (mode === 'signup') {
      if (!role) {
        setBusy(false)
        setError('Choose Customer or Installer.')
        return
      }
      if (password.length < 6) {
        setBusy(false)
        setError('Use at least 6 characters for the password.')
        return
      }
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          emailRedirectTo: callbackUrl(),
          data: { display_name: name.trim(), account_role: role },
        },
      })
      setBusy(false)
      if (signUpError) {
        setError(authErrorMessage(signUpError.message))
        return
      }
      if (!data.session) {
        setNotice('Account created. Check your email to confirm it, then sign in.')
        setMode('signin')
        setPassword('')
        return
      }
      onSuccess?.()
      return
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    })
    setBusy(false)
    if (signInError) {
      setError(authErrorMessage(signInError.message))
      return
    }
    onSuccess?.()
  }

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={onGoogle}
        disabled={busy}
        className="flex w-full items-center justify-center gap-2 rounded-md border-2 border-black bg-white px-4 py-2.5 text-sm font-bold text-black hover:border-red-500 disabled:opacity-60"
      >
        <GoogleMark />
        Continue with Google
      </button>

      <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-wide text-neutral-500">
        <span className="h-px flex-1 bg-neutral-300" />
        or email
        <span className="h-px flex-1 bg-neutral-300" />
      </div>

      <form onSubmit={onSubmit} className="space-y-3">
        {error && (
          <p className="rounded-md border-2 border-red-500 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
            {error}
          </p>
        )}
        {notice && (
          <p className="rounded-md border-2 border-black bg-neutral-50 px-3 py-2 text-sm font-medium text-black">
            {notice}
          </p>
        )}

        {mode === 'signup' && (
          <>
            <div>
              <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-neutral-600">Sign up as</span>
              <PehChoice
                value={role}
                options={[
                  { id: 'customer', label: 'Customer' },
                  { id: 'installer', label: 'Installer' },
                ]}
                onChange={setRole}
              />
            </div>
            <label className="block">
              <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-neutral-600">Name</span>
              <input value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" className={fieldClass} />
            </label>
          </>
        )}

        <label className="block">
          <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-neutral-600">Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
            className={fieldClass}
          />
        </label>

        {mode !== 'magic' && (
          <label className="block">
            <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-neutral-600">Password</span>
            <span className="relative block">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                required
                className="h-10 w-full rounded-md border-2 border-red-500 pl-3 pr-10 text-sm text-black outline-none focus:border-red-600"
              />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-black hover:text-red-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
              </button>
            </span>
          </label>
        )}

        <button type="submit" disabled={busy} className={primaryClass}>
          {busy ? 'Please wait...' : mode === 'signup' ? 'Create account' : mode === 'magic' ? 'Email me a link' : 'Sign in'}
        </button>
      </form>

      <div className="flex flex-col gap-2 text-sm">
        {mode !== 'signin' && (
          <button type="button" onClick={() => { setMode('signin'); resetMessages() }} className="font-bold text-black hover:text-red-600">
            Sign in with email and password
          </button>
        )}
        {mode !== 'signup' && (
          <button type="button" onClick={() => { setMode('signup'); resetMessages() }} className="font-bold text-black hover:text-red-600">
            New here? Create an account
          </button>
        )}
        {mode !== 'magic' && (
          <button type="button" onClick={() => { setMode('magic'); resetMessages() }} className="font-bold text-black hover:text-red-600">
            Email me a sign-in link
          </button>
        )}
      </div>
    </div>
  )
}
