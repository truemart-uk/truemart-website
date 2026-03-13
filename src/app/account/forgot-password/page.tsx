'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function ForgotPasswordPage() {
  const supabase = createClient()
  const [email, setEmail]     = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent]       = useState(false)
  const [error, setError]     = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/auth/reset-password`,
    })
    if (error) { setError(error.message); setLoading(false); return }
    setSent(true)
    setLoading(false)
  }

if (sent) {
  return (
    <div className="bg-background py-12 px-4">
      <div className="w-full max-w-md mx-auto text-center">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="w-12 h-12 bg-brand-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-brand-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Check your email</h2>
          <p className="text-gray-500 text-sm mb-4">
            If <strong>{email}</strong> is registered with TrueMart, you'll receive a reset link shortly.
          </p>
          <p className="text-xs text-gray-400 mb-6">
            Didn't get it? Double-check the email address above is correct, then check your spam folder.
          </p>
          <button
            onClick={() => { setSent(false); }}
            className="text-sm text-brand-orange font-medium hover:underline"
          >
            Try a different email
          </button>
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

  return (
    <div className="bg-background py-12 px-4">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Reset your password</h1>
          <p className="text-gray-500 mt-1 text-sm">We'll send a reset link to your email</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3">{error}</div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                type="email" required value={email} onChange={e => setEmail(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
                placeholder="you@example.com"
              />
            </div>
            <button
              type="submit" disabled={loading}
              className="w-full bg-brand-orange hover:bg-orange-500 text-white font-semibold rounded-xl py-2.5 text-sm transition disabled:opacity-60"
            >
              {loading ? 'Sending…' : 'Send reset link'}
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