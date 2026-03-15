"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";

export default function ChangePasswordPage() {
  const { user } = useAuth();
  const router   = useRouter();
  const supabase = createClient();

  const [form, setForm] = useState({
    newPassword:     "",
    confirmPassword: "",
  });
  const [saving, setSaving]   = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError]     = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (form.newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSaving(true);

    const { error: updateError } = await supabase.auth.updateUser({
      password: form.newPassword,
    });

    if (updateError) {
      setError(updateError.message);
      setSaving(false);
      return;
    }

    setSuccess(true);
    setSaving(false);
    setForm({ newPassword: "", confirmPassword: "" });

    // Redirect back to account after 2 seconds
    setTimeout(() => router.push("/account"), 2000);
  }

  const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange transition";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

  return (
    <div className="bg-background py-8 px-4">
      <div className="max-w-lg mx-auto">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => router.back()} className="text-gray-400 hover:text-gray-600 transition">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Change password</h1>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

          {success ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-gray-900 mb-1">Password updated</h2>
              <p className="text-sm text-gray-500">Redirecting you back to your account...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">

              {error && (
                <div className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3 flex items-start gap-2">
                  <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </div>
              )}

              <div>
                <label className={labelClass}>New password <span className="text-red-400">*</span></label>
                <input
                  type="password" required
                  value={form.newPassword}
                  onChange={e => setForm(p => ({ ...p, newPassword: e.target.value }))}
                  placeholder="At least 8 characters"
                  className={inputClass}
                  minLength={8}
                />
              </div>

              <div>
                <label className={labelClass}>Confirm new password <span className="text-red-400">*</span></label>
                <input
                  type="password" required
                  value={form.confirmPassword}
                  onChange={e => setForm(p => ({ ...p, confirmPassword: e.target.value }))}
                  placeholder="Repeat your new password"
                  className={inputClass}
                  minLength={8}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="flex-1 border border-gray-200 text-gray-700 font-semibold rounded-xl py-3 text-sm hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit" disabled={saving}
                  className="flex-1 bg-brand-orange hover:bg-orange-500 disabled:opacity-60 text-white font-semibold rounded-xl py-3 text-sm transition"
                >
                  {saving ? "Updating..." : "Update password"}
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
}
