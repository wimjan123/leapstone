<script lang="ts">
  import { onDestroy, onMount, untrack } from "svelte";
  import { krimp } from "./krimp";
  import { Potje } from "./wasm/halma_core.js";
  import Bord3D from "./Bord3D.svelte";
  import Chat from "./Chat.svelte";
  import Meldingen from "./Meldingen.svelte";
  import { TikNaarZet } from "./tiknaarzet.svelte";
  import Steentje from "./Steentje.svelte";
  import Beurtbalk from "./Beurtbalk.svelte";
  import Icoon from "./Icoon.svelte";
  import Podium from "./Podium.svelte";
  import FeestTafel from "./FeestTafel.svelte";
  import Laadtafel from "./Laadtafel.svelte";
  import { bordWarm } from "./bord3d";
  import type { Vakken } from "./Voorwerpen.svelte";
  import type { Vak } from "./voorwerpen";
  import { kolomStijl, medailleStijl, platenStijl } from "./voorwerpen-lijsten";
  import { isBreed } from "./breed.svelte";
  import { vraagBeoordelingNaWinst } from "./beoordeling";
  import { meld, meldBeweging } from "./geluid";
  import { beurtTekst, potjeTafel, tijdOpJade } from "./potjetafel";
  import { haalRanglijst, type Bericht, type Stand } from "./online";
  import { beweging as bewegingVan, bewegingDuur, type Beweging } from "./spelers";
  import { lokaleDeadline } from "./denktijd";
  import { meldNieuwePrestaties, neemBasis } from "./prestaties";
  import { t } from "./taal.svelte";

  // Een online Potje. Het bord toont alleen wat de server zegt; het lokale Potje in WebAssembly
  // dient alleen om een poging meteen terug te laten rollen als hij zeker niet mag (en voor
  // Sprongketens). Er licht nooit een vak op. De server keurt elke Zet goed.
  let {
    stand,
    ikId,
    sleutel,
    beweging,
    verbonden,
    berichten,
    stuurBericht,
    melding,
    zet,
    geefOp,
    klaar,
    mijnPotjes,
    opnieuw,
  }: {
    stand: Stand;
    ikId: number;
    sleutel: string;
    beweging: Beweging | null;
    verbonden: boolean;
    berichten: Bericht[];
    stuurBericht: (tekst: string) => Promise<void>;
    melding: string;
    zet: (van: number, naar: number) => Promise<void>;
    geefOp: () => Promise<void>;
    klaar: () => void;
    mijnPotjes: () => void;
    /** Alleen in een Snel potje (Play online): meteen opnieuw zoeken. */
    opnieuw?: () => void;
  } = $props();

  // Een eigen keten is al getoond: de beweging van de stand met versie `stilBij` blijft weg.
  let stilBij = $state(-1);
  let eigenBeweging = $state<Beweging | null>(null);
  let bezig = $state(false);
  let vraagOpgeven = $state(false);
  // De gekozen steen en de Sprongketen, en wat een tik doet (tiknaarzet.svelte.ts). Midden in een Sprongketen gaat de Zet
  // pas naar de server als de beurt eindigt. Een tik doet niets buiten de eigen beurt of terwijl een Zet onderweg is.
  // Het lokale Potje laat een poging alleen meteen terugrollen als hij zeker niet mag; een Zet die mag, gaat naar de server.
  const invoer = new TikNaarZet({
    regels: () => potje,
    stand: () => serverVakken,
    eigen: () => aanDeBeurt,
    mag: () => mijnBeurt && !bezig,
    zet: (van, naar, alGetoond) => void stuurZet(van, naar, alGetoond),
    sprong: (van, naar) => (eigenBeweging = bewegingVan(vorm, plekken, vakken, van, naar)),
  });

  const vorm = $derived(stand.bord);
  const serverVakken = $derived(stand.stand.map((v) => v - 1));
  // Na een Sprong staat de steen al op zijn nieuwe vak; de server weet nog van niets.
  const vakken = $derived(invoer.toon(serverVakken));
  const mijnPlek = $derived(stand.spelers.find((s) => s.speler_id === ikId)?.plek ?? 0);
  const mijnStatus = $derived(stand.spelers.find((s) => s.speler_id === ikId)?.status);
  const mijnBeurt = $derived(!stand.afgelopen && mijnPlek !== 0 && stand.aan_de_beurt === mijnPlek);
  const aanDeBeurt = $derived(Math.max(0, (stand.aan_de_beurt ?? stand.winnaar ?? 1) - 1));
  const naamVan = (plek: number) => stand.spelers.find((s) => s.plek === plek)?.spelersnaam ?? t("player.n", { n: plek });

  let vorige: Potje | null = null;
  const potje = $derived.by(() => {
    vorige?.free();
    vorige = null;
    try {
      vorige = Potje.van_stand(stand.bord === "vierkant", stand.aantal_spelers, Int32Array.from(serverVakken), aanDeBeurt);
    } catch {
      // Een stand die niet past: geen markeringen, de server blijft beslissen.
    }
    return vorige;
  });
  onDestroy(() => vorige?.free());

  const plekken = $derived(potje ? Array.from(potje.vak_plekken()) : []);
  // De beweging van een eigen Sprong, anders die van de server (tenzij de keten al getoond is).
  const getoondeBeweging = $derived(invoer.keten || stilBij === stand.versie ? eigenBeweging : beweging);
  const doelvakken = $derived(potje && !stand.afgelopen ? Array.from(potje.doelvakken(aanDeBeurt)) : []);
  // Het bord kijkt vanaf de eigen kant: het eigen doel ligt bovenaan. Toeschouwers kijken als Speler 1.
  const kijkDoel = $derived(potje ? Array.from(potje.doelvakken(Math.max(0, mijnPlek - 1))) : []);

  // Een nieuwe stand wist een keuze die niet meer klopt. Dezelfde stand nog eens (na herverbinden) laat hem staan,
  // anders valt een Steen die de Speler net sleept zonder Zet terug.
  const versie = $derived(stand.versie);
  $effect(() => {
    versie;
    invoer.wis();
  });

  /** Stuur de hele Zet naar de server. De server beslist; bij een afwijzing staat het bord weer zoals de server het kent. */
  async function stuurZet(van: number, naar: number, alGetoond: boolean) {
    const voor = stand.versie;
    if (alGetoond) stilBij = voor + 1;
    bezig = true;
    try {
      await zet(van, naar);
    } finally {
      bezig = false;
      invoer.wis();
      if (stand.versie === voor) stilBij = -1;
    }
  }

  async function bevestigOpgeven() {
    vraagOpgeven = false;
    bezig = true;
    try {
      await geefOp();
    } finally {
      bezig = false;
    }
  }

  // De deadline van de server in de klok van deze telefoon, uitgerekend als de stand binnenkomt.
  const deadline = $derived(stand.afgelopen ? null : lokaleDeadline(stand.deadline_ms ?? null, stand.server_tijd_ms, Date.now()));

  // Een beurt die de server net oversloeg (niet een oude bij het openen van het Potje).
  let overgeslagen = $state<{ speler: number; sleutel: number } | null>(null);
  let gezienVersie: number | null = null;
  $effect.pre(() => {
    const z = stand.laatste_zet;
    if (gezienVersie !== null && stand.versie > gezienVersie && z?.soort === "overgeslagen") {
      overgeslagen = { speler: z.plek - 1, sleutel: stand.versie };
    }
    if (gezienVersie === null || stand.versie > gezienVersie) gezienVersie = stand.versie;
  });

  // Snel potje: de tegenstander met zijn Rating, en na afloop jouw Rating-wijziging en je plek op de Ranglijst.
  const tegenstander = $derived(stand.snel && stand.aantal_spelers === 2 ? stand.spelers.find((s) => s.speler_id !== ikId) : undefined);
  // Het Potje als tafel (taak 179): naamplaten met Steen, naam en Rating, de jade aanwijzer met de beurt en de Denktijd, en het blad
  // met My games, Resign en Done. De Denktijd loopt in hele seconden: het plaatje van de aanwijzer wisselt dan maar eens per seconde.
  let nu = $state(Date.now());
  const telt = $derived(deadline !== null && stand.denktijd_s != null && !stand.afgelopen);
  $effect(() => {
    if (!telt) return;
    nu = Date.now();
    const klokje = setInterval(() => (nu = Date.now()), 1000);
    return () => clearInterval(klokje);
  });
  const breed = $derived(isBreed());
  /** Breed scherm: waar de plaat van de Chat naast het bord ligt (de Chat ligt er altijd open op). */
  let chatVak = $state<Vak | undefined>();
  const tafel = $derived.by(() => {
    if (!potje) return null;
    const aantal = stand.aantal_spelers;
    const t3 = potjeTafel({
      spelers: Array.from({ length: aantal }, (_, i) => ({
        speler: i,
        naam: naamVan(i + 1),
        rating: tegenstander?.plek === i + 1 && tegenstander.rating !== undefined ? String(tegenstander.rating) : undefined,
      })),
      knoppen: ["potjes", "opgeven", "klaar"],
      beurt: beurtTekst({
        afgelopen: stand.afgelopen,
        jij: mijnBeurt,
        naam: naamVan(stand.aan_de_beurt ?? 0),
        aantal,
        yourTurn: t("common.yourTurn"),
        gameOver: t("common.gameOver"),
        thinking: t("game.thinking"),
      }),
      tijd: tijdOpJade(deadline, stand.denktijd_s ?? null, telt && stand.aan_de_beurt != null, nu),
      zonderKom: true,
      // Breed scherm (taak 236): het bord links, naamplaten, de Chat en de knoppen als kolom rechts.
      breed: breed ? { vierkant: vorm === "vierkant", chat: true } : undefined,
      aan: stand.afgelopen ? null : aanDeBeurt,
      naam: t("menu.nav"),
      knoppenLijst: [
        { id: "potjes", tekst: t("common.myGames"), doe: mijnPotjes },
        { id: "opgeven", tekst: t("game.resign"), uit: stand.afgelopen || mijnStatus !== "speelt" || bezig, doe: () => (vraagOpgeven = true) },
        { id: "klaar", tekst: t("game.done"), uit: !invoer.keten || bezig, doe: () => invoer.klaar() },
      ],
    });
    return { ...t3, vakken: (v: Vakken) => (chatVak = v.chat) };
  });
  const chatPlaat = $derived(breed && chatVak ? kolomStijl(chatVak, 0.05, 0.05) : null);

  const mijnVerandering = $derived(stand.spelers.find((s) => s.speler_id === ikId)?.rating_verandering);
  let ranglijstPlek = $state<number | null>(null);
  $effect(() => {
    if (!stand.afgelopen || !stand.snel) return;
    let weg = false;
    haalRanglijst(sleutel).then(
      (lijst) => {
        const i = lijst.findIndex((r) => r.speler_id === ikId);
        if (!weg && i >= 0) ranglijstPlek = i + 1;
      },
      () => {},
    );
    return () => (weg = true);
  });

  // Een Zet van de server: eigen Zetten (een keten die al klonk niet nog eens) en Zetten van tegenstanders, die zachter klinken.
  let geluidVersie = untrack(() => stand.versie);
  $effect(() => {
    const v = stand.versie;
    if (v <= geluidVersie) return;
    geluidVersie = v;
    const b = untrack(() => beweging);
    if (!b || untrack(() => stilBij) === v) return;
    const eigen = untrack(() => stand.laatste_zet?.plek === mijnPlek);
    meldBeweging(b, { tegenstander: !eigen });
  });
  // Een nieuwe Prestatie (taak 174): na mijn eigen Zet en na het einde van het Potje vraagt de app de server wat er bij kwam.
  // Bij het openen telt alles wat de server al heeft als bekend, dus ook een Potje dat al klaar was geeft geen balkje.
  onMount(() => void neemBasis(sleutel, ikId));
  let prestatieVersie = untrack(() => stand.versie);
  let prestatieAfgelopen = untrack(() => stand.afgelopen);
  $effect(() => {
    const v = stand.versie;
    const afgelopen = stand.afgelopen;
    const eigenZet = untrack(() => stand.laatste_zet?.plek === mijnPlek);
    const nieuw = v > prestatieVersie && eigenZet;
    const eindeNu = afgelopen && !prestatieAfgelopen;
    prestatieVersie = Math.max(prestatieVersie, v);
    prestatieAfgelopen = afgelopen;
    if (nieuw || eindeNu) void meldNieuwePrestaties(untrack(() => sleutel), untrack(() => ikId));
  });
  // Ik ben aan de beurt geworden terwijl de app open is: één duidelijke korte trilling, na de Zet van de tegenstander.
  // Niet bij het openen van een Potje waarin ik al aan de beurt ben.
  let wasMijnBeurt = untrack(() => mijnBeurt);
  $effect(() => {
    const nu = mijnBeurt;
    if (nu && !wasMijnBeurt) {
      const b = untrack(() => beweging);
      setTimeout(() => meld({ soort: "beurt" }), b ? bewegingDuur(b) : 0);
    }
    wasMijnBeurt = nu;
  });
  // Ik heb gewonnen: een kort vrolijk geluid.
  // Alleen als het Potje nu afloopt, niet bij het openen van een Potje dat al klaar was.
  let winstGeklonken = untrack(() => stand.afgelopen);
  $effect(() => {
    if (winstGeklonken || !stand.afgelopen) return;
    winstGeklonken = true;
    if (stand.winnaar !== null && stand.winnaar === mijnPlek) setTimeout(() => meld({ soort: "winst" }), 400);
  });
  // Ik heb gewonnen: vraag eenmalig om een beoordeling (alleen iPhone-app).
  $effect(() => {
    if (stand.afgelopen && stand.winnaar !== null && stand.winnaar === mijnPlek) vraagBeoordelingNaWinst();
  });

  // Het winstscherm als 3D-tafel (taak 180): tot de tafel klaar is, de laadtafel.
  let tafelKlaar = $state(false);
  let tafelVakken = $state<Vakken>({});
  // Het eindbord stond al in beeld (het Potje zelf is een tafel): dan blijft dat staan tot de platen er zijn. Anders de laadtafel.
  const feestWarm = $derived(stand.afgelopen && untrack(() => bordWarm(vorm === "vierkant")));
  /** Het winstscherm wacht op zijn tafel (taak 224). */
  const feestLaadt = $derived(!tafelKlaar && !feestWarm);
  const metLijst = $derived(!!mijnVerandering || stand.ranglijst.length > 2);

  const doelBereikt = $derived(stand.winnaar !== null && stand.spelers.find((s) => s.plek === stand.winnaar)?.status === "klaar");
</script>

<Beurtbalk
  spelers={Array.from({ length: stand.aantal_spelers }, (_, i) => ({
    speler: i,
    uit: stand.spelers.find((s) => s.plek === i + 1)?.status === "opgegeven",
    naam: naamVan(i + 1),
  }))}
  aan={stand.afgelopen ? null : aanDeBeurt}
  naam={stand.afgelopen ? t("common.gameOver") : mijnBeurt ? t("common.yourTurn") : naamVan(stand.aan_de_beurt ?? 0)}
  jij={mijnBeurt}
  denktijd={stand.denktijd_s ?? null}
  {deadline}
  {overgeslagen}
>
  {#snippet rechts()}
    {#if tegenstander?.rating !== undefined}
      <span class="tegen" data-testid="tegenstander">
        <span class="tegen-naam">{tegenstander.spelersnaam}</span>
        <span class="rating-pil cijfers"><span class="sr-only">{t("game.rating")} </span>{tegenstander.rating}</span>
      </span>
    {/if}
  {/snippet}
</Beurtbalk>
{#if !verbonden}
  <p class="status" role="status"><span class="puls" aria-hidden="true"></span>{t("game.connectionLost")}</p>
{:else if mijnStatus === "opgegeven" && !stand.afgelopen}
  <p class="status" role="status">{t("game.youResigned")}</p>
{:else if melding}
  <p class="status fout" role="alert">{melding}</p>
{/if}

{#if potje}
  <Bord3D
    {vorm}
    {plekken}
    stand={vakken}
    {aanDeBeurt}
    gekozen={invoer.getoond}
    {doelvakken}
    {kijkDoel}
    beweging={getoondeBeweging}
    {...invoer.bord}
    speelbaar={mijnBeurt}
    {tafel}
  />
{/if}

{#if chatPlaat !== null}
  <!-- Breed scherm (taak 236): de Chat ligt open op zijn plaat naast het bord. -->
  <Chat potjeId={stand.potje_id} snel={stand.snel ?? false} {berichten} {mijnPlek} {sleutel} {stuurBericht} plaat={chatPlaat} />
{/if}
<footer class="voet hoek">
  {#if chatPlaat === null}<Chat potjeId={stand.potje_id} snel={stand.snel ?? false} {berichten} {mijnPlek} {sleutel} {stuurBericht} />{/if}
  <Meldingen {sleutel} klein />
</footer>

{#if vraagOpgeven}
  <div class="doek">
    <div class="kaart" role="dialog" aria-modal="true" aria-labelledby="opgeven-titel">
      <span class="teken" aria-hidden="true"><Icoon naam="vlag" maat={26} /></span>
      <h2 id="opgeven-titel">{t("game.resignQ")}</h2>
      <p>{t("game.resignYours")}</p>
      <div class="knoppen">
        <button class="knop-lijn" onclick={() => (vraagOpgeven = false)}>{t("game.keepPlaying")}</button>
        <button class="knop-licht" onclick={bevestigOpgeven}>{t("game.yesResign")}</button>
      </div>
    </div>
  </div>
{/if}

{#if stand.afgelopen}
  <div class="feest tafel" role="dialog" aria-modal="true" aria-labelledby="einde-titel">
    <Laadtafel aan={feestLaadt} />
    <FeestTafel
      stand={vakken}
      vierkant={vorm === "vierkant"}
      hoofd={stand.snel && opnieuw ? { id: "opnieuw", tekst: t("game.playAgain"), doe: opnieuw } : { id: "mijnPotjes", tekst: t("common.myGames"), doe: mijnPotjes }}
      start={{ tekst: t("common.backToStart"), doe: klaar }}
      {metLijst}
      klaar={() => (tafelKlaar = true)}
      bind:vakken={tafelVakken}
    />
    {#if tafelKlaar}
    {#if stand.winnaar !== null}
      <div class="medaille vast" style={medailleStijl(tafelVakken, isBreed())}><Podium speler={stand.winnaar - 1} /></div>
      <div class="uitslag vast" {@attach krimp(0.45, true)} style={isBreed() ? kolomStijl(tafelVakken.uitslag, 0.08, 0.08) : platenStijl(tafelVakken.uitslag, 0.04, 0.08, 0.08)}>
        <h2 id="einde-titel" class="titel-groot">{stand.winnaar === mijnPlek ? t("game.youWon") : t("game.wins", { name: naamVan(stand.winnaar) })}</h2>
        {#if !doelBereikt}<p class="onderschrift">{t("game.othersResigned")}</p>{/if}
      </div>
    {:else}
      <div class="podium-leeg"></div>
      <div class="uitslag vast" {@attach krimp(0.45, true)} style={isBreed() ? kolomStijl(tafelVakken.uitslag, 0.08, 0.08) : platenStijl(tafelVakken.uitslag, 0.04, 0.08, 0.08)}>
        <h2 id="einde-titel" class="titel-groot">{t("common.gameOver")}</h2>
      </div>
    {/if}
    {/if}
    {#if tafelKlaar && metLijst}
    <div class="blad plaat" class:breed-tekst={isBreed()} style={isBreed() ? kolomStijl(tafelVakken.lijst, 0.06, 0.06) : platenStijl(tafelVakken.lijst, 0.05, 0.06, 0.06)}>
      {#if mijnVerandering}
        <div class="rating-uitslag" data-testid="rating-uitslag">
          <div class="vlak rating-vlak">
            <span class="kop">{t("game.rating")}</span>
            <span class="rating-regel cijfers">
              <span class="sr-only">{t("game.ratingChange", { voor: mijnVerandering.voor, na: mijnVerandering.na })}</span>
              <strong aria-hidden="true">{mijnVerandering.na}</strong>
              <span class="delta cijfers" class:op={mijnVerandering.na >= mijnVerandering.voor} class:neer={mijnVerandering.na < mijnVerandering.voor}>
                {mijnVerandering.na >= mijnVerandering.voor ? "+" : "−"}{Math.abs(mijnVerandering.na - mijnVerandering.voor)}
              </span>
              <span class="oud" aria-hidden="true">{mijnVerandering.voor}</span>
            </span>
          </div>
          {#if ranglijstPlek !== null}
            <div class="vlak plek-vlak">
              <Icoon naam="ranglijst" maat={22} />
              <span class="plek cijfers" data-testid="ranglijst-plek" {@attach krimp(0.5)}>{t("game.leaderboardPlace", { n: ranglijstPlek })}</span>
            </div>
          {/if}
        </div>
      {/if}
      {#if stand.ranglijst.length > 2}
        <ol class="rang">
          {#each stand.ranglijst as plek (plek)}
            <li><span class="schijf mini"><Steentje speler={plek - 1} maat={20} /></span>{plek === mijnPlek ? t("common.nameYou", { name: naamVan(plek) }) : naamVan(plek)}</li>
          {/each}
        </ol>
      {/if}
    </div>
    {/if}
  </div>
{/if}

<style>
  .tegen {
    position: relative;
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
    font-size: 0.85rem;
    font-weight: 700;
  }
  .tegen-naam {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 7rem;
  }
  .rating-pil {
    flex: none;
    padding: 0 8px;
    border-radius: 11px;
    font-size: 0.78rem;
    font-weight: 800;
    background: var(--wit);
  }
  /* Na een Snel potje: je Rating en je plek op de Ranglijst, twee tegels op het crème blad. */
  .rating-uitslag {
    display: flex;
    gap: 10px;
  }
  .vlak {
    border-radius: var(--vel);
    padding: 10px 16px;
  }
  .rating-vlak {
    flex: 1.6;
    min-width: 0;
    background: var(--zacht);
    display: flex;
    flex-direction: column;
  }
  .plek-vlak {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 4px;
    background: var(--tegel-geel);
    color: var(--tegel-geel-inkt);
  }
  .rating-regel {
    display: flex;
    align-items: baseline;
    flex-wrap: wrap;
    gap: 4px 8px;
  }
  .rating-regel strong {
    font-size: 2.25rem;
    font-weight: 800;
    line-height: 1.1;
    color: var(--inkt);
  }
  .delta {
    direction: ltr;
    unicode-bidi: isolate;
    padding: 1px 8px;
    border-radius: 10px;
    font-size: 0.95rem;
    font-weight: 800;
  }
  .delta.op {
    background: var(--goudvlak);
    color: var(--inkt);
  }
  .delta.neer {
    background: var(--fout-vlak);
    color: var(--fout);
  }
  .oud {
    margin-inline-start: auto;
    color: var(--tekst-zacht);
    font-size: 0.88rem;
    text-decoration: line-through;
  }
  /* Taak 284: "Leaderboard #37" past in de tegel; een woord breekt niet midden in, de letter krimpt (`krimp`). */
  .plek {
    font-size: calc(1.2rem * var(--krimp, 1));
    font-weight: 800;
    line-height: 1.1;
    color: var(--inkt);
  }
  /* Een melding boven het bord (verbinding weg, opgegeven, fout). */
  .status {
    position: relative;
    z-index: 2;
    align-self: flex-start;
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 8px 14px 0;
    padding: 6px 14px;
    border-radius: var(--pil);
    background: var(--wit);
    color: var(--inkt);
    font-size: 0.85rem;
    font-weight: 700;
  }
  .status.fout {
    color: var(--fout);
    background: var(--fout-vlak);
    text-align: start;
  }
  .puls {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--fout);
    animation: puls 1200ms ease-in-out infinite;
  }
  @keyframes puls {
    50% {
      opacity: 0.3;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .puls {
      animation: none;
    }
  }
</style>
