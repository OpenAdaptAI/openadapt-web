import React, { useEffect, useMemo, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faCodeBranch,
    faStar,
    faChartLine,
    faComputerMouse,
    faWindowRestore,
} from '@fortawesome/free-solid-svg-icons'
import styles from './AdoptionSignals.module.css'

const METRICS_CACHE_KEY = 'openadapt:adoption-signals:v3'
const METRICS_CACHE_TTL_MS = 6 * 60 * 60 * 1000
const FETCH_TIMEOUT_MS = 10000

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

function shouldShowSecondary(primaryValue, secondaryValue) {
    if (secondaryValue === null || secondaryValue === undefined || Number.isNaN(secondaryValue)) return false
    if (primaryValue === null || primaryValue === undefined || Number.isNaN(primaryValue)) return true
    if (Number(primaryValue) === Number(secondaryValue)) return false
    return formatMetric(primaryValue) !== formatMetric(secondaryValue)
}

function MetricCard({ icon, value, label, title, secondaryValue, secondaryLabel, showSecondary = true }) {
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
    const runsSecondary = isAllTime
        ? (data?.usage?.agentRuns90d ?? data?.usage?.agentRuns30d)
        : data?.usage?.agentRunsAllTime
    const actionsSecondary = isAllTime
        ? (data?.usage?.guiActions90d ?? data?.usage?.guiActions30d)
        : data?.usage?.guiActionsAllTime
    const demosSecondary = isAllTime
        ? (data?.usage?.demosRecorded90d ?? data?.usage?.demosRecorded30d)
        : data?.usage?.demosRecordedAllTime
    const secondaryLabel = isAllTime ? '90d' : 'all-time'
    const runsShowSecondary = shouldShowSecondary(runsPrimary, runsSecondary)
    const actionsShowSecondary = shouldShowSecondary(actionsPrimary, actionsSecondary)
    const demosShowSecondary = shouldShowSecondary(demosPrimary, demosSecondary)
    const sourceLabel = useMemo(() => {
        if (!data?.usage?.source) return null
        if (String(data.usage.source).startsWith('posthog')) return 'Usage metrics source: PostHog'
        if (String(data.usage.source).startsWith('env_override')) return 'Usage metrics source: configured counters'
        return `Usage metrics source: ${data.usage.source}`
    }, [data])
    const coverageStartLabel = useMemo(() => {
        const source = String(data?.usage?.source || '')
        if (!source.startsWith('posthog')) return null
        const formatted = formatCoverageDate(data?.usage?.telemetryCoverageStartDate)
        if (!formatted) return null
        return `Telemetry coverage starts ${formatted}.`
    }, [data])

    const showSkeleton = loading && !data

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3 className={styles.title}>Adoption Signals</h3>
                <p className={styles.subtitle}>
                    Track OpenAdapt&apos;s all-time footprint and 90-day momentum.
                </p>
            </div>

            {showSkeleton && (
                <>
                    <div className={styles.loadingRow}>
                        <span className={styles.spinner} />
                        Loading adoption metrics...
                    </div>
                    <div className={styles.metricsGrid}>
                        {Array.from({ length: 5 }).map((_, index) => (
                            <MetricSkeletonCard key={index} />
                        ))}
                    </div>
                </>
            )}
            {error && !data && <div className={styles.error}>Unable to load adoption metrics: {error}</div>}

            {!showSkeleton && data && (
                <>
                    <div className={styles.metricsGrid}>
                        <MetricCard
                            icon={faStar}
                            value={data?.github?.stars}
                            label="Ecosystem Stars"
                            title="Total stars across public OpenAdaptAI openadapt* repositories"
                        />
                        <MetricCard
                            icon={faCodeBranch}
                            value={data?.github?.forks}
                            label="Ecosystem Forks"
                            title="Total forks across public OpenAdaptAI openadapt* repositories"
                        />
                        <MetricCard
                            icon={faChartLine}
                            value={runsPrimary}
                            label="Agent Runs"
                            title="Derived from usage telemetry event volumes"
                            secondaryValue={runsSecondary}
                            secondaryLabel={secondaryLabel}
                            showSecondary={runsShowSecondary}
                        />
                        <MetricCard
                            icon={faComputerMouse}
                            value={actionsPrimary}
                            label="GUI Actions"
                            title="Derived from usage telemetry event volumes"
                            secondaryValue={actionsSecondary}
                            secondaryLabel={secondaryLabel}
                            showSecondary={actionsShowSecondary}
                        />
                        <MetricCard
                            icon={faWindowRestore}
                            value={demosPrimary}
                            label="Demos Recorded"
                            title="Derived from usage telemetry event volumes"
                            secondaryValue={demosSecondary}
                            secondaryLabel={secondaryLabel}
                            showSecondary={demosShowSecondary}
                        />
                    </div>

                    {!usageAvailable && (
                        <div className={styles.message}>
                            Usage metrics are not configured yet. Set PostHog credentials or OPENADAPT_METRIC_* overrides.
                        </div>
                    )}

                    {sourceLabel && <div className={styles.source}>{sourceLabel}</div>}
                    {coverageStartLabel && <div className={styles.source}>{coverageStartLabel}</div>}
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
                </>
            )}
        </div>
    )
}
