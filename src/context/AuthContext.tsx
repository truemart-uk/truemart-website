'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User, Session } from '@supabase/supabase-js'

export type UserRole = 'customer' | 'admin' | 'staff' | 'vendor'

type AuthContextType = {
  user: User | null
  session: Session | null
  loading: boolean
  isRecoverySession: boolean
  role: UserRole | null
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null, session: null, loading: true,
  isRecoverySession: false,
  role: null,
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser]                    = useState<User | null>(null)
  const [session, setSession]              = useState<Session | null>(null)
  const [loading, setLoading]              = useState(true)
  const [isRecoverySession, setIsRecovery] = useState(false)
  const [role, setRole]                    = useState<UserRole | null>(null)
  const supabase = createClient()

  async function fetchRole(userId: string) {
    const { data } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single()
    setRole((data?.role as UserRole) ?? 'customer')
  }

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsRecovery(true)
        setSession(session)
        setUser(session?.user ?? null)
        setRole(null)
      } else if (session?.user) {
        setIsRecovery(false)
        setSession(session)
        setUser(session.user)
        fetchRole(session.user.id)
      } else {
        setIsRecovery(false)
        setSession(null)
        setUser(null)
        setRole(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    setIsRecovery(false)
    setRole(null)
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, isRecoverySession, role, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)