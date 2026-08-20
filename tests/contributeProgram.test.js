import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'

const landing = fs.readFileSync('components/ContributeSection.js', 'utf8')
const pricing = fs.readFileSync('components/Pricing.js', 'utf8')
const page = fs.readFileSync('pages/contribute.js', 'utf8')
const intake = fs.readFileSync('components/ContributorProgramForm.js', 'utf8')
const formDefinitions = fs.readFileSync('public/form.html', 'utf8')
const footer = fs.readFileSync('components/Footer.js', 'utf8')

// JSX wraps prose across indented lines, so phrase assertions run against a
// whitespace-normalized view. Banned-phrase checks also strip JS comments,
// which quote the banned phrases as guidance.
const norm = (source) => source.replace(/\s+/g, ' ')
const stripComments = (source) =>
    source.replace(/^\s*\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '')
const rendered = norm(
    stripComments(`${landing}\n${pricing}\n${page}\n${intake}`)
)
const pageText = norm(page)

test('contributor copy never turns sanitization into a categorical legal conclusion', () => {
    assert.doesNotMatch(rendered, /de-identified derivatives are not PHI/i)
    assert.doesNotMatch(rendered, /no BAA (is )?required|BAA[- ]free/i)
    assert.match(pageText, /Sanitization alone is not a legal determination/)
    assert.match(pageText, /required named standard/)
})

test('stopping future contributions does not promise revocation of accepted terms', () => {
    assert.doesNotMatch(rendered, /revocable going forward/i)
    assert.match(rendered, /stop future contributions at any time/i)
    assert.match(
        pageText,
        /already accepted remains governed by the versioned terms/i
    )
})

test('contributor copy never frames the program as selling data or names a price', () => {
    assert.doesNotMatch(rendered, /sell your data|monetize your data/i)
    assert.doesNotMatch(rendered, /we buy your data/i)
    assert.doesNotMatch(rendered, /per[- ]record price of|\$\d+ per record/i)
    // Early access framing, never a live capability.
    assert.doesNotMatch(rendered, /upload (your data )?today|available today/i)
    assert.match(rendered, /Early access/)
})

test('the terms-gated program status is disclosed on the page itself', () => {
    assert.match(pageText, /Program status and eligibility/)
    assert.match(
        pageText,
        /off by default until a finalized terms version is active/i
    )
    assert.match(
        pageText,
        /No customer or patient data has been collected through this program/
    )
    assert.match(pageText, /declined contributions earn no credits/i)
})

test('contributor leads use a dedicated Netlify form, segmented from contact', () => {
    // The runtime submit and the build-time definition must agree on the
    // form name, or Netlify silently drops submissions.
    assert.match(intake, /formData\.set\('form-name', 'contributor-program'\)/)
    assert.match(intake, /fetch\('\/form\.html'/)
    assert.match(
        formDefinitions,
        /<form name="contributor-program" data-netlify="true"/
    )
    for (const field of [
        'name',
        'email',
        'company',
        'role',
        'workflows',
        'message',
    ]) {
        assert.ok(
            new RegExp(`name="${field}"`).test(intake),
            `intake posts field ${field}`
        )
    }
    // The page uses the dedicated intake, not the generic contact intake.
    assert.match(page, /ContributorProgramForm/)
    assert.doesNotMatch(page, /ContactBookingSection/)
})

test('pricing and the footer link to the contributor program', () => {
    assert.match(norm(pricing), /Earn credits by contributing/)
    assert.match(pricing, /href="\/contribute"/)
    assert.match(footer, /href: '\/contribute'/)
    // The page links to the real pricing route, not a stale homepage anchor.
    assert.match(page, /href="\/pricing"/)
    assert.doesNotMatch(page, /href="\/#pricing"/)
})

test('contribute surfaces contain no em dashes', () => {
    for (const [label, source] of [
        ['ContributeSection', landing],
        ['contribute page', page],
        ['ContributorProgramForm', intake],
    ]) {
        assert.ok(!source.includes('—'), `${label} has no em dashes`)
    }
})
