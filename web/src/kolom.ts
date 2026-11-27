/**
 * Breed scherm (taak 236, feature 230): een tafel die op een telefoon onder elkaar ligt (titel boven het bord, lijst en knoppen eronder)
 * ligt op een breed scherm zoals het Startmenu: het bord links, zo groot als de hoogte toelaat, en de rest als kolom rechts ernaast.
 * Dezelfde voorwerpen in dezelfde volgorde, alleen op een andere plek; de camera past zich aan (`Camera::tafel`). Van rechts naar links
 * spiegelt `voorwerpLijst` x, dus dan ligt de kolom links (zoals het Startmenu).
 * Zie docs/bord3d.md, "Breed scherm".
 */
import type { Voorwerp } from "./voorwerpen";

/** Hoe ver het bord zijwaarts reikt (halve breedte met beslag) en hoe ver in z (boven en onder), in vakken. */
export const BORD_ZIJ = { ster: 7.79, vierkant: 9.54 } as const;
export const BORD_DIEP = { ster: 9.0, vierkant: 9.54 } as const;
/** De lucht tussen het bord en de kolom (vakken). */
export const KOLOM_LUCHT = 1.5;
/** De halve breedte van een gewone rij (de rij met Back, `TERUG_RAND`): de kolom staat met die rand op dezelfde plek. */
const RIJ_HALF = 7.8;
/** Ruimte tussen twee rijen van de kolom: zoals op de telefoon, maar nooit meer dan dit (daar zat het bord tussen). */
const MAX_TUSSEN = 0.7;
const MIN_TUSSEN = 0.3;
/** Zo diep wordt een rekbare plaat minstens (vakken). */
const MIN_REK = 5;

export type KolomOpties = {
  /** Het bord op de tafel: daar hangt af hoe ver de kolom van het midden ligt. */
  vierkant?: boolean;
  /** Voorwerpen die bij het bord blijven liggen (zoals op de telefoon), bijvoorbeeld de naamplaten van de Spelers. `vast` blijft altijd. */
  blijven?: (v: Voorwerp) => boolean;
  /** Het voorwerp dat dieper wordt tot de kolom zo hoog is als het bord (een plaat met een lijst). Zonder: de kolom staat in het midden. */
  rekbaar?: string;
  /** Extra ruimte onder een voorwerp (id, vakken): voor HTML die tussen twee platen ligt (de medaille van het winstscherm). */
  ruimte?: Record<string, number>;
};

/** Hoe hoog de kolom is: zo hoog als het bord, of als wat er bij het bord blijft liggen. */
function hoogte(blijft: readonly Voorwerp[], vierkant: boolean): { boven: number; onder: number } {
  const diep: number = vierkant ? BORD_DIEP.vierkant : BORD_DIEP.ster;
  let boven = -diep, onder = diep;
  for (const v of blijft) {
    boven = Math.min(boven, v.z - v.d / 2);
    onder = Math.max(onder, v.z + v.d / 2);
  }
  return { boven, onder };
}

/**
 * De opstelling van een telefoon als kolom rechts van het bord. De voorwerpen die niet blijven, gaan in rijen (wat in z overlapt is
 * één rij), van boven naar onder zoals op de telefoon, en elke rij houdt zijn plek in x ten opzichte van het midden. Een rekbare
 * plaat vult de hoogte van het bord; anders staat de kolom in het midden van die hoogte.
 */
export function naarKolom(lijst: readonly Voorwerp[], o: KolomOpties = {}): Voorwerp[] {
  const blijft = (v: Voorwerp) => v.vast === true || (o.blijven?.(v) ?? false);
  const kolom = lijst.filter((v) => !blijft(v));
  if (!kolom.length) return [...lijst];

  type Rij = { boven: number; onder: number; leden: Voorwerp[] };
  const rijen: Rij[] = [];
  for (const v of [...kolom].sort((a, b) => a.z - a.d / 2 - (b.z - b.d / 2))) {
    const rij = rijen[rijen.length - 1];
    if (rij && v.z - v.d / 2 < rij.onder - 0.05) {
      rij.leden.push(v);
      rij.onder = Math.max(rij.onder, v.z + v.d / 2);
    } else rijen.push({ boven: v.z - v.d / 2, onder: v.z + v.d / 2, leden: [v] });
  }
  const tussen = rijen.slice(1).map((r, i) => {
    const extra = Math.max(0, ...rijen[i].leden.map((v) => o.ruimte?.[v.id] ?? 0));
    return Math.min(MAX_TUSSEN, Math.max(MIN_TUSSEN, r.boven - rijen[i].onder)) + extra;
  });
  const diepte = rijen.map((r) => r.onder - r.boven);
  const totaal = diepte.reduce((s, d) => s + d, 0) + tussen.reduce((s, d) => s + d, 0);

  const vierkant = o.vierkant ?? false;
  const { boven, onder } = hoogte(lijst.filter(blijft), vierkant);
  // De rekbare plaat neemt wat er over is, ook als hij daarvoor kleiner wordt dan op de telefoon (een lijst schuift), maar niet
  // minder dan `MIN_REK`.
  const rek = o.rekbaar === undefined ? -1 : rijen.findIndex((r) => r.leden.some((v) => v.id === o.rekbaar));
  const groei = rek < 0 ? 0 : Math.max(MIN_REK - diepte[rek], onder - boven - totaal);
  const begin = rek < 0 ? (boven + onder) / 2 - totaal / 2 : boven;

  // De kolom staat met de linkerrand van de gewone rij (Back) op vaste afstand van het bord; een bredere rij steekt rechts uit.
  const half = Math.max(RIJ_HALF, ...kolom.map((v) => Math.abs(v.x) + v.b / 2));
  const x0 = (vierkant ? BORD_ZIJ.vierkant : BORD_ZIJ.ster) + KOLOM_LUCHT + half;

  const nieuw = new Map<Voorwerp, Voorwerp>();
  let z = begin;
  rijen.forEach((r, i) => {
    const d = diepte[i] + (i === rek ? groei : 0);
    for (const v of r.leden) {
      const rekt = i === rek && v.id === o.rekbaar;
      const vd = rekt ? v.d + groei : v.d;
      // Binnen de rij houdt elk voorwerp zijn plek ten opzichte van de bovenkant van de rij.
      const vz = rekt ? z + d / 2 : z + (v.z - v.d / 2 - r.boven) + v.d / 2;
      nieuw.set(v, { ...v, x: x0 + v.x, z: vz, d: vd });
    }
    z += d + (tussen[i] ?? 0);
  });
  return lijst.map((v) => nieuw.get(v) ?? v);
}
