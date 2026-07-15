const { stripeModeMatches } = require('./stripeMode')

function formatMinorUnits(unitAmount, currency) {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency.toUpperCase(),
    })
    const digits = formatter.resolvedOptions().maximumFractionDigits
    return formatter.format(unitAmount / 10 ** digits)
}

function cadence(recurring) {
    if (!recurring?.interval) return ''
    const count = recurring.interval_count || 1
    const interval = count === 1 ? recurring.interval : `${count} ${recurring.interval}s`
    return `/${interval}`
}

export async function getHostedOffer() {
    const secretKey = process.env.STRIPE_SECRET_KEY || ''
    const priceId = process.env.STRIPE_PRICE_ID || ''
    const expectedMode = process.env.STRIPE_EXPECTED_MODE || ''

    if (!secretKey || !priceId || !stripeModeMatches(secretKey, expectedMode)) {
        return null
    }

    try {
        const Stripe = require('stripe')
        const stripe = new Stripe(secretKey)
        const price = await stripe.prices.retrieve(priceId, {
            expand: ['product'],
        })

        if (!price.active || price.type !== 'recurring' || price.unit_amount == null) {
            return null
        }

        return {
            amount: formatMinorUnits(price.unit_amount, price.currency),
            cadence: cadence(price.recurring),
            product:
                price.product && typeof price.product === 'object'
                    ? price.product.name || ''
                    : '',
        }
    } catch (error) {
        console.error('[hosted-offer] Could not retrieve configured Stripe price:', error.message)
        return null
    }
}
