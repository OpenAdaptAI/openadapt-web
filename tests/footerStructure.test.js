const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const test = require('node:test')

const root = path.join(__dirname, '..')
const read = (relativePath) =>
    fs.readFileSync(path.join(root, relativePath), 'utf8')

const footer = read('components/Footer.js')

test('footer is organized into the canonical column sections', () => {
    for (const title of [
        'Product',
        'Solutions',
        'Developers',
        'Connect',
        'Company',
        'Trust &amp; legal',
    ]) {
        // The heading may be printed on one line or wrapped by Prettier.
        const heading = new RegExp(
            `columnTitle[^>]*>\\s*${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*</h2>`
        )
        assert.match(footer, heading, `footer has a "${title}" section header`)
    }
})

test('product and solutions destinations are all reachable from the footer', () => {
    for (const href of [
        '/#product-status',
        '/workflows',
        '/templates',
        '/compare',
        '/safety',
        '/download',
        '/pricing',
        '/solutions/healthcare',
        '/solutions/lending',
        '/solutions/insurance',
    ]) {
        assert.ok(footer.includes(`href="${href}"`), `footer links ${href}`)
    }
})

test('developer and connect links come from the single canonical source', () => {
    assert.match(
        footer,
        /import \{ BLOG_LINK, DEVELOPER_LINKS \} from 'data\/developerLinks'/
    )
    // The six developer/community destinations relocated from the homepage
    // body live in the Developers and Connect columns.
    assert.match(footer, /'Compiler\/runtime source'/)
    assert.match(footer, /'Docs'/)
    assert.match(footer, /'Technical paper'/)
    assert.match(footer, /'Report an issue'/)
    assert.match(footer, /const CONNECT_COLUMN = \[/)
    assert.match(footer, /BLOG_LINK/)
    assert.match(footer, /byLabel\('Discord'\)/)
    assert.match(footer, /label: 'GitHub', href: OPENADAPT_REPOSITORY_URL/)
})

test('company, trust, and legal sections are complete', () => {
    for (const href of [
        '/about',
        '/security',
        '/privacy-policy',
        '/terms-of-service',
    ]) {
        assert.ok(footer.includes(`href="${href}"`), `footer links ${href}`)
    }
    // Hosted dashboard reachable from the footer's Company column.
    assert.match(footer, /const CLOUD_APP_URL = 'https:\/\/app\.openadapt\.ai'/)
    assert.match(footer, /href=\{CLOUD_APP_URL\}[\s\S]*?Hosted dashboard/)
    assert.match(footer, /href="mailto:hello@openadapt\.ai"/)
    // Honest labels preserved.
    assert.match(footer, /Trust center/)
    assert.match(footer, /Privacy Notice/)
    assert.match(footer, /Terms of Service/)
})

test('footer carries the standard brand, legal, and social baseline', () => {
    assert.match(
        footer,
        /© 2023–\{currentYear\} OpenAdapt\.AI and MLDSAI Inc\./
    )
    assert.match(footer, /licensed under the\s+MIT License/)
    assert.match(footer, /OpenAdapt compiles demonstrated GUI workflows/)
    for (const icon of [
        'faGithub',
        'faXTwitter',
        'faLinkedinIn',
        'faDiscord',
    ]) {
        assert.ok(footer.includes(icon), `social row renders ${icon}`)
    }
    assert.match(footer, /x\.com\/OpenAdaptAI/)
    assert.match(footer, /linkedin\.com\/company\/95677624/)
    assert.match(footer, /discord\.gg\/yF527cQbDG/)
})

test('star/fork widget is a faithful GitHub-button lookalike, not the api-calling widget', () => {
    // Preserves the machine-readable contract used across the site.
    for (const testid of [
        'footer-repository-stats',
        'footer-star-count',
        'footer-fork-count',
        'footer-repository-source',
    ]) {
        assert.ok(footer.includes(testid), `keeps ${testid}`)
    }
    // GitHub-official button anatomy: octicon + "Star"/"Fork" label + count.
    assert.match(footer, /function StarOcticon\(\)/)
    assert.match(footer, /function ForkOcticon\(\)/)
    assert.match(footer, /<StarOcticon \/>/)
    assert.match(footer, /<ForkOcticon \/>/)
    assert.match(footer, /<span>Star<\/span>/)
    assert.match(footer, /<span>Fork<\/span>/)
    assert.match(footer, /stars on OpenAdapt/)
    assert.match(footer, /forks of OpenAdapt/)
    // Never the third-party widget that makes visitor browsers hit
    // api.github.com (also guarded in publicTruth.test.js).
    assert.doesNotMatch(
        footer,
        /data-show-count|github-button|buttons\.github\.io/
    )
})
