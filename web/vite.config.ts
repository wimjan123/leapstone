import { defineConfig, type Plugin } from "vitest/config";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { VitePWA } from "vite-plugin-pwa";
import { SMART_APP_BANNER, UITNODIGING_PAGINA, uitnodigingHtml } from "./uitnodigingskaart";
// @ts-expect-error gewone JavaScript-module zonder typen
import { LANDING_TALEN } from "./landing/talen.mjs";

// De Landingspagina in elke taal (taak 132): web/landing/index.html (/) en web/landing/<code>/index.html (/<code>/), gemaakt uit web/landing/talen/.
const landingTalen: { code: string; adres: string }[] = LANDING_TALEN;
const landingBron = (taal: { adres: string; code: string }) => (taal.adres === "/" ? "landing/index.html" : `landing/${taal.code}/index.html`);

// De native app (Tauri) wordt gebouwd met `--mode app`: geen service worker en geen web-manifest.
const testEnv = (globalThis as { process?: { env: Record<string, string | undefined> } }).process?.env ?? {};
const devHost = (globalThis as { process?: { env: Record<string, string | undefined> } }).process?.env.TAURI_DEV_HOST;

// Het spel staat op /play/ (web/play/index.html). Op / staat de Landingspagina (web/landing/index.html, gewone HTML).
// In de native app (`--mode app`) is het spel juist index.html: Tauri laadt /, en de Landingspagina hoort er niet in.
function speladres(app: boolean): Plugin {
  return {
    name: "leapstone-speladres",
    configureServer(server) {
      // In de dev-server (web en app) geeft / het spel, zoals Tauri het verwacht.
      server.middlewares.use((verzoek, _res, next) => {
        const req = verzoek as { url?: string };
        if (req.url === "/" || req.url?.startsWith("/?")) req.url = "/play/index.html";
        next();
      });
    },
    // Na de plugin die de HTML maakt, anders bestaat play/index.html nog niet.
    enforce: "post",
    generateBundle: { order: "post", handler(_opties, bundel) {
      const spel = bundel["play/index.html"];
      if (app && spel) spel.fileName = "index.html";
      else if (spel && spel.type === "asset" && typeof spel.source === "string") {
        // Een Uitnodiging krijgt dezelfde pagina met een andere voorbeeldkaart (taak 115).
        this.emitFile({ type: "asset", fileName: UITNODIGING_PAGINA, source: uitnodigingHtml(spel.source) });
      }
      // De Landingspagina (/) en die in andere talen (/nl/, /de/, ...; taak 121 en 132).
      for (const taal of landingTalen) {
        const pagina = bundel[landingBron(taal)];
        if (app || !pagina) continue;
        pagina.fileName = `${taal.adres.slice(1)}index.html`;
        // De PWA-plugin zet in elke pagina de service worker; de Landingspagina is gewone HTML zonder JavaScript van de app.
        if (pagina.type === "asset" && typeof pagina.source === "string") {
          pagina.source = pagina.source.replace(/<script[^>]*registerSW[^>]*><\/script>\s*/g, "").replace(/<link[^>]*rel="manifest"[^>]*>\s*/g, "");
        }
      }
    } },
  };
}

// De Smart App Banner van Apple hoort op de webpagina's, niet in de native app (Tauri laadt dezelfde play/index.html).
function zonderAppBanner(app: boolean): Plugin {
  return {
    name: "leapstone-geen-app-banner",
    transformIndexHtml: { order: "pre", handler: (html) => (app ? html.replace(SMART_APP_BANNER, "") : html) },
  };
}

const env = (globalThis as { process?: { env: Record<string, string | undefined> } }).process?.env ?? {};

// Zonder het wasm-pakket falen alle tests en de dev-server met een verwarrende importfout; zeg direct wat te doen.
function wasmAanwezig(): Plugin {
  return {
    name: "leapstone-wasm-controle",
    config(_cfg, { command }) {
      const fs = (globalThis as { process?: { getBuiltinModule?: (n: string) => any } }).process?.getBuiltinModule?.("node:fs");
      const url = new URL("./src/wasm/halma_core.js", import.meta.url);
      if (command === "serve" && fs && !fs.existsSync(url)) throw new Error("web/src/wasm/halma_core.js is missing. Run 'npm --prefix web run wasm' first.");
    },
  };
}

// Zonder het 3D-bord (web/src/wasm3d) toont de app alleen het foutscherm (feature 251): er is geen plat scherm meer. Zeg dat
// hardop in de dev-server en bij `vite build`. Geen fout: de volledige check bouwt de site zonder 3D-bord (scripts/volledige-check.sh).
function bord3dAanwezig(): Plugin {
  const melding =
    "LET OP: web/src/wasm3d ontbreekt. Zonder 3D-bord ziet elke Speler alleen het foutscherm. Bouw het eerst: npm --prefix web run wasm3d:snel (werk) of npm --prefix web run wasm3d (uitrol).";
  const ontbreekt = () => {
    const fs = (globalThis as { process?: { getBuiltinModule?: (n: string) => any } }).process?.getBuiltinModule?.("node:fs");
    return !!fs && !fs.existsSync(new URL("./src/wasm3d/halma_bord3d.js", import.meta.url));
  };
  return {
    name: "leapstone-bord3d-controle",
    configureServer(server) {
      if (!env.VITEST && ontbreekt()) server.config.logger.warn(`\n${melding}\n`);
    },
    buildStart() {
      if (!env.VITEST && ontbreekt()) this.warn(melding);
    },
  };
}

// De WebAssembly van het 3D-bord (17 MB) gaat sterker geperst over de lijn dan Cloudflare doet: een `.wasm.xz` naast het gewone `.wasm`
// (xz -9e, venster 8 MiB: 3,2 MB tegen 4,7 MB met zstd niveau 3). src/wasmGeperst.ts haalt hem en pakt hem uit terwijl hij binnenkomt;
// het gewone bestand blijft de terugval en is wat de app (Tauri) gebruikt. Zonder het programma `xz` blijft het bij het gewone bestand.
function wasmGeperst(app: boolean): Plugin {
  return {
    name: "leapstone-wasm-geperst",
    apply: "build",
    enforce: "post",
    generateBundle: { order: "post", handler(_opties, bundel) {
      if (app || env.VITEST) return;
      const wasm = Object.values(bundel).find((b) => b.type === "asset" && /^assets\/halma_bord3d_bg-.*\.wasm$/.test(b.fileName));
      if (!wasm || wasm.type !== "asset") return;
      const proces = (globalThis as { process?: { getBuiltinModule?: (n: string) => any } }).process;
      const gedaan = proces?.getBuiltinModule?.("node:child_process")?.spawnSync("xz", ["-9e", "--lzma2=preset=9e,dict=8MiB", "--check=crc32", "-c"], { input: wasm.source, maxBuffer: 1 << 28 });
      if (!gedaan || gedaan.status !== 0 || !gedaan.stdout?.length) return this.warn("LET OP: het programma xz ontbreekt of faalde: het 3D-bord komt ongeperst (4,7 MB in plaats van 3,2 MB over de lijn).");
      this.emitFile({ type: "asset", fileName: `${wasm.fileName}.xz`, source: new Uint8Array(gedaan.stdout) });
    } },
  };
}

export default defineConfig(({ mode }) => ({
  // __HALMA_TESTBUILD__: een debug-build van de app (Tauri zet TAURI_ENV_DEBUG) of de telefoon-APK (scripts/android.mjs zet LEAPSTONE_TESTBUILD). Winkelbuilds zetten geen van beide.
  define: { __HALMA_APP__: JSON.stringify(mode === "app"), __HALMA_TESTBUILD__: JSON.stringify(mode === "app" && (testEnv.TAURI_ENV_DEBUG === "true" || testEnv.LEAPSTONE_TESTBUILD === "1")) },
  plugins: [
    wasmAanwezig(),
    bord3dAanwezig(),
    svelte(),
    speladres(mode === "app"),
    zonderAppBanner(mode === "app"),
    wasmGeperst(mode === "app"),
    mode !== "app" && VitePWA({
      registerType: "autoUpdate",
      // De app meldt de service worker zelf aan, na de eerste tafel (main.ts): anders deelt de precache de lijn met het 3D-bord.
      injectRegister: false,
      includeAssets: ["apple-touch-icon.png", "favicon.png"],
      strategies: "injectManifest",
      srcDir: ".",
      filename: "sw.ts",
      // Het 3D-bord (groot) niet in de precache; sw.ts bewaart hem bij het eerste gebruik.
      injectManifest: {
        globPatterns: ["**/*.{js,css,html,wasm,png,svg,webp,woff2}"],
        // De Landingspagina (/), de spelregelpagina's (/rules/) en hun beelden horen niet bij het spel offline.
        globIgnores: ["**/halma_bord3d*", "index.html", "404.html", "**/landing-*", "**/app-store-badge*", "uitnodiging-kaart/**", "rules/**", "guides/**", ...landingTalen.filter((t) => t.adres !== "/").map((t) => `${t.code}/**`)],
      },
      devOptions: { enabled: false },
      manifest: {
        name: "Leapstone",
        short_name: "Leapstone",
        lang: "en",
        start_url: "/play/",
        // Scope blijft "/": de service worker die Spelers al hebben, blijft dezelfde (en hun Meldingen ook).
        scope: "/",
        display: "standalone",
        orientation: "portrait",
        theme_color: "#0b0e18",
        background_color: "#0b0e18",
        icons: [
          { src: "icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icon-512.png", sizes: "512x512", type: "image/png" },
          { src: "icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
    }),
  ],
  // Keep .wasm as a separate file so the service worker precaches it by name.
  build: { rollupOptions: { input: mode === "app" ? "play/index.html" : ["play/index.html", ...landingTalen.map(landingBron)] }, assetsInlineLimit: (file) => (file.endsWith(".wasm") ? false : undefined) },
  resolve: mode === "test" ? { conditions: ["browser"] } : undefined,
  // TAURI_DEV_HOST: het adres waarop de emulator of telefoon de dev-server bereikt.
  server: {
    proxy: { "/api": "http://127.0.0.1:8787" },
    ...(devHost ? { host: devHost, port: 5173, strictPort: true } : {}),
  },
  // Bouwers delen een machine: standaard 2 werkers en een ruime tijdslimiet. De volledige check zet VITEST_MAX_WORKERS op het aantal kernen, hooguit 8.
  test: { environment: "jsdom", testTimeout: 20000, maxWorkers: Number(env.VITEST_MAX_WORKERS) || 2 },
}));
