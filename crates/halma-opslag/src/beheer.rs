//! De beheerpagina `/beheer` voor William: open Rapporten, en per Rapport het Bericht verbergen,
//! de Speler weren of het Rapport sluiten.
//!
//! Alleen met de geheime beheersleutel (Worker-secret `LEAPSTONE_BEHEER_SLEUTEL`). De browser vraagt
//! erom via HTTP Basic: de gebruikersnaam doet er niet toe, het wachtwoord is de sleutel. Zonder
//! ingestelde sleutel bestaat de pagina niet (404). De pagina is gewone HTML van de server, zonder
//! JavaScript en zonder iets van buiten. Een actie is een formulier (POST) en mag alleen van de
//! eigen pagina komen, zodat een andere website de ingelogde browser niets kan laten doen.

use base64::Engine;
use base64::engine::general_purpose::STANDARD;

use crate::tellers::{SpelerRegel, Tel, WeekTelling};
use crate::{Db, Fout, Opslag, RapportRegel};

/// Een verzoek aan `/beheer`.
pub struct BeheerVerzoek<'a> {
    pub methode: &'a str,
    /// Het hele pad, zoals `/beheer` of `/beheer/rapporten/3/sluit`.
    pub pad: &'a str,
    /// De header `Authorization`, als die er is.
    pub autorisatie: Option<&'a str>,
    /// Het verzoek komt van een pagina op dit adres (zie [`zelfde_oorsprong`]).
    pub zelfde_oorsprong: bool,
}

/// Het antwoord: status, koppen en HTML.
#[derive(Debug, PartialEq)]
pub struct BeheerAntwoord {
    pub status: u16,
    pub koppen: Vec<(&'static str, String)>,
    pub body: String,
    /// Een interne fout voor het log; nooit op de pagina.
    pub log: Option<String>,
}

/// Is dit pad voor de beheerpagina?
pub fn is_beheer(pad: &str) -> bool {
    pad == "/beheer" || pad.starts_with("/beheer/")
}

/// Komt het verzoek van een pagina op hetzelfde adres? `origin` is de header `Origin`, `eigen` de
/// origin van het verzoek zelf (schema, host en poort, zoals `https://leapstone.example`),
/// `fetch_site` de header `Sec-Fetch-Site` (een pagina kan die niet zelf zetten). Het hele origin telt,
/// dus http tegen https is een ander adres. Zonder beide is het antwoord nee: een browser stuurt ze bij een POST.
pub fn zelfde_oorsprong(origin: Option<&str>, eigen: Option<&str>, fetch_site: Option<&str>) -> bool {
    if fetch_site.is_some_and(|s| s.eq_ignore_ascii_case("same-origin")) {
        return true;
    }
    match (origin, eigen) {
        (Some(o), Some(e)) => o.contains("://") && !e.is_empty() && o.eq_ignore_ascii_case(e),
        _ => false,
    }
}

/// Behandelt één verzoek aan `/beheer`. `sleutel` is de beheersleutel; zonder bestaat de pagina niet.
pub fn behandel_beheer<D: Db>(o: &mut Opslag<D>, sleutel: Option<&str>, v: &BeheerVerzoek) -> BeheerAntwoord {
    let Some(sleutel) = sleutel.filter(|s| !s.trim().is_empty()) else {
        return tekst(404, "Not found");
    };
    if !toegang(v.autorisatie, sleutel.trim()) {
        let mut a = tekst(401, "Unauthorized");
        a.koppen.push(("WWW-Authenticate", r#"Basic realm="Leapstone beheer", charset="UTF-8""#.into()));
        return a;
    }
    let delen: Vec<&str> = v.pad.trim_matches('/').split('/').collect();
    let uitkomst = match (v.methode, delen.as_slice()) {
        ("GET", ["beheer"]) => (|| Ok(pagina(&o.open_rapporten()?, o.aantal_open_rapporten()?, &o.tellers()?, &o.speler_regels()?)))(),
        // Alleen getallen, voor de agent: geen Spelersnamen, geen id's, geen Berichten.
        ("GET", ["beheer", "tellers.json"]) => {
            return match (o.tellers(), o.aantal_open_rapporten()) {
                (Ok(weken), Ok(open_rapporten)) => BeheerAntwoord {
                    status: 200,
                    koppen: vec![
                        ("Content-Type", "application/json; charset=utf-8".into()),
                        ("Cache-Control", "no-store".into()),
                        ("X-Robots-Tag", "noindex".into()),
                    ],
                    body: serde_json::json!({ "weken": weken, "open_rapporten": open_rapporten }).to_string(),
                    log: None,
                },
                (Err(f), _) | (_, Err(f)) => fout(&f),
            };
        }
        ("POST", ["beheer", "spelers", id, "test"]) => {
            if !v.zelfde_oorsprong {
                return tekst(403, "Forbidden");
            }
            let Ok(id) = id.parse::<i64>() else { return tekst(404, "Not found") };
            return match o.wissel_test(id) {
                Ok(()) => terug(),
                Err(f) => fout(&f),
            };
        }
        ("POST", ["beheer", "rapporten", id, actie]) => {
            if !v.zelfde_oorsprong {
                return tekst(403, "Forbidden");
            }
            let Ok(id) = id.parse::<i64>() else { return tekst(404, "Not found") };
            let gedaan = match *actie {
                "verberg" => o.verberg_bericht(id),
                "weer" => o.weer_speler(id),
                "sluit" => o.sluit_rapport(id),
                _ => return tekst(404, "Not found"),
            };
            return match gedaan {
                Ok(()) => terug(),
                Err(f) => fout(&f),
            };
        }
        _ => return tekst(404, "Not found"),
    };
    match uitkomst {
        Ok(html) => BeheerAntwoord { status: 200, koppen: html_koppen(), body: html, log: None },
        Err(f) => fout(&f),
    }
}

/// Terug naar de lijst; verversen stuurt het formulier niet opnieuw.
fn terug() -> BeheerAntwoord {
    BeheerAntwoord {
        status: 303,
        koppen: vec![("Location", "/beheer".into()), ("Cache-Control", "no-store".into())],
        body: String::new(),
        log: None,
    }
}

/// Basic (wachtwoord is de sleutel) of Bearer, vergeleken in constante tijd.
fn toegang(autorisatie: Option<&str>, sleutel: &str) -> bool {
    let Some(a) = autorisatie.map(str::trim) else { return false };
    let gegeven = if let Some(b) = a.strip_prefix("Basic ") {
        let Ok(bytes) = STANDARD.decode(b.trim()) else { return false };
        let Ok(t) = String::from_utf8(bytes) else { return false };
        match t.split_once(':') {
            Some((_, wachtwoord)) => wachtwoord.to_string(),
            None => return false,
        }
    } else if let Some(b) = a.strip_prefix("Bearer ") {
        b.trim().to_string()
    } else {
        return false;
    };
    gelijk(gegeven.as_bytes(), sleutel.as_bytes())
}

fn gelijk(a: &[u8], b: &[u8]) -> bool {
    // Altijd alle bytes vergelijken, zodat de tijd niets verraadt over hoe ver het klopte.
    let mut verschil = a.len() ^ b.len();
    for i in 0..a.len().max(b.len()) {
        verschil |= usize::from(a.get(i).copied().unwrap_or(0) ^ b.get(i).copied().unwrap_or(0xff));
    }
    verschil == 0
}

fn tekst(status: u16, t: &str) -> BeheerAntwoord {
    BeheerAntwoord {
        status,
        koppen: vec![
            ("Content-Type", "text/plain; charset=utf-8".into()),
            ("Cache-Control", "no-store".into()),
            ("X-Robots-Tag", "noindex".into()),
        ],
        body: t.to_string(),
        log: None,
    }
}

fn fout(f: &Fout) -> BeheerAntwoord {
    let (status, t) = f.antwoord();
    let mut a = tekst(status, &t);
    if let Fout::Intern(i) = f {
        a.log = Some(i.clone());
    }
    a
}

fn html_koppen() -> Vec<(&'static str, String)> {
    vec![
        ("Content-Type", "text/html; charset=utf-8".into()),
        ("Cache-Control", "no-store".into()),
        (
            "Content-Security-Policy",
            "default-src 'none'; style-src 'unsafe-inline'; font-src 'self'; img-src 'self'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'".into(),
        ),
        // Niet `no-referrer`: dan stuurt de browser `Origin: null` bij het formulier en weigert de actie.
        ("Referrer-Policy", "same-origin".into()),
        ("X-Content-Type-Options", "nosniff".into()),
        ("X-Robots-Tag", "noindex".into()),
    ]
}

/// Maakt tekst veilig voor HTML.
fn esc(t: &str) -> String {
    let mut uit = String::with_capacity(t.len());
    for c in t.chars() {
        match c {
            '&' => uit.push_str("&amp;"),
            '<' => uit.push_str("&lt;"),
            '>' => uit.push_str("&gt;"),
            '"' => uit.push_str("&quot;"),
            '\'' => uit.push_str("&#39;"),
            c => uit.push(c),
        }
    }
    uit
}

/// Seconden sinds 1970 als `2026-11-05 14:03 UTC`.
pub fn tijd_utc(s: i64) -> String {
    let dagen = s.div_euclid(86_400);
    let rest = s.rem_euclid(86_400);
    // Van dagen naar datum (algoritme van Howard Hinnant, civil_from_days).
    let z = dagen + 719_468;
    let era = z.div_euclid(146_097);
    let doe = z - era * 146_097;
    let yoe = (doe - doe / 1460 + doe / 36_524 - doe / 146_096) / 365;
    let doy = doe - (365 * yoe + yoe / 4 - yoe / 100);
    let mp = (5 * doy + 2) / 153;
    let dag = doy - (153 * mp + 2) / 5 + 1;
    let maand = if mp < 10 { mp + 3 } else { mp - 9 };
    let jaar = yoe + era * 400 + i64::from(maand <= 2);
    format!("{jaar:04}-{maand:02}-{dag:02} {:02}:{:02} UTC", rest / 3600, rest % 3600 / 60)
}

/// Lijn-iconen zoals in de app (`Icoon.svelte`): 24×24, lijn 1,5.
fn icoon(paden: &[&str]) -> String {
    let p: String = paden.iter().map(|d| format!(r#"<path d="{d}"/>"#)).collect();
    format!(r#"<svg viewBox="0 0 24 24" aria-hidden="true">{p}</svg>"#)
}

const VERBERG: &[&str] = &[
    "M3.5 12s3-5.5 8.5-5.5S20.5 12 20.5 12s-3 5.5-8.5 5.5S3.5 12 3.5 12Z",
    "M12 9.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z",
    "M5 5l14 14",
];
const WEER: &[&str] = &["M12 3.75a8.25 8.25 0 1 0 0 16.5 8.25 8.25 0 0 0 0-16.5Z", "M6.2 6.2l11.6 11.6"];
const SLUIT: &[&str] = &["M5 12.5 9.5 17 19 7.5"];
const LEEG: &[&str] = &["M12 3.75 18.75 6.2v5.3c0 4-2.7 7-6.75 8.75-4.05-1.75-6.75-4.75-6.75-8.75V6.2Z", "M9.25 12l2 2 3.5-3.75"];

fn knop(id: i64, actie: &str, label: &str, paden: &[&str], uit: bool) -> String {
    let uit = if uit { " disabled" } else { "" };
    format!(
        r#"<form method="post" action="/beheer/rapporten/{id}/{actie}"><button type="submit"{uit}>{}<span>{label}</span></button></form>"#,
        icoon(paden)
    )
}

fn regel(r: &RapportRegel) -> String {
    let bericht = match &r.tekst {
        Some(t) => format!(r#"<blockquote{}>{}</blockquote>"#, if r.bericht_verborgen { r#" class="weg""# } else { "" }, esc(t)),
        None => r#"<p class="geen">Player report, no message</p>"#.to_string(),
    };
    let geweerd = if r.speler_geweerd { r#"<span class="pil">banned</span>"# } else { "" };
    let verborgen = if r.bericht_verborgen { r#"<span class="pil">hidden</span>"# } else { "" };
    format!(
        r#"<li>
  <div class="kop"><strong>{naam}</strong>{geweerd}{verborgen}<time>{tijd}</time></div>
  {bericht}
  <p class="meta">Reported by <b>{melder}</b> · game <span class="mono">{potje}</span> · player <span class="mono">{speler}</span></p>
  <div class="acties">{verberg}{weer}{sluit}</div>
</li>"#,
        naam = esc(&r.spelersnaam),
        tijd = tijd_utc(r.tijd),
        melder = esc(&r.melder),
        potje = r.potje_id,
        speler = r.speler_id,
        verberg = knop(r.id, "verberg", "Hide", VERBERG, r.bericht_id.is_none() || r.bericht_verborgen),
        weer = knop(r.id, "weer", "Ban", WEER, r.speler_geweerd),
        sluit = knop(r.id, "sluit", "Close", SLUIT, false),
    )
}

fn tel_cel(t: &Tel) -> String {
    let test = if t.waarvan_test > 0 { format!("<small>{} test</small>", t.waarvan_test) } else { String::new() };
    format!(r#"<td><b class="mono">{}</b>{test}</td>"#, t.totaal)
}

fn tellers_html(weken: &[WeekTelling]) -> String {
    let rijen: String = weken
        .iter()
        .enumerate()
        .map(|(i, w)| {
            let label = if i == 0 { r#"<small>this week</small>"# } else { "" };
            format!(
                r#"<tr><th scope="row"><span class="mono">{}</span>{label}</th><td><b class="mono">{}</b></td>{}{}{}</tr>"#,
                &w.week_begin[5..],
                w.nieuwe_spelers,
                tel_cel(&w.gestart),
                tel_cel(&w.uitgespeeld),
                tel_cel(&w.gestopt),
            )
        })
        .collect();
    format!(
        r#"<section><h2>Per week</h2>
<table><thead><tr><th scope="col">Week of</th><th scope="col">New players</th><th scope="col">Started</th><th scope="col">Finished</th><th scope="col">Stopped</th></tr></thead><tbody>{rijen}</tbody></table>
<p class="noot">Monday to Sunday, UTC. Games with real players only; "test" counts those that also had a test player.</p></section>"#
    )
}

const TEST: &[&str] = &["M9.5 3.75h5M10.25 3.75v5.5L5.6 17.9a1.6 1.6 0 0 0 1.4 2.35h10a1.6 1.6 0 0 0 1.4-2.35L13.75 9.25v-5.5", "M7.5 14.5h9"];

fn speler_regel(s: &SpelerRegel) -> String {
    let test = if s.test { r#"<span class="pil test">test</span>"# } else { "" };
    let aan = if s.test { " aan" } else { "" };
    format!(
        r#"<li>
  <div class="kop"><strong>{naam}</strong>{test}<time>{sinds}</time></div>
  <p class="meta">Played <b class="mono">{gespeeld}</b> · finished <b class="mono">{uitgespeeld}</b></p>
  <div class="acties"><form method="post" action="/beheer/spelers/{id}/test"><button type="submit" class="{aan}" aria-pressed="{pressed}">{icoon}<span>Test</span></button></form></div>
</li>"#,
        naam = esc(&s.spelersnaam),
        sinds = tijd_utc(s.sinds),
        gespeeld = s.gespeeld,
        uitgespeeld = s.uitgespeeld,
        id = s.id,
        pressed = s.test,
        icoon = icoon(TEST),
    )
}

fn spelers_html(spelers: &[SpelerRegel]) -> String {
    let lijst = if spelers.is_empty() {
        r#"<p class="geen">No players yet</p>"#.to_string()
    } else {
        format!("<ul>{}</ul>", spelers.iter().map(speler_regel).collect::<String>())
    };
    format!(r#"<section><h2>Players</h2>{lijst}</section>"#)
}

/// `rapporten`: de nieuwste open Rapporten (hooguit [`crate::MAX_RAPPORTEN_OP_PAGINA`]); `aantal`: alle open Rapporten.
fn pagina(rapporten: &[RapportRegel], aantal: i64, weken: &[WeekTelling], spelers: &[SpelerRegel]) -> String {
    let lijst = if rapporten.is_empty() {
        format!(r#"<div class="leeg">{}<p>No open reports</p></div>"#, icoon(LEEG))
    } else {
        // Meer open dan op de pagina: sluit er een paar, dan komen de oudere vanzelf in beeld.
        let meer = if aantal > rapporten.len() as i64 {
            format!(r#"<p class="geen">Showing the newest {} of {aantal}</p>"#, rapporten.len())
        } else {
            String::new()
        };
        format!(r#"<ul>{}</ul>{meer}"#, rapporten.iter().map(regel).collect::<String>())
    };
    format!(
        r#"<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="color-scheme" content="dark">
<meta name="robots" content="noindex">
<title>Admin · Leapstone</title>
<style>{STIJL}</style>
</head>
<body>
<main>
{tellers}
<section><header><h1>Reports</h1><span class="mono aantal" aria-label="{n} open">{n}</span></header>
{lijst}</section>
{spelers}
</main>
</body>
</html>"#,
        n = aantal,
        tellers = tellers_html(weken),
        spelers = spelers_html(spelers),
    )
}

const STIJL: &str = r#"
@font-face{font-family:"Archivo";src:url("/fonts/archivo.woff2") format("woff2");font-weight:200 600;font-stretch:100% 125%;font-display:swap}
@font-face{font-family:"Martian Mono";src:url("/fonts/martian-mono.woff2") format("woff2");font-weight:300 500;font-stretch:87.5% 100%;font-display:swap}
:root{--grond:#0b0d10;--vlak-1:#12151a;--vlak-3:#222730;--lijn:rgb(214 222 235/.1);--lijn-sterk:rgb(214 222 235/.2);--lijn-fel:rgb(214 222 235/.42);--tekst:#e9ecf0;--zacht:#a0a7b2;--stil:#737b87;--fout:#ff9d8c;color-scheme:dark}
*{box-sizing:border-box}
body{margin:0;min-height:100dvh;background:radial-gradient(120% 60% at 50% 0,rgb(150 170 200/.11),transparent 70%),var(--grond);color:var(--tekst);font:400 1rem/1.4 "Archivo",system-ui,sans-serif;-webkit-font-smoothing:antialiased;padding:max(28px,env(safe-area-inset-top)) 16px max(40px,env(safe-area-inset-bottom))}
main{max-width:640px;margin:0 auto}
section{margin:0 0 36px}
h2{margin:0 0 12px;font-size:.72rem;font-weight:400;font-stretch:125%;letter-spacing:.28em;text-transform:uppercase;color:var(--zacht);text-align:center;padding-left:.28em}
table{width:100%;border-collapse:collapse;border-radius:3px;box-shadow:inset 0 0 0 1px var(--lijn-sterk);background:rgb(11 13 16/.6)}
th,td{padding:10px 8px;text-align:right;vertical-align:top;font-weight:400}
thead th{font-size:.62rem;letter-spacing:.06em;text-transform:uppercase;color:var(--stil);vertical-align:bottom;line-height:1.2}
tbody tr+tr,thead tr{box-shadow:inset 0 1px 0 var(--lijn)}
th[scope=row]{text-align:left;font-size:.72rem;color:var(--zacht)}
td b{font-weight:400}
td small,th small{display:block;font-size:.62rem;color:var(--stil);letter-spacing:.04em}
.noot{margin:10px 2px 0;font-size:.74rem;color:var(--stil)}
.pil.test{color:var(--zacht);box-shadow:inset 0 0 0 1px var(--lijn-fel)}
button.aan{background:var(--vlak-3);box-shadow:inset 0 0 0 1px var(--lijn-fel)}
header{display:flex;align-items:center;justify-content:center;gap:12px;padding:4px 0 24px}
h1{margin:0;font-size:.82rem;font-weight:400;font-stretch:125%;letter-spacing:.32em;text-transform:uppercase;padding-left:.32em}
.mono{font-family:"Martian Mono",ui-monospace,monospace;font-variant-numeric:tabular-nums slashed-zero;font-weight:300}
.aantal{font-size:.72rem;color:var(--zacht);padding:2px 8px;border-radius:11px;box-shadow:inset 0 0 0 1px var(--lijn-sterk)}
ul{list-style:none;margin:0;padding:0;border-radius:3px;box-shadow:inset 0 0 0 1px var(--lijn-sterk);background:rgb(11 13 16/.6)}
li{padding:16px;display:flex;flex-direction:column;gap:10px}
li+li{box-shadow:inset 0 1px 0 var(--lijn-sterk)}
.kop{display:flex;align-items:center;gap:8px;min-width:0}
.kop strong{font-weight:450;font-size:1.05rem;overflow-wrap:anywhere}
.kop time{margin-left:auto;flex:none;font:300 .68rem "Martian Mono",ui-monospace,monospace;color:var(--stil)}
.pil{font-size:.68rem;letter-spacing:.08em;text-transform:uppercase;color:var(--fout);padding:1px 7px;border-radius:11px;box-shadow:inset 0 0 0 1px rgb(255 157 140/.4)}
blockquote{margin:0;padding:9px 13px;border-radius:2px 12px 12px 12px;background:var(--vlak-3);box-shadow:inset 0 0 0 1px var(--lijn);white-space:pre-wrap;overflow-wrap:anywhere;align-self:flex-start;max-width:100%}
blockquote.weg{opacity:.45;text-decoration:line-through;text-decoration-color:var(--stil)}
.geen{margin:0;color:var(--stil);font-size:.9rem}
.meta{margin:0;font-size:.82rem;color:var(--zacht)}
.meta b{font-weight:450;color:var(--tekst)}
.acties{display:flex;gap:8px}
form{margin:0}
button{display:flex;align-items:center;gap:7px;height:40px;padding:0 14px 0 11px;border:0;border-radius:3px;background:rgb(20 24 30/.55);box-shadow:inset 0 0 0 1px var(--lijn-sterk);color:var(--tekst);font:450 .9rem "Archivo",system-ui,sans-serif;cursor:pointer}
button:hover:not(:disabled){box-shadow:inset 0 0 0 1px var(--lijn-fel)}
button:active:not(:disabled){transform:scale(.97)}
button:disabled{opacity:.32;cursor:default}
button:focus-visible{outline:2px solid var(--tekst);outline-offset:2px}
svg{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round}
.leeg{display:flex;flex-direction:column;align-items:center;gap:10px;padding:56px 0;color:var(--stil)}
.leeg svg{width:36px;height:36px}
.leeg p{margin:0;font-size:.9rem}
"#;

#[cfg(all(test, feature = "rusqlite"))]
mod tests {
    use super::*;
    use crate::{NieuwRapport, SqliteOpslag};

    const SLEUTEL: &str = "geheim-123";

    fn basic(wachtwoord: &str) -> String {
        format!("Basic {}", STANDARD.encode(format!("william:{wachtwoord}")))
    }

    fn vraag(o: &mut SqliteOpslag, sleutel: Option<&str>, methode: &str, pad: &str, auth: Option<&str>, zelfde: bool) -> BeheerAntwoord {
        behandel_beheer(o, sleutel, &BeheerVerzoek { methode, pad, autorisatie: auth, zelfde_oorsprong: zelfde })
    }

    /// Ann rapporteert een Bericht van Bob. Geeft (opslag, Bob, rapport-id).
    fn met_rapport() -> (SqliteOpslag, i64, i64) {
        let mut o = SqliteOpslag::in_geheugen().unwrap();
        let ann = o.maak_speler("Ann").unwrap();
        let bob = o.maak_speler("Bob <script>").unwrap();
        let p = o.maak_potje(ann.speler_id, "ster", 2, None).unwrap();
        o.doe_mee(bob.speler_id, &p.uitnodiging).unwrap();
        let b = o.stuur_bericht(bob.speler_id, p.potje_id, "rude & <b>loud</b>").unwrap();
        o.rapporteer(ann.speler_id, p.potje_id, NieuwRapport { bericht_id: Some(b.id), speler_id: None }).unwrap();
        let id = o.open_rapporten().unwrap()[0].id;
        (o, bob.speler_id, id)
    }

    #[test]
    fn zonder_sleutel_geen_toegang() {
        let (mut o, _, id) = met_rapport();
        // Geen beheersleutel ingesteld: de pagina bestaat niet, ook niet met een gok.
        assert_eq!(vraag(&mut o, None, "GET", "/beheer", Some(&basic("")), true).status, 404);
        assert_eq!(vraag(&mut o, Some(""), "GET", "/beheer", Some(&basic("")), true).status, 404);
        // Wel ingesteld, maar geen of een verkeerde sleutel: 401 met een vraag om in te loggen, en geen inhoud.
        for auth in [None, Some(basic("fout")), Some(basic("geheim-12")), Some(basic("geheim-1234")), Some("Bearer fout".into()), Some("geheim-123".into())] {
            let a = vraag(&mut o, Some(SLEUTEL), "GET", "/beheer", auth.as_deref(), true);
            assert_eq!(a.status, 401, "{auth:?}");
            assert!(a.koppen.iter().any(|(k, v)| *k == "WWW-Authenticate" && v.starts_with("Basic")));
            assert!(!a.body.contains("rude"));
            let a = vraag(&mut o, Some(SLEUTEL), "POST", &format!("/beheer/rapporten/{id}/weer"), auth.as_deref(), true);
            assert_eq!(a.status, 401);
        }
        assert!(!o.open_rapporten().unwrap()[0].speler_geweerd, "niets veranderd");
    }

    #[test]
    fn met_sleutel_de_rapporten_zien_en_afhandelen() {
        let (mut o, bob, id) = met_rapport();
        let auth = basic(SLEUTEL);
        let a = vraag(&mut o, Some(SLEUTEL), "GET", "/beheer", Some(&auth), false);
        assert_eq!(a.status, 200);
        assert!(a.koppen.iter().any(|(k, v)| *k == "Content-Type" && v.starts_with("text/html")));
        // Het Bericht, wie het stuurde en wie rapporteerde, veilig als tekst.
        assert!(a.body.contains("rude &amp; &lt;b&gt;loud&lt;/b&gt;"), "{}", a.body);
        assert!(a.body.contains("Bob &lt;script&gt;"));
        assert!(a.body.contains("Reported by <b>Ann</b>"));
        assert!(!a.body.contains("<script>"));
        // Bearer werkt ook (voor curl).
        assert_eq!(vraag(&mut o, Some(SLEUTEL), "GET", "/beheer", Some(&format!("Bearer {SLEUTEL}")), false).status, 200);

        // Een actie van een andere website mag niet, ook niet met de sleutel.
        assert_eq!(vraag(&mut o, Some(SLEUTEL), "POST", &format!("/beheer/rapporten/{id}/verberg"), Some(&auth), false).status, 403);

        for actie in ["verberg", "weer"] {
            let a = vraag(&mut o, Some(SLEUTEL), "POST", &format!("/beheer/rapporten/{id}/{actie}"), Some(&auth), true);
            assert_eq!((a.status, a.koppen[0].1.as_str()), (303, "/beheer"));
        }
        let r = &o.open_rapporten().unwrap()[0];
        assert!(r.bericht_verborgen && r.speler_geweerd);
        // Het Bericht is weg voor iedereen, ook voor Bob zelf; Bob kan niets meer sturen.
        let potje = r.potje_id;
        assert!(o.berichten(bob, potje).unwrap().is_empty());
        assert_eq!(o.stuur_bericht(bob, potje, "hi").unwrap_err(), Fout::Verboden("You can no longer chat or join games"));

        assert_eq!(vraag(&mut o, Some(SLEUTEL), "POST", "/beheer/rapporten/999/sluit", Some(&auth), true).status, 404);
        assert_eq!(vraag(&mut o, Some(SLEUTEL), "POST", &format!("/beheer/rapporten/{id}/onzin"), Some(&auth), true).status, 404);
        assert_eq!(vraag(&mut o, Some(SLEUTEL), "POST", &format!("/beheer/rapporten/{id}/sluit"), Some(&auth), true).status, 303);
        assert!(o.open_rapporten().unwrap().is_empty());
        assert!(vraag(&mut o, Some(SLEUTEL), "GET", "/beheer", Some(&auth), false).body.contains("No open reports"));
    }

    #[test]
    fn de_beheerpagina_stuurt_een_strenge_content_security_policy_mee() {
        let (mut o, _, _) = met_rapport();
        let a = vraag(&mut o, Some(SLEUTEL), "GET", "/beheer", Some(&basic(SLEUTEL)), true);
        assert_eq!(a.status, 200);
        let csp = a.koppen.iter().find(|(k, _)| *k == "Content-Security-Policy").map(|(_, v)| v.as_str()).expect("kop ontbreekt");
        // Geen script, niets van buiten, geen frame en formulieren alleen naar zichzelf.
        for deel in ["default-src 'none'", "form-action 'self'", "frame-ancestors 'none'", "base-uri 'none'"] {
            assert!(csp.contains(deel), "{deel} ontbreekt in {csp}");
        }
        assert!(!csp.contains("script-src"));
    }

    #[test]
    fn oorsprong_en_tijd() {
        assert!(zelfde_oorsprong(Some("https://leapstone.example"), Some("https://leapstone.example"), None));
        assert!(zelfde_oorsprong(Some("http://127.0.0.1:3000"), Some("http://127.0.0.1:3000"), None));
        // Zelfde host, ander schema: een ander origin.
        assert!(!zelfde_oorsprong(Some("http://leapstone.example"), Some("https://leapstone.example"), None));
        assert!(!zelfde_oorsprong(Some("https://leapstone.example"), Some("http://leapstone.example"), None));
        assert!(!zelfde_oorsprong(Some("https://leapstone.example:8443"), Some("https://leapstone.example"), None));
        assert!(zelfde_oorsprong(Some("null"), Some("https://leapstone.example"), Some("same-origin")));
        assert!(!zelfde_oorsprong(Some("https://evil.example"), Some("https://leapstone.example"), Some("cross-site")));
        assert!(!zelfde_oorsprong(None, Some("https://leapstone.example"), None));
        assert!(!zelfde_oorsprong(Some("null"), Some("https://leapstone.example"), Some("same-site")));
        assert!(is_beheer("/beheer") && is_beheer("/beheer/rapporten/1/sluit") && !is_beheer("/beheerder"));
        assert_eq!(tijd_utc(0), "1970-01-01 00:00 UTC");
        assert_eq!(tijd_utc(1_762_351_380), "2025-11-05 14:03 UTC");
    }

    #[test]
    fn tellers_json_heeft_alleen_getallen_en_vraagt_de_sleutel() {
        let mut o = SqliteOpslag::in_geheugen().unwrap();
        // Een naam die op een getal lijkt, en een Speler met een Bericht en een Rapport.
        let ann = o.maak_speler("2026").unwrap();
        let bob = o.maak_speler("7").unwrap();
        let p = o.maak_potje(ann.speler_id, "ster", 2, None).unwrap();
        o.doe_mee(bob.speler_id, &p.uitnodiging).unwrap();
        let b = o.stuur_bericht(bob.speler_id, p.potje_id, "geheim bericht").unwrap();
        o.rapporteer(ann.speler_id, p.potje_id, NieuwRapport { bericht_id: Some(b.id), speler_id: None }).unwrap();

        // Zonder sleutel: geen toegang en geen inhoud.
        assert_eq!(vraag(&mut o, None, "GET", "/beheer/tellers.json", Some(&basic("")), true).status, 404);
        for auth in [None, Some(basic("fout"))] {
            let a = vraag(&mut o, Some(SLEUTEL), "GET", "/beheer/tellers.json", auth.as_deref(), true);
            assert_eq!(a.status, 401);
            assert!(!a.body.contains("weken"));
        }
        let a = vraag(&mut o, Some(SLEUTEL), "GET", "/beheer/tellers.json", Some(&basic(SLEUTEL)), true);
        assert_eq!(a.status, 200);
        assert!(a.koppen.iter().any(|(k, v)| *k == "Content-Type" && v.starts_with("application/json")));
        let json: serde_json::Value = serde_json::from_str(&a.body).unwrap();
        assert_eq!(json["open_rapporten"], 1);
        assert_eq!(json["weken"].as_array().unwrap().len(), 8);
        assert_eq!(json["weken"][0]["nieuwe_spelers"], 2);
        assert_eq!(json["weken"][0]["gestart"]["totaal"], 1);
        // Elke waarde is een getal, behalve de datum van de maandag: geen naam, geen id, geen tekst.
        fn controleer(naam: &str, w: &serde_json::Value) {
            match w {
                serde_json::Value::Number(_) => {}
                serde_json::Value::String(t) => {
                    assert_eq!(naam, "week_begin");
                    assert!(t.len() == 10 && t.bytes().all(|b| b.is_ascii_digit() || b == b'-'), "{t}");
                }
                serde_json::Value::Array(l) => l.iter().for_each(|x| controleer(naam, x)),
                serde_json::Value::Object(m) => m.iter().for_each(|(k, x)| controleer(k, x)),
                andere => panic!("onverwacht in {naam}: {andere}"),
            }
        }
        controleer("", &json);
        for streng in ["geheim", "Ann", "Bob"] {
            assert!(!a.body.contains(streng), "{streng}");
        }
        assert!(!a.body.contains(r#""2026""#) && !a.body.contains(r#""7""#), "een naam die op een getal lijkt, staat er niet in");
    }

    #[test]
    fn de_knop_test_zet_een_speler_uit_de_tellers_en_weer_terug() {
        let mut o = SqliteOpslag::in_geheugen().unwrap();
        let ann = o.maak_speler("Ann <b>").unwrap().speler_id;
        let bob = o.maak_speler("Bob").unwrap().speler_id;
        let p = o.maak_potje(ann, "ster", 2, None).unwrap();
        o.doe_mee(bob, &p.uitnodiging).unwrap();
        let auth = basic(SLEUTEL);
        let weken = |o: &mut SqliteOpslag| -> serde_json::Value {
            serde_json::from_str::<serde_json::Value>(&vraag(o, Some(SLEUTEL), "GET", "/beheer/tellers.json", Some(&auth), true).body).unwrap()["weken"][0].clone()
        };
        assert_eq!((weken(&mut o)["nieuwe_spelers"].clone(), weken(&mut o)["gestart"]["totaal"].clone()), (2.into(), 1.into()));

        let pagina = vraag(&mut o, Some(SLEUTEL), "GET", "/beheer", Some(&auth), false).body;
        assert!(pagina.contains(&format!(r#"action="/beheer/spelers/{ann}/test""#)), "{pagina}");
        assert!(pagina.contains("Per week") && pagina.contains("Ann &lt;b&gt;") && !pagina.contains("Ann <b>"));

        // Een andere website mag de knop niet indrukken; zonder sleutel ook niet.
        let pad = format!("/beheer/spelers/{ann}/test");
        assert_eq!(vraag(&mut o, Some(SLEUTEL), "POST", &pad, Some(&auth), false).status, 403);
        assert_eq!(vraag(&mut o, Some(SLEUTEL), "POST", &pad, None, true).status, 401);
        assert_eq!(weken(&mut o)["nieuwe_spelers"], 2);

        let a = vraag(&mut o, Some(SLEUTEL), "POST", &pad, Some(&auth), true);
        assert_eq!((a.status, a.koppen[0].1.as_str()), (303, "/beheer"));
        // Ann is Test-Speler: één nieuwe Speler minder, en het Potje blijft tellen (Bob is echt), met vermelding.
        assert_eq!((weken(&mut o)["nieuwe_spelers"].clone(), weken(&mut o)["gestart"].clone()), (1.into(), serde_json::json!({"totaal": 1, "waarvan_test": 1})));
        assert!(vraag(&mut o, Some(SLEUTEL), "GET", "/beheer", Some(&auth), false).body.contains(r#"class="pil test""#));
        // Bob ook: nu telt het Potje niet meer.
        assert_eq!(vraag(&mut o, Some(SLEUTEL), "POST", &format!("/beheer/spelers/{bob}/test"), Some(&auth), true).status, 303);
        assert_eq!((weken(&mut o)["nieuwe_spelers"].clone(), weken(&mut o)["gestart"]["totaal"].clone()), (0.into(), 0.into()));
        // Nog eens tikken zet ze terug.
        vraag(&mut o, Some(SLEUTEL), "POST", &pad, Some(&auth), true);
        vraag(&mut o, Some(SLEUTEL), "POST", &format!("/beheer/spelers/{bob}/test"), Some(&auth), true);
        assert_eq!((weken(&mut o)["nieuwe_spelers"].clone(), weken(&mut o)["gestart"]["totaal"].clone()), (2.into(), 1.into()));
        assert_eq!(vraag(&mut o, Some(SLEUTEL), "POST", "/beheer/spelers/999/test", Some(&auth), true).status, 404);
    }
}
