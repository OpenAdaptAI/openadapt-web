const assert = require('node:assert/strict')
const test = require('node:test')

const { stripeModeMatches } = require('../lib/stripeMode')

test('requires an explicit supported Stripe mode', () => {
    assert.equal(stripeModeMatches('sk_live_example', ''), false)
    assert.equal(stripeModeMatches('sk_test_example', undefined), false)
    assert.equal(stripeModeMatches('sk_live_example', 'production'), false)
})

test('accepts only a secret key matching the declared mode', () => {
    assert.equal(stripeModeMatches('sk_live_example', 'live'), true)
    assert.equal(stripeModeMatches('sk_test_example', 'test'), true)
    assert.equal(stripeModeMatches('rk_live_example', 'live'), true)
    assert.equal(stripeModeMatches('rk_test_example', 'test'), true)
    assert.equal(stripeModeMatches('sk_test_example', 'live'), false)
    assert.equal(stripeModeMatches('sk_live_example', 'test'), false)
    assert.equal(stripeModeMatches('rk_test_example', 'live'), false)
    assert.equal(stripeModeMatches('rk_live_example', 'test'), false)
    assert.equal(stripeModeMatches('', 'live'), false)
})
