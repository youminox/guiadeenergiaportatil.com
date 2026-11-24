import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ClientEffects from "@/components/ClientEffects";
import ArticleCard from "@/components/ArticleCard";
import ReadingProgress from "@/components/ReadingProgress";
import SplitHeading from "@/components/SplitHeading";
import OpenChatButton from "@/components/OpenChatButton";
import AmazonAffiliateBox from "@/components/AmazonAffiliateBox";
import PowerCalculator from "@/components/PowerCalculator";
import { JsonLd } from "@/components/Breadcrumbs";
import Hero from "@/components/home/Hero";
import ScrollStory from "@/components/home/ScrollStory";
import SolarFlowDiagramSvg from "@/components/home/SolarFlowDiagramSvg";
import PowerOrbit, { type OrbitItem } from "@/components/home/PowerOrbit";
import MetricsCounters, {
  type MetricItem,
} from "@/components/home/MetricsCounters";
import ScenarioSlider from "@/components/home/ScenarioSlider";
import MomentsCarousel, { type Moment } from "@/components/home/MomentsCarousel";
import { getContextualAmazonProducts } from "@/lib/amazon";
import {
  SITE_URL,
  OG_DEFAULT,
  ENERGY_DISCLAIMER,
  ambient,
  getAllContent,
  getArticlesIn,
  getByPath,
  getCategories,
  safeHref,
  type Article,
} from "@/lib/content";

export const metadata: Metadata = {
  title:
    "GuiaDeEnergiaPortatil.com: Jackery, EcoFlow y BLUETTI para Camping, Viajes y Cortes de Luz",
  description:
    "Guía en español para elegir estaciones de energía portátiles Jackery, EcoFlow y BLUETTI para camping, viajes y cortes de luz en casa. Compara Wh, potencia, peso, recarga y precio, calcula horas reales y elige paneles solares y cables en Amazon EE. UU.",
  alternates: { canonical: `${SITE_URL}/` },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/`,
    title:
      "GuiaDeEnergiaPortatil.com: Estaciones Portátiles, Calculadora de Horas y Paneles Solares",
    description:
      "Compara Jackery, EcoFlow y BLUETTI según capacidad, potencia, peso, recarga y precio en Amazon EE. UU., con calculadora para router, laptop y refrigeradora portátil.",
    images: [
      {
        url: OG_DEFAULT(),
        width: 1200,
        height: 675,
        alt: "GuiaDeEnergiaPortatil.com – Guía de Estaciones de Energía Portátiles y Paneles Solares",
      },
    ],
  },
};

const FAQ = [
  {
    q: "¿Qué marca elegir: Jackery, EcoFlow o BLUETTI?",
    a: "Depende de tu prioridad: EcoFlow lidera en velocidad de recarga desde pared (0–80 % en 50 minutos) y respaldo UPS rápido (<10–30 ms); Jackery destaca por ser la más ligera, silenciosa (30 dB) y longeva con 4,000 ciclos LiFePO4 en su serie v2/Plus; y BLUETTI suele ofrecer más Wh y potencia de entrada solar MPPT por cada dólar invertido.",
  },
  {
    q: "¿Cuántas horas dura una estación de 1000Wh con un router, una laptop y una refrigeradora portátil?",
    a: "Conectando un router Wi-Fi (15 W) + una laptop de oficina (55 W) + una refrigeradora portátil 12V ciclada (~18 W promedio) suman unos 88 W medios. Sobre una estación de 1024Wh–1152Wh (EcoFlow DELTA 2, Jackery 1000 v2 o BLUETTI AC180) obtienes alrededor de 9 a 11 horas continuas todo encendido al mismo tiempo, o más de 40 horas si solo alimentas router + refrigeradora portátil.",
  },
  {
    q: "¿Puedo conectar cualquier panel solar plegable a una estación Jackery, EcoFlow o BLUETTI?",
    a: "Sí, siempre que respetes dos reglas: 1) El voltaje en circuito abierto (Voc) del panel debe ser estrictamente menor que el límite máximo de entrada MPPT de tu estación (por ejemplo 28V en BLUETTI EB3A, 60V en EcoFlow DELTA 2 / BLUETTI AC180); y 2) Debes usar el cable adaptador correcto (MC4 a XT60i para EcoFlow o MC4 a DC7909/DC8020 para Jackery).",
  },
  {
    q: "¿Por qué conviene el cable MC4 a XT60i en lugar de un XT60 común en EcoFlow?",
    a: "El conector XT60i incorpora un pin central de señalización que le indica a la estación EcoFlow que está conectada a paneles solares (permitiendo hasta 15A de corriente). Un cable XT60 estándar sin ese tercer pin hace que la estación crea que viene del mechero de un coche y la limita a 8A, recortando casi a la mitad la potencia solar.",
  },
  {
    q: "¿Es mejor usar la salida AC (enchufe de pared) o USB-C / 12V DC para router y laptop?",
    a: "Siempre es más eficiente usar USB-C PD o DC 12V directo (aprovecha ~91 % de la batería). Encender el inversor AC de 120V consume entre 8W y 16W extra de autoconsumo constante además de perder ~15 % en la conversión.",
  },
  {
    q: "¿Puedo llevar una estación de energía portátil en avión?",
    a: "Solo las estaciones por debajo de 100Wh (como la Jackery Explorer 100 Plus de 99Wh) pasan libremente en equipaje de mano según normas FAA/TSA. Las de 101Wh a 160Wh requieren aprobación previa de la aerolínea, y todas las estaciones mayores a 160Wh (como 256Wh, 512Wh o 1000Wh) están prohibidas en aviones comerciales.",
  },
  {
    q: "¿Una estación comprada en Amazon Estados Unidos (110V–120V) sirve si vivo en un país de 220V?",
    a: "Las salidas AC de los modelos de Amazon EE. UU. entregan 110V–120V / 60Hz. Casi todos los routers, laptops, monitores, televisores, cargadores USB-C y refrigeradoras portátiles 12V son multivoltaje (100–240V) o DC directos, por lo que funcionan sin problemas. Para recargar la estación desde un enchufe de pared de 220V sin riesgo sí debes usar paneles solares, 12V o un transformador reductor 220V→110V de al menos 1.5x la potencia de carga AC.",
  },
];

const CLAIMS = [
  "Jackery Explorer 1000 v2 & Plus",
  "EcoFlow DELTA 2 & RIVER 3",
  "BLUETTI AC180 & AC200L",
  "Celdas LiFePO4 4,000 Ciclos",
  "Calculadora Horas Reales",
  "Paneles Solares Plegables IP68",
  "Cables XT60i · DC8020 · MC4",
  "Amazon EE. UU. Actualizado",
];

const CLAIMS_2 = [
  "Camping y Overlanding",
  "Viajes en Carretera y Vanlife",
  "Cortes de Luz en Casa",
  "Router Wi-Fi · Laptop · Refri 12V",
  "Respaldo UPS <10ms",
  "Recarga Turbo 50 Minutos",
  "Cargador de Alternador 800W",
  "Guía 100% en Español",
];

const ICONS: Record<string, string> = {
  station: "🔋",
  scale: "⚖️",
  tag: "🏆",
  solar: "☀️",
  battery: "⚡",
  cable: "🔌",
  clock: "⏱️",
  home: "🏠",
  camp: "⛺",
  sun: "🔆",
  plug: "🔗",
  chip: "🧪",
  bolt: "💥",
  shield: "🛡️",
};

export default function Home() {
  const cats = getCategories();
  const all = getAllContent();
  const amzHome = getContextualAmazonProducts(
    "home",
    "mejores-estaciones-por-uso-y-capacidad",
    "Top 3 Estaciones de Energía Más Vendidas en Amazon EE. UU."
  );

  const orbit: OrbitItem[] = [
    {
      k: "ecoflow",
      name: "EcoFlow DELTA & RIVER",
      img: null,
      icon: "🔵",
      role: "Recarga AC ultrarrápida en 50 min y UPS <10ms",
      d: "Desde la silenciosa RIVER 3 Plus (286Wh) hasta la versátil DELTA 2 (1024Wh) y DELTA 2 Max (2048Wh), con entrada solar XT60i hasta 15A.",
      href: safeHref(
        "/resenas-estaciones-de-energia/ecoflow-delta-2-resena-capacidad-recarga-precio/"
      ),
    },
    {
      k: "jackery",
      name: "Jackery Explorer v2/Plus",
      img: null,
      icon: "🟠",
      role: "Las más ligeras y silenciosas (30 dB · 4,000 ciclos)",
      d: "Explorer 100 Plus (avión), 300 Plus (3.75 kg), 1000 v2 (10.8 kg) y 2000 Plus con ruedas, diseñadas con química LiFePO4 de 10 años.",
      href: safeHref(
        "/resenas-estaciones-de-energia/jackery-explorer-1000-v2-resena-camping-y-casa/"
      ),
    },
    {
      k: "bluetti",
      name: "BLUETTI AC180 & EB3A",
      img: null,
      icon: "🟦",
      role: "Más capacidad (Wh) y entrada solar MPPT por tu dinero",
      d: "Desde la compacta EB3A (268Wh/600W) hasta la AC180 (1152Wh/1800W) y AC200L (2048Wh con MPPT de 145V y puerto 30A).",
      href: safeHref(
        "/resenas-estaciones-de-energia/bluetti-ac180-resena-autonomia-y-potencia/"
      ),
    },
    {
      k: "router",
      name: "Router Wi-Fi + Laptop",
      img: null,
      icon: "🌐",
      role: "Teletrabajo sin interrupciones en cortes de luz",
      d: "Un router de fibra consume ~15 W y una laptop ~55 W: aprende a alimentarlos por USB-C PD o DC 12V para ganar hasta un 15 % más de horas.",
      href: safeHref(
        "/autonomia-consumo-y-calculo-de-horas/cuantas-horas-dura-estacion-1000wh-router-laptop-refrigeradora/"
      ),
    },
    {
      k: "refri",
      name: "Refrigeradora Portátil",
      img: null,
      icon: "🧊",
      role: "Compresores 12V ciclado (~18 Wh/h) y neveras de casa",
      d: "Calcula el ciclo real de arranque frente a consumo sostenido para mantener tus alimentos y bebidas fríos durante 24–72 horas.",
      href: safeHref(
        "/autonomia-consumo-y-calculo-de-horas/cuantas-horas-dura-refrigeradora-portatil-12v-estacion-energia/"
      ),
    },
    {
      k: "paneles",
      name: "Paneles Solares Plegables",
      img: null,
      icon: "☀️",
      role: "De 40W a 400W monocristalinos ETFE IP68",
      d: "Compara SolarSaga, EcoFlow Bifacial 220W, BLUETTI PV200 y paneles universales MC4 que ahorran hasta 40 % cumpliendo el tope Voc.",
      href: safeHref(
        "/paneles-solares-plegables/mejores-paneles-solares-plegables-jackery-ecoflow-bluetti/"
      ),
    },
    {
      k: "cables",
      name: "Cables XT60i y DC8020",
      img: null,
      icon: "🔌",
      role: "Adaptadores MC4 y cargadores de alternador 560–800W",
      d: "Evita el error de carga lenta a 8A usando cables XT60i de 15A, adaptadores DC7909/DC8020 y cargadores DC-DC en ruta.",
      href: safeHref(
        "/cables-adaptadores-y-transferencia/cable-mc4-a-xt60-vs-xt60i-ecoflow-15a/"
      ),
    },
    {
      k: "apagon",
      name: "Respaldo Cortes de Luz",
      img: null,
      icon: "🏠",
      role: "Cero monóxido, cero gasolina y operación en interiores",
      d: "Sustituye generadores ruidosos en departamentos: conmutación automática EPS/UPS y switches de transferencia manual seguros.",
      href: safeHref("/cortes-de-luz-y-respaldo-en-casa/"),
    },
  ];

  const metrics: MetricItem[] = [
    {
      v: 1534,
      dec: 0,
      u: "guías",
      l: "1,000 SEO + 520 Amazon",
      pct: 100,
      note: "Arquitectura 0% canibalización",
    },
    {
      v: 4000,
      dec: 0,
      u: "ciclos",
      l: "Vida útil LiFePO4 (10+ años)",
      pct: 100,
      note: "Jackery v2/Plus · EcoFlow · BLUETTI",
    },
    {
      v: 50,
      dec: 0,
      u: "min",
      l: "Recarga AC 0–80 % en 1 kWh",
      pct: 92,
      note: "EcoFlow X-Stream / BLUETTI Turbo",
    },
    {
      v: 48,
      dec: 0,
      u: "horas",
      l: "Autonomía Router / Refri 12V",
      pct: 90,
      note: "Con estación de 1024Wh–1152Wh",
    },
    {
      v: 10,
      dec: 0,
      u: "ms",
      l: "Respuesta UPS Anti-Cortes",
      pct: 95,
      note: "EcoFlow RIVER 3 Plus / DELTA 3",
    },
    {
      v: 100,
      dec: 0,
      u: "%",
      l: "Compatibilidad Solar & Cables",
      pct: 100,
      note: "Voc · XT60i · DC8020 · MC4",
    },
  ];

  const moments: Moment[] = [
    {
      img: ambient("home-router-laptop-apagon"),
      t: "Apagón sin perder Wi-Fi",
      d: "Cuántas horas aguantan router + ONT + laptop conectados por USB-C/DC.",
      href: safeHref(
        "/autonomia-consumo-y-calculo-de-horas/cuantas-horas-dura-estacion-1000wh-router-laptop-refrigeradora/"
      ),
      alt: "Estación de energía portátil manteniendo encendidos router Wi-Fi y laptop durante un corte de luz en casa",
    },
    {
      img: ambient("home-refri-portatil"),
      t: "Refri portátil 12V en ruta",
      d: "El ciclo real del compresor (18 Wh/h) para mantener comida fría 2 días.",
      href: safeHref(
        "/autonomia-consumo-y-calculo-de-horas/cuantas-horas-dura-refrigeradora-portatil-12v-estacion-energia/"
      ),
      alt: "Estación portátil alimentando una refrigeradora portátil 12V en el maletero de una camioneta",
    },
    {
      img: ambient("home-camping-estacion"),
      t: "Camping ligero 300–500Wh",
      d: "Modelos de 3.7 a 6 kg para carpa, luces, cámaras y drones.",
      href: safeHref(
        "/resenas-estaciones-de-energia/jackery-explorer-300-plus-resena-camping-y-viajes/"
      ),
      alt: "Estación de energía compacta naranja y negra junto a una carpa de camping en bosque",
    },
    {
      img: ambient("home-paneles-solares"),
      t: "Paneles solares plegables",
      d: "100W, 200W o 400W: cuánto rinden en sol real y cómo evitar pasarte de Voc.",
      href: safeHref(
        "/paneles-solares-plegables/mejores-paneles-solares-plegables-jackery-ecoflow-bluetti/"
      ),
      alt: "Paneles solares plegables monocristalinos recargando una estación portátil al aire libre",
    },
    {
      img: ambient("home-corte-luz-casa"),
      t: "Nevera de casa en cortes largos",
      d: "Por qué necesitas 1024Wh–2048Wh y qué pico de arranque aguanta el inversor.",
      href: safeHref(
        "/cortes-de-luz-y-respaldo-en-casa/mantener-refrigeradora-encendida-corte-de-luz-estacion-portatil/"
      ),
      alt: "Estación de energía portátil de 2000Wh conectada junto al refrigerador de una cocina moderna",
    },
    {
      img: ambient("home-cables-conectores"),
      t: "Cables XT60i, DC8020 y MC4",
      d: "El secreto del pin central de 15A y cómo adaptar paneles universales.",
      href: safeHref(
        "/cables-adaptadores-y-transferencia/cable-mc4-a-xt60-vs-xt60i-ecoflow-15a/"
      ),
      alt: "Primer plano de conectores solares MC4, XT60i amarillo y adaptador DC8020 junto a estación portátil",
    },
    {
      img: ambient("home-cpap-viaje"),
      t: "CPAP toda la noche y avión",
      d: "Configuración sin humidificador y estaciones <100Wh aptas para vuelo.",
      href: safeHref(
        "/energia-para-camping-viajes-y-camper/llevar-estacion-de-energia-en-avion-reglas-faa-100wh/"
      ),
      alt: "Estación portátil silenciosa junto a equipo médico CPAP y mesa de noche",
    },
  ];

  const POPULAR_PATHS = [
    "/comparativas-jackery-ecoflow-bluetti/jackery-vs-ecoflow-vs-bluetti-cual-elegir/",
    "/resenas-estaciones-de-energia/ecoflow-delta-2-resena-capacidad-recarga-precio/",
    "/resenas-estaciones-de-energia/jackery-explorer-1000-v2-resena-camping-y-casa/",
    "/resenas-estaciones-de-energia/bluetti-ac180-resena-autonomia-y-potencia/",
    "/autonomia-consumo-y-calculo-de-horas/cuantas-horas-dura-estacion-1000wh-router-laptop-refrigeradora/",
    "/paneles-solares-plegables/mejores-paneles-solares-plegables-jackery-ecoflow-bluetti/",
  ];
  const popular: Article[] = POPULAR_PATHS.map((p) => getByPath(p)).filter(
    Boolean
  ) as Article[];
  for (const a of all) {
    if (popular.length >= 6) break;
    if (!a.isPillar && !popular.includes(a)) popular.push(a);
  }

  return (
    <>
      <ReadingProgress />
      <Header variant="dark" />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebPage",
              "@id": `${SITE_URL}/#webpage`,
              url: `${SITE_URL}/`,
              name: "GuiaDeEnergiaPortatil.com — Estaciones de Energía Portátiles, Calculadora y Paneles Solares",
              inLanguage: "es",
              isPartOf: { "@id": `${SITE_URL}/#website` },
              primaryImageOfPage: `${SITE_URL}${ambient("home-hero-energia")}`,
            },
            {
              "@type": "FAQPage",
              "@id": `${SITE_URL}/#faq`,
              mainEntity: FAQ.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            },
          ],
        }}
      />
      <main>
        {/* 1–2. Hero 3D Tilt + Partículas + Buscador sobre 1,534 Guías */}
        <Hero heroImage={ambient("home-hero-energia")} />

        {/* 3. Doble Cinta Marquee en Sentidos Opuestos */}
        <div className="relative border-b border-[var(--line)] bg-white py-5">
          <div className="marquee">
            {[0, 1].map((k) => (
              <div
                key={k}
                className="marquee-track font-display text-lg font-bold text-fxink/85"
                aria-hidden={k === 1}
              >
                {CLAIMS.map((t) => (
                  <span
                    key={t}
                    className="flex items-center gap-3 whitespace-nowrap"
                  >
                    <span className="h-2.5 w-2.5 rotate-45 rounded-[2px] bg-gradient-to-br from-fxlime to-drink" />
                    {t}
                  </span>
                ))}
              </div>
            ))}
          </div>
          <div className="marquee reverse mt-3" aria-hidden>
            {[0, 1].map((k) => (
              <div
                key={k}
                className="marquee-track text-sm font-semibold uppercase tracking-[0.14em] text-prune/80"
              >
                {CLAIMS_2.map((t) => (
                  <span
                    key={t}
                    className="flex items-center gap-3 whitespace-nowrap"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-fxblue" />
                    {t}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* 4. Los 4 Ejes de Elección + Tarjetas Spotlight (.spot) */}
        <section id="criterios" className="wrap py-24">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.05fr]">
            <div>
              <span className="eyebrow" data-reveal>
                Compra Inteligente en Amazon EE. UU.
              </span>
              <SplitHeading
                text="Compara Jackery, EcoFlow y BLUETTI,"
                accent={{
                  text: "sin pagar de más por Wh ni confundir conectores",
                  className: "text-prune",
                }}
                className="section-title mt-3"
              />
              <p className="mt-5 text-lg text-[var(--muted)]" data-reveal>
                Elegir una estación portátil para{" "}
                <strong className="text-fxink">
                  camping, viajes o cortes de luz en casa
                </strong>{" "}
                exige cruzar cinco datos que muchas fichas esconden: capacidad
                útil en <strong className="text-fxink">Wh</strong>, potencia del
                inversor en <strong className="text-fxink">W</strong>, peso real,
                velocidad de recarga y compatibilidad solar/cables.
              </p>
              <div
                className="mt-6 rounded-2xl border border-amber-300/70 bg-amber-50/80 p-5"
                data-reveal
              >
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-amber-800">
                  ⚠️ 3 claves que revisamos en todas nuestras comparativas
                </p>
                <ul className="mt-2 space-y-1.5 text-[0.95rem] text-fxink">
                  <li>
                    • <strong>W (potencia) ≠ Wh (duración):</strong> los watts
                    definen qué aparatos encienden; los Wh definen cuántas horas
                    duran encendidos.
                  </li>
                  <li>
                    • <strong>Salidas DC/USB-C vs Enchufe AC:</strong> conectar
                    router o laptop por USB-C / 12V ahorra hasta un 15 % de
                    batería.
                  </li>
                  <li>
                    • <strong>Límite Voc solar y conector:</strong> respeta el
                    voltaje máximo del MPPT y usa cables{" "}
                    <code>XT60i</code> (15A) o <code>DC8020</code> según marca.
                  </li>
                </ul>
              </div>
              <div className="mt-7 flex flex-wrap gap-3" data-reveal>
                <a
                  href="#calculadora"
                  className="btn btn-lime shine"
                  data-magnetic
                >
                  ⏱️ Ir a la Calculadora
                </a>
                <Link
                  href="/paneles-solares-plegables/"
                  className="btn btn-ghost"
                  data-magnetic
                >
                  ☀️ Paneles Solares Plegables
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div
                className="relative col-span-2 aspect-[16/8] overflow-hidden rounded-3xl shadow-[0_30px_60px_-35px_rgba(11,21,32,0.6)]"
                data-reveal
              >
                <Image
                  src={ambient("og-default")}
                  alt="Comparativa de estaciones portátiles Jackery, EcoFlow y BLUETTI junto a panel solar plegable y accesorios"
                  fill
                  sizes="(max-width:1024px) 100vw, 600px"
                  className="object-cover"
                />
                <span className="absolute bottom-3 left-3 rounded-full bg-white/92 px-3 py-1 text-xs font-semibold text-fxink">
                  Jackery · EcoFlow · BLUETTI · Paneles IP68
                </span>
              </div>
              {[
                [
                  "🔋",
                  "Capacidad Real (Wh)",
                  "Desde 256Wh (mochila) hasta 2048Wh–3600Wh para casa completa.",
                ],
                [
                  "⚡",
                  "Potencia y Picos (W)",
                  "Onda sinusoidal pura de 300W a 3600W para compresores y neveras.",
                ],
                [
                  "⚖️",
                  "Peso y Recarga Turbo",
                  "Desde 3.6 kg con recarga en pared de 50–60 min o alternador 800W.",
                ],
                [
                  "☀️",
                  "Paneles y Cables",
                  "Compatibilidad exacta MC4, XT60i (15A) y DC7909/DC8020.",
                ],
              ].map(([e, t, d], i) => (
                <div
                  key={t}
                  className="card spot p-5"
                  data-reveal
                  data-reveal-delay={String(i)}
                >
                  <p className="text-2xl" aria-hidden>
                    {e}
                  </p>
                  <p className="mt-2 font-display text-lg font-bold leading-tight">
                    {t}
                  </p>
                  <p className="mt-1 text-sm text-[var(--muted)]">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. ScrollStory Fijada en 4 Pasos */}
        <ScrollStory />

        {/* 6. Diagrama SVG Animado de Flujo Solar, MPPT y Salidas DC/AC */}
        <section className="relative isolate overflow-hidden bg-[#0B1520] py-24 text-white">
          <div className="pointer-events-none absolute -left-40 top-10 h-[30rem] w-[30rem] rounded-full bg-fxblue/20 blur-3xl" />
          <div className="pointer-events-none absolute -right-40 bottom-0 h-[30rem] w-[30rem] rounded-full bg-drink/25 blur-3xl" />
          <div className="hero-grid opacity-50" />
          <div className="wrap relative grid items-center gap-14 lg:grid-cols-2">
            <div>
              <span className="eyebrow !text-fxlime" data-reveal>
                Ingeniería eléctrica explicada simple
              </span>
              <SplitHeading
                text="Por qué 1000Wh rinden distinto"
                accent={{
                  text: "según el puerto que conectes",
                  className: "text-gradient",
                }}
                className="section-title mt-3"
              />
              <p className="mt-5 text-lg text-white/75" data-reveal>
                Toda estación portátil almacena energía en corriente continua (
                <strong className="text-amber-300">celdas LiFePO4</strong>). Si
                alimentas tu router, Starlink o laptop directo por{" "}
                <strong className="text-emerald-300">USB-C PD o 12V DC</strong>,
                aprovechas el 91 % sin activar el inversor. Si usas enchufe{" "}
                <strong className="text-sky-300">AC 120V</strong>, el inversor
                gasta ~10–15 W propios cada hora.
              </p>
              <div className="mt-6 grid grid-cols-3 gap-3" data-reveal>
                {[
                  ["91 % Efic.", "Salida USB-C / 12V"],
                  ["85 % Efic.", "Inversor Onda Pura"],
                  ["Voc < MPPT", "Regla de Oro Solar"],
                ].map(([e, t]) => (
                  <div key={t} className="glass p-4 text-center">
                    <p className="font-display text-lg font-extrabold text-amber-300">
                      {e}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-white/80">
                      {t}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-7 flex flex-wrap gap-3" data-reveal>
                <Link
                  href={safeHref(
                    "/compatibilidad-solar-mppt-y-carga/como-calcular-voltaje-voc-paneles-solares-mppt-estacion/"
                  )}
                  className="btn btn-glass"
                  data-magnetic
                >
                  Cómo calcular el límite solar Voc
                </Link>
                <Link
                  href={safeHref(
                    "/conectores-cables-inversores-y-voltaje/salida-dc-usb-c-vs-inversor-ac-eficiencia-autonomia/"
                  )}
                  className="btn btn-glass"
                  data-magnetic
                >
                  DC/USB-C vs Enchufe AC
                </Link>
              </div>
            </div>
            <div data-reveal>
              <SolarFlowDiagramSvg />
            </div>
          </div>
        </section>

        {/* 7. Órbita Interactiva de 8 Nodos */}
        <section className="wrap py-24">
          <PowerOrbit
            items={orbit}
            center={ambient("home-paneles-solares")}
          />
        </section>

        {/* 8. Contadores Animados + Tabla Maestra Jackery vs EcoFlow vs BLUETTI */}
        <section className="relative isolate overflow-hidden bg-gradient-to-br from-[#0B1520] via-[#0f172a] to-[#0c4a6e] py-24 text-white">
          <div className="hero-aurora opacity-35" />
          <div className="wrap relative grid items-start gap-12 lg:grid-cols-[1.15fr_1fr]">
            <div>
              <span className="eyebrow !text-fxlime" data-reveal>
                Comparativa técnica por modelo
              </span>
              <SplitHeading
                text="Jackery vs EcoFlow vs BLUETTI,"
                accent={{ text: "cifra por cifra", className: "text-gradient" }}
                className="section-title mt-3"
              />
              <p className="mt-4 max-w-xl text-white/75" data-reveal>
                Contrastamos capacidad real, potencia continua y pico, peso en
                báscula, minutos de recarga AC/solar y rangos de precio en
                Amazon Estados Unidos.
              </p>
              <div className="mt-8">
                <MetricsCounters data={metrics} />
              </div>
            </div>

            <div
              className="overflow-hidden rounded-3xl bg-white p-5 text-slate-900 shadow-2xl"
              data-reveal
            >
              <p className="text-xs font-extrabold uppercase tracking-wider text-amber-800">
                Top Referentes en Amazon Estados Unidos
              </p>
              <h3 className="mt-1 font-display text-xl font-extrabold">
                Comparativa Rápida (Wh · W · Peso · Recarga · Precio)
              </h3>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 font-display font-bold">
                      <th className="p-2.5">Modelo</th>
                      <th className="p-2.5">Wh / W</th>
                      <th className="p-2.5">Peso / Carga</th>
                      <th className="p-2.5">Precio Ref.</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="p-2.5 font-bold">Jackery 300 Plus</td>
                      <td className="p-2.5">288Wh / 300W</td>
                      <td className="p-2.5">3.75 kg · 2h</td>
                      <td className="p-2.5">$199–$299</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">EcoFlow RIVER 2 Max</td>
                      <td className="p-2.5">512Wh / 500W</td>
                      <td className="p-2.5">6.0 kg · 60m</td>
                      <td className="p-2.5">$299–$399</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">EcoFlow DELTA 2</td>
                      <td className="p-2.5">1024Wh / 1800W</td>
                      <td className="p-2.5">12.0 kg · 50m</td>
                      <td className="p-2.5">$479–$699</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">Jackery 1000 v2</td>
                      <td className="p-2.5">1070Wh / 1500W</td>
                      <td className="p-2.5">10.8 kg · 1h</td>
                      <td className="p-2.5">$449–$649</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">BLUETTI AC180</td>
                      <td className="p-2.5">1152Wh / 1800W</td>
                      <td className="p-2.5">16.0 kg · 45m</td>
                      <td className="p-2.5">$459–$649</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">EcoFlow DELTA 2 Max</td>
                      <td className="p-2.5">2048Wh / 2400W</td>
                      <td className="p-2.5">23.0 kg · 1.1h</td>
                      <td className="p-2.5">$999–$1,399</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <Link
                href={safeHref(
                  "/comparativas-jackery-ecoflow-bluetti/jackery-vs-ecoflow-vs-bluetti-cual-elegir/"
                )}
                className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-[#0B1520] py-3 font-display text-xs font-extrabold text-amber-300 hover:bg-slate-800 transition"
              >
                Ver comparativa completa Jackery vs EcoFlow vs BLUETTI →
              </Link>
            </div>
          </div>
        </section>

        {/* 9. Comparador Deslizante: Camping & Viajes ↔ Cortes de Luz en Casa */}
        <section className="wrap py-24">
          <div className="mb-10 grid items-end gap-6 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <span className="eyebrow" data-reveal>
                Dos necesidades opuestas
              </span>
              <SplitHeading
                text="Camping al aire libre vs cortes de luz en casa:"
                accent={{
                  text: "qué cambia al elegir",
                  className: "text-prune",
                }}
                className="section-title mt-3"
              />
            </div>
            <p className="text-lg text-[var(--muted)]" data-reveal>
              Arrastra el selector. En{" "}
              <strong className="text-fxink">camping y viajes</strong> manda el
              peso ligero y la recarga por panel solar o alternador; en{" "}
              <strong className="text-fxink">apagones en casa</strong> mandan
              los Wh totales, la potencia pico para neveras y la respuesta UPS.
            </p>
          </div>
          <div data-reveal>
            <ScenarioSlider />
          </div>
        </section>

        {/* 10. Carrusel 4:5 de Escenarios Reales */}
        <section className="overflow-hidden bg-fxsky py-24">
          <div className="wrap">
            <div className="mb-10 max-w-2xl">
              <span className="eyebrow" data-reveal>
                Casos de uso reales
              </span>
              <SplitHeading
                text="Autonomía calculada"
                accent={{
                  text: "escenario por escenario",
                  className: "text-fxbluedeep",
                }}
                className="section-title mt-3"
              />
            </div>
            <MomentsCarousel items={moments} />
          </div>
        </section>

        {/* 11. Calculadora Interactiva de Horas (Router, Laptop, Refri Portátil) */}
        <section id="calculadora" className="wrap py-24">
          <div className="mb-10 grid items-end gap-6 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <span className="eyebrow" data-reveal>
                Simulador Interactivo en Vivo
              </span>
              <SplitHeading
                text="Calcula cuántas horas alimentará tus equipos"
                accent={{
                  text: "y elige tu estación ideal en Amazon",
                  className: "text-prune",
                }}
                className="section-title mt-3"
              />
            </div>
            <p className="text-[var(--muted)]" data-reveal>
              Marca router Wi-Fi, laptop, refrigeradora portátil o añade tus
              propios watts para ver al instante cuántas horas rinden{" "}
              <strong>Jackery, EcoFlow y BLUETTI</strong>.
            </p>
          </div>
          <div data-reveal>
            <PowerCalculator />
          </div>
        </section>

        {/* 12. Bento Grid Asimétrico de los 14 Silos + Vitrina Amazon + Lo Más Consultado */}
        <section className="bg-gradient-to-b from-white to-fxsky py-24">
          <div className="wrap">
            <div className="mb-10 max-w-2xl">
              <span className="eyebrow" data-reveal>
                1,534 Guías Sin Canibalización
              </span>
              <SplitHeading
                text="Todo organizado en"
                accent={{
                  text: "14 silos especializados",
                  className: "text-fxbluedeep",
                }}
                className="section-title mt-3"
              />
            </div>

            <div className="grid auto-rows-[minmax(185px,auto)] gap-5 md:grid-cols-2 lg:grid-cols-4">
              {cats.map((c, i) => {
                const count = getArticlesIn(c.slug).length;
                const big = i === 0;
                const wide = i === 2 || i === 4 || i === 8;
                return (
                  <Link
                    key={c.slug}
                    href={`/${c.slug}/`}
                    className={`card spot group flex flex-col p-6 ${
                      big
                        ? "spot-dark border-transparent bg-gradient-to-br from-[#0B1520] via-[#0f172a] to-[#0369a1] text-white md:col-span-2 lg:row-span-2"
                        : ""
                    } ${wide ? "lg:col-span-2" : ""}`}
                    data-reveal
                    data-reveal-delay={String(i % 4)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <span
                        className={`grid h-12 w-12 place-items-center rounded-2xl text-2xl ${
                          big ? "bg-white/15" : "bg-fxsky"
                        }`}
                        aria-hidden
                      >
                        {ICONS[c.icon] || "🔋"}
                      </span>
                      {count > 0 && (
                        <span
                          className={`text-xs font-bold uppercase tracking-wider ${
                            big ? "text-fxlime" : "text-fxbluedeep"
                          }`}
                        >
                          {count} guías
                        </span>
                      )}
                    </div>
                    <h3
                      className={`mt-4 font-display font-extrabold ${
                        big ? "text-3xl sm:text-4xl" : "text-xl"
                      }`}
                    >
                      {c.name}
                    </h3>
                    <p
                      className={`mt-2 text-sm ${
                        big ? "text-white/80" : "text-[var(--muted)]"
                      }`}
                    >
                      {c.description}
                    </p>
                    {big && (
                      <ul className="mt-6 space-y-2 text-sm text-white/85">
                        {getArticlesIn(c.slug)
                          .slice(0, 5)
                          .map((a) => (
                            <li key={a.path} className="truncate">
                              → {a.title}
                            </li>
                          ))}
                      </ul>
                    )}
                    <span
                      className={`mt-auto pt-4 text-sm font-semibold ${
                        big ? "text-fxlime" : "text-fxbluedeep"
                      }`}
                    >
                      Explorar silo →
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* Vitrina Amazon Showcase en la Home */}
            <AmazonAffiliateBox
              variant="showcase"
              sectionTitle={amzHome.sectionTitle}
              sectionSubtitle={amzHome.sectionSubtitle}
              products={amzHome.products}
              source="home-showcase"
            />

            {popular.length > 0 && (
              <div className="mt-16">
                <h3
                  className="font-display text-2xl font-extrabold sm:text-3xl"
                  data-reveal
                >
                  Las 6 guías y comparativas más consultadas
                </h3>
                <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {popular.slice(0, 6).map((a) => (
                    <div key={a.path} data-reveal>
                      <ArticleCard a={a} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 13. Transparencia Técnica vs Reclamos Comerciales */}
        <section className="wrap py-24">
          <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.2fr]">
            <div>
              <span className="eyebrow" data-reveal>
                Metodología Editorial Independiente
              </span>
              <SplitHeading
                text="Capacidad útil verificada,"
                accent={{
                  text: "sin cifras infladas de marketing",
                  className: "text-prune",
                }}
                className="section-title mt-3"
              />
              <p className="mt-5 text-lg text-[var(--muted)]" data-reveal>
                En internet abundan anuncios de baterías genéricas con cifras
                en <em>mAh</em> a 3.7V o promesas irreales de autonomía. En{" "}
                <strong className="text-fxink">
                  GuiaDeEnergiaPortatil.com
                </strong>{" "}
                traducimos todo a <strong>Wh reales útiles</strong> y verificamos
                compatibilidad de conectores. En este portal {ENERGY_DISCLAIMER}.
              </p>
              <div className="mt-7 flex flex-wrap gap-3" data-reveal>
                <Link
                  href="/politica-editorial/"
                  className="btn btn-ghost"
                  data-magnetic
                >
                  Nuestra política editorial
                </Link>
                <Link
                  href="/divulgacion-de-afiliados/"
                  className="btn btn-ghost"
                  data-magnetic
                >
                  Divulgación de afiliados Amazon
                </Link>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="card spot p-6" data-reveal>
                <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-900">
                  ✓ Lo que verificamos en cada guía
                </span>
                <ul className="mt-4 space-y-2 text-sm text-[var(--muted)]">
                  <li>• Capacidad útil en Wh y ciclos LiFePO4 reales</li>
                  <li>• Potencia continua vs picos de arranque de neveras</li>
                  <li>• Límite máximo Voc y amperios del controlador MPPT</li>
                  <li>• Cable exacto (XT60i, DC7909, DC8020, MC4)</li>
                </ul>
              </div>
              <div className="card spot p-6" data-reveal data-reveal-delay="1">
                <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900">
                  ⚠️ Errores que te ayudamos a evitar
                </span>
                <ul className="mt-4 space-y-2 text-sm text-[var(--muted)]">
                  <li>• Quemar el MPPT conectando paneles en serie sobre el Voc</li>
                  <li>• Cargar EcoFlow a 8A por usar XT60 en vez de XT60i</li>
                  <li>• Comprar estación de 300W para un microondas o secadora</li>
                  <li>• Que el router se apague por modo Eco / Auto-Timeout</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 14. Preguntas Frecuentes (FAQ JSON-LD) */}
        <section className="wrap pb-24">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
            <div>
              <span className="eyebrow" data-reveal>
                Preguntas frecuentes
              </span>
              <SplitHeading
                text="Respuestas claras antes de invertir"
                className="section-title mt-3"
              />
              <p className="mt-4 text-[var(--muted)]" data-reveal>
                ¿Tienes duda entre dos modelos o quieres confirmar si un panel
                plegable y su cable funcionan con tu estación? Pregúntale al
                Asesor IA en vivo.
              </p>
              <div className="mt-6 flex flex-wrap gap-3" data-reveal>
                <OpenChatButton
                  label="Preguntar al Asesor IA"
                  className="btn btn-buy shine"
                />
                <Link
                  href="/calculadora-de-autonomia/"
                  className="btn btn-ghost"
                >
                  Abrir Calculadora
                </Link>
              </div>
            </div>
            <div className="space-y-3">
              {FAQ.map((f) => (
                <details
                  key={f.q}
                  className="card card-static group p-5 open:shadow-lg"
                  data-reveal
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg font-bold">
                    {f.q}
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-fxsky text-fxbluedeep transition group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-[var(--muted)]">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* 15. CTA Final Aurora */}
        <section className="wrap pb-6">
          <div className="relative isolate overflow-hidden rounded-[36px] bg-gradient-to-br from-[#0B1520] via-[#0f172a] to-[#0284c7] px-6 py-14 text-white sm:px-14 sm:py-20">
            <div className="hero-grid opacity-60" />
            <div className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-fxlime/25 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-28 left-10 h-80 w-80 rounded-full bg-emerald-400/20 blur-3xl" />
            <div className="relative grid items-center gap-10 lg:grid-cols-[1.3fr_1fr]">
              <div className="text-center lg:text-left">
                <SplitHeading
                  text="Energía portátil sin cortes,"
                  accent={{
                    text: "calculada al detalle y lista en Amazon EE. UU.",
                    className: "text-fxlime",
                  }}
                  className="text-3xl font-extrabold sm:text-5xl"
                />
                <p className="mt-4 text-lg text-white/85">
                  Explora nuestras 1,534 guías de Jackery, EcoFlow y BLUETTI,
                  simula tu consumo en horas o habla con nuestro Asesor IA para
                  armar tu kit completo con panel solar y cables compatibles.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
                  <Link
                    href="/calculadora-de-autonomia/"
                    className="btn btn-lime shine text-base"
                    data-magnetic
                  >
                    ⏱️ Calcular Mis Horas Ahora
                  </Link>
                  <OpenChatButton
                    label="Hablar con el Asesor IA"
                    className="btn btn-glass text-base"
                    magnetic
                  />
                </div>
              </div>
              <div className="relative mx-auto w-full max-w-[380px]">
                <div className="relative aspect-[16/10] overflow-hidden rounded-3xl border-2 border-white/20 shadow-2xl float-y">
                  <Image
                    src={ambient("home-paneles-solares")}
                    alt="Panel solar plegable monocristalino junto a estación de energía portátil LiFePO4"
                    fill
                    sizes="380px"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <ClientEffects stickySource="home-sticky" />
    </>
  );
}
