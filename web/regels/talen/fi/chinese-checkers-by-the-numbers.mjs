// Leapstone numeroina, Fins (taak 321). Volgt ../en/chinese-checkers-by-the-numbers.mjs zin voor zin; elk getal via f() uit cijfers.json.
import { c, f } from "../../cijfers.mjs";
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="vakken">
      <h2 id="vakken">Paikat ja nappulat</h2>
      <p>Laskettu Leapstonen kahdelta laudalta pelin alkuasemassa.</p>
${plaatje({
  bestand: "setup-6.svg",
  max: "20rem",
  direct: true,
  alt: "Tähtilauta, jonka kaikki kuusi kärkeä ovat täynnä: kymmenen nappulaa kutakin kuutta väriä tyhjän keskustan ympärillä.",
  tekst: "Tähtilauta kuuden pelaajan pelin alussa.",
})}
      <ul class="tips">
        <li><strong>Tähtilaudalla on ${f("sterbord_vakken")} paikkaa.</strong> Jokainen pelaaja aloittaa ${f("sterbord_stenen_per_speler")} nappulalla. Kahden pelaajan pelissä laudalla on siis ${f("sterbord_stenen_2_spelers")} nappulaa, kolmen pelaajan pelissä ${f("sterbord_stenen_3_spelers")}, neljän ${f("sterbord_stenen_4_spelers")} ja kuuden ${f("sterbord_stenen_6_spelers")}.</li>
        <li><strong>Neliön muotoisella Halma-laudalla on ${f("vierkant_vakken")} paikkaa.</strong> Kahden pelaajan pelissä jokainen pelaaja aloittaa ${f("vierkant_stenen_per_speler_2_spelers")} nappulalla, yhteensä ${f("vierkant_stenen_2_spelers")}. Neljän pelaajan pelissä kukin aloittaa ${f("vierkant_stenen_per_speler_4_spelers")} nappulalla, yhteensä ${f("vierkant_stenen_4_spelers")}.</li>
      </ul>
    </section>

    <section aria-labelledby="keten">
      <h2 id="keten">Pisin hyppyketju: ${f("langste_sprongketen")}</h2>
      <p>Tähtilaudalla yksi nappula voi tehdä <strong>${f("langste_sprongketen")} hyppyä yhdellä siirrolla</strong>, eikä Leapstonen säännöillä yhdessäkään siirrossa voi olla enempää. Tähän lukuun pääsemiseksi muut nappulat on asetettu vapaasti: yksi jokaiseen paikkaan, jonka yli nappula hyppää.</p>
${plaatje({
  bestand: "numbers-longest-chain.svg",
  max: "22rem",
  alt: "Tähtilauta, jossa on yksi punainen nappula ja monta sinistä nappulaa. Valkoiset nuolet näyttävät, kuinka punainen nappula hyppää sinisen nappulan yli toisensa perään pitkää mutkittelevaa reittiä.",
  tekst: "Pisin ketju: punainen nappula hyppää jokaisen sinisen nappulan yli, yhden kerrallaan.",
})}
      <p><strong>Miten se on laskettu.</strong> Hyppy laskeutuu aina kahden paikan päähän suoraan linjaan. Siksi nappula, joka jatkaa hyppimistä, pääsee vain osaan paikoista: lauta jakautuu neljään tällaiseen ryhmään, ja suurimmassa on ${f("grootste_klasse_vakken")} paikkaa. Leapstonessa nappula ei saa yhden siirron aikana laskeutua kahdesti samaan paikkaan eikä paikkaan, josta se lähti. Ketju laskeutuu siis enintään kerran ryhmänsä jokaiseen muuhun paikkaan. Ohjelma kävi tämän ryhmän läpi ja löysi reitin, joka kulkee kaikkien ${f("grootste_klasse_vakken")} paikan kautta, joten mikään ketju ei voi olla pidempi: ${f("langste_sprongketen")} hyppyä. Sen jälkeen testi pelaa tämän siirron Leapstonen säännöillä.</p>
      <p><strong>Ei oikea peli.</strong> Tämä ketju tarvitsee ${f("langste_sprongketen")} muuta nappulaa, jokaisen täsmälleen oikeassa paikassa. Kahden tai kolmen pelaajan pelissä on vain ${f("sterbord_stenen_2_spelers")} tai ${f("sterbord_stenen_3_spelers")} nappulaa, mikä on liian vähän. Neljän tai kuuden pelaajan pelissä niitä on ${f("sterbord_stenen_4_spelers")} tai ${f("sterbord_stenen_6_spelers")}, mikä riittää. Oikeassa pelissä kukaan ei kuitenkaan aseta nappuloita vapaasti, joten älä odota tätä ketjua pelipöydässä. Se näyttää, mitä lauta sallii, ei sitä, mitä pelissä tapahtuu.</p>
    </section>

    <section aria-labelledby="oversteek">
      <h2 id="oversteek">Lyhin ylitys: ${f("oversteek_zetten")} siirtoa</h2>
      <p>Yksi pelaaja yksin tähtilaudalla, ilman vastustajia, tarvitsee <strong>${f("oversteek_zetten")} siirtoa</strong> viedäkseen kaikki ${f("sterbord_stenen_per_speler")} nappulaa yhdestä kärjestä vastakkaiseen kärkeen, eikä onnistu vähemmällä. Kokonainen hyppyketju lasketaan yhdeksi siirroksi.</p>
${plaatje({
  bestand: "numbers-alone.svg",
  max: "20rem",
  alt: "Tähtilauta, jolla on vain kymmenen punaista nappulaa alakärjessä. Yläkärjellä, jonne niiden pitää päästä, on katkoviivareuna.",
  tekst: "Yksi pelaaja yksin: kymmenen nappulaa alakärjessä, ja yläkärki on maali.",
})}
      <p><strong>Miten se on laskettu.</strong> Testi pelaa ${f("oversteek_zetten")} siirron ylityksen Leapstonen säännöillä ilman muita nappuloita laudalla. Sen osoittamiseksi, että ${f("geen_oversteek_in_zetten")} siirtoa tai vähemmän ei riitä, haku noudattaa G. I. Bellin menetelmää (<em>Integers</em> 9, 2009). Jokaisen siirron voi pelata takaperin, ja laudan kääntäminen puoli kierrosta vaihtaa alun ja maalin keskenään. Jos siis olisi olemassa ${f("geen_oversteek_in_zetten")} siirron tai lyhyempi ylitys, jokin asema puolivälissä olisi enintään ${f("zoekdiepte_zetten")} siirron päässä alusta, ja samoin sama asema puoli kierrosta käännettynä. Haku kävi läpi jokaisen aseman, joka on enintään ${f("zoekdiepte_zetten")} siirron päässä alusta, laski aseman ja sen peilikuvan kerran, jätti pois asemat, jotka eivät todistetusti ehdi tarpeeksi pitkälle ajoissa, eikä löytänyt yhtään tällaista paria. Se kesti ${f("gemeten_rekentijd_seconden")} sekuntia ${f("gemeten_kernen")} ytimen koneella, ja sen suurin vaihe piti ${f("gemeten_grootste_laag_miljoen_standen")} miljoonaa asemaa ${f("gemeten_geheugen_gb")} gigatavun muistissa. Luku laskettiin uudelleen Leapstonen omalle laudalle.</p>
      <p><strong>Ei alaraja oikealle pelille.</strong> Oikeassa pelissä laudalla ovat myös muiden pelaajien nappulat, ja omat nappulasi voivat hypätä niiden yli. ${f("oversteek_zetten")} ei siis ole pienin määrä, jonka oikea peli voi kestää: se on todistettu vain yhdelle pelaajalle yksin.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Kokeile itse</h2>
      <p><a href="/play/">Pelaa Leapstonea selaimessa</a> tietokonetta vastaan, tai hae sovellus tämän sivun yläosan painikkeista. Säännöt löydät sivuilta <a href="/fi/saannot/kiinansakki">Kiinanšakin säännöt</a> ja <a href="/fi/saannot/halma">Halman säännöt</a>. Miten hyppyketjuja käytetään pelissä, kerrotaan <a href="/fi/oppaat/kiinansakki-strategia">strategiavinkeissä</a>.</p>
    </section>`;

export default {
  nav: "Kiinanšakki numeroina",
  titel: "Kiinanšakki numeroina | Leapstone",
  beschrijving: `Tähtilaudalla on ${c.sterbord_vakken} paikkaa. Yhdessä siirrossa on enintään ${c.langste_sprongketen} hyppyä, ja yksin pelaava tarvitsee ${c.oversteek_zetten} siirtoa ylitykseen. Näin jokainen luku lasketaan.`,
  h1: "Kiinanšakki numeroina",
  intro: `Kiinanšakin tähtilaudalla on ${f("sterbord_vakken")} paikkaa, ja jokainen pelaaja aloittaa ${f("sterbord_stenen_per_speler")} nappulalla. Leapstonessa yhdessä siirrossa ei voi koskaan olla enempää kuin ${f("langste_sprongketen")} hyppyä. Yksi pelaaja yksin laudalla, ilman vastustajia, tarvitsee ${f("oversteek_zetten")} siirtoa sen ylittämiseen. Alla näet, miten jokainen luku on laskettu ja mitä se kertoo ja ei kerro oikeasta pelistä.`,
  inhoud,
};
