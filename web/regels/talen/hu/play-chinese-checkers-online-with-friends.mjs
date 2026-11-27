// A Csillaghalma online barátokkal útmutató (304. feladat). Tartalom: ../en/play-chinese-checkers-online-with-friends.mjs, a szöveg mondatról mondatra követi az angolt.

const inhoud = `    <section aria-labelledby="stappen">
      <h2 id="stappen">A lépések az elejétől az első lépésig</h2>
      <ol>
        <li><strong>Válassz játékosnevet.</strong> A belépéshez csak ez kell.</li>
        <li><strong>Hozz létre egy online játszmát.</strong> Válaszd ki a táblát, a játékosok számát és a lépésenkénti időt.</li>
        <li><strong>Küldd el a meghívó hivatkozását.</strong> Oszd meg a váróteremből, vagy másold ki, és illeszd be bármelyik csevegőalkalmazásba.</li>
        <li><strong>Várd meg, hogy mindenki megnyissa.</strong> Amikor az utolsó hely is betelt, a játszma elindul, és te lépsz először.</li>
      </ol>
      <p>Az oldal többi része részletesen elmagyarázza az egyes részeket, és azt is, mi történik, ha egy barát abbahagyja a játékot.</p>
    </section>

    <section aria-labelledby="uitnodiging">
      <h2 id="uitnodiging">Hogyan működik a meghívó hivatkozása</h2>
      <p>Egy játszmának egy meghívó hivatkozása van, és minden barát ugyanazt használja. Minden barát, aki megnyitja, a következő szabad helyet foglalja el. Te hoztad létre a játszmát, ezért te vagy az 1. játékos, és az első helyet foglalod el.</p>
      <ul>
        <li><strong>Hány hely van:</strong> a csillagtáblán egy játszmában 2, 3, 4 vagy 6 játékos van, a négyzet alakú táblán 2 vagy 4. Ezt a hivatkozás elküldése előtt választod ki. A játszma nem indul üres helyekkel, és addig nincs lépés, amíg az utolsó hely be nem telik.</li>
        <li><strong>A váróterem:</strong> amíg vársz, a váróterem megmutatja, ki van bent, és hány hely szabad még. Magától frissül, amikor csatlakozik egy barát.</li>
        <li><strong>Megosztás:</strong> a „Meghívó” gomb megnyitja a telefon megosztási menüjét. Ha az nem elérhető, a gomb kimásolja a hivatkozást, és te magad beillesztheted.</li>
        <li><strong>Böngészőben vagy az alkalmazásban:</strong> a hivatkozás alkalmazás nélkül, böngészőben is működik. Ha a barátodnak megvan az alkalmazás, a hivatkozás megnyithatja azt.</li>
        <li><strong>Teli vagy ismeretlen hivatkozás:</strong> ha minden hely betelt, a hivatkozás azt mutatja, hogy a játszma megtelt. Egy nem létező hivatkozás azt mutatja, hogy a meghívó ismeretlen. Mindkét esetben kérj új hivatkozást a barátodtól.</li>
      </ul>
      <p>A hivatkozás csak erre a játszmára szól. 16 véletlen karakterből áll, ezért senki sem találhatja ki, de bárki, aki megkapja, elfoglalhat egy szabad helyet. Csak azoknak küldd el, akikkel játszani akarsz.</p>
    </section>

    <section aria-labelledby="naam">
      <h2 id="naam">Nincs fiók, csak egy játékosnév</h2>
      <p>Nincs szükséged e-mail-címre vagy jelszóra. Választasz egy 1 és 30 karakter közötti játékosnevet, és a többi játékos ezt a nevet látja. Néhány durva nevet elutasít a rendszer, ilyenkor másikat választasz.</p>
      <p>A név kiválasztása után az alkalmazás megmutat egy 20 karakteres helyreállítási kódot, öt csoportban. Mentsd el. Ha új telefonod lesz, beírod a kódot, és visszakapod a játékosneved. Kód nélkül nem kaphatod vissza a neved egy új telefonon.</p>
      <p>A barátaid ugyanezt teszik, amikor megnyitják a hivatkozásodat: először nevet választanak, aztán csatlakoznak a játszmádhoz.</p>
    </section>

    <section aria-labelledby="denktijd">
      <h2 id="denktijd">Idő lépésenként: meddig gondolkodhat egy barát</h2>
      <p>A lépésenkénti idő az a legtöbb idő, amennyi egy játékosnak egy lépésre jut. A játszma létrehozásakor állítod be, és abban a játszmában mindenkire érvényes.</p>
      <ul>
        <li><strong>A lehetőségek:</strong> 15 másodperc, 30 másodperc, 1 perc vagy 2 perc. Ki is kapcsolhatod, vagyis egyáltalán nincs korlát. Az alkalmazás 30 másodperccel indul.</li>
        <li><strong>Az óra:</strong> az időt a szerver méri, ezért egy rosszul beállított órájú telefon nem változtat rajta. Az alkalmazás megmutatja, mennyi idő van hátra.</li>
        <li><strong>Az első óra:</strong> akkor indul, amikor az utolsó hely is betelt. Addig senkinek sem fut az ideje.</li>
        <li><strong>Gyors játszma:</strong> ha az „Online játék” gombra koppintasz, hogy idegennel játssz, a lépésenkénti idő fix 30 másodperc. Csak a barátokkal való játszmában választhatsz.</li>
      </ul>
      <p>A kanapéról játszó barátoknak a 2 perc vagy a korlát nélküli játék kényelmes. Gyors játszmához válaszd a 15 másodpercet. Korlát nélkül a játszma addig várhat, ameddig kell, és akkor fejezed be, amikor ráérsz.</p>
    </section>

    <section aria-labelledby="wegvallen">
      <h2 id="wegvallen">Mi történik, ha valaki kiesik</h2>
      <p>A játszma a szerveren él, nem egy telefonon. Ha egy barát bezárja az alkalmazást, megszakad a kapcsolata, vagy elalszik, a játszma ott marad, ahol van, és a barát újra megtalálja a „Játszmáim” között.</p>
      <ul>
        <li><strong>Lejár az idő:</strong> az adott játékos köre kimarad. A táblán semmi sem mozdul, és a következő játékosnak kezd futni az ideje.</li>
        <li><strong>Három kör egymás után:</strong> az a játékos, aki 3 kört egymás után kihagy, magától feladja. Minden lépés, amit a játékos megtesz, nullára állítja a számlálót.</li>
        <li><strong>Feladás:</strong> annak a játékosnak, aki feladja, akár önként, akár 3 kihagyott kör után, lekerülnek a bábui a tábláról, így senkit sem akadályoznak.</li>
        <li><strong>2 fős játszma:</strong> a játszma véget ér, és a másik játékos nyer.</li>
        <li><strong>3, 4 vagy 6 fős játszma:</strong> a játszma a kiesett játékos nélkül folytatódik, és a kör a következő, még játékban lévő játékosra száll.</li>
        <li><strong>Nincs lépésenkénti idő:</strong> ha a korlát nélkülit választottad, a játszma soha nem hagy ki kört. Megvárja, amíg a barát visszatér, vagy amíg feladja.</li>
      </ul>
      <p>Ha bekapcsoltad az értesítéseket, az alkalmazás szól, amikor te jössz, akkor is, ha be van zárva. Kapcsold be őket az alkalmazásban, vagy a telefonod vagy a böngésződ beállításaiban.</p>
    </section>

    <section aria-labelledby="daarna">
      <h2 id="daarna">A játszma után</h2>
      <p>Azok a játékosok, akik meghívóval játszanak együtt, felkerülnek egymás barátlistájára. Onnan új játszmára hívhatsz ki egy barátot, új hivatkozás nélkül. A nyitott és a befejezett játszmáid a „Játszmáim” között vannak.</p>
      <p>Új vagy a szabályokban? Olvasd el a <a href="/hu/szabalyok/csillaghalma">csillaghalma szabályait</a>. Ketten játszotok? Olvasd el a <a href="/hu/utmutatok/csillaghalma-2-jatekosnak">Csillaghalma 2 játékosnak</a> útmutatót. Nyerni akarsz? Olvasd el a <a href="/hu/utmutatok/csillaghalma-strategia">stratégiai tippeket</a>.</p>
      <p><a href="/hu/utmutatok/csillaghalma-3-jatekosnak">Csillaghalma 3 játékosnak</a></p>
    </section>`;

export default {
  nav: "Csillaghalma online barátokkal",
  titel: "Csillaghalma online barátokkal | Leapstone",
  beschrijving: "Játssz csillaghalmát online barátokkal: küldj meghívót, állítsd be a lépésenkénti időt, és nézd meg, mi történik, ha valaki kiesik.",
  h1: "Játssz csillaghalmát online barátokkal",
  intro: "Hozz létre egy játszmát, küldj egy meghívó hivatkozást, és játsszatok, amint mindenki csatlakozott. Csak egy játékosnév kell, a lépésenkénti időt pedig te állítod be.",
  inhoud,
};
