<script lang="ts">
  import AppKnop from "./AppKnop.svelte";
  import { onDestroy, onMount, untrack } from "svelte";
  import OnlineSpel from "./OnlineSpel.svelte";
  import Meldingen from "./Meldingen.svelte";
  import MijnPotjes from "./MijnPotjes.svelte";
  import Ranglijst from "./Ranglijst.svelte";
  import Vrienden from "./Vrienden.svelte";
  import Statistieken from "./Statistieken.svelte";
  import Account from "./Account.svelte";
  import { neemVraagLeren } from "./leren";
  import { DENKTIJDEN, denktijdNaam, denktijdTekst, lokaleDeadline, STANDAARD_DENKTIJD, type Denktijd } from "./denktijd";
  import { breedKeuze, onlineKeuze } from "./keuzetafel";
  import Icoon from "./Icoon.svelte";
  import Laadtafel from "./Laadtafel.svelte";
  import LakSteen from "./LakSteen.svelte";
  import { binnen } from "./overgang";
  import { bordWarm } from "./bord3d";
  import Voorwerpen, { type TafelKnop, type Vakken } from "./Voorwerpen.svelte";
  import { schuifteken } from "./schuifteken";
  import { isBreed } from "./breed.svelte";
  import { breedLijst, kolomStijl, codeInvullenTafel, foutTafel, herstelcodeTafel, lerenTafel, naamTafel, platenStijl, tafelStand, wachtkamer as wachtkamerVoorwerpen, zoeken as zoekVoorwerpen } from "./voorwerpen-lijsten";
  import { metLink, metNaam, t, tn } from "./taal.svelte";
  import { krimp } from "./krimp";
  import { AANTALLEN, AANTALLEN_VIERKANT, beweging as bewegingVan, standVoorZet, type Beweging, type Vorm } from "./spelers";
  import { Potje } from "./wasm/halma_core.js";
  import {
    ApiFout,
    bewaarPotjeId,
    bewaarSpeler,
    meldTaal,
    doeMee,
    doeZet,
    stuurBericht as stuurBerichtNaarServer,
    voegBerichtenSamen,
    type Bericht,
    geefOp as geefOpBijServer,
    haalStand,
    herstel,
    leesPotjeId,
    leesSpeler,
    volgPotje,
    stopZoeken,
    zoekSnelPotje,
    type Stand,
    maakPotje,
    maakSpeler,
    meldingBijMeedoen,
    PRIVACY_LINK,
    TERMS_LINK,
    tekstVan,
    uitnodigingsLink,
    type OpgeslagenSpeler,
    type PotjeInfo,
  } from "./online";

  // `code` is de Uitnodiging uit het adres, als de Speler via een link kwam.
  // `begin`: na het kiezen van een Spelersnaam naar Mijn potjes, of meteen naar de Ranglijst,
  // of (snel) meteen zoeken naar een Snel potje (Play online).
  let {
    code = null,
    begin = "mijn",
    terug,
    speluitleg,
  }: { code?: string | null; begin?: "mijn" | "ranglijst" | "snel" | "stats" | "vrienden"; terug: () => void; speluitleg?: () => void } = $props();

  type Scherm = "laden" | "naam" | "invullen" | "herstelcode" | "leren" | "mijn" | "ranglijst" | "vrienden" | "stats" | "account" | "keuze" | "wachtkamer" | "zoeken" | "spel" | "fout";
  let scherm = $state<Scherm>("laden");
  // De Vriendenlijst opende vanuit het hoofdmenu: terug gaat dan weer naar het menu, tot de Speler in Mijn potjes komt.
  let vriendenVanMenu = $state(untrack(() => begin === "vrienden"));
  let speler = $state<OpgeslagenSpeler | null>(null);
  let naam = $state("");
  let invoer = $state("");
  let herstelcode = $state("");
  let vorm = $state<Vorm>("ster");
  let aantal = $state<number>(2);
  let denktijd = $state<Denktijd>(STANDAARD_DENKTIJD);
  let stand = $state.raw<Stand | null>(null);
  let berichten = $state.raw<Bericht[]>([]);
  let verbonden = $state(true);
  let beweging = $state<Beweging | null>(null);
  let spelMelding = $state("");
  let potje = $state<PotjeInfo | null>(null);
  let melding = $state("");
  // Wat het foutscherm bij Try again opnieuw doet (dezelfde stap, met dezelfde keuzes); null als opnieuw proberen niets zou helpen.
  let foutOpnieuw = $state<(() => void) | null>(null);
  let bezig = $state(false);
  /** Welk formulier op de server wacht: die knop blijft ingedrukt; de knop van het andere formulier is zolang dof. */
  let wachtOp = $state<"naam" | "herstel" | null>(null);
  let gekopieerd = $state("");
  let stopVolgen: (() => void) | undefined;

  onMount(() => {
    speler = leesSpeler();
    if (!speler) scherm = "naam";
    else verder();
  });
  onDestroy(() => stopVolgen?.());

  /** De cursor staat meteen in het veld als het scherm opent. */
  function focusBijOpenen(el: HTMLInputElement) {
    el.focus({ preventScroll: true });
  }

  /** Eén vaste, vertaalde zin op het foutscherm in plaats van de ruwe servertekst. */
  function foutZin(e: unknown): string {
    if (e instanceof ApiFout) {
      if (e.status === 0) return e.message;
      if (e.status === 404 || e.status === 409) return meldingBijMeedoen(e);
    }
    return t("online.errorScreen");
  }

  async function verder() {
    melding = "";
    const bewaard = leesPotjeId();
    if (code) {
      await meedoen();
    } else if (begin === "snel") {
      await zoekSnel();
    } else if (bewaard !== null) {
      // Na verversen terug in het eigen Potje.
      scherm = "laden";
      volg(bewaard);
    } else {
      scherm = begin;
    }
  }

  /** Open een Potje uit Mijn potjes: de Wachtkamer of het bord, naar wat de server zegt. */
  function openPotje(id: number) {
    melding = "";
    potje = null;
    stand = null;
    scherm = "laden";
    volg(id);
  }

  /** Terug naar Mijn potjes. Het Potje wordt niet meer onthouden, zodat verversen je niet terugzet. */
  function naarMijnPotjes() {
    stopVolgen?.();
    bewaarPotjeId(null);
    potje = null;
    stand = null;
    melding = "";
    vriendenVanMenu = false;
    scherm = "mijn";
  }

  function sleutelVerlopen() {
    speler = null;
    scherm = "naam";
    melding = t("online.keyExpired");
  }

  async function meedoen() {
    if (!speler || !code) return;
    foutOpnieuw = null;
    melding = "";
    scherm = "laden";
    try {
      toonPotje(await doeMee(speler.sleutel, code));
    } catch (e) {
      if (e instanceof ApiFout && e.status === 401) {
        // De server kent deze sleutel niet meer: opnieuw een Spelersnaam kiezen of herstellen.
        speler = null;
        scherm = "naam";
        melding = t("online.keyExpired");
        return;
      }
      melding = foutZin(e);
      foutOpnieuw = e instanceof ApiFout && (e.status === 404 || e.status === 409) ? null : () => void meedoen();
      scherm = "fout";
    }
  }

  function toonPotje(p: PotjeInfo) {
    potje = p;
    stand = null;
    scherm = "wachtkamer";
    volg(p.potje_id);
  }

  /** Volg een Potje live: de Wachtkamer, en daarna het bord. Elke stand komt van de server. */
  function volg(id: number) {
    if (!speler) return;
    stopVolgen?.();
    bewaarPotjeId(id);
    verbonden = true;
    berichten = [];
    stopVolgen = volgPotje(speler.sleutel, id, {
      opStand: neemStand,
      opBericht: (b) => (berichten = voegBerichtenSamen(berichten, [b])),
      opBerichten: (lijst) => (berichten = voegBerichtenSamen(berichten, lijst)),
      opVerbonden: (ok) => (verbonden = ok),
      opFout: () => {
        // Het Potje bestaat niet meer of is niet van deze Speler.
        bewaarPotjeId(null);
        potje = null;
        stand = null;
        melding = t("online.gameGone");
        scherm = "mijn";
      },
    });
  }

  function neemStand(nieuw: Stand) {
    // Een oudere stand (door een late verbinding) mag het bord niet terugdraaien.
    if (stand && nieuw.versie < stand.versie) return;
    const z = nieuw.laatste_zet;
    beweging = null;
    if (stand && z && z.soort === "zet" && z.van !== null && z.naar !== null && nieuw.versie > stand.versie) {
      const p = vormPlekken(nieuw);
      const voor = standVoorZet(nieuw.stand.map((v) => v - 1), z.van, z.naar);
      if (p) beweging = bewegingVan(nieuw.bord, p, voor, z.van, z.naar);
    }
    stand = nieuw;
    potje = {
      potje_id: nieuw.potje_id,
      uitnodiging: nieuw.uitnodiging,
      bord: nieuw.bord,
      aantal_spelers: nieuw.aantal_spelers,
      spelers: nieuw.spelers.map(({ plek, speler_id, spelersnaam }) => ({ plek, speler_id, spelersnaam })),
      vol: nieuw.gestart,
      denktijd_s: nieuw.denktijd_s,
    };
    ontvangenOp = Date.now();
    if (scherm === "laden" || scherm === "wachtkamer" || scherm === "zoeken" || scherm === "spel") {
      scherm = nieuw.gestart ? "spel" : nieuw.snel ? "zoeken" : "wachtkamer";
    }
  }

  // Play online: de zoektijd (de server vult na 20 s de plek) loopt als teller op het zoekscherm.
  const ZOEK_MS = 20_000;
  let ontvangenOp = 0;
  let nuMs = $state(Date.now());
  let stoppen = false;
  $effect(() => {
    if (scherm !== "zoeken") return;
    nuMs = Date.now();
    const t = setInterval(() => (nuMs = Date.now()), 250);
    return () => clearInterval(t);
  });
  const verstreken = $derived.by(() => {
    const tot = stand?.zoek_tot_ms;
    if (typeof tot !== "number") return 0;
    const rest = (lokaleDeadline(tot, stand?.server_tijd_ms, ontvangenOp) ?? tot) - nuMs;
    return Math.min(ZOEK_MS, Math.max(0, ZOEK_MS - rest));
  });
  const teller = $derived(`0:${String(Math.floor(verstreken / 1000)).padStart(2, "0")}`);

  /** Zoek een Snel potje. De server koppelt aan wie het eerst wacht; de live verbinding meldt wanneer het begint. */
  async function zoekSnel(meer = false) {
    if (!speler) return;
    stopVolgen?.();
    melding = "";
    foutOpnieuw = null;
    potje = null;
    stand = null;
    scherm = "laden";
    try {
      const eerste = await zoekSnelPotje(speler.sleutel, meer);
      volg(eerste.potje_id);
      neemStand(eerste);
    } catch (e) {
      if (e instanceof ApiFout && e.status === 401) return sleutelVerlopen();
      melding = foutZin(e);
      foutOpnieuw = () => void zoekSnel(meer);
      scherm = "fout";
    }
  }

  /** Het zoekscherm hoort bij een Snel potje met meer Spelers ("Find 4 players"). */
  const zoektMeer = $derived((stand?.aantal_spelers ?? 2) > 2);

  /** Verlaat de wachtrij voor 2 Spelers en zoekt een Snel potje met meer Spelers. Is er net een tegenstander, dan begint het Potje gewoon. */
  async function zoekMeerSpelers() {
    if (!speler || stoppen) return;
    const id = stand?.potje_id;
    stoppen = true;
    try {
      if (id !== undefined) await stopZoeken(speler.sleutel, id);
    } catch (e) {
      if (id !== undefined && e instanceof ApiFout && e.status === 409) {
        stoppen = false;
        return;
      }
    }
    stoppen = false;
    bewaarPotjeId(null);
    await zoekSnel(true);
  }

  /** Stop met zoeken en verlaat de wachtrij. Is er net een tegenstander, dan begint het Potje gewoon. */
  async function stopMetZoeken() {
    if (!speler || stoppen) return terug();
    const id = stand?.potje_id;
    stoppen = true;
    stopVolgen?.();
    try {
      if (id !== undefined) await stopZoeken(speler.sleutel, id);
    } catch (e) {
      if (id !== undefined && e instanceof ApiFout && e.status === 409) {
        stoppen = false;
        scherm = "laden";
        volg(id);
        return;
      }
    }
    stoppen = false;
    bewaarPotjeId(null);
    potje = null;
    stand = null;
    terug();
  }

  /** Plekken van de vakken van dit bord (vast per bord), uit de spelregels in WebAssembly. */
  function vormPlekken(s: Stand): number[] | null {
    try {
      const p = s.bord === "vierkant" ? Potje.vierkant(s.aantal_spelers) : new Potje(s.aantal_spelers);
      const plekken = Array.from(p.vak_plekken());
      p.free();
      return plekken;
    } catch {
      return null;
    }
  }

  async function opnieuwOphalen() {
    if (!speler || !potje) return;
    try {
      neemStand(await haalStand(speler.sleutel, potje.potje_id));
    } catch {
      // De live verbinding haalt de stand zo ook op.
    }
  }

  async function stuurZet(van: number, naar: number) {
    if (!speler || !stand) return;
    spelMelding = "";
    try {
      neemStand(await doeZet(speler.sleutel, stand.potje_id, van, naar));
    } catch (e) {
      spelMelding = tekstVan(e);
      await opnieuwOphalen();
    }
  }

  /** Stuurt een Bericht. Het verschijnt in de lijst via de live verbinding of, als die later is, hier. */
  async function stuurBericht(tekst: string) {
    if (!speler || !stand) return;
    const b = await stuurBerichtNaarServer(speler.sleutel, stand.potje_id, tekst);
    berichten = voegBerichtenSamen(berichten, [b]);
  }

  async function stuurOpgeven() {
    if (!speler || !stand) return;
    spelMelding = "";
    try {
      neemStand(await geefOpBijServer(speler.sleutel, stand.potje_id));
    } catch (e) {
      spelMelding = tekstVan(e);
      await opnieuwOphalen();
    }
  }

  /** Het account is weg: niets onthouden en terug naar het begin, zonder Spelersnaam. */
  function accountVerwijderd() {
    stopVolgen?.();
    speler = null;
    potje = null;
    stand = null;
    terug();
  }

  function potjeKlaar() {
    stopVolgen?.();
    bewaarPotjeId(null);
    terug();
  }

  async function kiesNaam(e?: Event) {
    e?.preventDefault();
    // Enter in een leeg veld: niets naar de server sturen; de zin onder het veld zegt al wat eerst moet.
    if (bezig || naam.trim() === "") return;
    bezig = true;
    wachtOp = "naam";
    melding = "";
    try {
      const nieuw = await maakSpeler(naam);
      speler = bewaarSpeler(nieuw);
      meldTaal();
      herstelcode = nieuw.herstelcode;
      scherm = "herstelcode";
    } catch (err) {
      melding = tekstVan(err);
    } finally {
      bezig = false;
      wachtOp = null;
    }
  }

  /** Na "Saved my code": een nieuwe Speler krijgt eenmalig de vraag "Learn to play?". */
  function naHerstelcode() {
    if (speluitleg && neemVraagLeren()) scherm = "leren";
    else verder();
  }

  /** Skip gaat naar het menu; met een Uitnodiging of na "Play online" gaat de Speler door waar hij heen wilde. */
  function slaLerenOver() {
    if (code || begin === "snel") verder();
    else terug();
  }

  async function vulHerstelcodeIn(e?: Event) {
    e?.preventDefault();
    if (bezig || invoer.trim() === "") return;
    bezig = true;
    wachtOp = "herstel";
    melding = "";
    try {
      speler = bewaarSpeler(await herstel(invoer));
      meldTaal();
      await verder();
    } catch (err) {
      melding = err instanceof ApiFout && err.status === 404 ? t("online.codeUnknown") : tekstVan(err);
    } finally {
      bezig = false;
      wachtOp = null;
    }
  }

  async function start() {
    if (!speler || bezig) return;
    bezig = true;
    melding = "";
    try {
      toonPotje({ denktijd_s: denktijd, ...(await maakPotje(speler.sleutel, vorm, aantal, denktijd)) });
    } catch (err) {
      if (err instanceof ApiFout && err.status === 401) {
        speler = null;
        scherm = "naam";
        melding = t("online.keyExpired");
      } else melding = tekstVan(err);
    } finally {
      bezig = false;
    }
  }

  async function kopieer(tekst: string, wat: string) {
    try {
      await navigator.clipboard.writeText(tekst);
      gekopieerd = wat;
    } catch {
      gekopieerd = "";
      melding = t("online.copyFailed");
    }
  }

  async function nodigUit() {
    if (!potje) return;
    const link = uitnodigingsLink(potje.uitnodiging);
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title: "Leapstone", text: t("online.shareText"), url: link });
        return;
      } catch (e) {
        // De Speler sloot het deelmenu zelf: niets doen.
        if (e instanceof DOMException && e.name === "AbortError") return;
      }
    }
    await kopieer(link, "link");
  }

  const open = $derived(potje ? potje.aantal_spelers - potje.spelers.length : 0);

  // De Wachtkamer als 3D-tafel (taak 180, uiterlijk 1b): de Stenen van de Spelers die er al zijn staan op het bord, de plekken en de
  // uitnodiging op een porseleinen plaat, en de knoppen zijn voorwerpen.
  // Voor welk scherm de tafel klaar is (Wachtkamer, Finding a player, foutscherm): wisselt het scherm, dan is de nieuwe tafel nog niet klaar.
  let tafelKlaarVoor = $state("");
  const tafelKlaar = $derived(tafelKlaarVoor === scherm);
  let tafelVakken = $state<Vakken>({});
  // Kwam de Speler van een andere tafel op hetzelfde bord (UI-overgangen), dan blijft die in beeld tot deze tafel klaar is.
  const wachtWarm = $derived(scherm === "wachtkamer" && untrack(() => bordWarm(potje?.bord === "vierkant")));
  const zoekWarm = $derived(scherm === "zoeken" && untrack(() => bordWarm(false)));
  const foutWarm = $derived(scherm === "fout" && untrack(() => bordWarm(false)));
  // Breed scherm (taak 236): het bord links, de platen en knoppen als kolom rechts.
  const breed = $derived(isBreed());
  const zoekVoorwerpenLijst = $derived(breedLijst(zoekVoorwerpen(zoektMeer), breed, { rek: false }));
  const zoekStand = $derived(scherm === "zoeken" ? tafelStand(zoektMeer ? 4 : 2, false) : []);
  const foutStand = $derived(scherm === "fout" ? tafelStand(2, false, []) : []);
  const zoekKnoppen = $derived<TafelKnop[]>([
    { id: "terug", tekst: t("common.back"), doe: stopMetZoeken },
    ...(zoektMeer ? [] : [{ id: "meer", tekst: t("online.findFour"), doe: zoekMeerSpelers }]),
  ]);
  // Spelersnaam, Herstelcode invullen, Herstelcode tonen en "Learn to play?" (taak 226): een plaat met de vraag en het veld, onder een leeg bord.
  const naamWarm = $derived(["naam", "invullen", "herstelcode", "leren"].includes(scherm) && untrack(() => bordWarm(false)));
  const naamStand = $derived(["naam", "invullen", "herstelcode", "leren"].includes(scherm) ? tafelStand(2, false, []) : []);
  const naamVoorwerpen = $derived(breedLijst(naamTafel(), breed, { rek: false }));
  const invulVoorwerpen = $derived(breedLijst(codeInvullenTafel(), breed, { rek: false }));
  const codeVoorwerpen = $derived(breedLijst(herstelcodeTafel(), breed, { rek: false }));
  const lerenVoorwerpen = $derived(breedLijst(lerenTafel(), breed, { rek: false }));
  const naamKnoppen = $derived<TafelKnop[]>([
    { id: "terug", tekst: t("common.back"), doe: terug },
    { id: "verder", tekst: t("online.continue"), uit: wachtOp ? wachtOp !== "naam" : naam.trim() === "", bezig: wachtOp === "naam", doe: () => kiesNaam() },
  ]);
  const invulKnoppen = $derived<TafelKnop[]>([
    { id: "terug", tekst: t("common.back"), doe: naarNaam },
    { id: "verder", tekst: t("online.getNameBack"), uit: wachtOp ? wachtOp !== "herstel" : invoer.trim() === "", bezig: wachtOp === "herstel", doe: () => vulHerstelcodeIn() },
  ]);
  const codeKnoppen = $derived<TafelKnop[]>([{ id: "verder", tekst: t("online.savedCode"), doe: naHerstelcode }]);
  const lerenKnoppen = $derived<TafelKnop[]>([
    { id: "overslaan", tekst: t("learnAsk.skip"), doe: slaLerenOver },
    { id: "verder", tekst: t("learnAsk.start"), doe: () => speluitleg?.() },
  ]);
  function naarInvullen() {
    scherm = "invullen";
    melding = "";
  }
  function naarNaam() {
    scherm = "naam";
    melding = "";
  }
  const foutKnoppen = $derived<TafelKnop[]>([
    { id: "terug", tekst: t("common.back"), label: t("common.backToStart"), doe: terug },
    ...(foutOpnieuw ? [{ id: "opnieuw", tekst: t("common.tryAgain"), doe: () => foutOpnieuw?.() }] : []),
  ]);
  const foutVoorwerpenLijst = $derived(breedLijst(foutTafel(foutOpnieuw !== null), breed, { rek: false }));
  const wachtVoorwerpen = $derived(breedLijst(wachtkamerVoorwerpen(potje?.vol ?? false), breed));
  const wachtStand = $derived(
    potje ? tafelStand(potje.aantal_spelers, potje.bord === "vierkant", potje.spelers.map((s) => s.plek - 1)) : [],
  );
  const wachtKnoppen = $derived<TafelKnop[]>([
    { id: "terug", tekst: t("common.back"), label: t("common.backToStart"), doe: potjeKlaar },
    ...(potje?.vol ? [] : [{ id: "uitnodigen", tekst: t("online.invite"), doe: nodigUit }]),
    { id: "potjes", tekst: t("common.myGames"), doe: naarMijnPotjes },
  ]);
  const akkoord = $derived(metLink("online.agree"));

  // Een nieuw online Potje als tafel (taak 227): bord, aantal Spelers en Denktijd als keuzebalken onder het bord, zoals Computer.
  const keuzeWarm = $derived(scherm === "keuze" && untrack(() => bordWarm(vorm === "vierkant")));
  // De laadtafel: bij het laden na Play online (en bij een Potje openen), ook als het bord al gebouwd is, want het scherm dat net
  // sloot, nam zijn tafel mee en het volgende heeft hem nog niet. En op elk tafelscherm van dit component tot zijn tafel klaar is,
  // tenzij de vorige tafel op hetzelfde bord nog in beeld staat (feature 251: geen plat scherm ertussen).
  const TAFELSCHERMEN: readonly Scherm[] = ["naam", "invullen", "herstelcode", "leren", "keuze", "zoeken", "wachtkamer", "fout"];
  const laadtafelAan = $derived(
    scherm === "laden" || (TAFELSCHERMEN.includes(scherm) && !tafelKlaar && !(naamWarm || keuzeWarm || zoekWarm || wachtWarm || foutWarm)),
  );
  const aantalMogelijk = $derived<readonly number[]>(vorm === "vierkant" ? AANTALLEN_VIERKANT : AANTALLEN);
  // Op het Vierkant bord kan het niet met 3 of 6 Spelers: dan kiest hij 2.
  $effect.pre(() => {
    if (!aantalMogelijk.includes(aantal)) aantal = 2;
  });
  const denktijdTekstVan = (d: Denktijd) => (d === null ? t("moveTime.off") : denktijdTekst(d));
  const keuzeNamen = $derived({ ster: t("board.star"), vierkant: t("board.square") });
  const keuzeVoorwerpen = $derived(
    breedKeuze(
      onlineKeuze({
        namen: keuzeNamen,
        vorm,
        aantallen: aantalMogelijk,
        aantal,
        denktijden: DENKTIJDEN.map(denktijdTekstVan),
        denktijd: DENKTIJDEN.indexOf(denktijd),
      }),
      breed,
      true,
    ),
  );
  const keuzeStand = $derived(scherm === "keuze" ? tafelStand(aantal, vorm === "vierkant") : []);
  const keuzeKnoppen = $derived<TafelKnop[]>([
    { id: "terug", tekst: t("common.back"), label: t("common.myGames"), doe: naarMijnPotjes },
    { id: "ster", tekst: keuzeNamen.ster, keuze: vorm === "ster", doe: () => (vorm = "ster") },
    { id: "vierkant", tekst: keuzeNamen.vierkant, keuze: vorm === "vierkant", doe: () => (vorm = "vierkant") },
    ...aantalMogelijk.map((a): TafelKnop => ({ id: `aantal${a}`, tekst: String(a), label: tn("players.count", a), keuze: a === aantal, doe: () => (aantal = a) })),
    ...DENKTIJDEN.map((d, i): TafelKnop => ({ id: `denktijd${i}`, tekst: denktijdTekstVan(d), label: denktijdNaam(d), keuze: d === denktijd, doe: () => (denktijd = d) })),
    { id: "start", tekst: t("common.start"), label: t("online.create"), uit: bezig, doe: start },
  ]);
</script>

{#snippet stoelenLijst()}
  {#if potje}
    <ol class="stoelen veel" aria-label={t("online.playersInGame")}>
      {#each Array.from({ length: potje.aantal_spelers }, (_, i) => i) as i (i)}
        {@const s = potje.spelers.find((x) => x.plek === i + 1)}
        {@const ik = s?.speler_id === speler?.speler_id}
        <li class:leeg={!s} class:ik style="--i:{i}">
          <span class="schijf pion-plek">
            {#if s}
              <!-- Op de plaat van de tafel: een Steen van lak, zoals op het bord (taak 184). -->
              <svg class="lak-steen" viewBox="-0.62 -0.86 1.24 1.0" width="40" height="32" focusable="false"><LakSteen speler={i} id="wacht-steen-{i}" /></svg>
            {/if}
          </span>
          {#if s}
            <!-- Taak 284: de naam over hooguit twee regels en "(you)" eronder, zodat dat nooit wegvalt achter "Maxi…". -->
            {@const [voor, naam, na] = metNaam("common.nameYou", s.spelersnaam)}
            <span class="wie">
              <span class="sr-only">{ik ? t("common.nameYou", { name: s.spelersnaam }) : s.spelersnaam}</span>
              <bdi class="wie-naam" aria-hidden="true">{naam}</bdi>
              {#if ik}<span class="wie-jij" aria-hidden="true">{(voor + na).trim()}</span>{/if}
            </span>
          {:else}
            <span class="wie"><span class="sr-only">{t("online.waitingPlayer")}</span><span class="puntjes" aria-hidden="true"><i></i><i></i><i></i></span></span>
          {/if}
        </li>
      {/each}
    </ol>
  {/if}
{/snippet}
{#snippet wachtLink()}
  {#if potje && !potje.vol}
        <div class="link-rij">
          <Icoon naam="delen" maat={20} />
          <p class="link cijfers" data-testid="uitnodigingslink">{uitnodigingsLink(potje.uitnodiging)}</p>
          <button class="knop-ikoon" aria-label={gekopieerd === "link" ? t("online.linkCopied") : t("online.copyLink")} onclick={() => kopieer(uitnodigingsLink(potje!.uitnodiging), "link")}>
            <Icoon naam={gekopieerd === "link" ? "vink" : "kopie"} maat={20} />
          </button>
        </div>
  {/if}
{/snippet}
{#snippet wachtInfo()}
  {#if potje}
      <div class="stand-rij">
        <span class="tellers" aria-hidden="true">
          {#each Array.from({ length: potje.aantal_spelers }, (_, i) => i) as i (i)}<i class:vol={i < potje.spelers.length}></i>{/each}
        </span>
        <span class="open-tekst" aria-live="polite" {@attach krimp(0.65)}>{potje.vol ? t("online.everyoneHere") : tn("online.seatsOpen", open)}</span>
        <span class="soort">{t("mine.boardPlayers", { board: potje.bord === "vierkant" ? t("board.square") : t("board.star"), players: tn("players.count", potje.aantal_spelers) })}</span>
      </div>
      {#if potje.denktijd_s !== undefined}
        <p class="denktijd-badge cijfers" data-testid="denktijd-badge">
          <Icoon naam={potje.denktijd_s === null ? "oneindig" : "klok"} maat={16} />
          <span class="sr-only">{denktijdNaam(potje.denktijd_s)}</span>
          <span aria-hidden="true">{potje.denktijd_s === null ? t("moveTime.none") : denktijdTekst(potje.denktijd_s)}</span>
        </p>
      {/if}
      {#if speler}<Meldingen sleutel={speler.sleutel} />{/if}
      {#if melding}<p class="fout" role="alert">{melding}</p>{/if}

  {/if}
{/snippet}

{#snippet naamInhoud()}
  <form onsubmit={kiesNaam}>
    <label class="vraag" for="spelersnaam">{t("online.chooseName")}</label>
    <input id="spelersnaam" type="text" maxlength="30" autocomplete="nickname" autocorrect="off" spellcheck="false" enterkeyhint="go" placeholder={t("online.namePlaceholder")} use:focusBijOpenen bind:value={naam} />
    {#if melding}<p class="fout" role="alert">{melding}</p>{/if}
    <!-- Taak 240: Continue ligt er dof tot er een naam staat; zeg erbij wat je eerst moet doen. Staat er een naam, dan staat op
         dezelfde plek de zin over de Voorwaarden: die geldt pas als je verder kunt. Zo past alles in elke taal op de plaat. Beide
         zinnen liggen op elkaar en de plek is zo hoog als de hoogste, dus er springt niets bij de eerste letter. -->
    <div class="wissel">
      <p class="eerst" class:weg={naam.trim() !== ""} aria-hidden={naam.trim() !== ""}>{t("hint.name")}</p>
      <p class="akkoord" class:weg={naam.trim() === ""} aria-hidden={naam.trim() === ""}>{akkoord[0]}{#if akkoord.length > 1}<a href={TERMS_LINK} target="_blank" rel="noopener" tabindex={naam.trim() === "" ? -1 : undefined}>{akkoord[1]}</a>{akkoord[2]}{/if}</p>
    </div>
  </form>
  <div class="onderrij">
    <button class="tekstknop" onclick={naarInvullen}><Icoon naam="sleutel" maat={18} />{t("online.enterCode")}</button>
    <a class="tekstknop" href={PRIVACY_LINK} target="_blank" rel="noopener"><Icoon naam="schild" maat={18} />{t("common.privacy")}</a>
  </div>
  {#if code}<AppKnop />{/if}
{/snippet}
{#snippet invulInhoud()}
  <form onsubmit={vulHerstelcodeIn}>
    <label class="vraag" for="herstelcode-in">{t("online.yourCode")}</label>
    <input id="herstelcode-in" class="code-in" type="text" autocapitalize="characters" autocomplete="off" autocorrect="off" spellcheck="false" enterkeyhint="go" placeholder={t("online.codePlaceholder")} use:focusBijOpenen bind:value={invoer} />
    {#if melding}<p class="fout" role="alert">{melding}</p>{/if}
  </form>
{/snippet}
{#snippet codeInhoud()}
  <h1 class="welkom">{t("online.welcome", { name: speler?.spelersnaam ?? "" })}</h1>
  <div class="code-blok">
    <h2 class="kop">{t("online.yourCode")}</h2>
    <div class="code-rij">
      <p class="code cijfers" data-testid="herstelcode">{herstelcode}</p>
      <button class="knop-ikoon" aria-label={gekopieerd === "code" ? t("online.copied") : t("online.copyCode")} onclick={() => kopieer(herstelcode, "code")}>
        <Icoon naam={gekopieerd === "code" ? "vink" : "kopie"} maat={20} />
      </button>
    </div>
    <p class="uitleg">{t("online.keepCode")}</p>
  </div>
  {#if melding}<p class="fout" role="alert">{melding}</p>{/if}
{/snippet}

<Laadtafel aan={laadtafelAan} />
{#if scherm === "spel" && stand && speler}
  <OnlineSpel opnieuw={stand.snel ? () => zoekSnel(stand?.aantal_spelers !== undefined && stand.aantal_spelers > 2) : undefined} {stand} ikId={speler.speler_id} sleutel={speler.sleutel} {beweging} {verbonden} {berichten} {stuurBericht} melding={spelMelding} zet={stuurZet} geefOp={stuurOpgeven} klaar={potjeKlaar} mijnPotjes={naarMijnPotjes} />
{:else if scherm === "ranglijst" && speler}
  <Ranglijst sleutel={speler.sleutel} ikId={speler.speler_id} terug={begin === "ranglijst" ? terug : () => (scherm = "mijn")} verlopen={sleutelVerlopen} />
{:else if scherm === "vrienden" && speler}
  <Vrienden sleutel={speler.sleutel} terug={vriendenVanMenu ? terug : () => (scherm = "mijn")} verlopen={sleutelVerlopen} openPotje={(p) => toonPotje(p)} />
{:else if scherm === "stats" && speler}
  <Statistieken sleutel={speler.sleutel} terug={terug} verlopen={sleutelVerlopen} />
{:else if scherm === "account" && speler}
  <Account spelersnaam={speler.spelersnaam} sleutel={speler.sleutel} terug={() => (scherm = "mijn")} verwijderd={accountVerwijderd} />
{:else if scherm === "mijn" && speler}
  <MijnPotjes vrienden={() => ((melding = ""), (scherm = "vrienden"))} account={() => ((melding = ""), (scherm = "account"))} ranglijst={() => ((melding = ""), (scherm = "ranglijst"))} sleutel={speler.sleutel} ikId={speler.speler_id} {melding} open={openPotje} nieuw={() => ((melding = ""), (scherm = "keuze"))} {terug} verlopen={sleutelVerlopen} />
{:else}
{#key scherm}
<section class="scherm online scherm-{scherm}" in:binnen>
  {#if scherm === "laden"}
    <!-- De laadtafel (bovenaan). -->
  {:else if scherm === "naam" || scherm === "invullen" || scherm === "herstelcode" || scherm === "leren"}
    {#if scherm === "naam"}
      <Voorwerpen voorwerpen={naamVoorwerpen} knoppen={naamKnoppen} stand={naamStand} naam={t("online.chooseName")} klaar={() => (tafelKlaarVoor = "naam")} bind:vakken={tafelVakken} />
    {:else if scherm === "invullen"}
      <Voorwerpen voorwerpen={invulVoorwerpen} knoppen={invulKnoppen} stand={naamStand} naam={t("online.enterCode")} klaar={() => (tafelKlaarVoor = "invullen")} bind:vakken={tafelVakken} />
    {:else if scherm === "herstelcode"}
      <Voorwerpen voorwerpen={codeVoorwerpen} knoppen={codeKnoppen} stand={naamStand} naam={t("online.yourCode")} klaar={() => (tafelKlaarVoor = "herstelcode")} bind:vakken={tafelVakken} />
    {:else}
      <Voorwerpen voorwerpen={lerenVoorwerpen} knoppen={lerenKnoppen} stand={naamStand} naam={t("learnAsk.title")} klaar={() => (tafelKlaarVoor = "leren")} bind:vakken={tafelVakken} />
    {/if}
    {#if tafelKlaar}
    <div class="op-plaat plaat-midden" class:breed-tekst={breed} style={breed ? kolomStijl(tafelVakken.lijst) : platenStijl(tafelVakken.lijst)}>
      <div class="plaat-info schuif plaat-formulier">
        {#if scherm === "naam"}
          {#if code}<p class="uitgenodigd"><Icoon naam="vrienden" maat={18} />{t("online.invited")}</p>{/if}
          {@render naamInhoud()}
        {:else if scherm === "invullen"}
          {@render invulInhoud()}
        {:else if scherm === "herstelcode"}
          {@render codeInhoud()}
        {:else}
          <h1 class="welkom">{t("learnAsk.title")}</h1>
        {/if}
      </div>
    </div>
    {/if}
  {:else if scherm === "keuze"}
    <Voorwerpen voorwerpen={keuzeVoorwerpen} knoppen={keuzeKnoppen} stand={keuzeStand} vierkant={vorm === "vierkant"} naam={t("common.newGame")} klaar={() => (tafelKlaarVoor = "keuze")} bind:vakken={tafelVakken} />
    {#if tafelKlaar && melding}<p class="fout keuze-melding" role="alert">{melding}</p>{/if}
  {:else if scherm === "zoeken"}
    <Voorwerpen voorwerpen={zoekVoorwerpenLijst} knoppen={zoekKnoppen} stand={zoekStand} naam={t("common.playOnline")} klaar={() => (tafelKlaarVoor = "zoeken")} bind:vakken={tafelVakken} />
    {#if tafelKlaar}
    <div class="op-plaat plaat-midden" class:breed-tekst={breed} style={breed ? kolomStijl(tafelVakken.lijst) : platenStijl(tafelVakken.lijst)}>
      <p class="zoek-tekst" role="status">{t("online.finding")}</p>
      <p class="zoek-teller cijfers" data-testid="zoekteller" aria-hidden="true"><Icoon naam="klok" maat={16} />{teller}</p>
    </div>
    {/if}
  {:else if scherm === "wachtkamer" && potje}
    <Voorwerpen voorwerpen={wachtVoorwerpen} knoppen={wachtKnoppen} stand={wachtStand} vierkant={potje.bord === "vierkant"} naam={t("online.lobby")} klaar={() => (tafelKlaarVoor = "wachtkamer")} bind:vakken={tafelVakken} />
    {#if tafelKlaar}
    <div class="op-plaat" class:breed-tekst={breed} style={breed ? kolomStijl(tafelVakken.lijst) : platenStijl(tafelVakken.lijst)} use:schuifteken>
      {@render stoelenLijst()}
      <!-- Taak 289: de Uitnodigingslink staat vast onder de plekken en schuift niet mee, zodat hij zonder scrollen in beeld is. -->
      {@render wachtLink()}
      <div class="plaat-info schuif">{@render wachtInfo()}</div>
    </div>
    {/if}
  {:else}
    <Voorwerpen voorwerpen={foutVoorwerpenLijst} knoppen={foutKnoppen} stand={foutStand} naam={t("common.backToStart")} klaar={() => (tafelKlaarVoor = "fout")} bind:vakken={tafelVakken} />
    {#if tafelKlaar}
    <div class="op-plaat plaat-midden" class:breed-tekst={breed} style={breed ? kolomStijl(tafelVakken.lijst) : platenStijl(tafelVakken.lijst)}>
      <p class="fout" role="alert">{melding}</p>
    </div>
    {/if}
  {/if}
</section>
{/key}
{/if}

<style>
  /* De bovenkant op de tafel: een schijf met een icoon, wat dit scherm doet, zonder uitleg. */
  .hero {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 18px;
    padding-bottom: 8px;
  }
  .embleem {
    width: 112px;
    height: 112px;
    color: var(--inkt);
  }
  .fout-embleem {
    color: var(--fout);
  }
  .welkom {
    max-width: 100%;
    text-align: center;
    font-size: clamp(1.9rem, 8.5vw, 2.5rem);
    font-weight: 800;
    letter-spacing: -0.025em;
    line-height: 1.05;
    overflow-wrap: anywhere;
  }
  .uitgenodigd {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0;
    padding: 8px 16px;
    border-radius: var(--pil);
    background: var(--pilvlak);
    font-size: 0.92rem;
    font-weight: 700;
  }
  form {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .vraag {
    font-size: 1.45rem;
    font-weight: 800;
    letter-spacing: -0.015em;
    line-height: 1.15;
    text-align: center;
    margin-bottom: 4px;
    text-wrap: balance;
  }
  /* Een zichtbare rand van goud, zoals het chatveld, zodat te zien is waar je typt. */
  input[type="text"] {
    text-align: center;
    font-size: 1.15rem;
    box-shadow: inset 0 0 0 1.5px var(--goud);
  }
  input[type="text"]:focus {
    box-shadow: inset 0 0 0 2px var(--inkt);
  }
  .code-in {
    letter-spacing: 0.06em;
  }
  .eerst {
    margin: 0;
    text-align: center;
    font-size: 0.88rem;
    font-weight: 700;
    color: var(--tekst-zacht);
  }
  .akkoord {
    margin: 4px 0 0;
    text-align: center;
    font-size: 0.8rem;
    line-height: 1.4;
    font-weight: 500;
    color: var(--tekst-zacht);
  }
  .wissel {
    display: grid;
    align-items: center;
  }
  .wissel > p {
    grid-area: 1 / 1;
    transition: opacity 160ms ease-out;
  }
  .wissel > .weg {
    opacity: 0;
    visibility: hidden;
    transition: opacity 160ms ease-out, visibility 0s 160ms;
  }
  @media (prefers-reduced-motion: reduce) {
    .wissel > p,
    .wissel > .weg {
      transition: none;
    }
  }
  .akkoord a {
    color: var(--inkt);
    text-decoration-color: var(--tekst-stil);
    text-underline-offset: 3px;
  }
  .onderrij {
    flex: none;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 4px 22px;
  }
  .onderrij .tekstknop {
    min-height: 44px;
  }
  /* De Herstelcode: groot, in een zacht vlak. */
  .code-blok {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 20px 16px 18px;
    text-align: center;
  }
  .code-rij {
    display: flex;
    align-items: center;
    gap: 6px;
    width: 100%;
    justify-content: center;
  }
  .code {
    min-width: 0;
    margin: 0;
    white-space: nowrap;
    font-size: min(1.35rem, 5.6vw);
    font-weight: 800;
    letter-spacing: 0.04em;
    color: var(--tekst);
    user-select: all;
    direction: ltr;
  }
  .uitleg {
    margin: 0;
    color: var(--tekst-zacht);
    font-size: 0.9rem;
    font-weight: 500;
    text-align: center;
    text-wrap: balance;
  }

  /* Het zoekscherm: het Sterbord met Stenen, de tekst en de teller. */
  .hero.zoeken {
    padding-bottom: 4px;
    justify-content: stretch;
  }
  .zoek-bord {
    flex: 1;
    width: 100%;
    min-height: 0;
    container-type: size;
    display: grid;
    place-items: center;
  }
  .zoek-bord :global(svg) {
    width: auto;
    height: 100cqh;
    max-width: 90cqw;
  }
  .zoek-tekst {
    margin: 0;
    text-align: center;
    font-size: 1.45rem;
    font-weight: 800;
    letter-spacing: -0.015em;
  }
  .zoek-teller {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin: 0;
    font-size: 1.25rem;
    font-weight: 800;
    color: var(--tekst-zacht);
  }
  .knop-klein {
    align-self: center;
    min-height: 44px;
    padding: 0 16px;
    background: none;
    border: 0;
    color: var(--tekst-zacht);
    font: inherit;
    font-size: 0.92rem;
    font-weight: 700;
    text-decoration: underline;
    text-underline-offset: 4px;
    text-decoration-color: var(--lijn-fel);
    cursor: pointer;
  }
  .knop-klein:active {
    color: var(--tekst);
  }

  /* De Wachtkamer op de porseleinen plaat van de tafel (3D): gewone tekst op porselein. */
  .op-plaat {
    position: fixed;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-height: 0;
    /* De plaat van taak 181 (Tafel.svelte): de kleuren komen uit `:root` (app.css); de vlakken zijn hier iets minder rond. */
    --vel: 12px;
    color: var(--inkt);
    overflow: hidden;
  }
  /* De plekken op de plaat: een crème schijf met een gouden rand en een Steen van lak; een lege plek een kobaltblauwe stippellijn. */
  /* Taak 284: bij zes plekken op een smal scherm krimpt de schijf met zijn kolom (op 320 breed staken ze over elkaar en de rand). */
  .op-plaat .pion-plek {
    width: min(48px, 100%);
    height: auto;
    aspect-ratio: 1;
    padding-bottom: 6px;
    background: var(--wit);
    border: 1.5px solid var(--goud);
    box-shadow: none;
  }
  .op-plaat .stoelen li.leeg .pion-plek {
    background: none;
    border: 2px dashed var(--lijn-fel);
    animation: none;
  }
  .op-plaat .lak-steen {
    display: block;
    max-width: 82%;
    height: auto;
    overflow: visible;
  }
  /* De Denktijd en de uitnodigingslink: crème vlakken met dun goud in plaats van een gekleurde pil. */
  .op-plaat .denktijd-badge,
  .op-plaat .link-rij {
    border-radius: 12px;
    border: 1.5px solid var(--goud);
    background: var(--zacht);
  }
  /* Een foutmelding bij Create game op de tafel: een crème vlak boven de keuzebalken. */
  .keuze-melding {
    position: fixed;
    z-index: 2;
    left: 6%;
    right: 6%;
    top: 12%;
    margin: 0;
    padding: 8px 12px;
    border-radius: 12px;
    background: var(--wit);
    text-align: center;
  }
  /* Finding a player en het foutscherm: de tekst midden op de plaat. */
  .plaat-midden {
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  /* Spelersnaam, Herstelcode en "Learn to play?" op de plaat: het formulier midden op de plaat, scrolbaar als de tekst te groot is. */
  .plaat-formulier {
    padding: 12px 6% 6px;
    text-wrap: balance;
    /* `safe`: wordt de inhoud hoger dan de plaat, dan begint hij bovenaan en schuift hij, in plaats van boven af te kappen. */
    justify-content: safe center;
    align-items: stretch;
    gap: 8px;
  }
  .plaat-formulier .welkom {
    margin: 0;
    font-size: clamp(1.3rem, 6vw, 1.7rem);
  }
  .plaat-formulier .vraag {
    margin-bottom: 0;
    font-size: 1.3rem;
  }
  .plaat-formulier .onderrij .tekstknop {
    min-height: 28px;
    font-size: 0.82rem;
  }
  .plaat-formulier .akkoord {
    margin: 0;
    font-size: 0.72rem;
    line-height: 1.3;
  }
  .plaat-formulier input[type="text"] {
    padding-block: 8px;
    transition: box-shadow 140ms ease-out;
  }
  .plaat-formulier form {
    gap: 8px;
  }
  .plaat-info {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  /* De Wachtkamer: een schijf per plek met de pion van die Speler; een lege plek is een stippellijn met wachtpuntjes. */
  .stoelen {
    flex: none;
    list-style: none;
    margin: 6px 0 0;
    padding: 0;
    display: flex;
    gap: 6px;
  }
  .stoelen li {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    animation: stoel-in 520ms calc(var(--i) * 60ms) var(--uit) both;
  }
  .pion-plek {
    width: 66px;
    height: 66px;
    align-items: end;
    padding-bottom: 6px;
  }
  .stoelen.veel .pion-plek {
    width: min(52px, 100%);
    height: auto;
    aspect-ratio: 1;
    padding-bottom: 4px;
  }
  .stoelen li.leeg .pion-plek {
    background: rgb(247 241 224 / 0.25);
    box-shadow: none;
    border: 2.5px dashed rgb(31 58 130 / 0.5);
    animation: wacht 2000ms ease-in-out infinite;
  }
  /* Naam en "(you)" op één regel als dat past; anders "(you)" op de regel eronder. */
  .stoelen .wie {
    max-width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    column-gap: 0.25em;
    font-size: 0.82rem;
    font-weight: 700;
    text-align: center;
  }
  /* Een naam over hooguit twee regels (taak 284); een naam zonder spaties breekt waar het moet. */
  .wie-naam {
    max-width: 100%;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    overflow-wrap: anywhere;
  }
  /* Taak 289: staat "(you)" op een eigen regel, dan krijgt de eigen naam één regel (anders zakt de Uitnodigingslink onder de plaat). */
  .ik .wie-naam {
    -webkit-line-clamp: 1;
    line-clamp: 1;
  }
  .ik .wie-naam,
  .wie-jij {
    text-decoration: underline;
    text-decoration-thickness: 2px;
    text-underline-offset: 3px;
  }
  .puntjes {
    display: flex;
    gap: 5px;
    height: 1.4em;
    align-items: center;
  }
  .puntjes i {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--inkt);
    animation: puntje 1200ms ease-in-out infinite;
  }
  .puntjes i:nth-child(2) {
    animation-delay: 160ms;
  }
  .puntjes i:nth-child(3) {
    animation-delay: 320ms;
  }
  .wacht-bord {
    flex: 1;
    min-height: 0;
    container-type: size;
    display: grid;
    place-items: center;
  }
  .wacht-bord :global(svg) {
    width: auto;
    height: 100cqh;
    max-width: 90cqw;
  }
  @container (max-height: 110px) {
    .wacht-bord :global(svg) {
      display: none;
    }
  }
  .stand-rij {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px 10px;
    font-weight: 700;
  }
  .tellers {
    display: flex;
    gap: 5px;
  }
  .tellers i {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--inkt);
    opacity: 0.25;
  }
  .tellers i.vol {
    opacity: 1;
  }
  /* Taak 284: "1 seat still open" blijft op één regel naast de stippen (de letter krimpt als het moet, `krimp`) in plaats van als
     hele regel onder de plaat te zakken; de soort van het Potje mag wel naar de volgende regel. */
  .open-tekst {
    flex: 1 1 8rem;
    min-width: 0;
    white-space: nowrap;
    font-size: calc(1em * var(--krimp, 1));
  }
  .soort {
    margin-inline-start: auto;
    color: var(--tekst-zacht);
    font-size: 0.85rem;
    font-weight: 600;
  }
  .denktijd-badge {
    align-self: flex-start;
    display: flex;
    align-items: center;
    gap: 6px;
    margin: 0;
    padding: 5px 12px;
    border-radius: var(--pil);
    background: var(--zacht);
    color: var(--inkt);
    font-size: 0.85rem;
    font-weight: 800;
  }
  .link-rij {
    flex: none;
    display: flex;
    align-items: center;
    gap: 10px;
    min-height: 46px;
    padding-inline-start: 16px;
    padding-inline-end: 4px;
    border-radius: var(--vel);
    background: var(--zacht);
    color: var(--tekst-zacht);
  }
  .link {
    flex: 1;
    min-width: 0;
    margin: 0;
    color: var(--inkt);
    font-size: 0.92rem;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    user-select: all;
    direction: ltr;
    text-align: start;
  }
  @keyframes stoel-in {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
  }
  @keyframes wacht {
    50% {
      opacity: 0.5;
    }
  }
  @keyframes puntje {
    0%,
    100% {
      opacity: 0.3;
    }
    40% {
      opacity: 1;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .stoelen li,
    .stoelen li.leeg .pion-plek,
    .puntjes i {
      animation: none;
    }
  }
</style>
