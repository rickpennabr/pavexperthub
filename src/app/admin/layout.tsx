import type { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { AdminSetup } from '@/components/admin/admin-login'
import { AdminShell } from '@/components/admin/admin-shell'
import { getAdminGate } from '@/app/admin/actions'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Admin · PavExpert Hub',
  description: 'Manage products, services, suppliers, blog posts, and videos.',
  robots: { index: false, follow: false },
}

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const gate = await getAdminGate()

  if (!gate.ready) {
    return <AdminSetup />
  }

  if (gate.access === 'signed-out') {
    redirect('/account?next=/admin')
  }

  if (!gate.user) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black p-4 text-black">
        <div className="w-full max-w-md rounded-lg border-2 border-red-500 bg-white p-8 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-500">PavExpert Hub</p>
          <h1 className="mt-2 text-2xl font-bold">Admin access required</h1>
          <p className="mt-3 text-sm text-neutral-700">
            This account is signed in, and it is not an administrator.
          </p>
          <a href="/" className="mt-6 inline-block rounded-md border-2 border-black px-4 py-2 text-sm font-bold hover:border-red-500 hover:text-red-600">
            Back to the site
          </a>
        </div>
      </div>
    )
  }

  return <AdminShell user={gate.user}>{children}</AdminShell>
}
