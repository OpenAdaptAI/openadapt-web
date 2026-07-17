const assert = require('node:assert/strict')
const test = require('node:test')

const {
    isHostedCheckoutQualified,
} = require('../lib/hostedCheckoutQualification')

test('checkout qualification is an explicit fail-closed launch gate', () => {
    for (const value of [undefined, '', 'false', 'TRUE', '1', 'yes']) {
        assert.equal(isHostedCheckoutQualified(value), false)
    }
    assert.equal(isHostedCheckoutQualified('true'), true)
})
