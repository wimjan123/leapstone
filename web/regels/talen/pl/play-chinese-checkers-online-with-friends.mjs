// Poradnik „Trylma online ze znajomymi” (taak 304): /pl/poradniki/trylma-online-z-przyjaciolmi. Tekst volgt ../en/ zin voor zin.

const inhoud = `    <section aria-labelledby="stappen">
      <h2 id="stappen">Kroki, od początku do pierwszego ruchu</h2>
      <ol>
        <li><strong>Wybierz nazwę gracza.</strong> Tylko tego potrzebujesz, żeby się zalogować.</li>
        <li><strong>Utwórz partię online.</strong> Wybierz planszę, liczbę graczy i czas na ruch.</li>
        <li><strong>Wyślij link z zaproszeniem.</strong> Udostępnij go z poczekalni albo skopiuj i wklej w dowolnym komunikatorze.</li>
        <li><strong>Poczekaj, aż wszyscy go otworzą.</strong> Gdy zajmie się ostatnie miejsce, gra się zaczyna i ty wykonujesz pierwszy ruch.</li>
      </ol>
      <p>Reszta tej strony wyjaśnia każdą część oraz to, co się dzieje, gdy znajomy przestaje grać.</p>
    </section>

    <section aria-labelledby="uitnodiging">
      <h2 id="uitnodiging">Jak działa link z zaproszeniem</h2>
      <p>Jedna partia ma jeden link z zaproszeniem i każdy znajomy używa tego samego. Każdy znajomy, który go otworzy, zajmuje następne wolne miejsce. Ty utworzyłeś partię, więc jesteś graczem 1 i zajmujesz pierwsze miejsce.</p>
      <ul>
        <li><strong>Ile miejsc:</strong> na planszy gwiazdowej partia ma 2, 3, 4 lub 6 graczy, a na planszy kwadratowej 2 lub 4. Wybierasz to, zanim wyślesz link. Partia nie zaczyna się z pustymi miejscami i nie ma żadnego ruchu, dopóki ostatnie miejsce nie zostanie zajęte.</li>
        <li><strong>Poczekalnia:</strong> gdy czekasz, poczekalnia pokazuje, kto już jest i ile miejsc jest jeszcze wolnych. Odświeża się sama, gdy dołącza znajomy.</li>
        <li><strong>Udostępnianie:</strong> przycisk „Zaproszenie” otwiera menu udostępniania w telefonie. Jeśli go nie ma, kopiuje link i możesz go wkleić samodzielnie.</li>
        <li><strong>W przeglądarce lub w aplikacji:</strong> link działa też bez aplikacji, w przeglądarce. Jeśli twój znajomy ma aplikację, link może ją otworzyć.</li>
        <li><strong>Pełny lub nieznany link:</strong> gdy wszystkie miejsca są zajęte, link pokazuje, że partia jest pełna. Link, który nie istnieje, pokazuje, że zaproszenie jest nieznane. W obu przypadkach poproś znajomego o nowy link.</li>
      </ul>
      <p>Link jest tylko do tej partii. Ma 16 losowych znaków, więc nikt go nie odgadnie, ale każdy, kto go dostanie, może zająć wolne miejsce. Wysyłaj go tylko osobom, z którymi chcesz grać.</p>
    </section>

    <section aria-labelledby="naam">
      <h2 id="naam">Bez konta, tylko nazwa gracza</h2>
      <p>Nie potrzebujesz adresu e-mail ani hasła. Wybierasz nazwę gracza o długości od 1 do 30 znaków, a inni gracze widzą tę nazwę. Niektóre wulgarne nazwy są odrzucane i wtedy wybierasz inną.</p>
      <p>Po wybraniu nazwy aplikacja pokazuje kod odzyskiwania z 20 znaków, w pięciu grupach. Zapisz go. Jeśli dostaniesz nowy telefon, wpisujesz kod i odzyskujesz swoją nazwę gracza. Bez kodu nie odzyskasz nazwy na nowym telefonie.</p>
      <p>Twoi znajomi robią to samo, gdy otworzą twój link: najpierw wybierają nazwę, a potem dołączają do twojej partii.</p>
    </section>

    <section aria-labelledby="denktijd">
      <h2 id="denktijd">Czas na ruch: ile znajomy może się zastanawiać</h2>
      <p>Czas na ruch to najdłuższy czas, jaki gracz ma na jeden ruch. Ustawiasz go przy tworzeniu partii i obowiązuje wszystkich w tej partii.</p>
      <ul>
        <li><strong>Do wyboru:</strong> 15 sekund, 30 sekund, 1 minuta albo 2 minuty. Możesz też go wyłączyć, wtedy nie ma żadnego limitu. Aplikacja zaczyna od 30 sekund.</li>
        <li><strong>Zegar:</strong> czas mierzy serwer, więc telefon z błędnym zegarem nic w tym nie zmienia. Aplikacja pokazuje, ile czasu zostało.</li>
        <li><strong>Pierwszy zegar:</strong> rusza, gdy zajmie się ostatnie miejsce. Wcześniej nikt nie ma odliczanego czasu.</li>
        <li><strong>Szybka partia:</strong> jeśli dotkniesz „Graj online”, żeby zagrać z obcą osobą, czas na ruch wynosi na stałe 30 sekund. Tylko w partii ze znajomymi możesz wybierać.</li>
      </ul>
      <p>Dla znajomych, którzy grają z kanapy, 2 minuty lub brak limitu są wygodne. Do szybkiej gry wybierz 15 sekund. Bez limitu partia może czekać tak długo, jak trzeba, a ty kończysz ją, gdy masz czas.</p>
    </section>

    <section aria-labelledby="wegvallen">
      <h2 id="wegvallen">Co się dzieje, gdy ktoś odpadnie</h2>
      <p>Partia żyje na serwerze, nie w telefonie. Jeśli znajomy zamknie aplikację, straci połączenie albo zaśnie, partia zostaje tam, gdzie jest, a znajomy znajdzie ją w „Moje partie”.</p>
      <ul>
        <li><strong>Czas się kończy:</strong> kolejka tego gracza jest pomijana. Na planszy nic się nie rusza, a czas zaczyna biec następnemu graczowi.</li>
        <li><strong>Trzy kolejki z rzędu:</strong> gracz, który pominie 3 kolejki z rzędu, poddaje się sam. Każdy ruch, który gracz jednak wykona, zeruje licznik.</li>
        <li><strong>Poddanie się:</strong> gdy gracz się poddaje, z własnej woli albo po 3 pominiętych kolejkach, jego pionki znikają z planszy, żeby nikomu nie przeszkadzały.</li>
        <li><strong>Partia dla 2:</strong> partia się kończy i wygrywa drugi gracz.</li>
        <li><strong>Partia dla 3, 4 lub 6:</strong> gra toczy się dalej bez gracza, którego nie ma, a kolejka przechodzi do następnego gracza, który jest jeszcze w grze.</li>
        <li><strong>Bez czasu na ruch:</strong> jeśli wybrałeś brak limitu, partia nigdy nie pomija kolejki. Czeka, aż znajomy wróci albo aż się podda.</li>
      </ul>
      <p>Jeśli włączyłeś powiadomienia, aplikacja da ci znać, kiedy twoja kolej, także gdy jest zamknięta. Włącz je w aplikacji albo w ustawieniach telefonu lub przeglądarki.</p>
    </section>

    <section aria-labelledby="daarna">
      <h2 id="daarna">Po partii</h2>
      <p>Gracze, którzy grają razem przez zaproszenie, trafiają na swoje listy znajomych. Stamtąd możesz wyzwać znajomego na nową partię, bez nowego linku. Twoje otwarte i zakończone partie są w „Moje partie”.</p>
      <p>Nie znasz zasad? Przeczytaj <a href="/pl/zasady/trylma">zasady trylmy</a>. Gracie we dwoje? Przeczytaj <a href="/pl/poradniki/trylma-dla-dwoch-graczy">trylmę dla 2 graczy</a>. Chcesz wygrać? Przeczytaj <a href="/pl/poradniki/trylma-strategia">wskazówki o strategii</a>.</p>
      <p><a href="/pl/poradniki/trylma-dla-trzech-graczy">Trylma dla 3 graczy</a></p>
    </section>`;

export default {
  nav: "Trylma online ze znajomymi",
  titel: "Trylma online ze znajomymi: jak zagrać | Leapstone",
  beschrijving: "Trylma (chińskie warcaby) online ze znajomymi: wyślij link z zaproszeniem, ustaw czas na ruch, graj z samą nazwą gracza i sprawdź, co jeśli ktoś odpadnie.",
  h1: "Trylma (chińskie warcaby) online ze znajomymi",
  intro: "Utwórz partię, wyślij jeden link z zaproszeniem i graj, gdy wszyscy dołączą. Potrzebujesz tylko nazwy gracza, a czas na ruch ustawiasz sam.",
  inhoud,
};
