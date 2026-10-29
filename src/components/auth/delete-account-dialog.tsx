'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { AlertTriangle, Mail, Shield, Trash2, UserCircle } from 'lucide-react'
import { PehCloseButton, PehModal } from '@/components/common/peh-modal'
import { deleteMyAccount, getAccountDeleteMethod } from '@/app/account/actions'
import { getBrowserSupabase } from '@/lib/customer-auth'

interface DeleteAccountDialogProps {
  open: boolean
  onClose: () => void
}

const LOST = [
  { icon: UserCircle, label: 'Your profile and sign-in' },
  { icon: Mail, label: 'Your name, phone, and address' },
  { icon: Shield, label: 'Admin access on this account, if you have any' },
]

export function DeleteAccountDialog({ open, onClose }: DeleteAccountDialogProps) {
  const [step, setStep] = useState<'warn' | 'proof'>('warn')
  const [hasPassword, setHasPassword] = useState(true)
  const [proof, setProof] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!open) return
    setStep('warn')
    setHasPassword(true)
    setProof('')
    setError(null)
    setBusy(false)
  }, [open])

  function close() {
    if (busy) return
    onClose()
  }

  async function goToProof() {
    setBusy(true)
    setError(null)
    const method = await getAccountDeleteMethod()
    if (!method.ok) {
      setBusy(false)
      setError(method.error)
      return
    }
    setHasPassword(method.hasPassword)
    setProof('')
    setError(null)
    setStep('proof')
    setBusy(false)
  }

  async function confirmDelete(event: FormEvent) {
    event.preventDefault()
    if (!proof.trim()) {
      setError(hasPassword ? 'Enter your password.' : 'Enter the email on this account.')
      return
    }

    setBusy(true)
    setError(null)
    const result = await deleteMyAccount(proof)
    if (!result.success) {
      setBusy(false)
      setError(result.error || 'Could not delete this account.')
      return
    }

    try {
      await getBrowserSupabase().auth.signOut({ scope: 'local' })
    } catch {
      // The auth user is already gone. Drop the local session and leave.
    }
    window.location.assign('/account?deleted=1')
  }

  const title = step === 'proof' ? "Confirm it's you" : 'Delete account'

  return (
    <PehModal open={open} onClose={close} title={title} elevated>
      <div className="flex max-h-[100dvh] flex-col sm:max-h-[90vh]">
        <header className="flex shrink-0 items-center gap-2 border-b-2 border-red-500 px-4 py-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-red-600 text-white">
            <AlertTriangle className="h-5 w-5" />
          </span>
          <h2 className="min-w-0 flex-1 text-left text-lg font-semibold">{title}</h2>
          <PehCloseButton onClose={close} />
        </header>

        {step === 'warn' ? (
          <div className="space-y-3 overflow-y-auto px-4 py-4">
            <p className="text-sm font-medium text-black">
              Are you sure? This permanently deletes your account. This cannot be undone.
            </p>
            <div className="rounded-md border-2 border-red-500 bg-red-50 p-3">
              <p className="text-sm leading-relaxed text-red-700">
                This deletes your PavExpert Hub sign-in and the profile stored on it.
              </p>
            </div>
            <div className="rounded-md border border-neutral-200 bg-neutral-50 p-3">
              <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                <Trash2 className="h-4 w-4" />
                What will be deleted
              </h3>
              <ul className="space-y-1.5 text-sm">
                {LOST.map((item) => (
                  <li key={item.label} className="flex items-center gap-2">
                    <item.icon className="h-4 w-4 shrink-0 text-red-500" />
                    <span>{item.label}</span>
                  </li>
                ))}
              </ul>
            </div>
            {error && <p className="text-sm font-medium text-red-700">{error}</p>}
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={close}
                disabled={busy}
                className="h-12 flex-1 rounded-md border-2 border-red-500 bg-white text-sm font-bold text-black hover:bg-red-500 hover:text-white disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void goToProof()}
                disabled={busy}
                className="h-12 flex-1 rounded-md bg-red-600 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-60"
              >
                {busy ? 'Checking...' : 'Delete account'}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={confirmDelete} className="space-y-3 px-4 py-4">
            <p className="text-sm text-neutral-700">
              {hasPassword
                ? 'Enter your password to delete this account.'
                : 'This account uses Google. Type the email on the account to confirm.'}
            </p>
            <label className="block">
              <span className="mb-1 block text-sm font-medium">
                {hasPassword ? 'Password' : 'Email'}
                <span className="text-red-500"> *</span>
              </span>
              <input
                type={hasPassword ? 'password' : 'email'}
                value={proof}
                autoFocus
                autoComplete={hasPassword ? 'current-password' : 'email'}
                onChange={(event) => {
                  setProof(event.target.value)
                  setError(null)
                }}
                className={`h-12 w-full rounded-md border-2 border-red-500 px-4 text-sm outline-none ${
                  proof
                    ? 'bg-black text-white caret-white placeholder:text-white/60'
                    : 'bg-white text-black placeholder:text-neutral-400'
                }`}
              />
            </label>
            {error && <p className="text-sm font-medium text-red-700">{error}</p>}
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  if (busy) return
                  setStep('warn')
                  setProof('')
                  setError(null)
                }}
                disabled={busy}
                className="h-12 flex-1 rounded-md border-2 border-red-500 bg-white text-sm font-bold text-black hover:bg-red-500 hover:text-white disabled:opacity-60"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={busy || !proof.trim()}
                className="h-12 flex-1 rounded-md bg-red-600 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-60"
              >
                {busy ? 'Deleting...' : 'Continue'}
              </button>
            </div>
          </form>
        )}
      </div>
    </PehModal>
  )
}
