const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const test = require('node:test')

const root = path.join(__dirname, '..')
const read = (relativePath) =>
    fs.readFileSync(path.join(root, relativePath), 'utf8')

const page = read('pages/partners.js')
const intake = read('components/PartnerInquiryForm.js')
const formDefinitions = read('public/form.html')
const nav = read('components/NavHeader.js')
const footer = read('components/Footer.js')

const TRACK_VALUES = [
    'vertical_oem',
    'rcm_bpo',
    'integration_services',
    'msp_deployment',
]

test('partner leads use a dedicated Netlify form, segmented from contact', () => {
    // The runtime submit and the build-time definition must agree on the
    // form name, or Netlify silently drops submissions.
    assert.match(intake, /formData\.set\('form-name', 'partner-inquiry'\)/)
    assert.match(intake, /fetch\('\/form\.html'/)
    assert.match(
        formDefinitions,
        /<form name="partner-inquiry" data-netlify="true"/
    )
    for (const field of [
        'name',
        'email',
        'company',
        'role',
        'track',
        'systems',
        'message',
    ]) {
        assert.ok(
            new RegExp(`name="${field}"`).test(intake),
            `intake posts field ${field}`
        )
        const partnerDefinition = formDefinitions
            .split('<form name="partner-inquiry"')[1]
            .split('</form>')[0]
        assert.ok(
            new RegExp(`name="${field}"`).test(partnerDefinition),
            `form.html registers partner field ${field}`
        )
    }
    assert.match(page, /PartnerInquiryForm/)
})

test('the track selector matches the tracks presented on the page', () => {
    for (const value of TRACK_VALUES) {
        assert.ok(
            intake.includes(`value: '${value}'`),
            `intake offers track ${value}`
        )
        assert.ok(page.includes(`id: '${value}'`), `page presents ${value}`)
    }
})

test('each track states its model and responsibility boundaries', () => {
    for (const heading of [
        'Vertical software / OEM',
        'RCM and BPO operators',
        'Integration and services partners',
        'MSP and deployment partners',
    ]) {
        assert.ok(page.includes(heading), `track: ${heading}`)
    }
    assert.match(page, /model:/)
    assert.match(page, /boundaries: \[/)
    assert.match(page, /Responsibility boundaries/)
    // Every track spells out the three boundary dimensions.
    assert.equal((page.match(/Qualification:/g) || []).length, 4)
    assert.equal((page.match(/Support:/g) || []).length, 4)
    assert.equal((page.match(/Packs:/g) || []).length, 4)
})

test('the program is status-honest: apply, not self-serve', () => {
    assert.match(page, /not a self-serve portal/)
    assert.match(page, /review every application individually/i)
    assert.doesNotMatch(page, /partner portal today is live|sign up now/i)
    assert.match(intake, /Apply to partner/)
})

test('partners is reachable from the primary nav and the footer', () => {
    assert.ok(nav.includes(`{ label: 'Partners & OEM', href: '/partners' }`))
    assert.ok(footer.includes('href="/partners"'))
    // Community path: the footer offers the contribute program.
    assert.ok(
        footer.includes(`{ label: 'Contribute workflows', href: '/contribute' }`)
    )
})
