// Leapstone v številkah, Sloveens (taak 321). Volgt ../en/chinese-checkers-by-the-numbers.mjs zin voor zin; elk getal via f() uit cijfers.json.
import { c, f } from "../../cijfers.mjs";
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="vakken">
      <h2 id="vakken">Polja in figure</h2>
      <p>Prešteto na obeh ploščah Leapstona, v začetni postavitvi igre.</p>
${plaatje({
  bestand: "setup-6.svg",
  max: "20rem",
  direct: true,
  alt: "Zvezdasta plošča z vsemi šestimi konicami polnimi: deset figur v vsaki od šestih barv, okoli praznega središča.",
  tekst: "Zvezdasta plošča na začetku igre za šest igralcev.",
})}
      <ul class="tips">
        <li><strong>Zvezdasta plošča ima ${f("sterbord_vakken")} polj.</strong> Vsak igralec začne z ${f("sterbord_stenen_per_speler")} figurami. Igra za dva igralca ima torej na plošči ${f("sterbord_stenen_2_spelers")} figur, igra za tri ${f("sterbord_stenen_3_spelers")}, za štiri ${f("sterbord_stenen_4_spelers")} in za šest ${f("sterbord_stenen_6_spelers")}.</li>
        <li><strong>Kvadratna plošča za Halmo ima ${f("vierkant_vakken")} polj.</strong> V igri za dva igralca vsak igralec začne z ${f("vierkant_stenen_per_speler_2_spelers")} figurami, skupaj ${f("vierkant_stenen_2_spelers")}. V igri za štiri vsak začne z ${f("vierkant_stenen_per_speler_4_spelers")} figurami, skupaj ${f("vierkant_stenen_4_spelers")}.</li>
      </ul>
    </section>

    <section aria-labelledby="keten">
      <h2 id="keten">Najdaljša veriga skokov: ${f("langste_sprongketen")}</h2>
      <p>Na zvezdasti plošči lahko ena figura naredi <strong>${f("langste_sprongketen")} skokov v eni sami potezi</strong>, in po pravilih Leapstona nobena poteza ne more imeti več. Da se pride do tega števila, so druge figure postavljene prosto: po ena na vsako polje, čez katero figura skoči.</p>
${plaatje({
  bestand: "numbers-longest-chain.svg",
  max: "22rem",
  alt: "Zvezdasta plošča z eno rdečo figuro in veliko modrimi figurami. Bele puščice kažejo, kako rdeča figura skače čez eno modro figuro za drugo, po dolgi vijugasti poti.",
  tekst: "Najdaljša veriga: rdeča figura skoči čez vsako modro figuro, eno za drugo.",
})}
      <p><strong>Kako je prešteto.</strong> Skok vedno pristane dve polji naprej, v ravni črti. Figura, ki kar naprej skače, zato pride le na del polj: plošča razpade na štiri take skupine, največja pa ima ${f("grootste_klasse_vakken")} polj. V Leapstonu figura v eni potezi ne sme dvakrat pristati na istem polju, niti na polju, s katerega je začela. Veriga torej pristane največ enkrat na vsakem od drugih polj v svoji skupini. Program je preiskal to skupino in našel pot čez vseh ${f("grootste_klasse_vakken")} polj, zato nobena veriga ne more biti daljša: ${f("langste_sprongketen")} skokov. Test nato to potezo odigra po pravilih Leapstona.</p>
      <p><strong>Ni prava igra.</strong> Ta veriga potrebuje ${f("langste_sprongketen")} drugih figur, vsako natanko na pravem polju. Igra za dva ali tri igralce ima samo ${f("sterbord_stenen_2_spelers")} ali ${f("sterbord_stenen_3_spelers")} figur, kar je premalo. Igra za štiri ali šest igralcev jih ima ${f("sterbord_stenen_4_spelers")} ali ${f("sterbord_stenen_6_spelers")}, kar je dovolj. Toda v pravi igri nihče ne postavlja figur prosto, zato te verige za mizo ne pričakuj. Kaže, kaj plošča dopušča, ne pa, kaj se zgodi med igro.</p>
    </section>

    <section aria-labelledby="oversteek">
      <h2 id="oversteek">Najkrajši prehod: ${f("oversteek_zetten")} potez</h2>
      <p>En igralec sam na zvezdasti plošči, brez nasprotnikov, potrebuje <strong>${f("oversteek_zetten")} potez</strong>, da vseh ${f("sterbord_stenen_per_speler")} figur prestavi iz ene konice v nasprotno, in mu v manj ne uspe. Cela veriga skokov šteje kot ena poteza.</p>
${plaatje({
  bestand: "numbers-alone.svg",
  max: "20rem",
  alt: "Zvezdasta plošča samo z desetimi rdečimi figurami v spodnji konici. Zgornja konica, kamor morajo priti, ima črtkan rob.",
  tekst: "En igralec sam: deset figur v spodnji konici, zgornja konica pa je cilj.",
})}
      <p><strong>Kako je prešteto.</strong> Test odigra prehod v ${f("oversteek_zetten")} potezah po pravilih Leapstona, brez drugih figur na plošči. Da bi pokazali, da ${f("geen_oversteek_in_zetten")} potez ali manj ne zadošča, iskanje sledi metodi G. I. Bella (<em>Integers</em> 9, 2009). Vsako potezo je mogoče odigrati nazaj, polovični obrat plošče pa zamenja začetek in cilj. Če bi torej obstajal prehod v ${f("geen_oversteek_in_zetten")} potezah ali manj, bi bila neka postavitev na pol poti največ ${f("zoekdiepte_zetten")} potez od začetka, in prav tako ista postavitev, obrnjena za pol obrata. Iskanje je šlo skozi vsako postavitev do ${f("zoekdiepte_zetten")} potez od začetka, postavitev in njeno zrcalno sliko štelo enkrat, izpustilo tiste, ki dokazano ne morejo pravočasno priti dovolj daleč, in takega para ni našlo. Teklo je ${f("gemeten_rekentijd_seconden")} sekund na računalniku z ${f("gemeten_kernen")} jedri, njegov največji korak pa je hranil ${f("gemeten_grootste_laag_miljoen_standen")} milijona postavitev v ${f("gemeten_geheugen_gb")} GB pomnilnika. Število je bilo na novo izračunano za Leapstonovo lastno ploščo.</p>
      <p><strong>Ni spodnja meja za pravo igro.</strong> V pravi igri so na plošči tudi figure drugih igralcev, in tvoje figure lahko skačejo čez njih. ${f("oversteek_zetten")} torej ni najmanj, kar lahko traja prava igra: dokazano je le za enega igralca samega.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Preizkusi</h2>
      <p><a href="/play/">Igraj Leapstone v brskalniku</a> proti računalniku, ali si naloži aplikacijo z gumbi na vrhu te strani. Za pravila preberi <a href="/sl/pravila/kitajske-dame">pravila kitajskih dam</a> ali <a href="/sl/pravila/halma">pravila Halme</a>. Kako verige skokov uporabiš v igri, preberi v <a href="/sl/vodniki/kitajske-dame-strategija">nasvetih za strategijo</a>.</p>
    </section>`;

export default {
  nav: "Kitajske dame v številkah",
  titel: "Kitajske dame v številkah | Leapstone",
  beschrijving: `Zvezdasta plošča ima ${c.sterbord_vakken} polj. Ena poteza ima največ ${c.langste_sprongketen} skokov, igralec sam pa potrebuje ${c.oversteek_zetten} potez za prehod. Kako je izračunano vsako število.`,
  h1: "Kitajske dame v številkah",
  intro: `Zvezdasta plošča kitajskih dam ima ${f("sterbord_vakken")} polj, vsak igralec pa začne z ${f("sterbord_stenen_per_speler")} figurami. V Leapstonu ena poteza nikoli ne more imeti več kot ${f("langste_sprongketen")} skokov. En igralec sam na plošči, brez nasprotnikov, potrebuje ${f("oversteek_zetten")} potez, da jo prečka. Spodaj vidiš, kako je prešteto vsako število, in kaj pove in česa ne pove o pravi igri.`,
  inhoud,
};
