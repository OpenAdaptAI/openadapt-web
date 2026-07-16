import Head from 'next/head'
import ContactBookingSection from '@components/ContactBookingSection'
import Footer from '@components/Footer'

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-ground text-ink">
            <Head>
                <title>Contact | OpenAdapt.AI</title>
                <meta
                    name="description"
                    content="Contact the OpenAdapt team to qualify a repeated workflow, its execution boundary, verification needs, and deployment path."
                />
                <link rel="canonical" href="https://openadapt.ai/contact" />
                <meta property="og:title" content="Contact | OpenAdapt.AI" />
                <meta property="og:description" content="Share one repeated workflow and we'll map the right OpenAdapt execution, verification, and deployment path." />
                <meta property="og:url" content="https://openadapt.ai/contact" />
            </Head>
            <ContactBookingSection showHomeLink />
            <Footer />
        </div>
    )
}
