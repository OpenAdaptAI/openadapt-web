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
        'OpenAdapt automated the repetitive EMR navigation, clicking, and data entry behind Dr. Abrich’s monthly RVU audits.',
    challenge:
        'RVU audits took several hours every month and still did not consistently surface every missed billable.',
    workflow: [
        'Review the month’s procedures and expected RVUs.',
        'Navigate the relevant records in the EMR.',
        'Enter and reconcile audit information through the existing interface.',
        'Surface missed billables for correction and follow-through.',
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
            value: 'EMR-native',
            label: 'navigation, clicking, and data entry automated',
        },
    ],
    result:
        'The automated audit caught billables that manual review did not consistently find, recovering approximately $75,000 per year while saving several hours of physician time each month.',
    surface: 'Electronic medical record',
    workflowType: 'Monthly physician RVU audit',
    industry: 'Healthcare',
}

export const CUSTOMER_CASE_STUDIES = [ABRICH_RVU_AUDIT_CASE]
