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
        'MLDSAI Inc. builds OpenAdapt, an open-source demonstration compiler for desktop automation: record a workflow once and it compiles into a deterministic, self-healing script that runs on your own machines.',
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
        <div className="min-h-screen bg-[#06061f] text-white">
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
                <p className="text-sm font-medium uppercase tracking-widest text-[#60a5fa]">
                    About
                </p>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
                    About OpenAdapt
                </h1>
                <p className="mt-5 max-w-3xl text-base font-light text-white/75 md:text-lg">
                    OpenAdapt is an open-source demonstration compiler for
                    desktop automation. You record yourself doing a task once,
                    and it compiles that recording into a deterministic script
                    that replays on your own machines. Healthy runs make no
                    cloud model calls; a model is only invoked to heal the
                    script when the UI drifts, and the fix is proposed as a
                    reviewable diff. That&#39;s the whole idea, and everything
                    we build serves it.
                </p>

                <h2 className="mt-12 text-xl font-medium tracking-tight text-white/95">
                    Who&#39;s behind it
                </h2>
                <p className="mt-3 max-w-3xl text-sm font-light leading-relaxed text-white/75 md:text-base">
                    OpenAdapt is built by MLDSAI Inc., founded in Toronto in
                    2023. The founder is Richard Abrich, a machine learning
                    engineer who has been building OpenAdapt in the open since
                    the first commit. There&#39;s no stealth roadmap. The
                    issues, the pull requests, and the mistakes are all public
                    on GitHub.
                </p>

                <h2 className="mt-12 text-xl font-medium tracking-tight text-white/95">
                    Open source, actually
                </h2>
                <p className="mt-3 max-w-3xl text-sm font-light leading-relaxed text-white/75 md:text-base">
                    The code lives in the{' '}
                    <a
                        href="https://github.com/OpenAdaptAI"
                        className="text-[#60a5fa] hover:underline"
                    >
                        OpenAdaptAI organization on GitHub
                    </a>
                    , split into focused packages: openadapt-capture for
                    cross-platform recording, openadapt-privacy for PII/PHI
                    scrubbing, openadapt-ml for models, and the{' '}
                    <a
                        href="https://pypi.org/project/openadapt/"
                        className="text-[#60a5fa] hover:underline"
                    >
                        openadapt meta-package on PyPI
                    </a>{' '}
                    that ties them together. Everything is MIT-licensed. Use
                    it, fork it, ship it, no permission needed.
                </p>

                <h2 className="mt-12 text-xl font-medium tracking-tight text-white/95">
                    How to reach us
                </h2>
                <p className="mt-3 max-w-3xl text-sm font-light leading-relaxed text-white/75 md:text-base">
                    Email{' '}
                    <a
                        href="mailto:hello@openadapt.ai"
                        className="text-[#60a5fa] hover:underline"
                    >
                        hello@openadapt.ai
                    </a>{' '}
                    and a person will reply. For bugs and feature requests,
                    open an issue on{' '}
                    <a
                        href="https://github.com/OpenAdaptAI/OpenAdapt"
                        className="text-[#60a5fa] hover:underline"
                    >
                        GitHub
                    </a>
                    . For everything else, there&#39;s{' '}
                    <a
                        href="https://discord.gg/yF527cQbDG"
                        className="text-[#60a5fa] hover:underline"
                    >
                        Discord
                    </a>
                    .
                </p>

                <div className="mt-12 rounded-2xl border border-[#560df8]/40 bg-[#560df8]/10 p-6 text-center md:p-8">
                    <h2 className="text-xl font-medium tracking-tight text-white/95">
                        Talk to us
                    </h2>
                    <p className="mx-auto mt-3 max-w-2xl text-sm font-light text-white/75 md:text-base">
                        If you&#39;ve got a repetitive desktop workflow, bring
                        it to a 15-minute call and we&#39;ll tell you whether
                        compiling it makes sense.
                    </p>
                    <Link
                        href="/#book"
                        className="mt-5 inline-block rounded-lg bg-[#560df8] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[#7132d4]"
                    >
                        Book a demo
                    </Link>
                </div>
            </div>

            <Footer />
        </div>
    )
}
