/**
 * Aggregated project metrics for homepage credibility signals.
 *
 * Priority:
 * 1) GitHub repository stats (stars/forks/watchers/issues)
 * 2) Usage metrics from PostHog (if configured) or env overrides
 * 3) Explicit caveats/source metadata for transparency
 */

const DEFAULT_POSTHOG_HOST = 'https://us.posthog.com'
const DEFAULT_POSTHOG_PROJECT_ID = '68185'
const MAX_EVENT_DEFINITION_PAGES = 5
const FALLBACK_PATTERN_LIMIT = 30
const GITHUB_ORG = 'OpenAdaptAI'

// Canonical event names from OpenAdapt codebases (legacy PostHog + shared telemetry conventions).
const EVENT_CLASSIFICATION = {
    demos: {
        exact: [
            'recording_finished',
            'recording_completed',
            'demo_recorded',
            'demo_completed',
            'recording.stopped',
            'recording.saved',
            'record.stopped',
            'capture.completed',
            'capture.saved',
        ],
        fallbackPatterns: [
            /(?:^|[._:-])(demo|record|recording|capture)(?:[._:-]|$)/i,
            /(?:finished|completed|saved|recorded|stopped)$/i,
            /^command:(capture|record)/i,
            /^operation:(capture|record)/i,
        ],
    },
    runs: {
        exact: [
            'automation_run',
            'agent_run',
            'benchmark_run',
            'replay_started',
            'episode_started',
            'replay.started',
        ],
        fallbackPatterns: [
            /(?:^|[._:-])(replay|benchmark|eval|episode|agent_run|automation_run)(?:[._:-]|$)/i,
            /^command:(replay|run|eval|benchmark|execute|agent)/i,
            /^operation:(replay|run|eval|benchmark|execute|agent)/i,
        ],
    },
    actions: {
        exact: [
            'action_executed',
            'step_executed',
            'mouse_click',
            'keyboard_input',
            'ui_action',
            'action_triggered',
        ],
        fallbackPatterns: [
            /(?:^|[._:-])(action|step|click|keyboard|mouse|scroll|key|keypress|type|drag)(?:[._:-]|$)/i,
            /^operation:.*(?:action|step|click|type|scroll|press|key|mouse)/i,
        ],
    },
}

const IGNORED_EVENT_NAMES = new Set([
    'function_trace',
    'get_events.started',
    'get_events.completed',
    'visualize.started',
    'visualize.completed',
])

const IGNORED_EVENT_PATTERNS = [
    /^error[:._-]/i,
    /^exception[:._-]/i,
    /(?:^|[._:-])(startup|shutdown)(?:[._:-]|$)/i,
]

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

async function fetchWithTimeout(url, options = {}, timeoutMs = 8000) {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs)
    try {
        return await fetch(url, { ...options, signal: controller.signal })
    } catch (error) {
        if (error?.name === 'AbortError') {
            throw new Error(`Request timed out after ${timeoutMs}ms`)
        }
        throw error
    } finally {
        clearTimeout(timeoutId)
    }
}

async function fetchGitHubStats() {
    const repos = []
    let page = 1
    while (true) {
        const response = await fetchWithTimeout(
            `https://api.github.com/orgs/${GITHUB_ORG}/repos?per_page=100&page=${page}&type=public`,
            {
                headers: { 'User-Agent': 'OpenAdapt-Web/1.0 (https://openadapt.ai)' },
            }
        )
        if (!response.ok) {
            throw new Error(`GitHub API returned ${response.status}`)
        }
        const batch = await response.json()
        if (!Array.isArray(batch) || batch.length === 0) break
        repos.push(...batch)
        page += 1
    }

    const openadaptRepos = repos.filter((repo) => {
        const name = String(repo?.name || '').toLowerCase()
        return !repo?.private && !repo?.archived && (name === 'openadapt' || name.startsWith('openadapt-'))
    })

    const stars = openadaptRepos.reduce((sum, repo) => sum + (repo?.stargazers_count || 0), 0)
    const forks = openadaptRepos.reduce((sum, repo) => sum + (repo?.forks_count || 0), 0)

    return {
        stars,
        forks,
        repoCount: openadaptRepos.length,
    }
}

function getPosthogConfig() {
    const host = process.env.POSTHOG_HOST || process.env.NEXT_PUBLIC_POSTHOG_HOST || DEFAULT_POSTHOG_HOST
    const projectId =
        process.env.POSTHOG_PROJECT_ID ||
        process.env.NEXT_PUBLIC_POSTHOG_PROJECT_ID ||
        DEFAULT_POSTHOG_PROJECT_ID
    const apiKey = process.env.POSTHOG_PERSONAL_API_KEY || process.env.POSTHOG_API_KEY

    if (!apiKey) return null
    return { host: normalizePosthogApiHost(host), projectId, apiKey }
}

function normalizePosthogApiHost(host) {
    if (!host) return DEFAULT_POSTHOG_HOST
    // Private API endpoints should target app domains, not ingestion domains.
    // e.g. us.i.posthog.com -> us.posthog.com
    return String(host).replace('.i.posthog.com', '.posthog.com')
}

async function resolveProjectId({ host, projectId, apiKey }) {
    if (projectId) return projectId

    const response = await fetchWithTimeout(`${host}/api/projects/?limit=100`, {
        headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'User-Agent': 'OpenAdapt-Web/1.0',
        },
    })
    if (!response.ok) {
        throw new Error(`PostHog API returned ${response.status} for projects`)
    }
    const payload = await response.json()
    const projects = Array.isArray(payload) ? payload : payload?.results || []

    if (!projects.length) {
        throw new Error('No PostHog projects returned for API key')
    }

    const preferred = projects.find((project) =>
        String(project?.name || '').toLowerCase().includes('openadapt')
    )
    const selected = preferred || projects[0]
    return String(selected.id)
}

function uniqueNames(input) {
    const out = new Set()
    for (const raw of input || []) {
        const name = String(raw || '').trim().toLowerCase()
        if (name) out.add(name)
    }
    return [...out]
}

function toSqlInList(names) {
    return names
        .map((name) => `'${name.replaceAll("'", "''")}'`)
        .join(', ')
}

async function runHogQLCount({ host, projectId, apiKey, eventNames, days }) {
    const response = await fetchWithTimeout(`${host}/api/projects/${projectId}/query/`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'User-Agent': 'OpenAdapt-Web/1.0',
        },
        body: JSON.stringify({
            query: {
                kind: 'HogQLQuery',
                query: `
                    SELECT
                        countIf(event IN (${toSqlInList(eventNames)}) AND timestamp >= now() - INTERVAL ${Math.floor(days)} DAY),
                        countIf(event IN (${toSqlInList(eventNames)}))
                    FROM events
                `.trim(),
            },
        }),
    })

    let payload = {}
    try {
        payload = await response.json()
    } catch {
        payload = {}
    }

    if (!response.ok) {
        const detail = payload?.detail || payload?.code || `HTTP ${response.status}`
        throw new Error(`PostHog query API returned ${response.status}: ${detail}`)
    }

    const value30d = Number(payload?.results?.[0]?.[0])
    const valueAllTime = Number(payload?.results?.[0]?.[1])
    return {
        value30d: Number.isFinite(value30d) ? value30d : 0,
        valueAllTime: Number.isFinite(valueAllTime) ? valueAllTime : 0,
    }
}

async function fetchPosthogQueryUsageMetrics({ host, projectId, apiKey }) {
    const demosNames = uniqueNames(EVENT_CLASSIFICATION.demos.exact)
    const runsNames = uniqueNames(EVENT_CLASSIFICATION.runs.exact)
    const actionsNames = uniqueNames(EVENT_CLASSIFICATION.actions.exact)

    const [demos, runs, actions] = await Promise.all([
        runHogQLCount({ host, projectId, apiKey, eventNames: demosNames, days: 30 }),
        runHogQLCount({ host, projectId, apiKey, eventNames: runsNames, days: 30 }),
        runHogQLCount({ host, projectId, apiKey, eventNames: actionsNames, days: 30 }),
    ])

    return {
        available: true,
        source: 'posthog_query_api',
        demosRecorded30d: demos.value30d,
        agentRuns30d: runs.value30d,
        guiActions30d: actions.value30d,
        demosRecordedAllTime: demos.valueAllTime,
        agentRunsAllTime: runs.valueAllTime,
        guiActionsAllTime: actions.valueAllTime,
        hasAnyVolume: demos.value30d > 0 || runs.value30d > 0 || actions.value30d > 0,
        caveats: ['Derived from PostHog query API (exact event-name families)'],
    }
}

async function fetchAllEventDefinitions({ host, projectId, apiKey }) {
    const all = []
    let nextUrl = `${host}/api/projects/${projectId}/event_definitions/?limit=100`
    let pages = 0

    while (nextUrl && pages < MAX_EVENT_DEFINITION_PAGES) {
        const response = await fetchWithTimeout(nextUrl, {
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
    const rawValue = definition?.volume_30_day
    if (rawValue === null || rawValue === undefined) return null
    const maybeNumber = Number(rawValue)
    return Number.isFinite(maybeNumber) ? maybeNumber : null
}

function normalizeEventName(name) {
    return String(name || '').trim().toLowerCase()
}

function shouldIgnoreEvent(name) {
    if (IGNORED_EVENT_NAMES.has(name)) return true
    return IGNORED_EVENT_PATTERNS.some((pattern) => pattern.test(name))
}

function toEventEntries(definitions) {
    return definitions
        .map((definition) => ({
            definition,
            name: normalizeEventName(definition?.name),
            volume_30_day: valueFromDefinition(definition),
        }))
        .filter((entry) => entry.name && entry.volume_30_day !== null && !shouldIgnoreEvent(entry.name))
}

function sumByEventNames(entries, candidateNames) {
    const target = new Set(candidateNames.map((name) => name.toLowerCase()))
    let total = 0
    const matched = []

    for (const entry of entries) {
        if (!target.has(entry.name)) continue
        total += entry.volume_30_day
        matched.push({ name: entry.definition.name, volume_30_day: entry.volume_30_day })
    }

    return { total, matched, strategy: 'exact' }
}

function sumByFallbackPatterns(entries, patterns, excludedNames = new Set()) {
    let total = 0
    const matched = []

    for (const entry of entries) {
        if (excludedNames.has(entry.name)) continue
        if (!patterns.some((pattern) => pattern.test(entry.name))) continue
        total += entry.volume_30_day
        matched.push({ name: entry.definition.name, volume_30_day: entry.volume_30_day })
    }

    matched.sort((a, b) => b.volume_30_day - a.volume_30_day)
    const sliced = matched.slice(0, FALLBACK_PATTERN_LIMIT)

    return {
        total,
        matched: sliced,
        strategy: 'pattern_fallback',
        truncated: matched.length > FALLBACK_PATTERN_LIMIT,
    }
}

function buildCategoryMetrics(entries, config) {
    const exact = sumByEventNames(entries, config.exact)
    if (exact.total > 0) {
        return exact
    }

    const fallback = sumByFallbackPatterns(entries, config.fallbackPatterns || [])
    if (fallback.total > 0) {
        return fallback
    }

    return { total: 0, matched: [], strategy: 'none' }
}

async function fetchPosthogUsageMetrics() {
    const config = getPosthogConfig()
    if (!config) {
        return {
            available: false,
            source: 'posthog_not_configured',
            caveats: ['PostHog personal API key not configured on server'],
        }
    }
    if (String(config.apiKey).startsWith('phc_')) {
        return {
            available: false,
            source: 'posthog_not_configured',
            caveats: [
                'POSTHOG_PERSONAL_API_KEY (phx_) is required for metrics reads',
                'Legacy POSTHOG_PUBLIC_KEY (phc_) is ingestion-only and cannot query event definitions',
            ],
        }
    }

    const resolvedProjectId = await resolveProjectId(config)
    try {
        const queryUsage = await fetchPosthogQueryUsageMetrics({
            ...config,
            projectId: resolvedProjectId,
        })
        return {
            ...queryUsage,
            caveats: [
                ...(queryUsage.caveats || []),
                config.projectId ? 'Using configured POSTHOG_PROJECT_ID' : 'POSTHOG_PROJECT_ID auto-resolved from API key',
            ],
        }
    } catch (error) {
        const errorMessage = formatError(error)
        const missingQueryScope = errorMessage.includes("scope 'query:read'")
        const fallbackCaveats = missingQueryScope
            ? ["PostHog key missing 'query:read'; falling back to event definitions"]
            : [`PostHog query API unavailable (${errorMessage}); falling back to event definitions`]

        const fallbackUsage = await fetchPosthogUsageFromEventDefinitions({
            ...config,
            projectId: resolvedProjectId,
        })
        return {
            ...fallbackUsage,
            caveats: [...fallbackCaveats, ...(fallbackUsage.caveats || [])],
        }
    }
}

async function fetchPosthogUsageFromEventDefinitions(config) {
    const definitions = await fetchAllEventDefinitions({
        ...config,
        projectId: config.projectId,
    })

    const hasAny30dVolumeData = definitions.some((definition) => {
        const value = valueFromDefinition(definition)
        return value !== null
    })

    if (!hasAny30dVolumeData) {
        return {
            available: false,
            source: 'posthog_event_definitions_unavailable',
            demosRecorded30d: null,
            agentRuns30d: null,
            guiActions30d: null,
            demosRecordedAllTime: null,
            agentRunsAllTime: null,
            guiActionsAllTime: null,
            hasAnyVolume: false,
            matchedEvents: {
                demos: [],
                runs: [],
                actions: [],
            },
            strategies: {
                demos: 'none',
                runs: 'none',
                actions: 'none',
            },
            caveats: [
                'PostHog event_definitions API did not return usable volume_30_day values',
                "Grant 'query:read' to POSTHOG_PERSONAL_API_KEY for accurate usage counters",
            ],
        }
    }

    const entries = toEventEntries(definitions)
    const demos = buildCategoryMetrics(entries, EVENT_CLASSIFICATION.demos)
    const runs = buildCategoryMetrics(entries, EVENT_CLASSIFICATION.runs)
    const actions = buildCategoryMetrics(entries, EVENT_CLASSIFICATION.actions)
    const hasAnyVolume = demos.total > 0 || runs.total > 0 || actions.total > 0

    return {
        // "available" means PostHog data source is configured/reachable, not
        // necessarily that recent event volume is non-zero.
        available: true,
        source: 'posthog_event_definitions',
        demosRecorded30d: demos.total,
        agentRuns30d: runs.total,
        guiActions30d: actions.total,
        demosRecordedAllTime: null,
        agentRunsAllTime: null,
        guiActionsAllTime: null,
        hasAnyVolume,
        matchedEvents: {
            demos: demos.matched,
            runs: runs.matched,
            actions: actions.matched,
        },
        strategies: {
            demos: demos.strategy,
            runs: runs.strategy,
            actions: actions.strategy,
        },
        classificationVersion: '2026-03-05',
        caveats: [
            'Derived from PostHog volume_30_day by exact event-name classification',
            'Falls back to guarded pattern matching only when exact mapping has no data',
        ],
    }
}

function getEnvOverrideUsageMetrics() {
    const demos = parseIntEnv('OPENADAPT_METRIC_DEMOS_RECORDED_30D')
    const runs = parseIntEnv('OPENADAPT_METRIC_AGENT_RUNS_30D')
    const actions = parseIntEnv('OPENADAPT_METRIC_GUI_ACTIONS_30D')
    const demosAllTime = parseIntEnv('OPENADAPT_METRIC_DEMOS_RECORDED_ALL_TIME')
    const runsAllTime = parseIntEnv('OPENADAPT_METRIC_AGENT_RUNS_ALL_TIME')
    const actionsAllTime = parseIntEnv('OPENADAPT_METRIC_GUI_ACTIONS_ALL_TIME')
    const apps = parseIntEnv('OPENADAPT_METRIC_APPS_AUTOMATED')

    const hasAny = [demos, runs, actions, demosAllTime, runsAllTime, actionsAllTime, apps]
        .some((value) => value !== null)
    return {
        available: hasAny,
        source: hasAny ? 'env_override' : 'env_override_not_set',
        demosRecorded30d: demos,
        agentRuns30d: runs,
        guiActions30d: actions,
        demosRecordedAllTime: demosAllTime,
        agentRunsAllTime: runsAllTime,
        guiActionsAllTime: actionsAllTime,
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
        demosRecordedAllTime:
            primary.demosRecordedAllTime ?? fallback.demosRecordedAllTime ?? null,
        agentRunsAllTime:
            primary.agentRunsAllTime ?? fallback.agentRunsAllTime ?? null,
        guiActionsAllTime:
            primary.guiActionsAllTime ?? fallback.guiActionsAllTime ?? null,
        appsAutomated:
            primary.appsAutomated ?? fallback.appsAutomated ?? null,
    }

    return {
        available: [
            merged.demosRecorded30d,
            merged.agentRuns30d,
            merged.guiActions30d,
            merged.demosRecordedAllTime,
            merged.agentRunsAllTime,
            merged.guiActionsAllTime,
            merged.appsAutomated,
        ].some((value) => typeof value === 'number'),
        source: primary.available ? primary.source : fallback.source,
        caveats: [...(primary.caveats || []), ...(fallback.caveats || [])],
        matchedEvents: primary.matchedEvents || null,
        strategies: primary.strategies || null,
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

    const envUsage = getEnvOverrideUsageMetrics()
    const [githubResult, posthogResult] = await Promise.allSettled([
        fetchGitHubStats(),
        fetchPosthogUsageMetrics(),
    ])

    if (githubResult.status === 'fulfilled') {
        response.github = githubResult.value
    } else {
        response.warnings.push(`github_fetch_failed:${formatError(githubResult.reason)}`)
    }

    if (posthogResult.status === 'fulfilled') {
        response.usage = mergeUsageMetrics(posthogResult.value, envUsage)
    } else {
        response.warnings.push(`posthog_fetch_failed:${formatError(posthogResult.reason)}`)
        response.usage = mergeUsageMetrics(
            {
                available: false,
                source: 'posthog_error',
                caveats: ['PostHog request failed'],
                demosRecorded30d: null,
                agentRuns30d: null,
                guiActions30d: null,
                demosRecordedAllTime: null,
                agentRunsAllTime: null,
                guiActionsAllTime: null,
                appsAutomated: null,
            },
            envUsage
        )
    }

    return res.status(200).json(response)
}
