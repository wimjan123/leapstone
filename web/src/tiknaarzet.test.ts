import { beforeEach, expect, test, vi } from "vitest";
import { meld } from "./geluid";
import { TikNaarZet, type Scherm, type Sprongregels } from "./tiknaarzet.svelte";
import type { Uitkomst } from "./tikken";

// Wat een tik doet, zonder scherm: een rij vakken 0..n-1 met eenvoudige regels (een Stap naar een leeg
// buurvak, een Sprong over een steen ernaast naar het lege vak erachter). Het echte bord staat in de schermtests.
vi.mock("./geluid", () => ({ meld: vi.fn() }));

function rijRegels(stand: number[]): Sprongregels {
  const leeg = (v: number, van: number) => v >= 0 && v < stand.length && (stand[v] === -1 || v === van);
  return {
    stappen: (v) => [v - 1, v + 1].filter((n) => leeg(n, v)),
    volgende_sprongen: (van, nu, bezocht) =>
      [-1, 1]
        .filter((d) => stand[nu + d] !== undefined && stand[nu + d] !== -1 && nu + d !== van && leeg(nu + 2 * d, van))
        .map((d) => nu + 2 * d)
        .filter((v) => !Array.from(bezocht).includes(v)),
  };
}

type Opties = { stand: number[]; eigen?: number; mag?: () => boolean; zet?: (van: number, naar: number, alGetoond: boolean) => Uitkomst };

function maak(o: Opties) {
  const zetten: [number, number, boolean][] = [];
  const sprongen: [number, number][] = [];
  let gekozen = 0;
  const scherm: Scherm = {
    regels: () => rijRegels(o.stand),
    stand: () => o.stand,
    eigen: () => o.eigen ?? 0,
    mag: o.mag ?? (() => true),
    zet: (van, naar, alGetoond) => {
      zetten.push([van, naar, alGetoond]);
      return o.zet?.(van, naar, alGetoond);
    },
    sprong: (van, naar) => sprongen.push([van, naar]),
    kies: () => gekozen++,
  };
  const t = new TikNaarZet(scherm);
  return { t, zetten, sprongen, keren: () => gekozen };
}

beforeEach(() => vi.mocked(meld).mockClear());

// Vak:      0   1   2  3   4  5   6  7
const RIJ = [-1, 0, 1, -1, 1, -1, -1, 0];

test("een eigen steen kiezen, nog eens tikken laat los; een steen van een ander kiest niets", () => {
  const { t, keren } = maak({ stand: RIJ });
  expect(t.tik(2)).toBeUndefined();
  expect(t.gekozen).toBeNull();
  t.tik(1);
  expect(t.gekozen).toBe(1);
  expect(keren()).toBe(1);
  t.tik(1);
  expect(t.gekozen).toBeNull();
});

test("met een gekozen steen: een andere eigen steen kiest die, een vak waar hij niet heen kan rolt terug", () => {
  const { t, zetten } = maak({ stand: RIJ });
  t.tik(1);
  t.tik(7);
  expect(t.gekozen).toBe(7);
  expect(t.tik(3)).toBe(false);
  expect(t.gekozen).toBe(7);
  expect(zetten).toEqual([]);
});

test("een Stap is meteen een Zet; het antwoord van het scherm komt terug", () => {
  let antwoord: Uitkomst = undefined;
  const { t, zetten, sprongen } = maak({ stand: RIJ, zet: () => antwoord });
  t.tik(1);
  expect(t.tik(0)).toBeUndefined();
  antwoord = false;
  expect(t.tik(0)).toBe(false);
  expect(zetten).toEqual([
    [1, 0, false],
    [1, 0, false],
  ]);
  expect(sprongen).toEqual([]);
  // Het scherm wist de keuze zelf als de Zet klaar is (online pas na het antwoord van de server).
  expect(t.gekozen).toBe(1);
  t.wis();
  expect(t.gekozen).toBeNull();
});

test("een Sprongketen: de steen staat al op zijn nieuwe vak, elke Sprong klinkt, en nog eens aantikken eindigt de Zet", () => {
  const { t, zetten, sprongen } = maak({ stand: RIJ });
  t.tik(1);
  t.tik(3);
  expect(t.keten).toEqual({ van: 1, nu: 3, bezocht: [1, 3] });
  expect(t.getoond).toBe(3);
  expect(t.gekozen).toBe(1);
  expect(t.toon(RIJ)).toEqual([-1, -1, 1, 0, 1, -1, -1, 0]);
  expect(sprongen).toEqual([[1, 3]]);
  // Midden in de keten: niet terug, geen andere steen, geen Stap.
  expect(t.tik(1)).toBe(false);
  expect(t.tik(7)).toBe(false);
  expect(t.tik(6)).toBe(false);
  expect(zetten).toEqual([]);
  t.tik(3);
  expect(zetten).toEqual([[1, 3, true]]);
  expect(meld).toHaveBeenCalledWith({ soort: "sprong", nummer: 0 });
});

test("kan de steen niet verder springen, dan eindigt de Zet vanzelf; het antwoord daarvan komt terug", () => {
  const { t, zetten, sprongen } = maak({ stand: RIJ, zet: () => false });
  t.tik(1);
  expect(t.tik(3)).toBeUndefined();
  expect(t.tik(5)).toBe(false);
  expect(sprongen).toEqual([
    [1, 3],
    [3, 5],
  ]);
  expect(meld).toHaveBeenLastCalledWith({ soort: "sprong", nummer: 1 });
  expect(zetten).toEqual([[1, 5, true]]);
});

test("ver weg tikken laat los, maar midden in een keten niet", () => {
  const { t } = maak({ stand: RIJ });
  t.tik(1);
  t.bord.weg();
  expect(t.gekozen).toBeNull();
  t.tik(1);
  t.tik(3);
  t.bord.weg();
  expect(t.keten?.nu).toBe(3);
});

test("klaar zonder keten doet niets; met keten stuurt hij de hele Zet", () => {
  const { t, zetten } = maak({ stand: RIJ });
  t.tik(1);
  t.klaar();
  expect(zetten).toEqual([]);
  t.tik(3);
  t.klaar();
  expect(zetten).toEqual([[1, 3, true]]);
});

test("mag een tik niets (beurt van een Computerspeler, Zet onderweg naar de server), dan verandert er niets", () => {
  let mag = true;
  const { t, zetten } = maak({ stand: RIJ, mag: () => mag });
  t.tik(1);
  t.tik(3);
  mag = false;
  expect(t.tik(5)).toBeUndefined();
  expect(t.tik(3)).toBeUndefined();
  t.klaar();
  expect(zetten).toEqual([]);
  expect(t.keten?.nu).toBe(3);
  t.wis();
  expect(t.tik(1)).toBeUndefined();
  expect(t.gekozen).toBeNull();
});

test("de stenen van `eigen` kiest een tik, ook als een ander aan de beurt lijkt", () => {
  const { t } = maak({ stand: RIJ, eigen: 1 });
  t.tik(1);
  expect(t.gekozen).toBeNull();
  t.tik(2);
  expect(t.gekozen).toBe(2);
});

test("zonder spelregels kan de gekozen steen nergens heen", () => {
  const zetten: unknown[] = [];
  const t = new TikNaarZet({ regels: () => null, stand: () => RIJ, eigen: () => 0, mag: () => true, zet: (...z) => void zetten.push(z) });
  t.tik(1);
  expect(t.tik(0)).toBe(false);
  expect(zetten).toEqual([]);
});
