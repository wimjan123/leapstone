// Taak 236: op een breed scherm liggen het Potje, de keuzeschermen en de lijsten met het bord links en de rest als kolom rechts.
import { readFileSync } from "node:fs";
import { beforeAll, describe, expect, it } from "vitest";
import { initSync } from "./wasm/halma_core.js";

import { BORD_DIEP, BORD_ZIJ, KOLOM_LUCHT, naarKolom } from "./kolom";
import { breedKeuze, computerKeuze, onlineKeuze, bordKeuze } from "./keuzetafel";
import { tafelLijst, type TafelObject } from "./tafelblad";
import { breedLijst, foutTafel, medailleStijl, MEDAILLE_RUIMTE, RANGLIJST, wachtkamer, winst, zoeken } from "./voorwerpen-lijsten";
import { jadePlek, potjeVoorwerpen, type PotjeOpties, type Voorwerp } from "./voorwerpen";

beforeAll(() => {
  initSync({ module: readFileSync("src/wasm/halma_core_bg.wasm") });
});

const raakt = (a: Voorwerp, b: Voorwerp) => Math.abs(a.x - b.x) < (a.b + b.b) / 2 - 1e-6 && Math.abs(a.z - b.z) < (a.d + b.d) / 2 - 1e-6;
const links = (v: Voorwerp) => v.x - v.b / 2;
const boven = (v: Voorwerp) => v.z - v.d / 2;
const onder = (v: Voorwerp) => v.z + v.d / 2;

/** Alles in de kolom ligt rechts van het bord, met lucht ertussen. */
function rechtsVanBord(lijst: readonly Voorwerp[], vierkant = false) {
  for (const v of lijst) expect(links(v)).toBeGreaterThanOrEqual((vierkant ? BORD_ZIJ.vierkant : BORD_ZIJ.ster) + KOLOM_LUCHT - 1e-6);
}

/** Geen twee voorwerpen van de kolom overlappen, behalve een toets op zijn eigen keuzebalk of een knop op het blad. */
function losVanElkaar(lijst: readonly Voorwerp[]) {
  const onderlaag = (v: Voorwerp) => v.soort === "blad" || v.plaat?.soort === "balk";
  for (const a of lijst) for (const b of lijst) if (a !== b && !onderlaag(a) && !onderlaag(b)) expect(raakt(a, b), `${a.id} raakt ${b.id}`).toBe(false);
}

describe("naarKolom", () => {
  const telefoon: Voorwerp[] = [
    { id: "titel", soort: "naamplaat", x: 0, z: -12, b: 6, d: 2, h: 0.4 },
    { id: "lijst", soort: "porselein", x: 0, z: 15, b: 14, d: 11, h: 0.5 },
    { id: "terug", soort: "porselein", x: -5.8, z: 23, b: 4, d: 2.75, h: 0.5 },
    { id: "ok", soort: "rood", x: 3, z: 23, b: 6, d: 2.7, h: 0.6 },
  ];

  it("legt dezelfde voorwerpen in dezelfde volgorde rechts van het bord, van boven naar onder", () => {
    const k = naarKolom(telefoon, { rekbaar: "lijst" });
    expect(k.map((v) => v.id)).toEqual(telefoon.map((v) => v.id));
    rechtsVanBord(k);
    losVanElkaar(k);
    const [titel, lijst, terug, ok] = k;
    expect(onder(titel)).toBeLessThan(boven(lijst));
    expect(onder(lijst)).toBeLessThan(boven(terug));
    // Een rij blijft een rij, met dezelfde plekken in x ten opzichte van elkaar.
    expect(terug.z).toBeCloseTo(ok.z - 0.025 + 0.025, 1);
    expect(ok.x - terug.x).toBeCloseTo(3 + 5.8, 5);
  });

  it("rekt de plaat met de lijst tot de kolom zo hoog is als het bord", () => {
    const k = naarKolom(telefoon, { rekbaar: "lijst" });
    expect(Math.min(...k.map(boven))).toBeCloseTo(-BORD_DIEP.ster, 5);
    expect(Math.max(...k.map(onder))).toBeCloseTo(BORD_DIEP.ster, 1);
  });

  it("zet een kolom zonder rekbare plaat in het midden van de hoogte", () => {
    const k = naarKolom(telefoon);
    expect(Math.min(...k.map(boven)) + Math.max(...k.map(onder))).toBeCloseTo(0, 5);
    expect(k[1].d).toBe(11);
  });

  it("laat voorwerpen die bij het bord horen liggen", () => {
    const naam: Voorwerp = { id: "plek0", soort: "naamplaat", x: -5, z: -10.5, b: 4.6, d: 2.3, h: 0.36, vast: true };
    const k = naarKolom([...telefoon, naam]);
    expect(k[4]).toEqual(naam);
  });
});

describe("lijsten op een breed scherm", () => {
  const onderKnoppen: TafelObject[] = [
    { id: "account", soort: "porselein", sleutel: "common.account", doe: () => {} },
    { id: "vrienden", soort: "porselein", sleutel: "menu.friends", doe: () => {} },
    { id: "nieuw", soort: "rood", sleutel: "common.newGame", doe: () => {} },
  ];

  it.each([
    ["Mijn potjes", tafelLijst("common.myGames", onderKnoppen, true)],
    ["Ranglijst", breedLijst(RANGLIJST, true)],
    ["Wachtkamer", breedLijst(wachtkamer(false), true)],
    ["Finding a player", breedLijst(zoeken(false), true, { rek: false })],
    ["foutscherm", breedLijst(foutTafel(true), true, { rek: false })],
    ["winstscherm", breedLijst(winst("opnieuw", true, true), true, { ruimte: { uitslag: MEDAILLE_RUIMTE } })],
  ])("%s ligt als kolom naast het bord", (_, lijst) => {
    rechtsVanBord(lijst);
    losVanElkaar(lijst);
    // Niet hoger dan het bord (met een kleine marge): het bord blijft zo groot als de hoogte toelaat.
    expect(Math.max(...lijst.map(onder)) - Math.min(...lijst.map(boven))).toBeLessThanOrEqual(2 * BORD_DIEP.ster + 1);
  });

  it("op een telefoon verandert er niets", () => {
    expect(breedLijst(RANGLIJST, false)).toBe(RANGLIJST);
    expect(tafelLijst("common.myGames", onderKnoppen, false)).toEqual(tafelLijst("common.myGames", onderKnoppen));
  });

  it("houdt op het winstscherm ruimte voor de medaille, en legt die boven de kolom", () => {
    const lijst = breedLijst(winst("opnieuw", true, true), true, { ruimte: { uitslag: MEDAILLE_RUIMTE } });
    const uitslag = lijst.find((v) => v.id === "uitslag")!, plaat = lijst.find((v) => v.id === "lijst")!;
    expect(boven(plaat) - onder(uitslag)).toBeGreaterThanOrEqual(MEDAILLE_RUIMTE);
    const stijl = medailleStijl({ uitslag: { links: 1100, rechts: 1700, boven: 50, onder: 150 }, lijst: { links: 1080, rechts: 1720, boven: 330, onder: 900 } }, true);
    expect(stijl).toContain("left:1100px");
    expect(stijl).toContain("width:600px");
  });
});

describe("keuzeschermen op een breed scherm", () => {
  const namen = { ster: "Star board", vierkant: "Square board" };

  it("Computer en nieuw online Potje: de kolom verspringt niet als het bord wisselt", () => {
    const c = (vorm: "ster" | "vierkant") =>
      breedKeuze(computerKeuze({ namen, vorm, tegenstanders: [1, 2, 3], tegen: 1, niveaus: ["Easy", "Normal", "Hard"], niveau: 0 }), true, true);
    rechtsVanBord(c("ster"), true);
    losVanElkaar(c("ster"));
    expect(c("vierkant").map((v) => [v.x, v.z])).toEqual(c("ster").map((v) => [v.x, v.z]));
    const o = breedKeuze(onlineKeuze({ namen, vorm: "ster", aantallen: [2, 3, 4, 6], aantal: 2, denktijden: ["15s", "30s", "off"], denktijd: 1 }), true, true);
    rechtsVanBord(o, true);
    losVanElkaar(o);
  });

  it("Bord kiezen ligt naast het Vierkant bord", () => {
    const b = breedKeuze(bordKeuze(namen), true, true);
    rechtsVanBord(b, true);
    losVanElkaar(b);
  });
});

describe("het Potje op een breed scherm", () => {
  const opties = (n: number, breed?: PotjeOpties["breed"]): PotjeOpties => ({
    spelers: Array.from({ length: n }, (_, i) => ({ speler: i, naam: `Player ${i + 1}` })),
    knoppen: ["potjes", "opgeven", "klaar"],
    beurt: "Your turn",
    zonderKom: true,
    breed,
  });

  it.each([2, 3, 4, 6])("legt bij %i Spelers naamplaten, aanwijzer, Chat en knoppen als kolom rechts van het bord", (n) => {
    for (const vierkant of [false, true]) {
      const v = potjeVoorwerpen(opties(n, { vierkant, chat: true }));
      const kolom = v.filter((x) => x.soort !== "zegel" && x.soort !== "kom");
      rechtsVanBord(kolom, vierkant);
      losVanElkaar(kolom);
      // Van boven naar onder: naamplaten, de jade aanwijzer, de Chat, het blad.
      const naam = Math.max(...v.filter((x) => x.soort === "naamplaat").map(onder));
      const jade = v.find((x) => x.id === "beurt")!, chat = v.find((x) => x.id === "chat")!, blad = v.find((x) => x.id === "blad")!;
      expect(naam).toBeLessThan(boven(jade));
      expect(onder(jade)).toBeLessThan(boven(chat));
      expect(onder(chat)).toBeLessThan(boven(blad));
      // Binnen de hoogte van het bord, met onder het blad ruimte voor de aanwijzer als hij ingezoomd daar gaat liggen.
      const diep = vierkant ? BORD_DIEP.vierkant : BORD_DIEP.ster;
      expect(Math.min(...kolom.map(boven))).toBeGreaterThanOrEqual(-diep - 1e-6);
      expect(onder(blad) + 0.2 + jade.d).toBeLessThanOrEqual(diep + 1e-6);
      // De aanwijzer ligt onder de naamplaat van wie aan de beurt is.
      for (let i = 0; i < n; i++) {
        const plaat = v.find((x) => x.id === `speler${i}`)!;
        const p = jadePlek(i, n, { vierkant, chat: true });
        expect(Math.abs(p.x - plaat.x)).toBeLessThan(plaat.b / 2 + 1e-6);
        expect(p.z).toBe(jade.z);
      }
    }
  });

  it("zonder Chat staat de kolom in het midden; dezelfde voorwerpen als op de telefoon", () => {
    const telefoon = potjeVoorwerpen({ ...opties(3), zonderKom: false });
    const breed = potjeVoorwerpen({ ...opties(3, { vierkant: false, chat: false }), zonderKom: false });
    expect(breed.map((v) => v.id)).toEqual(telefoon.map((v) => v.id));
    const kolom = breed.filter((x) => x.soort !== "zegel" && x.soort !== "kom");
    // Onder het blad blijft ruimte voor de aanwijzer (ingezoomd): die telt mee.
    const jade = breed.find((x) => x.id === "beurt")!;
    expect(Math.min(...kolom.map(boven)) + Math.max(...kolom.map(onder)) + jade.d + 0.2).toBeCloseTo(0, 5);
    // Naast het Vierkant bord is geen plek voor zegel en kom.
    expect(potjeVoorwerpen({ ...opties(3, { vierkant: true, chat: false }), zonderKom: false }).some((v) => v.soort === "zegel" || v.soort === "kom")).toBe(false);
  });
});
