const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const test = require('node:test')

const root = path.join(__dirname, '..')
const canonicalUrl =
    'https://cal.com/richard-abrich/30min?overlayCalendar=true'
const read = (relativePath) =>
    fs.readFileSync(path.join(root, relativePath), 'utf8')

test('production, local fallback, and environment example share one booking URL', () => {
    for (const relativePath of [
        'utils/booking.js',
        'netlify.toml',
        '.env.example',
        'README.md',
    ]) {
        assert.match(
            read(relativePath),
            new RegExp(canonicalUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')),
            `${relativePath} must use the canonical booking URL`
        )
    }
})

test('production config has no Calendly destination or stale event duration', () => {
    const deployment = read('netlify.toml')
    assert.doesNotMatch(deployment, /calendly\.com/i)
    assert.doesNotMatch(deployment, /NEXT_PUBLIC_CALENDLY_URL/)

    const buyerSurfaces = [
        'pages/book.js',
        'components/ContactBookingSection.js',
    ]
        .map(read)
        .join('\n')
    assert.doesNotMatch(buyerSurfaces, /15-minute automation fit call/)
    assert.doesNotMatch(buyerSurfaces, /richard-abrich\/60min/)
})

test('provider detection matches provider domains rather than lookalike hosts', () => {
    const bookingSource = read('utils/booking.js')
    for (const host of ['cal.com', 'calendly.com', 'clockwise.com']) {
        assert.ok(bookingSource.includes(`host === '${host}'`))
        assert.ok(bookingSource.includes(`host.endsWith('.${host}')`))
    }
    assert.doesNotMatch(bookingSource, /host\.includes\(/)
})
