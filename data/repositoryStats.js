export const OPENADAPT_REPOSITORY = 'OpenAdaptAI/OpenAdapt'
export const OPENADAPT_REPOSITORY_URL =
    'https://github.com/OpenAdaptAI/OpenAdapt'

// Verified against the flagship repository on 2026-07-18. This snapshot is
// always present in server-rendered HTML; the footer then refreshes through
// our same-origin endpoint when GitHub is reachable.
export const OPENADAPT_STATS_SNAPSHOT = Object.freeze({
    stars: 1648,
    forks: 258,
    observedAt: '2026-07-18T00:00:00.000Z',
    source: 'snapshot',
    stale: true,
})
