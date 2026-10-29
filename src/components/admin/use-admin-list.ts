'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { ActionResult } from '@/types/admin'

export function useAdminList<T>(loader: () => Promise<ActionResult<T[]>>) {
  const router = useRouter()
  const [rows, setRows] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [banner, setBanner] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    const result = await loader()
    if (!result.ok) {
      if (result.error === 'unauthorized') {
        router.refresh()
        return
      }
      setError(result.error || 'Could not load records.')
      setLoading(false)
      return
    }
    setRows(result.data ?? [])
    setError(null)
    setLoading(false)
  }, [loader, router])

  useEffect(() => {
    void refresh()
  }, [refresh])

  useEffect(() => {
    if (!banner) return
    const timer = window.setTimeout(() => setBanner(null), 3000)
    return () => window.clearTimeout(timer)
  }, [banner])

  return { rows, setRows, loading, error, banner, setBanner, refresh }
}
