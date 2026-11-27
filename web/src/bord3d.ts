/**
 * Het 3D-bord (Bevy, `crates/halma-bord3d`) laden en bewaren.
 *
 * - De WebAssembly is groot (ongeveer 3 MB gecomprimeerd) en komt alleen mee als hij gebouwd is
 *   met `npm run wasm3d` (of `wasm3d:snel`). Zonder, zonder WebGL2 of na een fout toont de app het foutscherm
 *   (`Fout3D.svelte`, feature 251): er is geen plat scherm meer.
 * - Bevy kan maar één keer per pagina starten. Daarom is er één canvas voor de hele pagina: een
 *   laag over het hele scherm, achter de knoppen. Een spelscherm toont hem; daarna verdwijnt hij.
 * - `voorladen` laadt en start het 3D-bord al op het startscherm, zodat een Potje snel begint.
 * - De plaatjes van het lakbord (ontwerp 1b, `bord3d/`) leest de browser (AVIF) en geeft hij als
 *   beeldpunten aan Bevy (`zet_plaatje`); dan hoeft de WebAssembly geen AVIF te kunnen lezen. Die van
 *   het Vierkant bord pas als dat bord nodig is: ze kosten geheugen op de grafische kaart.
 * - Voorwerpen op de tafel (taak 178): `zet_voorwerpen` en `stuurPlaten`; zie `voorwerpen.ts` en `Voorwerpen.svelte`.
 */
import type { KnopSpec } from "./knopplaten/knoppen";
import { drieFout } from "./drie.svelte";
import { startWasm } from "./wasmGeperst";

declare const __HALMA_APP__: boolean;

/** Wat de WebAssembly van het 3D-bord aanbiedt (zie `crates/halma-bord3d/src/app/mod.rs`). */
export interface Bord3d {
  start(canvas: string, eenvoudig: boolean): void;
  zet_bord(vierkant: boolean, kijkX: number, kijkY: number, intro: boolean): void;
  zet_kleuren(kleuren: Uint32Array): void;
  zet_stand(stand: Int32Array): void;
  zet_gekozen(vak: number): void;
  zet_doel(speler: number, vakken: Uint32Array): void;
  zet_vlak(x: number, y: number, breedte: number, hoogte: number): void;
  /** Minder beweging (`prefers-reduced-motion`): schermwissels zonder overgang (UI-overgangen). Zet `laadBord3d` zelf. */
  zet_minder(minder: boolean): void;
  /** Een plaatje van het bord: naam (bijvoorbeeld `ster_kleur`), maat en beeldpunten (RGBA, of de inhoud van een `.bin`). Leeg: mislukt. */
  zet_plaatje(naam: string, breedte: number, hoogte: number, data: Uint8Array): void;
  beweeg(vakken: Uint32Array, hupMs: number, minder: boolean): void;
  vinger(id: number, fase: number, x: number, y: number, tijd: number): void;
  knijp(x: number, y: number, schaal: number, hoek: number): void;
  /** `f(x, y)` bij een tik van een vinger die Bevy kreeg: de plek op het scherm (px). */
  bij_tik(f: (x: number, y: number) => void): void;
  bij_camera(f: (overzicht: boolean) => void): void;
  /**
   * Wat onder een punt op het scherm ligt: `[x, y, eigen, geraakt]`. De plek op het bord (NaN naast
   * het bord), de steen van `speler` die de vinger pakt met `ruimte` px marge (of -1), en de steen
   * waar de vinger duidelijk op staat, niet op zijn rand (of -1). Zie `crates/halma-bord3d/src/kies.rs`.
   */
  wijs(x: number, y: number, speler: number, ruimte: number): ArrayLike<number>;
  /** Sleep de steen op `vak` met een vinger op (x, y); geeft de plek op het bord onder de steen. */
  sleep(vak: number, x: number, y: number): ArrayLike<number>;
  /** Laat de gesleepte steen los in vak `naar` (het mag), of -1: terug naar zijn gaatje. */
  loslaten(naar: number): void;
  /** Een tik van `van` naar `naar` mag niet: de steen gaat naar de rand en rolt terug. */
  mis(van: number, naar: number): void;
  camera_terug(): void;
  beelden(): number;
  klaar(): boolean;
  /**
   * Voorwerpen op de tafel (taak 178): per voorwerp soort, x, z, breedte, diepte, hoogte, gespiegeld (`voorwerpLijst` in
   * voorwerpen.ts). Vervangt de vorige voorwerpen en hun plaatjes. Leeg: geen voorwerpen, de camera kijkt weer alleen naar het bord.
   */
  zet_voorwerpen(lijst: Float32Array): void;
  /** Het plaatje (RGBA) op de bovenkant van voorwerp `nummer` (plek in de lijst van `zet_voorwerpen`). */
  zet_voorwerp_plaat(nummer: number, breedte: number, hoogte: number, data: Uint8Array): void;
  /** Zet voorwerp `nummer` op een andere plek (x, z in vakken, al gespiegeld voor rechts naar links), zonder de lijst opnieuw te sturen (taak 179). */
  zet_voorwerp_plek(nummer: number, x: number, z: number): void;
  /** Druk voorwerp `nummer` in (`aan`) of laat het los. */
  druk_voorwerp(nummer: number, aan: boolean): void;
  /** Kraal `deel` (0 Sound, 1 Vibration) van de lade `nummer` aan of uit. */
  zet_schakelaar(nummer: number, deel: number, aan: boolean): void;
  /** Per voorwerp links, boven, rechts, onder van zijn bovenkant op het scherm (CSS-pixels; NaN: niet in beeld). */
  voorwerp_vakken(): ArrayLike<number>;
  /** `f()` als `voorwerp_vakken` iets anders geeft. */
  bij_voorwerpen(f: () => void): void;
  /**
   * Bakt de plaatjes van de voorwerpen in taal `taal` (knopplaten, Canvas 2D) en geeft ze aan Bevy: `platen[i]` hoort bij
   * voorwerp `i` (null: geen plaatje). Klaar als alle plaatjes gestuurd zijn. Geen deel van de WebAssembly: zie `laadBord3d`.
   * `voor()`: na het bakken, vlak voor de plaatjes gaan (een nieuwe lijst met `zet_voorwerpen`, zodat de voorwerpen er meteen met
   * hun plaatje zijn). Geeft hij `false`, dan gaan de plaatjes niet (er kwam intussen een nieuwere lijst).
   */
  stuurPlaten(
    taal: string,
    platen: readonly (KnopSpec | null | undefined)[],
    nummers?: readonly number[],
    voor?: () => boolean,
  ): Promise<void>;
}

type Module = Bord3d & { default: (opties?: { module_or_path: Response | Promise<Response> }) => Promise<unknown> };

/** De plaatjes van het lakbord (`web/scripts/bak-bord3d`), op naam: `ster_kleur`, `omgeving_glans` ... */
const PLAATJES: Record<string, string> = Object.fromEntries(
  Object.entries(import.meta.glob<string>("./bord3d/halma_bord3d-*.{avif,bin}", { query: "?url", import: "default", eager: true })).map(
    ([pad, url]) => [pad.replace(/^.*halma_bord3d-/, "").replace(/\.\w+$/, ""), url],
  ),
);
/** Zijde van een omgevingskaart (zie `omgeving.mjs`). */
const OMGEVING_MAAT: Record<string, number> = { omgeving_glans: 128, omgeving_licht: 32 };

/** Een gelezen plaatje: maat en beeldpunten (RGBA, of de inhoud van een `.bin`). Leeg (maat 0): lezen mislukt, het bord kiest een effen kleur. */
type Plaatje = { breedte: number; hoogte: number; data: Uint8Array };

/** Haal een plaatje op en pak het uit tot beeldpunten. Mislukt het, dan een leeg plaatje. */
async function leesPlaatje(naam: string): Promise<Plaatje> {
  const url = PLAATJES[naam];
  try {
    if (!url) throw new Error(`no image ${naam}`);
    const antwoord = await fetch(url);
    if (!antwoord.ok) throw new Error(`${antwoord.status}`);
    if (naam in OMGEVING_MAAT) {
      const maat = OMGEVING_MAAT[naam];
      return { breedte: maat, hoogte: maat, data: new Uint8Array(await antwoord.arrayBuffer()) };
    }
    // Zonder omrekenen van kleur: normaal- en glanskaarten zijn getallen, geen kleuren.
    const beeld = await createImageBitmap(await antwoord.blob(), { colorSpaceConversion: "none", premultiplyAlpha: "none" });
    const { width: b, height: h } = beeld;
    const doek = typeof OffscreenCanvas === "undefined" ? Object.assign(document.createElement("canvas"), { width: b, height: h }) : new OffscreenCanvas(b, h);
    const g = doek.getContext("2d", { willReadFrequently: true }) as CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
    g.drawImage(beeld, 0, 0);
    beeld.close();
    const data = g.getImageData(0, 0, b, h).data;
    return { breedte: b, hoogte: h, data: new Uint8Array(data.buffer, data.byteOffset, data.byteLength) };
  } catch {
    return { breedte: 0, hoogte: 0, data: new Uint8Array() };
  }
}

/** Geef een plaatje aan het bord zodra het gelezen is. */
async function stuurPlaatje(m: Bord3d, naam: string, plaatje: Promise<Plaatje> = leesPlaatje(naam)): Promise<void> {
  const { breedte, hoogte, data } = await plaatje;
  try {
    m.zet_plaatje(naam, breedte, hoogte, data);
  } catch {
    // Het bord is al gestopt.
  }
}

/** De plaatjes die elk bord nodig heeft, en die van één speelveld. */
const ALGEMEEN = ["tafel_kleur", "tafel_normaal", "tafel_ruw", "rand_kleur", "rand_normaal", "beslag_kleur", "beslag_normaal", "omgeving_glans", "omgeving_licht"];
const veld = (vorm: "ster" | "vierkant") => ["kleur", "normaal", "orm"].map((n) => `${vorm}_${n}`);

// Leeg als de WebAssembly niet gebouwd is: dan blijft de gewone build snel en werkt hij zonder Bevy.
const modules = import.meta.glob<Module>("./wasm3d/halma_bord3d.js");
// De adressen van de WebAssembly. Het geperste bestand (`.wasm.xz`) maakt de build (vite.config.ts) alleen voor het web; in de app en de dev-server
// komt het gewone bestand.
const wasmAdres = import.meta.glob<string>("./wasm3d/halma_bord3d_bg.wasm", { query: "?url", import: "default", eager: true })["./wasm3d/halma_bord3d_bg.wasm"];
const wasmXz = import.meta.env.PROD && !__HALMA_APP__ && wasmAdres ? `${wasmAdres}.xz` : undefined;

let geladen: Promise<Bord3d> | null = null;
let mislukt = false;
let laagEl: HTMLDivElement | null = null;
/** Het bord als het geladen is, en welk bord het laatst gebouwd is (Vierkant bord of niet). */
let klaarBord: Bord3d | null = null;
let gebouwd: boolean | null = null;
/** Hoeveel schermen de laag met het 3D-bord nu tonen (`houdLaag`). */
let laagHouders = 0;

/** Kan dit apparaat het 3D-bord tonen? Nee zonder WebAssembly-build, zonder WebGL2, of na een fout. */
export function kan3d(): boolean {
  return !mislukt && bord3dGebouwd() && heeftWebgl2();
}

/** Heeft deze browser WebGL2? Alleen het toestel, los van de build en van een fout (`markeerMislukt`). */
export function heeftWebgl2(): boolean {
  if (typeof WebGL2RenderingContext === "undefined") return false;
  try {
    return !!document.createElement("canvas").getContext("webgl2");
  } catch {
    return false;
  }
}

/** Staat de WebAssembly van het 3D-bord in deze build? Zonder toont de app alleen het foutscherm. */
export function bord3dGebouwd(): boolean {
  return !!modules["./wasm3d/halma_bord3d.js"];
}

/** Het 3D-bord werkt hier niet (een fout, of het tekent niets): de app toont het foutscherm tot de pagina opnieuw laadt. */
export function markeerMislukt(): void {
  mislukt = true;
  drieFout.markeer();
  // Alleen een laag die er al is: er hoeft geen laag gemaakt te worden om hem uit te zetten. Zo raakt een late fout
  // (een test die al klaar is) het document niet meer aan.
  laagEl?.classList.remove("aan");
}

/**
 * Staat dit bord (`vierkant` of het Sterbord) al gebouwd en getekend? Dan kan een nieuw scherm zijn tafel meteen tonen (UI-overgangen):
 * Bevy bouwt hetzelfde bord niet opnieuw, de oude voorwerpen zakken weg en de nieuwe komen omhoog. Anders wacht het scherm tot het
 * bord klaar is, zoals de eerste keer.
 */
export function bordWarm(vierkant = false): boolean {
  if (mislukt || !klaarBord || gebouwd !== vierkant) return false;
  try {
    return klaarBord.klaar();
  } catch {
    return false;
  }
}

/**
 * Toon de laag met het 3D-bord tot de functie die je terugkrijgt, wordt aangeroepen. Laat het laatste scherm hem los, dan vervaagt hij
 * pas een beeld later: houdt het volgende scherm hem meteen vast (een schermwissel tussen twee tafels), dan blijft hij gewoon staan.
 */
export function houdLaag(): () => void {
  laagHouders++;
  laag().classList.add("aan");
  let los = false;
  return () => {
    if (los) return;
    los = true;
    laagHouders--;
    requestAnimationFrame(() => {
      if (laagHouders === 0) laag().classList.remove("aan");
    });
  };
}

/** De laag met het canvas, één keer gemaakt. */
export function laag(): HTMLDivElement {
  if (!laagEl) {
    laagEl = document.createElement("div");
    laagEl.className = "bord3d-laag";
    laagEl.setAttribute("aria-hidden", "true");
    const canvas = document.createElement("canvas");
    canvas.id = "bord3d";
    laagEl.append(canvas);
    document.body.prepend(laagEl);
  }
  return laagEl;
}

/**
 * Laad en start het 3D-bord. Tweede keer: hetzelfde bord. `kleuren`: de kleuren van de Spelers.
 * `?kwaliteit=laag` in het adres: zonder gladde randen, om te meten wat dat scheelt.
 */
export function laadBord3d(kleuren: readonly string[]): Promise<Bord3d> {
  geladen ??= (async () => {
    const laad = modules["./wasm3d/halma_bord3d.js"];
    if (!laad) throw new Error("The 3D board is not built in this version.");
    const m = await laad();
    // De plaatjes gaan van de lijn zodra de WebAssembly binnen is: de browser vertaalt die dan nog en Bevy start daarna, en in die tijd
    // staat de lijn stil. Eerder halen kan niet: dan delen ze de lijn met de WebAssembly en is het bord later binnen.
    let lijnVrij = () => {};
    const vrij = new Promise<void>((r) => (lijnVrij = r));
    const eerste = [...ALGEMEEN, ...veld("ster")].map((naam) => ({ naam, plaatje: vrij.then(() => leesPlaatje(naam)) }));
    // Zonder adres (een test, een build zonder WebAssembly-bestand): wasm-bindgen kiest zelf.
    if (wasmAdres) await startWasm((module_or_path) => m.default({ module_or_path }), wasmXz, wasmAdres, undefined, undefined, lijnVrij);
    else await m.default();
    lijnVrij();
    laag();
    const eenvoudig = new URLSearchParams(location.search).get("kwaliteit") === "laag";
    m.start("#bord3d", eenvoudig);
    const minder = typeof matchMedia === "function" ? matchMedia("(prefers-reduced-motion: reduce)") : null;
    m.zet_minder(!!minder?.matches);
    minder?.addEventListener?.("change", (e) => m.zet_minder(e.matches));
    m.zet_kleuren(Uint32Array.from(kleuren, (k) => parseInt(k.slice(1), 16)));
    // De plaatjes: de algemene en die van het Sterbord meteen, die van het Vierkant bord bij het eerste Vierkant bord.
    for (const { naam, plaatje } of eerste) void stuurPlaatje(m, naam, plaatje);
    let vierkantGeladen = false;
    const bord: Bord3d = {
      ...m,
      zet_bord(vierkant, kijkX, kijkY, intro) {
        if (vierkant && !vierkantGeladen) {
          vierkantGeladen = true;
          for (const naam of veld("vierkant")) void stuurPlaatje(m, naam);
        }
        m.zet_bord(vierkant, kijkX, kijkY, intro);
        gebouwd = vierkant;
      },
      stuurPlaten: (taal, platen, nummers, voor) => stuurPlaten(m, taal, platen, nummers, voor),
    };
    // Voor meetscripts (beelden per seconde, camera): het 3D-bord in de console.
    (globalThis as { __halmaBord3d?: Bord3d }).__halmaBord3d = bord;
    // Alvast het Sterbord, zodat shaders en texturen klaar zijn als het Potje begint.
    bord.zet_bord(false, NaN, NaN, false);
    klaarBord = bord;
    return bord;
  })();
  geladen.catch(() => markeerMislukt());
  return geladen;
}

/**
 * Bak de plaatjes van de voorwerpen (knopplaten) en stuur ze naar Bevy. Het bakken gebeurt één keer per scherm en taal, buiten
 * het tekenen: een bord dat beweegt, hapert er niet door. Lukt het niet (geen Canvas 2D), dan blijft het voorwerp effen.
 */
async function stuurPlaten(
  m: Bord3d,
  taal: string,
  platen: readonly (KnopSpec | null | undefined)[],
  nummers?: readonly number[],
  voor?: () => boolean,
): Promise<void> {
  const { bakSpecs } = await import("./knopplaten");
  // `nummers`: alleen deze voorwerpen opnieuw (de jade aanwijzer elke seconde), de rest houdt zijn plaatje.
  const lijst = platen.flatMap((p, i) => (p && (!nummers || nummers.includes(i)) ? [{ p, i }] : []));
  const gebakken = await bakSpecs(taal, lijst.map((l) => l.p));
  if (voor && !voor()) return;
  gebakken.forEach((plaat, k) => {
    const b = plaat.beeldpunten;
    m.zet_voorwerp_plaat(lijst[k].i, plaat.breedte, plaat.hoogte, new Uint8Array(b.buffer, b.byteOffset, b.byteLength));
  });
}

/** Laad het 3D-bord als de browser even niets te doen heeft. */
export function voorladen(kleuren: readonly string[]): void {
  if (!kan3d()) return;
  const doe = () => void laadBord3d(kleuren).catch(() => {});
  const w = window as Window & { requestIdleCallback?: (f: () => void, o?: { timeout: number }) => number };
  if (w.requestIdleCallback) w.requestIdleCallback(doe, { timeout: 2500 });
  else setTimeout(doe, 800);
}
