/**
 * Het beeld van een knop of plaat (taak 183): Canvas 2D, in de materialen van uiterlijk 1b, met tekst en pictogram in de taal van de Speler.
 * Uitvoer: beeldpunten (RGBA) en de maat; het koppelen aan 3D-voorwerpen gebeurt in taak 178. Zie docs/bord3d.md, "Knopplaten".
 * Alles is zelf getekend (porselein, lak, goud); van buiten komen alleen de lettertypen (Noto Sans, SIL Open Font License).
 */
import { maakDoek, type Ctx } from "./doek";
import type { BordTekening, Pictogram, Soort } from "./knoppen";
import { groepVoorTaal } from "./letterdata";
import { laadLetters, letterFont } from "./letters";
import { draak, ICOON, wolkje } from "./motief";
import { pasTekst } from "./pas";
import { kansMaker, zaadVan } from "./ruis";
import { TALEN } from "../talen/register";

/** Beeldpunten per eenheid. Een eenheid is een "vak" van de 3D-tafel; de maten hieronder zijn in eenheden. */
export const STANDAARD_SCHAAL = 100;

/** Maat van een plaat in eenheden (breedte, hoogte), zoals het prototype (src/platen.js). */
export const PLAATMATEN: Record<Soort, { b: number; d: number }> = {
  porselein: { b: 4.0, d: 2.75 },
  rood: { b: 6.15, d: 2.7 },
  zwart: { b: 6.15, d: 2.7 },
  naamplaat: { b: 4.5, d: 1.9 },
  lade: { b: 8.3, d: 2.1 },
  titel: { b: 8.4, d: 3.0 },
  // Een plaatje met pictogram en naam (taak 206); was een ronde schijf van 2,2 zonder tekst.
  messing: { b: 3.6, d: 2.4 },
  jade: { b: 3.7, d: 1.16 },
  // Een keuzebalk en zijn toetsen (keuzeschermen): `KnopSpec.maat` geeft de echte maat, dit is alleen de standaard.
  balk: { b: 14, d: 2.4 },
  toets: { b: 2.7, d: 1.9 },
  toetsGekozen: { b: 2.7, d: 1.9 },
};

/** De keuzebalk: zo breed is de kolom met het kopje aan de beginkant (eenheden); de toetsen liggen erna. */
export const BALK_KOP = 3.7;

export type PlaatInvoer = {
  soort: Soort;
  /** Taalcode van web/src/talen/ (bijvoorbeeld "ar"). Bepaalt het lettertype en de richting. */
  taal: string;
  /** Eén tekst, of twee bij de lade (Sound en Vibration). */
  teksten: string[];
  /** Eén pictogram per tekst (porselein en lade). */
  pictogrammen?: Pictogram[];
  /** Beeldpunten per eenheid; standaard 100. */
  schaal?: number;
  /** Een naam voor de vaste patronen (craquelé): dezelfde knop ziet er in elke taal hetzelfde uit. */
  id?: string;
  /** Alleen voor tests: laat teksten weg. */
  zonderTekst?: boolean;
  /** Overschrijft de richting van de taal. */
  rtl?: boolean;
  /** Naamplaat: de Speler (vanaf 0) wiens Steen op de plaat ligt (taak 179). De tweede tekst is dan zijn Rating. */
  speler?: number;
  /** Naamplaat van een Speler die een tik wisselt (taak 235): een klein wisselteken aan het eind van de plaat. */
  wissel?: boolean;
  /** Jade aanwijzer: de Denktijd, `rest` van 0 tot 1 en eventueel de klok als tekst (taak 179). */
  tijd?: { rest: number; klok?: string };
  /**
   * Een andere maat dan `PLAATMATEN` (eenheden). Alleen de naamplaat van een Speler gebruikt dit: bij zes Spelers zijn de platen
   * anders van vorm, zodat de hele naam past (taak 193); de platen van Bord kiezen zijn groter dan het plaatje van porselein.
   * Zonder `maat` is de plaat precies zoals voorheen.
   */
  maat?: { b: number; d: number };
  /** Porselein: een tekening van het bord boven de tekst (Bord kiezen). */
  bord?: BordTekening;
  /** Lade: staat Sound (0) en Vibration (1) aan? Een deel dat uit staat, is dof met een streep door het pictogram (taak 206). */
  aan?: boolean[];
  /** De knop doet nu niets: dezelfde plaat, maar dof (taak 231). Tekst en pictogram blijven te lezen. */
  uit?: boolean;
};

export type PlaatTekst = {
  tekst: string;
  regels: string[];
  /** Lettergrootte in eenheden. */
  grootte: number;
  /** Het vak (in beeldpunten van de plaat) waar de tekst in moest passen. */
  vak: { x: number; y: number; b: number; h: number };
  richting: "ltr" | "rtl";
};

export type Plaat = {
  soort: Soort;
  taal: string;
  rtl: boolean;
  /** Maat van het beeld in beeldpunten. beeldpunten.length === breedte * hoogte * 4. */
  breedte: number;
  hoogte: number;
  schaal: number;
  /** RGBA, rij voor rij van boven, 8 bit per kanaal, niet voorvermenigvuldigd (alpha is overal 255). */
  beeldpunten: Uint8ClampedArray;
  teksten: PlaatTekst[];
};

// ---------- Kleuren ----------
const GOUD = "#f2c466", GOUD_DOF = "#d9a94e", GOUD_LICHT = "#fbe3a0", GOUD_DIEP = "#a87a2a", LAK = "#0b0807", CINNABER = "#b3271a";
const KOBALT = "#1f3a82", KOBALT_RAND = "#26438a";

type P = { c: Ctx; s: number; rtl: boolean; taal: string; b: number; d: number; teksten: PlaatTekst[]; tekst: boolean; zaad: number;
  /** Taak 240: de plaat wordt dof (`uit`); de letters komen pas na de dofheid (`later`), zodat ze niet mee doffer worden. */
  dof?: boolean; later?: (() => void)[] };

const kader = (c: Ctx, w: number, d: number, inzet: number, straal: number) => c.roundRect(-w / 2 + inzet, -d / 2 + inzet, w - 2 * inzet, d - 2 * inzet, straal);
function vul(c: Ctx, pad: (c: Ctx) => void, kleur: string | CanvasGradient) { c.beginPath(); pad(c); c.fillStyle = kleur; c.fill(); }
function streek(c: Ctx, pad: (c: Ctx) => void, kleur: string | CanvasGradient, breedte: number) {
  c.beginPath(); pad(c); c.strokeStyle = kleur; c.lineWidth = breedte; c.lineCap = "round"; c.lineJoin = "round"; c.stroke();
}
const spiegelX = (p: P, x: number) => (p.rtl ? -x : x);

// ---------- Pictogram ----------
function icoon(p: P, naam: Pictogram, x: number, y: number, maat: number, kleur: string, dik = 1.9) {
  const pad = ICOON[naam];
  if (!pad) return;
  const c = p.c;
  c.save();
  c.translate(x - maat / 2, y - maat / 2);
  c.scale(maat / 24, maat / 24);
  // Een pictogram dat wijst naar links of rechts (terug) draait mee met de richting van de taal.
  if (p.rtl && naam === "terug") { c.translate(24, 0); c.scale(-1, 1); }
  streek(c, pad, kleur + "2e", dik * 1.5);
  streek(c, pad, kleur, dik);
  c.restore();
}

// ---------- Tekst ----------
type TekstPlan = {
  tekst: string; x: number; y: number; b: number; h: number; grootste: number; uitlijnen: "midden" | "begin"; vulling: "goud" | "goudDof" | "kobalt" | "jade" | "messing" | "creme";
  /** Zie `PasOpties`: mag een woord zonder spaties tussen tekens breken. */
  breekWoord?: boolean;
};

/** Meet een tekst bij lettergrootte 1 (in eenheden). */
function maatMeter(c: Ctx, taal: string) {
  c.font = letterFont(taal, 100);
  // Meet vanaf de linkerkant. Anders erft het canvas de richting van de pagina (dir="rtl" in het Arabisch): dan meet
  // actualBoundingBoxLeft de hele tekst en wordt de tekst drie keer te klein (taak 178).
  c.direction = "ltr";
  c.textAlign = "left";
  return (t: string) => {
    // De letters kunnen buiten hun regelbreedte uitsteken (een J, een schuine l): tel dat aan beide kanten mee, want we centreren op de regelbreedte.
    const m = c.measureText(t);
    const uit = Math.max(0, m.actualBoundingBoxLeft, m.actualBoundingBoxRight - m.width);
    return (m.width + 2 * uit) / 100;
  };
}

function schrijf(p: P, plan: TekstPlan) {
  const c = p.c;
  const g = groepVoorTaal(p.taal);
  const meet = maatMeter(c, p.taal);
  // De schaduw en de rand van de letters steken een beetje buiten de regel uit: houd daar ruimte voor vrij.
  const rand = plan.grootste * 0.05;
  // Bij tekst die aan de rand begint, steken letters als een J links uit: schuif de beginlijn iets op.
  const inzet = plan.uitlijnen === "begin" ? plan.grootste * 0.14 : 0;
  const uit = pasTekst(meet, plan.tekst, { breedte: plan.b - rand - inzet, hoogte: plan.h - rand, grootste: plan.grootste, regelhoogte: g.regelhoogte, taal: p.taal, woordgrens: g.woordgrens, breekWoord: plan.breekWoord });
  const px = p.s;
  p.teksten.push({
    tekst: plan.tekst, regels: uit.regels, grootte: uit.grootte, richting: p.rtl ? "rtl" : "ltr",
    vak: { x: (p.b / 2 + plan.x - plan.b / 2) * px, y: (p.d / 2 + plan.y - plan.h / 2) * px, b: plan.b * px, h: plan.h * px },
  });
  if (!p.tekst) return;
  if (p.dof && p.later) { p.later.push(() => tekenRegels(p, plan, uit, g)); return; }
  tekenRegels(p, plan, uit, g);
}

function tekenRegels(p: P, plan: TekstPlan, uit: ReturnType<typeof pasTekst>, g: ReturnType<typeof groepVoorTaal>) {
  const c = p.c;
  const inzet = plan.uitlijnen === "begin" ? plan.grootste * 0.14 : 0;
  const regelH = g.regelhoogte * uit.grootte;
  const top = plan.y - (uit.regels.length * regelH) / 2;
  c.save();
  c.font = letterFont(p.taal, uit.grootte * 100);
  c.direction = p.rtl ? "rtl" : "ltr";
  c.textBaseline = "middle";
  c.textAlign = plan.uitlijnen === "midden" ? "center" : "start";
  uit.regels.forEach((regel, i) => {
    const y = top + (i + 0.5) * regelH;
    const x = plan.uitlijnen === "midden" ? plan.x : plan.x + (p.rtl ? plan.b / 2 - inzet : -plan.b / 2 + inzet);
    c.save();
    c.translate(x, y);
    c.scale(0.01, 0.01);
    // Gegraveerd of in goud: eerst een schaduw naar rechtsonder, dan de kleur met een lichte rand.
    const k = uit.grootte * 100;
    if (p.dof) {
      // Taak 278: een uitgezette knop is een effen grijze plaat (`dofMaken`) met donkere letters: goed te lezen en niet te verwarren met een knop die werkt.
      c.fillStyle = "rgba(255,255,255,.4)"; c.fillText(regel, k * 0.015, k * 0.03);
      c.fillStyle = DOF_LETTER; c.fillText(regel, 0, 0);
    } else if (plan.vulling === "goud" || plan.vulling === "goudDof") {
      const dof = plan.vulling === "goudDof";
      c.fillStyle = "rgba(20,10,2,.75)"; c.fillText(regel, k * 0.03, k * 0.045);
      const gr = c.createLinearGradient(0, -k * 0.55, 0, k * 0.55);
      if (dof) { gr.addColorStop(0, "#e2c27a"); gr.addColorStop(0.45, "#c9a24e"); gr.addColorStop(1, "#a8802f"); } // ook de donkerste rand haalt ongeveer 5 op 1 op zwart lak
      else { gr.addColorStop(0, GOUD_LICHT); gr.addColorStop(0.45, GOUD); gr.addColorStop(1, GOUD_DIEP); }
      c.fillStyle = gr; c.strokeStyle = gr; c.lineWidth = k * 0.025; c.lineJoin = "round";
      c.strokeText(regel, 0, 0); c.fillText(regel, 0, 0);
    } else if (plan.vulling === "messing") {
      c.fillStyle = "rgba(255,244,208,.7)"; c.fillText(regel, k * 0.02, k * 0.035); // gegraveerd, zoals het pictogram
      c.fillStyle = "#3e2a0c"; c.fillText(regel, 0, 0);
    } else if (plan.vulling === "creme") {
      c.fillStyle = "rgba(8,18,52,.6)"; c.fillText(regel, k * 0.02, k * 0.035);
      c.fillStyle = "#f7f1df"; c.fillText(regel, 0, 0);
    } else if (plan.vulling === "jade") {
      c.fillStyle = "rgba(255,255,255,.5)"; c.fillText(regel, k * 0.015, k * 0.03);
      c.fillStyle = "#12382c"; c.fillText(regel, 0, 0);
    } else {
      c.fillStyle = "rgba(255,255,255,.55)"; c.fillText(regel, k * 0.015, k * 0.03); // glazuur boven de inkt
      c.fillStyle = KOBALT; c.fillText(regel, 0, 0);
    }
    c.restore();
  });
  c.restore();
}

/** Hoe een tekst in een vak zou passen, zonder te tekenen: het aantal regels en de lettergrootte. */
function pastIn(p: P, tekst: string, b: number, h: number, grootste: number) {
  const g = groepVoorTaal(p.taal);
  const rand = grootste * 0.05;
  return pasTekst(maatMeter(p.c, p.taal), tekst, { breedte: b - rand, hoogte: h - rand, grootste, regelhoogte: g.regelhoogte, taal: p.taal, woordgrens: g.woordgrens });
}

// ---------- De draak ----------
type DraakVerf = { vlak: string; kop: string; fijn: string; oog: string; pupil: string; parel: string };
function tekenDraakDelen(c: Ctx, v: DraakVerf) {
  const D = draak();
  vul(c, D.staart, v.vlak); vul(c, D.vlammen, v.vlak);
  for (const poot of D.poten) streek(c, poot.pad, v.vlak, poot.breed);
  vul(c, D.klauwen, v.vlak); vul(c, D.kam, v.vlak); vul(c, D.lijf, v.vlak);
  vul(c, D.manen, v.vlak); vul(c, D.hoorns, v.vlak);
  streek(c, D.snor, v.vlak, 0.03);
  vul(c, D.kop, v.kop);
  streek(c, D.schubben, v.fijn, 0.013); streek(c, D.buik, v.fijn, 0.012); streek(c, D.bek, v.fijn, 0.02);
  vul(c, D.oog, v.oog); vul(c, D.pupil, v.pupil);
  vul(c, D.parelVlam, v.vlak); vul(c, D.parel, v.parel); streek(c, D.parelKrul, v.fijn, 0.018);
}
function tekenDraak(c: Ctx, x: number, y: number, schaal: number, spiegel: boolean, v: DraakVerf, schaduw: string) {
  c.save();
  c.translate(x, y);
  c.scale(spiegel ? -schaal : schaal, schaal);
  // Reliëf in kleur: eerst de schaduw naast de draak, dan de draak zelf.
  c.save(); c.translate(0.03, 0.05);
  tekenDraakDelen(c, { vlak: schaduw, kop: schaduw, fijn: schaduw, oog: schaduw, pupil: schaduw, parel: schaduw });
  c.restore();
  tekenDraakDelen(c, v);
  c.restore();
}

// ---------- De materialen ----------
function zwartLak(p: P, w: number, d: number) {
  const c = p.c;
  vul(c, (k) => k.rect(-w / 2 - 0.05, -d / 2 - 0.05, w + 0.1, d + 0.1), LAK);
  // De glans van lak: een lichte baan van linksboven.
  const gl = c.createLinearGradient(-w / 2, -d / 2, w / 2, d / 2);
  gl.addColorStop(0, "rgba(120,100,90,.22)"); gl.addColorStop(0.35, "rgba(60,50,45,.05)"); gl.addColorStop(1, "rgba(0,0,0,0)");
  vul(c, (k) => kader(k, w, d, 0, 0.1), gl);
  streek(c, (k) => kader(k, w, d, 0.13, 0.1), GOUD, 0.034);
  streek(c, (k) => kader(k, w, d, 0.2, 0.06), GOUD_DOF, 0.012);
}

/** Tekstvak en lettergrootte op porselein: zo groot dat de langste Engelse knoptekst op één regel ("Leaderboard") niet krimpt. */
const TB_STANDAARD = 3.4, TG = 0.52;

/** Porselein: het glazuur (wit, of kobaltblauw voor een gekozen toets) met craquelé. */
function glazuur(p: P, kobalt = false) {
  const { c, b: w, d } = p;
  const kans = kansMaker(p.zaad);
  vul(c, (k) => k.rect(-w / 2 - 0.05, -d / 2 - 0.05, w + 0.1, d + 0.1), kobalt ? "#25448f" : "#efece3");
  // Glazuur: lichter in het midden, iets grijzer naar de rand, met een lichte glans linksboven.
  const rond = c.createRadialGradient(-w * 0.12, -d * 0.2, 0.2, 0, 0, Math.max(w, d) * 0.75);
  rond.addColorStop(0, kobalt ? "rgba(120,150,220,.35)" : "rgba(255,255,255,.5)"); rond.addColorStop(0.6, "rgba(255,255,255,0)"); rond.addColorStop(1, kobalt ? "rgba(5,12,40,.35)" : "rgba(120,125,130,.22)");
  vul(c, (k) => kader(k, w, d, 0, 0.1), rond);
  // Craquelé: fijne haarscheurtjes in het glazuur.
  const n = Math.round(120 * Math.min(1, (w * d) / 11));
  for (let i = 0; i < n; i++) {
    const sg = () => kans() - 0.5;
    let x = sg() * w, y = sg() * d, vert = kans() > 0.5;
    const n = 3 + Math.floor(kans() * 5);
    c.beginPath(); c.moveTo(x, y);
    for (let j = 0; j < n; j++) { const l = 0.08 + kans() * 0.3; if (vert) y += l * (kans() > 0.5 ? 1 : -1); else x += l * (kans() > 0.5 ? 1 : -1); c.lineTo(x, y); vert = !vert; }
    c.strokeStyle = kobalt ? "rgba(190,205,240,.22)" : "rgba(110,100,84,.32)"; c.lineWidth = 0.008; c.lineCap = "round"; c.lineJoin = "round"; c.stroke();
  }
}

function porselein(p: P, spec: PlaatInvoer) {
  const { c, b: w, d } = p;
  // Een bredere plaat (taak 226, een lange knoptekst) geeft de tekst meer breedte; de standaardplaat blijft 3,4.
  const TB = Math.max(TB_STANDAARD, w - 0.6);
  glazuur(p);
  // De kobaltblauwe lijn langs de rand, met een lichte vervloeiing.
  streek(c, (k) => kader(k, w, d, 0.13, 0.12), KOBALT_RAND + "40", 0.06);
  streek(c, (k) => kader(k, w, d, 0.13, 0.12), KOBALT_RAND, 0.03);
  streek(c, (k) => kader(k, w, d, 0.2, 0.08), KOBALT_RAND, 0.011);
  if (spec.bord) {
    bordOpPlaat(p, spec.bord, spec.teksten[0] ?? "");
    return;
  }
  const ic: Pictogram | undefined = spec.pictogrammen?.[0];
  const inkt = ic === "vlag" ? "#9d2318" : ic === "vink" ? "#1d6a4c" : KOBALT;
  const tekst = spec.teksten[0] ?? "";
  if (!ic) {
    schrijf(p, { tekst, x: 0, y: 0.1, b: TB, h: 1.8, grootste: TG, uitlijnen: "midden", vulling: "kobalt" });
    return;
  }
  // Elke plaat dezelfde lettergrootte (taak 206): past de tekst niet op één regel, dan wordt het pictogram kleiner en schuift het
  // omhoog, zodat twee regels even groot blijven als één regel op de plaat ernaast ("Puzzle of the day" naast "Friends").
  // Eén lang woord (コンピューター) mag tot 0,46 krimpen voordat het pictogram kleiner wordt (council ronde 6).
  const eenRegel = pastIn(p, tekst, TB, 1.14, TG);
  const twee = eenRegel.regels.length > 1 || eenRegel.grootte < 0.46;
  if (twee) {
    icoon(p, ic, 0, -0.82, 0.62, inkt, 2.2);
    schrijf(p, { tekst, x: 0, y: 0.27, b: TB, h: 1.6, grootste: TG, uitlijnen: "midden", vulling: "kobalt" });
  } else {
    icoon(p, ic, 0, -0.6, 0.85, inkt, 2.0);
    schrijf(p, { tekst, x: 0, y: 0.48, b: TB, h: 1.14, grootste: TG, uitlijnen: "midden", vulling: "kobalt" });
  }
}

/**
 * Een bord van rood lak op porselein, met de naam eronder (Bord kiezen): een rand van goud en cinnaber, het veld van donker lak,
 * gaatjes met een gouden rand en de Stenen in hun beginstand. Zoals het lakbord op de tafel, zodat de Speler herkent wat hij kiest.
 */
function bordOpPlaat(p: P, bord: BordTekening, tekst: string) {
  const { c, b: w, d } = p;
  const naamH = 1.0, naamY = d / 2 - 0.26 - naamH / 2;
  const boven = -d / 2 + 0.34, onder = naamY - naamH / 2 - 0.02;
  const xs = bord.gaten.map((g) => g.x), ys = bord.gaten.map((g) => g.y);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  // De rand steekt 1,15 vak buiten de buitenste gaatjes (de lijnbreedte hieronder), plus de schaduw.
  const RAND = 1.15;
  const k = Math.min((w - 0.6) / (x1 - x0 + 2 * RAND), (onder - boven) / (y1 - y0 + 2 * RAND + 0.3));
  c.save();
  c.translate(0, (boven + onder) / 2 - 0.15 * k);
  c.scale(k, k);
  c.translate(-(x0 + x1) / 2, -(y0 + y1) / 2);
  // Het Sterbord: twee driehoeken door de zes punten van de ster. Het Vierkant bord: de rechthoek door de hoekgaatjes.
  const midden = { x: (x0 + x1) / 2, y: (y0 + y1) / 2 };
  const hoek = (g: { x: number; y: number }) => Math.atan2(g.y - midden.y, g.x - midden.x);
  const ver = Math.max(...bord.gaten.map((g) => Math.hypot(g.x - midden.x, g.y - midden.y)));
  const punten = bord.gaten.filter((g) => Math.hypot(g.x - midden.x, g.y - midden.y) > ver - 0.05).sort((a, b) => hoek(a) - hoek(b));
  const vorm = (q: Ctx) => {
    if (bord.vierkant) { q.rect(x0, y0, x1 - x0, y1 - y0); return; }
    for (const drie of [[0, 2, 4], [1, 3, 5]]) {
      drie.forEach((i, j) => (j ? q.lineTo(punten[i].x, punten[i].y) : q.moveTo(punten[i].x, punten[i].y)));
      q.closePath();
    }
  };
  // Elke laag is de vorm, zo ver naar buiten gezet als de halve lijnbreedte (met ronde hoeken).
  const laag = (uit: number, kleur: string | CanvasGradient) => {
    c.beginPath(); vorm(c);
    c.fillStyle = kleur; c.fill();
    c.strokeStyle = kleur; c.lineWidth = 2 * uit; c.lineJoin = "round"; c.stroke();
  };
  c.save(); c.translate(0.12, 0.42); laag(RAND, "rgba(60,40,20,.28)"); c.restore();
  laag(RAND, GOUD_DIEP);
  laag(RAND - 0.08, GOUD_DOF);
  laag(RAND - 0.16, CINNABER);
  laag(0.66, GOUD);
  const veld = c.createRadialGradient(midden.x - 1.5, midden.y - 2, 0.5, midden.x, midden.y, ver + 1);
  veld.addColorStop(0, "#6a1410"); veld.addColorStop(1, "#3a0708");
  laag(0.6, veld);
  for (const g of bord.gaten) {
    vul(c, (q) => q.arc(g.x, g.y, 0.32, 0, Math.PI * 2), GOUD_DOF);
    vul(c, (q) => q.arc(g.x, g.y - 0.03, 0.24, 0, Math.PI * 2), "#1b0506");
  }
  for (const s of [...bord.stenen].sort((a, b) => a.y - b.y)) {
    const kl = STEEN_LAK[((s.speler % 6) + 6) % 6];
    vul(c, (q) => q.arc(s.x + 0.05, s.y + 0.1, 0.4, 0, Math.PI * 2), "rgba(0,0,0,.5)");
    const g = c.createRadialGradient(s.x - 0.14, s.y - 0.16, 0.03, s.x, s.y, 0.4);
    g.addColorStop(0, kl.glans); g.addColorStop(0.5, kl.kleur); g.addColorStop(1, kl.kleur);
    vul(c, (q) => q.arc(s.x, s.y, 0.4, 0, Math.PI * 2), g);
  }
  c.restore();
  schrijf(p, { tekst, x: 0, y: naamY, b: w - 0.7, h: naamH, grootste: 0.72, uitlijnen: "midden", vulling: "kobalt" });
}

const GOUD_DRAAK: DraakVerf = { vlak: GOUD_DOF, kop: GOUD, fijn: "#3a2408", oog: LAK, pupil: GOUD, parel: "#f6d68a" };
const GOUD_DRAAK_DOF: DraakVerf = { vlak: "#8f6c2c", kop: "#a8843a", fijn: "#24170a", oog: LAK, pupil: GOUD_DOF, parel: "#b8944a" };
// De parel in het rood van de draak: in goud las hij op een klein scherm als een punt voor het woord (". Play", taak 206).
const ROOD_DRAAK: DraakVerf = { vlak: "#c3301f", kop: "#d03a24", fijn: "#6e130c", oog: "#3a0a06", pupil: GOUD, parel: "#d8553a" };

function roodLak(p: P, spec: PlaatInvoer) {
  const { c, b: w, d } = p;
  // Gesneden rood lak: een ruitjesgrond, wolken, de draak en de letters in bladgoud. Zonder tekst (de lakknop van de Speluitleg
  // en de Dagelijkse puzzel als er nog niets te doen is) een doffe, effen plaat: geen draak en geen wolken, zodat hij niet als een
  // knop zonder opschrift oogt (council, taak 168).
  const leeg = !spec.zonderTekst && !(spec.teksten[0] ?? "").trim();
  vul(c, (k) => k.rect(-w / 2 - 0.05, -d / 2 - 0.05, w + 0.1, d + 0.1), "#7f180f");
  c.save(); c.beginPath(); kader(c, w, d, 0.2, 0.05); c.clip();
  const lijnen = (k: Ctx) => { for (let v = -w; v < w; v += 0.15) { k.moveTo(v - d, -d); k.lineTo(v + d, d); k.moveTo(v + d, -d); k.lineTo(v - d, d); } };
  streek(c, lijnen, "#681109", 0.04);
  streek(c, lijnen, "#9a2116", 0.026);
  c.restore();
  // De rand, een verhoogde baan met een schaduw ernaast en een lichte kant.
  streek(c, (k) => kader(k, w, d, 0.13, 0.08), "rgba(40,6,3,.7)", 0.17);
  streek(c, (k) => kader(k, w, d, 0.13, 0.08), CINNABER, 0.13);
  streek(c, (k) => kader(k, w, d, 0.1, 0.08), "rgba(255,150,120,.35)", 0.012);
  streek(c, (k) => kader(k, w, d, 0.27, 0.04), "rgba(40,6,3,.6)", 0.05);
  streek(c, (k) => kader(k, w, d, 0.27, 0.04), "#a52618", 0.035);
  if (leeg) {
    vul(c, (k) => kader(k, w, d, 0.13, 0.08), "rgba(28,4,2,.42)");
    return;
  }
  // Taak 206: een tweede regel over de hele breedte onderaan, die zegt wat de knop doet (Play: op deze telefoon). De draak en het
  // woord schuiven dan naar boven. Zonder tweede regel is de plaat zoals eerst.
  const onder = spec.teksten[1];
  c.save(); c.beginPath(); kader(c, w, d, 0.3, 0.04); c.clip();
  const wolken = onder
    ? (k: Ctx) => { wolkje(k, X(p, -2.6), -0.82, 0.36, S(p, 1)); wolkje(k, X(p, 2.6), -0.86, 0.3, S(p, 1)); }
    : (k: Ctx) => { wolkje(k, X(p, -2.6), -0.82, 0.4, S(p, 1)); wolkje(k, X(p, -0.1), 0.9, 0.36, S(p, -1)); wolkje(k, X(p, 2.55), 0.92, 0.34, S(p, -1)); wolkje(k, X(p, 2.6), -0.86, 0.3, S(p, 1)); wolkje(k, X(p, -2.45), 0.98, 0.26, S(p, 1)); };
  c.save(); c.translate(0.02, 0.03); streek(c, wolken, "rgba(40,6,3,.6)", 0.065); c.restore();
  streek(c, wolken, "#a82919", 0.065);
  // De draak iets verder van het woord: zijn parel stond er vlak voor en las als een punt (". Play", taak 206).
  // Taak 237: een lang woord krijgt een kleinere draak aan de rand en meer breedte (`roodIndeling`).
  const woord = spec.teksten[0] ?? "";
  const ind = onder ? roodIndeling(p, woord, 1.0, 0.95, [0.58, 0.48, 0.4, 0.32], -0.3) : roodIndeling(p, woord, 1.8, 1.3, [0.76, 0.62, 0.5, 0.4], 0.02);
  tekenDraak(c, X(p, ind.draakX), ind.draakY, ind.schaal, p.rtl, ROOD_DRAAK, "rgba(30,4,2,.7)");
  c.restore();
  if (onder) {
    schrijf(p, { tekst: woord, x: X(p, ind.tekstX), y: -0.42, b: ind.tekstB, h: 1.0, grootste: 0.95, uitlijnen: "midden", vulling: "goud" });
    streek(c, (k) => { k.moveTo(-2.4, 0.28); k.lineTo(2.4, 0.28); }, "rgba(242,196,102,.45)", 0.02);
    schrijf(p, { tekst: onder, x: 0, y: 0.66, b: 5.3, h: 0.76, grootste: 0.6, uitlijnen: "midden", vulling: "goud" });
  } else {
    schrijf(p, { tekst: woord, x: X(p, ind.tekstX), y: 0.0, b: ind.tekstB, h: 1.8, grootste: 1.3, uitlijnen: "midden", vulling: "goud" });
  }
}

/**
 * Taak 237: de tekst op een lakplaat is in elke taal minstens zo groot als op een plaat van porselein van dezelfde breedte
 * (`pastIn` met de hele breedte en grootste 0,52). Past een woord niet naast de draak, dan wordt de draak kleiner en gaat hij
 * naar de rand, zodat de tekst breder wordt. Helpt dat niet genoeg (Tamil, Malayalam), dan staat de draak achter de tekst:
 * rood op rood, de gouden letters blijven eroverheen te lezen. Alles in eenheden, links gezien (`X` spiegelt).
 */
function roodIndeling(p: P, woord: string, hoogte: number, grootste: number, schalen: number[], draakY: number) {
  const w = p.b;
  const ondergrens = pastIn(p, woord, w - 0.6, hoogte, 0.52).grootte;
  // De draak is op schaal s ongeveer 3,6 s breed: 1,78 s links en 1,84 s rechts van zijn plek.
  const kies = (schaal: number, vol: boolean) => {
    const draakX = -(w / 2 - 0.45) + 1.78 * schaal;
    const van = vol ? -(w / 2 - 0.3) : draakX + 1.84 * schaal + 0.1, tot = w / 2 - 0.3;
    return { schaal, draakX, draakY, tekstX: (van + tot) / 2, tekstB: tot - van };
  };
  for (const s of schalen) {
    const k = kies(s, false);
    if (pastIn(p, woord, k.tekstB, hoogte, grootste).grootte >= ondergrens - 1e-6) return k;
  }
  return kies(schalen[schalen.length - 1], true);
}
const X = (p: P, x: number) => spiegelX(p, x);
const S = (p: P, k: number) => (p.rtl ? -k : k);

function zwartMetDraak(p: P, spec: PlaatInvoer) {
  const { c, b: w, d } = p;
  zwartLak(p, w, d);
  const onder = spec.teksten[1];
  if (onder) {
    // Taak 206 (council ronde 4): dezelfde opbouw als de rode plaat, "Play" met de plek eronder over de hele breedte, en een
    // kleinere draak in dof goud. Zo begint ook deze plaat met het werkwoord en blijft de rode plaat de blikvanger.
    // Draak boven de lijn, tekst in dof goud: de rode plaat blijft de blikvanger (council ronde 5).
    tekenDraak(c, X(p, 1.45), -0.46, 0.52, !p.rtl, GOUD_DRAAK_DOF, "rgba(0,0,0,.8)");
    // "Play" in elke taal duidelijk kleiner dan op de rode plaat: een vast maximum hielp niet in schriften die het vak al
    // kleiner maakt (Arabisch, Thai, Tamil; council ronde 7 en 8). Rood gebruikt hetzelfde vak (2,8 bij 1,0, tot 0,95).
    const woord = spec.teksten[0] ?? "";
    const rood = pastIn(p, woord, 2.8, 1.0, 0.95).grootte;
    schrijf(p, { tekst: woord, x: X(p, -1.3), y: -0.42, b: 2.8, h: 1.0, grootste: Math.min(0.62, 0.78 * rood), uitlijnen: "midden", vulling: "goudDof" });
    streek(c, (k) => { k.moveTo(-2.4, 0.28); k.lineTo(2.4, 0.28); }, "rgba(201,162,78,.4)", 0.02);
    schrijf(p, { tekst: onder, x: 0, y: 0.66, b: 5.3, h: 0.76, grootste: 0.6, uitlijnen: "midden", vulling: "goudDof" });
    return;
  }
  tekenDraak(c, X(p, 1.28), 0.02, 0.86, !p.rtl, GOUD_DRAAK, "rgba(0,0,0,.8)");
  schrijf(p, { tekst: spec.teksten[0] ?? "", x: X(p, -1.5), y: 0.0, b: 2.4, h: 1.9, grootste: 0.86, uitlijnen: "midden", vulling: "goud" });
}

/** De lakkleuren van de Stenen op het 3D-bord (`steen::lak`) met de kleur van het teken erop. */
const STEEN_LAK = [
  { kleur: "#c41d0a", glans: "#f2705a", inkt: "#ffffff" },
  { kleur: "#0b1590", glans: "#5a68e6", inkt: "#ffffff" },
  { kleur: "#62f2d6", glans: "#d4fff4", inkt: "#10241f" },
  { kleur: "#ffde24", glans: "#fff6b0", inkt: "#3a2a00" },
  { kleur: "#d2a0fa", glans: "#f3e2ff", inkt: "#2a1745" },
  { kleur: "#0b0d10", glans: "#4a5058", inkt: "#ffffff" },
] as const;

/** Een Steen van boven gezien op een plaat (taak 179): een schijf van lak met een gouden bies en het teken van zijn Speler. */
function steenOpPlaat(p: P, speler: number, x: number, y: number, r: number) {
  const { c } = p;
  const k = STEEN_LAK[((speler % 6) + 6) % 6];
  vul(c, (q) => { q.moveTo(x + r + 0.04, y + 0.07); q.arc(x + 0.04, y + 0.07, r, 0, Math.PI * 2); }, "rgba(0,0,0,.55)");
  const g = c.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.08, x, y, r);
  g.addColorStop(0, k.glans); g.addColorStop(0.45, k.kleur); g.addColorStop(1, k.kleur);
  vul(c, (q) => { q.moveTo(x + r, y); q.arc(x, y, r, 0, Math.PI * 2); }, g);
  streek(c, (q) => { q.moveTo(x + r * 0.84, y); q.arc(x, y, r * 0.84, 0, Math.PI * 2); }, GOUD_DOF, 0.03);
  // Het teken op de kop (▲ ■ ● ◆ ✚ ○, zoals `TEKENS` in steen.ts), met paden van Canvas zelf zodat het ook zonder Path2D werkt.
  const u = r * 0.62;
  c.fillStyle = k.inkt;
  c.beginPath();
  switch (((speler % 6) + 6) % 6) {
    case 0: c.moveTo(x, y - u * 1.05); c.lineTo(x + u, y + u * 0.75); c.lineTo(x - u, y + u * 0.75); break;
    case 1: c.roundRect(x - u * 0.82, y - u * 0.82, u * 1.64, u * 1.64, u * 0.15); break;
    case 2: c.moveTo(x + u * 0.9, y); c.arc(x, y, u * 0.9, 0, Math.PI * 2); break;
    case 3: c.moveTo(x, y - u * 1.1); c.lineTo(x + u * 0.95, y); c.lineTo(x, y + u * 1.1); c.lineTo(x - u * 0.95, y); break;
    case 4: { const a = u * 0.32, b = u * 1.0; c.moveTo(x - a, y - b); c.lineTo(x + a, y - b); c.lineTo(x + a, y - a); c.lineTo(x + b, y - a); c.lineTo(x + b, y + a); c.lineTo(x + a, y + a); c.lineTo(x + a, y + b); c.lineTo(x - a, y + b); c.lineTo(x - a, y + a); c.lineTo(x - b, y + a); c.lineTo(x - b, y - a); c.lineTo(x - a, y - a); break; }
    default: c.moveTo(x + u * 0.9, y); c.arc(x, y, u * 0.9, 0, Math.PI * 2); c.moveTo(x + u * 0.42, y); c.arc(x, y, u * 0.42, 0, Math.PI * 2, true);
  }
  c.closePath();
  c.fill("evenodd");
}

function naamplaat(p: P, spec: PlaatInvoer) {
  zwartLak(p, p.b, p.d);
  if (spec.speler !== undefined && spec.maat) {
    naamplaatVrij(p, spec.speler, spec.teksten[0] ?? "", spec.teksten[1], spec.wissel);
    return;
  }
  if (spec.speler === undefined) {
    schrijf(p, { tekst: spec.teksten[0] ?? "", x: 0, y: 0.02, b: 3.3, h: 1.0, grootste: 0.6, uitlijnen: "begin", vulling: "goud" });
    return;
  }
  // De plaat van een Speler in het Potje: zijn Steen aan het begin, dan zijn naam, en eventueel zijn Rating eronder. Een naam zonder
  // spaties mag tussen twee tekens breken (taak 235): anders werd "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW" van 30 tekens onleesbaar klein.
  steenOpPlaat(p, spec.speler, spiegelX(p, -1.72), 0, 0.58);
  const rating = spec.teksten[1];
  schrijf(p, { tekst: spec.teksten[0] ?? "", x: spiegelX(p, 0.5), y: rating ? -0.16 : 0.02, b: 2.5, h: rating ? 0.9 : 1.1, grootste: 0.6, uitlijnen: "begin", vulling: "goud", breekWoord: true });
  if (rating) schrijf(p, { tekst: rating, x: spiegelX(p, 0.5), y: 0.56, b: 2.5, h: 0.5, grootste: 0.34, uitlijnen: "begin", vulling: "goud" });
}

/**
 * De naamplaat van een Speler in een eigen maat (taak 193, zes Spelers): de Steen aan de beginkant van de taal en de naam op
 * hoogstens twee regels. Een naam zonder spaties mag tussen twee tekens breken: de hele naam staat er altijd, nooit afgekapt.
 */
function naamplaatVrij(p: P, speler: number, naam: string, onder?: string, wissel = false) {
  const { b, d } = p;
  const r = Math.min(0.58, d * 0.3);
  const sx = -b / 2 + 0.24 + r;
  steenOpPlaat(p, speler, spiegelX(p, sx), 0, r);
  // Een plaat die een tik wisselt (taak 235): een klein wisselteken aan het eind, en de tekst blijft ervoor.
  const teken = 0.46;
  if (wissel) icoon(p, "wissel", spiegelX(p, b / 2 - 0.24 - teken / 2), 0, teken, GOUD_LICHT, 2);
  const van = sx + r + 0.14, tot = b / 2 - 0.26 - (wissel ? teken + 0.12 : 0);
  const x = spiegelX(p, (van + tot) / 2);
  if (!onder) {
    schrijf(p, { tekst: naam, x, y: 0.02, b: tot - van, h: d - 0.36, grootste: 0.6, uitlijnen: "begin", vulling: "goud", breekWoord: true });
    return;
  }
  // Een tweede, kleinere regel (keuzescherm: Computer met zijn niveau eronder).
  const binnen = d - 0.36;
  schrijf(p, { tekst: naam, x, y: -binnen * 0.2, b: tot - van, h: binnen * 0.56, grootste: 0.6, uitlijnen: "begin", vulling: "goud" });
  schrijf(p, { tekst: onder, x, y: binnen * 0.29, b: tot - van, h: binnen * 0.38, grootste: 0.44, uitlijnen: "begin", vulling: "goudDof" });
}

/** Het jade plaatje dat aanwijst wie aan de beurt is (taak 179): jade met aderen, donkergroene letters, en bij een Denktijd een balkje dat leegloopt. */
function jade(p: P, spec: PlaatInvoer) {
  const { c, b: w, d } = p;
  const kans = kansMaker(p.zaad);
  vul(c, (k) => k.rect(-w / 2 - 0.05, -d / 2 - 0.05, w + 0.1, d + 0.1), "#9fcfae");
  const gl = c.createLinearGradient(-w / 2, -d / 2, w / 2, d / 2);
  gl.addColorStop(0, "#d7efdc"); gl.addColorStop(0.5, "#b2dbbd"); gl.addColorStop(1, "#86bb9a");
  vul(c, (k) => kader(k, w, d, 0, 0.12), gl);
  // Aderen in de steen: zachte, lichte en donkere strepen.
  for (let i = 0; i < 9; i++) {
    const y0 = (kans() - 0.5) * d, hoek = (kans() - 0.5) * 0.5;
    c.beginPath(); c.moveTo(-w / 2, y0); c.bezierCurveTo(-w / 4, y0 + hoek, w / 4, y0 - hoek, w / 2, y0 + hoek * 0.6);
    c.strokeStyle = i % 2 ? "rgba(255,255,255,.28)" : "rgba(40,100,70,.18)"; c.lineWidth = 0.02 + kans() * 0.03; c.stroke();
  }
  streek(c, (k) => kader(k, w, d, 0.07, 0.1), "rgba(255,255,255,.55)", 0.02);
  streek(c, (k) => kader(k, w, d, 0.02, 0.12), "rgba(30,80,58,.55)", 0.04);
  const tijd = spec.tijd;
  const klok = tijd?.klok;
  const balk = tijd !== undefined;
  const tekstB = klok ? w - 1.55 : w - 0.7;
  const tekstX = klok ? spiegelX(p, -0.45) : 0;
  schrijf(p, { tekst: spec.teksten[0] ?? "", x: tekstX, y: balk ? -0.08 : 0, b: tekstB, h: balk ? 0.66 : 0.8, grootste: 0.44, uitlijnen: "midden", vulling: "jade" });
  if (klok) schrijf(p, { tekst: klok, x: spiegelX(p, w / 2 - 0.62), y: -0.08, b: 0.8, h: 0.5, grootste: 0.36, uitlijnen: "midden", vulling: "jade" });
  if (balk) {
    // Het balkje: een groef met het deel dat nog over is, vanaf de beginkant van de taal.
    const lengte = w - 0.8, y = d / 2 - 0.2;
    const rest = Math.max(0, Math.min(1, tijd!.rest));
    streek(c, (k) => { k.moveTo(-lengte / 2, y); k.lineTo(lengte / 2, y); }, "rgba(30,80,58,.35)", 0.07);
    if (rest > 0) streek(c, (k) => { const van = spiegelX(p, -lengte / 2); k.moveTo(van, y); k.lineTo(van + spiegelX(p, lengte * rest), y); }, "#1e5a3f", 0.07);
  }
}

function lade(p: P, spec: PlaatInvoer) {
  const { c, b: w, d } = p;
  vul(c, (k) => k.rect(-w / 2 - 0.05, -d / 2 - 0.05, w + 0.1, d + 0.1), LAK);
  const gl = c.createLinearGradient(-w / 2, -d / 2, w / 2, d / 2);
  gl.addColorStop(0, "rgba(120,100,90,.2)"); gl.addColorStop(0.4, "rgba(60,50,45,.04)"); gl.addColorStop(1, "rgba(0,0,0,0)");
  vul(c, (k) => kader(k, w, d, 0, 0.1), gl);
  streek(c, (k) => kader(k, w, d, 0.1, 0.06), GOUD_DOF, 0.014);
  // Het bovenste deel blijft leeg: daar komen de stangen en kralen van het telraam (taak 178).
  [0, 1].forEach((i) => {
    const mid = (i ? 1 : -1) * (w / 4);
    const ic = spec.pictogrammen?.[i];
    // Een deel dat uit staat, is dof en heeft een streep door het pictogram (taak 206): de stand is te lezen zonder te tikken.
    const uit = spec.aan?.[i] === false;
    // Het woord blijft goed leesbaar (anders lijkt de schakelaar onbruikbaar); het pictogram is doffer en heeft de streep.
    const ix = X(p, mid - 1.35);
    c.save();
    if (uit) c.globalAlpha = 0.4;
    if (ic) icoon(p, ic, ix, 0.54, 0.62, GOUD, 2.0);
    c.restore();
    if (uit) streek(c, (k) => { k.moveTo(ix - 0.32, 0.22); k.lineTo(ix + 0.32, 0.86); }, GOUD, 0.075);
    c.save();
    if (uit) c.globalAlpha = 0.62;
    schrijf(p, { tekst: spec.teksten[i] ?? "", x: X(p, mid + 0.35), y: 0.54, b: 2.6, h: 0.72, grootste: 0.48, uitlijnen: "midden", vulling: "goud" });
    c.restore();
  });
}

/** De naamplaat van het Startmenu: "Leapstone" in goud (de naam, in elke taal hetzelfde), een gouden lijn en de ondertitel in de taal van de Speler. */
function titel(p: P, spec: PlaatInvoer) {
  const { c, b: w, d } = p;
  zwartLak(p, w, d);
  // De ondertitel is het enige dat zegt welk spel dit is: groter dan eerst (0,42), de rest schuift iets omhoog (taak 206).
  streek(c, (k) => { k.moveTo(-2.9, 0.3); k.lineTo(2.9, 0.3); }, GOUD_DOF, 0.02);
  for (const x of [-3.15, 3.15]) vul(c, (k) => { k.moveTo(x + 0.09, 0.3); k.arc(x, 0.3, 0.09, 0, Math.PI * 2); }, GOUD_DOF);
  schrijf(p, { tekst: "Leapstone", x: 0, y: -0.48, b: 6.6, h: 1.15, grootste: 1.05, uitlijnen: "midden", vulling: "goud" });
  schrijf(p, { tekst: spec.teksten[0] ?? "", x: 0, y: 0.82, b: 6.6, h: 0.8, grootste: 0.58, uitlijnen: "midden", vulling: "goud" });
}

/**
 * Messing met een gegraveerd pictogram (My games). Met een tekst (taak 206) een plaatje met het pictogram boven de naam; zonder
 * tekst de ronde schijf van eerst.
 */
function messing(p: P, spec: PlaatInvoer) {
  const tekst = spec.teksten[0];
  if (tekst) return messingPlaat(p, spec, tekst);
  const { c, b: w } = p;
  const r = w / 2;
  const gr = c.createRadialGradient(-r * 0.35, -r * 0.4, 0.05, 0, 0, r * 1.05);
  gr.addColorStop(0, "#f4dc9a"); gr.addColorStop(0.55, "#d2ad5e"); gr.addColorStop(1, "#9c7a35");
  vul(c, (k) => k.rect(-w / 2 - 0.05, -w / 2 - 0.05, w + 0.1, w + 0.1), gr);
  // Gedraaide ringen, zoals op een munt.
  for (const [s, k] of [[0.93, "rgba(90,62,20,.55)"], [0.82, "rgba(255,240,200,.35)"], [0.79, "rgba(90,62,20,.45)"]] as const) {
    streek(c, (q) => { q.moveTo(r * s, 0); q.arc(0, 0, r * s, 0, Math.PI * 2); }, k, 0.035);
  }
  const ic = spec.pictogrammen?.[0];
  if (ic) {
    icoon(p, ic, 0.03, 0.04, 1.05, "#fff4d0", 2.2); // de lichte kant van de gravure
    icoon(p, ic, 0, 0, 1.05, "#4a3210", 2.2);
  }
}

function messingPlaat(p: P, spec: PlaatInvoer, tekst: string) {
  const { c, b: w, d } = p;
  const gr = c.createRadialGradient(-w * 0.25, -d * 0.35, 0.05, 0, 0, w * 0.7);
  gr.addColorStop(0, "#f4dc9a"); gr.addColorStop(0.55, "#d2ad5e"); gr.addColorStop(1, "#9c7a35");
  vul(c, (k) => k.rect(-w / 2 - 0.05, -d / 2 - 0.05, w + 0.1, d + 0.1), gr);
  for (const [inzet, k] of [[0.08, "rgba(90,62,20,.55)"], [0.17, "rgba(255,240,200,.35)"], [0.2, "rgba(90,62,20,.45)"]] as const) {
    streek(c, (q) => kader(q, w, d, inzet, 0.2), k, 0.035);
  }
  // Past de naam niet op één regel ("Meine Partien", Tamil), dan gaat hij op twee regels en wordt het pictogram kleiner,
  // zoals op porselein: de naam krimpt niet (council, taak 206).
  const ic = spec.pictogrammen?.[0];
  const tb = w - 0.5;
  const een = pastIn(p, tekst, tb, 0.86, 0.62);
  const twee = een.regels.length > 1 || een.grootte < 0.54;
  const [iy, im] = twee ? [-0.74, 0.54] : [-0.5, 0.82];
  if (ic) {
    icoon(p, ic, 0.03, iy + 0.04, im, "#fff4d0", 2.2);
    icoon(p, ic, 0, iy, im, "#4a3210", 2.2);
  }
  if (twee) schrijf(p, { tekst, x: 0, y: 0.32, b: tb, h: 1.4, grootste: 0.56, uitlijnen: "midden", vulling: "messing" });
  else schrijf(p, { tekst, x: 0, y: 0.52, b: tb, h: 0.86, grootste: 0.62, uitlijnen: "midden", vulling: "messing" });
}

/**
 * De keuzebalk (zwart lak, zoals een naamplaat): het kopje in goud in de kolom aan de beginkant (`BALK_KOP`), met een fijne gouden
 * lijn erachter. De toetsen zijn eigen voorwerpen die op de rest van de balk liggen.
 */
function balk(p: P, spec: PlaatInvoer) {
  const { b: w, d } = p;
  zwartLak(p, w, d);
  const scheid = -w / 2 + BALK_KOP;
  streek(p.c, (k) => { k.moveTo(spiegelX(p, scheid), -d / 2 + 0.36); k.lineTo(spiegelX(p, scheid), d / 2 - 0.36); }, GOUD_DOF, 0.018);
  const van = -w / 2 + 0.3, tot = scheid - 0.18;
  schrijf(p, { tekst: spec.teksten[0] ?? "", x: spiegelX(p, (van + tot) / 2), y: 0.02, b: tot - van, h: d - 0.6, grootste: 0.62, uitlijnen: "begin", vulling: "goud" });
}

/**
 * Een toets van een keuzebalk: porselein met de keuze in het midden. Gekozen (`toetsGekozen`) is kobaltblauw glazuur met crème letters
 * en een gouden lijn, anders wit porselein met kobaltblauwe letters.
 */
function toets(p: P, spec: PlaatInvoer, gekozen = false) {
  const { b: w, d } = p;
  glazuur(p, gekozen);
  if (gekozen) streek(p.c, (k) => kader(k, w, d, 0.12, 0.1), GOUD, 0.03);
  else streek(p.c, (k) => kader(k, w, d, 0.12, 0.1), KOBALT_RAND, 0.022);
  schrijf(p, { tekst: spec.teksten[0] ?? "", x: 0, y: 0.04, b: w - 0.5, h: d - 0.5, grootste: Math.min(0.72, d * 0.38), uitlijnen: "midden", vulling: gekozen ? "creme" : "kobalt" });
}

const PAINTERS: Record<Soort, (p: P, spec: PlaatInvoer) => void> = {
  porselein, rood: roodLak, zwart: zwartMetDraak, naamplaat, lade, titel, messing, jade, balk, toets, toetsGekozen: (p, spec) => toets(p, spec, true),
};

const DOF_LETTER = "#23232a"; // taak 278: donker op middengrijs, contrast ruim boven 4,5 op 1

/**
 * Een plaat die niets doet (taak 231) ligt er dof: de kleuren zijn grijzer en donkerder, zonder dat de plaat van vorm of
 * opschrift verandert. Alleen waar de plaat al getekend is (`source-atop`), dus de vorm blijft precies gelijk.
 */
function dofMaken(c: Ctx, b: number, d: number) {
  c.save();
  c.globalCompositeOperation = "source-atop";
  // Taak 278: bijna dekkend, zodat rode en zwarte lak ook grijs wordt en een uitgezette knop niet meer op een werkende lijkt.
  c.fillStyle = "rgba(172,167,160,.86)";
  c.fillRect(-b / 2 - 1, -d / 2 - 1, b + 2, d + 2);
  c.restore();
}

/** Is deze taal een taal van rechts naar links? */
export function isRtl(taal: string): boolean {
  return TALEN[taal]?.rtl === true;
}

/**
 * Bakt één plaat. De lettertypen van de taal moeten geladen zijn (`laadLetters`); `bakPlaat` doet dat zelf als dat nog niet zo is.
 * Dezelfde invoer geeft dezelfde beeldpunten.
 */
export async function bakPlaat(invoer: PlaatInvoer): Promise<Plaat> {
  await laadLetters(invoer.taal);
  return bakPlaatKlaar(invoer);
}

/** Zoals `bakPlaat`, maar zonder te wachten: de lettertypen zijn al geladen (bak je meer knoppen, laad ze dan één keer). */
export function bakPlaatKlaar(invoer: PlaatInvoer): Plaat {
  const schaal = invoer.schaal ?? STANDAARD_SCHAAL;
  const maat = invoer.maat ?? PLAATMATEN[invoer.soort];
  const breedte = Math.round(maat.b * schaal), hoogte = Math.round(maat.d * schaal);
  const doek = maakDoek(breedte, hoogte);
  const c = doek.ctx;
  const rtl = invoer.rtl ?? isRtl(invoer.taal);
  const p: P = { c, s: schaal, rtl, taal: invoer.taal, b: maat.b, d: maat.d, teksten: [], tekst: !invoer.zonderTekst, zaad: zaadVan(invoer.id ?? invoer.soort), dof: invoer.uit === true, later: [] };
  c.setTransform(1, 0, 0, 1, 0, 0);
  c.clearRect(0, 0, breedte, hoogte);
  c.setTransform(breedte / maat.b, 0, 0, hoogte / maat.d, breedte / 2, hoogte / 2);
  PAINTERS[invoer.soort](p, invoer);
  if (invoer.uit) {
    dofMaken(c, maat.b, maat.d);
    for (const teken of p.later ?? []) teken();
  }
  c.setTransform(1, 0, 0, 1, 0, 0);
  const data = doek.beeldpunten();
  const beeldpunten = new Uint8ClampedArray(data.length);
  beeldpunten.set(data);
  return { soort: invoer.soort, taal: invoer.taal, rtl, breedte, hoogte, schaal, beeldpunten, teksten: p.teksten };
}
