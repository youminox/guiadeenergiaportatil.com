import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs, { JsonLd } from "@/components/Breadcrumbs";
import PowerCalculator from "@/components/PowerCalculator";
import AmazonAffiliateBox from "@/components/AmazonAffiliateBox";
import ClientEffects from "@/components/ClientEffects";
import OpenChatButton from "@/components/OpenChatButton";
import { getContextualAmazonProducts } from "@/lib/amazon";
import { SITE_URL, OG_DEFAULT, absolute } from "@/lib/content";

export const metadata: Metadata = {
  title:
    "Calculadora de Autonomía en Horas (Router, Laptop, Refrigeradora) | GuiaDeEnergiaPortatil.com",
  description:
    "Calcula cuántas horas alimenta una estación portátil Jackery, EcoFlow o BLUETTI a un router Wi-Fi, laptop, refrigeradora portátil o CPAP. Compara Wh, potencia, peso y precios en Amazon EE. UU.",
  alternates: { canonical: `${SITE_URL}/calculadora-de-autonomia/` },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/calculadora-de-autonomia/`,
    title: "Calculadora de Autonomía de Estaciones de Energía Portátiles",
    description:
      "Simula en vivo cuántas horas dura tu router, laptop o nevera portátil con Jackery, EcoFlow y BLUETTI.",
    images: [
      {
        url: absolute(OG_DEFAULT()),
        width: 1200,
        height: 675,
        alt: "Calculadora de horas de autonomía de energía portátil",
      },
    ],
  },
};

const CALC_FAQS = [
  {
    q: "¿Por qué la calculadora aplica un 85 % en salidas AC y un 91 % en salidas USB-C / 12V DC?",
    a: "Ninguna estación portátil entrega el 100 % de sus Wh nominales por el enchufe de pared (AC 120V): el inversor consume entre 8W y 18W propios solo por estar encendido y convierte corriente continua a alterna con un 85 % de rendimiento neto. En cambio, alimentar un router o laptop directo por USB-C PD o 12V DC evita esa doble conversión y aprovecha cerca del 91 % útil.",
  },
  {
    q: "¿Por qué una refrigeradora portátil 12V figura con 18 W promedio si su ficha dice 45 W?",
    a: "Las refrigeradoras portátiles con compresor (como BougeRV o ICECO) consumen ~45 W únicamente mientras el compresor enfría activamente. Una vez alcanzada la temperatura interior, el termostato detiene el compresor y el ciclo medio real de trabajo ronda el 35–42 % (unos 15–20 Wh cada hora).",
  },
  {
    q: "¿Qué estación necesito si quiero mantener router + laptop + refrigeradora portátil 24 horas?",
    a: "Esos tres equipos suman ~88 W continuos si la laptop está encendida todo el tiempo (unos 2,100Wh en 24h) o ~45–55 W promedio si la laptop carga 5–6 horas al día (~1,200Wh en 24h). Con una EcoFlow DELTA 2 (1024Wh), Jackery 1000 v2 (1070Wh) o BLUETTI AC180 (1152Wh) más un panel solar plegable de 200W cubres ese día completo y recargas al día siguiente.",
  },
];

export default function CalculadoraPage() {
  const amz = getContextualAmazonProducts(
    "calculadora-autonomia",
    "autonomia-consumo-y-calculo-de-horas",
    "Estaciones Recomendadas + Paneles y Cables Compatibles"
  );

  return (
    <>
      <Header />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebApplication",
              name: "Calculadora de Autonomía para Estaciones de Energía Portátiles",
              url: `${SITE_URL}/calculadora-de-autonomia/`,
              applicationCategory: "UtilitiesApplication",
              operatingSystem: "All",
              inLanguage: "es",
              offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            },
            {
              "@type": "FAQPage",
              mainEntity: CALC_FAQS.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            },
          ],
        }}
      />
      <main className="pt-[68px]">
        <section className="relative overflow-hidden bg-gradient-to-b from-[#0B1520] via-[#0f172a] to-white pb-16 pt-12 text-white">
          <div className="hero-grid opacity-55" />
          <div className="wrap relative">
            <Breadcrumbs
              dark
              items={[
                {
                  name: "Calculadora de Autonomía",
                  href: "/calculadora-de-autonomia/",
                },
              ]}
            />
            <div className="mt-6 max-w-3xl">
              <span className="chip">
                ⏱️ Simulador Real DC vs AC · Jackery · EcoFlow · BLUETTI
              </span>
              <h1 className="mt-4 font-display text-3xl font-extrabold sm:text-5xl">
                Calculadora de Autonomía en Horas:{" "}
                <span className="text-fxlime">
                  Router, Laptop y Refrigeradora Portátil
                </span>
              </h1>
              <p className="mt-4 text-base sm:text-lg text-white/80">
                Selecciona los aparatos que necesitas alimentar en camping,
                viajes o durante un corte de luz en casa. Calculamos las horas
                reales descontando el autoconsumo del inversor y te mostramos el
                panel solar y cable compatible en Amazon Estados Unidos.
              </p>
            </div>
          </div>
        </section>

        <section className="wrap -mt-8 relative z-10 pb-14">
          <PowerCalculator />
        </section>

        <section className="wrap pb-10">
          <AmazonAffiliateBox
            variant="showcase"
            sectionTitle={amz.sectionTitle}
            sectionSubtitle={amz.sectionSubtitle}
            products={amz.products}
            source="calculator-page"
          />
        </section>

        <section className="wrap max-w-4xl pb-20">
          <div className="rounded-3xl border border-[var(--line)] bg-fxsky/60 p-6 sm:p-8">
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-fxink">
              Cómo interpreta nuestra calculadora las horas reales
            </h2>
            <div className="mt-4 space-y-3 text-sm sm:text-base text-slate-700 leading-relaxed">
              <p>
                La fórmula aplicada sigue los ensayos reales de banco de prueba:{" "}
                <strong>
                  Horas = (Capacidad Wh × 0.94 DoD × Eficiencia) ÷ (Watts Carga +
                  Autoconsumo Inversor)
                </strong>
                .
              </p>
              <p>
                Para profundizar en escenarios específicos revisa nuestras guías
                técnicas de{" "}
                <Link
                  href="/autonomia-consumo-y-calculo-de-horas/"
                  className="font-bold text-fxbluedeep underline"
                >
                  Cálculo de Horas y Autonomía Real
                </Link>
                ,{" "}
                <Link
                  href="/cortes-de-luz-y-respaldo-en-casa/"
                  className="font-bold text-fxbluedeep underline"
                >
                  Cortes de Luz y Respaldo en Casa
                </Link>{" "}
                y{" "}
                <Link
                  href="/compatibilidad-solar-mppt-y-carga/"
                  className="font-bold text-fxbluedeep underline"
                >
                  Compatibilidad Solar MPPT
                </Link>
                .
              </p>
            </div>

            <div className="mt-8 space-y-3">
              {CALC_FAQS.map((f) => (
                <details key={f.q} className="card card-static p-5">
                  <summary className="cursor-pointer font-display font-bold text-fxink">
                    {f.q}
                  </summary>
                  <p className="mt-2.5 text-sm text-slate-600">{f.a}</p>
                </details>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-[#0B1520] p-5 text-white">
              <div>
                <p className="font-display font-bold text-lg">
                  ¿Necesitas que calculemos un kit completo con tus electrodomésticos?
                </p>
                <p className="text-xs text-white/75">
                  Pregunta directo al Asesor IA con tus equipos y horas exactas.
                </p>
              </div>
              <OpenChatButton
                label="Calcular con Asesor IA"
                className="btn btn-lime shine text-sm"
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <ClientEffects stickySource="calculator-sticky" />
    </>
  );
}
