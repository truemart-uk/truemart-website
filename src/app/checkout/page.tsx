"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { createClient } from "@/lib/supabase/client";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { cloudinaryUrl } from "@/lib/cloudinary";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// ── DELIVERY CONFIG (mirrors src/lib/stripe.ts) ───────────────────────────────
const DELIVERY = {
  standard: { label: "Standard Delivery", description: "3–5 working days", price: 3.99, freeThreshold: 25 },
  express:  { label: "Express Delivery",  description: "1–2 working days", price: 6.99, freeThreshold: null },
} as const;

type DeliveryMethod = keyof typeof DELIVERY;

function calcDelivery(method: DeliveryMethod, subtotal: number): number {
  const opt = DELIVERY[method];
  if (opt.freeThreshold && subtotal >= opt.freeThreshold) return 0;
  return opt.price;
}

// ── TYPES ─────────────────────────────────────────────────────────────────────

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
  phone?: string;
  is_default: boolean;
};

// ── ORDER SUMMARY ─────────────────────────────────────────────────────────────

function OrderSummary({
  subtotal, deliveryCost, collapsed, onToggle,
}: {
  subtotal: number;
  deliveryCost: number;
  collapsed: boolean;
  onToggle: () => void;
}) {
  const { items } = useCart();
  const total = subtotal + deliveryCost;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Mobile toggle */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 md:hidden"
      >
        <span className="text-sm font-semibold text-gray-700">
          {collapsed ? "Show" : "Hide"} order summary ({items.reduce((s, i) => s + i.quantity, 0)} items)
        </span>
        <div className="flex items-center gap-2">
          <span className="font-bold text-brand-orange">£{total.toFixed(2)}</span>
          <svg className={`w-4 h-4 text-gray-400 transition-transform ${collapsed ? "" : "rotate-180"}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      <div className={`${collapsed ? "hidden" : "block"} md:block`}>
        <div className="hidden md:block px-5 pt-5 pb-3 border-b border-gray-50">
          <h2 className="font-semibold text-gray-900">Order summary</h2>
        </div>

        {/* Items */}
        <div className="px-5 py-3 space-y-3 border-b border-gray-50">
          {items.map((item) => (
            <div key={`${item.productId}-${item.variantId}`} className="flex gap-3 items-center">
              <div className="relative flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden bg-gray-50 border border-gray-100">
                {item.image ? (
                  <Image
                    src={cloudinaryUrl(item.image, "card")}
                    alt={item.name}
                    fill className="object-cover" sizes="56px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xl">📦</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  <span className="text-brand-orange font-bold">{item.quantity}×</span> {item.name}
                </p>
                {item.variantLabel && <p className="text-xs text-gray-400">{item.variantLabel}</p>}
              </div>
              <p className="text-sm font-semibold text-gray-900 flex-shrink-0">
                £{(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="px-5 py-4 space-y-2">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Subtotal</span>
            <span>£{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <span>Delivery</span>
            <span>
              {deliveryCost === 0
                ? <span className="text-green-600 font-medium">FREE</span>
                : `£${deliveryCost.toFixed(2)}`}
            </span>
          </div>
          <div className="flex justify-between font-bold text-gray-900 text-base pt-2 border-t border-gray-100">
            <span>Total</span>
            <span className="text-brand-orange">£{total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── PAYMENT FORM ──────────────────────────────────────────────────────────────

function PaymentForm({ onSuccess }: { onSuccess: (piId: string) => void }) {
  const stripe   = useStripe();
  const elements = useElements();
  const [paying, setPaying] = useState(false);
  const [error, setError]   = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setError("");
    setPaying(true);

    const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (stripeError) {
      setError(stripeError.message ?? "Payment failed. Please try again.");
      setPaying(false);
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      onSuccess(paymentIntent.id);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement options={{ layout: "tabs" }} />
      {error && (
        <div className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3 flex items-start gap-2">
          <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}
      <button
        type="submit" disabled={!stripe || paying}
        className="w-full bg-brand-orange hover:bg-orange-500 disabled:opacity-60 text-white font-bold rounded-xl py-3.5 text-sm transition flex items-center justify-center gap-2"
      >
        {paying ? (
          <>
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            Processing...
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Pay now
          </>
        )}
      </button>
      <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1">
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        Secured by Stripe. We never store your card details.
      </p>
    </form>
  );
}

// ── MAIN CHECKOUT PAGE ────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { items, subtotal, clearCart } = useCart();
  const supabase = createClient();

  const [addresses, setAddresses]               = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [deliveryMethod, setDeliveryMethod]     = useState<DeliveryMethod>("standard");
  const [clientSecret, setClientSecret]         = useState<string>("");
  const [loadingIntent, setLoadingIntent]       = useState(false);
  const [summaryCollapsed, setSummaryCollapsed] = useState(true);
  const [pageError, setPageError]               = useState("");
  const [redirecting, setRedirecting]           = useState(false);

  // Derived locally — no API needed for display
  const deliveryCost = calcDelivery(deliveryMethod, subtotal);
  const total        = subtotal + deliveryCost;

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) router.push("/account/login?redirect=/checkout");
  }, [user, authLoading]);

  // Redirect if cart is empty — but not while redirecting to confirmation
  useEffect(() => {
    if (!authLoading && !items.length && !redirecting) router.push("/shop/books");
  }, [items, authLoading, redirecting]);

  // Load addresses
  useEffect(() => {
    if (!user) return;
    supabase
      .from("addresses")
      .select("*")
      .eq("user_id", user.id)
      .order("is_default", { ascending: false })
      .then(({ data }) => {
        if (data?.length) {
          setAddresses(data);
          setSelectedAddressId(data[0].id);
        }
      });
  }, [user]);

  // Create PaymentIntent — only called when Stripe keys exist and all fields ready
  const createIntent = useCallback(async () => {
    if (!selectedAddressId || !items.length || !process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) return;
    setLoadingIntent(true);
    setPageError("");

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items, deliveryMethod, addressId: selectedAddressId }),
    });

    const data = await res.json();
    if (!res.ok) {
      setPageError(data.error ?? "Something went wrong.");
      setLoadingIntent(false);
      return;
    }

    setClientSecret(data.clientSecret);
    setLoadingIntent(false);
  }, [selectedAddressId, deliveryMethod, items]);

  useEffect(() => {
    if (selectedAddressId) createIntent();
  }, [selectedAddressId, deliveryMethod]);

  function handlePaymentSuccess(piId: string) {
    setRedirecting(true);
    clearCart();
    router.push(`/order/confirmation?pi=${piId}`);
  }

  if (authLoading || !user) return null;

  const stripeReady = !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

  return (
    <div className="bg-background min-h-screen py-8 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="text-gray-400 hover:text-gray-600 transition"
            aria-label="Go back"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
        </div>

        {/* Mobile order summary */}
        <div className="md:hidden mb-6">
          <OrderSummary
            subtotal={subtotal}
            deliveryCost={deliveryCost}
            collapsed={summaryCollapsed}
            onToggle={() => setSummaryCollapsed(p => !p)}
          />
        </div>

        <div className="flex flex-col md:flex-row gap-8">

          {/* LEFT — Form */}
          <div className="flex-1 space-y-6">

            {pageError && (
              <div className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3">{pageError}</div>
            )}

            {/* ── 1. Delivery Address ──────────────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-brand-orange text-white text-xs font-bold flex items-center justify-center">1</span>
                  Delivery address
                </h2>
                <Link
                  href="/account/addresses/new?redirect=/checkout"
                  className="text-xs text-brand-orange hover:underline font-medium"
                >
                  + Add new
                </Link>
              </div>

              {addresses.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-500 text-sm mb-3">You have no saved addresses.</p>
                  <Link
                    href="/account/addresses/new?redirect=/checkout"
                    className="bg-brand-orange text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-orange-500 transition"
                  >
                    Add an address
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {addresses.map((addr) => (
                    <label
                      key={addr.id}
                      className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition ${
                        selectedAddressId === addr.id
                          ? "border-brand-orange bg-orange-50"
                          : "border-gray-100 hover:border-orange-200"
                      }`}
                    >
                      <input
                        type="radio" name="address" value={addr.id}
                        checked={selectedAddressId === addr.id}
                        onChange={() => setSelectedAddressId(addr.id)}
                        className="mt-0.5 accent-brand-orange"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-sm font-semibold text-gray-900">{addr.full_name}</p>
                          {addr.is_default && (
                            <span className="text-xs bg-orange-100 text-brand-orange px-2 py-0.5 rounded-full font-medium">Default</span>
                          )}
                          {addr.label && (
                            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{addr.label}</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 leading-relaxed">
                          {addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}, {addr.city}
                          {addr.county ? `, ${addr.county}` : ""}, {addr.postcode}
                        </p>
                        {addr.phone && <p className="text-xs text-gray-400 mt-0.5">{addr.phone}</p>}
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* ── 2. Delivery Method ───────────────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2 mb-5">
                <span className="w-6 h-6 rounded-full bg-brand-orange text-white text-xs font-bold flex items-center justify-center">2</span>
                Delivery method
              </h2>
              <div className="space-y-3">
                {(["standard", "express"] as DeliveryMethod[]).map((method) => {
                  const opt  = DELIVERY[method];
                  const cost = calcDelivery(method, subtotal);
                  return (
                    <label
                      key={method}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition ${
                        deliveryMethod === method
                          ? "border-brand-orange bg-orange-50"
                          : "border-gray-100 hover:border-orange-200"
                      }`}
                    >
                      <input
                        type="radio" name="delivery" value={method}
                        checked={deliveryMethod === method}
                        onChange={() => setDeliveryMethod(method)}
                        className="accent-brand-orange"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{method === "express" ? "⚡" : "📦"}</span>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{opt.label}</p>
                            <p className="text-xs text-gray-400">{opt.description}</p>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm font-semibold text-gray-900">
                        {cost === 0
                          ? <span className="text-green-600">FREE</span>
                          : `£${cost.toFixed(2)}`}
                      </p>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* ── 3. Payment ───────────────────────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2 mb-5">
                <span className="w-6 h-6 rounded-full bg-brand-orange text-white text-xs font-bold flex items-center justify-center">3</span>
                Payment
              </h2>

              {!stripeReady ? (
                <div className="bg-yellow-50 border border-yellow-100 rounded-xl px-4 py-3 text-sm text-yellow-700">
                  Payment is not configured yet. Add your Stripe keys to enable checkout.
                </div>
              ) : loadingIntent ? (
                <div className="flex items-center justify-center py-8 gap-3 text-gray-400">
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  <span className="text-sm">Loading payment...</span>
                </div>
              ) : clientSecret ? (
                <Elements
                  stripe={stripePromise}
                  options={{
                    clientSecret,
                    appearance: {
                      theme: "stripe",
                      variables: {
                        colorPrimary: "#FB923C",
                        borderRadius: "12px",
                        fontFamily: "Poppins, sans-serif",
                      },
                    },
                  }}
                >
                  <PaymentForm onSuccess={handlePaymentSuccess} />
                </Elements>
              ) : (
                <p className="text-sm text-gray-400 text-center py-4">
                  {addresses.length === 0
                    ? "Please add a delivery address to continue."
                    : "Select a delivery address above to continue."}
                </p>
              )}
            </div>

          </div>

          {/* RIGHT — Desktop sticky summary */}
          <div className="hidden md:block w-80 flex-shrink-0">
            <div className="sticky top-24">
              <OrderSummary
                subtotal={subtotal}
                deliveryCost={deliveryCost}
                collapsed={false}
                onToggle={() => {}}
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
