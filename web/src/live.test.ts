import { readFileSync } from "node:fs";
import { afterEach, beforeAll, beforeEach, expect, test, vi } from "vitest";
import { initSync } from "./wasm/halma_core.js";
import { NepServer } from "./nep-server";
import { ApiFout, liveAdres, volgPotje, type Bericht, type Stand } from "./online";

beforeAll(() => {
  initSync({ module: readFileSync("src/wasm/halma_core_bg.wasm") });
});

let server: NepServer;

beforeEach(() => {
  server = new NepServer();
  server.voegSpelerToe("Anna");
  server.voegSpelerToe("Ben");
  server.voegSpelerToe("Carl");
  vi.stubGlobal("fetch", vi.fn((u: string, i?: RequestInit) => server.fetch(u, i)));
  vi.stubGlobal("WebSocket", server.WebSocket);
});
afterEach(() => vi.unstubAllGlobals());

function volg(sleutel: string, potjeId = 1) {
  const standen: Stand[] = [];
  const berichten: Bericht[] = [];
  const fouten: ApiFout[] = [];
  const verbonden: boolean[] = [];
  const stop = volgPotje(sleutel, potjeId, {
    opStand: (s) => standen.push(s),
    opBericht: (b) => berichten.push(b),
    opFout: (e) => fouten.push(e),
    opVerbonden: (ok) => verbonden.push(ok),
    wacht: [10],
  });
  return { standen, berichten, fouten, verbonden, stop };
}

test("het live adres is dezelfde server met ws of wss", () => {
  expect(liveAdres(7)).toBe(`ws://${location.host}/api/potjes/7/live`);
});

test("twee Spelers zien elkaars Zet en Bericht direct over de WebSocket", async () => {
  const p = server.maakPotje([1, 2], 2);
  const anna = volg("sleutel1");
  const ben = volg("sleutel2");
  await vi.waitFor(() => expect(p.luisteraars.size).toBe(2));
  expect(anna.verbonden).toEqual([true]);

  // Anna (plek 1, in de stand 0) heeft een steen die kan bewegen.
  const stand = Array.from(p.game.stand());
  const van = stand.findIndex((v, i) => v === 0 && p.game.geldige_bestemmingen(i).length > 0);
  const naar = p.game.geldige_bestemmingen(van)[0];
  await server.fetch(`/api/potjes/1/zetten`, {
    method: "POST",
    headers: { Authorization: "Bearer sleutel1" },
    body: JSON.stringify({ van, naar }),
  });
  server.berichtVan(p, 1, "Hi Ben");
  await vi.waitFor(() => expect(ben.standen.at(-1)?.versie).toBe(1));
  await vi.waitFor(() => expect(ben.berichten.map((b) => b.tekst)).toEqual(["Hi Ben"]));
  expect(anna.standen.at(-1)?.laatste_zet).toMatchObject({ soort: "zet", van, naar });
  anna.stop();
  ben.stop();
  await vi.waitFor(() => expect(p.luisteraars.size).toBe(0));
});

test("wie niet meedoet krijgt een fout en de app stopt met volgen", async () => {
  server.maakPotje([1, 2], 2);
  const carl = volg("sleutel3");
  await vi.waitFor(() => expect(carl.fouten.map((f) => f.status)).toEqual([403]));
  const onbekend = volg("fout");
  await vi.waitFor(() => expect(onbekend.fouten.map((f) => f.status)).toEqual([401]));
  expect(server.verzoeken.filter((v) => v.startsWith("WS ")).length).toBe(2);
});

test("valt de WebSocket weg, dan haalt de app de stand op en verbindt opnieuw", async () => {
  const p = server.maakPotje([1, 2], 2);
  const anna = volg("sleutel1");
  await vi.waitFor(() => expect(p.luisteraars.size).toBe(1));
  server.verbreek(p);
  // Wacht op de uitkomst zelf (weg en weer verbonden). Wachten op luisteraars.size === 1 slaagt al voordat de verbinding wegvalt, en dan is de
  // controle hieronder een race (één keer mislukt in een volledige check met Rust en web tegelijk).
  await vi.waitFor(() => expect(anna.verbonden).toEqual([true, false, true]));
  expect(p.luisteraars.size).toBe(1);
  expect(server.verzoeken).toContain("GET /api/potjes/1");
  anna.stop();
});
