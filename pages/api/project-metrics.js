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
const CLASSIFICATION_VERSION = '2026-03-06'

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

const TELEMETRY_DATA_MODEL = {
    sdk: 'openadapt-telemetry',
    sdkVersion: '0.1.0',
    metricsDashboardReadsOnly: [
        'event name',
        'event timestamp (aggregated windows: 30d/90d/all-time)',
        'aggregated event count',
    ],
    commonEventFields: [
        'category',
        'timestamp',
        'package_name',
        'success',
        'duration_ms',
        'item_count',
        'command',
        'operation',
    ],
    commonTags: [
        'internal',
        'package',
        'package_version',
        'python_version',
        'os',
        'os_version',
        'ci',
    ],
}

const TELEMETRY_PRIVACY_CONTROLS = {
    neverCollect: [
        'screenshots or images',
        'raw text or file contents',
        'API keys or passwords',
        'PII user profile fields (name/email/IP)',
    ],
    scrubPolicy: [
        'PII-like keys are redacted (password/token/api_key/etc.)',
        'emails/phones/secrets are pattern-scrubbed',
        'file paths are sanitized to remove usernames',
        'user IDs are anonymized before upload',
        'send_default_pii is enforced false',
    ],
    optOutEnvVars: [
        'DO_NOT_TRACK=1',
        'OPENADAPT_TELEMETRY_ENABLED=false',
    ],
}

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

function _serializePattern(pattern) {
    if (pattern instanceof RegExp) {
        return pattern.toString()
    }
    return String(pattern)
}

function buildTransparencyMetadata() {
    return {
        classificationVersion: CLASSIFICATION_VERSION,
        metricScope: {
            summary: 'Homepage metrics use aggregate telemetry counts (no raw event payloads are displayed).',
            includedMetricFamilies: ['total_events', 'agent_runs', 'gui_actions', 'demos_recorded'],
        },
        includedEventNames: {
            demos: [...EVENT_CLASSIFICATION.demos.exact],
            runs: [...EVENT_CLASSIFICATION.runs.exact],
            actions: [...EVENT_CLASSIFICATION.actions.exact],
        },
        ignoredEventNames: Array.from(IGNORED_EVENT_NAMES).sort(),
        ignoredEventPatterns: IGNORED_EVENT_PATTERNS.map(_serializePattern),
        fallbackPatterns: {
            demos: EVENT_CLASSIFICATION.demos.fallbackPatterns.map(_serializePattern),
            runs: EVENT_CLASSIFICATION.runs.fallbackPatterns.map(_serializePattern),
            actions: EVENT_CLASSIFICATION.actions.fallbackPatterns.map(_serializePattern),
        },
        telemetryDataModel: TELEMETRY_DATA_MODEL,
        privacyControls: TELEMETRY_PRIVACY_CONTROLS,
        sourceLinks: {
            privacyPolicy: '/privacy-policy',
            telemetryReadme: 'https://github.com/OpenAdaptAI/openadapt-telemetry#readme',
            telemetryPrivacyCode:
                'https://github.com/OpenAdaptAI/openadapt-telemetry/blob/main/src/openadapt_telemetry/privacy.py',
        },
    }
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

async function runHogQLCount({ host, projectId, apiKey, eventNames }) {
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
                        countIf(event IN (${toSqlInList(eventNames)}) AND timestamp >= now() - INTERVAL 30 DAY),
                        countIf(event IN (${toSqlInList(eventNames)}) AND timestamp >= now() - INTERVAL 90 DAY),
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
    const value90d = Number(payload?.results?.[0]?.[1])
    const valueAllTime = Number(payload?.results?.[0]?.[2])
    return {
        value30d: Number.isFinite(value30d) ? value30d : 0,
        value90d: Number.isFinite(value90d) ? value90d : 0,
        valueAllTime: Number.isFinite(valueAllTime) ? valueAllTime : 0,
    }
}

async function runHogQLTotalCounts({ host, projectId, apiKey }) {
    const ignoredNames = uniqueNames(Array.from(IGNORED_EVENT_NAMES))
    const ignoredClause = ignoredNames.length > 0
        ? `event NOT IN (${toSqlInList(ignoredNames)})`
        : '1 = 1'
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
                        countIf(${ignoredClause} AND timestamp >= now() - INTERVAL 30 DAY),
                        countIf(${ignoredClause} AND timestamp >= now() - INTERVAL 90 DAY),
                        countIf(${ignoredClause})
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
        throw new Error(`PostHog total-events query returned ${response.status}: ${detail}`)
    }

    const value30d = Number(payload?.results?.[0]?.[0])
    const value90d = Number(payload?.results?.[0]?.[1])
    const valueAllTime = Number(payload?.results?.[0]?.[2])
    return {
        value30d: Number.isFinite(value30d) ? value30d : 0,
        value90d: Number.isFinite(value90d) ? value90d : 0,
        valueAllTime: Number.isFinite(valueAllTime) ? valueAllTime : 0,
    }
}

async function runHogQLFirstSeen({ host, projectId, apiKey, eventNames }) {
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
                        min(timestamp)
                    FROM events
                    WHERE event IN (${toSqlInList(eventNames)})
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
        throw new Error(`PostHog first-seen query returned ${response.status}: ${detail}`)
    }

    const raw = payload?.results?.[0]?.[0]
    return raw ? String(raw) : null
}

async function fetchPosthogQueryUsageMetrics({ host, projectId, apiKey }) {
    const demosNames = uniqueNames(EVENT_CLASSIFICATION.demos.exact)
    const runsNames = uniqueNames(EVENT_CLASSIFICATION.runs.exact)
    const actionsNames = uniqueNames(EVENT_CLASSIFICATION.actions.exact)
    const coverageStartNames = uniqueNames([...demosNames, ...runsNames, ...actionsNames])

    const [demos, runs, actions, totals, telemetryCoverageStartDate] = await Promise.all([
        runHogQLCount({ host, projectId, apiKey, eventNames: demosNames }),
        runHogQLCount({ host, projectId, apiKey, eventNames: runsNames }),
        runHogQLCount({ host, projectId, apiKey, eventNames: actionsNames }),
        runHogQLTotalCounts({ host, projectId, apiKey }),
        runHogQLFirstSeen({ host, projectId, apiKey, eventNames: coverageStartNames }),
    ])

    return {
        available: true,
        source: 'posthog_query_api',
        demosRecorded30d: demos.value30d,
        demosRecorded90d: demos.value90d,
        agentRuns30d: runs.value30d,
        agentRuns90d: runs.value90d,
        guiActions30d: actions.value30d,
        guiActions90d: actions.value90d,
        demosRecordedAllTime: demos.valueAllTime,
        agentRunsAllTime: runs.valueAllTime,
        guiActionsAllTime: actions.valueAllTime,
        totalEvents30d: totals.value30d,
        totalEvents90d: totals.value90d,
        totalEventsAllTime: totals.valueAllTime,
        telemetryCoverageStartDate,
        hasAnyVolume:
            demos.value30d > 0 ||
            runs.value30d > 0 ||
            actions.value30d > 0 ||
            demos.value90d > 0 ||
            runs.value90d > 0 ||
            actions.value90d > 0 ||
            totals.value30d > 0 ||
            totals.value90d > 0,
        caveats: ['Derived from PostHog query API (exact event-name classification + non-ignored totals)'],
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
            demosRecorded90d: null,
            agentRuns30d: null,
            agentRuns90d: null,
            guiActions30d: null,
            guiActions90d: null,
            demosRecordedAllTime: null,
            agentRunsAllTime: null,
            guiActionsAllTime: null,
            totalEvents30d: null,
            totalEvents90d: null,
            totalEventsAllTime: null,
            telemetryCoverageStartDate: null,
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
    const totalEvents30d = entries.reduce((sum, entry) => sum + entry.volume_30_day, 0)
    const hasAnyVolume =
        demos.total > 0 ||
        runs.total > 0 ||
        actions.total > 0 ||
        totalEvents30d > 0

    return {
        // "available" means PostHog data source is configured/reachable, not
        // necessarily that recent event volume is non-zero.
        available: true,
        source: 'posthog_event_definitions',
        demosRecorded30d: demos.total,
        demosRecorded90d: null,
        agentRuns30d: runs.total,
        agentRuns90d: null,
        guiActions30d: actions.total,
        guiActions90d: null,
        demosRecordedAllTime: null,
        agentRunsAllTime: null,
        guiActionsAllTime: null,
        totalEvents30d,
        totalEvents90d: null,
        totalEventsAllTime: null,
        telemetryCoverageStartDate: null,
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
        classificationVersion: CLASSIFICATION_VERSION,
        caveats: [
            'Derived from PostHog volume_30_day by exact event-name classification',
            'Falls back to guarded pattern matching only when exact mapping has no data',
        ],
    }
}

function getEnvOverrideUsageMetrics() {
    const demos = parseIntEnv('OPENADAPT_METRIC_DEMOS_RECORDED_30D')
    const demos90d = parseIntEnv('OPENADAPT_METRIC_DEMOS_RECORDED_90D')
    const runs = parseIntEnv('OPENADAPT_METRIC_AGENT_RUNS_30D')
    const runs90d = parseIntEnv('OPENADAPT_METRIC_AGENT_RUNS_90D')
    const actions = parseIntEnv('OPENADAPT_METRIC_GUI_ACTIONS_30D')
    const actions90d = parseIntEnv('OPENADAPT_METRIC_GUI_ACTIONS_90D')
    const demosAllTime = parseIntEnv('OPENADAPT_METRIC_DEMOS_RECORDED_ALL_TIME')
    const runsAllTime = parseIntEnv('OPENADAPT_METRIC_AGENT_RUNS_ALL_TIME')
    const actionsAllTime = parseIntEnv('OPENADAPT_METRIC_GUI_ACTIONS_ALL_TIME')
    const totalEvents30d = parseIntEnv('OPENADAPT_METRIC_TOTAL_EVENTS_30D')
    const totalEvents90d = parseIntEnv('OPENADAPT_METRIC_TOTAL_EVENTS_90D')
    const totalEventsAllTime = parseIntEnv('OPENADAPT_METRIC_TOTAL_EVENTS_ALL_TIME')
    const apps = parseIntEnv('OPENADAPT_METRIC_APPS_AUTOMATED')
    const telemetryCoverageStartDate = process.env.OPENADAPT_METRIC_USAGE_START_DATE || null

    const hasAny = [
        demos, demos90d, runs, runs90d, actions, actions90d,
        demosAllTime, runsAllTime, actionsAllTime,
        totalEvents30d, totalEvents90d, totalEventsAllTime,
        apps,
    ]
        .some((value) => value !== null)
    return {
        available: hasAny,
        source: hasAny ? 'env_override' : 'env_override_not_set',
        demosRecorded30d: demos,
        demosRecorded90d: demos90d ?? demos,
        agentRuns30d: runs,
        agentRuns90d: runs90d ?? runs,
        guiActions30d: actions,
        guiActions90d: actions90d ?? actions,
        demosRecordedAllTime: demosAllTime,
        agentRunsAllTime: runsAllTime,
        guiActionsAllTime: actionsAllTime,
        totalEvents30d,
        totalEvents90d: totalEvents90d ?? totalEvents30d,
        totalEventsAllTime,
        appsAutomated: apps,
        telemetryCoverageStartDate,
        caveats: hasAny
            ? ['Values supplied via OPENADAPT_METRIC_* environment variables']
            : ['No OPENADAPT_METRIC_* overrides configured'],
    }
}

function mergeUsageMetrics(primary, fallback) {
    const merged = {
        demosRecorded30d:
            primary.demosRecorded30d ?? fallback.demosRecorded30d ?? null,
        demosRecorded90d:
            primary.demosRecorded90d ?? fallback.demosRecorded90d ?? null,
        agentRuns30d:
            primary.agentRuns30d ?? fallback.agentRuns30d ?? null,
        agentRuns90d:
            primary.agentRuns90d ?? fallback.agentRuns90d ?? null,
        guiActions30d:
            primary.guiActions30d ?? fallback.guiActions30d ?? null,
        guiActions90d:
            primary.guiActions90d ?? fallback.guiActions90d ?? null,
        demosRecordedAllTime:
            primary.demosRecordedAllTime ?? fallback.demosRecordedAllTime ?? null,
        agentRunsAllTime:
            primary.agentRunsAllTime ?? fallback.agentRunsAllTime ?? null,
        guiActionsAllTime:
            primary.guiActionsAllTime ?? fallback.guiActionsAllTime ?? null,
        totalEvents30d:
            primary.totalEvents30d ?? fallback.totalEvents30d ?? null,
        totalEvents90d:
            primary.totalEvents90d ?? fallback.totalEvents90d ?? null,
        totalEventsAllTime:
            primary.totalEventsAllTime ?? fallback.totalEventsAllTime ?? null,
        appsAutomated:
            primary.appsAutomated ?? fallback.appsAutomated ?? null,
        telemetryCoverageStartDate:
            primary.telemetryCoverageStartDate ?? fallback.telemetryCoverageStartDate ?? null,
    }

    return {
        available: [
            merged.demosRecorded30d,
            merged.demosRecorded90d,
            merged.agentRuns30d,
            merged.agentRuns90d,
            merged.guiActions30d,
            merged.guiActions90d,
            merged.demosRecordedAllTime,
            merged.agentRunsAllTime,
            merged.guiActionsAllTime,
            merged.totalEvents30d,
            merged.totalEvents90d,
            merged.totalEventsAllTime,
            merged.appsAutomated,
        ].some((value) => typeof value === 'number'),
        source:
            primary.available
                ? primary.source
                : (fallback.available ? fallback.source : (primary.source || fallback.source)),
        caveats: [...(primary.caveats || []), ...(fallback.caveats || [])],
        matchedEvents: primary.matchedEvents || null,
        strategies: primary.strategies || null,
        transparency: buildTransparencyMetadata(),
        ...merged,
    }
}

function isCacheableUsageSource(source) {
    const normalized = String(source || '')
    return normalized === 'posthog_query_api' || normalized === 'posthog_event_definitions'
}

function hasUsableGithubPayload(github) {
    return typeof github?.stars === 'number' && typeof github?.forks === 'number'
}

function cacheControlForResponse(response) {
    const posthogOk = isCacheableUsageSource(response?.usage?.source)
    const githubOk = hasUsableGithubPayload(response?.github)
    // Only cache when both sources are healthy to avoid caching partial dashboards.
    if (posthogOk && githubOk) {
        return 'public, max-age=30, s-maxage=120, stale-while-revalidate=300'
    }
    return 'no-store, max-age=0'
}

export default async function handler(req, res) {
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
                demosRecorded90d: null,
                agentRuns30d: null,
                agentRuns90d: null,
                guiActions30d: null,
                guiActions90d: null,
                demosRecordedAllTime: null,
                agentRunsAllTime: null,
                guiActionsAllTime: null,
                totalEvents30d: null,
                totalEvents90d: null,
                totalEventsAllTime: null,
                appsAutomated: null,
                telemetryCoverageStartDate: null,
            },
            envUsage
        )
    }

    res.setHeader('Cache-Control', cacheControlForResponse(response))
    res.setHeader('X-OpenAdapt-Metrics-Source', String(response?.usage?.source || 'unknown'))
    return res.status(200).json(response)
}
