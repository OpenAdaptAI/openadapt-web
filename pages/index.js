import { useRef, useState } from 'react'
import Head from 'next/head'

import ContactBookingSection from '@components/ContactBookingSection'
import Developers from '@components/Developers'
import EmailForm from '@components/EmailForm'
import Faq, { faqItems } from '@components/Faq'
import Footer from '@components/Footer'
import HowItWorks from '@components/HowItWorks'
import IndustriesGrid from '@components/IndustriesGrid'
import MastHead from '@components/MastHead'
import ProofBand from '@components/ProofBand'
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
        'Open-source demonstration compiler for desktop automation. Record a workflow once and OpenAdapt compiles it into a deterministic, self-healing automation that runs entirely on your own machines.',
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
    slogan: 'Show it once. It runs forever.',
}

const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'OpenAdapt',
    alternateName: 'OpenAdapt.AI',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Windows, macOS, Linux',
    description:
        'Open-source demonstration compiler for desktop automation. Record a workflow once and OpenAdapt compiles it into a deterministic, self-healing script that replays locally with no per-run model calls. A model is only used to heal the script when the UI drifts, and the fix is proposed as a reviewable diff.',
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
        'Record a desktop workflow once as a demonstration',
        'Compile demonstrations into deterministic, editable automation scripts',
        'Deterministic local replay with zero per-run model cost',
        'Self-healing: UI drift is repaired via a fallback ladder and proposed as a reviewable diff',
        'Local-first: recordings, scripts, and replays stay on your infrastructure',
        'PII/PHI data scrubbing for sensitive workflows',
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
        'Open-source demonstration compiler: record a desktop workflow once and it compiles into a deterministic, self-healing automation that runs on your premises.',
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

export default function Home() {
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
            <MastHead />
            <HowItWorks />
            <ProofBand />
            <IndustriesGrid
                feedbackData={feedbackData}
                setFeedbackData={setFeedbackData}
                sectionRef={sectionRef}
            />
            <div style={{
                background: 'var(--panel)',
                textAlign: 'center',
                padding: '10px 16px',
                borderTop: '1px solid var(--hairline)',
                borderBottom: '1px solid var(--hairline)',
            }}>
                <p style={{
                    color: 'var(--ink-3)',
                    fontSize: '13px',
                    margin: 0,
                    letterSpacing: '0.02em',
                }}>
                    OpenAdapt v1 is open source and under active development.
                    Commercial <a href="#book" style={{ color: 'var(--accent)' }}>pilots</a> for healthcare and
                    lending are open.
                </p>
            </div>
            <Developers />
            {/* <SocialSection /> */} {/* Temporarily disabled - feeds not working */}
            <Faq />
            <ContactBookingSection prefill={feedbackData} />
            <EmailForm />
            <Footer />
        </div>
    )
}
