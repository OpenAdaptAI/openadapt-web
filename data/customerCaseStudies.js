export const ABRICH_RVU_AUDIT_CASE = {
    slug: 'rvu-audit-heart-care',
    customer: {
        name: 'Dr. Victor Abrich, MD',
        role: 'Board-certified electrophysiologist',
        organization: 'MercyOne Waterloo Heart Care',
        profileUrl:
            'https://www.mercyone.org/provider/victor-abrich-md-electrophysiology',
    },
    title: 'Recovering missed billables with automated RVU audits',
    summary:
        'OpenAdapt automated the repetitive EMR navigation and programmatic reconciliation behind Dr. Abrich’s monthly RVU audits, then produced a review workbook and a ready-to-send recovery email.',
    challenge:
        'RVU audits took several hours every month and still did not consistently surface every missed billable.',
    workflow: [
        'Load the month’s RVU report spreadsheets.',
        'Navigate the relevant EMR records and collect the clinical-note evidence needed for the audit.',
        'Programmatically compare documented procedures with the RVUs that were credited.',
        'Write the findings to an analysis spreadsheet and generate a copy-ready recovery email.',
    ],
    results: [
        {
            value: '≈$75,000',
            label: 'recovered billables per year',
        },
        {
            value: 'Several hours',
            label: 'of manual audit work saved each month',
        },
        {
            value: 'Review-ready',
            label: 'analysis workbook and recovery email generated',
        },
    ],
    result:
        'The automated audit caught billables that manual review did not consistently find, recovering approximately $75,000 per year while saving several hours of physician time each month.',
    surface: 'Electronic medical record and spreadsheets',
    workflowType: 'Monthly physician RVU audit',
    industry: 'Healthcare',
}

export const CUSTOMER_CASE_STUDIES = [ABRICH_RVU_AUDIT_CASE]
