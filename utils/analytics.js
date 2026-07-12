/**
 * Lightweight, privacy-conscious launch-funnel analytics.
 *
 * Wraps PostHog capture with a hard no-op fallback: if
 * NEXT_PUBLIC_POSTHOG_KEY is not configured (local dev, CI, or an
 * opted-out deploy) nothing loads and every call is a silent no-op, so
 * the build and runtime are never affected.
 *
 * This is marketing-site analytics only. It measures the launch funnel
 * (page views + clicks on the load-bearing CTAs). It is cookieless
 * (in-memory persistence), creates no anonymous profiles, records no
 * sessions, and never touches PHI or the OpenAdapt tool's runtime.
 *
 * Nothing here is ever displayed publicly — the founder reads the funnel
 * in the PostHog dashboard. See docs/ANALYTICS.md.
 */

// Named funnel events. Keep this list in sync with docs/ANALYTICS.md.
export const EVENTS = {
    HERO_CTA_CLICK: 'hero_cta_click',
    BOOK_PILOT_CLICK: 'book_pilot_click',
    GITHUB_CLICK: 'github_click',
    INSTALL_COMMAND_COPIED: 'install_command_copied',
    DOCS_CLICK: 'docs_click',
    DISCORD_CLICK: 'discord_click',
}

const POSTHOG_KEY =
    typeof process !== 'undefined'
        ? process.env.NEXT_PUBLIC_POSTHOG_KEY
        : undefined
const POSTHOG_HOST =
    (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_HOST) ||
    'https://us.i.posthog.com'

let client = null
let initialized = false

/** True when a PostHog key is configured and we're in the browser. */
function isEnabled() {
    return Boolean(POSTHOG_KEY) && typeof window !== 'undefined'
}

/**
 * Initialize PostHog once, with a cookieless / privacy-respecting config.
 * Safe to call repeatedly. No-op when no key is configured.
 */
export async function initAnalytics() {
    if (initialized || !isEnabled()) return
    initialized = true
    try {
        const posthog = (await import('posthog-js')).default
        posthog.init(POSTHOG_KEY, {
            api_host: POSTHOG_HOST,
            // Privacy-respecting, local-first-friendly defaults:
            persistence: 'memory', // no cookies, no localStorage
            disable_session_recording: true,
            autocapture: false, // only the named funnel events below
            capture_pageview: false, // we capture pageviews manually on route change
            capture_pageleave: false,
            person_profiles: 'identified_only', // no anonymous profiles
        })
        client = posthog
    } catch (err) {
        // Never let analytics break the page.
        // eslint-disable-next-line no-console
        console.warn('[analytics] init skipped:', err)
    }
}

/** Fire a named funnel event. No-op when analytics is disabled. */
export function track(event, properties) {
    if (!isEnabled() || !client) return
    try {
        client.capture(event, properties)
    } catch (err) {
        // eslint-disable-next-line no-console
        console.warn('[analytics] capture skipped:', err)
    }
}

/** Capture a page view for the given path. No-op when disabled. */
export function capturePageview(path) {
    if (!isEnabled() || !client) return
    try {
        client.capture('$pageview', path ? { $current_url: path } : undefined)
    } catch (err) {
        // eslint-disable-next-line no-console
        console.warn('[analytics] pageview skipped:', err)
    }
}
