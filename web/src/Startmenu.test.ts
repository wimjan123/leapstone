import { cleanup, fireEvent, render, screen } from "@testing-library/svelte";
import { readFileSync } from "node:fs";
import { afterEach, beforeAll, expect, test, vi } from "vitest";
import { initSync } from "./wasm/halma_core.js";
import Startmenu from "./Startmenu.svelte";
import { computers, naarComputer } from "./test-start";

// Het 3D-bord als nep: jsdom kent geen WebGL, en er is alleen nog de tafel (feature 251).
vi.mock("./bord3d", async () => (await import("./nep-bord3d")).nepModule());

beforeAll(() => {
  initSync({ module: readFileSync("src/wasm/halma_core_bg.wasm") });
});
afterEach(cleanup);

test("Computer → Start: jij op plek 1 tegen één Computer op normaal", async () => {
  const start = vi.fn();
  render(Startmenu, { start, online: vi.fn() });
  await naarComputer();
  await fireEvent.click(screen.getByRole("button", { name: "Start game" }));
  expect(start).toHaveBeenCalledWith({ vorm: "ster", aantal: 2, niveaus: [null, 1], computer: true });
});

test("Computer: het gekozen niveau geldt voor elke Computer", async () => {
  const start = vi.fn();
  render(Startmenu, { start, online: vi.fn() });
  await naarComputer();
  await fireEvent.click(await screen.findByRole("radio", { name: computers(3) }));
  await fireEvent.click(screen.getByRole("radio", { name: "Easy" }));
  await fireEvent.click(screen.getByRole("button", { name: "Start game" }));
  expect(start).toHaveBeenCalledWith({ vorm: "ster", aantal: 4, niveaus: [null, 0, 0, 0], computer: true });
});

test("een vorige keuze tegen de computer begint weer bij Computer, met dezelfde keuzes", async () => {
  const start = vi.fn();
  render(Startmenu, {
    start,
    online: vi.fn(),
    vorige: { vorm: "vierkant", aantal: 4, niveaus: [null, 0, 0, 0], computer: true },
  });
  await fireEvent.click(await screen.findByRole("button", { name: "Start game" }));
  expect(start).toHaveBeenCalledWith({ vorm: "vierkant", aantal: 4, niveaus: [null, 0, 0, 0], computer: true });
});

test("Play online start meteen een Snel potje; Friends gaat naar de Vriendenlijst en de ronde knop naar Mijn potjes", async () => {
  const online = vi.fn();
  render(Startmenu, { start: vi.fn(), online });
  await fireEvent.click(await screen.findByRole("button", { name: "Play online" }));
  expect(online).toHaveBeenLastCalledWith("snel");
  await fireEvent.click(screen.getByRole("button", { name: "Play online with friends" }));
  expect(online).toHaveBeenLastCalledWith("vrienden");
  await fireEvent.click(screen.getByRole("button", { name: "My games" }));
  expect(online).toHaveBeenLastCalledWith("mijn");
});

test("Sound: standaard aan, uitzetten wordt onthouden op het toestel (taak 158)", async () => {
  localStorage.clear();
  const { unmount } = render(Startmenu, { start: vi.fn(), online: vi.fn() });
  const knop = await screen.findByRole("switch", { name: /Sound/ });
  expect(knop.getAttribute("aria-checked")).toBe("true");
  await fireEvent.click(knop);
  expect(knop.getAttribute("aria-checked")).toBe("false");
  expect(localStorage.getItem("leapstone.geluid")).toBe("uit");
  unmount();
  render(Startmenu, { start: vi.fn(), online: vi.fn() });
  expect((await screen.findByRole("switch", { name: /Sound/ })).getAttribute("aria-checked")).toBe("false");
  localStorage.clear();
});

test("Vibration: standaard aan, los van Sound, uitzetten wordt onthouden op het toestel (taak 159)", async () => {
  localStorage.clear();
  const { unmount } = render(Startmenu, { start: vi.fn(), online: vi.fn() });
  const knop = await screen.findByRole("switch", { name: /Vibration/ });
  expect(knop.getAttribute("aria-checked")).toBe("true");
  await fireEvent.click(knop);
  expect(knop.getAttribute("aria-checked")).toBe("false");
  expect(localStorage.getItem("leapstone.trillen")).toBe("uit");
  expect((await screen.findByRole("switch", { name: /Sound/ })).getAttribute("aria-checked")).toBe("true");
  unmount();
  render(Startmenu, { start: vi.fn(), online: vi.fn() });
  expect((await screen.findByRole("switch", { name: /Vibration/ })).getAttribute("aria-checked")).toBe("false");
  localStorage.clear();
});
