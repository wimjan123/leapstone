import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/svelte";
import { readFileSync } from "node:fs";
import { afterEach, beforeAll, beforeEach, expect, test, vi } from "vitest";
import { initSync } from "./wasm/halma_core.js";
import App from "./App.svelte";
import { NepServer } from "./nep-server";

// Het 3D-bord als nep: jsdom kent geen WebGL, en er is alleen nog de tafel (feature 251).
vi.mock("./bord3d", async () => (await import("./nep-bord3d")).nepModule());

// Taak 234: het foutscherm met één vaste zin en Try again, de invoervelden, het laden en de verzendknop van de Chat.

beforeAll(() => {
  initSync({ module: readFileSync("src/wasm/halma_core_bg.wasm") });
});

let server: NepServer;
let stuk: boolean;

beforeEach(() => {
  server = new NepServer();
  stuk = true;
  localStorage.clear();
  localStorage.setItem("leapstone.leren.gevraagd", "1");
  history.replaceState(null, "", "/");
  // De server geeft eerst een fout met ruwe tekst; daarna werkt hij weer.
  vi.stubGlobal(
    "fetch",
    vi.fn((u: string, i?: RequestInit) =>
      stuk && /\/api\/(uitnodigingen|snel)/.test(u)
        ? Promise.resolve(new Response(JSON.stringify({ fout: "server exploded: ECONNRESET" }), { status: 500, headers: { "content-type": "application/json" } }))
        : server.fetch(u, i),
    ),
  );
  vi.stubGlobal("WebSocket", server.WebSocket);
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

// De knoppen liggen als onzichtbare HTML-knoppen boven voorwerpen en komen na een paar microtaken.
const knop = (naam: string | RegExp) => screen.findByRole("button", { name: naam });

test("een fout bij meedoen toont één vaste zin, niet de servertekst, en Try again doet dezelfde stap opnieuw", async () => {
  server.spelers.push({ speler_id: 1, spelersnaam: "Anna", sleutel: "k1", herstelcode: "H1" });
  server.spelers.push({ speler_id: 2, spelersnaam: "Ben", sleutel: "k2", herstelcode: "H2" });
  server.maakPotje([1], 2);
  localStorage.setItem("halma.speler", JSON.stringify({ speler_id: 2, spelersnaam: "Ben", sleutel: "k2" }));
  history.replaceState(null, "", "/uitnodiging/ABCD-EFGH");
  render(App);
  const melding = await screen.findByRole("alert");
  expect(melding.textContent).toBe("Something went wrong. Check your connection and try again.");
  expect(document.body.textContent).not.toContain("ECONNRESET");
  stuk = false;
  await fireEvent.click(await knop("Try again"));
  expect(await screen.findByText("Anna", { selector: "strong" })).toBeTruthy();
  expect(screen.queryByRole("alert")).toBeNull();
});

test("een onbekende uitnodiging houdt zijn eigen zin en heeft geen Try again", async () => {
  server.spelers.push({ speler_id: 1, spelersnaam: "Anna", sleutel: "k1", herstelcode: "H1" });
  localStorage.setItem("halma.speler", JSON.stringify({ speler_id: 1, spelersnaam: "Anna", sleutel: "k1" }));
  stuk = false;
  history.replaceState(null, "", "/uitnodiging/NOPE");
  render(App);
  expect((await screen.findByRole("alert")).textContent).toContain("does not exist");
  expect(screen.queryByRole("button", { name: "Try again" })).toBeNull();
});

test("een fout bij Play online zoekt met Try again opnieuw", async () => {
  server.spelers.push({ speler_id: 1, spelersnaam: "Anna", sleutel: "k1", herstelcode: "H1" });
  localStorage.setItem("halma.speler", JSON.stringify({ speler_id: 1, spelersnaam: "Anna", sleutel: "k1" }));
  render(App);
  await fireEvent.click(await knop("Play online"));
  expect((await screen.findByRole("alert")).textContent).toBe("Something went wrong. Check your connection and try again.");
  stuk = false;
  await fireEvent.click(await knop("Try again"));
  await waitFor(() => expect(screen.queryByRole("alert")).toBeNull());
  expect(server.verzoeken.some((v) => v.includes("/api/snel"))).toBe(true);
});

test("het veld voor de Spelersnaam heeft voorbeeldtekst, een goudkleurige rand en de focus", async () => {
  render(App);
  await fireEvent.click(await knop("My games"));
  const veld = (await screen.findByRole("textbox", { name: "Choose a player name" })) as HTMLInputElement;
  expect(veld.placeholder).toBe("Player name");
  expect(document.activeElement).toBe(veld);
});

test("het veld voor de Herstelcode heeft voorbeeldtekst en de focus", async () => {
  render(App);
  await fireEvent.click(await knop("My games"));
  await fireEvent.click(await knop("Enter recovery code"));
  const veld = await screen.findByRole("textbox", { name: "Your recovery code" }) as HTMLInputElement;
  expect(veld.placeholder).toBe("Recovery code");
  expect(document.activeElement).toBe(veld);
});
