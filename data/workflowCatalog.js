// Reference catalog of the workflows OpenAdapt has actually recorded, compiled,
// and replayed under an independent effect oracle. This is a REFERENCE CATALOG,
// not a marketplace: every entry is a synthetic, pinned local fixture and none
// is customer-proven. Numbers below are copied from the openadapt-flow benchmark
// READMEs and the committed evidence provenance manifests
// (public/lending-demo/provenance.json, public/insurance-demo/provenance.json).
// Do NOT hand-inflate results; every figure must trace to committed evidence.

const FLOW_REPO = 'https://github.com/OpenAdaptAI/openadapt-flow'

// Canonical substrate maturity labels, reconciled to public/status.json (the
// single source of truth). The same governed loop covers every substrate; the
// label says how broadly each has been exercised today. Beta = broadly
// exercised (browser); Early access = validated on specific named tasks
// (Windows UIA, native macOS, RDP); Exploratory = no validated real-environment
// integration yet (Citrix / VDI). The three catalog entries below all run
// through the browser substrate.
export const SUBSTRATE_MATURITY = {
    browser: 'Beta',
    windows: 'Early access',
    macos: 'Early access',
    rdp: 'Early access',
    citrix: 'Exploratory',
}

// Shared honesty envelope. Every catalog entry sets these explicitly so the
// page can never imply customer proof, publication-grade reliability, or that a
// synthetic fixture is a production deployment.
const HONESTY_DEFAULTS = {
    syntheticFixture: true,
    customerProven: false,
    publicationReady: false,
    environment: 'One pinned local macOS arm64 fixture, loopback-only.',
}

export const CATALOG = [
    {
        id: 'openemr',
        industry: 'Healthcare',
        solutionHref: '/solutions/healthcare',
        application: 'OpenEMR',
        applicationRole: 'Open-source electronic health record (EMR)',
        version: 'v8.0.0.3',
        versionDetail:
            'OpenEMR tag v8.0.0.3 (commit 7c96c8eefe460d6fadbccbe93d0fa6bf819acd69), ' +
            'official image sha256:0aa4d3d5…f19f3ab, MariaDB 11.8.',
        substrate: 'browser',
        substrateLabel: 'Browser (Playwright)',
        maturity: SUBSTRATE_MATURITY.browser,
        task:
            'Create exactly one fictional patient (name, DOB, sex, address, ' +
            'phone, and a reserved example.invalid email) and save it.',
        recording:
            'benchmark/openemr_local — recorded browser demonstration, ' +
            'compiled to a bundle. Baseline SHA-256 ' +
            '8d2901490a0a6a6044e94b6a8a1663436b7dacedda4f2fe1fb8c48405165011d; ' +
            'raw results in the git-ignored local directory ' +
            'results-model-free-corrected5-20260716/.',
        recordingHref: `${FLOW_REPO}/tree/main/benchmark/openemr_local`,
        policy:
            'Model-free run: healthy compiled replay makes 0 model calls at ' +
            '$0 model cost. A separate small-N paid-agent run produced 0/6 ' +
            'correct writes and 6/6 missing_write outcomes, with 0/6 ' +
            'over-halt, 0/6 silent incorrect, and $0.8901/run. ' +
            'Because it used a separately provisioned baseline, ' +
            'full_matrix_complete and publication_ready remain false.',
        identityContract:
            'Two distinct OAuth clients. The actor holds ' +
            'openid api:oemr user/patient.crus; the oracle holds ' +
            'openid api:oemr user/patient.rs (read-only, cannot ' +
            'create/update/delete). The oracle is never the writer.',
        effectOracle:
            'Separately authenticated read-only REST patient readback compared ' +
            'field-for-field with direct SQL from patient_data, plus an exact ' +
            'before/after table-delta inventory and an unchanged-digest check on ' +
            'every non-target patient_data row. Exactly one new patient_data row ' +
            'is required; pixels and actor self-report never establish success.',
        trialResults: {
            headline: '12/12 model-free rows correct',
            detail:
                'Compiled and direct-API arms, baseline + ui_cosmetic_v1 drift, ' +
                '3 trials per cell (compiled 6/6, direct-API 6/6). ' +
                '0 silent incorrect successes, 0 over-halts, 0 model calls, $0.',
            scope:
                'Matched local model-free engineering subset (2026-07-16), not ' +
                'a complete three-arm comparison and not publication evidence.',
        },
        secondaryEvidence:
            'A separate historical field showcase on the shared OpenEMR public ' +
            'demo ran compiled 20/20 vs. computer-use agent 10/10 (2026-07-08); ' +
            'that is a field result on a daily-resetting shared instance, not a ' +
            'CI-reproducible benchmark.',
        knownLimits: [
            'The 6 paid-agent trials used a separate baseline and all ended ' +
                'missing-write; this is not a matched three-arm comparison.',
            'Synthetic PHI-shaped data only (all values fictional); not ' +
                'regulated, clean-machine, or design-partner evidence.',
            'Not customer-proven and not a broad reliability claim.',
        ],
        scope:
            'Synthetic fixtures only; one pinned local macOS arm64 environment; ' +
            '12 model-free trials plus 6 separately provisioned paid-agent ' +
            'trials; not customer-proven.',
        reproduction:
            '.venv/bin/python scripts/openemr_local_demo.py run --profile ' +
            'initial --model-free --bundle benchmark/openemr_local/out/bundle ' +
            '--out benchmark/openemr_local/out/model-free-initial-YYYYMMDD',
        methodologyHref: `${FLOW_REPO}/tree/main/benchmark/openemr_local`,
        license: 'OpenEMR is GPL-licensed and is run, not redistributed.',
        ...HONESTY_DEFAULTS,
    },
    {
        id: 'frappe-lending',
        industry: 'Lending',
        solutionHref: '/solutions/lending',
        application: 'Frappe Lending',
        applicationRole: 'Open-source loan-origination reference (Loan Application)',
        version: 'v16.2.0',
        versionDetail:
            'Lending v16.2.0 (commit caed066b…c0e188), Frappe Framework ' +
            'v16.27.0 (73decbb…f514e), ERPNext v16.27.0 (9d5c7605…daeb1), ' +
            'frappe_docker c004361e…a8960.',
        substrate: 'browser',
        substrateLabel: 'Browser (Playwright)',
        maturity: SUBSTRATE_MATURITY.browser,
        task:
            'Create exactly one synthetic Loan Application — product ' +
            '“OpenAdapt Synthetic Term Loan”, amount 125000, 18 repayment ' +
            'periods, and the declared contact fields — and save one application.',
        recording:
            'benchmark/frappe_lending — recording-live-valid11, compiled to a ' +
            'bundle. Baseline SHA-256 ' +
            '7fd6c965f6b7a11f54e451cdc73fdf65f88d9883dc5f8eb5b2055b3cd4be8b83; ' +
            'raw results in the git-ignored local directory ' +
            'results-model-free-corrected3-20260716/.',
        recordingHref: `${FLOW_REPO}/tree/main/benchmark/frappe_lending`,
        policy:
            'Model-free run: 0 model calls at $0 model cost. Frappe exposes a ' +
            'good REST API, so a real deployment should prefer the API arm; the ' +
            'browser arm isolates the value of compiled replay when a UI path is ' +
            'required. A separate paid-agent run completed 6/6 correct writes ' +
            '(5/6 clean), with 1/6 post-write cost-cap over-halt, 0/6 silent ' +
            'incorrect, and $0.4240/run; its baseline was not matched to the ' +
            'model-free subset, so publication_ready is false.',
        identityContract:
            'A read-only REST fixture user (openadapt.oracle@example.invalid) ' +
            'with a custom read-only Loan Application permission — distinct from ' +
            'the UI/API writer, so it cannot substitute a different Customer.',
        effectOracle:
            'Read-only REST field readback plus direct MariaDB read-back and an ' +
            'exact per-table row-count contract: “tabLoan Application: +1” and ' +
            'every other table +0. A new subscriber table fails closed until ' +
            'reviewed. Pixels and self-report never establish success.',
        trialResults: {
            headline: '12/12 model-free rows correct',
            detail:
                'Compiled and direct-API arms, baseline + ui_cosmetic_v1 drift, ' +
                '3 trials per cell (compiled 6/6, direct-API 6/6). ' +
                '0 silent incorrect successes, 0 over-halts, 0 model calls, $0.',
            scope:
                'Local model-free compiled-vs-API engineering subset ' +
                '(2026-07-16), plus a separate 6-trial paid-agent run ' +
                '(2026-07-21); no matched 10-trial publication matrix.',
        },
        knownLimits: [
            'The paid-agent arm used a separately provisioned baseline; not a ' +
                'matched three-arm comparison.',
            'Frappe is API-rich and is NOT a legacy Windows/Citrix LOS; this is ' +
                'not evidence for a proprietary system such as Encompass or Calyx.',
            'Not customer-proven and not a broad reliability claim.',
        ],
        scope:
            'Synthetic fixtures only; one pinned local macOS arm64 environment; ' +
            '6 compiled + 6 direct-API trials, plus 6 separately provisioned ' +
            'paid-agent trials; not customer-proven.',
        reproduction:
            '.venv/bin/python scripts/frappe_lending_demo.py run --profile ' +
            'initial --model-free --bundle benchmark/frappe_lending/out/bundle ' +
            '--out benchmark/frappe_lending/out/model-free-initial-YYYYMMDD',
        methodologyHref: `${FLOW_REPO}/tree/main/benchmark/frappe_lending`,
        license:
            'Lending and ERPNext are GPL-3.0 and are run, not redistributed.',
        ...HONESTY_DEFAULTS,
    },
    {
        id: 'openimis',
        industry: 'Insurance',
        solutionHref: '/solutions/insurance',
        application: 'openIMIS',
        applicationRole:
            'Open-source insurance/claims management (Health Facility Claim intake)',
        version: '25.10',
        versionDetail:
            'openIMIS 25.10 — backend image sha256:a77228c7…892592, frontend ' +
            'sha256:ed0e0b1d…63db4a, PostgreSQL demo-dataset ' +
            'sha256:d4bc881e…adf29d; distribution commit cd6220d1…d0caa5.',
        substrate: 'browser',
        substrateLabel: 'Browser (Playwright)',
        maturity: SUBSTRATE_MATURITY.browser,
        // openIMIS is explicitly a reference/demo environment, not a benchmark.
        evidenceKind: 'reference demonstration (not a trial matrix)',
        task:
            'Enter exactly one synthetic health-facility claim (insuree number, ' +
            'claim number, diagnosis A000, explanation note, and service A1) and ' +
            'save it into status “Entered”.',
        recording:
            'benchmark/openimis_claims — recorded claim OA000003, then three ' +
            'compiled replays (OA231353, OA231429, OA231458). Evidence commit ' +
            '3276ad2b537c558211a5a357fd7ac1e19f0a029e (openadapt-flow #141).',
        recordingHref: `${FLOW_REPO}/tree/main/benchmark/openimis_claims`,
        policy:
            'Model-free compiled replays: 0 model calls. A separate 3-trial ' +
            'paid-agent run was 3/3 correct, with 0/3 over-halt, 0/3 silent ' +
            'incorrect, and $0.4793/run. This remains a reference/demo ' +
            'environment: no matched timing matrix or publication protocol.',
        identityContract:
            'The openIMIS demo actor credential (Admin) with a fixed health ' +
            'facility (VIHOS001) and claim-administrator context as unmeasured ' +
            'setup. Weaker than the OpenEMR/Frappe entries: verification is by ' +
            'direct SQL rather than a separate read-only oracle client.',
        effectOracle:
            'Direct SQL read of the openIMIS claims database requiring exactly ' +
            'one non-voided claim row per run, in status “Entered”, matching the ' +
            'demonstrated insuree number and health facility. A duplicate or ' +
            'missing row fails the run loudly; pixels never establish success.',
        trialResults: {
            headline: '3/3 compiled replays verified',
            detail:
                '1 recorded demonstration + 3 compiled replays, all 3 ' +
                'SQL-verified. 0 duplicate claims, 0 wrong-policyholder writes, ' +
                '0 model calls. Replay wall times 25.6s / 26.6s / 30.3s.',
            scope:
                'A local reference demonstration plus a separate 3-trial ' +
                'paid-agent run; NOT a benchmark and no publication protocol.',
        },
        knownLimits: [
            'openIMIS is AGPL-3.0 — the reference environment stays ' +
                'repository-only and is never shipped in a packaged artifact.',
            'Reference/demo only: the 3 paid-agent trials were separate, with ' +
                'no matched timing matrix; not ' +
                'adjudication automation.',
            'Not a customer deployment, not Windows/RDP/Citrix, and not ' +
                'customer-proven. OpenAdapt is not affiliated with the openIMIS ' +
                'Initiative.',
        ],
        scope:
            'Synthetic fixtures only (upstream demo dataset plus one bootstrapped ' +
            'synthetic policyholder); one pinned local macOS arm64 environment; ' +
            '3 verified compiled replays plus 3 separately provisioned ' +
            'paid-agent trials; not customer-proven.',
        reproduction:
            '.venv/bin/python scripts/openimis_claims_demo.py replay --bundle ' +
            'benchmark/openimis_claims/out/bundle --headed',
        methodologyHref: `${FLOW_REPO}/tree/main/benchmark/openimis_claims`,
        license:
            'openIMIS is AGPL-3.0 and is run locally, never vendored or ' +
            'redistributed inside an OpenAdapt package.',
        ...HONESTY_DEFAULTS,
    },
]

// Every field the catalog page relies on and the honesty test enforces.
export const REQUIRED_ENTRY_FIELDS = [
    'application',
    'version',
    'substrate',
    'maturity',
    'task',
    'recording',
    'policy',
    'identityContract',
    'effectOracle',
    'trialResults',
    'knownLimits',
    'scope',
    'reproduction',
]
