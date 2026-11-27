import { readFileSync } from "node:fs";
import { beforeAll, expect, test } from "vitest";
import { initSync } from "./wasm/halma_core.js";
import { bordje } from "./bordje";

beforeAll(() => {
  initSync({ module: readFileSync("src/wasm/halma_core_bg.wasm") });
});

test.each([
  ["ster", 2, 121, 20],
  ["ster", 3, 121, 30],
  ["ster", 6, 121, 60],
  ["vierkant", 2, 256, 38],
  ["vierkant", 4, 256, 52],
] as const)("%s met %i spelers: alle gaatjes, de stenen bij het begin, en Speler 1 onderaan", (vorm, aantal, gaten, stenen) => {
  const b = bordje(vorm, aantal);
  expect(b.gaten).toHaveLength(gaten);
  expect(b.stenen).toHaveLength(stenen);
  expect(b.plekken).toHaveLength(aantal);
  // Speler 1 zit onder het midden, zoals het spel kijkt; elke plek ligt binnen het kader.
  expect(b.plekken[0].y).toBeGreaterThan(b.midden.y + 3);
  for (const p of b.plekken) {
    expect(p.x).toBeGreaterThan(b.kader.x);
    expect(p.x).toBeLessThan(b.kader.x + b.kader.b);
    expect(p.y).toBeGreaterThan(b.kader.y);
    expect(p.y).toBeLessThan(b.kader.y + b.kader.h);
  }
});
