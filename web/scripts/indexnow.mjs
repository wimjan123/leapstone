// Stuurt alle adressen uit web/public/sitemap.xml in één POST naar IndexNow (Bing e.a.). Zie docs/cloudflare.md, Uitrollen.
// Draai het na een uitrol met nieuwe pagina's: npm --prefix web run indexnow. Met --droog stuurt het niets en toont het
// alleen het aantal adressen en de JSON. De sleutel is publiek (geen geheim): het bestand web/public/<sleutel>.txt bewijst
// dat de site van ons is.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const SLEUTEL = "11da0307c71d178c1b48c66387cf104d";
const HOST = "playleapstone.com";
const EINDPUNT = "https://api.indexnow.org/indexnow";
const sitemap = fileURLToPath(new URL("../public/sitemap.xml", import.meta.url));

export function adressen(xml) {
  return [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]);
}

export function bericht(urlList) {
  return { host: HOST, key: SLEUTEL, keyLocation: `https://${HOST}/${SLEUTEL}.txt`, urlList };
}

const urlList = adressen(readFileSync(sitemap, "utf8"));
if (urlList.length === 0 || urlList.some((u) => new URL(u).host !== HOST)) {
  console.error("sitemap.xml: geen adressen, of een adres buiten " + HOST);
  process.exit(1);
}
const json = bericht(urlList);

if (process.argv.includes("--droog")) {
  console.log(`Droog: ${urlList.length} adressen, er is niets verstuurd.`);
  console.log(JSON.stringify(json, null, 2));
} else {
  const antwoord = await fetch(EINDPUNT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(json),
  });
  console.log(`IndexNow: ${urlList.length} adressen verstuurd, antwoord ${antwoord.status}`);
  if (antwoord.status !== 200 && antwoord.status !== 202) process.exit(1);
}
