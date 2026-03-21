"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

// ── TYPES ─────────────────────────────────────────────────────────────────────

const CATEGORIES = ["Books", "Pooja Essentials", "Cosmetics", "Festivals", "Panchmasi Rakhi", "Other"];

type VendorProfile = {
  id?: string;
  business_name: string;
  business_type: string;
  registration_number: string;
  business_address_line1: string;
  business_address_line2: string;
  business_city: string;
  business_postcode: string;
  business_phone: string;
  business_website: string;
  categories: string[];
  tab1_completed: boolean;
  doc_registration_url: string;
  doc_id_url: string;
  agreed_terms: boolean;
  agreed_returns: boolean;
  agreed_commission: boolean;
  signatory_name: string;
  submitted_at: string | null;
  tab2_completed: boolean;
  status: string;
  rejection_reason: string | null;
  created_at?: string;
};

const EMPTY_PROFILE: VendorProfile = {
  business_name: "", business_type: "", registration_number: "",
  business_address_line1: "", business_address_line2: "",
  business_city: "", business_postcode: "", business_phone: "",
  business_website: "", categories: [], tab1_completed: false,
  doc_registration_url: "", doc_id_url: "",
  agreed_terms: false, agreed_returns: false, agreed_commission: false,
  signatory_name: "", submitted_at: null, tab2_completed: false,
  status: "draft", rejection_reason: null,
};

// ── REUSABLE UI ───────────────────────────────────────────────────────────────

const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange bg-white disabled:bg-gray-50 disabled:text-gray-400";

function Field({ label, required, hint, error, children }: {
  label: string; required?: boolean; hint?: string; error?: string; children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

function Toggle({ on, label, note, onClick, disabled }: {
  on: boolean; label: string; note?: string; onClick: () => void; disabled?: boolean;
}) {
  return (
    <div className={`flex items-start gap-3 ${disabled ? "opacity-50" : "cursor-pointer"}`} onClick={!disabled ? onClick : undefined}>
      <div className={`w-11 h-6 rounded-full transition relative flex-shrink-0 mt-0.5 ${on ? "bg-brand-orange" : "bg-gray-200"}`}>
        <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${on ? "left-5" : "left-0.5"}`} />
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-700">{label}</p>
        {note && <p className="text-xs text-gray-400 mt-0.5">{note}</p>}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const c = {
    draft:    { label: "Draft",          cls: "bg-gray-100 text-gray-600"   },
    pending:  { label: "Pending Review", cls: "bg-amber-100 text-amber-700" },
    approved: { label: "Approved",       cls: "bg-green-100 text-green-700" },
    rejected: { label: "Rejected",       cls: "bg-red-100 text-red-700"     },
  }[status] ?? { label: status, cls: "bg-gray-100 text-gray-600" };
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${c.cls}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />{c.label}
    </span>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────

export default function VendorOnboardingPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const supabaseRef = useRef(createClient());

  const [activeTab, setActiveTab] = useState(0);
  const [profile, setProfile] = useState<VendorProfile>(EMPTY_PROFILE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saveMsg, setSaveMsg] = useState("");

  // Tab 1 auth state
  const [authMode, setAuthMode] = useState<"signin" | "register">("register");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading2, setAuthLoading2] = useState(false);
  const [registered, setRegistered] = useState(false);

  const emailVerified = !!user?.email_confirmed_at;
  const isSubmitted = profile.status === "pending" || profile.status === "approved" || profile.status === "rejected";

  // Load vendor profile when user is available
  useEffect(() => {
    if (!user) { setLoading(false); return; }
    supabaseRef.current
      .from("vendor_profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setProfile(data as VendorProfile);
        setLoading(false);
        // Auto-advance tab if already has progress
        if (data?.tab2_completed) setActiveTab(3);
        else if (data?.tab1_completed) setActiveTab(2);
        else if (user) setActiveTab(1);
      });
  }, [user]);

  // Poll for email verification
  useEffect(() => {
    if (!user || emailVerified) return;
    const interval = setInterval(async () => {
      const { data: { user: refreshed } } = await supabaseRef.current.auth.getUser();
      if (refreshed?.email_confirmed_at) {
        clearInterval(interval);
        // Force re-render
        window.location.reload();
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [user, emailVerified]);

  function setField(field: keyof VendorProfile, value: unknown) {
    setProfile(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: "" }));
  }

  function toggleCategory(cat: string) {
    setProfile(prev => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter(c => c !== cat)
        : [...prev.categories, cat],
    }));
  }

  const saveProfile = useCallback(async (extra?: Partial<VendorProfile>) => {
    if (!user) return;
    setSaving(true);
    const data = { ...profile, ...extra, user_id: user.id, updated_at: new Date().toISOString() };
    const { error } = await supabaseRef.current
      .from("vendor_profiles")
      .upsert(data, { onConflict: "user_id" });
    if (!error) {
      const { data: fresh } = await supabaseRef.current
        .from("vendor_profiles").select("*").eq("user_id", user.id).maybeSingle();
      if (fresh) setProfile(fresh as VendorProfile);
      setSaveMsg("Saved ✓");
      setTimeout(() => setSaveMsg(""), 2500);
    }
    setSaving(false);
  }, [user, profile]);

  // ── AUTH HANDLERS ──────────────────────────────────────────────────────────

  async function handleRegister() {
    setAuthError(""); setAuthLoading2(true);
    const { error } = await supabaseRef.current.auth.signUp({
      email, password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback?redirect=/vendor/onboarding`,
      },
    });
    setAuthLoading2(false);
    if (error) { setAuthError(error.message); return; }
    setRegistered(true);
  }

  async function handleSignIn() {
    setAuthError(""); setAuthLoading2(true);
    const { error } = await supabaseRef.current.auth.signInWithPassword({ email, password });
    setAuthLoading2(false);
    if (error) { setAuthError(error.message); return; }
    setActiveTab(1);
  }

  // ── DOCUMENT UPLOAD ────────────────────────────────────────────────────────

  async function uploadDocument(file: File, field: "doc_registration_url" | "doc_id_url") {
    if (!user) return;
    setUploading(field);
    const ext = file.name.split(".").pop();
    const path = `vendor-docs/${user.id}/${field}.${ext}`;
    const { error } = await supabaseRef.current.storage
      .from("vendor-documents")
      .upload(path, file, { upsert: true });
    if (!error) {
      const { data } = supabaseRef.current.storage.from("vendor-documents").getPublicUrl(path);
      setField(field, data.publicUrl);
    }
    setUploading(null);
  }

  // ── VALIDATION ─────────────────────────────────────────────────────────────

  function validateTab1() {
    const e: Record<string, string> = {};
    if (!profile.business_name.trim()) e.business_name = "Required";
    if (!profile.business_type) e.business_type = "Required";
    if (!profile.registration_number.trim()) e.registration_number = "Required";
    if (!profile.business_address_line1.trim()) e.business_address_line1 = "Required";
    if (!profile.business_city.trim()) e.business_city = "Required";
    if (!profile.business_postcode.trim()) e.business_postcode = "Required";
    if (!profile.business_phone.trim()) e.business_phone = "Required";
    if (profile.categories.length === 0) e.categories = "Select at least one category";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function validateTab2() {
    const e: Record<string, string> = {};
    if (!profile.doc_registration_url) e.doc_registration = "Required";
    if (!profile.doc_id_url) e.doc_id = "Required";
    if (!profile.agreed_terms) e.agreed_terms = "Required";
    if (!profile.agreed_returns) e.agreed_returns = "Required";
    if (!profile.agreed_commission) e.agreed_commission = "Required";
    if (!profile.signatory_name.trim()) e.signatory_name = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSaveTab1() {
    if (!validateTab1()) return;
    await saveProfile({ tab1_completed: true });
    setActiveTab(2);
  }

  async function handleSubmit() {
    if (!validateTab2()) return;
    await saveProfile({
      tab2_completed: true,
      status: "pending",
      submitted_at: new Date().toISOString(),
    });
    setActiveTab(3);
  }

  // ── TAB CONFIG ─────────────────────────────────────────────────────────────

  const tabs = [
    { label: "Create Account", icon: "👤",
      enabled: true,
      done: !!user },
    { label: "Business Details", icon: "🏢",
      enabled: !!user && emailVerified,
      done: profile.tab1_completed },
    { label: "Docs & Agreement", icon: "📋",
      enabled: !!user && emailVerified && profile.tab1_completed,
      done: profile.tab2_completed },
    { label: "Status", icon: "📊",
      enabled: true,
      done: false },
  ];

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <svg className="animate-spin w-8 h-8 text-brand-orange" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen py-10 px-6">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-extrabold text-gray-900">Vendor Application</h1>
          <p className="text-sm text-gray-500 mt-1">Complete all steps to start selling on TrueMart</p>
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-1.5 mb-8">
          {tabs.map((tab, i) => (
            <button key={i}
              onClick={() => tab.enabled && setActiveTab(i)}
              disabled={!tab.enabled}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                activeTab === i
                  ? "bg-brand-orange text-white shadow-sm"
                  : tab.enabled
                    ? "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                    : "text-gray-300 cursor-not-allowed"
              }`}>
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
              {tab.done && <span className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />}
              {!tab.enabled && i !== 3 && (
                <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
              )}
            </button>
          ))}
        </div>

        {/* ── TAB 0: Create Account ──────────────────────────────────────── */}
        {activeTab === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 max-w-md mx-auto">

            {/* Already logged in */}
            {user ? (
              <div className="text-center">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <p className="font-bold text-gray-900 mb-1">Signed in as</p>
                <p className="text-brand-orange font-semibold mb-4">{user.email}</p>
                {!emailVerified ? (
                  <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-amber-700">
                    <p className="font-semibold mb-1">📧 Please verify your email</p>
                    <p>Check your inbox for a verification link. Tab 2 will unlock once verified.</p>
                    <p className="text-xs mt-2 text-amber-500">Checking automatically every few seconds...</p>
                  </div>
                ) : (
                  <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-sm text-green-700">
                    <p className="font-semibold">✅ Email verified</p>
                    <p className="mt-1">You can now continue with Business Details.</p>
                  </div>
                )}
                <button onClick={() => setActiveTab(1)}
                  disabled={!emailVerified}
                  className="mt-5 w-full bg-brand-orange hover:bg-orange-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl text-sm transition">
                  Continue to Business Details →
                </button>
              </div>
            ) : registered ? (
              /* Email verification pending */
              <div className="text-center">
                <div className="text-5xl mb-4">📧</div>
                <h2 className="font-bold text-gray-900 text-lg mb-2">Check Your Email</h2>
                <p className="text-sm text-gray-500 mb-2">We've sent a verification link to:</p>
                <p className="font-semibold text-brand-orange mb-4">{email}</p>
                <p className="text-xs text-gray-400">Click the link in the email to verify your account. Then come back here — Tab 2 will unlock automatically.</p>
                <button onClick={() => setRegistered(false)}
                  className="mt-5 text-xs text-brand-orange hover:underline">
                  Use a different email
                </button>
              </div>
            ) : (
              /* Auth form */
              <>
                {/* Toggle */}
                <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
                  <button onClick={() => setAuthMode("register")}
                    className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${authMode === "register" ? "bg-white shadow-sm text-gray-900" : "text-gray-500"}`}>
                    New to TrueMart
                  </button>
                  <button onClick={() => setAuthMode("signin")}
                    className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${authMode === "signin" ? "bg-white shadow-sm text-gray-900" : "text-gray-500"}`}>
                    Already have account
                  </button>
                </div>

                {authError && (
                  <div className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">{authError}</div>
                )}

                <div className="space-y-4">
                  {authMode === "register" && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
                      <input type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                        placeholder="Your full name" className={inputCls} />
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="you@example.com" className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••" className={inputCls} />
                  </div>
                  <button
                    onClick={authMode === "register" ? handleRegister : handleSignIn}
                    disabled={authLoading2 || !email || !password}
                    className="w-full bg-brand-orange hover:bg-orange-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl text-sm transition">
                    {authLoading2 ? "Please wait..." : authMode === "register" ? "Create Account →" : "Sign In →"}
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* ── TAB 1: Business Details ──────────────────────────────────────── */}
        {activeTab === 1 && (
          !emailVerified ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center max-w-md mx-auto">
              <div className="text-4xl mb-4">🔒</div>
              <h2 className="font-bold text-gray-900 mb-2">Email Verification Required</h2>
              <p className="text-sm text-gray-500 mb-4">Please verify your email address to unlock this section.</p>
              <button onClick={() => setActiveTab(0)} className="text-sm text-brand-orange font-semibold hover:underline">
                Back to Account tab →
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
                <h2 className="font-bold text-gray-900">Business Information</h2>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Business Name" required error={errors.business_name}>
                    <input type="text" value={profile.business_name}
                      onChange={e => setField("business_name", e.target.value)}
                      placeholder="Your business name" className={inputCls} />
                  </Field>
                  <Field label="Business Type" required error={errors.business_type}>
                    <select value={profile.business_type} onChange={e => setField("business_type", e.target.value)} className={inputCls}>
                      <option value="">Select...</option>
                      <option value="sole_trader">Sole Trader</option>
                      <option value="limited_company">Private Limited (Ltd)</option>
                    </select>
                  </Field>
                </div>
                <Field label={profile.business_type === "limited_company" ? "Companies House Number" : "UTR Number"} required
                  error={errors.registration_number}
                  hint={profile.business_type === "limited_company" ? "8-digit number from Companies House" : "10-digit Unique Taxpayer Reference"}>
                  <input type="text" value={profile.registration_number}
                    onChange={e => setField("registration_number", e.target.value)}
                    placeholder={profile.business_type === "limited_company" ? "e.g. 12345678" : "e.g. 1234567890"} className={inputCls} />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Business Phone" required error={errors.business_phone}>
                    <input type="tel" value={profile.business_phone}
                      onChange={e => setField("business_phone", e.target.value)}
                      placeholder="+44 7700 000000" className={inputCls} />
                  </Field>
                  <Field label="Website" hint="Optional">
                    <input type="url" value={profile.business_website}
                      onChange={e => setField("business_website", e.target.value)}
                      placeholder="https://yoursite.co.uk" className={inputCls} />
                  </Field>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
                <h2 className="font-bold text-gray-900">Business Address</h2>
                <Field label="Address Line 1" required error={errors.business_address_line1}>
                  <input type="text" value={profile.business_address_line1}
                    onChange={e => setField("business_address_line1", e.target.value)}
                    placeholder="Street address" className={inputCls} />
                </Field>
                <Field label="Address Line 2">
                  <input type="text" value={profile.business_address_line2}
                    onChange={e => setField("business_address_line2", e.target.value)}
                    placeholder="Optional" className={inputCls} />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="City" required error={errors.business_city}>
                    <input type="text" value={profile.business_city}
                      onChange={e => setField("business_city", e.target.value)}
                      placeholder="Bristol" className={inputCls} />
                  </Field>
                  <Field label="Postcode" required error={errors.business_postcode}>
                    <input type="text" value={profile.business_postcode}
                      onChange={e => setField("business_postcode", e.target.value)}
                      placeholder="BS1 1AA" className={inputCls} />
                  </Field>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="font-bold text-gray-900 mb-1">Product Categories</h2>
                <p className="text-xs text-gray-400 mb-4">Select all categories you plan to sell in</p>
                {errors.categories && <p className="text-xs text-red-500 mb-3">{errors.categories}</p>}
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(cat => (
                    <button key={cat} type="button" onClick={() => toggleCategory(cat)}
                      className={`px-4 py-2 rounded-xl border-2 text-sm font-semibold transition ${
                        profile.categories.includes(cat)
                          ? "border-brand-orange bg-orange-50 text-brand-orange"
                          : "border-gray-200 text-gray-600 hover:border-brand-orange hover:text-brand-orange"
                      }`}>
                      {profile.categories.includes(cat) && "✓ "}{cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button onClick={handleSaveTab1} disabled={saving}
                  className="flex-1 bg-brand-orange hover:bg-orange-500 disabled:opacity-60 text-white font-bold py-3.5 rounded-2xl text-sm transition">
                  {saving ? "Saving..." : "Save & Continue →"}
                </button>
                {saveMsg && <span className="text-sm text-green-600 font-medium">{saveMsg}</span>}
              </div>
            </div>
          )
        )}

        {/* ── TAB 2: Documents & Agreement ─────────────────────────────────── */}
        {activeTab === 2 && (
          <div className="space-y-5">
            {isSubmitted && (
              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 text-sm text-amber-700 font-medium flex items-center gap-2">
                <span>⏳</span> Application submitted — this section is read-only.
              </div>
            )}

            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
              <h2 className="font-bold text-gray-900">Upload Documents</h2>

              {[
                { field: "doc_registration_url" as const, label: "Proof of Business Registration", hint: "Companies House certificate, UTR letter, or HMRC registration", errKey: "doc_registration" },
                { field: "doc_id_url" as const, label: "Proof of Identity", hint: "Passport, driving licence, or national ID", errKey: "doc_id" },
              ].map(doc => (
                <Field key={doc.field} label={doc.label} required hint={doc.hint} error={errors[doc.errKey]}>
                  <div className="flex items-center gap-3">
                    <label className={`flex-1 flex items-center gap-2 border-2 border-dashed rounded-xl px-4 py-3 text-sm transition ${
                      profile[doc.field] ? "border-green-300 bg-green-50" : "border-gray-200 hover:border-brand-orange"
                    } ${isSubmitted ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}>
                      <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" disabled={isSubmitted}
                        onChange={e => e.target.files?.[0] && uploadDocument(e.target.files[0], doc.field)} />
                      {uploading === doc.field ? "Uploading..."
                        : profile[doc.field] ? <span className="text-green-600 font-semibold">✓ Document uploaded</span>
                        : <span className="text-gray-400">Click to upload (PDF, JPG, PNG — max 10MB)</span>}
                    </label>
                    {profile[doc.field] && (
                      <a href={profile[doc.field]} target="_blank" rel="noreferrer"
                        className="text-xs text-brand-orange hover:underline flex-shrink-0">View</a>
                    )}
                  </div>
                </Field>
              ))}
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
              <h2 className="font-bold text-gray-900 mb-1">Agreements</h2>
              <p className="text-xs text-gray-400">You must agree to all policies before submitting</p>

              {[
                { field: "agreed_terms" as const, label: "I agree to TrueMart's Vendor Terms & Conditions", note: "Including product quality standards and platform rules" },
                { field: "agreed_returns" as const, label: "I agree to TrueMart's Returns & Delivery Policy", note: "30-day returns, dispatch within 2 working days, tracked shipping" },
                { field: "agreed_commission" as const, label: "I agree to the 10% commission structure", note: "No monthly fee. Bi-weekly payouts to UK bank account." },
              ].map(a => (
                <div key={a.field}>
                  <Toggle on={profile[a.field]} label={a.label} note={a.note} disabled={isSubmitted}
                    onClick={() => !isSubmitted && setField(a.field, !profile[a.field])} />
                  {errors[a.field] && <p className="text-xs text-red-500 mt-1 ml-14">{errors[a.field]}</p>}
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-bold text-gray-900 mb-3">Declaration</h2>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                By entering your full name, you confirm all information is accurate and you have read and agreed to all TrueMart vendor policies.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Full Name (as signature)" required error={errors.signatory_name}>
                  <input type="text" value={profile.signatory_name}
                    onChange={e => !isSubmitted && setField("signatory_name", e.target.value)}
                    disabled={isSubmitted} placeholder="Your full legal name" className={inputCls} />
                </Field>
                <Field label="Date">
                  <input type="text" readOnly className={`${inputCls} cursor-not-allowed`}
                    value={new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })} />
                </Field>
              </div>
            </div>

            {!isSubmitted && (
              <button onClick={handleSubmit} disabled={saving}
                className="w-full bg-brand-orange hover:bg-orange-500 disabled:opacity-60 text-white font-bold py-4 rounded-2xl text-base transition">
                {saving ? "Submitting..." : "Submit Application for Review →"}
              </button>
            )}
          </div>
        )}

        {/* ── TAB 3: Status ─────────────────────────────────────────────────── */}
        {activeTab === 3 && (
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-gray-900">Application Status</h2>
                <StatusBadge status={profile.status} />
              </div>

              <div className="space-y-5">
                {[
                  { icon: "👤", label: "Account Created", done: !!user, note: user?.email ?? "—" },
                  { icon: "✉️", label: "Email Verified", done: emailVerified, note: emailVerified ? "Verified" : "Check your inbox" },
                  { icon: "🏢", label: "Business Details Completed", done: profile.tab1_completed, note: profile.tab1_completed ? "Done" : "Go to Tab 2" },
                  { icon: "📄", label: "Documents & Agreement Submitted", done: profile.tab2_completed, note: profile.submitted_at ? new Date(profile.submitted_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "Not yet submitted" },
                  {
                    icon: profile.status === "approved" ? "✅" : profile.status === "rejected" ? "❌" : "🔍",
                    label: "TrueMart Review Decision",
                    done: profile.status === "approved",
                    rejected: profile.status === "rejected",
                    active: profile.status === "pending",
                    note: profile.status === "approved" ? "Approved — start listing products!"
                      : profile.status === "rejected" ? `Rejected: ${profile.rejection_reason ?? "Contact us for details"}`
                      : profile.status === "pending" ? "Under review — 1–3 business days"
                      : "Awaiting submission",
                  },
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold ${
                      step.done ? "bg-green-100 text-green-600"
                      : (step as {rejected?:boolean}).rejected ? "bg-red-100 text-red-600"
                      : (step as {active?:boolean}).active ? "bg-amber-100 text-amber-600"
                      : "bg-gray-100 text-gray-400"
                    }`}>
                      {step.done ? "✓" : (step as {rejected?:boolean}).rejected ? "✗" : step.icon}
                    </div>
                    <div className="flex-1 pt-1.5">
                      <p className={`text-sm font-semibold ${step.done || (step as {active?:boolean}).active ? "text-gray-900" : "text-gray-400"}`}>{step.label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{step.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {profile.status === "approved" && (
              <div className="bg-green-50 border border-green-100 rounded-2xl p-6 text-center">
                <div className="text-4xl mb-3">🎉</div>
                <h3 className="font-bold text-green-800 text-lg mb-2">You're Approved!</h3>
                <p className="text-sm text-green-700 mb-4">Your vendor account is active. Start listing your products now.</p>
                <button onClick={() => router.push("/admin?tab=products")}
                  className="bg-brand-orange hover:bg-orange-500 text-white font-bold px-6 py-3 rounded-xl text-sm transition">
                  Go to Product Dashboard →
                </button>
              </div>
            )}

            {profile.status === "rejected" && (
              <div className="bg-red-50 border border-red-100 rounded-2xl p-6">
                <h3 className="font-bold text-red-800 mb-2">Application Unsuccessful</h3>
                {profile.rejection_reason && <p className="text-sm text-red-700 mb-3">Reason: {profile.rejection_reason}</p>}
                <p className="text-sm text-red-600 mb-4">Please address the issues and resubmit, or email <a href="mailto:vendors@truemart.co.uk" className="underline">vendors@truemart.co.uk</a></p>
                <button onClick={async () => {
                  await saveProfile({ status: "draft", submitted_at: null, tab2_completed: false });
                  setActiveTab(1);
                }} className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition">
                  Edit & Resubmit
                </button>
              </div>
            )}

            {profile.status === "pending" && (
              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">⏳</span>
                <div>
                  <p className="font-semibold text-amber-800">Application Under Review</p>
                  <p className="text-sm text-amber-700 mt-1">Our team will review within 1–3 business days. You'll receive an email at <strong>{user?.email}</strong> with the outcome.</p>
                </div>
              </div>
            )}

            {profile.status === "draft" && (
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">📝</span>
                <div>
                  <p className="font-semibold text-gray-800">Application Not Yet Submitted</p>
                  <p className="text-sm text-gray-600 mt-1">Complete all tabs to submit your application.</p>
                  <button onClick={() => setActiveTab(!user ? 0 : !emailVerified ? 0 : !profile.tab1_completed ? 1 : 2)}
                    className="mt-2 text-sm text-brand-orange font-semibold hover:underline">
                    Continue Application →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
