import { useRef, useState } from 'react'

import Developers from '@components/Developers'
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
            <Developers />
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
