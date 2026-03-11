// src/lib/site.ts
// ============================================================
// SINGLE SOURCE OF TRUTH for all TrueMart site configuration.
// Change anything here and it updates across the entire site.
// ============================================================

export const SITE = {
  name: "TrueMart",
  tagline: "Bringing Traditions Closer To You",
  url: "https://www.truemart.co.uk",

  contact: {
    email: "contact@truemart.co.uk",
    phone: "+44 7587888937",
    phoneDisplay: "+44 7587888937",
    country: "United Kingdom",
  },

  delivery: {
    freeThreshold: 25,
    freeThresholdDisplay: "£25",
    processingDays: 2,
    standardService: "Royal Mail Tracked 48",
    expressService: "Royal Mail Tracked 24",
    standardDays: "2–3 working days",
    expressDays: "Next working day",
  },

  legal: {
    lastUpdated: "13 July 2025",
    companyName: "TrueMart",
    tradingAs: "TrueMart.co.uk",
    jurisdiction: "England and Wales",
  },

  social: {
    facebook: "#",
    instagram: "#",
    x: "#",
    whatsapp: "#",
  },

  copyright: {
    year: 2026,
    text: "TrueMart. All rights reserved. Bringing Traditions Closer To You.",
  },
} as const;
