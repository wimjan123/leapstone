// Bakt de texturen van het 3D-bord (ontwerp 1b, taak 177) in de browser. Start: npm --prefix web run bak-bord3d
// Overgenomen uit het prototype "De lakwerktafel" (kandidaat 1b). Alles is zelf getekend: lak, goud, snijwerk, messing
// en de zijde van de tafel (eigen werk, CC0). De maten volgen crates/halma-bord3d/src/lak.rs.
import { Laag, kaarten, fbm, kansMaker, grijs } from "./bak-hulp.js";
import { wolk, wolkje, golfSchubben, schubVlak, schubLijnen, meander } from "./bak-motief.js";

// Zelfde maten als lak.rs.
const VELD_A = 6.7, RAND_A = 7.62, RAND_BREED = RAND_A - VELD_A - 2 * 0.07; // de bovenkant van de rand, zonder de afronding
const RAND_ZIJDE = 2 * ((VELD_A + RAND_A) / 2) * Math.tan(Math.PI / 6);
const V_VELD = 8.45, V_LAK = 8.0, V_UV = 9.0; // Vierkant bord: halve breedte van het veld, van het rode lak en van het plaatje
const GOUD = "#f2c466", LAK = "#0b0807", MESSING = "#e6c272", OXBLOED = "#430a0c";
const goud = (extra = {}) => ({ k: GOUD, m: 1, r: 0.3, h: 0.44, ...extra });

/** De vakken van het Sterbord zoals in halma-core en vakken.rs: (kolom + rij / 2, rij * 0,866). */
function sterVakken() {
  const uit = [];
  for (let r = -8; r <= 8; r++) for (let q = -8; q <= 8; q++) {
    const s = -q - r;
    if ((q >= -4 && r >= -4 && s >= -4) || (q <= 4 && r <= 4 && s <= 4)) uit.push([q + r / 2, r * Math.sqrt(3) / 2]);
  }
  return uit;
}
/** De vakken van het Vierkant bord, rond het midden. */
function vierkantVakken() {
  const uit = [];
  for (let r = 0; r < 16; r++) for (let k = 0; k < 16; k++) uit.push([k - 7.5, r - 7.5]);
  return uit;
}

/** Elk gat: een donkere zoom eromheen, een afgeronde rand die licht vangt, en een dun gouden ringetje. */
function gaten(L, plekken) {
  for (const [x, z] of plekken) {
    const g = L.K.createRadialGradient(x, z, 0.35, x, z, 0.56);
    g.addColorStop(0, "rgba(34,13,4,.5)"); g.addColorStop(0.4, "rgba(34,13,4,.14)"); g.addColorStop(1, "rgba(34,13,4,0)");
    L.teken((c) => c.arc(x, z, 0.56, 0, 7), { k: g });
    const h = L.H.createRadialGradient(x, z, 0.35, x, z, 0.445);
    h.addColorStop(0, grijs(0.12)); h.addColorStop(0.55, grijs(0.38)); h.addColorStop(1, grijs(0.5));
    L.teken((c) => c.arc(x, z, 0.445, 0, 7), { h });
    const r = L.R.createRadialGradient(x, z, 0.35, x, z, 0.445);
    r.addColorStop(0, grijs(0.3)); r.addColorStop(1, "rgba(100,100,100,0)");
    L.teken((c) => c.arc(x, z, 0.445, 0, 7), { r });
    L.teken((c) => c.arc(x, z, 0.462, 0, 7), { lijn: 0.022, k: "#c99a45", m: 1, r: 0.3, h: 0.54, zacht: 0.4 });
  }
}

/** Een diepe, zachte lakkleur: wolking in het rood, geen draad. */
function wolking(L, pad, maat) {
  L.K.save(); L.K.beginPath(); pad(L.K); L.K.clip();
  for (let i = 0; i < 46; i++) { const kk = kansMaker(i * 13 + 3); const x = (kk() - 0.5) * maat, y = (kk() - 0.5) * maat, r = 1.2 + kk() * 2.4; const g = L.K.createRadialGradient(x, y, 0, x, y, r); const c = kk() > 0.5 ? "rgba(120,22,22,.14)" : "rgba(10,0,0,.16)"; g.addColorStop(0, c); g.addColorStop(1, "rgba(0,0,0,0)"); L.K.fillStyle = g; L.K.fillRect(x - r, y - r, 2 * r, 2 * r); }
  L.K.restore();
}

// Lak is nooit helemaal vlak: een heel lichte golving laat de spiegeling leven.
const lakGolving = (x, y) => (fbm(x / 210, y / 210, 3, 5) - 0.5) * 0.05 + (fbm(x / 34, y / 34, 2, 9) - 0.5) * 0.008;

// ---------- Het Sterbord: een ster van rood lak met 121 gaten, in zwart lak met goud ----------
function bakSter() {
  const N = 2048, E = 128; // het plaatje loopt van -8 tot 8 vakken
  const L = new Laag(N, N, { ruw: 0.11, kleur: LAK });
  L.alle((c) => { c.translate(N / 2, N / 2); c.scale(E, E); });
  const A = VELD_A, m = 0.6, R_PUNT = 8 * Math.sqrt(3) / 2 + 2 * m, R_KEEL = R_PUNT / Math.sqrt(3);
  const pool = (r, graden) => [r * Math.cos((graden * Math.PI) / 180), r * Math.sin((graden * Math.PI) / 180)];
  const ster = (c) => { for (let i = 0; i < 12; i++) { const [x, y] = pool(i % 2 ? R_PUNT : R_KEEL, i * 30); i ? c.lineTo(x, y) : c.moveTo(x, y); } c.closePath(); };
  const zeshoek = (c) => { for (let i = 0; i < 6; i++) { const [x, y] = pool(R_KEEL, i * 60); i ? c.lineTo(x, y) : c.moveTo(x, y); } c.closePath(); };

  // Zes panelen van zwart lak met goud in gegraveerde lijnen (戗金, qiangjin): golven langs de rand, wolken naar het midden.
  for (let k = 0; k < 6; k++) {
    L.bewaar();
    L.alle((c) => { c.rotate((k * Math.PI) / 3); c.translate(A, 0); c.rotate(-Math.PI / 2); });
    const top = A - R_KEEL;
    const drie = (inzet) => (c) => { const t = top - inzet * 2, b = -inzet; c.moveTo(0, -t); c.lineTo((t + b) * Math.sqrt(3), b); c.lineTo(-(t + b) * Math.sqrt(3), b); c.closePath(); };
    L.teken(drie(0.15), goud({ lijn: 0.03 }));
    L.bewaar();
    L.knip(drie(0.21));
    L.teken((c) => { wolk(c, 0, -1.05, 0.46, 0); }, goud({ lijn: 0.036 }));
    L.teken((c) => { wolkje(c, -1.0, -0.86, 0.34, -1); wolkje(c, 1.0, -0.86, 0.34, 1); }, goud({ lijn: 0.03 }));
    L.teken((c) => { for (const x of [-2.2, 2.2]) { c.moveTo(x + 0.05, -0.62); c.arc(x, -0.62, 0.05, 0, 7); } }, goud({}));
    for (const s of golfSchubben(-3.9, 3.9, -0.42, 0.1, 0.25)) {
      L.teken((c) => schubVlak(c, s), { k: LAK, m: 0, r: 0.11, h: 0.5 });
      L.teken((c) => schubLijnen(c, s), goud({ lijn: 0.026 }));
    }
    L.herstel();
    L.herstel();
  }

  // De ster van diep rood lak (oxbloed), ingelegd in het zwarte lak: zes punten en een midden, om en om een tint verschil.
  L.K.save(); L.K.beginPath(); ster(L.K); L.K.fillStyle = OXBLOED; L.K.fill(); L.K.restore();
  for (let k = 0; k < 6; k++) {
    L.K.save(); L.K.beginPath();
    const a = pool(R_KEEL, k * 60), b = pool(R_PUNT, k * 60 + 30), d = pool(R_KEEL, k * 60 + 60);
    L.K.moveTo(...a); L.K.lineTo(...b); L.K.lineTo(...d); L.K.closePath();
    L.K.fillStyle = k % 2 ? "rgba(20,0,0,.22)" : "rgba(255,90,60,.05)"; L.K.fill();
    L.K.restore();
  }
  wolking(L, ster, 17);
  L.teken(ster, { r: 0.1, m: 0, h: 0.5 });
  // Naden van het inlegwerk en een bies van messing om de ster.
  L.teken(zeshoek, { lijn: 0.02, k: "rgba(38,18,6,.75)", h: 0.4 });
  L.teken(ster, { lijn: 0.085, k: "#1a0f08", m: 0, r: 0.2, h: 0.46 });
  L.teken(ster, { lijn: 0.05, k: GOUD, m: 1, r: 0.26, h: 0.52 });
  gaten(L, sterVakken());
  // Schaduw van de rand op het veld.
  L.teken((c) => { for (let i = 0; i < 6; i++) { const [x, y] = pool((A + 0.12) / Math.cos(Math.PI / 6), i * 60 + 30); i ? c.lineTo(x, y) : c.moveTo(x, y); } c.closePath(); }, { lijn: 0.5, k: "rgba(8,3,1,.5)", zachtK: 14 });
  return kaarten(L, { diepte: 20, extra: lakGolving, holte: null });
}

// ---------- Het Vierkant bord: hetzelfde rode lak met 256 gaten, met een band van zwart lak en goud ----------
function bakVierkant() {
  const N = 2048, E = N / (2 * V_UV);
  const L = new Laag(N, N, { ruw: 0.11, kleur: LAK });
  L.alle((c) => { c.translate(N / 2, N / 2); c.scale(E, E); });
  const vak = (h) => (c) => c.rect(-h, -h, 2 * h, 2 * h);
  // De band van zwart lak: twee gouden lijnen en in elke hoek een ruyi-wolkje.
  L.teken(vak(V_VELD - 0.1), goud({ lijn: 0.026 }));
  for (let k = 0; k < 4; k++) {
    L.bewaar();
    L.alle((c) => { c.rotate((k * Math.PI) / 2); c.translate(V_LAK + 0.24, V_LAK + 0.24); c.rotate(-Math.PI / 4); });
    L.teken((c) => wolkje(c, -0.12, 0.02, 0.2, 1), goud({ lijn: 0.022 }));
    L.herstel();
  }
  // Het veld van diep rood lak, met de vier hoeken (de startvakken van vier Spelers) om en om een tint verschil.
  L.K.save(); L.K.beginPath(); vak(V_LAK)(L.K); L.K.fillStyle = OXBLOED; L.K.fill(); L.K.restore();
  for (let k = 0; k < 4; k++) {
    L.K.save(); L.K.beginPath();
    const sx = k % 2 ? 1 : -1, sy = k < 2 ? -1 : 1;
    L.K.moveTo(sx * V_LAK, sy * V_LAK); L.K.lineTo(sx * (V_LAK - 5), sy * V_LAK); L.K.lineTo(sx * V_LAK, sy * (V_LAK - 5)); L.K.closePath();
    L.K.fillStyle = (k === 0 || k === 3) ? "rgba(20,0,0,.22)" : "rgba(255,90,60,.05)"; L.K.fill();
    L.K.restore();
  }
  wolking(L, vak(V_LAK), 17);
  L.teken(vak(V_LAK), { r: 0.1, m: 0, h: 0.5 });
  L.teken(vak(V_LAK), { lijn: 0.085, k: "#1a0f08", m: 0, r: 0.2, h: 0.46 });
  L.teken(vak(V_LAK), { lijn: 0.05, k: GOUD, m: 1, r: 0.26, h: 0.52 });
  gaten(L, vierkantVakken());
  L.teken(vak(V_VELD + 0.12), { lijn: 0.5, k: "rgba(8,3,1,.5)", zachtK: 14 });
  return kaarten(L, { diepte: 20, extra: lakGolving, holte: null });
}

// ---------- De rand: gesneden rood lak (剔红, tihong) met de meander (回纹) ----------
function bakRand() {
  const W = 512, H = 256, U = RAND_ZIJDE / 7, V = RAND_BREED; // twee eenheden van de meander per tegel, zeven tegels per zijde
  const L = new Laag(W, H, { ruw: 0.3, kleur: "#8c1b11" });
  L.alle((c) => c.scale(W / U, H / V));
  L.teken((c) => c.rect(0, 0, U, V), { h: 0.22 });
  const stap = 0.062, lijn = { lijn: 0.044, h: 0.8, k: "#c9301f", zacht: 1.1, kap: "butt", join: "miter" };
  for (let i = -1; i < 3; i++) {
    const x = i * (U / 2) + (U / 2 - 7 * stap) / 2;
    L.teken((c) => meander(c, x, (V - 5 * stap) / 2, stap, i % 2 !== 0), lijn);
  }
  for (const y of [0.06, V - 0.06]) L.teken((c) => { c.moveTo(-1, y); c.lineTo(U + 1, y); }, { ...lijn, lijn: 0.06 });
  const extra = (x, y) => (fbm(x / 9, y / 9, 3, 3) - 0.5) * 0.03;
  return kaarten(L, { diepte: 15, extra, holte: { straal: 5, kracht: 2.0, kleur: 0.5 }, herhaal: true });
}

// ---------- Het hoekbeslag van messing ----------
function bakBeslag() {
  // u loopt van de hoek naar het vrije eind, v over het profiel (binnenkant, bovenkant, buitenkant).
  const n = 256, L = new Laag(n, n, { ruw: 0.34, kleur: MESSING });
  L.alle((c) => c.scale(n, n));
  const kans = kansMaker(5);
  for (let i = 0; i < 300; i++) { const y = kans(), v = kans(); L.teken((c) => { c.moveTo(0, y); c.lineTo(1, y + (kans() - 0.5) * 0.01); }, { lijn: 0.002 + kans() * 0.004, k: v > 0.5 ? `rgba(255,238,180,${(v - 0.5) * 0.3})` : `rgba(80,52,12,${(0.5 - v) * 0.3})`, h: 0.47 + v * 0.06 }); }
  const groef = { k: "#3a280e", h: 0.26, zacht: 0.8 };
  L.teken((c) => { c.moveTo(0.9, 0); c.lineTo(0.9, 1); c.moveTo(0.95, 0); c.lineTo(0.95, 1); }, { ...groef, lijn: 0.012 });
  L.teken((c) => { c.moveTo(0.02, 0.13); c.lineTo(0.9, 0.13); c.moveTo(0.02, 0.51); c.lineTo(0.9, 0.51); }, { ...groef, lijn: 0.01 });
  L.bewaar(); L.alle((c) => { c.translate(0.36, 0.33); c.scale(0.24, 0.3); });
  L.teken((c) => wolk(c, 0, 0, 0.42, 1), { ...groef, lijn: 0.045 });
  L.herstel();
  L.teken((c) => { c.moveTo(0.2, 0.75); c.lineTo(0.9, 0.75); }, { ...groef, lijn: 0.01 });
  return kaarten(L, { diepte: 10, holte: null });
}

// ---------- De tafel: donkere zijde (damast) ----------
/** Een tegel van 1024 beeldpunten die naadloos herhaalt: keperweving in blauwzwart, met wolken van satijn erin (tint op tint). */
function bakTafel() {
  const N = 1024, P = 8; // draaddikte in beeldpunten; N is een veelvoud van P zodat de tegel aansluit
  const m = new Laag(N, N); const g = m.K;
  g.fillStyle = "#000"; g.fillRect(0, 0, N, N);
  g.strokeStyle = "#fff"; g.lineWidth = 6; g.lineCap = "round"; g.lineJoin = "round";
  const cel = N / 4;
  for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) {
    g.save(); g.translate(i * cel + (j % 2 ? cel / 2 : 0), j * cel);
    for (const dx of [0, -N, N]) { g.save(); g.translate(dx, 0); g.beginPath(); wolk(g, cel / 2, cel * 0.62, cel * 0.38, 1); g.stroke(); g.beginPath(); wolkje(g, cel * 0.2, cel * 0.9, cel * 0.14, 1); g.stroke(); g.beginPath(); wolkje(g, cel * 0.8, cel * 0.9, cel * 0.14, -1); g.stroke(); g.restore(); }
    g.restore();
  }
  g.filter = "blur(1.6px)"; g.drawImage(g.canvas, 0, 0); g.filter = "none";
  const md = g.getImageData(0, 0, N, N).data;
  const K = document.createElement("canvas"); K.width = K.height = N; const kc = K.getContext("2d"), kd = kc.createImageData(N, N);
  const Rr = document.createElement("canvas"); Rr.width = Rr.height = N; const rc = Rr.getContext("2d"), rd = rc.createImageData(N, N);
  const Hh = new Float32Array(N * N);
  const ruisje = (x, y) => fbm(x / 1.7, y / 1.7, 1, 3) - 0.5;
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const i = y * N + x, sat = md[i * 4] / 255; // 1 = satijn (wolk), 0 = keper
    const t = ((x + y) % P) / P, draad = 0.5 - 0.5 * Math.cos(2 * Math.PI * t); // diagonale draadrichting
    const kleine = ruisje(x, y);
    const keper = 0.5 + 0.5 * (draad - 0.5) * 1.1 + kleine * 0.05;
    Hh[i] = keper * (1 - sat) + 0.52 * sat + kleine * 0.01;
    const lum = (0.085 + 0.03 * (draad - 0.5) + kleine * 0.012) * (1 - sat) + (0.11 + kleine * 0.004) * sat;
    // Blauwzwart: weinig rood, iets meer blauw.
    kd.data[i * 4] = Math.min(255, lum * 255 * 0.78); kd.data[i * 4 + 1] = Math.min(255, lum * 255 * 0.9); kd.data[i * 4 + 2] = Math.min(255, lum * 255 * 1.35); kd.data[i * 4 + 3] = 255;
    // Ruwheid in het groene kanaal (zoals Bevy en glTF), geen metaal. Rood: de omgeving telt maar 0,3 mee
    // op de tafel (prototype: envMapIntensity 0,3); Bevy leest dat als `occlusion_texture`.
    const ru = (0.62 - 0.3 * sat + 0.08 * (draad - 0.5)) * 255; rd.data[i * 4] = 0.3 * 255; rd.data[i * 4 + 1] = ru; rd.data[i * 4 + 2] = 0; rd.data[i * 4 + 3] = 255;
  }
  kc.putImageData(kd, 0, 0); rc.putImageData(rd, 0, 0);
  const Nn = document.createElement("canvas"); Nn.width = Nn.height = N; const nc = Nn.getContext("2d"), nd = nc.createImageData(N, N);
  const bij = (x, y) => Hh[((y + N) % N) * N + ((x + N) % N)];
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const dx = (bij(x + 1, y) - bij(x - 1, y)) * 0.5 * 3.2, dy = (bij(x, y + 1) - bij(x, y - 1)) * 0.5 * 3.2, l = 1 / Math.hypot(dx, dy, 1), i = (y * N + x) * 4;
    nd.data[i] = (-dx * l * 0.5 + 0.5) * 255; nd.data[i + 1] = (dy * l * 0.5 + 0.5) * 255; nd.data[i + 2] = (l * 0.5 + 0.5) * 255; nd.data[i + 3] = 255;
  }
  nc.putImageData(nd, 0, 0);
  return { kleur: K, normaal: Nn, ruw: Rr };
}

function kopie(beeld, maat) { const c = document.createElement("canvas"); c.width = c.height = maat; c.getContext("2d").drawImage(beeld, 0, 0, maat, maat); return c; }

window.bak = async () => {
  const uit = {};
  const jpg = (c, q = 0.9) => c.toDataURL("image/jpeg", q);
  // Kleur op 2048 (de gouden ringetjes moeten scherp blijven), normaal en ORM op 1024: dat scheelt geheugen op een telefoon.
  for (const [naam, b] of [["ster", bakSter()], ["vierkant", bakVierkant()]]) {
    uit[`${naam}_kleur.jpg`] = jpg(b.kleur, 0.88); uit[`${naam}_normaal.jpg`] = jpg(kopie(b.normaal, 1024), 0.9); uit[`${naam}_orm.jpg`] = jpg(kopie(b.orm, 1024), 0.85);
  }
  const r = bakRand(); uit["rand_kleur.jpg"] = jpg(r.kleur); uit["rand_normaal.jpg"] = jpg(r.normaal, 0.93);
  const s = bakBeslag(); uit["beslag_kleur.jpg"] = jpg(s.kleur); uit["beslag_normaal.jpg"] = jpg(s.normaal, 0.93);
  const t = bakTafel(); uit["tafel_kleur.jpg"] = jpg(t.kleur, 0.9); uit["tafel_normaal.jpg"] = jpg(kopie(t.normaal, 512), 0.8); uit["tafel_ruw.jpg"] = jpg(kopie(t.ruw, 256), 0.8);
  return uit;
};
window.bakKlaar = true;
