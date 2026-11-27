// Knopplaten (taak 183) in Chromium: een overzichtsbeeld van alle knoppen in vijf talen, naast scherm-start.png van het prototype,
// en de baktijd van alle knoppen voor één taal.
//
//   npm --prefix web run knopplaten -- [--talen=en,ar,ja,de,th] [--schaal=100] [--herhaal=10] [--uit=map] [--naast=pad/naar/scherm-start.png] [--poort=5198]
//
// Chromium zonder grafische kaart (alleen Canvas 2D, software); er is geen telefoon bij betrokken. De baktijd hangt van de machine af:
// noteer ze samen met de machine. Zie docs/bord3d.md, "Knopplaten".
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { tmpdir, cpus } from "node:os";
import path from "node:path";
import sharp from "sharp";
import { WEB, opties, startBrowser } from "./bord-hulp.mjs";

const o = opties({ talen: "en,ar,ja,de,th", schaal: 100, herhaal: 10, uit: path.join(tmpdir(), "leapstone-knopplaten"), naast: "/home/wvisser/ontwerp-leapstone/arena-147/kandidaat-1b/scherm-start.png", poort: 5198 });
const talen = String(o.talen).split(",").filter(Boolean);
mkdirSync(o.uit, { recursive: true });

const { createServer } = await import("vite");
const server = await createServer({
  root: WEB, configFile: path.join(WEB, "vite.config.ts"), logLevel: "error",
  server: { port: o.poort, strictPort: true, host: "127.0.0.1" },
  optimizeDeps: { exclude: ["halma_core", "halma_bord3d"], noDiscovery: true, include: [] },
});
await server.listen();
const sessie = await startBrowser({ dpr: 1, aanraking: false });
try {
  const p = await sessie.ctx.newPage();
  p.on("pageerror", (e) => console.log("[pagina-fout]", e.message.slice(0, 300)));
  p.on("console", (m) => { if (m.type() === "error") console.log("[console]", m.text().slice(0, 300)); });
  await p.goto(`http://127.0.0.1:${o.poort}/scripts/knopplaten.html`, { waitUntil: "load" });
  await p.waitForFunction(() => document.title === "klaar", null, { timeout: 60000 });

  console.log(`Baktijd van alle knoppen voor één taal (schaal ${o.schaal}, ${o.herhaal} keer, mediaan; ${cpus()[0].model.trim()}):`);
  const tijden = [];
  for (const t of talen) {
    const m = await p.evaluate(([taal, n, s]) => window.__knop.meet(taal, n, s), [t, Number(o.herhaal), Number(o.schaal)]);
    tijden.push(m);
    console.log(`  ${t}: eerste keer (met lettertypen laden) ${m.eerste.toFixed(0)} ms, daarna mediaan ${m.mediaan.toFixed(0)} ms, langste ${m.langste.toFixed(0)} ms`);
  }
  const slechtste = Math.max(...tijden.map((m) => m.langste));
  console.log(slechtste < 300 ? `  Alle bakrondes onder 300 ms (langste ${slechtste.toFixed(0)} ms).` : `  TE LANG: langste ${slechtste.toFixed(0)} ms, grens 300 ms.`);
  writeFileSync(path.join(o.uit, "baktijden.json"), JSON.stringify({ machine: cpus()[0].model.trim(), schaal: Number(o.schaal), tijden }, null, 1));

  const url = await p.evaluate(([t, s]) => window.__knop.overzicht(t, s), [talen, Number(o.schaal)]);
  const beeld = Buffer.from(url.split(",")[1], "base64");
  const overzicht = path.join(o.uit, "knopplaten-overzicht.png");
  writeFileSync(overzicht, beeld);
  console.log("Overzicht:", overzicht);
  if (existsSync(o.naast)) {
    const meta = await sharp(beeld).metadata();
    const links = await sharp(o.naast).resize({ height: meta.height }).png().toBuffer();
    const lm = await sharp(links).metadata();
    const naast = path.join(o.uit, "naast-scherm-start.png");
    await sharp({ create: { width: lm.width + 40 + meta.width, height: meta.height, channels: 3, background: "#0b0e18" } })
      .composite([{ input: links, left: 0, top: 0 }, { input: beeld, left: lm.width + 40, top: 0 }]).png().toFile(naast);
    console.log("Naast scherm-start.png:", naast);
  }
} finally {
  await sessie.browser.close();
  await server.close();
}
