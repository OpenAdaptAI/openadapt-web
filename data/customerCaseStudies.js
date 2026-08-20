/*
 * ============================================================================
 * RVU RECOVERY CASE STUDY DATA
 *
 * TWO CONSENT BOUNDARIES, DECIDED SEPARATELY.
 *
 * 1. THE INDIVIDUAL consented to being named. Keep the name.
 * 2. THE EMPLOYER did not, and cannot be named here. A named health system
 *    paired with a claim about missed billables is an assertion about that
 *    institution's billing failures. Describe the setting generically. Do not
 *    reintroduce an employer, hospital, or health-system name to this file,
 *    to the page, or to llms.txt.
 *
 *    Say nothing about WHY the employer is absent, either. An earlier version
 *    explained that the institution had not consented to a public claim about
 *    its billing. That sentence pointed at the very thing it withheld: it told
 *    a reader there was an identifiable employer with a billing story, and the
 *    physician is named, so looking it up is one search away. Omit silently.
 *
 * The subject is the founder's brother. `relationshipDisclosure` below states
 * that on the page. It is not a hedge — an undisclosed family relationship
 * found by a reader costs far more than a disclosed one, and disclosure is
 * what lets the result be read as the founding deployment it is.
 *
 * FIGURES ARE PRELIMINARY, pending customer confirmation. `footnote` renders
 * that. Do not remove it until confirmed values replace the figures.
 * ============================================================================
 */
export const RVU_RECOVERY_CASE = {
    slug: 'rvu-audit-heart-care',
    customer: {
        name: 'Dr. Victor Abrich, MD',
        role: 'Board-certified cardiac electrophysiologist',
        // Generic setting only. See the employer-consent note above.
        organization: 'A US cardiology electrophysiology practice',
    },
    relationshipDisclosure:
        'Disclosure: Dr. Abrich is the founder’s brother. This is OpenAdapt’s founding deployment, not independent validation.',
    title: 'Recovering missed billables with automated RVU audits',
    summary:
        'OpenAdapt now handles the repetitive EMR evidence collection and spreadsheet reconciliation behind Dr. Victor Abrich’s monthly RVU audits. The workflow helps recover about $75,000 a year in missed billables and saves several hours of physician time each month.',
    challenge:
        'Reviewing every relevant chart and reconciling the findings against monthly RVU reports took several hours each month, and manual review still missed billable work.',
    workflow: [
        'Load the month’s RVU report spreadsheets.',
        'Navigate Cerner PowerChart and collect the relevant clinical notes for each patient and service date.',
        'Compare the documented procedures with the procedure codes and RVUs credited in the reports.',
        'Produce an analysis workbook and a copy-ready email listing the missing credits for follow-up.',
    ],
    results: [
        {
            value: '≈$75,000',
            label: 'in missed billables recovered per year',
        },
        {
            value: 'Several hours',
            label: 'of physician audit work saved each month',
        },
        {
            value: 'More complete',
            label: 'audits than manual review alone',
        },
    ],
    result:
        'The automated audit helped recover about $75,000 a year in billables that otherwise would have been missed and replaced several hours of repetitive monthly chart review with review-ready results.',
    quote:
        'The audit automation saved me several hours every month and helped recover about $75,000 a year in billables I would otherwise have missed.',
    outputs: [
        'A row-by-row analysis workbook showing credited and missing procedure codes.',
        'A copy-ready recovery email organized for billing follow-up.',
        'Saved source evidence so each flagged item could be reviewed before submission.',
    ],
    validation: {
        title: 'A six-month governed validation profile',
        summary:
            'The current product contract is exercised against a reproducible 2,880-case synthetic cohort shaped around the same monthly audit: identity before action, persisted-state verification after action, and explicit refusal when the result cannot be proven.',
        metrics: [
            {
                value: '480/month',
                label: 'synthetic encounter cases across six monthly cohorts',
            },
            {
                value: '99.2%',
                label: 'VERIFIED outcomes (2,856 of 2,880 cases)',
            },
            {
                value: '0',
                label: 'silent incorrect successes in the cohort',
            },
            {
                value: '$0.03',
                label: 'modeled reference execution cost per case',
            },
        ],
        facts: [
            {
                term: 'Full outcome set',
                detail:
                    '2,856 VERIFIED · 18 HALTED for identity, ambiguity, or effect refusal · 6 FAILED before actuation.',
            },
            {
                term: 'Execution boundary',
                detail:
                    'Customer-controlled Windows/RDP profile · Standard execution · OpenAdapt Flow 1.23.0 · cardiology RVU workflow pack 0.4.2.',
            },
            {
                term: 'Independent adjudication',
                detail:
                    'A separate persisted-state judge compares the intended and observed record digests. A mismatched write can never count as VERIFIED.',
            },
            {
                term: 'Data boundary',
                detail:
                    'Synthetic records only, zero model calls, and no observed external network calls. Raw case rows and the application recipe remain inside the private evidence boundary.',
            },
        ],
        evidenceReference:
            'rvu-audit-standard-synthetic-v1 · rollup sha256 66c0731c4b754f2beb780562cddc03bdfe66f74acb5a64445c22ea97f64974b9',
        note:
            'Customer outcomes above come from Dr. Abrich’s audit work. The governed-run figures are the product’s synthetic qualification cohort for this workflow family.',
    },
    surface: 'Cerner PowerChart and spreadsheets',
    workflowType: 'Monthly physician RVU audit',
    industry: 'Healthcare',
}

// Preliminary-figures footnote, rendered at the bottom of the case-study page.
// Restored from the pre-#305 version of this file: the figures on this page are
// still described internally as preliminary and pending customer confirmation,
// so the page must say so.
export const RVU_RECOVERY_FOOTNOTE =
    'Figures on this page are preliminary and under review pending final customer confirmation.'

export const CUSTOMER_CASE_STUDIES = [RVU_RECOVERY_CASE]
