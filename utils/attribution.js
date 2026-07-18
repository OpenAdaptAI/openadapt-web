/**
 * First-touch campaign attribution for paid-acquisition tests (E1).
 *
 * Captures utm_source / utm_medium / utm_campaign / utm_term / utm_content
 * (plus the fbclid / gclid click ids) from the FIRST landing URL of the
 * session and keeps them in sessionStorage so conversion events fired later
 * in the visit (email capture, booking click) still carry the campaign that
 * paid for the visit, even after client-side navigation.
 *
 * Privacy posture matches utils/analytics.js: sessionStorage only (cleared
 * when the tab closes), no cookies, no cross-session identity, and only
 * campaign labels we put in our own ad URLs — never user data.
 */

export const ATTRIBUTION_STORAGE_KEY = 'oa_first_touch_attribution'

export const ATTRIBUTION_PARAMS = [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_term',
    'utm_content',
    'fbclid',
    'gclid',
]

function safeSessionStorage() {
    try {
        if (typeof window === 'undefined' || !window.sessionStorage) return null
        return window.sessionStorage
    } catch (err) {
        // Storage can throw in private windows / blocked contexts.
        return null
    }
}

/**
 * Read attribution params from the current URL and persist them if this is
 * the first touch of the session. Safe to call on every route change: an
 * existing first-touch record is never overwritten.
 */
export function captureAttribution(search) {
    const storage = safeSessionStorage()
    if (!storage) return
    try {
        if (storage.getItem(ATTRIBUTION_STORAGE_KEY)) return
        const query =
            search !== undefined
                ? search
                : typeof window !== 'undefined'
                  ? window.location.search
                  : ''
        if (!query) return
        const params = new URLSearchParams(query)
        const found = {}
        for (const key of ATTRIBUTION_PARAMS) {
            const value = params.get(key)
            if (value) {
                // Campaign labels only; cap length defensively.
                found[key] = String(value).slice(0, 200)
            }
        }
        if (Object.keys(found).length === 0) return
        found.landing_path =
            typeof window !== 'undefined' ? window.location.pathname : ''
        storage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(found))
    } catch (err) {
        // Attribution must never break the page.
    }
}

/**
 * Return the stored first-touch attribution (utm_*, click ids, landing_path)
 * or {} when none was captured. Always safe to spread into event properties.
 */
export function getAttribution() {
    const storage = safeSessionStorage()
    if (!storage) return {}
    try {
        const raw = storage.getItem(ATTRIBUTION_STORAGE_KEY)
        if (!raw) return {}
        const parsed = JSON.parse(raw)
        return parsed && typeof parsed === 'object' ? parsed : {}
    } catch (err) {
        return {}
    }
}
