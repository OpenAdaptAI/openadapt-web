import Head from 'next/head'
import ContactBookingSection from '@components/ContactBookingSection'
import Footer from '@components/Footer'

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-[#06061f] text-white">
            <Head>
                <title>Contact | OpenAdapt.AI</title>
                <meta
                    name="description"
                    content="Contact the OpenAdapt team. Tell us your workflow, tools, and volume. We'll propose a pilot scope and ROI target for AI-powered automation."
                />
                <link rel="canonical" href="https://openadapt.ai/contact" />
                <meta property="og:title" content="Contact | OpenAdapt.AI" />
                <meta property="og:description" content="Contact OpenAdapt. Share your workflow and we'll propose a pilot scope for AI-powered automation." />
                <meta property="og:url" content="https://openadapt.ai/contact" />
            </Head>
            <ContactBookingSection showHomeLink />
            <Footer />
        </div>
    )
}
