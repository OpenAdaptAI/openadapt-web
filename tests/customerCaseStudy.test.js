const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const test = require('node:test')

const root = path.join(__dirname, '..')
const read = (relativePath) =>
    fs.readFileSync(path.join(root, relativePath), 'utf8')

test('publishes the named RVU audit result without invented run evidence', () => {
    const combined = `${read('data/customerCaseStudies.js')}\n${read(
        'pages/customers/rvu-audit-heart-care.js'
    )}`

    assert.match(combined, /Dr\. Victor Abrich, MD/)
    assert.match(combined, /MercyOne Waterloo Heart Care/)
    assert.match(combined, /≈\$75,000/)
    assert.match(combined, /Cerner PowerChart/)
    assert.doesNotMatch(combined, /480|476|99\.2%|v1\.23\.0|out-of-band read-back/)
})

test('links the customer result from the public discovery surfaces', () => {
    assert.match(read('pages/index.js'), /<CustomerCaseStudy \/>/)
    assert.match(read('components/NavHeader.js'), /Customer results/)
    assert.match(read('public/sitemap.xml'), /\/customers\/rvu-audit-heart-care/)
    assert.match(read('public/llms.txt'), /Customer Case Study — RVU Audits/)
})
