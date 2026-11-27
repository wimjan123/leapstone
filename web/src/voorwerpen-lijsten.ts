/**
 * De tafels van de Wachtkamer, de Ranglijst en het winstscherm (taak 180, uiterlijk 1b), en de Speluitleg (taak 184). Zelfde mechanisme als
 * het Startmenu (`voorwerpen.ts`, `Voorwerpen.svelte`): het bord blijft in het midden, bovenaan een naamplaat met de titel,
 * daaronder een grote plaat van porselein of lak waarop gewone, scrolbare HTML-tekst staat, en onderaan de knoppen als platen.
 * Zie docs/bord3d.md, "Lijstschermen".
 */
import { LIJSTSCHERMEN } from "./knopplaten/knoppen";
import { PLAATMATEN } from "./knopplaten/plaat";
import { TERUG_RAND, terugVoorwerp } from "./terugplek";
import type { Vak, Voorwerp } from "./voorwerpen";
import { naarKolom } from "./kolom";
import { Potje } from "./wasm/halma_core.js";

const L = LIJSTSCHERMEN;

/** Een plaat van porselein met een knop: de maat van het plaatje. */
const porselein = (id: string, x: number, z: number, plaat: (typeof L)[string]): Voorwerp => ({
  id, soort: "porselein", x, z, b: PLAATMATEN.porselein.b, d: PLAATMATEN.porselein.d, h: 0.5, plaat,
});
const lak = (id: string, x: number, z: number, plaat: (typeof L)[string]): Voorwerp => ({
  id, soort: "rood", x, z, b: PLAATMATEN.rood.b, d: PLAATMATEN.rood.d, h: 0.6, plaat,
});
/** De titel is 1,8 keer zo groot als de plaat van het prototype (zelfde verhouding), zodat hij op een telefoon leesbaar is. */
const TITEL_SCHAAL = 1.8;
/** De naamplaat met de titel van het scherm, boven het bord. */
const titel = (plaat: (typeof L)[string]): Voorwerp => ({
  id: "titel", soort: "naamplaat", x: 0, z: -12.4, b: PLAATMATEN.naamplaat.b * TITEL_SCHAAL, d: PLAATMATEN.naamplaat.d * TITEL_SCHAAL, h: 0.42, plaat,
});
/** De grote plaat onder het bord waarop de tekst van het scherm staat (geen plaatje: de tekst is HTML). */
const lijstPlaat = (soort: "porselein" | "zwart" = "porselein"): Voorwerp => ({
  id: "lijst", soort, x: 0, z: 15.75, b: 14.4, d: 11, h: 0.5,
});
/** De Ranglijst heeft meer rijen dan de andere lijsten: de plaat is dieper en ligt een stuk over het bord (taak 233, was 11 diep). */
const lijstPlaatLang = (): Voorwerp => ({ id: "lijst", soort: "porselein", x: 0, z: 12.75, b: 14.4, d: 18, h: 0.5 });
/** Onderaan, waar de duim is: de knoppen. */
const ONDER = 23.6;
/** De knoppen van het winstscherm als er geen plaat met een lijst is. */
const ONDER_ZONDER_LIJST = 17.4;

/** De Ranglijst: de lijst op een grote plaat, de knop Back eronder. */
export const RANGLIJST: Voorwerp[] = [titel(L.titelRanglijst), lijstPlaatLang(), terugVoorwerp(ONDER)];

/**
 * Breed scherm (taak 236): het bord links, de titel, de plaat met de lijst en de knoppen als kolom rechts (`naarKolom`). Bij een
 * echte lijst (`rek`) vult de plaat de hoogte van het bord; een plaat met alleen een vraag of een melding houdt zijn maat en de kolom
 * staat in het midden. Op een telefoon blijft de lijst zoals hij is.
 */
export function breedLijst(lijst: Voorwerp[], breed: boolean, o: { rek?: boolean; ruimte?: Record<string, number> } = {}): Voorwerp[] {
  return breed ? naarKolom(lijst, { rekbaar: o.rek === false ? undefined : "lijst", ruimte: o.ruimte }) : lijst;
}

/** De rechterplek in de onderste rij: een plaat tegen de rechterrand van de rij, zoals Back tegen de linker (taak 232). */
const RECHTS_X = TERUG_RAND - PLAATMATEN.porselein.b / 2;

/**
 * De Wachtkamer: Back (naar het begin) op de vaste plek links, Invite (alleen als er nog een plek open is) in het midden en My games
 * rechts (taak 232: Back op één plek; My games blijft de uitweg naar je Potjes).
 */
export function wachtkamer(vol: boolean): Voorwerp[] {
  const rij = [terugVoorwerp(ONDER), ...(vol ? [] : [porselein("uitnodigen", 0, ONDER, L.uitnodigen)]), porselein("potjes", RECHTS_X, ONDER, L.mijnPotjes)];
  return [titel(L.titelWachtkamer), lijstPlaat(), ...rij];
}

/**
 * Finding a player (taak 225, 232): de titel, een plaat met de zoektekst en de teller, en onderaan Back (stopt het zoeken) en,
 * zolang er voor 2 Spelers wordt gezocht, "Find 4 players". Stop searching is vervallen: het deed hetzelfde als Back.
 */
export function zoeken(zoektMeer: boolean): Voorwerp[] {
  const rij = zoektMeer ? [terugVoorwerp(ONDER)] : [terugVoorwerp(ONDER), breed("meer", 2.2, L.vier)];
  return [titel(L.titelZoeken), lijstPlaat(), ...rij];
}

/** Het foutscherm (taak 225, 232): de foutmelding op een plaat onder een leeg bord, en Back (naar het begin) op de vaste plek. */
export function foutTafel(metOpnieuw = false): Voorwerp[] {
  return [lijstPlaat(), terugVoorwerp(ONDER), ...(metOpnieuw ? [lak("opnieuw", 2.2, ONDER - 0.05, L.opnieuwProberen)] : [])];
}

/**
 * Spelersnaam invullen, Herstelcode invullen, Herstelcode tonen en "Learn to play?" (taak 226): een plaat met de vraag en het
 * invoerveld (HTML) onder een leeg bord, en onderaan de knoppen. Er is geen naamplaat: de vraag staat op de plaat.
 */
/**
 * Spelersnaam: de vraag, het veld, één regel (wat eerst moet, of de Voorwaarden), Enter recovery code en Privacy passen in elke
 * taal op de plaat (eerst schoof de onderste regel weg in het Nederlands, Frans en Duits). De plaat is dieper naar onderen en de
 * knoppen schuiven mee, in de lege ruimte onder de knoppen; de bovenkant blijft waar hij was, los van het bord.
 */
const NAAM_ERBIJ = 2.6;
export function naamTafel(): Voorwerp[] {
  const plaat = lijstPlaat();
  const onder = ONDER + NAAM_ERBIJ;
  return [{ ...plaat, z: plaat.z + NAAM_ERBIJ / 2, d: plaat.d + NAAM_ERBIJ }, terugVoorwerp(onder), lak("verder", 2.2, onder - 0.05, L.doorgaan)];
}
/** Een bredere plaat van porselein voor een lange knoptekst (`b` is de `maat` van de plaat in `knoppen.ts`). */
const breed = (id: string, x: number, plaat: (typeof L)[string], b = 7.2): Voorwerp => ({ id, soort: "porselein", x, z: ONDER, b, d: 2.75, h: 0.5, plaat });
export function codeInvullenTafel(): Voorwerp[] {
  return [lijstPlaat(), terugVoorwerp(ONDER), breed("verder", 2.2, L.naamTerug)];
}
export function herstelcodeTafel(): Voorwerp[] {
  return [lijstPlaat(), breed("verder", 0, L.codeBewaard)];
}
/** "Learn to play?" is één regel: een lage plaat in het midden in plaats van een grote lege. */
export function lerenTafel(): Voorwerp[] {
  return [{ ...lijstPlaat(), d: 5.5 }, breed("overslaan", -3.5, L.lerenOverslaan, 5.2), lak("verder", 3.9, ONDER - 0.05, L.lerenStart)];
}

/**
 * Het winstscherm: de uitslag (de winnaar, of Game over) op een lakplaat boven het bord, de beoordeling en de ranglijst op een
 * plaat van porselein eronder en de knoppen. Het eindbord blijft zichtbaar.
 * `knoppen`: de eerste is de hoofdknop (Play again, New game, My games), de tweede is Back to start (of weg).
 */
export function winst(hoofd: "opnieuw" | "nieuwPotje" | "mijnPotjes", metStart: boolean, metLijst: boolean): Voorwerp[] {
  // Zonder lijst blijft er onder het bord niets over om te vullen: de knoppen liggen dan dichter bij het bord, zodat de camera
  // inzoomt en de medaille tussen het bord en de knoppen staat (taak 169: eerst een groot leeg vlak onder de medaille).
  const onder = metLijst ? ONDER : ONDER_ZONDER_LIJST;
  const eerste = hoofd === "mijnPotjes" ? porselein("hoofd", metStart ? -2.1 : 0, onder, L.mijnPotjes) : lak("hoofd", metStart ? -3.22 : 0, onder - 0.05, L[hoofd]);
  return [
    // Diep genoeg voor de titel en de onderregel in twee regels tekst (taak 168: bij 3,4 viel de onderregel eraf); de voorrand
    // ligt even ver van het bord als eerst.
    { id: "uitslag", soort: "naamplaat", x: 0, z: -12.6, b: 13.4, d: 4.0, h: 0.42 },
    ...(metLijst ? [{ id: "lijst", soort: "porselein" as const, x: 0, z: 15.4, b: 14.4, d: 8.4, h: 0.5 }] : []),
    eerste,
    ...(metStart ? [porselein("start", hoofd === "mijnPotjes" ? 2.1 : 3.22, onder, L.naarStart)] : []),
  ];
}

/**
 * Wat de lakknop onder de uitleg van de Speluitleg zegt: Next (de oefening is gedaan), Play the computer (na de laatste
 * oefening), of nog niets (de oefening loopt: Next, dof, en de HTML-knop is `uit`).
 */
export type UitlegKnop = "volgende" | "computer" | "leeg";

/** Hoe ver de titel boven het midden van het bord ligt, en de uitleg en de knop eronder (vakken). */
const UITLEG_KOP_Z = -12.0;
const UITLEG_PLAAT_Z = 12.75;
const UITLEG_KNOP_Z = 17.35;

/**
 * De Speluitleg als tafel (taak 184, uiterlijk 1b): het bord met de oefening in het midden (de Speler sleept en tikt erop, zoals
 * in een Potje), bovenaan de naamplaat met de titel, onder het bord een plaat van porselein waar de uitleg als HTML op
 * ligt, en daaronder Back (de vaste plek linksonder) en de lakknop. De lijst is in elke stap even groot en ligt op dezelfde plekken, zodat de camera niet verspringt:
 * alleen het plaatje van de knop verandert (`UitlegKnop`), nooit de lijst.
 */
export function speluitleg(knop: UitlegKnop): Voorwerp[] {
  const n = PLAATMATEN.naamplaat, r = PLAATMATEN.rood;
  const titelB = n.b * TITEL_SCHAAL_UITLEG, titelD = n.d * TITEL_SCHAAL_UITLEG;
  // De rij is zo breed als het bord (beslag tot beslag, ongeveer 15,6 vakken).
  const rand = 7.8;
  // Taak 231: ook zonder oefening die klaar is ligt er een plaat met tekst (Next); de knop is dan `uit` en de plaat ligt er dof.
  const plaat = knop === "computer" ? L.tegenComputer : L.volgende;
  return [
    terugVoorwerp(UITLEG_KNOP_Z),
    { id: "titel", soort: "naamplaat", x: 0, z: UITLEG_KOP_Z, b: titelB, d: titelD, h: 0.42, plaat: L.titelUitleg },
    { id: "uitleg", soort: "porselein", x: 0, z: UITLEG_PLAAT_Z, b: 2 * rand, d: 4.6, h: 0.5 },
    { id: "verder", soort: "rood", x: 0, z: UITLEG_KNOP_Z, b: r.b, d: r.d, h: 0.6, plaat },
  ];
}
/** De titel van de Speluitleg is 1,5 keer de naamplaat (zoals de lijsten op een plaat, taak 181). */
const TITEL_SCHAAL_UITLEG = 1.5;

/** Wat de lakknop van de Dagelijkse puzzel zegt: Done (midden in een Sprongketen), Share (opgelost), of niets (Done, dof). */
export type PuzzelKnop = "klaar" | "delen" | "leeg";

/**
 * De Dagelijkse puzzel als tafel (taak 187, uiterlijk 1b): zoals een Potje. Bovenaan de naamplaat met de titel, in het
 * midden het bord met de puzzel, daaronder een plaat van porselein met het Streefgetal, het aantal Zetten (en na het oplossen de
 * uitslag) als HTML, en onderaan Start over (porselein) en de lakknop. De lijst is in elke stand gelijk; alleen het plaatje van de
 * lakknop wisselt (`PuzzelKnop`).
 */
export function puzzelTafel(knop: PuzzelKnop): Voorwerp[] {
  const terug = PLAATMATEN.porselein, n = PLAATMATEN.naamplaat, r = PLAATMATEN.rood;
  const titelB = n.b * TITEL_SCHAAL_UITLEG, titelD = n.d * TITEL_SCHAAL_UITLEG;
  const rand = 7.8;
  // Taak 231: ook zonder Sprongketen ligt er een plaat met tekst (Done); de knop is dan `uit` en de plaat ligt er dof.
  const plaat = knop === "delen" ? L.puzzelDelen : L.puzzelKlaar;
  return [
    // De onderste rij: Back op de vaste plek (taak 232), Start over en de lakknop in de ruimte rechts ervan (samen 15,6 breed).
    terugVoorwerp(UITLEG_KNOP_Z),
    { id: "titel", soort: "naamplaat", x: 0, z: UITLEG_KOP_Z, b: titelB, d: titelD, h: 0.42, plaat: L.titelPuzzel },
    { id: "uitleg", soort: "porselein", x: 0, z: UITLEG_PLAAT_Z, b: 2 * rand, d: 4.6, h: 0.5 },
    { id: "opnieuw", soort: "porselein", x: -1.4, z: UITLEG_KNOP_Z, b: terug.b, d: terug.d, h: 0.5, plaat: L.puzzelOpnieuw },
    { id: "verder", soort: "rood", x: rand - r.b / 2, z: UITLEG_KNOP_Z, b: r.b, d: r.d, h: 0.6, plaat },
  ];
}

/**
 * Hoeveel van de breedte van de plaat aan elke kant vrij blijft voor de tekst (taak 233). De plaat is een trapezium; op een liggend
 * scherm (1920 x 1080) is de bovenrand veel smaller dan de onderrand (12,5% per kant) en stak de inhoud er bovenaan buiten, op een
 * telefoon is dat ongeveer 9% per kant. `verhouding` is breedte gedeeld door hoogte van het scherm.
 */
export function plaatZij(verhouding: number): number {
  return verhouding > 1 ? 0.135 : 0.085;
}

/**
 * De plek van de tekst op een plaat: het vak van de plaat op het scherm, met wat marge. De plaat staat schuin op het scherm
 * (de bovenrand is smaller dan de onderrand), dus is `zij` de ruimte die de bovenrand nodig heeft.
 */
export function platenStijl(vak: Vak | undefined, zij = plaatZij(typeof window === "undefined" ? 0.6 : window.innerWidth / window.innerHeight) - 0.035, boven = 0.07, onder = 0.04): string {
  if (!vak) return "display:none";
  const b = vak.rechts - vak.links, h = vak.onder - vak.boven;
  return `left:${vak.links + b * zij}px;top:${vak.boven + h * boven}px;width:${b * (1 - 2 * zij)}px;height:${h * (1 - boven - onder)}px`;
}

/**
 * Breed scherm (taak 236): de plek van de tekst op een plaat in de kolom naast het bord. De camera kijkt naar het midden van bord
 * en kolom samen, dus de plaat staat er scheef: de kant naar de rand van het scherm loopt naar boven toe naar binnen (op 1920 x 1080
 * ongeveer 0,28 pixel per pixel hoogte), de kant naar het bord staat bijna recht. Die schuine kant krijgt dus meer marge. Van rechts
 * naar links ligt de kolom links van het bord en is het andersom. `plaatZij` en `platenStijl` zijn voor een plaat in het midden.
 */
export function kolomStijl(vak: Vak | undefined, boven = 0.07, onder = 0.04, rtl = typeof document !== "undefined" && document.documentElement.dir === "rtl"): string {
  if (!vak) return "display:none";
  const b = vak.rechts - vak.links, h = vak.onder - vak.boven;
  const schuin = h * KOLOM_SCHUIN + b * 0.025, recht = b * 0.03;
  const [l, r] = rtl ? [schuin, recht] : [recht, schuin];
  return `left:${vak.links + l}px;top:${vak.boven + h * boven}px;width:${b - l - r}px;height:${h * (1 - boven - onder)}px`;
}
/** Hoeveel de schuine kant van een plaat in de kolom naar boven toe naar binnen loopt, per pixel hoogte (gemeten, met wat ruimte). */
const KOLOM_SCHUIN = 0.3;

/**
 * De Stenen op het bord van een tafel zonder Potje: de beginstand van `spelers` Spelers (alleen het beeld). Bij zes Spelers zijn de
 * kleuren twee plekken opgeschoven, zodat rood onderaan staat zoals in 1b (zie Startmenu). `aanwezig`: alleen de Spelers
 * (vanaf 0) die er zijn krijgen hun Stenen.
 */
export function tafelStand(spelers = 6, vierkant = false, aanwezig?: readonly number[]): number[] {
  const p = vierkant ? Potje.vierkant(spelers) : new Potje(spelers);
  const stand = Array.from(p.stand(), (s) => (s < 0 || (aanwezig && !aanwezig.includes(s)) ? -1 : spelers === 6 ? (s + 4) % 6 : s));
  p.free();
  return stand;
}

/** Breed scherm: zoveel ruimte (vakken) ligt er in de kolom tussen de uitslag en de volgende plaat, voor de medaille. */
export const MEDAILLE_RUIMTE = 4.5;

/**
 * De plek van de medaille (de winnaar met kroon en confetti) van het winstscherm: tussen de lakplaat en de volgende plaat. `breed`:
 * de kolom van een breed scherm; de medaille staat dan boven de kolom, niet in het midden van het scherm (taak 236).
 */
export function medailleStijl(vakken: Record<string, Vak>, breed = false): string {
  const boven = vakken.uitslag?.onder, onder = (vakken.lijst ?? vakken.hoofd)?.boven;
  if (boven === undefined || onder === undefined) return "display:none";
  if (breed) {
    const u = vakken.uitslag;
    return `left:${u.links}px;width:${u.rechts - u.links}px;top:${boven + 4}px;height:${Math.max(0, onder - boven - 8)}px`;
  }
  // Zonder lijst ligt de medaille vlak boven de knoppen (onder het bord), niet in het midden van de ruimte.
  if (!vakken.lijst) {
    const hoogte = Math.min(onder - boven - 8, 150);
    return `left:0;right:0;top:${onder - hoogte - 10}px;height:${Math.max(0, hoogte)}px`;
  }
  return `left:0;right:0;top:${boven + 4}px;height:${Math.max(0, onder - boven - 8)}px`;
}
