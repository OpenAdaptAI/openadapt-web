const assert = require('node:assert/strict')
const test = require('node:test')

const {
    DEFAULT_ENDPOINT,
    FETCH_TIMEOUT_MS,
    fetchPublishedRepositoryStats,
} = require('../utils/publishedRepositoryStats')

const fallback = {
    stars: 1648,
    forks: 258,
    observedAt: '2026-07-18T00:00:00.000Z',
    source: 'snapshot',
    stale: true,
}

test('published stats prefer a newer same-origin observation and fail back safely', async () => {
    const current = {
        stars: 1655,
        forks: 258,
        observedAt: '2026-07-25T01:18:00.645Z',
        source: 'github',
        stale: false,
    }
    let requestedUrl

    const refreshed = await fetchPublishedRepositoryStats({
        fallback,
        fetchImpl: async (url) => {
            requestedUrl = url
            return { ok: true, json: async () => current }
        },
    })
    assert.equal(requestedUrl, DEFAULT_ENDPOINT)
    assert.equal(refreshed, current)

    let requestedTimeout
    const preserved = await fetchPublishedRepositoryStats({
        fallback,
        signalFactory: (timeoutMs) => {
            requestedTimeout = timeoutMs
            return AbortSignal.abort()
        },
        fetchImpl: async (_url, options) => {
            options.signal.throwIfAborted()
        },
    })
    assert.equal(requestedTimeout, FETCH_TIMEOUT_MS)
    assert.equal(preserved, fallback)
})
