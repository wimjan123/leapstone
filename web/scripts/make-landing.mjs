// Verkleint de winkelbeelden (docs/winkel/beelden) tot avif en webp voor de Landingspagina (web/landing/img).
// Gebruik: npm --prefix web run landing-beelden
import sharp from "sharp";
import { mkdir, readdir, rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { SCHERMEN } from "../landing/pagina.mjs";

const hier = dirname(fileURLToPath(import.meta.url));
const bron = join(hier, "../../docs/winkel/beelden/app-store/iphone/en-US");
const doel = join(hier, "../landing/img");
// Namen en volgorde uit web/landing/pagina.mjs (SCHERMEN); het nummer volgt de volgorde in teksten.json.
const beelden = Object.fromEntries(SCHERMEN.map(([naam, scene], i) => [naam, `${String(i + 1).padStart(2, "0")}-${scene}`]));

await mkdir(doel, { recursive: true });
for (const [naam, bestand] of Object.entries(beelden)) {
  const plaat = sharp(join(bron, `${bestand}.jpg`)).resize({ width: 480 });
  await plaat.clone().avif({ quality: 45, effort: 6 }).toFile(join(doel, `${naam}.avif`));
  await plaat.clone().webp({ quality: 72, effort: 6 }).toFile(join(doel, `${naam}.webp`));
}
// Oude beelden die niet meer op de pagina staan, gaan weg.
for (const f of await readdir(doel)) if (!(f.replace(/\.(avif|webp)$/, "") in beelden)) await rm(join(doel, f));
