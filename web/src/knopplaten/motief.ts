// Motieven voor de platen, allemaal zelf getekend als lijnen en vlakken (taak 183; overgenomen uit het prototype kandidaat-1b, bak-motief.js):
// 如意云纹 (ruyi-wolk), een draak (龙) en de pictogrammen. Elke functie voegt alleen paden toe aan het doek dat hij krijgt.
import type { Ctx } from "./doek";
import type { Pictogram } from "./knoppen";

type Pad = (c: Ctx) => void;
const RAD = Math.PI / 180;

/** Een krul: spiraal rond (cx, cy) van straal r0 bij hoek a0 naar r1 bij a1 (graden, met de klok mee als a1 > a0). */
export function krul(c: Ctx, cx: number, cy: number, r0: number, r1: number, a0: number, a1: number, begin = true, n = 44) {
  for (let i = 0; i <= n; i++) {
    const t = i / n, a = (a0 + (a1 - a0) * t) * RAD, r = r0 + (r1 - r0) * Math.pow(t, 0.85);
    const x = cx + r * Math.cos(a), y = cy + r * Math.sin(a);
    if (i === 0 && begin) c.moveTo(x, y); else c.lineTo(x, y);
  }
}


/** Kleine losse wolk: één krul met een staartje. */
export function wolkje(c: Ctx, x: number, y: number, s: number, k = 1) {
  krul(c, x, y, 0.06 * s, 0.34 * s, k > 0 ? -400 : 580, k > 0 ? 80 : 100, true, 36);
  c.quadraticCurveTo(x + k * 0.35 * s, y + 0.62 * s, x + k * 1.05 * s, y + 0.42 * s);
}


// ---------- De draak ----------
type Punt = number[];
function catmull(p: Punt[], n = 16): Punt[] {
  const uit: Punt[] = [];
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[Math.max(0, i - 1)], p1 = p[i], p2 = p[i + 1], p3 = p[Math.min(p.length - 1, i + 2)];
    for (let j = 0; j < n; j++) {
      const t = j / n, t2 = t * t, t3 = t2 * t;
      uit.push([0, 1].map((k: number) => 0.5 * (2 * p1[k] + (-p0[k] + p2[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3)));
    }
  }
  uit.push(p[p.length - 1]);
  return uit;
}

/**
 * Een draak tussen de wolken, kop naar rechts, in een vak van ongeveer -1,7..1,7 bij -1,1..1,1.
 * Geeft de onderdelen terug als padfuncties, zodat de Laag ze als reliëf of als goud kan tekenen:
 * { lijf, kop, poten: [{pad, breed}], klauwen, kam, manen, hoorns, snor, schubben, buik, oog, bek, parel }
 */
export function draak() {
  const lijn = catmull([[-1.62, 0.78], [-1.5, 0.3], [-1.22, -0.38], [-0.62, -0.74], [-0.02, -0.42], [-0.06, 0.22], [0.42, 0.72], [0.98, 0.52], [1.02, -0.06], [0.74, -0.5]], 18);
  const N = lijn.length;
  // Lengte langs de lijn en de dikte: dunne staart, dik lijf, iets dunnere hals.
  const s = [0]; for (let i = 1; i < N; i++) s.push(s[i - 1] + Math.hypot(lijn[i][0] - lijn[i - 1][0], lijn[i][1] - lijn[i - 1][1]));
  const tot = s[N - 1];
  const dik = (t: number) => { const a = Math.min(1, t / 0.3); return 0.022 + 0.175 * (a * a * (3 - 2 * a)) - 0.035 * Math.max(0, (t - 0.82) / 0.18); };
  const bij = (i: number) => {
    const a = lijn[Math.max(0, i - 1)], b = lijn[Math.min(N - 1, i + 1)], l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    const tx = (b[0] - a[0]) / l, ty = (b[1] - a[1]) / l;
    return { x: lijn[i][0], y: lijn[i][1], tx, ty, nx: ty, ny: -tx, w: dik(s[i] / tot), t: s[i] / tot }; // n wijst naar de rug
  };
  const P = lijn.map((_, i) => bij(i));
  const opAfstand = (t: number) => { let i = 0; while (i < N - 1 && s[i] / tot < t) i++; return P[i]; };

  const lijf = (c: Ctx) => {
    P.forEach((p, i) => { const x = p.x + p.nx * p.w, y = p.y + p.ny * p.w; i ? c.lineTo(x, y) : c.moveTo(x, y); });
    for (let i = N - 1; i >= 0; i--) { const p = P[i]; c.lineTo(p.x - p.nx * p.w, p.y - p.ny * p.w); }
    c.closePath();
  };
  // De kam: vlammetjes over de hele rug.
  const kam = (c: Ctx) => {
    for (let d = 0.06; d < 0.93; d += 0.034) {
      const p = opAfstand(d), h = 0.035 + p.w * 0.42, b = 0.03 + p.w * 0.16;
      const bx = p.x + p.nx * p.w * 0.9, by = p.y + p.ny * p.w * 0.9;
      c.moveTo(bx - p.tx * b, by - p.ty * b);
      c.lineTo(bx + p.nx * h - p.tx * b * 1.5, by + p.ny * h - p.ty * b * 1.5);
      c.lineTo(bx + p.tx * b, by + p.ty * b);
      c.closePath();
    }
  };
  // Staart: een waaier van vlammen.
  const staart = (c: Ctx) => {
    const p = P[0];
    for (const [h, l] of [[-0.9, 0.2], [-0.2, 0.3], [0.5, 0.24], [1.2, 0.16]]) {
      const a = Math.atan2(-p.ty, -p.tx) + h * 0.55, ex = p.x + Math.cos(a) * l, ey = p.y + Math.sin(a) * l;
      const qx = -Math.sin(a) * 0.035, qy = Math.cos(a) * 0.035;
      c.moveTo(p.x + qx + p.tx * 0.05, p.y + qy + p.ty * 0.05); c.quadraticCurveTo(p.x + Math.cos(a) * l * 0.5 + qx * 2.2, p.y + Math.sin(a) * l * 0.5 + qy * 2.2, ex, ey);
      c.quadraticCurveTo(p.x + Math.cos(a) * l * 0.5 - qx * 0.6, p.y + Math.sin(a) * l * 0.5 - qy * 0.6, p.x - qx + p.tx * 0.05, p.y - qy + p.ty * 0.05); c.closePath();
    }
  };
  // Poten: [plek langs het lijf, kant (1 = rug, -1 = buik), hoek bovenpoot, hoek onderpoot] in graden (0 = rechts, 90 = omlaag).
  const pootDefs = [[0.3, 1, -150, -100], [0.44, -1, 150, 95], [0.7, -1, 55, 115], [0.83, 1, 15, -40]];
  const poten = [], klauwPunten: number[][] = [];
  for (const [d, kant, a1, a2] of pootDefs) {
    const p = opAfstand(d);
    const x0 = p.x + p.nx * p.w * 0.5 * kant, y0 = p.y + p.ny * p.w * 0.5 * kant;
    const x1 = x0 + Math.cos(a1 * RAD) * 0.25, y1 = y0 + Math.sin(a1 * RAD) * 0.25;
    const x2 = x1 + Math.cos(a2 * RAD) * 0.2, y2 = y1 + Math.sin(a2 * RAD) * 0.2;
    poten.push({ pad: (c: Ctx) => { c.moveTo(x0, y0); c.lineTo(x1, y1); }, breed: 0.125 });
    poten.push({ pad: (c: Ctx) => { c.moveTo(x1, y1); c.lineTo(x2, y2); }, breed: 0.085 });
    klauwPunten.push([x2, y2, a2, x1, y1, a1]);
  }
  const klauwen = (c: Ctx) => {
    for (const [x, y, a] of klauwPunten) for (const h of [-58, -20, 18, 56]) {
      const b = (a + h) * RAD, l = 0.16, q = 0.028;
      c.moveTo(x - Math.sin(b) * q, y + Math.cos(b) * q);
      c.quadraticCurveTo(x + Math.cos(b) * l * 0.6 - Math.sin(b + 0.5) * q, y + Math.sin(b) * l * 0.6 + Math.cos(b + 0.5) * q, x + Math.cos(b + 0.25) * l, y + Math.sin(b + 0.25) * l);
      c.quadraticCurveTo(x + Math.cos(b) * l * 0.5 + Math.sin(b) * q, y + Math.sin(b) * l * 0.5 - Math.cos(b) * q, x + Math.sin(b) * q, y - Math.cos(b) * q);
      c.closePath();
    }
  };
  // Vlammen bij de schouders.
  const vlammen = (c: Ctx) => {
    for (const [x, y, , x1, y1, a1] of klauwPunten) for (const h of [-1, 1]) {
      const a = (a1 + 180 + h * 38) * RAD, l = 0.2;
      const bx = (x1 + x) / 2 - Math.cos(a1 * RAD) * 0.2, by = (y1 + y) / 2 - Math.sin(a1 * RAD) * 0.2;
      c.moveTo(bx - Math.sin(a) * 0.035, by + Math.cos(a) * 0.035);
      c.quadraticCurveTo(bx + Math.cos(a) * l * 0.5 - Math.sin(a) * 0.07, by + Math.sin(a) * l * 0.5 + Math.cos(a) * 0.07, bx + Math.cos(a) * l, by + Math.sin(a) * l);
      c.quadraticCurveTo(bx + Math.cos(a) * l * 0.4, by + Math.sin(a) * l * 0.4, bx + Math.sin(a) * 0.035, by - Math.cos(a) * 0.035);
      c.closePath();
    }
  };

  // De kop: eigen maatstelsel (lengte 1 = K), neus naar rechts en iets omlaag.
  const eind = P[N - 1], K = 0.6, hoek = 12 * RAD;
  const ox = eind.x - 0.02, oy = eind.y - 0.06;
  const kp = (x: number, y: number): number[] => [ox + (x * Math.cos(hoek) - y * Math.sin(hoek)) * K, oy + (x * Math.sin(hoek) + y * Math.cos(hoek)) * K];
  const veelhoek = (c: Ctx, punten: number[][], glad = true) => {
    const q = punten.map(([x, y]: number[]) => kp(x, y));
    if (!glad) { q.forEach(([x, y]: number[], i: number) => (i ? c.lineTo(x, y) : c.moveTo(x, y))); c.closePath(); return; }
    const m = (a: number[], b: number[]) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    const start = m(q[q.length - 1], q[0]); c.moveTo(start[0], start[1]);
    for (let i = 0; i < q.length; i++) { const e = m(q[i], q[(i + 1) % q.length]); c.quadraticCurveTo(q[i][0], q[i][1], e[0], e[1]); }
    c.closePath();
  };
  // y omhoog is negatief (doek). Bovenkaak met neusbult, open bek, onderkaak met sik.
  const kop = (c: Ctx) => {
    veelhoek(c, [[-0.32, -0.3], [0.0, -0.42], [0.22, -0.36], [0.42, -0.27], [0.66, -0.3], [0.9, -0.36], [1.04, -0.24], [1.0, -0.08], [0.62, -0.02], [0.36, 0.02], [0.3, 0.1], [0.56, 0.16], [0.84, 0.2], [0.88, 0.32], [0.6, 0.38], [0.2, 0.4], [-0.1, 0.36], [-0.34, 0.26]]);
  };
  const hoorns = (c: Ctx) => {
    veelhoek(c, [[-0.02, -0.36], [-0.36, -0.62], [-0.82, -0.72], [-1.02, -0.9], [-0.76, -0.84], [-0.6, -0.98], [-0.56, -0.8], [-0.28, -0.76], [0.18, -0.4]]);
    veelhoek(c, [[0.2, -0.36], [0.06, -0.66], [-0.2, -0.86], [-0.02, -0.92], [0.22, -0.7], [0.34, -0.38]]);
  };
  const manen = (c: Ctx) => {
    for (const [by, ex, ey, d] of [[-0.3, -1.05, -0.5, 0.11], [-0.12, -1.2, -0.16, 0.12], [0.08, -1.12, 0.22, 0.12], [0.26, -0.86, 0.56, 0.11], [0.36, -0.4, 0.74, 0.1]]) {
      const [x0, y0] = kp(-0.2, by - d), [x1, y1] = kp(-0.2, by + d), [x2, y2] = kp(ex, ey), [m0x, m0y] = kp(ex * 0.55, (by - d + ey) / 2 - 0.1), [m1x, m1y] = kp(ex * 0.5, (by + d + ey) / 2 + 0.04);
      c.moveTo(x0, y0); c.quadraticCurveTo(m0x, m0y, x2, y2); c.quadraticCurveTo(m1x, m1y, x1, y1); c.closePath();
    }
    // Sik onder de kin.
    const [a0, a1] = kp(0.5, 0.36), [b0, b1] = kp(0.2, 0.38), [e0, e1] = kp(0.2, 0.86), [f0, f1] = kp(0.5, 0.6), [g0, g1] = kp(0.12, 0.6);
    c.moveTo(a0, a1); c.quadraticCurveTo(f0, f1, e0, e1); c.quadraticCurveTo(g0, g1, b0, b1); c.closePath();
  };
  const snor = (c: Ctx) => {
    for (const [ex, ey, mx, my, m2x, m2y] of [[1.9, -0.5, 1.3, 0.1, 1.75, -0.05], [1.62, 0.5, 1.35, -0.3, 1.8, 0.2]]) {
      const [x0, y0] = kp(0.96, -0.16), [m0, m1] = kp(mx, my), [n0, n1] = kp(m2x, m2y), [x1, y1] = kp(ex, ey);
      c.moveTo(x0, y0); c.bezierCurveTo(m0, m1, n0, n1, x1, y1);
    }
  };
  const oog = (c: Ctx) => { const [x, y] = kp(0.3, -0.16); c.moveTo(x + 0.062, y); c.arc(x, y, 0.062, 0, Math.PI * 2); };
  const pupil = (c: Ctx) => { const [x, y] = kp(0.32, -0.16); c.moveTo(x + 0.026, y); c.arc(x, y, 0.026, 0, Math.PI * 2); };
  const bek = (c: Ctx) => {
    // Neusgat, wenkbrauw, tanden en de lijn van de kaak.
    const [n0, n1] = kp(0.9, -0.22); krul(c, n0, n1, 0.012, 0.05, 0, 300, true, 14);
    const [w0, w1] = kp(0.04, -0.2), [w2, w3] = kp(0.26, -0.34), [w4, w5] = kp(0.5, -0.2); c.moveTo(w0, w1); c.quadraticCurveTo(w2, w3, w4, w5);
    for (const x of [0.52, 0.66, 0.8, 0.92]) { const [a, b] = kp(x, -0.03), [d, e] = kp(x + 0.04, 0.07); c.moveTo(a, b); c.lineTo(d, e); }
    const [k0, k1] = kp(-0.2, 0.06), [k2, k3] = kp(0.1, 0.2), [k4, k5] = kp(0.34, 0.12); c.moveTo(k0, k1); c.quadraticCurveTo(k2, k3, k4, k5);
  };
  // Schubben: boogjes over het lijf, open naar de staart.
  const schubben = (c: Ctx) => {
    for (let d = 0.12; d < 0.95; d += 0.0165) {
      const p = opAfstand(d), n = d < 0.2 ? 1 : 2, even = Math.round(d / 0.0165) % 2;
      for (let j = 0; j < n + (even ? 0 : 1); j++) {
        const f = n === 1 ? 0.25 : -0.15 + (j + (even ? 0.5 : 0)) * 0.5, r = Math.max(0.03, p.w * 0.36);
        if (f > 0.92) continue;
        const cx = p.x + p.nx * p.w * f, cy = p.y + p.ny * p.w * f, a = Math.atan2(p.ty, p.tx);
        c.moveTo(cx + Math.cos(a - 1.25) * r, cy + Math.sin(a - 1.25) * r);
        c.arc(cx, cy, r, a - 1.25, a + 1.25);
      }
    }
  };
  // De buik: een band met dwarsstreepjes langs de onderkant.
  const buik = (c: Ctx) => {
    let eerste = true;
    for (let i = 8; i < N - 2; i++) { const p = P[i], x = p.x - p.nx * p.w * 0.42, y = p.y - p.ny * p.w * 0.42; eerste ? c.moveTo(x, y) : c.lineTo(x, y); eerste = false; }
    for (let d = 0.1; d < 0.96; d += 0.02) { const p = opAfstand(d); c.moveTo(p.x - p.nx * p.w * 0.42, p.y - p.ny * p.w * 0.42); c.lineTo(p.x - p.nx * p.w * 0.97 + p.tx * 0.012, p.y - p.ny * p.w * 0.97 + p.ty * 0.012); }
  };
  // De vlammende parel (火珠) waar de draak naar reikt.
  const parelPlek = kp(1.75, 0.95);
  const parel = (c: Ctx) => { c.moveTo(parelPlek[0] + 0.13, parelPlek[1]); c.arc(parelPlek[0], parelPlek[1], 0.13, 0, Math.PI * 2); };
  const parelVlam = (c: Ctx) => {
    const [x, y] = parelPlek;
    for (const [a, l] of [[-150, 0.26], [-100, 0.34], [-55, 0.24], [150, 0.2]]) {
      const b = a * RAD, q = 0.05;
      c.moveTo(x + Math.cos(b - 0.5) * 0.12, y + Math.sin(b - 0.5) * 0.12);
      c.quadraticCurveTo(x + Math.cos(b - 0.3) * l * 0.7, y + Math.sin(b - 0.3) * l * 0.7, x + Math.cos(b + 0.2) * l, y + Math.sin(b + 0.2) * l - q);
      c.quadraticCurveTo(x + Math.cos(b + 0.3) * l * 0.5, y + Math.sin(b + 0.3) * l * 0.5, x + Math.cos(b + 0.5) * 0.12, y + Math.sin(b + 0.5) * 0.12);
      c.closePath();
    }
  };
  const parelKrul = (c: Ctx) => { krul(c, parelPlek[0], parelPlek[1], 0.01, 0.085, 0, 420, true, 20); };
  return { lijf, kam, staart, poten, klauwen, vlammen, kop, hoorns, manen, snor, oog, pupil, bek, schubben, buik, parel, parelVlam, parelKrul };
}

// ---------- Pictogrammen: lijnen op een raster van 24, één lijndikte ----------
const G = Math.PI / 180;
export const ICOON: Partial<Record<Pictogram, Pad>> = {
  computer: (c: Ctx) => { c.roundRect(6.5, 6.5, 11, 11, 2); c.rect(10, 10, 4, 4); for (const v of [9.5, 14.5]) { c.moveTo(v, 3.5); c.lineTo(v, 6.5); c.moveTo(v, 17.5); c.lineTo(v, 20.5); c.moveTo(3.5, v); c.lineTo(6.5, v); c.moveTo(17.5, v); c.lineTo(20.5, v); } },
  vrienden: (c: Ctx) => { c.moveTo(12, 8.5); c.arc(9, 8.5, 3, 0, 7); c.moveTo(3, 19.5); c.arc(9, 19.5, 6, Math.PI, 0); c.moveTo(15.5, 5.8); c.arc(15.8, 8.5, 2.7, -100 * G, 100 * G); c.moveTo(17, 13.8); c.arc(15.5, 19.5, 5.8, -75 * G, 0); },
  puzzel: (c: Ctx) => { c.moveTo(4, 9); c.lineTo(7.9, 9); c.arc(10, 6.9, 2.5, 125 * G, 415 * G); c.lineTo(16, 9); c.lineTo(16, 12.4); c.arc(18.1, 14.5, 2.5, 215 * G, 505 * G); c.lineTo(16, 20.5); c.lineTo(4, 20.5); c.closePath(); },
  uitleg: (c: Ctx) => { c.moveTo(12, 7); c.bezierCurveTo(9, 5, 6, 5, 3.5, 6); c.lineTo(3.5, 18); c.bezierCurveTo(6, 17, 9, 17, 12, 19); c.bezierCurveTo(15, 17, 18, 17, 20.5, 18); c.lineTo(20.5, 6); c.bezierCurveTo(18, 5, 15, 5, 12, 7); c.lineTo(12, 19); },
  ranglijst: (c: Ctx) => { c.moveTo(7.5, 4); c.lineTo(16.5, 4); c.lineTo(16.5, 9); c.arc(12, 9, 4.5, 0, Math.PI); c.lineTo(7.5, 4); c.moveTo(7.5, 5.5); c.bezierCurveTo(3.5, 5.5, 3.5, 10.5, 8, 11); c.moveTo(16.5, 5.5); c.bezierCurveTo(20.5, 5.5, 20.5, 10.5, 16, 11); c.moveTo(12, 13.5); c.lineTo(12, 17.5); c.moveTo(8, 20); c.lineTo(16, 20); c.moveTo(9.5, 17.5); c.lineTo(14.5, 17.5); },
  stats: (c: Ctx) => { c.moveTo(5.5, 20); c.lineTo(5.5, 13); c.moveTo(12, 20); c.lineTo(12, 5); c.moveTo(18.5, 20); c.lineTo(18.5, 9.5); },
  terug: (c: Ctx) => { c.moveTo(11, 5.5); c.lineTo(4.5, 12); c.lineTo(11, 18.5); c.moveTo(4.5, 12); c.lineTo(19.5, 12); },
  vlag: (c: Ctx) => { c.moveTo(6, 3.5); c.lineTo(6, 21); c.moveTo(6, 4.5); c.lineTo(18.5, 4.5); c.lineTo(15.5, 8.5); c.lineTo(18.5, 12.5); c.lineTo(6, 12.5); },
  vink: (c: Ctx) => { c.moveTo(4.5, 12.5); c.lineTo(9.8, 17.8); c.lineTo(19.5, 6.8); },
  wereld: (c: Ctx) => { c.moveTo(20.5, 12); c.arc(12, 12, 8.5, 0, 7); c.moveTo(15.8, 12); c.ellipse(12, 12, 3.8, 8.5, 0, 0, 7); c.moveTo(3.5, 12); c.lineTo(20.5, 12); },
  geluid: (c: Ctx) => { c.moveTo(4, 9.5); c.lineTo(8, 9.5); c.lineTo(12.5, 5.5); c.lineTo(12.5, 18.5); c.lineTo(8, 14.5); c.lineTo(4, 14.5); c.closePath(); c.moveTo(15.5, 9); c.arc(13.5, 12, 3.6, -56 * G, 56 * G); c.moveTo(17.6, 6.4); c.arc(13.5, 12, 7, -53 * G, 53 * G); },
  // Drie Stenen (taak 206; eerst vier vakjes, die lazen als een algemeen menu).
  potjes: (c: Ctx) => { for (const [x, y] of [[12, 7.5], [7, 16], [17, 16]]) { c.moveTo(x + 4.3, y); c.arc(x, y, 4.3, 0, Math.PI * 2); } },
  persoon: (c: Ctx) => { c.moveTo(15.5, 8.5); c.arc(12, 8.5, 3.5, 0, 7); c.moveTo(5, 20); c.arc(12, 20, 7, Math.PI, 0); },
  kopie: (c: Ctx) => { c.roundRect(8.5, 8.5, 11, 11, 2); c.moveTo(5.5, 15.5); c.lineTo(5.5, 5.5); c.lineTo(15.5, 5.5); },
  delen: (c: Ctx) => { for (const [x, y] of [[6, 12], [17, 6], [17, 18]]) { c.moveTo(x + 2.5, y); c.arc(x, y, 2.5, 0, 7); } c.moveTo(8, 10.8); c.lineTo(14.8, 7.2); c.moveTo(8, 13.2); c.lineTo(14.8, 16.8); },
  // Twee pijlen tegen elkaar in: wisselen (taak 235).
  wissel: (c: Ctx) => { c.moveTo(4, 9); c.lineTo(19.5, 9); c.moveTo(15.5, 5); c.lineTo(19.5, 9); c.lineTo(15.5, 13); c.moveTo(20, 16); c.lineTo(4.5, 16); c.moveTo(8.5, 12); c.lineTo(4.5, 16); c.lineTo(8.5, 20); },
  trillen: (c: Ctx) => { c.roundRect(8, 4, 8, 16, 1.8); c.moveTo(4.5, 8.5); c.lineTo(4.5, 15.5); c.moveTo(19.5, 8.5); c.lineTo(19.5, 15.5); c.moveTo(1.8, 10.5); c.lineTo(1.8, 13.5); c.moveTo(22.2, 10.5); c.lineTo(22.2, 13.5); },
};
