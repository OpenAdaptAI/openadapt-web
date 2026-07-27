import {
    ATTRIBUTION_SHORT,
    COMMIT_URL,
    FLOW_VERSION,
    MEASURED_ON,
    SHORT_COMMIT,
} from '../lib/benchmarkProvenance'

/*
 * The engine build behind every published benchmark figure, stated where the
 * figures are.
 *
 * A skeptical reader should never have to hunt for which version produced a
 * number. These runs were measured on 2026-07-08 from a source checkout
 * declaring openadapt-flow 0.1.0 — before v0.2.0, the first release tag that
 * contains the pinned commit. That is a real fact about a real measurement, so
 * it is stated plainly next to the numbers rather than buried in a tooltip.
 *
 * Every string is derived from data/benchmark.json, so the label cannot drift
 * from the data, and tests/benchmarkAttribution.test.js keeps every rendering
 * surface carrying it.
 */

const RELEASE_LINE =
    `openadapt-flow ${FLOW_VERSION} — the version declared at the pinned ` +
    `commit. It predates v0.2.0, the first release tag containing that ` +
    `commit, so these figures describe a pre-release engine build and have ` +
    `not been re-measured on a later release.`

export default function BenchmarkAttribution({
    variant = 'banner',
    className = '',
}) {
    if (variant === 'inline') {
        return (
            <p
                data-testid="benchmark-attribution"
                className={`text-sm leading-relaxed text-ink-3 ${className}`}
            >
                <span className="font-mono font-semibold text-ink">
                    Measured on Flow {FLOW_VERSION}, {MEASURED_ON}
                </span>
                {' — '}
                {RELEASE_LINE}{' '}
                <a
                    href={COMMIT_URL}
                    className="text-accent hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    commit {SHORT_COMMIT}
                </a>
                .
            </p>
        )
    }

    return (
        <div
            data-testid="benchmark-attribution"
            className={`rounded-xl border border-hairline border-l-4 border-l-accent bg-panel px-4 py-3 ${className}`}
        >
            <p className="font-mono text-sm font-semibold tracking-tight text-ink">
                Measured on Flow {FLOW_VERSION}, {MEASURED_ON}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-ink-3">
                {RELEASE_LINE}{' '}
                <a
                    href={COMMIT_URL}
                    className="text-accent hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Open the pinned commit {SHORT_COMMIT}
                </a>
                .
            </p>
        </div>
    )
}

export { ATTRIBUTION_SHORT }
