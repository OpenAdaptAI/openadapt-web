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
        {
            expected: 'community',
            form: {
                monthlyVolume: '5000_plus',
                manualTime: 'over_60',
                stability: 'stable_year',
                inputStructure: 'structured',
                errorConsequence: 'regulated',
                writeApi: 'unavailable',
                verifier: 'none',
                testEnvironment: 'ready',
                buyerAuthority: 'economic_buyer',
                budget: 'over_40000',
                reusePotential: 'multiple_customers',
            },
        },
    ]

    for (const { expected, form } of cases) {
        assert.equal(scoreWorkflowQualification(form).tier, expected)
    }
})

test('a qualification submission produces one traceable sales-task contract', async () => {
    const {
        QUALIFICATION_SALES_TASK_SCHEMA,
        buildQualificationSalesTask,
    } = await import('../lib/workflowQualification.mjs')
    const task = buildQualificationSalesTask({
        id: 'qualification_018f5b5a-1f8d-7e20-8b70-4e0c8d9a4f21',
        qualification: { score: 24, tier: 'priority' },
        sourceRoute: '/qualify',
        submittedAt: '2026-08-01T12:00:00.000Z',
    })

    assert.deepEqual(task, {
        salesTaskSchema: QUALIFICATION_SALES_TASK_SCHEMA,
        salesTaskId: 'qualification_018f5b5a-1f8d-7e20-8b70-4e0c8d9a4f21',
        salesTaskStatus: 'new',
        sourceRoute: '/qualify',
        bookingState: 'not_booked',
        submittedAt: '2026-08-01T12:00:00.000Z',
        qualificationScore: '24',
        qualificationTier: 'priority',
    })
})
