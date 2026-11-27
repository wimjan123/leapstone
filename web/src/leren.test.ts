import { cleanup, fireEvent, render, screen } from "@testing-library/svelte";
import { readFileSync } from "node:fs";
import { afterEach, beforeAll, beforeEach, expect, test, vi } from "vitest";
import { initSync } from "./wasm/halma_core.js";
import App from "./App.svelte";
import { LEREN_OPSLAG } from "./leren";
import { NepServer } from "./nep-server";

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

// De knoppen liggen als onzichtbare HTML-knoppen boven voorwerpen en komen na een paar microtaken.
const knop = (naam: string | RegExp) => screen.findByRole("button", { name: naam });

async function kiesNaamEnBewaarCode(naam: string) {
  await fireEvent.click(await knop("My games"));
  await fireEvent.input(await screen.findByRole("textbox", { name: "Choose a player name" }), { target: { value: naam } });
  await fireEvent.click(await knop("Continue"));
  await fireEvent.click(await knop("I have saved the code"));
}

test("een nieuwe Speler ziet na de Spelersnaam één keer de vraag; Skip gaat naar het menu en de vraag komt niet terug", async () => {
  render(App);
  await kiesNaamEnBewaarCode("Anna");
  expect(await screen.findByText("Learn to play? (1 min)")).toBeTruthy();
  expect(await knop("Start")).toBeTruthy();

  await fireEvent.click(await knop("Skip"));
  expect(await knop("Play on this phone")).toBeTruthy();
  expect(screen.queryByText("Learn to play? (1 min)")).toBeNull();

  // Opnieuw Online en opnieuw een Spelersnaam (bijvoorbeeld na Delete account): geen vraag meer.
  cleanup();
  localStorage.removeItem("halma.speler");
  history.replaceState(null, "", "/");
  render(App);
  await kiesNaamEnBewaarCode("Anna");
  expect(await screen.findByRole("button", { name: "New game" })).toBeTruthy();
  expect(screen.queryByText("Learn to play? (1 min)")).toBeNull();
});

test("Start opent de Speluitleg", async () => {
  render(App);
  await kiesNaamEnBewaarCode("Anna");
  await fireEvent.click(await screen.findByRole("button", { name: "Start" }));
  expect(await screen.findByText("Move one step to a neighbouring hole.")).toBeTruthy();
  expect(localStorage.getItem(LEREN_OPSLAG)).not.toBeNull();
});

test("een bestaande Speler (al een Spelersnaam vóór deze versie) ziet de vraag niet", async () => {
  localStorage.setItem("halma.speler", JSON.stringify({ speler_id: 1, spelersnaam: "Oud", sleutel: "sleutel0" }));
  render(App);
  // De app onthoudt bij het starten dat deze Speler al bekend was.
  expect(localStorage.getItem(LEREN_OPSLAG)).not.toBeNull();
  // Ook als die Speler later opnieuw een Spelersnaam kiest.
  cleanup();
  localStorage.removeItem("halma.speler");
  render(App);
  await kiesNaamEnBewaarCode("Nieuw");
  expect(await knop("New game")).toBeTruthy();
  expect(screen.queryByText("Learn to play? (1 min)")).toBeNull();
});
