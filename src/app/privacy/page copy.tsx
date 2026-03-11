import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | TrueMart",
  description: " TrueMart",
};

import Link from "next/link";

const sections = [
  { id: "who-we-are", title: "1. Who We Are" },
  { id: "data-we-collect", title: "2. Data We Collect" },
  { id: "lawful-basis", title: "3. Lawful Basis for Processing" },
  { id: "how-we-use", title: "4. How We Use Your Data" },
  { id: "sharing", title: "5. Sharing Your Data" },
  { id: "retention", title: "6. How Long We Keep Your Data" },
  { id: "cookies", title: "7. Cookies" },
  { id: "your-rights", title: "8. Your Rights" },
  { id: "international", title: "9. International Transfers" },
  { id: "security", title: "10. Security" },
  { id: "children", title: "11. Children's Privacy" },
  { id: "changes", title: "12. Changes to This Policy" },
  { id: "contact", title: "13. Contact & Complaints" },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background">

      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-50 to-orange-100 border-b border-orange-100">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <div className="inline-flex items-center gap-2 bg-white border border-orange-200 rounded-full px-4 py-1.5 mb-6 shadow-sm">
            <span className="text-sm">🔒</span>
            <span className="text-xs font-semibold text-gray-600 tracking-wide">Legal</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Privacy <span className="text-brand-orange">Policy</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto mb-6">
            How TrueMart collects, uses and protects your personal data — in plain English.
          </p>
          <div className="inline-flex items-center gap-2 bg-white border border-orange-100 rounded-full px-4 py-2 text-xs text-gray-500">
            <span className="w-2 h-2 bg-brand-green rounded-full inline-block"></span>
            Last updated: 13 July 2025 &nbsp;·&nbsp; Compliant with UK GDPR & Data Protection Act 2018
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
                This Privacy Policy explains how <strong>TrueMart</strong> (trading as <strong>TrueMart.co.uk</strong>) collects, uses, stores and shares your personal data. We are committed to protecting your privacy and complying with the <strong>UK General Data Protection Regulation (UK GDPR)</strong> and the <strong>Data Protection Act 2018</strong>.
              </p>
              <p className="mt-3 text-gray-700">
                Please read this policy carefully. By using our website or placing an order, you acknowledge you have read and understood this policy.
              </p>
            </div>

            {/* 1. Who We Are */}
            <section id="who-we-are">
              <h2 className="text-xl font-extrabold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-7 h-7 bg-orange-100 text-brand-orange rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                Who We Are
              </h2>
              <p>For the purposes of data protection law, the <strong>Data Controller</strong> is:</p>
              <div className="mt-4 bg-white border border-gray-100 rounded-xl p-5 space-y-1">
                <p><strong>TrueMart</strong></p>
                <p>Trading as TrueMart.co.uk</p>
                <p>United Kingdom</p>
                <p>Email: <a href="mailto:contact@truemart.co.uk" className="text-brand-orange hover:underline">contact@truemart.co.uk</a></p>
                <p>Phone: <a href="tel:+447442020454" className="text-brand-orange hover:underline">+44 7442020454</a></p>
              </div>
              <p className="mt-4">
                As Data Controller, we determine the purposes and means of processing your personal data. If you have any questions about how we handle your data, please contact us using the details above.
              </p>
            </section>

            {/* 2. Data We Collect */}
            <section id="data-we-collect">
              <h2 className="text-xl font-extrabold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-7 h-7 bg-orange-100 text-brand-orange rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                Data We Collect
              </h2>
              <p className="mb-4">We collect the following categories of personal data:</p>

              <div className="space-y-4">
                {[
                  {
                    title: "Identity & Contact Data",
                    items: ["Full name", "Email address", "Phone number", "Delivery and billing address"],
                  },
                  {
                    title: "Transaction Data",
                    items: ["Order details, products purchased, and order history", "Payment confirmation references (we do not store card numbers — payments are handled by Stripe)"],
                  },
                  {
                    title: "Account Data",
                    items: ["Username and encrypted password (if you create an account)", "Saved addresses and preferences"],
                  },
                  {
                    title: "Technical & Usage Data",
                    items: ["IP address and browser type", "Pages visited and time spent on site", "Referring URLs", "Device type and operating system"],
                  },
                  {
                    title: "Marketing & Communication Data",
                    items: ["Your preference to receive or not receive marketing communications", "Email open and click data (where consent is given)"],
                  },
                  {
                    title: "TruePrints Personalisation Data",
                    items: ["Custom text, names, or designs submitted for personalised print-on-demand products"],
                  },
                ].map((cat, i) => (
                  <div key={i} className="bg-white border border-gray-100 rounded-xl p-5">
                    <h3 className="font-bold text-gray-900 mb-2">{cat.title}</h3>
                    <ul className="space-y-1">
                      {cat.items.map((item, j) => (
                        <li key={j} className="flex items-start gap-2">
                          <span className="text-brand-orange flex-shrink-0 mt-0.5">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <p className="mt-4">We do <strong>not</strong> collect any special category data (such as racial or ethnic origin, health data, or biometric data).</p>
            </section>

            {/* 3. Lawful Basis */}
            <section id="lawful-basis">
              <h2 className="text-xl font-extrabold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-7 h-7 bg-orange-100 text-brand-orange rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
                Lawful Basis for Processing
              </h2>
              <p className="mb-4">Under UK GDPR Article 6, we must have a lawful basis for each type of processing. The table below sets out our lawful bases:</p>

              <div className="overflow-x-auto rounded-xl border border-gray-100">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-orange-50 text-gray-700">
                      <th className="text-left p-4 font-bold">Purpose</th>
                      <th className="text-left p-4 font-bold">Lawful Basis</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {[
                      ["Processing and fulfilling your order", "Contract (Article 6(1)(b)) — necessary to perform our contract with you"],
                      ["Creating and managing your account", "Contract (Article 6(1)(b))"],
                      ["Processing payment", "Contract (Article 6(1)(b))"],
                      ["Sending order confirmations and dispatch notifications", "Contract (Article 6(1)(b))"],
                      ["Responding to customer service enquiries", "Legitimate interests (Article 6(1)(f)) — to resolve queries effectively"],
                      ["Sending marketing emails and promotions", "Consent (Article 6(1)(a)) — only where you have opted in"],
                      ["Improving our website and user experience", "Legitimate interests (Article 6(1)(f)) — to develop and grow our business"],
                      ["Preventing fraud and ensuring security", "Legitimate interests (Article 6(1)(f))"],
                      ["Complying with legal obligations (e.g. tax records)", "Legal obligation (Article 6(1)(c))"],
                      ["Cookie analytics and tracking (non-essential)", "Consent (Article 6(1)(a))"],
                    ].map(([purpose, basis], i) => (
                      <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                        <td className="p-4 text-gray-700">{purpose}</td>
                        <td className="p-4 text-gray-500">{basis}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* 4. How We Use Your Data */}
            <section id="how-we-use">
              <h2 className="text-xl font-extrabold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-7 h-7 bg-orange-100 text-brand-orange rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0">4</span>
                How We Use Your Data
              </h2>
              <p className="mb-4">We use your personal data for the following purposes:</p>
              <ul className="space-y-2">
                {[
                  "To process, fulfil and deliver your orders",
                  "To send order confirmations, dispatch notifications and tracking updates",
                  "To manage your account and preferences",
                  "To respond to your enquiries and provide customer support",
                  "To send you marketing emails, promotions and festival updates — only where you have given your consent",
                  "To personalise your shopping experience",
                  "To detect and prevent fraud or abuse of our website",
                  "To comply with our legal and regulatory obligations",
                  "To improve our website, product range, and services",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-brand-orange flex-shrink-0 mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4">We will never use your data for any purpose incompatible with those stated above without first obtaining your consent.</p>
            </section>

            {/* 5. Sharing */}
            <section id="sharing">
              <h2 className="text-xl font-extrabold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-7 h-7 bg-orange-100 text-brand-orange rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0">5</span>
                Sharing Your Data
              </h2>
              <p className="mb-4">We do <strong>not</strong> sell, rent or trade your personal data. We share your data only where necessary, with the following categories of recipients:</p>

              <div className="space-y-3">
                {[
                  {
                    party: "Royal Mail",
                    purpose: "To deliver your order. We share your name and delivery address only.",
                    basis: "Contract",
                  },
                  {
                    party: "Stripe",
                    purpose: "To process your payment securely. Stripe is PCI-DSS compliant. We do not store your card details.",
                    basis: "Contract",
                  },
                  {
                    party: "Resend",
                    purpose: "To send transactional emails (order confirmations, dispatch notifications).",
                    basis: "Legitimate interests",
                  },
                  {
                    party: "Cloudinary",
                    purpose: "To store and serve product images, including TruePrints personalisation uploads.",
                    basis: "Legitimate interests",
                  },
                  {
                    party: "Supabase",
                    purpose: "Our database provider, hosted in the EU (London region). Stores your account and order data securely.",
                    basis: "Contract",
                  },
                  {
                    party: "Legal & regulatory authorities",
                    purpose: "Where required by law, court order, or to protect the rights and safety of TrueMart or others.",
                    basis: "Legal obligation",
                  },
                ].map((item, i) => (
                  <div key={i} className="bg-white border border-gray-100 rounded-xl p-4 flex gap-4">
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 text-xs mb-1">{item.party}</p>
                      <p className="text-gray-500 text-xs">{item.purpose}</p>
                    </div>
                    <span className="text-xs bg-orange-50 text-brand-orange font-semibold px-2 py-1 rounded-lg h-fit whitespace-nowrap">{item.basis}</span>
                  </div>
                ))}
              </div>

              <p className="mt-4">All third-party processors are bound by data processing agreements and are required to handle your data securely and only for the purposes we specify.</p>
            </section>

            {/* 6. Retention */}
            <section id="retention">
              <h2 className="text-xl font-extrabold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-7 h-7 bg-orange-100 text-brand-orange rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0">6</span>
                How Long We Keep Your Data
              </h2>
              <p className="mb-4">We retain personal data only for as long as necessary for the purpose it was collected, or as required by law:</p>

              <div className="overflow-x-auto rounded-xl border border-gray-100">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-orange-50 text-gray-700">
                      <th className="text-left p-4 font-bold">Data Type</th>
                      <th className="text-left p-4 font-bold">Retention Period</th>
                      <th className="text-left p-4 font-bold">Reason</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {[
                      ["Order & transaction records", "7 years", "HMRC tax and accounting obligations"],
                      ["Account data", "Until account deletion + 12 months", "To restore account if deletion is accidental"],
                      ["Customer service communications", "3 years", "To handle follow-up complaints or disputes"],
                      ["Marketing consent records", "Until consent is withdrawn + 12 months", "To evidence consent in case of complaint"],
                      ["Website analytics / cookies", "Up to 26 months", "Standard analytics retention period"],
                      ["TruePrints design data", "90 days after order completion", "To handle reprints or quality issues"],
                    ].map(([type, period, reason], i) => (
                      <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                        <td className="p-4 text-gray-700 font-medium">{type}</td>
                        <td className="p-4 text-brand-orange font-semibold">{period}</td>
                        <td className="p-4 text-gray-500">{reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="mt-4">After the applicable retention period, your data will be securely deleted or anonymised.</p>
            </section>

            {/* 7. Cookies */}
            <section id="cookies">
              <h2 className="text-xl font-extrabold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-7 h-7 bg-orange-100 text-brand-orange rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0">7</span>
                Cookies
              </h2>
              <p className="mb-4">We use cookies and similar tracking technologies on our website. Cookies are small text files stored on your device. We use the following categories:</p>

              <div className="space-y-3 mb-4">
                {[
                  {
                    type: "Strictly Necessary",
                    required: true,
                    desc: "Essential for the website to function. These include session cookies, cart data, and login state. These cannot be disabled.",
                  },
                  {
                    type: "Analytics & Performance",
                    required: false,
                    desc: "Help us understand how visitors use our site (pages visited, time on site, errors encountered). Used to improve performance.",
                  },
                  {
                    type: "Functional",
                    required: false,
                    desc: "Remember your preferences such as language and region to provide a more personalised experience.",
                  },
                  {
                    type: "Marketing",
                    required: false,
                    desc: "Used to track visits and build a profile of your interests to show relevant advertising. We do not currently run retargeting ads but may do so in future.",
                  },
                ].map((cookie, i) => (
                  <div key={i} className="bg-white border border-gray-100 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold text-gray-900 text-xs">{cookie.type}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${cookie.required ? "bg-green-50 text-brand-green" : "bg-orange-50 text-brand-orange"}`}>
                        {cookie.required ? "Always on" : "Consent required"}
                      </span>
                    </div>
                    <p className="text-gray-500 text-xs">{cookie.desc}</p>
                  </div>
                ))}
              </div>

              <p>You can manage your cookie preferences at any time via the cookie banner on our website, or through your browser settings. Please note that disabling certain cookies may affect website functionality.</p>
              <p className="mt-2">For full details, see our <Link href="/cookie-policy" className="text-brand-orange hover:underline">Cookie Policy</Link>.</p>
            </section>

            {/* 8. Your Rights */}
            <section id="your-rights">
              <h2 className="text-xl font-extrabold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-7 h-7 bg-orange-100 text-brand-orange rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0">8</span>
                Your Rights
              </h2>
              <p className="mb-4">Under UK GDPR, you have the following rights in relation to your personal data:</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                {[
                  { right: "Right of Access", desc: "Request a copy of all personal data we hold about you (Subject Access Request)." },
                  { right: "Right to Rectification", desc: "Ask us to correct inaccurate or incomplete data." },
                  { right: "Right to Erasure", desc: "Ask us to delete your data ('right to be forgotten') where there is no legitimate reason to continue holding it." },
                  { right: "Right to Restrict Processing", desc: "Ask us to pause processing your data in certain circumstances." },
                  { right: "Right to Data Portability", desc: "Receive your data in a structured, machine-readable format to transfer to another service." },
                  { right: "Right to Object", desc: "Object to processing based on legitimate interests or for direct marketing purposes." },
                  { right: "Right to Withdraw Consent", desc: "Where processing is based on consent, you can withdraw it at any time without affecting prior processing." },
                  { right: "Rights re: Automated Decisions", desc: "We do not make solely automated decisions that significantly affect you. All material decisions involve human review." },
                ].map((item, i) => (
                  <div key={i} className="bg-white border border-gray-100 rounded-xl p-4">
                    <p className="font-bold text-gray-900 text-xs mb-1">{item.right}</p>
                    <p className="text-gray-500 text-xs">{item.desc}</p>
                  </div>
                ))}
              </div>

              <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
                <p className="text-sm text-gray-700">To exercise any of these rights, contact us at <a href="mailto:contact@truemart.co.uk" className="text-brand-orange font-semibold hover:underline">contact@truemart.co.uk</a>. We will respond within <strong>one calendar month</strong> as required by UK GDPR. We may ask you to verify your identity before processing your request.</p>
              </div>
            </section>

            {/* 9. International Transfers */}
            <section id="international">
              <h2 className="text-xl font-extrabold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-7 h-7 bg-orange-100 text-brand-orange rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0">9</span>
                International Transfers
              </h2>
              <p className="mb-3">Some of our third-party service providers may process your data outside the UK. Where this occurs, we ensure appropriate safeguards are in place:</p>
              <ul className="space-y-2 mb-3">
                {[
                  "Transfers to countries with UK adequacy decisions (e.g. EU/EEA countries) are permitted without additional safeguards.",
                  "For transfers to other countries, we rely on International Data Transfer Agreements (IDTAs) or standard contractual clauses approved by the ICO.",
                  "Stripe and Cloudinary are certified under recognised frameworks and maintain appropriate data protection standards.",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-brand-orange flex-shrink-0 mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p>You can request details of the specific safeguards in place for any international transfer by contacting us.</p>
            </section>

            {/* 10. Security */}
            <section id="security">
              <h2 className="text-xl font-extrabold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-7 h-7 bg-orange-100 text-brand-orange rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0">10</span>
                Security
              </h2>
              <p className="mb-3">We implement appropriate technical and organisational measures to protect your personal data, including:</p>
              <ul className="space-y-2 mb-3">
                {[
                  "SSL/TLS encryption on all data transmitted between your browser and our servers",
                  "Encrypted storage of passwords using industry-standard hashing",
                  "Access controls restricting who can access personal data within our team",
                  "Payment processing via Stripe — we never see or store your full card details",
                  "Regular review of our security practices",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-brand-orange flex-shrink-0 mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p>In the event of a personal data breach that is likely to result in a risk to your rights and freedoms, we will notify the ICO within 72 hours and, where required, notify you directly without undue delay.</p>
            </section>

            {/* 11. Children */}
            <section id="children">
              <h2 className="text-xl font-extrabold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-7 h-7 bg-orange-100 text-brand-orange rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0">11</span>
                Children's Privacy
              </h2>
              <p>Our website and services are not directed at children under the age of 13. We do not knowingly collect personal data from children. If you believe we have inadvertently collected data from a child, please contact us immediately at <a href="mailto:contact@truemart.co.uk" className="text-brand-orange hover:underline">contact@truemart.co.uk</a> and we will delete it promptly.</p>
            </section>

            {/* 12. Changes */}
            <section id="changes">
              <h2 className="text-xl font-extrabold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-7 h-7 bg-orange-100 text-brand-orange rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0">12</span>
                Changes to This Policy
              </h2>
              <p>We may update this Privacy Policy from time to time to reflect changes in our practices, services, or legal requirements. When we make material changes, we will update the "Last updated" date at the top of this page and, where appropriate, notify you by email. We encourage you to review this policy periodically.</p>
            </section>

            {/* 13. Contact & Complaints */}
            <section id="contact">
              <h2 className="text-xl font-extrabold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-7 h-7 bg-orange-100 text-brand-orange rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0">13</span>
                Contact & Complaints
              </h2>
              <p className="mb-4">If you have any questions, concerns or requests regarding this Privacy Policy or how we handle your personal data, please contact us:</p>

              <div className="bg-white border border-gray-100 rounded-xl p-5 space-y-2 mb-6">
                <p><strong>TrueMart</strong></p>
                <p>Email: <a href="mailto:contact@truemart.co.uk" className="text-brand-orange hover:underline">contact@truemart.co.uk</a></p>
                <p>Phone: <a href="tel:+447442020454" className="text-brand-orange hover:underline">+44 7442020454</a></p>
              </div>

              <div className="bg-orange-50 border border-orange-100 rounded-xl p-5">
                <p className="font-bold text-gray-900 mb-2">Right to Complain to the ICO</p>
                <p className="text-gray-600 text-xs leading-relaxed">
                  You have the right to lodge a complaint with the <strong>Information Commissioner's Office (ICO)</strong> — the UK's independent data protection authority — if you believe we have not handled your personal data in accordance with the law.
                </p>
                <p className="text-gray-600 text-xs mt-2">
                  ICO website: <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-brand-orange hover:underline">ico.org.uk</a><br />
                  ICO helpline: 0303 123 1113
                </p>
                <p className="text-gray-500 text-xs mt-3 italic">We would, however, appreciate the opportunity to address your concerns before you approach the ICO, so please contact us in the first instance.</p>
              </div>
            </section>

          </div>
        </div>
      </div>
    </main>
  );
}
