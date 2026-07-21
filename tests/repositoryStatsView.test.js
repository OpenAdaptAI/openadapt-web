const assert = require('node:assert/strict')
const test = require('node:test')

const {
    formatRelativeTime,
    sourceLabel,
} = require('../utils/repositoryStatsView')

const NOW = Date.parse('2026-07-21T12:00:00.000Z')
const ago = (ms) => NOW - ms

test('formatRelativeTime buckets seconds, minutes, hours, and days', () => {
    assert.equal(formatRelativeTime(ago(0), NOW), 'just now')
    assert.equal(formatRelativeTime(ago(3 * 1000), NOW), 'just now')
    assert.equal(formatRelativeTime(ago(12 * 1000), NOW), '12s ago')
    assert.equal(formatRelativeTime(ago(5 * 60 * 1000), NOW), '5m ago')
    assert.equal(formatRelativeTime(ago(3 * 60 * 60 * 1000), NOW), '3h ago')
    assert.equal(formatRelativeTime(ago(2 * 24 * 60 * 60 * 1000), NOW), '2d ago')
})

test('formatRelativeTime treats clock skew (future) as just now', () => {
    assert.equal(formatRelativeTime(NOW + 5 * 1000, NOW), 'just now')
})

test('formatRelativeTime returns null for a missing or unparseable time', () => {
    assert.equal(formatRelativeTime(NaN, NOW), null)
    assert.equal(formatRelativeTime(Date.parse('not-a-date'), NOW), null)
})

test('sourceLabel reports a live GitHub count as "updated <rel> ago"', () => {
    const label = sourceLabel(
        {
            stars: 1650,
            forks: 259,
            observedAt: new Date(ago(12 * 1000)).toISOString(),
            source: 'github',
            stale: false,
        },
        NOW
    )
    assert.equal(label, 'GitHub · updated 12s ago')
})

test('sourceLabel reports an unreachable-GitHub value as "last updated <rel>"', () => {
    const label = sourceLabel(
        {
            stars: 1650,
            forks: 259,
            observedAt: new Date(ago(5 * 60 * 1000)).toISOString(),
            source: 'stale',
            stale: true,
        },
        NOW
    )
    assert.equal(label, 'GitHub · last updated 5m ago')
})

test('sourceLabel reports the committed snapshot as "snapshot from <rel>"', () => {
    const label = sourceLabel(
        {
            stars: 1648,
            forks: 258,
            observedAt: new Date(ago(3 * 24 * 60 * 60 * 1000)).toISOString(),
            source: 'snapshot',
            stale: true,
        },
        NOW
    )
    assert.equal(label, 'GitHub · snapshot from 3d ago')
})

test('sourceLabel never prints NaN when the timestamp is missing', () => {
    assert.equal(
        sourceLabel({ source: 'github', stale: false }, NOW),
        'GitHub · updated just now'
    )
    assert.equal(
        sourceLabel({ source: 'stale', stale: true }, NOW),
        'GitHub · last-known counts'
    )
    assert.equal(sourceLabel({ source: 'snapshot' }, NOW), 'GitHub · snapshot')
})

test('sourceLabel always begins with the honest "GitHub" attribution', () => {
    for (const source of ['github', 'stale', 'snapshot']) {
        const label = sourceLabel(
            {
                observedAt: new Date(ago(60 * 1000)).toISOString(),
                source,
                stale: source !== 'github',
            },
            NOW
        )
        assert.match(label, /^GitHub · /)
    }
})
