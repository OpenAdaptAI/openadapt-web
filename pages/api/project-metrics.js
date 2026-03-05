/**
 * Aggregated project metrics for homepage credibility signals.
 *
 * Priority:
 * 1) GitHub repository stats (stars/forks/watchers/issues)
 * 2) Usage metrics from PostHog (if configured) or env overrides
 * 3) Explicit caveats/source metadata for transparency
 */

const DEFAULT_POSTHOG_HOST = 'https://us.posthog.com'
const MAX_EVENT_DEFINITION_PAGES = 5

function parseIntEnv(name) {
    const raw = process.env[name]
    if (raw === undefined || raw === null || raw === '') return null
    const value = Number.parseInt(raw, 10)
    return Number.isFinite(value) ? value : null
}

function formatError(error) {
    if (!error) return 'unknown'
    if (typeof error === 'string') return error
    return error.message || String(error)
}

async function fetchGitHubStats() {
    const response = await fetch('https://api.github.com/repos/OpenAdaptAI/OpenAdapt', {
        headers: { 'User-Agent': 'OpenAdapt-Web/1.0 (https://openadapt.ai)' },
    })
    if (!response.ok) {
        throw new Error(`GitHub API returned ${response.status}`)
    }
    const data = await response.json()
    return {
        stars: data.stargazers_count || 0,
        forks: data.forks_count || 0,
        watchers: data.subscribers_count || 0,
        issues: data.open_issues_count || 0,
    }
}

function getPosthogConfig() {
    const host = process.env.POSTHOG_HOST || process.env.NEXT_PUBLIC_POSTHOG_HOST || DEFAULT_POSTHOG_HOST
    const projectId = process.env.POSTHOG_PROJECT_ID || process.env.NEXT_PUBLIC_POSTHOG_PROJECT_ID
    const apiKey = process.env.POSTHOG_PERSONAL_API_KEY || process.env.POSTHOG_API_KEY

    if (!projectId || !apiKey) return null
    return { host, projectId, apiKey }
}

async function fetchAllEventDefinitions({ host, projectId, apiKey }) {
    const all = []
    let nextUrl = `${host}/api/projects/${projectId}/event_definitions/?limit=100`
    let pages = 0

    while (nextUrl && pages < MAX_EVENT_DEFINITION_PAGES) {
        const response = await fetch(nextUrl, {
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'User-Agent': 'OpenAdapt-Web/1.0',
            },
        })
        if (!response.ok) {
            throw new Error(`PostHog API returned ${response.status} for event_definitions`)
        }
        const data = await response.json()
        const results = Array.isArray(data.results) ? data.results : []
        all.push(...results)
        nextUrl = data.next || null
        pages += 1
    }

    return all
}

function valueFromDefinition(definition) {
    const maybeNumber = Number(definition?.volume_30_day)
    return Number.isFinite(maybeNumber) ? maybeNumber : 0
}

function sumByEventNames(definitions, candidateNames) {
    const target = new Set(candidateNames.map((name) => name.toLowerCase()))
    let total = 0
    const matched = []

    for (const definition of definitions) {
        const name = String(definition?.name || '').toLowerCase()
        if (!target.has(name)) continue
        const value = valueFromDefinition(definition)
        total += value
        matched.push({ name: definition.name, volume_30_day: value })
    }

    return { total, matched }
}

async function fetchPosthogUsageMetrics() {
    const config = getPosthogConfig()
    if (!config) {
        return {
            available: false,
            source: 'posthog_not_configured',
            caveats: ['PostHog credentials not configured on server'],
        }
    }

    const definitions = await fetchAllEventDefinitions(config)

    const demos = sumByEventNames(definitions, [
        'recording_finished',
        'recording_completed',
        'demo_recorded',
        'demo_completed',
    ])
    const runs = sumByEventNames(definitions, [
        'automation_run',
        'agent_run',
        'benchmark_run',
        'replay_started',
        'episode_started',
    ])
    const actions = sumByEventNames(definitions, [
        'action_executed',
        'step_executed',
        'mouse_click',
        'keyboard_input',
        'ui_action',
    ])

    return {
        available: demos.total > 0 || runs.total > 0 || actions.total > 0,
        source: 'posthog_event_definitions',
        demosRecorded30d: demos.total,
        agentRuns30d: runs.total,
        guiActions30d: actions.total,
        matchedEvents: {
            demos: demos.matched,
            runs: runs.matched,
            actions: actions.matched,
        },
        caveats: [
            'Derived from PostHog volume_30_day on matched event names',
            'Event naming consistency affects metric completeness',
        ],
    }
}

function getEnvOverrideUsageMetrics() {
    const demos = parseIntEnv('OPENADAPT_METRIC_DEMOS_RECORDED_30D')
    const runs = parseIntEnv('OPENADAPT_METRIC_AGENT_RUNS_30D')
    const actions = parseIntEnv('OPENADAPT_METRIC_GUI_ACTIONS_30D')
    const apps = parseIntEnv('OPENADAPT_METRIC_APPS_AUTOMATED')

    const hasAny = [demos, runs, actions, apps].some((value) => value !== null)
    return {
        available: hasAny,
        source: hasAny ? 'env_override' : 'env_override_not_set',
        demosRecorded30d: demos,
        agentRuns30d: runs,
        guiActions30d: actions,
        appsAutomated: apps,
        caveats: hasAny
            ? ['Values supplied via OPENADAPT_METRIC_* environment variables']
            : ['No OPENADAPT_METRIC_* overrides configured'],
    }
}

function mergeUsageMetrics(primary, fallback) {
    const merged = {
        demosRecorded30d:
            primary.demosRecorded30d ?? fallback.demosRecorded30d ?? null,
        agentRuns30d:
            primary.agentRuns30d ?? fallback.agentRuns30d ?? null,
        guiActions30d:
            primary.guiActions30d ?? fallback.guiActions30d ?? null,
        appsAutomated:
            primary.appsAutomated ?? fallback.appsAutomated ?? null,
    }

    return {
        available: [merged.demosRecorded30d, merged.agentRuns30d, merged.guiActions30d, merged.appsAutomated]
            .some((value) => typeof value === 'number'),
        source: primary.available ? primary.source : fallback.source,
        caveats: [...(primary.caveats || []), ...(fallback.caveats || [])],
        matchedEvents: primary.matchedEvents || null,
        ...merged,
    }
}

export default async function handler(req, res) {
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=900')

    const response = {
        github: null,
        usage: null,
        generated_at: new Date().toISOString(),
        warnings: [],
    }

    try {
        response.github = await fetchGitHubStats()
    } catch (error) {
        response.warnings.push(`github_fetch_failed:${formatError(error)}`)
    }

    const envUsage = getEnvOverrideUsageMetrics()
    try {
        const posthogUsage = await fetchPosthogUsageMetrics()
        response.usage = mergeUsageMetrics(posthogUsage, envUsage)
    } catch (error) {
        response.warnings.push(`posthog_fetch_failed:${formatError(error)}`)
        response.usage = mergeUsageMetrics(
            {
                available: false,
                source: 'posthog_error',
                caveats: ['PostHog request failed'],
                demosRecorded30d: null,
                agentRuns30d: null,
                guiActions30d: null,
                appsAutomated: null,
            },
            envUsage
        )
    }

    return res.status(200).json(response)
}
