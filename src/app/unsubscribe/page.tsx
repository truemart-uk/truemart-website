"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function UnsubscribeContent() {
  const params  = useSearchParams();
  const email   = params.get("email") ?? "";
  const done    = params.get("done") === "1";

  const [status, setStatus]   = useState<"idle" | "loading" | "done" | "error">(
    done ? "done" : "idle"
  );
  const [input, setInput]     = useState(email);
  const [errorMsg, setErrorMsg] = useState("");

  // If email is in URL and not already done — auto-unsubscribe
  useEffect(() => {
    if (email && !done) {
      handleUnsubscribe(email);
    }
  }, []);

  async function handleUnsubscribe(emailToUse: string) {
    if (!emailToUse.trim()) return;
    setStatus("loading");
    setErrorMsg("");

    const res = await fetch("/api/newsletter/unsubscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: emailToUse }),
    });

    if (res.ok) {
      setStatus("done");
    } else {
      const data = await res.json();
      setErrorMsg(data.error ?? "Something went wrong.");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 max-w-md w-full text-center">
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">You're unsubscribed</h1>
          <p className="text-sm text-gray-500 mb-6">
            {input || email
              ? <><span className="font-medium text-gray-700">{input || email}</span> has been removed from our mailing list.</>
              : "You've been removed from our mailing list."
            }
            {" "}You won't receive any more marketing emails from TrueMart.
          </p>
          <p className="text-xs text-gray-400 mb-6">
            Changed your mind? You can resubscribe anytime from our homepage.
          </p>
          <Link
            href="/"
            className="inline-block bg-brand-orange hover:bg-orange-500 text-white font-semibold px-6 py-3 rounded-xl text-sm transition"
          >
            Back to TrueMart
          </Link>
        </div>
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 max-w-md w-full text-center">
          <svg className="animate-spin w-8 h-8 text-brand-orange mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          <p className="text-sm text-gray-500">Unsubscribing...</p>
        </div>
      </div>
    );
  }

  // Manual unsubscribe form (if no email in URL)
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 max-w-md w-full text-center">
        <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <svg className="w-7 h-7 text-brand-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Unsubscribe from TrueMart</h1>
        <p className="text-sm text-gray-500 mb-6">
          Enter your email address to stop receiving marketing emails from us.
        </p>
        {status === "error" && (
          <p className="text-red-500 text-sm mb-4">{errorMsg}</p>
        )}
        <input
          type="email"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="your@email.com"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange mb-3"
        />
        <button
          onClick={() => handleUnsubscribe(input)}
          disabled={!input.trim()}
          className="w-full bg-brand-orange hover:bg-orange-500 disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-xl text-sm transition"
        >
          Unsubscribe
        </button>
        <Link href="/" className="block mt-4 text-xs text-gray-400 hover:text-gray-600 transition">
          ← Back to TrueMart
        </Link>
      </div>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense>
      <UnsubscribeContent />
    </Suspense>
  );
}
