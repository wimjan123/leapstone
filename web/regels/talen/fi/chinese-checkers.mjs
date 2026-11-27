// Suomenkielinen sääntösivu Kiinanšakki (taak 134): /fi/saannot/kiinansakki. Sisältö: englanninkielinen sivu ../en/chinese-checkers.mjs
// (tarkistettu crates/halma-core -koodia vastaan, ks. docs/plan.md, taak 116), lause lauseelta suomeksi.
// Jokaisen säännön pitää täsmätä englanninkielisen sivun kanssa; kun sääntö muuttuu, muutetaan kaikki kielet.
// Samat kuvat (ei kieltä: SVG:ssä vain numeroita); alt-tekstit ja kuvatekstit ovat suomeksi.
import { plaatje, rasterPlaatje } from "../../plaatje.mjs";

const opstelling = [2, 3, 4, 6]
  .map((n) =>
    rasterPlaatje({
      bestand: `setup-${n}.svg`,
      tekst: `${n} pelaajaa`,
      alt:
        {
          2: "Tähtilauta, jonka alakärjessä on 10 punaista nappulaa ja yläkärjessä 10 sinistä nappulaa",
          3: "Tähtilauta, jossa punaiset nappulat ovat alhaalla, siniset vasemmalla ylhäällä ja vihreät oikealla ylhäällä",
          4: "Tähtilauta, jossa nappulat ovat neljässä kärjessä: punaiset alhaalla, vihreät ylhäällä, siniset vasemmalla alhaalla ja keltaiset oikealla ylhäällä",
          6: "Tähtilauta, jossa nappulat ovat kaikissa kuudessa kärjessä, kuutta väriä",
        }[n],
    }),
  )
  .join("\n        ");

const inhoud = `    <section aria-labelledby="bord">
      <h2 id="bord">Lauta</h2>
      <p>Kiinanšakkia pelataan kuusikärkisellä tähdellä. Laudalla on 121 paikkaa, ja jokaisessa kärjessä niitä on 10. Laudan sisällä jokaisella paikalla on kuusi naapuria.</p>
    </section>

    <section aria-labelledby="begin">
      <h2 id="begin">Näin nappulat aloittavat</h2>
      <p>Jokaisella pelaajalla on 10 nappulaa, ja ne aloittavat tähden yhdessä kärjessä. Vastakkainen kärki on sinun maalisi.</p>
      <ul>
        <li><strong>2 pelaajaa:</strong> kaksi kärkeä, jotka ovat vastakkain.</li>
        <li><strong>3 pelaajaa:</strong> joka toinen kärki. Kolme maalia ovat aluksi tyhjiä.</li>
        <li><strong>4 pelaajaa:</strong> kaksi paria vierekkäisiä kärkiä. Jokaisella pelaajalla on toinen pelaaja vastapäätä.</li>
        <li><strong>6 pelaajaa:</strong> kaikki kuusi kärkeä.</li>
      </ul>
      <div class="raster">
        ${opstelling}
      </div>
    </section>

    <section aria-labelledby="beurt">
      <h2 id="beurt">Vuorot</h2>
      <p>Pelaaja 1 aloittaa. Sen jälkeen vuorot menevät järjestyksessä: Pelaaja 2, Pelaaja 3 ja niin edelleen, ja viimeisen pelaajan jälkeen vuoro on taas Pelaajalla 1. Leapstonessa värit kuuluvat numeroille: punainen, sininen, vihreä, keltainen, violetti ja hopea.</p>
      <p>Omalla vuorollasi siirrät yhtä nappulaa, kerran. Mitään ei syödä: nappulat pysyvät laudalla, kunnes niiden pelaaja luovuttaa.</p>
    </section>

    <section aria-labelledby="stap">
      <h2 id="stap">Askel</h2>
      <p>Siirrä nappula viereiseen tyhjään paikkaan.</p>
${plaatje({
  bestand: "step.svg",
  max: "17rem",
  alt: "Punainen nappula, jonka ympärillä on valkoinen rengas. Kolme sen kuudesta naapurista on tyhjiä ja merkittyjä; kolmessa muussa on nappula.",
  tekst: "Punainen nappula voi astua kolmeen merkittyyn paikkaan. Kolme muuta naapuria ovat varattuja.",
})}
    </section>

    <section aria-labelledby="sprong">
      <h2 id="sprong">Hyppy</h2>
      <p>Hyppää yhden viereisen nappulan yli, minkä värisen tahansa, ja laskeudu tyhjään paikkaan heti sen takana, suoraan linjaan. Voit hypätä kuuteen suuntaan, myös taaksepäin.</p>
      <ul>
        <li>Paikan, johon laskeudut, täytyy olla tyhjä.</li>
        <li>Et voi hypätä kahden peräkkäisen nappulan yli etkä tyhjän paikan yli.</li>
        <li>Nappula, jonka yli hyppäät, pysyy paikallaan.</li>
      </ul>
${plaatje({
  bestand: "jump.svg",
  max: "17rem",
  alt: "Punainen nappula hyppää sinisen nappulan yli sen takana olevaan tyhjään paikkaan, nuolella näytettynä.",
  tekst: "Punainen nappula hyppää sinisen nappulan yli.",
})}
    </section>

    <section aria-labelledby="keten">
      <h2 id="keten">Hyppyketju</h2>
      <p>Hypyn jälkeen sama nappula saa hypätä uudelleen, niin monta kertaa kuin pystyy ja mihin suuntaan tahansa. Sinä päätät, mihin pysähdyt. Kaikki hypyt yhteensä ovat yksi siirto.</p>
      <ul>
        <li>Yhdessä siirrossa et voi laskeutua samaan paikkaan kahdesti.</li>
        <li>Siirto on yksi askel tai yksi tai useampi hyppy. Hypyn jälkeen et voi astua.</li>
      </ul>
${plaatje({
  bestand: "chain.svg",
  max: "17rem",
  alt: "Punainen nappula tekee kolme hyppyä yhdessä siirrossa, sinisen, vihreän ja toisen sinisen nappulan yli. Kolme laskeutumispaikkaa on numeroitu 1, 2 ja 3.",
  tekst: "Yksi siirto kolmella hypyllä, numeroiden järjestyksessä.",
})}
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Maali</h2>
      <p>Voitat, kun olet siirtänyt kaikki 10 nappulaasi aloituskärkesi vastakkaiseen kärkeen. Kaikissa tämän kärjen 10 paikassa täytyy olla omia nappuloitasi. Niin kauan kuin siellä on toisen pelaajan nappula, et voi päästä maaliin.</p>
      <p>Voit laskeutua mihin tahansa tyhjään paikkaan, myös toisten pelaajien kärkiin.</p>
${plaatje({
  bestand: "goal.svg",
  max: "20rem",
  alt: "Tähtilauta kolmelle pelaajalle. Punainen aloittaa alhaalta; tyhjä kärki ylhäällä, merkittynä katkoviivaympyröillä, on punaisen maali.",
  tekst: "3 pelaajalla punainen aloittaa alhaalta. Punaisen maali on tyhjä kärki ylhäällä.",
})}
    </section>

    <section aria-labelledby="spelers">
      <h2 id="spelers">2, 3, 4 tai 6 pelaajalla</h2>
      <ul>
        <li><strong>2 pelaajaa:</strong> ensimmäinen pelaaja, joka täyttää maalin, voittaa, ja peli päättyy.</li>
        <li><strong>3, 4 tai 6 pelaajaa:</strong> ensimmäinen pelaaja, joka täyttää maalin, voittaa. Muut pelaavat edelleen seuraavista sijoista, ja valmis pelaaja ohitetaan. Peli päättyy, kun enää yksi pelaaja on mukana.</li>
      </ul>
    </section>

    <section aria-labelledby="opgeven">
      <h2 id="opgeven">Luovuttaminen</h2>
      <p>Kun luovutat, nappulasi poistuvat laudalta, joten ne eivät estä ketään. 2 pelaajalla toinen pelaaja voittaa. Useammalla pelaajalla peli jatkuu ilman sinua, ja jos kaikki paitsi yksi pelaaja luovuttavat, viimeinen pelaaja voittaa.</p>
      <p>Verkkopelissä jokaisella siirrolla on aikaraja. Sen asettaa pelaaja, joka aloittaa pelin, ja pikapelissä se on 30 sekuntia. Kun aikasi loppuu, vuorosi ohitetaan. Jos ohitat 3 vuoroa peräkkäin, luovutat. Tietokonetta vastaan ja yhdellä puhelimella pelattavissa peleissä ei ole aikarajaa.</p>
    </section>

    <section aria-labelledby="tips">
      <h2 id="tips">Vinkit</h2>
      <ul class="tips">
        <li><strong>Rakenna tikapuita.</strong> Aseta nappulat riviin niin, että niiden välissä on yksi tyhjä paikka, kohti maaliasi. Yksi nappula voi silloin hypätä koko rivin pituudelta yhdessä siirrossa.
${plaatje({
  bestand: "ladder.svg",
  max: "15rem",
  alt: "Neljä nappulaa vinossa rivissä, joiden välissä on tyhjä paikka. Punainen nappula rivin päässä hyppää kaikkien neljän yli, ja neljä laskeutumispaikkaa on numeroitu.",
  tekst: "Neljä nappulaa rivissä: ylhäällä oleva punainen nappula ylittää laudan yhdessä siirrossa neljällä hypyllä.",
})}
        </li>
        <li><strong>Jokainen nappula on tikapuut.</strong> Voit hypätä minkä värisen tahansa nappulan yli, joten myös toisten pelaajien nappulat auttavat sinua. Ja omat tikapuusi auttavat heitä: katso, mitä jätät jälkeesi.</li>
        <li><strong>Älä unohda jälkeen jääneitä.</strong> Tarvitset kaikki 10 nappulaa perille. Kaukana jäljessä oleva nappula, jolla ei ole mitään, minkä yli hypätä, liikkuu yhden paikan vuorossa. Tuo se mukaan, kun muut nappulat ovat vielä sen ympärillä.</li>
        <li><strong>Sinun aloituksesi on heidän maalinsa.</strong> 2, 4 tai 6 pelaajalla aloituskärkesi on vastapäätä olevan pelaajan maali, eikä hän pääse maaliin, kun yksi nappuloistasi on vielä siellä. Sama pätee sinuun.</li>
      </ul>
      <p>Lisää vinkkejä kuvien kanssa on oppaassa <a href="/fi/oppaat/kiinansakki-strategia">kiinanšakin strategia</a>. Kahden pelaajan peliä varten lue <a href="/fi/oppaat/kiinansakki-kahdelle">kiinanšakki kahdelle pelaajalle</a>.</p>
    </section>

    <section aria-labelledby="vragen">
      <h2 id="vragen">Kysymyksiä</h2>
      <h3>Kuinka monta pelaajaa kiinanšakkia voi pelata?</h3>
      <p>Kaksi, kolme, neljä tai kuusi. Jokainen pelaaja aloittaa tähden yhdestä kärjestä. 2, 3 tai 4 pelaajalla jotkin kärjet jäävät tyhjiksi.</p>
      <h3>Kuinka monta marmoria jokaisella pelaajalla on?</h3>
      <p>Jokaisella pelaajalla on 10 marmoria eli nappulaa. Laudalla on 121 paikkaa: 10 jokaisessa kuudessa kärjessä ja 61 keskellä.</p>
      <h3>Voiko omien nappuloiden yli hypätä, tai taaksepäin?</h3>
      <p>Kyllä. Voit hypätä minkä värisen nappulan yli tahansa, myös oman, kaikkiin kuuteen suuntaan, myös taaksepäin. Nappula, jonka yli hyppäät, jää paikalleen.</p>
      <h3>Voiko kiinanšakissa syödä nappuloita?</h3>
      <p>Ei. Mitään ei syödä. Nappula poistuu laudalta vain, kun sen pelaaja luovuttaa.</p>
      <h3>Onko kiinanšakki kotoisin Kiinasta?</h3>
      <p>Ei. Peli ilmestyi Saksassa vuonna 1892 nimellä Stern-Halma, vanhemman Halma-pelin pohjalta. Nimi Chinese checkers tulee Yhdysvalloista, vuodelta 1928. Lue lisää: <a href="/fi/saannot/mika-on-sternhalma">Sternhalma</a>.</p>
      <h3>Missä kiinanšakkia voi pelata netissä ystävien kanssa ilmaiseksi?</h3>
      <p>Leapstonessa, selaimessa tai App Storesta ladattavassa sovelluksessa. Lähetä ystävälle kutsulinkki: hän liittyy peliisi ilman tiliä, sähköpostiosoitetta tai salasanaa. Voit myös pelata tietokonetta vastaan tai pelata nopean pelin toista pelaajaa vastaan. Leapstone on ilmainen, ilman mainoksia.</p>
    </section>

    <section aria-labelledby="leapstone">
      <h2 id="leapstone">Kiinanšakin pelaaminen Leapstonessa</h2>
      <p>Leapstone on ilmainen sovellus kiinanšakin ja Halman pelaamiseen punaisella ja kultaisella 3D-lakkalaudalla. Voit pelata sovelluksessa ja selaimessa.</p>
      <ul>
        <li><strong>Tietokonetta vastaan.</strong> Helppo, normaali tai vaikea. Et tarvitse internetiä.</li>
        <li><strong>Ystävien kanssa.</strong> Lähetä kutsulinkki. Sinä asetat ajan siirtoa kohden, ja voitte jutella chatissa.</li>
        <li><strong>Netissä.</strong> Nopea peli toista tasosi pelaajaa vastaan, 30 sekuntia siirtoa kohden. Jotkin verkkovastustajat voivat olla tietokonepelaajia.</li>
        <li><strong>Yhdellä puhelimella.</strong> Kierrätä puhelinta pöydän ympäri.</li>
      </ul>
      <p>Leapstone on ilmainen, ilman mainoksia ja ilman sähköpostiosoitteella kirjautumista: valitset vain pelaajanimen. <a href="https://apps.apple.com/fi/app/id6831230722">Lataa Leapstone App Storesta</a> tai <a href="/play/">pelaa selaimessa</a>.</p>
    </section>`;

export default {
  nav: "Kiinanšakin säännöt",
  titel: "Kiinanšakin säännöt ja vinkit | Leapstone",
  beschrijving: "Näin pelataan kiinanšakkia: aloitus, askeleet, hypyt ja hyppyketjut, voittaminen 2, 3, 4 tai 6 pelaajalla sekä vinkit. Pelaa ilmaiseksi selaimessa.",
  h1: "Kiinanšakin säännöt",
  intro: "Siirrä kaikki 10 nappulaasi tähtilaudan yli vastakkaiseen kärkeen ennen muita. Säännöt lyhyesti, kuvien kanssa, ja muutama vinkki.",
  inhoud,
};
