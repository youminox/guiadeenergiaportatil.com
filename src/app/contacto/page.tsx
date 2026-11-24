import type { Metadata } from "next";
import Link from "next/link";
import SimplePage from "@/components/SimplePage";
import OpenChatButton from "@/components/OpenChatButton";
import {
  SITE_URL,
  LEGAL_OWNER,
  LEGAL_LOCATION,
  LEGAL_EMAIL,
} from "@/lib/content";

export const metadata: Metadata = {
  title: "Contacto Oficial | GuiaDeEnergiaPortatil.com",
  description: `Contacta con ${LEGAL_OWNER} (${LEGAL_LOCATION}) en ${LEGAL_EMAIL} o usa nuestra calculadora y Asesor de Energía IA.`,
  alternates: { canonical: `${SITE_URL}/contacto/` },
};

export default function ContactoPage() {
  return (
    <SimplePage
      title="Contacto"
      crumb="Contacto"
      href="/contacto/"
      intro="Estamos a tu disposición para consultas editoriales, sugerencias de modelos o dudas sobre compatibilidad solar y autonomía."
    >
      <h2>1. Datos oficiales de contacto</h2>
      <ul>
        <li>
          <strong>Titular responsable:</strong> {LEGAL_OWNER}
        </li>
        <li>
          <strong>Domicilio:</strong> {LEGAL_LOCATION}
        </li>
        <li>
          <strong>Correo electrónico:</strong>{" "}
          <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a>
        </li>
      </ul>

      <h2>2. Asesoría instantánea y cálculo de autonomía</h2>
      <p>
        Si necesitas calcular cuántas horas alimentará un modelo específico a tu
        router, laptop o refrigeradora portátil, o confirmar qué panel solar
        plegable y cable comprar hoy en Amazon Estados Unidos, puedes usar
        nuestras herramientas gratuitas las 24 horas:
      </p>
      <div className="my-6 flex flex-wrap gap-3">
        <OpenChatButton
          label="Abrir Asesor de Energía IA"
          className="btn btn-buy shine"
        />
        <Link href="/calculadora-de-autonomia/" className="btn btn-lime">
          ⏱️ Abrir Calculadora de Horas
        </Link>
      </div>
    </SimplePage>
  );
}
