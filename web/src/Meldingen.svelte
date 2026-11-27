<script lang="ts">
  import { onMount } from "svelte";
  import Icoon from "./Icoon.svelte";
  import { t } from "./taal.svelte";
  import {
    apnsStatus,
    heeftMeldingen,
    isIosApp,
    leesMeldingStatus,
    serverKanMeldingen,
    vernieuwAbonnement,
    vernieuwApnsToken,
    zetMeldingenAan,
    zetMeldingenUit,
    type MeldingStatus,
  } from "./meldingen";

  // `klein`: alleen een belletje (voor de onderbalk van het spel), zonder uitleg.
  let { sleutel, klein = false }: { sleutel: string; klein?: boolean } = $props();

  let status = $state<MeldingStatus>("laden");
  let bezig = $state(false);
  let fout = $state("");

  const toon = heeftMeldingen();

  onMount(async () => {
    if (!toon) return;
    if (isIosApp()) {
      try {
        const s = await apnsStatus();
        status = s.status;
        // Dit scherm hoort bij een online Potje: het moment om voor het eerst om toestemming te vragen.
        if (s.vraagNog) await wissel();
        else if (s.status === "aan") await vernieuwApnsToken(sleutel);
      } catch {
        status = "niet-beschikbaar";
      }
      return;
    }
    try {
      status = await leesMeldingStatus();
      if ((status === "uit" || status === "aan") && !(await serverKanMeldingen())) status = "niet-beschikbaar";
      else if (status === "aan") await vernieuwAbonnement(sleutel);
    } catch {
      status = "niet-beschikbaar";
    }
  });

  async function wissel() {
    bezig = true;
    fout = "";
    try {
      status = status === "aan" ? await zetMeldingenUit(sleutel) : await zetMeldingenAan(sleutel);
    } catch {
      fout = t("notif.failed");
    } finally {
      bezig = false;
    }
  }
</script>

<!-- In de Android-app komen Meldingen later via Firebase: geen knop. De iPhone-app gebruikt APNs. -->
{#if toon && status !== "laden"}
  {#if klein}
    {#if status === "uit" || status === "aan"}
      <button
        class="knop-ikoon bel-klein"
        class:aan={status === "aan"}
        onclick={wissel}
        disabled={bezig}
        aria-pressed={status === "aan"}
        aria-label={status === "aan" ? t("notif.on") : t("notif.turnOn")}
        data-testid="meldingen"
      >
        <Icoon naam="bel" />
      </button>
    {/if}
  {:else}
    <div class="meldingen" data-testid="meldingen">
      {#if status === "uit" || status === "aan"}
        <button class="knop-lijn porselein bel" class:aan={status === "aan"} onclick={wissel} disabled={bezig} aria-pressed={status === "aan"}>
          <Icoon naam={status === "aan" ? "vink" : "bel"} maat={18} />
          {status === "aan" ? t("notif.on") : t("notif.turnOn")}
        </button>
      {:else if status === "geblokkeerd"}
        <p class="hint">{t("notif.blocked")}</p>
      {:else if status === "beginscherm"}
        <p class="hint">{t("notif.homeScreen")}</p>
      {:else}
        <p class="hint">{t("notif.unavailable")}</p>
      {/if}
      {#if fout}<p class="fout" role="alert">{fout}</p>{/if}
    </div>
  {/if}
{/if}

<style>
  .meldingen {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    flex: none;
  }
  /* Een smalle porseleinen knop met een belletje; aan is goud met een vinkje (1b). */
  .bel {
    min-height: 44px;
    padding: 0;
    padding-inline: 14px 18px;
    gap: 8px;
    font-size: 0.9rem;
  }
  .bel.aan {
    background: var(--goudvlak);
  }
  /* In de onderbalk of de hoek: aan is een stip van rood lak met een crème rand naast de bel; de kleur van de bel volgt de balk. */
  .bel-klein {
    position: relative;
  }
  .bel-klein.aan::after {
    content: "";
    position: absolute;
    top: 8px;
    inset-inline-end: 14px;
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: #b2301c;
    box-shadow: 0 0 0 2px #fff3dc;
  }
  .hint {
    font-size: 0.85rem;
    font-weight: 600;
    max-width: 34ch;
  }
</style>
