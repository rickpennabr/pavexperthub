'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import { AlertTriangle, Mail, MapPin, User, UserCircle } from 'lucide-react'
import type { User as AuthUser } from '@supabase/supabase-js'
import { PehCloseButton, PehModal } from '@/components/common/peh-modal'
import { AccountAvatar, AccountSection } from '@/components/auth/account-chrome'
import { DeleteAccountDialog } from '@/components/auth/delete-account-dialog'
import {
  accountDisplayName,
  authErrorMessage,
  getBrowserSupabase,
  readAccountDetails,
  type AccountDetails,
} from '@/lib/customer-auth'

type SectionId = 'personal' | 'address' | 'contact'
type EditorFocus = 'profile' | 'password'

const SECTIONS: { id: SectionId; label: string }[] = [
  { id: 'personal', label: 'Personal info' },
  { id: 'address', label: 'Address' },
  { id: 'contact', label: 'Contact' },
]

interface EditAccountModalProps {
  user: AuthUser
  open: boolean
  focus: EditorFocus
  onClose: () => void
  onSaved: (message: string) => void
}

function fieldClass(filled: boolean, readOnly = false) {
  return `h-12 w-full rounded-md border-2 border-red-500 px-4 text-sm outline-none ${
    filled
      ? 'bg-black text-white caret-white placeholder:text-white/60'
      : 'bg-white text-black placeholder:text-neutral-400'
  } ${readOnly ? 'cursor-default' : ''}`
}

function sameDetails(a: AccountDetails, b: AccountDetails) {
  return (Object.keys(a) as (keyof AccountDetails)[]).every((key) => a[key] === b[key])
}

export function EditAccountModal({ user, open, focus, onClose, onSaved }: EditAccountModalProps) {
  const userRef = useRef(user)
  userRef.current = user
  const google = user.app_metadata?.provider === 'google'
  const [details, setDetails] = useState<AccountDetails>(() => readAccountDetails(user))
  const [baseline, setBaseline] = useState<AccountDetails>(() => readAccountDetails(user))
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [openSections, setOpenSections] = useState<SectionId[]>(['personal'])
  const [deleteOpen, setDeleteOpen] = useState(false)

  useEffect(() => {
    setDeleteOpen(false)
    if (!open) return
    const next = readAccountDetails(userRef.current)
    setDetails(next)
    setBaseline(next)
    setPassword('')
    setConfirm('')
    setError(null)
    setBusy(false)
    setOpenSections(focus === 'password' ? ['contact'] : ['personal'])
  }, [open, focus])

  function patch(key: keyof AccountDetails, value: string) {
    setDetails((current) => ({ ...current, [key]: value }))
    setError(null)
  }

  function showSection(id: SectionId) {
    setOpenSections([id])
    window.setTimeout(() => {
      document.getElementById(`${id}-section`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 40)
  }

  function toggleSection(id: SectionId) {
    setOpenSections((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    )
  }

  const dirty = !sameDetails(details, baseline) || password.length > 0 || confirm.length > 0

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    const firstName = details.firstName.trim()
    const lastName = details.lastName.trim()
    if (!firstName) {
      setError('Enter a first name.')
      showSection('personal')
      return
    }
    if (!google && (password || confirm)) {
      if (password.length < 6) {
        setError('Use at least 6 characters for the password.')
        showSection('contact')
        return
      }
      if (password !== confirm) {
        setError('Those passwords do not match.')
        showSection('contact')
        return
      }
    }

    const next: AccountDetails = {
      firstName,
      lastName,
      phone: details.phone.trim(),
      address1: details.address1.trim(),
      address2: details.address2.trim(),
      city: details.city.trim(),
      state: details.state.trim(),
      zip: details.zip.trim(),
    }
    const displayName = accountDisplayName(next)
    if (!displayName) {
      setError('Enter a first name.')
      return
    }

    setBusy(true)
    setError(null)
    const supabase = getBrowserSupabase()
    const { error: profileError } = await supabase.auth.updateUser({
      data: {
        display_name: displayName,
        first_name: next.firstName,
        last_name: next.lastName,
        phone: next.phone,
        address_line1: next.address1,
        address_line2: next.address2,
        city: next.city,
        state: next.state,
        zip_code: next.zip,
      },
    })
    if (profileError) {
      setBusy(false)
      setError(authErrorMessage(profileError.message))
      return
    }

    if (!google && password) {
      const { error: passwordError } = await supabase.auth.updateUser({ password })
      if (passwordError) {
        setBusy(false)
        setError(authErrorMessage(passwordError.message))
        setBaseline(next)
        return
      }
    }

    setBusy(false)
    onSaved(!google && password ? 'Account and password saved.' : 'Account saved.')
    onClose()
  }

  return (
    <PehModal open={open} onClose={onClose} title="Edit account" size="lg">
      <div className="flex max-h-[100dvh] flex-col sm:max-h-[90vh]">
        <header className="flex shrink-0 items-center gap-2 border-b-2 border-red-500 px-4 py-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-red-500 text-white">
            <UserCircle className="h-5 w-5" />
          </span>
          <h2 className="min-w-0 flex-1 text-left text-lg font-semibold sm:text-xl">Edit account</h2>
          <PehCloseButton onClose={onClose} />
        </header>

        <div className="shrink-0 px-4 pt-3">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {SECTIONS.map((section) => {
              const active = openSections.includes(section.id)
              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => showSection(section.id)}
                  className={`shrink-0 rounded-md px-4 py-2 text-sm font-bold whitespace-nowrap ${
                    active
                      ? 'bg-black text-white'
                      : 'border-2 border-red-500 bg-white text-black hover:bg-red-500 hover:text-white'
                  }`}
                >
                  {section.label}
                </button>
              )
            })}
          </div>
        </div>

        <form
          onSubmit={onSubmit}
          className="max-h-[calc(100dvh-8.75rem)] space-y-3 overflow-y-auto px-4 pb-6 sm:max-h-[calc(90vh-8.75rem)]"
        >
          <AccountSection
            id="personal"
            title="Personal information"
            icon={<User className="h-5 w-5" />}
            open={openSections.includes('personal')}
            onToggle={() => toggleSection('personal')}
          >
            <div className="flex items-center gap-4">
              <AccountAvatar user={user} size="lg" />
              <div className="min-w-0">
                <p className="truncate text-sm font-bold">{user.email}</p>
                <p className="text-xs font-bold uppercase tracking-wide text-red-500">
                  Signed in with {google ? 'Google' : 'Email'}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field
                label="First name"
                value={details.firstName}
                onChange={(value) => patch('firstName', value)}
                autoComplete="given-name"
                required
              />
              <Field
                label="Last name"
                value={details.lastName}
                onChange={(value) => patch('lastName', value)}
                autoComplete="family-name"
              />
            </div>
          </AccountSection>

          <AccountSection
            id="address"
            title="Address"
            icon={<MapPin className="h-5 w-5" />}
            open={openSections.includes('address')}
            onToggle={() => toggleSection('address')}
          >
            <Field
              label="Street"
              value={details.address1}
              onChange={(value) => patch('address1', value)}
              autoComplete="address-line1"
            />
            <Field
              label="Apt, suite"
              value={details.address2}
              onChange={(value) => patch('address2', value)}
              autoComplete="address-line2"
            />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="col-span-2 sm:col-span-1">
                <Field
                  label="City"
                  value={details.city}
                  onChange={(value) => patch('city', value)}
                  autoComplete="address-level2"
                />
              </div>
              <Field
                label="State"
                value={details.state}
                onChange={(value) => patch('state', value)}
                autoComplete="address-level1"
              />
              <Field
                label="ZIP"
                value={details.zip}
                onChange={(value) => patch('zip', value)}
                autoComplete="postal-code"
              />
            </div>
          </AccountSection>

          <AccountSection
            id="contact"
            title="Contact"
            icon={<Mail className="h-5 w-5" />}
            open={openSections.includes('contact')}
            onToggle={() => toggleSection('contact')}
          >
            <Field
              label="Phone"
              value={details.phone}
              onChange={(value) => patch('phone', value)}
              autoComplete="tel"
              type="tel"
            />
            <Field
              label="Email"
              value={user.email ?? ''}
              onChange={() => {}}
              readOnly
              note="This email is your sign-in. Contact PavExpert Hub if it needs to change."
            />
            {google ? (
              <p className="text-sm text-neutral-600">Password is managed by Google.</p>
            ) : (
              <>
                <Field
                  label="New password"
                  value={password}
                  onChange={setPassword}
                  type="password"
                  autoComplete="new-password"
                  note="Leave blank to keep the current password."
                />
                <Field
                  label="Confirm password"
                  value={confirm}
                  onChange={setConfirm}
                  type="password"
                  autoComplete="new-password"
                />
              </>
            )}
          </AccountSection>

          {error && <p className="text-sm font-medium text-red-700">{error}</p>}

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={() => setDeleteOpen(true)}
              disabled={busy}
              className="flex h-12 items-center gap-2 rounded-md bg-red-600 px-5 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-60"
            >
              <AlertTriangle className="h-5 w-5" />
              Delete account
            </button>
          </div>

          {dirty ? (
            <button
              type="submit"
              disabled={busy}
              className="h-12 w-full rounded-md border-2 border-red-500 bg-black text-sm font-bold text-white hover:bg-red-500 disabled:opacity-60"
            >
              {busy ? 'Saving...' : 'Save changes'}
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="h-12 w-full rounded-md border-2 border-red-500 bg-black text-sm font-bold text-white hover:bg-red-500"
            >
              Close
            </button>
          )}
        </form>
      </div>
      <DeleteAccountDialog open={deleteOpen} onClose={() => setDeleteOpen(false)} />
    </PehModal>
  )
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  required,
  readOnly,
  autoComplete,
  note,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  required?: boolean
  readOnly?: boolean
  autoComplete?: string
  note?: string
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </span>
      <input
        type={type}
        value={value}
        readOnly={readOnly}
        autoComplete={autoComplete}
        onChange={(event) => onChange(event.target.value)}
        className={fieldClass(Boolean(value), readOnly)}
      />
      {note && <p className="mt-1 text-xs text-neutral-500">{note}</p>}
    </label>
  )
}
