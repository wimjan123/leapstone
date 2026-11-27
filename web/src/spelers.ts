import { zet_pad } from "./wasm/halma_core.js";
import { t } from "./taal.svelte";

/**
 * Vaste kleuren per Speler (geen keuze voor de Speler zelf), voor het 2D- en het 3D-bord en alle
 * Stenen in lijsten: dit is de enige plek. Klei-achtige Stenen
 * op een wit bord, elk met een teken op de kop, zodat ook kleurenblinde Spelers ze uit elkaar
 * houden: rood ▲, blauw ■, groen ●, geel ◆, paars ✚, grafiet ○.
 * - `kleur`: de kleur van de Steen. Blauw en grafiet liggen verder uit elkaar dan in het
 *   ontwerp (blauw #2F52CC, grafiet #38424F), zodat het kleinste kleurverschil (ΔE00) niet kleiner is
 *   dan in de oude set: 26,0 normaal en 18,4 bij deuteranopie (oud: 24,9 en 17,2).
 * - `inkt`: de kleur van het teken: wit of donker, wat het meeste contrast met `kleur` geeft.
 */
export const SPELER_KLEUREN = [
  { naam: "Red", kleur: "#e2533c", inkt: "#ffffff" },
  { naam: "Blue", kleur: "#3358e0", inkt: "#ffffff" },
  { naam: "Green", kleur: "#2aa882", inkt: "#1f3a82" },
  { naam: "Yellow", kleur: "#f6c945", inkt: "#1f3a82" },
  { naam: "Purple", kleur: "#b49cf7", inkt: "#1f3a82" },
  { naam: "Graphite", kleur: "#242c36", inkt: "#ffffff" },
] as const;

export const AANTALLEN = [2, 3, 4, 6] as const;

/** Spelers tellen vanaf 0 in Rust; op het scherm vanaf 1. */
export function spelerNaam(speler: number, computer = false): string {
  return t(computer ? "computer.n" : "player.n", { n: speler + 1 });
}

/** Wie speelt een plek: een Speler (niveau null) of een Computerspeler met niveau 0, 1 of 2. */
export type Plek = { niveau: Niveau | null };
export type Niveau = 0 | 1 | 2;
export const NIVEAUS: { niveau: Niveau; naam: string }[] = [
  { niveau: 0, naam: "easy" },
  { niveau: 1, naam: "normal" },
  { niveau: 2, naam: "hard" },
];

/** Pauze voordat een Computerspeler zet, zodat je de Zet kunt volgen. */
export const COMPUTER_PAUZE_MS = 600;

export function spelerKleur(speler: number): string {
  return SPELER_KLEUREN[speler].kleur;
}

export function kleurNaam(speler: number): string {
  return SPELER_KLEUREN[speler].naam;
}

/**
 * De laatste Zet, zodat de steen langs zijn pad naar zijn nieuwe vak kan bewegen.
 * `vakken`: elk vak van de Zet, van het startvak tot `naar` zelf (voor het 3D-bord).
 * `pad`: dezelfde vakken als afstand tot `naar` (in vakken), voor de duur van de beweging en het geluid.
 * Meer dan twee punten is een Sprongketen: de steen hupt over elke steen.
 */
export type Beweging = { naar: number; vakken: number[]; pad: { x: number; y: number }[]; sprong: boolean };

export type Vorm = "ster" | "vierkant";

/** Aantallen per bord: het Vierkant bord kent alleen 2 of 4 spelers. */
export const AANTALLEN_VIERKANT = [2, 4] as const;
/** Hoeveel Computerspelers tegen jou kunnen: de geldige aantallen spelers min jezelf. */
export const tegenstanders = (vorm: Vorm): readonly number[] => (vorm === "vierkant" ? [1, 3] : [1, 2, 3, 5]);

/** Rasterplek (kolom, rij) van een vak naar een plek op het scherm; één vak is 1 eenheid breed. */
export function schermPunt(vorm: Vorm, kolom: number, rij: number): { x: number; y: number } {
  return vorm === "vierkant" ? { x: kolom, y: rij } : { x: kolom + rij / 2, y: rij * 0.866 };
}

/**
 * De beweging van een Zet, alleen om te tonen. `standVoor` is de stand vóór de Zet
 * (per vak de Speler vanaf 0, of -1). Het pad komt uit de spelregels in WebAssembly;
 * lukt dat niet, dan glijdt de steen recht van `van` naar `naar`.
 */
export function beweging(
  vorm: Vorm,
  plekken: ArrayLike<number>,
  standVoor: ArrayLike<number>,
  van: number,
  naar: number,
): Beweging {
  let vakken: number[] = [];
  try {
    vakken = Array.from(zet_pad(vorm === "vierkant", Int32Array.from(standVoor), van, naar));
  } catch {
    // Geen pad: dan recht.
  }
  if (vakken.length < 2) vakken = [van, naar];
  const punt = (vak: number) => schermPunt(vorm, plekken[2 * vak], plekken[2 * vak + 1]);
  const eind = punt(naar);
  const pad = vakken.map((v) => {
    const p = punt(v);
    return { x: p.x - eind.x, y: p.y - eind.y };
  });
  // Een stap gaat naar een buurvak (afstand 1); een Sprong is twee vakken ver.
  const sprong = vakken.length > 2 || Math.hypot(pad[0].x, pad[0].y) > 1.5;
  return { naar, vakken, pad, sprong };
}

/** De stand vóór de laatste Zet: zet de steen op `naar` terug op `van`. */
export function standVoorZet(standNa: ArrayLike<number>, van: number, naar: number): number[] {
  const voor = Array.from(standNa);
  voor[van] = voor[naar];
  voor[naar] = -1;
  return voor;
}

/** Hoe lang de beweging van een Zet duurt, in milliseconden (zonder "minder beweging"). */
export function bewegingDuur(b: Beweging | null): number {
  if (!b) return 0;
  return b.sprong ? (b.pad.length - 1) * HUP_MS : STAP_MS;
}
export const HUP_MS = 250;
export const STAP_MS = 230;

/**
 * De beeldjes van een beweging voor de Web Animations API: per hup gaat de knikker in een boog
 * omhoog (groter) en weer omlaag; de schaduw blijft op het bord en wordt zachter in de lucht.
 */
export function hupFrames(b: Beweging): { knikker: Keyframe[]; schaduw: Keyframe[]; duur: number } {
  const hups = b.pad.length - 1;
  const hoogte = b.sprong ? 0.5 : 0.16;
  const stappen = 10;
  const n = (v: number) => (Math.abs(v) < 5e-4 ? 0 : v).toFixed(3);
  const knikker: Keyframe[] = [];
  const schaduw: Keyframe[] = [];
  for (let i = 0; i < hups; i++) {
    const a = b.pad[i];
    const z = b.pad[i + 1];
    for (let j = i === 0 ? 0 : 1; j <= stappen; j++) {
      const t = j / stappen;
      const e = 0.5 - 0.5 * Math.cos(Math.PI * t);
      const boog = Math.sin(Math.PI * t);
      const x = a.x + (z.x - a.x) * e;
      const y = a.y + (z.y - a.y) * e;
      const offset = (i + t) / hups;
      knikker.push({
        offset,
        transform: `translate(${n(x - 0.04 * boog)}px, ${n(y - hoogte * boog)}px) scale(${n(1 + 0.3 * hoogte * boog)})`,
      });
      schaduw.push({
        offset,
        transform: `translate(${n(x + 0.12 * boog)}px, ${n(y + 0.16 * boog)}px) scale(${n(1 + 0.35 * hoogte * boog)})`,
        opacity: 1 - 0.9 * hoogte * boog,
      });
    }
  }
  return { knikker, schaduw, duur: bewegingDuur(b) };
}

/** Meng een kleur met wit (t > 0) of zwart (t < 0); t van -1 tot 1. */
export function mengKleur(hex: string, t: number): string {
  const doel = t > 0 ? 255 : 0;
  const f = Math.abs(t);
  const kanaal = (i: number) => {
    const c = parseInt(hex.slice(1 + 2 * i, 3 + 2 * i), 16);
    return Math.round(c + (doel - c) * f)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${kanaal(0)}${kanaal(1)}${kanaal(2)}`;
}
