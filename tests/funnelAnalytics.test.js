const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const test = require('node:test')

// Truth tests for the launch-funnel analytics layer: PostHog must stay
// env-gated + Do-Not-Track aware, autocapture is on for the marketing site,
// and the signup / hosted-app funnel events are wired at their call sites.

function read(relativePath) {
    return fs.readFileSync(path.join(process.cwd(), relativePath), 'utf8')
}

test('PostHog init is env-gated, DNT-aware, and autocaptures the funnel', () => {
    const source = read('utils/analytics.js')
    assert.match(source, /process\.env\.NEXT_PUBLIC_POSTHOG_KEY/)
    assert.match(source, /analyticsAllowed\(\)/, 'must gate on Do-Not-Track')
    assert.match(source, /autocapture: true/, 'marketing autocapture is on')
    assert.match(
        source,
        /respect_dnt: true/,
        'PostHog SDK must also honor Do-Not-Track'
    )
    // Session replay stays off unless explicitly opted in via env.
    assert.match(source, /NEXT_PUBLIC_POSTHOG_ENABLE_REPLAY/)
    assert.match(source, /disable_session_recording: !ENABLE_REPLAY/)
    assert.match(source, /maskAllInputs: true/)
})

test('consent helper reports Do-Not-Track and stays server-safe', () => {
    const source = read('utils/consent.js')
    assert.match(source, /doNotTrack/)
    assert.match(
        source,
        /typeof window === 'undefined'/,
        'must be a no-op on the server'
    )
    assert.match(source, /export function analyticsAllowed/)
})

test('the hosted-app (signup) funnel event is defined and wired', () => {
    const analytics = read('utils/analytics.js')
    assert.match(analytics, /OPEN_CLOUD_APP_CLICK: 'open_cloud_app_click'/)

    // Both the nav "Sign in" and the footer "Hosted dashboard" map
    // app.openadapt.ai outbound clicks to the signup funnel event.
    const nav = read('components/NavHeader.js')
    assert.match(nav, /OPEN_CLOUD_APP_CLICK/)
    assert.match(nav, /app\.openadapt\.ai/)

    const footer = read('components/Footer.js')
    assert.match(footer, /app\.openadapt\.ai.*OPEN_CLOUD_APP_CLICK|OPEN_CLOUD_APP_CLICK/s)
})

test('compare / workflows / pricing funnel CTAs are instrumented', () => {
    assert.match(read('pages/compare.js'), /EVENTS\.COMPARE_CTA_CLICK/)
    assert.match(read('pages/workflows.js'), /EVENTS\.WORKFLOW_CARD_CLICK/)
    assert.match(read('components/Pricing.js'), /EVENTS\.PRICING_CTA_CLICK/)
})

test('funnel events never carry free-text, emails, or amounts', () => {
    // The pricing checkout event must not attach the price/amount or any
    // form field; it only records that checkout was initiated.
    const pricing = read('components/Pricing.js')
    assert.doesNotMatch(
        pricing,
        /PRICING_CTA_CLICK[^)]*(email|amount|price)/i,
        'pricing funnel event must not carry email/amount/price'
    )
})
