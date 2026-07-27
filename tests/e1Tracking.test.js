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

// ---------------------------------------------------------------------------
// Self-discovering surface enumeration.
//
// The previous version of this file hardcoded the list of lead surfaces it
// checked. `components/DentalLeadForm.js` shipped a raw `window.gtag` call and
// the suite stayed green purely because nobody added the new file to the list
// (fixed in #324). A test that enumerates its own subjects cannot be silently
// outgrown, so the subjects are derived from the source tree instead.
// ---------------------------------------------------------------------------

const SOURCE_ROOTS = ['components', 'pages']

function walk(relativeDir, out = []) {
    const absolute = path.join(process.cwd(), relativeDir)
    for (const entry of fs.readdirSync(absolute, { withFileTypes: true })) {
        const relative = path.join(relativeDir, entry.name)
        if (entry.isDirectory()) {
            walk(relative, out)
        } else if (entry.name.endsWith('.js')) {
            out.push(relative)
        }
    }
    return out
}

/**
 * A lead-capture surface is any component or page that submits a form
 * containing an email address. That is the shape of every conversion the E1
 * `Lead` optimization is measured on, and it is deliberately structural: a new
 * lead form is caught the moment it exists, with no list to remember to edit.
 *
 * Deliberately NOT matched: forms with no email field (for example the Stripe
 * checkout form in components/Pricing.js, where Stripe collects the email on
 * its own hosted page). Those are not lead captures and must not fire `Lead`.
 */
function isLeadCaptureSurface(source) {
    const submits = /onSubmit=\{/.test(source)
    const hasEmailField =
        /type="email"/.test(source) || /name="email"/.test(source)
    return submits && hasEmailField
}

/**
 * Surfaces that match the structural signature but must NOT fire a conversion,
 * each with the reason. Keep this empty if at all possible: an entry here is a
 * lead surface deliberately excluded from paid-campaign measurement, and it is
 * the one place this test can still be outgrown by omission.
 */
const LEAD_SURFACE_EXCEPTIONS = {}

function discoverLeadSurfaces() {
    const found = []
    for (const root of SOURCE_ROOTS) {
        for (const relativePath of walk(root)) {
            if (relativePath in LEAD_SURFACE_EXCEPTIONS) continue
            if (isLeadCaptureSurface(read(relativePath))) {
                found.push(relativePath)
            }
        }
    }
    return found.sort()
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

test('every discovered lead-capture surface fires the fan-out', () => {
    const surfaces = discoverLeadSurfaces()

    // Guard against the discovery itself silently matching nothing: a renamed
    // prop or a refactor to a shared <Form> wrapper must fail loudly here
    // rather than turn this suite into a no-op. Raise the floor when surfaces
    // are added; lower it only alongside a deliberate removal.
    assert.ok(
        surfaces.length >= 7,
        `expected the lead-surface scan to find at least 7 surfaces, found ${surfaces.length}: ${surfaces.join(', ')}`
    )

    for (const relativePath of surfaces) {
        const source = read(relativePath)
        assert.match(
            source,
            /from '(\.\.\/)?utils\/conversion'/,
            `${relativePath} looks like a lead-capture form but does not import the conversion fan-out. Call trackEmailCapture() from utils/conversion after the submission succeeds, or add it to LEAD_SURFACE_EXCEPTIONS with a reason.`
        )
        assert.match(
            source,
            /trackEmailCapture\(/,
            `${relativePath} imports the fan-out but never calls trackEmailCapture()`
        )
    }
})

test('lead conversions fire only after the submission is accepted', () => {
    // A conversion fired before the POST resolves counts leads that never
    // arrived: it understates cost-per-lead and teaches Meta to optimize
    // toward failed submits. In every surface the trackEmailCapture() call
    // must come after the response.ok / response check in the source.
    for (const relativePath of discoverLeadSurfaces()) {
        const source = read(relativePath)
        const okIndex = source.search(/response\.ok/)
        const trackIndex = source.search(/trackEmailCapture\(/)
        assert.ok(okIndex !== -1, `${relativePath} must check response.ok`)
        assert.ok(
            trackIndex > okIndex,
            `${relativePath} fires trackEmailCapture() before the submission is confirmed accepted`
        )
    }
})

test('nothing outside the loaders and the fan-out touches gtag/fbq', () => {
    // The whole point of utils/conversion.js is that there is exactly one
    // place that knows about the ad platforms. This rule needs no list of
    // subjects at all, so a new component cannot escape it.
    const allowed = new Set([
        'utils/conversion.js',
        path.join('components', 'analytics', 'GoogleAnalytics.js'),
        path.join('components', 'analytics', 'MetaPixel.js'),
    ])
    for (const root of [...SOURCE_ROOTS, 'utils']) {
        for (const relativePath of walk(root)) {
            if (allowed.has(relativePath)) continue
            assert.doesNotMatch(
                read(relativePath),
                /window\.gtag|window\.fbq|\bfbq\(/,
                `${relativePath} must route conversions through utils/conversion, not inline gtag/fbq`
            )
        }
    }
})

test('booking surfaces use the fan-out and name their location', () => {
    // Anything that knows the booking destination is a booking entry point and
    // must report the intent through the fan-out. Derived, not listed.
    for (const root of SOURCE_ROOTS) {
        for (const relativePath of walk(root)) {
            const source = read(relativePath)
            if (!/from 'utils\/booking'/.test(source)) continue
            assert.match(
                source,
                /from 'utils\/conversion'/,
                `${relativePath} reaches the booking destination without tracking the intent`
            )
        }
    }

    assert.match(read('pages/book.js'), /trackBookingClick\(/)
    assert.match(read('components/BookingEmbed.js'), /trackBookingConfirmed\(/)

    // The same embed renders on /book, /dental, and /pricing. Without a
    // per-mount location a confirmed booking cannot be attributed to the page
    // that produced it, which is exactly what paid spend is judged on.
    assert.match(
        read('components/BookingEmbed.js'),
        /location = 'booking_embed'/,
        'BookingEmbed must accept a per-mount location'
    )
    assert.match(read('components/BookingEmbed.js'), /trackBookingConfirmed\(\{ location \}\)/)
    for (const [mount, location] of [
        ['pages/book.js', 'book_page'],
        ['components/DentalLeadForm.js', 'dental_landing'],
        ['components/ContactBookingSection.js', 'contact_form'],
    ]) {
        assert.match(
            read(mount),
            new RegExp(`location="${location}"`),
            `${mount} must name the booking location it mounts the scheduler on`
        )
    }
})

test('the paid-campaign surfaces carry their campaign locations', () => {
    // /dental is the paid-campaign landing page and /qualify is the
    // destination of nearly every CTA on the site: these two submits ARE the
    // conversions the cost-per-qualified-lead kill criteria are measured on.
    const dental = read('components/DentalLeadForm.js')
    assert.match(dental, /trackEmailCapture\(\{ location: 'dental_landing' \}\)/)
    assert.match(dental, /trackBookingClick\(\{[\s\S]{0,80}'dental_landing'/)

    const qualification = read('components/WorkflowQualificationForm.js')
    assert.match(qualification, /trackEmailCapture\(\{[\s\S]{0,160}'qualification_form'/)
})

test('.env.example documents both tracker ids as off-by-default', () => {
    const source = read('.env.example')
    assert.match(source, /NEXT_PUBLIC_GA_MEASUREMENT_ID=/)
    assert.match(source, /NEXT_PUBLIC_META_PIXEL_ID=/)
})
