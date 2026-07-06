import { useRef, useState } from 'react'
import Head from 'next/head'

import BenchmarkSection from '@components/BenchmarkSection'
import ContactBookingSection from '@components/ContactBookingSection'
import Developers from '@components/Developers'
import DevToolsSection from '@components/DevToolsSection'
import EcosystemSection from '@components/EcosystemSection'
import Footer from '@components/Footer'
import HowItWorks from '@components/HowItWorks'
import IndustriesGrid from '@components/IndustriesGrid'
import MastHead from '@components/MastHead'
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
        'Open-source platform for GUI automation with AI. Record human demonstrations, train models, and deploy agents that can operate any software.',
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
    slogan: 'Teach AI to use any software',
}

const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'OpenAdapt',
    alternateName: 'OpenAdapt.AI',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Windows, macOS, Linux',
    description:
        'Open-source AI-powered desktop automation platform. Record human demonstrations of GUI workflows, train models, and deploy AI agents that replicate those workflows autonomously. Compatible with Claude, GPT-4V, and Gemini.',
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
        'Record human demonstrations of desktop workflows',
        'Train AI models on recorded task data',
        'Deploy autonomous AI agents for GUI automation',
        'PII/PHI data scrubbing for privacy compliance',
        'Model agnostic — works with Claude, GPT-4V, Gemini',
        'Benchmark evaluation with Windows Agent Arena',
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
        'Open-source AI-powered GUI automation platform. Teach AI to use any software.',
    publisher: {
        '@type': 'Organization',
        name: 'OpenAdapt.AI',
        url: 'https://openadapt.ai',
    },
    inLanguage: 'en',
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
            </Head>
            <MastHead />
            <HowItWorks />
            <div style={{
                background: 'rgba(0, 0, 30, 1)',
                textAlign: 'center',
                padding: '10px 16px',
                borderTop: '1px solid rgba(86, 13, 248, 0.2)',
                borderBottom: '1px solid rgba(86, 13, 248, 0.2)',
            }}>
                <p style={{
                    color: 'rgba(255, 255, 255, 0.5)',
                    fontSize: '13px',
                    margin: 0,
                    letterSpacing: '0.02em',
                }}>
                    Warning: OpenAdapt is alpha software and comes with absolutely no warranty of any kind.
                </p>
            </div>
            <Developers />
            <EcosystemSection />
            <DevToolsSection />
            <BenchmarkSection />
            <IndustriesGrid
                feedbackData={feedbackData}
                setFeedbackData={setFeedbackData}
                sectionRef={sectionRef}
            />
            {/* <SocialSection /> */} {/* Temporarily disabled - feeds not working */}
            <ContactBookingSection prefill={feedbackData} />
            <Footer />
        </div>
    )
}
