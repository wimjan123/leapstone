// De gids Halma tegenover Chinese checkers in het Fins, taak 300. Inhoud: ../en/halma-vs-chinese-checkers.mjs zin voor zin.
import { rasterPlaatje } from "../../plaatje.mjs";

const borden = [
  rasterPlaatje({
    bestand: "setup-2.svg",
    tekst: "Kiinanšakki: tähtilauta, 121 paikkaa",
    alt: "Tähtilauta, jonka alakärjessä on 10 punaista nappulaa ja yläkärjessä 10 sinistä nappulaa",
  }),
  rasterPlaatje({
    bestand: "halma-setup-2.svg",
    tekst: "Halma: neliölauta, 256 paikkaa",
    alt: "Neliölauta, jonka vasemmassa yläkulmassa on 19 punaista nappulaa ja oikeassa alakulmassa 19 sinistä nappulaa",
  }),
].join("\n        ");

const stappen = [
  rasterPlaatje({
    bestand: "step.svg",
    tekst: "Tähtilauta: kuusi naapuria, kolme niistä tyhjiä tässä",
    alt: "Punainen nappula, jonka ympärillä on valkoinen rengas. Kolme sen kuudesta naapurista on tyhjiä ja merkittyjä, kolmella muulla on nappulat.",
  }),
  rasterPlaatje({
    bestand: "halma-step.svg",
    tekst: "Neliölauta: kahdeksan naapuria, viisi niistä tyhjiä tässä",
    alt: "Punainen nappula, jonka ympärillä on valkoinen rengas. Viisi sen kahdeksasta naapurista on tyhjiä ja merkittyjä, kolmella muulla on nappulat.",
  }),
].join("\n        ");

const inhoud = `    <section aria-labelledby="kort">
      <h2 id="kort">Lyhyt vastaus</h2>
      <p>Halmaa pelataan neliönmuotoisella laudalla ja kiinanšakkia kuusikärkisen tähden muotoisella laudalla. Kummassakin pelissä siirrät nappulasi askelin ja hyppyin laudan yli, ja ensimmäinen pelaaja, joka täyttää vastakkaisen puolen leirin, voittaa.</p>
      <p>Eroa on laudassa, suunnissa, joihin siirrät, siinä kuinka monta pelaajaa voi pelata ja kuinka monta nappulaa kullakin on. <a href="/fi/saannot/mika-on-sternhalma">Sternhalma</a> on nimi Halmalle tähtilaudalla, joten se on sama peli kuin kiinanšakki.</p>
    </section>

    <section aria-labelledby="borden">
      <h2 id="borden">Laudat</h2>
      <div class="raster raster-twee">
        ${borden}
      </div>
      <ul>
        <li><strong>Kiinanšakissa</strong> käytetään tähtilautaa: 121 paikkaa, ja kuuden sakaran päässä on kussakin 10 paikan kärki. Kärki on kolmio, jossa on rivit 4, 3, 2 ja 1 paikkaa.</li>
        <li><strong>Halmassa</strong> käytetään neliölautaa: 16 × 16 paikkaa, yhteensä 256. Leiri on kulmassa. Suuressa leirissä on rivit 5, 5, 4, 3 ja 2 paikkaa, pienessä rivit 4, 4, 3 ja 2.</li>
      </ul>
    </section>

    <section aria-labelledby="richtingen">
      <h2 id="richtingen">Suunnat: kuusi tai kahdeksan</h2>
      <p>Tähtilaudalla paikalla on kuusi naapuria. Neliölaudalla niitä on kahdeksan, koska myös vinot suunnat lasketaan. Askel menee tyhjään naapuriin. Hyppy menee oman nappulasi vieressä olevan nappulan yli suorassa linjassa sen takana olevaan tyhjään paikkaan, mihin tahansa näistä suunnista ja myös taaksepäin.</p>
      <div class="raster raster-twee">
        ${stappen}
      </div>
      <p>Reunalla olevalla paikalla on vähemmän naapureita, ja neliölaudan kulmassa niitä on kolme. Kuusi suuntaa tekee tähtilaudalla kolme linjaa paikan kautta. Kahdeksan suuntaa tekee neliölaudalla neljä linjaa: poikittain, ylös ja alas sekä kaksi vinoa.</p>
    </section>

    <section aria-labelledby="spelers">
      <h2 id="spelers">Pelaajat ja nappulat</h2>
      <ul>
        <li><strong>Kiinanšakki:</strong> 2, 3, 4 tai 6 pelaajaa. Jokaisella on 10 nappulaa, joten laudalla on 20, 30, 40 tai 60 nappulaa.</li>
        <li><strong>Halma:</strong> 2 tai 4 pelaajaa. 2 pelaajalla jokaisella on 19 nappulaa, yhteensä 38. 4 pelaajalla jokaisella on 13 nappulaa, yhteensä 52.</li>
      </ul>
      <p>Neliölaudalla ei ole Leapstonessa peliä 3 tai 6 pelaajalle. Kolmen pelaajan peliä varten lue <a href="/fi/oppaat/kiinansakki-kolmelle">Kiinanšakki kolmelle pelaajalle</a>.</p>
    </section>

    <section aria-labelledby="gelijk">
      <h2 id="gelijk">Mikä on samaa</h2>
      <ul>
        <li><strong>Siirto:</strong> yksi askel tai hyppyketju yhdellä nappulalla. Päätät itse, mihin ketju päättyy, etkä voi ottaa askelta hypyn jälkeen.</li>
        <li><strong>Mikä tahansa väri:</strong> hyppäät minkä värisen nappulan yli tahansa, myös omasi. Nappula, jonka yli hyppäät, pysyy paikallaan. Mitään ei syödä.</li>
        <li><strong>Maali:</strong> leiri vastapäätä paikkaa, jossa aloitit. Kaikilla sen paikoilla täytyy olla omia nappuloitasi. Kun toisen pelaajan nappula on siellä, et voi päästä maaliin.</li>
        <li><strong>Voittaminen:</strong> ensimmäinen pelaaja, joka täyttää maalin, voittaa. 2 pelaajalla peli päättyy silloin. Useammalla pelaajalla muut pelaavat edelleen seuraavista sijoista, ja valmis pelaaja ohitetaan.</li>
        <li><strong>Luovuttaminen ja aika:</strong> kun luovutat, nappulasi poistuvat laudalta. Verkkopelissä jokaisella siirrolla on aikaraja, ja jos ohitat 3 vuoroa peräkkäin, luovutat.</li>
      </ul>
      <p>Lue täydelliset säännöt: <a href="/fi/saannot/kiinansakki">kiinanšakki</a> ja <a href="/fi/saannot/halma">Halma</a>.</p>
    </section>

    <section aria-labelledby="kiezen">
      <h2 id="kiezen">Kumman laudan valitset Leapstonessa</h2>
      <ul>
        <li><strong>3 tai 6 pelaajaa:</strong> vain tähtilaudalla on ne.</li>
        <li><strong>Enemmän nappuloita kullakin:</strong> neliölauta, jossa on 19 nappulaa kullakin 2 pelaajalle tai 13 nappulaa kullakin 4 pelaajalle, kun tähtilaudalla niitä on 10.</li>
        <li><strong>Pelaa netissä:</strong> nopea peli pelataan tähtilaudalla. Ystävien kanssa ja tietokonetta vastaan voit valita kumman tahansa laudan.</li>
      </ul>
      <p>Pelaa nyt avaa pelin tähtilaudalla tietokonetta vastaan. Neliölautaa varten napauta ylhäällä olevaa takaisin-nuolta ja valitse valikosta Neliölauta.</p>
    </section>

    <section aria-labelledby="verder">
      <h2 id="verder">Jatka tästä</h2>
      <ul>
        <li><a href="/play/">Pelaa selaimessa</a> ja kokeile molempia lautoja.</li>
        <li><a href="/fi/oppaat/kiinansakki-strategia">Kiinanšakin strategia</a>: kuusi vinkkiä kuvien kanssa.</li>
        <li><a href="/fi/oppaat/kiinansakki-kahdelle">Kiinanšakki kahdelle</a>: miten kahden pelaajan peli toimii.</li>
      </ul>
      <p><a href="/fi/oppaat/kiinansakki-verkossa-kavereiden-kanssa">Kiinanšakki verkossa kavereiden kanssa</a></p>
    </section>`;

export default {
  nav: "Halma vai kiinanšakki",
  titel: "Halma vai kiinanšakki: erot | Leapstone",
  beschrijving: "Halma vai kiinanšakki? Neliölauta ja tähtilauta, kuusi tai kahdeksan suuntaa, pelaajat ja nappulat sekä se, mikä on samaa.",
  h1: "Halma vai kiinanšakki",
  intro: "Kaksi peliä, yksi ajatus: vie kaikki nappulasi laudan yli toiselle puolelle. Mikä eroaa, mikä on samaa ja missä voit pelata molempia.",
  inhoud,
};
