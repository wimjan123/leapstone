// Suomenkielinen opas Kiinanšakin avaukset (taak 303, feature 294): /fi/oppaat/kiinansakki-avaukset.
// Sisältö: englanninkielinen opas ../en/chinese-checkers-opening-moves.mjs, lause lauseelta suomeksi. Jokainen luku ja siirto on tarkistettu
// crates/halma-core -koodia vastaan; kuvat tulevat tiedostosta crates/halma-core/examples/regelplaatjes.rs (osio "taak 303").
// "Rivi" on kaikki paikat, joilla on sama etäisyys omaan kärkeesi: askel vie 1 rivin, hyppy 2. Ei keksittyjä "asiantuntijoita" eikä historiaa.
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="eerste-zet">
      <h2 id="eerste-zet">Ensimmäinen siirtosi: 14 vaihtoehtoa</h2>
      <p>Alussa 10 nappulaasi täyttävät kolmion riveissä, joissa on 4, 3, 2 ja 1 nappulaa, ja etummainen rivi on kohti laudan keskustaa. Kolmion sisällä ei ole tyhjää paikkaa, joten nappula voi mennä vain sen edessä olevalle riville. Siitä jää 14 ensimmäistä siirtoa: jokainen etummaisen rivin 4 nappulasta voi astua 2 paikkaan (8 askelta), ja jokainen toisen rivin 3 nappulasta voi hypätä etunappulan yli 2 paikkaan (6 hyppyä). Muut 3 nappulaa eivät voi vielä liikkua.</p>
${plaatje({
  bestand: "guide-opening-first.svg",
  max: "20rem",
  alt: "Punainen kärki alhaalla ja sen 10 nappulaa, ja heti sen edessä olevalla rivillä 5 tyhjää paikkaa, jotka on merkitty renkaalla.",
  tekst: "Jokainen ensimmäinen siirto päättyy johonkin näistä 5 paikasta.",
})}
      <p>Tässä oppaassa rivi on kärkesi poikki kulkeva paikkojen jono, joka on samansuuntainen sen etureunan kanssa, ja etenemistä lasketaan riveinä. Askel vie nappulaa eteenpäin 1 rivin ja hyppy 2 riviä. Jokaisella pelaajalla on samat 14 ensimmäistä siirtoa, olipa pelaajia 2, 3, 4 tai 6 ja lähdit tähden miltä kärjeltä tahansa, koska jokainen kärki näyttää sisäpuolelta samalta.</p>
    </section>

    <section aria-labelledby="opening-1">
      <h2 id="opening-1">Avaus 1: hyppää ulos ja vapauta sitten huippu</h2>
      <p>Kärkesi huipulla oleva nappula on kauimpana maalistasi, eikä se voi liikkua alussa: se voi hypätä nappulan yli vain, jos tuon nappulan takana oleva paikka on tyhjä. Hyppy toiselta riviltä tekee juuri sellaisen paikan.</p>
      <ol>
        <li><strong>Siirto 1:</strong> toisen rivisi oikeanpuoleisessa päässä oleva nappula hyppää edessään olevan nappulan yli. Se laskeutuu kärkesi edessä olevalle riville ja etenee 2 riviä.</li>
        <li><strong>Siirto 2:</strong> huipulla oleva nappula hyppää kahdesti yhdessä siirrossa: ensin siirron 1 tyhjentämään paikkaan ja sitten toisen rivin nappulan yli. Se etenee 4 riviä.</li>
      </ol>
${plaatje({
  bestand: "guide-opening-tip.svg",
  max: "20rem",
  alt: "Punainen kärki siirron 1 jälkeen. Huipulla olevalla nappulalla on rengas, ja 2 nuolta numeroin 1 ja 2 näyttävät sen hypyt tyhjennetyn paikan kautta kärjen edessä olevalle riville.",
  tekst: "Siirron 1 jälkeen huipun nappula hyppää ulos 2 hypyllä.",
})}
      <p>Se on 6 riviä 2 siirrossa. Kokeilimme kaikki tavat pelata 2 siirtoa, ja 6 on eniten, minkä voit saada. Vain 4 siirtoparia yltää siihen: toisen rivin kummassa tahansa päässä oleva nappula hyppää, kumpaan tahansa 2 suunnasta, ja huipun nappula seuraa. Toisen rivin keskimmäinen nappula ei käy, koska se pitää huipun suljettuna.</p>
      <p>Kumpikin nappula on nyt kärkesi edessä olevalla rivillä, ja niiden välissä on tyhjä paikka. Se on tikapuiden ensimmäinen puola.</p>
    </section>

    <section aria-labelledby="opening-2">
      <h2 id="opening-2">Avaus 2: 4 siirtoa 4 eri nappulalla</h2>
      <p>4 siirrossa voit edetä enintään 13 riviä, ja siihen päästään vain, kun jokaisessa siirrossa on eri nappula. Tämä linja onnistuu:</p>
      <ol>
        <li><strong>Siirto 1:</strong> etummaisen rivin oikeanpuoleisessa päässä oleva nappula astuu eteenpäin. Se etenee 1 rivin.</li>
        <li><strong>Siirto 2:</strong> kolmannen rivin oikeanpuoleisessa päässä oleva nappula hyppää kahdesti. Se etenee 4 riviä.</li>
        <li><strong>Siirto 3:</strong> toisen rivin vasemmanpuoleisessa päässä oleva nappula hyppää kahdesti. Se etenee 4 riviä.</li>
        <li><strong>Siirto 4:</strong> huipulla oleva nappula hyppää kahdesti. Se etenee 4 riviä.</li>
      </ol>
      <div class="raster raster-twee">
        ${rasterPlaatje({
          bestand: "guide-opening-four-before.svg",
          alt: "Punainen kärki alussa. Siirtyvät 4 nappulaa on numeroitu siirtojen järjestyksessä, numerosta 1 numeroon 4.",
          tekst: "Ennen: siirtyvät nappulat järjestyksessä.",
        })}
        ${rasterPlaatje({
          bestand: "guide-opening-four-after.svg",
          alt: "Punainen kärki 4 siirron jälkeen. Kärjen edessä olevilla riveillä on 4 paikkaa, joihin numeroidut nappulat laskeutuivat, ja kärkeen jäi 4 aukkoa.",
          tekst: "Jälkeen: minne ne laskeutuivat.",
        })}
      </div>
      <p>Jokainen siirto valmistelee seuraavaa. Siirrot 2 ja 3 päättyvät hyppyyn juuri äsken siirtyneen nappulan yli, ja siirto 4 alkaa aukosta, jonka siirto 3 jätti. Kaikki 4 nappulaa laskeutuvat laudan omalle puolellesi.</p>
      <p>On muitakin linjoja, joilla saa 13 riviä. Niitä yhdistää sama ajatus: etsi siirto, joka jättää aukon tai askelkiven seuraavalle siirrolle, ja päästä huipun nappula ulos viimeistään siirrolla 4.</p>
    </section>

    <section aria-labelledby="fouten">
      <h2 id="fouten">Virheet ensimmäisissä siirroissa</h2>
      <ul class="tips">
        <li><strong>Saman nappulan siirtäminen joka vuorolla.</strong> Yksin juokseva nappula etenee 5 riviä 4 siirrossa, kun 4 eri nappulaa etenevät yhteensä 13. Lisäksi muut nappulasi jäävät paikoilleen.</li>
      </ul>
${plaatje({
  bestand: "guide-opening-runner.svg",
  max: "20rem",
  alt: "Punainen kärki alussa. Yksi toisen rivin nappula tekee 4 siirtoa peräkkäin samaa linjaa pitkin, nuolin ja numeroin 1:stä 4:ään, ja päätyy yksin laudan keskustan lähelle.",
  tekst: "Yksi nappula, 4 siirtoa, 5 riviä.",
})}
      <ul class="tips">
        <li><strong>Vain etummaisen rivin astuminen.</strong> 4 askelta etenee 4 riviä. Sen jälkeen huipun nappula ei vieläkään voi liikkua, joten se jää taakse, kun muut etenevät.</li>
        <li><strong>Sivuttain astuminen.</strong> Askel rivin suuntaisesti etenee 0 riviä. Avauksen 1 siirron 1 jälkeen edessä oleva nappula voi astua viereiseen paikkaan, ja se näyttää edistykseltä, mutta siirto menee hukkaan.</li>
      </ul>
    </section>

    <section aria-labelledby="verder">
      <h2 id="verder">Jatka tästä</h2>
      <p>Noin 4 siirron jälkeen armeijat tulevat lähelle toisiaan, ja yllä olevat avaukset väistyvät keskipelille. Linjoja ei tarvitse muistaa: muista, että jokaisen siirron pitää valmistella seuraavaa.</p>
      <ul>
        <li><a href="/play/">Pelaa tietokonetta vastaan selaimessa</a> ja kokeile avausta 1 tai 2.</li>
        <li><a href="/fi/oppaat/kiinansakki-strategia">Kiinanšakin strategia</a>: tikapuut, nappuloiden pitäminen yhdessä ja maalin täyttäminen.</li>
        <li><a href="/fi/oppaat/kiinansakki-kahdelle">Kiinanšakki kahdelle pelaajalle</a>: miten kahden pelaajan peli toimii.</li>
        <li><a href="/fi/saannot/kiinansakki">Kiinanšakin säännöt</a>, joissa on kuvat askelista, hypyistä ja ketjuista.</li>
      </ul>
    </section>`;

export default {
  nav: "Kiinanšakin avaukset",
  titel: "Kiinanšakin avaukset: 2 avausta | Leapstone",
  beschrijving: "Kiinanšakin avaukset: hyppää ulos kärjestäsi, vapauta huipun nappula siirrolla 2 ja etene 13 riviä 4 siirrossa. Mukana vältettävät virheet.",
  h1: "Kiinanšakin avaukset",
  intro: "Hyvä kiinanšakin avaus hyppää toiselta riviltä, käyttää joka vuorolla eri nappulaa ja päästää kärkesi huipun nappulan ulos siirrolla 2 tai 4. Kaksi avausta kuvineen ja vältettävät virheet.",
  inhoud,
};
