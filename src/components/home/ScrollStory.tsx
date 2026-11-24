"use client";

import { useEffect, useRef } from "react";

const STEPS = [
  {
    n: "01",
    t: "Suma los Watts (W) de tus equipos reales",
    d: "Un router Wi-Fi consume ~15 W, una laptop ~55 W y una refrigeradora portátil 12V promedia ~18 Wh/h ciclada (45 W cuando comprime). Conocer ese dato evita quedarte a oscuras antes de tiempo.",
  },
  {
    n: "02",
    t: "Elige capacidad útil (Wh), potencia (W) y química LiFePO4",
    d: "Para mochila y fines de semana bastan 256–512Wh (3.7–6 kg). Para cortes de luz en casa o neveras elige 1024–2048Wh LiFePO4 (3,000–4,000 ciclos) y recarga turbo en 50–60 minutos.",
  },
  {
    n: "03",
    t: "Añade un panel solar plegable respetando el tope Voc del MPPT",
    d: "Un panel de 100W a 220W recupera la carga en 4–6 h de sol. Comprueba siempre que el voltaje en circuito abierto (Voc) del panel sea inferior al límite MPPT de tu estación (28V, 60V o 150V).",
  },
  {
    n: "04",
    t: "Conecta el cable exacto (MC4 → XT60i o DC8020) sin perder amperios",
    d: "En EcoFlow el cable MC4 a XT60i desbloquea 15A solares (frente a 8A de un XT60 común); en Jackery Plus/v2 requieres adaptador DC8020. Así aprovechas hasta el último watt del sol.",
  },
];

export default function ScrollStory() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let ctx: { revert: () => void } | null = null;
    let cancelled = false;
    let io: IntersectionObserver | null = null;

    const init = async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        const q = gsap.utils.selector(el);
        if (reduce) {
          gsap.set(q(".step"), { opacity: 1 });
          gsap.set(q(".bar"), { scaleX: 1 });
          gsap.set(q(".phone-alert, .night, .sound-wave"), { opacity: 1 });
          return;
        }
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "+=2200",
            scrub: 0.7,
            pin: q(".pin")[0],
            anticipatePin: 1,
          },
        });
        tl.to(q(".step-0"), { opacity: 1, duration: 0.2 }, 0)
          .to(
            q(".step-0 .dot"),
            { backgroundColor: "#D97706", color: "#fff", duration: 0.2 },
            0
          )
          .fromTo(
            q(".bit-insert"),
            { x: 24 },
            { x: 0, duration: 0.6 },
            0.1
          )
          .to(q(".step-0"), { opacity: 0.75, duration: 0.2 }, 1)
          .to(q(".step-1"), { opacity: 1, duration: 0.2 }, 1)
          .to(
            q(".step-1 .dot"),
            { backgroundColor: "#0284C7", color: "#fff", duration: 0.2 },
            1
          )
          .to(
            q(".torque-badge"),
            { scale: 1.06, svgOrigin: "200 130", duration: 0.5 },
            1.15
          )
          .to(q(".step-1"), { opacity: 0.75, duration: 0.2 }, 2)
          .to(q(".step-2"), { opacity: 1, duration: 0.2 }, 2)
          .to(
            q(".step-2 .dot"),
            { backgroundColor: "#10B981", color: "#fff", duration: 0.2 },
            2
          )
          .fromTo(
            q(".battery-pack"),
            { y: 20 },
            { y: 0, duration: 0.7 },
            2.05
          )
          .to(q(".sound-wave"), { opacity: 1, scaleX: 1, duration: 0.5 }, 2.1)
          .to(q(".step-2"), { opacity: 0.75, duration: 0.2 }, 3.1)
          .to(q(".step-3"), { opacity: 1, duration: 0.2 }, 3.1)
          .to(
            q(".step-3 .dot"),
            { backgroundColor: "#0B1520", color: "#FDE68A", duration: 0.2 },
            3.1
          )
          .to(q(".night"), { opacity: 1, duration: 0.6 }, 3.1)
          .to(q(".phone-alert"), { opacity: 1, y: 0, duration: 0.5 }, 3.3)
          .to(q(".bar"), { scaleX: 1, duration: 3.8 }, 0);
      }, el);
    };

    io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          io?.disconnect();
          init();
        }
      },
      { rootMargin: "600px 0px" }
    );
    io.observe(el);
    return () => {
      cancelled = true;
      io?.disconnect();
      ctx?.revert();
    };
  }, []);

  return (
    <section
      id="ruta-energia"
      ref={root}
      className="relative bg-gradient-to-b from-white via-fxsky to-white"
    >
      <div className="pin flex min-h-[100svh] items-center overflow-hidden py-10 lg:py-14">
        <div className="wrap grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div>
            <span className="eyebrow">Método Exacto de Dimensionamiento</span>
            <h2 className="section-title mt-3">
              Cuatro pasos.{" "}
              <span className="text-prune">
                De tus equipos reales a horas continuas sin apagones.
              </span>
            </h2>
            <div className="mt-4 h-1.5 w-full max-w-sm overflow-hidden rounded bg-[var(--line)]">
              <div className="bar h-full origin-left scale-x-0 bg-gradient-to-r from-fxblue via-drink to-prune" />
            </div>
            <ol className="mt-6 space-y-3 sm:mt-8 sm:space-y-4">
              {STEPS.map((s, i) => (
                <li
                  key={s.n}
                  className={`step step-${i} flex gap-4`}
                  style={{ opacity: 0.8 }}
                >
                  <span className="dot grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white font-display font-extrabold text-fxink shadow-md">
                    {s.n}
                  </span>
                  <div>
                    <p className="font-display text-lg font-bold sm:text-xl">
                      {s.t}
                    </p>
                    <p className="text-sm text-[var(--muted)] sm:text-base">
                      {s.d}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="relative mx-auto w-full max-w-[270px] sm:max-w-[360px] lg:max-w-[420px]">
            <svg
              viewBox="0 0 400 440"
              className="relative w-full drop-shadow-[0_30px_50px_rgba(11,21,32,0.22)]"
              role="img"
              aria-label="Esquema animado de estación portátil LiFePO4 con panel solar plegable y salidas DC/AC"
            >
              <defs>
                <linearGradient id="ss-light" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#f8fafc" />
                  <stop offset="1" stopColor="#e2e8f0" />
                </linearGradient>
                <linearGradient id="ss-dark" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#0B1520" />
                  <stop offset="0.65" stopColor="#0f172a" />
                  <stop offset="1" stopColor="#13293d" />
                </linearGradient>
                <clipPath id="ss-panel">
                  <rect x="0" y="0" width="400" height="440" rx="36" />
                </clipPath>
              </defs>
              <g clipPath="url(#ss-panel)">
                <rect width="400" height="440" fill="url(#ss-light)" />
                <rect
                  className="night"
                  width="400"
                  height="440"
                  fill="url(#ss-dark)"
                  opacity="0"
                />

                <g className="torque-badge">
                  <rect
                    x="46"
                    y="84"
                    width="308"
                    height="36"
                    rx="10"
                    fill="#0B1520"
                    stroke="#f59e0b"
                    strokeWidth="2"
                  />
                  <text
                    x="200"
                    y="106"
                    textAnchor="middle"
                    fontFamily="Outfit, sans-serif"
                    fontWeight="800"
                    fontSize="10.2"
                    fill="#fde68a"
                  >
                    MPPT SOLAR + CELDAS LiFePO4 + INVERSOR PURO
                  </text>
                </g>

                {/* Cuerpo Estación Portátil */}
                <path
                  d="M145 154 L145 138 Q145 130 155 130 L245 130 Q255 130 255 138 L255 154"
                  fill="none"
                  stroke="#475569"
                  strokeWidth="8"
                />
                <rect
                  x="84"
                  y="152"
                  width="232"
                  height="136"
                  rx="20"
                  fill="#0f172a"
                  stroke="#f59e0b"
                  strokeWidth="4"
                />
                {/* Pantalla LCD */}
                <rect x="102" y="170" width="196" height="48" rx="8" fill="#0284c7" fillOpacity="0.22" stroke="#38bdf8" strokeWidth="1.5" />
                <text x="200" y="191" textAnchor="middle" fontFamily="Outfit, sans-serif" fontWeight="800" fontSize="13.5" fill="#10b981">
                  100% · 1024 Wh
                </text>
                <text x="200" y="209" textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight="700" fontSize="8.8" fill="#fde68a">
                  88W: Router 15W + Refri 18W + Laptop 55W
                </text>

                {/* Puertos frontales AC / USB-C / 12V */}
                <rect x="102" y="234" width="56" height="34" rx="6" fill="#1e293b" stroke="#94a3b8" strokeWidth="1.5" />
                <text x="130" y="255" textAnchor="middle" fontSize="9.2" fontWeight="800" fill="#e2e8f0">
                  AC 120V
                </text>
                <rect x="166" y="234" width="68" height="34" rx="6" fill="#1e293b" stroke="#10b981" strokeWidth="1.5" />
                <text x="200" y="255" textAnchor="middle" fontSize="9.2" fontWeight="800" fill="#6ee7b7">
                  USB-C 100W
                </text>
                <rect x="242" y="234" width="56" height="34" rx="6" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.5" />
                <text x="270" y="255" textAnchor="middle" fontSize="9.2" fontWeight="800" fill="#fde68a">
                  12V DC
                </text>

                {/* Cable Solar MC4 -> XT60i / DC8020 acoplándose */}
                <g className="bit-insert">
                  <rect x="316" y="204" width="48" height="14" rx="4" fill="#f59e0b" />
                  <polygon points="364,202 380,211 364,220" fill="#10b981" />
                </g>

                {/* Panel Solar Plegable abajo */}
                <g className="battery-pack">
                  <rect
                    x="48"
                    y="314"
                    width="304"
                    height="56"
                    rx="12"
                    fill="#0c4a6e"
                    stroke="#38bdf8"
                    strokeWidth="3"
                  />
                  <line x1="124" y1="314" x2="124" y2="370" stroke="#38bdf8" strokeWidth="2" />
                  <line x1="200" y1="314" x2="200" y2="370" stroke="#38bdf8" strokeWidth="2" />
                  <line x1="276" y1="314" x2="276" y2="370" stroke="#38bdf8" strokeWidth="2" />
                  <text
                    x="200"
                    y="346"
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="800"
                    fill="#fef08a"
                  >
                    ☀️ PANEL SOLAR PLEGABLE 200W (MC4 → XT60i)
                  </text>
                </g>

                <line
                  className="sound-wave"
                  x1="54"
                  y1="392"
                  x2="346"
                  y2="392"
                  stroke="#10b981"
                  strokeWidth="3.5"
                  strokeDasharray="8 6"
                  strokeLinecap="round"
                  opacity="0.45"
                />

                <g
                  className="phone-alert"
                  opacity="0"
                  transform="translate(40 18)"
                >
                  <rect
                    width="320"
                    height="48"
                    rx="14"
                    fill="#ffffff"
                    stroke="#10b981"
                    strokeWidth="2.5"
                  />
                  <circle cx="24" cy="24" r="13" fill="#10b981" />
                  <text
                    x="24"
                    y="28"
                    textAnchor="middle"
                    fontSize="13"
                    fontWeight="800"
                    fill="#ffffff"
                  >
                    ✓
                  </text>
                  <text
                    x="46"
                    y="20"
                    fontFamily="Outfit, sans-serif"
                    fontWeight="800"
                    fontSize="11.5"
                    fill="#0f172a"
                  >
                    ¡Autonomía Calculada & Solar Compatible!
                  </text>
                  <text
                    x="46"
                    y="35"
                    fontFamily="Inter, sans-serif"
                    fontWeight="600"
                    fontSize="10"
                    fill="#059669"
                  >
                    Router + Laptop + Refri 12V cubiertos · Cero gasolina
                  </text>
                </g>
              </g>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
