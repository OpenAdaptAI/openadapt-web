import {
    OPENADAPT_REPOSITORY,
    OPENADAPT_STATS_SNAPSHOT,
} from '../data/repositoryStats'
import { fetchRepoSocialProof } from './githubApi'

const FRESH_TTL_MS = 10 * 60 * 1000
const ERROR_RETRY_MS = 60 * 1000

let cache = {
    value: { ...OPENADAPT_STATS_SNAPSHOT },
    freshUntil: 0,
}
let inFlight = null

function copy(value) {
    return { ...value }
}

/**
 * Shared server-side loader for flagship OpenAdapt repository social proof.
 *
 * A warm server instance keeps the last successful value, concurrent refreshes
 * share one request, and GitHub failures return stale/snapshot data rather
 * than blank or misleading zero counts.
 */
export async function getOpenAdaptRepositoryStats() {
    const now = Date.now()
    if (cache.freshUntil > now) return copy(cache.value)
    if (inFlight) return inFlight

    inFlight = (async () => {
        try {
            const current = await fetchRepoSocialProof(
                OPENADAPT_REPOSITORY
            )
            cache = {
                value: {
                    ...current,
                    observedAt: new Date().toISOString(),
                    source: 'github',
                    stale: false,
                },
                freshUntil: Date.now() + FRESH_TTL_MS,
            }
        } catch {
            cache = {
                value: {
                    ...cache.value,
                    source:
                        cache.value.source === 'github'
                            ? 'stale'
                            : 'snapshot',
                    stale: true,
                },
                freshUntil: Date.now() + ERROR_RETRY_MS,
            }
        } finally {
            inFlight = null
        }
        return copy(cache.value)
    })()

    return inFlight
}
