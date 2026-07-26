import benchmark from './benchmark.json'
import {
    bindExecutionOverlayContext,
    bindExecutionOverlayTimeline,
    isSingleSourceExactPresentationMedia,
} from '../lib/executionOverlayTimeline'

const openemr = benchmark.openemr

/**
 * One source of truth for the public real-application footage.
 *
 * The media files are raw source/replay footage. None of the retained clips in
 * this registry has an exact decoded-frame runtime timeline, so the public
 * player deliberately renders no target rectangle or synthetic execution
 * state.
 *
 * A phase may add presentationMedia, a canonical ControlOverlayTimelineV2,
 * and its exact decoded-frame inventory. getExactBoundPresentation refuses the
 * view unless every public-contract and media binding check passes. Raw source
 * media remains inspectable and is never modified by presentation chrome.
 */
export const REFERENCE_DEMOS = Object.freeze([
    Object.freeze({
        id: 'healthcare',
        industry: 'Healthcare',
        application: 'OpenEMR',
        applicationDetail: 'official public demo',
        route: '/solutions/healthcare',
        evidenceClass: 'Public application demonstration',
        task: openemr.task,
        recording: Object.freeze({
            kind: 'video',
            src: '/how-it-works/record_openemr.webm',
            mimeType: 'video/webm',
            fallbackSrc: '/how-it-works/record_openemr.mp4',
            fallbackMimeType: 'video/mp4',
            poster: '/how-it-works/record_openemr.jpg',
            width: 880,
            height: 550,
            alt: 'OpenAdapt recording a bounded workflow in the live OpenEMR public demo.',
            sourceCaption: 'Literal source recording from the OpenEMR demonstration.',
            presentationMedia: null,
            presentationTimeline: null,
            presentationBinding: null,
            presentationContexts: null,
        }),
        replay: Object.freeze({
            kind: 'video',
            src: '/how-it-works/run_openemr.webm',
            mimeType: 'video/webm',
            fallbackSrc: '/how-it-works/run_openemr.mp4',
            fallbackMimeType: 'video/mp4',
            poster: '/how-it-works/run_openemr.jpg',
            width: 880,
            height: 550,
            alt: 'OpenAdapt replaying the compiled workflow in the live OpenEMR public demo.',
            sourceCaption: 'Literal compiled replay footage from the OpenEMR demonstration.',
            presentationMedia: null,
            presentationTimeline: null,
            presentationBinding: null,
            presentationContexts: null,
        }),
        metrics: Object.freeze([
            Object.freeze({ label: 'OCR-confirmed outcomes', value: `${openemr.compiled.success_count}/${openemr.compiled.n}` }),
            Object.freeze({ label: 'Model calls / run', value: String(openemr.compiled.model_calls_per_run) }),
            Object.freeze({ label: 'Median replay', value: `${openemr.compiled.wall_s_p50.toFixed(1)} s` }),
        ]),
        verification:
            'Final settled-screen OCR found the distinct saved note in 20/20 compiled runs. One run halted after the write on a drifting postcondition; OCR still confirmed the note on the final screen. This is screen evidence, not persisted-record readback.',
        evidenceHref: '/artifacts/json?source=%2Fhow-it-works%2FMANIFEST.json',
        evidenceLabel: 'Footage manifest',
        methodologyHref:
            'https://github.com/OpenAdaptAI/openadapt-flow/blob/f9091aab0f22b4a65401252b94d648a939da0575/benchmark/openemr/BENCHMARK.md',
        methodologyLabel: 'Method and results',
    }),
    Object.freeze({
        id: 'lending',
        industry: 'Lending',
        application: 'Frappe Lending',
        applicationDetail: 'pinned local reference',
        route: '/solutions/lending',
        evidenceClass: 'Public application reference',
        task: 'Create exactly one synthetic Loan Application from structured applicant and loan inputs.',
        recording: Object.freeze({
            kind: 'gif',
            src: '/lending-demo/record-frappe.gif',
            poster: '/lending-demo/record-frappe.jpg',
            width: 880,
            height: 550,
            alt: 'OpenAdapt recording a synthetic Loan Application workflow in Frappe Lending.',
            sourceCaption:
                'Source-derived evidence sequence from the Frappe Lending reference run; not a literal continuous screen recording.',
            presentationMedia: null,
            presentationTimeline: null,
            presentationBinding: null,
            presentationContexts: null,
        }),
        replay: Object.freeze({
            kind: 'gif',
            src: '/lending-demo/replay-frappe.gif',
            poster: '/lending-demo/replay-frappe.jpg',
            width: 880,
            height: 550,
            alt: 'OpenAdapt replaying the compiled synthetic Loan Application workflow in Frappe Lending.',
            sourceCaption:
                'Source-derived evidence sequence from the Frappe Lending compiled replay; not literal continuous footage.',
            presentationMedia: null,
            presentationTimeline: null,
            presentationBinding: null,
            presentationContexts: null,
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
    Object.freeze({
        id: 'insurance',
        industry: 'Insurance',
        application: 'openIMIS',
        applicationDetail: 'pinned local reference',
        route: '/solutions/insurance',
        evidenceClass: 'Public application reference',
        task: 'Enter exactly one synthetic health-facility claim and save it for review.',
        recording: Object.freeze({
            kind: 'gif',
            src: '/insurance-demo/record-openimis.gif',
            poster: '/insurance-demo/record-openimis.jpg',
            width: 880,
            height: 550,
            alt: 'OpenAdapt recording a synthetic health-facility claim in openIMIS.',
            sourceCaption:
                'Source-derived evidence sequence from the openIMIS reference run; not a literal continuous screen recording.',
            presentationMedia: null,
            presentationTimeline: null,
            presentationBinding: null,
            presentationContexts: null,
        }),
        replay: Object.freeze({
            kind: 'gif',
            src: '/insurance-demo/replay-openimis.gif',
            poster: '/insurance-demo/replay-openimis.jpg',
            width: 880,
            height: 550,
            alt: 'OpenAdapt replaying the compiled synthetic claim workflow in openIMIS.',
            sourceCaption:
                'Source-derived evidence sequence from the openIMIS compiled replay; not literal continuous footage.',
            presentationMedia: null,
            presentationTimeline: null,
            presentationBinding: null,
            presentationContexts: null,
        }),
        metrics: Object.freeze([
            Object.freeze({ label: 'Compiled replays', value: '3/3' }),
            Object.freeze({ label: 'Wrong-record writes', value: '0' }),
            Object.freeze({ label: 'Model calls', value: '0' }),
        ]),
        verification:
            'A direct SQL read required exactly one non-voided claim in Entered status for the intended insuree and facility.',
        evidenceHref: '/artifacts/json?source=%2Finsurance-demo%2Fprovenance.json',
        evidenceLabel: 'Evidence manifest',
        methodologyHref:
            'https://github.com/OpenAdaptAI/openadapt-flow/tree/3276ad2b537c558211a5a357fd7ac1e19f0a029e/benchmark/openimis_claims',
        methodologyLabel: 'Reference source',
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
        })
    } catch {
        return null
    }
}
