const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const test = require('node:test')

const root = path.join(__dirname, '..')
const read = (relativePath) =>
    fs.readFileSync(path.join(root, relativePath), 'utf8')

test('the customer case study is a direct OpenAdapt result', () => {
    const data = read('data/customerCaseStudies.js')
    const component = read('components/CustomerCaseStudy.js')
    const page = read('pages/customers/rvu-audit-heart-care.js')
    const combined = `${data}\n${component}\n${page}`

    assert.match(combined, /Dr\. Victor Abrich, MD/)
    assert.match(combined, /Board-certified electrophysiologist/)
    assert.match(combined, /MercyOne Waterloo Heart Care/)
    assert.match(combined, /≈\$75,000/)
    assert.match(combined, /recovered billables per year/)
    assert.match(combined, /Several hours/)
    assert.match(combined, /manual audit work saved each month/)
    assert.match(combined, /EMR/)
    assert.match(combined, /RVU/)
    assert.doesNotMatch(
        combined,
        /TurboPA|RVUBot|predecessor|historical product|earlier product|evolved from/i
    )
})

test('the customer result is visible from the homepage and product navigation', () => {
    const home = read('pages/index.js')
    const navigation = read('components/NavHeader.js')
    const sitemap = read('public/sitemap.xml')
    const llms = read('public/llms.txt')

    assert.match(home, /import CustomerCaseStudy/)
    assert.match(home, /<CustomerCaseStudy \/>/)
    assert.match(navigation, /Customer results/)
    assert.match(navigation, /\/customers\/rvu-audit-heart-care/)
    assert.match(
        sitemap,
        /https:\/\/openadapt\.ai\/customers\/rvu-audit-heart-care/
    )
    assert.match(llms, /Customer Case Study — RVU Audits/)
})
