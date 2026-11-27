/**
 * Welk lettertype bij welke taal hoort voor de teksten op voorwerpen (taak 183). Geen imports: scripts/knopletters.mjs leest dit ook.
 * Alle lettertypen zijn Noto Sans (SIL Open Font License), in dikte Bold, verkleind tot de tekens van de knopteksten
 * (scripts/knopletters.mjs). Elke groep heeft een eigen bestand in web/src/assets/fonts/knop/.
 * `regelhoogte`: hoeveel hoger dan de letter een regel is (Thai, Devanagari en Arabisch hebben tekens boven en onder de regel).
 */
export type LetterGroep = { id: string; familie: string; talen: string[]; regelhoogte: number; woordgrens: boolean };

const g = (id: string, talen: string[], regelhoogte: number, woordgrens = true): LetterGroep => ({ id, familie: `Knop ${id}`, talen, regelhoogte, woordgrens });

export const LETTERGROEPEN: LetterGroep[] = [
  g("latijn", [], 1.2), // Latijn, Grieks en Cyrillisch (Noto Sans); alle talen zonder eigen groep
  g("arabisch", ["ar", "ur"], 1.5),
  g("hebreeuws", ["he"], 1.3),
  g("thai", ["th"], 1.6, false),
  g("devanagari", ["hi", "mr"], 1.6),
  g("bengaals", ["bn"], 1.5),
  g("gujarati", ["gu"], 1.5),
  g("gurmukhi", ["pa"], 1.5),
  g("kannada", ["kn"], 1.5),
  g("malayalam", ["ml"], 1.5),
  g("odia", ["or"], 1.5),
  g("tamil", ["ta"], 1.5),
  g("telugu", ["te"], 1.5),
  g("cjk-zh", ["zh-hans"], 1.3, false),
  g("cjk-ja", ["ja"], 1.3, false),
  g("cjk-ko", ["ko"], 1.3),
];

export const LATIJN = LETTERGROEPEN[0];

export function groepVoorTaal(taal: string): LetterGroep {
  return LETTERGROEPEN.find((x) => x.talen.includes(taal)) ?? LATIJN;
}
