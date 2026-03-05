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

function formatMetric(value) {
    if (value === null || value === undefined || Number.isNaN(value)) return '—'
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `${(value / 1000).toFixed(1)}k`
    return value.toLocaleString()
}

function MetricCard({ icon, value, label, title }) {
    return (
        <div className={styles.metricCard} title={title || ''}>
            <div className={styles.metricValue}>
                <FontAwesomeIcon icon={icon} className={styles.metricIcon} />
                {formatMetric(value)}
            </div>
            <div className={styles.metricLabel}>{label}</div>
        </div>
    )
}

export default function AdoptionSignals() {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [data, setData] = useState(null)

    useEffect(() => {
        let cancelled = false

        async function fetchMetrics() {
            setLoading(true)
            setError(null)
            try {
                const response = await fetch('/api/project-metrics')
                if (!response.ok) {
                    throw new Error(`API returned ${response.status}`)
                }
                const payload = await response.json()
                if (!cancelled) setData(payload)
            } catch (fetchError) {
                if (!cancelled) setError(fetchError.message || 'Failed to load metrics')
            } finally {
                if (!cancelled) setLoading(false)
            }
        }

        fetchMetrics()
        return () => {
            cancelled = true
        }
    }, [])

    const usageAvailable = Boolean(data?.usage?.available)
    const sourceLabel = useMemo(() => {
        if (!data?.usage?.source) return null
        if (String(data.usage.source).startsWith('posthog')) return 'Usage metrics source: PostHog'
        if (String(data.usage.source).startsWith('env_override')) return 'Usage metrics source: configured counters'
        return `Usage metrics source: ${data.usage.source}`
    }, [data])

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3 className={styles.title}>OpenAdapt Adoption Signals</h3>
                <p className={styles.subtitle}>
                    Prioritizing product usage and GitHub traction; package downloads are shown separately.
                </p>
            </div>

            {loading && <div className={styles.message}>Loading adoption metrics...</div>}
            {error && <div className={styles.error}>Unable to load adoption metrics: {error}</div>}

            {!loading && !error && (
                <>
                    <div className={styles.metricsGrid}>
                        <MetricCard
                            icon={faStar}
                            value={data?.github?.stars}
                            label="GitHub Stars"
                            title="Repository stars from GitHub API"
                        />
                        <MetricCard
                            icon={faCodeBranch}
                            value={data?.github?.forks}
                            label="GitHub Forks"
                            title="Repository forks from GitHub API"
                        />
                        <MetricCard
                            icon={faChartLine}
                            value={data?.usage?.agentRuns30d}
                            label="Agent Runs (30d)"
                            title="Derived from usage telemetry event volumes"
                        />
                        <MetricCard
                            icon={faComputerMouse}
                            value={data?.usage?.guiActions30d}
                            label="GUI Actions (30d)"
                            title="Derived from usage telemetry event volumes"
                        />
                        <MetricCard
                            icon={faWindowRestore}
                            value={data?.usage?.demosRecorded30d}
                            label="Demos Recorded (30d)"
                            title="Derived from usage telemetry event volumes"
                        />
                    </div>

                    {!usageAvailable && (
                        <div className={styles.message}>
                            Usage metrics are not configured yet. Set PostHog credentials or OPENADAPT_METRIC_* overrides.
                        </div>
                    )}

                    {sourceLabel && <div className={styles.source}>{sourceLabel}</div>}
                </>
            )}
        </div>
    )
}
