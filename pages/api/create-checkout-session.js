/*
 * Creates a Stripe Checkout Session for OpenAdapt Hosted (Phase 0).
 *
 * This starts a $500/mo subscription. Where the customer lands after payment
 * is configurable:
 *   - NEXT_PUBLIC_CLOUD_APP_URL set: they go to the cloud app's sign-in /
 *     onboarding, carrying the Stripe session_id. The cloud app owns Hosted
 *     billing and matches the subscription to a cloud org by email at first
 *     login (cloud ARCHITECTURE Decision 5), so they land in their dashboard.
 *   - NEXT_PUBLIC_CLOUD_APP_URL unset: they return to the concierge welcome
 *     page and we onboard by hand. This is the graceful fallback so nothing
 *     breaks before the cloud app is deployed.
 *
 * Money + secrets safety:
 *   - Runs in whatever mode the configured keys are (TEST until the
 *     maintainer swaps in live keys). No keys are ever hardcoded.
 *   - If the required env vars are missing (local dev, CI, preview deploys
 *     without secrets), we return a clean 503 so the site still builds and
 *     deploys. The build never imports Stripe at module load; it is required
 *     lazily inside the handler.
 *
 * Required env vars:
 *   STRIPE_SECRET_KEY   - Stripe secret key (sk_test_... in test mode)
 *   STRIPE_PRICE_ID     - the recurring $500/mo price id (price_...)
 *
 * Optional env vars:
 *   NEXT_PUBLIC_CLOUD_APP_URL - base URL of the cloud app (e.g.
 *     https://app.openadapt.ai). When set, post-checkout success routes into
 *     the cloud app instead of the concierge welcome page. When unset, the
 *     concierge flow is preserved.
 */

// Read env at request time (not module load) so a missing key can't break
// the build. The site is a static-ish Next.js app; these routes only run
// server-side at request time.
function getConfig() {
    return {
        secretKey: process.env.STRIPE_SECRET_KEY,
        priceId: process.env.STRIPE_PRICE_ID,
    }
}

function getBaseUrl(req) {
    // Prefer an explicitly configured public URL; fall back to the request
    // host so preview deploys work without extra config.
    const configured = process.env.NEXT_PUBLIC_SITE_URL
    if (configured) return configured.replace(/\/$/, '')
    const proto = req.headers['x-forwarded-proto'] || 'https'
    const host = req.headers['x-forwarded-host'] || req.headers.host
    return `${proto}://${host}`
}

function getCloudAppUrl() {
    const configured = process.env.NEXT_PUBLIC_CLOUD_APP_URL
    if (!configured) return ''
    return configured.replace(/\/$/, '')
}

// Where Stripe returns the customer after a successful checkout. Both branches
// carry the Stripe session_id so the destination can look up the subscription.
//
//   - Cloud app configured: route into the cloud app's sign-in / onboarding.
//     The cloud app owns Hosted billing and links the subscription to a cloud
//     org by email at first login, so the customer lands in their dashboard.
//   - Not configured: fall back to the concierge welcome page (today's flow).
function getSuccessUrl(req, cloudAppUrl) {
    if (cloudAppUrl) {
        return `${cloudAppUrl}/signin?session_id={CHECKOUT_SESSION_ID}`
    }
    return `${getBaseUrl(req)}/hosted/welcome?session_id={CHECKOUT_SESSION_ID}`
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST')
        return res.status(405).json({ error: 'method_not_allowed' })
    }

    const { secretKey, priceId } = getConfig()

    // Guard: without keys the endpoint is a clean 503, not a 500 crash.
    if (!secretKey || !priceId) {
        return res.status(503).json({
            error: 'checkout_not_configured',
            message:
                'Hosted checkout is not configured yet. Please email us and we will set you up personally.',
        })
    }

    try {
        // Lazy import so the build never depends on Stripe being importable
        // or on any key being present.
        const Stripe = require('stripe')
        const stripe = new Stripe(secretKey)

        const baseUrl = getBaseUrl(req)
        const cloudAppUrl = getCloudAppUrl()

        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            line_items: [{ price: priceId, quantity: 1 }],
            allow_promotion_codes: true,
            billing_address_collection: 'auto',
            success_url: getSuccessUrl(req, cloudAppUrl),
            cancel_url: `${baseUrl}/#pricing`,
            metadata: {
                plan: 'hosted',
                onboarding: cloudAppUrl ? 'self_serve' : 'concierge',
            },
        })

        return res.status(200).json({ url: session.url })
    } catch (err) {
        console.error('[create-checkout-session] Stripe error:', err.message)
        return res.status(502).json({
            error: 'checkout_failed',
            message: 'Could not start checkout. Please try again or email us.',
        })
    }
}
