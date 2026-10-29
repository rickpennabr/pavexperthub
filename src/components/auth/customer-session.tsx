'use client'

import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import type { User } from '@supabase/supabase-js'
import { getBrowserSupabase } from '@/lib/customer-auth'

interface CustomerSessionValue {
  user: User | null
  ready: boolean
  /** True once we know whether this account is an admin. */
  profileReady: boolean
  isAdmin: boolean
}

const CustomerSessionContext = createContext<CustomerSessionValue | null>(null)

export function CustomerSessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [ready, setReady] = useState(false)
  const [profileReady, setProfileReady] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const seenUserId = useRef<string | null | undefined>(undefined)

  useEffect(() => {
    const supabase = getBrowserSupabase()
    let active = true

    const publish = (next: User | null) => {
      const id = next?.id ?? null
      setUser(next)
      setReady(true)
      if (seenUserId.current === id) return
      seenUserId.current = id
      if (next) {
        setProfileReady(false)
        return
      }
      setIsAdmin(false)
      setProfileReady(true)
    }

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return
      publish(data.session?.user ?? null)
    })

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      publish(session?.user ?? null)
    })

    return () => {
      active = false
      data.subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (!user) {
      setIsAdmin(false)
      setProfileReady(true)
      return
    }
    let active = true
    setProfileReady(false)
    void (async () => {
      try {
        const { data } = await getBrowserSupabase().rpc('sync_my_profile')
        if (!active) return
        const body = data as { is_admin?: boolean } | null
        setIsAdmin(body?.is_admin === true)
        setProfileReady(true)
      } catch {
        if (!active) return
        setIsAdmin(false)
        setProfileReady(true)
      }
    })()
    return () => {
      active = false
    }
  }, [user])

  const value = useMemo(
    () => ({ user, ready, profileReady, isAdmin }),
    [user, ready, profileReady, isAdmin]
  )
  return (
    <CustomerSessionContext.Provider value={value}>
      {children}
    </CustomerSessionContext.Provider>
  )
}

export function useCustomerSession() {
  const value = useContext(CustomerSessionContext)
  if (!value) {
    throw new Error('useCustomerSession must be used inside CustomerSessionProvider')
  }
  return value
}
