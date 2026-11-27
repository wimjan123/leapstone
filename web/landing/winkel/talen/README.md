# Winkelteksten in alle App Store-talen (taak 123)

Eén bestand per App Store-taal in deze map: `<locale>.json`. App Store Connect biedt sinds 2026-03-31 50 talen aan voor metadata; er zijn dus 50 bestanden. Alles is door agents vertaald uit de Engelse teksten (`../teksten.md`), niemand heeft het nagelezen. Geüpload met `../upload-talen.py` (taak 124 en 131).

Controleer met `node docs/winkel/controleer.mjs`.

## Vorm van een bestand

```json
{
  "locale": "de-DE",
  "appstore": { "naam", "ondertitel", "zoekwoorden", "promotietekst", "beschrijving", "whatsNew" },
  "play": { "locale", "titel", "kort", "beschrijving" }
}
```

- `appstore.*` gaat naar `appInfoLocalizations` (`naam`, `ondertitel`) en `appStoreVersionLocalizations` (`zoekwoorden`, `promotietekst`, `beschrijving`, `whatsNew`). Limieten: naam 30, ondertitel 30, zoekwoorden 100, promotietekst 170, beschrijving 4000, whatsNew 4000.
- `play.*` is voor Google Play: titel 30 (gelijk aan de App Store-naam), korte beschrijving 80, volledige beschrijving 4000 (gelijk aan de App Store-beschrijving). `play.locale` is de Play-taalcode; die staat op een goede gok en moet bij het uploaden nog tegen de Play Console worden gecontroleerd (vooral `or-IN`, `sl`, `iw-IL`, `es-419`).
- Sinds versie 1.2.0 (taak 131) is de app vertaald. Het veld `engels` en de slotalinea "De app is Engels" zijn uit alle bestanden gehaald; de controle weigert het veld en zinnen als "English only".
- `whatsNew` zegt per taal kort dat Leapstone nu in die taal is (1.2.0). Voor een volgende versie schrijf je een eigen tekst. De app heeft geen Traditioneel Chinees (alleen `zh-Hans`); `zh-Hant` zegt daarom "ondersteunt meerdere talen".
- Zoekwoorden blijven onder 100 bytes (niet alleen tekens), zoals bij taak 109. Bij Indiase talen, Thai, Japans, Koreaans en Chinees is dat daarom maar 25 tot 33 tekens.
- `en-US` en `nl-NL` komen uit `../teksten.md`; de controle eist dat ze gelijk blijven. Wijzig die twee dus in `teksten.md` en pas daarna het JSON-bestand aan.
- De beschrijving van de andere talen is een ingekorte vertaling (ongeveer 1.300 tekens) van de Engelse tekst. Er staat niets in wat de app niet heeft, "Some online opponents may be computer players" is in elke taal vertaald, en "Halma" staat nooit in de naam.

## Uiterlijk 1b en de Dagelijkse puzzel (taak 286)

- Sinds taak 286 beschrijft elke taal het bord van uiterlijk 1b: rode lak en goud, en inzoomen met twee vingers. Draaien staat er niet meer in: dat kan de app sinds taak 186 niet. In de Indiase talen, Urdu, Arabisch, Indonesisch en Maleis staat "glanzend rood en goud", omdat het woord voor lak daar weinig gebruikt is of iets anders betekent (Hindi लाख is ook "honderdduizend").
- De eerste alinea eindigt in elke taal op "gratis, zonder reclame", omdat Google Play geen promotietekst heeft.
- Elke beschrijving heeft een regel over de Dagelijkse puzzel.
- `en-US`, `en-GB` en `en-CA` eindigen hun zoekwoorden op `,3d,puzzle` (precies 100 bytes). `en-GB` draagt die woorden zo ook in bijna elk ander land; daarom heeft geen andere taal `3d` of `puzzle`. Waar de oude zoekwoorden het woord voor leisteen hadden, staat nu het woord voor puzzel of denkspel in die taal; talen met ruimte en zonder dat woord kregen het erbij. `gu-IN` had geen ruimte. `en-AU` heeft `daily` in plaats van `slate`.

## Tweede talen per land

Apple indexeert per land de hoofdtaal en tweede talen (tabel: [App Store localizations](https://developer.apple.com/help/app-store-connect/reference/app-store-localizations/)). Zoekwoorden van talen die samen in één land staan, moeten elkaar aanvullen. De regels, die de controle afdwingt:

- **Engels (VK) is bijna overal tweede taal** (Duitsland, Frankrijk, Italië, Brazilië, Nederland, India en vrijwel elk ander land buiten de VS). `en-GB` draagt daarom de Engelse zoekwoorden (`sternhalma,multiplayer,offline,strategy,computer,marble,star,chequers,classic,2player,jump`). Elke andere taal herhaalt die woorden niet; hun lijsten bevatten alleen woorden in de eigen taal. Daardoor zijn bijvoorbeeld `multiplayer` en `offline` niet in 40 lijsten opgenomen.
- **VS: `en-US` met `es-MX`.** Spaans (Mexico) heeft alleen Spaanse woorden (juego de mesa, pensar, brinco, ...).
- **Canada: `en-CA` met `fr-CA`.** Andere taal, andere woorden.
- **Australië en Nieuw-Zeeland: `en-AU` met `en-GB`.** Twee Engelse lijsten in dezelfde winkel. `en-AU` heeft daarom andere woorden (`boardgame,brain,casual,turnbased,tabletop,leaderboard,rating,invite,daily,pass,duel`) dan `en-GB`.
- **Spanje: `es-ES` met `ca`** (Catalaans). Geen gedeelde woorden; `estrella` staat alleen in het Catalaans.
- **Japan: `ja` met `en-US`.** Alleen Japanse woorden in `ja`.
- Woorden uit naam en ondertitel staan nooit in de zoekwoorden van dezelfde taal (Apple zoekt daar al op).
- `nl-NL` is aangepast in `teksten.md`: `sternhalma`, `multiplayer`, `offline` en `computer` stonden ook in `en-GB` en zijn vervangen door `gezelschapsspel,leisteen,ranglijst`. Sinds taak 286 staat `puzzel` op de plek van `leisteen`.

## Bronnen

- **W**: taalversies van Wikipedia voor "Chinese checkers" (interwiki-links van `en.wikipedia.org/wiki/Chinese_checkers`, 2026-11-08). Dit is de naam die de taal zelf voor het spel gebruikt.
- **A**: iTunes Search API per land (`itunes.apple.com/search?term=...&country=...&entity=software`, 2026-11-08). Laat zien wat apps in de winkel zelf als titel gebruiken. In de meeste winkels (Kroatië, Tsjechië, Denemarken, Griekenland, Israël, Hongarije, Maleisië, Indonesië, Bangladesh, Saoedi-Arabië) is de uitkomst bijna alleen Engelse titels ("Chinese Checkers ..."); alleen China, Taiwan, Japan, Korea, Italië en Spanje hebben lokale titels. Dat verklaart waarom een aantal talen "Chinese Checkers" in de naam houdt.
- **E**: Engelse term behouden omdat de winkel daar Engelse titels toont (bron A) en ik geen vaste lokale term kon vinden.
- **G**: eigen gok, niet bevestigd door een bron. Controleer die als iemand de teksten ooit laat nalezen.

## Overzicht per taal

| Locale | Naam in de winkel | Lokale spelnaam | Bron | Bijzonderheid |
| --- | --- | --- | --- | --- |
| en-US | Leapstone: Chinese Checkers | Chinese checkers | zoekwoorden.md | bestaande tekst |
| en-GB | Leapstone: Chinese Checkers | Chinese checkers, chequers | zoekwoorden.md | Britse spelling; draagt de Engelse zoekwoorden voor bijna elk land |
| en-AU | Leapstone: Chinese Checkers | Chinese checkers | zoekwoorden.md | eigen zoekwoorden naast `en-GB` |
| en-CA | Leapstone: Chinese Checkers | Chinese checkers | zoekwoorden.md | zoekwoorden als `en-US` |
| nl-NL | Leapstone: Chinees dammen | Chinees dammen | zoekwoorden.md | bestaande tekst; zoekwoorden aangepast, zie boven |
| ar-SA | Leapstone: داما صينية | داما صينية | W (ar) | |
| bn-BD | Leapstone: Chinese Checkers | চাইনিজ চেকার্স (zoekwoord) | E, A (bd: geen resultaten) | schrijfwijze van het zoekwoord is G |
| ca | Leapstone: Dames xineses | Dames xineses | W (ca) | |
| zh-Hans | Leapstone: 跳棋 | 跳棋, 中国跳棋 | A (cn), W (zh) | "跳棋" is wat apps in de Chinese winkel als titel gebruiken |
| zh-Hant | Leapstone: 中國跳棋 | 中國跳棋, 跳棋, 波子棋 | A (tw), W (zh, yue) | |
| hr | Leapstone: Chinese Checkers | kineska dama (zoekwoord) | E, A (hr), G | lokale term is G |
| cs | Leapstone: Čínská dáma | Čínská dáma | W (cs) | |
| da | Leapstone: Kinaskak | Kinaskak | W (da) | |
| de-DE | Leapstone: Sternhalma | Sternhalma | W (de), A (de) | naam bevat "halma" als deel van "Sternhalma"; dat mag, het losse woord "Halma" niet |
| el | Leapstone: Κινέζικη ντάμα | Κινέζικη ντάμα | G | geen Wikipedia-artikel; A (gr) gaf alleen Engelse titels |
| es-ES | Leapstone: Damas chinas | Damas chinas | W (es), A (es) | |
| es-MX | Leapstone: Damas chinas | Damas chinas | W (es), A (es) | Mexicaanse woorden (celular, computadora, brinco); `play.locale` is `es-419` |
| fi | Leapstone: Kiinanšakki | Kiinanšakki | W (fi) | |
| fr-FR | Leapstone: Dames chinoises | Dames chinoises | W (fr) | |
| fr-CA | Leapstone: Dames chinoises | Dames chinoises | W (fr) | zoals fr-FR, met "courriel" |
| gu-IN | Leapstone: Chinese Checkers | ચાઇનીઝ ચેકર્સ (zoekwoord) | E | transliteratie is G |
| he | Leapstone: דמקה סינית | דמקה סינית | W (he) | `play.locale` is `iw-IL` |
| hi | Leapstone: चाइनीज़ चेकर्स | चाइनीज़ चेकर्स | E (transliteratie) | geen vaste Hindi-term gevonden |
| hu | Leapstone: Csillaghalma | Csillaghalma | W (hu) | "kínai dáma" als zoekwoord (G) |
| id | Leapstone: Chinese Checkers | Dam Cina (promotietekst) | E, A (id) | "Dam Cina" is G |
| it | Leapstone: Dama cinese | Dama cinese | W (it), A (it) | |
| ja | Leapstone: ダイヤモンドゲーム | ダイヤモンドゲーム | A (jp) | ハルマ (Halma) in ondertitel en zoekwoorden |
| kn-IN | Leapstone: Chinese Checkers | ಚೈನೀಸ್ ಚೆಕರ್ಸ್ (zoekwoord) | E | transliteratie is G |
| ko | Leapstone: 다이아몬드 게임 | 다이아몬드 게임, 차이니스 체커 | A (kr), W (ko) | 할마 (Halma) in ondertitel |
| ms | Leapstone: Chinese Checkers | Dam Cina (zoekwoord) | E, A (my) | "Dam Cina" is G |
| ml-IN | Leapstone: Chinese Checkers | ചൈനീസ് ചെക്കേഴ്സ് (zoekwoord) | E | transliteratie is G |
| mr-IN | Leapstone: Chinese Checkers | चायनीज चेकर्स (zoekwoord) | E | transliteratie is G |
| no | Leapstone: Kinasjakk | Kinasjakk | W (nb, nn) | |
| or-IN | Leapstone: Chinese Checkers | ଚାଇନିଜ୍ ଚେକର୍ସ (zoekwoord) | E | transliteratie is G; Play-code is een gok |
| pl | Leapstone: Trylma | Trylma, chińskie warcaby | W (pl) | "Chińczyk" is in het Pools Ludo, dus niet gebruikt |
| pt-BR | Leapstone: Damas chinesas | Damas chinesas | W (pt) | |
| pt-PT | Leapstone: Damas chinesas | Damas chinesas | W (pt) | "telemóvel", "palavra-passe" |
| pa-IN | Leapstone: Chinese Checkers | ਚਾਈਨੀਜ਼ ਚੈਕਰਸ (zoekwoord) | E | transliteratie is G; Play-code `pa` is een gok |
| ro | Leapstone: Chinese Checkers | dame chinezești (zoekwoord) | E, G | lokale term is G |
| ru | Leapstone: Китайские шашки | Китайские шашки | W (ru) | Halma als Халма |
| sk | Leapstone: Čínska dáma | Čínska dáma | W (sk) | |
| sl-SI | Leapstone: Chinese Checkers | kitajske dame (zoekwoord) | E, G | lokale term is G; Play-code `sl` is een gok |
| sv | Leapstone: Kinaschack | Kinaschack | W (sv) | |
| ta-IN | Leapstone: Chinese Checkers | சைனீஸ் செக்கர்ஸ் (zoekwoord) | E | transliteratie is G |
| te-IN | Leapstone: Chinese Checkers | చైనీస్ చెకర్స్ (zoekwoord) | E | transliteratie is G |
| th | Leapstone: หมากฮอสจีน | หมากฮอสจีน | W (th) | |
| tr | Leapstone: Çin Daması | Çin Daması | G | geen Wikipedia-artikel; gangbare Turkse naam, niet gemeten |
| uk | Leapstone: Китайські шашки | Китайські шашки | W (uk) | Halma als Галма |
| ur-PK | Leapstone: Chinese Checkers | چائنیز چیکرز (zoekwoord) | E | transliteratie is G |
| vi | Leapstone: Cờ nhảy | Cờ nhảy | G | geen Wikipedia-artikel; "Cờ đam Trung Quốc" staat in de zoekwoorden |

## Beperkingen

- Niemand heeft de vertalingen nagelezen. Bij de Indiase talen, Thai, Hebreeuws, Arabisch en Urdu is de kans op stijl- of spelfouten het grootst.
- De Indiase talen (behalve Hindi) houden "Chinese Checkers" in de naam, omdat daar de Engelse naam gezocht wordt (bron A); de lokale taal zit in ondertitel, promotietekst, zoekwoorden en beschrijving.
- Alleen taalcodes voor App Store Connect zijn gecontroleerd tegen een publieke lijst (storetranslate.com/app-store-languages, 50 codes). Apple's eigen API-documentatie is niet zonder inloggen te lezen; als de API een code weigert (bijvoorbeeld `bn-BD`), sla die taal dan over of gebruik de code uit `GET appInfoLocalizations` van de app.
- Alleen de App Store is gelezen op 2026-11-08; de Play-codes en limieten (titel 30, kort 80) komen uit `teksten.md`.
