"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";

export default function AccountPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const router   = useRouter();
  const supabase = createClient();

  const [orderCount, setOrderCount]     = useState<number | null>(null);
  const [addressCount, setAddressCount] = useState<number | null>(null);

  useEffect(() => {
    if (!authLoading && !user) router.push("/account/login");
  }, [user, authLoading]);

  useEffect(() => {
    if (!user) return;

    // Fetch counts in parallel
    Promise.all([
      supabase.from("orders").select("id", { count: "exact", head: true }).eq("user_id", user.id),
      supabase.from("addresses").select("id", { count: "exact", head: true }).eq("user_id", user.id),
    ]).then(([orders, addresses]) => {
      setOrderCount(orders.count ?? 0);
      setAddressCount(addresses.count ?? 0);
    });
  }, [user]);

  async function handleSignOut() {
    await signOut();
    router.push("/");
  }

  if (authLoading || !user) return null;

  const firstName = user.user_metadata?.full_name?.split(" ")[0] || "there";

  const cards = [
    {
      href:        "/account/orders",
      icon:        "📦",
      title:       "My Orders",
      description: orderCount === null ? "View your orders" : orderCount === 0 ? "No orders yet" : `${orderCount} order${orderCount !== 1 ? "s" : ""}`,
      cta:         "View orders",
    },
    {
      href:        "/account/addresses",
      icon:        "📍",
      title:       "Addresses",
      description: addressCount === null ? "Manage addresses" : addressCount === 0 ? "No addresses saved" : `${addressCount} saved address${addressCount !== 1 ? "es" : ""}`,
      cta:         "Manage",
    },
    {
      href:        "/account/profile",
      icon:        "👤",
      title:       "My Profile",
      description: "Update your name and phone number",
      cta:         "Edit profile",
    },
    {
      href:        "/account/change-password",
      icon:        "🔒",
      title:       "Password",
      description: "Change your account password",
      cta:         "Change password",
    },
  ];

  return (
    <div className="bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {firstName} 👋
          </h1>
          <p className="text-gray-500 text-sm mt-1">{user.email}</p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {cards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md hover:border-orange-200 transition group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-2xl mb-3 block">{card.icon}</span>
                  <h2 className="font-semibold text-gray-900 mb-1">{card.title}</h2>
                  <p className="text-sm text-gray-500">{card.description}</p>
                </div>
                <svg
                  className="w-5 h-5 text-gray-300 group-hover:text-brand-orange transition mt-1 flex-shrink-0"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <p className="text-xs text-brand-orange font-semibold mt-4 group-hover:underline">
                {card.cta} →
              </p>
            </Link>
          ))}
        </div>

        {/* Sign out */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-900">Sign out</p>
            <p className="text-xs text-gray-400 mt-0.5">You'll need to sign in again to access your account</p>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 text-sm font-semibold text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-xl transition"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign out
          </button>
        </div>

      </div>
    </div>
  );
}
