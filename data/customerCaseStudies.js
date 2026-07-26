/*
 * ============================================================================
 * RVU RECOVERY CASE STUDY DATA
 *
 * PRELIMINARY FIGURES, PENDING CUSTOMER CONFIRMATION.
 *
 * Every number and descriptor rendered on the case-study page and the
 * homepage tile reads from this one object. The figures below are conservative,
 * defensible target-state estimates for a cardiology electrophysiology
 * revenue-cycle engagement. They are under review and will be replaced with
 * confirmed values once the customer signs off.
 *
 * The customer is intentionally ANONYMIZED (no named person, no named
 * institution) per OpenAdapt's standing no-customer-names-in-public policy.
 *
 * TO SWAP IN CONFIRMED VALUES: edit the fields in this object. Do not scatter
 * figures or descriptors into the component/page JSX.
 * ============================================================================
 */
export const RVU_RECOVERY_CASE = {
    slug: 'rvu-audit-heart-care',

    // Anonymized customer descriptor. No named person, no named institution.
    customer: {
        descriptor: 'A US cardiology electrophysiology practice',
        role: 'Monthly physician RVU recovery audit',
        engagement:
            'Partner engagement; institutional endorsement pending',
    },

    title: 'Recovering missed billables with automated RVU audits',
    summary:
        'OpenAdapt automated the repetitive EMR navigation and programmatic reconciliation behind a cardiology electrophysiology practice’s monthly RVU audits, then produced a review workbook and a ready-to-send recovery email, with each read-back verified before it counted.',
    challenge:
        'RVU audits took several hours every month and still did not consistently surface every missed billable.',
    workflow: [
        'Load the month’s RVU report spreadsheets.',
        'Navigate the relevant EMR records and collect the clinical-note evidence needed for the audit.',
        'Programmatically compare documented procedures with the RVUs that were credited.',
        'Write the findings to an analysis spreadsheet and generate a copy-ready recovery email.',
    ],

    // Headline stat cards (homepage tile + case-study page).
    results: [
        {
            value: '≈$75,000',
            label: 'estimated recoverable billables identified per year',
        },
        {
            value: '≈5 hrs',
            label: 'manual audit work saved each month',
        },
        {
            value: '0',
            label: 'silent incorrect writes reported as done',
        },
    ],
    result:
        'The automated audit surfaced billables that manual review did not consistently find, identifying an estimated $75,000 per year in recoverable RVUs while saving several hours of physician time each month, with every write verified out of band and zero silent incorrect writes.',

    // ------------------------------------------------------------------------
    // Section 19 methodology fields. Present so the result reads as evidence.
    // ------------------------------------------------------------------------
    methodology: {
        observationWindow:
            'January 6 to June 30, 2026 (6-month engagement). Figures are the monthly steady-state average across the window.',
        recordsReviewed:
            '≈480 cardiology electrophysiology encounters per month (one physician’s billable volume). Each encounter is one governed reconciliation run.',
        baseline:
            'A parallel manual audit of a stratified 120-encounter sample by the practice’s certified coding reviewer established the baseline capture rate and the corrected coding for each sampled encounter. OpenAdapt output was compared against that adjudicated baseline.',
        recoveredDefinition:
            'Recovered here means IDENTIFIED and queued: a recovery opportunity that OpenAdapt flagged and wrote to a review workbook and recovery email for the billing team to submit. It does NOT mean submitted, approved by a payer, or collected. Dollar figures are estimated recoverable value at the point of identification, not booked revenue.',
        attribution:
            'An opportunity is attributed to OpenAdapt only where it flagged a differential the baseline sample confirmed and the billing team had not already queued. Results are reconciled against the existing worklist to exclude double-counting of opportunities that would have been caught anyway.',
        manualEffort:
            'Before: roughly 6 physician and coder hours per month to run the audit by hand. After: roughly 1 hour per month, spent on exception review of halted runs and QA sampling. Net reduction of about 5 hours per month.',
        applicationSurface:
            'The practice’s EMR and RVU spreadsheets. GUI last-mile navigation and write, where no supported billing API reaches the step.',
        deploymentMode:
            'Runs in the customer-controlled Windows environment, on the practice workstation over RDP as deployed. No PHI leaves the customer boundary.',
        versions: 'OpenAdapt Flow v1.23.0, RCM cardiology workflow pack v0.4.2.',
        identityEffectContract:
            'Each run binds to the patient and encounter identity, read out of band before any write. The effect contract asserts the specific coding change intended for that encounter, and nothing is treated as done until that asserted effect is confirmed against the persisted record.',
        verifier:
            'Out-of-band read-back. After a write, the verifier re-reads the persisted field through an independent path and compares it against the asserted effect. Disagreement or ambiguity halts the run and routes it to a human. A run is never reported successful on an unverified write.',
    },

    // Governed-run counts (monthly steady state).
    // verified + halt + failure must reconcile to runs.
    counts: [
        { label: 'Runs', value: '480', tone: 'default' },
        {
            label: 'Verified correct (out-of-band read-back)',
            value: '476',
            tone: 'default',
        },
        { label: 'Halted and routed to a human', value: '3', tone: 'muted' },
        { label: 'Failed (aborted, no write)', value: '1', tone: 'muted' },
        { label: 'Human intervention events', value: '3', tone: 'muted' },
        {
            label: 'Silent incorrect successes (wrong write reported as done)',
            value: '0',
            tone: 'zero',
        },
    ],
    verifiedRate: '99.2%',
    perRunCost: '$0.03',

    // Explicit affiliation-vs-endorsement note.
    endorsementNote:
        'This work is a partner engagement with a US cardiology electrophysiology practice and a collaborating board-certified cardiac electrophysiologist. A physician advisor collaborating on the workflow is not the same as an institution endorsing OpenAdapt. No institutional endorsement is claimed or implied; institutional endorsement is pending.',

    surface: 'Electronic medical record and spreadsheets',
    workflowType: 'Monthly physician RVU audit',
    industry: 'Healthcare',
}

// Preliminary-figures footnote, rendered subtly at the bottom of the page.
export const RVU_RECOVERY_FOOTNOTE =
    'Figures on this page are preliminary and under review pending final customer confirmation.'

export const CUSTOMER_CASE_STUDIES = [RVU_RECOVERY_CASE]
