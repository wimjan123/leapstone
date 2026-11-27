// Schermafdrukken van de app met voorbeeldgegevens: losse beelden plus één overzichtsbeeld (dat bekijk je).
//
//   npm --prefix web run schermen -- [--dpr=3] [--maat=390x844] [--filter=puzzel,bord,=startmenu] [--taal=en] [--uit=map] [--gpu] [--poort=5199] [--domein=playleapstone.com] [--grens=1] [--vergelijk=map] [--data=worst]
//
// --filter: elk scherm waarvan de naam een van de woorden bevat; "=naam" kiest precies dat scherm.
// --taal: alleen schermen in die taal; een scherm zonder eigen regel in die taal neemt de Engelse regel in die taal op.
// --maat en --dpr: meer maten na elkaar met één nep-server, zoals --maat=440x956,1032x1376 --dpr=3,2.
// --domein: de app doet zich voor als https://<domein> (voor de Uitnodigingslink in beeld, zie `metDomein`).
// --grens=1: de run faalt als een stilstaand beeld meer dan 1 s kost (meet met --gpu).
// --vergelijk=map: vergelijk elk stilstaand beeld beeldpunt voor beeldpunt met het beeld met dezelfde naam in die map.
// --data=worst|duizend|een|leeg: worst-case voorbeeldgegevens in plaats van de demo (break-ui; scripts/nep/worst.js). Het beeld heet dan <naam>-<data>-....
// Hoe (taak 239): de app en het 3D-bord laden één keer per maat (één pagina; sinds feature 251 is er geen plat scherm meer). Elk scherm zet de hook van de
// nep-pagina direct (`__leapstone.toon` in scripts/nep/nep.js: de app begint opnieuw met verse voorbeeldgegevens en klikt de knoppen
// van de app), met "minder beweging" aan, en de foto komt pas als de pagina en het 3D-bord klaar en stil zijn. Geen vaste wachttijden.
// Per beeld staat `tijd <naam> <s>` in de uitvoer; gebaren (zoom, sleep, druk) en filmstroken staan erbij als (gebaar) en (film).
// Een scherm dat faalt, wordt gemeld en overgeslagen; de run gaat door en eindigt met code 1. `--snel` mag nog, maar doet niets meer.
// Chromium krijgt een echte schermdichtheid (--force-device-scale-factor). Klopt die niet, dan stopt het script.
// Elk scherm is een 3D-tafel: web/src/wasm3d is nodig (npm --prefix web run wasm3d:snel, zie docs/bouwers.md). Voeg een scherm toe door een regel aan SCHERMEN toe te voegen.
import { existsSync, mkdirSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import sharp from "sharp";
import { POTJES, aanraking, geo3d, metDomein, neemOp, open, opties, rust, slaap, startBrowser, startNepServer, zetMaat } from "./bord-hulp.mjs";

// ---- De lijst schermen (gegevens, geen code).
// actie: start | tegel (arg = knop in de nav van het Startmenu) | bord (arg = ster | vierkant | ster3 | ster6; geeft 4 beelden)
const SCHERMEN = [
  { naam: "startmenu", taal: "en", bord: "3d", actie: "start" },
  // Taak 178: het Startmenu als 3D-tafel, ook van rechts naar links en in het Japans.
  { naam: "startmenu", taal: "ar", bord: "3d", actie: "start" },
  { naam: "startmenu", taal: "ja", bord: "3d", actie: "start" },
  // Een vinger houdt Play online ingedrukt (voorwerp 4, de rode plaat sinds taak 206) (het voorwerp zakt), en een echte tik midden op het voorwerp Puzzle of the day (de plek
  // komt van Bevy, voorwerp 8 in STARTMENU van web/src/voorwerpen.ts): daarna staat de puzzel in beeld.
  { naam: "startmenu-druk", taal: "en", bord: "3d", actie: "druk", arg: 4 },
  { naam: "startmenu-tik", taal: "en", bord: "3d", actie: "tik", arg: 8 },
  { naam: "bord-ster-3d", taal: "en", bord: "3d", actie: "bord", arg: "ster" },
  { naam: "bord-vierkant-3d", taal: "en", bord: "3d", actie: "bord", arg: "vierkant" },
  // Taak 177: het Sterbord met 3 en met 6 Spelers (extra Potjes van de nep-server).
  { naam: "bord-ster3-3d", taal: "en", bord: "3d", actie: "bord", arg: "ster3" },
  { naam: "bord-ster6-3d", taal: "en", bord: "3d", actie: "bord", arg: "ster6" },
  // Taak 174: het balkje bij een nieuwe Prestatie, net na een Zet met zes Sprongen.
  { naam: "prestatiebalk", taal: "en", bord: "3d", actie: "balkje" },
  { naam: "prestatiebalk", taal: "ar", bord: "3d", actie: "balkje" },
  // Taak 180: de Ranglijst, de Wachtkamer en het winstscherm als 3D-tafel (uiterlijk 1b), en de Speluitleg.
  { naam: "ranglijst-tafel", taal: "en", bord: "3d", actie: "tegel", arg: 6 },
  { naam: "ranglijst-tafel", taal: "ar", bord: "3d", actie: "tegel", arg: 6 },
  { naam: "ranglijst-vol", taal: "en", bord: "3d", actie: "tegel", arg: 6, extra: 2 }, // winkelbeeld 4 (taak 199): zeven Spelers in de Ranglijst
  { naam: "wachtkamer-tafel", taal: "en", bord: "3d", actie: "wachtkamer" },
  { naam: "wachtkamer-tafel", taal: "ar", bord: "3d", actie: "wachtkamer" },
  { naam: "wachtkamer-link", taal: "en", bord: "3d", actie: "wachtkamer", arg: "link" }, // winkelbeeld 3: de Uitnodigingslink in beeld
  // Taak 225: Finding a player (Play online zonder tegenstander) en het foutscherm (de server geeft een fout), als tafel.
  { naam: "zoeken-tafel", taal: "en", bord: "3d", actie: "zoeken" },
  { naam: "zoeken-tafel", taal: "ar", bord: "3d", actie: "zoeken" },
  { naam: "fout-tafel", taal: "en", bord: "3d", actie: "zoeken", arg: "fout" },
  { naam: "fout-tafel", taal: "ru", bord: "3d", actie: "zoeken", arg: "fout" },
  { naam: "fout-tafel", taal: "ar", bord: "3d", actie: "zoeken", arg: "fout" },
  { naam: "fout-tafel", taal: "de", bord: "3d", actie: "zoeken", arg: "fout" },
  { naam: "naam-tafel", taal: "ru", bord: "3d", actie: "nieuweSpeler", arg: "naam" },
  // Taak 226: een nieuwe Speler bij Play online: Spelersnaam, Herstelcode invullen, Herstelcode tonen en "Learn to play?", als tafel.
  { naam: "naam-tafel", taal: "en", bord: "3d", actie: "nieuweSpeler", arg: "naam" },
  { naam: "naam-tafel", taal: "ar", bord: "3d", actie: "nieuweSpeler", arg: "naam" },
  // Met een Spelersnaam in het veld: Continue is niet meer dof en de regel over de Voorwaarden staat er.
  { naam: "naam-vol-tafel", taal: "en", bord: "3d", actie: "nieuweSpeler", arg: "naamVol" },
  { naam: "invullen-tafel", taal: "en", bord: "3d", actie: "nieuweSpeler", arg: "invullen" },
  { naam: "herstelcode-tafel", taal: "en", bord: "3d", actie: "nieuweSpeler", arg: "herstelcode" },
  { naam: "leren-tafel", taal: "en", bord: "3d", actie: "nieuweSpeler", arg: "leren" },
  // Taak 227: een nieuw online Potje kiezen (Mijn potjes, New game): als tafel (Sterbord en Vierkant bord, ook in de langste talen).
  { naam: "nieuw-potje-tafel", taal: "en", bord: "3d", actie: "nieuwPotje" },
  { naam: "nieuw-potje-tafel", taal: "ar", bord: "3d", actie: "nieuwPotje" },
  { naam: "nieuw-potje-tafel", taal: "ru", bord: "3d", actie: "nieuwPotje" },
  { naam: "nieuw-potje-tafel", taal: "de", bord: "3d", actie: "nieuwPotje" },
  { naam: "nieuw-potje-vierkant", taal: "en", bord: "3d", actie: "nieuwPotje", arg: "vierkant" },
  { naam: "winst-tafel", taal: "en", bord: "3d", actie: "winst3d", arg: 7 },
  { naam: "winst-tafel", taal: "ar", bord: "3d", actie: "winst3d", arg: 7 },
  // Taak 184: de Speluitleg als 3D-tafel. Vier beelden: begin, eerste oefening gedaan (tikken), een Steen in de hand (slepen) en
  // de Sprongketen halverwege. Alles met echte aanrakingen via CDP.
  { naam: "uitleg-tafel", taal: "en", bord: "3d", actie: "uitleg3d" },
  { naam: "uitleg-tafel", taal: "ar", bord: "3d", actie: "uitleg3d" },
  { naam: "uitleg-tafel", taal: "ru", bord: "3d", actie: "uitleg3d" },
  { naam: "uitleg-tafel", taal: "de", bord: "3d", actie: "uitleg3d" },
  // Taak 187: de Dagelijkse puzzel als 3D-tafel: begin, een Steen gekozen en een Zet gedaan (de echte knoppen van het bord).
  { naam: "puzzel-tafel", taal: "en", bord: "3d", actie: "puzzel3d" },
  { naam: "puzzel-tafel", taal: "ar", bord: "3d", actie: "puzzel3d" },
  { naam: "puzzel-tafel", taal: "ru", bord: "3d", actie: "puzzel3d" },
  { naam: "puzzel-tafel", taal: "de", bord: "3d", actie: "puzzel3d" },
  // Taak 179: het Potje als 3D-tafel (naamplaten, jade aanwijzer, blad met knoppen), in het Engels en Arabisch.
  { naam: "potje-ster3", taal: "en", bord: "3d", actie: "bord", arg: "ster3" },
  { naam: "potje-ster3", taal: "ar", bord: "3d", actie: "bord", arg: "ster3" },
  { naam: "potje-ster3", taal: "ru", bord: "3d", actie: "bord", arg: "ster3" },
  { naam: "potje-ster3", taal: "de", bord: "3d", actie: "bord", arg: "ster3" },
  { naam: "potje-ster6", taal: "en", bord: "3d", actie: "bord", arg: "ster6" },
  // Taak 193: zes Spelers met lange namen, een naam zonder spaties, Japans en Arabisch; ook van rechts naar links en met Japanse knoppen.
  { naam: "potje-ster6lang", taal: "en", bord: "3d", actie: "bord", arg: "ster6lang" },
  { naam: "potje-ster6lang", taal: "ar", bord: "3d", actie: "bord", arg: "ster6lang" },
  { naam: "potje-ster6lang", taal: "ja", bord: "3d", actie: "bord", arg: "ster6lang" },
  { naam: "potje-vierkant", taal: "en", bord: "3d", actie: "bord", arg: "vierkant" },
  // Het lokale Potje tegen de Computerspeler (Computer, daarna Start).
  // Taak 186: in een Potje op het Vierkant bord inzoomen (knijpen), schuiven naar je Stenen en een Steen zetten (slepen).
  { naam: "potje-zoom", taal: "en", bord: "3d", actie: "zoom", arg: "vierkant" },
  // Filmstroken van de bewegingen op het Sterbord: kiezen, een stap, een Sprong, een tik die niet mag, slepen en een Zet van de
  // tegenstander. Elk beeld van de browser tijdens de beweging (CDP-screencast), als één strook met de tijd onder elk deel.
  { naam: "film-ster", taal: "en", bord: "3d", actie: "films", arg: "ster" },
  // UI-overgangen: per stap een tik op een voorwerp, en elk beeld van de browser tot alles stil is, als één strook (hele scherm).
  // `keuze`: Startmenu, Bord kiezen, Spelers, een Speler erbij, terug. `scherm`: naar de Ranglijst en terug, de Speluitleg, Mijn potjes (een leeg bord), en een Potje.
  // Laadtafel (taak 223): de app opent en elk beeld van de browser tot de tafel er staat, in twee stroken: het laden (zijde met laadteken)
  // en de overgang naar de tafel. `minder`: dezelfde opening met "minder beweging".
  { naam: "film-laadtafel", taal: "en", bord: "3d", actie: "laadtafel" },
  { naam: "film-laadtafel-minder", taal: "en", bord: "3d", actie: "laadtafel", arg: "minder" },
  // Taak 224: de laadmomenten na het Startmenu. Elke strook loopt vanaf de laatste tik. `laad-potje`: een Potje op het Vierkant bord begint
  // met een bord dat nog niet gebouwd is; `laad-online`: Play online, met het antwoord van de server 1,5 s vastgehouden.
  { naam: "film-laad-potje", taal: "en", bord: "3d", actie: "laadstrook", arg: { pad: ["spelen", "vierkant", "start"] } },
  { naam: "film-laad-online", taal: "en", bord: "3d", actie: "laadstrook", arg: { pad: ["online"], houd: "/api/snel" } },
  { naam: "film-overgang-keuze", taal: "en", bord: "3d", actie: "overgangen", arg: ["spelen", "ster", "aantal3", "terug", "terug"] },
  { naam: "film-overgang-scherm", taal: "en", bord: "3d", actie: "overgangen", arg: ["ranglijst", "terug", "uitleg", "terug", "potjes", "terug", "computer", "start"] },
  { naam: "potje-lokaal", taal: "en", bord: "3d", actie: "lokaal" },
  { naam: "potje-lokaal", taal: "ar", bord: "3d", actie: "lokaal" },
  // Taak 193: tegen vijf Computerspelers (zes Spelers, met de kom thee rechtsboven).
  // Taak 290: drie en vier Spelers op één telefoon (de naamplaten dragen de namen).
  { naam: "potje-lokaal3", taal: "en", bord: "3d", actie: "lokaal", arg: ["tegen2"] },
  { naam: "potje-lokaal4", taal: "en", bord: "3d", actie: "lokaal", arg: ["tegen3"] },
  { naam: "potje-lokaal6", taal: "en", bord: "3d", actie: "lokaal", arg: ["tegen5"] },
  // Taak 181: Mijn potjes, Account, Friends en My stats op de tafel. `tafelpad`: van het Startmenu af, elke stap een echte tik
  // (CDP) midden op een voorwerp (id, de plek van zijn HTML-knop) of op een HTML-knop ("css:<kiezer>").
  { naam: "tafel-mijnpotjes", taal: "en", bord: "3d", actie: "tafelpad", arg: ["potjes"] },
  { naam: "tafel-mijnpotjes", taal: "ar", bord: "3d", actie: "tafelpad", arg: ["potjes"] },
  { naam: "tafel-account", taal: "en", bord: "3d", actie: "tafelpad", arg: ["potjes", "account"] },
  { naam: "tafel-account", taal: "ar", bord: "3d", actie: "tafelpad", arg: ["potjes", "account"] },
  { naam: "tafel-account-wis", taal: "en", bord: "3d", actie: "tafelpad", arg: ["potjes", "account", "css:button.rij.gevaar"] },
  { naam: "tafel-vrienden", taal: "en", bord: "3d", actie: "tafelpad", arg: ["vrienden"] },
  { naam: "tafel-vrienden", taal: "ar", bord: "3d", actie: "tafelpad", arg: ["vrienden"] },
  { naam: "tafel-vrienden-toevoegen", taal: "en", bord: "3d", actie: "tafelpad", arg: ["vrienden", "toevoegen"] },
  { naam: "tafel-stats", taal: "en", bord: "3d", actie: "tafelpad", arg: ["stats"] },
  { naam: "tafel-stats", taal: "ar", bord: "3d", actie: "tafelpad", arg: ["stats"] },
  // Break-ui (2026-11-16): de blokkadelijst en een Record open (met de namen van de tegenstanders); vooral met --data=worst.
  { naam: "tafel-account-blok", taal: "en", bord: "3d", actie: "tafelpad", arg: ["potjes", "account", "css:nav.blad .lijstblok button.rij:nth-of-type(2)"] },
  // Alleen het Potje zelf (naamplaten), zonder gebaren: 2, 3 en 6 Spelers.
  { naam: "potje-namen-2", taal: "en", bord: "3d", actie: "potjefoto", arg: "ster" },
  { naam: "potje-namen-3", taal: "en", bord: "3d", actie: "potjefoto", arg: "ster3" },
  { naam: "potje-namen-6", taal: "en", bord: "3d", actie: "potjefoto", arg: "ster6" },
  { naam: "tafel-stats-record", taal: "en", bord: "3d", actie: "tafelpad", arg: ["stats", "css:ul.records button.rij"] },
  // Taak 189: de Chat en de hoek van het online Potje (Chat en Meldingen) in de kleuren van 1b, op de tafel, en het laden.
  { naam: "chat-tafel", taal: "en", bord: "3d", actie: "chat", arg: "ster3" },
  { naam: "chat-tafel", taal: "ar", bord: "3d", actie: "chat", arg: "ster3" },
  { naam: "laden", taal: "en", bord: "3d", actie: "laden" },
  { naam: "laden", taal: "ar", bord: "3d", actie: "laden" },
  // Taak 188: de keuzeschermen voor een nieuw Potje als 3D-tafel: het bord kiezen, de Spelers (vier Spelers, plek 2 een Computer op
  // Easy) en Computer (drie Computers op Easy). Elke stap een echte tik op een voorwerp.
  { naam: "keuze-bord", taal: "en", bord: "3d", actie: "tafelpad", arg: ["spelen"] },
  { naam: "keuze-bord", taal: "ar", bord: "3d", actie: "tafelpad", arg: ["spelen"] },
  // Bord kiezen met een vinger op Square board (`neer:`: vinger neer, nog niet los): de tafel toont het Vierkant bord.
  { naam: "keuze-bord-vierkant", taal: "en", bord: "3d", actie: "tafelpad", arg: ["spelen", "neer:vierkant"] },
  { naam: "keuze-spelers", taal: "en", bord: "3d", actie: "tafelpad", arg: ["spelen", "ster", "aantal4", "plek1"] },
  { naam: "keuze-spelers", taal: "ar", bord: "3d", actie: "tafelpad", arg: ["spelen", "ster", "aantal4", "plek1"] },
  { naam: "keuze-spelers-vierkant", taal: "en", bord: "3d", actie: "tafelpad", arg: ["spelen", "vierkant"] },
  // De naamplaten bij het kamp van elke Speler (William, 2026-11-12): ook bij 2, 3 en 6 Spelers en 4 op het Vierkant bord.
  { naam: "keuze-spelers-2", taal: "en", bord: "3d", actie: "tafelpad", arg: ["spelen", "ster"] },
  { naam: "keuze-spelers-3", taal: "en", bord: "3d", actie: "tafelpad", arg: ["spelen", "ster", "aantal3", "plek2", "plek2"] },
  { naam: "keuze-spelers-6", taal: "en", bord: "3d", actie: "tafelpad", arg: ["spelen", "ster", "aantal6", "plek1", "plek3", "plek3", "plek3"] },
  { naam: "keuze-spelers-6", taal: "ar", bord: "3d", actie: "tafelpad", arg: ["spelen", "ster", "aantal6", "plek1", "plek3", "plek3", "plek3"] },
  { naam: "keuze-spelers-vierkant4", taal: "en", bord: "3d", actie: "tafelpad", arg: ["spelen", "vierkant", "aantal4", "plek3"] },
  { naam: "keuze-computer", taal: "en", bord: "3d", actie: "tafelpad", arg: ["computer", "tegen3", "niveau0"] },
  { naam: "keuze-computer-vierkant", taal: "en", bord: "3d", actie: "tafelpad", arg: ["computer", "vierkant", "niveau2"] }, // keuzebalken op het Vierkant bord
  { naam: "keuze-computer", taal: "ar", bord: "3d", actie: "tafelpad", arg: ["computer", "tegen3", "niveau0"] },
  // Taak 198: een online Potje met drie Spelers waar de tegenstanders live Berichten sturen (winkelbeeld 2).
  { naam: "potje-online", taal: "en", bord: "3d", actie: "online", arg: "ster3" },
  // Winkelbeelden 7 en 8 voor Google Play (taak 287): Play against the computer (drie Computers op Normal, de standaard) en een
  // Potje op deze telefoon met drie Spelers, een Steen gekozen.
  { naam: "keuze-computer-winkel", taal: "en", bord: "3d", actie: "tafelpad", arg: ["computer", "tegen3"] },
  { naam: "potje-telefoon3", taal: "en", bord: "3d", actie: "tafelpad", arg: ["spelen", "ster", "aantal3", "start", "css:.steen.kan"] },
];

const o = opties({ dpr: "3", maat: "390x844", filter: "", taal: "", uit: path.join(tmpdir(), "leapstone-schermen"), gpu: false, poort: 5199, domein: "", grens: 0, vergelijk: "", data: "" });
// Meer maten in één run (taak 200): `--maat=440x956,1032x1376 --dpr=3,2`. De nep-server start één keer; per maat een eigen Chromium
// (de schermdichtheid geldt voor heel Chromium). Eén `--dpr` geldt voor elke maat.
const maten = String(o.maat).split(",").map((m, i, alle) => {
  const dprs = String(o.dpr).split(",").map(Number);
  if (dprs.length !== 1 && dprs.length !== alle.length) throw new Error("Geef één --dpr, of één per maat");
  const [b, h] = m.split("x").map(Number);
  return { breedte: b, hoogte: h, dpr: dprs[dprs.length === 1 ? 0 : i] };
});
const filter = String(o.filter).split(",").filter(Boolean);
const gekozen = (s) => (!filter.length || filter.some((f) => (f.startsWith("=") ? s.naam === f.slice(1) : s.naam.includes(f))));
// Heeft een scherm geen eigen regel in de gevraagde taal, dan neemt het de Engelse regel in die taal op (de winkelbeelden in elke
// taal, taak 200). Geen enkele aanwijzing in de schermen hangt af van de taal van de knoppen.
const heeftTaal = (naam, taal) => SCHERMEN.some((s) => s.naam === naam && s.taal === taal);
const lijst = SCHERMEN.filter((s) => gekozen(s) && (!o.taal || s.taal === o.taal || (s.taal === "en" && !heeftTaal(s.naam, o.taal))))
  .map((s) => (o.taal ? { ...s, taal: o.taal } : s));
if (!lijst.length) { console.error("Geen scherm gekozen. Namen:", [...new Set(SCHERMEN.map((s) => s.naam))].join(", ")); process.exit(1); }
mkdirSync(o.uit, { recursive: true });

const server = await startNepServer({ poort: Number(o.poort), wasm3d: true });
// Per maat gezet in de lus onderaan.
let sessie, basis, breedte, hoogte, dpr;
let gemaakt = [];
let volgorde = 0; // plek van het scherm in `lijst`, voor de volgorde in het overzichtsbeeld
/** Per beeld de tijd sinds het vorige beeld (of sinds het begin van het scherm): `stil`, `gebaar` of `film`. */
const tijden = [];
const fouten = [];
/** Beelden die nog naar schijf gaan (het volgende scherm loopt intussen door). */
const schrijven = [];
let klok = Date.now();
const naamBestand = (s, deel) => `${s.naam}${deel ? "-" + deel : ""}${o.data ? "-" + o.data : ""}-${s.taal}-${breedte}x${hoogte}-dpr${dpr}.png`;

function meetTijd(label, soort) {
  const sec = (Date.now() - klok) / 1000;
  klok = Date.now();
  tijden.push({ label, sec, soort, volgorde });
  console.log(`tijd ${label} ${sec.toFixed(2)} s${soort === "stil" ? "" : ` (${soort})`}`);
}

/** Stopt met een fout als `belofte` na `ms` nog loopt (een scherm dat blijft hangen, stopt de run niet). */
function binnen(belofte, ms, wat) {
  let t;
  return Promise.race([belofte, new Promise((_, nee) => (t = setTimeout(() => nee(new Error(`${wat}: na ${ms / 1000} s nog niet klaar`)), ms)))]).finally(() => clearTimeout(t));
}

/** Wacht in de pagina tot het scherm klaar en stil is (`stil` in scripts/nep/nep.js): geen vaste wachttijd. */
async function kalm(p) {
  const rest = await binnen(p.evaluate(() => __leapstone.stil()), 20000, "stil");
  if (rest.length) console.log(`[niet stil: ${rest.join(", ")}]`);
}

const cdpVan = new WeakMap();
/** Eén beeld van het hele scherm, als het stil is. `gebaar`: een beeld midden in of na een gebaar (zoom, sleep, druk), buiten de grens. */
async function foto(p, s, deel, { gebaar = false } = {}) {
  await kalm(p);
  let cdp = cdpVan.get(p);
  if (!cdp) { cdp = await sessie.ctx.newCDPSession(p); cdpVan.set(p, cdp); }
  // PNG zonder zware compressie: dezelfde beeldpunten, een groter bestand, en veel sneller dan `page.screenshot`.
  const { data } = await cdp.send("Page.captureScreenshot", { format: "png", optimizeForSpeed: true });
  const bestand = path.join(o.uit, naamBestand(s, deel));
  schrijven.push(writeFile(bestand, Buffer.from(data, "base64")));
  gemaakt.push({ volgorde, bestand, label: `${s.naam}${deel ? " " + deel : ""} (${s.taal}, ${s.bord}${o.data ? ", " + o.data : ""})` });
  console.log("beeld", path.basename(bestand));
  meetTijd(`${s.naam}${deel ? "-" + deel : ""} (${s.taal})`, gebaar ? "gebaar" : "stil");
}

// ---- De pagina: één keer geladen per maat.
const paginas = new Map();
const beweging = new WeakMap();
let vooraan = null;
async function pagina(soort) {
  let p = paginas.get(soort);
  if (p?.isClosed()) p = null;
  if (!p) {
    const t0 = Date.now();
    p = await open(sessie, basis, o.domein ? "meldingen=1" : "", { wacht3d: true });
    // Geen knipperende cursor in een veld (zoals `page.screenshot` die verbergt).
    await p.addStyleTag({ content: "*{caret-color:transparent!important}" });
    paginas.set(soort, p);
    vooraan = null;
    console.log(`laden ${soort} ${((Date.now() - t0) / 1000).toFixed(1)} s`);
    klok = Date.now();
  }
  if (vooraan !== p) { await p.bringToFront(); vooraan = p; }
  return p;
}
async function sluitPaginas() {
  for (const p of paginas.values()) await p.close().catch(() => {});
  paginas.clear();
  vooraan = null;
}
/** Stilstaande beelden met "minder beweging" (geen overgangen); filmstroken met beweging, want die nemen de beweging op. */
async function zetBeweging(p, aan) {
  if (beweging.get(p) === aan) return;
  await p.emulateMedia({ reducedMotion: aan ? "no-preference" : "reduce" });
  beweging.set(p, aan);
}

// ---- Van het Startmenu naar elk scherm: stappen met de knoppen van de app zelf (`stap` in scripts/nep/nep.js).
const VW = (id) => `[data-voorwerp="${id}"]`;
const STAPPEN = {
  tegel: (s) => [{ klik: "nav button", nr: s.arg }],
  // Het Potje met één plek open (p6 in nep.js): de rij met Jules (zonder Emre en Sam). "@jules": zijn naam in de demo of de worst case.
  // `arg: "link"` (winkelbeeld 3, taak 287): schuif de lijst tot de Uitnodigingslink in beeld is. Sinds taak 278 heeft de lijst een
  // strook voor het schuifteken en valt de link op de iPhone net onder de rand. `klik` schuift het element in beeld (`nearest`);
  // de klik op de rij zelf (niet op de knop erin) doet niets. `nr: 0` wacht eerst tot het scherm stil is: de strook komt pas een beeld na
  // de lijst, en schoof de link anders weer weg.
  wachtkamer: (s) => [VW("potjes"), { klik: "button.rij", tekst: "@jules", niet: ["@emre", "@sam"] },
    ...(s.arg === "link" ? [{ klik: ".link-rij", nr: 0 }] : [])],
  // Play online: de nep-server laat Anna zoeken. `arg: "fout"`: de server antwoordt met een fout, dan staat het foutscherm er.
  zoeken: (s) => [...(s.arg === "fout" ? [{ nep: "fout" }] : []), VW("online")],
  // Mijn potjes, dan New game. `arg: "vierkant"`: het Vierkant bord gekozen.
  nieuwPotje: (s) => [VW("potjes"), VW("nieuw"), ...(s.arg === "vierkant" ? [VW("vierkant")] : [])],
  // Een Speler zonder Spelersnaam die Play online kiest; `arg` is het scherm dat we willen zien. De knop is een plaat in
  // `.tafel-knoppen` (op nummer).
  nieuweSpeler: (s) => {
    const druk = (nr) => ({ klik: ".tafel-knoppen button", nr });
    return [
      { nep: "zonderSpeler" }, VW("online"),
      ...(s.arg === "invullen" ? ["button.tekstknop"] : []),
      ...(s.arg === "naamVol" ? [{ vul: "#spelersnaam", waarde: "Mila" }] : []),
      ...(s.arg === "herstelcode" || s.arg === "leren" ? [{ vul: "#spelersnaam", waarde: "Mila" }, druk(1)] : []),
      ...(s.arg === "leren" ? [druk(0)] : []),
    ];
  },
  // Mijn potjes is sinds taak 181 een tafel: het eerste afgelopen Potje met een winnaar (niet een plek in de lijst).
  winst3d: () => [VW("potjes"), { klik: "button.rij.klaar", tekst: "won|فاز", vlag: "i" }],
  // Computer, dan Start (sinds taak 188 ook een tafel). `arg`: voorwerpen om eerst aan te tikken, zoals "tegen5".
  lokaal: (s) => [VW("computer"), ...(s.arg ?? []).map(VW), VW("start")],
  // Van het Startmenu af, per stap een voorwerp (id) of een HTML-knop ("css:<kiezer>"). Een vinger die blijft staan (`neer:`) is een gebaar.
  tafelpad: (s) => s.arg.filter((x) => !x.startsWith("neer:")).map((x) => (x.startsWith("css:") ? x.slice(4) : VW(x))),
  // Een scherm dat op de server wacht: My stats, met alle verzoeken om gegevens vastgehouden.
  laden: () => [{ nep: "houd" }, { klik: "nav button", nr: 7 }],
  uitleg3d: () => [VW("uitleg")],
  puzzel3d: () => [VW("puzzel")],
};
// Deze schermen beginnen meteen in hun Potje (de app opent het Potje waar de Speler in zat, `potje=` in nep.js), zonder Startmenu en
// My games: dat scheelt twee schermen per beeld.
const POTJE_DIRECT = new Set(["bord", "chat", "online", "zoom", "films", "balkje", "potjefoto"]);
const extraVan = (s) => (s.extra ? String(s.extra) : ["bord", "chat", "online", "zoom", "films", "potjefoto"].includes(s.actie) && POTJES[s.arg].index > 6 ? "1" : "");
const FILMS = new Set(["films", "overgangen", "laadstrook"]);

/** Zet het scherm `s` direct, met de hook van de nep-pagina: de app begint opnieuw (verse voorbeeldgegevens) en doet de stappen. */
async function toon(p, s) {
  const potje = POTJE_DIRECT.has(s.actie) ? String(POTJES[s.arg ?? "ster"].index + 1) : "";
  const rest = await binnen(p.evaluate((d) => __leapstone.toon(d), { taal: s.taal === "en" ? "" : s.taal, extra: extraVan(s), potje, data: String(o.data || ""), stappen: STAPPEN[s.actie]?.(s) ?? [] }), 30000, s.naam);
  if (rest.length) console.log(`[${s.naam}: niet stil: ${rest.join(", ")}]`);
}

/** Het midden van het eerste element voor `kiezer` op het scherm (voor een echte aanraking via CDP). */
const midden = (p, kiezer) => p.evaluate((k) => { const e = document.querySelector(k); if (!e) return null; e.scrollIntoView({ block: "nearest" }); const b = e.getBoundingClientRect(); return [b.left + b.width / 2, b.top + b.height / 2]; }, kiezer);

async function bordReeks(p, s) {
  const potje = POTJES[s.arg].index;
  await geo3d(p);
  const { tik, raak } = await aanraking(sessie.ctx, p);
  await foto(p, s, "bord");
  const c = await p.evaluate((pi) => {
    const g = __nep.potjes[pi].game; const st = Array.from(g.stand()); const aan = g.speler_aan_zet?.() ?? 0;
    const m = st.map((v, i) => (v === aan ? i : -1)).filter((i) => i >= 0).filter((i) => g.geldige_bestemmingen(i).length > 0);
    const van = m[Math.floor(m.length / 2)]; const best = Array.from(g.geldige_bestemmingen(van));
    return { van, naar: Array.from(g.stappen(van))[0] ?? best[0] };
  }, potje);
  // Kiezen met de knop van de Steen voor schermlezers (dezelfde `optik` als een tik); de plek op het scherm zoeken kost duizenden
  // vragen aan het bord (`__geo.steen`), en die zijn pas nodig voor het slepen.
  await p.evaluate((v) => document.querySelector(`.steen.kan[data-vak="${v}"]`).click(), c.van);
  await foto(p, s, "gekozen");
  await tik(15, 330); await kalm(p);
  klok = Date.now();
  const pos = await p.evaluate((c) => ({ steen: __geo.steen(c.pi, c.van), aim: __geo.aim(c.pi, c.van, c.naar) }), { ...c, pi: potje });
  const a = pos.steen, b = pos.aim;
  await raak("touchStart", a[0], a[1]); await slaap(80);
  for (let i = 1; i <= 14; i++) { await raak("touchMove", a[0] + (b[0] - a[0]) * i / 14, a[1] + (b[1] - a[1]) * i / 14); await slaap(30); }
  await foto(p, s, "sleep", { gebaar: true });
  await raak("touchEnd");
  await foto(p, s, "na", { gebaar: true });
}

/** Taak 186: knijpen, schuiven en een Steen zetten in een Potje, met echte aanrakingen via CDP (twee vingers voor het knijpen). */
async function zoomReeks(p, s) {
  const potje = POTJES[s.arg].index;
  await geo3d(p);
  const { raak, raakMeer } = await aanraking(sessie.ctx, p);
  await foto(p, s, "overzicht");
  const c = await p.evaluate((pi) => {
    const g = __nep.potjes[pi].game; const st = Array.from(g.stand()); const aan = g.speler_aan_zet?.() ?? 0;
    const m = st.map((v, i) => (v === aan ? i : -1)).filter((i) => i >= 0).filter((i) => g.geldige_bestemmingen(i).length > 0);
    const van = m[Math.floor(m.length / 2)]; return { van, naar: Array.from(g.geldige_bestemmingen(van))[0] };
  }, potje);
  const steen = await p.evaluate((a) => __geo.steen(a.pi, a.van), { pi: potje, van: c.van });
  // Knijpen: twee vingers uit elkaar, om de Steen heen. Het bord onder het midden van de vingers blijft daar liggen.
  const [mx, my] = steen;
  for (let i = 0; i <= 16; i++) {
    const d = 35 + (i * 105) / 16;
    await raakMeer(i === 0 ? "touchStart" : "touchMove", [[mx - d, my], [mx + d, my]]); await slaap(30);
  }
  await raakMeer("touchEnd", []);
  await foto(p, s, "ingezoomd", { gebaar: true });
  const stand1 = await p.evaluate(() => JSON.stringify([__halmaBord3d.wijs(100, 300, -1, 0), __halmaBord3d.wijs(250, 450, -1, 0)]));
  await slaap(300); await kalm(p);
  const stand2 = await p.evaluate(() => JSON.stringify([__halmaBord3d.wijs(100, 300, -1, 0), __halmaBord3d.wijs(250, 450, -1, 0)]));
  console.log("stilstand na loslaten:", stand1 === stand2 ? "ja" : "NEE, het beeld beweegt nog");
  // Schuiven: één vinger op een lege plek (geen Steen binnen de greep) naar boven en rechts.
  // De greep geldt voor de Stenen van de Speler aan de beurt (zoals Bord3D.svelte vraagt); met speler -1 zegt `wijs` nooit "eigen".
  const leeg = await p.evaluate((pi) => {
    const aan = __nep.potjes[pi].game.speler_aan_zet?.() ?? 0;
    for (let y = 250; y < 700; y += 20) for (let x = 60; x < 340; x += 20) {
      const w = __halmaBord3d.wijs(x, y, aan, 12); if (w[2] < 0 && w[3] < 0 && Number.isFinite(w[0])) return [x, y];
    }
    return [195, 450];
  }, potje);
  await raak("touchStart", leeg[0], leeg[1]); await slaap(80);
  for (let i = 1; i <= 12; i++) { await raak("touchMove", leeg[0] + 3 * i, leeg[1] - 6 * i); await slaap(30); }
  await raak("touchEnd");
  await foto(p, s, "geschoven", { gebaar: true });
  // Een Steen zetten: slepen naar het doelvak, op de plek die bij dit beeld hoort.
  // Ingezoomd ligt niet elke Zet in beeld: kies een Steen en een doelvak die allebei in beeld liggen, niet onder een knop (taak 190).
  // Een stap, geen Sprong: na een Sprong blijft de Steen gekozen (een Sprongketen eindigt pas met Done), dan is de Zet nog niet gezet.
  const keuze = await p.evaluate((pi) => {
    const g = __nep.potjes[pi].game, st = Array.from(g.stand()), aan = g.speler_aan_zet?.() ?? 0;
    const binnen = ([x, y]) => x > 30 && x < innerWidth - 30 && y > 120 && y < innerHeight - 280;
    let beste = null;
    for (let van = 0; van < st.length; van++) {
      if (st[van] !== aan) continue;
      // De plek van de Steen kost duizenden vragen aan het bord: één keer per Steen, en geen doelvak zoeken als hij buiten beeld ligt.
      let steen = null;
      for (const naar of g.geldige_bestemmingen(van)) {
        // Een stap: het buurvak (op het bord minder dan 1,5 vak, ook schuin op het Vierkant bord); een Sprong is 2 of meer.
        const [ax, ay] = __geo.vakPunt(pi, van), [bx, by] = __geo.vakPunt(pi, naar);
        if (Math.hypot(bx - ax, by - ay) > 1.5) continue;
        // Het zichtbare midden ligt binnen 45 px opzij en 110 px boven of 20 px onder het gat: ligt het gat verder buiten beeld, dan
        // kan de Steen niet binnen beeld liggen.
        const [gx, gy] = __geo.gat(pi, van);
        if (gx < -15 || gx > innerWidth + 15 || gy < 100 || gy > innerHeight - 170) break;
        steen ??= __geo.steen(pi, van);
        if (!binnen(steen)) break;
        const aim = __geo.aim(pi, van, naar);
        const d = Math.hypot(aim[0] - steen[0], aim[1] - steen[1]);
        // De langste vingerweg: tot 12 px is het een tik, geen slepen.
        if (binnen(steen) && binnen(aim) && d >= 25 && (!beste || d > beste.d)) beste = { van, naar, steen, aim, d };
      }
    }
    return beste;
  }, potje);
  if (keuze) Object.assign(c, { van: keuze.van, naar: keuze.naar });
  const pos = keuze ?? (await p.evaluate((a) => ({ steen: __geo.steen(a.pi, a.van), aim: __geo.aim(a.pi, a.van, a.naar) }), { pi: potje, van: c.van, naar: c.naar }));
  const a = pos.steen, b = pos.aim;
  await raak("touchStart", a[0], a[1]); await slaap(80);
  for (let i = 1; i <= 14; i++) { await raak("touchMove", a[0] + (b[0] - a[0]) * i / 14, a[1] + (b[1] - a[1]) * i / 14); await slaap(30); }
  await foto(p, s, "sleep", { gebaar: true });
  await raak("touchEnd");
  await foto(p, s, "gezet", { gebaar: true });
  const stand = await p.evaluate((a) => Array.from(__nep.potjes[a.pi].game.stand()), { pi: potje });
  console.log("Steen gezet:", stand[c.naar] >= 0 && stand[c.van] < 0 ? "ja" : "NEE");
}

/**
 * Filmstroken op het bord van `s.arg`: per beweging één beeld met de stukjes van de opname naast elkaar en de tijd eronder
 * (ms sinds de vinger of de server). Voor elke beweging gaat het Potje terug naar dezelfde stand, zodat voor en na gelijk zijn.
 */
async function filmReeks(p, s) {
  const pi = POTJES[s.arg].index;
  await geo3d(p);
  const { tik, raak } = await aanraking(sessie.ctx, p);
  const begin = await p.evaluate((pi) => Array.from(__nep.potjes[pi].game.stand()), pi);
  const terug = async () => {
    await p.evaluate(async ({ pi, st }) => {
      const { Potje } = await import("/src/wasm/halma_core.js");
      const q = __nep.potjes[pi], oud = q.game;
      q.game = Potje.van_stand(q.bord === "vierkant", q.aantal_spelers, Int32Array.from(st), 0); oud.free();
      q.versie += 1; q.laatste_zet = null; __nep.stuur(q);
    }, { pi, st: begin });
    await kalm(p);
  };
  // Zetten voor Speler 1 (Mila, aan de beurt): een stap, een Sprong en een vak dat niet mag, met hun plek op het scherm.
  const z = await p.evaluate((pi) => {
    const g = __nep.potjes[pi].game, st = Array.from(g.stand());
    const eigen = (s) => st.map((v, i) => (v === s ? i : -1)).filter((i) => i >= 0);
    const stappen = (v) => Array.from(g.stappen(v)), alle = (v) => Array.from(g.geldige_bestemmingen(v));
    const stapVan = eigen(0).find((v) => stappen(v).length), sprongVan = eigen(0).find((v) => alle(v).some((n) => !stappen(v).includes(n)));
    const stap = { van: stapVan, naar: stappen(stapVan)[0] };
    const sprong = sprongVan === undefined ? null : { van: sprongVan, naar: alle(sprongVan).find((n) => !stappen(sprongVan).includes(n)) };
    const [ax, ay] = __geo.vakPunt(pi, stap.van);
    const mis = st.map((v, i) => i).filter((i) => st[i] < 0 && !alle(stap.van).includes(i)).map((i) => { const [x, y] = __geo.vakPunt(pi, i); return { i, d: Math.hypot(x - ax, y - ay) }; }).filter((m) => m.d > 1.6).sort((a, b) => a.d - b.d)[0]?.i;
    const scherm = (zet) => zet && { ...zet, steen: __geo.steen(pi, zet.van), gat: __geo.gat(pi, zet.naar), aim: __geo.aim(pi, zet.van, zet.naar) };
    return { stap: scherm(stap), sprong: scherm(sprong), mis: scherm({ van: stap.van, naar: mis }) };
  }, pi);
  const kiesSteen = async (zet) => { await tik(zet.steen[0], zet.steen[1]); await kalm(p); };
  const zetVan = (plek, van, naar) => p.evaluate(({ pi, plek, van, naar }) => __nep.zetVan(__nep.potjes[pi], plek, van, naar), { pi, plek, van, naar });
  const FILMS = [
    { soort: "kies", zet: z.stap, voor: null, doe: () => tik(z.stap.steen[0], z.stap.steen[1]) },
    { soort: "stap", zet: z.stap, voor: () => kiesSteen(z.stap), doe: () => tik(z.stap.gat[0], z.stap.gat[1]) },
    { soort: "sprong", zet: z.sprong, voor: () => kiesSteen(z.sprong), doe: () => tik(z.sprong.gat[0], z.sprong.gat[1]) },
    { soort: "mis", zet: z.mis, voor: () => kiesSteen(z.mis), doe: () => tik(z.mis.gat[0], z.mis.gat[1]) },
    { soort: "sleep", zet: z.stap, voor: null, doe: async () => {
      const a = z.stap.steen, b = z.stap.aim;
      await raak("touchStart", a[0], a[1]); await slaap(80);
      for (let i = 1; i <= 14; i++) { await raak("touchMove", a[0] + (b[0] - a[0]) * i / 14, a[1] + (b[1] - a[1]) * i / 14); await slaap(30); }
      await slaap(150); await raak("touchEnd");
    } },
    { soort: "tegenstander", zet: z.stap, voor: async () => { await zetVan(1, z.stap.van, z.stap.naar); await kalm(p); }, doe: async () => {
      const t = await p.evaluate((pi) => { const g = __nep.potjes[pi].game, st = Array.from(g.stand()); for (const [v, s] of st.entries()) { if (s !== 1) continue; const n = Array.from(g.geldige_bestemmingen(v)); if (n.length) return { van: v, naar: n.at(-1) }; } return null; }, pi);
      if (t) await zetVan(2, t.van, t.naar);
    } },
  ];
  for (const f of FILMS) {
    if (!f.zet) { console.log("film", f.soort, "overgeslagen: geen Zet in deze stand"); continue; }
    await terug();
    if (f.voor) await f.voor();
    const beelden = await neemOp(sessie.ctx, p, f.doe);
    await filmstrook(s, f.soort, beelden, [f.zet.steen, f.zet.gat, f.zet.aim]);
  }
}

// Eén beeld met hooguit 12 stukjes van de opname (het eerste, het laatste en gelijk verdeeld daartussen), uitgesneden rond de
// plekken van de beweging, met de tijd in ms eronder.
async function filmstrook(s, soort, beelden, punten) {
  if (!beelden.length) throw new Error(`Filmstrook ${soort}: geen beelden opgenomen`);
  const xs = punten.map((q) => q[0]), ys = punten.map((q) => q[1]);
  // In beeldpunten van de opname, die kleiner kan zijn dan het scherm maal de schermdichtheid, en binnen dat beeld (taak 228: een vak
  // buiten het beeld liet sharp stoppen met "bad extract area").
  const meta = await sharp(beelden[0].data).metadata();
  const k = meta.width / breedte;
  const x0 = Math.max(0, Math.min(...xs) - 70), y0 = Math.max(0, Math.min(...ys) - 110);
  const x1 = Math.min(breedte, Math.max(...xs) + 70), y1 = Math.min(hoogte, Math.max(...ys) + 60);
  const left = Math.min(Math.round(x0 * k), meta.width - 1), top = Math.min(Math.round(y0 * k), meta.height - 1);
  const vak = { left, top, width: Math.max(1, Math.min(Math.round((x1 - x0) * k), meta.width - left)), height: Math.max(1, Math.min(Math.round((y1 - y0) * k), meta.height - top)) };
  const n = Math.min(12, beelden.length);
  const keuze = Array.from({ length: n }, (_, i) => beelden[Math.round((i * (beelden.length - 1)) / Math.max(1, n - 1))]);
  const cel = 240, ch = Math.round((cel * vak.height) / vak.width), lab = 26, kol = Math.min(6, n), lagen = [];
  for (const [i, b] of keuze.entries()) {
    const x = (i % kol) * cel, y = Math.floor(i / kol) * (ch + lab);
    lagen.push({ input: await sharp(b.data).extract(vak).resize(cel - 6, ch).toBuffer(), left: x + 3, top: y });
    lagen.push({ input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${cel}" height="${lab}"><text x="${cel / 2}" y="18" font-size="15" font-family="sans-serif" text-anchor="middle" fill="#222">${b.ms} ms</text></svg>`), left: x, top: y + ch });
  }
  const bestand = path.join(o.uit, naamBestand(s, soort));
  await sharp({ create: { width: kol * cel, height: Math.ceil(n / kol) * (ch + lab), channels: 3, background: "#f4f4f4" } }).composite(lagen).png().toFile(bestand);
  gemaakt.push({ volgorde, bestand, film: true, label: `${s.naam} ${soort} (${beelden.length} beelden)` });
  console.log("film", path.basename(bestand), beelden.length, "beelden");
  meetTijd(`${s.naam}-${soort} (${s.taal})`, "film");
}

/**
 * UI-overgangen: tik per stap op het voorwerp `stap` (de HTML-knop erop, via CDP) en neem elk beeld op tot het bord stil is. Elke stap
 * geeft een strook van het hele scherm met de beelden van de eerste `TOT_MS` (daarna staat alles stil).
 */
async function overgangReeks(p, s) {
  const TOT_MS = 900;
  const { raak } = await aanraking(sessie.ctx, p);
  for (const [i, stap] of s.arg.entries()) {
    const kiezer = `[data-voorwerp="${stap}"]`;
    await p.waitForSelector(kiezer, { timeout: 20000 }); await kalm(p);
    const r = await midden(p, kiezer);
    // De weg van de camera: elk beeld de plek op het bord onder het midden en onder de linkerrand van het scherm (vakken). Glijdt de
    // camera rustig, dan verandert de breedte (rand - midden) in één richting, zonder heen en weer.
    await p.evaluate(() => {
      const b = globalThis.__halmaBord3d, t0 = performance.now(), uit = (globalThis.__cameraWeg = []);
      const meet = () => { const m = b.wijs(innerWidth / 2, innerHeight / 2, -1, 0), l = b.wijs(0, innerHeight / 2, -1, 0); uit.push([Math.round(performance.now() - t0), b.beelden(), +(m[0] - l[0]).toFixed(2), +m[1].toFixed(2)]); if (uit.length < 90) requestAnimationFrame(meet); };
      requestAnimationFrame(meet);
    });
    const beelden = await neemOp(sessie.ctx, p, async () => { await raak("touchStart", r[0], r[1]); await slaap(60); await raak("touchEnd"); });
    const binnenTot = beelden.filter((b) => b.ms >= -20 && b.ms <= TOT_MS);
    console.log("overgang", stap, beelden.length, "beelden in totaal,", binnenTot.length, `in de eerste ${TOT_MS} ms`);
    // Alleen de rijen waarin Bevy een nieuw beeld tekende; de grootste pauze tussen twee beelden zegt of de overgang hapert.
    const weg = await p.evaluate(() => globalThis.__cameraWeg.filter((w, i, a) => i === 0 || w[1] !== a[i - 1][1]));
    const beweegt = weg.map((w, i) => i > 0 && (w[2] !== weg[i - 1][2] || w[3] !== weg[i - 1][3]));
    const [eerste, laatste] = [beweegt.indexOf(true), beweegt.lastIndexOf(true)];
    const pauze = eerste < 0 ? 0 : Math.max(...weg.slice(eerste, laatste + 1).map((w, i) => w[0] - weg[eerste - 1 + i][0]));
    console.log(`camera (ms, beeld, halve breedte in vakken, midden z), langste pauze tijdens het glijden ${pauze} ms:`, JSON.stringify(weg));
    await filmstrook(s, `${i + 1}-${stap}`, binnenTot.length ? binnenTot : beelden, [[0, 0], [breedte, hoogte]]);
  }
}

/**
 * Laadtafel (taak 223): open de app met de opname al aan en neem elk beeld van de browser op tot de tafel er staat en alles stil is.
 * Twee stroken, de tijd onder elk beeld in ms sinds het moment waarop de tafel in beeld komt (`performance.mark("tafel")` in
 * Voorwerpen.svelte): `1-laden` (tot dan) en `2-tafel` (de eerste 900 ms erna). Een versie van de app zonder laadtafel krijgt dezelfde
 * stroken, zodat voor en na gelijk gemaakt zijn. Dit is het enige scherm dat de app zelf opnieuw laadt: het laden is wat hij opneemt.
 */
async function laadtafelReeks(s) {
  // Nooit twee 3D-borden tegelijk (de tweede pagina liet Chromium op de grafische kaart crashen).
  await sluitPaginas();
  const query = [s.taal !== "en" ? `taal=${s.taal}` : "", o.domein ? "meldingen=1" : ""].filter(Boolean).join("&");
  const p = await sessie.ctx.newPage();
  try {
    p.on("pageerror", (e) => console.log("[pagina-fout]", e.message.slice(0, 300)));
    await zetMaat(sessie.ctx, p, breedte, hoogte);
    if (s.arg === "minder") await p.emulateMedia({ reducedMotion: "reduce" });
    const cdp = await sessie.ctx.newCDPSession(p);
    const ruw = [];
    cdp.on("Page.screencastFrame", (f) => { ruw.push({ t: f.metadata.timestamp, data: Buffer.from(f.data, "base64") }); cdp.send("Page.screencastFrameAck", { sessionId: f.sessionId }).catch(() => {}); });
    await cdp.send("Page.startScreencast", { format: "jpeg", quality: 85, everyNthFrame: 1 });
    await p.goto(basis + (query ? "?" + query : ""), { waitUntil: "commit" });
    await p.waitForSelector(".tafel-knoppen", { timeout: 90000 });
    await rust(p, { stilMs: 600 });
    await slaap(300);
    await cdp.send("Page.stopScreencast"); await cdp.detach().catch(() => {});
    const tafel = await p.evaluate(() => { const m = performance.getEntriesByName("tafel")[0]; return m ? performance.timeOrigin + m.startTime : null; });
    if (tafel === null) throw new Error("De tafel kwam niet in beeld (geen merk 'tafel')");
    const beelden = ruw.map((b) => ({ ms: Math.round(b.t * 1000 - tafel), data: b.data }));
    console.log("laadtafel", beelden.length, "beelden in totaal; eerste", beelden[0]?.ms, "ms, laatste", beelden.at(-1)?.ms, "ms rond de tafel");
    const voor = beelden.filter((b) => b.ms < 0), na = beelden.filter((b) => b.ms >= -60 && b.ms <= 900);
    const alles = [[0, 0], [breedte, hoogte]];
    if (voor.length) await filmstrook(s, "1-laden", voor, alles);
    if (na.length) await filmstrook(s, "2-tafel", na, alles);
  } finally {
    await p.close().catch(() => {});
  }
}

/**
 * Een laadmoment na het Startmenu (taak 224): tik de stappen van `arg.pad` aan (voorwerpen, zoals bij de overgangen), neem bij de laatste
 * tik elk beeld van de browser op en maak een strook van de eerste 2,5 s. `arg.houd`: het antwoord op deze verzoeken komt 1,5 s later,
 * zodat het scherm `laden` te zien is.
 */
async function laadstrookReeks(p, s) {
  const TOT_MS = 2500;
  const { raak } = await aanraking(sessie.ctx, p);
  if (s.arg.houd) await p.evaluate((h) => { const f = window.fetch; window.fetch = (u, ...r) => (String(u).includes(h) ? new Promise((res) => setTimeout(() => res(f(u, ...r)), 1500)) : f(u, ...r)); }, s.arg.houd);
  for (const [i, stap] of s.arg.pad.entries()) {
    const kiezer = `[data-voorwerp="${stap}"]`;
    await p.waitForSelector(kiezer, { timeout: 20000 }); await kalm(p);
    const r = await midden(p, kiezer);
    const tik = async () => { await raak("touchStart", r[0], r[1]); await slaap(60); await raak("touchEnd"); };
    if (i < s.arg.pad.length - 1) { await tik(); continue; }
    const beelden = await neemOp(sessie.ctx, p, tik);
    const binnenTot = beelden.filter((b) => b.ms >= -20 && b.ms <= TOT_MS);
    console.log("laadstrook", s.naam, beelden.length, "beelden in totaal,", binnenTot.length, `in de eerste ${TOT_MS} ms`);
    await filmstrook(s, "laden", binnenTot.length ? binnenTot : beelden, [[0, 0], [breedte, hoogte]]);
  }
}

/** De Speluitleg op de tafel (taak 184): de oefeningen met echte tikken en een echte sleep. */
async function uitlegReeks(p, s) {
  await geo3d(p);
  const { tik, raak } = await aanraking(sessie.ctx, p);
  // Een gat op het scherm (kolom, rij op het Sterbord), en het zichtbare midden van de eigen Steen.
  const gat = (k, r) => p.evaluate(([k, r]) => __geo.solve(k + r / 2, r * 0.866), [k, r]);
  const steen = (k, r) => p.evaluate(([k, r]) => {
    const vak = Number(document.querySelector(".steen.kan")?.getAttribute("data-vak"));
    const [hx, hy] = __geo.solve(k + r / 2, r * 0.866); let n = 0, sx = 0, sy = 0;
    for (let y = hy - 110; y <= hy + 20; y += 2) for (let x = hx - 45; x <= hx + 45; x += 2) { const w = __halmaBord3d.wijs(x, y, -1, 0); if (w[3] === vak) { n++; sx += x; sy += y; } }
    return n ? [sx / n, sy / n] : [hx, hy];
  }, [k, r]);
  const verder = () => p.evaluate(() => __leapstone.stap('[data-voorwerp="verder"]'));
  await foto(p, s, "begin");
  // De Steen van de oefening kiezen met zijn knop voor schermlezers (dezelfde `optik` als een tik): zijn plek zoeken kost duizenden
  // vragen aan het bord. Het gat krijgt meteen een echte tik, zonder te wachten tot de Steen helemaal opgetild is (0,7 s): de keuze
  // staat al in de app, en het gat ligt op het bord, niet onder de Steen.
  const kies = () => p.evaluate(() => document.querySelector(".steen.kan").click());
  // Oefening 1 met tikken: de Steen op (0,-1) kiezen en het doelvakje (0,0).
  await kies();
  let b = await gat(0, 0); await tik(b[0], b[1]);
  await foto(p, s, "gedaan");
  await verder();
  // Oefening 2 met slepen: de Steen op (0,-2) over (0,-1) naar (0,0). De Steen hangt boven de vinger: richt met `aim`.
  const a = await steen(0, -2);
  const vak = await p.evaluate(() => Number(document.querySelector(".steen.kan")?.getAttribute("data-vak")));
  b = await p.evaluate(([vak]) => {
    const [bx, by] = [0, 0]; let [fx, fy] = __geo.solve(bx, by);
    const f = (x, y) => { const q = __halmaBord3d.sleep(vak, x, y); return [q[0], q[1]]; };
    for (let i = 0; i < 10; i++) {
      const [px, py] = f(fx, fy); if (!Number.isFinite(px)) break;
      const ex = bx - px, ey = by - py; if (Math.hypot(ex, ey) < 0.005) break;
      const h = 2, [ax, ay] = f(fx + h, fy), [cx, cy] = f(fx, fy + h);
      const a = (ax - px) / h, b = (cx - px) / h, c = (ay - py) / h, d = (cy - py) / h, det = a * d - b * c;
      fx += (d * ex - b * ey) / det; fy += (-c * ex + a * ey) / det;
    }
    __halmaBord3d.loslaten(-1);
    return [fx, fy];
  }, [vak]);
  await kalm(p);
  await raak("touchStart", a[0], a[1]); await slaap(80);
  for (let i = 1; i <= 14; i++) { await raak("touchMove", a[0] + (b[0] - a[0]) * i / 14, a[1] + (b[1] - a[1]) * i / 14); await slaap(30); }
  await foto(p, s, "sleep", { gebaar: true });
  await raak("touchEnd"); await kalm(p);
  klok = Date.now(); // het loslaten hoort bij het gebaar
  await verder();
  // Oefening 3 halverwege: de Steen op (1,-3) kiezen en de eerste Sprong naar (1,-1).
  await kies();
  b = await gat(1, -1); await tik(b[0], b[1]);
  await foto(p, s, "halverwege");
}

/** De Dagelijkse puzzel op de tafel (taak 187): een Steen kiezen en een Zet doen. */
async function puzzelReeks(p, s) {
  await geo3d(p);
  await foto(p, s, "begin");
  // De eerste Steen van de Speler kiezen met zijn knop voor schermlezers (dezelfde `optik` als een tik).
  const vak = await p.evaluate(() => Number(document.querySelector(".steen.kan")?.getAttribute("data-vak")));
  await p.evaluate((v) => document.querySelector(`.steen.kan[data-vak="${v}"]`).click(), vak);
  await foto(p, s, "gekozen");
  // Een Zet: om de beurt de Steen en een gat aantikken (de knoppen voor schermlezers), in de volgorde van de gaten, tot er een Zet
  // gedaan is. Alles in de pagina zonder te wachten op het bord: alleen de app moet bij zijn (Svelte werkt bij in een microtaak).
  // Daarna wacht `foto` tot het bord stil is.
  // Een gat dat niet mag, laat de Steen op het bord naar de rand rollen en terug (`mis`): tijdens het zoeken zet het bord dat niet in
  // gang. Het beeld na afloop is hetzelfde, want die Steen ligt dan weer op zijn plek.
  await p.evaluate(async (vak) => {
    const bord = globalThis.__halmaBord3d, mis = bord.mis;
    bord.mis = () => {};
    const bij = async () => { await Promise.resolve(); await Promise.resolve(); };
    const telZetten = () => /\d+/.exec(document.querySelector(".op-plaat .teller")?.textContent ?? "")?.[0] ?? "0";
    for (const gat of [...document.querySelectorAll(".gat")].map((e) => e.dataset.gat)) {
      if (telZetten() !== "0") break;
      document.querySelector(`.steen.kan[data-vak="${vak}"]`)?.click(); await bij();
      document.querySelector(`.gat[data-gat="${gat}"]`)?.click(); await bij();
    }
    bord.mis = mis;
  }, vak);
  await foto(p, s, "zet");
}

/**
 * Taak 198: een online Potje met drie Spelers (Mila, Ada, Bo). Mila doet een Zet (de knoppen voor schermlezers, dezelfde `optik`
 * als een tik); daarna wacht het Potje op Ada ("Ada is thinking") en sturen Ada, Bo en Mila Vaste zinnen via de live verbinding,
 * zodat de knop Chat een bolletje voor een nieuw Bericht krijgt. Beeld: `live`. De Berichten zijn voorbeeldtekst.
 */
async function onlineReeks(p, s) {
  const pi = POTJES[s.arg].index;
  const c = await p.evaluate((pi) => {
    const g = __nep.potjes[pi].game, st = Array.from(g.stand()), aan = g.speler_aan_zet?.() ?? 0;
    const m = st.map((v, i) => (v === aan ? i : -1)).filter((i) => i >= 0).filter((i) => Array.from(g.stappen(i)).length > 0);
    const van = m[Math.floor(m.length / 2)];
    return { van, naar: Array.from(g.stappen(van))[0] };
  }, pi);
  await p.evaluate(async ({ van, naar }) => {
    document.querySelector(`.steen.kan[data-vak="${van}"]`)?.click();
    await new Promise((r) => requestAnimationFrame(r));
    document.querySelector(`.gat[data-gat="${naar}"]`)?.click();
  }, c);
  await kalm(p);
  const stuur = (plek, tekst) => p.evaluate(({ pi, plek, tekst }) => { __nep.berichtVan(__nep.potjes[pi], plek, tekst); }, { pi, plek, tekst });
  await stuur(2, "Hi!"); await stuur(3, "Good luck");
  await foto(p, s, "live");
}

/** Een Potje met een nieuwe Prestatie (taak 174): Mila zet, en de nep-server meldt zes Sprongen in één Zet. */
async function balkjeReeks(p, s) {
  const c = await p.evaluate(() => {
    const pt = __nep.potjes[0]; pt.eigen = new Map([[1, { zetten: 0, sprongen: 6 }]]);
    const g = pt.game; const st = Array.from(g.stand());
    const van = st.findIndex((v, i) => v === 0 && g.geldige_bestemmingen(i).length > 0);
    return { van, naar: g.geldige_bestemmingen(van)[0] };
  });
  // Met de knoppen van de Stenen voor schermlezers (dezelfde `optik` als een tik op het 3D-bord).
  await p.evaluate((v) => document.querySelector(`button.steen[data-vak="${v}"]`).click(), c.van); await kalm(p);
  await p.evaluate((v) => document.querySelector(`[data-gat="${v}"]`).click(), c.naar);
  await foto(p, s, "");
}

/** Een vinger op een voorwerp van het Startmenu (taak 178): `druk` houdt hem erop, `tik` tikt erop (de plek komt van Bevy). */
async function vingerReeks(p, s) {
  const [l, b, r, o] = await p.evaluate((i) => Array.from(__halmaBord3d.voorwerp_vakken()).slice(4 * i, 4 * i + 4), s.arg);
  const { raak } = await aanraking(sessie.ctx, p);
  await raak("touchStart", (l + r) / 2, (b + o) / 2);
  if (s.actie === "druk") { await foto(p, s, "", { gebaar: true }); await raak("touchCancel"); return; }
  await slaap(80); await raak("touchEnd");
  await foto(p, s, "", { gebaar: true });
}

async function chatReeks(p, s) {
  await foto(p, s, "hoek");
  // Op een breed scherm ligt de Chat altijd open naast het bord (taak 236): daar een Bericht sturen in plaats van openen.
  if (await p.locator("button.chat-knop").count()) await p.evaluate(() => __leapstone.stap("button.chat-knop"));
  else await p.locator(".op-plaat-chat input").fill("Good luck!").then(() => p.keyboard.press("Enter")).catch(() => {});
  await foto(p, s, "open");
}

const REEKSEN = { bord: bordReeks, zoom: zoomReeks, films: filmReeks, overgangen: overgangReeks, laadstrook: laadstrookReeks, uitleg3d: uitlegReeks, puzzel3d: puzzelReeks, online: onlineReeks, balkje: balkjeReeks, druk: vingerReeks, tik: vingerReeks, chat: chatReeks };

async function neemScherm(s) {
  if (s.actie === "laadtafel") return laadtafelReeks(s);
  const p = await pagina(s.bord);
  await zetBeweging(p, FILMS.has(s.actie));
  await toon(p, s);
  const neer = s.actie === "tafelpad" ? s.arg.find((x) => x.startsWith("neer:")) : null;
  if (neer) {
    // Een vinger op het voorwerp die nog niet loslaat: de tafel toont wat hij zou kiezen (Bord kiezen: het Vierkant bord).
    const r = await midden(p, VW(neer.slice(5)));
    if (!r) throw new Error(`Geen knop ${neer} in ${s.naam}`);
    const { raak } = await aanraking(sessie.ctx, p);
    await raak("touchStart", r[0], r[1]);
    await foto(p, s, "", { gebaar: true });
    await raak("touchCancel");
    return;
  }
  if (REEKSEN[s.actie]) await REEKSEN[s.actie](p, s);
  else await foto(p, s, "");
}

async function neemLijstOp() {
  for (const [j, s] of lijst.entries()) {
    volgorde = j;
    // Chromium laat een pagina af en toe crashen (vooral op een drukke machine): dat scherm één keer opnieuw, met een verse pagina.
    // Een andere fout: meld het scherm, sla het over en ga door met de rest (taak 228).
    for (let poging = 1; ; poging++) {
      klok = Date.now();
      try { await neemScherm(s); break; } catch (e) {
        gemaakt = gemaakt.filter((g) => g.volgorde !== j);
        for (let i = tijden.length - 1; i >= 0; i--) if (tijden[i].volgorde === j && tijden[i].maat === undefined) tijden.splice(i, 1);
        await sluitPaginas();
        const tekst = String(e?.message ?? e).split("\n")[0];
        if (poging < 2 && /crash/i.test(tekst)) { console.log(`[pagina gecrasht bij ${s.naam}, nog een keer]`); continue; }
        fouten.push(`${s.naam} (${s.taal}, ${breedte}x${hoogte}): ${tekst}`);
        console.log(`FOUT ${s.naam} (${s.taal}): ${tekst}`);
        break;
      }
    }
  }
  await sluitPaginas();
}

// ---- Overzichtsbeeld: alle beelden naast elkaar met een naam eronder.
async function overzichtsbeeld() {
  gemaakt.sort((a, b) => a.volgorde - b.volgorde);
  if (!gemaakt.length) return;
  const kolommen = Math.min(6, gemaakt.length), cel = 240, hoogteCel = Math.round(cel * hoogte / breedte), label = 36;
  const rijen = Math.ceil(gemaakt.length / kolommen);
  const lagen = [];
  for (const [i, g] of gemaakt.entries()) {
    const x = (i % kolommen) * cel, y = Math.floor(i / kolommen) * (hoogteCel + label);
    lagen.push({ input: await sharp(g.bestand).resize(cel - 8, hoogteCel, { fit: "contain", background: "#f4f4f4" }).toBuffer(), left: x + 4, top: y });
    const tekst = g.label.replace(/&/g, "&amp;").replace(/</g, "&lt;");
    lagen.push({ input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${cel}" height="${label}"><text x="${cel / 2}" y="22" font-size="13" font-family="sans-serif" text-anchor="middle" fill="#222">${tekst}</text></svg>`), left: x, top: y + hoogteCel });
  }
  const overzicht = path.join(o.uit, `overzicht-${breedte}x${hoogte}-dpr${dpr}.png`);
  await sharp({ create: { width: kolommen * cel, height: rijen * (hoogteCel + label), channels: 3, background: "#f4f4f4" } }).composite(lagen).png().toFile(overzicht);
  console.log("overzicht", overzicht);
}

/**
 * `--vergelijk=<map>`: elk stilstaand beeld beeldpunt voor beeldpunt naast het beeld met dezelfde naam in die map (bijvoorbeeld een
 * run van `main`). Een verschil krijgt een beeld in `<uit>/verschil/`: het nieuwe beeld, wat anders is in rood.
 */
async function vergelijk() {
  let gelijk = 0;
  const anders = [];
  for (const g of gemaakt.filter((g) => !g.film).sort((a, b) => a.volgorde - b.volgorde)) {
    const naam = path.basename(g.bestand), oud = path.join(String(o.vergelijk), naam);
    if (!existsSync(oud)) { console.log("vergelijk", naam, "geen oud beeld"); continue; }
    const [a, b] = await Promise.all([oud, g.bestand].map((f) => sharp(f).ensureAlpha().raw().toBuffer({ resolveWithObject: true })));
    if (a.info.width !== b.info.width || a.info.height !== b.info.height) { anders.push(naam); console.log(`verschil ${naam}: maat ${a.info.width}x${a.info.height} oud, ${b.info.width}x${b.info.height} nieuw`); continue; }
    const { width: w, height: h } = b.info, uit = Buffer.from(b.data);
    let n = 0, max = 0, x0 = w, y0 = h, x1 = -1, y1 = -1;
    for (let i = 0; i < w * h; i++) {
      const k = i * 4;
      const d = Math.max(Math.abs(a.data[k] - b.data[k]), Math.abs(a.data[k + 1] - b.data[k + 1]), Math.abs(a.data[k + 2] - b.data[k + 2]));
      if (!d) { uit[k] >>= 2; uit[k + 1] >>= 2; uit[k + 2] >>= 2; continue; }
      n++; max = Math.max(max, d); uit[k] = 255; uit[k + 1] = 0; uit[k + 2] = 0;
      const x = i % w, y = (i - x) / w; x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y);
    }
    if (!n) { gelijk++; console.log("gelijk", naam); continue; }
    anders.push(naam);
    mkdirSync(path.join(o.uit, "verschil"), { recursive: true });
    await sharp(uit, { raw: { width: w, height: h, channels: 4 } }).png().toFile(path.join(o.uit, "verschil", naam));
    // `kleur`: het grootste verschil in één kleur (0 tot 255); hooguit een paar is een randje dat een fractie van een beeldpunt verschoof.
    console.log(`verschil ${naam}: ${n} beeldpunten (${((100 * n) / (w * h)).toFixed(3)}%), kleur tot ${max}, in x ${x0}-${x1}, y ${y0}-${y1}`);
  }
  console.log(`vergelijking: ${gelijk} gelijk, ${anders.length} anders${anders.length ? ` (beelden in ${path.join(o.uit, "verschil")})` : ""}`);
}

try {
  for (const m of maten) {
    ({ breedte, hoogte, dpr } = m);
    gemaakt = [];
    sessie = await startBrowser({ breedte, hoogte, dpr, gpu: o.gpu === "vulkan" ? "vulkan" : o.gpu === true });
    try {
      // Met een domein doet de app zich voor als de geïnstalleerde app: geen web-hint "Add to Home Screen" bij de Meldingen (die staat niet in de iPhone-app).
      if (o.domein) await sessie.ctx.addInitScript(() => Object.defineProperty(navigator, "standalone", { value: true }));
      basis = o.domein ? await metDomein(sessie.ctx, String(o.domein), server.url) : server.url;
      await neemLijstOp();
    } finally {
      await sessie.browser.close();
    }
    await Promise.all(schrijven.splice(0));
    for (const t of tijden) t.maat ??= `${breedte}x${hoogte}`;
    await overzichtsbeeld();
    if (o.vergelijk) await vergelijk();
  }
} finally {
  await server.stop();
}

// ---- Samenvatting, en de grens (`--grens=1`): een stilstaand beeld dat langer duurt, laat de run falen (taak 239).
const per = (soort) => tijden.filter((t) => t.soort === soort);
for (const soort of ["stil", "gebaar", "film"]) {
  const l = per(soort);
  if (!l.length) continue;
  const langst = l.reduce((a, b) => (b.sec > a.sec ? b : a));
  console.log(`${soort}: ${l.length} beelden, samen ${l.reduce((a, t) => a + t.sec, 0).toFixed(1)} s, langste ${langst.sec.toFixed(2)} s (${langst.label}, ${langst.maat})`);
}
const grens = Number(o.grens) || 0;
const traag = grens ? per("stil").filter((t) => t.sec > grens) : [];
if (traag.length) console.log(`TE TRAAG: ${traag.length} stilstaande beelden boven ${grens} s:\n${traag.map((t) => `  ${t.label} ${t.maat} ${t.sec.toFixed(2)} s`).join("\n")}`);
if (fouten.length) console.log(`MISLUKT: ${fouten.length} schermen (overgeslagen):\n${fouten.map((f) => `  ${f}`).join("\n")}`);
if (traag.length || fouten.length) process.exitCode = 1;
