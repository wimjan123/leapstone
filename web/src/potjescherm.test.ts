import { tick } from "svelte";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/svelte";
import { readFileSync } from "node:fs";
import { afterEach, beforeAll, beforeEach, expect, test, vi } from "vitest";
import { Potje, initSync } from "./wasm/halma_core.js";
import App from "./App.svelte";
import { nep } from "./nep-bord3d";
import { naarSpelers } from "./test-start";
import { SOORT, VELDEN } from "./voorwerpen";

// Taak 179: het lokale Potje als tafel met voorwerpen (naamplaten, jade aanwijzer, blad met knoppen).
vi.mock("./bord3d", async () => (await import("./nep-bord3d")).nepModule());

beforeAll(() => initSync({ module: readFileSync("src/wasm/halma_core_bg.wasm") }));
beforeEach(() => nep.reset());
afterEach(cleanup);

const soorten = () => Array.from({ length: nep.voorwerpen.length / VELDEN }, (_, i) => nep.voorwerpen[i * VELDEN]);
const gat = (vak: number) => document.querySelector<HTMLElement>(`[data-gat="${vak}"]`)!;
const steenOp = (vak: number) => document.querySelector<HTMLElement>(`.steen[data-vak="${vak}"]`)!;
function eersteZet(): [number, number] {
  const p = new Potje(2);
  const van = Array.from(p.stand()).findIndex((s, v) => s === 0 && p.geldige_bestemmingen(v).length > 0);
  const naar = p.geldige_bestemmingen(van)[0];
  p.free();
  return [van, naar];
}

async function startPotje() {
  render(App);
  await naarSpelers();
  await fireEvent.click(screen.getByRole("button", { name: "Start game" }));
  await waitFor(() => expect(nep.voorwerpen.length).toBeGreaterThan(0));
}

test("het Potje legt naamplaten, de jade aanwijzer, een blad en twee knoppen op de tafel", async () => {
  await startPotje();
  const s = soorten();
  // Versiering, twee naamplaten, de aanwijzer, het blad en de knoppen Menu, Resign en Done (taak 240: ook een weg terug, niet alleen Resign).
  expect(s.filter((x) => x === SOORT.naamplaat)).toHaveLength(2);
  expect(s.filter((x) => x === SOORT.jade)).toHaveLength(1);
  expect(s.filter((x) => x === SOORT.blad)).toHaveLength(1);
  expect(s.filter((x) => x === SOORT.porselein)).toHaveLength(3);
  // De plaatjes: naamplaten met Steen en naam, de aanwijzer, de knoppen.
  await waitFor(() => expect(Object.keys(nep.platenSpec).length).toBeGreaterThanOrEqual(5));
  const specs = Object.values(nep.platenSpec);
  expect(specs.filter((p) => p.soort === "naamplaat").map((p) => [p.speler, p.teksten])).toEqual([[0, ["Player 1"]], [1, ["Player 2"]]]);
  expect(specs.find((p) => p.soort === "jade")?.teksten).toEqual(["Your turn"]);
  // Taak 231: Done ligt er altijd, maar dof zolang er geen Sprongketen is; Resign doet wel iets en ligt er gewoon.
  expect(specs.find((p) => p.id === "klaar")).toMatchObject({ sleutels: ["game.done"], uit: true });
  expect(specs.find((p) => p.id === "opgeven")?.uit).toBeFalsy();
  expect((screen.getByRole("button", { name: "Done" }) as HTMLButtonElement).disabled).toBe(true);
  // Er zijn geen gewone balken meer: de beurt staat op de aanwijzer, de knoppen op het blad.
  expect(document.querySelector("footer.voet")).toBeNull();
});

test("Menu in een Potje op deze telefoon brengt je terug naar het Startmenu (taak 240)", async () => {
  await startPotje();
  await fireEvent.click(await screen.findByRole("button", { name: "Back to menu" }));
  await waitFor(() => expect(screen.getByRole("button", { name: "Play on this phone" })).toBeTruthy());
  expect(screen.queryByRole("button", { name: "Resign" })).toBeNull();
});

test("een tik op de HTML-knop op het voorwerp doet zijn werk, en het voorwerp zakt", async () => {
  await startPotje();
  const resign = await screen.findByRole("button", { name: "Resign" });
  expect(resign.getAttribute("data-voorwerp")).toBe("opgeven");
  // De klikken in het Startmenu (nu ook op de tafel) lieten hun voorwerp ook zakken: tel vanaf hier.
  nep.druk.length = 0;
  await fireEvent.pointerDown(resign);
  await fireEvent.pointerUp(resign);
  await fireEvent.click(resign);
  // Een vinger: zakt en komt terug; de klik zonder vinger (toetsenbord) laat hem kort zakken.
  expect(nep.druk.map((d) => d.aan).slice(0, 2)).toEqual([true, false]);
  expect(screen.getByRole("dialog")).toBeTruthy();
  await fireEvent.click(screen.getByRole("button", { name: "Yes, resign" }));
  expect(await screen.findByText("Player 2 wins!")).toBeTruthy();
  // Na afloop neemt het winstscherm de tafel over (taak 180): de voorwerpen van het Potje, ook de aanwijzer, zijn weg.
  await waitFor(() => expect(document.body.classList.contains("feest-tafel")).toBe(true));
  expect(Object.values(nep.platenSpec).find((p) => p.soort === "jade")).toBeUndefined();
});

test("taak 190 en 235: ingezoomd blijven de vakken en knoppen van het blad dezelfde en tikbaar", async () => {
  await startPotje();
  const resign = await screen.findByRole("button", { name: "Resign" });
  await waitFor(() => expect(resign.style.left).not.toBe(""));
  const knoppen = () => [...document.querySelectorAll<HTMLElement>(".tafel-knop")].map((k) => [k.dataset.voorwerp, k.getAttribute("style")]);
  const voor = knoppen();
  const gemeld = nep.vakken.slice();
  // Knijpen met twee vingers op het bord: de vingers gaan naar Bevy, en Bevy zoomt alleen het bord (het nep-bord ook). De vakken
  // van de voorwerpen blijven dezelfde: Bevy rekent ze met de vaste camera, dus er komt geen `bij_voorwerpen`.
  const vlak = document.querySelector(".bord3d")!;
  await fireEvent.pointerDown(vlak, { pointerId: 1, clientX: 150, clientY: 400, button: 0, pointerType: "touch" });
  await fireEvent.pointerDown(vlak, { pointerId: 2, clientX: 230, clientY: 400, button: 0, pointerType: "touch" });
  for (let k = 1; k <= 8; k++) {
    await fireEvent.pointerMove(vlak, { pointerId: 1, clientX: 150 - 10 * k, clientY: 400, pointerType: "touch" });
    await fireEvent.pointerMove(vlak, { pointerId: 2, clientX: 230 + 10 * k, clientY: 400, pointerType: "touch" });
    nep.inzoomen(1 + k * 0.2, -40 * k, -50 * k);
  }
  await fireEvent.pointerUp(vlak, { pointerId: 2, clientX: 310, clientY: 400, button: 0, pointerType: "touch" });
  await fireEvent.pointerUp(vlak, { pointerId: 1, clientX: 70, clientY: 400, button: 0, pointerType: "touch" });
  expect(nep.vingers.filter((v) => v.fase === 0).map((v) => v.id)).toEqual([1, 2]);
  expect(nep.vakken).toEqual(gemeld);
  // Taak 235: alleen de naamplaten, kom en zegel zakken weg.
  await tick();
  // Het blad met My games, Resign en Done blijft liggen en tikbaar (Done maakt een reeks Sprongen af); knoppen van platen die
  // wegzakken verdwijnen. Hier hebben alle knoppen een voorwerp op het blad.
  expect(knoppen()).toEqual(voor);
  expect(resign.style.display).not.toBe("none");
  // Uitzoomen laat alles op dezelfde plek.
  nep.inzoomen(1);
  await tick();
  expect(knoppen()).toEqual(voor);
  await fireEvent.pointerDown(resign);
  await fireEvent.pointerUp(resign);
  await fireEvent.click(resign);
  expect(screen.getByRole("dialog")).toBeTruthy();
});

test("de jade aanwijzer schuift naar de Speler aan de beurt zonder dat de lijst opnieuw gaat", async () => {
  await startPotje();
  await waitFor(() => expect(nep.plekken.length).toBeGreaterThan(0));
  const lijsten = nep.voorwerpLijsten.length;
  const beurt = nep.voorwerpen.length / VELDEN - 5; // de aanwijzer ligt vóór het blad en de drie knoppen
  expect(soorten()[beurt]).toBe(SOORT.jade);
  const eerste = nep.plekken.filter((p) => p.nummer === beurt).at(-1)!;
  const [van, naar] = eersteZet();
  await fireEvent.click(steenOp(van));
  await fireEvent.click(gat(naar));
  await waitFor(() => expect(nep.plekken.filter((p) => p.nummer === beurt).at(-1)!.x).toBeGreaterThan(eerste.x));
  expect(nep.voorwerpLijsten.length).toBe(lijsten);
  // De aanwijzer zegt nu dat de ander nadenkt (hier de Computer niet: twee Spelers op dit toestel).
  await waitFor(() => expect(Object.values(nep.platenSpec).find((p) => p.soort === "jade")?.teksten).toEqual(["Your turn"]));
});

test("lukt 3D niet te starten, dan ziet de Speler het foutscherm met Try again en geen Potje", async () => {
  nep.faal = true;
  render(App);
  expect(await screen.findByRole("button", { name: "Try again" })).toBeTruthy();
  expect(screen.queryByRole("button", { name: "Resign" })).toBeNull();
  expect(document.querySelector("[data-voorwerp]")).toBeNull();
});
