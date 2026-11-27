/**
 * Voorwerpen op de 3D-tafel (taak 178, uiterlijk 1b): knoppen die echte voorwerpen zijn. Een plaat van porselein of lak, een
 * naamplaat, een lade met een telraam, een schijf van messing. Bevy tekent ze (`crates/halma-bord3d/src/voorwerp.rs`), het plaatje
 * met tekst en pictogram komt uit `knopplaten/` in de taal van de Speler, en boven elk voorwerp ligt een onzichtbare, echte
 * HTML-knop met dezelfde tekst (`Voorwerpen.svelte`). Een tik op het voorwerp is een tik op die knop.
 *
 * Een scherm toevoegen: maak een lijst `Voorwerp[]` zoals `STARTMENU` hieronder en geef die met de knoppen aan `Voorwerpen.svelte`.
 * Zie docs/bord3d.md, "Voorwerpen".
 */
import { JADE, MIJN_POTJES, NAAMPLAAT, POTJES_KNOP, TITEL, KNOPPEN, type KnopSpec } from "./knopplaten/knoppen";
import { BORD_DIEP, BORD_ZIJ, KOLOM_LUCHT } from "./kolom";

/** De soort van een voorwerp, als getal voor Bevy (`voorwerp::Soort`). */
export const SOORT = { porselein: 0, rood: 1, zwart: 2, naamplaat: 3, lade: 4, messing: 5, kom: 6, zegel: 7, jade: 8, blad: 9 } as const;
export type VoorwerpSoort = keyof typeof SOORT;

/** Getallen per voorwerp in `zet_voorwerpen` (`voorwerp::VELDEN`). */
export const VELDEN = 7;

/**
 * Eén voorwerp op de tafel. Maten en plek in vakken, zoals het bord (een vak is de afstand tussen twee gaten; het Sterbord is
 * ongeveer 15 vakken breed). x loopt naar rechts, z naar de Speler toe (positief is onder het bord). De voorwerpen liggen op
 * de tafel, onder het bord. Leg ze neer voor een taal van links naar rechts; van rechts naar links spiegelt `voorwerpLijst` x.
 */
export type Voorwerp = {
  /** Naam van het voorwerp; een knop (`TafelKnop.id`) wijst hiernaar. */
  id: string;
  soort: VoorwerpSoort;
  x: number;
  z: number;
  /** Breedte (x), diepte (z) en hoogte. De breedte en diepte van een plaat zijn die van `PLAATMATEN` in knopplaten. */
  b: number;
  d: number;
  h: number;
  /** Het plaatje op de bovenkant (tekst en pictogram, gebakken in de taal van de Speler). Niet bij versiering. */
  plaat?: KnopSpec;
  /**
   * De plek hangt aan het bord, niet aan de leesrichting: van rechts naar links blijft x gelijk. Zo blijft de naamplaat van een
   * Speler bij zijn kamp (het bord spiegelt niet).
   */
  vast?: boolean;
};

const knop = (id: string): KnopSpec => KNOPPEN.find((k) => k.id === id)!;

/**
 * Het Startmenu als tafel (prototype 1b, `src/platen.js`): de naamplaat Leapstone boven het bord, de schijf van messing naar
 * Mijn potjes, Play en Play online als lakplaten met draak, zes platen van porselein en de lade met Sound en Vibration. Een kom
 * thee en een zegelsteen zijn versiering. De plek rechts naast de lade blijft vrij (in de browser staat daar de App Store-knop).
 */
export const STARTMENU: Voorwerp[] = [
  { id: "titel", soort: "naamplaat", x: 0, z: -12.05, b: 8.4, d: 3.0, h: 0.42, plaat: TITEL },
  { id: "potjes", soort: "messing", x: -6.45, z: -11.15, b: 3.6, d: 2.4, h: 0.4, plaat: MIJN_POTJES }, // taak 206: met naam, was een schijf van 2,2
  { id: "kom", soort: "kom", x: 6.35, z: -11.35, b: 2.6, d: 2.6, h: 1.24 },
  { id: "zegel", soort: "zegel", x: -6.3, z: -15.2, b: 3.2, d: 2.1, h: 1.5 },
  // Taak 206: rood (de grootste blikvanger) is online spelen, zwart is spelen op deze telefoon.
  { id: "online", soort: "rood", x: -3.22, z: 11.15, b: 6.15, d: 2.7, h: 0.6, plaat: knop("online") },
  { id: "spelen", soort: "zwart", x: 3.22, z: 11.15, b: 6.15, d: 2.7, h: 0.6, plaat: knop("spelen") },
  { id: "computer", soort: "porselein", x: -4.2, z: 14.25, b: 4.0, d: 2.75, h: 0.5, plaat: knop("computer") },
  { id: "vrienden", soort: "porselein", x: 0, z: 14.25, b: 4.0, d: 2.75, h: 0.5, plaat: knop("vrienden") },
  { id: "puzzel", soort: "porselein", x: 4.2, z: 14.25, b: 4.0, d: 2.75, h: 0.5, plaat: knop("puzzel") },
  { id: "uitleg", soort: "porselein", x: -4.2, z: 17.25, b: 4.0, d: 2.75, h: 0.5, plaat: knop("uitleg") },
  { id: "ranglijst", soort: "porselein", x: 0, z: 17.25, b: 4.0, d: 2.75, h: 0.5, plaat: knop("ranglijst") },
  { id: "stats", soort: "porselein", x: 4.2, z: 17.25, b: 4.0, d: 2.75, h: 0.5, plaat: knop("stats") },
  { id: "lade", soort: "lade", x: -1.95, z: 20.05, b: 8.3, d: 2.1, h: 0.34, plaat: knop("lade") },
];

/**
 * Het Startmenu voor dit scherm (taak 206, William). Zelfde voorwerpen in dezelfde volgorde als `STARTMENU`, alleen op een andere plek:
 * - zonder App Store-knop (de app, of de web-app vanaf het beginscherm) ligt de lade midden onder de platen;
 * - op een breed scherm (liggend, zie `isBreed`) ligt het bord links en de rest als kolom rechts ernaast, met de versiering links.
 * Het bord ligt altijd op (0, 0); de camera past zich aan alle voorwerpen aan.
 */
export function startmenu(o: { appKnop: boolean; breed: boolean }): Voorwerp[] {
  if (!o.breed) return STARTMENU.map((v) => (v.id === "lade" && !o.appKnop ? { ...v, x: 0 } : v));
  // De kolom: even breed als de twee lakplaten (12,6), het midden 17 vakken rechts van het bord (dat is ongeveer 16,5 breed), zodat
  // er een vak lucht tussen bord en kolom ligt.
  const k = 17;
  const plek: Record<string, { x: number; z: number }> = {
    potjes: { x: k - 4.5, z: -8.2 },
    titel: { x: k + 2.1, z: -8.2 },
    // Tegen de schuine linkerzijden van het bord: zo ver naar buiten maakte alles kleiner (council ronde 7).
    zegel: { x: -7.6, z: -8.4 },
    kom: { x: -6.6, z: 9.2 }, // binnen de breedte van het bord, tegen de schuine linkeronderkant
    online: { x: k - 3.22, z: -4.0 },
    spelen: { x: k + 3.22, z: -4.0 },
    computer: { x: k - 4.2, z: -0.4 },
    vrienden: { x: k, z: -0.4 },
    puzzel: { x: k + 4.2, z: -0.4 },
    uitleg: { x: k - 4.2, z: 2.7 },
    ranglijst: { x: k, z: 2.7 },
    stats: { x: k + 4.2, z: 2.7 },
    lade: { x: o.appKnop ? k - 1.95 : k, z: 6.0 },
  };
  return STARTMENU.map((v) => ({ ...v, ...plek[v.id] }));
}

/** Breed genoeg voor het Startmenu met het bord links en de knoppen rechts: liggend, minstens 4:3 en 900 pixels breed. */
export const BREED = "(min-aspect-ratio: 4/3) and (min-width: 900px)";

/** Wat een Potje (taak 179) op de tafel legt. */
export type PotjeOpties = {
  /** De Spelers van het Potje, in volgorde van kleur (Speler 1 eerst): naam en eventueel Rating. */
  spelers: readonly { speler: number; naam: string; rating?: string }[];
  /** Welke knoppen op het blad liggen, van links naar rechts (in een taal van links naar rechts). */
  knoppen: readonly ("menu" | "potjes" | "opgeven" | "klaar")[];
  /** De tekst op de jade aanwijzer. */
  beurt: string;
  /** De Denktijd op de jade aanwijzer, of niets. */
  tijd?: { rest: number; klok?: string };
  /** Geen kom thee rechtsboven: daar staan de knoppen van de Chat en de Meldingen (online Potje). */
  zonderKom?: boolean;
  /**
   * Breed scherm (taak 236): het bord links, naamplaten, jade aanwijzer en het blad met knoppen als kolom rechts. `vierkant`: het
   * Vierkant bord (de kolom ligt dan verder van het midden). `chat`: een plaat voor de Chat tussen de aanwijzer en het blad.
   */
  breed?: { vierkant: boolean; chat: boolean };
};

/** Hoe breed het Sterbord is (halve breedte van het blad tot het beslag): de jade aanwijzer blijft daarbinnen. */
const BORD_HALF = 5.3;
/** Zo breed is het rijtje naamplaten hoogstens (vakken). */
const RIJ_BREED = 14.4;

/** Waar een naamplaat ligt en hoe groot hij is (vakken). `maat`: een eigen vorm voor het plaatje (zie `PlaatInvoer.maat`). */
type NaamPlek = { x: number; z: number; b: number; d: number; metNaam: boolean; maat?: { b: number; d: number } };

/**
 * De naamplaten bij `n` Spelers. Tot drie: volle platen met naam op een rij. Vier (taak 290: twee rijen van twee) en zes (taak 193: twee rijen van drie): platen met de Steen en de hele naam, in een eigen maat (`maat`), zodat een
 * lange naam op twee regels past. Ze liggen binnen de omtrek van de oude rij, de kom en de zegelsteen: de camera, het bord en de
 * knoppen blijven precies gelijk. Zie docs/bord3d.md, "Volledige namen bij zes Spelers".
 */
function naamPlekken(n: number): NaamPlek[] {
  const rij = (stap: number, b: number, d: number, metNaam: boolean) =>
    Array.from({ length: n }, (_, i) => ({ x: (i - (n - 1) / 2) * stap, z: NAAM_Z, b, d, metNaam }));
  if (n <= 3) return rij(n === 2 ? 5.2 : 4.95, 4.5, 1.9, true);
  if (n === 6) return Array.from({ length: 6 }, (_, i) => ({ x: ((i % 3) - 1) * ZES_STAP, z: i < 3 ? ZES_Z[0] : ZES_Z[1], ...ZES_MAAT, metNaam: true, maat: ZES_MAAT }));
  // Vier (taak 290): twee rijen van twee, dezelfde platen en rijen als bij zes, met de hele naam.
  if (n === 4) return Array.from({ length: 4 }, (_, i) => ({ x: ((i % 2) - 0.5) * ZES_STAP, z: i < 2 ? ZES_Z[0] : ZES_Z[1], ...ZES_MAAT, metNaam: true, maat: ZES_MAAT }));
  const stap = RIJ_BREED / n;
  const schaal = Math.min(1, (stap - 0.25) / 4.5);
  return rij(stap, 4.5 * schaal, 1.9 * schaal, false);
}

/**
 * De naamplaat bij zes Spelers (vakken): breedte en diepte, de afstand tussen de kolommen, en de z van de bovenste en onderste rij.
 * De bovenste rij blijft vrij van de kom thee (rond, tot z = -13,4) en de zegelsteen (tot -13,65); de jade aanwijzer ligt iets
 * lager dan bij minder Spelers (`JADE_Z_ZES`), zodat er ruimte blijft tussen de onderste rij en de aanwijzer.
 */
const ZES_MAAT = { b: 4.6, d: 1.3 };
const ZES_STAP = 4.85;
const ZES_Z = [-12.6, -11.15] as const;
const JADE_Z_ZES = -9.8;

const KNOP_Z = 12.0;
const NAAM_Z = -11.5;
const JADE_Z = -9.9;

/** Waar de jade aanwijzer ligt als Speler `aan` (index in `spelers`) aan de beurt is: onder zijn naamplaat, binnen het bord. */
export function jadePlek(aan: number | null, n: number, breed?: PotjeOpties["breed"]): { x: number; z: number } {
  const x = aan === null ? 0 : naamPlekken(n)[aan]?.x ?? 0;
  const binnen = Math.max(-BORD_HALF, Math.min(BORD_HALF, x));
  if (breed) {
    const k = potjeKolom(n, breed);
    return { x: k.x + binnen, z: k.jade };
  }
  return { x: binnen, z: n === 6 || n === 4 ? JADE_Z_ZES : JADE_Z };
}

/** De diepte van de jade aanwijzer en de ruimte eronder waar hij ingezoomd heen schuift (`overgang::jade_plek`, 0,2 lucht). */
const JADE_D = 1.16;
const BLAD_D = 3.5;
const KOLOM_TUSSEN = 0.45;

/**
 * Breed scherm (taak 236): waar de kolom van een Potje ligt. `x` is het midden van de kolom; `boven` is de bovenkant van de naamplaten
 * (zoals op de telefoon liggen ze vanaf daar), `jade` de aanwijzer, `blad` het blad met de knoppen, en `chat` de plaat van de Chat.
 * Met de Chat vult de kolom de hoogte van het bord; zonder ligt hij in het midden. Onder het blad blijft ruimte voor de aanwijzer
 * als hij ingezoomd onder het blad gaat liggen.
 */
function potjeKolom(n: number, o: NonNullable<PotjeOpties["breed"]>) {
  const diep = o.vierkant ? BORD_DIEP.vierkant : BORD_DIEP.ster;
  const x = (o.vierkant ? BORD_ZIJ.vierkant : BORD_ZIJ.ster) + KOLOM_LUCHT + RIJ_BREED / 2;
  // Hoe diep de naamplaten op de telefoon samen zijn (bij zes twee rijen), gemeten vanaf de bovenkant.
  const plekken = naamPlekken(n);
  const top = Math.min(...plekken.map((p) => p.z - p.d / 2));
  const naamDiep = Math.max(...plekken.map((p) => p.z + p.d / 2)) - top;
  const onderRuimte = JADE_D + 0.2;
  const totaal = naamDiep + KOLOM_TUSSEN + JADE_D + KOLOM_TUSSEN + BLAD_D + onderRuimte;
  const boven = o.chat ? -diep : -totaal / 2;
  const jade = boven + naamDiep + KOLOM_TUSSEN + JADE_D / 2;
  const blad = (o.chat ? diep : totaal / 2) - onderRuimte - BLAD_D / 2;
  const chatBoven = jade + JADE_D / 2 + KOLOM_TUSSEN, chatOnder = blad - BLAD_D / 2 - KOLOM_TUSSEN;
  return { x, boven, top, jade, blad, chat: { z: (chatBoven + chatOnder) / 2, d: chatOnder - chatBoven } };
}

/**
 * Het Potje als tafel (prototype 1b, `kandidaat-1b/scherm-potje.png`): de naamplaten van de Spelers boven het bord met de Steen en
 * de naam, de jade aanwijzer met "Your turn", een kom en een zegelsteen als versiering, en onder het bord een blad met de knoppen.
 * De lijst hangt niet af van wie aan de beurt is: de aanwijzer schuift met `jadePlek` (`zet_voorwerp_plek`) en alleen zijn
 * plaatje en dat van een naamplaat wisselt. Zo gaat er per beurt geen hele lijst naar Bevy.
 */
export function potjeVoorwerpen(o: PotjeOpties): Voorwerp[] {
  if (o.breed) return potjeBreed(o, o.breed);
  const n = o.spelers.length;
  const plekken = naamPlekken(n);
  const uit: Voorwerp[] = [
    { id: "zegel", soort: "zegel", x: -6.2, z: -14.7, b: 3.2, d: 2.1, h: 1.5 },
    ...(o.zonderKom ? [] : [{ id: "kom", soort: "kom" as const, x: 6.2, z: -14.7, b: 2.6, d: 2.6, h: 1.24 }]),
  ];
  o.spelers.forEach((s, i) => {
    const plek = plekken[i];
    const plaat: KnopSpec = {
      ...NAAMPLAAT,
      id: `speler${s.speler}`,
      sleutels: [],
      speler: s.speler,
      // Bij vier Spelers past een naam niet: de Steen wijst de Speler aan, de jade aanwijzer zegt de naam.
      teksten: plek.metNaam ? [s.naam, ...(s.rating && !plek.maat ? [s.rating] : [])] : [""],
      ...(plek.maat ? { maat: plek.maat } : {}),
    };
    uit.push({ id: `speler${s.speler}`, soort: "naamplaat", x: plek.x, z: plek.z, b: plek.b, d: plek.d, h: 0.36, plaat });
  });
  const jade = jadePlek(null, n);
  uit.push({ id: "beurt", soort: "jade", x: jade.x, z: jade.z, b: 3.7, d: 1.16, h: 0.26, plaat: { ...JADE, sleutels: [], teksten: [o.beurt], tijd: o.tijd } });
  uit.push({ id: "blad", soort: "blad", x: 0, z: KNOP_Z, b: 13, d: 3.5, h: 0.14 });
  const SPEC: Record<string, KnopSpec> = {
    menu: KNOPPEN.find((k) => k.id === "menu")!,
    potjes: POTJES_KNOP,
    opgeven: KNOPPEN.find((k) => k.id === "opgeven")!,
    klaar: KNOPPEN.find((k) => k.id === "klaar")!,
  };
  o.knoppen.forEach((k, i) => {
    // Het blad is 0,14 hoog en de plaat ligt erop: de plaat is 0,5 hoog en staat met zijn voet in het blad.
    uit.push({ id: k, soort: "porselein", x: (i - (o.knoppen.length - 1) / 2) * 4.2, z: KNOP_Z, b: 4.0, d: 2.75, h: 0.64, plaat: SPEC[k] });
  });
  return uit;
}

/**
 * Het Potje op een breed scherm (taak 236): dezelfde voorwerpen als op de telefoon, met het bord links en de rest als kolom rechts,
 * zoals het Startmenu. De naamplaten liggen in de kolom zoals op de telefoon boven het bord (dezelfde rijen), de jade aanwijzer
 * eronder, dan de plaat van de Chat (online) en onderaan het blad met de knoppen. Zegelsteen en kom liggen links naast het Sterbord
 * (zoals het Startmenu); naast het Vierkant bord is daar geen plek, dan liggen ze er niet.
 */
function potjeBreed(o: PotjeOpties, b: NonNullable<PotjeOpties["breed"]>): Voorwerp[] {
  const telefoon = potjeVoorwerpen({ ...o, breed: undefined });
  const k = potjeKolom(o.spelers.length, b);
  const uit: Voorwerp[] = [];
  for (const v of telefoon) {
    if (v.soort === "zegel") {
      if (!b.vierkant) uit.push({ ...v, x: -7.6, z: -8.4 });
    } else if (v.soort === "kom") {
      if (!b.vierkant) uit.push({ ...v, x: -6.6, z: 9.2 });
    } else if (v.soort === "naamplaat") uit.push({ ...v, x: k.x + v.x, z: k.boven + (v.z - k.top) });
    else if (v.id === "beurt") {
      uit.push({ ...v, ...jadePlek(null, o.spelers.length, b) });
      if (b.chat) uit.push({ id: "chat", soort: "porselein", x: k.x, z: k.chat.z, b: RIJ_BREED, d: k.chat.d, h: 0.5 });
    } else uit.push({ ...v, x: k.x + v.x, z: k.blad });
  }
  return uit;
}

/**
 * De lijst voor Bevy (`zet_voorwerpen`): per voorwerp soort, x, z, breedte, diepte, hoogte, gespiegeld. `rtl`: x gespiegeld, behalve
 * bij een voorwerp dat `vast` is.
 */
export function voorwerpLijst(voorwerpen: readonly Voorwerp[], rtl: boolean): Float32Array {
  const uit = new Float32Array(voorwerpen.length * VELDEN);
  voorwerpen.forEach((v, i) => uit.set([SOORT[v.soort], rtl && !v.vast ? -v.x : v.x, v.z, v.b, v.d, v.h, rtl ? 1 : 0], i * VELDEN));
  return uit;
}

/** Een vak op het scherm in CSS-pixels. */
export type Vak = { links: number; boven: number; rechts: number; onder: number };

/**
 * Taak 231: een plaat waarvan de knop niets doet (`uit`) ligt er dof. Het voorwerp en zijn knop delen een `id`; de lijst zelf blijft
 * gelijk, alleen het plaatje van die ene plaat wisselt.
 */
export function metUit(voorwerpen: readonly Voorwerp[], knoppen: readonly { id: string; uit?: boolean }[]): Voorwerp[] {
  return voorwerpen.map((v) => {
    if (!v.plaat) return v;
    const uit = knoppen.some((k) => k.id === v.id && k.uit === true);
    return uit === (v.plaat.uit === true) ? v : { ...v, plaat: { ...v.plaat, uit } };
  });
}

/** Het vak van voorwerp `i` uit `voorwerp_vakken()`, of null (nog niet getekend, of geen voorwerp). */
export function vakVan(vakken: ArrayLike<number>, i: number): Vak | null {
  const [links, boven, rechts, onder] = [0, 1, 2, 3].map((k) => vakken[4 * i + k]);
  if (![links, boven, rechts, onder].every((v) => Number.isFinite(v))) return null;
  return { links, boven, rechts, onder };
}

/**
 * Een deel van een voorwerp: bij de lade de helft met Sound (deel 0) of Vibration (deel 1). Sound ligt links, in een taal van
 * rechts naar links rechts (zoals het plaatje en de kralen).
 */
export function helft(vak: Vak, deel: 0 | 1, rtl: boolean): Vak {
  const midden = (vak.links + vak.rechts) / 2;
  const links = (deel === 0) !== rtl;
  return links ? { ...vak, rechts: midden } : { ...vak, links: midden };
}

/** Zo groot is een knop op het scherm minstens (Apple: 44 punten). */
export const KLEINSTE_KNOP = 44;

/** De plek van de HTML-knop boven een vak: het vak, minstens `KLEINSTE_KNOP` breed en hoog (om zijn midden). */
export function knopPlek(vak: Vak): { left: number; top: number; width: number; height: number } {
  const b = Math.max(KLEINSTE_KNOP, vak.rechts - vak.links), h = Math.max(KLEINSTE_KNOP, vak.onder - vak.boven);
  const mx = (vak.links + vak.rechts) / 2, my = (vak.boven + vak.onder) / 2;
  return { left: mx - b / 2, top: my - h / 2, width: b, height: h };
}
