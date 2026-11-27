// Stran »Kaj je Sternhalma?« (taak 134), v slovenščini: ime in povezava s Halmo in kitajskimi damami.
// Vsebina in viri: angleška stran ../en/sternhalma.mjs (Wikipedia Halma in Chinese checkers, glej tam). Poved za povedjo v slovenščini.
// Namenoma izpuščeno, kot v angleščini: kdo je leta 1892 izdal Stern-Halmo (viri se razlikujejo) in leta patentov.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="naam">
      <h2 id="naam">Kaj pomeni ime</h2>
      <p>Sternhalma je nemško ime Halme, ki se igra na plošči v obliki zvezde. <em>Stern</em> je v nemščini &bdquo;zvezda&ldquo;. Ime kitajske dame je ista igra pod imenom, ki so ji ga pozneje dali v Združenih državah.</p>
      <p>V Leapstone je to <strong>zvezdasta plošča</strong>: plošča <a href="/sl/pravila/kitajske-dame">pravil kitajskih dam</a>.</p>
    </section>

    <section aria-labelledby="geschiedenis">
      <h2 id="geschiedenis">Od kod izvira</h2>
      <ul>
        <li><strong>Halmo</strong> je leta 1883 ali 1884 izumil George Howard Monks, ameriški kirurg. Ime je grško za &bdquo;skok&ldquo;. Igra se na kvadratni plošči. <a href="/sl/pravila/halma">Preberi pravila Halme</a>.</li>
        <li><strong>Stern-Halma</strong> se je pojavila leta 1892 v Nemčiji: ista zamisel na plošči v obliki šestkrake zvezde.</li>
        <li><strong>Kitajske dame</strong> je ime, ki sta ga igri leta 1928 v Združenih državah dala Bill in Jack Pressman, sprva kot &bdquo;Hop Ching checkers&ldquo;. Igra nima zgodovinske povezave s Kitajsko in ni igra dam.</li>
      </ul>
    </section>

    <section aria-labelledby="verschil">
      <h2 id="verschil">Kako se igre razlikujejo</h2>
      <ul>
        <li><strong>Halma:</strong> kvadratna plošča s 16 krat 16 polji, za 2 ali 4 igralce. Figura ima osem sosedov, naravnost in diagonalno. Pri 2 igralcih ima vsak 19 figur, pri 4 igralcih 13.</li>
        <li><strong>Sternhalma in kitajske dame:</strong> zvezdasta plošča s 121 polji, za 2, 3, 4 ali 6 igralcev. Figura ima šest sosedov. Vsak ima 10 figur.</li>
        <li><strong>Vse drugo je enako:</strong> korak na prostega soseda ali skok čez eno figuro, z verigami skokov. Prvi igralec, ki napolni tabor na drugi strani plošče, zmaga.</li>
      </ul>
    </section>

    <section aria-labelledby="varianten">
      <h2 id="varianten">Različice in kaj počne Leapstone</h2>
      <p>Halmo so igrali na več načinov. Takole se Leapstone primerja z različicami, ki smo jih našli v svojih virih:</p>
      <ul>
        <li><strong>Velikost plošče.</strong> Halma se igra tudi na ploščah 8 krat 8 in 10 krat 10. Leapstone ima samo ploščo 16 krat 16.</li>
        <li><strong>Zapustitev cilja.</strong> Po enem pravilu Halme figura, ki je vstopila v tabor nasprotnika, ne sme več oditi iz njega. Leapstone tega pravila nima: tako figuro lahko spet premakneš.</li>
        <li><strong>Trije igralci na zvezdi.</strong> Stara Halma za tri igralce na zvezdasti plošči je opisana s po 15 figurami. Leapstone igra 3 igralce na zvezdasti plošči s po 10 figurami.</li>
        <li><strong>Skoki so tvoja izbira.</strong> Nikoli ti ni treba skakati. Sam izbereš polje, na katerem se tvoja poteza konča.</li>
      </ul>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Igraj v Leapstone</h2>
      <p>Igraj zdaj odpre igro na zvezdasti plošči proti računalniku. Za kvadratno ploščo se dotakni puščice nazaj zgoraj in v meniju izberi Kvadratna plošča.</p>
${plaatje({
  bestand: "setup-2.svg",
  max: "20rem",
  alt: "Zvezdasta plošča z 10 rdečimi figurami v spodnji konici in 10 modrimi figurami v zgornji konici",
  tekst: "Zvezdasta plošča za 2 igralca.",
})}
    </section>`;

export default {
  nav: "Sternhalma",
  titel: "Kaj je Sternhalma? Halma na zvezdasti plošči | Leapstone",
  beschrijving: "Sternhalma je nemško ime Halme na zvezdasti plošči. Kako je povezana s Halmo in kitajskimi damami, kaj je drugače in kako jo igraš brezplačno v brskalniku.",
  h1: "Sternhalma, Halma in kitajske dame",
  intro: "Tri imena za zelo sorodne igre. Kaj pomeni vsako, od kod izvirajo in kako se razlikujejo.",
  inhoud,
};
