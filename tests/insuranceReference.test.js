const assert = require('node:assert/strict')
const crypto = require('node:crypto')
const fs = require('node:fs')
const path = require('node:path')
const test = require('node:test')

const root = path.join(__dirname, '..')
const read = (relativePath) =>
    fs.readFileSync(path.join(root, relativePath), 'utf8')

test('insurance page shows a real openIMIS workflow demo without reusing other vertical media', () => {
    const insurance = read('pages/solutions/insurance.js')
    const demo = read('components/InsuranceWorkflowDemo.js')

    assert.doesNotMatch(insurance, /import HowItWorks/)
    assert.match(insurance, /import InsuranceWorkflowDemo/)
    assert.match(insurance, /Insurance claims reference/i)
    assert.match(insurance, /not evidence[\s\S]*of a production insurance integration/)
    assert.match(insurance, /supported API/)
    assert.match(insurance, /does not adjudicate/)
    assert.doesNotMatch(`${insurance}\n${demo}`, /OpenEMR|Frappe|Encompass|mortgage/i)
    assert.match(demo, /openimis-claims-workflow-demo/)
    assert.match(demo, /From demonstration to verified openIMIS claim/)
    assert.match(demo, /synthetic local fixture/i)
    assert.match(demo, /direct SQL read/)
    assert.match(demo, /exactly one new claim row/)
    assert.match(demo, /0 duplicate claims/)
    assert.match(demo, /0 wrong-policyholder writes/)
    assert.match(demo, /0 model calls/)
    assert.match(demo, /\/insurance-demo\/record-openimis\.gif/)
    assert.match(demo, /\/insurance-demo\/replay-openimis\.gif/)
    assert.match(demo, /import Clip from '\.\/Clip'/)
    assert.match(demo, /<Clip clip=\{clips\.record\}/)
    assert.match(demo, /<Clip clip=\{clips\.replay\}/)
    assert.doesNotMatch(demo, /<picture>|prefers-reduced-motion/)
    assert.match(demo, /\/insurance-demo\/provenance\.json/)
    assert.match(demo, /Inspect evidence manifest/)
    assert.match(demo, /do not establish production insurance\s+reliability/)
    assert.match(demo, /openIMIS 25\.10/)
    assert.match(demo, /unaffiliated with the openIMIS Initiative/)
    assert.doesNotMatch(demo, /insurance-evidence-placeholder|awaiting oracle verification/i)
})

test('insurance reference is linked from the buyer-fit grid and llms.txt', () => {
    const industries = read('components/IndustriesGrid.js')
    const footer = read('components/Footer.js')
    const home = read('pages/index.js')
    const howItWorks = read('components/HowItWorks.js')
    const llms = read('public/llms.txt')
    const sitemap = read('public/sitemap.xml')

    assert.match(industries, /Insurance claims reference/)
    assert.match(industries, /\/solutions\/insurance/)
    assert.match(footer, /\/solutions\/insurance/)
    assert.match(home, /<HowItWorks showUseCases \/>/)
    for (const useCase of ['Healthcare', 'Lending', 'Insurance']) {
        assert.match(howItWorks, new RegExp(`label: '${useCase}'`))
    }
    assert.match(howItWorks, /role="group"/)
    assert.match(howItWorks, /aria-pressed=/)
    assert.match(howItWorks, /\/lending-demo\/record-frappe\.gif/)
    assert.match(howItWorks, /\/lending-demo\/replay-frappe\.gif/)
    assert.match(howItWorks, /\/insurance-demo\/record-openimis\.gif/)
    assert.match(howItWorks, /\/insurance-demo\/replay-openimis\.gif/)
    assert.match(sitemap, /https:\/\/openadapt\.ai\/solutions\/insurance/)
    assert.match(llms, /Insurance Claims Reference/)
    assert.match(llms, /not evidence of a production insurance integration/)
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
