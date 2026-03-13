"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";

export default function EditAddressPage() {
  const router   = useRouter();
  const params   = useParams();
  const id       = params.id as string;
  const { user } = useAuth();
  const supabase = createClient();

  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState("");

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

  useEffect(() => {
    if (!user || !id) return;
    supabase
      .from("addresses")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        if (!data) { router.push("/account/addresses"); return; }
        setForm({
          label:      data.label ?? "",
          full_name:  data.full_name,
          line1:      data.line1,
          line2:      data.line2 ?? "",
          city:       data.city,
          county:     data.county ?? "",
          postcode:   data.postcode,
          phone:      data.phone ?? "",
          is_default: data.is_default,
        });
        setLoading(false);
      });
  }, [user, id]);

  function update(field: string, value: string | boolean) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setError("");
    setSaving(true);

    const { error: saveError } = await supabase
      .from("addresses")
      .update({
        label:      form.label || null,
        full_name:  form.full_name,
        line1:      form.line1,
        line2:      form.line2 || null,
        city:       form.city,
        county:     form.county || null,
        postcode:   form.postcode.toUpperCase(),
        phone:      form.phone,
        is_default: form.is_default,
      })
      .eq("id", id)
      .eq("user_id", user.id);

    if (saveError) {
      setError("Failed to save. Please try again.");
      setSaving(false);
      return;
    }

    // If set as default, unset all others
    if (form.is_default) {
      await supabase
        .from("addresses")
        .update({ is_default: false })
        .eq("user_id", user.id)
        .neq("id", id);
    }

    router.push("/account/addresses");
  }

  const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange transition";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

  if (loading) {
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
    <div className="bg-background min-h-screen py-8 px-4">
      <div className="max-w-lg mx-auto">

        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => router.back()} className="text-gray-400 hover:text-gray-600 transition">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Edit address</h1>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-4">

            {error && (
              <div className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3">{error}</div>
            )}

            <div>
              <label className={labelClass}>Label <span className="text-gray-400 font-normal">(optional)</span></label>
              <input type="text" value={form.label} onChange={e => update("label", e.target.value)} placeholder="e.g. Home, Work" className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Full name <span className="text-red-400">*</span></label>
              <input type="text" required value={form.full_name} onChange={e => update("full_name", e.target.value)} className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Address line 1 <span className="text-red-400">*</span></label>
              <input type="text" required value={form.line1} onChange={e => update("line1", e.target.value)} className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Address line 2 <span className="text-gray-400 font-normal">(optional)</span></label>
              <input type="text" value={form.line2} onChange={e => update("line2", e.target.value)} className={inputClass} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>City <span className="text-red-400">*</span></label>
                <input type="text" required value={form.city} onChange={e => update("city", e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>County <span className="text-gray-400 font-normal">(optional)</span></label>
                <input type="text" value={form.county} onChange={e => update("county", e.target.value)} className={inputClass} />
              </div>
            </div>

            <div>
              <label className={labelClass}>Postcode <span className="text-red-400">*</span></label>
              <input type="text" required value={form.postcode} onChange={e => update("postcode", e.target.value.toUpperCase())} className={`${inputClass} uppercase`} />
            </div>

            <div>
              <label className={labelClass}>Phone <span className="text-red-400">*</span></label>
              <input type="tel" required value={form.phone} onChange={e => update("phone", e.target.value)} className={inputClass} />
            </div>

            <label className="flex items-center gap-3 cursor-pointer pt-1">
              <input
                type="checkbox" checked={form.is_default}
                onChange={e => update("is_default", e.target.checked)}
                className="w-4 h-4 accent-brand-orange rounded"
              />
              <span className="text-sm text-gray-700">Set as default address</span>
            </label>

            <div className="flex gap-3 pt-2">
              <button
                type="button" onClick={() => router.back()}
                className="flex-1 border border-gray-200 text-gray-700 font-semibold rounded-xl py-3 text-sm hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit" disabled={saving}
                className="flex-1 bg-brand-orange hover:bg-orange-500 disabled:opacity-60 text-white font-semibold rounded-xl py-3 text-sm transition"
              >
                {saving ? "Saving..." : "Save changes"}
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}
