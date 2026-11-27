//! Kleinere groepjes meshgegevens op WebGL2, zodat de vertex-shader minder uniforms gebruikt.
//!
//! Op WebGL2 zet Bevy de gegevens van een groepje meshes (positie, draaiing en meer) als
//! een array van 4 kB in de vertex-shader. Sommige GL-vertalers (zoals die van de
//! Android-emulator) tellen die array mee bij `GL_MAX_VERTEX_UNIFORM_VECTORS` (256 vectoren):
//! samen met de camera is dat te veel, en dan tekent Bevy niets.
//!
//! Bevy rekent de grootte van die array op drie plekken uit; deze plugin zet ze alle drie op
//! `KLEIN` (2 kB): de buffer waarin Bevy de gegevens schrijft, de `MeshPipeline` en de
//! shader-module `mesh_bindings`. Zo kan het zonder Bevy zelf aan te passen. Meer groepjes
//! betekent iets meer tekenopdrachten; dat merk je niet bij een bord met een paar honderd stenen.

use bevy::pbr::{
    MaterialPipeline, MeshPipeline, MeshPipelineSystems, MeshUniform, PrepassPipeline,
    init_material_pipeline,
};
use bevy::prelude::*;
use bevy::render::batching::no_gpu_preprocessing::BatchedInstanceBuffer;
use bevy::render::render_resource::GpuArrayBuffer;
use bevy::render::renderer::RenderDevice;
use bevy::render::settings::WgpuLimits;
use bevy::render::{RenderApp, RenderStartup, init_gpu_resource};
use bevy::shader::{Shader, ShaderDefVal};

/// Zo groot mag de array met meshgegevens in de vertex-shader zijn, in bytes.
const KLEIN: u64 = 1 << 11;
const NAAM: &str = "PER_OBJECT_BUFFER_BATCH_SIZE";

pub struct KleineGroepjes;

impl Plugin for KleineGroepjes {
    fn build(&self, app: &mut App) {
        // Bij het opstarten (als de module er al is), en in `Last` van hetzelfde beeld waarin hij
        // geladen wordt: vóór Bevy hem naar de render-wereld kopieert. In `First` was te laat:
        // de schaduwpas (taak 177) maakte dan al een pijplijn met de oude maat.
        app.add_systems(PreStartup, pas_alle_shaders_aan)
            .add_systems(Last, pas_shader_aan);
    }

    fn finish(&self, app: &mut App) {
        let Some(render_app) = app.get_sub_app_mut(RenderApp) else {
            return;
        };
        render_app.add_systems(
            RenderStartup,
            // Vóór `init_material_pipeline`: het materiaal en de schaduwpas (prepass) nemen een kopie
            // van de `MeshPipeline`. Zonder schaduw (vóór taak 177) gebruikte niets die kopie.
            verklein
                .after(MeshPipelineSystems)
                .after(init_gpu_resource::<BatchedInstanceBuffer<MeshUniform>>)
                .before(init_material_pipeline),
        );
    }
}

/// Grenzen zoals die van het apparaat, maar met een kleinere uniform-buffer voor meshgegevens.
fn klein(limits: &WgpuLimits) -> WgpuLimits {
    WgpuLimits {
        max_uniform_buffer_binding_size: limits.max_uniform_buffer_binding_size.min(KLEIN),
        ..limits.clone()
    }
}

/// Het aantal meshes per groepje met de kleinere buffer; `None` als Bevy geen groepjes
/// gebruikt (met storage buffers, dus niet op WebGL2).
fn groepje() -> Option<u32> {
    let limits = WgpuLimits {
        max_storage_buffers_per_shader_stage: 0,
        ..WgpuLimits::downlevel_webgl2_defaults()
    };
    GpuArrayBuffer::<MeshUniform>::batch_size(&klein(&limits))
}

fn verklein(
    device: Res<RenderDevice>,
    pipeline: Option<ResMut<MeshPipeline>>,
    buffer: Option<ResMut<BatchedInstanceBuffer<MeshUniform>>>,
    materiaal: Option<ResMut<MaterialPipeline>>,
    prepass: Option<ResMut<PrepassPipeline>>,
) {
    let (Some(mut pipeline), Some(mut buffer)) = (pipeline, buffer) else {
        return;
    };
    if pipeline.per_object_buffer_batch_size.is_none() {
        return;
    }
    let limits = klein(&device.limits());
    pipeline.per_object_buffer_batch_size = GpuArrayBuffer::<MeshUniform>::batch_size(&limits);
    *buffer = BatchedInstanceBuffer::new(&limits);
    // Bestaan de kopieën toch al, pas ze dan ook aan.
    if let Some(mut m) = materiaal {
        m.mesh_pipeline.per_object_buffer_batch_size = pipeline.per_object_buffer_batch_size;
    }
    if let Some(mut p) = prepass {
        p.material_pipeline
            .mesh_pipeline
            .per_object_buffer_batch_size = pipeline.per_object_buffer_batch_size;
    }
}

/// Zet de grootte in `mesh_bindings` in alle shaders die er al zijn.
fn pas_alle_shaders_aan(mut shaders: ResMut<Assets<Shader>>) {
    let ids: Vec<_> = shaders.ids().collect();
    for id in ids {
        pas_aan(&mut shaders, id);
    }
}

/// Zet `PER_OBJECT_BUFFER_BATCH_SIZE` in de module `mesh_bindings` op de kleinere maat.
fn pas_aan(shaders: &mut Assets<Shader>, id: AssetId<Shader>) {
    let Some(n) = groepje() else { return };
    let past = shaders.get(id).is_some_and(|s| {
        s.path.ends_with("mesh_bindings.wesl")
            && s.shader_defs
                .iter()
                .any(|d| matches!(d, ShaderDefVal::UInt(k, v) if k == NAAM && *v != n))
    });
    if past && let Some(mut s) = shaders.get_mut(id) {
        for d in &mut s.shader_defs {
            if let ShaderDefVal::UInt(k, v) = d
                && k == NAAM
            {
                *v = n;
            }
        }
    }
}

/// Zet de grootte ook in de shader-module `mesh_bindings`, zodra Bevy die geladen heeft.
fn pas_shader_aan(
    mut berichten: MessageReader<AssetEvent<Shader>>,
    mut shaders: ResMut<Assets<Shader>>,
) {
    for bericht in berichten.read() {
        if let AssetEvent::Added { id } | AssetEvent::LoadedWithDependencies { id } = bericht {
            pas_aan(&mut shaders, *id);
        }
    }
}
