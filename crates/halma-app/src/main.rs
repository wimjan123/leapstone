// Verberg het consolevenster in release-builds op Windows.
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    halma_app_lib::run()
}
