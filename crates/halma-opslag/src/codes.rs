//! Geheime codes: sleutel, Herstelcode en Uitnodiging-code.

use sha2::{Digest, Sha256};

/// Alfabet zonder verwarrende tekens (geen 0/O, 1/I/L).
const ALFABET: &[u8] = b"23456789ABCDEFGHJKMNPQRSTUVWXYZ";

fn willekeurig(n: usize) -> Vec<u8> {
    let mut buf = vec![0u8; n];
    getrandom::fill(&mut buf).expect("geen willekeurige bytes beschikbaar");
    buf
}

/// `n` tekens uit het alfabet, zonder modulo-scheefheid (afwijzen boven 248).
fn tekens(n: usize) -> String {
    let max = (256 / ALFABET.len() * ALFABET.len()) as u8 as usize;
    let mut uit = String::with_capacity(n);
    while uit.len() < n {
        for b in willekeurig(n * 2) {
            if (b as usize) < max && uit.len() < n {
                uit.push(ALFABET[b as usize % ALFABET.len()] as char);
            }
        }
    }
    uit
}

/// Geheime sleutel van een Speler: 256 bits, hex.
pub fn nieuwe_sleutel() -> String {
    willekeurig(32).iter().map(|b| format!("{b:02x}")).collect()
}

/// Herstelcode: 20 tekens (ca. 99 bits) in vijf groepen, zoals `K7QM-4XWD-92PB-HTRN-6ZAE`.
pub fn nieuwe_herstelcode() -> String {
    groepeer(&tekens(20))
}

/// Uitnodiging-code: 16 tekens (ca. 79 bits), zoals `7KQMX4WD92PBHTRN`.
pub fn nieuwe_uitnodiging() -> String {
    tekens(16)
}

/// Vriendcode: acht willekeurige cijfers, zoals `48210937`. Niet op volgorde en zonder naam erin; of hij nog vrij is, weet de opslag.
pub fn nieuwe_vriendcode() -> String {
    let mut b = [0u8; 8];
    getrandom::fill(&mut b).expect("geen willekeurige bytes beschikbaar");
    // 2^64 is bijna een veelvoud van 10^8: de scheefheid is verwaarloosbaar.
    format!("{:08}", u64::from_le_bytes(b) % 100_000_000)
}

fn groepeer(s: &str) -> String {
    s.as_bytes()
        .chunks(4)
        .map(|c| std::str::from_utf8(c).unwrap())
        .collect::<Vec<_>>()
        .join("-")
}

/// Maakt een ingetikte Herstelcode of Uitnodiging-code gelijk: hoofdletters, geen streepjes of spaties.
pub fn normaliseer(code: &str) -> String {
    code.chars()
        .filter(|c| c.is_ascii_alphanumeric())
        .map(|c| c.to_ascii_uppercase())
        .collect()
}

/// SHA-256 (hex). Genoeg voor codes met zoveel willekeur; geheimen staan nooit leesbaar in de database.
pub fn hash(geheim: &str) -> String {
    Sha256::digest(geheim.as_bytes())
        .iter()
        .map(|b| format!("{b:02x}"))
        .collect()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn vorm_en_normaliseren() {
        let h = nieuwe_herstelcode();
        assert_eq!(h.len(), 24);
        assert_eq!(normaliseer(&h.to_lowercase()).len(), 20);
        assert_eq!(nieuwe_uitnodiging().len(), 16);
        assert_ne!(nieuwe_sleutel(), nieuwe_sleutel());
    }
}
