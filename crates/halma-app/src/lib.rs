//! De native app Leapstone. Alle schermen en spelregels komen uit `web/` (Svelte + halma-core via WebAssembly).
//! Deze crate is de verpakking: een webview die `web/dist` toont, Uitnodigingslinks doorgeeft en op de
//! iPhone het apparaattoken voor Meldingen (APNs) ophaalt.

mod beoordeling;
mod haptiek;
mod meldingen;
mod puzzelmelding;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let app = tauri::Builder::default().plugin(tauri_plugin_deep_link::init());
    #[cfg(target_os = "ios")]
    let app = app.plugin(tauri_plugin_notifications::init());
    app.invoke_handler(tauri::generate_handler![
        meldingen::meldingen_toestemming,
        meldingen::apns_token,
        beoordeling::vraag_beoordeling,
        haptiek::haptiek,
        puzzelmelding::puzzelmelding_toestemming,
        puzzelmelding::puzzelmelding_plan
    ])
        .run(tauri::generate_context!())
        .expect("Leapstone starten mislukt");
}
