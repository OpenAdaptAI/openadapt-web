import Head from 'next/head'

import ContactBookingSection from '@components/ContactBookingSection'
import Footer from '@components/Footer'
import Pricing from '@components/Pricing'

export async function getStaticProps() {
    const { getHostedOffer } = await import('../lib/hostedOffer')
    const hostedOffer = await getHostedOffer()
    return { props: { hostedOffer }, revalidate: 300 }
}

export default function PricingPage({ hostedOffer }) {
    return (
        <div className="min-h-screen bg-ground text-ink">
            <Head>
                <title>Pricing | OpenAdapt</title>
                <meta
                    name="description"
                    content="Launch OpenAdapt with the MIT engine, OpenAdapt Cloud for managed browser execution and review, or a customer-controlled deployment for desktop, RDP, Citrix, private systems, and regulated data."
                />
                <link rel="canonical" href="https://openadapt.ai/pricing" />
                <meta property="og:title" content="Pricing | OpenAdapt" />
                <meta
                    property="og:description"
                    content="Run OpenAdapt locally, subscribe to Cloud for managed browser execution and review, or deploy the governed runtime inside your own boundary."
                />
                <meta property="og:url" content="https://openadapt.ai/pricing" />
            </Head>
            <Pricing hostedOffer={hostedOffer} />
            <ContactBookingSection />
            <Footer />
        </div>
    )
}
