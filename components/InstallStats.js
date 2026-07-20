import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPython } from '@fortawesome/free-brands-svg-icons'

import styles from './InstallStats.module.css'

// Compact homepage adoption strip. Complements the hero's GitHub stars/forks
// social proof with the one number the hero lacks: real PyPI installs.
//
// Renders entirely from a COMMITTED snapshot (data/installStats.json, refreshed
// out-of-band by scripts/fetch-install-stats.js via the refresh-install-stats
// workflow) that the page passes in through getStaticProps. It never fetches at
// build or request time, so the strip is in the initial HTML and can never
// block or break the page over a flaky/rate-limited pypistats.org -- unlike the
// runtime-fetching chart on /download, this instance is non-blocking by
// construction. `stats` may be null/empty -> the strip renders nothing.

function formatCount(n) {
    const value = Number(n) || 0
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `${(value / 1000).toFixed(1)}k`
    return value.toLocaleString()
}

function formatAsOf(asOf) {
    if (!asOf) return ''
    const date = new Date(`${asOf}T00:00:00Z`)
    if (Number.isNaN(date.getTime())) return asOf
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        timeZone: 'UTC',
    })
}

// Tiny dependency-free inline-SVG sparkline of installs over time. No chart.js,
// no client fetch; uses the site's CSS custom properties so it tracks the theme.
function Sparkline({ history }) {
    const points = (Array.isArray(history) ? history : []).filter(
        (p) => p && Number.isFinite(Number(p.downloads))
    )
    if (points.length < 2) return null

    const width = 96
    const height = 26
    const pad = 3
    const values = points.map((p) => Number(p.downloads))
    const max = Math.max(...values, 1)
    const stepX = (width - pad * 2) / (points.length - 1)

    const coords = points.map((p, i) => ({
        x: pad + i * stepX,
        y: pad + (height - pad * 2) * (1 - Number(p.downloads) / max),
    }))
    const linePath = coords
        .map((c, i) => `${i === 0 ? 'M' : 'L'}${c.x.toFixed(1)},${c.y.toFixed(1)}`)
        .join(' ')
    const last = coords[coords.length - 1]

    return (
        <svg
            className={styles.spark}
            viewBox={`0 0 ${width} ${height}`}
            role="img"
            aria-label="PyPI installs trend over recent months"
        >
            <path className={styles.sparkLine} d={linePath} />
            <circle className={styles.sparkDot} cx={last.x} cy={last.y} r={2.4} />
        </svg>
    )
}

export default function InstallStats({ stats = null }) {
    const hasData =
        stats &&
        Number(stats.totalLastMonth) > 0 &&
        Array.isArray(stats.packages) &&
        stats.packages.length > 0

    // Graceful empty state: render nothing rather than a broken strip. A valid
    // snapshot is committed, so this should never trigger in practice.
    if (!hasData) return null

    const top = stats.topPackage || stats.packages[0]
    const asOf = formatAsOf(stats.asOf)
    const sourceUrl = stats.sourceUrl || 'https://pypistats.org/packages/openadapt'

    return (
        <aside className={styles.strip} aria-label="PyPI install statistics">
            <div className={styles.inner}>
                <span className={styles.metric}>
                    <FontAwesomeIcon
                        icon={faPython}
                        className={styles.icon}
                        aria-hidden="true"
                    />
                    <strong className={styles.value}>
                        {formatCount(stats.totalLastMonth)}
                    </strong>
                    <span className={styles.label}>installs / month on PyPI</span>
                </span>

                <span className={styles.sep} aria-hidden="true" />

                <span className={styles.metric}>
                    <span className={styles.label}>top package</span>
                    <strong className={styles.valueSmall}>{top.name}</strong>
                </span>

                <span className={styles.sep} aria-hidden="true" />

                <Sparkline history={stats.history} />

                <a
                    className={styles.source}
                    href={sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`Source: ${stats.source || 'pypistats.org'}`}
                >
                    {stats.source || 'pypistats.org'}
                    {asOf ? ` · snapshot as of ${asOf}` : ''}
                </a>
            </div>
        </aside>
    )
}
