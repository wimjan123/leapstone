import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/svelte";
import { readFileSync } from "node:fs";
import { afterEach, beforeAll, beforeEach, describe, expect, test, vi } from "vitest";
import { initSync } from "./wasm/halma_core.js";
import App from "./App.svelte";
import { NepServer } from "./nep-server";
import { denktijdTekst, lokaleDeadline, restDeel, restSeconden } from "./denktijd";

vi.mock("./bord3d", async () => (await import("./nep-bord3d")).nepModule());

beforeAll(() => {
  initSync({ module: readFileSync("src/wasm/halma_core_bg.wasm") });
});

describe("rekenen aan de denktijd", () => {
  test("de deadline van de server komt in de klok van de telefoon, ook als die klok afwijkt", () => {
    // De server loopt een uur voor; de beurt is over 20 seconden op.
    const serverNu = 1_000_000 + 3_600_000;
    expect(lokaleDeadline(serverNu + 20_000, serverNu, 1_000_000)).toBe(1_020_000);
    // De server loopt 5 seconden achter.
    expect(lokaleDeadline(995_000 + 7_000, 995_000, 1_000_000)).toBe(1_007_000);
    expect(lokaleDeadline(null, serverNu, 1_000_000)).toBeNull();
    // Zonder servertijd: de deadline zoals hij is.
    expect(lokaleDeadline(42, undefined, 1_000_000)).toBe(42);
  });

  test("wat er over is, als deel en in hele seconden", () => {
    expect(restDeel(30_000, 30, 0)).toBe(1);
    expect(restDeel(30_000, 30, 15_000)).toBe(0.5);
    expect(restDeel(30_000, 30, 40_000)).toBe(0);
    expect(restDeel(30_000, 30, -5_000)).toBe(1);
    expect(restSeconden(10_000, 1_500)).toBe(9);
    expect(restSeconden(10_000, 10_000)).toBe(0);
    expect(restSeconden(10_000, 12_000)).toBe(0);
  });

  test("kort voor een knop", () => {
    expect([15, 30, 60, 120].map(denktijdTekst)).toEqual(["15s", "30s", "1m", "2m"]);
  });
});

describe("in de app", () => {
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

  function alsAnna() {
    const anna = server.voegSpelerToe("Anna");
    server.voegSpelerToe("Ben");
    localStorage.setItem("halma.speler", JSON.stringify({ speler_id: anna.speler_id, spelersnaam: "Anna", sleutel: anna.sleutel }));
  }

  // De knoppen liggen als onzichtbare HTML-knoppen boven voorwerpen; het nep-bord legt ze 50 px onder elkaar, dus Start valt
  // buiten het nep-scherm (display: none) en pakken we zelf.
  async function naarKeuze() {
    alsAnna();
    render(App);
    await fireEvent.click(await screen.findByRole("button", { name: "My games" }));
    await fireEvent.click(await screen.findByRole("button", { name: "New game" }));
    await waitFor(() => expect(screen.getByRole("radio", { name: "Star board" })).toBeTruthy());
  }
  const start = async () => {
    await waitFor(() => expect(document.querySelector('[data-voorwerp="start"]')).not.toBeNull());
    return document.querySelector<HTMLButtonElement>('[data-voorwerp="start"]')!;
  };

  test("bij een nieuw online potje kies je de denktijd; standaard 30 seconden", async () => {
    await naarKeuze();
    const strook = screen.getAllByRole("radio").filter((r) => /per move|No time limit/.test(r.getAttribute("aria-label") ?? ""));
    expect(strook).toHaveLength(5);
    expect(screen.getByRole("radio", { name: "30 seconds per move" }).getAttribute("aria-checked")).toBe("true");
    await fireEvent.click(screen.getByRole("radio", { name: "1 minute per move" }));
    await fireEvent.click(await start());
    await screen.findByText("1 seat still open");
    expect(server.potjes[0].denktijd_s).toBe(60);
    expect((await screen.findByTestId("denktijd-badge")).textContent).toContain("1m");
  });

  test("zonder grens stuurt de app null", async () => {
    await naarKeuze();
    await fireEvent.click(screen.getByRole("radio", { name: "No time limit" }));
    await fireEvent.click(await start());
    await screen.findByText("1 seat still open");
    expect(server.potjes[0].denktijd_s).toBeNull();
    expect(screen.getByTestId("denktijd-badge").textContent).not.toMatch(/\d/);
  });

  test("de beurtbalk telt af naar de deadline van de server, ook als de klokken verschillen", async () => {
    alsAnna();
    // De klok van de server loopt een uur voor op die van de telefoon.
    server.nu = () => Date.now() + 3_600_000;
    const p = server.maakPotje([1, 2], 2, "ster", 30);
    localStorage.setItem("halma.potje", "1");
    render(App);
    await screen.findByText("Your turn");
    // Net begonnen: het segment loopt leeg en de cijfers staan er al (taak 235: altijd, niet pas de laatste 10 s).
    const tijd = screen.getByTestId("denktijd");
    expect(Number(tijd.style.getPropertyValue("--rest"))).toBeGreaterThan(0.95);
    expect(parseInt(tijd.style.getPropertyValue("--duur"))).toBeGreaterThan(28_000);
    expect(screen.getByTestId("aftellen").textContent).toMatch(/0:(29|30)/);

    // Nog acht seconden volgens de server: de cijfers lopen mee, en het is nog niet dringend.
    p.beurt_sinds = server.nu() - 22_000;
    p.versie++;
    server.stuur(p);
    await waitFor(() => expect(screen.getByTestId("aftellen").textContent).toContain("8"));
    expect(document.querySelector(".hud.dringend")).toBeNull();

    // Nog drie seconden: dringend.
    p.beurt_sinds = server.nu() - 27_000;
    p.versie++;
    server.stuur(p);
    await waitFor(() => expect(screen.getByTestId("aftellen").textContent).toContain("3"));
    expect(document.querySelector(".hud.dringend")).not.toBeNull();
  });

  test("zonder denktijd telt de beurtbalk niet af", async () => {
    alsAnna();
    server.maakPotje([1, 2], 2, "ster", null);
    localStorage.setItem("halma.potje", "1");
    render(App);
    await screen.findByText("Your turn");
    expect(screen.queryByTestId("denktijd")).toBeNull();
    expect(screen.queryByTestId("aftellen")).toBeNull();
  });

  test("een overgeslagen beurt is kort te zien, zonder zin", async () => {
    alsAnna();
    const p = server.maakPotje([1, 2], 2, "ster", 15);
    localStorage.setItem("halma.potje", "1");
    render(App);
    await screen.findByText("Your turn");
    expect(screen.queryByTestId("overgeslagen")).toBeNull();

    server.slaOver(p);
    expect(await screen.findByText("Ben", { selector: "strong" })).toBeTruthy();
    const teken = screen.getByTestId("overgeslagen");
    // Alleen een kraal en een icoon; de woorden zijn voor schermlezers.
    expect(teken.querySelector(".sr-only")?.textContent).toBe("Turn skipped");
    expect(teken.querySelector("svg")).not.toBeNull();
    expect(document.querySelector(".segment.overgeslagen")).not.toBeNull();
    await waitFor(() => expect(screen.queryByTestId("overgeslagen")).toBeNull(), { timeout: 2500 });
  });

  test("een oude overgeslagen beurt toont niets bij het openen", async () => {
    alsAnna();
    const p = server.maakPotje([1, 2], 2, "ster", 15);
    server.slaOver(p);
    server.slaOver(p);
    localStorage.setItem("halma.potje", "1");
    render(App);
    await screen.findByText("Your turn");
    expect(screen.queryByTestId("overgeslagen")).toBeNull();
  });

  test("Mijn potjes toont de denktijd van een lopend potje", async () => {
    alsAnna();
    server.maakPotje([1, 2], 2, "ster", 120);
    render(App);
    await fireEvent.click(await screen.findByRole("button", { name: "My games" }));
    const badge = await screen.findByTestId("denktijd-badge");
    expect(badge.textContent).toContain("2m");
    expect(badge.textContent).toContain("2 minutes per move");
  });
});
