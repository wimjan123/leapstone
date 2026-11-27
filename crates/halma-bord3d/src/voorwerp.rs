//! Voorwerpen op de tafel (taak 178): knoppen die echte dingen zijn, zoals in prototype 1b. Platen van
//! porselein en lak, een naamplaat, een lade met een telraam, een schijf van messing, en wat versiering
//! (een kom thee, een zegelsteen). Gewoon rekenwerk zonder Bevy, zodat de tests snel draaien.
//!
//! De web-app legt de voorwerpen neer (`zet_voorwerpen`, zie `docs/bord3d.md`, "Voorwerpen"): soort,
//! plek en maat in vakken, zoals de plekken van het bord. Het plaatje met tekst en pictogram komt uit de
//! browser (`web/src/knopplaten`) en ligt op de bovenkant. Bevy tekent ze, drukt ze in en zegt waar ze
//! op het scherm staan; boven elk voorwerp ligt een onzichtbare HTML-knop. Het beslist niets.
//!
//! Een voorwerp staat op de tafel (`TAFEL_Y`); y = 0 is de onderkant, `hoogte` de bovenkant. Het plaatje
//! ligt zo dat zijn bovenrand aan de kant van -z ligt (achteraan, gezien vanaf de Speler).

use glam::{Quat, Vec2, Vec3};
use std::f32::consts::{FRAC_PI_2, PI, TAU};

use crate::camera::{Camera, draai_xz};
use crate::lak::{Deel, TAFEL_Y};

/// Getallen per voorwerp in `zet_voorwerpen`: soort, x, z, breedte, diepte, hoogte, gespiegeld.
pub const VELDEN: usize = 7;

/// Hoeveel van zijn hoogte een voorwerp zakt als het helemaal ingedrukt is. Het prototype had 0,16; dat
/// was in een stilstaand beeld bijna niet te zien (council, taak 206).
pub const INDRUK: f32 = 0.3;

/// Hoeveel donkerder de bovenkant wordt als het voorwerp helemaal ingedrukt is (taak 206): zakken alleen
/// viel naast een duim nauwelijks op.
pub const DONKER: f32 = 0.15;

/// De helderheid van het plaatje bij indrukken `druk` (0 los, 1 helemaal ingedrukt): 1 tot 1 - `DONKER`.
pub fn helderheid(druk: f32) -> f32 {
    1.0 - DONKER * druk.clamp(0.0, 1.0)
}

/// Wat voor voorwerp. Het getal is hoe de web-app het noemt (`SOORT` in `web/src/voorwerpen.ts`).
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Soort {
    /// Porselein met craquelé op een voet van celadon (de lichte knoppen).
    Porselein = 0,
    /// Gesneden rood lak met een draak (Play).
    Rood = 1,
    /// Zwart lak met een gouden draak (Play online).
    Zwart = 2,
    /// Een naamplaat van zwart lak met goud (de naam Leapstone, of een Spelersnaam).
    Naamplaat = 3,
    /// De lade van zwart lak met een telraam: twee kralen als schakelaar (Sound, Vibration).
    Lade = 4,
    /// Messing met een pictogram (My games): rond als hij even breed als diep is, anders een plaatje
    /// met afgeronde hoeken en de naam onder het pictogram (taak 206).
    Messing = 5,
    /// Versiering: een kom met schotel van celadon, met thee.
    Kom = 6,
    /// Versiering: een zegelsteen van zeepsteen naast een doosje rode zegelpasta.
    Zegel = 7,
    /// Een plaatje van jade met een kwast van rode zijde: wijst aan wie aan de beurt is (taak 179).
    Jade = 8,
    /// Een blad van rood lak met een rand van zwart lak, waar knoppen op liggen (taak 179). Geen plaatje.
    Blad = 9,
}

impl Soort {
    pub fn van_getal(n: f32) -> Option<Soort> {
        Some(match n.round() as i32 {
            0 => Soort::Porselein,
            1 => Soort::Rood,
            2 => Soort::Zwart,
            3 => Soort::Naamplaat,
            4 => Soort::Lade,
            5 => Soort::Messing,
            6 => Soort::Kom,
            7 => Soort::Zegel,
            8 => Soort::Jade,
            9 => Soort::Blad,
            _ => return None,
        })
    }

    /// Heeft dit voorwerp een plaatje op de bovenkant?
    pub fn heeft_plaat(self) -> bool {
        !matches!(self, Soort::Kom | Soort::Zegel | Soort::Blad)
    }
}

/// Eén voorwerp op de tafel. `midden`: (x, z) in vakken; maat in vakken.
#[derive(Clone, Debug, PartialEq)]
pub struct Voorwerp {
    pub soort: Soort,
    pub midden: Vec2,
    pub breedte: f32,
    pub diepte: f32,
    pub hoogte: f32,
    /// Van rechts naar links (Arabisch, Hebreeuws, Urdu): de lade zet Sound rechts.
    pub spiegel: bool,
}

impl Voorwerp {
    /// Rond van boven gezien (vorm, schaduw en plek op het scherm)? De kom altijd, messing alleen als
    /// hij even breed als diep is.
    pub fn rond(&self) -> bool {
        match self.soort {
            Soort::Kom => true,
            Soort::Messing => (self.breedte - self.diepte).abs() < 1e-3,
            _ => false,
        }
    }
}

/// De voorwerpen uit de lijst van de web-app (`VELDEN` getallen per voorwerp). Een onbekende soort, of
/// een maat die niet groter is dan 0, telt niet mee: de rest blijft op zijn plek in de lijst (als `None`),
/// zodat de nummers van de voorwerpen niet verschuiven.
pub fn lees(lijst: &[f32]) -> Vec<Option<Voorwerp>> {
    lijst
        .chunks_exact(VELDEN)
        .map(|v| {
            let soort = Soort::van_getal(v[0])?;
            let ok = v.iter().all(|x| x.is_finite()) && v[3] > 0.0 && v[4] > 0.0 && v[5] > 0.0;
            ok.then(|| Voorwerp {
                soort,
                midden: Vec2::new(v[1], v[2]),
                breedte: v[3],
                diepte: v[4],
                hoogte: v[5],
                spiegel: v[6] > 0.5,
            })
        })
        .collect()
}

impl Voorwerp {
    /// De hoeken (of bij een rond voorwerp punten op de rand) van de bovenkant in de wereld, met
    /// indrukken `druk` (0 tot 1).
    pub fn bovenkant(&self, druk: f32, draai: f32) -> Vec<Vec3> {
        let y = TAFEL_Y + self.hoogte * (1.0 - INDRUK * druk.clamp(0.0, 1.0));
        self.omtrek(draai)
            .into_iter()
            .map(|p| Vec3::new(p.x, y, p.y))
            .collect()
    }

    /// De omtrek van boven (x, z) in de wereld. `draai`: de tafel is om de y-as gedraaid met deze hoek
    /// (een online Speler kijkt vanaf zijn eigen kant; de voorwerpen draaien mee, zodat ze voor hem onder
    /// het bord blijven liggen). 0: zoals de web-app ze neerlegt.
    pub fn omtrek(&self, draai: f32) -> Vec<Vec2> {
        let (b, d) = (self.breedte / 2.0, self.diepte / 2.0);
        let midden = self.wereld_midden(draai);
        if self.rond() {
            (0..16)
                .map(|i| {
                    let a = TAU * i as f32 / 16.0;
                    midden + draai_xz(Vec2::new(a.cos() * b, a.sin() * d), draai)
                })
                .collect()
        } else {
            [(-b, -d), (b, -d), (b, d), (-b, d)]
                .map(|(x, z)| midden + draai_xz(Vec2::new(x, z), draai))
                .to_vec()
        }
    }

    /// Het midden (x, z) in de wereld, met de tafel gedraaid met `draai`.
    pub fn wereld_midden(&self, draai: f32) -> Vec2 {
        draai_xz(self.midden, draai)
    }

    /// Waar de bovenkant op het scherm staat (CSS-pixels): links, boven, rechts, onder. Daar ligt de
    /// onzichtbare HTML-knop van dit voorwerp. `None` als hij (deels) achter de camera ligt.
    pub fn scherm_vak(&self, cam: &Camera) -> Option<[f32; 4]> {
        let mut vak = [f32::MAX, f32::MAX, f32::MIN, f32::MIN];
        for p in self.bovenkant(0.0, cam.draai) {
            let s = cam.naar_scherm(p)?;
            vak = [
                vak[0].min(s.x),
                vak[1].min(s.y),
                vak[2].max(s.x),
                vak[3].max(s.y),
            ];
        }
        Some(vak)
    }

    /// Bij de lade: waar kraal `deel` (0 Sound, 1 Vibration) op de stang ligt (x ten opzichte van het
    /// midden), aan of uit. Aan ligt naar het midden van de lade toe, uit tegen de vaste kraal.
    pub fn kraal_x(&self, deel: usize, aan: bool) -> f32 {
        let baai = self.breedte / 2.0 - 0.14;
        let rechts = (deel == 1) != self.spiegel;
        // Voor de linker baai; de rechter is gespiegeld. Aan lag eerst tegen het midden: dan lagen de twee
        // rode kralen tegen elkaar, boven het woord van de ander (council, taak 206). Nu boven het eigen woord.
        let (uit, aan_x) = (-baai + 0.1 + 0.42 + 0.55, -baai * 0.4);
        let x = if aan { aan_x } else { uit };
        if rechts { -x } else { x }
    }

    /// De vaste kraal aan de uit-kant van baai `deel`.
    pub fn vaste_kraal_x(&self, deel: usize) -> f32 {
        let baai = self.breedte / 2.0 - 0.14;
        let rechts = (deel == 1) != self.spiegel;
        let x = -baai + 0.1 + 0.42;
        if rechts { -x } else { x }
    }
}

/// Alles wat bij een tafel-camera in beeld moet: de rand van het bord en de voorwerpen, met een kleine
/// marge rond elk voorwerp (zijn schaduw).
pub fn tafel_punten(bord_rand: &[Vec2], voorwerpen: &[Voorwerp]) -> Vec<Vec2> {
    let mut punten = bord_rand.to_vec();
    for v in voorwerpen {
        let (b, d) = (v.breedte / 2.0 + 0.15, v.diepte / 2.0 + 0.15);
        punten
            .extend([(-b, -d), (b, -d), (b, d), (-b, d)].map(|(x, z)| v.midden + Vec2::new(x, z)));
    }
    punten
}

/// Het materiaal van een onderdeel. `Plaat` is het materiaal van het voorwerp zelf (met zijn plaatje);
/// de andere zijn gedeeld.
#[derive(Clone, Copy, Debug, PartialEq, Eq, Hash)]
pub enum Stof {
    Plaat,
    /// De voet onder porselein, de kom, het doosje.
    Celadon,
    /// Zwart lak (de stijlen van het telraam, de vaste kralen).
    Lak,
    /// Glad rood lak (de kralen).
    RoodGlad,
    Messing,
    Thee,
    Zeepsteen,
    Pasta,
    /// Rode zijde (de kwast van de jade aanwijzer).
    Zijde,
}

/// Wat een onderdeel doet: stilliggen, of een kraal van het telraam zijn (die schuift bij aan en uit).
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Rol {
    Vast,
    Kraal(usize),
}

/// Eén mesh van een voorwerp, met zijn plek ten opzichte van het voorwerp (y = 0 is de tafel).
pub struct Onderdeel {
    pub deel: Deel,
    pub stof: Stof,
    pub plek: Vec3,
    pub draai: Quat,
    pub schaal: Vec3,
    pub rol: Rol,
    /// Werpt een schaduw (het oppervlak van de thee en de pasta niet).
    pub werpt: bool,
}

fn onderdeel(deel: Deel, stof: Stof, plek: Vec3) -> Onderdeel {
    Onderdeel {
        deel,
        stof,
        plek,
        draai: Quat::IDENTITY,
        schaal: Vec3::ONE,
        rol: Rol::Vast,
        werpt: true,
    }
}

/// De meshes van een voorwerp, zoals in het prototype (`bouwPlaten`, `bouwTelraam`, `bouwSier`).
pub fn onderdelen(v: &Voorwerp) -> Vec<Onderdeel> {
    let (b, d, h) = (v.breedte, v.diepte, v.hoogte);
    match v.soort {
        Soort::Porselein => {
            // Een plaatje van porselein op een voet van celadon: twee lagen.
            let rug = h * 0.42;
            vec![
                onderdeel(
                    plaat(b, d, rug, 0.22, 0.05, false),
                    Stof::Celadon,
                    Vec3::ZERO,
                ),
                onderdeel(
                    plaat(b, d, h - rug, 0.22, 0.07, false),
                    Stof::Plaat,
                    Vec3::Y * rug,
                ),
            ]
        }
        Soort::Rood | Soort::Zwart | Soort::Naamplaat => {
            vec![onderdeel(
                plaat(b, d, h, 0.2, 0.08, false),
                Stof::Plaat,
                Vec3::ZERO,
            )]
        }
        Soort::Messing => {
            let rond = v.rond();
            vec![onderdeel(
                plaat(b, d, h, if rond { 0.0 } else { 0.24 }, 0.05, rond),
                Stof::Plaat,
                Vec3::ZERO,
            )]
        }
        Soort::Jade => jade(v),
        Soort::Blad => blad(v),
        Soort::Lade => telraam(v),
        Soort::Kom => kom(),
        Soort::Zegel => zegel(),
    }
}

/// Een jade plaatje met een kwast van rode zijde aan de rechterkant, zoals het prototype (`bouwPlaten`):
/// een gouden kraal, een bolletje zijde, een ring van messing en een rok. Hij ligt als een hanger op tafel.
fn jade(v: &Voorwerp) -> Vec<Onderdeel> {
    let mut uit = vec![onderdeel(
        plaat(v.breedte, v.diepte, v.hoogte, 0.12, 0.08, false),
        Stof::Plaat,
        Vec3::ZERO,
    )];
    let bol = |straal: f32| {
        draai(
            &[
                Vec2::new(0.0, -straal),
                Vec2::new(straal * 0.87, -straal * 0.5),
                Vec2::new(straal, 0.0),
                Vec2::new(straal * 0.87, straal * 0.5),
                Vec2::new(0.0, straal),
            ],
            16,
            true,
        )
    };
    let kwast = Vec3::new(v.breedte / 2.0 - 0.04, 0.0, 0.1);
    let draai_kwast = Quat::from_rotation_y(-0.16);
    let mut zet = |deel: Deel, stof: Stof, plek: Vec3, schaal: Vec3, rol: Quat| {
        let mut o = onderdeel(deel, stof, kwast + draai_kwast * plek);
        o.schaal = schaal;
        o.draai = draai_kwast * rol;
        uit.push(o);
    };
    zet(
        bol(0.085),
        Stof::Messing,
        Vec3::new(0.12, 0.1, 0.0),
        Vec3::ONE,
        Quat::IDENTITY,
    );
    zet(
        bol(0.125),
        Stof::Zijde,
        Vec3::new(0.33, 0.125, 0.0),
        Vec3::ONE,
        Quat::IDENTITY,
    );
    let rok = draai(
        &[
            Vec2::new(0.0, -0.475),
            Vec2::new(0.115, -0.475),
            Vec2::new(0.185, 0.475),
            Vec2::new(0.0, 0.475),
        ],
        18,
        false,
    );
    zet(
        rok,
        Stof::Zijde,
        Vec3::new(0.86, 0.15, 0.0),
        Vec3::new(0.8, 1.0, 0.8),
        Quat::from_rotation_z(FRAC_PI_2),
    );
    let ring = draai(
        &[
            Vec2::new(0.0, -0.035),
            Vec2::new(0.125, -0.035),
            Vec2::new(0.125, 0.035),
            Vec2::new(0.0, 0.035),
        ],
        16,
        false,
    );
    zet(
        ring,
        Stof::Messing,
        Vec3::new(0.46, 0.13, 0.0),
        Vec3::ONE,
        Quat::from_rotation_z(FRAC_PI_2),
    );
    uit
}

/// Het blad onder de knoppen van het Potje (prototype `blad`): een bodem van glad rood lak met een rand van
/// zwart lak, 0,52 hoog. De knoppen liggen erop; hun voet staat dus voor een deel in het blad.
fn blad(v: &Voorwerp) -> Vec<Onderdeel> {
    let (b, d) = (v.breedte, v.diepte);
    let mut uit = vec![onderdeel(
        plaat(b - 0.2, d - 0.2, v.hoogte, 0.25, 0.04, false),
        Stof::RoodGlad,
        Vec3::ZERO,
    )];
    for (w, t, x, z) in [
        (b, 0.2, 0.0, -d / 2.0 + 0.1),
        (b, 0.2, 0.0, d / 2.0 - 0.1),
        (0.2, d, -b / 2.0 + 0.1, 0.0),
        (0.2, d, b / 2.0 - 0.1, 0.0),
    ] {
        uit.push(onderdeel(
            plaat(w, t, 0.52, 0.08, 0.06, false),
            Stof::Lak,
            Vec3::new(x, 0.0, z),
        ));
    }
    uit
}

/// De lade met het telraam (算盘): drie stijlen van zwart lak, een stang van messing, en per baai een
/// rode kraal die schuift en een vaste zwarte kraal als aanslag. Achterin; vooraan staat de tekst.
fn telraam(v: &Voorwerp) -> Vec<Onderdeel> {
    let (b, h0) = (v.breedte, v.hoogte);
    let zs = -0.42;
    let mut uit = vec![onderdeel(
        plaat(b, v.diepte, h0, 0.2, 0.06, false),
        Stof::Plaat,
        Vec3::ZERO,
    )];
    for x in [-b / 2.0 + 0.14, 0.0, b / 2.0 - 0.14] {
        uit.push(onderdeel(
            plaat(0.2, 1.0, 0.62, 0.03, 0.02, false),
            Stof::Lak,
            Vec3::new(x, h0, zs),
        ));
    }
    let mut stang = onderdeel(
        draai(
            &[
                Vec2::new(0.0, 0.0),
                Vec2::new(0.045, 0.0),
                Vec2::new(0.045, b - 0.3),
                Vec2::new(0.0, b - 0.3),
            ],
            10,
            false,
        ),
        Stof::Messing,
        Vec3::new(-(b - 0.3) / 2.0, h0 + 0.42, zs),
    );
    stang.draai = Quat::from_rotation_z(-FRAC_PI_2);
    uit.push(stang);
    let profiel: Vec<Vec2> = [
        [0.05, -0.27],
        [0.2, -0.24],
        [0.36, -0.06],
        [0.385, 0.0],
        [0.36, 0.06],
        [0.2, 0.24],
        [0.05, 0.27],
    ]
    .map(|[r, y]| Vec2::new(r, y))
    .to_vec();
    for deel in 0..2 {
        let mut k = onderdeel(
            draai(&profiel, 28, false),
            Stof::RoodGlad,
            Vec3::new(v.kraal_x(deel, true), h0 + 0.42, zs),
        );
        k.draai = Quat::from_rotation_z(FRAC_PI_2);
        k.rol = Rol::Kraal(deel);
        uit.push(k);
        let mut vast = onderdeel(
            draai(&profiel, 20, false),
            Stof::Lak,
            Vec3::new(v.vaste_kraal_x(deel), h0 + 0.42, zs),
        );
        vast.draai = Quat::from_rotation_z(FRAC_PI_2);
        vast.schaal = Vec3::new(0.8, 0.5, 0.8);
        uit.push(vast);
    }
    uit
}

/// Een gaiwan (盖碗): kom met schotel van celadon, met thee die het licht van de lamp spiegelt.
fn kom() -> Vec<Onderdeel> {
    let p = |l: &[[f32; 2]]| l.iter().map(|&[r, y]| Vec2::new(r, y)).collect::<Vec<_>>();
    let schotel = p(&[
        [0.0, 0.05],
        [0.7, 0.05],
        [1.18, 0.16],
        [1.3, 0.3],
        [1.22, 0.3],
        [0.72, 0.16],
        [0.0, 0.14],
    ]);
    let kop = p(&[
        [0.0, 0.14],
        [0.42, 0.14],
        [0.5, 0.3],
        [0.72, 0.72],
        [0.98, 1.12],
        [1.06, 1.22],
        [1.0, 1.24],
        [0.9, 1.1],
        [0.62, 0.7],
        [0.36, 0.36],
        [0.0, 0.32],
    ]);
    let mut thee = onderdeel(schijf(0.9, 40), Stof::Thee, Vec3::Y * 1.0);
    thee.werpt = false;
    vec![
        onderdeel(draai(&schotel, 56, true), Stof::Celadon, Vec3::ZERO),
        onderdeel(draai(&kop, 56, true), Stof::Celadon, Vec3::ZERO),
        thee,
    ]
}

/// Een zegelsteen van zeepsteen naast een doosje rode zegelpasta (印泥), samen ongeveer 3 bij 2 vakken
/// rond het midden.
fn zegel() -> Vec<Onderdeel> {
    let mut blok = onderdeel(
        plaat(0.95, 0.95, 1.5, 0.1, 0.1, false),
        Stof::Zeepsteen,
        Vec3::new(-0.95, 0.0, 0.25),
    );
    blok.draai = Quat::from_rotation_y(0.3);
    let doos: Vec<Vec2> = [
        [0.0, 0.0],
        [0.78, 0.0],
        [0.86, 0.1],
        [0.86, 0.34],
        [0.78, 0.36],
        [0.7, 0.3],
        [0.0, 0.3],
    ]
    .map(|[r, y]| Vec2::new(r, y))
    .to_vec();
    let mut pasta = onderdeel(schijf(0.7, 32), Stof::Pasta, Vec3::new(0.7, 0.31, -0.2));
    pasta.werpt = false;
    vec![
        blok,
        onderdeel(
            draai(&doos, 44, true),
            Stof::Celadon,
            Vec3::new(0.7, 0.0, -0.2),
        ),
        pasta,
    ]
}

const OMHOOG: Vec3 = Vec3::Y;
const TANGENT: [f32; 4] = [1.0, 0.0, 0.0, 1.0];

/// Een plaat met afgeronde hoeken (of rond) en een afgeronde rand van boven, van y = 0 tot `h`. Het
/// plaatje ligt van boven op de hele plaat (u langs x, v langs z), ook over de afgeronde rand; de zijkant
/// krijgt de kleur van de rand van het plaatje.
pub fn plaat(b: f32, d: f32, h: f32, straal: f32, vel: f32, rond: bool) -> Deel {
    let vel = vel.min(h * 0.4).max(0.0);
    let omtrek = omtrek(b, d, straal, rond);
    let n = omtrek.len();
    let uv = |p: Vec2| Vec2::new(p.x / b + 0.5, p.y / d + 0.5);
    let mut m = Deel::default();
    // De bovenkant: een waaier vanuit het midden (de vorm is bol).
    let midden = m.punt(Vec3::new(0.0, h, 0.0), OMHOOG, uv(Vec2::ZERO), TANGENT);
    let mut vorige: Vec<u32> = omtrek
        .iter()
        .map(|&(p, nrm)| {
            let q = p - nrm * vel;
            m.punt(Vec3::new(q.x, h, q.y), OMHOOG, uv(q), TANGENT)
        })
        .collect();
    for i in 0..n {
        m.driehoek(midden, vorige[i], vorige[(i + 1) % n], OMHOOG);
    }
    // De afgeronde rand in drie stapjes, dan de zijkant tot de tafel.
    let ring = |m: &mut Deel, a: f32, y: f32| -> Vec<u32> {
        omtrek
            .iter()
            .map(|&(p, nrm)| {
                let q = p - nrm * vel * (1.0 - a.sin());
                let normaal = Vec3::new(nrm.x * a.sin(), a.cos(), nrm.y * a.sin()).normalize();
                m.punt(Vec3::new(q.x, y, q.y), normaal, uv(q), TANGENT)
            })
            .collect()
    };
    let mut lagen = Vec::new();
    for k in 1..=3 {
        let a = k as f32 / 3.0 * FRAC_PI_2;
        lagen.push((a, h - vel + vel * a.cos()));
    }
    lagen.push((FRAC_PI_2, 0.0));
    for (a, y) in lagen {
        let nieuw = ring(&mut m, a, y);
        for i in 0..n {
            let j = (i + 1) % n;
            let nrm = (omtrek[i].1 + omtrek[j].1).normalize_or_zero();
            let richting = Vec3::new(nrm.x * a.sin(), a.cos().max(0.05), nrm.y * a.sin());
            m.vierhoek(vorige[i], vorige[j], nieuw[j], nieuw[i], richting);
        }
        vorige = nieuw;
    }
    m
}

/// De omtrek van een plaat: punten met hun richting naar buiten, rond en tegen de klok in van boven.
fn omtrek(b: f32, d: f32, straal: f32, rond: bool) -> Vec<(Vec2, Vec2)> {
    if rond {
        return (0..48)
            .map(|i| {
                let a = TAU * i as f32 / 48.0;
                let n = Vec2::new(a.cos(), a.sin());
                (Vec2::new(n.x * b / 2.0, n.y * d / 2.0), n)
            })
            .collect();
    }
    let r = straal.min(b / 2.0).min(d / 2.0).max(0.005);
    let (x, z) = (b / 2.0 - r, d / 2.0 - r);
    let hoeken = [(x, z), (-x, z), (-x, -z), (x, -z)];
    let mut uit = Vec::new();
    for (k, (cx, cz)) in hoeken.into_iter().enumerate() {
        for j in 0..=6 {
            let a = k as f32 * FRAC_PI_2 + j as f32 / 6.0 * FRAC_PI_2;
            let n = Vec2::new(a.cos(), a.sin());
            uit.push((Vec2::new(cx, cz) + n * r, n));
        }
    }
    uit
}

/// Een plat rondje op y = 0, naar boven.
fn schijf(straal: f32, rondom: usize) -> Deel {
    let mut m = Deel::default();
    let midden = m.punt(Vec3::ZERO, OMHOOG, Vec2::splat(0.5), TANGENT);
    let rand: Vec<u32> = (0..rondom)
        .map(|i| {
            let a = TAU * i as f32 / rondom as f32;
            let p = Vec2::new(a.cos(), a.sin());
            m.punt(
                Vec3::new(p.x * straal, 0.0, p.y * straal),
                OMHOOG,
                p * 0.5 + 0.5,
                TANGENT,
            )
        })
        .collect();
    for i in 0..rondom {
        m.driehoek(midden, rand[i], rand[(i + 1) % rondom], OMHOOG);
    }
    m
}

/// Een profiel (straal, hoogte) rondgedraaid om de y-as. `glad`: eerst gladgestreken (Catmull-Rom),
/// zoals `draaiGeo` in het prototype. De normalen volgen het profiel (glad), naar buiten.
pub fn draai(profiel: &[Vec2], rondom: usize, glad: bool) -> Deel {
    let p = if glad {
        gladstrijken(profiel, 5)
    } else {
        profiel.to_vec()
    };
    let n = p.len();
    // De richting naar buiten per punt van het profiel: loodrecht op het profiel, gemiddeld over de
    // twee stukjes ernaast, zoals three.js `LatheGeometry`.
    let normaal_van = |a: Vec2, b: Vec2| {
        let t = (b - a).normalize_or_zero();
        Vec2::new(t.y, -t.x)
    };
    let normalen: Vec<Vec2> = (0..n)
        .map(|i| {
            let voor = (i > 0).then(|| normaal_van(p[i - 1], p[i]));
            let na = (i + 1 < n).then(|| normaal_van(p[i], p[i + 1]));
            match (voor, na) {
                (Some(a), Some(b)) => (a + b).normalize_or(a),
                (Some(a), None) | (None, Some(a)) => a,
                _ => Vec2::X,
            }
        })
        .collect();
    let maxr = p.iter().map(|q| q.x).fold(0.01, f32::max);
    let mut m = Deel::default();
    let mut ringen = Vec::new();
    for (q, nrm) in p.iter().zip(&normalen) {
        let begin = m.plekken.len() as u32;
        for i in 0..=rondom {
            let a = TAU * i as f32 / rondom as f32;
            let (s, c) = a.sin_cos();
            let plek = Vec3::new(q.x * c, q.y, q.x * s);
            let normaal = Vec3::new(nrm.x * c, nrm.y, nrm.x * s).normalize_or(Vec3::Y);
            m.punt(
                plek,
                normaal,
                Vec2::new(plek.x, plek.z) / (2.0 * maxr) + 0.5,
                TANGENT,
            );
        }
        ringen.push(begin);
    }
    for k in 0..n.saturating_sub(1) {
        let (a0, b0) = (ringen[k], ringen[k + 1]);
        for i in 0..rondom as u32 {
            let ids = [a0 + i, a0 + i + 1, b0 + i + 1, b0 + i];
            // Naar buiten: het gemiddelde van de normalen van de vier hoeken.
            let richting: Vec3 = ids
                .iter()
                .map(|&j| Vec3::from(m.normalen[j as usize]))
                .sum();
            let pos = |j: u32| Vec3::from(m.plekken[j as usize]);
            // Op de as valt een vierhoek samen tot een driehoek.
            let (onder, boven) = (
                pos(ids[0]).distance(pos(ids[1])) > 1e-6,
                pos(ids[2]).distance(pos(ids[3])) > 1e-6,
            );
            if onder {
                m.driehoek(ids[0], ids[1], ids[2], richting);
            }
            if boven {
                m.driehoek(ids[0], ids[2], ids[3], richting);
            }
        }
    }
    m
}

/// Een lijn door de punten, met `stukjes` tussenpunten per stuk (Catmull-Rom, zoals three.js `SplineCurve`).
fn gladstrijken(p: &[Vec2], stukjes: usize) -> Vec<Vec2> {
    if p.len() < 3 {
        return p.to_vec();
    }
    let mut uit = Vec::new();
    for i in 0..p.len() - 1 {
        let p0 = p[i.saturating_sub(1)];
        let (p1, p2) = (p[i], p[i + 1]);
        let p3 = p[(i + 2).min(p.len() - 1)];
        for k in 0..stukjes {
            let t = k as f32 / stukjes as f32;
            let (t2, t3) = (t * t, t * t * t);
            uit.push(
                0.5 * (2.0 * p1
                    + (p2 - p0) * t
                    + (2.0 * p0 - 5.0 * p1 + 4.0 * p2 - p3) * t2
                    + (3.0 * p1 - p0 - 3.0 * p2 + p3) * t3),
            );
        }
    }
    uit.push(*p.last().unwrap());
    uit
}

/// De zachte schaduw van een voorwerp op de tafel (prototype: `kaderVlek`): donker onder het voorwerp,
/// zacht tot `ZACHT` vakken erbuiten. Het plaatje (`maat` bij `maat`, RGBA) beslaat de omtrek plus
/// `ZACHT` aan elke kant; alleen de doorzichtigheid telt.
pub const ZACHT: f32 = 0.45;
pub fn schaduw(maat: u32, b: f32, d: f32, rond: bool) -> Vec<u8> {
    let mut uit = vec![0u8; (maat * maat * 4) as usize];
    let (hb, hd) = (b / 2.0 + ZACHT, d / 2.0 + ZACHT);
    for py in 0..maat {
        for px in 0..maat {
            let u = (px as f32 + 0.5) / maat as f32 * 2.0 - 1.0;
            let v = (py as f32 + 0.5) / maat as f32 * 2.0 - 1.0;
            let p = Vec2::new(u * hb, v * hd);
            // Afstand tot de rand (negatief binnen).
            let afstand = if rond {
                let r = (b / 2.0).min(d / 2.0);
                p.length() - r
            } else {
                let q = p.abs() - Vec2::new(b / 2.0, d / 2.0);
                q.max(Vec2::ZERO).length() + q.x.max(q.y).min(0.0)
            };
            let t = ((afstand + 0.15) / ZACHT).clamp(0.0, 1.0);
            let a = 0.55 * (1.0 - t * t * (3.0 - 2.0 * t));
            let i = ((py * maat + px) * 4) as usize;
            uit[i..i + 4].copy_from_slice(&[0, 0, 0, (a * 255.0).round() as u8]);
        }
    }
    uit
}

/// Hoe ver een voorwerp ingedrukt is na `dt` seconden, op weg naar `doel` (0 of 1): snel omlaag, iets
/// rustiger terug, zoals het prototype. Geeft de nieuwe stand en of hij nog beweegt.
pub fn druk_stap(druk: f32, doel: f32, dt: f32) -> (f32, bool) {
    let d = doel - druk;
    if d.abs() <= 0.002 {
        return (doel, false);
    }
    let snel = if doel > druk { 40.0 } else { 16.0 };
    (druk + d * (1.0 - (-dt * snel).exp()), true)
}

/// Een kraal die schuift: de voortgang van uit (0) naar aan (1) na `dt` seconden, in 0,34 s, en hoe
/// ver hij dan gedraaid is (een halve slag, zoals het prototype).
pub fn kraal_stap(t: f32, aan: bool, dt: f32) -> (f32, bool) {
    let doel = if aan { 1.0 } else { 0.0 };
    let stap = dt / 0.34;
    let nieuw = if aan {
        (t + stap).min(1.0)
    } else {
        (t - stap).max(0.0)
    };
    (nieuw, (nieuw - doel).abs() > 1e-4)
}

/// De halve slag van een kraal bij voortgang `t`, met zacht beginnen en eindigen.
pub fn kraal_draai(t: f32) -> f32 {
    let k = t.clamp(0.0, 1.0);
    PI * k * k * (3.0 - 2.0 * k)
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::camera::Venster;
    use crate::vakken::Indeling;

    fn heel(m: &Deel) {
        let n = m.plekken.len();
        assert!(n > 0);
        assert_eq!(m.normalen.len(), n);
        assert_eq!(m.uv.len(), n);
        assert_eq!(m.tangenten.len(), n);
        assert!(m.driehoeken.iter().all(|&i| (i as usize) < n));
        for nrm in &m.normalen {
            assert!((Vec3::from(*nrm).length() - 1.0).abs() < 1e-3);
        }
        for d in m.driehoeken.chunks(3) {
            let p = |i: u32| Vec3::from(m.plekken[i as usize]);
            let vlak = (p(d[1]) - p(d[0])).cross(p(d[2]) - p(d[0]));
            if vlak.length() < 1e-9 {
                continue;
            }
            let gem: Vec3 = d.iter().map(|&i| Vec3::from(m.normalen[i as usize])).sum();
            assert!(vlak.dot(gem) > 0.0, "driehoek {d:?} kijkt naar binnen");
        }
    }

    /// Het Startmenu zoals `STARTMENU` in `web/src/voorwerpen.ts` (de maten van het prototype).
    fn startmenu(spiegel: bool) -> Vec<Voorwerp> {
        let s = if spiegel { -1.0 } else { 1.0 };
        let v = |soort, x: f32, z, b, d, h| Voorwerp {
            soort,
            midden: Vec2::new(x * s, z),
            breedte: b,
            diepte: d,
            hoogte: h,
            spiegel,
        };
        vec![
            v(Soort::Naamplaat, 0.0, -12.05, 8.4, 3.0, 0.42),
            v(Soort::Messing, -6.45, -11.15, 3.6, 2.4, 0.22),
            v(Soort::Rood, -3.22, 11.15, 6.15, 2.7, 0.6),
            v(Soort::Zwart, 3.22, 11.15, 6.15, 2.7, 0.6),
            v(Soort::Porselein, -4.2, 14.25, 4.0, 2.75, 0.5),
            v(Soort::Porselein, 0.0, 14.25, 4.0, 2.75, 0.5),
            v(Soort::Porselein, 4.2, 14.25, 4.0, 2.75, 0.5),
            v(Soort::Lade, -1.95, 20.05, 8.3, 2.1, 0.34),
        ]
    }

    #[test]
    fn de_lijst_van_de_web_app_wordt_voorwerpen_en_een_fout_schuift_niets_op() {
        let lijst = [
            0.0, -4.2, 14.25, 4.0, 2.75, 0.5, 0.0, //
            99.0, 0.0, 0.0, 1.0, 1.0, 1.0, 0.0, // onbekende soort
            4.0, -1.95, 20.05, 8.3, 2.1, 0.34, 1.0,
        ];
        let v = lees(&lijst);
        assert_eq!(v.len(), 3);
        assert_eq!(v[0].as_ref().unwrap().soort, Soort::Porselein);
        assert!(v[1].is_none());
        let lade = v[2].as_ref().unwrap();
        assert_eq!(lade.soort, Soort::Lade);
        assert!(lade.spiegel);
        assert_eq!(lade.midden, Vec2::new(-1.95, 20.05));
    }

    #[test]
    fn elk_voorwerp_is_een_hele_mesh_die_naar_buiten_kijkt() {
        for v in startmenu(false).iter().chain([
            &Voorwerp {
                soort: Soort::Kom,
                midden: Vec2::ZERO,
                breedte: 2.6,
                diepte: 2.6,
                hoogte: 1.24,
                spiegel: false,
            },
            &Voorwerp {
                soort: Soort::Zegel,
                midden: Vec2::ZERO,
                breedte: 3.0,
                diepte: 1.8,
                hoogte: 1.5,
                spiegel: false,
            },
        ]) {
            for o in onderdelen(v) {
                heel(&o.deel);
            }
        }
    }

    #[test]
    fn het_plaatje_ligt_over_de_hele_bovenkant_met_de_bovenrand_achteraan() {
        let m = plaat(4.0, 2.75, 0.3, 0.22, 0.07, false);
        let boven: Vec<_> = m
            .plekken
            .iter()
            .zip(&m.uv)
            .filter(|(p, _)| (p[1] - 0.3).abs() < 1e-5)
            .collect();
        let (umin, umax) = boven.iter().fold((1.0f32, 0.0f32), |(a, b), (_, uv)| {
            (a.min(uv[0]), b.max(uv[0]))
        });
        assert!(umin > 0.0 && umin < 0.03 && umax > 0.97 && umax < 1.0);
        for (p, uv) in &m.plekken.iter().zip(&m.uv).collect::<Vec<_>>() {
            // Achteraan (-z) is de bovenrand van het plaatje (v = 0), links (-x) is u = 0.
            assert!((uv[0] - (p[0] / 4.0 + 0.5)).abs() < 1e-5);
            assert!((uv[1] - (p[2] / 2.75 + 0.5)).abs() < 1e-5);
        }
        // Zo hoog als gevraagd, en niet breder dan de plaat.
        let max = m
            .plekken
            .iter()
            .fold(Vec3::ZERO, |a, p| a.max(Vec3::from(*p).abs()));
        assert!(
            (max.y - 0.3).abs() < 1e-5
                && (max.x - 2.0).abs() < 1e-4
                && (max.z - 1.375).abs() < 1e-4
        );
    }

    #[test]
    fn de_kralen_van_de_lade_schuiven_naar_het_midden_en_spiegelen_van_rechts_naar_links() {
        let mut lade = startmenu(false)[7].clone();
        // Sound links, Vibration rechts; aan ligt dichter bij het midden dan uit.
        assert!(lade.kraal_x(0, true) < 0.0 && lade.kraal_x(1, true) > 0.0);
        for deel in 0..2 {
            assert!(lade.kraal_x(deel, true).abs() < lade.kraal_x(deel, false).abs());
            assert!(lade.vaste_kraal_x(deel).abs() > lade.kraal_x(deel, false).abs());
            // Hij blijft binnen de lade.
            assert!(lade.kraal_x(deel, false).abs() < lade.breedte / 2.0);
        }
        let links = lade.kraal_x(0, true);
        lade.spiegel = true;
        assert_eq!(lade.kraal_x(0, true), -links);
    }

    #[test]
    fn ingedrukt_is_de_bovenkant_donkerder() {
        assert_eq!(helderheid(0.0), 1.0);
        assert!((helderheid(1.0) - (1.0 - DONKER)).abs() < 1e-6);
        assert!(helderheid(0.5) < 1.0 && helderheid(0.5) > helderheid(1.0));
    }

    #[test]
    fn de_kralen_van_een_lade_die_aan_staat_liggen_niet_tegen_elkaar() {
        let lade = startmenu(false)[7].clone();
        // Tussen de twee rode kralen ligt meer dan twee kraalbreedtes (een kraal is 0,77 breed).
        assert!(lade.kraal_x(1, true) - lade.kraal_x(0, true) > 2.0 * 0.77);
    }

    #[test]
    fn indrukken_zakt_snel_en_komt_rustiger_terug() {
        let stappen = |d: &mut f32, doel: f32| {
            let mut n = 0;
            loop {
                let (nieuw, beweegt) = druk_stap(*d, doel, 1.0 / 60.0);
                *d = nieuw;
                if !beweegt {
                    return n;
                }
                n += 1;
            }
        };
        let mut d = 0.0;
        let stappen_in = stappen(&mut d, 1.0);
        let stappen_uit = stappen(&mut d, 0.0);
        assert_eq!(d, 0.0);
        assert!(
            stappen_in < stappen_uit && stappen_in < 20,
            "{stappen_in} {stappen_uit}"
        );
        // Helemaal ingedrukt zakt de bovenkant `INDRUK` (30 procent) van de hoogte.
        let v = &startmenu(false)[4];
        assert!((v.bovenkant(1.0, 0.0)[0].y - (TAFEL_Y + 0.5 * (1.0 - INDRUK))).abs() < 1e-5);
    }

    #[test]
    fn het_startmenu_past_op_een_telefoon_met_alle_knoppen_naast_elkaar() {
        let bord = Indeling::nieuw(false).rand();
        for spiegel in [false, true] {
            let voorwerpen = startmenu(spiegel);
            for scherm in [
                Vec2::new(390.0, 844.0),
                Vec2::new(360.0, 640.0),
                Vec2::new(430.0, 932.0),
            ] {
                let venster = Venster::heel(scherm);
                let cam = Camera::tafel(venster, &tafel_punten(&bord, &voorwerpen), 0.0);
                let vakken: Vec<[f32; 4]> = voorwerpen
                    .iter()
                    .map(|v| v.scherm_vak(&cam).unwrap())
                    .collect();
                for (i, a) in vakken.iter().enumerate() {
                    // Op het scherm.
                    assert!(
                        a[0] >= 0.0 && a[1] >= 0.0 && a[2] <= scherm.x && a[3] <= scherm.y,
                        "{scherm} {i} {a:?}"
                    );
                    // Groot genoeg om te raken. De kleinste is de schijf van messing; de HTML-knop erboven
                    // is minstens 44 bij 44 punten (`knopVak` in web/src/voorwerpen.ts).
                    assert!(
                        a[2] - a[0] >= 36.0 && a[3] - a[1] >= 26.0,
                        "{scherm} {i} {a:?}"
                    );
                    // Geen twee knoppen over elkaar.
                    for b in &vakken[i + 1..] {
                        let over = a[0] < b[2] - 0.5
                            && b[0] < a[2] - 0.5
                            && a[1] < b[3] - 0.5
                            && b[1] < a[3] - 0.5;
                        assert!(!over, "{scherm} {a:?} {b:?}");
                    }
                }
                // Boven en onder evenveel ruimte.
                let boven = vakken.iter().map(|v| v[1]).fold(f32::MAX, f32::min);
                let onder = vakken.iter().map(|v| v[3]).fold(f32::MIN, f32::max);
                assert!(onder <= scherm.y && boven >= 0.0);
                // De Speler leest van links naar rechts: Play links van Play online, en in het Arabisch andersom.
                assert_eq!(vakken[2][0] < vakken[3][0], !spiegel);
            }
        }
    }

    #[test]
    fn de_bovenkant_van_een_voorwerp_valt_binnen_zijn_vak_op_het_scherm() {
        let voorwerpen = startmenu(false);
        let venster = Venster::heel(Vec2::new(390.0, 844.0));
        let cam = Camera::tafel(
            venster,
            &tafel_punten(&Indeling::nieuw(false).rand(), &voorwerpen),
            0.0,
        );
        for v in &voorwerpen {
            let vak = v.scherm_vak(&cam).unwrap();
            let midden = cam
                .naar_scherm(Vec3::new(v.midden.x, TAFEL_Y + v.hoogte, v.midden.y))
                .unwrap();
            assert!(
                midden.x > vak[0] && midden.x < vak[2] && midden.y > vak[1] && midden.y < vak[3]
            );
            // Een tik op dat punt raakt de bovenkant van dit voorwerp.
            let raak = cam.grondpunt(midden, TAFEL_Y + v.hoogte).unwrap();
            assert!(raak.distance(v.midden) < 0.01);
        }
    }

    #[test]
    fn een_gedraaide_tafel_staat_op_het_scherm_zoals_een_ongedraaide() {
        // Taak 179: een online Speler kijkt vanaf zijn eigen kant (draai). De voorwerpen draaien mee, dus ze
        // liggen op het scherm op dezelfde plek, en een tik op een voorwerp raakt nog steeds dat voorwerp.
        let voorwerpen = startmenu(false);
        let venster = Venster::heel(Vec2::new(390.0, 844.0));
        let rand = Indeling::nieuw(false).rand();
        let recht = Camera::tafel(venster, &tafel_punten(&rand, &voorwerpen), 0.0);
        for hoek in [FRAC_PI_2, PI, 2.0 * PI / 3.0, -1.0] {
            let cam = Camera::tafel(venster, &tafel_punten(&rand, &voorwerpen), hoek);
            for v in &voorwerpen {
                let (a, b) = (v.scherm_vak(&recht).unwrap(), v.scherm_vak(&cam).unwrap());
                assert!(
                    a.iter().zip(&b).all(|(x, y)| (x - y).abs() < 0.05),
                    "{hoek} {a:?} {b:?}"
                );
                let midden = cam
                    .naar_scherm(Vec3::new(
                        v.wereld_midden(hoek).x,
                        TAFEL_Y + v.hoogte,
                        v.wereld_midden(hoek).y,
                    ))
                    .unwrap();
                let raak = cam.grondpunt(midden, TAFEL_Y + v.hoogte).unwrap();
                assert!(raak.distance(v.wereld_midden(hoek)) < 0.01);
            }
        }
    }

    #[test]
    fn de_jade_aanwijzer_en_het_blad_hebben_onderdelen() {
        let jade = Voorwerp {
            soort: Soort::Jade,
            midden: Vec2::ZERO,
            breedte: 3.7,
            diepte: 1.16,
            hoogte: 0.26,
            spiegel: false,
        };
        let o = onderdelen(&jade);
        assert!(
            o.len() >= 5
                && o.iter().any(|d| d.stof == Stof::Zijde)
                && o.iter().any(|d| d.stof == Stof::Plaat)
        );
        assert!(Soort::Jade.heeft_plaat() && !Soort::Blad.heeft_plaat());
        let blad = Voorwerp {
            soort: Soort::Blad,
            midden: Vec2::ZERO,
            breedte: 12.5,
            diepte: 3.5,
            hoogte: 0.14,
            spiegel: false,
        };
        let o = onderdelen(&blad);
        assert_eq!(o.len(), 5);
        assert!(o.iter().all(|d| d.stof != Stof::Plaat));
        for d in o.iter().chain(&onderdelen(&jade)) {
            heel(&d.deel);
        }
    }

    #[test]
    fn de_schaduw_is_donker_onder_het_voorwerp_en_leeg_aan_de_rand() {
        let s = schaduw(32, 4.0, 2.75, false);
        let a = |x: u32, y: u32| s[((y * 32 + x) * 4 + 3) as usize];
        assert!(a(16, 16) > 120);
        assert_eq!(a(0, 0), 0);
        assert_eq!(a(31, 16), 0);
    }
}
