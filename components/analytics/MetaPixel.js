import Script from 'next/script'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import { analyticsAllowed } from 'utils/consent'

/**
 * Meta (Facebook) Pixel loader — reusable, env-gated.
 *
 * Renders nothing and loads nothing unless NEXT_PUBLIC_META_PIXEL_ID is
 * set, so the pixel only exists on deploys that are actively running a
 * paid Meta test (E1). Mounted once in pages/_app.js.
 *
 * Fires PageView on load and on every client-side route change.
 * Conversion events (Lead / Contact / Schedule) are fired through
 * utils/conversion.js — never inline. Only ever use this on public
 * marketing pages; never on any surface that could see PHI-adjacent
 * traffic (see docs/ANALYTICS.md and the E1 runbook).
 */

const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID

function pixelPageview() {
    try {
        if (
            META_PIXEL_ID &&
            typeof window !== 'undefined' &&
            typeof window.fbq === 'function'
        ) {
            window.fbq('track', 'PageView')
        }
    } catch (err) {
        // Analytics must never break the page.
    }
}

export default function MetaPixel() {
    const router = useRouter()
    // Gate on Do-Not-Track after mount (browser-only value), so SSR and the
    // first client render agree and there is no hydration mismatch.
    const [allowed, setAllowed] = useState(false)

    useEffect(() => {
        setAllowed(analyticsAllowed())
    }, [])

    useEffect(() => {
        if (!META_PIXEL_ID || !allowed) return undefined
        const handleRouteChange = () => pixelPageview()
        router.events.on('routeChangeComplete', handleRouteChange)
        return () => router.events.off('routeChangeComplete', handleRouteChange)
    }, [router.events, allowed])

    if (!META_PIXEL_ID || !allowed) return null

    return (
        <Script id="meta-pixel-init" strategy="afterInteractive">
            {`
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${META_PIXEL_ID}');
                fbq('track', 'PageView');
            `}
        </Script>
    )
}
