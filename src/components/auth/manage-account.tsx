'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { Briefcase, Calculator, CalendarDays, Shield, User, UserCircle, Wrench } from 'lucide-react'
import type { User as AuthUser } from '@supabase/supabase-js'
import { AccountActionPill, AccountAvatar, AccountPageFrame } from '@/components/auth/account-chrome'
import { EditAccountModal } from '@/components/auth/edit-account-modal'
import { accountType, customerLabel, type AccountType } from '@/lib/customer-auth'

interface ManageAccountProps {
  user: AuthUser
  isAdmin: boolean
}

type EditorFocus = 'profile' | 'password'
type Tone = 'black' | 'red'
type OpenAccount = 'personal' | AccountType

const OPEN_ACCOUNT_KEY = 'pav_open_account'

interface ActionItem {
  id: string
  label: string
  icon: typeof UserCircle
  tone: Tone
  run: () => void
}

const TYPE_LABEL: Record<AccountType, string> = {
  customer: 'Customer',
  installer: 'Installer',
  admin: 'Admin',
}

export function ManageAccount({ user, isAdmin }: ManageAccountProps) {
  const router = useRouter()
  const label = customerLabel(user)
  const type = accountType(user, isAdmin)
  const [editor, setEditor] = useState<EditorFocus | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [open, setOpen] = useState<OpenAccount>(type)

  useEffect(() => {
    const saved = sessionStorage.getItem(OPEN_ACCOUNT_KEY)
    setOpen(saved === 'personal' ? 'personal' : type)
  }, [type])

  useEffect(() => {
    if (!notice) return
    const timer = window.setTimeout(() => setNotice(null), 4000)
    return () => window.clearTimeout(timer)
  }, [notice])

  function select(next: OpenAccount) {
    if (next !== 'personal' && next !== type) return
    sessionStorage.setItem(OPEN_ACCOUNT_KEY, next)
    setOpen(next)
  }

  const accountQuick: ActionItem[] =
    open === 'installer'
      ? [
          {
            id: 'procrm',
            label: 'ProCRM',
            icon: Briefcase,
            tone: 'black',
            run: () => router.push('/procrm'),
          },
          {
            id: 'probooking',
            label: 'ProBooking',
            icon: CalendarDays,
            tone: 'red',
            run: () => router.push('/probooking'),
          },
        ]
      : open === 'customer'
        ? [
            {
              id: 'estimates',
              label: 'Estimates',
              icon: Calculator,
              tone: 'red',
              run: () => router.push('/estimate'),
            },
            {
              id: 'edit-profile',
              label: 'Edit profile',
              icon: UserCircle,
              tone: 'black',
              run: () => setEditor('profile'),
            },
          ]
        : open === 'admin'
          ? [
              {
                id: 'admin',
                label: 'Admin',
                icon: Shield,
                tone: 'red',
                run: () => router.push('/admin'),
              },
              {
                id: 'edit-profile',
                label: 'Edit profile',
                icon: UserCircle,
                tone: 'black',
                run: () => setEditor('profile'),
              },
            ]
          : [
              {
                id: 'edit-profile',
                label: 'Edit profile',
                icon: UserCircle,
                tone: 'black',
                run: () => setEditor('profile'),
              },
            ]

  const TypeIcon = type === 'admin' ? Shield : type === 'installer' ? Wrench : User

  return (
    <AccountPageFrame user={user} onAvatar={() => setEditor('profile')}>
      {notice && (
        <p className="mb-3 rounded-md border-2 border-red-500 bg-black px-4 py-2 text-sm font-bold text-white">
          {notice}
        </p>
      )}

      <div className="mb-4">
        <h2 className="mb-2 text-lg font-semibold">Select account</h2>
        <div className="flex gap-2 overflow-x-auto pb-1">
          <AccountPill active={open === 'personal'} kind="personal" onClick={() => select('personal')}>
            <AccountAvatar user={user} size="sm" ring={open === 'personal' ? 'border-white' : 'border-red-500'} />
            <span className="truncate">{label}</span>
          </AccountPill>
          <AccountPill active={open === type} kind="role" onClick={() => select(type)}>
            <TypeIcon className="h-4 w-4 shrink-0" />
            {TYPE_LABEL[type]}
          </AccountPill>
        </div>
      </div>

      <div className="mb-4">
        <h2 className="mb-2 text-lg font-semibold">Quick action</h2>
        <div className="grid grid-cols-2 gap-3 pt-1">
          {accountQuick.map((item) => (
            <AccountActionPill
              key={item.id}
              label={item.label}
              icon={item.icon}
              tone={item.tone}
              onOpen={item.run}
            />
          ))}
        </div>
      </div>

      <EditAccountModal
        user={user}
        open={editor !== null}
        focus={editor === 'password' ? 'password' : 'profile'}
        onClose={() => setEditor(null)}
        onSaved={setNotice}
      />
    </AccountPageFrame>
  )
}

function AccountPill({
  active,
  kind,
  onClick,
  children,
}: {
  active: boolean
  kind: 'personal' | 'role'
  onClick: () => void
  children: ReactNode
}) {
  const selected =
    active && kind === 'personal'
      ? 'bg-black text-white'
      : active
        ? 'bg-red-500 text-white'
        : 'bg-white text-black hover:bg-black hover:text-white'

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-12 max-w-[240px] shrink-0 items-center gap-2 rounded-md border-2 border-red-500 px-3 text-sm font-bold ${selected}`}
    >
      {children}
    </button>
  )
}
