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
                    content="Launch OpenAdapt with the MIT engine, managed cloud execution for approved browser workflows (Beta), or a scoped customer-controlled deployment for desktop, RDP, and Citrix."
                />
                <link rel="canonical" href="https://openadapt.ai/pricing" />
                <meta property="og:title" content="Pricing | OpenAdapt" />
                <meta
                    property="og:description"
                    content="OpenAdapt launch options: self-host the MIT engine, subscribe to managed browser execution, or scope a customer-controlled deployment."
                />
                <meta property="og:url" content="https://openadapt.ai/pricing" />
            </Head>
            <Pricing hostedOffer={hostedOffer} />
            <ContactBookingSection />
            <Footer />
        </div>
    )
}
