// Suomenkielinen opas Kiinanšakki kahdelle pelaajalle (taak 134): /fi/oppaat/kiinansakki-kahdelle.
// Sisältö: englanninkielinen opas ../en/chinese-checkers-2-players.mjs, lause lauseelta suomeksi. Säännöt tulevat crates/halma-core -koodista
// (Board::star, Game::new_star(2), make_move, resign), aikaraja kohdasta "Regels" ja taak 80, tietokoneen tasot tiedostosta
// crates/halma-core/src/computer.rs. Mitä sovellus näyttää, tulee tiedostoista web/src/Startmenu.svelte ja Landingspagina.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">Näin peli alkaa</h2>
      <p>Jokaisella pelaajalla on 10 nappulaa. Ne aloittavat tähden kahdessa kärjessä, jotka ovat vastakkain: punainen alhaalla, sininen ylhäällä. 20 nappulaa seisoo laudalla, jossa on 121 paikkaa.</p>
${plaatje({
  bestand: "setup-2.svg",
  max: "20rem",
  alt: "Tähtilauta, jonka alakärjessä on 10 punaista nappulaa ja yläkärjessä 10 sinistä nappulaa",
  tekst: "Punainen aloittaa alhaalta, sininen ylhäältä.",
})}
      <p>Pelaaja 1, punainen, siirtää ensin. Sen jälkeen siirrätte vuorotellen, yksi siirto kummallakin. Siirto on yksi askel tai hyppyketju yhdellä nappulalla. Askeleet ja hypyt löytyvät <a href="/fi/saannot/kiinansakki">kiinanšakin säännöistä</a>.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Maalisi on toisen pelaajan aloituskärki</h2>
      <p>Voitat, kun siirrät kaikki 10 nappulaasi kärkeen, jossa toinen pelaaja aloitti. Se kärki on aluksi täynnä hänen nappuloitaan, ja sinun kärkesi on täynnä omiasi. Punaiselle se on yllä olevan kuvan yläkärki.</p>
      <p>Voit laskeutua vain tyhjään paikkaan, joten kummankin täytyy lähteä omasta kärjestään, ennen kuin toinen voi täyttää sen. Kumpikaan ei pääse maaliin, kun toisen nappula on vielä maalissa. Ja koska ylitätte saman keskustan vastakkaisiin suuntiin, toisen pelaajan nappulat ovat sinulle askelkiviä ja sinun nappulasi hänelle. Lue <a href="/fi/oppaat/kiinansakki-strategia">strategiavinkit</a>, miten tämän kanssa kannattaa toimia.</p>
    </section>

    <section aria-labelledby="winst">
      <h2 id="winst">Voittaminen ja luovuttaminen</h2>
      <ul>
        <li><strong>Voitto:</strong> ensimmäinen pelaaja, joka täyttää maalin kaikilla 10 nappulalla, voittaa, ja peli päättyy heti. Toinen pelaaja ei jatka.</li>
        <li><strong>Luovuttaminen:</strong> nappulasi poistuvat laudalta ja toinen pelaaja voittaa.</li>
        <li><strong>Aika (verkossa):</strong> verkkopelissä jokaisella siirrolla on aikaraja. Kun aikasi loppuu, vuorosi ohitetaan. Jos ohitat 3 vuoroa peräkkäin, luovutat.</li>
      </ul>
    </section>

    <section aria-labelledby="verschil">
      <h2 id="verschil">Miten 3, 4 ja 6 pelaajaa eroavat</h2>
      <ul>
        <li><strong>3 pelaajaa:</strong> nappulat aloittavat joka toisessa kärjessä, ja kolme maalia ovat aluksi tyhjiä. Ensimmäinen valmistunut pelaaja voittaa; muut pelaavat edelleen seuraavista sijoista, ja valmis pelaaja ohitetaan.</li>
        <li><strong>4 pelaajaa:</strong> kaksi paria vierekkäisiä kärkiä. Maalisi on aluksi täynnä toisen pelaajan nappuloita. Peli jatkuu ensimmäisen valmistuneen jälkeen, kuten 3 pelaajalla.</li>
        <li><strong>6 pelaajaa:</strong> kaikki kuusi kärkeä. Laudalla on 60 nappulaa, kun 2 pelaajalla niitä on 20.</li>
      </ul>
      <p>Kun laudalla on vain 20 nappulaa, hypättäviä nappuloita on vähemmän, joten itse rakentamasi tikapuut ovat tärkeämmät. <a href="/fi/saannot/kiinansakki">Sääntösivulla</a> on kuvat jokaisesta aloituksesta.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Missä pelata kahdella pelaajalla Leapstonessa</h2>
      <ul>
        <li><strong>Tietokonetta vastaan heti:</strong> avaa <a href="/play/">Leapstone selaimessa</a>, napauta Tietokone ja valitse tähtilauta. Oletuksena on yksi tietokone, joten se on peli kahdelle. Valitset Helpon, Normaalin tai Vaikean, ja olet Pelaaja 1, joten siirrät ensin. Helppo valitsee parhaan kolmesta satunnaisesta siirrosta. Normaali valitsee siirron, joka etenee eniten kohti maalia. Vaikea katsoo myös, miten vastustajat voivat vastata, ja oman seuraavan siirtonsa.</li>
        <li><strong>Pelaa netissä, sovelluksessa:</strong> nopea peli tähtilaudalla 2 pelaajalle, toista tasosi pelaajaa vastaan, 30 sekuntia siirtoa kohden. Jotkin verkkovastustajat voivat olla tietokonepelaajia.</li>
        <li><strong>Ystävän kanssa:</strong> lähetä kutsulinkki ja aseta aika siirtoa kohden itse. Tai kierrätä yhtä puhelinta edestakaisin.</li>
      </ul>
      <p><a href="/fi/oppaat/kiinansakki-verkossa-kavereiden-kanssa">Kiinanšakki verkossa kavereiden kanssa</a></p>
      <p><a href="/fi/oppaat/kiinansakki-kolmelle">Kiinanšakki kolmelle pelaajalle</a></p>
    </section>`;

export default {
  nav: "Kiinanšakki kahdelle pelaajalle",
  titel: "Kiinanšakki kahdelle: aloitus ja säännöt | Leapstone",
  beschrijving: "Näin kiinanšakki toimii kahdella pelaajalla: mistä 10 nappulaa aloittavat, kuka siirtää ensin, miten voitat tai luovutat ja missä pelaat ilmaiseksi.",
  h1: "Kiinanšakki kahdelle pelaajalle",
  intro: "Näin kahden pelaajan peli toimii tähtilaudalla: aloitus, kuka siirtää ensin, miten voitat ja mistä voit pelata sitä.",
  inhoud,
};
