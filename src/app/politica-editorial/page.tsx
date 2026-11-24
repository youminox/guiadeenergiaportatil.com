import type { Metadata } from "next";
import SimplePage from "@/components/SimplePage";
import {
  SITE_URL,
  LEGAL_OWNER,
  LEGAL_LOCATION,
  LEGAL_EMAIL,
} from "@/lib/content";

export const metadata: Metadata = {
  title: "Política Editorial y Metodología Técnica | GuiaDeEnergiaPortatil.com",
  description: `Criterios de ingeniería eléctrica y solar empleados por ${LEGAL_OWNER} en GuiaDeEnergiaPortatil.com.`,
  alternates: { canonical: `${SITE_URL}/politica-editorial/` },
};

export default function PoliticaEditorialPage() {
  return (
    <SimplePage
      title="Política Editorial y Metodología Técnica"
      crumb="Política editorial"
      href="/politica-editorial/"
      intro="Cómo calculamos horas reales de autonomía, verificamos límites MPPT solares y contrastamos fichas de Jackery, EcoFlow y BLUETTI."
    >
      <h2>1. Dirección editorial responsable</h2>
      <p>
        La coordinación técnica y editorial de{" "}
        <strong>GuiaDeEnergiaPortatil.com</strong> está a cargo de{" "}
        <strong>{LEGAL_OWNER}</strong> ({LEGAL_LOCATION} ·{" "}
        <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a>).
      </p>

      <h2>2. Criterios de verificación en nuestras guías</h2>
      <ul>
        <li>
          <strong>1. Capacidad útil real frente a nominal:</strong> aplicamos las
          pérdidas reales de descarga e inversor (85 % en AC + autoconsumo de
          8–16W frente a 91 % en salidas DC 12V / USB-C PD).
        </li>
        <li>
          <strong>2. Potencia continua vs pico de arranque:</strong>{" "}
          distinguimos qué motores o compresores (refrigeradoras, bombas)
          funcionan en potencia continua pura y cuáles admiten modos de
          reducción de voltaje como X-Boost o Power Lifting.
        </li>
        <li>
          <strong>3. Compatibilidad solar estricta:</strong> verificamos rangos
          de voltaje en circuito abierto (<code>Voc</code>), amperaje máximo y
          tipo de conector exacto (<code>XT60i</code> de 15A,{" "}
          <code>DC7909</code>, <code>DC8020</code> y <code>MC4</code>).
        </li>
        <li>
          <strong>4. Transparencia en peso, ruido y ciclos:</strong> separamos
          baterías <code>LiFePO4</code> (3,000–4,000 ciclos) de químicas NCM y
          comparamos portabilidad real para camping y hogar.
        </li>
      </ul>

      <h2>3. Reportar correcciones técnicas</h2>
      <p>
        Si deseas sugerir una actualización o corrección sobre un modelo
        reciente, escribe a <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a>.
      </p>
    </SimplePage>
  );
}
