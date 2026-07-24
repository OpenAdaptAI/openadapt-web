import Head from 'next/head'

import CommercialOffer from '@components/CommercialOffer'
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
import useRepositoryStats from 'hooks/useRepositoryStats'
import { OPENADAPT_STATS_SNAPSHOT } from '../data/repositoryStats'

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
    // Seed initial HTML with the verified snapshot. One shared same-origin
    // endpoint refreshes Footer counts after hydration; keeping GitHub stats
    // out of this five-minute ISR avoids duplicate unauthenticated API calls.
    const githubStats = OPENADAPT_STATS_SNAPSHOT
    const { getHostedOffer } = await import('../lib/hostedOffer')
    const hostedOffer = await getHostedOffer()
    return {
        props: { githubStats, hostedOffer },
        revalidate: 300,
    }
}

export default function Home({ githubStats, hostedOffer }) {
    // Home owns the one live repository-stats request so every social-proof
    // consumer updates atomically. Footer polling is disabled on this route;
    // other pages let their Footer own the same shared hook.
    const currentGithubStats = useRepositoryStats(githubStats)

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
            <MastHead githubStats={currentGithubStats} />
            <div id="verified-execution">
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
            <Footer
                repositoryStats={currentGithubStats}
                pollRepositoryStats={false}
            />
        </div>
    )
}
