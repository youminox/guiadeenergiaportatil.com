import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-sync-key",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY") || "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY =
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const SITE = "https://guiadeenergiaportatil.com";
const ALLOWED_MODELS = ["gpt-4o-mini", "gpt-4o"];
const AMAZON_TAG_US = "guiadeenergiaportatil-20";
const AMAZON_TAG_ES = "guiadeenergiaportatil-21";

export interface ArticleRow {
  slug: string;
  title: string;
  category: string;
  category_name: string;
  excerpt: string | null;
  featured_image: string | null;
  read_time: string | null;
  search_text: string | null;
}

export interface ArticleCard {
  slug: string;
  title: string;
  category: string;
  categoryName: string;
  url: string;
  image: string;
  readTime: string;
  excerpt: string;
}

export interface AmazonProductCard {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  rating: string;
  reviewsCount: string;
  urlUS: string;
  urlES: string;
}

const AMAZON_PRODUCTS: Record<string, AmazonProductCard> = {
  "ecoflow-delta-2": {
    id: "ecoflow-delta-2",
    badge: "🏆 #1 Equilibrio Carga Rápida & Cortes de Luz (1024Wh · 1800W)",
    title:
      "EcoFlow DELTA 2 — Estación Portátil LiFePO4 1024Wh / 1800W (Carga 80% en 50 min)",
    subtitle:
      "3,000+ ciclos LiFePO4, 12 kg de peso, carga solar hasta 500W (conector XT60i) y conmutación EPS <30 ms para router, laptop y refrigeradora.",
    urlUS: `https://www.amazon.com/s?k=${encodeURIComponent("EcoFlow DELTA 2 Portable Power Station 1024Wh LiFePO4")}&tag=${AMAZON_TAG_US}`,
    urlES: `https://www.amazon.es/s?k=${encodeURIComponent("EcoFlow DELTA 2 estacion de energia portatil 1024Wh LiFePO4")}&tag=${AMAZON_TAG_ES}`,
  },
  "jackery-explorer-1000-v2": {
    id: "jackery-explorer-1000-v2",
    badge: "⛺ Más Ligera y Silenciosa de 1 kWh (1070Wh · 1500W · 10.8 kg)",
    title:
      "Jackery Explorer 1000 v2 — Estación Portátil LiFePO4 1070Wh / 1500W (10.8 kg)",
    subtitle:
      "4,000 ciclos LiFePO4, carga en 1 hora desde pared, ultra silenciosa (30 dB en modo quiet) y puerto USB-C PD de 100W para camping y viajes.",
    urlUS: `https://www.amazon.com/s?k=${encodeURIComponent("Jackery Explorer 1000 v2 Portable Power Station 1070Wh LiFePO4")}&tag=${AMAZON_TAG_US}`,
    urlES: `https://www.amazon.es/s?k=${encodeURIComponent("Jackery Explorer 1000 v2 estacion energia portatil LiFePO4")}&tag=${AMAZON_TAG_ES}`,
  },
  "bluetti-ac180": {
    id: "bluetti-ac180",
    badge: "⚡ Mayor Capacidad por Dólar (1152Wh · 1800W / 2700W Lifting)",
    title:
      "BLUETTI AC180 — Estación de Energía Portátil LiFePO4 1152Wh / 1800W",
    subtitle:
      "3,500+ ciclos LiFePO4, recarga AC de 1440W en ~1 hora, UPS de 20 ms y entrada solar de 500W MPPT para cortes de luz y neveras 12V/AC.",
    urlUS: `https://www.amazon.com/s?k=${encodeURIComponent("BLUETTI AC180 Portable Power Station 1152Wh LiFePO4")}&tag=${AMAZON_TAG_US}`,
    urlES: `https://www.amazon.es/s?k=${encodeURIComponent("BLUETTI AC180 estacion de energia portatil 1152Wh LiFePO4")}&tag=${AMAZON_TAG_ES}`,
  },
  "jackery-explorer-300-plus": {
    id: "jackery-explorer-300-plus",
    badge: "🎒 Ultraligera para Mochila, Router y Laptop (288Wh · 3.75 kg)",
    title:
      "Jackery Explorer 300 Plus — Estación LiFePO4 Compacta 288Wh / 300W (3.75 kg)",
    subtitle:
      "4,000 ciclos LiFePO4, doble USB-C PD 100W sin encender inversor, entrada solar DC8020 hasta 100W y tamaño de mochila.",
    urlUS: `https://www.amazon.com/s?k=${encodeURIComponent("Jackery Explorer 300 Plus Portable Power Station 288Wh LiFePO4")}&tag=${AMAZON_TAG_US}`,
    urlES: `https://www.amazon.es/s?k=${encodeURIComponent("Jackery Explorer 300 Plus estacion portatil 288Wh LiFePO4")}&tag=${AMAZON_TAG_ES}`,
  },
  "ecoflow-river-3-plus": {
    id: "ecoflow-river-3-plus",
    badge: "🖥️ Mejor UPS <10ms para Router y PC + Refrigeradora 12V (286Wh–512Wh)",
    title:
      "EcoFlow RIVER 3 Plus / RIVER 2 Max — Estación LiFePO4 Compacta UPS <10ms",
    subtitle:
      "Silencio <30 dB, protección UPS profesional <10 ms para que tu router y laptop no se reinicien en cortes de luz y carga rápida X-Stream.",
    urlUS: `https://www.amazon.com/s?k=${encodeURIComponent("EcoFlow RIVER 3 Plus RIVER 2 Max Portable Power Station LiFePO4")}&tag=${AMAZON_TAG_US}`,
    urlES: `https://www.amazon.es/s?k=${encodeURIComponent("EcoFlow RIVER 3 Plus RIVER 2 Max estacion portatil LiFePO4")}&tag=${AMAZON_TAG_ES}`,
  },
  "bluetti-eb3a": {
    id: "bluetti-eb3a",
    badge: "💵 #1 Compacta Económica LiFePO4 (268Wh · 600W)",
    title:
      "BLUETTI EB3A — Estación Compacta LiFePO4 268Wh / 600W (4.6 kg)",
    subtitle:
      "Inversor de onda pura de 600W (1200W pico), USB-C 100W, carga wireless superior y función UPS económica para router, laptops y luces.",
    urlUS: `https://www.amazon.com/s?k=${encodeURIComponent("BLUETTI EB3A Portable Power Station 268Wh 600W LiFePO4")}&tag=${AMAZON_TAG_US}`,
    urlES: `https://www.amazon.es/s?k=${encodeURIComponent("BLUETTI EB3A estacion portatil 268Wh 600W LiFePO4")}&tag=${AMAZON_TAG_ES}`,
  },
  "ecoflow-delta-2-max": {
    id: "ecoflow-delta-2-max",
    badge: "🏠 Respaldo Prolongado Hogar 2 kWh (2048Wh · 2400W · Doble Solar)",
    title:
      "EcoFlow DELTA 2 Max / BLUETTI AC200L — Estación 2048Wh LiFePO4 para Casa y Camper",
    subtitle:
      "Mantiene refrigeradora doméstica, router, laptop y microondas durante cortes largos; entrada solar dual MPPT hasta 1000W-1200W.",
    urlUS: `https://www.amazon.com/s?k=${encodeURIComponent("EcoFlow DELTA 2 Max BLUETTI AC200L 2048Wh LiFePO4 Power Station")}&tag=${AMAZON_TAG_US}`,
    urlES: `https://www.amazon.es/s?k=${encodeURIComponent("EcoFlow DELTA 2 Max BLUETTI AC200L 2048Wh LiFePO4")}&tag=${AMAZON_TAG_ES}`,
  },
  "panel-solar-plegable-200w": {
    id: "panel-solar-plegable-200w",
    badge: "☀️ Panel Solar Plegable 200W–220W IP68 Compatible Universal MC4",
    title:
      "Panel Solar Portátil Plegable 200W / 220W Bifacial (EcoFlow · Jackery SolarSaga · BLUETTI PV200)",
    subtitle:
      "Celdas monocristalinas ETFE hasta 23% eficiencia con soporte integrado, impermeable IP68 y salida MC4 lista para recargar en 4–6 h de sol.",
    urlUS: `https://www.amazon.com/s?k=${encodeURIComponent("200W Portable Foldable Solar Panel Monocrystalline MC4 EcoFlow Jackery BLUETTI")}&tag=${AMAZON_TAG_US}`,
    urlES: `https://www.amazon.es/s?k=${encodeURIComponent("panel solar portatil plegable 200W monocristalino MC4 EcoFlow Jackery BLUETTI")}&tag=${AMAZON_TAG_ES}`,
  },
  "cables-xt60i-dc8020-alternador": {
    id: "cables-xt60i-dc8020-alternador",
    badge: "🔌 Cables Solares XT60i / DC8020 / MC4 y Cargador de Alternador",
    title:
      "Cable Solar MC4 a XT60i (15A) / Adaptador DC7909 a DC8020 + Cargador Alternador 560W–800W",
    subtitle:
      "Indispensable para conectar paneles solares de terceros o cargar tu estación a máxima velocidad desde el alternador del vehículo en viaje.",
    urlUS: `https://www.amazon.com/s?k=${encodeURIComponent("MC4 to XT60i Solar Cable 10AWG DC8020 Adapter EcoFlow Alternator Charger")}&tag=${AMAZON_TAG_US}`,
    urlES: `https://www.amazon.es/s?k=${encodeURIComponent("cable solar MC4 a XT60i adaptador DC8020 cargador alternador estacion energia")}&tag=${AMAZON_TAG_ES}`,
  },
};

function calculateCostUsd(
  model: string,
  promptTokens: number,
  completionTokens: number
): number {
  if (model.includes("mini")) {
    return Number(
      (promptTokens * 0.00000015 + completionTokens * 0.0000006).toFixed(6)
    );
  }
  return Number(
    (promptTokens * 0.0000025 + completionTokens * 0.00001).toFixed(6)
  );
}

const norm = (s: string) =>
  (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const STOPWORDS = new Set([
  "como", "cual", "cuales", "que", "quien", "donde", "cuando", "por", "para",
  "con", "sin", "una", "uno", "los", "las", "del", "al", "hola", "quiero",
  "puedo", "recomienda", "mejor", "mejores", "sobre", "mas", "muy", "tiene",
  "tengo", "estacion", "estaciones", "energia", "portatil", "portatiles",
]);

function extractTokens(text: string): string[] {
  return norm(text)
    .split(" ")
    .filter((w) => w.length >= 2 && !STOPWORDS.has(w));
}

let catalogCache: {
  at: number;
  rows: ArticleRow[];
  bySlug: Map<string, ArticleRow>;
} | null = null;

async function loadCatalog(): Promise<{
  rows: ArticleRow[];
  bySlug: Map<string, ArticleRow>;
}> {
  if (
    catalogCache &&
    Date.now() - catalogCache.at < 10 * 60 * 1000 &&
    catalogCache.rows.length > 0
  ) {
    return catalogCache;
  }
  const [batch1, batch2] = await Promise.all([
    supabase
      .from("energia_portatil_articles")
      .select(
        "slug, title, category, category_name, excerpt, featured_image, read_time, search_text"
      )
      .eq("active", true)
      .range(0, 999),
    supabase
      .from("energia_portatil_articles")
      .select(
        "slug, title, category, category_name, excerpt, featured_image, read_time, search_text"
      )
      .eq("active", true)
      .range(1000, 1999),
  ]);

  const rows: ArticleRow[] = [];
  const bySlug = new Map<string, ArticleRow>();
  for (const data of [batch1.data, batch2.data]) {
    if (Array.isArray(data)) {
      for (const r of data as ArticleRow[]) {
        if (!bySlug.has(r.slug)) {
          bySlug.set(r.slug, r);
          rows.push(r);
        }
      }
    }
  }
  catalogCache = { at: Date.now(), rows, bySlug };
  return catalogCache;
}

function toArticleCard(r: ArticleRow): ArticleCard {
  const img = r.featured_image || "/img/ambiente/home-hero-energia.webp";
  const url =
    r.slug === r.category
      ? `${SITE}/${r.category}/`
      : `${SITE}/${r.category}/${r.slug}/`;
  return {
    slug: r.slug,
    title: r.title,
    category: r.category,
    categoryName: r.category_name,
    url,
    image: img.startsWith("http") ? img : `${SITE}${img}`,
    readTime: r.read_time || "7 min",
    excerpt: (r.excerpt || "").slice(0, 145),
  };
}

function searchArticles(
  rows: ArticleRow[],
  userMessage: string,
  historyText: string,
  limit = 14
): ArticleRow[] {
  const primaryTokens = extractTokens(userMessage);
  const contextTokens = extractTokens(historyText).filter(
    (t) => !primaryTokens.includes(t)
  );
  const fullPhrase = norm(userMessage);

  const starterSlugs = [
    "jackery-vs-ecoflow-vs-bluetti-cual-elegir",
    "ecoflow-delta-2-resena-capacidad-recarga-precio",
    "jackery-explorer-1000-v2-resena-camping-y-casa",
    "bluetti-ac180-resena-autonomia-y-potencia",
    "cuantas-horas-dura-estacion-1000wh-router-laptop-refrigeradora",
    "mejores-paneles-solares-plegables-jackery-ecoflow-bluetti",
  ];

  if (primaryTokens.length === 0 && contextTokens.length === 0) {
    const picked: ArticleRow[] = [];
    for (const s of starterSlugs) {
      const f = rows.find((r) => r.slug === s);
      if (f) picked.push(f);
    }
    return picked.length > 0 ? picked : rows.slice(0, 8);
  }

  const scored: Array<{ r: ArticleRow; score: number }> = [];
  for (const r of rows) {
    const titleNorm = norm(r.title);
    const catNorm = norm(`${r.category_name} ${r.category}`);
    const bodyNorm =
      r.search_text || `${titleNorm} ${catNorm} ${norm(r.excerpt || "")}`;

    let score = 0;
    if (fullPhrase.length >= 5 && titleNorm.includes(fullPhrase)) score += 45;

    let matchedPrimary = 0;
    for (const tok of primaryTokens) {
      if (titleNorm.includes(tok)) {
        score += 16;
        matchedPrimary++;
      } else if (catNorm.includes(tok)) {
        score += 9;
        matchedPrimary++;
      } else if (bodyNorm.includes(tok)) {
        score += 5;
        matchedPrimary++;
      }
    }
    if (matchedPrimary >= 2) score += matchedPrimary * 8;
    if (starterSlugs.includes(r.slug)) score += 5;

    for (const cTok of contextTokens.slice(-5)) {
      if (titleNorm.includes(cTok)) score += 3;
    }

    if (score > 0) scored.push({ r, score });
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.r);
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const json = (b: unknown, status = 200) =>
    new Response(JSON.stringify(b), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  try {
    const body =
      req.method === "POST" ? await req.json().catch(() => ({})) : {};
    const mode = body.mode || body.action || (req.method === "GET" ? "config" : "chat");

    // 0. Seed / Sync articles endpoint
    if (mode === "seed_articles" || mode === "sync_articles") {
      const syncKey = req.headers.get("x-sync-key") || "";
      if (syncKey !== "energia-portatil-sync-2026") {
        return json({ error: "No autorizado" }, 401);
      }
      const rows = Array.isArray(body.articles) ? body.articles : [];
      if (rows.length === 0) return json({ error: "Sin artículos" }, 400);
      const { error } = await supabase
        .from("energia_portatil_articles")
        .upsert(rows, { onConflict: "slug" });
      if (error) return json({ error: error.message }, 500);
      catalogCache = null;
      return json({ success: true, count: rows.length });
    }

    // 0b. Log Calculator Usage
    if (mode === "calc_log") {
      const {
        visitor_id,
        devices,
        total_watts,
        connection_mode,
        target_hours,
        recommended_model,
        estimated_hours,
        page_url,
      } = body;
      await supabase.from("energia_portatil_calc_logs").insert({
        visitor_id: String(visitor_id || "anon").slice(0, 80),
        devices: Array.isArray(devices) ? devices.slice(0, 12) : [],
        total_watts: Number(total_watts) || 0,
        connection_mode: connection_mode === "dc" ? "dc" : "ac",
        target_hours: Number(target_hours) || 8,
        recommended_model: recommended_model
          ? String(recommended_model).slice(0, 140)
          : null,
        estimated_hours: Number(estimated_hours) || 0,
        page_url: page_url ? String(page_url).slice(0, 500) : null,
      });
      return json({ success: true });
    }

    // 1. Load live config (Default: gpt-4o-mini)
    const { data: configRow } = await supabase
      .from("energia_portatil_chat_config")
      .select("*")
      .eq("id", "default")
      .maybeSingle();

    const config = configRow || {
      is_enabled: true,
      ai_model: "gpt-4o-mini",
      temperature: 0.35,
      max_messages_per_session: 30,
      daily_budget_usd: 5.0,
      welcome_message:
        "¡Hola! 🔋⚡ Soy tu Asesor de Estaciones de Energía Portátiles IA de GuiaDeEnergiaPortatil.com (modelo mini rápido). Cuéntame qué equipos quieres alimentar (router, laptop, refrigeradora portátil, CPAP), si es para camping, viajes o cortes de luz en casa, y te diré qué Jackery, EcoFlow o BLUETTI elegir junto con sus paneles solares y cables compatibles en Amazon Estados Unidos.",
      custom_instructions: "",
    };

    const activeModel = ALLOWED_MODELS.includes(config.ai_model)
      ? config.ai_model
      : "gpt-4o-mini";

    if (mode === "config" || req.method === "GET") {
      return json({
        is_enabled: config.is_enabled,
        welcome_message: config.welcome_message,
        ai_model: activeModel,
        max_messages_per_session: config.max_messages_per_session,
      });
    }

    // 2. Track click on an article or Amazon product
    if (mode === "track_click" || mode === "click") {
      const {
        session_id,
        visitor_id,
        article_slug,
        article_title,
        category,
        target_url,
        page_url,
      } = body;
      if (target_url) {
        await supabase.from("energia_portatil_chat_clicks").insert({
          session_id: session_id || null,
          visitor_id: String(visitor_id || "anon").slice(0, 80),
          article_slug: article_slug ? String(article_slug).slice(0, 180) : null,
          article_title: article_title
            ? String(article_title).slice(0, 240)
            : null,
          category: category ? String(category).slice(0, 80) : null,
          target_url: String(target_url).slice(0, 500),
          page_url: page_url ? String(page_url).slice(0, 500) : null,
        });

        if (session_id) {
          const { data: sess } = await supabase
            .from("energia_portatil_chat_sessions")
            .select("clicks_count, clicked_urls")
            .eq("id", session_id)
            .maybeSingle();
          if (sess) {
            const urls = Array.isArray(sess.clicked_urls)
              ? sess.clicked_urls
              : [];
            if (!urls.includes(target_url)) urls.push(target_url);
            await supabase
              .from("energia_portatil_chat_sessions")
              .update({
                clicks_count: (sess.clicks_count || 0) + 1,
                clicked_urls: urls,
              })
              .eq("id", session_id);
          }
        }
      }
      return json({ success: true });
    }

    // 3. Chat Completion
    if (!config.is_enabled) {
      return json({
        reply: `En este momento el Asesor de Energía Portátil IA está en mantenimiento breve. Usa nuestra [Calculadora de Autonomía en Horas](${SITE}/calculadora-de-autonomia/) o explora [GuiaDeEnergiaPortatil.com](${SITE}/).`,
        recommended_articles: [],
        recommended_products: [],
        suggested_options: [
          "Ir a la calculadora de horas",
          "Jackery vs EcoFlow vs BLUETTI",
        ],
        disabled: true,
      });
    }

    const userMessage = String(body.message || "").trim().slice(0, 1000);
    if (!userMessage) return json({ error: "Mensaje vacío" }, 400);

    const visitorId = String(
      body.visitor_id || "ep-" + crypto.randomUUID().slice(0, 8)
    ).slice(0, 80);
    const region = body.region === "ES" ? "ES" : "US";
    const storeName = region === "ES" ? "Amazon.es" : "Amazon.com";
    const pageUrl = String(body.page_url || SITE + "/").slice(0, 500);
    const userAgent = String(
      body.user_agent || req.headers.get("user-agent") || ""
    ).slice(0, 300);
    const history = Array.isArray(body.history) ? body.history.slice(-8) : [];
    let sessionId: string | null = body.session_id || null;

    let existingSession: any = null;
    if (sessionId) {
      const { data: s } = await supabase
        .from("energia_portatil_chat_sessions")
        .select("*")
        .eq("id", sessionId)
        .maybeSingle();
      existingSession = s;
    }

    if (!existingSession) {
      const { data: created, error: createErr } = await supabase
        .from("energia_portatil_chat_sessions")
        .insert({
          visitor_id: visitorId,
          page_url: pageUrl,
          user_agent: userAgent,
          first_user_message: userMessage.slice(0, 250),
          last_user_message: userMessage.slice(0, 250),
          messages_count: 1,
          model_used: activeModel,
        })
        .select("*")
        .single();

      if (!createErr && created) {
        existingSession = created;
        sessionId = created.id;
      }
    }

    if (sessionId) {
      await supabase.from("energia_portatil_chat_messages").insert({
        session_id: sessionId,
        role: "user",
        content: userMessage,
      });
    }

    const catalog = await loadCatalog();
    const recentHistoryText = history
      .slice(-3)
      .map((h: any) => h?.content || "")
      .join(" ");
    const candidateRows = searchArticles(
      catalog.rows,
      userMessage,
      recentHistoryText,
      14
    );

    const candidatesPrompt =
      candidateRows.length > 0
        ? candidateRows
            .map((r) => {
              const u =
                r.slug === r.category
                  ? `${SITE}/${r.category}/`
                  : `${SITE}/${r.category}/${r.slug}/`;
              return `- SLUG: "${r.slug}" | TÍTULO: "${r.title}" | CATEGORÍA: ${r.category_name} | URL: ${u} | RESUMEN: ${(r.excerpt || "").slice(0, 140)}`;
            })
            .join("\n")
        : "No se encontraron artículos exactos con esos términos.";

    const amazonCatalogPrompt = Object.values(AMAZON_PRODUCTS)
      .map(
        (p) =>
          `- PRODUCT_ID: "${p.id}" | ${p.badge} | NOMBRE: "${p.title}" | DETALLE: ${p.subtitle} | URL_${region}: ${region === "ES" ? p.urlES : p.urlUS}`
      )
      .join("\n");

    const extraInstructions = config.custom_instructions
      ? `\nINSTRUCCIONES ADICIONALES DEL ADMINISTRADOR:\n${config.custom_instructions}\n`
      : "";

    const systemPrompt = `Eres el Asesor Oficial de Estaciones de Energía Portátiles IA de GuiaDeEnergiaPortatil.com (${SITE}), portal en español creado por Carlos Lingan Borja (info@charlielingan.com) con más de 1,500 guías sobre Jackery, EcoFlow y BLUETTI para camping, viajes y cortes de luz en casa.

Tu doble misión es:
1. RESPONDER CON PRECISIÓN TÉCNICA Y CÁLCULOS REALES DE AUTONOMÍA EN HORAS:
   - Fórmula real de autonomía:
     * Salida DC 12V / USB-C PD directo: Capacidad (Wh) × 0.85 ÷ Consumo (W) (aprovecha mejor la batería al no encender el inversor AC).
     * Salida AC 120V (inversor): Capacidad (Wh) × 0.85 ÷ (Consumo (W) + 10W autoconsumo del inversor).
   - Consumos de referencia habituales:
     * Router Wi-Fi + ONT Fibra (~15 W): en 300Wh dura ~17 h; en 1000Wh dura ~45-55 h (o >55 h por DC).
     * Laptop trabajo remoto (~55 W): en 300Wh dura ~4.5 h; en 1000Wh dura ~15-17 h por USB-C PD.
     * Refrigeradora portátil 12V de compresor (~45 W cuando comprime, ~18 W promedio ciclado): en 512Wh dura ~22-25 h; en 1024Wh dura ~45-52 h.
     * Refrigeradora doméstica de casa (~130 W promedio ciclado, pico 800W): requiere mínimo una 1024Wh-2048Wh (1500W-2400W continuos) para 6-14 horas.
   - Compara con objetividad Jackery (ligeras, silencio 30dB, conector solar DC7909/DC8020), EcoFlow (recarga AC ultrarrápida 50 min, UPS <10-30ms, entrada XT60i hasta 15A) y BLUETTI (mayor Wh por dólar, Power Lifting, MPPT alto voltaje).
   - Recuerda advertir sobre límites Voc de paneles solares y compatibilidad de cables (MC4 a XT60i en EcoFlow, DC8020 en Jackery Plus/v2).
   - Invita también a probar la calculadora interactiva en [Calculadora de Autonomía](${SITE}/calculadora-de-autonomia/) cuando calcule horas, y enlaza 1 a 3 guías reales del listado inferior usando Markdown exacto: [Título](URL) e incluye sus slugs en "recommended_slugs".
2. AYUDAR ACTIVAMENTE A COMPRAR EN AMAZON (${storeName}):
   - Recomienda siempre 1 o 2 productos exactos de nuestro CATÁLOGO AMAZON OFICIAL (por ejemplo, la estación ideal + el panel solar plegable o cable compatible).
   - Incluye en tu texto un enlace Markdown directo al producto en ${storeName} usando su URL_${region} exacta y añade 1 o 2 IDs en "recommended_product_ids".${extraInstructions}

CATÁLOGO AMAZON OFICIAL (${storeName}):
${amazonCatalogPrompt}

ARTÍCULOS ENCONTRADOS EN GUIADEENERGIAPORTATIL.COM:
${candidatesPrompt}

Responde ÚNICAMENTE con un objeto JSON válido con estas 4 llaves exactas:
{
  "reply": "Tu respuesta experta y clara en español con horas estimadas, comparativa práctica, panel/cable compatible y enlaces Markdown a nuestras guías y a ${storeName}",
  "recommended_slugs": ["slug-1", "slug-2"],
  "recommended_product_ids": ["ecoflow-delta-2", "panel-solar-plegable-200w"],
  "suggested_options": ["Opción 1", "Opción 2", "Opción 3"]
}`;

    const chatMessages: any[] = [{ role: "system", content: systemPrompt }];
    for (const h of history) {
      if (
        h &&
        (h.role === "user" || h.role === "assistant") &&
        typeof h.content === "string"
      ) {
        chatMessages.push({ role: h.role, content: h.content.slice(0, 1200) });
      }
    }
    chatMessages.push({ role: "user", content: userMessage });

    const openaiRes = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: activeModel,
          messages: chatMessages,
          temperature: Number(config.temperature) || 0.35,
          max_tokens: 950,
          response_format: { type: "json_object" },
        }),
      }
    );

    if (!openaiRes.ok) {
      throw new Error("OpenAI status " + openaiRes.status);
    }

    const openaiData = await openaiRes.json();
    const rawContent = openaiData.choices?.[0]?.message?.content || "{}";
    let parsed: any = {};
    try {
      parsed = JSON.parse(rawContent);
    } catch {
      parsed = {
        reply: rawContent,
        recommended_slugs: candidateRows.slice(0, 2).map((r) => r.slug),
        recommended_product_ids: ["ecoflow-delta-2", "panel-solar-plegable-200w"],
        suggested_options: [
          "¿Cuántas horas dura 1000Wh con router, laptop y refri 12V?",
          "Jackery Explorer 1000 v2 vs EcoFlow DELTA 2 vs BLUETTI AC180",
          "¿Qué panel solar y cable compatible compro?",
        ],
      };
    }

    const slugs: string[] = Array.isArray(parsed.recommended_slugs)
      ? parsed.recommended_slugs.slice(0, 3)
      : [];
    const recommendedArticles: ArticleCard[] = slugs
      .map((s) => catalog.bySlug.get(s))
      .filter((r): r is ArticleRow => Boolean(r))
      .map(toArticleCard);

    const productIds: string[] = Array.isArray(parsed.recommended_product_ids)
      ? parsed.recommended_product_ids.slice(0, 2)
      : ["ecoflow-delta-2"];
    const recommendedProducts: AmazonProductCard[] = productIds
      .map((id) => AMAZON_PRODUCTS[id])
      .filter((p): p is AmazonProductCard => Boolean(p));

    const suggestedOptions: string[] = Array.isArray(parsed.suggested_options)
      ? parsed.suggested_options
          .slice(0, 3)
          .map((s: unknown) => String(s).slice(0, 72))
      : [];

    const replyText: string =
      parsed.reply ||
      `Te recomiendo probar nuestra [Calculadora de Autonomía en Horas](${SITE}/calculadora-de-autonomia/) o revisar [Jackery vs EcoFlow vs BLUETTI](${SITE}/comparativas-jackery-ecoflow-bluetti/jackery-vs-ecoflow-vs-bluetti-cual-elegir/).`;

    const promptTokens = openaiData.usage?.prompt_tokens || 0;
    const completionTokens = openaiData.usage?.completion_tokens || 0;
    const totalTokens =
      openaiData.usage?.total_tokens || promptTokens + completionTokens;
    const costUsd = calculateCostUsd(
      activeModel,
      promptTokens,
      completionTokens
    );

    if (sessionId && existingSession) {
      await supabase.from("energia_portatil_chat_messages").insert({
        session_id: sessionId,
        role: "assistant",
        content: replyText,
        recommended_articles: recommendedArticles,
        suggested_options: suggestedOptions,
        model: activeModel,
        prompt_tokens: promptTokens,
        completion_tokens: completionTokens,
        total_tokens: totalTokens,
        cost_usd: costUsd,
      });

      const prevRecs: string[] = Array.isArray(
        existingSession.recommended_articles
      )
        ? existingSession.recommended_articles
        : [];
      for (const ra of recommendedArticles) {
        if (!prevRecs.includes(ra.title)) prevRecs.push(ra.title);
      }
      for (const rp of recommendedProducts) {
        const label = `[Amazon] ${rp.title}`;
        if (!prevRecs.includes(label)) prevRecs.push(label);
      }

      await supabase
        .from("energia_portatil_chat_sessions")
        .update({
          last_user_message: userMessage.slice(0, 250),
          messages_count: (existingSession.messages_count || 1) + 2,
          recommended_articles: prevRecs.slice(0, 30),
          prompt_tokens: (existingSession.prompt_tokens || 0) + promptTokens,
          completion_tokens:
            (existingSession.completion_tokens || 0) + completionTokens,
          total_tokens: (existingSession.total_tokens || 0) + totalTokens,
          estimated_cost_usd: Number(
            (Number(existingSession.estimated_cost_usd || 0) + costUsd).toFixed(
              6
            )
          ),
          model_used: activeModel,
          last_message_at: new Date().toISOString(),
        })
        .eq("id", sessionId);
    }

    await supabase.from("token_usage").insert({
      source: "guiadeenergiaportatil.com",
      content_type: "ai_chat",
      model: activeModel,
      prompt_tokens: promptTokens,
      completion_tokens: completionTokens,
      total_tokens: totalTokens,
      images_generated: 0,
      estimated_cost_usd: costUsd,
      slug: sessionId || visitorId,
    });

    return json({
      session_id: sessionId,
      reply: replyText,
      recommended_articles: recommendedArticles,
      recommended_products: recommendedProducts,
      suggested_options: suggestedOptions,
      model: activeModel,
    });
  } catch (err: any) {
    return json(
      {
        error: err.message || "Error interno",
        reply: `Puedes calcular cuántas horas dura tu equipo en nuestra [Calculadora de Autonomía](${SITE}/calculadora-de-autonomia/) o explorar nuestras guías en [GuiaDeEnergiaPortatil.com](${SITE}/).`,
        recommended_articles: [],
        recommended_products: [],
        suggested_options: ["Intentar de nuevo"],
      },
      500
    );
  }
});
