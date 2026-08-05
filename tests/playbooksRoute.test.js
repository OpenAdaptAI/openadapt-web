const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const test = require('node:test')

const source = fs.readFileSync(
    path.join(__dirname, '..', 'pages', 'playbooks', 'customer.js'),
    'utf8'
)

test('the stable OpenAdapt customer path redirects to the isolated service', () => {
    assert.match(source, /https:\/\/playbooks\.openadapt\.ai\/customer/)
    assert.match(source, /X-Robots-Tag/)
    assert.match(source, /noindex, nofollow/)
    assert.match(source, /permanent: false/)
})
