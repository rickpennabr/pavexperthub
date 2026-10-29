'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { Building2, Mail, MapPin, StickyNote, User } from 'lucide-react'
import { AccountSection } from '@/components/auth/account-chrome'
import { PehCloseButton, PehModal } from '@/components/common/peh-modal'
import { PehArea, PehChoice, PehField } from '@/components/forms/peh-field'
import {
  customerDisplayName,
  emptyCustomer,
  saveCrmCustomer,
  type CrmCustomer,
  type CrmCustomerInput,
} from '@/lib/pro-data'

type SectionId = 'type' | 'basic' | 'contact' | 'address' | 'notes'

const SECTIONS: { id: SectionId; label: string }[] = [
  { id: 'type', label: 'Type' },
  { id: 'basic', label: 'Basic info' },
  { id: 'contact', label: 'Contact' },
  { id: 'address', label: 'Address' },
  { id: 'notes', label: 'Notes' },
]

interface CustomerFormModalProps {
  open: boolean
  customer: CrmCustomer | null
  onClose: () => void
  onSaved: () => void
}

function fromCustomer(customer: CrmCustomer | null): CrmCustomerInput {
  if (!customer) return emptyCustomer()
  return {
    customer_type: customer.customer_type,
    first_name: customer.first_name,
    last_name: customer.last_name,
    company_name: customer.company_name,
    email: customer.email,
    phone: customer.phone,
    address_line1: customer.address_line1,
    city: customer.city,
    state: customer.state,
    zip_code: customer.zip_code,
    notes: customer.notes,
  }
}

export function CustomerFormModal({ open, customer, onClose, onSaved }: CustomerFormModalProps) {
  const [form, setForm] = useState<CrmCustomerInput>(emptyCustomer())
  const [openSections, setOpenSections] = useState<SectionId[]>(['type'])
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!open) return
    setForm(fromCustomer(customer))
    setOpenSections(['type'])
    setError(null)
    setBusy(false)
  }, [open, customer])

  function patch(key: keyof CrmCustomerInput, value: string) {
    setForm((current) => ({ ...current, [key]: value }))
    setError(null)
  }

  function showSection(id: SectionId) {
    setOpenSections([id])
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setBusy(true)
    setError(null)
    try {
      await saveCrmCustomer(form, customer?.id)
      onSaved()
      onClose()
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not save this customer.')
      setBusy(false)
    }
  }

  return (
    <PehModal open={open} onClose={onClose} title={customer ? 'Edit customer' : 'New customer'} size="lg">
      <div className="flex max-h-[100dvh] flex-col sm:max-h-[90vh]">
        <header className="flex shrink-0 items-center gap-2 border-b-2 border-red-500 px-4 py-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-red-500 text-white">
            <User className="h-5 w-5" />
          </span>
          <h2 className="min-w-0 flex-1 text-left text-lg font-semibold">{customer ? 'Edit customer' : 'New customer'}</h2>
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
                    active ? 'bg-black text-white' : 'border-2 border-red-500 bg-white text-black hover:bg-red-500 hover:text-white'
                  }`}
                >
                  {section.label}
                </button>
              )
            })}
          </div>
        </div>
        <form onSubmit={onSubmit} className="max-h-[calc(100dvh-8.75rem)] space-y-3 overflow-y-auto px-4 pb-6 sm:max-h-[calc(90vh-8.75rem)]">
          <AccountSection
            id="type"
            title="Customer type"
            icon={<Building2 className="h-5 w-5" />}
            open={openSections.includes('type')}
            onToggle={() => setOpenSections((current) => (current.includes('type') ? current.filter((item) => item !== 'type') : [...current, 'type']))}
          >
            <PehChoice
              value={form.customer_type}
              options={[
                { id: 'individual', label: 'Individual' },
                { id: 'business', label: 'Business' },
              ]}
              onChange={(customer_type) => setForm((current) => ({ ...current, customer_type }))}
            />
          </AccountSection>
          <AccountSection
            id="basic"
            title="Basic information"
            icon={<User className="h-5 w-5" />}
            open={openSections.includes('basic')}
            onToggle={() => setOpenSections((current) => (current.includes('basic') ? current.filter((item) => item !== 'basic') : [...current, 'basic']))}
          >
            <div className="grid grid-cols-2 gap-3">
              <PehField label="First name" value={form.first_name} onChange={(value) => patch('first_name', value)} required={form.customer_type === 'individual'} autoComplete="given-name" />
              <PehField label="Last name" value={form.last_name} onChange={(value) => patch('last_name', value)} autoComplete="family-name" />
            </div>
            {form.customer_type === 'business' && (
              <PehField label="Company" value={form.company_name} onChange={(value) => patch('company_name', value)} required autoComplete="organization" />
            )}
            <p className="text-xs text-neutral-500">Saved as {customerDisplayName(form) || 'this customer'}.</p>
          </AccountSection>
          <AccountSection
            id="contact"
            title="Contact"
            icon={<Mail className="h-5 w-5" />}
            open={openSections.includes('contact')}
            onToggle={() => setOpenSections((current) => (current.includes('contact') ? current.filter((item) => item !== 'contact') : [...current, 'contact']))}
          >
            <PehField label="Phone" value={form.phone} onChange={(value) => patch('phone', value)} type="tel" required autoComplete="tel" />
            <PehField label="Email" value={form.email} onChange={(value) => patch('email', value)} type="email" autoComplete="email" />
          </AccountSection>
          <AccountSection
            id="address"
            title="Job address"
            icon={<MapPin className="h-5 w-5" />}
            open={openSections.includes('address')}
            onToggle={() => setOpenSections((current) => (current.includes('address') ? current.filter((item) => item !== 'address') : [...current, 'address']))}
          >
            <PehField label="Street" value={form.address_line1} onChange={(value) => patch('address_line1', value)} autoComplete="address-line1" />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="col-span-2 sm:col-span-1">
                <PehField label="City" value={form.city} onChange={(value) => patch('city', value)} autoComplete="address-level2" />
              </div>
              <PehField label="State" value={form.state} onChange={(value) => patch('state', value)} autoComplete="address-level1" />
              <PehField label="ZIP" value={form.zip_code} onChange={(value) => patch('zip_code', value)} autoComplete="postal-code" />
            </div>
          </AccountSection>
          <AccountSection
            id="notes"
            title="Notes"
            icon={<StickyNote className="h-5 w-5" />}
            open={openSections.includes('notes')}
            onToggle={() => setOpenSections((current) => (current.includes('notes') ? current.filter((item) => item !== 'notes') : [...current, 'notes']))}
          >
            <PehArea label="Notes" value={form.notes} onChange={(value) => patch('notes', value)} />
          </AccountSection>
          {error && <p className="text-sm font-medium text-red-700">{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="h-12 w-full rounded-md border-2 border-red-500 bg-black text-sm font-bold text-white hover:bg-red-500 disabled:opacity-60"
          >
            {busy ? 'Saving...' : 'Save customer'}
          </button>
        </form>
      </div>
    </PehModal>
  )
}
