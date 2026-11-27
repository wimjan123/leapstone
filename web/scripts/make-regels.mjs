// Maakt de spelregelpagina's en gidsen in elke taal: web/regels/talen/<code>/<slug>.mjs wordt web/public<adres>.html
// (Engels: rules/<slug> en guides/<slug>; Nederlands: nl/<slug>; Duits: de/regeln/<slug> en de/anleitungen/<slug>; de adressen staan in
// web/regels/paginas.mjs). Werkt ook de stukken tussen `regels:begin` en `regels:end` bij in public/sitemap.xml en public/llms.txt.
// De plaatjes (web/public/rules/img/*.svg) komen uit halma-core: `npm --prefix web run regels` doet beide.
// Alleen de pagina's: `npm --prefix web run regels:paginas`.
// Een nieuwe pagina: zet hem in PAGINA_LIJST (regels/paginas.mjs) en schrijf zijn tekst in elke taal. Een nieuwe taal: zie regels/talen.mjs.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { allePaginas, maakPagina, paginaBestand, regelStukken } from "../regels/pagina.mjs";

for (const { pagina, code } of allePaginas()) {
  const bestand = paginaBestand(pagina, code);
  mkdirSync(dirname(bestand), { recursive: true });
  writeFileSync(bestand, maakPagina(pagina, code));
  console.log(bestand.slice(bestand.indexOf("public/")));
}

/** Vervangt wat tussen de twee markeringen staat. */
function vervang(tekst, begin, einde, nieuw) {
  const a = tekst.indexOf(begin);
  const b = tekst.indexOf(einde);
  if (a < 0 || b < a) throw new Error(`markering ${begin} ontbreekt`);
  return tekst.slice(0, a + begin.length) + "\n" + nieuw + "\n" + tekst.slice(b);
}

const publiek = join(import.meta.dirname, "..", "public");
const stukken = regelStukken();
for (const [naam, begin, einde, inhoud] of [
  ["sitemap.xml", "<!-- regels:begin (gemaakt door npm run regels:paginas uit web/regels/paginas.mjs) -->", "<!-- regels:end -->", stukken.sitemap],
  ["llms.txt", "<!-- regels:begin -->", "<!-- regels:end -->", stukken.llms],
]) {
  const pad = join(publiek, naam);
  writeFileSync(pad, vervang(readFileSync(pad, "utf8"), begin, einde, inhoud));
  console.log(`public/${naam}`);
}
