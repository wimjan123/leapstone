import { cleanup, fireEvent, render, screen } from "@testing-library/svelte";
import { readFileSync } from "node:fs";
import { afterEach, beforeAll, beforeEach, expect, test, vi } from "vitest";
import { initSync } from "./wasm/halma_core.js";
import App from "./App.svelte";
import { nep } from "./nep-bord3d";

// /play/ in de browser opent het Startmenu met het 3D-bord (taak 248; eerder een direct Potje, taak 114).
const omgeving = vi.hoisted(() => ({ isApp: false }));
vi.mock("./omgeving", () => ({
  get IS_APP() {
    return omgeving.isApp;
  },
  get SPEL_PAD() {
    return omgeving.isApp ? "/" : "/play/";
  },
  SERVER: "",
  LINK_BASIS: "http://localhost",
}));
vi.mock("./bord3d", async () => (await import("./nep-bord3d")).nepModule());

beforeAll(() => {
  initSync({ module: readFileSync("src/wasm/halma_core_bg.wasm") });
});
beforeEach(() => {
  nep.reset();
  omgeving.isApp = false;
  localStorage.clear();
});
afterEach(() => {
  cleanup();
  history.replaceState(null, "", "/");
  vi.unstubAllGlobals();
});

const stenen = (speler: number) => document.querySelectorAll(`.steen[data-speler="${speler}"]`);
const inPotje = () => screen.queryByRole("button", { name: "Resign" }) !== null;

test("/play/ in de browser opent het Startmenu, geen Potje", async () => {
  history.replaceState(null, "", "/play/");
  render(App);
  expect(inPotje()).toBe(false);
  expect(stenen(0)).toHaveLength(0);
  expect(await screen.findByRole("button", { name: "Play on this phone" })).toBeTruthy();
});

test("een toestel zonder WebGL2 hoort dat het bord hier niet kan, zonder Try again (opnieuw laden helpt niet) en zonder Startmenu", async () => {
  nep.kan3d = false;
  history.replaceState(null, "", "/play/");
  render(App);
  expect(await screen.findByText("Leapstone can't show the board on this device.")).toBeTruthy();
  expect(screen.queryByRole("button", { name: "Try again" })).toBeNull();
  expect(screen.queryByRole("button", { name: "Play on this phone" })).toBeNull();
  expect(document.querySelector(".bord3d")).toBeNull();
});

test("een build zonder 3D-bord zegt het in de console en toont het foutscherm, ook op een toestel zonder WebGL2", async () => {
  nep.gebouwd = false;
  nep.kan3d = false;
  const fout = vi.spyOn(console, "error").mockImplementation(() => {});
  render(App);
  expect(await screen.findByRole("button", { name: "Try again" })).toBeTruthy();
  expect(screen.queryByText("Leapstone can't show the board on this device.")).toBeNull();
  expect(fout).toHaveBeenCalledWith(expect.stringContaining("web/src/wasm3d"));
  fout.mockRestore();
});

test("/play (zonder schuine streep) opent ook het Startmenu", async () => {
  history.replaceState(null, "", "/play");
  render(App);
  expect(inPotje()).toBe(false);
  expect(await screen.findByRole("button", { name: "Play on this phone" })).toBeTruthy();
});

async function startPotje() {
  history.replaceState(null, "", "/play/");
  render(App);
  await fireEvent.click(await screen.findByRole("button", { name: "Play on this phone" }));
  await fireEvent.click(await screen.findByRole("button", { name: "Star board" }));
  await fireEvent.click(screen.getByRole("button", { name: "Start game" }));
}

test("een Potje uit het Startmenu heeft een weg terug naar het menu (taak 240)", async () => {
  await startPotje();
  expect(await screen.findByRole("button", { name: "Resign" })).toBeTruthy();
  await fireEvent.click(await screen.findByRole("button", { name: "Back to menu" }));
  expect(inPotje()).toBe(false);
  expect(await screen.findByRole("button", { name: "Play on this phone" })).toBeTruthy();
});

test("een Potje uit het Startmenu op /play/ is 3D", async () => {
  await startPotje();
  expect(document.querySelector(".bord3d")).not.toBeNull();
});

test("op / (en andere paden) begint de web-app met het startmenu", async () => {
  render(App);
  expect(inPotje()).toBe(false);
  expect(await screen.findByRole("button", { name: "Play on this phone" })).toBeTruthy();
});

test("een Uitnodiging begint niet in dit Potje", () => {
  history.replaceState(null, "", "/uitnodiging/ABCD-EFGH");
  render(App);
  expect(inPotje()).toBe(false);
  expect(stenen(0)).toHaveLength(0);
});
