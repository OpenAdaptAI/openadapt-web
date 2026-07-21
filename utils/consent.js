/**
 * Minimal consent / Do-Not-Track posture for the marketing site.
 *
 * The site has no cookie-consent banner today (it is cookieless by default:
 * PostHog uses in-memory persistence and creates no profiles). The one signal
 * we honor is the browser's Do-Not-Track flag: when a visitor sets DNT, no
 * analytics initializes and no tracker script loads. A full CMP/consent banner
 * is a documented follow-up (see docs/ANALYTICS.md), not part of this layer.
 */

/**
 * True when the visitor's browser is sending a Do-Not-Track signal.
 * Always false on the server so SSR output is deterministic.
 */
export function doNotTrackEnabled() {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
        return false
    }
    const dnt =
        navigator.doNotTrack ||
        window.doNotTrack ||
        (typeof navigator.msDoNotTrack !== 'undefined'
            ? navigator.msDoNotTrack
            : undefined)
    return dnt === '1' || dnt === 'yes' || dnt === true
}

/** True when analytics is permitted (i.e. Do-Not-Track is not set). */
export function analyticsAllowed() {
    return !doNotTrackEnabled()
}
