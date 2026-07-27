const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const test = require('node:test')

const root = path.join(__dirname, '..')
const read = (relativePath) =>
    fs.readFileSync(path.join(root, relativePath), 'utf8')

const manifest = JSON.parse(read('public/status.json'))
const versionClaims = JSON.parse(read('data/published-version-claims.json'))

/*
 * The versions are deliberately not duplicated in this file.
 *
 * A second hard-coded copy of "the current release" verifies nothing; it only
 * makes the test agree with whatever the manifest said when the copy was
 * written. This file used to pin launcher 1.7.3 / flow 1.23.0 / capture 1.1.1 /
 * desktop 0.13.0 behind a comment saying they were verified on 2026-07-25, and
 * by 2026-07-27 all four were superseded, so the suite enforced the wrong
 * answer. There is now one machine-readable record,
 * data/published-version-claims.json, and one authority for whether it is
 * current: PyPI, compared daily by
 * scripts/check_published_version_claims.mjs. This file checks that the
 * manifest and that record agree.
 */
const REGISTERED_VERSIONS = versionClaims.claims.find(
    (claim) => claim.id === 'status-manifest-component-versions'
)

const CANONICAL_LABELS = {
    Browser: 'Available',
    Windows: 'Available',
    macOS: 'Available',
    Linux: 'Available',
    RDP: 'Available',
    'Citrix / VDI': 'Available',
    'Hosted Cloud': 'Beta',
}

const CANONICAL_TIERS = ['Available', 'Beta']

test('status manifest separates released substrate availability from evidence scope', () => {
    const byName = Object.fromEntries(
        manifest.substrates.map((s) => [s.name, s.public_label])
    )
    assert.deepEqual(byName, CANONICAL_LABELS)
    assert.equal(manifest.product_lifecycle, 'Beta')

    for (const substrate of manifest.substrates) {
        assert.ok(
            CANONICAL_TIERS.includes(substrate.public_label),
            `${substrate.name} public_label must be a canonical tier`
        )
        assert.ok(
            substrate.evidence_note && substrate.evidence_note.length > 40,
            `${substrate.name} must carry a capability note`
        )
        assert.ok(
            typeof substrate.delivery === 'string' &&
                substrate.delivery.length > 0,
            `${substrate.name} must record its delivery boundary`
        )
        assert.ok(
            typeof substrate.internal_tier === 'string' &&
                substrate.internal_tier.length > 0,
            `${substrate.name} must record an internal tier`
        )
        assert.doesNotMatch(
            `${substrate.public_label} ${substrate.evidence_note}`,
            /early access|exploratory|research|design.partner/i
        )
    }
})

test('status manifest defines its public labels in plain language', () => {
    assert.deepEqual(Object.keys(manifest.tiers), CANONICAL_TIERS)
    for (const tier of CANONICAL_TIERS) {
        assert.ok(manifest.tiers[tier].length > 20)
    }
    for (const substrate of manifest.substrates) {
        assert.ok(manifest.tiers[substrate.public_label])
    }
})

test('status manifest describes release, capability, evidence, and deployment status', () => {
    assert.match(
        manifest.$comment,
        /machine-readable release, capability, evidence, and deployment status/
    )
    assert.match(manifest.$comment, /Windows, macOS, Linux, RDP, and Citrix/)
    assert.match(manifest.$comment, /distinct from the deployment boundary/)
})

test('bounded substrate evidence is exact and linked', () => {
    const byName = Object.fromEntries(
        manifest.substrates.map((s) => [s.name, s])
    )

    assert.match(byName.Windows.evidence_note, /3\/3 independently verified effects/)
    assert.match(byName.Windows.evidence_note, /3\/3 stale targets/)
    assert.match(byName.Windows.evidence_note, /3\/3 ambiguous targets/)

    assert.match(byName.macOS.evidence_note, /3\/3 exact-byte effects/)
    assert.match(byName.macOS.evidence_note, /two-window ambiguity refusal/)

    assert.match(byName.Linux.evidence_note, /3\/3 exact-file effects/)
    assert.match(byName.Linux.evidence_note, /3\/3 ambiguity refusals/)
    assert.match(byName.Linux.evidence_note, /3\/3 stale-target refusals/)
    assert.match(byName.Linux.evidence_url, /30059807758\/job\/89378981573/)

    assert.match(byName.RDP.evidence_note, /Aardwolf-over-Windows/)
    assert.match(byName.RDP.evidence_note, /FreeRDP round trip/)
    assert.match(byName.RDP.evidence_note, /3\/3 drift safe-halts/)

    const citrix = byName['Citrix / VDI']
    assert.match(citrix.evidence_note, /dedicated --backend citrix/)
    assert.match(citrix.evidence_note, /3\/3 healthy effects/)
    assert.match(citrix.evidence_note, /3\/3 drift safe-halts/)
    assert.match(citrix.qualification_boundary, /ica_hdx_accepted=false/)
    assert.match(citrix.qualification_boundary, /not a counted real ICA\/HDX batch/)

    for (const name of ['Windows', 'macOS', 'Linux', 'RDP', 'Citrix / VDI']) {
        assert.match(byName[name].evidence_url, /^https:\/\/github\.com\//)
    }
})

test('hosted cloud scope stays managed-browser-only', () => {
    const hosted = manifest.substrates.find((s) => s.name === 'Hosted Cloud')
    assert.equal(hosted.public_label, 'Beta')
    assert.match(hosted.delivery, /Managed browser runner/)
    assert.match(hosted.evidence_note, /managed browser execution/i)
    assert.doesNotMatch(hosted.evidence_note, /across every substrate/i)
    assert.match(hosted.evidence_note, /local, self-hosted, or customer-controlled/i)
})

test('status manifest encodes exact component versions', () => {
    assert.deepEqual(Object.keys(manifest.versions).sort(), [
        'capture',
        'desktop',
        'flow',
        'launcher',
    ])
    for (const version of Object.values(manifest.versions)) {
        assert.match(version, /^\d+\.\d+\.\d+$/)
    }
    assert.match(manifest.generated_at, /^\d{4}-\d{2}-\d{2}$/)

    // One record, not two copies: the registry the daily PyPI check reads must
    // describe exactly what this manifest serves.
    assert.ok(
        REGISTERED_VERSIONS,
        'data/published-version-claims.json must register the status manifest versions'
    )
    assert.equal(REGISTERED_VERSIONS.kind, 'pypi-latest')
    assert.deepEqual(manifest.versions, REGISTERED_VERSIONS.versions)
    assert.deepEqual(
        Object.keys(manifest.versions).sort(),
        Object.keys(REGISTERED_VERSIONS.packages).sort()
    )
})
