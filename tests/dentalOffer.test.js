const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const test = require('node:test')

const root = path.join(__dirname, '..')
const read = (relativePath) =>
    fs.readFileSync(path.join(root, relativePath), 'utf8')

test('dental page states the founding-cohort offer exactly and honestly', () => {
    const page = read('pages/dental.js')

    // The exact bounded offer: price, one location, scope, locality, queue,
    // signed monthly KPI refund, and cohort.
    assert.match(page, /\$500\/mo/)
    assert.doesNotMatch(page, /\$499|\$299/)
    assert.match(page, /one (dental )?practice location|one location/i)
    assert.match(page, /three approved (payer )?portals/i)
    assert.match(page, /600 checks per month/i)
    assert.match(page, /front-desk (PC|computer)/i)
    assert.match(page, /ready-to-finish queue/i)
    assert.match(page, /same business day/i)
    assert.match(page, /practice has\s+consented/i)
    assert.match(page, /portal has cleared our access\s+review/i)
    assert.match(page, /founding cohort of 10 practices/i)
    assert.match(page, /refund that[\s\S]*month/)
    assert.match(page, /signed (monthly )?(service )?KPI/i)
    assert.match(page, /representative cases/i)

    // Concierge fulfillment is disclosed, not hidden.
    assert.match(page, /We build your first workflow with you/)

    // No fabricated social proof or compliance claims.
    assert.doesNotMatch(page, /testimonial|trusted by|practices already|certified|SOC ?2|HIPAA[- ]compliant/i)
    assert.doesNotMatch(page, /record once|runs? forever|self[- ]heal/i)
    assert.doesNotMatch(page, /every verification completed|our team finishes anything/i)
})

test('dental local-first block describes design, and defers the legal call', () => {
    const page = read('pages/dental.js')

    assert.match(page, /Designed so PHI stays on your machine/)
    assert.match(page, /not legal\s+advice/)
    assert.match(page, /compliance officer or counsel/)
    assert.match(page, /BAA when applicable/)
    assert.match(page, /patient data is not copied\s+into our cloud/)
    // "No BAA needed" must stay a qualified design description, never a blanket
    // legal promise.
    assert.doesNotMatch(page, /no BAA (is )?required|BAA[- ]free|without a BAA/i)
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

/**
 * The information-architecture decision, pinned because it is exactly the
 * kind of thing a later "make it more visible" change reverses by accident.
 *
 * /dental is a capacity-bounded founding-cohort offer at a published price
 * with no customers yet. Crawlers and AI assistants reach it through
 * robots.txt + sitemap.xml + llms.txt + Service/Offer JSON-LD; readers reach
 * it through the one topically-matched internal link on the dental template.
 * It is deliberately NOT in the primary nav or the footer: those Solutions
 * menus hold /solutions/* positioning pages, and a priced vertical offer
 * sitting beside them on every page would read as an established product line
 * the company does not yet have.
 *
 * Discovery and navigation are separate questions. This test keeps them so.
 * Changing it is a positioning decision — update the reasoning above with it.
 */
test('dental is discoverable to crawlers and AI search without a nav entry', () => {
    const sitemap = read('public/sitemap.xml')
    const llms = read('public/llms.txt')
    const page = read('pages/dental.js')
    const nav = read('components/NavHeader.js')
    const footer = read('components/Footer.js')
    const templates = read('data/templates.js')

    // Machine discovery: sitemap, the llms.txt index, and a Service/Offer
    // node whose price matches the price rendered on the page.
    assert.match(sitemap, /<loc>https:\/\/openadapt\.ai\/dental<\/loc>/)
    assert.match(llms, /https:\/\/openadapt\.ai\/dental/)
    assert.match(page, /serviceNode\(/)
    assert.match(page, /price: 500/)

    // Reader discovery: exactly one contextual internal link, from the
    // template that describes the same workflow.
    assert.match(templates, /slug: 'dental-insurance-eligibility'/)
    assert.match(templates, /managedOffer/)
    assert.match(templates, /href: '\/dental'/)

    // Not in primary nav, not in the footer. The /solutions/dental
    // POSITIONING page may appear in both (it is a Solutions page like
    // healthcare/lending/insurance); the priced /dental OFFER page may not,
    // so match the exact quoted href rather than the substring.
    assert.doesNotMatch(nav, /'\/dental'|"\/dental"/)
    assert.doesNotMatch(footer, /'\/dental'|"\/dental"/)
})
