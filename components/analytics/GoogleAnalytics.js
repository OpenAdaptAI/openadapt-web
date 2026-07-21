import Script from 'next/script'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import { analyticsAllowed } from 'utils/consent'

/**
 * GA4 loader — reusable, env-gated page-level integration.
 *
 * Renders nothing and loads nothing unless NEXT_PUBLIC_GA_MEASUREMENT_ID is
 * set (local dev, CI, and opted-out deploys stay analytics-free). Mounted
 * once in pages/_app.js so every page — including campaign landing pages —
 * is covered automatically; no per-page wiring needed.
 *
 * The initial page_view is sent by `gtag('config', ...)`; subsequent
 * client-side route changes send page_view manually so SPA navigation is
 * counted correctly. IP anonymization is default-on in GA4.
 * Google Ads signals/remarketing are explicitly disabled — this is
 * traffic + conversion measurement only. Consent posture is documented in
 * docs/ANALYTICS.md.
 */

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

export function gaPageview(url) {
    try {
        if (
            GA_MEASUREMENT_ID &&
            typeof window !== 'undefined' &&
            typeof window.gtag === 'function'
        ) {
            window.gtag('event', 'page_view', {
                page_path: url,
                send_to: GA_MEASUREMENT_ID,
            })
        }
    } catch (err) {
        // Analytics must never break the page.
    }
}

export default function GoogleAnalytics() {
    const router = useRouter()
    // Gate on Do-Not-Track after mount. Server + first client render return
    // null (DNT is a browser-only value), so there is no hydration mismatch;
    // once mounted we load gtag only when the visitor allows analytics.
    const [allowed, setAllowed] = useState(false)

    useEffect(() => {
        setAllowed(analyticsAllowed())
    }, [])

    useEffect(() => {
        if (!GA_MEASUREMENT_ID || !allowed) return undefined
        const handleRouteChange = (url) => gaPageview(url)
        router.events.on('routeChangeComplete', handleRouteChange)
        return () => router.events.off('routeChangeComplete', handleRouteChange)
    }, [router.events, allowed])

    if (!GA_MEASUREMENT_ID || !allowed) return null

    return (
        <>
            <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
                strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
                {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    window.gtag = gtag;
                    gtag('js', new Date());
                    gtag('config', '${GA_MEASUREMENT_ID}', {
                        send_page_view: true,
                        allow_google_signals: false,
                        allow_ad_personalization_signals: false
                    });
                `}
            </Script>
        </>
    )
}
