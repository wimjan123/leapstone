// Taak 159: trillen bij Zetten en de beurt.
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import type { Gebeurtenis } from "./geluid";

let trilt: number[][];

async function laad() {
  vi.resetModules();
  const geluid = await import("./geluid");
  const trillen = await import("./trillen");
  return { ...geluid, ...trillen };
}

beforeEach(() => {
  trilt = [];
  localStorage.clear();
  vi.stubGlobal("navigator", { ...navigator, vibrate: (p: number[]) => (trilt.push(p), true) });
});
afterEach(() => {
  vi.unstubAllGlobals();
  Object.defineProperty(document, "visibilityState", { value: "visible", configurable: true });
});

const ALLE: Gebeurtenis[] = [
  { soort: "pak" },
  { soort: "stap" },
  { soort: "sprong", nummer: 0 },
  { soort: "sprong", nummer: 5 },
  { soort: "neer" },
  { soort: "terug" },
  { soort: "beurt" },
  { soort: "winst" },
];

test("elke gebeurtenis vraagt het juiste trilpatroon", async () => {
  const { meld } = await laad();
  const verwacht: [Gebeurtenis, number[] | null, boolean?][] = [
    [{ soort: "pak" }, [8]],
    [{ soort: "sprong", nummer: 3 }, [12]],
    [{ soort: "neer" }, [22]],
    [{ soort: "terug" }, [10, 60, 10]],
    [{ soort: "beurt" }, [60]],
    [{ soort: "winst" }, [15, 90, 15, 90, 25]],
  ];
  for (const [g, patroon] of verwacht) {
    trilt = [];
    meld(g);
    expect(trilt, g.soort).toEqual([patroon]);
  }
});

test("de tikken lopen op in sterkte: pak < neer < beurt, en terug is twee lichte tikken", async () => {
  const { trilling } = await laad();
  expect(trilling({ soort: "pak" })!.patroon[0]).toBeLessThan(trilling({ soort: "neer" })!.patroon[0]);
  expect(trilling({ soort: "neer" })!.patroon[0]).toBeLessThan(trilling({ soort: "beurt" })!.patroon[0]);
  expect(trilling({ soort: "terug" })!.tikken).toEqual(["licht", "licht"]);
  expect(trilling({ soort: "winst" })!.tikken).toHaveLength(3);
});

test("een eigen stap trilt niet dubbel; de stap van een tegenstander wel", async () => {
  const { meld } = await laad();
  meld({ soort: "stap" });
  expect(trilt).toEqual([]);
  meld({ soort: "stap" }, { tegenstander: true });
  expect(trilt).toEqual([[12]]);
});

test("geen patroon is langer dan 500 ms", async () => {
  const { trilling, MAX_TRIL_MS } = await laad();
  for (const g of ALLE) {
    const t = trilling(g, { tegenstander: true })!;
    expect(t.patroon.reduce((a, b) => a + b, 0), g.soort).toBeLessThanOrEqual(MAX_TRIL_MS);
  }
  expect(MAX_TRIL_MS).toBe(500);
});

test("Vibration uit trilt niets, ook na herladen", async () => {
  const eerste = await laad();
  expect(eerste.trillenAan()).toBe(true);
  eerste.zetTrillen(false);
  expect(localStorage.getItem("leapstone.trillen")).toBe("uit");
  for (const g of ALLE) eerste.meld(g, { tegenstander: true });
  expect(trilt).toEqual([]);
  // Herladen: de module begint opnieuw, de keuze staat nog in de opslag.
  const tweede = await laad();
  expect(tweede.trillenAan()).toBe(false);
  for (const g of ALLE) tweede.meld(g, { tegenstander: true });
  expect(trilt).toEqual([]);
  // Weer aan: het trilt weer.
  tweede.zetTrillen(true);
  tweede.meld({ soort: "neer" });
  expect(trilt).toEqual([[22]]);
});

test("Vibration staat los van Sound", async () => {
  const { zetGeluid, meld } = await laad();
  zetGeluid(false);
  meld({ soort: "neer" });
  expect(trilt).toEqual([[22]]);
});

test("geen trillen als de app op de achtergrond staat", async () => {
  const { meld } = await laad();
  Object.defineProperty(document, "visibilityState", { value: "hidden", configurable: true });
  for (const g of ALLE) meld(g, { tegenstander: true });
  expect(trilt).toEqual([]);
});

test("zonder trilmotor in de browser gebeurt er niets en gaat er niets stuk", async () => {
  vi.stubGlobal("navigator", { ...navigator, vibrate: undefined });
  const { meld } = await laad();
  expect(() => meld({ soort: "neer" })).not.toThrow();
});

test("een Steen oppakken en neerzetten op het bord meldt pak en neer; een Zet die niet mag meldt terug", async () => {
  const { opGebeurtenis } = await laad();
  const { voerUit } = await import("./tikken");
  const g: string[] = [];
  opGebeurtenis((e) => g.push(e.soort));
  voerUit({ soort: "kies", vak: 1 }, { optik: () => {}, gekozen: null });
  voerUit({ soort: "zet", vak: 2 }, { optik: () => {}, gekozen: 1 });
  voerUit({ soort: "zet", vak: 3 }, { optik: () => false, gekozen: 1 });
  expect(g).toEqual(["pak", "neer", "terug"]);
});
