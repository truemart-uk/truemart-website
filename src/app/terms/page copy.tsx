import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | TrueMart",
  description: " TrueMart",
};

import Link from "next/link";

const sections = [
  { id: "about", title: "1. About These Terms" },
  { id: "eligibility", title: "2. Eligibility" },
  { id: "account", title: "3. Your Account" },
  { id: "orders", title: "4. Placing an Order" },
  { id: "pricing", title: "5. Pricing & Payment" },
  { id: "delivery", title: "6. Delivery" },
  { id: "cancellation", title: "7. Cancellation Rights" },
  { id: "returns", title: "8. Returns & Refunds" },
  { id: "products", title: "9. Products & Descriptions" },
  { id: "reviews", title: "10. Reviews & User Content" },
  { id: "intellectual-property", title: "11. Intellectual Property" },
  { id: "liability", title: "12. Liability" },
  { id: "governing-law", title: "13. Governing Law" },
  { id: "changes", title: "14. Changes to Terms" },
  { id: "contact", title: "15. Contact Us" },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background">

      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-50 to-orange-100 border-b border-orange-100">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <div className="inline-flex items-center gap-2 bg-white border border-orange-200 rounded-full px-4 py-1.5 mb-6 shadow-sm">
            <span className="text-sm">📋</span>
            <span className="text-xs font-semibold text-gray-600 tracking-wide">Legal</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Terms of <span className="text-brand-orange">Service</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto mb-6">
            The rules and conditions that govern your use of TrueMart and any purchases you make.
          </p>
          <div className="inline-flex items-center gap-2 bg-white border border-orange-100 rounded-full px-4 py-2 text-xs text-gray-500">
            <span className="w-2 h-2 bg-brand-green rounded-full inline-block"></span>
            Last updated: 13 July 2025 &nbsp;·&nbsp; Governed by the laws of England & Wales
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

          {/* Table of Contents */}
          <aside className="lg:col-span-2">
            <div className="sticky top-24 bg-white rounded-2xl border border-gray-100 p-5">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Contents</h2>
              <nav className="space-y-1">
                {sections.map(s => (
                  <a key={s.id} href={`#${s.id}`}
                    className="block text-xs text-gray-500 hover:text-brand-orange transition-colors py-1 leading-snug whitespace-nowrap">
                    {s.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-12 text-sm text-gray-600 leading-relaxed">

            {/* Intro */}
            <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6">
              <p className="text-gray-700">
                These Terms of Service ("Terms") form a legally binding agreement between you and <strong>TrueMart</strong> (trading as <strong>TrueMart.co.uk</strong>), governing your use of our website and any purchases you make. Please read them carefully before using our website or placing an order.
              </p>
              <p className="mt-3 text-gray-700">
                By accessing our website or placing an order, you confirm that you accept these Terms. If you do not agree, you must not use our website.
              </p>
              <p className="mt-3 text-gray-700">
                These Terms comply with the <strong>Consumer Rights Act 2015</strong>, the <strong>Consumer Contracts (Information, Cancellation and Additional Charges) Regulations 2013</strong>, the <strong>Sale of Goods Act 1979</strong>, and other applicable UK consumer protection legislation.
              </p>
            </div>

            {/* 1. About These Terms */}
            <section id="about">
              <h2 className="text-xl font-extrabold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-7 h-7 bg-orange-100 text-brand-orange rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                About These Terms
              </h2>
              <p className="mb-3">TrueMart is operated by TrueMart, a UK-based online retailer. Our contact details are:</p>
              <div className="bg-white border border-gray-100 rounded-xl p-5 space-y-1 mb-3">
                <p><strong>TrueMart</strong></p>
                <p>Website: <a href="https://www.truemart.co.uk" className="text-brand-orange hover:underline">www.truemart.co.uk</a></p>
                <p>Email: <a href="mailto:contact@truemart.co.uk" className="text-brand-orange hover:underline">contact@truemart.co.uk</a></p>
                <p>Phone: <a href="tel:+447442020454" className="text-brand-orange hover:underline">+44 7442020454</a></p>
              </div>
              <p>These Terms apply to all use of our website and to all orders placed through it.</p>
            </section>

            {/* 2. Eligibility */}
            <section id="eligibility">
              <h2 className="text-xl font-extrabold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-7 h-7 bg-orange-100 text-brand-orange rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                Eligibility
              </h2>
              <p className="mb-3">To use TrueMart and place orders, you must:</p>
              <ul className="space-y-2">
                {[
                  "Be at least 18 years of age",
                  "Be resident in the United Kingdom",
                  "Have a valid payment method accepted by TrueMart",
                  "Provide accurate and truthful information when creating an account or placing an order",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-brand-orange flex-shrink-0 mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3">By placing an order, you confirm that you meet these requirements. TrueMart reserves the right to refuse service or cancel orders where these conditions are not met.</p>
            </section>

            {/* 3. Account */}
            <section id="account">
              <h2 className="text-xl font-extrabold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-7 h-7 bg-orange-100 text-brand-orange rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
                Your Account
              </h2>
              <p className="mb-3">You may browse and purchase from TrueMart as a guest or by creating an account. If you create an account:</p>
              <ul className="space-y-2 mb-3">
                {[
                  "You are responsible for maintaining the confidentiality of your login credentials",
                  "You must notify us immediately if you suspect unauthorised access to your account at contact@truemart.co.uk",
                  "You are responsible for all activity that occurs under your account",
                  "You must provide accurate, complete and up-to-date information",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-brand-orange flex-shrink-0 mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p>TrueMart reserves the right to suspend or terminate accounts that breach these Terms, are involved in fraudulent activity, or have been inactive for an extended period, with reasonable notice where possible.</p>
            </section>

            {/* 4. Placing an Order */}
            <section id="orders">
              <h2 className="text-xl font-extrabold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-7 h-7 bg-orange-100 text-brand-orange rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0">4</span>
                Placing an Order
              </h2>
              <p className="mb-3">When you place an order on TrueMart, the following process applies:</p>

              <div className="space-y-3 mb-4">
                {[
                  { step: "Order Submission", desc: "You submit an order by completing the checkout process and clicking 'Place Order'. This constitutes an offer to purchase." },
                  { step: "Order Confirmation", desc: "We will send you an automated email confirming receipt of your order. This confirmation does not constitute acceptance of your order." },
                  { step: "Order Acceptance", desc: "A contract between you and TrueMart is formed when we send you a dispatch confirmation email confirming that your order has been shipped." },
                  { step: "Order Refusal", desc: "We reserve the right to refuse or cancel any order — for example, if a product is out of stock, if there is a pricing error, or if we suspect fraud. If we cancel your order, you will receive a full refund." },
                ].map((item, i) => (
                  <div key={i} className="bg-white border border-gray-100 rounded-xl p-4">
                    <p className="font-bold text-gray-900 text-xs mb-1">{item.step}</p>
                    <p className="text-gray-500 text-xs">{item.desc}</p>
                  </div>
                ))}
              </div>

              <p>Products on our website are listed as invitations to treat, not offers. All orders are subject to availability and acceptance by TrueMart.</p>
            </section>

            {/* 5. Pricing & Payment */}
            <section id="pricing">
              <h2 className="text-xl font-extrabold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-7 h-7 bg-orange-100 text-brand-orange rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0">5</span>
                Pricing & Payment
              </h2>
              <ul className="space-y-2 mb-3">
                {[
                  "All prices on TrueMart are displayed in pounds sterling (£) and are inclusive of VAT where applicable.",
                  "Delivery costs are calculated at checkout based on the size and weight of your order. Some products include delivery in the listed price — this will be clearly indicated on the product page.",
                  "Free delivery is available on orders over £25.",
                  "We accept Visa, Mastercard, American Express, Apple Pay, Google Pay and PayPal. All payments are processed securely via Stripe.",
                  "Payment is taken in full at the time of placing your order.",
                  "TrueMart does not store your payment card details. All card data is handled by Stripe, who are PCI-DSS Level 1 compliant.",
                  "In the event of a pricing error on our website, we are not obliged to honour the incorrect price and will contact you to offer the correct price or a full cancellation.",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-brand-orange flex-shrink-0 mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* 6. Delivery */}
            <section id="delivery">
              <h2 className="text-xl font-extrabold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-7 h-7 bg-orange-100 text-brand-orange rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0">6</span>
                Delivery
              </h2>
              <ul className="space-y-2 mb-3">
                {[
                  "We deliver to all UK addresses served by Royal Mail, including England, Scotland, Wales, Northern Ireland, the Scottish Highlands and Islands, and Channel Islands.",
                  "Orders are dispatched within 2 working days of placement.",
                  "Estimated delivery timeframes are provided at checkout. These are estimates, not guarantees.",
                  "Delivery may take longer during peak festival seasons such as Diwali and Raksha Bandhan.",
                  "Risk of loss and title for products passes to you upon delivery to the address you provided.",
                  "If a delivery is returned to us due to an incorrect address provided by you, you may be charged for redelivery.",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-brand-orange flex-shrink-0 mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p>For full delivery information, see our <Link href="/delivery" className="text-brand-orange hover:underline">Delivery Info page</Link>.</p>
            </section>

            {/* 7. Cancellation Rights */}
            <section id="cancellation">
              <h2 className="text-xl font-extrabold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-7 h-7 bg-orange-100 text-brand-orange rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0">7</span>
                Cancellation Rights
              </h2>
              <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 mb-4">
                <p className="font-bold text-gray-900 text-xs mb-1">Your Statutory Right to Cancel</p>
                <p className="text-gray-600 text-xs">Under the Consumer Contracts (Information, Cancellation and Additional Charges) Regulations 2013, you have the right to cancel most orders within <strong>14 calendar days</strong> of receiving your goods, without giving any reason.</p>
              </div>
              <ul className="space-y-2 mb-3">
                {[
                  "To cancel, contact us at contact@truemart.co.uk before or within 14 days of receiving your order, clearly stating your order number and your intention to cancel.",
                  "You must return the goods to us within 14 days of notifying us of your cancellation.",
                  "Goods must be returned unused, in their original packaging and in the same condition as received.",
                  "You are responsible for the cost of return postage unless the item is faulty or incorrect.",
                  "We will process your refund within 14 days of receiving the returned goods, using the same payment method used for the original purchase.",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-brand-orange flex-shrink-0 mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mb-3"><strong>Exceptions — the right to cancel does not apply to:</strong></p>
              <ul className="space-y-2">
                {[
                  "Perishable goods",
                  "Sealed goods which have been opened and are not suitable for return due to health protection or hygiene reasons (e.g. cosmetics, opened pooja items)",
                  "Goods that have been used, damaged, or are not in their original condition",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-brand-red flex-shrink-0 mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* 8. Returns & Refunds */}
            <section id="returns">
              <h2 className="text-xl font-extrabold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-7 h-7 bg-orange-100 text-brand-orange rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0">8</span>
                Returns & Refunds
              </h2>
              <p className="mb-3">Under the Consumer Rights Act 2015, goods must be of satisfactory quality, fit for purpose, and as described. If your order arrives faulty, damaged, or significantly different from its description:</p>
              <ul className="space-y-2 mb-3">
                {[
                  "Contact us within 48 hours of delivery at contact@truemart.co.uk with your order number and clear photographs of the issue.",
                  "We will arrange a free replacement or full refund at no cost to you, including return postage.",
                  "Refunds are processed within 5–7 business days of us receiving the returned item.",
                  "Refunds are issued to the original payment method used.",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-brand-orange flex-shrink-0 mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p>For our full Returns Policy, including eligibility criteria, see our <Link href="/return-policy" className="text-brand-orange hover:underline">Return Policy page</Link>.</p>
            </section>

            {/* 9. Products{/* 9. Products */}
            <section id="products">
              <h2 className="text-xl font-extrabold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-7 h-7 bg-orange-100 text-brand-orange rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0">9</span>
                Products & Descriptions
              </h2>
              <p className="mb-3">TrueMart primarily acts as a reseller of third-party products. We take care to ensure all product descriptions, images, and information are accurate, but:</p>
              <ul className="space-y-2 mb-3">
                {[
                  "Product images are for illustrative purposes. Colours, sizes and packaging may vary slightly from those shown.",
                  "We do not manufacture most products we sell. Product specifications are provided by the manufacturer or supplier.",
                  "We cannot guarantee that product descriptions are complete, accurate or current in all cases. If you notice an error, please contact us.",
                  "Stock availability is not guaranteed. If a product becomes unavailable after you place an order, we will notify you and offer a full refund.",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-brand-orange flex-shrink-0 mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* 10. Reviews */}
            <section id="reviews">
              <h2 className="text-xl font-extrabold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-7 h-7 bg-orange-100 text-brand-orange rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0">10</span>
                Reviews & User Content
              </h2>
              <p className="mb-3">TrueMart allows verified purchasers to submit product reviews and star ratings. By submitting a review, you agree that:</p>
              <ul className="space-y-2 mb-3">
                {[
                  "Your review is based on your genuine, first-hand experience of the product.",
                  "Your review does not contain false, misleading, offensive, defamatory, discriminatory or unlawful content.",
                  "You will not submit reviews in exchange for payment, discounts or any other incentive (unless clearly disclosed).",
                  "You grant TrueMart a non-exclusive, royalty-free, perpetual licence to display your review on our website and in our marketing materials.",
                  "TrueMart reserves the right to moderate, edit or remove reviews that breach these Terms or that we reasonably consider inappropriate.",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-brand-orange flex-shrink-0 mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p>Under the <strong>Digital Markets, Competition and Consumers Act 2024</strong>, we are prohibited from publishing or commissioning fake reviews. All reviews displayed on TrueMart are from verified purchasers only.</p>
            </section>

            {/* 11. Intellectual Property */}
            <section id="intellectual-property">
              <h2 className="text-xl font-extrabold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-7 h-7 bg-orange-100 text-brand-orange rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0">11</span>
                Intellectual Property
              </h2>
              <p className="mb-3">All content on TrueMart.co.uk — including but not limited to the TrueMart name, logo, website design, text, graphics, and product photography created by us — is the intellectual property of TrueMart and is protected by UK copyright and trade mark law.</p>
              <ul className="space-y-2">
                {[
                  "You may not reproduce, distribute, modify or create derivative works from any TrueMart content without our prior written consent.",
                  "Product images and descriptions provided by third-party suppliers remain the property of their respective owners.",
                  "Nothing in these Terms grants you any licence to use TrueMart's intellectual property except as strictly necessary to use our website for personal, non-commercial purposes.",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-brand-orange flex-shrink-0 mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* 12. Liability */}
            <section id="liability">
              <h2 className="text-xl font-extrabold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-7 h-7 bg-orange-100 text-brand-orange rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0">12</span>
                Liability
              </h2>

              <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 mb-4">
                <p className="text-xs text-gray-700"><strong>Nothing in these Terms limits or excludes our liability for death or personal injury caused by our negligence, fraud or fraudulent misrepresentation, or any liability that cannot be excluded by law under the Consumer Rights Act 2015.</strong></p>
              </div>

              <p className="mb-3">Subject to the above, to the fullest extent permitted by law:</p>
              <ul className="space-y-2 mb-3">
                {[
                  "TrueMart's total liability to you in connection with any order shall not exceed the total amount paid by you for that order.",
                  "We are not liable for any indirect, consequential, or pure economic loss arising from your use of our website or products.",
                  "We are not responsible for delays or failures caused by circumstances outside our control, including Royal Mail disruptions, extreme weather, or supplier issues (force majeure).",
                  "As a reseller, TrueMart is not the manufacturer of most products we sell. Product liability claims relating to manufacturer defects should be directed to the manufacturer, though we will assist you in pursuing these where possible.",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-brand-orange flex-shrink-0 mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p>Your statutory rights under the Consumer Rights Act 2015 are not affected by these limitations.</p>
            </section>

            {/* 13. Governing Law */}
            <section id="governing-law">
              <h2 className="text-xl font-extrabold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-7 h-7 bg-orange-100 text-brand-orange rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0">13</span>
                Governing Law & Disputes
              </h2>
              <p className="mb-3">
                These Terms are governed by the laws of <strong>England and Wales</strong>. Any disputes arising from these Terms or your use of TrueMart shall be subject to the exclusive jurisdiction of the courts of England and Wales, except where you are a consumer resident in Scotland or Northern Ireland, in which case you may bring proceedings in your local courts.
              </p>
              <p className="mb-3">
                We are committed to resolving disputes fairly and promptly. If you have a complaint, please contact us first at <a href="mailto:contact@truemart.co.uk" className="text-brand-orange hover:underline">contact@truemart.co.uk</a>. We will acknowledge your complaint within 3 working days and aim to resolve it within 14 days.
              </p>
              <p>
                If we are unable to resolve a dispute, you may also refer it to an Alternative Dispute Resolution (ADR) scheme or the Online Dispute Resolution (ODR) platform provided by the European Commission, accessible at <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-brand-orange hover:underline">ec.europa.eu/consumers/odr</a>.
              </p>
            </section>

            {/* 14. Changes */}
            <section id="changes">
              <h2 className="text-xl font-extrabold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-7 h-7 bg-orange-100 text-brand-orange rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0">14</span>
                Changes to These Terms
              </h2>
              <p>
                We may update these Terms from time to time to reflect changes in our services, business practices or legal obligations. We will update the "Last updated" date at the top of this page. For material changes that affect your rights, we will notify registered account holders by email with reasonable notice. Your continued use of our website after changes take effect constitutes your acceptance of the revised Terms.
              </p>
            </section>

            {/* 15. Contact */}
            <section id="contact">
              <h2 className="text-xl font-extrabold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-7 h-7 bg-orange-100 text-brand-orange rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0">15</span>
                Contact Us
              </h2>
              <p className="mb-4">If you have any questions about these Terms, please contact us:</p>
              <div className="bg-white border border-gray-100 rounded-xl p-5 space-y-2 mb-6">
                <p><strong>TrueMart</strong></p>
                <p>Email: <a href="mailto:contact@truemart.co.uk" className="text-brand-orange hover:underline">contact@truemart.co.uk</a></p>
                <p>Phone: <a href="tel:+447442020454" className="text-brand-orange hover:underline">+44 7442020454</a></p>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/privacy" className="inline-flex items-center gap-2 bg-brand-orange text-white px-5 py-2.5 rounded-full text-xs font-bold hover:bg-orange-500 transition-colors">
                  Privacy Policy →
                </Link>
                <Link href="/return-policy" className="inline-flex items-center gap-2 border border-gray-200 text-gray-600 px-5 py-2.5 rounded-full text-xs font-bold hover:border-brand-orange hover:text-brand-orange transition-colors">
                  Return Policy →
                </Link>
                <Link href="/cookie-policy" className="inline-flex items-center gap-2 border border-gray-200 text-gray-600 px-5 py-2.5 rounded-full text-xs font-bold hover:border-brand-orange hover:text-brand-orange transition-colors">
                  Cookie Policy →
                </Link>
              </div>
            </section>

          </div>
        </div>
      </div>
    </main>
  );
}
