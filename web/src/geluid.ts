import { HUP_MS, type Beweging } from "./spelers";

/**
 * Geluid bij Zetten en Sprongen (taak 158). Alle geluiden zijn zelf gemaakt met Web Audio (geen bestanden,
 * dus vrij van rechten). Het bord en de schermen melden alleen wat er gebeurt (`meld`); wat daarmee gebeurt,
 * is een luisteraar. Geluid is er één, trillen (`trillen.ts`) luistert met `opGebeurtenis` mee.
 * Geen geluid als Sound uit staat, als de app op de achtergrond staat of (iPhone) als de telefoon op stil staat.
 */

export type Gebeurtenis =
  /** Een Steen zet een stap. */
  | { soort: "stap" }
  /** Een Sprong; `nummer` telt de Sprongen van dezelfde Zet vanaf 0, elke klik is iets hoger. */
  | { soort: "sprong"; nummer: number }
  /** Een Steen rolt terug na een Zet die niet mag. */
  | { soort: "terug" }
  /** Een Potje (of de Dagelijkse puzzel) is gewonnen. */
  | { soort: "winst" }
  /** Een Speler pakt een Steen op (alleen trillen, geen geluid). */
  | { soort: "pak" }
  /** Een Speler zet een Steen neer met een Zet die mag (alleen trillen, geen geluid). */
  | { soort: "neer" }
  /** Een online Potje geeft de beurt aan de Speler zelf (alleen trillen, geen geluid). */
  | { soort: "beurt" }
  /** Een nieuwe Prestatie (taak 174): een kort geluidje en een tik. */
  | { soort: "prestatie" };

export type Opties = {
  /** De Zet van een tegenstander: iets zachter. */
  tegenstander?: boolean;
};

export const GELUID_OPSLAG = "leapstone.geluid";
/** Zo zacht klinkt de Zet van een tegenstander ten opzichte van een eigen Zet. */
export const TEGENSTANDER_VOLUME = 0.55;

// ---- Instelling: standaard aan, onthouden op het toestel. ----

export function geluidAan(): boolean {
  try {
    return localStorage.getItem(GELUID_OPSLAG) !== "uit";
  } catch {
    return true;
  }
}

export function zetGeluid(aan: boolean): void {
  // Lukt opslaan niet, dan geldt de keuze tot de app sluit.
  uitDezeSessie = !aan;
  try {
    if (aan) localStorage.removeItem(GELUID_OPSLAG);
    else localStorage.setItem(GELUID_OPSLAG, "uit");
  } catch {
    // Zie hierboven.
  }
}
let uitDezeSessie = false;
const mag = () => !uitDezeSessie && geluidAan();

// ---- Gebeurtenissen: één plek waar het bord iets meldt. ----

type Luisteraar = (g: Gebeurtenis, o: Opties) => void;
const luisteraars = new Set<Luisteraar>();

/** Luister naar alle gebeurtenissen (bijvoorbeeld om te trillen). Geeft een functie om te stoppen. */
export function opGebeurtenis(l: Luisteraar): () => void {
  luisteraars.add(l);
  return () => luisteraars.delete(l);
}

export function meld(g: Gebeurtenis, o: Opties = {}): void {
  for (const l of [...luisteraars]) l(g, o);
}

/** Meld de geluiden van een hele Zet: een stap, of een Sprong per vak van het pad (oplopend) op het moment van landen. */
export function meldBeweging(b: Beweging | null, o: Opties = {}): void {
  if (!b) return;
  if (!b.sprong) return meld({ soort: "stap" }, o);
  const hups = Math.max(1, b.pad.length - 1);
  for (let i = 0; i < hups; i++) {
    const nummer = i;
    if (i === 0) meld({ soort: "sprong", nummer }, o);
    else setTimeout(() => meld({ soort: "sprong", nummer }, o), i * HUP_MS);
  }
}

// ---- Toonhoogte en klank. ----

/** Elke volgende Sprong in dezelfde Zet is twee halve tonen hoger, tot een octaaf. */
export const SPRONG_BASIS_HZ = 523.25;
export function sprongToon(nummer: number): number {
  return SPRONG_BASIS_HZ * 2 ** (Math.min(Math.max(0, nummer), 6) * 2 / 12);
}

type Klank = { hz: number; start: number; duur: number; volume: number; vorm: OscillatorType; naar?: number };

/** De klanken van een gebeurtenis; allemaal korter dan een halve seconde en zacht. */
export function klanken(g: Gebeurtenis): Klank[] {
  switch (g.soort) {
    case "stap":
      return [{ hz: 196, naar: 150, start: 0, duur: 0.07, volume: 0.32, vorm: "triangle" }];
    case "sprong":
      return [{ hz: sprongToon(g.nummer), start: 0, duur: 0.09, volume: 0.26, vorm: "sine" }];
    case "terug":
      return [{ hz: 130, naar: 98, start: 0, duur: 0.3, volume: 0.22, vorm: "sine" }];
    case "pak":
    case "neer":
    case "beurt":
      return [];
    case "prestatie":
      return [783.99, 1046.5].map((hz, i) => ({ hz, start: i * 0.09, duur: 0.12, volume: 0.18, vorm: "sine" as const }));
    case "winst":
      return [523.25, 659.25, 783.99].map((hz, i) => ({ hz, start: i * 0.11, duur: 0.14, volume: 0.2, vorm: "sine" as const }));
  }
}

// ---- Web Audio. ----

type Spelend = { ctx: AudioContext };
let spelend: Spelend | null = null;

function context(): AudioContext | null {
  if (spelend) return spelend.ctx;
  const Ctx = (globalThis as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext }).AudioContext ??
    (globalThis as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) return null;
  try {
    // iPhone: 'ambient' volgt de stilschakelaar (en de rest van de audio van de telefoon blijft doorspelen).
    const sessie = (navigator as { audioSession?: { type: string } }).audioSession;
    if (sessie) sessie.type = "ambient";
    spelend = { ctx: new Ctx() };
    return spelend.ctx;
  } catch {
    return null;
  }
}

const opDeAchtergrond = () => typeof document !== "undefined" && document.visibilityState === "hidden";

/** Speel een gebeurtenis, tenzij Sound uit staat of de app op de achtergrond staat. */
export function speelGeluid(g: Gebeurtenis, o: Opties = {}): void {
  if (!mag() || opDeAchtergrond()) return;
  const ctx = context();
  if (!ctx) return;
  if (ctx.state === "suspended") void ctx.resume().catch(() => {});
  const nu = ctx.currentTime;
  const factor = o.tegenstander ? TEGENSTANDER_VOLUME : 1;
  for (const k of klanken(g)) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const t0 = nu + k.start;
    osc.type = k.vorm;
    osc.frequency.setValueAtTime(k.hz, t0);
    if (k.naar) osc.frequency.exponentialRampToValueAtTime(k.naar, t0 + k.duur);
    // Een korte aanzet en een zachte uitloop, zodat er geen tik van het afknippen is.
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(k.volume * factor, t0 + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + k.duur);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + k.duur + 0.02);
  }
}

if (typeof document !== "undefined") {
  // Een browser start geluid pas na een tik: maak de audio klaar bij de eerste aanraking.
  const ontgrendel = () => {
    if (mag()) {
      const ctx = context();
      if (ctx?.state === "suspended") void ctx.resume().catch(() => {});
    }
  };
  document.addEventListener("pointerdown", ontgrendel, { passive: true });
  document.addEventListener("keydown", ontgrendel, { passive: true });
  // Op de achtergrond: niets spelen en de audio pauzeren.
  document.addEventListener("visibilitychange", () => {
    if (!spelend) return;
    if (opDeAchtergrond()) void spelend.ctx.suspend().catch(() => {});
    else if (mag()) void spelend.ctx.resume().catch(() => {});
  });
}

opGebeurtenis(speelGeluid);
