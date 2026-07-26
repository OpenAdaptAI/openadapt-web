import openemrReplayBinding from '../public/reference/openemr-patient-registration-standard-synthetic-v1/replay/openemr-replay.media-binding.json' with { type: 'json' }
import openemrReplayContexts from '../public/reference/openemr-patient-registration-standard-synthetic-v1/replay/openemr-replay.contexts.json' with { type: 'json' }
import openemrReplayTimeline from '../public/reference/openemr-patient-registration-standard-synthetic-v1/replay/openemr-replay.control-overlay.v2.json' with { type: 'json' }
import frappeManifest from '../public/reference/frappe-lending-loan-application-standard-synthetic-v1/manifest.json' with { type: 'json' }
import frappeReplayBinding from '../public/reference/frappe-lending-loan-application-standard-synthetic-v1/replay/frappe-replay.media-binding.json' with { type: 'json' }
import frappeReplayContexts from '../public/reference/frappe-lending-loan-application-standard-synthetic-v1/replay/frappe-replay.contexts.json' with { type: 'json' }
import frappeReplayTimeline from '../public/reference/frappe-lending-loan-application-standard-synthetic-v1/replay/frappe-replay.control-overlay.v2.json' with { type: 'json' }
import openimisManifest from '../public/reference/openimis-eligibility-standard-synthetic-v1/manifest.json' with { type: 'json' }
import openimisHaltBinding from '../public/reference/openimis-eligibility-standard-synthetic-v1/fail-safe-halt/expired-halt.media-binding.json' with { type: 'json' }
import openimisHaltContexts from '../public/reference/openimis-eligibility-standard-synthetic-v1/fail-safe-halt/expired-halt.contexts.json' with { type: 'json' }
import openimisHaltTimeline from '../public/reference/openimis-eligibility-standard-synthetic-v1/fail-safe-halt/expired-halt.control-overlay.v2.json' with { type: 'json' }
import openimisReplayBinding from '../public/reference/openimis-eligibility-standard-synthetic-v1/verified-replay/eligible-replay.media-binding.json' with { type: 'json' }
import openimisReplayContexts from '../public/reference/openimis-eligibility-standard-synthetic-v1/verified-replay/eligible-replay.contexts.json' with { type: 'json' }
import openimisReplayTimeline from '../public/reference/openimis-eligibility-standard-synthetic-v1/verified-replay/eligible-replay.control-overlay.v2.json' with { type: 'json' }

const openemrRoot =
    '/reference/openemr-patient-registration-standard-synthetic-v1'
const frappeRoot =
    '/reference/frappe-lending-loan-application-standard-synthetic-v1'
const openimisRoot = '/reference/openimis-eligibility-standard-synthetic-v1'

/**
 * Thin browser adapter over the byte-identical, consumer-neutral public pack.
 * The production verifier checks every adapter field back against the pack's
 * manifest, inventory, media, timeline, binding, and context documents.
 */
const referencePresentationAssets = Object.freeze({
    schemaVersion: 3,
    catalogs: Object.freeze([
        Object.freeze({
            applicationId: 'lending',
            root: frappeRoot,
            manifest: frappeManifest,
        }),
        Object.freeze({
            applicationId: 'insurance',
            root: openimisRoot,
            manifest: openimisManifest,
        }),
    ]),
    assets: Object.freeze([
        Object.freeze({
            applicationId: 'healthcare',
            modeId: 'verified_replay',
            modeKind: 'replay',
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
            networkObservation: null,
            pack: Object.freeze({
                root: openemrRoot,
                manifest: `${openemrRoot}/manifest.json`,
                inventory: `${openemrRoot}/inventory.json`,
                timeline: `${openemrRoot}/replay/openemr-replay.control-overlay.v2.json`,
                binding: `${openemrRoot}/replay/openemr-replay.media-binding.json`,
                contexts: `${openemrRoot}/replay/openemr-replay.contexts.json`,
            }),
        }),
        Object.freeze({
            applicationId: 'lending',
            modeId: 'verified_replay',
            modeKind: 'replay',
            media: Object.freeze({
                kind: 'video',
                src: `${frappeRoot}/replay/frappe-replay.mp4`,
                mimeType: 'video/mp4',
                poster: `${frappeRoot}/replay/frappe-replay.poster.png`,
                sha256: frappeReplayBinding.media_sha256,
                width: frappeReplayBinding.decoded_width,
                height: frappeReplayBinding.decoded_height,
                alt: 'OpenAdapt replaying a Standard-profile synthetic Loan Application workflow in Frappe Lending.',
            }),
            timeline: frappeReplayTimeline,
            binding: Object.freeze({
                evidencePackId: frappeReplayTimeline.evidence_pack_id,
                mediaSha256: frappeReplayBinding.media_sha256,
                mediaFrameCount: frappeReplayBinding.decoded_frame_count,
                mediaFramePresentationTimesUs:
                    frappeReplayBinding.presentation_times_us,
                browserViewportIsExact: true,
            }),
            contexts: Object.freeze(frappeReplayContexts.contexts),
            networkObservation: null,
            pack: Object.freeze({
                root: frappeRoot,
                manifest: `${frappeRoot}/manifest.json`,
                inventory: `${frappeRoot}/inventory.json`,
                timeline: `${frappeRoot}/replay/frappe-replay.control-overlay.v2.json`,
                binding: `${frappeRoot}/replay/frappe-replay.media-binding.json`,
                contexts: `${frappeRoot}/replay/frappe-replay.contexts.json`,
            }),
        }),
        Object.freeze({
            applicationId: 'insurance',
            modeId: 'verified_replay',
            modeKind: 'replay',
            media: Object.freeze({
                kind: 'video',
                src: `${openimisRoot}/verified-replay/eligible-replay.mp4`,
                mimeType: 'video/mp4',
                poster: `${openimisRoot}/verified-replay/eligible-replay.poster.png`,
                sha256: openimisReplayBinding.media_sha256,
                width: openimisReplayBinding.decoded_width,
                height: openimisReplayBinding.decoded_height,
                alt: 'OpenAdapt replaying a Standard-profile synthetic insurance eligibility check in openIMIS.',
            }),
            timeline: openimisReplayTimeline,
            binding: Object.freeze({
                evidencePackId: openimisReplayTimeline.evidence_pack_id,
                mediaSha256: openimisReplayBinding.media_sha256,
                mediaFrameCount: openimisReplayBinding.decoded_frame_count,
                mediaFramePresentationTimesUs:
                    openimisReplayBinding.presentation_times_us,
                browserViewportIsExact: true,
            }),
            contexts: Object.freeze(openimisReplayContexts.contexts),
            networkObservation: Object.freeze(openimisManifest.network_observation),
            pack: Object.freeze({
                root: openimisRoot,
                manifest: `${openimisRoot}/manifest.json`,
                inventory: `${openimisRoot}/inventory.json`,
                timeline: `${openimisRoot}/verified-replay/eligible-replay.control-overlay.v2.json`,
                binding: `${openimisRoot}/verified-replay/eligible-replay.media-binding.json`,
                contexts: `${openimisRoot}/verified-replay/eligible-replay.contexts.json`,
            }),
        }),
        Object.freeze({
            applicationId: 'insurance',
            modeId: 'fail_safe_halt',
            modeKind: 'halt',
            media: Object.freeze({
                kind: 'video',
                src: `${openimisRoot}/fail-safe-halt/expired-halt.mp4`,
                mimeType: 'video/mp4',
                poster: `${openimisRoot}/fail-safe-halt/expired-halt.poster.png`,
                sha256: openimisHaltBinding.media_sha256,
                width: openimisHaltBinding.decoded_width,
                height: openimisHaltBinding.decoded_height,
                alt: 'OpenAdapt halting an openIMIS eligibility check after independent SQL refuted the browser result.',
            }),
            timeline: openimisHaltTimeline,
            binding: Object.freeze({
                evidencePackId: openimisHaltTimeline.evidence_pack_id,
                mediaSha256: openimisHaltBinding.media_sha256,
                mediaFrameCount: openimisHaltBinding.decoded_frame_count,
                mediaFramePresentationTimesUs:
                    openimisHaltBinding.presentation_times_us,
                browserViewportIsExact: true,
            }),
            contexts: Object.freeze(openimisHaltContexts.contexts),
            networkObservation: Object.freeze(openimisManifest.network_observation),
            pack: Object.freeze({
                root: openimisRoot,
                manifest: `${openimisRoot}/manifest.json`,
                inventory: `${openimisRoot}/inventory.json`,
                timeline: `${openimisRoot}/fail-safe-halt/expired-halt.control-overlay.v2.json`,
                binding: `${openimisRoot}/fail-safe-halt/expired-halt.media-binding.json`,
                contexts: `${openimisRoot}/fail-safe-halt/expired-halt.contexts.json`,
            }),
        }),
    ]),
})

export default referencePresentationAssets
