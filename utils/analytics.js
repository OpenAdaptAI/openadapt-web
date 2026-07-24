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

import { analyticsAllowed } from 'utils/consent'

// Named funnel events. Keep this list in sync with docs/ANALYTICS.md.
export const EVENTS = {
    HERO_CTA_CLICK: 'hero_cta_click',
    BOOK_PILOT_CLICK: 'book_pilot_click',
    GITHUB_CLICK: 'github_click',
    INSTALL_COMMAND_COPIED: 'install_command_copied',
    DOCS_CLICK: 'docs_click',
    DISCORD_CLICK: 'discord_click',
    // Signup / hosted-app funnel: every outbound click to app.openadapt.ai
    // (the "Sign in" / "Open Cloud app" / "Hosted dashboard" destinations).
    OPEN_CLOUD_APP_CLICK: 'open_cloud_app_click',
    // Formalized name for the /download page's per-asset click (the page
    // already fires the string 'download_click'; this keeps the taxonomy
    // in one place). Properties: { platform, kind, location }.
    DOWNLOAD_CLICK: 'download_click',
    // Named CTA clicks on the comparison / catalog / pricing funnel pages.
    // Generic in-page interactions on these pages are also picked up by
    // autocapture; these named events mark the load-bearing conversions.
    COMPARE_CTA_CLICK: 'compare_cta_click',
    WORKFLOW_CARD_CLICK: 'workflow_card_click',
    PRICING_CTA_CLICK: 'pricing_cta_click',
    QUALIFICATION_FORM_START: 'qualification_form_start',
    QUALIFICATION_FORM_SUBMIT: 'qualification_form_submit',
    QUALIFIED_WORKFLOW: 'qualified_workflow',
}

const POSTHOG_KEY =
    typeof process !== 'undefined'
        ? process.env.NEXT_PUBLIC_POSTHOG_KEY
        : undefined
const POSTHOG_HOST =
    (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_HOST) ||
    'https://us.i.posthog.com'

// Opt-in session replay. Off by default so the layer stays cookieless; the
// founder can enable it on this low-sensitivity marketing site by setting
// NEXT_PUBLIC_POSTHOG_ENABLE_REPLAY=true. When on, all input text is masked.
const ENABLE_REPLAY =
    typeof process !== 'undefined' &&
    process.env.NEXT_PUBLIC_POSTHOG_ENABLE_REPLAY === 'true'

let client = null
let initialized = false

/**
 * True when a PostHog key is configured, we're in the browser, and the
 * visitor has not asked not to be tracked (Do-Not-Track is respected via
 * utils/consent.js).
 */
function isEnabled() {
    return (
        Boolean(POSTHOG_KEY) &&
        typeof window !== 'undefined' &&
        analyticsAllowed()
    )
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
            // Autocapture is ON for the marketing site: it records clicks and
            // pageviews on the public funnel pages (/compare, /workflows,
            // /pricing, /download) so we do not have to hand-instrument every
            // CTA. This is a low-sensitivity marketing site with no PHI.
            autocapture: true,
            capture_pageview: false, // we capture pageviews manually on route change
            capture_pageleave: false,
            person_profiles: 'identified_only', // no anonymous profiles
            // Session replay is opt-in (off by default to stay cookieless).
            // When enabled it masks all input text as a defensive default even
            // though this public site handles no sensitive data.
            disable_session_recording: !ENABLE_REPLAY,
            session_recording: {
                maskAllInputs: true,
            },
            // Honor the browser Do-Not-Track signal at the SDK level too.
            respect_dnt: true,
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
