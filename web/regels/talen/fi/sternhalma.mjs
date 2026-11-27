// Suomenkielinen sivu "Mikä on Sternhalma?" (taak 134): /fi/saannot/mika-on-sternhalma. Nimi ja suhde Halmaan ja kiinanšakkiin.
// Sisältö ja lähteet: englanninkielinen sivu ../en/sternhalma.mjs (Wikipedia Halma ja Chinese checkers, ks. sieltä), lause lauseelta suomeksi.
// Jätetty tarkoituksella pois, kuten englanniksi: kuka julkaisi Stern-Halman 1892 (lähteet ovat ristiriidassa) ja patenttivuodet.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="naam">
      <h2 id="naam">Mitä nimi tarkoittaa</h2>
      <p>Sternhalma on Halman saksankielinen nimi, kun peliä pelataan tähdenmuotoisella laudalla. <em>Stern</em> on saksaa ja tarkoittaa tähteä. Nimi Chinese checkers (kiinanšakki) on sama peli nimellä, joka annettiin myöhemmin Yhdysvalloissa.</p>
      <p>Leapstonessa tämä on <strong>tähtilauta</strong>: <a href="/fi/saannot/kiinansakki">kiinanšakin sääntöjen</a> lauta.</p>
    </section>

    <section aria-labelledby="geschiedenis">
      <h2 id="geschiedenis">Mistä se on peräisin</h2>
      <ul>
        <li><strong>Halman</strong> keksi vuonna 1883 tai 1884 George Howard Monks, yhdysvaltalainen kirurgi. Nimi on kreikkaa ja tarkoittaa ”hyppyä”. Sitä pelataan neliölaudalla. <a href="/fi/saannot/halma">Lue Halman säännöt</a>.</li>
        <li><strong>Stern-Halma</strong> ilmestyi Saksassa vuonna 1892: sama ajatus kuusikärkisen tähden muotoisella laudalla.</li>
        <li><strong>Chinese checkers</strong> on nimi, jonka Bill ja Jack Pressman antoivat pelille Yhdysvalloissa vuonna 1928, aluksi nimellä ”Hop Ching checkers”. Pelillä ei ole historiallista yhteyttä Kiinaan, eikä se ole tammipeli.</li>
      </ul>
    </section>

    <section aria-labelledby="verschil">
      <h2 id="verschil">Miten pelit eroavat</h2>
      <ul>
        <li><strong>Halma:</strong> neliölauta, jossa on 16 × 16 paikkaa, 2 tai 4 pelaajalle. Nappulalla on kahdeksan naapuria, suoraa ja vinoa. 2 pelaajalla jokaisella on 19 nappulaa, 4 pelaajalla 13.</li>
        <li><strong>Sternhalma ja kiinanšakki:</strong> tähtilauta, jossa on 121 paikkaa, 2, 3, 4 tai 6 pelaajalle. Nappulalla on kuusi naapuria. Jokaisella on 10 nappulaa.</li>
        <li><strong>Loppu on samaa:</strong> askel vapaaseen naapuriin tai hyppy yhden nappulan yli, hyppyketjuineen. Ensimmäinen pelaaja, joka täyttää laudan toisella puolella olevan leirin, voittaa.</li>
      </ul>
    </section>

    <section aria-labelledby="varianten">
      <h2 id="varianten">Muunnelmat, ja mitä Leapstone tekee</h2>
      <p>Halmaa on pelattu useammalla tavalla. Näin Leapstone eroaa lähteistämme löytämistämme muunnelmista:</p>
      <ul>
        <li><strong>Laudan koko.</strong> Halmaa pelataan myös 8 × 8 ja 10 × 10 laudoilla. Leapstonessa on vain 16 × 16 lauta.</li>
        <li><strong>Maalista poistuminen.</strong> Yhden Halma-säännön mukaan vastustajan leiriin päässyt nappula ei saa lähteä sieltä enää. Leapstonessa tätä sääntöä ei ole: sellaista nappulaa voi siirtää uudelleen.</li>
        <li><strong>Kolme pelaajaa tähdellä.</strong> Vanha kolmen pelaajan Halma tähtilaudalla kuvataan 15 nappulalla kullekin. Leapstone pelaa 3 pelaajaa tähtilaudalla, 10 nappulaa kullakin.</li>
        <li><strong>Hypyt ovat sinun valintasi.</strong> Sinun ei koskaan tarvitse hypätä. Valitset itse paikan, johon siirtosi päättyy.</li>
      </ul>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Pelaa sitä Leapstonessa</h2>
      <p>Pelaa nyt avaa pelin tähtilaudalla tietokonetta vastaan. Neliölautaa varten napauta ylhäällä olevaa takaisin-nuolta ja valitse valikosta Neliölauta.</p>
${plaatje({
  bestand: "setup-2.svg",
  max: "20rem",
  alt: "Tähtilauta, jonka alakärjessä on 10 punaista nappulaa ja yläkärjessä 10 sinistä nappulaa",
  tekst: "Tähtilauta 2 pelaajalle.",
})}
    </section>`;

export default {
  nav: "Sternhalma",
  titel: "Mikä on Sternhalma? Halma tähtilaudalla | Leapstone",
  beschrijving: "Sternhalma on Halman saksankielinen nimi tähtilaudalla. Miten se liittyy Halmaan ja kiinanšakkiin, ja miten sitä pelataan ilmaiseksi selaimessa.",
  h1: "Sternhalma, Halma ja kiinanšakki",
  intro: "Kolme nimeä läheisesti sukua oleville peleille. Mitä kukin tarkoittaa, mistä ne ovat peräisin ja miten ne eroavat.",
  inhoud,
};
