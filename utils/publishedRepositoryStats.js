const { newerStats, validStats } = require('./repositoryStatsSelection')

const DEFAULT_ENDPOINTS = [
    'https://openadapt.ai/api/repository-stats',
    'https://main--cosmic-klepon-3c693c.netlify.app/api/repository-stats',
]
const FETCH_TIMEOUT_MS = 5 * 1000

function completeStats(value) {
    return Boolean(
        validStats(value) &&
            Number.isFinite(Date.parse(value.observedAt)) &&
            ['github', 'stale', 'snapshot'].includes(value.source) &&
            typeof value.stale === 'boolean'
    )
}

async function fetchPublishedRepositoryStats({
    fallback,
    fetchImpl = fetch,
    endpoints = DEFAULT_ENDPOINTS,
    signalFactory = (timeoutMs) => AbortSignal.timeout(timeoutMs),
    warn = console.warn,
} = {}) {
    let best = fallback

    for (const endpoint of endpoints) {
        try {
            const response = await fetchImpl(endpoint, {
                headers: { Accept: 'application/json' },
                signal: signalFactory(FETCH_TIMEOUT_MS),
            })
            if (!response.ok) continue

            const current = await response.json()
            if (!completeStats(current)) continue
            best = newerStats(best, current)
            if (current.source === 'github' && !current.stale) return best
        } catch {
            // Try the next first-party cache. A final miss remains fail-safe.
        }
    }

    warn(
        '[repository-stats] fresh first-party cache unavailable; using last-known counts'
    )
    return best
}

module.exports = {
    DEFAULT_ENDPOINTS,
    FETCH_TIMEOUT_MS,
    fetchPublishedRepositoryStats,
}
