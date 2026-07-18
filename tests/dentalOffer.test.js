const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const test = require('node:test')

const root = path.join(__dirname, '..')
const read = (relativePath) =>
    fs.readFileSync(path.join(root, relativePath), 'utf8')

test('dental page states the founding-cohort offer exactly and honestly', () => {
    const page = read('pages/dental.js')

    // The offer as specified: price, locality, halt contract, guarantee, cohort.
    assert.match(page, /\$299\/mo/)
    assert.match(page, /front-desk (PC|computer)/i)
    assert.match(page, /halts (and asks )?instead of guessing/i)
    assert.match(page, /founding cohort of 10 practices/i)
    assert.match(page, /full refund/i)
    assert.match(page, /agreed KPI/i)

    // Concierge fulfillment is disclosed, not hidden.
    assert.match(page, /We build your first workflow with you/)

    // No fabricated social proof or compliance claims.
    assert.doesNotMatch(page, /testimonial|trusted by|practices already|certified|SOC ?2|HIPAA[- ]compliant/i)
    assert.doesNotMatch(page, /record once|runs? forever|self[- ]heal/i)
})

test('dental local-first block describes design, and defers the legal call', () => {
    const page = read('pages/dental.js')

    assert.match(page, /Designed so PHI stays on your machine/)
    assert.match(page, /not legal\s+advice/)
    assert.match(page, /compliance officer or counsel/)
    // "No BAA needed" must stay a qualified design description, never a blanket
    // legal promise.
    assert.doesNotMatch(page, /no BAA (is )?required|BAA[- ]free|without a BAA/i)
})

test('dental halt-moment footage is real and labeled truthfully while dental assets are pending', () => {
    const demo = read('components/DentalHaltMoment.js')

    // Slots for the dental payer-portal assets, currently backed by the
    // existing REAL OpenEMR replay footage — labeled as exactly that.
    assert.match(demo, /const DENTAL_CLIPS = null/)
    assert.match(demo, /manifest\.steps\.record_openemr/)
    assert.match(demo, /manifest\.steps\.run_openemr/)
    assert.match(demo, /real, unstaged screen\s+recordings/i)
    assert.match(demo, /live OpenEMR instance/)
    assert.match(demo, /Never point[\s\S]*these slots at mocked or fabricated footage/)
    assert.match(demo, /system of record, not just[\s\S]*what happens to be on the screen/)
})

test('dental lead form uses a distinct Netlify form with UTM attribution', () => {
    const form = read('components/DentalLeadForm.js')
    const registration = read('public/form.html')
    const utm = read('utils/utm.js')

    assert.match(form, /DENTAL_FORM_NAME = 'dental-founding-cohort'/)
    assert.match(form, /captureUtmParams/)
    assert.match(form, /landing_path/)
    assert.match(form, /import BookingEmbed/)

    // Static Netlify registration must exist and carry every submitted field.
    assert.match(registration, /name="dental-founding-cohort"/)
    for (const field of [
        'name',
        'email',
        'practice',
        'pms',
        'message',
        'landing_path',
        'utm_source',
        'utm_medium',
        'utm_campaign',
        'utm_term',
        'utm_content',
    ]) {
        const formBlock = registration.slice(
            registration.indexOf('name="dental-founding-cohort"')
        )
        assert.match(formBlock, new RegExp(`name="${field}"`))
    }

    for (const key of [
        'utm_source',
        'utm_medium',
        'utm_campaign',
        'utm_term',
        'utm_content',
    ]) {
        assert.match(utm, new RegExp(`'${key}'`))
    }
})

test('dental page is discoverable and routes booking through the canonical embed', () => {
    const page = read('pages/dental.js')
    const sitemap = read('public/sitemap.xml')

    assert.match(sitemap, /https:\/\/openadapt\.ai\/dental/)
    assert.match(page, /href="https:\/\/openadapt\.ai\/dental"/)
    assert.match(page, /sectionId="book"/)
    assert.match(page, /href="#book"/)
})
