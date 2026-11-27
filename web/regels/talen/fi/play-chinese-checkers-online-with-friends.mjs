// Suomenkielinen opas Pelaa kiinanšakkia verkossa kavereiden kanssa (taak 304): /fi/oppaat/kiinansakki-verkossa-kavereiden-kanssa. Teksti seuraa ../en/ lause lauseelta.

const inhoud = `    <section aria-labelledby="stappen">
      <h2 id="stappen">Vaiheet alusta ensimmäiseen siirtoon</h2>
      <ol>
        <li><strong>Valitse pelaajanimi.</strong> Se on kaikki, mitä tarvitset kirjautumiseen.</li>
        <li><strong>Luo verkkopeli.</strong> Valitse lauta, pelaajien määrä ja aika siirtoa kohti.</li>
        <li><strong>Lähetä kutsulinkki.</strong> Jaa se odotushuoneesta tai kopioi se ja liitä mihin tahansa viestisovellukseen.</li>
        <li><strong>Odota, että kaikki avaavat sen.</strong> Kun viimeinenkin paikka on otettu, peli alkaa ja siirrät ensin.</li>
      </ol>
      <p>Loput tästä sivusta kertoo kustakin osasta ja siitä, mitä tapahtuu, kun kaveri lopettaa pelaamisen.</p>
    </section>

    <section aria-labelledby="uitnodiging">
      <h2 id="uitnodiging">Näin kutsulinkki toimii</h2>
      <p>Yhdellä pelillä on yksi kutsulinkki, ja kaikki kaverit käyttävät samaa. Jokainen kaveri, joka avaa sen, ottaa seuraavan vapaan paikan. Sinä loit pelin, joten olet Pelaaja 1 ja otat ensimmäisen paikan.</p>
      <ul>
        <li><strong>Montako paikkaa:</strong> tähtilaudalla pelissä on 2, 3, 4 tai 6 pelaajaa ja neliölaudalla 2 tai 4. Valitset tämän ennen linkin lähettämistä. Peli ei ala tyhjin paikoin, eikä siirtoja tehdä ennen kuin viimeinen paikka on otettu.</li>
        <li><strong>Odotushuone:</strong> odottaessasi odotushuone näyttää, ketkä ovat mukana ja montako paikkaa on vielä vapaana. Se päivittyy itsestään, kun kaveri liittyy.</li>
        <li><strong>Jakaminen:</strong> Kutsu-painike avaa puhelimesi jakovalikon. Jos se ei ole käytettävissä, painike kopioi linkin, ja voit liittää sen itse.</li>
        <li><strong>Selaimessa tai sovelluksessa:</strong> linkki toimii ilman sovellusta selaimessa. Jos kaverillasi on sovellus, linkki voi avata sen.</li>
        <li><strong>Täysi tai tuntematon linkki:</strong> kun kaikki paikat on otettu, linkki kertoo, että peli on täynnä. Linkki, jota ei ole olemassa, kertoo, että kutsu on tuntematon. Kummassakin tapauksessa pyydä kaveriltasi uusi linkki.</li>
      </ul>
      <p>Linkki on vain tätä peliä varten. Siinä on 16 satunnaista merkkiä, joten kukaan ei voi arvata sitä, mutta kuka tahansa, joka saa sen, voi ottaa vapaan paikan. Lähetä se vain niille, joiden kanssa haluat pelata.</p>
    </section>

    <section aria-labelledby="naam">
      <h2 id="naam">Ei tiliä, vain pelaajanimi</h2>
      <p>Et tarvitse sähköpostiosoitetta etkä salasanaa. Valitset pelaajanimen, jossa on 1 - 30 merkkiä, ja muut pelaajat näkevät sen nimen. Jotkin sopimattomat nimet hylätään, ja silloin valitset toisen.</p>
      <p>Kun olet valinnut nimen, sovellus näyttää 20 merkin palautuskoodin viidessä ryhmässä. Tallenna se. Jos hankit uuden puhelimen, kirjoitat koodin ja saat pelaajanimesi takaisin. Ilman koodia et saa nimeäsi takaisin uudella puhelimella.</p>
      <p>Kaverisi tekevät saman avatessaan linkkisi: he valitsevat ensin nimen ja liittyvät sitten peliisi.</p>
    </section>

    <section aria-labelledby="denktijd">
      <h2 id="denktijd">Aika siirtoa kohti: kuinka kauan kaveri saa miettiä</h2>
      <p>Aika siirtoa kohti on pisin aika, jonka pelaaja saa yhteen siirtoon. Asetat sen pelin luodessasi, ja se koskee kaikkia siinä pelissä.</p>
      <ul>
        <li><strong>Vaihtoehdot:</strong> 15 sekuntia, 30 sekuntia, 1 minuutti tai 2 minuuttia. Voit myös kytkeä sen pois, jolloin rajaa ei ole lainkaan. Sovellus aloittaa 30 sekunnista.</li>
        <li><strong>Kello:</strong> palvelin pitää ajan, joten väärin menevä puhelimen kello ei muuta mitään. Sovellus näyttää, kuinka paljon aikaa on jäljellä.</li>
        <li><strong>Ensimmäinen kello:</strong> se alkaa, kun viimeinen paikka on otettu. Sitä ennen kenelläkään ei ole kelloa käynnissä.</li>
        <li><strong>Pikapeli:</strong> jos napautat Pelaa netissä pelataksesi tuntematonta vastaan, aika siirtoa kohti on kiinteästi 30 sekuntia. Vain kavereiden kanssa pelattavassa pelissä saat valita.</li>
      </ul>
      <p>Sohvalta pelaaville kavereille 2 minuuttia tai ei rajaa on rento valinta. Nopeaan peliin valitse 15 sekuntia. Ilman rajaa peli voi odottaa niin kauan kuin tarvitaan, ja pelaat sen loppuun, kun on aikaa.</p>
    </section>

    <section aria-labelledby="wegvallen">
      <h2 id="wegvallen">Mitä tapahtuu, kun joku putoaa pois</h2>
      <p>Peli elää palvelimella, ei puhelimessa. Jos kaveri sulkee sovelluksen, menettää yhteyden tai nukahtaa, peli pysyy ennallaan, ja kaveri löytää sen uudelleen kohdasta Omat pelini.</p>
      <ul>
        <li><strong>Aika loppuu:</strong> kyseisen pelaajan vuoro ohitetaan. Laudalla ei liiku mikään, ja seuraavalla pelaajalla kello käy.</li>
        <li><strong>Kolme vuoroa peräkkäin:</strong> pelaaja, joka ohittaa 3 vuoroa peräkkäin, luovuttaa itsestään. Jokainen siirto, jonka pelaaja todella tekee, nollaa laskurin.</li>
        <li><strong>Luovuttaminen:</strong> pelaajan, joka luovuttaa joko omasta valinnastaan tai 3 ohitetun vuoron jälkeen, nappulat poistetaan laudalta, jotta ne eivät estä ketään.</li>
        <li><strong>Peli 2 pelaajalle:</strong> peli päättyy, ja toinen pelaaja voittaa.</li>
        <li><strong>Peli 3, 4 tai 6 pelaajalle:</strong> peli jatkuu ilman poissa olevaa pelaajaa, ja vuoro siirtyy seuraavalle pelaajalle, joka on vielä mukana.</li>
        <li><strong>Ei aikaa siirtoa kohti:</strong> jos valitsit ei rajaa, peli ei ohita vuoroa koskaan. Se odottaa, kunnes kaveri palaa tai kunnes kaveri luovuttaa.</li>
      </ul>
      <p>Jos otit ilmoitukset käyttöön, sovellus kertoo, kun on sinun vuorosi, myös silloin kun se on suljettu. Ota ne käyttöön sovelluksesta tai puhelimen tai selaimen asetuksista.</p>
    </section>

    <section aria-labelledby="daarna">
      <h2 id="daarna">Pelin jälkeen</h2>
      <p>Pelaajat, jotka pelaavat yhdessä kutsun kautta, lisätään toistensa Ystävät-listalle. Sieltä voit haastaa kaverin uuteen peliin ilman uutta linkkiä. Avoimet ja päättyneet pelisi ovat kohdassa Omat pelini.</p>
      <p>Säännöt uusia? Lue <a href="/fi/saannot/kiinansakki">kiinanšakin säännöt</a>. Pelaatteko kaksin? Lue <a href="/fi/oppaat/kiinansakki-kahdelle">kiinanšakki kahdelle pelaajalle</a>. Haluatko voittaa? Lue <a href="/fi/oppaat/kiinansakki-strategia">strategiavinkit</a>.</p>
      <p><a href="/fi/oppaat/kiinansakki-kolmelle">Kiinanšakki kolmelle pelaajalle</a></p>
    </section>`;

export default {
  nav: "Kiinanšakki verkossa kavereiden kanssa",
  titel: "Pelaa kiinanšakkia verkossa kavereiden kanssa | Leapstone",
  beschrijving: "Pelaa kiinanšakkia verkossa kavereiden kanssa: lähetä kutsulinkki, aseta aika siirtoa kohti, pelaa pelaajanimellä ja katso, mitä tapahtuu, jos joku putoaa.",
  h1: "Pelaa kiinanšakkia verkossa kavereiden kanssa",
  intro: "Luo peli, lähetä yksi kutsulinkki ja pelaa, kun kaikki ovat liittyneet. Tarvitset vain pelaajanimen, ja asetat ajan siirtoa kohti itse.",
  inhoud,
};
