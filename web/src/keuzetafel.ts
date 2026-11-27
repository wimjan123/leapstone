/**
 * De keuzeschermen voor een nieuw Potje als tafel (taak 188, uiterlijk 1b): Play on this phone (bord, spelers) en Computer. Het
 * echte lakbord staat in het midden en laat zien waar de Spelers zitten (de Stenen in hun beginstand, `tafelStand`); elke keuze is
 * een voorwerp eronder: een plaat van porselein (een gekozen plaat draagt een vink), een naamplaat met de Steen van een Speler
 * voor elke plek, en een lakplaat Start. Zelfde mechanisme als de andere schermen (`voorwerpen.ts`, `Voorwerpen.svelte`).
 * Zie docs/bord3d.md, "De keuzeschermen als tafel".
 */
import { bordje } from "./bordje";
import { NAAMPLAAT, type BordTekening, type KnopSpec } from "./knopplaten/knoppen";
import { PLAATMATEN } from "./knopplaten/plaat";
import { BALK_D, keuzeBalk } from "./keuzebalk";
import type { Voorwerp } from "./voorwerpen";
import { schermPunt } from "./spelers";
import { terugVoorwerp } from "./terugplek";
import { naarKolom } from "./kolom";
import { tafelStand } from "./voorwerpen-lijsten";
import { Potje } from "./wasm/halma_core.js";

const POR = PLAATMATEN.porselein;
const NAAM = PLAATMATEN.naamplaat;
const ROOD = PLAATMATEN.rood;

/** Hoe breed de titel en de rij met Back mogen zijn: de breedte van het bord (beslag tot beslag). */
const RAND = 7.8;
const KOP_Z = -12.0;
/** De titel is 1,5 keer de naamplaat (zoals de andere schermen), zodat hij op een telefoon leesbaar is. */
const TITEL_SCHAAL = 1.5;
const TUSSEN = 0.3;

/** Een plaat met een eigen tekst (de naam van een bord, een aantal, een niveau): porselein, met een vink als hij gekozen is. */
function keuzePlaat(id: string, tekst: string, gekozen: boolean): KnopSpec {
  return { id, soort: "porselein", sleutels: [], pictogrammen: gekozen ? ["vink"] : [], teksten: [tekst] };
}

/** Een rij platen van porselein om x = 0: `schaal` keer de maat van het plaatje. */
function rij(z: number, schaal: number, platen: readonly { id: string; tekst: string; gekozen: boolean }[]): Voorwerp[] {
  const b = POR.b * schaal, d = POR.d * schaal;
  const stap = b + TUSSEN;
  return platen.map((p, i) => ({
    id: p.id, soort: "porselein", x: (i - (platen.length - 1) / 2) * stap, z, b, d, h: 0.5, plaat: keuzePlaat(p.id, p.tekst, p.gekozen),
  }));
}

/** De titel op een naamplaat in het midden, tot `rand` van het midden (Back ligt onderaan, zie `terugplek.ts`). */
function kop(titelSleutel: string, rand = RAND): Voorwerp[] {
  // Een bredere kop (Bord kiezen) is in dezelfde maat groter: op het scherm blijft de titel even groot.
  const s = rand / RAND;
  const n = { b: NAAM.b * TITEL_SCHAAL * s, d: NAAM.d * TITEL_SCHAAL * s };
  return [
    { id: "titel", soort: "naamplaat", x: 0, z: KOP_Z, b: n.b, d: n.d, h: 0.42, plaat: { id: `titel-${titelSleutel}`, soort: "naamplaat", sleutels: [titelSleutel], pictogrammen: [] } },
  ];
}

const startPlaat: KnopSpec = { id: "start", soort: "rood", sleutels: ["common.start"], pictogrammen: [] };
const start = (z: number): Voorwerp => ({ id: "start", soort: "rood", x: 0, z, b: ROOD.b, d: ROOD.d, h: 0.6, plaat: startPlaat });


/** De namen van de borden: de tekst op de plaat. */
export type BordNamen = { ster: string; vierkant: string };

/** Hoeveel Spelers de tekening van elk bord en het bord op de tafel bij Bord kiezen tonen: alle plekken die er zijn. */
export const TOON_SPELERS = { ster: 6, vierkant: 4 } as const;

/**
 * De tekening van een bord op zijn plaat: de gaatjes en de Stenen van `TOON_SPELERS`, gedraaid zoals Bevy het bord op de tafel
 * toont (`tafelStand`), zodat plaat en tafel dezelfde kleuren op dezelfde plek hebben. `bordje` zet Speler 1 onderaan; op het
 * Sterbord klopt dat met de tafel (die schuift de kleuren op), het Vierkant bord ligt op de tafel een halve slag gedraaid.
 */
export function bordTekening(vorm: "ster" | "vierkant"): BordTekening {
  const b = bordje(vorm, TOON_SPELERS[vorm]);
  const k = vorm === "vierkant" ? -1 : 1;
  const draai = (p: { x: number; y: number }) => ({ x: k * p.x, y: k * p.y });
  return { vierkant: vorm === "vierkant", gaten: b.gaten.map(draai), stenen: b.stenen.map((s) => ({ ...draai(s.p), speler: s.speler })) };
}

/**
 * Bord kiezen legt alles tot net buiten de rand van het Vierkant bord (halve breedte 9,27 vak, `VIERKANT_RAND - 0,1` in lak.rs):
 * de camera past dan op de voorwerpen en niet op het bord, en verspringt niet als de tafel van Sterbord naar Vierkant bord wisselt.
 */
const BORD_RAND = 9.3;
const BORD_PLAAT = { b: BORD_RAND - TUSSEN / 2, d: 7.4 };
const BORD_PLAAT_Z = 9.9 + BORD_PLAAT.d / 2;

/**
 * Play on this phone, stap 1: kies het bord. Eén tik kiest en gaat door naar de Spelers. Elke plaat
 * toont een tekening van zijn bord boven de naam; het bord op de tafel volgt de plaat waar een vinger op staat (`Startmenu`).
 */
export function bordKeuze(namen: BordNamen): Voorwerp[] {
  const plaat = (id: "ster" | "vierkant", x: number): Voorwerp => ({
    id, soort: "porselein", x, z: BORD_PLAAT_Z, ...BORD_PLAAT, h: 0.5,
    plaat: { id, soort: "porselein", sleutels: [], pictogrammen: [], teksten: [namen[id]], maat: BORD_PLAAT, bord: bordTekening(id) },
  });
  const x = (BORD_PLAAT.b + TUSSEN) / 2;
  // Back ligt onder de platen op de vaste plek (taak 232), zo groot dat hij op het scherm even groot is als op de andere schermen.
  const terugZ = BORD_PLAAT_Z + BORD_PLAAT.d / 2 + TUSSEN + POR.d / 2 * (BORD_RAND / RAND);
  return [terugVoorwerp(terugZ, undefined, BORD_RAND), ...kop("menu.chooseBoard", BORD_RAND), plaat("ster", -x), plaat("vierkant", x)];
}

/**
 * Breed scherm (taak 236): het bord links, de titel, de keuzes, Start en Back als kolom rechts, in het midden van de hoogte. De
 * naamplaten van de plekken (`vast`) blijven bij hun kamp. `vierkant`: de kolom ligt naast het Vierkant bord. Kan het bord op het
 * scherm wisselen (Bord kiezen, Computer, nieuw online Potje), geef dan `true`: dan verspringt de kolom niet als het bord wisselt.
 */
export function breedKeuze(lijst: Voorwerp[], breed: boolean, vierkant: boolean): Voorwerp[] {
  return breed ? naarKolom(lijst, { vierkant }) : lijst;
}

/** Eén plek van het Potje: zijn Steen, en wat er op de naamplaat staat (de Speler, of Computer met zijn niveau). */
export type PlekPlaat = { speler: number; tekst: string; onder?: string };

/** De kleur van de Steen van plek `i` bij `n` Spelers: dezelfde als op het bord van `tafelStand` (bij zes Spelers twee opgeschoven). */
export const plekKleur = (i: number, n: number) => (n === 6 ? (i + 4) % 6 : i);

export type SpelersOpties = {
  /** De plekken in volgorde. */
  plekken: readonly PlekPlaat[];
  /** De aantallen Spelers die kunnen (2, 3, 4, 6 op het Sterbord; 2 en 4 op het Vierkant bord) en het gekozen aantal. */
  aantallen: readonly number[];
  aantal: number;
  vierkant: boolean;
};

/**
 * Hoe ver de buitenrand van het bord (met beslag) van het midden ligt in z, op `x` vakken van het midden. Het Sterbord is een zeshoek
 * met een punt boven en onder (9,0) en rechte zijden links en rechts (7,79 breed, de hoeken op 4,5); het Vierkant bord is 9,54.
 */
export function bordRand(vierkant: boolean, x: number): number {
  if (vierkant) return 9.54;
  const ax = Math.min(Math.abs(x), 7.79);
  return 9.0 - (ax * 4.5) / 7.79;
}

/** Een plek aan tafel: boven (-1) of onder (1) het bord, en links (-1), midden (0) of rechts (1). */
type Stoel = { rij: -1 | 1; kolom: -1 | 0 | 1 };

/**
 * Waar elke Speler aan tafel zit: bij zijn kamp (de hoek of punt van het bord waar zijn Stenen beginnen). Per kleur, uit de
 * beginstand van `tafelStand`: het midden van zijn Stenen.
 */
export function stoelen(n: number, vierkant: boolean): Map<number, Stoel> {
  const p = vierkant ? Potje.vierkant(n) : new Potje(n);
  const plek = p.vak_plekken();
  p.free();
  const vorm = vierkant ? "vierkant" : "ster";
  const punten = Array.from({ length: plek.length / 2 }, (_, i) => schermPunt(vorm, plek[2 * i], plek[2 * i + 1]));
  const mx = punten.reduce((a, q) => a + q.x, 0) / punten.length, mz = punten.reduce((a, q) => a + q.y, 0) / punten.length;
  const som = new Map<number, { x: number; z: number; n: number }>();
  tafelStand(n, vierkant).forEach((kleur, vak) => {
    if (kleur < 0) return;
    const s = som.get(kleur) ?? { x: 0, z: 0, n: 0 };
    som.set(kleur, { x: s.x + punten[vak].x - mx, z: s.z + punten[vak].y - mz, n: s.n + 1 });
  });
  const uit = new Map<number, Stoel>();
  for (const [kleur, s] of som) {
    const x = s.x / s.n, z = s.z / s.n;
    uit.set(kleur, { rij: z < 0 ? -1 : 1, kolom: Math.abs(x) < 1 ? 0 : x < 0 ? -1 : 1 });
  }
  return uit;
}

/**
 * De naamplaat van een plek: maat, hoe ver de linker- en rechterplaat van het midden liggen (op het Vierkant bord verder, boven de
 * hoek met het kamp), en de ruimte tot het bord (vakken).
 */
const ZIT = { b: 4.6, d: 2.3 };
const zitX = (vierkant: boolean) => (vierkant ? 6.0 : 5.0);
const ZIT_LUCHT = 0.35;
const TUSSEN_RIJEN = 0.45;

/** De z van een naamplaat op `stoel`: zo dicht bij het bord als kan, met `ZIT_LUCHT` ertussen. */
function stoelZ(stoel: Stoel, vierkant: boolean): number {
  const binnen = Math.max(0, Math.abs(stoel.kolom * zitX(vierkant)) - ZIT.b / 2);
  return stoel.rij * (bordRand(vierkant, binnen) + ZIT_LUCHT + ZIT.d / 2);
}

/**
 * Play on this phone, stap 2: de Spelers (William, 2026-11-12). Elke plek is een naamplaat bij het kamp van die Speler, rond het
 * bord, zoals mensen aan een echte tafel: boven of onder het bord, links, in het midden of rechts (een tik wisselt Speler en
 * Computer). Eronder de keuzebalk Players met de aantallen, en Start. De titel, de keuzebalk, Start en Back liggen bij elk aantal
 * op dezelfde plek, zodat de camera niet verspringt; alleen de naamplaten wisselen. Een naamplaat is `vast`: van rechts naar links
 * blijft hij bij zijn kamp.
 */
export function spelersKeuze(o: SpelersOpties): Voorwerp[] {
  const plekken = stoelen(o.plekken.length, o.vierkant);
  // De verste naamplaat (in het midden van het Sterbord, waar de punt van het bord zit) bepaalt waar de kop en de balk liggen.
  const ver = Math.max(stoelZ({ rij: 1, kolom: 0 }, o.vierkant), stoelZ({ rij: 1, kolom: 1 }, o.vierkant)) + ZIT.d / 2;
  const kopZ = -(ver + TUSSEN_RIJEN + Math.max(POR.d, NAAM.d * TITEL_SCHAAL) / 2);
  const balkZ = ver + TUSSEN_RIJEN + BALK_D / 2;
  // De titel ligt hoger dan op de andere schermen: boven de naamplaten van de Spelers aan de bovenkant.
  const startZ = balkZ + BALK_D / 2 + TUSSEN_RIJEN + ROOD.d / 2;
  // Back is het eerste voorwerp (zoals voorheen) en ligt in de onderste rij, op de vaste plek links van Start (taak 232).
  const uit = [terugVoorwerp(startZ), ...kop("menu.choosePlayers").map((v) => ({ ...v, z: kopZ }))];
  o.plekken.forEach((p, i) => {
    const stoel = plekken.get(p.speler) ?? { rij: 1, kolom: 0 };
    const plaat: KnopSpec = { ...NAAMPLAAT, id: `plek${i}`, sleutels: [], speler: p.speler, teksten: [p.tekst, ...(p.onder ? [p.onder] : [])], maat: ZIT, wissel: true };
    uit.push({ id: `plek${i}`, soort: "naamplaat", x: stoel.kolom * zitX(o.vierkant), z: stoelZ(stoel, o.vierkant), b: ZIT.b, d: ZIT.d, h: 0.36, plaat, vast: true });
  });
  uit.push(...keuzeBalk("aantal", "choice.players", balkZ, o.aantallen.map((a) => ({ id: `aantal${a}`, tekst: String(a), gekozen: a === o.aantal }))));
  uit.push(start(startZ));
  return uit;
}

export type ComputerOpties = {
  namen: BordNamen;
  vorm: "ster" | "vierkant";
  /** Het aantal Computerspelers dat kan en het gekozen aantal. */
  tegenstanders: readonly number[];
  tegen: number;
  /** De namen van de niveaus (Easy, Normal, Hard) en het gekozen niveau (0, 1 of 2). */
  niveaus: readonly string[];
  niveau: number;
};

/**
 * Computer (William, 2026-11-12): drie keuzebalken onder elkaar, elk met een kopje: Board (Sterbord, Vierkant bord), Opponents (het
 * aantal Computerspelers) en Level (Easy, Normal, Hard), en Start. De kopjes staan in één kolom, de toetsen ernaast. Het bord toont
 * de Spelers die er meedoen.
 */
export function computerKeuze(o: ComputerOpties): Voorwerp[] {
  // De buitenrand van het bord onderaan (met beslag): de punt van het Sterbord, of de rand van het Vierkant bord.
  const bordOnder = o.vorm === "vierkant" ? 9.54 : 9.0;
  const z = (i: number) => bordOnder + 0.45 + BALK_D / 2 + i * (BALK_D + 0.3);
  const startZ = z(2) + BALK_D / 2 + 0.45 + ROOD.d / 2;
  return [
    terugVoorwerp(startZ),
    ...kop("common.computer"),
    ...keuzeBalk("bord", "choice.board", z(0), [
      { id: "ster", tekst: o.namen.ster, gekozen: o.vorm === "ster" },
      { id: "vierkant", tekst: o.namen.vierkant, gekozen: o.vorm === "vierkant" },
    ]),
    ...keuzeBalk("tegen", "choice.opponents", z(1), o.tegenstanders.map((a) => ({ id: `tegen${a}`, tekst: String(a), gekozen: a === o.tegen }))),
    ...keuzeBalk("niveau", "level.label", z(2), o.niveaus.map((tekst, i) => ({ id: `niveau${i}`, tekst, gekozen: i === o.niveau }))),
    start(startZ),
  ];
}

export type OnlineOpties = {
  namen: BordNamen;
  vorm: "ster" | "vierkant";
  /** De aantallen Spelers die kunnen en het gekozen aantal. */
  aantallen: readonly number[];
  aantal: number;
  /** De Denktijden (tekst op de toets, `id` voor de knop) en de gekozen (index). */
  denktijden: readonly string[];
  denktijd: number;
};

/**
 * Nieuw online Potje (taak 227): drie keuzebalken onder elkaar, zoals Computer: Board (Sterbord, Vierkant bord), Players (het aantal
 * Spelers) en Move time (de Denktijd), en Start. Het bord toont de Spelers die er meedoen. Zelfde plekken als `computerKeuze`.
 */
export function onlineKeuze(o: OnlineOpties): Voorwerp[] {
  const bordOnder = o.vorm === "vierkant" ? 9.54 : 9.0;
  const z = (i: number) => bordOnder + 0.45 + BALK_D / 2 + i * (BALK_D + 0.3);
  const startZ = z(2) + BALK_D / 2 + 0.45 + ROOD.d / 2;
  return [
    terugVoorwerp(startZ),
    ...kop("common.newGame"),
    ...keuzeBalk("bord", "choice.board", z(0), [
      { id: "ster", tekst: o.namen.ster, gekozen: o.vorm === "ster" },
      { id: "vierkant", tekst: o.namen.vierkant, gekozen: o.vorm === "vierkant" },
    ]),
    ...keuzeBalk("aantal", "choice.players", z(1), o.aantallen.map((a) => ({ id: `aantal${a}`, tekst: String(a), gekozen: a === o.aantal }))),
    ...keuzeBalk("denktijd", "moveTime.label", z(2), o.denktijden.map((tekst, i) => ({ id: `denktijd${i}`, tekst, gekozen: i === o.denktijd }))),
    start(startZ),
  ];
}
