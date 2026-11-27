import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/svelte";
import { readFileSync } from "node:fs";
import { tick } from "svelte";
import { afterEach, beforeAll, beforeEach, expect, test, vi } from "vitest";
import { DagelijksePuzzel, Potje, initSync } from "./wasm/halma_core.js";
import Puzzel from "./Puzzel.svelte";
import { LAK_GRIJS } from "./lak";
import { nep, naarScherm } from "./nep-bord3d";
import { SPELER_KLEUREN } from "./spelers";
import { SOORT, VELDEN } from "./voorwerpen";

// Taak 187: de Dagelijkse puzzel als 3D-tafel. Het 3D-bord is een nep (jsdom kent geen WebGL).
vi.mock("./bord3d", async () => (await import("./nep-bord3d")).nepModule());

const dag = () => new Date(2026, 10, 11, 10, 0, 0);
beforeAll(() => initSync({ module: readFileSync("src/wasm/halma_core_bg.wasm") }));
beforeEach(() => {
  localStorage.clear();
  nep.reset();
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const soorten = () => Array.from({ length: nep.voorwerpen.length / VELDEN }, (_, i) => nep.voorwerpen[i * VELDEN]);
/** Het plaatje dat de lakknop (het vijfde voorwerp) het laatst kreeg. */
const knopPlaat = () => nep.platenSpec[4];

/**
 * Het vak van de eerste Steen van de Speler dat een buur heeft die leeg is, en dat buurvak (een stap). */
function eenStap() {
  const p = new DagelijksePuzzel(2026, 11, 11);
  const stand = Array.from(p.stand());
  const ruw = Array.from(p.vak_plekken());
  // Het 3D-bord (en dit nep-bord) legt elk vak op de ligging van het Sterbord van een Potje, ook in de puzzel: een tik of sleep
  // naar een leeg vak komt daar binnen. De draai met het doel bovenaan geldt alleen voor het 2D-bord (taak 249).
  const potje = new Potje(2);
  const plekken = Array.from(potje.vak_plekken());
  potje.free();
  p.free();
  const buren = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, -1], [-1, 1]];
  const vakAt = (q: number, r: number) => {
    for (let v = 0; v < ruw.length / 2; v++) if (ruw[2 * v] === q && ruw[2 * v + 1] === r) return v;
    return -1;
  };
  for (let v = 0; v < stand.length; v++) {
    if (stand[v] !== 0) continue;
    for (const [dq, dr] of buren) {
      const b = vakAt(ruw[2 * v] + dq, ruw[2 * v + 1] + dr);
      if (b >= 0 && stand[b] === -1) return { plekken, van: v, naar: b };
    }
  }
  throw new Error("geen stap");
}

async function open() {
  const terug = vi.fn();
  render(Puzzel, { terug, nu: dag });
  await waitFor(() => expect(nep.voorwerpen.length).toBeGreaterThan(0));
  await waitFor(() => expect(knopPlaat()).toBeTruthy());
  return { terug };
}

test("de puzzel is een tafel: Terug, de titel, de plaat, Start over en de lakknop; het bord met de eigen Steen en grijze Stenen", async () => {
  await open();
  expect(soorten()).toEqual([SOORT.porselein, SOORT.naamplaat, SOORT.porselein, SOORT.porselein, SOORT.rood]);
  // Geen platte balk, geen blad en geen platte bord: die zijn voorwerpen of het 3D-bord geworden.
  expect(document.querySelector(".blad.laag")).toBeNull();
  expect(document.querySelector("svg.stukken")).toBeNull();
  // Het Streefgetal en het aantal Zetten staan als tekst op de plaat.
  expect(screen.getByText(/Moves: 0/)).toBeTruthy();
  expect(screen.getByText(/goal/i)).toBeTruthy();
  expect(nep.kleuren.slice(0, 2)).toEqual([SPELER_KLEUREN[0].kleur, LAK_GRIJS].map((k) => parseInt(k.slice(1), 16)));
  // Nog niets om te doen (taak 231): de lakknop zegt Done en ligt er dof, zijn HTML-knop is uit, en Start over ligt er ook dof.
  expect(knopPlaat().sleutels).toEqual(["game.done"]);
  expect(knopPlaat().uit).toBe(true);
  expect(nep.platenSpec[3].uit).toBe(true);
  expect(screen.queryByRole("button", { name: "Share" })).toBeNull();
  expect((screen.getByRole("button", { name: "Done" }) as HTMLButtonElement).disabled).toBe(true);
  expect((screen.getByRole("button", { name: "Start over" }) as HTMLButtonElement).disabled).toBe(true);
});

test("tikken op het bord zet een Steen; Start over (een voorwerp) zet hem terug; Back gaat terug", async () => {
  const { terug } = await open();
  const { plekken, van, naar } = eenStap();
  nep.tikVak("ster", plekken, van);
  await tick();
  nep.tikVak("ster", plekken, naar);
  await tick();
  await waitFor(() => expect(screen.getByText(/Moves: 1/)).toBeTruthy());
  expect(nep.stand[naar]).toBe(0);

  const opnieuw = screen.getByRole("button", { name: "Start over" }) as HTMLButtonElement;
  expect(opnieuw.disabled).toBe(false);
  expect(opnieuw.getAttribute("data-voorwerp")).toBe("opnieuw");
  const eerder = nep.druk.length;
  await fireEvent.pointerDown(opnieuw);
  await fireEvent.pointerUp(opnieuw);
  await fireEvent.click(opnieuw);
  expect(nep.druk.slice(eerder, eerder + 2).map((d) => d.aan)).toEqual([true, false]);
  await waitFor(() => expect(screen.getByText(/Moves: 0/)).toBeTruthy());
  expect(nep.stand[van]).toBe(0);

  await fireEvent.click(screen.getByRole("button", { name: "Back" }));
  expect(terug).toHaveBeenCalledOnce();
});

test("een sleep op het bord doet de Zet, en een sleep naar een vak dat niet mag rolt terug", async () => {
  await open();
  const { plekken, van, naar } = eenStap();
  const vlak = document.querySelector(".bord3d")!;
  const sleep = async (a: number, b: number) => {
    const p = naarScherm("ster", plekken, a), q = naarScherm("ster", plekken, b);
    await fireEvent.pointerDown(vlak, { pointerId: 7, clientX: p.x, clientY: p.y, button: 0, pointerType: "touch" });
    for (let k = 1; k <= 5; k++) await fireEvent.pointerMove(vlak, { pointerId: 7, clientX: p.x + ((q.x - p.x) * k) / 5, clientY: p.y + ((q.y - p.y) * k) / 5, pointerType: "touch" });
    await fireEvent.pointerUp(vlak, { pointerId: 7, clientX: q.x, clientY: q.y, button: 0, pointerType: "touch" });
    await tick();
  };
  await sleep(van, naar);
  await waitFor(() => expect(nep.stand[naar]).toBe(0));
  expect(nep.stand[van]).toBe(-1);
  expect(screen.getByText(/Moves: 1/)).toBeTruthy();
});
