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
        assert.match(source, /qualified (privacy )?legal|qualified legal|counsel/i)
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

test('privacy page names current providers and exact model-call posture', () => {
    const privacy = read('pages/privacy-policy.js')

    for (const provider of [
        'Netlify',
        'Supabase',
        'Modal',
        'Stripe',
        'PostHog',
        'Cal.com',
        'GitHub',
    ]) {
        assert.match(privacy, new RegExp(provider.replace('.', '\\.')))
    }
    assert.match(privacy, /Healthy deterministic replay makes no model calls/)
    assert.match(privacy, /Model-assisted[\s\S]*repair is optional and off by default/)
    assert.match(privacy, /does not bypass identity,[\s\S]*policy checks/)
    assert.doesNotMatch(privacy, /ensuring the security|do not share your email/i)
    assert.doesNotMatch(read('pages/_app.js'), /googletagmanager|google-analytics/i)
    assert.match(privacy, /designate[\s\S]*accountable privacy official/i)
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
