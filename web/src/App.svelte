<script lang="ts">
  import { SPEL_PAD } from "./omgeving";
  import { krimp } from "./krimp";
  import "./app.css";
  import { untrack } from "svelte";
  import { Potje } from "./wasm/halma_core.js";
  import Bord3D from "./Bord3D.svelte";
  import Fout3D from "./Fout3D.svelte";
  import Online from "./Online.svelte";
  import Puzzel from "./Puzzel.svelte";
  import Prestatiebalkje from "./Prestatiebalkje.svelte";
  import Speluitleg from "./Speluitleg.svelte";
  import { TikNaarZet } from "./tiknaarzet.svelte";
  import Startmenu, { type Keuze } from "./Startmenu.svelte";
  import Steentje from "./Steentje.svelte";
  import Beurtbalk from "./Beurtbalk.svelte";
  import Icoon from "./Icoon.svelte";
  import Podium from "./Podium.svelte";
  import FeestTafel from "./FeestTafel.svelte";
  import Laadtafel from "./Laadtafel.svelte";
  import { bord3dGebouwd, bordWarm, heeftWebgl2 } from "./bord3d";
  import { BOUW_MELDING, drieFout } from "./drie.svelte";
  import type { Vakken } from "./Voorwerpen.svelte";
  import { kolomStijl, medailleStijl, platenStijl } from "./voorwerpen-lijsten";
  import { isBreed } from "./breed.svelte";
  import { vraagBeoordelingNaWinst } from "./beoordeling";
  import { meld, meldBeweging } from "./geluid";
  import { merkBestaandeSpeler } from "./leren";
  import { t } from "./taal.svelte";
  import { beurtTekst, potjeTafel } from "./potjetafel";
  import { bewaarPotjeId, codeUitPad, leesPotjeId, leesSpeler, potjeIdUitPad } from "./online";
  import {
    COMPUTER_PAUZE_MS,
    beweging as beweging_van,
    bewegingDuur,
    spelerNaam,
    type Beweging,
    type Niveau,
    type Vorm,
  } from "./spelers";

  // Online met vrienden: via de knop, doordat de Speler een Uitnodiging opende,
  // of doordat de Speler na verversen nog in een online Potje zit.
  const uitnodigingCode = codeUitPad(location.pathname);
  // Een Melding wijst naar /potje/<id>: onthoud dat Potje, dan opent Online het zoals na verversen.
  const meldingPotje = potjeIdUitPad(location.pathname);
  if (meldingPotje !== null) {
    bewaarPotjeId(meldingPotje);
    history.replaceState(null, "", SPEL_PAD);
  }
  // Wie al een Spelersnaam had, krijgt de vraag "Learn to play?" nooit (taak 157).
  merkBestaandeSpeler();
  // Er is alleen de 3D-tafel (feature 251). Zonder tafel het foutscherm, om een van drie redenen:
  // - `build`: de WebAssembly van het 3D-bord zit niet in deze build. Geen geval voor Spelers: de console zegt het.
  // - `toestel`: dit toestel heeft geen WebGL2. Opnieuw proberen helpt niet: een zin zonder knop.
  // - `fout`: Bevy viel om (laden mislukt, of na `GEDULD_MS` nog niets getekend, `drieFout`): "Try again".
  const gebouwd = bord3dGebouwd();
  if (!gebouwd) console.error(BOUW_MELDING);
  const toestel3d = heeftWebgl2();
  const geen3d = $derived<"build" | "toestel" | "fout" | null>(!gebouwd ? "build" : !toestel3d ? "toestel" : drieFout.mislukt ? "fout" : null);
  const beginOnline = uitnodigingCode !== null || (leesSpeler() !== null && leesPotjeId() !== null);
  let online = $state(beginOnline);
  // De Dagelijkse puzzel (taak 152).
  let puzzel = $state(false);
  // De Speluitleg (taak 156).
  let uitleg = $state(false);
  // Online opent bij Mijn potjes, of meteen bij de Ranglijst (de trofee in het hoofdmenu).
  let onlineBegin = $state<"mijn" | "ranglijst" | "snel" | "stats" | "vrienden">("mijn");
  let gespeeldeVorm = $state<Vorm>("ster");
  // De keuze van het laatste Potje: "New game" begint daar weer.
  let laatsteKeuze = $state.raw<Keuze | null>(null);
  let potje = $state.raw<Potje | null>(null);
  // Telt mee bij elke wijziging, want het Potje zelf zit in WebAssembly.
  let versie = $state(0);
  let beweging = $state<Beweging | null>(null);
  let vraagOpgeven = $state(false);
  // De gekozen steen en de Sprongketen, en wat een tik doet (tiknaarzet.svelte.ts). Een tik doet niets na afloop of
  // tijdens de beurt van een Computerspeler. Bij een Sprong gaat de steen al Sprong voor Sprong.
  const invoer = new TikNaarZet({
    regels: () => potje,
    stand: () => echteStand,
    eigen: () => aanDeBeurt,
    mag: () => potje !== null && !afgelopen && !computerBeurt,
    zet: (van, naar, alGetoond) => voerZetUit(van, naar, alGetoond),
    sprong: (van, naar) => (beweging = beweging_van(gespeeldeVorm, plekken, stand, van, naar)),
    kies: () => (beweging = null),
  });

  // Het niveau per Speler van het lopende Potje; null is een mens.
  let niveaus = $state.raw<(Niveau | null)[]>([]);

  const plekken = $derived(potje ? Array.from(potje.vak_plekken()) : []);
  const echteStand = $derived.by(() => {
    versie;
    return potje ? Array.from(potje.stand()) : [];
  });
  // Wat de Speler ziet: na een Sprong staat de steen al op zijn nieuwe vak.
  const stand = $derived(invoer.toon(echteStand));
  const aanDeBeurt = $derived.by(() => {
    versie;
    return potje ? potje.aan_de_beurt() : 0;
  });
  const afgelopen = $derived.by(() => {
    versie;
    return potje ? potje.is_afgelopen() : false;
  });
  const winnaar = $derived.by(() => {
    versie;
    return potje ? potje.winnaar() : -1;
  });
  const ranglijst = $derived.by(() => {
    versie;
    return potje && afgelopen ? Array.from(potje.ranglijst()) : [];
  });
  const doelvakken = $derived.by(() => {
    versie;
    return potje && !afgelopen ? Array.from(potje.doelvakken(aanDeBeurt)) : [];
  });

  // Het bord kijkt vanaf de kant van Speler 1 (iedereen speelt op dit toestel).
  const kijkDoel = $derived(potje ? Array.from(potje.doelvakken(0)) : []);

  // Won de winnaar met een volle doelpunt, of omdat de anderen opgaven?
  const doelBereikt = $derived.by(() => {
    versie;
    if (!potje || winnaar < 0) return false;
    return Array.from(potje.doelvakken(winnaar)).every((v) => stand[v] === winnaar);
  });

  // Het Potje waarvan de winst al klonk (één keer per Potje).
  let winstPotje: unknown = null;
  const isComputer = (speler: number) => niveaus[speler] != null;
  // Won een mens (geen Computerspeler): vraag eenmalig om een beoordeling (alleen iPhone-app).
  $effect(() => {
    if (afgelopen && winnaar >= 0 && !isComputer(winnaar)) {
      vraagBeoordelingNaWinst();
      if (winstPotje !== potje) {
        winstPotje = potje;
        untrack(() => setTimeout(() => meld({ soort: "winst" }), bewegingDuur(beweging)));
      }
    }
  });
  const computerBeurt = $derived(!afgelopen && potje !== null && isComputer(aanDeBeurt));

  // Het Potje als tafel (taak 179): naamplaten, de jade aanwijzer en het blad met Menu, Resign en Done.
  const tafel = $derived.by(() => {
    if (!potje) return null;
    const aantal = niveaus.length;
    const jij = !afgelopen && !computerBeurt;
    return potjeTafel({
      spelers: Array.from({ length: aantal }, (_, s) => ({ speler: s, naam: spelerNaam(s, isComputer(s)) })),
      // Taak 240: ook in dit Potje een weg terug (Menu, naar het Startmenu), niet alleen Resign.
      knoppen: ["menu", "opgeven", "klaar"],
      // Breed scherm (taak 236): het bord links, naamplaten en knoppen als kolom rechts.
      breed: isBreed() ? { vierkant: gespeeldeVorm === "vierkant", chat: false } : undefined,
      beurt: beurtTekst({ afgelopen, jij, naam: spelerNaam(aanDeBeurt, computerBeurt), aantal, yourTurn: t("common.yourTurn"), gameOver: t("common.gameOver"), thinking: t("game.thinking") }),
      aan: afgelopen ? null : aanDeBeurt,
      naam: t("menu.nav"),
      knoppenLijst: [
        { id: "menu", tekst: t("menu.nav"), label: t("game.backToMenu"), doe: naarMenu },
        { id: "opgeven", tekst: t("game.resign"), uit: afgelopen || computerBeurt, doe: () => (vraagOpgeven = true) },
        { id: "klaar", tekst: t("game.done"), uit: !invoer.keten, doe: () => invoer.klaar() },
      ],
    });
  });

  function metVrienden(begin: "mijn" | "ranglijst" | "snel" | "stats" | "vrienden" = "mijn") {
    onlineBegin = begin;
    online = true;
  }

  function naarStart() {
    online = false;
    if (location.pathname !== SPEL_PAD) history.replaceState(null, "", SPEL_PAD);
  }

  function start(keuze: Keuze) {
    potje?.free();
    potje = keuze.vorm === "vierkant" ? Potje.vierkant(keuze.aantal) : new Potje(keuze.aantal);
    gespeeldeVorm = keuze.vorm;
    laatsteKeuze = keuze;
    niveaus = keuze.niveaus;
    invoer.wis();
    beweging = null;
    vraagOpgeven = false;
    versie++;
  }

  // Het winstscherm als 3D-tafel (taak 180); tot de tafel klaar is de laadtafel.
  let tafelKlaar = $state(false);
  let tafelVakken = $state<Vakken>({});
  // Het eindbord stond al in beeld (het Potje zelf is een tafel): dan blijft dat staan tot de platen er zijn. Anders de laadtafel.
  const feestWarm = $derived(afgelopen && untrack(() => bordWarm(gespeeldeVorm === "vierkant")));
  /** Het winstscherm wacht op zijn tafel (taak 224). */
  const feestLaadt = $derived(!tafelKlaar && !feestWarm);

  function nieuwPotje() {
    potje?.free();
    potje = null;
    invoer.wis();
    beweging = null;
    vraagOpgeven = false;
  }

  /** Van het Potje naar het startmenu (op het hoofdmenu, niet bij de keuze van de Computer). */
  function naarMenu() {
    laatsteKeuze = null;
    nieuwPotje();
  }

  function voerZetUit(van: number, vak: number, alGetoond = false) {
    if (!potje) return;
    // Het pad komt uit de stand vóór de Zet. Een keten is al Sprong voor Sprong getoond.
    const pad = alGetoond ? beweging : beweging_van(gespeeldeVorm, plekken, echteStand, van, vak);
    const computer = computerBeurt;
    potje.zet(van, vak);
    if (!alGetoond) meldBeweging(pad, { tegenstander: computer });
    beweging = pad;
    invoer.wis();
    versie++;
  }

  // Een Computerspeler zet zelf, na een korte pauze (en nadat de vorige steen is geland).
  $effect(() => {
    versie;
    const pauze = COMPUTER_PAUZE_MS + bewegingDuur(untrack(() => beweging));
    if (!computerBeurt || !potje) return;
    const huidig = potje;
    const t = setTimeout(() => {
      try {
        const [van, naar] = Array.from(huidig.computer_zet(niveaus[huidig.aan_de_beurt()] as number));
        voerZetUit(van, naar);
      } catch {
        // Geen Zet te kiezen: de beurt blijft staan.
      }
    }, pauze);
    return () => clearTimeout(t);
  });

  function geefOp() {
    if (!potje || computerBeurt) return;
    potje.geef_op(aanDeBeurt);
    vraagOpgeven = false;
    invoer.wis();
    beweging = null;
    versie++;
  }
</script>

<main class:spel={potje !== null}>
  {#if geen3d}
    <Fout3D reden={geen3d} />
  {:else if online}
    <Online code={uitnodigingCode} begin={onlineBegin}
      terug={naarStart}
      speluitleg={() => {
        online = false;
        uitleg = true;
      }}
    />
  {:else if puzzel}
    <Puzzel terug={() => (puzzel = false)} />
  {:else if uitleg}
    <Speluitleg
      terug={() => (uitleg = false)}
      speel={() => {
        uitleg = false;
        start({ vorm: "ster", aantal: 2, niveaus: [null, 0], computer: true });
      }}
    />
  {:else if potje === null}
    <Startmenu {start} online={metVrienden} puzzel={() => (puzzel = true)} speluitleg={() => (uitleg = true)} vorige={laatsteKeuze} />
  {:else}
    <Beurtbalk
      spelers={Array.from({ length: niveaus.length }, (_, s) => ({ speler: s, naam: spelerNaam(s, isComputer(s)) }))}
      aan={afgelopen ? null : aanDeBeurt}
      naam={afgelopen ? t("common.gameOver") : spelerNaam(aanDeBeurt, computerBeurt)}
      denkt={computerBeurt}
      jij={!afgelopen && !computerBeurt}
    />

    <Bord3D
      vorm={gespeeldeVorm}
      {plekken}
      {stand}
      {aanDeBeurt}
      gekozen={invoer.getoond}
      {doelvakken}
      {kijkDoel}
      {beweging}
      {...invoer.bord}
      {tafel}
    />

    {#if vraagOpgeven}
      <div class="doek">
        <div class="kaart" role="dialog" aria-modal="true" aria-labelledby="opgeven-titel">
          <span class="teken" aria-hidden="true"><Icoon naam="vlag" maat={26} /></span>
          <h2 id="opgeven-titel">{t("game.resignName", { name: spelerNaam(aanDeBeurt) })}</h2>
          <p>{t("game.resignTheirs")}</p>
          <div class="knoppen">
            <button class="knop-lijn" onclick={() => (vraagOpgeven = false)}>{t("game.keepPlaying")}</button>
            <button class="knop-licht" onclick={geefOp}>{t("game.yesResign")}</button>
          </div>
        </div>
      </div>
    {/if}

    {#if afgelopen}
      <div class="feest tafel" role="dialog" aria-modal="true" aria-labelledby="einde-titel">
        <Laadtafel aan={feestLaadt} />
        <FeestTafel
          {stand}
          vierkant={gespeeldeVorm === "vierkant"}
          hoofd={{ id: "nieuwPotje", tekst: t("common.newGame"), doe: nieuwPotje }}
          metLijst={ranglijst.length > 2}
          klaar={() => (tafelKlaar = true)}
          bind:vakken={tafelVakken}
        />
        {#if tafelKlaar}
        {#if winnaar >= 0}
          <div class="medaille vast" style={medailleStijl(tafelVakken, isBreed())}><Podium speler={winnaar} /></div>
          <div class="uitslag vast" {@attach krimp(0.45, true)} style={isBreed() ? kolomStijl(tafelVakken.uitslag, 0.08, 0.08) : platenStijl(tafelVakken.uitslag, 0.04, 0.08, 0.08)}>
            <h2 id="einde-titel" class="titel-groot">{t("game.wins", { name: spelerNaam(winnaar, isComputer(winnaar)) })}</h2>
            {#if !doelBereikt}<p class="onderschrift">{t("game.othersResigned")}</p>{/if}
          </div>
        {:else}
          <div class="podium-leeg"></div>
          <div class="uitslag vast" {@attach krimp(0.45, true)} style={isBreed() ? kolomStijl(tafelVakken.uitslag, 0.08, 0.08) : platenStijl(tafelVakken.uitslag, 0.04, 0.08, 0.08)}>
            <h2 id="einde-titel" class="titel-groot">{t("common.gameOver")}</h2>
          </div>
        {/if}
        {/if}
        {#if tafelKlaar && ranglijst.length > 2}
        <div class="blad plaat" class:breed-tekst={isBreed()} style={isBreed() ? kolomStijl(tafelVakken.lijst, 0.06, 0.06) : platenStijl(tafelVakken.lijst, 0.05, 0.06, 0.06)}>
          <ol class="rang">
            {#each ranglijst as s (s)}
              <li><span class="schijf mini"><Steentje speler={s} maat={20} /></span>{spelerNaam(s, isComputer(s))}</li>
            {/each}
          </ol>
        </div>
        {/if}
      </div>
    {/if}
  {/if}
</main>
<Prestatiebalkje />
