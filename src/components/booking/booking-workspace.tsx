'use client'

import { useCallback, useEffect, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useCustomerSession } from '@/components/auth/customer-session'
import { PehArea, PehChoice, PehField, PehSelect } from '@/components/forms/peh-field'
import { accountRole, customerLabel } from '@/lib/customer-auth'
import {
  BOOKING_SERVICES,
  BOOKING_TIMES,
  bookingSchema,
  createCustomerBooking,
  listBookings,
  updateBookingStatus,
  type BookingInput,
  type BookingRow,
  type BookingStatus,
} from '@/lib/pro-data'

type Step = 'service' | 'when' | 'where'

const STEPS: { id: Step; label: string }[] = [
  { id: 'service', label: 'Service' },
  { id: 'when', label: 'When' },
  { id: 'where', label: 'Where' },
]

const EMPTY: BookingInput = {
  service: 'Free estimate visit',
  appointment_date: '',
  appointment_time: '9:00 AM',
  address_line1: '',
  city: '',
  state: 'NV',
  zip_code: '',
  notes: '',
}

function dateParts(value: string) {
  const [year = '', month = '', day = ''] = value.split('-')
  return { year, month, day }
}

function joinDate(year: string, month: string, day: string) {
  if (!year || !month || !day) return ''
  return `${year}-${month}-${day.padStart(2, '0')}`
}

export function BookingWorkspace() {
  const { user, ready } = useCustomerSession()
  const role = user ? accountRole(user) : null
  const [step, setStep] = useState<Step>('service')
  const [form, setForm] = useState<BookingInput>(EMPTY)
  const [bookings, setBookings] = useState<BookingRow[]>([])
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      setBookings(await listBookings())
      setError(null)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not load bookings.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!ready || !user) {
      setLoading(false)
      return
    }
    void load()
  }, [ready, user, load])

  async function onRequest(event: FormEvent) {
    event.preventDefault()
    const parsed = bookingSchema.safeParse(form)
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Check the booking details.')
      setStep('where')
      return
    }
    setBusy(true)
    setError(null)
    try {
      await createCustomerBooking(parsed.data, user ? customerLabel(user) : 'Customer')
      setNotice('Booking requested. An installer can confirm it.')
      setForm(EMPTY)
      setStep('service')
      await load()
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not save the booking.')
    } finally {
      setBusy(false)
    }
  }

  async function onStatus(row: BookingRow, status: BookingStatus) {
    setError(null)
    try {
      await updateBookingStatus(row.id, status, status === 'confirmed' ? user?.id : undefined)
      await load()
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not update that booking.')
    }
  }

  if (!ready) return <p className="bg-white p-6 text-sm text-neutral-600">Loading account...</p>

  if (!user) {
    return (
      <div className="bg-white p-4 text-black sm:p-8">
        <h1 className="text-3xl font-bold">ProBooking</h1>
        <p className="mt-2 text-sm text-neutral-600">Sign in to request or manage a booking.</p>
        <Link href="/account" className="mt-4 inline-flex h-12 items-center rounded-md border-2 border-red-500 bg-black px-4 text-sm font-bold text-white">
          Sign in
        </Link>
      </div>
    )
  }

  const parts = dateParts(form.appointment_date)
  const years = [new Date().getFullYear(), new Date().getFullYear() + 1]
  const installer = role === 'installer'

  return (
    <div className="bg-white p-4 text-black sm:p-8">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-500">PavExpert Hub</p>
      <h1 className="mt-1 text-3xl font-bold">ProBooking</h1>
      <p className="mt-1 text-sm text-neutral-600">
        {installer ? 'Confirm visits requested by customers.' : 'Request a visit. Pick the work, the time, and the address.'}
      </p>
      {error && <p className="mt-4 text-sm font-medium text-red-700">{error}</p>}
      {notice && <p className="mt-4 text-sm font-bold">{notice}</p>}

      {!installer && (
        <form onSubmit={onRequest} className="mt-4 max-w-xl space-y-4">
          <div className="flex gap-2 overflow-x-auto">
            {STEPS.map((item, index) => {
              const active = step === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setStep(item.id)}
                  className={`shrink-0 rounded-md px-4 py-2 text-sm font-bold ${
                    active ? 'bg-black text-white' : 'border-2 border-red-500 bg-white text-black'
                  }`}
                >
                  {index + 1}. {item.label}
                </button>
              )
            })}
          </div>

          {step === 'service' && (
            <section className="space-y-3 rounded-lg border-2 border-red-500 p-3">
              <h2 className="text-lg font-semibold">Service</h2>
              <PehChoice
                value={form.service}
                options={BOOKING_SERVICES.map((service) => ({ id: service, label: service }))}
                onChange={(service) => setForm((current) => ({ ...current, service }))}
              />
              <button type="button" onClick={() => setStep('when')} className="h-12 w-full rounded-md border-2 border-red-500 bg-black text-sm font-bold text-white hover:bg-red-500">
                Next
              </button>
            </section>
          )}

          {step === 'when' && (
            <section className="space-y-3 rounded-lg border-2 border-red-500 p-3">
              <h2 className="text-lg font-semibold">When</h2>
              <div className="grid grid-cols-3 gap-2">
                <PehSelect
                  label="Month"
                  value={parts.month}
                  onChange={(month) => setForm((current) => ({ ...current, appointment_date: joinDate(parts.year, month, parts.day) }))}
                >
                  <option value="">Month</option>
                  {Array.from({ length: 12 }, (_, index) => {
                    const month = String(index + 1).padStart(2, '0')
                    return <option key={month} value={month}>{month}</option>
                  })}
                </PehSelect>
                <PehSelect
                  label="Day"
                  value={parts.day}
                  onChange={(day) => setForm((current) => ({ ...current, appointment_date: joinDate(parts.year, parts.month, day) }))}
                >
                  <option value="">Day</option>
                  {Array.from({ length: 31 }, (_, index) => {
                    const day = String(index + 1).padStart(2, '0')
                    return <option key={day} value={day}>{index + 1}</option>
                  })}
                </PehSelect>
                <PehSelect
                  label="Year"
                  value={parts.year}
                  onChange={(year) => setForm((current) => ({ ...current, appointment_date: joinDate(year, parts.month, parts.day) }))}
                >
                  <option value="">Year</option>
                  {years.map((year) => (
                    <option key={year} value={String(year)}>{year}</option>
                  ))}
                </PehSelect>
              </div>
              <PehSelect
                label="Time"
                value={form.appointment_time}
                onChange={(appointment_time) => setForm((current) => ({ ...current, appointment_time: appointment_time as BookingInput['appointment_time'] }))}
              >
                {BOOKING_TIMES.map((time) => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </PehSelect>
              <button type="button" onClick={() => setStep('where')} className="h-12 w-full rounded-md border-2 border-red-500 bg-black text-sm font-bold text-white hover:bg-red-500">
                Next
              </button>
            </section>
          )}

          {step === 'where' && (
            <section className="space-y-3 rounded-lg border-2 border-red-500 p-3">
              <h2 className="text-lg font-semibold">Where</h2>
              <PehField label="Street" value={form.address_line1} onChange={(address_line1) => setForm((current) => ({ ...current, address_line1 }))} required />
              <div className="grid grid-cols-3 gap-2">
                <PehField label="City" value={form.city} onChange={(city) => setForm((current) => ({ ...current, city }))} required />
                <PehField label="State" value={form.state} onChange={(state) => setForm((current) => ({ ...current, state }))} required />
                <PehField label="ZIP" value={form.zip_code} onChange={(zip_code) => setForm((current) => ({ ...current, zip_code }))} required />
              </div>
              <PehArea label="Notes" value={form.notes} onChange={(notes) => setForm((current) => ({ ...current, notes }))} />
              <button type="submit" disabled={busy} className="h-12 w-full rounded-md border-2 border-red-500 bg-black text-sm font-bold text-white hover:bg-red-500 disabled:opacity-60">
                {busy ? 'Sending...' : 'Request booking'}
              </button>
            </section>
          )}
        </form>
      )}

      <h2 className="mb-2 mt-8 text-lg font-semibold">{installer ? 'Requests' : 'Your bookings'}</h2>
      {loading && <p className="text-sm text-neutral-600">Loading bookings...</p>}
      {!loading && bookings.length === 0 && (
        <p className="rounded-md border-2 border-red-500 px-4 py-6 text-sm text-neutral-600">No bookings yet.</p>
      )}
      <ul className="space-y-3">
        {bookings.map((row) => (
          <li key={row.id} className="rounded-md border-2 border-red-500 p-3">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-bold">{row.service}</p>
                <p className="text-sm">{row.appointment_date} · {row.appointment_time}</p>
                <p className="text-sm text-neutral-600">
                  {[row.customer_name, row.address_line1, row.city, row.state, row.zip_code].filter(Boolean).join(', ')}
                </p>
                {row.notes && <p className="mt-1 text-sm text-neutral-600">{row.notes}</p>}
              </div>
              <p className="text-xs font-bold uppercase tracking-wide text-red-500">{row.status}</p>
            </div>
            {installer && row.status === 'requested' && (
              <div className="mt-3 flex gap-2">
                <button type="button" onClick={() => void onStatus(row, 'confirmed')} className="h-10 rounded-md border-2 border-red-500 bg-black px-3 text-sm font-bold text-white">
                  Confirm
                </button>
                <button type="button" onClick={() => void onStatus(row, 'cancelled')} className="h-10 rounded-md border-2 border-red-500 px-3 text-sm font-bold">
                  Decline
                </button>
              </div>
            )}
            {installer && row.status === 'confirmed' && (
              <button type="button" onClick={() => void onStatus(row, 'done')} className="mt-3 h-10 rounded-md border-2 border-red-500 bg-black px-3 text-sm font-bold text-white">
                Mark done
              </button>
            )}
            {!installer && row.status === 'requested' && (
              <button type="button" onClick={() => void onStatus(row, 'cancelled')} className="mt-3 h-10 rounded-md border-2 border-red-500 px-3 text-sm font-bold">
                Cancel request
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
