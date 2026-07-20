const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const test = require('node:test')

const root = path.join(__dirname, '..')
const read = (relativePath) =>
    fs.readFileSync(path.join(root, relativePath), 'utf8')

// The homepage reference selector is SHARED: the process/reference-workflow
// section and the "More reference workflows" list read and write ONE lifted
// vertical, so selecting a vertical in one updates the other. These tests lock
// that single-source-of-truth wiring at the source level; the end-to-end
// click-through sync is asserted in cypress/e2e/homepage-vertical-sync.cy.js.

test('homepage lifts one shared vertical selection to the page and syncs the URL', () => {
    const home = read('pages/index.js')

    // Exactly one piece of vertical state lives on the shared parent.
    assert.match(home, /const \[vertical, setVertical\] = useState\(DEFAULT_VERTICAL\)/)
    assert.match(home, /const selectVertical = \(key\) =>/)
    assert.match(home, /VERTICAL_KEYS\.includes/)

    // The choice is reflected into ?ref= (shareable + deep-linkable) without a
    // scroll jump, and read back on mount so the two sections stay in sync.
    assert.match(home, /router\.query\.ref/)
    assert.match(home, /router\.replace\(/)
    assert.match(home, /shallow: true, scroll: false/)
})

test('both homepage reference sections read and write the same selection', () => {
    const home = read('pages/index.js')

    // The process/reference-workflow section is driven by the lifted state.
    assert.match(
        home,
        /<HomeReferenceWorkflow\s+vertical=\{vertical\}\s+onSelectVertical=\{selectVertical\}/
    )

    // The reference list buttons write the SAME selection and reflect it.
    assert.match(home, /onClick=\{[^}]*selectVertical\(reference\.key\)/s)
    assert.match(home, /aria-pressed=\{active\}/)
    assert.match(home, /const active = reference\.key === vertical/)

    // The homepage no longer hard-codes a single-vertical demo.
    assert.doesNotMatch(home, /LendingWorkflowDemo/)

    // Required reference links remain present on the homepage.
    assert.match(home, /Insurance claims reference/)
    assert.match(home, /\/solutions\/insurance/)
})

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
