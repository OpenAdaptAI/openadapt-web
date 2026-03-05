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
- `usage`: demos/runs/actions (30d), source metadata, caveats
- `warnings`: non-fatal fetch warnings

## Usage metric sources
### Source A: PostHog (preferred)
If server env vars are set:
- `POSTHOG_PERSONAL_API_KEY` (or `POSTHOG_API_KEY`)
- `POSTHOG_PROJECT_ID`
- optional `POSTHOG_HOST` (defaults to `https://us.posthog.com`)

The API reads PostHog `event_definitions` and sums `volume_30_day` for matched events.

### Source B: explicit overrides (fallback/manual)
Use:
- `OPENADAPT_METRIC_DEMOS_RECORDED_30D`
- `OPENADAPT_METRIC_AGENT_RUNS_30D`
- `OPENADAPT_METRIC_GUI_ACTIONS_30D`
- `OPENADAPT_METRIC_APPS_AUTOMATED`

## Current event-name mapping
### Demos
- `recording_finished`
- `recording_completed`
- `demo_recorded`
- `demo_completed`

### Runs
- `automation_run`
- `agent_run`
- `benchmark_run`
- `replay_started`
- `episode_started`

### Actions
- `action_executed`
- `step_executed`
- `mouse_click`
- `keyboard_input`
- `ui_action`

If telemetry names differ, update mapping in `pages/api/project-metrics.js`.

## Tradeoffs
### PostHog event_definitions approach
Pros:
- no client auth exposure
- lightweight implementation
- easy to keep server-cached

Cons:
- depends on naming consistency
- may undercount if instrumentation uses different event names

### Env override approach
Pros:
- explicit and deterministic
- useful before PostHog is fully instrumented

Cons:
- manual updates needed
- risk of stale numbers without process discipline

## Recommended next step
Standardize instrumentation event names in product repos to match this mapping, then remove env overrides once PostHog is complete.
