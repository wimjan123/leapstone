<script lang="ts" module>
  import type { Niveau, Vorm } from "./spelers";
  /**
   * Wat de Speler koos voor een Potje op deze telefoon. `niveaus`: per plek null (mens) of een niveau.
   * `computer`: gekozen via "Computer" in het menu (een nieuw Potje begint dan weer daar).
   */
  export type Keuze = { vorm: Vorm; aantal: number; niveaus: (Niveau | null)[]; computer?: boolean };

  // De tafel stond al eens in beeld: dan geen laadtafel meer ertussen.
  let tafelGezien = false;
</script>

<script lang="ts">
  import AppKnop from "./AppKnop.svelte";
  import { untrack } from "svelte";
  import Laadtafel from "./Laadtafel.svelte";
  import { geluidAan, zetGeluid } from "./geluid";
  import { trillenAan, zetTrillen } from "./trillen";
  import { binnen } from "./overgang";
  import { t } from "./taal.svelte";
  import Voorwerpen, { type TafelKnop, type Vakken } from "./Voorwerpen.svelte";
  import { BREED, startmenu, type Voorwerp } from "./voorwerpen";
  import { toonAppKnop } from "./appknop";
  import { bordKeuze, breedKeuze, computerKeuze, plekKleur, spelersKeuze, TOON_SPELERS } from "./keuzetafel";
  import { tafelStand } from "./voorwerpen-lijsten";
  import { AANTALLEN, AANTALLEN_VIERKANT, NIVEAUS, tegenstanders } from "./spelers";
  import { huidigeTaal, tn, type Sleutel } from "./taal.svelte";
  import { Potje } from "./wasm/halma_core.js";

  // Het hoofdmenu en de korte weg naar een Potje op deze telefoon: eerst het bord, dan de spelers.
  // Of tegen de computer: bord, aantal Computerspelers en niveau op één scherm.
  // `vorige`: de keuze van het vorige Potje; dan begint hij meteen bij de spelers (of de computer).
  let {
    start,
    online,
    puzzel,
    speluitleg,
    vorige = null,
  }: {
    start: (keuze: Keuze) => void;
    online: (begin: "mijn" | "ranglijst" | "snel" | "stats" | "vrienden") => void;
    puzzel?: () => void;
    speluitleg?: () => void;
    vorige?: Keuze | null;
  } = $props();

  type Stap = "menu" | "bord" | "spelers" | "computer";
  const eerder = untrack(() => vorige);
  let stap = $state<Stap>(eerder ? (eerder.computer ? "computer" : "spelers") : "menu");
  let richting = $state(1);
  let vorm = $state<Vorm>(eerder?.vorm ?? "ster");
  let aantal = $state(eerder?.aantal ?? 2);
  let niveaus = $state<(Niveau | null)[]>(eerder ? [...eerder.niveaus, ...Array(6).fill(null)].slice(0, 6) : Array(6).fill(null));
  // Tegen de computer: standaard één tegenstander op normaal; jij bent plek 1.
  let tegen = $state(eerder?.computer ? eerder.aantal - 1 : 1);
  let niveau = $state<Niveau>(eerder?.computer ? (eerder.niveaus[1] ?? 1) : 1);

  // Sound: standaard aan, onthouden op dit toestel.
  let geluid = $state(geluidAan());
  function wisselGeluid() {
    geluid = !geluid;
    zetGeluid(geluid);
  }

  // Vibration: standaard aan, los van Sound, onthouden op dit toestel (taak 159).
  let trillen = $state(trillenAan());
  function wisselTrillen() {
    trillen = !trillen;
    zetTrillen(trillen);
  }

  // Bord kiezen: het bord waar een vinger op staat, dat de tafel toont (anders het gekozen bord).
  let wijsBord = $state<Vorm | null>(null);

  function ga(naar: Stap, r = 1) {
    richting = r;
    stap = naar;
    wijsBord = null;
  }

  function begin() {
    start({ vorm, aantal, niveaus: niveaus.slice(0, aantal) });
  }

  function tegenComputer() {
    start({ vorm, aantal: tegen + 1, niveaus: [null, ...Array<Niveau>(tegen).fill(niveau)], computer: true });
  }

  // Het Startmenu als 3D-tafel (taak 178, uiterlijk 1b): het bord met de Stenen van zes Spelers, en elke knop een voorwerp met
  // een onzichtbare HTML-knop erboven. De eerste keer staat de laadtafel er tot de
  // tafel klaar is, ook op de keuzeschermen.
  let tafelKlaar = $state(false);
  const alGezien = tafelGezien;
  function tafelStaat() {
    tafelKlaar = true;
    tafelGezien = true;
  }
  let vakken = $state<Vakken>({});
  // Zes Spelers in hun beginstand, zoals in 1b: rood onderaan, dan met de klok mee blauw, groen, geel, paars en grafiet. Bevy
  // kijkt vanaf de kant van het derde startvak; schuif de kleuren twee plekken op. Alleen het beeld: het is geen Potje.
  const beginStand = (() => {
    const p = new Potje(6);
    const stand = Array.from(p.stand(), (s) => (s < 0 ? s : (s + 4) % 6));
    p.free();
    return stand;
  })();
  const tafelKnoppen = $derived<TafelKnop[]>([
    { id: "online", tekst: t("menu.play"), label: t("common.playOnline"), doe: () => online("snel") },
    { id: "spelen", tekst: t("menu.onThisPhone"), label: t("menu.playPhone"), doe: () => ga("bord") },
    { id: "computer", tekst: t("common.computer"), label: t("menu.playComputer"), doe: () => ga("computer") },
    { id: "vrienden", tekst: t("menu.friends"), label: t("menu.playFriends"), doe: () => online("vrienden") },
    { id: "puzzel", tekst: t("puzzle.title"), doe: () => puzzel?.() },
    { id: "uitleg", tekst: t("learn.title"), doe: () => speluitleg?.() },
    { id: "ranglijst", tekst: t("common.leaderboard"), doe: () => online("ranglijst") },
    { id: "stats", tekst: t("stats.title"), doe: () => online("stats") },
    { id: "lade", deel: 0, tekst: t("sound.label"), aan: geluid, doe: wisselGeluid },
    { id: "lade", deel: 1, tekst: t("vibration.label"), aan: trillen, doe: wisselTrillen },
    { id: "potjes", tekst: t("common.myGames"), doe: () => online("mijn") },
  ]);
  // De winkelknoppen (App Store en Google Play, alleen in de browser) liggen op de tafel vlak naast de lade (taak 206: niet meer midden in de lege rest).
  const appKnop = toonAppKnop();
  const appPlek = $derived.by(() => {
    const lade = vakken.lade;
    if (!lade) return "";
    const rtl = document.documentElement.dir === "rtl";
    const LUCHT = 10; // tussen de lade en de knoppen (taak 267: twee knoppen onder elkaar op een computer)
    const breedte = Math.min(170, (rtl ? lade.links : window.innerWidth - lade.rechts) - 12 - LUCHT); // niet tegen de rand van het scherm
    const links = rtl ? lade.links - breedte - LUCHT : lade.rechts + LUCHT;
    if (breedte < 100) return "display:none"; // kleiner wordt de badge onleesbaar
    return `left:${links}px;width:${breedte}px;top:${lade.boven}px;height:${lade.onder - lade.boven}px`;
  });
  // Een breed scherm (een computer, een tablet liggend): het bord links, de knoppen als kolom rechts (taak 206, William).
  let breed = $state(false);
  $effect(() => {
    let mq: MediaQueryList;
    try {
      mq = matchMedia(BREED);
    } catch {
      return; // Geen matchMedia (tests): de opstelling van de telefoon.
    }
    const zet = () => (breed = mq.matches);
    zet();
    mq.addEventListener?.("change", zet);
    return () => mq.removeEventListener?.("change", zet);
  });

  // De keuzeschermen voor een nieuw Potje (taak 188): bord, Spelers en Computer zijn dezelfde tafel als het menu, met het echte
  // lakbord en de keuzes als voorwerpen. De tafel blijft staan als de stap wisselt; alleen de voorwerpen en de Stenen veranderen.
  const NIVEAU_WOORD: Sleutel[] = ["level.easy", "level.normal", "level.hard"];
  const niveauWoord = (n: number) => t(NIVEAU_WOORD[n]);
  const plekNaam = (n: Niveau | null) => (n === null ? t("seat.player") : t("seat.computer", { level: niveauWoord(n).toLocaleLowerCase(huidigeTaal()) }));
  const aantalMogelijk = $derived<readonly number[]>(vorm === "vierkant" ? AANTALLEN_VIERKANT : AANTALLEN);
  const tegenMogelijk = $derived(tegenstanders(vorm));
  // Op het Vierkant bord kan het niet met 3 of 6 Spelers, of met 2 of 5 Computers: dan het dichtstbijzijnde dat wel kan.
  $effect.pre(() => {
    if (!aantalMogelijk.includes(aantal)) aantal = 2;
    if (!tegenMogelijk.includes(tegen)) tegen = [...tegenMogelijk].reverse().find((n) => n < tegen) ?? tegenMogelijk[0];
  });
  function wisselPlek(plek: number) {
    const n = niveaus[plek];
    niveaus[plek] = n === null ? 0 : n === 2 ? null : ((n + 1) as Niveau);
  }

  type Tafel = { lijst: readonly Voorwerp[]; knoppen: TafelKnop[]; stand: readonly number[]; vierkant: boolean; naam: string };
  const tafel = $derived.by<Tafel>(() => {
    const terug = (naar: Stap): TafelKnop => ({ id: "terug", tekst: t("common.back"), label: t("common.back"), doe: () => ga(naar, -1) });
    const startKnop = (doe: () => void): TafelKnop => ({ id: "start", tekst: t("common.start"), label: t("menu.startGame"), doe });
    const namen = { ster: t("board.star"), vierkant: t("board.square") };
    if (stap === "bord") {
      const getoond = wijsBord ?? vorm;
      return {
        lijst: breedKeuze(bordKeuze(namen), breed, true),
        knoppen: [
          terug("menu"),
          { id: "ster", tekst: namen.ster, wijs: () => (wijsBord = "ster"), doe: () => { vorm = "ster"; ga("spelers"); } },
          { id: "vierkant", tekst: namen.vierkant, wijs: () => (wijsBord = "vierkant"), doe: () => { vorm = "vierkant"; ga("spelers"); } },
        ],
        stand: getoond === "vierkant" ? tafelStand(TOON_SPELERS.vierkant, true) : beginStand,
        vierkant: getoond === "vierkant",
        naam: t("menu.chooseBoard"),
      };
    }
    if (stap === "spelers") {
      const plekken = Array.from({ length: aantal }, (_, i) => {
        const n = niveaus[i];
        return { speler: plekKleur(i, aantal), tekst: n === null ? t("seat.player") : t("common.computer"), onder: n === null ? undefined : niveauWoord(n) };
      });
      return {
        lijst: breedKeuze(spelersKeuze({ plekken, aantallen: aantalMogelijk, aantal, vierkant: vorm === "vierkant" }), breed, vorm === "vierkant"),
        knoppen: [
          terug("bord"),
          ...plekken.map((p, i): TafelKnop => ({ id: `plek${i}`, tekst: [p.tekst, p.onder].filter(Boolean).join(" "), label: t("seat.label", { n: i + 1, who: plekNaam(niveaus[i]) }), doe: () => wisselPlek(i) })),
          ...aantalMogelijk.map((a): TafelKnop => ({ id: `aantal${a}`, tekst: String(a), label: tn("players.count", a), keuze: a === aantal, doe: () => (aantal = a) })),
          startKnop(begin),
        ],
        stand: tafelStand(aantal, vorm === "vierkant"),
        vierkant: vorm === "vierkant",
        naam: t("menu.choosePlayers"),
      };
    }
    if (stap === "computer") {
      return {
        lijst: breedKeuze(computerKeuze({ namen, vorm, tegenstanders: tegenMogelijk, tegen, niveaus: NIVEAU_WOORD.map((_, i) => niveauWoord(i)), niveau }), breed, true),
        knoppen: [
          terug("menu"),
          { id: "ster", tekst: namen.ster, keuze: vorm === "ster", doe: () => (vorm = "ster") },
          { id: "vierkant", tekst: namen.vierkant, keuze: vorm === "vierkant", doe: () => (vorm = "vierkant") },
          ...tegenMogelijk.map((a): TafelKnop => ({ id: `tegen${a}`, tekst: String(a), label: tn("computers.count", a), keuze: a === tegen, doe: () => (tegen = a) })),
          ...NIVEAUS.map((nv): TafelKnop => ({ id: `niveau${nv.niveau}`, tekst: niveauWoord(nv.niveau), keuze: nv.niveau === niveau, doe: () => (niveau = nv.niveau) })),
          startKnop(tegenComputer),
        ],
        stand: tafelStand(tegen + 1, vorm === "vierkant"),
        vierkant: vorm === "vierkant",
        naam: t("common.computer"),
      };
    }
    // De lade toont of Sound en Vibration aan staan (taak 206): alleen dat plaatje wordt dan opnieuw gebakken.
    const lijst = startmenu({ appKnop, breed }).map((v) => (v.id === "lade" && v.plaat ? { ...v, plaat: { ...v.plaat, aan: [geluid, trillen] } } : v));
    return { lijst, knoppen: tafelKnoppen, stand: beginStand, vierkant: false, naam: t("menu.nav") };
  });
  /** De eerste keer wacht de Speler op de laadtafel tot de tafel klaar is (taak 223): geen plat menu ertussen. */
  const laadt = $derived(!tafelKlaar && !alGezien);
</script>

<Laadtafel aan={laadt} />

<Voorwerpen
  voorwerpen={tafel.lijst}
  knoppen={tafel.knoppen}
  stand={tafel.stand}
  vierkant={tafel.vierkant}
  naam={tafel.naam}
  klaar={tafelStaat}
  bind:vakken
/>
{#if stap === "menu" && tafelKlaar}
  <div class="app-tafel" style={appPlek}><AppKnop /></div>
{/if}

{#key stap}
  <!-- De tafel in 3D: alles staat in Bevy, de knoppen liggen erboven (Voorwerpen.svelte). Het menu is eerst de laadtafel. -->
  <section class="scherm stap-{stap}" in:binnen={{ richting }}>
    {#if stap !== "menu"}<h2 class="sr-only">{tafel.naam}</h2>{/if}
  </section>
{/key}

<style>
  .app-tafel {
    position: fixed;
    z-index: 1;
    display: grid;
    place-items: center;
  }
  .app-tafel:empty {
    display: none;
  }
</style>
