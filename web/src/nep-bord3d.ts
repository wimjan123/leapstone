/**
 * Een nep-3D-bord voor de tests: jsdom kent geen WebGL. Het onthoudt wat de app stuurt
 * (stand, gekozen vak, doel, bewegingen, terugrollen, slepen) en kan tikken nadoen zoals Bevy
 * ze meldt. Het scherm is hier het bord van bovenaf, `SCHAAL` pixels per vak (zie `naarScherm`),
 * zodat vingers op het vlak (`.bord3d`) ook werken. Een steen is daar een rondje (`STRAAL`) met de twee tikregels van het
 * echte bord (`kies.rs`): pakken binnen straal plus marge, geraakt pas `RAAK_DIEP` van de straal binnen de rand.
 * Gebruik in een test:
 *
 *   vi.mock("./bord3d", async () => (await import("./nep-bord3d")).nepModule());
 */
import type { Bord3d } from "./bord3d";
import { drieFout } from "./drie.svelte";
import type { KnopSpec } from "./knopplaten/knoppen";
import { schermPunt, type Vorm } from "./spelers";
import { Potje } from "./wasm/halma_core.js";

/** Pixels per vak op het nep-scherm. */
export const SCHAAL = 40;
/** De straal van een steen van bovenaf, in vakken (zoals `pion::STRAAL`). */
export const STRAAL = 0.412;
/** Een vinger raakt een steen pas als hij minstens dit deel van de straal binnen de rand staat (zoals `kies::RAAK_DIEP`). */
export const RAAK_DIEP = 0.4;
/** De plekken van de vakken per bord, één keer uitgerekend. */
const plekken: Partial<Record<Vorm, { x: number; y: number }[]>> = {};

/** Waar vak `vak` op het nep-scherm staat (px), plus een verschuiving in vakken. */
export function naarScherm(vorm: Vorm, plekken: ArrayLike<number>, vak: number, dx = 0, dy = 0) {
  const p = schermPunt(vorm, plekken[2 * vak], plekken[2 * vak + 1]);
  return { x: (p.x + dx) * SCHAAL, y: (p.y + dy) * SCHAAL };
}

export class NepBord implements Bord3d {
  borden: { vierkant: boolean; kijk: { x: number; y: number }; intro: boolean }[] = [];
  stand: number[] = [];
  gekozen = -1;
  /** Zetten die niet mochten en terugrolden: [van, naar]. */
  missers: [number, number][] = [];
  /** Gesleept: vak en plek op het bord. */
  slepen: { vak: number; x: number; y: number }[] = [];
  /** Losgelaten na slepen: het vak, of -1 (terug). */
  losgelaten: number[] = [];
  /** Hoe vaak de camera terug moest. */
  terug = 0;
  doel: { speler: number; vakken: number[] } = { speler: -1, vakken: [] };
  bewegingen: { vakken: number[]; hupMs: number; minder: boolean }[] = [];
  vingers: { id: number; fase: number }[] = [];
  /** Laden mislukt: de app toont het foutscherm (`Fout3D.svelte`). */
  faal = false;
  /** Het ophalen van het 3D-bord duurt tot deze belofte klaar is (een trage verbinding). */
  laden: Promise<void> | null = null;
  /** Onwaar: een toestel zonder WebGL2 (`kan3d()` en `heeftWebgl2()` zijn onwaar). */
  kan3d = true;
  /** Onwaar: een build zonder de WebAssembly van het 3D-bord (`bord3dGebouwd()`). */
  gebouwd = true;
  /** Voorwerpen op de tafel (taak 178): de lijst van `zet_voorwerpen`, ingedrukt, kralen, plaatjes. */
  voorwerpen: number[] = [];
  /** Elke keer dat er een lijst kwam. */
  voorwerpLijsten: number[][] = [];
  druk: { nummer: number; aan: boolean }[] = [];
  schakelaars: Record<string, boolean> = {};
  platen: { taal: string; ids: (string | null)[]; nummers?: number[] }[] = [];
  /** Voorwerpen die naar een andere plek gingen (taak 179): nummer, x, z. */
  plekken: { nummer: number; x: number; z: number }[] = [];
  /** De plaatjes die er het laatst voor elk voorwerp kwamen (de KnopSpec), op nummer. */
  platenSpec: Record<number, KnopSpec> = {};
  /** Waar de voorwerpen op het nep-scherm staan: per voorwerp links, boven, rechts, onder (`zetVakken`). */
  vakken: number[] = [];
  private voorwerpMelder: (() => void) | null = null;
  private tikker: ((x: number, y: number) => void) | null = null;
  private camera: ((overzicht: boolean) => void) | null = null;

  /** Alles terug zoals op een verse pagina, ook het foutscherm van de app (`drieFout`). */
  reset() {
    Object.assign(this, new NepBord());
    drieFout.herstel();
  }

  /**
   * Ingezoomd (taak 186): het bord ligt `schaal` keer zo groot op het nep-scherm, verschoven met (`x`, `y`) px. Zoals Bevy
   * dat doet, volgen `wijs`, `sleep` en tikken het beeld. Standaard 1, 0, 0: het overzicht. Alleen het bord zoomt (taak 190):
   * de vakken van de voorwerpen blijven staan, maar ze zakken weg zolang je ingezoomd bent (taak 235, `bij_camera`).
   */
  zoom = { schaal: 1, x: 0, y: 0 };
  inzoomen(schaal: number, x = 0, y = 0) {
    this.zoom = { schaal, x, y };
    // Zoals Bevy (taak 235): ingezoomd zakken de voorwerpen weg en meldt het bord dat de camera het overzicht verliet.
    const overzicht = schaal <= 1.05;
    if (overzicht !== this.overzicht) {
      this.overzicht = overzicht;
      this.meldCamera(overzicht);
    }
  }
  private overzicht = true;
  /** Van een plek op het bord (in vakken, zoals `schermPunt`) naar het nep-scherm (px), met het zoomen. */
  opScherm(p: { x: number; y: number }) {
    return { x: p.x * SCHAAL * this.zoom.schaal + this.zoom.x, y: p.y * SCHAAL * this.zoom.schaal + this.zoom.y };
  }
  /** Van het nep-scherm (px) naar een plek op het bord (in vakken). */
  private opBord(x: number, y: number) {
    return { x: (x - this.zoom.x) / (SCHAAL * this.zoom.schaal), y: (y - this.zoom.y) / (SCHAAL * this.zoom.schaal) };
  }
  /** De voorwerpen liggen elders op het scherm (een ander venster) en Bevy meldt dat (`bij_voorwerpen`). */
  verschuifVoorwerpen(dx: number, dy: number) {
    this.vakken = this.vakken.map((v, i) => v + (i % 2 === 0 ? dx : dy));
    this.voorwerpMelder?.();
  }
  /** De vingers die Bevy kreeg, met hun plek (px). */
  vingerPlekken: { id: number; fase: number; x: number; y: number }[] = [];

  /** Tik op het bord, op een plek zoals in de web-app (zie `schermPunt`). Bevy meldt hem als plek op het scherm. */
  tik(x: number, y: number) {
    const p = this.opScherm({ x, y });
    this.tikker?.(p.x, p.y);
  }

  /** Tik op vak `vak`, met een verschuiving in vakken (een ruwe tik). `plekken` uit `Potje.vak_plekken()`. */
  tikVak(vorm: Vorm, plekken: ArrayLike<number>, vak: number, dx = 0, dy = 0) {
    const p = schermPunt(vorm, plekken[2 * vak], plekken[2 * vak + 1]);
    this.tik(p.x + dx, p.y + dy);
  }

  start() {}
  /** Voor `bordWarm` in `nepModule`: het bord staat al gebouwd en getekend (een schermwissel tussen twee tafels). */
  warm = false;
  /** Het bakken van de plaatjes duurt tot deze belofte klaar is (een test houdt het zo even tegen). */
  bakken: Promise<void> | null = null;
  zet_bord(vierkant: boolean, kijkX: number, kijkY: number, intro: boolean) {
    this.borden.push({ vierkant, kijk: { x: kijkX, y: kijkY }, intro });
  }
  /** De kleuren van de Stenen die het laatst kwamen (0xRRGGBB), leeg als er nooit eigen kleuren kwamen. */
  kleuren: number[] = [];
  zet_kleuren(kleuren: Uint32Array) {
    this.kleuren = Array.from(kleuren);
  }
  zet_stand(stand: Int32Array) {
    this.stand = Array.from(stand);
  }
  zet_gekozen(vak: number) {
    this.gekozen = vak;
  }
  zet_doel(speler: number, vakken: Uint32Array) {
    this.doel = { speler, vakken: Array.from(vakken) };
  }
  zet_vlak() {}
  zet_minder() {}
  zet_plaatje() {}
  beweeg(vakken: Uint32Array, hupMs: number, minder: boolean) {
    this.bewegingen.push({ vakken: Array.from(vakken), hupMs, minder });
  }
  vinger(id: number, fase: number, x = NaN, y = NaN) {
    this.vingers.push({ id, fase });
    this.vingerPlekken.push({ id, fase, x, y });
  }
  knijp() {}
  bij_tik(f: (x: number, y: number) => void) {
    this.tikker = f;
  }
  bij_camera(f: (overzicht: boolean) => void) {
    this.camera = f;
  }
  /** De camera verliet het overzicht (`false`) of is terug (`true`). */
  meldCamera(overzicht: boolean) {
    this.camera?.(overzicht);
  }
  /** Zoals Bevy: de plek op het bord, de eigen steen binnen `ruimte` px van zijn rand, en de geraakte steen. */
  wijs(x: number, y: number, speler: number, ruimte: number) {
    const p = this.opBord(x, y);
    const punten = this.punten();
    // Pakken (`kies::eigen`): binnen de straal plus de marge. Geraakt (`kies::geraakt`): minstens RAAK_DIEP van de straal binnen de rand.
    const steen = (mag: (vak: number) => boolean, bereik: number) => {
      let beste: { vak: number; d: number } | null = null;
      this.stand.forEach((s, vak) => {
        if (s < 0 || !mag(vak) || !punten[vak]) return;
        const d = Math.hypot(punten[vak].x - p.x, punten[vak].y - p.y);
        if (d <= bereik && (!beste || d < beste.d)) beste = { vak, d };
      });
      return (beste as { vak: number } | null)?.vak ?? -1;
    };
    return [p.x, p.y, steen((v) => this.stand[v] === speler, STRAAL + ruimte / (SCHAAL * this.zoom.schaal)), steen(() => true, STRAAL * (1 - RAAK_DIEP))];
  }
  /** De plekken van de vakken (web-app), uit de spelregels: Sterbord (121 vakken) of Vierkant bord. */
  private punten() {
    const vierkant = this.stand.length === 256;
    return (plekken[vierkant ? "vierkant" : "ster"] ??= (() => {
      const potje = vierkant ? Potje.vierkant(2) : new Potje(2);
      const p = Array.from(potje.vak_plekken());
      potje.free();
      return Array.from({ length: p.length / 2 }, (_, i) => schermPunt(vierkant ? "vierkant" : "ster", p[2 * i], p[2 * i + 1]));
    })());
  }
  sleep(vak: number, x: number, y: number) {
    const p = this.opBord(x, y);
    this.slepen.push({ vak, x: p.x, y: p.y });
    return [p.x, p.y];
  }
  loslaten(naar: number) {
    this.losgelaten.push(naar);
  }
  mis(van: number, naar: number) {
    this.missers.push([van, naar]);
  }
  camera_terug() {
    this.terug++;
  }
  /** Elke vraag een beeld verder, zoals een bord dat tekent. */
  private getekend = 0;
  beelden() {
    return ++this.getekend;
  }
  zet_voorwerpen(lijst: Float32Array) {
    this.voorwerpen = Array.from(lijst);
    this.voorwerpLijsten.push(this.voorwerpen);
    // Zoals Bevy (`zet_voorwerpen` wist de plaatjes): een nieuwe lijst begint zonder plaatjes van de vorige.
    this.platenSpec = {};
    this.vakken = [];
    // Op het nep-scherm ligt voorwerp i op rij i: 100 bij 40 px, met 10 px ertussen.
    for (let i = 0; i < lijst.length / 7; i++) this.vakken.push(20, 10 + 50 * i, 120, 50 + 50 * i);
    queueMicrotask(() => this.voorwerpMelder?.());
  }
  zet_voorwerp_plaat() {}
  zet_voorwerp_plek(nummer: number, x: number, z: number) {
    this.plekken.push({ nummer, x, z });
  }
  druk_voorwerp(nummer: number, aan: boolean) {
    this.druk.push({ nummer, aan });
  }
  zet_schakelaar(nummer: number, deel: number, aan: boolean) {
    this.schakelaars[`${nummer}.${deel}`] = aan;
  }
  voorwerp_vakken() {
    return this.vakken;
  }
  bij_voorwerpen(f: () => void) {
    this.voorwerpMelder = f;
  }
  async stuurPlaten(taal: string, platen: readonly (KnopSpec | null | undefined)[], nummers?: readonly number[], voor?: () => boolean) {
    // Zoals het echte bord: eerst bakken (hier een beurt van de microtaken, of tot `bakken` klaar is), dan de lijst (`voor`), dan
    // de plaatjes.
    await (this.bakken ?? Promise.resolve());
    if (voor && !voor()) return;
    this.platen.push({ taal, ids: platen.map((p) => p?.id ?? null), nummers: nummers ? [...nummers] : undefined });
    platen.forEach((p, i) => p && (!nummers || nummers.includes(i)) && (this.platenSpec[i] = p));
  }
  klaar() {
    return true;
  }
}

export const nep = new NepBord();

/** Vervangt `bord3d.ts`: 3D kan altijd, en laden geeft het nep-bord. */
export function nepModule() {
  let laag: HTMLDivElement | null = null;
  return {
    kan3d: () => nep.kan3d && nep.gebouwd && !drieFout.mislukt,
    bord3dGebouwd: () => nep.gebouwd,
    heeftWebgl2: () => nep.kan3d,
    markeerMislukt: () => {
      drieFout.markeer();
      // Na `vi.resetModules()` (Laadtafel.test.ts) heeft de app een verse `drie.svelte`; die moet het ook weten.
      void import("./drie.svelte").then((m) => m.drieFout.markeer());
    },
    laag: () => (laag ??= document.createElement("div")),
    /** Zoals `bordWarm`: het bord staat al getekend (zet `nep.warm` in een test). */
    bordWarm: () => nep.warm,
    houdLaag: () => {
      laag ??= document.createElement("div");
      laag.classList.add("aan");
      const l = laag;
      return () => l.classList.remove("aan");
    },
    laadBord3d: async () => {
      await nep.laden;
      if (nep.faal) throw new Error("no WebGL2");
      return nep;
    },
    voorladen: () => {},
  };
}
