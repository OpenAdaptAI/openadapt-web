import Head from 'next/head'

import ContactBookingSection from '@components/ContactBookingSection'
import Footer from '@components/Footer'
import Pricing from '@components/Pricing'

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-ground text-ink">
            <Head>
                <title>Pricing | OpenAdapt.AI</title>
                <meta
                    name="description"
                    content="OpenAdapt pricing: the open-source engine is free (MIT), a hosted runner for non-PHI teams, and on-premises Enterprise where PHI never leaves your building and inference runs on your hardware at zero metered cost. No per-step, per-seat, or per-model-call charges."
                />
                <link rel="canonical" href="https://openadapt.ai/pricing" />
                <meta property="og:title" content="Pricing | OpenAdapt.AI" />
                <meta
                    property="og:description"
                    content="Open source and free. Hosted for teams without on-prem hardware. Enterprise on-prem where your data stays in your building — inference bundled, never metered per step or per seat."
                />
                <meta property="og:url" content="https://openadapt.ai/pricing" />
            </Head>
            <Pricing />
            <ContactBookingSection />
            <Footer />
        </div>
    )
}
