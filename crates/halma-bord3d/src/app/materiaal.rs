//! Het eigen materiaal voor de ring om de gekozen Steen, het materiaal van de vaste laag (tafel en voorwerpen, taak 190),
//! en het maken van plaatjes voor Bevy.
//!
//! Al het andere is Bevy's gewone `StandardMaterial` met één lamp, schaduw en een omgevingskaart
//! (ontwerp 1b, taak 177).

use bevy::asset::{RenderAssetUsages, uuid_handle};
use bevy::image::{ImageAddressMode, ImageFilterMode, ImageSampler, ImageSamplerDescriptor};
use bevy::mesh::MeshVertexBufferLayoutRef;
use bevy::pbr::{ExtendedMaterial, MaterialExtension, MaterialPipeline, MaterialPipelineKey};
use bevy::prelude::*;
use bevy::render::render_resource::{
    AsBindGroup, CompareFunction, Extent3d, RenderPipelineDescriptor, SpecializedMeshPipelineError,
    TextureDimension, TextureFormat, TextureViewDescriptor, TextureViewDimension,
};
use bevy::shader::{Shader, ShaderRef};

const OVERLAY_SHADER: Handle<Shader> = uuid_handle!("6b0f1f5e-8d0c-4c35-9f2b-3f7a0c1e5a05");
const VAST_SHADER: Handle<Shader> = uuid_handle!("0b6c2a8e-5d1f-4f7a-9c3e-2e8d6b4a1f90");

pub struct Materialen;

impl Plugin for Materialen {
    fn build(&self, app: &mut App) {
        let mut shaders = app.world_mut().resource_mut::<Assets<Shader>>();
        let _ = shaders.insert(
            OVERLAY_SHADER.id(),
            Shader::from_wesl(
                include_str!("../shaders/overlay.wesl"),
                "embedded://halma_bord3d/overlay.wesl",
            ),
        );
        let _ = shaders.insert(
            VAST_SHADER.id(),
            Shader::from_wesl(
                include_str!("../shaders/vast.wesl"),
                "embedded://halma_bord3d/vast.wesl",
            ),
        );
        app.add_plugins((
            MaterialPlugin::<Overlay>::default(),
            MaterialPlugin::<VastMateriaal>::default(),
        ));
    }
}

/// Een tekening in één kleur die altijd bovenop komt, ook over de stenen heen (de ring om de
/// gekozen steen), maar onder de voorwerpen (taak 190). De doorzichtigheid komt uit de textuur.
#[derive(Asset, TypePath, AsBindGroup, Clone)]
pub struct Overlay {
    /// Kleur (lineair); a: hoe sterk.
    #[uniform(0)]
    pub kleur: Vec4,
    #[texture(1)]
    #[sampler(2)]
    pub textuur: Handle<Image>,
}

impl Material for Overlay {
    fn fragment_shader() -> ShaderRef {
        ShaderRef::Handle(OVERLAY_SHADER)
    }

    fn alpha_mode(&self) -> AlphaMode {
        AlphaMode::Blend
    }

    fn specialize(
        _pipeline: &MaterialPipeline,
        descriptor: &mut RenderPipelineDescriptor,
        _layout: &MeshVertexBufferLayoutRef,
        _key: MaterialPipelineKey<Self>,
    ) -> Result<(), SpecializedMeshPipelineError> {
        // De diepte komt uit de shader (0,49): boven bord en Stenen, onder de voorwerpen van de vaste laag (taak 190).
        if let Some(diepte) = descriptor.depth_stencil.as_mut() {
            diepte.depth_compare = Some(CompareFunction::GreaterEqual);
            diepte.depth_write_enabled = Some(false);
        }
        Ok(())
    }
}

/// Het materiaal van de vaste laag (taak 190): de tafel en de voorwerpen (naamplaten, jade aanwijzer, blad met knoppen, kom,
/// zegel). Gewoon Bevy's `StandardMaterial` (licht, schaduw van de lamp en omgevingskaart als altijd), maar getekend met de
/// vaste camera van het overzicht in plaats van de camera die zoomt: zoomt de Speler in, dan zoomt alleen het bord.
pub type VastMateriaal = ExtendedMaterial<StandardMaterial, Vast>;

/// Waar de vaste camera staat, en in welke laag van de diepte dit materiaal tekent.
#[derive(Asset, TypePath, AsBindGroup, Clone, Debug, Default)]
pub struct Vast {
    /// Van de wereld naar het beeld van de vaste camera (projectie maal zicht), zoals Bevy zijn `clip_from_world` maakt.
    #[uniform(100)]
    pub klem: Mat4,
    /// Waar de vaste camera staat (x, y, z, 1): de glans en de spiegeling kijken vanaf daar.
    #[uniform(101)]
    pub oog: Vec4,
    /// De diepte van een beeldpunt wordt `diepte.x * z + diepte.y` (z van 0 ver tot 1 dichtbij, zoals Bevy): de tafel
    /// ligt zo altijd achter het bord (`ACHTER`), de voorwerpen altijd ervoor (`VOOR`).
    #[uniform(102)]
    pub diepte: Vec4,
}

impl Vast {
    /// De tafel: altijd achter het bord (het verste stuk bord ligt nog altijd dichterbij dan 0,0004).
    pub const ACHTER: Vec4 = Vec4::new(0.04, 0.0, 0.0, 0.0);
    /// De voorwerpen: altijd voor het bord en de Stenen (die liggen nooit dichterbij dan 0,4), onderling in de goede volgorde.
    pub const VOOR: Vec4 = Vec4::new(0.5, 0.5, 0.0, 0.0);

    pub fn nieuw(diepte: Vec4) -> Vast {
        Vast {
            klem: Mat4::IDENTITY,
            oog: Vec4::new(0.0, 60.0, 10.0, 1.0),
            diepte,
        }
    }
}

impl MaterialExtension for Vast {
    fn vertex_shader() -> ShaderRef {
        ShaderRef::Handle(VAST_SHADER)
    }

    fn fragment_shader() -> ShaderRef {
        ShaderRef::Handle(VAST_SHADER)
    }
}

/// Een vierkante textuur. `mipmaps`: met kleinere versies, zodat hij van ver niet flikkert
/// (de lijst moet dan RGBA zijn, `maat` een macht van twee). `herhaal`: de textuur herhaalt zich.
pub fn afbeelding(
    data: Vec<u8>,
    maat: u32,
    formaat: TextureFormat,
    mipmaps: bool,
    herhaal: bool,
) -> Image {
    rechthoek(data, maat, maat, formaat, mipmaps, herhaal)
}

/// Als `afbeelding`, voor een plaatje van `breedte` bij `hoogte`.
pub fn rechthoek(
    data: Vec<u8>,
    breedte: u32,
    hoogte: u32,
    formaat: TextureFormat,
    mipmaps: bool,
    herhaal: bool,
) -> Image {
    let (data, niveaus) = if mipmaps {
        crate::textuur::mipmaps_rechthoek(data, breedte, hoogte)
    } else {
        (data, 1)
    };
    let mut image = Image::new(
        Extent3d {
            width: breedte,
            height: hoogte,
            depth_or_array_layers: 1,
        },
        TextureDimension::D2,
        Vec::new(),
        formaat,
        RenderAssetUsages::RENDER_WORLD,
    );
    image.data = Some(data);
    image.texture_descriptor.mip_level_count = niveaus;
    let rand = if herhaal {
        ImageAddressMode::Repeat
    } else {
        ImageAddressMode::ClampToEdge
    };
    image.sampler = ImageSampler::Descriptor(ImageSamplerDescriptor {
        address_mode_u: rand,
        address_mode_v: rand,
        mag_filter: ImageFilterMode::Linear,
        min_filter: ImageFilterMode::Linear,
        mipmap_filter: ImageFilterMode::Linear,
        anisotropy_clamp: if mipmaps { 8 } else { 1 },
        ..default()
    });
    image
}

/// Een kubuskaart van de omgeving in RGB9E5 (`web/scripts/bak-bord3d/omgeving.mjs`): zes zijden van
/// `maat`, elk met zijn niveaus achter elkaar (de glans heeft er acht, het vullicht één). Het aantal
/// niveaus volgt uit de lengte. `None` als de lengte bij geen enkel aantal past.
pub fn kubus(data: Vec<u8>, maat: u32) -> Option<Image> {
    let meeste = maat.max(1).ilog2() + 1;
    let niveaus = (1..=meeste).find(|&n| {
        let per_zijde: u32 = (0..n).map(|i| (maat >> i).max(1).pow(2)).sum();
        data.len() == (per_zijde * 6 * 4) as usize
    })?;
    let mut image = Image::new(
        Extent3d {
            width: maat,
            height: maat,
            depth_or_array_layers: 6,
        },
        TextureDimension::D2,
        Vec::new(),
        TextureFormat::Rgb9e5Ufloat,
        RenderAssetUsages::RENDER_WORLD,
    );
    image.data = Some(data);
    image.texture_descriptor.mip_level_count = niveaus;
    image.texture_view_descriptor = Some(TextureViewDescriptor {
        dimension: Some(TextureViewDimension::Cube),
        ..default()
    });
    Some(image)
}
