// De app met een nep-server en VOORBEELDGEGEVENS (verzonnen namen, geen echte Spelers). Wordt geserveerd op /nep door web/scripts/bord-hulp.mjs.
// Query: meldingen=1 (de server kan Meldingen sturen), taal=<code>, potje=1..7, extra=1 (ook een Potje met 3 en met 6 Spelers midden in het spel, potje 8 en 9, en een met zes lange namen, potje 10).
// data=worst|duizend|een|leeg: worst-case voorbeeldgegevens in plaats van de demo (break-ui, zie scripts/nep/worst.js).
// Voor de fototool (taak 239): `window.__leapstone` begint de app opnieuw in deze pagina, met verse voorbeeldgegevens, zonder het
// 3D-bord opnieuw te laden (zie `toon` hieronder). Deze pagina bestaat alleen in de dev-server, nooit in de build voor Spelers.
import init, { Potje } from "/src/wasm/halma_core.js";
import { NepServer } from "/src/nep-server.ts";
import { wisPrestatiebalk } from "/src/prestaties.ts";
import { NAMEN, WORST_BERICHTEN, poolNaam, prestatiesAlle, ranglijst, statistiekenEen, statistiekenWorst } from "./worst.js";
const q = new URLSearchParams(location.search);
const ADRES = location.pathname + location.search;
// Vaste toevalsgetallen (mulberry32): de Computerspeler kiest zijn startgetal met Math.random, en zo staan de Stenen bij elke
// run op dezelfde plek. Dan zijn twee schermafdrukken (voor en na een wijziging) te vergelijken.
let zaad = 0x1eab5;
Math.random = () => { zaad = (zaad + 0x6d2b79f5) | 0; let t = Math.imul(zaad ^ (zaad >>> 15), 1 | zaad); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
await init();

const OPGENOMEN = new Map();
/**
 * Een nep-server met de voorbeeldgegevens. `extra`: "1" of "2", zoals `extra=` in het adres. `data`: de demo (leeg) of een
 * worst case (`data=` in het adres, zie worst.js). Zet ook de opslag van de Speler.
 */
function maakServer({ taal = "", extra = "", potje = "", data = "" } = {}) {
  zaad = 0x1eab5;
  const s = new NepServer();
  window.__nep = s;
  const worst = data === "worst" || data === "duizend";
  const N = NAMEN[worst ? "worst" : "demo"];
  window.__namen = N;
  if (data === "leeg" || data === "een") return kleineServer(s, data, N, taal);
  // VOORBEELDGEGEVENS: verzonnen namen, geen echte Spelers.
  const mila = s.voegSpelerToe(N.mila);
  const namen = ["sam", "noor", "finn", "lena", "jules", "emre"].map((r) => s.voegSpelerToe(N[r]));
  const [sam, noor, finn, lena, jules, emre] = namen;
  // Worst case: de Wachtkamer heeft zes plekken, met vier namen die anders pas bij extra=1 komen.
  const vroeg = worst ? Object.fromEntries(["dex", "eli", "fay"].map((r) => [r, s.voegSpelerToe(N[r])])) : {};
  // De Zetten van de Computerspeler één keer uitrekenen en daarna afspelen (de fototool maakt de gegevens per scherm opnieuw). Met
  // dezelfde toevalsgetallen erna, zodat alles daarna gelijk loopt.
  function speel(p, n, niveau = 2) {
    const sleutel = `${extra}/${p.potje_id}`, eerder = OPGENOMEN.get(sleutel);
    if (eerder) {
      for (const [van, naar] of eerder.zetten) p.game.zet(van, naar);
      zaad = eerder.zaad;
    } else {
      const zetten = [];
      for (let i = 0; i < n && !p.game.is_afgelopen(); i++) { const pad = p.game.computer_zet(niveau); p.game.zet(pad[0], pad[pad.length - 1]); zetten.push([pad[0], pad[pad.length - 1]]); }
      OPGENOMEN.set(sleutel, { zetten, zaad });
    }
    p.versie = n;
  }
  function eindig(p, ...weg) { speel(p, 40, 1); for (const w of weg) { p.game.geef_op(w); p.opgegeven.add(w + 1); } p.versie += 1; }
  // Midden in het spel, Mila aan de beurt (even aantal Zetten).
  const p1 = s.maakPotje([mila.speler_id, sam.speler_id], 2, "ster"); speel(p1, 16);
  const p2 = s.maakPotje([mila.speler_id, noor.speler_id], 2, "vierkant"); speel(p2, 14);
  // Afgelopen Potjes voor Ranglijst, Statistieken en het winstscherm.
  const p3 = s.maakPotje([mila.speler_id, finn.speler_id], 2, "ster"); eindig(p3, 1);
  const p4 = s.maakPotje([lena.speler_id, mila.speler_id], 2, "ster"); eindig(p4, 1);
  const p5 = s.maakPotje([mila.speler_id, emre.speler_id, jules.speler_id], 3, "ster"); eindig(p5, 1, 2);
  // Wachtkamer: 3 Spelers, een plek open.
  const p6 = worst
    ? s.maakPotje([mila.speler_id, jules.speler_id, vroeg.dex.speler_id, vroeg.eli.speler_id, vroeg.fay.speler_id], 6, "ster", 60)
    : s.maakPotje([mila.speler_id, jules.speler_id], 3, "ster", 60);
  // Een code zoals de server hem maakt (twee groepen van vier tekens uit het alfabet van `halma-opslag`), niet de teller van de nep-server (taak 198).
  p6.uitnodiging = "K7QM-X4PW";
  // Taak 182: een Potje met 6 Spelers (Sterbord), midden in het spel.
  const p7 = s.maakPotje([mila.speler_id, jules.speler_id, sam.speler_id, noor.speler_id, finn.speler_id, lena.speler_id], 6, "ster"); speel(p7, 24);
  s.ratings.set(mila.speler_id, 1042); s.ratings.set(sam.speler_id, 1110); s.ratings.set(noor.speler_id, 987); s.ratings.set(finn.speler_id, 1065); s.ratings.set(lena.speler_id, 930); s.ratings.set(emre.speler_id, 1020); s.ratings.set(jules.speler_id, 1004);
  for (const v of [sam, noor, finn]) s.maakVrienden(mila.speler_id, v.speler_id);
  s.vriendverzoeken.push({ van: lena.speler_id, naar: mila.speler_id, geweigerd: false });
  window.__ids = { p1: p1.potje_id, p2: p2.potje_id, p3: p3.potje_id, p4: p4.potje_id, p5: p5.potje_id, p6: p6.potje_id, p7: p7.potje_id };
  if (extra === "2") {
    // Taak 199: een volle Ranglijst (zeven Spelers in plaats van vijf) voor het winkelbeeld: Sam en Noor hebben ook tegen Mila gespeeld.
    const p8 = s.maakPotje([mila.speler_id, sam.speler_id], 2, "ster"); eindig(p8, 0);
    const p9 = s.maakPotje([noor.speler_id, mila.speler_id], 2, "ster"); eindig(p9, 0);
  }
  if (extra === "1") {
    // Midden in het spel met 3 en met 6 Spelers, Mila aan de beurt (taak 177). Alleen op verzoek: de lijst van My games blijft anders gelijk.
    const [ada, bo, cas, dex, eli, fay, gus] = ["ada", "bo", "cas", "dex", "eli", "fay", "gus"].map((r) => vroeg[r] ?? s.voegSpelerToe(N[r]));
    const p8 = s.maakPotje([mila.speler_id, ada.speler_id, bo.speler_id], 3, "ster"); speel(p8, 18);
    const p9 = s.maakPotje([mila.speler_id, cas.speler_id, dex.speler_id, eli.speler_id, fay.speler_id, gus.speler_id], 6, "ster"); speel(p9, 24);
    // Taak 193: zes Spelers met de langste toegestane Spelersnaam (30 tekens), een naam zonder spaties, Japans, Arabisch en een korte naam.
    const lang = ["Bartholomew Featherstonehaugh", "高橋美智子おばあちゃん", "عبد الرحمن بن محمد الحسيني", "W".repeat(30), "Jo"].map((n) => s.voegSpelerToe(n));
    const p10 = s.maakPotje([mila.speler_id, ...lang.map((x) => x.speler_id)], 6, "ster"); speel(p10, 24);
    Object.assign(window.__ids, { p8: p8.potje_id, p9: p9.potje_id, p10: p10.potje_id });
    if (worst) for (const [plek, tekst] of WORST_BERICHTEN) s.berichtVan(p8, plek, tekst);
  }
  if (worst) vulWorst(s, data, { mila, sam, noor, finn, lena, jules, emre, p1 });
  return bewaarSpeler(s, mila, taal, potje);
}

/** Zet de Speler, de taal en het open Potje in de opslag van de browser. */
function bewaarSpeler(s, mila, taal, potje) {
  localStorage.setItem("halma.speler", JSON.stringify({ speler_id: mila.speler_id, spelersnaam: mila.spelersnaam, sleutel: mila.sleutel }));
  localStorage.setItem("leapstone.leren.gevraagd", "1");
  // Zonder ?taal= Engels: anders houdt een volgend scherm de taal van het vorige (de browser deelt localStorage tussen schermen).
  if (taal) localStorage.setItem("leapstone.taal", taal);
  else localStorage.removeItem("leapstone.taal");
  if (potje && window.__ids["p" + potje]) localStorage.setItem("halma.potje", String(window.__ids["p" + potje]));
  else localStorage.removeItem("halma.potje");
  return s;
}

/**
 * Worst case bovenop de Potjes van de demo (dezelfde Potjes op dezelfde plek, zodat de stappen van `schermen` blijven werken):
 * Ratings van vier cijfers, honderden Potjes, volle lijsten, Uitdagingen en blokkades. `duizend`: nog veel langere lijsten.
 */
function vulWorst(s, data, { mila, sam, noor, finn, lena, jules, emre, p1 }) {
  const ik = mila.speler_id;
  const groot = data === "duizend";
  const rol = (r) => s.spelers.find((x) => x.spelersnaam === NAMEN.worst[r]) ?? s.voegSpelerToe(NAMEN.worst[r]);
  const rollen = Object.fromEntries(Object.keys(NAMEN.worst).map((r) => [r, rol(r)]));
  let volgende = 0;
  const nieuw = () => s.voegSpelerToe(poolNaam(volgende++));
  // Het Potje met twee Spelers is een Snel potje: dan staat de Rating (vier cijfers) op de naamplaat.
  p1.snel = true;
  for (const [sp, r] of [[mila, 1874], [sam, 2417], [noor, 2003], [finn, 1999], [lena, 1777], [jules, 1874], [emre, 1650]]) s.ratings.set(sp.speler_id, r);
  // Vrienden: 3 uit de demo plus 40 (duizend: 300), elk met een Rating.
  for (let i = 0; i < (groot ? 300 : 40); i++) {
    const v = nieuw();
    s.maakVrienden(ik, v.speler_id);
    s.ratings.set(v.speler_id, 900 + ((i * 271) % 1500));
  }
  // Vier Vriendverzoeken (Lena uit de demo plus drie), twee Uitdagingen (zes Spelers met de langste Denktijd, en het Vierkant bord).
  for (const v of [nieuw(), nieuw(), nieuw()]) s.vriendverzoeken.push({ van: v.speler_id, naar: ik, geweigerd: false });
  const nu = s.nu();
  s.uitdagingen.push({ id: 1, van: sam.speler_id, naar: ik, bord: "ster", denktijd_s: 120, tijd: nu, status: "open", groep: 1, aantal: 6 });
  s.uitdagingen.push({ id: 2, van: noor.speler_id, naar: ik, bord: "vierkant", denktijd_s: null, tijd: nu, status: "open", groep: 2, aantal: 4 });
  // Veertien geblokkeerde Spelers.
  s.blokkades.set(ik, new Set(Array.from({ length: 14 }, () => nieuw().speler_id)));
  // Mijn potjes: 20 (duizend: 1.000) afgelopen Snel potjes en twee Wachtkamers met veel open plekken.
  for (let i = 0; i < (groot ? 1000 : 20); i++) {
    const p = s.maakPotje([ik, nieuw().speler_id], 2, "ster");
    p.snel = true;
    const weg = i % 3 === 0 ? 0 : 1;
    p.game.geef_op(weg); p.opgegeven.add(weg + 1); p.versie = 1;
  }
  s.maakPotje([ik], 6, "ster", 120);
  s.maakPotje([ik, rollen.gus.speler_id], 4, "vierkant", 15);
  // Statistieken en Prestaties van een Speler met 2.093 Potjes; de Ranglijst met 60 (duizend: 1.000) rijen.
  s.statistieken = () => statistiekenWorst(rollen);
  s.prestaties = () => prestatiesAlle();
  const echt = s.fetch;
  s.fetch = async (u, i) => (u === "/api/ranglijst" ? Response.json(ranglijst(mila, rollen, groot ? 1000 : 60)) : echt(u, i));
}

/** `leeg`: alleen jij. `een`: van alles precies één (meervoud). */
function kleineServer(s, data, N, taal) {
  const mila = s.voegSpelerToe(N.mila);
  window.__ids = {};
  if (data === "een") {
    const [sam, noor, finn] = ["sam", "noor", "finn"].map((r) => s.voegSpelerToe(N[r]));
    // Eén Potje, gewonnen (Sam gaf op): één vriend, en Sam en jij in de Ranglijst met 1 van 1.
    const p = s.maakPotje([mila.speler_id, sam.speler_id], 2, "ster");
    p.game.geef_op(1); p.opgegeven.add(2); p.versie = 1;
    // Eén Wachtkamer met één plek open.
    const w = s.maakPotje([mila.speler_id], 2, "ster", 60);
    w.uitnodiging = "K7QM-X4PW";
    s.vriendverzoeken.push({ van: noor.speler_id, naar: mila.speler_id, geweigerd: false });
    s.uitdagingen.push({ id: 1, van: sam.speler_id, naar: mila.speler_id, bord: "ster", denktijd_s: 15, tijd: s.nu(), status: "open", groep: 1, aantal: 2 });
    s.blokkades.set(mila.speler_id, new Set([finn.speler_id]));
    s.statistieken = () => statistiekenEen({ sam });
    window.__ids = { p1: p.potje_id, p6: w.potje_id };
  }
  return bewaarSpeler(s, mila, taal, "");
}

// Verzoeken die nog onderweg zijn (de fototool wacht tot ze binnen zijn).
let onderweg = 0;
const telMee = (p) => { onderweg++; return p.finally(() => onderweg--); };
const echteFetch = window.fetch.bind(window);
// Query meldingen=1: de server kan Meldingen sturen (zoals de echte), dus de knop "Turn on notifications" staat er en niet "not available yet" (taak 198).
const nepFetch = (u, i) => (q.get("meldingen") === "1" && u === "/api/push/sleutel" ? Promise.resolve(Response.json({ sleutel: "BVoorbeeldSleutelVoorbeeldSleutelVoorbeeldSleutel" })) : typeof u === "string" && u.startsWith("/api") ? telMee(window.__nep.fetch(u, i)) : echteFetch(u, i));
function zetServer(instellingen) {
  const s = maakServer(instellingen);
  window.fetch = nepFetch;
  window.WebSocket = s.WebSocket;
}
// Alle voorbeeldgegevens één keer maken bij het laden, zodat de Zetten van de Computerspeler daarna klaar liggen (zie `speel`).
for (const extra of ["1", "2"]) maakServer({ extra });
zetServer({ taal: q.get("taal") ?? "", extra: q.get("extra") ?? "", potje: q.get("potje") ?? "", data: q.get("data") ?? "" });

// ---- De hook voor de fototool (web/scripts/schermen.mjs). ----

const volgendBeeld = () => new Promise((r) => requestAnimationFrame(() => r()));
let wijzigingen = 0;
new MutationObserver(() => wijzigingen++).observe(document, { subtree: true, childList: true, attributes: true, characterData: true });
// Plaatjes van voorwerpen die nog gebakken worden (`stuurPlaten`): pas daarna staat het voorwerp met zijn plaatje in beeld.
let platenOnderweg = 0;
let bordGezien = null;
function volgBord() {
  const b = globalThis.__halmaBord3d;
  if (!b || bordGezien === b) return b;
  bordGezien = b;
  const stuur = b.stuurPlaten;
  b.stuurPlaten = (...a) => { platenOnderweg++; return stuur(...a).finally(() => platenOnderweg--); };
  return b;
}

/** Wat nu nog beweegt of laadt (leeg: niets). */
function bezig() {
  const b = volgBord();
  const uit = [];
  if (onderweg) uit.push("verzoek");
  if (platenOnderweg) uit.push("platen");
  if (document.fonts.status !== "loaded") uit.push("letters");
  if (document.querySelector(".tafel-knoppen.wacht")) uit.push("tafel");
  if ([...document.images].some((i) => !i.complete)) uit.push("beeld");
  // Een animatie die nooit eindigt (een laadteken) telt niet: daar wordt het scherm nooit stil.
  if (document.getAnimations().some((a) => a.playState === "running" && a.effect?.getComputedTiming().iterations !== Infinity)) uit.push("animatie");
  if (b && document.getElementById("bord3d")?.offsetParent) {
    try { if (!b.klaar()) uit.push("bord"); } catch { /* het bord is gestopt */ }
  }
  return uit;
}

/**
 * Wacht tot het scherm klaar en stil is: `beelden` beelden van de browser achter elkaar waarin niets laadt, de pagina niet
 * verandert en het 3D-bord (als het in beeld is) klaar is en geen nieuw beeld tekent. Geeft wat er na `maxMs` nog bezig was.
 */
async function stil({ beelden = 3, maxMs = 8000 } = {}) {
  const begin = performance.now();
  let rustig = 0, vorig = null;
  while (performance.now() - begin < maxMs) {
    const w = wijzigingen;
    await volgendBeeld();
    let n = -1;
    try { n = globalThis.__halmaBord3d?.beelden() ?? -1; } catch { /* gestopt */ }
    const b = bezig();
    rustig = !b.length && w === wijzigingen && n === vorig ? rustig + 1 : 0;
    vorig = n;
    if (rustig >= beelden) return [];
  }
  return bezig().length ? bezig() : ["onrustig"];
}

/** Wacht tot er geen verzoek, plaatje of nieuwe tafel meer onderweg is (tussen twee stappen; de laatste wacht op `stil`). */
async function kort(maxMs = 8000) {
  const begin = performance.now();
  do { await volgendBeeld(); volgBord(); }
  while ((onderweg || platenOnderweg || document.querySelector(".tafel-knoppen.wacht")) && performance.now() - begin < maxMs);
}

/**
 * Wacht tot er een element is dat past, en geef het. `kiezer`: een CSS-kiezer, of een lijst kiezers en `{ kiezer, tekst }` (dan het
 * eerste in de pagina, zoals een Playwright-locator met komma's). `tekst`: een reguliere expressie op de naam (aria-label) of de tekst;
 * `vlag: "i"` zonder hoofdletters; `niet`: teksten die er niet in mogen staan. `nr`: het zoveelste element dat past, ook als het
 * (nog) niet zichtbaar is; anders het eerste zichtbare.
 */
/** "@jules": de naam van die rol in de gegevens van nu (demo of worst case), als reguliere expressie. */
const rolNaam = (t) => (t.startsWith("@") ? window.__namen[t.slice(1)].replace(/[.*+?^${}()|[\]\\]/g, "\\$&") : t);

async function zoek(kiezer, { tekst, vlag = "", niet = [], nr, maxMs = 8000 } = {}) {
  const delen = (Array.isArray(kiezer) ? kiezer : [{ kiezer, tekst }]).map((d) => (typeof d === "string" ? { kiezer: d } : d));
  const past = (e, t) => {
    if (!t) return true;
    const re = new RegExp(rolNaam(t), vlag);
    return re.test((e.getAttribute("aria-label") ?? "").trim()) || re.test((e.textContent ?? "").replace(/\s+/g, " ").trim());
  };
  const begin = performance.now();
  while (performance.now() - begin < maxMs) {
    const alle = new Set(delen.flatMap((d) => [...document.querySelectorAll(d.kiezer)].filter((e) => past(e, d.tekst))));
    const lijst = [...alle]
      .sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1))
      .filter((e) => !niet.some((n) => (e.textContent ?? "").includes(n.startsWith("@") ? window.__namen[n.slice(1)] : n)));
    const el = nr !== undefined ? lijst[nr] : lijst.find((e) => e.checkVisibility());
    if (el) return el;
    await volgendBeeld();
  }
  throw new Error(`Geen ${JSON.stringify(kiezer)}${tekst ? ` met "${tekst}"` : ""}${nr !== undefined ? ` nummer ${nr}` : ""} in beeld`);
}

/**
 * Eén stap naar een scherm, met de knoppen van de app zelf (een klik zonder vinger, `detail: 1` zoals een muis: het voorwerp zakt
 * dan niet, zie `klik` in Voorwerpen.svelte). Daarna wacht hij tot het scherm stil is; met `rustig: false` alleen tot er niets meer
 * onderweg is (de volgende stap wacht zelf tot zijn knop er is).
 * - `"kiezer"` of `{ klik, tekst, vlag, niet, nr }`: klik op het element dat past (zie `zoek`).
 * - `{ vul, waarde }`: tik een waarde in een veld.
 * - `{ nep }`: zet de nep-server in een stand: `fout` (elk verzoek een fout), `houd` (verzoeken komen nooit), `zonderSpeler`.
 */
async function stap(s, { rustig = true } = {}) {
  if (typeof s === "string") s = { klik: s };
  if (s.klik) {
    const { klik, ...rest } = s;
    // Een knop op nummer: eerst het hele scherm klaar, anders telt hij knoppen van het vorige scherm mee.
    if (s.nr !== undefined) await stil();
    const el = await zoek(klik, rest);
    el.scrollIntoView?.({ block: "nearest" });
    el.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, detail: 1, view: window }));
  } else if (s.vul) {
    const el = await zoek(s.vul);
    el.value = s.waarde;
    el.dispatchEvent(new Event("input", { bubbles: true }));
  } else if (s.nep === "fout") {
    window.__nep.fetch = async () => Response.json({ fout: "server" }, { status: 500 });
  } else if (s.nep === "houd") {
    // Een scherm dat op de server wacht: geen antwoord op verzoeken om gegevens.
    window.fetch = (u, i) => (String(u).includes("/api/") ? new Promise(() => {}) : nepFetch(u, i));
  } else if (s.nep === "zonderSpeler") {
    localStorage.removeItem("halma.speler"); localStorage.removeItem("leapstone.leren.gevraagd");
  } else throw new Error(`Onbekende stap ${JSON.stringify(s)}`);
  if (!rustig) return kort();
  const rest = await stil();
  if (rest.length) console.warn("[fototool] niet stil na een stap:", rest.join(", "));
}

/**
 * Zet direct een scherm: de app begint opnieuw (verse voorbeeldgegevens en opslag, taal `taal`, `extra` zoals in het adres),
 * doet de `stappen` en wacht tot alles stil is. Geeft wat na de laatste stap nog bezig was (leeg als het stil is).
 */
async function toon({ taal = "", extra = "", potje = "", data = "", stappen = [] } = {}) {
  document.activeElement?.blur?.();
  await globalThis.__leapstoneOpnieuw(() => {
    window.scrollTo(0, 0);
    history.replaceState(null, "", ADRES);
    localStorage.clear();
    sessionStorage.clear();
    wisPrestatiebalk();
    zetServer({ taal, extra, potje, data });
  });
  await kort();
  for (const s of stappen) await stap(s, { rustig: false });
  return stil();
}

window.__leapstone = { toon, stap, stil, bezig };
await import("/src/main.ts");
