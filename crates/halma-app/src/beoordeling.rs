//! De beoordelingsvraag van Apple in de iPhone-app (`SKStoreReviewController`). De webview roept dit
//! één keer aan, even na de eerste winst (zie `web/src/beoordeling.ts`). Apple beslist zelf of de vraag
//! echt verschijnt: in TestFlight en in een testversie altijd, in de winkel hoogstens een paar keer per jaar.
//! Op andere platforms geeft het commando een fout: daar is (nog) geen beoordelingsvraag.

/// Vraagt Apple om de standaardvraag voor een beoordeling te tonen (op de hoofddraad).
#[tauri::command]
pub async fn vraag_beoordeling<R: tauri::Runtime>(app: tauri::AppHandle<R>) -> Result<(), String> {
    #[cfg(target_os = "ios")]
    {
        app.run_on_main_thread(|| {
            // `requestReview` is vanaf iOS 18 als verouderd gemarkeerd (opvolger: `AppStore.requestReview(in:)`,
            // alleen Swift), maar werkt nog en kiest zelf de actieve scène.
            #[allow(deprecated)]
            unsafe {
                objc2_store_kit::SKStoreReviewController::requestReview();
            }
        })
        .map_err(|e| e.to_string())
    }
    #[cfg(not(target_os = "ios"))]
    {
        let _ = app;
        Err("Review prompts are not available in this app".into())
    }
}
