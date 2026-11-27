/**
 * Back op één plek op elke tafel (taak 232, feature 230): linksonder, in de onderste rij knoppen, in dezelfde maat als elke andere
 * plaat van porselein. Daar komt de duim het makkelijkst bij en het is op elk tafelscherm vrij: de hoofdknop (Start, Continue, de
 * lakknop) staat in het midden of rechts, nooit in de linkerhoek. De titel van een scherm staat bovenaan in het midden.
 * Alleen een scherm dat zelf al zijn rij vult met een bredere breedte (Bord kiezen) geeft een grotere `rand` mee; Back wordt dan
 * even veel groter, zodat hij op het scherm even groot en op dezelfde plek staat.
 */
import { LIJSTSCHERMEN, type KnopSpec } from "./knopplaten/knoppen";
import { PLAATMATEN } from "./knopplaten/plaat";
import type { Voorwerp } from "./voorwerpen";

/** De halve breedte van de rij knoppen: de breedte van het bord (beslag tot beslag). Back ligt met zijn linkerkant hier. */
export const TERUG_RAND = 7.8;
/** De maat van Back: de plaat van porselein, zoals elke andere. */
export const TERUG_MAAT = PLAATMATEN.porselein;
/** Hoe ver het midden van Back van het midden van de tafel ligt (links, dus negatief). */
export const TERUG_X = -TERUG_RAND + TERUG_MAAT.b / 2;
/** De vrije ruimte tot de plaat rechts van Back. */
export const TERUG_TUSSEN = 0.3;

/** Back als voorwerp in de rij op `z`. `rand`: de halve breedte van de rij als die breder is dan `TERUG_RAND`. */
export function terugVoorwerp(z: number, plaat: KnopSpec = LIJSTSCHERMEN.terug, rand = TERUG_RAND): Voorwerp {
  const s = rand / TERUG_RAND;
  const b = TERUG_MAAT.b * s, d = TERUG_MAAT.d * s;
  return { id: "terug", soort: "porselein", x: -rand + b / 2, z, b, d, h: 0.5, plaat };
}
