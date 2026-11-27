// Taak 121: het Smart App Banner van Apple. (De Nederlandse en Duitse pagina's zelf, hreflang en sitemap: regelstalen.test.ts, taak 133.)
import { expect, test } from "vitest";
import landingEn from "../landing/index.html?raw";
import landingNl from "../landing/nl/index.html?raw";
import landingDe from "../landing/de/index.html?raw";
import chineseEn from "../public/rules/chinese-checkers.html?raw";
import halma from "../public/rules/halma.html?raw";
import sternhalma from "../public/rules/sternhalma.html?raw";
import chineesNl from "../public/nl/chinees-dammen.html?raw";
import sternhalmaDe from "../public/de/regeln/sternhalma.html?raw";
import play from "../play/index.html?raw";
import { uitnodigingHtml, SMART_APP_BANNER } from "../uitnodigingskaart";

const BANNER = '<meta name="apple-itunes-app" content="app-id=6831230722" />';

test("de Smart App Banner van Apple staat op de Landingspagina's, de spelregelpagina's en /play/", () => {
  for (const html of [landingEn, landingNl, landingDe, chineseEn, halma, sternhalma, chineesNl, sternhalmaDe]) expect(html).toContain(BANNER);
  expect(play).toMatch(/<meta name="apple-itunes-app" content="app-id=6831230722" \/>/);
  // Precies één keer per pagina.
  for (const html of [landingEn, landingNl, landingDe, chineseEn, halma, sternhalma, chineesNl, sternhalmaDe, play]) expect(html.match(/apple-itunes-app/g)).toHaveLength(1);
});

test("de Smart App Banner staat niet op de Uitnodigingskaart (/uitnodiging/<code>)", () => {
  expect(play).toMatch(SMART_APP_BANNER);
  const kaart = uitnodigingHtml(play);
  expect(kaart).not.toContain("apple-itunes-app");
  expect(kaart).not.toContain("Smart App Banner");
  expect(kaart).toContain('content="noindex"');
});
