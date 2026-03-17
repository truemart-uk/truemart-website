import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      typography: {
        orange: {
          css: {
            "--tw-prose-headings": "#111827",
            "--tw-prose-body": "#374151",
            "--tw-prose-links": "var(--color-brand-orange, #f97316)",
            "--tw-prose-bold": "#111827",
            "--tw-prose-hr": "#f3f4f6",
            "--tw-prose-bullets": "#9ca3af",
            "--tw-prose-counters": "#9ca3af",
            h1: { fontWeight: "800", fontSize: "2rem", lineHeight: "1.25", marginBottom: "1rem" },
            h2: { fontWeight: "700", fontSize: "1.5rem", lineHeight: "1.35", marginTop: "2rem", marginBottom: "0.75rem" },
            h3: { fontWeight: "700", fontSize: "1.2rem", lineHeight: "1.4", marginTop: "1.5rem", marginBottom: "0.5rem" },
            p:  { lineHeight: "1.8", marginTop: "0.75rem", marginBottom: "0.75rem" },
            li: { lineHeight: "1.75", marginTop: "0.25rem", marginBottom: "0.25rem" },
            hr: { marginTop: "2rem", marginBottom: "2rem" },
            table: { fontSize: "0.95rem" },
            "thead th": { fontWeight: "700", color: "#111827" },
          },
        },
      },
    },
  },
  plugins: [typography],
};

export default config;
