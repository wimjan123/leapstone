// Příručka Hrajte čínskou dámu online s přáteli (úkol 304). Obsah: ../en/play-chinese-checkers-online-with-friends.mjs, text sleduje angličtinu větu po větě.

const inhoud = `    <section aria-labelledby="stappen">
      <h2 id="stappen">Kroky od začátku k prvnímu tahu</h2>
      <ol>
        <li><strong>Vyberte si jméno hráče.</strong> K přihlášení nepotřebujete nic jiného.</li>
        <li><strong>Vytvořte online hru.</strong> Zvolte desku, počet hráčů a čas na tah.</li>
        <li><strong>Pošlete pozvánku s odkazem.</strong> Sdílejte ji z čekárny, nebo ji zkopírujte a vložte do libovolné chatovací aplikace.</li>
        <li><strong>Počkejte, až ji otevřou všichni.</strong> Když se obsadí poslední místo, hra začne a táhnete první.</li>
      </ol>
      <p>Zbytek této stránky vysvětluje každou část a také to, co se stane, když kamarád přestane hrát.</p>
    </section>

    <section aria-labelledby="uitnodiging">
      <h2 id="uitnodiging">Jak funguje odkaz s pozvánkou</h2>
      <p>Jedna hra má jeden odkaz s pozvánkou a všichni kamarádi používají ten stejný. Každý kamarád, který ho otevře, obsadí další volné místo. Hru jste vytvořili vy, takže jste hráč 1 a obsadíte první místo.</p>
      <ul>
        <li><strong>Kolik míst:</strong> na hvězdicové desce má hra 2, 3, 4 nebo 6 hráčů, na čtvercové desce 2 nebo 4. Vybíráte to před odesláním odkazu. Hra nezačne s prázdnými místy a dokud se neobsadí poslední místo, nikdo netáhne.</li>
        <li><strong>Čekárna:</strong> během čekání čekárna ukazuje, kdo už je uvnitř a kolik míst je ještě volných. Když se připojí kamarád, obnoví se sama.</li>
        <li><strong>Sdílení:</strong> tlačítko „Pozvánka“ otevře sdílecí nabídku vašeho telefonu. Pokud není k dispozici, odkaz zkopíruje a můžete ho sami vložit.</li>
        <li><strong>V prohlížeči nebo v aplikaci:</strong> odkaz funguje bez aplikace, v prohlížeči. Pokud má kamarád aplikaci, může ji odkaz otevřít.</li>
        <li><strong>Plný nebo neznámý odkaz:</strong> jakmile jsou všechna místa obsazená, odkaz ukáže, že hra je plná. Odkaz, který neexistuje, ukáže, že pozvánka je neznámá. V obou případech požádejte kamaráda o nový odkaz.</li>
      </ul>
      <p>Odkaz patří jen k této hře. Má 16 náhodných znaků, takže ho nikdo nemůže uhodnout, ale kdokoli ho získá, může obsadit volné místo. Posílejte ho jen lidem, se kterými chcete hrát.</p>
    </section>

    <section aria-labelledby="naam">
      <h2 id="naam">Žádný účet, jen jméno hráče</h2>
      <p>Nepotřebujete e-mailovou adresu ani heslo. Vyberete si jméno hráče o 1 až 30 znacích a ostatní hráči toto jméno vidí. Některá sprostá jména se odmítnou a pak si vyberete jiné.</p>
      <p>Po výběru jména aplikace ukáže obnovovací kód o 20 znacích, rozdělený do pěti skupin. Uložte si ho. Když si pořídíte nový telefon, zadáte kód a své jméno hráče dostanete zpět. Bez kódu své jméno na novém telefonu zpět nedostanete.</p>
      <p>Vaši kamarádi dělají totéž, když otevřou váš odkaz: nejdřív si vyberou jméno a pak se připojí k vaší hře.</p>
    </section>

    <section aria-labelledby="denktijd">
      <h2 id="denktijd">Čas na tah: jak dlouho může kamarád přemýšlet</h2>
      <p>Čas na tah je nejdelší doba, kterou má hráč na jeden tah. Nastavíte ho při vytvoření hry a platí pro všechny v té hře.</p>
      <ul>
        <li><strong>Možnosti:</strong> 15 sekund, 30 sekund, 1 minuta nebo 2 minuty. Můžete ho také vypnout, tedy bez jakéhokoli limitu. Aplikace začíná na 30 sekundách.</li>
        <li><strong>Hodiny:</strong> čas hlídá server, takže telefon se špatně nastavenými hodinami na něm nic nezmění. Aplikace ukazuje, kolik času zbývá.</li>
        <li><strong>První odpočet:</strong> začíná, když se obsadí poslední místo. Do té doby nikomu čas neběží.</li>
        <li><strong>Rychlá hra:</strong> když klepnete na „Hrát online“ a hrajete s cizím hráčem, je čas na tah pevně 30 sekund. Volit můžete jen ve hře s kamarády.</li>
      </ul>
      <p>Pro kamarády, kteří hrají z gauče, je 2 minuty nebo bez limitu pohodové. Pro rychlou hru zvolte 15 sekund. Bez limitu může hra čekat, jak dlouho je potřeba, a dohrajete ji, až budete mít čas.</p>
    </section>

    <section aria-labelledby="wegvallen">
      <h2 id="wegvallen">Co se stane, když někdo vypadne</h2>
      <p>Hra žije na serveru, ne v telefonu. Když kamarád zavře aplikaci, ztratí připojení nebo usne, hra zůstane tam, kde je, a kamarád ji znovu najde v „Moje hry“.</p>
      <ul>
        <li><strong>Čas vyprší:</strong> tah toho hráče se přeskočí. Na desce se nic nepohne a čas běží dalšímu hráči.</li>
        <li><strong>Tři tahy za sebou:</strong> hráč, který vynechá 3 tahy za sebou, hru sám vzdá. Každý tah, který hráč udělá, vrátí počet na nulu.</li>
        <li><strong>Vzdání:</strong> hráči, který hru vzdá, ať už sám, nebo po 3 vynechaných tazích, se kameny z desky odeberou, takže nikomu nepřekážejí.</li>
        <li><strong>Hra pro 2:</strong> hra skončí a vyhrává druhý hráč.</li>
        <li><strong>Hra pro 3, 4 nebo 6:</strong> hra pokračuje bez hráče, který odešel, a tah přechází na dalšího hráče, který je ještě ve hře.</li>
        <li><strong>Bez času na tah:</strong> pokud jste zvolili bez limitu, hra nikdy nepřeskočí tah. Čeká, dokud se kamarád nevrátí, nebo dokud hru nevzdá.</li>
      </ul>
      <p>Pokud jste zapnuli oznámení, aplikace vám řekne, kdy jste na tahu, i když je zavřená. Zapněte je v aplikaci, nebo v nastavení telefonu či prohlížeče.</p>
    </section>

    <section aria-labelledby="daarna">
      <h2 id="daarna">Po hře</h2>
      <p>Hráči, kteří hrají spolu přes pozvánku, se přidají do seznamu přátel jeden druhému. Odtud můžete kamaráda vyzvat k nové hře, bez nového odkazu. Vaše rozehrané i dohrané hry jsou v „Moje hry“.</p>
      <p>Jste noví v pravidlech? Přečtěte si <a href="/cs/pravidla/cinska-dama">pravidla čínské dámy</a>. Hrajete ve dvou? Přečtěte si <a href="/cs/navody/cinska-dama-pro-dva-hrace">Čínskou dámu pro 2 hráče</a>. Chcete vyhrát? Přečtěte si <a href="/cs/navody/cinska-dama-strategie">tipy ke strategii</a>.</p>
      <p><a href="/cs/navody/cinska-dama-pro-tri-hrace">Čínská dáma pro 3 hráče</a></p>
    </section>`;

export default {
  nav: "Čínská dáma online s přáteli",
  titel: "Čínská dáma online s přáteli | Leapstone",
  beschrijving: "Hrajte čínskou dámu online s přáteli: pošlete odkaz s pozvánkou, nastavte čas na tah a zjistěte, co se stane, když někdo vypadne.",
  h1: "Hrajte čínskou dámu online s přáteli",
  intro: "Vytvořte hru, pošlete jeden odkaz s pozvánkou a hrajte, až se připojí všichni. Stačí vám jméno hráče a čas na tah si nastavíte sami.",
  inhoud,
};
