/*
 * Creates a Stripe Checkout Session for OpenAdapt Hosted (Phase 0).
 *
 * Concierge model: this starts a $500/mo subscription. After payment we
 * onboard the customer by hand; there is no self-serve runner yet.
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

        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            line_items: [{ price: priceId, quantity: 1 }],
            allow_promotion_codes: true,
            billing_address_collection: 'auto',
            success_url: `${baseUrl}/hosted/welcome?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${baseUrl}/#pricing`,
            metadata: {
                plan: 'hosted',
                onboarding: 'concierge',
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
