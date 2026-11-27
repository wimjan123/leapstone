<script lang="ts">
  import { onMount } from "svelte";
  import { opBalkje } from "./prestaties";
  import type { PrestatieId } from "./online";
  import { t } from "./taal.svelte";

  // Het balkje bij een nieuwe Prestatie (taak 174): onderaan, drie seconden, laat alle tikken door.
  // Het ligt op de plek van de onderbalk (of het blad van de Dagelijkse puzzel), nooit op het bord.
  let id = $state<PrestatieId | null>(null);
  onMount(() => opBalkje((nu) => (id = nu)));
</script>

{#if id}
  {#key id}
    <div class="prestatiebalk" role="status" data-testid="prestatiebalk">
      <span class="ster" aria-hidden="true">★</span>
      <span class="tekst">{t("ach.toast", { name: t(`ach.${id}`) })}</span>
    </div>
  {/key}
{/if}

<style>
  .prestatiebalk {
    position: fixed;
    z-index: 30;
    inset-inline: max(28px, calc(50% - 232px));
    bottom: calc(14px + var(--veilig-onder));
    min-height: 66px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 6px 18px;
    border-radius: 14px;
    /* Rood lak met een gouden rand en crème letters (1b); crème op rood is 8:1. */
    background: #8f1d12;
    color: #fff3dc;
    box-shadow:
      inset 0 0 0 2px #d6a93e,
      0 6px 18px rgb(11 14 24 / 0.45);
    font-weight: 800;
    text-align: center;
    pointer-events: none;
    animation: op 220ms ease-out;
  }
  .ster {
    flex: none;
    color: #f3d98a;
  }
  @keyframes op {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .prestatiebalk {
      animation: none;
    }
  }
</style>
