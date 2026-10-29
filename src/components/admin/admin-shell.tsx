'use client'

import { useState, type ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  LayoutDashboard,
  Package,
  Truck,
  Video,
  Wrench,
} from 'lucide-react'
import { ProfileButton } from '@/components/auth/profile-button'
import { CustomerSessionProvider } from '@/components/auth/customer-session'
import { FullScreenLock } from '@/components/admin/ui'
import type { AdminUser } from '@/types/admin'

const items = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/services', label: 'Services', icon: Wrench },
  { href: '/admin/suppliers', label: 'Suppliers', icon: Truck },
  { href: '/admin/blog', label: 'Blog', icon: FileText },
  { href: '/admin/videos', label: 'Videos', icon: Video },
]

function isActive(pathname: string, href: string) {
  if (href === '/admin') return pathname === '/admin'
  return pathname === href || pathname.startsWith(`${href}/`)
}

function NavLink({
  href,
  label,
  icon: Icon,
  active,
  collapsed,
}: {
  href: string
  label: string
  icon: typeof Package
  active: boolean
  collapsed: boolean
}) {
  return (
    <Link
      href={href}
      title={label}
      className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-bold transition-colors ${
        active ? 'bg-red-600 text-white' : 'text-white hover:bg-white/10'
      } ${collapsed ? 'justify-center px-2' : ''}`}
    >
      <Icon className={`h-5 w-5 shrink-0 ${active ? 'text-white' : 'text-red-500'}`} />
      {!collapsed && <span>{label}</span>}
    </Link>
  )
}

export function AdminShell({ children }: { user: AdminUser; children: ReactNode }) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [logoOk, setLogoOk] = useState(true)

  return (
    <CustomerSessionProvider>
    <div className="fixed inset-0 z-50 flex flex-col bg-black text-white">
      <FullScreenLock />
      <header className="grid h-16 shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-3 border-b-2 border-red-500 bg-white px-3 text-black sm:px-5">
        <Link href="/" title="Back to site" className="flex min-w-0 items-center">
          {logoOk && (
            <Image
              src="/images/logo/pav-expert-hub-logo.png"
              alt="PavExpert Hub"
              width={140}
              height={48}
              className="h-10 w-auto"
              onError={() => setLogoOk(false)}
            />
          )}
        </Link>
        <div className="min-w-0 text-center">
          <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-red-500">PavExpert Hub</span>
          <span className="block truncate text-sm font-bold">Administration</span>
        </div>
        <div className="flex items-center justify-end">
          <ProfileButton />
        </div>
      </header>

      <nav className="flex gap-2 overflow-x-auto border-b border-red-500 bg-black px-3 py-2 lg:hidden">
        {items.map((item) => (
          <NavLink
            key={item.href}
            {...item}
            active={isActive(pathname, item.href)}
            collapsed={false}
          />
        ))}
      </nav>

      <div className="flex min-h-0 flex-1">
        <aside className={`relative hidden shrink-0 flex-col border-r-2 border-red-600 bg-black lg:flex ${collapsed ? 'w-20' : 'w-64'}`}>
          <button
            type="button"
            onClick={() => setCollapsed((value) => !value)}
            className="absolute -right-3 top-6 z-10 rounded-full bg-red-600 p-1 text-white shadow-lg hover:bg-black"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
          <nav className={`flex flex-1 flex-col gap-2 overflow-y-auto py-3 pl-3 ${collapsed ? 'pr-3' : 'pr-8'}`}>
            {items.map((item) => (
              <NavLink
                key={item.href}
                {...item}
                active={isActive(pathname, item.href)}
                collapsed={collapsed}
              />
            ))}
          </nav>
        </aside>
        <main className="min-h-0 flex-1 overflow-y-auto bg-neutral-100 text-black">
          <div className="w-full p-4 md:p-6">{children}</div>
        </main>
      </div>
    </div>
    </CustomerSessionProvider>
  )
}
