"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";

type Address = {
  id: string;
  label?: string;
  full_name: string;
  line1: string;
  line2?: string;
  city: string;
  county?: string;
  postcode: string;
  country: string;
  phone: string;
  is_default: boolean;
};

export default function AddressesPage() {
  const { user } = useAuth();
  const router   = useRouter();
  const supabase = createClient();

  const [addresses, setAddresses]     = useState<Address[]>([]);
  const [loading, setLoading]         = useState(true);
  const [deletingId, setDeletingId]   = useState<string | null>(null);
  const [defaultingId, setDefaultingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    fetchAddresses();
  }, [user]);

  async function fetchAddresses() {
    const { data } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", user!.id)
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: true });
    setAddresses(data ?? []);
    setLoading(false);
  }

  async function handleSetDefault(id: string) {
    setDefaultingId(id);
    // Unset all defaults first
    await supabase
      .from("addresses")
      .update({ is_default: false })
      .eq("user_id", user!.id);
    // Set new default
    await supabase
      .from("addresses")
      .update({ is_default: true })
      .eq("id", id);
    await fetchAddresses();
    setDefaultingId(null);
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to remove this address?")) return;
    setDeletingId(id);
    await supabase.from("addresses").delete().eq("id", id);
    setAddresses(prev => prev.filter(a => a.id !== id));
    setDeletingId(null);
  }

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
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold text-gray-900">My addresses</h1>
          </div>
          <Link
            href="/account/addresses/new"
            className="flex items-center gap-2 bg-brand-orange hover:bg-orange-500 text-white text-sm font-semibold px-4 py-2 rounded-xl transition"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add new
          </Link>
        </div>

        {/* Empty state */}
        {addresses.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
            <div className="text-5xl mb-4">📍</div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">No addresses yet</h2>
            <p className="text-gray-500 text-sm mb-6">Add an address to make checkout faster.</p>
            <Link
              href="/account/addresses/new"
              className="bg-brand-orange hover:bg-orange-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition"
            >
              Add your first address
            </Link>
          </div>
        )}

        {/* Address list */}
        <div className="space-y-4">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`bg-white rounded-2xl border-2 shadow-sm p-5 transition ${
                addr.is_default ? "border-brand-orange" : "border-gray-100"
              }`}
            >
              {/* Top row — label + default badge */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  {addr.label && (
                    <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-medium">
                      {addr.label}
                    </span>
                  )}
                  {addr.is_default && (
                    <span className="text-xs bg-orange-100 text-brand-orange px-2.5 py-1 rounded-full font-semibold flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Default
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Link
                    href={`/account/addresses/${addr.id}/edit`}
                    className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-brand-orange px-3 py-1.5 rounded-lg hover:bg-orange-50 transition font-medium"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(addr.id)}
                    disabled={deletingId === addr.id}
                    className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-50 transition font-medium disabled:opacity-50"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    {deletingId === addr.id ? "Removing..." : "Remove"}
                  </button>
                </div>
              </div>

              {/* Address details */}
              <div className="text-sm text-gray-700 leading-relaxed">
                <p className="font-semibold text-gray-900">{addr.full_name}</p>
                <p className="text-gray-500 mt-0.5">
                  {addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}<br />
                  {addr.city}{addr.county ? `, ${addr.county}` : ""}<br />
                  {addr.postcode} · {addr.country}
                </p>
                {addr.phone && (
                  <p className="text-gray-400 text-xs mt-1.5 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {addr.phone}
                  </p>
                )}
              </div>

              {/* Set as default */}
              {!addr.is_default && (
                <button
                  onClick={() => handleSetDefault(addr.id)}
                  disabled={defaultingId === addr.id}
                  className="mt-4 text-xs text-brand-orange hover:underline font-medium disabled:opacity-50"
                >
                  {defaultingId === addr.id ? "Setting as default..." : "Set as default"}
                </button>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
