import type { Metadata } from "next";
import SimplePage from "@/components/SimplePage";
import {
  SITE_URL,
  LEGAL_OWNER,
  LEGAL_LOCATION,
  LEGAL_EMAIL,
} from "@/lib/content";
import { AMAZON_TAG_US, AMAZON_TAG_ES } from "@/lib/amazon";

export const metadata: Metadata = {
  title: "Aviso Legal y Condiciones de Uso | GuiaDeEnergiaPortatil.com",
  description: `Información legal oficial de GuiaDeEnergiaPortatil.com, titularidad de ${LEGAL_OWNER}, domiciliado en ${LEGAL_LOCATION} (${LEGAL_EMAIL}).`,
  alternates: { canonical: `${SITE_URL}/aviso-legal/` },
};

export default function AvisoLegalPage() {
  return (
    <SimplePage
      title="Aviso Legal y Condiciones de Uso"
      crumb="Aviso legal"
      href="/aviso-legal/"
      intro="Identificación oficial del responsable de GuiaDeEnergiaPortatil.com, condiciones generales de acceso, propiedad intelectual y seguridad eléctrica."
    >
      <h2>1. Datos identificativos del titular</h2>
      <p>
        En cumplimiento del deber de transparencia informativa aplicable a
        servicios digitales, se informa que el sitio web{" "}
        <strong>https://guiadeenergiaportatil.com</strong> (en adelante,{" "}
        <strong>GuiaDeEnergiaPortatil.com</strong>) es propiedad y está operado
        por:
      </p>
      <ul>
        <li>
          <strong>Titular responsable:</strong> {LEGAL_OWNER}
        </li>
        <li>
          <strong>Domicilio legal:</strong> {LEGAL_LOCATION}
        </li>
        <li>
          <strong>Correo electrónico oficial de contacto:</strong>{" "}
          <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a>
        </li>
      </ul>

      <h2>2. Objeto y naturaleza informativa del portal</h2>
      <p>
        GuiaDeEnergiaPortatil.com es una guía especializada en español para
        elegir estaciones de energía portátiles para camping, viajes y cortes de
        luz en casa, comparando marcas líderes como Jackery, EcoFlow y BLUETTI
        según su capacidad (Wh), potencia (W), peso, tiempo de recarga y precio,
        junto con una calculadora de horas de autonomía y recomendaciones de
        paneles solares plegables, cargadores y cables compatibles en Amazon
        Estados Unidos.
      </p>

      <h2>3. Propiedad intelectual y marcas registradas</h2>
      <p>
        Los textos, comparativas, diseño, tablas y código de la calculadora están
        protegidos por derechos de autor a favor de {LEGAL_OWNER}. Todas las
        marcas comerciales mencionadas con fines estrictamente informativos y de
        compatibilidad (Amazon, Jackery, EcoFlow, BLUETTI, Anker SOLIX, Renogy,
        BougeRV, entre otras) pertenecen a sus legítimos propietarios.
      </p>

      <h2>4. Enlaces de afiliación a Amazon</h2>
      <p>
        GuiaDeEnergiaPortatil.com participa en el Programa de Afiliados de
        Amazon.com Associates (ID de seguimiento: <strong>{AMAZON_TAG_US}</strong>)
        y en el Programa de Afiliados de Amazon EU (ID de seguimiento:{" "}
        <strong>{AMAZON_TAG_ES}</strong>). Al hacer clic en enlaces hacia Amazon
        y realizar compras adscritas, el titular recibe una comisión sin ningún
        costo adicional para el usuario.
      </p>

      <h2>5. Seguridad eléctrica y limitación de responsabilidad</h2>
      <p>
        Las horas de autonomía calculadas son estimaciones técnicas sujetas a
        temperatura ambiente, edad de la batería y ciclo real de cada aparato.
        Nunca superes el voltaje máximo de entrada solar (Voc) indicado en la
        etiqueta MPPT de tu estación, nunca conectes cables macho-macho a un
        tomacorriente de pared y utiliza switches de transferencia certificados
        instalados por un electricista autorizado.
      </p>
    </SimplePage>
  );
}
