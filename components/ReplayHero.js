import { useEffect, useState } from 'react'

import styles from './ReplayHero.module.css'

/**
 * ReplayHero — the hero visual is the product: a compiled workflow replaying
 * as a live run report. Steps resolve deterministically in milliseconds, one
 * hits UI drift and heals itself, and the run closes with zero model calls.
 * Pure DOM + CSS (no video, no canvas); loops by remounting; static final
 * frame under prefers-reduced-motion.
 */

const ROWS = [
    { n: '1.0', action: 'click', target: "'Sign In'", rung: 'template', ms: '12ms', status: 'ok' },
    { n: '2.0', action: 'type', target: 'username', rung: '—', ms: '8ms', status: 'ok' },
    { n: '3.0', action: 'click', target: "'Tasks'", rung: 'template', ms: '9ms', status: 'ok' },
    { n: '4.0', action: 'click', target: "'Open referral'", rung: 'template', ms: '11ms', status: 'ok' },
    { n: '5.0', action: 'click', target: "'Save Encounter'", rung: 'drift', ms: '', status: 'drift' },
    { n: '', action: '', target: 'healed via geometry — fix saved as reviewable diff', rung: '', ms: '', status: 'heal' },
    { n: '', action: '', target: 'postconditions verified · run complete', rung: '', ms: '', status: 'done' },
]

const LOOP_MS = 12000

export default function ReplayHero() {
    const [cycle, setCycle] = useState(0)

    useEffect(() => {
        if (
            typeof window !== 'undefined' &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ) {
            return undefined
        }
        const timer = setInterval(() => setCycle((c) => c + 1), LOOP_MS)
        return () => clearInterval(timer)
    }, [])

    return (
        <div className={styles.frame} aria-label="Example of a compiled workflow replaying and self-healing">
            <div className={styles.titlebar}>
                <span className={styles.dot} />
                <span className={styles.dot} />
                <span className={styles.dot} />
                <span className={styles.title}>referral-intake · compiled replay</span>
                <span className={styles.badge}>local</span>
            </div>
            <div className={styles.body} key={cycle}>
                {ROWS.map((row, i) => (
                    <div
                        key={`${cycle}-${i}`}
                        className={`${styles.row} ${styles[row.status]}`}
                        style={{ animationDelay: `${0.5 + i * 1.15}s` }}
                    >
                        {row.status === 'heal' ? (
                            <span className={styles.healText}>
                                {'└'} {row.target}
                            </span>
                        ) : row.status === 'done' ? (
                            <span className={styles.doneText}>{row.target}</span>
                        ) : (
                            <>
                                <span className={styles.num}>{row.n}</span>
                                <span className={styles.action}>{row.action}</span>
                                <span className={styles.target}>{row.target}</span>
                                <span className={styles.rung}>
                                    {row.status === 'drift'
                                        ? '⚠ UI drift detected'
                                        : row.rung}
                                </span>
                                <span className={styles.ms}>{row.ms}</span>
                                <span className={styles.check}>
                                    {row.status === 'drift' ? '' : '✓'}
                                </span>
                            </>
                        )}
                    </div>
                ))}
                <div
                    className={`${styles.row} ${styles.summary}`}
                    style={{ animationDelay: `${0.5 + ROWS.length * 1.15}s` }}
                >
                    <span>
                        total 2.4s &nbsp;·&nbsp; model calls: 0 &nbsp;·&nbsp;
                        cost per run: $0.00
                    </span>
                    <span className={styles.stamp}>
                        VERIFIED · 0 MODEL CALLS
                    </span>
                </div>
            </div>
        </div>
    )
}
