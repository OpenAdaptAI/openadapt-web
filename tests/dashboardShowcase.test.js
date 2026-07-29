const assert = require('node:assert/strict')
const crypto = require('node:crypto')
const fs = require('node:fs')
const path = require('node:path')
const test = require('node:test')

const root = path.join(__dirname, '..')
const assets = [
    'product-preview/dashboard-workflows.png',
    'cloud-preview/healthcare-run.jpg',
    'cloud-preview/program-graph.png',
    'cloud-preview/workflow-catalog.png',
]

test('Cloud showcase assets have exact local-mock provenance', () => {
    const provenance = JSON.parse(fs.readFileSync(path.join(root, 'public/cloud-preview/provenance.json')))
    const manifest = JSON.parse(fs.readFileSync(path.join(root, 'public/product-preview/MANIFEST.json')))
    assert.equal(provenance.synthetic_fixture, true)
    assert.equal(provenance.source.commit, 'f2300ee69b555d1676e69348999f910c1cc8cd8c')
    assert.match(provenance.source.mode, /mock/)
    assert.equal(manifest.assets['dashboard-workflows.png'].width, 2560)
    assert.equal(manifest.assets['dashboard-workflows.png'].height, 1440)
    for (const asset of assets) {
        const bytes = fs.readFileSync(path.join(root, 'public', asset))
        assert.ok(bytes.length > 0, asset)
    }
    for (const [name, metadata] of Object.entries(provenance.media)) {
        if (!assets.some((asset) => asset.endsWith(name))) continue
        const bytes = fs.readFileSync(path.join(root, 'public/cloud-preview', name))
        assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'), metadata.sha256)
        assert.equal(metadata.width, 2560)
        assert.equal(metadata.height, 1440)
    }
})
