const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const test = require('node:test')

const root = path.join(__dirname, '..')
const read = (relativePath) =>
    fs.readFileSync(path.join(root, relativePath), 'utf8')

const manifest = JSON.parse(read('public/status.json'))

// The canonical public substrate labels. These are the single source of truth
// that the website, docs (openadapt-ops), launcher README, and PyPI metadata
// all reconcile to. OpenAdapt presents one governed product across every
// execution substrate, so every substrate carries the same first-class,
// supported label.
const CANONICAL_LABELS = {
    Browser: 'Supported',
    'Windows / macOS / RDP': 'Supported',
    'Citrix / VDI': 'Supported',
    'Hosted Cloud': 'Supported',
}

// Component versions verified against PyPI on 2026-07-19.
const CANONICAL_VERSIONS = {
    launcher: '1.7.1',
    flow: '1.19.0',
    desktop: '0.6.2',
}

test('status manifest presents every substrate as first-class and supported', () => {
    const byName = Object.fromEntries(
        manifest.substrates.map((s) => [s.name, s.public_label])
    )
    assert.deepEqual(byName, CANONICAL_LABELS)

    // Target state: no substrate is ranked below another. Every substrate
    // shares the same supported label — no Beta / Early access / Exploratory
    // downgrade tiers.
    const labels = new Set(manifest.substrates.map((s) => s.public_label))
    assert.equal(labels.size, 1, 'all substrates share one uniform label')

    for (const substrate of manifest.substrates) {
        assert.ok(
            substrate.evidence_note && substrate.evidence_note.length > 40,
            `${substrate.name} must carry a capability note`
        )
        assert.ok(
            typeof substrate.internal_tier === 'string' &&
                substrate.internal_tier.length > 0,
            `${substrate.name} must record an internal tier`
        )
    }
})

test('status manifest encodes the verified component versions', () => {
    assert.deepEqual(manifest.versions, CANONICAL_VERSIONS)
    assert.match(manifest.generated_at, /^\d{4}-\d{2}-\d{2}$/)
})

test('homepage substrate matrix renders labels and versions from the manifest', () => {
    // The rendered labels must come from the manifest, not hardcoded strings,
    // so a version bump or label change in status.json is the only edit needed
    // and the homepage can never disagree with the source of truth.
    const product = read('components/ProductStatus.js')

    assert.match(product, /import status from '\.\.\/public\/status\.json'/)
    assert.match(product, /status\.substrates\.map/)
    assert.match(product, /substrate\.public_label/)
    assert.match(product, /substrate\.evidence_note/)
    assert.match(product, /status\.versions\.launcher/)
    assert.match(product, /status\.versions\.flow/)
    assert.match(product, /status\.versions\.desktop/)
    assert.match(product, /status\.json/)

    // The canonical label strings must not be hardcoded into the component —
    // that would let them drift from the manifest.
    for (const label of Object.values(CANONICAL_LABELS)) {
        assert.doesNotMatch(
            product,
            new RegExp(label.replace(/[.*+?^${}()|[\]\\—/]/g, '\\$&')),
            `ProductStatus must read "${label}" from the manifest, not inline it`
        )
    }
})
