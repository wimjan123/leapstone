//! Proef: het Sterbord in 3D met Bevy, als WebAssembly in een `<canvas>` van de web-app.
//!
//! - `vakken`, `vorm`, `textuur`: het bord (plekken van de vakken, mesh, textuur).
//! - `pion`, `steen`: de Steen (profiel en mesh, en de inkt van het teken op de kop).
//! - `camera`, `gebaren`: camera, vingers en het omrekenen van een tik naar een vak.
//! - `voorwerp`: knoppen als voorwerpen op de tafel (taak 178): vorm, plek op het scherm, indrukken.
//! - `overgang`: overgangen tussen schermen: voorwerpen die wegzakken en omhoog komen, huppende Stenen.
//! - `app` (feature `app`, alleen WebAssembly): de Bevy-app en wat TypeScript kan aanroepen.
//!
//! Spelregels staan alleen in `halma-core`. Dit bord tekent en meldt tikken; het beslist niets.

pub mod beweging;
pub mod camera;
pub mod gebaren;
pub mod hand;
pub mod kies;
pub mod lak;
pub mod overgang;
pub mod pion;
pub mod steen;
pub mod textuur;
pub mod vakken;
pub mod voorwerp;
pub mod vorm;

#[cfg(all(feature = "app", target_arch = "wasm32"))]
mod app;
