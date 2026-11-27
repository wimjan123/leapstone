// Suomenkielinen opas Kiinanšakki kuudelle pelaajalle (taak 302). Teksti seuraa tiedostoa ../en/chinese-checkers-6-players.mjs lause lauseelta.
// Säännöt tulevat paketista crates/halma-core (Board::star ja start_points(6), Game::new_star(6), make_move, skip_turn, resign, ranking) ja aikaraja kohdasta "Techniek".
// Tarkistus väitteittäin on tiedostossa docs/plan.md, taak 302.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">Näin peli alkaa</h2>
      <p>Jokaisella pelaajalla on 10 nappulaa, ja kaikki 6 tähden kärkeä ovat käytössä. Siitä tulee 60 nappulaa laudalle, jossa on 121 paikkaa. Keskellä olevat 61 paikkaa ovat alussa tyhjiä.</p>
${plaatje({
  bestand: "setup-6.svg",
  max: "20rem",
  alt: "Tähtilauta, jossa on 10 nappulaa jokaisessa 6 kärjessä, 6 värillä",
  tekst: "6 pelaajaa, 6 kärkeä, 60 nappulaa.",
})}
      <p>Pelaaja 1, punainen, siirtää ensin alakärjestä. Sen jälkeen vuoro kulkee Pelaajalta 1 Pelaajalle 6, ja Pelaajan 6 jälkeen vuoro on taas Pelaajalla 1. Pelaajat on numeroitu kärkiensä järjestyksessä tähden ympäri, joten sinua seuraava pelaaja aloittaa aina kärjessä, joka on oman kärkesi vieressä. Siirto on yksi askel tai hyppyketju yhdellä nappulalla. Askeleet ja hypyt löytyvät <a href="/fi/saannot/kiinansakki">kiinanšakin säännöistä</a>.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Jokainen maali on aluksi täynnä</h2>
      <p>Voitat, kun siirrät kaikki 10 nappulaasi laudan toisella puolella olevaan kärkeen. 6 pelaajalla se on kärki, josta sinua vastapäätä oleva pelaaja aloittaa, joten mikään maali ei ole tyhjä: jokainen maali on aluksi täynnä jonkun toisen pelaajan nappuloita. Punaiselle maali on yläkärki, josta Pelaaja 4 aloittaa.</p>
${plaatje({
  bestand: "setup-6-goal.svg",
  max: "20rem",
  alt: "Tähtilauta, jossa on 6 täyttä kärkeä. Katkoviivarengas merkitsee yläkärjen, punaisen pelaajan maalin, jossa ovat vastapäisen pelaajan nappulat.",
  tekst: "Punaisen maali on vastakkainen kärki, täynnä Pelaajan 4 nappuloita.",
})}
      <p>Voit laskeutua vain tyhjään paikkaan, joten vastapäinen pelaaja joutuu lähtemään kärjestään, ennen kuin voit täyttää sen, ja sinun täytyy lähteä omastasi, ennen kuin hän voi täyttää omansa. 2 pelaajan pelissä siinä on kaikki. 6 pelaajalla kummankin täytyy lisäksi päästä läpi muiden 4 tungoksesta.</p>
    </section>

    <section aria-labelledby="midden">
      <h2 id="midden">Ahdas keskusta</h2>
      <p>Jokainen maali on laudan toisella puolella, ja kärjet yhdistyvät toisiinsa vain keskustan kautta, joten kaikkien 60 nappulan täytyy ylittää samat 61 paikkaa. Alussa kukaan ei ole vielä ylittänyt keskustaa, ja se täyttyy nopeasti.</p>
${plaatje({
  bestand: "six-jump.svg",
  max: "20rem",
  alt: "Punainen nappula hyppää kolme kertaa yhdellä siirrolla: sinisen nappulan yli, sitten vihreän nappulan ja sitten violetin nappulan yli. Numerot 1, 2 ja 3 merkitsevät laskeutumispaikat.",
  tekst: "Kaikkien värien nappulat ovat askelkiviä.",
})}
      <p>Voit hypätä minkä värisen nappulan yli tahansa. 5 muun pelaajan nappulat ovat sinulle askelkiviä, ja sinun nappulasi ovat askelkiviä kaikille 5:lle. Keskelle jättämäsi nappularivi on tikapuut jokaiselle, joka pääsee niille, ja sinua seuraava pelaaja pääsee ensin.</p>
    </section>

    <section aria-labelledby="blokkeren">
      <h2 id="blokkeren">Estäminen 5 vastustajaa vastaan</h2>
      <ul>
        <li><strong>Täytä laskeutumispaikka:</strong> hyppy vaatii tyhjän paikan heti nappulan takana. Kun siirrät nappulan sinne, hyppy poistuu jokaiselta pelaajalta, joka halusi sen.</li>
        <li><strong>Varo rakentamiasi tikapuita:</strong> siirtosi jälkeen muut 5 pelaajaa siirtävät, ennen kuin sinun vuorosi tulee uudestaan. Tikapuut auttavat kaikkia heitä.</li>
        <li><strong>Kuka tahansa voi estää maalin:</strong> minkä tahansa toisen pelaajan nappula maalissasi estää sinua pääsemästä valmiiksi, ei vain vastapäisen pelaajan nappula. Maalin kaikilla 10 paikalla täytyy olla omia nappuloitasi.</li>
      </ul>
      <p><a href="/fi/oppaat/kiinansakki-strategia">Strategiavinkit</a> näyttävät, miltä estetty hyppy näyttää ja miten vältät lukitsemasta toisen pelaajan nappulaa omaan maaliisi.</p>
    </section>

    <section aria-labelledby="duur">
      <h2 id="duur">Kuinka kauan peli kestää</h2>
      <p>6 pelaajan pelissä siirrettäviä nappuloita on 60, ja yhden siirtosi ja seuraavan välillä muut 5 pelaajaa siirtävät kukin kerran. Peli ei myöskään pääty, kun ensimmäinen pelaaja valmistuu.</p>
      <ul>
        <li><strong>Voita ja pelaa eteenpäin:</strong> ensimmäinen pelaaja, joka täyttää maalin, voittaa, ja muut jatkavat seuraavista sijoista. Valmis pelaaja ohitetaan, ja hänen nappulansa jäävät laudalle askelkiviksi. Peli päättyy, kun vain yksi pelaaja pelaa vielä.</li>
        <li><strong>Luovuttaminen:</strong> nappulasi poistuvat laudalta, joten ne eivät enää estä eivätkä auta ketään, ja muut jatkavat.</li>
        <li><strong>Aika (verkossa):</strong> verkkopelissä jokaisella siirrolla on aikaraja, jonka pelin aloittava pelaaja asettaa: 15 sekuntia, 30 sekuntia, 1 minuutti, 2 minuuttia tai ei rajaa. 6 siirron kierros kestää enintään 6 kertaa rajan verran, joten 30 sekunnilla se on enintään 3 minuuttia. Kun aikasi loppuu, vuorosi ohitetaan. Jos ohitat 3 vuoroa peräkkäin, luovutat, ja peli jatkuu ilman sinua.</li>
      </ul>
      <p>Jos haluat pelin, jossa on vähemmän pelaajia, lue <a href="/fi/oppaat/kiinansakki-kahdelle">Kiinanšakki kahdelle pelaajalle</a>.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Missä pelata 6 pelaajalla Leapstonessa</h2>
      <ul>
        <li><strong>Tietokonetta vastaan heti:</strong> avaa <a href="/play/">Leapstone selaimessa</a>, napauta Tietokone, valitse tähtilauta ja 5 tietokonetta. Olet Pelaaja 1, joten siirrät ensin. Tietokoneet siirtävät yksi kerrallaan, kukin lyhyen tauon jälkeen, joten voit seurata jokaista siirtoa. Valitset tietokoneille Helpon, Normaalin tai Vaikean tason.</li>
        <li><strong>Yhdellä puhelimella:</strong> napauta Pelaa, valitse tähtilauta ja 6 pelaajaa ja napauta sitten nappulaa vaihtaaksesi paikan ihmisen ja tietokoneen välillä.</li>
        <li><strong>Netissä ystävien kanssa:</strong> napauta Ystävät, valitse tähtilauta, 6 pelaajaa ja aika siirtoa kohden ja lähetä kutsulinkki. Peli alkaa, kun kaikki 6 paikkaa on otettu.</li>
        <li><strong>Pikapelit:</strong> Pelaa netissä löytää pelejä 2 tai 4 pelaajalle, joten 6 pelaajalle ei ole pikapeliä.</li>
      </ul>
    </section>`;

export default {
  nav: "Kiinanšakki kuudelle pelaajalle",
  titel: "Kiinanšakki kuudelle: koko lauta | Leapstone",
  beschrijving: "Näin kiinanšakki toimii 6 pelaajalla: täysi tähti 60 nappulalla, ahdas keskusta, estäminen, kuinka kauan peli kestää ja missä sitä pelataan.",
  h1: "Kiinanšakki kuudelle pelaajalle",
  intro: "Näin 6 pelaajan peli toimii: kaikki 6 kärkeä ovat täynnä, kilpailet vastapäisestä kärjestä, ja peli jatkuu, kun ensimmäinen pelaaja on valmis.",
  inhoud,
};
