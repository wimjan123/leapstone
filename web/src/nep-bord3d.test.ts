import { readFileSync } from "node:fs";
import { beforeAll, expect, test } from "vitest";
import { NepBord, naarScherm } from "./nep-bord3d";
import { TIK_PX } from "./tikken";
import { Potje, initSync } from "./wasm/halma_core.js";

// Het nep-bord moet een tik op een Steen net zo lezen als het echte bord (`kies.rs`): pakken mag op de rand, geraakt pas
// ruim binnen de rand. Zonder dat verschil bewijzen tests van de app iets wat het echte bord niet doet.
let bord: NepBord;
let plekken: number[];
let eigen: number;
beforeAll(() => {
  initSync({ module: readFileSync("src/wasm/halma_core_bg.wasm") });
  const potje = new Potje(2);
  plekken = Array.from(potje.vak_plekken());
  bord = new NepBord();
  bord.zet_stand(potje.stand());
  eigen = Array.from(potje.stand()).findIndex((s) => s === 0);
});

/** `wijs` voor een tik `dx` vakken naast het midden van de eigen Steen: [eigen, geraakt]. */
function tikNaast(dx: number) {
  const p = naarScherm("ster", plekken, eigen, dx, 0);
  const w = bord.wijs(p.x, p.y, 0, TIK_PX);
  return [w[2], w[3]];
}

test("een tik midden op een eigen Steen pakt hem en raakt hem", () => {
  expect(tikNaast(0.05)).toEqual([eigen, eigen]);
});

test("een tik op de rand van een eigen Steen pakt hem maar raakt hem niet", () => {
  // Net binnen de rand: te dicht bij de rand om te raken (minder dan 0,4 van de straal erin).
  expect(tikNaast(0.38)).toEqual([eigen, -1]);
  // Een stukje buiten de rand: nog binnen de marge van een dikke vinger.
  expect(tikNaast(0.45)).toEqual([eigen, -1]);
});
