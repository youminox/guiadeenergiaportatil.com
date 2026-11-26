export const AMAZON_TAG_US = "guiadeenergiaportatil-20";
export const AMAZON_TAG_ES = "guiadeenergiaportatil-21";

export type AmazonStoreRegion = "US" | "ES";

export type AmazonCategoryType =
  | "power-station"
  | "solar-panel"
  | "charger-battery"
  | "cable-adapter"
  | "fridge-accessory";

export interface AmazonProductRecommendation {
  id: string;
  brand: "Jackery" | "EcoFlow" | "BLUETTI" | "Anker" | "Universal";
  badge: string;
  title: string;
  subtitle: string;
  features: string[];
  categoryType: AmazonCategoryType;
  specs?: {
    capacityWh: string;
    powerW: string;
    weightAndRecharge: string;
    budgetRange: string;
    compatibleSolarCable: string;
  };
  asinUS?: string;
  asinES?: string;
  queryUS: string;
  queryES: string;
  ctaLabel: string;
}

export function buildAmazonUrl(
  product: AmazonProductRecommendation,
  region: AmazonStoreRegion
): string {
  if (region === "ES") {
    if (product.asinES) {
      return `https://www.amazon.es/dp/${product.asinES}?tag=${AMAZON_TAG_ES}`;
    }
    const q = encodeURIComponent(product.queryES);
    return `https://www.amazon.es/s?k=${q}&tag=${AMAZON_TAG_ES}`;
  }

  if (product.asinUS) {
    return `https://www.amazon.com/dp/${product.asinUS}?tag=${AMAZON_TAG_US}`;
  }
  const q = encodeURIComponent(product.queryUS);
  return `https://www.amazon.com/s?k=${q}&tag=${AMAZON_TAG_US}`;
}

export function detectUserAmazonRegion(): AmazonStoreRegion {
  if (typeof window === "undefined") {
    return "US";
  }
  try {
    const saved = window.localStorage.getItem("ep_amazon_region");
    if (saved === "US" || saved === "ES") return saved;
  } catch {
    // ignore
  }
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    const lang = (navigator.language || "").toLowerCase();
    if (
      tz === "Europe/Madrid" ||
      tz === "Atlantic/Canary" ||
      tz === "Europe/Ceuta" ||
      tz.startsWith("Europe/") ||
      lang === "es-es"
    ) {
      return "ES";
    }
    return "US";
  } catch {
    return "US";
  }
}

export const CATALOG: Record<string, AmazonProductRecommendation> = {
  // === ESTACIONES ~1000Wh (EQUILIBRIO CAMPING + CORTES DE LUZ) ===
  ECOFLOW_DELTA_2: {
    id: "ecoflow-delta-2",
    brand: "EcoFlow",
    badge: "🏆 #1 Carga Ultrarrápida & Respaldo 1 kWh",
    title:
      "EcoFlow DELTA 2 — Estación de Energía Portátil LiFePO4 1024Wh / 1800W (2700W X-Boost)",
    subtitle:
      "Se recarga del 0 % al 80 % en solo 50 minutos por enchufe AC. Alimenta un router (~50 h), laptop (~15 h) o refrigeradora portátil 12V (~46 h) con batería LiFePO4 de 3,000+ ciclos.",
    features: [
      "1024Wh expandibles hasta 3040Wh con batería extra DELTA 2 o DELTA Max",
      "6 tomas AC (1800W continuos), USB-C 100W x2, puerto regulado 12V 10A y EPS <30 ms",
      "Entrada solar MPPT de 500W (11–60V, hasta 15A con cable MC4 a XT60i)",
    ],
    categoryType: "power-station",
    specs: {
      capacityWh: "1024Wh (LiFePO4 · 3,000+ ciclos)",
      powerW: "1800W continuos (2700W pico/X-Boost)",
      weightAndRecharge: "12 kg (27 lb) · 0–80 % en 50 min AC",
      budgetRange: "precio variable en Amazon en Amazon EE. UU.",
      compatibleSolarCable: "Panel 220W/400W + Cable MC4 a XT60i (15A)",
    },
    queryUS: "EcoFlow DELTA 2 Portable Power Station 1024Wh LiFePO4",
    queryES: "EcoFlow DELTA 2 estacion de energia portatil 1024Wh LiFePO4",
    ctaLabel: "Consultar Precio de EcoFlow DELTA 2 en Amazon",
  },

  JACKERY_1000_V2: {
    id: "jackery-explorer-1000-v2",
    brand: "Jackery",
    badge: "⛺ #1 Más Ligera y Silenciosa 1 kWh (30 dB)",
    title:
      "Jackery Explorer 1000 v2 — Estación Portátil LiFePO4 1070Wh / 1500W (3000W Pico)",
    subtitle:
      "La estación de 1 kWh más portátil del segmento (10.8 kg / 23.8 lb) con 4,000 ciclos LiFePO4, recarga en 1 hora desde la pared y modo silencioso de 30 dB ideal para carpas o dormitorios.",
    features: [
      "4,000 ciclos hasta el 70%+ de capacidad (10+ años de uso frecuente)",
      "Doble puerto USB-C (100W + 30W) para cargar MacBook/laptop sin pérdidas de inversor",
      "Carga AC de emergencia en 1 hora desde la app y doble entrada DC8020 hasta 400W solar",
    ],
    categoryType: "power-station",
    specs: {
      capacityWh: "1070Wh (LiFePO4 · 4,000 ciclos)",
      powerW: "1500W continuos (3000W pico)",
      weightAndRecharge: "10.8 kg (23.8 lb) · Carga AC 1 h (App)",
      budgetRange: "precio variable en Amazon en Amazon EE. UU.",
      compatibleSolarCable: "SolarSaga 100W/200W x2 o MC4 + Adaptador DC8020",
    },
    queryUS: "Jackery Explorer 1000 v2 Portable Power Station 1070Wh LiFePO4",
    queryES: "Jackery Explorer 1000 v2 estacion de energia portatil LiFePO4",
    ctaLabel: "Ver Precio de Jackery Explorer 1000 v2 en Amazon",
  },

  BLUETTI_AC180: {
    id: "bluetti-ac180",
    brand: "BLUETTI",
    badge: "⚡ Máxima Capacidad y Potencia por Dólar (1152Wh)",
    title:
      "BLUETTI AC180 — Estación Portátil LiFePO4 1152Wh / 1800W (2700W Power Lifting)",
    subtitle:
      "Entrega 12 % más capacidad real que sus rivales de 1 kWh (1152Wh), inversor de 1800W reales, UPS rápida de 20 ms y recarga AC turbo de 1440W en 1 hora.",
    features: [
      "1152Wh reales LiFePO4 (3,500+ ciclos) + carga inalámbrica Qi superior de 15W",
      "Puerto solar MC4 nativo incluido hasta 500W (12–60V, 10A) sin adaptadores extra",
      "Alimenta una refrigeradora portátil 12V por +50 horas o cafetera/microondas sin esfuerzo",
    ],
    categoryType: "power-station",
    specs: {
      capacityWh: "1152Wh (LiFePO4 · 3,500+ ciclos)",
      powerW: "1800W continuos (2700W Power Lifting)",
      weightAndRecharge: "16 kg (35.3 lb) · 0–80 % en 45 min AC",
      budgetRange: "precio variable en Amazon en Amazon EE. UU.",
      compatibleSolarCable: "BLUETTI PV200 / PV350 o cualquier panel MC4 <60V",
    },
    queryUS: "BLUETTI AC180 Portable Power Station 1152Wh 1800W LiFePO4",
    queryES: "BLUETTI AC180 estacion de energia portatil 1152Wh LiFePO4",
    ctaLabel: "Ver Oferta de BLUETTI AC180 en Amazon",
  },

  JACKERY_1000_PLUS: {
    id: "jackery-explorer-1000-plus",
    brand: "Jackery",
    badge: "🔋 Jackery Expandible hasta 5 kWh (1264Wh · 2000W)",
    title:
      "Jackery Explorer 1000 Plus — Estación LiFePO4 1264Wh / 2000W (Expandible a 5 kWh)",
    subtitle:
      "Versión modular de 2000W continuos (4000W pico) que admite hasta 3 baterías adicionales para cortes de luz largos en casa y carga solar de hasta 800W.",
    features: [
      "2000W continuos para microondas, herramientas, bombas de agua o neveras grandes",
      "4,000 ciclos LiFePO4 con carga solar hasta 800W (2x SolarSaga 200W en 4 h)",
      "Puertos duales DC8020 solares y doble USB-C PD de 100W",
    ],
    categoryType: "power-station",
    specs: {
      capacityWh: "1264Wh expandible a 5056Wh",
      powerW: "2000W continuos (4000W pico)",
      weightAndRecharge: "14.5 kg (32 lb) · 1.7 h carga AC",
      budgetRange: "precio variable en Amazon en Amazon EE. UU.",
      compatibleSolarCable: "Jackery SolarSaga 100W/200W o MC4 a DC8020",
    },
    queryUS: "Jackery Explorer 1000 Plus Portable Power Station 1264Wh 2000W",
    queryES: "Jackery Explorer 1000 Plus estacion energia 1264Wh 2000W",
    ctaLabel: "Consultar Precio de Jackery 1000 Plus en Amazon",
  },

  ECOFLOW_DELTA_3_PLUS: {
    id: "ecoflow-delta-3-plus",
    brand: "EcoFlow",
    badge: "🖥️ UPS Profesional <10ms & Doble Solar 1000W (1024Wh)",
    title:
      "EcoFlow DELTA 3 Plus — Estación LiFePO4 1024Wh / 1800W (Doble MPPT 1000W + UPS <10ms)",
    subtitle:
      "Evolución de nueva generación con dos entradas solares XT60i de 500W cada una (1000W total), nivel sonoro <30 dB hasta 600W y conmutación UPS <10 ms para PC/NAS/router.",
    features: [
      "Carga AC 0–100 % en solo 56 minutos y doble puerto solar independiente XT60i",
      "Conmutación UPS <10 ms compatible con PCs de escritorio, servidores y routers",
      "4,000 ciclos LiFePO4 y compatibilidad con baterías extra DELTA 2 / DELTA 3",
    ],
    categoryType: "power-station",
    specs: {
      capacityWh: "1024Wh (LiFePO4 · 4,000 ciclos)",
      powerW: "1800W continuos (3600W pico)",
      weightAndRecharge: "12.5 kg (27.6 lb) · 56 min AC completo",
      budgetRange: "precio variable en Amazon en Amazon EE. UU.",
      compatibleSolarCable: "Doble entrada MC4 a XT60i (hasta 1000W solar)",
    },
    queryUS: "EcoFlow DELTA 3 Plus Portable Power Station 1024Wh 1800W",
    queryES: "EcoFlow DELTA 3 Plus estacion energia portatil 1024Wh",
    ctaLabel: "Ver Precio de EcoFlow DELTA 3 Plus en Amazon",
  },

  ANKER_SOLIX_C1000: {
    id: "anker-solix-c1000",
    brand: "Anker",
    badge: "🛡️ Alternativa Sólida 1056Wh / 1800W (Carga en 58 min)",
    title:
      "Anker SOLIX C1000 — Estación Portátil LiFePO4 1056Wh / 1800W (2400W SurgePad)",
    subtitle:
      "Diseño unibody muy resistente con carga UltraFast AC en 58 minutos, 600W de entrada solar XT60 y 5 años de garantía del fabricante.",
    features: [
      "1056Wh LiFePO4 expandible a 2112Wh con batería BP1000",
      "Entrada solar hasta 600W (11–60V XT60) para recarga off-grid en ~2 h",
      "6 tomas AC + USB-C 100W y 30W + luz LED frontal integrada",
    ],
    categoryType: "power-station",
    specs: {
      capacityWh: "1056Wh (LiFePO4 · 3,000+ ciclos)",
      powerW: "1800W continuos (2400W SurgePad)",
      weightAndRecharge: "12.9 kg (28.4 lb) · 58 min AC 100%",
      budgetRange: "precio variable en Amazon en Amazon EE. UU.",
      compatibleSolarCable: "Panel 200W/400W + Cable MC4 a XT60 (11–60V)",
    },
    queryUS: "Anker SOLIX C1000 Portable Power Station 1056Wh 1800W",
    queryES: "Anker SOLIX C1000 estacion energia portatil 1056Wh",
    ctaLabel: "Ver Anker SOLIX C1000 en Amazon",
  },

  // === ESTACIONES COMPACTAS Y LIGERAS (< 800Wh: CAMPING, ROUTER, LAPTOP, AVIÓN) ===
  JACKERY_100_PLUS: {
    id: "jackery-explorer-100-plus",
    brand: "Jackery",
    badge: "✈️ Apta Cabina de Avión FAA (<100Wh · 965 g)",
    title:
      "Jackery Explorer 100 Plus — Mini Estación LiFePO4 99Wh / 128W USB-C PD (Aprobada Avión)",
    subtitle:
      "Con 99Wh cumple el límite de 100Wh para viajar en equipaje de mano en avión. Carga laptops de 100W por USB-C PD, drones, cámaras y routers durante 5–6 horas.",
    features: [
      "99Wh LiFePO4 (2,000 ciclos) aceptada por TSA/FAA en cabina sin permisos extra",
      "Doble USB-C 100W + USB-A 18W (sin inversor AC pesado ni ruido)",
      "Admite carga solar directa de hasta 100W con adaptador USB-C incluido",
    ],
    categoryType: "power-station",
    specs: {
      capacityWh: "99Wh (LiFePO4 · Apta Avión)",
      powerW: "128W DC / USB-C PD 100W",
      weightAndRecharge: "0.96 kg (2.1 lb) · 1.8 h USB-C 100W",
      budgetRange: "precio variable en Amazon en Amazon EE. UU.",
      compatibleSolarCable: "Jackery SolarSaga 40W / 100W (Entrada USB-C PD)",
    },
    queryUS: "Jackery Explorer 100 Plus 99Wh LiFePO4 Travel Power Station",
    queryES: "Jackery Explorer 100 Plus 99Wh LiFePO4 estacion viaje avion",
    ctaLabel: "Ver Jackery 100 Plus para Avión en Amazon",
  },

  JACKERY_300_PLUS: {
    id: "jackery-explorer-300-plus",
    brand: "Jackery",
    badge: "🎒 Ultraligera Camping y Teletrabajo (288Wh · 3.75 kg)",
    title:
      "Jackery Explorer 300 Plus — Estación Portátil LiFePO4 288Wh / 300W (3.75 kg)",
    subtitle:
      "Cabe en una mochila, pesa solo 3.75 kg y alimenta un router Wi-Fi ~16 horas o una laptop ~4.5 horas por USB-C PD de 100W sin desperdiciar energía en el inversor.",
    features: [
      "288Wh LiFePO4 de 3,000 ciclos (carga al 100 % en 2 horas por pared)",
      "Doble puerto USB-C (100W bidireccional + 15W), toma AC de 300W y puerto auto 12V",
      "Opción en kit con panel SolarSaga 40W Mini plegable tamaño tablet",
    ],
    categoryType: "power-station",
    specs: {
      capacityWh: "288Wh (LiFePO4 · 3,000 ciclos)",
      powerW: "300W continuos (600W pico)",
      weightAndRecharge: "3.75 kg (8.27 lb) · 2 h AC",
      budgetRange: "precio variable en Amazon en Amazon EE. UU.",
      compatibleSolarCable: "SolarSaga 40W/100W o USB-C PD / DC8020",
    },
    queryUS: "Jackery Explorer 300 Plus Portable Power Station 288Wh LiFePO4",
    queryES: "Jackery Explorer 300 Plus 288Wh LiFePO4 estacion portatil",
    ctaLabel: "Ver Precio de Jackery 300 Plus en Amazon",
  },

  JACKERY_240_V2: {
    id: "jackery-explorer-240-v2",
    brand: "Jackery",
    badge: "⛺ Clásica Renovada a LiFePO4 (256Wh · 3.6 kg · Carga 1 h)",
    title:
      "Jackery Explorer 240 v2 — Estación Compacta LiFePO4 256Wh / 300W (Carga en 60 min)",
    subtitle:
      "La nueva versión LiFePO4 del modelo más vendido para camping de fin de semana y respaldo rápido de router, celulares y laptop por USB-C 100W.",
    features: [
      "256Wh LiFePO4 (3,000 ciclos) con recarga de emergencia en 1 hora desde la app",
      "Puerto USB-C PD 100W bidireccional + toma AC 300W onda sinusoidal pura",
      "Ultra compacta de 3.6 kg con linterna LED integrada para apagones",
    ],
    categoryType: "power-station",
    specs: {
      capacityWh: "256Wh (LiFePO4 · 3,000 ciclos)",
      powerW: "300W continuos (600W pico)",
      weightAndRecharge: "3.6 kg (7.9 lb) · 1 h Carga Rápida AC",
      budgetRange: "precio variable en Amazon en Amazon EE. UU.",
      compatibleSolarCable: "SolarSaga 40W / 100W (Puerto DC8020 100W máx)",
    },
    queryUS: "Jackery Explorer 240 v2 Portable Power Station 256Wh LiFePO4",
    queryES: "Jackery Explorer 240 v2 256Wh LiFePO4 estacion portatil",
    ctaLabel: "Consultar Jackery 240 v2 en Amazon",
  },

  JACKERY_600_PLUS: {
    id: "jackery-explorer-600-plus",
    brand: "Jackery",
    badge: "🚐 Equilibrio Portátil 632Wh / 800W (7.3 kg)",
    title:
      "Jackery Explorer 600 Plus — Estación LiFePO4 632Wh / 800W para Camping y CPAP",
    subtitle:
      "El punto dulce intermedio cuando 300Wh se queda corto y 1000Wh pesa demasiado: mueve una refrigeradora portátil 12V todo un fin de semana o un CPAP varias noches.",
    features: [
      "632Wh LiFePO4 (4,000 ciclos) con inversor de 800W continuos (1600W pico)",
      "Peso contenido de 7.3 kg con asa plegable plana para maletero",
      "UPS <20 ms y entrada solar hasta 200W (2x SolarSaga 100W)",
    ],
    categoryType: "power-station",
    specs: {
      capacityWh: "632Wh (LiFePO4 · 4,000 ciclos)",
      powerW: "800W continuos (1600W pico)",
      weightAndRecharge: "7.3 kg (16.1 lb) · 1 h Carga Rápida AC",
      budgetRange: "precio variable en Amazon en Amazon EE. UU.",
      compatibleSolarCable: "Jackery SolarSaga 100W/200W (DC8020)",
    },
    queryUS: "Jackery Explorer 600 Plus Portable Power Station 632Wh 800W",
    queryES: "Jackery Explorer 600 Plus 632Wh 800W LiFePO4",
    ctaLabel: "Ver Jackery Explorer 600 Plus en Amazon",
  },

  ECOFLOW_RIVER_3_PLUS: {
    id: "ecoflow-river-3-plus",
    brand: "EcoFlow",
    badge: "🖥️ UPS <10ms Silenciosa (<30 dB) para Router, PC y Camping",
    title:
      "EcoFlow RIVER 3 Plus — Estación Compacta LiFePO4 286Wh / 600W (UPS <10ms + Expandible)",
    subtitle:
      "Protección UPS de grado servidor (<10 ms) que evita que tu router o PC se reinicien ante cortes de luz, con nivel sonoro <30 dB y expansión apilable sin cables hasta 858Wh.",
    features: [
      "286Wh LiFePO4 (3,000 ciclos) con inversor GaN de 600W (1200W X-Boost)",
      "Entrada solar XT60i de hasta 220W (carga completa en 1.5 h bajo buen sol)",
      "Conector USB-C 100W/140W y monitoreo de corte por USB hacia PC/NAS",
    ],
    categoryType: "power-station",
    specs: {
      capacityWh: "286Wh (expandible a 572Wh / 858Wh)",
      powerW: "600W continuos (1200W X-Boost)",
      weightAndRecharge: "4.7 kg (10.4 lb) · 60 min carga AC",
      budgetRange: "precio variable en Amazon en Amazon EE. UU.",
      compatibleSolarCable: "EcoFlow 110W/160W/220W o cable MC4 a XT60i",
    },
    queryUS: "EcoFlow RIVER 3 Plus Portable Power Station 286Wh 600W UPS",
    queryES: "EcoFlow RIVER 3 Plus estacion energia portatil 286Wh 600W",
    ctaLabel: "Ver EcoFlow RIVER 3 Plus en Amazon",
  },

  ECOFLOW_RIVER_2_MAX: {
    id: "ecoflow-river-2-max",
    brand: "EcoFlow",
    badge: "🏕️ Favorita 512Wh Calidad-Precio para Camping y Refri 12V",
    title:
      "EcoFlow RIVER 2 Max — Estación Portátil LiFePO4 512Wh / 500W (Carga AC 60 min)",
    subtitle:
      "512Wh de capacidad LiFePO4 en solo 6 kg: mantiene una refrigeradora portátil 12V ~22–26 horas, una laptop ~7–8 horas o un router Wi-Fi todo el fin de semana.",
    features: [
      "Recarga AC ultrarrápida 0–100 % en solo 60 minutos (la más rápida de 500Wh)",
      "4 tomas AC 500W (1000W X-Boost), USB-C 100W y puerto de auto 12V regulado",
      "Entrada solar XT60i de 220W (11–50V, 13A) con certificación TÜV Rheinland",
    ],
    categoryType: "power-station",
    specs: {
      capacityWh: "512Wh (LiFePO4 · 3,000+ ciclos)",
      powerW: "500W continuos (1000W X-Boost)",
      weightAndRecharge: "6.0 kg (13.2 lb) · 60 min AC 100%",
      budgetRange: "precio variable en Amazon en Amazon EE. UU.",
      compatibleSolarCable: "Panel 110W/160W/220W + Cable MC4 a XT60i",
    },
    queryUS: "EcoFlow RIVER 2 Max Portable Power Station 512Wh LiFePO4",
    queryES: "EcoFlow RIVER 2 Max estacion energia portatil 512Wh LiFePO4",
    ctaLabel: "Consultar Precio de RIVER 2 Max en Amazon",
  },

  ECOFLOW_RIVER_2_PRO: {
    id: "ecoflow-river-2-pro",
    brand: "EcoFlow",
    badge: "🔋 768Wh Ligera de Alto Rendimiento (7.8 kg · 800W)",
    title:
      "EcoFlow RIVER 2 Pro — Estación LiFePO4 768Wh / 800W (1600W X-Boost)",
    subtitle:
      "Casi 800Wh en menos de 8 kg con carga en 70 minutos y entrada solar de 220W XT60i: ideal para escapadas de 2–3 días con nevera 12V, drones y Starlink.",
    features: [
      "768Wh LiFePO4 (3,000+ ciclos) con 800W continuos (1600W X-Boost)",
      "Carga AC de 0 a 100 % en 70 minutos y puerto USB-C PD 100W",
      "Solo 7.8 kg (17.2 lb) con asa trasera ergonómica",
    ],
    categoryType: "power-station",
    specs: {
      capacityWh: "768Wh (LiFePO4 · 3,000+ ciclos)",
      powerW: "800W continuos (1600W X-Boost)",
      weightAndRecharge: "7.8 kg (17.2 lb) · 70 min AC",
      budgetRange: "precio variable en Amazon en Amazon EE. UU.",
      compatibleSolarCable: "Panel 220W Bifacial + Cable MC4 a XT60i",
    },
    queryUS: "EcoFlow RIVER 2 Pro Portable Power Station 768Wh LiFePO4",
    queryES: "EcoFlow RIVER 2 Pro estacion energia 768Wh LiFePO4",
    ctaLabel: "Ver Precio de RIVER 2 Pro en Amazon",
  },

  BLUETTI_EB3A: {
    id: "bluetti-eb3a",
    brand: "BLUETTI",
    badge: "💵 #1 Compacta Económica LiFePO4",
    title:
      "BLUETTI EB3A — Estación Compacta LiFePO4 268Wh / 600W (1200W Pico + UPS)",
    subtitle:
      "La estación LiFePO4 más económica de marca líder en Amazon EE. UU.: entrega 600W de onda pura, USB-C 100W, carga inalámbrica 15W y puerto solar de 200W.",
    features: [
      "Inversor de 600W en solo 4.6 kg (mueve equipos que las de 300W no arrancan)",
      "Incluye función UPS automática y salida regulada DC 12V 10A para neveras pequeñas",
      "Entrada solar MPPT de 200W (12–28V) con cable solar incluido en muchos kits",
    ],
    categoryType: "power-station",
    specs: {
      capacityWh: "268Wh (LiFePO4 · 2,500+ ciclos)",
      powerW: "600W continuos (1200W pico)",
      weightAndRecharge: "4.6 kg (10.1 lb) · 1.3 h carga turbo",
      budgetRange: "precio variable en Amazon en Amazon EE. UU.",
      compatibleSolarCable: "Panel 100W–200W (<28V Voc) + Cable MC4 a DC7909",
    },
    queryUS: "BLUETTI EB3A Portable Power Station 268Wh 600W LiFePO4",
    queryES: "BLUETTI EB3A estacion de energia portatil 268Wh 600W",
    ctaLabel: "Ver BLUETTI EB3A Económica en Amazon",
  },

  BLUETTI_AC70: {
    id: "bluetti-ac70",
    brand: "BLUETTI",
    badge: "🚐 Compacta Potente 768Wh / 1000W (Entrada Solar 500W)",
    title:
      "BLUETTI AC70 — Estación Portátil LiFePO4 768Wh / 1000W (2000W Power Lifting)",
    subtitle:
      "Destaca por aceptar hasta 500W solares (12–58V) en un chasis de 768Wh: recarga con sol en menos de 2 horas y maneja cargas de hasta 1000W continuos.",
    features: [
      "768Wh LiFePO4 (3,000+ ciclos) y carga AC de 950W (0–80 % en 45 min)",
      "Doble puerto USB-C 100W + salida 12V regulada + puerto solar XT60 500W",
      "UPS en 20 ms para teletrabajo con router y computadora",
    ],
    categoryType: "power-station",
    specs: {
      capacityWh: "768Wh (LiFePO4 · 3,000+ ciclos)",
      powerW: "1000W continuos (2000W Lifting)",
      weightAndRecharge: "10.2 kg (22.5 lb) · 45 min AC 80%",
      budgetRange: "precio variable en Amazon en Amazon EE. UU.",
      compatibleSolarCable: "BLUETTI PV200 / Paneles MC4 (12–58V · XT60)",
    },
    queryUS: "BLUETTI AC70 Portable Power Station 768Wh 1000W LiFePO4",
    queryES: "BLUETTI AC70 estacion de energia portatil 768Wh 1000W",
    ctaLabel: "Ver Precio de BLUETTI AC70 en Amazon",
  },

  ANKER_SOLIX_C300: {
    id: "anker-solix-c300",
    brand: "Anker",
    badge: "🎒 Ultraportátil con Correa & Doble USB-C 140W (288Wh)",
    title:
      "Anker SOLIX C300 / C300 DC — Estación Compacta LiFePO4 288Wh con Correa de Hombro",
    subtitle:
      "Formato vertical que ocupa la mitad de espacio en tu mochila o escritorio, con doble USB-C PD de 140W y lámpara campestre retráctil.",
    features: [
      "288Wh LiFePO4 (3,000 ciclos) en torre compacta de 2.8 a 4.1 kg según versión DC/AC",
      "Dos puertos USB-C bidireccionales de 140W para cargar laptops gaming o MacBook Pro",
      "Carga solar XT60 hasta 100W (11–28V) ideal para camping ultraligero",
    ],
    categoryType: "power-station",
    specs: {
      capacityWh: "288Wh (LiFePO4 · 3,000 ciclos)",
      powerW: "300W AC / 300W USB-C PD (140W x2)",
      weightAndRecharge: "2.8–4.1 kg · 68 min carga rápida",
      budgetRange: "precio variable en Amazon en Amazon EE. UU.",
      compatibleSolarCable: "Panel 100W (11–28V Voc) + Cable MC4 a XT60",
    },
    queryUS: "Anker SOLIX C300 Portable Power Station 288Wh LiFePO4",
    queryES: "Anker SOLIX C300 estacion portatil 288Wh LiFePO4",
    ctaLabel: "Ver Anker SOLIX C300 en Amazon",
  },

  // === ESTACIONES GRANDES 2000Wh – 3600Wh+ (CORTES DE LUZ LARGOS Y CAMPER) ===
  ECOFLOW_DELTA_2_MAX: {
    id: "ecoflow-delta-2-max",
    brand: "EcoFlow",
    badge: "🏠 #1 Respaldo del Hogar 2 kWh (2048Wh · 2400W · Doble Solar)",
    title:
      "EcoFlow DELTA 2 Max — Estación LiFePO4 2048Wh / 2400W (Doble Entrada Solar 1000W)",
    subtitle:
      "Mantiene una refrigeradora doméstica de casa durante 12–16 horas (o una refri portátil + router + laptops más de 48 horas), con carga híbrida AC+Solar en 43 minutos.",
    features: [
      "2048Wh LiFePO4 expandibles hasta 6144Wh con 2 baterías DELTA 2 Max",
      "Dos entradas solares independientes XT60i de 500W c/u (1000W total)",
      "Nivel sonoro ultra bajo (30 dB por debajo de 500W) ideal dentro del hogar",
    ],
    categoryType: "power-station",
    specs: {
      capacityWh: "2048Wh expandible a 6144Wh",
      powerW: "2400W continuos (3400W X-Boost / 4800W pico)",
      weightAndRecharge: "23 kg (50.7 lb) · 1.1 h AC / 43 min AC+Solar",
      budgetRange: "precio variable en Amazon en Amazon EE. UU.",
      compatibleSolarCable: "Paneles EcoFlow 220W/400W + Cable MC4 a XT60i",
    },
    queryUS: "EcoFlow DELTA 2 Max Portable Power Station 2048Wh 2400W LiFePO4",
    queryES: "EcoFlow DELTA 2 Max estacion energia portatil 2048Wh 2400W",
    ctaLabel: "Consultar Precio de DELTA 2 Max en Amazon",
  },

  BLUETTI_AC200L: {
    id: "bluetti-ac200l",
    brand: "BLUETTI",
    badge: "🚐 Camper & Casa Todo Terreno (2048Wh · 1200W Solar · Puerto 48V RV)",
    title:
      "BLUETTI AC200L — Estación LiFePO4 2048Wh / 2400W (1200W Solar 145V + NEMA TT-30)",
    subtitle:
      "Su controlador solar admite hasta 145V Voc / 1200W (permite conectar paneles rígidos o varios plegables en serie) e incluye puerto 30A TT-30 para camper y 48V DC.",
    features: [
      "2048Wh LiFePO4 expandibles hasta 8192Wh con baterías B230 / B300 / B300K",
      "Recarga AC de 2400W (0–80 % en 45 minutos) y 3,000+ ciclos",
      "Puerto NEMA TT-30 de 30A para caravanas/transferencia y carga solar 1200W",
    ],
    categoryType: "power-station",
    specs: {
      capacityWh: "2048Wh (expandible a 8192Wh)",
      powerW: "2400W continuos (3600W Lifting)",
      weightAndRecharge: "28.3 kg (62.4 lb) · 45 min AC 80%",
      budgetRange: "precio variable en Amazon en Amazon EE. UU.",
      compatibleSolarCable: "3x BLUETTI PV200 / PV350 en serie (hasta 145V)",
    },
    queryUS: "BLUETTI AC200L Portable Power Station 2048Wh 2400W LiFePO4",
    queryES: "BLUETTI AC200L estacion energia portatil 2048Wh 2400W",
    ctaLabel: "Ver Oferta de BLUETTI AC200L en Amazon",
  },

  JACKERY_2000_PLUS: {
    id: "jackery-explorer-2000-plus",
    brand: "Jackery",
    badge: "🛞 Con Ruedas, 3000W Continuos y Escalable a 12 kWh (2042Wh)",
    title:
      "Jackery Explorer 2000 Plus — Estación LiFePO4 2042Wh / 3000W con Ruedas",
    subtitle:
      "Potencia continua de 3000W (6000W pico) con ruedas y asa telescópica para moverla fácil durante apagones en casa; escalable hasta 12 kWh.",
    features: [
      "3000W continuos (120V/240V en paralelo) para nevera, bomba, microondas y aire portátil",
      "Entrada solar de hasta 1400W (6x SolarSaga 200W en 2 horas)",
      "Celdas LiFePO4 de 4,000 ciclos y tecnología silenciosa ChargeShield 30 dB",
    ],
    categoryType: "power-station",
    specs: {
      capacityWh: "2042Wh expandible a 12,000Wh",
      powerW: "3000W continuos (6000W pico)",
      weightAndRecharge: "27.9 kg (61.5 lb, con ruedas) · 2 h AC",
      budgetRange: "precio variable en Amazon en Amazon EE. UU.",
      compatibleSolarCable: "Jackery SolarSaga 200W o MC4 con DC8020",
    },
    queryUS: "Jackery Explorer 2000 Plus Portable Power Station 2042Wh 3000W",
    queryES: "Jackery Explorer 2000 Plus 2042Wh 3000W LiFePO4",
    ctaLabel: "Ver Jackery Explorer 2000 Plus en Amazon",
  },

  ECOFLOW_DELTA_PRO: {
    id: "ecoflow-delta-pro",
    brand: "EcoFlow",
    badge: "🏡 Respaldo Integral del Hogar 3.6 kWh (3600W · 1600W Solar)",
    title:
      "EcoFlow DELTA Pro — Estación LiFePO4 3600Wh / 3600W con Ruedas y Puerto 30A",
    subtitle:
      "Diseñada para cortes de luz de varios días en casa: 3600Wh LiFePO4, 3600W continuos (7200W pico), entrada solar 1600W (150V) y conexión directa a switch de transferencia.",
    features: [
      "3600Wh de capacidad base (expansión hasta 10.8 kWh con baterías extra)",
      "Entrada solar XT60i de 11–150V hasta 1600W + carga en estaciones EV",
      "Puerto NEMA TT-30 de 30A compatible con panel de transferencia Reliance Controls",
    ],
    categoryType: "power-station",
    specs: {
      capacityWh: "3600Wh (LiFePO4 · 3,500+ ciclos)",
      powerW: "3600W continuos (7200W pico)",
      weightAndRecharge: "45 kg (99 lb, con ruedas) · 1.9 h AC 1800W",
      budgetRange: "precio variable en Amazon en Amazon EE. UU.",
      compatibleSolarCable: "EcoFlow 400W x3 o paneles MC4 (11–150V XT60i)",
    },
    queryUS: "EcoFlow DELTA Pro Portable Power Station 3600Wh 3600W LiFePO4",
    queryES: "EcoFlow DELTA Pro estacion energia portatil 3600Wh 3600W",
    ctaLabel: "Ver EcoFlow DELTA Pro en Amazon",
  },

  // === PANELES SOLARES PLEGABLES ===
  PANEL_JACKERY_SOLARSAGA_100W: {
    id: "jackery-solarsaga-100w",
    brand: "Jackery",
    badge: "☀️ Panel Solar Plegable 100W Líder de Ventas (4.6 kg)",
    title:
      "Jackery SolarSaga 100W — Panel Solar Portátil Plegable Monocristalino IP68",
    subtitle:
      "Pesa solo 4.6 kg con asas magnéticas, soportes plegables y salida directa USB-C/USB-A además de cable DC7909/DC8020 para Jackery 240, 300 Plus, 600 Plus y 1000 v2.",
    features: [
      "Eficiencia monocristalina de hasta 24.3 % con laminado ETFE resistente IP68",
      "Incluye adaptador dual DC7909 / DC8020 compatible con toda la gama Jackery",
      "Salida USB-A y USB-C integrada para cargar celulares directo del sol",
    ],
    categoryType: "solar-panel",
    specs: {
      capacityWh: "100W pico (~65–85W reales al mediodía)",
      powerW: "Voc ~23.2V / Vmp 20V · USB-C 15W + USB-A",
      weightAndRecharge: "4.6 kg (10.2 lb) · Recarga 300Wh en ~4 h sol",
      budgetRange: "precio variable en Amazon en Amazon EE. UU.",
      compatibleSolarCable: "Cable integrado DC7909 + adaptador DC8020",
    },
    queryUS: "Jackery SolarSaga 100W Portable Solar Panel Foldable IP68",
    queryES: "Jackery SolarSaga 100W panel solar portatil plegable",
    ctaLabel: "Ver Panel Jackery SolarSaga 100W en Amazon",
  },

  PANEL_JACKERY_SOLARSAGA_200W: {
    id: "jackery-solarsaga-200w",
    brand: "Jackery",
    badge: "☀️ Panel Solar Plegable 200W IP68 para 1000Wh y 2000Wh",
    title:
      "Jackery SolarSaga 200W — Panel Solar Portátil Plegable 200W con Funda Protectora",
    subtitle:
      "El complemento ideal para recargar la Jackery Explorer 1000 v2 en ~6 horas de sol (o en 3 horas usando dos unidades en paralelo).",
    features: [
      "200W monocristalinos con recubrimiento ETFE e impermeabilidad IP68",
      "Se pliega en 4 cuerpos con funda rígida de transporte y soportes estables",
      "Conector compatible con todas las estaciones Jackery Explorer Plus y v2",
    ],
    categoryType: "solar-panel",
    specs: {
      capacityWh: "200W pico (~145–175W reales al sol)",
      powerW: "Voc ~23.2V / Vmp 20V / Imp 10A",
      weightAndRecharge: "6.2 – 8.0 kg · Recarga 1000Wh en ~6–7 h",
      budgetRange: "precio variable en Amazon en Amazon EE. UU.",
      compatibleSolarCable: "Cable 3m DC7909 / DC8020 incluido",
    },
    queryUS: "Jackery SolarSaga 200W Portable Solar Panel Foldable",
    queryES: "Jackery SolarSaga 200W panel solar portatil plegable",
    ctaLabel: "Ver Panel SolarSaga 200W en Amazon",
  },

  PANEL_ECOFLOW_220W_BIFACIAL: {
    id: "ecoflow-220w-bifacial-solar",
    brand: "EcoFlow",
    badge: "☀️ Panel Bifacial 220W + Hasta 25% Extra por Reflejo (IP68)",
    title:
      "EcoFlow 220W Bifacial Portable Solar Panel — Captación Doble Cara IP68 (MC4)",
    subtitle:
      "Capta luz directa frontal (220W) y radiación reflejada trasera (hasta 155W adicionales en arena, nieve o concreto), con funda que actúa como pie de apoyo.",
    features: [
      "Celdas monocristalinas N-Type de 23–25 % eficiencia bajo vidrio templado ultrafino",
      "Impermeable IP68 sumergible y conector universal MC4",
      "Ideal para EcoFlow DELTA 2, RIVER 2 Max/Pro, BLUETTI y Anker",
    ],
    categoryType: "solar-panel",
    specs: {
      capacityWh: "220W Frontal + 155W Trasera (MC4)",
      powerW: "Voc 21.8V / Imp 13A (compatible con casi todo MPPT)",
      weightAndRecharge: "9.5 kg (20.9 lb) · Carga DELTA 2 en ~5–6 h",
      budgetRange: "precio variable en Amazon en Amazon EE. UU.",
      compatibleSolarCable: "Salida MC4 (usar cable MC4 a XT60i en EcoFlow)",
    },
    queryUS: "EcoFlow 220W Bifacial Portable Solar Panel Foldable IP68",
    queryES: "EcoFlow panel solar portatil bifacial 220W plegable IP68",
    ctaLabel: "Consultar EcoFlow 220W Bifacial en Amazon",
  },

  PANEL_ECOFLOW_160W_110W: {
    id: "ecoflow-160w-solar-panel",
    brand: "EcoFlow",
    badge: "🎒 Panel Plegable Ligero 110W / 160W IP68 para Camping",
    title:
      "EcoFlow 110W / 160W NextGen Portable Solar Panel — Ultraligero MC4 IP68",
    subtitle:
      "Peso reducido (4 a 5.6 kg) para acompañar estaciones de 256Wh–768Wh como RIVER 2 Max, RIVER 3 Plus o Jackery 300 Plus en viajes cortos.",
    features: [
      "Indicador de ángulo solar integrado para orientar el panel a máxima producción",
      "Impermeable IP68 con conectores MC4 compatibles universalmente",
      "Compacto al plegarse, cabe en cualquier cajuela o portaequipajes",
    ],
    categoryType: "solar-panel",
    specs: {
      capacityWh: "110W o 160W pico (MC4 universal)",
      powerW: "Voc 21.4V · Eficiencia 23–25%",
      weightAndRecharge: "4.0 – 5.6 kg · Recarga 512Wh en ~3.5–4.5 h",
      budgetRange: "precio variable en Amazon en Amazon EE. UU.",
      compatibleSolarCable: "Conector MC4 + Cable MC4 a XT60i o DC8020",
    },
    queryUS: "EcoFlow 160W 110W Portable Solar Panel Foldable IP68",
    queryES: "EcoFlow panel solar portatil 110W 160W plegable IP68",
    ctaLabel: "Ver EcoFlow 110W / 160W en Amazon",
  },

  PANEL_BLUETTI_PV200: {
    id: "bluetti-pv200-solar",
    brand: "BLUETTI",
    badge: "☀️ Panel 200W MC4 de Alta Eficiencia para BLUETTI y Otras Marcas",
    title:
      "BLUETTI PV200 — Panel Solar Portátil Plegable 200W Monocristalino ETFE (MC4)",
    subtitle:
      "Celdas monocristalinas ETFE con conectores universales MC4: recarga la BLUETTI AC180 o AC70 sin comprar adaptadores adicionales y también sirve para EcoFlow.",
    features: [
      "23.4 % de eficiencia de conversión con laminado ETFE antirrayaduras",
      "Soportes traseros ajustables para seguir la altura solar mañana y tarde",
      "Voc de 26.1V / Imp 9.7A compatible con BLUETTI EB3A, AC70, AC180 y AC200L",
    ],
    categoryType: "solar-panel",
    specs: {
      capacityWh: "200W pico (~150–170W reales)",
      powerW: "Voc 26.1V / Vmp 20.5V / Imp 9.7A",
      weightAndRecharge: "7.3 kg (16.1 lb) · Recarga 1152Wh en ~6–7 h",
      budgetRange: "precio variable en Amazon en Amazon EE. UU.",
      compatibleSolarCable: "Salida MC4 estándar (incluye cable MC4 de 3 m)",
    },
    queryUS: "BLUETTI PV200 200W Portable Solar Panel Foldable MC4",
    queryES: "BLUETTI PV200 panel solar portatil 200W plegable MC4",
    ctaLabel: "Ver BLUETTI PV200 200W en Amazon",
  },

  PANEL_UNIVERSAL_RENOGY_ZOUPW_200W: {
    id: "renogy-zoupw-200w-mc4",
    brand: "Universal",
    badge: "💵 Mejor Panel 200W Universal MC4 Calidad-Precio",
    title:
      "ZOUPW / Renogy 200W Portable Solar Panel (N-Type / Suitcase MC4) Compatible Multi-Marca",
    subtitle:
      "La alternativa favorita en Amazon EE. UU. para gastar hasta un 40 % menos en watts solares reales conectándolo vía MC4 a EcoFlow, BLUETTI o Jackery.",
    features: [
      "Celdas N-Type de 23.5–25 % eficiencia con salida MC4 estándar de hasta 10–11A",
      "Incluye cable multipuerto o conectores MC4 compatibles con XT60i y DC8020",
      "Comprueba siempre que el Voc del panel no supere el límite MPPT de tu estación",
    ],
    categoryType: "solar-panel",
    specs: {
      capacityWh: "200W (hasta 400W en paralelo/serie)",
      powerW: "Voc ~23–25V / Imp ~10A",
      weightAndRecharge: "7.5 – 11.8 kg · Ahorro hasta 40 % por Watt",
      budgetRange: "precio variable en Amazon en Amazon EE. UU.",
      compatibleSolarCable: "MC4 nativo (añadir MC4→XT60i o MC4→DC8020)",
    },
    queryUS: "ZOUPW Renogy 200W Portable Foldable Solar Panel MC4",
    queryES: "panel solar portatil 200W plegable MC4 camping",
    ctaLabel: "Ver Panel Universal 200W MC4 en Amazon",
  },

  PANEL_400W_PLEGABLE: {
    id: "panel-solar-400w-plegable",
    brand: "EcoFlow",
    badge: "⚡ Máxima Potencia Solar Portátil 400W (Para 1000Wh–3600Wh)",
    title:
      "EcoFlow 400W / BLUETTI PV350 — Panel Solar Plegable de Alta Potencia para Casa y Camper",
    subtitle:
      "Ideal para recargar estaciones de 1000Wh a 2048Wh en una sola tarde de sol o mantener funcionando una refrigeradora y teletrabajo sin electricidad de red.",
    features: [
      "350W–400W nominales con funda-soporte ajustable y resistencia IP68",
      "Voc ~46V–48V: perfecto para DELTA 2 (60V máx), AC180 (60V máx) y AC200L (145V)",
      "NO usar en estaciones pequeñas de tope 28V como BLUETTI EB3A o Anker C300",
    ],
    categoryType: "solar-panel",
    specs: {
      capacityWh: "350W – 400W pico",
      powerW: "Voc 46.5V–48V (Verificar MPPT >= 55V)",
      weightAndRecharge: "13.9 – 16.0 kg · Recarga 1024Wh en ~3.5 h",
      budgetRange: "precio variable en Amazon en Amazon EE. UU.",
      compatibleSolarCable: "MC4 a XT60i (EcoFlow) o MC4 directo (BLUETTI)",
    },
    queryUS: "EcoFlow 400W BLUETTI PV350 Portable Solar Panel Foldable",
    queryES: "EcoFlow 400W BLUETTI PV350 panel solar portatil plegable",
    ctaLabel: "Ver Paneles Solares de 350W–400W en Amazon",
  },

  // === CARGADORES DE ALTERNADOR, BATERÍAS EXTRA Y ACCESORIOS ===
  ECOFLOW_800W_ALTERNATOR_CHARGER: {
    id: "ecoflow-800w-alternator-charger",
    brand: "EcoFlow",
    badge: "🚐 Recarga 8x Más Rápida en Ruta (800W desde Alternador del Auto)",
    title:
      "EcoFlow 800W Alternator Charger — Cargador Rápido 3-en-1 desde Alternador de Vehículo",
    subtitle:
      "Olvídate de esperar 10 horas en el mechero de 12V (96W): carga tu estación EcoFlow en 1.3 horas mientras conduces (1 kWh en 75 minutos).",
    features: [
      "Entrega hasta 800W continuos desde la batería de arranque / alternador (12V/24V)",
      "Funciona en 3 modos bidireccionales: Carga rápida, Arranque inverso y Mantenimiento",
      "Compatible con DELTA 2, DELTA 2 Max, DELTA 3, DELTA Pro y RIVER 2/3 (con adaptador)",
    ],
    categoryType: "charger-battery",
    specs: {
      capacityWh: "Carga 1000Wh en ~75 minutos conduciendo",
      powerW: "800W DC bidireccional (11–35V entrada)",
      weightAndRecharge: "2.3 kg · Cable de 5 m incluido",
      budgetRange: "precio variable en Amazon en Amazon EE. UU.",
      compatibleSolarCable: "Incluye cable propietario XT150 EcoFlow",
    },
    queryUS: "EcoFlow 800W Alternator Charger Portable Power Station",
    queryES: "EcoFlow 800W Alternator Charger cargador alternador",
    ctaLabel: "Ver EcoFlow 800W Alternator Charger en Amazon",
  },

  BLUETTI_CHARGER_1_560W: {
    id: "bluetti-charger-1-560w",
    brand: "BLUETTI",
    badge: "🚗 Cargador Alternador Universal 560W (Compatible BLUETTI, Jackery, EcoFlow)",
    title:
      "BLUETTI Charger 1 — Cargador DC-DC de Alternador 560W Compatible con El 95% de Marcas",
    subtitle:
      "Eleva los 12V/24V del vehículo hasta 56V/10A (560W) para cargar estaciones BLUETTI, Jackery o EcoFlow por su entrada solar hasta 5 veces más rápido que el enchufe del auto.",
    features: [
      "560W reales mientras conduces (protección automática que evita descargar la batería del coche)",
      "Salida MC4 configurable de 15V a 56V mediante app para adaptarse a cualquier estación",
      "Incluye cableado, disyuntor de seguridad de 60A y sensores térmicos",
    ],
    categoryType: "charger-battery",
    specs: {
      capacityWh: "Carga 1000Wh en ~2 horas de carretera",
      powerW: "560W máximo (voltaje ajustable 15–56V)",
      weightAndRecharge: "1.4 kg · Salida MC4 universal",
      budgetRange: "precio variable en Amazon en Amazon EE. UU.",
      compatibleSolarCable: "Salida MC4 (usar cable MC4 a XT60i o DC8020)",
    },
    queryUS: "BLUETTI Charger 1 560W Alternator Charger DC-DC",
    queryES: "BLUETTI Charger 1 560W cargador alternador",
    ctaLabel: "Ver BLUETTI Charger 1 (560W) en Amazon",
  },

  ECOFLOW_DELTA2_EXTRA_BATTERY: {
    id: "ecoflow-delta2-extra-battery",
    brand: "EcoFlow",
    badge: "🔋 Duplica o Triplica tu Autonomía LiFePO4 (+1024Wh / +2048Wh)",
    title:
      "Baterías de Expansión Oficiales (EcoFlow DELTA 2 / DELTA 2 Max / BLUETTI B300K / Jackery Pack)",
    subtitle:
      "Multiplica las horas de respaldo para tu refrigeradora y teletrabajo durante cortes de luz largos conectando un módulo adicional mediante cable de expansión.",
    features: [
      "Mismas celdas LiFePO4 (3,000–4,000 ciclos) gestionadas por el BMS central",
      "Permite pasar de 1024Wh a 2048Wh o 3072Wh sin comprar otro inversor",
      "Se recargan juntas desde pared o paneles solares",
    ],
    categoryType: "charger-battery",
    specs: {
      capacityWh: "+1024Wh / +2048Wh / +2764Wh",
      powerW: "Expansión directa por puerto propietario",
      weightAndRecharge: "9.5 – 27 kg según capacidad",
      budgetRange: "precio variable en Amazon en Amazon EE. UU.",
      compatibleSolarCable: "Cable de expansión oficial incluido",
    },
    queryUS: "EcoFlow DELTA 2 Smart Extra Battery BLUETTI B300K Expansion Battery",
    queryES: "EcoFlow DELTA 2 bateria adicional expansion LiFePO4",
    ctaLabel: "Ver Baterías de Expansión en Amazon",
  },

  CARGADOR_GAN_140W_USBC: {
    id: "cargador-gan-140w-usbc-cable",
    brand: "Universal",
    badge: "🔌 Carga Silenciosa USB-C PD 100W/140W Sin Pérdidas de Inversor",
    title:
      "Cargador USB-C PD GaN 140W + Cable Trenzado 240W (Anker / UGREEN) para Laptops y Estaciones",
    subtitle:
      "Te permite cargar estaciones compactas (Jackery 100/240/300 Plus, Anker C300) por USB-C o alimentar tu MacBook/laptop directo desde el puerto DC sin gastar inversor AC.",
    features: [
      "Entrada universal 100V–240V AC (sirve en EE. UU., Latinoamérica y Europa sin transformador)",
      "Cable USB-C 240W certificado E-Marker para evitar caídas de voltaje en laptops de 100W",
      "Ahorra hasta un 15 % de batería frente al cargador AC tradicional en el inversor",
    ],
    categoryType: "charger-battery",
    specs: {
      capacityWh: "Eficiencia >92 % en carga directa DC",
      powerW: "100W – 140W PD 3.1 (100–240V)",
      weightAndRecharge: "0.28 kg · Multivoltaje bivolt",
      budgetRange: "precio variable en Amazon en Amazon EE. UU.",
      compatibleSolarCable: "Puerto USB-C PD 100W / 140W universal",
    },
    queryUS: "Anker UGREEN 140W USB C GaN Charger 240W Cable",
    queryES: "cargador USB C GaN 140W cable 240W Anker UGREEN",
    ctaLabel: "Ver Cargadores USB-C GaN 140W en Amazon",
  },

  // === CABLES SOLARES, ADAPTADORES Y TRANSFERENCIA ===
  CABLE_MC4_XT60I_15A: {
    id: "cable-solar-mc4-xt60i",
    brand: "EcoFlow",
    badge: "🔌 Cable Clave 15A para EcoFlow y BLUETTI (MC4 a XT60i)",
    title:
      "Cable Solar MC4 a XT60i (10AWG / 12AWG · 10–20 pies) — Desbloquea los 15A Reales",
    subtitle:
      "El pin central del conector XT60i le indica a tu EcoFlow DELTA 2 / RIVER 2 / DELTA Pro que es una fuente solar (15A) y no un auto (limitado a 8A). Evita perder la mitad de tu potencia solar.",
    features: [
      "Diferencia crítica frente al XT60 común: duplica la corriente aceptada de 8A a 15A",
      "Cobre estañado de calibre grueso 10AWG/12AWG para minimizar caída de voltaje",
      "Conectores MC4 impermeables IP67 compatibles con Renogy, ZOUPW, EcoFlow y BLUETTI",
    ],
    categoryType: "cable-adapter",
    specs: {
      capacityWh: "Soporta hasta 15A–25A continuos (10AWG)",
      powerW: "Desbloquea 500W en DELTA 2 / 220W en RIVER 2",
      weightAndRecharge: "Longitud 3 m – 6 m (10–20 ft)",
      budgetRange: "precio variable en Amazon en Amazon EE. UU.",
      compatibleSolarCable: "MC4 hembra/macho a conector XT60i",
    },
    queryUS: "MC4 to XT60i Solar Charging Cable 10AWG 12AWG EcoFlow",
    queryES: "cable solar MC4 a XT60i 10AWG EcoFlow",
    ctaLabel: "Ver Cable MC4 a XT60i (15A) en Amazon",
  },

  CABLE_MC4_DC7909_DC8020: {
    id: "cable-mc4-dc7909-dc8020",
    brand: "Jackery",
    badge: "🔌 Adaptador Solar Universal para Jackery (MC4 a DC7909 / DC8020)",
    title:
      "Cable Solar MC4 a DC 8mm (DC7909 + Adaptador DC8020) Compatible con Jackery y BLUETTI EB3A",
    subtitle:
      "Indispensable para conectar paneles solares plegables universales (Renogy, ZOUPW, EcoFlow) a estaciones Jackery Explorer (DC7909 de 7.9mm y DC8020 de 8.0mm en modelos Plus/v2).",
    features: [
      "Incluye punta de 7.9x0.9mm (Jackery clásicos y EB3A) + adaptador DC8020 (Explorer Plus/v2)",
      "Calibre 12AWG/14AWG resistente a rayos UV e intemperie",
      "Conector Y paralelo opcional para sumar 2 paneles de 100W sin subir el voltaje Voc",
    ],
    categoryType: "cable-adapter",
    specs: {
      capacityWh: "Soporta hasta 200W–400W por puerto DC8020",
      powerW: "Compatible 12V–60V (verificar límite Voc)",
      weightAndRecharge: "Longitud 1.5 m – 3 m",
      budgetRange: "precio variable en Amazon en Amazon EE. UU.",
      compatibleSolarCable: "MC4 a DC7909 / DC8020 (Jackery & EB3A)",
    },
    queryUS: "MC4 to DC 8mm DC7909 DC8020 Solar Adapter Cable Jackery",
    queryES: "cable adaptador solar MC4 a DC7909 DC8020 Jackery",
    ctaLabel: "Ver Adaptador MC4 a DC8020 / DC7909 en Amazon",
  },

  EXTENSION_SOLAR_Y_CONECTORES: {
    id: "extension-solar-mc4-y-split",
    brand: "Universal",
    badge: "☀️ Extensión Solar 10AWG (20–30 ft) + Conectores Y Paralelo MC4",
    title:
      "Cable de Extensión Solar 10AWG MC4 (20–30 ft) + Divisor Y en Paralelo Impermeable IP68",
    subtitle:
      "Permite dejar tu estación protegida a la sombra dentro de casa, carpa o camper mientras los paneles quedan al sol directo sin perder watts por cable delgado.",
    features: [
      "Calibre 10AWG de baja resistencia para tramos de 6 a 10 metros sin caída de tensión",
      "Conectores Y (MMF + FFM) para sumar amperios en paralelo sin superar el límite Voc",
      "Aislamiento XLPE resistente al sol, lluvia y pisadas en campamento",
    ],
    categoryType: "cable-adapter",
    specs: {
      capacityWh: "Hasta 30A / 1000V DC nominal",
      powerW: "Reduce pérdida por distancia a <2 %",
      weightAndRecharge: "Tramos de 6 m / 9 m (20 ft / 30 ft)",
      budgetRange: "precio variable en Amazon en Amazon EE. UU.",
      compatibleSolarCable: "Estándar universal MC4 IP68",
    },
    queryUS: "10AWG Solar Extension Cable 20ft 30ft MC4 Y Branch Parallel Connectors",
    queryES: "cable extension solar 10AWG MC4 conectores Y paralelo",
    ctaLabel: "Ver Extensiones Solares 10AWG y Conectores Y",
  },

  REFRIGERADORA_PORTATIL_12V: {
    id: "refrigeradora-portatil-12v-compresor",
    brand: "Universal",
    badge: "🧊 Compañera Ideal de Camping & Cortes de Luz (18W Promedio)",
    title:
      "BougeRV / ICECO 12V Portable Fridge Freezer (23–40 Qt) — Compresor Eficiente Bajo Consumo",
    subtitle:
      "A diferencia de las neveras termoeléctricas que consumen 60W constantes, un compresor 12V en modo Eco promedia ~15–20 Wh/hora: dura hasta 48 horas con una estación de 1000Wh.",
    features: [
      "Compresor DC 12V/24V regulado (congela hasta -20 °C sin usar hielo ni agua)",
      "Modo ECO de 35–45W que solo enciende 30–40 % del tiempo una vez fría",
      "Funciona directa en el puerto de encendedor 12V de Jackery, EcoFlow o BLUETTI",
    ],
    categoryType: "fridge-accessory",
    specs: {
      capacityWh: "Consumo medio real ~15–22 Wh por hora",
      powerW: "35W–45W al comprimir (12V DC / 120V AC)",
      weightAndRecharge: "10.5 – 14 kg · Dura +45 h con 1024Wh",
      budgetRange: "precio variable en Amazon en Amazon EE. UU.",
      compatibleSolarCable: "Cable coche 12V incluido + panel 100W-200W",
    },
    queryUS: "BougeRV ICECO 12V Portable Refrigerator Freezer Camping Compressor",
    queryES: "nevera refrigeradora portatil 12V compresor camping coche",
    ctaLabel: "Ver Refrigeradoras 12V de Bajo Consumo en Amazon",
  },

  TRANSFER_SWITCH_RELIANCE: {
    id: "transfer-switch-reliance-30a",
    brand: "Universal",
    badge: "🏠 Seguridad Eléctrica Real para Circuitos de Casa durante Apagones",
    title:
      "Reliance Controls Pro/Tran2 Manual Transfer Switch (6 Circuitos / 30A) + Cable NEMA L14-30/TT-30",
    subtitle:
      "La forma segura y reglamentaria de alimentar la refrigeradora, el router Wi-Fi y las luces del techo de tu casa desde una estación de 2000Wh–3600Wh sin cables peligrosos.",
    features: [
      "Evita el peligroso retroceso de corriente hacia la calle (sin cables macho-macho ilegales)",
      "Permite seleccionar qué 6 a 10 circuitos esenciales alimenta tu estación portátil",
      "Compatible con EcoFlow DELTA Pro, BLUETTI AC200L/AC300 y Jackery 2000 Plus",
    ],
    categoryType: "cable-adapter",
    specs: {
      capacityWh: "Soporta 30A (hasta 3600W–7500W)",
      powerW: "Entrada 120V / 240V según modelo",
      weightAndRecharge: "Instalación junto al tablero principal",
      budgetRange: "precio variable en Amazon en Amazon EE. UU.",
      compatibleSolarCable: "Adaptador NEMA TT-30 / L14-30P",
    },
    queryUS: "Reliance Controls Pro Tran 2 30 Amp Transfer Switch 6 Circuit",
    queryES: "conmutador transferencia manual tablero electrico respaldo",
    ctaLabel: "Ver Switch de Transferencia Seguro en Amazon",
  },
};

const KEYWORDS_BY_MODEL: Array<{ match: RegExp; key: keyof typeof CATALOG }> = [
  { match: /100-plus|avion|faa|99wh/i, key: "JACKERY_100_PLUS" },
  { match: /240-v2|explorer-240/i, key: "JACKERY_240_V2" },
  { match: /300-plus|explorer-300/i, key: "JACKERY_300_PLUS" },
  { match: /600-plus|explorer-600/i, key: "JACKERY_600_PLUS" },
  { match: /1000-plus|explorer-1000-plus/i, key: "JACKERY_1000_PLUS" },
  { match: /2000-plus|2000-v2|3000-pro|explorer-2000/i, key: "JACKERY_2000_PLUS" },
  { match: /jackery.*1000|1000-v2/i, key: "JACKERY_1000_V2" },
  { match: /river-3|ups|10ms/i, key: "ECOFLOW_RIVER_3_PLUS" },
  { match: /river-2-max|river-2(?!-pro)/i, key: "ECOFLOW_RIVER_2_MAX" },
  { match: /river-2-pro/i, key: "ECOFLOW_RIVER_2_PRO" },
  { match: /delta-3/i, key: "ECOFLOW_DELTA_3_PLUS" },
  { match: /delta-2-max|2048wh/i, key: "ECOFLOW_DELTA_2_MAX" },
  { match: /delta-pro|3600wh/i, key: "ECOFLOW_DELTA_PRO" },
  { match: /delta-2/i, key: "ECOFLOW_DELTA_2" },
  { match: /eb3a|ac2a|ac50b/i, key: "BLUETTI_EB3A" },
  { match: /ac70/i, key: "BLUETTI_AC70" },
  { match: /ac200|elite-200|ac300/i, key: "BLUETTI_AC200L" },
  { match: /ac180|bluetti/i, key: "BLUETTI_AC180" },
  { match: /solix-c300|c300/i, key: "ANKER_SOLIX_C300" },
  { match: /anker|solix/i, key: "ANKER_SOLIX_C1000" },
  { match: /solarsaga-100|solarsaga-40/i, key: "PANEL_JACKERY_SOLARSAGA_100W" },
  { match: /solarsaga-200/i, key: "PANEL_JACKERY_SOLARSAGA_200W" },
  { match: /bifacial|220w/i, key: "PANEL_ECOFLOW_220W_BIFACIAL" },
  { match: /110w|160w/i, key: "PANEL_ECOFLOW_160W_110W" },
  { match: /pv200|pv120/i, key: "PANEL_BLUETTI_PV200" },
  { match: /400w|pv350|350w/i, key: "PANEL_400W_PLEGABLE" },
  { match: /renogy|zoupw|allpowers|panel/i, key: "PANEL_UNIVERSAL_RENOGY_ZOUPW_200W" },
  { match: /alternador.*800|alternator/i, key: "ECOFLOW_800W_ALTERNATOR_CHARGER" },
  { match: /charger-1|560w/i, key: "BLUETTI_CHARGER_1_560W" },
  { match: /extra|expansion|b300/i, key: "ECOFLOW_DELTA2_EXTRA_BATTERY" },
  { match: /gan|usb-c|140w/i, key: "CARGADOR_GAN_140W_USBC" },
  { match: /xt60i|xt60/i, key: "CABLE_MC4_XT60I_15A" },
  { match: /dc7909|dc8020|8mm/i, key: "CABLE_MC4_DC7909_DC8020" },
  { match: /transfer|switch|tt-30/i, key: "TRANSFER_SWITCH_RELIANCE" },
  { match: /extension|paralelo|serie|y-mc4|mppt/i, key: "EXTENSION_SOLAR_Y_CONECTORES" },
  { match: /refrigeradora|nevera|bougerv|iceco|glacier/i, key: "REFRIGERADORA_PORTATIL_12V" },
  { match: /jackery/i, key: "JACKERY_1000_V2" },
  { match: /ecoflow/i, key: "ECOFLOW_DELTA_2" },
];

function pickMatchingProduct(text: string, fallback: keyof typeof CATALOG): AmazonProductRecommendation {
  for (const rule of KEYWORDS_BY_MODEL) {
    if (rule.match.test(text)) return CATALOG[rule.key];
  }
  return CATALOG[fallback];
}

export function getContextualAmazonProducts(
  slug: string,
  pillar: string,
  title: string
): {
  sectionTitle: string;
  sectionSubtitle: string;
  products: [
    AmazonProductRecommendation,
    AmazonProductRecommendation,
    AmazonProductRecommendation,
  ];
  vsCompetitor: AmazonProductRecommendation;
} {
  const s = `${slug} ${title}`.toLowerCase();

  // Comparativas VS (detecta A vs B)
  if (pillar === "comparativas-jackery-ecoflow-bluetti" || s.includes("-vs-")) {
    const parts = slug.split("-vs-");
    const leftText = parts[0] || s;
    const rightText = parts.slice(1).join("-") || s;
    const prodA = pickMatchingProduct(leftText, "JACKERY_1000_V2");
    let prodB = pickMatchingProduct(rightText, "ECOFLOW_DELTA_2");
    if (prodB.id === prodA.id) {
      prodB = prodA.brand === "EcoFlow" ? CATALOG.BLUETTI_AC180 : CATALOG.ECOFLOW_DELTA_2;
    }
    const compatAccessory =
      prodA.brand === "Jackery"
        ? CATALOG.PANEL_JACKERY_SOLARSAGA_200W
        : prodA.brand === "BLUETTI"
        ? CATALOG.PANEL_BLUETTI_PV200
        : CATALOG.PANEL_ECOFLOW_220W_BIFACIAL;

    return {
      sectionTitle: "Comparativa Directa y Paneles Compatibles en Amazon",
      sectionSubtitle:
        "Compara precios actualizados en Amazon EE. UU. (y España) y confirma qué panel solar o cable compatible acompaña mejor cada estación.",
      products: [prodA, prodB, compatAccessory],
      vsCompetitor: prodB,
    };
  }

  // Paneles solares plegables o MPPT
  if (
    pillar === "paneles-solares-plegables" ||
    pillar === "compatibilidad-solar-mppt-y-carga"
  ) {
    const p1 = pickMatchingProduct(s, "PANEL_ECOFLOW_220W_BIFACIAL");
    const p2 =
      p1.brand === "Jackery"
        ? CATALOG.JACKERY_1000_V2
        : p1.brand === "BLUETTI"
        ? CATALOG.BLUETTI_AC180
        : CATALOG.ECOFLOW_DELTA_2;
    const p3 =
      p1.brand === "Jackery"
        ? CATALOG.CABLE_MC4_DC7909_DC8020
        : CATALOG.CABLE_MC4_XT60I_15A;
    return {
      sectionTitle: "Panel Solar Plegable + Estación + Cable Compatible",
      sectionSubtitle:
        "Combina el panel solar monocristalino adecuado con su estación compatible y el conector correcto (XT60i, DC8020 o extensión 10AWG).",
      products: [p1, p2, p3],
      vsCompetitor: CATALOG.PANEL_UNIVERSAL_RENOGY_ZOUPW_200W,
    };
  }

  // Cables, adaptadores, voltaje o transferencia
  if (
    pillar === "cables-adaptadores-y-transferencia" ||
    pillar === "conectores-cables-inversores-y-voltaje"
  ) {
    const p1 = pickMatchingProduct(s, "CABLE_MC4_XT60I_15A");
    const p2 = /jackery|dc7909|dc8020/i.test(s)
      ? CATALOG.CABLE_MC4_DC7909_DC8020
      : CATALOG.EXTENSION_SOLAR_Y_CONECTORES;
    const p3 = /transfer|casa|apagon/i.test(s)
      ? CATALOG.ECOFLOW_DELTA_2_MAX
      : CATALOG.ECOFLOW_DELTA_2;
    return {
      sectionTitle: "Cables Compatibles, Adaptadores y Estaciones Recomendadas",
      sectionSubtitle:
        "Asegura los conectores correctos (MC4 a XT60i de 15A, DC7909/DC8020 o switch de transferencia) para aprovechar el 100 % de carga.",
      products: [p1, p2, p3],
      vsCompetitor: p2,
    };
  }

  // Cargadores de alternador, baterías extra, neveras y accesorios
  if (
    pillar === "cargadores-baterias-extra-y-accesorios" ||
    /alternador|refrigeradora|nevera/i.test(s)
  ) {
    const p1 = /refrigeradora|nevera/i.test(s)
      ? CATALOG.REFRIGERADORA_PORTATIL_12V
      : /alternador|560w|800w/i.test(s)
      ? pickMatchingProduct(s, "ECOFLOW_800W_ALTERNATOR_CHARGER")
      : pickMatchingProduct(s, "ECOFLOW_DELTA2_EXTRA_BATTERY");
    const p2 = /refrigeradora|nevera/i.test(s)
      ? CATALOG.ECOFLOW_DELTA_2
      : CATALOG.BLUETTI_CHARGER_1_560W;
    const p3 = /refrigeradora|nevera/i.test(s)
      ? CATALOG.PANEL_ECOFLOW_220W_BIFACIAL
      : CATALOG.CARGADOR_GAN_140W_USBC;
    return {
      sectionTitle: "Accesorios, Carga en Ruta y Autonomía Extendida",
      sectionSubtitle:
        "Multiplica tu autonomía fuera de red con cargadores de alternador, neveras de compresor 12V eficientes y baterías de expansión LiFePO4.",
      products: [p1, p2, p3],
      vsCompetitor: p2,
    };
  }

  // Cortes de luz / Respaldo en casa / Electrodomésticos >1500W
  if (
    pillar === "cortes-de-luz-y-respaldo-en-casa" ||
    pillar === "potencia-pico-xboost-y-electrodomesticos" ||
    /2000wh|3000wh|3600wh|casa|apagon|microondas|refrigeradora-domestica/i.test(s)
  ) {
    const p1 = /2000|2048|3600|nevera|casa-completa/i.test(s)
      ? pickMatchingProduct(s, "ECOFLOW_DELTA_2_MAX")
      : /ups|router|pc|computadora/i.test(s)
      ? CATALOG.ECOFLOW_DELTA_3_PLUS
      : pickMatchingProduct(s, "ECOFLOW_DELTA_2");
    const p2 =
      p1.id === "ecoflow-delta-2-max"
        ? CATALOG.BLUETTI_AC200L
        : CATALOG.BLUETTI_AC180;
    const p3 = /2000|3600|casa-completa/i.test(s)
      ? CATALOG.PANEL_400W_PLEGABLE
      : CATALOG.PANEL_ECOFLOW_220W_BIFACIAL;
    return {
      sectionTitle: "Estaciones LiFePO4 Recomendadas para Cortes de Luz en Casa",
      sectionSubtitle:
        "Respaldo silencioso y seguro para interiores con conmutación rápida UPS/EPS y paneles plegables compatibles para apagones largos.",
      products: [p1, p2, p3],
      vsCompetitor: p2,
    };
  }

  // Camping, viajes, router, laptop, avion
  if (
    pillar === "energia-para-camping-viajes-y-camper" ||
    /router|laptop|cpap|camping|avion|ligera|300wh|500wh/i.test(s)
  ) {
    const p1 = pickMatchingProduct(s, "JACKERY_300_PLUS");
    const p2 =
      p1.id === "jackery-explorer-300-plus"
        ? CATALOG.ECOFLOW_RIVER_2_MAX
        : CATALOG.JACKERY_1000_V2;
    const p3 =
      p1.brand === "Jackery"
        ? CATALOG.PANEL_JACKERY_SOLARSAGA_100W
        : CATALOG.PANEL_ECOFLOW_160W_110W;
    return {
      sectionTitle: "Equipos Portátiles para Camping, Viajes y Trabajo Remoto",
      sectionSubtitle:
        "Estaciones LiFePO4 ligeras para alimentar router, laptop o refrigeradora 12V junto a su panel solar plegable compatible.",
      products: [p1, p2, p3],
      vsCompetitor: p2,
    };
  }

  // Reseñas y default general (Estación + Panel Solar + Cable Compatible)
  const main = pickMatchingProduct(s, "ECOFLOW_DELTA_2");
  const solar =
    main.brand === "Jackery"
      ? main.id.includes("300") || main.id.includes("240") || main.id.includes("100")
        ? CATALOG.PANEL_JACKERY_SOLARSAGA_100W
        : CATALOG.PANEL_JACKERY_SOLARSAGA_200W
      : main.brand === "BLUETTI"
      ? CATALOG.PANEL_BLUETTI_PV200
      : CATALOG.PANEL_ECOFLOW_220W_BIFACIAL;
  const cable =
    main.brand === "Jackery"
      ? CATALOG.CABLE_MC4_DC7909_DC8020
      : CATALOG.CABLE_MC4_XT60I_15A;

  return {
    sectionTitle: "Selección Recomendada + Panel Solar y Cable Compatible en Amazon",
    sectionSubtitle:
      "Consulta precios actualizados en Amazon EE. UU. (o cambia a Amazon España) para armar tu kit completo sin errores de compatibilidad.",
    products: [main, solar, cable],
    vsCompetitor:
      main.id === "ecoflow-delta-2"
        ? CATALOG.JACKERY_1000_V2
        : CATALOG.ECOFLOW_DELTA_2,
  };
}
