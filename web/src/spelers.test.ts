import { readFileSync } from "node:fs";
import { beforeAll, expect, test } from "vitest";
import { Potje, initSync } from "./wasm/halma_core.js";
import { beweging, bewegingDuur, HUP_MS, hupFrames, standVoorZet, STAP_MS } from "./spelers";

beforeAll(() => {
  initSync({ module: readFileSync("src/wasm/halma_core_bg.wasm") });
});

/** Een leeg Sterbord met stenen op de gegeven plekken (kolom, rij). */
function sterMet(stenen: [number, number, number][]) {
  const p = new Potje(2);
  const plekken = Array.from(p.vak_plekken());
  p.free();
  const vak = (q: number, r: number) => plekken.findIndex((_, i) => i % 2 === 0 && plekken[i] === q && plekken[i + 1] === r) / 2;
  const stand = Array(121).fill(-1);
  for (const [q, r, speler] of stenen) stand[vak(q, r)] = speler;
  return { plekken, stand, vak };
}

test("een Sprongketen hupt over elke steen: één hup per Sprong", () => {
  const { plekken, stand, vak } = sterMet([
    [0, 0, 0],
    [1, 0, 1],
    [3, 0, 1],
  ]);
  const b = beweging("ster", plekken, stand, vak(0, 0), vak(4, 0));
  expect(b.sprong).toBe(true);
  expect(b.naar).toBe(vak(4, 0));
  // Van het startvak via het tussenvak naar het eind, als afstand tot het eindvak.
  expect(b.pad).toEqual([
    { x: -4, y: 0 },
    { x: -2, y: 0 },
    { x: 0, y: 0 },
  ]);
  expect(bewegingDuur(b)).toBe(2 * HUP_MS);

  const f = hupFrames(b);
  const midden = f.knikker.find((k) => k.offset === 0.25)!;
  // Halverwege de eerste hup is de knikker boven de gesprongen steen, omhoog en groter.
  expect(midden.transform).toMatch(/^translate\(-3\.0\d+px, -0\.5\d*px\) scale\(1\.1/);
  expect(f.knikker.at(-1)).toMatchObject({ offset: 1, transform: "translate(0.000px, 0.000px) scale(1.000)" });
});

test("een stap glijdt in één korte boog", () => {
  const { plekken, stand, vak } = sterMet([[0, 0, 0]]);
  const b = beweging("ster", plekken, stand, vak(0, 0), vak(1, 0));
  expect(b.sprong).toBe(false);
  expect(b.pad).toHaveLength(2);
  expect(bewegingDuur(b)).toBe(STAP_MS);
});

test("de stand vóór de laatste Zet zet de steen terug", () => {
  expect(standVoorZet([-1, -1, 1], 0, 2)).toEqual([1, -1, -1]);
});
