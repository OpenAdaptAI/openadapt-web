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
                <title>Availability and commercial status | OpenAdapt.AI</title>
                <meta
                    name="description"
                    content="Launch OpenAdapt with the MIT engine, managed hosted browser execution, or a scoped customer-controlled deployment."
                />
                <link rel="canonical" href="https://openadapt.ai/pricing" />
                <meta property="og:title" content="Availability and commercial status | OpenAdapt.AI" />
                <meta
                    property="og:description"
                    content="OpenAdapt launch options: self-host the MIT engine, qualify managed browser execution, or scope a regulated deployment."
                />
                <meta property="og:url" content="https://openadapt.ai/pricing" />
            </Head>
            <Pricing hostedOffer={hostedOffer} />
            <ContactBookingSection />
            <Footer />
        </div>
    )
}
