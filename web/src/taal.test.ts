// Taak 127: het spel in meer talen, met taalkeuze in Account.
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/svelte";
import { readFileSync } from "node:fs";
import { afterEach, beforeAll, beforeEach, expect, test, vi } from "vitest";
import { initSync } from "./wasm/halma_core.js";
import App from "./App.svelte";
import { NepServer } from "./nep-server";
import { nep } from "./nep-bord3d";
import en, { woorden as woordenEn } from "./talen/en";
import { TALEN } from "./talen/register";
import { kiesUitTalen, laadBegintaal, t, tn, vasteZin, zetTaal } from "./taal.svelte";

// Het 3D-bord als nep: jsdom kent geen WebGL, en er is alleen nog de tafel (feature 251).
vi.mock("./bord3d", async () => (await import("./nep-bord3d")).nepModule());

beforeAll(() => {
  initSync({ module: readFileSync("src/wasm/halma_core_bg.wasm") });
});

let server: NepServer;

beforeEach(() => {
  nep.reset();
  server = new NepServer();
  const anna = server.voegSpelerToe("Anna");
  localStorage.clear();
  localStorage.setItem("halma.speler", JSON.stringify({ speler_id: anna.speler_id, spelersnaam: anna.spelersnaam, sleutel: anna.sleutel }));
  history.replaceState(null, "", "/");
  vi.stubGlobal("fetch", vi.fn((u: string, i?: RequestInit) => server.fetch(u, i)));
});
afterEach(async () => {
  cleanup();
  vi.unstubAllGlobals();
  await zetTaal("en", false);
  localStorage.clear();
});

const basis = (sleutel: string) => sleutel.replace(/\.(zero|one|two|few|many|other)$/, "");

test("elke taaltabel heeft dezelfde sleutels als de Engelse, en dezelfde woordenlijst", async () => {
  const bron = new Set(Object.keys(en).map(basis));
  for (const [code, info] of Object.entries(TALEN)) {
    const { default: tabel, woorden } = await info.laad();
    expect(new Set(Object.keys(tabel).map(basis)), `sleutels van ${code}`).toEqual(bron);
    expect(Object.keys(tabel).filter((k) => k.endsWith(".other")).length, `meervoud van ${code}`).toBe(Object.keys(en).filter((k) => k.endsWith(".other")).length);
    expect(Object.keys(woorden).sort(), `woordenlijst van ${code}`).toEqual(Object.keys(woordenEn).sort());
    for (const [sleutel, tekst] of Object.entries(tabel)) {
      expect(tekst.trim(), `${code} ${sleutel}`).not.toBe("");
      // Dezelfde invulplekken als het Engels.
      const plekken = (s: string) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();
      const bronSleutel = sleutel in en ? sleutel : `${basis(sleutel)}.other`;
      expect(plekken(tekst), `${code} ${sleutel}`).toEqual(plekken((en as Record<string, string>)[bronSleutel]));
    }
  }
});

test("Duits: het Startmenu en Account staan in het Duits", async () => {
  await zetTaal("de");
  render(App);
  expect(await screen.findByRole("button", { name: "Auf diesem Handy spielen" })).toBeTruthy();
  expect(await screen.findByRole("button", { name: "Gegen den Computer spielen" })).toBeTruthy();
  expect(screen.getByText("Auf diesem Handy")).toBeTruthy();
  expect(screen.queryByText("Play online")).toBeNull();
  expect(document.documentElement.lang).toBe("de");
  await fireEvent.click(await screen.findByRole("button", { name: "Meine Partien" }));
  await fireEvent.click(await screen.findByRole("button", { name: "Konto" }));
  expect(await screen.findByRole("link", { name: "Datenschutzerklärung" })).toBeTruthy();
  expect(screen.getByRole("link", { name: "Nutzungsbedingungen" })).toBeTruthy();
  expect(screen.getByText("Blockierte Spieler")).toBeTruthy();
  expect(screen.queryByText("Privacy policy")).toBeNull();
});

test("Arabisch, Hebreeuws en Urdu staan rechts naar links; Duits en Engels links naar rechts", async () => {
  for (const code of ["ar", "he", "ur"]) {
    await zetTaal(code, false);
    expect(document.documentElement.dir, code).toBe("rtl");
    expect(document.documentElement.lang).toBe(code);
  }
  await zetTaal("de", false);
  expect(document.documentElement.dir).toBe("ltr");
  await zetTaal("ar", false);
  render(App);
  expect(await screen.findByRole("button", { name: "العب على هذا الهاتف" })).toBeTruthy();
  expect(tn("players.count", 2)).toBe("2 لاعبان");
  expect(kiesUitTalen(["iw-IL"])).toBe("he");
});

test("een onbekende taal geeft Engels, en een ontbrekende zin valt terug op Engels", async () => {
  expect(kiesUitTalen(["xx-YY", "zz"])).toBe("en");
  expect(kiesUitTalen([])).toBe("en");
  vi.stubGlobal("navigator", { ...navigator, languages: ["xx-YY"], language: "xx-YY" });
  await laadBegintaal();
  render(App);
  expect(await screen.findByRole("button", { name: "Play on this phone" })).toBeTruthy();
  expect(document.documentElement.lang).toBe("en");
  vi.unstubAllGlobals();
  // Een taal zonder een sleutel toont voor die ene zin het Engels.
  TALEN.proef = { naam: "Proef", laad: async () => ({ default: { "menu.play": "Proef" }, woorden: {} }) };
  await zetTaal("proef", false);
  expect(t("menu.play")).toBe("Proef");
  expect(t("menu.friends")).toBe("Friends");
  delete TALEN.proef;
});

test("de taal van de telefoon wordt gevolgd: nl-NL, de-AT en een lijst met voorkeuren", () => {
  expect(kiesUitTalen(["nl-NL"])).toBe("nl");
  expect(kiesUitTalen(["de-AT", "en"])).toBe("de");
  expect(kiesUitTalen(["sw-KE", "de"])).toBe("de");
  expect(kiesUitTalen(["DE_ch"])).toBe("de");
});

test("meervoud: 1 en meer", async () => {
  await zetTaal("de");
  expect(tn("online.seatsOpen", 1)).toBe("Noch 1 Platz frei");
  expect(tn("online.seatsOpen", 3)).toBe("Noch 3 Plätze frei");
  await zetTaal("en");
  expect(tn("online.seatsOpen", 1)).toBe("1 seat still open");
});

test("Vaste zin: de Engelse zin van de server verschijnt in de taal van de lezer", async () => {
  expect(vasteZin("Good game")).toBe("Good game");
  await zetTaal("de");
  expect(vasteZin("Good game")).toBe("Gute Partie");
  expect(vasteZin("Well played")).toBe("Gut gespielt");
  // Een vrij Bericht blijft zoals de afzender het schreef.
  expect(vasteZin("Gute Partie, bis später")).toBe("Gute Partie, bis später");
  expect(vasteZin("Hello there")).toBe("Hello there");
});

test("Account: een taal kiezen blijft bewaard; English zet alles weer in het Engels", async () => {
  vi.stubGlobal("navigator", { ...navigator, languages: ["de-DE"], language: "de-DE" });
  await laadBegintaal();
  render(App);
  expect(await screen.findByRole("button", { name: "Auf diesem Handy spielen" })).toBeTruthy();
  await fireEvent.click(await screen.findByRole("button", { name: "Meine Partien" }));
  await fireEvent.click(await screen.findByRole("button", { name: "Konto" }));
  await fireEvent.click(await screen.findByRole("button", { name: /Sprache/ }));
  const anna = server.spelers[0].speler_id;
  const duits = screen.getByRole("button", { name: "Deutsch" });
  expect(duits.getAttribute("aria-pressed")).toBe("true");
  expect(screen.getByRole("button", { name: "Nederlands" })).toBeTruthy();
  // Een andere taal kiezen: de server hoort het, voor Meldingen en foutmeldingen.
  await fireEvent.click(screen.getByRole("button", { name: "Nederlands" }));
  await waitFor(() => expect(server.talen.get(anna)).toBe("nl"));
  await fireEvent.click(await screen.findByRole("button", { name: /Taal/ }));
  await fireEvent.click(screen.getByRole("button", { name: "English" }));
  expect(await screen.findByRole("link", { name: "Privacy policy" })).toBeTruthy();
  // Wie Engels kiest, meldt dat ook: de server vertaalt dan niets.
  await waitFor(() => expect(server.talen.get(anna)).toBe("en"));
  expect(localStorage.getItem("leapstone.taal")).toBe("en");
  expect(document.documentElement.lang).toBe("en");
  // De volgende keer opent het spel in het Engels, ook al staat de telefoon op Duits.
  cleanup();
  await laadBegintaal();
  render(App);
  expect(await screen.findByRole("button", { name: "Play on this phone" })).toBeTruthy();
  expect(screen.queryByRole("button", { name: "Auf diesem Handy spielen" })).toBeNull();
});

test("Nederlands: de woorden uit de woordenlijst staan in het scherm", async () => {
  await zetTaal("nl");
  render(App);
  expect(await screen.findByRole("button", { name: "Online spelen met vrienden" })).toBeTruthy();
  expect(await screen.findByRole("button", { name: "Ranglijst" })).toBeTruthy();
});
