"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router   = useRouter();
  const supabase = createClient();

  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [success, setSuccess]   = useState(false);
  const [error, setError]       = useState("");

  const [form, setForm] = useState({
    full_name:      "",
    phone:          "",
    marketing_opt_in: false,
  });

  useEffect(() => {
    if (!authLoading && !user) router.push("/account/login");
  }, [user, authLoading]);

  useEffect(() => {
    if (!user) return;

    async function load() {
      // Load profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, phone, marketing_opt_in")
        .eq("id", user!.id)
        .single();

      let phone = profile?.phone ?? "";

      // If no phone in profile, pre-fill from most recent order's shipping_phone
      if (!phone) {
        const { data: lastOrder } = await supabase
          .from("orders")
          .select("shipping_phone")
          .eq("user_id", user!.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();
        phone = lastOrder?.shipping_phone ?? "";
      }

      setForm({
        full_name:        profile?.full_name ?? "",
        phone,
        marketing_opt_in: profile?.marketing_opt_in ?? false,
      });
      setLoading(false);
    }

    load();
  }, [user]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setError("");
    setSuccess(false);
    setSaving(true);

    // Update profiles table
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        full_name:       form.full_name,
        phone:           form.phone || null,
        marketing_opt_in: form.marketing_opt_in,
        updated_at:      new Date().toISOString(),
      })
      .eq("id", user.id);

    if (profileError) {
      setError("Failed to save. Please try again.");
      setSaving(false);
      return;
    }

    // Also update auth user metadata so navbar shows updated name
    await supabase.auth.updateUser({
      data: { full_name: form.full_name },
    });

    setSuccess(true);
    setSaving(false);

    // Clear success message after 3 seconds
    setTimeout(() => setSuccess(false), 3000);
  }

  const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange transition";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

  if (authLoading || loading) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <svg className="animate-spin w-6 h-6 text-brand-orange" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold text-gray-900">My profile</h1>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-5">

            {error && (
              <div className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3">{error}</div>
            )}

            {success && (
              <div className="bg-green-50 text-green-700 text-sm rounded-xl px-4 py-3 flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Profile updated successfully
              </div>
            )}

            {/* Email — read only */}
            <div>
              <label className={labelClass}>Email address</label>
              <div className="w-full border border-gray-100 rounded-xl px-4 py-2.5 text-sm text-gray-400 bg-gray-50">
                {user?.email}
              </div>
              <p className="text-xs text-gray-400 mt-1.5">Email cannot be changed here. Contact support if needed.</p>
            </div>

            {/* Full name */}
            <div>
              <label className={labelClass}>Full name <span className="text-red-400">*</span></label>
              <input
                type="text" required
                value={form.full_name}
                onChange={e => setForm(p => ({ ...p, full_name: e.target.value }))}
                placeholder="Manish Gangwar"
                className={inputClass}
              />
            </div>

            {/* Phone */}
            <div>
              <label className={labelClass}>
                Phone <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                placeholder="+44 7700 900000"
                className={inputClass}
              />
            </div>

            {/* Marketing opt-in */}
            <label className="flex items-start gap-3 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={form.marketing_opt_in}
                onChange={e => setForm(p => ({ ...p, marketing_opt_in: e.target.checked }))}
                className="w-4 h-4 mt-0.5 accent-brand-orange rounded flex-shrink-0"
              />
              <div>
                <p className="text-sm text-gray-700 font-medium">Marketing emails</p>
                <p className="text-xs text-gray-400 mt-0.5">Receive updates about new products, festivals, and offers from TrueMart</p>
              </div>
            </label>

            <button
              type="submit" disabled={saving}
              className="w-full bg-brand-orange hover:bg-orange-500 disabled:opacity-60 text-white font-semibold rounded-xl py-3 text-sm transition"
            >
              {saving ? "Saving..." : "Save changes"}
            </button>

          </form>
        </div>

      </div>
    </div>
  );
}
