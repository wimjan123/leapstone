import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/svelte";
import { readFileSync } from "node:fs";
import { afterEach, beforeAll, beforeEach, expect, test, vi } from "vitest";
import { initSync } from "./wasm/halma_core.js";
import App from "./App.svelte";
import { nep } from "./nep-bord3d";
import { NepServer } from "./nep-server";

// Het 3D-bord als nep: jsdom kent geen WebGL.
vi.mock("./bord3d", async () => (await import("./nep-bord3d")).nepModule());

beforeAll(() => {
  initSync({ module: readFileSync("src/wasm/halma_core_bg.wasm") });
});

let server: NepServer;

beforeEach(() => {
  nep.reset();
  server = new NepServer();
  const anna = server.voegSpelerToe("Anna");
  server.voegSpelerToe("Ben");
  localStorage.clear();
  localStorage.setItem("halma.speler", JSON.stringify({ speler_id: anna.speler_id, spelersnaam: anna.spelersnaam, sleutel: anna.sleutel }));
  history.replaceState(null, "", "/");
  vi.stubGlobal("fetch", vi.fn((u: string, i?: RequestInit) => server.fetch(u, i)));
  vi.stubGlobal("WebSocket", server.WebSocket);
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

const stenen = (speler: number) =>
  Array.from(document.querySelectorAll<SVGGElement>(`.steen[data-speler="${speler}"]`));
const gekozen = () => document.querySelector(".steen.gekozen")?.getAttribute("data-vak") ?? null;
const vakken = (speler: number) => stenen(speler).map((s) => s.dataset.vak).sort();

/** Een zet die Ben (plek 2) kan doen. */
function bensZet(p: ReturnType<NepServer["maakPotje"]>): [number, number] {
  const stand = Array.from(p.game.stand());
  const van = stand.findIndex((v, i) => v === 1 && p.game.geldige_bestemmingen(i).length > 0);
  return [van, p.game.geldige_bestemmingen(van)[0]];
}

/** Kies een steen van Anna die kan bewegen en probeer een vak waar hij heen mag (uit de spelregels). Geeft [van, naar]. */
async function speelEenZet(p: ReturnType<NepServer["maakPotje"]>): Promise<[number, number]> {
  const stand = Array.from(p.game.stand());
  const van = stand.findIndex((v, i) => v === 0 && p.game.geldige_bestemmingen(i).length > 0);
  const naar = p.game.geldige_bestemmingen(van)[0];
  await fireEvent.click(document.querySelector<HTMLElement>(`.steen[data-vak="${van}"]`)!);
  await fireEvent.click(document.querySelector<HTMLElement>(`[data-gat="${naar}"]`)!);
  return [van, naar];
}

/** Open de app als Anna, die al in potje 1 zit. */
async function openOnline() {
  localStorage.setItem("halma.potje", "1");
  render(App);
}

test("een online potje: twee zetten, de zet van de ander komt live binnen", async () => {
  const p = server.maakPotje([1, 2], 2);
  await openOnline();
  expect(await screen.findByText("Your turn")).toBeTruthy();
  expect(gekozen()).toBeNull();

  // Zet 1: de app vraagt het aan de server en toont de zet nadat de server hem goedkeurt.
  const [van, naar] = await speelEenZet(p);
  await waitFor(() => expect(screen.getByText("Ben", { selector: "strong" })).toBeTruthy());
  expect(server.verzoeken).toContain("POST /api/potjes/1/zetten");
  expect(p.versie).toBe(1);
  expect(vakken(0)).toContain(String(naar));
  expect(vakken(0)).not.toContain(String(van));

  // Een steen van Ben is niet te kiezen.
  await fireEvent.click(stenen(1)[0]);
  expect(gekozen()).toBeNull();

  // Ben zet buiten de app om: de zet verschijnt live, met de glijbeweging.
  const [benVan, benNaar] = bensZet(p);
  server.zetVan(p, 2, benVan, benNaar);
  expect(await screen.findByText("Your turn")).toBeTruthy();
  expect(vakken(1)).toContain(String(benNaar));
  await waitFor(() => expect(nep.bewegingen.at(-1)?.vakken.at(-1)).toBe(benNaar));
  expect(nep.bewegingen.at(-1)?.vakken[0]).toBe(benVan);
  // Het eigen doel ligt bovenaan: de camera kijkt vanaf de kant van Anna (plek 1).
  expect(nep.borden).toHaveLength(1);

  // Zet 2.
  await speelEenZet(p);
  await waitFor(() => expect(p.versie).toBe(3));
  expect(await screen.findByText("Ben", { selector: "strong" })).toBeTruthy();
});

test("de app keurt zelf geen zet goed: bij een afwijzing blijft het bord staan", async () => {
  const p = server.maakPotje([1, 2], 2);
  await openOnline();
  await screen.findByText("Your turn");
  const voor = vakken(0);
  // De server vindt dat Anna not your turn is (bijvoorbeeld door een vertraagde stand).
  const echteFetch = server.fetch;
  server.fetch = async (u, i) =>
    u.endsWith("/zetten") ? new Response(JSON.stringify({ fout: "je bent not your turn" }), { status: 409 }) : echteFetch(u, i);
  await speelEenZet(p);
  expect((await screen.findByRole("alert")).textContent).toContain("not your turn");
  expect(vakken(0)).toEqual(voor);
  expect(p.versie).toBe(0);
});

test("na verversen van de pagina staat het potje er nog precies zo", async () => {
  const p = server.maakPotje([1, 2], 2);
  await openOnline();
  await screen.findByText("Your turn");
  await speelEenZet(p);
  await screen.findByText("Ben", { selector: "strong" });
  server.zetVan(p, 2, ...bensZet(p));
  await screen.findByText("Your turn");
  const links = [vakken(0), vakken(1)];
  cleanup();

  // Nieuw "venster": zelfde localStorage, geen state.
  render(App);
  expect(await screen.findByText("Your turn")).toBeTruthy();
  expect([vakken(0), vakken(1)]).toEqual(links);
});

test("valt de verbinding weg, dan haalt de app de stand opnieuw op en verbindt weer", async () => {
  const p = server.maakPotje([1, 2], 2);
  await openOnline();
  await screen.findByText("Your turn");
  const liveVoor = server.verzoeken.filter((v) => v.includes("/live")).length;
  server.verbreek(p);
  // Terwijl de verbinding weg is, zet Ben (de stand loopt door op de server).
  await speelEenZet(p);
  await screen.findByText("Ben", { selector: "strong" });
  // Zonder bericht: de server staat al verder (geen stand verstuurd, want de verbinding is weg).
  const [van, naar] = bensZet(p);
  p.game.zet(van, naar);
  p.versie++;
  p.laatste_zet = { nummer: p.versie, plek: 2, soort: "zet", van, naar };
  // Zonder bericht: alleen opnieuw ophalen laat het bord kloppen.
  await waitFor(() => expect(screen.getByText("Your turn")).toBeTruthy(), { timeout: 5000 });
  expect(server.verzoeken.filter((v) => v.includes("/live")).length).toBeGreaterThan(liveVoor);
  expect(server.verzoeken.filter((v) => v === "GET /api/potjes/1").length).toBeGreaterThan(0);
}, 10000);

test("dezelfde stand nog eens (na herverbinden) laat de gekozen steen gekozen: de Zet gaat daarna gewoon door", async () => {
  const p = server.maakPotje([1, 2], 2);
  await openOnline();
  await screen.findByText("Your turn");
  const stand = Array.from(p.game.stand());
  const van = stand.findIndex((v, i) => v === 0 && p.game.geldige_bestemmingen(i).length > 0);
  const naar = p.game.geldige_bestemmingen(van)[0];
  await fireEvent.click(document.querySelector<HTMLElement>(`.steen[data-vak="${van}"]`)!);
  expect(gekozen()).toBe(String(van));

  // Midden in het kiezen of slepen komt dezelfde stand opnieuw binnen, zoals na een herverbinding.
  server.verbreek(p);
  await waitFor(() => expect(server.verzoeken.filter((v) => v === "GET /api/potjes/1").length).toBeGreaterThan(0), { timeout: 5000 });
  await waitFor(() => expect(p.luisteraars.size).toBe(1));
  await new Promise((r) => setTimeout(r, 50));
  expect(gekozen()).toBe(String(van));

  await fireEvent.click(document.querySelector<HTMLElement>(`[data-gat="${naar}"]`)!);
  await waitFor(() => expect(p.versie).toBe(1));
  expect(Array.from(p.game.stand())[naar]).toBe(0);
}, 10000);

test("opgeven vraagt eerst om bevestiging; daarna ziet iedereen de winnaar", async () => {
  const p = server.maakPotje([1, 2], 2);
  await openOnline();
  await screen.findByText("Your turn");
  await fireEvent.click(screen.getByRole("button", { name: "Resign" }));
  await fireEvent.click(screen.getByRole("button", { name: "No, keep playing" }));
  expect(p.versie).toBe(0);
  await fireEvent.click(screen.getByRole("button", { name: "Resign" }));
  await fireEvent.click(screen.getByRole("button", { name: "Yes, resign" }));
  expect(await screen.findByText("Ben wins!")).toBeTruthy();
  expect(server.verzoeken).toContain("POST /api/potjes/1/opgeven");
  await fireEvent.click(screen.getByRole("button", { name: "Back to start" }));
  expect(localStorage.getItem("halma.potje")).toBeNull();
});

test("een vierkant bord van 4 spelers opent als het potje vol is", async () => {
  server.voegSpelerToe("Cor");
  server.voegSpelerToe("Dian");
  const p = server.maakPotje([1, 2, 3, 4], 4, "vierkant");
  await openOnline();
  expect(await screen.findByText("Your turn")).toBeTruthy();
  expect(document.querySelectorAll(".steen").length).toBeGreaterThan(0);
  expect(document.querySelector('[aria-label="Square board"]')).toBeTruthy();
  await waitFor(() => expect(nep.borden.at(-1)?.vierkant).toBe(true));
  await speelEenZet(p);
  await screen.findByText("Ben", { selector: "strong" });
});

test("een adres /potje/<id> (van een Melding) opent dat Potje", async () => {
  const ben = server.spelers[1];
  localStorage.setItem("halma.speler", JSON.stringify({ speler_id: ben.speler_id, spelersnaam: ben.spelersnaam, sleutel: ben.sleutel }));
  server.maakPotje([1, 2], 2);
  history.replaceState(null, "", "/potje/1");
  render(App);
  await waitFor(() => expect(stenen(0).length).toBeGreaterThan(0));
  expect(localStorage.getItem("halma.potje")).toBe("1");
  // Het spel staat op /play/ (op / komt de Landingspagina): het adres van de Melding wordt dat.
  expect(location.pathname).toBe("/play/");
});

test("chat: bericht sturen en ontvangen, met een bolletje voor ongelezen berichten", async () => {
  const p = server.maakPotje([1, 2], 2);
  await openOnline();
  await screen.findByText("Your turn");
  const knop = screen.getByRole("button", { name: /^Chat/ });
  expect(document.querySelector(".ongelezen")).toBeNull();

  // Ben schrijft terwijl de chat dicht is: het bolletje verschijnt.
  server.berichtVan(p, 2, "Gemeen! <b>zet</b>");
  await waitFor(() => expect(document.querySelector(".ongelezen")).not.toBeNull());

  // Chat open: het bericht staat er als platte tekst, met naam van Ben; het bolletje is weg.
  await fireEvent.click(knop);
  const ontvangen = await screen.findByText("Gemeen! <b>zet</b>");
  expect(ontvangen.closest("li")?.textContent).toContain("Ben");
  expect(ontvangen.closest("li")?.classList.contains("eigen")).toBe(false);
  expect(document.querySelector("li b")).toBeNull();
  await waitFor(() => expect(document.querySelector(".ongelezen")).toBeNull());

  // Anna stuurt zelf: het gaat naar de server en staat rechts.
  await fireEvent.input(screen.getByLabelText("Message"), { target: { value: "  Tot je dienst  " } });
  await fireEvent.click(screen.getByRole("button", { name: "Send" }));
  const eigen = await screen.findByText("Tot je dienst");
  expect(eigen.closest("li")?.classList.contains("eigen")).toBe(true);
  expect(server.verzoeken).toContain("POST /api/potjes/1/berichten");
  expect(p.berichten.map((b) => b.tekst)).toEqual(["Gemeen! <b>zet</b>", "Tot je dienst"]);
  await waitFor(() => expect((screen.getByLabelText("Message") as HTMLInputElement).value).toBe(""));

  // Een leeg bericht kan niet verstuurd worden; Escape sluit het vak.
  expect((screen.getByRole("button", { name: "Send" }) as HTMLButtonElement).disabled).toBe(true);
  await fireEvent.keyDown(window, { key: "Escape" });
  await waitFor(() => expect(screen.queryByRole("dialog", { name: "Chat" })).toBeNull());
});

test("chat: berichten van voor het openen van de app staan er meteen", async () => {
  const p = server.maakPotje([1, 2], 2);
  server.berichtVan(p, 2, "Hoi Anna");
  await openOnline();
  await screen.findByText("Your turn");
  await waitFor(() => expect(document.querySelector(".ongelezen")).not.toBeNull());
  await fireEvent.click(screen.getByRole("button", { name: /^Chat/ }));
  expect(await screen.findByText("Hoi Anna")).toBeTruthy();
});

test("chat: lang tikken op een bericht van een ander geeft Report en Block; na Block is die Speler weg", async () => {
  const p = server.maakPotje([1, 2], 2);
  server.berichtVan(p, 2, "You are rubbish");
  server.berichtVan(p, 1, "Rude!");
  await openOnline();
  await screen.findByText("Your turn");
  await fireEvent.click(screen.getByRole("button", { name: /^Chat/ }));
  const bubbel = await screen.findByRole("button", { name: "You are rubbish" });
  // Een eigen Bericht heeft geen menu.
  expect(screen.queryByRole("button", { name: "Rude!" })).toBeNull();

  // Lang tikken: het menu verschijnt al voor het loslaten.
  vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
  await fireEvent.pointerDown(bubbel, { pointerType: "touch" });
  vi.advanceTimersByTime(300);
  expect(screen.queryByRole("menu")).toBeNull();
  vi.advanceTimersByTime(200);
  vi.useRealTimers();
  const menu = await screen.findByRole("menu", { name: "Message from Ben" });
  // De klik na het loslaten laat het menu open.
  await fireEvent.pointerUp(bubbel);
  await fireEvent.click(bubbel);
  expect(screen.getByRole("menu")).toBe(menu);
  expect(bubbel.getAttribute("aria-expanded")).toBe("true");

  // Report: het Rapport gaat naar de server, met de tekst van het Bericht.
  await fireEvent.click(screen.getByRole("menuitem", { name: "Report" }));
  await screen.findByRole("menuitem", { name: "Reported" });
  expect(server.rapporten).toEqual([{ melder_id: 1, speler_id: 2, potje_id: 1, bericht_id: 1, tekst: "You are rubbish" }]);

  // Block: Ben's Berichten zijn weg, ook nieuwe; die van Anna blijven.
  await fireEvent.click(screen.getByRole("menuitem", { name: "Block Ben" }));
  await waitFor(() => expect(screen.queryByText("You are rubbish")).toBeNull());
  expect(screen.getAllByRole("status").some((s) => s.textContent?.includes("Ben blocked"))).toBe(true);
  expect(server.heeftGeblokkeerd(1, 2)).toBe(true);
  server.berichtVan(p, 2, "Still here");
  server.berichtVan(p, 1, "Bye");
  await screen.findByText("Bye");
  expect(screen.queryByText("Still here")).toBeNull();
});

test("chat: het menu werkt met het toetsenbord, en Escape sluit eerst het menu", async () => {
  const p = server.maakPotje([1, 2], 2);
  server.berichtVan(p, 2, "Hello");
  await openOnline();
  await screen.findByText("Your turn");
  await fireEvent.click(screen.getByRole("button", { name: /^Chat/ }));
  const bubbel = await screen.findByRole("button", { name: "Hello" });
  expect(bubbel.getAttribute("aria-haspopup")).toBe("menu");
  // Enter op de knop is een klik zonder aanwijzer.
  bubbel.focus();
  await fireEvent.click(bubbel);
  const report = await screen.findByRole("menuitem", { name: "Report" });
  await waitFor(() => expect(document.activeElement).toBe(report));
  await fireEvent.keyDown(screen.getByRole("menu"), { key: "ArrowRight" });
  expect(document.activeElement).toBe(screen.getByRole("menuitem", { name: "Block Ben" }));
  await fireEvent.keyDown(window, { key: "Escape" });
  await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
  expect(screen.getByRole("dialog", { name: "Chat" })).toBeTruthy();
  expect(document.activeElement).toBe(bubbel);
});
