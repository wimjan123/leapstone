import { beforeAll, describe, expect, it } from "vitest";
import { LIJSTSCHERMEN } from "./knoppen";
import { KNOPPEN, MIJN_POTJES, NAAMPLAAT, PLAATMATEN, TITEL, bakKnoppen, bakPlaat, bakPlaatKlaar, bakSpecs, knopTeksten, laadLetters, laadTabel, ontbrekendeTekens, zetDoekMaker, type Ctx, type KnopSpec, type Plaat } from "./index";
import { TALEN } from "../talen/register";
import { zetNodeOmgeving } from "./testhulp";
import { createCanvas } from "@napi-rs/canvas";

const TALEN_CODES = Object.keys(TALEN);
const ALLE = [...KNOPPEN, NAAMPLAAT, TITEL];
/** Hoeveel van de plaat vrij blijft aan elke kant (eenheden): de lijst van het kader. */
const INZET: Record<string, number> = { porselein: 0.3, rood: 0.3, zwart: 0.3, naamplaat: 0.25, lade: 0.1, titel: 0.25 };

beforeAll(() => zetNodeOmgeving());

/** Het vierkant (in beeldpunten) waar twee platen van elkaar verschillen: de tekst. */
function verschil(a: Plaat, b: Plaat, drempel = 10) {
  let x0 = Infinity, y0 = Infinity, x1 = -1, y1 = -1;
  const kolommen = new Uint8Array(a.breedte);
  for (let y = 0; y < a.hoogte; y++) for (let x = 0; x < a.breedte; x++) {
    const i = (y * a.breedte + x) * 4;
    const d = Math.abs(a.beeldpunten[i] - b.beeldpunten[i]) + Math.abs(a.beeldpunten[i + 1] - b.beeldpunten[i + 1]) + Math.abs(a.beeldpunten[i + 2] - b.beeldpunten[i + 2]);
    if (d > drempel) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); kolommen[x] = 1; }
  }
  return { x0, y0, x1, y1, kolommen };
}

async function plaatPaar(spec: KnopSpec, taal: string, tabel: Record<string, string>) {
  const invoer = { soort: spec.soort, taal, teksten: knopTeksten(spec, tabel), pictogrammen: spec.pictogrammen, id: spec.id };
  return { met: bakPlaatKlaar(invoer), zonder: bakPlaatKlaar({ ...invoer, zonderTekst: true }) };
}

describe("lettertypen", () => {
  it("hebben elk teken van elke knoptekst in elke taal", async () => {
    for (const taal of TALEN_CODES) {
      const tabel = await laadTabel(taal);
      for (const k of ALLE) for (const t of knopTeksten(k, tabel)) expect(ontbrekendeTekens(taal, t), `${taal} ${k.id} "${t}"`).toEqual([]);
    }
  });
});

describe("elke knoptekst past binnen de plaat, in alle talen", () => {
  it("de tekst ligt binnen het vak, het vak binnen het kader, en de letters blijven leesbaar", async () => {
    let kleinst = Infinity, kleinstWie = "";
    for (const taal of TALEN_CODES) {
      await laadLetters(taal);
      const tabel = await laadTabel(taal);
      for (const k of ALLE) {
        const { met, zonder } = await plaatPaar(k, taal, tabel);
        const maat = PLAATMATEN[k.soort], s = met.schaal, inzet = INZET[k.soort] * s;
        const wie = `${taal} ${k.id}`;
        // Het vak ligt binnen het kader.
        for (const t of met.teksten) {
          expect(t.vak.x, wie).toBeGreaterThanOrEqual(inzet - 1e-6);
          expect(t.vak.y, wie).toBeGreaterThanOrEqual(inzet - 1e-6);
          expect(t.vak.x + t.vak.b, wie).toBeLessThanOrEqual(maat.b * s - inzet + 1e-6);
          expect(t.vak.y + t.vak.h, wie).toBeLessThanOrEqual(maat.d * s - inzet + 1e-6);
          expect(t.regels.length, wie).toBeLessThanOrEqual(2);
          if (t.grootte < kleinst) { kleinst = t.grootte; kleinstWie = wie; }
        }
        // De echte tekens (verschil met een plaat zonder tekst) liggen binnen de vakken van de teksten.
        const v = verschil(met, zonder);
        expect(v.x1, `${wie}: geen tekst getekend`).toBeGreaterThan(0);
        const tol = 2;
        const vakken = met.teksten.map((t) => t.vak);
        const links = Math.min(...vakken.map((b) => b.x)), rechts = Math.max(...vakken.map((b) => b.x + b.b));
        const boven = Math.min(...vakken.map((b) => b.y)), onder = Math.max(...vakken.map((b) => b.y + b.h));
        expect(v.x0, wie).toBeGreaterThanOrEqual(links - tol);
        expect(v.x1, wie).toBeLessThanOrEqual(rechts + tol);
        expect(v.y0, wie).toBeGreaterThanOrEqual(boven - tol);
        expect(v.y1, wie).toBeLessThanOrEqual(onder + tol);
      }
    }
    // Leesbaar: een kleine letter is op de telefoon (schaal 100 beeldpunten per eenheid) nog minstens 25 beeldpunten hoog.
    expect(kleinst * 100, `kleinste letter: ${kleinstWie}`).toBeGreaterThanOrEqual(25);
  }, 180000);

  it("een heel lange tekst gaat op twee regels of wordt kleiner, en past nog", async () => {
    const lang = "Spelen tegen een tegenstander die erg lang nadenkt";
    for (const taal of ["en", "de", "th"]) {
      await laadLetters(taal);
      const p = bakPlaatKlaar({ soort: "porselein", taal, teksten: [lang], pictogrammen: ["computer"], id: "lang" });
      const zonder = bakPlaatKlaar({ soort: "porselein", taal, teksten: [lang], pictogrammen: ["computer"], id: "lang", zonderTekst: true });
      const v = verschil(p, zonder), vak = p.teksten[0].vak;
      expect(p.teksten[0].regels.length).toBeLessThanOrEqual(2);
      expect(v.x0).toBeGreaterThanOrEqual(vak.x - 2);
      expect(v.x1).toBeLessThanOrEqual(vak.x + vak.b + 2);
      expect(v.y1).toBeLessThanOrEqual(vak.y + vak.h + 2);
    }
  });
});

/** Rode knoppen die `Tafel.svelte` uit een sleutel maakt (Account, Vrienden, Mijn potjes, keuzeschermen): `soort: "rood"` met `sleutel`. */
const ROOD_UIT_SLEUTEL = ["account.deleteMine", "challenge.send", "addFriend.title", "common.newGame", "common.start"];

describe("de tekst op een lakplaat is in elke taal zo groot als op porselein (taak 237)", () => {
  it("voor elke rode knop en elke taal: minstens de lettergrootte van porselein van dezelfde breedte", async () => {
    const sleutels = new Set<string>(ROOD_UIT_SLEUTEL);
    for (const k of [...KNOPPEN, ...Object.values(LIJSTSCHERMEN)]) if (k.soort === "rood") k.sleutels.forEach((s) => sleutels.add(s));
    expect(sleutels.size).toBeGreaterThan(12);
    const maat = PLAATMATEN.rood;
    let gemeten = 0;
    for (const taal of TALEN_CODES) {
      await laadLetters(taal);
      const tabel = await laadTabel(taal);
      for (const sleutel of sleutels) {
        const tekst = tabel[sleutel];
        if (!tekst) continue;
        const rood = bakPlaatKlaar({ soort: "rood", taal, teksten: [tekst], id: "rood-" + sleutel });
        const porselein = bakPlaatKlaar({ soort: "porselein", taal, teksten: [tekst], maat, id: "porselein-" + sleutel });
        expect(rood.teksten[0].grootte, `${taal} ${sleutel} "${tekst}"`).toBeGreaterThanOrEqual(porselein.teksten[0].grootte - 1e-6);
        expect(rood.teksten[0].regels.length, `${taal} ${sleutel}`).toBeLessThanOrEqual(2);
        gemeten++;
      }
    }
    expect(gemeten).toBeGreaterThan(500);
  }, 180000);
  it("ook de plaat Play met de regel eronder (Startmenu)", async () => {
    const maat = PLAATMATEN.rood;
    for (const taal of TALEN_CODES) {
      await laadLetters(taal);
      const t = await laadTabel(taal);
      const rood = bakPlaatKlaar({ soort: "rood", taal, teksten: [t["menu.play"], t["menu.online"]], id: "online" });
      const porselein = bakPlaatKlaar({ soort: "porselein", taal, teksten: [t["menu.play"]], maat, id: "porselein-play" });
      expect(rood.teksten[0].grootte, `${taal} Play`).toBeGreaterThanOrEqual(porselein.teksten[0].grootte - 1e-6);
    }
  }, 120000);
});

describe("de maat van de uitvoer", () => {
  it("is breedte maal hoogte maal vier bytes, en volgt de schaal", async () => {
    await laadLetters("en");
    for (const k of KNOPPEN) {
      for (const schaal of [50, 100, 150]) {
        const p = bakPlaatKlaar({ soort: k.soort, taal: "en", teksten: [k.id, "x"], pictogrammen: k.pictogrammen, schaal });
        const m = PLAATMATEN[k.soort];
        expect(p.breedte).toBe(Math.round(m.b * schaal));
        expect(p.hoogte).toBe(Math.round(m.d * schaal));
        expect(p.beeldpunten.length).toBe(p.breedte * p.hoogte * 4);
        expect(p.schaal).toBe(schaal);
      }
    }
  });
  it("bakKnoppen geeft alle vijftien knopteksten: twaalf platen, de lade en de twee lakplaten van het Startmenu met twee", async () => {
    const platen = await bakKnoppen("en");
    expect(platen.map((p) => p.teksten.length).reduce((a, b) => a + b, 0)).toBe(15);
    expect(platen).toHaveLength(KNOPPEN.length);
    for (const p of platen) { expect(p.beeldpunten.length).toBe(p.breedte * p.hoogte * 4); expect(p.beeldpunten.some((v, i) => i % 4 === 3 && v !== 255)).toBe(false); }
  });
  it("de naamplaat Leapstone en het plaatje van messing met de naam My games (taak 178, 206)", async () => {
    for (const taal of ["en", "ar", "ja"]) {
      const [titel, potjes] = await bakSpecs(taal, [TITEL, MIJN_POTJES]);
      // "Leapstone" in elke taal, de ondertitel in de taal van de Speler.
      expect(titel.teksten.map((t) => t.tekst)).toEqual(["Leapstone", (await laadTabel(taal))["menu.tagline"]]);
      expect([titel.breedte, titel.hoogte]).toEqual([840, 300]);
      expect([potjes.breedte, potjes.hoogte]).toEqual([360, 240]);
      expect(potjes.teksten).toHaveLength(1);
      for (const p of [titel, potjes]) expect(p.beeldpunten.some((v, i) => i % 4 === 3 && v !== 255)).toBe(false);
    }
  });
  it("dezelfde invoer geeft dezelfde beeldpunten", async () => {
    const a = await bakPlaat({ soort: "rood", taal: "ja", teksten: ["遊ぶ"], id: "spelen" });
    const b = await bakPlaat({ soort: "rood", taal: "ja", teksten: ["遊ぶ"], id: "spelen" });
    expect(a.beeldpunten.length).toBe(b.beeldpunten.length);
    expect(a.beeldpunten.every((v, i) => v === b.beeldpunten[i])).toBe(true);
  });
});

describe("van rechts naar links", () => {
  it("een pagina van rechts naar links maakt de tekst niet kleiner (taak 178)", async () => {
    await laadLetters("ar");
    const tabel = await laadTabel("ar");
    const spec = KNOPPEN.find((k) => k.id === "ranglijst")!;
    const gewoon = bakPlaatKlaar({ soort: spec.soort, taal: "ar", teksten: knopTeksten(spec, tabel), pictogrammen: spec.pictogrammen });
    // Zoals in de browser met dir="rtl": het canvas begint met richting rtl en tekst aan het begin.
    zetDoekMaker((b, h) => {
      const c = createCanvas(b, h), ctx = c.getContext("2d");
      ctx.direction = "rtl";
      ctx.textAlign = "start";
      return { ctx: ctx as unknown as Ctx, beeldpunten: () => new Uint8ClampedArray(ctx.getImageData(0, 0, b, h).data) };
    });
    try {
      const rtl = bakPlaatKlaar({ soort: spec.soort, taal: "ar", teksten: knopTeksten(spec, tabel), pictogrammen: spec.pictogrammen });
      expect(rtl.teksten[0].grootte).toBeCloseTo(gewoon.teksten[0].grootte, 3);
    } finally {
      zetNodeOmgeving();
    }
  });
  it("de draak en de tekst wisselen van kant", async () => {
    for (const taal of ["en", "ar", "he", "ur"]) {
      await laadLetters(taal);
      const tabel = await laadTabel(taal);
      const rtl = TALEN[taal].rtl === true;
      for (const spec of [KNOPPEN[0], KNOPPEN[1]]) {
        const { met, zonder } = await plaatPaar(spec, taal, tabel);
        const v = verschil(met, zonder);
        const midden = (v.x0 + v.x1) / 2;
        // Rood: tekst rechts (LTR), draak links. Zwart: tekst links (LTR), draak rechts.
        const tekstRechts = spec.soort === "rood" ? !rtl : rtl;
        expect(midden > met.breedte / 2, `${taal} ${spec.id}`).toBe(tekstRechts);
        expect(met.rtl).toBe(rtl);
        expect(met.teksten[0].richting).toBe(rtl ? "rtl" : "ltr");
      }
    }
  });
  it("de lade zet het eerste woord (Sound) rechts en het pictogram rechts van de tekst", async () => {
    await laadLetters("he");
    const tabel = await laadTabel("he");
    const lade = KNOPPEN.find((k) => k.id === "lade")!;
    const { met } = await plaatPaar(lade, "he", tabel);
    expect(met.teksten[0].vak.x).toBeGreaterThan(met.teksten[1].vak.x);
    const en = await plaatPaar(lade, "en", await laadTabel("en"));
    expect(en.met.teksten[0].vak.x).toBeLessThan(en.met.teksten[1].vak.x);
  });
  it("de zes platen van porselein van het Startmenu hebben dezelfde lettergrootte, ook met twee regels (taak 206)", async () => {
    const zes = KNOPPEN.filter((k) => ["computer", "vrienden", "puzzel", "uitleg", "ranglijst", "stats"].includes(k.id));
    for (const taal of ["en", "de", "nl"]) {
      const platen = await bakSpecs(taal, zes);
      const groottes = platen.map((p) => p.teksten[0].grootte);
      expect(Math.min(...groottes), `${taal} ${groottes}`).toBeCloseTo(Math.max(...groottes), 5);
    }
    // "Puzzle of the day" past niet op één regel: twee regels, even groot als "Friends".
    const [puzzel] = await bakSpecs("en", zes.filter((k) => k.id === "puzzel"));
    expect(puzzel.teksten[0].regels).toHaveLength(2);
  });
  it("een deel van de lade dat uit staat, is doffer dan aan (taak 206)", async () => {
    const lade = KNOPPEN.find((k) => k.id === "lade")!;
    const [aan, uit] = await bakSpecs("en", [{ ...lade, aan: [true, true] }, { ...lade, aan: [false, true] }]);
    const licht = (p: Plaat, van: number, tot: number) => {
      let som = 0;
      for (let y = Math.round(p.hoogte * 0.6); y < p.hoogte; y++) for (let x = Math.round(p.breedte * van); x < Math.round(p.breedte * tot); x++) {
        const i = (y * p.breedte + x) * 4;
        som += p.beeldpunten[i] + p.beeldpunten[i + 1] + p.beeldpunten[i + 2];
      }
      return som;
    };
    // Sound (links) is doffer; Vibration (rechts) is gelijk gebleven.
    expect(licht(uit, 0, 0.5)).toBeLessThan(licht(aan, 0, 0.5) * 0.95);
    expect(licht(uit, 0.5, 1)).toBe(licht(aan, 0.5, 1));
  });
  it("in een Hebreeuwse tekst met twee woorden staat het eerste woord rechts", async () => {
    await laadLetters("he");
    const [eerste, tweede] = (await laadTabel("he"))["learn.title"].split(" ");
    expect(eerste && tweede).toBeTruthy();
    const maak = (t: string) => {
      const mk = (zonderTekst: boolean) => bakPlaatKlaar({ soort: "porselein", taal: "he", teksten: [t], id: "he-proef", zonderTekst });
      return { met: mk(false), zonder: mk(true) };
    };
    const alles = maak(`${eerste} ${tweede}`);
    expect(alles.met.teksten[0].regels).toHaveLength(1);
    const v = verschil(alles.met, alles.zonder);
    // Zoek de grootste opening tussen de twee woorden.
    let besteStart = -1, besteLengte = 0;
    for (let x = v.x0; x <= v.x1;) {
      if (v.kolommen[x]) { x++; continue; }
      let l = 0;
      while (x + l <= v.x1 && !v.kolommen[x + l]) l++;
      if (l > besteLengte) { besteLengte = l; besteStart = x; }
      x += l;
    }
    expect(besteStart).toBeGreaterThan(0);
    const eersteAlleen = maak(eerste), tweedeAlleen = maak(tweede);
    const w1 = { ...verschil(eersteAlleen.met, eersteAlleen.zonder), ...eersteAlleen }, w2 = verschil(tweedeAlleen.met, tweedeAlleen.zonder);
    const breedte1 = w1.x1 - w1.x0 + 1, breedte2 = w2.x1 - w2.x0 + 1;
    const rechtsBreedte = v.x1 - (besteStart + besteLengte) + 1, linksBreedte = besteStart - v.x0;
    // Rechts van de opening staat het eerste woord (de breedte is die van het eerste woord), links het tweede.
    expect(Math.abs(rechtsBreedte - breedte1)).toBeLessThanOrEqual(3);
    expect(Math.abs(linksBreedte - breedte2)).toBeLessThanOrEqual(3);
    // En de beeldpunten rechts zijn die van het eerste woord alleen.
    let gelijk = 0, totaal = 0;
    for (let y = v.y0; y <= v.y1; y++) for (let dx = 0; dx < breedte1; dx++) {
      const xa = v.x1 - dx, xb = w1.x1 - dx;
      const a = alles.met.beeldpunten[(y * alles.met.breedte + xa) * 4 + 2], b = alles.zonder.beeldpunten[(y * alles.met.breedte + xa) * 4 + 2];
      const c = w1.met.beeldpunten[(y * w1.met.breedte + xb) * 4 + 2], d = w1.zonder.beeldpunten[(y * w1.met.breedte + xb) * 4 + 2];
      const inkA = Math.abs(a - b) > 40, inkB = Math.abs(c - d) > 40;
      if (inkA || inkB) { totaal++; if (inkA === inkB) gelijk++; }
    }
    expect(totaal).toBeGreaterThan(50);
    expect(gelijk / totaal).toBeGreaterThan(0.8);
  });
});

describe("de lege lakknop (Speluitleg en Dagelijkse puzzel, nog niets te doen)", () => {
  it("is een doffe, effen plaat zonder draak: donkerder dan de knop met draak, en overal ongeveer even donker", async () => {
    await laadLetters("en");
    const helderheid = (p: Plaat, x0: number, x1: number) => {
      let som = 0, n = 0;
      for (let y = Math.round(p.hoogte * 0.3); y < p.hoogte * 0.7; y++) for (let x = Math.round(p.breedte * x0); x < p.breedte * x1; x++) {
        const i = (y * p.breedte + x) * 4;
        som += p.beeldpunten[i] + p.beeldpunten[i + 1] + p.beeldpunten[i + 2]; n++;
      }
      return som / n / 3;
    };
    const leeg = bakPlaatKlaar({ soort: "rood", taal: "en", teksten: [""], id: "volgende-leeg" });
    const metDraak = bakPlaatKlaar({ soort: "rood", taal: "en", teksten: [""], id: "volgende-leeg", zonderTekst: true });
    // Links ligt bij de gewone knop de draak; bij de lege knop is daar alleen doffe grond.
    expect(helderheid(leeg, 0.1, 0.45)).toBeLessThan(helderheid(metDraak, 0.1, 0.45) * 0.8);
    // Effen: links (waar de draak lag) en rechts (waar de tekst zou staan) bijna even donker.
    expect(Math.abs(helderheid(leeg, 0.1, 0.45) - helderheid(leeg, 0.55, 0.9))).toBeLessThan(6);
  });
});

describe("een uitgezette knop (taak 278)", () => {
  const lum = (r: number, g: number, b: number) => {
    const f = (v: number) => { const x = v / 255; return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  it("is grijs, en de letters hebben contrast 4,5 op 1 met de plaat (rood, zwart en porselein)", async () => {
    await laadLetters("en");
    for (const soort of ["rood", "zwart", "porselein"] as const) {
      const maak = (zonderTekst: boolean) => bakPlaatKlaar({ soort, taal: "en", teksten: ["Next"], id: "volgende", uit: true, zonderTekst });
      const met = maak(false), zonder = maak(true);
      let donkerste = 1, plaat = 0, n = 0, kleur = 0;
      for (let i = 0; i < met.beeldpunten.length; i += 4) {
        if (zonder.beeldpunten[i + 3] < 250) continue;
        const [r, g, b] = [met.beeldpunten[i], met.beeldpunten[i + 1], met.beeldpunten[i + 2]];
        const l = lum(r, g, b);
        if (Math.abs(r - zonder.beeldpunten[i]) + Math.abs(g - zonder.beeldpunten[i + 1]) > 60) donkerste = Math.min(donkerste, l);
        plaat += lum(zonder.beeldpunten[i], zonder.beeldpunten[i + 1], zonder.beeldpunten[i + 2]); n++;
        kleur = Math.max(kleur, Math.max(r, g, b) - Math.min(r, g, b));
      }
      expect(kleur, `${soort} is grijs`).toBeLessThan(60);
      expect((plaat / n + 0.05) / (donkerste + 0.05), `${soort} contrast`).toBeGreaterThan(4.5);
    }
  });
});

describe("een plaat met een bord (Bord kiezen)", () => {
  // Een klein bord van drie bij drie gaatjes met twee Stenen: genoeg om te zien dat de tekening er staat.
  const gaten = [0, 1, 2].flatMap((y) => [0, 1, 2].map((x) => ({ x, y })));
  const bord = { vierkant: true, gaten, stenen: [{ x: 0, y: 2, speler: 0 }, { x: 2, y: 0, speler: 1 }] };
  const maat = { b: 9.15, d: 7.4 };

  it("tekent het bord boven de naam, en de naam past in elke taal", async () => {
    for (const taal of TALEN_CODES) {
      await laadLetters(taal);
      const tabel = await laadTabel(taal);
      for (const sleutel of ["board.star", "board.square"]) {
        const invoer = { soort: "porselein" as const, taal, teksten: [tabel[sleutel]], maat, bord, id: sleutel };
        const met = bakPlaatKlaar(invoer);
        const t = met.teksten[0];
        const wie = `${taal} ${sleutel}`;
        expect(t.regels.length, wie).toBeLessThanOrEqual(2);
        expect(t.vak.y + t.vak.h, wie).toBeLessThanOrEqual(maat.d * met.schaal - 0.2 * met.schaal);
        const v = verschil(met, bakPlaatKlaar({ ...invoer, zonderTekst: true }));
        expect(v.y0, wie).toBeGreaterThanOrEqual(t.vak.y - 2);
        // Zonder bord is de plek boven de naam leeg porselein; met bord staat daar de tekening.
        const leeg = verschil(met, bakPlaatKlaar({ ...invoer, bord: undefined }));
        expect(leeg.y0, wie).toBeLessThan(t.vak.y * 0.3);
      }
    }
  });
});
