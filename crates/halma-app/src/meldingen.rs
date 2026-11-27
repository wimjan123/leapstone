//! Meldingen in de iPhone-app via Apple (APNs). De webview vraagt hier de toestemming en het
//! apparaattoken op en stuurt het token zelf naar de server (`POST /api/push/apns`).
//! Op andere platforms geven deze commando's een fout: daar zijn (nog) geen Meldingen in de app.

use serde::Serialize;

/// Het apparaattoken en de APNs-omgeving waarvoor de app is getekend.
#[derive(Serialize)]
pub struct Token {
    token: String,
    /// "sandbox" (testversie) of "production" (TestFlight en App Store).
    omgeving: &'static str,
}

/// De toestemming voor Meldingen zonder iets te vragen: "granted", "denied" of "prompt".
#[tauri::command]
pub async fn meldingen_toestemming<R: tauri::Runtime>(app: tauri::AppHandle<R>) -> Result<String, String> {
    #[cfg(target_os = "ios")]
    {
        use tauri_plugin_notifications::NotificationsExt;
        let staat = app.notifications().permission_state().await.map_err(|e| e.to_string())?;
        Ok(toestemming_tekst(staat))
    }
    #[cfg(not(target_os = "ios"))]
    {
        let _ = app;
        Err("Notifications are not available in this app".into())
    }
}

/// Vraagt toestemming (iOS toont dat maar één keer) en haalt het apparaattoken op.
/// Zonder toestemming: de fout "denied".
#[tauri::command]
pub async fn apns_token<R: tauri::Runtime>(app: tauri::AppHandle<R>) -> Result<Token, String> {
    #[cfg(target_os = "ios")]
    {
        use tauri_plugin_notifications::NotificationsExt;
        let n = app.notifications();
        let staat = n.request_permission().await.map_err(|e| e.to_string())?;
        if toestemming_tekst(staat) != "granted" {
            return Err("denied".into());
        }
        let token = n.register_for_push_notifications().await.map_err(|e| e.to_string())?;
        Ok(Token { token, omgeving: omgeving() })
    }
    #[cfg(not(target_os = "ios"))]
    {
        let _ = app;
        Err("Notifications are not available in this app".into())
    }
}

#[cfg(target_os = "ios")]
fn toestemming_tekst(staat: tauri::plugin::PermissionState) -> String {
    use tauri::plugin::PermissionState;
    match staat {
        PermissionState::Granted => "granted",
        PermissionState::Denied => "denied",
        _ => "prompt",
    }
    .into()
}

/// De APNs-omgeving van deze build, uit `aps-environment` in `embedded.mobileprovision`: development
/// (testversie) wordt sandbox; production (winkelprofiel) of geen profiel wordt production.
#[cfg(target_os = "ios")]
fn omgeving() -> &'static str {
    let profiel = std::env::current_exe().ok().and_then(|p| std::fs::read(p.with_file_name("embedded.mobileprovision")).ok());
    match profiel {
        Some(bytes) if is_ontwikkeling(&bytes) => "sandbox",
        _ => "production",
    }
}

/// Staat in het profiel `<key>aps-environment</key>` met daarna `<string>development</string>`?
#[cfg_attr(not(target_os = "ios"), allow(dead_code))]
fn is_ontwikkeling(profiel: &[u8]) -> bool {
    let tekst = String::from_utf8_lossy(profiel);
    let Some(i) = tekst.find("<key>aps-environment</key>") else { return false };
    let rest = tekst[i + "<key>aps-environment</key>".len()..].trim_start();
    rest.starts_with("<string>development</string>")
}

#[cfg(test)]
mod tests {
    use super::is_ontwikkeling;

    #[test]
    fn omgeving_uit_het_profiel() {
        let dev = b"\x30\x80<plist><dict><key>aps-environment</key>\n\t\t<string>development</string></dict></plist>";
        let prod = b"<plist><dict><key>aps-environment</key><string>production</string></dict></plist>";
        assert!(is_ontwikkeling(dev));
        assert!(!is_ontwikkeling(prod));
        assert!(!is_ontwikkeling(b"geen profiel"));
    }
}
