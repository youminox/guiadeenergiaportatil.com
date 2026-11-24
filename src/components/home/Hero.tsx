"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import HeroSearch from "@/components/HeroSearch";
import OpenChatButton from "@/components/OpenChatButton";

function Particles() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    let running = false;
    let w = 0,
      h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      w = c.clientWidth;
      h = c.clientHeight;
      c.width = w * dpr;
      c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const COLORS = [
      "245,158,11",
      "254,240,138",
      "16,185,129",
      "56,189,248",
      "255,255,255",
      "217,119,6",
    ];
    const N = w < 700 ? 48 : 110;
    const ps = Array.from({ length: N }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 2.3 + 0.6,
      vx: (Math.random() - 0.5) * 0.25,
      vy: -Math.random() * 0.35 - 0.05,
      c: COLORS[(Math.random() * COLORS.length) | 0],
      a: Math.random() * 0.55 + 0.25,
    }));
    let mx = -999,
      my = -999;
    const onMove = (e: PointerEvent) => {
      const r = c.getBoundingClientRect();
      mx = e.clientX - r.left;
      my = e.clientY - r.top;
    };
    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of ps) {
        const dx = p.x - mx,
          dy = p.y - my,
          d2 = dx * dx + dy * dy;
        if (d2 < 16000) {
          const f = (16000 - d2) / 16000;
          p.vx += (dx / 4000) * f;
          p.vy += (dy / 4000) * f;
        }
        p.vx *= 0.975;
        p.vy = p.vy * 0.975 - 0.006;
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -10) {
          p.y = h + 10;
          p.x = Math.random() * w;
        }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        ctx.beginPath();
        ctx.fillStyle = `rgba(${p.c},${p.a})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    const play = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(tick);
    };
    const pause = () => {
      running = false;
      cancelAnimationFrame(raf);
    };
    const io = new IntersectionObserver(([e]) =>
      e.isIntersecting ? play() : pause()
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ric =
      (window as any).requestIdleCallback ||
      ((f: () => void) => setTimeout(f, 300));
    ric(() => io.observe(c));
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      pause();
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);
  return (
    <canvas
      ref={ref}
      className="pointer-events-none absolute inset-0 -z-[1] h-full w-full"
      aria-hidden
    />
  );
}

export default function Hero({ heroImage }: { heroImage: string }) {
  const card = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = card.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    let tx = 0,
      ty = 0,
      cx = 0,
      cy = 0,
      raf = 0;
    const loop = () => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      el.style.transform = `rotateY(${cx}deg) rotateX(${cy}deg)`;
      if (Math.abs(tx - cx) > 0.01 || Math.abs(ty - cy) > 0.01)
        raf = requestAnimationFrame(loop);
      else raf = 0;
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      tx = (e.clientX / window.innerWidth - 0.5) * 22;
      ty = -(e.clientY / window.innerHeight - 0.5) * 16;
      kick();
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  const words = ["EnergiaPortatil", ".com"];
  return (
    <section className="hero min-h-[100svh] pt-[68px]">
      <div className="hero-aurora" />
      <div className="hero-grid" />
      <Particles />
      <div className="wrap grid min-h-[calc(100svh-68px)] items-center gap-8 py-12 lg:grid-cols-[1.08fr_1fr] lg:gap-10 lg:py-6">
        <div className="relative z-20">
          <span className="chip">
            <span className="h-2 w-2 animate-pulse rounded-full bg-drink" />{" "}
            Guía en Español · Amazon EE. UU. · Jackery · EcoFlow · BLUETTI
          </span>
          <h1 className="hero-title mt-5">
            <span className="block">
              <span className="text-white/95 font-extrabold mr-1.5">GuiaDe</span>
              {words.map((w, i) => (
                <span key={w}>
                  <span
                    className="hw"
                    style={{
                      animationDelay: `${0.08 + i * 0.14}s, ${-i * 1.2}s`,
                    }}
                  >
                    {w}
                  </span>
                </span>
              ))}
            </span>{" "}
            <span className="mt-4 block text-[0.39em] font-bold leading-[1.24] tracking-[-0.02em] text-white/92">
              Estaciones de energía portátiles para camping, viajes y cortes de luz{" "}
              <span className="text-[#fde68a]">
                con calculadora de horas reales y paneles compatibles
              </span>
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-base sm:text-lg leading-relaxed text-white/78">
            Comparamos{" "}
            <strong className="text-white">Jackery, EcoFlow y BLUETTI</strong>{" "}
            por capacidad (<strong className="text-white">Wh</strong>), potencia (
            <strong className="text-white">W</strong>), peso, tiempo de recarga y
            precio en <strong className="text-white">Amazon Estados Unidos</strong>.
            Calcula cuántas horas alimenta un{" "}
            <strong className="text-[#fde68a]">
              router, una laptop o una refrigeradora portátil
            </strong>{" "}
            y elige paneles solares plegables y cables 100 % compatibles.
          </p>

          <div className="mt-6">
            <HeroSearch />
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a
              href="#calculadora"
              className="btn btn-lime shine text-sm sm:text-base"
              data-magnetic
            >
              ⏱️ Calcular Horas de Autonomía
            </a>
            <Link
              href="/comparativas-jackery-ecoflow-bluetti/"
              className="btn btn-buy shine text-sm sm:text-base"
              data-magnetic
            >
              ⚖️ Jackery vs EcoFlow vs BLUETTI
            </Link>
            <OpenChatButton
              label="Consultar Asesor IA"
              className="btn btn-glass text-sm sm:text-base"
              magnetic
            />
          </div>

          <ul
            className="mt-8 grid max-w-lg grid-cols-3 gap-2.5 sm:gap-3"
            aria-label="Métricas clave de GuiaDeEnergiaPortatil.com"
          >
            {[
              ["1,534", "guías", "1,000 SEO + 520 Amazon"],
              ["3 Marcas", "líderes", "Jackery · EcoFlow · BLUETTI"],
              ["100 %", "exacto", "Paneles, Cables & Horas"],
            ].map(([v, u, l]) => (
              <li key={l} className="glass px-3 py-3 sm:px-4">
                <p className="font-display text-xl font-extrabold text-white sm:text-2xl">
                  {v}
                  {u && (
                    <span className="ml-1 text-xs font-bold text-fxlime">
                      {u}
                    </span>
                  )}
                </p>
                <p className="text-[0.72rem] leading-tight text-white/70 sm:text-xs">
                  {l}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="tilt-stage relative z-10 mx-auto w-full max-w-[560px]">
          <div ref={card} className="tilt-card relative py-4">
            <div className="tilt-glow" />
            <div className="halo-ring" />
            <div className="relative" style={{ transform: "translateZ(50px)" }}>
              <div className="float-y relative mx-auto aspect-[16/10] w-full overflow-hidden rounded-[32px] border-2 border-white/20 shadow-[0_40px_60px_rgba(0,0,0,0.65)]">
                <Image
                  src={heroImage}
                  alt="Estación de energía portátil LiFePO4 junto a panel solar plegable, laptop y refrigeradora portátil de camping"
                  fill
                  priority
                  fetchPriority="high"
                  sizes="(max-width: 640px) 92vw, (max-width: 1024px) 70vw, 560px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1520]/95 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-2 text-white">
                  <div>
                    <span className="inline-block rounded-full bg-fxblue px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white">
                      Top Ventas Amazon EE. UU.
                    </span>
                    <p className="mt-1 font-display text-lg sm:text-xl font-extrabold leading-tight">
                      Jackery 1000 v2 · EcoFlow DELTA 2 · BLUETTI AC180
                    </p>
                  </div>
                  <Link
                    href="/resenas-estaciones-de-energia/"
                    className="shrink-0 rounded-full bg-white/20 px-3 py-1.5 text-xs font-bold backdrop-blur hover:bg-white/30"
                  >
                    Ver Reseñas →
                  </Link>
                </div>
              </div>
            </div>
            <div
              className="absolute right-0 top-0 sm:right-2 sm:top-1 grid h-[120px] w-[120px] place-items-center rounded-full text-center text-slate-950 shadow-2xl"
              style={{
                background:
                  "radial-gradient(circle at 30% 28%, #fef08a, #f59e0b 55%, #b45309)",
                transform: "translateZ(100px) rotate(-8deg)",
              }}
              aria-label="Desde 256Wh a 3600Wh LiFePO4 en Amazon EE. UU."
            >
              <div>
                <p className="font-display text-[1.12rem] font-extrabold leading-none">
                  LiFePO4
                </p>
                <p className="mt-1 text-[0.62rem] font-extrabold uppercase">
                  4,000 Ciclos
                </p>
                <p className="text-[0.6rem] font-bold">Carga 50–60 min</p>
              </div>
            </div>
            <div
              className="absolute -left-1 bottom-2 hidden rounded-2xl border border-white/15 bg-[#0B1520]/90 px-4 py-3 shadow-xl backdrop-blur sm:block"
              style={{ transform: "translateZ(80px)" }}
            >
              <p className="text-[0.68rem] uppercase tracking-wider text-white/60">
                Comparativa en 5 Variables Reales
              </p>
              <p className="font-display font-bold text-fxlime">
                Wh · W · Peso · Recarga · Precio Amazon
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
