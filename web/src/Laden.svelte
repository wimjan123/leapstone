<script lang="ts">
  import Steentje from "./Steentje.svelte";
  import { t } from "./taal.svelte";

  // Even wachten: drie kralen in de kleuren van de Spelers lichten om de beurt op.
</script>

<div class="laden" role="status">
  <div class="kralen" aria-hidden="true">
    {#each [0, 1, 2] as s (s)}
      <span class="kraal" style="--i:{s}"><Steentje speler={s} maat={11} stip /></span>
    {/each}
  </div>
  <p class="tekst">{t("common.loading")}</p>
</div>

<style>
  .laden {
    flex: 1;
    min-height: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 14px;
  }
  .kralen {
    display: flex;
    gap: 12px;
  }
  .tekst {
    margin: 0;
    font-weight: 700;
    /* Taak 240: het wachtteken ligt altijd op de donkere zijden tafel (de pagina), nooit op een crème blad: crème letters (13:1). */
    color: #f7f1e0;
  }
  .kraal {
    display: block;
    line-height: 0;
    animation: kraal 1200ms calc(var(--i) * 160ms) cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
  @keyframes kraal {
    0%,
    70%,
    100% {
      opacity: 0.35;
      transform: translateY(0);
    }
    30% {
      opacity: 1;
      transform: translateY(-6px);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .kraal {
      animation: none;
    }
  }
</style>
