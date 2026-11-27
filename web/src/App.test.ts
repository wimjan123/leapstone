import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/svelte";
import { readFileSync } from "node:fs";
import { tick } from "svelte";
import { afterEach, beforeAll, beforeEach, expect, test, vi } from "vitest";
import { Potje, initSync } from "./wasm/halma_core.js";
import App from "./App.svelte";
import { nep } from "./nep-bord3d";
import { computers, naarComputer, naarSpelers } from "./test-start";

// Het 3D-bord als nep: jsdom kent geen WebGL.
vi.mock("./bord3d", async () => (await import("./nep-bord3d")).nepModule());

beforeAll(() => {
  initSync({ module: readFileSync("src/wasm/halma_core_bg.wasm") });
});
// Deze tests spelen op de tafel met het nagebouwde 3D-bord. De eerste keer wacht het Startmenu op de laadtafel (taak 223), en pas
// daarna staan er knoppen.
beforeEach(() => {
  nep.reset();
});
afterEach(cleanup);

const stenen = (speler: number) =>
  Array.from(document.querySelectorAll<SVGGElement>(`.steen[data-speler="${speler}"]`));
const gekozen = () => document.querySelector(".steen.gekozen")?.getAttribute("data-vak") ?? null;
/** De knop (voor toetsenbord en schermlezer) om de gekozen steen naar vak `vak` te proberen. */
const gat = (vak: number) => document.querySelector<HTMLElement>(`[data-gat="${vak}"]`)!;
/** Een Zet die Speler 1 in de beginstand kan doen, uit de spelregels (het bord laat het niet zien). */
function eersteZet(vierkant = false, aantal = 2): [number, number] {
  const p = vierkant ? Potje.vierkant(aantal) : new Potje(aantal);
  const van = Array.from(p.stand()).findIndex((s, v) => s === 0 && p.geldige_bestemmingen(v).length > 0);
  const naar = p.geldige_bestemmingen(van)[0];
  p.free();
  return [van, naar];
}
const steenOp = (vak: number) => document.querySelector<HTMLElement>(`.steen[data-vak="${vak}"]`)!;

/** Kies voor een plek een Computer: tik op de steen van die plek tot het niveau klopt. */
async function kiesComputer(plek: number, niveau: string) {
  for (let i = 0; i < 4; i++) {
    const steen = screen.getByRole("button", { name: new RegExp(`^Seat ${plek}:`) });
    if (steen.getAttribute("aria-label") === `Seat ${plek}: Computer, ${niveau}`) return;
    await fireEvent.click(steen);
  }
  throw new Error(`Seat ${plek} wordt geen Computer, ${niveau}`);
}

test("een tik op de steen van een plek wisselt: mens, computer makkelijk, normaal, moeilijk, mens", async () => {
  render(App);
  await naarSpelers();
  const namen: string[] = [];
  for (let i = 0; i < 5; i++) {
    const steen = screen.getByRole("button", { name: /^Seat 2:/ });
    namen.push(steen.getAttribute("aria-label")!);
    await fireEvent.click(steen);
  }
  expect(namen).toEqual(["Seat 2: Player", "Seat 2: Computer, easy", "Seat 2: Computer, normal", "Seat 2: Computer, hard", "Seat 2: Player"]);
  // Terug naar het bord en het hoofdmenu.
  await fireEvent.click(screen.getByRole("button", { name: "Back" }));
  await fireEvent.click(await screen.findByRole("button", { name: "Back" }));
  expect(await screen.findByRole("button", { name: "Play on this phone" })).toBeTruthy();
});

test("een kort potje voor 2 spelers: kiezen, zetten, opgeven, winnaar, nieuw potje", async () => {
  render(App);
  await naarSpelers();
  await fireEvent.click(screen.getByLabelText(/^2\s*players/));
  nep.faal = false; // het Potje zelf speelt op het 3D-bord
  await fireEvent.click(screen.getByRole("button", { name: "Start game" }));

  expect(screen.getByText("Player 1", { selector: "strong" })).toBeTruthy();
  expect(stenen(0)).toHaveLength(10);
  expect(stenen(1)).toHaveLength(10);

  // Een steen van de andere speler doet niets.
  await fireEvent.click(stenen(1)[0]);
  expect(gekozen()).toBeNull();

  // Kies een steen van speler 1. Er licht niets op: elk leeg vak is te proberen.
  const [van, doel] = eersteZet();
  await fireEvent.click(steenOp(van));
  expect(gekozen()).toBe(String(van));
  expect(document.querySelectorAll("[data-gat]")).toHaveLength(121 - 20);

  // Tik naast het bord: de keuze verdwijnt.
  await waitFor(() => expect(nep.borden.length).toBeGreaterThan(0));
  nep.tik(NaN, NaN);
  await tick();
  expect(gekozen()).toBeNull();

  // Kies opnieuw en zet.
  await fireEvent.click(steenOp(van));
  await fireEvent.click(gat(doel));
  expect(document.querySelector(`.steen[data-vak="${doel}"]`)?.getAttribute("data-speler")).toBe("0");
  expect(stenen(0)).toHaveLength(10);
  expect(screen.getByText("Player 2", { selector: "strong" })).toBeTruthy();

  // Opgeven vraagt eerst om bevestiging.
  await fireEvent.click(screen.getByRole("button", { name: "Resign" }));
  await fireEvent.click(screen.getByRole("button", { name: "No, keep playing" }));
  expect(screen.queryByText("Player 1 wins!")).toBeNull();
  await fireEvent.click(screen.getByRole("button", { name: "Resign" }));
  await fireEvent.click(screen.getByRole("button", { name: "Yes, resign" }));

  // Het winstscherm wacht op zijn tafel (taak 224); mislukt die, dan komt het platte scherm.
  expect(await screen.findByText("Player 1 wins!")).toBeTruthy();
  // Een nieuw Potje begint bij dezelfde spelers.
  await fireEvent.click(screen.getByRole("button", { name: "New game" }));
  // De keuze van het vorige Potje wacht eerst op de tafel (taak 224); mislukt die, dan komt het platte scherm.
  expect(await screen.findByRole("button", { name: "Start game" })).toBeTruthy();
  // Op de tafel is "2 players" een knop met aria-checked, op het platte scherm een keuzerondje.
  const twee = screen.getByLabelText(/^2\s*players/);
  expect(twee.getAttribute("aria-checked") ?? String((twee as HTMLInputElement).checked)).toBe("true");
});

test("een potje voor 6 spelers heeft zestig stenen", async () => {
  render(App);
  await naarSpelers();
  await fireEvent.click(screen.getByLabelText(/^6\s*players/));
  await fireEvent.click(screen.getByRole("button", { name: "Start game" }));
  expect(document.querySelectorAll(".steen")).toHaveLength(60);
});

test("een Computer zet vanzelf na de Zet van de Speler", async () => {
  render(App);
  await naarSpelers();
  await fireEvent.click(screen.getByLabelText(/^2\s*players/));
  await kiesComputer(2, "normal");
  await fireEvent.click(screen.getByRole("button", { name: "Start game" }));

  const [van, naar] = eersteZet();
  await fireEvent.click(steenOp(van));
  await fireEvent.click(gat(naar));

  // Computer 2 to move: tikken en opgeven kan niet.
  expect(screen.getByText("Computer 2", { selector: "strong" })).toBeTruthy();
  await fireEvent.click(stenen(1)[0]);
  expect(gekozen()).toBeNull();
  expect((screen.getByRole("button", { name: "Resign" }) as HTMLButtonElement).disabled).toBe(true);

  // Na de pauze heeft hij gezet en is Speler 1 weer aan de beurt.
  await waitFor(() => expect(screen.getByText("Player 1", { selector: "strong" })).toBeTruthy(), {
    timeout: 3000,
  });
  expect(stenen(1)).toHaveLength(10);
});

test("Square board: alleen 2 of 4 spelers, een kort potje met een Computer", async () => {
  render(App);
  await naarSpelers("Square board");
  expect(screen.queryByLabelText(/^3\s*players/)).toBeNull();
  expect(screen.queryByLabelText(/^6\s*players/)).toBeNull();
  await fireEvent.click(screen.getByLabelText(/^2\s*players/));
  await kiesComputer(2, "normal");
  nep.faal = false; // het Potje zelf speelt op het 3D-bord
  await fireEvent.click(screen.getByRole("button", { name: "Start game" }));

  expect(screen.getByRole("group", { name: "Square board" })).toBeTruthy();
  await waitFor(() => expect(nep.stand).toHaveLength(256));
  expect(stenen(0)).toHaveLength(19);
  expect(stenen(1)).toHaveLength(19);

  const [van, naar] = eersteZet(true);
  await fireEvent.click(steenOp(van));
  await fireEvent.click(gat(naar));

  expect(screen.getByText("Computer 2", { selector: "strong" })).toBeTruthy();
  await waitFor(() => expect(screen.getByText("Player 1", { selector: "strong" })).toBeTruthy(), {
    timeout: 3000,
  });
  expect(stenen(1)).toHaveLength(19);
  // De Zet van de Computer hupt op het 3D-bord naar zijn nieuwe vak.
  const hup = nep.bewegingen.at(-1)!;
  expect(nep.stand[hup.vakken.at(-1)!]).toBe(1);

  await fireEvent.click(screen.getByRole("button", { name: "Resign" }));
  await fireEvent.click(screen.getByRole("button", { name: "Yes, resign" }));
  expect(await screen.findByText("Computer 2 wins!")).toBeTruthy();
});

test("Square board met 4 spelers heeft vier groepen stenen", async () => {
  render(App);
  await naarSpelers("Square board");
  await fireEvent.click(screen.getByLabelText(/^4\s*players/));
  await fireEvent.click(screen.getByRole("button", { name: "Start game" }));
  for (const s of [0, 1, 2, 3]) expect(stenen(s).length).toBeGreaterThan(0);
  expect(document.querySelectorAll(".steen")).toHaveLength(stenen(0).length * 4);
});

test("Computer in het menu: met twee tikken een potje tegen één Computer, en een nieuw potje begint weer daar", async () => {
  render(App);
  await naarComputer();
  // Standaard: sterbord, één Computer, normaal.
  expect((await screen.findByRole("radio", { name: "Star board" })).getAttribute("aria-checked")).toBe("true");
  expect(screen.getByRole("radio", { name: computers(1) }).getAttribute("aria-checked")).toBe("true");
  expect(screen.getByRole("radio", { name: "Normal" }).getAttribute("aria-checked")).toBe("true");
  await fireEvent.click(screen.getByRole("button", { name: "Start game" }));

  expect(stenen(0)).toHaveLength(10);
  expect(stenen(1)).toHaveLength(10);
  expect(stenen(2)).toHaveLength(0);
  expect(screen.getByText("Player 1", { selector: "strong" })).toBeTruthy();

  const [van, naar] = eersteZet();
  await fireEvent.click(steenOp(van));
  await fireEvent.click(gat(naar));
  expect(screen.getByText("Computer 2", { selector: "strong" })).toBeTruthy();
  await waitFor(() => expect(screen.getByText("Player 1", { selector: "strong" })).toBeTruthy(), { timeout: 3000 });

  await fireEvent.click(screen.getByRole("button", { name: "Resign" }));
  await fireEvent.click(screen.getByRole("button", { name: "Yes, resign" }));
  expect(await screen.findByText("Computer 2 wins!")).toBeTruthy();
  await fireEvent.click(screen.getByRole("button", { name: "New game" }));
  expect((await screen.findByRole("radio", { name: computers(1) })).getAttribute("aria-checked")).toBe("true");
  expect(screen.getByRole("navigation", { name: "Computer" })).toBeTruthy();
});

test("Computer: vijf Computers op moeilijk vullen het sterbord; jij bent plek 1", async () => {
  render(App);
  await naarComputer();
  await fireEvent.click(await screen.findByRole("radio", { name: computers(5) }));
  await fireEvent.click(screen.getByRole("radio", { name: "Hard" }));
  await fireEvent.click(screen.getByRole("button", { name: "Start game" }));
  expect(document.querySelectorAll(".steen")).toHaveLength(60);
  expect(screen.getByText("Player 1", { selector: "strong" })).toBeTruthy();
});

test("Computer op het vierkante bord: alleen 1 of 3 Computers; 5 wordt 3", async () => {
  render(App);
  await naarComputer();
  await fireEvent.click(await screen.findByRole("radio", { name: computers(5) }));
  await fireEvent.click(screen.getByRole("radio", { name: "Square board" }));
  expect(screen.queryByRole("radio", { name: computers(2) })).toBeNull();
  expect(screen.queryByRole("radio", { name: computers(5) })).toBeNull();
  expect(screen.getByRole("radio", { name: computers(3) }).getAttribute("aria-checked")).toBe("true");
  await fireEvent.click(screen.getByRole("button", { name: "Start game" }));
  for (const s of [0, 1, 2, 3]) expect(stenen(s).length).toBeGreaterThan(0);
});
