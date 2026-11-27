// Plaatjes in een spelregelpagina (feature 95): SVG uit halma-core (npm run regels), taalloos, met een bijschrift en een alt-tekst
// in de taal van de pagina. Apart van pagina.mjs, zodat de tekstbestanden in talen/<code>/ het kunnen laden zonder kringverwijzing.
import { readFileSync } from "node:fs";
import { join } from "node:path";

const IMG = join(import.meta.dirname, "..", "public", "rules", "img");

export const esc = (t) => t.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

/** Breedte en hoogte uit de kop van een SVG van `regelplaatjes.rs`, zodat de pagina niet verspringt. */
function maat(bestand) {
  const kop = readFileSync(join(IMG, bestand), "utf8").split("\n", 1)[0];
  const m = kop.match(/width="(\d+)" height="(\d+)"/);
  if (!m) throw new Error(`${bestand}: geen breedte en hoogte`);
  return { breedte: Number(m[1]), hoogte: Number(m[2]) };
}

/**
 * Een plaatje uit web/public/rules/img met een bijschrift. `max`: de breedste weergave (CSS).
 * `direct`: niet lui laden, voor een plaatje bovenaan de pagina (council 2026-11-18).
 */
export function plaatje({ bestand, alt, tekst, max, direct = false }) {
  const { breedte, hoogte } = maat(bestand);
  const stijlAttr = max ? ` style="--max: ${max}"` : "";
  return `<figure class="enkel"${stijlAttr}><img src="/rules/img/${bestand}" width="${breedte}" height="${hoogte}" alt="${esc(alt)}"${direct ? "" : ' loading="lazy"'} decoding="async" /><figcaption>${tekst}</figcaption></figure>`;
}

/** Een plaatje in een raster (naast elkaar). */
export function rasterPlaatje({ bestand, alt, tekst, direct = false }) {
  const { breedte, hoogte } = maat(bestand);
  return `<figure><img src="/rules/img/${bestand}" width="${breedte}" height="${hoogte}" alt="${esc(alt)}"${direct ? "" : ' loading="lazy"'} decoding="async" /><figcaption>${tekst}</figcaption></figure>`;
}
