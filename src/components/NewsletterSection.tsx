"use client";

import { useState } from "react";
import Link from "next/link";

export default function NewsletterSection() {
  const [email, setEmail]         = useState("");
  const [consented, setConsented] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [status, setStatus]       = useState<"idle" | "success" | "already" | "error">("idle");
  const [errorMsg, setErrorMsg]   = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!consented) return;
    setLoading(true);
    setStatus("idle");

    const res = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, source: "homepage" }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setStatus("error");
      setErrorMsg(data.error ?? "Something went wrong. Please try again.");
      return;
    }

    setStatus(data.status === "already_subscribed" ? "already" : "success");
  }

  if (status === "success") {
    return (
      <section className="bg-orange-50 border-y border-orange-100 py-10">
        <div className="max-w-6xl mx-auto px-6 flex items-center gap-6">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-orange-100 flex-shrink-0">
            <span className="text-2xl">🎉</span>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 mb-0.5">You&apos;re subscribed!</h3>
            <p className="text-sm text-gray-500">
              Check your inbox — your <span className="font-semibold text-brand-orange">WELCOME10</span> discount code is on its way.
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (status === "already") {
    return (
      <section className="bg-orange-50 border-y border-orange-100 py-10">
        <div className="max-w-6xl mx-auto px-6 flex items-center gap-6">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-orange-100 flex-shrink-0">
            <span className="text-2xl">✅</span>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-0.5">You&apos;re already subscribed!</h3>
            <p className="text-sm text-gray-500">Check your inbox for your 10% discount code.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-orange-50 border-y border-orange-100 py-10">
      <div className="max-w-6xl mx-auto px-6">

        <div className="grid md:grid-cols-2 gap-8 items-center">

          {/* Left — copy */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Join the Family &amp; <span className="text-brand-orange">Get Exclusive Offers</span>
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              New arrivals, festive inspiration and subscriber-only deals — straight to your inbox.
              Subscribe today and get <span className="font-semibold text-gray-700">10% off</span> your first order.
            </p>
          </div>

          {/* Right — form */}
          <form onSubmit={handleSubmit} className="space-y-3">

            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Your email address"
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange transition"
            />

            {/* GDPR checkbox — single native checkbox, no custom wrapper */}
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={consented}
                onChange={e => setConsented(e.target.checked)}
                className="mt-0.5 w-4 h-4 flex-shrink-0 accent-brand-orange cursor-pointer"
              />
              <span className="text-xs text-gray-500 leading-relaxed">
                I agree to receive marketing emails from TrueMart. You can unsubscribe at any time. See our{" "}
                <Link href="/privacy" className="text-brand-orange underline hover:no-underline">
                  Privacy Policy
                </Link>.
              </span>
            </label>

            {status === "error" && (
              <p className="text-red-500 text-xs">{errorMsg}</p>
            )}

            <button
              type="submit"
              disabled={loading || !consented || !email}
              className="w-full bg-brand-orange hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl text-sm transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Subscribing...
                </>
              ) : (
                <>
                  Subscribe &amp; get 10% off
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>

            <p className="text-xs text-gray-400">No spam, ever. Unsubscribe anytime.</p>

          </form>
        </div>
      </div>
    </section>
  );
}
