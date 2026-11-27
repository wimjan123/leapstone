// De plaatjes van de keuzebalk (William, 2026-11-12): de balk met het kopje, en de toetsen gekozen en niet gekozen.
import { beforeAll, describe, expect, it } from "vitest";
import { bakPlaatKlaar, laadLetters, laadTabel, ontbrekendeTekens, type Plaat } from "./index";
import { KEUZEBALK_SLEUTELS } from "./knoppen";
import { BALK_KOP } from "./plaat";
import { TALEN } from "../talen/register";
import { zetNodeOmgeving } from "./testhulp";

const TALEN_CODES = Object.keys(TALEN);

beforeAll(() => zetNodeOmgeving());

/** Waar twee platen van elkaar verschillen (beeldpunten): de tekst. */
function verschil(a: Plaat, b: Plaat, drempel = 10) {
  let x0 = Infinity, x1 = -1;
  for (let y = 0; y < a.hoogte; y++) for (let x = 0; x < a.breedte; x++) {
    const i = (y * a.breedte + x) * 4;
    const d = Math.abs(a.beeldpunten[i] - b.beeldpunten[i]) + Math.abs(a.beeldpunten[i + 1] - b.beeldpunten[i + 1]) + Math.abs(a.beeldpunten[i + 2] - b.beeldpunten[i + 2]);
    if (d > drempel) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); }
  }
  return { x0, x1 };
}

describe("de keuzebalk van de keuzeschermen (William, 2026-11-12)", () => {
  const BALK = { b: 14, d: 2.4 };
  it("het kopje past in elke taal in de kolom aan de beginkant, leesbaar, met elk teken in het lettertype", async () => {
    for (const taal of TALEN_CODES) {
      await laadLetters(taal);
      const tabel = await laadTabel(taal);
      for (const sleutel of KEUZEBALK_SLEUTELS) {
        const tekst = tabel[sleutel];
        const wie = `${taal} ${sleutel} "${tekst}"`;
        expect(ontbrekendeTekens(taal, tekst), wie).toEqual([]);
        const invoer = { soort: "balk" as const, taal, teksten: [tekst], id: "balk", maat: BALK };
        const met = bakPlaatKlaar(invoer), zonder = bakPlaatKlaar({ ...invoer, zonderTekst: true });
        const s = met.schaal, rtl = met.rtl;
        const v = verschil(met, zonder);
        // De letters liggen binnen het kopje: links (rechts bij een taal van rechts naar links), niet onder de toetsen.
        if (rtl) expect(v.x0, wie).toBeGreaterThan((BALK.b - BALK_KOP) * s);
        else expect(v.x1, wie).toBeLessThan(BALK_KOP * s);
        expect(met.teksten[0].regels.length, wie).toBeLessThanOrEqual(2);
        expect(met.teksten[0].grootte * 100, wie).toBeGreaterThanOrEqual(25);
      }
    }
  }, 120000);

  it("een gekozen toets is donker (kobaltblauw) met lichte letters, een andere licht met donkere letters", async () => {
    await laadLetters("en");
    const gem = (p: Plaat) => {
      let som = 0;
      for (let i = 0; i < p.beeldpunten.length; i += 4) som += p.beeldpunten[i] + p.beeldpunten[i + 1] + p.beeldpunten[i + 2];
      return som / (p.beeldpunten.length / 4) / 3;
    };
    const maat = { b: 2.7, d: 1.9 };
    const aan = bakPlaatKlaar({ soort: "toetsGekozen", taal: "en", teksten: ["4"], id: "t", maat });
    const uit = bakPlaatKlaar({ soort: "toets", taal: "en", teksten: ["4"], id: "t", maat });
    expect(gem(aan)).toBeLessThan(110);
    expect(gem(uit)).toBeGreaterThan(190);
    // De letters: lichter dan de grond bij gekozen, donkerder bij niet gekozen.
    const aanZonder = bakPlaatKlaar({ soort: "toetsGekozen", taal: "en", teksten: ["4"], id: "t", maat, zonderTekst: true });
    const uitZonder = bakPlaatKlaar({ soort: "toets", taal: "en", teksten: ["4"], id: "t", maat, zonderTekst: true });
    expect(gem(aan)).toBeGreaterThan(gem(aanZonder));
    expect(gem(uit)).toBeLessThan(gem(uitZonder));
  });
});
