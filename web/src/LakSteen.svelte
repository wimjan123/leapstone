<svelte:options namespace="svg" />

<script lang="ts">
  import { GOUD, LAK_STENEN, lakTinten } from "./lak";
  import { TEKENS, inktVoor } from "./steen";

  // Een Steen van gekleurde lak buiten het 3D-bord (uiterlijk 1b: de Wachtkamer, het medaillon van het winstscherm), met een lichte
  // glanskop, een donkere schaduwrand, een gouden bies en een duidelijk teken. De voet staat op (0, 0). Zonder schaduw
  // (die ligt op het bord). Alleen versiering: de naam of kleur staat altijd ook in tekst. `id` moet uniek zijn.
  let { speler, id, kleur }: { speler: number; id: string; kleur?: string } = $props();

  /** Maten in vakken: de kop is breder dan het gat (0,27) en reikt iets in de rij erboven (0,87 uit elkaar); de lagere rij ligt voor. */
  const KOP = { midden: -0.3, straal: 0.42, teken: 0.98 };

  const lak = $derived(LAK_STENEN[speler % LAK_STENEN.length]);
  const k = $derived(kleur ?? lak.kleur);
  const tinten = $derived(lakTinten(k));
  const teken = $derived(TEKENS[speler % TEKENS.length]);
  const inkt = $derived(kleur ? inktVoor(kleur) : lak.teken);
  const lijf = "M-.46 -.08 Q-.4 -.2 -.24 -.3 L.24 -.3 Q.4 -.2 .46 -.08 Z";
</script>

<defs>
  <linearGradient id="{id}-lijf" x1="0" x2="1">
    <stop offset="0" stop-color={tinten.licht} />
    <stop offset="0.5" stop-color={k} />
    <stop offset="1" stop-color={tinten.donker} />
  </linearGradient>
  <!-- De glans: een lichte plek links boven op een vlakke kop; de ring rond het teken houdt de kleur van de Steen. -->
  <radialGradient id="{id}-glans" cx="0.32" cy="0.28" r="0.5">
    <stop offset="0" stop-color="#fff" stop-opacity="0.55" />
    <stop offset="1" stop-color="#fff" stop-opacity="0" />
  </radialGradient>
</defs>
<ellipse cx="0" cy="-0.07" rx="0.5" ry="0.18" fill={tinten.voet} stroke={GOUD.licht} stroke-opacity="0.75" stroke-width="0.025" />
<path d={lijf} fill="url(#{id}-lijf)" stroke={tinten.voet} stroke-opacity="0.6" stroke-width="0.015" />
<!-- Donkere schaduwrand, dan de kop met het gouden randje erbinnen -->
<circle cy={KOP.midden} r={KOP.straal + 0.025} fill="#150304" opacity="0.85" />
<circle cy={KOP.midden} r={KOP.straal} fill={k} stroke={GOUD.licht} stroke-width="0.035" />
<circle cy={KOP.midden} r={KOP.straal - 0.03} fill="none" stroke={tinten.donker} stroke-opacity="0.55" stroke-width="0.05" />
<circle cy={KOP.midden} r={KOP.straal} fill="url(#{id}-glans)" />
<ellipse cx="-0.16" cy={KOP.midden - 0.24} rx="0.12" ry="0.06" fill="#fff" opacity="0.55" transform="rotate(-30 -0.16 {KOP.midden - 0.24})" />
<path d={teken.d} fill={inkt} fill-rule={teken.regel} transform="translate(0 {KOP.midden}) scale({KOP.teken})" />
