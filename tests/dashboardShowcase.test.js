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

test('dashboard preview reuses the three reference applications and provenance-backed media', () => {
    const component = read('components/DashboardShowcase.js')
    const howItWorks = JSON.parse(
        read('public/how-it-works/MANIFEST.json')
    )
    const lending = JSON.parse(
        read('public/lending-demo/provenance.json')
    )
    const insurance = JSON.parse(
        read('public/insurance-demo/provenance.json')
    )

    assert.equal(howItWorks.steps.record_openemr.source, 'real')
    assert.equal(howItWorks.steps.record_openemr.app, 'openemr')
    assert.equal(lending.synthetic_fixture, true)
    assert.equal(lending.evidence.compiled_correct, 6)
    assert.equal(insurance.synthetic_fixture, true)
    assert.equal(insurance.evidence.compiled_replays_verified, 3)

    for (const asset of [
        '/how-it-works/record_openemr.gif',
        '/how-it-works/run_openemr.gif',
        '/lending-demo/record-frappe.gif',
        '/lending-demo/replay-frappe.gif',
        '/insurance-demo/record-openimis.gif',
        '/insurance-demo/replay-openimis.gif',
    ]) {
        assert.match(component, new RegExp(asset.replaceAll('/', '\\/')))
        assert.equal(
            fs.existsSync(path.join(root, 'public', asset)),
            true,
            `${asset} should exist`
        )
    }
})
