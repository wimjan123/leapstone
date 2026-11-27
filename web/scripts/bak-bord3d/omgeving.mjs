// Rekent de omgevingskaart van het 3D-bord voor (spiegeling en zacht vullicht, taak 177) en zet hem in web/src/bord3d/.
//
//   node web/scripts/bak-bord3d/omgeving.mjs [pad/naar/combination_room_1k.hdr]
//
// Bron: Poly Haven, "Combination Room", 1k, CC0 (https://polyhaven.com/a/combination_room). Zonder pad haalt het
// script hem op in de tijdelijke map. Uit: twee kubuskaarten in RGB9E5 (4 bytes per beeldpunt, little-endian), per zijde
// alle niveaus achter elkaar, zijden in de volgorde +X -X +Y -Y +Z -Z, zoals Bevy en wgpu ze willen:
// - halma_bord3d-omgeving_glans.bin: 128 x 128 per zijde, 8 niveaus. Niveau i is gefilterd met GGX bij ruwheid i / 7
//   (Bevy kiest het niveau zo: `perceptual_roughness * (niveaus - 1)`).
// - halma_bord3d-omgeving_licht.bin: 32 x 32 per zijde, 1 niveau: het licht dat een mat vlak met die normaal krijgt,
//   gedeeld door pi (Bevy vermenigvuldigt alleen met de kleur).
import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { WEB } from "../bord-hulp.mjs";

const BRON = "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/combination_room_1k.hdr";
const pad = process.argv[2] || path.join(tmpdir(), "combination_room_1k.hdr");
if (!existsSync(pad)) {
  const r = await fetch(BRON);
  if (!r.ok) throw new Error(`Ophalen mislukt: ${r.status}`);
  await writeFile(pad, Buffer.from(await r.arrayBuffer()));
}

// ---- Radiance .hdr lezen (RGBE, met run-length-codering per regel).
function leesHdr(buf) {
  let i = 0;
  const regel = () => { let s = ""; while (buf[i] !== 0x0a) s += String.fromCharCode(buf[i++]); i++; return s; };
  for (let r = regel(); r !== ""; r = regel());
  const [, hoog, , breed] = regel().split(" ");
  const B = Number(breed), H = Number(hoog);
  const uit = new Float32Array(B * H * 3);
  const rij = new Uint8Array(B * 4);
  for (let y = 0; y < H; y++) {
    if (buf[i] === 2 && buf[i + 1] === 2) {
      i += 4;
      for (let k = 0; k < 4; k++) for (let x = 0; x < B;) {
        let n = buf[i++];
        if (n > 128) { n -= 128; const v = buf[i++]; while (n--) rij[(x++) * 4 + k] = v; }
        else while (n--) rij[(x++) * 4 + k] = buf[i++];
      }
    } else { rij.set(buf.subarray(i, i + B * 4)); i += B * 4; }
    for (let x = 0; x < B; x++) {
      const e = rij[x * 4 + 3], f = e ? Math.pow(2, e - 136) : 0, o = (y * B + x) * 3;
      uit[o] = rij[x * 4] * f; uit[o + 1] = rij[x * 4 + 1] * f; uit[o + 2] = rij[x * 4 + 2] * f;
    }
  }
  return { B, H, data: uit };
}

/** Een piramide van kleinere versies (box-filter), voor het filteren zonder ruis. */
function piramide(beeld) {
  const p = [beeld];
  while (p.at(-1).H > 4) {
    const a = p.at(-1), B = a.B / 2, H = a.H / 2, d = new Float32Array(B * H * 3);
    for (let y = 0; y < H; y++) for (let x = 0; x < B; x++) for (let k = 0; k < 3; k++) {
      d[(y * B + x) * 3 + k] = (a.data[((2 * y) * a.B + 2 * x) * 3 + k] + a.data[((2 * y) * a.B + 2 * x + 1) * 3 + k] + a.data[((2 * y + 1) * a.B + 2 * x) * 3 + k] + a.data[((2 * y + 1) * a.B + 2 * x + 1) * 3 + k]) / 4;
    }
    p.push({ B, H, data: d });
  }
  return p;
}

/** Straling uit richting d (wereld, y omhoog), zoals three.js een equirectangulaire kaart leest. */
function lees(beeld, d) {
  const u = Math.atan2(d[2], d[0]) / (2 * Math.PI) + 0.5;
  const v = 0.5 - Math.asin(Math.max(-1, Math.min(1, d[1]))) / Math.PI;
  const fx = u * beeld.B - 0.5, fy = Math.max(0, Math.min(beeld.H - 1, v * beeld.H - 0.5));
  const x0 = Math.floor(fx), y0 = Math.floor(fy), tx = fx - x0, ty = fy - y0;
  const y1 = Math.min(beeld.H - 1, y0 + 1);
  const px = (x, y, k) => beeld.data[(y * beeld.B + (((x % beeld.B) + beeld.B) % beeld.B)) * 3 + k];
  return [0, 1, 2].map((k) => (px(x0, y0, k) * (1 - tx) + px(x0 + 1, y0, k) * tx) * (1 - ty) + (px(x0, y1, k) * (1 - tx) + px(x0 + 1, y1, k) * tx) * ty);
}
const leesNiveau = (p, d, niveau) => {
  const n = Math.max(0, Math.min(p.length - 1, niveau)), a = Math.floor(n), t = n - a;
  const x = lees(p[a], d);
  if (t === 0 || a + 1 >= p.length) return x;
  const y = lees(p[a + 1], d);
  return x.map((v, k) => v * (1 - t) + y[k] * t);
};

const norm = (v) => { const l = Math.hypot(...v); return v.map((x) => x / l); };
/** Richting van beeldpunt (u, v) (0 tot 1, v omlaag) op zijde f, zoals wgpu een kubus leest; Bevy keert z om. */
function richting(f, u, v) {
  const s = 2 * u - 1, t = 2 * v - 1;
  const d = [[1, -t, -s], [-1, -t, s], [s, 1, t], [s, -1, -t], [s, -t, 1], [-s, -t, -1]][f];
  return norm([d[0], d[1], -d[2]]);
}

/** RGB9E5: drie getallen met een gedeelde exponent. */
function rgb9e5([r, g, b]) {
  const MAX = 65408, c = (x) => Math.max(0, Math.min(MAX, x));
  const [rc, gc, bc] = [c(r), c(g), c(b)], m = Math.max(rc, gc, bc);
  let e = Math.max(-16, Math.floor(Math.log2(m || 1e-30))) + 1 + 15;
  let schaal = Math.pow(2, e - 15 - 9);
  if (Math.round(m / schaal) === 512) { e++; schaal *= 2; }
  const q = (x) => Math.round(x / schaal);
  return ((q(rc) | (q(gc) << 9) | (q(bc) << 18)) >>> 0) + ((e & 31) * 2 ** 27);
}

// Hammersley-punten en GGX-steekproeven rond de normaal.
const radicaal = (i) => { let b = i; b = ((b << 16) | (b >>> 16)) >>> 0; b = (((b & 0x55555555) << 1) | ((b & 0xaaaaaaaa) >>> 1)) >>> 0; b = (((b & 0x33333333) << 2) | ((b & 0xcccccccc) >>> 2)) >>> 0; b = (((b & 0x0f0f0f0f) << 4) | ((b & 0xf0f0f0f0) >>> 4)) >>> 0; b = (((b & 0x00ff00ff) << 8) | ((b & 0xff00ff00) >>> 8)) >>> 0; return b / 4294967296; };
function assen(n) {
  const op = Math.abs(n[1]) < 0.999 ? [0, 1, 0] : [1, 0, 0];
  const t = norm([op[1] * n[2] - op[2] * n[1], op[2] * n[0] - op[0] * n[2], op[0] * n[1] - op[1] * n[0]]);
  const b = [n[1] * t[2] - n[2] * t[1], n[2] * t[0] - n[0] * t[2], n[0] * t[1] - n[1] * t[0]];
  return [t, b];
}

const hdr = leesHdr(await readFile(pad));
const pir = piramide(hdr);
const telBron = hdr.B * hdr.H;

const GLANS = 128, NIVEAUS = 8, STEEK = 384;
const glans = [];
for (let f = 0; f < 6; f++) {
  for (let niv = 0; niv < NIVEAUS; niv++) {
    const n = GLANS >> niv, ruw = niv / (NIVEAUS - 1), a = ruw * ruw;
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
      const N = richting(f, (x + 0.5) / n, (y + 0.5) / n);
      if (niv === 0) { glans.push(rgb9e5(lees(hdr, N))); continue; }
      const [T, B] = assen(N);
      let som = [0, 0, 0], gewicht = 0;
      for (let i = 0; i < STEEK; i++) {
        const e1 = i / STEEK, e2 = radicaal(i);
        const fi = 2 * Math.PI * e1, cosT = Math.sqrt((1 - e2) / (1 + (a * a - 1) * e2)), sinT = Math.sqrt(1 - cosT * cosT);
        const H = [0, 1, 2].map((k) => T[k] * sinT * Math.cos(fi) + B[k] * sinT * Math.sin(fi) + N[k] * cosT);
        const NdH = cosT, L = [0, 1, 2].map((k) => 2 * NdH * H[k] - N[k]);
        const NdL = L[0] * N[0] + L[1] * N[1] + L[2] * N[2];
        if (NdL <= 0) continue;
        // Kies het niveau van de piramide bij de ruimtehoek van de steekproef (Karis), tegen ruis.
        const d = (NdH * NdH * (a * a - 1) + 1), D = (a * a) / (Math.PI * d * d), pdf = D / 4;
        const hoekSteek = 1 / (STEEK * pdf + 1e-6), hoekBeeld = (4 * Math.PI) / telBron;
        const lvl = 0.5 * Math.log2(hoekSteek / hoekBeeld) + 1;
        const c = leesNiveau(pir, L, lvl);
        som = som.map((v, k) => v + c[k] * NdL); gewicht += NdL;
      }
      glans.push(rgb9e5(som.map((v) => v / gewicht)));
    }
  }
}

const LICHT = 32, klein = pir.find((p) => p.B <= 64);
const licht = [];
for (let f = 0; f < 6; f++) for (let y = 0; y < LICHT; y++) for (let x = 0; x < LICHT; x++) {
  const N = richting(f, (x + 0.5) / LICHT, (y + 0.5) / LICHT);
  let som = [0, 0, 0];
  for (let j = 0; j < klein.H; j++) {
    const th = (j + 0.5) / klein.H * Math.PI, dOmega = (Math.PI / klein.H) * ((2 * Math.PI) / klein.B) * Math.sin(th);
    for (let i = 0; i < klein.B; i++) {
      // Zelfde afbeelding als `lees`: u = atan2(z, x) / 2pi + 0,5, v = 0,5 - asin(y) / pi.
      const ph = ((i + 0.5) / klein.B - 0.5) * 2 * Math.PI, yy = Math.cos(th);
      const r = Math.sin(th), L = [r * Math.cos(ph), yy, r * Math.sin(ph)];
      const c = Math.max(0, L[0] * N[0] + L[1] * N[1] + L[2] * N[2]);
      if (!c) continue;
      const o = (j * klein.B + i) * 3;
      som = som.map((v, k) => v + klein.data[o + k] * c * dOmega);
    }
  }
  licht.push(rgb9e5(som.map((v) => v / Math.PI)));
}

const schrijf = async (naam, lijst) => {
  const b = Buffer.alloc(lijst.length * 4);
  lijst.forEach((v, i) => b.writeUInt32LE(v, i * 4));
  await writeFile(path.join(WEB, "src/bord3d", naam), b);
  console.log(naam, (b.length / 1024).toFixed(0) + " kB");
};
await schrijf("halma_bord3d-omgeving_glans.bin", glans);
await schrijf("halma_bord3d-omgeving_licht.bin", licht);
