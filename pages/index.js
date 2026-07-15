import { useRef, useState } from 'react'
import Head from 'next/head'

import ContactBookingSection from '@components/ContactBookingSection'
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
        'https://github.com/OpenAdaptAI/openadapt-flow',
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
    slogan: 'Record once. Replay deterministically. Repair under governance.',
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
    codeRepository: 'https://github.com/OpenAdaptAI/openadapt-flow',
    programmingLanguage: 'Python',
    offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
    },
    featureList: [
        'Record a browser workflow once as a demonstration',
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
        'Open-source governed compiler: record a GUI workflow once, compile it into deterministic local replay, and resolve, review, or refuse interface drift.',
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
    // Fetch real GitHub social proof at build time so the number is accurate
    // on each deploy without a client-side request. Falls back to a known-good
    // floor if the build host has no network.
    let githubStats = { stars: 0, forks: 0 }
    try {
        const res = await fetch(
            'https://api.github.com/repos/OpenAdaptAI/openadapt-flow',
            { headers: { Accept: 'application/vnd.github+json' } }
        )
        if (res.ok) {
            const data = await res.json()
            if (typeof data.stargazers_count === 'number') {
                githubStats = {
                    stars: data.stargazers_count,
                    forks: data.forks_count,
                }
            }
        }
    } catch (err) {
        // keep the fallback floor
    }
    const { getHostedOffer } = await import('../lib/hostedOffer')
    const hostedOffer = await getHostedOffer()
    return { props: { githubStats, hostedOffer }, revalidate: 86400 }
}

export default function Home({ githubStats, hostedOffer }) {
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
            <AudiencePaths />
            <HowItWorks />
            <DriftOutcomes />
            <ProductStatus />
            <ProofBand />
            <SafetyBand />
            <IndustriesGrid
                feedbackData={feedbackData}
                setFeedbackData={setFeedbackData}
                sectionRef={sectionRef}
            />
            <div style={{
                background: 'var(--panel)',
                textAlign: 'center',
                padding: '28px 16px',
                borderTop: '1px solid var(--hairline)',
                borderBottom: '1px solid var(--hairline)',
            }}>
                <p style={{
                    color: 'var(--ink)',
                    fontSize: '17px',
                    fontWeight: 600,
                    margin: '0 auto 6px',
                    maxWidth: '640px',
                }}>
                    Running the same workflow hundreds of times on software you
                    can&apos;t API into?
                </p>
                <p style={{
                    color: 'var(--ink-2)',
                    fontSize: '14px',
                    margin: '0 auto 14px',
                    maxWidth: '560px',
                }}>
                    OpenAdapt is launching managed browser execution now, with
                    the same deterministic compiler available under MIT for
                    local and customer-controlled deployment.
                </p>
                <a href="#pricing" style={{
                    display: 'inline-block',
                    background: 'var(--accent)',
                    color: 'var(--on-accent, #fff)',
                    fontSize: '15px',
                    fontWeight: 600,
                    padding: '10px 22px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                }}>
                    Choose a launch path →
                </a>
            </div>
                <Pricing hostedOffer={hostedOffer} />
            <Developers />
            {/* <SocialSection /> */} {/* Temporarily disabled - feeds not working */}
            <Faq />
            <ContactBookingSection prefill={feedbackData} />
            <EmailForm />
            <Footer />
        </div>
    )
}
