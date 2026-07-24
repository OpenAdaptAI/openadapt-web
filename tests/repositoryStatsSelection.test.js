const assert = require('node:assert/strict')
const test = require('node:test')

const {
    newerStats,
    validStats,
} = require('../utils/repositoryStatsSelection')

const live = {
    stars: 1654,
    forks: 258,
    observedAt: '2026-07-24T02:00:00.000Z',
    source: 'github',
    stale: false,
}

test('validates only present, nonzero repository social proof', () => {
    assert.equal(validStats(live), true)
    assert.equal(validStats({ ...live, stars: 0 }), false)
    assert.equal(validStats({ ...live, forks: -1 }), false)
    assert.equal(validStats({ ...live, stars: '1654' }), false)
})

test('never downgrades a live observation to an older snapshot', () => {
    const snapshot = {
        stars: 1648,
        forks: 258,
        observedAt: '2026-07-18T00:00:00.000Z',
        source: 'snapshot',
        stale: true,
    }
    assert.equal(newerStats(live, snapshot), live)
})

test('never accepts an older response merely because it is fresh GitHub data', () => {
    const olderLive = {
        ...live,
        stars: 9999,
        forks: 999,
        observedAt: '2026-07-24T01:59:59.000Z',
    }
    assert.equal(newerStats(live, olderLive), live)
})

test('accepts a fresh observation and a genuinely newer stale value', () => {
    const fresh = {
        ...live,
        stars: 1655,
        observedAt: '2026-07-24T02:05:00.000Z',
    }
    assert.equal(newerStats(live, fresh), fresh)

    const newerStale = {
        ...fresh,
        source: 'stale',
        stale: true,
    }
    assert.equal(newerStats(live, newerStale), newerStale)
})

test('source freshness only breaks a tie at the same valid timestamp', () => {
    const snapshot = {
        ...live,
        source: 'snapshot',
        stale: true,
    }
    assert.equal(newerStats(snapshot, live), live)
    assert.equal(newerStats(live, snapshot), live)
})

test('a malformed or missing timestamp cannot replace a dated current value', () => {
    const missingTime = { ...live, stars: 1700 }
    delete missingTime.observedAt
    const malformedTime = {
        ...live,
        stars: 1700,
        observedAt: 'not-a-time',
    }
    assert.equal(newerStats(live, missingTime), live)
    assert.equal(newerStats(live, malformedTime), live)
})

test('a valid timestamp improves an otherwise valid undated value', () => {
    const undated = { ...live }
    delete undated.observedAt
    assert.equal(newerStats(undated, live), live)
})

test('rejects malformed refresh payloads', () => {
    assert.equal(newerStats(live, { error: 'unavailable' }), live)
})
