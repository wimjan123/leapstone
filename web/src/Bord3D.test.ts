import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/svelte";
import { readFileSync } from "node:fs";
import { tick } from "svelte";
import { afterEach, beforeAll, beforeEach, expect, onTestFinished, test, vi } from "vitest";
import { Potje, initSync } from "./wasm/halma_core.js";
import App from "./App.svelte";
import { schuifBovenToetsenbord, tafelStil, toetsenbordSchuif } from "./toetsenbord";
import { nep, naarScherm } from "./nep-bord3d";
import { schermPunt } from "./spelers";
import { naarSpelers } from "./test-start";

// Het 3D-bord als nep: jsdom kent geen WebGL. Het onthoudt wat de app stuurt en doet tikken na.
vi.mock("./bord3d", async () => (await import("./nep-bord3d")).nepModule());

let potje: Potje;
let plekken: number[];
beforeAll(() => {
  initSync({ module: readFileSync("src/wasm/halma_core_bg.wasm") });
  potje = new Potje(2);
  plekken = Array.from(potje.vak_plekken());
});
beforeEach(() => nep.reset());
afterEach(cleanup);

const punt = (vak: number) => schermPunt("ster", plekken[2 * vak], plekken[2 * vak + 1]);

async function startPotje(knop = /^2\s*players/) {
  render(App);
  await naarSpelers();
  await fireEvent.click(screen.getByLabelText(knop));
  await fireEvent.click(screen.getByRole("button", { name: "Start game" }));
  await waitFor(() => expect(nep.borden.length).toBeGreaterThan(0));
}

async function tik(vak: number, dx = 0, dy = 0) {
  nep.tikVak("ster", plekken, vak, dx, dy);
  await tick();
}

test("het Potje begint op het 3D-bord, met de camera naar het eigen doel", async () => {
  await startPotje();
  expect(document.querySelector("svg.stukken")).toBeNull();
  const bord = nep.borden.at(-1)!;
  expect(bord.vierkant).toBe(false);
  // De camera kijkt naar het midden van het doel van Speler 1.
  const doel = Array.from(potje.doelvakken(0)).map(punt);
  const midden = { x: doel.reduce((s, p) => s + p.x, 0) / doel.length, y: doel.reduce((s, p) => s + p.y, 0) / doel.length };
  expect(bord.kijk.x).toBeCloseTo(midden.x);
  expect(bord.kijk.y).toBeCloseTo(midden.y);
  expect(nep.stand).toEqual(Array.from(potje.stand()));
  // Het doel van de Speler aan de beurt licht op.
  expect(nep.doel).toEqual({ speler: 0, vakken: Array.from(potje.doelvakken(0)) });
});

/** Een eigen steen van Speler 1 die kan zetten, en een vak waar hij heen mag (uit de spelregels). */
function eenZet(): [number, number] {
  const van = Array.from(potje.stand()).findIndex((s, v) => s === 0 && potje.geldige_bestemmingen(v).length > 0);
  return [van, potje.geldige_bestemmingen(van)[0]];
}

/** Een leeg vak waar de steen op `van` niet heen mag. */
function magNiet(van: number): number {
  const mag = new Set(Array.from(potje.geldige_bestemmingen(van)));
  return Array.from(potje.stand()).findIndex((s, v) => s === -1 && !mag.has(v));
}

/** Een vinger op het 3D-bord: neer op vak `van`, schuiven naar vak `naar`, los. */
async function sleep(van: number, naar: number, dx = 0, dy = 0) {
  const vlak = document.querySelector(".bord3d")!;
  const a = naarScherm("ster", plekken, van);
  const b = naarScherm("ster", plekken, naar, dx, dy);
  await fireEvent.pointerDown(vlak, { pointerId: 7, clientX: a.x, clientY: a.y, button: 0, pointerType: "touch" });
  for (let k = 1; k <= 5; k++) {
    const x = a.x + ((b.x - a.x) * k) / 5;
    const y = a.y + ((b.y - a.y) * k) / 5;
    await fireEvent.pointerMove(vlak, { pointerId: 7, clientX: x, clientY: y, pointerType: "touch" });
  }
  await fireEvent.pointerUp(vlak, { pointerId: 7, clientX: b.x, clientY: b.y, button: 0, pointerType: "touch" });
  await tick();
}

test("een ruwe tik kiest een steen en zet hem naar het vak dat de Speler probeert; er licht niets op", async () => {
  await startPotje();
  const [van, naar] = eenZet();
  await tik(van, 0.35, -0.2);
  expect(nep.gekozen).toBe(van);
  // Geen hints: voor toetsenbord en schermlezer is elk leeg vak te proberen, niet alleen de goede.
  const leeg = Array.from(potje.stand()).filter((s) => s === -1).length;
  expect(document.querySelectorAll("[data-gat]")).toHaveLength(leeg);
  expect(document.querySelectorAll("[data-bestemming]")).toHaveLength(0);

  await tik(naar, 0.3, 0.25);
  expect(nep.stand[naar]).toBe(0);
  expect(nep.stand[van]).toBe(-1);
  expect(nep.gekozen).toBe(-1);
  expect(nep.missers).toEqual([]);
  // De steen hupt langs het pad van de Zet, van `van` naar `naar`.
  const b = nep.bewegingen.at(-1)!;
  expect(b.vakken[0]).toBe(van);
  expect(b.vakken.at(-1)).toBe(naar);
  expect(screen.getByText("Player 2", { selector: "strong" })).toBeTruthy();
  // Nu licht het doel van Speler 2 op.
  expect(nep.doel.speler).toBe(1);
});

test("een Zet die niet mag rolt terug en verandert niets", async () => {
  await startPotje();
  const [van] = eenZet();
  const voor = [...nep.stand];
  await tik(van);
  const naar = magNiet(van);
  await tik(naar, 0.1, -0.1);
  expect(nep.missers).toEqual([[van, naar]]);
  // Alles is nog zoals het was: de steen is nog gekozen en de beurt is niet voorbij.
  expect(nep.stand).toEqual(voor);
  expect(nep.gekozen).toBe(van);
  expect(nep.bewegingen).toEqual([]);
  expect(screen.getByText("Player 1", { selector: "strong" })).toBeTruthy();
  // Een steen van de ander proberen mag ook niet.
  const ander = voor.indexOf(1);
  await tik(ander);
  expect(nep.missers.at(-1)).toEqual([van, ander]);
  expect(nep.stand).toEqual(voor);
});

test("een steen slepen naar een vak dat mag: hij valt erin, zonder hup", async () => {
  await startPotje();
  const [van, naar] = eenZet();
  await sleep(van, naar, 0.2, -0.15);
  // Eerst gekozen, dan gesleept en losgelaten boven het vak.
  expect(nep.slepen.at(-1)?.vak).toBe(van);
  expect(nep.losgelaten).toEqual([naar]);
  expect(nep.stand[naar]).toBe(0);
  expect(nep.stand[van]).toBe(-1);
  expect(nep.gekozen).toBe(-1);
  expect(screen.getByText("Player 2", { selector: "strong" })).toBeTruthy();
});

test("loslaten na een snelle sleep kiest het vak onder de vinger, niet waar de laatste beweging was", async () => {
  await startPotje();
  const [van, naar] = eenZet();
  const vlak = document.querySelector(".bord3d")!;
  const a = naarScherm("ster", plekken, van);
  const b = naarScherm("ster", plekken, naar);
  // Een snelle vinger: de laatste beweging die de app ziet, ligt 20 px van de steen af (genoeg om te
  // slepen, maar de andere kant op), en de vinger laat meteen los boven het doelvak.
  const d = Math.hypot(b.x - a.x, b.y - a.y);
  const m = { x: a.x - ((b.x - a.x) / d) * 20, y: a.y - ((b.y - a.y) / d) * 20 };
  await fireEvent.pointerDown(vlak, { pointerId: 9, clientX: a.x, clientY: a.y, button: 0, pointerType: "touch" });
  await fireEvent.pointerMove(vlak, { pointerId: 9, clientX: m.x, clientY: m.y, pointerType: "touch" });
  expect(nep.slepen.at(-1)?.vak).toBe(van);
  await fireEvent.pointerUp(vlak, { pointerId: 9, clientX: b.x, clientY: b.y, button: 0, pointerType: "touch" });
  await tick();
  expect(nep.losgelaten).toEqual([naar]);
  expect(nep.stand[naar]).toBe(0);
  expect(nep.stand[van]).toBe(-1);
});

test("een steen slepen naar een vak dat niet mag: terug naar zijn gaatje, verder niets", async () => {
  await startPotje();
  const [van] = eenZet();
  const voor = [...nep.stand];
  const naar = magNiet(van);
  await sleep(van, naar);
  expect(nep.losgelaten).toEqual([-1]);
  expect(nep.stand).toEqual(voor);
  // Slepen koos de steen: hij blijft gekozen, de beurt loopt nog.
  expect(nep.gekozen).toBe(van);
  expect(screen.getByText("Player 1", { selector: "strong" })).toBeTruthy();
});

test("een vinger op een eigen steen zonder te slepen is een tik, meteen", async () => {
  await startPotje();
  const [van] = eenZet();
  const vlak = document.querySelector(".bord3d")!;
  const a = naarScherm("ster", plekken, van, 0.1, 0.1);
  await fireEvent.pointerDown(vlak, { pointerId: 3, clientX: a.x, clientY: a.y, button: 0, pointerType: "touch" });
  await fireEvent.pointerUp(vlak, { pointerId: 3, clientX: a.x + 3, clientY: a.y, button: 0, pointerType: "touch" });
  await tick();
  expect(nep.gekozen).toBe(van);
  expect(nep.slepen).toEqual([]);
  // Een vinger naast een steen gaat naar de camera van het 3D-bord.
  expect(nep.vingers).toEqual([]);
  const leeg = naarScherm("ster", plekken, magNiet(van));
  await fireEvent.pointerDown(vlak, { pointerId: 4, clientX: leeg.x, clientY: leeg.y, button: 0, pointerType: "touch" });
  expect(nep.vingers.at(-1)).toEqual({ id: 4, fase: 0 });
});

test("boven het toetsenbord geschoven (iOS): een tik waar de steen nu op het scherm staat, kiest die steen", async () => {
  await startPotje();
  const [van] = eenZet();
  // De app (en het 3D-bord) staat 100 px omhoog geschoven.
  const app = document.createElement("div");
  app.id = "app";
  document.body.append(app);
  vi.spyOn(app, "getBoundingClientRect").mockImplementation(() => ({ top: -100 }) as DOMRect);
  const vlak = document.querySelector(".bord3d")!;
  const a = naarScherm("ster", plekken, van, 0.1, 0.1);
  await fireEvent.pointerDown(vlak, { pointerId: 3, clientX: a.x, clientY: a.y - 100, button: 0, pointerType: "touch" });
  await fireEvent.pointerUp(vlak, { pointerId: 3, clientX: a.x, clientY: a.y - 100, button: 0, pointerType: "touch" });
  await tick();
  expect(nep.gekozen).toBe(van);
  app.remove();
});

test("zolang een vinger op het bord staat, staat de tafel stil (ook boven het toetsenbord); los of afgebroken weer vrij", async () => {
  await startPotje();
  const vlak = document.querySelector(".bord3d")!;
  await fireEvent.pointerDown(vlak, { pointerId: 5, clientX: 10, clientY: 10, button: 0, pointerType: "touch" });
  expect(tafelStil()).toBe(true);
  await fireEvent.pointerDown(vlak, { pointerId: 6, clientX: 20, clientY: 20, button: 0, pointerType: "touch" });
  await fireEvent.pointerUp(vlak, { pointerId: 5, clientX: 10, clientY: 10, button: 0, pointerType: "touch" });
  expect(tafelStil()).toBe(true);
  await fireEvent.pointerCancel(vlak, { pointerId: 6, pointerType: "touch" });
  expect(tafelStil()).toBe(false);
  // Een gemist loslaten: de volgende eerste vinger ruimt de oude op, en na zijn loslaten is de tafel vrij.
  await fireEvent.pointerDown(vlak, { pointerId: 7, clientX: 10, clientY: 10, button: 0, pointerType: "touch", isPrimary: true });
  await fireEvent.pointerDown(vlak, { pointerId: 8, clientX: 10, clientY: 10, button: 0, pointerType: "touch", isPrimary: true });
  await fireEvent.pointerUp(vlak, { pointerId: 8, clientX: 10, clientY: 10, button: 0, pointerType: "touch", isPrimary: true });
  expect(tafelStil()).toBe(false);
  // Een gemist loslaten, en de Speler gaat verder buiten het bord (in de Chat): de tafel is vrij.
  await fireEvent.pointerDown(vlak, { pointerId: 10, clientX: 10, clientY: 10, button: 0, pointerType: "touch", isPrimary: true });
  await fireEvent.pointerDown(document.body, { pointerId: 11, clientX: 10, clientY: 10, button: 0, pointerType: "touch", isPrimary: true });
  await fireEvent.pointerUp(document.body, { pointerId: 11, clientX: 10, clientY: 10, button: 0, pointerType: "touch", isPrimary: true });
  expect(tafelStil()).toBe(false);
  // Een vinger die naast het bord loslaat: ook vrij.
  await fireEvent.pointerDown(vlak, { pointerId: 12, clientX: 10, clientY: 10, button: 0, pointerType: "touch", isPrimary: true });
  await fireEvent.pointerUp(document.body, { pointerId: 12, clientX: 10, clientY: 10, button: 0, pointerType: "touch", isPrimary: true });
  expect(tafelStil()).toBe(false);
  // Een klik met een trackpad (ook primair) terwijl een vinger erop staat: de vinger houdt de tafel stil.
  await fireEvent.pointerDown(vlak, { pointerId: 9, clientX: 10, clientY: 10, button: 0, pointerType: "touch", isPrimary: true });
  await fireEvent.pointerDown(vlak, { pointerId: 1, clientX: 30, clientY: 30, button: 2, pointerType: "mouse", isPrimary: true });
  await fireEvent.pointerUp(vlak, { pointerId: 1, clientX: 30, clientY: 30, button: 2, pointerType: "mouse", isPrimary: true });
  expect(tafelStil()).toBe(true);
  await fireEvent.pointerUp(vlak, { pointerId: 9, clientX: 10, clientY: 10, button: 0, pointerType: "touch", isPrimary: true });
  expect(tafelStil()).toBe(false);
});

test("een gemist loslaten: de volgende tik laat de tafel geen moment vrij, dus hij verspringt niet onder die tik", async () => {
  await startPotje();
  const zicht = Object.assign(new EventTarget(), { height: 500, scale: 1, offsetTop: 0 });
  // Het venster van een iPhone, alleen voor deze test: daarna weer zoals het was.
  const eerder = { zicht: Object.getOwnPropertyDescriptor(window, "visualViewport"), hoogte: Object.getOwnPropertyDescriptor(window, "innerHeight") };
  onTestFinished(() => {
    for (const [naam, d] of [["visualViewport", eerder.zicht], ["innerHeight", eerder.hoogte]] as const) {
      if (d) Object.defineProperty(window, naam, d);
      else delete (window as unknown as Record<string, unknown>)[naam];
    }
  });
  Object.defineProperty(window, "visualViewport", { value: zicht, configurable: true });
  Object.defineProperty(window, "innerHeight", { value: 844, configurable: true });
  const zetUit = schuifBovenToetsenbord(window);
  // Het bord staat meteen waar de schuif zegt (zoals bij Verminder beweging).
  const app = document.createElement("div");
  app.id = "app";
  const veld = document.createElement("input");
  document.body.append(app, veld);
  vi.spyOn(app, "getBoundingClientRect").mockImplementation(() => ({ top: -toetsenbordSchuif() }) as DOMRect);
  vi.spyOn(veld, "getBoundingClientRect").mockImplementation(() => ({ top: 560 - toetsenbordSchuif(), bottom: 600 - toetsenbordSchuif() }) as DOMRect);
  veld.focus();
  zicht.dispatchEvent(new Event("resize"));
  expect(toetsenbordSchuif()).toBe(112);
  const vlak = document.querySelector(".bord3d")!;
  await fireEvent.pointerDown(vlak, { pointerId: 7, clientX: 10, clientY: 10, button: 0, pointerType: "touch", isPrimary: true });
  // Het toetsenbord gaat dicht terwijl de vinger erop staat; het loslaten van die vinger komt nooit aan.
  zicht.height = 844;
  zicht.dispatchEvent(new Event("resize"));
  expect(toetsenbordSchuif()).toBe(112);
  await fireEvent.pointerDown(vlak, { pointerId: 8, clientX: 10, clientY: 10, button: 0, pointerType: "touch", isPrimary: true });
  expect(toetsenbordSchuif()).toBe(112);
  await fireEvent.pointerUp(vlak, { pointerId: 8, clientX: 10, clientY: 10, button: 0, pointerType: "touch", isPrimary: true });
  expect(toetsenbordSchuif()).toBe(0);
  zetUit();
  app.remove();
  veld.remove();
});

test("een snelle tik op een eigen steen sleept nooit, ook als de vinger wat rolt; nog een tik laat hem los", async () => {
  await startPotje();
  const [van] = eenZet();
  const vlak = document.querySelector(".bord3d")!;
  const a = naarScherm("ster", plekken, van);
  const vinger = async (id: number) => {
    await fireEvent.pointerDown(vlak, { pointerId: id, clientX: a.x, clientY: a.y, button: 0, pointerType: "touch" });
    await fireEvent.pointerMove(vlak, { pointerId: id, clientX: a.x + 6, clientY: a.y + 4, pointerType: "touch" });
    await fireEvent.pointerMove(vlak, { pointerId: id, clientX: a.x + 10, clientY: a.y + 5, pointerType: "touch" });
    await fireEvent.pointerUp(vlak, { pointerId: id, clientX: a.x + 10, clientY: a.y + 5, button: 0, pointerType: "touch" });
    await tick();
  };
  await vinger(1);
  expect(nep.gekozen).toBe(van);
  expect(nep.slepen).toEqual([]);
  await vinger(2);
  expect(nep.gekozen).toBe(-1);
  expect(nep.slepen).toEqual([]);
  expect(nep.vingers).toEqual([]);
});

test("een vinger die eerst even stilstaat, sleept al na een klein stukje, maar zet dan nooit", async () => {
  await startPotje();
  const [van] = eenZet();
  const vlak = document.querySelector(".bord3d")!;
  const a = naarScherm("ster", plekken, van);
  await fireEvent.pointerDown(vlak, { pointerId: 5, clientX: a.x, clientY: a.y, button: 0, pointerType: "touch" });
  await new Promise((r) => setTimeout(r, 220));
  await fireEvent.pointerMove(vlak, { pointerId: 5, clientX: a.x + 8, clientY: a.y, pointerType: "touch" });
  expect(nep.slepen.at(-1)?.vak).toBe(van);
  expect(nep.gekozen).toBe(van);
  await fireEvent.pointerUp(vlak, { pointerId: 5, clientX: a.x + 8, clientY: a.y, button: 0, pointerType: "touch" });
  // Nauwelijks bewogen: nooit een Zet. Hij valt terug in zijn gaatje en blijft gekozen, zoals na een tik.
  expect(nep.losgelaten).toEqual([van]);
  expect(nep.gekozen).toBe(van);
  // Nog eens zo, nu hij al gekozen is: dat is een tik op de gekozen steen, dus loslaten.
  await fireEvent.pointerDown(vlak, { pointerId: 8, clientX: a.x, clientY: a.y, button: 0, pointerType: "touch" });
  await new Promise((r) => setTimeout(r, 220));
  await fireEvent.pointerMove(vlak, { pointerId: 8, clientX: a.x, clientY: a.y - 9, pointerType: "touch" });
  await fireEvent.pointerUp(vlak, { pointerId: 8, clientX: a.x, clientY: a.y - 9, button: 0, pointerType: "touch" });
  await tick();
  expect(nep.losgelaten).toEqual([van, van]);
  expect(nep.gekozen).toBe(-1);
  expect(nep.stand[van]).toBe(0);
});

test("een tik een paar millimeter naast een eigen steen pakt hem ook (via het 3D-bord)", async () => {
  await startPotje();
  const [van] = eenZet();
  const vlak = document.querySelector(".bord3d")!;
  // Net buiten de greep (12 px naast de rand), maar binnen de ruime tik (24 px).
  const p = naarScherm("ster", plekken, van);
  const buren = Array.from(potje.stand()).flatMap((s, v) => (s === 0 && v !== van ? [naarScherm("ster", plekken, v)] : []));
  // Een richting weg van de andere eigen stenen.
  const richting = [0, 1, 2, 3, 4, 5, 6, 7]
    .map((k) => ({ x: Math.cos((k * Math.PI) / 4), y: Math.sin((k * Math.PI) / 4) }))
    .find((r) => buren.every((b) => Math.hypot(b.x - (p.x + r.x * 30), b.y - (p.y + r.y * 30)) > 40))!;
  const ver = 0.32 * 40 + 18;
  const q = { x: p.x + richting.x * ver, y: p.y + richting.y * ver };
  await fireEvent.pointerDown(vlak, { pointerId: 6, clientX: q.x, clientY: q.y, button: 0, pointerType: "touch" });
  expect(nep.vingers.at(-1)).toEqual({ id: 6, fase: 0 });
  // Bevy meldt de tik als plek op het scherm.
  nep.tik(q.x / 40, q.y / 40);
  await tick();
  expect(nep.gekozen).toBe(van);
});

test("een tik naast het bord laat de keuze los", async () => {
  await startPotje();
  const [van] = eenZet();
  await tik(van);
  expect(nep.gekozen).toBe(van);
  nep.tik(NaN, NaN);
  await tick();
  expect(nep.gekozen).toBe(-1);
});

test("het Vierkant bord voor 4 spelers gaat ook naar het 3D-bord", async () => {
  render(App);
  await naarSpelers("Square board");
  await fireEvent.click(screen.getByLabelText(/^4\s*players/));
  await fireEvent.click(screen.getByRole("button", { name: "Start game" }));
  await waitFor(() => expect(nep.borden.length).toBeGreaterThan(0));
  expect(nep.borden.at(-1)!.vierkant).toBe(true);
  expect(nep.stand).toHaveLength(256);
  for (const s of [0, 1, 2, 3]) expect(nep.stand.filter((v) => v === s)).toHaveLength(13);
});

test("valt het 3D-bord om midden in de app, dan het foutscherm met Try again (er is geen 2D-bord meer)", async () => {
  render(App);
  await naarSpelers();
  const stuk = vi.spyOn(nep, "zet_stand").mockImplementation(() => {
    throw new Error("Bevy is gestopt");
  });
  await fireEvent.click(screen.getByRole("button", { name: "Start game" }));
  expect(await screen.findByRole("button", { name: "Try again" })).toBeTruthy();
  expect(document.querySelector(".bord3d")).toBeNull();
  expect(document.querySelectorAll(".steen")).toHaveLength(0);
  stuk.mockRestore();
});

// ---- Taak 186: inzoomen en schuiven. Bevy doet het zoomen en schuiven zelf (Rust-tests in camera.rs en gebaren.rs); hier
// gaat het om wat de web-app naar Bevy stuurt en wat een vinger ingezoomd nog doet. `nep.inzoomen` laat het nep-bord zoomen.

/** Een lege plek op het bord, ver van de Stenen: het midden. */
function midden(): { x: number; y: number } {
  expect(potje.stand()[60]).toBe(-1);
  return naarScherm("ster", plekken, 60);
}

test("knijpen: twee vingers op lege plekken gaan allebei naar het 3D-bord, zonder keuze, slepen of tik", async () => {
  await startPotje();
  const vlak = document.querySelector(".bord3d")!;
  const m = midden();
  const een = { x: m.x - 20, y: m.y };
  const twee = { x: m.x + 20, y: m.y };
  await fireEvent.pointerDown(vlak, { pointerId: 1, clientX: een.x, clientY: een.y, button: 0, pointerType: "touch" });
  await fireEvent.pointerDown(vlak, { pointerId: 2, clientX: twee.x, clientY: twee.y, button: 0, pointerType: "touch" });
  for (let k = 1; k <= 5; k++) {
    await fireEvent.pointerMove(vlak, { pointerId: 1, clientX: een.x - 6 * k, clientY: een.y, pointerType: "touch" });
    await fireEvent.pointerMove(vlak, { pointerId: 2, clientX: twee.x + 6 * k, clientY: twee.y, pointerType: "touch" });
  }
  await fireEvent.pointerUp(vlak, { pointerId: 2, clientX: twee.x + 30, clientY: twee.y, button: 0, pointerType: "touch" });
  await fireEvent.pointerUp(vlak, { pointerId: 1, clientX: een.x - 30, clientY: een.y, button: 0, pointerType: "touch" });
  await tick();
  // Bevy kreeg beide vingers, met hun plekken: neer, de bewegingen, los.
  const ids = new Set(nep.vingerPlekken.map((v) => v.id));
  expect(ids).toEqual(new Set([1, 2]));
  expect(nep.vingerPlekken.filter((v) => v.fase === 0)).toHaveLength(2);
  expect(nep.vingerPlekken.filter((v) => v.fase === 1)).toHaveLength(10);
  expect(nep.vingerPlekken.filter((v) => v.fase === 2)).toHaveLength(2);
  expect(nep.vingerPlekken.at(-1)).toMatchObject({ id: 1, fase: 2, x: een.x - 30 });
  // De web-app deed zelf niets met het bord.
  expect(nep.slepen).toEqual([]);
  expect(nep.gekozen).toBe(-1);
  expect(nep.losgelaten).toEqual([]);
  expect(nep.missers).toEqual([]);
});

test("knijpen met de eerste vinger op een eigen steen: de steen blijft liggen en beide vingers zoomen", async () => {
  await startPotje();
  const [van] = eenZet();
  const vlak = document.querySelector(".bord3d")!;
  const a = naarScherm("ster", plekken, van);
  const b = midden();
  await fireEvent.pointerDown(vlak, { pointerId: 1, clientX: a.x, clientY: a.y, button: 0, pointerType: "touch" });
  // Nog geen vinger bij Bevy: de eerste vinger houdt de steen vast tot hij een tik of sleep is.
  expect(nep.vingers).toEqual([]);
  await fireEvent.pointerDown(vlak, { pointerId: 2, clientX: b.x, clientY: b.y, button: 0, pointerType: "touch" });
  // De tweede vinger maakt er knijpen van: allebei naar Bevy, de steen niet gekozen of gesleept.
  expect(nep.vingers).toEqual([
    { id: 1, fase: 0 },
    { id: 2, fase: 0 },
  ]);
  await fireEvent.pointerMove(vlak, { pointerId: 2, clientX: b.x + 40, clientY: b.y, pointerType: "touch" });
  await fireEvent.pointerUp(vlak, { pointerId: 2, clientX: b.x + 40, clientY: b.y, button: 0, pointerType: "touch" });
  await fireEvent.pointerUp(vlak, { pointerId: 1, clientX: a.x, clientY: a.y, button: 0, pointerType: "touch" });
  await tick();
  expect(nep.slepen).toEqual([]);
  expect(nep.gekozen).toBe(-1);
  expect(nep.losgelaten).toEqual([]);
  expect(nep.vingers.filter((v) => v.fase === 2).map((v) => v.id).sort()).toEqual([1, 2]);
});

test("ingezoomd: een vinger op een lege plek gaat naar Bevy om het beeld te schuiven, een vinger op een eigen steen sleept hem", async () => {
  await startPotje();
  const [van, naar] = eenZet();
  const vlak = document.querySelector(".bord3d")!;
  // Het bord ligt 2,5 keer zo groot, met het begin ver naar links boven.
  nep.inzoomen(2.5, -500, -700);
  const leeg = nep.opScherm(punt(60));
  await fireEvent.pointerDown(vlak, { pointerId: 3, clientX: leeg.x, clientY: leeg.y, button: 0, pointerType: "touch" });
  for (let k = 1; k <= 4; k++) {
    await fireEvent.pointerMove(vlak, { pointerId: 3, clientX: leeg.x + 15 * k, clientY: leeg.y + 5 * k, pointerType: "touch" });
  }
  await fireEvent.pointerUp(vlak, { pointerId: 3, clientX: leeg.x + 60, clientY: leeg.y + 20, button: 0, pointerType: "touch" });
  await tick();
  expect(nep.vingerPlekken.map((v) => v.fase)).toEqual([0, 1, 1, 1, 1, 2]);
  expect(nep.vingerPlekken[1]).toMatchObject({ id: 3, x: leeg.x + 15, y: leeg.y + 5 });
  expect(nep.slepen).toEqual([]);
  expect(nep.gekozen).toBe(-1);

  // Een eigen steen slepen werkt ingezoomd zoals in het overzicht: pakken binnen 12 px, slepen na 12 px, vallen waar de vinger loslaat.
  nep.vingerPlekken = [];
  const a = nep.opScherm(punt(van));
  const b = nep.opScherm(punt(naar));
  await fireEvent.pointerDown(vlak, { pointerId: 4, clientX: a.x + 5, clientY: a.y, button: 0, pointerType: "touch" });
  for (let k = 1; k <= 5; k++) {
    const x = a.x + 5 + ((b.x - a.x - 5) * k) / 5;
    const y = a.y + ((b.y - a.y) * k) / 5;
    await fireEvent.pointerMove(vlak, { pointerId: 4, clientX: x, clientY: y, pointerType: "touch" });
  }
  await fireEvent.pointerUp(vlak, { pointerId: 4, clientX: b.x, clientY: b.y, button: 0, pointerType: "touch" });
  await tick();
  expect(nep.vingerPlekken).toEqual([]);
  expect(nep.slepen.at(-1)?.vak).toBe(van);
  expect(nep.losgelaten).toEqual([naar]);
  expect(nep.stand[naar]).toBe(0);
  expect(nep.stand[van]).toBe(-1);
  expect(screen.getByText("Player 2", { selector: "strong" })).toBeTruthy();
});

test("ingezoomd: een tik op een eigen steen kiest hem, een tik ernaast met een gekozen steen is een poging", async () => {
  await startPotje();
  const [van] = eenZet();
  const vlak = document.querySelector(".bord3d")!;
  nep.inzoomen(2, -300, -500);
  const a = nep.opScherm(punt(van));
  await fireEvent.pointerDown(vlak, { pointerId: 5, clientX: a.x, clientY: a.y, button: 0, pointerType: "touch" });
  await fireEvent.pointerUp(vlak, { pointerId: 5, clientX: a.x + 2, clientY: a.y, button: 0, pointerType: "touch" });
  await tick();
  expect(nep.gekozen).toBe(van);
  expect(nep.slepen).toEqual([]);
  // Een tik op een leeg vak dat niet mag, met de steen gekozen: hij rolt terug.
  const naar = magNiet(van);
  const q = nep.opScherm(punt(naar));
  await fireEvent.pointerDown(vlak, { pointerId: 6, clientX: q.x, clientY: q.y, button: 0, pointerType: "touch" });
  nep.tik(punt(naar).x, punt(naar).y);
  await tick();
  expect(nep.missers.at(-1)).toEqual([van, naar]);
});
