/**
 * De keuzebalk van de keuzeschermen (William, 2026-11-12): een balk van zwart lak met een kopje en de keuzes als toetsen van porselein
 * erop. Gebruikt door Spelers (Players) en Computer (Board, Opponents, Level) in `keuzetafel.ts`. Zie docs/bord3d.md.
 */
import { BALK_KOP } from "./knopplaten/plaat";
import type { Voorwerp } from "./voorwerpen";

/** Eén keuze op een keuzebalk: de tekst op de toets en of hij gekozen is. */
export type Keuze = { id: string; tekst: string; gekozen: boolean };

/**
 * De keuzebalk: 14 vakken breed, met de toetsen een rand van `BALK_RAND` binnen de balk. Hij ligt dichter bij de camera dan het
 * bord, dus even breed als het bord (15,6) was hij op het scherm breder en werd het bord kleiner.
 */
const BALK_B = 14;
export const BALK_D = 2.4;
const BALK_RAND = 0.22;
const TOETS_TUSSEN = 0.18;

/**
 * Een keuzebalk (William, 2026-11-12): een balk van zwart lak met het kopje (`kop`, een sleutel in talen/) aan de beginkant en de
 * keuzes als toetsen van porselein erop, even breed naast elkaar. De gekozen toets is kobaltblauw (plaatje `toetsGekozen`). De
 * toetsen staan met hun voet in de balk; de eerste in de lijst ligt naast het kopje (van rechts naar links spiegelt `voorwerpLijst` dat mee).
 */
export function keuzeBalk(id: string, kop: string, z: number, keuzes: readonly Keuze[]): Voorwerp[] {
  const balk: Voorwerp = {
    id, soort: "naamplaat", x: 0, z, b: BALK_B, d: BALK_D, h: 0.2,
    plaat: { id: `balk-${kop}`, soort: "balk", sleutels: [kop], pictogrammen: [], maat: { b: BALK_B, d: BALK_D } },
  };
  const van = -BALK_B / 2 + BALK_KOP + 0.16, tot = BALK_B / 2 - BALK_RAND;
  const b = (tot - van - (keuzes.length - 1) * TOETS_TUSSEN) / keuzes.length, d = BALK_D - 2 * BALK_RAND;
  const toetsen = keuzes.map((k, i): Voorwerp => ({
    id: k.id, soort: "porselein", x: van + b / 2 + i * (b + TOETS_TUSSEN), z, b, d, h: 0.5,
    plaat: { id: k.id, soort: k.gekozen ? "toetsGekozen" : "toets", sleutels: [], pictogrammen: [], teksten: [k.tekst], maat: { b, d } },
  }));
  return [balk, ...toetsen];
}
