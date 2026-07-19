const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const test = require('node:test')

const root = path.join(__dirname, '..')
const read = (relativePath) =>
    fs.readFileSync(path.join(root, relativePath), 'utf8')

test('homepage shows a code-native interactive Cloud preview', () => {
    const home = read('pages/index.js')
    const component = read('components/DashboardShowcase.js')

    assert.match(home, /import DashboardShowcase/)
    assert.match(home, /<DashboardShowcase \/>/)
    assert.match(component, /OpenAdapt/)
    assert.match(component, /Cloud/)
    assert.match(component, /Choose a reference workflow/)
    assert.match(component, /Choose a Cloud preview state/)
    assert.match(component, /Reference workflows using synthetic records/)
    assert.match(component, /no live backend\s+dependency/)

    for (const application of [
        'OpenEMR',
        'Frappe Lending',
        'openIMIS',
    ]) {
        assert.match(component, new RegExp(application))
    }
    for (const view of ['Workflow', 'Run', 'Evidence', 'Report']) {
        assert.match(component, new RegExp(`${view.toLowerCase()}: '${view}'`))
    }

    assert.match(component, /window\.setInterval/)
    assert.match(component, /Pause guided Cloud tour/)
    assert.match(component, /Play guided Cloud tour/)
    assert.match(component, /prefers-reduced-motion: reduce/)
    assert.match(component, /Tour paused for reduced motion/)

    assert.doesNotMatch(component, /demo\.openadapt\.ai/)
    assert.doesNotMatch(component, /dashboard-workflows\.png/)
    assert.doesNotMatch(component, /dashboard-walkthrough\.mp4/)
    assert.doesNotMatch(component, /mediaLabel/)
})

test('reference footage animates independently of the guided-tour state', () => {
    const component = read('components/DashboardShowcase.js')

    // Regression guard: an earlier version swapped the footage <img> to the
    // static .jpg still whenever the tour was paused — and selecting any
    // reference tab pauses the tour, so one click froze the footage. The GIF
    // must be gated only on prefers-reduced-motion.
    assert.match(
        component,
        /reducedMotion\s*\?\s*media\.still\s*:\s*media\.animated/
    )
    assert.doesNotMatch(
        component,
        /tourPlaying\s*\?\s*media\.animated\s*:\s*media\.still/
    )
    // Switching reference/view remounts the <img> so the newly selected
    // footage restarts from its first frame.
    assert.match(
        component,
        /key=\{`\$\{reference\.key\}-\$\{viewKey\}`\}/
    )
})

test('every reference x view slot uses provenance-backed real Cloud app footage', () => {
    const component = read('components/DashboardShowcase.js')
    const provenance = JSON.parse(
        read('public/cloud-preview/provenance.json')
    )

    // The footage is the REAL app.openadapt.ai product (openadapt-cloud) in
    // its explicit local mock mode, with obviously synthetic seed data.
    assert.equal(provenance.synthetic_fixture, true)
    assert.equal(
        provenance.source.repository,
        'https://github.com/OpenAdaptAI/openadapt-cloud'
    )
    assert.match(provenance.source.commit, /^[a-f0-9]{40}$/)
    assert.match(provenance.source.mode, /mock/)

    for (const referenceKey of ['healthcare', 'lending', 'insurance']) {
        for (const view of ['workflow', 'run', 'evidence', 'report']) {
            for (const extension of ['gif', 'jpg']) {
                const asset = `/cloud-preview/${referenceKey}-${view}.${extension}`
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
                assert.equal(
                    typeof provenance.media[
                        `${referenceKey}-${view}.${extension}`
                    ]?.sha256,
                    'string',
                    `${asset} should be provenance-backed`
                )
            }
        }
    }

    // Animated slots loop forever and stay at the shared 880x550 footprint.
    for (const [name, entry] of Object.entries(provenance.media)) {
        if (!name.endsWith('.gif')) continue
        assert.equal(entry.width, 880)
        assert.equal(entry.height, 550)
        assert.match(entry.loop, /infinite/)
        const bytes = fs.readFileSync(
            path.join(root, 'public', 'cloud-preview', name)
        )
        assert.equal(
            bytes.subarray(0, 2000).includes('NETSCAPE2.0'),
            true,
            `${name} should carry the NETSCAPE2.0 loop extension`
        )
    }

    // The per-view media selection is total: no view falls back to a shared
    // record/replay clip.
    assert.match(component, /reference\.media\[viewKey\]/)
    assert.doesNotMatch(component, /reference\.media\.replay/)
})
