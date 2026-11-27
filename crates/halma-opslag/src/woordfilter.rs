//! Woordfilter voor Berichten en Spelersnamen: weigert grove woorden (Engels en Nederlands).
//!
//! De tekst wordt eerst gelijkgetrokken (kleine letters, geen accenten, eenvoudige vervangingen als
//! 0 voor o en 3 voor e) en in woorden gesplitst. Alleen hele woorden tellen, zodat "Scunthorpe"
//! of "klassiek" niet geweigerd worden. Zie "Techniek" in docs/plan.md.

/// Hoe een woord uit de lijst met een woord uit de tekst vergeleken wordt.
enum Soort {
    /// Het hele woord moet gelijk zijn.
    Heel,
    /// Het woord begint ermee (voor stammen met uitgangen: "shit" in "shitty").
    Begin,
    /// Het woord bevat het (alleen voor stukken die in geen gewoon woord voorkomen).
    Bevat,
}
use Soort::*;

/// De lijst. Klein en met opzet voorzichtig: een gewone naam of een gewoon woord mag niet geweigerd worden.
/// Uitbreiden kan door een regel toe te voegen; leg bij `Begin` en `Bevat` een test voor valse treffers bij.
const GROF: &[(&str, Soort)] = &[
    // Engels
    ("fuck", Bevat),
    ("shit", Begin),
    ("bullshit", Bevat),
    ("cunt", Begin),
    ("bitch", Begin),
    ("asshole", Bevat),
    ("arsehole", Bevat),
    ("bastard", Begin),
    ("dickhead", Begin),
    ("cocksucker", Begin),
    ("pussy", Begin),
    ("slut", Begin),
    ("whore", Begin),
    ("wanker", Begin),
    ("twat", Heel),
    ("nigger", Begin),
    ("nigga", Heel),
    ("niggas", Heel),
    ("faggot", Begin),
    ("fag", Heel),
    ("retard", Heel),
    ("retarded", Heel),
    ("rapist", Begin),
    ("nazi", Heel),
    ("nazis", Heel),
    ("hitler", Begin),
    ("kys", Heel),
    // Nederlands
    ("kut", Heel),
    ("kutje", Heel),
    ("kutten", Heel),
    ("kuthoer", Begin),
    ("kutwijf", Begin),
    ("kutzak", Begin),
    ("klootzak", Begin),
    ("lul", Heel),
    ("lullen", Heel),
    ("lulhannes", Heel),
    ("lulletje", Heel),
    ("hoer", Heel),
    ("hoeren", Heel),
    ("hoerenzoon", Begin),
    ("kanker", Heel),
    ("kankerlijer", Begin),
    ("kankerhoer", Begin),
    ("tyfuslijer", Begin),
    ("godverdomme", Begin),
    ("godver", Heel),
    ("mongool", Heel),
    ("neger", Heel),
    ("flikker", Heel),
    ("flikkers", Heel),
    ("rotzak", Begin),
];

/// Is er een grof woord in deze tekst? Hoofdletters, accenten, herhaalde letters en vervangingen
/// als `sh1t`, `f*ck`-achtige spaties (`f u c k`) en `$hit` tellen mee.
pub fn is_grof(tekst: &str) -> bool {
    let woorden = woorden(tekst);
    woorden.iter().any(|w| grof_woord(w)) || losse_letters(&woorden).iter().any(|w| grof_woord(w))
}

fn grof_woord(woord: &str) -> bool {
    let kort = ontdubbel(woord);
    GROF.iter().any(|(grof, soort)| {
        let gelijk = |w: &str, g: &str| match soort {
            Heel => w == g,
            Begin => w.starts_with(g),
            Bevat => w.contains(g),
        };
        gelijk(woord, grof) || (grof.len() >= 4 && gelijk(&kort, grof))
    })
}

/// "fuuuck" wordt "fuck": drie of meer dezelfde letters achter elkaar tellen als één.
/// Twee gelijke letters blijven staan, zodat "shiitake" geen "shit" wordt.
fn ontdubbel(woord: &str) -> String {
    let letters: Vec<char> = woord.chars().collect();
    let mut uit = String::with_capacity(woord.len());
    let mut i = 0;
    while i < letters.len() {
        let mut j = i;
        while j < letters.len() && letters[j] == letters[i] {
            j += 1;
        }
        uit.push(letters[i]);
        if j - i == 2 {
            uit.push(letters[i]);
        }
        i = j;
    }
    uit
}

/// Kleine letters, zonder accenten, met de eenvoudige vervangingen; daarna gesplitst op alles wat geen letter is.
fn woorden(tekst: &str) -> Vec<String> {
    let mut woorden = Vec::new();
    let mut nu = String::new();
    for c in tekst.chars().flat_map(char::to_lowercase) {
        if c.is_ascii_lowercase() {
            nu.push(c);
        } else if let Some(letters) = gelijk_teken(c) {
            nu.push_str(letters);
        } else if !nu.is_empty() {
            woorden.push(std::mem::take(&mut nu));
        }
    }
    if !nu.is_empty() {
        woorden.push(nu);
    }
    woorden
}

/// Drie of meer losse letters achter elkaar ("f u c k", "f.u.c.k") zijn samen één woord.
fn losse_letters(woorden: &[String]) -> Vec<String> {
    let mut uit = Vec::new();
    let mut reeks = String::new();
    let mut lengte = 0;
    for w in woorden.iter().map(Some).chain([None]) {
        match w {
            Some(w) if w.chars().count() == 1 => {
                reeks.push_str(w);
                lengte += 1;
            }
            _ => {
                if lengte >= 3 {
                    uit.push(std::mem::take(&mut reeks));
                }
                reeks.clear();
                lengte = 0;
            }
        }
    }
    uit
}

/// De letters die dit teken vertegenwoordigt, of `None` als het een scheiding is.
fn gelijk_teken(c: char) -> Option<&'static str> {
    Some(match c {
        '0' => "o",
        '1' | '!' | '|' => "i",
        '3' => "e",
        '4' | '@' => "a",
        '5' | '$' => "s",
        '7' | '+' => "t",
        'à' | 'á' | 'â' | 'ã' | 'ä' | 'å' => "a",
        'è' | 'é' | 'ê' | 'ë' => "e",
        'ì' | 'í' | 'î' | 'ï' => "i",
        'ò' | 'ó' | 'ô' | 'õ' | 'ö' => "o",
        'ù' | 'ú' | 'û' | 'ü' => "u",
        'ç' => "c",
        'ñ' => "n",
        'ß' => "ss",
        _ => return None,
    })
}

#[cfg(test)]
mod tests {
    use super::is_grof;

    #[test]
    fn weigert_grove_woorden_in_beide_talen() {
        for t in ["you are a cunt", "what the fuck", "Je bent een klootzak", "kut spel", "stomme hoer", "SHIT", "fuckers", "kankerlijer"] {
            assert!(is_grof(t), "{t}");
        }
    }

    #[test]
    fn weigert_varianten() {
        for t in ["FuCk you", "sh1t", "$hit happens", "f u c k", "f.u.c.k", "fuuuck", "kl00tzak", "n1gger", "b!tch", "Fück", "k.u.t", "pu$$y"] {
            assert!(is_grof(t), "{t}");
        }
    }

    #[test]
    fn laat_gewone_tekst_en_valse_treffers_door() {
        for t in [
            "Scunthorpe", "Scunthorpe United", "classic", "klassiek", "Hello there", "Good game!", "Nice move, well played",
            "Dick", "Dick Bruna", "assassin", "grape", "therapist", "Peniston", "Kutlu", "lullaby", "Shiitake", "hoerah",
            "Hancock", "cockpit", "peacock", "Essex", "ik heb 10 stenen in 5 zetten", "niggardly",
            "I a m ok", "a b", "u r a pro", "Wie is aan de beurt?", "Potje 3 van 4", "ben je er nog",
        ] {
            assert!(!is_grof(t), "{t}");
        }
    }
}
