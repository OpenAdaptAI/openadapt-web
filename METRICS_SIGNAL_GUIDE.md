# Homepage Metrics Signal Guide

## Goal
Show credibility metrics that reflect real usage, not only package installs.

## Metric hierarchy
1. **Primary**: GitHub traction + product usage metrics
2. **Secondary**: PyPI download trends

PyPI remains useful, but should not be the lead signal by itself.

## Implemented API
`GET /api/project-metrics`

Returns:
- `github`: stars/forks/watchers/issues
- `usage`: total events + demos/runs/actions (30d/90d/all-time when available), source metadata, caveats
- `warnings`: non-fatal fetch warnings

## Usage metric sources
### Source A: PostHog (preferred)
If server env vars are set:
- `POSTHOG_PERSONAL_API_KEY` (or `POSTHOG_API_KEY`)
- optional `POSTHOG_PROJECT_ID` (defaults to `68185`, auto-resolved from API key if omitted)
- optional `POSTHOG_HOST` (defaults to `https://us.posthog.com`)

The API reads PostHog `event_definitions` and sums `volume_30_day` for matched events.

### Source B: explicit overrides (fallback/manual)
Use:
- `OPENADAPT_METRIC_DEMOS_RECORDED_30D`
- `OPENADAPT_METRIC_AGENT_RUNS_30D`
- `OPENADAPT_METRIC_GUI_ACTIONS_30D`
- `OPENADAPT_METRIC_TOTAL_EVENTS_30D`
- `OPENADAPT_METRIC_TOTAL_EVENTS_90D`
- `OPENADAPT_METRIC_TOTAL_EVENTS_ALL_TIME`
- `OPENADAPT_METRIC_APPS_AUTOMATED`

## UI behavior
- The telemetry panel always shows **Total Events** first.
- Detailed breakdown cards (Demos / Agent Runs / GUI Actions) are shown when telemetry has enough depth.
- Current unlock gate:
  - at least `100` total events in last 90 days, and
  - at least `14` days of telemetry coverage (if coverage date is available).

## Current event-name mapping (exact-first)
### Demos
- `recording_finished`
- `recording_completed`
- `demo_recorded`
- `demo_completed`
- `recording.stopped`
- `recording.saved`
- `record.stopped`
- `capture.completed`
- `capture.saved`

### Runs
- `automation_run`
- `agent_run`
- `benchmark_run`
- `replay_started`
- `episode_started`
- `replay.started`

### Actions
- `action_executed`
- `step_executed`
- `mouse_click`
- `keyboard_input`
- `ui_action`
- `action_triggered`

Ignored low-signal events:
- `function_trace`
- `get_events.started`
- `get_events.completed`
- `visualize.started`
- `visualize.completed`

If exact mappings return zero for a category, the API automatically falls back to guarded pattern matching. This keeps counters populated for new event families (for example `command:*` / `operation:*`) without relying on env overrides.

## Tradeoffs
### PostHog event_definitions approach (exact-first + fallback)
Pros:
- no client auth exposure
- lightweight implementation
- easy to keep server-cached
- uses real event names already emitted by OpenAdapt repos

Cons:
- still depends on naming consistency for best precision
- fallback regex can overcount if external events use similar names

### Env override approach
Pros:
- explicit and deterministic
- useful before PostHog is fully instrumented

Cons:
- manual updates needed
- risk of stale numbers without process discipline

## Recommended next step
Standardize new instrumentation to preserve one of the existing exact-name families to minimize reliance on fallback matching.
