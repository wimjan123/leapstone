// Taak 169: de indeling van het winstscherm en de lijstschermen op de tafel (uiterlijk 1b).
import { describe, expect, it, vi } from "vitest";

vi.mock("./wasm/halma_core.js", () => ({ Potje: class {} }));

import { tafelLijst, type TafelObject } from "./tafelblad";
import { codeInvullenTafel, foutTafel, herstelcodeTafel, lerenTafel, medailleStijl, naamTafel, winst, zoeken } from "./voorwerpen-lijsten";

describe("winstscherm", () => {
  it("zet de knoppen dichter bij het bord als er geen plaat met een lijst is", () => {
    const met = winst("nieuwPotje", true, true).find((v) => v.id === "hoofd")!;
    const zonder = winst("nieuwPotje", true, false).find((v) => v.id === "hoofd")!;
    expect(zonder.z).toBeLessThan(met.z - 4);
    expect(winst("nieuwPotje", true, false).some((v) => v.id === "lijst")).toBe(false);
  });

  it("legt de medaille zonder lijst vlak boven de knoppen, met lijst in het midden van de ruimte", () => {
    const top = (s: string) => Number(/top:([\d.]+)px/.exec(s)![1]);
    const hoogte = (s: string) => Number(/height:([\d.]+)px/.exec(s)![1]);
    const zonder = medailleStijl({ uitslag: { links: 0, rechts: 390, boven: 20, onder: 100 }, hoofd: { links: 0, rechts: 390, boven: 700, onder: 780 } });
    expect(top(zonder) + hoogte(zonder)).toBeLessThanOrEqual(700);
    expect(top(zonder) + hoogte(zonder)).toBeGreaterThan(660);
    const met = medailleStijl({ uitslag: { links: 0, rechts: 390, boven: 20, onder: 100 }, lijst: { links: 0, rechts: 390, boven: 500, onder: 780 }, hoofd: { links: 0, rechts: 390, boven: 790, onder: 830 } });
    expect(top(met)).toBe(104);
    expect(top(met) + hoogte(met)).toBe(496);
  });
});

describe("lijstschermen", () => {
  const onder: TafelObject[] = [{ id: "a", soort: "porselein", sleutel: "common.back", doe: () => {} }];

  it("laat tussen de kop en de plaat ruimte, zodat de plaat de titel niet verbergt", () => {
    const v = tafelLijst("common.back", onder);
    const titel = v.find((o) => o.id === "titel")!, plaat = v.find((o) => o.id === "plaat")!;
    const koprand = titel.z + titel.d / 2, plaatrand = plaat.z - plaat.d / 2;
    expect(plaatrand - koprand).toBeGreaterThanOrEqual(1);
  });
});

describe("Finding a player en het foutscherm (taak 225)", () => {
  it("heeft bij zoeken voor 2 Spelers Back en Find 4 players, en daarna alleen Back (Stop searching deed hetzelfde als Back)", () => {
    expect(zoeken(false).filter((v) => v.plaat && v.id !== "titel").map((v) => v.id)).toEqual(["terug", "meer"]);
    expect(zoeken(true).filter((v) => v.plaat && v.id !== "titel").map((v) => v.id)).toEqual(["terug"]);
  });

  it("legt een plaat voor de tekst onder het bord en de knoppen daaronder", () => {
    for (const v of [zoeken(false), foutTafel()]) {
      const lijst = v.find((o) => o.id === "lijst")!;
      for (const knop of v.filter((o) => o.plaat && o.id !== "titel")) expect(knop.z).toBeGreaterThan(lijst.z);
    }
    expect(foutTafel().map((v) => v.id)).toEqual(["lijst", "terug"]);
    // Met Try again (taak 234): een rode lakplaat rechts, Back blijft links.
    expect(foutTafel(true).map((v) => v.id)).toEqual(["lijst", "terug", "opnieuw"]);
  });
});

describe("Spelersnaam, Herstelcode en Learn to play (taak 226)", () => {
  it("heeft de knoppen die het platte scherm heeft, onder een plaat voor het veld", () => {
    const knoppen = (v: ReturnType<typeof naamTafel>) => v.filter((o) => o.plaat).map((o) => o.id);
    expect(knoppen(naamTafel())).toEqual(["terug", "verder"]);
    expect(knoppen(codeInvullenTafel())).toEqual(["terug", "verder"]);
    expect(knoppen(herstelcodeTafel())).toEqual(["verder"]);
    expect(knoppen(lerenTafel())).toEqual(["overslaan", "verder"]);
    for (const v of [naamTafel(), codeInvullenTafel(), herstelcodeTafel(), lerenTafel()]) {
      const lijst = v.find((o) => o.id === "lijst")!;
      for (const knop of v.filter((o) => o.plaat)) expect(knop.z).toBeGreaterThan(lijst.z);
    }
  });
});
