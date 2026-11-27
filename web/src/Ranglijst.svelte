<script lang="ts">
  import { onMount } from "svelte";
  import { ApiFout, haalRanglijst, tekstVan, type RanglijstRij } from "./online";
  import Icoon from "./Icoon.svelte";
  import Laadtafel from "./Laadtafel.svelte";
  import Laden from "./Laden.svelte";
  import { binnen } from "./overgang";
  import { schuifteken } from "./schuifteken";
  import { huidigeTaal, t } from "./taal.svelte";
  import { getal, ratingGetal } from "./getal";
  import { bordWarm } from "./bord3d";
  import Voorwerpen, { type Vakken } from "./Voorwerpen.svelte";
  import { breedLijst, kolomStijl, platenStijl, RANGLIJST, tafelStand } from "./voorwerpen-lijsten";
  import { isBreed } from "./breed.svelte";

  // Ranglijst: de server sorteert op Rating (en telt gewonnen en gespeelde online Potjes); de app toont de lijst in die volgorde.
  let {
    sleutel,
    ikId,
    terug,
    verlopen,
  }: {
    sleutel: string;
    ikId: number;
    terug: () => void;
    /** De server kent de sleutel niet meer. */
    verlopen: () => void;
  } = $props();

  let lijst = $state.raw<RanglijstRij[] | null>(null);
  let fout = $state("");

  async function laad() {
    try {
      lijst = await haalRanglijst(sleutel);
      fout = "";
    } catch (e) {
      if (e instanceof ApiFout && e.status === 401) return verlopen();
      fout = tekstVan(e);
    }
  }

  onMount(laad);

  // Het scherm als 3D-tafel (taak 180, uiterlijk 1b): de lijst op een porseleinen plaat, de knop Back als voorwerp.
  let tafelKlaar = $state(false);
  // Kwam de Speler van een andere tafel (UI-overgangen), dan blijft die in beeld tot deze tafel klaar is.
  const warm = bordWarm();
  /** De tafel is er nog niet (en stond ook nog niet): de laadtafel (taak 224). */
  const laadt = $derived(!tafelKlaar && !warm);
  let vakken = $state<Vakken>({});
  const stand = tafelStand();
  const naamVan = (r: RanglijstRij) => (r.speler_id === ikId ? t("common.nameYou", { name: r.spelersnaam }) : r.spelersnaam);
</script>

{#snippet inhoud()}
  {#if fout}
    <div class="leeg">
      <p class="fout" role="alert">{fout}</p>
      <button class="knop-lijn" onclick={laad}>{t("common.tryAgain")}</button>
    </div>
  {:else if !lijst}
    <Laden />
  {:else if lijst.length === 0}
    <div class="leeg">
      <div class="beker schijf" aria-hidden="true"><Icoon naam="ranglijst" maat={40} /></div>
      <p>{t("ranking.none")}</p>
    </div>
  {:else}
    <ol class="plaat-lijst schuif" aria-label={t("common.leaderboard")} data-scrollt>
      {#each lijst as r, i (r.speler_id)}
        <li class:jij={r.speler_id === ikId} class:top={i < 3}>
          <span class="nr">{i + 1}</span>
          <span class="rnaam">
            <span class="rn">{naamVan(r)}</span>
            <span class="gew">{t("ranking.won")} {getal(r.gewonnen, huidigeTaal())} {t("ranking.of", { played: getal(r.gespeeld, huidigeTaal()) })}</span>
          </span>
          <span class="rating cijfers"><span class="rlabel">{t("ranking.rating")}</span>{ratingGetal(r.rating, huidigeTaal())}</span>
        </li>
      {/each}
    </ol>
  {/if}
{/snippet}

<Laadtafel aan={laadt} />
<section class="scherm ranglijst" class:tafel={tafelKlaar || warm} in:binnen>
  <Voorwerpen
    voorwerpen={breedLijst(RANGLIJST, isBreed())}
    knoppen={[{ id: "terug", tekst: t("common.back"), doe: terug }]}
    {stand}
    naam={t("common.leaderboard")}
    klaar={() => (tafelKlaar = true)}
    bind:vakken
  />
  {#if tafelKlaar}
    <div class="op-plaat" class:breed-tekst={isBreed()} style={isBreed() ? kolomStijl(vakken.lijst) : platenStijl(vakken.lijst)} use:schuifteken>{@render inhoud()}</div>
  {/if}
</section>

<style>
  /* De lijst op de porseleinen plaat van de tafel (3D): gewone tekst, scrolbaar. */
  .op-plaat {
    position: fixed;
    z-index: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
    /* De plaat van taak 181 (Tafel.svelte): de kleuren komen uit `:root` (app.css); de vlakken zijn hier iets minder rond. */
    --vel: 12px;
    color: var(--inkt);
    overflow: hidden;
  }
  .tafel {
    gap: 0;
    padding: 0;
  }
  .plaat-lijst {
    list-style: none;
    margin: 0;
    padding: 6px 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  /* Taak 284: een rij krimpt niet in de schuivende lijst (anders schoven rijen met twee regels over elkaar). */
  .plaat-lijst li {
    flex: none;
    display: flex;
    align-items: center;
    gap: 10px;
    min-height: 48px;
    padding: 4px 10px;
    border-radius: 12px;
    border-bottom: 1px solid #dcc78f;
  }
  .plaat-lijst li.top {
    background: #f3e2b0;
  }
  /* De eigen rij: rood lak met een gouden rand en crème letters (taak 184). */
  .plaat-lijst li.jij {
    background: #8f1d12;
    box-shadow: inset 0 0 0 1.5px var(--goud);
    color: #fff3dc;
  }
  .plaat-lijst .nr,
  .plaat-lijst .gew {
    color: var(--tekst-zacht);
  }
  .plaat-lijst li.jij .nr,
  .plaat-lijst li.jij .gew {
    color: #f6dcc8;
  }
  .op-plaat .leeg {
    flex: 1;
  }
  .op-plaat .leeg p,
  .op-plaat .beker {
    color: var(--inkt);
  }

  .nr {
    flex: none;
    width: 1.7em;
    font-size: 1.05rem;
    font-weight: 800;
    color: var(--tekst-zacht);
    text-align: start;
  }
  .jij .nr {
    color: var(--inkt);
  }
  .rnaam {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
  }
  /* Een naam gaat over hooguit twee regels (taak 233); een naam zonder spaties breekt waar het moet. */
  .rn,
  .gew {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    overflow-wrap: anywhere;
  }
  .rn {
    font-weight: 700;
    line-height: 1.2;
  }
  .gew {
    font-size: 0.74rem;
    font-weight: 600;
    color: var(--tekst-zacht);
  }
  .jij .gew {
    color: var(--inkt);
  }
  .rating {
    flex: none;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    font-size: 1.15rem;
    font-weight: 800;
    line-height: 1.1;
  }
  /* Het getal heeft een label: zonder dat is 1065 geen Rating (taak 233). */
  .rlabel {
    font-family: var(--letter);
    font-size: 0.62rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--tekst-zacht);
  }
  .jij .rlabel {
    color: inherit;
    opacity: 0.85;
  }
  .leeg {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
    text-align: center;
    padding-bottom: 20px;
  }
  .beker {
    width: 96px;
    height: 96px;
    color: var(--inkt);
  }
  .leeg p {
    margin: 0;
    font-size: 1.2rem;
    font-weight: 700;
  }
  @keyframes rij-in {
    from {
      opacity: 0;
    }
  }
  @keyframes trap-in {
    from {
      opacity: 0;
      transform: translateY(14px);
    }
  }
</style>
