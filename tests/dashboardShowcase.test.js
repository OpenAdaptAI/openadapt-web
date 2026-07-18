const assert = require('node:assert/strict')
const crypto = require('node:crypto')
const fs = require('node:fs')
const path = require('node:path')
const test = require('node:test')

const root = path.join(__dirname, '..')
const read = (relativePath) =>
    fs.readFileSync(path.join(root, relativePath), 'utf8')

test('homepage shows the real Cloud interface as an explicit product preview', () => {
    const home = read('pages/index.js')
    const component = read('components/DashboardShowcase.js')
    const styles = read('components/DashboardShowcase.module.css')

    assert.match(home, /import DashboardShowcase/)
    assert.match(home, /<DashboardShowcase \/>/)
    assert.match(component, /Product preview · demonstration data/)
    assert.match(component, /guided product preview uses synthetic\s+demonstration data/)
    assert.doesNotMatch(component, /customer deployment|production evidence/i)

    assert.match(component, /<video/)
    assert.match(component, /autoPlay=\{!reducedMotion\}/)
    assert.match(component, /\smuted/)
    assert.match(component, /\sloop/)
    assert.match(component, /\splaysInline/)
    assert.match(component, /dashboard-walkthrough\.mp4/)
    assert.match(component, /dashboard-workflows\.png/)
    assert.match(component, /Pause product preview/)
    assert.match(component, /Play product preview/)

    assert.match(styles, /\.mediaLabel\s*\{[\s\S]*?position: absolute/)
    assert.match(
        styles,
        /prefers-reduced-motion: reduce[\s\S]*?\.media \.video,[\s\S]*?display: none[\s\S]*?\.media \.still\s*\{[\s\S]*?display: block/
    )
})

test('dashboard preview assets match their synthetic-capture provenance', () => {
    const manifest = JSON.parse(
        read('public/product-preview/MANIFEST.json')
    )

    assert.equal(manifest.source.mode, 'local_mock')
    assert.equal(
        manifest.source.commit,
        '730089c2279aebe9926f00c1491d04387b1e062e'
    )
    assert.match(manifest.source.data, /Synthetic demonstration/)
    assert.equal(
        manifest.presentation.required_media_label,
        'Product preview · demonstration data'
    )
    assert.equal(
        manifest.presentation.claim_boundary,
        'Not a customer or production run'
    )

    const secretPattern =
        /(sk|rk|pk)_(live|test)_[A-Za-z0-9]+|oai_ingest_[A-Za-z0-9]+|Bearer [A-Za-z0-9_-]{20,}/i
    for (const [name, expected] of Object.entries(manifest.assets)) {
        const bytes = fs.readFileSync(
            path.join(root, 'public', 'product-preview', name)
        )
        assert.equal(bytes.length, expected.bytes)
        assert.equal(
            crypto.createHash('sha256').update(bytes).digest('hex'),
            expected.sha256
        )
        assert.doesNotMatch(bytes.toString('latin1'), secretPattern)
    }
})
