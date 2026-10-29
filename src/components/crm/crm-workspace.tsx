'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { CustomerFormModal } from '@/components/crm/customer-form-modal'
import { useCustomerSession } from '@/components/auth/customer-session'
import { accountRole } from '@/lib/customer-auth'
import { deleteCrmCustomer, listCrmCustomers, type CrmCustomer } from '@/lib/pro-data'

export function CrmWorkspace() {
  const { user, ready } = useCustomerSession()
  const role = user ? accountRole(user) : null
  const [customers, setCustomers] = useState<CrmCustomer[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<CrmCustomer | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [confirmId, setConfirmId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setCustomers(await listCrmCustomers())
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not load customers.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!ready || role !== 'installer') {
      setLoading(false)
      return
    }
    void load()
  }, [ready, role, load])

  async function onDelete(id: string) {
    setError(null)
    try {
      await deleteCrmCustomer(id)
      setConfirmId(null)
      await load()
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not delete that customer.')
    }
  }

  if (!ready) {
    return <p className="bg-white p-6 text-sm text-neutral-600">Loading account...</p>
  }

  if (!user) {
    return (
      <div className="bg-white p-4 text-black sm:p-8">
        <h1 className="text-3xl font-bold">ProCRM</h1>
        <p className="mt-2 text-sm text-neutral-600">Sign in to manage customers.</p>
        <Link href="/account" className="mt-4 inline-flex h-12 items-center rounded-md border-2 border-red-500 bg-black px-4 text-sm font-bold text-white">
          Sign in
        </Link>
      </div>
    )
  }

  if (role !== 'installer') {
    return (
      <div className="bg-white p-4 text-black sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-500">PavExpert Hub</p>
        <h1 className="mt-1 text-3xl font-bold">ProCRM</h1>
        <p className="mt-2 max-w-lg text-sm text-neutral-600">
          ProCRM is for installer accounts.
        </p>
        <Link href="/account" className="mt-4 inline-flex h-12 items-center rounded-md border-2 border-red-500 bg-black px-4 text-sm font-bold text-white">
          Manage account
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-white p-4 text-black sm:p-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-500">PavExpert Hub</p>
          <h1 className="mt-1 text-3xl font-bold">ProCRM</h1>
          <p className="mt-1 text-sm text-neutral-600">People and companies you do work for.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditing(null)
            setFormOpen(true)
          }}
          className="h-12 rounded-md border-2 border-red-500 bg-black px-4 text-sm font-bold text-white hover:bg-red-500"
        >
          New customer
        </button>
      </div>

      {error && <p className="mt-4 text-sm font-medium text-red-700">{error}</p>}
      {loading && <p className="mt-4 text-sm text-neutral-600">Loading customers...</p>}

      {!loading && customers.length === 0 && (
        <p className="mt-6 rounded-md border-2 border-red-500 px-4 py-6 text-sm text-neutral-600">
          No customers yet. Add the first one to start a job record.
        </p>
      )}

      <ul className="mt-4 space-y-3">
        {customers.map((customer) => (
          <li key={customer.id} className="rounded-md border-2 border-red-500 p-3">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-bold">{customer.display_name}</p>
                <p className="text-xs font-bold uppercase tracking-wide text-red-500">
                  {customer.customer_type === 'business' ? 'Business' : 'Individual'}
                </p>
                <p className="mt-1 text-sm text-neutral-600">
                  {[customer.phone, customer.email, [customer.city, customer.state].filter(Boolean).join(', ')].filter(Boolean).join(' · ')}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditing(customer)
                    setFormOpen(true)
                  }}
                  className="h-10 rounded-md border-2 border-black px-3 text-sm font-bold hover:border-red-500 hover:bg-red-500 hover:text-white"
                >
                  Edit
                </button>
                {confirmId === customer.id ? (
                  <button
                    type="button"
                    onClick={() => void onDelete(customer.id)}
                    className="h-10 rounded-md border-2 border-red-500 bg-red-500 px-3 text-sm font-bold text-white"
                  >
                    Confirm delete
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmId(customer.id)}
                    className="h-10 rounded-md border-2 border-red-500 px-3 text-sm font-bold text-red-600 hover:bg-red-500 hover:text-white"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>

      <CustomerFormModal
        open={formOpen}
        customer={editing}
        onClose={() => setFormOpen(false)}
        onSaved={() => void load()}
      />
    </div>
  )
}
