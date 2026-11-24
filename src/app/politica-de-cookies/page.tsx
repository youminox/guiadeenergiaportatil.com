import type { Metadata } from "next";
import SimplePage from "@/components/SimplePage";
import {
  SITE_URL,
  LEGAL_OWNER,
  LEGAL_LOCATION,
  LEGAL_EMAIL,
} from "@/lib/content";

export const metadata: Metadata = {
  title: "Política de Cookies | GuiaDeEnergiaPortatil.com",
  description: `Uso de almacenamiento local técnico y cookies de terceros en GuiaDeEnergiaPortatil.com (${LEGAL_OWNER}, ${LEGAL_LOCATION}).`,
  alternates: { canonical: `${SITE_URL}/politica-de-cookies/` },
};

export default function CookiesPage() {
  return (
    <SimplePage
      title="Política de Cookies"
      crumb="Política de cookies"
      href="/politica-de-cookies/"
      intro="Detalle claro sobre el uso de almacenamiento local técnico, Google AdSense y cookies de atribución de Amazon en GuiaDeEnergiaPortatil.com."
    >
      <h2>1. Almacenamiento técnico propio</h2>
      <p>
        GuiaDeEnergiaPortatil.com utiliza claves ligeras en{" "}
        <code>localStorage</code> y <code>sessionStorage</code> exclusivamente
        para recordar tu tienda Amazon preferida (<code>ep_amazon_region</code>:
        Amazon.com EE. UU. o Amazon.es España) y conservar el historial reciente
        del Asesor de Energía IA (<code>ep_chat_session</code> y{" "}
        <code>ep_chat_messages</code>).
      </p>

      <h2>2. Cookies de terceros (Amazon y Google)</h2>
      <ul>
        <li>
          <strong>Amazon Associates:</strong> cuando pulsas un enlace hacia{" "}
          <code>amazon.com</code> o <code>amazon.es</code>, Amazon establece
          sus propias cookies en su plataforma para atribuir las compras
          adscritas conforme al acuerdo operativo vigente.
        </li>
        <li>
          <strong>Google AdSense:</strong> este sitio puede mostrar publicidad
          de Google que emplea cookies de medición y personalización según la
          configuración de tu navegador.
        </li>
      </ul>

      <h2>3. Gestión de cookies</h2>
      <p>
        Puedes eliminar las cookies y el almacenamiento local en la
        configuración de privacidad de tu navegador en cualquier momento. Para
        consultas escribe a <strong>{LEGAL_OWNER}</strong> ({LEGAL_LOCATION}) en{" "}
        <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a>.
      </p>
    </SimplePage>
  );
}
