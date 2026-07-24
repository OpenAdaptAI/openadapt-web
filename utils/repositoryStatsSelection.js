// Pure validation/ordering for server-rendered and live repository counts.
// Kept outside React so the "never downgrade fresh data" contract is covered
// directly by node:test.

function validStats(value) {
    return Boolean(
        value &&
            Number.isInteger(value.stars) &&
            value.stars > 0 &&
            Number.isInteger(value.forks) &&
            value.forks >= 0
    )
}

function observedAt(value) {
    const timestamp = Date.parse(value?.observedAt)
    return Number.isFinite(timestamp) ? timestamp : null
}

function sourceFreshness(value) {
    if (value?.source === 'github' && !value.stale) return 2
    if (value?.source === 'stale') return 1
    return 0
}

function newerStats(current, next) {
    if (!validStats(next)) return current
    if (!validStats(current)) return next

    const currentTime = observedAt(current)
    const nextTime = observedAt(next)

    // A valid current observation can only move forward in time. A payload
    // does not become newer merely by claiming source:"github": an older live
    // response is still older, and a missing/malformed time is not evidence.
    if (currentTime !== null) {
        if (nextTime === null || nextTime < currentTime) return current
        if (nextTime > currentTime) return next
        // Source freshness may break a tie only after both timestamps are
        // known-valid and exactly equal.
        return sourceFreshness(next) > sourceFreshness(current)
            ? next
            : current
    }

    // Prefer a timestamped observation over an otherwise valid undated value.
    // If neither has a valid timestamp, retain the existing value.
    if (nextTime !== null) return next
    return current
}

module.exports = { validStats, newerStats }
