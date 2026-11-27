import { expect, test } from "vitest";
import { SPELER_KLEUREN } from "./spelers";
import { GAT_DIEP, GAT_RAND, INKT, TEKENS, contrast, inktVoor, tekenInkt } from "./steen";

// ---- De zes Stenen van Lagune moeten ook voor kleurenblinde Spelers goed uit elkaar te houden zijn.

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

/** Het kleinste verschil tussen twee van de zes kleuren. */
function kleinste(zien: (c: Rgb) => Rgb): number {
  const l = SPELER_KLEUREN.map((k) => lab(zien(lineair(k.kleur))));
  let min = Infinity;
  for (let i = 0; i < l.length; i++) for (let j = i + 1; j < l.length; j++) min = Math.min(min, de00(l[i], l[j]));
  return min;
}

test("de zes Stenen blijven even goed uit elkaar te houden als de oude set (ΔE00 24,9 en 17,2 bij deuteranopie)", () => {
  expect(kleinste((c) => c)).toBeGreaterThanOrEqual(24.9);
  expect(kleinste((c) => toepassen(DEUTERANOPIE, c))).toBeGreaterThanOrEqual(17.2);
});

test("elke Steen heeft een eigen teken en de zesde Steen heet grafiet", () => {
  expect(TEKENS).toHaveLength(SPELER_KLEUREN.length);
  expect(new Set(TEKENS.map((t) => t.d)).size).toBe(6);
  expect(SPELER_KLEUREN[5].naam).toBe("Graphite");
});

test("het teken is wit of donker, wat het meeste contrast geeft, en altijd minstens 3 op 1", () => {
  for (const [s, k] of SPELER_KLEUREN.entries()) {
    expect(tekenInkt(s)).toBe(k.inkt);
    expect(inktVoor(k.kleur)).toBe(k.inkt);
    expect(contrast(k.kleur, k.inkt)).toBeGreaterThanOrEqual(3);
  }
  expect(inktVoor("#c8c8c8")).toBe(INKT);
  expect(inktVoor("#101010")).toBe("#ffffff");
});

// ---- Eén kleurpaar voor de gaten in alle tekenaars (taak 168).

test("de gaten hebben één kleurpaar: de diepte op 2,7 tot 2,9 op 1 tegen wit, de rand lichter", () => {
  expect(contrast(GAT_DIEP, "#ffffff")).toBeGreaterThan(2.7);
  expect(contrast(GAT_DIEP, "#ffffff")).toBeLessThan(2.9);
  expect(contrast(GAT_RAND, "#ffffff")).toBeLessThan(contrast(GAT_DIEP, "#ffffff"));
  expect(contrast(GAT_RAND, "#ffffff")).toBeGreaterThan(1.8);
});

