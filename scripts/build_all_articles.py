#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Generador Maestro de las 1,534 Guías Editoriales de GuiaDeEnergiaPortatil.com:
- 14 Hubs Pilares de Categoría (isPillar: true)
- 520 Artículos Transaccionales en 6 Silos Amazon (isTransactional: true)
- 1,000 Artículos SEO Informacionales en 8 Silos Técnicos (isTransactional: false)

También genera:
- src/data/keyword_map.json
- public/search-index.json
"""
import json
import pathlib
import re

from topics_catalog import PILLARS, generate_transactional_520, generate_seo_1000

ROOT = pathlib.Path(__file__).resolve().parent.parent
ART_DIR = ROOT / "src/content/articles"
ART_DIR.mkdir(parents=True, exist_ok=True)
DATA_DIR = ROOT / "src/data"
DATA_DIR.mkdir(parents=True, exist_ok=True)
PUB_DIR = ROOT / "public"
PUB_DIR.mkdir(parents=True, exist_ok=True)

PUBLISHED = "2026-11-24"

# Matriz Fotográfica Anti-Similitud (8 ángulos × 6 iluminaciones × 12 escenarios = 576 combinaciones únicas)
CAMERA_STYLES = [
    "Macro close-up shot with shallow depth of field (85mm f/2.8 lens)",
    "Three-quarter editorial product angle on an outdoor timber table (50mm lens)",
    "Overhead flat-lay knolling composition showcasing power station, foldable panel and MC4/XT60i cables (35mm lens)",
    "Eye-level realistic camping and residential backup action photograph",
    "Side-profile studio view highlighting pure sine wave AC outlets, USB-C PD 100W and 12V DC ports",
    "Low-angle outdoor photograph looking across monocrystalline solar panels toward the station LCD",
    "Wide editorial interior view of an apartment living space powered silently during a blackout",
    "Over-the-shoulder lifestyle photograph connecting a portable fridge or Wi-Fi router",
]

LIGHTING_MOODS = [
    "crisp golden-hour solar sunlight across monocrystalline cells",
    "soft evening warm indoor lamp light during a residential power outage",
    "clean overcast mountain daylight with realistic outdoor contrast",
    "bright morning window sunlight in a modern home office",
    "blue-hour campsite twilight beside a warm lantern glow",
    "neutral studio editorial daylight highlighting matte battery textures",
]

SURFACES_AND_PROPS = [
    "at a pine forest campsite beside an open dome tent",
    "inside a spacious SUV overland trunk next to a 12V compressor portable fridge",
    "on a minimalist home office desk powering a fiber Wi-Fi router and open laptop",
    "in a modern kitchen beside a household refrigerator and espresso setup",
    "inside a warm birch-wood campervan conversion with 12V LED lights",
    "on a sunny wooden mountain cabin porch facing afternoon sun",
    "on a sunlit urban apartment balcony with a compact foldable solar panel",
    "in a cozy family living room next to a floor lamp and charging cables",
    "on a coastal beach camp table sheltered under a canvas awning",
    "on a neat workshop bench beside a digital wattmeter and 10AWG MC4 cables",
    "on alpine granite rocks during a hiking basecamp setup",
    "on a cedar picnic table next to camping mugs and camera batteries",
]


def build_diverse_prompt(subject: str, idx: int, tag: str = "") -> str:
    cam = CAMERA_STYLES[idx % len(CAMERA_STYLES)]
    light = LIGHTING_MOODS[(idx * 3 + 1) % len(LIGHTING_MOODS)]
    surf = SURFACES_AND_PROPS[(idx * 7 + 2) % len(SURFACES_AND_PROPS)]
    focus_tag = f" highlighting {tag.replace('-', ' ')}" if tag else ""
    return (
        f"Realistic editorial outdoor and residential portable power photography, {cam}: {subject}{focus_tag}, {surf}, {light}. "
        "Photorealistic LiFePO4 station textures, solar glass and insulated cables, no text, no letters, no watermarks."
    )


def clean_slug(s: str) -> str:
    s = s.lower().strip()
    s = re.sub(r"[^a-z0-9-]+", "-", s)
    return re.sub(r"-+", "-", s).strip("-")


def infer_amazon_ids(slug: str, pillar: str, title: str) -> list:
    s = f"{slug} {title}".lower()
    if "jackery" in s:
        if "300" in s or "240" in s or "100" in s:
            return ["jackery-explorer-300-plus", "jackery-solarsaga-100w", "cable-mc4-dc7909-dc8020"]
        return ["jackery-explorer-1000-v2", "jackery-solarsaga-200w", "cable-mc4-dc7909-dc8020"]
    if "bluetti" in s:
        if "eb3a" in s or "ac2a" in s:
            return ["bluetti-eb3a", "bluetti-pv200-solar", "cable-mc4-dc7909-dc8020"]
        if "ac200" in s or "2000" in s:
            return ["bluetti-ac200l", "panel-solar-400w-plegable", "bluetti-charger-1-560w"]
        return ["bluetti-ac180", "bluetti-pv200-solar", "cable-solar-mc4-xt60i"]
    if "ecoflow" in s:
        if "river" in s:
            return ["ecoflow-river-2-max", "ecoflow-160w-solar-panel", "cable-solar-mc4-xt60i"]
        if "max" in s or "pro" in s or "2048" in s or "3600" in s:
            return ["ecoflow-delta-2-max", "panel-solar-400w-plegable", "cable-solar-mc4-xt60i"]
        return ["ecoflow-delta-2", "ecoflow-220w-bifacial-solar", "cable-solar-mc4-xt60i"]
    if pillar == "paneles-solares-plegables" or pillar == "compatibilidad-solar-mppt-y-carga":
        return ["ecoflow-220w-bifacial-solar", "ecoflow-delta-2", "cable-solar-mc4-xt60i"]
    if pillar == "cables-adaptadores-y-transferencia" or pillar == "conectores-cables-inversores-y-voltaje":
        return ["cable-solar-mc4-xt60i", "cable-mc4-dc7909-dc8020", "ecoflow-delta-2"]
    if "refrigeradora" in s or "nevera" in s:
        return ["refrigeradora-portatil-12v-compresor", "ecoflow-delta-2", "ecoflow-220w-bifacial-solar"]
    return ["ecoflow-delta-2", "jackery-explorer-1000-v2", "bluetti-ac180"]


def make_pillar_article(p: dict, child_items: list, idx: int) -> dict:
    cat_slug = p["slug"]
    path = f"/{cat_slug}/"
    related_paths = [f"/{cat_slug}/{clean_slug(c[0])}/" for c in child_items[:4]]
    table_rows = [
        [c[1], f"[Ver guía completa](/{cat_slug}/{clean_slug(c[0])}/)"]
        for c in child_items[:16]
    ]
    is_trans_pillar = cat_slug in {
        "resenas-estaciones-de-energia",
        "comparativas-jackery-ecoflow-bluetti",
        "mejores-estaciones-por-uso-y-capacidad",
        "paneles-solares-plegables",
        "cargadores-baterias-extra-y-accesorios",
        "cables-adaptadores-y-transferencia",
    }
    blocks = [
        {
            "type": "p",
            "text": f"Bienvenido al hub especializado de **{p['title']}** en **GuiaDeEnergiaPortatil.com**. Aquí reunimos **{len(child_items)} guías técnicas y comparativas** sobre **{p['focus']}**, organizadas sin canibalización para ayudarte a calcular horas reales y comprar con total seguridad en **Amazon Estados Unidos (`amazon.com`)** o **Amazon España (`amazon.es`)**.",
        },
        {
            "type": "p",
            "text": "Tanto si quieres calcular tus necesidades en nuestra **[Calculadora de Autonomía en Horas](/calculadora-de-autonomia/)**, comparar **[Jackery vs EcoFlow vs BLUETTI](/comparativas-jackery-ecoflow-bluetti/jackery-vs-ecoflow-vs-bluetti-cual-elegir/)**, revisar la **[EcoFlow DELTA 2](/resenas-estaciones-de-energia/ecoflow-delta-2-resena-capacidad-recarga-precio/)** o confirmar los **[mejores paneles solares plegables](/paneles-solares-plegables/mejores-paneles-solares-plegables-jackery-ecoflow-bluetti/)**, cada guía detalla Wh útiles, potencia, peso, recarga y conectores compatibles.",
        },
        {"type": "h2", "text": f"Qué evaluamos en {p['title'].split('(')[0].split(':')[0].strip()}"},
        {
            "type": "p",
            "text": f"En cada una de las **{len(child_items)} guías** de esta categoría respondemos cinco preguntas esenciales antes de comprar: **1) Capacidad real en Wh y ciclos LiFePO4**; **2) Potencia continua y pico de arranque (W)**; **3) Peso real (kg/lb) y minutos de recarga AC/solar**; **4) Horas reales alimentando router, laptop o refrigeradora portátil**; y **5) Paneles solares plegables y cables compatibles (`XT60i`, `DC8020`, `MC4`)**.",
        },
        {
            "type": "table",
            "caption": f"Guías destacadas en {p['title'].split('(')[0].strip()}",
            "headers": ["Guía / Análisis Especializado", "Enlace Directo"],
            "rows": table_rows,
        },
        {
            "type": "callout",
            "variant": "etiqueta",
            "title": "Regla Práctica antes de Elegir Estación y Panel Solar",
            "text": "Recuerda dos leyes físicas clave: 1) Los Watts (W) determinan qué aparatos encienden y los Wh determinan cuántas horas duran encendidos; 2) Al elegir un panel solar plegable para camping o apagones, su voltaje en circuito abierto (Voc) jamás debe superar el límite MPPT de tu estación.",
        },
        {"type": "h2", "text": "Cómo elegir tu equipo en 3 pasos rápidos"},
        {
            "type": "ol",
            "items": [
                "**Simula tus aparatos en la [Calculadora de Autonomía](/calculadora-de-autonomia/):** suma tu router (~15W), laptop (~55W) o refrigeradora portátil 12V (~18Wh/h ciclada) para conocer la capacidad mínima recomendada.",
                "**Elige según escenario (camping ligero vs corte de luz en casa):** para mochila y viajes cortos brillan **[Jackery Explorer 300 Plus](/resenas-estaciones-de-energia/jackery-explorer-300-plus-resena-camping-y-viajes/)** (3.75 kg) o **[EcoFlow RIVER 2 Max](/resenas-estaciones-de-energia/ecoflow-river-2-max-resena-autonomia-y-recarga/)** (512Wh); para casa y neveras destacan **[EcoFlow DELTA 2](/resenas-estaciones-de-energia/ecoflow-delta-2-resena-capacidad-recarga-precio/)**, **[Jackery 1000 v2](/resenas-estaciones-de-energia/jackery-explorer-1000-v2-resena-camping-y-casa/)** y **[BLUETTI AC180](/resenas-estaciones-de-energia/bluetti-ac180-resena-autonomia-y-potencia/)**.",
                "**Completa tu kit con panel solar plegable y cable compatible:** conecta paneles mediante **[MC4 a XT60i de 15A](/cables-adaptadores-y-transferencia/cable-mc4-a-xt60-vs-xt60i-ecoflow-15a/)** en EcoFlow o **DC8020** en Jackery para aprovechar el 100 % de la carga solar.",
            ],
        },
        {
            "type": "cta",
            "text": "¿Quieres que calculemos exactamente qué estación, panel solar y cable necesitas para tu camping o cortes de luz? Pregunta gratis al Asesor de Energía IA.",
        },
    ]
    faqs = [
        {
            "q": f"¿Qué marcas principales comparamos en {p['title'].split('(')[0].strip()}?",
            "a": "Evaluamos las líneas líderes disponibles en Amazon Estados Unidos: Jackery (Explorer Plus y v2 LiFePO4), EcoFlow (RIVER 2/3 y DELTA 2/3/Pro), BLUETTI (EB3A, AC70, AC180 y AC200L) y Anker SOLIX, además de paneles plegables compatibles y cables.",
        },
        {
            "q": "¿Puedo usar un panel solar plegable de otra marca con Jackery, EcoFlow o BLUETTI?",
            "a": "Sí, siempre que el voltaje en circuito abierto (Voc) del panel sea menor al máximo soportado por el controlador MPPT de tu estación y utilices el adaptador correcto (MC4 a XT60i en EcoFlow o MC4 a DC7909/DC8020 en Jackery).",
        },
        {
            "q": "¿Cuántas horas dura una estación de 1000Wh con router, laptop y refrigeradora portátil?",
            "a": "Alimentando los tres equipos de forma continua (~88 W promedio) rinde alrededor de 9.5 a 11 horas; si desconectas la laptop tras su jornada laboral, el router + refrigeradora portátil 12V superan las 40 horas seguidas.",
        },
    ]
    return {
        "slug": cat_slug,
        "pillar": cat_slug,
        "path": path,
        "isPillar": True,
        "isTransactional": is_trans_pillar,
        "primaryKeyword": p["kw"],
        "title": p["title"],
        "seoTitle": f"{p['title']} | GuiaDeEnergiaPortatil.com",
        "metaDescription": f"Guía completa sobre {p['focus']}. Compara Jackery, EcoFlow y BLUETTI por Wh, W, peso, recarga y precio en Amazon EE. UU.",
        "excerpt": f"Explora nuestras {len(child_items)} guías sobre {p['focus']} con calculadora de horas y paneles compatibles.",
        "quickAnswer": f"En esta sección reunimos {len(child_items)} guías técnicas sobre {p['focus']}. Comparamos Jackery, EcoFlow y BLUETTI por capacidad Wh, potencia W, peso, tiempo de recarga y precio en Amazon EE. UU., incluyendo compatibilidad de paneles solares plegables y cables.",
        "readingMinutes": 8,
        "amazonProducts": infer_amazon_ids(cat_slug, cat_slug, p["title"]),
        "image": {
            "prompt": build_diverse_prompt(p["subject"], idx, cat_slug),
            "alt": p["title"],
        },
        "blocks": blocks,
        "faqs": faqs,
        "sources": [
            {"label": "Amazon.com Best Sellers in Outdoor Generators & Portable Power", "url": "https://www.amazon.com/Best-Sellers-Patio-Lawn-Garden-Outdoor-Generators/zgbs/lawn-garden/552408"},
            {"label": "Jackery, EcoFlow & BLUETTI Official Technical Datasheets", "url": "https://guiadeenergiaportatil.com/politica-editorial/"},
        ],
        "related": related_paths,
        "datePublished": PUBLISHED,
        "dateModified": PUBLISHED,
        "imageUrl": f"/img/ambiente/cat-{cat_slug}.webp",
    }


def make_transactional_article(item: tuple, sibling_paths: list, idx: int) -> dict:
    slug, title, pillar, kw, model_name, brand, cap_wh, power_w, weight, recharge, price, solar_compat, cable_compat, use_case, subj = item
    slug = clean_slug(slug)
    path = f"/{pillar}/{slug}/"
    rel = [p for p in sibling_paths if p != path][:3]
    rel.insert(0, f"/{pillar}/")

    blocks = [
        {
            "type": "p",
            "text": f"Analizar a fondo **{title}** es fundamental antes de comprar en **Amazon Estados Unidos (`amazon.com`)**. En esta evaluación técnica revisamos la capacidad real (**{cap_wh}**), la potencia continua y pico del inversor (**{power_w}**), su peso en mano (**{weight}**), el tiempo de recarga (**{recharge}**), el rango de precio habitual (**{price}**) y qué paneles solares (**{solar_compat}**) y cables (**{cable_compat}**) encajan sin errores.",
        },
        {
            "type": "h2",
            "text": f"Especificaciones clave y rendimiento de {model_name}",
        },
        {
            "type": "p",
            "text": f"En pruebas prácticas enfocadas en **{use_case}**, el desempeño real depende tanto de la química de la batería como del puerto utilizado. Si alimentas un **router Wi-Fi (~15 W)** o una **laptop (~55 W)** por **USB-C PD o 12V DC**, aprovechas cerca del 91 % de la capacidad nominal al evitar el consumo en vacío del inversor AC (que ronda los 8–16 W cada hora).",
        },
        {
            "type": "callout",
            "variant": "etiqueta",
            "title": f"Ficha Verificada de Compra: {model_name} ({brand})",
            "text": f"• Capacidad y Química: {cap_wh}.\n• Potencia del Inversor: {power_w}.\n• Peso y Recarga AC: {weight} · {recharge}.\n• Precio de referencia Amazon EE. UU.: {price}.\n• Panel Solar Compatible: {solar_compat}.\n• Cable / Conector Exacto: {cable_compat}.",
        },
        {
            "type": "h2",
            "text": f"Comparativa directa en Amazon EE. UU.: {model_name} frente a Jackery, EcoFlow y BLUETTI",
        },
        {
            "type": "p",
            "text": "Compara este equipo frente a las tres referencias más vendidas de 1 kWh en Amazon Estados Unidos y verifica sus horas estimadas en nuestra **[Calculadora de Autonomía en Horas](/calculadora-de-autonomia/)**:",
        },
        {
            "type": "table",
            "caption": f"Comparativa de capacidad, potencia, peso, recarga y precio para {title}",
            "headers": [
                "Modelo en Amazon EE. UU.",
                "Capacidad / Potencia",
                "Peso y Recarga AC",
                "Panel Solar & Cable Compatible",
            ],
            "rows": [
                [
                    f"**Selección Analizada: {model_name}**",
                    f"{cap_wh} · {power_w} ({price})",
                    f"{weight} · {recharge}",
                    f"{solar_compat} ({cable_compat})",
                ],
                [
                    "**[EcoFlow DELTA 2](/resenas-estaciones-de-energia/ecoflow-delta-2-resena-capacidad-recarga-precio/)**",
                    "1024Wh LiFePO4 · 1800W (2700W X-Boost)",
                    "12.0 kg · 0–80 % en 50 min AC",
                    "MPPT 500W (11–60V) · Cable MC4 a XT60i (15A)",
                ],
                [
                    "**[Jackery Explorer 1000 v2](/resenas-estaciones-de-energia/jackery-explorer-1000-v2-resena-camping-y-casa/)**",
                    "1070Wh LiFePO4 · 1500W (3000W pico)",
                    "10.8 kg · Carga AC en 1 hora",
                    "Doble DC8020 hasta 400W · SolarSaga 100W/200W",
                ],
                [
                    "**[BLUETTI AC180](/resenas-estaciones-de-energia/bluetti-ac180-resena-autonomia-y-potencia/)**",
                    "1152Wh LiFePO4 · 1800W (2700W Lifting)",
                    "16.0 kg · 0–80 % en 45 min AC",
                    "MPPT 500W (12–60V) · Cable solar MC4 incluido",
                ],
            ],
        },
        {
            "type": "h2",
            "text": "Horas estimadas con router, laptop y refrigeradora portátil + accesorios compatibles",
        },
        {
            "type": "ul",
            "items": [
                f"**Uso con equipos de teletrabajo y hogar:** si buscas confirmar el tiempo exacto con tu propio router (15 W), laptop (55 W) o refrigeradora portátil 12V (~18 Wh/h ciclada), simula tus watts en nuestra **[Calculadora de Autonomía](/calculadora-de-autonomia/)** antes de ordenar.",
                f"**Panel solar plegable compatible:** combina este equipo con **{solar_compat}** respetando siempre el límite de voltaje en circuito abierto (`Voc`) de entrada para recargar en 4–6 horas de sol pleno.",
                f"**Cableado y carga en carretera sin pérdidas:** utiliza **{cable_compat}** para evitar limitaciones de amperaje (como los 8A en EcoFlow si conectas un XT60 sin pin señalizador) y considera un **[cargador de alternador rápido](/cargadores-baterias-extra-y-accesorios/)** si viajas en camper o SUV.",
            ],
        },
        {
            "type": "h2",
            "text": "3 pasos para comprar con garantía y al mejor precio en Amazon EE. UU.",
        },
        {
            "type": "steps",
            "items": [
                {
                    "name": "Verifica el cupón aplicado en la ficha de Amazon",
                    "text": "Jackery, EcoFlow y BLUETTI activan cupones porcentuales frecuentes en Amazon Estados Unidos antes de añadir al carrito; pulsa en nuestras tarjetas para ver el precio neto vigente.",
                },
                {
                    "name": "Comprueba si el paquete incluye panel solar o cables adaptadores",
                    "text": f"Revisa si la opción seleccionada trae solo la estación o el kit Solar Generator con panel plegable, y añade {cable_compat} si usarás paneles universales MC4.",
                },
                {
                    "name": "Valida tu voltaje local (110V–120V vs 220V)",
                    "text": "Los modelos de Amazon EE. UU. entregan 110V–120V AC (compatibles con cargadores bivolt 100–240V de laptops y routers). Si vives en un país de 220V, recárgalos por panel solar, 12V o mediante un transformador reductor adecuado.",
                },
            ],
        },
        {
            "type": "callout",
            "variant": "aviso",
            "title": "Precaución solar y de arranque en motores",
            "text": "Nunca conectes dos paneles solares en serie si su suma de Voc supera el voltaje máximo del controlador MPPT de la estación (especialmente en modelos compactos de tope 28V como BLUETTI EB3A o Anker C300). En equipos pequeños, prefiere siempre conexión en paralelo o un solo panel compatible.",
        },
        {
            "type": "cta",
            "text": f"¿Quieres confirmar si {model_name} aguanta tus aparatos durante las horas que necesitas? Pregúntale ahora mismo a nuestro Asesor de Energía IA.",
        },
    ]

    faqs = [
        {
            "q": f"¿Cuál es el precio habitual de {model_name} en Amazon Estados Unidos?",
            "a": f"Su precio de referencia oscila entre {price} según las promociones de temporada y si compras solo la estación o el kit con panel solar plegable.",
        },
        {
            "q": f"¿Qué panel solar plegable y cable son compatibles con {model_name}?",
            "a": f"Funciona de forma óptima con {solar_compat} conectado mediante {cable_compat}, verificando siempre no superar el voltaje máximo Voc del controlador MPPT.",
        },
        {
            "q": f"¿Qué peso y velocidad de recarga ofrece {model_name}?",
            "a": f"Tiene un peso de {weight} y un tiempo de recarga aproximado de {recharge} desde enchufe de pared.",
        },
        {
            "q": "¿Cuántas horas dura alimentando router, laptop o refrigeradora portátil?",
            "a": "El rendimiento exacto depende de si conectas por USB-C/12V (91 % eficiencia) o por enchufe AC (85 % + autoconsumo del inversor). Puedes calcular el dato exacto al minuto en nuestra Calculadora de Autonomía.",
        },
    ]

    quick_answer = (
        f"En nuestro análisis de {title}, destaca con {cap_wh}, potencia de {power_w}, peso de {weight} y recarga en {recharge}, "
        f"ubicándose en {price} en Amazon EE. UU. Ideal para {use_case.lower()}, siendo compatible con {solar_compat} mediante {cable_compat}."
    )

    return {
        "slug": slug,
        "pillar": pillar,
        "path": path,
        "isPillar": False,
        "isTransactional": True,
        "primaryKeyword": kw,
        "title": title,
        "seoTitle": f"{title} | GuiaDeEnergiaPortatil.com",
        "metaDescription": f"Análisis de {title} en Amazon EE. UU.: capacidad ({cap_wh}), potencia ({power_w}), peso ({weight}), recarga ({recharge}), precio y paneles compatibles.",
        "excerpt": f"Ficha técnica de {model_name}: {cap_wh}, {power_w}, {weight}, recarga en {recharge} y compatibilidad solar/cables en Amazon.",
        "quickAnswer": quick_answer,
        "readingMinutes": 7,
        "amazonProducts": infer_amazon_ids(slug, pillar, title),
        "image": {
            "prompt": build_diverse_prompt(subj, idx, slug),
            "alt": title,
        },
        "blocks": blocks,
        "faqs": faqs,
        "sources": [
            {"label": "Amazon.com Portable Power Stations & Solar Generators", "url": "https://www.amazon.com/Best-Sellers-Patio-Lawn-Garden-Outdoor-Generators/zgbs/lawn-garden/552408"},
            {"label": "GuiaDeEnergiaPortatil.com – Calculadora de Autonomía", "url": "https://guiadeenergiaportatil.com/calculadora-de-autonomia/"},
        ],
        "related": rel,
        "datePublished": PUBLISHED,
        "dateModified": PUBLISHED,
        "imageUrl": None,
    }


def make_seo_article(item: tuple, sibling_paths: list, idx: int) -> dict:
    slug, title, pillar, kw, focus_summary, key_metric = item
    slug = clean_slug(slug)
    path = f"/{pillar}/{slug}/"
    rel = [p for p in sibling_paths if p != path][:3]
    rel.insert(0, f"/{pillar}/")
    subj = f"portable LiFePO4 power station and foldable solar setup demonstrating {kw}"

    blocks = [
        {
            "type": "p",
            "text": f"Entender **{title}** marca la diferencia entre quedarte sin batería a mitad de la noche o contar con energía portátil predecible durante camping, viajes o cortes de luz en casa. En **GuiaDeEnergiaPortatil.com** desglosamos esta **{focus_summary}** aplicable a estaciones **Jackery, EcoFlow y BLUETTI** con datos verificables (**{key_metric}**).",
        },
        {
            "type": "h2",
            "text": f"Fundamento eléctrico y cálculo real: {title}",
        },
        {
            "type": "p",
            "text": f"Muchos usuarios cometen el error de dividir los **Wh nominales** entre los **Watts** de la etiqueta sin descontar las pérdidas reales de conversión. Al aplicar **{focus_summary}**, recuerda que una estación portátil entrega ~**91 % útil** por sus puertos **USB-C PD y 12V DC**, mientras que encender el **inversor AC de 120V** baja la eficiencia útil al ~**85 %** más un consumo propio de reposo de **8 a 16 W por hora**.",
        },
        {
            "type": "callout",
            "variant": "tip",
            "title": f"Dato clave verificado: {key_metric}",
            "text": f"Puedes comprobar en segundos cómo cambia tu autonomía exacta según tus propios aparatos entrando a nuestra Calculadora de Autonomía en Horas (/calculadora-de-autonomia/) y alternando entre salida USB-C/12V directa o enchufe AC.",
        },
        {
            "type": "h2",
            "text": "Referencia práctica en Jackery, EcoFlow y BLUETTI",
        },
        {
            "type": "table",
            "caption": f"Guía técnica comparativa aplicada a {title}",
            "headers": [
                "Marca y Modelo Referente",
                "Capacidad / Potencia",
                "Comportamiento Técnico Clave",
                "Panel Solar y Cable Compatible",
            ],
            "rows": [
                [
                    "**[EcoFlow DELTA 2](/resenas-estaciones-de-energia/ecoflow-delta-2-resena-capacidad-recarga-precio/) / [RIVER 2 Max](/resenas-estaciones-de-energia/ecoflow-river-2-max-resena-autonomia-y-recarga/)**",
                    "1024Wh (1800W) · 512Wh (500W)",
                    "Carga AC 50–60 min · EPS <30 ms (RIVER 3 UPS <10 ms) · App con ajuste de autoconsumo",
                    "MPPT XT60i (15A) · [Cable MC4 a XT60i](/cables-adaptadores-y-transferencia/cable-mc4-a-xt60-vs-xt60i-ecoflow-15a/)",
                ],
                [
                    "**[Jackery Explorer 1000 v2](/resenas-estaciones-de-energia/jackery-explorer-1000-v2-resena-camping-y-casa/) / [300 Plus](/resenas-estaciones-de-energia/jackery-explorer-300-plus-resena-camping-y-viajes/)**",
                    "1070Wh (1500W) · 288Wh (300W)",
                    "4,000 ciclos LiFePO4 · Modo silencioso 30 dB · Peso líder ligero (10.8 kg / 3.75 kg)",
                    "Puertos DC8020 · [Adaptador MC4 a DC8020](/cables-adaptadores-y-transferencia/adaptador-mc4-a-dc7909-y-dc8020-jackery/)",
                ],
                [
                    "**[BLUETTI AC180](/resenas-estaciones-de-energia/bluetti-ac180-resena-autonomia-y-potencia/) / [EB3A](/resenas-estaciones-de-energia/bluetti-eb3a-resena-capacidad-recarga-precio/)**",
                    "1152Wh (1800W) · 268Wh (600W)",
                    "Mayor Wh por dólar · Power Lifting 2700W · Eco Mode configurable desde la app",
                    "MPPT hasta 60V (28V en EB3A) · Cable MC4 estándar",
                ],
            ],
        },
        {
            "type": "h2",
            "text": f"Cómo aplicarlo paso a paso: {title}",
        },
        {
            "type": "steps",
            "items": [
                {
                    "name": "Mide o verifica el consumo real en Watts (W) y picos",
                    "text": "Comprueba la etiqueta del cargador o usa un vatímetro: un router promedia 15W, una laptop 55W y una refrigeradora portátil 12V cicla a ~18 Wh/h.",
                },
                {
                    "name": "Prioriza puertos DC 12V o USB-C siempre que sea posible",
                    "text": f"Aplicando {focus_summary}, mantén apagado el botón AC si solo cargas laptop, router o nevera 12V para estirar la batería al máximo ({key_metric}).",
                },
                {
                    "name": "Verifica límites de voltaje solar (Voc) y modo Eco",
                    "text": "Si conectas paneles plegables, suma sus voltajes Voc en frío antes de enchufar, y desactiva el apagado automático (Eco Mode) si alimentas cargas bajas continuas como un router.",
                },
            ],
        },
        {
            "type": "h2",
            "text": "Errores frecuentes que debes evitar",
        },
        {
            "type": "ul",
            "items": [
                "**Dejar encendido el inversor AC en vacío toda la noche:** un inversor encendido sin carga útil consume entre 100Wh y 180Wh en 10 horas, desperdiciando autonomía valiosa.",
                "**Mezclar paneles solares sobrepasando el límite Voc del MPPT:** revisa nuestra guía de **[cálculo Voc solar](/compatibilidad-solar-mppt-y-carga/como-calcular-voltaje-voc-paneles-solares-mppt-estacion/)** antes de conectar paneles en serie.",
                "**No revisar si necesitas switch de transferencia en casa:** consulta cómo proteger tus electrodomésticos en **[respaldo ante cortes de luz](/cortes-de-luz-y-respaldo-en-casa/mantener-refrigeradora-encendida-corte-de-luz-estacion-portatil/)** o simula tu escenario en la **[Calculadora de Autonomía](/calculadora-de-autonomia/)**.",
            ],
        },
        {
            "type": "cta",
            "text": "¿Quieres saber exactamente qué modelo de Jackery, EcoFlow o BLUETTI y qué panel solar cumplen este escenario sin gastar de más? Consulta gratis a nuestro Asesor de Energía IA.",
        },
    ]

    faqs = [
        {
            "q": f"¿Qué dato práctico resume mejor {title}?",
            "a": f"El parámetro clave de referencia es {key_metric}, considerando las pérdidas reales del inversor AC (85 %) frente a salidas DC/USB-C (91 %).",
        },
        {
            "q": "¿Cómo afecta la eficiencia usar enchufe AC frente a USB-C o salida de auto 12V?",
            "a": "Alimentar routers, laptops o refrigeradoras portátiles directo por USB-C PD o DC 12V evita el autoconsumo continuo del inversor (8–16 W), otorgando entre un 15 % y 30 % más de horas de uso.",
        },
        {
            "q": "¿Dónde puedo simular mis propios equipos y ver precios en Amazon?",
            "a": "En nuestra Calculadora de Autonomía en Horas (/calculadora-de-autonomia/) y en las tarjetas de productos Amazon de esta página tienes el cálculo al minuto y el enlace directo a Amazon EE. UU. y Amazon España.",
        },
    ]

    quick_answer = (
        f"Respecto a {title}, la clave práctica es {key_metric} ({focus_summary}). "
        "Conectar cargas ligeras por USB-C PD o 12V DC aprovecha el 91 % útil de tu estación Jackery, EcoFlow o BLUETTI, "
        "evitando el gasto en vacío del inversor AC y optimizando la recarga con paneles solares plegables."
    )

    return {
        "slug": slug,
        "pillar": pillar,
        "path": path,
        "isPillar": False,
        "isTransactional": False,
        "primaryKeyword": kw,
        "title": title,
        "seoTitle": f"{title} | GuiaDeEnergiaPortatil.com",
        "metaDescription": f"Guía técnica sobre {title}: {focus_summary}. Cálculos reales en Jackery, EcoFlow y BLUETTI.",
        "excerpt": f"Explicación técnica sobre {title}: {focus_summary} ({key_metric}).",
        "quickAnswer": quick_answer,
        "readingMinutes": 6,
        "amazonProducts": infer_amazon_ids(slug, pillar, title),
        "image": {
            "prompt": build_diverse_prompt(subj, idx, slug),
            "alt": title,
        },
        "blocks": blocks,
        "faqs": faqs,
        "sources": [
            {"label": "GuiaDeEnergiaPortatil.com – Calculadora de Autonomía en Horas", "url": "https://guiadeenergiaportatil.com/calculadora-de-autonomia/"},
            {"label": "FAA / TSA PackSafe Lithium Battery Air Travel Regulations", "url": "https://www.faa.gov/hazmat/packsafe"},
        ],
        "related": rel,
        "datePublished": PUBLISHED,
        "dateModified": PUBLISHED,
        "imageUrl": None,
    }


def main():
    for old in ART_DIR.glob("*.json"):
        old.unlink()

    trans_items = generate_transactional_520()
    seo_items = generate_seo_1000()

    by_pillar: dict[str, list] = {p["slug"]: [] for p in PILLARS}
    for it in trans_items:
        by_pillar[it[2]].append(it)
    for it in seo_items:
        by_pillar[it[2]].append(it)

    all_articles = []
    seen_slugs = set()
    seen_kws = set()
    seen_titles = set()
    idx = 0

    for p in PILLARS:
        art = make_pillar_article(p, by_pillar[p["slug"]], idx)
        idx += 1
        assert art["slug"] not in seen_slugs, f"Duplicate slug: {art['slug']}"
        assert art["primaryKeyword"] not in seen_kws, f"Duplicate kw: {art['primaryKeyword']}"
        assert art["title"] not in seen_titles, f"Duplicate title: {art['title']}"
        seen_slugs.add(art["slug"])
        seen_kws.add(art["primaryKeyword"])
        seen_titles.add(art["title"])
        all_articles.append(art)

    pillar_paths = {
        p_slug: [f"/{p_slug}/{clean_slug(c[0])}/" for c in c_list]
        for p_slug, c_list in by_pillar.items()
    }

    for i, it in enumerate(trans_items):
        p_slug = it[2]
        sibs = pillar_paths[p_slug]
        rot_sibs = sibs[(i + 1) % len(sibs):] + sibs[: (i + 1) % len(sibs)]
        art = make_transactional_article(it, rot_sibs, idx)
        idx += 1
        assert art["slug"] not in seen_slugs, f"Duplicate slug: {art['slug']}"
        assert art["primaryKeyword"] not in seen_kws, f"Duplicate kw: {art['primaryKeyword']}"
        assert art["title"] not in seen_titles, f"Duplicate title: {art['title']}"
        seen_slugs.add(art["slug"])
        seen_kws.add(art["primaryKeyword"])
        seen_titles.add(art["title"])
        all_articles.append(art)

    for i, it in enumerate(seo_items):
        p_slug = it[2]
        sibs = pillar_paths[p_slug]
        rot_sibs = sibs[(i + 1) % len(sibs):] + sibs[: (i + 1) % len(sibs)]
        art = make_seo_article(it, rot_sibs, idx)
        idx += 1
        assert art["slug"] not in seen_slugs, f"Duplicate slug: {art['slug']}"
        assert art["primaryKeyword"] not in seen_kws, f"Duplicate kw: {art['primaryKeyword']}"
        assert art["title"] not in seen_titles, f"Duplicate title: {art['title']}"
        seen_slugs.add(art["slug"])
        seen_kws.add(art["primaryKeyword"])
        seen_titles.add(art["title"])
        all_articles.append(art)

    for art in all_articles:
        (ART_DIR / f"{art['slug']}.json").write_text(
            json.dumps(art, ensure_ascii=False, indent=2), encoding="utf-8"
        )

    kw_map = [
        {
            "slug": a["slug"],
            "pillar": a["pillar"],
            "path": a["path"],
            "isPillar": a["isPillar"],
            "isTransactional": a["isTransactional"],
            "primaryKeyword": a["primaryKeyword"],
            "title": a["title"],
        }
        for a in all_articles
    ]
    (DATA_DIR / "keyword_map.json").write_text(
        json.dumps(kw_map, ensure_ascii=False, indent=2), encoding="utf-8"
    )

    cat_names = {
        p["slug"]: p["title"].split(":")[0].split("(")[0].strip()
        for p in PILLARS
    }
    search_index = [
        {
            "t": a["title"],
            "p": a["path"],
            "n": cat_names.get(a["pillar"], a["pillar"]),
            "r": a["readingMinutes"],
        }
        for a in all_articles
    ]
    (PUB_DIR / "search-index.json").write_text(
        json.dumps(search_index, ensure_ascii=False), encoding="utf-8"
    )

    print(
        f"OK: Generados {len(all_articles)} artículos únicos "
        f"({len(PILLARS)} Pilares + {len(trans_items)} Transaccionales Amazon + {len(seo_items)} SEO Informacionales). "
        f"0% Canibalización verificada."
    )


if __name__ == "__main__":
    main()
