import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/svelte";
import { readFileSync } from "node:fs";
import { afterEach, beforeAll, beforeEach, expect, test, vi } from "vitest";
import { Potje, initSync } from "./wasm/halma_core.js";
import App from "./App.svelte";
import Speluitleg from "./Speluitleg.svelte";
import { OEFENINGEN, vakOp } from "./speluitleg";
import { nep } from "./nep-bord3d";

// Het 3D-bord als nep: jsdom kent geen WebGL, en er is alleen nog de tafel (feature 251).
vi.mock("./bord3d", async () => (await import("./nep-bord3d")).nepModule());

beforeAll(() => {
  initSync({ module: readFileSync("src/wasm/halma_core_bg.wasm") });
});
beforeEach(() => {
  localStorage.clear();
  nep.reset();
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

let plekken: number[] = [];
beforeAll(() => {
  plekken = Array.from(new Potje(2).vak_plekken());
});
const vak = (p: [number, number]) => vakOp(plekken, p);
const stenen = () => [...document.querySelectorAll<HTMLElement>(".steen")].map((e) => `${e.dataset.vak}:${e.dataset.speler}`).sort();
const tik = (selector: string) => fireEvent.click(document.querySelector(selector)!);
const steen = (v: number) => tik(`[data-vak="${v}"]`);
const gat = (v: number) => tik(`[data-gat="${v}"]`);

/** Next staat er al vanaf het begin van een oefening, maar is dof (disabled) tot de oefening klaar is. */
const volgendeKnop = async () => (await screen.findByRole("button", { name: "Next" })) as HTMLButtonElement;
const klikVolgende = async () => {
  const knop = await volgendeKnop();
  expect(knop.disabled).toBe(false);
  await fireEvent.click(knop);
};

async function doeOefening(nummer: number) {
  const o = OEFENINGEN[nummer];
  await steen(vak(o.eigen));
  if (o.sprongen === 0) await gat(vak(o.doel));
  else {
    for (const naar of landingen(nummer)) await gat(naar);
  }
}

/** De vakken waar de Sprongen van een oefening landen (uit de Sprongregels van de oefening, niet uit de app). */
function landingen(nummer: number): number[] {
  if (nummer === 1) return [vak([0, 0])];
  return [vak([1, -1]), vak([-1, 1]), vak([-1, 3])];
}

test("de drie oefeningen komen in volgorde, daarna het doel en de knop Play the computer", async () => {
  const speel = vi.fn();
  render(Speluitleg, { terug: vi.fn(), speel });
  expect(screen.getByText("Move one step to a neighbouring hole.")).toBeTruthy();
  expect((await volgendeKnop()).disabled).toBe(true);
  await doeOefening(0);
  await klikVolgende();

  expect(screen.getByText("Jump over a stone into the empty hole behind it.")).toBeTruthy();
  await doeOefening(1);
  await klikVolgende();

  expect(screen.getByText("Keep jumping in one move.")).toBeTruthy();
  await doeOefening(2);
  // De Steen staat op het doelvakje na drie Sprongen in één Zet.
  expect(stenen()).toContain(`${vak(OEFENINGEN[2].doel)}:0`);
  await klikVolgende();

  expect(screen.getByText("Win by moving all your stones into the opposite point.")).toBeTruthy();
  expect(speel).not.toHaveBeenCalled();
  await fireEvent.click(await screen.findByRole("button", { name: "Play the computer" }));
  expect(speel).toHaveBeenCalledOnce();
});

test("een verkeerde Zet rolt terug en de tekst blijft staan", async () => {
  render(Speluitleg, { terug: vi.fn(), speel: vi.fn() });
  const voor = stenen();
  const o = OEFENINGEN[0];
  // Een Stap naar een ander buurvak dan het doelvakje.
  const verkeerd = new Potje(2);
  const buren = Array.from(Potje.van_stand(false, 2, Array.from({ length: plekken.length / 2 }, (_, i) => (i === vak(o.eigen) ? 0 : -1)), 0).stappen(vak(o.eigen)));
  verkeerd.free();
  const anders = buren.find((b) => b !== vak(o.doel))!;
  await steen(vak(o.eigen));
  await gat(anders);
  // Een Stap die de spelregels goedvinden, maar naar het verkeerde vak: de Steen rolt terug.
  expect(nep.missers).toEqual([[vak(o.eigen), anders]]);
  expect(stenen()).toEqual(voor);
  expect(screen.getByText("Move one step to a neighbouring hole.")).toBeTruthy();
  expect((await volgendeKnop()).disabled).toBe(true);
  // Een vak ver weg telt ook niet.
  if (!document.querySelector(".steen.gekozen")) await steen(vak(o.eigen));
  await gat(vak([2, 1]));
  expect(stenen()).toEqual(voor);
  // Daarna kan het gewoon opnieuw (de Steen kan nog gekozen zijn).
  if (!document.querySelector(".steen.gekozen")) await steen(vak(o.eigen));
  await gat(vak(o.doel));
  expect((await volgendeKnop()).disabled).toBe(false);
});

test("midden in de keten stoppen rolt terug", async () => {
  render(Speluitleg, { terug: vi.fn(), speel: vi.fn() });
  await doeOefening(0);
  await klikVolgende();
  await doeOefening(1);
  await klikVolgende();
  const voor = stenen();
  await steen(vak(OEFENINGEN[2].eigen));
  await gat(vak([1, -1]));
  // Tik op de Steen om de Zet hier af te maken: dat is niet het doelvakje.
  await steen(vak([1, -1]));
  expect(stenen()).toEqual(voor);
  expect(screen.getByText("Keep jumping in one move.")).toBeTruthy();
});

test("in een oefening licht alleen het doelvakje op, en verder niets", async () => {
  render(Speluitleg, { terug: vi.fn(), speel: vi.fn() });
  for (let i = 0; i < 3; i++) {
    const alleenDoel = { speler: expect.anything(), vakken: [vak(OEFENINGEN[i].doel)] };
    await waitFor(() => expect(nep.doel, `oefening ${i + 1}`).toEqual(alleenDoel));
    // Een Steen kiezen laat geen bestemmingen oplichten: het doel blijft het enige, en er is geen hint.
    await steen(vak(OEFENINGEN[i].eigen));
    expect(nep.doel).toEqual(alleenDoel);
    expect(document.querySelector(".bestemming, .hint")).toBeNull();
    await steen(vak(OEFENINGEN[i].eigen));
    await doeOefening(i);
    await klikVolgende();
  }
});

test("How to play staat in het menu; Play the computer start een Potje op makkelijk", async () => {
  const kies = vi.spyOn(Potje.prototype, "computer_zet");
  render(App);
  await fireEvent.click(await screen.findByRole("button", { name: "How to play" }));
  await doeOefening(0);
  await klikVolgende();
  await doeOefening(1);
  await klikVolgende();
  await doeOefening(2);
  await klikVolgende();
  await fireEvent.click(await screen.findByRole("button", { name: "Play the computer" }));
  // Nu staat er een gewoon Potje: de Speler is aan de beurt, een Steen in het Potje heeft een eigen kleur.
  expect(await screen.findByRole("button", { name: "Resign" })).toBeTruthy();
  expect(screen.queryByRole("button", { name: "Play the computer" })).toBeNull();
  // Zet één Steen; dan kiest de Computerspeler een Zet op niveau 0 (makkelijk).
  const eigen = [...document.querySelectorAll<HTMLElement>('.steen[data-speler="0"]')].map((e) => Number(e.dataset.vak));
  const echt = new Potje(2);
  const [van, naar] = eigen.flatMap((v) => Array.from(echt.stappen(v), (n) => [v, n]))[0];
  echt.free();
  await steen(van);
  await gat(naar);
  await waitFor(() => expect(kies).toHaveBeenCalled(), { timeout: 5000 });
  expect(kies.mock.calls[0][0]).toBe(0);
});

test("de Speluitleg is niet verplicht: het startmenu staat er gewoon en Back brengt je terug", async () => {
  render(App);
  expect(await screen.findByRole("button", { name: "Play on this phone" })).toBeTruthy();
  await fireEvent.click(await screen.findByRole("button", { name: "How to play" }));
  await fireEvent.click(await screen.findByRole("button", { name: "Back" }));
  expect(await screen.findByRole("button", { name: "Play on this phone" })).toBeTruthy();
});
