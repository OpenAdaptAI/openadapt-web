import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'

const landing = fs.readFileSync('components/ContributeSection.js', 'utf8')
const pricing = fs.readFileSync('components/Pricing.js', 'utf8')
const page = fs.readFileSync('pages/contribute.js', 'utf8')
const publicCopy = `${landing}\n${pricing}\n${page}`

test('contributor copy never turns sanitization into a categorical legal conclusion', () => {
    assert.doesNotMatch(publicCopy, /de-identified derivatives are not PHI/i)
    assert.doesNotMatch(publicCopy, /no BAA (is )?required|BAA[- ]free/i)
    assert.match(page, /Sanitization alone is not a legal determination/)
    assert.match(page, /required named standard/)
})

test('stopping future contributions does not promise revocation of accepted terms', () => {
    assert.doesNotMatch(publicCopy, /revocable going forward/i)
    assert.match(publicCopy, /stop future contributions at any time/i)
    assert.match(page, /already accepted remains governed by the versioned terms/i)
})
