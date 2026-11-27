// De keuzeschermen voor een nieuw Potje als 3D-tafel (taak 188): Play on this phone (bord, Spelers) en Computer.
// Bevy is hier het nep-bord (jsdom kent geen WebGL): het onthoudt wat de app stuurt en zegt waar de voorwerpen liggen.
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/svelte";
import { readFileSync } from "node:fs";
import { afterEach, beforeAll, beforeEach, expect, test, vi } from "vitest";
import { Potje, initSync } from "./wasm/halma_core.js";
import Startmenu from "./Startmenu.svelte";
import { nep } from "./nep-bord3d";
import { zetTaal } from "./taal.svelte";
import { SOORT, VELDEN, knopPlek, vakVan, voorwerpLijst, type Voorwerp } from "./voorwerpen";
import { bordKeuze, bordRand, computerKeuze, plekKleur, spelersKeuze } from "./keuzetafel";
import { schermPunt } from "./spelers";
import { tafelStand } from "./voorwerpen-lijsten";

vi.mock("./bord3d", async () => (await import("./nep-bord3d")).nepModule());

beforeAll(() => {
  initSync({ module: readFileSync("src/wasm/halma_core_bg.wasm") });
});
beforeEach(() => {
  nep.reset();
  localStorage.clear();
});
afterEach(async () => {
  cleanup();
  await zetTaal("en", false);
});

async function openTafel(props: Record<string, unknown> = {}) {
  const start = vi.fn();
  render(Startmenu, { start, online: vi.fn(), ...props });
  await waitFor(() => expect(document.querySelector(".tafel-knop")).not.toBeNull());
  return { start };
}
const knop = (naam: string | RegExp) => screen.getByRole("button", { name: naam });
const keuze = (naam: string | RegExp) => screen.getByRole("radio", { name: naam });
/** Een tik op een voorwerp: een vinger op de onzichtbare knop (het voorwerp zakt) en dan de tik. */
async function tik(k: HTMLElement) {
  await fireEvent.pointerDown(k);
  await fireEvent.pointerUp(k);
  await fireEvent.click(k, { detail: 1 });
}
const spelersOpBord = () => [...new Set(nep.stand.filter((s) => s >= 0))].length;
/** De lijst die Bevy het laatst kreeg, soort per voorwerp. */
const soorten = () => Array.from({ length: nep.voorwerpen.length / VELDEN }, (_, i) => nep.voorwerpen[i * VELDEN]);

test("Play on this phone: het bord kiezen is een tik op een plaat, met het Sterbord van zes Spelers op de tafel", async () => {
  await openTafel();
  await tik(knop("Play on this phone"));
  expect(screen.getByRole("heading", { name: "Choose a board" })).toBeTruthy();
  expect(nep.borden.at(-1)?.vierkant).toBe(false);
  expect(spelersOpBord()).toBe(6);
  // Terug, de titel en twee platen van porselein; elke plaat heeft zijn plaatje en zijn knop.
  expect(soorten()).toEqual([SOORT.porselein, SOORT.naamplaat, SOORT.porselein, SOORT.porselein]);
  expect(nep.platen.at(-1)!.ids).toEqual(bordKeuze({ ster: "", vierkant: "" }).map((v) => v.plaat?.id ?? null));
  expect(screen.getByRole("button", { name: "Star board" }).textContent).toBe("Star board");
  // De knop ligt op het voorwerp.
  const lijst = bordKeuze({ ster: "", vierkant: "" });
  const i = lijst.findIndex((v) => v.id === "vierkant");
  const k = knop("Square board");
  expect(k.getAttribute("data-voorwerp")).toBe("vierkant");
  const vak = vakVan(nep.vakken, i)!;
  expect(parseFloat(k.style.left)).toBe(knopPlek(vak).left);
  expect(nep.voorwerpen.slice(0, VELDEN)).toEqual(Array.from(voorwerpLijst(lijst, false).slice(0, VELDEN)));
});

test("Bord kiezen: elke plaat toont zijn bord, en het bord op de tafel volgt de plaat waar de vinger op staat", async () => {
  const { start } = await openTafel();
  await tik(knop("Play on this phone"));
  expect(nep.platenSpec[2]?.bord?.vierkant).toBe(false);
  expect(nep.platenSpec[3]?.bord?.vierkant).toBe(true);
  const lijst = [...nep.voorwerpen];
  // Vinger neer op Square board: de tafel toont het Vierkant bord met vier Spelers, en de keuze is nog niet gemaakt.
  await fireEvent.pointerDown(knop("Square board"));
  expect(nep.borden.at(-1)?.vierkant).toBe(true);
  expect(spelersOpBord()).toBe(4);
  expect(screen.getByRole("heading", { name: "Choose a board" })).toBeTruthy();
  // De voorwerpen blijven liggen: de camera past niet opnieuw, de plaat blijft onder de vinger.
  expect([...nep.voorwerpen]).toEqual(lijst);
  await fireEvent.pointerCancel(knop("Square board"));
  await fireEvent.pointerDown(knop("Star board"));
  expect(nep.borden.at(-1)?.vierkant).toBe(false);
  expect(spelersOpBord()).toBe(6);
  // Met het toetsenbord op een plaat komen toont ook dat bord.
  await fireEvent.focus(knop("Square board"));
  expect(nep.borden.at(-1)?.vierkant).toBe(true);
  // Een tik op Star board kiest het Sterbord, ook al toonde de tafel net het Vierkant bord.
  await tik(knop("Star board"));
  expect(nep.borden.at(-1)?.vierkant).toBe(false);
  await tik(knop("Start game"));
  expect(start).toHaveBeenCalledWith({ vorm: "ster", aantal: 2, niveaus: [null, null] });
});

test("Bord kiezen: de voorwerpen reiken tot buiten het Vierkant bord, zodat de camera bij beide borden gelijk staat", () => {
  const l = bordKeuze({ ster: "A", vierkant: "B" });
  // De rand van het Vierkant bord ligt 9,27 vak van het midden (lak.rs: VIERKANT_RAND - 0,1); het Sterbord is smaller.
  expect(Math.max(...l.map((v) => Math.abs(v.x) + v.b / 2))).toBeGreaterThanOrEqual(9.27);
  for (const v of l) expect(Math.abs(v.z) - v.d / 2, v.id).toBeGreaterThan(9.27);
  for (const a of l) for (const b of l) {
    if (a === b) continue;
    const over = Math.abs(a.x - b.x) < (a.b + b.b) / 2 - 1e-6 && Math.abs(a.z - b.z) < (a.d + b.d) / 2 - 1e-6;
    expect(over, `${a.id} en ${b.id}`).toBe(false);
  }
});

test("Back op het kiezen van het bord gaat naar het menu, met de voorwerpen van het menu", async () => {
  await openTafel();
  await tik(knop("Play on this phone"));
  await tik(knop("Back"));
  expect(screen.getByRole("button", { name: "Play on this phone" })).toBeTruthy();
  expect(soorten()).toContain(SOORT.lade);
});

test("Square board kiezen: de Spelers staan op het Vierkant bord met twee Spelers, de plekken zijn naamplaten met een Steen", async () => {
  const { start } = await openTafel();
  await tik(knop("Play on this phone"));
  await tik(knop("Square board"));
  expect(screen.getByRole("heading", { name: "Choose the players" })).toBeTruthy();
  expect(nep.borden.at(-1)?.vierkant).toBe(true);
  expect(spelersOpBord()).toBe(2);
  // Twee plekken, op het Vierkant bord alleen 2 en 4 Spelers.
  expect(screen.getAllByRole("button", { name: /^Seat \d: / })).toHaveLength(2);
  expect(keuze("2 players").getAttribute("aria-checked")).toBe("true");
  expect(screen.getAllByRole("radio")).toHaveLength(2);
  expect(screen.queryByRole("radio", { name: "3 players" })).toBeNull();
  await tik(knop("Start game"));
  expect(start).toHaveBeenCalledWith({ vorm: "vierkant", aantal: 2, niveaus: [null, null] });
});

test("Spelers: een ander aantal zet de Stenen van die Spelers op het bord, een tik op een plek wisselt Speler en Computer", async () => {
  const { start } = await openTafel();
  await tik(knop("Play on this phone"));
  await tik(knop("Star board"));
  expect(screen.getAllByRole("radio")).toHaveLength(4);
  await tik(keuze("4 players"));
  expect(spelersOpBord()).toBe(4);
  expect(keuze("4 players").getAttribute("aria-checked")).toBe("true");
  expect(keuze("2 players").getAttribute("aria-checked")).toBe("false");
  expect(screen.getAllByRole("button", { name: /^Seat \d: / })).toHaveLength(4);
  // Plek 2: Speler, dan Computer op Easy, Normal, Hard en weer Speler; de naamplaat verandert mee.
  const plek = () => screen.getByRole("button", { name: /^Seat 2: / });
  expect(plek().getAttribute("aria-label")).toBe("Seat 2: Player");
  const nummer = [...document.querySelectorAll(".tafel-knop")].indexOf(plek());
  expect(nummer).toBeGreaterThan(0);
  for (const verwacht of ["Seat 2: Computer, easy", "Seat 2: Computer, normal", "Seat 2: Computer, hard", "Seat 2: Player"]) {
    await tik(plek());
    expect(plek().getAttribute("aria-label")).toBe(verwacht);
  }
  await tik(plek());
  await tik(knop("Start game"));
  expect(start).toHaveBeenCalledWith({ vorm: "ster", aantal: 4, niveaus: [null, 0, null, null] });
  // De plaat van de plek draagt zijn tekst: Computer met zijn niveau eronder.
  const lijst = spelersKeuze({ plekken: [{ speler: 0, tekst: "Player" }, { speler: 1, tekst: "Computer", onder: "Easy" }], aantallen: [2, 3, 4, 6], aantal: 2, vierkant: false });
  const p = lijst.find((v) => v.id === "plek1")!.plaat!;
  expect(p.teksten).toEqual(["Computer", "Easy"]);
  expect(p.speler).toBe(1);
  // Taak 235: een plek die een tik wisselt, draagt een klein wisselteken.
  expect(lijst.filter((v) => v.id.startsWith("plek")).every((v) => v.plaat?.wissel === true)).toBe(true);
});

/** Liggen twee voorwerpen op elkaar? Een toets op zijn keuzebalk telt niet: die ligt er met opzet op. */
function opElkaar(a: Voorwerp, b: Voorwerp) {
  const opBalk = (t: Voorwerp, balk: Voorwerp) => balk.plaat?.soort === "balk" && t.plaat?.soort !== "balk" && Math.abs(t.z - balk.z) < 1e-6;
  if (opBalk(a, b) || opBalk(b, a)) return false;
  return Math.abs(a.x - b.x) < (a.b + b.b) / 2 - 1e-6 && Math.abs(a.z - b.z) < (a.d + b.d) / 2 - 1e-6;
}
const spelersLijst = (n: number, vierkant = false) =>
  spelersKeuze({ plekken: Array.from({ length: n }, (_, i) => ({ speler: plekKleur(i, n), tekst: "Player" })), aantallen: vierkant ? [2, 4] : [2, 3, 4, 6], aantal: n, vierkant });
const omtrek = (l: Voorwerp[]) => [Math.min(...l.map((v) => v.z - v.d / 2)), Math.max(...l.map((v) => v.z + v.d / 2)), Math.min(...l.map((v) => v.x - v.b / 2)), Math.max(...l.map((v) => v.x + v.b / 2))];

test("Spelers: de lijst voor Bevy heeft altijd dezelfde omtrek, zodat de camera niet verspringt bij een ander aantal", () => {
  for (const n of [3, 4, 6]) expect(omtrek(spelersLijst(n))).toEqual(omtrek(spelersLijst(2)));
  expect(omtrek(spelersLijst(4, true))).toEqual(omtrek(spelersLijst(2, true)));
  // De omtrek is niet breder dan het bord met Terug en de titel: het bord wordt niet kleiner dan voorheen.
  const [, , links, rechts] = omtrek(spelersLijst(6));
  expect(rechts - links).toBeLessThanOrEqual(15.6 + 1e-6);
});

test("Spelers: geen twee voorwerpen op elkaar, en geen naamplaat op het bord", () => {
  for (const [n, vierkant] of [[2, false], [3, false], [4, false], [6, false], [2, true], [4, true]] as const) {
    const l = spelersLijst(n, vierkant);
    for (const a of l) for (const b of l) if (a !== b) expect(opElkaar(a, b), `${a.id} en ${b.id} bij ${n} Spelers`).toBe(false);
    for (const v of l.filter((v) => v.id.startsWith("plek"))) {
      // De rand van de naamplaat die naar het bord kijkt, ligt buiten de buitenrand van het bord op die plek.
      const binnen = Math.max(0, Math.abs(v.x) - v.b / 2);
      expect(Math.abs(v.z) - v.d / 2, `${v.id} bij ${n} Spelers`).toBeGreaterThan(bordRand(vierkant, binnen));
    }
  }
});

test("Spelers: elke naamplaat ligt bij het kamp van zijn Speler, aan dezelfde kant van het bord als zijn Stenen", () => {
  for (const [n, vierkant] of [[2, false], [3, false], [4, false], [6, false], [2, true], [4, true]] as const) {
    const stand = tafelStand(n, vierkant);
    const p = vierkant ? Potje.vierkant(n) : new Potje(n);
    const plek = p.vak_plekken();
    p.free();
    const punten = Array.from({ length: plek.length / 2 }, (_, i) => schermPunt(vierkant ? "vierkant" : "ster", plek[2 * i], plek[2 * i + 1]));
    const mx = punten.reduce((a, q) => a + q.x, 0) / punten.length, mz = punten.reduce((a, q) => a + q.y, 0) / punten.length;
    const l = spelersLijst(n, vierkant);
    for (let i = 0; i < n; i++) {
      const kleur = plekKleur(i, n);
      const vakken = stand.flatMap((s, v) => (s === kleur ? [punten[v]] : []));
      const kx = vakken.reduce((a, q) => a + q.x - mx, 0) / vakken.length, kz = vakken.reduce((a, q) => a + q.y - mz, 0) / vakken.length;
      const v = l.find((v) => v.id === `plek${i}`)!;
      const wie = `plek${i} bij ${n} Spelers${vierkant ? " (Vierkant bord)" : ""}`;
      expect(v.plaat?.speler, wie).toBe(kleur);
      expect(Math.sign(v.z), wie).toBe(Math.sign(kz));
      if (Math.abs(kx) > 1) expect(Math.sign(v.x), wie).toBe(Math.sign(kx));
      else expect(v.x, wie).toBe(0);
      expect(v.vast, wie).toBe(true);
    }
    // Twee Spelers zitten nooit op dezelfde plek.
    const plekken = l.filter((v) => v.id.startsWith("plek")).map((v) => `${v.x},${v.z}`);
    expect(new Set(plekken).size).toBe(n);
  }
});

test("Spelers: het aantal is één keuzebalk met het kopje Players, met precies één gekozen toets", () => {
  const l = spelersLijst(4);
  const balk = l.find((v) => v.id === "aantal")!;
  expect(balk.plaat).toMatchObject({ soort: "balk", sleutels: ["choice.players"] });
  const toetsen = l.filter((v) => v.id.startsWith("aantal") && v !== balk);
  expect(toetsen.map((t) => [t.id, t.plaat?.soort])).toEqual([["aantal2", "toets"], ["aantal3", "toets"], ["aantal4", "toetsGekozen"], ["aantal6", "toets"]]);
});

test("Arabisch: de naamplaten blijven bij hun kamp, Terug, de titel en de keuzebalk spiegelen", async () => {
  await zetTaal("ar", false);
  await openTafel();
  await tik(document.querySelector<HTMLButtonElement>('[data-voorwerp="spelen"]')!);
  await tik(document.querySelector<HTMLButtonElement>('[data-voorwerp="ster"]')!);
  await tik(document.querySelector<HTMLButtonElement>('[data-voorwerp="aantal3"]')!);
  const l = spelersLijst(3);
  for (const [i, v] of l.entries()) {
    const x = nep.voorwerpen[i * VELDEN + 1];
    expect(x, v.id).toBeCloseTo(v.id.startsWith("plek") ? v.x : -v.x);
  }
});

test("Computer: bord, aantal en niveau zijn keuzes in een rij; Start geeft de keuze door", async () => {
  const { start } = await openTafel();
  await tik(knop("Play against the computer"));
  expect(spelersOpBord()).toBe(2);
  expect(keuze("Star board").getAttribute("aria-checked")).toBe("true");
  expect(keuze("Normal").getAttribute("aria-checked")).toBe("true");
  await tik(keuze(/^3 computers/));
  expect(spelersOpBord()).toBe(4);
  await tik(keuze("Easy"));
  expect(keuze("Easy").getAttribute("aria-checked")).toBe("true");
  expect(keuze("Normal").getAttribute("aria-checked")).toBe("false");
  await tik(knop("Start game"));
  expect(start).toHaveBeenCalledWith({ vorm: "ster", aantal: 4, niveaus: [null, 0, 0, 0], computer: true });
});

test("Computer: het Vierkant bord heeft één of drie Computers; een niet mogelijk aantal wordt het grootste dat wel past", async () => {
  const { start } = await openTafel();
  await tik(knop("Play against the computer"));
  await tik(keuze(/^2 computers/));
  await tik(keuze("Square board"));
  expect(nep.borden.at(-1)?.vierkant).toBe(true);
  expect(screen.queryByRole("radio", { name: /^2 computers/ })).toBeNull();
  expect(keuze(/^1 computer/).getAttribute("aria-checked")).toBe("true");
  expect(spelersOpBord()).toBe(2);
  await tik(knop("Start game"));
  expect(start).toHaveBeenCalledWith({ vorm: "vierkant", aantal: 2, niveaus: [null, 1], computer: true });
});

test("een vorige keuze tegen de computer opent op de tafel met dezelfde keuzes", async () => {
  const { start } = await openTafel({ vorige: { vorm: "ster", aantal: 3, niveaus: [null, 2, 2], computer: true } });
  expect(keuze(/^2 computers/).getAttribute("aria-checked")).toBe("true");
  expect(keuze("Hard").getAttribute("aria-checked")).toBe("true");
  await tik(knop("Start game"));
  expect(start).toHaveBeenCalledWith({ vorm: "ster", aantal: 3, niveaus: [null, 2, 2], computer: true });
});

test("Arabisch: de keuzes spiegelen en elke plaat krijgt zijn plaatje in het Arabisch", async () => {
  await zetTaal("ar", false);
  await openTafel();
  await tik(screen.getAllByRole("button")[0].closest("nav")!.querySelector<HTMLButtonElement>('[data-voorwerp="spelen"]')!);
  await waitFor(() => expect(nep.platen.at(-1)?.taal).toBe("ar"));
  expect(soorten()).toHaveLength(4);
  // Spiegelen: x is gespiegeld (laatste getal van elk voorwerp is 1).
  for (let i = 0; i < 4; i++) expect(nep.voorwerpen[i * VELDEN + 6]).toBe(1);
});

test("Computer: drie keuzebalken met de kopjes Board, Opponents en Level, Start als lakplaat, en geen twee voorwerpen op elkaar", () => {
  for (const vorm of ["ster", "vierkant"] as const) {
    const tegenstanders = vorm === "ster" ? [1, 2, 3, 5] : [1, 3];
    const l = computerKeuze({ namen: { ster: "A", vierkant: "B" }, vorm, tegenstanders, tegen: 1, niveaus: ["x", "y", "z"], niveau: 1 });
    expect(l.find((v) => v.id === "start")!.soort).toBe("rood");
    // De kopjes, van boven naar onder.
    const balken = l.filter((v) => v.plaat?.soort === "balk");
    expect(balken.map((b) => b.plaat!.sleutels[0])).toEqual(["choice.board", "choice.opponents", "level.label"]);
    expect(balken.map((b) => b.z)).toEqual([...balken.map((b) => b.z)].sort((a, b) => a - b));
    // Elke keuze is een toets op zijn balk; alleen de gekozen toetsen zijn gekozen.
    const toetsen = l.filter((v) => v.plaat?.soort === "toets" || v.plaat?.soort === "toetsGekozen");
    expect(toetsen.map((t) => t.id)).toEqual(["ster", "vierkant", ...tegenstanders.map((a) => `tegen${a}`), "niveau0", "niveau1", "niveau2"]);
    expect(toetsen.filter((t) => t.plaat?.soort === "toetsGekozen").map((t) => t.id)).toEqual([vorm, "tegen1", "niveau1"]);
    const opBalk = (t: (typeof l)[number], b: (typeof l)[number]) => b.plaat?.soort === "balk" && t.plaat?.soort !== "balk" && t.z === b.z;
    for (const a of l) for (const b of l) {
      if (a === b || opBalk(a, b) || opBalk(b, a)) continue;
      const over = Math.abs(a.x - b.x) < (a.b + b.b) / 2 - 1e-6 && Math.abs(a.z - b.z) < (a.d + b.d) / 2 - 1e-6;
      expect(over, `${a.id} en ${b.id} (${vorm})`).toBe(false);
    }
    // De bovenste balk ligt onder het bord (de punt van het Sterbord, de rand van het Vierkant bord).
    expect(balken[0].z - balken[0].d / 2).toBeGreaterThan(vorm === "ster" ? 9.0 : 9.54);
    // Niet breder dan Terug en de titel, zodat het bord niet kleiner wordt.
    expect(Math.max(...l.map((v) => Math.abs(v.x) + v.b / 2))).toBeLessThanOrEqual(7.8 + 1e-6);
  }
});

test("taak 235: ingezoomd zakken de naamplaten weg en verdwijnen hun knoppen; de andere knoppen blijven tikbaar", async () => {
  await openTafel();
  await tik(knop("Play on this phone"));
  await tik(knop("Star board"));
  const plek = screen.getByRole("button", { name: /^Seat 2: / }) as HTMLElement;
  const start = knop("Start game") as HTMLElement;
  const voor = start.getAttribute("style");
  expect(plek.style.display).not.toBe("none");
  nep.inzoomen(2, -200, -300);
  await waitFor(() => expect(plek.style.display).toBe("none"));
  expect(start.getAttribute("style")).toBe(voor);
  nep.inzoomen(1);
  await waitFor(() => expect(plek.style.display).not.toBe("none"));
});
