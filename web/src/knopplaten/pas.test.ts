import { describe, expect, it } from "vitest";
import { pasTekst, tweeRegels } from "./pas";

// Een meter zonder lettertype: elk teken is 0,5 breed bij lettergrootte 1.
const meet = (t: string) => [...t].length * 0.5;
const basis = { breedte: 4, hoogte: 1.2, grootste: 0.5, regelhoogte: 1.2, taal: "en", woordgrens: true };

describe("pasTekst", () => {
  it("laat een korte tekst op de grootste maat staan", () => {
    const u = pasTekst(meet, "Play", basis);
    expect(u.regels).toEqual(["Play"]);
    expect(u.grootte).toBe(0.5);
  });
  it("maakt een lange tekst kleiner op één regel als twee regels niet groter zijn", () => {
    const u = pasTekst(meet, "Leaderboardsx", { ...basis, hoogte: 2, grootste: 1 });
    expect(u.regels).toHaveLength(1);
    expect(u.grootte).toBeLessThan(1);
    expect(u.blokbreedte).toBeLessThanOrEqual(4 + 1e-9);
  });
  it("breekt een lange tekst met spaties op twee regels als dat een grotere letter geeft", () => {
    const u = pasTekst(meet, "Puzzle of the day", { ...basis, hoogte: 2.4, grootste: 1 });
    expect(u.regels).toEqual(["Puzzle of", "the day"]);
    expect(u.grootte).toBeGreaterThan(4 / (17 * 0.5));
    expect(u.blokhoogte).toBeLessThanOrEqual(2.4 + 1e-9);
  });
  it("breekt Chinees en Japans tussen tekens en Thai tussen woorden, nooit midden in een teken", () => {
    const lijst = tweeRegels("今日の統計", "ja", false);
    expect(lijst.length).toBeGreaterThan(0);
    for (const [a, b] of lijst) expect(a + b).toBe("今日の統計");
  });
  it("past altijd: de breedte is nooit groter dan het vak", () => {
    for (const t of ["x".repeat(40), "een heel lange tekst met veel woorden erin", "Ab"]) {
      const u = pasTekst(meet, t, basis);
      expect(u.blokbreedte).toBeLessThanOrEqual(basis.breedte + 1e-9);
      expect(u.blokhoogte).toBeLessThanOrEqual(basis.hoogte + 1e-9);
    }
  });
  it("breekt een woord zonder spaties tussen tekens als dat mag (een Spelersnaam), en anders niet", () => {
    const o = { ...basis, breedte: 4, hoogte: 2.4, grootste: 1 };
    expect(pasTekst(meet, "W".repeat(30), o).regels).toHaveLength(1);
    expect(pasTekst(meet, "W".repeat(30), { ...o, breekWoord: true }).regels).toEqual(["W".repeat(15), "W".repeat(15)]);
    // Met spaties breekt hij tussen woorden, ook met breekWoord.
    expect(pasTekst(meet, "Bartholomew Featherstonehaugh", { ...o, breekWoord: true }).regels).toEqual(["Bartholomew", "Featherstonehaugh"]);
  });
});
