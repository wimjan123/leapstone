//! De Steen van ontwerp 1b (taak 177): een gedraaide trommelkraal van gekleurde lak, met een bolle
//! buik, een scherpe kraag en een brede, licht bolle kop voor het teken. De voet zakt in het gat.
//!
//! Het profiel komt uit het prototype (`steenGeo` in `src/vormen.js`): twee vloeiende lijnen
//! (Catmull-Rom) door vaste punten. Ronddraaien om de as geeft de mesh, met gladde normalen. Het
//! plaatje ligt er van boven op: `uv` is de plek van boven gezien (zie `textuur::steen`).
//!
//! Gewoon rekenwerk zonder Bevy. De pion staat met zijn onderkant op y = 0; in zijn gat zakt hij
//! `ZAKT` onder de bovenkant van het bord.

use crate::textuur::STEEN_BEREIK;
use glam::{Vec2, Vec3};
use std::f32::consts::TAU;

/// Zo diep zakt de voet in het gat: de bovenkant van het bord ligt op deze hoogte van de pion.
pub const ZAKT: f32 = 0.17;
/// Straal van de buik (het breedste stuk).
pub const STRAAL: f32 = 0.412;
/// Totale hoogte van de pion; boven het bord steekt hij `HOOGTE - ZAKT` uit.
pub const HOOGTE: f32 = 0.456 + ZAKT;
/// Twee versies: fijn voor dichtbij en grof voor verder weg, zodat zestig pionnen licht blijven voor
/// een telefoon. Zoveel stukjes rond de as, en hoe ver het grove profiel van het echte mag afwijken.
pub const FIJN: (usize, f32) = (40, 0.0);
pub const GROF: (usize, f32) = (28, 0.004);

/// Een vloeiende lijn door `punten` (uniforme Catmull-Rom, zoals `THREE.SplineCurve`), in `n` gelijke
/// stappen van begin tot eind.
fn vloeiend(punten: &[Vec2], n: usize) -> Vec<Vec2> {
    let k = punten.len() - 1;
    (0..=n)
        .map(|i| {
            let t = i as f32 / n as f32 * k as f32;
            let j = (t.floor() as usize).min(k - 1);
            let w = t - j as f32;
            let p = |m: isize| punten[(j as isize + m).clamp(0, k as isize) as usize];
            let (p0, p1, p2, p3) = (p(-1), p(0), p(1), p(2));
            let v0 = (p2 - p0) * 0.5;
            let v1 = (p3 - p1) * 0.5;
            let (w2, w3) = (w * w, w * w * w);
            (2.0 * p1 - 2.0 * p2 + v0 + v1) * w3
                + (-3.0 * p1 + 3.0 * p2 - 2.0 * v0 - v1) * w2
                + v0 * w
                + p1
        })
        .collect()
}

/// Het profiel (straal, hoogte) van het midden van de onderkant naar de top van de kop.
pub fn profiel() -> Vec<Vec2> {
    let v = |r: f32, y: f32| Vec2::new(r, y + ZAKT);
    let buik = [
        v(0.2, -0.17),
        v(0.275, -0.125),
        v(0.345, -0.03),
        v(0.395, 0.08),
        v(0.412, 0.19),
        v(0.402, 0.29),
        v(0.372, 0.365),
    ];
    let kop = [v(0.33, 0.418), v(0.25, 0.44), v(0.13, 0.452), v(0.0, 0.456)];
    let mut p = vec![v(0.0, -0.17)];
    p.extend(vloeiend(&buik, 18));
    p.extend([v(0.352, 0.398), v(0.34, 0.412)]);
    p.extend(vloeiend(&kop, 8));
    p.dedup_by(|a, b| a.distance(*b) < 1e-5);
    p
}

/// De straal van de pion op hoogte `y` (de breedste plek op die hoogte).
pub fn straal_op(profiel: &[Vec2], y: f32) -> f32 {
    profiel
        .windows(2)
        .filter_map(|w| {
            let (a, b) = (w[0], w[1]);
            let (lo, hi) = (a.y.min(b.y), a.y.max(b.y));
            if y < lo || y > hi {
                return None;
            }
            if (b.y - a.y).abs() < 1e-6 {
                return Some(a.x.max(b.x));
            }
            Some(a.x + (b.x - a.x) * (y - a.y) / (b.y - a.y))
        })
        .fold(0.0, f32::max)
}

/// De normaal (naar buiten) van elk punt van het profiel. Bij een knik (de kraag, de rand van de
/// onderkant) krijgt elk stuk zijn eigen normaal: daar komt een punt dubbel in de mesh.
fn normalen(p: &[Vec2]) -> Vec<(Vec2, Vec2)> {
    let stuk = |a: Vec2, b: Vec2| {
        let d = (b - a).normalize_or_zero();
        Vec2::new(d.y, -d.x)
    };
    (0..p.len())
        .map(|i| {
            let voor = (i > 0).then(|| stuk(p[i - 1], p[i]));
            let na = (i + 1 < p.len()).then(|| stuk(p[i], p[i + 1]));
            match (voor, na) {
                (Some(a), Some(b)) if a.dot(b) < 0.8 => (a, b),
                (Some(a), Some(b)) => {
                    let n = (a + b).normalize_or(Vec2::Y);
                    (n, n)
                }
                (Some(a), None) | (None, Some(a)) => (a, a),
                (None, None) => (Vec2::Y, Vec2::Y),
            }
        })
        .collect()
}

/// De pion als mesh, zoals Bevy hem wil.
#[derive(Debug, Default)]
pub struct Mesh {
    pub plekken: Vec<[f32; 3]>,
    pub normalen: Vec<[f32; 3]>,
    pub uv: Vec<[f32; 2]>,
    pub driehoeken: Vec<u32>,
}

/// Draai het profiel rond de as, in `rondom` stukjes. Het profiel mag `afwijking` van het
/// echte afwijken (minder punten).
pub fn mesh((rondom, afwijking): (usize, f32)) -> Mesh {
    let p = profiel();
    let n = normalen(&p);
    let gekozen = vereenvoudig(&p, afwijking);
    let mut m = Mesh::default();
    // Per punt van het profiel één ring, of twee bij een knik (onder en boven met elk hun normaal).
    let mut ringen: Vec<(u32, u32)> = Vec::new();
    for &j in &gekozen {
        let q = p[j];
        let (onder, boven) = n[j];
        let ring = |nrm: Vec2, m: &mut Mesh| {
            let begin = m.plekken.len() as u32;
            for i in 0..=rondom {
                let a = TAU * i as f32 / rondom as f32;
                let (s, c) = a.sin_cos();
                let plek = Vec3::new(q.x * c, q.y, q.x * s);
                m.plekken.push(plek.to_array());
                m.normalen.push(
                    Vec3::new(nrm.x * c, nrm.y, nrm.x * s)
                        .normalize()
                        .to_array(),
                );
                m.uv.push(
                    ((Vec2::new(plek.x, plek.z) / STEEN_BEREIK + Vec2::ONE) / 2.0).to_array(),
                );
            }
            begin
        };
        let a = ring(onder, &mut m);
        let b = if onder == boven {
            a
        } else {
            ring(boven, &mut m)
        };
        ringen.push((a, b));
    }
    for (k, w) in gekozen.windows(2).enumerate() {
        let onder = ringen[k].1;
        let boven = ringen[k + 1].0;
        for i in 0..rondom as u32 {
            let (a, b) = (onder + i, onder + i + 1);
            let (c, d) = (boven + i + 1, boven + i);
            // Op de as valt een vierhoek samen tot een driehoek: laat de lege helft weg.
            if p[w[0]].x > 1e-6 {
                m.driehoeken.extend([a, d, b]);
            }
            if p[w[1]].x > 1e-6 {
                m.driehoeken.extend([b, d, c]);
            }
        }
    }
    m
}

/// Welke punten van de lijn `p` overblijven als de lijn hoogstens `afwijking` mag verschuiven
/// (Ramer-Douglas-Peucker). Het eerste en laatste punt blijven altijd.
fn vereenvoudig(p: &[Vec2], afwijking: f32) -> Vec<usize> {
    fn stuk(p: &[Vec2], van: usize, tot: usize, afwijking: f32, uit: &mut Vec<usize>) {
        let (a, b) = (p[van], p[tot]);
        let (mut verst, mut waar) = (0.0, van);
        for (i, q) in p.iter().enumerate().take(tot).skip(van + 1) {
            let t = ((*q - a).dot(b - a) / (b - a).length_squared().max(1e-12)).clamp(0.0, 1.0);
            let d = q.distance(a + (b - a) * t);
            if d > verst {
                verst = d;
                waar = i;
            }
        }
        if verst > afwijking && waar != van {
            stuk(p, van, waar, afwijking, uit);
            stuk(p, waar, tot, afwijking, uit);
        } else {
            uit.push(tot);
        }
    }
    let mut uit = vec![0];
    stuk(p, 0, p.len() - 1, afwijking, &mut uit);
    uit
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::lak::GAT_STRAAL;

    #[test]
    fn de_steen_is_een_brede_kraal_die_in_zijn_gat_zakt() {
        let p = profiel();
        let breedst = p.iter().map(|q| q.x).fold(0.0, f32::max);
        assert!((breedst - STRAAL).abs() < 2e-3, "{breedst}");
        // Breder dan het gat: hij valt er niet in. Op de hoogte van het bord past hij er net in.
        const { assert!(STRAAL > GAT_STRAAL) };
        let op_het_bord = straal_op(&p, ZAKT);
        assert!(op_het_bord < GAT_STRAAL, "{op_het_bord}");
        // Lager dan breed: een kraal, geen pion.
        const { assert!(HOOGTE - ZAKT < 2.0 * STRAAL) };
        // De kop is breed genoeg voor het teken (de bies ligt op 0,292).
        assert!(straal_op(&p, HOOGTE - 0.04) > 0.292);
    }

    #[test]
    fn profiel_gaat_van_onder_naar_boven_zonder_sprongen() {
        let p = profiel();
        assert_eq!(p[0], Vec2::ZERO);
        assert!((p.last().unwrap().y - HOOGTE).abs() < 1e-5);
        assert_eq!(p.last().unwrap().x, 0.0);
        for w in p.windows(2) {
            let d = w[0].distance(w[1]);
            let onderkant = w[0].y < 1e-4 && w[1].y < 1e-4;
            assert!(d > 1e-5 && (d < 0.1 || onderkant), "{w:?}");
        }
        assert!(p.iter().all(|q| q.x >= 0.0 && q.x <= STRAAL + 1e-3));
        assert!(p.iter().all(|q| q.y >= -1e-4 && q.y <= HOOGTE + 1e-4));
    }

    #[test]
    fn grof_is_lichter_en_even_groot() {
        let fijn = mesh(FIJN);
        let grof = mesh(GROF);
        assert!(grof.driehoeken.len() * 2 < fijn.driehoeken.len());
        assert!(
            fijn.driehoeken.len() / 3 < 3000,
            "{}",
            fijn.driehoeken.len() / 3
        );
        let hoogste = |m: &Mesh| m.plekken.iter().map(|p| p[1]).fold(0.0, f32::max);
        assert_eq!(hoogste(&fijn), hoogste(&grof));
        let breedste = |m: &Mesh| m.plekken.iter().map(|p| p[0]).fold(0.0, f32::max);
        assert!((breedste(&fijn) - breedste(&grof)).abs() < 2e-3);
    }

    #[test]
    fn mesh_is_heel_en_wijst_naar_buiten() {
        for versie in [FIJN, GROF] {
            let m = mesh(versie);
            let n = m.plekken.len();
            assert_eq!(m.normalen.len(), n);
            assert_eq!(m.uv.len(), n);
            assert!(m.driehoeken.iter().all(|&i| (i as usize) < n));
            for nrm in &m.normalen {
                assert!((Vec3::from(*nrm).length() - 1.0).abs() < 1e-3);
            }
            for q in &m.plekken {
                assert!(Vec2::new(q[0], q[2]).length() <= STRAAL + 1e-3);
                assert!((-1e-4..=HOOGTE + 1e-4).contains(&q[1]));
            }
            // Het plaatje ligt er van boven op: het midden van de kop is het midden van het plaatje.
            let top = m
                .plekken
                .iter()
                .position(|q| (q[1] - HOOGTE).abs() < 1e-5)
                .unwrap();
            assert!((Vec2::from(m.uv[top]) - Vec2::splat(0.5)).length() < 1e-4);
            // Elke driehoek draait de goede kant op.
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
    }

    #[test]
    fn straal_op_hoogte() {
        let p = profiel();
        assert!((straal_op(&p, 0.19 + ZAKT) - STRAAL).abs() < 2e-3);
        assert!(straal_op(&p, 0.01) < 0.25);
        assert_eq!(straal_op(&p, HOOGTE + 0.1), 0.0);
    }
}
