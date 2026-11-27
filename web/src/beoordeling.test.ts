import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/svelte";
import { readFileSync } from "node:fs";
import { afterEach, beforeAll, beforeEach, expect, test, vi } from "vitest";
import { initSync } from "./wasm/halma_core.js";
import App from "./App.svelte";
import { nep } from "./nep-bord3d";
import { naarSpelers } from "./test-start";

// De beoordelingsvraag van Apple: alleen in de iPhone-app, na een winst (de regels voor de tijd staan in beoordelingsregel.test.ts).
const app = vi.hoisted(() => ({ isApp: true }));
vi.mock("./omgeving", () => ({
  get IS_APP() {
    return app.isApp;
  },
  SERVER: "https://server.example",
  LINK_BASIS: "https://server.example",
  get SPEL_PAD() {
    return app.isApp ? "/" : "/play/";
  },
}));
vi.mock("./bord3d", async () => (await import("./nep-bord3d")).nepModule());
const invoke = vi.fn();
vi.mock("@tauri-apps/api/core", () => ({ invoke: (c: string) => invoke(c) }));

const IPHONE = "Mozilla/5.0 (iPhone; CPU iPhone OS 26_0 like Mac OS X)";
const ANDROID = "Mozilla/5.0 (Linux; Android 15; Pixel 8)";

beforeAll(() => {
  initSync({ module: readFileSync("src/wasm/halma_core_bg.wasm") });
});
beforeEach(() => {
  nep.reset();
  localStorage.clear();
  invoke.mockReset();
  invoke.mockResolvedValue(undefined);
  app.isApp = true;
  vi.spyOn(navigator, "userAgent", "get").mockReturnValue(IPHONE);
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const beoordelingen = () => invoke.mock.calls.filter((c) => c[0] === "vraag_beoordeling");
const wacht = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Opgeven door Speler 1 (een mens): Speler 2 (ook een mens) wint. */
async function opgeven() {
  await fireEvent.click(screen.getByRole("button", { name: "Resign" }));
  await fireEvent.click(screen.getByRole("button", { name: "Yes, resign" }));
  expect(await screen.findByText("Player 2 wins!")).toBeTruthy();
}

async function startPotjeVoor2() {
  await naarSpelers();
  await fireEvent.click(screen.getByLabelText(/^2\s*players/));
  await fireEvent.click(screen.getByRole("button", { name: "Start game" }));
}

test("iPhone-app: na de eerste winst vraagt de app één keer om een beoordeling, na een tweede winst niet", async () => {
  render(App);
  await startPotjeVoor2();
  await opgeven();
  expect(beoordelingen()).toHaveLength(0); // niet meteen: eerst even het winstscherm laten zien
  await waitFor(() => expect(beoordelingen()).toHaveLength(1), { timeout: 4000 });
  expect(localStorage.getItem("leapstone.beoordeling.vragen")).not.toBeNull();

  await fireEvent.click(screen.getByRole("button", { name: "New game" }));
  await fireEvent.click(await screen.findByRole("button", { name: "Start game" }));
  await opgeven();
  await wacht(2200);
  expect(beoordelingen()).toHaveLength(1);
}, 40000);

test("web-app: nooit een beoordelingsvraag", async () => {
  app.isApp = false;
  render(App);
  await startPotjeVoor2();
  await opgeven();
  await wacht(2200);
  expect(beoordelingen()).toHaveLength(0);
  expect(localStorage.getItem("leapstone.beoordeling.vragen")).toBeNull();
}, 30000);

test("Android-app: nooit een beoordelingsvraag", async () => {
  vi.spyOn(navigator, "userAgent", "get").mockReturnValue(ANDROID);
  render(App);
  await startPotjeVoor2();
  await opgeven();
  await wacht(2200);
  expect(beoordelingen()).toHaveLength(0);
}, 30000);
