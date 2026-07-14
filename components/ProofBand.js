import Link from 'next/link'

import benchmark from '../data/benchmark.json'
import styles from './ProofBand.module.css'

// Numbers are read from data/benchmark.json (copied verbatim from the
// openadapt-flow benchmark results) so the band cannot drift from the measured
// results. The reproducible MockMed anchor leads; OpenEMR is a labelled field
// cross-check. Both benchmarks show a cost-and-latency gap, not a reliability
// gap: both arms pass every run.
const mm = benchmark.mockmed
const em = benchmark.openemr

const secs = (s) => `${Math.round(s)}s`
const cost = (c) => (c === 0 ? '$0' : `$${c.toFixed(2)}`)

const stats = [
    {
        figure: `${secs(mm.compiled.wall_s_p50)} vs ${secs(mm.agent.wall_s_p50)}`,
        caption: 'typical run: OpenAdapt vs an AI agent',
    },
    {
        figure: `${cost(mm.compiled.cost_usd_per_run)} vs ${cost(mm.agent.cost_usd_per_run)}`,
        caption: 'AI cost per run (agent priced at list rate)',
    },
    {
        figure: `${mm.compiled.model_calls_per_run} vs ${mm.agent.model_calls_per_run}`,
        caption: 'AI calls per run: none on a healthy OpenAdapt run',
    },
]

export default function ProofBand() {
    return (
        <section className={styles.section}>
            <div className={styles.inner}>
                <p className="eyebrow">
                    MockMed benchmark · reproducible · cost and latency
                </p>
                <div className={styles.grid}>
                    {stats.map((stat) => (
                        <div key={stat.figure} className={styles.card}>
                            <div className={styles.figure}>{stat.figure}</div>
                            <div className={styles.caption}>{stat.caption}</div>
                        </div>
                    ))}
                </div>
                <p className={styles.note}>
                    The same clinical task, run both ways on MockMed, the demo app that
                    ships with openadapt-flow so anyone can reproduce these numbers
                    exactly ({mm.compiled.n} OpenAdapt replays vs{' '}
                    {mm.agent.n} agent runs). Both passed the same
                    independent check every time. So this is a gap in cost and speed,
                    not in reliability. The agent cost is list price;
                    an introductory rate lowers it through 2026-08-31.
                </p>
                <p className={styles.note}>
                    We also ran it on the live OpenEMR public demo (N=
                    {em.agent.n} agent runs, both passed 100%). It runs on a shared
                    instance that resets daily, so you cannot reproduce it exactly.
                    Treat it as cost and speed only. It says nothing about
                    reliability on a real EMR.
                </p>
                <div className={styles.links}>
                    <Link href="/compare">How we measured it →</Link>
                    <a
                        href={mm.methodology_url}
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
