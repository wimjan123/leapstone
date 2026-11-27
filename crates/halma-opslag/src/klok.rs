//! De klok van de opslag. Tests en de Worker geven een eigen klok mee.

/// Wat de opslag nodig heeft om de tijd te weten: milliseconden sinds 1970.
pub trait Klok: Send + Sync {
    fn nu_ms(&self) -> i64;
}

/// De systeemklok (niet in WebAssembly: daar geeft de Worker zijn eigen klok).
pub struct SysteemKlok;

impl Klok for SysteemKlok {
    fn nu_ms(&self) -> i64 {
        std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .map_or(0, |d| d.as_millis() as i64)
    }
}
