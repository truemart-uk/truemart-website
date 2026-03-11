import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Return Policy | TrueMart",
  description: " TrueMart",
};

import Link from "next/link";
import { SITE } from "@/lib/site";

const sections = [
  {
    id: "eligibility",
    icon: "✅",
    title: "Your Right to Return",
    ukLaw: "UK Consumer Contracts Regulations 2013",
    content: [
      {
        type: "text",
        value: "Under the UK Consumer Contracts Regulations 2013, you have the right to cancel and return most online purchases within 14 days of receiving your goods — no reason needed. This is your statutory right and cannot be taken away.",
      },
      {
        type: "highlight",
        value: "You have 14 days to notify us of your wish to return, and a further 14 days to send the item back after notification.",
      },
    ],
  },
  {
    id: "non-returnable",
    icon: "🚫",
    title: "Non-Returnable Items",
    ukLaw: "Consumer Contracts Regulations 2013 — Regulation 28 Exceptions",
    content: [
      {
        type: "text",
        value: "The following items are exempt from the standard 14-day return right under Regulation 28 of the Consumer Contracts Regulations 2013:",
      },
      {
        type: "list",
        label: "TrueMart Products",
        items: [
          "Opened or used items (hygiene and safety reasons)",
          "Custom or personalised items made to your specification",
          "Perishable goods or items with a short shelf life",
          "Sealed goods which are not suitable for return once opened",
        ],
      },
      {
        type: "note",
        value: "Even non-returnable items can be returned if they arrive damaged, defective, or not as described. This is your right under the Consumer Rights Act 2015.",
      },
    ],
  },
  {
    id: "damaged",
    icon: "📦",
    title: "Damaged, Defective or Incorrect Items",
    ukLaw: "Consumer Rights Act 2015",
    content: [
      {
        type: "text",
        value: "Under the Consumer Rights Act 2015, all goods must be of satisfactory quality, fit for purpose, and as described. If your item arrives damaged, defective, or incorrect, you are entitled to a full remedy.",
      },
      {
        type: "highlight",
        value: "Please contact us within 48 hours of delivery with your order number, clear photos of the issue, and a brief description.",
      },
      {
        type: "text",
        value: "We will arrange a free replacement or full refund. Return shipping costs will be covered by TrueMart in all cases of damaged or incorrect items.",
      },
    ],
  },
  {
    id: "how-to-return",
    icon: "📬",
    title: "How to Return an Item",
    ukLaw: null,
    content: [
      {
        type: "steps",
        label: "TrueMart Products",
        items: [
          `Email ${SITE.contact.email} with your return request and order number`,
          "We will review and confirm whether your item is eligible within 2 business days",
          "If approved, we will provide the return address",
          "Ship the item back within 14 days of approval in its original packaging",
          "Refund will be processed within 5–7 business days of receiving the return",
        ],
      },
      {
        type: "note",
        value: "Customers are responsible for return shipping costs unless the item is damaged or faulty. We recommend using a tracked service as we cannot be responsible for items lost in transit.",
      },
    ],
  },
  {
    id: "cancellation",
    icon: "❌",
    title: "Order Cancellation",
    ukLaw: "UK Consumer Contracts Regulations 2013",
    content: [
      {
        type: "list",
        label: "TrueMart Products",
        items: [
          "You may cancel your order at any time before dispatch",
          `Email ${SITE.contact.email} as soon as possible with your order number`,
          "Once dispatched, your standard 14-day return right applies",
        ],
      },
    ],
  },
  {
    id: "lost-orders",
    icon: "🔍",
    title: "Lost or Undelivered Orders",
    ukLaw: null,
    content: [
      {
        type: "list",
        label: "Lost Orders",
        items: [
          "Report a lost order within 30 days of the estimated delivery date",
          "We will investigate with the courier and resend the item free of charge if confirmed lost",
          "If the item is confirmed delivered by the courier, we may not be able to issue a replacement",
        ],
      },
      {
        type: "list",
        label: "Returned to Sender",
        items: [
          "Occurs due to wrong address, rejected delivery, or unclaimed parcels",
          "TrueMart will refund the product cost once returned item is received",
          "Original shipping costs are non-refundable in these cases",
          "A new order must be placed for redelivery",
        ],
      },
    ],
  },
  {
    id: "refunds",
    icon: "💳",
    title: "Refunds",
    ukLaw: "Consumer Rights Act 2015",
    content: [
      {
        type: "text",
        value: "Under the Consumer Rights Act 2015, you are entitled to a full refund within 14 days of us receiving the returned item, or within 14 days of you providing proof of return.",
      },
      {
        type: "highlight",
        value: "TrueMart processes refunds within 5–7 business days of receiving and inspecting your return. Refunds are issued to your original payment method.",
      },
      {
        type: "text",
        value: "You will receive an email confirmation once your refund has been processed. Please allow additional time for your bank to process the payment.",
      },
      {
        type: "note",
        value: "If you paid by credit card, your card provider may take up to 5 additional business days to post the refund to your account.",
      },
    ],
  },
];

export default function ReturnPolicyPage() {
  return (
    <main className="min-h-screen bg-background">

      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-50 to-orange-100 border-b border-orange-100">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <div className="inline-flex items-center gap-2 bg-white border border-orange-200 rounded-full px-4 py-1.5 mb-6 shadow-sm">
            <span className="text-sm">⚖️</span>
            <span className="text-xs font-semibold text-gray-600 tracking-wide">UK Consumer Law Compliant</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Return & Refund Policy
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto mb-6">
            We want you to shop with confidence. Our policy is fully compliant with UK consumer law and designed to be fair, clear and straightforward.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            <span className="bg-white border border-orange-200 text-gray-600 px-4 py-1.5 rounded-full font-medium">
              📅 Last updated: 13 July 2025
            </span>
            <span className="bg-orange-50 border border-orange-200 text-brand-orange px-4 py-1.5 rounded-full font-medium">
              ✅ 14-day return window
            </span>
            <span className="bg-orange-50 border border-orange-200 text-brand-orange px-4 py-1.5 rounded-full font-medium">
              💳 5–7 day refunds
            </span>
          </div>
        </div>
      </section>

      {/* Quick Summary Cards */}
      <section className="max-w-4xl mx-auto px-6 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: "📅", title: "14 Days", desc: "To return most items" },
            { icon: "💳", title: "5–7 Days", desc: "Refund processing time" },
            { icon: "⚠️", icon2: true, title: "48 Hours", desc: "Report damaged items" },
            { icon: "📧", title: "Email Us", desc: SITE.contact.email },
          ].map((card) => (
            <div key={card.title} className="bg-white rounded-2xl p-5 text-center border border-gray-100 shadow-sm">
              <div className="text-2xl mb-2">{card.icon}</div>
              <p className="font-extrabold text-gray-900 text-sm">{card.title}</p>
              <p className="text-xs text-gray-500 mt-1">{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sidebar + Content */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

          {/* Table of Contents Sidebar */}
          <aside className="lg:col-span-2">
            <div className="sticky top-24 bg-white rounded-2xl border border-gray-100 p-5">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Contents</h2>
              <nav className="space-y-1">
                {sections.map((section, i) => (
                  <a key={section.id} href={`#${section.id}`}
                    className="flex items-center gap-2.5 text-xs text-gray-500 hover:text-brand-orange transition-colors group py-1.5 whitespace-nowrap">
                    <span className="w-5 h-5 bg-orange-50 rounded-full flex items-center justify-center text-xs font-bold text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-colors flex-shrink-0">
                      {i + 1}
                    </span>
                    {section.title}
                  </a>
                ))}
              </nav>

              {/* Quick summary */}
              <div className="mt-6 pt-5 border-t border-gray-100 space-y-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Quick Summary</p>
                {[
                  { icon: "📅", text: "14 days to return" },
                  { icon: "💳", text: "5–7 day refunds" },
                  { icon: "⚠️", text: "48hrs for damaged items" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{item.icon}</span>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Policy Sections */}
          <div className="lg:col-span-3 space-y-6">
        {sections.map((section) => (
          <div key={section.id} id={section.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

            {/* Section Header */}
            <div className="p-6 border-b border-gray-50">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{section.icon}</span>
                <h2 className="text-lg font-extrabold text-gray-900">{section.title}</h2>
              </div>
              {section.ukLaw && (
                <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full border border-blue-100">
                  ⚖️ {section.ukLaw}
                </span>
              )}
            </div>

            {/* Section Content */}
            <div className="p-6 space-y-4">
              {section.content.map((block, i) => {
                if (block.type === "text") {
                  return <p key={i} className="text-gray-600 text-sm leading-relaxed">{block.value}</p>;
                }
                if (block.type === "highlight") {
                  return (
                    <div key={i} className="bg-orange-50 border-l-4 border-brand-orange rounded-r-xl px-4 py-3">
                      <p className="text-gray-700 text-sm font-medium leading-relaxed">{block.value}</p>
                    </div>
                  );
                }
                if (block.type === "note") {
                  return (
                    <div key={i} className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex gap-2">
                      <span className="text-blue-500 flex-shrink-0 mt-0.5">ℹ️</span>
                      <p className="text-blue-700 text-sm leading-relaxed">{block.value}</p>
                    </div>
                  );
                }
                if (block.type === "list") {
                  return (
                    <div key={i}>
                      {block.label && (
                        <p className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                          <span className="w-3 h-px bg-brand-orange inline-block"></span>
                          {block.label}
                        </p>
                      )}
                      <ul className="space-y-2">
                        {block.items?.map((item, j) => (
                          <li key={j} className="flex items-start gap-2.5 text-sm text-gray-600">
                            <svg className="w-4 h-4 text-brand-orange mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
                            </svg>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                }
                if (block.type === "steps") {
                  return (
                    <div key={i}>
                      {block.label && (
                        <p className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                          <span className="w-3 h-px bg-brand-orange inline-block"></span>
                          {block.label}
                        </p>
                      )}
                      <ol className="space-y-3">
                        {block.items?.map((item, j) => (
                          <li key={j} className="flex items-start gap-3 text-sm text-gray-600">
                            <span className="w-6 h-6 bg-brand-orange text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                              {j + 1}
                            </span>
                            {item}
                          </li>
                        ))}
                      </ol>
                    </div>
                  );
                }
                return null;
              })}


            </div>
          </div>
        ))}

        {/* Contact Section */}
        <div className="bg-gradient-to-r from-brand-orange to-brand-red rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-extrabold mb-2">Need Help with a Return?</h2>
          <p className="text-orange-100 mb-6 text-sm">Our team is here to help. Contact us and we'll resolve your issue promptly.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href={`mailto:${SITE.contact.email}`}
              className="inline-flex items-center gap-2 bg-white text-brand-orange px-6 py-3 rounded-full font-bold text-sm hover:bg-orange-50 transition-colors shadow-lg">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {SITE.contact.email}
            </a>
            <Link href="/faqs"
              className="inline-flex items-center gap-2 border-2 border-white text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-white hover:text-brand-orange transition-colors">
              View FAQs
            </Link>
          </div>
        </div>

        {/* Legal disclaimer */}
        <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6">
          <p className="text-xs text-gray-400 leading-relaxed">
            <span className="font-semibold text-gray-500">Legal Notice:</span> This policy is governed by and construed in accordance with the laws of England and Wales. Your statutory rights under the Consumer Rights Act 2015, Consumer Contracts Regulations 2013, and all other applicable UK consumer protection legislation are not affected by this policy. TrueMart is a UK-based business. For disputes, you may also refer to the Online Dispute Resolution platform at <a href="https://ec.europa.eu/consumers/odr" className="text-brand-orange hover:underline" target="_blank" rel="noopener noreferrer">ec.europa.eu/consumers/odr</a>.
          </p>
        </div>

          </div>
        </div>
      </section>

    </main>
  );
}
