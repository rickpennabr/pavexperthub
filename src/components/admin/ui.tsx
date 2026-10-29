'use client'

import { useEffect, type ReactNode } from 'react'

export const fieldClass =
  'h-10 w-full rounded-md border-2 border-red-500 px-3 text-sm text-black outline-none focus:border-red-600'

export const areaClass =
  'w-full rounded-md border-2 border-red-500 px-3 py-2 text-sm text-black outline-none focus:border-red-600'

export function FullScreenLock() {
  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [])
  return null
}

export function AdminSpinner({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <div className="h-8 w-8 animate-spin rounded-sm border-2 border-black bg-red-500 shadow-lg rotate-45" />
      <p className="mt-3 text-sm font-medium text-neutral-600">{label}</p>
    </div>
  )
}

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold text-black">{title}</h1>
        <p className="mt-1 max-w-2xl text-sm text-neutral-600">{description}</p>
      </div>
      {action}
    </div>
  )
}

export function PrimaryButton({
  children,
  type = 'button',
  disabled,
  onClick,
}: {
  children: ReactNode
  type?: 'button' | 'submit'
  disabled?: boolean
  onClick?: () => void
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className="rounded-md border-2 border-red-500 bg-black px-4 py-2 text-sm font-bold text-white hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {children}
    </button>
  )
}

export function SecondaryButton({
  children,
  type = 'button',
  disabled,
  onClick,
}: {
  children: ReactNode
  type?: 'button' | 'submit'
  disabled?: boolean
  onClick?: () => void
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className="rounded-md border-2 border-black bg-white px-4 py-2 text-sm font-bold text-black hover:border-red-500 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {children}
    </button>
  )
}

export function SavedBanner({ message }: { message: string | null }) {
  if (!message) return null
  return (
    <p className="mb-4 rounded-md border-2 border-black bg-white px-4 py-2 text-sm font-bold text-black">
      {message}
    </p>
  )
}

export function ErrorNote({ message }: { message: string | null }) {
  if (!message) return null
  return (
    <p className="mb-4 rounded-md border-2 border-red-500 bg-red-50 px-4 py-2 text-sm font-medium text-red-700">
      {message}
    </p>
  )
}

export function SearchField({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (value: string) => void
  placeholder: string
}) {
  return (
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className={`${fieldClass} mb-4 max-w-sm`}
    />
  )
}

export function TextField({
  label,
  value,
  onChange,
  type = 'text',
  required = false,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  required?: boolean
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-neutral-600">{label}</span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={fieldClass}
      />
    </label>
  )
}

export function AreaField({
  label,
  value,
  onChange,
  rows = 4,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  rows?: number
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-neutral-600">{label}</span>
      <textarea
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={areaClass}
      />
    </label>
  )
}

export { AdminTable, deleteSelected } from '@/components/admin/admin-table'
export type { AdminColumn } from '@/components/admin/admin-table'

export function RowActions({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="flex justify-end gap-2">
      <button type="button" onClick={onEdit} className="font-bold text-black hover:text-red-600">
        Edit
      </button>
      <button type="button" onClick={onDelete} className="font-bold text-red-600 hover:text-black">
        Delete
      </button>
    </div>
  )
}

export function AdminDialog({
  title,
  children,
  onClose,
}: {
  title: string
  children: ReactNode
  onClose: () => void
}) {
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border-2 border-red-500 bg-white p-5 text-black shadow-2xl">
        <div className="mb-4 flex items-start justify-between gap-3">
          <h2 className="text-xl font-bold">{title}</h2>
          <button type="button" onClick={onClose} className="text-sm font-bold text-neutral-500 hover:text-black">
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export function EmptyState({ label }: { label: string }) {
  return (
    <div className="rounded-lg border-2 border-dashed border-red-500 bg-white px-4 py-12 text-center text-sm text-neutral-600">
      {label}
    </div>
  )
}

export function PublishedBadge({ published }: { published: boolean }) {
  return (
    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-bold ${published ? 'bg-red-500 text-white' : 'bg-neutral-200 text-neutral-700'}`}>
      {published ? 'Published' : 'Draft'}
    </span>
  )
}
