import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/svelte";
import { readFileSync } from "node:fs";
import { afterEach, beforeAll, beforeEach, expect, test, vi } from "vitest";
import { initSync } from "./wasm/halma_core.js";
import App from "./App.svelte";
import { nep } from "./nep-bord3d";
import { NepServer } from "./nep-server";
import { zetTaal } from "./taal.svelte";
import { codeInvullenTafel, naamTafel } from "./voorwerpen-lijsten";

// Het 3D-bord als nep: jsdom kent geen WebGL, en er is alleen nog de tafel (feature 251).
vi.mock("./bord3d", async () => (await import("./nep-bord3d")).nepModule());

beforeAll(() => {
  initSync({ module: readFileSync("src/wasm/halma_core_bg.wasm") });
});

let server: NepServer;

beforeEach(() => {
  nep.reset();
  server = new NepServer();
  localStorage.clear();
  // Deze tests gaan niet over de vraag "Learn to play?" (taak 157, zie leren.test.ts).
  localStorage.setItem("leapstone.leren.gevraagd", "1");
  history.replaceState(null, "", "/");
  vi.stubGlobal("fetch", vi.fn((u: string, i?: RequestInit) => server.fetch(u, i)));
  vi.stubGlobal("WebSocket", server.WebSocket);
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

// De knoppen liggen als onzichtbare HTML-knoppen boven voorwerpen en komen na een paar microtaken (de laadtafel gaat eerst).
const knop = (naam: string | RegExp) => screen.findByRole("button", { name: naam });
// Het nep-bord legt de voorwerpen 50 px onder elkaar: een knop kan buiten het nep-scherm vallen (display: none); dan de knop zelf.
async function voorwerp(id: string) {
  await waitFor(() => expect(document.querySelector(`[data-voorwerp="${id}"]`)).not.toBeNull());
  return document.querySelector<HTMLButtonElement>(`[data-voorwerp="${id}"]`)!;
}
async function kiesNaam(naam: string) {
  await fireEvent.input(await screen.findByRole("textbox", { name: "Choose a player name" }), { target: { value: naam } });
  await fireEvent.click(await knop("Continue"));
}
async function naarNieuwPotje() {
  await fireEvent.click(await knop("I have saved the code"));
  await fireEvent.click(await knop("New game"));
  await waitFor(() => expect(screen.getByRole("radio", { name: "Star board" })).toBeTruthy());
}

test("bij het kiezen van een spelersnaam: eerst wat je moet doen, met een naam de regel met een link naar de gebruiksregels", async () => {
  render(App);
  await fireEvent.click(await knop("My games"));
  const veld = await screen.findByRole("textbox", { name: "Choose a player name" });
  expect(screen.getByText("Type a player name first.").getAttribute("aria-hidden")).toBe("false");
  expect(screen.queryByRole("link", { name: "Terms" })).toBeNull();
  await fireEvent.input(veld, { target: { value: "Anna" } });
  expect(screen.getByText(/By continuing you agree to the/).getAttribute("aria-hidden")).toBe("false");
  expect(screen.getByText("Type a player name first.").getAttribute("aria-hidden")).toBe("true");
  const link = screen.getByRole("link", { name: "Terms" }) as HTMLAnchorElement;
  expect(new URL(link.href).pathname).toBe("/terms");
});

test("Continue wacht op de server: de plaat blijft ingedrukt en wordt niet dof; Enter in een leeg veld stuurt niets", async () => {
  render(App);
  await fireEvent.click(await knop("My games"));
  const veld = await screen.findByRole("textbox", { name: "Choose a player name" });
  const verzoeken = () => vi.mocked(fetch).mock.calls.filter(([u]) => String(u).includes("/api/spelers")).length;
  await fireEvent.submit(veld.closest("form")!);
  expect(verzoeken()).toBe(0);

  await fireEvent.input(veld, { target: { value: "Anna" } });
  let laat = () => {};
  const echt = server.fetch.bind(server);
  vi.mocked(fetch).mockImplementationOnce((u, i) => new Promise((r) => (laat = () => r(echt(String(u), i)))));
  const doorgaan = (await knop("Continue")) as HTMLButtonElement;
  const nr = naamTafel().findIndex((v) => v.id === "verder");
  // Een vinger (detail 1): de klik zelf drukt niets in, dus alleen het wachten houdt de plaat omlaag.
  await fireEvent.click(doorgaan, { detail: 1 });
  // Ingedrukt zolang het antwoord er niet is, en de knop blijft aan (geen nieuw, dof plaatje), ook als het veld leeg raakt.
  await waitFor(() => expect(nep.druk.at(-1)).toEqual({ nummer: nr, aan: true }));
  // Nog een tik, met de naam nog in het veld, doet niets: één verzoek.
  await fireEvent.click(doorgaan, { detail: 1 });
  expect(verzoeken()).toBe(1);
  await fireEvent.input(veld, { target: { value: "" } });
  expect(doorgaan.disabled).toBe(false);
  // Het andere formulier kan zolang niets versturen: zijn knop is dof.
  await fireEvent.click(await knop("Enter recovery code"));
  await fireEvent.input(await screen.findByRole("textbox", { name: "Your recovery code" }), { target: { value: "HERSTEL-9" } });
  expect(((await knop("Get my player name back")) as HTMLButtonElement).disabled).toBe(true);
  await fireEvent.click(await knop("Back"));
  // Een nieuwe lijst (hier een andere taal) legt een verse plaat neer: die gaat weer omlaag.
  const eerder = nep.druk.length;
  await zetTaal("nl", false);
  await waitFor(() => expect(nep.druk.slice(eerder)).toContainEqual({ nummer: nr, aan: true }));
  laat();
  await zetTaal("en", false);
  expect((await screen.findByTestId("herstelcode")).textContent).toBe("HERSTEL-1");
});

test("na een fout komt Continue omhoog; elke nieuwe lijst laat elke plaat los die niet wacht", async () => {
  render(App);
  await fireEvent.click(await knop("My games"));
  await fireEvent.input(await screen.findByRole("textbox", { name: "Choose a player name" }), { target: { value: "Anna" } });
  vi.mocked(fetch).mockImplementationOnce(() => Promise.reject(new TypeError("geen netwerk")));
  const nr = naamTafel().findIndex((v) => v.id === "verder");
  const terugNr = naamTafel().findIndex((v) => v.id === "terug");
  await fireEvent.click(await knop("Continue"), { detail: 1 });
  await screen.findByRole("alert");
  await waitFor(() => expect(nep.druk.at(-1)).toEqual({ nummer: nr, aan: false }));
  // Elke nieuwe lijst (hier twee talen na elkaar) krijgt het loslaten opnieuw: een lijst kan het in Bevy wissen.
  for (const taal of ["nl", "de"]) {
    const eerder = nep.druk.length;
    await zetTaal(taal, false);
    await waitFor(() => expect(nep.druk.slice(eerder)).toContainEqual({ nummer: nr, aan: false }));
    // Ook Back, die nooit wachtte: een plaat van een vorig scherm op dezelfde plek kan nog omlaag staan.
    expect(nep.druk.slice(eerder)).toContainEqual({ nummer: terugNr, aan: false });
  }
  await zetTaal("en", false);
});

test("spelersnaam kiezen, potje starten, uitnodiging openen als tweede speler", async () => {
  // Speler 1
  render(App);
  await fireEvent.click(await knop("My games"));
  await kiesNaam("Anna");
  expect((await screen.findByTestId("herstelcode")).textContent).toBe("HERSTEL-1");
  expect(screen.getByText("Keep it to get your name back on a new phone.")).toBeTruthy();
  expect(JSON.parse(localStorage.getItem("halma.speler")!).sleutel).toBe("sleutel1");
  await naarNieuwPotje();
  await fireEvent.click(screen.getByRole("radio", { name: "2 players" }));
  await fireEvent.click(await voorwerp("start"));

  expect(await screen.findByText("1 seat still open")).toBeTruthy();
  expect(screen.getByText("Anna (you)")).toBeTruthy();
  expect(screen.getByTestId("uitnodigingslink").textContent).toContain("/uitnodiging/ABCD-EFGH");
  cleanup();

  // Speler 2 opent de link op een andere telefoon.
  localStorage.clear();
  localStorage.setItem("leapstone.leren.gevraagd", "1");
  history.replaceState(null, "", "/uitnodiging/ABCD-EFGH");
  render(App);
  await kiesNaam("Ben");
  await fireEvent.click(await screen.findByRole("button", { name: "I have saved the code" }));
  // Het potje is vol: het bord opent. Anna begint.
  expect(await screen.findByText("Anna", { selector: "strong" })).toBeTruthy();
  await waitFor(() => expect(nep.stand.filter((v) => v >= 0)).toHaveLength(20));
});

test("de wachtkamer volgt de live stroom en opent het bord als het potje vol is", async () => {
  render(App);
  await fireEvent.click(await knop("My games"));
  await kiesNaam("Anna");
  await naarNieuwPotje();
  await fireEvent.click(await voorwerp("start"));
  await screen.findByText("1 seat still open");
  const ben = server.voegSpelerToe("Ben");
  server.potjes[0].spelers.push(ben.speler_id);
  server.stuur(server.potjes[0]);
  expect(await screen.findByText("Your turn")).toBeTruthy();
  expect(localStorage.getItem("halma.potje")).toBe("1");
});

test("je kiest sterbord of vierkant bord bij het maken van een online potje", async () => {
  render(App);
  await fireEvent.click(await knop("My games"));
  await kiesNaam("Anna");
  await naarNieuwPotje();
  await fireEvent.click(screen.getByRole("radio", { name: "Square board" }));
  expect(screen.queryByRole("radio", { name: "3 players" })).toBeNull();
  expect(screen.queryByRole("radio", { name: "6 players" })).toBeNull();
  await fireEvent.click(screen.getByRole("radio", { name: "4 players" }));
  await fireEvent.click(await voorwerp("start"));
  await screen.findByText("3 seats still open");
  expect(server.potjes[0].bord).toBe("vierkant");
  expect(server.potjes[0].aantal_spelers).toBe(4);
});

test("Uitnodigen gebruikt het deelmenu; zonder deelmenu kopieert hij de link", async () => {
  const share = vi.fn().mockResolvedValue(undefined);
  vi.stubGlobal("navigator", { ...navigator, share, clipboard: { writeText: vi.fn().mockResolvedValue(undefined) } });
  render(App);
  await fireEvent.click(await knop("My games"));
  await kiesNaam("Anna");
  await naarNieuwPotje();
  await fireEvent.click(await voorwerp("start"));
  await fireEvent.click(await screen.findByRole("button", { name: "Invite" }));
  expect(share).toHaveBeenCalledWith(expect.objectContaining({ url: expect.stringContaining("/uitnodiging/ABCD-EFGH") }));

  vi.stubGlobal("navigator", { clipboard: { writeText: vi.fn().mockResolvedValue(undefined) } });
  await fireEvent.click(await knop("Invite"));
  expect(await screen.findByRole("button", { name: "Link copied" })).toBeTruthy();
});

test("met de herstelcode krijg je je spelersnaam terug; Enter in een leeg veld stuurt niets, en de knop wacht ingedrukt", async () => {
  server.spelers.push({ speler_id: 1, spelersnaam: "Anna", sleutel: "sleutel1", herstelcode: "HERSTEL-1" });
  const verzoeken = () => vi.mocked(fetch).mock.calls.filter(([u]) => String(u).includes("/api/herstel")).length;
  render(App);
  await fireEvent.click(await knop("My games"));
  await fireEvent.click(await knop("Enter recovery code"));
  const veld = await screen.findByRole("textbox", { name: "Your recovery code" });
  await fireEvent.submit(veld.closest("form")!);
  expect(verzoeken()).toBe(0);
  await fireEvent.input(veld, { target: { value: "FOUT" } });
  await fireEvent.click(await knop("Get my player name back"));
  expect((await screen.findByRole("alert")).textContent).toContain("We do not know this recovery code");

  await fireEvent.input(veld, { target: { value: "HERSTEL-1" } });
  let laat = () => {};
  const echt = server.fetch.bind(server);
  vi.mocked(fetch).mockImplementationOnce((u, i) => new Promise((r) => (laat = () => r(echt(String(u), i)))));
  const terugKrijgen = (await knop("Get my player name back")) as HTMLButtonElement;
  const nr = codeInvullenTafel().findIndex((v) => v.id === "verder");
  await fireEvent.click(terugKrijgen, { detail: 1 });
  await waitFor(() => expect(nep.druk.at(-1)).toEqual({ nummer: nr, aan: true }));
  await fireEvent.click(terugKrijgen, { detail: 1 });
  expect(verzoeken()).toBe(2);
  await fireEvent.input(veld, { target: { value: "" } });
  expect(terugKrijgen.disabled).toBe(false);
  laat();
  expect(await screen.findByRole("heading", { name: "My games" })).toBeTruthy();
});

test("een volle of onbekende uitnodiging geeft een duidelijke melding", async () => {
  server.spelers.push({ speler_id: 1, spelersnaam: "Anna", sleutel: "k1", herstelcode: "H1" });
  server.spelers.push({ speler_id: 2, spelersnaam: "Ben", sleutel: "k2", herstelcode: "H2" });
  server.spelers.push({ speler_id: 3, spelersnaam: "Cor", sleutel: "k3", herstelcode: "H3" });
  server.maakPotje([1, 2], 2);
  localStorage.setItem("halma.speler", JSON.stringify({ speler_id: 3, spelersnaam: "Cor", sleutel: "k3" }));

  history.replaceState(null, "", "/uitnodiging/ABCD-EFGH");
  render(App);
  expect((await screen.findByRole("alert")).textContent).toContain("already full");
  cleanup();

  history.replaceState(null, "", "/uitnodiging/NOPE");
  render(App);
  expect((await screen.findByRole("alert")).textContent).toContain("does not exist");
});
