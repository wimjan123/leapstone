// Bakt de texturen van het 3D-bord (ontwerp 1b, taak 177) en zet ze in web/src/bord3d/.
//
//   npm --prefix web run bak-bord3d
//
// Draait bak.js in Chromium (Canvas 2D). Alles is zelf getekend (eigen werk, CC0); zie docs/bord3d.md.
import http from "node:http";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { WEB, startBrowser } from "../bord-hulp.mjs";

const MAP = path.dirname(fileURLToPath(import.meta.url));
const UIT = process.env.BAK_UIT || path.join(WEB, "src/bord3d");

// AVIF per plaatje. Kleurkaarten mogen 4:2:0 (minder kleur dan licht), normaal- en ORM-kaarten zijn getallen per kanaal: 4:4:4.
const KWALITEIT = { kleur: 60, normaal: 60, orm: 60, ruw: 60 };
// De bron blijft de JPEG van Chromium, niet een verliesloos beeld: JPEG (4:2:0, kwaliteit 0,8 tot 0,93) haalt fijne ruis uit de normaalkaarten,
// en het bord is daarop afgesteld. Een verliesloze bron geeft een zichtbaar ruiger bord (tafel_normaal, gemeten 2026-11-14).
const perst = (naam, jpg) => {
  const soort = naam.replace(/\.jpg$/, "").split("_").pop();
  return sharp(jpg).removeAlpha().avif({ quality: KWALITEIT[soort], effort: 9, chromaSubsampling: soort === "kleur" ? "4:2:0" : "4:4:4" }).toBuffer();
};

const server = await new Promise((klaar) => {
  const s = http.createServer(async (req, res) => {
    try {
      const f = path.join(MAP, path.basename(new URL(req.url, "http://x").pathname));
      const inhoud = await readFile(f);
      res.writeHead(200, { "Content-Type": f.endsWith(".html") ? "text/html" : "text/javascript" });
      res.end(inhoud);
    } catch {
      res.writeHead(404); res.end();
    }
  });
  s.listen(0, "127.0.0.1", () => klaar({ url: `http://127.0.0.1:${s.address().port}`, stop: () => s.close() }));
});
const sessie = await startBrowser({ dpr: 1, aanraking: false });
try {
  const p = await sessie.ctx.newPage();
  p.on("pageerror", (e) => console.log("[pagina-fout]", e.message));
  await p.goto(`${server.url}/bak.html`);
  await p.waitForFunction(() => window.bakKlaar, null, { timeout: 30000 });
  const uit = await p.evaluate(() => window.bak());
  await mkdir(UIT, { recursive: true });
  for (const [naam, data] of Object.entries(uit)) {
    const buf = await perst(naam, Buffer.from(data.split(",")[1], "base64"));
    await writeFile(path.join(UIT, `halma_bord3d-${naam.replace(/\.jpg$/, "")}.avif`), buf);
    console.log(naam, (buf.length / 1024).toFixed(0) + " kB");
  }
} finally {
  await sessie.browser.close();
  server.stop();
}
