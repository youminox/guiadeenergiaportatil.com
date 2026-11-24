#!/usr/bin/env python3
"""
Genera imágenes WebP realistas (< 100 KB) mediante OpenAI ChatGPT Image API
en la Edge Function de Supabase (`energia-portatil-images`), las comprime
en 3 tamaños responsivos (1200x675, 800x450, 400x225) y verifica diversidad
visual mediante perceptual dHash para evitar imágenes similares entre artículos.
"""
from __future__ import annotations

import concurrent.futures
import io
import json
import sys
import time
import urllib.request
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
ART_DIR = ROOT / "src" / "content" / "articles"
AMB_DIR = ROOT / "public" / "img" / "ambiente"
ART_IMG_DIR = ROOT / "public" / "img" / "articulos"

EF_URL = "https://ehwjvuhbimqakvzqbvvg.supabase.co/functions/v1/energia-portatil-images"
EF_TOKEN = "energia-portatil-img-2026"

BASE_STYLE = (
    "Photorealistic editorial photography, natural physical materials, crisp focus, "
    "shot on full-frame 35mm camera, authentic textures, no text, no logos, no letters, no watermarks."
)

# Exact 53 ambient / hero / pillar / scene slugs referenced in page.tsx & content.ts
HOME_PROMPTS: dict[str, str] = {
    # 11 Home & Scenario Visuals
    "home-hero-energia": (
        "Wide-angle golden sunset shot of a rugged modern portable LiFePO4 power station with AC outlets "
        "and orange trim beside a unfolded dark monocrystalline solar panel on a mountain campsite meadow overlooking misty peaks"
    ),
    "og-default": (
        "Clean studio-lit three-quarter product tabletop scene showing three distinct portable power stations in slate grey, matte black, and burnt orange alongside a compact foldable solar panel"
    ),
    "home-router-laptop-apagon": (
        "Cozy wooden home desk during a dusk power outage: an illuminated fiber Wi-Fi router and open laptop plugged via USB-C cable into a compact grey portable power station while warm window twilight falls outside"
    ),
    "home-refri-portatil": (
        "Close-up outdoor tailgating setup in the trunk of an SUV: a brushed dark 12V dual-zone portable camping compressor refrigerator connected with a thick DC cable to a portable LiFePO4 battery station"
    ),
    "home-camping-estacion": (
        "Morning light filtering through tall pine trees over a canvas glamping tent wooden deck with a black-and-orange portable battery station charging camera batteries and camp lantern"
    ),
    "home-paneles-solares": (
        "Angled 45-degree two-wing foldable 200W monocrystalline ETFE solar panel resting on dry alpine grass, thick black MC4 cable leading toward a shaded portable battery box in the foreground"
    ),
    "home-corte-luz-casa": (
        "Warm residential kitchen counter at night softly illuminated by a standing lamp plugged into a robust 2000Wh wheeled LiFePO4 power station sitting beside a stainless steel home refrigerator"
    ),
    "home-cables-conectores": (
        "Overhead macro workbench photograph of neatly coiled 10AWG red and black solar MC4 connectors, bright yellow XT60i plug, heavy DC8020 barrel adapter, and digital multimeter on brushed steel"
    ),
    "home-cpap-viaje": (
        "Minimalist quiet hotel bedroom nightstand at night with a sleek portable sleep apnea CPAP machine powered silently via DC barrel cord from a small whisper-quiet battery pack"
    ),
    "home-camper-van": (
        "Warm Scandinavian birch-wood campervan interior looking through open rear doors at a coastal bluff, built-in LiFePO4 battery station wired to an alternator fast charger under the bench"
    ),
    "home-refri-casa": (
        "Home laundry and pantry corner showing an analog transfer switch box on drywall feeding a kitchen refrigerator via heavy-duty 12AWG extension cord from a dark slate portable power station"
    ),
    # 14 Category Hubs (PILLARS)
    "cat-resenas-estaciones-de-energia": (
        "Three-quarter workshop bench review portrait of a modern dark-silver 1024Wh portable power station with glowing LCD wattage readout next to a digital kill-a-watt meter and studio softbox"
    ),
    "cat-comparativas-jackery-ecoflow-bluetti": (
        "Side-by-side overhead comparison flatlay on oak wood of three distinct portable battery generators (dark grey, orange-accented black, deep navy slate) showing clear differences in handle shape and port layout"
    ),
    "cat-mejores-estaciones-por-uso-y-capacidad": (
        "Graduated trio of portable battery units arranged by size on concrete terrace steps: pocket mini 300Wh travel bank, mid-size 1000Wh camping unit, and wheeled 2000Wh whole-home backup block"
    ),
    "cat-paneles-solares-plegables": (
        "Row of unfolded portable 100W, 200W, and 400W kickstand solar panels angled toward clear blue midday sky on a sunny gravel RV pad surrounded by desert sagebrush"
    ),
    "cat-cargadores-baterias-extra-y-accesorios": (
        "Open overland pickup cargo bed showing a stacked expandable extra battery module linked with a braided thick expansion cord to a main station and 800W alternator box"
    ),
    "cat-cables-adaptadores-y-transferencia": (
        "Precision neatly arranged electrical adapters on matte slate mat: 10AWG solar extension cables, XT60i plugs, DC8020 adapters, and a compact 6-circuit manual home transfer switch panel"
    ),
    "cat-autonomia-consumo-y-calculo-de-horas": (
        "Engineer notebook and tablet beside an inline DC wattage clamp meter, plugged-in laptop, router, and portable fridge running an endurance test on a maple workbench"
    ),
    "cat-cortes-de-luz-y-respaldo-en-casa": (
        "Suburban living room during heavy rain storm seen through bay window at dusk while a floor lamp and microwave corner run smoothly off a heavy-duty floor battery unit"
    ),
    "cat-energia-para-camping-viajes-y-camper": (
        "Lakeside gravel shore at blue hour with a roof-top tent SUV, camp chairs, kettle boiling via induction pad, and a rugged battery station lighting warm string bulbs"
    ),
    "cat-compatibilidad-solar-mppt-y-carga": (
        "Close-up of two foldable solar panels wired in series and parallel junction splitters on sunny patio tiles next to a portable station charging port display"
    ),
    "cat-conectores-cables-inversores-y-voltaje": (
        "Macro sharp lens focus on yellow XT60i connector sliding into an orange solar input socket alongside braided copper wire cross-sections and rugged voltage tester"
    ),
    "cat-baterias-lifepo4-ciclos-y-vida-util": (
        "Cutaway technical educational display on clean wooden lab table showing clean prismatic lithium iron phosphate aluminum battery cells beside a protective BMS circuit board and casing"
    ),
    "cat-potencia-pico-xboost-y-electrodomesticos": (
        "Compact workshop corner testing a corded circular saw and heavy countertop coffee espresso maker plugged directly into a high-output 1800W portable power station"
    ),
    "cat-mantenimiento-errores-y-seguridad-electrica": (
        "Indoor insulated closet shelf storing a clean dust-free LiFePO4 battery pack at half charge with clear ventilation space, surge protector, and coiled cables"
    ),
    # 28 Scene Variants (scene-*-2, scene-*-3)
    "scene-resenas-2": "Unboxing shot on linen rug of a matte-black 1000Wh power station with AC cord, car charger cable, and rigid travel carrying case in morning window light",
    "scene-resenas-3": "Low-angle dusk backyard deck photo showing cooling intake vents and dual high-wattage USB-C PD ports of a midsize portable generator running strings of warm patio lights",
    "scene-comparativas-2": "Weight balance test scene on a wooden cabin porch holding a compact 3.7 kg handle power pack next to a rugged 14 kg twin-handle heavy-duty battery box",
    "scene-comparativas-3": "Sunlit garden terrace setup pitting two solar power stations recharging in parallel from twin 220W bifacial foldable glass panels resting on lawn",
    "scene-uso-2": "Digital nomad working remotely from a coastal cliff wooden bench with laptop, Starlink mini dish, and slim 500Wh battery cube under crisp midday sun",
    "scene-uso-3": "Family storm preparedness closet ready with flashlights, two-way radios, and a fully topped-up 2048Wh wheeled lithium backup generator beside bottled water",
    "scene-paneles-2": "Close-up water droplets beading on textured ETFE hydrophobic coating of an unfolded portable solar suitcase after a light spring mountain shower",
    "scene-paneles-3": "Roof-rack mounted magnetic foldable solar array atop a white sprinter van parked in Utah red rock canyon at golden hour",
    "scene-accesorios-2": "Inside a tidy overland SUV rear drawer holding an insulated DC car fridge cable, 12V fused cigar-lighter plug, and waterproof protective canvas cover",
    "scene-accesorios-3": "Garage wall installation of a fast vehicle DC-DC alternator charger wired alongside battery terminals inside a pickup engine bay and cab bulkhead",
    "scene-cables-2": "Macro shot of heavy rubber weatherproof MC4 inline male-female solar connectors snapping tightly together in sandy desert light",
    "scene-cables-3": "Home utility room wall panel beside main breaker box with labeled transfer switch rocker toggles and heavy 30A L14-30P twist-lock inlet cord",
    "scene-autonomia-2": "Kitchen island stress-test setup timing a compact microwave and electric kettle plugged into an inline energy monitor and 1800W battery block",
    "scene-autonomia-3": "Nighttime off-grid backyard office shed desk showing steady USB-C laptop draw and fiber ONT terminal running silently without AC inverter losses",
    "scene-cortes-2": "Suburban dining table lit by warm desk lamps during neighborhood blackout while neighbors outside sit dark, powered by a calm floor backup unit",
    "scene-cortes-3": "Apartment balcony emergency kit combining a flat expandable battery station inside with an angled 200W solar panel clamped safely along aluminum railing",
    "scene-camping-2": "Autumn forest pine-needle clearing beside a crackling iron firepit, canvas dome tent illuminated softly with camp mugs on a crate beside a compact battery box",
    "scene-camping-3": "Sand dunes sunset beach camp setup running a portable travel fridge and LED camp bar off a rugged dust-resistant portable power station",
    "scene-mppt-2": "Partly cloudy coastal afternoon test showing shaded corner leaf across one foldable solar cell wing while neighboring panel still catches direct rays",
    "scene-mppt-3": "Dual-string Y-branch MC4 parallel adapter joining two portable suitcase solar panels cleanly on wooden terrace decking",
    "scene-conectores-2": "Close-up macro of crisp brass contact pins inside a DC8020 8mm orange barrel connector beside 12AWG silicone jacketed wiring",
    "scene-conectores-3": "Pure sine wave oscilloscope trace glow on a clean bench monitor beside an open laptop and clean medical battery power supply",
    "scene-lifepo4-2": "Cool crisp mountain cabin mudroom shelf storing spare battery cubes safely away from snow boots and frost with thermometer gauge nearby",
    "scene-lifepo4-3": "Macro texture view of honeycombed flame-retardant UL94 V-0 polymer housing and anodized aluminum heat sink fins on a heavy-duty power station",
    "scene-potencia-2": "Carpentry mobile jobsite sawhorse running a corded plunge router and LED floodlight from a high-wattage LiFePO4 field generator",
    "scene-potencia-3": "Home kitchen morning espresso pull and burr grinder operated purely off a standalone 2000W portable power station on butcher-block wood",
    "scene-mantenimiento-2": "Dust-free microfiber cloth gently wiping cooling intake mesh grille of a stationary battery unit on a wooden dining table",
    "scene-mantenimiento-3": "Grounded pure-copper rod wire clamp attached safely outdoors beside a portable campsite generator near wet cedar deck",
}

TOP_ARTICLE_SLUGS: list[str] = [
    "ecoflow-delta-2-resena-capacidad-recarga-precio",
    "jackery-explorer-1000-v2-resena-camping-y-casa",
    "bluetti-ac180-resena-autonomia-y-potencia",
    "jackery-explorer-300-plus-resena-camping-y-viajes",
    "ecoflow-river-2-max-resena-autonomia-y-recarga",
    "ecoflow-delta-2-max-resena-hogar-2048wh",
    "jackery-vs-ecoflow-vs-bluetti-cual-elegir",
    "jackery-explorer-1000-v2-vs-ecoflow-delta-2",
    "ecoflow-delta-2-vs-bluetti-ac180",
    "mejores-paneles-solares-plegables-jackery-ecoflow-bluetti",
    "cable-mc4-a-xt60-vs-xt60i-ecoflow-15a",
    "adaptador-mc4-a-dc7909-y-dc8020-jackery",
    "cuantas-horas-dura-estacion-1000wh-router-laptop-refrigeradora",
    "cuantas-horas-dura-refrigeradora-portatil-12v-estacion-energia",
    "mantener-refrigeradora-encendida-corte-de-luz-estacion-portatil",
    "llevar-estacion-de-energia-en-avion-reglas-faa-100wh",
    "como-calcular-voltaje-voc-paneles-solares-mppt-estacion",
    "salida-dc-usb-c-vs-inversor-ac-eficiencia-autonomia",
    "ecoflow-800w-alternator-charger-resena-compatibilidad",
    "bluetti-eb3a-resena-capacidad-recarga-precio",
]


def compute_dhash(img: Image.Image, hash_size: int = 8) -> int:
    resized = img.convert("L").resize((hash_size + 1, hash_size), Image.Resampling.LANCZOS)
    pixels = list(resized.getdata())
    diff = 0
    bit = 1
    for row in range(hash_size):
        offset = row * (hash_size + 1)
        for col in range(hash_size):
            if pixels[offset + col] > pixels[offset + col + 1]:
                diff |= bit
            bit <<= 1
    return diff


def hamming_dist(h1: int, h2: int) -> int:
    return bin(h1 ^ h2).count("1")


def save_responsive_webp(raw_bytes: bytes, dest_dir: Path, slug: str) -> tuple[int, int]:
    dest_dir.mkdir(parents=True, exist_ok=True)
    img = Image.open(io.BytesIO(raw_bytes)).convert("RGB")
    dhash = compute_dhash(img)

    # Crop/resize cleanly to 16:9 ratio
    tw, th = 1200, 675
    rw, rh = img.size
    target_ratio = tw / th
    cur_ratio = rw / rh
    if cur_ratio > target_ratio:
        new_w = int(rh * target_ratio)
        left = (rw - new_w) // 2
        img = img.crop((left, 0, left + new_w, rh))
    elif cur_ratio < target_ratio:
        new_h = int(rw / target_ratio)
        top = (rh - new_h) // 2
        img = img.crop((0, top, rw, top + new_h))

    variants = [
        (f"{slug}.webp", (1200, 675), 68_000),
        (f"{slug}-800.webp", (800, 450), 42_000),
        (f"{slug}-400.webp", (400, 225), 18_000),
    ]

    main_size = 0
    for fname, dims, max_bytes in variants:
        resized = img.resize(dims, Image.Resampling.LANCZOS)
        out_path = dest_dir / fname
        buf = io.BytesIO()
        q = 80
        while q >= 35:
            buf.seek(0)
            buf.truncate(0)
            resized.save(buf, format="WEBP", quality=q, method=6)
            if buf.tell() <= max_bytes:
                break
            q -= 6
        if buf.tell() > 96_000:
            # Emergency strict cap well under 100 KB
            smaller = resized.resize((int(dims[0] * 0.8), int(dims[1] * 0.8)), Image.Resampling.LANCZOS)
            buf.seek(0)
            buf.truncate(0)
            smaller.save(buf, format="WEBP", quality=45, method=6)
        data = buf.getvalue()
        out_path.write_bytes(data)
        if fname == f"{slug}.webp":
            main_size = len(data)
    return main_size, dhash


def call_image_ef(slug: str, prompt: str) -> bytes:
    full_prompt = prompt if BASE_STYLE in prompt else f"{prompt}. {BASE_STYLE}"
    payload = json.dumps({"slug": slug, "prompt": full_prompt}).encode("utf-8")
    req = urllib.request.Request(
        EF_URL,
        data=payload,
        headers={
            "Content-Type": "application/json",
            "x-energia-token": EF_TOKEN,
            "User-Agent": "GuiaDeEnergiaPortatil-Generator/1.0",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=110) as resp:
        res = json.loads(resp.read().decode("utf-8"))
    if not res.get("ok") or not res.get("url"):
        raise RuntimeError(f"EF error for {slug}: {res}")
    img_req = urllib.request.Request(res["url"], headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(img_req, timeout=45) as img_resp:
        return img_resp.read()


def process_one(task: tuple[str, str, Path]) -> tuple[str, int, int, str]:
    slug, prompt, dest_dir = task
    out_file = dest_dir / f"{slug}.webp"
    if out_file.exists() and out_file.stat().st_size > 1200 and out_file.stat().st_size < 100_000:
        img = Image.open(out_file)
        return slug, out_file.stat().st_size, compute_dhash(img), "cached"

    last_err = None
    for attempt in range(2):
        try:
            raw = call_image_ef(slug, prompt)
            size_b, dhash = save_responsive_webp(raw, dest_dir, slug)
            return slug, size_b, dhash, "generated"
        except Exception as exc:
            last_err = exc
            time.sleep(2.0 + attempt * 2.0)
    raise RuntimeError(f"Failed {slug}: {last_err}")


def audit_dhash_diversity(records: list[tuple[str, int, int, str]]) -> None:
    seen: list[tuple[str, int]] = []
    near_dups: list[tuple[str, str, int]] = []
    for slug, _sz, h, _st in records:
        for prev_slug, prev_h in seen:
            dist = hamming_dist(h, prev_h)
            if dist <= 4:
                near_dups.append((slug, prev_slug, dist))
        seen.append((slug, h))
    print(f"🔎 Auditoría perceptual dHash ({len(records)} imágenes): {len(near_dups)} pares similares (umbral <= 4 bits).")
    for a, b, d in near_dups[:10]:
        print(f"   ⚠️ Similar ({d} bits): {a} <-> {b}")


def load_tasks(mode: str, limit: int = 20) -> list[tuple[str, str, Path]]:
    tasks: list[tuple[str, str, Path]] = []
    if mode in ("home", "all-home"):
        for slug, prompt in HOME_PROMPTS.items():
            tasks.append((slug, prompt, AMB_DIR))
        return tasks
    if mode == "top":
        for slug in TOP_ARTICLE_SLUGS:
            p = ART_DIR / f"{slug}.json"
            if p.exists():
                art = json.loads(p.read_text(encoding="utf-8"))
                tasks.append((slug, art["image"]["prompt"], ART_IMG_DIR))
        return tasks
    if mode == "batch":
        count = 0
        for p in sorted(ART_DIR.glob("*.json")):
            art = json.loads(p.read_text(encoding="utf-8"))
            if art.get("isPillar"):
                continue
            slug = art["slug"]
            if not (ART_IMG_DIR / f"{slug}.webp").exists():
                tasks.append((slug, art["image"]["prompt"], ART_IMG_DIR))
                count += 1
                if count >= limit:
                    break
        return tasks
    raise SystemExit(f"Modo desconocido: {mode}. Usa: home | top | batch [N]")


def main() -> None:
    mode = sys.argv[1] if len(sys.argv) > 1 else "home"
    limit = int(sys.argv[2]) if len(sys.argv) > 2 else 20
    tasks = load_tasks(mode, limit)
    print(f"🎨 Procesando {len(tasks)} imágenes (modo='{mode}') < 100 KB vía ChatGPT Image API (quality=medium)...")
    ok_records: list[tuple[str, int, int, str]] = []
    failures: list[tuple[str, str]] = []

    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
        fut_map = {pool.submit(process_one, t): t[0] for t in tasks}
        for fut in concurrent.futures.as_completed(fut_map):
            slug = fut_map[fut]
            try:
                rec = fut.result()
                ok_records.append(rec)
                print(f"  ✓ [{rec[3]}] {rec[0]}.webp ({rec[1]/1024:.1f} KB)")
            except Exception as exc:
                failures.append((slug, str(exc)))
                print(f"  ✗ [error] {slug}: {exc}")

    audit_dhash_diversity(ok_records)
    print(f"Resumen: {len(ok_records)} OK / {len(failures)} errores.")
    if failures:
        sys.exit(1)


if __name__ == "__main__":
    main()
