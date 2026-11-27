import { isIosApp } from "./meldingen";
import { datumSleutel, datumVan, leesOpslag } from "./puzzel";

/**
 * De Melding voor de Dagelijkse puzzel (taak 153, feature 141): een lokale Melding op het toestel, geen server.
 * Er gaat dus niets over de Speler naar de server. Alleen in de iPhone-app (zie "Techniek" in docs/plan.md).
 * De schakelaar staat standaard uit. Aan: de app plant voor de komende dagen een Melding om 9 uur in de eigen tijd.
 * Bij elke start en na elke oplossing plant de app opnieuw; is de puzzel van een dag al opgelost, dan krijgt die dag geen Melding.
 */

export const MELDING_OPSLAG = "leapstone.puzzelmelding";
/** Het uur (eigen tijd) van de Melding. */
export const MELDING_UUR = 9;
/** Zoveel dagen vooruit plant de app. Opent de Speler de app niet meer, dan stoppen de Meldingen daarna vanzelf. */
export const PLAN_DAGEN = 7;
/** Vaste nummers van de geplande Meldingen: dag 0 (vandaag) tot en met dag 6. De app annuleert en plant deze elke keer opnieuw. */
export const MELDING_ID_BEGIN = 41530;

export type Moment = { id: number; tijd: number };

/** De Meldingen die gepland moeten staan: 9 uur eigen tijd, alleen in de toekomst en niet op een dag dat de puzzel al is opgelost. `tijd` is in seconden. */
export function planMeldingen(nu: Date, opgelost: string | null, aan: boolean): Moment[] {
  if (!aan) return [];
  const uit: Moment[] = [];
  for (let i = 0; i < PLAN_DAGEN; i++) {
    const moment = new Date(nu.getFullYear(), nu.getMonth(), nu.getDate() + i, MELDING_UUR, 0, 0);
    if (moment.getTime() <= nu.getTime()) continue;
    if (opgelost !== null && datumSleutel(datumVan(moment)) === opgelost) continue;
    uit.push({ id: MELDING_ID_BEGIN + i, tijd: Math.floor(moment.getTime() / 1000) });
  }
  return uit;
}

export function leesAan(): boolean {
  try {
    return localStorage.getItem(MELDING_OPSLAG) === "1";
  } catch {
    return false;
  }
}

function schrijfAan(aan: boolean) {
  try {
    if (aan) localStorage.setItem(MELDING_OPSLAG, "1");
    else localStorage.removeItem(MELDING_OPSLAG);
  } catch {
    // Geen opslag: dan staat hij na een herstart weer uit.
  }
}

async function roep<T>(commando: string, args?: Record<string, unknown>): Promise<T> {
  const { invoke } = await import("@tauri-apps/api/core");
  return invoke<T>(commando, args);
}

/** Plant de Meldingen opnieuw (of annuleert ze) volgens de schakelaar en de opslag van de puzzel. Niets buiten de iPhone-app. */
export async function plan(titel: string, tekst: string, nu: Date = new Date()): Promise<void> {
  if (!isIosApp()) return;
  try {
    await roep("puzzelmelding_plan", { momenten: planMeldingen(nu, leesOpslag().opgelost, leesAan()), titel, tekst });
  } catch {
    // Geen toestemming meer of geen werkende plugin: dan komt er geen Melding; de Speler merkt hier niets van.
  }
}

/** Kan de Speler de schakelaar zien? Alleen in de iPhone-app. */
export const kanPuzzelmelding = isIosApp;

/** Zet de schakelaar aan: vraagt toestemming en plant. Geeft `false` bij geen toestemming (dan blijft hij uit). */
export async function zetAan(titel: string, tekst: string, nu: Date = new Date()): Promise<boolean> {
  const toestemming = await roep<string>("puzzelmelding_toestemming");
  if (toestemming !== "granted") return false;
  schrijfAan(true);
  await plan(titel, tekst, nu);
  return true;
}

/** Zet de schakelaar uit: annuleert alle geplande Meldingen van de puzzel. */
export async function zetUit(titel: string, tekst: string, nu: Date = new Date()): Promise<void> {
  schrijfAan(false);
  await plan(titel, tekst, nu);
}
