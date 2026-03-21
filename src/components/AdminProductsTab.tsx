"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";

// ── TYPES ─────────────────────────────────────────────────────────────────────

type Category = { id: string; name: string; slug: string };

type Variant = {
  id?: string;
  type: string;
  value: string;
  price: string;
  stock_qty: string;
  is_default: boolean;
  display_order: number;
};

type ProductForm = {
  name: string;
  slug: string;
  category_id: string;
  short_description: string;
  description: string;
  price: string;
  compare_at_price: string;
  badge: string;
  delivery_included: boolean;
  track_stock: boolean;
  stock_qty: string;
  low_stock_threshold: string;
  is_published: boolean;
  is_featured: boolean;
  tags: string;
  images: string[];
  has_variants: boolean;
  variants: Variant[];
};

type ExistingProduct = {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
  is_published: boolean;
  category_id: string;
  categories: { name: string };
};

const BADGES = ["", "Sale", "New", "Bestseller", "Popular", "Limited", "Back in Stock", "Gift Pick"];

const EMPTY_FORM: ProductForm = {
  name: "", slug: "", category_id: "", short_description: "", description: "",
  price: "", compare_at_price: "", badge: "", delivery_included: false,
  track_stock: true, stock_qty: "", low_stock_threshold: "5",
  is_published: false, is_featured: false, tags: "",
  images: [], has_variants: false,
  variants: [{ type: "Language", value: "", price: "", stock_qty: "", is_default: true, display_order: 0 }],
};

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

// ── SECTION WRAPPER ───────────────────────────────────────────────────────────

function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="flex items-center gap-2.5 px-6 py-4 border-b border-gray-50 bg-gray-50/50">
        <span className="text-lg">{icon}</span>
        <h3 className="font-bold text-gray-800 text-sm">{title}</h3>
      </div>
      <div className="p-6 space-y-4">{children}</div>
    </div>
  );
}

// ── FIELD ─────────────────────────────────────────────────────────────────────

function Field({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

const inputCls = "w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange bg-white";
const selectCls = inputCls;

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────

export default function AdminProductsTab() {
  const supabase = createClient();
  const { user, role } = useAuth();
  const isVendor = role === "vendor";
  const isAdmin  = role === "admin";

  // Prevent double-render in React Strict Mode
  const initialized = useRef(false);

  const [mode, setMode] = useState<"choose" | "add" | "edit">("choose");
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<ProductForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Edit mode state
  const [products, setProducts] = useState<ExistingProduct[]>([]);
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<ExistingProduct | null>(null);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [editProductId, setEditProductId] = useState<string | null>(null);

  // Load categories
  useEffect(() => {
    supabase.from("categories").select("id, name, slug").order("name")
      .then(({ data }) => setCategories(data ?? []));
  }, []);

  // Load products for edit mode — vendors see only their own products
  useEffect(() => {
    if (mode !== "edit" || !user) return;
    setLoadingProducts(true);
    let query = supabase.from("products")
      .select("id, name, slug, price, images, is_published, category_id, categories(name)")
      .order("name");

    // Vendors only see their own products
    if (isVendor) query = query.eq("vendor_id", user.id);

    query.then(({ data }) => {
      setProducts((data as unknown as ExistingProduct[]) ?? []);
      setLoadingProducts(false);
    });
  }, [mode, user]);

  const set = useCallback((field: keyof ProductForm, value: unknown) => {
    setForm(prev => {
      const next = { ...prev, [field]: value };
      // Auto-slug from name
      if (field === "name") next.slug = slugify(value as string);
      return next;
    });
    setErrors(prev => ({ ...prev, [field]: "" }));
  }, []);

  // Load product for editing
  async function loadProductForEdit(product: ExistingProduct) {
    setSelectedProduct(product);
    setEditProductId(product.id);

    const { data } = await supabase
      .from("products")
      .select("*, product_variants(*)")
      .eq("id", product.id)
      .single();

    if (!data) return;

    const variants = ((data as unknown as { product_variants: Variant[] }).product_variants ?? [])
      .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
      .map(v => ({
        id: (v as unknown as { id: string }).id,
        type: (v as unknown as { type: string }).type ?? "Language",
        value: (v as unknown as { value: string }).value ?? "",
        price: String((v as unknown as { price: number | null }).price ?? ""),
        stock_qty: String((v as unknown as { stock_qty: number }).stock_qty ?? ""),
        is_default: (v as unknown as { is_default: boolean }).is_default ?? false,
        display_order: (v as unknown as { display_order: number }).display_order ?? 0,
      }));

    setForm({
      name: data.name ?? "",
      slug: data.slug ?? "",
      category_id: data.category_id ?? "",
      short_description: data.short_description ?? "",
      description: data.description ?? "",
      price: String(data.price ?? ""),
      compare_at_price: String(data.compare_at_price ?? ""),
      badge: data.badge ?? "",
      delivery_included: data.delivery_included ?? false,
      track_stock: data.track_stock ?? true,
      stock_qty: String(data.stock_qty ?? ""),
      low_stock_threshold: String(data.low_stock_threshold ?? "5"),
      is_published: data.is_published ?? false,
      is_featured: data.is_featured ?? false,
      tags: (data.tags ?? []).join(", "),
      images: data.images ?? [],
      has_variants: variants.length > 0,
      variants: variants.length > 0 ? variants : EMPTY_FORM.variants,
    });
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Product name is required";
    if (!form.slug.trim()) e.slug = "Slug is required";
    if (!form.category_id) e.category_id = "Category is required";
    if (!form.price || isNaN(Number(form.price))) e.price = "Valid price is required";
    if (form.has_variants) {
      form.variants.forEach((v, i) => {
        if (!v.value.trim()) e[`variant_${i}`] = "Variant value required";
      });
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSave() {
    if (!validate()) return;
    setSaving(true);
    setSuccess("");

    const productData = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      category_id: form.category_id,
      short_description: form.short_description.trim() || null,
      description: form.description.trim() || null,
      price: Number(form.price),
      compare_at_price: form.compare_at_price ? Number(form.compare_at_price) : null,
      badge: form.badge || null,
      delivery_included: form.delivery_included,
      track_stock: form.track_stock,
      stock_qty: form.stock_qty ? Number(form.stock_qty) : 0,
      low_stock_threshold: Number(form.low_stock_threshold) || 5,
      // Vendors: always pending approval, never auto-published
      is_published: isVendor ? false : form.is_published,
      is_featured: isVendor ? false : form.is_featured,
      approval_status: isVendor ? "pending" : "approved",
      vendor_id: isVendor ? user?.id : null,
      tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
      images: form.images,
    };

    let productId = editProductId;

    if (editProductId) {
      // Update existing
      const { error } = await supabase.from("products").update(productData).eq("id", editProductId);
      if (error) { setErrors({ _: error.message }); setSaving(false); return; }

      // Delete old variants and re-insert
      if (form.has_variants) {
        await supabase.from("product_variants").delete().eq("product_id", editProductId);
      }
    } else {
      // Insert new
      const { data, error } = await supabase.from("products").insert(productData).select("id").single();
      if (error || !data) { setErrors({ _: error?.message ?? "Failed to save product" }); setSaving(false); return; }
      productId = data.id;
    }

    // Save variants
    if (form.has_variants && productId) {
      const variantRows = form.variants.map((v, i) => ({
        product_id: productId,
        type: v.type,
        value: v.value,
        price: v.price ? Number(v.price) : null,
        stock_qty: v.stock_qty ? Number(v.stock_qty) : 0,
        is_default: v.is_default,
        display_order: i,
      }));
      await supabase.from("product_variants").insert(variantRows);
    }

    setSaving(false);
    setSuccess(
      isVendor
        ? "Product submitted for TrueMart approval. It will go live once approved."
        : editProductId
          ? "Product updated successfully!"
          : "Product added successfully!"
    );
    if (!editProductId) setForm(EMPTY_FORM);
  }

  // Filtered products for edit search
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.slug.toLowerCase().includes(search.toLowerCase())
  );

  // ── RENDER: Mode chooser ──────────────────────────────────────────────────

  if (mode === "choose") {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Product Management</h2>
          <p className="text-gray-500 text-sm">Add a new product or update an existing one</p>
        </div>
        <div className="grid grid-cols-2 gap-5">
          <button onClick={() => { setForm(EMPTY_FORM); setEditProductId(null); setMode("add"); }}
            className="bg-white border-2 border-gray-100 hover:border-brand-orange rounded-2xl p-8 text-left transition group hover:shadow-lg">
            <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-brand-orange transition">
              <svg className="w-7 h-7 text-brand-orange group-hover:text-white transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
              </svg>
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-1">Add New Product</h3>
            <p className="text-sm text-gray-500">Create a brand new listing from scratch</p>
          </button>

          <button onClick={() => setMode("edit")}
            className="bg-white border-2 border-gray-100 hover:border-brand-orange rounded-2xl p-8 text-left transition group hover:shadow-lg">
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-blue-500 transition">
              <svg className="w-7 h-7 text-blue-500 group-hover:text-white transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-1">Edit Existing Product</h3>
            <p className="text-sm text-gray-500">Search and update an existing product</p>
          </button>
        </div>
      </div>
    );
  }

  // ── RENDER: Edit — product picker ─────────────────────────────────────────

  if (mode === "edit" && !selectedProduct) {
    return (
      <div className="max-w-3xl mx-auto py-6">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setMode("choose")} className="text-gray-400 hover:text-gray-600 transition">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <h2 className="text-xl font-bold text-gray-900">Select a product to edit</h2>
        </div>

        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or slug..."
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange mb-4" />

        {loadingProducts ? (
          <div className="text-center py-10 text-gray-400 text-sm">Loading products...</div>
        ) : (
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {filteredProducts.map(p => (
              <button key={p.id} onClick={() => loadProductForEdit(p)}
                className="w-full flex items-center gap-4 bg-white border border-gray-100 hover:border-brand-orange rounded-xl p-4 text-left transition group">
                <div className="w-12 h-12 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
                  {p.images?.[0] ? (
                    <img src={`https://res.cloudinary.com/truemart/image/upload/w_80,h_80,c_pad,b_white,f_auto/${p.images[0]}`}
                      alt="" className="w-full h-full object-contain" />
                  ) : <div className="w-full h-full flex items-center justify-center text-xl">📦</div>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm truncate group-hover:text-brand-orange transition">{p.name}</p>
                  <p className="text-xs text-gray-400">{p.categories?.name} · {p.slug}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${p.is_published ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-500"}`}>
                    {p.is_published ? "Published" : "Draft"}
                  </span>
                  <span className="text-sm font-bold text-gray-900">£{Number(p.price).toFixed(2)}</span>
                </div>
              </button>
            ))}
            {filteredProducts.length === 0 && (
              <div className="text-center py-10 text-gray-400 text-sm">No products found</div>
            )}
          </div>
        )}
      </div>
    );
  }

  // ── RENDER: Product form (Add or Edit) ────────────────────────────────────

  return (
    <div className="max-w-3xl mx-auto py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => { setMode(editProductId ? "edit" : "choose"); setSelectedProduct(null); setSuccess(""); }}
          className="text-gray-400 hover:text-gray-600 transition">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            {editProductId ? `Editing: ${selectedProduct?.name}` : "Add New Product"}
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {editProductId ? "Update the details below and save" : "Fill in the details to create a new product"}
          </p>
        </div>
      </div>

      {errors._ && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">{errors._}</div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-100 text-green-700 text-sm px-4 py-3 rounded-xl mb-4 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg>
          {success}
        </div>
      )}

      <div className="space-y-5">

        {/* Section 1: Basic Info */}
        <Section title="Basic Information" icon="📋">
          <Field label="Product Name" required error={errors.name}>
            <input type="text" value={form.name} onChange={e => set("name", e.target.value)}
              placeholder="e.g. Bhagavad Gita As It Is" className={inputCls} />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Slug (URL)" required hint={`truemart.co.uk/products/${form.slug || "..."}`}>
              <input type="text" value={form.slug} onChange={e => set("slug", e.target.value)}
                placeholder="bhagavad-gita-as-it-is" className={inputCls} />
              {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug}</p>}
            </Field>

            <Field label="Category" required>
              <select value={form.category_id} onChange={e => set("category_id", e.target.value)} className={selectCls}>
                <option value="">Select category...</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              {errors.category_id && <p className="text-red-500 text-xs mt-1">{errors.category_id}</p>}
            </Field>
          </div>

          <Field label="Short Description" hint="Shown in product cards (max 150 chars)">
            <input type="text" value={form.short_description} onChange={e => set("short_description", e.target.value.slice(0, 150))}
              placeholder="A brief one-line description" className={inputCls} />
            <p className="text-xs text-gray-400 text-right mt-1">{form.short_description.length}/150</p>
          </Field>

          <Field label="Full Description">
            <textarea value={form.description} onChange={e => set("description", e.target.value)}
              rows={4} placeholder="Detailed product description..." className={`${inputCls} resize-none`} />
          </Field>

          <Field label="Tags" hint="Comma separated: spiritual, hindi, devotional">
            <input type="text" value={form.tags} onChange={e => set("tags", e.target.value)}
              placeholder="spiritual, hindi, devotional" className={inputCls} />
          </Field>
        </Section>

        {/* Section 2: Pricing */}
        <Section title="Pricing & Display" icon="💷">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Price (£)" required>
              <input type="number" step="0.01" min="0" value={form.price} onChange={e => set("price", e.target.value)}
                placeholder="9.99" className={inputCls} />
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
            </Field>

            <Field label="Compare at Price (£)" hint="Original price for strikethrough">
              <input type="number" step="0.01" min="0" value={form.compare_at_price} onChange={e => set("compare_at_price", e.target.value)}
                placeholder="14.99 (optional)" className={inputCls} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Badge">
              <select value={form.badge} onChange={e => set("badge", e.target.value)} className={selectCls}>
                {BADGES.map(b => <option key={b} value={b}>{b || "No badge"}</option>)}
              </select>
            </Field>

            <Field label="Delivery">
              <label className="flex items-center gap-3 cursor-pointer mt-1">
                <div onClick={() => set("delivery_included", !form.delivery_included)}
                  className={`w-11 h-6 rounded-full transition relative cursor-pointer ${form.delivery_included ? "bg-brand-orange" : "bg-gray-200"}`}>
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${form.delivery_included ? "left-5" : "left-0.5"}`} />
                </div>
                <span className="text-sm text-gray-700">Delivery included</span>
              </label>
            </Field>
          </div>
        </Section>

        {/* Section 3: Inventory */}
        <Section title="Inventory" icon="📦">
          <label className="flex items-center gap-3 cursor-pointer">
            <div onClick={() => set("track_stock", !form.track_stock)}
              className={`w-11 h-6 rounded-full transition relative cursor-pointer ${form.track_stock ? "bg-brand-orange" : "bg-gray-200"}`}>
              <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${form.track_stock ? "left-5" : "left-0.5"}`} />
            </div>
            <span className="text-sm font-semibold text-gray-700">Track stock quantity</span>
          </label>

          {form.track_stock && (
            <div className="grid grid-cols-2 gap-4">
              <Field label="Stock Quantity">
                <input type="number" min="0" value={form.stock_qty} onChange={e => set("stock_qty", e.target.value)}
                  placeholder="0" className={inputCls} />
              </Field>
              <Field label="Low Stock Threshold" hint="Show warning when stock drops below this">
                <input type="number" min="0" value={form.low_stock_threshold} onChange={e => set("low_stock_threshold", e.target.value)}
                  placeholder="5" className={inputCls} />
              </Field>
            </div>
          )}
        </Section>

        {/* Section 4: Variants */}
        <Section title="Variants" icon="🔀">
          <label className="flex items-center gap-3 cursor-pointer">
            <div onClick={() => set("has_variants", !form.has_variants)}
              className={`w-11 h-6 rounded-full transition relative cursor-pointer ${form.has_variants ? "bg-brand-orange" : "bg-gray-200"}`}>
              <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${form.has_variants ? "left-5" : "left-0.5"}`} />
            </div>
            <span className="text-sm font-semibold text-gray-700">This product has variants (e.g. Language, Size)</span>
          </label>

          {form.has_variants && (
            <div className="space-y-3 mt-2">
              {/* Variant type */}
              <Field label="Variant Type" hint="e.g. Language, Size, Colour">
                <input type="text" value={form.variants[0]?.type ?? ""}
                  onChange={e => set("variants", form.variants.map(v => ({ ...v, type: e.target.value })))}
                  placeholder="Language" className={inputCls} />
              </Field>

              {/* Variant rows */}
              <div className="space-y-2">
                <div className="grid grid-cols-[1fr_100px_100px_auto] gap-2 text-xs font-semibold text-gray-400 px-1">
                  <span>Value</span><span>Price (£)</span><span>Stock</span><span>Default</span>
                </div>
                {form.variants.map((v, i) => (
                  <div key={i} className="grid grid-cols-[1fr_100px_100px_auto] gap-2 items-center">
                    <input type="text" value={v.value} onChange={e => {
                      const next = [...form.variants];
                      next[i] = { ...next[i], value: e.target.value };
                      set("variants", next);
                    }} placeholder="e.g. Hindi" className={inputCls} />
                    <input type="number" step="0.01" value={v.price} onChange={e => {
                      const next = [...form.variants];
                      next[i] = { ...next[i], price: e.target.value };
                      set("variants", next);
                    }} placeholder="same" className={inputCls} />
                    <input type="number" value={v.stock_qty} onChange={e => {
                      const next = [...form.variants];
                      next[i] = { ...next[i], stock_qty: e.target.value };
                      set("variants", next);
                    }} placeholder="0" className={inputCls} />
                    <div className="flex items-center gap-1">
                      <button type="button" onClick={() => {
                        const next = form.variants.map((vv, j) => ({ ...vv, is_default: j === i }));
                        set("variants", next);
                      }} className={`w-5 h-5 rounded-full border-2 transition flex-shrink-0 ${v.is_default ? "bg-brand-orange border-brand-orange" : "border-gray-300 hover:border-brand-orange"}`} />
                      {form.variants.length > 1 && (
                        <button type="button" onClick={() => set("variants", form.variants.filter((_, j) => j !== i))}
                          className="text-gray-300 hover:text-red-400 transition ml-1">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                          </svg>
                        </button>
                      )}
                    </div>
                    {errors[`variant_${i}`] && <p className="col-span-4 text-red-500 text-xs">{errors[`variant_${i}`]}</p>}
                  </div>
                ))}
              </div>

              <button type="button" onClick={() => set("variants", [
                ...form.variants,
                { type: form.variants[0]?.type ?? "Language", value: "", price: "", stock_qty: "", is_default: false, display_order: form.variants.length }
              ])} className="text-sm text-brand-orange font-semibold hover:underline">
                + Add another variant
              </button>
            </div>
          )}
        </Section>

        {/* Section 5: Images */}
        <Section title="Images" icon="🖼️">
          <Field label="Cloudinary Image Paths" hint="Add one path per line. e.g. truemart/books/bhagavad-gita-as-it-is/main.jpg">
            <textarea
              value={form.images.join("\n")}
              onChange={e => set("images", e.target.value.split("\n").map(s => s.trim()).filter(Boolean))}
              rows={4} placeholder={"truemart/books/my-product/main.jpg\ntruemart/books/my-product/back.jpg"}
              className={`${inputCls} resize-none font-mono text-xs`} />
          </Field>
          {form.images.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {form.images.map((img, i) => (
                <div key={i} className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
                  <img src={`https://res.cloudinary.com/truemart/image/upload/w_80,h_80,c_pad,b_white,f_auto/${img}`}
                    alt="" className="w-full h-full object-contain" />
                </div>
              ))}
            </div>
          )}
        </Section>

        {/* Section 6: Visibility — admin/staff only */}
        {!isVendor && (
          <Section title="Visibility & SEO" icon="🌐">
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <div onClick={() => set("is_published", !form.is_published)}
                  className={`w-11 h-6 rounded-full transition relative cursor-pointer ${form.is_published ? "bg-green-500" : "bg-gray-200"}`}>
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${form.is_published ? "left-5" : "left-0.5"}`} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">Published</p>
                  <p className="text-xs text-gray-400">Visible to customers</p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <div onClick={() => set("is_featured", !form.is_featured)}
                  className={`w-11 h-6 rounded-full transition relative cursor-pointer ${form.is_featured ? "bg-brand-orange" : "bg-gray-200"}`}>
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${form.is_featured ? "left-5" : "left-0.5"}`} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">Featured</p>
                  <p className="text-xs text-gray-400">Show on homepage</p>
                </div>
              </label>
            </div>
          </Section>
        )}

        {/* Vendor approval notice */}
        {isVendor && (
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-start gap-3">
            <span className="text-xl">⏳</span>
            <div>
              <p className="text-sm font-semibold text-amber-800">Pending TrueMart Approval</p>
              <p className="text-xs text-amber-600 mt-0.5">Your product will be reviewed by TrueMart before going live. This usually takes 1–2 business days.</p>
            </div>
          </div>
        )}

        {/* Save button */}
        <div className="flex items-center gap-3 pt-2 pb-8">
          <button onClick={handleSave} disabled={saving}
            className="flex-1 bg-brand-orange hover:bg-orange-500 disabled:opacity-60 text-white font-bold py-4 rounded-2xl text-base transition flex items-center justify-center gap-2">
            {saving ? (
              <><svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Saving...</>
            ) : (
              <>{editProductId ? "💾 Update Product" : "✅ Add Product"}</>
            )}
          </button>
          <button onClick={() => { setMode("choose"); setSelectedProduct(null); setSuccess(""); }}
            className="px-6 py-4 rounded-2xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
