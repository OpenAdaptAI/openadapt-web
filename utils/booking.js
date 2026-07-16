// Keep every build on one code-owned booking destination. Deploy-time provider
// fallbacks made stale Calendly configuration capable of resurfacing.
export const DEFAULT_BOOKING_URL =
    'https://cal.com/richard-abrich/30min?overlayCalendar=true'

export function getBookingConfig() {
    return {
        url: DEFAULT_BOOKING_URL,
        provider: 'calcom',
        source: 'canonical',
    }
}

export function getConfiguredBookingUrl() {
    return getBookingConfig().url
}

export function buildBookingUrlWithPrefill(url, prefill = {}) {
    if (!url) {
        return ''
    }

    let parsed
    try {
        parsed = new URL(url)
    } catch (error) {
        return url
    }

    // Cal.com prefills the booker from ?name= / ?email=.
    if (prefill.name && !parsed.searchParams.get('name')) {
        parsed.searchParams.set('name', prefill.name)
    }
    if (prefill.email && !parsed.searchParams.get('email')) {
        parsed.searchParams.set('email', prefill.email)
    }

    return parsed.toString()
}
