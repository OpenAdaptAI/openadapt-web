/**
 * Canonical JSON-LD for AI and search discoverability.
 *
 * Why this file exists
 * --------------------
 * Structured data was previously defined inline, per page, with slightly
 * different Organization objects on `/` and `/about` and no shared `@id`. AI
 * assistants and search engines resolve entities by `@id`; duplicated,
 * unlinked copies read as several different companies rather than one. This
 * module owns one entity graph so every page can reference the same nodes.
 *
 * Hard rules enforced by `tests/aiDiscoverability.test.js`:
 *
 * - NO `aggregateRating`, `review`, `ratingValue`, or `reviewCount` anywhere.
 *   We have no verifiable first-party review corpus. Fabricated rating markup
 *   is dishonest and is an explicit Google structured-data penalty risk.
 * - Every claim here must be true against shipped reality. Substrate and
 *   version facts are read from `public/status.json`, which is the canonical
 *   machine-readable source of truth, so this file cannot promote a substrate
 *   above what that manifest says.
 * - `sameAs` lists only profiles that actually exist and that we control.
 *
 * Usage (one line per page, no other page changes required):
 *
 *   import StructuredData, { organizationNode, webPageNode } from '@components/StructuredData'
 *   ...
 *   <Head>
 *     <StructuredData nodes={[organizationNode, webPageNode({ ... })]} />
 *   </Head>
 *
 * `StructuredData` emits a single `@graph` script rather than N scripts, which
 * is what lets consumers resolve the cross-references between nodes.
 */

import status from '../public/status.json'

export const SITE_URL = 'https://openadapt.ai'

export const ORGANIZATION_ID = `${SITE_URL}/#organization`
export const WEBSITE_ID = `${SITE_URL}/#website`
export const SOFTWARE_ID = `${SITE_URL}/#software`
export const SOURCE_CODE_ID = `${SITE_URL}/#source-code`

/**
 * Real, first-party profiles only. Each of these is linked from the site
 * footer or the GitHub organization, so an assistant can corroborate the
 * entity from more than one direction. Do not add a profile here that we do
 * not actually control or that does not resolve.
 */
export const SAME_AS = [
    'https://github.com/OpenAdaptAI',
    'https://github.com/OpenAdaptAI/OpenAdapt',
    'https://pypi.org/project/openadapt/',
    'https://www.linkedin.com/company/openadapt-ai',
    'https://x.com/OpenAdaptAI',
    'https://discord.gg/yF527cQbDG',
]

export const organizationNode = {
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: 'OpenAdapt.AI',
    legalName: 'MLDSAI Inc.',
    alternateName: ['OpenAdapt', 'OpenAdapt AI', 'MLDSAI Inc.'],
    url: SITE_URL,
    logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/android-chrome-512x512.png`,
        width: 512,
        height: 512,
    },
    image: `${SITE_URL}/og.png`,
    description:
        'OpenAdapt builds an open-source governed workflow compiler and runtime for repeated GUI work in applications without a usable API. A demonstrated task is compiled into a deterministic local program; healthy runs make no model calls; every consequential run ends verified or halted with a preserved report.',
    foundingDate: '2023',
    sameAs: SAME_AS,
    knowsAbout: [
        'GUI automation',
        'Robotic process automation',
        'Desktop automation',
        'Remote desktop and Citrix automation',
        'Business-effect verification',
        'Governed computer use',
        'Healthcare revenue cycle automation',
        'Electronic health record workflow automation',
    ],
    slogan: 'Automate the UI-only work your APIs cannot reach.',
}

export const websiteNode = {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: 'OpenAdapt.AI',
    alternateName: 'OpenAdapt',
    url: SITE_URL,
    description:
        'OpenAdapt compiles demonstrated GUI workflows into deterministic, locally executable programs, verifies the intended business effect against the system of record, and halts when the execution contract cannot be proved.',
    publisher: { '@id': ORGANIZATION_ID },
    inLanguage: 'en',
}

/**
 * Operating systems are derived from the status manifest rather than
 * hard-coded, so this can never advertise a substrate the manifest does not
 * list as released.
 */
const releasedDesktopSubstrates = status.substrates
    .filter((substrate) =>
        ['Windows', 'macOS', 'Linux'].includes(substrate.name)
    )
    .filter((substrate) => substrate.public_label === 'Available')
    .map((substrate) => substrate.name)

export const softwareApplicationNode = {
    '@type': 'SoftwareApplication',
    '@id': SOFTWARE_ID,
    name: 'OpenAdapt',
    alternateName: 'OpenAdapt.AI',
    applicationCategory: 'BusinessApplication',
    applicationSubCategory: 'Robotic Process Automation',
    operatingSystem: releasedDesktopSubstrates.join(', '),
    softwareVersion: status.versions.launcher,
    url: SITE_URL,
    description:
        'Open-source Beta governed workflow compiler and runtime. Demonstrate a bounded, repeated GUI task once; OpenAdapt compiles it into a deterministic local program, replays it with zero model calls on healthy runs, and re-resolves, proposes a reviewable repair, or halts when the interface drifts. Runs on browser, Windows, macOS, Linux, RDP, and Citrix/VDI surfaces. Production use qualifies the exact workflow, application, environment, identity contract, and effect verifier.',
    downloadUrl: 'https://pypi.org/project/openadapt/',
    installUrl: `${SITE_URL}/download`,
    softwareHelp: { '@type': 'CreativeWork', url: 'https://docs.openadapt.ai' },
    author: { '@id': ORGANIZATION_ID },
    publisher: { '@id': ORGANIZATION_ID },
    license: 'https://opensource.org/licenses/MIT',
    codeRepository: 'https://github.com/OpenAdaptAI/openadapt-flow',
    programmingLanguage: 'Python',
    isAccessibleForFree: true,
    // The MIT engine really is $0. The $500/month managed Cloud subscription is
    // a separate product and is described on /pricing; it is deliberately not
    // folded into this offer, because that would misstate what a reader gets
    // for free.
    offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        url: `${SITE_URL}/start`,
    },
    featureList: [
        'Compile one recorded demonstration of a bounded GUI task into a deterministic, reviewable program',
        'Replay locally with zero model calls on healthy runs',
        'Re-resolve a drifted target from structure, template, OCR, and geometry evidence before any model is consulted',
        'Re-check record identity against a freshly captured frame immediately before each consequential input',
        'Verify the intended business effect out-of-band against the system of record rather than trusting the acting session',
        'End every consequential run verified or halted, with a preserved run report',
        'Keep recordings, screenshots, and compiled bundles inside the customer boundary; egress only an approved, hash-bound sanitized derivative',
        'Execute on browser, Windows UI Automation, macOS Accessibility, Linux AT-SPI, RDP, and Citrix/VDI surfaces',
    ],
}

export const sourceCodeNode = {
    '@type': 'SoftwareSourceCode',
    '@id': SOURCE_CODE_ID,
    name: 'openadapt-flow',
    description:
        'The canonical OpenAdapt compiler and governed runtime: compilation, the deterministic resolution ladder, identity and effect verification, policy gates, run reports, and every substrate backend.',
    codeRepository: 'https://github.com/OpenAdaptAI/openadapt-flow',
    programmingLanguage: {
        '@type': 'ComputerLanguage',
        name: 'Python',
    },
    runtimePlatform: 'Python 3.10+',
    license: 'https://opensource.org/licenses/MIT',
    author: { '@id': ORGANIZATION_ID },
    version: status.versions.flow,
    targetProduct: { '@id': SOFTWARE_ID },
    codeSampleType: 'full solution',
}

/**
 * A WebPage node bound to the shared site/organization graph.
 */
export function webPageNode({ url, name, description, primaryTopic }) {
    return {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name,
        description,
        isPartOf: { '@id': WEBSITE_ID },
        publisher: { '@id': ORGANIZATION_ID },
        ...(primaryTopic ? { about: { '@id': primaryTopic } } : {}),
        inLanguage: 'en',
    }
}

/**
 * FAQPage built ONLY from question/answer pairs that are actually rendered on
 * the page. Google requires the visible page to contain the same Q&A, and
 * inventing questions here would be both a policy violation and a lie.
 */
export function faqPageNode({ url, items }) {
    if (!Array.isArray(items) || items.length === 0) {
        throw new Error('faqPageNode requires the rendered FAQ items')
    }
    return {
        '@type': 'FAQPage',
        '@id': `${url}#faq`,
        url,
        isPartOf: { '@id': WEBSITE_ID },
        mainEntity: items.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer,
            },
        })),
    }
}

/**
 * Article node for blog posts and the customer case study.
 *
 * `author` defaults to the organization. Pass an explicit author only when a
 * named person has agreed to be named publicly.
 */
export function articleNode({
    url,
    headline,
    description,
    datePublished,
    dateModified,
    image,
    author,
    articleSection,
}) {
    return {
        '@type': 'Article',
        '@id': `${url}#article`,
        url,
        mainEntityOfPage: url,
        headline,
        description,
        datePublished,
        dateModified: dateModified || datePublished,
        image: image || `${SITE_URL}/og.png`,
        author: author || { '@id': ORGANIZATION_ID },
        publisher: { '@id': ORGANIZATION_ID },
        isPartOf: { '@id': WEBSITE_ID },
        ...(articleSection ? { articleSection } : {}),
        inLanguage: 'en',
    }
}

/**
 * TechArticle is the better type for documentation-style explainers; AI
 * assistants weight it slightly differently from a general Article.
 */
export function techArticleNode(args) {
    return { ...articleNode(args), '@type': 'TechArticle' }
}

/**
 * A commercially offered service with a published price.
 *
 * This is the entity type AI assistants resolve when someone asks "who does X
 * for Y, and what does it cost". Every field must restate something the page
 * itself says: the price is the price rendered on the page, and nothing here
 * may imply customers, results, or availability the offer does not have.
 *
 * `availability` is deliberately `LimitedAvailability` for a capacity-bounded
 * cohort offer — that is the honest schema value, and it is also the true one.
 */
export function serviceNode({
    url,
    name,
    description,
    serviceType,
    price,
    priceCurrency = 'USD',
    billingDuration,
    availability = 'https://schema.org/LimitedAvailability',
}) {
    return {
        '@type': 'Service',
        '@id': `${url}#service`,
        url,
        name,
        description,
        serviceType,
        provider: { '@id': ORGANIZATION_ID },
        isRelatedTo: { '@id': SOFTWARE_ID },
        offers: {
            '@type': 'Offer',
            url,
            price: String(price),
            priceCurrency,
            availability,
            ...(billingDuration
                ? {
                      priceSpecification: {
                          '@type': 'UnitPriceSpecification',
                          price: String(price),
                          priceCurrency,
                          billingDuration,
                          unitCode: 'MON',
                      },
                  }
                : {}),
        },
    }
}

/**
 * BreadcrumbList. Nothing on this site emits breadcrumbs today, which costs
 * hierarchy signal on the nested /compare/*, /solutions/*, /templates/*, and
 * /customers/* routes.
 *
 * @param {Array<{name: string, path: string}>} trail - ordered, root first.
 */
export function breadcrumbNode(trail) {
    return {
        '@type': 'BreadcrumbList',
        itemListElement: trail.map((crumb, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: crumb.name,
            item: `${SITE_URL}${crumb.path}`,
        })),
    }
}

/**
 * The full entity graph. Include this on the homepage and on any page that
 * should assert the whole entity, and use the narrower nodes elsewhere.
 */
export const siteEntityGraph = [
    organizationNode,
    websiteNode,
    softwareApplicationNode,
    sourceCodeNode,
]

const FORBIDDEN_KEYS = [
    'aggregateRating',
    'review',
    'ratingValue',
    'reviewCount',
    'ratingCount',
]

/**
 * Fail loudly rather than shipping fabricated trust markup. This runs at render
 * time in development and is asserted directly in the unit tests.
 */
export function assertNoFabricatedRatings(nodes) {
    const serialized = JSON.stringify(nodes)
    for (const key of FORBIDDEN_KEYS) {
        if (serialized.includes(`"${key}"`)) {
            throw new Error(
                `StructuredData refuses ${key}: OpenAdapt has no verifiable first-party review corpus, and fabricated rating markup is a penalty risk.`
            )
        }
    }
}

export default function StructuredData({ nodes }) {
    const graph = Array.isArray(nodes) ? nodes : [nodes]
    if (process.env.NODE_ENV !== 'production') {
        assertNoFabricatedRatings(graph)
    }
    const payload = {
        '@context': 'https://schema.org',
        '@graph': graph,
    }
    return (
        <script
            type="application/ld+json"
            data-testid="structured-data"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
        />
    )
}
