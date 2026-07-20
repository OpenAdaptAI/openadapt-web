// Shared honest source of truth for the homepage reference-workflow selector.
//
// The homepage was restructured (#223/#224): the interactive "OpenAdapt Cloud"
// preview moved to /hosted/welcome and the full per-application HowItWorks
// selector moved to the solution pages, leaving the homepage with a single
// hard-coded Lending process demo plus a static list of reference links. This
// module lets ONE lifted selection drive every reference-aware homepage
// section, so choosing a vertical in the process section or in the reference
// list updates the other.
//
// Evidence and labels mirror the bounded per-application content on the
// solution pages (components/HowItWorks.js) and the Cloud preview
// (components/DashboardShowcase.js). Lending and Insurance carry their bounded
// verified trial counts; Healthcare stays "qualification required" because the
// OpenEMR footage does not establish an independent effect oracle. Do not
// promote Healthcare to a verified claim here.

export const VERTICAL_KEYS = ['healthcare', 'lending', 'insurance']

// The homepage leads with the strongest bounded evidence (the verified Frappe
// Lending reference), matching the pre-sync single-vertical demo.
export const DEFAULT_VERTICAL = 'lending'

export const HOME_REFERENCES = [
    {
        key: 'healthcare',
        label: 'Healthcare',
        application: 'OpenEMR',
        href: '/solutions/healthcare',
        // Exact label kept in sync with the reference list rendered from
        // pages/index.js (asserted by tests/insuranceReference.test.js).
        linkLabel: 'Healthcare workflow reference',
        eyebrow: 'Real reference footage',
        heading: 'From demonstration to a qualification-gated OpenEMR write',
        subheading:
            'Real OpenEMR footage on a pinned local instance. The effect oracle is deployment-specific and not established by this media.',
        record: {
            gif: '/how-it-works/record_openemr.gif',
            width: 880,
            height: 550,
            alt: 'Captured OpenEMR frames showing a synthetic patient workflow demonstration in a live, pinned OpenEMR instance.',
            caption:
                'Demonstrate — captured OpenEMR frames · synthetic local instance',
        },
        replay: {
            gif: '/how-it-works/run_openemr.gif',
            width: 880,
            height: 550,
            alt: 'OpenAdapt replaying the compiled OpenEMR workflow locally with no per-run model calls.',
            caption:
                'Replay — compiled OpenEMR run · local and model-free',
        },
        compile: {
            workflow: 'openemr-browser-reference',
            parameters: 'workflow-defined inputs',
            target: 'Bounded OpenEMR browser task',
            effect: 'Deployment-specific oracle required',
            healthy: 'Deterministic · zero model calls',
        },
        verify: {
            qualified: false,
            status: 'Qualification required',
            heading: 'qualification contract',
            checks: [
                ['Recorded media', 'record and compiled-replay footage'],
                ['Effect oracle', 'not established by this media'],
                ['Identity policy', 'must be configured for the workflow'],
                ['Acceptance', 'halt until declared checks pass'],
            ],
            metrics: ['No application-specific audit result claimed'],
            caption:
                'Qualification contract for the OpenEMR reference. The footage does not establish an independent effect audit or production EMR reliability.',
        },
        disclosure: {
            text:
                'OpenEMR footage shows a real demonstration and compiled replay on a pinned local instance with synthetic data. This reference has no independent effect oracle yet — a deployment-specific verifier must be configured before any correctness claim.',
            linkHref: '/solutions/healthcare',
            linkLabel: 'View the healthcare reference',
        },
    },
    {
        key: 'lending',
        label: 'Lending',
        application: 'Frappe Lending',
        href: '/solutions/lending',
        linkLabel: 'Lending operations reference',
        eyebrow: 'Real reference workflow',
        heading: 'From demonstration to verified Frappe write',
        subheading:
            'Synthetic local data, real Frappe Lending interactions, and an oracle outside the replay path.',
        record: {
            gif: '/lending-demo/record-frappe.gif',
            width: 880,
            height: 550,
            alt: 'Captured Frappe Lending frames showing a synthetic loan application demonstration being completed and saved.',
            caption:
                'Demonstrate — captured Frappe Lending frames · synthetic local fixture',
        },
        replay: {
            gif: '/lending-demo/replay-frappe.gif',
            width: 880,
            height: 550,
            alt: 'OpenAdapt deterministically replaying the compiled synthetic loan application workflow in Frappe Lending.',
            caption:
                'Replay — real compiled run · local, model-free, independently checked',
        },
        compile: {
            workflow: 'create-loan-application',
            parameters: 'email · phone · product · amount · term',
            target: 'Loan Application form',
            effect: 'exactly one matching record',
            healthy: 'deterministic · zero model calls',
        },
        verify: {
            qualified: true,
            status: 'Verified',
            heading: 'independent effect evidence',
            checks: [
                ['REST readback', 'exact fields matched'],
                ['SQL delta', '+1 Loan Application'],
                ['Collateral audit', 'non-target digest unchanged'],
                ['Execution', '6/6 compiled trials correct'],
            ],
            metrics: [
                '0 silent incorrect successes',
                '0 over-halts',
                '0 model calls',
            ],
            caption:
                'Verify — three baseline and three cosmetic-drift compiled trials; scoped to the pinned local reference environment.',
        },
        disclosure: {
            text:
                'Frappe Lending v16.2.0, Frappe v16.27.0, and ERPNext v16.27.0 were pinned in a local fixture with fictional values. The six compiled trials cover one task on one environment under baseline and cosmetic-drift conditions. OpenAdapt is unaffiliated with Frappe Technologies Pvt. Ltd.; Frappe is its registered trademark.',
            linkHref: '/lending-demo/provenance.json',
            linkLabel: 'Inspect evidence manifest',
        },
    },
    {
        key: 'insurance',
        label: 'Insurance',
        application: 'openIMIS',
        href: '/solutions/insurance',
        linkLabel: 'Insurance claims reference',
        eyebrow: 'Real reference workflow',
        heading: 'From demonstration to verified openIMIS claim',
        subheading:
            'Synthetic claim data, real openIMIS interactions, and a claims-database oracle outside the replay path.',
        record: {
            gif: '/insurance-demo/record-openimis.gif',
            width: 880,
            height: 550,
            alt: 'Captured openIMIS frames showing a synthetic health-facility claim being entered and saved.',
            caption:
                'Demonstrate — captured openIMIS frames · synthetic local fixture',
        },
        replay: {
            gif: '/insurance-demo/replay-openimis.gif',
            width: 880,
            height: 550,
            alt: 'OpenAdapt deterministically replaying the compiled claims-intake workflow in openIMIS with a fresh claim number.',
            caption:
                'Replay — real compiled run · local, model-free, independently checked',
        },
        compile: {
            workflow: 'openimis-claim-intake',
            parameters: 'insuree no. · claim no. · explanation',
            target: 'Health Facility Claim form',
            effect: 'exactly one claim row in status Entered',
            healthy: 'deterministic · zero model calls',
        },
        verify: {
            qualified: true,
            status: 'Verified',
            heading: 'independent effect evidence',
            checks: [
                ['SQL claim readback', 'exactly one new claim row'],
                ['Claim status', 'Entered, ready for review'],
                ['Record context', 'insuree and facility matched'],
                ['Execution', 'three compiled replays verified'],
            ],
            metrics: [
                '0 duplicate claims',
                '0 wrong-policyholder writes',
                '0 model calls',
            ],
            caption:
                'Verify — three compiled replays with fresh claim numbers; scoped to the pinned local reference environment.',
        },
        disclosure: {
            text:
                'openIMIS was pinned in a local fixture with fictional claim data. The three compiled replays cover one claim-intake task, each checked against the claims database. OpenAdapt is unaffiliated with the openIMIS Initiative.',
            linkHref: '/insurance-demo/provenance.json',
            linkLabel: 'Inspect evidence manifest',
        },
    },
]

export function getHomeReference(key) {
    return (
        HOME_REFERENCES.find((reference) => reference.key === key) ||
        HOME_REFERENCES.find((reference) => reference.key === DEFAULT_VERTICAL)
    )
}
