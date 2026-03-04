import { useRef, useState } from 'react'

import BenchmarkSection from '@components/BenchmarkSection'
import Developers from '@components/Developers'
import DevToolsSection from '@components/DevToolsSection'
import EcosystemSection from '@components/EcosystemSection'
import EmailForm from '@components/EmailForm'
import FeedbackForm from '@components/FeedbackForm'
import Footer from '@components/Footer'
import IndustriesGrid from '@components/IndustriesGrid'
import MastHead from '@components/MastHead'
// import SocialSection from '@components/SocialSection' // Temporarily disabled - feeds not working

export default function Home() {
    const [feedbackData, setFeedbackData] = useState({
        email: '',
        message: '',
    })

    const sectionRef = useRef(null)

    return (
        <div>
            <MastHead />
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
            <EmailForm />
            <Footer />
        </div>
    )
}
