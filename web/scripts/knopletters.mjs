// Maakt de lettertypen voor de teksten op voorwerpen (taak 183): per schrift één woff2 in web/src/assets/fonts/knop/,
// verkleind tot de tekens van alle knopteksten in alle talen. Draai dit opnieuw als een knoptekst of een taal verandert
// (de test `knopplaten.test.ts` zegt het als een teken ontbreekt).
//
//   node scripts/knopletters.mjs            (nodig: uv, en de Noto Sans-lettertypen van het systeem in /usr/share/fonts)
//
// Bronnen: Noto Sans Bold (SIL Open Font License) uit het systeem. Niets wordt gedownload.
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { LETTER_SLEUTELS } from "../src/knopplaten/knoppen.ts";
import { LETTERGROEPEN, groepVoorTaal } from "../src/knopplaten/letterdata.ts";

const WEB = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const UIT = path.join(WEB, "src/assets/fonts/knop");
const NOTO = "/usr/share/fonts/noto";
const CJK = "/usr/share/fonts/noto-cjk/NotoSansCJK-Bold.ttc";
// Volgorde in het ttc-bestand: JP, KR, SC, TC, HK.
const BRON = {
  latijn: [`${NOTO}/NotoSans-Bold.ttf`], arabisch: [`${NOTO}/NotoSansArabic-Bold.ttf`], hebreeuws: [`${NOTO}/NotoSansHebrew-Bold.ttf`],
  thai: [`${NOTO}/NotoSansThai-Bold.ttf`], devanagari: [`${NOTO}/NotoSansDevanagari-Bold.ttf`], bengaals: [`${NOTO}/NotoSansBengali-Bold.ttf`],
  gujarati: [`${NOTO}/NotoSansGujarati-Bold.ttf`], gurmukhi: [`${NOTO}/NotoSansGurmukhi-Bold.ttf`], kannada: [`${NOTO}/NotoSansKannada-Bold.ttf`],
  malayalam: [`${NOTO}/NotoSansMalayalam-Bold.ttf`], odia: [`${NOTO}/NotoSansOriya-Bold.ttf`], tamil: [`${NOTO}/NotoSansTamil-Bold.ttf`],
  telugu: [`${NOTO}/NotoSansTelugu-Bold.ttf`], "cjk-ja": [CJK, 0], "cjk-ko": [CJK, 1], "cjk-zh": [CJK, 2],
};

const codes = [...readFileSync(path.join(WEB, "src/talen/register.ts"), "utf8").matchAll(/^\s+"?([\w-]+)"?: \{ naam:/gm)].map((m) => m[1]);
const tekst = Object.fromEntries(LETTERGROEPEN.map((g) => [g.id, new Set()]));
const latijn = new Set();
for (const code of codes) {
  const { default: tabel } = await import(path.join(WEB, `src/talen/${code}.ts`));
  const groep = groepVoorTaal(code);
  for (const sleutel of LETTER_SLEUTELS) {
    const t = String(tabel[sleutel] ?? "").replace(/\{[a-z]+\}/g, "1");
    for (const ch of t) { tekst[groep.id].add(ch); for (const d of ch.normalize("NFKD")) tekst[groep.id].add(d); // ook de delen: de vormgever splitst bijvoorbeeld Thai "ำ"
      if (/[ -ɏͰ-ϿЀ-ԯḀ-ỿ]/.test(ch)) latijn.add(ch); }
  }
}
for (const ch of "0123456789 .,!?-") { latijn.add(ch); for (const s of Object.values(tekst)) s.add(ch); }
// Latijnse tekens in een ander schrift (een merknaam, een cijfer) komen uit de Latijnse groep.
for (const ch of latijn) tekst.latijn.add(ch);

mkdirSync(UIT, { recursive: true });
const spec = path.join(tmpdir(), "knopletters-spec.json");
writeFileSync(spec, JSON.stringify({ uit: UIT, groepen: LETTERGROEPEN.map((g) => ({ id: g.id, bron: BRON[g.id][0], nummer: BRON[g.id][1] ?? -1, tekst: [...tekst[g.id]].join("") })) }));
execFileSync("uv", ["run", "--quiet", "--with", "fonttools", "--with", "brotli", "python3", path.join(WEB, "scripts/knopletters.py"), spec], { stdio: "inherit" });
