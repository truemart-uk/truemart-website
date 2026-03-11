import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy | TrueMart",
  description: " TrueMart",
};

import Link from "next/link";

const sections = [
  { id: "what-are-cookies", title: "1. What Are Cookies?" },
  { id: "how-we-use", title: "2. How We Use Cookies" },
  { id: "types", title: "3. Types of Cookies We Use" },
  { id: "third-party", title: "4. Third-Party Cookies" },
  { id: "your-choices", title: "5. Your Choices & Consent" },
  { id: "manage-browsers", title: "6. Managing Cookies by Browser" },
  { id: "do-not-track", title: "7. Do Not Track" },
  { id: "changes", title: "8. Changes to This Policy" },
  { id: "contact", title: "9. Contact Us" },
];

export default function CookiePolicyPage() {
  return (
    <main className="min-h-screen bg-background">

      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-50 to-orange-100 border-b border-orange-100">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <div className="inline-flex items-center gap-2 bg-white border border-orange-200 rounded-full px-4 py-1.5 mb-6 shadow-sm">
            <span className="text-sm">🍪</span>
            <span className="text-xs font-semibold text-gray-600 tracking-wide">Legal</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Cookie <span className="text-brand-orange">Policy</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto mb-6">
            What cookies we use, why we use them, and how you can control them.
          </p>
          <div className="inline-flex items-center gap-2 bg-white border border-orange-100 rounded-full px-4 py-2 text-xs text-gray-500">
            <span className="w-2 h-2 bg-brand-green rounded-full inline-block"></span>
            Last updated: 13 July 2025 &nbsp;·&nbsp; Compliant with UK GDPR, PECR & ICO Guidance
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

              {/* Quick consent summary */}
              <div className="mt-6 pt-5 border-t border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Cookie Summary</p>
                <div className="space-y-2">
                  {[
                    { type: "Essential", always: true },
                    { type: "Analytics", always: false },
                    { type: "Functional", always: false },
                    { type: "Marketing", always: false },
                  ].map(item => (
                    <div key={item.type} className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">{item.type}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${item.always ? "bg-green-50 text-brand-green" : "bg-orange-50 text-brand-orange"}`}>
                        {item.always ? "Always on" : "Optional"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-12 text-sm text-gray-600 leading-relaxed">

            {/* Intro */}
            <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6">
              <p className="text-gray-700">
                This Cookie Policy explains how <strong>TrueMart</strong> (trading as <strong>TrueMart.co.uk</strong>) uses cookies and similar technologies when you visit our website. It should be read alongside our <Link href="/privacy" className="text-brand-orange hover:underline">Privacy Policy</Link>.
              </p>
              <p className="mt-3 text-gray-700">
                We comply with the <strong>UK General Data Protection Regulation (UK GDPR)</strong>, the <strong>Data Protection Act 2018</strong>, and the <strong>Privacy and Electronic Communications Regulations 2003 (PECR)</strong> — the key UK law that specifically governs the use of cookies.
              </p>
            </div>

            {/* 1. What Are Cookies */}
            <section id="what-are-cookies">
              <h2 className="text-xl font-extrabold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-7 h-7 bg-orange-100 text-brand-orange rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                What Are Cookies?
              </h2>
              <p className="mb-3">
                Cookies are small text files that are placed on your device (computer, smartphone, or tablet) when you visit a website. They are widely used to make websites work efficiently and to provide information to website owners.
              </p>
              <p className="mb-3">
                Cookies can be <strong>first-party</strong> (set by TrueMart directly) or <strong>third-party</strong> (set by external services we use, such as analytics or payment providers).
              </p>
              <p>
                Cookies can also be <strong>session cookies</strong> (deleted when you close your browser) or <strong>persistent cookies</strong> (which remain on your device for a set period or until you delete them).
              </p>
            </section>

            {/* 2. How We Use Cookies */}
            <section id="how-we-use">
              <h2 className="text-xl font-extrabold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-7 h-7 bg-orange-100 text-brand-orange rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                How We Use Cookies
              </h2>
              <p className="mb-3">We use cookies to:</p>
              <ul className="space-y-2 mb-3">
                {[
                  "Keep your shopping cart active while you browse",
                  "Remember that you are logged into your account",
                  "Remember your preferences and settings",
                  "Understand how visitors use our website so we can improve it",
                  "Measure the effectiveness of our marketing (where you have consented)",
                  "Ensure our website is secure and functions correctly",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-brand-orange flex-shrink-0 mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p>
                Under PECR, we are required to obtain your <strong>prior informed consent</strong> before placing any non-essential cookies on your device. We do this via our cookie consent banner when you first visit our site.
              </p>
            </section>

            {/* 3. Types of Cookies */}
            <section id="types">
              <h2 className="text-xl font-extrabold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-7 h-7 bg-orange-100 text-brand-orange rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
                Types of Cookies We Use
              </h2>

              <div className="space-y-4">

                {/* Strictly Necessary */}
                <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
                    <div>
                      <h3 className="font-extrabold text-gray-900">Strictly Necessary Cookies</h3>
                      <p className="text-xs text-gray-400 mt-0.5">Cannot be disabled — required for the site to work</p>
                    </div>
                    <span className="bg-green-50 text-brand-green text-xs font-bold px-3 py-1 rounded-full">Always On</span>
                  </div>
                  <div className="p-5">
                    <p className="mb-4">These cookies are essential for you to browse our website and use its features. Without these cookies, services you have asked for — such as your shopping cart and secure login — cannot be provided. Under PECR, these do not require your consent.</p>
                    <div className="overflow-x-auto rounded-xl border border-gray-100">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="bg-gray-50 text-gray-600">
                            <th className="text-left p-3 font-bold">Cookie Name</th>
                            <th className="text-left p-3 font-bold">Purpose</th>
                            <th className="text-left p-3 font-bold">Duration</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {[
                            ["session_id", "Maintains your login session", "Session"],
                            ["cart_token", "Stores your shopping cart contents", "30 days"],
                            ["csrf_token", "Protects against cross-site request forgery attacks", "Session"],
                            ["cookie_consent", "Stores your cookie preferences", "12 months"],
                          ].map(([name, purpose, duration], i) => (
                            <tr key={i} className="bg-white">
                              <td className="p-3 font-mono text-gray-700">{name}</td>
                              <td className="p-3 text-gray-500">{purpose}</td>
                              <td className="p-3 text-gray-500">{duration}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Analytics */}
                <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
                    <div>
                      <h3 className="font-extrabold text-gray-900">Analytics & Performance Cookies</h3>
                      <p className="text-xs text-gray-400 mt-0.5">Only used with your consent</p>
                    </div>
                    <span className="bg-orange-50 text-brand-orange text-xs font-bold px-3 py-1 rounded-full">Consent Required</span>
                  </div>
                  <div className="p-5">
                    <p className="mb-4">These cookies collect anonymous information about how visitors use our website — such as which pages are most visited and whether visitors get error messages. This helps us improve how our website works. All data is aggregated and anonymous.</p>
                    <div className="overflow-x-auto rounded-xl border border-gray-100">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="bg-gray-50 text-gray-600">
                            <th className="text-left p-3 font-bold">Cookie Name</th>
                            <th className="text-left p-3 font-bold">Provider</th>
                            <th className="text-left p-3 font-bold">Purpose</th>
                            <th className="text-left p-3 font-bold">Duration</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {[
                            ["_ga", "Google Analytics", "Distinguishes unique users", "2 years"],
                            ["_ga_*", "Google Analytics", "Stores session state", "2 years"],
                            ["_gid", "Google Analytics", "Distinguishes users (session)", "24 hours"],
                          ].map(([name, provider, purpose, duration], i) => (
                            <tr key={i} className="bg-white">
                              <td className="p-3 font-mono text-gray-700">{name}</td>
                              <td className="p-3 text-gray-500">{provider}</td>
                              <td className="p-3 text-gray-500">{purpose}</td>
                              <td className="p-3 text-gray-500">{duration}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Functional */}
                <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
                    <div>
                      <h3 className="font-extrabold text-gray-900">Functional Cookies</h3>
                      <p className="text-xs text-gray-400 mt-0.5">Only used with your consent</p>
                    </div>
                    <span className="bg-orange-50 text-brand-orange text-xs font-bold px-3 py-1 rounded-full">Consent Required</span>
                  </div>
                  <div className="p-5">
                    <p className="mb-4">These cookies allow our website to remember choices you have made (such as your region or language preference) and provide enhanced, more personalised features. They may be set by us or by third-party providers whose services we have added to our pages.</p>
                    <div className="overflow-x-auto rounded-xl border border-gray-100">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="bg-gray-50 text-gray-600">
                            <th className="text-left p-3 font-bold">Cookie Name</th>
                            <th className="text-left p-3 font-bold">Purpose</th>
                            <th className="text-left p-3 font-bold">Duration</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {[
                            ["user_preferences", "Stores your display preferences (e.g. currency, language)", "12 months"],
                            ["recently_viewed", "Remembers recently viewed products", "30 days"],
                          ].map(([name, purpose, duration], i) => (
                            <tr key={i} className="bg-white">
                              <td className="p-3 font-mono text-gray-700">{name}</td>
                              <td className="p-3 text-gray-500">{purpose}</td>
                              <td className="p-3 text-gray-500">{duration}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Marketing */}
                <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
                    <div>
                      <h3 className="font-extrabold text-gray-900">Marketing & Targeting Cookies</h3>
                      <p className="text-xs text-gray-400 mt-0.5">Only used with your consent</p>
                    </div>
                    <span className="bg-orange-50 text-brand-orange text-xs font-bold px-3 py-1 rounded-full">Consent Required</span>
                  </div>
                  <div className="p-5">
                    <p className="mb-4">These cookies are used to deliver advertisements more relevant to you and your interests. We do not currently run paid retargeting campaigns but may do so in the future. We will update this policy and re-request consent before implementing any marketing cookies.</p>
                    <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
                      <p className="text-xs text-gray-600">
                        <strong>Currently:</strong> No marketing or retargeting cookies are in use on TrueMart.co.uk. This section will be updated if and when we introduce them.
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </section>

            {/* 4. Third-Party Cookies */}
            <section id="third-party">
              <h2 className="text-xl font-extrabold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-7 h-7 bg-orange-100 text-brand-orange rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0">4</span>
                Third-Party Cookies
              </h2>
              <p className="mb-4">Some cookies on our website are set by third-party services. We do not control these cookies — they are governed by the privacy policies of the respective third parties:</p>

              <div className="space-y-3">
                {[
                  {
                    name: "Stripe",
                    purpose: "Payment processing. Stripe may set cookies to detect fraud and maintain session integrity during checkout.",
                    link: "https://stripe.com/gb/privacy",
                    linkLabel: "Stripe Privacy Policy",
                  },
                  {
                    name: "Google Analytics",
                    purpose: "Website analytics (only if you consent). Used to understand how visitors interact with our site.",
                    link: "https://policies.google.com/privacy",
                    linkLabel: "Google Privacy Policy",
                  },
                ].map((item, i) => (
                  <div key={i} className="bg-white border border-gray-100 rounded-xl p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-bold text-gray-900 mb-1">{item.name}</p>
                        <p className="text-gray-500 text-xs">{item.purpose}</p>
                      </div>
                      <a href={item.link} target="_blank" rel="noopener noreferrer"
                        className="text-brand-orange text-xs font-semibold hover:underline whitespace-nowrap flex-shrink-0">
                        {item.linkLabel} →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 5. Your Choices */}
            <section id="your-choices">
              <h2 className="text-xl font-extrabold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-7 h-7 bg-orange-100 text-brand-orange rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0">5</span>
                Your Choices & Consent
              </h2>
              <p className="mb-4">Under UK PECR and UK GDPR, you have the right to choose which non-essential cookies you accept. You can manage your preferences in the following ways:</p>

              <div className="space-y-3 mb-4">
                {[
                  {
                    icon: "🍪",
                    title: "Cookie Banner",
                    desc: "When you first visit TrueMart.co.uk, you will be shown a cookie consent banner. You can accept all cookies, reject non-essential cookies, or customise your preferences. You can change your choices at any time.",
                  },
                  {
                    icon: "⚙️",
                    title: "Cookie Settings",
                    desc: "You can revisit your cookie preferences at any time by clicking the 'Cookie Settings' link in the footer of our website.",
                  },
                  {
                    icon: "🌐",
                    title: "Browser Settings",
                    desc: "You can also control cookies through your browser settings. See Section 6 below for instructions for popular browsers.",
                  },
                ].map((item, i) => (
                  <div key={i} className="bg-white border border-gray-100 rounded-xl p-5 flex gap-4">
                    <span className="text-2xl flex-shrink-0">{item.icon}</span>
                    <div>
                      <p className="font-bold text-gray-900 mb-1">{item.title}</p>
                      <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
                <p className="text-xs text-gray-700">
                  <strong>Important:</strong> Withdrawing or refusing consent for non-essential cookies will not affect your ability to shop on TrueMart. However, disabling strictly necessary cookies may prevent the website from functioning correctly.
                </p>
              </div>
            </section>

            {/* 6. Managing by Browser */}
            <section id="manage-browsers">
              <h2 className="text-xl font-extrabold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-7 h-7 bg-orange-100 text-brand-orange rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0">6</span>
                Managing Cookies by Browser
              </h2>
              <p className="mb-4">You can manage, block or delete cookies through your browser settings. Here are direct links to cookie management instructions for the most popular browsers:</p>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { browser: "Google Chrome", link: "https://support.google.com/chrome/answer/95647" },
                  { browser: "Mozilla Firefox", link: "https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences" },
                  { browser: "Safari (Mac)", link: "https://support.apple.com/en-gb/guide/safari/sfri11471/mac" },
                  { browser: "Safari (iPhone/iPad)", link: "https://support.apple.com/en-gb/HT201265" },
                  { browser: "Microsoft Edge", link: "https://support.microsoft.com/en-us/windows/manage-cookies-in-microsoft-edge-168dab11-0753-043d-7c16-ede5947fc64d" },
                  { browser: "Opera", link: "https://help.opera.com/en/latest/web-preferences/#cookies" },
                ].map((item, i) => (
                  <a key={i} href={item.link} target="_blank" rel="noopener noreferrer"
                    className="bg-white border border-gray-100 rounded-xl p-4 flex items-center justify-between hover:border-brand-orange hover:text-brand-orange transition-colors group">
                    <span className="text-xs font-semibold text-gray-700 group-hover:text-brand-orange">{item.browser}</span>
                    <svg className="w-3.5 h-3.5 text-gray-400 group-hover:text-brand-orange" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                ))}
              </div>

              <p className="mt-4 text-xs text-gray-500">
                For information about cookies on other browsers, visit <a href="https://www.aboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-brand-orange hover:underline">aboutcookies.org</a> or the ICO's guide at <a href="https://ico.org.uk/your-data-matters/online/cookies/" target="_blank" rel="noopener noreferrer" className="text-brand-orange hover:underline">ico.org.uk</a>.
              </p>
            </section>

            {/* 7. Do Not Track */}
            <section id="do-not-track">
              <h2 className="text-xl font-extrabold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-7 h-7 bg-orange-100 text-brand-orange rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0">7</span>
                Do Not Track
              </h2>
              <p>
                Some browsers have a "Do Not Track" (DNT) feature that signals to websites that you do not want your online activity tracked. There is currently no universally agreed standard for how websites should respond to DNT signals. Our website does not currently respond differently to DNT signals, but you can use our cookie consent banner or browser settings to control tracking as described in Sections 5 and 6.
              </p>
            </section>

            {/* 8. Changes */}
            <section id="changes">
              <h2 className="text-xl font-extrabold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-7 h-7 bg-orange-100 text-brand-orange rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0">8</span>
                Changes to This Policy
              </h2>
              <p>
                We may update this Cookie Policy from time to time — for example, if we introduce new cookies or third-party services. We will update the "Last updated" date at the top of this page when changes are made. For significant changes that affect your consent choices, we will re-display the cookie consent banner so you can review and update your preferences.
              </p>
            </section>

            {/* 9. Contact */}
            <section id="contact">
              <h2 className="text-xl font-extrabold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-7 h-7 bg-orange-100 text-brand-orange rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0">9</span>
                Contact Us
              </h2>
              <p className="mb-4">If you have any questions about our use of cookies or this Cookie Policy, please contact us:</p>

              <div className="bg-white border border-gray-100 rounded-xl p-5 space-y-2 mb-6">
                <p><strong>TrueMart</strong></p>
                <p>Email: <a href="mailto:contact@truemart.co.uk" className="text-brand-orange hover:underline">contact@truemart.co.uk</a></p>
                <p>Phone: <a href="tel:+447442020454" className="text-brand-orange hover:underline">+44 7442020454</a></p>
              </div>

              <div className="bg-orange-50 border border-orange-100 rounded-xl p-5">
                <p className="font-bold text-gray-900 mb-2">ICO — UK Data Protection Authority</p>
                <p className="text-gray-600 text-xs leading-relaxed">
                  You also have the right to complain to the <strong>Information Commissioner's Office (ICO)</strong> if you believe we are using cookies unlawfully.
                </p>
                <p className="text-gray-600 text-xs mt-2">
                  ICO website: <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-brand-orange hover:underline">ico.org.uk</a><br />
                  ICO helpline: 0303 123 1113
                </p>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/privacy" className="inline-flex items-center gap-2 bg-brand-orange text-white px-5 py-2.5 rounded-full text-xs font-bold hover:bg-orange-500 transition-colors">
                  Privacy Policy →
                </Link>
                <Link href="/terms" className="inline-flex items-center gap-2 border border-gray-200 text-gray-600 px-5 py-2.5 rounded-full text-xs font-bold hover:border-brand-orange hover:text-brand-orange transition-colors">
                  Terms of Service →
                </Link>
              </div>
            </section>

          </div>
        </div>
      </div>
    </main>
  );
}
