/*
 * Creates a Stripe Checkout Session for OpenAdapt Hosted.
 *
 * STRIPE_PRICE_ID is the only price source; Stripe shows the configured amount
 * and billing period before confirmation. Where the customer lands after
 * payment is configurable:
 *   - They return to the configured cloud app's /login route carrying only the
 *     opaque Checkout Session id. After authentication the cloud retrieves the
 *     session from Stripe, verifies payment and identity, and idempotently
 *     binds it to the organization. Customer/subscription ids are never trusted
 *     from the browser.
 *
 * Money + secrets safety:
 *   - Supports Stripe restricted or full server keys in test and live mode.
 *     STRIPE_EXPECTED_MODE is required so a test key cannot accidentally back
 *     a live launch (or vice versa). No keys are ever hardcoded.
 *   - If the required env vars are missing (local dev, CI, preview deploys
 *     without secrets), we return a clean 503 so the site still builds and
 *     deploys. The build never imports Stripe at module load; it is required
 *     lazily inside the handler.
 *
 * Required env vars:
 *   STRIPE_SECRET_KEY   - preferably a restricted key (rk_live_... in
 *                         production) with Price/Product read and Checkout
 *                         Session write; full sk_ keys remain compatible
 *   STRIPE_PRICE_ID     - the configured recurring price id (price_...)
 *   STRIPE_EXPECTED_MODE - "live" in production or "test" elsewhere
 *
 * Required launch env vars:
 *   NEXT_PUBLIC_CLOUD_APP_URL - base URL of the cloud app (e.g.
 *     https://app.openadapt.ai).
 */

const { stripeModeMatches } = require('../../lib/stripeMode')
const { hostedOfferFromPrice } = require('../../lib/hostedOfferContract')
const {
    isHostedCheckoutQualified,
} = require('../../lib/hostedCheckoutQualification')

// Read env at request time (not module load) so a missing key can't break
// the build. The site is a static-ish Next.js app; these routes only run
// server-side at request time.
function getConfig() {
    return {
        secretKey: process.env.STRIPE_SECRET_KEY,
        priceId: process.env.STRIPE_PRICE_ID,
        expectedMode: process.env.STRIPE_EXPECTED_MODE,
    }
}

function configuredOrigin(value) {
    if (!value) return ''
    try {
        const url = new URL(value)
        const loopback = url.hostname === 'localhost' || url.hostname === '127.0.0.1'
        if ((url.protocol !== 'https:' && !loopback) || url.origin !== value.replace(/\/$/, '')) return ''
        return url.origin
    } catch {
        return ''
    }
}

function getBaseUrl() {
    // Never derive a Stripe redirect from attacker-controlled forwarding
    // headers. Every deployed site must name its exact public origin.
    return configuredOrigin(process.env.NEXT_PUBLIC_SITE_URL)
}

function getCloudAppUrl() {
    return configuredOrigin(process.env.NEXT_PUBLIC_CLOUD_APP_URL)
}

// The Checkout Session id is opaque. The cloud verifies and claims it
// server-side after authentication; no customer/subscription id crosses here.
function getSuccessUrl(cloudAppUrl) {
    return `${cloudAppUrl}/login?checkout_session_id={CHECKOUT_SESSION_ID}`
}

function acceptsHtml(req) {
    return String(req.headers.accept || '').includes('text/html')
}

function sendError(req, res, status, payload) {
    if (!acceptsHtml(req)) return res.status(status).json(payload)

    res.setHeader('content-type', 'text/html; charset=utf-8')
    return res.status(status).send(
        `<!doctype html><title>Complete your OpenAdapt setup</title><p>${payload.message}</p><p><a href="/#pricing">Return to launch options</a></p>`
    )
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST')
        return res.status(405).json({ error: 'method_not_allowed' })
    }

    const { secretKey, priceId, expectedMode } = getConfig()

    // Credentials are necessary but not sufficient. An operator sets the
    // server-only qualification flag only after the real production checkout
    // and return path have passed launch review.
    const cloudAppUrl = getCloudAppUrl()
    const baseUrl = getBaseUrl()
    if (
        !isHostedCheckoutQualified() ||
        !secretKey ||
        !priceId ||
        !cloudAppUrl ||
        !baseUrl ||
        !stripeModeMatches(secretKey, expectedMode)
    ) {
        return sendError(req, res, 503, {
            error: 'checkout_not_configured',
            message:
                'We could not open secure checkout. Please try again or contact us.',
        })
    }

    try {
        // Lazy import so the build never depends on Stripe being importable
        // or on any key being present.
        const Stripe = require('stripe')
        const stripe = new Stripe(secretKey)
        const price = await stripe.prices.retrieve(priceId, {
            expand: ['product'],
        })
        const offer = hostedOfferFromPrice(price, {
            expectedLive: expectedMode === 'live',
        })

        if (!offer) {
            return sendError(req, res, 503, {
                error: 'checkout_offer_unverified',
                message:
                    'We could not open secure checkout. Please try again or contact us.',
            })
        }

        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            line_items: [{ price: priceId, quantity: 1 }],
            allow_promotion_codes: true,
            billing_address_collection: 'auto',
            success_url: getSuccessUrl(cloudAppUrl),
            cancel_url: `${baseUrl}/#pricing`,
            metadata: {
                plan: 'hosted',
                onboarding: 'self_serve',
            },
        })

        if (acceptsHtml(req)) return res.redirect(303, session.url)
        return res.status(200).json({ url: session.url })
    } catch (err) {
        console.error('[create-checkout-session] Stripe error:', err.message)
        return sendError(req, res, 502, {
            error: 'checkout_failed',
            message: 'Could not start checkout. Please try again or email us.',
        })
    }
}
