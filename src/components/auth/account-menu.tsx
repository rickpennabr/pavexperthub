'use client'

import { useState, type ReactNode } from 'react'
import Link from 'next/link'
import { Calculator, LogOut, Settings, Shield } from 'lucide-react'
import type { User } from '@supabase/supabase-js'
import { accountType, customerAvatar, customerInitial, customerLabel } from '@/lib/customer-auth'

interface AccountMenuProps {
  user: User
  isAdmin: boolean
  onClose: () => void
  onSignOut: () => void
}

export function AccountMenu({ user, isAdmin, onClose, onSignOut }: AccountMenuProps) {
  const avatar = customerAvatar(user)
  const label = customerLabel(user)
  const type = accountType(user, isAdmin)
  const typeLabel = type === 'admin' ? 'Admin' : type === 'installer' ? 'Installer' : 'Customer'
  const [avatarBroken, setAvatarBroken] = useState(false)

  return (
    <div className="absolute right-0 top-full z-[80] mt-2 w-80 max-w-[calc(100vw-1rem)] overflow-hidden rounded-lg border-2 border-red-500 bg-white text-black shadow-xl">
      <header className="flex items-center gap-3 border-b-2 border-red-500 bg-white p-3">
        {avatar && !avatarBroken ? (
          <img
            src={avatar}
            alt=""
            referrerPolicy="no-referrer"
            onError={() => setAvatarBroken(true)}
            className="h-10 w-10 shrink-0 rounded-md border-2 border-black bg-white object-cover"
          />
        ) : (
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border-2 border-black bg-red-500 text-base font-bold text-white">
            {customerInitial(user)}
          </span>
        )}
        <div className="min-w-0 flex-1 text-left">
          <p className="truncate text-base font-bold text-black">{label}</p>
          <p className="truncate text-xs text-neutral-600">{user.email}</p>
          <p className="text-sm font-bold text-red-500">{typeLabel}</p>
        </div>
      </header>

      <div className="px-2 pb-2 pt-2">
        <MenuLink href="/account" label="Manage account" onClose={onClose}>
          <Settings className="h-4 w-4" />
        </MenuLink>
        <MenuLink href="/estimate" label="Free estimate" onClose={onClose}>
          <Calculator className="h-4 w-4" />
        </MenuLink>

        {isAdmin && (
          <Link
            href="/admin"
            onClick={onClose}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-md border-2 border-red-500 bg-black px-4 py-2.5 text-sm font-bold text-white hover:bg-red-500"
          >
            <Shield className="h-4 w-4" />
            Admin
          </Link>
        )}

        <div className="mt-2 border-t-2 border-red-500 p-2">
          <button
            type="button"
            onClick={onSignOut}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-bold hover:bg-red-500 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </div>
    </div>
  )
}

function MenuLink({
  href,
  label,
  onClose,
  children,
}: {
  href: string
  label: string
  onClose: () => void
  children: ReactNode
}) {
  return (
    <Link
      href={href}
      onClick={onClose}
      className="group flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm font-bold hover:bg-red-500 hover:text-white"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-md bg-black text-white group-hover:bg-white group-hover:text-black">
        {children}
      </span>
      {label}
    </Link>
  )
}
