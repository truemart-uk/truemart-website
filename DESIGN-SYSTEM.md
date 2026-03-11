# TrueMart Design System

## How to change the entire site's look

All design tokens live in **one place only:**
- `src/app/globals.css` — CSS variables (source of truth)
- `tailwind.config.ts` — Tailwind aliases that reference those variables

---

## Changing colours

Open `src/app/globals.css` and edit the `:root` block:

```css
:root {
  --color-primary:   #FB923C;  /* ← Change this to update ALL orange across the site */
  --color-secondary: #C41E3A;  /* ← Change this to update ALL red */
  --color-accent:    #2D7A3A;  /* ← Change this to update ALL green */
}
```

That's it. Save the file. Every page updates instantly.

---

## Changing fonts

In `globals.css`:
```css
:root {
  --font-body: 'Poppins', sans-serif;  /* ← All body text */
  --font-logo: 'Yatra One', cursive;   /* ← TRUEMART logo text */
}
```

Also update the Google Fonts import in `layout.tsx` to load the new font.

---

## Writing new pages — use these classes

Instead of hardcoded Tailwind values like `bg-[#FB923C]`, use:

| What you want | Class to use | Instead of |
|---|---|---|
| Orange button | `btn-primary` | `bg-[#FB923C] text-white rounded-full px-6 py-3 font-bold` |
| Outlined button | `btn-outline` | `border-2 border-[#FB923C] text-[#FB923C] rounded-full...` |
| White button | `btn-white` | `bg-white text-[#FB923C] rounded-full...` |
| Card | `card` | `bg-white border border-gray-100 rounded-2xl p-6` |
| Hoverable card | `card-hover` | same + hover styles |
| Orange badge | `badge-primary` | `bg-[#FB923C] text-white text-xs rounded-full px-2` |
| Section label chip | `section-chip` | `bg-white border border-orange-200 rounded-full px-4 py-1.5 text-xs` |
| Hero background | `hero-bg` | `bg-gradient-to-br from-[#FFF7ED] to-[#FFF0E8] border-b border-orange-100` |
| Orange-red gradient | `cta-gradient` | `bg-gradient-to-r from-[#FB923C] to-[#C41E3A]` |
| Green gradient | `cta-green` | `bg-gradient-to-r from-[#2D7A3A] to-[#3a9e4a]` |
| Page wrapper (wide) | `page-container` | `max-w-4xl mx-auto px-6` |
| Page wrapper (narrow) | `page-container-sm` | `max-w-3xl mx-auto px-6` |

You can also use Tailwind tokens directly:
```jsx
<div className="bg-primary text-white">        // orange background
<div className="text-secondary">               // red text
<div className="border-brand-border-orange">   // orange border
<div className="bg-brand-bg">                  // page background
```

---

## Current design values (for reference)

| Token | Value | Usage |
|---|---|---|
| Primary | `#FB923C` | Buttons, highlights, accents |
| Secondary | `#C41E3A` | Gradients, sale badges |
| Accent | `#2D7A3A` | Free delivery, success states |
| Background | `#FAFAF8` | All page backgrounds |
| Warm background | `#FDF8F3` | Footer |
| Font (body) | Poppins | Everything except logo |
| Font (logo) | Yatra One | TRUEMART navbar text |
