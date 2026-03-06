export function getConfiguredBookingUrl() {
    const primary = process.env.NEXT_PUBLIC_BOOKING_URL
    const legacyCalendly = process.env.NEXT_PUBLIC_CALENDLY_URL
    const raw = (primary || legacyCalendly || '').trim()

    return raw.length > 0 ? raw : ''
}

export function isCalendlyUrl(url) {
    if (!url) {
        return false
    }

    try {
        const parsed = new URL(url)
        return parsed.hostname.includes('calendly.com')
    } catch (error) {
        return false
    }
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

