import { useEffect, useState } from 'react'

import repositoryStatsSelection from './repositoryStatsSelection'

const { newerStats, validStats } = repositoryStatsSelection

/*
 * One shared source for the repository counts a visitor sees.
 *
 * Pages that server-render fresh stats (the homepage) and pages that only
 * carry the committed snapshot (about, solutions, …) previously displayed
 * different star counts for the same repository at the same moment. Every
 * surface now renders the server-provided value first, then converges through
 * a single one-shot fetch of the same-origin cache at /api/repository-stats.
 *
 * This is deliberately NOT a timer and NOT a GitHub API call:
 * tests/publicTruth.test.js forbids visitor browsers from calling
 * api.github.com, and the same-origin endpoint is CDN-cached. The
 * "never downgrade fresh data" ordering lives in
 * utils/repositoryStatsSelection.js, so a stale response can never replace a
 * newer server-rendered value.
 */
export default function useLiveRepositoryStats(initial) {
    const [stats, setStats] = useState(initial)

    useEffect(() => {
        let cancelled = false
        fetch('/api/repository-stats', {
            headers: { Accept: 'application/json' },
        })
            .then((response) => (response.ok ? response.json() : null))
            .then((next) => {
                if (cancelled || !validStats(next)) return
                setStats((current) => newerStats(current, next))
            })
            .catch(() => {
                // The server-rendered value stays; a miss is fail-safe.
            })
        return () => {
            cancelled = true
        }
    }, [])

    return validStats(stats) ? stats : initial
}
