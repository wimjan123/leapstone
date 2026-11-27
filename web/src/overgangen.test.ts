// UI-overgangen: een schermwissel op de 3D-tafel is geen knip. Een nieuwe lijst voorwerpen gaat samen met zijn plaatjes naar Bevy
// (dan komen de voorwerpen er met hun plaatje omhoog), de knoppen vangen tot dan geen vingers, en tussen twee tafels op hetzelfde bord
// blijft de tafel in beeld in plaats van een plat scherm ertussen. Bevy is het nep-bord (jsdom kent geen WebGL).
import { cleanup, fireEvent, render, waitFor } from "@testing-library/svelte";
import { readFileSync } from "node:fs";
import { tick } from "svelte";
import { afterEach, beforeAll, beforeEach, expect, test, vi } from "vitest";
import { initSync } from "./wasm/halma_core.js";
import Ranglijst from "./Ranglijst.svelte";
import Startmenu from "./Startmenu.svelte";
import { laag } from "./bord3d";
import { nep } from "./nep-bord3d";
import { zetTaal } from "./taal.svelte";

vi.mock("./bord3d", async () => (await import("./nep-bord3d")).nepModule());
vi.mock("./online", async (orig) => ({
  ...(await orig<typeof import("./online")>()),
  haalRanglijst: async () => [{ speler_id: 1, spelersnaam: "Mila", rating: 1042, gewonnen: 2, gespeeld: 3 }],
}));

beforeAll(() => initSync({ module: readFileSync("src/wasm/halma_core_bg.wasm") }));
beforeEach(() => {
  nep.reset();
  localStorage.clear();
  laag().classList.remove("aan");
});
afterEach(async () => {
  cleanup();
  await zetTaal("en", false);
});

const knop = (id: string) => document.querySelector<HTMLButtonElement>(`.tafel-knop[data-voorwerp="${id}"]`)!;
const knoppenWachten = () => document.querySelector(".tafel-knoppen")!.classList.contains("wacht");

test("een nieuwe lijst gaat samen met zijn plaatjes naar Bevy, en de knoppen vangen pas vingers als hij er is", async () => {
  // Wat Bevy heeft op het moment dat het de lijst ophaalt (een beeld later; hier: de eerstvolgende microtaak).
  const plaatjesBijLijst: number[] = [];
  const zet = nep.zet_voorwerpen.bind(nep);
  nep.zet_voorwerpen = (lijst) => {
    zet(lijst);
    queueMicrotask(() => plaatjesBijLijst.push(Object.keys(nep.platenSpec).length));
  };
  render(Startmenu, { start: vi.fn(), online: vi.fn(), puzzel: vi.fn(), speluitleg: vi.fn() });
  await waitFor(() => expect(knop("spelen")).toBeTruthy());
  await waitFor(() => expect(knoppenWachten()).toBe(false));
  const lijsten = nep.voorwerpLijsten.length;

  let gebakken = () => {};
  nep.bakken = new Promise((klaar) => (gebakken = klaar));
  await fireEvent.click(knop("spelen"));
  await tick();
  // Bord kiezen: de knoppen staan er, maar de nieuwe lijst is nog onderweg (de plaatjes worden gebakken).
  expect(knop("ster")).toBeTruthy();
  expect(knoppenWachten()).toBe(true);
  expect(nep.voorwerpLijsten).toHaveLength(lijsten);

  gebakken();
  await waitFor(() => expect(knoppenWachten()).toBe(false));
  expect(nep.voorwerpLijsten).toHaveLength(lijsten + 1);
  // Elke lijst kwam met al zijn plaatjes tegelijk: Terug, de titel, Star board en Square board.
  expect(plaatjesBijLijst.at(-1)).toBe(4);
  expect(plaatjesBijLijst.every((n) => n > 0)).toBe(true);
});

test("tussen twee tafels op hetzelfde bord blijft de tafel in beeld, zonder plat scherm ertussen", async () => {
  nep.warm = true;
  render(Ranglijst, { sleutel: "s", ikId: 1, terug: () => {}, verlopen: () => {} });
  // Meteen bij het openen, nog voor de tafel van de Ranglijst klaar is: de laag met het bord staat aan, geen podium of balk.
  expect(laag().classList.contains("aan")).toBe(true);
  expect(document.querySelector(".podium, .balk")).toBeNull();
  await waitFor(() => expect(document.querySelector(".op-plaat")).not.toBeNull());
  expect(document.querySelector(".podium, .balk")).toBeNull();
});

test("komt de Speler niet van een tafel, dan staat de laadtafel er tot de tafel klaar is (taak 224, geen plat scherm)", async () => {
  render(Ranglijst, { sleutel: "s", ikId: 1, terug: () => {}, verlopen: () => {} });
  expect(laag().classList.contains("aan")).toBe(false);
  expect(document.querySelector(".laadtafel")).not.toBeNull();
  expect(document.querySelector(".balk")).toBeNull();
  await waitFor(() => expect(document.querySelector(".op-plaat")).not.toBeNull());
  expect(laag().classList.contains("aan")).toBe(true);
});
