const { newerStats, validStats } = require('./repositoryStatsSelection')

const DEFAULT_ENDPOINT = 'https://openadapt.ai/api/repository-stats'
const FETCH_TIMEOUT_MS = 3 * 1000

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
    endpoint = DEFAULT_ENDPOINT,
    signalFactory = (timeoutMs) => AbortSignal.timeout(timeoutMs),
} = {}) {
    try {
        const response = await fetchImpl(endpoint, {
            headers: { Accept: 'application/json' },
            signal: signalFactory(FETCH_TIMEOUT_MS),
        })
        if (!response.ok) return fallback

        const current = await response.json()
        if (!completeStats(current)) return fallback
        return newerStats(fallback, current)
    } catch {
        return fallback
    }
}

module.exports = {
    DEFAULT_ENDPOINT,
    FETCH_TIMEOUT_MS,
    fetchPublishedRepositoryStats,
}
