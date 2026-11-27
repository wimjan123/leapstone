// Taak 233: lijsten passen op het papier. Het teken voor schuiven, de ruimte aan de zijkant van de plaat en de grotere plaat van de Ranglijst.
import { describe, expect, it } from "vitest";
import { meerVan, schuifNaar } from "./schuifteken";
import { platenStijl, plaatZij, RANGLIJST, wachtkamer } from "./voorwerpen-lijsten";

describe("schuifteken", () => {
  it("een tik schuift een stuk verder en stopt aan het begin en het eind van de lijst (taak 240)", () => {
    expect(schuifNaar(0, 300, 900, true)).toBe(240);
    expect(schuifNaar(500, 300, 900, true)).toBe(600);
    expect(schuifNaar(100, 300, 900, false)).toBe(0);
    expect(schuifNaar(400, 300, 900, false)).toBe(160);
  });
  it("past alles in de lijst, dan is er geen teken", () => {
    expect(meerVan(0, 300, 300)).toEqual({ boven: false, onder: false });
    expect(meerVan(0, 300, 302)).toEqual({ boven: false, onder: false });
  });
  it("er is meer onder zolang de lijst niet onderaan is", () => {
    expect(meerVan(0, 300, 600)).toEqual({ boven: false, onder: true });
    expect(meerVan(150, 300, 600)).toEqual({ boven: true, onder: true });
    expect(meerVan(300, 300, 600)).toEqual({ boven: true, onder: false });
  });
});

describe("plaatZij", () => {
  it("een liggend scherm laat meer ruimte aan de zijkant: de bovenrand van de plaat is daar smaller", () => {
    expect(plaatZij(1920 / 1080)).toBeGreaterThan(plaatZij(390 / 844));
  });
  it("platenStijl op een telefoon houdt zijn oude marge", () => {
    const vak = { links: 0, rechts: 1000, boven: 0, onder: 1000 };
    expect(platenStijl(vak, 0.05)).toContain("left:50px");
  });
});

describe("Ranglijst", () => {
  it("heeft een diepere plaat dan de Wachtkamer, dus meer rijen", () => {
    const diep = (l: { id: string; d: number }[]) => l.find((v) => v.id === "lijst")!.d;
    expect(diep(RANGLIJST)).toBeGreaterThan(diep(wachtkamer(false)));
  });
});
