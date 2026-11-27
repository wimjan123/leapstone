<script lang="ts">
  // Het 3D-bord werkt hier niet (feature 251): er is geen plat scherm meer, dus dit scherm met "Try again". Bevy kan maar één keer
  // per pagina starten en `markeerMislukt` geldt tot de pagina opnieuw laadt: daarom laadt "Try again" de pagina opnieuw. Een
  // online Potje komt daarna terug (`halma.potje`); zie docs/bord3d.md, "Als 3D niet lukt".
  import Icoon from "./Icoon.svelte";
  import { t } from "./taal.svelte";

  // `reden`: `fout` (Bevy viel om: "Try again"), `toestel` (geen WebGL2: opnieuw laden helpt niet, dus een zin zonder knop) of
  // `build` (de WebAssembly van het 3D-bord zit niet in deze build; geen geval voor Spelers: de console zegt het, en de dev-server
  // ook op het scherm).
  let { reden }: { reden: "fout" | "toestel" | "build" } = $props();
</script>

<section class="fout3d" role="alert" aria-labelledby="fout3d-tekst">
  <span class="teken" aria-hidden="true"><Icoon naam="waarschuwing" maat={40} /></span>
  <p id="fout3d-tekst">{reden === "toestel" ? t("board3d.unsupported") : t("online.error")}</p>
  {#if reden === "build" && import.meta.env.DEV}<p class="bouw">web/src/wasm3d ontbreekt: npm --prefix web run wasm3d:snel</p>{/if}
  {#if reden !== "toestel"}<button class="knop-licht breed" onclick={() => location.reload()}>{t("common.tryAgain")}</button>{/if}
</section>

<style>
  .fout3d {
    min-height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
    padding: 24px;
    padding-bottom: calc(24px + var(--veilig-onder, 0px));
    text-align: center;
  }
  .teken {
    display: grid;
    place-items: center;
    width: 76px;
    height: 76px;
    border-radius: 50%;
    background: var(--fout-vlak, #f6e0d8);
    color: var(--fout, #9d2318);
  }
  /* Op de donkere zijde: crème tekst (zoals de uitslag op de tafel), contrast ruim boven 7 op 1. */
  p {
    margin: 0;
    font-size: 1.15rem;
    max-width: 22em;
    color: #fff3dc;
  }
  .bouw {
    font-family: monospace;
    font-size: 0.85rem;
  }
  /* Een plaat van porselein met een gouden rand, zoals de knoppen op de tafel: kobalt op crème. */
  button {
    max-width: 320px;
    background: #f7f1e0;
    color: #1f3a82;
    border: 1.5px solid #c9a95a;
    box-shadow: 0 3px 0 #7a6a44;
  }
</style>
