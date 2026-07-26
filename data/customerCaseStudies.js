export const RVU_RECOVERY_CASE = {
    slug: 'rvu-audit-heart-care',
    customer: {
        name: 'Dr. Victor Abrich, MD',
        role: 'Board-certified cardiac electrophysiologist',
        organization: 'MercyOne Waterloo Heart Care',
    },
    title: 'Recovering missed billables with automated RVU audits',
    summary:
        'OpenAdapt automated the repetitive EMR evidence collection and spreadsheet reconciliation behind Dr. Victor Abrich’s monthly RVU audits, helping recover about $75,000 a year in missed billables while saving several hours of physician time each month.',
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
    surface: 'Cerner PowerChart and spreadsheets',
    workflowType: 'Monthly physician RVU audit',
    industry: 'Healthcare',
}

export const CUSTOMER_CASE_STUDIES = [RVU_RECOVERY_CASE]
