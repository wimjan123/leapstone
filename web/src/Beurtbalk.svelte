<script lang="ts">
  import type { Snippet } from "svelte";
  import Icoon from "./Icoon.svelte";
  import Steentje from "./Steentje.svelte";
  import { spelerKleur } from "./spelers";
  import { t } from "./taal.svelte";
  import { AFTEL_VANAF_S, DRINGEND_VANAF_S, restDeel, restSeconden } from "./denktijd";

  // De beurt van het Potje voor schermlezers (taak 179): op de tafel staat de beurt op de jade aanwijzer, en deze balk is
  // onzichtbaar. Per Speler zijn kleur en naam, wie aan de beurt is, een overgeslagen beurt en met een Denktijd de laatste
  // seconden. De app beslist niets: is de tijd op, dan wacht hij op de server.
  let {
    spelers,
    aan,
    naam,
    denkt = false,
    jij = false,
    denktijd = null,
    deadline = null,
    overgeslagen = null,
    rechts,
  }: {
    /** Per plek de kleur (Speler vanaf 0) en of hij nog meedoet. */
    spelers: { speler: number; uit?: boolean; naam?: string }[];
    /** De Speler aan de beurt (kleur), of null als het Potje voorbij is. */
    aan: number | null;
    naam: string;
    /** Een Computerspeler denkt na. */
    denkt?: boolean;
    /** Online: jij bent aan de beurt. */
    jij?: boolean;
    /** De Denktijd in seconden, of null zonder grens. */
    denktijd?: number | null;
    /** Wanneer de beurt op is, in de klok van deze telefoon (ms sinds 1970), of null. */
    deadline?: number | null;
    /** Een beurt die net is overgeslagen: van welke Speler (kleur), met een sleutel per keer. */
    overgeslagen?: { speler: number; sleutel: number } | null;
    rechts?: Snippet;
  } = $props();

  const telt = $derived(denktijd !== null && deadline !== null && aan !== null);
  let nu = $state(Date.now());
  $effect(() => {
    if (!telt) return;
    nu = Date.now();
    const klok = setInterval(() => (nu = Date.now()), 250);
    return () => clearInterval(klok);
  });
  const seconden = $derived(telt ? restSeconden(deadline!, nu) : null);
  /** 27 wordt 0:27. */
  const klok = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  // Met drie Spelers of minder staat de naam in elke pil, met meer alleen bij wie aan de beurt is.
  const metNamen = $derived(spelers.length <= 3);
  const aftellen = $derived(seconden !== null && seconden <= AFTEL_VANAF_S);
  const dringend = $derived(seconden !== null && seconden <= DRINGEND_VANAF_S);

  // Het leeglopen zelf is een CSS-animatie: begin en duur liggen vast per deadline, zodat de
  // seconden-klok hierboven de animatie niet stoort.
  const loop = $derived.by(() => {
    if (!telt) return null;
    const t = Date.now();
    return { van: restDeel(deadline!, denktijd!, t), duur: Math.max(0, deadline! - t), sleutel: `${aan}:${deadline}` };
  });

  // Een overgeslagen beurt licht kort op en verdwijnt dan.
  let toonOverslaan = $state<{ speler: number; sleutel: number } | null>(null);
  $effect(() => {
    if (!overgeslagen) return;
    toonOverslaan = overgeslagen;
    const t = setTimeout(() => (toonOverslaan = null), 1800);
    return () => clearTimeout(t);
  });
</script>

<header class="hud" class:jij class:dringend>
  <div class="segmenten">
    {#each spelers as s (s.speler)}
      <span
        class="segment"
        class:aan={s.speler === aan}
        class:uit={s.uit}
        class:overgeslagen={toonOverslaan?.speler === s.speler}
        style="--k:{spelerKleur(s.speler)}"
      >
        <span class="schijf pion"><Steentje speler={s.speler} maat={24} /></span>
        {#if s.naam && (metNamen || s.speler === aan)}<span class="pnaam" aria-hidden="true">{s.naam}</span>{/if}
        {#if toonOverslaan?.speler === s.speler}
          {#key toonOverslaan.sleutel}<i class="weg"></i>{/key}
        {/if}
      </span>
    {/each}
  </div>
  <div class="balk" class:telt aria-live="polite">
    {#if telt && loop}
      {#key loop.sleutel}
        <i class="tijd loopt" data-testid="denktijd" style="--rest:{loop.van.toFixed(4)};--duur:{Math.round(loop.duur)}ms"></i>
      {/key}
    {:else if aan !== null && jij}
      <i class="tijd vol" style="--rest:1"></i>
    {/if}
    <span class="wie">
      {#if aan !== null}<Icoon naam="klok" maat={16} />{/if}
      <strong>{naam}</strong>
      {#if toonOverslaan}
        {#key toonOverslaan.sleutel}
          <span class="overslaan" data-testid="overgeslagen" style="--k:{spelerKleur(toonOverslaan.speler)}">
            <span class="sr-only">{t("game.turnSkipped")}</span>
            <Steentje speler={toonOverslaan.speler} maat={14} />
            <Icoon naam="overslaan" maat={16} />
          </span>
        {/key}
      {/if}
      {#if denkt}
        <span class="denkt"><span class="sr-only">{t("game.thinking")}</span><i></i><i></i><i></i></span>
      {/if}
    </span>
    {@render rechts?.()}
    {#if aftellen && seconden !== null}
      <span class="aftel cijfers" data-testid="aftellen"><span class="sr-only">{t("game.secondsLeft")} </span>{klok(seconden)}</span>
    {/if}
  </div>
</header>

<style>
  /* Alleen voor schermlezers: op de tafel staat de beurt op de jade aanwijzer. */
  .hud {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }
</style>
