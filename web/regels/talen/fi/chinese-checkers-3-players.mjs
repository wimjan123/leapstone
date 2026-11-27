// Suomenkielinen opas Kiinanšakki kolmelle pelaajalle (taak 299): /fi/oppaat/kiinansakki-kolmelle.
// Sisältö: englanninkielinen opas ../en/chinese-checkers-3-players.mjs, lause lauseelta suomeksi. Säännöt on tarkistettu crates/halma-core -koodia vastaan (ks. englanninkielinen tiedosto).
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">Näin peli alkaa</h2>
      <p>Jokaisella pelaajalla on 10 nappulaa, joten laudalla, jossa on 121 paikkaa, seisoo 30 nappulaa. Ne aloittavat tähden joka toisessa kärjessä: punainen alhaalla, sininen ylhäällä vasemmalla ja vihreä ylhäällä oikealla. Niiden väliset kolme kärkeä ovat tyhjiä.</p>
${plaatje({
  bestand: "setup-3.svg",
  max: "20rem",
  alt: "Tähtilauta, jonka alakärjessä on 10 punaista nappulaa, ylävasemmalla kärjessä 10 sinistä nappulaa ja yläoikealla kärjessä 10 vihreää nappulaa",
  tekst: "Punainen alhaalla, sininen ylhäällä vasemmalla, vihreä ylhäällä oikealla.",
})}
      <p>Pelaaja 1, punainen, siirtää ensin. Sen jälkeen sininen on Pelaaja 2, vihreä on Pelaaja 3, ja vihreän jälkeen vuorossa on taas punainen. Siirto on yksi askel tai hyppyketju yhdellä nappulalla. Askeleet ja hypyt löytyvät <a href="/fi/saannot/kiinansakki">kiinanšakin säännöistä</a>.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Kolme maalia, kaikki aluksi tyhjiä</h2>
      <p>Maalisi on kärki aloituskärkesi vastapäätä, ja 3 pelaajalla se on aluksi tyhjä. Se on tyhjä kärki kahden muun pelaajan aloituskärkien välissä: punaisen maali on ylhäällä, sinisen alhaalla oikealla ja vihreän alhaalla vasemmalla.</p>
${plaatje({
  bestand: "setup-3-goals.svg",
  max: "20rem",
  alt: "Tähtilauta kolmelle pelaajalle. Katkoviivalliset ympyrät kunkin pelaajan värillä merkitsevät kolme tyhjää maalia: punainen ylhäällä, sininen alhaalla oikealla, vihreä alhaalla vasemmalla.",
  tekst: "Jokaisella maalilla on pelaajansa väri.",
})}
      <p>Voitat, kun siirrät kaikki 10 nappulaasi maaliisi. Kaikissa 10 paikassa täytyy olla omia nappuloitasi. Kukaan ei aloita maalissasi, mutta voit pysähtyä mihin tahansa tyhjään paikkaan, joten toisen pelaajan nappula voi laskeutua sinne myöhemmin. Niin kauan kuin se on siellä, et voi päästä maaliin.</p>
    </section>

    <section aria-labelledby="winst">
      <h2 id="winst">Voittaminen ja mitä sen jälkeen tapahtuu</h2>
      <ul>
        <li><strong>Voitto:</strong> ensimmäinen pelaaja, joka täyttää maalin, voittaa. Peli ei pääty siihen: kaksi muuta pelaavat edelleen seuraavista sijoista, ja valmis pelaaja ohitetaan. Peli päättyy, kun vain yksi pelaaja pelaa vielä.</li>
        <li><strong>Luovuttaminen:</strong> nappulasi poistuvat laudalta ja kaksi muuta jatkavat. Jos toinen pelaaja luovuttaa ennen kuin kukaan on valmis, viimeinen jäljelle jäänyt pelaaja voittaa.</li>
        <li><strong>Aika (verkossa):</strong> verkkopelissä jokaisella siirrolla on aikaraja, jonka asettaa pelin aloittanut pelaaja. Kun aikasi loppuu, vuorosi ohitetaan. Jos ohitat 3 vuoroa peräkkäin, luovutat, ja peli jatkuu ilman sinua.</li>
      </ul>
    </section>

    <section aria-labelledby="verschil">
      <h2 id="verschil">Miten se eroaa kahden pelaajan pelistä</h2>
      <ul>
        <li><strong>Enemmän nappuloita:</strong> 30 laudalla, kun 2 pelaajalla niitä on 20.</li>
        <li><strong>Tyhjät maalit:</strong> 2 pelaajalla maalisi on aluksi täynnä toisen pelaajan nappuloita. 3 pelaajalla se on aluksi tyhjä.</li>
        <li><strong>Kaksi vastustajaa:</strong> siirtosi jälkeen kaksi muuta pelaajaa siirtää, ennen kuin olet taas vuorossa. Molempien nappulat ovat sinulle askelkiviä ja sinun nappulasi heille. Rakentamasi tikapuut voivat käyttää molemmat, ja sinun jälkeesi vuorossa oleva pelaaja pääsee ensimmäisenä hyppäämään.</li>
        <li><strong>Peli jatkuu:</strong> 2 pelaajalla peli päättyy, kun toinen teistä on valmis. 3 pelaajalla se jatkuu toisesta ja kolmannesta sijasta.</li>
      </ul>
      <p>Kahden pelaajan peliä varten lue <a href="/fi/oppaat/kiinansakki-kahdelle">Kiinanšakki kahdelle pelaajalle</a>. <a href="/fi/oppaat/kiinansakki-strategia">Strategiavinkit</a> koskevat askeleita ja hyppyjä, jotka ovat samat 3 pelaajalla.</p>
      <p><a href="/fi/oppaat/kiinansakki-verkossa-kavereiden-kanssa">Kiinanšakki verkossa kavereiden kanssa</a></p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Missä pelata kolmella pelaajalla Leapstonessa</h2>
      <ul>
        <li><strong>Tietokonetta vastaan heti:</strong> avaa <a href="/play/">Leapstone selaimessa</a>, napauta Tietokone, valitse tähtilauta ja 2 tietokonetta. Olet Pelaaja 1, joten siirrät ensin. Valitset tietokoneille Helpon, Normaalin tai Vaikean.</li>
        <li><strong>Yhdellä puhelimella:</strong> napauta ”Tällä puhelimella”, valitse tähtilauta ja 3 pelaajaa, ja napauta sitten nappulaa vaihtaaksesi sen paikan ihmisen ja tietokoneen välillä.</li>
        <li><strong>Verkossa ystävien kanssa:</strong> napauta Ystävät, valitse tähtilauta, 3 pelaajaa ja aika siirtoa kohden, ja lähetä kutsulinkki. Peli alkaa, kun kaikki 3 paikkaa on täytetty.</li>
        <li><strong>Nopeat pelit:</strong> Pelaa netissä löytää pelejä 2 tai 4 pelaajalle, joten 3 pelaajan nopeaa peliä ei ole.</li>
      </ul>
    </section>`;

export default {
  nav: "Kiinanšakki kolmelle pelaajalle",
  titel: "Kiinanšakki kolmelle: aloitus ja säännöt | Leapstone",
  beschrijving: "Näin kiinanšakki toimii kolmella pelaajalla: mistä 30 nappulaa aloittavat, mikä tyhjä kärki on kunkin maali, kuka siirtää ensin ja miten voitat.",
  h1: "Kiinanšakki kolmelle pelaajalle",
  intro: "Näin kolmen pelaajan peli toimii tähtilaudalla: aloitus, kolme maalia, kuka siirtää ensin, miten voitat ja mistä voit pelata sitä.",
  inhoud,
};
