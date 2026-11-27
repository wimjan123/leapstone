// Suomenkielinen opas Kiinanšakin strategia (taak 134): /fi/oppaat/kiinansakki-strategia.
// Sisältö: englanninkielinen opas ../en/chinese-checkers-strategy.mjs, lause lauseelta suomeksi. Jokainen vinkki on tarkistettu crates/halma-core -koodia vastaan
// (ks. docs/plan.md, taak 122); kuvat tulevat tiedostosta crates/halma-core/examples/regelplaatjes.rs.
// Ei keksittyjä "asiantuntijoita", lukuja tai historiaa. Ainoa luku on 16 (askelta kärjestä kärkeen), jonka esimerkki laskee.
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="eerst">
      <h2 id="eerst">Mihin nämä vinkit perustuvat</h2>
      <p>Vinkit seuraavat <a href="/fi/saannot/kiinansakki">kiinanšakin säännöistä</a> sellaisina kuin Leapstone ne pelaa: yksi siirto on yksi askel tai hyppyketju, ja voit hypätä minkä värisen tahansa nappulan yli. Ne eivät ole todiste parhaasta pelistä. Nopeimmin kokeilet niitä tietokonetta vastaan.</p>
    </section>

    <section aria-labelledby="ladders">
      <h2 id="ladders">1. Rakenna tikapuita</h2>
      <p>Tikapuut ovat nappuloiden rivi, jossa jokaisen välissä on yksi tyhjä paikka. Rivin päässä oleva nappula hyppää koko rivin yli yhdessä siirrossa, joten se ylittää laudan yhdellä vuorolla yhden paikan sijaan.</p>
${plaatje({
  bestand: "ladder.svg",
  max: "15rem",
  alt: "Neljä nappulaa vinossa rivissä, joiden välissä on tyhjä paikka. Punainen nappula rivin päässä hyppää kaikkien neljän yli, ja neljä laskeutumispaikkaa on numeroitu.",
  tekst: "Neljä hyppyä yhdessä siirrossa. Sama nappula voisi muuten astua vain yhden paikan kerrallaan.",
})}
      <p>Hyppy toimii kaikkiin kuuteen suuntaan, myös taaksepäin, joten tikapuiden ei tarvitse alkaa omasta kärjestäsi. Kelpaa mikä tahansa nappuloiden rivi, jossa on välit.</p>
    </section>

    <section aria-labelledby="achterblijvers">
      <h2 id="achterblijvers">2. Pidä nappulasi yhdessä</h2>
      <p>Tarvitset kaikki 10 nappulaa maaliin, joten viimeinen nappulasi ratkaisee, milloin valmistut. Nappulalla, jonka vieressä ei ole nappulaa, ei ole mitään hypättävää, ja se voi vain astua.</p>
${plaatje({
  bestand: "guide-straggler.svg",
  max: "20rem",
  alt: "Tähtilauta, jonka alakärjessä on yksi punainen nappula yksin. Vain sen kaksi tyhjää naapuria on merkitty. Muita punaisia ja sinisiä nappuloita on keskellä.",
  tekst: "Tällä nappulalla ei ole naapuria, joten se voi vain astua kahteen merkittyyn paikkaan.",
})}
      <p>Oman kärkesi huipusta laudan toisella puolella olevan maalin huippuun on 16 askelta. Se on 16 vuoroa yksinäiselle nappulalle, kun tikapuut ylittävät laudan yhdellä. Siirrä takana olevia nappuloita, kun niiden ympärillä on vielä nappuloita, joiden yli hypätä. Myös Leapstonen tietokone tekee näin: se antaa takimmaisten nappuloiden siirroille hieman korkeammat pisteet.</p>
    </section>

    <section aria-labelledby="midden">
      <h2 id="midden">3. Käytä keskustaa</h2>
      <p>Laudan keskellä olevalla nappulalla on kuusi naapuria, joten se voi astua tai hypätä kuuteen suuntaan. Reunalla olevalla nappulalla niitä on vähemmän. Kuvan reunanappulalla niitä on neljä.</p>
${plaatje({
  bestand: "guide-middle.svg",
  max: "20rem",
  alt: "Tähtilauta, jossa yksi punainen nappula on keskellä ja sen kuusi naapuria on merkitty, ja yksi punainen nappula vasemman yläreunan lähellä, ja sen neljä naapuria on merkitty.",
  tekst: "Keskellä kuusi tapaa astua, reunalla neljä.",
})}
      <p>Keskellä olevat nappulat antavat myös muille nappuloille jotain, minkä yli hypätä matkalla laudan yli.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">4. Täytä maali takaa</h2>
      <p>Maalisi on 10 paikan kolmio, jonka rivit ovat 4, 3, 2 ja 1 paikkaa. Takana oleviin paikkoihin pääsee vain niiden edessä olevien paikkojen kautta. Jos täytät etuosan ensin, viimeisellä nappulalla ei välttämättä ole tietä sisään.</p>
${plaatje({
  bestand: "guide-goal-gap.svg",
  max: "17rem",
  alt: "Maalikärki ylhäällä, jossa on yhdeksän punaista nappulaa ja yksi tyhjä paikka aivan takana, merkittynä katkoviivoilla. Kymmenes punainen nappula, valkoisella renkaalla, seisoo etummaisen rivin alapuolella.",
  tekst: "Yhdeksän nappulaa on perillä, ja takana oleva paikka on tyhjä. Kymmenennellä nappulalla ei ole siirtoa sinne.",
})}
      <p>Vie ensimmäiset nappulat takimmaisiin paikkoihin ja etene kohti etuosaa, jotta etuosa pysyy auki viimeisenä saapuville nappuloille.</p>
    </section>

    <section aria-labelledby="vast">
      <h2 id="vast">5. Älä muuraa kiinni maalissasi olevaa nappulaa</h2>
      <p>Saat pysähtyä toisen pelaajan kärkeen, joten toisen pelaajan nappula voi päätyä maaliisi. Voitat vain, kun kaikissa maalisi 10 paikassa on omia nappuloitasi. Jos tuolla nappulalla ei ole siirtoa, kukaan ei voi siirtää sitä, etkä voi voittaa, ennen kuin sen vieressä oleva paikka vapautuu.</p>
${plaatje({
  bestand: "guide-goal-trapped.svg",
  max: "17rem",
  alt: "Maalikärki ylhäällä, jossa on yhdeksän punaista nappulaa ja yksi sininen nappula aivan takana, merkittynä valkoisella renkaalla. Punaiset nappulat ympäröivät sinisen nappulan.",
  tekst: "Takana olevalla sinisellä nappulalla ei ole siirtoa, eikä punainen voi täyttää maalia.",
})}
      <p>Pidä tällaisen nappulan vieressä paikka auki, jotta se pääsee lähtemään. Leapstonen tietokone ottaa tämän huomioon: siirto, joka vangitsee toisen pelaajan nappulan tämän maaliin, saa alemmat pisteet. Säännöt eivät pakota ketään poistumaan maalistasi, joten toinen pelaaja voi myös pysäköidä nappulan sinne tahallaan.</p>
    </section>

    <section aria-labelledby="blokkeren">
      <h2 id="blokkeren">6. Estä hyppy tai jätä se</h2>
      <p>Hyppy tarvitsee tyhjän paikan, johon laskeutua. Täytä se paikka, ja hyppy on poissa. Kahden peräkkäisen nappulan yli ei myöskään voi hypätä.</p>
      <p>Nappulasi ovat askelkiviä myös toiselle pelaajalle. Vasemmassa kuvassa sininen ylittää kaksi punaista nappulaa yhdessä siirrossa. Oikealla punainen siirsi yhden nappulan ensimmäiseen laskeutumispaikkaan, ja sininen voi vain astua.</p>
      <div class="raster raster-twee">
        ${rasterPlaatje({
          bestand: "guide-block-before.svg",
          alt: "Sininen nappula ja kaksi punaista nappulaa samassa linjassa, joiden kummankin takana on tyhjä paikka. Nuolet näyttävät sinisen nappulan kaksi hyppyä.",
          tekst: "Ennen: sininen voi tehdä kaksi hyppyä.",
        })}
        ${rasterPlaatje({
          bestand: "guide-block-after.svg",
          alt: "Sama linja sen jälkeen, kun punainen siirsi kaukaisen nappulansa ensimmäiseen laskeutumispaikkaan. Sinisen nappulan perässä on kaksi punaista nappulaa peräkkäin.",
          tekst: "Jälkeen: punainen siirsi yhden nappulan. Sinisellä ei ole hyppyä.",
        })}
      </div>
      <p>Estämiseen käytetty siirto on siirto, jota ei käytetä omaan etenemiseen, joten estä silloin, kun hyppy antaa toiselle pelaajalle enemmän kuin siirtosi antaisi sinulle. Toisin päin käy, kun rakennat tikapuita: siirtosi jälkeen toinen pelaaja siirtää ensin, joten hänen nappulansa tikapuiden päässä käyttää tikapuitasi ennen sinua. Vaikeimmalla tasolla tietokone katsoo jokaisen vastustajan parhaan vastauksen ennen kuin se valitsee siirron.</p>
    </section>

    <section aria-labelledby="verder">
      <h2 id="verder">Jatka tästä</h2>
      <ul>
        <li><a href="/play/">Pelaa tietokonetta vastaan selaimessa</a> ja kokeile tikapuita.</li>
        <li><a href="/fi/oppaat/kiinansakki-kahdelle">Kiinanšakki kahdelle pelaajalle</a>: miten kahden pelaajan peli toimii.</li>
        <li><a href="/fi/saannot/kiinansakki">Kiinanšakin säännöt</a>, joissa on kuvat askelista, hypyistä ja ketjuista.</li>
      </ul>
      <p><a href="/fi/oppaat/kiinansakki-verkossa-kavereiden-kanssa">Kiinanšakki verkossa kavereiden kanssa</a></p>
      <p><a href="/fi/oppaat/halma-vai-kiinansakki">Halma vai kiinanšakki</a></p>
      <p><a href="/fi/oppaat/kiinansakki-kolmelle">Kiinanšakki kolmelle pelaajalle</a></p>
    </section>`;

export default {
  nav: "Kiinanšakin strategia",
  titel: "Kiinanšakin strategia: 6 vinkkiä kuvien kanssa | Leapstone",
  beschrijving: "Kiinanšakin strategia: rakenna tikapuita, pidä nappulat yhdessä, käytä keskustaa, täytä maali takaa ja opi, milloin hyppy kannattaa estää.",
  h1: "Kiinanšakin strategia",
  intro: "Kuusi vinkkiä tähtilaudalle, jokaisella kuva oikeista säännöistä: tikapuut, jälkeen jääneet, keskusta, maalin täyttäminen ja hyppyjen estäminen.",
  inhoud,
};
