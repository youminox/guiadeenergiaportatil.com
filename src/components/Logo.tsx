import { useId } from "react";

/** Logotipo de GuiaDeEnergiaPortatil.com: Estación Portátil + Rayo Solar LiFePO4 */
export function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <defs>
        <linearGradient id={`${id}bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0B1520" />
          <stop offset="0.55" stopColor="#0F172A" />
          <stop offset="1" stopColor="#0284C7" />
        </linearGradient>
        <linearGradient id={`${id}amber`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FEF08A" />
          <stop offset="1" stopColor="#F59E0B" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill={`url(#${id}bg)`} />
      <rect
        x="14"
        y="20"
        width="36"
        height="28"
        rx="6"
        fill="#1E293B"
        stroke={`url(#${id}amber)`}
        strokeWidth="2.5"
      />
      <path
        d="M22 20 v-4 a3 3 0 0 1 3 -3 h14 a3 3 0 0 1 3 3 v4"
        fill="none"
        stroke="#94A3B8"
        strokeWidth="2.8"
        strokeLinecap="round"
      />
      <polygon
        points="33,24 25,36 31,36 29,44 39,32 33,32"
        fill={`url(#${id}amber)`}
      />
      <circle cx="44" cy="42" r="3" fill="#10B981" />
    </svg>
  );
}

export default function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <span className="flex items-center gap-2.5 font-display text-base sm:text-lg font-extrabold tracking-tight">
      <LogoMark />
      <span>
        GuiaDe<span className={dark ? "text-fxlime" : "text-fxblue"}>EnergiaPortatil</span>
        <span
          className={`ml-1 hidden text-[10px] font-bold uppercase tracking-[0.16em] sm:inline ${
            dark ? "text-white/60" : "text-[var(--muted)]"
          }`}
        >
          .com
        </span>
      </span>
    </span>
  );
}
