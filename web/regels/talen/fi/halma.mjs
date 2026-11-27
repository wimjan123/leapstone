// Suomenkielinen sääntösivu Halma (taak 134): /fi/saannot/halma. Sisältö: englanninkielinen sivu ../en/halma.mjs (tarkistettu
// crates/halma-core -koodia vastaan, ks. docs/plan.md, taak 117), lause lauseelta suomeksi. Kun sääntö muuttuu, muutetaan kaikki kielet.
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const opstelling = [
  rasterPlaatje({
    bestand: "halma-setup-2.svg",
    tekst: "2 pelaajaa: 19 nappulaa kullakin",
    alt: "Neliölauta, jonka vasemmassa yläkulmassa on 19 punaista nappulaa ja oikeassa alakulmassa 19 sinistä nappulaa",
  }),
  rasterPlaatje({
    bestand: "halma-setup-4.svg",
    tekst: "4 pelaajaa: 13 nappulaa kullakin",
    alt: "Neliölauta, jonka jokaisessa neljässä kulmassa on 13 nappulaa: punaiset vasemmalla ylhäällä, siniset oikealla ylhäällä, vihreät oikealla alhaalla ja keltaiset vasemmalla alhaalla",
  }),
].join("\n        ");

const inhoud = `    <section aria-labelledby="bord">
      <h2 id="bord">Lauta</h2>
      <p>Halmaa pelataan neliönmuotoisella laudalla, jossa on 16 × 16 paikkaa, yhteensä 256. Jokaisella paikalla on enintään kahdeksan naapuria: neljä suoraa ja neljä vinoa. Reunalla olevalla paikalla niitä on vähemmän, ja kulmassa kolme.</p>
      <p>Tämä on Leapstonen neliölauta. Jos tunnet pelin tähtilaudalla, lue <a href="/fi/saannot/mika-on-sternhalma">Sternhalmasta</a> ja <a href="/fi/saannot/kiinansakki">kiinanšakin säännöt</a>.</p>
    </section>

    <section aria-labelledby="begin">
      <h2 id="begin">Näin nappulat aloittavat</h2>
      <p>Halmaa pelaa 2 tai 4 pelaajaa. Jokainen pelaaja aloittaa nappuloillaan leirissä laudan kulmassa. Vastakkaisen kulman leiri on sinun maalisi.</p>
      <ul>
        <li><strong>2 pelaajaa:</strong> 19 nappulaa kullakin, kahdessa vastakkaisessa kulmassa. Leirissä on viisi riviä, joissa on 5, 5, 4, 3 ja 2 paikkaa.</li>
        <li><strong>4 pelaajaa:</strong> 13 nappulaa kullakin, yksi leiri jokaisessa kulmassa. Leirissä on neljä riviä, joissa on 4, 4, 3 ja 2 paikkaa. Maalisi on laudan toisella puolella oleva kulma, vinosti vastapäätä.</li>
      </ul>
      <div class="raster raster-twee">
        ${opstelling}
      </div>
    </section>

    <section aria-labelledby="beurt">
      <h2 id="beurt">Vuorot</h2>
      <p>Pelaaja 1 aloittaa. Sen jälkeen vuorot menevät järjestyksessä, ja viimeisen pelaajan jälkeen vuoro on taas Pelaajalla 1. Leapstonessa värit kuuluvat numeroille: punainen, sininen, vihreä ja keltainen.</p>
      <p>Omalla vuorollasi siirrät yhtä nappulaa, kerran. Mitään ei syödä: nappulat pysyvät laudalla, kunnes niiden pelaaja luovuttaa.</p>
    </section>

    <section aria-labelledby="stap">
      <h2 id="stap">Askel</h2>
      <p>Siirrä nappula viereiseen tyhjään paikkaan mihin tahansa kahdeksasta suunnasta: suoraan tai vinoon.</p>
${plaatje({
  bestand: "halma-step.svg",
  max: "17rem",
  alt: "Punainen nappula, jonka ympärillä on valkoinen rengas. Viisi sen kahdeksasta naapurista on tyhjiä ja merkittyjä; kolmessa muussa on nappula.",
  tekst: "Punainen nappula voi astua viiteen merkittyyn paikkaan. Kolme muuta naapuria ovat varattuja.",
})}
    </section>

    <section aria-labelledby="sprong">
      <h2 id="sprong">Hyppy</h2>
      <p>Hyppää yhden viereisen nappulan yli, minkä värisen tahansa, ja laskeudu tyhjään paikkaan heti sen takana, suoraan linjaan. Voit hypätä kaikkiin kahdeksaan suuntaan, myös vinoon ja taaksepäin.</p>
      <ul>
        <li>Paikan, johon laskeudut, täytyy olla tyhjä.</li>
        <li>Et voi hypätä kahden peräkkäisen nappulan yli etkä tyhjän paikan yli.</li>
        <li>Nappula, jonka yli hyppäät, pysyy paikallaan.</li>
        <li>Et voi hypätä laudan reunan yli.</li>
      </ul>
${plaatje({
  bestand: "halma-jump.svg",
  max: "17rem",
  alt: "Punainen nappula hyppää vinosti sinisen nappulan yli sen takana olevaan tyhjään paikkaan, nuolella näytettynä.",
  tekst: "Punainen nappula hyppää vinosti sinisen nappulan yli.",
})}
    </section>

    <section aria-labelledby="keten">
      <h2 id="keten">Hyppyketju</h2>
      <p>Hypyn jälkeen sama nappula saa hypätä uudelleen, niin monta kertaa kuin pystyy, mihin suuntaan tahansa, suoraan tai vinoon. Sinä päätät, mihin pysähdyt. Kaikki hypyt yhteensä ovat yksi siirto.</p>
      <ul>
        <li>Yhdessä siirrossa et voi laskeutua samaan paikkaan kahdesti.</li>
        <li>Siirto on yksi askel tai yksi tai useampi hyppy. Hypyn jälkeen et voi astua.</li>
      </ul>
${plaatje({
  bestand: "halma-chain.svg",
  max: "17rem",
  alt: "Punainen nappula tekee kolme hyppyä yhdessä siirrossa: vinosti sinisen nappulan yli, suoraan toisen sinisen nappulan yli ja vinosti punaisen nappulan yli. Kolme laskeutumispaikkaa on numeroitu 1, 2 ja 3.",
  tekst: "Yksi siirto kolmella hypyllä, numeroiden järjestyksessä.",
})}
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Maali</h2>
      <p>Voitat, kun olet siirtänyt kaikki nappulasi leiriin, joka on vastapäätä aloitusleiriäsi. Kaikissa tämän leirin paikoissa täytyy olla omia nappuloitasi: 19 kun pelaajia on 2, 13 kun pelaajia on 4. Niin kauan kuin siellä on toisen pelaajan nappula, et voi päästä maaliin.</p>
      <p>Voit laskeutua mihin tahansa tyhjään paikkaan, myös toisten pelaajien leireihin. Maalissasi oleva nappula saa lähteä sieltä uudelleen; mikään ei lukitse sitä.</p>
${plaatje({
  bestand: "halma-goal.svg",
  max: "20rem",
  alt: "Neliölauta kahdelle pelaajalle. Punainen aloittaa vasemmasta yläkulmasta; oikean alakulman leiri, merkittynä katkoviivaympyröillä ja sinisten nappuloiden täyttämänä, on punaisen maali.",
  tekst: "2 pelaajalla punaisen maali on leiri, josta sininen aloittaa.",
})}
    </section>

    <section aria-labelledby="spelers">
      <h2 id="spelers">2 tai 4 pelaajalla</h2>
      <ul>
        <li><strong>2 pelaajaa:</strong> ensimmäinen pelaaja, joka täyttää maalin, voittaa, ja peli päättyy.</li>
        <li><strong>4 pelaajaa:</strong> ensimmäinen pelaaja, joka täyttää maalin, voittaa. Muut pelaavat edelleen seuraavista sijoista, ja valmis pelaaja ohitetaan. Peli päättyy, kun enää yksi pelaaja on mukana.</li>
      </ul>
    </section>

    <section aria-labelledby="opgeven">
      <h2 id="opgeven">Luovuttaminen</h2>
      <p>Kun luovutat, nappulasi poistuvat laudalta, joten ne eivät estä ketään. 2 pelaajalla toinen pelaaja voittaa. 4 pelaajalla peli jatkuu ilman sinua, ja jos kaikki paitsi yksi pelaaja luovuttavat, viimeinen pelaaja voittaa.</p>
      <p>Verkkopelissä jokaisella siirrolla on aikaraja. Sen asettaa pelaaja, joka aloittaa pelin. Kun aikasi loppuu, vuorosi ohitetaan. Jos ohitat 3 vuoroa peräkkäin, luovutat. Tietokonetta vastaan ja yhdellä puhelimella pelattavissa peleissä ei ole aikarajaa.</p>
    </section>

    <section aria-labelledby="tips">
      <h2 id="tips">Vinkit</h2>
      <ul class="tips">
        <li><strong>Rakenna tikapuita.</strong> Aseta nappulat riviin niin, että niiden välissä on yksi tyhjä paikka, suoraan tai vinoon, kohti maaliasi. Yksi nappula voi silloin hypätä koko rivin pituudelta yhdessä siirrossa.</li>
        <li><strong>Jokainen nappula on tikapuut.</strong> Voit hypätä minkä värisen tahansa nappulan yli, joten myös toisten pelaajien nappulat auttavat sinua. Ja omat tikapuusi auttavat heitä: katso, mitä jätät jälkeesi.</li>
        <li><strong>Käytä vinoja suuntia.</strong> Maali on vastakkaisessa kulmassa, joten vino nappuloiden rivi on nopein tapa ylittää lauta.</li>
        <li><strong>Älä unohda jälkeen jääneitä.</strong> Tarvitset kaikki nappulasi perille. Kaukana jäljessä oleva nappula, jolla ei ole mitään, minkä yli hypätä, liikkuu yhden paikan vuorossa. Tuo se mukaan, kun muut nappulat ovat vielä sen ympärillä.</li>
        <li><strong>Sinun aloituksesi on heidän maalinsa.</strong> 2 pelaajalla leirisi on toisen pelaajan maali, eikä hän pääse maaliin, kun yksi nappuloistasi on vielä siellä. Leapstonessa voit pitää nappulan kotona, joten voit estää näin. Sama pätee sinuun.</li>
      </ul>
    </section>

    <section aria-labelledby="vragen">
      <h2 id="vragen">Kysymyksiä</h2>
      <h3>Kuinka monta pelaajaa Halmaa voi pelata?</h3>
      <p>Kaksi tai neljä. Halmaa pelataan neliönmuotoisella laudalla, jossa on 16 × 16 paikkaa, ja jokainen pelaaja aloittaa kulmasta.</p>
      <h3>Kuinka monta nappulaa jokaisella pelaajalla on Halmassa?</h3>
      <p>19 nappulaa jokaisella 2 pelaajalla ja 13 nappulaa jokaisella 4 pelaajalla.</p>
      <h3>Kuka keksi Halman?</h3>
      <p>George Howard Monks, yhdysvaltalainen kirurgi, vuonna 1883 tai 1884. Nimi on kreikkaa ja tarkoittaa ”hyppyä”. Lue lisää: <a href="/fi/saannot/mika-on-sternhalma">Sternhalma</a>.</p>
      <h3>Mitä eroa on Halmalla ja kiinanšakilla?</h3>
      <p>Halmaa pelataan neliölaudalla, siirrot ja hypyt kahdeksaan suuntaan, ja jokaisella on 19 tai 13 nappulaa. Kiinanšakissa lauta on tähden muotoinen, suuntia on kuusi ja jokaisella on 10 nappulaa, 2, 3, 4 tai 6 pelaajalle.</p>
      <h3>Voiko Halmaa pelata netissä ilmaiseksi?</h3>
      <p>Kyllä, Leapstonessa, selaimessa tai App Storesta ladattavassa sovelluksessa. Valitse pelitapa, esimerkiksi tietokonetta vastaan tai netissä ystävien kanssa, ja sitten Neliölauta. Leapstone on ilmainen, ilman mainoksia.</p>
    </section>

    <section aria-labelledby="meer">
      <h2 id="meer">Pelaa sitä</h2>
      <p>Pelaa nyt -painike avaa pelin tietokonetta vastaan <a href="/fi/saannot/kiinansakki">tähtilaudalla</a>. Halmaa pelataksesi napauta ylhäällä olevaa takaisin-nuolta, valitse sitten Pelaa tällä puhelimella, Pelaa tietokonetta vastaan tai Pelaa netissä ystävien kanssa, ja napauta Neliölauta.</p>
    </section>`;

export default {
  nav: "Halman säännöt",
  titel: "Halman säännöt ja vinkit | Leapstone",
  beschrijving: "Näin pelataan Halmaa 16 × 16 -neliölaudalla: aloitus, askeleet, hypyt, hyppyketjut, voittaminen ja vinkit. Pelaa ilmaiseksi selaimessa.",
  h1: "Halman säännöt",
  intro: "Siirrä kaikki nappulasi neliölaudan yli vastakkaiseen kulmaan ennen muita. Säännöt lyhyesti, kuvien kanssa, ja muutama vinkki.",
  inhoud,
};
