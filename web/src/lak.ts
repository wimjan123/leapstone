/**
 * De kleuren van uiterlijk 1b (taak 182) voor wat buiten het 3D-bord als lak getekend wordt: de Stenen in lijsten en op de platen
 * (`Steentje.svelte`, `LakSteen.svelte`) en het medaillon van het winstscherm. Uit prototype 1b (`ontwerp-leapstone/arena-147/kandidaat-1b`).
 */
import { mengKleur } from "./spelers";

/**
 * De zes Steenkleuren van lak: de kleur van de kop van de Steen op de render van 1b (`kleuren.md`). Alleen grafiet
 * is lichter dan in 1b (#342a1a): zo staat het zwarte lak niet in het donkerrode lak van het bord te verdwijnen, en het
 * kleurverschil met de andere vijf blijft binnen de eis.
 */
export const LAK_STENEN = [
  { naam: "Red", kleur: "#c5573a", teken: "#fff3dc" },
  { naam: "Blue", kleur: "#5455b6", teken: "#fff3dc" },
  { naam: "Green", kleur: "#5ac2a1", teken: "#10241f" },
  { naam: "Yellow", kleur: "#efc73d", teken: "#2a1a0c" },
  { naam: "Purple", kleur: "#d2a4de", teken: "#24143c" },
  { naam: "Graphite", kleur: "#4a443c", teken: "#fff3dc" },
] as const;

/** Het grijs van de andere Stenen in de Dagelijkse puzzel en de Speluitleg, op het rode lak. */
export const LAK_GRIJS = "#a6a39b";

/** Diep rood lak (oxbloed) van het bord, met zijn lichte en donkere kant. */
export const LAK_BORD = { licht: "#5b1316", midden: "#430a0c", donker: "#2c0608" };
export const GOUD = { licht: "#f3d98a", midden: "#d6a93e", donker: "#8d6418" };

/** De tinten van een Steen van lak, uit zijn kleur. */
export function lakTinten(kleur: string) {
  return {
    licht: mengKleur(kleur, 0.22),
    glans: mengKleur(kleur, 0.55),
    donker: mengKleur(kleur, -0.3),
    voet: mengKleur(kleur, -0.45),
  };
}

/** Hoeveel schermen nu op de zijden tafel liggen (een tafel met voorwerpen, of de laadtafel). */
let opTafel = 0;
/**
 * Leg het scherm op de zijden tafel (klasse `zijde` op body, zie app.css) zolang het in beeld is. Geeft een functie die
 * het er weer af haalt. Tellen: twee schermen tegelijk halen elkaars tafel niet weg.
 */
export function opZijde(): () => void {
  if (opTafel++ === 0) document.body.classList.add("zijde");
  let weg = false;
  return () => {
    if (weg) return;
    weg = true;
    if (--opTafel === 0) document.body.classList.remove("zijde");
  };
}
