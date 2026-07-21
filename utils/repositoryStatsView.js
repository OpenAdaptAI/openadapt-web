// Pure presentation helpers for the footer's GitHub star/fork social proof.
//
// Kept framework-free (plain CommonJS, no React) so the honest relative-time
// label logic is unit-testable with `node --test` and identical whether it
// runs on the server, during hydration, or on each live client tick.

const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

// A short, honest "how long ago" string for a timestamp, relative to `now`.
// Returns null when the timestamp is missing or unparseable so callers can
// fall back to a non-temporal label instead of printing "NaN".
function formatRelativeTime(observedAtMs, now = Date.now()) {
    if (!Number.isFinite(observedAtMs)) return null
    const diff = now - observedAtMs
    // Clock skew or a just-issued timestamp both read as "just now".
    if (diff < 10 * SECOND) return 'just now'
    if (diff < MINUTE) return `${Math.floor(diff / SECOND)}s ago`
    if (diff < HOUR) return `${Math.floor(diff / MINUTE)}m ago`
    if (diff < DAY) return `${Math.floor(diff / HOUR)}h ago`
    return `${Math.floor(diff / DAY)}d ago`
}

// Honest source label tied to the ACTUAL last successful observation time,
// never a vague "refreshed recently". The three states mirror the server
// loader's `source` field:
//   - github : a live count observed this session (updated <rel> ago)
//   - stale  : GitHub was unreachable on the last refresh; show when the last
//              real count was observed (last updated <rel> ago)
//   - snapshot: no live count yet; show the committed snapshot's age
function sourceLabel(stats, now = Date.now()) {
    const rel = formatRelativeTime(Date.parse(stats && stats.observedAt), now)
    if (stats && stats.source === 'github' && !stats.stale) {
        return rel ? `GitHub · updated ${rel}` : 'GitHub · updated just now'
    }
    if (stats && stats.source === 'stale') {
        return rel ? `GitHub · last updated ${rel}` : 'GitHub · last-known counts'
    }
    return rel ? `GitHub · snapshot from ${rel}` : 'GitHub · snapshot'
}

module.exports = { formatRelativeTime, sourceLabel }
