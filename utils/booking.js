export function detectBookingProvider(url) {
    if (!url) {
        return 'none'
    }

    try {
        const parsed = new URL(url)
        const host = parsed.hostname.toLowerCase()
        if (host.includes('calendly.com')) {
            return 'calendly'
        }
        if (host.includes('clockwise.com')) {
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
    const url = calendlyUrl || genericUrl

    return {
        url,
        provider: detectBookingProvider(url),
        source: calendlyUrl
            ? 'NEXT_PUBLIC_CALENDLY_URL'
            : genericUrl
                ? 'NEXT_PUBLIC_BOOKING_URL'
                : '',
    }
}

export function getConfiguredBookingUrl() {
    return getBookingConfig().url
}

export function isCalendlyUrl(url) {
    return detectBookingProvider(url) === 'calendly'
}

export function buildBookingUrlWithPrefill(url, prefill = {}) {
    if (!url) {
        return ''
    }

    if (!isCalendlyUrl(url)) {
        return url
    }

    let parsed
    try {
        parsed = new URL(url)
    } catch (error) {
        return url
    }

    if (!parsed.searchParams.get('hide_event_type_details')) {
        parsed.searchParams.set('hide_event_type_details', '1')
    }

    if (!parsed.searchParams.get('hide_gdpr_banner')) {
        parsed.searchParams.set('hide_gdpr_banner', '1')
    }

    if (prefill.name && !parsed.searchParams.get('name')) {
        parsed.searchParams.set('name', prefill.name)
    }

    if (prefill.email && !parsed.searchParams.get('email')) {
        parsed.searchParams.set('email', prefill.email)
    }

    return parsed.toString()
}
