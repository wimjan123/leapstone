// De keuzebalk van de keuzeschermen (William, 2026-11-12): een balk van zwart lak met een kopje en de keuzes als toetsen erop.
import { expect, test } from "vitest";
import { BALK_KOP } from "./knopplaten/plaat";
import { keuzeBalk } from "./keuzebalk";

const keuzes = [2, 3, 4, 6].map((n) => ({ id: `aantal${n}`, tekst: String(n), gekozen: n === 4 }));

test("de toetsen liggen op de balk, naast het kopje, even breed en zonder elkaar te raken", () => {
  const [balk, ...toetsen] = keuzeBalk("spelers", "choice.players", 12, keuzes);
  expect(balk.plaat).toMatchObject({ soort: "balk", sleutels: ["choice.players"], maat: { b: balk.b, d: balk.d } });
  expect(toetsen.map((t) => t.id)).toEqual(["aantal2", "aantal3", "aantal4", "aantal6"]);
  const links = balk.x - balk.b / 2, rechts = balk.x + balk.b / 2;
  for (const t of toetsen) {
    expect(t.x - t.b / 2).toBeGreaterThan(links + BALK_KOP);
    expect(t.x + t.b / 2).toBeLessThan(rechts);
    expect(Math.abs(t.z - balk.z) + t.d / 2).toBeLessThan(balk.d / 2);
    expect(t.h).toBeGreaterThan(balk.h);
    expect(t.b).toBeCloseTo(toetsen[0].b);
    expect(t.plaat?.maat).toEqual({ b: t.b, d: t.d });
  }
  for (let i = 1; i < toetsen.length; i++) expect(toetsen[i].x - toetsen[i].b / 2).toBeGreaterThan(toetsen[i - 1].x + toetsen[i - 1].b / 2);
});

test("alleen de gekozen toets heeft het plaatje toetsGekozen; elk plaatje draagt zijn tekst", () => {
  const toetsen = keuzeBalk("spelers", "choice.players", 12, keuzes).slice(1);
  expect(toetsen.map((t) => t.plaat?.soort)).toEqual(["toets", "toets", "toetsGekozen", "toets"]);
  expect(toetsen.map((t) => t.plaat?.teksten)).toEqual([["2"], ["3"], ["4"], ["6"]]);
});
