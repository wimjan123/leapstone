// Taak 223: de laadtafel bij het openen van het Startmenu. De eerste keer ligt de zijden tafel er met een laadteken tot de 3D-tafel
// klaar is; zonder 3D het foutscherm (feature 251, er is geen plat menu meer); met minder beweging gaat alles meteen.
// `tafelGezien` in Startmenu.svelte onthoudt per pagina dat de tafel al stond: elke test laadt de modules daarom opnieuw.
import { cleanup as ruim, fireEvent, screen, waitFor } from "@testing-library/svelte";
import { readFileSync } from "node:fs";
import { afterEach, beforeEach, expect, test, vi } from "vitest";

vi.mock("./bord3d", async () => (await import("./nep-bord3d")).nepModule());

beforeEach(() => {
  vi.resetModules();
  localStorage.clear();
});
let opruimen = () => {};
let nepOver: { faal: boolean; kan3d: boolean; laden: Promise<void> | null } | null = null;
afterEach(() => {
  opruimen();
  if (nepOver) Object.assign(nepOver, { faal: false, kan3d: true, laden: null });
  ruim();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

const laadtafel = () => document.querySelector(".laadtafel");
const knop = (id: string) => document.querySelector<HTMLButtonElement>(`.tafel-knop[data-voorwerp="${id}"]`);

/** Een Startmenu op een vers geladen pagina; `klaar` bepaalt wanneer Bevy "alles getekend" meldt. */
async function opstarten(opties: { kan3d?: boolean; faal?: boolean; app?: boolean; laden?: Promise<void> } = {}) {
  const { initSync } = await import("./wasm/halma_core.js");
  initSync({ module: readFileSync("src/wasm/halma_core_bg.wasm") });
  // Het nep-bord dat de app krijgt (de nepmodule blijft bestaan als de andere modules opnieuw laden).
  const bord = await import("./bord3d");
  const nep = (await bord.laadBord3d([])) as import("./nep-bord3d").NepBord;
  nepOver = nep;
  nep.reset();
  let tekent = false;
  nep.klaar = () => tekent;
  nep.faal = !!opties.faal;
  nep.laden = opties.laden ?? null;
  if (opties.kan3d === false) nep.kan3d = false;
  // Svelte en de testbibliotheek horen bij dezelfde, verse set modules als het Startmenu.
  const { render, cleanup } = await import("@testing-library/svelte");
  opruimen = cleanup;
  const online = vi.fn();
  if (opties.app) {
    const { default: App } = await import("./App.svelte");
    render(App);
  } else {
    const { default: Startmenu } = await import("./Startmenu.svelte");
    render(Startmenu, { start: vi.fn(), online, puzzel: vi.fn(), speluitleg: vi.fn() });
  }
  return { nep, online, tekenKlaar: () => (tekent = true) };
}

test("de eerste keer staat er de laadtafel tot de tafel klaar is, en geen plat menu", async () => {
  const { tekenKlaar } = await opstarten();
  expect(laadtafel()).not.toBeNull();
  expect(screen.getByRole("status")).toBeTruthy();
  expect(document.querySelector(".plat")).toBeNull();
  expect(document.querySelector(".tafel-knop")).toBeNull();

  tekenKlaar();
  await waitFor(() => expect(knop("spelen")).not.toBeNull());
  await waitFor(() => expect(laadtafel()).toBeNull());
  expect(document.querySelector(".plat")).toBeNull();
});

test("tikken kan pas als de tafel klaar is", async () => {
  const { online, tekenKlaar } = await opstarten();
  // De laadtafel ligt over het scherm en er is nog geen knop om te tikken.
  expect(knop("online")).toBeNull();
  expect(online).not.toHaveBeenCalled();
  tekenKlaar();
  await waitFor(() => expect(knop("online")).not.toBeNull());
  await waitFor(() => expect(document.querySelector(".tafel-knoppen.wacht")).toBeNull());
  await fireEvent.click(knop("online")!);
  expect(online).toHaveBeenCalledWith("snel");
});

test("zonder WebGL2 is er geen laadtafel en geen menu: het foutscherm staat er meteen", async () => {
  await opstarten({ kan3d: false, app: true });
  expect(laadtafel()).toBeNull();
  expect(screen.getByRole("alert")).toBeTruthy();
  expect(document.querySelector(".tafel-knop")).toBeNull();
});

test("mislukt 3D tijdens het laden, dan verdwijnt de laadtafel en staat het foutscherm er", async () => {
  await opstarten({ faal: true, app: true });
  await waitFor(() => expect(screen.getByRole("button", { name: "Try again" })).toBeTruthy());
  expect(laadtafel()).toBeNull();
  expect(document.querySelector(".tafel-knop")).toBeNull();
});

test("een trage verbinding is geen fout: de laadtafel blijft tot het 3D-bord binnen is, en pas daarna loopt het geduld", async () => {
  let nu = 0;
  vi.spyOn(performance, "now").mockImplementation(() => nu);
  const beelden = () => new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));
  let binnen = () => {};
  await opstarten({ app: true, laden: new Promise<void>((r) => (binnen = r)) });
  // Het ophalen duurt een minuut: veel langer dan het geduld van 12 s.
  nu = 60_000;
  await beelden();
  expect(screen.queryByRole("alert")).toBeNull();
  expect(laadtafel()).not.toBeNull();
  // Het bord is binnen maar tekent nog niets: het geduld begint nu pas.
  binnen();
  await beelden();
  nu += 11_000;
  await beelden();
  expect(screen.queryByRole("alert")).toBeNull();
  nu += 2_000;
  await waitFor(() => expect(screen.getByRole("button", { name: "Try again" })).toBeTruthy());
});

test("met minder beweging is de laadtafel meteen weg zodra de tafel klaar is", async () => {
  vi.stubGlobal("matchMedia", (q: string) => ({ matches: q.includes("reduce"), media: q, addEventListener() {}, removeEventListener() {} }));
  // Zonder minder beweging zou een Element.animate de laadtafel nog 260 ms laten uitvervagen; hier mag dat niet.
  const animeer = vi.fn(() => ({ cancel() {}, finish() {}, onfinish: null, finished: new Promise(() => {}) }));
  Element.prototype.animate = animeer as never;
  const { tekenKlaar } = await opstarten();
  expect(laadtafel()).not.toBeNull();
  tekenKlaar();
  await waitFor(() => expect(laadtafel()).toBeNull());
  expect(animeer).not.toHaveBeenCalled();
});

test("overgang van de laadtafel: 260 ms, of 0 met minder beweging", async () => {
  const { laadtafelUit } = await import("./overgang");
  Element.prototype.animate = (() => ({})) as never;
  const el = document.createElement("div");
  expect(laadtafelUit(el).duration).toBe(260);
  vi.stubGlobal("matchMedia", (q: string) => ({ matches: q.includes("reduce") }));
  expect(laadtafelUit(el).duration).toBe(0);
});
