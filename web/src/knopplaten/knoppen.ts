/**
 * De knoppen van het Startmenu en het Potje die een voorwerp worden (taak 183, voorwerpen van uiterlijk 1b).
 * Dit bestand heeft geen imports: ook scripts/knopletters.mjs leest het (welke teksten moeten in de lettertypen).
 * `sleutels`: de sleutels in web/src/talen/ van de tekst(en) op het voorwerp.
 */
export type Soort = "porselein" | "rood" | "zwart" | "naamplaat" | "lade" | "titel" | "messing" | "jade" | "balk" | "toets" | "toetsGekozen";
export type Pictogram =
  | "computer" | "vrienden" | "puzzel" | "uitleg" | "ranglijst" | "stats" | "terug" | "vlag" | "vink" | "wereld" | "geluid" | "trillen" | "spelen" | "potjes" | "persoon" | "kopie" | "delen" | "wissel";

export type KnopSpec = {
  id: string;
  soort: Soort;
  sleutels: string[];
  /** Eén pictogram per tekst (alleen bij porselein en de lade); rood en zwart hebben een draak. */
  pictogrammen: Pictogram[];
  /** Eigen teksten in plaats van de sleutels: een Spelersnaam (taak 179). Elke tekst komt in de taal van de Speler of is zijn eigen naam. */
  teksten?: string[];
  /** Bij een naamplaat: de Speler (vanaf 0) wiens Steen op de plaat ligt. */
  speler?: number;
  /** Bij de jade aanwijzer: de Denktijd. `rest` van 0 tot 1, en eventueel de seconden als tekst ("0:12"). */
  tijd?: { rest: number; klok?: string };
  /** Bij een naamplaat van een Speler die een tik wisselt (Speler of Computer, taak 235): een klein wisselteken aan het eind. */
  wissel?: boolean;
  /** Bij een naamplaat van een Speler: een andere maat dan `PLAATMATEN` (zes Spelers, taak 193). */
  maat?: { b: number; d: number };
  /** Bij de lade: staat Sound (0) en Vibration (1) aan? Een deel dat uit staat, is dof en heeft een streep door het pictogram (taak 206). */
  aan?: boolean[];
  /** De knop doet nu niets (Done buiten een Sprongketen, Start over bij nul Zetten): dezelfde plaat, maar dof (taak 231). */
  uit?: boolean;
  /** Bij porselein: een tekening van een bord boven de tekst (Bord kiezen). */
  bord?: BordTekening;
};

/**
 * Een bord als tekening op een plaat: de gaatjes en de Stenen in hun beginstand, in vakken (een vak is de afstand tussen twee
 * gaatjes), met Speler 1 onderaan. `bordje()` in web/src/bordje.ts maakt de punten.
 */
export type BordTekening = {
  vierkant: boolean;
  gaten: readonly { x: number; y: number }[];
  stenen: readonly { x: number; y: number; speler: number }[];
};

export const KNOPPEN: KnopSpec[] = [
  // Taak 206 (William): de grote rode plaat start een online Potje (Play / Online), de zwarte is spelen op deze telefoon.
  { id: "online", soort: "rood", sleutels: ["menu.play", "menu.online"], pictogrammen: [] },
  { id: "spelen", soort: "zwart", sleutels: ["menu.play", "menu.onThisPhone"], pictogrammen: [] },
  { id: "computer", soort: "porselein", sleutels: ["common.computer"], pictogrammen: ["computer"] },
  { id: "vrienden", soort: "porselein", sleutels: ["menu.friends"], pictogrammen: ["vrienden"] },
  { id: "puzzel", soort: "porselein", sleutels: ["puzzle.title"], pictogrammen: ["puzzel"] },
  { id: "uitleg", soort: "porselein", sleutels: ["learn.title"], pictogrammen: ["uitleg"] },
  { id: "ranglijst", soort: "porselein", sleutels: ["common.leaderboard"], pictogrammen: ["ranglijst"] },
  { id: "stats", soort: "porselein", sleutels: ["stats.title"], pictogrammen: ["stats"] },
  { id: "lade", soort: "lade", sleutels: ["sound.label", "vibration.label"], pictogrammen: ["geluid", "trillen"] },
  { id: "menu", soort: "porselein", sleutels: ["menu.nav"], pictogrammen: ["terug"] },
  { id: "opgeven", soort: "porselein", sleutels: ["game.resign"], pictogrammen: ["vlag"] },
  { id: "klaar", soort: "porselein", sleutels: ["game.done"], pictogrammen: ["vink"] },
];

/** De naamplaat van een Speler (zwart lak met goud). De tekst is de Spelersnaam of "Player 1"; hij komt niet uit het vaste lijstje. */
export const NAAMPLAAT: KnopSpec = { id: "naamplaat", soort: "naamplaat", sleutels: ["player.n"], pictogrammen: [] };

/**
 * De naamplaat van het Startmenu (taak 178): "Leapstone" (de naam, in elke taal hetzelfde) en daaronder de ondertitel
 * in de taal van de Speler.
 */
export const TITEL: KnopSpec = { id: "titel", soort: "titel", sleutels: ["menu.tagline"], pictogrammen: [] };

/** Het plaatje van messing naar Mijn potjes (taak 178): een pictogram met de naam eronder (taak 206, eerst alleen een pictogram). */
export const MIJN_POTJES: KnopSpec = { id: "potjes", soort: "messing", sleutels: ["common.myGames"], pictogrammen: ["potjes"] };

/** De jade aanwijzer van het Potje (taak 179): "Your turn" (of "is thinking", "The game is over", zie `Potje.svelte`). */
export const JADE: KnopSpec = { id: "beurt", soort: "jade", sleutels: ["common.yourTurn"], pictogrammen: [] };
/** De knop naar Mijn potjes in een online Potje (taak 179): een plaatje van porselein, zoals Menu. */
export const POTJES_KNOP: KnopSpec = { id: "potjesknop", soort: "porselein", sleutels: ["common.myGames"], pictogrammen: ["potjes"] };
/** Teksten van de jade aanwijzer die er verder bij horen (alleen voor de lettertypen). */
const JADE_TEKSTEN = ["common.gameOver", "game.thinking"];

/** Alle sleutels waarvan de tekst in de lettertypen moet zitten. */
export const LETTER_SLEUTELS: string[] = [...[...KNOPPEN, NAAMPLAAT, TITEL, JADE, POTJES_KNOP, MIJN_POTJES].flatMap((k) => k.sleutels), ...JADE_TEKSTEN];

/**
 * De voorwerpen van de Wachtkamer, de Ranglijst, het winstscherm (taak 180) en de Speluitleg (taak 184): titels op een naamplaat en knoppen
 * als plaat. Alle teksten bestaan al in talen/; ze komen hier alleen bij de lettertypen.
 */
export const LIJSTSCHERMEN: Record<string, KnopSpec> = {
  titelRanglijst: { id: "titel-ranglijst", soort: "naamplaat", sleutels: ["common.leaderboard"], pictogrammen: [] },
  titelWachtkamer: { id: "titel-wachtkamer", soort: "naamplaat", sleutels: ["online.lobby"], pictogrammen: [] },
  terug: { id: "terug", soort: "porselein", sleutels: ["common.back"], pictogrammen: ["terug"] },
  mijnPotjes: { id: "mijn-potjes", soort: "porselein", sleutels: ["common.myGames"], pictogrammen: ["potjes"] },
  naarStart: { id: "naar-start", soort: "porselein", sleutels: ["common.backToStart"], pictogrammen: ["terug"] },
  uitnodigen: { id: "uitnodigen", soort: "porselein", sleutels: ["online.invite"], pictogrammen: ["vrienden"] },
  opnieuw: { id: "opnieuw", soort: "rood", sleutels: ["game.playAgain"], pictogrammen: [] },
  nieuwPotje: { id: "nieuw-potje", soort: "rood", sleutels: ["common.newGame"], pictogrammen: [] },
  // De Speluitleg (taak 184).
  titelUitleg: { id: "titel-uitleg", soort: "naamplaat", sleutels: ["learn.title"], pictogrammen: [] },
  volgende: { id: "volgende", soort: "rood", sleutels: ["learn.next"], pictogrammen: [] },
  tegenComputer: { id: "tegen-computer", soort: "rood", sleutels: ["learn.playComputer"], pictogrammen: [] },
  // De Dagelijkse puzzel (taak 187): Start over (porselein) en de lakknop die Done of Share zegt.
  titelPuzzel: { id: "titel-puzzel", soort: "naamplaat", sleutels: ["puzzle.title"], pictogrammen: [] },
  puzzelOpnieuw: { id: "puzzel-opnieuw", soort: "porselein", sleutels: ["puzzle.restart"], pictogrammen: ["terug"] },
  puzzelKlaar: { id: "puzzel-klaar", soort: "rood", sleutels: ["game.done"], pictogrammen: [] },
  puzzelDelen: { id: "puzzel-delen", soort: "rood", sleutels: ["puzzle.share"], pictogrammen: [] },
  // Finding a player (taak 225): de titel, "Find 4 players" en Stop searching.
  titelZoeken: { id: "titel-zoeken", soort: "naamplaat", sleutels: ["common.playOnline"], pictogrammen: [] },
  vier: { id: "vier", soort: "porselein", sleutels: ["online.findFour"], pictogrammen: ["vrienden"], maat: { b: 7.2, d: 2.75 } },
  // Spelersnaam, Herstelcode en "Learn to play?" (taak 226): Continue, Get my player name back, I have saved the code, Start en Skip.
  doorgaan: { id: "doorgaan", soort: "rood", sleutels: ["online.continue"], pictogrammen: [] },
  // Lange teksten ("Meinen Spielernamen zurückholen"): een bredere plaat van porselein in plaats van lak, zodat de tekst niet krimpt (taak 226).
  naamTerug: { id: "naam-terug", soort: "porselein", sleutels: ["online.getNameBack"], pictogrammen: [], maat: { b: 7.2, d: 2.75 } },
  codeBewaard: { id: "code-bewaard", soort: "porselein", sleutels: ["online.savedCode"], pictogrammen: [], maat: { b: 7.2, d: 2.75 } },
  // Het foutscherm (taak 234): Try again.
  opnieuwProberen: { id: "opnieuw-proberen", soort: "rood", sleutels: ["common.tryAgain"], pictogrammen: [] },
  lerenStart: { id: "leren-start", soort: "rood", sleutels: ["learnAsk.start"], pictogrammen: [] },
  lerenOverslaan: { id: "leren-overslaan", soort: "porselein", sleutels: ["learnAsk.skip"], pictogrammen: [], maat: { b: 5.2, d: 2.75 } },
};
LETTER_SLEUTELS.push(...Object.values(LIJSTSCHERMEN).flatMap((k) => k.sleutels));

/**
 * Taak 181 (Account, Vriendenlijst, My stats en Mijn potjes op de tafel): knoppen met een eigen tekst. De platen worden bij het
 * openen van het scherm gebakken uit een `KnopSpec` die `Tafel.svelte` per knop maakt; de lettertypen moeten deze teksten kennen.
 */
export const TAFELSLEUTELS_181: string[] = [
  "common.back", "common.account", "common.myGames", "common.newGame", "account.deleteMine", "account.keep",
  "addFriend.title", "friends.copy", "friends.share", "online.copied", "challenge.send", "account.language", "account.blocked",
];
LETTER_SLEUTELS.push(...TAFELSLEUTELS_181);

/**
 * Taak 188 (de keuzeschermen voor een nieuw Potje op de tafel): titels, keuzes en Start. De platen worden bij het openen van het
 * scherm gebakken (`keuzetafel.ts`); de lettertypen moeten deze teksten kennen. De cijfers van het aantal Spelers zitten al in de lettertypen.
 */
export const KEUZESLEUTELS_188: string[] = [
  "common.back", "common.start", "common.computer", "menu.chooseBoard", "menu.choosePlayers", "board.star", "board.square",
  "seat.player", "level.easy", "level.normal", "level.hard",
];
LETTER_SLEUTELS.push(...KEUZESLEUTELS_188);

/**
 * De keuzebalken van de keuzeschermen (William, 2026-11-12): een balk van zwart lak met een kopje (Players, Board, Opponents,
 * Level) en de keuzes als toetsen van porselein erop (`keuzeBalk` in `keuzetafel.ts`).
 */
export const KEUZEBALK_SLEUTELS: string[] = ["choice.players", "choice.board", "choice.opponents", "level.label", "moveTime.label"];
LETTER_SLEUTELS.push(...KEUZEBALK_SLEUTELS);

/** Taak 227 (nieuw online Potje op de tafel): de toetsen van de keuzebalk Move time (15s, 1m, off). */
export const DENKTIJD_TOETSEN: string[] = ["moveTime.shortSeconds", "moveTime.shortMinutes", "moveTime.off"];
LETTER_SLEUTELS.push(...DENKTIJD_TOETSEN);
