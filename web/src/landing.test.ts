// Taak 132: de Landingspagina in elke taal uit één bron (web/landing/pagina.mjs + web/landing/talen/<code>.mjs).
import { expect, test } from "vitest";
// @ts-expect-error gewone JavaScript-modules zonder typen
import { LANDING_TALEN } from "../landing/talen.mjs";
// @ts-expect-error gewone JavaScript-modules zonder typen
import { REGEL_TALEN } from "../regels/talen.mjs";
// @ts-expect-error gewone JavaScript-modules zonder typen
import { winkelteksten as alleWinkelteksten } from "../landing/winkelteksten.mjs";
// @ts-expect-error gewone JavaScript-modules zonder typen
import { APP_BANNER, BASIS, PLAY_ADRES, PLAY_HOOGTE, badge, landingStukken, maakLanding, playBadge, volledigAdres, winkelAdres } from "../landing/pagina.mjs";
// @ts-expect-error gewone JavaScript-modules zonder typen
import { allePaginas } from "../regels/pagina.mjs";
import headers from "../public/_headers?raw";
import sitemap from "../public/sitemap.xml?raw";
import llms from "../public/llms.txt?raw";

interface Taal { code: string; locale: string; dir: string; naam: string; adres: string; winkel: string; valuta: string; voet: [string, string][]; [veld: string]: unknown }
const talen: Taal[] = LANDING_TALEN;
const [bron, ...vertalingen] = talen;
// Taak 134: één pagina per basistaal van de winkelteksten (docs/winkel/talen), zonder varianten (en-GB, es-MX, fr-CA, pt-PT, zh-Hant).
const BASISTALEN = "en nl de ar bn ca cs da el es fi fr gu he hi hr hu id it ja kn ko ml mr ms no or pa pl pt ro ru sk sl sv ta te th tr uk ur vi zh-hans".split(" ");
const RTL = ["ar", "he", "ur"];
// De gemaakte pagina's, de beelden en de pagina's in public/ (alleen om te controleren dat een link of beeld bestaat).
const paginas = import.meta.glob("../landing/**/index.html", { query: "?raw", import: "default", eager: true }) as Record<string, string>;
const beeldBestanden = Object.keys(import.meta.glob("../landing/img/*"));
const publiekeHtml = Object.keys(import.meta.glob("../public/**/*.html"));

const bestand = (taal: Taal) => paginas[taal.adres === "/" ? "../landing/index.html" : `../landing/${taal.code}/index.html`] ?? "";
/** De hreflang-links van een pagina, als { taal: adres }. */
function alternates(html: string): Record<string, string> {
  const uit: Record<string, string> = {};
  for (const m of html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)" \/>/g)) uit[m[1]] = m[2];
  return uit;
}
const canonical = (html: string) => html.match(/<link rel="canonical" href="([^"]+)" \/>/)?.[1];

test("Engels is de bron en de eerste taal; de adressen zijn / en /<taal>/", () => {
  expect(bron.code).toBe("en");
  expect(bron.adres).toBe("/");
  expect(talen.map((t) => t.code)).toEqual(expect.arrayContaining(["en", "nl", "de"]));
  expect(talen.map((t) => t.code)).toEqual(expect.arrayContaining(BASISTALEN));
  for (const t of vertalingen) expect(t.adres).toBe(`/${t.code}/`);
  expect(new Set(talen.map((t) => t.code)).size).toBe(talen.length);
});

test("elke vertaaltabel heeft dezelfde velden als de Engelse en niets leegs", () => {
  for (const t of vertalingen) {
    for (const [veld, waarde] of Object.entries(bron)) {
      if (veld === "alternateName") continue; // alleen waar het nodig is
      if (veld === "voet") continue; // het aantal links hangt af van de pagina's die er in die taal zijn // alleen waar het nodig is
      expect(t, `${t.code}.${veld}`).toHaveProperty(veld);
      if (Array.isArray(waarde)) expect((t[veld] as unknown[]).length, `${t.code}.${veld}`).toBe(waarde.length);
    }
    for (const [veld, waarde] of Object.entries(t)) {
      if (typeof waarde === "string") expect(waarde.trim(), `${t.code}.${veld}`).not.toBe("");
    }
    expect(["ltr", "rtl"]).toContain(t.dir);
  }
});

for (const taal of talen) {
  const html = bestand(taal);
  const eigen = volledigAdres(taal);

  test(`${taal.code}: het bestand is gemaakt door het script (npm run landing:paginas)`, () => {
    expect(html).toBe(maakLanding(taal));
  });

  test(`${taal.code}: hreflang naar alle talen (ook zichzelf) en x-default naar Engels, canonical is de eigen pagina`, () => {
    const verwacht: Record<string, string> = { "x-default": volledigAdres(bron) };
    for (const t of talen) verwacht[t.code] = volledigAdres(t);
    expect(alternates(html)).toEqual(verwacht);
    expect(canonical(html)).toBe(eigen);
  });

  test(`${taal.code}: staat in sitemap.xml met alle hreflang-alternates`, () => {
    const blok = sitemap.split("<url>").find((b) => b.includes(`<loc>${eigen}</loc>`));
    expect(blok, eigen).toBeDefined();
    for (const t of talen) expect(blok).toContain(`hreflang="${t.code}" href="${volledigAdres(t)}"`);
    expect(blok).toContain(`hreflang="x-default" href="${volledigAdres(bron)}"`);
  });

  test(`${taal.code}: taal, richting, Open Graph, Smart App Banner en App Store van het land`, () => {
    expect(html).toContain(`<html lang="${taal.code}" dir="${taal.dir}">`);
    expect(html).toContain(`<meta property="og:locale" content="${taal.locale}" />`);
    expect(html).toContain(`<meta property="og:url" content="${eigen}" />`);
    expect(html).toMatch(/<meta property="og:title" content="[^"]{10,}" \/>/);
    expect(html).toMatch(/<meta property="og:description" content="[^"]{30,}" \/>/);
    expect(html).toMatch(/<meta property="og:image:alt" content="[^"]{10,}" \/>/);
    expect(html.match(/apple-itunes-app/g)).toHaveLength(1);
    expect(html).toContain(APP_BANNER);
    const winkel = winkelAdres(taal);
    expect(winkel).toBe(taal.winkel ? `https://apps.apple.com/${taal.winkel}/app/id6831230722` : "https://apps.apple.com/app/id6831230722");
    expect(html).toContain(`<a class="winkel" href="${winkel}">`);
    // Geen andere App Store-links (geen verkeerd land); de knop van Google Play staat er één keer, met het adres van de winkelpagina (taak 266).
    for (const m of html.matchAll(/https:\/\/apps\.apple\.com\/[^"]+/g)) expect(m[0]).toBe(winkel);
    expect(html).toContain(`<a class="winkel play" href="${PLAY_ADRES}">`);
    expect(html.match(/https:\/\/play\.google\.com\/[^"]+/g)).toEqual([PLAY_ADRES, PLAY_ADRES, PLAY_ADRES]); // knop, sameAs van de Organization en sameAs van de MobileApplication (taak 296)
    // De Ranglijst en de Dagelijkse puzzel staan bij "Zo kun je spelen", met de woorden die de app zelf gebruikt (taak 266).
    const woorden = appWoorden(taal.code);
    const vanaf = html.indexOf(`<h2>${taal.spelenKop}</h2>`);
    expect(vanaf).toBeGreaterThan(0);
    const spelen = html.slice(vanaf, html.indexOf("</ul>", vanaf));
    expect(spelen).toContain(`<strong>${woorden.ranglijst}`);
    expect(spelen).toContain(`<strong>${woorden.puzzel}`);
    expect(taal.spelen as string[]).toHaveLength(6);
    expect(html).toContain('href="/play/"');
    expect(html).toContain("<h1>");
  });

  test(`${taal.code}: taalkeuze bovenaan is een <details> met elke taal in de eigen taal en de eigen taal gemarkeerd`, () => {
    const nav = html.match(/<nav class="taal"[^>]*>(.*?)<\/nav>/)?.[1] ?? "";
    expect(nav).toMatch(/^<details><summary>.*<\/summary><ul>.*<\/ul><\/details>$/);
    for (const t of talen) {
      const markering = t === taal ? ' aria-current="page"' : "";
      expect(nav).toContain(`<li><a href="${t.adres}" hreflang="${t.code}" lang="${t.code}"${markering}>${t.naam}</a></li>`);
    }
    expect(nav).toContain(`<span lang="${taal.code}">${taal.naam}</span></summary>`);
    expect(html.match(/aria-current="page"/g)).toHaveLength(1);
  });

  test(`${taal.code}: zonder JavaScript van de app, laadt niets van buiten, alle beelden en links bestaan`, () => {
    const scripts = html.match(/<script[^>]*>/g) ?? [];
    // Alleen de Engelse pagina (/) heeft het kleine script dat Spelers van het beginscherm naar het spel stuurt.
    expect(scripts.filter((s) => !s.includes("application/ld+json"))).toHaveLength(taal === bron ? 1 : 0);
    expect(html).not.toMatch(/(src|href)="https?:\/\/(?!playleapstone\.com|apps\.apple\.com|play\.google\.com\/store\/apps\/details\?id=nl\.leapstone\.app")/);
    expect(html).not.toMatch(/<(iframe|form|link rel="stylesheet")/);
    for (const m of html.matchAll(/(?:src|srcset)="(\.{1,2}\/img\/[^"]+)"/g)) {
      expect(beeldBestanden, m[1]).toContain(`../landing/img/${m[1].split("/").pop()}`);
    }
    for (const m of html.matchAll(/<a [^>]*href="(\/[^"]*)"/g)) {
      const pad = m[1];
      const bekend = talen.some((t) => t.adres === pad) || pad === "/play/" || publiekeHtml.includes(`../public${pad}.html`);
      expect(bekend, `${taal.code}: ${pad}`).toBe(true);
    }
  });
}

test("geen pagina zegt nog dat de app Engels is (sinds versie 1.2.0, taak 131)", () => {
  for (const t of [bron, ...vertalingen]) expect(bestand(t)).not.toContain('class="noot"');
});

test("de Duitse pagina is Duits en verwijst naar de Duitse spelregels (taak 133)", () => {
  const de = bestand(talen.find((t) => t.code === "de") as Taal);
  expect(de).toContain("https://apps.apple.com/de/app/id6831230722");
  expect(de).toContain('href="/de/regeln/sternhalma"');
  expect(de).not.toContain('href="/rules/');
  expect(de).not.toContain("(auf Englisch)");
  expect(de).toContain('"priceCurrency": "EUR"');
  expect(de).not.toContain("The first player");
});

test("het script op / en zijn CSP-hash blijven zoals ze waren (taak 102)", () => {
  expect(bestand(bron)).toContain('location.replace("/play/")');
  expect(headers).toContain("'sha256-EgnXHvSzUGYqrbVmX0X4tGsvxm96XYX0s1FuJs4DsOs='");
});

test("sitemap.xml, llms.txt en _headers bevatten precies wat uit de taallijst komt (npm run landing:paginas)", () => {
  const stukken = landingStukken();
  const tussen = (tekst: string, begin: string, einde: string) => tekst.slice(tekst.indexOf(begin) + begin.length, tekst.indexOf(einde)).trim();
  expect(tussen(sitemap, "<!-- landing:begin (gemaakt door npm run landing:paginas uit web/landing/talen.mjs) -->", "<!-- landing:end -->")).toBe(stukken.sitemap.trim());
  expect(tussen(llms, "<!-- landing:begin -->", "<!-- landing:end -->")).toBe(stukken.llms.trim());
  expect(tussen(headers, "# landing:begin", "# landing:end")).toBe(stukken.headers.trim());
  for (const t of talen) expect(llms.includes(volledigAdres(t)) || t === bron).toBe(true);
});

test("een nieuwe taal hoeft alleen een vertaaltabel te zijn, ook van rechts naar links", () => {
  const ar = { ...vertalingen[0], code: "xr", locale: "ar_SA", dir: "rtl", naam: "العربية", adres: "/xr/", winkel: "sa" };
  const alle = [...talen, ar];
  const html = maakLanding(ar, alle);
  expect(html).toContain('<html lang="xr" dir="rtl">');
  expect(html).toContain(`<link rel="alternate" hreflang="xr" href="${BASIS}/xr/" />`);
  expect(html).toContain('hreflang="x-default" href="https://playleapstone.com/" />');
  expect(html).toContain("https://apps.apple.com/sa/app/id6831230722");
  // De andere pagina's krijgen de nieuwe taal in hun taalkeuze.
  expect(maakLanding(bron, alle)).toContain('<li><a href="/xr/" hreflang="xr" lang="xr">العربية</a></li>');
  const stukken = landingStukken(alle);
  expect(stukken.sitemap).toContain("<loc>https://playleapstone.com/xr/</loc>");
  expect(stukken.headers).toContain("/xr/*");
});

test("taak 134: 43 talen, rechts naar links bij ar, he en ur en nergens anders", () => {
  expect(talen).toHaveLength(BASISTALEN.length);
  expect(talen.map((t) => t.code)).toEqual(BASISTALEN);
  for (const t of talen) {
    expect(t.dir, t.code).toBe(RTL.includes(t.code) ? "rtl" : "ltr");
    expect(bestand(t), t.code).toContain(`<html lang="${t.code}" dir="${t.dir}">`);
  }
});

test("taak 134: de lokale spelnaam en het land van de winkeltekst komen terug op de pagina", () => {
  const winkelteksten: { locale: string; appstore: { naam: string } }[] = alleWinkelteksten();
  expect(winkelteksten).toHaveLength(50);
  // Per basistaal de winkeltekst die de pagina volgt (de variant die de basistaal draagt).
  const bronLocale: Record<string, string> = { ar: "ar-SA", bn: "bn-BD", es: "es-ES", fr: "fr-FR", gu: "gu-IN", kn: "kn-IN", ml: "ml-IN", mr: "mr-IN", or: "or-IN", pa: "pa-IN", pt: "pt-BR", sl: "sl-SI", ta: "ta-IN", te: "te-IN", ur: "ur-PK", "zh-hans": "zh-Hans" };
  for (const t of vertalingen.filter((x) => !["nl", "de"].includes(x.code))) {
    const w = winkelteksten.find((x) => x.locale === (bronLocale[t.code] ?? t.code));
    expect(w, t.code).toBeDefined();
    // De winkelnaam is "Leapstone: <spelnaam>"; de pagina noemt die spelnaam (alternateName), tenzij de winkel de Latijnse naam "Chinese Checkers" gebruikt.
    const winkelNaam = w!.appstore.naam.replace(/^Leapstone:\s*/, "");
    if (winkelNaam !== "Chinese Checkers") expect(t.alternateName, t.code).toContain(winkelNaam);
    expect(t.alternateName, t.code).toMatch(/^Leapstone:/);
    expect(bestand(t), t.code).toContain(`"alternateName": "${t.alternateName}"`);
  }
});

test("taak 134: de taalkeuze heeft geen JavaScript nodig en de CSP blijft strikt voor elke taal", () => {
  for (const t of vertalingen) {
    expect(bestand(t), t.code).not.toMatch(/<script(?![^>]*application\/ld\+json)/);
    expect(bestand(t), t.code).not.toMatch(/\son[a-z]+="/);
  }
  const csp = headers.match(/Content-Security-Policy: default-src 'none'; style-src 'unsafe-inline'; img-src 'self'; font-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'/g) ?? [];
  expect(csp.length).toBeGreaterThanOrEqual(vertalingen.length);
});

// De woorden van de app voor de Ranglijst en de Dagelijkse puzzel, per taal (web/src/talen/<code>.ts).
const appTalen = import.meta.glob("./talen/*.ts", { query: "?raw", import: "default", eager: true }) as Record<string, string>;
function appWoorden(code: string) {
  const bron = appTalen[`./talen/${code}.ts`];
  return { ranglijst: bron.match(/^\s*ranglijst: "([^"]+)"/m)![1], puzzel: bron.match(/"puzzle\.title": "([^"]+)"/)![1] };
}

// Taak 138: de App Store-badge in de eigen taal (officiële SVG van Apple, ongewijzigd, web/public/badges).
test("taak 138: elke Landingspagina en spelregelpagina toont de badge van zijn taal, of de Engelse als Apple de taal niet heeft", () => {
  const svgs = import.meta.glob("../public/badges/*.svg", { query: "?raw", import: "default", eager: true }) as Record<string, string>;
  const regelPaginas = import.meta.glob("../public/**/*.html", { query: "?raw", import: "default", eager: true }) as Record<string, string>;
  const svg = (code: string) => svgs[`../public/badges/app-store-badge-${code}.svg`];
  // Apple heeft geen Hindi-badge (toolbox.marketingtools.apple.com, 2026-11-09): hi valt terug op Engels.
  const TERUGVAL = ["hi"];
  expect(Object.keys(svgs)).toHaveLength(talen.length - TERUGVAL.length);
  const imgs = (html: string) => [...html.matchAll(/<img src="(\/badges\/app-store[^"]+)" width="(\d+)" height="(\d+)" alt="([^"]+)" \/>/g)];
  const controle = (html: string, taal: Taal, wat: string) => {
    const k = badge(taal);
    expect(k.code, wat).toBe(TERUGVAL.includes(taal.code) ? "en" : taal.code);
    expect(k.src, wat).toBe(`/badges/app-store-badge-${k.code}.svg`);
    expect(svg(k.code), wat).toBeTruthy();
    const gevonden = imgs(html ?? "");
    expect(gevonden, wat).toHaveLength(1);
    const [, src, breedte, hoogte, alt] = gevonden[0];
    expect(src, wat).toBe(k.src);
    expect(Number(hoogte), wat).toBeGreaterThanOrEqual(40);
    // De verhouding van het bestand blijft gelijk (niet vervormd).
    const vb = svg(k.code).match(/viewBox="[\d.\s-]*?([\d.]+)\s+([\d.]+)\s*"/)!;
    expect(Math.abs(Number(breedte) / Number(hoogte) - Number(vb[1]) / Number(vb[2])), wat).toBeLessThan(0.02);
    expect(alt, wat).toBe(taal.badgeAlt);
  };
  for (const t of talen) controle(bestand(t), t, `landing ${t.code}`);
  const alle = allePaginas() as { code: string; pad: string }[];
  expect(alle.length).toBeGreaterThan(200);
  for (const { code, pad } of alle) controle(regelPaginas[`../public${pad}.html`], talen.find((x) => x.code === code)!, `regels ${pad}`);
  // Alleen eigen bestanden: geen scripts of externe adressen in de badges (CSP: img-src 'self').
  for (const [f, tekst] of Object.entries(svgs)) expect(tekst, f).not.toMatch(/<script|<image|href="https?:/);
});

// Taak 266: de badge van Google Play in de eigen taal (officieel PNG van Google, ongewijzigd, web/public/badges), naast die van de App Store.
test("taak 266: elke Landingspagina en spelregelpagina toont de badge van Google Play in zijn taal, of de Engelse als Google de taal niet heeft", () => {
  const pngs = import.meta.glob("../public/badges/*.png", { query: "?url", import: "default", eager: true }) as Record<string, string>;
  const paginas = import.meta.glob("../public/**/*.html", { query: "?raw", import: "default", eager: true }) as Record<string, string>;
  // Google heeft geen Odia-badge (play.google.com/intl/en_us/badges, 2026-11-14): or valt terug op Engels.
  const TERUGVAL = ["or"];
  expect(Object.keys(pngs).filter((f) => f.includes("google-play-badge-"))).toHaveLength(talen.length - TERUGVAL.length);
  const imgs = (html: string) => [...html.matchAll(/<img src="(\/badges\/google-play[^"]+)" width="(\d+)" height="(\d+)" alt="([^"]+)" \/>/g)];
  const controle = (html: string, taal: Taal, wat: string) => {
    const k = playBadge(taal);
    expect(k.code, wat).toBe(TERUGVAL.includes(taal.code) ? "en" : taal.code);
    expect(k.src, wat).toBe(`/badges/google-play-badge-${k.code}.png`);
    expect(pngs[`../public${k.src}`], wat).toBeTruthy();
    const gevonden = imgs(html ?? "");
    expect(gevonden, wat).toHaveLength(1);
    const [, src, breedte, hoogte, alt] = gevonden[0];
    expect(src, wat).toBe(k.src);
    // Het plaatje van Google is 646 bij 250 en blijft onvervormd; de badge zelf (168 van 250) is even hoog als die van de App Store (52 px).
    expect(Number(hoogte), wat).toBe(PLAY_HOOGTE);
    expect(Math.abs(Number(breedte) / Number(hoogte) - 646 / 250), wat).toBeLessThan(0.01);
    expect((Number(hoogte) * 168) / 250, wat).toBeGreaterThanOrEqual(badge(taal).height);
    expect(alt, wat).toBe(taal.playAlt);
    expect(alt.length, wat).toBeGreaterThan(5);
  };
  for (const t of talen) controle(bestand(t), t, `landing ${t.code}`);
  for (const { code, pad } of allePaginas() as { code: string; pad: string }[]) controle(paginas[`../public${pad}.html`], talen.find((x) => x.code === code)!, `regels ${pad}`);
});

test("taak 266: het schema van elke Landingspagina heeft de App Store van het land en Google Play in sameAs, en geen beoordelingen", () => {
  for (const t of talen) {
    const ld = [...bestand(t).matchAll(/<script type="application\/ld\+json">\n([\s\S]*?)\n\s*<\/script>/g)].map((m) => JSON.parse(m[1]));
    expect(ld.find((x) => x["@type"] === "Organization").sameAs, t.code).toEqual([winkelAdres(t), PLAY_ADRES]);
    expect(ld.find((x) => x["@type"] === "MobileApplication").sameAs, t.code).toEqual([winkelAdres(t), PLAY_ADRES]);
    expect(JSON.stringify(ld), t.code).not.toMatch(/aggregateRating|ratingValue|interactionStatistic/);
  }
});
