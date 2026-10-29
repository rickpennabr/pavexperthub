'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { FileText, Package, Truck, Video, Wrench } from 'lucide-react'
import { loadDashboard } from '@/app/admin/actions'
import { AdminSpinner, ErrorNote } from '@/components/admin/ui'
import type { DashboardData } from '@/types/admin'

const cards = [
  { key: 'products', label: 'Products', href: '/admin/products', icon: Package },
  { key: 'services', label: 'Services', href: '/admin/services', icon: Wrench },
  { key: 'suppliers', label: 'Suppliers', href: '/admin/suppliers', icon: Truck },
  { key: 'posts', label: 'Blog posts', href: '/admin/blog', icon: FileText },
  { key: 'videos', label: 'Videos', href: '/admin/videos', icon: Video },
] as const

export function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    loadDashboard().then((result) => {
      if (cancelled) return
      if (!result.ok || !result.data) {
        setError(result.error || 'Could not load the dashboard.')
        return
      }
      setData(result.data)
    })
    return () => {
      cancelled = true
    }
  }, [])

  if (error) return <ErrorNote message={error} />
  if (!data) return <AdminSpinner label="Loading dashboard..." />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-black">Dashboard</h1>
        <p className="mt-1 text-sm text-neutral-600">
          Products, services, suppliers, blog posts, and videos for the public site.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <Link
              key={card.key}
              href={card.href}
              className="rounded-lg border-2 border-red-500 bg-white p-4 text-black transition-colors hover:border-black"
            >
              <Icon className="h-5 w-5 text-red-500" />
              <p className="mt-3 text-3xl font-bold">{data.counts[card.key]}</p>
              <p className="text-sm font-bold">{card.label}</p>
            </Link>
          )
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-lg border-2 border-red-500 bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-bold">Latest products</h2>
            <Link href="/admin/products" className="text-sm font-bold text-red-600 hover:text-black">
              Manage
            </Link>
          </div>
          {data.products.length === 0 ? (
            <p className="text-sm text-neutral-600">No products yet.</p>
          ) : (
            <ul className="divide-y divide-neutral-200">
              {data.products.map((product) => (
                <li key={product.base_product_id} className="flex items-center justify-between gap-3 py-2 text-sm">
                  <span className="font-medium">{product.product_name}</span>
                  <span className="text-neutral-500">{product.brand_name || product.product_type || 'Product'}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-lg border-2 border-red-500 bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-bold">Services</h2>
            <Link href="/admin/services" className="text-sm font-bold text-red-600 hover:text-black">
              Manage
            </Link>
          </div>
          {data.services.length === 0 ? (
            <p className="text-sm text-neutral-600">No services yet.</p>
          ) : (
            <ul className="divide-y divide-neutral-200">
              {data.services.map((service) => (
                <li key={service.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                  <span className="font-medium">{service.name}</span>
                  <span className="text-neutral-500">{service.price}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}
