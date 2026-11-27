/**
 * Knopplaten in de taal van de Speler (taak 183, voorwerk voor de 3D-knoppen van uiterlijk 1b).
 * `bakKnoppen("ar")` geeft de beeldpunten (RGBA) en de maat van elke knop van het Startmenu en het Potje.
 * Het koppelen aan 3D-voorwerpen gebeurt in taak 178. Zie docs/bord3d.md, "Knopplaten".
 */
import { TALEN } from "../talen/register";
import { KNOPPEN, NAAMPLAAT, type KnopSpec } from "./knoppen";
import { laadLetters } from "./letters";
import { bakPlaatKlaar, type Plaat } from "./plaat";

export { KNOPPEN, MIJN_POTJES, NAAMPLAAT, TITEL, JADE, POTJES_KNOP, LETTER_SLEUTELS, type BordTekening, type KnopSpec, type Pictogram, type Soort } from "./knoppen";
export { bakPlaat, bakPlaatKlaar, isRtl, PLAATMATEN, STANDAARD_SCHAAL, type Plaat, type PlaatInvoer, type PlaatTekst } from "./plaat";
export { laadLetters, ontbrekendeTekens, zetLetterLader } from "./letters";
export { zetDoekMaker, type Ctx } from "./doek";
export { pasTekst } from "./pas";

/** De tabel van een taal, met het Engels als terugval voor een ontbrekende sleutel. */
export async function laadTabel(taal: string): Promise<Record<string, string>> {
  const en = (await TALEN.en.laad()).default;
  const info = TALEN[taal];
  if (!info || taal === "en") return en;
  return { ...en, ...(await info.laad()).default };
}

/** De teksten van een knop in een taal. `{n}` in de naamplaat wordt 1. */
export function knopTeksten(spec: KnopSpec, tabel: Record<string, string>): string[] {
  if (spec.teksten) return spec.teksten;
  return spec.sleutels.map((s) => (tabel[s] ?? s).replace(/\{n\}/g, "1"));
}

/** Bakt alle knoppen van het Startmenu en het Potje voor één taal, in de volgorde van KNOPPEN. Laadt de lettertypen één keer. */
export async function bakKnoppen(taal: string, opties: { schaal?: number; metNaamplaat?: boolean } = {}): Promise<Plaat[]> {
  return bakSpecs(taal, opties.metNaamplaat ? [...KNOPPEN, NAAMPLAAT] : KNOPPEN, opties.schaal);
}

/** Bakt de platen van een lijst knoppen (zie KnopSpec) voor één taal, in die volgorde. Laadt de lettertypen één keer. */
export async function bakSpecs(taal: string, lijst: readonly KnopSpec[], schaal?: number): Promise<Plaat[]> {
  const [tabel] = await Promise.all([laadTabel(taal), laadLetters(taal)]);
  return lijst.map((k) => bakPlaatKlaar({ soort: k.soort, taal, teksten: knopTeksten(k, tabel), pictogrammen: k.pictogrammen, id: k.id, schaal, speler: k.speler, tijd: k.tijd, maat: k.maat, wissel: k.wissel, aan: k.aan, uit: k.uit, bord: k.bord }));
}
