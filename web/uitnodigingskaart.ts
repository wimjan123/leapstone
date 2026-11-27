/**
 * De voorbeeldkaart van een Uitnodiging (WhatsApp e.d., taak 106 en 115): vaste tekst, nooit Spelersgegevens.
 * /play/ heeft zijn eigen titel voor Google; de Worker geeft op /uitnodiging/<code> een kopie van die pagina
 * die bij het bouwen deze tags krijgt (zie vite.config.ts).
 */
export const UITNODIGING_TITEL = "Join my game of Chinese checkers";
export const UITNODIGING_TEKST = "Play Leapstone with me, in the app or in your browser.";

/** Waar de kopie in de build staat. De Worker haalt hem daar op voor /uitnodiging/<code>. */
export const UITNODIGING_PAGINA = "uitnodiging-kaart/index.html";

/**
 * Het Smart App Banner van Apple (taak 121) staat op /play/, maar niet op de Uitnodigingskaart. Op een Uitnodiging
 * staat geen vaste app-argument: tikt iemand in Safari op "Open", dan opent de app zonder de Uitnodigingscode en
 * is de Uitnodiging kwijt. Wie de app al heeft, opent de link via Universal Links toch al in de app.
 */
export const SMART_APP_BANNER = /(?:<!--[^>]*Smart App Banner[^>]*-->\s*)?<meta name="apple-itunes-app"[^>]*>\s*/;

function zet(html: string, naam: string, waarde: string): string {
  const tag = new RegExp(`(<meta (?:property|name)="${naam}" content=")[^"]*(")`);
  if (!tag.test(html)) throw new Error(`tag ${naam} ontbreekt in de pagina van het spel`);
  return html.replace(tag, `$1${waarde}$2`);
}

/** Maakt van de pagina van het spel de pagina van een Uitnodiging: andere kaart, nooit in Google. */
export function uitnodigingHtml(spel: string): string {
  let html = spel;
  html = zet(html, "description", UITNODIGING_TEKST);
  for (const voor of ["og", "twitter"]) {
    html = zet(html, `${voor}:title`, UITNODIGING_TITEL);
    html = zet(html, `${voor}:description`, UITNODIGING_TEKST);
  }
  return html
    .replace(/<title>[^<]*<\/title>/, `<title>${UITNODIGING_TITEL}</title>`)
    .replace(/<meta property="og:url"[^>]*>\s*/, "")
    .replace(SMART_APP_BANNER, "")
    .replace("</head>", '  <meta name="robots" content="noindex" />\n  </head>');
}
