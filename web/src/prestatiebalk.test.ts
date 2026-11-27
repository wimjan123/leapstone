import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/svelte";
import { readFileSync } from "node:fs";
import { afterEach, beforeAll, beforeEach, expect, test, vi } from "vitest";
import { initSync } from "./wasm/halma_core.js";
import App from "./App.svelte";
import { nep } from "./nep-bord3d";
import { NepServer } from "./nep-server";
import { wisPrestatiebalk } from "./prestaties";
import { trilling } from "./trillen";
import { klanken } from "./geluid";

// Taak 174: het balkje bij een nieuwe Prestatie.
vi.mock("./bord3d", async () => (await import("./nep-bord3d")).nepModule());

beforeAll(() => {
  initSync({ module: readFileSync("src/wasm/halma_core_bg.wasm") });
});

let server: NepServer;

beforeEach(() => {
  nep.reset();
  wisPrestatiebalk();
  server = new NepServer();
  const anna = server.voegSpelerToe("Anna");
  server.voegSpelerToe("Ben");
  localStorage.clear();
  localStorage.setItem("halma.speler", JSON.stringify({ speler_id: anna.speler_id, spelersnaam: anna.spelersnaam, sleutel: anna.sleutel }));
  history.replaceState(null, "", "/");
  vi.stubGlobal("fetch", vi.fn((u: string, i?: RequestInit) => server.fetch(u, i)));
  vi.stubGlobal("WebSocket", server.WebSocket);
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

const balkje = () => screen.queryByTestId("prestatiebalk");

/** Anna doet een Zet in haar Potje. */
async function speelEenZet(p: ReturnType<NepServer["maakPotje"]>) {
  const stand = Array.from(p.game.stand());
  const van = stand.findIndex((v, i) => v === 0 && p.game.geldige_bestemmingen(i).length > 0);
  const naar = p.game.geldige_bestemmingen(van)[0];
  await fireEvent.click(document.querySelector<HTMLElement>(`.steen[data-vak="${van}"]`)!);
  await fireEvent.click(document.querySelector<HTMLElement>(`[data-gat="${naar}"]`)!);
}

async function openPotje(denktijd: number | null = 30) {
  const p = server.maakPotje([1, 2], 2, "ster", denktijd);
  localStorage.setItem("halma.potje", "1");
  render(App);
  await screen.findByText("Your turn");
  // De basis is binnen: alles wat de server nu heeft, is bekend.
  await waitFor(() => expect(server.verzoeken).toContain("GET /api/prestaties"));
  return p;
}

test("na een Zet met zes Sprongen verschijnt het balkje, de Denktijd loopt door, na drie seconden is het weg", async () => {
  const p = await openPotje(30);
  expect(balkje()).toBeNull();
  // De server telt zes Sprongen in de Zet die nu komt.
  p.eigen = new Map([[1, { zetten: 0, sprongen: 6 }]]);
  await speelEenZet(p);

  const b = await screen.findByTestId("prestatiebalk");
  expect(b.textContent).toContain("Achievement: Six jumps in one move");
  expect(b.getAttribute("role")).toBe("status");
  // Het balkje staat buiten het bord en buiten de pagina-inhoud, en vangt geen tikken af.
  expect(b.closest("main")).toBeNull();
  // De Denktijd loopt door: het segment staat er nog en telt af.
  const tijd = screen.getByTestId("denktijd");
  expect(tijd.style.getPropertyValue("--duur")).not.toBe("");
  expect(document.body.contains(tijd)).toBe(true);

  await waitFor(() => expect(balkje()).toBeNull(), { timeout: 4500 });
  // Dezelfde Prestatie komt niet nog eens.
  await fireEvent.click(document.body);
  expect(balkje()).toBeNull();
}, 10_000);

test("een Prestatie die al gehaald was, geeft geen balkje", async () => {
  const p = server.maakPotje([1, 2], 2, "ster", 30);
  p.eigen = new Map([[1, { zetten: 3, sprongen: 6 }]]);
  localStorage.setItem("halma.potje", "1");
  render(App);
  await screen.findByText("Your turn");
  await waitFor(() => expect(server.verzoeken).toContain("GET /api/prestaties"));
  await speelEenZet(p);
  await waitFor(() => expect(server.verzoeken.filter((v) => v === "GET /api/prestaties")).toHaveLength(2));
  await screen.findByText("Ben", { selector: "strong" });
  expect(balkje()).toBeNull();
});

test("een Prestatie van vóór de eerste keer dat de app ze zag, geeft ook na verversen geen balkje", async () => {
  const p = server.maakPotje([1, 2], 2, "ster", 30);
  p.eigen = new Map([[1, { zetten: 3, sprongen: 6 }]]);
  localStorage.setItem("halma.potje", "1");
  render(App);
  await screen.findByText("Your turn");
  await waitFor(() => expect(localStorage.getItem("leapstone.prestaties.1")).toContain("jumps_6"));
  cleanup();
  render(App);
  await screen.findByText("Your turn");
  await speelEenZet(p);
  await screen.findByText("Ben", { selector: "strong" });
  await waitFor(() => expect(server.verzoeken.filter((v) => v === "GET /api/prestaties").length).toBeGreaterThanOrEqual(3));
  expect(balkje()).toBeNull();
});

test("een overwinning geeft na het einde van het Potje een balkje, op het Vierkant bord ook voor de eerste overwinning", async () => {
  server.maakPotje([1, 2], 2, "vierkant", 30);
  localStorage.setItem("halma.potje", "1");
  render(App);
  await screen.findByText("Your turn");
  await waitFor(() => expect(server.verzoeken).toContain("GET /api/prestaties"));
  // Ben geeft op: Anna wint.
  await server.fetch("/api/potjes/1/opgeven", { method: "POST", headers: { Authorization: `Bearer ${server.spelers[1].sleutel}` } });
  await screen.findByText("You won!");
  const b = await screen.findByTestId("prestatiebalk");
  expect(b.textContent).toContain("Achievement: First win");
  // Daarna het volgende balkje: de Prestatie voor het Vierkant bord.
  await waitFor(() => expect(balkje()?.textContent).toContain("Achievement: Win on the square board"), { timeout: 4500 });
  await waitFor(() => expect(balkje()).toBeNull(), { timeout: 4500 });
}, 12_000);

test("het balkje geeft geluid en een tik, met de bestaande instellingen", () => {
  expect(klanken({ soort: "prestatie" }).length).toBeGreaterThan(0);
  expect(trilling({ soort: "prestatie" })?.tikken).toEqual(["stevig"]);
});
