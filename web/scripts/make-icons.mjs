// Maakt alle iconen uit ../assets/icon.svg (1024 px, richting C). Run: npm run icons
// - web/public: PWA-iconen, apple-touch-icon en favicon.
// - crates/halma-app/icons en gen/android: via `tauri icon`, met een eigen voor- en achtergrond voor het adaptieve icoon van Android.
import sharp from "sharp";
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const root = new URL("../../", import.meta.url).pathname;
const svg = readFileSync(join(root, "assets/icon.svg"), "utf8");
const png = (bron, maat) => sharp(Buffer.from(bron), { density: (72 * maat) / 1024 }).resize(maat, maat).png();

// De lagen staan tussen <!-- grond --> en <!-- pion --> in de SVG.
const zonder = (laag) => svg.replace(new RegExp(`<!-- ${laag} -->[\\s\\S]*?<!-- /${laag} -->`), "");

const web = (n) => join(root, "web/public", n);
for (const [naam, maat] of [["icon-192.png", 192], ["icon-512.png", 512], ["icon-maskable-512.png", 512], ["apple-touch-icon.png", 180], ["favicon.png", 64]]) {
  await png(svg, maat).toFile(web(naam));
}

// Bron voor tauri icon: het hele icoon, en apart de achtergrond (leisteen) en de voorgrond (ring en pion).
const map = mkdtempSync(join(process.env.TMPDIR ?? tmpdir(), "leapstone-icoon-"));
await png(svg, 1024).toFile(join(map, "icoon.png"));
await png(zonder("pion"), 1024).toFile(join(map, "achter.png"));
// Android legt de voorgrond op 108 dp en snijdt tot een cirkel van 72 dp: ring en pion iets kleiner, zodat de ring vrij blijft.
const voor = zonder("grond").replace("<!-- pion -->", '<g transform="translate(512 512) scale(0.86) translate(-512 -512)">').replace("<!-- /pion -->", "</g>");
await png(voor, 1024).toFile(join(map, "voor.png"));
writeFileSync(
  join(map, "icoon.json"),
  JSON.stringify({ default: "icoon.png", bg_color: "#0b0d10", android_bg: "achter.png", android_fg: "voor.png" }),
);
const r = spawnSync("npx", ["tauri", "icon", join(map, "icoon.json"), "-o", "crates/halma-app/icons"], { cwd: root, stdio: "inherit" });
// Alleen telefoons: de iconen voor Windows en macOS zijn niet nodig.
for (const naam of ["icon.ico", "icon.icns", "64x64.png", "StoreLogo.png", "Square30x30Logo.png", "Square44x44Logo.png", "Square71x71Logo.png",
  "Square89x89Logo.png", "Square107x107Logo.png", "Square142x142Logo.png", "Square150x150Logo.png", "Square284x284Logo.png", "Square310x310Logo.png"]) {
  rmSync(join(root, "crates/halma-app/icons", naam), { force: true });
}
process.exit(r.status ?? 1);
