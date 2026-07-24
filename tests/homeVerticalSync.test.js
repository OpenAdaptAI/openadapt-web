const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const test = require('node:test')

const root = path.join(__dirname, '..')
const read = (relativePath) =>
    fs.readFileSync(path.join(root, relativePath), 'utf8')

test('the process section derives its vertical from the prop, not its own state', () => {
    const component = read('components/HomeReferenceWorkflow.js')

    assert.match(
        component,
        /export default function HomeReferenceWorkflow\(\{ vertical, onSelectVertical \}\)/
    )
    // No independent copy of the selection inside the section.
    assert.doesNotMatch(component, /useState/)
    // The section resolves the active reference from the shared vertical.
    assert.match(component, /HOME_REFERENCES\.find\(\(item\) => item\.key === vertical\)/)
    // The in-section tabs write the shared selection.
    assert.match(component, /onClick=\{\(\) => onSelectVertical\(item\.key\)\}/)
    assert.match(component, /aria-pressed=\{item\.key === reference\.key\}/)
})

test('reference footage restarts on select and keeps the animated GIF behavior', () => {
    const component = read('components/HomeReferenceWorkflow.js')

    // Uses the shared <Clip> (animated GIF via <img>, #213/#214 behavior).
    assert.match(component, /import Clip from '\.\/Clip'/)
    // Each stage is keyed by the selected vertical, so switching remounts the
    // clips/panels and the GIF restarts from its first frame.
    assert.match(component, /key=\{`\$\{reference\.key\}-record`\}/)
    assert.match(component, /key=\{`\$\{reference\.key\}-replay`\}/)
    // No bespoke reduced-motion swap or play/pause control is reintroduced
    // here; the GIF assets and shared Clip styling own that behavior.
    assert.doesNotMatch(component, /<picture>|reducedMotion|Pause animation|Play animation/)
})

test('shared reference data stays honest per vertical', () => {
    const data = read('data/referenceWorkflows.js')

    assert.match(data, /VERTICAL_KEYS = \['healthcare', 'lending', 'insurance'\]/)
    assert.match(data, /DEFAULT_VERTICAL = 'lending'/)
    for (const key of ['healthcare', 'lending', 'insurance']) {
        assert.match(data, new RegExp(`key: '${key}'`))
    }

    // Healthcare must stay qualification-required — never promoted to verified.
    // Scope the check to the healthcare block so lending's verified 6/6 does
    // not leak into the assertion.
    const healthcareBlock = data.slice(
        data.indexOf("key: 'healthcare'"),
        data.indexOf("key: 'lending'")
    )
    assert.match(healthcareBlock, /qualified: false/)
    assert.doesNotMatch(healthcareBlock, /qualified: true/)
    assert.doesNotMatch(healthcareBlock, /6 ?\/ ?6|verified/i)
    assert.match(healthcareBlock, /Deployment-specific oracle required/)
    assert.match(healthcareBlock, /No application-specific audit result claimed/)

    // Lending and Insurance carry their bounded verified evidence.
    assert.match(data, /key: 'lending'[\s\S]*?qualified: true/)
    assert.match(data, /0 silent incorrect successes/)
    assert.match(data, /key: 'insurance'[\s\S]*?qualified: true/)
    assert.match(data, /0 duplicate claims/)

    // Each vertical uses its OWN application footage (no cross-reuse).
    const gifMatches = [...data.matchAll(/gif: '([^']+\.gif)'/g)].map(
        (match) => match[1]
    )
    assert.equal(gifMatches.length, 6)
    assert.equal(new Set(gifMatches).size, 6, 'each clip must use unique footage')
    for (const gif of gifMatches) {
        assert.equal(
            fs.existsSync(path.join(root, 'public', gif)),
            true,
            `${gif} should exist`
        )
    }
})
