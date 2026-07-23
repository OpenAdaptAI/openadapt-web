const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const test = require('node:test')

const root = path.join(__dirname, '..')
const read = (relativePath) =>
    fs.readFileSync(path.join(root, relativePath), 'utf8')

const manifest = JSON.parse(read('public/status.json'))

// The canonical public substrate labels. These are the single source of truth
// that the website, docs (openadapt-ops), launcher README, masthead, and PyPI
// metadata all reconcile to. Every substrate is first-class in the product; the
// label is a maturity tier from the canonical ladder (manifest.tiers) that says
// how broadly the substrate has been exercised today. "Scoped" is never a
// public label — the ladder is Beta / Early access / Exploratory / Research.
const CANONICAL_LABELS = {
    Browser: 'Beta',
    'Windows / macOS / RDP': 'Early access',
    'Citrix / VDI': 'Exploratory',
    'Hosted Cloud': 'Beta',
}

// The canonical maturity ladder. Every public label must be one of these tiers,
// and each tier must carry a plain-language definition so any surface that shows
// the ladder can render a legend.
const CANONICAL_TIERS = ['Beta', 'Early access', 'Exploratory', 'Research']

// Component versions verified against PyPI on 2026-07-19.
const CANONICAL_VERSIONS = {
    launcher: '1.7.1',
    flow: '1.19.0',
    desktop: '0.6.2',
}

test('status manifest labels every substrate with a canonical maturity tier', () => {
    const byName = Object.fromEntries(
        manifest.substrates.map((s) => [s.name, s.public_label])
    )
    assert.deepEqual(byName, CANONICAL_LABELS)

    // "Scoped" is the confusing label this ladder replaces — it must not appear
    // as any public label.
    for (const substrate of manifest.substrates) {
        assert.doesNotMatch(
            substrate.public_label,
            /scoped/i,
            `${substrate.name} public_label must not use the ambiguous "scoped"`
        )
        assert.ok(
            CANONICAL_TIERS.includes(substrate.public_label),
            `${substrate.name} public_label must be a canonical tier`
        )
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

test('status manifest defines the canonical ladder with plain definitions', () => {
    assert.ok(manifest.tiers && typeof manifest.tiers === 'object')
    assert.deepEqual(Object.keys(manifest.tiers), CANONICAL_TIERS)
    for (const tier of CANONICAL_TIERS) {
        assert.ok(
            typeof manifest.tiers[tier] === 'string' &&
                manifest.tiers[tier].length > 20,
            `tier ${tier} must carry a plain-language definition`
        )
    }
    // Every label actually used must be defined in the ladder.
    for (const substrate of manifest.substrates) {
        assert.ok(
            manifest.tiers[substrate.public_label],
            `${substrate.public_label} must be defined in manifest.tiers`
        )
    }
})

test('hosted cloud scope is browser-only, matching the TOS and checkout gate', () => {
    // The managed subscription is a browser-only Beta by the site's own
    // machinery (lib/hostedOfferContract.js requires substrate=browser +
    // lifecycle=beta; the TOS calls it a Beta browser launch service). The
    // manifest note must not resell it as running across every substrate.
    const hosted = manifest.substrates.find((s) => s.name === 'Hosted Cloud')
    assert.equal(hosted.public_label, 'Beta')
    assert.match(hosted.evidence_note, /browser (workflows|execution)/i)
    assert.doesNotMatch(hosted.evidence_note, /across every substrate/i)
    assert.match(
        hosted.evidence_note,
        /self-hosted|customer-controlled/i,
        'hosted note must route non-browser substrates to self-hosted / on-prem'
    )
})

test('status manifest encodes the verified component versions', () => {
    assert.deepEqual(manifest.versions, CANONICAL_VERSIONS)
    assert.match(manifest.generated_at, /^\d{4}-\d{2}-\d{2}$/)
})

test('homepage presents capabilities without exposing the maturity ledger', () => {
    // The sales page describes the target product capability. The public status
    // manifest remains available to technical consumers, but transient maturity
    // labels and component versions do not belong in the homepage narrative.
    const product = read('components/ProductStatus.js')

    assert.doesNotMatch(product, /public\/status\.json/)
    assert.doesNotMatch(product, /status\.substrates|substrate\.public_label/)
    assert.doesNotMatch(product, /status\.tiers|status\.versions/)
    assert.match(product, /Web applications/)
    assert.match(product, /Windows applications/)
    assert.match(product, /RDP, Citrix & VDI/)

    for (const label of Object.values(CANONICAL_LABELS)) {
        assert.doesNotMatch(
            product,
            new RegExp(`['"\\s]${label}['"\\s]`),
            `ProductStatus must not render the temporary "${label}" label`
        )
    }
})
