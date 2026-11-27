<script lang="ts">
  import { onMount } from "svelte";
  import Icoon from "./Icoon.svelte";
  import Tafel from "./Tafel.svelte";
  import type { TafelObject } from "./tafelblad";
  import { BEOORDEEL_LINK } from "./beoordeling";
  import { isIosApp, zetMeldingenUit } from "./meldingen";
  import { IS_APP } from "./omgeving";
  import { binnen } from "./overgang";
  import { krimp } from "./krimp";
  import { huidigeTaal, t, talen, zetTaal } from "./taal.svelte";
  import { deblokkeer, haalBlokkades, meldTaal, PRIVACY_LINK, TERMS_LINK, tekstVan, verwijderAccount, wisLokaleSpeler, type GeblokkeerdeSpeler } from "./online";

  // Account: de Spelersnaam, het privacybeleid, de geblokkeerde Spelers en Delete account met een bevestiging.
  let {
    spelersnaam,
    sleutel,
    terug,
    verwijderd,
  }: {
    spelersnaam: string;
    sleutel: string;
    terug: () => void;
    /** Het account is verwijderd en deze telefoon heeft alles gewist. */
    verwijderd: () => void;
  } = $props();

  let bevestig = $state(false);
  let bezig = $state(false);
  let fout = $state("");
  /** De lijst met geblokkeerde Spelers is open. */
  let blokLijst = $state(false);
  /** De lijst met talen is open. */
  let taalLijst = $state(false);
  let geblokkeerd = $state<GeblokkeerdeSpeler[] | null>(null);

  // Een fout bij het ophalen laat de lijst leeg; het account zelf werkt gewoon.
  onMount(() => {
    haalBlokkades(sleutel).then(
      (l) => (geblokkeerd = l),
      () => (geblokkeerd = []),
    );
  });

  async function kiesTaal(code: string) {
    await zetTaal(code);
    meldTaal();
    taalLijst = false;
  }

  async function deblok(s: GeblokkeerdeSpeler) {
    fout = "";
    try {
      await deblokkeer(sleutel, s.speler_id);
      geblokkeerd = (geblokkeerd ?? []).filter((x) => x.speler_id !== s.speler_id);
    } catch (e) {
      fout = tekstVan(e);
    }
  }

  async function verwijder() {
    if (bezig) return;
    bezig = true;
    fout = "";
    try {
      await verwijderAccount(sleutel);
    } catch (e) {
      fout = tekstVan(e);
      bezig = false;
      return;
    }
    // De server wiste het push-abonnement al; dit haalt het ook van deze telefoon. Niet wachten: lukt het niet, dan is er niets aan de hand.
    if (!IS_APP) void zetMeldingenUit(sleutel).catch(() => {});
    wisLokaleSpeler();
    verwijderd();
  }

  // Op de tafel (taak 181): Terug en de naam van het scherm zijn voorwerpen; bij Delete account ook de twee knoppen.
  const tafelTitel = $derived(taalLijst ? "account.language" : blokLijst ? "account.blocked" : "common.account");
  const tafelTerug = $derived(
    taalLijst
      ? { label: t("common.account"), doe: () => (taalLijst = false) }
      : blokLijst
        ? { label: t("common.account"), doe: () => ((blokLijst = false), (fout = "")) }
        : { label: t("common.myGames"), doe: bevestig ? () => (bevestig = false) : terug },
  );
  const tafelKnoppen = $derived<TafelObject[]>(
    bevestig && !taalLijst && !blokLijst
      ? [
          { id: "wis", soort: "rood", sleutel: "account.deleteMine", doe: () => void verwijder() },
          { id: "houden", soort: "porselein", sleutel: "account.keep", doe: () => !bezig && (bevestig = false) },
        ]
      : [],
  );
</script>

<Tafel titel={tafelTitel} terug={tafelTerug} onder={tafelKnoppen}>
{#snippet inhoud()}
{#if taalLijst}
  <section class="scherm account" in:binnen>
    <h1 class="sr-only">{t("account.language")}</h1>
    <div class="blad rek">
      <div class="schuif" data-scrollt>
        <div class="lijstblok" role="group" aria-label={t("account.chooseLanguage")}>
          {#each talen() as l (l.code)}
            <button class="rij" lang={l.code} aria-pressed={l.code === huidigeTaal()} onclick={() => kiesTaal(l.code)}>
              <span class="label">{l.naam}</span>
              {#if l.code === huidigeTaal()}<span class="vink"><Icoon naam="vink" maat={18} /></span>{/if}
            </button>
          {/each}
        </div>
      </div>
    </div>
  </section>
{:else if blokLijst}
  <section class="scherm account" in:binnen>
    <h1 class="sr-only">{t("account.blocked")}</h1>
    {#if geblokkeerd?.length}
      <div class="blad rek">
        <ul class="lijstblok lijst" aria-label={t("account.blockedPlayers")}>
          {#each geblokkeerd as s (s.speler_id)}
            <li class="rij">
              <span class="ikoon rood"><Icoon naam="blokkeer" maat={20} /></span>
              <span class="label naam">{s.spelersnaam}</span>
              <button class="knop-ikoon" aria-label={t("account.unblock", { name: s.spelersnaam })} onclick={() => deblok(s)}><Icoon naam="sluit" maat={20} /></button>
            </li>
          {/each}
        </ul>
        {#if fout}<p class="fout" role="alert">{fout}</p>{/if}
      </div>
    {:else}
      <div class="blad">
        <p class="uitleg">{t("account.noBlocked")}</p>
        {#if fout}<p class="fout" role="alert">{fout}</p>{/if}
      </div>
    {/if}
  </section>
{:else}
<section class="scherm account" in:binnen>
  <h1 class="sr-only">{t("common.account")}</h1>
  <div class="hero">
    {#if !bevestig}<h2 class="vraag">{spelersnaam}</h2>{/if}
  </div>
  {#if bevestig}
    <div class="blad">
      <h2 class="vraag klein">{t("account.deleteQ")}</h2>
      <p class="uitleg">{t("account.deleteInfo")}</p>
      {#if fout}<p class="fout" role="alert">{fout}</p>{/if}
    </div>
  {:else}
    <nav class="blad" aria-label={t("common.account")}>
      <div class="lijstblok">
        <button class="rij" onclick={() => (taalLijst = true)}>
          <span class="ikoon blauw"><Icoon naam="wereld" maat={20} /></span>
          <span class="label" {@attach krimp(0.6)}>{t("account.language")}</span>
          <span class="waarde" lang={huidigeTaal()}>{talen().find((l) => l.code === huidigeTaal())?.naam}</span>
          <span class="pijl"><Icoon naam="verder" maat={18} /></span>
        </button>
        <button class="rij" onclick={() => (blokLijst = true)}>
          <span class="ikoon rood"><Icoon naam="blokkeer" maat={20} /></span>
          <span class="label" {@attach krimp(0.6)}>{t("account.blockedPlayers")}</span>
          {#if geblokkeerd?.length}<span class="aantal" aria-label={t("account.blockedCount", { n: geblokkeerd.length })}>{geblokkeerd.length}</span>{/if}
          <span class="pijl"><Icoon naam="verder" maat={18} /></span>
        </button>
        <a class="rij" href={PRIVACY_LINK} target="_blank" rel="noopener">
          <span class="ikoon groen"><Icoon naam="schild" maat={20} /></span>
          <span class="label" {@attach krimp(0.6)}>{t("common.privacy")}</span>
          <span class="pijl"><Icoon naam="verder" maat={18} /></span>
        </a>
        <a class="rij" href={TERMS_LINK} target="_blank" rel="noopener">
          <span class="ikoon roze"><Icoon naam="rapport" maat={20} /></span>
          <span class="label" {@attach krimp(0.6)}>{t("common.terms")}</span>
          <span class="pijl"><Icoon naam="verder" maat={18} /></span>
        </a>
        <button class="rij gevaar" onclick={() => (bevestig = true)}>
          <span class="ikoon rood"><Icoon naam="prullenbak" maat={20} /></span>
          <span class="label" {@attach krimp(0.6)}>{t("account.delete")}</span>
          <span class="pijl"><Icoon naam="verder" maat={18} /></span>
        </button>
      </div>
      {#if isIosApp()}
        <a class="beoordeel" href={BEOORDEEL_LINK}>
          <span class="schijfje"><Icoon naam="ster" maat={18} /></span>
          <span class="label">{t("account.rate")}</span>
          <span class="sterren" aria-hidden="true">★★★★★</span>
        </a>
      {/if}
    </nav>
  {/if}
</section>
{/if}
{/snippet}
</Tafel>

<style>
  .hero {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 14px;
    padding-bottom: 6px;
  }
  .vraag {
    max-width: 100%;
    margin: 0;
    font-size: clamp(1.9rem, 9vw, 2.5rem);
    font-weight: 800;
    letter-spacing: -0.025em;
    line-height: 1.05;
    text-align: center;
    overflow-wrap: anywhere;
  }
  .vraag.klein {
    font-size: 1.45rem;
    letter-spacing: -0.015em;
  }
  .uitleg {
    margin: 0 auto;
    max-width: 30ch;
    text-align: center;
    color: var(--tekst-zacht);
    font-weight: 500;
    text-wrap: balance;
  }
  .rij {
    display: flex;
    align-items: center;
    gap: 14px;
    width: 100%;
    min-height: 68px;
    padding: 0 16px;
    border-radius: 0;
    font-size: 1rem;
    font-weight: 700;
    color: var(--tekst);
    text-decoration: none;
    text-align: start;
  }
  /* Taak 284: een label breekt alleen tussen woorden ("Languag e" was fout); is één woord te lang, dan krimpt de letter (`krimp`). */
  .rij .label {
    flex: 1;
    min-width: 0;
    font-size: calc(1em * var(--krimp, 1));
  }
  /* Een Spelersnaam gaat over hooguit twee regels; een naam zonder spaties breekt waar het moet. */
  .rij .label.naam {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    overflow-wrap: anywhere;
    line-height: 1.2;
  }
  .rij .pijl {
    color: var(--tekst-stil);
  }
  .ikoon {
    flex: none;
    display: grid;
    place-items: center;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: var(--wit);
  }
  .ikoon.blauw {
    background: var(--tegel-lila);
    color: var(--tegel-lila-inkt);
  }
  .ikoon.rood {
    background: var(--tegel-roze);
    color: var(--tegel-roze-inkt);
  }
  .ikoon.groen {
    background: var(--goudvlak);
    color: var(--inkt);
  }
  .ikoon.roze {
    background: var(--tegel-lila);
    color: var(--tegel-lila-inkt);
  }
  .waarde {
    font-size: 0.88rem;
    font-weight: 600;
    color: var(--tekst-zacht);
  }
  .aantal {
    font-size: 0.85rem;
    font-weight: 800;
    color: var(--tekst-zacht);
  }
  .vink {
    display: grid;
    place-items: center;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: var(--goudvlak);
  }
  .lijst {
    flex: 0 1 auto;
    min-height: 0;
    overflow-y: auto;
  }
  .lijst .rij {
    padding-inline-end: 6px;
  }
  .rij.gevaar {
    color: var(--fout);
  }
  .rij:active {
    background: var(--blad-rand);
  }
  @media (hover: hover) {
    .rij:hover {
      background: #efe2bd;
    }
  }
  .rij[aria-pressed="true"] {
    background: #f3e2b0;
  }
  .beoordeel {
    display: flex;
    align-items: center;
    gap: 12px;
    min-height: 56px;
    padding: 0 16px;
    border-radius: var(--vel);
    background: var(--goudvlak);
    color: var(--inkt);
    font-weight: 800;
    text-decoration: none;
  }
  .beoordeel .label {
    flex: 1;
  }
  .beoordeel .schijfje {
    display: grid;
    place-items: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: var(--wit);
  }
  .sterren {
    letter-spacing: 2px;
    font-size: 0.8rem;
  }
  .rek .schuif {
    padding-bottom: calc(14px + var(--veilig-onder));
  }
</style>
