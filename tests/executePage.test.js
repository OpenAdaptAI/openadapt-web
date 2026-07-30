const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const test = require('node:test')

const read = (relativePath) =>
    fs.readFileSync(path.join(__dirname, '..', relativePath), 'utf8')

test('Execute has qualification and OEM routes', () => {
    const page = read('pages/execute.js')

    assert.match(page, /href="\/qualify"/)
    assert.match(page, /href="\/partners#apply"/)
    assert.match(page, /<Footer \/>/)
})

test('Execute is reachable from product, partner, and pricing routes', () => {
    assert.match(read('components/NavHeader.js'), /href: '\/execute'/)
    assert.match(read('pages/partners.js'), /href="\/execute"/)
    assert.match(read('components/Pricing.js'), /href="\/execute"/)
})
