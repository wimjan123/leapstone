//! De lokale Melding voor de Dagelijkse puzzel (taak 153): de web-app bepaalt de tijden (9 uur eigen tijd) en de
//! teksten, dit commando plant ze bij iOS. Niets gaat naar de server. Op andere platforms geven de commando's een fout.

use serde::Deserialize;

/// Een geplande Melding: een vast nummer en het tijdstip in seconden sinds 1970.
#[derive(Deserialize, Debug, PartialEq)]
pub struct Moment {
    id: i32,
    tijd: i64,
}

/// De vaste nummers van de Meldingen van de puzzel (dag 0 tot en met 6). Zie `MELDING_ID_BEGIN` in `web/src/puzzelmelding.ts`.
const ID_BEGIN: i32 = 41530;
const AANTAL: i32 = 7;

/// Houdt alleen momenten met een eigen nummer van de puzzel die nog in de toekomst liggen, hooguit één per nummer.
#[cfg_attr(not(target_os = "ios"), allow(dead_code))]
fn geldige_momenten(momenten: Vec<Moment>, nu: i64) -> Vec<Moment> {
    let mut uit: Vec<Moment> = Vec::new();
    for m in momenten {
        if (ID_BEGIN..ID_BEGIN + AANTAL).contains(&m.id) && m.tijd > nu && !uit.iter().any(|x| x.id == m.id) {
            uit.push(m);
        }
    }
    uit
}

/// Vraagt toestemming voor Meldingen (iOS toont dat maar één keer): "granted" of "denied".
#[tauri::command]
pub async fn puzzelmelding_toestemming<R: tauri::Runtime>(app: tauri::AppHandle<R>) -> Result<String, String> {
    #[cfg(target_os = "ios")]
    {
        use tauri_plugin_notifications::{NotificationsExt, PermissionState};
        let staat = app.notifications().request_permission().await.map_err(|e| e.to_string())?;
        Ok(if matches!(staat, PermissionState::Granted) { "granted" } else { "denied" }.into())
    }
    #[cfg(not(target_os = "ios"))]
    {
        let _ = app;
        Err("Notifications are not available in this app".into())
    }
}

/// Annuleert alle geplande Meldingen van de puzzel en plant `momenten` opnieuw. Een lege lijst zet ze alleen uit.
/// Zonder toestemming: de fout "denied" (er wordt dan niets gepland).
#[tauri::command]
pub async fn puzzelmelding_plan<R: tauri::Runtime>(
    app: tauri::AppHandle<R>,
    momenten: Vec<Moment>,
    titel: String,
    tekst: String,
) -> Result<(), String> {
    #[cfg(target_os = "ios")]
    {
        use tauri_plugin_notifications::{NotificationsExt, PermissionState, Schedule};
        let n = app.notifications();
        n.cancel((ID_BEGIN..ID_BEGIN + AANTAL).collect()).map_err(|e| e.to_string())?;
        let nu = time::OffsetDateTime::now_utc().unix_timestamp();
        let momenten = geldige_momenten(momenten, nu);
        if momenten.is_empty() {
            return Ok(());
        }
        if !matches!(n.permission_state().await.map_err(|e| e.to_string())?, PermissionState::Granted) {
            return Err("denied".into());
        }
        for m in momenten {
            let date = time::OffsetDateTime::from_unix_timestamp(m.tijd).map_err(|e| e.to_string())?;
            n.builder()
                .id(m.id)
                .title(&titel)
                .body(&tekst)
                .schedule(Schedule::At { date, repeating: false, allow_while_idle: false })
                .show()
                .await
                .map_err(|e| e.to_string())?;
        }
        Ok(())
    }
    #[cfg(not(target_os = "ios"))]
    {
        let _ = (app, momenten, titel, tekst);
        Err("Notifications are not available in this app".into())
    }
}

#[cfg(test)]
mod tests {
    use super::{Moment, geldige_momenten};

    #[test]
    fn alleen_eigen_nummers_in_de_toekomst_en_geen_dubbele() {
        let m = |id, tijd| Moment { id, tijd };
        let uit = geldige_momenten(vec![m(41530, 50), m(41531, 200), m(41531, 300), m(41536, 400), m(41537, 500), m(1, 600)], 100);
        assert_eq!(uit, vec![m(41531, 200), m(41536, 400)]);
    }
}
