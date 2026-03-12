import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Delivery Information | TrueMart",
  description: "TrueMart delivers across the UK via Royal Mail Tracked 48 and Tracked 24. Free delivery on orders over £25.",
};

const deliveryOptions = [
  {
    icon: "📦",
    name: "Royal Mail Tracked 48",
    speed: "2–3 working days",
    cost: "Calculated at checkout",
    badge: null,
    description: "Tracked delivery with SMS/email notifications. Delivered to your door within 2–3 working days after dispatch.",
  },
  {
    icon: "⚡",
    name: "Royal Mail Tracked 24",
    speed: "Next working day",
    cost: "Calculated at checkout",
    badge: "Fastest",
    description: "Priority tracked delivery with full notifications. Dispatched and delivered the next working day after processing.",
  },
];

const steps = [
  {
    number: "01",
    title: "Place your order",
    description: "Complete your purchase online. Delivery cost is calculated at checkout based on your parcel's size and weight.",
  },
  {
    number: "02",
    title: "We process & pack",
    description: "We carefully pack your order within 2 working days of receiving it. Some orders are dispatched even sooner.",
  },
  {
    number: "03",
    title: "Dispatched with Royal Mail",
    description: "Your parcel is handed to Royal Mail. You'll receive a tracking number and confirmation email straight away.",
  },
  {
    number: "04",
    title: "Delivered to your door",
    description: "Royal Mail delivers to your address. You'll receive SMS and email updates every step of the way.",
  },
];

export default function DeliveryPage() {
  return (
    <main className="min-h-screen bg-background">

      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-50 to-orange-100 border-b border-orange-100">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <div className="inline-flex items-center gap-2 bg-white border border-orange-200 rounded-full px-4 py-1.5 mb-6 shadow-sm">
            <span className="text-sm">🚚</span>
            <span className="text-xs font-semibold text-gray-600 tracking-wide">Delivery Information</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Fast, tracked delivery <span className="text-brand-orange">across the UK</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            All orders are dispatched via Royal Mail with full tracking.
          </p>

          {/* Key highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-10">
            {[
              { icon: "🎁", label: "Free delivery", sub: `on orders over ${SITE.delivery.freeThresholdDisplay}` },
              { icon: "⏱️", label: "Dispatched in", sub: `${SITE.delivery.processingDays} working days` },
              { icon: "📍", label: "Full tracking", sub: "SMS & email updates" },
              { icon: "🇬🇧", label: "UK wide", sub: "everywhere Royal Mail delivers" },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 border border-orange-100 shadow-sm text-center">
                <div className="text-2xl mb-1">{item.icon}</div>
                <div className="font-bold text-gray-900 text-sm">{item.label}</div>
                <div className="text-gray-500 text-xs mt-0.5">{item.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-14 space-y-16">

        {/* Free Delivery Banner */}
        <div className="bg-gradient-to-r from-brand-green to-green-600 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-4 text-white">
          <div className="text-5xl">🎁</div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-extrabold mb-1">Free delivery on orders over {SITE.delivery.freeThresholdDisplay}</h2>
            <p className="text-green-100 text-sm">Spend {SITE.delivery.freeThresholdDisplay} or more and we'll cover your standard delivery cost automatically at checkout. No code needed.</p>
          </div>
          <Link href="/shop" className="bg-white text-brand-green font-bold px-6 py-3 rounded-full text-sm hover:bg-green-50 transition-colors whitespace-nowrap shadow-lg">
            Shop Now
          </Link>
        </div>

        {/* Delivery included products note */}
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 flex gap-4 items-start">
          <div className="text-3xl flex-shrink-0">🏷️</div>
          <div>
            <h3 className="font-bold text-gray-900 mb-1">Some products include free delivery</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Certain products on TrueMart are listed with delivery already included in the price — these will be clearly marked on the product page. No minimum spend required for these items.
            </p>
          </div>
        </div>

        {/* Delivery Options */}
        <section>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Delivery options</h2>
          <p className="text-gray-500 text-sm mb-6">Delivery cost is calculated at checkout based on the size and weight of your order.</p>
          <div className="grid md:grid-cols-2 gap-4">
            {deliveryOptions.map((option, i) => (
              <div key={i} className={`bg-white rounded-2xl border p-6 relative ${i === 1 ? "border-brand-orange shadow-md shadow-orange-50" : "border-gray-100"}`}>
                {option.badge && (
                  <span className="absolute top-4 right-4 bg-brand-orange text-white text-xs font-bold px-3 py-1 rounded-full">
                    {option.badge}
                  </span>
                )}
                <div className="text-3xl mb-3">{option.icon}</div>
                <h3 className="font-extrabold text-gray-900 mb-1">{option.name}</h3>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-brand-green font-bold text-sm">⚡ {option.speed}</span>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">{option.description}</p>
                <div className="border-t border-gray-50 pt-4 flex items-center justify-between">
                  <span className="text-xs text-gray-400">Cost</span>
                  <span className="text-sm font-semibold text-gray-700">{option.cost}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-8">How your order gets to you</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {steps.map((step, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 flex gap-4">
                <div className="text-brand-orange font-extrabold text-2xl leading-none flex-shrink-0 w-10">{step.number}</div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{step.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Coverage */}
        <section className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
          <h2 className="text-xl font-extrabold text-gray-900 mb-4">Where do we deliver?</h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            We deliver to all addresses across the United Kingdom served by Royal Mail — including England, Scotland, Wales, Northern Ireland, the Scottish Highlands and Islands, and Channel Islands.
          </p>
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            Please note that delivery to remote areas such as the Scottish Highlands, Orkney, Shetland and the Channel Islands may take slightly longer than the standard timeframes shown.
          </p>
          <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
            <p className="text-sm text-gray-700 font-medium">🌍 International shipping coming soon</p>
            <p className="text-xs text-gray-500 mt-1">We currently deliver within the UK only. We're working on expanding to international destinations — stay tuned!</p>
          </div>
        </section>

        {/* Festival delays */}
        <section className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
          <h2 className="text-xl font-extrabold text-gray-900 mb-2">Festival & peak season delays</h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            During major Indian festivals such as Diwali, Raksha Bandhan, and Holi, we experience significantly higher order volumes. While we always aim to dispatch within {SITE.delivery.processingDays} working days, we recommend ordering early during these periods to avoid any disappointment.
          </p>
          <p className="text-gray-600 text-sm leading-relaxed">
            We will always notify you if there are any unexpected delays with your order.
          </p>
        </section>

        {/* Missed delivery */}
        <section className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
          <h2 className="text-xl font-extrabold text-gray-900 mb-4">What if I miss my delivery?</h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            If you are not in when Royal Mail attempts delivery, they will leave a card and either take the parcel to your local delivery office or attempt a redelivery. You can:
          </p>
          <ul className="space-y-2 text-sm text-gray-600">
            {[
              "Collect from your local Royal Mail delivery office (details on the card left)",
              "Arrange a free redelivery on the Royal Mail website using your tracking number",
              "Request a delivery to a neighbour or safe place via the Royal Mail app",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-brand-orange flex-shrink-0 mt-0.5">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Contact CTA */}
        <div className="bg-gradient-to-r from-brand-orange to-brand-red rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-extrabold mb-2">Questions about your delivery?</h2>
          <p className="text-orange-100 text-sm mb-6">We typically respond within 24 hours.</p>
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

      </div>
    </main>
  );
}
