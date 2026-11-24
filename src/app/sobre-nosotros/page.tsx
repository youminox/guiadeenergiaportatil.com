import type { Metadata } from "next";
import SimplePage from "@/components/SimplePage";
import {
  SITE_URL,
  LEGAL_OWNER,
  LEGAL_LOCATION,
  LEGAL_EMAIL,
} from "@/lib/content";

export const metadata: Metadata = {
  title: "Sobre Nosotros | GuiaDeEnergiaPortatil.com",
  description: `Conoce el propósito editorial de GuiaDeEnergiaPortatil.com, creado por ${LEGAL_OWNER} en ${LEGAL_LOCATION} (${LEGAL_EMAIL}).`,
  alternates: { canonical: `${SITE_URL}/sobre-nosotros/` },
};

export default function SobreNosotrosPage() {
  return (
    <SimplePage
      title="Sobre GuiaDeEnergiaPortatil.com"
      crumb="Sobre nosotros"
      href="/sobre-nosotros/"
      intro="La guía en español creada para elegir estaciones de energía portátiles, calcular horas reales y combinar paneles solares y cables compatibles sin errores."
    >
      <h2>¿Por qué creamos GuiaDeEnergiaPortatil.com?</h2>
      <p>
        Comprar una estación de energía portátil para camping, viajes en ruta o
        cortes de luz en casa suele generar dudas difíciles de responder en las
        fichas comerciales: ¿cuántas horas alimenta realmente un router Wi-Fi,
        una laptop o una refrigeradora portátil?, ¿en qué se diferencia una{" "}
        <strong>Jackery</strong> de una <strong>EcoFlow</strong> o una{" "}
        <strong>BLUETTI</strong>?, ¿qué panel solar plegable y qué cable{" "}
        <code>XT60i</code> o <code>DC8020</code> le sirven sin quemar el
        controlador?
      </p>
      <p>
        En <strong>GuiaDeEnergiaPortatil.com</strong> unimos{" "}
        <strong>1,534 guías especializadas</strong>, una calculadora interactiva
        de autonomía y fichas comparativas enlazadas a Amazon Estados Unidos
        para consultar precios y disponibilidad al instante.
      </p>

      <h2>Titularidad y contacto</h2>
      <ul>
        <li>
          <strong>Titular de la web:</strong> {LEGAL_OWNER}
        </li>
        <li>
          <strong>Domicilio:</strong> {LEGAL_LOCATION}
        </li>
        <li>
          <strong>Correo electrónico oficial:</strong>{" "}
          <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a>
        </li>
      </ul>
    </SimplePage>
  );
}
