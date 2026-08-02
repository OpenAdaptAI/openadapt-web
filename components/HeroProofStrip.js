import Link from 'next/link'

import benchmark from '../data/benchmark.json'
import { ATTRIBUTION_SHORT } from '../lib/benchmarkProvenance'

/*
 * Compact run-economics strip directly under the hero.
 *
 * The sharpest published numbers on this site sat only on /compare; a visitor
 * who never clicked through left without them. This strip surfaces the same
 * three figures beside the hero, derived from data/benchmark.json with the
 * same formulas as /compare's charts, so the two surfaces cannot state
 * different numbers. Registered in data/published-version-claims.json under
 * attribution_required: the ATTRIBUTION_SHORT chip below must stay next to
 * the figures.
 *
 * Scope stays honest: these are measured MockMed benchmark results, labelled
 * as such, with the full method, samples, and caveats one click away.
 */
const mm = benchmark.mockmed

const speedup = (mm.agent.wall_s_p50 / mm.compiled.wall_s_p50).toFixed(1)
const agentCost = `$${mm.agent.cost_usd_per_run.toFixed(2)}`

const STATS = [
    {
        figure: `${mm.compiled.model_calls_per_run} model calls`,
        caption: 'on a healthy replay',
    },
    {
        figure: `${speedup}× faster`,
        caption: 'median run vs. a computer-use agent',
    },
    {
        figure: `$0 vs ${agentCost}`,
        caption: 'model cost per run',
    },
]

export default function HeroProofStrip() {
    return (
        <section
            className="border-b border-hairline bg-panel px-5 py-8"
            data-testid="hero-proof-strip"
        >
            <div className="mx-auto max-w-5xl">
                <p className="text-center text-base leading-relaxed text-ink-2 md:text-lg">
                    Show it once. It runs the same way every time. If anything
                    looks wrong, it stops and asks a person instead of
                    guessing.
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    {STATS.map((stat) => (
                        <div
                            key={stat.figure}
                            className="rounded-xl border border-hairline bg-ground p-4 text-center"
                        >
                            <p className="font-display text-2xl font-semibold tracking-tight text-ink tnum">
                                {stat.figure}
                            </p>
                            <p className="mt-1 text-sm leading-relaxed text-ink-2">
                                {stat.caption}
                            </p>
                        </div>
                    ))}
                </div>
                <p className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-ink-3">
                    <span className="chip-evidence">{ATTRIBUTION_SHORT}</span>
                    <span>
                        Measured on the MockMed benchmark, reproducible from
                        source.
                    </span>
                    <Link
                        href="/compare#benchmark-evidence"
                        className="font-medium text-accent"
                    >
                        Method, samples, and caveats →
                    </Link>
                </p>
            </div>
        </section>
    )
}
