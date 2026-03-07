# Telemetry Transparency Panel Design

Date: 2026-03-06  
Scope: `openadapt-web` adoption telemetry section (`/` homepage)

## Goal
Make telemetry metrics auditable by users without adding modal friction or inaccurate copy.

Users should be able to answer:
1. What exactly do these counters represent?
2. Which event names are included/excluded?
3. What data fields are collected in telemetry events?
4. How to opt out?

## Constraints
- Must be safe for preview branches/Netlify deploy previews.
- Must avoid "copy drift" where docs/UI differ from code.
- Must keep the homepage readable on mobile.
- Must not expose secrets or raw event payloads.

## Options Considered

### Option A: Modal dialog ("Learn what we collect")
Pros:
- High visual focus
- Plenty of space for detail

Cons:
- Extra click + context switch
- Worse mobile ergonomics
- More complexity (focus traps, keyboard handling)

### Option B: Inline expandable panel (`details/summary`) under telemetry cards
Pros:
- Low friction, transparent by default location
- Native accessibility semantics
- Easy to keep synchronized with API payload

Cons:
- Adds vertical length to the section
- Slightly less "spotlight" than modal

### Option C: Separate telemetry transparency page
Pros:
- Max room for detail and diagrams
- Better long-form documentation

Cons:
- Easy to ignore
- Higher drift risk if disconnected from live classification constants

## Decision
Use **Option B** (inline expandable panel) and generate panel content from `/api/project-metrics` response metadata.

Rationale:
- Lowest UX friction
- Strongest anti-drift path when metadata is API-backed from server constants
- Works well in preview and production

## Proposed Implementation

### 1) API metadata contract
Add `usage.transparency` object to `/api/project-metrics` response:
- `classification_version`
- `dashboard_scope`:
  - this UI uses aggregate counts (not raw event payload display)
  - event names + timestamps + counts for metrics
- `included_event_names` (demos/runs/actions exact lists)
- `ignored_event_names`
- `ignored_event_patterns`
- `fallback_patterns` (for each category)
- `collection_fields`:
  - common event envelope fields (e.g., category, timestamp)
  - common tags (internal, package, package_version, os, python_version, ci)
  - common operation fields (command/operation/success/duration/item_count)
- `privacy_controls`:
  - explicit never-collect list
  - scrubbing behaviors
  - opt-out env vars (`DO_NOT_TRACK`, `OPENADAPT_TELEMETRY_ENABLED`)
- `source_links`:
  - privacy policy
  - telemetry source docs

### 2) UI panel
In `AdoptionSignals`:
- Add collapsible section titled `Telemetry details (what we collect)`.
- Render sections:
  - Metric counting scope
  - Included event names
  - Excluded event names/patterns
  - Collected fields/tags
  - Privacy controls + opt-out
  - Source links
- Keep panel below metric cards and status messages.

### 3) Safety / trust language
- Avoid claiming raw payload access on the web page.
- Clearly separate:
  - "Data used for these counters"
  - "Telemetry client fields in OpenAdapt instrumentation"

## Tradeoffs
- More UI density, but transparent and auditable.
- Some duplication with privacy policy, but scoped to metrics and backed by API constants.
- Requires periodic updates if telemetry schema changes; mitigated by API-backed metadata contract.

## Preview-Branch Plan
Roll out in PR preview first. Validate:
1. Readability on desktop + mobile
2. No contradiction with `/privacy-policy`
3. Metadata stays aligned with event classification constants

Then decide whether to merge to main.
