import { mount, unmount } from "svelte";
import init from "./wasm/halma_core.js";
import App from "./App.svelte";
import { kan3d, voorladen } from "./bord3d";
import { IS_APP } from "./omgeving";
import { SPELER_KLEUREN } from "./spelers";
import { meldTaal } from "./online";
import "./trillen";
import { huidigeTaal, laadBegintaal } from "./taal.svelte";
import { onthoudTestvlag } from "./testspeler";
import { schuifBovenToetsenbord, zetTerugNaToetsenbord } from "./toetsenbord";
import { isIos } from "./meldingen";

onthoudTestvlag();
// iOS laat de pagina na het toetsenbord soms verschoven staan; dan raakt een tik de knop niet (toetsenbord.ts). Alleen daar.
// Het toetsenbord van iOS ligt over de pagina: de app schuift omhoog zodat het veld erboven blijft. In de Android-app ligt het
// toetsenbord ook over de pagina (edge-to-edge); daar meldt MainActivity de hoogte en schuift de app op dezelfde manier.
if (isIos()) {
  zetTerugNaToetsenbord();
  schuifBovenToetsenbord();
} else if (IS_APP) schuifBovenToetsenbord();
await init();
// De taal van de telefoon (of de keuze in Account) moet er zijn voor het eerste scherm.
await laadBegintaal();
if (IS_APP) {
  const { leesStartLink } = await import("./deeplink");
  await leesStartLink().catch(() => {});
}
const plek = document.getElementById("app")!;
let app = mount(App, { target: plek });
if (import.meta.env.DEV && "__nep" in globalThis) {
  // Alleen de nep-pagina van de dev-server (de fototool, web/scripts/nep/nep.js): begin de app opnieuw zonder de pagina en het
  // 3D-bord opnieuw te laden. Vite haalt dit uit de build voor Spelers (`import.meta.env.DEV` is daar false).
  // `tussen`: tussen het opruimen en het opnieuw beginnen (verse voorbeeldgegevens en opslag).
  (globalThis as { __leapstoneOpnieuw?: (tussen: () => void) => Promise<void> }).__leapstoneOpnieuw = async (tussen) => {
    await unmount(app);
    tussen();
    await laadBegintaal();
    app = mount(App, { target: plek });
    meldTaal();
  };
}
// De server onthoudt de taal van de Speler voor Meldingen en foutmeldingen; zeg hem welke taal nu geldt.
meldTaal();
// Het 3D-bord is groot: laad het alvast, zodat een Potje meteen kan beginnen.
voorladen(SPELER_KLEUREN.map((k) => k.kleur));
// De knopplaten van de eerste tafel: code, teksten en lettertype (30 kB) nu al. Anders wacht het bakken op drie verzoeken na elkaar,
// achter de plaatjes van het bord aan.
if (kan3d()) void import("./knopplaten").then((k) => Promise.all([k.laadTabel(huidigeTaal()), k.laadLetters(huidigeTaal())])).catch(() => {});
registreerServiceWorker();

/**
 * De service worker haalt bij het eerste bezoek alles voor offline op (2 MB). Op een trage verbinding ging dat van dezelfde lijn af
 * als het 3D-bord en kwam de tafel 10 s later. Daarom pas na de eerste tafel (`performance.mark("tafel")` in Voorwerpen.svelte),
 * of meteen als er geen 3D-bord komt. Een scherm zonder tafel houdt hem hooguit `NA_MS` tegen.
 */
function registreerServiceWorker(): void {
  const NA_MS = 60000;
  if (IS_APP || !import.meta.env.PROD || !("serviceWorker" in navigator)) return;
  let gedaan = false;
  const doe = () => {
    if (gedaan) return;
    gedaan = true;
    void navigator.serviceWorker.register("/sw.js", { scope: "/" });
  };
  if (!kan3d() || typeof PerformanceObserver === "undefined") return doe();
  new PerformanceObserver((lijst, kijker) => {
    if (!lijst.getEntriesByName("tafel").length) return;
    kijker.disconnect();
    doe();
  }).observe({ type: "mark", buffered: true });
  setTimeout(doe, NA_MS);
}
