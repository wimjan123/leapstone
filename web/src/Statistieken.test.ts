// Taak 155: het scherm My stats, met de nep-server.
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/svelte";
import { readFileSync } from "node:fs";
import { afterEach, beforeAll, beforeEach, expect, test, vi } from "vitest";
import { initSync } from "./wasm/halma_core.js";
import App from "./App.svelte";
import { NepServer } from "./nep-server";
import { zetTaal } from "./taal.svelte";

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

/** Een Snel potje van Anna tegen Ben; Ben geeft op, dus Anna wint en haar Rating verandert. */
async function winPotje() {
  const p = server.maakPotje([1, 2], 2);
  p.snel = true;
  await server.fetch(`/api/potjes/${p.potje_id}/opgeven`, { method: "POST", headers: { Authorization: "Bearer sleutel2" } });
  return p;
}
/** Een Potje dat Anna verliest: zij geeft op. */
async function verliesPotje() {
  const p = server.maakPotje([1, 2], 2);
  await server.fetch(`/api/potjes/${p.potje_id}/opgeven`, { method: "POST", headers: { Authorization: "Bearer sleutel1" } });
  return p;
}

const openStats = async () => {
  render(App);
  await fireEvent.click(await screen.findByRole("button", { name: "My stats" }));
  await screen.findByRole("heading", { name: "My stats" });
};
const cel = (naam: string) => screen.getByText(naam, { selector: "dt" }).parentElement as HTMLElement;

test("het menu heeft een knop My stats die het scherm opent, en terug brengt je naar het menu", async () => {
  await openStats();
  expect(server.verzoeken).toContain("GET /api/statistieken");
  await fireEvent.click(await screen.findByRole("button", { name: "Back" }));
  expect(await screen.findByRole("button", { name: "My stats" })).toBeTruthy();
});

test("bovenaan staan gespeeld, gewonnen, verloren, het deel gewonnen en de gemiddelde plek", async () => {
  await winPotje();
  await winPotje();
  await verliesPotje();
  server.maakPotje([1, 2], 2); // loopt nog: telt niet mee
  await openStats();
  await waitFor(() => expect(within(cel("Played")).getByText("3")).toBeTruthy());
  expect(within(cel("Won")).getByText("2")).toBeTruthy();
  expect(within(cel("Lost")).getByText("1")).toBeTruthy();
  expect(within(cel("Win rate")).getByText("67%")).toBeTruthy();
  expect(within(cel("Average place")).getByText("1.3")).toBeTruthy();
});

test("de Ratinglijn heeft een punt per Potje met een Ratingwijziging", async () => {
  await winPotje();
  await winPotje();
  await winPotje();
  await openStats();
  expect(await screen.findByText("Rating, last 50 games")).toBeTruthy();
  const rating = server.rating(1);
  const lijn = screen.getByRole("img", { name: `Rating over 3 games, now ${rating}` });
  expect(lijn.querySelectorAll("circle")).toHaveLength(3);
  expect(lijn.querySelector("path")).toBeTruthy();
});

test("na een gewonnen online Potje is er één overwinning en één punt op de lijn meer", async () => {
  await winPotje();
  await openStats();
  await screen.findByRole("img", { name: /Rating over 1 games/ });
  expect(within(cel("Won")).getByText("1")).toBeTruthy();
  cleanup();

  await winPotje();
  await openStats();
  const lijn = await screen.findByRole("img", { name: /Rating over 2 games/ });
  expect(lijn.querySelectorAll("circle")).toHaveLength(2);
  expect(within(cel("Won")).getByText("2")).toBeTruthy();
});

test("Records: tikken toont het Potje en de tegenstander", async () => {
  const p = await winPotje();
  p.eigen = new Map([[1, { zetten: 14, sprongen: 5, doel: true }]]);
  await openStats();
  const sprong = await screen.findByRole("button", { name: /Longest jump/ });
  expect(within(sprong).getByText("5")).toBeTruthy();
  const snel = screen.getByRole("button", { name: /Fastest win/ });
  expect(within(snel).getByText("14")).toBeTruthy();
  expect(screen.queryByText("Against Ben")).toBeNull();

  await fireEvent.click(sprong);
  const detail = screen.getByRole("group", { name: "Longest jump" });
  expect(within(detail).getByText("Game #1")).toBeTruthy();
  expect(within(detail).getByText("Against Ben")).toBeTruthy();
  expect(sprong.getAttribute("aria-expanded")).toBe("true");

  await fireEvent.click(snel);
  expect(within(screen.getByRole("group", { name: "Fastest win" })).getByText("Game #1")).toBeTruthy();
  expect(screen.queryByRole("group", { name: "Longest jump" })).toBeNull();
});

test("zonder online Potjes staat er een rustige lege stand", async () => {
  server.maakPotje([1, 2], 2); // loopt nog
  await openStats();
  expect(await screen.findByText("No online games yet")).toBeTruthy();
  expect(screen.queryByText("Played")).toBeNull();
  expect(screen.queryByRole("alert")).toBeNull();
});

// Taak 172: het blok Achievements.
const blokje = (id: string) => document.querySelector(`[data-prestatie="${id}"]`) as HTMLElement;
const datumVan = (ms: number, taal: string) => new Date(ms).toLocaleDateString(taal, { year: "numeric", month: "short", day: "numeric" });

test("Achievements: wat je hebt is gekleurd met de datum, wat je nog niet hebt is grijs met uitleg", async () => {
  const p = await winPotje();
  p.einde_ms = Date.UTC(2026, 0, 15, 12);
  p.eigen = new Map([[1, { zetten: 14, sprongen: 6 }]]);
  await openStats();
  await screen.findByRole("heading", { name: "Achievements" });
  expect(server.verzoeken).toContain("GET /api/prestaties");
  expect(document.querySelectorAll("[data-prestatie]")).toHaveLength(10);
  const eerste = blokje("first_win");
  expect(eerste.classList.contains("behaald")).toBe(true);
  expect(within(eerste).getByText("First win")).toBeTruthy();
  expect(within(eerste).getByText(`Earned ${datumVan(Date.UTC(2026, 0, 15, 12), "en")}`)).toBeTruthy();
  expect(blokje("jumps_6").classList.contains("behaald")).toBe(true);
  // Nog niet gehaald: grijs, met in één zin hoe je het haalt.
  for (const id of ["wins_10", "wins_50", "wins_100", "jumps_10", "square_win", "six_players_win", "puzzle_streak_7", "five_friends"]) {
    expect(blokje(id).classList.contains("behaald"), id).toBe(false);
  }
  expect(within(blokje("jumps_10")).getByText("Make ten jumps in one move in an online game.")).toBeTruthy();
  expect(within(blokje("puzzle_streak_7")).getByText("Solve the daily puzzle seven days in a row.")).toBeTruthy();
  expect(within(blokje("five_friends")).getByText("Play a game with five different friends.")).toBeTruthy();
});

test("Achievements staan ook zonder afgelopen Potjes in de lijst, allemaal grijs", async () => {
  await openStats();
  await screen.findByRole("heading", { name: "Achievements" });
  expect(document.querySelectorAll("[data-prestatie]")).toHaveLength(10);
  expect(document.querySelectorAll("[data-prestatie].behaald")).toHaveLength(0);
});

test("Achievements in het Arabisch, van rechts naar links, met datum", async () => {
  const p = await winPotje();
  p.einde_ms = Date.UTC(2026, 0, 15, 12);
  await zetTaal("ar", false);
  render(App);
  await fireEvent.click(await screen.findByRole("button", { name: "إحصاءاتي" }));
  await screen.findByRole("heading", { name: "الإنجازات" });
  expect(document.documentElement.dir).toBe("rtl");
  const eerste = blokje("first_win");
  expect(eerste.classList.contains("behaald")).toBe(true);
  expect(within(eerste).getByText("الفوز الأول")).toBeTruthy();
  expect(within(eerste).getByText(`تم الحصول عليه في ${datumVan(Date.UTC(2026, 0, 15, 12), "ar")}`)).toBeTruthy();
  expect(within(blokje("wins_10")).getByText("افز في 10 ألعاب عبر الإنترنت.")).toBeTruthy();
});
