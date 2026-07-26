import presentationAssets from './referencePresentationAssets.mjs'
import {
    bindExecutionOverlayContext,
    bindExecutionOverlayTimeline,
    isSingleSourceExactPresentationMedia,
} from '../lib/executionOverlayTimeline'

const exactPresentationFor = (applicationId, modeId) => {
    const asset = presentationAssets.assets.find(
        (candidate) =>
            candidate.applicationId === applicationId && candidate.modeId === modeId
    )
    return Object.freeze({
        presentationMedia: asset?.media ?? null,
        presentationTimeline: asset?.timeline ?? null,
        presentationBinding: asset?.binding ?? null,
        presentationContexts: asset?.contexts ?? null,
        presentationNetworkObservation: asset?.networkObservation ?? null,
    })
}

const referenceDemo = ({ recording, replay, halt = null, ...demo }) =>
    Object.freeze({
        ...demo,
        defaultModeId: replay.id,
        modes: Object.freeze([recording, replay, halt].filter(Boolean)),
    })

const openimisCatalog = presentationAssets.catalogs.find(
    (candidate) => candidate.applicationId === 'insurance'
)

const openimisManifestMode = (modeId, details) => {
    const mode = openimisCatalog.manifest.modes.find(
        (candidate) => candidate.id === modeId
    )
    if (!mode) throw new Error(`openIMIS presentation mode is missing: ${modeId}`)
    return Object.freeze({
        id: mode.id,
        label: mode.label,
        modeKind: mode.kind,
        evidenceClass:
            mode.kind === 'recording'
                ? 'Source demonstration · synthetic data'
                : 'Public application reference',
        kind: 'video',
        src: `${openimisCatalog.root}/${mode.media.path}`,
        mimeType: 'video/mp4',
        poster: `${openimisCatalog.root}/${mode.poster.path}`,
        width: mode.media.width,
        height: mode.media.height,
        ...details,
        ...exactPresentationFor('insurance', mode.id),
    })
}

const openimisLink = (type) =>
    openimisCatalog.manifest.links.find((candidate) => candidate.type === type)?.href

/**
 * One source of truth for the public real-application footage.
 *
 * Source media remains unmodified and never receives an inferred overlay. A
 * mode may add presentationMedia, a canonical ControlOverlayTimelineV2,
 * and its exact decoded-frame inventory. getExactBoundPresentation refuses the
 * view unless every public-contract and media binding check passes. Raw source
 * media remains inspectable and is never modified by presentation chrome.
 */
export const REFERENCE_DEMOS = Object.freeze([
    referenceDemo({
        id: 'healthcare',
        industry: 'Healthcare',
        application: 'OpenEMR',
        applicationDetail: '8.0.0.3 · pinned local synthetic fixture',
        route: '/solutions/healthcare',
        evidenceClass: 'Reference qualification',
        task: 'Create exactly one complete synthetic patient record from structured demographics.',
        recording: Object.freeze({
            id: 'recording',
            label: 'Recorded demonstration',
            modeKind: 'recording',
            evidenceClass: 'Source demonstration · synthetic data',
            kind: 'video',
            src: '/reference/openemr-patient-registration-standard-synthetic-v1/recording/openemr-source-recording.unbound.mp4',
            mimeType: 'video/mp4',
            poster: '/reference/openemr-patient-registration-standard-synthetic-v1/recording/openemr-source-recording.poster.png',
            width: 1280,
            height: 800,
            alt: 'OpenAdapt recording a synthetic patient registration workflow in OpenEMR.',
            sourceCaption:
                'Unbound source recording used to compile the OpenEMR workflow. It carries no overlay or outcome claim.',
            ...exactPresentationFor('healthcare', 'recording'),
        }),
        replay: Object.freeze({
            id: 'verified_replay',
            label: 'Verified replay',
            modeKind: 'replay',
            kind: 'video',
            src: '/reference/openemr-patient-registration-standard-synthetic-v1/replay/openemr-replay.mp4',
            mimeType: 'video/mp4',
            poster: '/reference/openemr-patient-registration-standard-synthetic-v1/replay/openemr-replay.poster.png',
            width: 1280,
            height: 800,
            alt: 'OpenAdapt replaying a qualified synthetic patient registration workflow in OpenEMR.',
            sourceCaption:
                'Exact replay evidence media with presentation chrome omitted.',
            ...exactPresentationFor('healthcare', 'verified_replay'),
        }),
        metrics: Object.freeze([
            Object.freeze({ label: 'Standard VERIFIED', value: '3/3' }),
            Object.freeze({ label: 'REST + SQL parity', value: '3/3' }),
            Object.freeze({ label: 'Model calls', value: '0' }),
        ]),
        verification:
            'All 3 fresh Standard-profile runs created exactly one synthetic patient and returned VERIFIED only after separately authenticated REST readback agreed with direct SQL and non-target delta audit. Median end-to-end runtime was 59.8 seconds; observed silent incorrect success was 0/3.',
        evidenceHref: '/artifacts/json?source=%2Freference%2Fopenemr-patient-registration-standard-synthetic-v1%2Fmanifest.json',
        evidenceLabel: 'Qualification pack',
        methodologyHref:
            'https://github.com/OpenAdaptAI/openadapt-flow/tree/cb8b785cab84e2c42e8072a1bbd1099ce2454e1e/benchmark/openemr_local',
        methodologyLabel: 'Reference method',
    }),
    referenceDemo({
        id: 'lending',
        industry: 'Lending',
        application: 'Frappe Lending',
        applicationDetail: 'pinned local reference',
        route: '/solutions/lending',
        evidenceClass: 'Public application reference',
        task: 'Create exactly one synthetic Loan Application from structured applicant and loan inputs.',
        recording: Object.freeze({
            id: 'recording',
            label: 'Recorded demonstration',
            modeKind: 'recording',
            evidenceClass: 'Source demonstration · synthetic data',
            kind: 'gif',
            src: '/lending-demo/record-frappe.gif',
            poster: '/lending-demo/record-frappe.jpg',
            width: 880,
            height: 550,
            alt: 'OpenAdapt recording a synthetic Loan Application workflow in Frappe Lending.',
            sourceCaption:
                'Source-derived evidence sequence from the Frappe Lending reference run; not a literal continuous screen recording.',
            ...exactPresentationFor('lending', 'recording'),
        }),
        replay: Object.freeze({
            id: 'compiled_replay',
            label: 'Compiled replay',
            modeKind: 'replay',
            kind: 'gif',
            src: '/lending-demo/replay-frappe.gif',
            poster: '/lending-demo/replay-frappe.jpg',
            width: 880,
            height: 550,
            alt: 'OpenAdapt replaying the compiled synthetic Loan Application workflow in Frappe Lending.',
            sourceCaption:
                'Source-derived evidence sequence from the Frappe Lending compiled replay; not literal continuous footage.',
            ...exactPresentationFor('lending', 'replay'),
        }),
        metrics: Object.freeze([
            Object.freeze({ label: 'Compiled trials', value: '6/6' }),
            Object.freeze({ label: 'Silent wrong success', value: '0' }),
            Object.freeze({ label: 'Model calls', value: '0' }),
        ]),
        verification:
            'A separately authenticated REST readback, direct SQL table delta, and non-target digest audit accepted the saved record.',
        evidenceHref: '/artifacts/json?source=%2Flending-demo%2Fprovenance.json',
        evidenceLabel: 'Evidence manifest',
        methodologyHref:
            'https://github.com/OpenAdaptAI/openadapt-flow/tree/84c7a94f2d2ca9e183799394d1952ae32fa6bf92/benchmark/frappe_lending',
        methodologyLabel: 'Reference source',
    }),
    referenceDemo({
        id: 'insurance',
        industry: 'Insurance',
        application: openimisCatalog.manifest.application.name,
        applicationDetail: `${openimisCatalog.manifest.application.version} · pinned local synthetic fixture`,
        route: '/solutions/insurance',
        evidenceClass: 'Public application reference',
        task: openimisCatalog.manifest.task.description,
        recording: openimisManifestMode('recording', {
            alt: 'A credential-safe source demonstration of a synthetic insurance eligibility check in openIMIS.',
            sourceCaption:
                'Credential-safe source demonstration used to compile the eligibility workflow. It carries no overlay or outcome claim.',
        }),
        replay: openimisManifestMode('verified_replay', {
            alt: 'OpenAdapt replaying a Standard-profile synthetic insurance eligibility check in openIMIS.',
            sourceCaption:
                'Exact Standard-profile replay evidence media with presentation chrome omitted.',
            metrics: Object.freeze([
                Object.freeze({ label: 'Standard VERIFIED', value: '3/3' }),
                Object.freeze({ label: 'Tier 1 SQL', value: '3/3' }),
                Object.freeze({ label: 'Model calls', value: '0' }),
            ]),
            verification:
                'All 3 eligible-policy trials returned VERIFIED only after an independent read-only SQL query confirmed policy, product, service, and effective-date state. Observed silent incorrect success was 0/3.',
        }),
        halt: openimisManifestMode('fail_safe_halt', {
            alt: 'OpenAdapt halting an openIMIS eligibility check after independent SQL refuted the browser result.',
            sourceCaption:
                'Exact fail-safe evidence media with presentation chrome omitted.',
            metrics: Object.freeze([
                Object.freeze({ label: 'Fail-safe HALTED', value: '3/3' }),
                Object.freeze({ label: 'Wrong success', value: '0/3' }),
                Object.freeze({ label: 'Model calls', value: '0' }),
            ]),
            verification:
                'In all 3 expired-policy trials, the independent read-only SQL check refuted eligibility. OpenAdapt reported HALTED instead of accepting the browser result or retrying blindly.',
        }),
        metrics: Object.freeze([
            Object.freeze({ label: 'Fresh trials', value: '6' }),
            Object.freeze({ label: 'Wrong success', value: '0/6' }),
            Object.freeze({ label: 'Model calls', value: '0' }),
        ]),
        verification:
            openimisCatalog.manifest.verifier.summary,
        evidenceHref: '/artifacts/json?source=%2Freference%2Fopenimis-eligibility-standard-synthetic-v1%2Fmanifest.json',
        evidenceLabel: 'Evidence pack',
        methodologyHref: openimisLink('source_methodology'),
        methodologyLabel: 'Reference method',
    }),
])

export function getReferenceDemo(id) {
    return REFERENCE_DEMOS.find((demo) => demo.id === id) ?? REFERENCE_DEMOS[0]
}

export function hasExactBoundPresentation(media) {
    return getExactBoundPresentation(media) !== null
}

export function getExactBoundPresentation(media) {
    if (
        !isSingleSourceExactPresentationMedia(media?.presentationMedia) ||
        // A different fallback encoding has different bytes and decoded-frame
        // timing. Exact presentation therefore admits one digest-bound source;
        // raw footage may continue to offer ordinary browser fallbacks.
        !media.presentationTimeline ||
        !media.presentationBinding
    ) {
        return null
    }
    try {
        const exact = bindExecutionOverlayTimeline(
            media.presentationTimeline,
            media.presentationBinding
        )
        if (media.presentationMedia.sha256 !== exact.binding.mediaSha256) {
            return null
        }
        const contextsBySequence = Object.create(null)
        for (const context of media.presentationContexts ?? []) {
            const event = exact.timeline.events.find(
                (candidate) =>
                    candidate.frame.event_sequence === context.event_sequence
            )
            if (!event) return null
            contextsBySequence[context.event_sequence] =
                bindExecutionOverlayContext(event.frame, context)
        }
        return Object.freeze({
            media: media.presentationMedia,
            ...exact,
            contextsBySequence: Object.freeze(contextsBySequence),
            networkObservation: media.presentationNetworkObservation,
        })
    } catch {
        return null
    }
}
