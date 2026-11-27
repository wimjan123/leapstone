// Taak 227 (feature 220): een nieuw online Potje kiezen aan de tafel. Bord, aantal Spelers en Denktijd zijn keuzebalken onder het
// bord (zoals Computer); dezelfde keuzes geven hetzelfde Potje als het platte scherm. Bevy is hier het nep-bord.
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/svelte";
import { readFileSync } from "node:fs";
import { afterEach, beforeAll, beforeEach, expect, test, vi } from "vitest";
import { initSync } from "./wasm/halma_core.js";
import App from "./App.svelte";
import { nep } from "./nep-bord3d";
import { NepServer } from "./nep-server";
import { onlineKeuze } from "./keuzetafel";
import { BALK_D } from "./keuzebalk";

vi.mock("./bord3d", async () => (await import("./nep-bord3d")).nepModule());

beforeAll(() => initSync({ module: readFileSync("src/wasm/halma_core_bg.wasm") }));

let server: NepServer;
beforeEach(() => {
  nep.reset();
  server = new NepServer();
  localStorage.clear();
  localStorage.setItem("leapstone.leren.gevraagd", "1");
  history.replaceState(null, "", "/");
  vi.stubGlobal("fetch", vi.fn((u: string, i?: RequestInit) => server.fetch(u, i)));
  vi.stubGlobal("WebSocket", server.WebSocket);
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

const knop = (naam: string | RegExp) => screen.getByRole("button", { name: naam });
const keuze = (naam: string | RegExp) => screen.getByRole("radio", { name: naam });
async function tik(k: HTMLElement) {
  await fireEvent.pointerDown(k);
  await fireEvent.pointerUp(k);
  await fireEvent.click(k, { detail: 1 });
}
// Het nep-bord legt de voorwerpen 50 px onder elkaar: bij zoveel voorwerpen valt Start buiten het nep-scherm (display: none), dus de knop zelf.
const start = () => document.querySelector<HTMLButtonElement>('[data-voorwerp="start"]')!;
const spelersOpBord = () => [...new Set(nep.stand.filter((s) => s >= 0))].length;

async function naarKeuze() {
  const anna = server.voegSpelerToe("Anna");
  localStorage.setItem("halma.speler", JSON.stringify({ speler_id: anna.speler_id, spelersnaam: "Anna", sleutel: anna.sleutel }));
  render(App);
  await fireEvent.click(await screen.findByRole("button", { name: "My games" }));
  await tik(await screen.findByRole("button", { name: "New game" }));
  await waitFor(() => expect(screen.getByRole("radio", { name: "Star board" })).toBeTruthy());
}

test("nieuw online Potje: de keuzes zijn een tafel met het bord, en er is geen plat keuzescherm", async () => {
  await naarKeuze();
  expect(document.querySelector(".scherm-keuze .blad")).toBeNull();
  expect(document.querySelector(".scherm-keuze .bord-keuze")).toBeNull();
  expect(nep.borden.at(-1)?.vierkant).toBe(false);
  expect(keuze("Star board").getAttribute("aria-checked")).toBe("true");
  expect(keuze("2 players").getAttribute("aria-checked")).toBe("true");
  expect(keuze("30 seconds per move").getAttribute("aria-checked")).toBe("true");
});

test("dezelfde keuzes geven hetzelfde Potje: Vierkant bord, 4 Spelers, 1 minuut", async () => {
  await naarKeuze();
  await tik(keuze("Square board"));
  expect(nep.borden.at(-1)?.vierkant).toBe(true);
  expect(screen.queryByRole("radio", { name: "3 players" })).toBeNull();
  await tik(keuze("4 players"));
  expect(spelersOpBord()).toBe(4);
  await tik(keuze("1 minute per move"));
  await tik(start());
  await screen.findByText("3 seats still open");
  expect(server.potjes[0].bord).toBe("vierkant");
  expect(server.potjes[0].aantal_spelers).toBe(4);
  expect(server.potjes[0].denktijd_s).toBe(60);
});

test("zonder wijzigingen: Sterbord, 2 Spelers en de standaard Denktijd van 30 seconden", async () => {
  await naarKeuze();
  await tik(start());
  await screen.findByText("1 seat still open");
  expect(server.potjes[0].bord).toBe("ster");
  expect(server.potjes[0].aantal_spelers).toBe(2);
  expect(server.potjes[0].denktijd_s).toBe(30);
});

test("de Denktijd kan uit: geen grens", async () => {
  await naarKeuze();
  await tik(keuze("No time limit"));
  await tik(start());
  await screen.findByText("1 seat still open");
  expect(server.potjes[0].denktijd_s).toBeNull();
});

test("Back (naar Mijn potjes): de knop linksboven brengt je terug", async () => {
  await naarKeuze();
  await tik(knop("My games"));
  expect(await screen.findByRole("button", { name: "New game" })).toBeTruthy();
});

test("onlineKeuze: drie keuzebalken (Board, Players, Move time) onder het bord, Start als lakplaat, geen twee voorwerpen op elkaar", () => {
  for (const vorm of ["ster", "vierkant"] as const) {
    const l = onlineKeuze({ namen: { ster: "A", vierkant: "B" }, vorm, aantallen: vorm === "ster" ? [2, 3, 4, 6] : [2, 4], aantal: 2, denktijden: ["15s", "30s", "1m", "2m", "off"], denktijd: 1 });
    expect(l.find((v) => v.id === "start")!.soort).toBe("rood");
    const balken = l.filter((v) => v.plaat?.soort === "balk");
    expect(balken.map((b) => b.plaat!.sleutels[0])).toEqual(["choice.board", "choice.players", "moveTime.label"]);
    const toetsen = l.filter((v) => v.plaat?.soort === "toets" || v.plaat?.soort === "toetsGekozen");
    expect(toetsen.filter((t) => t.plaat?.soort === "toetsGekozen").map((t) => t.id)).toEqual([vorm, "aantal2", "denktijd1"]);
    expect(toetsen.filter((t) => t.id.startsWith("denktijd"))).toHaveLength(5);
    const opBalk = (t: (typeof l)[number], b: (typeof l)[number]) => b.plaat?.soort === "balk" && t.plaat?.soort !== "balk" && t.z === b.z;
    for (const a of l) for (const b of l) {
      if (a === b || opBalk(a, b) || opBalk(b, a)) continue;
      const over = Math.abs(a.x - b.x) < (a.b + b.b) / 2 - 1e-6 && Math.abs(a.z - b.z) < (a.d + b.d) / 2 - 1e-6;
      expect(over, `${a.id} en ${b.id} (${vorm})`).toBe(false);
    }
    expect(balken[0].z - balken[0].d / 2).toBeGreaterThan(vorm === "ster" ? 9.0 : 9.54);
    expect(balken[1].z - balken[0].z).toBeCloseTo(BALK_D + 0.3, 6);
    expect(Math.max(...l.map((v) => Math.abs(v.x) + v.b / 2))).toBeLessThanOrEqual(7.8 + 1e-6);
  }
});
