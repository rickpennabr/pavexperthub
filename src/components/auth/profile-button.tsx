'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { User } from 'lucide-react'
import { AccountMenu } from '@/components/auth/account-menu'
import { useCustomerSession } from '@/components/auth/customer-session'
import { SignInPanel } from '@/components/auth/sign-in-panel'
import { customerAvatar, customerInitial, getBrowserSupabase } from '@/lib/customer-auth'

export function ProfileButton() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, ready, isAdmin } = useCustomerSession()
  const [menuOpen, setMenuOpen] = useState(false)
  const [signInOpen, setSignInOpen] = useState(false)
  const [avatarBroken, setAvatarBroken] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const active = pathname === '/account'

  useEffect(() => {
    setMenuOpen(false)
    setSignInOpen(false)
  }, [pathname])

  useEffect(() => {
    setAvatarBroken(false)
  }, [user?.id])

  useEffect(() => {
    if (!menuOpen) return
    function onPointer(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setMenuOpen(false)
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('mousedown', onPointer)
    window.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointer)
      window.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  useEffect(() => {
    if (!signInOpen) return
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setSignInOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [signInOpen])

  async function onSignOut() {
    await getBrowserSupabase().auth.signOut()
    setMenuOpen(false)
    if (pathname.startsWith('/admin')) {
      router.push('/')
      router.refresh()
    }
  }

  const iconMotion = `transition-transform duration-300 ${active ? 'scale-125' : 'group-hover:scale-125'}`
  const avatar = user ? customerAvatar(user) : ''
  const hasAvatar = Boolean(avatar) && !avatarBroken

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        className={`group relative flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-md bg-black text-white ${
          active
            ? 'border-2 border-red-500'
            : hasAvatar
              ? 'border-2 border-black hover:border-red-500'
              : 'border-0 hover:border-2 hover:border-red-500'
        }`}
        aria-label={user ? 'Open profile' : 'Sign in'}
        onClick={() => {
          if (!ready) return
          if (user) setMenuOpen((open) => !open)
          else setSignInOpen(true)
        }}
      >
        <div
          className={`absolute inset-0 z-0 rounded-md bg-white transition-all duration-300 ease-out ${
            active ? 'w-full' : 'w-0 group-hover:w-full'
          }`}
        />
        {hasAvatar ? (
          <img
            src={avatar}
            alt=""
            referrerPolicy="no-referrer"
            onError={() => setAvatarBroken(true)}
            className="absolute inset-0 z-10 h-full w-full object-cover"
          />
        ) : (
          <span className={`relative z-10 flex items-center justify-center transition-colors duration-300 ${
            active ? 'text-black' : 'group-hover:text-black'
          }`}>
            {user ? (
              <span className={`flex h-6 w-6 items-center justify-center rounded-md bg-red-500 text-xs font-bold text-white ${iconMotion}`}>
                {customerInitial(user)}
              </span>
            ) : (
              <User className={`h-4 w-4 ${iconMotion}`} />
            )}
          </span>
        )}
      </button>

      {menuOpen && user && (
        <AccountMenu
          user={user}
          isAdmin={isAdmin}
          onClose={() => setMenuOpen(false)}
          onSignOut={onSignOut}
        />
      )}

      {signInOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setSignInOpen(false)}>
          <div
            className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg border-2 border-red-500 bg-white p-5 text-black shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-500">PavExpert Hub</p>
                <h2 className="text-xl font-bold">Sign in</h2>
              </div>
              <button type="button" onClick={() => setSignInOpen(false)} className="text-sm font-bold text-neutral-500 hover:text-black">
                Close
              </button>
            </div>
            <SignInPanel onSuccess={() => setSignInOpen(false)} />
          </div>
        </div>
      )}
    </div>
  )
}
