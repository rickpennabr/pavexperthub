'use client'

import type { ReactNode } from 'react'

export function pehControlClass(filled: boolean) {
  return `h-12 w-full rounded-md border-2 border-red-500 px-3 text-sm outline-none ${
    filled ? 'bg-black text-white' : 'bg-white text-black'
  }`
}

export function PehField({
  label,
  value,
  onChange,
  type = 'text',
  required,
  autoComplete,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  required?: boolean
  autoComplete?: string
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
        autoComplete={autoComplete}
        onChange={(event) => onChange(event.target.value)}
        className={pehControlClass(Boolean(value))}
      />
    </label>
  )
}

export function PehArea({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium">{label}</span>
      <textarea
        value={value}
        rows={4}
        onChange={(event) => onChange(event.target.value)}
        className={`w-full rounded-md border-2 border-red-500 px-3 py-2 text-sm outline-none ${
          value ? 'bg-black text-white' : 'bg-white text-black'
        }`}
      />
    </label>
  )
}

export function PehChoice<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T | null
  options: { id: T; label: string }[]
  onChange: (value: T) => void
}) {
  return (
    <div className={`grid gap-2 ${options.length > 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-2'}`}>
      {options.map((option) => {
        const active = value === option.id
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            className={`h-12 rounded-md border-2 border-red-500 px-3 text-sm font-bold ${
              active ? 'bg-black text-white' : 'bg-white text-black hover:bg-red-500 hover:text-white'
            }`}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

export function PehSelect({
  label,
  value,
  onChange,
  children,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  children: ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className={pehControlClass(Boolean(value))}>
        {children}
      </select>
    </label>
  )
}
