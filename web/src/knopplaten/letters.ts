/**
 * De lettertypen van de platen laden (taak 183). Per schrift één klein bestand (Noto Sans Bold, SIL Open Font License) in
 * web/src/assets/fonts/knop/, verkleind tot de tekens van de knopteksten: scripts/knopletters.mjs. Het Latijnse
 * bestand (Latijn, Grieks, Cyrillisch) staat er altijd achter, voor cijfers en losse Latijnse woorden.
 */
import manifest from "../assets/fonts/knop/letters.json";
import { LATIJN, groepVoorTaal, type LetterGroep } from "./letterdata";

const bestanden = import.meta.glob("../assets/fonts/knop/*.woff2", { query: "?url", import: "default" }) as Record<string, () => Promise<string>>;

/** Registreert één lettertype. In de browser is dat een FontFace; tests geven hun eigen lader (zetLetterLader). */
export type LetterLader = (familie: string, url: string) => Promise<void>;

const browserLader: LetterLader = async (familie, url) => {
  const face = new FontFace(familie, `url(${url})`, { weight: "700" });
  await face.load();
  (typeof document !== "undefined" ? document.fonts : (self as unknown as { fonts: FontFaceSet }).fonts).add(face);
};

let lader: LetterLader = browserLader;
const geladen = new Map<string, Promise<void>>();

export function zetLetterLader(l: LetterLader | null) {
  lader = l ?? browserLader;
  geladen.clear();
}

function laadGroep(g: LetterGroep): Promise<void> {
  let p = geladen.get(g.id);
  if (!p) {
    const sleutel = `../assets/fonts/knop/${g.id}.woff2`;
    const url = bestanden[sleutel];
    if (!url) throw new Error(`Lettertype ${g.id} ontbreekt. Draai: node scripts/knopletters.mjs`);
    p = url().then((u) => lader(g.familie, u));
    p.catch(() => geladen.delete(g.id));
    geladen.set(g.id, p);
  }
  return p;
}

/** Laadt de lettertypen voor een taal (het schrift van de taal en het Latijnse). Doe dit voor het bakken. */
export async function laadLetters(taal: string): Promise<void> {
  const g = groepVoorTaal(taal);
  await Promise.all([laadGroep(g), g === LATIJN ? undefined : laadGroep(LATIJN)]);
}

/** De regel `font` van Canvas 2D voor een taal, bij een lettergrootte in beeldpunten. */
export function letterFont(taal: string, px: number): string {
  const g = groepVoorTaal(taal);
  const fam = g === LATIJN ? `"${LATIJN.familie}"` : `"${g.familie}", "${LATIJN.familie}"`;
  return `700 ${px}px ${fam}, sans-serif`;
}

/** Tekens van een tekst die in geen enkel lettertype van deze taal zitten (spaties tellen niet). Een lege lijst is goed. */
export function ontbrekendeTekens(taal: string, tekst: string): string[] {
  const g = groepVoorTaal(taal);
  const sets = [(manifest as Record<string, string>)[g.id] ?? "", (manifest as Record<string, string>)[LATIJN.id] ?? ""];
  return [...new Set([...tekst].filter((ch) => ch.trim() !== "" && !sets.some((s) => s.includes(ch))))];
}
