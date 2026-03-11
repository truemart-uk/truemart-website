"use client";

import { useState } from "react";
import Link from "next/link";
import { SITE } from "@/lib/site";

type FAQ = {
  id: number;
  category: string;
  question: string;
  answer: string;
};

type AccordionItemProps = {
  faq: FAQ;
  isOpen: boolean;
  onToggle: () => void;
};

const categories = [
  { id: "all", label: "All", icon: "✦" },
  { id: "orders", label: "Orders & Shipping", icon: "🚚" },
  { id: "payments", label: "Payments", icon: "💳" },
  { id: "returns", label: "Returns", icon: "📦" },
  { id: "products", label: "Products", icon: "🛍️" },
];

const faqs = [
  {
    id: 1,
    category: "orders",
    question: "Do you ship internationally?",
    answer: "At the moment, we serve customers across the UK only. We are actively working on expanding our reach worldwide. Stay tuned — TrueMart will soon be bringing authentic Indian products to more homes around the globe!",
  },
  {
    id: 2,
    category: "orders",
    question: "How long does delivery take?",
    answer: "Delivery times depend on the service you select at checkout:\n\n• Standard Delivery: 3–5 working days\n• Express Delivery: 2–3 working days\n\nDelivery times may vary during peak festival seasons such as Diwali and Raksha Bandhan.",
  },
  {
    id: 3,
    category: "orders",
    question: "How can I track my order?",
    answer: "Once your order has been dispatched, you will receive a tracking link via email automatically. You can also log in to your account and visit the order summary page to track your delivery at any time.",
  },
  {
    id: 4,
    category: "payments",
    question: "What payment methods do you accept?",
    answer: "We accept all major debit and credit cards (Visa, Mastercard, American Express), Apple Pay, Google Pay and PayPal. All payments are processed securely through Stripe.",
  },
  {
    id: 5,
    category: "payments",
    question: "Is it safe to shop on TrueMart?",
    answer: "Absolutely. We use SSL encryption across our entire website and all payments are processed by Stripe — one of the world's most trusted payment providers. We never store your card details on our servers.",
  },
  {
    id: 6,
    category: "returns",
    question: "Can I return a product?",
    answer: "Yes. Under the UK Consumer Contracts Regulations 2013, you can return eligible items within 14 days of receiving your order. Items must be unused and in original packaging. Refunds are processed within 5-7 business days of receiving the return.\n\nSome items such as opened, used or personalised products are non-returnable for hygiene and safety reasons.",
  },
  {
    id: 7,
    category: "returns",
    question: "What if I receive a damaged or incorrect item?",
    answer: `Please contact us within 48 hours of delivery at ${SITE.contact.email} with your order number and clear photos of the issue. We will arrange a free replacement or full refund. Return shipping is fully covered by TrueMart in all cases of damaged or incorrect items.`,
  },
  {
    id: 8,
    category: "products",
    question: "Are your products authentic?",
    answer: "Yes, absolutely. All our products are carefully sourced from trusted suppliers and artisans to ensure authenticity and quality. We personally review each product before listing it on our store.",
  },
];

function AccordionItem({ faq, isOpen, onToggle }: AccordionItemProps) {
  return (
    <div className={`border rounded-2xl overflow-hidden transition-all duration-200 ${isOpen ? "border-brand-orange shadow-sm shadow-orange-100" : "border-gray-100 hover:border-orange-200"}`}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 p-5 text-left bg-white hover:bg-orange-50 transition-colors"
      >
        <span className="font-semibold text-gray-900 text-sm leading-snug flex-1">{faq.question}</span>
        <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${isOpen ? "bg-brand-orange text-white" : "bg-gray-100 text-gray-500"}`}>
          <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      {isOpen && (
        <div className="px-5 pb-5 bg-white border-t border-orange-50">
          <div className="pt-4">
            {faq.answer.split("\n").map((line, i) =>
              line.trim() === "" ? <br key={i} /> :
              line.startsWith("•") ? (
                <div key={i} className="flex items-start gap-2 mb-1.5">
                  <span className="text-brand-orange mt-1 flex-shrink-0">•</span>
                  <span className="text-gray-600 text-sm leading-relaxed">{line.replace("•", "").trim()}</span>
                </div>
              ) : (
                <p key={i} className="text-gray-600 text-sm leading-relaxed mb-2">{line}</p>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [openId, setOpenId] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const filtered = faqs.filter(faq => {
    const matchesCategory = activeCategory === "all" || faq.category === activeCategory;
    const matchesSearch = search === "" ||
      faq.question.toLowerCase().includes(search.toLowerCase()) ||
      faq.answer.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-background">

      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-50 to-orange-100 border-b border-orange-100">
        <div className="max-w-3xl mx-auto px-6 py-16 text-center">
          <div className="inline-flex items-center gap-2 bg-white border border-orange-200 rounded-full px-4 py-1.5 mb-6 shadow-sm">
            <span className="text-sm">💬</span>
            <span className="text-xs font-semibold text-gray-600 tracking-wide">Help Centre</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            How can we <span className="text-brand-orange">help?</span>
          </h1>
          <p className="text-gray-500 text-lg mb-8 max-w-xl mx-auto">
            Quick answers to the most common questions about TrueMart.
          </p>
          <div className="max-w-xl mx-auto flex items-center bg-white border-2 border-orange-200 rounded-full px-5 py-3 gap-3 shadow-sm focus-within:border-brand-orange transition-colors">
            <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search e.g. delivery, return, payment..."
              value={search}
              onChange={e => { setSearch(e.target.value); setActiveCategory("all"); }}
              className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
            />
            {search && (
              <button onClick={() => setSearch("")} className="text-gray-400 hover:text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-6 py-12">

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => { setActiveCategory(cat.id); setSearch(""); setOpenId(null); }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                activeCategory === cat.id
                  ? "bg-brand-orange text-white shadow-md shadow-orange-100"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-brand-orange hover:text-brand-orange"
              }`}
            >
              <span>{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* FAQ Accordion */}
        {filtered.length > 0 ? (
          <div className="space-y-3">
            {filtered.map(faq => (
              <AccordionItem
                key={faq.id}
                faq={faq}
                isOpen={openId === faq.id}
                onToggle={() => setOpenId(openId === faq.id ? null : faq.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-5xl mb-4">🔍</p>
            <h3 className="font-extrabold text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-500 text-sm mb-6">Try a different search term or browse all categories</p>
            <button onClick={() => { setSearch(""); setActiveCategory("all"); }}
              className="bg-brand-orange text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-orange-500 transition-colors">
              View All FAQs
            </button>
          </div>
        )}

        {/* Still need help */}
        <div className="mt-12 bg-gradient-to-r from-brand-orange to-brand-red rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-extrabold mb-2">Still need help?</h2>
          <p className="text-orange-100 text-sm mb-6 max-w-md mx-auto">
            Our team typically responds within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href={`mailto:${SITE.contact.email}`}
              className="inline-flex items-center gap-2 bg-white text-brand-orange px-6 py-3 rounded-full font-bold text-sm hover:bg-orange-50 transition-colors shadow-lg">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {SITE.contact.email}
            </a>
            <a href={`tel:${SITE.contact.phone.replace(/\s/g, "")}`}
              className="inline-flex items-center gap-2 border-2 border-white text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-white hover:text-brand-orange transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {SITE.contact.phone}
            </a>
            <Link href="/return-policy"
              className="inline-flex items-center gap-2 border-2 border-white text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-white hover:text-brand-orange transition-colors">
              Return Policy
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}
