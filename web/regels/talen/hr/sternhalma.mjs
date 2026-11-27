// Hrvatska stranica "Što je Sternhalma?" (taak 134): /hr/pravila/sto-je-sternhalma. Ime i odnos prema Halmi i kineskoj dami.
// Sadržaj i izvori: engleska stranica ../en/sternhalma.mjs (Wikipedia Halma i Chinese checkers, vidi tamo), rečenicu po rečenicu na hrvatskom.
// Namjerno izostavljeno, kao na engleskom: tko je izdao Stern-Halmu 1892. (izvori se razlikuju) i godine patenata.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="naam">
      <h2 id="naam">Što znači to ime</h2>
      <p>Sternhalma je njemački naziv za Halmu koja se igra na ploči u obliku zvijezde. <em>Stern</em> je na njemačkom zvijezda. Naziv Chinese checkers (kineska dama) ista je igra pod imenom koje je kasnije dano u Sjedinjenim Državama.</p>
      <p>U Leapstoneu je to <strong>zvjezdasta ploča</strong>: ploča s <a href="/hr/pravila/kineska-dama">pravila kineske dame</a>.</p>
    </section>

    <section aria-labelledby="geschiedenis">
      <h2 id="geschiedenis">Odakle dolazi</h2>
      <ul>
        <li><strong>Halmu</strong> je 1883. ili 1884. izumio George Howard Monks, američki kirurg. Ime je grčko za &bdquo;skok&rdquo;. Igra se na kvadratnoj ploči. <a href="/hr/pravila/halma">Pročitaj pravila Halme</a>.</li>
        <li><strong>Stern-Halma</strong> pojavila se u Njemačkoj 1892.: ista zamisao na ploči u obliku šesterokrake zvijezde.</li>
        <li><strong>Chinese checkers</strong> je ime koje su igri dali Bill i Jack Pressman u Sjedinjenim Državama 1928., isprva kao &bdquo;Hop Ching checkers&rdquo;. Igra nema povijesnu vezu s Kinom i ne radi se o igri dame.</li>
      </ul>
    </section>

    <section aria-labelledby="verschil">
      <h2 id="verschil">Po čemu se igre razlikuju</h2>
      <ul>
        <li><strong>Halma:</strong> kvadratna ploča od 16 puta 16 polja, za 2 ili 4 igrača. Figura ima osam susjeda, ravnih i dijagonalnih. S 2 igrača svaki ima 19 figura, s 4 igrača 13.</li>
        <li><strong>Sternhalma i kineska dama:</strong> zvjezdasta ploča od 121 polja, za 2, 3, 4 ili 6 igrača. Figura ima šest susjeda. Svatko ima 10 figura.</li>
        <li><strong>Ostalo je isto:</strong> korak na slobodno susjedno polje ili skok preko jedne figure, s lancima skokova. Pobjeđuje prvi igrač koji ispuni logor preko ploče.</li>
      </ul>
    </section>

    <section aria-labelledby="varianten">
      <h2 id="varianten">Varijante i što radi Leapstone</h2>
      <p>Halma se igrala na više načina. Ovako se Leapstone razlikuje od varijanti koje smo našli u svojim izvorima:</p>
      <ul>
        <li><strong>Veličina ploče.</strong> Halma se igra i na pločama od 8 puta 8 i 10 puta 10 polja. Leapstone ima samo ploču od 16 puta 16.</li>
        <li><strong>Napuštanje cilja.</strong> Prema jednom pravilu Halme, figura koja je ušla u logor protivnika ne smije ga više napustiti. Leapstone nema to pravilo: takvu figuru možeš opet pomaknuti.</li>
        <li><strong>Tri igrača na zvijezdi.</strong> Stara Halma za tri igrača na zvjezdastoj ploči opisana je s po 15 figura. Leapstone igra 3 igrača na zvjezdastoj ploči s po 10 figura.</li>
        <li><strong>Skokovi su tvoj izbor.</strong> Nikad ne moraš skakati. Sam biraš polje na kojem tvoj potez završava.</li>
      </ul>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Igraj je u Leapstoneu</h2>
      <p>Igraj sada otvara igru na zvjezdastoj ploči protiv računala. Za kvadratnu ploču dodirni strelicu za natrag na vrhu i u izborniku odaberi Kvadratna ploča.</p>
${plaatje({
  bestand: "setup-2.svg",
  max: "20rem",
  alt: "Zvjezdasta ploča s 10 crvenih figura u donjem kraku i 10 plavih figura u gornjem kraku",
  tekst: "Zvjezdasta ploča za 2 igrača.",
})}
    </section>`;

export default {
  nav: "Sternhalma",
  titel: "Što je Sternhalma? Halma na zvjezdastoj ploči | Leapstone",
  beschrijving: "Sternhalma je njemački naziv za Halmu na zvjezdastoj ploči. Kako je povezana s Halmom i kineskom damom i kako je igrati besplatno u pregledniku.",
  h1: "Sternhalma, Halma i kineska dama",
  intro: "Tri imena za usko povezane igre. Što svako znači, odakle dolaze i po čemu se razlikuju.",
  inhoud,
};
