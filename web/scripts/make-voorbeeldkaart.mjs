// Maakt de voorbeeldkaart van de Uitnodiging: web/public/uitnodiging.png (1200x630), het echte 3D-bord in rode lak en goud
// (uiterlijk 1b) met Stenen van drie Spelers. Eén vast plaatje, zonder tekst en zonder Spelersgegevens.
// Het bronbeeld is een echte schermafdruk van het 3D-bord (taak 295), geen eigen tekening:
//   npm --prefix web run schermen -- --gpu --taal=en --filter==bord-ster3-3d --maat=800x630 --dpr=3 --uit=/tmp/deelbeeld
//   npm --prefix web run voorbeeldkaart -- /tmp/deelbeeld/bord-ster3-3d-bord-en-800x630-dpr3.png
// Het script knipt het bord uit de schermafdruk (zonder Spelersbalk, Chat en knoppen) en schaalt het naar 1200x630.
import sharp from "sharp";

const bron = process.argv[2];
if (!bron) { console.error("Geef de schermafdruk mee: npm --prefix web run voorbeeldkaart -- <bord-ster3-3d-bord-en-800x630-dpr3.png>"); process.exit(1); }
const root = new URL("../../", import.meta.url).pathname;
const B = 1200, H = 630;
// Snede in CSS-pixels van de schermafdruk (800x630): midden van het bord, bovenrand en hoogte van de strook.
const ZIJ = { midden: 406, boven: 118, hoogte: 397 };
const meta = await sharp(bron).metadata();
const f = meta.width / 800; // schermdichtheid van de schermafdruk
if (meta.height !== 630 * f || f < 2) { console.error(`Verwacht een schermafdruk van 800x630 op dichtheid 2 of hoger, kreeg ${meta.width}x${meta.height}.`); process.exit(1); }
// Op 800x630 staat het bord in het midden, met de Spelers erboven en de knoppen eronder. Knip een strook met alleen het bord en de tafel eromheen.
const hoogte = Math.round(ZIJ.hoogte * f), breedte = Math.round(hoogte * B / H);
const x0 = Math.min(meta.width - breedte, Math.max(0, Math.round(ZIJ.midden * f - breedte / 2))), y0 = Math.round(ZIJ.boven * f);
const midden = await sharp(bron).extract({ left: x0, top: y0, width: breedte, height: hoogte }).resize(B, H, { kernel: "lanczos3" }).png().toBuffer();
// Boven in de strook ligt nog de rand van het briefje "Your turn": dek hem af met een stuk lege tafel van rechts.
const lap = await sharp(midden).extract({ left: 980, top: 0, width: 200, height: 22 }).png().toBuffer();
await sharp(midden)
  .composite([{ input: lap, left: 335, top: 0 }])
  .png({ palette: true, quality: 45, colours: 128, effort: 10, compressionLevel: 9, dither: 0.3 })
  .toFile(root + "web/public/uitnodiging.png");
