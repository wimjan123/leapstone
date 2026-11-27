// Taak 224 (feature 221): de laadtafel op de andere laadmomenten. Ranglijst, winstscherm (lokaal en online), het begin van een Potje,
// het laden na Play online en de keuzeschermen van het Startmenu tonen de laadtafel tot de 3D-tafel klaar is, en geen plat scherm in
// de oude opbouw. Zonder 3D staat het platte scherm er meteen; staat dezelfde tafel al in beeld (`nep.warm`), dan geen laadtafel;
// met minder beweging staat alles meteen in beeld. Het nep-bord meldt "klaar" zodra een test `nep.klaar` zo zet.
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/svelte";
import { readFileSync } from "node:fs";
import { afterEach, beforeAll, beforeEach, expect, test, vi } from "vitest";
import { initSync } from "./wasm/halma_core.js";
import App from "./App.svelte";
import Ranglijst from "./Ranglijst.svelte";
import { nep } from "./nep-bord3d";
import { NepServer } from "./nep-server";
import { naarSpelers } from "./test-start";

vi.mock("./bord3d", async () => (await import("./nep-bord3d")).nepModule());
vi.mock("./online", async (orig) => ({
  ...(await orig<typeof import("./online")>()),
  haalRanglijst: async () => [
    { speler_id: 1, spelersnaam: "Mila", rating: 1042, gewonnen: 2, gespeeld: 3 },
    { speler_id: 2, spelersnaam: "Noor", rating: 1000, gewonnen: 1, gespeeld: 3 },
  ],
}));

beforeAll(() => initSync({ module: readFileSync("src/wasm/halma_core_bg.wasm") }));

let server: NepServer;
beforeEach(() => {
  nep.reset();
  server = new NepServer();
  localStorage.clear();
  history.replaceState(null, "", "/");
  vi.stubGlobal("fetch", vi.fn((u: string, i?: RequestInit) => server.fetch(u, i)));
  vi.stubGlobal("WebSocket", server.WebSocket);
});
afterEach(() => {
  cleanup();
  // `reset` wist een eigen `klaar` van een test niet (het is een eigenschap van het voorbeeld, niet van de klasse).
  delete (nep as { klaar?: () => boolean }).klaar;
  Element.prototype.animate = echteAnimate;
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

const echteAnimate = Element.prototype.animate;
const laadtafel = () => document.querySelector(".laadtafel");
/** Het nep-bord tekent pas "alles" als de test dat zegt. */
function houdTafelTegen() {
  let tekent = false;
  nep.klaar = () => tekent;
  return () => (tekent = true);
}
const minderBeweging = () => {
  vi.stubGlobal("matchMedia", (q: string) => ({ matches: q.includes("reduce"), media: q, addEventListener() {}, removeEventListener() {} }));
  // Zonder minder beweging zou de laadtafel nog 260 ms uitvervagen via Element.animate; hier mag dat niet.
  const animeer = vi.fn(() => ({ cancel() {}, finish() {}, onfinish: null, finished: new Promise(() => {}) }));
  Element.prototype.animate = animeer as never;
  return animeer;
};

// ---- Ranglijst

test("Ranglijst: de laadtafel staat er tot de tafel klaar is, en geen plat podium", async () => {
  const tekenKlaar = houdTafelTegen();
  render(Ranglijst, { sleutel: "s", ikId: 1, terug: () => {}, verlopen: () => {} });
  // De lijst komt binnen terwijl de tafel nog laadt: dat zag je vroeger als plat podium.
  await new Promise((r) => setTimeout(r, 20));
  expect(laadtafel()).not.toBeNull();
  expect(screen.getByRole("status")).toBeTruthy();
  expect(document.querySelector(".podium")).toBeNull();
  expect(document.querySelector(".lijst")).toBeNull();
  tekenKlaar();
  await waitFor(() => expect(document.querySelector(".plaat-lijst")).not.toBeNull());
  await waitFor(() => expect(laadtafel()).toBeNull());
  expect(document.querySelector(".podium")).toBeNull();
});

test("Ranglijst: staat de tafel al in beeld, dan geen laadtafel", async () => {
  nep.warm = true;
  houdTafelTegen();
  render(Ranglijst, { sleutel: "s", ikId: 1, terug: () => {}, verlopen: () => {} });
  await new Promise((r) => setTimeout(r, 20));
  expect(laadtafel()).toBeNull();
  expect(document.querySelector(".podium")).toBeNull();
});

test("Ranglijst: met minder beweging is de laadtafel meteen weg", async () => {
  const animeer = minderBeweging();
  const tekenKlaar = houdTafelTegen();
  render(Ranglijst, { sleutel: "s", ikId: 1, terug: () => {}, verlopen: () => {} });
  expect(laadtafel()).not.toBeNull();
  tekenKlaar();
  await waitFor(() => expect(laadtafel()).toBeNull());
  expect(animeer).not.toHaveBeenCalled();
});

// ---- Winstscherm (lokaal Potje)

/** Een lokaal Potje tot de knop Resign, daarna houdt de test de tafel tegen en geeft op. */
async function opgevenMetTegenhouden() {
  render(App);
  await naarSpelers();
  await fireEvent.click(screen.getByRole("button", { name: "Start game" }));
  const resign = await screen.findByRole("button", { name: "Resign" });
  await waitFor(() => expect(laadtafel()).toBeNull());
  const tekenKlaar = houdTafelTegen();
  await fireEvent.click(resign);
  await fireEvent.click(screen.getByRole("button", { name: "Yes, resign" }));
  return tekenKlaar;
}

test("winstscherm: de laadtafel staat er tot de platen klaar zijn, en geen plat winstscherm", async () => {
  const tekenKlaar = await opgevenMetTegenhouden();
  await waitFor(() => expect(document.querySelector(".feest .laadtafel")).not.toBeNull());
  expect(screen.queryByText("Player 2 wins!")).toBeNull();
  expect(screen.queryByRole("button", { name: "New game" })).toBeNull();
  tekenKlaar();
  expect(await screen.findByText("Player 2 wins!")).toBeTruthy();
  await waitFor(() => expect(laadtafel()).toBeNull());
});

test("winstscherm: staat het eindbord al in beeld, dan geen laadtafel en nog geen plat scherm", async () => {
  nep.warm = true;
  await opgevenMetTegenhouden();
  await waitFor(() => expect(document.querySelector(".feest")).not.toBeNull());
  expect(laadtafel()).toBeNull();
  expect(screen.queryByText("Player 2 wins!")).toBeNull();
});

test("winstscherm: mislukt 3D, dan het foutscherm met Try again in plaats van een plat winstscherm", async () => {
  render(App);
  await naarSpelers();
  await fireEvent.click(screen.getByRole("button", { name: "Start game" }));
  const resign = await screen.findByRole("button", { name: "Resign" });
  nep.faal = true; // de tafel van het winstscherm start niet
  await fireEvent.click(resign);
  await fireEvent.click(screen.getByRole("button", { name: "Yes, resign" }));
  expect(await screen.findByRole("button", { name: "Try again" })).toBeTruthy();
  expect(laadtafel()).toBeNull();
  expect(screen.queryByText("Player 2 wins!")).toBeNull();
});

// ---- Begin van een Potje

test("begin van een Potje: de laadtafel in plaats van de platte omtrek, tot het bord en de voorwerpen er staan", async () => {
  render(App);
  await naarSpelers();
  const tekenKlaar = houdTafelTegen();
  await fireEvent.click(screen.getByRole("button", { name: "Start game" }));
  await waitFor(() => expect(document.querySelector(".bord3d")).not.toBeNull());
  expect(laadtafel()).not.toBeNull();
  expect(document.querySelector(".bord3d .laden")).toBeNull();
  tekenKlaar();
  await waitFor(() => expect(laadtafel()).toBeNull());
});

// ---- Laden na Play online

function ingelogd(naam: string) {
  const s = server.voegSpelerToe(naam);
  localStorage.setItem("halma.speler", JSON.stringify({ speler_id: s.speler_id, spelersnaam: s.spelersnaam, sleutel: s.sleutel }));
}
/** De server antwoordt op /api/snel pas als de test dat wil: zo blijft het scherm `laden` staan. */
function houdSnelTegen() {
  let los = () => {};
  const wacht = new Promise<void>((r) => (los = r));
  vi.stubGlobal(
    "fetch",
    vi.fn(async (u: string, i?: RequestInit) => {
      if (u.includes("/api/snel")) await wacht;
      return server.fetch(u, i);
    }),
  );
  return los;
}

test("laden na Play online: de laadtafel in plaats van de drie kralen", async () => {
  ingelogd("Anna");
  const geef = houdSnelTegen();
  render(App);
  await fireEvent.click(await screen.findByRole("button", { name: "Play online" }));
  await waitFor(() => expect(laadtafel()).not.toBeNull());
  expect(document.querySelectorAll(".kraal")).toHaveLength(3); // de kralen zijn het laadteken ín de laadtafel
  expect(document.querySelectorAll(".laadtafel .kraal")).toHaveLength(3);
  geef();
  expect(await screen.findByText("Finding a player…")).toBeTruthy();
});

test("laden na Play online: ook als het bord al gebouwd is, want het scherm dat sloot nam zijn tafel mee", async () => {
  ingelogd("Anna");
  nep.warm = true;
  const geef = houdSnelTegen();
  render(App);
  await fireEvent.click(await screen.findByRole("button", { name: "Play online" }));
  await waitFor(() => expect(laadtafel()).not.toBeNull());
  expect(document.querySelector(".scherm-laden .kraal")).toBeNull();
  geef();
});

// ---- Winstscherm online

test("online winstscherm: de laadtafel staat er tot de platen klaar zijn, en geen plat winstscherm", async () => {
  const anna = server.voegSpelerToe("Anna");
  server.voegSpelerToe("Ben");
  server.maakPotje([1, 2], 2);
  localStorage.setItem("halma.speler", JSON.stringify({ speler_id: anna.speler_id, spelersnaam: anna.spelersnaam, sleutel: anna.sleutel }));
  localStorage.setItem("halma.potje", "1");
  render(App);
  await screen.findByText("Your turn");
  await waitFor(() => expect(laadtafel()).toBeNull());
  const tekenKlaar = houdTafelTegen();
  await fireEvent.click(screen.getByRole("button", { name: "Resign" }));
  await fireEvent.click(screen.getByRole("button", { name: "Yes, resign" }));
  await waitFor(() => expect(document.querySelector(".feest .laadtafel")).not.toBeNull());
  expect(screen.queryByText("Ben wins!")).toBeNull();
  tekenKlaar();
  expect(await screen.findByText("Ben wins!")).toBeTruthy();
  await waitFor(() => expect(laadtafel()).toBeNull());
});

// ---- Keuzeschermen van het Startmenu

test("Startmenu: een keuzescherm toont de eerste keer de laadtafel, geen plat keuzescherm", async () => {
  vi.resetModules();
  const bord = await import("./bord3d");
  const nepBord = (await bord.laadBord3d([])) as import("./nep-bord3d").NepBord;
  nepBord.reset();
  let tekent = false;
  nepBord.klaar = () => tekent;
  const { initSync: init } = await import("./wasm/halma_core.js");
  init({ module: readFileSync("src/wasm/halma_core_bg.wasm") });
  const { render: toon, cleanup: ruim, screen: scherm } = await import("@testing-library/svelte");
  const { default: Startmenu } = await import("./Startmenu.svelte");
  toon(Startmenu, { start: vi.fn(), online: vi.fn(), vorige: { vorm: "ster", aantal: 2, niveaus: [null, null] } });
  expect(document.querySelector(".laadtafel")).not.toBeNull();
  expect(document.querySelector(".lak-keuze")).toBeNull();
  expect(scherm.queryByRole("button", { name: "Back" })).toBeNull();
  tekent = true;
  await waitFor(() => expect(document.querySelector(".laadtafel")).toBeNull());
  expect(document.querySelector(".lak-keuze")).toBeNull();
  ruim();
  delete (nepBord as { klaar?: () => boolean }).klaar;
});
