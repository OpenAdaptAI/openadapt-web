/**
 * Conversion-event fan-out for paid-acquisition tests (E1).
 *
 * One call site per conversion; this module forwards to every configured
 * sink, each of which is independently env-gated and a hard no-op when
 * absent:
 *
 *   - PostHog        via utils/analytics.js  (NEXT_PUBLIC_POSTHOG_KEY)
 *   - GA4 (gtag)     loaded by components/analytics/GoogleAnalytics.js
 *                    (NEXT_PUBLIC_GA_MEASUREMENT_ID)
 *   - Meta Pixel     loaded by components/analytics/MetaPixel.js
 *                    (NEXT_PUBLIC_META_PIXEL_ID)
 *
 * Every event carries the first-touch utm_* attribution captured by
 * utils/attribution.js. Properties are campaign labels and enum locations
 * only — never form contents, emails, or free text. See docs/ANALYTICS.md.
 */

import { track } from 'utils/analytics'
import { getAttribution } from 'utils/attribution'

// Conversion event names. GA4 uses its recommended `generate_lead` name so
// the event is usable as a conversion without remapping; Meta uses standard
// events (`Lead`, `Schedule`) so campaign optimization works out of the box.
export const CONVERSION_EVENTS = {
    EMAIL_CAPTURE: 'email_capture_submitted',
    BOOKING_CLICK: 'book_call_click',
    BOOKING_CONFIRMED: 'book_call_confirmed',
}

function sanitizeProps(properties) {
    const props = {}
    if (properties && typeof properties === 'object') {
        for (const [key, value] of Object.entries(properties)) {
            if (value === undefined || value === null) continue
            props[key] = String(value).slice(0, 200)
        }
    }
    return { ...getAttribution(), ...props }
}

function gtagEvent(name, props) {
    try {
        if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
            window.gtag('event', name, props)
        }
    } catch (err) {
        // Analytics must never break the page.
    }
}

function fbqEvent(kind, name, props) {
    try {
        if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
            window.fbq(kind, name, props)
        }
    } catch (err) {
        // Analytics must never break the page.
    }
}

/**
 * A visitor submitted an email-capture form (waitlist / updates / contact).
 * This is one of the two E1 "qualified lead" conversions.
 * `location` is an enum-ish label: 'email_form', 'contact_form',
 * 'dental_landing', ...
 */
export function trackEmailCapture(properties) {
    const props = sanitizeProps(properties)
    track(CONVERSION_EVENTS.EMAIL_CAPTURE, props)
    gtagEvent('generate_lead', props)
    fbqEvent('track', 'Lead', props)
}

/**
 * A visitor clicked through to the booking scheduler (CTA or direct link).
 * Intent signal on the "booked call" conversion path.
 */
export function trackBookingClick(properties) {
    const props = sanitizeProps(properties)
    track(CONVERSION_EVENTS.BOOKING_CLICK, props)
    gtagEvent(CONVERSION_EVENTS.BOOKING_CLICK, props)
    fbqEvent('track', 'Contact', props)
}

/**
 * The Cal.com embed reported a completed booking (best-effort postMessage
 * signal). This is the other E1 "qualified lead" conversion.
 */
export function trackBookingConfirmed(properties) {
    const props = sanitizeProps(properties)
    track(CONVERSION_EVENTS.BOOKING_CONFIRMED, props)
    gtagEvent(CONVERSION_EVENTS.BOOKING_CONFIRMED, props)
    fbqEvent('track', 'Schedule', props)
}
