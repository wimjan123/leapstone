// Het opzet van een spelregelpagina of gids in elke taal (feature 95, 126): gewone HTML zonder JavaScript, in de stijl van de Landingspagina.
// De pagina's staan in web/regels/paginas.mjs (adressen), de tekst per taal in web/regels/talen/<code>/<slug>.mjs (nav, titel, beschrijving,
// h1, intro, inhoud). `npm --prefix web run regels:paginas` maakt er web/public<adres>.html van, en werkt de stukken tussen `regels:begin`
// en `regels:end` bij in sitemap.xml en llms.txt. Zie docs/plan.md, taak 116, 121, 122 en 133.
import { join } from "node:path";
import { LANDING_TALEN } from "../landing/talen.mjs";
import { PAGINA_LIJST } from "./paginas.mjs";
import { REGEL_TALEN } from "./talen.mjs";
import { esc } from "./plaatje.mjs";
import { winkelKnoppen } from "../landing/pagina.mjs";

export { plaatje, rasterPlaatje } from "./plaatje.mjs";

const BASIS = "https://playleapstone.com";

/** Het Smart App Banner van Apple (Safari op iPhone en iPad). Taak 121. Niet in de app (Tauri) en niet op de Uitnodigingskaart. */
export const APP_BANNER = '<meta name="apple-itunes-app" content="app-id=6831230722" />';

/** De taal van een pagina: de teksten van deze pagina's (talen/<code>/) samen met de taalbrede gegevens van de Landingspagina. */
export function regelTaal(code) {
  const eigen = REGEL_TALEN.find((t) => t.code === code);
  const landing = LANDING_TALEN.find((t) => t.code === code);
  if (!eigen || !landing) throw new Error(`taal ${code}: ontbreekt in web/regels/talen.mjs of web/landing/talen.mjs`);
  return { ...eigen, landing };
}

/** De talen waarin een pagina bestaat, in de volgorde van REGEL_TALEN (Engels eerst). */
export const talenVan = (pagina) => REGEL_TALEN.map((t) => t.code).filter((c) => pagina.paden[c]);

/** Alle pagina's in alle talen: { pagina, code, pad } in de volgorde van de lijst. */
export function allePaginas() {
  return PAGINA_LIJST.flatMap((pagina) => talenVan(pagina).map((code) => ({ pagina, code, pad: pagina.paden[code] })));
}

/** Waar het HTML-bestand van een pagina staat: web/public<adres>.html. */
export const paginaBestand = (pagina, code) => join(import.meta.dirname, "..", "public", `${pagina.paden[code]}.html`);

const stijl = `
    @font-face {
      font-family: "Archivo";
      src: url("/fonts/archivo.woff2") format("woff2");
      font-weight: 200 600;
      font-stretch: 100% 125%;
      font-display: swap;
    }
    @font-face {
      font-family: "Martian Mono";
      src: url("/fonts/martian-mono.woff2") format("woff2");
      font-weight: 300 500;
      font-stretch: 87.5% 100%;
      font-display: swap;
    }
    :root {
      --grond: #0b0d10;
      --vlak: #12151a;
      --lijn: rgb(214 222 235 / 0.1);
      --lijn-sterk: rgb(214 222 235 / 0.2);
      --tekst: #e9ecf0;
      --zacht: #a0a7b2;
      --stil: #737b87;
      --licht: #eceef1;
      --licht-inkt: #0b0d10;
      --letter: "Archivo", system-ui, -apple-system, "Segoe UI", sans-serif;
      --mono: "Martian Mono", ui-monospace, "SF Mono", Menlo, monospace;
      color-scheme: dark;
    }
    * { box-sizing: border-box; }
    html { -webkit-text-size-adjust: 100%; }
    :lang(ja) { word-break: auto-phrase; }
    /* Indische schriften en Thais: geen spatiëring of hoofdletters in koppen (spatiëring breekt de lettervormen). */
    :is(:lang(bn), :lang(gu), :lang(hi), :lang(kn), :lang(ml), :lang(mr), :lang(or), :lang(pa), :lang(ta), :lang(te), :lang(th)) h2 { letter-spacing: 0; text-transform: none; font-size: 0.95rem; }
    body {
      margin: 0;
      min-height: 100dvh;
      background:
        radial-gradient(120% 60% at 50% 0%, rgb(150 170 200 / 0.11), transparent 70%),
        var(--grond);
      color: var(--tekst);
      font: 400 1rem/1.55 var(--letter);
      -webkit-font-smoothing: antialiased;
      padding: max(32px, env(safe-area-inset-top)) max(20px, env(safe-area-inset-right)) max(56px, env(safe-area-inset-bottom)) max(20px, env(safe-area-inset-left));
    }
    main { max-width: 40rem; margin: 0 auto; }
    a { color: var(--tekst); text-decoration-color: var(--stil); text-underline-offset: 3px; }
    a:hover { text-decoration-color: var(--tekst); }
    a:focus-visible { outline: 2px solid var(--licht); outline-offset: 3px; border-radius: 3px; }

    header { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 8px 0 12px; }
    .merk {
      margin: 0;
      font-size: 0.95rem;
      font-weight: 300;
      font-stretch: 125%;
      letter-spacing: 0.42em;
      padding-left: 0.42em;
      text-transform: uppercase;
      line-height: 1;
    }
    .merk a { text-decoration: none; }
    h1 { margin: 36px 0 0; max-width: 22ch; font-size: clamp(1.6rem, 6.4vw, 2.5rem); font-weight: 300; line-height: 1.15; letter-spacing: -0.005em; text-wrap: balance; }
    .taal { display: flex; flex-wrap: wrap; justify-content: center; gap: 4px; margin: 0 0 18px; font: 400 0.72rem/1 var(--mono); letter-spacing: 0.08em; }
    .taal a { display: inline-flex; align-items: center; justify-content: center; min-width: 44px; min-height: 44px; color: var(--zacht); text-decoration: none; border-radius: 3px; }
    .taal a[aria-current] { color: var(--tekst); box-shadow: inset 0 0 0 1px var(--lijn-sterk); }
    .intro { margin: 16px 0 0; max-width: 44ch; color: var(--zacht); font-size: 1.08rem; text-wrap: pretty; }
    .knoppen { display: flex; flex-direction: column; align-items: center; gap: 14px; margin-top: 28px; width: 100%; }
    .speel {
      display: inline-flex; align-items: center; justify-content: center;
      width: 100%; max-width: 20rem; min-height: 56px; padding: 0 22px; border-radius: 3px;
      background: var(--licht);
      color: var(--licht-inkt); font-weight: 500; text-decoration: none;
      box-shadow: inset 0 -1px 0 rgb(0 0 0 / 0.14), 0 1px 0 rgb(0 0 0 / 0.5), 0 8px 24px -10px rgb(0 0 0 / 0.7);
    }
    .speel:hover { background: #fff; }
    .winkel { display: block; line-height: 0; border-radius: 7px; }
    .winkel img { display: block; height: 52px; width: auto; }
    .winkel.play img { height: 78px; }
    @media (min-width: 34rem) { .knoppen { flex-direction: row; justify-content: center; } .knoppen .speel { width: auto; } }

    h2 {
      margin: 56px 0 4px;
      font-size: 0.78rem;
      font-weight: 400;
      font-stretch: 125%;
      letter-spacing: 0.32em;
      text-transform: uppercase;
      color: var(--zacht);
    }
    /* Vragen met een kort antwoord (taak GEO): de vraag als kleine kop, het antwoord eronder. */
    h3 { margin: 28px 0 0; font-size: 1rem; font-weight: 500; line-height: 1.35; text-wrap: balance; }
    h3 + p { margin-top: 6px; }
    p { margin: 12px 0 0; max-width: 62ch; text-wrap: pretty; }
    ul, ol { margin: 12px 0 0; padding: 0 0 0 1.2em; color: var(--zacht); }
    li { margin: 6px 0; }
    li::marker { color: var(--stil); }
    strong { font-weight: 450; }

    /* Plaatjes van het bord: SVG uit halma-core (npm run regels), met een bijschrift. */
    figure { margin: 20px 0 0; }
    figure img { display: block; width: 100%; height: auto; margin: 0 auto; }
    figcaption { margin-top: 8px; color: var(--stil); font-size: 0.88rem; text-align: center; text-wrap: balance; }
    .enkel img { max-width: var(--max, 20rem); }
    .raster { display: grid; grid-template-columns: 1fr 1fr; gap: 20px 14px; margin-top: 20px; }
    .raster figure { margin: 0; }
    @media (min-width: 34rem) { .raster { grid-template-columns: repeat(4, 1fr); } .raster-twee { grid-template-columns: repeat(2, 1fr); } }

    .tips { margin: 12px 0 0; padding: 0; border-top: 1px solid var(--lijn-sterk); list-style: none; }
    .tips li { margin: 0; padding: 14px 0; border-bottom: 1px solid var(--lijn); color: var(--zacht); }
    .tips strong { display: block; color: var(--tekst); }

    .onderaan { display: flex; justify-content: center; margin-top: 48px; }

    footer { margin-top: 72px; padding-top: 20px; border-top: 1px solid var(--lijn-sterk); color: var(--stil); font: 300 0.72rem/1.6 var(--mono); }
    footer nav { display: flex; flex-wrap: wrap; gap: 6px 20px; margin-bottom: 8px; }
    footer a { color: var(--zacht); }
    footer p { margin: 0; }
`;

/** De navigatie onderaan een pagina: Landingspagina, spelen, alle pagina's die er in deze taal zijn, privacy en terms. */
function navigatie(t, code) {
  const paginas = PAGINA_LIJST.filter((p) => p.paden[code]).map((p) => [p.paden[code], t.paginas[p.slug].nav]);
  return [[t.landing.adres, t.nav.thuis], ["/play/", t.nav.spelen], ...paginas, ["/privacy", t.nav.privacy], ["/terms", t.nav.terms]];
}

/** Een JSON-LD-blok van één object, ingesprongen voor in de head. */
const ldScript = (obj) =>
  `  <script type="application/ld+json">\n${JSON.stringify(obj, null, 2).split("\n").map((r) => "  " + r).join("\n")}\n  </script>`;

/**
 * Het kruimelpad als schema (BreadcrumbList, taak 309): Landingspagina van de taal, dan de pagina. Er is geen overzichtspagina voor
 * Spelregels of Gidsen, dus geen middelste stap. Geen zichtbaar kruimelpad. De adressen zijn die van dezelfde taal.
 */
export function kruimelpad(t, p, url) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: t.nav.thuis, item: `${BASIS}${t.landing.adres}` },
      { "@type": "ListItem", position: 2, name: p.nav, item: url },
    ],
  };
}

/** Het hele HTML-bestand van een spelregelpagina of gids in één taal. */
export function maakPagina(pagina, code) {
  const t = regelTaal(code);
  const p = t.paginas[pagina.slug];
  if (!p) throw new Error(`${code}: geen tekst voor ${pagina.slug}`);
  const pad = pagina.paden[code];
  const url = `${BASIS}${pad}`;
  const titel = esc(p.titel);
  const beschrijving = esc(p.beschrijving);
  const artikel = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: p.h1,
      description: p.beschrijving,
      url,
      mainEntityOfPage: url,
      inLanguage: code,
      dateModified: pagina.bijgewerkt,
      image: `${BASIS}/uitnodiging.png`,
      author: { "@type": "Person", name: "William Visser" },
      publisher: { "@type": "Organization", name: "Leapstone", url: `${BASIS}/`, logo: { "@type": "ImageObject", url: `${BASIS}/icon-512.png` } },
  };
  const ld = [artikel, kruimelpad(t, p, url)].map(ldScript).join("\n");
  const nav = navigatie(t, code).map(([h, tekst]) => `<a href="${h}">${tekst}</a>`).join("");
  const talen = talenVan(pagina).map((c) => LANDING_TALEN.find((l) => l.code === c));
  const alternate =
    talen.map((l) => `  <link rel="alternate" hreflang="${l.code}" href="${BASIS}${pagina.paden[l.code]}" />\n`).join("") +
    `  <link rel="alternate" hreflang="x-default" href="${BASIS}${pagina.paden.en}" />\n`;
  const ogAndere = talen.filter((l) => l.code !== code).map((l) => `  <meta property="og:locale:alternate" content="${l.locale}" />\n`).join("");
  // Een pagina in één taal (taak 139) heeft geen taalkeuze: één knop EN zou niets te kiezen geven.
  const taalkeuze = talen.length < 2 ? "" : `      <nav class="taal" aria-label="${esc(t.landing.taalkeuze)}">${talen
    .map((l) => `<a href="${pagina.paden[l.code]}" hreflang="${l.code}" lang="${l.code}" title="${esc(l.naam)}"${l.code === code ? ' aria-current="page"' : ""}>${l.code.toUpperCase()}</a>`)
    .join("")}</nav>\n`;
  return `<!doctype html>
<html lang="${code}"${t.landing.dir === "rtl" ? ' dir="rtl"' : ""}>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <meta name="color-scheme" content="dark" />
  <meta name="theme-color" content="#0b0d10" />
  <title>${titel}</title>
  <meta name="description" content="${beschrijving}" />
  <link rel="icon" href="/icon-192.png" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
  <link rel="canonical" href="${url}" />
${alternate}  ${APP_BANNER}
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="Leapstone" />
  <meta property="og:locale" content="${t.landing.locale}" />
${ogAndere}  <meta property="og:url" content="${url}" />
  <meta property="og:title" content="${titel}" />
  <meta property="og:description" content="${beschrijving}" />
  <meta property="og:image" content="${BASIS}/uitnodiging.png" />
  <meta property="og:image:type" content="image/png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="${esc(t.landing.ogAlt)}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${titel}" />
  <meta name="twitter:description" content="${beschrijving}" />
  <meta name="twitter:image" content="${BASIS}/uitnodiging.png" />
${ld}
  <!-- Gemaakt door web/scripts/make-regels.mjs uit web/regels/talen/${code}/${pagina.slug}.mjs. Niet met de hand wijzigen. -->
  <style>${stijl}  </style>
</head>
<body>
  <main>
    <header>
${taalkeuze}      <p class="merk" dir="ltr"><a href="${t.landing.adres}">Leapstone</a></p>
      <h1>${p.h1}</h1>
      <p class="intro">${p.intro}</p>
      <div class="knoppen">${winkelKnoppen(t.landing)}<a class="speel" href="/play/">${t.speel}</a></div>
    </header>

${p.inhoud}

    <div class="onderaan"><a class="speel" href="/play/">${t.speel}</a></div>

    <footer>
      <nav aria-label="${t.site}">${nav}</nav>
      <p dir="ltr">Leapstone &copy; 2026 William Visser</p>
    </footer>
  </main>
</body>
</html>
`;
}

/**
 * Stukken van andere bestanden die uit de pagina-lijst komen, tussen `regels:begin` en `regels:end`:
 * de sitemap (alle pagina's in alle talen, elk met hreflang naar de rest en x-default naar Engels) en de regels van llms.txt
 * voor de vertaalde pagina's (de Engelse regels staan met de hand in llms.txt).
 */
export function regelStukken() {
  const sitemap = allePaginas()
    .map(({ pagina, pad }) => {
      const links = [...talenVan(pagina).map((c) => `    <xhtml:link rel="alternate" hreflang="${c}" href="${BASIS}${pagina.paden[c]}"/>`), `    <xhtml:link rel="alternate" hreflang="x-default" href="${BASIS}${pagina.paden.en}"/>`];
      return `  <url>\n    <loc>${BASIS}${pad}</loc>\n    <lastmod>${pagina.bijgewerkt}</lastmod>\n${links.join("\n")}\n  </url>`;
    })
    .join("\n");
  const llms = allePaginas()
    .filter(({ code }) => code !== "en")
    .map(({ pagina, code, pad }) => {
      const l = LANDING_TALEN.find((x) => x.code === code);
      const bron = regelTaal("en").paginas[pagina.slug].nav;
      return `- [${regelTaal(code).paginas[pagina.slug].nav} (${l.naam})](${BASIS}${pad}): the ${l.naamEn} version of "${bron}", with the same content.`;
    })
    .join("\n");
  return { sitemap, llms };
}
