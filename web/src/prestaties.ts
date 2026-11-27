import { haalPrestaties, type PrestatieId } from "./online";
import { meld } from "./geluid";

/**
 * Het balkje bij een nieuwe Prestatie (taak 174). Na een Zet, na het einde van een Potje en na de Dagelijkse puzzel
 * vraagt de app de server om de Prestaties (`GET /api/prestaties`) en vergelijkt die met wat de Speler al kende.
 * Wat nieuw is, krijgt één balkje (en geluid en een tik). Zo werkt het voor elke Prestatie die de server meldt,
 * ook de nieuwe van later, zonder dat de app de regels van een Prestatie kent.
 *
 * "Wat de Speler al kende" staat per Speler op dit toestel. Bij het openen van een Potje (`neemBasis`) telt alles wat
 * de server dan al heeft als bekend, zodat eerder verdiende Prestaties nooit een balkje geven.
 */

/** Hoe lang het balkje blijft staan (ms). */
export const BALKJE_MS = 3000;

const opslag = (spelerId: number) => `leapstone.prestaties.${spelerId}`;

function leesBekend(spelerId: number): Set<string> | null {
  try {
    const s = JSON.parse(localStorage.getItem(opslag(spelerId)) ?? "null");
    return Array.isArray(s) ? new Set(s.filter((x): x is string => typeof x === "string")) : null;
  } catch {
    return null;
  }
}

function bewaarBekend(spelerId: number, ids: Set<string>) {
  try {
    localStorage.setItem(opslag(spelerId), JSON.stringify([...ids]));
  } catch {
    // Lukt opslaan niet, dan blijft het bij de volgende basis stil: liever geen balkje dan een dubbel.
  }
}

// ---- Het balkje: één tegelijk, de rest wacht. ----

type Luisteraar = (id: PrestatieId | null) => void;
const luisteraars = new Set<Luisteraar>();
const wachtrij: PrestatieId[] = [];
let zichtbaar: PrestatieId | null = null;
let timer: ReturnType<typeof setTimeout> | undefined;

/** Luister naar het balkje: de Prestatie die nu getoond wordt, of `null`. Geeft een functie om te stoppen. */
export function opBalkje(l: Luisteraar): () => void {
  luisteraars.add(l);
  l(zichtbaar);
  return () => luisteraars.delete(l);
}

function volgende() {
  zichtbaar = wachtrij.shift() ?? null;
  for (const l of [...luisteraars]) l(zichtbaar);
  if (zichtbaar === null) return;
  meld({ soort: "prestatie" });
  timer = setTimeout(volgende, BALKJE_MS);
}

function toon(id: PrestatieId) {
  wachtrij.push(id);
  if (zichtbaar === null) volgende();
}

/** Alleen voor tests: wis het balkje . */
export function wisPrestatiebalk() {
  clearTimeout(timer);
  wachtrij.length = 0;
  zichtbaar = null;
  ketting = Promise.resolve();
  for (const l of [...luisteraars]) l(null);
}

// ---- Vergelijken met de server. ----

// Controles komen na elkaar, zodat dezelfde Prestatie nooit twee balkjes geeft.
let ketting: Promise<void> = Promise.resolve();

function controle(sleutel: string, spelerId: number, meldNieuwe: boolean): Promise<void> {
  const taak = ketting.then(async () => {
    let lijst;
    try {
      lijst = await haalPrestaties(sleutel);
    } catch {
      // Een balkje is een extraatje: een fout van het netwerk mag het spel nooit storen.
      return;
    }
    const behaald = new Set(lijst.filter((p) => p.behaald_ms !== null).map((p) => p.id as string));
    const bekend = leesBekend(spelerId);
    // Zonder eerdere basis is alles wat er nu is, al lang van de Speler: geen balkje.
    if (bekend === null || !meldNieuwe) {
      bewaarBekend(spelerId, new Set([...(bekend ?? []), ...behaald]));
      return;
    }
    bewaarBekend(spelerId, new Set([...bekend, ...behaald]));
    for (const id of lijst.map((p) => p.id)) if (behaald.has(id) && !bekend.has(id)) toon(id);
  });
  ketting = taak;
  return taak;
}

/** Neem op dat deze Speler de Prestaties die de server nu heeft al kent: bij het openen van een Potje of de puzzel. */
export const neemBasis = (sleutel: string, spelerId: number) => controle(sleutel, spelerId, false);

/** Toon een balkje voor elke Prestatie die sinds de basis bij is gekomen: na een Zet, het einde van een Potje of de puzzel. */
export const meldNieuwePrestaties = (sleutel: string, spelerId: number) => controle(sleutel, spelerId, true);
