//! De server van Leapstone als Cloudflare Worker.
//!
//! - `/api/*` gaat naar één Durable Object met SQLite: daar staat alle opslag (`halma-opslag`).
//! - `/api/potjes/{id}/live` is een WebSocket die het Durable Object laat slapen (`live.rs`).
//! - Een alarm van het Durable Object slaat een beurt over als de Denktijd op is.
//! - `/.well-known/assetlinks.json` en `/.well-known/apple-app-site-association` maakt de Worker zelf.
//! - Het spel (de web-app) staat op `/play/`; `/uitnodiging/<code>` en `/potje/<id>` geven dezelfde web-app (`spel.rs`).
//! - Al het andere zijn static assets (`/` wordt de Landingspagina, `/privacy` en `/terms`).

pub mod api;
#[cfg(target_arch = "wasm32")]
mod cloudflare;
pub mod grens;
pub mod live;
pub mod spel;
