import { cleanup, fireEvent, render, screen } from "@testing-library/svelte";
import { readFileSync } from "node:fs";
import { afterEach, beforeAll, beforeEach, expect, test, vi } from "vitest";
import { DagelijksePuzzel, initSync } from "./wasm/halma_core.js";
import App from "./App.svelte";
import Puzzel from "./Puzzel.svelte";
import { wisPrestatiebalk } from "./prestaties";
import { NepServer } from "./nep-server";
import { PUZZEL_OPSLAG, datumVan, gisteren, huidigeReeks, leesOpslag, registreerOplossing } from "./puzzel";

// Het 3D-bord als nep: jsdom kent geen WebGL, en er is alleen nog de tafel (feature 251).
vi.mock("./bord3d", async () => (await import("./nep-bord3d")).nepModule());

// De oplosser en het spelen van een hele puzzel via het scherm duren een paar seconden.
vi.setConfig({ testTimeout: 60_000 });

beforeAll(() => {
  initSync({ module: readFileSync("src/wasm/halma_core_bg.wasm") });
});
beforeEach(() => {
  localStorage.clear();
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

const dag = (jaar: number, maand: number, d: number) => () => new Date(jaar, maand - 1, d, 10, 0, 0);

/** Een oplossing (niet de kortste) van de puzzel van een datum: gulzig zoeken naar het doel, met de regels van het bord. */
const oplossingen = new Map<string, [number, number][]>();
function los(jaar: number, maand: number, d: number): [number, number][] {
  const sleutel = `${jaar}-${maand}-${d}`;
  if (!oplossingen.has(sleutel)) oplossingen.set(sleutel, zoek(jaar, maand, d));
  return oplossingen.get(sleutel)!;
}

const RICHTINGEN = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, -1], [-1, 1]];

function zoek(jaar: number, maand: number, d: number): [number, number][] {
  const p = new DagelijksePuzzel(jaar, maand, d);
  const plekken = p.vak_plekken();
  const index = new Map<string, number>();
  for (let v = 0; v < plekken.length / 2; v++) index.set(`${plekken[2 * v]},${plekken[2 * v + 1]}`, v);
  const buur = (v: number, [dq, dr]: number[]) => index.get(`${plekken[2 * v] + dq},${plekken[2 * v + 1] + dr}`);
  const afstand = (a: number, b: number) => {
    const dq = plekken[2 * a] - plekken[2 * b];
    const dr = plekken[2 * a + 1] - plekken[2 * b + 1];
    return (Math.abs(dq) + Math.abs(dr) + Math.abs(dq + dr)) / 2;
  };
  const stand = p.stand();
  const grijs = new Set<number>();
  const begin: number[] = [];
  stand.forEach((s, v) => (s === 1 ? grijs.add(v) : s === 0 ? begin.push(v) : 0));
  const doel = new Set(Array.from(p.doelvakken()));
  const top = [...doel].reduce((a, b) => (plekken[2 * b + 1] < plekken[2 * a + 1] ? b : a));
  const waarde = (stenen: number[]) => stenen.reduce((som, v) => som + (doel.has(v) ? 0 : 2 + afstand(v, top)), 0);

  // De vakken waar de Steen op `van` heen kan met een stap of één Sprong (het scherm tikt een Sprongketen Sprong voor Sprong).
  const bestemmingen = (stenen: number[], van: number) => {
    const bezet = new Set([...stenen, ...grijs]);
    bezet.delete(van);
    const uit = new Set<number>();
    for (const r of RICHTINGEN) {
      const n = buur(van, r);
      if (n !== undefined && !bezet.has(n)) uit.add(n);
    }
    for (const r of RICHTINGEN) {
      const over = buur(van, r);
      const land = over === undefined ? undefined : buur(over, r);
      if (over !== undefined && land !== undefined && bezet.has(over) && !bezet.has(land)) uit.add(land);
    }
    return [...uit];
  };

  const sleutel = (stenen: number[]) => stenen.join(",");
  const ouder = new Map<string, { van: string; zet: [number, number] } | null>();
  const bakken: number[][][] = [];
  const duw = (stenen: number[]) => {
    const w = waarde(stenen);
    (bakken[w] ??= []).push(stenen);
  };
  const eerste = [...begin].sort((a, b) => a - b);
  ouder.set(sleutel(eerste), null);
  duw(eerste);
  for (let stappen = 0; stappen < 400_000; stappen++) {
    const w = bakken.findIndex((b) => b && b.length);
    if (w < 0) break;
    const stenen = bakken[w].pop()!;
    if (w === 0) {
      const zetten: [number, number][] = [];
      for (let k = sleutel(stenen), o = ouder.get(k); o; k = o.van, o = ouder.get(k)) zetten.push(o.zet);
      return zetten.reverse();
    }
    for (const van of stenen) {
      for (const naar of bestemmingen(stenen, van)) {
        const volgende = stenen.map((v) => (v === van ? naar : v)).sort((a, b) => a - b);
        const k = sleutel(volgende);
        if (ouder.has(k)) continue;
        ouder.set(k, { van: sleutel(stenen), zet: [van, naar] });
        duw(volgende);
      }
    }
  }
  throw new Error("geen oplossing gevonden");
}

async function speel(zetten: [number, number][]) {
  for (const [van, naar] of zetten) {
    await fireEvent.click(document.querySelector(`[data-vak="${van}"]`)!);
    await fireEvent.click(document.querySelector(`[data-gat="${naar}"]`)!);
    // Na een Sprong die verder kan, eindigt de Zet met "Done".
    const klaar = screen.queryByRole("button", { name: "Done" });
    if (klaar) await fireEvent.click(klaar);
  }
}

const stenen = () => [...document.querySelectorAll<HTMLElement>(".steen")].map((e) => `${e.dataset.vak}:${e.dataset.speler}`).sort();

test("dezelfde datum toont dezelfde puzzel, een andere datum een andere", () => {
  render(Puzzel, { terug: vi.fn(), nu: dag(2026, 11, 12) });
  const eerste = stenen();
  const doel = screen.getByText(/^Goal: \d+ moves$/).textContent;
  cleanup();
  render(Puzzel, { terug: vi.fn(), nu: () => new Date(2026, 10, 12, 23, 59) });
  expect(stenen()).toEqual(eerste);
  expect(screen.getByText(/^Goal: \d+ moves$/).textContent).toBe(doel);
  expect(screen.getByText("Moves: 0")).toBeTruthy();
  cleanup();
  render(Puzzel, { terug: vi.fn(), nu: dag(2026, 11, 13) });
  expect(stenen()).not.toEqual(eerste);
});

test("een Zet telt, opnieuw beginnen zet de teller terug", async () => {
  render(Puzzel, { terug: vi.fn(), nu: dag(2026, 11, 12) });
  const [van, naar] = los(2026, 11, 12)[0];
  await speel([[van, naar]]);
  expect(screen.getByText("Moves: 1")).toBeTruthy();
  await fireEvent.click(screen.getByRole("button", { name: "Start over" }));
  expect(screen.getByText("Moves: 0")).toBeTruthy();
});

test("een Zet die niet mag rolt terug: er verandert niets en geen vak licht op", async () => {
  render(Puzzel, { terug: vi.fn(), nu: dag(2026, 11, 12) });
  const voor = stenen();
  const eigen = Number(voor.find((s) => s.endsWith(":0"))!.split(":")[0]);
  const grijs = Number(voor.find((s) => s.endsWith(":1"))!.split(":")[0]);
  // Een grijze Steen kiezen kan niet.
  await fireEvent.click(document.querySelector(`[data-vak="${grijs}"]`)!);
  expect(document.querySelector(".steen.gekozen")).toBeNull();
  // Een eigen Steen kiezen en dan een vak ver weg proberen.
  await fireEvent.click(document.querySelector(`[data-vak="${eigen}"]`)!);
  const gat = [...document.querySelectorAll<HTMLElement>("[data-gat]")].find((g) => !new DagelijksePuzzel(2026, 11, 12).geldige_bestemmingen(eigen).includes(Number(g.dataset.gat)))!;
  await fireEvent.click(gat);
  expect(screen.getByText("Moves: 0")).toBeTruthy();
  expect(stenen()).toEqual(voor);
  expect(document.querySelector(".kan.doel, .bestemming, .hint")).toBeNull();
});

test("oplossen toont het aantal Zetten, je beste aantal en Share", async () => {
  render(Puzzel, { terug: vi.fn(), nu: dag(2026, 11, 12) });
  expect(screen.queryByRole("button", { name: "Share" })).toBeNull();
  const zetten = los(2026, 11, 12);
  await speel(zetten);
  expect(screen.getByText("Solved!")).toBeTruthy();
  expect(screen.getByText(`Moves: ${zetten.length}`)).toBeTruthy();
  expect(screen.getByText(`Best: ${zetten.length}`)).toBeTruthy();
  expect(await screen.findByRole("button", { name: "Share" })).toBeTruthy();
  expect(leesOpslag().beste).toEqual({ datum: "2026-11-12", zetten: zetten.length });
});

test("de deeltekst noemt Zetten en Streefgetal, heeft een link en geen Spelersnaam", async () => {
  localStorage.setItem("halma.speler", JSON.stringify({ speler_id: 1, spelersnaam: "Anna", sleutel: "geheim" }));
  const schrijf = vi.fn().mockResolvedValue(undefined);
  vi.stubGlobal("navigator", { ...navigator, share: undefined, clipboard: { writeText: schrijf } });
  render(Puzzel, { terug: vi.fn(), nu: dag(2026, 11, 12) });
  const zetten = los(2026, 11, 12);
  const streef = new DagelijksePuzzel(2026, 11, 12).streefgetal();
  await speel(zetten);
  await fireEvent.click(screen.getByRole("button", { name: "Share" }));
  expect(schrijf).toHaveBeenCalledOnce();
  const tekst: string = schrijf.mock.calls[0][0];
  expect(tekst).toContain(`Leapstone puzzle 12 Nov: ${zetten.length} moves (goal ${streef})`);
  expect(tekst).toContain("https://playleapstone.com/");
  expect(tekst).not.toContain("Anna");
  expect(await screen.findByText("Copied")).toBeTruthy();
});

test("Share gebruikt het deelmenu van het toestel als dat er is", async () => {
  const deel = vi.fn().mockResolvedValue(undefined);
  vi.stubGlobal("navigator", { ...navigator, share: deel });
  render(Puzzel, { terug: vi.fn(), nu: dag(2026, 11, 12) });
  await speel(los(2026, 11, 12));
  await fireEvent.click(screen.getByRole("button", { name: "Share" }));
  expect(deel).toHaveBeenCalledOnce();
  expect(deel.mock.calls[0][0].text).toMatch(/^Leapstone puzzle 12 Nov: \d+ moves \(goal \d+\)\nhttps:\/\/playleapstone\.com\/$/);
});

test("Reeks: 1, dan 2 op de volgende dag, en weer 1 na een gemiste dag", async () => {
  for (const [d, verwacht] of [[12, "Streak: 1 day"], [13, "Streak: 2 days"], [15, "Streak: 1 day"]] as const) {
    render(Puzzel, { terug: vi.fn(), nu: dag(2026, 11, d) });
    await speel(los(2026, 11, d));
    expect(screen.getByText(verwacht)).toBeTruthy();
    cleanup();
  }
});

test("Reeks: nog een keer oplossen op dezelfde dag telt niet dubbel; een nieuwe oplossing boven het Streefgetal telt wel mee", () => {
  const d = datumVan(new Date(2026, 11, 31));
  expect(registreerOplossing(d, 9).reeks).toBe(1);
  expect(registreerOplossing(d, 7).reeks).toBe(1);
  expect(leesOpslag().beste).toEqual({ datum: "2026-12-31", zetten: 7 });
  expect(registreerOplossing(d, 8).beste?.zetten).toBe(7);
  // Over de jaargrens heen: 31 december en 1 januari zijn opeenvolgende dagen.
  const nieuwjaar = datumVan(new Date(2027, 0, 1));
  expect(gisteren(nieuwjaar)).toEqual(d);
  expect(registreerOplossing(nieuwjaar, 5).reeks).toBe(2);
  expect(huidigeReeks(leesOpslag(), datumVan(new Date(2027, 0, 2)))).toBe(2);
  expect(huidigeReeks(leesOpslag(), datumVan(new Date(2027, 0, 3)))).toBe(0);
});

test("kapotte opslag geeft een lege Reeks", () => {
  localStorage.setItem(PUZZEL_OPSLAG, "{kapot");
  expect(leesOpslag()).toEqual({ opgelost: null, reeks: 0, beste: null });
});

test("om middernacht komt de puzzel van de nieuwe dag", async () => {
  vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "Date"] });
  vi.setSystemTime(new Date(2026, 10, 12, 23, 59, 59));
  render(Puzzel, { terug: vi.fn() });
  const oud = stenen();
  await vi.advanceTimersByTimeAsync(2000);
  expect(stenen()).not.toEqual(oud);
});

test("in het menu staat Puzzle of the day en opent het scherm", async () => {
  render(App);
  await fireEvent.click(await screen.findByRole("button", { name: "Puzzle of the day" }));
  expect(await screen.findByText(/^Goal: \d+ moves$/)).toBeTruthy();
  await fireEvent.click(await screen.findByRole("button", { name: "Back" }));
  expect(await screen.findByRole("button", { name: "Puzzle of the day" })).toBeTruthy();
});

// Taak 174: een nieuwe Prestatie na de Dagelijkse puzzel geeft een balkje, een al bekende niet.
test("na het oplossen geeft een nieuwe Prestatie van de server een balkje, een bekende niet", async () => {
  wisPrestatiebalk();
  localStorage.setItem("halma.speler", JSON.stringify({ speler_id: 7, spelersnaam: "Anna", sleutel: "geheim" }));
  let opgelost = false;
  const lijst = () => [
    { id: "first_win", behaald_ms: 1700000000000 },
    { id: "puzzle_streak_7", behaald_ms: opgelost ? 1700000500000 : null },
  ];
  const aanroepen: string[] = [];
  const gemeld: unknown[] = [];
  vi.stubGlobal("fetch", vi.fn(async (u: string, init?: RequestInit) => {
    aanroepen.push(u);
    if (u.endsWith("/puzzeldagen")) {
      gemeld.push(JSON.parse(String(init?.body)));
      return new Response(null, { status: 204 });
    }
    return new Response(JSON.stringify(lijst()), { status: 200, headers: { "Content-Type": "application/json" } });
  }));
  render(Puzzel, { terug: vi.fn(), nu: dag(2026, 11, 12) });
  await vi.waitFor(() => expect(localStorage.getItem("leapstone.prestaties.7")).toContain("first_win"));
  expect(screen.queryByTestId("prestatiebalk")).toBeNull();
  const { default: Balkje } = await import("./Prestatiebalkje.svelte");
  render(Balkje);
  opgelost = true;
  await speel(los(2026, 11, 12));
  const balkje = await screen.findByTestId("prestatiebalk");
  expect(balkje.textContent).toContain("Achievement: Seven puzzle days in a row");
  // first_win was al bekend: precies één balkje.
  expect(document.querySelectorAll("[data-testid=prestatiebalk]")).toHaveLength(1);
  // Taak 175: de server krijgt alleen de datum van de oplossing, en daarna pas de vraag om de Prestaties.
  expect(gemeld).toEqual([{ datum: "2026-11-12" }]);
  expect(aanroepen.every((u) => u.endsWith("/prestaties") || u.endsWith("/puzzeldagen"))).toBe(true);
  expect(aanroepen.findIndex((u) => u.endsWith("/puzzeldagen"))).toBeLessThan(aanroepen.length - 1);
  wisPrestatiebalk();
});

// Taak 175: de zevende dag achter elkaar geeft de Prestatie "Reeks van zeven"; een gat in de Reeks niet.
test("de zevende dag achter elkaar geeft een balkje, na een gat niet", async () => {
  wisPrestatiebalk();
  const server = new NepServer();
  const anna = server.voegSpelerToe("Anna");
  localStorage.setItem("halma.speler", JSON.stringify({ speler_id: anna.speler_id, spelersnaam: anna.spelersnaam, sleutel: anna.sleutel }));
  vi.stubGlobal("fetch", vi.fn((u: string, i?: RequestInit) => server.fetch(u, i)));
  // Zes dagen eerder opgelost (6 tot en met 11 november).
  server.puzzeldagen.set(anna.speler_id, new Set(["2026-11-06", "2026-11-07", "2026-11-08", "2026-11-09", "2026-11-10", "2026-11-11"]));
  const streak = () => server.prestaties(anna.speler_id).find((p) => p.id === "puzzle_streak_7")!.behaald_ms;
  expect(streak()).toBeNull();
  render(Puzzel, { terug: vi.fn(), nu: dag(2026, 11, 12) });
  const { default: Balkje } = await import("./Prestatiebalkje.svelte");
  await vi.waitFor(() => expect(localStorage.getItem(`leapstone.prestaties.${anna.speler_id}`)).not.toBeNull());
  render(Balkje);
  await speel(los(2026, 11, 12));
  const balkje = await screen.findByTestId("prestatiebalk");
  expect(balkje.textContent).toContain("Seven puzzle days in a row");
  // De datum van dag zeven: 12 november.
  expect(new Date(streak()!).toISOString().slice(0, 10)).toBe("2026-11-12");
  wisPrestatiebalk();

  // Met een gat (de 10e ontbreekt) geeft dag zeven niets.
  const andere = new NepServer();
  const ben = andere.voegSpelerToe("Ben");
  andere.puzzeldagen.set(ben.speler_id, new Set(["2026-11-06", "2026-11-07", "2026-11-08", "2026-11-09", "2026-11-11", "2026-11-12"]));
  expect(andere.prestaties(ben.speler_id).find((p) => p.id === "puzzle_streak_7")!.behaald_ms).toBeNull();
});
