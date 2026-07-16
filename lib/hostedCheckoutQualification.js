function isHostedCheckoutQualified(value = process.env.HOSTED_CHECKOUT_QUALIFIED) {
    return value === 'true'
}

module.exports = { isHostedCheckoutQualified }
