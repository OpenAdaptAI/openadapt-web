const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const test = require('node:test')

const root = path.join(__dirname, '..')
const read = (relativePath) =>
    fs.readFileSync(path.join(root, relativePath), 'utf8')

test('legal pages distinguish local, sanitized-ingest, and managed-recording boundaries', () => {
    const terms = read('pages/terms-of-service.js')
    const privacy = read('pages/privacy-policy.js')

    for (const source of [terms, privacy]) {
        assert.match(source, /managed browser recording/i)
        assert.match(source, /private\s+service storage/i)
        assert.match(source, /not sanitized merely/i)
        assert.match(source, /no fixed retention|no fixed.*retention/i)
    }

    assert.match(terms, /installing the engine does not create an account or upload/i)
    assert.match(terms, /policy-certified bundle[\s\S]*not independent certification/i)
    assert.match(privacy, /Installing or running the engine does not[\s\S]*send those artifacts/i)
    assert.match(privacy, /Short-lived signed runner URLs[\s\S]*do not delete/i)
})

test('owner-approved legal documents are operative and consistently linked', () => {
    const terms = read('pages/terms-of-service.js')
    const privacy = read('pages/privacy-policy.js')
    const pricing = read('components/Pricing.js')
    const footer = read('components/Footer.js')

    assert.match(terms, /Effective July 17, 2026/)
    assert.match(privacy, /Effective July 17, 2026/)
    assert.match(terms, /Starting a hosted subscription[\s\S]*constitutes acceptance/)
    assert.match(privacy, /requests to access, correct, or delete/)
    assert.doesNotMatch(terms, /DRAFT|non-operative|counsel/i)
    assert.doesNotMatch(privacy, /DRAFT|non-operative|counsel/i)
    assert.match(pricing, /Terms of Service/)
    assert.match(pricing, /acknowledge the Privacy Notice/)
    assert.match(footer, /Privacy Notice/)
    assert.match(footer, /Terms of Service/)
    assert.doesNotMatch(terms, /the Privacy Policy/)
})

test('shared trust inventory names current providers and exact model-call posture', async () => {
    const privacy = read('pages/privacy-policy.js')
    const { trustProviders } = await import(
        '../data/trustProviderInventory.mjs'
    )
    const providers = new Map(
        trustProviders.map((provider) => [provider.id, provider])
    )

    for (const providerId of [
        'netlify',
        'supabase',
        'modal',
        'stripe',
        'resend',
        'posthog',
        'ga4',
        'meta',
        'sentry-compatible',
        'calcom',
        'github',
    ]) {
        assert.ok(providers.has(providerId), `missing provider ${providerId}`)
    }
    assert.deepEqual(providers.get('modal').lanes, ['managed-authoring'])
    assert.ok(
        providers.get('posthog').data.includes('does not identify users by email')
    )
    assert.ok(
        providers
            .get('sentry-compatible')
            .data.includes('not proof that arbitrary error text is de-identified')
    )
    assert.match(privacy, /Healthy deterministic replay makes no model calls/)
    assert.match(privacy, /Model-assisted[\s\S]*repair is optional and off by default/)
    assert.match(privacy, /does not bypass identity,[\s\S]*policy checks/)
    assert.doesNotMatch(privacy, /ensuring the security|do not share your email/i)
    assert.match(privacy, /is accountable for the practices described here/i)
})

test('checkout stays hidden behind an explicit production qualification gate', () => {
    const env = read('.env.example')
    const offer = read('lib/hostedOffer.js')
    const checkout = read('pages/api/create-checkout-session.js')

    assert.match(env, /HOSTED_CHECKOUT_QUALIFIED=false/)
    assert.match(offer, /if \(!isHostedCheckoutQualified\(\)\) return null/)
    assert.match(checkout, /!isHostedCheckoutQualified\(\)/)
    assert.ok(
        checkout.indexOf('!isHostedCheckoutQualified()') <
            checkout.indexOf('stripe.checkout.sessions.create')
    )
})
