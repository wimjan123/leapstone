import { beforeAll, describe, expect, it } from "vitest";
import { bakPlaatKlaar, laadLetters, type KnopSpec } from "./knopplaten";
import { zetNodeOmgeving } from "./knopplaten/testhulp";
import { metUit, potjeVoorwerpen, type Voorwerp } from "./voorwerpen";
import { puzzelTafel, speluitleg, type PuzzelKnop, type UitlegKnop } from "./voorwerpen-lijsten";

// Taak 231: een plaat die niets doet, ligt er niet als werkende knop. Er is geen plaat zonder tekst, en een plaat waarvan de knop `uit`
// is, ligt er dof.
beforeAll(() => zetNodeOmgeving());

const heeftTekst = (p: KnopSpec) => (p.teksten ?? []).some((t) => t.trim() !== "") || p.sleutels.length > 0;
const knopSoorten = ["porselein", "rood", "zwart"];

const lijsten: [string, Voorwerp[]][] = [
  ...(["klaar", "delen", "leeg"] as PuzzelKnop[]).map((k): [string, Voorwerp[]] => [`puzzel ${k}`, puzzelTafel(k)]),
  ...(["volgende", "computer", "leeg"] as UitlegKnop[]).map((k): [string, Voorwerp[]] => [`speluitleg ${k}`, speluitleg(k)]),
  ["potje", potjeVoorwerpen({ spelers: [{ speler: 0, naam: "A" }, { speler: 1, naam: "B" }], knoppen: ["opgeven", "klaar"], beurt: "Your turn" })],
];

describe("geen plaat zonder tekst op een tafelscherm", () => {
  it.each(lijsten)("%s: elke knopplaat heeft een opschrift", (_, lijst) => {
    for (const v of lijst.filter((x) => knopSoorten.includes(x.soort) && x.plaat)) expect(heeftTekst(v.plaat!), v.id).toBe(true);
  });
});

describe("een plaat zonder actie ziet er niet als werkende knop uit", () => {
  const knoppen = [{ id: "verder", uit: true }, { id: "terug" }];

  it("metUit maakt de plaat van een knop die uit is dof, en alleen die", () => {
    const l = metUit(puzzelTafel("leeg"), knoppen);
    expect(l.find((v) => v.id === "verder")?.plaat?.uit).toBe(true);
    expect(l.find((v) => v.id === "terug")?.plaat?.uit).toBeFalsy();
    // De lijst zelf (plekken en maten) blijft gelijk: de camera verspringt niet.
    expect(l.map((v) => [v.id, v.x, v.z, v.b, v.d])).toEqual(puzzelTafel("leeg").map((v) => [v.id, v.x, v.z, v.b, v.d]));
  });

  it("zodra de knop weer werkt, is de plaat weer gewoon", () => {
    const uit = metUit(speluitleg("volgende"), [{ id: "verder", uit: true }]);
    const aan = metUit(uit, [{ id: "verder", uit: false }]);
    expect(aan.find((v) => v.id === "verder")?.plaat?.uit).toBeFalsy();
  });

  it.each(["porselein", "rood"] as const)("de dofe plaat %s heeft andere beeldpunten dan de werkende plaat, en dezelfde vorm", async (soort) => {
    await laadLetters("en");
    const invoer = { soort, taal: "en", teksten: ["Done"], pictogrammen: [], id: "x" };
    const aan = bakPlaatKlaar(invoer), uit = bakPlaatKlaar({ ...invoer, uit: true });
    expect([uit.breedte, uit.hoogte]).toEqual([aan.breedte, aan.hoogte]);
    let verschil = 0, som = 0, n = 0;
    for (let i = 0; i < aan.beeldpunten.length; i += 4) {
      // Waar de werkende plaat leeg is (buiten de vorm), is de dofe dat ook.
      expect(uit.beeldpunten[i + 3] > 0).toBe(aan.beeldpunten[i + 3] > 0);
      if (!aan.beeldpunten[i + 3]) continue;
      const lAan = aan.beeldpunten[i] + aan.beeldpunten[i + 1] + aan.beeldpunten[i + 2];
      const lUit = uit.beeldpunten[i] + uit.beeldpunten[i + 1] + uit.beeldpunten[i + 2];
      som += Math.abs(lAan - lUit) / 3; n++;
      if (lAan !== lUit) verschil++;
    }
    expect(verschil).toBeGreaterThan(0);
    // Duidelijk anders: een gemiddeld verschil per kleurkanaal (van 255); rood lak is al donker, dus daar is het verschil kleiner.
    expect(som / n).toBeGreaterThan(soort === "rood" ? 12 : 20);
  });

  it("de letters op een dofe plaat zijn net zo scherp als op een werkende (taak 240: bruin op bruin)", async () => {
    await laadLetters("en");
    // Porselein: de donkerste beeldpunten zijn de kobaltblauwe letters. Dof wordt de plaat, niet de letters erop.
    const invoer = { soort: "porselein" as const, taal: "en", teksten: ["Next"], pictogrammen: [], id: "x" };
    const donker = (p: ReturnType<typeof bakPlaatKlaar>) => {
      let min = 765;
      for (let i = 0; i < p.beeldpunten.length; i += 4) if (p.beeldpunten[i + 3]) min = Math.min(min, p.beeldpunten[i] + p.beeldpunten[i + 1] + p.beeldpunten[i + 2]);
      return min;
    };
    expect(donker(bakPlaatKlaar({ ...invoer, uit: true }))).toBeLessThanOrEqual(donker(bakPlaatKlaar(invoer)) + 30);
  });

  it("een component die een knop niet `uit` zet terwijl hij niets doet, faalt: elke knop van een tafel zonder actie is uit", () => {
    // De lakknop van de Speluitleg en de puzzel zonder actie: zonder `uit` zou hij als werkende knop op de tafel liggen.
    for (const l of [puzzelTafel("leeg"), speluitleg("leeg")]) {
      const verder = l.find((v) => v.id === "verder")!;
      expect(metUit([verder], []).at(0)?.plaat?.uit, "zonder uit-knop ligt de plaat gewoon").toBeFalsy();
      expect(metUit([verder], [{ id: "verder", uit: true }]).at(0)?.plaat?.uit).toBe(true);
    }
  });
});
