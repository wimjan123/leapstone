// Taak 158: geluid bij Zetten en Sprongen.
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import type { Beweging } from "./spelers";

/** Een nepbrowser-audio die elke toon onthoudt: begin-Hz, hoe hard (piek) en hoe lang. */
type Toon = { hz: number; piek: number; duur: number };
let tonen: Toon[];
let sessie: { type: string } | undefined;

class NepContext {
  state = "running";
  currentTime = 0;
  destination = {};
  constructor() {
    nepContexten++;
  }
  resume = vi.fn(async () => {});
  suspend = vi.fn(async () => {});
  createGain() {
    const piek = { v: 0 };
    return {
      gain: {
        setValueAtTime() {},
        exponentialRampToValueAtTime: (v: number) => (piek.v = Math.max(piek.v, v)),
      },
      connect() {},
      piek,
    };
  }
  createOscillator() {
    const o = {
      type: "sine",
      hz: 0,
      frequency: { setValueAtTime: (v: number) => (o.hz = v), exponentialRampToValueAtTime() {} },
      connect: (g: { piek: { v: number } }) => (o.g = g),
      g: undefined as undefined | { piek: { v: number } },
      start: (t: number) => (o.t0 = t),
      stop: (t: number) => tonen.push({ hz: o.hz, piek: o.g?.piek.v ?? 0, duur: t - o.t0 }),
      t0: 0,
    };
    return o;
  }
}
let nepContexten = 0;

async function laad() {
  vi.resetModules();
  return await import("./geluid");
}

function beweging(hups: number): Beweging {
  const pad = Array.from({ length: hups + 1 }, (_, i) => ({ x: 2 * (hups - i), y: 0 }));
  return { naar: 9, vakken: pad.map((_, i) => i), pad, sprong: hups > 0 && true };
}

beforeEach(() => {
  tonen = [];
  nepContexten = 0;
  sessie = { type: "auto" };
  localStorage.clear();
  vi.stubGlobal("AudioContext", NepContext);
  vi.stubGlobal("navigator", { ...navigator, audioSession: sessie });
  vi.useFakeTimers();
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  Object.defineProperty(document, "visibilityState", { value: "visible", configurable: true });
});

test("elke gebeurtenis speelt het juiste geluid", { timeout: 30000 }, async () => {
  const g = await laad();
  g.meld({ soort: "stap" });
  g.meld({ soort: "sprong", nummer: 0 });
  g.meld({ soort: "terug" });
  g.meld({ soort: "winst" });
  // stap, sprong, terug (één toon elk) en winst (drie tonen)
  expect(tonen).toHaveLength(6);
  const [stap, sprong, terug, ...winst] = tonen;
  expect(stap.hz).toBeLessThan(sprong.hz);
  expect(terug.hz).toBeLessThan(stap.hz); // zacht en laag
  expect(terug.duur).toBeGreaterThan(stap.duur);
  expect(winst.map((w) => w.hz)).toEqual([...winst.map((w) => w.hz)].sort((a, b) => a - b));
  // Geen geluid langer dan een halve seconde en niet hard.
  for (const k of [stap, sprong, terug, ...winst]) expect(k.duur).toBeLessThan(0.5);
  for (const k of tonen) expect(k.piek).toBeLessThanOrEqual(0.35);
});

test("Sprongen in één Zet lopen op in toonhoogte", async () => {
  const g = await laad();
  for (let n = 0; n < 4; n++) g.meld({ soort: "sprong", nummer: n });
  const hz = tonen.map((t) => t.hz);
  expect(hz).toEqual([...hz].sort((a, b) => a - b));
  expect(new Set(hz).size).toBe(4);
});

test("een Zet met drie Sprongen van een tegenstander klinkt als drie oplopende klikken, zachter", async () => {
  const g = await laad();
  g.meldBeweging(beweging(3), { tegenstander: true });
  await vi.advanceTimersByTimeAsync(2000);
  expect(tonen).toHaveLength(3);
  expect(tonen[0].hz).toBeLessThan(tonen[1].hz);
  expect(tonen[1].hz).toBeLessThan(tonen[2].hz);
  tonen.length = 0;
  g.meldBeweging(beweging(3), { tegenstander: false });
  await vi.advanceTimersByTimeAsync(2000);
  expect(tonen[0].piek).toBeGreaterThan(0);
  const eigen = tonen[0].piek;
  tonen.length = 0;
  g.meldBeweging(beweging(3), { tegenstander: true });
  await vi.advanceTimersByTimeAsync(2000);
  expect(tonen[0].piek).toBeLessThan(eigen);
});

test("een stap geeft één tik", async () => {
  const g = await laad();
  g.meldBeweging({ naar: 1, vakken: [0, 1], pad: [{ x: -1, y: 0 }, { x: 0, y: 0 }], sprong: false });
  expect(tonen).toHaveLength(1);
});

test("een Steen die terugrolt, geeft het zachte lage geluid", async () => {
  const g = await laad();
  const mis = vi.fn();
  const { voerUit: uit } = await import("./tikken");
  uit({ soort: "zet", vak: 5 }, { optik: () => false, gekozen: 2, mis });
  expect(mis).toHaveBeenCalledWith(2, 5);
  expect(tonen).toHaveLength(1);
  expect(tonen[0].hz).toBeLessThan(150);
  expect(g.klanken({ soort: "terug" })[0].duur).toBeGreaterThan(0.2);
});

test("Sound uit speelt niets, ook na herladen", async () => {
  let g = await laad();
  g.zetGeluid(false);
  g.meld({ soort: "stap" });
  expect(tonen).toHaveLength(0);
  // Herladen: een nieuwe module leest de instelling van het toestel.
  g = await laad();
  expect(g.geluidAan()).toBe(false);
  g.meld({ soort: "sprong", nummer: 2 });
  g.meld({ soort: "winst" });
  expect(tonen).toHaveLength(0);
  g.zetGeluid(true);
  g.meld({ soort: "stap" });
  expect(tonen).toHaveLength(1);
  g = await laad();
  expect(g.geluidAan()).toBe(true);
});

test("niets op de achtergrond", async () => {
  const g = await laad();
  Object.defineProperty(document, "visibilityState", { value: "hidden", configurable: true });
  g.meld({ soort: "stap" });
  expect(tonen).toHaveLength(0);
  Object.defineProperty(document, "visibilityState", { value: "visible", configurable: true });
  g.meld({ soort: "stap" });
  expect(tonen).toHaveLength(1);
});

test("iPhone: de audiosessie staat op ambient, zodat de stilschakelaar telt", async () => {
  const g = await laad();
  g.meld({ soort: "stap" });
  expect(sessie?.type).toBe("ambient");
});

test("trillen kan zich later aansluiten op dezelfde gebeurtenissen", async () => {
  const g = await laad();
  const gezien: string[] = [];
  const stop = g.opGebeurtenis((e) => gezien.push(e.soort));
  g.meld({ soort: "stap" });
  g.meld({ soort: "winst" });
  stop();
  g.meld({ soort: "terug" });
  expect(gezien).toEqual(["stap", "winst"]);
});
