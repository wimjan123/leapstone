import { isIosApp } from "./meldingen";

/**
 * De beoordelingsvraag van Apple, alleen vlak na een gewonnen Potje, hooguit twee keer in elke periode van
 * 365 dagen en met minstens vier maanden tussen twee vragen. Het toestel onthoudt wanneer (geen server).
 * Alleen in de iPhone-app; in de web-app en in de Android-app doet dit niets.
 * Geen eigen vraag vooraf: Apple beslist zelf of de vraag echt verschijnt (in de winkel), en
 * toont hem altijd in TestFlight en in een testversie.
 */

/** Sinds feature 149: een lijst met tijdstippen (ms). */
const SLEUTEL = "leapstone.beoordeling.vragen";
/** De oude sleutel (één tijdstip als tekst): telt als de eerste vraag. */
const OUDE_SLEUTEL = "leapstone.beoordeling.gevraagd";
export const MAX_PER_JAAR = 2;
const JAAR_DAGEN = 365;
const MIN_MAANDEN = 4;
const DAG_MS = 24 * 60 * 60 * 1000;

/** Wacht even na het winstscherm, zodat de vraag niet midden in een Zet of tijdens de animatie komt. */
export const WACHTTIJD_MS = 1500;

/** De tijdstippen van eerdere vragen; `null` als de opslag niet werkt (dan liever nooit vragen). */
function eerdereVragen(nu: number): number[] | null {
  try {
    const lijst = localStorage.getItem(SLEUTEL);
    if (lijst !== null) {
      const v: unknown = JSON.parse(lijst);
      return Array.isArray(v) ? v.filter((x): x is number => typeof x === "number" && Number.isFinite(x)) : [nu];
    }
    const oud = localStorage.getItem(OUDE_SLEUTEL);
    if (oud === null) return [];
    const t = Date.parse(oud);
    return [Number.isNaN(t) ? nu : t];
  } catch {
    return null;
  }
}

/** Mag er nu gevraagd worden, gegeven de eerdere vragen? */
export function magVragen(eerder: number[], nu: number): boolean {
  if (eerder.filter((t) => t > nu - JAAR_DAGEN * DAG_MS).length >= MAX_PER_JAAR) return false;
  const laatste = Math.max(...eerder, -Infinity);
  if (laatste === -Infinity) return true;
  const vroegst = new Date(laatste);
  vroegst.setMonth(vroegst.getMonth() + MIN_MAANDEN);
  return nu >= vroegst.getTime();
}

/** Roep dit aan zodra het winstscherm van een gewonnen Potje staat (niet na verlies of Opgeven). */
export function vraagBeoordelingNaWinst(): void {
  if (!isIosApp()) return;
  const nu = Date.now();
  const eerder = eerdereVragen(nu);
  if (eerder === null || !magVragen(eerder, nu)) return;
  try {
    localStorage.setItem(SLEUTEL, JSON.stringify([...eerder, nu]));
  } catch {
    return;
  }
  setTimeout(async () => {
    try {
      const { invoke } = await import("@tauri-apps/api/core");
      await invoke("vraag_beoordeling");
    } catch {
      // Apple mag de vraag weigeren; de Speler merkt niets.
    }
  }, WACHTTIJD_MS);
}

/** Opent de App Store op de plek om sterren te geven (alleen in de iPhone-app getoond, zie Account). */
export const BEOORDEEL_LINK = "itms-apps://apps.apple.com/app/id6831230722?action=write-review";
