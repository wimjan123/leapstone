import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/svelte";
import { readFileSync } from "node:fs";
import { afterEach, beforeAll, beforeEach, expect, test, vi } from "vitest";
import { initSync } from "./wasm/halma_core.js";

vi.mock("./omgeving", () => ({ IS_APP: true, SERVER: "https://server.example", LINK_BASIS: "https://server.example", SPEL_PAD: "/" }));
const invoke = vi.fn();
vi.mock("@tauri-apps/api/core", () => ({ invoke: (c: string, a?: unknown) => invoke(c, a) }));

import Puzzel from "./Puzzel.svelte";
import { MELDING_ID_BEGIN, MELDING_OPSLAG, PLAN_DAGEN, planMeldingen } from "./puzzelmelding";
import { PUZZEL_OPSLAG } from "./puzzel";

// Het 3D-bord als nep: jsdom kent geen WebGL, en er is alleen nog de tafel (feature 251).
vi.mock("./bord3d", async () => (await import("./nep-bord3d")).nepModule());

beforeAll(() => {
  initSync({ module: readFileSync("src/wasm/halma_core_bg.wasm") });
});

const tijdVan = (jaar: number, maand: number, dag: number, uur = 9) => Math.floor(new Date(jaar, maand - 1, dag, uur, 0, 0).getTime() / 1000);

test("aan zetten plant 9 uur eigen tijd, voor de komende dagen", () => {
  const nu = new Date(2026, 10, 11, 20, 30);
  const m = planMeldingen(nu, null, true);
  expect(m).toHaveLength(PLAN_DAGEN - 1); // 9 uur van vandaag is al voorbij
  expect(m[0]).toEqual({ id: MELDING_ID_BEGIN + 1, tijd: tijdVan(2026, 11, 12) });
  expect(m.every((x) => new Date(x.tijd * 1000).getHours() === 9)).toBe(true);
});

test("voor 9 uur: vandaag staat er ook een Melding", () => {
  const m = planMeldingen(new Date(2026, 10, 11, 7, 0), null, true);
  expect(m).toHaveLength(PLAN_DAGEN);
  expect(m[0]).toEqual({ id: MELDING_ID_BEGIN, tijd: tijdVan(2026, 11, 11) });
});

test("oplossen vóór 9 uur slaat de Melding van vandaag over", () => {
  const m = planMeldingen(new Date(2026, 10, 11, 8, 0), "2026-11-11", true);
  expect(m).toHaveLength(PLAN_DAGEN - 1);
  expect(m[0].tijd).toBe(tijdVan(2026, 11, 12));
});

test("uit zetten plant niets", () => {
  expect(planMeldingen(new Date(2026, 10, 11, 7, 0), null, false)).toEqual([]);
});

test("de Melding volgt de eigen tijd over een maandgrens", () => {
  const m = planMeldingen(new Date(2026, 11, 30, 10, 0), null, true);
  expect(m[0].tijd).toBe(tijdVan(2026, 12, 31));
  expect(m[1].tijd).toBe(tijdVan(2027, 1, 1));
});

let toestemming: string;
beforeEach(() => {
  localStorage.clear();
  toestemming = "granted";
  invoke.mockReset();
  invoke.mockImplementation(async (c: string) => (c === "puzzelmelding_toestemming" ? toestemming : undefined));
  vi.spyOn(navigator, "userAgent", "get").mockReturnValue("Mozilla/5.0 (iPhone; CPU iPhone OS 26_0 like Mac OS X)");
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const nu = () => new Date(2026, 10, 11, 7, 0);
const plannen = () => invoke.mock.calls.filter(([c]) => c === "puzzelmelding_plan").map(([, a]) => a as { momenten: { id: number }[]; titel: string });

test("de schakelaar staat standaard uit en plant niets", async () => {
  render(Puzzel, { terug: () => {}, nu });
  const knop = (await screen.findByLabelText(/Remind me at 9:00/)) as HTMLInputElement;
  expect(knop.checked).toBe(false);
  expect(plannen()).toEqual([]);
});

test("aanzetten vraagt toestemming en plant; uitzetten annuleert alles", async () => {
  render(Puzzel, { terug: () => {}, nu });
  const knop = (await screen.findByLabelText(/Remind me at 9:00/)) as HTMLInputElement;
  await fireEvent.click(knop);
  await waitFor(() => expect(plannen()).toHaveLength(1));
  expect(plannen()[0].momenten).toHaveLength(PLAN_DAGEN);
  expect(plannen()[0].titel).toBe("Puzzle of the day");
  expect(localStorage.getItem(MELDING_OPSLAG)).toBe("1");
  await fireEvent.click(knop);
  await waitFor(() => expect(plannen()).toHaveLength(2));
  expect(plannen()[1].momenten).toEqual([]);
  expect(localStorage.getItem(MELDING_OPSLAG)).toBeNull();
});

test("geen toestemming: de schakelaar blijft uit en er wordt niets gepland", async () => {
  toestemming = "denied";
  render(Puzzel, { terug: () => {}, nu });
  await fireEvent.click(await screen.findByLabelText(/Remind me at 9:00/));
  await screen.findByText(/Notifications are blocked/);
  expect(plannen()).toEqual([]);
  expect(localStorage.getItem(MELDING_OPSLAG)).toBeNull();
});

test("bij het openen met de schakelaar aan en vandaag al opgelost: geen Melding vandaag", async () => {
  localStorage.setItem(MELDING_OPSLAG, "1");
  localStorage.setItem(PUZZEL_OPSLAG, JSON.stringify({ opgelost: "2026-11-11", reeks: 1, beste: { datum: "2026-11-11", zetten: 9 } }));
  render(Puzzel, { terug: () => {}, nu });
  await waitFor(() => expect(plannen()).toHaveLength(1));
  expect(plannen()[0].momenten.map((m) => m.id)).not.toContain(MELDING_ID_BEGIN);
  expect(plannen()[0].momenten).toHaveLength(PLAN_DAGEN - 1);
});

test("buiten de iPhone-app is er geen schakelaar", async () => {
  vi.spyOn(navigator, "userAgent", "get").mockReturnValue("Mozilla/5.0 (Linux; Android 15)");
  render(Puzzel, { terug: () => {}, nu });
  await screen.findByRole("button", { name: "Back" });
  expect(screen.queryByRole("switch", { name: /Remind me at 9:00/ })).toBeNull();
  expect(screen.queryByLabelText(/Remind me at 9:00/)).toBeNull();
});
