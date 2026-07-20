const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const test = require('node:test')

const root = path.join(__dirname, '..')
const read = (relativePath) =>
    fs.readFileSync(path.join(root, relativePath), 'utf8')

test('the Cloud showcase renders real product screenshots, not a mockup', () => {
    // The Cloud showcase renders on the hosted onboarding page (where the Cloud
    // product is the relevant context) and, as lower-funnel product proof, on
    // the marketing homepage.
    const hosted = read('pages/hosted/welcome.js')
    const home = read('pages/index.js')
    const component = read('components/DashboardShowcase.js')

    assert.match(hosted, /import DashboardShowcase/)
    assert.match(hosted, /<DashboardShowcase \/>/)
    assert.match(home, /import DashboardShowcase/)
    assert.match(home, /<DashboardShowcase \/>/)

    assert.match(component, /OpenAdapt/)
    assert.match(component, /Cloud/)

    // It is framed as the real shipping hosted product, not a concept.
    assert.match(component, /app\.openadapt\.ai/)
    assert.match(component, /Real OpenAdapt Cloud interface/)
    assert.match(component, /hosted product running today/)

    // The stylized dark-theme fake "mini app" mockup is gone: no synthetic
    // sidebar/guided-tour scaffolding may return. Regression guard against the
    // hand-drawn app UI the founder found confusing.
    assert.doesNotMatch(component, /Operating view/)
    assert.doesNotMatch(component, /Choose a Cloud preview state/)
    assert.doesNotMatch(component, /guided Cloud tour/)
    assert.doesNotMatch(component, /Tour paused for reduced motion/)
    assert.doesNotMatch(component, /setInterval/)

    // No unverifiable domain and no em dashes in the copy.
    assert.doesNotMatch(component, /demo\.openadapt\.ai/)
    assert.doesNotMatch(component, /—/)
})

test('the showcase honestly labels the mock-data mode of the real UI', () => {
    const component = read('components/DashboardShowcase.js')

    // The interface is real; the data shown is synthetic mock-mode seed data.
    // Keep the honesty note that these are not customer or production runs.
    assert.match(component, /mock-data mode/)
    assert.match(component, /synthetic records/)
    assert.match(component, /not\s+a customer or production run/)
})

test('every showcase screenshot is a real, provenance-backed Cloud capture', () => {
    const component = read('components/DashboardShowcase.js')
    const manifest = JSON.parse(read('public/product-preview/MANIFEST.json'))
    const provenance = JSON.parse(
        read('public/cloud-preview/provenance.json')
    )

    // The captures come from the real app.openadapt.ai product (openadapt-cloud)
    // in its explicit local mock mode, with obviously synthetic seed data.
    assert.equal(
        manifest.source.repository,
        'https://github.com/OpenAdaptAI/openadapt-cloud'
    )
    assert.match(manifest.source.mode, /mock/)
    assert.equal(provenance.synthetic_fixture, true)
    assert.equal(
        provenance.source.repository,
        'https://github.com/OpenAdaptAI/openadapt-cloud'
    )
    assert.match(provenance.source.commit, /^[a-f0-9]{40}$/)
    assert.match(provenance.source.mode, /mock/)

    // The large primary shot is the real workflows dashboard and is manifested.
    assert.match(component, /\/product-preview\/dashboard-workflows\.png/)
    assert.equal(
        fs.existsSync(
            path.join(root, 'public/product-preview/dashboard-workflows.png')
        ),
        true
    )
    assert.equal(
        typeof manifest.assets['dashboard-workflows.png']?.sha256,
        'string'
    )
    // Displayed large: the intrinsic capture is high-resolution.
    assert.equal(manifest.assets['dashboard-workflows.png'].width, 2880)
    assert.equal(manifest.assets['dashboard-workflows.png'].height, 1800)

    // Supporting shots: real run/evidence frames plus the newly added program
    // visualizer and workflow catalog captures. Each must exist on disk.
    const supporting = [
        '/cloud-preview/healthcare-run.jpg',
        '/cloud-preview/healthcare-evidence.jpg',
        '/cloud-preview/program-graph.png',
        '/cloud-preview/workflow-catalog.png',
    ]
    for (const asset of supporting) {
        assert.match(
            component,
            new RegExp(asset.replaceAll('/', '\\/')),
            `component should reference ${asset}`
        )
        assert.equal(
            fs.existsSync(path.join(root, 'public', asset)),
            true,
            `${asset} should exist`
        )
    }

    // The real run/evidence frames are provenance-backed with a sha256.
    for (const name of [
        'healthcare-run.jpg',
        'healthcare-evidence.jpg',
    ]) {
        assert.equal(
            typeof provenance.media[name]?.sha256,
            'string',
            `${name} should be provenance-backed`
        )
    }

    // Every image is lazy-loaded with intrinsic dimensions so the large
    // captures do not tank performance (primary shot + the mapped gallery img).
    const imgTags = component.match(/<img[\s\S]*?\/>/g) || []
    assert.ok(imgTags.length >= 2)
    for (const tag of imgTags) {
        assert.match(tag, /loading="lazy"/)
        assert.match(tag, /width=/)
        assert.match(tag, /height=/)
    }
})
