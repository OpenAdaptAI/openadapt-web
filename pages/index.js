import { useRef, useState } from 'react'
import Head from 'next/head'

import ContactBookingSection from '@components/ContactBookingSection'
import DashboardShowcase from '@components/DashboardShowcase'
import Developers from '@components/Developers'
import DriftOutcomes from '@components/DriftOutcomes'
import EmailForm from '@components/EmailForm'
import Faq, { faqItems } from '@components/Faq'
import Footer from '@components/Footer'
import HowItWorks from '@components/HowItWorks'
import IndustriesGrid from '@components/IndustriesGrid'
import MastHead from '@components/MastHead'
import Pricing from '@components/Pricing'
import ProductStatus from '@components/ProductStatus'
import ProofBand from '@components/ProofBand'
import AudiencePaths from '@components/AudiencePaths'
import Reveal from '@components/Reveal'
import SafetyBand from '@components/SafetyBand'
// import SocialSection from '@components/SocialSection' // Temporarily disabled - feeds not working

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
        'Open-source governed compiler for repeated GUI work. OpenAdapt turns a recorded demonstration into a deterministic, locally executable workflow, proposes reviewable repairs under drift, and halts when configured verification fails.',
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
        'Open-source governed compiler for repeated GUI work. Record a browser workflow, compile it into a deterministic local program, and use configured verification to resolve, repair, or halt under interface drift.',
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
        'Open-source governed compiler: compile a bounded GUI demonstration into deterministic local replay, and resolve, review, or refuse interface drift.',
    publisher: {
        '@type': 'Organization',
        name: 'OpenAdapt.AI',
        url: 'https://openadapt.ai',
    },
    inLanguage: 'en',
}

const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
        },
    })),
}

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
    const [feedbackData, setFeedbackData] = useState({
        email: '',
        message: '',
    })

    const sectionRef = useRef(null)

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
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(faqSchema),
                    }}
                />
            </Head>
            <MastHead githubStats={githubStats} />
            <Reveal>
                <AudiencePaths />
            </Reveal>
            <Reveal>
                <DashboardShowcase />
            </Reveal>
            <Reveal>
                <HowItWorks showUseCases />
            </Reveal>
            <Reveal>
                <DriftOutcomes />
            </Reveal>
            <Reveal>
                <ProductStatus />
            </Reveal>
            <Reveal>
                <ProofBand />
            </Reveal>
            <Reveal>
                <SafetyBand />
            </Reveal>
            <Reveal>
                <IndustriesGrid
                    feedbackData={feedbackData}
                    setFeedbackData={setFeedbackData}
                    sectionRef={sectionRef}
                />
            </Reveal>
            <Reveal>
                <Pricing hostedOffer={hostedOffer} />
            </Reveal>
            <Reveal>
                <Developers
                    buildWarnings={buildWarnings}
                    githubStats={githubStats}
                />
            </Reveal>
            {/* <SocialSection /> */} {/* Temporarily disabled - feeds not working */}
            <Reveal>
                <Faq />
            </Reveal>
            <Reveal>
                <ContactBookingSection prefill={feedbackData} />
            </Reveal>
            <Reveal>
                <EmailForm />
            </Reveal>
            <Footer repositoryStats={githubStats} />
        </div>
    )
}
