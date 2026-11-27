/**
 * De tekens en de inkt van een Steen buiten het 3D-bord (de Stenen in lijsten en op platen, `LakSteen.svelte`). De kleuren
 * staan op één plek: `SPELER_KLEUREN`. Het 3D-bord (ontwerp 1b, taak 177) tekent Stenen van lak met dezelfde tekens; elke kleur
 * heeft daar een eigen lak (`steen::lak` in `crates/halma-bord3d`).
 */
import { SPELER_KLEUREN } from "./spelers";

/** De donkere inkt van het ontwerp: tekens op lichte Stenen en de schaduw. */
export const INKT = "#1f3a82";

export type Teken = { d: string; regel?: "evenodd" };

/**
 * Het teken op de kop van elke Speler, rond (0, 0), tot 0,3 groot. Per Speler een andere vorm,
 * zodat ook kleurenblinde Spelers de Stenen uit elkaar houden: ▲ ■ ● ◆ ✚ ○.
 */
export const TEKENS: readonly Teken[] = [
  { d: "M0 -.29L.28 .21H-.28Z" },
  { d: "M-.19 -.23h.38a.04.04 0 0 1 .04.04v.38a.04.04 0 0 1-.04.04h-.38a.04.04 0 0 1-.04-.04v-.38a.04.04 0 0 1 .04-.04Z" },
  { d: "M.26 0a.26.26 0 1 0-.52 0a.26.26 0 1 0 .52 0Z" },
  { d: "M0 -.31L.27 0L0 .31L-.27 0Z" },
  { d: "M-.09 -.28h.18v.19h.19v.18h-.19v.19h-.18v-.19h-.19v-.18h.19Z" },
  { d: "M.26 0a.26.26 0 1 0-.52 0a.26.26 0 1 0 .52 0ZM.12 0a.12.12 0 1 1-.24 0a.12.12 0 1 1 .24 0Z", regel: "evenodd" },
];

/**
 * Het kleurpaar van de gaten van het kleine bord (`MiniBord.svelte`, bij de keuze van het bord voor een Uitdaging). Het 3D-bord
 * heeft sinds taak 177 gaten in rood lak (ontwerp 1b). `GAT_DIEP` is het donkerst, 2,8 op 1 contrast tegen wit.
 */
export const GAT_RAND = "#cdb67e";
export const GAT_DIEP = "#b39758";

/** Zo licht (0 tot 1) ziet het oog een kleur, voor het contrast van het teken. */
function helderheid(hex: string): number {
  const lin = (i: number) => {
    const c = parseInt(hex.slice(1 + 2 * i, 3 + 2 * i), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(0) + 0.7152 * lin(1) + 0.0722 * lin(2);
}

/** Contrast (1 tot 21) tussen twee kleuren, zoals WCAG het rekent. */
export function contrast(a: string, b: string): number {
  const [x, y] = [helderheid(a), helderheid(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

/** Het teken is wit of donker, wat het meeste contrast geeft met de kleur van de Steen. */
export function inktVoor(kleur: string): string {
  return contrast(kleur, "#ffffff") >= contrast(kleur, INKT) ? "#ffffff" : INKT;
}

/** De kleur van het teken van `speler`: uit de lijst, of berekend bij een eigen kleur. */
export function tekenInkt(speler: number, kleur?: string): string {
  return kleur ? inktVoor(kleur) : SPELER_KLEUREN[speler].inkt;
}
