const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const test = require('node:test')

const root = path.join(__dirname, '..')
const read = (relativePath) =>
    fs.readFileSync(path.join(root, relativePath), 'utf8')

test('about and contact pages use the canonical product truth', () => {
    const about = read('pages/about.js')
    const contact = read('pages/contact.js')

    assert.match(
        about,
        /OpenAdapt compiles demonstrated GUI workflows into[\s\S]*deterministic, locally executable programs/
    )
    assert.match(about, /https:\/\/github\.com\/OpenAdaptAI\/openadapt-flow\/issues/)
    assert.doesNotMatch(about, /split into focused packages/)
    assert.doesNotMatch(about, /Everything is MIT-licensed/)
    assert.doesNotMatch(contact, /AI-powered automation/)
})

test('footer email is a real keyboard-accessible link', () => {
    assert.match(
        read('components/Footer.js'),
        /href="mailto:hello@openadapt\.ai"/
    )
})

test('GitHub proof uses the canonical repository and a verified fallback', () => {
    const home = read('pages/index.js')
    const masthead = read('components/MastHead.js')
    const footer = read('components/Footer.js')

    assert.match(home, /GITHUB_REPOSITORY = 'OpenAdaptAI\/OpenAdapt'/)
    assert.match(home, /GITHUB_STATS_FALLBACK = \{ stars: 1645, forks: 258 \}/)
    assert.match(masthead, /https:\/\/github\.com\/OpenAdaptAI\/OpenAdapt/)
    assert.match(footer, /href="https:\/\/github\.com\/OpenAdaptAI\/OpenAdapt"/)
    assert.match(footer, /href="https:\/\/github\.com\/OpenAdaptAI\/OpenAdapt\/fork"/)
    assert.doesNotMatch(masthead, /on openadapt-flow/)
})

test('launch surfaces lead with capabilities instead of temporary gap labels', () => {
    const product = read('components/ProductStatus.js')
    const pricing = read('components/Pricing.js')

    for (const label of [
        'Research spike',
        'macOS native workflows',
        'Product maturity',
    ]) {
        assert.doesNotMatch(product, new RegExp(label, 'i'))
    }
    assert.match(product, /One governed workflow, end to end/)
    assert.match(product, /Customer-controlled deployment/)
    assert.doesNotMatch(pricing, /Offer unavailable|Hosted checkout unavailable/)
    assert.match(pricing, /Start with our team/)
})

test('sitemap includes launch, download, and trust surfaces', () => {
    const sitemap = read('public/sitemap.xml')
    for (const route of ['pricing', 'download', 'security', 'safety']) {
        assert.match(sitemap, new RegExp(`https://openadapt\\.ai/${route}`))
    }
})
