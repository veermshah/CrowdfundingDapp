import type { ReactNode } from "react";

type PillProps = {
  children: ReactNode;
  tone?: "brand" | "accent" | "neutral";
};

export function Pill({ children, tone = "neutral" }: PillProps) {
  const toneClass =
    tone === "brand"
      ? "border-cyan-300/50 bg-cyan-300/15 text-cyan-100"
      : tone === "accent"
        ? "border-amber-300/40 bg-amber-300/15 text-amber-100"
        : "border-white/20 bg-white/10 text-slate-200";

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] ${toneClass}`}
    >
      {children}
    </span>
  );
}