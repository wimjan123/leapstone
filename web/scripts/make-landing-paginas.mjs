// Maakt de Landingspagina in elke taal uit één bron: web/landing/pagina.mjs + web/landing/talen/<code>.mjs (taak 132).
// Schrijft web/landing/index.html (Engels, /) en web/landing/<code>/index.html, en werkt de stukken tussen `landing:begin` en
// `landing:end` bij in public/sitemap.xml, public/llms.txt en public/_headers.
// Gebruik: npm --prefix web run landing:paginas
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { LANDING_TALEN } from "../landing/talen.mjs";
import { landingBestand, landingStukken, maakLanding } from "../landing/pagina.mjs";

const publiek = join(import.meta.dirname, "..", "public");

for (const taal of LANDING_TALEN) {
  const bestand = landingBestand(taal);
  mkdirSync(dirname(bestand), { recursive: true });
  writeFileSync(bestand, maakLanding(taal));
  console.log(bestand.slice(bestand.indexOf("landing/")));
}

/** Vervangt wat tussen de twee markeringen staat. */
function vervang(tekst, begin, einde, nieuw) {
  const a = tekst.indexOf(begin);
  const b = tekst.indexOf(einde);
  if (a < 0 || b < a) throw new Error(`markering ${begin} ontbreekt`);
  return tekst.slice(0, a + begin.length) + "\n" + nieuw + "\n" + tekst.slice(b);
}

const stukken = landingStukken();
for (const [naam, begin, einde, inhoud] of [
  ["sitemap.xml", "<!-- landing:begin (gemaakt door npm run landing:paginas uit web/landing/talen.mjs) -->", "<!-- landing:end -->", stukken.sitemap],
  ["llms.txt", "<!-- landing:begin -->", "<!-- landing:end -->", stukken.llms],
  ["_headers", "# landing:begin", "# landing:end", stukken.headers],
]) {
  const pad = join(publiek, naam);
  writeFileSync(pad, vervang(readFileSync(pad, "utf8"), begin, einde, inhoud));
  console.log(`public/${naam}`);
}
