<script lang="ts">
  import { onMount } from "svelte";
  import { ApiFout, haalPrestaties, haalStatistieken, tekstVan, type Prestatie, type StatistiekRecord, type Statistieken } from "./online";
  import Tafel from "./Tafel.svelte";
  import Icoon from "./Icoon.svelte";
  import Laden from "./Laden.svelte";
  import { binnen } from "./overgang";
  import { krimp } from "./krimp";
  import { ratingLijn } from "./ratinglijn";
  import { getal as getalIn } from "./getal";
  import { huidigeTaal, t, type Sleutel } from "./taal.svelte";

  // My stats: de eigen cijfers van de Speler over zijn online Potjes. De server rekent alles uit
  // en geeft alleen de cijfers van de Speler van de sleutel; de app toont ze.
  let {
    sleutel,
    terug,
    verlopen,
  }: {
    sleutel: string;
    terug: () => void;
    /** De server kent de sleutel niet meer. */
    verlopen: () => void;
  } = $props();

  let stat = $state.raw<Statistieken | null>(null);
  let prestaties = $state.raw<Prestatie[]>([]);
  let fout = $state("");
  /** Het Record waarvan de Speler het Potje en de tegenstander ziet. */
  let open = $state<"sprong" | "overwinning" | null>(null);

  async function laad() {
    try {
      [stat, prestaties] = await Promise.all([haalStatistieken(sleutel), haalPrestaties(sleutel)]);
      fout = "";
    } catch (e) {
      if (e instanceof ApiFout && e.status === 401) return verlopen();
      fout = tekstVan(e);
    }
  }

  onMount(laad);

  const getal = (n: number, cijfers = 0) => getalIn(n, huidigeTaal(), cijfers);
  const procent = (x: number) => x.toLocaleString(huidigeTaal(), { style: "percent", maximumFractionDigits: 0 });

  // De Ratinglijn: een SVG van 300 x 120 met een punt per Potje.
  const B = 300;
  const H = 120;
  const RAND = 10;
  const lijn = $derived(ratingLijn(stat?.rating_verloop ?? [], B, H, RAND));

  const records = $derived.by(() => {
    const s = stat;
    if (!s) return [];
    return [
      { id: "sprong" as const, naam: t("stats.longestJump"), uitleg: t("stats.longestJumpInfo"), r: s.langste_sprong },
      { id: "overwinning" as const, naam: t("stats.fastestWin"), uitleg: t("stats.fastestWinInfo"), r: s.snelste_overwinning },
    ];
  });

  /** Het woord uit de woordenlijst staat in de zin met een kleine letter; hier staat het aan het begin. */
  const hoofd = (tekst: string) => tekst.charAt(0).toLocaleUpperCase(huidigeTaal()) + tekst.slice(1);

  const datum = (ms: number) => new Date(ms).toLocaleDateString(huidigeTaal(), { year: "numeric", month: "short", day: "numeric" });
  const sleutelVan = (id: string, uitleg = false) => `ach.${id}${uitleg ? ".how" : ""}` as Sleutel;

  const tegen = (r: StatistiekRecord) => t("stats.against", { names: r.tegenstanders.join(", ") });
</script>

{#snippet prestatieBlok()}
  <h2 class="kop kleinkop">{t("ach.title")}</h2>
  <ul class="prestaties lijstblok">
    {#each prestaties as pr (pr.id)}
      <li class="prestatie" class:behaald={pr.behaald_ms !== null} data-prestatie={pr.id}>
        <span class="label">{t(sleutelVan(pr.id))}</span>
        {#if pr.behaald_ms !== null}
          <span class="uitleg">{t("ach.earned", { date: datum(pr.behaald_ms) })}</span>
        {:else}
          <span class="uitleg">{t(sleutelVan(pr.id, true))}</span>
        {/if}
      </li>
    {/each}
  </ul>
{/snippet}

<!-- Op de tafel (taak 181): Terug en de naam van het scherm zijn voorwerpen, de cijfers liggen op de plaat. -->
<Tafel titel="stats.title" terug={{ label: t("common.back"), doe: () => terug() }}>
{#snippet inhoud()}
<section class="scherm stats" in:binnen>
  <h1 class="sr-only">{t("stats.title")}</h1>

  {#if fout}
    <div class="leeg">
      <p class="fout" role="alert">{fout}</p>
      <button class="knop-lijn" onclick={laad}>{t("common.tryAgain")}</button>
    </div>
  {:else if !stat}
    <Laden />
  {:else if stat.gespeeld === 0}
    <div class="leeg">
      <div class="teken schijf" aria-hidden="true"><Icoon naam="statistiek" maat={44} /></div>
    </div>
    <div class="blad">
      <p class="leeg-tekst">{t("stats.empty")}</p>
      <p class="hint">{t("stats.emptyHint")}</p>
      <div class="schuif" data-scrollt>{@render prestatieBlok()}</div>
    </div>
  {:else}
    <dl class="cijfers-blok">
      <!-- Taak 284: een getal wordt nooit afgekapt en een woord breekt niet midden in; de letter krimpt tot het past (`krimp`). -->
      <div class="cel"><dt {@attach krimp(0.6)}>{t("stats.played")}</dt><dd class="cijfers" {@attach krimp(0.3)}>{getal(stat.gespeeld)}</dd></div>
      <div class="cel won"><dt {@attach krimp(0.6)}>{t("stats.won")}</dt><dd class="cijfers" {@attach krimp(0.3)}>{getal(stat.gewonnen)}</dd></div>
      <div class="cel lost"><dt {@attach krimp(0.6)}>{t("stats.lost")}</dt><dd class="cijfers" {@attach krimp(0.3)}>{getal(stat.verloren)}</dd></div>
      <div class="cel breed donker"><dt {@attach krimp(0.6)}>{t("stats.share")}</dt><dd class="cijfers" {@attach krimp(0.3)}>{stat.deel_gewonnen === null ? "–" : procent(stat.deel_gewonnen)}</dd></div>
      <div class="cel breed"><dt {@attach krimp(0.6)}>{t("stats.avg")}</dt><dd class="cijfers" {@attach krimp(0.3)}>{stat.gemiddelde_plek === null ? "–" : getal(stat.gemiddelde_plek, 1)}</dd></div>
    </dl>

    <div class="blad">
      <div class="schuif" data-scrollt>
        <h2 class="kop kleinkop">{t("stats.ratingLine", { n: 50 })}</h2>
        <div class="lijnvlak">
          {#if lijn}
            <svg viewBox="0 0 {B} {H}" role="img" aria-label={t("stats.ratingLineLabel", { n: lijn.punten.length, rating: lijn.laatste })}>
              {#if lijn.punten.length > 1}<path d={lijn.pad} class="streek" vector-effect="non-scaling-stroke" />{/if}
              {#each lijn.punten as p, i (i)}
                <circle class="punt" class:laatste={i === lijn.punten.length - 1} cx={p.x} cy={p.y} r={i === lijn.punten.length - 1 ? 3.5 : 2} />
              {/each}
            </svg>
            <div class="as cijfers" class:een={lijn.as.length === 1} aria-hidden="true">{#each lijn.as as w, i (i)}<span>{w}</span>{/each}</div>
          {:else}
            <p class="stil">{t("stats.noRating")}</p>
          {/if}
        </div>

        <!-- Taak 233: geen kop en geen lege balk zolang er geen Record is. -->
        {#if records.some((rec) => rec.r)}
        <h2 class="kop kleinkop">{t("stats.records")}</h2>
        <ul class="records lijstblok">
          {#each records as rec (rec.id)}
            <li>
              <button class="rij" aria-expanded={rec.r ? open === rec.id : undefined} disabled={!rec.r} onclick={() => (open = open === rec.id ? null : rec.id)}>
                <span class="label">{rec.naam}</span>
                <span class="waarde cijfers">{rec.r ? getal(rec.r.waarde) : "–"}</span>
              </button>
              {#if rec.r && open === rec.id}
                <div class="detail" role="group" aria-label={rec.naam}>
                  <p>{rec.uitleg}</p>
                  <p>{hoofd(t("stats.game", { id: rec.r.potje_id }))}</p>
                  <p>{tegen(rec.r)}</p>
                </div>
              {/if}
            </li>
          {/each}
        </ul>
        {/if}

        {@render prestatieBlok()}
      </div>
    </div>
  {/if}
</section>
{/snippet}
</Tafel>

<style>
  /* De cijfers op de tafel: tegels van porselein; gewonnen is goud, verloren zacht rood, het aandeel donker. */
  .cijfers-blok {
    margin: auto 0 0;
    flex: none;
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 8px;
  }
  .cel {
    grid-column: span 2;
    padding: 16px 14px;
    border-radius: 22px;
    background: var(--pilvlak);
    min-width: 0;
  }
  .cel.breed {
    grid-column: span 3;
  }
  .cel.won {
    background: var(--goudvlak);
  }
  .cel.lost {
    background: var(--tegel-roze);
  }
  .cel.donker {
    background: var(--inkt);
    color: var(--wit);
  }
  /* Taak 284: breekt alleen tussen woorden ("GESPIE LT" was fout); een te lang woord maakt de letter kleiner. */
  dt {
    font-size: calc(0.72rem * var(--krimp, 1));
    font-weight: 800;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    opacity: 0.8;
  }
  dd {
    margin: 4px 0 0;
    white-space: nowrap;
    font-size: calc(2.4rem * var(--krimp, 1));
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -0.02em;
  }
  .blad {
    margin-top: auto;
    padding: 26px 18px 0;
    min-height: 0;
  }
  .blad .schuif {
    flex: 0 1 auto;
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding-bottom: calc(18px + var(--veilig-onder));
  }
  .kleinkop {
    margin: 6px 0 0;
    text-align: start;
  }
  .lijnvlak {
    position: relative;
    flex: none;
    border-radius: var(--vel);
    background: var(--zacht);
    padding: 14px 48px 14px 16px;
  }
  .lijnvlak svg {
    display: block;
    width: 100%;
    height: auto;
    overflow: visible;
  }
  .streek {
    fill: none;
    stroke: var(--inkt);
    stroke-width: 2.5;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
  .punt {
    fill: var(--wit);
    stroke: var(--inkt);
    stroke-width: 1.5;
  }
  .punt.laatste {
    fill: var(--goudvlak);
    stroke: var(--inkt);
    stroke-width: 2;
  }
  .as {
    position: absolute;
    inset: 14px 12px 14px auto;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    font-size: 0.74rem;
    font-weight: 700;
    color: var(--tekst-zacht);
    text-align: end;
  }
  /* Eén waarde (alle Potjes dezelfde Rating): naast de lijn, in het midden. */
  .as.een {
    justify-content: center;
  }
  .stil {
    margin: 0;
    padding: 12px;
    color: var(--tekst-zacht);
    font-weight: 600;
  }
  .rij {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 14px;
    min-height: 58px;
    padding: 0 16px;
    border-radius: 0;
    font-size: 1rem;
    font-weight: 700;
    color: var(--tekst);
  }
  .rij:disabled {
    color: var(--tekst-stil);
    opacity: 0.7;
  }
  .rij .label {
    flex: 1;
    text-align: start;
  }
  .waarde {
    font-size: 1.3rem;
    font-weight: 800;
  }
  .detail {
    padding: 0 16px 14px;
    color: var(--tekst-zacht);
    font-size: 0.92rem;
    font-weight: 500;
  }
  .detail p {
    margin: 4px 0 0;
    overflow-wrap: anywhere;
  }
  .prestatie {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 12px 16px;
    color: var(--tekst-stil);
    opacity: 0.7;
    filter: grayscale(1);
  }
  .prestatie.behaald {
    color: var(--tekst);
    opacity: 1;
    filter: none;
    background: var(--goudvlak);
  }
  .prestatie .label {
    font-weight: 800;
  }
  .prestatie .uitleg {
    font-size: 0.88rem;
    font-weight: 500;
    overflow-wrap: anywhere;
  }
  .leeg {
    flex: 1;
    display: grid;
    place-items: center;
  }
  .teken {
    width: 112px;
    height: 112px;
    color: var(--inkt);
  }
  .leeg-tekst {
    margin: 0;
    text-align: center;
    font-size: 1.25rem;
    font-weight: 800;
    letter-spacing: -0.01em;
  }
</style>
