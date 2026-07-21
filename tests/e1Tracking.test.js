const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const test = require('node:test')

// Truth tests for the E1 paid-acquisition measurement layer: the trackers
// must stay env-gated (off by default), conversions must flow through the
// single fan-out module, and no component may hand-roll gtag/fbq calls.

function read(relativePath) {
    return fs.readFileSync(path.join(process.cwd(), relativePath), 'utf8')
}

test('GA4 loader is gated on NEXT_PUBLIC_GA_MEASUREMENT_ID', () => {
    const source = read('components/analytics/GoogleAnalytics.js')
    assert.match(source, /process\.env\.NEXT_PUBLIC_GA_MEASUREMENT_ID/)
    assert.match(
        source,
        /if \(!GA_MEASUREMENT_ID( \|\| !allowed)?\) return null/,
        'GA4 must render nothing without a measurement id'
    )
    assert.match(
        source,
        /analyticsAllowed\(\)/,
        'GA4 must respect Do-Not-Track via the shared consent helper'
    )
    assert.match(
        source,
        /allow_google_signals: false/,
        'GA4 must not enable Google signals/remarketing'
    )
})

test('Meta Pixel is gated on NEXT_PUBLIC_META_PIXEL_ID', () => {
    const source = read('components/analytics/MetaPixel.js')
    assert.match(source, /process\.env\.NEXT_PUBLIC_META_PIXEL_ID/)
    assert.match(
        source,
        /if \(!META_PIXEL_ID( \|\| !allowed)?\) return null/,
        'the pixel must render nothing without a pixel id'
    )
    assert.match(
        source,
        /analyticsAllowed\(\)/,
        'the pixel must respect Do-Not-Track via the shared consent helper'
    )
})

test('_app mounts both env-gated trackers and captures attribution', () => {
    const source = read('pages/_app.js')
    assert.match(source, /<GoogleAnalytics \/>/)
    assert.match(source, /<MetaPixel \/>/)
    assert.match(source, /captureAttribution\(\)/)
})

test('conversion fan-out attaches first-touch attribution', () => {
    const source = read('utils/conversion.js')
    assert.match(source, /getAttribution\(\)/)
    assert.match(source, /generate_lead/, 'GA4 recommended lead event')
    assert.match(source, /'Lead'/, 'Meta standard Lead event')
    assert.match(source, /'Schedule'/, 'Meta standard Schedule event')
})

test('attribution captures the standard utm params, first-touch only', () => {
    const source = read('utils/attribution.js')
    for (const param of [
        'utm_source',
        'utm_medium',
        'utm_campaign',
        'utm_term',
        'utm_content',
    ]) {
        assert.ok(source.includes(`'${param}'`), `missing ${param}`)
    }
    assert.match(
        source,
        /if \(storage\.getItem\(ATTRIBUTION_STORAGE_KEY\)\) return/,
        'an existing first touch must never be overwritten'
    )
})

test('lead forms and booking surfaces use the fan-out, not inline gtag/fbq', () => {
    const conversionSurfaces = [
        'components/EmailForm.js',
        'components/ContactBookingSection.js',
        'components/BookingEmbed.js',
        'pages/book.js',
    ]
    for (const relativePath of conversionSurfaces) {
        const source = read(relativePath)
        assert.match(
            source,
            /from 'utils\/conversion'/,
            `${relativePath} must import the conversion fan-out`
        )
        assert.doesNotMatch(
            source,
            /window\.gtag|window\.fbq/,
            `${relativePath} must not call gtag/fbq directly`
        )
    }
    assert.match(read('components/EmailForm.js'), /trackEmailCapture\(/)
    assert.match(
        read('components/ContactBookingSection.js'),
        /trackEmailCapture\(/
    )
    assert.match(read('pages/book.js'), /trackBookingClick\(/)
    assert.match(read('components/BookingEmbed.js'), /trackBookingConfirmed\(/)
})

test('.env.example documents both tracker ids as off-by-default', () => {
    const source = read('.env.example')
    assert.match(source, /NEXT_PUBLIC_GA_MEASUREMENT_ID=/)
    assert.match(source, /NEXT_PUBLIC_META_PIXEL_ID=/)
})
