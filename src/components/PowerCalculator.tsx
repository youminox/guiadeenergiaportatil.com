"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  CATALOG,
  buildAmazonUrl,
  detectUserAmazonRegion,
  type AmazonStoreRegion,
  type AmazonProductRecommendation,
} from "@/lib/amazon";
import { trackClick, trackCalcLog } from "@/lib/client-constants";

export interface PresetDevice {
  id: string;
  icon: string;
  name: string;
  avgWatts: number;
  peakWatts: number;
  supportsDc: boolean;
  note: string;
}

export const PRESET_DEVICES: PresetDevice[] = [
  {
    id: "router",
    icon: "🌐",
    name: "Router Wi-Fi + Fibra ONT",
    avgWatts: 15,
    peakWatts: 18,
    supportsDc: true,
    note: "Consumo típico 12–18 W continuos (mayor ahorro por salida DC 12V o USB-C).",
  },
  {
    id: "laptop",
    icon: "💻",
    name: "Laptop / MacBook Trabajo",
    avgWatts: 55,
    peakWatts: 95,
    supportsDc: true,
    note: "Promedio real de 40–65 W en videollamadas (mejor por USB-C PD 100W).",
  },
  {
    id: "refri-12v",
    icon: "🧊",
    name: "Refrigeradora Portátil 12V",
    avgWatts: 18,
    peakWatts: 55,
    supportsDc: true,
    note: "Compresor 45W ciclado al ~40 % en modo Eco = ~18 Wh promedio por hora.",
  },
  {
    id: "refri-casa",
    icon: "❄️",
    name: "Refrigeradora de Casa",
    avgWatts: 130,
    peakWatts: 900,
    supportsDc: false,
    note: "Compresor Inverter ~130 Wh/h promedio con pico de arranque de 700–900 W.",
  },
  {
    id: "cpap",
    icon: "😴",
    name: "Máquina CPAP (sin humid.)",
    avgWatts: 35,
    peakWatts: 65,
    supportsDc: true,
    note: "Sin calentador gasta 25–40 W (con humidificador sube a 60–85 W).",
  },
  {
    id: "starlink",
    icon: "🛰️",
    name: "Starlink Mini / Estándar",
    avgWatts: 40,
    peakWatts: 75,
    supportsDc: true,
    note: "Starlink Mini consume 25–35 W (ideal DC); Gen 3 promedia 45–65 W.",
  },
  {
    id: "ventilador",
    icon: "🌀",
    name: "Ventilador de Piso",
    avgWatts: 45,
    peakWatts: 60,
    supportsDc: false,
    note: "Velocidad media en corte de luz nocturno o verano.",
  },
  {
    id: "tv",
    icon: "📺",
    name: "Smart TV LED 50\"",
    avgWatts: 85,
    peakWatts: 110,
    supportsDc: false,
    note: "Televisor LED moderno con consola o TV box.",
  },
];

interface StationSpec {
  id: string;
  brand: "Jackery" | "EcoFlow" | "BLUETTI";
  name: string;
  wh: number;
  continuousW: number;
  surgeW: number;
  idleInverterW: number;
  weightKg: number;
  rechargeAc: string;
  solarMaxW: string;
  solarCable: string;
  priceRef: string;
  reviewHref: string;
  product: AmazonProductRecommendation;
}

const STATIONS: StationSpec[] = [
  {
    id: "jackery-300-plus",
    brand: "Jackery",
    name: "Jackery Explorer 300 Plus",
    wh: 288,
    continuousW: 300,
    surgeW: 600,
    idleInverterW: 7,
    weightKg: 3.75,
    rechargeAc: "2 h AC",
    solarMaxW: "100W (SolarSaga)",
    solarCable: "DC8020 / USB-C",
    priceRef: "US$199–$299",
    reviewHref: "/resenas-estaciones-de-energia/jackery-explorer-300-plus-resena-camping-y-viajes/",
    product: CATALOG.JACKERY_300_PLUS,
  },
  {
    id: "ecoflow-river-2-max",
    brand: "EcoFlow",
    name: "EcoFlow RIVER 2 Max",
    wh: 512,
    continuousW: 500,
    surgeW: 1000,
    idleInverterW: 10,
    weightKg: 6.0,
    rechargeAc: "60 min AC",
    solarMaxW: "220W Bifacial",
    solarCable: "MC4 a XT60i (15A)",
    priceRef: "US$299–$399",
    reviewHref: "/resenas-estaciones-de-energia/ecoflow-river-2-max-resena-autonomia-y-recarga/",
    product: CATALOG.ECOFLOW_RIVER_2_MAX,
  },
  {
    id: "jackery-1000-v2",
    brand: "Jackery",
    name: "Jackery Explorer 1000 v2",
    wh: 1070,
    continuousW: 1500,
    surgeW: 3000,
    idleInverterW: 12,
    weightKg: 10.8,
    rechargeAc: "1 h AC (App)",
    solarMaxW: "400W (2x 200W)",
    solarCable: "DC8020 dual",
    priceRef: "US$449–$649",
    reviewHref: "/resenas-estaciones-de-energia/jackery-explorer-1000-v2-resena-camping-y-casa/",
    product: CATALOG.JACKERY_1000_V2,
  },
  {
    id: "ecoflow-delta-2",
    brand: "EcoFlow",
    name: "EcoFlow DELTA 2",
    wh: 1024,
    continuousW: 1800,
    surgeW: 2700,
    idleInverterW: 12,
    weightKg: 12.0,
    rechargeAc: "50 min (80%)",
    solarMaxW: "500W MPPT",
    solarCable: "MC4 a XT60i (15A)",
    priceRef: "US$479–$699",
    reviewHref: "/resenas-estaciones-de-energia/ecoflow-delta-2-resena-capacidad-recarga-precio/",
    product: CATALOG.ECOFLOW_DELTA_2,
  },
  {
    id: "bluetti-ac180",
    brand: "BLUETTI",
    name: "BLUETTI AC180",
    wh: 1152,
    continuousW: 1800,
    surgeW: 2700,
    idleInverterW: 13,
    weightKg: 16.0,
    rechargeAc: "45 min (80%)",
    solarMaxW: "500W MC4 nativo",
    solarCable: "MC4 incluido",
    priceRef: "US$459–$649",
    reviewHref: "/resenas-estaciones-de-energia/bluetti-ac180-resena-autonomia-y-potencia/",
    product: CATALOG.BLUETTI_AC180,
  },
  {
    id: "ecoflow-delta-2-max",
    brand: "EcoFlow",
    name: "EcoFlow DELTA 2 Max",
    wh: 2048,
    continuousW: 2400,
    surgeW: 4800,
    idleInverterW: 16,
    weightKg: 23.0,
    rechargeAc: "1.1 h AC / 43m híbrida",
    solarMaxW: "1000W (2x500W)",
    solarCable: "Doble MC4 a XT60i",
    priceRef: "US$999–$1,399",
    reviewHref: "/resenas-estaciones-de-energia/ecoflow-delta-2-max-resena-hogar-2048wh/",
    product: CATALOG.ECOFLOW_DELTA_2_MAX,
  },
];

function formatHours(hours: number): string {
  if (!Number.isFinite(hours) || hours <= 0) return "0 min";
  if (hours >= 100) return `${Math.round(hours)} h`;
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (m === 60) return `${h + 1} h`;
  return h === 0 ? `${m} min` : m === 0 ? `${h} h` : `${h} h ${m} min`;
}

export default function PowerCalculator({
  compact = false,
}: {
  compact?: boolean;
}) {
  const [selectedIds, setSelectedIds] = useState<string[]>([
    "router",
    "laptop",
    "refri-12v",
  ]);
  const [extraWatts, setExtraWatts] = useState<number>(0);
  const [connectionMode, setConnectionMode] = useState<"dc" | "ac">("dc");
  const [targetHours, setTargetHours] = useState<number>(12);
  const [region, setRegion] = useState<AmazonStoreRegion>("US");
  const hasLoggedRef = useRef(false);

  useEffect(() => {
    setRegion(detectUserAmazonRegion());
  }, []);

  const toggleDevice = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.length > 1 || extraWatts > 0
          ? prev.filter((x) => x !== id)
          : prev
        : [...prev, id]
    );
    hasLoggedRef.current = false;
  };

  const activeDevices = PRESET_DEVICES.filter((d) =>
    selectedIds.includes(d.id)
  );
  const devicesAvgWatts = activeDevices.reduce((sum, d) => sum + d.avgWatts, 0);
  const totalWatts = Math.max(5, devicesAvgWatts + extraWatts);
  const maxPeakWatts = activeDevices.reduce(
    (max, d) => Math.max(max, d.peakWatts),
    0
  );
  const requiresAc = activeDevices.some((d) => !d.supportsDc) || extraWatts > 140;
  const effectiveMode: "dc" | "ac" = requiresAc ? "ac" : connectionMode;

  const computeStation = (st: StationSpec) => {
    const efficiency = effectiveMode === "dc" ? 0.91 : 0.85;
    const inverterDraw = effectiveMode === "dc" ? 0 : st.idleInverterW;
    const usableWh = st.wh * 0.94 * efficiency;
    const realHours = usableWh / (totalWatts + inverterDraw);
    const fitsPower =
      totalWatts <= st.continuousW && maxPeakWatts <= st.surgeW;
    const meetsHours = fitsPower && realHours >= targetHours;
    return { st, realHours, fitsPower, meetsHours };
  };

  const computed = STATIONS.map(computeStation);
  const bestFit =
    computed.find((c) => c.meetsHours) ||
    [...computed].reverse().find((c) => c.fitsPower) ||
    computed[computed.length - 1];

  const logSimulation = () => {
    trackCalcLog({
      devices: activeDevices.map((d) => d.name),
      total_watts: totalWatts,
      connection_mode: effectiveMode,
      target_hours: targetHours,
      recommended_model: bestFit.st.name,
      estimated_hours: Number(bestFit.realHours.toFixed(1)),
    });
  };

  return (
    <div className="rounded-3xl border border-[var(--line)] bg-white p-5 sm:p-8 shadow-[0_30px_70px_-40px_rgba(11,21,32,0.35)]">
      {/* Encabezado y Switch de Tienda */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[var(--line)]">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-extrabold text-emerald-900">
            ⏱️ Calculadora de Autonomía Real (DoD + Eficiencia Inversor/DC)
          </span>
          <h3 className="mt-2 font-display text-2xl sm:text-3xl font-extrabold text-fxink">
            Calcula cuántas horas alimentará tu equipo cada estación
          </h3>
        </div>
        <div className="inline-flex items-center gap-1 rounded-full bg-fxsky border border-[var(--line)] p-1 text-xs font-bold">
          <button
            type="button"
            onClick={() => setRegion("US")}
            className={`px-3 py-1.5 rounded-full transition cursor-pointer ${
              region === "US"
                ? "bg-[#0B1520] text-amber-300 font-extrabold"
                : "text-slate-600"
            }`}
          >
            🇺🇸 Amazon.com
          </button>
          <button
            type="button"
            onClick={() => setRegion("ES")}
            className={`px-3 py-1.5 rounded-full transition cursor-pointer ${
              region === "ES"
                ? "bg-[#0B1520] text-amber-300 font-extrabold"
                : "text-slate-600"
            }`}
          >
            🇪🇸 Amazon.es
          </button>
        </div>
      </div>

      {/* Selección de Equipos */}
      <div className="mt-6">
        <p className="text-sm font-bold text-fxink">
          1. Marca los dispositivos que deseas alimentar (puedes combinar varios):
        </p>
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {PRESET_DEVICES.map((dev) => {
            const on = selectedIds.includes(dev.id);
            return (
              <button
                key={dev.id}
                type="button"
                onClick={() => toggleDevice(dev.id)}
                className={`flex flex-col items-start rounded-2xl border p-3 text-left transition cursor-pointer ${
                  on
                    ? "border-amber-500 bg-amber-50/90 shadow-sm ring-1 ring-amber-400"
                    : "border-[var(--line)] bg-slate-50/60 hover:border-slate-300"
                }`}
              >
                <div className="flex w-full items-center justify-between">
                  <span className="text-xl" aria-hidden>
                    {dev.icon}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                      on
                        ? "bg-amber-500 text-slate-950"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    ~{dev.avgWatts}W
                  </span>
                </div>
                <span className="mt-1.5 font-display text-xs sm:text-sm font-extrabold text-slate-900 leading-snug">
                  {dev.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Controles de Ajuste Finos */}
      <div className="mt-6 grid gap-5 md:grid-cols-3 rounded-2xl bg-fxsky/80 p-4 sm:p-5 border border-[var(--line)]">
        <div>
          <label
            htmlFor="calc-extra-w"
            className="flex items-center justify-between text-xs font-extrabold uppercase tracking-wider text-slate-700"
          >
            <span>2. Watts adicionales</span>
            <span className="text-fxbluedeep">+{extraWatts} W</span>
          </label>
          <input
            id="calc-extra-w"
            type="range"
            min={0}
            max={1200}
            step={15}
            value={extraWatts}
            onChange={(e) => setExtraWatts(Number(e.target.value))}
            onMouseUp={logSimulation}
            onTouchEnd={logSimulation}
            className="mt-3 w-full accent-[#d97706] cursor-pointer"
          />
          <p className="mt-1 text-[11px] text-slate-500">
            Consumo total combinado:{" "}
            <strong className="text-slate-900">{totalWatts} W promedio</strong>{" "}
            (pico {Math.max(totalWatts, maxPeakWatts)} W).
          </p>
        </div>

        <div>
          <p className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
            3. Tipo de conexión
          </p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={requiresAc}
              onClick={() => setConnectionMode("dc")}
              className={`rounded-xl border px-3 py-2 text-xs font-bold transition cursor-pointer disabled:opacity-45 ${
                effectiveMode === "dc"
                  ? "border-emerald-600 bg-emerald-600 text-white"
                  : "border-slate-300 bg-white text-slate-700"
              }`}
            >
              USB-C / 12V DC (91%)
            </button>
            <button
              type="button"
              onClick={() => setConnectionMode("ac")}
              className={`rounded-xl border px-3 py-2 text-xs font-bold transition cursor-pointer ${
                effectiveMode === "ac"
                  ? "border-[#0B1520] bg-[#0B1520] text-amber-300"
                  : "border-slate-300 bg-white text-slate-700"
              }`}
            >
              Enchufe AC 120V (85%)
            </button>
          </div>
          <p className="mt-1.5 text-[11px] text-slate-500">
            {requiresAc
              ? "Uno de tus equipos requiere enchufe AC 120V (inversor encendido)."
              : "Conectar router, laptop o refri 12V directo a USB-C/DC ahorra ~15 % de batería."}
          </p>
        </div>

        <div>
          <p className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
            4. Horas mínimas deseadas
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {[4, 8, 12, 24, 48].map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => {
                  setTargetHours(h);
                  logSimulation();
                }}
                className={`rounded-xl border px-3 py-2 text-xs font-extrabold transition cursor-pointer ${
                  targetHours === h
                    ? "border-amber-500 bg-amber-400 text-slate-950"
                    : "border-slate-300 bg-white text-slate-700 hover:border-amber-400"
                }`}
              >
                {h} h
              </button>
            ))}
          </div>
          <p className="mt-1.5 text-[11px] text-slate-500">
            Recomendación ideal para tu carga:{" "}
            <strong className="text-emerald-800">{bestFit.st.name}</strong>.
          </p>
        </div>
      </div>

      {/* Tarjeta Ganadora Destacada */}
      <div className="mt-6 rounded-2xl bg-gradient-to-r from-[#0B1520] via-[#0f172a] to-[#0c4a6e] p-5 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="inline-block rounded-full bg-emerald-400/20 border border-emerald-400/40 px-2.5 py-0.5 text-[11px] font-extrabold text-emerald-300">
            🏆 Mejor Ajuste para {totalWatts} W · Objetivo {targetHours} h
          </span>
          <h4 className="mt-1.5 font-display text-xl sm:text-2xl font-extrabold">
            {bestFit.st.name} →{" "}
            <span className="text-amber-300">
              {formatHours(bestFit.realHours)} de autonomía real
            </span>
          </h4>
          <p className="mt-1 text-xs sm:text-sm text-white/80">
            Capacidad {bestFit.st.wh}Wh · Potencia {bestFit.st.continuousW}W · Peso{" "}
            {bestFit.st.weightKg} kg · Solar recomendado:{" "}
            {bestFit.st.solarMaxW} ({bestFit.st.solarCable}).
          </p>
        </div>
        <a
          href={buildAmazonUrl(bestFit.st.product, region)}
          target="_blank"
          rel="nofollow sponsored noopener noreferrer"
          onClick={() => {
            logSimulation();
            trackClick("calc-best-cta", {
              article_slug: bestFit.st.id,
              article_title: bestFit.st.name,
              category: "amazon",
              target_url: buildAmazonUrl(bestFit.st.product, region),
            });
          }}
          className="btn btn-lime shine shrink-0 text-xs sm:text-sm"
        >
          Ver {bestFit.st.name} en {region === "US" ? "Amazon.com" : "Amazon.es"} ↗
        </a>
      </div>

      {/* Tabla Comparativa Completa Jackery vs EcoFlow vs BLUETTI */}
      <div className="mt-6 overflow-x-auto rounded-2xl border border-[var(--line)]">
        <table className="w-full text-left text-xs sm:text-sm border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-[var(--line)] font-display font-bold text-slate-800">
              <th className="p-3">Modelo (Jackery · EcoFlow · BLUETTI)</th>
              <th className="p-3">Capacidad / Potencia</th>
              <th className="p-3">Autonomía Estimada</th>
              {!compact && <th className="p-3">Peso y Recarga AC</th>}
              {!compact && <th className="p-3">Panel Solar & Cable</th>}
              <th className="p-3 text-right">Precio / Amazon</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--line)]">
            {computed.map(({ st, realHours, fitsPower, meetsHours }) => {
              const amzUrl = buildAmazonUrl(st.product, region);
              return (
                <tr
                  key={st.id}
                  className={
                    bestFit.st.id === st.id
                      ? "bg-amber-50/70 font-medium"
                      : "hover:bg-slate-50/70"
                  }
                >
                  <td className="p-3">
                    <Link
                      href={st.reviewHref}
                      className="font-display font-extrabold text-fxink hover:text-fxbluedeep hover:underline block"
                    >
                      {st.name}
                    </Link>
                    <span className="text-[11px] text-slate-500">
                      {st.priceRef}
                    </span>
                  </td>
                  <td className="p-3 text-slate-700">
                    <strong>{st.wh} Wh</strong> · {st.continuousW} W
                    <span className="block text-[11px] text-slate-500">
                      Pico {st.surgeW} W
                    </span>
                  </td>
                  <td className="p-3">
                    {fitsPower ? (
                      <div>
                        <span
                          className={`inline-block rounded-lg px-2 py-0.5 font-display font-extrabold ${
                            meetsHours
                              ? "bg-emerald-100 text-emerald-900"
                              : "bg-slate-100 text-slate-800"
                          }`}
                        >
                          {formatHours(realHours)}
                        </span>
                        <span className="block text-[10px] text-slate-500 mt-0.5">
                          {meetsHours ? "✓ Cumple objetivo" : `Meta: ${targetHours}h`}
                        </span>
                      </div>
                    ) : (
                      <span className="inline-block rounded-lg bg-red-100 px-2 py-0.5 text-[11px] font-bold text-red-800">
                        Excede {st.continuousW}W
                      </span>
                    )}
                  </td>
                  {!compact && (
                    <td className="p-3 text-slate-700">
                      {st.weightKg} kg
                      <span className="block text-[11px] text-slate-500">
                        {st.rechargeAc}
                      </span>
                    </td>
                  )}
                  {!compact && (
                    <td className="p-3 text-slate-700">
                      {st.solarMaxW}
                      <span className="block text-[11px] text-slate-500">
                        {st.solarCable}
                      </span>
                    </td>
                  )}
                  <td className="p-3 text-right">
                    <a
                      href={amzUrl}
                      target="_blank"
                      rel="nofollow sponsored noopener noreferrer"
                      onClick={() =>
                        trackClick("calc-table-cta", {
                          article_slug: st.id,
                          article_title: st.name,
                          category: "amazon",
                          target_url: amzUrl,
                        })
                      }
                      className="inline-flex items-center gap-1 rounded-xl bg-[#0B1520] px-3 py-2 text-xs font-extrabold text-amber-300 hover:bg-slate-800 transition whitespace-nowrap"
                    >
                      Amazon ↗
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
