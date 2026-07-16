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
    assert.match(home, /GITHUB_STATS_FALLBACK = \{ stars: 1646, forks: 258 \}/)
    assert.match(masthead, /https:\/\/github\.com\/OpenAdaptAI\/OpenAdapt/)
    assert.match(footer, /href="https:\/\/github\.com\/OpenAdaptAI\/OpenAdapt"/)
    assert.match(footer, /href="https:\/\/github\.com\/OpenAdaptAI\/OpenAdapt\/fork"/)
    assert.doesNotMatch(masthead, /on openadapt-flow/)
})

test('launch surfaces lead with capabilities instead of temporary gap labels', () => {
    const product = read('components/ProductStatus.js')
    const pricing = read('components/Pricing.js')
    const llms = read('public/llms.txt')
    const readme = read('README.md')

    for (const label of [
        'Research spike',
        'macOS native workflows',
        'Product maturity',
    ]) {
        assert.doesNotMatch(product, new RegExp(label, 'i'))
    }
    assert.match(product, /One governed workflow, end to end/)
    assert.match(product, /Customer-controlled deployment/)
    assert.match(product, /Execution substrate evidence/)
    for (const substrate of [
        'Browser / Playwright',
        'Windows UIA',
        'Native macOS',
        'RDP / Citrix',
    ]) {
        assert.match(product, new RegExp(substrate.replace('/', '\\/')))
    }
    for (const tier of ['Beta', 'Experimental', 'Research']) {
        assert.match(product, new RegExp(`status: '${tier}'`))
    }
    assert.doesNotMatch(pricing, /Offer unavailable|Hosted checkout unavailable/)
    assert.match(pricing, /Start with our team/)
    assert.doesNotMatch(llms, /Product Maturity|launching now|not implied/i)
    assert.match(llms, /How It Runs/)
    assert.doesNotMatch(readme, /Maturity matrix/i)
})

test('public slogans scope demonstrated workflows and governed repair', () => {
    const sources = [
        'pages/_app.js',
        'pages/index.js',
        'components/MastHead.js',
        'components/ReplayHero.js',
        'public/llms.txt',
        'utils/packageDiscovery.js',
        'public/how-it-works/MANIFEST.json',
    ].map(read).join('\n')

    assert.doesNotMatch(sources, /record once|runs? forever|self[- ]heal|milliseconds/i)
    assert.match(sources, /bounded demonstration|bounded workflow/i)
    assert.match(sources, /governed repair/i)
})

test('lending page does not reuse healthcare media as lending evidence', () => {
    const lending = read('pages/solutions/lending.js')

    assert.doesNotMatch(lending, /import HowItWorks/)
    assert.match(lending, /lending-evidence-placeholder/)
    assert.match(lending, /do not reuse healthcare or OpenEMR footage/i)
    assert.match(lending, /awaiting oracle verification/i)
})

test('sitemap includes launch, download, and trust surfaces', () => {
    const sitemap = read('public/sitemap.xml')
    for (const route of ['pricing', 'download', 'security', 'safety']) {
        assert.match(sitemap, new RegExp(`https://openadapt\\.ai/${route}`))
    }
})
