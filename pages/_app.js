import '@styles/globals.css'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import Head from 'next/head'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

import NavHeader from '@components/NavHeader'
import GoogleAnalytics from '@components/analytics/GoogleAnalytics'
import MetaPixel from '@components/analytics/MetaPixel'
import { initAnalytics, capturePageview } from 'utils/analytics'
import { captureAttribution } from 'utils/attribution'

export default function MyApp({ Component, pageProps }) {
    const router = useRouter()

    // Initialize privacy-conscious funnel analytics (no-op without a key)
    // and capture a pageview on every client-side route change.
    useEffect(() => {
        // First-touch utm_* capture for paid-acquisition tests (E1); no-op
        // when the landing URL carries no campaign params.
        captureAttribution()
        initAnalytics()
        capturePageview(window.location.pathname + window.location.search)
        const handleRouteChange = (url) => capturePageview(url)
        router.events.on('routeChangeComplete', handleRouteChange)
        return () => router.events.off('routeChangeComplete', handleRouteChange)
    }, [router.events])

    return (
        <>
            {/* New pages must add their own <Head> with unique title, description, canonical, and og:* tags */}
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>OpenAdapt — Verified execution for UI-only work</title>
                <meta
                    name="description"
                    content="Automate the UI-only work your APIs cannot reach across browser, desktop, RDP, and Citrix. OpenAdapt verifies consequential effects and halts on uncertainty."
                />
                <link
                    rel="apple-touch-icon"
                    sizes="180x180"
                    href="/apple-touch-icon.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="32x32"
                    href="/favicon-32x32.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="16x16"
                    href="/favicon-16x16.png"
                />
                <link rel="manifest" href="/site.webmanifest" />
                <link
                    rel="mask-icon"
                    href="/safari-pinned-tab.svg"
                    color="#000000"
                />
                <meta name="msapplication-TileColor" content="#2b5797" />
                <meta name="theme-color" content="#ffffff" />

                {/* Open Graph */}
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content="OpenAdapt.AI" />
                <meta property="og:title" content="OpenAdapt — Verified execution for UI-only work" />
                <meta property="og:description" content="Governed execution across browser, desktop, RDP, and Citrix, with identity gates, effect verification, and fail-closed outcomes." />
                <meta property="og:image" content="https://openadapt.ai/og.png" />
                <meta property="og:image:type" content="image/png" />
                <meta property="og:image:width" content="1024" />
                <meta property="og:image:height" content="1024" />
                <meta property="og:url" content="https://openadapt.ai" />

                {/* Twitter Card */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@OpenAdaptAI" />
                <meta name="twitter:title" content="OpenAdapt — Verified execution for UI-only work" />
                <meta name="twitter:description" content="Automate consequential UI-only work, verify the business effect, and halt when the contract cannot be proved." />
                <meta name="twitter:image" content="https://openadapt.ai/og.png" />

            </Head>
            {/* Env-gated: render nothing without their NEXT_PUBLIC_* ids. */}
            <GoogleAnalytics />
            <MetaPixel />
            <NavHeader />
            <main className="font-sans">
                <Component {...pageProps} />
            </main>
        </>
    )
}
