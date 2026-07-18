const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const test = require('node:test')

const root = path.join(__dirname, '..')
const read = (relativePath) =>
    fs.readFileSync(path.join(root, relativePath), 'utf8')

const { templates } = require('../data/templates')

// The only applications templates may claim to run on. Everything else must
// be phrased as the customer's OWN application ("your ...") — never a named
// integration we have not actually driven.
const DRIVEN_APPS = ['MockMed', 'OpenEMR', 'Frappe Lending', 'openIMIS']

test('registry entries are complete, unique, and search-titled', () => {
    assert.ok(templates.length >= 6, 'launch gallery has at least 6 templates')

    const slugs = templates.map((t) => t.slug)
    assert.equal(new Set(slugs).size, slugs.length, 'slugs are unique')

    for (const t of templates) {
        assert.match(t.slug, /^[a-z0-9]+(-[a-z0-9]+)*$/, `${t.slug}: kebab-case slug`)
        assert.match(t.title, /^Automate /, `${t.slug}: task-language title`)
        assert.ok(t.summary.length > 80, `${t.slug}: substantive summary`)
        assert.ok(
            t.metaDescription.length > 60 && t.metaDescription.length <= 320,
            `${t.slug}: meta description present and bounded`
        )
        assert.ok(t.runsOn.length > 40, `${t.slug}: honest runs-on line`)
        assert.ok(t.steps.length >= 3, `${t.slug}: real step list`)
        assert.ok(t.verification.length > 80, `${t.slug}: verification story`)
        assert.ok(t.verificationOracles.length >= 1, `${t.slug}: named oracle(s)`)
        assert.ok(t.quickstart.length >= 3, `${t.slug}: CLI quickstart`)
        assert.equal(
            t.quickstart[0].cmd,
            'pip install openadapt',
            `${t.slug}: quickstart starts from the flagship package`
        )
        assert.ok(
            t.quickstart.slice(1).every((step) =>
                step.cmd.split(' && ').every((command) =>
                    command.startsWith('openadapt flow ')
                )
            ),
            `${t.slug}: quickstart uses the unified OpenAdapt CLI`
        )
        assert.match(
            t.source,
            /^https:\/\/github\.com\/OpenAdaptAI\/openadapt-flow/,
            `${t.slug}: source links into the engine repo`
        )
        assert.ok(
            ['reference', 'field', 'pattern'].includes(t.proof),
            `${t.slug}: declared proof level`
        )
    }
})

test('proven templates name only applications we have actually driven', () => {
    for (const t of templates.filter((x) => x.proof !== 'pattern')) {
        assert.ok(
            DRIVEN_APPS.some((app) => t.runsOn.includes(app)),
            `${t.slug}: runs-on names a driven reference app`
        )
    }
})

test('pattern templates are anchored to proven references and claim no canned connectors', () => {
    const provenSlugs = new Set(
        templates.filter((t) => t.proof !== 'pattern').map((t) => t.slug)
    )
    for (const t of templates.filter((x) => x.proof === 'pattern')) {
        assert.ok(
            Array.isArray(t.anchors) && t.anchors.length >= 1,
            `${t.slug}: pattern is anchored`
        )
        for (const anchor of t.anchors) {
            assert.ok(
                provenSlugs.has(anchor),
                `${t.slug}: anchor ${anchor} is a proven reference`
            )
        }
        assert.match(
            t.runsOn,
            /[Yy]our/,
            `${t.slug}: pattern runs on the customer's own applications`
        )
        assert.match(
            `${t.runsOn} ${t.summary}`,
            /no canned (connector|carrier connectors)|recording of your|your own/i,
            `${t.slug}: pattern framing is honest`
        )
    }
})

test('template copy keeps the public slogan discipline', () => {
    const sources = [
        'data/templates.js',
        'pages/templates/index.js',
        'pages/templates/[slug].js',
    ]
        .map(read)
        .join('\n')

    // Same banned claims the rest of the site enforces, plus fabrication bait.
    assert.doesNotMatch(sources, /record once|runs? forever|self[- ]heal|milliseconds/i)
    assert.doesNotMatch(sources, /any app\b|every app\b|works with everything/i)
    assert.doesNotMatch(sources, /\bEpic\b|\bCerner\b|\bAvaility\b|\bDentrix\b|\bEaglesoft\b|\bZapier\b/, 'no integrations we have not driven')
    assert.doesNotMatch(sources, /100% reliable|never fails|guaranteed accuracy/i)
})

test('field-proven claims carry their caveats', () => {
    const openemr = templates.find((t) => t.slug === 'openemr-patient-note')
    assert.match(openemr.evidence, /20\/20/)
    assert.match(openemr.evidence, /not CI-reproducible/i)
    const frappe = templates.find((t) => t.slug === 'frappe-loan-application')
    assert.match(frappe.evidence, /not a publication benchmark/i)
})

test('sitemap lists the gallery and every template page', () => {
    const sitemap = read('public/sitemap.xml')
    assert.match(sitemap, /https:\/\/openadapt\.ai\/templates<\/loc>/)
    for (const t of templates) {
        assert.match(
            sitemap,
            new RegExp(`https://openadapt\\.ai/templates/${t.slug}</loc>`),
            `sitemap lists ${t.slug}`
        )
    }
})

test('llms.txt lists the gallery and every template page', () => {
    const llms = read('public/llms.txt')
    assert.match(llms, /## Workflow Templates/)
    assert.match(llms, /https:\/\/openadapt\.ai\/templates\)/)
    for (const t of templates) {
        assert.ok(
            llms.includes(`https://openadapt.ai/templates/${t.slug}`),
            `llms.txt lists ${t.slug}`
        )
    }
})

test('template pages render every registry field they promise', () => {
    const page = read('pages/templates/[slug].js')
    for (const field of [
        't.runsOn',
        't.steps',
        't.verification',
        't.verificationOracles',
        't.quickstart',
        't.source',
    ]) {
        assert.ok(page.includes(field), `[slug].js renders ${field}`)
    }
    assert.match(page, /application\/ld\+json/)
    assert.match(page, /HowTo/)

    const index = read('pages/templates/index.js')
    assert.match(index, /application\/ld\+json/)
    assert.match(index, /ItemList/)
    assert.match(index, /honesty bar/i)
})
