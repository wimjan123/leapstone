// Taak 133: de spelregelpagina's en gidsen in elke taal (web/regels/paginas.mjs + web/regels/talen/<code>/<slug>.mjs).
// Per taal dezelfde koppen, plaatjes en getallen als de Engelse pagina, hreflang in alle richtingen, sitemap, llms.txt, CSP en links.
import { expect, test } from "vitest";
// @ts-expect-error gewone JavaScript-modules zonder typen
import { LANDING_TALEN } from "../landing/talen.mjs";
// @ts-expect-error gewone JavaScript-modules zonder typen
import { PAGINA_LIJST } from "../regels/paginas.mjs";
// @ts-expect-error gewone JavaScript-modules zonder typen
import { REGEL_TALEN } from "../regels/talen.mjs";
// @ts-expect-error gewone JavaScript-modules zonder typen
import { allePaginas, maakPagina, regelStukken, regelTaal } from "../regels/pagina.mjs";
import headers from "../public/_headers?raw";
import sitemap from "../public/sitemap.xml?raw";
import llms from "../public/llms.txt?raw";

const BASIS = "https://playleapstone.com";
interface Pagina { slug: string; soort: string; paden: Record<string, string> }
interface Taal { code: string; naam: string; naamEn: string; locale: string; adres: string; winkel: string; taalkeuze: string; voet: [string, string][] }
const paginas: Pagina[] = PAGINA_LIJST;
const landingTalen: Taal[] = LANDING_TALEN;
const codes: string[] = REGEL_TALEN.map((t: { code: string }) => t.code);
// Een pagina bestaat in elke taal, of alleen in het Engels (taak 139: de gids Halma vs Chinese checkers; de gids voor 3 spelers kreeg alle talen in taak 299).
const talenVan = (p: Pagina) => codes.filter((c) => p.paden[c]);
const alleenEngels = (p: Pagina) => talenVan(p).join() === "en";
const overal = paginas.filter((p) => !alleenEngels(p));
const engelsAlleen = paginas.filter(alleenEngels);

const bestanden = import.meta.glob("../public/**/*.html", { query: "?raw", import: "default", eager: true }) as Record<string, string>;
const html = (pagina: Pagina, code: string) => bestanden[`../public${pagina.paden[code]}.html`] ?? "";

/** De hreflang-links van een pagina, als { taal: adres }. */
function alternates(h: string): Record<string, string> {
  const uit: Record<string, string> = {};
  for (const m of h.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)" \/>/g)) uit[m[1]] = m[2];
  return uit;
}
const canonical = (h: string) => h.match(/<link rel="canonical" href="([^"]+)" \/>/)?.[1];
const hoofdtekst = (h: string) => h.slice(h.indexOf("<main>"), h.indexOf("<footer>"));
/** De secties van de inhoud, zonder de kop (taalkeuze, titel, knop) en zonder voet. */
const secties = (h: string) => [...h.matchAll(/<section aria-labelledby="([^"]+)"/g)].map((m) => m[1]);
// De App Store-badge (taak 138) staat per taal in een ander bestand; de plaatjes van het bord zijn taalloos en moeten gelijk zijn.
const beelden = (h: string) => [...h.matchAll(/<img src="([^"]+)"/g)].map((m) => m[1]).filter((s) => !s.startsWith("/badges/"));
/**
 * Alle getallen in de inhoud, zonder de extra sectie over Leapstone (alleen in vertalingen van de spelregelpagina Chinese checkers) en zonder
 * de tekst van links (een linknaam als "for 2 players" heet in een vertaling "twee spelers").
 */
const getallen = (h: string) => {
  const tekst = hoofdtekst(h).replace(/<section aria-labelledby="leapstone">[\s\S]*?<\/section>/, "").replace(/<header>[\s\S]*?<\/header>/, "").replace(/<a [^>]*>[\s\S]*?<\/a>/g, " ");
  return [...tekst.replace(/<[^>]*>/g, " ").matchAll(/\b\d+\b/g)].map((m) => m[0]).sort();
};

test("de lijst: elke pagina heeft een adres in elke taal of alleen in het Engels, de adressen zijn uniek, Engels staat in /rules en /guides", () => {
  expect(codes[0]).toBe("en");
  expect(landingTalen.map((t) => t.code)).toEqual(expect.arrayContaining(codes));
  const alle = paginas.flatMap((p) => Object.values(p.paden));
  expect(new Set(alle).size).toBe(alle.length);
  for (const p of paginas) {
    // Alle talen, of alleen Engels: niets ertussenin, en geen adres in een taal die we niet kennen.
    expect(alleenEngels(p) || talenVan(p).length === codes.length, p.slug).toBe(true);
    expect(Object.keys(p.paden).every((c) => codes.includes(c)), p.slug).toBe(true);
    expect(p.paden.en).toBe(`/${p.soort}/${p.slug}`);
    for (const c of talenVan(p).filter((x) => x !== "en")) expect(p.paden[c].startsWith(`/${c}/`)).toBe(true);
  }
  // Alleen Engels: de korte antwoordpagina's van feature 311 (taak 314 en 315). De gids Leapstone in cijfers (taak 320) staat sinds taak 321 in elke taal.
  expect(engelsAlleen.map((p) => p.slug)).toEqual(["can-you-move-backwards-in-chinese-checkers", "can-you-jump-your-own-piece-in-chinese-checkers", "can-you-jump-over-your-opponent-in-chinese-checkers"]);
  // Het oude adres blijft werken: de Nederlandse spelregels van Chinees dammen.
  expect(paginas.find((p) => p.slug === "chinese-checkers")?.paden.nl).toBe("/nl/chinees-dammen");
  expect(allePaginas()).toHaveLength(overal.length * codes.length + engelsAlleen.length);
});

test("elke taal heeft tekst voor elke pagina en dezelfde velden als het Engels", () => {
  const bron = REGEL_TALEN[0];
  for (const t of REGEL_TALEN.slice(1)) {
    // Alleen de pagina's die in elke taal bestaan; een alleen-Engelse pagina heeft in een andere taal geen tekst.
    expect(Object.keys(t.paginas).sort(), t.code).toEqual(overal.map((p) => p.slug).sort());
    for (const p of engelsAlleen) expect(t.paginas[p.slug], `${t.code}: ${p.slug} is alleen Engels`).toBeUndefined();
    expect(Object.keys(t.nav).sort(), t.code).toEqual(Object.keys(bron.nav).sort());
    for (const [slug, p] of Object.entries(t.paginas) as [string, Record<string, string>][]) {
      expect(Object.keys(p).sort(), `${t.code}/${slug}`).toEqual(Object.keys(bron.paginas[slug]).sort());
      for (const [veld, waarde] of Object.entries(p)) expect(waarde.trim().length, `${t.code}/${slug}.${veld}`).toBeGreaterThan(3);
    }
  }
});

for (const { pagina, code, pad } of allePaginas() as { pagina: Pagina; code: string; pad: string }[]) {
  const talenHier = talenVan(pagina);
  const hVolledig = html(pagina, code);
  const h = hVolledig;
  const enMetVoorplaat = html(pagina, "en");
  const en = enMetVoorplaat;
  const taal = landingTalen.find((t) => t.code === code) as Taal;
  const naam = `${code}${pad}`;

  test(`${naam}: het bestand is gemaakt door het script (npm run regels:paginas)`, () => {
    expect(h).not.toBe("");
    expect(h).toBe(maakPagina(pagina, code));
  });

  test(`${naam}: canonical, hreflang naar alle talen (ook zichzelf) en x-default naar Engels, taalkeuze`, () => {
    const verwacht: Record<string, string> = { "x-default": `${BASIS}${pagina.paden.en}` };
    for (const c of talenHier) verwacht[c] = `${BASIS}${pagina.paden[c]}`;
    expect(alternates(h)).toEqual(verwacht);
    expect(canonical(h)).toBe(`${BASIS}${pad}`);
    expect(h).toContain(`<meta property="og:url" content="${BASIS}${pad}" />`);
    const nav = h.match(/<nav class="taal"[^>]*>(.*?)<\/nav>/)?.[1] ?? "";
    // Een pagina in één taal heeft geen taalkeuze.
    if (talenHier.length === 1) expect(h).not.toContain('class="taal"');
    for (const c of talenHier.length === 1 ? [] : talenHier) {
      const l = landingTalen.find((t) => t.code === c) as Taal;
      expect(nav).toContain(`<a href="${pagina.paden[c]}" hreflang="${c}" lang="${c}" title="${l.naam}"${c === code ? ' aria-current="page"' : ""}>${c.toUpperCase()}</a>`);
    }
    expect(h.match(/aria-current="page"/g)?.length ?? 0).toBe(talenHier.length === 1 ? 0 : 1);
  });

  test(`${naam}: taal, Open Graph, Smart App Banner, Article-schema en niets van buiten`, () => {
    expect(h).toMatch(new RegExp(`<html lang="${code}"( dir="(ltr|rtl)")?>`));
    expect(h).toContain(`<meta property="og:locale" content="${taal.locale}" />`);
    expect(h.match(/og:locale:alternate/g)?.length ?? 0).toBe(talenHier.length - 1);
    for (const c of talenHier.filter((x) => x !== code)) expect(h).toContain(`<meta property="og:locale:alternate" content="${(landingTalen.find((t) => t.code === c) as Taal).locale}" />`);
    expect(h).toContain('"@type": "Article"');
    expect(h).toContain(`"inLanguage": "${code}"`);
    expect(h).toContain(`"url": "${BASIS}${pad}"`);
    expect(h.match(/apple-itunes-app/g)).toHaveLength(1);
    expect(h).toMatch(/<title>[^<]{20,75}<\/title>/);
    expect(h).toMatch(/<meta name="description" content="[^"]{60,210}"/);
    expect(h).toContain("<h1>");
    expect(h).toContain('href="/play/"');
    const scripts = h.match(/<script[^>]*>/g) ?? [];
    expect(scripts.every((s) => s.includes("application/ld+json"))).toBe(true);
    expect(h).not.toMatch(/(src|href)="https?:\/\/(?!playleapstone\.com|apps\.apple\.com|play\.google\.com\/store\/apps\/details\?id=nl\.leapstone\.app")/);
    expect(h).not.toMatch(/<(iframe|form|link rel="stylesheet")/);
    // Naast de App Store staat de knop van Google Play, met het adres van de winkelpagina (taak 266).
    expect(h.match(/https:\/\/play\.google\.com\/[^"]+/g)).toEqual(["https://play.google.com/store/apps/details?id=nl.leapstone.app"]);
    // Sinds versie 1.2.0 is de app vertaald: geen noot meer dat de app Engels is (taak 131).
    expect(h).not.toContain('class="noot"');
    // Een App Store-link heeft het land van de taal.
    for (const m of h.matchAll(/https:\/\/apps\.apple\.com\/[^"]+/g)) expect(m[0]).toBe(`https://apps.apple.com/${taal.winkel ? `${taal.winkel}/` : ""}app/id6831230722`);
  });

  test(`${naam}: dezelfde koppen, plaatjes en getallen als de Engelse pagina, alle plaatjes met alt-tekst`, () => {
    // Het plaatje bovenaan de Engelse pagina Chinese checkers (taak 316) staat alleen daar; de vertalingen blijven zoals ze zijn.
    const zonderVoorplaat = (x: string) => x.replace(/<figure class="enkel voorplaat"[\s\S]*?<\/figure>\n*/, "");
    const en = zonderVoorplaat(enMetVoorplaat);
    const h = zonderVoorplaat(hVolledig);
    const extra = code !== "en" && pagina.slug === "chinese-checkers" ? ["leapstone"] : [];
    expect(secties(h)).toEqual([...secties(en), ...extra]);
    expect([...h.matchAll(/<h2 id="([^"]+)"/g)].map((m) => m[1])).toEqual([...en.matchAll(/<h2 id="([^"]+)"/g)].map((m) => m[1]).concat(extra));
    expect(beelden(h)).toEqual(beelden(en));
    // In de gids voor 2 spelers heet "a game for 2" in een vertaling "zu zweit" of "voor twee": daar telt de 2 niet mee.
    // Zo ook "for 3" ("zu dritt") en "2 players" in de gids voor 3 spelers (taak 299).
    const zonderTwee = (l: string[]) => (pagina.slug === "chinese-checkers-2-players" ? l.filter((g) => g !== "2") : pagina.slug === "chinese-checkers-3-players" ? l.filter((g) => g !== "2" && g !== "3") : l);
    // In de gids voor 4 spelers heet "a game for 2", "3 players" en "4 players" in een vertaling vaak "zu zweit", "drie" of "zu viert": daar tellen alleen de getallen boven 4 mee (10, 20, 30, 40, 121, en 6 van de knop "Find 4 or 6 players").
    const bovenVier = (l: string[]) => (pagina.slug === "chinese-checkers-4-players" ? l.filter((g) => Number(g) > 4) : l);
    expect(bovenVier(zonderTwee(getallen(h)))).toEqual(bovenVier(zonderTwee(getallen(en))));
    // Een alt-tekst in Chinees, Japans, Koreaans of Thais is met minder tekens even uitgebreid (taak 134).
    const minAlt = ["ja", "ko", "zh-hans", "th"].includes(code) ? 8 : 20;
    expect(h).not.toMatch(new RegExp(`<img(?! src="/badges/)(?![^>]* alt="[^"]{${minAlt},}")`));
    // Zelfde lijsten: evenveel opsommingen en alinea's in de inhoud (afgezien van de extra sectie).
    const tel = (x: string, t: string) => (hoofdtekst(x).replace(/<section aria-labelledby="leapstone">[\s\S]*?<\/section>/, "").match(new RegExp(`<${t}[ >]`, "g")) ?? []).length;
    for (const t of ["li", "figure", "ul"]) expect(tel(h, t), `${naam}: <${t}>`).toBe(tel(en, t));
  });

  test(`${naam}: staat in sitemap.xml met alle hreflang-alternates`, () => {
    const blok = sitemap.split("<url>").find((b) => b.includes(`<loc>${BASIS}${pad}</loc>`));
    expect(blok, pad).toBeDefined();
    for (const c of talenHier) expect(blok).toContain(`hreflang="${c}" href="${BASIS}${pagina.paden[c]}"`);
    expect((blok ?? "").match(/hreflang="/g)).toHaveLength(talenHier.length + 1);
    expect(blok).toContain(`hreflang="x-default" href="${BASIS}${pagina.paden.en}"`);
    expect(llms).toContain(`${BASIS}${pad}`);
  });

  test(`${naam}: links blijven in de eigen taal en wijzen naar bestaande pagina's; de voet heeft alle pagina's van de taal`, () => {
    const hier = paginas.filter((p) => p.paden[code]);
    const eigen = new Set<string>(["/play/", "/privacy", "/terms", taal.adres, ...hier.map((p) => p.paden[code])]);
    const zonderTaalkeuze = h.replace(/<nav class="taal"[\s\S]*?<\/nav>/, "");
    for (const m of zonderTaalkeuze.matchAll(/<a [^>]*href="(\/[^"]*)"/g)) expect(eigen.has(m[1]), `${naam}: ${m[1]}`).toBe(true);
    const voet = h.slice(h.indexOf("<footer>"));
    for (const p of hier) expect(voet).toContain(`<a href="${p.paden[code]}">`);
    expect(voet).toContain(`<a href="${taal.adres}">`);
    // Een pagina die alleen in het Engels bestaat staat niet in de voet van een vertaalde pagina.
    if (code !== "en") for (const p of engelsAlleen) expect(voet).not.toContain(p.paden.en);
  });
}

test("de oude Nederlandse spelregels staan nog op /nl/chinees-dammen, met de Nederlandse App Store", () => {
  const nl = bestanden["../public/nl/chinees-dammen.html"];
  expect(nl).toContain('<html lang="nl">');
  expect(nl).toContain("Chinees dammen: spelregels");
  expect(nl).toContain("https://apps.apple.com/nl/app/id6831230722");
  expect(nl).not.toContain("De app is nog in het Engels.");
});

test("de Duitse Sternhalma-spelregels staan op /de/regeln/sternhalma, met de Duitse App Store", () => {
  const de = bestanden["../public/de/regeln/sternhalma.html"];
  expect(de).toContain('<html lang="de">');
  expect(de).toContain("<h1>Sternhalma (Chinese Checkers): Spielregeln</h1>");
  expect(de).toContain("https://apps.apple.com/de/app/id6831230722");
  expect(de).not.toContain("Die App ist noch auf Englisch.");
});

// Een pagina met `nietOpLanding` (de gids Leapstone in cijfers, taak 321: geen link vanaf de Landingspagina tot na 2026-12-10) staat niet in de Landingspagina.
const opLanding = overal.filter((p) => !(p as Pagina & { nietOpLanding?: boolean }).nietOpLanding);

test("de Landingspagina's linken naar de vertaalde pagina's (taalkeuze, tekst en voet), niet naar de Engelse", () => {
  // Alleen de talen met vertaalde pagina's (taak 133); de andere Landingspagina's (taak 134) linken naar de Engelse (zie landing.test.ts).
  for (const t of landingTalen.filter((x) => x.code !== "en" && codes.includes(x.code))) {
    const landing = (import.meta.glob("../landing/*/index.html", { query: "?raw", import: "default", eager: true }) as Record<string, string>)[`../landing/${t.code}/index.html`];
    expect(landing, t.code).toBeDefined();
    for (const p of opLanding) {
      expect(landing, `${t.code}: ${p.slug}`).toContain(`href="${p.paden[t.code]}"`);
      expect(landing, `${t.code}: geen Engelse ${p.slug}`).not.toContain(`href="${p.paden.en}"`);
    }
    // De alleen-Engelse gidsen staan niet in de taalkeuze, de tekst of de voet van een vertaalde Landingspagina.
    for (const p of engelsAlleen) expect(landing, `${t.code}: ${p.slug}`).not.toContain(p.paden.en);
    for (const p of overal.filter((x) => !opLanding.includes(x))) expect(landing, `${t.code}: ${p.slug} niet op de Landingspagina`).not.toContain(`href="${p.paden[t.code]}"`);
    // De voet van de Landingspagina heeft precies de navigatie van de spelregelpagina's (Landingspagina zelf en terug naar het spel daargelaten).
    const nav = regelTaal(t.code);
    const verwacht = [["/play/", nav.nav.spelen], ...opLanding.map((p) => [p.paden[t.code], nav.paginas[p.slug].nav]), ["/privacy", nav.nav.privacy], ["/terms", nav.nav.terms]];
    expect(t.voet).toEqual(verwacht);
  }
});

test("sitemap.xml en llms.txt bevatten precies wat uit de pagina-lijst komt (npm run regels:paginas)", () => {
  const stukken = regelStukken();
  const tussen = (tekst: string, begin: string, einde: string) => tekst.slice(tekst.indexOf(begin) + begin.length, tekst.indexOf(einde)).trim();
  expect(tussen(sitemap, "<!-- regels:begin (gemaakt door npm run regels:paginas uit web/regels/paginas.mjs) -->", "<!-- regels:end -->")).toBe(stukken.sitemap.trim());
  expect(tussen(llms, "<!-- regels:begin -->", "<!-- regels:end -->")).toBe(stukken.llms.trim());
  // Elke Engelse pagina staat ook met de hand in llms.txt (met beschrijving).
  for (const p of paginas) expect(llms).toContain(`${BASIS}${p.paden.en}`);
});

test("CSP: /rules/*, /guides/* en /<taal>/* hebben dezelfde strikte regel zonder script", () => {
  const csp = "default-src 'none'; style-src 'unsafe-inline'; img-src 'self'; font-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'";
  for (const dir of ["rules", "guides", ...codes.filter((c) => c !== "en")]) expect(headers).toContain(`/${dir}/*\n  Content-Security-Policy: ${csp}`);
  // Het Worker-pad (run_worker_first in wrangler.toml, buiten web/) bewaakt de Rust-test html_paden_gaan_eerst_naar_de_worker.
});

test("versheid en vragen voor AI-zoekers: dateModified, lastmod en de sectie met vragen in elke taal", () => {
  const vragen: Record<string, number> = { "chinese-checkers": 6, halma: 5 };
  for (const p of paginas as (Pagina & { bijgewerkt: string })[]) {
    expect(p.bijgewerkt, p.slug).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    for (const c of talenVan(p)) {
      const h = html(p, c);
      expect(h, `${c}: ${p.slug}`).toContain(`"dateModified": "${p.bijgewerkt}"`);
      expect(sitemap, `${c}: ${p.slug}`).toContain(`<loc>${BASIS}${p.paden[c]}</loc>\n    <lastmod>${p.bijgewerkt}</lastmod>`);
      if (!vragen[p.slug]) continue;
      // Elke vraag is een eigen kop met direct één alinea antwoord eronder, zodat een zoekmachine het antwoord los kan citeren.
      const sectie = h.match(/<section aria-labelledby="vragen">([\s\S]*?)<\/section>/)?.[1] ?? "";
      expect(sectie.match(/<h3>[^<]+<\/h3>\s*<p>/g)?.length, `${c}: ${p.slug}`).toBe(vragen[p.slug]);
    }
  }
});

// Taak 309: elke pagina heeft een kruimelpad als schema (BreadcrumbList): Landingspagina van de taal, dan de pagina zelf. Er is geen
// overzichtspagina voor Spelregels of Gidsen, dus geen middelste stap. Elk adres wijst naar een bestaande pagina in dezelfde taal.
const landingBestanden = import.meta.glob("../landing/**/index.html", { query: "?raw", import: "default", eager: true }) as Record<string, string>;

test("elke spelregelpagina en gids heeft een geldig BreadcrumbList met adressen die bestaan, in de eigen taal", () => {
  let gezien = 0;
  for (const pagina of paginas) {
    for (const code of talenVan(pagina)) {
      const h = html(pagina, code);
      const blokken = [...h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]));
      const lijsten = blokken.filter((b) => b["@type"] === "BreadcrumbList");
      expect(lijsten.length, `${code} ${pagina.slug}: precies één BreadcrumbList`).toBe(1);
      const items = lijsten[0].itemListElement as { "@type": string; position: number; name: string; item: string }[];
      expect(items.map((i) => i.position), `${code} ${pagina.slug}`).toEqual([1, 2]);
      const landing = landingTalen.find((l) => l.code === code)!;
      const landingBestand = landing.adres === "/" ? "../landing/index.html" : `../landing${landing.adres}index.html`;
      expect(items[0].item, `${code} ${pagina.slug}: Landingspagina`).toBe(`${BASIS}${landing.adres}`);
      expect(landingBestanden[landingBestand], `${code}: ${landingBestand} bestaat`).toBeDefined();
      expect(items[1].item, `${code} ${pagina.slug}: de pagina zelf`).toBe(`${BASIS}${pagina.paden[code]}`);
      expect(bestanden[`../public${new URL(items[1].item).pathname}.html`], `${code} ${pagina.slug}: pagina bestaat`).toBeDefined();
      expect(items.every((i) => i["@type"] === "ListItem" && i.name.length > 0)).toBe(true);
      expect(h).not.toMatch(/"@type": "(FAQPage|HowTo)"/);
      gezien++;
    }
  }
  expect(gezien).toBeGreaterThan(250);
});
