<script lang="ts">
  import { tick, untrack } from "svelte";
  import { SvelteSet } from "svelte/reactivity";
  import { bewaarGelezen, blokkeer, haalVasteZinnen, leesGelezen, MAX_BERICHT, rapporteer, tekstVan, type Bericht } from "./online";
  import Icoon from "./Icoon.svelte";
  import Steentje from "./Steentje.svelte";
  import { t, vasteZin } from "./taal.svelte";

  // Een Snel potje kent alleen Vaste zinnen: de lijst komt van de server, één tik stuurt.
  // De Chat van een online Potje: een knop met een bolletje voor ongelezen Berichten en een vak
  // dat van onderen opent. Berichten zijn altijd platte tekst; Svelte zet ze veilig op het scherm.
  // Lang tikken (of tikken, Enter of de schermlezer) op een Bericht van een ander geeft Report en Block.
  let {
    potjeId,
    snel = false,
    berichten,
    mijnPlek,
    sleutel,
    stuurBericht,
    plaat = null,
  }: {
    potjeId: number;
    /** Een Snel potje: alleen Vaste zinnen, geen tekstveld. */
    snel?: boolean;
    berichten: Bericht[];
    mijnPlek: number;
    sleutel: string;
    stuurBericht: (tekst: string) => Promise<void>;
    /**
     * Breed scherm (taak 236): de plek (CSS) van de plaat naast het bord waar de Chat altijd open op ligt, of null. Dan is er geen
     * knop en geen vak dat van onderen opent.
     */
    plaat?: string | null;
  } = $props();

  let dicht = $state(true);
  const open = $derived(plaat !== null || !dicht);
  let tekst = $state("");
  let bezig = $state(false);
  let vasteZinnen = $state<string[]>([]);
  let fout = $state("");
  let gelezen = $state(untrack(() => leesGelezen(potjeId)));
  let lijst = $state<HTMLElement>();
  /** Het Bericht waarvan het menu open is. */
  let gekozen = $state<number | null>(null);
  const gemeld = new SvelteSet<number>();
  // De server filtert ook; dit haalt Berichten die er al stonden meteen weg.
  const geblokkeerd = new SvelteSet<number>();
  let blokStatus = $state("");

  const zichtbaar = $derived(berichten.filter((b) => !geblokkeerd.has(b.speler_id)));
  const laatsteId = $derived(zichtbaar.length ? zichtbaar[zichtbaar.length - 1].id : 0);
  const ongelezen = $derived(zichtbaar.some((b) => b.id > gelezen && b.plek !== mijnPlek));
  const over = $derived(MAX_BERICHT - [...tekst.trim()].length);
  const kanSturen = $derived(!bezig && tekst.trim().length > 0 && over >= 0);

  $effect(() => {
    if (!snel || vasteZinnen.length) return;
    haalVasteZinnen().then(
      (z) => (vasteZinnen = z),
      (err) => (fout = tekstVan(err)),
    );
  });

  // Is het vak open, dan is alles gelezen en schuift de lijst naar het nieuwste Bericht.
  $effect(() => {
    if (!open) return;
    const id = laatsteId;
    gelezen = Math.max(gelezen, id);
    bewaarGelezen(potjeId, id);
    tick().then(() => lijst && (lijst.scrollTop = lijst.scrollHeight));
  });

  // Maakt het toetsenbord (iOS of de Android-app) het blad korter, dan blijft scrollTop gelijk en zakken de nieuwste Berichten uit beeld. Stond de
  // Speler onderaan, dan blijft de lijst onderaan. Alleen op iOS en in de Android-app met het toetsenbord open (`boven-toetsenbord` en
  // `toetsenbord-open`, zie toetsenbord.ts); anders blijft de scrollpositie staan zoals altijd.
  // `onderaan` rekent met de grootste van de vorige gemeten hoogte en de hoogte nu: een scroll-event dat komt terwijl de lijst al
  // lager is (toetsenbord open) of al hoger en begrensd (toetsenbord dicht), maar nog niet gemeten, telt dan nog als onderaan.
  $effect(() => {
    const el = lijst;
    const html = document.documentElement;
    if (!el || typeof ResizeObserver === "undefined" || !html.classList.contains("boven-toetsenbord")) return;
    let hoogte = el.clientHeight;
    let onderaan = true;
    const opScroll = () => (onderaan = el.scrollHeight - el.scrollTop - Math.max(hoogte, el.clientHeight) <= 2);
    const ro = new ResizeObserver(() => {
      hoogte = el.clientHeight;
      if (onderaan && html.classList.contains("toetsenbord-open")) el.scrollTop = el.scrollHeight;
    });
    el.addEventListener("scroll", opScroll, { passive: true });
    ro.observe(el);
    return () => {
      ro.disconnect();
      el.removeEventListener("scroll", opScroll);
    };
  });

  function sluit() {
    dicht = true;
    gekozen = null;
  }

  /** Zo lang (ms) is lang tikken. */
  const LANG_MS = 450;
  let druk: ReturnType<typeof setTimeout> | undefined;
  let lang = false;

  function drukBegin(e: PointerEvent, b: Bericht) {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    lang = false;
    clearTimeout(druk);
    druk = setTimeout(() => {
      lang = true;
      gekozen = b.id;
      navigator.vibrate?.(8);
    }, LANG_MS);
  }
  const drukStop = () => clearTimeout(druk);

  function tik(b: Bericht) {
    // Na lang tikken komt er nog een klik; die laat het menu open.
    if (lang) {
      lang = false;
      return;
    }
    gekozen = gekozen === b.id ? null : b.id;
  }

  /** Het menu krijgt de focus, zodat toetsenbord en schermlezer er meteen in staan. */
  function focusEerste(menu: HTMLElement) {
    menu.querySelector<HTMLButtonElement>("button:not(:disabled)")?.focus();
  }

  function menuToets(e: KeyboardEvent) {
    const knoppen = [...(e.currentTarget as HTMLElement).querySelectorAll<HTMLButtonElement>("button:not(:disabled)")];
    const i = knoppen.indexOf(document.activeElement as HTMLButtonElement);
    if (e.key === "ArrowRight" || e.key === "ArrowDown") knoppen[(i + 1) % knoppen.length]?.focus();
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") knoppen[(i - 1 + knoppen.length) % knoppen.length]?.focus();
    else return;
    e.preventDefault();
  }

  async function meld(b: Bericht) {
    fout = "";
    try {
      await rapporteer(sleutel, potjeId, b.id);
      gemeld.add(b.id);
    } catch (err) {
      fout = tekstVan(err);
    }
  }

  let statusTimer: ReturnType<typeof setTimeout> | undefined;
  async function blok(b: Bericht) {
    fout = "";
    try {
      await blokkeer(sleutel, b.speler_id);
    } catch (err) {
      fout = tekstVan(err);
      return;
    }
    geblokkeerd.add(b.speler_id);
    gekozen = null;
    blokStatus = t("chat.blockedName", { name: b.spelersnaam });
    clearTimeout(statusTimer);
    statusTimer = setTimeout(() => (blokStatus = ""), 4000);
  }

  function toets(e: KeyboardEvent) {
    if (e.key !== "Escape" || !open) return;
    if (gekozen === null) return plaat === null ? sluit() : undefined;
    // Eerst het menu dicht, terug naar het Bericht.
    const id = gekozen;
    gekozen = null;
    lijst?.querySelector<HTMLElement>(`[data-bericht="${id}"]`)?.focus();
  }

  async function verstuur(e: SubmitEvent) {
    e.preventDefault();
    if (!kanSturen) return;
    bezig = true;
    fout = "";
    try {
      await stuurBericht(tekst.trim());
      tekst = "";
    } catch (err) {
      fout = tekstVan(err);
    } finally {
      bezig = false;
    }
  }

  async function stuurZin(zin: string) {
    if (bezig) return;
    bezig = true;
    fout = "";
    try {
      await stuurBericht(zin);
    } catch (err) {
      fout = tekstVan(err);
    } finally {
      bezig = false;
    }
  }

  const kleurVan = (plek: number) => Math.min(Math.max(plek - 1, 0), 5);
</script>

<svelte:window onkeydown={toets} />

{#snippet inhoud()}
      {#if plaat === null}
        <span class="greep" aria-hidden="true"></span>
      {/if}
      <header>
        <h2 id="chat-titel" class="kop">{t("chat.title")}</h2>
        {#if plaat === null}<button class="knop-ikoon" onclick={sluit} aria-label={t("chat.close")}><Icoon naam="sluit" /></button>{/if}
      </header>
      {#if blokStatus}
        <p class="blok-status" role="status"><Icoon naam="blokkeer" maat={16} />{blokStatus}</p>
      {/if}
      <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
      <ul
        class="schuif"
        bind:this={lijst}
        aria-live="polite"
        onpointerdown={(e) => gekozen !== null && !(e.target as Element).closest(".menu, .bubbel") && (gekozen = null)}
      >
        {#each zichtbaar as b (b.id)}
          <li class:eigen={b.plek === mijnPlek} class:gekozen={gekozen === b.id}>
            {#if b.plek !== mijnPlek}
              <!-- Taak 284: een lange naam breekt binnen de breedte van het bericht (hooguit twee regels) en de bubbel volgt de
                   richting van zijn eigen tekst (`dir="auto"`), zoals je eigen berichten. -->
              <span class="naam"><Steentje speler={kleurVan(b.plek)} maat={7} stip /><bdi class="naam-tekst">{b.spelersnaam}</bdi></span>
              <button
                dir="auto"
                class="bubbel"
                data-bericht={b.id}
                aria-haspopup="menu"
                aria-expanded={gekozen === b.id}
                onclick={() => tik(b)}
                onpointerdown={(e) => drukBegin(e, b)}
                onpointerup={drukStop}
                onpointercancel={drukStop}
                onpointerleave={drukStop}
                oncontextmenu={(e) => e.preventDefault()}>{snel ? vasteZin(b.tekst) : b.tekst}</button
              >
              {#if gekozen === b.id}
                <div class="menu" role="menu" aria-label={t("chat.messageFrom", { name: b.spelersnaam })} tabindex="-1" onkeydown={menuToets} {@attach focusEerste}>
                  <button role="menuitem" onclick={() => meld(b)} disabled={gemeld.has(b.id)}>
                    <Icoon naam={gemeld.has(b.id) ? "vink" : "rapport"} maat={18} />{gemeld.has(b.id) ? t("chat.reported") : t("chat.report")}
                  </button>
                  <button role="menuitem" aria-label={t("chat.blockName", { name: b.spelersnaam })} onclick={() => blok(b)}>
                    <Icoon naam="blokkeer" maat={18} />{t("chat.block")}
                  </button>
                </div>
              {/if}
            {:else}
              <p dir="auto">{snel ? vasteZin(b.tekst) : b.tekst}</p>
            {/if}
          </li>
        {:else}
          <li class="leeg"><Icoon naam="chat" maat={36} /><span>{t("chat.none")}</span></li>
        {/each}
      </ul>
      {#if fout}<p class="fout" role="alert">{fout}</p>{/if}
      {#if snel}
        <ul class="zinnen" aria-label={t("chat.quick")}>
          {#each vasteZinnen as zin (zin)}
            <li><button class="zin" disabled={bezig} onclick={() => stuurZin(zin)}>{vasteZin(zin)}</button></li>
          {/each}
        </ul>
      {:else}
      <form onsubmit={verstuur}>
        <input
          bind:value={tekst}
          placeholder={t("chat.placeholder")}
          aria-label={t("chat.message")}
          maxlength={MAX_BERICHT}
          autocomplete="off"
          enterkeyhint="send"
        />
        <button class="knop-licht stuur" type="submit" disabled={!kanSturen} aria-label={t("chat.send")}><Icoon naam="stuur" /></button>
      </form>
      {/if}
{/snippet}

{#if plaat !== null}
  <!-- Breed scherm (taak 236): de Chat ligt altijd open op een plaat naast het bord. -->
  <section class="op-plaat-chat breed-tekst" style={plaat} aria-labelledby="chat-titel">
    <div class="vel">{@render inhoud()}</div>
  </section>
{:else}
<button class="knop-ikoon chat-knop" onclick={() => (dicht = false)} aria-haspopup="dialog" aria-label={t("chat.title")}>
  <Icoon naam="chat" /><span>{t("chat.title")}</span>
  {#if ongelezen}<span class="ongelezen" role="status" aria-label={t("chat.newMessages")}></span>{/if}
</button>

{#if open}
  <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
  <div class="doek chat-doek" onclick={(e) => e.target === e.currentTarget && sluit()}>
    <div class="chat porselein" role="dialog" aria-modal="true" aria-labelledby="chat-titel">
      {@render inhoud()}
    </div>
  </div>
{/if}
{/if}

<style>
  .chat-knop {
    position: relative;
  }
  .ongelezen {
    position: absolute;
    top: 4px;
    inset-inline-end: 14px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    /* Rood lak met een crème rand: goed te zien op de porseleinen pil en op de donkere balk. */
    background: #b2301c;
    box-shadow: 0 0 0 2px #fff3dc;
  }
  .chat-doek {
    align-items: flex-end;
    padding: 0;
    background: rgb(11 14 24 / 0.6);
  }
  /* Een blad van porselein met een gouden rand bovenaan dat van onderen open schuift (1b). */
  .chat {
    position: relative;
    width: min(100%, 480px);
    /* Met het toetsenbord open (iOS en de Android-app, toetsenbord.ts) niet hoger dan wat erboven in beeld is: de sluitknop blijft zichtbaar. Zonder
       toetsenbord (en in de browser) is `--toetsenbord-zicht` er niet en blijft de hoogte min(72dvh, 580px). */
    height: min(72dvh, 580px, calc(var(--toetsenbord-zicht, 9999px) - var(--veilig-boven) - 12px));
    display: flex;
    flex-direction: column;
    border-radius: 18px 18px 0 0;
    background: var(--wit);
    color: var(--tekst);
    border-top: 3px solid var(--goud);
    box-shadow: 0 -20px 50px rgb(11 14 24 / 0.45);
    padding-bottom: env(safe-area-inset-bottom);
    overflow: hidden;
    animation: uitschuiven 340ms var(--uit);
  }
  /* Met het toetsenbord open: nooit lager dan de kop, de meldingen en het hele invoerveld (de lijst krimpt tot 0). Is er minder
     ruimte (liggend), dan gaat het veld voor en schuift de kop eruit (toetsenbord.ts). */
  :global(.toetsenbord-open) .chat {
    min-height: min-content;
  }
  /* Breed scherm (taak 236): de Chat op de porseleinen plaat naast het bord, altijd open. Geen eigen blad: de plaat is het blad. */
  .op-plaat-chat {
    position: fixed;
    z-index: 2;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .op-plaat-chat > .vel {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
  }
  .op-plaat-chat header {
    padding-block: 2px 4px;
    padding-inline: 4px;
  }
  .op-plaat-chat ul:not(.zinnen) {
    padding-inline: 4px;
  }
  .greep {
    position: absolute;
    top: 10px;
    left: 50%;
    width: 40px;
    height: 5px;
    translate: -50% 0;
    border-radius: 3px;
    background: var(--blad-rand);
  }
  header h2 {
    font-size: 1.35rem;
    font-weight: 800;
    letter-spacing: -0.015em;
    text-transform: none;
    color: var(--tekst);
  }
  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24px 0 8px;
    padding-inline: 22px 12px;
  }
  ul {
    /* Basis 0px (niet 0%): ook als het blad zijn eigen hoogte zoekt (min-content), telt de lijst niet mee. */
    flex: 1 1 0px;
    min-height: 0;
    overflow-y: auto;
    overscroll-behavior: contain;
    list-style: none;
    margin: 0;
    padding: 16px 16px 12px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  li {
    max-width: 82%;
    align-self: flex-start;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  li.eigen {
    align-self: flex-end;
    align-items: flex-end;
  }
  li.leeg {
    align-self: center;
    align-items: center;
    gap: 10px;
    max-width: none;
    margin: auto;
    color: var(--tekst-stil);
    font-size: 0.9rem;
  }
  .naam {
    max-width: 100%;
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.78rem;
    font-weight: 700;
    color: var(--tekst-zacht);
    padding-inline-start: 2px;
  }
  .naam-tekst {
    min-width: 0;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    overflow-wrap: anywhere;
  }
  li p,
  .bubbel {
    margin: 0;
    padding: 9px 13px;
    border-radius: 14px;
    border-start-start-radius: 4px;
    background: var(--zacht);
    box-shadow: inset 0 0 0 1px var(--blad-rand);
    color: var(--tekst);
    line-height: 1.35;
    overflow-wrap: anywhere;
    white-space: pre-wrap;
    text-align: start;
  }
  .bubbel {
    align-self: flex-start;
    min-height: 0;
    font-size: 1rem;
    cursor: default;
    -webkit-touch-callout: none;
    transition:
      box-shadow 160ms var(--uit),
      transform 160ms var(--uit);
  }
  .bubbel:active {
    transform: scale(0.98);
  }
  li.gekozen .bubbel {
    box-shadow: inset 0 0 0 2px var(--inkt);
  }
  /* Report en Block: een strookje van haarlijn onder het Bericht. */
  .menu {
    align-self: flex-start;
    display: flex;
    margin-top: 2px;
    border-radius: 12px;
    background: var(--wit);
    box-shadow:
      0 0 0 1.5px var(--goud),
      0 10px 24px -12px rgb(11 14 24 / 0.5);
    overflow: hidden;
    animation: menu-in 180ms var(--uit);
    transform-origin: top left;
  }
  :global([dir="rtl"]) .bubbel {
    transform-origin: top right;
  }
  .menu button {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-height: 44px;
    padding: 0;
    padding-inline: 13px 16px;
    font-size: 0.92rem;
    font-weight: 700;
    color: var(--tekst);
    border-radius: 0;
  }
  .menu button + button {
    box-shadow: inset 1.5px 0 0 var(--blad-rand);
  }
  :global(:where([dir="rtl"])) .menu button + button {
    box-shadow: inset -1.5px 0 0 var(--blad-rand);
  }
  .menu button:active:not(:disabled) {
    background: var(--zacht);
  }
  .menu button:disabled {
    opacity: 1;
    color: var(--tekst-zacht);
  }
  @media (hover: hover) {
    .menu button:hover:not(:disabled) {
      background: var(--zacht);
    }
  }
  .blok-status {
    align-self: center;
    display: flex;
    align-items: center;
    gap: 7px;
    margin: 10px 0 0;
    padding: 4px 0;
    padding-inline: 9px 11px;
    border-radius: 14px;
    font-size: 0.82rem;
    font-weight: 600;
    color: var(--tekst-zacht);
    background: var(--zacht);
    animation: menu-in 220ms var(--uit);
  }
  @keyframes menu-in {
    from {
      opacity: 0;
      transform: translateY(-4px) scale(0.97);
    }
  }
  li.eigen p {
    border-radius: 14px;
    border-start-end-radius: 4px;
    background: var(--inkt);
    box-shadow: none;
    color: var(--wit);
  }
  .fout {
    margin: 0 12px 8px;
    padding: 6px 12px;
    font-size: 0.9rem;
  }
  /* Vaste zinnen: tikbare blokjes, geen tekstveld. */
  ul.zinnen {
    flex: none;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 8px;
    padding: 12px 12px 14px;
    overflow: visible;
  }
  ul.zinnen li {
    max-width: none;
    align-self: auto;
  }
  .zin {
    min-height: 44px;
    padding: 0 16px;
    border-radius: var(--pil);
    background: var(--zacht);
    box-shadow: inset 0 0 0 1.5px var(--goud);
    color: var(--tekst);
    font-size: 0.95rem;
    font-weight: 700;
  }
  .zin:active:not(:disabled) {
    background: var(--inkt);
    color: var(--wit);
  }
  form {
    display: flex;
    gap: 8px;
    padding: 10px 12px 14px;
  }
  input {
    flex: 1;
    min-width: 0;
    min-height: 50px;
    box-shadow: inset 0 0 0 1.5px var(--goud);
  }
  input:focus {
    box-shadow: inset 0 0 0 2px var(--inkt);
  }
  .stuur {
    flex: none;
    width: 50px;
    min-height: 50px;
    padding: 0;
    border-radius: 50%;
    /* Werkt hij, dan een gouden rand rond de donkere knop; uitgeschakeld is hij een vlak grijs rondje zonder rand. */
    box-shadow: 0 0 0 2px var(--goud);
  }
  .stuur:disabled {
    opacity: 1;
    color: var(--tekst-stil);
    background: var(--zacht);
    box-shadow: none;
  }
  .stuur:disabled > :global(.icoon) {
    color: var(--tekst-stil);
  }
  .stuur > :global(.icoon) {
    padding: 0;
    background: none;
    color: var(--wit);
  }
  @keyframes uitschuiven {
    from {
      transform: translateY(30%);
      opacity: 0;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .chat,
    .menu,
    .blok-status {
      animation: none;
    }
    .bubbel {
      transition: none;
    }
  }
</style>
