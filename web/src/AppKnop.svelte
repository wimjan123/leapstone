<script lang="ts">
  import { winkelKnoppen } from "./appknop";
  import appStore from "./assets/app-store-badge.svg";
  import googlePlay from "./assets/google-play-badge.svg";
  import { t } from "./taal.svelte";

  /** Leapstone in de App Store en in Google Play. */
  const APP_STORE_LINK = "https://apps.apple.com/app/id6831230722";
  const GOOGLE_PLAY_LINK = "https://play.google.com/store/apps/details?id=nl.leapstone.app";
  const winkels = winkelKnoppen();
</script>

{#if winkels.length}
  <div class="winkels">
    {#each winkels as winkel (winkel)}
      {#if winkel === "apple"}
        <a class="app-knop" href={APP_STORE_LINK} target="_blank" rel="noopener" aria-label={t("appstore.get")}>
          <img src={appStore} alt="" width="120" height="40" />
        </a>
      {:else}
        <a class="app-knop" href={GOOGLE_PLAY_LINK} target="_blank" rel="noopener" aria-label={t("googleplay.get")}>
          <!-- Google: minstens 28 px hoog en niet kleiner dan de badge van de App Store ernaast (40 px hoog). Ongewijzigd, verhouding 238,96 : 70,87. -->
          <img class="play" src={googlePlay} alt="" width="135" height="40" />
        </a>
      {/if}
    {/each}
  </div>
{/if}

<style>
  .winkels {
    flex: none;
    align-self: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    max-width: 100%;
  }
  .app-knop {
    display: block;
    max-width: 100%;
    line-height: 0;
    border-radius: 7px;
    transition: transform 160ms ease-out;
  }
  .app-knop img {
    display: block;
    /* Kleiner in een smal vak (het Startmenu op een tablet, taak 206), nooit groter dan 120 x 40. */
    width: min(120px, 100%);
    height: auto;
  }
  /* Google Play: 40 px hoog is even hoog als de App Store-badge, dus niet kleiner (regel van Google). */
  .app-knop img.play {
    width: min(135px, 100%);
  }
  .app-knop:active {
    transform: scale(0.97);
  }
  .app-knop:focus-visible {
    outline: 2px solid var(--tekst);
    outline-offset: 3px;
  }
</style>
