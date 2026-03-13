import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "About Us | TrueMart",
  description: "Learn about TrueMart — a UK-based online store bringing authentic Indian products, Pooja essentials, books and festival items to your door.",
};

const values = [
  {
    emoji: "🏺",
    title: "Authenticity",
    desc: "Every product in our store is carefully sourced and verified. We never compromise on the genuine heritage of what we sell.",
  },
  {
    emoji: "✨",
    title: "Quality",
    desc: "From packaging to the product itself, we hold everything to the highest standard so it arrives at your door with care.",
  },
  {
    emoji: "🤝",
    title: "Community",
    desc: "TrueMart is more than a shop — it's a growing community of people who cherish their roots and celebrate their culture.",
  },
  {
    emoji: "🌍",
    title: "Accessibility",
    desc: "We believe authentic products should be within everyone's reach, wherever you are in the UK.",
  },
];

const stats = [
  { value: "100% Authentic", label: "Hand-Selected Quality" },
  { value: "UK Registered", label: "Shop with Confidence" },
  { value: "Highly Rated", label: "Loved by Our Community" },
  { value: "UK Wide", label: "Fast & Reliable Shipping" },
];

const journey = [
  {
    year: "The Idea",
    title: "Born from a need",
    desc: "TrueMart was founded by members of the UK's South Asian community who found it hard to source authentic products locally.",
  },
  {
    year: "The Mission",
    title: "Bringing traditions home",
    desc: "We set out to curate a collection that blends timeless traditions with modern lifestyles — from Pooja essentials to festival gifts.",
  },
  {
    year: "Today",
    title: "Growing together",
    desc: "We now serve customers across the UK and are constantly expanding our range while keeping our promise of authenticity and quality.",
  },
  {
    year: "Tomorrow",
    title: "Global ambitions",
    desc: "We're working towards reaching communities around the world — so no matter where you are, traditions stay close.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">

      {/* Hero */}
      <PageHero className="min-h-0">


        <div className="relative max-w-6xl mx-auto px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-white border border-orange-200 rounded-full px-4 py-1.5 mb-6 shadow-sm">
            <span className="text-sm">🪔</span>
            <span className="text-xs font-semibold text-gray-600 tracking-wide">Our Story</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
            Bringing
            <span className="text-brand-orange"> Traditions </span>
            <br />Closer To You
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed mb-10">
            A UK-based online store created with a simple mission — to connect people around the world with the rich culture, tradition, and everyday living.
          </p>

          {/* Stats */}
          <div className="inline-grid grid-cols-4 gap-px bg-orange-100 rounded-2xl overflow-hidden shadow-sm border border-orange-100">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white px-8 py-5 text-center">
                <p className="text-2xl font-extrabold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-400 mt-0.5 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </PageHero>

      {/* Mission Statement */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-block bg-orange-100 text-brand-orange text-xs font-bold px-3 py-1 rounded-full mb-4 tracking-widest uppercase">
              Who We Are
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-6">
              Authenticity is at the heart of everything we do
            </h2>
            <div className="space-y-4 text-gray-500 leading-relaxed">
              <p>
                TrueMart was born from the belief that authentic products — rich in heritage and craftsmanship — should be within everyone's reach. Our carefully curated collection blends timeless traditions with modern lifestyles.
              </p>
              <p>
                Our store is thoughtfully curated, and while our product range is constantly growing, our promise remains the same — <span className="font-semibold text-gray-800">authenticity, quality, and a customer-first experience.</span>
              </p>
              <p>
                While we currently serve customers across the UK, we invite you to explore our store and be part of a growing community that honours tradition, embraces modern living, and values meaningful connections.
              </p>
            </div>
            <div className="mt-8 flex gap-3">
              <Link href="/shop" className="inline-flex items-center gap-2 bg-brand-orange text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-orange-500 transition-colors shadow-lg shadow-orange-100">
                Explore Our Store
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link href="/contact" className="inline-flex items-center gap-2 border-2 border-gray-200 text-gray-700 px-6 py-3 rounded-full font-bold text-sm hover:border-brand-orange hover:text-brand-orange transition-colors">
                Get In Touch
              </Link>
            </div>
          </div>

          {/* Visual card */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-red-50 rounded-3xl transform rotate-3" />
            <div className="relative bg-white rounded-3xl p-8 shadow-xl border border-orange-50">
              <div className="flex items-center gap-3 mb-6">
                <Image src="/truemart_logo.png" alt="TrueMart" width={50} height={50} className="object-contain" />
                <div>
                  <p className="font-extrabold text-gray-900">TrueMart</p>
                  <p className="text-xs text-brand-orange font-medium">UK Based • Est. 2025</p>
                </div>
              </div>
              <blockquote className="text-gray-600 text-lg leading-relaxed italic border-l-4 border-brand-orange pl-4 mb-6">
                "We're glad you're here. Thank you for choosing TrueMart."
              </blockquote>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { emoji: "📦", text: "Carefully curated products" },
                  { emoji: "🚚", text: "UK wide delivery" },
                  { emoji: "🌿", text: "Authentic & natural" },
                  { emoji: "💛", text: "Community first" },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-2 bg-orange-50 rounded-xl px-3 py-2">
                    <span className="text-sm">{item.emoji}</span>
                    <span className="text-xs text-gray-600 font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="bg-white py-20 border-y border-orange-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="inline-block bg-orange-100 text-brand-orange text-xs font-bold px-3 py-1 rounded-full mb-4 tracking-widest uppercase">
              What We Stand For
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Our Values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <div key={value.title}
                className="relative group p-6 rounded-2xl border border-gray-100 hover:border-orange-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white">
                <div className="absolute top-4 right-4 text-xs font-bold text-orange-100 group-hover:text-orange-200 transition-colors">
                  0{i + 1}
                </div>
                <div className="text-4xl mb-4">{value.emoji}</div>
                <h3 className="font-extrabold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Journey */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <div className="inline-block bg-orange-100 text-brand-orange text-xs font-bold px-3 py-1 rounded-full mb-4 tracking-widest uppercase">
            How We Got Here
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Our Journey</h2>
        </div>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-orange-100 hidden md:block" />

          <div className="space-y-12">
            {journey.map((item, i) => (
              <div key={item.year} className={`relative flex flex-col md:flex-row gap-8 items-center ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                {/* Content */}
                <div className="flex-1 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <span className="inline-block bg-orange-100 text-brand-orange text-xs font-bold px-3 py-1 rounded-full mb-3 tracking-widest uppercase">
                    {item.year}
                  </span>
                  <h3 className="font-extrabold text-gray-900 text-lg mb-2">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                </div>

                {/* Timeline dot */}
                <div className="hidden md:flex w-10 h-10 bg-brand-orange rounded-full items-center justify-center flex-shrink-0 shadow-lg shadow-orange-200 z-10">
                  <div className="w-3 h-3 bg-white rounded-full" />
                </div>

                {/* Empty spacer for alternating layout */}
                <div className="flex-1 hidden md:block" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-brand-orange to-brand-red py-16 mx-6 md:mx-auto max-w-6xl rounded-3xl mb-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff'%3E%3Ccircle cx='20' cy='20' r='3'/%3E%3C/g%3E%3C/svg%3E")`
        }} />
        <div className="relative text-center px-6">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            Ready to Explore TrueMart?
          </h2>
          <p className="text-orange-100 text-lg mb-8 max-w-xl mx-auto">
            Join our growing community and bring the richness of traditions into your home today.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/shop" className="inline-block bg-white text-brand-orange px-8 py-3.5 rounded-full font-bold hover:bg-orange-50 transition-colors shadow-lg">
              Shop Now
            </Link>
            <Link href="/contact" className="inline-block border-2 border-white text-white px-8 py-3.5 rounded-full font-bold hover:bg-white hover:text-brand-orange transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
