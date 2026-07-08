import Link from 'next/link'

import styles from './ProofBand.module.css'

const BENCHMARK_URL =
    'https://github.com/OpenAdaptAI/openadapt-flow/blob/main/benchmark/BENCHMARK.md'

const stats = [
    {
        figure: '4.9s vs 37.5s',
        caption: 'median run, compiled vs computer-use agent',
    },
    {
        figure: '$0 vs $0.27',
        caption: 'model cost per run',
    },
    {
        figure: '100/100',
        caption: 'compiled replays succeeded (agent: 20/20)',
    },
]

export default function ProofBand() {
    return (
        <section className={styles.section}>
            <div className={styles.inner}>
                <p className="eyebrow">Measured 2026-07-08</p>
                <div className={styles.grid}>
                    {stats.map((stat) => (
                        <div key={stat.figure} className={styles.card}>
                            <div className={styles.figure}>{stat.figure}</div>
                            <div className={styles.caption}>{stat.caption}</div>
                        </div>
                    ))}
                </div>
                <p className={styles.note}>Same task, same success check.</p>
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
