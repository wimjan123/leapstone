//! Opslag voor Spelers en Potjes, over een [`Db`].

use std::collections::HashMap;
use std::sync::Arc;

use halma_core::computer::{Level, Rng, choose_move};
use halma_core::{Game, MoveError, PlayerState};
use serde::{Deserialize, Serialize};

use crate::codes;
use crate::db::{Db, Rij};
use crate::klok::Klok;
use crate::woordfilter;
use crate::p;

pub const MIGRATIES: &[&str] = &[
    "CREATE TABLE speler (
        id INTEGER PRIMARY KEY,
        spelersnaam TEXT NOT NULL,
        sleutel_hash TEXT NOT NULL,
        herstel_hash TEXT NOT NULL UNIQUE,
        aangemaakt INTEGER NOT NULL DEFAULT (unixepoch())
    );
    CREATE INDEX speler_sleutel ON speler(sleutel_hash);
    CREATE TABLE potje (
        id INTEGER PRIMARY KEY,
        uitnodiging TEXT NOT NULL UNIQUE,
        bord TEXT NOT NULL,
        aantal_spelers INTEGER NOT NULL,
        aangemaakt INTEGER NOT NULL DEFAULT (unixepoch())
    );
    -- plek 0 is Speler 1 (de maker); plek loopt op met het meedoen.
    CREATE TABLE potje_speler (
        potje_id INTEGER NOT NULL REFERENCES potje(id),
        plek INTEGER NOT NULL,
        speler_id INTEGER NOT NULL REFERENCES speler(id),
        PRIMARY KEY (potje_id, plek),
        UNIQUE (potje_id, speler_id)
    );
    -- Voor de feature 'Online spelen': Zetten in volgorde, gecontroleerd door halma-core.
    CREATE TABLE zet (
        potje_id INTEGER NOT NULL REFERENCES potje(id),
        nummer INTEGER NOT NULL,
        speler_plek INTEGER NOT NULL,
        van INTEGER NOT NULL,
        naar INTEGER NOT NULL,
        PRIMARY KEY (potje_id, nummer)
    );",
    // Opgeven staat in dezelfde lijst als de Zetten: soort 'opgeven', van en naar zijn dan -1.
    "ALTER TABLE zet ADD COLUMN soort TEXT NOT NULL DEFAULT 'zet';",
    // Push-abonnementen voor Meldingen: één per toestel, dus per endpoint.
    "CREATE TABLE push_abonnement (
        id INTEGER PRIMARY KEY,
        speler_id INTEGER NOT NULL REFERENCES speler(id),
        endpoint TEXT NOT NULL UNIQUE,
        p256dh TEXT NOT NULL,
        auth TEXT NOT NULL
    );
    CREATE INDEX push_abonnement_speler ON push_abonnement(speler_id);",
    // Tijdstip van elke Zet, voor 'laatste activiteit' in Mijn potjes. Oude Zetten hebben geen tijd.
    "ALTER TABLE zet ADD COLUMN tijd INTEGER;
    CREATE INDEX potje_speler_speler ON potje_speler(speler_id);",
    // Berichten in de Chat van een Potje, in volgorde van versturen (id loopt op).
    "CREATE TABLE bericht (
        id INTEGER PRIMARY KEY,
        potje_id INTEGER NOT NULL REFERENCES potje(id),
        speler_id INTEGER NOT NULL REFERENCES speler(id),
        tekst TEXT NOT NULL,
        tijd INTEGER NOT NULL DEFAULT (unixepoch())
    );
    CREATE INDEX bericht_potje ON bericht(potje_id, id);",
    // Denktijd: seconden per Zet (leeg is geen limiet). `gestart_ms` is het moment dat het Potje vol werd,
    // `tijd_ms` het moment van elke Zet (ook een overgeslagen beurt), `afgelopen` zet de timer stil.
    "ALTER TABLE potje ADD COLUMN denktijd_s INTEGER;
    ALTER TABLE potje ADD COLUMN gestart_ms INTEGER;
    ALTER TABLE potje ADD COLUMN afgelopen INTEGER NOT NULL DEFAULT 0;
    ALTER TABLE zet ADD COLUMN tijd_ms INTEGER;",
    // Account verwijderen: de rij van de Speler blijft als lege huls ("Deleted player") zodat Potjes van anderen blijven kloppen.
    "ALTER TABLE speler ADD COLUMN verwijderd INTEGER NOT NULL DEFAULT 0;",
    // Rapporten en Blokkeren (taak 66). Een Rapport bewaart de tekst van het Bericht zoals die toen was.
    // `verborgen`: William verborg het Bericht voor iedereen. `geweerd`: de Speler mag geen Berichten
    // meer sturen en geen Potjes meer maken of meedoen.
    "CREATE TABLE rapport (
        id INTEGER PRIMARY KEY,
        melder_id INTEGER NOT NULL REFERENCES speler(id),
        speler_id INTEGER NOT NULL REFERENCES speler(id),
        potje_id INTEGER NOT NULL REFERENCES potje(id),
        bericht_id INTEGER,
        tekst TEXT,
        tijd INTEGER NOT NULL DEFAULT (unixepoch()),
        gesloten INTEGER NOT NULL DEFAULT 0
    );
    CREATE UNIQUE INDEX rapport_bericht ON rapport(melder_id, bericht_id) WHERE bericht_id IS NOT NULL;
    CREATE INDEX rapport_open ON rapport(gesloten, id);
    CREATE TABLE blokkade (
        speler_id INTEGER NOT NULL REFERENCES speler(id),
        geblokkeerd_id INTEGER NOT NULL REFERENCES speler(id),
        PRIMARY KEY (speler_id, geblokkeerd_id)
    );
    CREATE INDEX blokkade_geblokkeerd ON blokkade(geblokkeerd_id);
    ALTER TABLE bericht ADD COLUMN verborgen INTEGER NOT NULL DEFAULT 0;
    ALTER TABLE speler ADD COLUMN geweerd INTEGER NOT NULL DEFAULT 0;",
    // Meldingen in de iPhone-app (taak 35): het apparaattoken van Apple (APNs), één per toestel.
    // `omgeving`: 'sandbox' (testversie uit Xcode) of 'production' (TestFlight en App Store).
    "CREATE TABLE apns_token (
        id INTEGER PRIMARY KEY,
        speler_id INTEGER NOT NULL REFERENCES speler(id),
        token TEXT NOT NULL UNIQUE,
        omgeving TEXT NOT NULL
    );
    CREATE INDEX apns_token_speler ON apns_token(speler_id);",
    // Rapporten over een Speler (zonder Bericht) ontdubbeld (taak 81): ruim dubbelen op, hou het laagste id.
    "DELETE FROM rapport WHERE bericht_id IS NULL AND id NOT IN (
        SELECT MIN(id) FROM rapport WHERE bericht_id IS NULL GROUP BY melder_id, potje_id, speler_id
    );
    CREATE UNIQUE INDEX rapport_speler ON rapport(melder_id, potje_id, speler_id) WHERE bericht_id IS NULL;",
    // Precieze teller voor nieuwe Spelers en herstel (taak 85): één rij per toegelaten poging, met de hash
    // van het internetadres (nooit het adres zelf) en de tijd in milliseconden. Verlopen rijen worden opgeruimd.
    "CREATE TABLE aanvraag (
        adres_hash TEXT NOT NULL,
        tijd_ms INTEGER NOT NULL
    );
    CREATE INDEX aanvraag_adres ON aanvraag(adres_hash, tijd_ms);",
    // Computerspeler (taak 96): `speler.computer` is leeg voor een gewone Speler, anders het niveau (0, 1 of 2).
    // `potje.computer_zet_ms` is het moment waarop de Computerspeler zijn Zet doet; alleen gevuld als hij aan de beurt is.
    "ALTER TABLE speler ADD COLUMN computer INTEGER;
    ALTER TABLE potje ADD COLUMN computer_zet_ms INTEGER;",
    // Snel potje (taak 97): `potje.snel` is 1 voor een Potje van "Play online". `zoek_tot_ms` is het moment waarop
    // een Computerspeler de lege plek vult; alleen gevuld zolang het Potje op een tegenstander wacht.
    "ALTER TABLE potje ADD COLUMN snel INTEGER NOT NULL DEFAULT 0;
    ALTER TABLE potje ADD COLUMN zoek_tot_ms INTEGER;",
    // Rating (taak 98): elke Speler (ook een Computerspeler) heeft een Rating. `rating_wijziging` bewaart per afgelopen
    // Snel potje en Speler de Rating voor en na, zodat de app de verandering kan tonen en niets dubbel telt.
    "ALTER TABLE speler ADD COLUMN rating INTEGER NOT NULL DEFAULT 1000;
    CREATE TABLE rating_wijziging (
        potje_id INTEGER NOT NULL REFERENCES potje(id),
        speler_id INTEGER NOT NULL REFERENCES speler(id),
        voor INTEGER NOT NULL,
        na INTEGER NOT NULL,
        PRIMARY KEY (potje_id, speler_id)
    );",
    // Taal van de Speler (taak 128): de app stuurt de gekozen taal mee; de server gebruikt hem voor Meldingen en
    // foutmeldingen. Leeg is Engels. Alleen een taalcode (zoals `nl`), niets anders.
    "ALTER TABLE speler ADD COLUMN taal TEXT;",
    // Vriendenlijst (taak 161): elke Speler heeft een vaste Vriendcode van acht cijfers (willekeurig, uniek, zonder
    // naam erin). Bestaande Spelers krijgen hem bij het openen van de opslag (`geef_ontbrekende_vriendcodes`).
    // `vriend`: één rij per richting (de Speler heeft de ander in zijn lijst); `laatst_ms` is het moment van het
    // laatste Potje via een Uitnodiging samen.
    "ALTER TABLE speler ADD COLUMN vriendcode TEXT;
    CREATE UNIQUE INDEX speler_vriendcode ON speler(vriendcode);
    CREATE TABLE vriend (
        speler_id INTEGER NOT NULL REFERENCES speler(id),
        vriend_id INTEGER NOT NULL REFERENCES speler(id),
        laatst_ms INTEGER NOT NULL,
        PRIMARY KEY (speler_id, vriend_id)
    );
    CREATE INDEX vriend_vriend ON vriend(vriend_id);
    -- Eerdere Potjes via een Uitnodiging (geen Snel potje) vullen de lijst meteen, zonder Computerspelers,
    -- verwijderde of geblokkeerde Spelers; `laatst_ms` is het begin van het laatste Potje samen.
    INSERT INTO vriend (speler_id, vriend_id, laatst_ms)
    SELECT a.speler_id, b.speler_id, MAX(p.aangemaakt) * 1000
    FROM potje p
    JOIN potje_speler a ON a.potje_id = p.id
    JOIN potje_speler b ON b.potje_id = p.id AND b.speler_id <> a.speler_id
    JOIN speler sa ON sa.id = a.speler_id
    JOIN speler sb ON sb.id = b.speler_id
    WHERE p.snel = 0 AND sa.computer IS NULL AND sb.computer IS NULL AND sa.verwijderd = 0 AND sb.verwijderd = 0
      AND NOT EXISTS (SELECT 1 FROM blokkade k WHERE (k.speler_id = a.speler_id AND k.geblokkeerd_id = b.speler_id)
                                                 OR (k.speler_id = b.speler_id AND k.geblokkeerd_id = a.speler_id))
    GROUP BY a.speler_id, b.speler_id;",
    // Vriendverzoek (taak 162): `van_id` vroeg `naar_id` om vrienden te worden. Het verzoek blijft staan tot `naar_id`
    // kiest. Weigeren zet `geweigerd` op 1: `van_id` merkt niets (geen melding, zelfde antwoord) en `naar_id` ziet het
    // verzoek niet meer, ook niet als `van_id` het nog eens stuurt.
    "CREATE TABLE vriendverzoek (
        van_id INTEGER NOT NULL REFERENCES speler(id),
        naar_id INTEGER NOT NULL REFERENCES speler(id),
        tijd_ms INTEGER NOT NULL,
        geweigerd INTEGER NOT NULL DEFAULT 0,
        PRIMARY KEY (van_id, naar_id)
    );
    CREATE INDEX vriendverzoek_naar ON vriendverzoek(naar_id);",
    // Uitdaging (taak 163): `van_id` daagt zijn vriend `naar_id` uit voor een live Potje. `status` is `open`, `accepted` of
    // `declined`; een open Uitdaging vervalt na `UITDAGING_GELDIG_MS` (dat volgt uit `tijd_ms` en de klok, er is geen
    // timer). `potje_id` is het Potje dat Accept maakte.
    "CREATE TABLE uitdaging (
        id INTEGER PRIMARY KEY,
        van_id INTEGER NOT NULL REFERENCES speler(id),
        naar_id INTEGER NOT NULL REFERENCES speler(id),
        bord TEXT NOT NULL,
        denktijd_s INTEGER,
        tijd_ms INTEGER NOT NULL,
        status TEXT NOT NULL DEFAULT 'open',
        potje_id INTEGER REFERENCES potje(id)
    );
    CREATE INDEX uitdaging_van ON uitdaging(van_id, naar_id);
    CREATE INDEX uitdaging_naar ON uitdaging(naar_id);",
    // Twee tot vijf vrienden tegelijk uitdagen (taak 164): elke vriend houdt zijn eigen rij; de rijen van één Uitdaging delen
    // `groep` (het id van de eerste rij, ook bij één vriend) en `aantal` (het aantal Spelers van het Potje, de uitdager mee).
    // `potje_id` komt op alle rijen van de groep te staan zodra het Potje begint.
    "ALTER TABLE uitdaging ADD COLUMN groep INTEGER;
    ALTER TABLE uitdaging ADD COLUMN aantal INTEGER NOT NULL DEFAULT 2;
    UPDATE uitdaging SET groep = id;
    CREATE INDEX uitdaging_groep ON uitdaging(groep);",
    // Dagen waarop een Speler de Dagelijkse puzzel oploste (taak 175, besluit vraag #176): alleen de datum (jjjj-mm-dd,
    // de dag op het toestel van de Speler), geen Zetten of tijden. Daaruit rekent `prestaties` de Reeks van zeven.
    "CREATE TABLE puzzeldag (
        speler_id INTEGER NOT NULL REFERENCES speler(id),
        datum TEXT NOT NULL,
        PRIMARY KEY (speler_id, datum)
    );",
    // Test-Spelers (taak 273, feature 272): een Speler met `test = 1` telt niet mee op de beheerpagina. Alleen deze vlag; William zet hem
    // met de knop Test op `/beheer`, de app zet hem bij een Speler die een test maakt (`POST /api/spelers` met `"test": true`).
    "ALTER TABLE speler ADD COLUMN test INTEGER NOT NULL DEFAULT 0;",
    // Grenzen tegen overbelasting (taak 282). `bewaarde_stand` is de stand na Zet `bewaarde_nummer` (zie `Game::snapshot`), zodat
    // een verzoek niet de hele Zet-geschiedenis opnieuw afspeelt. `zet.sprongen` is het aantal Sprongen van die Zet (0 bij een stap
    // of een andere soort), voor Statistieken en Prestaties. Oude Potjes vullen beide de eerste keer dat ze worden afgespeeld.
    "ALTER TABLE potje ADD COLUMN bewaarde_stand TEXT;
    ALTER TABLE potje ADD COLUMN bewaarde_nummer INTEGER;
    ALTER TABLE zet ADD COLUMN sprongen INTEGER;
    CREATE INDEX rapport_melder ON rapport(melder_id, gesloten);",
];

/// De Rating waarmee elke Speler begint.
pub const RATING_START: i64 = 1000;
/// Elo-factor: zoveel punten verandert een Rating hooguit bij één Potje tegen één gelijke tegenstander
/// (winst op een gelijke levert 16 punten op). Bij meer Spelers wordt dit over de paren verdeeld.
const RATING_K: f64 = 32.0;
/// De Rating kan niet onder dit getal zakken.
const RATING_MIN: i64 = 100;
/// Een Computerspeler met een Rating binnen zoveel punten van de wachtende Speler is dichtbij genoeg;
/// anders komt er een nieuwe Computerspeler bij die beter past.
const COMPUTER_MAX_VERSCHIL: i64 = 100;

/// Een Snel potje: Sterbord, 2 Spelers, vaste Denktijd.
pub const SNEL_BORD: &str = "ster";
pub const SNEL_AANTAL: u32 = 2;
/// Een Snel potje met meer Spelers ("4 or 6 players"): het snelst gevuld is 4, en 4 Computerspelers-plekken kosten het minst CPU.
pub const SNEL_MEER_AANTAL: u32 = 4;
/// Computerspelers in een Snel potje met meer dan 2 Spelers spelen hooguit op dit niveau (normaal): moeilijk kost bij
/// 6 Spelers tot 3,9 ms per Zet, te dicht bij de 10 ms CPU per alarm van het gratis plan.
pub const COMPUTER_MAX_NIVEAU_MEER: u32 = 1;
pub const SNEL_DENKTIJD_S: i64 = 30;
/// Zo lang wacht een Speler op een tegenstander voordat een Computerspeler de plek vult.
pub const SNEL_ZOEKTIJD_MS: i64 = 20_000;

/// Het niveau van de Computerspelers in online Potjes: 0 makkelijk, 1 normaal, 2 moeilijk (zie `halma_core::computer`).
pub const COMPUTER_NIVEAU: u32 = 1;

/// Hoe lang een Computerspeler "nadenkt" voordat zijn Zet komt: een vaste basis plus een spreiding per Zet,
/// in milliseconden. Met een Denktijd is de wachttijd hooguit de helft daarvan.
const COMPUTER_WACHT_MS: i64 = 2_500;
const COMPUTER_SPREIDING_MS: i64 = 4_000;

/// Zoveel Zetten van Computerspelers doet één ronde van [`Opslag::sla_verlopen_beurten_over`] hooguit.
/// Zo blijft het rekenwerk van één alarm van het Durable Object klein; de rest volgt direct in het volgende alarm.
pub const MAX_COMPUTERZETTEN_PER_RONDE: usize = 2;

/// Gewone Spelersnamen voor Computerspelers. Anderen zien geen verschil met een Speler.
pub const COMPUTER_NAMEN: [&str; 32] = [
    "Maya", "Noah", "Liam", "Emma", "Lucas", "Olivia", "Mason", "Sofia", "Ethan", "Isla", "Jack", "Chloe", "Leo", "Nora",
    "Finn", "Ruby", "Max", "Zoe", "Sam", "Ella", "Tom", "Lily", "Ben", "Anna", "Jay", "Mia", "Eli", "Eva", "Dan", "Lena",
    "Theo", "Iris",
];

/// Zoveel nieuwe Spelers en herstelpogingen mag één internetadres per [`AANVRAAG_PERIODE_MS`].
pub const MAX_AANVRAGEN: i64 = 5;
/// De periode van de precieze teller, in milliseconden.
pub const AANVRAAG_PERIODE_MS: i64 = 60_000;
/// De gedeelde sleutel als het internetadres ontbreekt.
const ONBEKEND_ADRES: &str = "onbekend";

/// De naam die anderen zien bij een Speler die zijn account verwijderde.
pub const VERWIJDERDE_SPELER: &str = "Deleted player";

/// Grenzen tegen overbelasting (taak 282). Ruim gekozen: een gewone Speler komt er niet aan. Reden: `docs/plan.md`, "Techniek".
/// Zoveel open Potjes die hij zelf startte mag een Speler hebben (Snel potjes tellen niet mee).
pub const MAX_OPEN_POTJES: u32 = 100;
/// Zoveel meldingsadressen per soort (web push of APNs) bewaart een Speler; een nieuw adres duwt het oudste eruit.
pub const MAX_MELDINGSADRESSEN: i64 = 10;
/// Zoveel Berichten bewaart een Potje; een nieuw Bericht duwt het oudste eruit.
pub const MAX_BERICHTEN_PER_POTJE: i64 = 500;
/// Zoveel open Rapporten mag één Speler hebben; een Rapport daarboven wordt niet bewaard.
pub const MAX_OPEN_RAPPORTEN_PER_MELDER: i64 = 50;
/// Zoveel open Rapporten toont de beheerpagina tegelijk, het nieuwste eerst.
pub const MAX_RAPPORTEN_OP_PAGINA: i64 = 100;

/// Na zoveel gemiste beurten op rij geeft een Speler vanzelf op.
const MAX_GEMISTE_BEURTEN: u32 = 3;

/// Het aantal open Potjes met Denktijd (nog niet afgelopen) dat een Speler zelf startte, hooguit.
const MAX_OPEN_DENKTIJD_POTJES: u32 = 10;

/// De toegestane denktijden in seconden. Geen denktijd is ook toegestaan.
pub const DENKTIJDEN: [u32; 4] = [15, 30, 60, 120];

/// Zo lang staat een Uitdaging open zonder antwoord: 5 minuten. Daarna ziet de uitdager "Not now".
pub const UITDAGING_GELDIG_MS: i64 = 5 * 60 * 1000;
/// Een Uitdaging blijft zo lang in de opslag (voor de uitdager die nog kijkt), dan wordt ze opgeruimd.
const UITDAGING_BEWAAR_MS: i64 = 24 * 60 * 60 * 1000;
/// Zo lang kan de uitdager van een Uitdaging aan meer vrienden nog kiezen nadat iemand nee zei of de 5 minuten om zijn: een uur.
/// Daarna sluit de Uitdaging voor iedereen, ook voor wie al accepteerde.
pub const UITDAGING_KEUZE_MS: i64 = 60 * 60 * 1000;
/// Hoeveel vrienden je tegelijk uitdaagt: een tot vijf (een Potje van twee tot zes Spelers).
const UITDAGING_MAX_VRIENDEN: usize = 5;

/// Het langste Bericht, in tekens.
pub const MAX_BERICHT: usize = 300;

/// De Vaste zinnen: het enige wat een Speler in een Snel potje mag sturen. Eén lijst, hier; de app haalt
/// hem op met `GET /api/vaste-zinnen`, zodat server en app het altijd eens zijn.
pub const VASTE_ZINNEN: [&str; 8] =
    ["Hi!", "Good luck", "Good game", "Nice jump!", "Well played", "Oops", "Thanks", "See you next time"];

/// Eén Bericht in de Chat van een Potje. Dit is ook het `bericht`-event op de live verbinding.
#[derive(Debug, Serialize, Clone, PartialEq)]
pub struct Bericht {
    pub id: i64,
    /// Plek van de Speler die het stuurde, vanaf 1.
    pub plek: u32,
    /// De Speler die het stuurde (om te Blokkeren of te rapporteren).
    pub speler_id: i64,
    pub spelersnaam: String,
    pub tekst: String,
    /// Seconden sinds 1970.
    pub tijd: i64,
}

#[derive(Debug, PartialEq)]
pub enum Fout {
    Ongeldig(&'static str),
    NietIngelogd,
    Onbekend(&'static str),
    Vol,
    /// De Speler doet niet mee aan dit Potje.
    Verboden(&'static str),
    /// Kan nu niet: niet aan de beurt, nog niet gestart of al afgelopen.
    Conflict(&'static str),
    Intern(String),
}

impl Fout {
    /// De HTTP-status en de Engelse tekst voor de Speler.
    pub fn antwoord(&self) -> (u16, String) {
        self.antwoord_in(None)
    }

    /// De HTTP-status en de tekst in de taal van de Speler (`None` of `en`: Engels; een taal zonder
    /// vertaling van deze zin: Engels).
    pub fn antwoord_in(&self, taal: Option<&str>) -> (u16, String) {
        let (status, engels) = self.engels();
        (status, crate::taal::vertaal_fout(taal, &engels))
    }

    fn engels(&self) -> (u16, String) {
        match self {
            Fout::Ongeldig(t) => (400, t.to_string()),
            Fout::NietIngelogd => (401, "Unknown key. Choose your player name again.".into()),
            Fout::Onbekend(t) => (404, t.to_string()),
            Fout::Vol => (409, "This game is full".into()),
            Fout::Verboden(t) => (403, t.to_string()),
            Fout::Conflict(t) => (409, t.to_string()),
            Fout::Intern(_) => (500, "Something went wrong on the server".into()),
        }
    }
}

/// Een push-abonnement van één toestel, zoals de browser het geeft.
#[derive(Debug, Clone, Deserialize, PartialEq)]
pub struct Abonnement {
    pub endpoint: String,
    pub keys: Sleutels,
}

#[derive(Debug, Clone, Deserialize, PartialEq)]
pub struct Sleutels {
    pub p256dh: String,
    pub auth: String,
}

/// De APNs-omgeving van een toestel. Een token werkt alleen in zijn eigen omgeving.
#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "lowercase")]
pub enum ApnsOmgeving {
    /// Testversie, getekend voor ontwikkeling (`aps-environment` development).
    Sandbox,
    /// TestFlight en App Store.
    Production,
}

impl ApnsOmgeving {
    pub fn naam(self) -> &'static str {
        match self {
            ApnsOmgeving::Sandbox => "sandbox",
            ApnsOmgeving::Production => "production",
        }
    }

    fn van_naam(naam: &str) -> Result<Self, Fout> {
        match naam {
            "sandbox" => Ok(ApnsOmgeving::Sandbox),
            "production" => Ok(ApnsOmgeving::Production),
            n => Err(Fout::Intern(format!("onbekende APNs-omgeving {n}"))),
        }
    }
}

/// Het apparaattoken van de iPhone-app voor Meldingen via Apple (APNs).
#[derive(Debug, Clone, Deserialize, PartialEq)]
pub struct ApnsToken {
    /// Hexadecimaal, zoals iOS het geeft.
    pub token: String,
    pub omgeving: ApnsOmgeving,
}

impl ApnsToken {
    /// Een token is 32 tot 100 bytes, als hexadecimale tekst. Geeft het token in kleine letters.
    pub fn controleer(&self) -> Result<String, Fout> {
        let t = self.token.trim().to_ascii_lowercase();
        if t.len() < 64 || t.len() > 200 || t.len() % 2 != 0 || !t.bytes().all(|b| b.is_ascii_hexdigit()) {
            return Err(Fout::Ongeldig("The device token is not valid"));
        }
        Ok(t)
    }
}

#[derive(Debug, Serialize, Clone)]
pub struct NieuweSpeler {
    pub speler_id: i64,
    pub spelersnaam: String,
    pub sleutel: String,
    pub herstelcode: String,
}

#[derive(Debug, Serialize, Clone, PartialEq)]
pub struct PotjeSpeler {
    /// Spelernummer in het Potje, vanaf 1.
    pub plek: u32,
    pub speler_id: i64,
    pub spelersnaam: String,
    /// Het niveau als dit een Computerspeler is. Staat niet in de JSON: anderen zien geen verschil.
    #[serde(skip)]
    pub computer: Option<u32>,
    /// De Rating van de Speler. Alleen in een Snel potje; anders niet in de JSON.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub rating: Option<i64>,
}

/// De Rating van een Speler voor en na een afgelopen Snel potje.
#[derive(Debug, Serialize, Clone, Copy, PartialEq)]
pub struct RatingVerandering {
    pub voor: i64,
    pub na: i64,
}

#[derive(Debug, Serialize, Clone, PartialEq)]
pub struct PotjeInfo {
    pub potje_id: i64,
    pub uitnodiging: String,
    pub bord: String,
    pub aantal_spelers: u32,
    pub spelers: Vec<PotjeSpeler>,
    pub vol: bool,
    /// Maximale denktijd per Zet in seconden; leeg is geen limiet.
    pub denktijd_s: Option<u32>,
    /// Een Snel potje (Play online): zonder Uitnodiging om te delen.
    pub snel: bool,
    #[serde(skip)]
    gestart_ms: Option<i64>,
    #[serde(skip)]
    zoek_tot_ms: Option<i64>,
}

#[derive(Debug, Serialize, Clone, PartialEq)]
pub struct StandSpeler {
    #[serde(flatten)]
    pub speler: PotjeSpeler,
    /// "speelt", "klaar" (alle stenen in de doelpunt) of "opgegeven".
    pub status: &'static str,
    /// Alleen na afloop van een Snel potje: de Rating van deze Speler voor en na het Potje.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub rating_verandering: Option<RatingVerandering>,
}

#[derive(Debug, Serialize, Clone, PartialEq)]
pub struct LaatsteZet {
    pub nummer: u32,
    /// Plek van de Speler, vanaf 1.
    pub plek: u32,
    /// "zet", "opgeven" of "overgeslagen" (denktijd op); bij opgeven en overgeslagen zijn `van` en `naar` leeg.
    pub soort: &'static str,
    pub van: Option<u32>,
    pub naar: Option<u32>,
}

/// De stand van een online Potje. Dit is ook het bericht op de live verbinding.
#[derive(Debug, Serialize, Clone, PartialEq)]
pub struct Stand {
    pub potje_id: i64,
    pub uitnodiging: String,
    pub bord: String,
    pub aantal_spelers: u32,
    pub spelers: Vec<StandSpeler>,
    /// Het Potje is vol en dus begonnen.
    pub gestart: bool,
    /// Aantal bewaarde Zetten en opgaven. Loopt per wijziging met 1 op.
    pub versie: u32,
    /// Per vak: 0 is leeg, anders de plek (vanaf 1) van de Speler met de steen.
    pub stand: Vec<u32>,
    /// Plek van de Speler aan de beurt; leeg als het Potje niet loopt.
    pub aan_de_beurt: Option<u32>,
    pub laatste_zet: Option<LaatsteZet>,
    pub afgelopen: bool,
    pub winnaar: Option<u32>,
    /// Plekken in volgorde van winst.
    pub ranglijst: Vec<u32>,
    /// Maximale denktijd per Zet in seconden; leeg is geen limiet.
    pub denktijd_s: Option<u32>,
    /// Tijdstip (milliseconden sinds 1970) waarop de huidige beurt afloopt.
    /// Leeg zonder limiet, voor de start en na het einde.
    pub deadline_ms: Option<i64>,
    /// De tijd van de server nu (milliseconden sinds 1970), om het klokverschil van de app te corrigeren.
    pub server_tijd_ms: i64,
    /// Een Snel potje (Play online). Dit Potje heeft geen Uitnodiging; de Chat kent alleen Vaste zinnen.
    pub snel: bool,
    /// Tot wanneer (ms sinds 1970, klok van de server) het Potje op een tegenstander wacht; leeg zodra het vol is.
    pub zoek_tot_ms: Option<i64>,
}

/// Eén Potje in de lijst Mijn potjes.
#[derive(Debug, Serialize, Clone, PartialEq)]
pub struct MijnPotje {
    pub potje_id: i64,
    pub uitnodiging: String,
    pub bord: String,
    pub aantal_spelers: u32,
    pub spelers: Vec<PotjeSpeler>,
    pub gestart: bool,
    /// Plek van de Speler aan de beurt; leeg als het Potje niet loopt.
    pub aan_de_beurt: Option<u32>,
    /// De plek (vanaf 1) van de Speler die dit vraagt.
    pub jouw_plek: u32,
    pub afgelopen: bool,
    pub winnaar: Option<u32>,
    /// Denktijd per Zet in seconden; leeg zonder limiet.
    pub denktijd_s: Option<u32>,
    /// Tijdstip (seconden sinds 1970) van de laatste Zet, of van het maken van het Potje.
    pub laatste_activiteit: i64,
    /// Een Snel potje (Play online).
    pub snel: bool,
}

/// Eén regel van de Ranglijst.
#[derive(Debug, Serialize, Clone, PartialEq)]
pub struct RanglijstRij {
    pub speler_id: i64,
    pub spelersnaam: String,
    /// Afgelopen online Potjes waar de Speler in zat, ook als de Speler opgaf.
    pub gespeeld: u32,
    /// Afgelopen online Potjes waarvan de Speler de winnaar is.
    pub gewonnen: u32,
    /// De Rating van de Speler (start 1000, verandert alleen door Snel potjes).
    pub rating: i64,
}

/// Een Record: het Potje waarin het gehaald is en de Spelersnamen van de tegenstanders.
/// Niets in deze JSON verraadt een Computerspeler.
#[derive(Debug, Serialize, Clone, PartialEq)]
pub struct StatistiekRecord {
    pub potje_id: i64,
    /// Het aantal Sprongen (langste Sprong) of eigen Zetten (snelste overwinning).
    pub waarde: u32,
    pub tegenstanders: Vec<String>,
}

/// De Statistieken van één Speler: alleen afgelopen online Potjes (met vrienden en Snel potje).
#[derive(Debug, Serialize, Clone, PartialEq)]
pub struct Statistieken {
    pub gespeeld: u32,
    /// Alleen de eerste plek telt als gewonnen.
    pub gewonnen: u32,
    /// Alle andere afgelopen Potjes, ook als de Speler opgaf.
    pub verloren: u32,
    /// Het deel gewonnen (0 tot 1); leeg zonder afgelopen Potjes.
    pub deel_gewonnen: Option<f64>,
    /// De gemiddelde plek (1 is de eerste); leeg zonder afgelopen Potjes.
    pub gemiddelde_plek: Option<f64>,
    /// De Rating na elk van de laatste 50 Potjes met een Ratingwijziging, het oudste eerst.
    pub rating_verloop: Vec<i64>,
    /// De meeste Sprongen in één Zet.
    pub langste_sprong: Option<StatistiekRecord>,
    /// De minste eigen Zetten in een Potje dat de Speler won door alle stenen in de doelpunt te zetten.
    pub snelste_overwinning: Option<StatistiekRecord>,
}

/// De tien Prestaties, in de volgorde van de lijst in My stats. De laatste twee komen uit latere taken.
pub const PRESTATIES: [&str; 10] = [
    "first_win",
    "wins_10",
    "wins_50",
    "wins_100",
    "jumps_6",
    "jumps_10",
    "square_win",
    "six_players_win",
    "puzzle_streak_7",
    "five_friends",
];

/// Eén Prestatie van de Speler: `behaald_ms` is het moment (ms sinds 1970) van het Potje waarin ze gehaald is,
/// leeg als de Speler haar nog niet heeft.
#[derive(Debug, Serialize, Clone, PartialEq)]
pub struct Prestatie {
    pub id: &'static str,
    pub behaald_ms: Option<i64>,
}

/// Zoveel Potjes telt de Ratinglijn in Statistieken.
const STATISTIEKEN_RATING_PUNTEN: usize = 50;

/// Een Speler die jij blokkeerde, voor de lijst in Account.
#[derive(Debug, Serialize, Clone, PartialEq)]
pub struct GeblokkeerdeSpeler {
    pub speler_id: i64,
    pub spelersnaam: String,
}

/// Eén vriend in de Vriendenlijst.
#[derive(Debug, Serialize, Clone, PartialEq)]
pub struct Vriend {
    pub speler_id: i64,
    pub spelersnaam: String,
    pub rating: i64,
    /// Het moment (ms sinds 1970) van het laatste Potje via een Uitnodiging samen.
    pub laatst_ms: i64,
}

/// De Vriendenlijst van een Speler: de eigen Vriendcode (acht cijfers) en de vrienden, de laatst gespeelde eerst.
#[derive(Debug, Serialize, Clone, PartialEq)]
pub struct Vriendenlijst {
    pub vriendcode: String,
    pub vrienden: Vec<Vriend>,
    /// De Vriendverzoeken die op jouw keuze wachten, de oudste eerst.
    pub verzoeken: Vec<Vriendverzoek>,
    /// De Uitdagingen aan jou die op Accept of Decline wachten, de oudste eerst.
    pub uitdagingen: Vec<Uitdaging>,
    /// De Uitdagingen van jou die nog openstaan: je kunt die vriend niet nog eens uitdagen.
    pub uitgedaagd: Vec<Uitdaging>,
}

/// Een open Uitdaging. `speler_id` en `spelersnaam` zijn die van de ander: de uitdager in `uitdagingen`, de
/// uitgedaagde vriend in `uitgedaagd`.
#[derive(Debug, Serialize, Clone, PartialEq)]
pub struct Uitdaging {
    pub id: i64,
    pub speler_id: i64,
    pub spelersnaam: String,
    pub bord: String,
    /// Denktijd per Zet in seconden; leeg is geen limiet.
    pub denktijd_s: Option<u32>,
    /// Het moment (ms sinds 1970) waarop de Uitdaging vervalt.
    pub verloopt_ms: i64,
    /// Het aantal Spelers van het Potje, de uitdager mee: 2 bij één vriend, tot 6 bij meer vrienden.
    pub aantal_spelers: u32,
    /// Het id van de hele Uitdaging (bij één vriend gelijk aan `id`): daarmee volgt de uitdager haar in [`Opslag::uitdaging_stand`].
    pub groep: i64,
    /// Het antwoord van deze vriend: `open`, `accepted` of `declined` (nee, of 5 minuten zonder antwoord). Alleen bij
    /// `uitgedaagd`; in `uitdagingen` staat alleen wat nog `open` is.
    pub antwoord: &'static str,
}

/// Wat er gebeurde na een Uitdaging. `id` is het id van de Uitdaging (bij meer vrienden van de hele groep).
#[derive(Debug, Serialize, Clone, PartialEq)]
pub struct UitdagingUitkomst {
    pub id: i64,
    /// De Spelersnaam van de vriend, of de namen van de vrienden gescheiden door een komma.
    pub spelersnaam: String,
    pub verloopt_ms: i64,
    /// Wie de Uitdaging kreeg, voor de Meldingen.
    #[serde(skip)]
    pub aan: Vec<i64>,
    /// De Spelersnaam van de uitdager, voor de Melding.
    #[serde(skip)]
    pub van_naam: String,
}

/// Waar een Uitdaging nu staat, voor de uitdager.
#[derive(Debug, Serialize, Clone, PartialEq)]
pub struct UitdagingStand {
    /// `open`, `accepted`, `declined`, `expired` of (alleen bij meer vrienden) `choice`: iemand zei nee of de 5 minuten zijn om
    /// en de uitdager kiest. De app toont bij `declined` en `expired` allebei "Not now". Voor een uitgedaagde vriend is
    /// `open` ook: hij accepteerde en wacht op de anderen.
    pub status: &'static str,
    /// Het Potje, zodra het begon.
    pub potje: Option<PotjeInfo>,
    /// Het aantal Spelers dat de Uitdaging vraagt, de uitdager mee.
    pub aantal_spelers: u32,
    /// Wie al accepteerde (alleen voor de uitdager, bij meer vrienden).
    pub geaccepteerd: Vec<String>,
    /// Hoeveel vrienden nee zeiden of niet op tijd antwoordden.
    pub geweigerd: u32,
    /// Hoeveel vrienden nog moeten antwoorden.
    pub wachtend: u32,
    /// Bij `choice`: kent het bord het aantal Spelers van wie al accepteerde? Dan kan de uitdager daarmee beginnen.
    pub kan_beginnen: bool,
}

/// Wat de uitdager kiest na een Decline of na 5 minuten: beginnen met wie accepteerde, of de lege plekken met Computerspelers vullen.
#[derive(Debug, Clone, Copy, PartialEq, Eq, serde::Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum UitdagingKeuze {
    /// Beginnen met de Spelers die accepteerden (als het bord dat aantal kent).
    Beginnen,
    /// De lege plekken vullen met Computerspelers.
    Computer,
}

/// Een Vriendverzoek aan deze Speler: wie het stuurde en wanneer.
#[derive(Debug, Serialize, Clone, PartialEq)]
pub struct Vriendverzoek {
    pub speler_id: i64,
    pub spelersnaam: String,
    pub tijd_ms: i64,
}

/// De Speler achter een Vriendcode, zoals de app hem toont voor je een Vriendverzoek stuurt.
#[derive(Debug, Serialize, Clone, PartialEq)]
pub struct VriendKandidaat {
    pub spelersnaam: String,
    /// Staat al in jouw Vriendenlijst.
    pub vrienden: bool,
}

/// Wat er gebeurde na een Vriendverzoek.
#[derive(Debug, Serialize, Clone, PartialEq)]
pub struct VerzoekUitkomst {
    pub spelersnaam: String,
    /// Jullie staan nu in elkaars Vriendenlijst (de ander vroeg jou ook al, of jullie waren het al).
    pub vrienden: bool,
    /// Naar wie het Vriendverzoek ging.
    #[serde(skip)]
    pub aan: i64,
    /// Is er een nieuw Vriendverzoek, dus moet de ander een Melding krijgen?
    #[serde(skip)]
    pub melding: bool,
    /// De Spelersnaam van de aanvrager, voor de Melding.
    #[serde(skip)]
    pub van_naam: String,
}

/// Wat een Speler rapporteert: een Bericht, of een Speler (zonder Bericht).
#[derive(Debug, Deserialize, Clone, Copy, PartialEq)]
pub struct NieuwRapport {
    #[serde(default)]
    pub bericht_id: Option<i64>,
    #[serde(default)]
    pub speler_id: Option<i64>,
}

/// Een open Rapport op de beheerpagina.
#[derive(Debug, Serialize, Clone, PartialEq)]
pub struct RapportRegel {
    pub id: i64,
    pub potje_id: i64,
    /// Seconden sinds 1970.
    pub tijd: i64,
    pub melder: String,
    pub speler_id: i64,
    pub spelersnaam: String,
    /// De tekst van het Bericht zoals die was toen het werd gerapporteerd; leeg bij een Rapport over een Speler.
    pub tekst: Option<String>,
    pub bericht_id: Option<i64>,
    pub bericht_verborgen: bool,
    pub speler_geweerd: bool,
}

/// Alle regels rond Spelers, Potjes, Zetten en Berichten, over een databank `D`.
pub struct Opslag<D: Db> {
    pub(crate) db: D,
    klok: Arc<dyn Klok>,
}

impl<D: Db> Opslag<D> {
    /// Opent de opslag en voert de migraties uit die nog niet gedaan zijn.
    pub fn nieuw(db: D, klok: Arc<dyn Klok>) -> Result<Self, Fout> {
        let versie = db.schema_versie()?;
        for (i, sql) in MIGRATIES.iter().enumerate().skip(versie as usize) {
            db.transactie(|| {
                db.script(sql)?;
                db.zet_schema_versie((i + 1) as i64)
            })?;
        }
        let mut o = Opslag { db, klok };
        o.geef_ontbrekende_vriendcodes()?;
        Ok(o)
    }

    pub fn nu_ms(&self) -> i64 {
        self.klok.nu_ms()
    }

    /// Vervangt de klok (voor tests).
    pub fn zet_klok(&mut self, klok: Arc<dyn Klok>) {
        self.klok = klok;
    }

    /// Telt een nieuwe Speler of herstelpoging van dit internetadres en zegt of die nog mag: hooguit
    /// [`MAX_AANVRAGEN`] per [`AANVRAAG_PERIODE_MS`], samen voor beide routes. Zonder adres telt de
    /// gedeelde sleutel "onbekend". Alleen de hash van het adres wordt bewaard. Een geweigerde poging
    /// wordt niet bewaard, dus de tabel groeit niet door aanvallers; verlopen rijen worden opgeruimd.
    pub fn tel_aanvraag(&mut self, adres: Option<&str>) -> Result<bool, Fout> {
        let adres = adres.filter(|a| !a.is_empty()).unwrap_or(ONBEKEND_ADRES);
        let sleutel = codes::hash(adres);
        let nu = self.klok.nu_ms();
        let grens = nu - AANVRAAG_PERIODE_MS;
        self.db.transactie(|| {
            self.db.voer_uit("DELETE FROM aanvraag WHERE tijd_ms <= ?1", p![grens])?;
            let aantal = self
                .db
                .rij("SELECT COUNT(*) FROM aanvraag WHERE adres_hash = ?1", p![&sleutel])?
                .map_or(Ok(0), |r| r.i64(0))?;
            if aantal >= MAX_AANVRAGEN {
                return Ok(false);
            }
            self.db.voer_uit("INSERT INTO aanvraag (adres_hash, tijd_ms) VALUES (?1, ?2)", p![&sleutel, nu])?;
            Ok(true)
        })
    }

    pub fn maak_speler(&mut self, spelersnaam: &str) -> Result<NieuweSpeler, Fout> {
        self.maak_speler_als(spelersnaam, false)
    }

    /// Maakt een Speler; met `test` een Test-Speler, die niet meetelt op de beheerpagina.
    pub fn maak_speler_als(&mut self, spelersnaam: &str, test: bool) -> Result<NieuweSpeler, Fout> {
        let naam = schoon_naam(spelersnaam)?;
        let sleutel = codes::nieuwe_sleutel();
        let herstelcode = codes::nieuwe_herstelcode();
        let vriendcode = vrije_vriendcode(&self.db)?;
        let speler_id = nieuw_id(&self.db.rijen(
            // `aangemaakt` komt uit de klok, niet uit `unixepoch()`: de tellers per week rekenen met dezelfde klok.
            "INSERT INTO speler (spelersnaam, sleutel_hash, herstel_hash, vriendcode, test, aangemaakt) VALUES (?1, ?2, ?3, ?4, ?5, ?6) RETURNING id",
            p![&naam, codes::hash(&sleutel), codes::hash(&codes::normaliseer(&herstelcode)), vriendcode, test, self.nu_ms().div_euclid(1000)],
        )?)?;
        Ok(NieuweSpeler { speler_id, spelersnaam: naam, sleutel, herstelcode })
    }

    /// Geeft dezelfde Speler terug met een nieuwe sleutel. De oude sleutel werkt daarna niet meer, en de Meldingen naar
    /// de oude toestellen stoppen.
    pub fn herstel(&mut self, herstelcode: &str) -> Result<NieuweSpeler, Fout> {
        let h = codes::hash(&codes::normaliseer(herstelcode));
        let rij = self
            .db
            .rij("SELECT id, spelersnaam FROM speler WHERE herstel_hash = ?1", p![h])?
            .ok_or(Fout::Onbekend("Unknown recovery code"))?;
        let (speler_id, spelersnaam) = (rij.i64(0)?, rij.tekst(1)?);
        let sleutel = codes::nieuwe_sleutel();
        let db = &self.db;
        db.transactie(|| {
            db.voer_uit("UPDATE speler SET sleutel_hash = ?1 WHERE id = ?2", p![codes::hash(&sleutel), speler_id])?;
            // Het oude toestel telt niet meer (zijn sleutel werkt niet meer): ook geen Meldingen meer daarheen.
            // Het nieuwe toestel meldt zijn eigen adres opnieuw aan.
            db.voer_uit("DELETE FROM push_abonnement WHERE speler_id = ?1", p![speler_id])?;
            db.voer_uit("DELETE FROM apns_token WHERE speler_id = ?1", p![speler_id])
        })?;
        Ok(NieuweSpeler { speler_id, spelersnaam, sleutel, herstelcode: herstelcode.trim().to_string() })
    }

    /// Verwijdert het account van een Speler. Spelersnaam, sleutel, Herstelcode, push-abonnementen en Berichten gaan weg.
    /// In lopende Potjes geeft de Speler op en heet hij daarna "Deleted player"; afgelopen Potjes blijven zo staan.
    /// Een Potje dat nog niet begon, verliest de Speler (en verdwijnt als niemand overblijft).
    /// Geeft de nieuwe standen van de veranderde Potjes, voor de live verbinding.
    pub fn verwijder_speler(&mut self, speler_id: i64) -> Result<Vec<Stand>, Fout> {
        let nu = self.klok.nu_ms();
        let db = &self.db;
        db.transactie(|| {
            let potjes = db.rijen("SELECT potje_id, plek FROM potje_speler WHERE speler_id = ?1", p![speler_id])?;
            let mut standen = Vec::new();
            for r in potjes {
                let (potje_id, plek) = (r.i64(0)?, r.u32(1)?);
                let info = potje_info(db, potje_id)?;
                if info.vol {
                    let Afgespeeld { mut game, versie, .. } = speel_af(db, &info)?;
                    // Een afgelopen Potje blijft zo staan, ook voor de winnaar (die staat nog op Playing).
                    if !game.is_over() && game.player_state(plek as usize) == Some(PlayerState::Playing) {
                        game.resign(plek as usize).map_err(zet_fout)?;
                        standen.push(bewaar_zet(db, info, &game, versie + 1, plek, (-1, -1, "opgeven", 0), nu)?);
                    }
                    continue;
                }
                // Een Wachtkamer: de plek komt vrij en de plekken erna schuiven op.
                db.voer_uit("DELETE FROM potje_speler WHERE potje_id = ?1 AND speler_id = ?2", p![potje_id, speler_id])?;
                db.voer_uit("UPDATE potje_speler SET plek = plek - 1 WHERE potje_id = ?1 AND plek > ?2", p![potje_id, plek])?;
                if info.spelers.iter().all(|s| s.speler_id == speler_id || s.computer.is_some()) {
                    // Niemand blijft over, of alleen een Computerspeler: het Potje verdwijnt.
                    db.voer_uit("DELETE FROM potje_speler WHERE potje_id = ?1", p![potje_id])?;
                    db.voer_uit("DELETE FROM rapport WHERE potje_id = ?1", p![potje_id])?;
                    db.voer_uit("DELETE FROM bericht WHERE potje_id = ?1", p![potje_id])?;
                    db.voer_uit("DELETE FROM potje WHERE id = ?1", p![potje_id])?;
                } else {
                    standen.push(stand_van(db, potje_id, nu)?);
                }
            }
            db.voer_uit("DELETE FROM bericht WHERE speler_id = ?1", p![speler_id])?;
            // Rapporten van en over de Speler bevatten zijn Spelersnaam of Berichten: die gaan ook weg.
            db.voer_uit("DELETE FROM rapport WHERE melder_id = ?1 OR speler_id = ?1", p![speler_id])?;
            db.voer_uit("DELETE FROM blokkade WHERE speler_id = ?1 OR geblokkeerd_id = ?1", p![speler_id])?;
            db.voer_uit("DELETE FROM vriend WHERE speler_id = ?1 OR vriend_id = ?1", p![speler_id])?;
            db.voer_uit("DELETE FROM vriendverzoek WHERE van_id = ?1 OR naar_id = ?1", p![speler_id])?;
            db.voer_uit("DELETE FROM uitdaging WHERE van_id = ?1 OR naar_id = ?1", p![speler_id])?;
            db.voer_uit("DELETE FROM puzzeldag WHERE speler_id = ?1", p![speler_id])?;
            db.voer_uit("DELETE FROM push_abonnement WHERE speler_id = ?1", p![speler_id])?;
            db.voer_uit("DELETE FROM apns_token WHERE speler_id = ?1", p![speler_id])?;
            // De hashes krijgen een waarde die nooit een echte hash is, dus geen sleutel of Herstelcode past er nog op.
            db.voer_uit(
                "UPDATE speler SET spelersnaam = ?2, sleutel_hash = 'verwijderd', herstel_hash = ?3, verwijderd = 1, vriendcode = NULL WHERE id = ?1",
                p![speler_id, VERWIJDERDE_SPELER, format!("verwijderd-{speler_id}")],
            )?;
            Ok(standen)
        })
    }

    /// Zoekt de Speler bij een sleutel.
    /// Bewaart de taal van de Speler (zoals `nl`), voor Meldingen en foutmeldingen. Een code die geen
    /// taalcode is, geeft een fout. `en` is een keuze: wie Engels koos, krijgt nooit een vertaling.
    pub fn zet_taal(&mut self, speler_id: i64, taal: &str) -> Result<(), Fout> {
        let taal = crate::taal::schone_taal(taal).ok_or(Fout::Ongeldig("That language is not valid"))?;
        self.db.voer_uit("UPDATE speler SET taal = ?1 WHERE id = ?2", p![taal, speler_id])
    }

    /// De taal van de Speler, als die er een koos.
    pub fn taal_van(&self, speler_id: i64) -> Result<Option<String>, Fout> {
        match self.db.rij("SELECT taal FROM speler WHERE id = ?1", p![speler_id])? {
            Some(r) => r.optie_tekst(0),
            None => Ok(None),
        }
    }

    /// De taal van de Speler met deze sleutel; onbekende sleutel of geen taal is `None`.
    pub fn taal_van_sleutel(&self, sleutel: &str) -> Option<String> {
        let rij = self.db.rij("SELECT taal FROM speler WHERE sleutel_hash = ?1", p![codes::hash(sleutel)]).ok()??;
        rij.optie_tekst(0).ok()?
    }

    pub fn speler_van_sleutel(&self, sleutel: &str) -> Result<i64, Fout> {
        self.db
            .rij("SELECT id FROM speler WHERE sleutel_hash = ?1", p![codes::hash(sleutel)])?
            .ok_or(Fout::NietIngelogd)?
            .i64(0)
    }

    pub fn maak_potje(&mut self, speler_id: i64, bord: &str, aantal: u32, denktijd_s: Option<i64>) -> Result<PotjeInfo, Fout> {
        controleer_potjekeuze(bord, aantal, denktijd_s)?;
        eis_niet_geweerd(&self.db, speler_id)?;
        eis_ruimte_voor_denktijd(&self.db, speler_id, denktijd_s)?;
        let uitnodiging = codes::nieuwe_uitnodiging();
        let db = &self.db;
        let potje_id = db.transactie(|| {
            maak_ruimte_voor_potje(db, speler_id)?;
            let potje_id = nieuw_id(&db.rijen(
                "INSERT INTO potje (uitnodiging, bord, aantal_spelers, denktijd_s) VALUES (?1, ?2, ?3, ?4) RETURNING id",
                p![&uitnodiging, bord, aantal, denktijd_s],
            )?)?;
            db.voer_uit("INSERT INTO potje_speler (potje_id, plek, speler_id) VALUES (?1, 0, ?2)", p![potje_id, speler_id])?;
            Ok(potje_id)
        })?;
        self.potje_op_id(potje_id)
    }

    pub fn potje_bij_uitnodiging(&self, code: &str) -> Result<PotjeInfo, Fout> {
        let rij = self.db.rij("SELECT id FROM potje WHERE snel = 0 AND uitnodiging = ?1", p![codes::normaliseer(code)])?;
        self.potje_op_id(rij.ok_or(Fout::Onbekend("Unknown invite"))?.i64(0)?)
    }

    /// Laat een Speler meedoen. Meedoen als je al meedoet geeft het Potje gewoon terug.
    pub fn doe_mee(&mut self, speler_id: i64, code: &str) -> Result<PotjeInfo, Fout> {
        let db = &self.db;
        let nu = self.klok.nu_ms();
        let potje_id = db.transactie(|| {
            let rij = db
                .rij("SELECT id, aantal_spelers FROM potje WHERE snel = 0 AND uitnodiging = ?1", p![codes::normaliseer(code)])?
                .ok_or(Fout::Onbekend("Unknown invite"))?;
            let (potje_id, aantal) = (rij.i64(0)?, rij.u32(1)?);
            let al = een(db.rij(
                "SELECT EXISTS(SELECT 1 FROM potje_speler WHERE potje_id = ?1 AND speler_id = ?2)",
                p![potje_id, speler_id],
            )?)?
            .bool(0)?;
            if !al {
                eis_niet_geweerd(db, speler_id)?;
                eis_geen_blokkade(db, speler_id, potje_id)?;
                let bezet = een(db.rij("SELECT COUNT(*) FROM potje_speler WHERE potje_id = ?1", p![potje_id])?)?.u32(0)?;
                if bezet >= aantal {
                    return Err(Fout::Vol);
                }
                db.voer_uit(
                    "INSERT INTO potje_speler (potje_id, plek, speler_id) VALUES (?1, ?2, ?3)",
                    p![potje_id, bezet, speler_id],
                )?;
                // Wie via een Uitnodiging samen speelt, komt in elkaars Vriendenlijst (een Snel potje komt hier nooit).
                voeg_potje_vrienden_toe(db, potje_id, speler_id, nu)?;
                // Het Potje is vol: de eerste beurt begint nu.
                if bezet + 1 >= aantal {
                    db.voer_uit("UPDATE potje SET gestart_ms = ?2 WHERE id = ?1", p![potje_id, nu])?;
                }
            }
            Ok(potje_id)
        })?;
        self.potje_op_id(potje_id)
    }

    /// De Spelers van dit Potje nu (ook Computerspelers), voor de live verbinding.
    pub fn leden(&self, potje_id: i64) -> Result<Vec<i64>, Fout> {
        self.db.rijen("SELECT speler_id FROM potje_speler WHERE potje_id = ?1 ORDER BY plek", p![potje_id])?.iter().map(|r| r.i64(0)).collect()
    }

    /// Is deze Speler een Speler van dit Potje? Zo niet: `Fout::Verboden`.
    pub fn eis_lid(&self, speler_id: i64, potje_id: i64) -> Result<(), Fout> {
        lid_plek(&self.db, speler_id, potje_id).map(|_| ())
    }

    /// De volledige stand van een Potje, opgebouwd door de Zetten opnieuw af te spelen.
    pub fn stand(&self, speler_id: i64, potje_id: i64) -> Result<Stand, Fout> {
        lid_plek(&self.db, speler_id, potje_id)?;
        stand_van(&self.db, potje_id, self.klok.nu_ms())
    }

    /// Bewaart een Bericht van een Speler van het Potje. Mag ook voor de start en na het einde.
    pub fn stuur_bericht(&mut self, speler_id: i64, potje_id: i64, tekst: &str) -> Result<Bericht, Fout> {
        lid_plek(&self.db, speler_id, potje_id)?;
        eis_niet_geweerd(&self.db, speler_id)?;
        let tekst = tekst.trim();
        // Geen vrije chat met onbekenden: in een Snel potje mag alleen een Vaste zin uit de lijst.
        if potje_info(&self.db, potje_id)?.snel {
            if !VASTE_ZINNEN.contains(&tekst) {
                return Err(Fout::Ongeldig("Pick a quick message from the list"));
            }
            let id = bewaar_bericht(&self.db, potje_id, speler_id, tekst)?;
            return Ok(self.berichten_van(potje_id, Some(id), speler_id)?.remove(0));
        }
        if tekst.is_empty() || tekst.chars().count() > MAX_BERICHT {
            return Err(Fout::Ongeldig("A message has 1 to 300 characters"));
        }
        if woordfilter::is_grof(tekst) {
            return Err(Fout::Ongeldig("That message is not allowed. Keep the chat friendly."));
        }
        let id = bewaar_bericht(&self.db, potje_id, speler_id, tekst)?;
        Ok(self.berichten_van(potje_id, Some(id), speler_id)?.remove(0))
    }

    /// De Berichten van een Potje (hooguit [`MAX_BERICHTEN_PER_POTJE`]), oudste eerst. Alleen voor Spelers van het Potje.
    pub fn berichten(&self, speler_id: i64, potje_id: i64) -> Result<Vec<Bericht>, Fout> {
        lid_plek(&self.db, speler_id, potje_id)?;
        self.berichten_van(potje_id, None, speler_id)
    }

    /// Berichten van een Potje, zonder verborgen Berichten en zonder die van Spelers die `kijker` blokkeerde.
    fn berichten_van(&self, potje_id: i64, id: Option<i64>, kijker: i64) -> Result<Vec<Bericht>, Fout> {
        self.db
            .rijen(
                "SELECT b.id, ps.plek, s.spelersnaam, b.tekst, b.tijd, b.speler_id FROM bericht b
                 JOIN potje_speler ps ON ps.potje_id = b.potje_id AND ps.speler_id = b.speler_id
                 JOIN speler s ON s.id = b.speler_id
                 WHERE b.potje_id = ?1 AND (?2 IS NULL OR b.id = ?2) AND b.verborgen = 0
                   AND NOT EXISTS (SELECT 1 FROM blokkade k WHERE k.speler_id = ?3 AND k.geblokkeerd_id = b.speler_id)
                 ORDER BY b.id",
                p![potje_id, id, kijker],
            )?
            .iter()
            .map(|r| {
                Ok(Bericht {
                    id: r.i64(0)?,
                    plek: r.u32(1)? + 1,
                    speler_id: r.i64(5)?,
                    spelersnaam: r.tekst(2)?,
                    tekst: r.tekst(3)?,
                    tijd: r.i64(4)?,
                })
            })
            .collect()
    }

    /// Alle Potjes van deze Speler, het laatst gebruikte eerst. Elk Potje wordt opnieuw afgespeeld.
    pub fn mijn_potjes(&self, speler_id: i64) -> Result<Vec<MijnPotje>, Fout> {
        let nu = self.klok.nu_ms();
        let rijen = self.db.rijen(
            "SELECT p.id, ps.plek, COALESCE((SELECT MAX(z.tijd) FROM zet z WHERE z.potje_id = p.id), p.aangemaakt)
             FROM potje_speler ps JOIN potje p ON p.id = ps.potje_id
             WHERE ps.speler_id = ?1 AND p.zoek_tot_ms IS NULL",
            p![speler_id],
        )?;
        let mut lijst = Vec::with_capacity(rijen.len());
        for r in rijen {
            let (potje_id, plek, laatste_activiteit) = (r.i64(0)?, r.u32(1)?, r.i64(2)?);
            let s = stand_van(&self.db, potje_id, nu)?;
            lijst.push(MijnPotje {
                potje_id,
                uitnodiging: s.uitnodiging,
                bord: s.bord,
                aantal_spelers: s.aantal_spelers,
                spelers: s.spelers.into_iter().map(|x| x.speler).collect(),
                gestart: s.gestart,
                aan_de_beurt: s.aan_de_beurt,
                jouw_plek: plek + 1,
                afgelopen: s.afgelopen,
                winnaar: s.winnaar,
                denktijd_s: s.denktijd_s,
                laatste_activiteit,
                snel: s.snel,
            });
        }
        lijst.sort_by(|a, b| b.laatste_activiteit.cmp(&a.laatste_activiteit).then(b.potje_id.cmp(&a.potje_id)));
        Ok(lijst)
    }

    /// De Ranglijst: jij en de Spelers met wie je ooit een Potje deelde, met hun afgelopen online Potjes.
    /// Hoogste Rating eerst, dan meest gewonnen, dan minst gespeeld, dan op Spelersnaam. Spelers zonder afgelopen Potje staan er niet op.
    pub fn ranglijst(&self, speler_id: i64) -> Result<Vec<RanglijstRij>, Fout> {
        let nu = self.klok.nu_ms();
        let potjes = self.db.rijen(
            "SELECT DISTINCT potje_id FROM potje_speler WHERE speler_id IN (
                 SELECT b.speler_id FROM potje_speler a JOIN potje_speler b ON a.potje_id = b.potje_id
                 WHERE a.speler_id = ?1)",
            p![speler_id],
        )?;
        let mut telling: HashMap<i64, RanglijstRij> = HashMap::new();
        for r in potjes {
            let s = stand_van(&self.db, r.i64(0)?, nu)?;
            if !s.afgelopen {
                continue;
            }
            for x in &s.spelers {
                let rij = telling.entry(x.speler.speler_id).or_insert_with(|| RanglijstRij {
                    speler_id: x.speler.speler_id,
                    spelersnaam: x.speler.spelersnaam.clone(),
                    gespeeld: 0,
                    gewonnen: 0,
                    rating: 0,
                });
                rij.gespeeld += 1;
                if s.winnaar == Some(x.speler.plek) {
                    rij.gewonnen += 1;
                }
            }
        }
        // Alleen Spelers van wie jij een Potje deelde (of jezelf) horen op jouw Ranglijst.
        let zichtbaar = self
            .db
            .rijen(
                "SELECT DISTINCT b.speler_id, s.rating FROM potje_speler a JOIN potje_speler b ON a.potje_id = b.potje_id
                 JOIN speler s ON s.id = b.speler_id WHERE a.speler_id = ?1 AND s.verwijderd = 0",
                p![speler_id],
            )?
            .iter()
            .map(|r| Ok((r.i64(0)?, r.i64(1)?)))
            .collect::<Result<HashMap<_, _>, Fout>>()?;
        let mut lijst: Vec<RanglijstRij> = telling
            .into_values()
            .filter_map(|r| zichtbaar.get(&r.speler_id).map(|&rating| RanglijstRij { rating, ..r }))
            .collect();
        lijst.sort_by(|a, b| {
            b.rating.cmp(&a.rating).then(b.gewonnen.cmp(&a.gewonnen)).then(a.gespeeld.cmp(&b.gespeeld)).then_with(|| a.spelersnaam.to_lowercase().cmp(&b.spelersnaam.to_lowercase())).then(a.speler_id.cmp(&b.speler_id))
        });
        Ok(lijst)
    }

    /// De eigen Statistieken van de Speler, uit de afgelopen online Potjes. Elk Potje wordt opnieuw afgespeeld.
    pub fn statistieken(&self, speler_id: i64) -> Result<Statistieken, Fout> {
        let db = &self.db;
        let potjes = db.rijen(
            "SELECT p.id FROM potje p JOIN potje_speler ps ON ps.potje_id = p.id
             WHERE ps.speler_id = ?1 AND p.zoek_tot_ms IS NULL AND p.afgelopen = 1 ORDER BY p.id",
            p![speler_id],
        )?;
        let (mut gespeeld, mut gewonnen, mut plekken) = (0u32, 0u32, 0u32);
        let mut langste: Option<StatistiekRecord> = None;
        let mut snelste: Option<StatistiekRecord> = None;
        for r in potjes {
            let info = potje_info(db, r.i64(0)?)?;
            let Some(mijn) = info.spelers.iter().find(|s| s.speler_id == speler_id) else { continue };
            let mijn_plek = mijn.plek as usize - 1;
            let tegenstanders: Vec<String> =
                info.spelers.iter().filter(|s| s.speler_id != speler_id).map(|s| s.spelersnaam.clone()).collect();
            let n = info.aantal_spelers as usize;
            // Eerst afspelen: dat vult ook het aantal Sprongen van oude Zetten.
            let game = speel_af(db, &info)?.game;
            if !game.is_over() {
                continue;
            }
            let eigen = een(db.rij(
                "SELECT COUNT(*), COALESCE(MAX(sprongen), 0) FROM zet WHERE potje_id = ?1 AND speler_plek = ?2 AND soort = 'zet'",
                p![info.potje_id, mijn_plek as i64],
            )?)?;
            let (eigen_zetten, potje_sprongen) = (eigen.u32(0)?, eigen.u32(1)?);
            gespeeld += 1;
            let ranking = game.ranking();
            // Wie niet in de eindvolgorde staat (opgegeven) krijgt de laatste plek.
            plekken += ranking.iter().position(|&x| x == mijn_plek).map_or(n, |i| i + 1) as u32;
            if game.winner() == Some(mijn_plek) {
                gewonnen += 1;
                // Een overwinning telt alleen als de Speler zelf alle stenen in de doelpunt kreeg.
                if game.player_state(mijn_plek) == Some(PlayerState::Finished) && snelste.as_ref().is_none_or(|s| eigen_zetten < s.waarde) {
                    snelste = Some(StatistiekRecord { potje_id: info.potje_id, waarde: eigen_zetten, tegenstanders: tegenstanders.clone() });
                }
            }
            if potje_sprongen > 0 && langste.as_ref().is_none_or(|l| potje_sprongen > l.waarde) {
                langste = Some(StatistiekRecord { potje_id: info.potje_id, waarde: potje_sprongen, tegenstanders });
            }
        }
        // Alleen Snel potjes hebben een Ratingwijziging; de laatste 50, op het moment van de laatste Zet.
        let mut rating_verloop: Vec<i64> = db
            .rijen(
                "SELECT w.na FROM rating_wijziging w WHERE w.speler_id = ?1
                 ORDER BY COALESCE((SELECT MAX(z.tijd_ms) FROM zet z WHERE z.potje_id = w.potje_id), 0) DESC, w.potje_id DESC LIMIT ?2",
                p![speler_id, STATISTIEKEN_RATING_PUNTEN as i64],
            )?
            .iter()
            .map(|r| r.i64(0))
            .collect::<Result<_, Fout>>()?;
        rating_verloop.reverse();
        Ok(Statistieken {
            gespeeld,
            gewonnen,
            verloren: gespeeld - gewonnen,
            deel_gewonnen: (gespeeld > 0).then(|| gewonnen as f64 / gespeeld as f64),
            gemiddelde_plek: (gespeeld > 0).then(|| plekken as f64 / gespeeld as f64),
            rating_verloop,
            langste_sprong: langste,
            snelste_overwinning: snelste,
        })
    }

    /// De eigen Prestaties van de Speler, uit al zijn online Potjes (ook lopende voor de Sprongen). Altijd alle
    /// tien, in de vaste volgorde van `PRESTATIES`. Elk Potje wordt opnieuw afgespeeld, zoals bij `statistieken`.
    pub fn prestaties(&self, speler_id: i64) -> Result<Vec<Prestatie>, Fout> {
        let db = &self.db;
        let potjes = db.rijen(
            "SELECT p.id FROM potje p JOIN potje_speler ps ON ps.potje_id = p.id
             WHERE ps.speler_id = ?1 AND p.zoek_tot_ms IS NULL ORDER BY p.id",
            p![speler_id],
        )?;
        let mut behaald: std::collections::HashMap<&'static str, i64> = std::collections::HashMap::new();
        let mut eerst = |id: &'static str, ms: i64| {
            let e = behaald.entry(id).or_insert(ms);
            *e = (*e).min(ms);
        };
        // (moment, potje) van elke gewonnen Potje, om de tiende, vijftigste en honderdste te vinden.
        let mut winsten: Vec<(i64, i64)> = Vec::new();
        // Per vriend het eerste moment dat een Potje met hem uit was (Potjes via een Uitnodiging, Uitdaging of de
        // Vriendenlijst; geen Snel potje en geen Computerspeler).
        let mut vrienden: std::collections::HashMap<i64, i64> = std::collections::HashMap::new();
        for r in potjes {
            let info = potje_info(db, r.i64(0)?)?;
            let Some(mijn) = info.spelers.iter().find(|s| s.speler_id == speler_id) else { continue };
            let mijn_plek = mijn.plek as usize - 1;
            let n = info.aantal_spelers as usize;
            // Eerst afspelen: dat vult ook het aantal Sprongen van oude Zetten.
            let game = speel_af(db, &info)?.game;
            let sprongen = een(db.rij(
                "SELECT MIN(CASE WHEN sprongen >= 6 THEN COALESCE(tijd_ms, tijd * 1000) END),
                        MIN(CASE WHEN sprongen >= 10 THEN COALESCE(tijd_ms, tijd * 1000) END)
                 FROM zet WHERE potje_id = ?1 AND speler_plek = ?2 AND soort = 'zet'",
                p![info.potje_id, mijn_plek as i64],
            )?)?;
            if let Some(ms) = sprongen.optie_i64(0)? {
                eerst("jumps_6", ms);
            }
            if let Some(ms) = sprongen.optie_i64(1)? {
                eerst("jumps_10", ms);
            }
            let laatste_ms = db
                .rij("SELECT COALESCE(tijd_ms, tijd * 1000) FROM zet WHERE potje_id = ?1 ORDER BY nummer DESC LIMIT 1", p![info.potje_id])?
                .map_or(Ok(0), |r| r.i64(0))?;
            if game.is_over() && !info.snel {
                for s in info.spelers.iter().filter(|s| s.speler_id != speler_id && s.computer.is_none()) {
                    let e = vrienden.entry(s.speler_id).or_insert(laatste_ms);
                    *e = (*e).min(laatste_ms);
                }
            }
            if game.is_over() && game.winner() == Some(mijn_plek) {
                winsten.push((laatste_ms, info.potje_id));
                if info.bord == "vierkant" {
                    eerst("square_win", laatste_ms);
                }
                if n == 6 {
                    eerst("six_players_win", laatste_ms);
                }
            }
        }
        let mut vriendmomenten: Vec<i64> = vrienden.into_values().collect();
        vriendmomenten.sort();
        if let Some(&ms) = vriendmomenten.get(4) {
            eerst("five_friends", ms);
        }
        // Reeks van zeven: zeven opeenvolgende dagen met een opgeloste Dagelijkse puzzel. Het moment is het midden van
        // de dag van dag zeven (12:00 UTC), zodat elke tijdzone dezelfde datum laat zien.
        let dagen = db.rijen("SELECT datum FROM puzzeldag WHERE speler_id = ?1 ORDER BY datum", p![speler_id])?;
        let mut reeks = 0;
        let mut vorige: Option<i64> = None;
        for r in dagen {
            let Some(dag) = datum_naar_dag(&r.tekst(0)?) else { continue };
            reeks = if vorige == Some(dag - 1) { reeks + 1 } else { 1 };
            vorige = Some(dag);
            if reeks == 7 {
                eerst("puzzle_streak_7", dag * 86_400_000 + 43_200_000);
                break;
            }
        }
        winsten.sort();
        for (id, aantal) in [("first_win", 1), ("wins_10", 10), ("wins_50", 50), ("wins_100", 100)] {
            if let Some(&(ms, _)) = winsten.get(aantal - 1) {
                eerst(id, ms);
            }
        }
        Ok(PRESTATIES.iter().map(|&id| Prestatie { id, behaald_ms: behaald.get(id).copied() }).collect())
    }

    /// De Speler loste de Dagelijkse puzzel op `datum` (jjjj-mm-dd, de dag op zijn toestel) op. Alleen de datum wordt
    /// bewaard. Een datum die geen dag is, van vóór 2020 of meer dan een dag na vandaag (tijdzones) is ongeldig.
    /// Dezelfde datum twee keer is geen fout.
    pub fn bewaar_puzzeldag(&mut self, speler_id: i64, datum: &str) -> Result<(), Fout> {
        let dag = datum_naar_dag(datum).ok_or(Fout::Ongeldig("That date is not valid"))?;
        let vandaag = self.klok.nu_ms().div_euclid(86_400_000);
        if dag < datum_naar_dag("2020-01-01").unwrap_or(0) || dag > vandaag + 1 {
            return Err(Fout::Ongeldig("That date is not valid"));
        }
        self.db.voer_uit("INSERT OR IGNORE INTO puzzeldag (speler_id, datum) VALUES (?1, ?2)", p![speler_id, datum])
    }

    /// De Speler aan de beurt zet een steen van `van` naar `naar`. Halma-core beslist.
    /// Is de Denktijd van de beurt op, dan telt de Zet niet, ook als het alarm de beurt nog niet oversloeg.
    pub fn doe_zet(&mut self, speler_id: i64, potje_id: i64, van: usize, naar: usize) -> Result<Stand, Fout> {
        self.schrijf(speler_id, potje_id, true, |game, plek| {
            if game.current_player() != plek {
                return Err(Fout::Conflict("It is not your turn"));
            }
            let sprongen = sprongen_in(game, van, naar);
            game.make_move(van, naar).map_err(zet_fout)?;
            Ok((van as i64, naar as i64, "zet", sprongen))
        })
    }

    /// De Speler geeft op, ook buiten de eigen beurt.
    pub fn geef_op(&mut self, speler_id: i64, potje_id: i64) -> Result<Stand, Fout> {
        self.schrijf(speler_id, potje_id, false, |game, plek| {
            game.resign(plek).map_err(zet_fout)?;
            Ok((-1, -1, "opgeven", 0))
        })
    }

    /// `binnen_denktijd`: de actie kan niet meer zodra de Denktijd van de huidige beurt op is (een Zet; opgeven kan altijd).
    fn schrijf(
        &mut self,
        speler_id: i64,
        potje_id: i64,
        binnen_denktijd: bool,
        actie: impl FnOnce(&mut Game, usize) -> Result<ZetRij, Fout>,
    ) -> Result<Stand, Fout> {
        let nu = self.klok.nu_ms();
        let db = &self.db;
        db.transactie(|| {
            let plek = lid_plek(db, speler_id, potje_id)?;
            let info = potje_info(db, potje_id)?;
            if !info.vol {
                return Err(Fout::Conflict("The game has not started yet"));
            }
            let Afgespeeld { mut game, versie, .. } = speel_af(db, &info)?;
            // De beurt is voorbij op de deadline, dezelfde grens als het alarm (`sla_verlopen_beurten_over`).
            if binnen_denktijd && !game.is_over() && deadline_ms(db, potje_id)?.is_some_and(|d| nu >= d) {
                return Err(Fout::Conflict("It is not your turn"));
            }
            let zet = actie(&mut game, plek as usize)?;
            bewaar_zet(db, info, &game, versie + 1, plek, zet, nu)
        })
    }

    /// Zet een Computerspeler in een Potje dat nog niet vol is. Hij krijgt een gewone Spelersnaam uit
    /// [`COMPUTER_NAMEN`] (een die in dit Potje nog niet voorkomt) en neemt de eerstvolgende plek in.
    /// Is het Potje daarmee vol, dan begint het: de Computerspeler doet zijn Zet zelf als hij aan de beurt is
    /// (zie [`Opslag::sla_verlopen_beurten_over`]). Er moet al een Speler in het Potje zitten.
    /// Geeft de nieuwe stand, voor de live verbinding.
    pub fn voeg_computerspeler_toe(&mut self, potje_id: i64) -> Result<Stand, Fout> {
        let nu = self.klok.nu_ms();
        let db = &self.db;
        db.transactie(|| computerspeler_in(db, potje_id, nu))
    }

    /// Zoekt een Snel potje voor deze Speler ("Play online"): wie het eerst wacht, wordt gekoppeld.
    /// 1. Wacht de Speler al in een Snel potje, dan is dat het resultaat (niets wordt dubbel gemaakt).
    /// 2. Wachten er anderen in een Snel potje (de zoektijd is niet om en geen van beiden blokkeerde de ander), dan doet de
    ///    Speler mee met het Potje van wie de dichtstbijzijnde Rating heeft (bij gelijk verschil de langst wachtende);
    ///    het Potje begint.
    /// 3. Anders maakt de Speler een Snel potje en wacht [`SNEL_ZOEKTIJD_MS`]; daarna vult een Computerspeler de plek
    ///    (zie [`Opslag::sla_verlopen_beurten_over`]).
    /// Geeft de stand, voor het antwoord en voor de live verbinding.
    pub fn zoek_snel_potje(&mut self, speler_id: i64) -> Result<Stand, Fout> {
        self.zoek_snel_potje_met(speler_id, SNEL_AANTAL)
    }

    /// Zoals [`Opslag::zoek_snel_potje`], voor een Snel potje met `aantal` Spelers (2, of [`SNEL_MEER_AANTAL`]).
    /// Een zoekopdracht sluit alleen aan bij een wachtend Potje met hetzelfde aantal Spelers. Na de zoektijd vullen
    /// Computerspelers alle lege plekken tegelijk.
    pub fn zoek_snel_potje_met(&mut self, speler_id: i64, aantal: u32) -> Result<Stand, Fout> {
        if aantal != SNEL_AANTAL && aantal != SNEL_MEER_AANTAL {
            return Err(Fout::Ongeldig("A quick game has 2 or 4 players"));
        }
        let nu = self.klok.nu_ms();
        let db = &self.db;
        db.transactie(|| {
            eis_niet_geweerd(db, speler_id)?;
            let eigen = db.rij(
                "SELECT p.id FROM potje p JOIN potje_speler ps ON ps.potje_id = p.id
                 WHERE p.snel = 1 AND p.zoek_tot_ms IS NOT NULL AND ps.speler_id = ?1 ORDER BY p.id LIMIT 1",
                p![speler_id],
            )?;
            if let Some(r) = eigen {
                return stand_van(db, r.i64(0)?, nu);
            }
            // Het wachtende Potje met de Rating die het dichtst bij de jouwe ligt (bij gelijkspel het oudste).
            let mijn_rating = een(db.rij("SELECT rating FROM speler WHERE id = ?1", p![speler_id])?)?.i64(0)?;
            let wachtend = db.rijen(
                "SELECT p.id, (SELECT COUNT(*) FROM potje_speler WHERE potje_id = p.id),
                        (SELECT MIN(s.rating) FROM potje_speler ps JOIN speler s ON s.id = ps.speler_id WHERE ps.potje_id = p.id)
                 FROM potje p WHERE p.snel = 1 AND p.zoek_tot_ms > ?1 AND p.aantal_spelers = ?2 ORDER BY p.id",
                p![nu, aantal],
            )?;
            let mut keuze: Option<(i64, i64, u32)> = None;
            for r in wachtend {
                let (potje_id, bezet, rating) = (r.i64(0)?, r.u32(1)?, r.i64(2)?);
                if bezet >= aantal || eis_geen_blokkade(db, speler_id, potje_id).is_err() {
                    continue;
                }
                let verschil = (rating - mijn_rating).abs();
                if keuze.is_none_or(|k| verschil < k.1) {
                    keuze = Some((potje_id, verschil, bezet));
                }
            }
            if let Some((potje_id, _, bezet)) = keuze {
                db.voer_uit("INSERT INTO potje_speler (potje_id, plek, speler_id) VALUES (?1, ?2, ?3)", p![potje_id, bezet, speler_id])?;
                if bezet + 1 >= aantal {
                    db.voer_uit("UPDATE potje SET gestart_ms = ?2, zoek_tot_ms = NULL WHERE id = ?1", p![potje_id, nu])?;
                }
                return stand_van(db, potje_id, nu);
            }
            let potje_id = nieuw_id(&db.rijen(
                "INSERT INTO potje (uitnodiging, bord, aantal_spelers, denktijd_s, snel, zoek_tot_ms)
                 VALUES (?1, ?2, ?3, ?4, 1, ?5) RETURNING id",
                p![codes::nieuwe_uitnodiging(), SNEL_BORD, aantal, SNEL_DENKTIJD_S, nu + SNEL_ZOEKTIJD_MS],
            )?)?;
            db.voer_uit("INSERT INTO potje_speler (potje_id, plek, speler_id) VALUES (?1, 0, ?2)", p![potje_id, speler_id])?;
            stand_van(db, potje_id, nu)
        })
    }

    /// De Speler stopt met zoeken: hij verlaat de wachtrij. Wachten er anderen in hetzelfde Snel potje (voor meer Spelers),
    /// dan schuiven hun plekken op en geeft dit hun nieuwe stand; anders verdwijnt het Potje en geeft dit `None`.
    /// Is het Potje intussen vol, dan is het begonnen en geeft dit `Fout::Conflict`.
    pub fn stop_zoeken(&mut self, speler_id: i64, potje_id: i64) -> Result<Option<Stand>, Fout> {
        let nu = self.klok.nu_ms();
        let db = &self.db;
        db.transactie(|| {
            let plek = lid_plek(db, speler_id, potje_id)?;
            let info = potje_info(db, potje_id)?;
            if !info.snel {
                return Err(Fout::Conflict("This is not a Play online game"));
            }
            if info.vol {
                return Err(Fout::Conflict("The game has already started"));
            }
            if info.spelers.iter().all(|s| s.speler_id == speler_id) {
                verwijder_wachtend_potje(db, potje_id)?;
                return Ok(None);
            }
            db.voer_uit("DELETE FROM potje_speler WHERE potje_id = ?1 AND speler_id = ?2", p![potje_id, speler_id])?;
            db.voer_uit("UPDATE potje_speler SET plek = plek - 1 WHERE potje_id = ?1 AND plek > ?2", p![potje_id, plek])?;
            stand_van(db, potje_id, nu).map(Some)
        })
    }

    /// Doet wat aan de beurt is: de Computerspelers waarvan de wachttijd om is doen hun Zet (hooguit
    /// [`MAX_COMPUTERZETTEN_PER_RONDE`] per aanroep; de rest blijft klaarstaan), en elk Potje waarvan de
    /// denktijd op is slaat de beurt over. Geeft per Potje de nieuwe stand.
    /// Is de server een tijd uit geweest, dan slaat dit een Potje één keer over; de volgende beurt begint nu.
    pub fn sla_verlopen_beurten_over(&mut self) -> Result<Vec<Stand>, Fout> {
        let nu = self.klok.nu_ms();
        let db = &self.db;
        let mut standen = Vec::new();
        let mut computerzetten = 0;
        // Wie na de zoektijd nog alleen wacht in een Snel potje, krijgt een Computerspeler als tegenstander.
        let verlopen = db.rijen(
            "SELECT id FROM potje WHERE snel = 1 AND zoek_tot_ms IS NOT NULL AND zoek_tot_ms <= ?1 ORDER BY id",
            p![nu],
        )?;
        for r in verlopen {
            let potje_id = r.i64(0)?;
            // Alle lege plekken tegelijk: de Speler(s) wachten niet nog eens 20 s per plek.
            standen.push(db.transactie(|| {
                loop {
                    let stand = computerspeler_in(db, potje_id, nu)?;
                    if stand.gestart {
                        return Ok(stand);
                    }
                }
            })?);
        }
        for (potje_id, deadline) in self.deadlines()? {
            if deadline > nu {
                continue;
            }
            let stand = db.transactie(|| {
                // Opnieuw lezen binnen de transactie: er kan net een Zet zijn gedaan.
                if volgende_actie_ms(db, potje_id)?.is_none_or(|d| d > nu) {
                    return Ok(None);
                }
                let info = potje_info(db, potje_id)?;
                let Afgespeeld { mut game, versie, .. } = speel_af(db, &info)?;
                if game.is_over() {
                    return Ok(None);
                }
                let plek = game.current_player() as u32;
                let nummer = versie + 1;
                let computer = info.spelers.iter().find(|s| s.plek == plek + 1).and_then(|s| s.computer);
                let computer = computer.map(|n| if info.snel && info.aantal_spelers > SNEL_AANTAL { n.min(COMPUTER_MAX_NIVEAU_MEER) } else { n });
                if let Some(niveau) = computer.filter(|_| computer_zet_ms(db, potje_id).ok().flatten().is_some_and(|c| c <= nu)) {
                    if computerzetten >= MAX_COMPUTERZETTEN_PER_RONDE {
                        return Ok(None);
                    }
                    computerzetten += 1;
                    let mut rng = Rng::new((potje_id as u64).wrapping_mul(1_000_003).wrapping_add(u64::from(nummer)));
                    let zet = match choose_move(&game, Level::from_number(niveau), &mut rng) {
                        Some((van, naar)) => {
                            let sprongen = sprongen_in(&game, van, naar);
                            game.make_move(van, naar).map_err(zet_fout)?;
                            (van as i64, naar as i64, "zet", sprongen)
                        }
                        // Geen Zet mogelijk (komt in de praktijk niet voor): de beurt gaat over.
                        None => {
                            game.skip_turn().map_err(zet_fout)?;
                            (-1, -1, "overgeslagen", 0)
                        }
                    };
                    return bewaar_zet(db, info, &game, nummer, plek, zet, nu).map(Some);
                }
                // Wie al twee beurten op rij miste en nu de derde mist, geeft vanzelf op.
                let soort = if gemiste_beurten_op_rij(db, potje_id, plek)? + 1 >= MAX_GEMISTE_BEURTEN {
                    game.resign(plek as usize).map_err(zet_fout)?;
                    "opgeven"
                } else {
                    game.skip_turn().map_err(zet_fout)?;
                    "overgeslagen"
                };
                bewaar_zet(db, info, &game, nummer, plek, (-1, -1, soort, 0), nu).map(Some)
            })?;
            standen.extend(stand);
        }
        Ok(standen)
    }

    /// Het eerstvolgende moment (milliseconden sinds 1970) waarop iets aan de beurt is:
    /// een Denktijd die afloopt of een Computerspeler die zijn Zet doet.
    pub fn volgende_deadline(&self) -> Result<Option<i64>, Fout> {
        let zoek = self.db.rij("SELECT MIN(zoek_tot_ms) FROM potje WHERE snel = 1", &[])?.map_or(Ok(None), |r| r.optie_i64(0))?;
        Ok(self.deadlines()?.into_iter().map(|(_, d)| d).chain(zoek).min())
    }

    /// Per lopend Potje het eerstvolgende moment waarop iets moet gebeuren.
    fn deadlines(&self) -> Result<Vec<(i64, i64)>, Fout> {
        let ids = self.db.rijen(
            "SELECT p.id FROM potje p WHERE p.afgelopen = 0
             AND ((p.denktijd_s IS NOT NULL AND p.gestart_ms IS NOT NULL) OR p.computer_zet_ms IS NOT NULL)",
            &[],
        )?;
        let mut lijst = Vec::new();
        for r in ids {
            let id = r.i64(0)?;
            if let Some(d) = volgende_actie_ms(&self.db, id)? {
                lijst.push((id, d));
            }
        }
        Ok(lijst)
    }

    /// Bewaart het push-abonnement van een toestel. Een bekend endpoint wordt bijgewerkt en telt als nieuwste. Boven
    /// [`MAX_MELDINGSADRESSEN`] gaat het oudste abonnement van de Speler eruit.
    pub fn bewaar_abonnement(&mut self, speler_id: i64, a: &Abonnement) -> Result<(), Fout> {
        let db = &self.db;
        db.transactie(|| {
            db.voer_uit("DELETE FROM push_abonnement WHERE endpoint = ?1", p![&a.endpoint])?;
            db.voer_uit(
                "INSERT INTO push_abonnement (speler_id, endpoint, p256dh, auth) VALUES (?1, ?2, ?3, ?4)",
                p![speler_id, &a.endpoint, &a.keys.p256dh, &a.keys.auth],
            )?;
            db.voer_uit(
                "DELETE FROM push_abonnement WHERE speler_id = ?1
                   AND id NOT IN (SELECT id FROM push_abonnement WHERE speler_id = ?1 ORDER BY id DESC LIMIT ?2)",
                p![speler_id, MAX_MELDINGSADRESSEN],
            )
        })
    }

    /// Haalt een abonnement van deze Speler weg. Een onbekend endpoint is geen fout.
    pub fn verwijder_abonnement(&mut self, speler_id: i64, endpoint: &str) -> Result<(), Fout> {
        self.db.voer_uit("DELETE FROM push_abonnement WHERE speler_id = ?1 AND endpoint = ?2", p![speler_id, endpoint])
    }

    /// Ruimt een abonnement op dat de pushdienst weigert.
    pub fn ruim_abonnement_op(&mut self, endpoint: &str) -> Result<(), Fout> {
        self.db.voer_uit("DELETE FROM push_abonnement WHERE endpoint = ?1", p![endpoint])
    }

    pub fn abonnementen_van(&self, speler_id: i64) -> Result<Vec<Abonnement>, Fout> {
        self.db
            .rijen("SELECT endpoint, p256dh, auth FROM push_abonnement WHERE speler_id = ?1 ORDER BY id", p![speler_id])?
            .iter()
            .map(|r| Ok(Abonnement { endpoint: r.tekst(0)?, keys: Sleutels { p256dh: r.tekst(1)?, auth: r.tekst(2)? } }))
            .collect()
    }

    /// Bewaart het APNs-token van een iPhone. Een bekend token gaat naar deze Speler (bijvoorbeeld na een Herstelcode) en
    /// telt als nieuwste. Boven [`MAX_MELDINGSADRESSEN`] gaat het oudste token van de Speler eruit.
    pub fn bewaar_apns_token(&mut self, speler_id: i64, t: &ApnsToken) -> Result<(), Fout> {
        let token = t.controleer()?;
        let db = &self.db;
        db.transactie(|| {
            db.voer_uit("DELETE FROM apns_token WHERE token = ?1", p![&token])?;
            db.voer_uit("INSERT INTO apns_token (speler_id, token, omgeving) VALUES (?1, ?2, ?3)", p![speler_id, &token, t.omgeving.naam()])?;
            db.voer_uit(
                "DELETE FROM apns_token WHERE speler_id = ?1
                   AND id NOT IN (SELECT id FROM apns_token WHERE speler_id = ?1 ORDER BY id DESC LIMIT ?2)",
                p![speler_id, MAX_MELDINGSADRESSEN],
            )
        })
    }

    /// Haalt een APNs-token van deze Speler weg. Een onbekend token is geen fout.
    pub fn verwijder_apns_token(&mut self, speler_id: i64, token: &str) -> Result<(), Fout> {
        let token = token.trim().to_ascii_lowercase();
        self.db.voer_uit("DELETE FROM apns_token WHERE speler_id = ?1 AND token = ?2", p![speler_id, token])
    }

    /// Ruimt een token op dat Apple weigert (410, of 400 `BadDeviceToken`).
    pub fn ruim_apns_token_op(&mut self, token: &str) -> Result<(), Fout> {
        self.db.voer_uit("DELETE FROM apns_token WHERE token = ?1", p![token])
    }

    pub fn apns_tokens_van(&self, speler_id: i64) -> Result<Vec<ApnsToken>, Fout> {
        self.db
            .rijen("SELECT token, omgeving FROM apns_token WHERE speler_id = ?1 ORDER BY id", p![speler_id])?
            .iter()
            .map(|r| Ok(ApnsToken { token: r.tekst(0)?, omgeving: ApnsOmgeving::van_naam(&r.tekst(1)?)? }))
            .collect()
    }

    /// Stand na een wijziging van de bezetting (meedoen), voor de live verbinding.
    pub fn stand_zonder_lid(&self, potje_id: i64) -> Result<Stand, Fout> {
        stand_van(&self.db, potje_id, self.klok.nu_ms())
    }

    /// Het id van het Potje bij een Uitnodiging, voor het live bericht na meedoen.
    pub fn potje_id_bij_uitnodiging(&self, code: &str) -> Result<i64, Fout> {
        Ok(self.potje_bij_uitnodiging(code)?.potje_id)
    }

    fn potje_op_id(&self, potje_id: i64) -> Result<PotjeInfo, Fout> {
        potje_info(&self.db, potje_id)
    }

    /// Een Speler rapporteert een Bericht of een andere Speler uit een Potje waar hij in zit.
    /// Hetzelfde Bericht (of dezelfde Speler) twee keer rapporteren geeft één Rapport.
    pub fn rapporteer(&mut self, melder_id: i64, potje_id: i64, r: NieuwRapport) -> Result<(), Fout> {
        lid_plek(&self.db, melder_id, potje_id)?;
        let (speler_id, bericht_id, tekst) = match (r.bericht_id, r.speler_id) {
            (Some(bericht_id), _) => {
                let b = self
                    .db
                    .rij("SELECT speler_id, tekst FROM bericht WHERE id = ?1 AND potje_id = ?2", p![bericht_id, potje_id])?
                    .ok_or(Fout::Onbekend("Unknown message"))?;
                (b.i64(0)?, Some(bericht_id), Some(b.tekst(1)?))
            }
            (None, Some(speler_id)) => {
                lid_plek(&self.db, speler_id, potje_id).map_err(|_| Fout::Onbekend("Unknown player"))?;
                (speler_id, None, None)
            }
            (None, None) => return Err(Fout::Ongeldig("Choose a message or a player to report")),
        };
        if speler_id == melder_id {
            return Err(Fout::Ongeldig("You cannot report yourself"));
        }
        // Boven de grens wordt het Rapport niet bewaard; de melder merkt dat niet (zoals bij een dubbel Rapport).
        let open = een(self.db.rij("SELECT COUNT(*) FROM rapport WHERE melder_id = ?1 AND gesloten = 0", p![melder_id])?)?.i64(0)?;
        if open >= MAX_OPEN_RAPPORTEN_PER_MELDER {
            return Ok(());
        }
        self.db.voer_uit(
            "INSERT OR IGNORE INTO rapport (melder_id, speler_id, potje_id, bericht_id, tekst) VALUES (?1, ?2, ?3, ?4, ?5)",
            p![melder_id, speler_id, potje_id, bericht_id, tekst],
        )
    }

    /// Blokkeert een andere Speler: zijn Berichten zie je niet meer. Twee keer blokkeren is geen fout.
    /// Alleen een Speler met wie je een Potje deelt (de app blokkeert vanuit de Chat): anders kon elk Speler-id via de
    /// blokkeerlijst een Spelersnaam opleveren. Een ander id is "Unknown player", net als een id dat niet bestaat.
    pub fn blokkeer(&mut self, speler_id: i64, ander_id: i64) -> Result<(), Fout> {
        if speler_id == ander_id {
            return Err(Fout::Ongeldig("You cannot block yourself"));
        }
        let bestaat = een(self.db.rij(
            "SELECT EXISTS(SELECT 1 FROM speler s WHERE s.id = ?1 AND s.verwijderd = 0
               AND EXISTS (SELECT 1 FROM potje_speler a JOIN potje_speler b ON b.potje_id = a.potje_id
                           WHERE a.speler_id = ?2 AND b.speler_id = ?1))",
            p![ander_id, speler_id],
        )?)?
        .bool(0)?;
        if !bestaat {
            return Err(Fout::Onbekend("Unknown player"));
        }
        // Blokkeren gaat voor: de ander verdwijnt uit de Vriendenlijst, in beide richtingen.
        let db = &self.db;
        db.transactie(|| {
            db.voer_uit("INSERT OR IGNORE INTO blokkade (speler_id, geblokkeerd_id) VALUES (?1, ?2)", p![speler_id, ander_id])?;
            db.voer_uit(
                "DELETE FROM vriend WHERE (speler_id = ?1 AND vriend_id = ?2) OR (speler_id = ?2 AND vriend_id = ?1)",
                p![speler_id, ander_id],
            )?;
            db.voer_uit(
                "DELETE FROM vriendverzoek WHERE (van_id = ?1 AND naar_id = ?2) OR (van_id = ?2 AND naar_id = ?1)",
                p![speler_id, ander_id],
            )?;
            // Een open Uitdaging tussen jullie gaat ook weg.
            db.voer_uit(
                "UPDATE uitdaging SET status = 'declined' WHERE potje_id IS NULL AND status IN ('open', 'accepted') AND ((van_id = ?1 AND naar_id = ?2) OR (van_id = ?2 AND naar_id = ?1))",
                p![speler_id, ander_id],
            )
        })
    }

    /// Geeft elke Speler zonder Vriendcode er een (de bestaande Spelers na de migratie). Verwijderde Spelers krijgen er geen.
    fn geef_ontbrekende_vriendcodes(&mut self) -> Result<(), Fout> {
        let db = &self.db;
        let zonder = db.rijen("SELECT id FROM speler WHERE vriendcode IS NULL AND verwijderd = 0", p![])?;
        if zonder.is_empty() {
            return Ok(());
        }
        db.transactie(|| {
            for r in zonder {
                let code = vrije_vriendcode(db)?;
                db.voer_uit("UPDATE speler SET vriendcode = ?1 WHERE id = ?2", p![code, r.i64(0)?])?;
            }
            Ok(())
        })
    }

    /// De Vriendenlijst van de Speler: zijn Vriendcode en de vrienden met Rating, de laatst gespeelde eerst.
    /// Een geblokkeerde Speler (in beide richtingen), een verwijderde Speler en een Computerspeler staan er nooit in.
    pub fn vriendenlijst(&self, speler_id: i64) -> Result<Vriendenlijst, Fout> {
        let vriendcode = self
            .db
            .rij("SELECT vriendcode FROM speler WHERE id = ?1 AND verwijderd = 0", p![speler_id])?
            .ok_or(Fout::Onbekend("Unknown player"))?
            .optie_tekst(0)?
            .ok_or_else(|| Fout::Intern("Speler zonder Vriendcode".into()))?;
        let vrienden = self
            .db
            .rijen(
                "SELECT s.id, s.spelersnaam, s.rating, v.laatst_ms FROM vriend v JOIN speler s ON s.id = v.vriend_id
                 WHERE v.speler_id = ?1 AND s.verwijderd = 0 AND s.computer IS NULL
                   AND NOT EXISTS (SELECT 1 FROM blokkade k WHERE (k.speler_id = ?1 AND k.geblokkeerd_id = s.id)
                                                              OR (k.speler_id = s.id AND k.geblokkeerd_id = ?1))
                 ORDER BY v.laatst_ms DESC, lower(s.spelersnaam), s.id",
                p![speler_id],
            )?
            .iter()
            .map(|r| Ok(Vriend { speler_id: r.i64(0)?, spelersnaam: r.tekst(1)?, rating: r.i64(2)?, laatst_ms: r.i64(3)? }))
            .collect::<Result<_, Fout>>()?;
        let verzoeken = self
            .db
            .rijen(
                "SELECT s.id, s.spelersnaam, v.tijd_ms FROM vriendverzoek v JOIN speler s ON s.id = v.van_id
                 WHERE v.naar_id = ?1 AND v.geweigerd = 0 AND s.verwijderd = 0 AND s.computer IS NULL
                   AND NOT EXISTS (SELECT 1 FROM blokkade k WHERE (k.speler_id = ?1 AND k.geblokkeerd_id = s.id)
                                                              OR (k.speler_id = s.id AND k.geblokkeerd_id = ?1))
                 ORDER BY v.tijd_ms, s.id",
                p![speler_id],
            )?
            .iter()
            .map(|r| Ok(Vriendverzoek { speler_id: r.i64(0)?, spelersnaam: r.tekst(1)?, tijd_ms: r.i64(2)? }))
            .collect::<Result<_, Fout>>()?;
        let nu = self.klok.nu_ms();
        let open = |sql: &str| -> Result<Vec<Uitdaging>, Fout> {
            self.db
                .rijen(sql, p![speler_id, nu - UITDAGING_GELDIG_MS, nu - UITDAGING_KEUZE_MS])?
                .iter()
                .map(|r| {
                    let antwoord = match r.tekst(8)?.as_str() {
                        "accepted" => "accepted",
                        "open" if r.i64(5)? > nu - UITDAGING_GELDIG_MS => "open",
                        _ => "declined",
                    };
                    Ok(Uitdaging {
                        id: r.i64(0)?,
                        speler_id: r.i64(1)?,
                        spelersnaam: r.tekst(2)?,
                        bord: r.tekst(3)?,
                        denktijd_s: r.optie_u32(4)?,
                        verloopt_ms: r.i64(5)? + UITDAGING_GELDIG_MS,
                        aantal_spelers: r.u32(6)?,
                        groep: r.i64(7)?,
                        antwoord,
                    })
                })
                .collect()
        };
        // Bij ?3 > 0: de tweede en derde parameter horen altijd samen mee te komen, ook als een vraag er een niet nodig heeft.
        let uitdagingen = open(
            "SELECT u.id, s.id, s.spelersnaam, u.bord, u.denktijd_s, u.tijd_ms, u.aantal, u.groep, u.status FROM uitdaging u JOIN speler s ON s.id = u.van_id
             WHERE u.naar_id = ?1 AND u.status = 'open' AND u.tijd_ms > ?2 AND ?3 > 0 AND s.verwijderd = 0
               AND EXISTS (SELECT 1 FROM vriend v WHERE v.speler_id = ?1 AND v.vriend_id = s.id)
               AND NOT EXISTS (SELECT 1 FROM blokkade k WHERE (k.speler_id = ?1 AND k.geblokkeerd_id = s.id)
                                                          OR (k.speler_id = s.id AND k.geblokkeerd_id = ?1))
             ORDER BY u.tijd_ms, u.id",
        )?;
        // Wie je uitdaagde en nog niet antwoordde, of accepteerde terwijl de groep op de anderen en op jouw keuze wacht. Bij een
        // Uitdaging aan meer vrienden blijft ook wie nee zei of te laat was staan (tot je kiest): zo vind je jouw keuze terug.
        let uitgedaagd = open(
            "SELECT u.id, s.id, s.spelersnaam, u.bord, u.denktijd_s, u.tijd_ms, u.aantal, u.groep, u.status FROM uitdaging u JOIN speler s ON s.id = u.naar_id
             WHERE u.van_id = ?1 AND u.potje_id IS NULL AND s.verwijderd = 0 AND u.tijd_ms > ?3 AND ?2 > 0
               AND (u.aantal > 2 OR (u.status = 'open' AND u.tijd_ms > ?2) OR u.status = 'accepted')
             ORDER BY u.tijd_ms, u.id",
        )?;
        Ok(Vriendenlijst { vriendcode, vrienden, verzoeken, uitdagingen, uitgedaagd })
    }

    /// Zoekt de Speler bij een Vriendcode (met of zonder spatie). Een onbekende code, een verwijderde Speler, een
    /// Computerspeler en een geblokkeerde Speler (in beide richtingen) zijn allemaal "Unknown friend code": wie
    /// geblokkeerd is, merkt zo niets. Jezelf toevoegen kan niet.
    fn vind_vriendcode(&self, speler_id: i64, code: &str) -> Result<(i64, String), Fout> {
        let cijfers: String = code.chars().filter(|c| !c.is_whitespace() && *c != '-').collect();
        if cijfers.len() != 8 || !cijfers.bytes().all(|b| b.is_ascii_digit()) {
            return Err(Fout::Onbekend("Unknown friend code"));
        }
        let r = self
            .db
            .rij(
                "SELECT id, spelersnaam FROM speler WHERE vriendcode = ?1 AND verwijderd = 0 AND computer IS NULL",
                p![&cijfers],
            )?
            .ok_or(Fout::Onbekend("Unknown friend code"))?;
        let (ander, naam) = (r.i64(0)?, r.tekst(1)?);
        if ander == speler_id {
            return Err(Fout::Ongeldig("You cannot add yourself"));
        }
        let geblokkeerd = een(self.db.rij(
            "SELECT EXISTS(SELECT 1 FROM blokkade WHERE (speler_id = ?1 AND geblokkeerd_id = ?2) OR (speler_id = ?2 AND geblokkeerd_id = ?1))",
            p![speler_id, ander],
        )?)?
        .bool(0)?;
        if geblokkeerd {
            return Err(Fout::Onbekend("Unknown friend code"));
        }
        Ok((ander, naam))
    }

    /// De Spelersnaam bij een Vriendcode, voor het scherm "Add friend" (je ziet wie je toevoegt voor je tikt).
    pub fn zoek_vriendcode(&self, speler_id: i64, code: &str) -> Result<VriendKandidaat, Fout> {
        let (ander, spelersnaam) = self.vind_vriendcode(speler_id, code)?;
        let vrienden = self.is_vriend(speler_id, ander)?;
        Ok(VriendKandidaat { spelersnaam, vrienden })
    }

    fn is_vriend(&self, speler_id: i64, ander: i64) -> Result<bool, Fout> {
        een(self.db.rij("SELECT EXISTS(SELECT 1 FROM vriend WHERE speler_id = ?1 AND vriend_id = ?2)", p![speler_id, ander])?)?.bool(0)
    }

    /// Stuurt een Vriendverzoek naar de Speler met deze Vriendcode. Vroeg de ander jou al, dan zijn jullie meteen
    /// vrienden. Een tweede verzoek, of een verzoek dat de ander al weigerde, geeft hetzelfde antwoord zonder nieuwe
    /// Melding: de aanvrager merkt van een weigering niets.
    pub fn vraag_vriend(&mut self, speler_id: i64, code: &str) -> Result<VerzoekUitkomst, Fout> {
        let (ander, spelersnaam) = self.vind_vriendcode(speler_id, code)?;
        let nu = self.klok.nu_ms();
        let db = &self.db;
        let van_naam = een(db.rij("SELECT spelersnaam FROM speler WHERE id = ?1", p![speler_id])?)?.tekst(0)?;
        db.transactie(|| {
            let klaar = |vrienden, melding| {
                Ok(VerzoekUitkomst { spelersnaam: spelersnaam.clone(), vrienden, aan: ander, melding, van_naam: van_naam.clone() })
            };
            if een(db.rij("SELECT EXISTS(SELECT 1 FROM vriend WHERE speler_id = ?1 AND vriend_id = ?2)", p![speler_id, ander])?)?.bool(0)? {
                return klaar(true, false);
            }
            // De ander vroeg jou al (ook als jij dat verzoek weigerde): jij wilt nu ook, dus vrienden.
            let omgekeerd = db.rij("SELECT 1 FROM vriendverzoek WHERE van_id = ?1 AND naar_id = ?2", p![ander, speler_id])?.is_some();
            if omgekeerd {
                maak_vrienden(db, speler_id, ander, nu)?;
                return klaar(true, false);
            }
            // Een eerder verzoek (ook een geweigerd) blijft zoals het was: zelfde antwoord, geen nieuwe Melding.
            let aantal = db.rij("SELECT COUNT(*) FROM vriendverzoek WHERE van_id = ?1 AND naar_id = ?2", p![speler_id, ander])?;
            if aantal.map_or(Ok(0), |r| r.i64(0))? > 0 {
                return klaar(false, false);
            }
            db.voer_uit("INSERT INTO vriendverzoek (van_id, naar_id, tijd_ms) VALUES (?1, ?2, ?3)", p![speler_id, ander, nu])?;
            klaar(false, true)
        })
    }

    /// Keurt het Vriendverzoek van `van_id` goed: jullie staan in elkaars Vriendenlijst. Geeft de Spelersnaam van de aanvrager.
    pub fn keur_vriendverzoek_goed(&mut self, speler_id: i64, van_id: i64) -> Result<String, Fout> {
        let nu = self.klok.nu_ms();
        let db = &self.db;
        db.transactie(|| {
            let r = db
                .rij(
                    "SELECT s.spelersnaam FROM vriendverzoek v JOIN speler s ON s.id = v.van_id
                     WHERE v.van_id = ?1 AND v.naar_id = ?2 AND v.geweigerd = 0 AND s.verwijderd = 0
                       AND NOT EXISTS (SELECT 1 FROM blokkade k WHERE (k.speler_id = ?2 AND k.geblokkeerd_id = ?1)
                                                                  OR (k.speler_id = ?1 AND k.geblokkeerd_id = ?2))",
                    p![van_id, speler_id],
                )?
                .ok_or(Fout::Onbekend("Unknown friend request"))?;
            maak_vrienden(db, speler_id, van_id, nu)?;
            r.tekst(0)
        })
    }

    /// Weigert het Vriendverzoek van `van_id`. De aanvrager merkt niets; een onbekend verzoek is geen fout.
    pub fn weiger_vriendverzoek(&mut self, speler_id: i64, van_id: i64) -> Result<(), Fout> {
        self.db.voer_uit("UPDATE vriendverzoek SET geweigerd = 1 WHERE van_id = ?1 AND naar_id = ?2", p![van_id, speler_id])
    }

    /// Daagt een vriend uit voor een live Potje van twee op dit bord (`denktijd_s` leeg is geen limiet). Jullie moeten in elkaars
    /// Vriendenlijst staan (wie jou weghaalde, krijgt geen Uitdaging en geen Melding meer van je); een geblokkeerde, verwijderde of onbekende Speler is "Unknown player". Zolang een eerdere Uitdaging aan
    /// deze vriend openstaat (5 minuten, of tot hij antwoordt), kan het niet nog eens.
    pub fn daag_uit(&mut self, speler_id: i64, vriend_id: i64, bord: &str, denktijd_s: Option<i64>) -> Result<UitdagingUitkomst, Fout> {
        self.daag_vrienden_uit(speler_id, &[vriend_id], bord, denktijd_s)
    }

    /// Daagt een tot vijf vrienden tegelijk uit voor een live Potje van twee tot zes Spelers (jij mee) op dit bord. Het bord moet
    /// dat aantal kennen. Voor elke vriend gelden dezelfde regels als bij [`Opslag::daag_uit`]; mislukt het voor één, dan mislukt het
    /// voor allemaal. Het id in de uitkomst is dat van de hele Uitdaging.
    pub fn daag_vrienden_uit(
        &mut self,
        speler_id: i64,
        vriend_ids: &[i64],
        bord: &str,
        denktijd_s: Option<i64>,
    ) -> Result<UitdagingUitkomst, Fout> {
        if vriend_ids.is_empty() || vriend_ids.len() > UITDAGING_MAX_VRIENDEN {
            return Err(Fout::Ongeldig("Challenge 1 to 5 friends at once"));
        }
        let mut uniek = vriend_ids.to_vec();
        uniek.sort_unstable();
        uniek.dedup();
        if uniek.len() != vriend_ids.len() {
            return Err(Fout::Ongeldig("Choose each friend only once"));
        }
        let aantal = vriend_ids.len() as u32 + 1;
        controleer_potjekeuze(bord, aantal, denktijd_s)?;
        eis_niet_geweerd(&self.db, speler_id)?;
        let nu = self.klok.nu_ms();
        let db = &self.db;
        db.transactie(|| {
            let van_naam = een(db.rij("SELECT spelersnaam FROM speler WHERE id = ?1", p![speler_id])?)?.tekst(0)?;
            let mut namen = Vec::new();
            for &vriend_id in vriend_ids {
                let r = db
                    .rij(
                        "SELECT s.spelersnaam FROM vriend v JOIN speler s ON s.id = v.vriend_id
                         WHERE v.speler_id = ?1 AND v.vriend_id = ?2 AND s.verwijderd = 0 AND s.computer IS NULL
                           AND EXISTS (SELECT 1 FROM vriend w WHERE w.speler_id = ?2 AND w.vriend_id = ?1)
                           AND NOT EXISTS (SELECT 1 FROM blokkade k WHERE (k.speler_id = ?1 AND k.geblokkeerd_id = ?2)
                                                                      OR (k.speler_id = ?2 AND k.geblokkeerd_id = ?1))",
                        p![speler_id, vriend_id],
                    )?
                    .ok_or(Fout::Onbekend("Unknown player"))?;
                namen.push(r.tekst(0)?);
            }
            db.voer_uit("DELETE FROM uitdaging WHERE tijd_ms < ?1", p![nu - UITDAGING_BEWAAR_MS])?;
            for &vriend_id in vriend_ids {
                // Loopt nog: onbeantwoord (5 minuten) of geaccepteerd terwijl de groep op de anderen wacht.
                let open = een(db.rij(
                    "SELECT EXISTS(SELECT 1 FROM uitdaging WHERE van_id = ?1 AND naar_id = ?2 AND potje_id IS NULL
                       AND ((status = 'open' AND tijd_ms > ?3) OR (status = 'accepted' AND tijd_ms > ?4)))",
                    p![speler_id, vriend_id, nu - UITDAGING_GELDIG_MS, nu - UITDAGING_KEUZE_MS],
                )?)?
                .bool(0)?;
                if open {
                    return Err(Fout::Conflict("You already challenged this friend"));
                }
            }
            eis_ruimte_voor_denktijd(db, speler_id, denktijd_s)?;
            maak_ruimte_voor_potje(db, speler_id)?;
            let mut groep = None;
            for &vriend_id in vriend_ids {
                let id = nieuw_id(&db.rijen(
                    "INSERT INTO uitdaging (van_id, naar_id, bord, denktijd_s, tijd_ms, groep, aantal) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7) RETURNING id",
                    p![speler_id, vriend_id, bord, denktijd_s, nu, groep, aantal],
                )?)?;
                if groep.is_none() {
                    groep = Some(id);
                    db.voer_uit("UPDATE uitdaging SET groep = id WHERE id = ?1", p![id])?;
                }
            }
            let id = groep.ok_or_else(|| Fout::Intern("geen Uitdaging gemaakt".into()))?;
            Ok(UitdagingUitkomst { id, spelersnaam: namen.join(", "), verloopt_ms: nu + UITDAGING_GELDIG_MS, aan: vriend_ids.to_vec(), van_naam })
        })
    }

    /// Waar de Uitdaging van deze Speler nu staat, voor de uitdager (het id uit [`Opslag::daag_vrienden_uit`]) en voor een
    /// uitgedaagde vriend (het id uit zijn Vriendenlijst). Een open Uitdaging na 5 minuten is `expired`; bij `accepted` hoort het
    /// Potje. Bij meer vrienden is het `choice` zodra iemand nee zei of de 5 minuten om zijn: dan kiest de uitdager
    /// ([`Opslag::start_uitdaging`]).
    pub fn uitdaging_stand(&self, speler_id: i64, uitdaging_id: i64) -> Result<UitdagingStand, Fout> {
        let nu = self.klok.nu_ms();
        let db = &self.db;
        let rijen = db.rijen(
            "SELECT s.spelersnaam, u.status, u.tijd_ms, u.potje_id, u.aantal FROM uitdaging u JOIN speler s ON s.id = u.naar_id
             WHERE u.groep = ?1 AND u.van_id = ?2 ORDER BY u.id",
            p![uitdaging_id, speler_id],
        )?;
        if rijen.is_empty() {
            return self.uitdaging_stand_uitgedaagde(speler_id, uitdaging_id);
        }
        let aantal = rijen[0].u32(4)?;
        let tijd_ms = rijen[0].i64(2)?;
        let potje_id = rijen.iter().find_map(|r| r.optie_i64(3).ok().flatten());
        let mut stand = UitdagingStand {
            status: "open",
            potje: None,
            aantal_spelers: aantal,
            geaccepteerd: Vec::new(),
            geweigerd: 0,
            wachtend: 0,
            kan_beginnen: false,
        };
        if let Some(id) = potje_id {
            stand.status = "accepted";
            stand.potje = Some(potje_info(db, id)?);
            return Ok(stand);
        }
        let verlopen = nu >= tijd_ms + UITDAGING_GELDIG_MS;
        for r in &rijen {
            match r.tekst(1)?.as_str() {
                "accepted" => stand.geaccepteerd.push(r.tekst(0)?),
                "open" if !verlopen => stand.wachtend += 1,
                _ => {}
            }
        }
        // Een rij die er niet meer is (een verwijderde vriend) telt als nee.
        stand.geweigerd = aantal - 1 - stand.geaccepteerd.len() as u32 - stand.wachtend;
        if aantal == 2 {
            // Eén vriend: nee of niet op tijd is "Not now"; er valt niets te kiezen.
            stand.status = match rijen[0].tekst(1)?.as_str() {
                "declined" => "declined",
                _ if verlopen => "expired",
                _ => "open",
            };
        } else if stand.geweigerd > 0 {
            stand.status = if nu < tijd_ms + UITDAGING_KEUZE_MS { "choice" } else { "expired" };
            stand.kan_beginnen =
                !stand.geaccepteerd.is_empty() && controleer_potjekeuze(&bord_van(db, uitdaging_id, speler_id)?, stand.geaccepteerd.len() as u32 + 1, None).is_ok();
        }
        Ok(stand)
    }

    /// De stand van een Uitdaging voor de vriend die haar kreeg.
    fn uitdaging_stand_uitgedaagde(&self, speler_id: i64, uitdaging_id: i64) -> Result<UitdagingStand, Fout> {
        let nu = self.klok.nu_ms();
        let r = self
            .db
            .rij("SELECT status, tijd_ms, potje_id, aantal FROM uitdaging WHERE id = ?1 AND naar_id = ?2", p![uitdaging_id, speler_id])?
            .ok_or(Fout::Onbekend("Unknown challenge"))?;
        let (status, tijd_ms, potje_id, aantal) = (r.tekst(0)?, r.i64(1)?, r.optie_i64(2)?, r.u32(3)?);
        let (status, potje) = match (status.as_str(), potje_id) {
            ("accepted", Some(id)) => ("accepted", Some(potje_info(&self.db, id)?)),
            // Geaccepteerd: wacht op de anderen en op de keuze van de uitdager, tot die keuze verloopt.
            ("accepted", None) if nu < tijd_ms + UITDAGING_KEUZE_MS => ("open", None),
            ("open", _) if nu < tijd_ms + UITDAGING_GELDIG_MS => ("open", None),
            ("declined", _) => ("declined", None),
            _ => ("expired", None),
        };
        Ok(UitdagingStand { status, potje, aantal_spelers: aantal, geaccepteerd: Vec::new(), geweigerd: 0, wachtend: 0, kan_beginnen: false })
    }

    /// Accept: de Uitdaging van een vriend aan deze Speler. Heeft iedereen die is uitgedaagd nu geaccepteerd, dan wordt het een live
    /// Potje voor allen en geeft dit dat Potje; het begint meteen. De uitdager heeft plek 1, de anderen volgen in de volgorde van de
    /// Uitdaging. Wachten er nog vrienden, dan geeft dit `None`: de stand van de Uitdaging laat zien wanneer het Potje er is. Een
    /// Uitdaging die niet (meer) openstaat, is "Unknown challenge".
    pub fn accepteer_uitdaging(&mut self, speler_id: i64, uitdaging_id: i64) -> Result<Option<PotjeInfo>, Fout> {
        let nu = self.klok.nu_ms();
        let db = &self.db;
        let potje_id = db.transactie(|| {
            let r = db
                .rij(
                    "SELECT u.van_id, u.bord, u.denktijd_s, u.groep, u.aantal FROM uitdaging u JOIN speler s ON s.id = u.van_id
                     WHERE u.id = ?1 AND u.naar_id = ?2 AND u.status = 'open' AND u.tijd_ms > ?3 AND s.verwijderd = 0
                       AND EXISTS (SELECT 1 FROM vriend v WHERE v.speler_id = ?2 AND v.vriend_id = u.van_id)
                       AND NOT EXISTS (SELECT 1 FROM blokkade k WHERE (k.speler_id = ?2 AND k.geblokkeerd_id = u.van_id)
                                                                  OR (k.speler_id = u.van_id AND k.geblokkeerd_id = ?2))",
                    p![uitdaging_id, speler_id, nu - UITDAGING_GELDIG_MS],
                )?
                .ok_or(Fout::Onbekend("Unknown challenge"))?;
            let (van_id, bord, denktijd_s, groep, aantal) = (r.i64(0)?, r.tekst(1)?, r.optie_i64(2)?, r.i64(3)?, r.u32(4)?);
            eis_niet_geweerd(db, speler_id)?;
            eis_niet_geweerd(db, van_id)?;
            db.voer_uit("UPDATE uitdaging SET status = 'accepted' WHERE id = ?1", p![uitdaging_id])?;
            let geaccepteerd = db.rijen("SELECT naar_id FROM uitdaging WHERE groep = ?1 AND status = 'accepted' ORDER BY id", p![groep])?;
            if (geaccepteerd.len() as u32) + 1 < aantal {
                return Ok(None);
            }
            let mut spelers = vec![van_id];
            for r in &geaccepteerd {
                spelers.push(r.i64(0)?);
            }
            // Valt er iemand af (geweerd, of een Blokkade met een ander in het Potje), dan kiest de uitdager.
            if laat_niet_toegelaten_afvallen(db, groep, &mut spelers)? {
                return Ok(None);
            }
            let potje_id = maak_uitdaging_potje(db, groep, &bord, denktijd_s, aantal, &spelers, nu)?;
            Ok(Some(potje_id))
        })?;
        potje_id.map(|id| self.potje_op_id(id)).transpose()
    }

    /// De uitdager kiest, nadat bij een Uitdaging aan meer vrienden iemand nee zei of de 5 minuten om zijn ([`UitdagingStand`]
    /// is dan `choice`): beginnen met wie accepteerde (het bord moet dat aantal Spelers kennen) of de lege plekken met
    /// Computerspelers vullen. Een Computerspeler ziet er in het Potje uit als een gewone Speler. Wie nog niet antwoordde, doet
    /// niet mee. Geeft het Potje, dat meteen begint.
    pub fn start_uitdaging(&mut self, speler_id: i64, uitdaging_id: i64, keuze: UitdagingKeuze) -> Result<PotjeInfo, Fout> {
        let nu = self.klok.nu_ms();
        let db = &self.db;
        let potje_id = db.transactie(|| {
            let rijen = db.rijen(
                "SELECT naar_id, status, tijd_ms, potje_id, aantal, bord, denktijd_s FROM uitdaging WHERE groep = ?1 AND van_id = ?2 ORDER BY id",
                p![uitdaging_id, speler_id],
            )?;
            let eerste = rijen.first().ok_or(Fout::Onbekend("Unknown challenge"))?;
            let (tijd_ms, aantal, bord, denktijd_s) = (eerste.i64(2)?, eerste.u32(4)?, eerste.tekst(5)?, eerste.optie_i64(6)?);
            if rijen.iter().any(|r| r.optie_i64(3).ok().flatten().is_some()) {
                return Err(Fout::Conflict("This challenge has already started"));
            }
            if nu >= tijd_ms + UITDAGING_KEUZE_MS {
                return Err(Fout::Onbekend("Unknown challenge"));
            }
            let mut spelers = vec![speler_id];
            let mut wachtend = 0;
            for r in &rijen {
                match r.tekst(1)?.as_str() {
                    "accepted" => spelers.push(r.i64(0)?),
                    "open" if nu < tijd_ms + UITDAGING_GELDIG_MS => wachtend += 1,
                    _ => {}
                }
            }
            laat_niet_toegelaten_afvallen(db, uitdaging_id, &mut spelers)?;
            let geweigerd = aantal - 1 - (spelers.len() as u32 - 1) - wachtend;
            if aantal == 2 || geweigerd == 0 {
                return Err(Fout::Conflict("Wait for the answers first"));
            }
            eis_niet_geweerd(db, speler_id)?;
            let totaal = match keuze {
                UitdagingKeuze::Computer => aantal,
                UitdagingKeuze::Beginnen => {
                    if spelers.len() < 2 {
                        return Err(Fout::Ongeldig("Nobody accepted yet"));
                    }
                    controleer_potjekeuze(&bord, spelers.len() as u32, None)?;
                    spelers.len() as u32
                }
            };
            let potje_id = maak_uitdaging_potje(db, uitdaging_id, &bord, denktijd_s, totaal, &spelers, nu)?;
            // Wie nog niet antwoordde, is er nu niet meer bij.
            db.voer_uit("UPDATE uitdaging SET status = 'declined' WHERE groep = ?1 AND status = 'open'", p![uitdaging_id])?;
            Ok(potje_id)
        })?;
        self.potje_op_id(potje_id)
    }

    /// Decline: de uitdager ziet "Not now" (bij meer vrienden kiest hij wat er gebeurt). Een Uitdaging die er niet (meer) is, is geen fout.
    ///
    /// De uitdager kan zijn eigen Uitdaging (het id uit [`Opslag::daag_vrienden_uit`]) ook zo intrekken: wie nog wacht of al
    /// accepteerde, ziet dat ze er niet meer is. Dit kan niet meer zodra het Potje begon.
    pub fn weiger_uitdaging(&mut self, speler_id: i64, uitdaging_id: i64) -> Result<(), Fout> {
        let db = &self.db;
        db.transactie(|| {
            db.voer_uit(
                "UPDATE uitdaging SET status = 'declined' WHERE id = ?1 AND naar_id = ?2 AND status = 'open'",
                p![uitdaging_id, speler_id],
            )?;
            db.voer_uit(
                "DELETE FROM uitdaging WHERE groep = ?1 AND van_id = ?2 AND potje_id IS NULL",
                p![uitdaging_id, speler_id],
            )
        })
    }

    /// Haalt een naam uit de Vriendenlijst van de Speler (alleen uit zijn eigen lijst). Niet in de lijst is geen fout.
    /// Een Uitdaging tussen jullie die nog openstaat, en een Vriendverzoek van de Speler aan de ander, gaan dan ook weg.
    pub fn verwijder_vriend(&mut self, speler_id: i64, vriend_id: i64) -> Result<(), Fout> {
        let db = &self.db;
        db.transactie(|| {
            db.voer_uit("DELETE FROM vriend WHERE speler_id = ?1 AND vriend_id = ?2", p![speler_id, vriend_id])?;
            // Een oud Vriendverzoek van jou aan hem gaat ook weg: goedkeuren zou hem anders terugzetten.
            db.voer_uit("DELETE FROM vriendverzoek WHERE van_id = ?1 AND naar_id = ?2", p![speler_id, vriend_id])?;
            db.voer_uit(
                "UPDATE uitdaging SET status = 'declined' WHERE potje_id IS NULL AND status IN ('open', 'accepted') AND ((van_id = ?1 AND naar_id = ?2) OR (van_id = ?2 AND naar_id = ?1))",
                p![speler_id, vriend_id],
            )
        })
    }

    /// Haalt een blokkade weg. Een Speler die niet geblokkeerd is, is geen fout.
    pub fn deblokkeer(&mut self, speler_id: i64, ander_id: i64) -> Result<(), Fout> {
        self.db.voer_uit("DELETE FROM blokkade WHERE speler_id = ?1 AND geblokkeerd_id = ?2", p![speler_id, ander_id])
    }

    /// De Spelers die deze Speler blokkeerde, op Spelersnaam.
    pub fn blokkades(&self, speler_id: i64) -> Result<Vec<GeblokkeerdeSpeler>, Fout> {
        self.db
            .rijen(
                "SELECT s.id, s.spelersnaam FROM blokkade k JOIN speler s ON s.id = k.geblokkeerd_id
                 WHERE k.speler_id = ?1 ORDER BY lower(s.spelersnaam), s.id",
                p![speler_id],
            )?
            .iter()
            .map(|r| Ok(GeblokkeerdeSpeler { speler_id: r.i64(0)?, spelersnaam: r.tekst(1)? }))
            .collect()
    }

    /// De Spelers die `speler_id` blokkeerden: een live Bericht van hem gaat niet naar hen.
    pub fn blokkeerders_van(&self, speler_id: i64) -> Result<Vec<i64>, Fout> {
        self.db
            .rijen("SELECT speler_id FROM blokkade WHERE geblokkeerd_id = ?1", p![speler_id])?
            .iter()
            .map(|r| r.i64(0))
            .collect()
    }

    /// Het aantal open Rapporten, voor de beheerpagina.
    pub fn aantal_open_rapporten(&self) -> Result<i64, Fout> {
        een(self.db.rij("SELECT COUNT(*) FROM rapport WHERE gesloten = 0", &[])?)?.i64(0)
    }

    /// De open Rapporten, het nieuwste eerst, hooguit [`MAX_RAPPORTEN_OP_PAGINA`]. Alleen voor de beheerpagina.
    pub fn open_rapporten(&self) -> Result<Vec<RapportRegel>, Fout> {
        self.db
            .rijen(
                "SELECT r.id, r.potje_id, r.tijd, m.spelersnaam, r.speler_id, s.spelersnaam, r.tekst, r.bericht_id,
                        COALESCE((SELECT b.verborgen FROM bericht b WHERE b.id = r.bericht_id), 0), s.geweerd
                 FROM rapport r JOIN speler m ON m.id = r.melder_id JOIN speler s ON s.id = r.speler_id
                 WHERE r.gesloten = 0 ORDER BY r.id DESC LIMIT ?1",
                p![MAX_RAPPORTEN_OP_PAGINA],
            )?
            .iter()
            .map(|r| {
                Ok(RapportRegel {
                    id: r.i64(0)?,
                    potje_id: r.i64(1)?,
                    tijd: r.i64(2)?,
                    melder: r.tekst(3)?,
                    speler_id: r.i64(4)?,
                    spelersnaam: r.tekst(5)?,
                    tekst: r.optie_tekst(6)?,
                    bericht_id: r.optie_i64(7)?,
                    bericht_verborgen: r.bool(8)?,
                    speler_geweerd: r.bool(9)?,
                })
            })
            .collect()
    }

    /// Verbergt het Bericht van een Rapport voor iedereen.
    pub fn verberg_bericht(&mut self, rapport_id: i64) -> Result<(), Fout> {
        let bericht_id = self.rapport(rapport_id)?.optie_i64(1)?.ok_or(Fout::Ongeldig("This report has no message"))?;
        self.db.voer_uit("UPDATE bericht SET verborgen = 1 WHERE id = ?1", p![bericht_id])
    }

    /// Weert de gerapporteerde Speler: geen Berichten meer, geen nieuwe Potjes en niet meer meedoen.
    pub fn weer_speler(&mut self, rapport_id: i64) -> Result<(), Fout> {
        let speler_id = self.rapport(rapport_id)?.i64(0)?;
        self.db.voer_uit("UPDATE speler SET geweerd = 1 WHERE id = ?1", p![speler_id])
    }

    /// Sluit een Rapport: het staat niet meer op de beheerpagina.
    pub fn sluit_rapport(&mut self, rapport_id: i64) -> Result<(), Fout> {
        self.rapport(rapport_id)?;
        self.db.voer_uit("UPDATE rapport SET gesloten = 1 WHERE id = ?1", p![rapport_id])
    }

    /// De gerapporteerde Speler en het Bericht van een Rapport.
    fn rapport(&self, rapport_id: i64) -> Result<Rij, Fout> {
        self.db
            .rij("SELECT speler_id, bericht_id FROM rapport WHERE id = ?1", p![rapport_id])?
            .ok_or(Fout::Onbekend("Unknown report"))
    }
}

/// Een geweerde Speler mag geen Berichten sturen en geen Potjes maken of meedoen.
/// De kern van [`Opslag::voeg_computerspeler_toe`], binnen een lopende transactie.
fn computerspeler_in(db: &impl Db, potje_id: i64, nu: i64) -> Result<Stand, Fout> {
    let info = potje_info(db, potje_id)?;
    if info.vol {
        return Err(Fout::Vol);
    }
    if info.spelers.iter().all(|s| s.computer.is_some()) {
        return Err(Fout::Conflict("A game needs at least one player"));
    }
    let mut toeval = [0u8; 1];
    getrandom::fill(&mut toeval).map_err(|e| Fout::Intern(e.to_string()))?;
    let kies = |lijst: &[&'static str]| lijst[toeval[0] as usize % lijst.len()];
    let vrij: Vec<&'static str> = COMPUTER_NAMEN
        .iter()
        .copied()
        .filter(|n| !info.spelers.iter().any(|s| s.spelersnaam == *n))
        .collect();
    let speler_id = if info.snel {
        // Een Snel potje: de Computerspeler met de Rating die het dichtst bij die van de wachtende Speler ligt.
        // Ligt er geen binnen COMPUTER_MAX_VERSCHIL, dan komt er een nieuwe bij met een niveau dat past.
        let mensen: Vec<i64> = info.spelers.iter().filter(|s| s.computer.is_none()).filter_map(|s| s.rating).collect();
        let doel = mensen.iter().sum::<i64>() / mensen.len().max(1) as i64;
        let bestaand = db.rijen("SELECT id, spelersnaam, rating FROM speler WHERE computer IS NOT NULL AND verwijderd = 0", &[])?;
        let mut kandidaten = Vec::new();
        for r in &bestaand {
            let naam = r.tekst(1)?;
            if !info.spelers.iter().any(|s| s.spelersnaam == naam) {
                kandidaten.push((r.i64(0)?, (r.i64(2)? - doel).abs()));
            }
        }
        let dichtst = kandidaten.iter().map(|k| k.1).min();
        let gebruikt: Vec<String> = bestaand.iter().map(|r| r.tekst(1)).collect::<Result<_, _>>()?;
        let nieuw: Vec<&'static str> = vrij.iter().copied().filter(|n| !gebruikt.iter().any(|g| g == n)).collect();
        match dichtst {
            Some(d) if d <= COMPUTER_MAX_VERSCHIL || nieuw.is_empty() => {
                let gelijk: Vec<i64> = kandidaten.iter().filter(|k| k.1 == d).map(|k| k.0).collect();
                gelijk[toeval[0] as usize % gelijk.len()]
            }
            _ => {
                let naam = kies(if nieuw.is_empty() { &vrij } else { &nieuw });
                let (niveau, start) = computer_niveau_voor(doel);
                let niveau = if info.aantal_spelers > SNEL_AANTAL { niveau.min(COMPUTER_MAX_NIVEAU_MEER) } else { niveau };
                nieuw_id(&db.rijen(
                    "INSERT INTO speler (spelersnaam, sleutel_hash, herstel_hash, computer, rating) VALUES (?1, ?2, ?3, ?4, ?5) RETURNING id",
                    p![naam, codes::hash(&codes::nieuwe_sleutel()), codes::hash(&codes::normaliseer(&codes::nieuwe_herstelcode())), niveau, start],
                )?)?
            }
        }
    } else {
        let naam = kies(&vrij);
        // Eén rij per naam, voor alle Potjes samen: de tabel groeit niet met elk Potje.
        let bestaand = db.rij("SELECT id FROM speler WHERE computer = ?2 AND spelersnaam = ?1", p![naam, COMPUTER_NIVEAU])?;
        match bestaand {
            Some(r) => r.i64(0)?,
            None => nieuw_id(&db.rijen(
                "INSERT INTO speler (spelersnaam, sleutel_hash, herstel_hash, computer) VALUES (?1, ?2, ?3, ?4) RETURNING id",
                // Sleutel en Herstelcode worden meteen weggegooid: niemand kan als deze Speler inloggen.
                p![naam, codes::hash(&codes::nieuwe_sleutel()), codes::hash(&codes::normaliseer(&codes::nieuwe_herstelcode())), COMPUTER_NIVEAU],
            )?)?,
        }
    };
    let bezet = info.spelers.len() as u32;
    db.voer_uit("INSERT INTO potje_speler (potje_id, plek, speler_id) VALUES (?1, ?2, ?3)", p![potje_id, bezet, speler_id])?;
    if bezet + 1 >= info.aantal_spelers {
        db.voer_uit("UPDATE potje SET gestart_ms = ?2, zoek_tot_ms = NULL WHERE id = ?1", p![potje_id, nu])?;
        // De eerste beurt kan ook van een Computerspeler zijn.
        let info = potje_info(db, potje_id)?;
        let Afgespeeld { game, versie, .. } = speel_af(db, &info)?;
        plan_computer(db, &info, &game, versie, nu)?;
    }
    stand_van(db, potje_id, nu)
}

/// Elo voor `ratings.len()` Spelers. `plaatsen[i]` is de plaats van Speler i (0 is de beste); een gelijke plaats
/// is gelijkspel. Elk paar telt als een apart Potje met factor `RATING_K / (n - 1)`, zodat de som van de
/// veranderingen ongeveer nul blijft en een Potje met 6 Spelers niet 5 keer zoveel verschuift.
fn nieuwe_ratings(ratings: &[i64], plaatsen: &[usize]) -> Vec<i64> {
    let n = ratings.len();
    if n < 2 {
        return ratings.to_vec();
    }
    let k = RATING_K / (n - 1) as f64;
    (0..n)
        .map(|i| {
            let verschil: f64 = (0..n)
                .filter(|&j| j != i)
                .map(|j| {
                    let kans = 1.0 / (1.0 + 10f64.powf((ratings[j] - ratings[i]) as f64 / 400.0));
                    let uitslag = match plaatsen[i].cmp(&plaatsen[j]) {
                        std::cmp::Ordering::Less => 1.0,
                        std::cmp::Ordering::Equal => 0.5,
                        std::cmp::Ordering::Greater => 0.0,
                    };
                    uitslag - kans
                })
                .sum();
            (ratings[i] + (k * verschil).round() as i64).max(RATING_MIN)
        })
        .collect()
}

/// Verwerkt de Rating van een net afgelopen Snel potje volgens de eindvolgorde van halma-core.
/// Wie niet in de eindvolgorde staat (opgegeven, ook door drie gemiste beurten) deelt de laatste plaats.
fn werk_ratings_bij(db: &impl Db, info: &mut PotjeInfo, game: &Game) -> Result<(), Fout> {
    let al = een(db.rij("SELECT COUNT(*) FROM rating_wijziging WHERE potje_id = ?1", p![info.potje_id])?)?.i64(0)?;
    if al > 0 {
        return Ok(());
    }
    let voor = info
        .spelers
        .iter()
        .map(|s| Ok(een(db.rij("SELECT rating FROM speler WHERE id = ?1", p![s.speler_id])?)?.i64(0)?))
        .collect::<Result<Vec<i64>, Fout>>()?;
    let ranking = game.ranking();
    let plaatsen: Vec<usize> =
        info.spelers.iter().map(|s| ranking.iter().position(|&x| x + 1 == s.plek as usize).unwrap_or(ranking.len())).collect();
    let na = nieuwe_ratings(&voor, &plaatsen);
    for (i, s) in info.spelers.iter_mut().enumerate() {
        s.rating = Some(na[i]);
        db.voer_uit("UPDATE speler SET rating = ?2 WHERE id = ?1", p![s.speler_id, na[i]])?;
        db.voer_uit(
            "INSERT INTO rating_wijziging (potje_id, speler_id, voor, na) VALUES (?1, ?2, ?3, ?4)",
            p![info.potje_id, s.speler_id, voor[i], na[i]],
        )?;
    }
    Ok(())
}

fn rating_wijzigingen(db: &impl Db, potje_id: i64) -> HashMap<i64, RatingVerandering> {
    let rijen = db.rijen("SELECT speler_id, voor, na FROM rating_wijziging WHERE potje_id = ?1", p![potje_id]).unwrap_or_default();
    rijen
        .iter()
        .filter_map(|r| Some((r.i64(0).ok()?, RatingVerandering { voor: r.i64(1).ok()?, na: r.i64(2).ok()? })))
        .collect()
}

/// Het niveau (0, 1 of 2) en de startRating van een nieuwe Computerspeler die past bij een Speler met deze Rating.
fn computer_niveau_voor(rating: i64) -> (u32, i64) {
    match rating {
        r if r < 900 => (0, 800),
        r if r < 1100 => (1, 1000),
        _ => (2, 1200),
    }
}

/// Haalt een Potje dat nog wacht helemaal weg (Spelers, Berichten, Rapporten en het Potje zelf).
/// Een datum `jjjj-mm-dd` als dagnummer sinds 1970-01-01, of `None` als het geen echte dag is.
fn datum_naar_dag(datum: &str) -> Option<i64> {
    let b = datum.as_bytes();
    if b.len() != 10 || b[4] != b'-' || b[7] != b'-' {
        return None;
    }
    let deel = |a: usize, e: usize| datum.get(a..e).filter(|t| t.bytes().all(|c| c.is_ascii_digit())).and_then(|t| t.parse::<i64>().ok());
    let (j, m, d) = (deel(0, 4)?, deel(5, 7)?, deel(8, 10)?);
    let schrikkel = (j % 4 == 0 && j % 100 != 0) || j % 400 == 0;
    let lengte = match m {
        1 | 3 | 5 | 7 | 8 | 10 | 12 => 31,
        4 | 6 | 9 | 11 => 30,
        2 => 28 + schrikkel as i64,
        _ => return None,
    };
    if d < 1 || d > lengte {
        return None;
    }
    // Dagen sinds 1970 (Howard Hinnant, days_from_civil).
    let jaar = if m <= 2 { j - 1 } else { j };
    let era = jaar.div_euclid(400);
    let yoe = jaar - era * 400;
    let doy = (153 * (if m > 2 { m - 3 } else { m + 9 }) + 2) / 5 + d - 1;
    let doe = yoe * 365 + yoe / 4 - yoe / 100 + doy;
    Some(era * 146_097 + doe - 719_468)
}

/// Bewaart een Bericht en ruimt de oudste op boven [`MAX_BERICHTEN_PER_POTJE`]. Een Rapport houdt zijn eigen kopie van de tekst.
fn bewaar_bericht(db: &impl Db, potje_id: i64, speler_id: i64, tekst: &str) -> Result<i64, Fout> {
    db.transactie(|| {
        let id = nieuw_id(&db.rijen(
            "INSERT INTO bericht (potje_id, speler_id, tekst) VALUES (?1, ?2, ?3) RETURNING id",
            p![potje_id, speler_id, tekst],
        )?)?;
        db.voer_uit(
            "DELETE FROM bericht WHERE potje_id = ?1
               AND id <= (SELECT id FROM bericht WHERE potje_id = ?1 ORDER BY id DESC LIMIT 1 OFFSET ?2)",
            p![potje_id, MAX_BERICHTEN_PER_POTJE],
        )?;
        Ok(id)
    })
}

fn verwijder_wachtend_potje(db: &impl Db, potje_id: i64) -> Result<(), Fout> {
    db.voer_uit("DELETE FROM potje_speler WHERE potje_id = ?1", p![potje_id])?;
    db.voer_uit("DELETE FROM rapport WHERE potje_id = ?1", p![potje_id])?;
    db.voer_uit("DELETE FROM bericht WHERE potje_id = ?1", p![potje_id])?;
    db.voer_uit("DELETE FROM potje WHERE id = ?1", p![potje_id])
}

/// De spelregels (en dus het geldige aantal) komen uit halma-core; de Denktijd is een van [`DENKTIJDEN`] of geen.
fn controleer_potjekeuze(bord: &str, aantal: u32, denktijd_s: Option<i64>) -> Result<(), Fout> {
    match bord {
        "ster" if halma_core::Game::new_star(aantal as usize).is_none() => {
            return Err(Fout::Ongeldig("A game on the star board has 2, 3, 4 or 6 players"));
        }
        "vierkant" if halma_core::Game::new_square(aantal as usize).is_none() => {
            return Err(Fout::Ongeldig("A game on the square board has 2 or 4 players"));
        }
        "ster" | "vierkant" => {}
        _ => return Err(Fout::Ongeldig("The board must be \"ster\" or \"vierkant\"")),
    }
    if denktijd_s.is_some_and(|d| !DENKTIJDEN.iter().any(|&x| i64::from(x) == d)) {
        return Err(Fout::Ongeldig("The move time is 15, 30, 60 or 120 seconds, or no limit"));
    }
    Ok(())
}

/// Een Speler mag hooguit [`MAX_OPEN_POTJES`] open Potjes hebben die hij zelf startte (een Snel potje telt niet mee). Zit hij
/// op de grens, dan verdwijnt eerst zijn oudste Potje waarin nog niemand meedeed (zo'n Potje kan hij niet zelf opgeven); is
/// er geen, dan kan er geen Potje bij tot hij er een uitspeelt of opgeeft.
fn maak_ruimte_voor_potje(db: &impl Db, speler_id: i64) -> Result<(), Fout> {
    let open = een(db.rij(
        "SELECT COUNT(*) FROM potje p JOIN potje_speler ps ON ps.potje_id = p.id AND ps.plek = 0
         WHERE ps.speler_id = ?1 AND p.snel = 0 AND p.afgelopen = 0",
        p![speler_id],
    )?)?
    .u32(0)?;
    if open < MAX_OPEN_POTJES {
        return Ok(());
    }
    let alleen = db.rij(
        "SELECT p.id FROM potje p JOIN potje_speler ps ON ps.potje_id = p.id AND ps.plek = 0
         WHERE ps.speler_id = ?1 AND p.snel = 0 AND p.afgelopen = 0 AND p.gestart_ms IS NULL
           AND NOT EXISTS (SELECT 1 FROM potje_speler x WHERE x.potje_id = p.id AND x.plek > 0)
         ORDER BY p.id LIMIT 1",
        p![speler_id],
    )?;
    match alleen {
        Some(r) => verwijder_wachtend_potje(db, r.i64(0)?),
        None => Err(Fout::Conflict("You have too many open games. Finish or resign one before starting another")),
    }
}

/// Een Speler mag hooguit [`MAX_OPEN_DENKTIJD_POTJES`] open Potjes met Denktijd hebben die hij zelf startte.
fn eis_ruimte_voor_denktijd(db: &impl Db, speler_id: i64, denktijd_s: Option<i64>) -> Result<(), Fout> {
    if denktijd_s.is_none() {
        return Ok(());
    }
    let open = een(db.rij(
        "SELECT COUNT(*) FROM potje p JOIN potje_speler ps ON ps.potje_id = p.id AND ps.plek = 0
         WHERE ps.speler_id = ?1 AND p.snel = 0 AND p.denktijd_s IS NOT NULL AND p.afgelopen = 0",
        p![speler_id],
    )?)?
    .u32(0)?;
    if open >= MAX_OPEN_DENKTIJD_POTJES {
        return Err(Fout::Conflict("You have too many open games with a move time. Finish or resign one before starting another"));
    }
    Ok(())
}

fn eis_niet_geweerd(db: &impl Db, speler_id: i64) -> Result<(), Fout> {
    let geweerd = db.rij("SELECT geweerd FROM speler WHERE id = ?1", p![speler_id])?.map(|r| r.bool(0)).transpose()?.unwrap_or(false);
    if geweerd {
        return Err(Fout::Verboden("You can no longer chat or join games"));
    }
    Ok(())
}

/// Meedoen kan niet als jij iemand in het Potje blokkeerde, of als iemand in het Potje jou blokkeerde.
fn eis_geen_blokkade(db: &impl Db, speler_id: i64, potje_id: i64) -> Result<(), Fout> {
    let rij = een(db.rij(
        "SELECT EXISTS(SELECT 1 FROM potje_speler ps JOIN blokkade k ON k.speler_id = ?1 AND k.geblokkeerd_id = ps.speler_id
                       WHERE ps.potje_id = ?2),
                EXISTS(SELECT 1 FROM potje_speler ps JOIN blokkade k ON k.speler_id = ps.speler_id AND k.geblokkeerd_id = ?1
                       WHERE ps.potje_id = ?2)",
        p![speler_id, potje_id],
    )?)?;
    if rij.bool(0)? {
        return Err(Fout::Verboden("You blocked a player in this game. Unblock them in Account to join."));
    }
    if rij.bool(1)? {
        return Err(Fout::Verboden("You cannot join this game"));
    }
    Ok(())
}

/// Een Vriendcode die nog niemand heeft: acht willekeurige cijfers.
fn vrije_vriendcode(db: &impl Db) -> Result<String, Fout> {
    loop {
        let code = codes::nieuwe_vriendcode();
        if db.rij("SELECT 1 FROM speler WHERE vriendcode = ?1", p![&code])?.is_none() {
            return Ok(code);
        }
    }
}

/// Het bord van een Uitdaging van deze uitdager.
fn bord_van(db: &impl Db, groep: i64, speler_id: i64) -> Result<String, Fout> {
    db.rij("SELECT bord FROM uitdaging WHERE groep = ?1 AND van_id = ?2", p![groep, speler_id])?
        .ok_or(Fout::Onbekend("Unknown challenge"))?
        .tekst(0)
}

/// Haalt uit de deelnemers van een Uitdaging (`spelers[0]` is de uitdager) wie niet in het Potje mag: een geweerde of
/// verwijderde vriend, en een vriend met een Blokkade (in een van beide richtingen) met iemand die eerder in de lijst staat.
/// Hun rij krijgt `declined`, zoals bij een vriend die afviel. Zegt of er iemand afviel.
fn laat_niet_toegelaten_afvallen(db: &impl Db, groep: i64, spelers: &mut Vec<i64>) -> Result<bool, Fout> {
    let mut houden: Vec<i64> = spelers.drain(..1).collect();
    let mut afgevallen = false;
    for ander in std::mem::take(spelers) {
        let mag = een(db.rij("SELECT EXISTS(SELECT 1 FROM speler WHERE id = ?1 AND verwijderd = 0 AND geweerd = 0)", p![ander])?)?.bool(0)?;
        let mut geblokkeerd = false;
        for &al in &houden {
            geblokkeerd |= een(db.rij(
                "SELECT EXISTS(SELECT 1 FROM blokkade WHERE (speler_id = ?1 AND geblokkeerd_id = ?2) OR (speler_id = ?2 AND geblokkeerd_id = ?1))",
                p![ander, al],
            )?)?
            .bool(0)?;
        }
        if mag && !geblokkeerd {
            houden.push(ander);
        } else {
            afgevallen = true;
            db.voer_uit("UPDATE uitdaging SET status = 'declined' WHERE groep = ?1 AND naar_id = ?2", p![groep, ander])?;
        }
    }
    *spelers = houden;
    Ok(afgevallen)
}

/// Maakt het Potje van een Uitdaging: `spelers[0]` is de uitdager (plek 1), daarna volgen de vrienden. Zijn dat er minder dan
/// `totaal`, dan vullen Computerspelers de rest. Het Potje begint zodra het vol is. Alle rijen van de groep krijgen het Potje;
/// wie accepteerde heeft `accepted`.
fn maak_uitdaging_potje(db: &impl Db, groep: i64, bord: &str, denktijd_s: Option<i64>, totaal: u32, spelers: &[i64], nu: i64) -> Result<i64, Fout> {
    let vol = spelers.len() as u32 >= totaal;
    let potje_id = nieuw_id(&db.rijen(
        "INSERT INTO potje (uitnodiging, bord, aantal_spelers, denktijd_s, gestart_ms) VALUES (?1, ?2, ?3, ?4, ?5) RETURNING id",
        p![codes::nieuwe_uitnodiging(), bord, totaal, denktijd_s, vol.then_some(nu)],
    )?)?;
    for (plek, &speler) in spelers.iter().enumerate() {
        db.voer_uit("INSERT INTO potje_speler (potje_id, plek, speler_id) VALUES (?1, ?2, ?3)", p![potje_id, plek as i64, speler])?;
    }
    voeg_potje_vrienden_toe(db, potje_id, spelers[0], nu)?;
    db.voer_uit("UPDATE uitdaging SET potje_id = ?2 WHERE groep = ?1", p![groep, potje_id])?;
    for _ in spelers.len() as u32..totaal {
        computerspeler_in(db, potje_id, nu)?;
    }
    Ok(potje_id)
}

/// Zet `speler_id` en elke andere echte Speler van het Potje in elkaars Vriendenlijst, met `nu` als laatste keer.
/// Een Computerspeler, een verwijderde Speler en een geblokkeerde Speler (in beide richtingen) komen er niet in.
fn voeg_potje_vrienden_toe(db: &impl Db, potje_id: i64, speler_id: i64, nu: i64) -> Result<(), Fout> {
    let anderen = db.rijen(
        "SELECT s.id FROM potje_speler ps JOIN speler s ON s.id = ps.speler_id
         WHERE ps.potje_id = ?1 AND s.id <> ?2 AND s.computer IS NULL AND s.verwijderd = 0
           AND NOT EXISTS (SELECT 1 FROM blokkade k WHERE (k.speler_id = ?2 AND k.geblokkeerd_id = s.id)
                                                      OR (k.speler_id = s.id AND k.geblokkeerd_id = ?2))",
        p![potje_id, speler_id],
    )?;
    for r in anderen {
        let ander = r.i64(0)?;
        for (van, naar) in [(speler_id, ander), (ander, speler_id)] {
            db.voer_uit(
                "INSERT INTO vriend (speler_id, vriend_id, laatst_ms) VALUES (?1, ?2, ?3)
                 ON CONFLICT (speler_id, vriend_id) DO UPDATE SET laatst_ms = excluded.laatst_ms",
                p![van, naar, nu],
            )?;
        }
    }
    Ok(())
}

/// Zet twee Spelers in elkaars Vriendenlijst (zonder gemeenschappelijk Potje: `laatst_ms` is nu) en ruimt hun Vriendverzoeken op.
fn maak_vrienden(db: &impl Db, a: i64, b: i64, nu: i64) -> Result<(), Fout> {
    for (van, naar) in [(a, b), (b, a)] {
        db.voer_uit(
            "INSERT INTO vriend (speler_id, vriend_id, laatst_ms) VALUES (?1, ?2, ?3)
             ON CONFLICT (speler_id, vriend_id) DO UPDATE SET laatst_ms = MAX(laatst_ms, excluded.laatst_ms)",
            p![van, naar, nu],
        )?;
    }
    db.voer_uit("DELETE FROM vriendverzoek WHERE (van_id = ?1 AND naar_id = ?2) OR (van_id = ?2 AND naar_id = ?1)", p![a, b])
}

/// Het id uit een `INSERT ... RETURNING id`.
fn nieuw_id(rijen: &[Rij]) -> Result<i64, Fout> {
    rijen.first().ok_or_else(|| Fout::Intern("geen id terug na INSERT".into()))?.i64(0)
}

/// De rij van een opdracht die altijd één rij geeft (zoals `COUNT` of `EXISTS`).
fn een(rij: Option<Rij>) -> Result<Rij, Fout> {
    rij.ok_or_else(|| Fout::Intern("geen rij terug".into()))
}

fn potje_info(db: &impl Db, potje_id: i64) -> Result<PotjeInfo, Fout> {
    let r = db
        .rij(
            "SELECT uitnodiging, bord, aantal_spelers, denktijd_s, gestart_ms, snel, zoek_tot_ms FROM potje WHERE id = ?1",
            p![potje_id],
        )?
        .ok_or(Fout::Onbekend("Unknown game"))?;
    let (uitnodiging, bord, aantal_spelers, denktijd_s, gestart_ms) =
        (r.tekst(0)?, r.tekst(1)?, r.u32(2)?, r.optie_u32(3)?, r.optie_i64(4)?);
    let (snel, zoek_tot_ms) = (r.bool(5)?, r.optie_i64(6)?);
    // Een Snel potje heeft geen Uitnodiging die iemand kan delen: de code verlaat de opslag niet.
    let uitnodiging = if snel { String::new() } else { uitnodiging };
    let spelers = db
        .rijen(
            "SELECT ps.plek, s.id, s.spelersnaam, s.computer, s.rating FROM potje_speler ps
             JOIN speler s ON s.id = ps.speler_id WHERE ps.potje_id = ?1 ORDER BY ps.plek",
            p![potje_id],
        )?
        .iter()
        .map(|r| Ok(PotjeSpeler { plek: r.u32(0)? + 1, speler_id: r.i64(1)?, spelersnaam: r.tekst(2)?, computer: r.optie_u32(3)?, rating: snel.then(|| r.i64(4)).transpose()? }))
        .collect::<Result<Vec<_>, Fout>>()?;
    let vol = spelers.len() as u32 >= aantal_spelers;
    Ok(PotjeInfo { potje_id, uitnodiging, bord, aantal_spelers, spelers, vol, denktijd_s, snel, gestart_ms, zoek_tot_ms })
}

/// De plek (vanaf 0) van de Speler in het Potje.
fn lid_plek(db: &impl Db, speler_id: i64, potje_id: i64) -> Result<u32, Fout> {
    let bestaat = een(db.rij("SELECT EXISTS(SELECT 1 FROM potje WHERE id = ?1)", p![potje_id])?)?.bool(0)?;
    if !bestaat {
        return Err(Fout::Onbekend("Unknown game"));
    }
    db.rij("SELECT plek FROM potje_speler WHERE potje_id = ?1 AND speler_id = ?2", p![potje_id, speler_id])?
        .ok_or(Fout::Verboden("You are not in this game"))?
        .u32(0)
}

/// Het aantal Sprongen van een Zet op de stand in `game` (vóór de Zet): 0 bij een stap.
/// Alleen het van- en naarvak is bewaard, dus dit is de kortste Sprongketen; de echte keten kan langer zijn.
fn sprongen_in(game: &Game, van: usize, naar: usize) -> u32 {
    if game.step_destinations(van).contains(&naar) {
        return 0;
    }
    let stenen: Vec<Option<usize>> = (0..game.board().len()).map(|v| game.stone_at(v)).collect();
    halma_core::game::move_path(game.board(), &stenen, van, naar).map_or(0, |pad| pad.len().saturating_sub(1) as u32)
}

fn zet_fout(e: MoveError) -> Fout {
    match e {
        MoveError::GameOver => Fout::Conflict("The game is over"),
        MoveError::NotPlaying => Fout::Conflict("You are no longer playing"),
        MoveError::NoSuchCell => Fout::Ongeldig("That square does not exist"),
        MoveError::NoSuchPlayer => Fout::Ongeldig("That player does not exist"),
        MoveError::NotYourStone => Fout::Ongeldig("There is no marble of yours on that square"),
        MoveError::InvalidDestination => Fout::Ongeldig("The marble cannot move to that square"),
    }
}

/// De stand van een Potje: de bewaarde stand plus de Zetten daarna (normaal geen, want [`bewaar_zet`] bewaart na elke Zet de
/// nieuwe stand). Zo kost een verzoek niet meer naarmate een Potje langer duurt. Een Potje zonder bewaarde stand (van vóór
/// taak 282) of met een stand die niet meer te lezen is, wordt één keer helemaal afgespeeld; daarna staan de stand en het
/// aantal Sprongen per Zet in de opslag.
fn speel_af(db: &impl Db, info: &PotjeInfo) -> Result<Afgespeeld, Fout> {
    let n = info.aantal_spelers as usize;
    let bord = || match info.bord.as_str() {
        "vierkant" => halma_core::Board::square(),
        _ => halma_core::Board::star(),
    };
    let bewaard = een(db.rij("SELECT bewaarde_stand, bewaarde_nummer FROM potje WHERE id = ?1", p![info.potje_id])?)?;
    let (tekst, bewaard_nummer) = (bewaard.optie_tekst(0)?, bewaard.optie_i64(1)?);
    let (mut game, vanaf) = match (tekst.and_then(|t| Game::from_snapshot(bord(), n, &t)), bewaard_nummer) {
        (Some(game), Some(nummer)) => (game, nummer),
        _ => (Game::new(bord(), n).ok_or_else(|| Fout::Intern("bord en aantal spelers kloppen niet".into()))?, 0),
    };
    let rijen = db.rijen(
        "SELECT nummer, speler_plek, van, naar, soort, sprongen FROM zet WHERE potje_id = ?1 AND nummer > ?2 ORDER BY nummer",
        p![info.potje_id, vanaf],
    )?;
    let mut laatste = None;
    let mut versie = vanaf as u32;
    for r in &rijen {
        let (nummer, plek, van, naar, soort) = (r.u32(0)?, r.u32(1)?, r.i64(2)?, r.i64(3)?, r.tekst(4)?);
        if r.optie_i64(5)?.is_none() {
            let sprongen = if soort == "zet" { sprongen_in(&game, van as usize, naar as usize) } else { 0 };
            db.voer_uit("UPDATE zet SET sprongen = ?3 WHERE potje_id = ?1 AND nummer = ?2", p![info.potje_id, nummer, sprongen])?;
        }
        let uitkomst = if soort == "opgeven" {
            game.resign(plek as usize)
        } else if soort == "overgeslagen" {
            game.skip_turn()
        } else {
            game.make_move(van as usize, naar as usize)
        };
        uitkomst.map_err(|e| Fout::Intern(format!("bewaarde zet {nummer} klopt niet meer: {e}")))?;
        versie = nummer;
        laatste = Some(laatste_zet(nummer, plek, van, naar, &soort));
    }
    if rijen.is_empty() {
        // Alles stond al in de bewaarde stand: alleen de laatste Zet zelf nog, voor de app.
        if let Some(r) = db.rij("SELECT nummer, speler_plek, van, naar, soort FROM zet WHERE potje_id = ?1 ORDER BY nummer DESC LIMIT 1", p![info.potje_id])? {
            versie = r.u32(0)?;
            laatste = Some(laatste_zet(versie, r.u32(1)?, r.i64(2)?, r.i64(3)?, &r.tekst(4)?));
        }
    } else {
        bewaar_stand(db, info.potje_id, &game, versie)?;
    }
    Ok(Afgespeeld { game, versie, laatste })
}

/// Een Potje na [`speel_af`]: de stand, het aantal bewaarde Zetten (ook opgaven en overgeslagen beurten) en de laatste.
struct Afgespeeld {
    game: Game,
    versie: u32,
    laatste: Option<LaatsteZet>,
}

fn laatste_zet(nummer: u32, plek: u32, van: i64, naar: i64, soort: &str) -> LaatsteZet {
    LaatsteZet {
        nummer,
        plek: plek + 1,
        soort: match soort {
            "opgeven" => "opgeven",
            "overgeslagen" => "overgeslagen",
            _ => "zet",
        },
        van: (van >= 0).then_some(van as u32),
        naar: (naar >= 0).then_some(naar as u32),
    }
}

/// Bewaart de stand na Zet `nummer`, zodat [`speel_af`] de Zetten ervoor niet meer hoeft af te spelen.
fn bewaar_stand(db: &impl Db, potje_id: i64, game: &Game, nummer: u32) -> Result<(), Fout> {
    db.voer_uit("UPDATE potje SET bewaarde_stand = ?2, bewaarde_nummer = ?3 WHERE id = ?1", p![potje_id, game.snapshot(), nummer])
}

fn stand_van(db: &impl Db, potje_id: i64, nu: i64) -> Result<Stand, Fout> {
    let info = potje_info(db, potje_id)?;
    if !info.vol {
        // Nog niet gestart: de beginstand van het bord.
        let n = info.aantal_spelers as usize;
        let game = if info.bord == "vierkant" { Game::new_square(n) } else { Game::new_star(n) }
            .ok_or_else(|| Fout::Intern("bord en aantal spelers kloppen niet".into()))?;
        return Ok(bouw_stand(db, info, &game, 0, None, nu));
    }
    let Afgespeeld { game, versie, laatste } = speel_af(db, &info)?;
    Ok(bouw_stand(db, info, &game, versie, laatste, nu))
}

fn bouw_stand(db: &impl Db, info: PotjeInfo, game: &Game, versie: u32, laatste_zet: Option<LaatsteZet>, nu: i64) -> Stand {
    let afgelopen = game.is_over();
    let wijzigingen = if afgelopen && info.snel { rating_wijzigingen(db, info.potje_id) } else { HashMap::new() };
    let spelers = info
        .spelers
        .iter()
        .map(|s| StandSpeler {
            rating_verandering: wijzigingen.get(&s.speler_id).copied(),
            status: match game.player_state(s.plek as usize - 1) {
                Some(PlayerState::Finished) => "klaar",
                Some(PlayerState::Resigned) => "opgegeven",
                _ => "speelt",
            },
            speler: s.clone(),
        })
        .collect();
    let deadline_ms = if info.vol && !afgelopen && info.denktijd_s.is_some() {
        deadline_ms(db, info.potje_id).ok().flatten()
    } else {
        None
    };
    Stand {
        denktijd_s: info.denktijd_s,
        deadline_ms,
        server_tijd_ms: nu,
        snel: info.snel,
        zoek_tot_ms: info.zoek_tot_ms,
        potje_id: info.potje_id,
        uitnodiging: info.uitnodiging,
        bord: info.bord,
        aantal_spelers: info.aantal_spelers,
        spelers,
        gestart: info.vol,
        versie,
        stand: (0..game.board().len()).map(|v| game.stone_at(v).map_or(0, |p| p as u32 + 1)).collect(),
        aan_de_beurt: (info.vol && !afgelopen).then(|| game.current_player() as u32 + 1),
        laatste_zet,
        afgelopen,
        winnaar: if info.vol { game.winner().map(|p| p as u32 + 1) } else { None },
        ranglijst: game.ranking().iter().map(|&p| p as u32 + 1).collect(),
    }
}

fn schoon_naam(naam: &str) -> Result<String, Fout> {
    let naam = naam.trim();
    if naam.is_empty() || naam.chars().count() > 30 || naam.chars().any(|c| c.is_control()) {
        return Err(Fout::Ongeldig("A player name has 1 to 30 characters"));
    }
    if woordfilter::is_grof(naam) {
        return Err(Fout::Ongeldig("That player name is not allowed. Choose another one."));
    }
    Ok(naam.to_string())
}

/// Een nieuwe rij in `zet`: van, naar (-1 als er geen steen bewoog), soort en het aantal Sprongen.
type ZetRij = (i64, i64, &'static str, u32);

/// Bewaart een Zet, opgave of overgeslagen beurt, met de stand erna, en bouwt de nieuwe stand. De beurt van de volgende
/// Speler begint op `nu`. `game` is de stand na de Zet; die moet uit [`speel_af`] komen plus deze ene Zet.
fn bewaar_zet(
    db: &impl Db,
    mut info: PotjeInfo,
    game: &Game,
    nummer: u32,
    plek: u32,
    (van, naar, soort, sprongen): ZetRij,
    nu: i64,
) -> Result<Stand, Fout> {
    db.voer_uit(
        "INSERT INTO zet (potje_id, nummer, speler_plek, van, naar, soort, tijd, tijd_ms, sprongen) VALUES (?1, ?2, ?3, ?4, ?5, ?6, unixepoch(), ?7, ?8)",
        p![info.potje_id, nummer, plek, van, naar, soort, nu, sprongen],
    )?;
    bewaar_stand(db, info.potje_id, game, nummer)?;
    if game.is_over() {
        db.voer_uit("UPDATE potje SET afgelopen = 1 WHERE id = ?1", p![info.potje_id])?;
        // Zelfde transactie als het einde van het Potje: de Rating verandert nooit zonder dat het Potje eindigt.
        if info.snel {
            werk_ratings_bij(db, &mut info, game)?;
        }
    }
    plan_computer(db, &info, game, nummer, nu)?;
    let laatste = LaatsteZet {
        nummer,
        plek: plek + 1,
        soort,
        van: (van >= 0).then_some(van as u32),
        naar: (naar >= 0).then_some(naar as u32),
    };
    Ok(bouw_stand(db, info, game, nummer, Some(laatste), nu))
}

/// Het aantal beurten dat deze Speler (plek vanaf 0) direct voor nu op rij miste.
/// Alleen zijn eigen Zetten tellen; een gewone Zet zet de telling terug op nul.
fn gemiste_beurten_op_rij(db: &impl Db, potje_id: i64, plek: u32) -> Result<u32, Fout> {
    let rijen = db.rijen(
        "SELECT soort FROM zet WHERE potje_id = ?1 AND speler_plek = ?2 ORDER BY nummer DESC LIMIT ?3",
        p![potje_id, plek, MAX_GEMISTE_BEURTEN],
    )?;
    let mut n = 0;
    for r in rijen {
        if r.tekst(0)? != "overgeslagen" {
            break;
        }
        n += 1;
    }
    Ok(n)
}

/// Zet het moment waarop de Computerspeler zijn Zet doet, als hij nu aan de beurt is; anders wist het.
/// `nummer` is het aantal bewaarde Zetten en opgaven (de wachttijd verschilt per Zet).
fn plan_computer(db: &impl Db, info: &PotjeInfo, game: &Game, nummer: u32, nu: i64) -> Result<(), Fout> {
    let computer_aan = info.vol
        && !game.is_over()
        && info.spelers.iter().any(|s| s.plek as usize == game.current_player() + 1 && s.computer.is_some());
    if !computer_aan {
        return db.voer_uit("UPDATE potje SET computer_zet_ms = NULL WHERE id = ?1 AND computer_zet_ms IS NOT NULL", p![info.potje_id]);
    }
    // Een vaste spreiding per Zet (geen toeval nodig), en met Denktijd hooguit de helft daarvan.
    let spreiding = i64::from(nummer).wrapping_mul(7919).wrapping_add(info.potje_id.wrapping_mul(104_729)).rem_euclid(COMPUTER_SPREIDING_MS);
    let mut wacht = COMPUTER_WACHT_MS + spreiding;
    if let Some(d) = info.denktijd_s {
        wacht = wacht.min(i64::from(d) * 500);
    }
    db.voer_uit("UPDATE potje SET computer_zet_ms = ?2 WHERE id = ?1", p![info.potje_id, nu + wacht])
}

fn computer_zet_ms(db: &impl Db, potje_id: i64) -> Result<Option<i64>, Fout> {
    db.rij("SELECT computer_zet_ms FROM potje WHERE id = ?1", p![potje_id])?.map_or(Ok(None), |r| r.optie_i64(0))
}

/// Het eerstvolgende moment waarop in dit Potje iets moet gebeuren: de Denktijd loopt af of een Computerspeler zet.
fn volgende_actie_ms(db: &impl Db, potje_id: i64) -> Result<Option<i64>, Fout> {
    Ok([deadline_ms(db, potje_id)?, computer_zet_ms(db, potje_id)?].into_iter().flatten().min())
}

/// Het moment waarop de huidige beurt afloopt: het begin van de beurt plus de denktijd.
/// Het begin is de laatste Zet (ook een opgave of overgeslagen beurt), of het moment dat het Potje vol werd.
fn deadline_ms(db: &impl Db, potje_id: i64) -> Result<Option<i64>, Fout> {
    let Some(r) = db.rij(
        "SELECT p.denktijd_s, p.gestart_ms,
                (SELECT z.tijd_ms FROM zet z WHERE z.potje_id = p.id ORDER BY z.nummer DESC LIMIT 1)
         FROM potje p WHERE p.id = ?1",
        p![potje_id],
    )?
    else {
        return Ok(None);
    };
    let (denktijd, gestart, laatste) = (r.optie_i64(0)?, r.optie_i64(1)?, r.optie_i64(2)?);
    Ok((|| Some(laatste.or(gestart)? + denktijd? * 1000))())
}

#[cfg(all(test, feature = "rusqlite"))]
mod tests {
    use super::*;

    #[test]
    fn transactie_draait_terug_bij_een_fout() {
        let mut o = Opslag::in_geheugen().unwrap();
        let a = o.maak_speler("Ann").unwrap();
        let potje = o.maak_potje(a.speler_id, "ster", 2, None).unwrap();
        // Een Zet voor de start faalt binnen de transactie; daarna moet alles nog werken.
        assert_eq!(o.doe_zet(a.speler_id, potje.potje_id, 0, 1).unwrap_err(), Fout::Conflict("The game has not started yet"));
        let b = o.maak_speler("Bob").unwrap();
        assert!(o.doe_mee(b.speler_id, &potje.uitnodiging).unwrap().vol);
        assert_eq!(o.stand(b.speler_id, potje.potje_id).unwrap().versie, 0);
    }

    fn tel(o: &Opslag<rusqlite::Connection>, sql: &str, p: &[crate::Waarde]) -> i64 {
        o.db.rij(sql, p).unwrap().unwrap().i64(0).unwrap()
    }

    #[test]
    fn winnaar_door_opgave_kan_account_verwijderen() {
        let mut o = Opslag::in_geheugen().unwrap();
        let ann = o.maak_speler("Ann").unwrap();
        let bob = o.maak_speler("Bob").unwrap();
        let potje = o.maak_potje(ann.speler_id, "ster", 2, None).unwrap();
        o.doe_mee(bob.speler_id, &potje.uitnodiging).unwrap();
        o.geef_op(bob.speler_id, potje.potje_id).unwrap();
        assert!(o.stand(ann.speler_id, potje.potje_id).unwrap().afgelopen);

        let standen = o.verwijder_speler(ann.speler_id).unwrap();
        assert!(standen.is_empty(), "een afgelopen Potje verandert niet");
        assert_eq!(o.speler_van_sleutel(&ann.sleutel).unwrap_err(), Fout::NietIngelogd);
    }

    #[test]
    fn account_verwijderen_wist_alles_en_een_lopend_potje_gaat_door() {
        let mut o = Opslag::in_geheugen().unwrap();
        let ann = o.maak_speler("Ann Geheim").unwrap();
        let bob = o.maak_speler("Bob").unwrap();
        let cas = o.maak_speler("Cas").unwrap();
        // Een lopend Potje voor drie, met een Zet en Berichten van Ann.
        let potje = o.maak_potje(ann.speler_id, "ster", 3, None).unwrap();
        o.doe_mee(bob.speler_id, &potje.uitnodiging).unwrap();
        o.doe_mee(cas.speler_id, &potje.uitnodiging).unwrap();
        let g = Game::new_star(3).unwrap();
        let (van, naar) = g.start_cells(0).iter().find_map(|&v| g.destinations(v).first().map(|&n| (v, n))).unwrap();
        o.doe_zet(ann.speler_id, potje.potje_id, van, naar).unwrap();
        o.stuur_bericht(ann.speler_id, potje.potje_id, "secret hello").unwrap();
        o.stuur_bericht(bob.speler_id, potje.potje_id, "hi from Bob").unwrap();
        let abo = Abonnement { endpoint: "https://push.example/ann".into(), keys: Sleutels { p256dh: "k".into(), auth: "a".into() } };
        o.bewaar_abonnement(ann.speler_id, &abo).unwrap();
        let iphone = ApnsToken { token: "ab".repeat(32), omgeving: ApnsOmgeving::Sandbox };
        o.bewaar_apns_token(ann.speler_id, &iphone).unwrap();
        // Een Wachtkamer waar Ann de maker is en Bob wacht, en een Wachtkamer met alleen Ann.
        let wacht = o.maak_potje(ann.speler_id, "ster", 3, None).unwrap();
        let leeg = o.maak_potje(ann.speler_id, "ster", 2, None).unwrap();
        // Bob zit op plek 2 van de Wachtkamer; hij schuift op naar plek 1.
        o.doe_mee(bob.speler_id, &wacht.uitnodiging).unwrap();

        let standen = o.verwijder_speler(ann.speler_id).unwrap();
        assert_eq!(standen.len(), 2, "het lopende Potje en de Wachtkamer van Bob");

        // Niets van Ann blijft: naam, sleutel, Herstelcode, abonnement, Berichten.
        assert_eq!(tel(&o, "SELECT COUNT(*) FROM speler WHERE spelersnaam LIKE '%Ann%'", &[]), 0);
        assert_eq!(o.speler_van_sleutel(&ann.sleutel).unwrap_err(), Fout::NietIngelogd);
        assert_eq!(o.herstel(&ann.herstelcode).unwrap_err(), Fout::Onbekend("Unknown recovery code"));
        assert!(o.abonnementen_van(ann.speler_id).unwrap().is_empty());
        assert_eq!(tel(&o, "SELECT COUNT(*) FROM push_abonnement", &[]), 0);
        assert!(o.apns_tokens_van(ann.speler_id).unwrap().is_empty());
        assert_eq!(tel(&o, "SELECT COUNT(*) FROM apns_token", &[]), 0);
        assert_eq!(tel(&o, "SELECT COUNT(*) FROM bericht WHERE speler_id = ?1", p![ann.speler_id]), 0);
        assert_eq!(tel(&o, "SELECT COUNT(*) FROM bericht WHERE tekst LIKE '%secret%'", &[]), 0);
        assert_eq!(tel(&o, "SELECT COUNT(*) FROM speler WHERE id = ?1 AND sleutel_hash = ?2", p![ann.speler_id, codes::hash(&ann.sleutel)]), 0);

        // Het lopende Potje: Ann is opgegeven en heet "Deleted player"; Bob en Cas spelen door.
        let stand = o.stand(bob.speler_id, potje.potje_id).unwrap();
        assert_eq!(stand.spelers[0].speler.spelersnaam, VERWIJDERDE_SPELER);
        assert_eq!(stand.spelers[0].status, "opgegeven");
        assert!(!stand.afgelopen);
        assert_eq!(stand.aan_de_beurt, Some(2));
        let g = {
            let mut g = Game::new_star(3).unwrap();
            g.make_move(van, naar).unwrap();
            g.resign(0).unwrap();
            g
        };
        let (van2, naar2) = g.start_cells(1).iter().find_map(|&v| g.destinations(v).first().map(|&n| (v, n))).unwrap();
        o.doe_zet(bob.speler_id, potje.potje_id, van2, naar2).unwrap();
        // De Berichten van Bob blijven, die van Ann zijn weg.
        let berichten = o.berichten(bob.speler_id, potje.potje_id).unwrap();
        assert_eq!(berichten.iter().map(|b| b.tekst.as_str()).collect::<Vec<_>>(), ["hi from Bob"]);

        // De Wachtkamer: Bob zit nu op plek 1; de Wachtkamer zonder anderen is weg.
        assert_eq!(o.potje_bij_uitnodiging(&wacht.uitnodiging).unwrap().spelers.len(), 1);
        assert_eq!(o.potje_bij_uitnodiging(&wacht.uitnodiging).unwrap().spelers[0].plek, 1);
        assert_eq!(o.potje_bij_uitnodiging(&leeg.uitnodiging).unwrap_err(), Fout::Onbekend("Unknown invite"));

        // Een tweede keer verwijderen kan niet: de sleutel bestaat niet meer.
        assert_eq!(o.speler_van_sleutel(&ann.sleutel).unwrap_err(), Fout::NietIngelogd);
    }

    #[test]
    fn een_verwijderde_speler_staat_niet_op_de_ranglijst_en_afgelopen_potjes_blijven() {
        let mut o = Opslag::in_geheugen().unwrap();
        let ann = o.maak_speler("Ann").unwrap();
        let bob = o.maak_speler("Bob").unwrap();
        let potje = o.maak_potje(ann.speler_id, "ster", 2, None).unwrap();
        o.doe_mee(bob.speler_id, &potje.uitnodiging).unwrap();
        o.geef_op(bob.speler_id, potje.potje_id).unwrap();
        assert_eq!(o.ranglijst(ann.speler_id).unwrap().len(), 2);

        assert!(o.verwijder_speler(bob.speler_id).unwrap().is_empty(), "een afgelopen Potje verandert niet");
        let lijst = o.ranglijst(ann.speler_id).unwrap();
        assert_eq!(lijst.iter().map(|r| r.spelersnaam.as_str()).collect::<Vec<_>>(), ["Ann"]);
        let stand = o.stand(ann.speler_id, potje.potje_id).unwrap();
        assert!(stand.afgelopen);
        assert_eq!(stand.winnaar, Some(1));
        assert_eq!(stand.spelers[1].speler.spelersnaam, VERWIJDERDE_SPELER);
        assert_eq!(o.mijn_potjes(ann.speler_id).unwrap().len(), 1);
    }

    /// Ann en Bob in een vol Potje voor twee; Bob stuurt een Bericht.
    fn ann_en_bob() -> (Opslag<rusqlite::Connection>, i64, i64, i64, Bericht) {
        let mut o = Opslag::in_geheugen().unwrap();
        let ann = o.maak_speler("Ann").unwrap().speler_id;
        let bob = o.maak_speler("Bob").unwrap().speler_id;
        let p = o.maak_potje(ann, "ster", 2, None).unwrap();
        o.doe_mee(bob, &p.uitnodiging).unwrap();
        let b = o.stuur_bericht(bob, p.potje_id, "you are bad").unwrap();
        (o, ann, bob, p.potje_id, b)
    }

    #[test]
    fn grove_berichten_en_spelersnamen_worden_geweigerd_gewone_niet() {
        let (mut o, ann, _bob, potje, _b) = ann_en_bob();
        let nee = Fout::Ongeldig("That message is not allowed. Keep the chat friendly.");
        assert_eq!(o.stuur_bericht(ann, potje, "you fucking cheat").unwrap_err(), nee);
        assert_eq!(o.stuur_bericht(ann, potje, "kl00tzak").unwrap_err(), nee);
        assert!(o.stuur_bericht(ann, potje, "Scunthorpe is a nice town, good game").is_ok());
        // Een geweigerd Bericht is niet bewaard.
        assert_eq!(o.berichten(ann, potje).unwrap().len(), 2);
        let naam_nee = Fout::Ongeldig("That player name is not allowed. Choose another one.");
        assert_eq!(o.maak_speler("Big Cunt").unwrap_err(), naam_nee);
        assert_eq!(o.maak_speler("sh1thead").unwrap_err(), naam_nee);
        assert_eq!(o.maak_speler("Scunthorpe").unwrap().spelersnaam, "Scunthorpe");
    }

    #[test]
    fn rapport_bewaart_tekst_melder_en_speler() {
        let (mut o, ann, bob, potje, b) = ann_en_bob();
        assert_eq!(b.speler_id, bob);
        let cas = o.maak_speler("Cas").unwrap().speler_id;
        let bericht = |id| NieuwRapport { bericht_id: Some(id), speler_id: None };
        let speler = |id| NieuwRapport { bericht_id: None, speler_id: Some(id) };

        o.rapporteer(ann, potje, bericht(b.id)).unwrap();
        o.rapporteer(ann, potje, bericht(b.id)).unwrap();
        o.rapporteer(bob, potje, speler(ann)).unwrap();
        o.rapporteer(bob, potje, speler(ann)).unwrap();
        // Een buitenstaander, jezelf, een onbekend Bericht en niets kiezen gaan niet.
        assert_eq!(o.rapporteer(cas, potje, bericht(b.id)).unwrap_err(), Fout::Verboden("You are not in this game"));
        assert_eq!(o.rapporteer(bob, potje, bericht(b.id)).unwrap_err(), Fout::Ongeldig("You cannot report yourself"));
        assert_eq!(o.rapporteer(ann, potje, bericht(999)).unwrap_err(), Fout::Onbekend("Unknown message"));
        assert_eq!(o.rapporteer(ann, potje, speler(cas)).unwrap_err(), Fout::Onbekend("Unknown player"));
        assert!(matches!(o.rapporteer(ann, potje, NieuwRapport { bericht_id: None, speler_id: None }), Err(Fout::Ongeldig(_))));

        // De tekst blijft zoals hij was, ook als het Bericht later verdwijnt.
        o.db.voer_uit("UPDATE bericht SET tekst = 'anders'", &[]).unwrap();
        let lijst = o.open_rapporten().unwrap();
        assert_eq!(lijst.len(), 2, "hetzelfde Bericht of dezelfde Speler twee keer is één Rapport");
        assert_eq!((lijst[0].melder.as_str(), lijst[0].spelersnaam.as_str(), lijst[0].tekst.as_deref()), ("Bob", "Ann", None));
        assert_eq!((lijst[1].melder.as_str(), lijst[1].spelersnaam.as_str(), lijst[1].tekst.as_deref()), ("Ann", "Bob", Some("you are bad")));
        assert_eq!((lijst[1].potje_id, lijst[1].bericht_id), (potje, Some(b.id)));

        // Account verwijderen haalt de Rapporten van en over die Speler weg.
        o.verwijder_speler(bob).unwrap();
        assert!(o.open_rapporten().unwrap().is_empty());
    }

    #[test]
    fn blokkeren_verbergt_berichten_alleen_voor_wie_blokkeert() {
        let (mut o, ann, bob, potje, _) = ann_en_bob();
        o.stuur_bericht(ann, potje, "hi").unwrap();
        o.blokkeer(ann, bob).unwrap();
        o.blokkeer(ann, bob).unwrap();
        let teksten = |o: &Opslag<_>, wie| o.berichten(wie, potje).unwrap().into_iter().map(|b: Bericht| b.tekst).collect::<Vec<_>>();
        assert_eq!(teksten(&o, ann), ["hi"]);
        assert_eq!(teksten(&o, bob), ["you are bad", "hi"], "blokkeren werkt één kant op");
        assert_eq!(o.blokkades(ann).unwrap(), [GeblokkeerdeSpeler { speler_id: bob, spelersnaam: "Bob".into() }]);
        assert_eq!(o.blokkeerders_van(bob).unwrap(), [ann]);
        assert!(o.blokkeerders_van(ann).unwrap().is_empty());
        assert_eq!(o.blokkeer(ann, ann).unwrap_err(), Fout::Ongeldig("You cannot block yourself"));
        assert_eq!(o.blokkeer(ann, 999).unwrap_err(), Fout::Onbekend("Unknown player"));

        o.deblokkeer(ann, bob).unwrap();
        o.deblokkeer(ann, bob).unwrap();
        assert_eq!(teksten(&o, ann), ["you are bad", "hi"]);
        assert!(o.blokkades(ann).unwrap().is_empty());
    }

    fn namen(l: &Vriendenlijst) -> Vec<&str> {
        l.vrienden.iter().map(|v| v.spelersnaam.as_str()).collect()
    }

    #[test]
    fn vriendcodes_zijn_acht_cijfers_uniek_en_niet_op_volgorde() {
        let mut o = Opslag::in_geheugen().unwrap();
        let ids: Vec<i64> = (0..60).map(|i| o.maak_speler(&format!("Speler {i}")).unwrap().speler_id).collect();
        let codes: Vec<String> = ids.iter().map(|&id| o.vriendenlijst(id).unwrap().vriendcode).collect();
        assert!(codes.iter().all(|c| c.len() == 8 && c.bytes().all(|b| b.is_ascii_digit())));
        let uniek: std::collections::HashSet<&String> = codes.iter().collect();
        assert_eq!(uniek.len(), codes.len());
        // Niet opeenvolgend en niet stijgend in de volgorde van aanmaken.
        let getallen: Vec<i64> = codes.iter().map(|c| c.parse().unwrap()).collect();
        assert!(getallen.windows(2).all(|w| (w[1] - w[0]).abs() != 1));
        assert!(!getallen.windows(2).all(|w| w[1] > w[0]));
        // Een Vriendcode is vast, ook na herstel.
        let ann = ids[0];
        let eerder = o.vriendenlijst(ann).unwrap().vriendcode;
        assert_eq!(o.vriendenlijst(ann).unwrap().vriendcode, eerder);
        assert!(!eerder.contains("Speler"));
    }

    #[test]
    fn bestaande_spelers_krijgen_bij_het_openen_een_vriendcode() {
        let conn = rusqlite::Connection::open_in_memory().unwrap();
        // De versie vlak voor de Vriendenlijst-migratie: daarna volgen het Vriendverzoek (162), de Uitdaging (163) en de Uitdaging aan meer vrienden (164) de puzzeldagen (175), de vlag test (273) en de bewaarde stand (282).
        let oud = MIGRATIES.len() - 7;
        for sql in &MIGRATIES[..oud] {
            conn.execute_batch(sql).unwrap();
        }
        conn.pragma_update(None, "user_version", oud as i64).unwrap();
        for (i, naam) in ["Ann", "Bob", "Cas"].iter().enumerate() {
            conn.execute(
                "INSERT INTO speler (spelersnaam, sleutel_hash, herstel_hash) VALUES (?1, ?2, ?3)",
                rusqlite::params![naam, format!("s{i}"), format!("h{i}")],
            )
            .unwrap();
        }
        conn.execute("INSERT INTO speler (spelersnaam, sleutel_hash, herstel_hash, verwijderd) VALUES ('Deleted player', 'x', 'y', 1)", []).unwrap();
        conn.execute("INSERT INTO speler (spelersnaam, sleutel_hash, herstel_hash, computer) VALUES ('Pip', 'c', 'c', 1)", []).unwrap();
        // Oude Potjes: Ann en Bob via een Uitnodiging (twee keer, het laatste telt), Ann en Cas in een Snel potje,
        // Ann met een Computerspeler (5) en met de verwijderde Speler (4).
        for (id, snel, tijd, spelers) in [(1, 0, 100, [1, 2]), (2, 0, 300, [2, 1]), (3, 1, 400, [1, 3]), (4, 0, 500, [1, 5]), (5, 0, 600, [1, 4])] {
            conn.execute(
                "INSERT INTO potje (id, uitnodiging, bord, aantal_spelers, aangemaakt, snel) VALUES (?1, ?2, 'ster', 2, ?3, ?4)",
                rusqlite::params![id, format!("u{id}"), tijd, snel],
            )
            .unwrap();
            for (plek, s) in spelers.iter().enumerate() {
                conn.execute("INSERT INTO potje_speler (potje_id, plek, speler_id) VALUES (?1, ?2, ?3)", rusqlite::params![id, plek as i64, s]).unwrap();
            }
        }
        let o = Opslag::nieuw(conn, Arc::new(crate::klok::SysteemKlok)).unwrap();
        let namen = |id: i64| o.vriendenlijst(id).unwrap().vrienden.iter().map(|v| v.spelersnaam.clone()).collect::<Vec<_>>();
        assert_eq!(namen(1), ["Bob"]);
        assert_eq!(namen(2), ["Ann"]);
        assert!(namen(3).is_empty());
        let laatst: i64 = o.db.rij("SELECT laatst_ms FROM vriend WHERE speler_id = 1", p![]).unwrap().unwrap().i64(0).unwrap();
        assert_eq!(laatst, 300_000);
        let mut codes = Vec::new();
        for id in 1..=3 {
            let l = o.vriendenlijst(id).unwrap();
            assert_eq!(l.vriendcode.len(), 8);
            codes.push(l.vriendcode);
        }
        codes.sort();
        codes.dedup();
        assert_eq!(codes.len(), 3);
        // Een verwijderde Speler krijgt er geen.
        assert_eq!(tel(&o, "SELECT COUNT(*) FROM speler WHERE vriendcode IS NULL", p![]), 1);
    }

    #[test]
    fn een_potje_via_een_uitnodiging_zet_spelers_in_elkaars_lijst_een_snel_potje_niet() {
        let (mut o, ann, bob, _, _) = ann_en_bob();
        let cas = o.maak_speler("Cas").unwrap().speler_id;
        assert_eq!(namen(&o.vriendenlijst(ann).unwrap()), ["Bob"]);
        assert_eq!(namen(&o.vriendenlijst(bob).unwrap()), ["Ann"]);
        assert!(o.vriendenlijst(cas).unwrap().vrienden.is_empty());
        assert_eq!(o.vriendenlijst(ann).unwrap().vrienden[0].rating, RATING_START);
        // Een Snel potje: Ann en Cas spelen samen, maar komen niet in elkaars lijst.
        let a = o.zoek_snel_potje(ann).unwrap();
        o.zoek_snel_potje(cas).unwrap();
        assert!(o.stand(ann, a.potje_id).unwrap().gestart);
        assert_eq!(namen(&o.vriendenlijst(ann).unwrap()), ["Bob"]);
        assert!(o.vriendenlijst(cas).unwrap().vrienden.is_empty());
        // Een Computerspeler in een Potje met een Uitnodiging komt er ook niet in.
        let p = o.maak_potje(cas, "ster", 3, None).unwrap();
        o.voeg_computerspeler_toe(p.potje_id).unwrap();
        assert!(o.vriendenlijst(cas).unwrap().vrienden.is_empty());
    }

    fn drie_spelers() -> (Opslag<rusqlite::Connection>, i64, i64, i64) {
        let mut o = Opslag::in_geheugen().unwrap();
        let ann = o.maak_speler("Ann").unwrap().speler_id;
        let bob = o.maak_speler("Bob").unwrap().speler_id;
        let cas = o.maak_speler("Cas").unwrap().speler_id;
        (o, ann, bob, cas)
    }

    /// `a` en `b` delen een Snel potje: blokkeren kan alleen een medespeler.
    fn samen_in_een_potje(o: &mut Opslag<rusqlite::Connection>, a: i64, b: i64) {
        o.zoek_snel_potje(a).unwrap();
        assert!(o.zoek_snel_potje(b).unwrap().gestart);
    }

    fn code(o: &Opslag<rusqlite::Connection>, id: i64) -> String {
        o.vriendenlijst(id).unwrap().vriendcode
    }

    #[test]
    fn een_vriendverzoek_komt_bij_de_ander_en_goedkeuren_zet_beiden_in_de_lijst() {
        let (mut o, ann, bob, _) = drie_spelers();
        let bobs_code = code(&o, bob);
        // Je ziet eerst de Spelersnaam, ook met een spatie in de code.
        let gezien = o.zoek_vriendcode(ann, &format!("{} {}", &bobs_code[..4], &bobs_code[4..])).unwrap();
        assert_eq!(gezien, VriendKandidaat { spelersnaam: "Bob".into(), vrienden: false });
        let u = o.vraag_vriend(ann, &bobs_code).unwrap();
        assert_eq!((u.spelersnaam.as_str(), u.vrienden, u.aan, u.melding), ("Bob", false, bob, true));
        // Bob ziet het verzoek; Ann staat nog niet in zijn lijst en andersom.
        let l = o.vriendenlijst(bob).unwrap();
        assert_eq!(l.verzoeken.len(), 1);
        assert_eq!((l.verzoeken[0].speler_id, l.verzoeken[0].spelersnaam.as_str()), (ann, "Ann"));
        assert!(l.vrienden.is_empty());
        assert!(o.vriendenlijst(ann).unwrap().verzoeken.is_empty());
        // Het verzoek blijft staan tot Bob kiest, ook als Ann het nog eens stuurt (dan geen nieuwe Melding).
        let nog_eens = o.vraag_vriend(ann, &bobs_code).unwrap();
        assert!(!nog_eens.melding && !nog_eens.vrienden);
        assert_eq!(o.vriendenlijst(bob).unwrap().verzoeken.len(), 1);
        // Goedkeuren: in elkaars lijst, het verzoek is weg.
        assert_eq!(o.keur_vriendverzoek_goed(bob, ann).unwrap(), "Ann");
        assert_eq!(namen(&o.vriendenlijst(ann).unwrap()), ["Bob"]);
        assert_eq!(namen(&o.vriendenlijst(bob).unwrap()), ["Ann"]);
        assert!(o.vriendenlijst(bob).unwrap().verzoeken.is_empty());
        assert_eq!(o.keur_vriendverzoek_goed(bob, ann).unwrap_err(), Fout::Onbekend("Unknown friend request"));
        // Wie al vrienden is, krijgt "vrienden" terug en geen nieuw verzoek.
        let al = o.vraag_vriend(ann, &bobs_code).unwrap();
        assert!(al.vrienden && !al.melding);
        assert!(o.zoek_vriendcode(ann, &bobs_code).unwrap().vrienden);
    }

    #[test]
    fn weigeren_laat_geen_spoor_bij_de_aanvrager() {
        let (mut o, ann, bob, _) = drie_spelers();
        let bobs_code = code(&o, bob);
        let eerste = o.vraag_vriend(ann, &bobs_code).unwrap();
        o.weiger_vriendverzoek(bob, ann).unwrap();
        // Bob ziet het niet meer, niemand staat in een lijst.
        assert!(o.vriendenlijst(bob).unwrap().verzoeken.is_empty());
        assert!(o.vriendenlijst(bob).unwrap().vrienden.is_empty());
        assert!(o.vriendenlijst(ann).unwrap().vrienden.is_empty());
        assert!(o.vriendenlijst(ann).unwrap().verzoeken.is_empty());
        // Ann kan opnieuw sturen en krijgt hetzelfde antwoord als de eerste keer, zonder Melding en zonder dat Bob het ziet.
        let opnieuw = o.vraag_vriend(ann, &bobs_code).unwrap();
        assert_eq!((opnieuw.spelersnaam.as_str(), opnieuw.vrienden), (eerste.spelersnaam.as_str(), eerste.vrienden));
        assert!(!opnieuw.melding);
        assert!(o.vriendenlijst(bob).unwrap().verzoeken.is_empty());
        // Een geweigerd verzoek is niet meer goed te keuren.
        assert_eq!(o.keur_vriendverzoek_goed(bob, ann).unwrap_err(), Fout::Onbekend("Unknown friend request"));
        // Weigeren van iets wat er niet is, is geen fout.
        o.weiger_vriendverzoek(bob, 999).unwrap();
        // Vraagt Bob zelf aan Ann, dan zijn ze meteen vrienden.
        let u = o.vraag_vriend(bob, &code(&o, ann)).unwrap();
        assert!(u.vrienden && !u.melding);
        assert_eq!(namen(&o.vriendenlijst(ann).unwrap()), ["Bob"]);
    }

    #[test]
    fn twee_wederzijdse_verzoeken_maken_meteen_vrienden() {
        let (mut o, ann, bob, _) = drie_spelers();
        o.vraag_vriend(ann, &code(&o, bob)).unwrap();
        let u = o.vraag_vriend(bob, &code(&o, ann)).unwrap();
        assert!(u.vrienden && !u.melding);
        assert_eq!(namen(&o.vriendenlijst(ann).unwrap()), ["Bob"]);
        assert_eq!(namen(&o.vriendenlijst(bob).unwrap()), ["Ann"]);
        assert!(o.vriendenlijst(ann).unwrap().verzoeken.is_empty() && o.vriendenlijst(bob).unwrap().verzoeken.is_empty());
        assert_eq!(tel(&o, "SELECT COUNT(*) FROM vriendverzoek", p![]), 0);
    }

    #[test]
    fn geblokkeerde_spelers_kunnen_elkaar_niet_toevoegen_in_beide_richtingen() {
        let (mut o, ann, bob, cas) = drie_spelers();
        let (ann_code, bob_code) = (code(&o, ann), code(&o, bob));
        samen_in_een_potje(&mut o, ann, bob);
        o.blokkeer(ann, bob).unwrap();
        // Ann blokkeerde Bob: Ann kan Bob niet toevoegen, en Bob Ann ook niet. Beiden zien alleen "onbekend".
        for (wie, code) in [(ann, &bob_code), (bob, &ann_code)] {
            assert_eq!(o.zoek_vriendcode(wie, code).unwrap_err(), Fout::Onbekend("Unknown friend code"));
            assert_eq!(o.vraag_vriend(wie, code).unwrap_err(), Fout::Onbekend("Unknown friend code"));
        }
        assert_eq!(tel(&o, "SELECT COUNT(*) FROM vriendverzoek", p![]), 0);
        // Blokkeren haalt een openstaand verzoek weg, in beide richtingen.
        o.vraag_vriend(cas, &bob_code).unwrap();
        o.vraag_vriend(bob, &code(&o, cas)).unwrap(); // wederzijds: vrienden
        o.vraag_vriend(cas, &ann_code).unwrap();
        assert_eq!(o.vriendenlijst(ann).unwrap().verzoeken.len(), 1);
        samen_in_een_potje(&mut o, ann, cas);
        o.blokkeer(ann, cas).unwrap();
        assert!(o.vriendenlijst(ann).unwrap().verzoeken.is_empty());
        assert_eq!(tel(&o, "SELECT COUNT(*) FROM vriendverzoek", p![]), 0);
        // Een verzoek dat er al stond, is na blokkeren door de ander niet goed te keuren.
        let (mut o, ann, bob, _) = drie_spelers();
        o.vraag_vriend(ann, &code(&o, bob)).unwrap();
        samen_in_een_potje(&mut o, bob, ann);
        o.blokkeer(bob, ann).unwrap();
        assert_eq!(o.keur_vriendverzoek_goed(bob, ann).unwrap_err(), Fout::Onbekend("Unknown friend request"));
        // Na deblokkeren kan het weer.
        o.deblokkeer(bob, ann).unwrap();
        assert!(o.vraag_vriend(ann, &code(&o, bob)).unwrap().melding);
    }

    #[test]
    fn een_onbekende_of_ongeldige_vriendcode_en_jezelf_toevoegen_mislukken() {
        let (mut o, ann, _, _) = drie_spelers();
        let eigen = code(&o, ann);
        let onbekend = if eigen == "00000000" { "11111111" } else { "00000000" };
        for fout in ["", "1234", "123456789", "abcdefgh", "1234 567x", onbekend] {
            assert_eq!(o.zoek_vriendcode(ann, fout).unwrap_err(), Fout::Onbekend("Unknown friend code"), "{fout:?}");
            assert_eq!(o.vraag_vriend(ann, fout).unwrap_err(), Fout::Onbekend("Unknown friend code"), "{fout:?}");
        }
        assert_eq!(o.vraag_vriend(ann, &eigen).unwrap_err(), Fout::Ongeldig("You cannot add yourself"));
        assert_eq!(o.zoek_vriendcode(ann, &eigen).unwrap_err(), Fout::Ongeldig("You cannot add yourself"));
        // Een verwijderde Speler heeft geen Vriendcode meer.
        let dre = o.maak_speler("Dré").unwrap().speler_id;
        let dre_code = code(&o, dre);
        o.verwijder_speler(dre).unwrap();
        assert_eq!(o.vraag_vriend(ann, &dre_code).unwrap_err(), Fout::Onbekend("Unknown friend code"));
    }

    /// Een Opslag met een klok en twee Spelers die al vrienden zijn.
    fn twee_vrienden() -> (TestOpslag, Arc<Nepklok>, i64, i64) {
        let (mut o, klok) = met_klok();
        let ann = o.maak_speler("Ann").unwrap().speler_id;
        let bob = o.maak_speler("Bob").unwrap().speler_id;
        let bobs_code = code(&o, bob);
        o.vraag_vriend(ann, &bobs_code).unwrap();
        o.keur_vriendverzoek_goed(bob, ann).unwrap();
        (o, klok, ann, bob)
    }

    fn status(o: &TestOpslag, wie: i64, id: i64) -> &'static str {
        let s = o.uitdaging_stand(wie, id).unwrap();
        assert!(s.potje.is_none() || s.status == "accepted");
        s.status
    }

    #[test]
    fn een_uitdaging_komt_bij_de_vriend_en_accept_maakt_een_live_potje_voor_beiden() {
        let (mut o, _, ann, bob) = twee_vrienden();
        let u = o.daag_uit(ann, bob, "vierkant", Some(30)).unwrap();
        assert_eq!((u.spelersnaam.as_str(), u.van_naam.as_str(), u.aan), ("Bob", "Ann", vec![bob]));
        assert_eq!(u.verloopt_ms, 1_700_000_000_000 + UITDAGING_GELDIG_MS);
        // Bob ziet de Uitdaging met bord en Denktijd; Ann ziet dat ze openstaat. Er is nog geen Potje.
        let bobs = o.vriendenlijst(bob).unwrap();
        assert_eq!(bobs.uitdagingen.len(), 1);
        let uit = &bobs.uitdagingen[0];
        assert_eq!((uit.id, uit.speler_id, uit.spelersnaam.as_str(), uit.bord.as_str(), uit.denktijd_s), (u.id, ann, "Ann", "vierkant", Some(30)));
        assert!(bobs.uitgedaagd.is_empty());
        let anns = o.vriendenlijst(ann).unwrap();
        assert!(anns.uitdagingen.is_empty());
        assert_eq!((anns.uitgedaagd.len(), anns.uitgedaagd[0].spelersnaam.as_str()), (1, "Bob"));
        assert_eq!(status(&o, ann, u.id), "open");
        assert!(o.mijn_potjes(bob).unwrap().is_empty());
        // Alleen de uitgedaagde kan accepteren.
        assert_eq!(o.accepteer_uitdaging(ann, u.id).unwrap_err(), Fout::Onbekend("Unknown challenge"));
        // Accept: een vol, gestart Potje met Ann op plek 1 en Bob op plek 2, en de gekozen Denktijd.
        let potje = o.accepteer_uitdaging(bob, u.id).unwrap().unwrap();
        assert!(potje.vol && !potje.snel);
        assert_eq!((potje.bord.as_str(), potje.aantal_spelers, potje.denktijd_s), ("vierkant", 2, Some(30)));
        assert_eq!(potje.spelers.iter().map(|s| (s.plek, s.speler_id)).collect::<Vec<_>>(), [(1, ann), (2, bob)]);
        let stand = o.stand(bob, potje.potje_id).unwrap();
        assert!(stand.gestart);
        assert_eq!(o.mijn_potjes(ann).unwrap().len(), 1);
        assert_eq!(o.mijn_potjes(bob).unwrap().len(), 1);
        // Ann ziet het Potje bij haar Uitdaging; de Uitdaging staat nergens meer open en is niet nog eens te accepteren.
        let s = o.uitdaging_stand(ann, u.id).unwrap();
        assert_eq!((s.status, s.potje.map(|p| p.potje_id)), ("accepted", Some(potje.potje_id)));
        assert!(o.vriendenlijst(bob).unwrap().uitdagingen.is_empty());
        assert!(o.vriendenlijst(ann).unwrap().uitgedaagd.is_empty());
        assert_eq!(o.accepteer_uitdaging(bob, u.id).unwrap_err(), Fout::Onbekend("Unknown challenge"));
        // Een vreemde kan de Uitdaging van Ann niet volgen.
        let cas = o.maak_speler("Cas").unwrap().speler_id;
        assert_eq!(o.uitdaging_stand(cas, u.id).unwrap_err(), Fout::Onbekend("Unknown challenge"));
        // Ann kan weer uitdagen, ook al speelt ze al met Bob.
        assert!(o.daag_uit(ann, bob, "ster", None).is_ok());
    }

    #[test]
    fn zolang_een_uitdaging_openstaat_kan_dezelfde_uitdager_die_vriend_niet_opnieuw_uitdagen() {
        let (mut o, _, ann, bob) = twee_vrienden();
        o.daag_uit(ann, bob, "ster", None).unwrap();
        assert_eq!(o.daag_uit(ann, bob, "vierkant", Some(15)).unwrap_err(), Fout::Conflict("You already challenged this friend"));
        assert_eq!(o.vriendenlijst(bob).unwrap().uitdagingen.len(), 1);
        // Bob kan Ann wel uitdagen: een andere uitdager.
        assert!(o.daag_uit(bob, ann, "ster", None).is_ok());
    }

    #[test]
    fn decline_geeft_not_now_en_daarna_kan_de_uitdager_het_opnieuw() {
        let (mut o, _, ann, bob) = twee_vrienden();
        let u = o.daag_uit(ann, bob, "ster", Some(60)).unwrap();
        o.weiger_uitdaging(bob, u.id).unwrap();
        assert_eq!(status(&o, ann, u.id), "declined");
        assert!(o.vriendenlijst(bob).unwrap().uitdagingen.is_empty());
        assert!(o.vriendenlijst(ann).unwrap().uitgedaagd.is_empty());
        assert_eq!(o.accepteer_uitdaging(bob, u.id).unwrap_err(), Fout::Onbekend("Unknown challenge"));
        assert!(o.mijn_potjes(bob).unwrap().is_empty());
        // Weigeren van iets wat er niet is, is geen fout; Ann daagt opnieuw uit.
        o.weiger_uitdaging(bob, 999).unwrap();
        assert!(o.daag_uit(ann, bob, "ster", Some(60)).is_ok());
    }

    #[test]
    fn een_uitdaging_zonder_antwoord_vervalt_na_vijf_minuten() {
        let (mut o, klok, ann, bob) = twee_vrienden();
        let u = o.daag_uit(ann, bob, "ster", None).unwrap();
        let loop_ms = |ms: i64| klok.0.fetch_add(ms, std::sync::atomic::Ordering::SeqCst);
        loop_ms(UITDAGING_GELDIG_MS - 1);
        assert_eq!(o.uitdaging_stand(ann, u.id).unwrap().status, "open");
        assert_eq!(o.vriendenlijst(bob).unwrap().uitdagingen.len(), 1);
        // Nog één milliseconde en het is voorbij: Ann ziet "Not now", Bob ziet niets meer en kan niet meer accepteren.
        loop_ms(1);
        assert_eq!(status(&o, ann, u.id), "expired");
        assert!(o.vriendenlijst(bob).unwrap().uitdagingen.is_empty());
        assert!(o.vriendenlijst(ann).unwrap().uitgedaagd.is_empty());
        assert_eq!(o.accepteer_uitdaging(bob, u.id).unwrap_err(), Fout::Onbekend("Unknown challenge"));
        assert!(o.mijn_potjes(bob).unwrap().is_empty());
        // Een verlopen Uitdaging houdt Ann niet tegen.
        assert!(o.daag_uit(ann, bob, "ster", None).is_ok());
        // Na een dag is de oude rij opgeruimd.
        loop_ms(UITDAGING_BEWAAR_MS);
        o.daag_uit(bob, ann, "ster", None).unwrap();
        assert_eq!(o.uitdaging_stand(ann, u.id).unwrap_err(), Fout::Onbekend("Unknown challenge"));
    }

    /// Een Opslag met een klok, Ann en `n` vrienden van Ann (Bob, Cas, Dre, Eva, Fay).
    fn ann_met_vrienden(n: usize) -> (TestOpslag, Arc<Nepklok>, i64, Vec<i64>) {
        let (mut o, klok) = met_klok();
        let ann = o.maak_speler("Ann").unwrap().speler_id;
        let mut vrienden = Vec::new();
        for naam in ["Bob", "Cas", "Dre", "Eva", "Fay"].iter().take(n) {
            let id = o.maak_speler(naam).unwrap().speler_id;
            let c = code(&o, id);
            o.vraag_vriend(ann, &c).unwrap();
            o.keur_vriendverzoek_goed(id, ann).unwrap();
            vrienden.push(id);
        }
        (o, klok, ann, vrienden)
    }

    #[test]
    fn twee_vrienden_uitdagen_en_beiden_accepteren_geeft_een_potje_met_drie_spelers() {
        let (mut o, _, ann, v) = ann_met_vrienden(2);
        let (bob, cas) = (v[0], v[1]);
        let u = o.daag_vrienden_uit(ann, &[bob, cas], "ster", Some(60)).unwrap();
        assert_eq!((u.spelersnaam.as_str(), u.aan.clone()), ("Bob, Cas", vec![bob, cas]));
        // Beiden zien de Uitdaging met het aantal Spelers; Ann ziet beide namen openstaan en kan ze niet nog eens uitdagen.
        for (wie, rij) in [(bob, 0), (cas, 0)] {
            let l = o.vriendenlijst(wie).unwrap().uitdagingen;
            assert_eq!((l.len(), l[rij].aantal_spelers, l[rij].spelersnaam.as_str()), (1, 3, "Ann"));
        }
        assert_eq!(o.vriendenlijst(ann).unwrap().uitgedaagd.len(), 2);
        assert_eq!(o.daag_uit(ann, bob, "ster", None).unwrap_err(), Fout::Conflict("You already challenged this friend"));
        // Bob accepteert: nog geen Potje; Cas moet nog.
        let bobs_id = o.vriendenlijst(bob).unwrap().uitdagingen[0].id;
        let cas_id = o.vriendenlijst(cas).unwrap().uitdagingen[0].id;
        assert!(o.accepteer_uitdaging(bob, bobs_id).unwrap().is_none());
        let s = o.uitdaging_stand(ann, u.id).unwrap();
        assert_eq!((s.status, s.geaccepteerd, s.wachtend, s.geweigerd, s.aantal_spelers), ("open", vec!["Bob".to_string()], 1, 0, 3));
        assert_eq!(status(&o, bob, bobs_id), "open", "Bob wacht op Cas");
        assert!(o.mijn_potjes(ann).unwrap().is_empty());
        // Bob accepteert niet nog eens en kan niet meer weigeren.
        assert_eq!(o.accepteer_uitdaging(bob, bobs_id).unwrap_err(), Fout::Onbekend("Unknown challenge"));
        o.weiger_uitdaging(bob, bobs_id).unwrap();
        assert_eq!(o.uitdaging_stand(ann, u.id).unwrap().geaccepteerd, vec!["Bob".to_string()]);
        // Ann kan Bob nog niet opnieuw uitdagen zolang de groep wacht.
        assert_eq!(o.daag_uit(ann, bob, "ster", None).unwrap_err(), Fout::Conflict("You already challenged this friend"));
        // Cas accepteert: een vol, gestart Potje met drie Spelers, Ann op plek 1.
        let potje = o.accepteer_uitdaging(cas, cas_id).unwrap().unwrap();
        assert!(potje.vol && !potje.snel);
        assert_eq!((potje.bord.as_str(), potje.aantal_spelers, potje.denktijd_s), ("ster", 3, Some(60)));
        assert_eq!(potje.spelers.iter().map(|s| (s.plek, s.speler_id)).collect::<Vec<_>>(), [(1, ann), (2, bob), (3, cas)]);
        assert!(o.stand(cas, potje.potje_id).unwrap().gestart);
        for wie in [ann, bob, cas] {
            assert_eq!(o.mijn_potjes(wie).unwrap().len(), 1);
        }
        // Allen vinden het Potje bij hun Uitdaging; er staat niets meer open.
        assert_eq!(o.uitdaging_stand(ann, u.id).unwrap().potje.map(|p| p.potje_id), Some(potje.potje_id));
        assert_eq!(o.uitdaging_stand(bob, bobs_id).unwrap().potje.map(|p| p.potje_id), Some(potje.potje_id));
        assert!(o.vriendenlijst(ann).unwrap().uitgedaagd.is_empty());
        // De uitdager kan niet meer kiezen.
        assert_eq!(o.start_uitdaging(ann, u.id, UitdagingKeuze::Computer).unwrap_err(), Fout::Conflict("This challenge has already started"));
    }

    #[test]
    fn na_een_decline_kiest_de_uitdager_beginnen_met_wie_accepteerde() {
        let (mut o, _, ann, v) = ann_met_vrienden(3);
        let (bob, cas, dre) = (v[0], v[1], v[2]);
        let u = o.daag_vrienden_uit(ann, &[bob, cas, dre], "ster", None).unwrap();
        let id = |o: &TestOpslag, wie| o.vriendenlijst(wie).unwrap().uitdagingen[0].id;
        // Zolang niemand nee zei, valt er niets te kiezen.
        assert_eq!(o.start_uitdaging(ann, u.id, UitdagingKeuze::Computer).unwrap_err(), Fout::Conflict("Wait for the answers first"));
        let bobs = id(&o, bob);
        o.weiger_uitdaging(bob, bobs).unwrap();
        let s = o.uitdaging_stand(ann, u.id).unwrap();
        assert_eq!((s.status, s.geweigerd, s.wachtend, s.kan_beginnen), ("choice", 1, 2, false));
        // Niemand accepteerde nog: beginnen kan niet, vullen wel.
        assert_eq!(o.start_uitdaging(ann, u.id, UitdagingKeuze::Beginnen).unwrap_err(), Fout::Ongeldig("Nobody accepted yet"));
        let cas_id = id(&o, cas);
        assert!(o.accepteer_uitdaging(cas, cas_id).unwrap().is_none());
        let s = o.uitdaging_stand(ann, u.id).unwrap();
        assert_eq!((s.status, s.geaccepteerd, s.kan_beginnen), ("choice", vec!["Cas".to_string()], true));
        // Beginnen met Ann en Cas: een Potje van twee; Dre, die nog niet antwoordde, doet niet mee.
        let dres = id(&o, dre);
        let potje = o.start_uitdaging(ann, u.id, UitdagingKeuze::Beginnen).unwrap();
        assert!(potje.vol);
        assert_eq!((potje.aantal_spelers, potje.spelers.iter().map(|s| s.speler_id).collect::<Vec<_>>()), (2, vec![ann, cas]));
        assert!(o.stand(ann, potje.potje_id).unwrap().gestart);
        assert_eq!(o.accepteer_uitdaging(dre, dres).unwrap_err(), Fout::Onbekend("Unknown challenge"));
        assert_eq!(status(&o, dre, dres), "declined");
        assert_eq!(status(&o, bob, bobs), "declined");
        assert_eq!(o.uitdaging_stand(cas, cas_id).unwrap().potje.map(|p| p.potje_id), Some(potje.potje_id));
        assert!(o.mijn_potjes(dre).unwrap().is_empty() && o.mijn_potjes(bob).unwrap().is_empty());
        assert!(o.vriendenlijst(dre).unwrap().uitdagingen.is_empty());
    }

    #[test]
    fn na_een_decline_kiest_de_uitdager_de_lege_plek_te_vullen_met_een_computerspeler() {
        let (mut o, _, ann, v) = ann_met_vrienden(3);
        let (bob, cas, dre) = (v[0], v[1], v[2]);
        let u = o.daag_vrienden_uit(ann, &[bob, cas, dre], "ster", Some(30)).unwrap();
        let id = |o: &TestOpslag, wie| o.vriendenlijst(wie).unwrap().uitdagingen[0].id;
        o.weiger_uitdaging(dre, id(&o, dre)).unwrap();
        let (bobs, cas_id) = (id(&o, bob), id(&o, cas));
        o.accepteer_uitdaging(bob, bobs).unwrap();
        o.accepteer_uitdaging(cas, cas_id).unwrap();
        let s = o.uitdaging_stand(ann, u.id).unwrap();
        assert_eq!((s.status, s.geweigerd, s.wachtend, s.kan_beginnen), ("choice", 1, 0, true));
        // Vullen: nog steeds een Potje van vier, met een Computerspeler op de laatste plek; het begint meteen.
        let potje = o.start_uitdaging(ann, u.id, UitdagingKeuze::Computer).unwrap();
        assert!(potje.vol);
        assert_eq!((potje.aantal_spelers, potje.denktijd_s), (4, Some(30)));
        assert_eq!(potje.spelers.iter().map(|s| s.speler_id).take(3).collect::<Vec<_>>(), [ann, bob, cas]);
        assert!(potje.spelers[3].computer.is_some() && potje.spelers[..3].iter().all(|s| s.computer.is_none()));
        assert!(o.stand(ann, potje.potje_id).unwrap().gestart);
        // De Computerspeler komt niet in de Vriendenlijst.
        assert_eq!(o.vriendenlijst(ann).unwrap().vrienden.len(), 3);
        assert_eq!(o.uitdaging_stand(bob, bobs).unwrap().potje.map(|p| p.potje_id), Some(potje.potje_id));
    }

    #[test]
    fn een_aantal_dat_het_bord_niet_kent_kan_niet_en_vullen_met_computerspelers_wel() {
        let (mut o, _, ann, v) = ann_met_vrienden(5);
        // Vierkant bord: 2 of 4 Spelers. Twee vrienden (3) kan niet; drie (4) wel.
        assert_eq!(
            o.daag_vrienden_uit(ann, &v[..2], "vierkant", None).unwrap_err(),
            Fout::Ongeldig("A game on the square board has 2 or 4 players")
        );
        // Vier vrienden is een Potje van vijf: geen bord kent dat.
        for bord in ["ster", "vierkant"] {
            assert!(matches!(o.daag_vrienden_uit(ann, &v[..4], bord, None), Err(Fout::Ongeldig(_))), "{bord}");
        }
        // Nul, zes en dubbele vrienden mogen ook niet; en er is niets gemaakt.
        assert_eq!(o.daag_vrienden_uit(ann, &[], "ster", None).unwrap_err(), Fout::Ongeldig("Challenge 1 to 5 friends at once"));
        assert_eq!(o.daag_vrienden_uit(ann, &[v[0]; 6], "ster", None).unwrap_err(), Fout::Ongeldig("Challenge 1 to 5 friends at once"));
        assert_eq!(o.daag_vrienden_uit(ann, &[v[0], v[0]], "ster", None).unwrap_err(), Fout::Ongeldig("Choose each friend only once"));
        assert_eq!(tel(&o, "SELECT COUNT(*) FROM uitdaging", p![]), 0);
        // Vijf vrienden op het sterbord: zes Spelers. Eén Decline en vier accepteren: vijf Spelers kan niet.
        let u = o.daag_vrienden_uit(ann, &v, "ster", None).unwrap();
        let ids: Vec<i64> = v.iter().map(|&w| o.vriendenlijst(w).unwrap().uitdagingen[0].id).collect();
        o.weiger_uitdaging(v[4], ids[4]).unwrap();
        for i in 0..4 {
            o.accepteer_uitdaging(v[i], ids[i]).unwrap();
        }
        let s = o.uitdaging_stand(ann, u.id).unwrap();
        assert_eq!((s.status, s.geaccepteerd.len(), s.kan_beginnen), ("choice", 4, false));
        assert!(matches!(o.start_uitdaging(ann, u.id, UitdagingKeuze::Beginnen), Err(Fout::Ongeldig(_))));
        assert_eq!(o.uitdaging_stand(ann, u.id).unwrap().status, "choice", "de mislukte keuze liet niets achter");
        assert!(o.mijn_potjes(ann).unwrap().is_empty());
        let potje = o.start_uitdaging(ann, u.id, UitdagingKeuze::Computer).unwrap();
        assert_eq!((potje.aantal_spelers, potje.vol), (6, true));
        assert_eq!(potje.spelers.iter().filter(|s| s.computer.is_some()).count(), 1);
    }

    #[test]
    fn een_uitdaging_aan_meer_vrienden_vervalt_na_vijf_minuten_en_dan_kiest_de_uitdager() {
        let (mut o, klok, ann, v) = ann_met_vrienden(2);
        let (bob, cas) = (v[0], v[1]);
        let u = o.daag_vrienden_uit(ann, &[bob, cas], "ster", None).unwrap();
        let (bobs, cas_id) = (o.vriendenlijst(bob).unwrap().uitdagingen[0].id, o.vriendenlijst(cas).unwrap().uitdagingen[0].id);
        o.accepteer_uitdaging(bob, bobs).unwrap();
        klok.0.fetch_add(UITDAGING_GELDIG_MS - 1, std::sync::atomic::Ordering::SeqCst);
        assert_eq!(o.uitdaging_stand(ann, u.id).unwrap().status, "open");
        klok.0.fetch_add(1, std::sync::atomic::Ordering::SeqCst);
        // Cas antwoordde niet: Ann kiest. Cas kan niet meer accepteren en ziet niets meer; Bob wacht nog op de keuze.
        let s = o.uitdaging_stand(ann, u.id).unwrap();
        assert_eq!((s.status, s.geweigerd, s.wachtend, s.geaccepteerd, s.kan_beginnen), ("choice", 1, 0, vec!["Bob".to_string()], true));
        assert_eq!(o.accepteer_uitdaging(cas, cas_id).unwrap_err(), Fout::Onbekend("Unknown challenge"));
        assert!(o.vriendenlijst(cas).unwrap().uitdagingen.is_empty());
        assert_eq!(status(&o, cas, cas_id), "expired");
        assert_eq!(status(&o, bob, bobs), "open");
        let rest = o.vriendenlijst(ann).unwrap().uitgedaagd;
        assert_eq!(rest.iter().map(|u| (u.spelersnaam.as_str(), u.antwoord, u.groep)).collect::<Vec<_>>(), [("Bob", "accepted", u.id), ("Cas", "declined", u.id)]);
        let potje = o.start_uitdaging(ann, u.id, UitdagingKeuze::Beginnen).unwrap();
        assert_eq!((potje.aantal_spelers, potje.vol), (2, true));
        assert_eq!(potje.spelers.iter().map(|s| s.speler_id).collect::<Vec<_>>(), [ann, bob]);
        assert!(o.vriendenlijst(ann).unwrap().uitgedaagd.is_empty());
        // Wie niet kiest binnen een uur, verliest de Uitdaging voor iedereen.
        let u2 = o.daag_vrienden_uit(ann, &[bob, cas], "ster", None).unwrap();
        let b2 = o.vriendenlijst(bob).unwrap().uitdagingen[0].id;
        o.accepteer_uitdaging(bob, b2).unwrap();
        klok.0.fetch_add(UITDAGING_KEUZE_MS, std::sync::atomic::Ordering::SeqCst);
        assert_eq!(o.uitdaging_stand(ann, u2.id).unwrap().status, "expired");
        assert_eq!(status(&o, bob, b2), "expired");
        assert_eq!(o.start_uitdaging(ann, u2.id, UitdagingKeuze::Computer).unwrap_err(), Fout::Onbekend("Unknown challenge"));
        assert!(o.vriendenlijst(ann).unwrap().uitgedaagd.is_empty());
        assert!(o.daag_vrienden_uit(ann, &[bob, cas], "ster", None).is_ok());
    }

    #[test]
    fn de_uitdager_kan_zijn_uitdaging_aan_meer_vrienden_intrekken() {
        let (mut o, _, ann, v) = ann_met_vrienden(2);
        let (bob, cas) = (v[0], v[1]);
        let u = o.daag_vrienden_uit(ann, &[bob, cas], "ster", None).unwrap();
        let bobs = o.vriendenlijst(bob).unwrap().uitdagingen[0].id;
        o.accepteer_uitdaging(bob, bobs).unwrap();
        // Een ander kan haar niet intrekken; Ann wel, en daarna is niemand nog gebonden.
        o.weiger_uitdaging(cas, u.id).unwrap();
        assert_eq!(o.uitdaging_stand(ann, u.id).unwrap().geaccepteerd.len(), 1);
        o.weiger_uitdaging(ann, u.id).unwrap();
        assert_eq!(o.uitdaging_stand(bob, bobs).unwrap_err(), Fout::Onbekend("Unknown challenge"));
        assert!(o.vriendenlijst(cas).unwrap().uitdagingen.is_empty());
        assert_eq!(o.start_uitdaging(ann, u.id, UitdagingKeuze::Computer).unwrap_err(), Fout::Onbekend("Unknown challenge"));
        assert!(o.daag_vrienden_uit(ann, &[bob, cas], "ster", None).is_ok());
    }

    #[test]
    fn een_geblokkeerde_of_onbekende_speler_in_de_groep_laat_de_hele_uitdaging_mislukken() {
        let (mut o, _, ann, v) = ann_met_vrienden(2);
        let (bob, cas) = (v[0], v[1]);
        let vreemd = o.maak_speler("Dre").unwrap().speler_id;
        assert_eq!(o.daag_vrienden_uit(ann, &[bob, vreemd], "ster", None).unwrap_err(), Fout::Onbekend("Unknown player"));
        assert_eq!(tel(&o, "SELECT COUNT(*) FROM uitdaging", p![]), 0);
        // Blokkeert Cas zodra de Uitdaging loopt, dan telt zijn plek als nee: Ann kiest.
        let u = o.daag_vrienden_uit(ann, &[bob, cas], "ster", None).unwrap();
        samen_in_een_potje(&mut o, cas, ann);
        o.blokkeer(cas, ann).unwrap();
        let s = o.uitdaging_stand(ann, u.id).unwrap();
        assert_eq!((s.status, s.geweigerd, s.wachtend), ("choice", 1, 1));
        let bobs = o.vriendenlijst(bob).unwrap().uitdagingen[0].id;
        o.accepteer_uitdaging(bob, bobs).unwrap();
        let potje = o.start_uitdaging(ann, u.id, UitdagingKeuze::Beginnen).unwrap();
        assert_eq!(potje.spelers.iter().map(|s| s.speler_id).collect::<Vec<_>>(), [ann, bob]);
        // Ook een andere uitdager kan niet bij de keuze.
        assert_eq!(o.start_uitdaging(bob, u.id, UitdagingKeuze::Computer).unwrap_err(), Fout::Onbekend("Unknown challenge"));
    }

    #[test]
    fn een_geblokkeerde_speler_is_niet_uit_te_dagen_in_beide_richtingen() {
        let (mut o, _, ann, bob) = twee_vrienden();
        let u = o.daag_uit(ann, bob, "ster", None).unwrap();
        // Blokkeren haalt de open Uitdaging weg: Bob kan niet meer accepteren.
        samen_in_een_potje(&mut o, bob, ann);
        o.blokkeer(bob, ann).unwrap();
        assert_eq!(o.accepteer_uitdaging(bob, u.id).unwrap_err(), Fout::Onbekend("Unknown challenge"));
        assert!(o.vriendenlijst(bob).unwrap().uitdagingen.is_empty());
        assert!(o.vriendenlijst(ann).unwrap().uitgedaagd.is_empty());
        // Geen van beiden kan de ander uitdagen; ze zien alleen "Unknown player".
        for (wie, wien) in [(ann, bob), (bob, ann)] {
            assert_eq!(o.daag_uit(wie, wien, "ster", None).unwrap_err(), Fout::Onbekend("Unknown player"));
        }
        // Ook na deblokkeren moeten ze eerst weer vrienden worden.
        o.deblokkeer(bob, ann).unwrap();
        assert_eq!(o.daag_uit(ann, bob, "ster", None).unwrap_err(), Fout::Onbekend("Unknown player"));
        assert_eq!(tel(&o, "SELECT COUNT(*) FROM uitdaging WHERE status = 'open'", p![]), 0);
    }

    #[test]
    fn alleen_een_vriend_is_uit_te_dagen_en_de_keuze_moet_geldig_zijn() {
        let (mut o, _, ann, bob) = twee_vrienden();
        let cas = o.maak_speler("Cas").unwrap().speler_id;
        assert_eq!(o.daag_uit(ann, cas, "ster", None).unwrap_err(), Fout::Onbekend("Unknown player"));
        assert_eq!(o.daag_uit(ann, ann, "ster", None).unwrap_err(), Fout::Onbekend("Unknown player"));
        assert_eq!(o.daag_uit(ann, 999, "ster", None).unwrap_err(), Fout::Onbekend("Unknown player"));
        assert_eq!(
            o.daag_uit(ann, bob, "driehoek", None).unwrap_err(),
            Fout::Ongeldig("The board must be \"ster\" or \"vierkant\"")
        );
        assert_eq!(
            o.daag_uit(ann, bob, "ster", Some(7)).unwrap_err(),
            Fout::Ongeldig("The move time is 15, 30, 60 or 120 seconds, or no limit")
        );
        assert_eq!(tel(&o, "SELECT COUNT(*) FROM uitdaging", p![]), 0);
        // Een vriend die je uit je lijst haalt, kun je niet meer uitdagen; een open Uitdaging gaat dan weg.
        let u = o.daag_uit(ann, bob, "ster", None).unwrap();
        o.verwijder_vriend(ann, bob).unwrap();
        assert_eq!(o.accepteer_uitdaging(bob, u.id).unwrap_err(), Fout::Onbekend("Unknown challenge"));
        assert_eq!(o.daag_uit(ann, bob, "ster", None).unwrap_err(), Fout::Onbekend("Unknown player"));
    }

    #[test]
    fn een_account_verwijderen_ruimt_uitdagingen_op() {
        let (mut o, _, ann, bob) = twee_vrienden();
        o.daag_uit(ann, bob, "ster", None).unwrap();
        o.verwijder_speler(ann).unwrap();
        assert!(o.vriendenlijst(bob).unwrap().uitdagingen.is_empty());
        assert_eq!(tel(&o, "SELECT COUNT(*) FROM uitdaging", p![]), 0);
    }

    #[test]
    fn een_account_verwijderen_ruimt_vriendverzoeken_op() {
        let (mut o, ann, bob, _) = drie_spelers();
        o.vraag_vriend(ann, &code(&o, bob)).unwrap();
        o.verwijder_speler(ann).unwrap();
        assert!(o.vriendenlijst(bob).unwrap().verzoeken.is_empty());
        assert_eq!(tel(&o, "SELECT COUNT(*) FROM vriendverzoek", p![]), 0);
    }

    #[test]
    fn bij_een_potje_voor_drie_zijn_alle_spelers_elkaars_vriend_en_de_laatste_staat_bovenaan() {
        let (mut o, klok) = met_klok();
        let ann = o.maak_speler("Ann").unwrap().speler_id;
        let bob = o.maak_speler("Bob").unwrap().speler_id;
        let cas = o.maak_speler("Cas").unwrap().speler_id;
        let dre = o.maak_speler("Dré").unwrap().speler_id;
        let eerste = o.maak_potje(ann, "ster", 3, None).unwrap();
        o.doe_mee(bob, &eerste.uitnodiging).unwrap();
        klok.0.fetch_add(1000, std::sync::atomic::Ordering::SeqCst);
        o.doe_mee(cas, &eerste.uitnodiging).unwrap();
        assert_eq!(namen(&o.vriendenlijst(cas).unwrap()), ["Ann", "Bob"]);
        assert_eq!(namen(&o.vriendenlijst(ann).unwrap()), ["Cas", "Bob"]);
        // Later speelt Ann met Dré: Dré staat bovenaan.
        klok.0.fetch_add(5000, std::sync::atomic::Ordering::SeqCst);
        let tweede = o.maak_potje(dre, "ster", 2, None).unwrap();
        o.doe_mee(ann, &tweede.uitnodiging).unwrap();
        assert_eq!(namen(&o.vriendenlijst(ann).unwrap()), ["Dré", "Cas", "Bob"]);
        // Weer samen spelen zet Bob bovenaan.
        klok.0.fetch_add(5000, std::sync::atomic::Ordering::SeqCst);
        let derde = o.maak_potje(bob, "ster", 2, None).unwrap();
        o.doe_mee(ann, &derde.uitnodiging).unwrap();
        assert_eq!(namen(&o.vriendenlijst(ann).unwrap()), ["Bob", "Dré", "Cas"]);
    }

    #[test]
    fn een_naam_weghalen_werkt_alleen_in_de_eigen_lijst() {
        let (mut o, ann, bob, _, _) = ann_en_bob();
        o.verwijder_vriend(ann, bob).unwrap();
        assert!(o.vriendenlijst(ann).unwrap().vrienden.is_empty());
        assert_eq!(namen(&o.vriendenlijst(bob).unwrap()), ["Ann"]);
        // Nog eens weghalen, of iemand die niet in de lijst staat, is geen fout.
        o.verwijder_vriend(ann, bob).unwrap();
        o.verwijder_vriend(ann, 999).unwrap();
        // Een nieuw Potje via een Uitnodiging zet Bob weer in de lijst.
        let p = o.maak_potje(bob, "ster", 2, None).unwrap();
        o.doe_mee(ann, &p.uitnodiging).unwrap();
        assert_eq!(namen(&o.vriendenlijst(ann).unwrap()), ["Bob"]);
    }

    #[test]
    fn blokkeren_haalt_iemand_uit_de_lijst_in_beide_richtingen_en_houdt_hem_eruit() {
        let (mut o, ann, bob, _, _) = ann_en_bob();
        o.blokkeer(ann, bob).unwrap();
        assert!(o.vriendenlijst(ann).unwrap().vrienden.is_empty());
        assert!(o.vriendenlijst(bob).unwrap().vrienden.is_empty());
        // Deblokkeren zet niemand terug; pas een nieuw Potje samen doet dat.
        o.deblokkeer(ann, bob).unwrap();
        assert!(o.vriendenlijst(ann).unwrap().vrienden.is_empty());
        // Staat een geblokkeerde Speler toch nog als rij in de tabel, dan toont de lijst hem niet.
        o.blokkeer(bob, ann).unwrap();
        o.db.voer_uit("INSERT INTO vriend (speler_id, vriend_id, laatst_ms) VALUES (?1, ?2, 0), (?2, ?1, 0)", p![ann, bob]).unwrap();
        assert!(o.vriendenlijst(ann).unwrap().vrienden.is_empty());
        assert!(o.vriendenlijst(bob).unwrap().vrienden.is_empty());
    }

    #[test]
    fn een_verwijderde_speler_staat_niet_meer_in_de_lijst_en_heeft_geen_vriendcode() {
        let (mut o, ann, bob, _, _) = ann_en_bob();
        o.verwijder_speler(bob).unwrap();
        assert!(o.vriendenlijst(ann).unwrap().vrienden.is_empty());
        assert_eq!(tel(&o, "SELECT COUNT(*) FROM vriend", p![]), 0);
        assert_eq!(o.vriendenlijst(bob).unwrap_err(), Fout::Onbekend("Unknown player"));
    }

    #[test]
    fn meedoen_kan_niet_met_een_blokkade_tussen_spelers() {
        let (mut o, ann, bob, _, _) = ann_en_bob();
        o.blokkeer(ann, bob).unwrap();
        // Bob nodigt Ann uit: Ann blokkeerde Bob, dus Ann kan niet meedoen, en andersom ook niet.
        let van_bob = o.maak_potje(bob, "ster", 2, None).unwrap();
        assert_eq!(
            o.doe_mee(ann, &van_bob.uitnodiging).unwrap_err(),
            Fout::Verboden("You blocked a player in this game. Unblock them in Account to join.")
        );
        let van_ann = o.maak_potje(ann, "ster", 2, None).unwrap();
        assert_eq!(o.doe_mee(bob, &van_ann.uitnodiging).unwrap_err(), Fout::Verboden("You cannot join this game"));
        // Een ander kan gewoon meedoen; na deblokkeren Ann ook.
        let cas = o.maak_speler("Cas").unwrap().speler_id;
        let ander = o.maak_potje(bob, "ster", 3, None).unwrap();
        o.doe_mee(cas, &ander.uitnodiging).unwrap();
        o.deblokkeer(ann, bob).unwrap();
        assert!(o.doe_mee(ann, &van_bob.uitnodiging).unwrap().vol);
    }

    #[test]
    fn een_geweerde_speler_kan_niet_chatten_maken_of_meedoen_maar_speelt_door() {
        let (mut o, ann, bob, potje, b) = ann_en_bob();
        o.rapporteer(ann, potje, NieuwRapport { bericht_id: Some(b.id), speler_id: None }).unwrap();
        let id = o.open_rapporten().unwrap()[0].id;
        o.weer_speler(id).unwrap();
        let weg = Fout::Verboden("You can no longer chat or join games");
        assert_eq!(o.stuur_bericht(bob, potje, "hi").unwrap_err(), weg);
        assert_eq!(o.maak_potje(bob, "ster", 2, None).unwrap_err(), weg);
        let p = o.maak_potje(ann, "ster", 2, None).unwrap();
        assert_eq!(o.doe_mee(bob, &p.uitnodiging).unwrap_err(), weg);
        // Een lopend Potje gaat door: opgeven kan nog.
        assert!(o.geef_op(bob, potje).unwrap().afgelopen);
        assert_eq!(o.verberg_bericht(999).unwrap_err(), Fout::Onbekend("Unknown report"));
    }

    #[test]
    fn apns_token_bewaren_verhuizen_en_opruimen() {
        let mut o = Opslag::in_geheugen().unwrap();
        let ann = o.maak_speler("Ann").unwrap().speler_id;
        let bob = o.maak_speler("Bob").unwrap().speler_id;
        let token = "AB".repeat(32);
        o.bewaar_apns_token(ann, &ApnsToken { token: token.clone(), omgeving: ApnsOmgeving::Sandbox }).unwrap();
        // Bewaard in kleine letters, met de omgeving.
        assert_eq!(o.apns_tokens_van(ann).unwrap(), vec![ApnsToken { token: "ab".repeat(32), omgeving: ApnsOmgeving::Sandbox }]);
        // Hetzelfde toestel bij een andere Speler: het token verhuist.
        o.bewaar_apns_token(bob, &ApnsToken { token: token.clone(), omgeving: ApnsOmgeving::Production }).unwrap();
        assert!(o.apns_tokens_van(ann).unwrap().is_empty());
        assert_eq!(o.apns_tokens_van(bob).unwrap()[0].omgeving, ApnsOmgeving::Production);
        // Ann kan het token van Bob niet weghalen; Bob wel.
        o.verwijder_apns_token(ann, &token).unwrap();
        assert_eq!(o.apns_tokens_van(bob).unwrap().len(), 1);
        o.verwijder_apns_token(bob, &token).unwrap();
        assert!(o.apns_tokens_van(bob).unwrap().is_empty());
        // Opruimen na een weigering van Apple.
        o.bewaar_apns_token(bob, &ApnsToken { token: token.clone(), omgeving: ApnsOmgeving::Sandbox }).unwrap();
        o.ruim_apns_token_op(&"ab".repeat(32)).unwrap();
        assert!(o.apns_tokens_van(bob).unwrap().is_empty());
        // Geen hexadecimale tekst of te kort: geweigerd.
        for slecht in ["xyz".repeat(30), "ab".repeat(10)] {
            let f = o.bewaar_apns_token(ann, &ApnsToken { token: slecht, omgeving: ApnsOmgeving::Sandbox }).unwrap_err();
            assert_eq!(f, Fout::Ongeldig("The device token is not valid"));
        }
    }
    struct Nepklok(std::sync::atomic::AtomicI64);
    impl Klok for Nepklok {
        fn nu_ms(&self) -> i64 {
            self.0.load(std::sync::atomic::Ordering::SeqCst)
        }
    }

    type TestOpslag = Opslag<rusqlite::Connection>;

    /// Een Opslag met een klok die de test zelf verzet.
    fn met_klok() -> (TestOpslag, Arc<Nepklok>) {
        let mut o = Opslag::in_geheugen().unwrap();
        let klok = Arc::new(Nepklok(std::sync::atomic::AtomicI64::new(1_700_000_000_000)));
        o.zet_klok(klok.clone());
        (o, klok)
    }

    /// Laat de klok `ms` verder lopen en slaat de verlopen beurten over. Geeft de soort van de laatste Zet.
    fn tik(o: &mut TestOpslag, klok: &Nepklok, ms: i64) -> Vec<Stand> {
        klok.0.fetch_add(ms, std::sync::atomic::Ordering::SeqCst);
        o.sla_verlopen_beurten_over().unwrap()
    }

    /// Een vol Potje met Denktijd; geeft de Spelers (op plek) en het Potje.
    fn denktijd_potje(o: &mut TestOpslag, aantal: u32, denktijd_s: i64) -> (Vec<i64>, i64) {
        let mut ids = Vec::new();
        for naam in ["Ann", "Bob", "Cas"].into_iter().take(aantal as usize) {
            ids.push(o.maak_speler(naam).unwrap().speler_id);
        }
        let potje = o.maak_potje(ids[0], "ster", aantal, Some(denktijd_s)).unwrap();
        for &id in &ids[1..] {
            o.doe_mee(id, &potje.uitnodiging).unwrap();
        }
        (ids, potje.potje_id)
    }

    /// De Speler aan de beurt doet een geldige Zet; `spiegel` volgt het Potje.
    fn zet_voor(o: &mut TestOpslag, spiegel: &mut Game, speler_id: i64, potje: i64) {
        let wie = spiegel.current_player();
        let van = (0..spiegel.board().len()).find(|&v| spiegel.stone_at(v) == Some(wie) && !spiegel.destinations(v).is_empty()).unwrap();
        let naar = spiegel.destinations(van)[0];
        o.doe_zet(speler_id, potje, van, naar).unwrap();
        spiegel.make_move(van, naar).unwrap();
    }

    fn soort(stand: &Stand) -> &'static str {
        stand.laatste_zet.as_ref().unwrap().soort
    }

    #[test]
    fn niemand_zet_dan_geeft_de_eerste_speler_na_drie_gemiste_beurten_op() {
        let (mut o, klok) = met_klok();
        let (ids, potje) = denktijd_potje(&mut o, 2, 15);
        // Ann mist beurt 1, 3 en 5; Bob beurt 2 en 4.
        let mut soorten = Vec::new();
        for _ in 0..5 {
            let standen = tik(&mut o, &klok, 15_000);
            assert_eq!(standen.len(), 1);
            soorten.push(soort(&standen[0]));
        }
        assert_eq!(soorten, ["overgeslagen", "overgeslagen", "overgeslagen", "overgeslagen", "opgeven"]);
        let stand = o.stand(ids[1], potje).unwrap();
        assert!(stand.afgelopen);
        assert_eq!(stand.laatste_zet.as_ref().map(|z| z.plek), Some(1));
        assert_eq!(stand.spelers[0].status, "opgegeven");
        assert_eq!(stand.deadline_ms, None);
        assert_eq!(o.volgende_deadline().unwrap(), None);
        assert!(tik(&mut o, &klok, 60_000).is_empty());
    }

    #[test]
    fn bij_drie_spelers_geeft_alleen_de_afwezige_speler_op() {
        let (mut o, klok) = met_klok();
        let (ids, potje) = denktijd_potje(&mut o, 3, 15);
        let mut spiegel = Game::new_star(3).unwrap();
        // Ann (plek 0) mist elke beurt; Bob en Cas zetten steeds.
        for ronde in 0..3 {
            let standen = tik(&mut o, &klok, 15_000);
            assert_eq!(standen[0].laatste_zet.as_ref().unwrap().plek, 1);
            if ronde < 2 {
                assert_eq!(soort(&standen[0]), "overgeslagen");
                spiegel.skip_turn().unwrap();
                zet_voor(&mut o, &mut spiegel, ids[1], potje);
                zet_voor(&mut o, &mut spiegel, ids[2], potje);
            } else {
                assert_eq!(soort(&standen[0]), "opgeven");
                spiegel.resign(0).unwrap();
            }
        }
        let stand = o.stand(ids[1], potje).unwrap();
        assert_eq!(stand.spelers[0].status, "opgegeven");
        assert!(!stand.afgelopen, "Bob en Cas spelen verder");
        assert_eq!(stand.aan_de_beurt, Some(2));
        zet_voor(&mut o, &mut spiegel, ids[1], potje);
        zet_voor(&mut o, &mut spiegel, ids[2], potje);
        assert!(o.volgende_deadline().unwrap().is_some());
    }

    #[test]
    fn een_gewone_zet_zet_de_telling_terug() {
        let (mut o, klok) = met_klok();
        let (ids, potje) = denktijd_potje(&mut o, 2, 15);
        let mut spiegel = Game::new_star(2).unwrap();
        // Ann mist 2 beurten, Bob zet steeds.
        for _ in 0..2 {
            assert_eq!(soort(&tik(&mut o, &klok, 15_000)[0]), "overgeslagen");
            spiegel.skip_turn().unwrap();
            zet_voor(&mut o, &mut spiegel, ids[1], potje);
        }
        // Ann zet nu zelf: de telling gaat op nul.
        zet_voor(&mut o, &mut spiegel, ids[0], potje);
        zet_voor(&mut o, &mut spiegel, ids[1], potje);
        for _ in 0..2 {
            assert_eq!(soort(&tik(&mut o, &klok, 15_000)[0]), "overgeslagen");
            spiegel.skip_turn().unwrap();
            zet_voor(&mut o, &mut spiegel, ids[1], potje);
        }
        assert!(!o.stand(ids[0], potje).unwrap().afgelopen);
        // Pas de derde gemiste beurt sinds Ann's laatste Zet is een opgave.
        let standen = tik(&mut o, &klok, 15_000);
        assert_eq!(soort(&standen[0]), "opgeven");
        assert!(standen[0].afgelopen);
    }

    #[test]
    fn het_aantal_open_potjes_met_denktijd_heeft_een_maximum() {
        let (mut o, _) = met_klok();
        let ann = o.maak_speler("Ann").unwrap().speler_id;
        let bob = o.maak_speler("Bob").unwrap().speler_id;
        let eerste = o.maak_potje(ann, "ster", 2, Some(30)).unwrap();
        for _ in 1..MAX_OPEN_DENKTIJD_POTJES {
            o.maak_potje(ann, "ster", 2, Some(30)).unwrap();
        }
        // Zonder Denktijd mag nog wel, en een andere Speler heeft zijn eigen ruimte.
        o.maak_potje(ann, "ster", 2, None).unwrap();
        o.maak_potje(bob, "ster", 2, Some(30)).unwrap();
        let fout = o.maak_potje(ann, "ster", 2, Some(30)).unwrap_err();
        assert!(matches!(fout, Fout::Conflict(t) if t.contains("too many open games")), "{fout:?}");
        // Een afgelopen Potje telt niet mee: Bob doet mee en geeft op.
        o.doe_mee(bob, &eerste.uitnodiging).unwrap();
        o.geef_op(bob, eerste.potje_id).unwrap();
        o.maak_potje(ann, "ster", 2, Some(30)).unwrap();
    }

    #[test]
    fn aanvraag_teller_laat_vijf_toe_en_weigert_de_zesde() {
        let (mut o, _klok) = met_klok();
        for _ in 0..MAX_AANVRAGEN {
            assert!(o.tel_aanvraag(Some("203.0.113.7")).unwrap());
        }
        assert!(!o.tel_aanvraag(Some("203.0.113.7")).unwrap());
        // Een ander internetadres telt los; zonder adres telt de gedeelde sleutel.
        assert!(o.tel_aanvraag(Some("198.51.100.1")).unwrap());
        for _ in 0..MAX_AANVRAGEN {
            assert!(o.tel_aanvraag(None).unwrap());
        }
        assert!(!o.tel_aanvraag(None).unwrap());
        assert!(!o.tel_aanvraag(Some("")).unwrap());
    }

    #[test]
    fn aanvraag_teller_laat_na_een_minuut_weer_toe_en_ruimt_op() {
        let (mut o, klok) = met_klok();
        for _ in 0..MAX_AANVRAGEN {
            assert!(o.tel_aanvraag(Some("203.0.113.7")).unwrap());
        }
        // Net voor het einde van de periode nog niet.
        klok.0.fetch_add(AANVRAAG_PERIODE_MS - 1, std::sync::atomic::Ordering::SeqCst);
        assert!(!o.tel_aanvraag(Some("203.0.113.7")).unwrap());
        klok.0.fetch_add(1, std::sync::atomic::Ordering::SeqCst);
        assert!(o.tel_aanvraag(Some("203.0.113.7")).unwrap());
        // De verlopen rijen zijn weg: alleen de nieuwe poging staat er nog.
        let n = o.db.rij("SELECT COUNT(*) FROM aanvraag", p![]).unwrap().unwrap().i64(0).unwrap();
        assert_eq!(n, 1);
    }

    #[test]
    fn aanvraag_teller_bewaart_geen_ruw_internetadres() {
        let (mut o, _klok) = met_klok();
        // Een geweigerde poging wordt niet bewaard.
        for _ in 0..MAX_AANVRAGEN + 3 {
            o.tel_aanvraag(Some("203.0.113.7")).unwrap();
        }
        let rijen = o.db.rijen("SELECT adres_hash, tijd_ms FROM aanvraag", p![]).unwrap();
        assert_eq!(rijen.len() as i64, MAX_AANVRAGEN);
        for r in rijen {
            let h = r.tekst(0).unwrap();
            assert_eq!(h, codes::hash("203.0.113.7"));
            assert!(!h.contains("203.0.113.7"));
        }
    }

    // Computerspeler (taak 96)

    /// Een Potje met één Speler (Ann) en daarna `computers` Computerspelers. Geeft Ann, het Potje en de Stand na het toevoegen.
    fn computer_potje(o: &mut TestOpslag, aantal: u32, denktijd_s: Option<i64>) -> (i64, i64, Stand) {
        let ann = o.maak_speler("Ann").unwrap().speler_id;
        let potje = o.maak_potje(ann, "ster", aantal, denktijd_s).unwrap();
        let mut stand = None;
        for _ in 1..aantal {
            stand = Some(o.voeg_computerspeler_toe(potje.potje_id).unwrap());
        }
        (ann, potje.potje_id, stand.unwrap())
    }

    #[test]
    fn computerspeler_ziet_er_uit_als_een_gewone_speler() {
        let (mut o, _) = met_klok();
        let (ann, potje, stand) = computer_potje(&mut o, 2, Some(30));
        assert!(stand.gestart);
        assert_eq!(stand.aan_de_beurt, Some(1), "Ann zet eerst");
        let naam = &stand.spelers[1].speler.spelersnaam;
        assert!(COMPUTER_NAMEN.contains(&naam.as_str()));
        assert!(!woordfilter::is_grof(naam));
        // Niets in de JSON verraadt het verschil.
        let json = serde_json::to_value(&stand).unwrap();
        assert!(!json.to_string().to_lowercase().contains("computer"));
        assert_eq!(json["spelers"][1]["status"], "speelt");
        // De Computerspeler staat in Mijn potjes van Ann als gewone tegenstander.
        assert_eq!(o.mijn_potjes(ann).unwrap()[0].potje_id, potje);
        // Niemand kan als hij inloggen: de sleutel is weggegooid.
        assert_eq!(o.speler_van_sleutel(""), Err(Fout::NietIngelogd));
    }

    #[test]
    fn computerspeler_alleen_in_een_potje_met_een_speler_dat_nog_niet_vol_is() {
        let (mut o, _) = met_klok();
        let (_, potje, _) = computer_potje(&mut o, 2, None);
        assert_eq!(o.voeg_computerspeler_toe(potje).unwrap_err(), Fout::Vol);
        assert_eq!(o.voeg_computerspeler_toe(999).unwrap_err(), Fout::Onbekend("Unknown game"));
    }

    #[test]
    fn computerspeler_krijgt_een_naam_die_nog_niet_in_het_potje_staat() {
        let (mut o, _) = met_klok();
        let (_, _, stand) = computer_potje(&mut o, 6, None);
        let mut namen: Vec<&str> = stand.spelers.iter().map(|s| s.speler.spelersnaam.as_str()).collect();
        namen.sort();
        namen.dedup();
        assert_eq!(namen.len(), 6);
        // Dezelfde naam is dezelfde rij: de tabel groeit niet met elk Potje.
        for _ in 0..40 {
            let ann = o.maak_speler("Ann").unwrap().speler_id;
            let p = o.maak_potje(ann, "ster", 2, None).unwrap();
            o.voeg_computerspeler_toe(p.potje_id).unwrap();
        }
        let n = o.db.rij("SELECT COUNT(*) FROM speler WHERE computer IS NOT NULL", p![]).unwrap().unwrap().i64(0).unwrap();
        assert!(n <= COMPUTER_NAMEN.len() as i64);
    }

    #[test]
    fn computerspeler_wacht_even_en_zet_dan_zelf() {
        let (mut o, klok) = met_klok();
        let (ann, potje, _) = computer_potje(&mut o, 2, None);
        let mut spiegel = Game::new_star(2).unwrap();
        // Ann zet; daarna is de Computerspeler aan de beurt, maar nog niet meteen.
        zet_voor(&mut o, &mut spiegel, ann, potje);
        let nu = klok.0.load(std::sync::atomic::Ordering::SeqCst);
        let klaar = o.volgende_deadline().unwrap().unwrap();
        assert!((nu + COMPUTER_WACHT_MS..nu + COMPUTER_WACHT_MS + COMPUTER_SPREIDING_MS).contains(&klaar));
        assert!(tik(&mut o, &klok, COMPUTER_WACHT_MS - 1).is_empty());
        let standen = tik(&mut o, &klok, COMPUTER_SPREIDING_MS);
        assert_eq!(standen.len(), 1);
        let z = standen[0].laatste_zet.as_ref().unwrap();
        assert_eq!((z.plek, z.soort, standen[0].aan_de_beurt), (2, "zet", Some(1)));
        // De server keurde de Zet van de Computerspeler al goed; de spiegel van Ann ook.
        spiegel.make_move(z.van.unwrap() as usize, z.naar.unwrap() as usize).unwrap();
        // Nu is Ann aan de beurt: geen klaarstaande Zet meer.
        assert_eq!(o.volgende_deadline().unwrap(), None);
    }

    #[test]
    fn met_denktijd_wacht_de_computerspeler_hooguit_de_helft() {
        let (mut o, klok) = met_klok();
        let (ann, potje, _) = computer_potje(&mut o, 2, Some(15));
        let mut spiegel = Game::new_star(2).unwrap();
        zet_voor(&mut o, &mut spiegel, ann, potje);
        let nu = klok.0.load(std::sync::atomic::Ordering::SeqCst);
        assert!(o.volgende_deadline().unwrap().unwrap() <= nu + 7_500);
        let standen = tik(&mut o, &klok, 7_500);
        assert_eq!(standen[0].laatste_zet.as_ref().unwrap().soort, "zet");
        // Hij is nooit een overgeslagen beurt: de Denktijd van Ann loopt nu, niet de zijne.
        assert_eq!(standen[0].aan_de_beurt, Some(1));
    }

    /// Ann en een Computerspeler spelen een heel Potje op de server; alles loopt via `doe_zet` en `sla_verlopen_beurten_over`.
    fn speel_tot_het_einde(aantal: u32, denktijd_s: Option<i64>) -> (usize, Stand) {
        let (mut o, klok) = met_klok();
        let (ann, potje, _) = computer_potje(&mut o, aantal, denktijd_s);
        let mut spiegel = Game::new_star(aantal as usize).unwrap();
        let mut rng = Rng::new(5);
        let mut computerzetten = 0;
        for _ in 0..20_000 {
            if spiegel.is_over() {
                break;
            }
            if spiegel.current_player() == 0 {
                // Ann kiest met dezelfde regels, maar zet zelf via de server.
                let (van, naar) = choose_move(&spiegel, Level::Normal, &mut rng).expect("Ann kan zetten");
                o.doe_zet(ann, potje, van, naar).unwrap();
                spiegel.make_move(van, naar).unwrap();
            } else {
                let standen = tik(&mut o, &klok, COMPUTER_WACHT_MS + COMPUTER_SPREIDING_MS);
                assert_eq!(standen.len(), 1);
                let z = standen[0].laatste_zet.as_ref().unwrap();
                assert_eq!(z.soort, "zet", "een Computerspeler slaat nooit over");
                assert_eq!(z.plek as usize, spiegel.current_player() + 1);
                // Een geldige Zet voor de spiegel van de regels in halma-core.
                spiegel.make_move(z.van.unwrap() as usize, z.naar.unwrap() as usize).unwrap();
                computerzetten += 1;
            }
        }
        assert!(spiegel.is_over());
        let stand = o.stand(ann, potje).unwrap();
        assert!(stand.afgelopen && stand.winnaar.is_some());
        assert_eq!(o.volgende_deadline().unwrap(), None, "na het einde staat er niets meer klaar");
        (computerzetten, stand)
    }

    #[test]
    fn speler_en_computerspeler_spelen_een_potje_tot_het_einde() {
        let (zetten, stand) = speel_tot_het_einde(2, None);
        assert!(zetten > 10);
        assert!(stand.afgelopen);
    }

    #[test]
    fn potje_met_denktijd_en_computerspeler_speelt_ook_tot_het_einde() {
        let (zetten, _) = speel_tot_het_einde(2, Some(120));
        assert!(zetten > 10);
    }

    #[test]
    fn vijf_computerspelers_zetten_om_de_beurt_met_een_speler() {
        let (mut o, klok) = met_klok();
        let (ann, potje, _) = computer_potje(&mut o, 6, Some(60));
        let mut spiegel = Game::new_star(6).unwrap();
        zet_voor(&mut o, &mut spiegel, ann, potje);
        // Vijf Computerspelers na elkaar, elk met een eigen wachttijd; nooit twee in een ronde.
        for verwacht in 2..=6 {
            let standen = tik(&mut o, &klok, COMPUTER_WACHT_MS + COMPUTER_SPREIDING_MS);
            assert_eq!(standen.len(), 1);
            let z = standen[0].laatste_zet.as_ref().unwrap();
            assert_eq!((z.plek, z.soort), (verwacht, "zet"));
            spiegel.make_move(z.van.unwrap() as usize, z.naar.unwrap() as usize).unwrap();
        }
        assert_eq!(o.stand(ann, potje).unwrap().aan_de_beurt, Some(1));
    }

    #[test]
    fn wie_het_potje_verlaat_terwijl_alleen_een_computerspeler_wacht_laat_geen_potje_achter() {
        let (mut o, _) = met_klok();
        let ann = o.maak_speler("Ann").unwrap().speler_id;
        let bob = o.maak_speler("Bob").unwrap().speler_id;
        let potje = o.maak_potje(ann, "ster", 3, None).unwrap();
        o.voeg_computerspeler_toe(potje.potje_id).unwrap();
        o.verwijder_speler(ann).unwrap();
        assert_eq!(o.potje_bij_uitnodiging(&potje.uitnodiging).unwrap_err(), Fout::Onbekend("Unknown invite"));
        // Een gewone Speler kan nog wel een eigen Potje maken.
        assert!(o.maak_potje(bob, "ster", 2, None).is_ok());
    }

    // ---- Snel potje (taak 97) ----

    #[test]
    fn twee_wachtende_spelers_worden_gekoppeld() {
        let (mut o, _) = met_klok();
        let ann = o.maak_speler("Ann").unwrap().speler_id;
        let bob = o.maak_speler("Bob").unwrap().speler_id;
        let wacht = o.zoek_snel_potje(ann).unwrap();
        assert!(wacht.snel && !wacht.gestart && wacht.zoek_tot_ms.is_some());
        assert_eq!((wacht.bord.as_str(), wacht.aantal_spelers, wacht.denktijd_s), ("ster", 2, Some(30)));
        let stand = o.zoek_snel_potje(bob).unwrap();
        assert_eq!(stand.potje_id, wacht.potje_id, "wie het eerst wacht");
        assert!(stand.gestart && stand.zoek_tot_ms.is_none());
        assert_eq!(stand.spelers.iter().map(|s| s.speler.speler_id).collect::<Vec<_>>(), vec![ann, bob]);
        assert!(stand.spelers.iter().all(|s| s.speler.computer.is_none()));
        assert!(stand.deadline_ms.is_some(), "de Denktijd loopt");
        // Een derde Speler wacht in een nieuw Potje.
        let cas = o.maak_speler("Cas").unwrap().speler_id;
        assert_ne!(o.zoek_snel_potje(cas).unwrap().potje_id, wacht.potje_id);
    }

    #[test]
    fn zoeken_twee_keer_geeft_hetzelfde_potje_en_koppelt_je_niet_aan_jezelf() {
        let (mut o, _) = met_klok();
        let ann = o.maak_speler("Ann").unwrap().speler_id;
        let eerste = o.zoek_snel_potje(ann).unwrap();
        let tweede = o.zoek_snel_potje(ann).unwrap();
        assert_eq!(eerste.potje_id, tweede.potje_id);
        assert!(!tweede.gestart);
        assert_eq!(tweede.spelers.len(), 1);
    }

    #[test]
    fn een_wachtende_speler_krijgt_na_20_seconden_een_computerspeler() {
        let (mut o, klok) = met_klok();
        let ann = o.maak_speler("Ann").unwrap().speler_id;
        let wacht = o.zoek_snel_potje(ann).unwrap();
        let nu = klok.0.load(std::sync::atomic::Ordering::SeqCst);
        assert_eq!(wacht.zoek_tot_ms, Some(nu + 20_000));
        assert_eq!(o.volgende_deadline().unwrap(), Some(nu + 20_000), "het alarm staat op het einde van de zoektijd");
        assert!(tik(&mut o, &klok, 19_999).is_empty(), "nog niet");
        let standen = tik(&mut o, &klok, 1);
        let [stand] = &standen[..] else { panic!("verwacht één stand: {standen:?}") };
        assert!(stand.gestart && stand.zoek_tot_ms.is_none());
        assert_eq!(stand.potje_id, wacht.potje_id);
        assert_eq!(stand.spelers.len(), 2);
        assert!(stand.spelers[1].speler.computer.is_some());
        let json = serde_json::to_string(stand).unwrap().to_lowercase();
        assert!(!json.contains("computer"), "de Speler ziet niet dat het een Computerspeler is: {json}");
        assert_eq!(stand.aan_de_beurt, Some(1));
        assert!(stand.deadline_ms.is_some());
        // De Denktijd (en later de Computerspeler) bepaalt het volgende alarm; de zoektijd telt niet meer mee.
        assert!(o.volgende_deadline().unwrap().is_some_and(|d| d > klok.0.load(std::sync::atomic::Ordering::SeqCst)));
        // Daarna komt hij niet nog eens.
        assert!(tik(&mut o, &klok, 1_000).is_empty());
    }

    #[test]
    fn stoppen_haalt_je_uit_de_wachtrij() {
        let (mut o, _) = met_klok();
        let ann = o.maak_speler("Ann").unwrap().speler_id;
        let bob = o.maak_speler("Bob").unwrap().speler_id;
        let wacht = o.zoek_snel_potje(ann).unwrap();
        assert_eq!(o.stop_zoeken(bob, wacht.potje_id).unwrap_err(), Fout::Verboden("You are not in this game"));
        o.stop_zoeken(ann, wacht.potje_id).unwrap();
        assert_eq!(o.stand(ann, wacht.potje_id).unwrap_err(), Fout::Onbekend("Unknown game"));
        assert_eq!(o.volgende_deadline().unwrap(), None);
        assert!(o.mijn_potjes(ann).unwrap().is_empty());
        // Bob wordt niet meer aan Ann gekoppeld, maar wacht zelf.
        let b = o.zoek_snel_potje(bob).unwrap();
        assert!(!b.gestart && b.spelers.len() == 1);
        // Na het begin van het Potje kan stoppen niet meer.
        let a = o.zoek_snel_potje(ann).unwrap();
        assert!(a.gestart);
        assert_eq!(o.stop_zoeken(ann, a.potje_id).unwrap_err(), Fout::Conflict("The game has already started"));
    }

    #[test]
    fn stoppen_werkt_alleen_voor_een_snel_potje() {
        let (mut o, _) = met_klok();
        let ann = o.maak_speler("Ann").unwrap().speler_id;
        let potje = o.maak_potje(ann, "ster", 2, None).unwrap();
        assert!(matches!(o.stop_zoeken(ann, potje.potje_id), Err(Fout::Conflict(_))));
        assert!(o.stand(ann, potje.potje_id).is_ok());
    }

    #[test]
    fn de_denktijd_van_een_snel_potje_is_30_seconden() {
        let (mut o, klok) = met_klok();
        let ann = o.maak_speler("Ann").unwrap().speler_id;
        let bob = o.maak_speler("Bob").unwrap().speler_id;
        o.zoek_snel_potje(ann).unwrap();
        let stand = o.zoek_snel_potje(bob).unwrap();
        let start = klok.0.load(std::sync::atomic::Ordering::SeqCst);
        assert_eq!(stand.denktijd_s, Some(30));
        assert_eq!(stand.deadline_ms, Some(start + 30_000));
        assert_eq!(SNEL_DENKTIJD_S, 30);
    }

    // ---- Snel potje met 4 Spelers (taak 99) ----

    #[test]
    fn een_zoekopdracht_voor_meer_spelers_wordt_na_20_seconden_aangevuld_met_computerspelers() {
        let (mut o, klok) = met_klok();
        let ann = o.maak_speler("Ann").unwrap().speler_id;
        let wacht = o.zoek_snel_potje_met(ann, SNEL_MEER_AANTAL).unwrap();
        assert!(wacht.snel && !wacht.gestart);
        assert_eq!((wacht.bord.as_str(), wacht.aantal_spelers, wacht.denktijd_s), ("ster", 4, Some(30)));
        assert!(tik(&mut o, &klok, 19_999).is_empty(), "nog niet");
        let standen = tik(&mut o, &klok, 1);
        let [stand] = &standen[..] else { panic!("verwacht één stand: {standen:?}") };
        assert!(stand.gestart && stand.zoek_tot_ms.is_none());
        assert_eq!(stand.spelers.len(), 4, "alle lege plekken tegelijk");
        assert_eq!(stand.spelers.iter().filter(|s| s.speler.computer.is_some()).count(), 3);
        let namen: std::collections::HashSet<_> = stand.spelers.iter().map(|s| s.speler.spelersnaam.clone()).collect();
        assert_eq!(namen.len(), 4, "elke naam één keer");
        assert!(stand.spelers.iter().all(|s| s.speler.computer.is_none_or(|n| n <= COMPUTER_MAX_NIVEAU_MEER)));
        let json = serde_json::to_string(stand).unwrap().to_lowercase();
        assert!(!json.contains("computer"), "niets verraadt een Computerspeler: {json}");
        assert!(stand.deadline_ms.is_some());
        assert!(tik(&mut o, &klok, 1_000).is_empty(), "daarna niet nog eens");
    }

    #[test]
    fn met_genoeg_wachtende_spelers_begint_een_potje_voor_meer_spelers_zonder_computerspelers() {
        let (mut o, klok) = met_klok();
        let ids: Vec<i64> = ["Ann", "Bob", "Cas", "Dan"].iter().map(|n| o.maak_speler(n).unwrap().speler_id).collect();
        let eerste = o.zoek_snel_potje_met(ids[0], SNEL_MEER_AANTAL).unwrap();
        for &id in &ids[1..3] {
            let s = o.zoek_snel_potje_met(id, SNEL_MEER_AANTAL).unwrap();
            assert_eq!(s.potje_id, eerste.potje_id);
            assert!(!s.gestart);
        }
        let stand = o.zoek_snel_potje_met(ids[3], SNEL_MEER_AANTAL).unwrap();
        assert!(stand.gestart && stand.zoek_tot_ms.is_none());
        assert_eq!(stand.spelers.iter().map(|s| s.speler.speler_id).collect::<Vec<_>>(), ids);
        assert!(stand.spelers.iter().all(|s| s.speler.computer.is_none()));
        assert!(tik(&mut o, &klok, 25_000).iter().all(|s| s.spelers.iter().filter(|x| x.speler.computer.is_some()).count() == 0));
    }

    #[test]
    fn een_zoekopdracht_voor_2_spelers_en_voor_meer_spelers_worden_niet_gekoppeld() {
        let (mut o, _) = met_klok();
        let ann = o.maak_speler("Ann").unwrap().speler_id;
        let bob = o.maak_speler("Bob").unwrap().speler_id;
        let cas = o.maak_speler("Cas").unwrap().speler_id;
        let meer = o.zoek_snel_potje_met(ann, SNEL_MEER_AANTAL).unwrap();
        let twee = o.zoek_snel_potje(bob).unwrap();
        assert_ne!(twee.potje_id, meer.potje_id);
        assert_eq!((twee.aantal_spelers, twee.spelers.len()), (2, 1));
        // Andersom ook: wie meer Spelers zoekt, schuift niet in het Potje voor 2.
        let meer2 = o.zoek_snel_potje_met(cas, SNEL_MEER_AANTAL).unwrap();
        assert_eq!(meer2.potje_id, meer.potje_id);
        assert_eq!(meer2.spelers.len(), 2);
        assert!(matches!(o.zoek_snel_potje_met(cas, 3), Err(Fout::Ongeldig(_))));
    }

    #[test]
    fn een_snel_potje_heeft_geen_uitnodiging() {
        let (mut o, _) = met_klok();
        let ann = o.maak_speler("Ann").unwrap().speler_id;
        let bob = o.maak_speler("Bob").unwrap().speler_id;
        let cas = o.maak_speler("Cas").unwrap().speler_id;
        let wacht = o.zoek_snel_potje(ann).unwrap();
        assert_eq!(wacht.uitnodiging, "");
        let code: String = o.db.rij("SELECT uitnodiging FROM potje WHERE id = ?1", p![wacht.potje_id]).unwrap().unwrap().tekst(0).unwrap();
        assert_eq!(o.potje_bij_uitnodiging(&code).unwrap_err(), Fout::Onbekend("Unknown invite"));
        assert_eq!(o.doe_mee(bob, &code).unwrap_err(), Fout::Onbekend("Unknown invite"));
        o.zoek_snel_potje(bob).unwrap();
        // Een wachtend Snel potje staat niet in Mijn potjes; een begonnen wel, als Snel potje.
        let lijst = o.mijn_potjes(ann).unwrap();
        assert_eq!(lijst.len(), 1);
        assert!(lijst[0].snel);
        assert!(o.mijn_potjes(cas).unwrap().is_empty());
    }

    #[test]
    fn in_een_snel_potje_mag_alleen_een_vaste_zin() {
        let (mut o, _) = met_klok();
        let ann = o.maak_speler("Ann").unwrap().speler_id;
        let bob = o.maak_speler("Bob").unwrap().speler_id;
        let wacht = o.zoek_snel_potje(ann).unwrap();
        o.zoek_snel_potje(bob).unwrap();
        let id = wacht.potje_id;
        // Vrije tekst wordt geweigerd, ook als hij er bijna op lijkt of lang is.
        for tekst in ["hi", "Good game, add me on Snapchat", "good game", "", &"x".repeat(400)] {
            assert_eq!(o.stuur_bericht(ann, id, tekst).unwrap_err(), Fout::Ongeldig("Pick a quick message from the list"), "{tekst}");
        }
        // Een Vaste zin gaat door (ook met spaties eromheen) en staat in de lijst van de ander.
        for zin in VASTE_ZINNEN {
            assert_eq!(o.stuur_bericht(ann, id, zin).unwrap().tekst, zin);
        }
        assert_eq!(o.stuur_bericht(bob, id, " Good luck ").unwrap().tekst, "Good luck");
        assert_eq!(o.berichten(bob, id).unwrap().len(), VASTE_ZINNEN.len() + 1);
        // Een Speler die buiten het Potje staat, mag niets sturen.
        let cas = o.maak_speler("Cas").unwrap().speler_id;
        assert!(o.stuur_bericht(cas, id, "Hi!").is_err());
        // De zinnen zelf zijn kort en vriendelijk.
        assert!(VASTE_ZINNEN.iter().all(|z| z.chars().count() <= MAX_BERICHT && !woordfilter::is_grof(z)));
    }

    #[test]
    fn potjes_met_vrienden_blijven_zoals_ze_waren() {
        let (mut o, _) = met_klok();
        let ann = o.maak_speler("Ann").unwrap().speler_id;
        let bob = o.maak_speler("Bob").unwrap().speler_id;
        let potje = o.maak_potje(ann, "ster", 2, Some(60)).unwrap();
        assert!(!potje.snel && !potje.uitnodiging.is_empty());
        // Een wachtend Potje met een Uitnodiging is geen Snel potje: Play online koppelt er niet aan.
        let snel = o.zoek_snel_potje(bob).unwrap();
        assert_ne!(snel.potje_id, potje.potje_id);
        assert_eq!(o.doe_mee(bob, &potje.uitnodiging).unwrap().spelers.len(), 2);
        let stand = o.stand(ann, potje.potje_id).unwrap();
        assert!(!stand.snel && stand.zoek_tot_ms.is_none());
        assert!(o.stuur_bericht(ann, potje.potje_id, "hi").is_ok());
        assert!(o.stuur_bericht(ann, potje.potje_id, "Any free text works here").is_ok());
    }

    #[test]
    fn snel_potjes_tellen_niet_mee_voor_het_maximum_aan_open_potjes_met_denktijd() {
        let (mut o, _) = met_klok();
        let ann = o.maak_speler("Ann").unwrap().speler_id;
        let bob = o.maak_speler("Bob").unwrap().speler_id;
        for _ in 0..12 {
            o.zoek_snel_potje(ann).unwrap();
            let s = o.zoek_snel_potje(bob).unwrap();
            assert!(s.gestart);
        }
        assert!(o.maak_potje(bob, "ster", 2, Some(30)).is_ok());
    }

    #[test]
    fn geblokkeerde_spelers_worden_niet_aan_elkaar_gekoppeld() {
        let (mut o, _) = met_klok();
        let ann = o.maak_speler("Ann").unwrap().speler_id;
        let bob = o.maak_speler("Bob").unwrap().speler_id;
        samen_in_een_potje(&mut o, bob, ann);
        o.blokkeer(bob, ann).unwrap();
        let wacht = o.zoek_snel_potje(ann).unwrap();
        let b = o.zoek_snel_potje(bob).unwrap();
        assert_ne!(b.potje_id, wacht.potje_id);
    }

    // ---- Statistieken (taak 154) ----

    /// Een Potje met vrienden voor `ids` (de eerste maakt het), gestart.
    fn vrienden_potje(o: &mut TestOpslag, ids: &[i64]) -> i64 {
        let potje = o.maak_potje(ids[0], "ster", ids.len() as u32, None).unwrap();
        for &id in &ids[1..] {
            o.doe_mee(id, &potje.uitnodiging).unwrap();
        }
        potje.potje_id
    }

    /// Speelt een Potje voor twee Spelers uit met de Computerspeler-regels van halma-core. Geeft per Speler het
    /// aantal Zetten en de meeste Sprongen in één Zet, uit een eigen spiegel van het Potje.
    fn speel_uit(o: &mut TestOpslag, potje: i64, ids: [i64; 2], seed: u64) -> [(u32, u32); 2] {
        let mut spiegel = Game::new_star(2).unwrap();
        let mut rng = Rng::new(seed);
        let mut uit = [(0u32, 0u32); 2];
        for _ in 0..20_000 {
            if spiegel.is_over() {
                break;
            }
            let wie = spiegel.current_player();
            let (van, naar) = choose_move(&spiegel, Level::Normal, &mut rng).unwrap();
            uit[wie].0 += 1;
            uit[wie].1 = uit[wie].1.max(sprongen_in(&spiegel, van, naar));
            o.doe_zet(ids[wie], potje, van, naar).unwrap();
            spiegel.make_move(van, naar).unwrap();
        }
        assert!(spiegel.is_over());
        uit
    }

    #[test]
    fn statistieken_tellen_gewonnen_verloren_opgegeven_en_lopend() {
        let (mut o, _) = met_klok();
        let ann = o.maak_speler("Ann").unwrap().speler_id;
        let bob = o.maak_speler("Bob").unwrap().speler_id;
        let nieuw = o.statistieken(ann).unwrap();
        assert_eq!((nieuw.gespeeld, nieuw.deel_gewonnen, nieuw.gemiddelde_plek), (0, None, None));
        assert!(nieuw.rating_verloop.is_empty() && nieuw.langste_sprong.is_none() && nieuw.snelste_overwinning.is_none());
        // Bob geeft op: Ann wint. Ann geeft op: Ann verliest. Een lopend Potje telt niet.
        let p1 = vrienden_potje(&mut o, &[ann, bob]);
        o.geef_op(bob, p1).unwrap();
        let p2 = vrienden_potje(&mut o, &[ann, bob]);
        o.geef_op(ann, p2).unwrap();
        let lopend = vrienden_potje(&mut o, &[ann, bob]);
        let g = Game::new_star(2).unwrap();
        let (van, naar) = g.start_cells(0).iter().find_map(|&v| g.destinations(v).first().map(|&n| (v, n))).unwrap();
        o.doe_zet(ann, lopend, van, naar).unwrap();
        // Een Wachtkamer waar nog niemand bij is geweest telt ook niet.
        o.maak_potje(ann, "vierkant", 2, None).unwrap();
        let s = o.statistieken(ann).unwrap();
        assert_eq!((s.gespeeld, s.gewonnen, s.verloren), (2, 1, 1));
        assert_eq!((s.deel_gewonnen, s.gemiddelde_plek), (Some(0.5), Some(1.5)));
        // Bob heeft het spiegelbeeld.
        let b = o.statistieken(bob).unwrap();
        assert_eq!((b.gespeeld, b.gewonnen, b.verloren), (2, 1, 1));
        // Opgeven is geen Zet: geen Records.
        assert!(s.langste_sprong.is_none() && s.snelste_overwinning.is_none());
    }

    #[test]
    fn gemiddelde_plek_bij_meer_spelers() {
        let (mut o, _) = met_klok();
        let ann = o.maak_speler("Ann").unwrap().speler_id;
        let bob = o.maak_speler("Bob").unwrap().speler_id;
        let cas = o.maak_speler("Cas").unwrap().speler_id;
        // Ann en Bob geven op: Cas wint, de twee anderen krijgen de laatste plek (3).
        let p1 = vrienden_potje(&mut o, &[ann, bob, cas]);
        o.geef_op(ann, p1).unwrap();
        o.geef_op(bob, p1).unwrap();
        // Bob en Cas geven op: Ann wint.
        let p2 = vrienden_potje(&mut o, &[ann, bob, cas]);
        o.geef_op(bob, p2).unwrap();
        o.geef_op(cas, p2).unwrap();
        let s = o.statistieken(ann).unwrap();
        assert_eq!((s.gespeeld, s.gewonnen, s.verloren), (2, 1, 1));
        assert_eq!(s.gemiddelde_plek, Some(2.0), "plek 3 en plek 1");
        let c = o.statistieken(cas).unwrap();
        assert_eq!((c.gewonnen, c.verloren, c.gemiddelde_plek), (1, 1, Some(2.0)));
        // Bob gaf twee keer op: twee keer de laatste plek, ook als de ander later opgaf.
        let b = o.statistieken(bob).unwrap();
        assert_eq!((b.gewonnen, b.verloren, b.gemiddelde_plek), (0, 2, Some(3.0)));
    }

    #[test]
    fn records_horen_bij_het_juiste_potje_met_de_namen_van_de_tegenstanders() {
        let (mut o, _) = met_klok();
        let ann = o.maak_speler("Ann").unwrap().speler_id;
        let bob = o.maak_speler("Bob").unwrap().speler_id;
        let cas = o.maak_speler("Cas").unwrap().speler_id;
        let p1 = vrienden_potje(&mut o, &[ann, bob]);
        let u1 = speel_uit(&mut o, p1, [ann, bob], 11);
        let p2 = vrienden_potje(&mut o, &[cas, ann]);
        let u2 = speel_uit(&mut o, p2, [cas, ann], 29);
        // Ann is in p1 speler 1 en in p2 speler 2.
        let s = o.statistieken(ann).unwrap();
        assert_eq!(s.gespeeld, 2);
        let (sprong1, sprong2) = (u1[0].1, u2[1].1);
        assert!(sprong1.max(sprong2) > 1, "met deze zaden springt iemand over meer dan één steen");
        let l = s.langste_sprong.expect("er is gesprongen");
        assert_eq!(l.waarde, sprong1.max(sprong2));
        if sprong1 >= sprong2 {
            assert_eq!((l.potje_id, l.tegenstanders), (p1, vec!["Bob".to_string()]));
        } else {
            assert_eq!((l.potje_id, l.tegenstanders), (p2, vec!["Cas".to_string()]));
        }
        // De snelste overwinning is de winst met het minste eigen Zetten; een verloren Potje telt niet.
        let w1 = o.stand(ann, p1).unwrap().winnaar == Some(1);
        let w2 = o.stand(ann, p2).unwrap().winnaar == Some(2);
        assert_eq!(s.gewonnen, u32::from(w1) + u32::from(w2));
        let verwacht = [(w1, u1[0].0, p1, "Bob"), (w2, u2[1].0, p2, "Cas")]
            .into_iter()
            .filter(|x| x.0)
            .min_by_key(|x| x.1)
            .map(|x| (x.2, x.1, vec![x.3.to_string()]));
        assert_eq!(s.snelste_overwinning.map(|r| (r.potje_id, r.waarde, r.tegenstanders)), verwacht);
        // Bob won of verloor p1 en heeft p2 niet gespeeld: zijn Records horen bij p1.
        let b = o.statistieken(bob).unwrap();
        assert_eq!(b.gespeeld, 1);
        assert!(b.langste_sprong.is_none_or(|r| r.potje_id == p1 && r.tegenstanders == vec!["Ann".to_string()]));
    }

    #[test]
    fn een_sprongketen_telt_alle_sprongen_en_een_stap_geen() {
        let board = halma_core::Board::square();
        // Zoek een vak met een rechte lijn van vier vakken in één richting: start, steen, leeg, steen, leeg.
        let (start, dir) = (0..board.len())
            .flat_map(|c| (0..board.directions()).map(move |d| (c, d)))
            .find(|&(c, d)| {
                let mut at = c;
                (0..4).all(|_| board.neighbor(at, d).map(|n| at = n).is_some())
            })
            .unwrap();
        let rij: Vec<usize> = std::iter::successors(Some(start), |&c| board.neighbor(c, dir)).take(5).collect();
        let mut stenen = vec![None; board.len()];
        stenen[rij[0]] = Some(0);
        stenen[rij[1]] = Some(1);
        stenen[rij[3]] = Some(1);
        let g = Game::from_position(board, 2, stenen, 0).unwrap();
        assert_eq!(sprongen_in(&g, rij[0], rij[2]), 1);
        assert_eq!(sprongen_in(&g, rij[0], rij[4]), 2);
        assert_eq!(sprongen_in(&g, rij[0], g.step_destinations(rij[0])[0]), 0, "een stap is geen Sprong");
    }

    #[test]
    fn een_andere_speler_krijgt_deze_cijfers_niet() {
        let (mut o, _) = met_klok();
        let ann = o.maak_speler("Ann").unwrap().speler_id;
        let bob = o.maak_speler("Bob").unwrap().speler_id;
        let dan = o.maak_speler("Dan").unwrap().speler_id;
        let p = vrienden_potje(&mut o, &[ann, bob]);
        speel_uit(&mut o, p, [ann, bob], 11);
        assert_eq!(o.statistieken(ann).unwrap().gespeeld, 1);
        let d = o.statistieken(dan).unwrap();
        assert_eq!((d.gespeeld, d.gewonnen, d.verloren), (0, 0, 0));
        assert!(d.langste_sprong.is_none() && d.snelste_overwinning.is_none() && d.rating_verloop.is_empty());
        let json = serde_json::to_string(&d).unwrap();
        assert!(!json.contains("Ann") && !json.contains("Bob"), "{json}");
    }

    #[test]
    fn een_computerspeler_is_in_de_statistieken_niet_te_herkennen() {
        let (mut o, _) = met_klok();
        let (ann, potje, stand) = computer_potje(&mut o, 2, None);
        assert!(stand.spelers[1].speler.computer.is_some());
        // Ann geeft op: het Potje met de Computerspeler is een gewoon afgelopen Potje.
        o.geef_op(ann, potje).unwrap();
        let s = o.statistieken(ann).unwrap();
        assert_eq!((s.gespeeld, s.verloren), (1, 1));
        let json = serde_json::to_string(&s).unwrap().to_lowercase();
        assert!(!json.contains("computer"), "{json}");
        // Met Records erin: de tegenstander is alleen een Spelersnaam.
        let (mut o, klok) = met_klok();
        let (ann, potje, stand) = computer_potje(&mut o, 2, None);
        let naam = stand.spelers[1].speler.spelersnaam.clone();
        let mut spiegel = Game::new_star(2).unwrap();
        let mut rng = Rng::new(3);
        for _ in 0..40 {
            if spiegel.current_player() == 0 {
                let (van, naar) = choose_move(&spiegel, Level::Normal, &mut rng).unwrap();
                o.doe_zet(ann, potje, van, naar).unwrap();
                spiegel.make_move(van, naar).unwrap();
            } else {
                let z = tik(&mut o, &klok, COMPUTER_WACHT_MS + COMPUTER_SPREIDING_MS);
                let z = z[0].laatste_zet.as_ref().unwrap();
                spiegel.make_move(z.van.unwrap() as usize, z.naar.unwrap() as usize).unwrap();
            }
        }
        o.geef_op(ann, potje).unwrap();
        let s = o.statistieken(ann).unwrap();
        let l = s.langste_sprong.clone().expect("Ann sprong");
        assert_eq!((l.potje_id, l.tegenstanders), (potje, vec![naam]));
        let json = serde_json::to_string(&s).unwrap().to_lowercase();
        assert!(!json.contains("computer"), "{json}");
    }

    #[test]
    fn de_ratinglijn_toont_de_laatste_50_snel_potjes_met_het_oudste_eerst() {
        let (mut o, klok) = met_klok();
        let ann = o.maak_speler("Ann").unwrap().speler_id;
        let bob = o.maak_speler("Bob").unwrap().speler_id;
        let mut verwacht = Vec::new();
        for i in 0..52 {
            let potje = snel_paar(&mut o, ann, bob);
            klok.0.fetch_add(1000, std::sync::atomic::Ordering::SeqCst);
            // Om en om wint Ann of Bob.
            o.geef_op(if i % 2 == 0 { bob } else { ann }, potje).unwrap();
            verwacht.push(rating(&o, ann));
        }
        let s = o.statistieken(ann).unwrap();
        assert_eq!(s.gespeeld, 52);
        assert_eq!(s.rating_verloop, verwacht[2..].to_vec());
        // Een Potje met vrienden voegt geen punt toe.
        let p = vrienden_potje(&mut o, &[ann, bob]);
        o.geef_op(bob, p).unwrap();
        assert_eq!(o.statistieken(ann).unwrap().rating_verloop.len(), 50);
    }

    // ---- Rating (taak 98) ----

    fn rating(o: &TestOpslag, speler_id: i64) -> i64 {
        tel(o, "SELECT rating FROM speler WHERE id = ?1", p![speler_id])
    }

    fn zet_rating(o: &TestOpslag, speler_id: i64, rating: i64) {
        o.db.voer_uit("UPDATE speler SET rating = ?2 WHERE id = ?1", p![speler_id, rating]).unwrap();
    }

    /// Twee Spelers in een gestart Snel potje.
    fn snel_paar(o: &mut TestOpslag, a: i64, b: i64) -> i64 {
        o.zoek_snel_potje(a).unwrap();
        let stand = o.zoek_snel_potje(b).unwrap();
        assert!(stand.gestart);
        stand.potje_id
    }

    #[test]
    fn rating_stijgt_bij_winst_en_daalt_bij_verlies_in_een_snel_potje() {
        let (mut o, _) = met_klok();
        let ann = o.maak_speler("Ann").unwrap().speler_id;
        let bob = o.maak_speler("Bob").unwrap().speler_id;
        assert_eq!((rating(&o, ann), rating(&o, bob)), (1000, 1000));
        let potje = snel_paar(&mut o, ann, bob);
        let lopend = o.stand(ann, potje).unwrap();
        assert_eq!(lopend.spelers.iter().map(|s| s.speler.rating).collect::<Vec<_>>(), vec![Some(1000), Some(1000)]);
        assert!(lopend.spelers.iter().all(|s| s.rating_verandering.is_none()));
        let stand = o.geef_op(bob, potje).unwrap();
        assert!(stand.afgelopen && stand.winnaar == Some(1));
        assert_eq!((rating(&o, ann), rating(&o, bob)), (1016, 984));
        let v: Vec<_> = stand.spelers.iter().map(|s| s.rating_verandering).collect();
        assert_eq!(v, vec![Some(RatingVerandering { voor: 1000, na: 1016 }), Some(RatingVerandering { voor: 1000, na: 984 })]);
        // Het Potje telt één keer: dezelfde stand opnieuw lezen verandert niets.
        assert_eq!(o.stand(bob, potje).unwrap(), stand);
        assert_eq!((rating(&o, ann), rating(&o, bob)), (1016, 984));
        assert!(o.geef_op(ann, potje).is_err());
        assert_eq!(rating(&o, ann), 1016);
    }

    #[test]
    fn winst_op_een_sterkere_speler_levert_meer_op() {
        let (mut o, _) = met_klok();
        let sterk = o.maak_speler("Sterk").unwrap().speler_id;
        let zwak = o.maak_speler("Zwak").unwrap().speler_id;
        zet_rating(&o, sterk, 1200);
        let potje = snel_paar(&mut o, sterk, zwak);
        o.geef_op(sterk, potje).unwrap();
        let winst_zwak = rating(&o, zwak) - 1000;
        assert!(winst_zwak > 16, "winst op een sterkere Speler: {winst_zwak}");
        assert_eq!(1200 - rating(&o, sterk), winst_zwak, "de som blijft gelijk");
        // En andersom levert winst op een zwakkere minder op.
        let (mut o, _) = met_klok();
        let sterk = o.maak_speler("Sterk").unwrap().speler_id;
        let zwak = o.maak_speler("Zwak").unwrap().speler_id;
        zet_rating(&o, sterk, 1200);
        let potje = snel_paar(&mut o, sterk, zwak);
        o.geef_op(zwak, potje).unwrap();
        assert!(rating(&o, sterk) - 1200 < 16);
    }

    #[test]
    fn een_potje_met_vrienden_verandert_de_rating_niet() {
        let (mut o, _) = met_klok();
        let ann = o.maak_speler("Ann").unwrap().speler_id;
        let bob = o.maak_speler("Bob").unwrap().speler_id;
        let p = o.maak_potje(ann, "ster", 2, None).unwrap();
        o.doe_mee(bob, &p.uitnodiging).unwrap();
        let stand = o.geef_op(bob, p.potje_id).unwrap();
        assert!(stand.afgelopen);
        assert_eq!((rating(&o, ann), rating(&o, bob)), (1000, 1000));
        assert!(stand.spelers.iter().all(|s| s.rating_verandering.is_none() && s.speler.rating.is_none()));
        let json = serde_json::to_string(&stand).unwrap();
        assert!(!json.contains("rating"), "{json}");
        assert_eq!(tel(&o, "SELECT COUNT(*) FROM rating_wijziging", &[]), 0);
    }

    #[test]
    fn drie_gemiste_beurten_en_een_computerspeler_tellen_ook_mee() {
        let (mut o, klok) = met_klok();
        let ann = o.maak_speler("Ann").unwrap().speler_id;
        o.zoek_snel_potje(ann).unwrap();
        // Na 20 s komt een Computerspeler; Ann zet nooit en geeft na drie gemiste beurten op.
        let mut eind = None;
        tik(&mut o, &klok, 20_000);
        for _ in 0..200 {
            for s in tik(&mut o, &klok, 30_000) {
                if s.afgelopen {
                    eind = Some(s);
                }
            }
            if eind.is_some() {
                break;
            }
        }
        let eind = eind.expect("Ann geeft vanzelf op");
        assert_eq!(eind.winnaar, Some(2));
        let computer = eind.spelers[1].speler.speler_id;
        assert!(eind.spelers[1].speler.computer.is_some());
        assert_eq!(rating(&o, ann), 984);
        assert!(rating(&o, computer) > 1000, "de Computerspeler krijgt een eerlijke Rating mee");
        let json = serde_json::to_string(&eind).unwrap().to_lowercase();
        assert!(!json.contains("computer"), "{json}");
    }

    #[test]
    fn bij_meer_spelers_telt_de_eindvolgorde_en_opgeven_is_laatste() {
        // Gelijke Ratings: eerste +16, tweede 0, laatste -16 (K = 32 over twee paren).
        assert_eq!(nieuwe_ratings(&[1000, 1000, 1000], &[0, 1, 2]), vec![1016, 1000, 984]);
        // Twee die opgaven delen de laatste plaats: onderling gelijkspel.
        assert_eq!(nieuwe_ratings(&[1000, 1000, 1000], &[0, 2, 2]), vec![1016, 992, 992]);
        // Twee Spelers.
        assert_eq!(nieuwe_ratings(&[1000, 1000], &[1, 0]), vec![984, 1016]);
        assert_eq!(nieuwe_ratings(&[1000, 1000], &[0, 0]), vec![1000, 1000]);
        // De Rating zakt niet onder de ondergrens.
        assert_eq!(nieuwe_ratings(&[RATING_MIN, 1400], &[1, 0]), vec![RATING_MIN, 1400]);
    }

    #[test]
    fn koppelen_kiest_het_wachtende_potje_met_de_dichtstbijzijnde_rating() {
        let (mut o, _) = met_klok();
        let mut wachtend = Vec::new();
        for (naam, r) in [("Aad", 1000), ("Bas", 1300), ("Cor", 1100)] {
            let id = o.maak_speler(naam).unwrap().speler_id;
            zet_rating(&o, id, r);
            // Direct in de opslag gezet: via zoeken zouden de wachters elkaar al koppelen.
            o.db.voer_uit(
                "INSERT INTO potje (uitnodiging, bord, aantal_spelers, denktijd_s, snel, zoek_tot_ms) VALUES (?1, 'ster', 2, 30, 1, ?2)",
                p![format!("W{naam}"), o.nu_ms() + 20_000],
            )
            .unwrap();
            let potje_id = tel(&o, "SELECT id FROM potje WHERE uitnodiging = ?1", p![format!("W{naam}")]);
            o.db.voer_uit("INSERT INTO potje_speler (potje_id, plek, speler_id) VALUES (?1, 0, ?2)", p![potje_id, id]).unwrap();
            wachtend.push((id, potje_id));
        }
        let dan = o.maak_speler("Dan").unwrap().speler_id;
        zet_rating(&o, dan, 1120);
        let stand = o.zoek_snel_potje(dan).unwrap();
        assert_eq!(stand.potje_id, wachtend[2].1, "Cor (1100) ligt het dichtst bij 1120");
        let eef = o.maak_speler("Eef").unwrap().speler_id;
        zet_rating(&o, eef, 1250);
        assert_eq!(o.zoek_snel_potje(eef).unwrap().potje_id, wachtend[1].1, "Bas (1300) is nu het dichtst");
        // Gelijk verschil: het langst wachtende Potje.
        let fay = o.maak_speler("Fay").unwrap().speler_id;
        assert_eq!(o.zoek_snel_potje(fay).unwrap().potje_id, wachtend[0].1);
    }

    #[test]
    fn de_computerspeler_past_bij_de_rating_van_de_wachtende_speler() {
        let (mut o, klok) = met_klok();
        let computer_van = |o: &mut TestOpslag, klok: &Nepklok, speler: i64| -> (i64, u32) {
            o.zoek_snel_potje(speler).unwrap();
            let standen = tik(o, klok, 20_000);
            let c = &standen[0].spelers[1].speler;
            (c.speler_id, c.computer.unwrap())
        };
        let hoog = o.maak_speler("Hoog").unwrap().speler_id;
        let laag = o.maak_speler("Laag").unwrap().speler_id;
        let midden = o.maak_speler("Midden").unwrap().speler_id;
        let nog_een = o.maak_speler("NogEen").unwrap().speler_id;
        zet_rating(&o, hoog, 1400);
        zet_rating(&o, laag, 700);
        let (c_hoog, n_hoog) = computer_van(&mut o, &klok, hoog);
        let (c_laag, n_laag) = computer_van(&mut o, &klok, laag);
        let (c_midden, n_midden) = computer_van(&mut o, &klok, midden);
        assert_eq!((n_hoog, n_laag, n_midden), (2, 0, 1));
        assert_eq!((rating(&o, c_hoog), rating(&o, c_laag), rating(&o, c_midden)), (1200, 800, 1000));
        // Een volgende Speler van ongeveer 1000 krijgt de bestaande Computerspeler van 1000 weer.
        zet_rating(&o, nog_een, 1040);
        assert_eq!(computer_van(&mut o, &klok, nog_een).0, c_midden);
    }

    #[test]
    fn de_ranglijst_toont_de_rating_en_sorteert_erop() {
        let (mut o, _) = met_klok();
        let ann = o.maak_speler("Ann").unwrap().speler_id;
        let bob = o.maak_speler("Bob").unwrap().speler_id;
        let potje = snel_paar(&mut o, ann, bob);
        o.geef_op(ann, potje).unwrap();
        let lijst = o.ranglijst(ann).unwrap();
        assert_eq!(lijst.iter().map(|r| (r.spelersnaam.as_str(), r.rating)).collect::<Vec<_>>(), vec![("Bob", 1016), ("Ann", 984)]);
        assert_eq!(serde_json::to_value(&lijst[0]).unwrap()["rating"], 1016);
    }

    // ---- Prestaties (taak 172) ----

    fn zet_tijd(klok: &Nepklok, ms: i64) {
        klok.0.store(ms, std::sync::atomic::Ordering::SeqCst);
    }

    fn prestatie(o: &TestOpslag, speler: i64, id: &str) -> Option<i64> {
        let lijst = o.prestaties(speler).unwrap();
        assert_eq!(lijst.iter().map(|p| p.id).collect::<Vec<_>>(), PRESTATIES);
        lijst.iter().find(|p| p.id == id).unwrap().behaald_ms
    }

    /// Zoekt met vaste toeval Zetten (vanaf het begin van een Ster-Potje voor twee) tot één Zet minstens `min`
    /// Sprongen heeft. Geeft alle Zetten tot en met die Zet en wie hem deed.
    fn zetten_met_sprongen(min: u32) -> (Vec<(usize, usize)>, usize) {
        let mut x: u64 = 88172645463325252;
        let mut toeval = move || {
            x ^= x << 13;
            x ^= x >> 7;
            x ^= x << 17;
            x
        };
        for _ in 0..20_000 {
            let mut g = Game::new_star(2).unwrap();
            let mut gedaan = Vec::new();
            for _ in 0..200 {
                if g.is_over() {
                    break;
                }
                let wie = g.current_player();
                let mut mogelijk = Vec::new();
                for v in 0..g.board().len() {
                    if g.stone_at(v) == Some(wie) {
                        mogelijk.extend(g.destinations(v).into_iter().map(|d| (v, d)));
                    }
                }
                let (van, naar) = mogelijk[toeval() as usize % mogelijk.len()];
                let sprongen = sprongen_in(&g, van, naar);
                g.make_move(van, naar).unwrap();
                gedaan.push((van, naar));
                if sprongen >= min {
                    return (gedaan, wie);
                }
            }
        }
        panic!("geen Zet met {min} Sprongen gevonden");
    }

    #[test]
    fn eerste_overwinning_krijgt_de_datum_van_het_potje() {
        let (mut o, klok) = met_klok();
        let ann = o.maak_speler("Ann").unwrap().speler_id;
        let bob = o.maak_speler("Bob").unwrap().speler_id;
        assert!(o.prestaties(ann).unwrap().iter().all(|p| p.behaald_ms.is_none()));
        let p = vrienden_potje(&mut o, &[ann, bob]);
        zet_tijd(&klok, 1_800_000_000_000);
        o.geef_op(bob, p).unwrap();
        // Later gespeeld: de datum blijft die van het Potje.
        zet_tijd(&klok, 1_900_000_000_000);
        assert_eq!(prestatie(&o, ann, "first_win"), Some(1_800_000_000_000));
        assert_eq!(prestatie(&o, ann, "wins_10"), None);
        assert_eq!(prestatie(&o, ann, "square_win"), None);
        assert_eq!(prestatie(&o, ann, "puzzle_streak_7"), None);
        assert_eq!(prestatie(&o, ann, "five_friends"), None);
        // Bob verloor: niets.
        assert!(o.prestaties(bob).unwrap().iter().all(|p| p.behaald_ms.is_none()));
    }

    #[test]
    fn vijf_verschillende_vrienden_geven_de_datum_van_het_vijfde_potje() {
        let (mut o, klok) = met_klok();
        let ann = o.maak_speler("Ann").unwrap().speler_id;
        let vrienden: Vec<i64> = (0..5).map(|i| o.maak_speler(&format!("Vriend{i}")).unwrap().speler_id).collect();
        for (i, &v) in vrienden.iter().enumerate() {
            assert_eq!(prestatie(&o, ann, "five_friends"), None, "na {i} vrienden");
            zet_tijd(&klok, 1_700_000_000_000 + i as i64 * 1000);
            let p = vrienden_potje(&mut o, &[ann, v]);
            // Een Potje dat nog loopt telt niet; verliezen of Opgeven telt wel als gespeeld Potje.
            assert_eq!(prestatie(&o, ann, "five_friends"), None);
            o.geef_op(ann, p).unwrap();
        }
        assert_eq!(prestatie(&o, ann, "five_friends"), Some(1_700_000_004_000));
        // De vrienden zelf hebben maar één vriend.
        assert_eq!(prestatie(&o, vrienden[0], "five_friends"), None);
        // Later nog een Potje: de datum blijft.
        zet_tijd(&klok, 1_800_000_000_000);
        let p = vrienden_potje(&mut o, &[ann, vrienden[0]]);
        o.geef_op(ann, p).unwrap();
        assert_eq!(prestatie(&o, ann, "five_friends"), Some(1_700_000_004_000));
    }

    #[test]
    fn vijf_keer_dezelfde_vriend_geeft_geen_prestatie() {
        let (mut o, klok) = met_klok();
        let ann = o.maak_speler("Ann").unwrap().speler_id;
        let bob = o.maak_speler("Bob").unwrap().speler_id;
        let cas = o.maak_speler("Cas").unwrap().speler_id;
        for i in 0..5 {
            zet_tijd(&klok, 1_700_000_000_000 + i * 1000);
            let p = vrienden_potje(&mut o, &[ann, bob]);
            o.geef_op(ann, p).unwrap();
        }
        // Een Potje met meer vrienden tegelijk telt ze allemaal: met Cas, Dirk en Eva zijn dat samen met Bob vier.
        let d = o.maak_speler("Dirk").unwrap().speler_id;
        let e = o.maak_speler("Eva").unwrap().speler_id;
        zet_tijd(&klok, 1_710_000_000_000);
        let p = vrienden_potje(&mut o, &[ann, cas, d, e]);
        for id in [ann, cas, d] {
            o.geef_op(id, p).unwrap();
        }
        assert_eq!(prestatie(&o, ann, "five_friends"), None);
        // Een vijfde vriend geeft de Prestatie met de datum van dat Potje.
        let f = o.maak_speler("Fien").unwrap().speler_id;
        zet_tijd(&klok, 1_720_000_000_000);
        let p = vrienden_potje(&mut o, &[ann, f]);
        o.geef_op(ann, p).unwrap();
        assert_eq!(prestatie(&o, ann, "five_friends"), Some(1_720_000_000_000));
    }

    #[test]
    fn verlies_en_opgeven_leveren_niets_op() {
        let (mut o, _) = met_klok();
        let ann = o.maak_speler("Ann").unwrap().speler_id;
        let bob = o.maak_speler("Bob").unwrap().speler_id;
        let p = vrienden_potje(&mut o, &[ann, bob]);
        o.geef_op(ann, p).unwrap();
        assert!(o.prestaties(ann).unwrap().iter().all(|p| p.behaald_ms.is_none()));
        // Een lopend Potje zonder Sprongen ook niet.
        let lopend = vrienden_potje(&mut o, &[ann, bob]);
        let g = Game::new_star(2).unwrap();
        let (van, naar) = g.start_cells(0).iter().find_map(|&v| g.destinations(v).first().map(|&n| (v, n))).unwrap();
        o.doe_zet(ann, lopend, van, naar).unwrap();
        assert!(o.prestaties(ann).unwrap().iter().all(|p| p.behaald_ms.is_none()));
    }

    #[test]
    fn tien_overwinningen_geven_de_datum_van_het_tiende_potje() {
        let (mut o, klok) = met_klok();
        let ann = o.maak_speler("Ann").unwrap().speler_id;
        let bob = o.maak_speler("Bob").unwrap().speler_id;
        for i in 0..10 {
            let p = vrienden_potje(&mut o, &[ann, bob]);
            zet_tijd(&klok, 2_000_000_000_000 + i * 1000);
            o.geef_op(bob, p).unwrap();
            let verwacht = if i == 9 { Some(2_000_000_009_000) } else { None };
            assert_eq!(prestatie(&o, ann, "wins_10"), verwacht, "na {} overwinningen", i + 1);
        }
        assert_eq!(prestatie(&o, ann, "first_win"), Some(2_000_000_000_000));
        assert_eq!(prestatie(&o, ann, "wins_50"), None);
    }

    #[test]
    fn zes_en_tien_sprongen_tellen_ook_in_een_lopend_potje() {
        let (mut o, klok) = met_klok();
        let ann = o.maak_speler("Ann").unwrap().speler_id;
        let bob = o.maak_speler("Bob").unwrap().speler_id;
        for (min, id) in [(6, "jumps_6"), (10, "jumps_10")] {
            let (zetten, wie) = zetten_met_sprongen(min);
            let p = vrienden_potje(&mut o, &[ann, bob]);
            let ids = [ann, bob];
            let (laatste, eerdere) = zetten.split_last().unwrap();
            for (i, &(van, naar)) in eerdere.iter().enumerate() {
                zet_tijd(&klok, 1_700_100_000_000 + i as i64);
                o.doe_zet(ids[i % 2], p, van, naar).unwrap();
            }
            assert_eq!(prestatie(&o, ids[wie], id), None, "{id} nog niet");
            zet_tijd(&klok, 1_700_200_000_000);
            o.doe_zet(ids[wie], p, laatste.0, laatste.1).unwrap();
            assert_eq!(prestatie(&o, ids[wie], id), Some(1_700_200_000_000), "{id} in een lopend Potje");
            // De tegenstander krijgt de Prestatie niet.
            assert_eq!(prestatie(&o, ids[1 - wie], id), None);
            // Geen overwinning: geen Prestatie voor winst.
            assert_eq!(prestatie(&o, ids[wie], "first_win"), None);
            o.geef_op(ids[1 - wie], p).unwrap();
        }
    }

    #[test]
    fn winst_op_het_vierkant_bord_en_met_zes_spelers() {
        let (mut o, klok) = met_klok();
        let ids: Vec<i64> = ["Ann", "Bob", "Cas", "Dan", "Eva", "Fie"].iter().map(|n| o.maak_speler(n).unwrap().speler_id).collect();
        let (ann, bob) = (ids[0], ids[1]);
        // Een Ster-Potje voor twee wint niets bijzonders.
        let ster = vrienden_potje(&mut o, &[ann, bob]);
        o.geef_op(bob, ster).unwrap();
        assert_eq!((prestatie(&o, ann, "square_win"), prestatie(&o, ann, "six_players_win")), (None, None));
        // Vierkant bord: verlies telt niet, winst wel.
        let potje = o.maak_potje(ann, "vierkant", 2, None).unwrap();
        o.doe_mee(bob, &potje.uitnodiging).unwrap();
        o.geef_op(ann, potje.potje_id).unwrap();
        assert_eq!(prestatie(&o, ann, "square_win"), None);
        let potje = o.maak_potje(ann, "vierkant", 2, None).unwrap();
        o.doe_mee(bob, &potje.uitnodiging).unwrap();
        zet_tijd(&klok, 1_750_000_000_000);
        o.geef_op(bob, potje.potje_id).unwrap();
        assert_eq!(prestatie(&o, ann, "square_win"), Some(1_750_000_000_000));
        // Zes Spelers: vijf geven op, Ann wint.
        let zes = vrienden_potje(&mut o, &ids);
        zet_tijd(&klok, 1_760_000_000_000);
        for &id in &ids[1..] {
            o.geef_op(id, zes).unwrap();
        }
        assert_eq!(prestatie(&o, ann, "six_players_win"), Some(1_760_000_000_000));
        assert_eq!(prestatie(&o, bob, "six_players_win"), None);
    }

    // ---- Reeks van zeven (taak 175) ----

    #[test]
    fn datum_naar_dag_kent_echte_dagen() {
        assert_eq!(datum_naar_dag("1970-01-01"), Some(0));
        assert_eq!(datum_naar_dag("2023-11-14"), Some(19_675));
        assert_eq!(datum_naar_dag("2024-02-29"), Some(19_782));
        assert_eq!(datum_naar_dag("2023-02-29"), None);
        assert_eq!(datum_naar_dag("2023-13-01"), None);
        assert_eq!(datum_naar_dag("2023-1-01"), None);
        assert_eq!(datum_naar_dag("abcd-ef-gh"), None);
    }

    #[test]
    fn zeven_dagen_achter_elkaar_geeft_de_prestatie_met_de_datum_van_dag_zeven() {
        let (mut o, klok) = met_klok();
        zet_tijd(&klok, 1_705_000_000_000); // 2024-01-11
        let ann = o.maak_speler("Ann").unwrap().speler_id;
        let bob = o.maak_speler("Bob").unwrap().speler_id;
        let dagen = ["2024-01-05", "2024-01-06", "2024-01-07", "2024-01-08", "2024-01-09", "2024-01-10"];
        for d in dagen {
            o.bewaar_puzzeldag(ann, d).unwrap();
            assert_eq!(prestatie(&o, ann, "puzzle_streak_7"), None, "na {d}");
        }
        o.bewaar_puzzeldag(ann, "2024-01-11").unwrap();
        // Dag zeven is 2024-01-11, middag UTC.
        assert_eq!(prestatie(&o, ann, "puzzle_streak_7"), Some(datum_naar_dag("2024-01-11").unwrap() * 86_400_000 + 43_200_000));
        // Dezelfde datum nog eens, en een latere dag, veranderen de datum niet.
        o.bewaar_puzzeldag(ann, "2024-01-11").unwrap();
        o.bewaar_puzzeldag(ann, "2024-01-12").unwrap();
        assert_eq!(prestatie(&o, ann, "puzzle_streak_7"), Some(datum_naar_dag("2024-01-11").unwrap() * 86_400_000 + 43_200_000));
        // Een andere Speler heeft hem niet.
        assert_eq!(prestatie(&o, bob, "puzzle_streak_7"), None);
    }

    #[test]
    fn een_gat_in_de_reeks_geeft_geen_prestatie() {
        let (mut o, klok) = met_klok();
        zet_tijd(&klok, 1_706_000_000_000); // 2024-01-23
        let ann = o.maak_speler("Ann").unwrap().speler_id;
        // Zes dagen, een gat, dan weer zes dagen: nooit zeven achter elkaar.
        for d in ["2024-01-01", "2024-01-02", "2024-01-03", "2024-01-04", "2024-01-05", "2024-01-06", "2024-01-08", "2024-01-09", "2024-01-10", "2024-01-11", "2024-01-12", "2024-01-13"] {
            o.bewaar_puzzeldag(ann, d).unwrap();
        }
        assert_eq!(prestatie(&o, ann, "puzzle_streak_7"), None);
        // Het gat opvullen sluit de Reeks.
        o.bewaar_puzzeldag(ann, "2024-01-07").unwrap();
        assert!(prestatie(&o, ann, "puzzle_streak_7").is_some());
    }

    #[test]
    fn een_ongeldige_puzzeldag_wordt_geweigerd() {
        let (mut o, klok) = met_klok();
        zet_tijd(&klok, 1_705_000_000_000); // 2024-01-11
        let ann = o.maak_speler("Ann").unwrap().speler_id;
        for d in ["nu", "2024-02-30", "2019-12-31", "2024-01-13", "2024-1-5"] {
            assert!(matches!(o.bewaar_puzzeldag(ann, d), Err(Fout::Ongeldig(_))), "{d}");
        }
        // Morgen (een tijdzone vooruit) mag wel.
        o.bewaar_puzzeldag(ann, "2024-01-12").unwrap();
    }

    #[test]
    fn een_verwijderde_speler_houdt_geen_puzzeldagen() {
        let (mut o, klok) = met_klok();
        zet_tijd(&klok, 1_705_000_000_000);
        let ann = o.maak_speler("Ann").unwrap().speler_id;
        o.bewaar_puzzeldag(ann, "2024-01-10").unwrap();
        o.verwijder_speler(ann).unwrap();
        let n = o.db.rijen("SELECT datum FROM puzzeldag WHERE speler_id = ?1", p![ann]).unwrap().len();
        assert_eq!(n, 0);
    }

    // ---- Privacy- en rechtenlekken (taak 280) ----

    #[test]
    fn blokkeren_kan_alleen_een_speler_uit_een_gedeeld_potje() {
        let (mut o, ann, bob, _, _) = ann_en_bob();
        let vreemde = o.maak_speler("Vreemde").unwrap().speler_id;
        // Ann deelt geen Potje met de Vreemde: blokkeren geeft hetzelfde antwoord als een onbekende Speler,
        // en zijn Spelersnaam komt niet in Ann's blokkeerlijst.
        assert_eq!(o.blokkeer(ann, vreemde).unwrap_err(), Fout::Onbekend("Unknown player"));
        assert!(o.blokkades(ann).unwrap().iter().all(|g| g.speler_id != vreemde));
        // Een medespeler blokkeren gaat zoals altijd.
        o.blokkeer(ann, bob).unwrap();
        assert_eq!(o.blokkades(ann).unwrap(), vec![GeblokkeerdeSpeler { speler_id: bob, spelersnaam: "Bob".into() }]);
    }

    #[test]
    fn herstel_haalt_de_meldingsadressen_van_het_oude_toestel_weg() {
        let mut o = Opslag::in_geheugen().unwrap();
        let ann = o.maak_speler("Ann").unwrap();
        let abonnement = Abonnement {
            endpoint: "https://fcm.googleapis.com/oud".into(),
            keys: Sleutels {
                p256dh: "BCVxsr7N_eNgVRqvHtD0zTZsEc6-VV-JvLexhqUzORcxaOzi6-AYWXvTBHm4bjyPjs7Vd8pZGH6SRpkNtoIAiw4".into(),
                auth: "BTBZMqHH6r4Tts7J_aSIgg".into(),
            },
        };
        o.bewaar_abonnement(ann.speler_id, &abonnement).unwrap();
        o.bewaar_apns_token(ann.speler_id, &ApnsToken { token: "ab".repeat(32), omgeving: ApnsOmgeving::Production }).unwrap();
        let terug = o.herstel(&ann.herstelcode).unwrap();
        assert_eq!(terug.speler_id, ann.speler_id);
        assert!(o.abonnementen_van(ann.speler_id).unwrap().is_empty(), "het oude toestel krijgt geen Meldingen meer");
        assert!(o.apns_tokens_van(ann.speler_id).unwrap().is_empty());
    }

    #[test]
    fn een_groepsuitdaging_zet_spelers_die_elkaar_blokkeerden_niet_samen_in_een_potje() {
        let (mut o, _, ann, v) = ann_met_vrienden(2);
        let (bob, cas) = (v[0], v[1]);
        // Bob en Cas speelden ooit samen en Bob blokkeerde Cas.
        let p = o.maak_potje(bob, "ster", 2, None).unwrap();
        o.doe_mee(cas, &p.uitnodiging).unwrap();
        o.blokkeer(bob, cas).unwrap();
        let u = o.daag_vrienden_uit(ann, &[bob, cas], "ster", None).unwrap();
        assert_eq!(o.accepteer_uitdaging(bob, u.id).unwrap(), None);
        let rij_cas = u.id + 1;
        // Cas accepteert als laatste: er komt geen Potje met Bob en Cas samen. Cas valt af, Ann kiest.
        assert_eq!(o.accepteer_uitdaging(cas, rij_cas).unwrap(), None);
        let stand = o.uitdaging_stand(ann, u.id).unwrap();
        assert_eq!((stand.status, stand.geaccepteerd.clone(), stand.geweigerd), ("choice", vec!["Bob".to_string()], 1));
        let potje = o.start_uitdaging(ann, u.id, UitdagingKeuze::Computer).unwrap();
        let ids: Vec<i64> = potje.spelers.iter().map(|s| s.speler_id).collect();
        assert!(ids.contains(&ann) && ids.contains(&bob) && !ids.contains(&cas), "{ids:?}");
    }

    #[test]
    fn een_groepsuitdaging_neemt_een_later_geweerde_speler_niet_mee() {
        let (mut o, klok, ann, v) = ann_met_vrienden(3);
        let (bob, cas, dre) = (v[0], v[1], v[2]);
        let u = o.daag_vrienden_uit(ann, &[bob, cas, dre], "ster", None).unwrap();
        o.accepteer_uitdaging(bob, u.id).unwrap();
        o.accepteer_uitdaging(cas, u.id + 1).unwrap();
        // Cas krijgt na zijn Accept een weigering van de beheerder.
        let p = o.maak_potje(ann, "ster", 2, None).unwrap();
        o.doe_mee(cas, &p.uitnodiging).unwrap();
        o.rapporteer(ann, p.potje_id, NieuwRapport { bericht_id: None, speler_id: Some(cas) }).unwrap();
        let r = o.open_rapporten().unwrap()[0].id;
        o.weer_speler(r).unwrap();
        // Dre zegt nee; Ann begint met wie accepteerde. Cas doet niet mee.
        o.weiger_uitdaging(dre, u.id + 2).unwrap();
        klok.0.fetch_add(1, std::sync::atomic::Ordering::SeqCst);
        let potje = o.start_uitdaging(ann, u.id, UitdagingKeuze::Beginnen).unwrap();
        let ids: Vec<i64> = potje.spelers.iter().map(|s| s.speler_id).collect();
        assert_eq!(ids, vec![ann, bob]);
    }

    #[test]
    fn wie_je_uit_je_lijst_haalde_kan_je_niet_meer_uitdagen() {
        let (mut o, _, ann, bob) = twee_vrienden();
        // Bob haalt Ann weg. Ann staat nog in niemands lijst bij Bob, dus haar Uitdaging (met Melding) kan niet.
        o.verwijder_vriend(bob, ann).unwrap();
        assert_eq!(o.daag_uit(ann, bob, "ster", None).unwrap_err(), Fout::Onbekend("Unknown player"));
        assert!(o.vriendenlijst(bob).unwrap().uitdagingen.is_empty());
    }

    #[test]
    fn een_oud_vriendverzoek_goedkeuren_zet_een_weggehaalde_vriend_niet_terug() {
        let (mut o, ann, bob, _) = drie_spelers();
        // Ann vraagt Bob; voor Bob antwoordt, spelen ze samen via een Uitnodiging en worden zo vrienden.
        o.vraag_vriend(ann, &code(&o, bob)).unwrap();
        let p = o.maak_potje(ann, "ster", 2, None).unwrap();
        o.doe_mee(bob, &p.uitnodiging).unwrap();
        // Ann haalt Bob weg; daarna keurt Bob het oude verzoek goed.
        o.verwijder_vriend(ann, bob).unwrap();
        let _ = o.keur_vriendverzoek_goed(bob, ann);
        assert!(namen(&o.vriendenlijst(ann).unwrap()).is_empty(), "Bob staat niet terug in Ann's lijst");
    }

    #[test]
    fn wie_stopt_met_zoeken_naar_een_snel_potje_voor_vier_haalt_alleen_zichzelf_weg() {
        let (mut o, _) = met_klok();
        let ids: Vec<i64> = ["Ann", "Bob", "Cas"].iter().map(|n| o.maak_speler(n).unwrap().speler_id).collect();
        let wacht = o.zoek_snel_potje_met(ids[0], SNEL_MEER_AANTAL).unwrap();
        o.zoek_snel_potje_met(ids[1], SNEL_MEER_AANTAL).unwrap();
        o.zoek_snel_potje_met(ids[2], SNEL_MEER_AANTAL).unwrap();
        o.stop_zoeken(ids[0], wacht.potje_id).unwrap();
        assert_eq!(o.stand(ids[0], wacht.potje_id).unwrap_err(), Fout::Verboden("You are not in this game"));
        let stand = o.stand(ids[1], wacht.potje_id).unwrap();
        assert_eq!(stand.spelers.iter().map(|s| s.speler.speler_id).collect::<Vec<_>>(), vec![ids[1], ids[2]]);
        assert_eq!(stand.spelers.iter().map(|s| s.speler.plek).collect::<Vec<_>>(), vec![1, 2]);
        // De laatste die stopt, ruimt het Potje op.
        o.stop_zoeken(ids[1], wacht.potje_id).unwrap();
        o.stop_zoeken(ids[2], wacht.potje_id).unwrap();
        assert_eq!(o.stand(ids[2], wacht.potje_id).unwrap_err(), Fout::Onbekend("Unknown game"));
    }

    #[test]
    fn een_zet_na_de_denktijd_telt_niet_ook_als_het_alarm_nog_niet_liep() {
        let (mut o, klok) = met_klok();
        let (ids, potje) = denktijd_potje(&mut o, 2, 30);
        let mut spiegel = Game::new_star(2).unwrap();
        klok.0.fetch_add(29_999, std::sync::atomic::Ordering::SeqCst);
        zet_voor(&mut o, &mut spiegel, ids[0], potje);
        // Bob wacht precies zijn Denktijd; het alarm heeft nog niet gelopen.
        klok.0.fetch_add(30_000, std::sync::atomic::Ordering::SeqCst);
        let wie = spiegel.current_player();
        let van = (0..spiegel.board().len()).find(|&v| spiegel.stone_at(v) == Some(wie) && !spiegel.destinations(v).is_empty()).unwrap();
        let naar = spiegel.destinations(van)[0];
        assert_eq!(o.doe_zet(ids[1], potje, van, naar).unwrap_err(), Fout::Conflict("It is not your turn"));
        // Het alarm slaat de beurt daarna gewoon over.
        let standen = o.sla_verlopen_beurten_over().unwrap();
        assert_eq!(standen.iter().map(soort).collect::<Vec<_>>(), vec!["overgeslagen"]);
    }

    /// Een Zet heen of terug voor de Speler aan de beurt: een stap uit het startpunt, de volgende keer dezelfde stap terug.
    /// Zo kan een Potje eindeloos doorgaan (er is geen maximum aantal Zetten).
    fn heen_en_weer(o: &mut TestOpslag, spiegel: &mut Game, terug: &mut [Option<(usize, usize)>; 2], ids: [i64; 2], potje: i64) {
        let wie = spiegel.current_player();
        let (van, naar) = match terug[wie].take() {
            Some(z) => z,
            None => {
                let z = spiegel.start_cells(wie).iter().find_map(|&v| spiegel.step_destinations(v).first().map(|&n| (v, n))).unwrap();
                terug[wie] = Some((z.1, z.0));
                z
            }
        };
        o.doe_zet(ids[wie], potje, van, naar).unwrap();
        spiegel.make_move(van, naar).unwrap();
    }

    #[test]
    fn een_lang_potje_speelt_bij_een_verzoek_niet_de_hele_geschiedenis_opnieuw_af() {
        let (mut o, _) = met_klok();
        let ann = o.maak_speler("Ann").unwrap().speler_id;
        let bob = o.maak_speler("Bob").unwrap().speler_id;
        let potje = vrienden_potje(&mut o, &[ann, bob]);
        let (mut spiegel, mut terug) = (Game::new_star(2).unwrap(), [None, None]);
        for _ in 0..200 {
            heen_en_weer(&mut o, &mut spiegel, &mut terug, [ann, bob], potje);
        }
        let voor = o.stand(ann, potje).unwrap();
        assert_eq!(voor.versie, 200);
        // Maak de eerste helft van de geschiedenis onleesbaar. Wie die nog afspeelt, loopt vast op "bewaarde zet klopt niet meer".
        o.db.voer_uit("UPDATE zet SET van = 0, naar = 0, soort = 'zet' WHERE potje_id = ?1 AND nummer <= 100", p![potje]).unwrap();
        assert_eq!(o.stand(ann, potje).unwrap(), voor);
        assert_eq!(o.mijn_potjes(bob).unwrap()[0].potje_id, potje);
        o.prestaties(ann).unwrap();
        // Verder spelen, opgeven en de Statistieken lezen gaat ook zonder de oude Zetten.
        heen_en_weer(&mut o, &mut spiegel, &mut terug, [ann, bob], potje);
        assert_eq!(o.stand(bob, potje).unwrap().versie, 201);
        o.geef_op(bob, potje).unwrap();
        let s = o.statistieken(ann).unwrap();
        assert_eq!((s.gespeeld, s.gewonnen), (1, 1));
    }

    #[test]
    fn een_potje_zonder_bewaarde_stand_wordt_een_keer_helemaal_afgespeeld_met_dezelfde_uitkomst() {
        let (mut o, _) = met_klok();
        let ann = o.maak_speler("Ann").unwrap().speler_id;
        let bob = o.maak_speler("Bob").unwrap().speler_id;
        let potje = vrienden_potje(&mut o, &[ann, bob]);
        speel_uit(&mut o, potje, [ann, bob], 7);
        let (stand, statistieken, prestaties) = (o.stand(ann, potje).unwrap(), o.statistieken(ann).unwrap(), o.prestaties(bob).unwrap());
        assert!(statistieken.langste_sprong.is_some(), "het Potje heeft Sprongen");
        // Zo zag een Potje eruit van vóór taak 282: geen bewaarde stand, geen Sprongen per Zet.
        o.db.voer_uit("UPDATE potje SET bewaarde_stand = NULL, bewaarde_nummer = NULL WHERE id = ?1", p![potje]).unwrap();
        o.db.voer_uit("UPDATE zet SET sprongen = NULL WHERE potje_id = ?1", p![potje]).unwrap();
        assert_eq!(o.statistieken(ann).unwrap(), statistieken);
        assert_eq!(o.stand(ann, potje).unwrap(), stand);
        assert_eq!(o.prestaties(bob).unwrap(), prestaties);
        // Daarna staan de stand en de Sprongen in de opslag.
        assert_eq!(tel(&o, "SELECT COUNT(*) FROM zet WHERE potje_id = ?1 AND sprongen IS NULL", p![potje]), 0);
        assert_eq!(tel(&o, "SELECT bewaarde_nummer FROM potje WHERE id = ?1", p![potje]), i64::from(stand.versie));
        // Een kapotte bewaarde stand: ook dan volgt alles uit de Zetten.
        o.db.voer_uit("UPDATE potje SET bewaarde_stand = 'onzin' WHERE id = ?1", p![potje]).unwrap();
        assert_eq!(o.stand(ann, potje).unwrap(), stand);
    }

    #[test]
    fn open_potjes_hebben_een_grens_en_het_oudste_wachtende_potje_maakt_plaats() {
        let (mut o, _) = met_klok();
        let ann = o.maak_speler("Ann").unwrap().speler_id;
        let bob = o.maak_speler("Bob").unwrap().speler_id;
        let mut potjes = Vec::new();
        for _ in 0..MAX_OPEN_POTJES {
            potjes.push(o.maak_potje(ann, "ster", 2, None).unwrap());
        }
        // Op de grens: een nieuw Potje kan nog, en het oudste Potje waarin Ann nog alleen zit verdwijnt.
        o.doe_mee(bob, &potjes[0].uitnodiging).unwrap();
        o.maak_potje(ann, "ster", 2, None).unwrap();
        assert!(o.potje_bij_uitnodiging(&potjes[0].uitnodiging).is_ok(), "Bob doet mee: dit Potje blijft");
        assert!(matches!(o.potje_bij_uitnodiging(&potjes[1].uitnodiging), Err(Fout::Onbekend(_))), "het oudste wachtende Potje is weg");
        let open = |o: &TestOpslag| tel(o, "SELECT COUNT(*) FROM potje p JOIN potje_speler ps ON ps.potje_id = p.id AND ps.plek = 0 WHERE ps.speler_id = ?1 AND p.afgelopen = 0", p![ann]);
        assert_eq!(open(&o), i64::from(MAX_OPEN_POTJES));
        // Zit in elk open Potje iemand anders, dan kan er niets bij, ook geen Uitdaging.
        for p in o.mijn_potjes(ann).unwrap() {
            if !p.gestart {
                o.doe_mee(bob, &p.uitnodiging).unwrap();
            }
        }
        let fout = o.maak_potje(ann, "ster", 2, None).unwrap_err();
        assert!(matches!(fout, Fout::Conflict(t) if t.contains("too many open games")), "{fout:?}");
        let fout = o.daag_uit(ann, bob, "ster", None).unwrap_err();
        assert!(matches!(fout, Fout::Conflict(t) if t.contains("too many open games")), "{fout:?}");
        // Een andere Speler heeft zijn eigen ruimte, en na een opgave kan Ann weer een Potje maken.
        o.maak_potje(bob, "ster", 2, None).unwrap();
        o.geef_op(bob, potjes[0].potje_id).unwrap();
        o.maak_potje(ann, "ster", 2, None).unwrap();
        assert_eq!(open(&o), i64::from(MAX_OPEN_POTJES));
    }

    #[test]
    fn een_potje_bewaart_de_nieuwste_berichten_tot_de_grens() {
        let (mut o, ann, bob, potje, eerste) = ann_en_bob();
        for i in 0..MAX_BERICHTEN_PER_POTJE + 4 {
            o.stuur_bericht(if i % 2 == 0 { ann } else { bob }, potje, &format!("bericht {i}")).unwrap();
        }
        let lijst = o.berichten(ann, potje).unwrap();
        assert_eq!(lijst.len() as i64, MAX_BERICHTEN_PER_POTJE);
        assert!(!lijst.iter().any(|b| b.id == eerste.id), "het oudste Bericht is weg");
        assert_eq!(lijst.last().unwrap().tekst, format!("bericht {}", MAX_BERICHTEN_PER_POTJE + 3));
        assert_eq!(lijst.first().unwrap().tekst, "bericht 4");
        // Een ander Potje houdt zijn eigen Berichten.
        let ander = vrienden_potje(&mut o, &[ann, bob]);
        o.stuur_bericht(ann, ander, "hoi").unwrap();
        assert_eq!(o.berichten(bob, ander).unwrap().len(), 1);
        assert_eq!(o.berichten(bob, potje).unwrap().len() as i64, MAX_BERICHTEN_PER_POTJE);
    }

    #[test]
    fn een_speler_bewaart_hooguit_tien_meldingsadressen_per_soort_het_nieuwste_blijft() {
        let mut o = Opslag::in_geheugen().unwrap();
        let ann = o.maak_speler("Ann").unwrap().speler_id;
        let bob = o.maak_speler("Bob").unwrap().speler_id;
        let abonnement = |i: i64| Abonnement {
            endpoint: format!("https://fcm.googleapis.com/{i}"),
            keys: Sleutels {
                p256dh: "BCVxsr7N_eNgVRqvHtD0zTZsEc6-VV-JvLexhqUzORcxaOzi6-AYWXvTBHm4bjyPjs7Vd8pZGH6SRpkNtoIAiw4".into(),
                auth: "BTBZMqHH6r4Tts7J_aSIgg".into(),
            },
        };
        let token = |i: i64| ApnsToken { token: format!("{i:064x}"), omgeving: ApnsOmgeving::Production };
        o.bewaar_abonnement(bob, &abonnement(99)).unwrap();
        for i in 0..MAX_MELDINGSADRESSEN + 3 {
            o.bewaar_abonnement(ann, &abonnement(i)).unwrap();
            o.bewaar_apns_token(ann, &token(i)).unwrap();
            // Het eerste toestel meldt zich steeds opnieuw aan: dat telt als nieuwste en blijft.
            o.bewaar_abonnement(ann, &abonnement(0)).unwrap();
            o.bewaar_apns_token(ann, &token(0)).unwrap();
        }
        let web: Vec<String> = o.abonnementen_van(ann).unwrap().into_iter().map(|a| a.endpoint).collect();
        let apns: Vec<String> = o.apns_tokens_van(ann).unwrap().into_iter().map(|t| t.token).collect();
        assert_eq!(web.len() as i64, MAX_MELDINGSADRESSEN);
        assert_eq!(apns.len() as i64, MAX_MELDINGSADRESSEN);
        assert!(web.contains(&abonnement(0).endpoint) && web.contains(&abonnement(MAX_MELDINGSADRESSEN + 2).endpoint));
        assert!(!web.contains(&abonnement(1).endpoint), "het oudste andere toestel is weg");
        assert!(apns.contains(&token(0).token) && !apns.contains(&token(1).token));
        // Bob houdt zijn eigen adres.
        assert_eq!(o.abonnementen_van(bob).unwrap().len(), 1);
    }

    #[test]
    fn open_rapporten_hebben_een_grens_per_melder_en_de_beheerpagina_toont_er_een_deel() {
        let mut o = Opslag::in_geheugen().unwrap();
        let ids: Vec<i64> = ["Ann", "Bob", "Cas", "Dre"].iter().map(|n| o.maak_speler(n).unwrap().speler_id).collect();
        let potje = o.maak_potje(ids[0], "ster", 4, None).unwrap();
        for &id in &ids[1..] {
            o.doe_mee(id, &potje.uitnodiging).unwrap();
        }
        let berichten: Vec<i64> = (0..MAX_OPEN_RAPPORTEN_PER_MELDER + 5)
            .map(|i| o.stuur_bericht(ids[3], potje.potje_id, &format!("bericht {i}")).unwrap().id)
            .collect();
        let rapporteer = |o: &mut TestOpslag, melder: i64, bericht: i64| {
            o.rapporteer(melder, potje.potje_id, NieuwRapport { bericht_id: Some(bericht), speler_id: None }).unwrap()
        };
        for &b in &berichten {
            rapporteer(&mut o, ids[0], b);
        }
        let van = |o: &TestOpslag, melder: i64| tel(o, "SELECT COUNT(*) FROM rapport WHERE melder_id = ?1 AND gesloten = 0", p![melder]);
        assert_eq!(van(&o, ids[0]), MAX_OPEN_RAPPORTEN_PER_MELDER, "daarboven niet bewaard");
        // Sluit William er een, dan kan Ann weer een Rapport sturen.
        let id = o.open_rapporten().unwrap()[0].id;
        o.sluit_rapport(id).unwrap();
        rapporteer(&mut o, ids[0], *berichten.last().unwrap());
        assert_eq!(van(&o, ids[0]), MAX_OPEN_RAPPORTEN_PER_MELDER);
        // Twee andere melders: samen meer open Rapporten dan de beheerpagina toont.
        for &melder in &ids[1..3] {
            for &b in &berichten {
                rapporteer(&mut o, melder, b);
            }
        }
        let totaal = 3 * MAX_OPEN_RAPPORTEN_PER_MELDER;
        assert!(totaal > MAX_RAPPORTEN_OP_PAGINA);
        assert_eq!(o.aantal_open_rapporten().unwrap(), totaal);
        let lijst = o.open_rapporten().unwrap();
        assert_eq!(lijst.len() as i64, MAX_RAPPORTEN_OP_PAGINA);
        assert!(lijst.windows(2).all(|w| w[0].id > w[1].id), "het nieuwste eerst");
    }
}
