import { useEffect, useState } from 'react'

import { OPENADAPT_STATS_SNAPSHOT } from 'data/repositoryStats'
import repositoryStatsSelection from 'utils/repositoryStatsSelection'

const { newerStats, validStats } = repositoryStatsSelection

// Stars/forks move over hours. Poll the same-origin endpoint while the page is
// visible; Netlify's one-hour durable cache (s-maxage=3600) means normal
// visitor refreshes do not spend GitHub's unauthenticated API quota.
const POLL_INTERVAL_MS = 90 * 1000
const MAX_BACKOFF_MS = 10 * 60 * 1000

export default function useRepositoryStats(
    initialStats = OPENADAPT_STATS_SNAPSHOT,
    { enabled = true } = {}
) {
    const initial = validStats(initialStats)
        ? initialStats
        : OPENADAPT_STATS_SNAPSHOT
    const [stats, setStats] = useState(initial)

    useEffect(() => {
        setStats((current) => newerStats(current, initial))
    }, [initial])

    useEffect(() => {
        if (!enabled) return undefined

        // Never blank the widget: failed or older responses preserve the last
        // good observation and progressively back off.
        let cancelled = false
        let timer = null
        let controller = null
        let backoff = POLL_INTERVAL_MS

        const schedule = () => {
            clearTimeout(timer)
            if (document.visibilityState === 'hidden') return
            timer = setTimeout(fetchOnce, backoff)
        }

        const fetchOnce = async () => {
            controller = new AbortController()
            try {
                const response = await fetch('/api/repository-stats', {
                    headers: { Accept: 'application/json' },
                    signal: controller.signal,
                })
                if (!response.ok) {
                    throw new Error(`stats request failed: ${response.status}`)
                }
                const next = await response.json()
                if (cancelled) return
                setStats((current) => newerStats(current, next))
                if (next?.source === 'github' && !next.stale) {
                    backoff = POLL_INTERVAL_MS
                } else {
                    backoff = Math.min(backoff * 2, MAX_BACKOFF_MS)
                }
            } catch {
                if (cancelled) return
                backoff = Math.min(backoff * 2, MAX_BACKOFF_MS)
            } finally {
                controller = null
                if (!cancelled) schedule()
            }
        }

        const onVisibility = () => {
            if (document.visibilityState === 'visible') {
                fetchOnce()
            } else {
                clearTimeout(timer)
                controller?.abort()
            }
        }

        fetchOnce()
        document.addEventListener('visibilitychange', onVisibility)
        return () => {
            cancelled = true
            clearTimeout(timer)
            controller?.abort()
            document.removeEventListener('visibilitychange', onVisibility)
        }
    }, [enabled])

    return stats
}
