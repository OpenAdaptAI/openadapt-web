// Keep production and local builds on the same canonical booking destination.
// NEXT_PUBLIC_BOOKING_URL remains available for explicit preview/provider tests.
export const DEFAULT_BOOKING_URL =
    'https://cal.com/richard-abrich/30min?overlayCalendar=true'

export function detectBookingProvider(url) {
    if (!url) {
        return 'none'
    }

    try {
        const parsed = new URL(url)
        const host = parsed.hostname.toLowerCase()
        if (host === 'cal.com' || host.endsWith('.cal.com')) {
            return 'calcom'
        }
        if (host === 'calendly.com' || host.endsWith('.calendly.com')) {
            return 'calendly'
        }
        if (host === 'clockwise.com' || host.endsWith('.clockwise.com')) {
            return 'clockwise'
        }
        return 'other'
    } catch (error) {
        return 'other'
    }
}

export function getBookingConfig() {
    const calendlyUrl = (process.env.NEXT_PUBLIC_CALENDLY_URL || '').trim()
    const genericUrl = (process.env.NEXT_PUBLIC_BOOKING_URL || '').trim()
    const url = genericUrl || calendlyUrl || DEFAULT_BOOKING_URL

    return {
        url,
        provider: detectBookingProvider(url),
        source: genericUrl
            ? 'NEXT_PUBLIC_BOOKING_URL'
            : calendlyUrl
                ? 'NEXT_PUBLIC_CALENDLY_URL'
                : 'default',
    }
}

export function getConfiguredBookingUrl() {
    return getBookingConfig().url
}

// Providers whose booking pages render safely inside an iframe on our page.
export function isEmbeddableBookingUrl(url) {
    const provider = detectBookingProvider(url)
    return provider === 'calcom' || provider === 'calendly'
}

export function isCalendlyUrl(url) {
    return detectBookingProvider(url) === 'calendly'
}

export function buildBookingUrlWithPrefill(url, prefill = {}) {
    if (!url) {
        return ''
    }

    const provider = detectBookingProvider(url)
    if (provider !== 'calcom' && provider !== 'calendly') {
        return url
    }

    let parsed
    try {
        parsed = new URL(url)
    } catch (error) {
        return url
    }

    // Calendly-only chrome tweaks; Cal.com ignores these harmlessly but we
    // keep them scoped to Calendly to avoid unknown query params.
    if (provider === 'calendly') {
        if (!parsed.searchParams.get('hide_event_type_details')) {
            parsed.searchParams.set('hide_event_type_details', '1')
        }
        if (!parsed.searchParams.get('hide_gdpr_banner')) {
            parsed.searchParams.set('hide_gdpr_banner', '1')
        }
    }

    // Both Cal.com and Calendly prefill the booker from ?name= / ?email=.
    if (prefill.name && !parsed.searchParams.get('name')) {
        parsed.searchParams.set('name', prefill.name)
    }
    if (prefill.email && !parsed.searchParams.get('email')) {
        parsed.searchParams.set('email', prefill.email)
    }

    return parsed.toString()
}
