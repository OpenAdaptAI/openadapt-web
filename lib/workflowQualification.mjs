const SCORE_TABLES = Object.freeze({
    monthlyVolume: {
        under_100: 0,
        '100_999': 1,
        '1000_4999': 2,
        '5000_plus': 3,
    },
    manualTime: {
        under_5: 0,
        '5_15': 1,
        '16_60': 2,
        over_60: 3,
    },
    stability: {
        changes_weekly: 0,
        changes_monthly: 1,
        stable_quarter: 2,
        stable_year: 3,
    },
    inputStructure: {
        open_ended: 0,
        mixed: 1,
        mostly_structured: 2,
        structured: 3,
    },
    errorConsequence: {
        low: 0,
        operational: 1,
        financial: 2,
        regulated: 3,
    },
    writeApi: {
        supported: 0,
        incomplete: 1,
        unavailable: 3,
    },
    verifier: {
        none: 0,
        screen: 1,
        persisted_reacquisition: 2,
        independent_session: 3,
        independent_interface: 4,
    },
    testEnvironment: {
        unavailable: 0,
        possible: 1,
        ready: 2,
    },
    buyerAuthority: {
        exploring: 0,
        champion: 1,
        buyer_involved: 2,
        economic_buyer: 3,
    },
    budget: {
        none: 0,
        under_15000: 1,
        '15000_40000': 3,
        over_40000: 4,
    },
    reusePotential: {
        one_off: 0,
        one_site: 1,
        multiple_sites: 2,
        multiple_customers: 3,
    },
})

const valueScore = (table, value) => SCORE_TABLES[table]?.[value] || 0

export function scoreWorkflowQualification(form) {
    const score =
        valueScore('monthlyVolume', form.monthlyVolume) +
        valueScore('manualTime', form.manualTime) +
        valueScore('stability', form.stability) +
        valueScore('inputStructure', form.inputStructure) +
        valueScore('errorConsequence', form.errorConsequence) +
        valueScore('writeApi', form.writeApi) +
        valueScore('verifier', form.verifier) +
        valueScore('testEnvironment', form.testEnvironment) +
        valueScore('buyerAuthority', form.buyerAuthority) +
        valueScore('budget', form.budget) +
        valueScore('reusePotential', form.reusePotential)

    const hasBudget =
        form.budget === '15000_40000' || form.budget === 'over_40000'
    const needsUiActuation = form.writeApi !== 'supported'
    const hasVerifier = form.verifier !== 'none'

    if (score >= 20 && hasBudget && needsUiActuation && hasVerifier) {
        return { score, tier: 'priority' }
    }
    if (score >= 12 && needsUiActuation) {
        return { score, tier: 'review' }
    }
    return { score, tier: 'community' }
}

export const QUALIFICATION_TIERS = Object.freeze({
    priority: {
        heading: 'This looks like a strong qualification candidate.',
        message:
            'Book a workflow review now. We will use your submitted scope to prepare the call.',
        action: 'Book the workflow review',
        href: '/book',
    },
    review: {
        heading: 'This workflow merits a closer review.',
        message:
            'We will review the application, verification path, and deployment boundary and reply within one business day.',
        action: 'Book a review now',
        href: '/book',
    },
    community: {
        heading: 'The open-source demo is the best next step.',
        message:
            'We will still review your submission. In the meantime, validate the workflow shape locally before funding a qualification sprint.',
        action: 'Run the open-source demo',
        href: 'https://docs.openadapt.ai/get-started/',
    },
})
