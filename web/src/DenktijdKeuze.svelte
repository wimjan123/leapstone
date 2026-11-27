<script lang="ts">
  import Icoon from "./Icoon.svelte";
  import { t } from "./taal.svelte";
  import { DENKTIJDEN, denktijdNaam, denktijdTekst, type Denktijd } from "./denktijd";

  // De Denktijd voor een nieuw online Potje: een strook met vakken. Elk vak is een klokje; het
  // gevulde deel is de tijd (2 minuten is een hele klok). Zonder grens: het teken oneindig.
  let { denktijd = $bindable(), naam }: { denktijd: Denktijd; naam: string } = $props();

  const LANGSTE = 120;

  /** Een taartpunt vanaf 12 uur met de klok mee, op een klok met straal `r` rond (12, 12). */
  function punt(deel: number, r = 6.25): string {
    if (deel >= 1) return `M12 ${12 - r}a${r} ${r} 0 1 1 0 ${2 * r}a${r} ${r} 0 1 1 0 ${-2 * r}Z`;
    const hoek = deel * 2 * Math.PI;
    const x = 12 + r * Math.sin(hoek);
    const y = 12 - r * Math.cos(hoek);
    return `M12 12V${12 - r}A${r} ${r} 0 ${deel > 0.5 ? 1 : 0} 1 ${x.toFixed(3)} ${y.toFixed(3)}Z`;
  }
</script>

<div class="groep" role="radiogroup" aria-label={t("moveTime.label")}>
  {#each DENKTIJDEN as d (d)}
    <label class="keus" class:aan={denktijd === d}>
      <input type="radio" name={naam} value={d} bind:group={denktijd} />
      <span class="sr-only">{denktijdNaam(d)}</span>
      <span class="teken" aria-hidden="true">
        {#if d === null}
          <Icoon naam="oneindig" maat={22} />
        {:else}
          <svg class="klok" width="22" height="22" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="8.25" />
            <path d={punt(d / LANGSTE)} />
          </svg>
        {/if}
      </span>
      <span class="getal cijfers" aria-hidden="true">{d === null ? t("moveTime.off") : denktijdTekst(d)}</span>
    </label>
  {/each}
</div>

<style>
  /* Zoals de strook met het aantal Spelers: een zacht vlak met vakken, het gekozen vak is donker. */
  .groep {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 4px;
    flex: none;
    padding: 4px;
    border-radius: 22px;
    background: var(--zacht);
  }
  .keus {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 7px;
    height: 64px;
    border-radius: 18px;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
    transition: background-color 180ms ease-out;
  }
  .keus input {
    position: absolute;
    inset: 0;
    margin: 0;
    opacity: 0;
    cursor: pointer;
  }
  .teken {
    display: block;
    line-height: 0;
    color: var(--tekst);
    opacity: 0.6;
    transition:
      opacity 180ms ease-out,
      transform 320ms var(--uit);
  }
  .klok circle {
    fill: none;
    stroke: currentColor;
    stroke-width: 1.5;
  }
  .klok path {
    fill: currentColor;
  }
  .getal {
    white-space: nowrap;
    font-size: 0.74rem;
    font-weight: 700;
    color: var(--tekst-zacht);
    transition: color 180ms ease-out;
  }
  .keus.aan {
    background: var(--inkt);
  }
  .keus.aan .teken {
    opacity: 1;
    color: var(--wit);
    transform: scale(1.08);
  }
  .keus.aan .getal {
    color: var(--goudvlak);
  }
  .keus:active .teken {
    transform: scale(0.94);
  }
  .keus:has(input:focus-visible) {
    outline: 3px solid var(--focus);
    outline-offset: 2px;
  }
  @media (prefers-reduced-motion: reduce) {
    .keus,
    .teken {
      transition: none;
    }
  }
</style>
