#!/usr/bin/env node
// Meet hoe lang het duurt tot de 3D-tafel van het Startmenu in beeld is, koud geladen uit de gebouwde site (web/dist), over een
// nagebootste trage telefoon: de verbinding en processor van Lighthouse mobiel (slow 4G, 4 keer trager).
//
//   npm --prefix web run build:site          (met web/src/wasm3d uit `npm run wasm3d`: het cijfer hangt aan de grootte)
//   node web/scripts/meet-laden.mjs [--runs=5] [--profiel=traag4g|snel4g|geen] [--dist=web/dist] [--dpr=1] [--cpu=4] [--tegelijk=1] [--json=pad]
//
// - De server hieronder doet Cloudflare na: zstd niveau 3 op tekst, JavaScript en WebAssembly (live gemeten 2026-11-14: 17,0 MB
//   wordt 4,67 MB), niets op JPEG en .bin, dezelfde Cache-Control. De verbinding knijpt hij zelf af: alle antwoorden delen één
//   bandbreedte en elk verzoek wacht één heen-en-weer. Zo geldt de grens ook voor wat de service worker ophaalt; de
//   netwerkrem van Chromium (CDP) slaat die over.
// - Uitvoer per run: `tafel` (ms tot de tafel in beeld is, het cijfer), `fout` (ms tot het foutscherm, of -), `wasm` (ms tot de
//   WebAssembly binnen is), bytes en verzoeken tot de tafel, en fouten. Onderaan de mediaan en het bereik.
// - Zonder grafische kaart tekent Chromium in software: de tijd na `wasm` is dan langer dan op een telefoon. Vergelijk alleen
//   metingen van dezelfde machine en dezelfde `--dpr`.
import { createServer } from "node:http";
import { existsSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { zstdCompressSync, constants } from "node:zlib";
import { opties, startBrowser, WEB } from "./bord-hulp.mjs";

const PROFIELEN = {
  // Lighthouse mobiel (devtools-throttling): 1,6 Mbit/s keer 0,9 omlaag, 150 ms heen-en-weer.
  traag4g: { bytesPerSeconde: 184320, rttMs: 150, verbindingMs: 450 },
  // "Fast 4G" van Chrome DevTools: 9 Mbit/s omlaag, 165 ms.
  snel4g: { bytesPerSeconde: 1125000, rttMs: 165, verbindingMs: 495 },
  geen: { bytesPerSeconde: Infinity, rttMs: 0, verbindingMs: 0 },
};
const SOORT = {
  ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".wasm": "application/wasm", ".json": "application/json",
  ".webmanifest": "application/manifest+json", ".svg": "image/svg+xml", ".txt": "text/plain", ".xml": "application/xml",
  ".jpg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".avif": "image/avif", ".woff2": "font/woff2", ".bin": "application/octet-stream",
};
const GEPERST = new Set([".html", ".js", ".css", ".wasm", ".json", ".webmanifest", ".svg", ".txt", ".xml"]);

const o = opties({ runs: 5, profiel: "traag4g", dist: path.join(WEB, "dist"), dpr: 1, cpu: 4, json: "", maxMs: 120000, tegelijk: 1, gpu: false });
const profiel = PROFIELEN[o.profiel];
if (!profiel) throw new Error(`Onbekend profiel ${o.profiel}: kies ${Object.keys(PROFIELEN).join(", ")}`);
const dist = path.resolve(o.dist);
if (!existsSync(path.join(dist, "play/index.html"))) throw new Error(`${dist}/play/index.html ontbreekt. Bouw eerst: npm --prefix web run build:site`);

/** Eén bandbreedte voor alle antwoorden samen: om de beurt een stukje, zoals verzoeken op één verbinding de lijn delen. */
function maakLijn(bytesPerSeconde) {
  const wachtrij = [];
  let tegoed = 0, vorig = performance.now(), klok = null;
  const STUK = 2048;
  const tik = () => {
    const nu = performance.now();
    tegoed = Math.min(tegoed + ((nu - vorig) / 1000) * bytesPerSeconde, bytesPerSeconde / 10);
    vorig = nu;
    while (wachtrij.length && tegoed >= 1) {
      const taak = wachtrij.shift();
      const n = Math.min(STUK, taak.data.length - taak.plek, Math.ceil(tegoed));
      taak.res.write(taak.data.subarray(taak.plek, taak.plek + n));
      taak.plek += n;
      tegoed -= n;
      if (taak.plek >= taak.data.length || taak.res.destroyed) taak.res.end();
      else wachtrij.push(taak);
    }
    if (!wachtrij.length) { clearInterval(klok); klok = null; }
  };
  return (res, data) => {
    if (bytesPerSeconde === Infinity) return res.end(data);
    wachtrij.push({ res, data, plek: 0 });
    if (!klok) { vorig = performance.now(); klok = setInterval(tik, 5); }
  };
}

const geperst = new Map();
function lichaam(bestand, ext) {
  if (!GEPERST.has(ext)) return { data: readFileSync(bestand), codering: null };
  const sleutel = `${bestand}:${statSync(bestand).mtimeMs}`;
  if (!geperst.has(sleutel)) geperst.set(sleutel, zstdCompressSync(readFileSync(bestand), { params: { [constants.ZSTD_c_compressionLevel]: 3 } }));
  return { data: geperst.get(sleutel), codering: "zstd" };
}

/** Het bestand bij een adres, zoals de Worker het geeft: /play/ en een Uitnodiging geven het spel. */
function bestandVan(adres) {
  let p = decodeURIComponent(new URL(adres, "http://x").pathname);
  if (p.endsWith("/")) p += "index.html";
  const b = path.join(dist, p);
  return b.startsWith(dist) && existsSync(b) && statSync(b).isFile() ? b : null;
}

/** Een eigen server per run: elke run heeft zijn eigen lijn, ook als er meer tegelijk lopen. */
async function startServer() {
  const stuur = maakLijn(profiel.bytesPerSeconde);
  const telling = { verzoeken: 0, bytes: 0, mis: 0 };
  const server = createServer((req, res) => {
    const vers = !req.socket.__gezien;
    req.socket.__gezien = true;
    const bestand = bestandVan(req.url);
    setTimeout(() => {
      telling.verzoeken++;
      if (!bestand) { telling.mis++; res.writeHead(404); return res.end(); }
      const ext = path.extname(bestand);
      const { data, codering } = lichaam(bestand, ext);
      telling.bytes += data.length;
      res.writeHead(200, {
        "Content-Type": SOORT[ext] ?? "application/octet-stream", "Content-Length": data.length, "Cache-Control": "public, max-age=0, must-revalidate",
        ...(codering ? { "Content-Encoding": codering } : {}),
      });
      stuur(res, data);
    }, profiel.rttMs + (vers ? profiel.verbindingMs : 0));
  });
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  return { basis: `http://localhost:${server.address().port}`, telling, stop: () => { server.close(); server.closeAllConnections?.(); } };
}

/** Loopt in de pagina mee en schrijft op wanneer de tafel, het foutscherm en het eerste beeld van Bevy er zijn. */
const MEEKIJKER = () => {
  const m = (globalThis.__meet = { tafel: null, fout: null, start: null, beeld: null });
  const kijk = () => {
    const nu = performance.now();
    const b = globalThis.__halmaBord3d;
    if (m.start === null && b) m.start = nu;
    try { if (m.beeld === null && b && b.beelden() > 0) m.beeld = nu; } catch { /* nog niet gestart */ }
    if (m.fout === null && document.querySelector(".fout3d")) m.fout = nu;
    if (m.tafel === null && document.querySelector(".bord3d-laag.aan") && performance.getEntriesByName("tafel").length) m.tafel = performance.getEntriesByName("tafel")[0].startTime;
    if (m.tafel === null) setTimeout(kijk, 50);
  };
  kijk();
};

async function eenRun(nr) {
  const { basis, telling, stop } = await startServer();
  const sessie = await startBrowser({ breedte: 412, hoogte: 823, dpr: o.dpr, gpu: !!o.gpu });
  const fouten = [];
  try {
    const p = await sessie.ctx.newPage();
    p.on("pageerror", (e) => fouten.push(`pagina: ${e.message.slice(0, 160)}`));
    p.on("requestfailed", (r) => fouten.push(`verzoek: ${r.url().slice(-60)} ${r.failure()?.errorText}`));
    p.on("response", (r) => { if (r.status() >= 400) fouten.push(`status ${r.status()}: ${r.url().slice(-60)}`); });
    const cdp = await sessie.ctx.newCDPSession(p);
    await cdp.send("Emulation.setDeviceMetricsOverride", { width: 412, height: 823, deviceScaleFactor: 0, mobile: false });
    if (o.cpu > 1) await cdp.send("Emulation.setCPUThrottlingRate", { rate: o.cpu });
    await p.addInitScript(MEEKIJKER);
    await p.goto(`${basis}/play/`, { waitUntil: "commit" });
    const begin = Date.now();
    let m = null;
    while (Date.now() - begin < o.maxMs) {
      m = await p.evaluate(() => globalThis.__meet).catch(() => null);
      if (m?.tafel != null) break;
      await p.waitForTimeout(250);
    }
    const bronnen = await p.evaluate(() => performance.getEntriesByType("resource").map((e) => ({ naam: e.name.split("/").pop(), eind: e.responseEnd, bytes: e.transferSize })));
    const wasm = bronnen.find((b) => /halma_bord3d_bg.*\.wasm(\.xz)?$/.test(b.naam));
    const canvas = await p.evaluate(() => { const c = document.getElementById("bord3d"); return c ? c.width : 0; });
    const uit = {
      run: nr, tafel: m?.tafel ?? null, fout: m?.fout ?? null, start: m?.start ?? null, beeld: m?.beeld ?? null, wasm: wasm?.eind ?? null,
      bytes: telling.bytes, verzoeken: telling.verzoeken, mis: telling.mis, canvas, fouten,
    };
    const s = (v) => (v == null ? "-" : (v / 1000).toFixed(2));
    console.log(`run ${nr}: tafel ${s(uit.tafel)} s, fout ${s(uit.fout)} s, wasm ${s(uit.wasm)} s, start ${s(uit.start)} s, beeld ${s(uit.beeld)} s, ${(uit.bytes / 1e6).toFixed(2)} MB in ${uit.verzoeken} verzoeken, canvas ${canvas} px, fouten ${fouten.length + uit.mis}${fouten.length ? ` (${fouten[0]})` : ""}`);
    return uit;
  } finally {
    await sessie.browser.close();
    stop();
  }
}

// `--tegelijk`: zoveel runs naast elkaar, elk met een eigen browser, server en lijn. Houd het ruim onder het aantal vrije kernen.
const runs = [];
for (let i = 1; i <= o.runs; i += o.tegelijk) {
  runs.push(...(await Promise.all(Array.from({ length: Math.min(o.tegelijk, o.runs - i + 1) }, (_, k) => eenRun(i + k)))));
}

const mediaan = (l) => { const s = [...l].sort((a, b) => a - b); return s.length ? (s[(s.length - 1) >> 1] + s[s.length >> 1]) / 2 : null; };
const tafels = runs.map((r) => r.tafel).filter((v) => v != null);
const uit = {
  profiel: o.profiel, dpr: o.dpr, cpu: o.cpu, runs: runs.length, gelukt: tafels.length,
  tafelMediaan: mediaan(tafels), tafelMin: tafels.length ? Math.min(...tafels) : null, tafelMax: tafels.length ? Math.max(...tafels) : null,
  wasmMediaan: mediaan(runs.map((r) => r.wasm).filter((v) => v != null)),
  bytesMediaan: mediaan(runs.map((r) => r.bytes)), foutscherm: runs.filter((r) => r.fout != null).length,
  fouten: runs.reduce((n, r) => n + r.fouten.length + r.mis, 0), details: runs,
};
const sec = (v) => (v == null ? "-" : (v / 1000).toFixed(2));
console.log(`\ntafel in beeld: mediaan ${sec(uit.tafelMediaan)} s (bereik ${sec(uit.tafelMin)} tot ${sec(uit.tafelMax)}), ${uit.gelukt} van ${uit.runs} runs; foutscherm in ${uit.foutscherm} runs; wasm binnen na ${sec(uit.wasmMediaan)} s; ${(uit.bytesMediaan / 1e6).toFixed(2)} MB; fouten ${uit.fouten}; profiel ${o.profiel}, cpu ${o.cpu}x, dpr ${o.dpr}`);
if (o.json) writeFileSync(o.json, JSON.stringify(uit, null, 1));
process.exit(uit.gelukt === uit.runs && uit.fouten === 0 ? 0 : 1);
