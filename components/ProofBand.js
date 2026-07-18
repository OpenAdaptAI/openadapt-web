import Link from 'next/link'

import benchmark from '../data/benchmark.json'
import styles from './ProofBand.module.css'

// Keep the homepage at the buyer-level outcome. Sample sizes, environment,
// pricing basis, reproducibility, and caveats live in the linked evidence.
const mm = benchmark.mockmed

const speedup = `${(mm.agent.wall_s_p50 / mm.compiled.wall_s_p50).toFixed(1)}×`

const stats = [
    {
        figure: `${speedup} faster`,
        caption: 'median workflow time than the computer-use agent',
    },
    {
        figure: '$0 model cost',
        caption: 'on a healthy compiled replay',
    },
    {
        figure: `${mm.compiled.model_calls_per_run} model calls`,
        caption: 'on a healthy compiled replay',
    },
]

export default function ProofBand() {
    return (
        <section className={styles.section} data-testid="benchmark-proof">
            <div className={styles.inner}>
                <p className="eyebrow">Measured evidence for repeated browser work</p>
                <h2 className={styles.heading}>
                    Repeated work should not pay an agent to rethink the same task.
                </h2>
                <div className={styles.grid}>
                    {stats.map((stat) => (
                        <div key={stat.figure} className={styles.card}>
                            <div className={`${styles.figure} tnum`}>
                                {stat.figure}
                            </div>
                            <div className={styles.caption}>{stat.caption}</div>
                        </div>
                    ))}
                </div>
                <p className={styles.note}>
                    In a bounded browser benchmark, both approaches completed every
                    tested run. OpenAdapt&apos;s median compiled replay was {speedup}{' '}
                    faster and incurred no model cost on healthy runs. This benchmark
                    measures speed and model cost for one task; it is not a
                    production reliability claim.
                </p>
                <div className={styles.links}>
                    <Link href="/compare#benchmark-evidence">Compare the approaches</Link>
                    <a
                        href={mm.methodology_url}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Review scope, samples, pricing basis, caveats, and raw results
                    </a>
                </div>
                <div className={styles.provenance}>
                    <a
                        className="chip-evidence"
                        href={mm.results_url}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        results.json
                    </a>
                    <a
                        className="chip-evidence"
                        href={`https://github.com/${benchmark.provenance.source_repo}/tree/${benchmark.provenance.commit}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        commit {benchmark.provenance.commit.slice(0, 7)}
                    </a>
                    <a
                        className="chip-evidence"
                        href="https://github.com/OpenAdaptAI/openadapt-web/blob/main/tests/publicTruth.test.js"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        truth tests in CI
                    </a>
                </div>
                <p className={styles.provenanceNote}>
                    Figures are copied verbatim from the published results file
                    at the pinned commit and re-rendered at build time. The
                    claims on this page are checked by automated truth tests.
                </p>
            </div>
        </section>
    )
}
