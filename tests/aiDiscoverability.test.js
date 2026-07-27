/**
 * AI-discoverability contracts.
 *
 * Buyers increasingly find tools by asking an assistant rather than by
 * searching. These tests pin the three artifacts that decide whether an
 * assistant can read us accurately -- robots.txt, llms.txt/llms-full.txt, and
 * sitemap.xml -- plus the honesty rules for structured data.
 *
 * These are durable data contracts, not copy assertions: each failure below is
 * either "an AI crawler can no longer read a page we want cited", "we published
 * a link that does not resolve", "a public surface promotes a substrate above
 * what status.json says", or "we shipped fabricated trust markup".
 */

const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const test = require('node:test')
const vm = require('node:vm')

const root = path.join(__dirname, '..')
const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8')

const robots = read('public/robots.txt')
const llms = read('public/llms.txt')
const llmsFull = read('public/llms-full.txt')
const sitemap = read('public/sitemap.xml')
const status = JSON.parse(read('public/status.json'))

const SITE = 'https://openadapt.ai'

// ---------------------------------------------------------------------------
// robots.txt
// ---------------------------------------------------------------------------

// Crawlers we have deliberately decided to ALLOW because we want them citing
// us. Removing one from robots.txt is a distribution decision, not a cleanup,
// so it has to break a test first.
const WANTED_AI_CRAWLERS = [
    // OpenAI
    'GPTBot',
    'OAI-SearchBot',
    'ChatGPT-User',
    // Anthropic
    'ClaudeBot',
    'Claude-SearchBot',
    'Claude-User',
    'anthropic-ai',
    // Perplexity
    'PerplexityBot',
    'Perplexity-User',
    // Google
    'Googlebot',
    'Google-Extended',
    'Google-CloudVertexBot',
    // Microsoft / Bing / Copilot
    'bingbot',
    // Apple
    'Applebot',
    'Applebot-Extended',
    // Others
    'Amazonbot',
    'meta-externalagent',
    'DuckAssistBot',
    'CCBot',
    'MistralAI-User',
    'cohere-ai',
    'Diffbot',
]

/**
 * Parse robots.txt into groups. Consecutive User-agent lines share one rule
 * block, per the robots exclusion protocol.
 */
function parseRobots(text) {
    const groups = []
    let current = null
    let expectingAgents = false
    for (const rawLine of text.split('\n')) {
        const line = rawLine.replace(/#.*$/, '').trim()
        if (!line) continue
        const match = /^([A-Za-z-]+)\s*:\s*(.*)$/.exec(line)
        if (!match) continue
        const field = match[1].toLowerCase()
        const value = match[2].trim()
        if (field === 'user-agent') {
            if (!expectingAgents) {
                current = { agents: [], rules: [] }
                groups.push(current)
                expectingAgents = true
            }
            current.agents.push(value)
            continue
        }
        if (field === 'sitemap') continue
        if (current) {
            expectingAgents = false
            current.rules.push({ field, value })
        }
    }
    return groups
}

const robotsGroups = parseRobots(robots)

const groupFor = (agent) =>
    robotsGroups.find((group) =>
        group.agents.some((a) => a.toLowerCase() === agent.toLowerCase())
    )

test('robots.txt explicitly welcomes every AI crawler we want citing us', () => {
    for (const agent of WANTED_AI_CRAWLERS) {
        const group = groupFor(agent)
        assert.ok(group, `robots.txt must name ${agent} explicitly`)
        assert.ok(
            group.rules.some(
                (rule) => rule.field === 'allow' && rule.value === '/'
            ),
            `${agent} must be allowed on /`
        )
        assert.ok(
            !group.rules.some(
                (rule) => rule.field === 'disallow' && rule.value === '/'
            ),
            `${agent} must not be blocked site-wide`
        )
    }
})

test('every named crawler group repeats the /api/ disallow', () => {
    // A named User-agent group REPLACES the "*" group; it does not inherit its
    // Disallow lines. Without repeating the rule, an AI crawler would hammer
    // serverless functions that make outbound third-party calls and carry no
    // citation value.
    for (const group of robotsGroups) {
        if (group.agents.length === 1 && group.agents[0] === '*') continue
        assert.ok(
            group.rules.some(
                (rule) =>
                    rule.field === 'disallow' && rule.value.startsWith('/api')
            ),
            `group [${group.agents.join(', ')}] must repeat "Disallow: /api/"`
        )
    }
})

test('robots.txt publishes the sitemap and records why access is granted', () => {
    assert.match(robots, /^Sitemap:\s*https:\/\/openadapt\.ai\/sitemap\.xml$/m)
    // The allow/deny decision must stay documented, so a future editor changes
    // it on purpose rather than by accident.
    assert.match(robots, /Policy decision/i)
})

// ---------------------------------------------------------------------------
// sitemap.xml
// ---------------------------------------------------------------------------

const sitemapLocs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    (match) => match[1]
)

const sitemapPaths = new Set(
    sitemapLocs.map((loc) => {
        const suffix = loc.slice(SITE.length)
        return suffix === '' || suffix === '/' ? '/' : suffix
    })
)

/** Static page routes on disk, excluding API routes and dynamic segments. */
function staticPageRoutes() {
    const pagesDir = path.join(root, 'pages')
    const routes = []
    const walk = (dir, prefix) => {
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
            if (entry.isDirectory()) {
                if (entry.name === 'api') continue
                walk(path.join(dir, entry.name), `${prefix}/${entry.name}`)
                continue
            }
            if (!entry.name.endsWith('.js')) continue
            const base = entry.name.replace(/\.js$/, '')
            if (base.startsWith('_')) continue
            if (base.startsWith('[')) continue
            const route =
                base === 'index' ? prefix || '/' : `${prefix}/${base}`
            routes.push({
                route,
                file: path.join(dir, entry.name),
            })
        }
    }
    walk(pagesDir, '')
    return routes
}

test('sitemap.xml covers every indexable static route and nothing else', () => {
    const missing = []
    for (const { route, file } of staticPageRoutes()) {
        const source = fs.readFileSync(file, 'utf8')
        // Pages that deliberately opt out at the page level are allowed to be
        // absent from the sitemap.
        if (/name="robots"[^>]*content="noindex/.test(source)) continue
        // Redirect stubs (for example /contact -> /qualify) must never appear
        // in the sitemap: a sitemap entry that 3xx-es is a crawl-budget defect.
        if (/redirect:\s*\{/.test(source)) continue
        if (!sitemapPaths.has(route)) missing.push(route)
    }
    assert.deepEqual(
        missing,
        [],
        `routes missing from public/sitemap.xml: ${missing.join(', ')}`
    )
})

test('every sitemap URL resolves to a real route', () => {
    const staticRoutes = new Set(staticPageRoutes().map((r) => r.route))
    const comparisonSlugs = [
        ...read('data/comparisons.js').matchAll(/slug:\s*'([^']+)'/g),
    ].map((m) => m[1])
    const templateSlugs = [
        ...read('data/templates.js').matchAll(/slug:\s*'([^']+)'/g),
    ].map((m) => m[1])
    const caseStudySlugs = [
        ...read('data/customerCaseStudies.js').matchAll(/slug:\s*'([^']+)'/g),
    ].map((m) => m[1])

    assert.ok(comparisonSlugs.length > 0, 'comparison slugs must be readable')
    assert.ok(templateSlugs.length > 0, 'template slugs must be readable')

    for (const slug of comparisonSlugs) staticRoutes.add(`/compare/${slug}`)
    for (const slug of templateSlugs) staticRoutes.add(`/templates/${slug}`)
    for (const slug of caseStudySlugs) staticRoutes.add(`/customers/${slug}`)

    const orphaned = [...sitemapPaths].filter(
        (route) => !staticRoutes.has(route)
    )
    assert.deepEqual(
        orphaned,
        [],
        `sitemap entries with no matching route: ${orphaned.join(', ')}`
    )
})

test('every comparison and template detail page is in the sitemap', () => {
    const comparisonSlugs = [
        ...read('data/comparisons.js').matchAll(/slug:\s*'([^']+)'/g),
    ].map((m) => m[1])
    const templateSlugs = [
        ...read('data/templates.js').matchAll(/slug:\s*'([^']+)'/g),
    ].map((m) => m[1])
    for (const slug of comparisonSlugs) {
        assert.ok(
            sitemapPaths.has(`/compare/${slug}`),
            `/compare/${slug} must be in the sitemap`
        )
    }
    for (const slug of templateSlugs) {
        assert.ok(
            sitemapPaths.has(`/templates/${slug}`),
            `/templates/${slug} must be in the sitemap`
        )
    }
})

// ---------------------------------------------------------------------------
// llms.txt / llms-full.txt
// ---------------------------------------------------------------------------

/** Collect every first-party link, split into path and optional anchor. */
function firstPartyLinks(text) {
    const links = []
    const pattern = new RegExp(`${SITE}(/[A-Za-z0-9._/-]*)?(#[A-Za-z0-9-]+)?`, 'g')
    for (const match of text.matchAll(pattern)) {
        links.push({
            raw: match[0],
            pathname: match[1] || '/',
            anchor: match[2] ? match[2].slice(1) : null,
        })
    }
    return links
}

const publicFiles = new Set(
    fs
        .readdirSync(path.join(root, 'public'), { withFileTypes: true })
        .filter((entry) => entry.isFile())
        .map((entry) => `/${entry.name}`)
)

test('every openadapt.ai link in llms.txt resolves to a real route or file', () => {
    const staticRoutes = new Set(staticPageRoutes().map((r) => r.route))
    for (const source of ['data/comparisons.js', 'data/templates.js']) {
        const base = source.includes('comparisons') ? '/compare' : '/templates'
        for (const match of read(source).matchAll(/slug:\s*'([^']+)'/g)) {
            staticRoutes.add(`${base}/${match[1]}`)
        }
    }
    for (const match of read('data/customerCaseStudies.js').matchAll(
        /slug:\s*'([^']+)'/g
    )) {
        staticRoutes.add(`/customers/${match[1]}`)
    }

    const broken = []
    for (const link of firstPartyLinks(llms)) {
        if (staticRoutes.has(link.pathname)) continue
        if (publicFiles.has(link.pathname)) continue
        broken.push(link.raw)
    }
    assert.deepEqual(
        broken,
        [],
        `llms.txt points at destinations that do not exist: ${broken.join(', ')}`
    )
})

test('llms.txt never advertises a redirect stub as a destination', () => {
    // An assistant that quotes a URL should quote the final one. Publishing a
    // 3xx source costs a hop and can strand a crawler that does not follow it.
    const redirectRoutes = staticPageRoutes()
        .filter(({ file }) =>
            /redirect:\s*\{/.test(fs.readFileSync(file, 'utf8'))
        )
        .map(({ route }) => route)
    for (const route of redirectRoutes) {
        assert.ok(
            !llms.includes(`${SITE}${route}`),
            `llms.txt links ${route}, which is a redirect stub`
        )
        assert.ok(
            !sitemapPaths.has(route),
            `sitemap lists ${route}, which is a redirect stub`
        )
    }
})

test('every anchor cited by llms.txt exists in a rendered component', () => {
    // A #anchor that does not exist is worse than a missing link: the base URL
    // returns 200 so a naive link check passes, while an assistant following
    // the pointer lands on content that is not there.
    const sourceHaystack = ['components', 'pages']
        .flatMap((dir) => {
            const collected = []
            const walk = (current) => {
                for (const entry of fs.readdirSync(current, {
                    withFileTypes: true,
                })) {
                    const full = path.join(current, entry.name)
                    if (entry.isDirectory()) walk(full)
                    else if (entry.name.endsWith('.js'))
                        collected.push(fs.readFileSync(full, 'utf8'))
                }
            }
            walk(path.join(root, dir))
            return collected
        })
        .join('\n')

    for (const text of [llms, llmsFull]) {
        for (const link of firstPartyLinks(text)) {
            if (!link.anchor) continue
            assert.ok(
                sourceHaystack.includes(`id="${link.anchor}"`) ||
                    sourceHaystack.includes(`id='${link.anchor}'`),
                `anchor #${link.anchor} referenced by ${link.raw} is not rendered anywhere`
            )
        }
    }
})

test('llms.txt and llms-full.txt never promote a substrate above status.json', () => {
    // status.json is the canonical machine-readable source of truth. The
    // superseded ladder wording ("early access", "exploratory") must never
    // reappear, and neither may an unqualified "production ready" claim.
    for (const [name, text] of [
        ['llms.txt', llms],
        ['llms-full.txt', llmsFull],
    ]) {
        assert.doesNotMatch(
            text,
            /early access|exploratory|design.partner/i,
            `${name} must not use the superseded maturity ladder`
        )
        assert.doesNotMatch(
            text,
            /production[- ]ready|fully certified|guaranteed/i,
            `${name} must not overstate maturity`
        )
        for (const substrate of status.substrates) {
            assert.ok(
                text.includes(substrate.name),
                `${name} must list the ${substrate.name} substrate`
            )
        }
        // Every CURRENT-version claim must match status.json. Deliberately
        // scoped to the "Current published versions:" line rather than every
        // occurrence of a version number, because a historical measurement
        // provenance ("measured 2026-07-08 on openadapt-flow 0.1.0", "exercised
        // under Flow 1.23.0") is a true statement about when something ran and
        // must NOT be rewritten to the current release — doing so would
        // fabricate the measurement. Those claims are guarded separately by
        // scripts/check_published_version_claims.mjs, which classifies each as
        // pypi-latest / pinned-deployment / historical.
        const currentLine = text
            .split('\n')
            .find((line) => /current published versions/i.test(line))
        assert.ok(
            currentLine,
            `${name} must state the current published versions`
        )
        for (const [component, version] of Object.entries(status.versions)) {
            const stale = new RegExp(`${component}\\s+(\\d+\\.\\d+\\.\\d+)`, 'gi')
            for (const match of currentLine.matchAll(stale)) {
                assert.equal(
                    match[1],
                    version,
                    `${name} states current ${component} ${match[1]} but status.json says ${version}`
                )
            }
        }
    }
})

test('llms-full.txt keeps the Citrix ICA/HDX qualification boundary explicit', () => {
    // This is the single easiest claim for a summarizing assistant to
    // overstate, so the disclaimer has to travel with the capability.
    assert.match(llmsFull, /ica_hdx_accepted=false/)
    assert.match(llms, /ica_hdx_accepted=false/)
})

test('llms-full.txt states the limitations rather than only the strengths', () => {
    assert.match(llmsFull, /honest limitations/i)
    // Whitespace-tolerant: the file is hard-wrapped, so a claim can straddle a
    // newline.
    assert.match(llmsFull.replace(/\s+/g, ' '), /parity on success/i)
    assert.match(
        llmsFull.replace(/\s+/g, ' '),
        /not a capability claim|not superiority on accuracy/i
    )
})

test('llms.txt points at the canonical machine-readable status', () => {
    assert.ok(llms.includes(`${SITE}/status.json`))
    assert.ok(llms.includes(`${SITE}/llms-full.txt`))
})

test('published llms files never name a private individual as a customer', () => {
    // Customer outcomes are described by role and workflow, never by name.
    for (const [name, text] of [
        ['llms.txt', llms],
        ['llms-full.txt', llmsFull],
    ]) {
        assert.doesNotMatch(
            text,
            /\bDr\.\s+[A-Z][a-z]+/,
            `${name} must not name an individual customer`
        )
    }
})

// ---------------------------------------------------------------------------
// Structured data honesty
// ---------------------------------------------------------------------------

/**
 * components/StructuredData.js is an ESM + JSX source that Next transpiles.
 * Evaluate the non-JSX portion in a CommonJS sandbox so the honesty rules are
 * asserted against the REAL objects rather than against source text.
 */
function loadStructuredData() {
    const source = read('components/StructuredData.js')
    const cut = source.indexOf('export default function StructuredData')
    assert.ok(cut > 0, 'StructuredData default export must be last')
    const body = source
        .slice(0, cut)
        .replace(/^import status from .*$/m, '')
        .replace(/export (const|function)/g, '$1')
    const wrapped =
        `const status = ${JSON.stringify(status)};\n` +
        body +
        `\n;module.exports = { organizationNode, websiteNode, softwareApplicationNode, sourceCodeNode, siteEntityGraph, faqPageNode, articleNode, breadcrumbNode, webPageNode, assertNoFabricatedRatings, SAME_AS };`
    const module = { exports: {} }
    vm.runInNewContext(wrapped, {
        module,
        exports: module.exports,
        process: { env: { NODE_ENV: 'test' } },
    })
    return module.exports
}

const schema = loadStructuredData()

test('structured data carries no fabricated ratings or reviews', () => {
    // We have no verifiable first-party review corpus. Inventing one is both
    // dishonest and an explicit structured-data penalty risk.
    schema.assertNoFabricatedRatings(schema.siteEntityGraph)
    assert.throws(
        () =>
            schema.assertNoFabricatedRatings([
                { aggregateRating: { ratingValue: '5' } },
            ]),
        /refuses aggregateRating/
    )
})

test('the entity graph is internally consistent and resolvable', () => {
    const ids = new Set(schema.siteEntityGraph.map((node) => node['@id']))
    assert.ok(ids.has(`${SITE}/#organization`))
    assert.ok(ids.has(`${SITE}/#website`))
    assert.ok(ids.has(`${SITE}/#software`))
    assert.ok(ids.has(`${SITE}/#source-code`))

    // Every internal @id reference must resolve to a node in the graph.
    const serialized = JSON.stringify(schema.siteEntityGraph)
    for (const match of serialized.matchAll(/"@id":"(https:\/\/[^"]+)"/g)) {
        if (match[1].startsWith(`${SITE}/#`)) {
            assert.ok(
                ids.has(match[1]),
                `@id reference ${match[1]} has no node in the graph`
            )
        }
    }
})

test('sameAs lists only real first-party profiles', () => {
    assert.ok(schema.SAME_AS.length >= 5)
    for (const url of schema.SAME_AS) {
        assert.match(url, /^https:\/\//)
    }
    for (const required of [
        'https://github.com/OpenAdaptAI',
        'https://pypi.org/project/openadapt/',
        'https://www.linkedin.com/company/openadapt-ai',
    ]) {
        assert.ok(
            schema.SAME_AS.includes(required),
            `sameAs must include ${required}`
        )
    }
})

test('software schema versions and platforms follow status.json', () => {
    assert.equal(
        schema.softwareApplicationNode.softwareVersion,
        status.versions.launcher
    )
    assert.equal(schema.sourceCodeNode.version, status.versions.flow)
    const advertised = schema.softwareApplicationNode.operatingSystem
    for (const substrate of status.substrates) {
        if (!['Windows', 'macOS', 'Linux'].includes(substrate.name)) continue
        if (substrate.public_label === 'Available') {
            assert.ok(
                advertised.includes(substrate.name),
                `${substrate.name} is Available and should be advertised`
            )
        } else {
            assert.ok(
                !advertised.includes(substrate.name),
                `${substrate.name} is not Available and must not be advertised`
            )
        }
    }
})

test('the free offer describes the MIT engine, not the paid Cloud plan', () => {
    assert.equal(schema.softwareApplicationNode.offers.price, '0')
    assert.equal(schema.softwareApplicationNode.isAccessibleForFree, true)
    assert.equal(
        schema.softwareApplicationNode.license,
        'https://opensource.org/licenses/MIT'
    )
})

test('FAQ structured data refuses to invent questions', () => {
    assert.throws(
        () => schema.faqPageNode({ url: `${SITE}/compare`, items: [] }),
        /requires the rendered FAQ items/
    )
    const node = schema.faqPageNode({
        url: `${SITE}/compare`,
        items: [{ question: 'q', answer: 'a' }],
    })
    assert.equal(node['@type'], 'FAQPage')
    assert.equal(node.mainEntity[0].acceptedAnswer.text, 'a')
})

test('breadcrumb trails are ordered from the site root', () => {
    const node = schema.breadcrumbNode([
        { name: 'Home', path: '/' },
        { name: 'Compare', path: '/compare' },
        { name: 'UiPath', path: '/compare/uipath' },
    ])
    assert.deepEqual(
        node.itemListElement.map((item) => item.position),
        [1, 2, 3]
    )
    assert.equal(node.itemListElement[2].item, `${SITE}/compare/uipath`)
})
