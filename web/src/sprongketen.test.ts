import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/svelte";
import { tick } from "svelte";
import { readFileSync } from "node:fs";
import { afterEach, beforeAll, beforeEach, expect, test, vi } from "vitest";
import { Potje, initSync } from "./wasm/halma_core.js";
import App from "./App.svelte";
import { NepServer } from "./nep-server";
import { nep, naarScherm } from "./nep-bord3d";
import { naarSpelers } from "./test-start";

// Het 3D-bord als nep: jsdom kent geen WebGL. Tikken gaan als plek op het bord, zoals Bevy ze meldt.
vi.mock("./bord3d", async () => (await import("./nep-bord3d")).nepModule());

beforeAll(() => {
  initSync({ module: readFileSync("src/wasm/halma_core_bg.wasm") });
});
beforeEach(() => nep.reset());
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

/**
 * Een rij vakken naast elkaar (gelijke rij, kolom +1) van `lengte` vakken, uit de spelregels:
 * [stap, steen, (tussen, landing)...]. Op die rij staat een eigen steen met n Sprongen vooruit.
 */
function rij(vierkant: boolean, hups: number) {
  const p = vierkant ? Potje.vierkant(2) : new Potje(2);
  const plekken = Array.from(p.vak_plekken());
  const n = plekken.length / 2;
  const index = new Map<string, number>();
  for (let v = 0; v < n; v++) index.set(`${plekken[2 * v]},${plekken[2 * v + 1]}`, v);
  const lengte = 2 + 2 * hups;
  for (let v = 0; v < n; v++) {
    const q = plekken[2 * v];
    const r = plekken[2 * v + 1];
    const cellen = Array.from({ length: lengte }, (_, i) => index.get(`${q + i},${r}`));
    if (cellen.every((c) => c !== undefined)) {
      const c = cellen as number[];
      const stand = Array(n).fill(-1);
      stand[c[1]] = 0;
      for (let h = 0; h < hups; h++) stand[c[2 + 2 * h]] = 1;
      // Een steen van de ander ver weg, zodat de stand nergens anders een Sprong geeft.
      const ver = Array.from({ length: n }, (_, i) => i).find((i) => stand[i] === -1 && !c.includes(i) && Math.abs(plekken[2 * i + 1] - r) > 3)!;
      stand[ver] = 1;
      p.free();
      const vorm = vierkant ? ("vierkant" as const) : ("ster" as const);
      // Een ruwe tik op vak `vak`: een verschuiving in vakken.
      const tik = (vak: number, dx = 0, dy = 0) => nep.tikVak(vorm, plekken, vak, dx, dy);
      return { stand, van: c[1], stap: c[0], landing: (h: number) => c[3 + 2 * h], n, tik, plekken };
    }
  }
  throw new Error("geen rij gevonden");
}

const steen = (vak: number) => document.querySelector<SVGGElement>(`.steen[data-vak="${vak}"]`);
const gekozen = () => document.querySelector(".steen.gekozen")?.getAttribute("data-vak");
/** De knop (voor toetsenbord en schermlezer) om de gekozen steen naar vak `vak` te proberen. Elk leeg vak heeft er een. */
const gat = (vak: number) => document.querySelector<HTMLElement>(`[data-gat="${vak}"]`)!;
const legeVakken = () => nep.stand.filter((s) => s === -1).length;
const eigenStenen = () => Array.from(document.querySelectorAll<SVGGElement>('.steen[data-speler="0"]')).map((e) => Number(e.dataset.vak));
// Een werkende Done: sinds taak 231 ligt de plaat er altijd, maar dof (uitgeschakeld) zonder Sprongketen.
const klaarKnop = () => {
  const k = screen.queryByRole("button", { name: "Done" }) as HTMLButtonElement | null;
  return k && !k.disabled ? k : null;
};

/** Een tik op het 3D-bord (zoals Bevy hem meldt); daarna is de app bijgewerkt. */
async function tik(doe: () => void) {
  doe();
  await tick();
}

/** Wacht tot het 3D-bord geladen is en tikken doorgeeft. */
const bordGeladen = () => waitFor(() => expect(nep.borden.length).toBeGreaterThan(0));

// ---- Offline, op het Vierkant bord (de stand komt uit de rij hierboven) ----

async function startOffline(hups: number) {
  const r = rij(true, hups);
  vi.spyOn(Potje, "vierkant").mockImplementation(() => Potje.van_stand(true, 2, Int32Array.from(r.stand), 0));
  render(App);
  await naarSpelers("Square board");
  await fireEvent.click(screen.getByLabelText(/^2\s*players/));
  await fireEvent.click(screen.getByRole("button", { name: "Start game" }));
  await bordGeladen();
  return r;
}

test("offline: twee keer springen en dan Done; de Zet gaat in één keer naar het Potje", async () => {
  const r = await startOffline(3);
  await fireEvent.click(steen(r.van)!);
  // Er licht niets op: elk leeg vak is te proberen.
  await waitFor(() => expect(nep.gekozen).toBe(r.van));
  expect(document.querySelectorAll("[data-gat]")).toHaveLength(legeVakken());
  expect(klaarKnop()).toBeNull();

  await fireEvent.click(gat(r.landing(0)));
  // De steen staat op zijn nieuwe vak, blijft gekozen en de beurt is nog niet voorbij.
  expect(gekozen()).toBe(String(r.landing(0)));
  expect(steen(r.van)).toBeNull();
  expect(klaarKnop()).not.toBeNull();
  expect(screen.getByText("Player 1", { selector: "strong" })).toBeTruthy();
  // Midden in de keten verder dan de volgende Sprong kan niet: de steen rolt terug, de keten blijft.
  await fireEvent.click(gat(r.landing(2)));
  expect(nep.missers.at(-1)).toEqual([r.landing(0), r.landing(2)]);
  expect(gekozen()).toBe(String(r.landing(0)));

  await fireEvent.click(gat(r.landing(1)));
  expect(gekozen()).toBe(String(r.landing(1)));
  // Terug naar een eerder vak kan niet: de steen rolt terug.
  await fireEvent.click(gat(r.van));
  expect(nep.missers.at(-1)).toEqual([r.landing(1), r.van]);
  expect(gekozen()).toBe(String(r.landing(1)));
  expect(nep.stand[r.landing(1)]).toBe(0);

  await fireEvent.click(klaarKnop()!);
  expect(eigenStenen()).toEqual([r.landing(1)]);
  expect(klaarKnop()).toBeNull();
  expect(gekozen()).toBeUndefined();
  expect(screen.getByText("Player 2", { selector: "strong" })).toBeTruthy();
});

test("offline: de steen nog eens aantikken eindigt de beurt na een Sprong", async () => {
  const r = await startOffline(3);
  await fireEvent.click(steen(r.van)!);
  await fireEvent.click(gat(r.landing(0)));
  await fireEvent.click(steen(r.landing(0))!);
  expect(eigenStenen()).toEqual([r.landing(0)]);
  expect(screen.getByText("Player 2", { selector: "strong" })).toBeTruthy();
});

test("offline: kan de steen niet verder springen, dan eindigt de beurt vanzelf", async () => {
  const r = await startOffline(2);
  await fireEvent.click(steen(r.van)!);
  await fireEvent.click(gat(r.landing(0)));
  expect(gekozen()).toBe(String(r.landing(0)));
  await fireEvent.click(gat(r.landing(1)));
  expect(eigenStenen()).toEqual([r.landing(1)]);
  expect(klaarKnop()).toBeNull();
  expect(screen.getByText("Player 2", { selector: "strong" })).toBeTruthy();
});

test("offline: een Stap eindigt de beurt meteen", async () => {
  const r = await startOffline(2);
  await fireEvent.click(steen(r.van)!);
  await fireEvent.click(gat(r.stap));
  expect(eigenStenen()).toEqual([r.stap]);
  expect(klaarKnop()).toBeNull();
  expect(screen.getByText("Player 2", { selector: "strong" })).toBeTruthy();
});

test("offline: ver weg tikken laat los voor de eerste Sprong, maar niet erna", async () => {
  const r = await startOffline(3);
  await fireEvent.click(steen(r.van)!);
  // Naast het bord.
  await tik(() => nep.tik(NaN, NaN));
  expect(gekozen()).toBeUndefined();

  await tik(() => r.tik(r.van));
  expect(gekozen()).toBe(String(r.van));
  await tik(() => r.tik(r.landing(0), 0.3, 0.2));
  expect(gekozen()).toBe(String(r.landing(0)));
  // Ver van alles, in de hoek van het bord: de keten blijft staan.
  await tik(() => nep.tik(15.4, 15.4));
  expect(gekozen()).toBe(String(r.landing(0)));
  expect(klaarKnop()).not.toBeNull();
});

// ---- Online, op beide borden ----

let server: NepServer;
let zetten: { van: number; naar: number }[];

beforeEach(() => {
  server = new NepServer();
  const anna = server.voegSpelerToe("Anna");
  server.voegSpelerToe("Ben");
  localStorage.clear();
  localStorage.setItem("halma.speler", JSON.stringify({ speler_id: anna.speler_id, spelersnaam: anna.spelersnaam, sleutel: anna.sleutel }));
  history.replaceState(null, "", "/");
  zetten = [];
  vi.stubGlobal(
    "fetch",
    vi.fn((u: string, i?: RequestInit) => {
      if (u.endsWith("/zetten") && i?.method === "POST") zetten.push(JSON.parse(i.body as string));
      return server.fetch(u, i);
    }),
  );
  vi.stubGlobal("WebSocket", server.WebSocket);
});

async function startOnline(vierkant: boolean, hups: number) {
  const r = rij(vierkant, hups);
  const p = server.maakPotje([1, 2], 2, vierkant ? "vierkant" : "ster");
  p.game = Potje.van_stand(vierkant, 2, Int32Array.from(r.stand), 0);
  localStorage.setItem("halma.potje", "1");
  render(App);
  await screen.findByText("Your turn");
  await bordGeladen();
  return { r, p };
}

for (const vierkant of [false, true]) {
  const naam = vierkant ? "Square board" : "Star board";

  test(`online (${naam}): twee Sprongen en Done sturen de hele Zet één keer naar de server`, async () => {
    const { r, p } = await startOnline(vierkant, 3);
    await fireEvent.click(steen(r.van)!);
    // Ruwe tikken op het bord: het dichtstbijzijnde vak.
    await tik(() => r.tik(r.landing(0), 0.3, 0.25));
    expect(gekozen()).toBe(String(r.landing(0)));
    await tik(() => r.tik(r.landing(1), -0.25, 0.3));
    expect(gekozen()).toBe(String(r.landing(1)));
    expect(zetten).toEqual([]);
    expect(p.versie).toBe(0);

    await fireEvent.click(klaarKnop()!);
    await waitFor(() => expect(p.versie).toBe(1));
    expect(zetten).toEqual([{ van: r.van, naar: r.landing(1) }]);
    await screen.findByText("Ben", { selector: "strong" });
    expect(steen(r.landing(1))?.dataset.speler).toBe("0");
    expect(klaarKnop()).toBeNull();
  });

  test(`online (${naam}): een Stap gaat meteen naar de server`, async () => {
    const { r, p } = await startOnline(vierkant, 2);
    await fireEvent.click(steen(r.van)!);
    await tik(() => r.tik(r.stap, 0.2, 0.1));
    await waitFor(() => expect(p.versie).toBe(1));
    expect(zetten).toEqual([{ van: r.van, naar: r.stap }]);
  });
}

test("online: een Zet die niet mag, rolt terug en gaat niet naar de server; slepen werkt ook", async () => {
  const { r, p } = await startOnline(false, 3);
  await fireEvent.click(steen(r.van)!);
  // Twee Sprongen ver in één keer kan niet.
  await tik(() => r.tik(r.landing(1)));
  expect(nep.missers).toEqual([[r.van, r.landing(1)]]);
  expect(gekozen()).toBe(String(r.van));
  expect(zetten).toEqual([]);
  // Slepen naar de eerste Sprong: de keten begint, er gaat nog niets naar de server.
  const vlak = document.querySelector(".bord3d")!;
  const a = naarScherm("ster", r.plekken, r.van);
  const b = naarScherm("ster", r.plekken, r.landing(0));
  await fireEvent.pointerDown(vlak, { pointerId: 9, clientX: a.x, clientY: a.y, button: 0, pointerType: "touch" });
  await fireEvent.pointerMove(vlak, { pointerId: 9, clientX: (a.x + b.x) / 2, clientY: (a.y + b.y) / 2, pointerType: "touch" });
  await fireEvent.pointerMove(vlak, { pointerId: 9, clientX: b.x, clientY: b.y, pointerType: "touch" });
  await fireEvent.pointerUp(vlak, { pointerId: 9, clientX: b.x, clientY: b.y, button: 0, pointerType: "touch" });
  expect(nep.losgelaten).toEqual([r.landing(0)]);
  expect(gekozen()).toBe(String(r.landing(0)));
  expect(zetten).toEqual([]);
  await fireEvent.click(klaarKnop()!);
  await waitFor(() => expect(p.versie).toBe(1));
  expect(zetten).toEqual([{ van: r.van, naar: r.landing(0) }]);
});

test("online: kan de steen niet verder, dan gaat de Zet vanzelf naar de server", async () => {
  const { r, p } = await startOnline(true, 2);
  await fireEvent.click(steen(r.van)!);
  await fireEvent.click(gat(r.landing(0)));
  expect(zetten).toEqual([]);
  await fireEvent.click(gat(r.landing(1)));
  await waitFor(() => expect(p.versie).toBe(1));
  expect(zetten).toEqual([{ van: r.van, naar: r.landing(1) }]);
});

test("online: wijst de server de Zet af, dan staat het bord weer zoals de server het kent", async () => {
  const { r, p } = await startOnline(true, 3);
  const echteFetch = server.fetch;
  server.fetch = async (u, i) =>
    u.endsWith("/zetten") ? new Response(JSON.stringify({ fout: "not your turn" }), { status: 409 }) : echteFetch(u, i);
  await fireEvent.click(steen(r.van)!);
  await fireEvent.click(gat(r.landing(0)));
  await fireEvent.click(klaarKnop()!);
  expect((await screen.findByRole("alert")).textContent).toContain("not your turn");
  await waitFor(() => expect(eigenStenen()).toEqual([r.van]));
  expect(klaarKnop()).toBeNull();
  expect(p.versie).toBe(0);
});

test("online: tijdens het verzenden doet een tik niets; de Zet gaat één keer naar de server", async () => {
  const { r, p } = await startOnline(false, 2);
  const echteFetch = server.fetch;
  let laatGaan = () => {};
  const wacht = new Promise<void>((klaar) => (laatGaan = klaar));
  server.fetch = async (u, i) => {
    if (u.endsWith("/zetten")) await wacht;
    return echteFetch(u, i);
  };
  await fireEvent.click(steen(r.van)!);
  await fireEvent.click(gat(r.stap));
  expect(zetten).toEqual([{ van: r.van, naar: r.stap }]);
  // De Zet is onderweg: nog eens op de steen of het vak tikken verandert niets en stuurt niets.
  await fireEvent.click(steen(r.van)!);
  expect(gekozen()).toBe(String(r.van));
  await tik(() => r.tik(r.stap));
  expect(zetten).toHaveLength(1);
  laatGaan();
  await waitFor(() => expect(p.versie).toBe(1));
  await screen.findByText("Ben", { selector: "strong" });
  expect(zetten).toEqual([{ van: r.van, naar: r.stap }]);
});

test("online: een nieuwe stand van de server wist de keuze en de Sprongketen", async () => {
  const { r, p } = await startOnline(false, 3);
  await fireEvent.click(steen(r.van)!);
  await fireEvent.click(gat(r.landing(0)));
  expect(eigenStenen()).toEqual([r.landing(0)]);
  // De Denktijd is op: de server slaat de beurt over.
  server.slaOver(p);
  await screen.findByText("Ben", { selector: "strong" });
  expect(eigenStenen()).toEqual([r.van]);
  expect(gekozen()).toBeUndefined();
  expect(klaarKnop()).toBeNull();
  expect(zetten).toEqual([]);
});

test("online: een eigen Sprongketen speelt na het antwoord van de server niet nog eens af", async () => {
  const { r, p } = await startOnline(false, 3);
  await fireEvent.click(steen(r.van)!);
  await fireEvent.click(gat(r.landing(0)));
  await fireEvent.click(gat(r.landing(1)));
  expect(nep.bewegingen.map((b) => [b.vakken[0], b.vakken.at(-1)])).toEqual([
    [r.van, r.landing(0)],
    [r.landing(0), r.landing(1)],
  ]);
  await fireEvent.click(klaarKnop()!);
  await waitFor(() => expect(p.versie).toBe(1));
  await screen.findByText("Ben", { selector: "strong" });
  // De server stuurt de hele Zet als beweging; het bord liet hem al Sprong voor Sprong zien.
  expect(nep.bewegingen).toHaveLength(2);
  expect(steen(r.landing(1))?.dataset.speler).toBe("0");
});
