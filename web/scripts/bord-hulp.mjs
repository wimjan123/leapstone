// Gedeelde hulp voor schermen.mjs en meet-bord.mjs: de app met een nep-server, Chromium met een ECHTE schermdichtheid, en aanraking.
// Alle gegevens zijn VOORBEELDGEGEVENS (scripts/nep/nep.js). Zie docs/bord3d.md en docs/bouwers.md.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const WEB = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
export const slaap = (ms) => new Promise((r) => setTimeout(r, ms));

/** Leest --naam=waarde of --vlag uit de argumenten. */
export function opties(standaard) {
  const uit = { ...standaard, _: [] };
  for (const a of process.argv.slice(2)) {
    const m = /^--([\w-]+)(?:=(.*))?$/.exec(a);
    if (!m) { uit._.push(a); continue; }
    const v = m[2] ?? true;
    uit[m[1]] = typeof standaard[m[1]] === "number" ? Number(v) : v;
  }
  return uit;
}

async function laadPlaywright() {
  try { return await import("playwright-core"); } catch {
    throw new Error("playwright-core ontbreekt. Draai: npm --prefix web ci   (en voor de browser: npx playwright-core install chromium)");
  }
}

/**
 * Start de Vite-dev-server van de web-app op 127.0.0.1. Geeft { url, stop }.
 * `plugins`: extra Vite-plugins. `api`: het adres van een server (de Worker) waar /api heen gaat, ook de live verbinding (WebSocket).
 */
export async function startDevServer({ poort = 5199, wasm3d = false, plugins = [], api } = {}) {
  if (!existsSync(path.join(WEB, "src/wasm/halma_core.js"))) throw new Error("web/src/wasm/halma_core.js ontbreekt. Draai eerst scripts/bouwer-start.sh");
  if (wasm3d && !existsSync(path.join(WEB, "src/wasm3d/halma_bord3d.js"))) {
    throw new Error("Het 3D-bord ontbreekt (web/src/wasm3d). Bouw het eerst: npm --prefix web run wasm3d:snel (zie docs/bouwers.md). Zonder 3D-bord toont de app alleen het foutscherm (feature 251).");
  }
  const { createServer } = await import("vite");
  const server = await createServer({
    root: WEB, configFile: path.join(WEB, "vite.config.ts"), logLevel: "error",
    plugins,
    server: { port: poort, strictPort: true, host: "127.0.0.1", ...(api ? { proxy: { "/api": { target: api, ws: true } } } : {}) },
    optimizeDeps: { exclude: ["halma_core", "halma_bord3d"], noDiscovery: true, include: [] },
  });
  await server.listen();
  return { url: `http://127.0.0.1:${poort}`, stop: () => server.close() };
}

/** Start de Vite-dev-server met de nep-pagina op /nep. Geeft { url, stop }. */
export async function startNepServer({ poort = 5199, wasm3d = false } = {}) {
  const nepPagina = {
    name: "nep-pagina",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith("/nep")) return next();
        res.setHeader("Content-Type", "text/html");
        res.end(await server.transformIndexHtml("/nep", readFileSync(path.join(WEB, "scripts/nep/nep.html"), "utf8")));
      });
    },
  };
  const server = await startDevServer({ poort, wasm3d, plugins: [nepPagina] });
  return { url: `${server.url}/nep`, stop: server.stop };
}

/** Zoekt een al gedownloade Chromium (nieuwste eerst), zodat er niets gedownload hoeft te worden. Zet CHROME om een andere te kiezen. */
function vindChromium() {
  const map = path.join(homedir(), ".cache/ms-playwright");
  if (!existsSync(map)) return undefined;
  for (const d of readdirSync(map).filter((x) => /^chromium-\d+$/.test(x)).sort((a, b) => Number(b.split("-")[1]) - Number(a.split("-")[1]))) {
    for (const sub of ["chrome-linux64/chrome", "chrome-linux/chrome"]) if (existsSync(path.join(map, d, sub))) return path.join(map, d, sub);
  }
  return undefined;
}

/**
 * Start Chromium met een ECHTE schermdichtheid (--force-device-scale-factor), nooit met de emulatie
 * (Playwright deviceScaleFactor), want die geeft het 3D-bord een canvas zonder schermdichtheid (docs/bord3d.md).
 * gpu=true: de grafische kaart van de machine (ANGLE/GL) in plaats van software-rendering (SwiftShader).
 */
export async function startBrowser({ breedte = 390, hoogte = 844, dpr = 3, aanraking = true, gpu = false, extra = [] } = {}) {
  const { chromium } = await laadPlaywright();
  // gpu="vulkan" (`--gpu=vulkan`): ANGLE op Vulkan. Op aws-gpu-2 (Nvidia, geen scherm) valt `--use-angle=gl` stil terug op
  // SwiftShader; Vulkan haalt daar wel de grafische kaart (break-ui-ronde, 2026-11-16).
  const grafisch = gpu === "vulkan"
    ? ["--use-angle=vulkan", "--enable-features=Vulkan", "--ignore-gpu-blocklist", "--enable-gpu-rasterization"]
    : gpu
    ? ["--use-gl=angle", "--use-angle=gl", "--ignore-gpu-blocklist", "--enable-gpu-rasterization"]
    : ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist", "--enable-webgl"];
  const uitvoerbaar = process.env.CHROME || vindChromium();
  const browser = await chromium.launch({ executablePath: uitvoerbaar, args: ["--no-sandbox", ...grafisch, ...extra, `--force-device-scale-factor=${dpr}`, `--window-size=${breedte},${hoogte}`] });
  const ctx = await browser.newContext({ viewport: null, hasTouch: aanraking, userAgent: aanraking ? UA : undefined, locale: "en-US" });
  return { browser, ctx, breedte, hoogte, dpr };
}

/**
 * Laat de app zich voordoen als `https://<domein>`: Chromium vraagt dat adres, en dit geeft het antwoord van de dev-server terug.
 * Voor schermafdrukken waar het adres van de pagina zichtbaar is (de Uitnodigingslink zet `location.origin` in de tekst), zodat er
 * geen 127.0.0.1 met een poort in staat. Geeft het nieuwe basisadres van de nep-pagina. Er is geen echte verbinding met dat domein.
 */
export async function metDomein(ctx, domein, nepUrl) {
  const bron = new URL(nepUrl);
  await ctx.route(`https://${domein}/**`, async (route) => {
    const u = new URL(route.request().url());
    const r = await route.fetch({ url: `${bron.origin}${u.pathname}${u.search}` });
    await route.fulfill({ response: r });
  });
  return `https://${domein}${bron.pathname}`;
}

/** Zet de viewport op breedte x hoogte CSS-px zonder de schermdichtheid te veranderen (deviceScaleFactor 0 = niet overschrijven). */
export async function zetMaat(ctx, p, breedte, hoogte) {
  const cdp = await ctx.newCDPSession(p);
  await cdp.send("Emulation.setDeviceMetricsOverride", { width: breedte, height: hoogte, deviceScaleFactor: 0, mobile: false });
}

/** Stopt met een duidelijke melding als de schermdichtheid niet echt is: canvasbreedte moet vensterbreedte x schermdichtheid zijn. */
export async function controleDichtheid(p, dpr) {
  const m = await p.evaluate(() => { const c = document.getElementById("bord3d"); return { innerW: innerWidth, dpr: devicePixelRatio, canvasW: c ? c.width : null }; });
  const fout = m.dpr !== dpr || (m.canvasW !== null && Math.abs(m.canvasW - Math.round(m.innerW * dpr)) > 1);
  if (fout) {
    throw new Error(`Het canvas heeft geen echte schermdichtheid (venster ${m.innerW}, schermdichtheid ${m.dpr}, canvas ${m.canvasW}, verwacht ${Math.round(m.innerW * dpr)}). Gebruik --force-device-scale-factor, geen deviceScaleFactor. Zie docs/bord3d.md.`);
  }
  return m;
}

/** Opent een pagina van de nep-app. query: bijvoorbeeld "taal=ar&extra=1". */
export async function open(sessie, basis, query = "", opties = {}) {
  // Chromium laat een nieuwe pagina op de grafische kaart af en toe crashen ("Page crashed" bij het laden): dan één keer opnieuw.
  for (let poging = 1; ; poging++) {
    try { return await openEenmaal(sessie, basis, query, opties); } catch (e) {
      if (poging >= 3 || !/crashed/i.test(String(e.message))) throw e;
      console.log(`[pagina gecrasht bij het openen, poging ${poging + 1}]`);
    }
  }
}

async function openEenmaal(sessie, basis, query, { wacht3d = true }) {
  const p = await sessie.ctx.newPage();
  p.on("pageerror", (e) => console.log("[pagina-fout]", e.message.slice(0, 300)));
  try {
    await zetMaat(sessie.ctx, p, sessie.breedte, sessie.hoogte);
    await p.goto(basis + (query ? "?" + query : ""), { waitUntil: "load" });
    await p.waitForSelector("nav button", { timeout: 90000 });
  } catch (e) { await p.close().catch(() => {}); throw e; }
  if (wacht3d) {
    for (let i = 0; i < 600; i++) {
      const k = await p.evaluate(() => { try { return globalThis.__halmaBord3d?.klaar() === true; } catch { return false; } });
      if (k) break;
      await p.waitForTimeout(200);
    }
  }
  await p.waitForTimeout(800);
  await controleDichtheid(p, sessie.dpr);
  return p;
}

/** Wacht tot het 3D-bord stilstaat: de plekken die `wijs` teruggeeft veranderen niet meer. */
export async function stil(p, n = 3, ms = 2000) {
  let vorig = "", gelijk = 0;
  for (let i = 0; i < 90 && gelijk < n; i++) {
    const b = await p.evaluate(() => { try { return JSON.stringify([__halmaBord3d.wijs(100, 300, -1, 0), __halmaBord3d.wijs(250, 450, -1, 0), __halmaBord3d.wijs(300, 600, -1, 0)]); } catch { return ""; } });
    gelijk = b === vorig && b !== "" ? gelijk + 1 : 0; vorig = b; await p.waitForTimeout(ms);
  }
}

/**
 * Wacht tot de pagina rustig is in plaats van een vaste tijd: het 3D-bord is klaar en Bevy tekent `stilMs` lang geen nieuw
 * beeld (Bevy tekent alleen als er iets beweegt). Zonder 3D-bord: twee beelden van de browser plus `stilMs` voor CSS-overgangen.
 * Op software-rendering (zonder --gpu) kan Bevy langer dan 300 ms over één beeld doen: geef dan een grotere `stilMs`.
 */
export async function rust(p, { stilMs = 300, maxMs = 20000 } = {}) {
  const begin = Date.now();
  const lees = () => p.evaluate(() => { try { const b = globalThis.__halmaBord3d; return b && document.getElementById("bord3d")?.offsetParent !== null ? { klaar: b.klaar(), n: b.beelden() } : null; } catch { return null; } });
  let vorig = await lees();
  if (!vorig) { await p.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))); await slaap(stilMs); return; }
  let sinds = Date.now();
  while (Date.now() - begin < maxMs) {
    await slaap(100);
    const nu = await lees();
    if (!nu) return;
    if (!nu.klaar || nu.n !== vorig.n) sinds = Date.now();
    else if (Date.now() - sinds >= stilMs) return;
    vorig = nu;
  }
}

/**
 * Neemt elk beeld op dat de browser tekent terwijl `doe()` loopt en tot de pagina daarna rustig is (CDP-screencast, JPEG).
 * Geeft [{ ms, data }]: ms sinds het begin van `doe`, data een Buffer. Voor een filmstrook van een animatie.
 */
export async function neemOp(ctx, p, doe, { maxMs = 4000 } = {}) {
  const cdp = await ctx.newCDPSession(p);
  const beelden = [];
  cdp.on("Page.screencastFrame", (f) => { beelden.push({ t: f.metadata.timestamp, data: Buffer.from(f.data, "base64") }); cdp.send("Page.screencastFrameAck", { sessionId: f.sessionId }).catch(() => {}); });
  await cdp.send("Page.startScreencast", { format: "jpeg", quality: 85, everyNthFrame: 1 });
  await slaap(120);
  const begin = Date.now() / 1000;
  await doe();
  await rust(p, { maxMs });
  await cdp.send("Page.stopScreencast");
  await cdp.detach().catch(() => {});
  return beelden.map((b) => ({ ms: Math.round((b.t - begin) * 1000), data: b.data }));
}

/** Aanraking via CDP. */
export async function aanraking(ctx, p) {
  const cdp = await ctx.newCDPSession(p);
  const raak = (type, x, y) => cdp.send("Input.dispatchTouchEvent", { type, touchPoints: type === "touchEnd" || type === "touchCancel" ? [] : [{ x, y, id: 1 }] });
  const tik = async (x, y) => { await raak("touchStart", x, y); await slaap(50); await raak("touchEnd"); };
  // `via`: eerst naar dit punt, dan naar b (een vinger die eerst uit de tikruimte gaat; zie `--richt` in meet-bord).
  const sleep = async (a, b, { stappen = 16, pauze = 24, wacht = 120, los = true, via = null } = {}) => {
    await raak("touchStart", a[0], a[1]); await slaap(60);
    if (via) {
      for (let i = 1; i <= 4; i++) { await raak("touchMove", a[0] + (via[0] - a[0]) * i / 4, a[1] + (via[1] - a[1]) * i / 4); await slaap(pauze); }
      a = via;
    }
    for (let i = 1; i <= stappen; i++) { await raak("touchMove", a[0] + (b[0] - a[0]) * i / stappen, a[1] + (b[1] - a[1]) * i / stappen); await slaap(pauze); }
    await slaap(wacht); if (los) await raak("touchEnd");
  };
  /** Twee vingers tegelijk (knijpen): `punten` is een lijst van [x, y], vinger i heeft id i + 1. */
  const raakMeer = (type, punten) => cdp.send("Input.dispatchTouchEvent", { type, touchPoints: type === "touchEnd" || type === "touchCancel" ? [] : punten.map(([x, y], i) => ({ x, y, id: i + 1 })) });
  return { raak, tik, sleep, raakMeer };
}

/**
 * De Potjes van de nep-server per bord: index in `__nep.potjes` en wie de tegenstander is (de knop in My games).
 * ster3, ster6 en ster6lang (3 en 6 Spelers; ster6lang met lange namen, taak 193) bestaan alleen met `extra=1` in het adres (scripts/nep/nep.js).
 */
export const POTJES = { ster: { index: 0, naam: /^Sam/ }, vierkant: { index: 1, naam: /^Noor/ }, ster3: { index: 7, naam: /Ada/ }, ster6: { index: 8, naam: /Cas/ }, ster6lang: { index: 9, naam: /Bartholomew/ } };

/** Opent in een geopend menu "My games" het Potje van `vorm` (zie `POTJES`). */
export async function openPotje(p, vorm) {
  // In elke taal: de knop op het voorwerp van het Startmenu.
  await p.locator('[data-voorwerp="potjes"]').first().click(); await p.waitForTimeout(1200);
  await p.getByRole("button", { name: POTJES[vorm].naam }).first().click();
}

// Positie en aanraking op het 3D-bord (via window.__nep en __halmaBord3d).
export const GEO_SRC = `
window.__geo = (() => {
  const plek = (sx, sy) => { const w = __halmaBord3d.wijs(sx, sy, -1, 0); return [w[0], w[1]]; };
  const schermPunt = (vierkant, k, r) => vierkant ? [k, r] : [k + r / 2, r * 0.866];
  function solve(bx, by, start) {
    let [sx, sy] = start || [innerWidth / 2, innerHeight / 2];
    for (let i = 0; i < 40; i++) {
      let [px, py] = plek(sx, sy);
      if (!Number.isFinite(px)) { sx = innerWidth / 2 + (Math.random() - .5) * 100; sy = innerHeight / 2 + (Math.random() - .5) * 100; continue; }
      const ex = bx - px, ey = by - py;
      if (Math.hypot(ex, ey) < 1e-3) break;
      const h = 2, [ax, ay] = plek(sx + h, sy), [cx, cy] = plek(sx, sy + h);
      const a = (ax - px) / h, b = (cx - px) / h, c = (ay - py) / h, d = (cy - py) / h;
      const det = a * d - b * c;
      sx += (d * ex - b * ey) / det; sy += (-c * ex + a * ey) / det;
    }
    return [sx, sy];
  }
  function bord(pi) { const p = __nep.potjes[pi]; return { p, vierkant: p.bord === "vierkant", pl: p.game.vak_plekken() }; }
  function vakPunt(pi, vak) { const { vierkant, pl } = bord(pi); return schermPunt(vierkant, pl[2 * vak], pl[2 * vak + 1]); }
  function gat(pi, vak) { const [bx, by] = vakPunt(pi, vak); return solve(bx, by); }
  // Zichtbaar midden van een steen: zwaartepunt van de punten die de steen echt raakt.
  function steen(pi, vak) {
    const [hx, hy] = gat(pi, vak); let n = 0, sx = 0, sy = 0;
    for (let y = hy - 110; y <= hy + 20; y += 2) for (let x = hx - 45; x <= hx + 45; x += 2) { const w = __halmaBord3d.wijs(x, y, -1, 0); if (w[3] === vak) { n++; sx += x; sy += y; } }
    return n ? [sx / n, sy / n, n] : [hx, hy, 0];
  }
  // Schermvector van het gat naar het punt op afstand (dx, dy) vakken in het bord.
  function buur(pi, vak, dx, dy) { const [bx, by] = vakPunt(pi, vak); const [g0x, g0y] = gat(pi, vak); const vierkant = bord(pi).vierkant; const p = vierkant ? [bx + dx, by + dy] : [bx + dx + dy / 2, by + dy * 0.866]; const [g1x, g1y] = solve(p[0], p[1], [g0x, g0y]); return [g1x - g0x, g1y - g0y]; }
  // Waar moet de vinger zijn zodat de gesleepte steen (die boven de vinger hangt) boven het doelvak staat?
  function aim(pi, van, naar) {
    const [bx, by] = vakPunt(pi, naar); let [fx, fy] = gat(pi, naar);
    const f = (x, y) => { const q = __halmaBord3d.sleep(van, x, y); return [q[0], q[1]]; };
    for (let i = 0; i < 10; i++) {
      const [px, py] = f(fx, fy); if (!Number.isFinite(px)) break;
      const ex = bx - px, ey = by - py; if (Math.hypot(ex, ey) < 0.005) break;
      const h = 2, [ax, ay] = f(fx + h, fy), [cx, cy] = f(fx, fy + h);
      const a = (ax - px) / h, b = (cx - px) / h, c = (ay - py) / h, d = (cy - py) / h, det = a * d - b * c;
      fx += (d * ex - b * ey) / det; fy += (-c * ex + a * ey) / det;
    }
    __halmaBord3d.loslaten(-1);
    return [fx, fy];
  }
  return { plek, solve, gat, steen, buur, vakPunt, aim };
})();
`;
export const geo3d = async (p) => { await p.evaluate(GEO_SRC); };

