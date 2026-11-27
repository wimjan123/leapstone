import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/svelte";
import { readFileSync } from "node:fs";
import { afterEach, beforeAll, beforeEach, expect, test, vi } from "vitest";
import { initSync } from "./wasm/halma_core.js";
import App from "./App.svelte";
import { deelIn, type MijnPotje } from "./online";
import { NepServer } from "./nep-server";

// Het 3D-bord als nep: jsdom kent geen WebGL, en er is alleen nog de tafel (feature 251).
vi.mock("./bord3d", async () => (await import("./nep-bord3d")).nepModule());

beforeAll(() => {
  initSync({ module: readFileSync("src/wasm/halma_core_bg.wasm") });
});

let server: NepServer;

beforeEach(() => {
  server = new NepServer();
  server.voegSpelerToe("Anna");
  server.voegSpelerToe("Ben");
  server.voegSpelerToe("Cor");
  localStorage.clear();
  const anna = server.spelers[0];
  localStorage.setItem("halma.speler", JSON.stringify({ speler_id: anna.speler_id, spelersnaam: anna.spelersnaam, sleutel: anna.sleutel }));
  history.replaceState(null, "", "/");
  vi.stubGlobal("fetch", vi.fn((u: string, i?: RequestInit) => server.fetch(u, i)));
  vi.stubGlobal("WebSocket", server.WebSocket);
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

const maakRij = (id: number, o: Partial<MijnPotje>): MijnPotje => ({
  potje_id: id,
  uitnodiging: `C${id}`,
  bord: "ster",
  aantal_spelers: 2,
  spelers: [],
  gestart: true,
  aan_de_beurt: 1,
  jouw_plek: 1,
  afgelopen: false,
  winnaar: null,
  laatste_activiteit: id,
  ...o,
});

test("deelIn zet jouw beurt bovenaan en houdt afgelopen potjes apart", () => {
  const lijst = [
    maakRij(1, { aan_de_beurt: 2 }),
    maakRij(2, { aan_de_beurt: 1 }),
    maakRij(3, { gestart: false, aan_de_beurt: null }),
    maakRij(4, { afgelopen: true, aan_de_beurt: null, winnaar: 1 }),
    maakRij(5, { aan_de_beurt: 2, jouw_plek: 2 }),
    maakRij(6, { aan_de_beurt: 1, laatste_activiteit: 60 }),
  ];
  const d = deelIn(lijst);
  expect(d.jouwBeurt.map((p) => p.potje_id)).toEqual([6, 5, 2]);
  expect(d.wacht.map((p) => p.potje_id)).toEqual([3, 1]);
  expect(d.afgelopen.map((p) => p.potje_id)).toEqual([4]);
});

test("My games toont jouw beurt bovenaan, dan wachten, dan afgelopen", async () => {
  // Potje 1: Ben begint, Anna wacht. Potje 2: Anna begint. Potje 3: Wachtkamer. Potje 4: Ben gaf op.
  server.maakPotje([2, 1], 2);
  server.maakPotje([1, 2], 2, "vierkant");
  server.maakPotje([1, 3], 3);
  server.maakPotje([1, 2], 2);
  server.maakPotje([3, 2], 2); // niet van Anna
  await server.fetch("/api/potjes/4/opgeven", { method: "POST", headers: { Authorization: "Bearer sleutel2" } });

  render(App);
  await fireEvent.click(await screen.findByRole("button", { name: "My games" }));
  await screen.findByRole("heading", { name: "My games" });

  const koppen = (await screen.findAllByRole("heading", { level: 2 })).map((h) => h.textContent);
  expect(koppen).toEqual(["Your turn", "Waiting for others", "Finished"]);

  const beurt = within(screen.getByRole("list", { name: "Your turn" }));
  expect(beurt.getAllByRole("button")).toHaveLength(1);
  expect(beurt.getByText("Ben")).toBeTruthy();
  expect(beurt.getByText("Square board, 2 players")).toBeTruthy();
  expect(beurt.getByText("Your turn")).toBeTruthy();

  const wacht = within(screen.getByRole("list", { name: "Waiting for others" }));
  expect(wacht.getAllByRole("button")).toHaveLength(2);
  expect(wacht.getByText("Ben to move")).toBeTruthy();
  expect(wacht.getByText("1 seat still open")).toBeTruthy();

  const af = within(screen.getByRole("list", { name: "Finished" }));
  expect(af.getAllByRole("button")).toHaveLength(1);
  expect(af.getByText("You won")).toBeTruthy();
  expect(screen.getAllByRole("button", { name: /Ben|Cor/ })).toHaveLength(4);
});

test("tikken op een potje opent het bord; 'My games' brengt je terug en verversen zet je niet terug in het potje", async () => {
  server.maakPotje([1, 2], 2);
  render(App);
  await fireEvent.click(await screen.findByRole("button", { name: "My games" }));
  await fireEvent.click(await screen.findByRole("button", { name: /Ben/ }));
  expect(await screen.findByText("Your turn", { selector: "strong" })).toBeTruthy();
  expect(localStorage.getItem("halma.potje")).toBe("1");

  await fireEvent.click(await screen.findByRole("button", { name: "My games" }));
  expect(await screen.findByRole("heading", { name: "My games" })).toBeTruthy();
  expect(localStorage.getItem("halma.potje")).toBeNull();

  // Verversen: het startscherm, niet het potje.
  cleanup();
  render(App);
  expect(await screen.findByRole("button", { name: "Play on this phone" })).toBeTruthy();
});

test("een wachtkamer opent vanuit de lijst, en 'Back to start' wist het onthouden potje", async () => {
  server.maakPotje([1], 2);
  render(App);
  await fireEvent.click(await screen.findByRole("button", { name: "My games" }));
  await fireEvent.click(await screen.findByRole("button", { name: /1 seat still open/ }));
  expect(await screen.findByRole("button", { name: "Invite" })).toBeTruthy();
  expect(localStorage.getItem("halma.potje")).toBe("1");
  await fireEvent.click(await screen.findByRole("button", { name: "Back to start" }));
  expect(localStorage.getItem("halma.potje")).toBeNull();
  expect(await screen.findByRole("button", { name: "Play on this phone" })).toBeTruthy();
});

test("zonder potjes staat er een lege melding met een knop om een potje te starten", async () => {
  render(App);
  await fireEvent.click(await screen.findByRole("button", { name: "My games" }));
  expect(await screen.findByText("No games yet")).toBeTruthy();
  await fireEvent.click(await screen.findByRole("button", { name: "New game" }));
  expect(await screen.findByRole("radio", { name: "Star board" })).toBeTruthy();
  // Het nep-bord legt de voorwerpen onder elkaar: Create game kan buiten het nep-scherm vallen, dan is de rol verborgen.
  await waitFor(() => expect(document.querySelector('.tafel-knop[data-voorwerp="start"]')?.getAttribute("aria-label") ?? document.querySelector('.tafel-knop[data-voorwerp="start"]')?.textContent).toBe("Create game"));
});

test("Leaderboard opent vanuit My games en toont namen en aantallen in de juiste volgorde", async () => {
  // Anna wint van Ben (Ben geeft op), Cor wint van Anna (Anna geeft op), Ben wint van Cor.
  server.maakPotje([1, 2], 2);
  server.maakPotje([1, 3], 2);
  server.maakPotje([2, 3], 2);
  await server.fetch("/api/potjes/1/opgeven", { method: "POST", headers: { Authorization: "Bearer sleutel2" } });
  await server.fetch("/api/potjes/2/opgeven", { method: "POST", headers: { Authorization: "Bearer sleutel1" } });
  await server.fetch("/api/potjes/3/opgeven", { method: "POST", headers: { Authorization: "Bearer sleutel3" } });

  render(App);
  await fireEvent.click(await screen.findByRole("button", { name: "My games" }));
  await fireEvent.click(await screen.findByRole("button", { name: "Leaderboard" }));
  await screen.findByText("Anna (you)");

  // Elke plek heeft nummer, naam, Rating en "Won x of y".
  const rijen = (await screen.findAllByRole("listitem"))
    .filter((r) => r.matches(".plaat-lijst li"))
    .map((r) => [r.querySelector(".nr")?.textContent, r.querySelector(".rn")?.textContent, r.querySelector(".rating")?.textContent?.replace(r.querySelector(".rlabel")?.textContent ?? "", ""), (r.textContent ?? "").match(/Won \d+ of \d+/)?.[0]]);
  // Potjes met vrienden veranderen de Rating niet: allemaal 1000, 1 gewonnen uit 2 gespeeld, dan telt de naam.
  expect(rijen).toEqual([
    ["1", "Anna (you)", "1000", "Won 1 of 2"],
    ["2", "Ben", "1000", "Won 1 of 2"],
    ["3", "Cor", "1000", "Won 1 of 2"],
  ]);

  await fireEvent.click(await screen.findByRole("button", { name: "Back" }));
  expect(await screen.findByRole("heading", { name: "My games" })).toBeTruthy();
});

test("de Leaderboard zonder afgelopen potjes toont een lege melding", async () => {
  server.maakPotje([1, 2], 2);
  render(App);
  await fireEvent.click(await screen.findByRole("button", { name: "My games" }));
  await fireEvent.click(await screen.findByRole("button", { name: "Leaderboard" }));
  expect(await screen.findByText("No winners yet")).toBeTruthy();
});

test("de trofee in het hoofdmenu opent de Leaderboard; terug gaat naar het hoofdmenu", async () => {
  server.maakPotje([1, 2], 2);
  await server.fetch("/api/potjes/1/opgeven", { method: "POST", headers: { Authorization: "Bearer sleutel2" } });
  render(App);
  await fireEvent.click(await screen.findByRole("button", { name: "Leaderboard" }));
  expect(await screen.findByText("Anna (you)")).toBeTruthy();
  await fireEvent.click(await screen.findByRole("button", { name: "Back" }));
  expect(await screen.findByRole("button", { name: "Play on this phone" })).toBeTruthy();
});
