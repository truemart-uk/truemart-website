'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function ResetPasswordPage() {
  const router = useRouter()
  const supabase = createClient()

  const [password, setPassword]     = useState('')
  const [confirm, setConfirm]       = useState('')
  const [error, setError]           = useState('')
  const [loading, setLoading]       = useState(false)
  const [success, setSuccess]       = useState(false)
  const [validSession, setValidSession] = useState(false)
  const [checking, setChecking]     = useState(true)

  // Supabase exchanges the token from the URL hash automatically
  // We just need to confirm a session exists before showing the form
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setValidSession(!!session)
      setChecking(false)
    })

    // Listen for the PASSWORD_RECOVERY event Supabase fires
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setValidSession(true)
        setChecking(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)

    // Redirect to home after 3 seconds
    setTimeout(() => {
      router.push('/')
      router.refresh()
    }, 3000)
  }

  // Checking session
  if (checking) {
    return (
      <div className="bg-background py-12 px-4">
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="w-8 h-8 border-2 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-gray-400 mt-3">Verifying your link…</p>
          </div>
        </div>
      </div>
    )
  }

  // Invalid or expired link
  if (!validSession) {
    return (
      <div className="bg-background py-12 px-4">
        <div className="w-full max-w-md mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Link expired</h2>
            <p className="text-gray-500 text-sm mb-6">
              This password reset link is invalid or has expired. Please request a new one.
            </p>
            <Link
              href="/account/forgot-password"
              className="inline-block bg-brand-orange hover:bg-orange-500 text-white font-semibold rounded-xl py-2.5 px-6 text-sm transition"
            >
              Request new link
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Success state
  if (success) {
    return (
      <div className="bg-background py-12 px-4">
        <div className="w-full max-w-md mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Password updated</h2>
            <p className="text-gray-500 text-sm">
              Your password has been changed successfully. Redirecting you to the homepage…
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Reset form
  return (
    <div className="bg-background py-12 px-4">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Choose a new password</h1>
          <p className="text-gray-500 mt-1 text-sm">Must be at least 8 characters</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3">{error}</div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                New password
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
                placeholder="Min. 8 characters"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Confirm new password
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition
                  ${confirm && password !== confirm
                    ? 'border-red-300 focus:ring-red-200 focus:border-red-400'
                    : 'border-gray-200 focus:ring-brand-orange/30 focus:border-brand-orange'
                  }`}
                placeholder="Re-enter your password"
              />
              {confirm && password !== confirm && (
                <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || (!!confirm && password !== confirm)}
              className="w-full bg-brand-orange hover:bg-orange-500 text-white font-semibold rounded-xl py-2.5 text-sm transition disabled:opacity-60"
            >
              {loading ? 'Updating…' : 'Update password'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-5">
          <Link href="/account/login" className="text-brand-orange font-medium hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  )
}