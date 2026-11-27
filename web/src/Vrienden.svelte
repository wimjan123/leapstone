<script lang="ts">
  import { onMount } from "svelte";
  import {
    ApiFout,
    UITDAGING_POLL_MS,
    accepteerUitdaging,
    bordKentAantal,
    daagUit,
    daagVrienden,
    haalUitdaging,
    haalVrienden,
    keurVriendverzoekGoed,
    startUitdaging,
    stuurVriendverzoek,
    tekstVan,
    toonVriendcode,
    verwijderVriend,
    vriendcodeCijfers,
    weigerUitdaging,
    weigerVriendverzoek,
    zoekVriendcode,
    type PotjeInfo,
    type Uitdaging,
    type UitdagingKeuze,
    type UitdagingStand,
    type VriendKandidaat,
    type Vriend,
    type Vriendenlijst,
    type Vriendverzoek,
  } from "./online";
  import Tafel from "./Tafel.svelte";
  import type { TafelObject } from "./tafelblad";
  import BordKeuze from "./BordKeuze.svelte";
  import DenktijdKeuze from "./DenktijdKeuze.svelte";
  import { denktijdNaam, STANDAARD_DENKTIJD, type Denktijd } from "./denktijd";
  import type { Vorm } from "./spelers";
  import Icoon from "./Icoon.svelte";
  import Laden from "./Laden.svelte";
  import { binnen } from "./overgang";
  import { huidigeTaal, metNaam, t } from "./taal.svelte";
  import { ratingGetal } from "./getal";

  // Friends: bovenaan jouw Vriendcode (kopiëren en delen), daaronder de vrienden. De server bepaalt wie erin staat
  // en in welke volgorde (wie je het laatst sprak bovenaan); de app toont de lijst zoals hij komt.
  // De Vriendcode staat nergens anders in de app.
  // Challenge: tik op een vriend (of vink twee tot vijf vrienden aan en tik op de knop erboven), kies het bord en de Denktijd, en wacht op zijn antwoord. De vriend krijgt een Melding en kiest
  // Accept (het live Potje begint voor beiden) of Decline. Geen antwoord binnen 5 minuten telt als Decline: de uitdager ziet "Not now".
  // Bij meer vrienden (taak 164) begint het Potje pas als iedereen Accept koos. Zegt iemand nee of verloopt de tijd, dan kiest de
  // uitdager: beginnen met wie accepteerde (als het bord dat aantal kent) of de lege plekken vullen met Computerspelers.
  let {
    sleutel,
    terug,
    verlopen,
    openPotje,
  }: {
    sleutel: string;
    terug: () => void;
    /** De server kent de sleutel niet meer. */
    verlopen: () => void;
    /** Een Uitdaging werd geaccepteerd: ga naar het live Potje. */
    openPotje: (potje: PotjeInfo) => void;
  } = $props();

  let lijst = $state.raw<Vriendenlijst | null>(null);
  let fout = $state("");
  let gekopieerd = $state(false);

  // Add friend: typ de Vriendcode, zie de Spelersnaam, tik Add. De ander kiest goedkeuren of weigeren.
  let toevoegen = $state(false);
  let invoer = $state("");
  let kandidaat = $state.raw<VriendKandidaat | null>(null);
  let toevoegFout = $state("");
  let toevoegKlaar = $state("");
  let bezig = $state(false);
  /** Welke code de laatste zoekopdracht gold: een trager antwoord op een oudere code telt niet meer. */
  let gezocht = "";

  // Eén of meer vrienden uitdagen.
  let uitdagen = $state.raw<Vriend[] | null>(null);
  /** De vrienden die in de lijst zijn aangevinkt voor een Uitdaging samen. */
  let gekozen = $state<number[]>([]);
  const MAX_VRIENDEN = 5;
  let vorm = $state<Vorm>("ster");
  let denktijd = $state<Denktijd>(STANDAARD_DENKTIJD);
  /**
   * De Uitdaging die je volgt: `uitdager` is de jouwe waarop nog geen (volledig) antwoord kwam; `vriend` is er een die je
   * accepteerde terwijl de anderen nog moeten antwoorden. `id` is het id waarmee de server haar volgt.
   */
  let wachtend = $state.raw<{ id: number; naam: string; rol: "uitdager" | "vriend" } | null>(null);
  /** De laatste stand van jouw Uitdaging: wie al accepteerde, en of je moet kiezen. */
  let stand = $state.raw<UitdagingStand | null>(null);
  /** Een Uitdaging die je accepteerde, ging niet door. */
  let afgelast = $state(false);
  /** De vriend die "Not now" zei (Decline, of 5 minuten zonder antwoord). */
  let nietNu = $state("");

  async function laad(stil = false) {
    try {
      lijst = await haalVrienden(sleutel);
      fout = "";
      // Een Uitdaging van jou die nog openstaat (ook na terugkomen in dit scherm): blijf op het antwoord wachten.
      if (!wachtend && lijst.uitgedaagd.length > 0) {
        const groep = lijst.uitgedaagd[0].groep;
        const namen = lijst.uitgedaagd.filter((x) => x.groep === groep).map((x) => x.spelersnaam);
        wachtend = { id: groep, naam: namen.join(", "), rol: "uitdager" };
      }
    } catch (e) {
      if (e instanceof ApiFout && e.status === 401) return verlopen();
      if (!stil) fout = tekstVan(e);
    }
  }

  onMount(() => laad());

  // Kijk steeds of er een Uitdaging bij kwam of een antwoord op de jouwe.
  $effect(() => {
    const timer = setInterval(async () => {
      await volgUitdaging();
      await laad(true);
    }, UITDAGING_POLL_MS);
    return () => clearInterval(timer);
  });

  async function volgUitdaging() {
    const w = wachtend;
    if (!w) return;
    try {
      const nieuw = await haalUitdaging(sleutel, w.id);
      if (wachtend?.id !== w.id) return;
      if (nieuw.status === "accepted" && nieuw.potje) {
        wachtend = null;
        stand = null;
        openPotje(nieuw.potje);
      } else if (nieuw.status === "declined" || nieuw.status === "expired") {
        wachtend = null;
        stand = null;
        if (w.rol === "uitdager") {
          nietNu = w.naam;
          // Hij staat niet meer open: je kunt hem weer uitdagen.
          if (lijst) lijst = { ...lijst, uitgedaagd: lijst.uitgedaagd.filter((x) => x.groep !== w.id) };
        } else {
          afgelast = true;
        }
      } else {
        stand = nieuw;
      }
    } catch (e) {
      if (e instanceof ApiFout && e.status === 401) return verlopen();
      // De Uitdaging is er niet meer (de vriend blokkeerde jou, de uitdager trok haar in, of je haalde de ander weg): niet meer wachten.
      if (e instanceof ApiFout && e.status === 404 && wachtend?.id === w.id) {
        wachtend = null;
        stand = null;
        if (w.rol === "vriend") afgelast = true;
      }
    }
  }

  function kiesUitdaging(v: Vriend) {
    fout = "";
    nietNu = "";
    afgelast = false;
    uitdagen = [v];
  }

  const vinkAan = (v: Vriend) => gekozen.includes(v.speler_id);

  function vink(v: Vriend) {
    gekozen = vinkAan(v) ? gekozen.filter((id) => id !== v.speler_id) : [...gekozen, v.speler_id];
  }

  /** De aangevinkte vrienden, in de volgorde van de lijst. */
  const gekozenVrienden = $derived((lijst?.vrienden ?? []).filter((v) => gekozen.includes(v.speler_id)));
  /** Het aantal Spelers van een Potje met de aangevinkte vrienden. */
  const groepAantal = $derived(gekozenVrienden.length + 1);
  const groepKan = $derived(bordKentAantal("ster", groepAantal) || bordKentAantal("vierkant", groepAantal));

  function kiesGroep() {
    if (gekozenVrienden.length < 2 || !groepKan) return;
    fout = "";
    nietNu = "";
    afgelast = false;
    uitdagen = gekozenVrienden;
  }

  // Het bord moet het aantal Spelers kennen (drie Spelers kan alleen op het Sterbord).
  $effect(() => {
    if (uitdagen && !bordKentAantal(vorm, uitdagen.length + 1)) vorm = vorm === "ster" ? "vierkant" : "ster";
  });

  async function stuurUitdaging() {
    const vrienden = uitdagen;
    if (!vrienden || bezig) return;
    bezig = true;
    fout = "";
    try {
      const u =
        vrienden.length === 1
          ? await daagUit(sleutel, vrienden[0].speler_id, vorm, denktijd)
          : await daagVrienden(sleutel, vrienden.map((v) => v.speler_id), vorm, denktijd);
      wachtend = { id: u.id, naam: u.spelersnaam, rol: "uitdager" };
      stand = null;
      nietNu = "";
      uitdagen = null;
      gekozen = [];
      await laad(true);
    } catch (e) {
      if (e instanceof ApiFout && e.status === 401) return verlopen();
      fout = tekstVan(e);
      // Er staat al een Uitdaging open, of de vriend staat niet meer in je lijst: terug naar de lijst, ververst.
      if (e instanceof ApiFout && (e.status === 409 || e.status === 404)) {
        uitdagen = null;
        await laad(true);
      }
    } finally {
      bezig = false;
    }
  }

  async function accepteer(u: Uitdaging) {
    fout = "";
    try {
      const potje = await accepteerUitdaging(sleutel, u.id);
      if (potje) return openPotje(potje);
      // Bij meer vrienden begint het Potje pas als iedereen accepteerde: wacht op de anderen.
      if (lijst) lijst = { ...lijst, uitdagingen: lijst.uitdagingen.filter((x) => x.id !== u.id) };
      wachtend = { id: u.id, naam: u.spelersnaam, rol: "vriend" };
      stand = null;
    } catch (e) {
      if (e instanceof ApiFout && e.status === 401) return verlopen();
      fout = tekstVan(e);
      // De Uitdaging is verlopen of weg: ververs de lijst.
      await laad(true);
    }
  }

  async function wijsAf(u: Uitdaging) {
    fout = "";
    try {
      await weigerUitdaging(sleutel, u.id);
      if (lijst) lijst = { ...lijst, uitdagingen: lijst.uitdagingen.filter((x) => x.id !== u.id) };
    } catch (e) {
      if (e instanceof ApiFout && e.status === 401) return verlopen();
      fout = tekstVan(e);
    }
  }

  const openVoor = (v: Vriend) => lijst?.uitgedaagd.some((u) => u.speler_id === v.speler_id && u.antwoord !== "declined") ?? false;

  /** De uitdager kiest na een Decline of na 5 minuten: beginnen met wie accepteerde, of vullen met Computerspelers. */
  async function kies(keuze: UitdagingKeuze) {
    const w = wachtend;
    if (!w || bezig) return;
    bezig = true;
    fout = "";
    try {
      const potje = await startUitdaging(sleutel, w.id, keuze);
      wachtend = null;
      stand = null;
      openPotje(potje);
    } catch (e) {
      if (e instanceof ApiFout && e.status === 401) return verlopen();
      fout = tekstVan(e);
    } finally {
      bezig = false;
    }
  }

  /** De uitdager trekt zijn Uitdaging in; wie al accepteerde, ziet dat ze niet doorgaat. */
  async function trekIn() {
    const w = wachtend;
    if (!w) return;
    fout = "";
    try {
      await weigerUitdaging(sleutel, w.id);
      wachtend = null;
      stand = null;
      await laad(true);
    } catch (e) {
      if (e instanceof ApiFout && e.status === 401) return verlopen();
      fout = tekstVan(e);
    }
  }

  async function kopieer() {
    if (!lijst) return;
    try {
      await navigator.clipboard.writeText(toonVriendcode(lijst.vriendcode));
      gekopieerd = true;
      fout = "";
    } catch {
      gekopieerd = false;
      fout = t("online.copyFailed");
    }
  }

  async function deel() {
    if (!lijst) return;
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title: "Leapstone", text: t("friends.shareText", { code: toonVriendcode(lijst.vriendcode) }) });
        return;
      } catch (e) {
        // De Speler sloot het deelmenu zelf: niets doen.
        if (e instanceof DOMException && e.name === "AbortError") return;
      }
    }
    await kopieer();
  }

  function opKnop() {
    toevoegen = !toevoegen;
    wisToevoegen();
  }

  function wisToevoegen() {
    invoer = "";
    kandidaat = null;
    toevoegFout = "";
    toevoegKlaar = "";
    gezocht = "";
  }

  /** Bij elke toets: zodra er acht cijfers staan, zoek de Spelersnaam. */
  async function opInvoer() {
    const cijfers = vriendcodeCijfers(invoer);
    invoer = cijfers.length > 4 ? `${cijfers.slice(0, 4)} ${cijfers.slice(4)}` : cijfers;
    kandidaat = null;
    toevoegFout = "";
    toevoegKlaar = "";
    gezocht = cijfers.length === 8 ? cijfers : "";
    if (!gezocht) return;
    const code = gezocht;
    try {
      const k = await zoekVriendcode(sleutel, code);
      if (gezocht === code) kandidaat = k;
    } catch (e) {
      if (e instanceof ApiFout && e.status === 401) return verlopen();
      if (gezocht === code) toevoegFout = tekstVan(e);
    }
  }

  async function voegToe() {
    if (!kandidaat || bezig) return;
    bezig = true;
    toevoegFout = "";
    try {
      const u = await stuurVriendverzoek(sleutel, gezocht);
      toevoegKlaar = t(u.vrienden ? "addFriend.now" : "addFriend.sent", { name: u.spelersnaam });
      kandidaat = null;
      invoer = "";
      gezocht = "";
      if (u.vrienden) await laad();
    } catch (e) {
      if (e instanceof ApiFout && e.status === 401) return verlopen();
      toevoegFout = tekstVan(e);
    } finally {
      bezig = false;
    }
  }

  async function antwoord(v: Vriendverzoek, goed: boolean) {
    fout = "";
    try {
      if (goed) await keurVriendverzoekGoed(sleutel, v.speler_id);
      else await weigerVriendverzoek(sleutel, v.speler_id);
      if (goed) await laad();
      else if (lijst) lijst = { ...lijst, verzoeken: lijst.verzoeken.filter((x) => x.speler_id !== v.speler_id) };
    } catch (e) {
      if (e instanceof ApiFout && e.status === 401) return verlopen();
      fout = tekstVan(e);
      // Het verzoek is er misschien niet meer (de ander blokkeerde jou, of je account veranderde): ververs de lijst.
      if (e instanceof ApiFout && e.status === 404) await laad();
    }
  }

  // Eerst een vraag met de Spelersnaam (zoals Opgeven), dan pas weghalen.
  let vraagWeg = $state<Vriend | null>(null);

  async function haalWeg(v: Vriend) {
    vraagWeg = null;
    fout = "";
    try {
      await verwijderVriend(sleutel, v.speler_id);
      if (lijst) lijst = { ...lijst, vrienden: lijst.vrienden.filter((x) => x.speler_id !== v.speler_id) };
    } catch (e) {
      if (e instanceof ApiFout && e.status === 401) return verlopen();
      fout = tekstVan(e);
    }
  }

  // Op de tafel (taak 181): Terug, Add friend, de Vriendcode kopiëren en delen, en Send zijn voorwerpen.
  const tafelKnoppen = $derived<TafelObject[]>(
    uitdagen
      ? [{ id: "stuur", soort: "rood", sleutel: "challenge.send", doe: () => void stuurUitdaging() }]
      : [
          { id: "toevoegen", soort: "rood", sleutel: "addFriend.title", doe: opKnop },
          { id: "kopieer", soort: "porselein", sleutel: "friends.copy", pictogram: "kopie", doe: () => void kopieer() },
          { id: "deel", soort: "porselein", sleutel: "friends.share", pictogram: "delen", doe: () => void deel() },
        ],
  );
</script>

<Tafel titel="menu.friends" terug={{ label: t("common.back"), doe: () => (uitdagen ? (uitdagen = null) : terug()) }} onder={tafelKnoppen}>
{#snippet inhoud()}
<section class="scherm vrienden" in:binnen>
  {#if uitdagen}
    <h1 class="sr-only">{t("menu.friends")}</h1>
    {#if uitdagen.length > 1}<p class="uitleg" data-testid="uitdaging-spelers">{t("challengeMore.playerCount", { count: uitdagen.length + 1 })}</p>{/if}
    <BordKeuze bind:vorm toonKeuze aantal={uitdagen.length + 1} uit={(["ster", "vierkant"] as const).filter((b) => !bordKentAantal(b, uitdagen!.length + 1))} />
    <div class="blad">
      <DenktijdKeuze bind:denktijd naam="uitdaging-denktijd" />
      {#if denktijd !== null}<p class="uitleg">{t("online.timeoutInfo")}</p>{/if}
      {#if fout}<p class="fout" role="alert">{fout}</p>{/if}
    </div>
  {:else}
  <h1 class="sr-only">{t("menu.friends")}</h1>

  {#if !lijst && !fout}
    <Laden />
  {:else if !lijst}
    <div class="leeg">
      <p class="fout" role="alert">{fout}</p>
      <button class="knop-lijn" onclick={() => laad()}>{t("common.tryAgain")}</button>
    </div>
  {:else}
    <div class="code">
      <span class="kop">{t("friends.code")}</span>
      <strong class="cijfers" data-testid="vriendcode">{toonVriendcode(lijst.vriendcode)}</strong>
      {#if gekopieerd}<p class="gelukt" role="status">{t("online.copied")}</p>{/if}
    </div>
    <div class="blad">
    <div class="schuif" data-scrollt>
    <div class="stapel">
    {#if toevoegen}
      <form class="toevoegen" onsubmit={(e) => { e.preventDefault(); voegToe(); }}>
        <label class="vraag" for="vriendcode-in">{t("addFriend.code")}</label>
        <input
          id="vriendcode-in"
          class="code-in"
          type="text"
          inputmode="numeric"
          autocomplete="off"
          maxlength="9"
          placeholder="0000 0000"
          bind:value={invoer}
          oninput={opInvoer}
        />
        <p class="uitleg">{t("addFriend.hint")}</p>
        {#if kandidaat}
          <div class="gevonden" data-testid="gevonden">
            <strong class="naam">{kandidaat.spelersnaam}</strong>
            {#if kandidaat.vrienden}
              <span class="uitleg">{t("addFriend.already", { name: kandidaat.spelersnaam })}</span>
            {:else}
              <button class="knop-licht" type="submit" disabled={bezig}>{t("addFriend.add")}</button>
            {/if}
          </div>
        {/if}
        {#if toevoegFout}<p class="fout" role="alert">{toevoegFout}</p>{/if}
        {#if toevoegKlaar}<p class="gelukt" role="status">{toevoegKlaar}</p>{/if}
      </form>
    {/if}
    {#if fout}<p class="fout" role="alert">{fout}</p>{/if}
    {#if wachtend && wachtend.rol === "uitdager" && stand?.status === "choice"}
      <div class="keuze" data-testid="uitdaging-keuze">
        <h2 class="kop">{t("challengeMore.choiceTitle")}</h2>
        <p class="uitleg">{t("challengeMore.choiceBody")}</p>
        {#if stand.geaccepteerd.length > 0}
          <p class="uitleg" data-testid="uitdaging-geaccepteerd">{t("challengeMore.accepted", { names: stand.geaccepteerd.join(", ") })}</p>
        {/if}
        <button class="knop-licht breed" disabled={bezig || !stand.kan_beginnen} onclick={() => kies("beginnen")}>{t("challengeMore.begin")}</button>
        {#if !stand.kan_beginnen && stand.geaccepteerd.length > 0}
          <p class="uitleg">{t("challengeMore.noBoard", { count: stand.geaccepteerd.length + 1 })}</p>
        {/if}
        <button class="knop-licht breed" disabled={bezig} onclick={() => kies("computer")}>{t("challengeMore.fill")}</button>
        <button class="knop-lijn" onclick={trekIn}>{t("challengeMore.cancel")}</button>
      </div>
    {:else if wachtend && wachtend.rol === "uitdager"}
      <p class="gelukt" role="status" data-testid="uitdaging-wacht">{t("challenge.waiting", { name: wachtend.naam })}</p>
      {#if stand && stand.geaccepteerd.length > 0}
        <p class="uitleg" data-testid="uitdaging-geaccepteerd">{t("challengeMore.accepted", { names: stand.geaccepteerd.join(", ") })}</p>
      {/if}
      {#if stand && stand.aantal_spelers > 2}
        <button class="knop-lijn" onclick={trekIn}>{t("challengeMore.cancel")}</button>
      {/if}
    {:else if wachtend}
      <p class="gelukt" role="status" data-testid="uitdaging-wacht-vriend">{t("challengeMore.waitOthers")}</p>
    {:else if afgelast}
      <p class="gelukt" role="status" data-testid="uitdaging-afgelast">{t("challengeMore.calledOff")}</p>
    {:else if nietNu}
      <p class="gelukt" role="status" data-testid="niet-nu"><strong>{nietNu}</strong>: {t("challenge.notNow")}</p>
    {/if}
    {#if lijst.uitdagingen.length > 0}
      <div class="verzoeken">
        <h2 class="kop">{t("challenge.requests")}</h2>
        <ul class="rijen lijstblok" aria-label={t("challenge.requests")}>
          {#each lijst.uitdagingen as u, n (u.id)}
            {@const [voor, naam, na] = metNaam("challenge.incoming", u.spelersnaam)}
            <!-- Taak 284: de zin over de hele breedte en de knoppen eronder, zodat "challenges you" nooit wegvalt en een naam niet
                 letter voor letter breekt. Alleen de naam breekt waar het moet. -->
            <li class="uitdaging" style="--n:{n}">
              <span class="tekst">
                <span class="zin">{voor}<bdi class="wie">{naam}</bdi>{na}</span>
                <span class="sub">{u.bord === "ster" ? t("board.star") : t("board.square")} · {denktijdNaam(u.denktijd_s)}{#if u.aantal_spelers > 2} · {t("challengeMore.playerCount", { count: u.aantal_spelers })}{/if}</span>
              </span>
              <span class="knoppen">
                <button class="knop-lijn" aria-label="{t('challenge.accept')}: {u.spelersnaam}" onclick={() => accepteer(u)}>{t("challenge.accept")}</button>
                <button class="knop-lijn" aria-label="{t('challenge.decline')}: {u.spelersnaam}" onclick={() => wijsAf(u)}>{t("challenge.decline")}</button>
              </span>
            </li>
          {/each}
        </ul>
      </div>
    {/if}
    {#if lijst.verzoeken.length > 0}
      <div class="verzoeken">
        <h2 class="kop">{t("addFriend.requests")}</h2>
        <ul class="rijen lijstblok" aria-label={t("addFriend.requests")}>
          {#each lijst.verzoeken as v, n (v.speler_id)}
            <li style="--n:{n}">
              <span class="naam">{v.spelersnaam}</span>
              <button class="knop-lijn" aria-label={t("addFriend.approveLabel", { name: v.spelersnaam })} onclick={() => antwoord(v, true)}>
                {t("addFriend.approve")}
              </button>
              <button class="knop-lijn" aria-label={t("addFriend.declineLabel", { name: v.spelersnaam })} onclick={() => antwoord(v, false)}>
                {t("addFriend.decline")}
              </button>
            </li>
          {/each}
        </ul>
      </div>
    {/if}
    {#if lijst.vrienden.length === 0}
      <div class="leeg">
        <div class="schijf teken" aria-hidden="true"><Icoon naam="vrienden" maat={36} /></div>
        <p>{t("friends.none")}</p>
      </div>
    {:else}
      <div class="vriendenlijst">
        {#if gekozenVrienden.length >= 2 && groepKan}
          <button class="knop-licht breed groep-knop" data-testid="groep-uitdagen" onclick={kiesGroep}>
            {t("challengeMore.send", { count: gekozenVrienden.length })}
          </button>
        {:else if gekozenVrienden.length >= 2}
          <p class="uitleg" data-testid="groep-geen-bord">{t("challengeMore.noBoard", { count: groepAantal })}</p>
        {:else if lijst.vrienden.length >= 2}
          <p class="uitleg">{t("challengeMore.hint")}</p>
        {/if}
        <ul class="rijen lijstblok" aria-label={t("menu.friends")}>
          {#each lijst.vrienden as v, n (v.speler_id)}
            <li style="--n:{n}">
              <input
                class="vink"
                type="checkbox"
                aria-label={t("challengeMore.select", { name: v.spelersnaam })}
                checked={vinkAan(v)}
                disabled={openVoor(v) || (!vinkAan(v) && gekozen.length >= MAX_VRIENDEN)}
                onchange={() => vink(v)}
              />
              <span class="naam">{v.spelersnaam}</span>
              <span class="rating cijfers"><span class="rlabel">{t("ranking.rating")}</span>{ratingGetal(v.rating, huidigeTaal())}</span>
              <button class="knop-lijn" aria-label={t("challenge.title", { name: v.spelersnaam })} disabled={openVoor(v)} onclick={() => kiesUitdaging(v)}>
                {t("challenge.button")}
              </button>
              <button class="knop-ikoon" aria-label={t("friends.remove", { name: v.spelersnaam })} onclick={() => (vraagWeg = v)}>
                <Icoon naam="sluit" maat={18} />
              </button>
            </li>
          {/each}
        </ul>
      </div>
    {/if}
    </div>
    </div>
    </div>
  {/if}
  {/if}
</section>
{/snippet}
</Tafel>

{#if vraagWeg}
  <div class="doek">
    <div class="kaart" role="dialog" aria-modal="true" aria-labelledby="vriend-weg-titel">
      <span class="teken" aria-hidden="true"><Icoon naam="sluit" maat={26} /></span>
      <h2 id="vriend-weg-titel">{t("friends.removeQ", { name: vraagWeg.spelersnaam })}</h2>
      <p>{t("friends.removeInfo", { name: vraagWeg.spelersnaam })}</p>
      <div class="knoppen">
        <button class="knop-lijn" onclick={() => (vraagWeg = null)}>{t("friends.keep")}</button>
        <button class="knop-licht" onclick={() => haalWeg(vraagWeg!)}>{t("friends.yesRemove")}</button>
      </div>
    </div>
  </div>
{/if}

<style>
  /* Je Vriendcode op de tafel, groot, met kopiëren en delen. */
  .code {
    flex: none;
    margin-top: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 16px 14px 14px;
    border-radius: 28px;
    background: var(--pilvlak);
  }
  .kop {
    font-size: 0.75rem;
    font-weight: 800;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--tekst-zacht);
  }
  .code strong {
    font-size: 2.1rem;
    font-weight: 800;
    letter-spacing: 0.06em;
    line-height: 1.1;
    direction: ltr;
  }
  .blad {
    margin-top: auto;
    padding: 22px 18px 0;
    min-height: 0;
  }
  .blad .schuif {
    flex: 0 1 auto;
    padding-bottom: calc(16px + var(--veilig-onder));
  }
  .stapel,
  .vriendenlijst {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .verzoeken .kop {
    margin: 0 4px 8px;
    display: block;
  }
  .toevoegen {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 14px;
    border-radius: var(--vel);
    background: var(--zacht);
  }
  .toevoegen .vraag {
    font-size: 0.75rem;
    font-weight: 800;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--tekst-zacht);
    text-align: center;
  }
  .toevoegen input {
    text-align: center;
    font-size: 1.15rem;
    letter-spacing: 0.06em;
    background: var(--wit);
  }
  .uitleg {
    margin: 0;
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--tekst-zacht);
    text-align: center;
    text-wrap: balance;
  }
  .gevonden {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }
  .gevonden button {
    min-height: 48px;
    padding: 0 22px;
    font-size: 1rem;
  }
  .gelukt {
    margin: 0;
    padding: 10px 14px;
    border-radius: var(--rond);
    background: #f3e2b0;
    font-weight: 700;
    text-align: center;
  }
  .rijen {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .rijen li {
    display: flex;
    align-items: center;
    gap: 10px;
    min-height: 60px;
    flex-wrap: nowrap;
    padding-inline: 14px 8px;
    animation: rij-in 380ms calc(min(var(--n), 8) * 35ms) var(--uit) both;
  }
  .rijen li button {
    min-height: 40px;
    padding: 0 14px;
    font-size: 0.88rem;
    background: var(--wit);
  }
  .rijen li .knop-ikoon {
    min-height: 0;
    width: 40px;
    height: 40px;
    padding: 0;
    background: none;
  }
  .keuze {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 16px;
    border-radius: var(--vel);
    background: var(--zacht);
  }
  .keuze .kop {
    margin: 0;
    text-align: center;
  }
  .keuze .knop-lijn {
    background: var(--wit);
  }
  .groep-knop {
    margin-bottom: 4px;
  }
  .vink {
    flex: none;
    width: 24px;
    height: 24px;
    margin: 0;
    accent-color: var(--inkt);
  }
  /* Een naam gaat over hooguit twee regels (taak 233); een naam zonder spaties breekt waar het moet. */
  .naam {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    overflow-wrap: anywhere;
    line-height: 1.2;
    font-size: 1rem;
    font-weight: 700;
  }
  .tekst {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  /* Een Uitdaging (taak 284): de zin over de hele breedte, hooguit drie regels (de naam twee, de rest erachter), en de knoppen eronder
     aan de eindkant. */
  .rijen li.uitdaging {
    flex-wrap: wrap;
    row-gap: 6px;
    padding-block: 10px;
  }
  .uitdaging .tekst {
    flex: 1 1 100%;
  }
  .zin {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    line-height: 1.2;
    font-size: 1rem;
    font-weight: 700;
  }
  .zin .wie {
    overflow-wrap: anywhere;
  }
  .uitdaging .knoppen {
    display: flex;
    gap: 8px;
    margin-inline-start: auto;
  }
  .sub {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--tekst-zacht);
  }
  .rating {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    line-height: 1.1;
    font-weight: 800;
    color: var(--inkt);
  }
  /* Het getal heeft een label: zonder dat is 1110 geen Rating (taak 233). */
  .rlabel {
    font-family: var(--letter);
    font-size: 0.62rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--tekst-zacht);
  }
  .leeg {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 14px;
    padding: 18px 0;
    text-align: center;
  }
  .teken {
    width: 84px;
    height: 84px;
    background: var(--zacht);
    box-shadow: none;
  }
  .leeg p {
    margin: 0;
    color: var(--tekst);
    font-size: 1.15rem;
    font-weight: 700;
  }
  @keyframes rij-in {
    from {
      opacity: 0;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .rijen li {
      animation: none;
    }
  }
</style>
