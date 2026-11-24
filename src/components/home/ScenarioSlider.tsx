"use client";

import { useCallback, useRef, useState } from "react";

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

export default function ScenarioSlider() {
  const [v, setV] = useState(26);
  const [touched, setTouched] = useState(false);
  const scene = useRef<HTMLDivElement>(null);
  const t = v / 100;
  const mid = clamp(1 - Math.abs(t - 0.5) * 2.4);
  const blackout = clamp((t - 0.45) / 0.45);
  const fullBlackout = clamp((t - 0.55) / 0.4);

  const phase =
    t < 0.35
      ? "Escenario A · Camping, Viajes y Ruta Solar (300Wh–768Wh + Panel 100W)"
      : t < 0.68
      ? "Transición · De la Mochila Ligera al Respaldo Residencial"
      : "Escenario B · Corte de Luz en Casa y UPS <10ms (1024Wh–2048Wh)";

  const specReading =
    t < 0.45
      ? "3.7–7.8 kg · Solar 100W–220W · Nevera 12V"
      : "1500W–2400W · Carga AC 50 min · Nevera + Router + PC";

  const fromPointer = useCallback((clientX: number) => {
    const el = scene.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setV(Math.round(clamp((clientX - r.left) / r.width) * 100));
    setTouched(true);
  }, []);

  return (
    <div className="daynight bg-[#0B1520] shadow-[0_40px_80px_-40px_rgba(11,21,32,0.75)]">
      <div
        ref={scene}
        className="relative aspect-[4/5] cursor-ew-resize select-none sm:aspect-[16/9]"
        onPointerDown={(e) => {
          if (e.pointerType === "mouse") e.preventDefault();
          (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
          fromPointer(e.clientX);
        }}
        onPointerMove={(e) => {
          if (e.buttons === 1 || e.pointerType === "touch") {
            if (
              (e.currentTarget as HTMLElement).hasPointerCapture(e.pointerId)
            )
              fromPointer(e.clientX);
          }
        }}
      >
        <svg
          viewBox="0 0 800 450"
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 h-full w-full"
          aria-hidden
        >
          <defs>
            <linearGradient id="sc-day" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#ecfdf5" />
              <stop offset="1" stopColor="#f8fafc" />
            </linearGradient>
            <linearGradient id="sc-mid" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#0284c7" />
              <stop offset="0.55" stopColor="#d97706" />
              <stop offset="1" stopColor="#fef3c7" />
            </linearGradient>
            <linearGradient id="sc-night" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#0B1520" />
              <stop offset="0.7" stopColor="#1e293b" />
              <stop offset="1" stopColor="#0f172a" />
            </linearGradient>
          </defs>
          <rect width="800" height="450" fill="url(#sc-day)" />
          <rect width="800" height="450" fill="url(#sc-mid)" opacity={mid} />
          <rect
            width="800"
            height="450"
            fill="url(#sc-night)"
            opacity={blackout}
          />

          <rect
            x="0"
            y="365"
            width="800"
            height="85"
            fill={blackout > 0.5 ? "#09101a" : "#d1fae5"}
          />
        </svg>

        {/* Tarjeta comparativa HTML responsiva (sin desbordamiento de texto en ningún tamaño de pantalla) */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-3 pt-16 pb-12 sm:px-6 sm:pt-14 sm:pb-14">
          {blackout < 0.5 ? (
            <div className="w-full max-w-[540px] rounded-2xl border-[3px] border-emerald-500 bg-white/95 px-4 py-3.5 text-center shadow-xl backdrop-blur-sm sm:px-6 sm:py-5">
              <p className="font-display text-sm font-extrabold leading-snug text-emerald-900 sm:text-lg">
                ⛺ Camping y Ruta: Jackery 300 Plus / EcoFlow RIVER 2 Max
              </p>
              <ul className="mt-2.5 space-y-1.5 text-xs leading-snug sm:mt-3 sm:text-[0.84rem]">
                <li className="font-bold text-slate-900">
                  ✓ 3.75 a 6.0 kg · Cabe en maletero o mochila de viaje
                </li>
                <li className="font-semibold text-slate-700">
                  ✓ Refri portátil 12V (22–26 h) + Laptop USB-C + Cámaras/Drones
                </li>
                <li className="font-bold text-sky-700">
                  ✓ Recarga solar con panel plegable 100W–220W o alternador 12V
                </li>
              </ul>
            </div>
          ) : (
            <div
              className="w-full max-w-[560px] rounded-2xl border-[3px] border-amber-500 bg-slate-900/95 px-4 py-3.5 text-center shadow-xl backdrop-blur-sm sm:px-6 sm:py-5"
              style={{ opacity: Math.max(0.75, fullBlackout) }}
            >
              <p className="font-display text-sm font-extrabold leading-snug text-amber-200 sm:text-lg">
                🏠 Corte de Luz: EcoFlow DELTA 2 / Jackery 1000 v2 / BLUETTI AC180
              </p>
              <ul className="mt-2.5 space-y-1.5 text-xs leading-snug sm:mt-3 sm:text-[0.84rem]">
                <li className="font-bold text-white">
                  ✓ 1024Wh–2048Wh LiFePO4 · 0 dB de gases (seguro dentro de casa)
                </li>
                <li className="font-semibold text-slate-300">
                  ✓ Router Wi-Fi (~50 h) + Laptop (~15 h) + Nevera de casa (8–14 h)
                </li>
                <li className="font-bold text-emerald-300">
                  ✓ Conmutación automática UPS/EPS y recarga pared en 50–60 min
                </li>
              </ul>
            </div>
          )}

          <div className="mt-3 w-full max-w-[600px] rounded-xl border-2 border-amber-500 bg-[#0B1520]/95 px-3.5 py-2 text-center shadow-md">
            <p className="font-display text-[0.7rem] font-extrabold leading-snug text-amber-200 sm:text-xs">
              {blackout > 0.5
                ? "Ideal para cortes de luz en departamento, teletrabajo sin cortes y conservar alimentos en la nevera"
                : "Ideal para campamentos de fin de semana, overlanding, CPAP nocturno y fotografía fuera de red"}
            </p>
          </div>
        </div>

        <div className="pointer-events-none absolute left-4 top-4 rounded-2xl border border-white/30 bg-slate-950/65 px-4 py-2 text-white backdrop-blur-md sm:left-6 sm:top-6">
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-white/75">
            {phase}
          </p>
          <p className="font-display text-lg sm:text-2xl font-extrabold tabular-nums text-amber-300">
            {specReading}
          </p>
        </div>
        {!touched && (
          <div className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 animate-pulse whitespace-nowrap rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-fxink shadow-lg sm:bottom-5 sm:px-4 sm:py-2 sm:text-sm">
            ← Arrastra: Camping y Viajes (300–500Wh) vs Apagón en Casa (1000–2000Wh) →
          </div>
        )}
      </div>
      <div className="flex items-center gap-4 bg-[#0B1520] px-5 py-4 text-white sm:px-7">
        <span className="text-xs font-bold whitespace-nowrap text-emerald-300">
          ⛺ Camping & Ruta
        </span>
        <label className="sr-only" htmlFor="ep-range">
          Comparador de escenario camping frente a corte de luz en casa
        </label>
        <input
          id="ep-range"
          type="range"
          min={0}
          max={100}
          value={v}
          onChange={(e) => {
            setV(+e.target.value);
            setTouched(true);
          }}
        />
        <span className="text-xs font-bold whitespace-nowrap text-amber-300">
          🏠 Cortes de Luz en Casa
        </span>
      </div>
    </div>
  );
}
