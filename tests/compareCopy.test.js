const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const test = require('node:test')

const root = path.join(__dirname, '..')
const compare = fs.readFileSync(path.join(root, 'pages/compare.js'), 'utf8')
const llms = fs.readFileSync(path.join(root, 'public/llms.txt'), 'utf8')

test('comparison page leads with buyer fit and operating outcomes', () => {
    ;[
        'Choose repeatable automation for work that repeats.',
        'Predictable repeat economics',
        'Review reusable change',
        'Know when it stopped',
        'Control the runtime boundary',
        'Choose by the operating model you need.',
        'Control the failure path.',
        'Test one real workflow.',
    ].forEach((claim) => assert.match(compare, new RegExp(claim.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))))
})

test('comparison page keeps the evidence bounded and details optional', () => {
    assert.match(compare, /This benchmark measures repeat cost and latency on one/)
    assert.match(compare, /Method, raw results, and rerun instructions/)
    assert.match(compare, /OpenEMR cross-check/)
    assert.match(compare, /Drift and repair evidence/)
    assert.match(compare, /benchmark\/BENCHMARK\.md/)
    assert.match(compare, /benchmark\/openemr\/BENCHMARK\.md/)
    assert.match(compare, /benchmark\/hybrid\/BENCHMARK\.md/)

    ;[
        "We'd rather tell you",
        'Here is the honest picture',
        'A bounded field cross-check',
        'does not establish production EMR reliability',
        'Review scope, samples, demo limitations, pricing basis, and raw results',
    ].forEach((copy) => assert.doesNotMatch(compare, new RegExp(copy)))
})

test('comparison table is accessible and machine-readable discovery links to it', () => {
    assert.match(compare, /<caption className="sr-only">/)
    assert.match(compare, /scope="col"/)
    assert.match(compare, /scope="row"/)
    assert.match(compare, /aria-labelledby="side-by-side-heading"/)
    assert.match(llms, /\[Compare Approaches\]\(https:\/\/openadapt\.ai\/compare\)/)
})
