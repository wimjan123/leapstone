<script lang="ts">
  import LakSteen from "./LakSteen.svelte";
  import { GOUD, LAK_STENEN } from "./lak";

  // Een kleine Steen buiten het bord, van lak (ontwerp 1b): een gekleurde kop met een gouden
  // bies en het teken erop. `maat`: de hoogte in px. `stip`: alleen een kraal in de kleur (voor namen in lijsten en de HUD).
  // Alleen versiering: de naam of kleur staat altijd ook in tekst.
  // `lak` (taak 188) is sinds taak 189 altijd waar: elk Steentje is van lak. De eigenschap blijft voor bestaande aanroepen.
  let { speler, maat = 20, stip = false }: { speler: number; maat?: number; stip?: boolean; lak?: boolean } = $props();

  const id = $props.id();
  const lakSteen = $derived(LAK_STENEN[speler % LAK_STENEN.length]);
</script>

{#if stip}
  <span class="stip" aria-hidden="true" style="--maat:{maat}px;--k:{lakSteen.kleur};--rand:{GOUD.midden}"></span>
{:else}
  <svg class="pion" width={maat * 1.1} height={maat} viewBox="-0.5 -0.78 1 0.9" aria-hidden="true" focusable="false">
    <ellipse cx="0.02" cy="0.02" rx="0.46" ry="0.13" fill="#0b0e18" opacity="0.28" />
    <LakSteen {speler} id="{id}-s" />
  </svg>
{/if}

<style>
  .pion {
    display: block;
    flex: none;
    overflow: visible;
  }
</style>
