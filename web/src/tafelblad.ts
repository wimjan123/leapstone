/**
 * De tafel voor schermen met een lijst (taak 181: Account, Vriendenlijst, My stats, Mijn potjes; uiterlijk 1b). Bovenaan de
 * naamplaat van het scherm, in het midden een grote plaat van porselein waar de lijst als gewone HTML op ligt,
 * onderaan de rij met Back (links) en de andere knoppen als voorwerpen. De plaat ligt over het bord heen (het bord is hier niet nodig). Zie docs/bord3d.md,
 * "Lijsten op een plaat".
 */
import { PLAATMATEN } from "./knopplaten/plaat";
import type { KnopSpec, Pictogram } from "./knopplaten/knoppen";
import type { Sleutel } from "./taal.svelte";
import { TERUG_MAAT, TERUG_RAND, TERUG_TUSSEN, TERUG_X, terugVoorwerp } from "./terugplek";
import type { Voorwerp } from "./voorwerpen";
import { naarKolom } from "./kolom";

/** Een knop als voorwerp: de tekst staat op het voorwerp en is ook de tekst van de HTML-knop. */
export type TafelObject = {
  id: string;
  soort: "porselein" | "rood" | "zwart";
  /** Sleutel in web/src/talen/ van de tekst op het voorwerp (staat in `TAFELSLEUTELS_181`, anders mist een teken in het lettertype). */
  sleutel: Sleutel;
  pictogram?: Pictogram;
  /** Een langere naam voor de schermlezer. */
  label?: string;
  doe: () => void;
};

/** Hoogte van elk voorwerp (zoals `STARTMENU`). */
const HOOGTE = { porselein: 0.5, rood: 0.6, zwart: 0.6, naamplaat: 0.42 } as const;
/** De plaat ligt boven de rand van het bord (rand 0,36 boven het veld, het veld 0,62 boven de tafel). */
export const PLAAT_HOOGTE = 1.25;
export const PLAAT_BREEDTE = 17;
const TITEL_SCHAAL = 1.5;
const TUSSEN_X = 0.3;
const RIJ_HOOGTE = 3.2;
/** Zo diep (z) is alles samen, van de bovenste rij tot de onderste. */
const TOTAAL = 39;
/** Ruimte tussen de kop (Terug, titel) en de plaat, in vakken. */
const KOP_RUIMTE = 1.4;
const KOP_Z = -TOTAAL / 2 + RIJ_HOOGTE / 2;

export const spec = (o: TafelObject): KnopSpec => ({ id: o.id, soort: o.soort, sleutels: [o.sleutel], pictogrammen: o.pictogram ? [o.pictogram] : [] });
const maat = (soort: "porselein" | "rood" | "zwart" | "naamplaat") => PLAATMATEN[soort];

/**
 * Leg de voorwerpen neer: de naamplaat met de titel bovenaan in het midden, de plaat, en onderaan de rij(en) knoppen. Back ligt op
 * de vaste plek linksonder (`terugplek.ts`, taak 232); de andere knoppen liggen in de ruimte rechts ervan, in rijen van onderen
 * af (de onderste rij deelt hij met Back).
 */
export function tafelLijst(titelSleutel: string, onder: readonly TafelObject[], breed = false): Voorwerp[] {
  const uit: Voorwerp[] = [];
  const n = maat("naamplaat");
  uit.push(terugVoorwerp(0));
  // De naamplaat is groter dan zijn standaardmaat (zelfde verhouding): de titel is zo minstens zo groot als de knopteksten.
  const titelMaat = { b: n.b * TITEL_SCHAAL, d: n.d * TITEL_SCHAAL };
  uit.push({ id: "titel", soort: "naamplaat", x: 0, z: KOP_Z, b: titelMaat.b, d: titelMaat.d, h: HOOGTE.naamplaat, plaat: { id: "titel", soort: "naamplaat", sleutels: [titelSleutel], pictogrammen: [] } });

  // De ruimte rechts van Back: daar liggen de andere knoppen, elke rij zo vol als past.
  const vanaf = TERUG_X + TERUG_MAAT.b / 2 + TERUG_TUSSEN, tot = TERUG_RAND;
  const rijen: TafelObject[][] = [];
  let breedte = 0;
  for (const o of onder) {
    const b = maat(o.soort).b;
    if (!rijen.length || breedte + b > tot - vanaf) { rijen.push([]); breedte = 0; }
    rijen[rijen.length - 1].push(o);
    breedte += b + TUSSEN_X;
  }
  const aantal = Math.max(1, rijen.length);
  const eerste = TOTAAL / 2 - RIJ_HOOGTE / 2 - (aantal - 1) * RIJ_HOOGTE;
  uit[0] = terugVoorwerp(eerste + (aantal - 1) * RIJ_HOOGTE);
  rijen.forEach((rij, r) => {
    const totaal = rij.reduce((s, o) => s + maat(o.soort).b, 0) + (rij.length - 1) * TUSSEN_X;
    let x = (vanaf + tot) / 2 - totaal / 2;
    for (const o of rij) {
      const m = maat(o.soort);
      uit.push({ id: o.id, soort: o.soort, x: x + m.b / 2, z: eerste + r * RIJ_HOOGTE, b: m.b, d: m.d, h: HOOGTE[o.soort], plaat: spec(o) });
      x += m.b + TUSSEN_X;
    }
  });
  // De plaat: van onder de kop tot boven de eerste rij knoppen.
  // De plaat is 1,25 hoog en de camera kijkt schuin van onderen: de achterkant van de plaat verbergt wat er een stuk achter ligt.
  // Met alleen 0,2 ertussen viel de onderste helft van de titel erachter (taak 169), dus ruim een vak meer.
  const boven = KOP_Z + RIJ_HOOGTE / 2 + KOP_RUIMTE;
  const onderkant = eerste - RIJ_HOOGTE / 2 - 0.1;
  uit.push({ id: "plaat", soort: "porselein", x: 0, z: (boven + onderkant) / 2, b: PLAAT_BREEDTE, d: onderkant - boven, h: PLAAT_HOOGTE });
  // Breed scherm (taak 236): het bord links, titel, plaat en knoppen als kolom rechts; de plaat vult de hoogte van het bord.
  return breed ? naarKolom(uit, { rekbaar: "plaat" }) : uit;
}
