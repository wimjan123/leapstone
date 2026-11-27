//! De vorm van het lakbord (ontwerp 1b, taak 177): een speelveld met echte gaten, de binnenkant van
//! de gaten, een rand van gesneden rood lak met zwart lak, messing hoekbeslag met nagels, en de tafel.
//!
//! Overgenomen uit het prototype "De lakwerktafel" (`src/vormen.js`). Het Sterbord is een zeshoek met
//! de punten boven en onder; het Vierkant bord heeft dezelfde onderdelen in een vierkant. De bovenkant
//! van het speelveld ligt op y = 0; de tafel op `TAFEL_Y`. Elk deel is één mesh met zijn eigen materiaal
//! (in `app`): kleur, normaal en glans komen uit de gebakken plaatjes (`web/scripts/bak-bord3d`).
//!
//! Plaatjes in Bevy: v loopt omlaag in het plaatje. De normaalkaarten zijn gebakken met groen naar
//! boven in het plaatje; de tangent wijst daarom zo dat `w * cross(normaal, tangent)` naar boven in het
//! plaatje wijst (zie `tangent`).

use glam::{Vec2, Vec3};
use std::f32::consts::{FRAC_PI_2, PI, TAU};

/// Het tafelblad.
pub const TAFEL_Y: f32 = -0.62;
/// Sterbord: apothema van het speelveld en van de buitenkant van de rand.
pub const VELD_A: f32 = 6.7;
pub const RAND_A: f32 = 7.62;
/// De rand steekt zo ver boven het speelveld uit.
pub const RAND_H: f32 = 0.36;
/// Afronding van de bovenkant van de rand.
const RAND_ROND: f32 = 0.07;
/// Vierkant bord: halve breedte van het speelveld en van de buitenkant van de rand (de rand is even breed).
pub const VIERKANT_VELD: f32 = 8.45;
pub const VIERKANT_RAND: f32 = VIERKANT_VELD + (RAND_A - VELD_A);
/// Een gat: straal en diepte.
pub const GAT_STRAAL: f32 = 0.365;
pub const GAT_DIEPTE: f32 = 0.3;
/// Het plaatje van het speelveld loopt van -`uv` tot `uv` vakken.
pub const STER_UV: f32 = 8.0;
pub const VIERKANT_UV: f32 = 9.0;
/// Eén tegel van het plaatje van de rand is zo lang (zeven per zijde van het Sterbord).
const RAND_TEGEL: f32 = 2.0 * ((VELD_A + RAND_A) / 2.0) * 0.577_350_3 / 7.0;
/// Zo ver loopt het hoekbeslag vanaf de hoek langs de rand.
const BESLAG: f32 = 1.05;
/// Een nagel van het beslag.
const NAGEL: f32 = 0.075;
/// Punten rond een gat: een veelvoud van 6 en 4, zodat de hoeken van een tegel erbij zitten.
const RING: usize = 24;

/// Een stuk van het bord als losse lijsten, zoals Bevy ze wil.
#[derive(Debug, Default)]
pub struct Deel {
    pub plekken: Vec<[f32; 3]>,
    pub normalen: Vec<[f32; 3]>,
    pub uv: Vec<[f32; 2]>,
    pub tangenten: Vec<[f32; 4]>,
    /// Per hoekpunt een grijswaarde (alleen de gaten: donkerder naar de bodem).
    pub kleuren: Vec<[f32; 4]>,
    pub driehoeken: Vec<u32>,
}

impl Deel {
    pub(crate) fn punt(&mut self, p: Vec3, n: Vec3, uv: Vec2, t: [f32; 4]) -> u32 {
        self.plekken.push(p.to_array());
        self.normalen.push(n.to_array());
        self.uv.push(uv.to_array());
        self.tangenten.push(t);
        self.kleuren.push([1.0; 4]);
        (self.plekken.len() - 1) as u32
    }

    /// Een driehoek die naar `n` kijkt (tegen de klok in, gezien vanaf die kant).
    pub(crate) fn driehoek(&mut self, a: u32, b: u32, c: u32, n: Vec3) {
        let p = |i: u32| Vec3::from(self.plekken[i as usize]);
        if (p(b) - p(a)).cross(p(c) - p(a)).dot(n) >= 0.0 {
            self.driehoeken.extend([a, b, c]);
        } else {
            self.driehoeken.extend([a, c, b]);
        }
    }

    pub(crate) fn vierhoek(&mut self, a: u32, b: u32, c: u32, d: u32, n: Vec3) {
        self.driehoek(a, b, c, n);
        self.driehoek(a, c, d, n);
    }

    /// Het aantal driehoeken.
    pub fn driehoeken(&self) -> usize {
        self.driehoeken.len() / 3
    }
}

/// De tangent van een vlak met normaal `n`, als u loopt langs `du` en v langs `dv` (beide in de wereld).
/// `w` zo dat `w * cross(n, tangent)` tegen v in wijst: naar boven in het plaatje.
fn tangent(n: Vec3, du: Vec3, dv: Vec3) -> [f32; 4] {
    let t = (du - n * n.dot(du)).normalize_or(Vec3::X);
    let w = if n.cross(t).dot(-dv) >= 0.0 {
        1.0
    } else {
        -1.0
    };
    [t.x, t.y, t.z, w]
}

/// De hoeken van de zeshoek (punten boven en onder, langs z) of het vierkant, bij apothema `a`.
pub fn veelhoek(vierkant: bool, a: f32) -> Vec<Vec2> {
    let (n, begin) = if vierkant {
        (4, PI / 4.0)
    } else {
        (6, FRAC_PI_2)
    };
    let r = a / (PI / n as f32).cos();
    (0..n)
        .map(|k| Vec2::from_angle(begin + TAU * k as f32 / n as f32) * r)
        .collect()
}

/// Textuurplek van een punt op het speelveld.
pub fn veld_uv(vierkant: bool, p: Vec2) -> Vec2 {
    let s = if vierkant { VIERKANT_UV } else { STER_UV };
    (p + Vec2::splat(s)) / (2.0 * s)
}

/// Apothema van de buitenkant van de rand (zonder de voet).
pub fn buitenkant_rand(vierkant: bool) -> f32 {
    maten(vierkant).1
}

/// Apothema van het speelveld en de buitenkant van de rand.
fn maten(vierkant: bool) -> (f32, f32) {
    if vierkant {
        (VIERKANT_VELD, VIERKANT_RAND)
    } else {
        (VELD_A, RAND_A)
    }
}

/// De buitenrand van het hele bord (voor de camera en de schaduw op tafel).
pub fn buitenrand(vierkant: bool) -> Vec<Vec2> {
    veelhoek(vierkant, maten(vierkant).1 + 0.17)
}

/// De rand van de tegel rond een vak: de cel van het raster (zeshoek of vierkant), op dezelfde
/// hoeken als de punten van het gat.
fn tegel(vierkant: bool, midden: Vec2) -> Vec<Vec2> {
    (0..RING)
        .map(|i| {
            let d = richting(vierkant, i);
            let r = if vierkant {
                0.5 / d.x.abs().max(d.y.abs())
            } else {
                // Zeshoek met apothema 0,5 en de zijden loodrecht op 0, 60, 120 ... graden.
                let hoek = d.to_angle();
                let zijde = (hoek / (PI / 3.0)).round() * (PI / 3.0);
                0.5 / (hoek - zijde).cos()
            };
            midden + d * r
        })
        .collect()
}

/// Richting van punt `i` rond een gat. Begint op een hoek van de tegel.
fn richting(vierkant: bool, i: usize) -> Vec2 {
    let begin = if vierkant { 45.0 } else { 30.0 };
    Vec2::from_angle((begin + 360.0 / RING as f32 * i as f32).to_radians())
}

/// Het speelveld: een plaat op y = 0 met een gat op elk vak.
pub fn veld(vierkant: bool, vakken: &[Vec2]) -> Deel {
    let mut m = Deel::default();
    let rand = veelhoek(vierkant, maten(vierkant).0 + 0.02);
    let t = tangent(Vec3::Y, Vec3::X, Vec3::Z);
    let punt =
        |m: &mut Deel, p: Vec2| m.punt(Vec3::new(p.x, 0.0, p.y), Vec3::Y, veld_uv(vierkant, p), t);
    // Alle cellen van het raster die het veld raken.
    let cellen: Vec<Vec2> = if vierkant {
        (-10..10)
            .flat_map(|r| (-10..10).map(move |k| Vec2::new(k as f32 + 0.5, r as f32 + 0.5)))
            .collect()
    } else {
        (-12..=12)
            .flat_map(|r| (-12..=12).map(move |q| crate::vakken::plek(q, r)))
            .collect()
    };
    let grens = rand[0].length() + 1.0;
    for midden in cellen {
        if midden.length() > grens {
            continue;
        }
        let cel = tegel(vierkant, midden);
        if vakken.iter().any(|v| v.distance(midden) < 1e-3) {
            let buiten: Vec<u32> = cel.iter().map(|p| punt(&mut m, *p)).collect();
            let binnen: Vec<u32> = (0..RING)
                .map(|i| punt(&mut m, midden + richting(vierkant, i) * GAT_STRAAL))
                .collect();
            for i in 0..RING {
                let j = (i + 1) % RING;
                m.vierhoek(buiten[i], buiten[j], binnen[j], binnen[i], Vec3::Y);
            }
        } else {
            let stuk = crate::vorm::knip(&cel, &rand);
            if stuk.len() >= 3 {
                let idx: Vec<u32> = stuk.iter().map(|p| punt(&mut m, *p)).collect();
                for i in 1..idx.len() - 1 {
                    m.driehoek(idx[0], idx[i], idx[i + 1], Vec3::Y);
                }
            }
        }
    }
    m
}

/// De binnenkant van alle gaten: een geboorde kom, onderin donkerder (grijs per hoekpunt).
/// De normalen wijzen naar binnen (de kom wordt van binnen gezien).
pub fn gaten(vierkant: bool, vakken: &[Vec2]) -> Deel {
    let mut profiel = vec![
        Vec2::new(GAT_STRAAL, 0.002),
        Vec2::new(GAT_STRAAL, -GAT_DIEPTE * 0.55),
    ];
    for i in 1..=4 {
        let a = i as f32 / 4.0 * FRAC_PI_2;
        profiel.push(Vec2::new(
            GAT_STRAAL * a.cos(),
            -GAT_DIEPTE * 0.55 - GAT_DIEPTE * 0.45 * a.sin(),
        ));
    }
    // Normaal naar binnen: rechts van de looprichting (van de rand omlaag naar het midden).
    let normalen = crate::vorm::lijn_normalen(&profiel, false);
    let mut m = Deel::default();
    for v in vakken {
        let begin = m.plekken.len() as u32;
        for (q, n) in profiel.iter().zip(&normalen) {
            let diep = (-q.y / GAT_DIEPTE).clamp(0.0, 1.0);
            let grijs = 1.0 - 0.62 * diep.powf(0.7);
            for i in 0..RING {
                let d = richting(vierkant, i);
                let p = Vec3::new(v.x + d.x * q.x, q.y, v.y + d.y * q.x);
                let nrm = Vec3::new(d.x * n.x, n.y, d.y * n.x).normalize_or(Vec3::Y);
                let idx = m.punt(p, nrm, Vec2::ZERO, [1.0, 0.0, 0.0, 1.0]);
                m.kleuren[idx as usize] = [grijs, grijs, grijs, 1.0];
            }
        }
        for k in 0..profiel.len() as u32 - 1 {
            for i in 0..RING as u32 {
                let j = (i + 1) % RING as u32;
                let (a, b) = (begin + k * RING as u32 + i, begin + k * RING as u32 + j);
                let (c, d) = (b + RING as u32, a + RING as u32);
                // Naar binnen kijken: richting de as, en omhoog op de bodem.
                let midden =
                    (Vec3::from(m.plekken[a as usize]) + Vec3::from(m.plekken[c as usize])) / 2.0;
                let naar_as = Vec3::new(v.x - midden.x, 0.0, v.y - midden.z) + Vec3::Y * 0.4;
                m.vierhoek(a, b, c, d, naar_as);
            }
        }
    }
    m
}

/// Een afgeronde overgang (kwartcirkel in `n` stukjes).
fn boog(c: Vec2, r: f32, van: f32, tot: f32, n: usize) -> Vec<Vec2> {
    (0..=n)
        .map(|i| c + Vec2::from_angle(van + (tot - van) * i as f32 / n as f32) * r)
        .collect()
}

/// Het profiel van de rand, van de binnenkant (op het speelveld) over de bovenkant naar de voet op
/// tafel: (apothema, hoogte). `uit`: zoveel dikker (voor het beslag eromheen).
fn rand_profiel(vierkant: bool, uit: f32) -> Vec<Vec2> {
    let (veld, rand) = maten(vierkant);
    let (a0, a1, h, r) = (veld - uit, rand + uit, RAND_H + uit, RAND_ROND);
    let mut p = vec![Vec2::new(a0, -0.02), Vec2::new(a0, h - r)];
    p.extend(
        boog(Vec2::new(a0 + r, h - r), r, PI, FRAC_PI_2, 4)
            .into_iter()
            .skip(1),
    );
    p.extend(boog(Vec2::new(a1 - r, h - r), r, FRAC_PI_2, 0.0, 4));
    p.extend([
        Vec2::new(a1, -0.2),
        Vec2::new(a1 + 0.08, -0.27),
        Vec2::new(a1 + 0.08, TAFEL_Y + 0.13),
        Vec2::new(a1 + 0.17, TAFEL_Y + 0.06),
        Vec2::new(a1 + 0.17, TAFEL_Y),
    ]);
    p
}

/// Trekt een doorsnede (apothema, hoogte) langs alle zijden van de veelhoek. Elk stukje krijgt een
/// eigen normaal. u loopt langs de zijde (gedeeld door `u_maat`), v langs het profiel van 0 tot 1.
/// `hoek` > 0: alleen dat stuk bij elke hoek, en u loopt dan van de hoek (0) naar het vrije eind (1).
fn ring(vierkant: bool, profiel: &[Vec2], u_maat: f32, hoek: f32) -> Deel {
    let mut m = Deel::default();
    let mut lengtes = vec![0.0f32];
    for w in profiel.windows(2) {
        lengtes.push(lengtes.last().unwrap() + w[0].distance(w[1]));
    }
    let totaal = lengtes.last().copied().unwrap_or(1.0).max(1e-6);
    let hoeken = veelhoek(vierkant, 1.0);
    let n = hoeken.len();
    let half_hoek = (PI / n as f32).tan();
    for k in 0..n {
        let (h0, h1) = (hoeken[k], hoeken[(k + 1) % n]);
        let langs = (h1 - h0).normalize();
        let buiten = ((h0 + h1) / 2.0).normalize();
        let kanten: &[i32] = if hoek > 0.0 { &[-1, 1] } else { &[0] };
        for &kant in kanten {
            for j in 0..profiel.len() - 1 {
                let (p, q) = (profiel[j], profiel[j + 1]);
                // Normaal van dit stukje: links van de looprichting in (apothema, hoogte).
                let d = (q - p).normalize_or(Vec2::Y);
                let n2 = Vec2::new(-d.y, d.x);
                let nrm = (buiten.extend(0.0).xzy() * n2.x + Vec3::Y * n2.y).normalize();
                let mut idx = [[0u32; 2]; 2];
                for (r, (a, y, l)) in [(p.x, p.y, lengtes[j]), (q.x, q.y, lengtes[j + 1])]
                    .into_iter()
                    .enumerate()
                {
                    let half = a * half_hoek;
                    let (mut t0, mut t1) = (-half, half);
                    if hoek > 0.0 {
                        if kant < 0 {
                            t1 = -half + hoek;
                        } else {
                            t0 = half - hoek;
                        }
                    }
                    for (s, t) in [t0, t1].into_iter().enumerate() {
                        let plek = buiten * a + langs * t;
                        let u = if hoek > 0.0 {
                            if kant < 0 {
                                (t + half) / hoek
                            } else {
                                (half - t) / hoek
                            }
                        } else {
                            t / u_maat
                        };
                        // u loopt bij het beslag aan de ene kant met langs mee, aan de andere kant ertegenin.
                        let du = if hoek > 0.0 && kant > 0 {
                            -langs
                        } else {
                            langs
                        };
                        let tg = tangent(
                            nrm,
                            du.extend(0.0).xzy(),
                            (q - p).x * buiten.extend(0.0).xzy() + Vec3::Y * (q - p).y,
                        );
                        idx[r][s] = m.punt(
                            Vec3::new(plek.x, y, plek.y),
                            nrm,
                            Vec2::new(u, l / totaal),
                            tg,
                        );
                    }
                }
                m.vierhoek(idx[0][0], idx[0][1], idx[1][1], idx[1][0], nrm);
            }
        }
    }
    m
}

/// De rand in drie delen: de bovenkant (gesneden rood lak met de meander), de binnenkant (glad rood
/// lak) en de buitenkant met de voet (zwart lak).
pub fn rand(vierkant: bool) -> [Deel; 3] {
    let p = rand_profiel(vierkant, 0.0);
    let (veld, rand) = maten(vierkant);
    let h = RAND_H;
    let boven = [
        Vec2::new(veld + RAND_ROND, h),
        Vec2::new(rand - RAND_ROND, h),
    ];
    let i_boven = p.iter().position(|q| (q.y - h).abs() < 1e-5).unwrap_or(1);
    let i_buiten = p
        .iter()
        .rposition(|q| (q.y - h).abs() < 1e-5)
        .unwrap_or(p.len() - 2);
    [
        ring(vierkant, &boven, RAND_TEGEL, 0.0),
        ring(vierkant, &p[..=i_boven], 1.0, 0.0),
        ring(vierkant, &p[i_buiten..], 1.0, 0.0),
    ]
}

/// Het hoekbeslag van messing: om elke hoek van de rand, iets dikker dan de rand.
pub fn beslag(vierkant: bool) -> Deel {
    let p = rand_profiel(vierkant, 0.024);
    ring(vierkant, &p[1..p.len() - 3], 1.0, BESLAG)
}

/// De nagels van het beslag: twee per hoek, halve bolletjes op de bovenkant van de rand.
pub fn nagels(vierkant: bool) -> Deel {
    let (veld, rand) = maten(vierkant);
    let midden = veelhoek(vierkant, (veld + rand) / 2.0);
    let n = midden.len();
    let mut m = Deel::default();
    for k in 0..n {
        let h = midden[k];
        for buur in [midden[(k + 1) % n], midden[(k + n - 1) % n]] {
            let c = h + (buur - h) * (0.8 / buur.distance(h));
            let c = Vec3::new(c.x, RAND_H + 0.02, c.y);
            let (rondom, hoog) = (12, 4);
            let begin = m.plekken.len() as u32;
            for j in 0..=hoog {
                let b = FRAC_PI_2 * j as f32 / hoog as f32;
                for i in 0..=rondom {
                    let a = TAU * i as f32 / rondom as f32;
                    let d = Vec3::new(b.cos() * a.cos(), b.sin(), b.cos() * a.sin());
                    m.punt(c + d * NAGEL, d, Vec2::ZERO, [1.0, 0.0, 0.0, 1.0]);
                }
            }
            let rij = rondom as u32 + 1;
            for j in 0..hoog as u32 {
                for i in 0..rondom as u32 {
                    let (a, b) = (begin + j * rij + i, begin + j * rij + i + 1);
                    let (cc, d) = (b + rij, a + rij);
                    let mid = (Vec3::from(m.plekken[a as usize])
                        + Vec3::from(m.plekken[cc as usize]))
                        / 2.0
                        - c;
                    m.vierhoek(a, b, cc, d, mid);
                }
            }
        }
    }
    m
}

/// De tafel: een groot vlak van zijde. Het plaatje herhaalt elke 20 vakken.
pub fn tafel() -> Deel {
    let mut m = Deel::default();
    const HALF: f32 = 70.0;
    const TEGEL: f32 = 20.0;
    let t = tangent(Vec3::Y, Vec3::X, Vec3::Z);
    let hoeken = [(-1.0, -1.0), (1.0, -1.0), (1.0, 1.0), (-1.0, 1.0)].map(|(x, z)| {
        let p = Vec2::new(x, z) * HALF;
        m.punt(Vec3::new(p.x, TAFEL_Y, p.y), Vec3::Y, (p + HALF) / TEGEL, t)
    });
    m.vierhoek(hoeken[0], hoeken[1], hoeken[2], hoeken[3], Vec3::Y);
    m
}

trait Xzy {
    fn xzy(self) -> Vec3;
}
impl Xzy for Vec3 {
    /// (x, y, 0) naar (x, 0, y): een richting in het platte vlak naar de wereld.
    fn xzy(self) -> Vec3 {
        Vec3::new(self.x, self.z, self.y)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::vakken::{sterbord, vierkant_bord};

    fn heel(m: &Deel) {
        let n = m.plekken.len();
        assert_eq!(m.normalen.len(), n);
        assert_eq!(m.uv.len(), n);
        assert_eq!(m.tangenten.len(), n);
        assert_eq!(m.kleuren.len(), n);
        assert!(m.driehoeken.iter().all(|&i| (i as usize) < n));
        for nrm in &m.normalen {
            assert!((Vec3::from(*nrm).length() - 1.0).abs() < 1e-3);
        }
        // Elke driehoek kijkt dezelfde kant op als zijn hoekpunten (anders laat de grafische kaart hem weg).
        for d in m.driehoeken.chunks(3) {
            let p = |i: u32| Vec3::from(m.plekken[i as usize]);
            let vlak = (p(d[1]) - p(d[0])).cross(p(d[2]) - p(d[0]));
            if vlak.length() < 1e-9 {
                continue;
            }
            let gem: Vec3 = d.iter().map(|&i| Vec3::from(m.normalen[i as usize])).sum();
            assert!(vlak.dot(gem) > 0.0, "{d:?}");
        }
    }

    #[test]
    fn het_veld_heeft_een_echt_gat_op_elk_vak_en_nergens_anders() {
        for (vierkant, vakken) in [(false, sterbord()), (true, vierkant_bord())] {
            let m = veld(vierkant, &vakken);
            heel(&m);
            // Oppervlakte: het veld min de gaten.
            let opp: f32 = m
                .driehoeken
                .chunks(3)
                .map(|d| {
                    let p = |i: u32| Vec3::from(m.plekken[i as usize]);
                    (p(d[1]) - p(d[0])).cross(p(d[2]) - p(d[0])).length() / 2.0
                })
                .sum();
            let a = maten(vierkant).0 + 0.02;
            let veld = if vierkant {
                4.0 * a * a
            } else {
                2.0 * 3f32.sqrt() * a * a
            };
            let gat = 0.5 * RING as f32 * GAT_STRAAL * GAT_STRAAL * (TAU / RING as f32).sin();
            let verwacht = veld - vakken.len() as f32 * gat;
            assert!(
                (opp - verwacht).abs() < 0.05,
                "{vierkant}: {opp} tegen {verwacht}"
            );
            // Geen punt van het veld ligt in een gat.
            for p in &m.plekken {
                let q = Vec2::new(p[0], p[2]);
                assert!(
                    vakken.iter().all(|v| v.distance(q) > GAT_STRAAL * 0.96),
                    "{q}"
                );
            }
        }
    }

    #[test]
    fn de_gaten_zijn_diep_en_onderin_donker() {
        let vakken = sterbord();
        let m = gaten(false, &vakken);
        heel(&m);
        let diepst = m.plekken.iter().map(|p| p[1]).fold(0.0, f32::min);
        assert!((diepst + GAT_DIEPTE).abs() < 1e-4);
        for (p, k) in m.plekken.iter().zip(&m.kleuren) {
            if p[1] > 0.0 {
                assert!(k[0] > 0.99);
            }
            if p[1] < -GAT_DIEPTE + 1e-3 {
                assert!(k[0] < 0.4);
            }
        }
        // Een Ster met 121 gaten blijft licht genoeg voor een telefoon.
        assert!(m.driehoeken() < 30_000, "{}", m.driehoeken());
    }

    #[test]
    fn de_rand_staat_om_het_veld_en_steekt_erboven_uit() {
        for vierkant in [false, true] {
            let [boven, binnen, buiten] = rand(vierkant);
            for m in [
                &boven,
                &binnen,
                &buiten,
                &beslag(vierkant),
                &nagels(vierkant),
            ] {
                heel(m);
            }
            let (veld, rand) = maten(vierkant);
            for p in &boven.plekken {
                assert!((p[1] - RAND_H).abs() < 1e-5);
                let q = Vec2::new(p[0], p[2]);
                assert!(
                    q.length() > veld - 1e-3 && q.length() < (rand + 0.01) * 1.42,
                    "{q}"
                );
            }
            // De bovenkant wijst omhoog, de binnenkant naar het midden.
            assert!(boven.normalen.iter().all(|n| n[1] > 0.99));
            let naar_midden = binnen
                .plekken
                .iter()
                .zip(&binnen.normalen)
                .filter(|(p, n)| {
                    p[1] < RAND_H - 0.1 && Vec2::new(p[0], p[2]).dot(Vec2::new(n[0], n[2])) < 0.0
                });
            assert!(naar_midden.count() > 0);
            // De voet staat op tafel.
            let laagst = buiten.plekken.iter().map(|p| p[1]).fold(0.0, f32::min);
            assert!((laagst - TAFEL_Y).abs() < 1e-5);
        }
    }

    #[test]
    fn de_tangent_wijst_naar_boven_in_het_plaatje() {
        // Veld: u langs x, v langs z (omlaag in het plaatje); naar boven in het plaatje is dus -z.
        let t = tangent(Vec3::Y, Vec3::X, Vec3::Z);
        let b = Vec3::Y.cross(Vec3::new(t[0], t[1], t[2])) * t[3];
        assert!(b.dot(-Vec3::Z) > 0.99);
    }

    #[test]
    fn de_buitenrand_omvat_rand_en_voet() {
        for vierkant in [false, true] {
            let r = buitenrand(vierkant);
            for m in rand(vierkant) {
                for p in &m.plekken {
                    assert!(crate::vorm::binnen(Vec2::new(p[0], p[2]) * 0.999, &r));
                }
            }
        }
    }
}
