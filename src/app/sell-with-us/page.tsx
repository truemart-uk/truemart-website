import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sell With TrueMart — Reach Thousands of UK Customers",
  description: "Join TrueMart as a vendor. Sell your products to thousands of UK customers. 10% commission, no monthly fee, bi-weekly payouts.",
};

const steps = [
  { num: "01", title: "Apply Online", desc: "Fill in your business details, product catalogue and upload your registration documents. Takes about 10 minutes.", icon: "📋" },
  { num: "02", title: "Get Approved", desc: "Our team reviews your application within 1–3 business days. We'll notify you by email with the outcome.", icon: "✅" },
  { num: "03", title: "List Products", desc: "Add your products through your vendor dashboard. Each listing is reviewed by TrueMart before going live.", icon: "🛍️" },
  { num: "04", title: "Start Selling", desc: "Customers discover your products. Orders come in, we handle payments and customer support. You ship and earn.", icon: "🚀" },
];

const fees = [
  { label: "Commission per sale", value: "10%", note: "Of the product sale price, excluding delivery" },
  { label: "Monthly fee", value: "Free", note: "No subscription, no hidden charges" },
  { label: "Listing fee", value: "Free", note: "List as many products as you need" },
  { label: "Payment processing", value: "Included", note: "Handled by TrueMart via Stripe" },
  { label: "Payout schedule", value: "Bi-weekly", note: "Direct to your UK bank account" },
  { label: "Minimum payout", value: "Not Applicable", note: "Earnings below this roll over to next period" },
];

const policies = [
  {
    icon: "📦",
    title: "Returns Policy",
    points: [
      "Accept returns within 30 days of delivery",
      "Product must be in original, undamaged condition",
      "Vendor bears return shipping cost for faulty or misdescribed items",
      "Customer-change-of-mind returns: customer bears return postage",
      "TrueMart mediates disputes between vendor and customer",
    ],
  },
  {
    icon: "✅",
    title: "Product Quality",
    points: [
      "All products must be authentic and accurately described",
      "Images must be real photos of the actual product",
      "No counterfeit, misleading or prohibited goods",
      "Products must align with TrueMart categories",
      "TrueMart reserves the right to remove non-compliant listings",
    ],
  },
  {
    icon: "🚚",
    title: "Delivery Standards",
    points: [
      "Dispatch within 2 working days of order confirmation",
      "Use tracked shipping for all orders",
      "UK delivery only (initially)",
      "Packaging must protect the product adequately",
      "Failure to dispatch on time may result in account suspension",
    ],
  },
  {
    icon: "⚖️",
    title: "Legal Requirements",
    points: [
      "Valid UK business registration (sole trader or Ltd company)",
      "UTR number or Companies House registration number",
      "UK bank account for payouts",
      "Compliance with UK Consumer Rights Act 2015",
      "Compliance with UK GDPR for any customer data",
    ],
  },
];

const faqs = [
  { q: "How long does approval take?", a: "We aim to review all applications within 1–3 business days. You'll receive an email either way." },
  { q: "When do I get paid?", a: "Payouts are processed bi-weekly directly to your UK bank account, provided your balance is at least £50." },
  { q: "What if a customer returns a product?", a: "TrueMart handles the customer return communication. The refund is deducted from your next payout. We'll notify you of every return." },
  { q: "Can I sell on other platforms too?", a: "Yes — there's no exclusivity requirement. You can sell on Amazon, Etsy, or your own website simultaneously." },
  { q: "What if my product gets a bad review?", a: "Reviews are part of the marketplace experience. TrueMart moderates abusive reviews. We encourage vendors to respond constructively." },
  { q: "Who handles customer enquiries?", a: "TrueMart handles all customer support. You'll only need to deal with dispatch and occasionally returns." },
  { q: "Can I set my own prices?", a: "Yes — you set the price. TrueMart takes 10% commission on the sale price, not including delivery." },
  { q: "What products can I sell?", a: "You can sell across any of our product categories. Contact us if you are unsure whether your products are a good fit." },
];

export default function SellWithUsPage() {
  return (
    <div className="bg-background">

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-orange-50 via-background to-amber-50 py-20 px-6 border-b border-orange-100">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block bg-brand-orange text-white text-xs font-bold px-3 py-1 rounded-full mb-5 uppercase tracking-wider">
                Vendor Programme
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-5">
                Sell Authentic Products to the UK
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                Join TrueMart's growing marketplace and reach thousands of customers across the UK. Simple setup, fair commission, zero monthly fees.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/vendor/onboarding"
                  className="bg-brand-orange hover:bg-orange-500 text-white font-bold px-8 py-4 rounded-2xl text-base transition text-center shadow-lg shadow-orange-100">
                  Apply to Sell →
                </Link>
                <a href="#how-it-works"
                  className="border-2 border-gray-200 hover:border-brand-orange text-gray-700 font-semibold px-8 py-4 rounded-2xl text-base transition text-center">
                  Learn More
                </a>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              {[
              { value: "10% Fixed", label: "Commission Rate", icon: "💷" },
              { value: "Free",     label: "Listing Fee",     icon: "✅" },
              { value: "None",     label: "Monthly Fee",     icon: "🚫" },
              { value: "Bi-weekly",label: "Payouts",         icon: "📅" },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5 text-center shadow-sm">
                  <div className="text-3xl mb-2">{s.icon}</div>
                  <p className="text-2xl font-extrabold text-gray-900">{s.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── WHO CAN SELL ──────────────────────────────────────────────────── */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Who Can Sell?</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Open to all UK-registered businesses selling quality products.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-green-50 border border-green-100 rounded-2xl p-6">
              <h3 className="font-bold text-green-800 text-lg mb-4 flex items-center gap-2">
                <span className="text-2xl">✅</span> Eligible Sellers
              </h3>
              <ul className="space-y-2.5">
                {[
                  "Sole traders registered in the UK",
                  "Private limited companies (UK Ltd)",
                  "Sellers of quality products in our categories",
                  "Products that match our existing categories",
                  "Businesses with a UK bank account",
                ].map(i => (
                  <li key={i} className="flex items-start gap-2 text-sm text-green-700">
                    <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    {i}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-red-50 border border-red-100 rounded-2xl p-6">
              <h3 className="font-bold text-red-800 text-lg mb-4 flex items-center gap-2">
                <span className="text-2xl">❌</span> Not Accepted
              </h3>
              <ul className="space-y-2.5">
                {[
                  "Counterfeit or replica products",
                  "Products outside our accepted categories",
                  "Adult content or age-restricted items",
                  "Prohibited goods under UK law",
                  "Sellers without UK business registration",
                ].map(i => (
                  <li key={i} className="flex items-start gap-2 text-sm text-red-700">
                    <svg className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                    </svg>
                    {i}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────────────── */}
      <section id="how-it-works" className="bg-orange-50 py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">How It Works</h2>
            <p className="text-gray-500">Four simple steps from application to first sale</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <div key={step.num} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-orange-200 z-0" style={{ width: "calc(100% - 2rem)", left: "calc(50% + 2rem)" }} />
                )}
                <div className="bg-white rounded-2xl border border-orange-100 p-5 text-center relative z-10">
                  <div className="text-3xl mb-3">{step.icon}</div>
                  <span className="text-xs font-bold text-brand-orange">{step.num}</span>
                  <h3 className="font-bold text-gray-900 mt-1 mb-2">{step.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEES ──────────────────────────────────────────────────────────── */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Simple, Transparent Fees</h2>
            <p className="text-gray-500">No surprises. You earn, we take a small cut. That's it.</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {fees.map((fee, i) => (
              <div key={fee.label} className={`flex items-center justify-between px-6 py-4 ${i < fees.length - 1 ? "border-b border-gray-50" : ""}`}>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{fee.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{fee.note}</p>
                </div>
                <span className={`font-extrabold text-lg ${fee.value === "Free" || fee.value === "Included" ? "text-green-600" : "text-brand-orange"}`}>
                  {fee.value}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 text-center mt-4">
            * Example: You sell a book for £10. TrueMart takes £1 (10%). You receive £9, minus any applicable return deductions.
          </p>
        </div>
      </section>

      {/* ── WHAT TRUEMART PROVIDES ────────────────────────────────────────── */}
      <section className="bg-gray-50 py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">What TrueMart Provides</h2>
            <p className="text-gray-500">We handle the hard parts so you can focus on your products</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { icon: "👥", title: "Customer Base", desc: "Access to TrueMart's growing customer base across the UK" },
              { icon: "💳", title: "Payment Processing", desc: "Secure payments via Stripe. No need for your own payment gateway" },
              { icon: "🛒", title: "Storefront & Pages", desc: "Professional product pages, cart and checkout — all built and maintained by TrueMart" },
              { icon: "📊", title: "Vendor Dashboard", desc: "Manage your products, track orders and monitor your earnings in one place" },
              { icon: "💬", title: "Customer Support", desc: "TrueMart handles all customer enquiries, complaints and returns communications" },
              { icon: "📣", title: "Marketing", desc: "Your products promoted through TrueMart's email campaigns and social media channels" },
            ].map(b => (
              <div key={b.title} className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="text-3xl mb-3">{b.icon}</div>
                <h3 className="font-bold text-gray-900 mb-1">{b.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── POLICIES ──────────────────────────────────────────────────────── */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Vendor Policies</h2>
            <p className="text-gray-500 max-w-xl mx-auto">All vendors must agree to and comply with these policies. Violations may result in listing removal or account suspension.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {policies.map(policy => (
              <div key={policy.title} className="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 className="font-bold text-gray-900 text-base mb-4 flex items-center gap-2">
                  <span className="text-xl">{policy.icon}</span>
                  {policy.title}
                </h3>
                <ul className="space-y-2">
                  {policy.points.map(point => (
                    <li key={point} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-brand-orange mt-1 flex-shrink-0">•</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-6 bg-amber-50 border border-amber-100 rounded-2xl p-5 flex items-start gap-3">
            <span className="text-2xl flex-shrink-0">⚖️</span>
            <div>
              <p className="font-semibold text-amber-800 text-sm">Legal Compliance</p>
              <p className="text-sm text-amber-700 mt-1 leading-relaxed">
                By selling on TrueMart, you confirm your business complies with UK Consumer Rights Act 2015, UK GDPR, and all applicable trading standards. TrueMart reserves the right to remove any product or vendor that fails to meet legal requirements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQs ──────────────────────────────────────────────────────────── */}
      <section className="bg-orange-50 py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3">
            {faqs.map(faq => (
              <details key={faq.q} className="bg-white rounded-2xl border border-gray-100 group">
                <summary className="px-6 py-4 font-semibold text-gray-900 text-sm cursor-pointer flex items-center justify-between list-none">
                  {faq.q}
                  <svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                  </svg>
                </summary>
                <div className="px-6 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-50 pt-3">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ───────────────────────────────────────────────────────── */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Get in Touch</h2>
            <p className="text-gray-500">Have questions before applying? We're here to help.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5 mb-10">
            <a href="mailto:contact@truemart.co.uk"
              className="bg-white rounded-2xl border border-gray-100 p-6 text-center hover:border-brand-orange hover:shadow-md transition group">
              <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-orange transition">
                <svg className="w-6 h-6 text-brand-orange group-hover:text-white transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Email Us</h3>
              <p className="text-sm text-brand-orange font-medium">contact@truemart.co.uk</p>
              <p className="text-xs text-gray-400 mt-1">We reply within 1 business day</p>
            </a>

            <a href="tel:+447587888937"
              className="bg-white rounded-2xl border border-gray-100 p-6 text-center hover:border-brand-orange hover:shadow-md transition group">
              <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-orange transition">
                <svg className="w-6 h-6 text-brand-orange group-hover:text-white transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Call Us</h3>
              <p className="text-sm text-brand-orange font-medium">+44 7587 888937</p>
              <p className="text-xs text-gray-400 mt-1">Mon–Fri, 9am–5pm GMT</p>
            </a>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center">
              <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-brand-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Response Time</h3>
              <p className="text-sm text-brand-orange font-medium">Within 24 hours</p>
              <p className="text-xs text-gray-400 mt-1">On all business enquiries</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-5xl mb-5">🤝</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Ready to Start Selling?</h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Join TrueMart's vendor programme today. Free to join, 10% commission, bi-weekly payouts. Quality products, delivered to UK doorsteps.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/vendor/onboarding"
              className="bg-brand-orange hover:bg-orange-500 text-white font-bold px-8 py-4 rounded-2xl text-base transition shadow-lg shadow-orange-100">
              Apply to Sell Now →
            </Link>
            <a href="mailto:contact@truemart.co.uk"
              className="border-2 border-gray-200 hover:border-brand-orange text-gray-700 font-semibold px-8 py-4 rounded-2xl text-base transition">
              Ask a Question
            </a>
          </div>
          <p className="text-xs text-gray-400 mt-5">Questions? Email us at <a href="mailto:contact@truemart.co.uk" className="text-brand-orange hover:underline">contact@truemart.co.uk</a></p>
        </div>
      </section>

    </div>
  );
}
