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
        type: 'recurring',
        unit_amount: 50000,
        currency: 'usd',
        recurring: { interval: 'month', interval_count: 1 },
        product: {
            name: 'OpenAdapt Cloud',
            metadata: { monthly_run_cap: monthlyRunCap },
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

test('omits a missing or malformed Product run cap rather than inventing one', () => {
    for (const value of [undefined, '', '0', '-1', '1.5', '1e4', ' 10000', 10000]) {
        assert.equal(parseMonthlyRunCap({ monthly_run_cap: value }), null)
    }
    assert.equal(parseMonthlyRunCap({ monthly_run_cap: '9007199254740992' }), null)
    assert.equal(monthlyRunCapLabel(null), '')
    assert.equal(monthlyRunCapLabel(0), '')

    const offer = hostedOfferFromPrice(recurringPrice('not-a-number'))
    assert.equal(offer.amount, '$500.00')
    assert.equal(offer.monthlyRunCap, null)
})

test('rejects a Price that cannot back recurring Checkout', () => {
    assert.equal(hostedOfferFromPrice({ ...recurringPrice(), active: false }), null)
    assert.equal(hostedOfferFromPrice({ ...recurringPrice(), type: 'one_time' }), null)
    assert.equal(hostedOfferFromPrice({ ...recurringPrice(), unit_amount: null }), null)
})
