/**
 * Tikken en slepen op het 3D-bord met een vinger: welk vak bedoelt de Speler.
 * Alleen om te kiezen; of een Zet mag, komt uit de spelregels in Rust. Niets licht op als hint.
 * Alle afstanden zijn in vakken (één vak is 1 eenheid), tenzij er "px" staat.
 */

import { meld } from "./geluid";

export type Punt = { x: number; y: number };
/** De plek van het bord op het scherm, in px. */
export type Vlak = { left: number; top: number; width: number; height: number };

/** Met een gekozen steen: zo ver mag een tik of een losgelaten steen van een vak zijn. */
export const GAT_STRAAL = 0.75;

/** 3D-bord: een tik pakt een eigen steen tot zoveel px naast zijn omtrek op het scherm (een dikke vinger). */
export const TIK_PX = 24;
/** 3D-bord: een vinger die zo dicht (px) bij een eigen steen neerkomt, kan hem slepen. Verder weg schuift hij het bord. */
export const GREEP_PX = 12;
/** Tik of slepen, zoals `nog_een_tik` in `crates/halma-bord3d/src/gebaren.rs`. */
const TIK_RUIMTE_PX = 12;
const TIK_SNEL_MS = 180;
const TIK_RUIMTE_TRAAG_PX = 6;

/**
 * Is een vinger die `px` van zijn begin is, `ms` na het neerkomen, nog een tik? Bij een snelle tik
 * rolt de vinger wat (tot 12 px); dat is geen slepen. Staat hij eerst even stil (0,18 s), dan
 * begint slepen al na 6 px.
 */
export function nogEenTik(px: number, ms: number): boolean {
  return px <= TIK_RUIMTE_PX && (ms <= TIK_SNEL_MS || px <= TIK_RUIMTE_TRAAG_PX);
}

/**
 * Wat een tik doet. `zet` is een poging: of hij mag, zeggen de spelregels (via `optik`).
 * Er licht niets op: de app laat nooit zien waar een steen heen kan.
 */
export type Keuze =
  /** Probeer de gekozen steen naar `vak` te zetten. */
  | { soort: "zet"; vak: number }
  /** Kies de steen op `vak`. */
  | { soort: "kies"; vak: number }
  /** Laat de keuze los. `vak` is de gekozen steen als de tik daarop viel, anders null (ver weg). */
  | { soort: "los"; vak: number | null };

export type TikStand = {
  punten: Punt[];
  /** Per vak de Speler vanaf 0, of -1. */
  stand: ArrayLike<number>;
  aanDeBeurt: number;
  /** Mag de Speler nu zijn stenen kiezen (online: alleen op de eigen beurt). */
  speelbaar: boolean;
  gekozen: number | null;
};

/** Het dichtstbijzijnde vak bij `p` binnen `straal` waarvoor `mag` geldt, of null. */
export function dichtsteVak(p: Punt, punten: Punt[], straal: number, mag: (vak: number) => boolean = () => true): number | null {
  let beste: { vak: number; d: number } | null = null;
  for (let vak = 0; vak < punten.length; vak++) {
    if (!mag(vak)) continue;
    const d = Math.hypot(punten[vak].x - p.x, punten[vak].y - p.y);
    if (d <= straal && (!beste || d < beste.d)) beste = { vak, d };
  }
  return beste?.vak ?? null;
}

/**
 * Wat het 3D-bord onder een vinger ziet (`wijs`): de plek op het bord op de hoogte van de gaatjes,
 * de eigen steen die de vinger pakt (ruim, ook op zijn kop), en de steen die hij echt raakt.
 */
export type Gewezen = { plek: Punt | null; eigen: number | null; geraakt: number | null };

/** Met een gekozen steen: een tik op `vak` (null: niets in de buurt). */
function opVak(vak: number | null, t: TikStand): Keuze {
  if (vak === null) return { soort: "los", vak: null };
  if (vak === t.gekozen) return { soort: "los", vak };
  if (t.stand[vak] === t.aanDeBeurt) return { soort: "kies", vak };
  return { soort: "zet", vak };
}

/**
 * Wat een tik op het 3D-bord betekent. Een steen is hoog en de camera kijkt schuin: een vinger op
 * de kop ligt boven een ander vak. Daarom kijkt het 3D-bord zelf welke steen onder de vinger staat.
 * - Zonder gekozen steen: de eigen steen die de vinger pakt (ruim, `TIK_PX`), anders niets.
 * - Met een gekozen steen: staat de vinger duidelijk op een steen, dan het vak van die steen; anders (ook op
 *   de rand van een steen die een gat half bedekt, taak 168) het dichtstbijzijnde vak binnen `GAT_STRAAL`.
 *   Elk vak telt even zwaar: de tik verraadt niet welke vakken mogen. Een leeg vak of een steen van een ander is een poging,
 *   een eigen steen kiest die steen, de gekozen steen laat los.
 */
export function kiesGewezen(w: Gewezen, t: TikStand): Keuze {
  if (!t.speelbaar) return { soort: "los", vak: null };
  if (t.gekozen === null) return w.eigen === null ? { soort: "los", vak: null } : { soort: "kies", vak: w.eigen };
  return opVak(w.geraakt ?? (w.plek ? dichtsteVak(w.plek, t.punten, GAT_STRAAL) : null), t);
}

/**
 * Waar een losgelaten steen landt (slepen op het 3D-bord). `onder` is de plek op het bord recht onder de
 * steen (zijn schaduw). Het dichtstbijzijnde vak binnen `GAT_STRAAL` telt, welk vak ook; wat mag, telt niet mee.
 * - `blijf`: boven zijn eigen vak: hij valt terug in zijn gaatje (geen Zet).
 * - `terug`: naast het bord of boven een eigen steen: terug naar zijn gaatje, zonder Zet.
 * - `zet`: boven een ander vak: een poging. Mag die niet, dan gaat hij terug (dat zeggen de spelregels).
 */
export type Landing = { soort: "blijf" } | { soort: "terug" } | { soort: "zet"; vak: number };

export function landing(onder: Punt | null, vak: number, t: Pick<TikStand, "punten" | "stand" | "aanDeBeurt">): Landing {
  const naar = onder ? dichtsteVak(onder, t.punten, GAT_STRAAL) : null;
  if (naar === vak) return { soort: "blijf" };
  if (naar === null || t.stand[naar] === t.aanDeBeurt) return { soort: "terug" };
  return { soort: "zet", vak: naar };
}

/**
 * Wat `optik` teruggeeft: `false` als het een Zet was die niet mag (de steen rolt dan terug).
 * Al het andere (kiezen, loslaten, een Zet die mag) geeft niets terug.
 */
export type Uitkomst = boolean | void;

/**
 * Voer een keuze uit via `optik`, zodat App en OnlineSpel dezelfde regels blijven volgen:
 * een steen kiezen of een Zet proberen, loslaten met nog een tik op de gekozen steen, of `weg`
 * bij een tik ver weg. Mag een Zet niet, dan `mis(van, naar)`: het bord laat de steen terugrollen.
 */
export function voerUit(
  k: Keuze,
  t: { optik: (vak: number) => Uitkomst; weg?: () => void; gekozen: number | null; mis?: (van: number, naar: number) => void },
): void {
  if (k.soort === "zet") {
    const van = t.gekozen;
    const uitkomst = t.optik(k.vak);
    if (uitkomst === false && van !== null) {
      meld({ soort: "terug" });
      t.mis?.(van, k.vak);
    } else if (uitkomst !== false) meld({ soort: "neer" });
  } else if (k.soort === "kies") {
    t.optik(k.vak);
    meld({ soort: "pak" });
  }
  else if (k.vak === null && t.weg) t.weg();
  else if (t.gekozen !== null) t.optik(t.gekozen);
}
