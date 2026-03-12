// NAV HEIGHT = h-16 main row (64px) + h-10 category strip (40px) = 104px
// The announcement bar is NOT sticky so it scrolls away — we only offset for the nav

type CategoryHeroProps = {
  emoji: string;
  label: string;
  title: string;
  description: string;
  message?: string;
  messageStyle?: "orange" | "green" | "red" | "purple";
};

const MESSAGE_STYLES: Record<string, { background: string; color: string }> = {
  orange: { background: "#EA580C", color: "#ffffff" },
  green:  { background: "#059669", color: "#ffffff" },
  red:    { background: "#E11D48", color: "#ffffff" },
  purple: { background: "#7C3AED", color: "#ffffff" },
};

export default function CategoryHero({
  emoji,
  label,
  title,
  description,
  message,
  messageStyle = "orange",
}: CategoryHeroProps) {
  const msgStyle = MESSAGE_STYLES[messageStyle];

  return (
    <section
      className="bg-[#FFFAF5] border-b border-orange-100 overflow-hidden z-40 w-full"
      style={{
        position: "sticky",
        top: "104px",
        boxShadow: "0 4px 16px 0 rgba(251,146,60,0.08)",
      }}
    >
      {/* Decorative rings */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full border border-orange-200"
            style={{
              width: `${180 + i * 100}px`,
              height: `${180 + i * 100}px`,
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              opacity: 0.18 - i * 0.03,
            }}
          />
        ))}
        <div className="absolute -top-8 -left-8 w-36 h-36 rounded-full bg-orange-100 opacity-40 blur-2xl" />
        <div className="absolute -bottom-8 -right-8 w-36 h-36 rounded-full bg-red-100 opacity-30 blur-2xl" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 pt-4 pb-3 text-center">
        {message && (
          <div
            className="inline-flex items-center gap-2 text-xs font-bold px-4 py-1 rounded-full mb-2"
            style={{ background: msgStyle.background, color: msgStyle.color }}
          >
            {message}
          </div>
        )}
        <div className="flex justify-center mb-1.5">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
            {emoji} {label}
          </span>
        </div>
        <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 leading-tight mb-1">
          {title}
        </h1>
        <p className="text-gray-400 text-xs max-w-lg mx-auto leading-relaxed">
          {description}
        </p>
      </div>
    </section>
  );
}
