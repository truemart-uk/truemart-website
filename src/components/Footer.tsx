import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="relative bg-orange-50 overflow-hidden border-t-4 border-brand-orange">

      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23FB923C' fill-opacity='1'%3E%3Cpath d='M40 0 L50 30 L80 30 L57 48 L67 80 L40 62 L13 80 L23 48 L0 30 L30 30 Z'/%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      {/* Main footer content */}
      <div className="relative max-w-6xl mx-auto px-6 pt-16 pb-10">

        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-14">

          {/* Brand column */}
          <div className="md:col-span-4">
            <Image src="/truemart_logo.png" alt="TrueMart" width={110} height={55} className="object-contain mb-5" />
            <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-xs">
              Bringing meaningful traditions into everyday living. Authentic products, cherished essentials and moments of joy — delivered to your doorstep.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              <p className="text-gray-500 text-xs font-semibold tracking-widest uppercase mr-1">Follow</p>
              {[
                { label: "Facebook", href: "#", path: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z", target: "_blank", rel: "noopener noreferrer" },
                { label: "Instagram", href: "#", path: "M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01M6.5 19.5h11a3 3 0 003-3v-11a3 3 0 00-3-3h-11a3 3 0 00-3 3v11a3 3 0 003 3z", target: "_blank", rel: "noopener noreferrer" },
                { label: "X", href: "https://x.com/TrueMart_UK", path: "M4 4l16 16M4 20L20 4", target: "_blank", rel: "noopener noreferrer" },
                { label: "WhatsApp", href: "#", path: "M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z", target: "_blank", rel: "noopener noreferrer" },
              ].map((social) => (
                <a key={social.label} href={social.href} target={social.target}  rel={social.rel} aria-label={social.label}
                  className="w-9 h-9 rounded-full border border-orange-200 bg-orange-50 flex items-center justify-center text-gray-500 hover:bg-brand-orange hover:text-white hover:border-brand-orange transition-all duration-200">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d={social.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Links columns */}
          <div className="md:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8">

            <div>
              <h4 className="text-gray-900 text-sm font-bold tracking-wider uppercase mb-5 flex items-center gap-2">
                <span className="w-4 h-px bg-brand-orange inline-block"></span>
                Shop
              </h4>
              <ul className="space-y-3">
                {[
                  { label: "Books", href: "/shop/books" },
                  { label: "Pooja Essentials", href: "/shop/pooja" },
                  { label: "Cosmetics", href: "/shop/cosmetics" },
                  { label: "Festivals", href: "/shop/festivals" },
                  { label: "Panchmasi Rakhi", href: "/shop/panchmasi" },
                ].map(item => (
                  <li key={item.label}>
                    <Link href={item.href} className="text-gray-500 text-sm hover:text-brand-orange transition-colors flex items-center gap-2 group">
                      <span className="w-0 group-hover:w-2 h-px bg-brand-orange transition-all duration-200 inline-block"></span>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-gray-900 text-sm font-bold tracking-wider uppercase mb-5 flex items-center gap-2">
                <span className="w-4 h-px bg-brand-orange inline-block"></span>
                Help
              </h4>
              <ul className="space-y-3">
                {[
                  { label: "FAQs", href: "/faqs" },
                  { label: "Return Policy", href: "/return-policy" },
                  { label: "Delivery Info", href: "/delivery" },
                  { label: "Contact Us", href: "/contact" },
                  { label: "Sell With Us", href: "/sell-with-us" },
                ].map(item => (
                  <li key={item.label}>
                    <Link href={item.href} className="text-gray-500 text-sm hover:text-brand-orange transition-colors flex items-center gap-2 group">
                      <span className="w-0 group-hover:w-2 h-px bg-brand-orange transition-all duration-200 inline-block"></span>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-gray-900 text-sm font-bold tracking-wider uppercase mb-5 flex items-center gap-2">
                <span className="w-4 h-px bg-brand-orange inline-block"></span>
                Contact
              </h4>
              <ul className="space-y-4">
                {[
                  { icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", text: SITE.contact.email },
                  { icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z", text: SITE.contact.phone },
                  { icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z", text: "United Kingdom 🇬🇧" },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <svg className="w-4 h-4 text-brand-orange mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                    </svg>
                    <span className="text-gray-500 text-sm">{item.text}</span>
                  </li>
                ))}
              </ul>

              {/* Trust badge */}
              <div className="mt-6 inline-flex items-center gap-2 bg-orange-50 border border-orange-100 rounded-full px-3 py-1.5">
                <svg className="w-3.5 h-3.5 text-brand-orange" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="text-gray-500 text-xs font-medium">Secure & Trusted</span>
              </div>
            </div>

          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-orange-200 to-transparent mb-8" />

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-xs">
            © {SITE.copyright.year} {SITE.copyright.text}
          </p>
          <div className="flex items-center gap-6">
            {[
              { label: "Privacy Policy", href: "/privacy" },
              { label: "Terms of Service", href: "/terms" },
              { label: "Cookie Policy", href: "/cookie-policy" },
            ].map(item => (
              <Link key={item.label} href={item.href} className="text-gray-400 text-xs hover:text-brand-orange transition-colors">
                {item.label}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
