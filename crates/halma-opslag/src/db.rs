//! De kleine databank-trait onder de opslag.
//!
//! Alle SQL is gewone SQLite met genummerde parameters (`?1`, `?2`). Nieuwe rijen geven hun
//! id met `RETURNING id`, zodat geen `last_insert_rowid` nodig is.

use crate::Fout;

/// Eén waarde in of uit de databank.
#[derive(Debug, Clone, PartialEq)]
pub enum Waarde {
    Leeg,
    Getal(i64),
    Kommagetal(f64),
    Tekst(String),
}

impl From<i64> for Waarde {
    fn from(v: i64) -> Self {
        Waarde::Getal(v)
    }
}

impl From<u32> for Waarde {
    fn from(v: u32) -> Self {
        Waarde::Getal(v.into())
    }
}

impl From<bool> for Waarde {
    fn from(v: bool) -> Self {
        Waarde::Getal(v.into())
    }
}

impl From<&str> for Waarde {
    fn from(v: &str) -> Self {
        Waarde::Tekst(v.to_string())
    }
}

impl From<&String> for Waarde {
    fn from(v: &String) -> Self {
        Waarde::Tekst(v.clone())
    }
}

impl From<String> for Waarde {
    fn from(v: String) -> Self {
        Waarde::Tekst(v)
    }
}

impl<T: Into<Waarde>> From<Option<T>> for Waarde {
    fn from(v: Option<T>) -> Self {
        v.map_or(Waarde::Leeg, Into::into)
    }
}

/// Parameters voor een SQL-opdracht: `p![a, b]` wordt `&[Waarde::from(a), Waarde::from(b)]`.
#[macro_export]
macro_rules! p {
    ($($x:expr),* $(,)?) => { &[$($crate::Waarde::from($x)),*] };
}

/// Eén rij uit de databank.
#[derive(Debug, Clone, PartialEq)]
pub struct Rij(pub Vec<Waarde>);

impl Rij {
    fn kolom(&self, i: usize) -> Result<&Waarde, Fout> {
        self.0.get(i).ok_or_else(|| Fout::Intern(format!("kolom {i} bestaat niet")))
    }

    pub fn optie_i64(&self, i: usize) -> Result<Option<i64>, Fout> {
        match self.kolom(i)? {
            Waarde::Leeg => Ok(None),
            Waarde::Getal(g) => Ok(Some(*g)),
            // De Durable Object-SQL geeft getallen door JavaScript; hele getallen blijven heel.
            Waarde::Kommagetal(g) if g.fract() == 0.0 => Ok(Some(*g as i64)),
            w => Err(Fout::Intern(format!("kolom {i} is geen geheel getal: {w:?}"))),
        }
    }

    pub fn i64(&self, i: usize) -> Result<i64, Fout> {
        self.optie_i64(i)?.ok_or_else(|| Fout::Intern(format!("kolom {i} is leeg")))
    }

    pub fn optie_u32(&self, i: usize) -> Result<Option<u32>, Fout> {
        self.optie_i64(i)?
            .map(|g| u32::try_from(g).map_err(|_| Fout::Intern(format!("kolom {i} past niet in u32: {g}"))))
            .transpose()
    }

    pub fn u32(&self, i: usize) -> Result<u32, Fout> {
        self.optie_u32(i)?.ok_or_else(|| Fout::Intern(format!("kolom {i} is leeg")))
    }

    pub fn bool(&self, i: usize) -> Result<bool, Fout> {
        Ok(self.i64(i)? != 0)
    }

    pub fn optie_tekst(&self, i: usize) -> Result<Option<String>, Fout> {
        match self.kolom(i)? {
            Waarde::Leeg => Ok(None),
            _ => self.tekst(i).map(Some),
        }
    }

    pub fn tekst(&self, i: usize) -> Result<String, Fout> {
        match self.kolom(i)? {
            Waarde::Tekst(t) => Ok(t.clone()),
            w => Err(Fout::Intern(format!("kolom {i} is geen tekst: {w:?}"))),
        }
    }
}

/// Een SQLite-databank: SQLite zelf (rusqlite) of de SQL van een Durable Object.
pub trait Db {
    /// Voert één SQL-opdracht uit en geeft alle rijen.
    fn rijen(&self, sql: &str, params: &[Waarde]) -> Result<Vec<Rij>, Fout>;

    /// Voert meerdere SQL-opdrachten zonder parameters uit (de migraties).
    fn script(&self, sql: &str) -> Result<(), Fout>;

    /// Voert `f` uit als één transactie: alles of niets. Bij een fout gaat alles terug.
    fn transactie<T>(&self, f: impl FnOnce() -> Result<T, Fout>) -> Result<T, Fout>;

    /// Het aantal uitgevoerde migraties.
    fn schema_versie(&self) -> Result<i64, Fout>;

    fn zet_schema_versie(&self, versie: i64) -> Result<(), Fout>;

    fn voer_uit(&self, sql: &str, params: &[Waarde]) -> Result<(), Fout> {
        self.rijen(sql, params).map(|_| ())
    }

    /// De eerste rij, als die er is.
    fn rij(&self, sql: &str, params: &[Waarde]) -> Result<Option<Rij>, Fout> {
        Ok(self.rijen(sql, params)?.into_iter().next())
    }
}
