// Meet hoe lang het duurt tot je op /play/ een Zet kunt doen (taak 114), bij koude cache.
//
//   npx vite build   (in web/; zet web/src/wasm3d erbij als je ook het 3D-bord wilt meten)
//   node web/scripts/meet-eerste-zet.mjs [--netwerk=snel4g|geen] [--cpu=4|1] [--herhaal=3] [--afdruk=pad.png] [--poort=8881]
//
// Het serveert web/dist zelf (met brotli, zoals Cloudflare), start Chromium headless met een
// schoon profiel (dus koude cache) en meet via het Chrome DevTools Protocol. Geen extra pakketten
// (Node 22 of nieuwer voor WebSocket). Geeft per run de tijden in ms sinds het begin van de navigatie.
import { spawn } from "node:child_process";
import fs from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";

const arg = (naam, standaard) => {
  const a = process.argv.find((x) => x.startsWith(`--${naam}=`));
  return a ? a.slice(naam.length + 3) : standaard;
};
const netwerk = arg("netwerk", "snel4g");
const cpu = Number(arg("cpu", "4"));
const herhaal = Number(arg("herhaal", "3"));
const afdruk = arg("afdruk", "");
const poort = Number(arg("poort", "8881"));
const cdpPoort = poort + 1000;
const pad = arg("pad", "/play/");
const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../dist");
const slaap = (ms) => new Promise((r) => setTimeout(r, ms));

// ---- Statische server met brotli (Cloudflare comprimeert ook met brotli).
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css", ".wasm": "application/wasm", ".svg": "image/svg+xml", ".png": "image/png", ".webp": "image/webp", ".woff2": "font/woff2", ".json": "application/json", ".webmanifest": "application/manifest+json" };
const brotliCache = new Map();
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (p.startsWith("/play") || p.startsWith("/uitnodiging/") || p.startsWith("/potje/")) p = "/play/index.html";
  if (p === "/") p = "/index.html";
  const bestand = path.join(dist, p);
  if (!bestand.startsWith(dist) || !fs.existsSync(bestand) || fs.statSync(bestand).isDirectory()) {
    res.writeHead(404).end("niet gevonden");
    return;
  }
  const ext = path.extname(bestand);
  const kop = { "content-type": TYPES[ext] ?? "application/octet-stream", "cache-control": "public, max-age=0" };
  const inhoud = fs.readFileSync(bestand);
  if ([".html", ".js", ".css", ".wasm", ".svg"].includes(ext) && /\bbr\b/.test(req.headers["accept-encoding"] ?? "")) {
    if (!brotliCache.has(bestand)) brotliCache.set(bestand, zlib.brotliCompressSync(inhoud, { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 9 } }));
    const br = brotliCache.get(bestand);
    res.writeHead(200, { ...kop, "content-encoding": "br", "content-length": br.length }).end(br);
  } else {
    res.writeHead(200, { ...kop, "content-length": inhoud.length }).end(inhoud);
  }
});
await new Promise((r) => server.listen(poort, "127.0.0.1", r));

// ---- Eén run: schoon profiel, throttling, meten.
async function run(nr) {
  const profiel = fs.mkdtempSync(path.join(os.tmpdir(), "leapstone-meting-"));
  const vlaggen = [
    "--headless=new", "--no-sandbox", "--hide-scrollbars", "--mute-audio",
    "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist",
    "--window-size=1280,800", `--remote-debugging-port=${cdpPoort}`, `--user-data-dir=${profiel}`, "--lang=en-US", "about:blank",
  ];
  const proces = spawn(process.env.CHROMIUM ?? "chromium", vlaggen, { stdio: "ignore" });
  try {
    let tab;
    for (let i = 0; i < 50 && !tab; i++) {
      await slaap(200);
      try {
        tab = (await (await fetch(`http://127.0.0.1:${cdpPoort}/json`)).json()).find((t) => t.type === "page");
      } catch { /* Chromium start nog */ }
    }
    if (!tab) throw new Error("Chromium start niet");
    const ws = new WebSocket(tab.webSocketDebuggerUrl);
    await new Promise((r, f) => ((ws.onopen = r), (ws.onerror = f)));
    let id = 0;
    const wacht = new Map();
    let bytes = 0;
    const fouten = [];
    ws.onmessage = (e) => {
      const m = JSON.parse(e.data);
      if (m.method === "Network.loadingFinished") bytes += m.params.encodedDataLength;
      if (m.method === "Runtime.exceptionThrown") fouten.push(m.params.exceptionDetails?.exception?.description ?? "fout");
      if (m.id && wacht.has(m.id)) (wacht.get(m.id)(m), wacht.delete(m.id));
    };
    const cdp = (method, params = {}) => new Promise((r, f) => {
      const i = ++id;
      wacht.set(i, (m) => (m.error ? f(new Error(`${method}: ${m.error.message}`)) : r(m.result)));
      ws.send(JSON.stringify({ id: i, method, params }));
    });
    const js = async (x) => (await cdp("Runtime.evaluate", { expression: x, awaitPromise: true, returnByValue: true })).result.value;

    await cdp("Page.enable");
    await cdp("Runtime.enable");
    await cdp("Network.enable");
    await cdp("Network.clearBrowserCache");
    await cdp("Emulation.setDeviceMetricsOverride", { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false });
    if (netwerk === "snel4g") {
      // DevTools "Fast 4G": 9 Mbit/s omlaag, 1,5 Mbit/s omhoog, 165 ms vertraging.
      await cdp("Network.emulateNetworkConditions", { offline: false, latency: 165, downloadThroughput: (9 * 1024 * 1024) / 8, uploadThroughput: (1.5 * 1024 * 1024) / 8 });
    }
    if (cpu > 1) await cdp("Emulation.setCPUThrottlingRate", { rate: cpu });
    // Vanaf de eerste milliseconde: noteer wanneer er een bord staat waarop je kunt zetten.
    await cdp("Page.addScriptToEvaluateOnNewDocument", {
      source: `window.__t = {};
        const mark = (k) => { if (!(k in __t)) __t[k] = Math.round(performance.now()); };
        const poll = () => {
          if (document.querySelector('.steen[data-speler]')) mark('stenenInDom');
          if (document.querySelector('.plaat svg .steen, .plaat .steen')) mark('bord2dZichtbaar');
          if (document.querySelector('.bord3d.klaar')) mark('bord3dKlaar');
          requestAnimationFrame(poll);
        };
        addEventListener('DOMContentLoaded', () => { mark('dcl'); poll(); });
        addEventListener('load', () => mark('load'));
        __t.langeTaken = [];
        addEventListener('pointerdown', (e) => { __t.pd ??= [Math.round(e.timeStamp), Math.round(performance.now())]; }, true);
        addEventListener('click', (e) => { __t.cl ??= Math.round(performance.now()); }, true);
        try { new PerformanceObserver((l) => { for (const e of l.getEntries()) __t.invoer = { vertragingMs: Math.round(e.processingStart - e.startTime), duurMs: Math.round(e.duration), soort: e.name }; }).observe({ type: 'first-input', buffered: true }); } catch {}
        try { new PerformanceObserver((l) => { for (const e of l.getEntries()) __t.langeTaken.push([Math.round(e.startTime), Math.round(e.duration)]); }).observe({ entryTypes: ['longtask'] }); } catch {}`,
    });
    await cdp("Page.navigate", { url: `http://127.0.0.1:${poort}${pad}` });
    const tot = Date.now() + 90000;
    let t = {};
    while (Date.now() < tot) {
      await slaap(100);
      t = (await js("window.__t")) ?? {};
      if (t.bord3dKlaar || t.bord2dZichtbaar) break;
    }
    // Schermafdruk direct na laden, voor de tik.
    if (afdruk && nr === 1) fs.writeFileSync(afdruk, Buffer.from((await cdp("Page.captureScreenshot", { format: "png" })).data, "base64"));
    // Een echte tik met de muis op een eigen steen: hoe lang tot hij gekozen is?
    let tikMs = null;
    if (t.bord2dZichtbaar) {
      const midden = JSON.parse(await js(`(() => { const r = document.querySelector('.steen.kan').getBoundingClientRect(); return JSON.stringify({ x: r.x + r.width / 2, y: r.y + r.height / 2 }); })()`));
      const tik = async () => {
        await cdp("Input.dispatchMouseEvent", { type: "mousePressed", x: midden.x, y: midden.y, button: "left", clickCount: 1 });
        await cdp("Input.dispatchMouseEvent", { type: "mouseReleased", x: midden.x, y: midden.y, button: "left", clickCount: 1 });
      };
      const t0 = Date.now();
      await tik();
      while (Date.now() - t0 < 10000 && !(await js(`!!document.querySelector('.steen.gekozen')`))) await slaap(20);
      tikMs = Date.now() - t0;
      const w = await js("window.__t");
      t.invoer = w.invoer;
      t.pointerdownOntvangen = w.pd;
      t.klikOntvangen = w.cl;
      t.tikVerstuurdOp = t0 - (await js("Date.now() - performance.now()"));
      await tik(); // weer loslaten
    }
    // Wanneer wisselt het naar het 3D-bord?
    const tot3d = Date.now() + 90000;
    while (arg("wacht3d", "") && Date.now() < tot3d && !t.bord3dKlaar) {
      await slaap(100);
      t = (await js("window.__t")) ?? t;
    }
    await slaap(1500);
    const info = await js(`JSON.stringify({ drieD: !!document.querySelector('.bord3d.klaar'), menu: !!document.querySelector('.keuzes'), stenen: document.querySelectorAll('.steen[data-speler]').length })`);
    if (afdruk && nr === 1) fs.writeFileSync(afdruk.replace(/\.png$/, "-3d.png"), Buffer.from((await cdp("Page.captureScreenshot", { format: "png" })).data, "base64"));
    const lang = (t.langeTaken ?? []).filter(([start]) => start > (t.bord2dZichtbaar ?? 0));
    t.langsteTaakNaBord = lang.reduce((m, [, d]) => Math.max(m, d), 0);
    if (arg("taken", "")) console.log("lange taken [start, duur]:", JSON.stringify(lang));
    delete t.langeTaken;
    t.tikNaarGekozenMs = tikMs;
    ws.close();
    return { ...t, ...JSON.parse(info), kB: Math.round(bytes / 1024), fouten: fouten.length };
  } finally {
    proces.kill();
    await slaap(300);
    fs.rmSync(profiel, { recursive: true, force: true });
  }
}

const uitkomst = [];
for (let i = 1; i <= herhaal; i++) {
  const r = await run(i);
  uitkomst.push(r);
  console.log(`run ${i}:`, JSON.stringify(r));
}
const eerste = uitkomst.map((r) => r.bord2dZichtbaar ?? r.bord3dKlaar).filter(Boolean).sort((a, b) => a - b);
console.log(`netwerk=${netwerk} cpu=${cpu}x  tot eerste mogelijke Zet (ms, eerste bord dat je ziet): mediaan ${eerste[Math.floor(eerste.length / 2)]}, kleinste ${eerste[0]}, grootste ${eerste.at(-1)}`);
server.close();
process.exit(0);
