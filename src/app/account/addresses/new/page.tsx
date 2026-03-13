"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";

export default function NewAddressPage() {
  const router       = useRouter();
  const params       = useSearchParams();
  const redirect     = params.get("redirect") ?? "/account/addresses";
  const { user }     = useAuth();
  const supabase     = createClient();

  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const [form, setForm] = useState({
    label:      "",
    full_name:  "",
    line1:      "",
    line2:      "",
    city:       "",
    county:     "",
    postcode:   "",
    phone:      "",
    is_default: false,
  });

  function update(field: string, value: string | boolean) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setError("");
    setLoading(true);

    const { error: saveError } = await supabase.from("addresses").insert({
      user_id:    user.id,
      label:      form.label || null,
      full_name:  form.full_name,
      line1:      form.line1,
      line2:      form.line2 || null,
      city:       form.city,
      county:     form.county || null,
      postcode:   form.postcode.toUpperCase(),
      country:    "GB",
      phone:      form.phone,
      is_default: form.is_default,
    });

    if (saveError) {
      setError("Failed to save address. Please try again.");
      setLoading(false);
      return;
    }

    // If set as default, unset all other defaults
    if (form.is_default) {
      const { data: all } = await supabase
        .from("addresses")
        .select("id")
        .eq("user_id", user.id)
        .eq("is_default", true);

      if (all && all.length > 1) {
        // Get the newly inserted one — it's the last one
        const { data: newest } = await supabase
          .from("addresses")
          .select("id")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (newest) {
          await supabase
            .from("addresses")
            .update({ is_default: false })
            .eq("user_id", user.id)
            .neq("id", newest.id);
        }
      }
    }

    router.push(redirect);
  }

  const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange transition";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

  return (
    <div className="bg-background min-h-screen py-8 px-4">
      <div className="max-w-lg mx-auto">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Add address</h1>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-4">

            {error && (
              <div className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3">{error}</div>
            )}

            {/* Label (optional) */}
            <div>
              <label className={labelClass}>
                Label <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={form.label}
                onChange={e => update("label", e.target.value)}
                placeholder="e.g. Home, Work"
                className={inputClass}
              />
            </div>

            {/* Full name */}
            <div>
              <label className={labelClass}>Full name <span className="text-red-400">*</span></label>
              <input
                type="text" required
                value={form.full_name}
                onChange={e => update("full_name", e.target.value)}
                placeholder="Full Name"
                className={inputClass}
              />
            </div>

            {/* Address line 1 */}
            <div>
              <label className={labelClass}>Address line 1 <span className="text-red-400">*</span></label>
              <input
                type="text" required
                value={form.line1}
                onChange={e => update("line1", e.target.value)}
                placeholder="123 High Street"
                className={inputClass}
              />
            </div>

            {/* Address line 2 */}
            <div>
              <label className={labelClass}>
                Address line 2 <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={form.line2}
                onChange={e => update("line2", e.target.value)}
                placeholder="Flat 2B"
                className={inputClass}
              />
            </div>

            {/* City + County */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>City <span className="text-red-400">*</span></label>
                <input
                  type="text" required
                  value={form.city}
                  onChange={e => update("city", e.target.value)}
                  placeholder="London"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>
                  County <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={form.county}
                  onChange={e => update("county", e.target.value)}
                  placeholder="Greater London"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Postcode */}
            <div>
              <label className={labelClass}>Postcode <span className="text-red-400">*</span></label>
              <input
                type="text" required
                value={form.postcode}
                onChange={e => update("postcode", e.target.value.toUpperCase())}
                placeholder="SW1A 1AA"
                className={`${inputClass} uppercase`}
              />
            </div>

            {/* Phone */}
            <div>
              <label className={labelClass}>Phone <span className="text-red-400">*</span></label>
              <input
                type="tel" required
                value={form.phone}
                onChange={e => update("phone", e.target.value)}
                placeholder="+44 7700 900000"
                className={inputClass}
              />
            </div>

            {/* Set as default */}
            <label className="flex items-center gap-3 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={form.is_default}
                onChange={e => update("is_default", e.target.checked)}
                className="w-4 h-4 accent-brand-orange rounded"
              />
              <span className="text-sm text-gray-700">Set as default address</span>
            </label>

            {/* Submit */}
            <button
              type="submit" disabled={loading}
              className="w-full bg-brand-orange hover:bg-orange-500 disabled:opacity-60 text-white font-semibold rounded-xl py-3 text-sm transition mt-2"
            >
              {loading ? "Saving..." : "Save address"}
            </button>

          </form>
        </div>

      </div>
    </div>
  );
}
