// De Ranglijst en het winstscherm als 3D-tafel (taak 180): de knoppen zijn voorwerpen met een onzichtbare HTML-knop erboven.
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/svelte";
import { readFileSync } from "node:fs";
import { afterEach, beforeAll, beforeEach, expect, test, vi } from "vitest";
import { initSync } from "./wasm/halma_core.js";
import FeestTafel from "./FeestTafel.svelte";
import Ranglijst from "./Ranglijst.svelte";
import { nep } from "./nep-bord3d";
import { zetTaal } from "./taal.svelte";
import { wachtkamer, winst } from "./voorwerpen-lijsten";

vi.mock("./bord3d", async () => (await import("./nep-bord3d")).nepModule());
vi.mock("./online", async (orig) => ({
  ...(await orig<typeof import("./online")>()),
  haalRanglijst: async () => [{ speler_id: 1, spelersnaam: "Mila", rating: 1042, gewonnen: 2, gespeeld: 3 }],
}));

beforeAll(() => initSync({ module: readFileSync("src/wasm/halma_core_bg.wasm") }));
beforeEach(() => nep.reset());
afterEach(async () => {
  cleanup();
  await zetTaal("en", false);
});

const knop = (id: string) => document.querySelector<HTMLButtonElement>(`.tafel-knop[data-voorwerp="${id}"]`)!;

test("Ranglijst: titel, lijst en de knop Back als voorwerp met HTML-knop", async () => {
  const terug = vi.fn();
  render(Ranglijst, { sleutel: "s", ikId: 1, terug, verlopen: () => {} });
  await waitFor(() => expect(document.querySelector(".tafel-knoppen")).not.toBeNull());
  expect(nep.platen.at(-1)?.ids).toEqual(["titel-ranglijst", null, "terug"]);
  expect(screen.getByRole("button", { name: "Back" }).textContent).toBe("Back");
  await fireEvent.click(knop("terug"));
  expect(terug).toHaveBeenCalledOnce();
});

test("winstscherm: hoofdknop en Back to start werken, en de lijst vervalt zonder inhoud", async () => {
  const hoofd = vi.fn(), start = vi.fn();
  render(FeestTafel, { stand: [], hoofd: { id: "opnieuw", tekst: "Play again", doe: hoofd }, start: { tekst: "Back to start", doe: start }, metLijst: false });
  await waitFor(() => expect(document.querySelector(".tafel-knoppen")).not.toBeNull());
  expect(nep.platen.at(-1)?.ids).toEqual([null, "opnieuw", "naar-start"]);
  await fireEvent.click(knop("hoofd"));
  await fireEvent.click(knop("start"));
  expect(hoofd).toHaveBeenCalledOnce();
  expect(start).toHaveBeenCalledOnce();
  expect(document.body.classList.contains("feest-tafel")).toBe(true);
});

test("de Wachtkamer heeft Invite alleen zolang er een plek open is", () => {
  expect(wachtkamer(false).map((v) => v.id)).toEqual(["titel", "lijst", "terug", "uitnodigen", "potjes"]);
  expect(wachtkamer(true).map((v) => v.id)).toEqual(["titel", "lijst", "terug", "potjes"]);
  expect(winst("mijnPotjes", true, true).map((v) => v.id)).toEqual(["uitslag", "lijst", "hoofd", "start"]);
});
