// Slovenská stránka s pravidlami Sternhalmy (taak 134). Obsah a zdroje: anglická stránka ../en/sternhalma.mjs (Wikipedia Halma a Chinese checkers, pozri tam), veta po vete po slovensky.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="naam">
      <h2 id="naam">Čo znamená názov</h2>
      <p>Sternhalma je nemecký názov Halmy hranej na doske v tvare hviezdy. <em>Stern</em> je po nemecky hviezda. Názov čínska dáma je tá istá hra pod názvom, ktorý jej neskôr dali v Spojených štátoch.</p>
      <p>V Leapstone je to <strong>hviezdicová doska</strong>: doska z <a href="/sk/pravidla/cinska-dama">pravidiel čínskej dámy</a>.</p>
    </section>

    <section aria-labelledby="geschiedenis">
      <h2 id="geschiedenis">Odkiaľ pochádza</h2>
      <ul>
        <li><strong>Halmu</strong> vymyslel v roku 1883 alebo 1884 George Howard Monks, americký chirurg. Názov je grécky a znamená &ldquo;skok&rdquo;. Hrá sa na štvorcovej doske. <a href="/sk/pravidla/halma">Prečítajte si pravidlá Halmy</a>.</li>
        <li><strong>Stern-Halma</strong> sa objavila v Nemecku v roku 1892: ten istý nápad na doske v tvare šesťcípej hviezdy.</li>
        <li><strong>Čínska dáma</strong> je názov, ktorý hre dali Bill a Jack Pressmanovci v Spojených štátoch v roku 1928, spočiatku ako &ldquo;Hop Ching checkers&rdquo;. Hra nemá s Čínou žiadnu historickú spojitosť a nie je to ani hra typu dáma.</li>
      </ul>
    </section>

    <section aria-labelledby="verschil">
      <h2 id="verschil">Ako sa hry líšia</h2>
      <ul>
        <li><strong>Halma:</strong> štvorcová doska s 16 × 16 poľami, pre 2 alebo 4 hráčov. Kameň má osem susedov, priamych a uhlopriečnych. Pri 2 hráčoch má každý 19 kameňov, pri 4 hráčoch 13.</li>
        <li><strong>Sternhalma a čínska dáma:</strong> hviezdicová doska so 121 poľami, pre 2, 3, 4 alebo 6 hráčov. Kameň má šesť susedov. Každý má 10 kameňov.</li>
        <li><strong>Zvyšok je rovnaký:</strong> krok na voľného suseda alebo skok cez jeden kameň, s reťazami skokov. Vyhráva prvý hráč, ktorý zaplní tábor na druhej strane dosky.</li>
      </ul>
    </section>

    <section aria-labelledby="varianten">
      <h2 id="varianten">Varianty a čo robí Leapstone</h2>
      <p>Halma sa hrala viacerými spôsobmi. Takto sa Leapstone porovnáva s variantmi, ktoré sme našli vo svojich zdrojoch:</p>
      <ul>
        <li><strong>Veľkosť dosky.</strong> Halma sa hrá aj na doskách 8 × 8 a 10 × 10. Leapstone má len dosku 16 × 16.</li>
        <li><strong>Opustenie cieľa.</strong> Podľa jedného pravidla Halmy kameň, ktorý vstúpil do tábora protivníka, ho už nesmie opustiť. Leapstone toto pravidlo nemá: takým kameňom môžete znova ťahať.</li>
        <li><strong>Traja hráči na hviezde.</strong> Stará Halma pre troch hráčov na hviezdicovej doske sa opisuje s 15 kameňmi na hráča. Leapstone hrá 3 hráčov na hviezdicovej doske s 10 kameňmi na hráča.</li>
        <li><strong>Skoky sú na vás.</strong> Nikdy nemusíte skákať. Pole, kde váš ťah skončí, si vyberáte vy.</li>
      </ul>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Zahrajte si v Leapstone</h2>
      <p>Hrať hneď otvorí hru na hviezdicovej doske proti počítaču. Pre štvorcovú dosku ťuknite hore na šípku späť a v ponuke vyberte Štvorcová doska.</p>
${plaatje({
  bestand: "setup-2.svg",
  max: "20rem",
  alt: "Hviezdicová doska s 10 červenými kameňmi v dolnom hrote a 10 modrými kameňmi v hornom hrote",
  tekst: "Hviezdicová doska pre 2 hráčov.",
})}
    </section>`;

export default {
  nav: "Sternhalma",
  titel: "Čo je Sternhalma? Halma na hviezdicovej doske | Leapstone",
  beschrijving: "Sternhalma je nemecký názov Halmy na hviezdicovej doske. Ako súvisí s Halmou a čínskou dámou, v čom sa líši a ako ju hrať zadarmo v prehliadači.",
  h1: "Sternhalma, Halma a čínska dáma",
  intro: "Tri názvy blízko príbuzných hier. Čo každý znamená, odkiaľ pochádzajú a ako sa líšia.",
  inhoud,
};
