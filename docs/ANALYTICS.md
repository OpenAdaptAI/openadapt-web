# Launch-funnel analytics

Lightweight, privacy-conscious instrumentation for the OpenAdapt marketing
site. Its only purpose is to let the team see the **launch funnel** — page
views and clicks on the load-bearing calls to action — when a launch (e.g. a
Show HN) drives traffic.

This is **marketing-site analytics only**. Nothing here is displayed publicly,
and it never touches PHI or the OpenAdapt tool's runtime.

## What is tracked

Page views (captured manually on each client-side route change) plus these
named funnel events:

| Event                     | Fires when the visitor…                              | Where                                   |
| ------------------------- | ---------------------------------------------------- | --------------------------------------- |
| `hero_cta_click`          | clicks a hero button ("Book a demo" / "See how it works") | `components/MastHead.js`           |
| `book_pilot_click`        | clicks a "Book a demo" / "Book a Call" CTA           | `components/NavHeader.js`, `components/Footer.js` |
| `github_click`            | clicks a GitHub link                                 | `components/NavHeader.js`, `components/Footer.js`, `components/MastHead.js` |
| `install_command_copied`  | copies an install command (one-liner or step-by-step) | `components/InstallSection.js`         |
| `docs_click`              | clicks the Docs link                                 | `components/Footer.js`                  |
| `discord_click`           | clicks the Discord link                              | `components/Footer.js`                  |

Event properties are limited to non-identifying context such as the platform
tab selected (`macOS`/`Linux`/`Windows`), the copy variant
(`one_liner`/`step_by_step`), and the on-page `location` (`nav`, `footer`,
`hero_stars`, …). No form contents, emails, or free-text are captured.

## Privacy posture

- **Cookieless.** PostHog is initialized with `persistence: 'memory'` — no
  cookies, no `localStorage`. Nothing survives a full page reload.
- **No profiles.** `person_profiles: 'identified_only'` means no anonymous
  person profiles are created; we never call `identify`.
- **No session recording**, **no autocapture** — only the named events above.
- **Opt-out by default in dev/CI.** With no `NEXT_PUBLIC_POSTHOG_KEY` set, the
  entire layer (`utils/analytics.js`) is a no-op; nothing loads.
- **No PHI, ever.** This site handles no patient/customer runtime data, and the
  tracker only sees clicks on public marketing CTAs.
- **No public counts.** Usage numbers are never rendered on the site (pre-launch
  they'd be zero — anti-proof). The funnel lives only in the PostHog dashboard.

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
