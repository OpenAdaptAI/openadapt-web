import openemrReplayBinding from '../public/reference/openemr-patient-registration-standard-synthetic-v1/replay/openemr-replay.media-binding.json' with { type: 'json' }
import openemrReplayContexts from '../public/reference/openemr-patient-registration-standard-synthetic-v1/replay/openemr-replay.contexts.json' with { type: 'json' }
import openemrReplayTimeline from '../public/reference/openemr-patient-registration-standard-synthetic-v1/replay/openemr-replay.control-overlay.v2.json' with { type: 'json' }

const openemrRoot =
    '/reference/openemr-patient-registration-standard-synthetic-v1'

/**
 * Thin browser adapter over the byte-identical, consumer-neutral public pack.
 * The production verifier checks every adapter field back against the pack's
 * manifest, inventory, media, timeline, binding, and context documents.
 */
const referencePresentationAssets = Object.freeze({
    schemaVersion: 2,
    assets: Object.freeze([
        Object.freeze({
            applicationId: 'healthcare',
            phase: 'replay',
            media: Object.freeze({
                kind: 'video',
                src: `${openemrRoot}/replay/openemr-replay.mp4`,
                mimeType: 'video/mp4',
                poster: `${openemrRoot}/replay/openemr-replay.poster.png`,
                sha256: openemrReplayBinding.media_sha256,
                width: openemrReplayBinding.decoded_width,
                height: openemrReplayBinding.decoded_height,
                alt: 'OpenAdapt replaying a qualified synthetic patient registration workflow in OpenEMR.',
            }),
            timeline: openemrReplayTimeline,
            binding: Object.freeze({
                evidencePackId: openemrReplayTimeline.evidence_pack_id,
                mediaSha256: openemrReplayBinding.media_sha256,
                mediaFrameCount: openemrReplayBinding.decoded_frame_count,
                mediaFramePresentationTimesUs:
                    openemrReplayBinding.presentation_times_us,
                browserViewportIsExact: true,
            }),
            // These facts are copied from the consumer-neutral, event-bound
            // public context document. The renderer must not infer additional
            // execution facts from timeline phase names.
            contexts: Object.freeze(openemrReplayContexts.contexts),
            pack: Object.freeze({
                root: openemrRoot,
                manifest: `${openemrRoot}/manifest.json`,
                inventory: `${openemrRoot}/inventory.json`,
                timeline: `${openemrRoot}/replay/openemr-replay.control-overlay.v2.json`,
                binding: `${openemrRoot}/replay/openemr-replay.media-binding.json`,
                contexts: `${openemrRoot}/replay/openemr-replay.contexts.json`,
            }),
        }),
    ]),
})

export default referencePresentationAssets
