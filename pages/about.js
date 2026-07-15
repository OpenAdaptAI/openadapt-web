import Head from 'next/head'
import Link from 'next/link'

import Footer from '@components/Footer'

const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'MLDSAI Inc.',
    alternateName: ['OpenAdapt.AI', 'OpenAdapt'],
    url: 'https://openadapt.ai',
    logo: {
        '@type': 'ImageObject',
        url: 'https://openadapt.ai/android-chrome-512x512.png',
        width: 512,
        height: 512,
    },
    description:
        'MLDSAI Inc. builds OpenAdapt, an open-source demonstration compiler for GUI automation: record a workflow once, compile it into deterministic replay, and resolve, review, or refuse interface drift under configured verification.',
    foundingDate: '2023',
    address: {
        '@type': 'PostalAddress',
        addressLocality: 'Toronto',
        addressRegion: 'ON',
        addressCountry: 'CA',
    },
    email: 'hello@openadapt.ai',
    founder: {
        '@type': 'Person',
        name: 'Richard Abrich',
        url: 'https://github.com/abrichr',
    },
    sameAs: [
        'https://github.com/OpenAdaptAI',
        'https://www.linkedin.com/company/openadapt-ai',
        'https://x.com/OpenAdaptAI',
        'https://discord.gg/yF527cQbDG',
        'https://pypi.org/project/openadapt/',
    ],
}

const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Richard Abrich',
    jobTitle: 'Founder',
    worksFor: {
        '@type': 'Organization',
        name: 'MLDSAI Inc.',
        url: 'https://openadapt.ai',
    },
    sameAs: ['https://github.com/abrichr'],
}

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-ground text-ink">
            <Head>
                <title>About OpenAdapt | MLDSAI Inc.</title>
                <meta
                    name="description"
                    content="OpenAdapt is an open-source demonstration compiler for desktop automation, built in the open by MLDSAI Inc. in Toronto since 2023. MIT-licensed, developed on GitHub, published on PyPI."
                />
                <link rel="canonical" href="https://openadapt.ai/about" />
                <meta property="og:title" content="About OpenAdapt | MLDSAI Inc." />
                <meta
                    property="og:description"
                    content="Who builds OpenAdapt, why it's open source, and how to reach us."
                />
                <meta property="og:url" content="https://openadapt.ai/about" />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(organizationSchema),
                    }}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(personSchema),
                    }}
                />
            </Head>

            <div className="mx-auto max-w-4xl px-4 py-14">
                <p className="eyebrow">
                    About
                </p>
                <h1 className="font-display mt-3 text-3xl font-semibold tracking-tight text-ink md:text-4xl">
                    About OpenAdapt
                </h1>
                <p className="mt-5 max-w-3xl text-base text-ink-2 md:text-lg">
                    OpenAdapt is an open-source demonstration compiler for
                    desktop automation. You record yourself doing a task once,
                    and it compiles that recording into a script that replays
                    on your own machines. Healthy runs make no
                    cloud model calls. When the UI drifts, retained evidence
                    may deterministically re-resolve the target; optional AI
                    may propose a repair, and configured verification can halt
                    instead. Repairs are governed, reviewable diffs rather
                    than an unconstrained promise of self-healing.
                </p>

                <h2 className="mt-12 font-display text-xl font-semibold tracking-tight text-ink">
                    Who&#39;s behind it
                </h2>
                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-2 md:text-base">
                    OpenAdapt is built by MLDSAI Inc., founded in Toronto in
                    2023. The founder is Richard Abrich, a machine learning
                    engineer who has been building OpenAdapt in the open since
                    the first commit. There&#39;s no stealth roadmap. The
                    issues, the pull requests, and the mistakes are all public
                    on GitHub.
                </p>

                <h2 className="mt-12 font-display text-xl font-semibold tracking-tight text-ink">
                    Open source, actually
                </h2>
                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-2 md:text-base">
                    The code lives in the{' '}
                    <a
                        href="https://github.com/OpenAdaptAI"
                        className="text-accent hover:underline"
                    >
                        OpenAdaptAI organization on GitHub
                    </a>
                    , split into focused packages: openadapt-capture for
                    cross-platform recording, openadapt-privacy for PII/PHI
                    scrubbing, openadapt-ml for models, and the{' '}
                    <a
                        href="https://pypi.org/project/openadapt/"
                        className="text-accent hover:underline"
                    >
                        openadapt meta-package on PyPI
                    </a>{' '}
                    that ties them together. Everything is MIT-licensed. Use
                    it, fork it, ship it, no permission needed.
                </p>

                <h2 className="mt-12 font-display text-xl font-semibold tracking-tight text-ink">
                    How to reach us
                </h2>
                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-2 md:text-base">
                    Email{' '}
                    <a
                        href="mailto:hello@openadapt.ai"
                        className="text-accent hover:underline"
                    >
                        hello@openadapt.ai
                    </a>{' '}
                    and a person will reply. For bugs and feature requests,
                    open an issue on{' '}
                    <a
                        href="https://github.com/OpenAdaptAI/OpenAdapt"
                        className="text-accent hover:underline"
                    >
                        GitHub
                    </a>
                    . For everything else, there&#39;s{' '}
                    <a
                        href="https://discord.gg/yF527cQbDG"
                        className="text-accent hover:underline"
                    >
                        Discord
                    </a>
                    .
                </p>

                <div className="mt-12 rounded-2xl border-2 border-ink bg-panel p-6 text-center md:p-8">
                    <h2 className="font-display text-xl font-semibold tracking-tight text-ink">
                        Talk to us
                    </h2>
                    <p className="mx-auto mt-3 max-w-2xl text-sm text-ink-2 md:text-base">
                        If you&#39;ve got a repetitive desktop workflow, bring
                        it to a 30-minute call and we&#39;ll tell you whether
                        compiling it makes sense.
                    </p>
                    <Link
                        href="/#book"
                        className="btn-ink mt-5 inline-block"
                    >
                        Book a demo
                    </Link>
                </div>
            </div>

            <Footer />
        </div>
    )
}
