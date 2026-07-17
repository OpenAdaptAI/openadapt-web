import '@styles/globals.css'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import Head from 'next/head'
import Script from 'next/script'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

import NavHeader from '@components/NavHeader'
import { initAnalytics, capturePageview } from 'utils/analytics'

export default function MyApp({ Component, pageProps }) {
    const router = useRouter()

    // Initialize privacy-conscious funnel analytics (no-op without a key)
    // and capture a pageview on every client-side route change.
    useEffect(() => {
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
                <title>OpenAdapt — Governed, deterministic automation for repeated GUI work</title>
                <meta
                    name="description"
                    content="OpenAdapt compiles demonstrated GUI workflows into deterministic local programs. Healthy replay makes zero model calls; drift is resolved, reviewed, or refused under configured verification. MIT licensed."
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
                <meta property="og:title" content="OpenAdapt — Governed, deterministic automation for repeated GUI work" />
                <meta property="og:description" content="Compile a bounded demonstration into local deterministic replay, then resolve, review, or refuse interface drift. MIT licensed." />
                <meta property="og:image" content="https://openadapt.ai/og.png" />
                <meta property="og:image:type" content="image/png" />
                <meta property="og:image:width" content="1024" />
                <meta property="og:image:height" content="1024" />
                <meta property="og:url" content="https://openadapt.ai" />

                {/* Twitter Card */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@OpenAdaptAI" />
                <meta name="twitter:title" content="OpenAdapt — Governed, deterministic GUI automation" />
                <meta name="twitter:description" content="Compile a bounded demonstration into local deterministic replay, then resolve, review, or refuse interface drift. MIT licensed." />
                <meta name="twitter:image" content="https://openadapt.ai/og.png" />

            </Head>
            <NavHeader />
            <main className="font-sans">
                <Component {...pageProps} />
            </main>
            <Script src="https://buttons.github.io/buttons.js" />
        </>
    )
}
