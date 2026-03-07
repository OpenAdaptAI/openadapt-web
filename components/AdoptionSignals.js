import React, { useEffect, useMemo, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faBolt,
    faChartLine,
    faComputerMouse,
    faWindowRestore,
} from '@fortawesome/free-solid-svg-icons'
import styles from './AdoptionSignals.module.css'

const METRICS_CACHE_KEY = 'openadapt:adoption-signals:v4'
const METRICS_CACHE_TTL_MS = 6 * 60 * 60 * 1000
const FETCH_TIMEOUT_MS = 10000
const BREAKDOWN_MIN_EVENTS_90D = 100
const BREAKDOWN_MIN_DAYS = 14

function hasUsableUsageMetrics(payload) {
    const usage = payload?.usage
    if (!usage || usage.available !== true) return false
    const candidates = [
        usage.agentRuns30d,
        usage.agentRuns90d,
        usage.guiActions30d,
        usage.guiActions90d,
        usage.demosRecorded30d,
        usage.demosRecorded90d,
        usage.agentRunsAllTime,
        usage.guiActionsAllTime,
        usage.demosRecordedAllTime,
        usage.totalEvents30d,
        usage.totalEvents90d,
        usage.totalEventsAllTime,
    ]
    return candidates.some((value) => typeof value === 'number')
}

function formatMetric(value) {
    if (value === null || value === undefined || Number.isNaN(value)) return '—'
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `${(value / 1000).toFixed(1)}k`
    return value.toLocaleString()
}

function formatCoverageDate(value) {
    if (!value) return null
    const parsed = new Date(value)
    if (Number.isNaN(parsed.getTime())) return null
    return parsed.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
}

function formatCoverageShortDate(value) {
    if (!value) return null
    const parsed = new Date(value)
    if (Number.isNaN(parsed.getTime())) return null
    return parsed.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
    })
}

function getDaysSince(value) {
    if (!value) return null
    const parsed = new Date(value)
    if (Number.isNaN(parsed.getTime())) return null
    const diffMs = Date.now() - parsed.getTime()
    if (!Number.isFinite(diffMs) || diffMs < 0) return 0
    return Math.floor(diffMs / (24 * 60 * 60 * 1000))
}

function shouldShowSecondary(primaryValue, secondaryValue) {
    if (secondaryValue === null || secondaryValue === undefined || Number.isNaN(secondaryValue)) return false
    if (primaryValue === null || primaryValue === undefined || Number.isNaN(primaryValue)) return true
    if (Number(primaryValue) === Number(secondaryValue)) return false
    return formatMetric(primaryValue) !== formatMetric(secondaryValue)
}

function MetricCard({
    icon,
    value,
    label,
    title,
    secondaryValue,
    secondaryLabel,
    showSecondary = true,
}) {
    return (
        <div className={styles.metricCard} title={title || ''}>
            <div className={styles.metricValue}>
                <FontAwesomeIcon icon={icon} className={styles.metricIcon} />
                {formatMetric(value)}
            </div>
            <div className={styles.metricLabel}>{label}</div>
            {showSecondary && secondaryValue !== null && secondaryValue !== undefined && (
                <div className={styles.metricSecondary}>
                    {formatMetric(secondaryValue)} {secondaryLabel}
                </div>
            )}
        </div>
    )
}

function MetricSkeletonCard() {
    return (
        <div className={`${styles.metricCard} ${styles.metricCardSkeleton}`} aria-hidden="true">
            <div className={styles.metricValue}>
                <span className={styles.skeletonBarLarge} />
            </div>
            <div className={styles.metricLabel}>
                <span className={styles.skeletonBarSmall} />
            </div>
        </div>
    )
}

function asArray(value) {
    return Array.isArray(value) ? value : []
}

function TelemetryTransparencyPanel({ transparency }) {
    if (!transparency) return null

    const included = transparency?.includedEventNames || {}
    const metricFamilies = asArray(transparency?.metricScope?.includedMetricFamilies)
    const ignoredNames = asArray(transparency?.ignoredEventNames)
    const ignoredPatterns = asArray(transparency?.ignoredEventPatterns)
    const fallbackPatterns = transparency?.fallbackPatterns || {}
    const model = transparency?.telemetryDataModel || {}
    const privacy = transparency?.privacyControls || {}
    const links = transparency?.sourceLinks || {}
    const version = transparency?.classificationVersion || 'unknown'

    return (
        <details className={styles.transparencyPanel}>
            <summary className={styles.transparencySummary}>
                Telemetry details (what we collect)
            </summary>
            <div className={styles.transparencyBody}>
                <p className={styles.transparencyIntro}>
                    {transparency?.metricScope?.summary || 'Telemetry metric details.'}
                </p>
                <div className={styles.transparencyMeta}>
                    Classification version: {version}
                </div>

                <div className={styles.transparencySection}>
                    <h4 className={styles.transparencyHeading}>Metric Families</h4>
                    <ul className={styles.transparencyList}>
                        {metricFamilies.map((name) => (
                            <li key={name}>
                                <code>{name}</code>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className={styles.transparencySection}>
                    <h4 className={styles.transparencyHeading}>Included Event Names</h4>
                    <div className={styles.transparencyColumns}>
                        <div>
                            <div className={styles.transparencySubheading}>Demos</div>
                            <ul className={styles.transparencyListCompact}>
                                {asArray(included.demos).map((name) => (
                                    <li key={`demo-${name}`}>
                                        <code>{name}</code>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <div className={styles.transparencySubheading}>Agent Runs</div>
                            <ul className={styles.transparencyListCompact}>
                                {asArray(included.runs).map((name) => (
                                    <li key={`run-${name}`}>
                                        <code>{name}</code>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <div className={styles.transparencySubheading}>GUI Actions</div>
                            <ul className={styles.transparencyListCompact}>
                                {asArray(included.actions).map((name) => (
                                    <li key={`action-${name}`}>
                                        <code>{name}</code>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className={styles.transparencySection}>
                    <h4 className={styles.transparencyHeading}>Excluded / Ignored</h4>
                    <div className={styles.transparencyColumns}>
                        <div>
                            <div className={styles.transparencySubheading}>Ignored Event Names</div>
                            <ul className={styles.transparencyListCompact}>
                                {ignoredNames.map((name) => (
                                    <li key={`ignored-name-${name}`}>
                                        <code>{name}</code>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <div className={styles.transparencySubheading}>Ignored Name Patterns</div>
                            <ul className={styles.transparencyListCompact}>
                                {ignoredPatterns.map((pattern) => (
                                    <li key={`ignored-pattern-${pattern}`}>
                                        <code>{pattern}</code>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className={styles.transparencySection}>
                    <h4 className={styles.transparencyHeading}>Fallback Matching Patterns</h4>
                    <div className={styles.transparencyColumns}>
                        <div>
                            <div className={styles.transparencySubheading}>Demos</div>
                            <ul className={styles.transparencyListCompact}>
                                {asArray(fallbackPatterns.demos).map((pattern) => (
                                    <li key={`fallback-demo-${pattern}`}>
                                        <code>{pattern}</code>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <div className={styles.transparencySubheading}>Agent Runs</div>
                            <ul className={styles.transparencyListCompact}>
                                {asArray(fallbackPatterns.runs).map((pattern) => (
                                    <li key={`fallback-run-${pattern}`}>
                                        <code>{pattern}</code>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <div className={styles.transparencySubheading}>GUI Actions</div>
                            <ul className={styles.transparencyListCompact}>
                                {asArray(fallbackPatterns.actions).map((pattern) => (
                                    <li key={`fallback-action-${pattern}`}>
                                        <code>{pattern}</code>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className={styles.transparencySection}>
                    <h4 className={styles.transparencyHeading}>Common Telemetry Fields</h4>
                    <div className={styles.transparencyColumns}>
                        <div>
                            <div className={styles.transparencySubheading}>Dashboard Reads</div>
                            <ul className={styles.transparencyListCompact}>
                                {asArray(model.metricsDashboardReadsOnly).map((field) => (
                                    <li key={`dashboard-field-${field}`}>
                                        {field}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <div className={styles.transparencySubheading}>Common Event Fields</div>
                            <ul className={styles.transparencyListCompact}>
                                {asArray(model.commonEventFields).map((field) => (
                                    <li key={`event-field-${field}`}>
                                        <code>{field}</code>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <div className={styles.transparencySubheading}>Common Tags</div>
                            <ul className={styles.transparencyListCompact}>
                                {asArray(model.commonTags).map((tag) => (
                                    <li key={`tag-${tag}`}>
                                        <code>{tag}</code>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className={styles.transparencySection}>
                    <h4 className={styles.transparencyHeading}>Privacy Controls</h4>
                    <div className={styles.transparencyColumns}>
                        <div>
                            <div className={styles.transparencySubheading}>Never Collected</div>
                            <ul className={styles.transparencyListCompact}>
                                {asArray(privacy.neverCollect).map((item) => (
                                    <li key={`never-${item}`}>{item}</li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <div className={styles.transparencySubheading}>Automatic Scrubbing</div>
                            <ul className={styles.transparencyListCompact}>
                                {asArray(privacy.scrubPolicy).map((item) => (
                                    <li key={`scrub-${item}`}>{item}</li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <div className={styles.transparencySubheading}>Opt-Out</div>
                            <ul className={styles.transparencyListCompact}>
                                {asArray(privacy.optOutEnvVars).map((item) => (
                                    <li key={`optout-${item}`}>
                                        <code>{item}</code>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className={styles.transparencyLinks}>
                    {links.privacyPolicy && (
                        <a href={links.privacyPolicy} className={styles.transparencyLink}>
                            Privacy policy
                        </a>
                    )}
                    {links.telemetryReadme && (
                        <a
                            href={links.telemetryReadme}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.transparencyLink}
                        >
                            Telemetry README
                        </a>
                    )}
                    {links.telemetryPrivacyCode && (
                        <a
                            href={links.telemetryPrivacyCode}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.transparencyLink}
                        >
                            Privacy scrubber code
                        </a>
                    )}
                </div>
            </div>
        </details>
    )
}

export default function AdoptionSignals({ timeRange = 'all' }) {
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [showStaleNotice, setShowStaleNotice] = useState(false)
    const [error, setError] = useState(null)
    const [data, setData] = useState(null)

    useEffect(() => {
        let cancelled = false

        function loadCachedMetrics() {
            if (typeof window === 'undefined') return false
            try {
                const raw = window.localStorage.getItem(METRICS_CACHE_KEY)
                if (!raw) return false
                const parsed = JSON.parse(raw)
                if (!parsed?.payload || !parsed?.savedAt) return false
                const ageMs = Date.now() - parsed.savedAt
                if (ageMs > METRICS_CACHE_TTL_MS) return false
                if (!hasUsableUsageMetrics(parsed.payload)) return false
                if (!cancelled) {
                    setData(parsed.payload)
                    setShowStaleNotice(true)
                    setLoading(false)
                }
                return true
            } catch {
                return false
            }
        }

        async function fetchMetrics({ initial }) {
            if (initial) setLoading(true)
            setRefreshing(true)
            setError(null)
            const controller = new AbortController()
            const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)
            try {
                const response = await fetch(`/api/project-metrics?ts=${Date.now()}`, {
                    signal: controller.signal,
                    cache: 'no-store',
                })
                if (!response.ok) {
                    throw new Error(`API returned ${response.status}`)
                }
                const payload = await response.json()
                if (!cancelled) {
                    setData(payload)
                    setShowStaleNotice(false)
                    if (typeof window !== 'undefined' && hasUsableUsageMetrics(payload)) {
                        window.localStorage.setItem(
                            METRICS_CACHE_KEY,
                            JSON.stringify({ payload, savedAt: Date.now() })
                        )
                    }
                }
            } catch (fetchError) {
                if (!cancelled) {
                    const message = fetchError?.name === 'AbortError'
                        ? `Timed out after ${FETCH_TIMEOUT_MS / 1000}s`
                        : fetchError.message || 'Failed to load metrics'
                    setError(message)
                }
            } finally {
                clearTimeout(timeoutId)
                if (!cancelled) {
                    setLoading(false)
                    setRefreshing(false)
                }
            }
        }

        const hasCachedData = loadCachedMetrics()
        fetchMetrics({ initial: !hasCachedData })
        return () => {
            cancelled = true
        }
    }, [])

    const usageAvailable = Boolean(data?.usage?.available)
    const usageSource = String(data?.usage?.source || '')
    const isAllTime = timeRange === 'all'
    const runsPrimary = isAllTime
        ? data?.usage?.agentRunsAllTime
        : (data?.usage?.agentRuns90d ?? data?.usage?.agentRuns30d)
    const actionsPrimary = isAllTime
        ? data?.usage?.guiActionsAllTime
        : (data?.usage?.guiActions90d ?? data?.usage?.guiActions30d)
    const demosPrimary = isAllTime
        ? data?.usage?.demosRecordedAllTime
        : (data?.usage?.demosRecorded90d ?? data?.usage?.demosRecorded30d)
    const totalEventsPrimary = isAllTime
        ? data?.usage?.totalEventsAllTime
        : (data?.usage?.totalEvents90d ?? data?.usage?.totalEvents30d)
    const runsSecondary = isAllTime
        ? (data?.usage?.agentRuns90d ?? data?.usage?.agentRuns30d)
        : data?.usage?.agentRunsAllTime
    const actionsSecondary = isAllTime
        ? (data?.usage?.guiActions90d ?? data?.usage?.guiActions30d)
        : data?.usage?.guiActionsAllTime
    const demosSecondary = isAllTime
        ? (data?.usage?.demosRecorded90d ?? data?.usage?.demosRecorded30d)
        : data?.usage?.demosRecordedAllTime
    const totalEventsSecondary = isAllTime
        ? (data?.usage?.totalEvents90d ?? data?.usage?.totalEvents30d)
        : data?.usage?.totalEventsAllTime
    const secondaryLabel = isAllTime ? 'in last 90d' : 'all-time total'
    const runsShowSecondary = shouldShowSecondary(runsPrimary, runsSecondary)
    const actionsShowSecondary = shouldShowSecondary(actionsPrimary, actionsSecondary)
    const demosShowSecondary = shouldShowSecondary(demosPrimary, demosSecondary)
    const totalEventsShowSecondary = shouldShowSecondary(totalEventsPrimary, totalEventsSecondary)
    const sourceLabel = useMemo(() => {
        if (!usageSource) return null
        if (usageSource.startsWith('posthog')) return 'Usage metrics source: PostHog'
        if (usageSource.startsWith('env_override')) return 'Usage metrics source: configured counters'
        return `Usage metrics source: ${usageSource}`
    }, [usageSource])
    const usageStatusMessage = useMemo(() => {
        if (usageAvailable) return null
        if (usageSource === 'posthog_not_configured' || usageSource === 'env_override_not_set') {
            return 'Usage metrics are not configured yet. Set PostHog credentials or OPENADAPT_METRIC_* overrides.'
        }
        if (usageSource.startsWith('posthog')) {
            return 'Usage metrics are temporarily unavailable. We will retry automatically.'
        }
        return 'Usage metrics are currently unavailable.'
    }, [usageAvailable, usageSource])
    const coverageShortLabel = useMemo(
        () => formatCoverageShortDate(data?.usage?.telemetryCoverageStartDate),
        [data]
    )
    const telemetryWindowLabel = useMemo(() => {
        if (!usageSource.startsWith('posthog')) return null
        const formatted = formatCoverageDate(data?.usage?.telemetryCoverageStartDate)
        if (!formatted) return null
        return `Telemetry window: ${formatted} - present`
    }, [data, usageSource])
    const telemetryCardSuffix = coverageShortLabel ? ` (since ${coverageShortLabel})` : ''
    const coverageAgeDays = getDaysSince(data?.usage?.telemetryCoverageStartDate)
    const showEarlyDataNotice = coverageAgeDays !== null && coverageAgeDays < 30
    const breakdownGateEvents = data?.usage?.totalEvents90d ?? data?.usage?.totalEvents30d
    const hasBreakdownEventDepth = typeof breakdownGateEvents !== 'number'
        ? true
        : breakdownGateEvents >= BREAKDOWN_MIN_EVENTS_90D
    const hasBreakdownCoverageDepth = coverageAgeDays === null
        ? true
        : coverageAgeDays >= BREAKDOWN_MIN_DAYS
    const showBreakdownCards = usageAvailable && hasBreakdownEventDepth && hasBreakdownCoverageDepth
    const breakdownGateMessage = useMemo(() => {
        if (!usageAvailable || showBreakdownCards) return null
        const requirements = []
        if (
            typeof breakdownGateEvents === 'number' &&
            breakdownGateEvents < BREAKDOWN_MIN_EVENTS_90D
        ) {
            requirements.push(`${BREAKDOWN_MIN_EVENTS_90D.toLocaleString()}+ events in the last 90 days`)
        }
        if (
            typeof coverageAgeDays === 'number' &&
            coverageAgeDays < BREAKDOWN_MIN_DAYS
        ) {
            requirements.push(`${BREAKDOWN_MIN_DAYS}+ days of telemetry coverage`)
        }
        if (requirements.length === 0) {
            return 'Detailed telemetry breakdown is temporarily hidden while we validate signal quality.'
        }
        return `Detailed telemetry breakdown unlocks after ${requirements.join(' and ')}.`
    }, [usageAvailable, showBreakdownCards, breakdownGateEvents, coverageAgeDays])

    const showSkeleton = loading && !data
    const transparency = data?.usage?.transparency || null

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3 className={styles.title}>Product Telemetry</h3>
                <p className={styles.subtitle}>
                    Privacy-preserving usage telemetry from OpenAdapt clients, shown as all-time and 90-day totals.
                </p>
                {telemetryWindowLabel && <div className={styles.windowBadge}>{telemetryWindowLabel}</div>}
                {showEarlyDataNotice && (
                    <div className={styles.earlyNotice}>
                        Early data: telemetry collection started recently, so counts are still ramping.
                    </div>
                )}
            </div>

            {showSkeleton && (
                <>
                    <div className={styles.loadingRow}>
                        <span className={styles.spinner} />
                        Loading telemetry metrics...
                    </div>
                    <div className={styles.metricsGrid}>
                        {Array.from({ length: 4 }).map((_, index) => (
                            <MetricSkeletonCard key={index} />
                        ))}
                    </div>
                </>
            )}
            {error && !data && <div className={styles.error}>Unable to load telemetry metrics: {error}</div>}

            {!showSkeleton && data && (
                <>
                    <div className={styles.metricsGrid}>
                        <MetricCard
                            icon={faChartLine}
                            value={totalEventsPrimary}
                            label={`Total Events${telemetryCardSuffix}`}
                            title="All non-ignored telemetry events"
                            secondaryValue={totalEventsSecondary}
                            secondaryLabel={secondaryLabel}
                            showSecondary={totalEventsShowSecondary}
                        />
                        {showBreakdownCards && (
                            <>
                                <MetricCard
                                    icon={faBolt}
                                    value={runsPrimary}
                                    label={`Agent Runs${telemetryCardSuffix}`}
                                    title="Derived from usage telemetry event volumes"
                                    secondaryValue={runsSecondary}
                                    secondaryLabel={secondaryLabel}
                                    showSecondary={runsShowSecondary}
                                />
                                <MetricCard
                                    icon={faComputerMouse}
                                    value={actionsPrimary}
                                    label={`GUI Actions${telemetryCardSuffix}`}
                                    title="Derived from usage telemetry event volumes"
                                    secondaryValue={actionsSecondary}
                                    secondaryLabel={secondaryLabel}
                                    showSecondary={actionsShowSecondary}
                                />
                                <MetricCard
                                    icon={faWindowRestore}
                                    value={demosPrimary}
                                    label={`Demos Recorded${telemetryCardSuffix}`}
                                    title="Derived from usage telemetry event volumes"
                                    secondaryValue={demosSecondary}
                                    secondaryLabel={secondaryLabel}
                                    showSecondary={demosShowSecondary}
                                />
                            </>
                        )}
                    </div>

                    {usageStatusMessage && <div className={styles.message}>{usageStatusMessage}</div>}
                    {breakdownGateMessage && <div className={styles.message}>{breakdownGateMessage}</div>}

                    {sourceLabel && <div className={styles.source}>{sourceLabel}</div>}
                    {refreshing && <div className={styles.message}>Refreshing latest metrics...</div>}
                    {showStaleNotice && !refreshing && (
                        <div className={styles.message}>
                            Showing cached snapshot while background refresh completes.
                        </div>
                    )}
                    {error && (
                        <div className={styles.error}>
                            Live refresh failed: {error}
                        </div>
                    )}
                    <TelemetryTransparencyPanel transparency={transparency} />
                </>
            )}
        </div>
    )
}
