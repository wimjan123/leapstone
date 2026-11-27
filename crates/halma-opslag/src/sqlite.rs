//! De databank van de tests: SQLite via rusqlite.

use std::path::Path;
use std::sync::Arc;

use rusqlite::Connection;
use rusqlite::types::{ToSqlOutput, Value, ValueRef};

use crate::db::{Db, Rij, Waarde};
use crate::klok::SysteemKlok;
use crate::{Fout, Opslag};

impl From<rusqlite::Error> for Fout {
    fn from(e: rusqlite::Error) -> Self {
        Fout::Intern(e.to_string())
    }
}

impl rusqlite::ToSql for Waarde {
    fn to_sql(&self) -> rusqlite::Result<ToSqlOutput<'_>> {
        Ok(match self {
            Waarde::Leeg => ToSqlOutput::Owned(Value::Null),
            Waarde::Getal(g) => ToSqlOutput::Owned(Value::Integer(*g)),
            Waarde::Kommagetal(g) => ToSqlOutput::Owned(Value::Real(*g)),
            Waarde::Tekst(t) => ToSqlOutput::Borrowed(ValueRef::Text(t.as_bytes())),
        })
    }
}

fn waarde(v: ValueRef<'_>) -> Result<Waarde, Fout> {
    Ok(match v {
        ValueRef::Null => Waarde::Leeg,
        ValueRef::Integer(g) => Waarde::Getal(g),
        ValueRef::Real(g) => Waarde::Kommagetal(g),
        ValueRef::Text(t) => Waarde::Tekst(String::from_utf8_lossy(t).into_owned()),
        ValueRef::Blob(_) => return Err(Fout::Intern("onverwachte blob".into())),
    })
}

impl Db for Connection {
    fn rijen(&self, sql: &str, params: &[Waarde]) -> Result<Vec<Rij>, Fout> {
        let mut stmt = self.prepare_cached(sql)?;
        let kolommen = stmt.column_count();
        let mut rijen = stmt.query(rusqlite::params_from_iter(params))?;
        let mut uit = Vec::new();
        while let Some(r) = rijen.next()? {
            uit.push(Rij((0..kolommen).map(|i| waarde(r.get_ref(i)?)).collect::<Result<_, _>>()?));
        }
        Ok(uit)
    }

    fn script(&self, sql: &str) -> Result<(), Fout> {
        Ok(self.execute_batch(sql)?)
    }

    fn transactie<T>(&self, f: impl FnOnce() -> Result<T, Fout>) -> Result<T, Fout> {
        // IMMEDIATE: meteen het schrijfslot, zodat twee schrijvers elkaar niet halverwege tegenkomen.
        self.execute_batch("BEGIN IMMEDIATE")?;
        match f() {
            Ok(t) => {
                self.execute_batch("COMMIT")?;
                Ok(t)
            }
            Err(e) => {
                let _ = self.execute_batch("ROLLBACK");
                Err(e)
            }
        }
    }

    fn schema_versie(&self) -> Result<i64, Fout> {
        Ok(self.query_row("PRAGMA user_version", [], |r| r.get(0))?)
    }

    fn zet_schema_versie(&self, versie: i64) -> Result<(), Fout> {
        Ok(self.pragma_update(None, "user_version", versie)?)
    }
}

/// De opslag over SQLite.
pub type SqliteOpslag = Opslag<Connection>;

impl Opslag<Connection> {
    pub fn open(pad: &Path) -> Result<Self, Fout> {
        Self::sqlite(Connection::open(pad)?)
    }

    pub fn in_geheugen() -> Result<Self, Fout> {
        Self::sqlite(Connection::open_in_memory()?)
    }

    fn sqlite(conn: Connection) -> Result<Self, Fout> {
        conn.pragma_update(None, "foreign_keys", true)?;
        conn.busy_timeout(std::time::Duration::from_secs(5))?;
        let _: String = conn.query_row("PRAGMA journal_mode=WAL", [], |r| r.get(0))?;
        Opslag::nieuw(conn, Arc::new(SysteemKlok))
    }
}
