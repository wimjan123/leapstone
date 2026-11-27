// Metingen op het getekende 3D-bord voor meet-bord.mjs (taak 177): ΔE00 tussen de zes Stenen (ook bij kleurenblindheid)
// en de beeldtijd tijdens slepen en stilstand. Alle gegevens zijn VOORBEELDGEGEVENS (scripts/nep/nep.js).
import sharp from "sharp";
import { slaap } from "./bord-hulp.mjs";

// ---- Kleur: lineair, CIELAB (D65), CIEDE2000 en de matrices van Machado, Oliveira en Fernandes (2009), ernst 1,0.
const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
export const DEUTERANOPIE = [[0.367322, 0.860646, -0.227968], [0.280085, 0.672501, 0.047413], [-0.01182, 0.04294, 0.968881]];
export const PROTANOPIE = [[0.152286, 1.052583, -0.204868], [0.114503, 0.786281, 0.099216], [-0.003882, -0.048116, 1.051998]];
const toepassen = (m, c) => m.map((r) => Math.min(1, Math.max(0, r[0] * c[0] + r[1] * c[1] + r[2] * c[2])));
export function lab([r, g, b]) {
  const x = 0.4124564 * r + 0.3575761 * g + 0.1804375 * b, y = 0.2126729 * r + 0.7151522 * g + 0.072175 * b, z = 0.0193339 * r + 0.119192 * g + 0.9503041 * b;
  const f = (t) => (t > 216 / 24389 ? Math.cbrt(t) : ((24389 / 27) * t + 16) / 116);
  const [fx, fy, fz] = [f(x / 0.95047), f(y), f(z / 1.08883)];
  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
}
export function de00([L1, a1, b1], [L2, a2, b2]) {
  const rad = Math.PI / 180, Cb = (Math.hypot(a1, b1) + Math.hypot(a2, b2)) / 2, G = 0.5 * (1 - Math.sqrt(Cb ** 7 / (Cb ** 7 + 25 ** 7)));
  const [a1p, a2p] = [(1 + G) * a1, (1 + G) * a2], [C1p, C2p] = [Math.hypot(a1p, b1), Math.hypot(a2p, b2)];
  const hoek = (y, x) => { const h = Math.atan2(y, x) / rad; return h < 0 ? h + 360 : h; };
  const [h1, h2] = [C1p === 0 ? 0 : hoek(b1, a1p), C2p === 0 ? 0 : hoek(b2, a2p)];
  let dh = 0;
  if (C1p * C2p !== 0) { dh = h2 - h1; if (dh > 180) dh -= 360; else if (dh < -180) dh += 360; }
  const dH = 2 * Math.sqrt(C1p * C2p) * Math.sin((dh * rad) / 2), [Lb, Cp] = [(L1 + L2) / 2, (C1p + C2p) / 2];
  let hb = h1 + h2;
  if (C1p * C2p !== 0) hb = Math.abs(h1 - h2) <= 180 ? hb / 2 : hb < 360 ? (hb + 360) / 2 : (hb - 360) / 2;
  const T = 1 - 0.17 * Math.cos((hb - 30) * rad) + 0.24 * Math.cos(2 * hb * rad) + 0.32 * Math.cos((3 * hb + 6) * rad) - 0.2 * Math.cos((4 * hb - 63) * rad);
  const dt = 30 * Math.exp(-(((hb - 275) / 25) ** 2)), Rc = 2 * Math.sqrt(Cp ** 7 / (Cp ** 7 + 25 ** 7));
  const Sl = 1 + (0.015 * (Lb - 50) ** 2) / Math.sqrt(20 + (Lb - 50) ** 2), [Sc, Sh] = [1 + 0.045 * Cp, 1 + 0.015 * Cp * T], Rt = -Math.sin(2 * dt * rad) * Rc;
  const [x, y, z] = [(L2 - L1) / Sl, (C2p - C1p) / Sc, dH / Sh];
  return Math.sqrt(x * x + y * y + z * z + Rt * y * z);
}
const hex = (c) => "#" + c.map((v) => Math.round(255 * (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055)).toString(16).padStart(2, "0")).join("");

/** De mediaan per kanaal (lineair): het lak zelf, zonder het teken en de gouden bies (die zijn een minderheid). */
const mediaan = (lijst) => [0, 1, 2].map((k) => { const v = lijst.map((c) => c[k]).sort((a, b) => a - b); return v[Math.floor(v.length / 2)] ?? 0; });

/** Een schermafdruk als functie (x, y) in CSS-pixels -> lineaire kleur. */
export async function beeld(p, dpr) {
  const { data, info } = await sharp(await p.screenshot({ type: "png" })).raw().toBuffer({ resolveWithObject: true });
  return (x, y) => { const i = (Math.round(y * dpr) * info.width + Math.round(x * dpr)) * info.channels; return [lin(data[i] / 255), lin(data[i + 1] / 255), lin(data[i + 2] / 255)]; };
}

/** Is `c` het lege bord `b` (gelijk, of alleen donkerder: een schaduw)? */
function bord(c, b) {
  const bb = b[0] * b[0] + b[1] * b[1] + b[2] * b[2], k = bb > 1e-9 ? (c[0] * b[0] + c[1] * b[1] + c[2] * b[2]) / bb : 0;
  const rest = Math.hypot(c[0] - k * b[0], c[1] - k * b[1], c[2] - k * b[2]), maat = Math.max(Math.hypot(...c), 0.004);
  return Math.hypot(c[0] - b[0], c[1] - b[1], c[2] - b[2]) < 0.004 || (k <= 1.05 && rest / maat < 0.2);
}

/**
 * De kleur van elke Steen op de render. Waar een Steen kan staan, zegt het bord zelf (`wijs`: welke Steen raakt dit punt);
 * die omtrek is wat ruimer dan de Steen. Een beeldpunt telt alleen als het anders is dan op het lege bord (`leeg`, een
 * schermafdruk zonder Stenen) en geen schaduw is. Kop: het bovenste 45 procent daarvan; zijkant: de rest. Per stuk de
 * mediaan, zodat het teken en de gouden bies niet meetellen. Hele Steen: het gemiddelde van kop en zijkant, in lineair
 * licht. Geeft per Speler het gemiddelde van al zijn Stenen. Schermafdruk op echte schermdichtheid.
 */
export async function steenKleuren(p, sessie, leeg) {
  const px = await beeld(p, sessie.dpr);
  const vormen = await p.evaluate(() => {
    const st = Array.from(window.__stand ?? []);
    const uit = [];
    for (const [vak, speler] of st.entries()) {
      if (speler < 0) continue;
      const [gx, gy] = __geo.gat(window.__pi ?? 0, vak);
      const punten = [];
      for (let y = gy - 40; y <= gy + 14; y += 1) for (let x = gx - 24; x <= gx + 24; x += 1) if (__halmaBord3d.wijs(x, y, -1, 0)[3] === vak) punten.push([x, y]);
      uit.push({ vak, speler, punten });
    }
    return uit;
  });
  const perSpeler = new Map();
  for (const v of vormen) {
    const punten = v.punten.filter((q) => !bord(px(...q), leeg(...q)));
    if (punten.length < 30) continue;
    const ys = punten.map((q) => q[1]), y0 = Math.min(...ys), y1 = Math.max(...ys), h = y1 - y0;
    const kop = mediaan(punten.filter((q) => q[1] <= y0 + 0.45 * h).map((q) => px(...q)));
    const zij = mediaan(punten.filter((q) => q[1] > y0 + 0.45 * h).map((q) => px(...q)));
    const lijst = perSpeler.get(v.speler) ?? [];
    lijst.push({ kop, zij });
    perSpeler.set(v.speler, lijst);
  }
  const gem = (l) => [0, 1, 2].map((k) => l.reduce((s, c) => s + c[k], 0) / l.length);
  return [...perSpeler.entries()].sort((a, b) => a[0] - b[0]).map(([speler, l]) => {
    const kop = gem(l.map((s) => s.kop)), zij = gem(l.map((s) => s.zij));
    return { speler, n: l.length, kop, zij, heel: kop.map((c, k) => (c + zij[k]) / 2) };
  });
}

/** Het kleinste ΔE00 over alle paren, normaal en met de twee kleurenblindheden; plus de paren. */
export function verschillen(kleuren, deel) {
  const zicht = { normaal: (c) => c, deuteranopie: (c) => toepassen(DEUTERANOPIE, c), protanopie: (c) => toepassen(PROTANOPIE, c) };
  const uit = {};
  for (const [naam, f] of Object.entries(zicht)) {
    let min = Infinity, paar = null;
    for (let i = 0; i < kleuren.length; i++) for (let j = i + 1; j < kleuren.length; j++) {
      const d = de00(lab(f(kleuren[i][deel])), lab(f(kleuren[j][deel])));
      if (d < min) { min = d; paar = [kleuren[i].speler + 1, kleuren[j].speler + 1]; }
    }
    uit[naam] = { min: Math.round(min * 10) / 10, paar };
  }
  return uit;
}

export const alsHex = (kleuren) => kleuren.map((k) => ({ speler: k.speler + 1, n: k.n, kop: hex(k.kop), zijkant: hex(k.zij), heel: hex(k.heel) }));

/** Een stand met de zes Spelers elk `per` Stenen, verspreid over alle vakken van het bord. */
export function zesSpelers(n, per = 10) {
  const st = new Array(n).fill(-1);
  const stap = n / (6 * per);
  for (let i = 0; i < 6 * per; i++) st[Math.floor(i * stap + stap / 2)] = i % 6;
  return st;
}

/**
 * Beeldtijd: beelden per seconde van Bevy (`beelden()`) over `duur` ms. `stil`: niemand raakt het bord aan; Bevy hoort dan
 * niets te tekenen (0 beelden). Anders sleept een vinger een Steen rond: dan tekent Bevy elk beeld.
 */
export async function beeldtijd(p, raak, { stil, duur = 5000, van, rondje }) {
  if (!stil) {
    await raak("touchStart", van[0], van[1]); await slaap(80);
    await raak("touchMove", van[0] + 20, van[1] - 20); await slaap(300);
  }
  const b0 = await p.evaluate(() => [__halmaBord3d.beelden(), performance.now()]);
  if (stil) await slaap(duur);
  else {
    const begin = Date.now();
    for (let i = 0; Date.now() - begin < duur; i++) {
      const a = (i / 40) * 2 * Math.PI;
      await raak("touchMove", rondje[0] + Math.cos(a) * rondje[2], rondje[1] + Math.sin(a) * rondje[2]);
      await slaap(8);
    }
  }
  const b1 = await p.evaluate(() => [__halmaBord3d.beelden(), performance.now()]);
  if (!stil) { await raak("touchEnd"); await slaap(1500); }
  const beelden = b1[0] - b0[0], ms = b1[1] - b0[1];
  return { beelden, seconden: Math.round(ms) / 1000, fps: Math.round((beelden / ms) * 10000) / 10, msPerBeeld: Math.round((ms / Math.max(1, beelden)) * 100) / 100 };
}

/**
 * Taak 186 en 190: beelden bij knijpen en schuiven. `knijpen`: twee vingers gaan 5 s lang heen en weer (Bevy tekent elk beeld);
 * `ingezoomd stil`: daarna alle vingers los, 5 s lang: Bevy hoort niets te tekenen (0 beelden, geen uitlopen);
 * `schuiven`: één vinger schuift 5 s lang rondjes over een lege plek van het ingezoomde bord.
 *
 * Taak 190 meet ook waar het haperen vandaan komt: per beeld de tijd van de browser (script, stijl en layout, uit CDP
 * `Performance.getMetrics`), hoe vaak een HTML-knop van een voorwerp verschoof, de tijd tussen twee beelden van de pagina
 * (`requestAnimationFrame`: mediaan, p95, grootste, en hoeveel langer dan 25 ms), en of het punt tussen de vingers onder de
 * vingers blijft (`onderVingers`: knijpen terwijl het midden van de vingers verschuift; grootste afwijking in vakken en in px).
 */
export async function beeldtijdZoom(p, raakMeer, raak, midden, { cdp, duur = 5000 } = {}) {
  if (cdp) await cdp.send("Performance.enable");
  const metriek = async () => {
    if (!cdp) return {};
    const { metrics } = await cdp.send("Performance.getMetrics");
    return Object.fromEntries(metrics.map((m) => [m.name, m.value]));
  };
  // In de pagina: de tijd van elk beeld, en hoe vaak de stijl van een HTML-knop van een voorwerp verandert.
  await p.evaluate(() => {
    if (window.__meet) return;
    const m = (window.__meet = { rafs: [], knoppen: 0 });
    const lus = (t) => { m.rafs.push(t); requestAnimationFrame(lus); };
    requestAnimationFrame(lus);
    new MutationObserver((r) => { m.knoppen += r.length; }).observe(document.body, { subtree: true, attributes: true, attributeFilter: ["style"] });
  });
  const tel = async (f) => {
    const m0 = await metriek();
    const b0 = await p.evaluate(() => { __meet.rafs = []; __meet.knoppen = 0; return [__halmaBord3d.beelden(), performance.now()]; });
    await f();
    const b1 = await p.evaluate(() => [__halmaBord3d.beelden(), performance.now(), __meet.rafs.slice(), __meet.knoppen]);
    const m1 = await metriek();
    const beelden = b1[0] - b0[0], ms = b1[1] - b0[1];
    const tussen = b1[2].slice(1).map((t, i) => t - b1[2][i]).sort((a, b) => a - b);
    const q = (f) => (tussen.length ? Math.round(tussen[Math.min(tussen.length - 1, Math.floor(f * tussen.length))] * 10) / 10 : null);
    const perBeeld = (naam) => (cdp ? Math.round((((m1[naam] ?? 0) - (m0[naam] ?? 0)) * 1000) / Math.max(1, beelden) * 100) / 100 : null);
    return {
      beelden, seconden: Math.round(ms) / 1000, fps: Math.round((beelden / ms) * 10000) / 10, msPerBeeld: Math.round((ms / Math.max(1, beelden)) * 100) / 100,
      paginaBeeld: { mediaan: q(0.5), p95: q(0.95), grootste: q(1), boven25: tussen.filter((t) => t > 25).length },
      browserMsPerBeeld: { script: perBeeld("ScriptDuration"), stijl: perBeeld("RecalcStyleDuration"), layout: perBeeld("LayoutDuration"), taken: perBeeld("TaskDuration") },
      knopVerschuivingen: b1[3],
    };
  };
  const [mx, my] = midden;
  await raakMeer("touchStart", [[mx - 30, my], [mx + 30, my]]); await slaap(80);
  const knijpen = await tel(async () => {
    const begin = Date.now();
    for (let i = 0; Date.now() - begin < duur; i++) {
      const d = 30 + 110 * (0.5 - 0.5 * Math.cos((i / 60) * 2 * Math.PI));
      await raakMeer("touchMove", [[mx - d, my], [mx + d, my]]); await slaap(8);
    }
  });
  await raakMeer("touchEnd", []); await slaap(1500);
  const onderVingers = await knijpVolgt(p, raakMeer, midden);
  await slaap(1500);
  // Zeker ingezoomd? Een korte, vaste knijp om het zeker te weten.
  for (let i = 0; i <= 12; i++) { const d = 30 + i * 10; await raakMeer(i === 0 ? "touchStart" : "touchMove", [[mx - d, my], [mx + d, my]]); await slaap(30); }
  await raakMeer("touchEnd", []); await slaap(1500);
  const stil = await tel(() => slaap(duur));
  const [lx, ly] = await p.evaluate(() => {
    for (let y = 250; y < 700; y += 20) for (let x = 60; x < 340; x += 20) { const w = __halmaBord3d.wijs(x, y, -1, 12); if (w[2] < 0 && w[3] < 0 && Number.isFinite(w[0])) return [x, y]; }
    return [195, 450];
  });
  await raak("touchStart", lx, ly); await slaap(80);
  await raak("touchMove", lx + 20, ly + 20); await slaap(200);
  const schuiven = await tel(async () => {
    const begin = Date.now();
    for (let i = 0; Date.now() - begin < duur; i++) {
      const a = (i / 40) * 2 * Math.PI;
      await raak("touchMove", lx + Math.cos(a) * 50, ly + Math.sin(a) * 50); await slaap(8);
    }
  });
  await raak("touchEnd"); await slaap(1500);
  const naSchuiven = await tel(() => slaap(duur));
  return { knijpen, onderVingers, "ingezoomd stil": stil, schuiven, "na schuiven stil": naSchuiven };
}

/**
 * Knijpen terwijl het midden van de vingers verschuift (taak 190): uit het overzicht inzoomen van 60 naar 220 px tussen de vingers,
 * terwijl het midden 70 px opzij en 40 px omhoog gaat, in 40 stappen. Na elke stap: welke plek op het bord ligt nu onder het
 * midden (`wijs`, met de camera van het laatste beeld)? Geeft de grootste afstand tot de plek bij het begin, in vakken en in px op
 * het scherm (gemeten met `wijs` op het eindbeeld). Daarna uitzoomen tot voorbij het overzicht (de grens), ook gemeten.
 */
async function knijpVolgt(p, raakMeer, [mx, my]) {
  const beeld = () => p.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  const plek = (x, y) => p.evaluate(([x, y]) => { const w = __halmaBord3d.wijs(x, y, -1, 0); return [w[0], w[1]]; }, [x, y]);
  const stap = async (i, n, van, naar) => {
    const k = i / n;
    const d = (van.d + (naar.d - van.d) * k) / 2, x = van.x + (naar.x - van.x) * k, y = van.y + (naar.y - van.y) * k;
    await raakMeer(i === 0 ? "touchStart" : "touchMove", [[x - d, y], [x + d, y]]);
    return [x, y];
  };
  const meet = async (van, naar, n = 40) => {
    // De drempel (4 procent) eerst: daarna pas telt het bord mee.
    await stap(0, n, van, naar); await beeld();
    const begin = await plek(van.x, van.y);
    let grootste = 0, laatste = [van.x, van.y], vorigePx = 0, sprong = 0;
    for (let i = 1; i <= n; i++) {
      laatste = await stap(i, n, van, naar); await beeld();
      const nu = await plek(laatste[0], laatste[1]);
      if (!Number.isFinite(nu[0])) continue;
      const af = Math.hypot(nu[0] - begin[0], nu[1] - begin[1]);
      grootste = Math.max(grootste, af);
      // Afwijking in px op het scherm, nu: hoeveel px is één eenheid bij het midden?
      const b = await plek(laatste[0] + 10, laatste[1]);
      const px = af * (10 / Math.max(1e-6, Math.hypot(b[0] - nu[0], b[1] - nu[1])));
      sprong = Math.max(sprong, Math.abs(px - vorigePx));
      vorigePx = px;
    }
    // Hoeveel px is één vak bij het midden, op het eindbeeld?
    const a = await plek(laatste[0], laatste[1]), b = await plek(laatste[0] + 10, laatste[1]);
    const vakPx = 10 / Math.max(1e-6, Math.hypot(b[0] - a[0], b[1] - a[1]));
    await raakMeer("touchEnd", []); await beeld();
    // vakken en px: de grootste afwijking (px op het eindbeeld); sprong: de grootste verandering van die afwijking in één stap (px).
    return { vakken: Math.round(grootste * 1000) / 1000, px: Math.round(grootste * vakPx * 10) / 10, sprong: Math.round(sprong * 10) / 10, vakPx: Math.round(vakPx * 10) / 10 };
  };
  const inzoomen = await meet({ x: mx, y: my, d: 60 }, { x: mx + 70, y: my - 40, d: 220 });
  await slaap(500);
  const uitzoomen = await meet({ x: mx + 70, y: my - 40, d: 220 }, { x: mx, y: my, d: 30 });
  return { inzoomen, uitzoomen };
}
