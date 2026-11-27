// De Landingspagina in elke taal uit één bron (taak 132, feature 126): stijl.css + de vertaaltabel talen/<code>.mjs.
// `npm --prefix web run landing:paginas` maakt er web/landing/index.html (Engels, /) en web/landing/<code>/index.html (/<code>/) van,
// en werkt de stukken van sitemap.xml, llms.txt en _headers bij die uit de taallijst komen.
// De build (vite) neemt die HTML-bestanden als pagina's en zet ze op /index.html en /<code>/index.html.
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { LANDING_TALEN } from "./talen.mjs";

export const BASIS = "https://playleapstone.com";
const HIER = import.meta.dirname;
const APP_ID = "6831230722";

/**
 * De schermafdrukken op de pagina: de winkelbeelden van de App Store (docs/winkel/beelden, `npm --prefix web run landing-beelden`
 * maakt ze klein), in de volgorde van de winkel. De alt-tekst is de kop van dat beeld in de taal van de pagina (`teksten.json`).
 */
export const SCHERMEN = [
  ["landing-board", "bord"],
  ["landing-live", "snel"],
  ["landing-invite", "uitnodiging"],
  ["landing-leaderboard", "ranglijst"],
  ["landing-puzzle", "puzzel"],
  ["landing-square", "vierkant"],
];
const KOPPEN = JSON.parse(readFileSync(join(HIER, "winkel", "beelden-teksten.json"), "utf8")).talen;
/** De koppen van de winkelbeelden voor een taal van de pagina (de = de-DE, pt = pt-BR, zh-hans = zh-Hans); anders de Engelse. */
export function schermKoppen(taal) {
  const codes = Object.keys(KOPPEN);
  const code = codes.find((c) => c.toLowerCase() === taal.code) ?? codes.find((c) => c.split("-")[0].toLowerCase() === taal.code) ?? "en-US";
  return KOPPEN[code];
}

/** Het Smart App Banner van Apple (Safari op iPhone en iPad). Gelijk aan APP_BANNER in web/regels/pagina.mjs. */
export const APP_BANNER = `<meta name="apple-itunes-app" content="app-id=${APP_ID}" />`;

/**
 * Het kleine inline script van de Engelse pagina (/): wie de web-app op het beginscherm zette, opent /, en gaat naar het spel.
 * De hash ervan staat in public/_headers (web/src/headers.test.ts controleert hem). Alleen op /: de andere talen hebben geen script.
 */
const DOORSTUREN = `  <!-- Wie de web-app op het beginscherm zette, opent /: stuur die Spelers naar het spel. Gewone bezoekers en bezoekers zonder JavaScript zien de pagina. -->
  <script>
    try {
      if (navigator.standalone || matchMedia("(display-mode: standalone)").matches) location.replace("/play/");
    } catch (e) {}
  </script>
`;

/** Tekst in een attribuut of als gewone tekst. De velden die markup mogen hebben (spelen, hoeTekst, gratisTekst) gaan niet hierdoor. */
export const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const json = (o) => JSON.stringify(o, null, 2).replace(/</g, "\\u003c").split("\n").map((r) => `  ${r}`).join("\n");

/** Het adres van een taal, met host. */
export const volledigAdres = (taal) => `${BASIS}${taal.adres}`;
/** Waar het HTML-bronbestand van een taal staat, onder web/landing. */
export const landingBestand = (taal) => (taal.adres === "/" ? join(HIER, "index.html") : join(HIER, taal.code, "index.html"));
/** Het adres van de App Store van het land van die taal. */
export const winkelAdres = (taal) => `https://apps.apple.com/${taal.winkel ? `${taal.winkel}/` : ""}app/id${APP_ID}`;

const BADGES = join(HIER, "..", "public", "badges");
/** Hoogte waarop de badge staat (px). Apple vraagt minstens 40 px hoog en geen vervorming; de breedte volgt uit de viewBox van het bestand. */
export const BADGE_HOOGTE = 52;
/**
 * De officiële "Download on the App Store"-badge van Apple in de taal van de pagina (taak 138): web/public/badges/app-store-badge-<code>.svg,
 * ongewijzigd (bron en datum: docs/plan.md, Techniek). Heeft Apple de taal niet (nu alleen hi), dan de Engelse. Elke badge heeft een eigen
 * breedte, dus breedte en hoogte komen uit de viewBox van het bestand.
 */
export function badge(taal) {
  const code = existsSync(join(BADGES, `app-store-badge-${taal.code}.svg`)) ? taal.code : "en";
  const bestand = `app-store-badge-${code}.svg`;
  const vb = readFileSync(join(BADGES, bestand), "utf8").match(/viewBox="\s*[\d.-]+[\s,]+[\d.-]+[\s,]+([\d.]+)[\s,]+([\d.]+)\s*"/);
  if (!vb) throw new Error(`${bestand}: geen viewBox`);
  return { code, src: `/badges/${bestand}`, width: Math.round((BADGE_HOOGTE * Number(vb[1])) / Number(vb[2])), height: BADGE_HOOGTE };
}

/** De winkelpagina van Leapstone in Google Play (voor alle landen en talen gelijk). */
export const PLAY_ADRES = "https://play.google.com/store/apps/details?id=nl.leapstone.app";
/** Hoogte (px) van het plaatje van Google Play. Het bestand heeft de vrije ruimte van Google (een kwart van de badge) erin: de badge zelf is 168 van de 250 px hoog. 78 px geeft een badge van 52 px, even groot als die van de App Store (Google: niet kleiner dan het plaatje van een andere winkel). */
export const PLAY_HOOGTE = 78;
/**
 * De officiële "Get it on Google Play"-badge van Google in de taal van de pagina (taak 266): web/public/badges/google-play-badge-<code>.png,
 * ongewijzigd (bron en datum: docs/plan.md, Techniek). Heeft Google de taal niet (nu alleen or), dan de Engelse. Breedte en hoogte van het bestand
 * staan in de PNG-kop.
 */
export function playBadge(taal) {
  const code = existsSync(join(BADGES, `google-play-badge-${taal.code}.png`)) ? taal.code : "en";
  const bestand = `google-play-badge-${code}.png`;
  const kop = readFileSync(join(BADGES, bestand)).subarray(0, 24);
  if (kop.toString("latin1", 1, 4) !== "PNG") throw new Error(`${bestand}: geen PNG`);
  const [b, h] = [kop.readUInt32BE(16), kop.readUInt32BE(20)];
  return { code, src: `/badges/${bestand}`, width: Math.round((PLAY_HOOGTE * b) / h), height: PLAY_HOOGTE };
}
/** De twee winkelknoppen naast elkaar: App Store eerst (Apple), dan Google Play. */
export function winkelKnoppen(taal) {
  const a = badge(taal);
  const g = playBadge(taal);
  const alt = (t) => esc(t);
  return `<a class="winkel" href="${winkelAdres(taal)}"><img src="${a.src}" width="${a.width}" height="${a.height}" alt="${alt(taal.badgeAlt)}" /></a>
        <a class="winkel play" href="${PLAY_ADRES}"><img src="${g.src}" width="${g.width}" height="${g.height}" alt="${alt(taal.playAlt)}" /></a>`;
}

const STIJL = readFileSync(join(HIER, "stijl.css"), "utf8");

export function maakLanding(taal, talen = LANDING_TALEN) {
  const bron = talen[0];
  const eigen = volledigAdres(taal);
  const img = taal.adres === "/" ? "./img/" : "../img/";
  const winkel = winkelAdres(taal);
  const alternates = [
    ...talen.map((t) => `  <link rel="alternate" hreflang="${t.code}" href="${volledigAdres(t)}" />`),
    `  <link rel="alternate" hreflang="x-default" href="${volledigAdres(bron)}" />`,
  ].join("\n");
  const ogAndere = talen.filter((t) => t !== taal).map((t) => `  <meta property="og:locale:alternate" content="${t.locale}" />`).join("\n");
  // Taalkeuze zonder JavaScript: een <details> met de taalnamen in hun eigen taal (43 talen passen niet als rij op een telefoon).
  const taalkeuze = `<details><summary><svg class="wereld" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18" /></svg><span lang="${taal.code}">${esc(taal.naam)}</span></summary><ul>${talen
    .map((t) => `<li><a href="${t.adres}" hreflang="${t.code}" lang="${t.code}"${t === taal ? ' aria-current="page"' : ""}>${esc(t.naam)}</a></li>`)
    .join("")}</ul></details>`;
  const foto = (naam, alt, eerste) =>
    `<picture><source type="image/avif" srcset="${img}${naam}.avif" /><img src="${img}${naam}.webp" width="480" height="1043" alt="${esc(alt)}" ${eerste ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"'} decoding="async" /></picture>`;
  const koppen = schermKoppen(taal);
  const app = {
    "@context": "https://schema.org",
    "@type": "MobileApplication",
    name: "Leapstone",
    ...(taal.alternateName ? { alternateName: taal.alternateName } : {}),
    url: eigen,
    description: taal.kort,
    applicationCategory: "GameApplication",
    operatingSystem: "iOS, Android",
    image: `${BASIS}/uitnodiging.png`,
    downloadUrl: winkel,
    installUrl: winkel,
    sameAs: [winkel, PLAY_ADRES],
    inLanguage: taal.code,
    offers: { "@type": "Offer", price: "0", priceCurrency: taal.valuta },
    author: { "@type": "Person", name: "William Visser" },
  };
  const organisatie = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Leapstone",
    url: eigen,
    logo: `${BASIS}/icon-512.png`,
    email: "info@thewillonline.nl",
    founder: { "@type": "Person", name: "William Visser" },
    sameAs: [winkel, PLAY_ADRES],
  };
  return `<!doctype html>
<html lang="${taal.code}" dir="${taal.dir}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <meta name="color-scheme" content="dark" />
  <meta name="theme-color" content="#0b0d10" />
  <title>${esc(taal.titel)}</title>
  <meta name="description" content="${esc(taal.beschrijving)}" />
  <link rel="icon" href="/icon-192.png" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
${taal.adres === "/" ? DOORSTUREN : `  <!-- Gemaakt door web/landing/pagina.mjs uit web/landing/talen/${taal.code}.mjs (npm run landing:paginas). Niet met de hand wijzigen. Zonder JavaScript. -->\n`}  <link rel="canonical" href="${eigen}" />
${alternates}
  ${APP_BANNER}
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Leapstone" />
  <meta property="og:locale" content="${taal.locale}" />
${ogAndere}
  <meta property="og:url" content="${eigen}" />
  <meta property="og:title" content="${esc(taal.titel)}" />
  <meta property="og:description" content="${esc(taal.beschrijving)}" />
  <meta property="og:image" content="${BASIS}/uitnodiging.png" />
  <meta property="og:image:type" content="image/png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="${esc(taal.ogAlt)}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(taal.titel)}" />
  <meta name="twitter:description" content="${esc(taal.beschrijving)}" />
  <meta name="twitter:image" content="${BASIS}/uitnodiging.png" />
  <script type="application/ld+json">
${json(app)}
  </script>
  <script type="application/ld+json">
${json(organisatie)}
  </script>
  <!-- Zelfstandige pagina: geen app-code, alleen de lettertypen die al bij Leapstone horen (public/fonts, SIL Open Font License). -->
  <style>
${STIJL}  </style>
</head>
<body>
  <main>
    <header>
      <nav class="taal" aria-label="${esc(taal.taalkeuze)}">${taalkeuze}</nav>
      <svg class="bord" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
        <circle cx="50" cy="50" r="46" />
        <circle cx="50" cy="22" r="3" /><circle cx="41" cy="34" r="3" /><circle cx="59" cy="34" r="3" />
        <circle cx="32" cy="46" r="3" /><circle cx="50" cy="46" r="3" /><circle cx="68" cy="46" r="3" />
        <circle cx="41" cy="58" r="3" /><circle cx="59" cy="58" r="3" /><circle cx="50" cy="70" r="3" />
      </svg>
      <p class="merk" dir="ltr">Leapstone</p>
      <h1>${esc(taal.h1)}</h1>
      <p class="intro">${esc(taal.intro)}</p>
      <div class="knoppen">
        ${winkelKnoppen(taal)}
        <a class="speel" href="/play/">${esc(taal.speel)}</a>
      </div>
    </header>

    <section aria-labelledby="shots">
      <h2 id="shots" class="tekstkolom">${esc(taal.schermKop)}</h2>
      <div class="schuif" role="region" aria-label="${esc(taal.schermAria)}" tabindex="0">
${SCHERMEN.map(([b, kop], i) => `        <figure>\n          ${foto(b, koppen[kop].replace(/\u200b/g, ""), i === 0)}\n        </figure>`).join("\n")}
      </div>
    </section>

    <div class="tekstkolom">
      <h2>${esc(taal.watKop)}</h2>
      <p>${esc(taal.watTekst)}</p>

      <h2>${esc(taal.spelenKop)}</h2>
      <ul>
${taal.spelen.map((r) => `        <li>${r}</li>`).join("\n")}
      </ul>

      <h2>${esc(taal.bordenKop)}</h2>
      <dl>
${taal.borden.map(([dt, dd]) => `        <div class="rij"><dt>${esc(dt)}</dt><dd>${esc(dd)}</dd></div>`).join("\n")}
      </dl>

      <h2>${esc(taal.hoeKop)}</h2>
      <p>${taal.hoeTekst}</p>

      <h2>${esc(taal.gratisKop)}</h2>
      <p>${taal.gratisTekst}</p>
    </div>

    <footer>
      <div class="tekstkolom">
        <nav aria-label="Site">${taal.voet.map(([href, tekst]) => `<a href="${href}">${esc(tekst)}</a>`).join("")}</nav>
        <p dir="ltr">Leapstone &copy; 2026 William Visser</p>
      </div>
    </footer>
  </main>
</body>
</html>
`;
}

/** De Content-Security-Policy van de pagina's onder /<code>/ (geen script): alleen tekst, inline stijl en eigen beelden. */
const CSP = "default-src 'none'; style-src 'unsafe-inline'; img-src 'self'; font-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'";

/** De datum (JJJJ-MM-DD) waarop de tekst van de Landingspagina het laatst inhoudelijk veranderde, in welke taal ook: `<lastmod>` in de sitemap. */
const BIJGEWERKT = "2026-11-17";

/** Stukken van andere bestanden die uit de taallijst komen, tussen `landing:begin` en `landing:end`. */
export function landingStukken(talen = LANDING_TALEN) {
  const bron = talen[0];
  const sitemap = talen
    .map((t) => `  <url>\n    <loc>${volledigAdres(t)}</loc>\n    <lastmod>${BIJGEWERKT}</lastmod>\n${[...talen.map((a) => `    <xhtml:link rel="alternate" hreflang="${a.code}" href="${volledigAdres(a)}"/>`), `    <xhtml:link rel="alternate" hreflang="x-default" href="${volledigAdres(bron)}"/>`].join("\n")}\n  </url>`)
    .join("\n");
  const llms = talen
    .filter((t) => t !== bron)
    .map((t) => `- [Leapstone (${t.naam})](${volledigAdres(t)}): landing page in ${t.naamEn}, with the links to the App Store of that country and to Google Play.`)
    .join("\n");
  const headers = talen
    .filter((t) => t !== bron)
    .map((t) => `/${t.code}/*\n  Content-Security-Policy: ${CSP}`)
    .join("\n");
  return { sitemap, llms, headers };
}
