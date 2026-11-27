import { readFileSync } from "node:fs";
import { beforeAll, expect, test } from "vitest";
import { initSync } from "./wasm/halma_core.js";
import { bordje } from "./bordje";
// @ts-expect-error gewone JavaScript-modules zonder typen
import { PAGINA_LIJST } from "../regels/paginas.mjs";
// @ts-expect-error gewone JavaScript-modules zonder typen
import { maakPagina } from "../regels/pagina.mjs";
import chinese from "../public/rules/chinese-checkers.html?raw";
import halma from "../public/rules/halma.html?raw";
import sternhalma from "../public/rules/sternhalma.html?raw";
import strategie from "../public/guides/chinese-checkers-strategy.html?raw";
import tweeSpelers from "../public/guides/chinese-checkers-2-players.html?raw";
import drieSpelers from "../public/guides/chinese-checkers-3-players.html?raw";
import vierSpelers from "../public/guides/chinese-checkers-4-players.html?raw";
import onlineMetVrienden from "../public/guides/play-chinese-checkers-online-with-friends.html?raw";
import halmaTegenover from "../public/guides/halma-vs-chinese-checkers.html?raw";
import zesSpelers from "../public/guides/chinese-checkers-6-players.html?raw";
import openingen from "../public/guides/chinese-checkers-opening-moves.html?raw";
import landing from "../landing/index.html?raw";
import achteruit from "../public/rules/can-you-move-backwards-in-chinese-checkers.html?raw";
import eigenSteen from "../public/rules/can-you-jump-your-own-piece-in-chinese-checkers.html?raw";
import tegenstander from "../public/rules/can-you-jump-over-your-opponent-in-chinese-checkers.html?raw";
import cijfersPagina from "../public/guides/chinese-checkers-by-the-numbers.html?raw";
import cijfers from "../regels/cijfers.json";
import llms from "../public/llms.txt?raw";
import headers from "../public/_headers?raw";
import sitemap from "../public/sitemap.xml?raw";

const bestanden: Record<string, string> = { "chinese-checkers": chinese, halma, sternhalma };
// Taak 314: korte antwoordpagina's in /rules, alleen Engels (zie het blok onderaan).
// Taak 315: een derde, over springen over de stenen van de ander.
const antwoorden: Record<string, string> = { "can-you-move-backwards-in-chinese-checkers": achteruit, "can-you-jump-your-own-piece-in-chinese-checkers": eigenSteen, "can-you-jump-over-your-opponent-in-chinese-checkers": tegenstander };
beforeAll(() => {
  initSync({ module: readFileSync("src/wasm/halma_core_bg.wasm") });
});
// De Engelse pagina's en gidsen (de andere talen: regelstalen.test.ts).
const PAGINAS = (PAGINA_LIJST as { slug: string; soort: string }[]).filter((p) => p.soort === "rules");
// De gids Leapstone in cijfers (taak 320, in elke taal sinds taak 321) heeft zijn eigen tests onderaan; de gidsen hieronder zijn die van taak 122.
const CIJFERS = "chinese-checkers-by-the-numbers";
const GIDSEN = (PAGINA_LIJST as { slug: string; soort: string }[]).filter((p) => p.soort === "guides" && p.slug !== CIJFERS);

test("elke spelregelpagina is gewone HTML met canonical, sitemap en CSP (het Worker-pad bewaakt de Rust-test html_paden_gaan_eerst_naar_de_worker)", () => {
  for (const p of PAGINAS as { slug: string }[]) {
    const html = bestanden[p.slug] ?? antwoorden[p.slug];
    const adres = `https://playleapstone.com/rules/${p.slug}`;
    expect(html).toContain(`<link rel="canonical" href="${adres}" />`);
    expect(html).toContain(`<meta property="og:url" content="${adres}" />`);
    expect(sitemap).toContain(`<loc>${adres}</loc>`);
    // Geen JavaScript, niets van buiten.
    const scripts = html.match(/<script[^>]*>/g) ?? [];
    expect(scripts.every((s) => s.includes("application/ld+json"))).toBe(true);
    expect(html).not.toMatch(/(src|href)="https?:\/\/(?!playleapstone\.com|apps\.apple\.com\/(?:[a-z]{2}\/)?app\/id6831230722"|play\.google\.com\/store\/apps\/details\?id=nl\.leapstone\.app")/);
    expect(html).toContain('href="/play/">Play now</a>');
  }
  expect(headers).toMatch(/\/rules\/\*\n\s+Content-Security-Policy: default-src 'none'/);
});

test("elke spelregelpagina linkt naar de andere twee en naar /play/, en heeft Article-schema en Open Graph", () => {
  const slugs = Object.keys(bestanden).sort();
  expect(slugs).toEqual(["chinese-checkers", "halma", "sternhalma"]);
  for (const slug of slugs) {
    const html = bestanden[slug];
    for (const ander of slugs.filter((s) => s !== slug)) expect(html, `${slug} -> ${ander}`).toContain(`href="/rules/${ander}"`);
    expect(html).toContain('href="/play/"');
    expect(html).toContain('"@type": "Article"');
    expect(html).toContain('<meta property="og:title"');
    expect(html).toMatch(/<meta name="description" content="[^"]{40,}"/);
    // Alle tekst staat in de HTML zelf, zonder JavaScript: een kop en geen script behalve het schema.
    expect(html).toContain("<h1>");
  }
});

// Taak 122: de Engelse gidsen in /guides.
const gidsen: Record<string, string> = { "chinese-checkers-strategy": strategie, "chinese-checkers-2-players": tweeSpelers, "chinese-checkers-3-players": drieSpelers, "chinese-checkers-4-players": vierSpelers, "halma-vs-chinese-checkers": halmaTegenover, "chinese-checkers-6-players": zesSpelers, "chinese-checkers-opening-moves": openingen, "play-chinese-checkers-online-with-friends": onlineMetVrienden };
const BANNER = '<meta name="apple-itunes-app" content="app-id=6831230722" />';

test("de gidsen in public/guides zijn gemaakt door het script (npm run regels:paginas)", () => {
  expect((GIDSEN as { slug: string }[]).map((g) => g.slug).sort()).toEqual(Object.keys(gidsen).sort());
  for (const g of GIDSEN as { slug: string }[]) expect(maakPagina(g, "en")).toBe(gidsen[g.slug]);
});

test("elke gids heeft titel, beschrijving, canonical, Open Graph, Article-schema, het Smart App Banner en geen script", () => {
  for (const [slug, html] of Object.entries(gidsen)) {
    const adres = `https://playleapstone.com/guides/${slug}`;
    expect(html).toContain(`<link rel="canonical" href="${adres}" />`);
    expect(html).toContain(`<meta property="og:url" content="${adres}" />`);
    expect(html).toMatch(/<title>[^<]{20,70}<\/title>/);
    expect(html).toMatch(/<meta name="description" content="[^"]{60,200}"/);
    expect(html).toContain('<meta property="og:title"');
    expect(html).toContain('"@type": "Article"');
    expect(html).toContain(`"url": "${adres}"`);
    expect(html).toContain('<html lang="en">');
    expect(html.match(/apple-itunes-app/g)).toHaveLength(1);
    expect(html).toContain(BANNER);
    // Met JavaScript uit is alle tekst zichtbaar: gewone HTML, geen script behalve het schema, niets van buiten.
    const scripts = html.match(/<script[^>]*>/g) ?? [];
    expect(scripts.every((x) => x.includes("application/ld+json"))).toBe(true);
    expect(html).not.toMatch(/(src|href)="https?:\/\/(?!playleapstone\.com|apps\.apple\.com\/(?:[a-z]{2}\/)?app\/id6831230722"|play\.google\.com\/store\/apps\/details\?id=nl\.leapstone\.app")/);
    expect(html).toContain("<h1>");
    expect(html).toContain('href="/play/"');
    // In de sitemap, in llms.txt en in de navigatie van elke pagina.
    expect(sitemap).toContain(`<loc>${adres}</loc>`);
    expect(llms).toContain(adres);
  }
  expect(headers).toMatch(/\/guides\/\*\n\s+Content-Security-Policy: default-src 'none'; style-src 'unsafe-inline'; img-src 'self'/);
});

test("links naar en vanaf de gidsen: elke spelregelpagina, de gidsen onderling en de Landingspagina", () => {
  const paden = Object.keys(gidsen).map((s) => `/guides/${s}`);
  for (const html of [...Object.values(bestanden), ...Object.values(gidsen), landing]) {
    for (const pad of paden) expect(html, pad).toContain(`href="${pad}"`);
  }
  // Elke gids linkt ook naar de spelregels.
  for (const html of Object.values(gidsen)) expect(html).toContain('href="/rules/chinese-checkers"');
  // Alle plaatjes bestaan in public/rules/img en hebben een alt-tekst.
  for (const html of Object.values(gidsen)) {
    for (const m of html.matchAll(/<img src="(\/rules\/img\/[^"]+)" width="\d+" height="\d+" alt="([^"]+)"/g)) {
      expect(m[2].length).toBeGreaterThan(20);
    }
    expect(html).not.toMatch(/<img(?![^>]* alt="[^"]+")/);
  }
});

test("de gids voor 2 Spelers noemt wat de app echt doet: /play/, Play online, Snel potje van 30 seconden, Computerspelers", () => {
  expect(tweeSpelers).toContain('href="/play/">Leapstone in your browser</a>');
  expect(tweeSpelers).toContain("Play online");
  expect(tweeSpelers).toContain("30 seconds per move");
  expect(tweeSpelers).toContain("Some online opponents may be computer players");
  expect(tweeSpelers).not.toMatch(/all (online )?opponents are (real|human)/i);
});

// Taak 139: een gids die alleen in het Engels bestaat. (De gids voor 3 spelers stond hier ook, tot taak 299 hem in alle talen zette.)
const NIEUW: string[] = []; // Taak 299 en 300: geen gids is nog alleen-Engels; de lus hieronder is dan leeg en werkt weer bij een nieuwe alleen-Engelse gids.
const ANDERE_TALEN = ["nl", "de", "fr", "ja", "ar", "zh-hans"];

test("de nieuwe gidsen staan alleen in het Engels: hreflang alleen naar zichzelf en x-default, geen taalkeuze, geen Open Graph-taalalternatief", () => {
  for (const slug of NIEUW) {
    const html = gidsen[slug];
    const adres = `https://playleapstone.com/guides/${slug}`;
    expect((PAGINA_LIJST as { slug: string; paden: Record<string, string> }[]).find((p) => p.slug === slug)?.paden).toEqual({ en: `/guides/${slug}` });
    expect([...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)" \/>/g)].map((m) => [m[1], m[2]])).toEqual([["en", adres], ["x-default", adres]]);
    expect(html).not.toContain('class="taal"');
    expect(html).not.toContain("og:locale:alternate");
    expect(html).toContain('"inLanguage": "en"');
    // In de sitemap met alleen die twee alternates.
    const blok = sitemap.split("<url>").find((b) => b.includes(`<loc>${adres}</loc>`)) ?? "";
    expect(blok.match(/hreflang="/g)).toHaveLength(2);
    // Geen FAQ- of HowTo-schema: alleen Article.
    const schema = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1] ?? "";
    expect(JSON.parse(schema)["@type"]).toBe("Article");
    expect(html).not.toMatch(/FAQPage|HowTo|"Question"/);
  }
});

test("geen enkele vertaalde pagina of Landingspagina linkt naar de nieuwe gidsen", () => {
  const alle = import.meta.glob(["../public/*/**/*.html", "../landing/*/index.html"], { query: "?raw", import: "default", eager: true }) as Record<string, string>;
  const vertaald = Object.entries(alle).filter(([pad]) => ANDERE_TALEN.some((c) => pad.includes(`/${c}/`)));
  expect(vertaald.length).toBeGreaterThan(20);
  for (const [pad, html] of vertaald) for (const slug of NIEUW) expect(html, `${pad}: ${slug}`).not.toContain(slug);
});

test("de nieuwe gidsen worden gelinkt vanaf de Engelse Landingspagina (tekst en voet), de spelregelpagina's en de andere gidsen", () => {
  for (const slug of ["halma-vs-chinese-checkers", "chinese-checkers-3-players"]) {
    const pad = `/guides/${slug}`;
    expect(landing).toContain(`<a href="${pad}">`);
    expect(landing.slice(landing.indexOf("<footer"))).toContain(`<a href="${pad}">`);
    for (const html of [chinese, halma, sternhalma, strategie, tweeSpelers]) expect(html).toContain(`href="${pad}"`);
  }
  // De nieuwe gidsen linken naar de spelregels, de strategie en de gids voor 2 Spelers, en de gids over Halma naar die voor 3 Spelers.
  expect(halmaTegenover).toContain('href="/guides/chinese-checkers-3-players"');
  expect(drieSpelers).toContain('href="/guides/chinese-checkers-2-players"');
  expect(drieSpelers).toContain('href="/guides/chinese-checkers-strategy"');
  expect(halmaTegenover).toContain('href="/rules/halma"');
  expect(halmaTegenover).toContain('href="/rules/chinese-checkers"');
});

test("de gids Halma vs Chinese checkers heeft de plaatjes van beide borden en de getallen uit halma-core", () => {
  expect(halmaTegenover).toContain('src="/rules/img/setup-2.svg"');
  expect(halmaTegenover).toContain('src="/rules/img/halma-setup-2.svg"');
  expect(halmaTegenover).toContain('src="/rules/img/step.svg"');
  expect(halmaTegenover).toContain('src="/rules/img/halma-step.svg"');
  // 121 en 256 vakken, 6 en 8 richtingen, 10 / 19 / 13 stenen: regelplaatjes.rs (blok 19) controleert ze met assert!.
  for (const tekst of ["121 spots", "256", "six neighbors", "eight", "10 pieces", "19 pieces", "13 pieces", "20, 30, 40 or 60", "38 in all", "52 in all"]) expect(halmaTegenover, tekst).toContain(tekst);
  expect(halmaTegenover).not.toMatch(/experts?|professional|world champion|popular|most players/i);
});

test("de gids voor 3 Spelers: opstelling, doelen, wie begint, winst en wat de app echt doet", () => {
  expect(drieSpelers).toContain('src="/rules/img/setup-3.svg"');
  expect(drieSpelers).toContain('src="/rules/img/setup-3-goals.svg"');
  for (const tekst of ["30 pieces", "every other point", "Player 1, red, moves first", "all empty at the start", "the other two play on", "skipped", "3 turns in a row", "30 on the board, against 20"]) expect(drieSpelers, tekst).toContain(tekst);
  // Wat de app doet: Computer met 2 computers, een telefoon, vrienden, en geen Snel potje voor 3.
  expect(drieSpelers).toContain('href="/play/">Leapstone in your browser</a>');
  expect(drieSpelers).toContain("choose the star board and 2 computers");
  expect(drieSpelers).toContain("there is no quick game for 3");
  expect(drieSpelers).not.toMatch(/Play online (finds|has) .*for 3 players/);
  expect(drieSpelers).not.toMatch(/experts?|professional|world champion/i);
});

// Taak 302: de gids voor 6 Spelers staat in alle talen (regelstalen.test.ts); hier de Engelse tekst en wat de app echt doet.
test("de gids voor 6 Spelers: opstelling, doelen, het midden, winst en wat de app echt doet", () => {
  expect(zesSpelers).toContain('src="/rules/img/setup-6.svg"');
  expect(zesSpelers).toContain('src="/rules/img/setup-6-goal.svg"');
  expect(zesSpelers).toContain('src="/rules/img/six-jump.svg"');
  // 60 stenen op 121 vakken, 61 vakken in het midden, doel van rood is het begin van Speler 4: regelplaatjes.rs (blok 22) controleert ze met assert!.
  for (const tekst of ["60 pieces", "121 spots", "The 61 spots", "Player 1, red, moves first", "where Player 4 starts", "the pieces of that player stay on the board", "only one player is still playing", "3 turns in a row", "15 seconds, 30 seconds, 1 minute, 2 minutes or no limit"]) expect(zesSpelers, tekst).toContain(tekst);
  // Wat de app doet: Computer met 5 computers, een telefoon, vrienden, en geen Snel potje voor 6.
  expect(zesSpelers).toContain('href="/play/">Leapstone in your browser</a>');
  expect(zesSpelers).toContain("choose the star board and 5 computers");
  expect(zesSpelers).toContain("there is no quick game for 6");
  expect(zesSpelers).not.toMatch(/Play online (finds|has) .*for 6 players/);
  expect(zesSpelers).not.toMatch(/FAQPage|experts?|professional|world champion/i);
});

test("de gids over online spelen met vrienden noemt de Denktijden die de app aanbiedt, en niet meer", async () => {
  // De gids zegt: 15 seconds, 30 seconds, 1 minute or 2 minutes, plus "no limit". De app biedt DENKTIJDEN aan (web/src/denktijd.ts).
  const { DENKTIJDEN } = await import("./denktijd");
  const secties = onlineMetVrienden.match(/<section aria-labelledby="denktijd">([\s\S]*?)<\/section>/)?.[1] ?? "";
  const keuzes = secties.match(/<strong>The choices:<\/strong>([^<]*)</)?.[1] ?? "";
  const seconden = [...keuzes.split(". ")[0].matchAll(/(\d+) (second|minute)/g)].map((m) => Number(m[1]) * (m[2] === "minute" ? 60 : 1));
  expect(seconden).toEqual(DENKTIJDEN.filter((d) => d !== null));
  expect(keuzes).toContain("turn it off");
  expect(DENKTIJDEN).toContain(null);
});

// Taak 314 (feature 311): twee korte antwoordpagina's op spelregelvragen, alleen Engels, met het antwoord in de eerste zin.
test("de antwoordpagina's: antwoord in de eerste zin, plaatje, links vanaf de spelregels, alleen Engels, geen FAQPage", () => {
  for (const [slug, html] of Object.entries(antwoorden)) {
    const pagina = (PAGINA_LIJST as { slug: string; paden: Record<string, string> }[]).find((p) => p.slug === slug);
    expect(pagina?.paden, slug).toEqual({ en: `/rules/${slug}` });
    expect(html.match(/<p class="intro">([^<]*)/)?.[1], slug).toMatch(/^(Yes|No), /);
    expect(html).toMatch(/<img src="\/rules\/img\/answer-[a-z-]+\.svg" width="\d+" height="\d+" alt="[^"]{20,}"/);
    expect(html).toContain('href="/play/"');
    expect(html).toContain("apps.apple.com");
    expect(html).toContain("play.google.com");
    expect(html).not.toMatch(/"@type": "(FAQPage|HowTo)"/);
    expect(html).not.toContain('hreflang="nl"');
    expect(chinese, slug).toContain(`href="/rules/${slug}"`);
    expect(sitemap).toContain(`<loc>https://playleapstone.com/rules/${slug}</loc>`);
    expect(llms).toContain(`https://playleapstone.com/rules/${slug}`);
  }
  expect(strategie).toContain('href="/rules/can-you-move-backwards-in-chinese-checkers"');
  expect(strategie).toContain('href="/rules/can-you-jump-your-own-piece-in-chinese-checkers"');
});

// Taak 320 (feature 313): de gids Leapstone in cijfers. Elk getal staat in <span data-feit="sleutel"> en komt uit web/regels/cijfers.json.
// Dat bestand klopt met de regels in Rust (`cijfers_json_klopt` in crates/halma-core/src/cijfers.rs) en, voor de borden, met het wasm hieronder.
const gegevens = cijfers as Record<string, number | string>;
const FEITEN = Object.keys(gegevens).filter((k) => !k.startsWith("_"));
/** De tekst van de pagina zonder tags, links, knoppen en de bronvermelding van Bell; wat overblijft mag geen getal bevatten. */
const zonderFeiten = (h: string) =>
  h
    .slice(h.indexOf("<h1>"), h.indexOf("<footer>"))
    .replace(/<div class="knoppen">[\s\S]*?<\/div>/, "")
    .replace(/<a [^>]*>[\s\S]*?<\/a>/g, " ")
    .replace(/<span data-feit="[^"]+">[^<]*<\/span>/g, " ")
    .replace("<em>Integers</em> 9, 2009", " ")
    .replace(/<[^>]*>/g, " ");

// Taak 321: de gids staat in elke taal. Dezelfde controle op elke taal: elk getal komt uit cijfers.json, er staat geen ander getal.
const cijferPagina = PAGINA_LIJST.find((p: { slug: string }) => p.slug === CIJFERS) as { paden: Record<string, string> };
const cijferBestanden = import.meta.glob("../public/**/*.html", { query: "?raw", import: "default", eager: true }) as Record<string, string>;
const cijferTalen = Object.entries(cijferPagina.paden).map(([code, pad]) => ({ code, html: cijferBestanden[`../public${pad}.html`] }));

test("de gids in cijfers staat in elke taal van de site", () => {
  expect(cijferTalen.length).toBeGreaterThanOrEqual(43);
  expect(cijferTalen.find((t) => t.code === "en")?.html).toBe(cijfersPagina);
  for (const { code, html } of cijferTalen) expect(html, code).toBeDefined();
});

test.each(cijferTalen)("de gids in cijfers ($code): elk getal op de pagina is dat uit cijfers.json, en er staat geen ander getal", ({ html }) => {
  const gemerkt = [...html.matchAll(/<span data-feit="([^"]+)">([^<]*)<\/span>/g)];
  expect(gemerkt.length).toBeGreaterThan(20);
  for (const [, sleutel, tekst] of gemerkt) {
    expect(FEITEN, sleutel).toContain(sleutel);
    expect(tekst, sleutel).toBe(String(gegevens[sleutel]));
  }
  // Elk feit staat op de pagina.
  expect([...new Set(gemerkt.map((m) => m[1]))].sort()).toEqual([...FEITEN].sort());
  // Geen getal in de gewone tekst, in een alt-tekst of in de titel en beschrijving dat er niet bij hoort.
  expect(zonderFeiten(html).match(/\d/g) ?? []).toEqual([]);
  // De alt-teksten van de plaatjes van het bord (de winkelknoppen hebben hun eigen tekst per taal).
  const alts = [...html.matchAll(/<img src="\/rules\/img\/[^"]+"[^>]* alt="([^"]*)"/g)].map((m) => m[1]).join(" ");
  expect(alts.length).toBeGreaterThan(20);
  expect(alts.match(/\d/g) ?? []).toEqual([]);
  const waarden = FEITEN.map((k) => String(gegevens[k]));
  for (const veld of [html.match(/<title>([^<]*)<\/title>/)?.[1], html.match(/<meta name="description" content="([^"]*)"/)?.[1], html.match(/<meta property="og:description" content="([^"]*)"/)?.[1]]) {
    for (const getal of veld!.match(/\d+(\.\d+)?/g) ?? []) expect(waarden, `${veld}: ${getal}`).toContain(getal);
  }
  // De getallen in de intro, de eerste zin die iemand leest, staan er ook.
  const intro = html.match(/<p class="intro">([\s\S]*?)<\/p>/)?.[1] ?? "";
  for (const sleutel of ["sterbord_vakken", "langste_sprongketen", "oversteek_zetten"]) expect(intro).toContain(`data-feit="${sleutel}"`);
});

test("de gids in cijfers: de borden in cijfers.json zijn die van de spelregels (het wasm van halma-core)", () => {
  for (const [vorm, aantal, vakken, stenen] of [["ster", 2, "sterbord_vakken", "sterbord_stenen_2_spelers"], ["ster", 3, "sterbord_vakken", "sterbord_stenen_3_spelers"], ["ster", 4, "sterbord_vakken", "sterbord_stenen_4_spelers"], ["ster", 6, "sterbord_vakken", "sterbord_stenen_6_spelers"], ["vierkant", 2, "vierkant_vakken", "vierkant_stenen_2_spelers"], ["vierkant", 4, "vierkant_vakken", "vierkant_stenen_4_spelers"]] as const) {
    const b = bordje(vorm, aantal);
    expect(b.gaten.length, `${vorm} ${aantal}`).toBe(gegevens[vakken]);
    expect(b.stenen.length, `${vorm} ${aantal}`).toBe(gegevens[stenen]);
  }
  expect(gegevens.sterbord_stenen_per_speler).toBe(gegevens.sterbord_stenen_2_spelers as number / 2);
  expect(gegevens.vierkant_stenen_per_speler_2_spelers).toBe(gegevens.vierkant_stenen_2_spelers as number / 2);
  expect(gegevens.vierkant_stenen_per_speler_4_spelers).toBe(gegevens.vierkant_stenen_4_spelers as number / 4);
  // De keten springt over 36 Stenen (één Steen springt zelf), en 27 is één Zet meer dan het bewijs voor 26.
  expect(gegevens.grootste_klasse_vakken).toBe((gegevens.langste_sprongketen as number) + 1);
  expect(gegevens.geen_oversteek_in_zetten).toBe((gegevens.oversteek_zetten as number) - 1);
  expect((gegevens.zoekdiepte_zetten as number) * 2).toBe(gegevens.geen_oversteek_in_zetten);
});

test("de gids in cijfers: de opzet staat erbij, het eerste plaatje laadt direct, in sitemap, llms.txt en de spelregels, geen FAQPage", () => {
  const adres = `https://playleapstone.com/guides/${CIJFERS}`;
  const tekst = zonderFeiten(cijfersPagina);
  expect(maakPagina((PAGINA_LIJST as { slug: string }[]).find((p) => p.slug === CIJFERS), "en")).toBe(cijfersPagina);
  expect(cijfersPagina).toContain(`<link rel="canonical" href="${adres}" />`);
  expect(cijfersPagina).not.toMatch(/"@type": "(FAQPage|HowTo)"/);
  expect(cijfersPagina).toContain('href="/play/">Play now</a>');
  expect(cijfersPagina).toContain("apps.apple.com");
  expect(cijfersPagina).toContain("play.google.com");
  // Het eerste plaatje bovenaan laadt direct, de andere lui.
  const plaatjes = [...cijfersPagina.matchAll(/<img src="\/rules\/img\/(?!.*badges)[^"]+"[^>]*>/g)].map((m) => m[0]);
  expect(plaatjes.length).toBeGreaterThanOrEqual(3);
  expect(plaatjes[0]).not.toContain('loading="lazy"');
  for (const rest of plaatjes.slice(1)) expect(rest).toContain('loading="lazy"');
  // De opzet van 36 en 27 en de beperking staan bij het getal (council 2026-11-18).
  expect(tekst).toContain("placed freely");
  expect(tekst).toContain("Not a real game");
  expect(tekst).toMatch(/alone on the star board, with no opponents/);
  expect(tekst).toContain("is not the least a real game can take");
  // In de sitemap en llms.txt, en gelinkt vanaf de spelregels en de strategiegids (de andere talen: regelstalen.test.ts).
  expect(sitemap).toContain(`<loc>${adres}</loc>`);
  expect(llms).toContain(adres);
  for (const h of [chinese, halma, strategie]) expect(h).toContain(`href="/guides/${CIJFERS}"`);
});
