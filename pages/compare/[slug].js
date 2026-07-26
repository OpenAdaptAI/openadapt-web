import Head from 'next/head'
import Link from 'next/link'

import Footer from '@components/Footer'
import {
    COMPARISONS,
    COMPARISON_LINKS,
    OPENADAPT_DIFFERENTIATORS,
    QUALIFICATION_EVIDENCE_URL,
} from '../../data/comparisons'

// Targeted alternative pages under /compare/<slug>. The overview table stays
// on /compare; these pages go deeper on one alternative at a time under the
// honesty rules documented in data/comparisons.js: credit the alternative's
// real strengths, differentiate only on what OpenAdapt actually does, and
// never lean on commoditized capabilities (recording, visual targeting,
// Citrix awareness, self-healing) as if they were unique.

export async function getStaticPaths() {
    return {
        paths: COMPARISONS.map(({ slug }) => ({ params: { slug } })),
        fallback: false,
    }
}

export async function getStaticProps({ params }) {
    const comparison = COMPARISONS.find(({ slug }) => slug === params.slug)
    return { props: { comparison } }
}

export default function ComparisonDetailPage({ comparison }) {
    const url = `https://openadapt.ai/compare/${comparison.slug}`
    const webPageSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: comparison.title,
        url,
        description: comparison.metaDescription,
        isPartOf: {
            '@type': 'WebSite',
            name: 'OpenAdapt.AI',
            url: 'https://openadapt.ai',
        },
        inLanguage: 'en',
    }

    return (
        <div className="min-h-screen bg-ground text-ink">
            <Head>
                <title>{`${comparison.title} | OpenAdapt`}</title>
                <meta
                    name="description"
                    content={comparison.metaDescription}
                />
                <link rel="canonical" href={url} />
                <meta property="og:title" content={comparison.title} />
                <meta
                    property="og:description"
                    content={comparison.metaDescription}
                />
                <meta property="og:url" content={url} />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(webPageSchema),
                    }}
                />
            </Head>

            <main className="mx-auto max-w-4xl px-4 py-14">
                <p className="eyebrow">
                    <Link href="/compare" className="text-accent">
                        Automation decision guide
                    </Link>
                </p>
                <h1 className="font-display mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-ink md:text-5xl">
                    {comparison.title}
                </h1>
                <p className="mt-5 max-w-3xl text-base leading-relaxed text-ink-2 md:text-lg">
                    {comparison.intro}
                </p>

                <section
                    className="mt-12"
                    aria-labelledby="their-strengths-heading"
                >
                    <h2
                        id="their-strengths-heading"
                        className="font-display text-2xl font-semibold tracking-tight text-ink"
                    >
                        {comparison.theirStrengths.heading}
                    </h2>
                    <ul className="mt-4 space-y-3">
                        {comparison.theirStrengths.items.map((item) => (
                            <li
                                key={item}
                                className="rounded-xl border border-hairline bg-panel p-4 text-sm leading-relaxed text-ink-2"
                            >
                                {item}
                            </li>
                        ))}
                    </ul>
                </section>

                <section
                    className="mt-12"
                    aria-labelledby="openadapt-differs-heading"
                >
                    <h2
                        id="openadapt-differs-heading"
                        className="font-display text-2xl font-semibold tracking-tight text-ink"
                    >
                        What OpenAdapt does differently
                    </h2>
                    <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-2 md:text-base">
                        These are the differences that hold up under scrutiny.
                        Recording demonstrations, visual targeting, virtual
                        desktop awareness, and selector repair are broadly
                        available across modern tools and are not claimed here
                        as unique.
                    </p>
                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                        {OPENADAPT_DIFFERENTIATORS.map((item) => (
                            <article
                                key={item.title}
                                className="rounded-2xl border border-hairline bg-panel p-5"
                            >
                                <h3 className="font-display text-lg font-semibold text-ink">
                                    {item.title}
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-ink-2">
                                    {item.body}
                                </p>
                            </article>
                        ))}
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-ink-3">
                        Per-surface acceptance results are published in the{' '}
                        <a
                            href={QUALIFICATION_EVIDENCE_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-accent"
                        >
                            qualification evidence
                        </a>
                        .
                    </p>
                </section>

                <section
                    className="mt-12 rounded-2xl border-2 border-ink bg-panel p-6 md:p-8"
                    aria-labelledby="which-to-choose-heading"
                >
                    <h2
                        id="which-to-choose-heading"
                        className="font-display text-2xl font-semibold tracking-tight text-ink"
                    >
                        Which should you choose?
                    </h2>
                    <div className="mt-5 grid gap-6 md:grid-cols-2">
                        <div>
                            <h3 className="font-display text-lg font-semibold text-ink">
                                Choose {comparison.name} when
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-ink-2">
                                {comparison.chooseThem}
                            </p>
                        </div>
                        <div>
                            <h3 className="font-display text-lg font-semibold text-ink">
                                Choose OpenAdapt when
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-ink-2">
                                {comparison.chooseUs}
                            </p>
                        </div>
                    </div>
                    <p className="mt-6 border-t border-hairline pt-4 text-sm leading-relaxed text-ink-3">
                        {comparison.honestNote}
                    </p>
                </section>

                <section className="mt-12" aria-labelledby="other-compares">
                    <h2
                        id="other-compares"
                        className="font-display text-xl font-semibold tracking-tight text-ink"
                    >
                        Other comparisons
                    </h2>
                    <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                        <li>
                            <Link href="/compare" className="text-accent">
                                Overview: compare all approaches
                            </Link>
                        </li>
                        {COMPARISON_LINKS.filter(
                            (link) => link.slug !== comparison.slug
                        ).map((link) => (
                            <li key={link.slug}>
                                <Link href={link.href} className="text-accent">
                                    {link.title}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </section>

                <section className="mt-12 rounded-2xl border border-hairline bg-panel p-6 text-center md:p-8">
                    <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
                        Test the difference on one real workflow.
                    </h2>
                    <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-ink-2 md:text-base">
                        Bring one repeated, consequential workflow and measure
                        authoring time, run time, intervention rate, and
                        incorrect-success rate against your current approach.
                    </p>
                    <div className="mt-5 flex flex-wrap justify-center gap-3">
                        <Link href="/qualify" className="btn-ink">
                            Qualify one workflow
                        </Link>
                        <a
                            href="https://docs.openadapt.ai/get-started/"
                            className="btn-ghost-ink"
                        >
                            Try the open-source runtime
                        </a>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}
