// Worst-case VOORBEELDGEGEVENS voor de nep-server (break-ui-ronde, 2026-11-16). Verzonnen Spelers, geen echte. Alleen in de dev-server
// (`/nep?data=...` en `npm --prefix web run schermen -- --data=...`), nooit in de build voor Spelers.
//
// Standen van `data`:
// - leeg: alleen jij, nergens iets in (lege Ranglijst, Vriendenlijst, Mijn potjes, Statistieken).
// - een: van alles precies één (één vriend, één Vriendverzoek, één Potje gewonnen, één geblokkeerde Speler): meervoud.
// - worst: dezelfde Potjes als de demo, maar elke naam is een echte worst case, plus volle lijsten met grote getallen.
// - duizend: als worst, plus 1.000 rijen in de Ranglijst, 1.000 afgelopen Snel potjes in Mijn potjes en 300 vrienden.
//
// Grenzen (uit de code): een Spelersnaam heeft 1 tot 30 tekens zonder controletekens (`schoon_naam` in halma-opslag), een Bericht 1
// tot 300 tekens (`MAX_BERICHT`), een Vriendcode 8 cijfers. De Ranglijst, de Vriendenlijst, Mijn potjes en de blokkadelijst hebben
// op de server geen grens.

/** Per rol de naam. De demo-namen zijn die van nep.js; `worst` zet op elke plek een andere worst case. */
export const NAMEN = {
  demo: { mila: "Mila", sam: "Sam", noor: "Noor", finn: "Finn", lena: "Lena", jules: "Jules", emre: "Emre", ada: "Ada", bo: "Bo", cas: "Cas", dex: "Dex", eli: "Eli", fay: "Fay", gus: "Gus" },
  worst: {
    // Jij: de langste naam (30 tekens) met spaties.
    mila: "Maximiliaan van Oldenbarnevelt",
    // 30 tekens zonder spatie: een gamernaam.
    sam: "xX_DragonSlayer_Supreme_2009_X",
    // Van rechts naar links.
    noor: "نور الهدى عبد الرحمن",
    // Eén teken.
    finn: "J",
    // Gestapelde Vietnamese accenten.
    lena: "Đặng Thị Ngọc Hân",
    // Emoji vooraan.
    jules: "🦊 Fox",
    // Wat de server toont na Delete account (VERWIJDERDE_SPELER), altijd in het Engels.
    emre: "Deleted player",
    // 30 tekens, koppelteken en accenten.
    ada: "Aleksandra Wiśniewska-Kowalska",
    // Thai met tekens boven en onder de regel.
    bo: "ณัฐพงษ์ ศรีสุวรรณ์",
    // Chinees, drie tekens.
    cas: "王秀英",
    // Emoji met ZWJ en huidskleur.
    dex: "👩🏽‍💻 Priya",
    // HTML in een naam (de server laat dit toe).
    eli: "<script>alert(1)</script>",
    // De breedste naam die de server toelaat.
    fay: "W".repeat(30),
    gus: "Seán O'Brien-Ó Súilleabháin",
  },
};
NAMEN.duizend = NAMEN.worst;

/** Echte naamvormen voor de lange lijsten (vrienden, Ranglijst, blokkades), allemaal 1 tot 30 tekens. */
const POOL = [
  "Konstantin Oberhauser-Wettlin", "María José de la Cruz y Ruiz", "Ólafur Darri Ólafsson", "Christopher Montgomery III",
  "Bartholomew Featherstonehaugh", "Jo", "高橋美智子", "김민준", "Αικατερίνη Παπαδοπούλου", "Анастасия Кузнецова-Петрова",
  "Nguyễn Thị Phương Thảo", "Siddharth Venkataraman", "dana", "Q", "ProGamerNL", "Leapstone_Master_2026",
  "Хрістіна", "Aino-Kaisa Hämäläinen", "Zoë", "Mohammed bin Rashid Al-Farsi", "יהונתן בן-דוד", "Ngozi Okonkwo-Adeyemi",
  "Björn Ødegård-Ångström", "😀😀😀", "Jean-Baptiste Lefèvre-Dubois", "TheQuickBrownFoxJumpsOverIt", "Ruth", "ສົມພອນ",
  "Ludwig van Hohenzollern", "Γιώργος", "Mei", "Pétur", "Ayşegül Yıldırım-Öztürk", "Wojciech Szczęsny-Brzęczyszczy",
];
export const poolNaam = (i) => (i < POOL.length ? POOL[i] : `${POOL[i % POOL.length]}`.slice(0, 26) + ` ${Math.floor(i / POOL.length) + 1}`).slice(0, 30);

/** Een Bericht van 300 tekens zonder spatie, een lang adres, gewone lange tekst, emoji, RTL en HTML. */
export const WORST_BERICHTEN = [
  [2, "ha".repeat(150)],
  [3, "ตาดีมาก! เกือบชนะแล้ว 555555"],
  [1, "Sorry for the slow moves, I'm on the train and the connection keeps dropping every time we go through a tunnel. If I time out it's not on purpose! Also that jump chain you did three turns ago was ridiculous, I didn't even see it coming. Good game so far, let's see if I can still catch up with you two."],
  [2, "https://example.com/leapstone/replays/2026/11/16/game-104857?move=37&player=2&share=why-this-jump"],
  [3, "🔥🔥🔥👏👏"],
  [2, "مرحبا! حظا سعيدا للجميع"],
  [3, "<b>gg</b> &amp; **wp**"],
];

/** Een rij van de Ranglijst. */
const rij = (speler_id, spelersnaam, rating, gespeeld, gewonnen) => ({ speler_id, spelersnaam, rating, gespeeld, gewonnen });

/**
 * Een lange Ranglijst met `n` rijen (zoals `/api/ranglijst`): hoogste Rating eerst. Jij (`ik`) staat ergens in het midden; de
 * andere worst-case namen staan bovenaan, zodat ze in beeld zijn.
 */
export function ranglijst(ik, rollen, n) {
  const boven = [
    rij(rollen.sam.speler_id, rollen.sam.spelersnaam, 2417, 2093, 1284),
    rij(rollen.ada.speler_id, rollen.ada.spelersnaam, 2381, 187, 99),
    rij(rollen.fay.speler_id, rollen.fay.spelersnaam, 2203, 1, 1),
    rij(rollen.noor.speler_id, rollen.noor.spelersnaam, 2003, 412, 211),
    rij(rollen.finn.speler_id, rollen.finn.spelersnaam, 1999, 0 + 1, 0),
    rij(rollen.jules.speler_id, rollen.jules.spelersnaam, 1874, 64, 30),
    rij(rollen.bo.speler_id, rollen.bo.spelersnaam, 1802, 33, 17),
    rij(rollen.lena.speler_id, rollen.lena.spelersnaam, 1777, 950, 470),
    rij(rollen.emre.speler_id, rollen.emre.spelersnaam, 1650, 12, 3),
    rij(rollen.dex.speler_id, rollen.dex.spelersnaam, 1600, 77, 41),
  ];
  const lijst = [...boven];
  let rating = 1590;
  for (let i = 0; lijst.length < n - 1; i++) {
    rating -= (i * 7) % 5;
    lijst.push(rij(100000 + i, poolNaam(i), Math.max(100, rating), 20 + ((i * 37) % 900), 5 + ((i * 13) % 20)));
  }
  // Jij op plek 37 (of de laatste), met de langste naam en vier cijfers.
  lijst.splice(Math.min(36, lijst.length), 0, rij(ik.speler_id, ik.spelersnaam, 1874, 1284, 642));
  return lijst.slice(0, n);
}

/** De Statistieken van een Speler met honderden Potjes (zoals `/api/statistieken`). */
export function statistiekenWorst(rollen) {
  const verloop = Array.from({ length: 50 }, (_, i) => Math.round(1712 + 669 * (i / 49) + (i % 7 === 3 ? -180 : (i * 53) % 61)));
  return {
    gespeeld: 2093,
    gewonnen: 1284,
    verloren: 809,
    deel_gewonnen: 1284 / 2093,
    gemiddelde_plek: 1.8734,
    rating_verloop: verloop,
    langste_sprong: { potje_id: 104857, waarde: 14, tegenstanders: ["ada", "bo", "fay", "sam", "gus"].map((r) => rollen[r].spelersnaam) },
    snelste_overwinning: { potje_id: 98231, waarde: 31, tegenstanders: [rollen.sam.spelersnaam] },
  };
}

/** Eén van alles: één Potje gespeeld en gewonnen, een Sprong van 1, één Ratingpunt. */
export function statistiekenEen(rollen) {
  return {
    gespeeld: 1,
    gewonnen: 1,
    verloren: 0,
    deel_gewonnen: 1,
    gemiddelde_plek: 1,
    rating_verloop: [1016],
    langste_sprong: { potje_id: 3, waarde: 1, tegenstanders: [rollen.sam.spelersnaam] },
    snelste_overwinning: { potje_id: 3, waarde: 1, tegenstanders: [rollen.sam.spelersnaam] },
  };
}

/** Alle tien Prestaties behaald (de datum van elk een andere maand), zoals `/api/prestaties`. */
export const prestatiesAlle = () =>
  ["first_win", "wins_10", "wins_50", "wins_100", "jumps_6", "jumps_10", "square_win", "six_players_win", "puzzle_streak_7", "five_friends"].map((id, i) => ({
    id,
    behaald_ms: Date.UTC(2025, 11 - i, 28 - i, 23, 30),
  }));
