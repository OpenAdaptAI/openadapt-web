import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPython } from '@fortawesome/free-brands-svg-icons'

import { getRecentDownloadStats } from 'utils/pypistatsHistory'
import styles from './InstallStats.module.css'

// Homepage adoption section: the SAME cumulative downloads-over-time chart the
// /download page shows (components/PyPIDownloadChart in its compact cumulative
// mode), plus a headline caption.
//
// Fast + robust:
//   - The caption's headline numbers are seeded from the committed snapshot
//     (data/installStats.json) passed in via getStaticProps, so they are in the
//     initial HTML and the section is never blank.
//   - The chart is lazy-loaded (next/dynamic, ssr:false) so chart.js never
//     bloats the initial homepage bundle or blocks first paint; a lightweight
//     placeholder holds its space until it loads.
//   - Both the chart and the caption then fetch LIVE client-side (same proxy /
//     caching / 429 backoff as /download). The snapshot seeds the chart line and
//     the caption so nothing waits on the network; live values replace them when
//     they arrive, and if the fetch fails the snapshot simply stays shown.

const PyPIDownloadChart = dynamic(() => import('./PyPIDownloadChart'), {
    ssr: false,
    loading: () => <div className={styles.chartPlaceholder} aria-hidden="true" />,
})

function formatCount(n) {
    const value = Number(n) || 0
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `${(value / 1000).toFixed(1)}k`
    return value.toLocaleString()
}

// Build a historyData-shaped seed from the committed snapshot so the reused
// chart can paint a cumulative line instantly, before its live fetch resolves.
function buildSeedHistory(stats) {
    const history = Array.isArray(stats?.history) ? stats.history : []
    if (history.length < 2) return null
    const combined = history.map((h) => ({
        date: `${h.month}-01`,
        downloads: Number(h.downloads) || 0,
    }))
    let running = 0
    const cumulativeHistory = combined.map((point) => {
        running += point.downloads
        return { date: point.date, downloads: running }
    })
    return {
        combined,
        cumulativeHistory,
        packages: {},
        packageNames: Array.isArray(stats?.packages)
            ? stats.packages.map((p) => p.name)
            : [],
    }
}

export default function InstallStats({ stats = null }) {
    const hasSeed =
        stats &&
        Number(stats.totalLastMonth) > 0 &&
        Array.isArray(stats.packages) &&
        stats.packages.length > 0

    const seedTop = hasSeed ? stats.topPackage || stats.packages[0] : null

    // Headline numbers: seed from the snapshot, then update with live values.
    const [totalMonth, setTotalMonth] = useState(
        hasSeed ? stats.totalLastMonth : 0
    )
    const [topName, setTopName] = useState(seedTop ? seedTop.name : '')

    useEffect(() => {
        let cancelled = false
        getRecentDownloadStats()
            .then((live) => {
                if (cancelled || !live) return
                if (live.totals && live.totals.last_month > 0) {
                    setTotalMonth(live.totals.last_month)
                }
                if (live.topPackage && live.topPackage.name) {
                    setTopName(live.topPackage.name)
                }
            })
            .catch(() => {
                // Keep the snapshot-seeded numbers on any failure.
            })
        return () => {
            cancelled = true
        }
    }, [])

    // Graceful empty state: without a snapshot seed, render nothing rather than
    // a blank/broken section. A valid snapshot is committed, so this should not
    // trigger in practice.
    if (!hasSeed) return null

    const seedHistory = buildSeedHistory(stats)

    return (
        <section className={styles.section} id="adoption" aria-label="Adoption">
            <div className={styles.inner}>
                <p className={styles.kicker}>Adoption</p>
                <h2 className={styles.heading}>Installed from PyPI, and growing</h2>
                <p className={styles.subtitle}>
                    <strong className={styles.headline}>
                        {formatCount(totalMonth)}
                    </strong>{' '}
                    installs a month across the OpenAdapt packages
                    {topName ? (
                        <>
                            {' '}&middot; top package{' '}
                            <span className={styles.top}>{topName}</span>
                        </>
                    ) : null}
                </p>

                <div className={styles.chartCard}>
                    <PyPIDownloadChart compact seedHistory={seedHistory} />
                </div>

                <p className={styles.attribution}>
                    <FontAwesomeIcon icon={faPython} aria-hidden="true" /> Cumulative
                    downloads over time, live from{' '}
                    <a
                        className={styles.sourceLink}
                        href="https://pypistats.org/packages/openadapt-flow"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        pypistats.org
                    </a>
                    .
                </p>
            </div>
        </section>
    )
}
