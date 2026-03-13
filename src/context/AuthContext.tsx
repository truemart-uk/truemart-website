'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User, Session } from '@supabase/supabase-js'

type AuthContextType = {
  user: User | null
  session: Session | null
  loading: boolean
  isRecoverySession: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null, session: null, loading: true,
  isRecoverySession: false,
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser]                    = useState<User | null>(null)
  const [session, setSession]              = useState<Session | null>(null)
  const [loading, setLoading]              = useState(true)
  const [isRecoverySession, setIsRecovery] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    // onAuthStateChange is the single source of truth.
    // It fires immediately with the current session on mount,
    // so we do NOT call getSession() separately — that avoids
    // the race condition where user is set before PASSWORD_RECOVERY fires.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsRecovery(true)
        setSession(session)
        setUser(session?.user ?? null)
      } else {
        setIsRecovery(false)
        setSession(session)
        setUser(session?.user ?? null)
      }
      // Only mark loading done after the first event fires
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    setIsRecovery(false)
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, isRecoverySession, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)