//! Grenzen aan verzoeken: welke teller telt een verzoek, op welke sleutel, en hoe groot mag het zijn.
//!
//! Gewone Rust zonder Worker-types, dus testbaar. De aanroep van de rate limiting binding van
//! Cloudflare staat in `cloudflare.rs`; de aantallen per periode staan in `wrangler.toml`.

use halma_opslag::{beheer, codes};

/// Een verzoek aan `/api` mag niet groter zijn dan dit (bytes). Een Bericht of Zet is veel kleiner.
pub const MAX_VERZOEK_BYTES: usize = 16 * 1024;

/// De tekst die de Speler bij 429 ziet.
pub const TE_VEEL: &str = "Slow down. Try again in a moment.";
/// De tekst die de Speler bij 413 ziet.
pub const TE_GROOT: &str = "That request is too big.";

/// Welke teller een verzoek telt. De namen horen bij de bindings in `wrangler.toml`.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Teller {
    /// Nieuwe Spelers en herstel: per internetadres.
    Nieuw,
    /// Berichten: per Speler.
    Bericht,
    /// Vriend toevoegen (een Vriendcode opzoeken of een Vriendverzoek sturen) en een vriend uitdagen: per Speler, strakker
    /// dan de rest, zodat Vriendcodes niet te raden zijn en niemand vrienden met Meldingen kan bestoken.
    Vriend,
    /// Alle andere verzoeken aan `/api`: per Speler, of zonder sleutel per internetadres.
    Overig,
    /// Reserve voor elk verzoek aan `/api`, per internetadres, naast de teller van de route.
    Ip,
}

impl Teller {
    /// De naam van de binding in `wrangler.toml`.
    pub fn binding(self) -> &'static str {
        match self {
            Teller::Nieuw => "LIMIET_NIEUW",
            Teller::Bericht => "LIMIET_BERICHT",
            Teller::Vriend => "LIMIET_VRIEND",
            Teller::Overig => "LIMIET_OVERIG",
            Teller::Ip => "LIMIET_IP",
        }
    }
}

/// De teller en de sleutel waarop die telt.
#[derive(Debug, PartialEq, Eq)]
pub struct Keuze {
    pub teller: Teller,
    pub sleutel: String,
}

/// Kiest de teller en de sleutel. `pad` is het volledige pad (met `/api`), `autorisatie` de header
/// `Authorization`, `ip` de waarde van `CF-Connecting-IP`.
///
/// De sleutel van een Speler gaat nooit zelf naar de teller, alleen de hash ervan.
pub fn kies(methode: &str, pad: &str, autorisatie: Option<&str>, ip: Option<&str>) -> Keuze {
    let delen: Vec<&str> = pad.trim_matches('/').split('/').collect();
    let per_ip = || format!("ip:{}", ip.filter(|i| !i.is_empty()).unwrap_or("onbekend"));
    let per_speler = || match bearer(autorisatie) {
        Some(sleutel) => format!("speler:{}", codes::hash(sleutel)),
        None => per_ip(),
    };
    match (methode, delen.as_slice()) {
        ("POST", ["api", "spelers"]) | ("POST", ["api", "herstel"]) => Keuze { teller: Teller::Nieuw, sleutel: per_ip() },
        ("POST", ["api", "potjes", _, "berichten"]) => Keuze { teller: Teller::Bericht, sleutel: per_speler() },
        ("GET", ["api", "vrienden", "code", _]) | ("POST", ["api", "vrienden", "verzoeken"]) | ("POST", ["api", "uitdagingen"]) => {
            Keuze { teller: Teller::Vriend, sleutel: per_speler() }
        }
        _ => Keuze { teller: Teller::Overig, sleutel: per_speler() },
    }
}

/// Alle tellers die een verzoek moet passeren, in volgorde: eerst de reserve per internetadres, dan
/// de teller van de route (zie [`kies`]). De sleutel van een Speler is niet gecontroleerd voordat de
/// Worker telt, dus wie bij elk verzoek een nieuwe verzonnen sleutel stuurt, ontloopt de teller per
/// Speler. De reserve per internetadres vangt dat op.
///
/// `/beheer` heeft geen Speler: alleen de reserve per internetadres. Zo kan niemand zonder sleutel het Durable Object onbeperkt
/// wekken met verzoeken aan de beheerpagina (taak 282).
pub fn controles(methode: &str, pad: &str, autorisatie: Option<&str>, ip: Option<&str>) -> Vec<Keuze> {
    let ip_sleutel = format!("ip:{}", ip.filter(|i| !i.is_empty()).unwrap_or("onbekend"));
    let reserve = Keuze { teller: Teller::Ip, sleutel: ip_sleutel };
    if beheer::is_beheer(pad) {
        return vec![reserve];
    }
    vec![reserve, kies(methode, pad, autorisatie, ip)]
}

fn bearer(autorisatie: Option<&str>) -> Option<&str> {
    autorisatie?.strip_prefix("Bearer ").map(str::trim).filter(|s| !s.is_empty())
}

/// Is het verzoek te groot volgens de header `Content-Length`? Zo kan de Worker weigeren voordat
/// hij de body leest. Een onleesbare waarde telt ook als te groot: dan is de lengte niet te vertrouwen.
/// Zonder header (chunked) leest de Worker de body zelf met een grens, zie [`BegrensdeBody`].
pub fn lengte_te_groot(content_length: Option<&str>) -> bool {
    content_length.is_some_and(|c| c.trim().parse::<u64>().map_or(true, |n| n > MAX_VERZOEK_BYTES as u64))
}

/// Heeft een verzoek met deze methode een body die de Worker moet lezen?
pub fn heeft_body(methode: &str) -> bool {
    !matches!(methode, "GET" | "HEAD" | "OPTIONS")
}

/// Een body die de Worker stukje voor stukje leest, vóór het Durable Object. Gaat hij over [`MAX_VERZOEK_BYTES`],
/// dan stopt het lezen meteen: het gedeelde Durable Object krijgt nooit meer dan de grens te zien (taak 282).
#[derive(Debug, Default)]
pub struct BegrensdeBody {
    bytes: Vec<u8>,
}

impl BegrensdeBody {
    /// Voegt een stuk toe. `false`: de body is nu te groot; stop met lezen en weiger het verzoek.
    pub fn voeg_toe(&mut self, stuk: &[u8]) -> bool {
        if self.bytes.len() + stuk.len() > MAX_VERZOEK_BYTES {
            return false;
        }
        self.bytes.extend_from_slice(stuk);
        true
    }

    pub fn bytes(self) -> Vec<u8> {
        self.bytes
    }
}

/// Is een al gelezen body te groot (voor verzoeken zonder `Content-Length`)?
pub fn body_te_groot(body: &[u8]) -> bool {
    body.len() > MAX_VERZOEK_BYTES
}

#[cfg(test)]
mod tests {
    use super::*;

    const IP: Option<&str> = Some("203.0.113.7");

    #[test]
    fn nieuwe_speler_en_herstel_tellen_per_internetadres() {
        for pad in ["/api/spelers", "/api/herstel"] {
            // Ook met een sleutel telt het internetadres: een nieuwe Speler heeft er nog geen.
            let k = kies("POST", pad, Some("Bearer geheim"), IP);
            assert_eq!(k, Keuze { teller: Teller::Nieuw, sleutel: "ip:203.0.113.7".into() });
        }
    }

    #[test]
    fn play_online_telt_als_gewoon_verzoek_per_speler() {
        // Zoeken is één verzoek, stoppen één: de app wacht op de live verbinding en pollt niet.
        for (m, pad) in [("POST", "/api/snel"), ("DELETE", "/api/snel/7")] {
            let k = kies(m, pad, Some("Bearer geheim"), IP);
            assert_eq!(k, Keuze { teller: Teller::Overig, sleutel: format!("speler:{}", codes::hash("geheim")) });
        }
    }

    #[test]
    fn berichten_tellen_per_speler_met_hash_van_de_sleutel() {
        let k = kies("POST", "/api/potjes/12/berichten", Some("Bearer geheim"), IP);
        assert_eq!(k.teller, Teller::Bericht);
        assert_eq!(k.sleutel, format!("speler:{}", codes::hash("geheim")));
        assert!(!k.sleutel.contains("geheim"));
        // Een andere Speler heeft een andere teller.
        let ander = kies("POST", "/api/potjes/12/berichten", Some("Bearer anders"), IP);
        assert_ne!(k.sleutel, ander.sleutel);
    }

    #[test]
    fn vriend_toevoegen_heeft_een_eigen_strakke_teller_per_speler() {
        for (methode, pad) in [("GET", "/api/vrienden/code/48210937"), ("POST", "/api/vrienden/verzoeken"), ("POST", "/api/uitdagingen")] {
            let k = kies(methode, pad, Some("Bearer geheim"), IP);
            assert_eq!(k, Keuze { teller: Teller::Vriend, sleutel: format!("speler:{}", codes::hash("geheim")) });
        }
        // De gewone Vriendenlijst is een overig verzoek.
        assert_eq!(kies("GET", "/api/vrienden", Some("Bearer geheim"), IP).teller, Teller::Overig);
        assert_eq!(kies("POST", "/api/vrienden/verzoeken/3/goedkeuren", Some("Bearer geheim"), IP).teller, Teller::Overig);
        // Een Uitdaging volgen, accepteren of weigeren is een overig verzoek.
        for (methode, pad) in [("GET", "/api/uitdagingen/3"), ("POST", "/api/uitdagingen/3/accepteren"), ("DELETE", "/api/uitdagingen/3")] {
            assert_eq!(kies(methode, pad, Some("Bearer geheim"), IP).teller, Teller::Overig, "{pad}");
        }
        assert_eq!(Teller::Vriend.binding(), "LIMIET_VRIEND");
    }

    #[test]
    fn berichten_lezen_is_een_overig_verzoek() {
        let k = kies("GET", "/api/potjes/12/berichten", Some("Bearer geheim"), IP);
        assert_eq!(k.teller, Teller::Overig);
    }

    #[test]
    fn overige_verzoeken_per_speler_of_anders_per_internetadres() {
        let k = kies("GET", "/api/potjes/12", Some("Bearer geheim"), IP);
        assert_eq!(k, Keuze { teller: Teller::Overig, sleutel: format!("speler:{}", codes::hash("geheim")) });
        let zonder = kies("GET", "/api/ranglijst", None, IP);
        assert_eq!(zonder, Keuze { teller: Teller::Overig, sleutel: "ip:203.0.113.7".into() });
        // Een kapotte header telt als geen sleutel.
        assert_eq!(kies("GET", "/api/ranglijst", Some("Basic x"), IP).sleutel, "ip:203.0.113.7");
        assert_eq!(kies("GET", "/api/ranglijst", Some("Bearer "), IP).sleutel, "ip:203.0.113.7");
    }

    #[test]
    fn bericht_zonder_sleutel_valt_terug_op_het_internetadres() {
        let k = kies("POST", "/api/potjes/1/berichten", None, IP);
        assert_eq!(k, Keuze { teller: Teller::Bericht, sleutel: "ip:203.0.113.7".into() });
    }

    #[test]
    fn zonder_internetadres_een_vaste_sleutel() {
        assert_eq!(kies("GET", "/api/ranglijst", None, None).sleutel, "ip:onbekend");
        assert_eq!(kies("GET", "/api/ranglijst", None, Some("")).sleutel, "ip:onbekend");
    }

    #[test]
    fn elk_verzoek_passeert_ook_de_reserve_per_internetadres() {
        for (methode, pad) in [("POST", "/api/spelers"), ("POST", "/api/potjes/1/berichten"), ("GET", "/api/ranglijst")] {
            let lijst = controles(methode, pad, Some("Bearer geheim"), IP);
            assert_eq!(lijst.len(), 2);
            assert_eq!(lijst[0], Keuze { teller: Teller::Ip, sleutel: "ip:203.0.113.7".into() });
            assert_eq!(lijst[1], kies(methode, pad, Some("Bearer geheim"), IP));
        }
    }

    #[test]
    fn verzonnen_sleutels_delen_dezelfde_reserve() {
        // Elke verzonnen sleutel geeft een andere teller per Speler, maar dezelfde reserve per internetadres.
        let a = controles("GET", "/api/potjes/1", Some("Bearer willekeurig-1"), IP);
        let b = controles("GET", "/api/potjes/1", Some("Bearer willekeurig-2"), IP);
        assert_ne!(a[1].sleutel, b[1].sleutel);
        assert_eq!(a[0], b[0]);
    }

    #[test]
    fn te_groot_verzoek_geeft_413_voor_het_lezen() {
        assert!(!lengte_te_groot(None));
        // Een onleesbare lengte is niet te vertrouwen: weigeren.
        assert!(lengte_te_groot(Some("abc")));
        assert!(lengte_te_groot(Some("-1")));
        assert!(!lengte_te_groot(Some("0")));
        assert!(!lengte_te_groot(Some("16384")));
        assert!(lengte_te_groot(Some("16385")));
        assert!(lengte_te_groot(Some(" 99999999999 ")));
    }

    #[test]
    fn gelezen_body_te_groot() {
        assert!(!body_te_groot(&vec![0; MAX_VERZOEK_BYTES]));
        assert!(body_te_groot(&vec![0; MAX_VERZOEK_BYTES + 1]));
    }

    #[test]
    fn de_worker_leest_een_body_zonder_lengte_tot_de_grens_en_stopt_dan() {
        let mut body = BegrensdeBody::default();
        for _ in 0..16 {
            assert!(body.voeg_toe(&[7; 1024]));
        }
        assert_eq!(body.bytes().len(), MAX_VERZOEK_BYTES);
        // Eén byte te veel, ook verspreid over stukken: weigeren, en het teveel wordt niet bewaard.
        let mut body = BegrensdeBody::default();
        assert!(body.voeg_toe(&[1; 10_000]));
        assert!(!body.voeg_toe(&[1; MAX_VERZOEK_BYTES - 10_000 + 1]));
        assert_eq!(body.bytes().len(), 10_000);
        assert!(heeft_body("POST") && heeft_body("DELETE") && !heeft_body("GET") && !heeft_body("HEAD"));
    }

    #[test]
    fn de_beheerpagina_telt_per_internetadres_ook_zonder_sleutel() {
        for (methode, pad) in [("GET", "/beheer"), ("GET", "/beheer/tellers.json"), ("POST", "/beheer/rapporten/3/sluit")] {
            for autorisatie in [None, Some("Basic eDp5")] {
                let lijst = controles(methode, pad, autorisatie, IP);
                assert_eq!(lijst, vec![Keuze { teller: Teller::Ip, sleutel: "ip:203.0.113.7".into() }], "{pad}");
            }
        }
    }
}
