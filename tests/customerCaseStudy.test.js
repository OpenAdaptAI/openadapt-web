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
    assert.doesNotMatch(
        combined,
        /OPENADAPT-CORPUS-PRIVATE-DO-NOT-PACKAGE|reliability_recipes\//
    )
})

test('links the customer result from the public discovery surfaces', () => {
    assert.match(read('pages/index.js'), /<CustomerCaseStudy \/>/)
    assert.match(read('components/NavHeader.js'), /Customer results/)
    assert.match(read('public/sitemap.xml'), /\/customers\/rvu-audit-heart-care/)
    assert.match(read('public/llms.txt'), /Customer Case Study — RVU Audits/)
})
