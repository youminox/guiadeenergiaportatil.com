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
  title: "Divulgación de Afiliados de Amazon | GuiaDeEnergiaPortatil.com",
  description: `Declaración oficial de participación en el Programa de Afiliados de Amazon Estados Unidos (${AMAZON_TAG_US}) y España (${AMAZON_TAG_ES}).`,
  alternates: { canonical: `${SITE_URL}/divulgacion-de-afiliados/` },
};

export default function DivulgacionAfiliadosPage() {
  return (
    <SimplePage
      title="Divulgación de Afiliados de Amazon"
      crumb="Divulgación de afiliados"
      href="/divulgacion-de-afiliados/"
      intro="Transparencia completa sobre cómo financiamos nuestra calculadora de autonomía y más de 1,500 guías gratuitas en español."
    >
      <h2>1. Participación oficial en Amazon Associates</h2>
      <p>
        <strong>GuiaDeEnergiaPortatil.com</strong>, web operada por{" "}
        <strong>{LEGAL_OWNER}</strong> (domiciliado en {LEGAL_LOCATION} · email:{" "}
        <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a>), participa en el
        Programa de Afiliados de <strong>Amazon.com Services LLC</strong>{" "}
        (Estados Unidos, ID de seguimiento: <code>{AMAZON_TAG_US}</code>) y en
        el Programa de Afiliados de <strong>Amazon EU</strong> (España, ID de
        seguimiento: <code>{AMAZON_TAG_ES}</code>).
      </p>
      <p>
        <em>
          &ldquo;En calidad de Afiliado de Amazon, GuiaDeEnergiaPortatil.com
          obtiene ingresos por las compras adscritas que cumplen los requisitos
          aplicables.&rdquo;
        </em>
      </p>

      <h2>2. El precio para ti no cambia en absoluto</h2>
      <p>
        <strong>Jamás pagas un centavo extra.</strong> Los precios, cupones y
        disponibilidad que ves en Amazon Estados Unidos o Amazon España son
        idénticos a entrar directamente. La comisión publicitaria la abona
        Amazon y financia el mantenimiento de nuestra calculadora interactiva y
        del Asesor de Energía IA.
      </p>

      <h2>3. Independencia editorial en comparativas</h2>
      <p>
        Ni Jackery, ni EcoFlow, ni BLUETTI ni ningún fabricante influye en
        nuestras tablas ni en nuestras recomendaciones. Cuando un panel solar o
        cable genérico compatibilizado por MC4 ofrece igual rendimiento a menor
        precio, o cuando una estación queda corta por pico de arranque, lo
        indicamos claramente.
      </p>
    </SimplePage>
  );
}
