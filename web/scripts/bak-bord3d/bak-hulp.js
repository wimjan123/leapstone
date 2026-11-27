// Hulp voor het bakken van texturen in de browser: vier lagen (kleur, hoogte, ruwheid, metaal)
// die samen één materiaal vormen. Alles is zelf getekend (prototype 1b, taak 177; eigen werk, CC0).

export const grijs = (v) => { const g = Math.round(Math.max(0, Math.min(1, v)) * 255); return `rgb(${g},${g},${g})`; };

function doek(w, h) { const c = document.createElement("canvas"); c.width = w; c.height = h; return c.getContext("2d", { willReadFrequently: true }); }

/** Vier doeken met dezelfde maat en dezelfde verschuiving. Hoogte 0,5 is het vlak; ruwheid en metaal 0 tot 1. */
export class Laag {
  constructor(w, h, { ruw = 0.5, kleur = "#000" } = {}) {
    this.w = w; this.h = h;
    this.K = doek(w, h); this.H = doek(w, h); this.R = doek(w, h); this.M = doek(w, h);
    this.K.fillStyle = kleur; this.K.fillRect(0, 0, w, h);
    this.H.fillStyle = grijs(0.5); this.H.fillRect(0, 0, w, h);
    this.R.fillStyle = grijs(ruw); this.R.fillRect(0, 0, w, h);
    this.M.fillStyle = "#000"; this.M.fillRect(0, 0, w, h);
  }
  alle(fn) { for (const c of [this.K, this.H, this.R, this.M]) fn(c); }
  bewaar() { this.alle((c) => c.save()); }
  herstel() { this.alle((c) => c.restore()); }
  knip(pad) { this.alle((c) => { c.beginPath(); pad(c); c.clip(); }); }
  /**
   * Tekent één vorm op de lagen waarvoor een waarde is gegeven.
   * s: { k: kleur, h: hoogte, r: ruwheid, m: metaal, lijn: breedte (anders vullen), zacht: vervaging van de hoogte in beeldpunten,
   *      a: dekking, meng: mengwijze voor de kleur, ah: dekking van de hoogte }
   */
  teken(pad, s) {
    const doe = (c, waarde, vaag, a = 1, meng = null) => {
      if (waarde === undefined || waarde === null) return;
      c.save();
      if (vaag) c.filter = `blur(${vaag}px)`;
      if (meng) c.globalCompositeOperation = meng;
      c.globalAlpha = a;
      const st = typeof waarde === "number" ? grijs(waarde) : waarde;
      c.beginPath(); pad(c);
      if (s.lijn) { c.lineWidth = s.lijn; c.strokeStyle = st; c.lineCap = s.kap || "round"; c.lineJoin = s.join || "round"; c.stroke(); }
      else { c.fillStyle = st; c.fill(s.regel || "nonzero"); }
      c.restore();
    };
    doe(this.K, s.k, s.zachtK, s.a ?? 1, s.meng);
    doe(this.H, s.h, s.zacht, s.ah ?? 1, s.mengH);
    doe(this.R, s.r, s.zachtR, s.ar ?? 1);
    doe(this.M, s.m, 0, s.am ?? 1);
  }
  /** Tekst op de lagen. s als bij teken, plus font, x, y, uitlijnen, tussenruimte (letterSpacing in dezelfde eenheid als het font). */
  tekst(t, x, y, s) {
    const doe = (c, waarde, vaag) => {
      if (waarde === undefined || waarde === null) return;
      c.save();
      if (vaag) c.filter = `blur(${vaag}px)`;
      c.font = s.font; c.textAlign = s.lijnUit || "center"; c.textBaseline = s.basis || "middle";
      if (s.ruimte) c.letterSpacing = s.ruimte;
      const st = typeof waarde === "number" ? grijs(waarde) : waarde;
      if (s.omlijn) { c.lineWidth = s.omlijn; c.strokeStyle = st; c.lineJoin = "round"; c.strokeText(t, x, y); }
      c.fillStyle = st; c.fillText(t, x, y);
      c.restore();
    };
    doe(this.K, s.k); doe(this.H, s.h, s.zacht); doe(this.R, s.r); doe(this.M, s.m);
  }
}

// ---------- Ruis ----------
function hash(x, y, z) { let h = Math.imul(x, 374761393) ^ Math.imul(y, 668265263) ^ Math.imul(z, 2147483647); h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; }
export function ruis(x, y, zaad = 0) {
  const xi = Math.floor(x), yi = Math.floor(y), fx = x - xi, fy = y - yi;
  const sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy);
  const a = hash(xi, yi, zaad), b = hash(xi + 1, yi, zaad), c = hash(xi, yi + 1, zaad), d = hash(xi + 1, yi + 1, zaad);
  return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy;
}
export function fbm(x, y, lagen = 4, zaad = 0) {
  let som = 0, amp = 0.5, tot = 0;
  for (let i = 0; i < lagen; i++) { som += ruis(x, y, zaad + i * 17) * amp; tot += amp; x *= 2.03; y *= 2.03; amp *= 0.5; }
  return som / tot;
}
export function kansMaker(zaad) { let s = zaad >>> 0; return () => { s = (s + 0x6d2b79f5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

// ---------- Van hoogte naar normaal, holte-schaduw en de ORM-kaart ----------
function rood(ctx) { const d = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height).data, f = new Float32Array(d.length / 4); for (let i = 0; i < f.length; i++) f[i] = d[i * 4] / 255; return f; }
function vervaagdDoek(ctx, straal) { const c = doek(ctx.canvas.width, ctx.canvas.height); c.filter = `blur(${straal}px)`; c.drawImage(ctx.canvas, 0, 0); return c; }
function glad(f, w, h) {
  const t = new Float32Array(f.length);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const i = y * w + x; t[i] = (f[y * w + Math.max(0, x - 1)] + 2 * f[i] + f[y * w + Math.min(w - 1, x + 1)]) / 4; }
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const i = y * w + x; f[i] = (t[Math.max(0, y - 1) * w + x] + 2 * t[i] + t[Math.min(h - 1, y + 1) * w + x]) / 4; }
  return f;
}

/**
 * Maakt van een Laag de drie beelden van een materiaal.
 * diepte: hoeveel beeldpunten hoog het hele grijsbereik is. extra(x, y) -> extra hoogte (0..1-schaal) voor fijne korrel.
 * holte: { straal, kracht, kleur } maakt lage plekken donkerder (schaduw in het snijwerk).
 */
export function kaarten(L, { diepte = 16, extra = null, holte = { straal: 6, kracht: 3, kleur: 0.6 }, herhaal = false } = {}) {
  const { w, h } = L;
  const H = rood(L.H);
  if (extra) for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) H[y * w + x] += extra(x, y);
  glad(H, w, h);
  const N = doek(w, h), nd = N.createImageData(w, h);
  const bij = (x, y) => herhaal ? H[((y + h) % h) * w + ((x + w) % w)] : H[Math.max(0, Math.min(h - 1, y)) * w + Math.max(0, Math.min(w - 1, x))];
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const dx = (bij(x + 1, y) - bij(x - 1, y)) * 0.5 * diepte, dy = (bij(x, y + 1) - bij(x, y - 1)) * 0.5 * diepte;
    const l = 1 / Math.hypot(dx, dy, 1), i = (y * w + x) * 4;
    nd.data[i] = (-dx * l * 0.5 + 0.5) * 255; nd.data[i + 1] = (dy * l * 0.5 + 0.5) * 255; nd.data[i + 2] = (l * 0.5 + 0.5) * 255; nd.data[i + 3] = 255;
  }
  N.putImageData(nd, 0, 0);
  // Holte: lager dan de omgeving is donkerder.
  const O = doek(w, h), od = O.createImageData(w, h);
  const R = rood(L.R), M = rood(L.M);
  let ao = null;
  if (holte) {
    const vaag = rood(vervaagdDoek(L.H, holte.straal));
    ao = new Float32Array(w * h);
    for (let i = 0; i < ao.length; i++) ao[i] = Math.max(0, Math.min(1, 1 - Math.max(0, vaag[i] - H[i]) * holte.kracht));
  }
  for (let i = 0; i < w * h; i++) { od.data[i * 4] = (ao ? ao[i] : 1) * 255; od.data[i * 4 + 1] = R[i] * 255; od.data[i * 4 + 2] = M[i] * 255; od.data[i * 4 + 3] = 255; }
  O.putImageData(od, 0, 0);
  if (ao && holte.kleur) {
    const kd = L.K.getImageData(0, 0, w, h);
    for (let i = 0; i < w * h; i++) { const k = 1 - (1 - ao[i]) * holte.kleur; kd.data[i * 4] *= k; kd.data[i * 4 + 1] *= k * (1 - (1 - ao[i]) * 0.08); kd.data[i * 4 + 2] *= k * (1 - (1 - ao[i]) * 0.12); }
    L.K.putImageData(kd, 0, 0);
  }
  return { kleur: L.K.canvas, normaal: N.canvas, orm: O.canvas };
}
