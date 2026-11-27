<script lang="ts">
  // De laadtafel (taak 223, feature 221): zolang de 3D-tafel laadt, ligt de zijden tafel er al (de achtergrond van de pagina) met
  // een klein laadteken dat rustig beweegt. Is de tafel klaar (`aan` wordt onwaar), dan vervaagt de laadtafel en komt de tafel met
  // het bord en de voorwerpen erachter in beeld (de laag met het 3D-bord, `bord3d-laag.aan`). Eén component, voor elk scherm
  // dat op de tafel wacht. Met minder beweging staat alles meteen in beeld en staat het laadteken stil.
  import Laden from "./Laden.svelte";
  import { opZijde } from "./lak";
  import { laadtafelUit } from "./overgang";

  let { aan }: { aan: boolean } = $props();
  // Niet elk scherm heeft al een tafel (`Voorwerpen`) die de zijde neerlegt, zoals het laden na Play online: de laadtafel doet het zelf.
  $effect(() => (aan ? opZijde() : undefined));
</script>

{#if aan}
  <div class="laadtafel" out:laadtafelUit>
    <div class="teken"><Laden /></div>
  </div>
{/if}

<style>
  /* Vangt alle vingers: tikken kan pas als de tafel klaar is. De zijde komt van de pagina (`body`). */
  .laadtafel {
    position: fixed;
    inset: 0;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: auto;
  }
  .teken {
    display: flex;
    width: 64px;
    height: 40px;
  }
</style>
