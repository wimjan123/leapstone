// Schermen met een lijst op de 3D-tafel (taak 181): Terug, de knoppen en de naamplaat zijn voorwerpen met een onzichtbare
// HTML-knop erboven; de lijst blijft gewone HTML op de plaat. Bevy is hier het nep-bord (jsdom kent geen WebGL).
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/svelte";
import { readFileSync } from "node:fs";
import { afterEach, beforeAll, beforeEach, expect, test, vi } from "vitest";
import { initSync } from "./wasm/halma_core.js";
import MijnPotjes from "./MijnPotjes.svelte";
import { NepServer } from "./nep-server";
import { nep } from "./nep-bord3d";
import { zetTaal } from "./taal.svelte";
import { PLAAT_BREEDTE, tafelLijst, type TafelObject } from "./tafelblad";

vi.mock("./bord3d", async () => (await import("./nep-bord3d")).nepModule());

beforeAll(() => {
  initSync({ module: readFileSync("src/wasm/halma_core_bg.wasm") });
});
beforeEach(() => {
  nep.reset();
  localStorage.clear();
});
afterEach(async () => {
  cleanup();
  vi.unstubAllGlobals();
  await zetTaal("en", false);
});

const knop = (id: string): TafelObject => ({ id, soort: id === "nieuw" ? "rood" : "porselein", sleutel: "common.back", doe: () => {} });

test("de indeling: de naam bovenaan, de plaat in het midden, Back links in de onderste rij met de knoppen rechts ervan, alles binnen de plaat", () => {
  const lijst = tafelLijst("common.account", [knop("a"), knop("b"), knop("c"), knop("nieuw")]);
  const id = (i: string) => lijst.find((v) => v.id === i)!;
  expect(lijst.map((v) => v.id)).toEqual(["terug", "titel", "a", "b", "c", "nieuw", "plaat"]);
  expect(id("terug").x).toBeLessThan(0);
  expect(id("titel").x).toBe(0);
  expect(id("a").z).toBe(id("b").z);
  expect(id("nieuw").z).toBeGreaterThan(id("a").z);
  // Back ligt in de onderste rij, links van de andere knoppen van die rij.
  expect(id("terug").z).toBe(id("nieuw").z);
  expect(id("terug").x + id("terug").b / 2).toBeLessThan(id("nieuw").x - id("nieuw").b / 2);
  // De plaat tussen de kop en de eerste rij, zonder de voorwerpen te raken.
  const plaat = id("plaat");
  expect(plaat.z - plaat.d / 2).toBeGreaterThan(id("titel").z + id("titel").d / 2);
  expect(plaat.z + plaat.d / 2).toBeLessThan(id("a").z - id("a").d / 2);
  for (const v of lijst) expect(Math.abs(v.x) + v.b / 2).toBeLessThanOrEqual(PLAAT_BREEDTE / 2);
  // De plaat hangt boven de rand van het bord, zodat het bord er niet doorheen komt.
  expect(plaat.h).toBeGreaterThan(1);
});

test("Mijn potjes op de tafel: de knoppen zijn voorwerpen met een HTML-knop, de lijst ligt op de plaat", async () => {
  const server = new NepServer();
  const anna = server.voegSpelerToe("Anna");
  const ben = server.voegSpelerToe("Ben");
  server.maakPotje([anna.speler_id, ben.speler_id], 2);
  vi.stubGlobal("fetch", vi.fn((u: string, i?: RequestInit) => server.fetch(u, i)));
  const p = { terug: vi.fn(), nieuw: vi.fn(), ranglijst: vi.fn(), account: vi.fn(), vrienden: vi.fn(), open: vi.fn(), verlopen: vi.fn() };
  render(MijnPotjes, { sleutel: anna.sleutel, ikId: anna.speler_id, ...p });
  await waitFor(() => expect(document.querySelector(".tafel-knoppen")).not.toBeNull());
  await waitFor(() => expect(screen.getByRole("list", { name: /your turn|waiting/i })).toBeTruthy());

  // De voorwerpen en hun plaatjes in de taal van de Speler; de plaat zelf heeft geen plaatje.
  const ids = nep.platen.at(-1)!.ids;
  expect(ids).toEqual(["terug", "titel", "account", "vrienden", "ranglijst", "nieuw", null]);
  // Het platte scherm is weg (geen Balk), elke knop staat er één keer, met de tekst van het voorwerp.
  expect(document.querySelector(".balk")).toBeNull();
  expect(screen.getByRole("button", { name: "Back to start" }).textContent).toBe("Back");
  expect(screen.getAllByRole("button", { name: "New game" })).toHaveLength(1);
  for (const [naam, f] of [["New game", p.nieuw], ["Friends", p.vrienden], ["Account", p.account], ["Leaderboard", p.ranglijst], ["Back to start", p.terug]] as const) {
    await fireEvent.click(screen.getByRole("button", { name: naam }));
    expect(f).toHaveBeenCalledTimes(1);
  }
});

test("een Potje in de lijst openen blijft werken op de plaat", async () => {
  const server = new NepServer();
  const anna = server.voegSpelerToe("Anna");
  const ben = server.voegSpelerToe("Ben");
  const potje = server.maakPotje([anna.speler_id, ben.speler_id], 2);
  vi.stubGlobal("fetch", vi.fn((u: string, i?: RequestInit) => server.fetch(u, i)));
  const open = vi.fn();
  render(MijnPotjes, { sleutel: anna.sleutel, ikId: anna.speler_id, terug: () => {}, nieuw: () => {}, ranglijst: () => {}, account: () => {}, vrienden: () => {}, open, verlopen: () => {} });
  await waitFor(() => expect(screen.getByText("Ben")).toBeTruthy());
  await fireEvent.click(screen.getByText("Ben"));
  expect(open).toHaveBeenCalledWith(potje.potje_id);
});
