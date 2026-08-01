import Head from 'next/head'

import CommercialOffer from '@components/CommercialOffer'
import ContributeSection from '@components/ContributeSection'
import CustomerCaseStudy from '@components/CustomerCaseStudy'
import DashboardShowcase from '@components/DashboardShowcase'
import FinalQualificationCta from '@components/FinalQualificationCta'
import Footer from '@components/Footer'
import HowItWorksCondensed from '@components/HowItWorksCondensed'
import MastHead from '@components/MastHead'
import ProductStatus from '@components/ProductStatus'
import Qualification from '@components/Qualification'
import Reveal from '@components/Reveal'
import TrustSummary from '@components/TrustSummary'
import { OPENADAPT_STATS_SNAPSHOT } from '../data/repositoryStats'
import publishedRepositoryStats from '../utils/publishedRepositoryStats'

const { fetchPublishedRepositoryStats } = publishedRepositoryStats

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
        'The verified execution layer for consequential work trapped behind human interfaces. OpenAdapt governs UI-only work across browser, desktop, RDP, and Citrix.',
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
        'Desktop Automation',
        'Remote Desktop Automation',
        'Effect Verification',
        'Governed Automation',
    ],
    slogan: 'Automate the UI-only work your APIs cannot reach.',
}

const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'OpenAdapt',
    alternateName: 'OpenAdapt.AI',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Windows, macOS, Linux',
    description:
        'Governed execution for consequential UI-only work across browser, Windows, macOS, Linux, RDP, and Citrix, with identity gates, effect verification, and fail-closed outcomes.',
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
        'OpenAdapt automates UI-only work that APIs cannot reach, verifies the intended business effect, and halts when the execution contract cannot be proved.',
    publisher: {
        '@type': 'Organization',
        name: 'OpenAdapt.AI',
        url: 'https://openadapt.ai',
    },
    inLanguage: 'en',
}

export async function getStaticProps() {
    const { getHostedOffer } = await import('../lib/hostedOffer')
    // Seed static HTML from the durable same-origin cache rather than calling
    // GitHub during each build/ISR. Browser hydration keeps using that same
    // endpoint, and an outage falls back to the committed last-known counts.
    const [githubStats, hostedOffer] = await Promise.all([
        fetchPublishedRepositoryStats({
            fallback: OPENADAPT_STATS_SNAPSHOT,
        }),
        getHostedOffer(),
    ])
    return {
        props: { githubStats, hostedOffer },
        revalidate: 300,
    }
}

export default function Home({ githubStats, hostedOffer }) {
    const currentGithubStats = githubStats || OPENADAPT_STATS_SNAPSHOT
    const title = 'OpenAdapt — Verified execution for UI-only work'
    const description =
        'Automate consequential UI-only work across browser, desktop, RDP, and Citrix. OpenAdapt verifies the business effect and halts on uncertainty.'

    return (
        <div>
            <Head>
                <title>{title}</title>
                <meta name="description" content={description} />
                <link rel="canonical" href="https://openadapt.ai" />
                <meta property="og:title" content={title} />
                <meta property="og:description" content={description} />
                <meta property="og:url" content="https://openadapt.ai" />
                <meta name="twitter:title" content={title} />
                <meta name="twitter:description" content={description} />
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
            <MastHead githubStats={currentGithubStats} />
            <div id="customer-result">
                <Reveal>
                    <CustomerCaseStudy />
                </Reveal>
            </div>
            <Reveal><HowItWorksCondensed /></Reveal>
            <Reveal><Qualification /></Reveal>
            <Reveal><ProductStatus /></Reveal>
            <Reveal><CommercialOffer hostedOffer={hostedOffer} /></Reveal>
            <Reveal><DashboardShowcase /></Reveal>
            <Reveal><TrustSummary /></Reveal>
            {/*
             * Contribute-for-credits sits after the trust summary because it
             * is a commons / flywheel message that extends the open-source
             * trust story: sanitized contributions strengthen the shared
             * hardening corpus. It stays out of the hero, the commercial
             * offer, and the closing qualification CTA so it never interrupts
             * the buying narrative. Early access, opt-in, links to
             * /contribute.
             */}
            <Reveal><ContributeSection /></Reveal>
            <Reveal><FinalQualificationCta /></Reveal>
            <Footer repositoryStats={currentGithubStats} />
        </div>
    )
}
