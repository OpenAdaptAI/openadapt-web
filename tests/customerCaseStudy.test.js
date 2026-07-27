const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const test = require('node:test')

const root = path.join(__dirname, '..')
const read = (relativePath) =>
    fs.readFileSync(path.join(root, relativePath), 'utf8')

test('keeps the customer result and synthetic validation in one canonical case-study model', () => {
    const combined = `${read('data/customerCaseStudies.js')}\n${read(
        'pages/customers/rvu-audit-heart-care.js'
    )}`

    assert.match(combined, /customer:\s*{/)
    assert.match(combined, /validation:\s*{/)
    assert.match(combined, /customerCase\.validation\.metrics\.map/)
    assert.doesNotMatch(combined, /reliability_recipes\/|outputs\/cases\.jsonl/)
})

// The individual consented to being named; his employer did not. A named
// health system paired with a claim about missed billables is an assertion
// about that institution's billing failures. These are consent invariants, not
// copy preferences -- pin them.
test('names no employer institution on the customer case study', () => {
    const surfaces = [
        'data/customerCaseStudies.js',
        'pages/customers/rvu-audit-heart-care.js',
        'components/CustomerCaseStudy.js',
        'public/llms.txt',
        'public/llms-full.txt',
    ].map(read)

    for (const source of surfaces) {
        // The specific employer that was published and withdrawn.
        assert.doesNotMatch(source, /MercyOne|Waterloo/i)
        // And the general shape: no hospital or health-system employer.
        assert.doesNotMatch(
            source,
            /\b(?:Hospital|Health System|Medical Center|Medical Centre)\b/
        )
    }

    // The setting stays generic.
    assert.match(
        read('data/customerCaseStudies.js'),
        /organization: 'A US cardiology electrophysiology practice'/
    )
})

test('discloses the founder relationship and the preliminary figures', () => {
    const data = read('data/customerCaseStudies.js')

    // Related party, and a founding deployment rather than arm's-length
    // validation. An undisclosed family relationship that a reader finds costs
    // far more than a disclosed one.
    assert.match(data, /relationshipDisclosure:/)
    assert.match(data, /founder’s brother/)
    assert.match(data, /founding deployment/)
    assert.match(data, /RVU_RECOVERY_FOOTNOTE/)
    assert.match(data, /preliminary and under review pending final customer confirmation/)

    // Both must actually render, on the case study and on the homepage tile.
    const page = read('pages/customers/rvu-audit-heart-care.js')
    assert.match(page, /customerCase\.relationshipDisclosure/)
    assert.match(page, /RVU_RECOVERY_FOOTNOTE/)
    assert.match(
        read('components/CustomerCaseStudy.js'),
        /customerCase\.relationshipDisclosure/
    )
})

test('links the customer result from the public discovery surfaces', () => {
    assert.match(read('pages/index.js'), /<CustomerCaseStudy \/>/)
    assert.match(read('components/NavHeader.js'), /Customer results/)
    assert.match(read('public/sitemap.xml'), /\/customers\/rvu-audit-heart-care/)
    assert.match(read('public/llms.txt'), /Customer Case Study — RVU Audits/)
})
