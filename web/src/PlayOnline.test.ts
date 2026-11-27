import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/svelte";
import { readFileSync } from "node:fs";
import { afterEach, beforeAll, beforeEach, expect, test, vi } from "vitest";
import { initSync } from "./wasm/halma_core.js";
import App from "./App.svelte";
import { NepServer, VASTE_ZINNEN } from "./nep-server";

// Het 3D-bord als nep: jsdom kent geen WebGL, en er is alleen nog de tafel (feature 251).
vi.mock("./bord3d", async () => (await import("./nep-bord3d")).nepModule());

beforeAll(() => {
  initSync({ module: readFileSync("src/wasm/halma_core_bg.wasm") });
});

let server: NepServer;

beforeEach(() => {
  server = new NepServer();
  localStorage.clear();
  history.replaceState(null, "", "/");
  vi.stubGlobal("fetch", vi.fn((u: string, i?: RequestInit) => server.fetch(u, i)));
  vi.stubGlobal("WebSocket", server.WebSocket);
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

// De knoppen liggen als onzichtbare HTML-knoppen boven voorwerpen en komen na een paar microtaken (de laadtafel gaat eerst).
const knop = (naam: string | RegExp) => screen.findByRole("button", { name: naam });

/** Een Speler die al een Spelersnaam heeft (zoals na de eerste keer). */
function ingelogd(naam: string) {
  const s = server.voegSpelerToe(naam);
  localStorage.setItem("halma.speler", JSON.stringify({ speler_id: s.speler_id, spelersnaam: s.spelersnaam, sleutel: s.sleutel }));
  return s;
}

test("Play online zoekt meteen: Finding a player met een teller, zonder Uitnodiging", async () => {
  ingelogd("Anna");
  render(App);
  await fireEvent.click(await knop("Play online"));
  expect(await screen.findByText("Finding a player…")).toBeTruthy();
  expect(screen.getByTestId("zoekteller").textContent).toMatch(/0:0\d/);
  expect(screen.queryByText(/invite/i)).toBeNull();
  const p = server.potjes[0];
  expect([p.snel, p.aantal_spelers, p.denktijd_s, p.bord]).toEqual([true, 2, 30, "ster"]);
  expect(server.verzoeken).toContain("POST /api/snel");
});

test("zonder Spelersnaam kiest de Speler er eerst een en zoekt daarna", async () => {
  render(App);
  await fireEvent.click(await knop("Play online"));
  await fireEvent.input(await screen.findByRole("textbox", { name: "Choose a player name" }), { target: { value: "Anna" } });
  await fireEvent.click(await knop("Continue"));
  await fireEvent.click(await knop("I have saved the code"));
  // Een nieuwe Speler krijgt eenmalig "Learn to play?"; Skip gaat door met zoeken.
  await fireEvent.click(await knop("Skip"));
  expect(await screen.findByText("Finding a player…")).toBeTruthy();
});

test("een tweede Speler wordt gekoppeld: het zoekscherm wordt het bord, zonder Chat", async () => {
  ingelogd("Anna");
  const bob = server.voegSpelerToe("Bob");
  render(App);
  await fireEvent.click(await knop("Play online"));
  await screen.findByText("Finding a player…");
  // Bob zoekt ook, op een andere telefoon.
  const antwoord = await server.fetch("/api/snel", { method: "POST", headers: { Authorization: `Bearer ${bob.sleutel}` } });
  expect((await antwoord.json()).gestart).toBe(true);
  await waitFor(() => expect(screen.queryByText("Finding a player…")).toBeNull());
  expect(await knop("Resign")).toBeTruthy();
  // Chat bestaat wel, maar met Vaste zinnen (zie hieronder).
});

test("in een Snel potje kiest de Speler een Vaste zin: geen tekstveld, één tik stuurt", async () => {
  ingelogd("Anna");
  const bob = server.voegSpelerToe("Bob");
  render(App);
  await fireEvent.click(await knop("Play online"));
  await screen.findByText("Finding a player…");
  await server.fetch("/api/snel", { method: "POST", headers: { Authorization: `Bearer ${bob.sleutel}` } });
  await fireEvent.click(await knop(/^Chat/));
  expect(screen.queryByRole("textbox")).toBeNull();
  for (const zin of VASTE_ZINNEN) expect(await screen.findByRole("button", { name: zin })).toBeTruthy();
  await fireEvent.click(await knop("Good game"));
  await waitFor(() => expect(server.potjes[0].berichten.map((b) => b.tekst)).toEqual(["Good game"]));
  expect(await screen.findAllByText("Good game")).toBeTruthy();
});

test("na de zoektijd vult de server de plek en de Speler ziet gewoon een tegenstander", async () => {
  ingelogd("Anna");
  render(App);
  await fireEvent.click(await knop("Play online"));
  await screen.findByText("Finding a player…");
  server.vulMetComputer(server.potjes[0]);
  expect(await knop("Resign")).toBeTruthy();
  expect(document.body.textContent?.toLowerCase()).not.toContain("computer");
});

test("stoppen met zoeken verlaat de wachtrij en brengt de Speler terug naar het begin", async () => {
  ingelogd("Anna");
  render(App);
  await fireEvent.click(await knop("Play online"));
  await screen.findByText("Finding a player…");
  await fireEvent.click(await knop("Back"));
  await knop("Play online");
  expect(server.potjes).toHaveLength(0);
  expect(server.verzoeken).toContain("DELETE /api/snel/1");
  expect(localStorage.getItem("halma.potje")).toBeNull();
});

test("na afloop start Play again meteen een nieuw Snel potje", async () => {
  ingelogd("Anna");
  render(App);
  await fireEvent.click(await knop("Play online"));
  await screen.findByText("Finding a player…");
  server.vulMetComputer(server.potjes[0]);
  await fireEvent.click(await knop("Resign"));
  await fireEvent.click(await knop("Yes, resign"));
  await fireEvent.click(await knop("Play again"));
  expect(await screen.findByText("Finding a player…")).toBeTruthy();
  expect(server.potjes).toHaveLength(2);
  expect(server.potjes[1].snel).toBe(true);
  expect(server.potjes[1].spelers).toHaveLength(1);
});

test("in een Snel potje staan Spelersnaam en Rating van de tegenstander in beeld", async () => {
  ingelogd("Anna");
  render(App);
  await fireEvent.click(await knop("Play online"));
  await screen.findByText("Finding a player…");
  server.ratings.set(2, 1042);
  server.vulMetComputer(server.potjes[0]);
  const t = await screen.findByTestId("tegenstander");
  expect(t.textContent).toContain("Maya");
  expect(t.textContent).toContain("1042");
});

test("na verlies ziet de Speler zijn Rating dalen en zijn plek op de Leaderboard", async () => {
  ingelogd("Anna");
  render(App);
  await fireEvent.click(await knop("Play online"));
  await screen.findByText("Finding a player…");
  server.vulMetComputer(server.potjes[0]);
  await fireEvent.click(await knop("Resign"));
  await fireEvent.click(await knop("Yes, resign"));
  const uitslag = await screen.findByTestId("rating-uitslag");
  expect(uitslag.textContent).toMatch(/1000.*984/);
  expect(uitslag.textContent).toContain("−16");
  expect((await screen.findByTestId("ranglijst-plek")).textContent).toBe("Leaderboard #2");
});

test("na winst ziet de Speler zijn Rating stijgen", async () => {
  ingelogd("Anna");
  render(App);
  await fireEvent.click(await knop("Play online"));
  await screen.findByText("Finding a player…");
  server.vulMetComputer(server.potjes[0]);
  await knop("Resign");
  // De tegenstander (Speler 2, sleutel van Maya) geeft op.
  await server.fetch("/api/potjes/1/opgeven", { method: "POST", headers: { Authorization: `Bearer ${server.spelers[1].sleutel}` } });
  const uitslag = await screen.findByTestId("rating-uitslag");
  expect(uitslag.textContent).toMatch(/1000.*1016/);
  expect(uitslag.textContent).toContain("+16");
  expect((await screen.findByTestId("ranglijst-plek")).textContent).toBe("Leaderboard #1");
});

test("Find 4 players: de knop zoekt een Snel potje met meer Spelers en na de zoektijd speelt de Speler mee", async () => {
  ingelogd("Anna");
  render(App);
  await fireEvent.click(await knop("Play online"));
  await screen.findByText("Finding a player…");
  await fireEvent.click(await knop("Find 4 players"));
  await waitFor(() => expect(server.potjes[0]?.aantal_spelers).toBe(4));
  expect(server.potjes).toHaveLength(1);
  expect(server.verzoeken).toContain("DELETE /api/snel/1");
  const p = server.potjes[0];
  expect([p.snel, p.denktijd_s, p.bord, p.spelers.length]).toEqual([true, 30, "ster", 1]);
  expect(await screen.findByText("Finding a player…")).toBeTruthy();
  expect(screen.queryByRole("button", { name: "Find 4 players" })).toBeNull();
  server.vulMetComputer(p);
  expect(await knop("Resign")).toBeTruthy();
  expect(p.spelers).toHaveLength(4);
  expect(document.body.textContent?.toLowerCase()).not.toContain("computer");
});

test("een Speler voor 2 Spelers wordt niet gekoppeld aan een Potje voor meer Spelers", async () => {
  const bob = server.voegSpelerToe("Bob");
  ingelogd("Anna");
  const kop = { Authorization: `Bearer ${bob.sleutel}`, "Content-Type": "application/json" };
  await server.fetch("/api/snel", { method: "POST", headers: kop, body: JSON.stringify({ meer: true }) });
  render(App);
  await fireEvent.click(await knop("Play online"));
  await screen.findByText("Finding a player…");
  expect(server.potjes).toHaveLength(2);
  expect(server.potjes[1].aantal_spelers).toBe(2);
});
