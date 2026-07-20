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

test('install-stats section shows the snapshot date and source, not a live claim', () => {
    const component = read('components/InstallStats.js')
    assert.match(component, /snapshot as of/, 'renders an "as of" freshness label')
    assert.match(component, /stats\.source/, 'renders the data source')
    assert.doesNotMatch(
        component,
        /\blive\b/i,
        'must not imply the numbers are live — it is a dated snapshot'
    )
})

// The whole point of the snapshot pipeline: this section must never fetch at
// build or request time. No runtime data fetch, no pypistats.org URL, no
// api.github.com URL constructed in the component. It renders from props only.
test('install-stats section never fetches at runtime', () => {
    const component = read('components/InstallStats.js')
    assert.doesNotMatch(component, /\bfetch\s*\(/, 'no fetch() in the section')
    assert.doesNotMatch(component, /useEffect/, 'no client data-loading effect')
    assert.doesNotMatch(
        component,
        /pypistats\.org\/api/,
        'no pypistats API URL in the section'
    )
    assert.doesNotMatch(
        component,
        /api\.github\.com/,
        'no api.github.com URL in the section'
    )
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
