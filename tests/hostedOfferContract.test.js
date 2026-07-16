const assert = require('node:assert/strict')
const test = require('node:test')

const {
    hostedOfferFromPrice,
    monthlyRunCapLabel,
    parseMonthlyRunCap,
} = require('../lib/hostedOfferContract')

function recurringPrice(monthlyRunCap = '10000') {
    return {
        active: true,
        livemode: true,
        type: 'recurring',
        unit_amount: 50000,
        currency: 'usd',
        billing_scheme: 'per_unit',
        transform_quantity: null,
        custom_unit_amount: null,
        tiers_mode: null,
        currency_options: {},
        lookup_key: 'openadapt_cloud_usd_monthly_500_10000_v1',
        recurring: {
            interval: 'month',
            interval_count: 1,
            usage_type: 'licensed',
            trial_period_days: null,
        },
        product: {
            id: 'prod_openadapt_cloud',
            active: true,
            livemode: true,
            name: 'OpenAdapt Cloud',
            metadata: {
                monthly_run_cap: monthlyRunCap,
                substrate: 'browser',
                lifecycle: 'beta',
            },
        },
    }
}

test('builds the display offer from one expanded Stripe Price and Product', () => {
    assert.deepEqual(hostedOfferFromPrice(recurringPrice()), {
        amount: '$500.00',
        cadence: '/month',
        product: 'OpenAdapt Cloud',
        monthlyRunCap: 10000,
    })
    assert.equal(monthlyRunCapLabel(10000), 'Up to 10,000 workflow runs/month')
})

test('refuses a missing or malformed Product run cap rather than inventing one', () => {
    for (const value of ['', '0', '-1', '1.5', '1e4', ' 10000', 10000]) {
        assert.equal(parseMonthlyRunCap({ monthly_run_cap: value }), null)
        assert.equal(hostedOfferFromPrice(recurringPrice(value)), null)
    }
    const missingMetadata = recurringPrice()
    missingMetadata.product.metadata = {}
    assert.equal(hostedOfferFromPrice(missingMetadata), null)
    assert.equal(parseMonthlyRunCap({ monthly_run_cap: '9007199254740992' }), null)
    assert.equal(monthlyRunCapLabel(null), '')
    assert.equal(monthlyRunCapLabel(0), '')
    assert.equal(hostedOfferFromPrice(recurringPrice('not-a-number')), null)
})

test('refuses a valid run cap that differs from the fixed launch contract', () => {
    for (const value of ['1', '500', '9999', '10001', '20000']) {
        assert.equal(parseMonthlyRunCap({ monthly_run_cap: value }), Number(value))
        assert.equal(hostedOfferFromPrice(recurringPrice(value)), null)
    }
})

test('rejects any Price or Product outside the exact Cloud launch contract', () => {
    const price = recurringPrice()
    for (const candidate of [
        { ...price, active: false },
        { ...price, type: 'one_time' },
        { ...price, unit_amount: 49900 },
        { ...price, currency: 'cad' },
        { ...price, billing_scheme: 'tiered', tiers_mode: 'graduated' },
        { ...price, transform_quantity: { divide_by: 10, round: 'up' } },
        { ...price, custom_unit_amount: { enabled: true } },
        { ...price, currency_options: { cad: { unit_amount: 75000 } } },
        { ...price, lookup_key: 'other' },
        { ...price, recurring: null },
        { ...price, recurring: { ...price.recurring, interval_count: 2 } },
        { ...price, recurring: { ...price.recurring, usage_type: 'metered' } },
        { ...price, recurring: { ...price.recurring, trial_period_days: 30 } },
        { ...price, product: { ...price.product, id: 'prod_other' } },
        { ...price, product: { ...price.product, active: false } },
        { ...price, product: { ...price.product, livemode: false } },
        { ...price, product: { ...price.product, name: 'Other' } },
        {
            ...price,
            product: {
                ...price.product,
                metadata: { ...price.product.metadata, substrate: 'windows' },
            },
        },
        {
            ...price,
            product: {
                ...price.product,
                metadata: { ...price.product.metadata, lifecycle: 'stable' },
            },
        },
    ]) {
        assert.equal(hostedOfferFromPrice(candidate), null)
    }
})

test('binds offer verification to the declared Stripe mode', () => {
    assert.ok(hostedOfferFromPrice(recurringPrice(), { expectedLive: true }))
    assert.equal(
        hostedOfferFromPrice(recurringPrice(), { expectedLive: false }),
        null
    )
    assert.ok(
        hostedOfferFromPrice(
            {
                ...recurringPrice(),
                livemode: false,
                product: { ...recurringPrice().product, livemode: false },
            },
            { expectedLive: false }
        )
    )
})
