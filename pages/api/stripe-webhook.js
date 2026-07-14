/*
 * Stripe webhook receiver for OpenAdapt Hosted (Phase 0).
 *
 * Verifies the Stripe signature with STRIPE_WEBHOOK_SECRET, then handles the
 * events that matter for concierge onboarding:
 *   - checkout.session.completed      (a customer just paid)
 *   - customer.subscription.created   (the $500/mo subscription is live)
 *
 * For now it logs and calls a stub notifier. Wiring the stub to real email /
 * Slack is a Phase 1 TODO; the concierge team is notified out of band until
 * then.
 *
 * Money + secrets safety:
 *   - No keys hardcoded. Reads STRIPE_SECRET_KEY + STRIPE_WEBHOOK_SECRET.
 *   - If keys are missing, returns 503 (does not crash the build/deploy).
 *   - Signature verification requires the raw request body, so Next.js body
 *     parsing is disabled below.
 */

// Disable Next.js body parsing: Stripe signature verification needs the raw,
// unparsed request body.
export const config = {
    api: {
        bodyParser: false,
    },
}

function getConfig() {
    return {
        secretKey: process.env.STRIPE_SECRET_KEY,
        webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    }
}

// Read the raw request body as a Buffer for signature verification.
async function readRawBody(req) {
    const chunks = []
    for await (const chunk of req) {
        chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
    }
    return Buffer.concat(chunks)
}

// Stub notifier. TODO(Phase 1): send email (Resend/Postmark) and/or Slack
// so the concierge team is alerted the moment someone pays.
function notifyConciergeTeam(summary) {
    console.log('[stripe-webhook] TODO notify concierge team:', summary)
    // TODO: await sendEmail({ to: 'team@openadapt.ai', subject: ..., body: ... })
    // TODO: await postToSlack({ channel: '#hosted-signups', text: ... })
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST')
        return res.status(405).json({ error: 'method_not_allowed' })
    }

    const { secretKey, webhookSecret } = getConfig()
    if (!secretKey || !webhookSecret) {
        return res.status(503).json({
            error: 'webhook_not_configured',
            message: 'Stripe webhook is not configured yet.',
        })
    }

    const Stripe = require('stripe')
    const stripe = new Stripe(secretKey)

    let event
    try {
        const rawBody = await readRawBody(req)
        const signature = req.headers['stripe-signature']
        event = stripe.webhooks.constructEvent(
            rawBody,
            signature,
            webhookSecret
        )
    } catch (err) {
        console.error(
            '[stripe-webhook] signature verification failed:',
            err.message
        )
        return res.status(400).json({ error: 'invalid_signature' })
    }

    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object
                console.log('[stripe-webhook] checkout.session.completed', {
                    id: session.id,
                    customer: session.customer,
                    email:
                        session.customer_details &&
                        session.customer_details.email,
                    subscription: session.subscription,
                })
                notifyConciergeTeam({
                    event: 'checkout.session.completed',
                    email:
                        session.customer_details &&
                        session.customer_details.email,
                    customer: session.customer,
                })
                break
            }
            case 'customer.subscription.created': {
                const subscription = event.data.object
                console.log('[stripe-webhook] customer.subscription.created', {
                    id: subscription.id,
                    customer: subscription.customer,
                    status: subscription.status,
                })
                notifyConciergeTeam({
                    event: 'customer.subscription.created',
                    customer: subscription.customer,
                    status: subscription.status,
                })
                break
            }
            default:
                // Acknowledge unhandled events so Stripe stops retrying.
                console.log('[stripe-webhook] unhandled event:', event.type)
        }
    } catch (err) {
        console.error('[stripe-webhook] handler error:', err.message)
        // Return 500 so Stripe retries transient handler failures.
        return res.status(500).json({ error: 'handler_error' })
    }

    return res.status(200).json({ received: true })
}
