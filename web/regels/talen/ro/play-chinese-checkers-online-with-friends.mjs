// Ghidul Dame chinezești online cu prietenii (taak 304): /ro/ghiduri/dame-chinezesti-online-cu-prietenii. Textul urmează ../en/ propoziție cu propoziție.

const inhoud = `    <section aria-labelledby="stappen">
      <h2 id="stappen">Pașii, de la început până la prima mutare</h2>
      <ol>
        <li><strong>Alege un nume de jucător.</strong> Atât îți trebuie ca să te conectezi.</li>
        <li><strong>Creează o partidă online.</strong> Alege tabla, numărul de jucători și timpul pe mutare.</li>
        <li><strong>Trimite linkul de invitație.</strong> Distribuie-l din sala de așteptare sau copiază-l și lipește-l în orice aplicație de chat.</li>
        <li><strong>Așteaptă să-l deschidă toți.</strong> Când se ocupă ultimul loc, partida începe și tu faci prima mutare.</li>
      </ol>
      <p>Restul paginii explică fiecare parte și ce se întâmplă când un prieten nu mai joacă.</p>
    </section>

    <section aria-labelledby="uitnodiging">
      <h2 id="uitnodiging">Cum funcționează linkul de invitație</h2>
      <p>O partidă are un singur link de invitație, iar fiecare prieten îl folosește pe același. Fiecare prieten care îl deschide ia următorul loc liber. Tu ai creat partida, deci ești jucătorul 1 și ai primul loc.</p>
      <ul>
        <li><strong>Câte locuri:</strong> pe tabla în stea o partidă are 2, 3, 4 sau 6 jucători, iar pe tabla pătrată 2 sau 4. Alegi asta înainte să trimiți linkul. Partida nu începe cu locuri goale și nu se poate muta până nu se ocupă ultimul loc.</li>
        <li><strong>Sala de așteptare:</strong> cât timp aștepți, sala de așteptare arată cine a intrat și câte locuri mai sunt libere. Se actualizează singură când intră un prieten.</li>
        <li><strong>Distribuirea:</strong> butonul Invitație deschide meniul de partajare al telefonului. Dacă nu există, copiază linkul și îl poți lipi singur.</li>
        <li><strong>În browser sau în aplicație:</strong> linkul merge și fără aplicație, într-un browser. Dacă prietenul tău are aplicația, linkul o poate deschide.</li>
        <li><strong>Un link plin sau necunoscut:</strong> când toate locurile sunt ocupate, linkul arată că partida este plină. Un link care nu există arată că invitația este necunoscută. În ambele cazuri, cere prietenului tău un link nou.</li>
      </ul>
      <p>Linkul este doar pentru această partidă. Are 16 caractere aleatorii, deci nimeni nu îl poate ghici, dar oricine îl primește poate lua un loc liber. Trimite-l doar persoanelor cu care vrei să joci.</p>
    </section>

    <section aria-labelledby="naam">
      <h2 id="naam">Fără cont, doar un nume de jucător</h2>
      <p>Nu ai nevoie de adresă de e-mail sau de parolă. Alegi un nume de jucător de 1 până la 30 de caractere, iar ceilalți jucători văd acel nume. Unele nume vulgare sunt refuzate, iar atunci alegi altul.</p>
      <p>După ce alegi un nume, aplicația arată un cod de recuperare de 20 de caractere, în cinci grupuri. Salvează-l. Dacă iei un telefon nou, introduci codul și îți recapeți numele de jucător. Fără cod, nu îți mai poți recupera numele pe un telefon nou.</p>
      <p>Prietenii tăi fac la fel când deschid linkul tău: aleg mai întâi un nume și apoi intră în partida ta.</p>
    </section>

    <section aria-labelledby="denktijd">
      <h2 id="denktijd">Timp pe mutare: cât poate gândi un prieten</h2>
      <p>Timpul pe mutare este timpul maxim pe care îl are un jucător pentru o mutare. Îl stabilești când creezi partida și este valabil pentru toți din acea partidă.</p>
      <ul>
        <li><strong>Variantele:</strong> 15 secunde, 30 de secunde, 1 minut sau 2 minute. Îl poți și opri, atunci nu există nicio limită. Aplicația pornește de la 30 de secunde.</li>
        <li><strong>Ceasul:</strong> serverul ține timpul, deci un telefon cu ceasul greșit nu schimbă nimic. Aplicația arată cât timp a mai rămas.</li>
        <li><strong>Primul ceas:</strong> pornește când se ocupă ultimul loc. Înainte de asta, nimeni nu are timpul pornit.</li>
        <li><strong>O partidă rapidă:</strong> dacă atingi Joacă online ca să joci cu un necunoscut, timpul pe mutare este fixat la 30 de secunde. Doar la o partidă cu prieteni poți alege.</li>
      </ul>
      <p>Pentru prietenii care joacă de pe canapea, 2 minute sau fără limită e relaxant. Pentru o partidă rapidă, alege 15 secunde. Fără limită, o partidă poate aștepta cât e nevoie, iar tu o termini când ai timp.</p>
    </section>

    <section aria-labelledby="wegvallen">
      <h2 id="wegvallen">Ce se întâmplă când cineva iese din joc</h2>
      <p>O partidă trăiește pe server, nu pe un telefon. Dacă un prieten închide aplicația, pierde conexiunea sau adoarme, partida rămâne unde este, iar prietenul o regăsește la Partidele mele.</p>
      <ul>
        <li><strong>Timpul se termină:</strong> rândul acelui jucător este sărit. Nimic nu se mișcă pe tablă, iar următorul jucător are timpul pornit.</li>
        <li><strong>Trei rânduri la rând:</strong> un jucător al cărui rând este sărit de 3 ori la rând renunță singur. Fiecare mutare pe care jucătorul o face totuși readuce numărătoarea la zero.</li>
        <li><strong>Renunțarea:</strong> de la un jucător care renunță, din alegere sau după 3 rânduri sărite, piesele ies de pe tablă, ca să nu blocheze pe nimeni.</li>
        <li><strong>O partidă în 2:</strong> partida se termină și celălalt jucător câștigă.</li>
        <li><strong>O partidă în 3, 4 sau 6:</strong> partida continuă fără jucătorul care a plecat, iar rândul trece la următorul jucător care este încă în joc.</li>
        <li><strong>Fără timp pe mutare:</strong> dacă ai ales fără limită, partida nu sare niciodată un rând. Așteaptă până se întoarce prietenul sau până renunță prietenul.</li>
      </ul>
      <p>Dacă ai pornit notificările, aplicația îți spune când îți vine rândul, chiar și când este închisă. Pornește-le din aplicație sau din setările telefonului sau ale browserului.</p>
    </section>

    <section aria-labelledby="daarna">
      <h2 id="daarna">După partidă</h2>
      <p>Jucătorii care joacă împreună printr-o invitație ajung în lista de prieteni a celuilalt. De acolo poți provoca un prieten la o partidă nouă, fără un link nou. Partidele tale deschise și încheiate sunt la Partidele mele.</p>
      <p>Nu cunoști regulile? Citește <a href="/ro/reguli/dame-chinezesti">regulile damelor chinezești</a>. Jucați în doi? Citește <a href="/ro/ghiduri/dame-chinezesti-in-doi">damele chinezești pentru 2 jucători</a>. Vrei să câștigi? Citește <a href="/ro/ghiduri/dame-chinezesti-strategie">sfaturile de strategie</a>.</p>
      <p><a href="/ro/ghiduri/dame-chinezesti-in-trei">Dame chinezești pentru 3 jucători</a></p>
    </section>`;

export default {
  nav: "Dame chinezești online cu prietenii",
  titel: "Dame chinezești online cu prietenii | Leapstone",
  beschrijving: "Dame chinezești online cu prietenii: trimite un link de invitație, setează timpul pe mutare, joacă cu un nume de jucător și vezi ce se întâmplă la ieșire.",
  h1: "Joacă dame chinezești online cu prietenii",
  intro: "Creează o partidă, trimite un singur link de invitație și jucați când au intrat toți. Ai nevoie doar de un nume de jucător, iar timpul pe mutare îl stabilești tu.",
  inhoud,
};
