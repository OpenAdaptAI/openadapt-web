import Head from 'next/head'

import BusinessDecisionPreview from '@components/BusinessDecisionPreview'
import CommercialOffer from '@components/CommercialOffer'
import CustomerCaseStudy from '@components/CustomerCaseStudy'
import DashboardShowcase from '@components/DashboardShowcase'
import FinalQualificationCta from '@components/FinalQualificationCta'
import Footer from '@components/Footer'
import HowItWorksCondensed from '@components/HowItWorksCondensed'
import MastHead from '@components/MastHead'
import NewsletterCapture from '@components/NewsletterCapture'
import ProductStatus from '@components/ProductStatus'
import Qualification from '@components/Qualification'
import ReplayHero from '@components/ReplayHero'
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
        'Verified automation from demonstration. OpenAdapt compiles repeated work into deterministic programs and verifies the result before it reports success.',
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
    slogan: 'Automate the work your systems still make people do.',
}

const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'OpenAdapt',
    alternateName: 'OpenAdapt.AI',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Windows, macOS, Linux',
    description:
        'OpenAdapt compiles demonstrated work into deterministic programs for browser, Windows, macOS, Linux, RDP, and Citrix, then verifies the declared result.',
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
        'Compile a demonstrated GUI workflow into an inspectable program',
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
        'OpenAdapt turns demonstrated GUI work into deterministic automation and verifies the result before it reports success.',
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
    const title = 'OpenAdapt: Verified automation from demonstration'
    const description =
        'Automate the work your systems still make people do. OpenAdapt compiles a demonstration into a deterministic program and verifies the result.'

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
            <section
                id="demo"
                className="border-b border-hairline bg-panel px-5 py-20 md:py-28"
            >
                <div className="mx-auto max-w-5xl">
                    <div className="mx-auto mb-9 max-w-3xl text-center">
                        <p className="eyebrow">See it run</p>
                        <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink md:text-3xl">
                            From a demonstrated task to a verified result
                        </h2>
                        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-ink-2 md:text-base">
                            Watch the source demonstration, the compiled replay,
                            and the independent result check in three real
                            applications.
                        </p>
                    </div>
                    <ReplayHero />
                    <BusinessDecisionPreview />
                </div>
            </section>
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
            <Reveal><FinalQualificationCta /></Reveal>
            <NewsletterCapture location="newsletter_home" />
            <Footer repositoryStats={currentGithubStats} />
        </div>
    )
}
