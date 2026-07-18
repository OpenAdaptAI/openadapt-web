// Capture UTM attribution parameters on landing and keep them available for
// the rest of the visit, so a lead submitted after in-page navigation still
// carries its original traffic source.
//
// Design constraints:
// - No new dependencies, no cookies: sessionStorage only, cleared when the
//   tab closes. These are campaign labels, never personal data.
// - Fail open: any storage or URL error returns empty attribution rather
//   than blocking the form.

export const UTM_KEYS = [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_term',
    'utm_content',
]

const STORAGE_KEY = 'openadapt_utm_v1'

export function parseUtmParams(search) {
    const utm = {}
    if (!search) {
        return utm
    }
    let params
    try {
        params = new URLSearchParams(search)
    } catch (error) {
        return utm
    }
    for (const key of UTM_KEYS) {
        const value = params.get(key)
        if (value) {
            // Keep stored values bounded; campaign labels are short strings.
            utm[key] = value.slice(0, 200)
        }
    }
    return utm
}

function readStored() {
    try {
        const raw = window.sessionStorage.getItem(STORAGE_KEY)
        if (!raw) {
            return {}
        }
        const parsed = JSON.parse(raw)
        const utm = {}
        for (const key of UTM_KEYS) {
            if (typeof parsed[key] === 'string' && parsed[key]) {
                utm[key] = parsed[key].slice(0, 200)
            }
        }
        return utm
    } catch (error) {
        return {}
    }
}

/**
 * Read UTM params from the current URL, persist any found for the session,
 * and return the effective attribution (current URL wins over stored).
 * Safe to call only in the browser (e.g. inside useEffect).
 */
export function captureUtmParams() {
    if (typeof window === 'undefined') {
        return {}
    }
    const fromUrl = parseUtmParams(window.location.search)
    const stored = readStored()
    const merged = { ...stored, ...fromUrl }
    if (Object.keys(fromUrl).length > 0) {
        try {
            window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(merged))
        } catch (error) {
            // Storage unavailable (private mode, quota) — still return values.
        }
    }
    return merged
}
