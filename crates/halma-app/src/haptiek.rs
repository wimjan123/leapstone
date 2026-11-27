//! Trillen bij Zetten en de beurt in de iPhone-app (taak 159), met de haptiek van het systeem
//! (`UIImpactFeedbackGenerator`). Dat werkt ook als de telefoon op stil staat. De webview roept dit aan
//! met een rijtje tikken (zie `web/src/trillen.ts`); op andere platforms geeft het commando een fout en
//! gebruikt de webview `navigator.vibrate`.

/// Tijd tussen twee tikken van één patroon.
#[cfg(target_os = "ios")]
const TUSSENPOOS: std::time::Duration = std::time::Duration::from_millis(90);

/// Geeft de tikken ("licht", "stevig" of "duidelijk") na elkaar; het commando wacht er niet op.
#[tauri::command]
pub fn haptiek<R: tauri::Runtime>(app: tauri::AppHandle<R>, tikken: Vec<String>) -> Result<(), String> {
    #[cfg(target_os = "ios")]
    {
        use objc2::MainThreadMarker;
        use objc2_ui_kit::{UIImpactFeedbackGenerator, UIImpactFeedbackStyle};

        std::thread::spawn(move || {
            for (i, tik) in tikken.into_iter().enumerate() {
                if i > 0 {
                    std::thread::sleep(TUSSENPOOS);
                }
                let stijl = match tik.as_str() {
                    "stevig" => UIImpactFeedbackStyle::Medium,
                    "duidelijk" => UIImpactFeedbackStyle::Heavy,
                    _ => UIImpactFeedbackStyle::Light,
                };
                let _ = app.run_on_main_thread(move || {
                    if let Some(mtm) = MainThreadMarker::new() {
                        // `initWithStyle:` is vanaf iOS 17.5 als verouderd gemarkeerd, maar werkt nog en
                        // hoeft geen weergave (view) te hebben.
                        #[allow(deprecated)]
                        let generator = UIImpactFeedbackGenerator::initWithStyle(mtm.alloc(), stijl);
                        generator.impactOccurred();
                    }
                });
            }
        });
        Ok(())
    }
    #[cfg(not(target_os = "ios"))]
    {
        let _ = (app, tikken);
        Err("Haptics are not available in this app".into())
    }
}
