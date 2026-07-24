const assert = require('node:assert/strict')
const test = require('node:test')

test('qualification scoring preserves the three routing outcomes', async () => {
    const { scoreWorkflowQualification } = await import(
        '../lib/workflowQualification.mjs'
    )

    const cases = [
        {
            expected: 'priority',
            form: {
                monthlyVolume: '5000_plus',
                manualTime: 'over_60',
                stability: 'stable_year',
                inputStructure: 'structured',
                errorConsequence: 'regulated',
                writeApi: 'unavailable',
                verifier: 'independent_interface',
                testEnvironment: 'ready',
                buyerAuthority: 'economic_buyer',
                budget: 'over_40000',
                reusePotential: 'multiple_customers',
            },
        },
        {
            expected: 'review',
            form: {
                monthlyVolume: '100_999',
                manualTime: '5_15',
                stability: 'changes_monthly',
                inputStructure: 'mixed',
                errorConsequence: 'operational',
                writeApi: 'incomplete',
                verifier: 'persisted_reacquisition',
                testEnvironment: 'possible',
                buyerAuthority: 'champion',
                budget: 'under_15000',
                reusePotential: 'one_site',
            },
        },
        {
            expected: 'community',
            form: {
                writeApi: 'supported',
                verifier: 'none',
                budget: 'none',
            },
        },
    ]

    for (const { expected, form } of cases) {
        assert.equal(scoreWorkflowQualification(form).tier, expected)
    }
})
