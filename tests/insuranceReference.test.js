const assert = require('node:assert/strict')
const crypto = require('node:crypto')
const fs = require('node:fs')
const path = require('node:path')
const test = require('node:test')

const root = path.join(__dirname, '..')
const read = (relativePath) =>
    fs.readFileSync(path.join(root, relativePath), 'utf8')

test('insurance reference is linked from the buyer-fit grid and llms.txt', () => {
    const industries = read('components/IndustriesGrid.js')
    const footer = read('components/Footer.js')
    const nav = read('components/NavHeader.js')
    const llms = read('public/llms.txt')
    const sitemap = read('public/sitemap.xml')

    assert.match(industries, /Insurance claims reference/)
    assert.match(industries, /\/solutions\/insurance/)
    assert.match(footer, /\/solutions\/insurance/)
    assert.match(nav, /\/solutions\/insurance/)
    assert.match(sitemap, /https:\/\/openadapt\.ai\/solutions\/insurance/)
    assert.match(llms, /Insurance Claims Execution/)
    assert.match(llms, /direct SQL claim-row oracle/)
})

test('insurance demo media has durable synthetic evidence provenance', () => {
    const provenance = JSON.parse(read('public/insurance-demo/provenance.json'))

    assert.equal(provenance.synthetic_fixture, true)
    assert.equal(provenance.source.benchmark_commit.length, 40)
    assert.equal(
        provenance.source.benchmark_tree,
        `https://github.com/OpenAdaptAI/openadapt-flow/tree/${provenance.source.benchmark_commit}/benchmark/openimis_claims`
    )
    assert.match(
        provenance.source.pull_request,
        /^https:\/\/github\.com\/OpenAdaptAI\/openadapt-flow\/pull\/\d+$/
    )
    assert.equal(provenance.evidence.recorded_demonstrations, 1)
    assert.equal(provenance.evidence.compiled_replays, 3)
    assert.equal(provenance.evidence.compiled_replays_verified, 3)
    assert.equal(provenance.evidence.duplicate_claims, 0)
    assert.equal(provenance.evidence.wrong_policyholder_writes, 0)
    assert.equal(provenance.evidence.model_calls, 0)
    assert.equal(provenance.evidence.publication_ready_comparative_matrix, false)
    assert.match(provenance.evidence.oracle, /SQL.*exactly one.*claim row/i)
    assert.match(provenance.limitations, /not a customer deployment/i)
    assert.match(provenance.affiliation, /not affiliated/i)
    for (const key of ['openimis_be', 'openimis_fe', 'openimis_pgsql_demo_dataset']) {
        assert.match(provenance.software[key].image_digest, /^sha256:[0-9a-f]{64}$/)
    }

    for (const [filename, metadata] of Object.entries(provenance.media)) {
        const digest = crypto
            .createHash('sha256')
            .update(
                fs.readFileSync(path.join(root, 'public/insurance-demo', filename))
            )
            .digest('hex')
        assert.equal(
            digest,
            metadata.sha256,
            `sha256 mismatch for insurance-demo media ${filename}`
        )
    }
})

test('insurance demo gifs stay web-light', () => {
    for (const filename of ['record-openimis.gif', 'replay-openimis.gif']) {
        const bytes = fs.statSync(
            path.join(root, 'public/insurance-demo', filename)
        ).size
        assert.ok(
            bytes < 4 * 1024 * 1024,
            `${filename} must stay under 4 MB (is ${bytes})`
        )
    }
})
