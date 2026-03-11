"use client";

import { useState } from "react";
import Link from "next/link";
import { SITE } from "@/lib/site";

type FormState = "idle" | "loading" | "success" | "error";

type FormData = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

const subjects = [
  "Order enquiry",
  "Delivery question",
  "Return request",
  "Product question",
  "Something else",
];

export default function ContactPage() {
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.subject || !form.message) {
      setErrorMsg("Please fill in all fields.");
      return;
    }

    setFormState("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setFormState("success");
        setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      } else {
        const data = await res.json();
        setErrorMsg(data.error || "Something went wrong. Please try again.");
        setFormState("error");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
      setFormState("error");
    }
  };

  return (
    <main className="min-h-screen bg-background">

      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-50 to-orange-100 border-b border-orange-100">
        <div className="max-w-5xl mx-auto px-6 py-16 text-center">
          <div className="inline-flex items-center gap-2 bg-white border border-orange-200 rounded-full px-4 py-1.5 mb-6 shadow-sm">
            <span className="text-sm">💬</span>
            <span className="text-xs font-semibold text-gray-600 tracking-wide">Get In Touch</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            We'd love to <span className="text-brand-orange">hear from you</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Have a question about an order, product or anything else? Send us a message and we'll get back to you within 24 hours.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

          {/* Left sidebar — contact info */}
          <aside className="lg:col-span-2 space-y-6">

            {/* Contact details */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
              <h2 className="font-extrabold text-gray-900 text-base">Contact Details</h2>

              <a href={`mailto:${SITE.contact.email}`}
                className="flex items-start gap-4 group">
                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-brand-orange transition-colors">
                  <svg className="w-4 h-4 text-brand-orange group-hover:text-white transition-colors" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium mb-0.5">Email</p>
                  <p className="text-sm font-semibold text-gray-800 group-hover:text-brand-orange transition-colors">{SITE.contact.email}</p>
                </div>
              </a>

              <a href={`tel:${SITE.contact.phone.replace(/\s/g, "")}`}
                className="flex items-start gap-4 group">
                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-brand-orange transition-colors">
                  <svg className="w-4 h-4 text-brand-orange group-hover:text-white transition-colors" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium mb-0.5">Phone</p>
                  <p className="text-sm font-semibold text-gray-800 group-hover:text-brand-orange transition-colors">{SITE.contact.phone}</p>
                </div>
              </a>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-brand-orange" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium mb-0.5">Based In</p>
                  <p className="text-sm font-semibold text-gray-800">United Kingdom 🇬🇧</p>
                </div>
              </div>
            </div>

            {/* Business hours */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-extrabold text-gray-900 text-base mb-4">Business Hours</h2>
              <div className="space-y-2.5">
                {[
                  { day: "Monday – Friday", hours: "9:00 AM – 6:00 PM" },
                  { day: "Saturday", hours: "10:00 AM – 4:00 PM" },
                  { day: "Sunday", hours: "Closed" },
                ].map((row) => (
                  <div key={row.day} className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">{row.day}</span>
                    <span className={`font-semibold ${row.hours === "Closed" ? "text-red-400" : "text-gray-800"}`}>{row.hours}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-4 leading-relaxed">
                We aim to respond to all messages within 24 hours during business hours. During peak festival seasons, response times may be slightly longer.
              </p>
            </div>

            {/* Quick links */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-extrabold text-gray-900 text-base mb-4">Quick Links</h2>
              <div className="space-y-2">
                {[
                  { label: "📦 Delivery Information", href: "/delivery" },
                  { label: "↩️ Return Policy", href: "/return-policy" },
                  { label: "💬 FAQs", href: "/faqs" },
                ].map((link) => (
                  <Link key={link.href} href={link.href}
                    className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-orange-50 hover:text-brand-orange transition-colors group text-sm font-medium text-gray-700">
                    <span>{link.label}</span>
                    <svg className="w-4 h-4 text-gray-300 group-hover:text-brand-orange transition-colors" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>

          </aside>

          {/* Right — contact form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-gray-100 p-8">

              {formState === "success" ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Message sent!</h2>
                  <p className="text-gray-500 text-sm max-w-xs mx-auto mb-8">
                    Thanks for reaching out. We'll get back to you at <span className="font-semibold text-gray-700">{form.email || "your email"}</span> within 24 hours.
                  </p>
                  <button
                    onClick={() => setFormState("idle")}
                    className="bg-brand-orange text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-orange-500 transition-colors">
                    Send another message
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-extrabold text-gray-900 mb-6">Send us a message</h2>

                  <div className="space-y-5">

                    {/* Name + Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">Your Name <span className="text-brand-orange">*</span></label>
                        <input
                          type="text"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          placeholder="e.g. Priya Sharma"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-brand-orange focus:ring-1 focus:ring-orange-200 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">Email Address <span className="text-brand-orange">*</span></label>
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder="you@example.com"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-brand-orange focus:ring-1 focus:ring-orange-200 transition-colors"
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">
                        Phone Number <span className="text-gray-400 font-normal">(optional)</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="e.g. +44 7700 900000"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-brand-orange focus:ring-1 focus:ring-orange-200 transition-colors"
                      />
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">Subject <span className="text-brand-orange">*</span></label>
                      <select
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:border-brand-orange focus:ring-1 focus:ring-orange-200 transition-colors appearance-none"
                      >
                        <option value="">Select a subject...</option>
                        {subjects.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">Message <span className="text-brand-orange">*</span></label>
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        rows={6}
                        placeholder="Tell us how we can help..."
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-brand-orange focus:ring-1 focus:ring-orange-200 transition-colors resize-none"
                      />
                      <p className="text-xs text-gray-400 mt-1">{form.message.length}/1000 characters</p>
                    </div>

                    {/* Error */}
                    {(errorMsg || formState === "error") && (
                      <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 flex gap-2 items-start">
                        <span className="text-red-400 flex-shrink-0">⚠️</span>
                        <p className="text-red-600 text-sm">{errorMsg || "Something went wrong. Please try again."}</p>
                      </div>
                    )}

                    {/* Submit */}
                    <button
                      onClick={handleSubmit}
                      disabled={formState === "loading"}
                      className="w-full bg-brand-orange text-white py-3.5 rounded-xl font-bold text-sm hover:bg-orange-500 transition-colors shadow-lg shadow-orange-100 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                      {formState === "loading" ? (
                        <>
                          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </>
                      )}
                    </button>

                    <p className="text-xs text-gray-400 text-center">
                      By submitting this form you agree to our{" "}
                      <Link href="/privacy" className="text-brand-orange hover:underline">Privacy Policy</Link>.
                    </p>
                  </div>
                </>
              )}

            </div>
          </div>

        </div>
      </div>

    </main>
  );
}
