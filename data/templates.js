/**
 * Workflow template registry — the single source of truth for /templates.
 *
 * Adding a template later = adding ONE entry here. The index page, the
 * per-template static pages, their metadata, and their JSON-LD all render
 * from this file; tests/templatesGallery.test.js enforces that sitemap.xml
 * and llms.txt list every entry.
 *
 * HONESTY BAR (enforced by tests/templatesGallery.test.js):
 * - `proof: 'reference'`  — the workflow runs today against the named
 *   open-source reference app, in the openadapt-flow repo, with the named
 *   verification. Steps are the real demonstrated steps.
 * - `proof: 'field'`      — additionally measured in a field run (see
 *   `evidence`), with the field-test caveats stated on the page.
 * - `proof: 'pattern'`    — a workflow SHAPE you compile from a recording of
 *   your own team; anchored to a proven reference via `anchors`. No canned
 *   connector for any specific commercial portal is implied or shipped.
 * - `runsOn` may only name applications we have actually driven
 *   (MockMed, OpenEMR, Frappe Lending, openIMIS) or the customer's own app.
 */

const FLOW_REPO = 'https://github.com/OpenAdaptAI/openadapt-flow'

// The canonical end-user quickstart enters through the flagship OpenAdapt
// package while source links below continue to point to the engine repository.
const DEMO_QUICKSTART = [
    { cmd: 'pip install openadapt', what: 'Install the OpenAdapt launcher and governed compiler.' },
    { cmd: 'openadapt flow demo-record --out rec', what: 'Serve the bundled MockMed clinic app locally and record the canonical triage demonstration.' },
    { cmd: 'openadapt flow compile rec --out bundle --name triage-note', what: 'Compile the recording into a deterministic, locally executable bundle.' },
    { cmd: 'openadapt flow lint bundle', what: 'Report the bundle’s coverage gaps — expected: it finds the demo’s unarmed irreversible final click.' },
    { cmd: 'openadapt flow certify bundle --policy clinical-write', what: 'Enforce the strict clinical-write policy — expected: refusal. That is the safety boundary working.' },
    { cmd: 'openadapt flow replay bundle', what: 'Replay locally, $0, no model calls; writes report.json and an illustrated REPORT.md.' },
]

const RECORD_YOUR_OWN = [
    { cmd: 'pip install openadapt', what: 'Install the OpenAdapt launcher and governed compiler.' },
    { cmd: 'openadapt flow record --url https://your.app --out rec', what: 'Open a headed browser on your app and demonstrate the workflow once; Ctrl-C to finish.' },
    { cmd: 'openadapt flow compile rec --out bundle --name my-task', what: 'Compile the recording into a deterministic bundle with auto-classified risk per step.' },
    { cmd: 'openadapt flow lint bundle && openadapt flow certify bundle --policy permissive', what: 'Surface coverage gaps, then gate the bundle against a policy before it ever deploys.' },
    { cmd: 'openadapt flow replay bundle --url https://your.app --param name=value', what: 'Replay against your app; recorded values are defaults and --param overrides them.' },
]

const templates = [
    // ------------------------------------------------------------------
    // Proven references
    // ------------------------------------------------------------------
    {
        slug: 'patient-triage-note',
        title: 'Automate patient triage note entry',
        vertical: 'healthcare',
        proof: 'reference',
        summary:
            'The canonical OpenAdapt tutorial: a nurse’s triage-note workflow demonstrated once in a synthetic clinic app, compiled into a deterministic local program, and replayed with the note text as a parameter — including the policy gate that refuses to certify it for clinical writes.',
        metaDescription:
            'Automate patient triage note entry: record the workflow once, compile it into deterministic local replay, and see the clinical-write policy gate refuse an under-verified bundle. Runs today with two commands.',
        runsOn:
            'MockMed, the synthetic clinic application bundled with the OpenAdapt CLI — no setup and no real patient data. It ships so you can run this entire template in about two minutes.',
        steps: [
            'Sign in to the clinic app',
            'Open the first referral in the task list',
            'Start a new encounter for the patient',
            'Select the Triage encounter type',
            'Enter the triage note — recorded as the parameter "note", overridable at every replay',
            'Save the encounter',
        ],
        parameters: ['note — the triage note text'],
        verification:
            'Replay writes report.json and an illustrated REPORT.md for every run. lint reports the demonstration’s coverage gaps — including its unarmed irreversible final click — and certify with the strict clinical-write policy refuses the bundle. That refusal is deliberate: the bundled tutorial is runnable but intentionally not certified for clinical writes, so you see the governance boundary working before you trust it with a workflow that matters.',
        verificationOracles: ['per-step postconditions', 'lint coverage report', 'policy certification gate (permissive passes, clinical-write refuses)'],
        quickstart: DEMO_QUICKSTART,
        source: `${FLOW_REPO}#try-it`,
        evidence:
            'A nightly clean-machine test runs this complete install-to-uninstall journey on Linux, macOS, and Windows.',
    },
    {
        slug: 'openemr-patient-note',
        title: 'Automate patient note entry in OpenEMR',
        vertical: 'healthcare',
        proof: 'field',
        summary:
            'The flagship healthcare reference: an 18-step add-patient-note workflow on OpenEMR — log in, find the patient, open the chart, navigate to Patient Messages, enter a parameterized note, save — with the write confirmed against the record itself, never the screen.',
        metaDescription:
            'Automate patient note entry in OpenEMR: an 18-step demonstrated workflow compiled into deterministic replay, verified against the system of record, with a published field run of 20/20 compiled trials at zero model calls.',
        runsOn:
            'OpenEMR, the open-source EMR — demonstrated against the third-party OpenEMR public demo (fake patients only; never point this at a real install without qualification) and reproduced in CI against a fixture system of record.',
        steps: [
            'Log in as the demo admin',
            'Search for the demo patient',
            'Open the patient’s chart',
            'Scroll the dense Medical Record Dashboard to the Messages card',
            'Open Patient Messages',
            'Enter the note — a distinct parameterized value per run, so a pass proves parameter substitution against real state, not replay of a baked-in literal',
            'Save and confirm',
        ],
        parameters: ['note — the message text written to the patient record'],
        verification:
            'The Save step carries system-of-record effect contracts (record_written and a field_equals check on the note). The CI-reproducible harness proves the whole loop composes: a clean replay is CONFIRMED against the record; under an injected fault the screen still paints “Saved” while the record drops the note — effect verification REFUTES the run and it halts. Screen-only checking would have passed. An unexpected consent modal likewise halts the run, the operator’s correction is taught back as a governed, gated branch, and the taught program re-runs the same drift to success.',
        verificationOracles: ['record_written effect contract', 'field_equals on the saved note (record, not screen)', 'halt on refuted effect', 'governed teach-and-promote loop'],
        quickstart: RECORD_YOUR_OWN,
        source: `${FLOW_REPO}/tree/main/benchmark/openemr_e2e`,
        evidence:
            'Field run on the real third-party OpenEMR public demo: compiled replay went 20/20 versus 10/10 for a computer-use agent, faster and with zero model calls. Field test, not CI-reproducible — the public demo is shared, resets daily, and the agent sample is small; the verifier and task-prompt units run in CI.',
    },
    {
        slug: 'frappe-loan-application',
        title: 'Automate loan application entry in Frappe Lending',
        vertical: 'lending',
        proof: 'reference',
        summary:
            'The lending reference: a loan application entered once on Frappe Lending, compiled into model-free replay, and accepted only when a separately authenticated read-only REST session, a direct SQL read-back, and an exact table-delta audit all agree that exactly one application was written.',
        metaDescription:
            'Automate loan application entry: a demonstrated Frappe Lending workflow compiled into deterministic, model-free replay and verified by independent REST, SQL, and exact table-delta oracles. 6/6 compiled trials correct, 0 silent incorrect successes, 0 model calls.',
        runsOn:
            'Frappe Lending v16.2.0, run locally as a pinned, fully synthetic fixture — every trial restores the same SHA-256-bound database snapshot. Frappe exposes a good REST API, so a real deployment should prefer the API; the browser arm isolates what compiled replay is worth when a UI path is required.',
        steps: [
            'On the Loan Application opened for the fixture customer, enter the applicant contact email',
            'Enter the applicant contact phone',
            'Scroll from the contact inputs to the lower loan controls — the demonstrated navigation is preserved in the compiled program, not hidden',
            'Select the loan product, waiting for the exact visible suggestion before confirming',
            'Enter the loan amount',
            'Enter the number of repayment periods',
            'Save exactly one application',
        ],
        parameters: ['email', 'phone', 'loan product', 'amount', 'repayment periods'],
        verification:
            'Three independent oracles, none of which is the writer: a read-only REST session authenticated as a separate fixture user, a direct SQL read-back of the target fields, and an exact per-table row-count contract — the only accepted change is exactly one new Loan Application row; every other table must stay untouched. A duplicate write, a wrong-customer write, or a collateral insert fails the run loudly. Pixels and actor self-report never establish success.',
        verificationOracles: ['separately authenticated read-only REST', 'direct SQL read-back', 'exact table-delta audit (tabLoan Application: +1, all else +0)'],
        quickstart: RECORD_YOUR_OWN,
        source: `${FLOW_REPO}/tree/main/benchmark/frappe_lending`,
        evidence:
            '6/6 compiled trials correct across the pinned baseline and a cosmetic-drift variant — 0 silent incorrect successes, 0 over-halts, 0 model calls, $0 model cost. An initial engineering matrix, not a publication benchmark; the full comparative matrix (paid agent arm, 10 fresh trials per cell) is still open.',
    },
    {
        slug: 'openimis-claim-intake',
        title: 'Automate health insurance claim intake in openIMIS',
        vertical: 'insurance',
        proof: 'reference',
        summary:
            'The insurance reference: a health-facility claim entered once in openIMIS — the open-source system used by national health-insurance schemes — compiled, and replayed with a fresh claim number, with success established only by a direct SQL read of the claim row.',
        metaDescription:
            'Automate insurance claim intake: a demonstrated openIMIS claims workflow compiled into deterministic replay and accepted only when the claims database shows exactly one new claim row in status Entered for the right policyholder and facility.',
        runsOn:
            'openIMIS 25.10, run locally from digest-pinned images with the upstream synthetic demo dataset — fictional insurees, facilities, and tariffs; everything binds to localhost. openIMIS is a browser UI over a supported GraphQL API, so a real openIMIS deployment should prefer the API; the browser demonstration stands in for the many commercial claims platforms that expose no such API.',
        steps: [
            'On the blank Health Facility Claim form, enter the insuree number — which resolves the policyholder and her in-force policy',
            'Enter the claim number — a parameter, substituted fresh at every replay',
            'Enter the main diagnosis code',
            'Enter the explanation note — a parameter',
            'Add the service (auto-tariffed by the system)',
            'Save the claim into status “Entered” — the step before checking and adjudication',
        ],
        parameters: ['insurance_no', 'claim_no', 'explanation'],
        verification:
            'A direct SQL oracle on the claims database: the run is accepted only when exactly one non-voided claim row exists with the replayed claim number, in status Entered, for the demonstrated insuree and health facility. The costly failure in claims operations is not a crash — it is the claim silently entered twice, or against the wrong policyholder, surfacing weeks later in reconciliation. A duplicate or missing row fails this run loudly instead of reporting success.',
        verificationOracles: ['direct SQL claim-row oracle (exactly one non-voided row, status Entered, right insuree and facility)'],
        quickstart: RECORD_YOUR_OWN,
        source: `${FLOW_REPO}/tree/main/benchmark/openimis_claims`,
        evidence:
            'A reference environment, deliberately not a benchmark: no timing matrix and no agent arm. Any future reliability claim requires the full matched protocol the Frappe Lending and OpenEMR references define.',
    },

    // ------------------------------------------------------------------
    // Pattern templates — compiled from a recording of YOUR team
    // ------------------------------------------------------------------
    {
        slug: 'dental-insurance-eligibility',
        title: 'Automate dental insurance eligibility checks',
        vertical: 'dental',
        proof: 'pattern',
        anchors: ['openimis-claim-intake', 'patient-triage-note'],
        summary:
            'The front-desk workflow every practice runs dozens of times a day: sign in to the payer portal, look up the patient, read coverage and benefits, and carry the answer into the practice management system — demonstrated once by your own team, then compiled and replayed per patient.',
        metaDescription:
            'Automate dental insurance eligibility checks: compile your front desk’s own payer-portal verification workflow into deterministic local replay that halts and asks instead of guessing wrong. Runs on your front-desk computer.',
        runsOn:
            'Your practice’s own payer portals and practice management system, from a recording of your team performing one verification. There is no canned connector for any specific payer portal — each workflow is compiled from your demonstration and qualified against your applications. The verified-write mechanics are proven on the openIMIS insurance reference, where policyholder resolution and the resulting write are checked against the insurance database itself.',
        steps: [
            'Sign in to the payer portal — credentials are secret parameters, never written to the recording or the bundle',
            'Look up the patient by member ID and date of birth — the per-patient parameters',
            'Open the coverage and benefits view',
            'Read the eligibility result and the benefit fields your practice actually uses',
            'Record the result where your workflow puts it — the PMS, a worksheet, or the schedule',
        ],
        parameters: ['member ID', 'date of birth', 'payer selection — as demonstrated by your team'],
        verification:
            'Every step carries identity checks derived from the demonstration — the compiled program verifies it is looking at the right member before it reads or writes anything, and halts and asks instead of proceeding when the portal shows something it never saw demonstrated. Where the result lands in a system with a database, API, or export you control, the write is bound to an effect contract and checked against that system of record, not the screen.',
        verificationOracles: ['pre-action target-identity checks', 'halt on undemonstrated portal state', 'effect contract on the recorded result where a system of record exists'],
        quickstart: RECORD_YOUR_OWN,
        source: `${FLOW_REPO}/tree/main/benchmark/openimis_claims`,
        evidence: null,
    },
    {
        slug: 'insurance-eligibility-check',
        title: 'Automate insurance eligibility and coverage checks',
        vertical: 'insurance',
        proof: 'pattern',
        anchors: ['openimis-claim-intake', 'frappe-loan-application'],
        summary:
            'For agencies, billers, and back-office teams: the repeated carrier-portal lookup — member or policy number in, coverage answer out — demonstrated once, compiled into a deterministic program, and replayed per case with halting instead of silent wrong answers.',
        metaDescription:
            'Automate insurance eligibility and coverage checks: compile your team’s own carrier-portal lookup into deterministic replay with per-case parameters, identity checks on every step, and a halt instead of a silently wrong answer.',
        runsOn:
            'Your organization’s own carrier portals and systems, from a recording of your team performing one check. No canned carrier connectors are implied — each workflow is compiled from your demonstration and qualified against your applications. The underlying mechanics — policy resolution against a live insurance system and database-verified writes — are proven on the openIMIS reference.',
        steps: [
            'Sign in to the carrier portal — credentials are secret parameters, redacted from the recording and injected from the environment at replay',
            'Look up the member or policy — the per-case parameters',
            'Open the coverage, benefits, or status view',
            'Read the fields your process needs',
            'Record the answer into your system of record or worksheet',
        ],
        parameters: ['member or policy number', 'any per-case identifiers your team demonstrated'],
        verification:
            'The compiled program verifies target identity before every consequential action — the wrong policyholder on screen is a halt, not a wrong answer written downstream. Anything the demonstration never covered (an unexpected modal, a changed portal state) halts and asks. Where the answer is written into a system with a database, API, or file export, that write is bound to an effect contract and confirmed against the system of record.',
        verificationOracles: ['pre-action target-identity checks', 'halt on undemonstrated state', 'effect contract on the downstream write where a system of record exists'],
        quickstart: RECORD_YOUR_OWN,
        source: `${FLOW_REPO}/tree/main/benchmark/openimis_claims`,
        evidence: null,
    },
    {
        slug: 'new-patient-record',
        title: 'Automate new patient record entry',
        vertical: 'healthcare',
        proof: 'pattern',
        anchors: ['openemr-patient-note', 'patient-triage-note'],
        summary:
            'Registration and intake re-keying — demographics from a referral, a form, or an existing structured source entered into the EMR or PMS — demonstrated once by your team, compiled, and replayed per patient with the fields as parameters.',
        metaDescription:
            'Automate new patient record entry: compile your team’s own registration workflow into deterministic replay with per-patient parameters and identity checks, anchored to the OpenEMR reference where writes are verified against the record itself.',
        runsOn:
            'Your clinic’s own EMR or practice management system, from a recording of your team entering one record. The write-verification mechanics are proven on OpenEMR, the open-source EMR, where a compiled note write is confirmed against the patient record itself — and a fault that paints “Saved” on screen while dropping the write is caught and halted.',
        steps: [
            'Open the new-patient or registration form in your EMR or PMS',
            'Enter the demographic fields — each one a parameter, substituted per patient at replay',
            'Enter coverage or referral details as demonstrated',
            'Save the record',
        ],
        parameters: ['the demographic and coverage fields your team demonstrated — one parameter each'],
        verification:
            'Write-shaped steps are auto-classified as irreversible at compile time, which arms the low-confidence refusal: the program halts rather than saving into ambiguity. lint reports any step that acts without an identity check before you deploy, and certify can refuse the bundle under a strict policy. Where your EMR exposes a database, API, or export, the save is bound to an effect contract and confirmed against the record — the OpenEMR reference demonstrates exactly this, including catching a silent dropped write behind a “Saved” screen.',
        verificationOracles: ['irreversible-write classification and refusal arming', 'lint coverage gate before deploy', 'effect contract on the saved record where a system of record exists'],
        quickstart: RECORD_YOUR_OWN,
        source: `${FLOW_REPO}/tree/main/benchmark/openemr_e2e`,
        evidence: null,
    },
    {
        slug: 'report-export-verification',
        title: 'Automate report exports and verify the file actually arrived',
        vertical: 'operations',
        proof: 'pattern',
        anchors: ['frappe-loan-application'],
        summary:
            'The scheduled export nobody trusts: run the report, download or drop the file, and — the part the screen can’t prove — verify that exactly one conforming file actually landed, with the right name, a plausible size, a fresh timestamp, and optionally the exact expected content.',
        metaDescription:
            'Automate report exports with arrival verification: compile the export workflow once, then accept each run only when exactly one new conforming file actually arrived — name, size, freshness, and optional content hash — instead of trusting an “Export complete” screen.',
        runsOn:
            'Your own reporting application and output folder or SFTP endpoint, from a recording of your team running one export. The file-arrival and document-hash verifiers are part of the shipping runtime and run live in CI; local directories are first-class and SFTP endpoints are supported.',
        steps: [
            'Open the report in your application',
            'Set the demonstrated filters or date range — parameters at replay',
            'Trigger the export',
            'Let the effect contract — not the screen — establish whether the file arrived',
        ],
        parameters: ['report filters or date range as demonstrated'],
        verification:
            'An “Export complete” message proves nothing; the truth is whether a file matching the contract actually arrived. The file-arrival verifier checks name pattern, non-trivial size, fresh modification time, and optionally content — and its exactly-one-new-file contract catches the double export that quietly writes “report (1).csv”. When the expected bytes are known, the document-hash verifier confirms content identity by SHA-256, catching a truncated or partial write even though the file exists. A missing or unreadable output folder is indeterminate and halts — never “no file expected”.',
        verificationOracles: ['file-arrival contract (exactly one new conforming file: name, size, freshness)', 'SHA-256 document-hash content check', 'halt on unreadable export target'],
        quickstart: RECORD_YOUR_OWN,
        source: `${FLOW_REPO}/blob/main/openadapt_flow/runtime/effects/file_arrival.py`,
        evidence: null,
    },
]

module.exports = { templates, FLOW_REPO }
