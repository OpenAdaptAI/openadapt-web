const { stripeModeMatches } = require('./stripeMode')
const { hostedOfferFromPrice } = require('./hostedOfferContract')

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

        return hostedOfferFromPrice(price, {
            expectedLive: expectedMode === 'live',
        })
    } catch (error) {
        console.error('[hosted-offer] Could not retrieve configured Stripe price:', error.message)
        return null
    }
}
