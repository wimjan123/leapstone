import { opGebeurtenis, type Gebeurtenis, type Opties } from "./geluid";

/**
 * Trillen bij Zetten en de beurt (taak 159). Dezelfde gebeurtenissen als het geluid (`geluid.ts`), een eigen
 * knop Vibration. Trillen hoort ook bij een telefoon op stil, maar nooit als de app op de achtergrond staat.
 * Op de iPhone-app gaat het via de haptiek van het systeem (`haptiek` in `crates/halma-app/src/haptiek.rs`),
 * anders via `navigator.vibrate` (Android en browsers die dat kennen).
 */

export const TRILLEN_OPSLAG = "leapstone.trillen";
/** Geen patroon is langer dan dit (ms): trillen blijft subtiel. */
export const MAX_TRIL_MS = 500;

/** Een patroon zoals `navigator.vibrate`: trilduur, pauze, trilduur, ... (ms). */
export type Patroon = number[];

/** Een iPhone kent geen duur, alleen een soort tik. */
export type Tik = "licht" | "stevig" | "duidelijk";

// ---- Instelling: standaard aan, onthouden op het toestel. ----

export function trillenAan(): boolean {
  try {
    return localStorage.getItem(TRILLEN_OPSLAG) !== "uit";
  } catch {
    return true;
  }
}

export function zetTrillen(aan: boolean): void {
  // Lukt opslaan niet, dan geldt de keuze tot de app sluit.
  uitDezeSessie = !aan;
  try {
    if (aan) localStorage.removeItem(TRILLEN_OPSLAG);
    else localStorage.setItem(TRILLEN_OPSLAG, "uit");
  } catch {
    // Zie hierboven.
  }
}
let uitDezeSessie = false;
const mag = () => !uitDezeSessie && trillenAan();

// ---- Wat elke gebeurtenis trilt. ----

/** Het patroon (ms) en de iPhone-tikken van een gebeurtenis; `null`: niet trillen. */
export function trilling(g: Gebeurtenis, o: Opties = {}): { patroon: Patroon; tikken: Tik[] } | null {
  switch (g.soort) {
    case "pak":
      return { patroon: [8], tikken: ["licht"] };
    case "sprong":
      return { patroon: [12], tikken: ["licht"] };
    // Een eigen stap is al gevoeld bij het neerzetten; een stap van een tegenstander niet.
    case "stap":
      return o.tegenstander ? { patroon: [12], tikken: ["licht"] } : null;
    case "neer":
      return { patroon: [22], tikken: ["stevig"] };
    case "terug":
      return { patroon: [10, 60, 10], tikken: ["licht", "licht"] };
    case "beurt":
      return { patroon: [60], tikken: ["duidelijk"] };
    case "prestatie":
      return { patroon: [30], tikken: ["stevig"] };
    case "winst":
      return { patroon: [15, 90, 15, 90, 25], tikken: ["licht", "licht", "stevig"] };
  }
}

// ---- Uitvoeren. ----

const opIphone = () =>
  typeof navigator !== "undefined" && /iPhone|iPad|iPod/.test(navigator.userAgent) && "__TAURI_INTERNALS__" in globalThis;
const opDeAchtergrond = () => typeof document !== "undefined" && document.visibilityState === "hidden";

/** Trilt een gebeurtenis, tenzij Vibration uit staat of de app op de achtergrond staat. */
export function trilGebeurtenis(g: Gebeurtenis, o: Opties = {}): void {
  if (!mag() || opDeAchtergrond()) return;
  const t = trilling(g, o);
  if (!t) return;
  try {
    if (opIphone()) {
      void import("@tauri-apps/api/core").then(({ invoke }) => invoke("haptiek", { tikken: t.tikken })).catch(() => {});
    } else if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
      navigator.vibrate(t.patroon);
    }
  } catch {
    // Trillen is een extraatje: een fout mag het spel nooit storen.
  }
}

opGebeurtenis(trilGebeurtenis);
