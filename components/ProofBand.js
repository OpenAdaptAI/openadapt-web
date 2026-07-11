import Link from 'next/link'

import styles from './ProofBand.module.css'

const BENCHMARK_URL =
    'https://github.com/OpenAdaptAI/openadapt-flow/blob/main/benchmark/openemr/BENCHMARK.md'

const stats = [
    {
        figure: '39s vs 70s',
        caption: 'median run, compiled replay vs computer-use agent',
    },
    {
        figure: '$0 vs $0.55',
        caption: 'model cost per run',
    },
    {
        figure: '0 vs ~24',
        caption: 'model calls per run — the replay is deterministic',
    },
]

export default function ProofBand() {
    return (
        <section className={styles.section}>
            <div className={styles.inner}>
                <p className="eyebrow">Real EMR · measured 2026-07-08</p>
                <div className={styles.grid}>
                    {stats.map((stat) => (
                        <div key={stat.figure} className={styles.card}>
                            <div className={styles.figure}>{stat.figure}</div>
                            <div className={styles.caption}>{stat.caption}</div>
                        </div>
                    ))}
                </div>
                <p className={styles.note}>
                    Same 18-step task on the live OpenEMR demo, one success
                    check for both. Both finished every run; the difference is
                    what each run costs you.
                </p>
                <div className={styles.links}>
                    <Link href="/compare">How we measured it →</Link>
                    <a
                        href={BENCHMARK_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Full methodology on GitHub
                    </a>
                </div>
            </div>
        </section>
    )
}
