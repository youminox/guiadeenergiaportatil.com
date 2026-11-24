import type { Metadata } from "next";
import SimplePage from "@/components/SimplePage";
import {
  SITE_URL,
  LEGAL_OWNER,
  LEGAL_LOCATION,
  LEGAL_EMAIL,
} from "@/lib/content";

export const metadata: Metadata = {
  title: "Política de Privacidad | GuiaDeEnergiaPortatil.com",
  description: `Política de privacidad y protección de datos personales de GuiaDeEnergiaPortatil.com, gestionado por ${LEGAL_OWNER} (${LEGAL_LOCATION}).`,
  alternates: { canonical: `${SITE_URL}/politica-de-privacidad/` },
};

export default function PrivacidadPage() {
  return (
    <SimplePage
      title="Política de Privacidad"
      crumb="Política de privacidad"
      href="/politica-de-privacidad/"
      intro="Cómo protegemos y tratamos la información técnica, simulaciones y consultas enviadas en GuiaDeEnergiaPortatil.com."
    >
      <h2>1. Responsable del tratamiento de datos</h2>
      <ul>
        <li>
          <strong>Titular y Responsable:</strong> {LEGAL_OWNER}
        </li>
        <li>
          <strong>Domicilio:</strong> {LEGAL_LOCATION}
        </li>
        <li>
          <strong>Correo electrónico para ejercicio de derechos:</strong>{" "}
          <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a>
        </li>
      </ul>

      <h2>2. Qué datos recopilamos y finalidad</h2>
      <p>
        GuiaDeEnergiaPortatil.com no requiere crear cuentas ni solicita datos
        bancarios. Solo procesamos los siguientes datos técnicos mínimos:
      </p>
      <ul>
        <li>
          <strong>Consultas en el Asesor de Energía IA:</strong> los mensajes
          enviados voluntariamente al chat, junto con un identificador anónimo
          de sesión y la URL de origen, se emplean para responder tus preguntas
          sobre autonomía, estaciones portátiles y paneles solares compatibles.
          Evita ingresar datos personales sensibles en el chat.
        </li>
        <li>
          <strong>Simulaciones en la Calculadora de Horas:</strong> registros
          anónimos de watts y tiempos solicitados para mejorar nuestras tablas de
          rendimiento.
        </li>
        <li>
          <strong>Comunicaciones por correo:</strong> si escribes a{" "}
          <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a>, tus datos se
          usan únicamente para responder tu solicitud.
        </li>
      </ul>

      <h2>3. Normativa aplicable y derechos</h2>
      <p>
        Cumplimos con los principios de la Ley N.º 29733 (Ley de Protección de
        Datos Personales del Perú), el RGPD europeo y leyes estatales de
        privacidad de EE. UU. (CCPA/CPRA). Puedes ejercer tus derechos de
        acceso, rectificación, cancelación u oposición escribiendo a{" "}
        <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a>.
      </p>
    </SimplePage>
  );
}
