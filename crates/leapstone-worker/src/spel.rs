//! Waar het spel staat op de site, gewone Rust zonder Worker-types, dus testbaar.
//!
//! De web-app staat op `/play/` (`web/play/index.html`). Op `/` komt de Landingspagina.
//! Uitnodigingslinks (`/uitnodiging/<code>`, ook de oude) en Meldingen (`/potje/<id>`) houden hun adres:
//! de App Links en Universal Links wijzen ernaar. De Worker geeft op die adressen de web-app.

/// Het adres van de web-app in de static assets.
pub const SPEL: &str = "/play/";

/// De pagina van een Uitnodiging (taak 115): hetzelfde spel, met de voorbeeldkaart "Join my game of Chinese checkers".
/// De build maakt hem uit `web/play/index.html` (`web/uitnodigingskaart.ts`).
pub const UITNODIGING: &str = "/uitnodiging-kaart/";

/// Welke pagina uit de static assets bij een spel-adres hoort: een Uitnodiging heeft haar eigen voorbeeldkaart,
/// de rest (ook een Melding) geeft de gewone pagina van het spel, die zijn eigen titel voor Google heeft.
pub fn spel_pagina(pad: &str) -> &'static str {
    if pad.starts_with("/uitnodiging/") { UITNODIGING } else { SPEL }
}

/// True voor adressen die het spel openen, zonder dat het adres verandert.
pub fn is_spel_adres(pad: &str) -> bool {
    ["/uitnodiging/", "/potje/"].iter().any(|v| pad.strip_prefix(v).is_some_and(|rest| !rest.is_empty()))
}

/// Het echte adres van de site: hier staat de canonical van elke pagina.
pub const HOOFDHOST: &str = "playleapstone.com";

/// Waar `www.playleapstone.com` heen gaat (301): hetzelfde pad en dezelfde query op het hoofdadres.
/// `None` voor elke andere host (workers.dev blijft gewoon werken) en voor verzoeken die geen GET of HEAD zijn.
pub fn www_doel(host: &str, methode_is_lezen: bool, pad: &str, query: Option<&str>) -> Option<String> {
    if !methode_is_lezen || !host.eq_ignore_ascii_case("www.playleapstone.com") {
        return None;
    }
    let mut doel = format!("https://{HOOFDHOST}{pad}");
    if let Some(q) = query.filter(|q| !q.is_empty()) {
        doel.push('?');
        doel.push_str(q);
    }
    Some(doel)
}

/// True als een HTML-antwoord op deze host `X-Robots-Tag: noindex` krijgt: op workers.dev (de oude adressen
/// van de apps en Uitnodigingen) hoort Google niets te bewaren; de canonical wijst al naar het hoofdadres.
pub fn noindex(host: &str, content_type: Option<&str>) -> bool {
    host.to_ascii_lowercase().ends_with(".workers.dev") && content_type.is_some_and(|c| c.to_ascii_lowercase().starts_with("text/html"))
}

/// De Content-Type die een HTML-antwoord moet krijgen als de static assets hem zonder `charset` geven (taak 296).
/// Eenvoudige lezers (Python `requests`, sommige AI-fetchers) vallen dan terug op Latin-1. `None`: geen HTML, of er staat al een charset.
pub fn html_met_charset(content_type: Option<&str>) -> Option<&'static str> {
    let c = content_type?.to_ascii_lowercase();
    (c.split(';').next()?.trim() == "text/html" && !c.contains("charset")).then_some("text/html; charset=utf-8")
}

/// De bewaartijd die de Worker op een antwoord uit de static assets zet, of `None` als het antwoord blijft zoals het is.
/// Een bestand in `/assets/` krijgt een jaar bewaartijd uit `web/public/_headers`; dat geldt ook voor een 404 op dat adres, en dan blijft een
/// bestand dat vlak na een uitrol nog niet overal klaarstond tot een jaar kapot, in de cache van Cloudflare en van de browser (taak 291).
/// Alleen een gelukt antwoord mag lang bewaard worden; elke fout op `/assets/` krijgt `no-store`.
pub fn bewaartijd_van_fout(pad: &str, status: u16) -> Option<&'static str> {
    (pad.starts_with("/assets/") && !(200..300).contains(&status) && status != 304).then_some("no-store")
}

/// True als de assets niets vonden en de Worker de pagina 404.html moet geven (met status 404): elk adres behalve `/assets/`
/// (daar past een kale 404) en `/api/`.
pub fn geeft_404_pagina(pad: &str, status: u16) -> bool {
    status == 404 && !pad.starts_with("/assets/") && !pad.starts_with("/api/")
}

#[cfg(test)]
mod tests {
    use super::*;

    /// Wat niet in `run_worker_first` staat, krijgt een antwoord van de static assets zonder dat de Worker draait:
    /// dan werken de 301 van www en de noindex-kop niet. Deze test bewaakt de HTML-paden. Andere bestanden horen er niet in:
    /// elk verzoek aan de Worker telt mee in het gratis plan (taak 134, 291).
    #[test]
    fn html_krijgt_charset_utf8_als_die_ontbreekt() {
        assert_eq!(html_met_charset(Some("text/html")), Some("text/html; charset=utf-8"));
        assert_eq!(html_met_charset(Some("Text/HTML ")), Some("text/html; charset=utf-8"));
        assert_eq!(html_met_charset(Some("text/html; charset=utf-8")), None);
        assert_eq!(html_met_charset(Some("text/html; charset=iso-8859-1")), None);
        assert_eq!(html_met_charset(Some("application/json")), None);
        assert_eq!(html_met_charset(None), None);
    }

    #[test]
    fn html_paden_gaan_eerst_naar_de_worker() {
        let toml = include_str!("../wrangler.toml");
        let regel = toml.lines().find(|r| r.starts_with("run_worker_first")).expect("run_worker_first");
        assert!(!regel.contains("true"), "niet alle verzoeken door de Worker");
        assert!(toml.contains("not_found_handling = \"none\""), "een ontbrekend bestand moet bij de Worker komen (taak 291)");
        let regels: Vec<&str> = regel.split('"').skip(1).step_by(2).collect();
        assert!(regels.len() <= 100, "run_worker_first heeft {} regels; Cloudflare staat er hoogstens 100 toe", regels.len());
        let treft = |r: &str, pad: &str| r.strip_suffix("/*").map_or(r == pad, |map| pad.starts_with(&format!("{map}/")));
        let eerst = |pad: &str| {
            let aan = regels.iter().any(|r| !r.starts_with('!') && treft(r, pad));
            aan && !regels.iter().filter_map(|r| r.strip_prefix('!')).any(|r| treft(r, pad))
        };
        // De bestanden van de build en van web/public gaan nooit door de Worker; /assets/ ook niet (de Worker ziet alleen wat ontbreekt).
        for pad in ["/assets/index.js", "/fonts/archivo.woff2", "/rules/img/ladder.svg", "/sw.js", "/registerSW.js", "/manifest.webmanifest", "/llms.txt", "/badges/a.png", "/favicon.png"] {
            assert!(!eerst(pad), "{pad} hoort niet door de Worker (telt mee in het gratis plan)");
        }
        for pad in ["/", "/play/", "/privacy", "/terms", "/de/", "/de/regeln/sternhalma", "/zh-hans/", "/robots.txt", "/sitemap.xml", "/uitnodiging/ABCD", "/potje/3", "/api/gezond", "/beheer", "/.well-known/apple-app-site-association", "/uitnodiging-kaart/"] {
            assert!(eerst(pad), "{pad} moet door de Worker");
        }
        // Elke HTML-pagina in web/public (als adres, zonder `.html` en `index.html`), robots.txt, sitemap.xml en /.well-known/ gaan door de Worker;
        // elk ander bestand niet.
        fn bestanden(map: &std::path::Path, basis: &std::path::Path, uit: &mut Vec<String>) {
            for f in std::fs::read_dir(map).expect("web/public").flatten() {
                let p = f.path();
                if p.is_dir() { bestanden(&p, basis, uit) } else { uit.push(format!("/{}", p.strip_prefix(basis).unwrap().to_string_lossy())) }
            }
        }
        let public = std::path::Path::new(concat!(env!("CARGO_MANIFEST_DIR"), "/../../web/public"));
        let mut alle = Vec::new();
        bestanden(public, public, &mut alle);
        for pad in alle.iter().filter(|p| p.as_str() != "/_headers" && p.as_str() != "/404.html") {
            let adres = match pad.strip_suffix("/index.html") {
                Some(map) => format!("{map}/"),
                None => pad.strip_suffix(".html").unwrap_or(pad).to_string(),
            };
            let hoort_erin = pad.ends_with(".html") || ["/robots.txt", "/sitemap.xml"].contains(&pad.as_str()) || pad.starts_with("/.well-known/");
            assert_eq!(eerst(&adres), hoort_erin, "{pad}: {}", if hoort_erin { "zet dit adres in run_worker_first" } else { "dit bestand hoort niet door de Worker" });
        }
    }

    #[test]
    fn een_fout_op_assets_wordt_niet_lang_bewaard() {
        for status in [404, 500, 403, 301, 307] {
            assert_eq!(bewaartijd_van_fout("/assets/index-abc.js", status), Some("no-store"), "{status}");
        }
        for status in [200, 206, 304] {
            assert_eq!(bewaartijd_van_fout("/assets/index-abc.js", status), None, "{status}");
        }
        assert_eq!(bewaartijd_van_fout("/nl/", 404), None);
        assert_eq!(bewaartijd_van_fout("/play/", 200), None);
    }

    #[test]
    fn een_onbekend_adres_geeft_de_404_pagina() {
        assert!(geeft_404_pagina("/bestaat-niet", 404));
        assert!(!geeft_404_pagina("/assets/x.js", 404));
        assert!(!geeft_404_pagina("/privacy", 200));
    }

    #[test]
    fn www_gaat_naar_het_hoofdadres() {
        assert_eq!(www_doel("www.playleapstone.com", true, "/", None).as_deref(), Some("https://playleapstone.com/"));
        assert_eq!(www_doel("WWW.playleapstone.com", true, "/uitnodiging/ABCD-EFGH", Some("a=1")).as_deref(), Some("https://playleapstone.com/uitnodiging/ABCD-EFGH?a=1"));
        assert_eq!(www_doel("www.playleapstone.com", true, "/privacy", Some("")).as_deref(), Some("https://playleapstone.com/privacy"));
    }

    #[test]
    fn andere_hosts_en_methodes_niet_doorgestuurd() {
        for host in ["playleapstone.com", "leapstone.visser-william.workers.dev", "localhost", "evil-www.playleapstone.com"] {
            assert_eq!(www_doel(host, true, "/", None), None, "{host}");
        }
        assert_eq!(www_doel("www.playleapstone.com", false, "/api/spelers", None), None);
    }

    #[test]
    fn een_uitnodiging_heeft_haar_eigen_pagina() {
        assert_eq!(spel_pagina("/uitnodiging/ABCD-EFGH"), "/uitnodiging-kaart/");
        assert_eq!(spel_pagina("/potje/12"), "/play/");
    }

    #[test]
    fn noindex_alleen_voor_html_op_workers_dev() {
        let wd = "leapstone.visser-william.workers.dev";
        assert!(noindex(wd, Some("text/html; charset=utf-8")));
        assert!(!noindex(wd, Some("application/json")));
        assert!(!noindex(wd, None));
        assert!(!noindex("playleapstone.com", Some("text/html")));
        assert!(!noindex("localhost", Some("text/html")));
    }

    #[test]
    fn uitnodigingen_en_potjes_openen_het_spel() {
        assert!(is_spel_adres("/uitnodiging/ABCD-EFGH"));
        assert!(is_spel_adres("/uitnodiging/ABCD-EFGH/"));
        assert!(is_spel_adres("/potje/3"));
    }

    #[test]
    fn andere_adressen_niet() {
        for pad in ["/", "/play/", "/privacy", "/terms", "/beheer", "/api/potjes", "/uitnodiging/", "/uitnodiging", "/potje/", "/.well-known/assetlinks.json"] {
            assert!(!is_spel_adres(pad), "{pad}");
        }
    }
}
