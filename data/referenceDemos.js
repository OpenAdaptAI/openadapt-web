import benchmark from './benchmark.json'

const openemr = benchmark.openemr

/**
 * One source of truth for the public real-application footage.
 *
 * The media files are raw source/replay footage. None of the retained clips in
 * this registry has an exact decoded-frame runtime timeline, so the public
 * player deliberately renders no target rectangle or synthetic execution
 * state.
 *
 * A phase may later add `presentationMedia` and `presentationTimeline` with
 * this contract:
 *
 *   presentationMedia: {
 *     kind: 'video', src, fallbackSrc?, poster, width, height, alt,
 *     sha256: '<neutral-media hash>'
 *   },
 *   presentationTimeline: {
 *     binding: 'exact-decoded-frame',
 *     sourceMediaSha256: '<raw-media hash>',
 *     presentationMediaSha256: '<neutral-media hash>',
 *     href: '/artifacts/json?source=...',
 *     context: { label: 'Governed replay' },
 *     frames: [{
 *       decodedFrameIndex: 42,
 *       mediaTimeUs: 1400000,
 *       statusLabel: 'Resolving target',
 *       stepLabel: 'Open patient chart',
 *       targetRect: { x: 0.1, y: 0.2, width: 0.3, height: 0.1 }
 *     }]
 *   }
 *
 * The shared showcase will then offer both the exact-bound presentation and
 * the raw source without changing component structure. Presentation media is
 * a neutral derivative: status and target chrome are rendered separately from
 * the retained exact frame events. Runtime evidence still points at the
 * untouched raw media.
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
            fallbackSrc: '/how-it-works/record_openemr.mp4',
            poster: '/how-it-works/record_openemr.jpg',
            width: 880,
            height: 550,
            alt: 'OpenAdapt recording a bounded workflow in the live OpenEMR public demo.',
            presentationMedia: null,
            presentationTimeline: null,
        }),
        replay: Object.freeze({
            kind: 'video',
            src: '/how-it-works/run_openemr.webm',
            fallbackSrc: '/how-it-works/run_openemr.mp4',
            poster: '/how-it-works/run_openemr.jpg',
            width: 880,
            height: 550,
            alt: 'OpenAdapt replaying the compiled workflow in the live OpenEMR public demo.',
            presentationMedia: null,
            presentationTimeline: null,
        }),
        metrics: Object.freeze([
            Object.freeze({ label: 'Compiled trials', value: `${openemr.compiled.success_count}/${openemr.compiled.n}` }),
            Object.freeze({ label: 'Model calls / run', value: String(openemr.compiled.model_calls_per_run) }),
            Object.freeze({ label: 'Median replay', value: `${openemr.compiled.wall_s_p50.toFixed(1)} s` }),
        ]),
        verification:
            'The same arm-independent OCR check read the saved OpenEMR record for both the compiled and agent arms.',
        evidenceHref: '/artifacts/json?source=%2Fhow-it-works%2FMANIFEST.json',
        evidenceLabel: 'Footage manifest',
        methodologyHref: openemr.methodology_url,
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
            presentationMedia: null,
            presentationTimeline: null,
        }),
        replay: Object.freeze({
            kind: 'gif',
            src: '/lending-demo/replay-frappe.gif',
            poster: '/lending-demo/replay-frappe.jpg',
            width: 880,
            height: 550,
            alt: 'OpenAdapt replaying the compiled synthetic Loan Application workflow in Frappe Lending.',
            presentationMedia: null,
            presentationTimeline: null,
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
            presentationMedia: null,
            presentationTimeline: null,
        }),
        replay: Object.freeze({
            kind: 'gif',
            src: '/insurance-demo/replay-openimis.gif',
            poster: '/insurance-demo/replay-openimis.jpg',
            width: 880,
            height: 550,
            alt: 'OpenAdapt replaying the compiled synthetic claim workflow in openIMIS.',
            presentationMedia: null,
            presentationTimeline: null,
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
    return Boolean(
        media?.presentationMedia?.kind === 'video' &&
            media.presentationMedia.sha256 &&
            media.presentationTimeline?.binding === 'exact-decoded-frame' &&
            media.presentationTimeline?.sourceMediaSha256 &&
            media.presentationTimeline?.presentationMediaSha256 ===
                media.presentationMedia.sha256 &&
            Array.isArray(media.presentationTimeline?.frames)
    )
}
