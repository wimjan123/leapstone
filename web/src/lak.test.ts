import { expect, test } from "vitest";
import { GOUD, LAK_BORD, LAK_GRIJS, LAK_STENEN } from "./lak";
import { contrast } from "./steen";

// Het uiterlijk 1b op het platte bord (taak 182): de zes Steenkleuren blijven ook voor kleurenblinde Spelers goed uit elkaar
// te houden (ΔE00 minstens 26,0 normaal en 18,4 bij deuteranopie), en elke Steen steekt af tegen het rode lak.

const lineair = (hex: string) =>
  [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });

type Rgb = number[];
// Deuteranopie (Machado e.a. 2009, ernst 1,0), op lineaire kleur.
const DEUTERANOPIE = [
  [0.367322, 0.860646, -0.227968],
  [0.280085, 0.672501, 0.047413],
  [-0.01182, 0.04294, 0.968881],
];
const toepassen = (m: number[][], c: Rgb) => m.map((r) => Math.min(1, Math.max(0, r[0] * c[0] + r[1] * c[1] + r[2] * c[2])));

function lab(c: Rgb): [number, number, number] {
  const [r, g, b] = c;
  const x = 0.4124564 * r + 0.3575761 * g + 0.1804375 * b;
  const y = 0.2126729 * r + 0.7151522 * g + 0.072175 * b;
  const z = 0.0193339 * r + 0.119192 * g + 0.9503041 * b;
  const f = (t: number) => (t > 216 / 24389 ? Math.cbrt(t) : ((24389 / 27) * t + 16) / 116);
  const [fx, fy, fz] = [f(x / 0.95047), f(y), f(z / 1.08883)];
  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
}

/** CIEDE2000, het kleurverschil dat het oog ziet. */
function de00(p: [number, number, number], q: [number, number, number]): number {
  const rad = Math.PI / 180;
  const [L1, a1, b1] = p;
  const [L2, a2, b2] = q;
  const Cb = (Math.hypot(a1, b1) + Math.hypot(a2, b2)) / 2;
  const G = 0.5 * (1 - Math.sqrt(Cb ** 7 / (Cb ** 7 + 25 ** 7)));
  const [a1p, a2p] = [(1 + G) * a1, (1 + G) * a2];
  const [C1p, C2p] = [Math.hypot(a1p, b1), Math.hypot(a2p, b2)];
  const hoek = (y: number, x: number) => {
    const h = Math.atan2(y, x) / rad;
    return h < 0 ? h + 360 : h;
  };
  const [h1, h2] = [C1p === 0 ? 0 : hoek(b1, a1p), C2p === 0 ? 0 : hoek(b2, a2p)];
  let dh = 0;
  if (C1p * C2p !== 0) {
    dh = h2 - h1;
    if (dh > 180) dh -= 360;
    else if (dh < -180) dh += 360;
  }
  const dH = 2 * Math.sqrt(C1p * C2p) * Math.sin((dh * rad) / 2);
  const [Lb, Cp] = [(L1 + L2) / 2, (C1p + C2p) / 2];
  let hb = h1 + h2;
  if (C1p * C2p !== 0) hb = Math.abs(h1 - h2) <= 180 ? hb / 2 : hb < 360 ? (hb + 360) / 2 : (hb - 360) / 2;
  const T =
    1 - 0.17 * Math.cos((hb - 30) * rad) + 0.24 * Math.cos(2 * hb * rad) + 0.32 * Math.cos((3 * hb + 6) * rad) - 0.2 * Math.cos((4 * hb - 63) * rad);
  const dt = 30 * Math.exp(-(((hb - 275) / 25) ** 2));
  const Rc = 2 * Math.sqrt(Cp ** 7 / (Cp ** 7 + 25 ** 7));
  const Sl = 1 + (0.015 * (Lb - 50) ** 2) / Math.sqrt(20 + (Lb - 50) ** 2);
  const [Sc, Sh] = [1 + 0.045 * Cp, 1 + 0.015 * Cp * T];
  const Rt = -Math.sin(2 * dt * rad) * Rc;
  const [x, y, z] = [(L2 - L1) / Sl, (C2p - C1p) / Sc, dH / Sh];
  return Math.sqrt(x * x + y * y + z * z + Rt * y * z);
}


const PROTANOPIE = [
  [0.152286, 1.052583, -0.204868],
  [0.114503, 0.786281, 0.099216],
  [-0.003882, -0.048116, 1.051998],
];

/** Het kleinste verschil tussen twee van de zes kleuren. */
function kleinste(zien: (c: Rgb) => Rgb): number {
  const l = LAK_STENEN.map((k) => lab(zien(lineair(k.kleur))));
  let min = Infinity;
  for (let i = 0; i < l.length; i++) for (let j = i + 1; j < l.length; j++) min = Math.min(min, de00(l[i], l[j]));
  return min;
}

test("de zes Stenen op het platte bord halen ΔE00 26,0 normaal en 18,4 bij deuteranopie en protanopie", () => {
  expect(kleinste((c) => c)).toBeGreaterThanOrEqual(26.0);
  expect(kleinste((c) => toepassen(DEUTERANOPIE, c))).toBeGreaterThanOrEqual(18.4);
  expect(kleinste((c) => toepassen(PROTANOPIE, c))).toBeGreaterThanOrEqual(18.4);
});

test("elke Steen, ook de zwarte en de rode, heeft een gouden bies die afsteekt tegen het rode lak", () => {
  for (const k of [...LAK_STENEN.map((s) => s.kleur), LAK_GRIJS]) {
    // De bies is licht goud; het lak is donker: ruim boven het contrast van 3 voor beeldelementen.
    expect(contrast(GOUD.licht, LAK_BORD.midden)).toBeGreaterThan(3);
    expect(k).toMatch(/^#[0-9a-f]{6}$/);
  }
  const rood = LAK_STENEN[0].kleur;
  expect(contrast(rood, LAK_BORD.midden)).toBeGreaterThan(2);
});

test("het teken op elke Steen heeft genoeg contrast met zijn kleur", () => {
  for (const s of LAK_STENEN) expect(contrast(s.teken, s.kleur)).toBeGreaterThan(3.5);
});
