const assert = require('node:assert/strict')
const test = require('node:test')

test('trust inventory is closed, internally referential, and lane-queryable', async () => {
    const {
        providersForLane,
        trustDataFlowById,
        trustDataFlows,
        trustProviders,
    } = await import('../data/trustProviderInventory.mjs')

    const laneIds = new Set(trustDataFlows.map((lane) => lane.id))
    const providerIds = new Set(trustProviders.map((provider) => provider.id))

    assert.equal(laneIds.size, trustDataFlows.length)
    assert.equal(providerIds.size, trustProviders.length)
    assert.deepEqual(Object.keys(trustDataFlowById).sort(), [...laneIds].sort())

    for (const lane of trustDataFlows) {
        assert.ok(lane.title)
        assert.ok(lane.summary)
        assert.ok(lane.dataClasses.length > 0)
    }

    for (const provider of trustProviders) {
        assert.ok(provider.name)
        assert.ok(provider.purpose)
        assert.ok(provider.data)
        assert.ok(provider.configured)
        assert.ok(provider.lanes.length > 0)
        for (const laneId of provider.lanes) assert.ok(laneIds.has(laneId))
    }

    assert.deepEqual(
        providersForLane('customer-controlled-execution'),
        [],
        'customer-controlled execution must not silently acquire an OpenAdapt provider'
    )
    assert.ok(providersForLane('managed-authoring').length > 0)
    assert.ok(providersForLane('hosted-control-plane').length > 0)
    assert.ok(providersForLane('marketing-site').length > 0)
})

test('sensitive managed data and bounded telemetry stay in separate provider contracts', async () => {
    const { trustProviders } = await import(
        '../data/trustProviderInventory.mjs'
    )
    const byId = Object.fromEntries(
        trustProviders.map((provider) => [provider.id, provider])
    )

    assert.deepEqual(byId.modal.lanes, ['managed-authoring'])
    assert.ok(byId.supabase.lanes.includes('managed-authoring'))
    assert.ok(!byId.posthog.lanes.includes('managed-authoring'))
    assert.ok(!byId['sentry-compatible'].lanes.includes('managed-authoring'))
    assert.ok(!byId.resend.lanes.includes('managed-authoring'))
})
