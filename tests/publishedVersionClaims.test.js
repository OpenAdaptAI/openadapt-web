const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const fs = require('node:fs')
const path = require('node:path')
const test = require('node:test')

const root = path.join(__dirname, '..')
const script = path.join(root, 'scripts', 'check_published_version_claims.mjs')

const registry = JSON.parse(
    fs.readFileSync(
        path.join(root, 'data', 'published-version-claims.json'),
        'utf8'
    )
)

const run = (args = []) =>
    spawnSync(process.execPath, [script, ...args], {
        cwd: root,
        encoding: 'utf8',
    })

// The offline half runs on every pull request: no network, so it cannot be
// flaky, and it is the half that catches a surface silently losing its
// measured-on label. The release comparison runs on the daily lane in
// .github/workflows/published-version-claims.yml.
test('every published version claim is internally consistent (offline)', () => {
    const result = run(['--offline'])
    assert.equal(
        result.status,
        0,
        `check_published_version_claims.mjs --offline failed:\n${result.stdout}\n${result.stderr}`
    )
})

test('the guard fails when a surface drops its measured-on attribution', () => {
    // Prove the check has teeth rather than only that it is green today.
    const target = path.join(root, 'components', 'ProofBand.js')
    const original = fs.readFileSync(target, 'utf8')
    try {
        fs.writeFileSync(
            target,
            original.replace(
                'Measured on Flow {benchmark.provenance.flow_version},',
                'Measured,'
            )
        )
        const result = run(['--offline'])
        assert.equal(result.status, 1)
        assert.match(
            result.stderr,
            /no longer contains its measured-on attribution/
        )
    } finally {
        fs.writeFileSync(target, original)
    }
})

test('the guard fails when the acknowledged benchmark lag expires', () => {
    const claim = registry.claims.find(
        (entry) => entry.id === 'headline-benchmark-engine-build'
    )
    const expired = new Date(
        `${claim.acknowledged_release_lag.review_by}T00:00:00Z`
    )
    expired.setUTCDate(expired.getUTCDate() + 1)
    const result = run([
        '--offline',
        '--today',
        expired.toISOString().slice(0, 10),
    ])
    assert.equal(result.status, 1)
    assert.match(result.stderr, /acknowledged release lag expired/)
})

test('the guard fails when served release provenance is not an exact SHA', () => {
    const target = path.join(root, 'public', 'status.json')
    const original = fs.readFileSync(target, 'utf8')
    try {
        const status = JSON.parse(original)
        status.releases.flow.release_commit = 'not-a-sha'
        fs.writeFileSync(target, `${JSON.stringify(status, null, 4)}\n`)
        const result = run(['--offline'])
        assert.equal(result.status, 1)
        assert.match(result.stderr, /flow release_commit must be an exact SHA/)
    } finally {
        fs.writeFileSync(target, original)
    }
})

test('every historical claim states the build and date it was measured on', () => {
    for (const claim of registry.claims) {
        if (claim.kind !== 'historical') continue
        assert.match(
            claim.version,
            /^\d+\.\d+\.\d+$/,
            `${claim.id} records an exact engine version`
        )
        assert.match(
            claim.measured_on,
            /^\d{4}-\d{2}-\d{2}$/,
            `${claim.id} records when it was measured`
        )
        assert.ok(
            claim.evidence && claim.evidence.length > 40,
            `${claim.id} records how the version was resolved`
        )
        assert.ok(
            (claim.attribution_required ?? []).length > 0,
            `${claim.id} names at least one surface that must carry the label`
        )
    }
})
