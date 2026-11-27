import { beforeAll, describe, expect, it } from "vitest";
import { LETTER_SLEUTELS, PLAATMATEN, bakPlaatKlaar, laadLetters, laadTabel, ontbrekendeTekens } from "./knopplaten";
import { zetNodeOmgeving } from "./knopplaten/testhulp";
import { TALEN } from "./talen/register";
import { beurtTekst, tijdOpJade } from "./potjetafel";
import { jadePlek, potjeVoorwerpen, voorwerpLijst, VELDEN, type PotjeOpties, type Voorwerp } from "./voorwerpen";

beforeAll(() => zetNodeOmgeving());

const spelers = (n: number) => Array.from({ length: n }, (_, i) => ({ speler: i, naam: `Player ${i + 1}` }));
const opties = (n: number, knoppen: PotjeOpties["knoppen"] = ["menu", "opgeven", "klaar"]): PotjeOpties => ({ spelers: spelers(n), knoppen, beurt: "Your turn" });

describe("de indeling van het Potje", () => {
  it("legt per Speler een naamplaat, de jade aanwijzer, het blad en de knoppen", () => {
    const v = potjeVoorwerpen(opties(3));
    expect(v.map((x) => x.id)).toEqual(["zegel", "kom", "speler0", "speler1", "speler2", "beurt", "blad", "menu", "opgeven", "klaar"]);
    // Elke knop (en alleen die) heeft een plaatje; het blad en de versiering niet.
    expect(v.filter((x) => x.plaat).map((x) => x.id)).toEqual(["speler0", "speler1", "speler2", "beurt", "menu", "opgeven", "klaar"]);
    // De naamplaat draagt de Steen van zijn Speler en de naam.
    expect(v[3].plaat).toMatchObject({ speler: 1, teksten: ["Player 2"] });
  });

  it.each([2, 3, 4, 6])("houdt bij %i Spelers de naamplaten uit elkaar en binnen het bord", (n) => {
    const v = potjeVoorwerpen(opties(n));
    const platen = v.filter((x) => x.soort === "naamplaat");
    expect(platen).toHaveLength(n);
    // Geen naamplaat raakt een andere, de kom, de zegelsteen of de jade aanwijzer (minstens 0,05 vak ertussen).
    const anderen = v.filter((x) => ["naamplaat", "kom", "zegel", "jade"].includes(x.soort));
    const raakt = (a: Voorwerp, b: Voorwerp) => Math.abs(a.x - b.x) < (a.b + b.b) / 2 + 0.05 && Math.abs(a.z - b.z) < (a.d + b.d) / 2 + 0.05;
    for (const p of platen) {
      expect(Math.abs(p.x) + p.b / 2).toBeLessThanOrEqual(7.6);
      for (const a of anderen) if (a !== p) expect(raakt(p, a), `${p.id} en ${a.id}`).toBe(false);
      // De verhouding van de plaat is die van zijn plaatje: anders rekt het plaatje.
      const maat = p.plaat?.maat ?? PLAATMATEN.naamplaat;
      expect(p.b / p.d).toBeCloseTo(maat.b / maat.d, 5);
    }
  });

  it("zet bij vier Spelers de hele naam op elke plaat, in twee rijen van twee (taak 290)", () => {
    const namen = ["Mila", "Bartholomew Featherstonehaugh", "高橋美智子おばあちゃん", "Jo"];
    const v = potjeVoorwerpen({ ...opties(4), spelers: namen.map((naam, speler) => ({ speler, naam, rating: "1200" })) }).filter((x) => x.soort === "naamplaat");
    expect(v.map((x) => x.plaat?.teksten)).toEqual(namen.map((n) => [n]));
    expect(v.every((x) => x.plaat?.maat?.b === x.b && x.plaat?.maat?.d === x.d)).toBe(true);
    expect(new Set(v.map((x) => x.z)).size).toBe(2);
    for (let i = 0; i < 4; i++) expect(jadePlek(i, 4).x).toBeCloseTo(v[i].x, 5);
  });

  it("zet bij zes Spelers de hele naam op elke plaat, in twee rijen van drie", () => {
    const namen = ["Mila", "Bartholomew Featherstonehaugh", "高橋美智子おばあちゃん", "عبد الرحمن بن محمد الحسيني", "W".repeat(30), "Jo"];
    const v = potjeVoorwerpen({ ...opties(6), spelers: namen.map((naam, speler) => ({ speler, naam, rating: "1200" })) }).filter((x) => x.soort === "naamplaat");
    expect(v.map((x) => x.plaat?.teksten)).toEqual(namen.map((n) => [n]));
    expect(v.every((x) => x.plaat?.maat?.b === x.b && x.plaat?.maat?.d === x.d)).toBe(true);
    expect(new Set(v.map((x) => x.z)).size).toBe(2);
    // De jade aanwijzer ligt onder de kolom van wie aan de beurt is.
    for (let i = 0; i < 6; i++) expect(jadePlek(i, 6).x).toBeCloseTo(v[i].x, 5);
  });

  it("de omtrek van de tafel is bij zes Spelers gelijk aan die bij vier: de camera, het bord en de knoppen blijven gelijk", () => {
    const omtrek = (n: number, zonderKom: boolean) => {
      const v = potjeVoorwerpen({ ...opties(n), zonderKom });
      // De camera kijkt altijd naar x = 0 (`Camera::tafel`): de verste x telt naar beide kanten.
      return [Math.max(...v.map((x) => Math.abs(x.x) + x.b / 2)), Math.min(...v.map((x) => x.z - x.d / 2)), Math.max(...v.map((x) => x.z + x.d / 2))];
    };
    for (const zonderKom of [false, true]) expect(omtrek(6, zonderKom)).toEqual(omtrek(4, zonderKom));
    // En de platen steken niet verder opzij uit dan de rij bij drie Spelers (4,95 + 2,25).
    for (const p of potjeVoorwerpen({ ...opties(6), zonderKom: true }).filter((x) => x.soort === "naamplaat")) expect(Math.abs(p.x) + p.b / 2).toBeLessThanOrEqual(7.2);
    // Bij 2 en 3 Spelers verandert er niets (taak 193): zelfde plekken en maten als voorheen.
    const plekken = (n: number) => potjeVoorwerpen(opties(n)).filter((x) => x.soort === "naamplaat").map((x) => [x.x, x.z, x.b, x.d].map((g) => +g.toFixed(4)));
    expect(plekken(2)).toEqual([[-2.6, -11.5, 4.5, 1.9], [2.6, -11.5, 4.5, 1.9]]);
    expect(plekken(3)).toEqual([[-4.95, -11.5, 4.5, 1.9], [0, -11.5, 4.5, 1.9], [4.95, -11.5, 4.5, 1.9]]);
    for (const n of [2, 3]) expect(jadePlek(0, n).z).toBe(-9.9);
  });

  it("legt de knoppen midden op het blad, ook met twee of vier knoppen", () => {
    for (const knoppen of [["opgeven", "klaar"], ["potjes", "opgeven", "klaar"]] as const) {
      const v = potjeVoorwerpen(opties(2, knoppen));
      const k = v.filter((x) => (knoppen as readonly string[]).includes(x.id));
      expect(k.map((x) => x.x).reduce((a, b) => a + b, 0)).toBeCloseTo(0, 5);
      expect(Math.max(...k.map((x) => Math.abs(x.x) + x.b / 2))).toBeLessThan(6.5);
    }
  });

  it("de jade aanwijzer ligt onder de naamplaat van wie aan de beurt is en blijft binnen het bord", () => {
    expect(jadePlek(0, 3).x).toBeCloseTo(-4.95, 5);
    expect(jadePlek(2, 3).x).toBeCloseTo(4.95, 5);
    for (const n of [2, 3, 4, 6]) for (let i = 0; i < n; i++) expect(Math.abs(jadePlek(i, n).x)).toBeLessThanOrEqual(5.3);
    // Een andere Speler aan de beurt verandert de lijst voor Bevy niet: de aanwijzer schuift met `zet_voorwerp_plek`.
    const a = voorwerpLijst(potjeVoorwerpen(opties(3)), false), b = voorwerpLijst(potjeVoorwerpen(opties(3)), false);
    expect(Array.from(a)).toEqual(Array.from(b));
    expect(a.length).toBe(potjeVoorwerpen(opties(3)).length * VELDEN);
  });
});

describe("de tekst op de jade aanwijzer", () => {
  const t = { yourTurn: "Your turn", gameOver: "Over", thinking: "is thinking" };
  it("zegt wie aan de beurt is, of dat het voorbij is", () => {
    expect(beurtTekst({ afgelopen: true, jij: false, naam: "Sam", aantal: 3, ...t })).toBe("Over");
    expect(beurtTekst({ afgelopen: false, jij: true, naam: "Sam", aantal: 3, ...t })).toBe("Your turn");
    expect(beurtTekst({ afgelopen: false, jij: false, naam: "Sam", aantal: 3, ...t })).toBe("is thinking");
    expect(beurtTekst({ afgelopen: false, jij: false, naam: "Sam", aantal: 6, ...t })).toBe("Sam");
  });
  it("laat de Denktijd in hele seconden zien, en de klok altijd (ook met veel tijd over)", () => {
    expect(tijdOpJade(null, 30, true, 0)).toBeUndefined();
    expect(tijdOpJade(100_000, 30, false, 0)).toBeUndefined();
    expect(tijdOpJade(100_000, 30, true, 70_000)).toEqual({ rest: 1, klok: "0:30" });
    // Nog 8,5 s van 30: negen hele seconden, en het deel dat over is in 1/60 stappen.
    expect(tijdOpJade(100_000, 30, true, 91_500)).toEqual({ rest: Math.round((8.5 / 30) * 60) / 60, klok: "0:09" });
  });
});

describe("de platen van het Potje", () => {
  it("de lettertypen hebben elk teken van de jade aanwijzer en de nieuwe knoppen, in elke taal", async () => {
    for (const taal of Object.keys(TALEN)) {
      const tabel = await laadTabel(taal);
      for (const sleutel of LETTER_SLEUTELS) expect(ontbrekendeTekens(taal, (tabel[sleutel] ?? "").replace(/\{[a-z]+\}/g, "1")), `${taal} ${sleutel}`).toEqual([]);
    }
  });

  const verschilBox = (a: Uint8ClampedArray, b: Uint8ClampedArray, br: number) => {
    let x0 = Infinity, x1 = -1;
    for (let i = 0; i < a.length; i += 4) if (Math.abs(a[i] - b[i]) + Math.abs(a[i + 1] - b[i + 1]) + Math.abs(a[i + 2] - b[i + 2]) > 10) { const x = (i / 4) % br; x0 = Math.min(x0, x); x1 = Math.max(x1, x); }
    return { x0, x1 };
  };

  it.each(["en", "ar", "he", "ja", "th"])("de jade aanwijzer past op de plaat in %s, ook met de klok", async (taal) => {
    await laadLetters(taal);
    const tabel = await laadTabel(taal);
    const invoer = { soort: "jade" as const, taal, teksten: [tabel["common.yourTurn"]], tijd: { rest: 0.4, klok: "0:09" }, id: "beurt" };
    const met = bakPlaatKlaar(invoer), zonder = bakPlaatKlaar({ ...invoer, zonderTekst: true });
    expect(met.breedte).toBe(Math.round(PLAATMATEN.jade.b * 100));
    expect(met.teksten.length).toBe(2);
    for (const t of met.teksten) expect(t.vak.x).toBeGreaterThanOrEqual(0), expect(t.vak.x + t.vak.b).toBeLessThanOrEqual(met.breedte);
    const v = verschilBox(met.beeldpunten, zonder.beeldpunten, met.breedte);
    expect(v.x1).toBeGreaterThan(0);
    // Een klein kader blijft vrij aan beide kanten.
    expect(v.x0).toBeGreaterThan(8);
    expect(v.x1).toBeLessThan(met.breedte - 8);
  });

  it("een naamplaat met Steen en een lange naam past, en de Steen staat aan de beginkant van de taal", async () => {
    for (const [taal, naam] of [["en", "Wilhelmina-Alexandra van Oranje"], ["ar", "مصطفى عبد الرحمن الشريف"], ["ja", "山田太郎さん"]] as const) {
      await laadLetters(taal);
      const invoer = { soort: "naamplaat" as const, taal, teksten: [naam, "1234"], speler: 2, id: "speler2" };
      const met = bakPlaatKlaar(invoer), zonder = bakPlaatKlaar({ ...invoer, zonderTekst: true });
      for (const t of met.teksten) {
        expect(t.vak.x).toBeGreaterThanOrEqual(0);
        expect(t.vak.x + t.vak.b).toBeLessThanOrEqual(met.breedte);
      }
      // De Steen (groen lak) staat links, of rechts bij een taal van rechts naar links.
      let groen = 0, som = 0;
      for (let i = 0; i < met.beeldpunten.length; i += 4) if (met.beeldpunten[i + 1] > 200 && met.beeldpunten[i] < 140) { groen++; som += (i / 4) % met.breedte; }
      expect(groen, taal).toBeGreaterThan(200);
      expect(som / groen < met.breedte / 2, taal).toBe(!met.rtl);
      expect(verschilBox(met.beeldpunten, zonder.beeldpunten, met.breedte).x1, taal).toBeGreaterThan(0);
    }
  });

  it("een naamplaat die een tik wisselt draagt een wisselteken aan het eind, ook van rechts naar links, en de naam past ervoor (taak 235)", async () => {
    const maat = { b: 4.6, d: 2.3 };
    for (const taal of ["en", "ar"]) {
      await laadLetters(taal);
      const naam = "Bartholomew Featherstonehaugh";
      const zonder = bakPlaatKlaar({ soort: "naamplaat", taal, teksten: [naam], speler: 1, id: "plek1", maat });
      const met = bakPlaatKlaar({ soort: "naamplaat", taal, teksten: [naam], speler: 1, id: "plek1", maat, wissel: true });
      const rtl = met.rtl;
      // Het teken is een vlek in goud aan het eind van de plaat (rechts, of links bij rtl): daar verschilt de plaat.
      const v = verschilBox(met.beeldpunten, zonder.beeldpunten, met.breedte);
      const midden = met.breedte / 2;
      expect(rtl ? v.x0 < midden : v.x1 > midden, taal).toBe(true);
      // De tekst begint en eindigt binnen de plaat en loopt niet onder het teken.
      const [t] = met.teksten;
      const eind = rtl ? t.vak.x : t.vak.x + t.vak.b;
      expect(rtl ? eind >= 0.46 * 100 + 24 : eind <= met.breedte - 0.46 * 100 - 24, taal).toBe(true);
      expect(t.regels.join("").replace(/\s/g, "")).toBe(naam.replace(/\s/g, ""));
    }
  });

  it("een lange naam zonder spaties breekt op twee regels en blijft leesbaar op de plaat van twee of drie Spelers (taak 235)", async () => {
    await laadLetters("en");
    const naam = "W".repeat(30);
    const invoer = { soort: "naamplaat" as const, taal: "en", teksten: [naam, "1234"], speler: 2, id: "speler2" };
    const met = bakPlaatKlaar(invoer);
    const [t] = met.teksten;
    expect(t.regels.join("")).toBe(naam);
    expect(t.regels.length).toBe(2);
    // Eerst werd hij op één regel gezet met lettergrootte 0,082: te klein om te lezen.
    expect(t.grootte).toBeGreaterThan(0.14);
    expect(t.vak.x + t.vak.b).toBeLessThanOrEqual(met.breedte);
    // De plaat zelf is even groot als altijd: het rijtje naamplaten breekt niet.
    expect([met.breedte, met.hoogte]).toEqual([Math.round(PLAATMATEN.naamplaat.b * 100), Math.round(PLAATMATEN.naamplaat.d * 100)]);
  });

  it("bij zes Spelers staat de hele naam op de plaat, ook de langste, in elk schrift en van rechts naar links (taak 193)", async () => {
    const maat = potjeVoorwerpen(opties(6)).find((x) => x.soort === "naamplaat")!.plaat!.maat!;
    // De langste Spelersnaam is 30 tekens (`opslag.rs`): breed (W), zonder spaties, Japans zonder spaties, Arabisch, en met spaties.
    const namen = ["W".repeat(30), "の".repeat(30), "Bartholomew Featherstonehaugh", "عبد الرحمن بن محمد الحسيني", "高橋美智子おばあちゃん", "Maximiliana Wilhelmina Gräfin", "Jo"];
    for (const taal of ["en", "ar", "ja"]) {
      await laadLetters(taal);
      for (const naam of namen) {
        const invoer = { soort: "naamplaat" as const, taal, teksten: [naam], speler: 3, id: "speler3", maat };
        const met = bakPlaatKlaar(invoer), zonder = bakPlaatKlaar({ ...invoer, zonderTekst: true });
        expect([met.breedte, met.hoogte]).toEqual([Math.round(maat.b * 100), Math.round(maat.d * 100)]);
        const [t] = met.teksten;
        // De hele naam: de regels samen zijn de naam (zonder de spaties waar hij brak). Niets afgekapt.
        expect(t.regels.join("").replace(/\s/g, ""), `${taal} ${naam}`).toBe(naam.replace(/\s/g, ""));
        expect(t.regels.length).toBeLessThanOrEqual(2);
        // Het vak van de tekst ligt binnen het gouden kader, en de letters binnen de plaat.
        expect(t.vak.x).toBeGreaterThanOrEqual(20);
        expect(t.vak.x + t.vak.b).toBeLessThanOrEqual(met.breedte - 20);
        const v = verschilBox(met.beeldpunten, zonder.beeldpunten, met.breedte);
        expect(v.x0, `${taal} ${naam}`).toBeGreaterThan(8);
        expect(v.x1, `${taal} ${naam}`).toBeLessThan(met.breedte - 8);
        // Een korte naam staat even groot als op de plaat bij drie Spelers; een lange op twee regels, niet kleiner dan nodig.
        if (naam === "Jo") expect(t.grootte).toBeCloseTo(0.6, 5);
        if (naam === "Bartholomew Featherstonehaugh") expect(t.regels).toEqual(["Bartholomew", "Featherstonehaugh"]);
        if (naam === "W".repeat(30)) expect(t.regels).toEqual(["W".repeat(15), "W".repeat(15)]);
      }
    }
  });
});
