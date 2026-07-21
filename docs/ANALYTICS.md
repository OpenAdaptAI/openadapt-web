# Launch-funnel analytics

Lightweight, privacy-conscious instrumentation for the OpenAdapt marketing
site. Its only purpose is to let the team see the **launch funnel** — page
views and clicks on the load-bearing calls to action — when a launch (e.g. a
Show HN) drives traffic.

This is **marketing-site analytics only**. Nothing here is displayed publicly,
and it never touches PHI or the OpenAdapt tool's runtime.

## What is tracked

Page views (captured manually on each client-side route change), PostHog
**autocapture** of clicks/interactions on the public funnel pages, plus these
named funnel events:

| Event                     | Fires when the visitor…                              | Where                                   |
| ------------------------- | ---------------------------------------------------- | --------------------------------------- |
| `hero_cta_click`          | clicks a hero button ("Book a demo" / "See how it works") | `components/MastHead.js`, `components/NavHeader.js` |
| `book_pilot_click`        | clicks a "Book a demo" / "Book a Call" CTA           | `components/NavHeader.js`, `components/Footer.js` |
| `github_click`            | clicks a GitHub link                                 | `components/NavHeader.js`, `components/Footer.js`, `components/MastHead.js` |
| `install_command_copied`  | copies an install command (one-liner or step-by-step) | `components/InstallSection.js`         |
| `docs_click`              | clicks the Docs link                                 | `components/Footer.js`                  |
| `discord_click`           | clicks the Discord link                              | `components/Footer.js`                  |
| `open_cloud_app_click`    | clicks any outbound link to `app.openadapt.ai` ("Sign in" / "Hosted dashboard") | `components/NavHeader.js`, `components/Footer.js` |
| `download_click`          | clicks a desktop/CLI download asset                  | `pages/download.js`                     |
| `compare_cta_click`       | clicks a CTA on `/compare`                            | `pages/compare.js`                      |
| `workflow_card_click`     | opens a reference from the `/workflows` catalog      | `pages/workflows.js`                    |
| `pricing_cta_click`       | starts hosted checkout or the "start with our team" path | `components/Pricing.js`             |

Event properties are limited to non-identifying context such as the platform
tab selected (`macOS`/`Linux`/`Windows`), the copy variant
(`one_liner`/`step_by_step`), the plan (`hosted`), the reference `industry`,
and the on-page `location` (`nav`, `footer`, `compare_hero`, …). No form
contents, emails, amounts, or free-text are captured.

This taxonomy is shared across all OpenAdapt web properties. The docs site
(`openadapt-ops`) also emits `outbound_click` and `docs_search`; the hosted app
(`openadapt-cloud`) emits the product/activation funnel. All three report into
the **same** PostHog project (same `NEXT_PUBLIC_POSTHOG_KEY` / host).

## Privacy posture

- **Cookieless by default.** PostHog is initialized with `persistence:
  'memory'` — no cookies, no `localStorage`. Nothing survives a full page
  reload.
- **No profiles.** `person_profiles: 'identified_only'` means no anonymous
  person profiles are created; we never call `identify` on the marketing site.
- **Autocapture ON.** This is a low-sensitivity public marketing site with no
  PHI, so autocapture is enabled to record clicks/pageviews on the funnel pages
  without hand-instrumenting every element.
- **Session replay OFF by default, opt-in.** Set
  `NEXT_PUBLIC_POSTHOG_ENABLE_REPLAY=true` to enable it; when on, all input
  text is masked (`maskAllInputs`). Never enable on a PHI-adjacent surface.
- **Do-Not-Track respected.** If the browser sends a DNT signal, PostHog, GA4,
  and the Meta Pixel never initialize and no tracker script loads
  (`utils/consent.js`, and PostHog's own `respect_dnt`).
- **Opt-out by default in dev/CI.** With no `NEXT_PUBLIC_POSTHOG_KEY` set, the
  entire layer (`utils/analytics.js`) is a no-op; nothing loads.
- **No PHI or product runtime data, ever.** This site handles no patient/customer
  runtime data. Analytics is limited to ordinary website telemetry and public
  marketing CTA events described in the privacy policy; never add names, email
  addresses, workflow values, or other customer-supplied fields to event payloads.
- **No public counts.** Usage numbers are never rendered on the site (pre-launch
  they'd be zero — anti-proof). The funnel lives only in the PostHog dashboard.

## Consent posture (and follow-up)

The site is cookieless by default and honors Do-Not-Track, so it ships **no
cookie-consent banner** today. If session replay or the Meta Pixel is turned on
for a region that requires opt-in consent, add a lightweight consent manager as
a follow-up and gate those two sinks behind it. That is a deliberate follow-up,
not part of this layer.

## Enabling it

1. Create a PostHog project and copy its **project API key** (publishable,
   client-side; not a secret).
2. Set the env vars (see `.env.example`):
   ```
   NEXT_PUBLIC_POSTHOG_KEY=phc_xxx
   NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
   ```
   Add the same in the Vercel/Netlify project settings for production.

## Reading the funnel in PostHog

1. In PostHog, open **Product analytics → Funnels → New funnel**.
2. Add steps in order, e.g.:
   `$pageview` → `install_command_copied` → `book_pilot_click`.
   (Or `$pageview` → `hero_cta_click` → `book_pilot_click` for the demo path.)
3. Set the date range to the launch window to see conversion at each step.
4. Break down `install_command_copied` by the `platform` / `variant` property
   to see which install path visitors prefer.

Because persistence is in-memory, a funnel is measured within a single page
session (a visitor navigating the SPA), which is exactly the launch-day
behavior we care about.

## Paid-acquisition measurement (E1: GA4 + Meta Pixel)

Additive layer for capped paid-traffic tests (Meta ads + community
placements driving a landing page). Everything here is **env-gated and off
by default** — with neither id set, no script loads and nothing renders:

| Env var | Loads | Component |
| ------- | ----- | --------- |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | GA4 (gtag.js): SPA pageviews + conversions, feeds the native GA4 → BigQuery export | `components/analytics/GoogleAnalytics.js` |
| `NEXT_PUBLIC_META_PIXEL_ID` | Meta Pixel: PageView + standard conversion events for campaign optimization | `components/analytics/MetaPixel.js` |

Both are mounted once in `pages/_app.js`, so every page (including
campaign landing pages such as `/dental`) is covered with no per-page
wiring.

### Conversion events

Fired through the single fan-out module `utils/conversion.js` (never
inline `gtag`/`fbq` calls):

| Conversion | Fires when | PostHog | GA4 | Meta |
| ---------- | ---------- | ------- | --- | ---- |
| Email capture (**qualified lead**) | email/contact form submits successfully (`components/EmailForm.js`, `components/ContactBookingSection.js`) | `email_capture_submitted` | `generate_lead` | `Lead` |
| Booking click | visitor reaches the scheduler (`pages/book.js`) or clicks a direct booking link (`components/BookingEmbed.js`) | `book_call_click` | `book_call_click` | `Contact` |
| Booking confirmed (**qualified lead**) | Cal.com embed reports a completed booking — best-effort postMessage signal (`components/BookingEmbed.js`) | `book_call_confirmed` | `book_call_confirmed` | `Schedule` |

### Attribution

`utils/attribution.js` captures `utm_source/medium/campaign/term/content`
(+ `fbclid`/`gclid`) from the first landing URL of the session into
`sessionStorage` (first-touch; cleared when the tab closes; no cookies)
and every conversion event carries them, so cost-per-qualified-lead can be
attributed per campaign/ad set/placement.

### Privacy posture (deltas vs the PostHog layer)

- Event properties remain campaign labels + enum locations only — never
  emails, names, or form contents.
- GA4 is configured with `allow_google_signals: false` and
  `allow_ad_personalization_signals: false` (measurement, not
  remarketing). GA4 does not log or store IP addresses.
- The Meta Pixel is inherently a third-party ad tracker: enable it only
  while a Meta campaign is live, and never on any surface that could
  receive PHI or product/customer runtime data. The site has no CMP today; the consent
  discussion and regional considerations live in the E1 tracking runbook
  (private), which gates turning the pixel on.
