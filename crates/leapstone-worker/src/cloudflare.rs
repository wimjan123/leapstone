//! De koppeling met Cloudflare: de Worker, het Durable Object en zijn SQL.

use std::cell::{Cell, RefCell};
use std::rc::Rc;
use std::sync::Arc;

use halma_opslag::beheer::{self, BeheerVerzoek};
use halma_opslag::{Db, Fout, Klok, Opslag, Rij, Waarde};
use halma_push::apns::Apns;
use futures_util::StreamExt;
use halma_push::{Doel, Gevolg, Opruimer, PushVerzoek, Uitkomst, Vapid, verwerk_uitkomst};
use wasm_bindgen::JsCast;
use wasm_bindgen::prelude::*;
use worker::{
    Context, DurableObject, Env, Fetch, Headers, Method, Request, RequestInit, RequestRedirect, Response, ScheduledTime,
    SqlStorage, SqlStorageValue, State, WebSocket, WebSocketIncomingMessage, WebSocketPair,
    WebSocketRequestResponsePair, console_error, console_log, durable_object, event,
};

use crate::api::{self, Verzoek};
use crate::grens;
use crate::spel;
use crate::live::{self, Aangemeld, Gebeurtenis, Melding, OpBericht, Wacht};

/// De binding van het Durable Object in `wrangler.toml`.
const OPSLAG: &str = "OPSLAG";
/// Alle Spelers en Potjes staan in één Durable Object met deze naam.
const NAAM: &str = "leapstone";
/// Worker-secret met de geheime VAPID-sleutel (base64url). Zonder staan Meldingen uit.
const VAPID_SECRET: &str = "LEAPSTONE_VAPID_PRIVATE_KEY";
/// Worker-secrets met de APNs-sleutel van Apple (sleutel-id en de inhoud van het `.p8`-bestand).
/// Zonder staan Meldingen in de iPhone-app uit.
const APNS_KEY_ID_SECRET: &str = "APPLE_APNS_KEY_ID";
const APNS_SLEUTEL_SECRET: &str = "APPLE_APNS_PRIVATE_KEY";
/// Worker-secret met de sleutel van de beheerpagina `/beheer`. Zonder bestaat die pagina niet.
const BEHEER_SECRET: &str = "LEAPSTONE_BEHEER_SLEUTEL";

#[event(fetch)]
async fn fetch(req: Request, env: Env, _ctx: Context) -> worker::Result<Response> {
    let url = req.url()?;
    let host = url.host_str().unwrap_or_default().to_string();
    // www gaat met een 301 naar het hoofdadres. workers.dev blijft werken (apps, Uitnodigingen), zonder doorsturen.
    let lezen = matches!(req.method(), Method::Get | Method::Head);
    if let Some(doel) = spel::www_doel(&host, lezen, url.path(), url.query()) {
        return Response::redirect_with_status(doel.parse().map_err(|_| worker::Error::RustError("ongeldig adres".into()))?, 301);
    }
    let pad = url.path().to_string();
    let antwoord = afhandelen(req, env).await?;
    let mut extra: Vec<(&str, &str)> = Vec::new();
    // Een fout op /assets/* mag niet lang bewaard worden (taak 291): de _headers geven ook een 404 een jaar bewaartijd.
    if let Some(tijd) = spel::bewaartijd_van_fout(&pad, antwoord.status_code()) {
        extra.push(("Cache-Control", tijd));
    }
    let content_type = antwoord.headers().get("Content-Type")?;
    if spel::noindex(&host, content_type.as_deref()) {
        extra.push(("X-Robots-Tag", "noindex"));
    }
    if let Some(soort) = spel::html_met_charset(content_type.as_deref()) {
        extra.push(("Content-Type", soort));
    }
    if extra.is_empty() {
        return Ok(antwoord);
    }
    // De koppen van een antwoord uit de static assets zijn niet te wijzigen: maak een kopie met de extra koppen.
    let koppen = Headers::new();
    // Lengte en codering laat de runtime zelf opnieuw bepalen bij het versturen van de kopie.
    for (naam, waarde) in antwoord.headers().entries() {
        if !naam.eq_ignore_ascii_case("content-length") && !naam.eq_ignore_ascii_case("content-encoding") {
            koppen.set(&naam, &waarde)?;
        }
    }
    for (naam, waarde) in extra {
        koppen.set(naam, waarde)?;
    }
    Ok(antwoord.with_headers(koppen))
}

async fn afhandelen(mut req: Request, env: Env) -> worker::Result<Response> {
    let pad = req.path();
    if pad == "/.well-known/assetlinks.json" {
        // Vingerafdrukken van het tekencertificaat van de Android-app, komma-gescheiden. Zonder: een lege lijst.
        let vingers = env.var("HALMA_ASSETLINKS_SHA256").map(|v| v.to_string()).unwrap_or_default();
        let vingers: Vec<String> = vingers.split(',').map(str::to_string).collect();
        return Response::from_json(&halma_opslag::assetlinks_json(&vingers));
    }
    if pad == "/.well-known/apple-app-site-association" {
        // Zonder extensie: iOS wil dit adres precies zo, als JSON (from_json zet application/json).
        return Response::from_json(&halma_opslag::apple_app_site_association_json());
    }
    if beheer::is_beheer(&pad) {
        // De beheerpagina leest de opslag; het Durable Object controleert de sleutel. Eerst de teller per internetadres,
        // ook zonder sleutel, en zonder body: een actie heeft er geen nodig.
        if let Some(weigering) = weiger(&req, &env).await? {
            return Ok(weigering);
        }
        let stub = env.durable_object(OPSLAG)?.get_by_name(NAAM)?;
        return stub.fetch_with_request(kopie(&req, None)?).await;
    }
    if pad == "/api" || pad.starts_with("/api/") {
        if req.method() == Method::Options {
            let origin = req.headers().get("Origin")?;
            let mut r = Response::empty()?;
            zet_koppen(r.headers_mut(), api::cors_koppen(origin.as_deref(), true))?;
            return Ok(r);
        }
        if let Some(weigering) = weiger(&req, &env).await? {
            return Ok(weigering);
        }
        let stub = env.durable_object(OPSLAG)?.get_by_name(NAAM)?;
        if !grens::heeft_body(req.method().as_ref()) {
            // Ook de WebSocket van de live verbinding gaat zo door naar het Durable Object.
            return stub.fetch_with_request(req).await;
        }
        // De Worker leest de body zelf, met de grens: het gedeelde Durable Object krijgt nooit een te grote body.
        let body = match lees_begrensd(&mut req).await? {
            Some(body) => body,
            None => return weigering(&req, 413, grens::TE_GROOT),
        };
        return stub.fetch_with_request(kopie(&req, Some(&body))?).await;
    }
    if req.method() == Method::Get && spel::is_spel_adres(&pad) {
        // Zelfde adres voor de Speler (App Link, Melding), maar de inhoud is het spel.
        let mut url = req.url()?;
        url.set_path(spel::spel_pagina(&pad));
        url.set_query(None);
        return env.assets("ASSETS")?.fetch(url.to_string(), None).await;
    }
    let lezen = matches!(req.method(), Method::Get | Method::Head);
    let pagina = req.url()?;
    let antwoord = env.assets("ASSETS")?.fetch_request(req).await?;
    if lezen && spel::geeft_404_pagina(&pad, antwoord.status_code()) {
        // `not_found_handling = "none"` (taak 291): de assets geven een kale 404; de pagina 404.html geeft de Worker zelf.
        let mut url404 = pagina;
        url404.set_path("/404");
        url404.set_query(None);
        let pagina = env.assets("ASSETS")?.fetch(url404.to_string(), None).await?;
        if pagina.status_code() == 200 {
            return Ok(pagina.with_status(404));
        }
    }
    Ok(antwoord)
}

/// Een weigering van de Worker zelf, als JSON met de CORS-koppen.
fn weigering(req: &Request, status: u16, tekst: &str) -> worker::Result<Response> {
    let origin = req.headers().get("Origin")?;
    let mut r = Response::from_json(&serde_json::json!({ "fout": tekst }))?.with_status(status);
    zet_koppen(r.headers_mut(), api::cors_koppen(origin.as_deref(), false))?;
    Ok(r)
}

/// Leest de body met de grens van [`grens::MAX_VERZOEK_BYTES`]. `None`: te groot; het lezen stopt dan meteen.
async fn lees_begrensd(req: &mut Request) -> worker::Result<Option<Vec<u8>>> {
    let mut body = grens::BegrensdeBody::default();
    // Zonder body geeft `stream` een fout: dan is de body leeg.
    let Ok(mut stroom) = req.stream() else { return Ok(Some(Vec::new())) };
    while let Some(stuk) = stroom.next().await {
        if !body.voeg_toe(&stuk?) {
            return Ok(None);
        }
    }
    Ok(Some(body.bytes()))
}

/// Een kopie van het verzoek voor het Durable Object, met deze body (of zonder). De lengte zet de runtime zelf.
fn kopie(req: &Request, body: Option<&[u8]>) -> worker::Result<Request> {
    let koppen = Headers::new();
    for (naam, waarde) in req.headers().entries() {
        if !naam.eq_ignore_ascii_case("content-length") && !naam.eq_ignore_ascii_case("transfer-encoding") {
            koppen.set(&naam, &waarde)?;
        }
    }
    let mut init = RequestInit::new();
    init.with_method(req.method()).with_headers(koppen);
    if let Some(body) = body {
        init.with_body(Some(js_sys::Uint8Array::from(body).into()));
    }
    Request::new_with_init(req.url()?.as_str(), &init)
}

/// Weigert te grote en te veel verzoeken, vóór het Durable Object en vóór het lezen van de body.
/// Geeft `None` als het verzoek door mag.
async fn weiger(req: &Request, env: &Env) -> worker::Result<Option<Response>> {
    let antwoord = |status: u16, tekst: &str| weigering(req, status, tekst).map(Some);
    if grens::lengte_te_groot(req.headers().get("Content-Length")?.as_deref()) {
        return antwoord(413, grens::TE_GROOT);
    }
    let autorisatie = req.headers().get("Authorization")?;
    let ip = req.headers().get("CF-Connecting-IP")?;
    // Eerst de reserve per internetadres, dan de teller van de route. Een aanvaller die bij elk
    // verzoek een nieuwe verzonnen sleutel stuurt, krijgt wel steeds een nieuwe teller per Speler,
    // maar blijft op dezelfde reserve per internetadres lopen.
    for keuze in grens::controles(req.method().as_ref(), &req.path(), autorisatie.as_deref(), ip.as_deref()) {
        let binding = keuze.teller.binding();
        match env.rate_limiter(binding) {
            Ok(teller) => match teller.limit(keuze.sleutel).await {
                Ok(uitkomst) if !uitkomst.success => return antwoord(429, grens::TE_VEEL),
                Ok(_) => {}
                // Een storing in de teller mag het spelen niet stoppen.
                Err(e) => console_error!("teller {binding} mislukt: {e:?}"),
            },
            Err(e) => console_error!("teller {binding} ontbreekt: {e:?}"),
        }
    }
    Ok(None)
}

fn zet_koppen(h: &mut Headers, koppen: Vec<(&'static str, String)>) -> worker::Result<()> {
    for (naam, waarde) in koppen {
        h.set(naam, &waarde)?;
    }
    Ok(())
}

type Gedeeld = Rc<RefCell<Option<Opslag<DoDb>>>>;

/// Het Durable Object met de opslag. Het verwerkt één verzoek tegelijk; tussen het lezen van de
/// body en het antwoord staat geen `await`, dus een verzoek loopt in één keer door de opslag.
///
/// Live verbindingen zijn WebSockets die het object laten slapen: open verbindingen houden het
/// niet wakker (gratis plan). Een alarm op de eerstvolgende deadline slaat verlopen beurten over.
#[durable_object]
pub struct Opslagplaats {
    state: State,
    opslag: Gedeeld,
    vapid: Option<Rc<Vapid>>,
    /// De APNs-sleutel voor de iPhone-app.
    apns: Option<Rc<Apns>>,
    /// Het `sub` van VAPID: een adres waarop de pushdienst de beheerder kan vinden.
    subject: String,
    /// Het alarm is sinds het wakker worden al eens gezet.
    alarm_gezet: Cell<bool>,
    /// De sleutel van `/beheer`, uit een Worker-secret.
    beheer_sleutel: Option<String>,
}

impl DurableObject for Opslagplaats {
    fn new(state: State, env: Env) -> Self {
        // Cloudflare antwoordt zelf op `ping`, zonder het object te wekken.
        match WebSocketRequestResponsePair::new(live::PING, live::PONG) {
            Ok(paar) => state.set_websocket_auto_response(&paar),
            Err(e) => console_error!("ping-antwoord instellen mislukt: {e:?}"),
        }
        let vapid = env.secret(VAPID_SECRET).ok().and_then(|s| match Vapid::van_geheim_b64(&s.to_string()) {
            Ok(v) => Some(Rc::new(v)),
            Err(e) => {
                console_error!("VAPID-sleutel ongeldig: {e}");
                None
            }
        });
        let apns = match (env.secret(APNS_KEY_ID_SECRET), env.secret(APNS_SLEUTEL_SECRET)) {
            (Ok(id), Ok(pem)) => {
                match Apns::van_pem(&id.to_string(), halma_opslag::APPLE_TEAM, halma_opslag::PAKKET, &pem.to_string()) {
                    Ok(a) => Some(Rc::new(a)),
                    Err(e) => {
                        console_error!("APNs-sleutel ongeldig: {e}");
                        None
                    }
                }
            }
            _ => None,
        };
        let subject = env
            .var("LEAPSTONE_PUSH_SUBJECT")
            .map(|v| v.to_string())
            .unwrap_or_else(|_| "https://leapstone.visser-william.workers.dev".into());
        let beheer_sleutel = env.secret(BEHEER_SECRET).ok().map(|s| s.to_string());
        Opslagplaats { state, opslag: Rc::new(RefCell::new(None)), vapid, apns, subject, alarm_gezet: Cell::new(false), beheer_sleutel }
    }

    async fn fetch(&self, mut req: Request) -> worker::Result<Response> {
        let methode = req.method();
        let pad = req.path();
        if beheer::is_beheer(&pad) {
            return self.beheer(&req, &pad);
        }
        let pad = pad.strip_prefix("/api").unwrap_or(&pad).to_string();

        if let Some(potje_id) = live::live_potje(&pad) {
            let upgrade = req.headers().get("Upgrade")?.unwrap_or_default();
            if upgrade.eq_ignore_ascii_case("websocket") {
                // Aannemen met de tag van het Potje; de Speler meldt zich met het eerste bericht.
                let paar = WebSocketPair::new()?;
                self.state.accept_websocket_with_tags(&paar.server, &[&live::tag(potje_id)]);
                // Onthoud sinds wanneer hij openstaat: logt hij niet op tijd in, dan sluit het alarm hem.
                paar.server.serialize_attachment(Wacht { sinds_ms: js_sys::Date::now() as i64 })?;
                self.plan_alarm().await;
                return Response::from_websocket(paar.client);
            }
        }

        let autorisatie = req.headers().get("Authorization")?;
        let origin = req.headers().get("Origin")?;
        let body = if matches!(methode, Method::Get | Method::Head) { Vec::new() } else { req.bytes().await? };
        if grens::body_te_groot(&body) {
            // Een verzoek zonder Content-Length (chunked) komt hier alsnog langs.
            let mut r = Response::from_json(&serde_json::json!({ "fout": grens::TE_GROOT }))?.with_status(413);
            zet_koppen(r.headers_mut(), api::cors_koppen(origin.as_deref(), false))?;
            return Ok(r);
        }

        let vapid = self.vapid.as_deref();
        let apns = self.apns.is_some();
        let ip = req.headers().get("CF-Connecting-IP")?;
        let antwoord = self.met_opslag(|o| {
            // Eerst de precieze teller; een geweigerd verzoek komt niet bij de opslag.
            if let Some(geweigerd) = api::begrens(o, methode.as_ref(), &pad, ip.as_deref()) {
                return geweigerd;
            }
            let v = Verzoek { methode: methode.as_ref(), pad: &pad, autorisatie: autorisatie.as_deref(), body: &body };
            api::behandel(o, &v, vapid, apns)
        });
        let mut antwoord = match antwoord {
            Ok(a) => a,
            Err(f) => {
                console_error!("opslag openen mislukt: {f:?}");
                return Ok(Response::from_json(&serde_json::json!({ "fout": f.antwoord().1 }))?.with_status(500));
            }
        };
        if let Some(t) = &antwoord.log {
            console_error!("interne fout: {t}");
        }
        let gebeurtenissen = std::mem::take(&mut antwoord.gebeurtenissen);
        // Eerst de verbindingen met de oude sleutel dicht, dan pas de standen versturen.
        if let Some(speler_id) = antwoord.sluit_speler {
            self.sluit_verbindingen_van(speler_id);
        }
        self.verwerk(gebeurtenissen).await;
        if !self.alarm_gezet.get() {
            self.plan_alarm().await;
        }
        let mut r = match &antwoord.json {
            Some(j) => Response::from_json(j)?,
            None => Response::empty()?,
        }
        .with_status(antwoord.status);
        zet_koppen(r.headers_mut(), api::cors_koppen(origin.as_deref(), false))?;
        Ok(r)
    }

    async fn websocket_message(&self, ws: WebSocket, bericht: WebSocketIncomingMessage) -> worker::Result<()> {
        // Na het aanmelden stuurt de app niets meer dan `ping` (dat beantwoordt Cloudflare zelf, zonder dit object te wekken).
        // Al het andere sluit de verbinding: zo kan niemand het gedeelde object met berichten bezighouden.
        let aangemeld = ws.deserialize_attachment::<Aangemeld>().ok().flatten().is_some();
        let tekst = match bericht {
            WebSocketIncomingMessage::String(t) if live::op_bericht(aangemeld, true) == OpBericht::Aanmelden => t,
            _ => {
                let _ = ws.close(Some(live::SLUITCODE_ONVERWACHT), Some("Unexpected message"));
                return Ok(());
            }
        };
        let potje_id = self.state.get_tags(&ws).iter().find_map(|t| t.strip_prefix("potje:")?.parse::<i64>().ok());
        let Some(potje_id) = potje_id else {
            let _ = ws.close(Some(4404), Some("Unknown game"));
            return Ok(());
        };
        match self.met_opslag(|o| live::meld_aan(o, potje_id, &tekst)).and_then(|r| r) {
            Ok((aangemeld, eerste)) => {
                ws.serialize_attachment(aangemeld)?;
                ws.send_with_str(eerste)?;
                self.sluit_te_veel_van(aangemeld.speler_id);
            }
            Err(f) => {
                if let Fout::Intern(t) = &f {
                    console_error!("aanmelden live mislukt: {t}");
                }
                let _ = ws.close(Some(live::sluitcode(&f)), Some(f.antwoord().1));
            }
        }
        Ok(())
    }

    async fn websocket_close(&self, ws: WebSocket, _code: usize, _reden: String, _netjes: bool) -> worker::Result<()> {
        // De app sloot de verbinding; sluit onze kant ook (mag al dicht zijn).
        let _ = ws.close(Some(1000), Some("closed"));
        Ok(())
    }

    async fn websocket_error(&self, ws: WebSocket, _fout: worker::Error) -> worker::Result<()> {
        let _ = ws.close(Some(1011), Some("error"));
        Ok(())
    }

    /// De Denktijd van een of meer Potjes is op.
    async fn alarm(&self) -> worker::Result<Response> {
        self.sluit_zonder_inlog();
        match self.met_opslag(live::tik).and_then(|r| r) {
            Ok(g) => self.verwerk(g).await,
            Err(f) => console_error!("beurt overslaan mislukt: {f:?}"),
        }
        self.plan_alarm().await;
        Response::ok("")
    }
}

impl Opslagplaats {
    /// De beheerpagina (zie `halma_opslag::beheer`). Een actie heeft geen body nodig.
    fn beheer(&self, req: &Request, pad: &str) -> worker::Result<Response> {
        let url = req.url()?;
        // Het hele origin van dit verzoek (schema, host en poort), om met `Origin` te vergelijken.
        let eigen = url.host_str().map(|h| match url.port() {
            Some(p) => format!("{}://{h}:{p}", url.scheme()),
            None => format!("{}://{h}", url.scheme()),
        });
        let autorisatie = req.headers().get("Authorization")?;
        let origin = req.headers().get("Origin")?;
        let fetch_site = req.headers().get("Sec-Fetch-Site")?;
        let methode = req.method();
        let v = BeheerVerzoek {
            methode: methode.as_ref(),
            pad,
            autorisatie: autorisatie.as_deref(),
            zelfde_oorsprong: beheer::zelfde_oorsprong(origin.as_deref(), eigen.as_deref(), fetch_site.as_deref()),
        };
        let a = match self.met_opslag(|o| beheer::behandel_beheer(o, self.beheer_sleutel.as_deref(), &v)) {
            Ok(a) => a,
            Err(f) => {
                console_error!("opslag openen mislukt: {f:?}");
                return Ok(Response::error("Something went wrong on the server", 500)?);
            }
        };
        if let Some(t) = &a.log {
            console_error!("interne fout (beheer): {t}");
        }
        let mut r = Response::ok(a.body)?.with_status(a.status);
        zet_koppen(r.headers_mut(), a.koppen)?;
        Ok(r)
    }

    /// Voert `f` uit op de opslag. De eerste keer worden de migraties uitgevoerd.
    fn met_opslag<T>(&self, f: impl FnOnce(&mut Opslag<DoDb>) -> T) -> Result<T, Fout> {
        let mut slot = self.opslag.borrow_mut();
        if slot.is_none() {
            *slot = Some(Opslag::nieuw(DoDb::nieuw(&self.state), Arc::new(WorkerKlok))?);
        }
        Ok(f(slot.as_mut().expect("net gevuld")))
    }

    /// Sluit alle ingelogde verbindingen van een Speler (herstel of account verwijderd). Zoekt in alle
    /// open verbindingen: de Speler zit niet in de tags, maar wel in het bewaarde `Aangemeld`.
    fn sluit_verbindingen_van(&self, speler_id: i64) {
        let alle = self.state.get_websockets();
        let ingelogd: Vec<Option<Aangemeld>> = alle.iter().map(|ws| ws.deserialize_attachment::<Aangemeld>().ok().flatten()).collect();
        for i in live::te_sluiten_van_speler(&ingelogd, speler_id) {
            let _ = alle[i].close(Some(live::SLUITCODE_SLEUTEL_WEG), Some("Key no longer valid"));
        }
    }

    /// Een Speler houdt hooguit [`live::MAX_LIVE_PER_SPELER`] live verbindingen: de oudste daarboven gaan dicht.
    fn sluit_te_veel_van(&self, speler_id: i64) {
        let alle = self.state.get_websockets();
        let ingelogd: Vec<Option<Aangemeld>> = alle.iter().map(|ws| ws.deserialize_attachment::<Aangemeld>().ok().flatten()).collect();
        for i in live::te_veel_van_speler(&ingelogd, speler_id) {
            let _ = alle[i].close(Some(live::SLUITCODE_TE_VEEL), Some("Too many live connections"));
        }
    }

    /// De verbindingen die nog niet zijn ingelogd, met hun tijd.
    fn wachtend(&self) -> Vec<(WebSocket, Wacht)> {
        self.state
            .get_websockets()
            .into_iter()
            .filter_map(|ws| {
                let w = ws.deserialize_attachment::<Wacht>().ok().flatten()?;
                Some((ws, w))
            })
            .collect()
    }

    /// Sluit verbindingen die te lang op inloggen wachten.
    fn sluit_zonder_inlog(&self) {
        let (sockets, tijden): (Vec<_>, Vec<_>) = self.wachtend().into_iter().unzip();
        for i in live::te_sluiten_zonder_inlog(&tijden, js_sys::Date::now() as i64) {
            let _ = sockets[i].close(Some(live::SLUITCODE_INLOG_TE_LAAT), Some("Login timeout"));
        }
    }

    /// De live verbindingen van een Potje waarvan de Speler zich al heeft aangemeld.
    fn aangemeld(&self, potje_id: i64) -> Vec<(WebSocket, Aangemeld)> {
        self.state
            .get_websockets_with_tag(&live::tag(potje_id))
            .into_iter()
            .filter_map(|ws| {
                let a = ws.deserialize_attachment::<Aangemeld>().ok().flatten()?;
                Some((ws, a))
            })
            .collect()
    }

    /// Stuurt de gebeurtenissen naar de live verbindingen, verstuurt Meldingen op de achtergrond en
    /// zet het alarm opnieuw als er een nieuwe stand is.
    async fn verwerk(&self, gebeurtenissen: Vec<Gebeurtenis>) {
        if gebeurtenissen.is_empty() {
            return;
        }
        for g in &gebeurtenissen {
            let Some(potje_id) = g.potje_id() else { continue };
            let tekst = g.json();
            for (ws, a) in self.aangemeld(potje_id) {
                // Een Bericht van iemand die deze Speler blokkeerde, gaat niet over deze verbinding.
                if !g.voor(a.speler_id) {
                    continue;
                }
                // Een verbinding die net wegvalt is geen fout; de app haalt de stand dan zelf op.
                let _ = ws.send_with_str(&tekst);
            }
        }
        if self.vapid.is_some() || self.apns.is_some() {
            let is_live = |potje_id, speler_id| self.aangemeld(potje_id).iter().any(|(_, a)| a.speler_id == speler_id);
            let (web, apns) = (self.vapid.is_some(), self.apns.is_some());
            let meldingen = self.met_opslag(|o| live::meldingen(o, &gebeurtenissen, is_live, web, apns)).unwrap_or_default();
            if !meldingen.is_empty() {
                // Een mislukte Melding mag een Zet nooit hinderen: los van het antwoord versturen.
                let sleutels = Sleutels { vapid: self.vapid.clone(), apns: self.apns.clone(), subject: self.subject.clone() };
                self.state.wait_until(stuur_meldingen(self.opslag.clone(), sleutels, meldingen));
            }
        }
        if gebeurtenissen.iter().any(|g| matches!(g, Gebeurtenis::Stand { .. })) {
            self.plan_alarm().await;
        }
    }

    /// Zet het alarm op de eerstvolgende deadline, of haalt het weg als er geen is.
    async fn plan_alarm(&self) {
        let storage = self.state.storage();
        let wachtend: Vec<Wacht> = self.wachtend().into_iter().map(|(_, w)| w).collect();
        let gelukt = match self.met_opslag(|o| o.volgende_deadline()).and_then(|r| r).map(|d| live::alarm_tijd(d, &wachtend)) {
            Ok(Some(ms)) => storage.set_alarm(ScheduledTime::new(js_sys::Date::new(&JsValue::from_f64(ms as f64)))).await,
            Ok(None) => storage.delete_alarm().await,
            Err(f) => {
                console_error!("deadline lezen mislukt: {f:?}");
                return;
            }
        };
        match gelukt {
            Ok(()) => self.alarm_gezet.set(true),
            Err(e) => console_error!("alarm zetten mislukt: {e:?}"),
        }
    }
}

/// De sleutels om Meldingen te versturen.
struct Sleutels {
    vapid: Option<Rc<Vapid>>,
    apns: Option<Rc<Apns>>,
    /// Het `sub` van VAPID.
    subject: String,
}

async fn stuur_meldingen(opslag: Gedeeld, sleutels: Sleutels, meldingen: Vec<Melding>) {
    for m in meldingen {
        let nu_s = (js_sys::Date::now() / 1000.0) as u64;
        match m {
            Melding::Web { abonnement, inhoud } => {
                let Some(vapid) = &sleutels.vapid else { continue };
                let uitkomst = match halma_push::push_verzoek(vapid, &sleutels.subject, &abonnement, inhoud.as_bytes(), nu_s) {
                    Ok(v) => match stuur_push(v).await {
                        Ok((status, _)) => Uitkomst::van_status(status),
                        Err(e) => Uitkomst::Mislukt(format!("{e:?}")),
                    },
                    Err(e) => Uitkomst::Mislukt(e),
                };
                let mut opruimer = OpslagOpruimer(&opslag);
                if let Gevolg::Mislukt(e) = verwerk_uitkomst(uitkomst, Doel::Abonnement(&abonnement.endpoint), &mut opruimer) {
                    console_error!("melding versturen mislukt: {e}");
                }
            }
            Melding::Apns { token, melding } => {
                let Some(apns) = &sleutels.apns else { continue };
                let uitkomst = match stuur_push(apns.verzoek(&token.token, token.omgeving, &melding, nu_s)).await {
                    Ok((status, body)) => halma_push::apns::uitkomst(status, &body),
                    Err(e) => Uitkomst::Mislukt(format!("{e:?}")),
                };
                // Een korte regel in het log (zonder token of inhoud), zodat `wrangler tail` laat zien dat APNs antwoordde.
                let omgeving = token.omgeving.naam();
                let mut opruimer = OpslagOpruimer(&opslag);
                match verwerk_uitkomst(uitkomst, Doel::ApnsToken(&token.token), &mut opruimer) {
                    Gevolg::Verstuurd => console_log!("APNs {omgeving}: 200"),
                    Gevolg::Opgeruimd => console_log!("APNs {omgeving}: token geweigerd, opgeruimd"),
                    Gevolg::Mislukt(e) => console_error!("APNs-melding versturen mislukt ({omgeving}): {e}"),
                }
            }
        }
    }
}

/// Laat `halma_push` een verlopen Abonnement of token uit de Opslag wissen.
struct OpslagOpruimer<'a>(&'a Gedeeld);

impl Opruimer for OpslagOpruimer<'_> {
    fn ruim_abonnement_op(&mut self, endpoint: &str) {
        if let Some(o) = self.0.borrow_mut().as_mut() {
            let _ = o.ruim_abonnement_op(endpoint);
        }
    }
    fn ruim_apns_token_op(&mut self, token: &str) {
        if let Some(o) = self.0.borrow_mut().as_mut() {
            let _ = o.ruim_apns_token_op(token);
        }
    }
}

/// Verstuurt één push-verzoek. Geeft de status en de body van het antwoord.
async fn stuur_push(v: PushVerzoek) -> worker::Result<(u16, String)> {
    let koppen = Headers::new();
    for (naam, waarde) in &v.koppen {
        koppen.set(naam, waarde)?;
    }
    let body: JsValue = js_sys::Uint8Array::from(v.body.as_slice()).into();
    let mut init = RequestInit::new();
    init.with_method(Method::Post).with_headers(koppen).with_redirect(RequestRedirect::Manual).with_body(Some(body));
    let mut antwoord = Fetch::Request(Request::new_with_init(&v.endpoint, &init)?).send().await?;
    let status = antwoord.status_code();
    let body = antwoord.text().await.unwrap_or_default();
    Ok((status, body))
}

/// De klok van de Worker.
struct WorkerKlok;

impl Klok for WorkerKlok {
    fn nu_ms(&self) -> i64 {
        js_sys::Date::now() as i64
    }
}

/// De SQL van het Durable Object (SQLite) achter de trait van `halma-opslag`.
struct DoDb {
    sql: SqlStorage,
    /// `ctx.storage` zelf, voor `transactionSync` (workers-rs heeft daar geen functie voor).
    opslag: JsValue,
}

impl DoDb {
    fn nieuw(state: &State) -> DoDb {
        let storage = state.storage();
        let opslag: &JsValue = storage.as_raw().as_ref();
        DoDb { sql: storage.sql(), opslag: opslag.clone() }
    }
}

fn intern(e: impl std::fmt::Debug) -> Fout {
    Fout::Intern(format!("{e:?}"))
}

fn naar_sql(w: &Waarde) -> SqlStorageValue {
    match w {
        Waarde::Leeg => SqlStorageValue::Null,
        Waarde::Getal(g) => SqlStorageValue::Integer(*g),
        Waarde::Kommagetal(g) => SqlStorageValue::Float(*g),
        Waarde::Tekst(t) => SqlStorageValue::String(t.clone()),
    }
}

fn van_sql(w: SqlStorageValue) -> Result<Waarde, Fout> {
    Ok(match w {
        SqlStorageValue::Null => Waarde::Leeg,
        SqlStorageValue::Boolean(b) => Waarde::Getal(b.into()),
        SqlStorageValue::Integer(g) => Waarde::Getal(g),
        SqlStorageValue::Float(g) => Waarde::Kommagetal(g),
        SqlStorageValue::String(t) => Waarde::Tekst(t),
        SqlStorageValue::Blob(_) => return Err(Fout::Intern("onverwachte blob".into())),
    })
}

impl Db for DoDb {
    fn rijen(&self, sql: &str, params: &[Waarde]) -> Result<Vec<Rij>, Fout> {
        let cursor = self.sql.exec(sql, params.iter().map(naar_sql).collect::<Vec<_>>()).map_err(intern)?;
        // Altijd alles lezen, zodat de opdracht zeker helemaal is uitgevoerd.
        cursor
            .raw()
            .map(|rij| Ok(Rij(rij.map_err(intern)?.into_iter().map(van_sql).collect::<Result<_, _>>()?)))
            .collect()
    }

    fn script(&self, sql: &str) -> Result<(), Fout> {
        let cursor = self.sql.exec(sql, None::<Vec<SqlStorageValue>>).map_err(intern)?;
        for rij in cursor.raw() {
            rij.map_err(intern)?;
        }
        Ok(())
    }

    fn transactie<T>(&self, f: impl FnOnce() -> Result<T, Fout>) -> Result<T, Fout> {
        let mut f = Some(f);
        let mut uitkomst: Option<Result<T, Fout>> = None;
        let gelukt = {
            let mut stap = || -> Result<(), JsValue> {
                let r = f.take().map_or_else(|| Err(Fout::Intern("transactie twee keer gestart".into())), |f| f());
                let fout = r.is_err();
                uitkomst = Some(r);
                // Een fout gooien laat transactionSync alles terugdraaien.
                if fout { Err(JsValue::from_str("terugdraaien")) } else { Ok(()) }
            };
            let stap: &mut dyn FnMut() -> Result<(), JsValue> = &mut stap;
            // SAFETY: transactionSync roept de functie alleen synchroon aan, binnen deze aanroep.
            // De JavaScript-functie verdwijnt met `closure` aan het eind van dit blok, dus de
            // geleende waarden leven langer dan elk gebruik.
            let stap: &'static mut dyn FnMut() -> Result<(), JsValue> = unsafe { std::mem::transmute(stap) };
            let closure = Closure::<dyn FnMut() -> Result<(), JsValue>>::new(move || stap());
            let functie = js_sys::Reflect::get(&self.opslag, &JsValue::from_str("transactionSync"))
                .ok()
                .and_then(|f| f.dyn_into::<js_sys::Function>().ok())
                .ok_or_else(|| Fout::Intern("transactionSync ontbreekt".into()))?;
            functie.call1(&self.opslag, closure.as_ref().unchecked_ref())
        };
        match (gelukt, uitkomst) {
            (Ok(_), Some(r)) => r,
            (Err(_), Some(Err(f))) => Err(f),
            (Err(e), _) => Err(intern(e)),
            (Ok(_), None) => Err(Fout::Intern("transactie liep niet".into())),
        }
    }

    fn schema_versie(&self) -> Result<i64, Fout> {
        // PRAGMA user_version mag niet in een Durable Object; de versie staat in een eigen tabel.
        self.script("CREATE TABLE IF NOT EXISTS schema_versie (versie INTEGER NOT NULL)")?;
        Ok(match self.rij("SELECT versie FROM schema_versie", &[])? {
            Some(r) => r.i64(0)?,
            None => 0,
        })
    }

    fn zet_schema_versie(&self, versie: i64) -> Result<(), Fout> {
        self.voer_uit("DELETE FROM schema_versie", &[])?;
        self.voer_uit("INSERT INTO schema_versie (versie) VALUES (?1)", &[Waarde::Getal(versie)])
    }
}
