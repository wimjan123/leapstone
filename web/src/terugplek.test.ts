// Back op één plek op elke tafel (taak 232): dezelfde plek en maat, in de onderste rij links, vrij van andere voorwerpen.
import { readFileSync } from "node:fs";
import { beforeAll, describe, expect, it } from "vitest";
import { initSync } from "./wasm/halma_core.js";
import { computerKeuze, onlineKeuze, bordKeuze, spelersKeuze } from "./keuzetafel";
import { tafelLijst, type TafelObject } from "./tafelblad";
import { TERUG_MAAT, TERUG_X } from "./terugplek";
import type { Voorwerp } from "./voorwerpen";
import { codeInvullenTafel, foutTafel, naamTafel, puzzelTafel, RANGLIJST, speluitleg, wachtkamer, zoeken } from "./voorwerpen-lijsten";

beforeAll(() => initSync({ module: readFileSync("src/wasm/halma_core_bg.wasm") }));

const knop = (id: string, soort: TafelObject["soort"] = "porselein"): TafelObject => ({ id, soort, sleutel: "common.back", doe: () => {} });
const namen = { ster: "Star", vierkant: "Square" };
const spelers = (n: number) => spelersKeuze({ plekken: Array.from({ length: n }, (_, i) => ({ speler: i, tekst: "Player" })), aantallen: [2, 3, 4, 6], aantal: n, vierkant: false });
const computer = () => computerKeuze({ namen, vorm: "ster", tegenstanders: [1, 2], tegen: 1, niveaus: ["Easy", "Normal", "Hard"], niveau: 1 });
const online = () => onlineKeuze({ namen, vorm: "ster", aantallen: [2, 3], aantal: 2, denktijden: ["Off", "30 s"], denktijd: 1 });

/** Alle tafelschermen met Back, op de keuze van het Bord na (die ligt bij een breder bord en is dan evenredig groter). */
const schermen = (): Record<string, Voorwerp[]> => ({
  Ranglijst: RANGLIJST,
  "Wachtkamer open": wachtkamer(false),
  "Wachtkamer vol": wachtkamer(true),
  "Finding a player": zoeken(false),
  "Finding a player, 4 of 6": zoeken(true),
  foutscherm: foutTafel(),
  Spelersnaam: naamTafel(),
  "Herstelcode invullen": codeInvullenTafel(),
  "Speluitleg, oefening": speluitleg("leeg"),
  "Speluitleg, Next": speluitleg("volgende"),
  "Speluitleg, Play the computer": speluitleg("computer"),
  "Puzzel, leeg": puzzelTafel("leeg"),
  "Puzzel, Done": puzzelTafel("klaar"),
  "Puzzel, Share": puzzelTafel("delen"),
  "lijst zonder knoppen (My stats)": tafelLijst("common.account", []),
  "lijst met een knop (Friends)": tafelLijst("common.account", [knop("a")]),
  "lijst met drie knoppen (Mijn potjes)": tafelLijst("common.account", [knop("a"), knop("b"), knop("c", "rood")]),
  "Players, 2": spelers(2),
  "Players, 6": spelers(6),
  Computer: computer(),
  "Nieuw online Potje": online(),
});

const opElkaar = (a: Voorwerp, b: Voorwerp) =>
  a.plaat?.soort !== "balk" && b.plaat?.soort !== "balk" && Math.abs(a.x - b.x) < (a.b + b.b) / 2 - 1e-6 && Math.abs(a.z - b.z) < (a.d + b.d) / 2 - 1e-6;

describe("Back op één plek", () => {
  it("op elk scherm ligt Back op de vaste plek, in de maat van een plaat van porselein, in de onderste rij", () => {
    for (const [naam, lijst] of Object.entries(schermen())) {
      const terug = lijst.filter((v) => v.id === "terug");
      expect(terug, naam).toHaveLength(1);
      const t = terug[0];
      expect([t.x, t.b, t.d, t.soort], naam).toEqual([TERUG_X, TERUG_MAAT.b, TERUG_MAAT.d, "porselein"]);
      // Niets met een knop ligt lager dan Back (de onderste rij), en niets ligt op Back.
      for (const v of lijst.filter((o) => o.plaat && o.id !== "titel")) expect(v.z, `${naam}: ${v.id}`).toBeLessThanOrEqual(t.z + 0.1);
      for (const v of lijst) if (v !== t && v.id !== "plaat") expect(opElkaar(t, v), `${naam}: ${v.id} ligt op Back`).toBe(false);
    }
  });

  it("Bord kiezen: Back ligt onder de platen, links en evenredig groter bij het bredere bord", () => {
    const l = bordKeuze(namen);
    const t = l.find((v) => v.id === "terug")!;
    const s = t.b / TERUG_MAAT.b;
    expect(s).toBeGreaterThan(1);
    expect(t.x - t.b / 2).toBeCloseTo(-9.3);
    expect(t.d / TERUG_MAAT.d).toBeCloseTo(s);
    for (const v of l.filter((o) => o !== t)) expect(opElkaar(t, v)).toBe(false);
    expect(t.z).toBeGreaterThan(Math.max(...l.filter((o) => o !== t).map((o) => o.z)));
  });

  it("de titel staat bovenaan in het midden op de schermen met een naamplaat", () => {
    for (const lijst of [RANGLIJST, wachtkamer(false), zoeken(false), speluitleg("leeg"), puzzelTafel("leeg"), tafelLijst("common.account", []), computer(), online(), spelers(3)]) {
      expect(lijst.find((v) => v.id === "titel")!.x).toBe(0);
    }
  });
});
