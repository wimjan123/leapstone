// Suomenkielinen opas Kiinanšakki 4 pelaajalle (taak 301): /fi/oppaat/kiinansakki-neljalle.
// Sisältö: englanninkielinen opas ../en/chinese-checkers-4-players.mjs, lause lauseelta suomeksi.
// Sovelluksen painikkeiden tekstit tulevat tiedostosta web/src/talen/fi.ts.
import { plaatje } from "../../plaatje.mjs";

const inhoud = `    <section aria-labelledby="opstelling">
      <h2 id="opstelling">Näin lauta jaetaan</h2>
      <p>Jokaisella pelaajalla on 10 nappulaa, joten laudalla, jossa on 121 paikkaa, seisoo 40 nappulaa. Neljä aloituskärkeä ovat kaksi paria vierekkäisiä kärkiä: punainen alhaalla ja sininen vasemmalla alhaalla, vihreä ylhäällä ja keltainen oikealla ylhäällä.</p>
${plaatje({
  bestand: "setup-4.svg",
  max: "20rem",
  alt: "Tähtilauta, jonka alakärjessä on 10 punaista nappulaa, vasemmassa alakärjessä 10 sinistä nappulaa, yläkärjessä 10 vihreää nappulaa ja oikeassa yläkärjessä 10 keltaista nappulaa. Vasen yläkärki ja oikea alakärki ovat tyhjiä.",
  tekst: "Punainen alhaalla, sininen vasemmalla alhaalla, vihreä ylhäällä, keltainen oikealla ylhäällä.",
})}
      <p>Pelaaja 1, punainen, siirtää ensin. Sen jälkeen sininen on Pelaaja 2, vihreä on Pelaaja 3, keltainen on Pelaaja 4, ja keltaisen jälkeen vuorossa on taas punainen. Siirto on yksi askel tai hyppyketju yhdellä nappulalla. Askeleet ja hypyt löytyvät <a href="/fi/saannot/kiinansakki">kiinanšakin säännöistä</a>.</p>
    </section>

    <section aria-labelledby="doel">
      <h2 id="doel">Kuka on kenenkin vastapuolella</h2>
      <p>Kärjet muodostavat pareja laudan poikki: punainen on vihreän vastapuolella ja sininen keltaisen vastapuolella. Maalisi on kärki vastapäätä sinua. Punainen menee sinne, missä vihreä aloittaa, vihreä sinne, missä punainen aloittaa, sininen sinne, missä keltainen aloittaa, ja keltainen sinne, missä sininen aloittaa.</p>
      <p>Kuten 2 pelaajan pelissä, jokainen maali on aluksi täynnä vastapäätäsi olevan pelaajan nappuloita, joten voit laskeutua sinne vasta, kun ne ovat lähteneet. 3 pelaajalla maalit ovat aluksi tyhjiä, joten 4 pelaajalla kukaan ei pääse maaliin heti. Neljä maalia ovat neljä eri kärkeä, joten kukaan muu ei halua sinun maaliasi: valmis pelaaja ei estä ketään.</p>
    </section>

    <section aria-labelledby="leeg">
      <h2 id="leeg">Kaksi tyhjää kärkeä</h2>
      <p>Vasemmassa yläkärjessä ja oikeassa alakärjessä ei ole nappuloita. Ne eivät ole kenenkään aloitus eivätkä kenenkään maali. Vasen yläkärki on sinisen ja vihreän välissä ja oikea alakärki keltaisen ja punaisen välissä.</p>
      <p>Voit astua tai hypätä mille tahansa tyhjälle paikalle, joten voit ylittää nämä kärjet tai pysähtyä niihin. Siellä oleva nappula ei kuitenkaan ole vielä maalissa. Tyhjässä kärjessä ei ole mitään hypättävää, ennen kuin joku tuo sinne nappuloita.</p>
    </section>

    <section aria-labelledby="tactiek">
      <h2 id="tactiek">Mikä muuttuu taktiikassasi</h2>
      <ul>
        <li><strong>Kaksi ylitystä yhtä aikaa:</strong> punainen ja vihreä ylittävät laudan toisiaan kohti, ja niin tekevät myös sininen ja keltainen. Molemmat linjat kulkevat keskustan kautta, joten keskusta on vilkkaampi kuin 2 pelaajan pelissä, jossa ylittää vain yksi linja.</li>
        <li><strong>Kolme pelaajaa siirtää vuorojesi välillä:</strong> lauta muuttuu kahden siirtosi välillä enemmän kuin 2 pelaajan pelissä. Katso sitä uudestaan jokaisen vuoron alussa ja suunnittele hyppyketjusi silloin. Sinun jälkeesi siirtävä pelaaja ei ole koskaan se, joka on vastapäätäsi.</li>
        <li><strong>Nappulat auttavat kaikkia:</strong> jokainen kolmen muun nappula on sinulle askelkivi, ja sinun nappulasi ovat askelkiviä heille. Vastapäätäsi olevan pelaajan nappulat liikkuvat vastakkaiseen suuntaan, kuten 2 pelaajan pelissä.</li>
        <li><strong>Tilaa kiertää:</strong> jos keskusta on täynnä, tyhjät kärjet ovat avointa tilaa leirien vieressä. Reitti jonkin niistä kautta voi olla tapa kiertää ruuhka.</li>
        <li><strong>Luovuttanut pelaaja vapauttaa maalisi:</strong> kun vastapäätäsi oleva pelaaja luovuttaa, hänen nappulansa poistuvat laudalta, joten maalisi on heti tyhjä.</li>
      </ul>
      <p><a href="/fi/oppaat/kiinansakki-strategia">Strategiavinkit</a> tikapuista, jälkeen jääneistä nappuloista ja maalin täyttämisestä takaa päin pätevät samoin 4 pelaajalla.</p>
    </section>

    <section aria-labelledby="winst">
      <h2 id="winst">Voittaminen ja mitä sen jälkeen tapahtuu</h2>
      <ul>
        <li><strong>Voitto:</strong> ensimmäinen pelaaja, joka täyttää maalin kaikilla 10 nappulalla, voittaa. Peli ei pääty siihen: muut kolme pelaavat edelleen seuraavista sijoista, ja valmis pelaaja ohitetaan. Hänen nappulansa jäävät laudalle. Peli päättyy, kun vain yksi pelaaja pelaa vielä.</li>
        <li><strong>Luovuttaminen:</strong> nappulasi poistuvat laudalta ja muut kolme jatkavat. Jos muutkin luovuttavat, viimeinen jäljellä oleva pelaaja voittaa.</li>
        <li><strong>Aika (verkossa):</strong> verkkopelissä jokaisella siirrolla on aikaraja. Kun aikasi loppuu, vuorosi ohitetaan. Jos ohitat 3 vuoroa peräkkäin, luovutat, ja peli jatkuu ilman sinua.</li>
      </ul>
      <p>Pienemmän pelaajamäärän peleistä voit lukea oppaan <a href="/fi/oppaat/kiinansakki-kahdelle">Kiinanšakki kahdelle pelaajalle</a>. <a href="/fi/saannot/kiinansakki">Sääntösivulla</a> on kuvat jokaisesta aloituksesta.</p>
    </section>

    <section aria-labelledby="spelen">
      <h2 id="spelen">Missä pelata 4 pelaajalla Leapstonessa</h2>
      <ul>
        <li><strong>Tietokonetta vastaan heti:</strong> avaa <a href="/play/">Leapstone selaimessa</a>, napauta Tietokone, valitse tähtilauta ja 3 tietokonetta. Olet Pelaaja 1, joten siirrät ensin. Tietokoneille valitset Helpon, Normaalin tai Vaikean.</li>
        <li><strong>Yhdellä puhelimella:</strong> napauta Pelaa, valitse tähtilauta ja 4 pelaajaa ja napauta sitten nappulaa vaihtaaksesi paikan ihmisen ja tietokoneen välillä.</li>
        <li><strong>Verkossa ystävien kanssa:</strong> napauta Ystävät, valitse tähtilauta, 4 pelaajaa ja aika siirtoa kohden ja lähetä kutsulinkki. Peli alkaa, kun kaikki 4 paikkaa on täytetty.</li>
        <li><strong>Nopea peli, sovelluksessa:</strong> napauta Pelaa netissä. Kun se etsii peliä 2 pelaajalle, napauta Etsi 4 tai 6 pelaajaa etsiäksesi sen sijaan peliä 4 pelaajalle. Jokaisella siirrolla on 30 sekuntia. Jos tarpeeksi pelaajia ei liity 20 sekunnin kuluessa, tietokonepelaajat täyttävät tyhjät paikat, joten jotkin vastustajat voivat olla tietokonepelaajia.</li>
      </ul>
    </section>`;

export default {
  nav: "Kiinanšakki 4 pelaajalle",
  titel: "Kiinanšakki 4 pelaajalle: aloitus ja vinkit | Leapstone",
  beschrijving: "Näin kiinanšakki toimii 4 pelaajalla: miten lauta jaetaan, mitkä 2 kärkeä jäävät tyhjiksi, kuka on kenenkin vastapuolella, taktiikka ja missä pelata.",
  h1: "Kiinanšakki 4 pelaajalle",
  intro: "4 pelaajalla jokainen teistä aloittaa yhdessä tähden neljästä kärjestä, ja kaksi kärkeä jää tyhjiksi. Punainen on vihreän vastapuolella ja sininen keltaisen: maalisi on kärki vastapäätäsi, täynnä sen pelaajan nappuloita. Tässä ovat aloitus, tyhjät kärjet, taktiikka ja paikat, joissa voit pelata sitä.",
  inhoud,
};
