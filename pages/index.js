import { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'

import CompiledProgramSection from '@components/CompiledProgramSection'
import ContactBookingSection from '@components/ContactBookingSection'
import DashboardShowcase from '@components/DashboardShowcase'
import Developers from '@components/Developers'
import DriftOutcomes from '@components/DriftOutcomes'
import EmailForm from '@components/EmailForm'
import Footer from '@components/Footer'
import HomeReferenceWorkflow from '@components/HomeReferenceWorkflow'
import HowItWorksCondensed from '@components/HowItWorksCondensed'
import MastHead from '@components/MastHead'
import Pricing from '@components/Pricing'
import ProductStatus from '@components/ProductStatus'
import Qualification from '@components/Qualification'
import Reveal from '@components/Reveal'
import { DEFAULT_VERTICAL, VERTICAL_KEYS } from '../data/referenceWorkflows'

const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'OpenAdapt.AI',
    alternateName: ['OpenAdapt', 'MLDSAI Inc.'],
    url: 'https://openadapt.ai',
    logo: {
        '@type': 'ImageObject',
        url: 'https://openadapt.ai/android-chrome-512x512.png',
        width: 512,
        height: 512,
    },
    description:
        'Open-source governed workflow compiler for repeated GUI work. OpenAdapt turns a recorded demonstration into a deterministic, locally executable workflow, proposes reviewable repairs under drift, and halts when configured verification fails.',
    foundingDate: '2023',
    sameAs: [
        'https://github.com/OpenAdaptAI/OpenAdapt',
        'https://x.com/OpenAdaptAI',
        'https://www.linkedin.com/company/openadapt-ai',
        'https://discord.gg/yF527cQbDG',
        'https://pypi.org/project/openadapt/',
    ],
    knowsAbout: [
        'GUI Automation',
        'Robotic Process Automation',
        'AI Agents',
        'Desktop Automation',
        'Machine Learning',
        'Large Language Models',
    ],
    slogan: 'Demonstrate a bounded workflow. Replay deterministically. Repair under governance.',
}

const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'OpenAdapt',
    alternateName: 'OpenAdapt.AI',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Windows, macOS, Linux (browser workflow path)',
    description:
        'Open-source governed workflow compiler for repeated GUI work. Record a browser workflow, compile it into a deterministic local program, and use configured verification to resolve, repair, or halt under interface drift.',
    url: 'https://openadapt.ai',
    downloadUrl: 'https://pypi.org/project/openadapt/',
    author: {
        '@type': 'Organization',
        name: 'OpenAdapt.AI',
        url: 'https://openadapt.ai',
    },
    license: 'https://opensource.org/licenses/MIT',
    codeRepository: 'https://github.com/OpenAdaptAI/OpenAdapt',
    programmingLanguage: 'Python',
    offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
    },
    featureList: [
        'Compile a demonstrated, bounded GUI workflow',
        'Compile demonstrations into editable automation scripts',
        'Local replay with zero per-run model cost',
        'Deterministic UI re-resolution with auditable bundle updates',
        'Optional AI-assisted repair subject to configured verification and policy',
        'Original recordings stay local; approved sanitized derivatives may cross policy-approved boundaries',
        'Local review and hash-bound approval for sanitized derivatives',
        'Illustrated audit report for every run',
    ],
    isAccessibleForFree: true,
}

const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'OpenAdapt.AI',
    alternateName: 'OpenAdapt',
    url: 'https://openadapt.ai',
    description:
        'Open-source governed workflow compiler: compile a bounded GUI demonstration into deterministic local replay, and resolve, repair, or halt interface drift.',
    publisher: {
        '@type': 'Organization',
        name: 'OpenAdapt.AI',
        url: 'https://openadapt.ai',
    },
    inLanguage: 'en',
}

const referenceLinks = [
    {
        key: 'healthcare',
        label: 'Healthcare workflow reference',
        href: '/solutions/healthcare',
    },
    {
        key: 'lending',
        label: 'Lending operations reference',
        href: '/solutions/lending',
    },
    {
        key: 'insurance',
        label: 'Insurance claims reference',
        href: '/solutions/insurance',
    },
]

export async function getStaticProps() {
    // Seed the initial HTML with the shared cached/verified repository stats.
    // The footer may refresh through our same-origin endpoint after hydration.
    const { getOpenIssuesByLabel } = await import('../lib/githubApi')
    const { getOpenAdaptRepositoryStats } = await import(
        '../lib/openAdaptRepositoryStats'
    )
    const [githubStats, buildWarnings] = await Promise.all([
        getOpenAdaptRepositoryStats(),
        // Known engine breakage surfaced server-side so visitor browsers
        // never call api.github.com (60 req/hr per IP → 403s on shared IPs).
        getOpenIssuesByLabel('OpenAdaptAI/openadapt-flow', 'main-broken'),
    ])
    const { getHostedOffer } = await import('../lib/hostedOffer')
    const hostedOffer = await getHostedOffer()
    return {
        props: { githubStats, buildWarnings, hostedOffer },
        revalidate: 300,
    }
}

export default function Home({ githubStats, buildWarnings, hostedOffer }) {
    const router = useRouter()
    // ONE lifted selection shared by every reference-aware homepage section:
    // the process/reference-workflow demo and the "More reference workflows"
    // list read and write this single vertical, so choosing a vertical in one
    // updates the other. The ?ref= query param makes the choice shareable and
    // lets other surfaces (the Cloud preview, the solution pages) deep-link a
    // vertical into the homepage.
    const [vertical, setVertical] = useState(DEFAULT_VERTICAL)

    useEffect(() => {
        const requested = router.query.ref
        if (typeof requested === 'string' && VERTICAL_KEYS.includes(requested)) {
            setVertical(requested)
        }
    }, [router.query.ref])

    const selectVertical = (key) => {
        if (!VERTICAL_KEYS.includes(key)) return
        setVertical(key)
        // Reflect the choice in the URL without a scroll jump or full
        // navigation so the selection stays shareable and in sync.
        router.replace(
            { pathname: router.pathname, query: { ...router.query, ref: key } },
            undefined,
            { shallow: true, scroll: false }
        )
    }

    return (
        <div>
            <Head>
                <link rel="canonical" href="https://openadapt.ai" />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(organizationSchema),
                    }}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(softwareSchema),
                    }}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(websiteSchema),
                    }}
                />
            </Head>
            <MastHead githubStats={githubStats} />
            <Reveal>
                <HowItWorksCondensed />
            </Reveal>
            <Reveal>
                <HomeReferenceWorkflow
                    vertical={vertical}
                    onSelectVertical={selectVertical}
                />
            </Reveal>
            <section
                id="references"
                className="border-b border-hairline bg-panel px-5 py-10"
            >
                <div className="mx-auto max-w-5xl text-center">
                    <p className="eyebrow">More reference workflows</p>
                    <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-ink-2">
                        Each reference is a bounded, synthetic fixture with its
                        own honest evidence and caveats. Select one to preview
                        it above.
                    </p>
                    <div
                        className="mt-5 flex flex-wrap items-center justify-center gap-3 text-sm"
                        role="group"
                        aria-label="Reference workflow vertical"
                    >
                        {referenceLinks.map((reference) => {
                            const active = reference.key === vertical
                            return (
                                <span
                                    key={reference.href}
                                    className="inline-flex items-center gap-3"
                                >
                                    <button
                                        type="button"
                                        aria-pressed={active}
                                        data-testid={`reference-link-${reference.key}`}
                                        onClick={() =>
                                            selectVertical(reference.key)
                                        }
                                        className={
                                            active
                                                ? 'rounded-full border border-accent bg-ground px-4 py-1.5 font-medium text-ink shadow-[inset_0_0_0_1px_var(--accent)]'
                                                : 'rounded-full border border-hairline bg-panel px-4 py-1.5 font-medium text-ink-2 hover:border-ink-3'
                                        }
                                    >
                                        {reference.label}
                                    </button>
                                    <Link
                                        href={reference.href}
                                        className="text-accent hover:underline"
                                    >
                                        Open
                                    </Link>
                                </span>
                            )
                        })}
                    </div>
                    <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-ink-2">
                        Want the full method and evidence?{' '}
                        <Link
                            href="/research"
                            className="text-accent hover:underline"
                        >
                            Read the technical paper
                        </Link>
                        .
                    </p>
                </div>
            </section>
            {/*
             * OpenAdapt Cloud is surfaced UPPER-MIDDLE — right after the
             * reference-workflow sections — so "there is a hosted product you
             * can start now" is visible mid-page. The DashboardShowcase is the
             * condensed hosted-product teaser (real Cloud footage + "Open the
             * Cloud app" / "See launch plans"); the full Pricing detail stays
             * lower.
             */}
            <Reveal>
                <DashboardShowcase />
            </Reveal>
            <Reveal>
                <CompiledProgramSection />
            </Reveal>
            <Reveal>
                <DriftOutcomes />
            </Reveal>
            <Reveal>
                <ProductStatus />
            </Reveal>
            <Reveal>
                <Pricing hostedOffer={hostedOffer} />
            </Reveal>
            {/*
             * Buyer qualification ("use APIs first / UI-only last mile") sits
             * LOW, next to the /compare link it feeds — the page leads with
             * value and qualifies later. A brief positive-fit line lives in the
             * hero; the full fit criteria and the RPA / agent / recorder
             * breakdown live here and on /compare.
             */}
            <Reveal>
                <Qualification />
            </Reveal>
            <Reveal>
                <ContactBookingSection />
            </Reveal>
            <Reveal>
                <Developers
                    buildWarnings={buildWarnings}
                    githubStats={githubStats}
                />
            </Reveal>
            <Reveal>
                <EmailForm />
            </Reveal>
            <Footer repositoryStats={githubStats} />
        </div>
    )
}
