const assert = require('node:assert/strict')
const test = require('node:test')

const {
    DEFAULT_ENDPOINTS,
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
    assert.equal(requestedUrl, DEFAULT_ENDPOINTS[0])
    assert.equal(refreshed, current)

    const attemptedUrls = []
    const recovered = await fetchPublishedRepositoryStats({
        fallback,
        fetchImpl: async (url, options) => {
            attemptedUrls.push(url)
            if (attemptedUrls.length === 1) options.signal.throwIfAborted()
            return { ok: true, json: async () => current }
        },
        signalFactory: () =>
            attemptedUrls.length === 0
                ? AbortSignal.abort()
                : new AbortController().signal,
    })
    assert.deepEqual(attemptedUrls, DEFAULT_ENDPOINTS)
    assert.equal(recovered, current)

    const requestedTimeouts = []
    let warnings = 0
    const preserved = await fetchPublishedRepositoryStats({
        fallback,
        signalFactory: (timeoutMs) => {
            requestedTimeouts.push(timeoutMs)
            return AbortSignal.abort()
        },
        fetchImpl: async (_url, options) => options.signal.throwIfAborted(),
        warn: () => warnings++,
    })
    assert.deepEqual(requestedTimeouts, [
        FETCH_TIMEOUT_MS,
        FETCH_TIMEOUT_MS,
    ])
    assert.equal(preserved, fallback)
    assert.equal(warnings, 1)
})
