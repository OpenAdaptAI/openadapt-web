const assert = require('node:assert/strict')
const test = require('node:test')

const {
    isHostedCheckoutQualified,
} = require('../lib/hostedCheckoutQualification')

test('checkout qualification is an explicit fail-closed launch gate', () => {
    const original = process.env.HOSTED_CHECKOUT_QUALIFIED
    delete process.env.HOSTED_CHECKOUT_QUALIFIED

    try {
        for (const value of [undefined, '', 'false', 'TRUE', '1', 'yes']) {
            assert.equal(isHostedCheckoutQualified(value), false)
        }
        assert.equal(isHostedCheckoutQualified('true'), true)

        process.env.HOSTED_CHECKOUT_QUALIFIED = 'true'
        assert.equal(isHostedCheckoutQualified(), true)
    } finally {
        if (original === undefined) {
            delete process.env.HOSTED_CHECKOUT_QUALIFIED
        } else {
            process.env.HOSTED_CHECKOUT_QUALIFIED = original
        }
    }
})
