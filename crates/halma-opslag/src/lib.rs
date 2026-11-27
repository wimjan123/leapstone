//! Opslag van Spelers en Potjes: alle regels rond Spelers, Potjes, Zetten en Berichten.
//!
//! De databank zit achter de kleine trait [`Db`]. De tests gebruiken SQLite
//! (feature `rusqlite`), de Cloudflare Worker de SQL van een Durable Object. Zo bestaat de
//! logica maar één keer.

pub mod beheer;
pub mod codes;
pub mod db;
pub mod klok;
mod opslag;
pub mod tellers;
pub mod taal;
pub mod woordfilter;
#[cfg(feature = "rusqlite")]
mod sqlite;

pub use db::{Db, Rij, Waarde};
pub use klok::Klok;
pub use opslag::*;
#[cfg(feature = "rusqlite")]
pub use sqlite::SqliteOpslag;

/// Het pakket (Android) en de bundel-id (iOS) van de app.
pub const PAKKET: &str = "nl.leapstone.app";
/// Het Apple-team dat de iOS-app tekent.
pub const APPLE_TEAM: &str = "S9DZ7L5BVD";

/// De inhoud van `/.well-known/assetlinks.json` voor deze vingerafdrukken (SHA-256 van het tekencertificaat).
pub fn assetlinks_json(vingers: &[String]) -> serde_json::Value {
    let vingers: Vec<String> = vingers.iter().map(|v| v.trim().to_uppercase()).filter(|v| !v.is_empty()).collect();
    if vingers.is_empty() {
        serde_json::json!([])
    } else {
        serde_json::json!([{
            "relation": ["delegate_permission/common.handle_all_urls"],
            "target": {
                "namespace": "android_app",
                "package_name": PAKKET,
                "sha256_cert_fingerprints": vingers,
            }
        }])
    }
}

/// De inhoud van `/.well-known/apple-app-site-association`: Uitnodigingen (`/uitnodiging/<code>`) openen de iOS-app (Universal Link).
pub fn apple_app_site_association_json() -> serde_json::Value {
    let app = format!("{APPLE_TEAM}.{PAKKET}");
    serde_json::json!({
        "applinks": {
            "details": [{
                "appIDs": [app],
                "components": [{ "/": "/uitnodiging/*" }],
            }]
        }
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn assetlinks_noemt_het_pakket_en_de_vingerafdrukken() {
        let j = assetlinks_json(&[" aa:bb ".into(), "".into(), "CC:DD".into()]);
        assert_eq!(j[0]["target"]["package_name"], "nl.leapstone.app");
        assert_eq!(j[0]["target"]["sha256_cert_fingerprints"], serde_json::json!(["AA:BB", "CC:DD"]));
        assert_eq!(assetlinks_json(&[]), serde_json::json!([]));
    }

    #[test]
    fn apple_koppelt_alleen_uitnodigingen_aan_de_app() {
        let j = apple_app_site_association_json();
        let d = &j["applinks"]["details"][0];
        assert_eq!(d["appIDs"], serde_json::json!(["S9DZ7L5BVD.nl.leapstone.app"]));
        assert_eq!(d["components"], serde_json::json!([{ "/": "/uitnodiging/*" }]));
    }
}
