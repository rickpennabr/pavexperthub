'use client'

import { useState, type ComponentType, type ReactNode } from 'react'
import Link from 'next/link'
import { Star } from 'lucide-react'
import type { User } from '@supabase/supabase-js'
import { customerAvatar, customerInitial } from '@/lib/customer-auth'

/** Plus while closed, X while open. Same mark as the BrazaLink accordion, in red. */
export function CollapseMark({ open }: { open: boolean }) {
  return (
    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-red-500">
      <span className="relative h-3 w-3">
        <span
          className={`absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-white transition-transform duration-300 ${
            open ? 'rotate-45' : ''
          }`}
        />
        <span
          className={`absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-white transition-transform duration-300 ${
            open ? 'rotate-45' : ''
          }`}
        />
      </span>
    </span>
  )
}

export function AccountSection({
  id,
  title,
  icon,
  open,
  onToggle,
  children,
}: {
  id: string
  title: string
  icon: ReactNode
  open: boolean
  onToggle: () => void
  children: ReactNode
}) {
  return (
    <section className="rounded-lg border-2 border-red-500 bg-white">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={`${id}-section`}
        onClick={onToggle}
        className="flex h-12 w-full items-center gap-2 px-4 text-left"
      >
        <span className="flex h-5 w-5 shrink-0 items-center justify-center text-red-500">{icon}</span>
        <span className={`min-w-0 flex-1 truncate text-lg font-semibold ${open ? 'text-red-600' : 'text-black'}`}>
          {title}
        </span>
        <CollapseMark open={open} />
      </button>
      {open && (
        <div id={`${id}-section`} className="space-y-3 px-3 pb-4 pt-1">
          {children}
        </div>
      )}
    </section>
  )
}

export function AccountActionPill({
  label,
  icon: Icon,
  tone,
  favorite = false,
  onOpen,
  onToggleFavorite,
}: {
  label: string
  icon: ComponentType<{ className?: string }>
  tone: 'black' | 'red'
  favorite?: boolean
  onOpen: () => void
  onToggleFavorite?: () => void
}) {
  const starLabel = favorite ? `Remove ${label} from favorites` : `Add ${label} to favorites`

  return (
    <div className="relative">
      {onToggleFavorite && (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            onToggleFavorite()
          }}
          aria-pressed={favorite}
          aria-label={starLabel}
          title={starLabel}
          className="absolute -top-2.5 right-1 z-10 flex h-[21px] w-[21px] items-center justify-center rounded-md border-2 border-white bg-red-500 shadow"
        >
          <Star className={`h-3 w-3 ${favorite ? 'fill-white text-white' : 'text-white'}`} strokeWidth={2.5} />
        </button>
      )}
      <button
        type="button"
        onClick={onOpen}
        className="flex h-12 w-full items-center gap-2 rounded-md border-2 border-red-500 bg-white px-2 text-left text-sm font-bold text-black transition-colors hover:bg-black hover:text-white"
      >
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-white ${
            tone === 'red' ? 'bg-red-500' : 'bg-black'
          }`}
        >
          <Icon className="h-4 w-4" />
        </span>
        <span className="truncate">{label}</span>
      </button>
    </div>
  )
}

export function AccountAvatar({
  user,
  size = 'md',
  ring = 'border-red-500',
  framed = true,
}: {
  user: User
  size?: 'sm' | 'md' | 'lg'
  ring?: string
  /** False when a parent button already draws the square frame. */
  framed?: boolean
}) {
  const [broken, setBroken] = useState(false)
  const avatar = customerAvatar(user)
  const box = !framed
    ? 'h-full w-full text-sm'
    : size === 'lg'
      ? 'h-16 w-16 text-2xl'
      : size === 'sm'
        ? 'h-6 w-6 text-[10px]'
        : 'h-10 w-10 text-sm'
  const shape = framed ? `rounded-md border-2 ${ring}` : ''

  if (avatar && !broken) {
    return (
      <img
        src={avatar}
        alt=""
        referrerPolicy="no-referrer"
        onError={() => setBroken(true)}
        className={`${box} object-cover ${shape}`}
      />
    )
  }

  return (
    <span className={`${box} flex items-center justify-center bg-red-500 font-bold text-white ${shape}`}>
      {customerInitial(user)}
    </span>
  )
}

/** Account pages sit in this frame. The home header and main menu are not rendered here. */
export function AccountPageFrame({
  user,
  onAvatar,
  children,
}: {
  user?: User | null
  onAvatar?: () => void
  children: ReactNode
}) {
  return (
    <div className="min-h-[calc(100vh-8px)] bg-white px-2 py-3 text-black sm:px-4 sm:py-4">
      <header className="mb-4 grid h-14 grid-cols-[40px_1fr_40px] items-center gap-2 border-b-2 border-red-500">
        <Link
          href="/"
          aria-label="PavExpert Hub home"
          className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-md border-2 border-black bg-black hover:border-red-500"
        >
          <img src="/images/logo/icon.png" alt="" className="h-full w-full bg-black object-cover" />
        </Link>
        <h1 className="truncate text-center text-xl font-bold sm:text-2xl">Manage account</h1>
        {user && onAvatar ? (
          <button
            type="button"
            onClick={onAvatar}
            aria-label="Edit account"
            className="flex h-10 w-10 items-center justify-center justify-self-end overflow-hidden rounded-md border-2 border-black bg-black hover:border-red-500"
          >
            <AccountAvatar user={user} framed={false} />
          </button>
        ) : (
          <span className="h-10 w-10 justify-self-end" />
        )}
      </header>
      {children}
    </div>
  )
}
