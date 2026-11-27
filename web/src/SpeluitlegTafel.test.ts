import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/svelte";
import { readFileSync } from "node:fs";
import { tick } from "svelte";
import { afterEach, beforeAll, beforeEach, expect, test, vi } from "vitest";
import { Potje, initSync } from "./wasm/halma_core.js";
import Speluitleg from "./Speluitleg.svelte";
import { LAK_GRIJS } from "./lak";
import { nep, naarScherm } from "./nep-bord3d";
import { OEFENINGEN, vakOp } from "./speluitleg";
import { SPELER_KLEUREN } from "./spelers";
import { SOORT, VELDEN } from "./voorwerpen";

// Taak 184: de Speluitleg als 3D-tafel. Het 3D-bord is een nep (jsdom kent geen WebGL).
vi.mock("./bord3d", async () => (await import("./nep-bord3d")).nepModule());

let plekken: number[] = [];
beforeAll(() => {
  initSync({ module: readFileSync("src/wasm/halma_core_bg.wasm") });
  const p = new Potje(2);
  plekken = Array.from(p.vak_plekken());
  p.free();
});
beforeEach(() => nep.reset());
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const vak = (p: [number, number]) => vakOp(plekken, p);
const soorten = () => Array.from({ length: nep.voorwerpen.length / VELDEN }, (_, i) => nep.voorwerpen[i * VELDEN]);
/** Het plaatje dat de lakknop (het vierde voorwerp) het laatst kreeg. */
const knopPlaat = () => nep.platenSpec[3];

/** Een vinger op het 3D-bord: neer op vak `van`, in stapjes schuiven naar vak `naar`, los. */
async function sleep(van: number, naar: number) {
  const vlak = document.querySelector(".bord3d")!;
  const a = naarScherm("ster", plekken, van);
  const b = naarScherm("ster", plekken, naar);
  await fireEvent.pointerDown(vlak, { pointerId: 7, clientX: a.x, clientY: a.y, button: 0, pointerType: "touch" });
  for (let k = 1; k <= 5; k++) {
    await fireEvent.pointerMove(vlak, { pointerId: 7, clientX: a.x + ((b.x - a.x) * k) / 5, clientY: a.y + ((b.y - a.y) * k) / 5, pointerType: "touch" });
  }
  await fireEvent.pointerUp(vlak, { pointerId: 7, clientX: b.x, clientY: b.y, button: 0, pointerType: "touch" });
  await tick();
}

async function open() {
  const terug = vi.fn();
  const speel = vi.fn();
  render(Speluitleg, { terug, speel });
  await waitFor(() => expect(nep.voorwerpen.length).toBeGreaterThan(0));
  await waitFor(() => expect(knopPlaat()).toBeTruthy());
  return { terug, speel };
}

test("de Speluitleg is een tafel: Terug, de titel, de plaat met de uitleg en de lakknop; het bord met de oefening en grijze Stenen", async () => {
  await open();
  expect(soorten()).toEqual([SOORT.porselein, SOORT.naamplaat, SOORT.porselein, SOORT.rood]);
  // Geen platte balk en geen wit blad: die zijn voorwerpen geworden.
  expect(document.querySelector("footer.blad")).toBeNull();
  expect(document.querySelector("svg.stukken")).toBeNull();
  // De uitleg staat als tekst op de plaat.
  expect(screen.getByText("Move one step to a neighbouring hole.")).toBeTruthy();
  // Het bord: de stand van de eerste oefening, de eigen Steen in zijn kleur en de andere Stenen grijs.
  const o = OEFENINGEN[0];
  expect(nep.stand[vak(o.eigen)]).toBe(0);
  expect(nep.kleuren.slice(0, 2)).toEqual([SPELER_KLEUREN[0].kleur, LAK_GRIJS].map((k) => parseInt(k.slice(1), 16)));
  // Alleen het doelvakje (één vak) gaat als doel naar het bord.
  expect(nep.doel.vakken).toEqual([vak(o.doel)]);
  // Taak 231: de lakknop zegt al Next maar ligt er dof, en zijn HTML-knop is uit: er is nog niets om verder te gaan.
  expect(knopPlaat().sleutels).toEqual(["learn.next"]);
  expect(knopPlaat().uit).toBe(true);
  expect((screen.getByRole("button", { name: "Next" }) as HTMLButtonElement).disabled).toBe(true);
});

test("een tik op het voorwerp Back gaat terug, en een sleep op het bord doet de Zet van de oefening", async () => {
  const { terug } = await open();
  const lijsten = nep.voorwerpLijsten.length;

  // Een sleep van de eigen Steen naar het doelvakje: de Zet van de oefening.
  const o = OEFENINGEN[0];
  await sleep(vak(o.eigen), vak(o.doel));
  expect(nep.losgelaten.at(-1)).toBe(vak(o.doel));
  await waitFor(() => expect(nep.stand[vak(o.doel)]).toBe(0));
  expect(nep.stand[vak(o.eigen)]).toBe(-1);
  // Nu zegt de lakknop Next, met een HTML-knop erop. Alleen dat plaatje ging opnieuw, niet de lijst.
  await waitFor(() => expect(knopPlaat().uit).toBeFalsy());
  expect(knopPlaat().sleutels).toEqual(["learn.next"]);
  expect(nep.voorwerpLijsten.length).toBe(lijsten);
  const next = screen.getByRole("button", { name: "Next" });
  expect(next.getAttribute("data-voorwerp")).toBe("verder");

  // Een tik op het voorwerp Next: de volgende oefening.
  const eerder = nep.druk.length;
  await fireEvent.pointerDown(next);
  await fireEvent.pointerUp(next);
  await fireEvent.click(next);
  expect(nep.druk.slice(eerder, eerder + 2).map((d) => d.aan)).toEqual([true, false]);
  expect(screen.getByText("Jump over a stone into the empty hole behind it.")).toBeTruthy();
  expect(nep.stand[vak(OEFENINGEN[1].eigen)]).toBe(0);

  // Een tik op het voorwerp Back.
  expect(terug).not.toHaveBeenCalled();
  await fireEvent.click(screen.getByRole("button", { name: "Back" }));
  expect(terug).toHaveBeenCalledOnce();
});

test("een sleep naar een ander vak dan het doelvakje rolt terug, en tikken op het bord werkt ook", async () => {
  await open();
  const o = OEFENINGEN[0];
  const verkeerd = vak([1, 0]);
  await sleep(vak(o.eigen), verkeerd);
  // Terug naar zijn gaatje: de stand is niet veranderd en Next is nog uit.
  expect(nep.losgelaten.at(-1)).toBe(-1);
  expect(nep.stand[vak(o.eigen)]).toBe(0);
  expect((screen.getByRole("button", { name: "Next" }) as HTMLButtonElement).disabled).toBe(true);

  // Tikken: de Steen kiezen (slepen kan hem al gekozen hebben) en dan het doelvakje.
  if (nep.gekozen !== vak(o.eigen)) {
    nep.tikVak("ster", plekken, vak(o.eigen));
    await tick();
  }
  expect(nep.gekozen).toBe(vak(o.eigen));
  nep.tikVak("ster", plekken, vak(o.doel));
  await tick();
  await waitFor(() => expect(nep.stand[vak(o.doel)]).toBe(0));
  expect(await screen.findByRole("button", { name: "Next" })).toBeTruthy();
});

test("na de oefeningen zegt de lakknop Play the computer, en het bord krijgt weer de gewone kleuren", async () => {
  const { speel } = await open();
  for (let i = 0; i < OEFENINGEN.length; i++) {
    const o = OEFENINGEN[i];
    nep.tikVak("ster", plekken, vak(o.eigen));
    await tick();
    const landingen = i === 0 ? [vak(o.doel)] : i === 1 ? [vak([0, 0])] : [vak([1, -1]), vak([-1, 1]), vak([-1, 3])];
    for (const l of landingen) {
      nep.tikVak("ster", plekken, l);
      await tick();
    }
    await fireEvent.click(await screen.findByRole("button", { name: "Next" }));
  }
  expect(screen.getByText("Win by moving all your stones into the opposite point.")).toBeTruthy();
  await waitFor(() => expect(knopPlaat().sleutels).toEqual(["learn.playComputer"]));
  expect(nep.kleuren).toEqual(SPELER_KLEUREN.map((k) => parseInt(k.kleur.slice(1), 16)));
  // Het doel van het spel is een echt Potje: het doel licht niet op (meer dan één vak).
  expect(nep.doel.vakken.length).toBeGreaterThan(1);
  await fireEvent.click(screen.getByRole("button", { name: "Play the computer" }));
  expect(speel).toHaveBeenCalledOnce();
});
