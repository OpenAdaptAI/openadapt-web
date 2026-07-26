const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const test = require('node:test')

const root = path.join(__dirname, '..')
const read = (relativePath) =>
    fs.readFileSync(path.join(root, relativePath), 'utf8')

const dataSource = read('data/comparisons.js')
const detailPage = read('pages/compare/[slug].js')
const overview = read('pages/compare.js')
const llms = read('public/llms.txt')
const sitemap = read('public/sitemap.xml')

// The data module is plain ESM with no JSX, so it can be imported directly.
const load = () => import('../data/comparisons.js')

const EXPECTED_SLUGS = [
    'uipath',
    'power-automate',
    'computer-use-agents',
    'record-and-replay',
    'browser-agents',
    'hand-rolled-scripts',
]

test('every targeted comparison page exists with complete, structured content', async () => {
    const { COMPARISONS } = await load()
    assert.deepEqual(
        COMPARISONS.map(({ slug }) => slug).sort(),
        [...EXPECTED_SLUGS].sort()
    )
    for (const comparison of COMPARISONS) {
        assert.ok(comparison.title.startsWith('OpenAdapt vs'), comparison.slug)
        assert.ok(comparison.metaDescription.length > 60, comparison.slug)
        assert.ok(comparison.intro.length > 100, comparison.slug)
        assert.ok(
            comparison.theirStrengths.items.length >= 4,
            `${comparison.slug} credits the alternative with at least four real strengths`
        )
        assert.ok(comparison.chooseThem.length > 80, comparison.slug)
        assert.ok(comparison.chooseUs.length > 80, comparison.slug)
        assert.ok(comparison.honestNote.length > 80, comparison.slug)
    }
})

test('OpenAdapt differentiates only on the real axes, never commoditized ones', async () => {
    const { OPENADAPT_DIFFERENTIATORS } = await load()
    const titles = OPENADAPT_DIFFERENTIATORS.map(({ title }) => title)
    for (const required of [
        'Independent business-effect verification',
        'Explicit transaction outcomes',
        'Deterministic healthy runs',
        'External zero-install remote lane',
        'Customer-controlled sensitive data',
        'Open MIT local runtime',
        'Published qualification evidence',
    ]) {
        assert.ok(titles.includes(required), `differentiator: ${required}`)
    }

    // Commoditized capabilities must never be claimed as unique. Recording,
    // visual targeting, Citrix awareness, and self-healing are widely
    // available; the copy may mention them only to disclaim them. Comments
    // quote the banned phrases as guidance, so strip them first.
    const rendered = dataSource
        .replace(/^\s*\/\/.*$/gm, '')
        .replace(/\/\*[\s\S]*?\*\//g, '')
    assert.doesNotMatch(rendered, /self[- ]heal/i)
    assert.doesNotMatch(rendered, /only (tool|platform|product) that/i)
    assert.doesNotMatch(rendered, /unique(ly)? (able|capable)/i)
    assert.match(
        rendered,
        /not differentiators|not claimed here|does not claim to record better|commodity/,
        'copy explicitly disclaims commoditized capabilities'
    )
})

test('competitor pricing stays within well-known published figures, hedged', () => {
    // The only currency figures allowed anywhere in the comparison content
    // are Power Automate's widely published price points, and each must be
    // hedged with "around" plus a "published pricing" frame.
    const dollarFigures = dataSource.match(/\$\d[\d,]*/g) || []
    assert.deepEqual([...new Set(dollarFigures)].sort(), ['$15', '$215'])
    assert.match(dataSource, /published pricing/i)
    assert.match(dataSource, /around \$15 per user per month/)
    assert.match(dataSource, /\$215 per bot per month/)
    assert.match(dataSource, /roughly \$215/)
})

test('external-lane claims carry the honest qualification status', () => {
    // Mirrors public/status.json: the external lane is qualified against a
    // deterministic stand-in (and a real FreeRDP round trip); real ICA/HDX
    // is qualified per customer before consequential use.
    for (const [label, source] of [
        ['comparisons data', dataSource],
        ['remote modes figure', read('components/RemoteModesFigure.js')],
    ]) {
        assert.match(source, /stand-in/, `${label} discloses the stand-in`)
        assert.match(source, /ICA\/HDX/, `${label} names the pending scope`)
        assert.match(
            source,
            /qualified per customer/,
            `${label} states per-customer qualification`
        )
    }
})

test('detail pages render both sides and route from the overview page', () => {
    assert.match(detailPage, /getStaticPaths/)
    assert.match(detailPage, /theirStrengths/)
    assert.match(detailPage, /What OpenAdapt does differently/)
    assert.match(detailPage, /Choose \{comparison\.name\} when/)
    assert.match(detailPage, /Choose OpenAdapt when/)
    assert.match(detailPage, /honestNote/)

    assert.match(overview, /COMPARISON_LINKS/)
    assert.match(overview, /Compare OpenAdapt with a specific alternative\./)
})

test('machine-readable discovery includes every comparison route', () => {
    for (const slug of EXPECTED_SLUGS) {
        assert.match(
            llms,
            new RegExp(`https://openadapt\\.ai/compare/${slug}`),
            `llms.txt lists /compare/${slug}`
        )
        assert.match(
            sitemap,
            new RegExp(`https://openadapt\\.ai/compare/${slug}`),
            `sitemap lists /compare/${slug}`
        )
    }
})

test('comparison and partner surfaces contain no em dashes', () => {
    for (const relativePath of [
        'data/comparisons.js',
        'pages/compare/[slug].js',
        'pages/partners.js',
        'components/PartnerInquiryForm.js',
        'components/RemoteModesFigure.js',
    ]) {
        assert.ok(
            !read(relativePath).includes('—'),
            `${relativePath} has no em dashes`
        )
    }
})
