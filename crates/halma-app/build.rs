fn main() {
    // iPhone: Meldingen via Apple (APNs) vragen het recht `aps-environment`. `gen/apple` staat niet in Git,
    // dus zetten we het bij elke build in de entitlements. "development" geldt voor de testversie; bij het
    // exporteren voor de App Store maakt Xcode er "production" van.
    #[cfg(target_os = "macos")]
    if std::env::var("CARGO_CFG_TARGET_OS").as_deref() == Ok("ios") {
        tauri_plugin::mobile::update_entitlements(|e| {
            e.insert("aps-environment".into(), "development".into());
        })
        .expect("entitlements bijwerken mislukt");
    }
    // Google Play eist dat native code ook op telefoons met geheugenpagina's van 16 KB laadt.
    if std::env::var("CARGO_CFG_TARGET_OS").as_deref() == Ok("android") {
        println!("cargo:rustc-link-arg=-Wl,-z,max-page-size=16384");
    }
    tauri_build::build()
}
