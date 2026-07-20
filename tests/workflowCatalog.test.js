const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const test = require('node:test')
const vm = require('node:vm')

const root = path.join(__dirname, '..')
const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8')

// data/workflowCatalog.js is an ESM source (Next transpiles it). Evaluate it in
// a CommonJS sandbox so the honesty test asserts the REAL objects, not strings.
function loadCatalogModule() {
    const source = read('data/workflowCatalog.js')
        .replace(/export const/g, 'const')
        .replace(/export \{[^}]*\}/g, '')
    const wrapped =
        source +
        '\n;module.exports = { CATALOG, SUBSTRATE_MATURITY, REQUIRED_ENTRY_FIELDS };'
    const module = { exports: {} }
    vm.runInNewContext(wrapped, { module, exports: module.exports })
    return module.exports
}

const { CATALOG, SUBSTRATE_MATURITY, REQUIRED_ENTRY_FIELDS } =
    loadCatalogModule()

test('catalog covers exactly the three real benchmark references', () => {
    assert.equal(
        JSON.stringify(CATALOG.map((e) => e.id).sort()),
        JSON.stringify(['frappe-lending', 'openemr', 'openimis'])
    )
})

test('every catalog entry carries the required honesty fields', () => {
    for (const entry of CATALOG) {
        const where = `entry ${entry.id}`

        // Explicit honesty envelope — never customer-proven or publication-grade.
        assert.equal(entry.syntheticFixture, true, `${where} syntheticFixture`)
        assert.equal(entry.customerProven, false, `${where} customerProven`)
        assert.equal(
            entry.publicationReady,
            false,
            `${where} publicationReady`
        )

        // All required descriptive fields are present and non-empty.
        for (const field of REQUIRED_ENTRY_FIELDS) {
            assert.ok(entry[field], `${where} missing required field: ${field}`)
        }

        // Honest scope prose must name its synthetic, non-customer nature.
        assert.match(entry.scope, /synthetic/i, `${where} scope names synthetic`)
        assert.match(
            entry.scope,
            /not customer-proven/i,
            `${where} scope disclaims customer proof`
        )

        // Known limits are a real, non-empty list.
        assert.ok(
            Array.isArray(entry.knownLimits) && entry.knownLimits.length >= 1,
            `${where} has known limits`
        )

        // Trial results always carry their own scope caveat.
        assert.ok(entry.trialResults.headline, `${where} trial headline`)
        assert.ok(entry.trialResults.detail, `${where} trial detail`)
        assert.match(
            entry.trialResults.scope,
            /not (a )?(complete|publication|benchmark)|reference demonstration|engineering subset/i,
            `${where} trial scope is bounded`
        )

        // Exactly one reproduction command (single line).
        assert.doesNotMatch(
            entry.reproduction,
            /\n/,
            `${where} reproduction is one command`
        )
    }
})

test('all catalog entries use the canonical browser=Beta maturity label', () => {
    assert.equal(SUBSTRATE_MATURITY.browser, 'Beta')
    for (const entry of CATALOG) {
        assert.equal(entry.substrate, 'browser', `${entry.id} substrate`)
        assert.equal(
            entry.maturity,
            SUBSTRATE_MATURITY.browser,
            `${entry.id} maturity is the canonical browser label`
        )
    }
})

test('trial numbers match the committed evidence provenance, not invented ones', () => {
    // Frappe Lending: the compiled arm is 6/6, the model-free matrix is 12/12.
    const lending = JSON.parse(read('public/lending-demo/provenance.json'))
    assert.equal(lending.evidence.compiled_correct, 6)
    assert.equal(lending.evidence.publication_ready_comparative_matrix, false)
    const frappe = CATALOG.find((e) => e.id === 'frappe-lending')
    assert.match(frappe.trialResults.headline, /12\/12/)
    assert.match(frappe.trialResults.detail, /6\/6/)

    // openIMIS: exactly the 3 verified compiled replays, no matrix.
    const insurance = JSON.parse(read('public/insurance-demo/provenance.json'))
    assert.equal(insurance.evidence.compiled_replays_verified, 3)
    assert.equal(insurance.evidence.publication_ready_comparative_matrix, false)
    const openimis = CATALOG.find((e) => e.id === 'openimis')
    assert.match(openimis.trialResults.headline, /3\/3/)
    // openIMIS is a reference demonstration, not a benchmark — say so.
    assert.match(openimis.trialResults.scope, /not a benchmark/i)

    // OpenEMR: matched model-free 12/12; historical field showcase 20/20 vs 10/10.
    const openemr = CATALOG.find((e) => e.id === 'openemr')
    assert.match(openemr.trialResults.headline, /12\/12/)
    assert.match(openemr.secondaryEvidence, /20\/20.*10\/10/)
})

test('the page frames itself as a reference catalog, not a marketplace', () => {
    const page = read('pages/workflows.js')
    assert.match(page, /reference\s*\n?\s*catalog, not a marketplace/i)
    assert.match(page, /none is customer-proven|not customer-proven/i)
    // Pulls from the shared data module and renders the shared footer.
    assert.match(page, /from 'data\/workflowCatalog'/)
    assert.match(page, /<Footer/)
    assert.match(page, /rel="canonical" href="https:\/\/openadapt\.ai\/workflows"/)
})

test('workflows is linked from nav and footer but not the homepage body', () => {
    assert.match(
        read('components/NavHeader.js'),
        /\{ label: 'Workflows', href: '\/workflows' \}/
    )
    assert.match(read('components/Footer.js'), /href="\/workflows"/)
    // A parallel agent owns the homepage; keep /workflows out of its body.
    assert.doesNotMatch(read('pages/index.js'), /\/workflows/)
})
