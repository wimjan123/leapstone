// Het Startmenu als 3D-tafel (taak 178): elke knop is een voorwerp in Bevy met een onzichtbare HTML-knop erboven.
// Bevy is hier het nep-bord (jsdom kent geen WebGL): het onthoudt wat de app stuurt en zegt waar de voorwerpen liggen.
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/svelte";
import { readFileSync } from "node:fs";
import { afterEach, beforeAll, beforeEach, expect, test, vi } from "vitest";
import { initSync } from "./wasm/halma_core.js";
import Startmenu from "./Startmenu.svelte";
import { nep } from "./nep-bord3d";
import { zetTaal } from "./taal.svelte";
import { KLEINSTE_KNOP, SOORT, STARTMENU, VELDEN, helft, knopPlek, startmenu, vakVan, voorwerpLijst } from "./voorwerpen";

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

const nummer = (id: string) => STARTMENU.findIndex((v) => v.id === id);

/** Open het Startmenu en wacht tot de tafel in beeld is (de knoppen liggen dan op de voorwerpen). */
async function openTafel(props: Record<string, unknown> = {}) {
  const online = vi.fn();
  const start = vi.fn();
  const puzzel = vi.fn();
  const speluitleg = vi.fn();
  render(Startmenu, { start, online, puzzel, speluitleg, ...props });
  await waitFor(() => expect(document.querySelector(".tafel-knoppen")).not.toBeNull());
  return { online, start, puzzel, speluitleg };
}

/** De knop op het voorwerp `id` (bij de lade: deel 0 Sound, 1 Vibration). */
function knopOp(id: string, deel = 0): HTMLButtonElement {
  const knoppen = [...document.querySelectorAll<HTMLButtonElement>(`.tafel-knop[data-voorwerp="${id}"]`)];
  return knoppen[deel];
}

/** Waar de HTML-knop staat (px), uit zijn stijl. */
function plekVan(k: HTMLElement) {
  const n = (p: string) => parseFloat(k.style.getPropertyValue(p));
  return { left: n("left"), top: n("top"), width: n("width"), height: n("height") };
}

test("de tafel: het Sterbord met de Stenen van zes Spelers en alle voorwerpen van 1b, met plaatjes in de taal van de Speler", async () => {
  await openTafel();
  expect(nep.borden.at(-1)?.vierkant).toBe(false);
  expect(nep.stand.filter((s) => s >= 0)).toHaveLength(60);
  expect(new Set(nep.stand.filter((s) => s >= 0))).toEqual(new Set([0, 1, 2, 3, 4, 5]));
  // De lijst voor Bevy: per voorwerp soort, x, z, breedte, diepte, hoogte, gespiegeld.
  expect(nep.voorwerpen).toHaveLength(STARTMENU.length * VELDEN);
  // Taak 206: de rode plaat is online spelen, de zwarte spelen op deze telefoon.
  expect(nep.voorwerpen[nummer("online") * VELDEN]).toBe(SOORT.rood);
  expect(nep.voorwerpen[nummer("spelen") * VELDEN]).toBe(SOORT.zwart);
  expect(nep.voorwerpen[nummer("lade") * VELDEN]).toBe(SOORT.lade);
  // De plaatjes in het Engels; de versiering (kom, zegelsteen) heeft er geen.
  expect(nep.platen.at(-1)).toEqual({ taal: "en", ids: STARTMENU.map((v) => v.plaat?.id ?? null) });
  expect(nep.platen.at(-1)!.ids[nummer("kom")]).toBeNull();
  // Het platte menu is weg; elke knop staat er één keer, als echte knop met dezelfde tekst als het voorwerp.
  expect(document.querySelector(".kop-rij")).toBeNull();
  expect(screen.getByRole("button", { name: "Play on this phone" }).textContent).toBe("On this phone");
  expect(screen.getByRole("button", { name: "Play online" }).textContent).toBe("Play");
  expect(screen.getByRole("button", { name: "Puzzle of the day" }).textContent).toBe("Puzzle of the day");
  expect(screen.getByRole("switch", { name: "Sound" }).getAttribute("aria-checked")).toBe("true");
});

test("elke knop werkt met een tik op het voorwerp en met de onzichtbare HTML-knop", async () => {
  const { online, puzzel, speluitleg } = await openTafel();
  const gevallen: [string, () => void][] = [
    ["online", () => expect(online).toHaveBeenLastCalledWith("snel")],
    ["vrienden", () => expect(online).toHaveBeenLastCalledWith("vrienden")],
    ["puzzel", () => expect(puzzel).toHaveBeenCalledOnce()],
    ["uitleg", () => expect(speluitleg).toHaveBeenCalledOnce()],
    ["ranglijst", () => expect(online).toHaveBeenLastCalledWith("ranglijst")],
    ["stats", () => expect(online).toHaveBeenLastCalledWith("stats")],
    ["potjes", () => expect(online).toHaveBeenLastCalledWith("mijn")],
  ];
  for (const [id, verwacht] of gevallen) {
    const k = knopOp(id);
    const i = nummer(id);
    // De knop ligt precies op het voorwerp: het vak dat Bevy geeft (minstens 44 bij 44 om het midden).
    const vak = vakVan(nep.vakken, i)!;
    expect(plekVan(k)).toEqual(knopPlek(vak));
    expect(plekVan(k).width).toBeGreaterThanOrEqual(KLEINSTE_KNOP);
    // Een vinger: het voorwerp gaat omlaag zolang hij erop staat, en de knop doet zijn werk.
    await fireEvent.pointerDown(k);
    expect(nep.druk.at(-1)).toEqual({ nummer: i, aan: true });
    await fireEvent.pointerUp(k);
    expect(nep.druk.at(-1)).toEqual({ nummer: i, aan: false });
    await fireEvent.click(k, { detail: 1 });
    verwacht();
  }
});

test("Play gaat naar het kiezen van het bord, Computer naar de Computerspelers: de tafel blijft staan (taak 188)", async () => {
  await openTafel();
  await fireEvent.click(knopOp("spelen"), { detail: 1 });
  expect(screen.getByRole("heading", { name: "Choose a board" })).toBeTruthy();
  // De tafel blijft staan met de voorwerpen van het volgende scherm; zie KeuzeTafel.test.ts.
  expect(nep.voorwerpLijsten.at(-1)).not.toEqual([]);
  cleanup();
  await openTafel();
  await fireEvent.click(knopOp("computer"), { detail: 1 });
  expect(screen.getByRole("button", { name: "Start game" })).toBeTruthy();
});

test("met het toetsenbord gaat het voorwerp kort omlaag", async () => {
  vi.useFakeTimers({ toFake: ["setTimeout"] });
  try {
    const { online } = await openTafel();
    const k = knopOp("online");
    k.focus();
    expect(document.activeElement).toBe(k);
    await fireEvent.click(k, { detail: 0 });
    expect(online).toHaveBeenLastCalledWith("snel");
    expect(nep.druk.at(-1)).toEqual({ nummer: nummer("online"), aan: true });
    vi.advanceTimersByTime(200);
    expect(nep.druk.at(-1)).toEqual({ nummer: nummer("online"), aan: false });
  } finally {
    vi.useRealTimers();
  }
});

test("Sound en Vibration: twee schakelaars op de lade, de kraal schuift mee", async () => {
  await openTafel();
  const lade = nummer("lade");
  const geluid = screen.getByRole("switch", { name: "Sound" });
  const trillen = screen.getByRole("switch", { name: "Vibration" });
  expect(nep.schakelaars).toEqual({ [`${lade}.0`]: true, [`${lade}.1`]: true });
  // Sound ligt op de linker helft van de lade, Vibration op de rechter.
  const vak = vakVan(nep.vakken, lade)!;
  expect(plekVan(geluid)).toEqual(knopPlek(helft(vak, 0, false)));
  expect(plekVan(geluid).left).toBeLessThan(plekVan(trillen).left);
  await fireEvent.click(geluid, { detail: 1 });
  expect(geluid.getAttribute("aria-checked")).toBe("false");
  expect(nep.schakelaars[`${lade}.0`]).toBe(false);
  expect(localStorage.getItem("leapstone.geluid")).toBe("uit");
  await fireEvent.click(trillen, { detail: 1 });
  expect(nep.schakelaars[`${lade}.1`]).toBe(false);
});

test("van rechts naar links: de tafel spiegelt, Sound ligt rechts en de plaatjes zijn Arabisch", async () => {
  await zetTaal("ar", false);
  await openTafel();
  expect(nep.platen.at(-1)?.taal).toBe("ar");
  expect(nep.voorwerpen).toEqual(Array.from(voorwerpLijst(STARTMENU, true)));
  const i = nummer("spelen");
  expect(nep.voorwerpen[i * VELDEN + 1]).toBeCloseTo(-STARTMENU[i].x);
  expect(nep.voorwerpen[i * VELDEN + 6]).toBe(1);
  const lade = vakVan(nep.vakken, nummer("lade"))!;
  expect(plekVan(knopOp("lade", 0))).toEqual(knopPlek(helft(lade, 0, true)));
  expect(plekVan(knopOp("lade", 0)).left).toBeGreaterThan(plekVan(knopOp("lade", 1)).left);
});

// Taak 190: bij zoomen in een Potje melden de voorwerpen geen nieuwe vakken meer (ze zoomen niet mee, zie potjescherm.test.ts).
// Een ander venster of een andere tafel verschuift ze wel; dan gaan de knoppen mee.
test("verschuiven de voorwerpen (taak 186), dan gaan de knoppen mee, verdwijnen buiten beeld en komen terug", async () => {
  const { puzzel } = await openTafel();
  const knop = knopOp("puzzel");
  const voor = plekVan(knop);
  expect(knop.style.display).toBe("");
  // De voorwerpen liggen elders en Bevy meldt dat. De knop gaat mee, op dezelfde plek op het voorwerp.
  nep.verschuifVoorwerpen(30, 25);
  await waitFor(() => expect(plekVan(knopOp("puzzel")).left).toBeCloseTo(voor.left + 30));
  const na = plekVan(knopOp("puzzel"));
  expect(na.top).toBeCloseTo(voor.top + 25);
  expect(na.width).toBeCloseTo(voor.width);
  // De knop op de nieuwe plek werkt nog.
  await fireEvent.click(knopOp("puzzel"));
  expect(puzzel).toHaveBeenCalledOnce();
  // Een voorwerp dat helemaal buiten beeld raakt, heeft geen knop meer; de andere blijven.
  nep.verschuifVoorwerpen(-5000, 0);
  await waitFor(() => expect(knopOp("puzzel").style.display).toBe("none"));
  expect(knopOp("spelen").style.display).toBe("none");
  // Terug: alles weer op zijn plek.
  nep.verschuifVoorwerpen(5000 - 30, -25);
  await waitFor(() => expect(knopOp("puzzel").style.display).toBe(""));
  expect(plekVan(knopOp("puzzel"))).toEqual(voor);
});

test("het Startmenu per scherm: de lade midden zonder App Store-knop, en op een breed scherm het bord links (taak 206)", () => {
  const ids = (l: readonly { id: string }[]) => l.map((v) => v.id);
  // De telefoon in de browser is precies STARTMENU; zonder App Store-knop schuift alleen de lade naar het midden.
  expect(startmenu({ appKnop: true, breed: false })).toEqual(STARTMENU);
  const app = startmenu({ appKnop: false, breed: false });
  expect(app.find((v) => v.id === "lade")!.x).toBe(0);
  expect(app.filter((v) => v.id !== "lade")).toEqual(STARTMENU.filter((v) => v.id !== "lade"));
  // Breed: dezelfde voorwerpen in dezelfde volgorde (de knoppen wijzen op nummer), de knoppen rechts van het bord en de
  // versiering links, tegen de schuine kanten van het bord. Het bord ligt op x 0 en is ongeveer 16,5 breed.
  const breed = startmenu({ appKnop: true, breed: true });
  expect(ids(breed)).toEqual(ids(STARTMENU));
  for (const v of breed) {
    if (v.soort === "kom" || v.soort === "zegel") expect(v.x + v.b / 2, v.id).toBeLessThan(-5);
    else expect(v.x - v.b / 2, v.id).toBeGreaterThan(8.25);
  }
  expect(startmenu({ appKnop: false, breed: true }).find((v) => v.id === "lade")!.x).toBe(17);
});
