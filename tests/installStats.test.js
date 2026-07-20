const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const test = require('node:test')

const root = path.join(__dirname, '..')
const read = (relativePath) =>
    fs.readFileSync(path.join(root, relativePath), 'utf8')

const snapshot = JSON.parse(read('data/installStats.json'))

// The homepage adoption section renders from this committed snapshot. Guard the
// shape so a bad refresh (or a hand-edit) can't ship a broken/empty section.
test('install-stats snapshot has a presentable, well-formed shape', () => {
    assert.ok(
        Number.isInteger(snapshot.totalLastMonth) && snapshot.totalLastMonth > 0,
        'totalLastMonth must be a positive integer'
    )
    assert.ok(
        Array.isArray(snapshot.packages) && snapshot.packages.length > 0,
        'packages must be a non-empty array'
    )
    for (const pkg of snapshot.packages) {
        assert.match(pkg.name, /^openadapt(-[a-z]+)?$/, 'package names are openadapt-*')
        assert.ok(Number.isFinite(pkg.lastMonth), 'each package has a numeric lastMonth')
    }
    assert.ok(snapshot.topPackage && snapshot.topPackage.name, 'topPackage is set')
    assert.ok(
        Array.isArray(snapshot.history) && snapshot.history.length >= 2,
        'history must carry at least two months so the plot can draw a trend'
    )
    for (const point of snapshot.history) {
        assert.match(point.month, /^\d{4}-\d{2}$/, 'history months are YYYY-MM')
        assert.ok(Number.isFinite(point.downloads), 'history points are numeric')
    }
})

// Honesty: the snapshot must be dated and attributed, and the section must
// surface that provenance so real numbers never read as live/unsourced.
test('install-stats snapshot is dated and attributed', () => {
    assert.match(snapshot.asOf, /^\d{4}-\d{2}-\d{2}$/, 'asOf is an ISO date')
    assert.ok(
        !Number.isNaN(new Date(`${snapshot.asOf}T00:00:00Z`).getTime()),
        'asOf is a real date'
    )
    assert.match(snapshot.source, /pypistats/i, 'source names pypistats')
})

// The section shows LIVE numbers with pypistats.org attribution. It must not
// reintroduce the stale "snapshot as of <date>" wording (it is live now), but
// it must still name the data source.
test('install-stats section is attributed to pypistats and reads as live', () => {
    const component = read('components/InstallStats.js')
    assert.match(component, /pypistats\.org/, 'names the data source')
    assert.match(component, /live from/i, 'reads as live, not a static snapshot')
    assert.doesNotMatch(
        component,
        /snapshot as of/i,
        'must not show the stale "snapshot as of" label now that it is live'
    )
})

// The section renders instantly without blocking on the network: the committed
// snapshot seeds both the headline numbers and the chart line, and the LIVE
// pypistats fetch is a client-side enhancement with a graceful fallback (it
// keeps the seed on failure). The heavy chart is lazy-loaded so it never blocks
// first paint or bloats the initial bundle.
test('install-stats seeds from the snapshot, then fetches live client-side with a fallback', () => {
    const component = read('components/InstallStats.js')
    // Seed / instant fallback: initial state comes from the `stats` prop.
    assert.match(
        component,
        /useState\(\s*\n?\s*hasSeed \? stats\.totalLastMonth/,
        'headline seeds from the snapshot prop'
    )
    assert.match(component, /buildSeedHistory/, 'chart line seeds from the snapshot')
    assert.match(
        component,
        /seedHistory=\{seedHistory\}/,
        'the seed is passed to the reused chart'
    )
    // Live client-side fetch with a graceful catch that keeps the seed.
    assert.match(component, /useEffect/, 'fetches live after render')
    assert.match(
        component,
        /getRecentDownloadStats\(\)/,
        'uses the same pypistats util as /download'
    )
    assert.match(component, /\.catch\(/, 'live fetch has a graceful fallback')
    // Lazy-load the chart.js component so it does not block first paint.
    assert.match(component, /next\/dynamic/, 'chart is lazy-loaded via next/dynamic')
    assert.match(component, /ssr:\s*false/, 'chart is client-only (ssr: false)')
    assert.match(component, /chartPlaceholder/, 'a placeholder holds space while it loads')
})

// The reused chart supports a compact, seedable embed without changing its
// default /download behavior.
test('PyPIDownloadChart supports a compact, seedable embed', () => {
    const chart = read('components/PyPIDownloadChart.js')
    assert.match(
        chart,
        /compact = false, seedHistory = null/,
        'compact + seedHistory props default to the original /download behavior'
    )
    assert.match(
        chart,
        /useState\(seedHistory\)/,
        'history state can be seeded so the embed is never blank'
    )
    assert.match(chart, /if \(compact\) \{/, 'compact mode renders a bare chart')
})

// The homepage must feed the snapshot in through getStaticProps (server-side),
// so the section is part of the initial HTML and independent of client network.
test('homepage renders install stats from a server-side snapshot prop', () => {
    const index = read('pages/index.js')
    assert.match(index, /import InstallStats from '@components\/InstallStats'/)
    assert.match(index, /data\/installStats\.json/, 'snapshot read in getStaticProps')
    assert.match(
        index,
        /<InstallStats stats=\{installStats\} \/>/,
        'section is passed the server-loaded snapshot'
    )
})
