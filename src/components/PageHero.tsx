// src/components/PageHero.tsx
// ============================================================
// Reusable hero section used across all pages.
// To change background/pattern: edit src/lib/theme.ts once.
// ============================================================

import { THEME, PATTERNS } from "@/lib/theme";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function PageHero({ children, className = "" }: Props) {
  const patternFn = PATTERNS[THEME.hero.pattern];
  const backgroundImage = patternFn(THEME.hero.patternColor);

  return (
    <section
      className={`relative overflow-hidden border-b border-orange-100 ${className}`}
      style={{ backgroundColor: THEME.hero.backgroundColor }}
    >
      {/* Pattern overlay */}
      {THEME.hero.pattern !== "none" && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage,
            backgroundSize: "80px 80px",
          }}
        />
      )}

      {/* Soft glow accents */}
      <div
        className="absolute -top-20 -right-20 w-96 h-96 rounded-full blur-3xl"
        style={{ backgroundColor: "#FB923C", opacity: THEME.hero.glowOpacity }}
      />
      <div
        className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full blur-3xl"
        style={{ backgroundColor: "#C41E3A", opacity: THEME.hero.glowOpacity }}
      />

      {/* Content */}
      <div className="relative w-full">
        {children}
      </div>
    </section>
  );
}
