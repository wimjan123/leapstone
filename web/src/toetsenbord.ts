// Na het toetsenbord van een iPhone (bug van 2026-11-19): de Spelersnaam stond er, Continue stond in beeld, maar een tik deed
// niets; alleen Enter maakte de Speler. iOS (bekend in iOS 26, ook in WKWebView) laat de pagina na het sluiten van het toetsenbord
// soms onzichtbaar verschoven staan: de knoppen staan op hun plek in beeld, maar een tik telt een stuk ernaast. De app schuift zelf
// nooit (app.css), dus zet de pagina terug naar boven zodra het toetsenbord dicht is.

/** Een veld waarvoor het toetsenbord opengaat (geen vinkje, keuzerondje of knop). */
const VELD = 'input:not([type]), input[type="text"], input[type="search"], input[type="email"], input[type="tel"], input[type="url"], input[type="password"], input[type="number"], textarea, [contenteditable]:not([contenteditable="false"])';
/** Wanneer na het verlaten van een veld (ms): meteen, en na het dichtgaan van het toetsenbord (ongeveer 250 ms). */
export const TERUG_NA_MS = [0, 300, 700];

const isVeld = (el: EventTarget | null) => el instanceof Element && el.matches(VELD);

/** Zoveel px mag het zichtbare deel lager zijn dan het venster terwijl het toetsenbord dicht is (de werkbalk van Safari). */
export const TOETSENBORD_PX = 120;

/** Zet de pagina terug als iOS hem na het toetsenbord verschoven laat staan (alleen op iOS aanzetten, zie main.ts). Geeft een functie terug die het weer uitzet. */
export function zetTerugNaToetsenbord(w: Window = window): () => void {
  let klokken: ReturnType<typeof setTimeout>[] = [];
  const zetTerug = () => {
    w.scrollTo(0, 0);
    w.document.documentElement.scrollTop = 0;
    w.document.body.scrollTop = 0;
  };
  const stop = () => {
    klokken.forEach(clearTimeout);
    klokken = [];
  };
  const plan = (stap: () => void) => {
    stop();
    klokken = TERUG_NA_MS.map((ms) => setTimeout(stap, ms));
  };
  // Een veld verlaten: terug, behalve als de focus naar een ander veld ging (dan blijft het toetsenbord open).
  const verlaten = (e: FocusEvent) => {
    if (isVeld(e.target)) plan(() => isVeld(w.document.activeElement) || zetTerug());
  };
  // Het toetsenbord sluit terwijl het veld de focus houdt (iPad: de knop om het toetsenbord weg te halen). Dan verandert het
  // zichtbare deel van grootte. Kijk niet naar die sprong maar naar de stand, nu en bij elke latere poging: iPadOS meldt soms
  // eerst nog de oude hoogte. Dicht is: op gewone schaal (niet ingezoomd) bijna zo hoog als het venster. Een groter venster
  // met het toetsenbord open telt dus niet, en een poging na het weer openen van het toetsenbord ook niet.
  const vv = w.visualViewport;
  const gewoneSchaal = () => !!vv && Math.abs(vv.scale - 1) < 0.01;
  const dicht = () => !!vv && gewoneSchaal() && w.innerHeight - vv.height < TOETSENBORD_PX;
  const anders = () => {
    if (gewoneSchaal() && isVeld(w.document.activeElement)) plan(() => dicht() && zetTerug());
  };
  // Een veld krijgt de focus: het toetsenbord gaat open, dus wat nog gepland stond, gaat niet door.
  const naarVeld = (e: FocusEvent) => {
    if (isVeld(e.target)) stop();
  };
  w.addEventListener("focusout", verlaten);
  w.addEventListener("focusin", naarVeld);
  vv?.addEventListener("resize", anders);
  return () => {
    stop();
    w.removeEventListener("focusout", verlaten);
    w.removeEventListener("focusin", naarVeld);
    vv?.removeEventListener("resize", anders);
  };
}

// Het toetsenbord van een iPhone schuift over de pagina zonder dat die kleiner wordt (bug van 2026-11-20: het veld voor de
// Spelersnaam lag eronder). De app schuift zelf nooit, dus iOS kan het veld niet in beeld schuiven. Daarom schuift de app de hele
// tafel (de HTML in #app en de laag met het 3D-bord samen) zacht omhoog tot het formulier boven het toetsenbord staat, en weer
// terug als het toetsenbord dichtgaat (`--toetsenbord-schuif` in app.css).

/** Zoveel ruimte (px) blijft er tussen het formulier en het toetsenbord, en tussen het veld en de bovenkant. */
export const SCHUIF_MARGE = 12;

/** Wat er in beeld is (layout-px, zoals `getBoundingClientRect`): van `boven` tot `onder`, op schaal `schaal`, in een venster van `venster` hoog. */
export type Zicht = {
  boven: number;
  onder: number;
  schaal: number;
  venster: number;
  /** Meldt de Android-app zelf of het toetsenbord open is, dan telt dat (en niet de drempel die voor Safari nodig is). */
  open?: boolean;
};

/** Staat het toetsenbord open? Wat in beeld is, beslaat op het scherm een toetsenbord minder dan het venster. */
const toetsenbordOpen = (zicht: Zicht) => zicht.open ?? zicht.venster - (zicht.onder - zicht.boven) * zicht.schaal >= TOETSENBORD_PX;

/**
 * Hoeveel px de app omhoog moet zodat het formulier (tot `doelOnder`) boven het toetsenbord staat, zonder dat het veld (`veld`)
 * boven uit beeld gaat. Alles gemeten zonder schuif. Zonder toetsenbord niet schuiven, ook niet voor de marge onder een formulier
 * op de schermrand. Wat voorgaat, in deze volgorde:
 * 1. het hele formulier met `marge` ruimte boven en onder;
 * 2. het hele formulier, precies;
 * 3. het hele veld, zo hoog als het kan (dus zo veel mogelijk van het formulier), liefst met marge boven;
 * 4. is zelfs het veld hoger dan wat in beeld is: de bovenkant van het veld boven in beeld.
 * Valt de bovenkant van het veld boven wat in beeld is (iOS schoof dat omlaag), dan omlaag tot hij er precies in staat (negatief).
 */
export function schuifVoor(veld: { boven: number; onder: number }, doelOnder: number, zicht: Zicht, marge = SCHUIF_MARGE): number {
  if (!toetsenbordOpen(zicht)) return 0;
  // iOS heeft wat in beeld is omlaag geschoven, en de bovenkant van het veld valt erboven: schuif de app zo ver omlaag.
  if (veld.boven < zicht.boven) return Math.round(veld.boven - zicht.boven);
  // `nodig`: zo ver tot het formulier precies boven het toetsenbord staat; `ruimte`: zo ver tot het veld precies boven in beeld staat.
  const nodig = doelOnder - zicht.onder;
  const ruimte = veld.boven - zicht.boven;
  const metMarges = Math.min(nodig + marge, ruimte - marge);
  let px: number;
  if (metMarges >= nodig) px = metMarges;
  else if (nodig <= ruimte) px = nodig;
  else {
    const veldNodig = veld.onder - zicht.onder;
    px = veldNodig > ruimte ? ruimte : Math.min(Math.max(ruimte - marge, veldNodig), ruimte);
  }
  return Math.max(0, Math.round(px));
}

/** De dichtstbijzijnde ouder die zelf schuift (een lijst met `overflow-y: auto` of `scroll`), of null. */
function schuifOuder(el: Element, w: Window): Element | null {
  for (let o = el.parentElement; o && o !== w.document.body; o = o.parentElement) {
    const y = w.getComputedStyle(o).overflowY;
    if (y === "auto" || y === "scroll") return o;
  }
  return null;
}

let schuif = 0;
/** Hoe ver de app omhoog staat of gaat (px): de waarde in de CSS, ook als de overgang ernaartoe nog loopt. */
export const toetsenbordSchuif = () => schuif;

// Zolang een vinger op het 3D-bord staat, staat de tafel stil (`houdTafelStil`): anders schuift het bord onder een tik of een
// gesleepte Steen weg, en klopt de plek van de vinger niet meer met wat de Speler ziet. Wat de app intussen wil, volgt na het
// loslaten.
let stil = 0;
let bevries: (() => void) | null = null;
let laatGaan: (() => void) | null = null;
/** Staat de tafel nu stil voor een vinger op het bord? */
export const tafelStil = () => stil > 0;
/** Houd de tafel stil tot de teruggegeven functie loopt (een vinger op het bord: neer tot los). */
export function houdTafelStil(): () => void {
  if (++stil === 1) bevries?.();
  let los = false;
  return () => {
    if (los) return;
    los = true;
    if (--stil === 0) laatGaan?.();
  };
}

/**
 * Een bovenkant zoals hij zonder schuif zou zijn. Gemeten tegen `#app` (die vult het scherm), dus ook goed midden in de overgang:
 * dan staat de app nog niet op het doel. Wie het 3D-vlak meet, gebruikt dit: het bord schuift zelf mee.
 */
export function zonderSchuif(top: number, d: Document = document): number {
  return top - (d.getElementById("app")?.getBoundingClientRect().top ?? 0);
}

/**
 * De Android-app meldt met dit event hoe hoog het schermtoetsenbord en het venster zijn (CSS-px, `{ hoogte, venster }`,
 * MainActivity.kt). Met edge-to-edge valt het toetsenbord daar over de pagina zonder dat het venster of het zichtbare deel kleiner
 * wordt; de app schuift dan net als op iOS. Een zwevend toetsenbord meldt Android bewust niet (hoogte 0, net als het zwevende
 * iPad-toetsenbord): dan schuift de app niet, want waar het ligt is niet te weten.
 */
export const ANDROID_TOETSENBORD = "leapstone-toetsenbord";

/** Schuif de app boven het toetsenbord zolang een veld de focus heeft (op iOS en in de Android-app, zie main.ts). Geeft een functie terug die het weer uitzet. */
export function schuifBovenToetsenbord(w: Window = window): () => void {
  const vv = w.visualViewport;
  /** Waar het toetsenbord volgens Android begint, van de bovenkant van het venster (CSS-px van het scherm); null op iOS, in de browser en als het dicht is. */
  let androidBoven: number | null = null;
  w.document.documentElement.classList.add("boven-toetsenbord");
  let doel = 0;
  const pasToe = (px: number) => {
    if (px === schuif) return;
    schuif = px;
    w.document.documentElement.style.setProperty("--toetsenbord-schuif", `${px}px`);
  };
  const zet = (px: number) => {
    doel = px;
    if (stil === 0) pasToe(px);
  };
  // Stil: zet de schuif op waar de tafel nu echt staat (midden in een overgang staat hij nog niet op het doel), dan stopt hij daar.
  bevries = () => pasToe(Math.round(zonderSchuif(0, w.document)));
  laatGaan = () => pasToe(doel);
  // Hoe hoog wat in beeld is, zolang het toetsenbord open staat (`--toetsenbord-zicht`): een blad dat van onderen komt (de Chat)
  // past zich daaraan aan, zodat zijn bovenkant met de sluitknop in beeld blijft als de app omhoog schuift.
  const zetZicht = (px: number | null) => {
    const html = w.document.documentElement;
    html.classList.toggle("toetsenbord-open", px !== null);
    if (px === null) html.style.removeProperty("--toetsenbord-zicht");
    else html.style.setProperty("--toetsenbord-zicht", `${Math.round(px)}px`);
  };
  const meet = () => {
    const el = w.document.activeElement;
    if (!vv || !isVeld(el)) {
      zetZicht(null);
      return zet(0);
    }
    // Alleen het deel van het Android-toetsenbord dat over het zichtbare deel ligt (dat begint boven in het venster en is
    // vv.height × vv.scale hoog op het scherm). Maakt de WebView het zichtbare deel zelf al kleiner, dan blijft er niets over.
    const over = androidBoven === null ? 0 : Math.max(0, vv.height * vv.scale - androidBoven);
    const hoog = Math.max(0, vv.height - over / vv.scale);
    const zicht: Zicht = { boven: vv.offsetTop, onder: vv.offsetTop + hoog, schaal: vv.scale, venster: w.innerHeight };
    if (androidBoven !== null) zicht.open = true;
    const open = toetsenbordOpen(zicht);
    zetZicht(open ? hoog : null);
    // Toetsenbord dicht: altijd terug, wat er verder ook met het veld is.
    if (!open) return zet(0);
    const veld = el!.getBoundingClientRect();
    let boven = veld.top;
    let onder = veld.bottom;
    let doelOnder = (el!.closest("form") ?? el!).getBoundingClientRect().bottom;
    // In een lijst die zelf schuift (de Vriendenlijst) telt alleen wat in die lijst te zien is. Schoof de Speler het veld er zelf
    // uit, dan blijft de tafel staan: de app jaagt het veld niet na en schuift de lijst niet mee weg.
    const lijst = schuifOuder(el!, w);
    if (lijst) {
      const r = lijst.getBoundingClientRect();
      boven = Math.max(boven, r.top);
      onder = Math.min(onder, r.bottom);
      doelOnder = Math.min(doelOnder, r.bottom);
      if (onder <= boven) return;
    }
    const d = w.document;
    zet(schuifVoor({ boven: zonderSchuif(boven, d), onder: zonderSchuif(onder, d) }, zonderSchuif(doelOnder, d), zicht));
  };
  // iOS meldt de hoogte van het toetsenbord soms laat (ook met de oude hoogte in de melding): meet bij een focuswissel en bij elke
  // melding van het zichtbare deel ook straks nog eens. Groeit het formulier terwijl het veld de focus heeft (een gevonden Vriend
  // met de knop Add eronder), dan ook.
  let klokken: ReturnType<typeof setTimeout>[] = [];
  const straks = () => {
    klokken.forEach(clearTimeout);
    klokken = TERUG_NA_MS.map((ms) => setTimeout(meet, ms));
  };
  const zichtAnders = () => {
    meet();
    straks();
  };
  const groei = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(() => meet());
  const focus = () => {
    straks();
    groei?.disconnect();
    const el = w.document.activeElement;
    if (isVeld(el)) groei?.observe(el!.closest("form") ?? el!);
  };
  const opAndroid = (e: Event) => {
    const { hoogte, venster } = ((e as CustomEvent).detail ?? {}) as { hoogte?: number; venster?: number };
    androidBoven = hoogte && hoogte > 0 && venster && venster > 0 ? venster - hoogte : null;
    meet();
  };
  w.addEventListener(ANDROID_TOETSENBORD, opAndroid);
  vv?.addEventListener("resize", zichtAnders);
  vv?.addEventListener("scroll", meet);
  // Een lijst die zelf schuift (de Vriendenlijst) neemt het formulier mee: scrollen bubbelt niet, dus vang het onderweg.
  w.document.addEventListener("scroll", meet, true);
  w.addEventListener("resize", meet);
  w.addEventListener("focusin", focus);
  w.addEventListener("focusout", focus);
  return () => {
    klokken.forEach(clearTimeout);
    groei?.disconnect();
    vv?.removeEventListener("resize", zichtAnders);
    vv?.removeEventListener("scroll", meet);
    w.document.removeEventListener("scroll", meet, true);
    w.removeEventListener("resize", meet);
    w.removeEventListener("focusin", focus);
    w.removeEventListener("focusout", focus);
    w.removeEventListener(ANDROID_TOETSENBORD, opAndroid);
    bevries = laatGaan = null;
    pasToe(0);
    zetZicht(null);
    w.document.documentElement.classList.remove("boven-toetsenbord");
  };
}
