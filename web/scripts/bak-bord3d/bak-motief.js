// Motieven, allemaal zelf getekend als lijnen en vlakken:
// 如意云纹 (ruyi-wolk), 海水纹 (zeegolven) en 回纹 (meander). Overgenomen uit prototype 1b (taak 177), eigen werk, CC0.
// Elke functie voegt alleen paden toe aan het doek dat hij krijgt; de Laag bepaalt kleur, hoogte en glans.

const RAD = Math.PI / 180;

/** Een krul: spiraal rond (cx, cy) van straal r0 bij hoek a0 naar r1 bij a1 (graden, met de klok mee als a1 > a0). */
export function krul(c, cx, cy, r0, r1, a0, a1, begin = true, n = 44) {
  for (let i = 0; i <= n; i++) {
    const t = i / n, a = (a0 + (a1 - a0) * t) * RAD, r = r0 + (r1 - r0) * Math.pow(t, 0.85);
    const x = cx + r * Math.cos(a), y = cy + r * Math.sin(a);
    if (i === 0 && begin) c.moveTo(x, y); else c.lineTo(x, y);
  }
}

/** Ruyi-wolk met de punt omhoog, half zo breed als s. staart: -1 links, 1 rechts, 0 geen. */
export function wolk(c, x, y, s, staart = 1) {
  for (const k of [-1, 1]) {
    // De krul begint binnenin en draait naar buiten; boven loopt hij met een holle boog naar de punt.
    const cx = x + k * 0.52 * s, cy = y + 0.06 * s;
    for (let i = 0; i <= 50; i++) {
      const t = i / 50, a = (-90 - 500 * (1 - t)) * RAD, r = (0.07 + 0.33 * Math.pow(t, 0.8)) * s;
      const px = cx - k * r * Math.cos(a), py = cy + r * Math.sin(a);
      // k spiegelt de krul; de formule hierboven houdt de draairichting naar het midden toe
      if (i === 0) c.moveTo(px, py); else c.lineTo(px, py);
    }
    c.bezierCurveTo(x + k * 0.3 * s, y - 0.36 * s, x + k * 0.1 * s, y - 0.5 * s, x, y - 0.84 * s);
  }
  // Onderkant: een kleine boog tussen de twee krullen.
  c.moveTo(x - 0.5 * s, y + 0.46 * s);
  c.quadraticCurveTo(x, y + 0.2 * s, x + 0.5 * s, y + 0.46 * s);
  if (staart) {
    const k = staart;
    c.moveTo(x + k * 0.1 * s, y + 0.36 * s);
    c.bezierCurveTo(x + k * 0.7 * s, y + 0.95 * s, x + k * 1.3 * s, y + 0.25 * s, x + k * 1.95 * s, y + 0.62 * s);
    krul(c, x + k * 1.95 * s, y + 0.44 * s, 0.18 * s, 0.05 * s, 90, k > 0 ? -200 : 380, false, 20);
    c.moveTo(x + k * 0.55 * s, y + 0.62 * s);
    c.quadraticCurveTo(x + k * 1.0 * s, y + 0.88 * s, x + k * 1.45 * s, y + 0.7 * s);
  }
}

/** Kleine losse wolk: één krul met een staartje. */
export function wolkje(c, x, y, s, k = 1) {
  krul(c, x, y, 0.06 * s, 0.34 * s, k > 0 ? -400 : 580, k > 0 ? 80 : 100, true, 36);
  c.quadraticCurveTo(x + k * 0.35 * s, y + 0.62 * s, x + k * 1.05 * s, y + 0.42 * s);
}

/** De plekken van de schubben van een golfveld: rijen halve bogen die elkaar overlappen. Geeft [x, y, r] van boven naar beneden. */
export function golfSchubben(x0, x1, y0, y1, r) {
  const uit = [], stap = r * 1.5, rij = r * 0.62;
  let n = 0;
  for (let y = y0; y <= y1 + 1e-6; y += rij, n++) for (let x = x0 - (n % 2 ? stap / 2 : 0); x <= x1 + stap; x += stap) uit.push([x, y, r]);
  return uit;
}
export function schubVlak(c, [x, y, r]) { c.moveTo(x - r, y); c.arc(x, y, r, Math.PI, 0, false); c.closePath(); }
export function schubLijnen(c, [x, y, r]) { for (const f of [1, 0.68, 0.36]) { c.moveTo(x - r * f, y); c.arc(x, y, r * f, Math.PI, 0, false); } }

/** Eén eenheid van de meander (回纹): een hoekige spiraal in een vak van 7 bij 5 stappen. */
export function meander(c, x, y, stap, spiegel = false) {
  const p = [[0, 5], [0, 0], [7, 0], [7, 5], [2, 5], [2, 2], [5, 2], [5, 3.2]];
  p.forEach(([px, py], i) => { const qx = x + (spiegel ? 7 - px : px) * stap, qy = y + py * stap; i ? c.lineTo(qx, qy) : c.moveTo(qx, qy); });
}

/** De acht trigrammen in de volgorde van het Latere Hemel-schema (后天八卦) zoals op een luopan: zuid (离) boven, dan met de klok mee. 1 = hele lijn, 0 = gebroken; onderste lijn eerst. */
