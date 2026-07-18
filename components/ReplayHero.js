import { useEffect, useRef, useState } from 'react'

import styles from './ReplayHero.module.css'

/**
 * ReplayHero — the hero visual is the product: a compiled workflow replaying
 * as a live run report. Steps resolve through the deterministic ladder, one
 * hits UI drift and re-resolves deterministically, and the run closes with
 * zero model calls.
 * Pure DOM + CSS (no video, no canvas); plays while visible and restarts
 * from the top whenever it scrolls back into view, so every viewing starts
 * at step 1.0; static final frame under prefers-reduced-motion.
 */

const ROWS = [
    { n: '1.0', action: 'click', target: "'Sign In'", rung: 'template', ms: '12ms', status: 'ok' },
    { n: '2.0', action: 'type', target: 'username', rung: '—', ms: '8ms', status: 'ok' },
    { n: '3.0', action: 'click', target: "'Tasks'", rung: 'template', ms: '9ms', status: 'ok' },
    { n: '4.0', action: 'click', target: "'Open referral'", rung: 'template', ms: '11ms', status: 'ok' },
    { n: '5.0', action: 'click', target: "'Save Encounter'", rung: 'drift', ms: '', status: 'drift' },
    { n: '', action: '', target: 're-resolved via geometry — anchor update saved as diff', rung: '', ms: '', status: 'heal' },
    { n: '', action: '', target: 'postconditions verified · run complete', rung: '', ms: '', status: 'done' },
]

const ROW_DELAY_S = (i) => 0.5 + i * 1.15
const STEP_COUNT = 5 // rows with a decimal step number feed the replay rail
const DRIFT_INDEX = 4
const LOOP_MS = 12000

export default function ReplayHero() {
    const frameRef = useRef(null)
    const [cycle, setCycle] = useState(0)

    useEffect(() => {
        if (
            typeof window === 'undefined' ||
            window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ) {
            return undefined
        }

        let timer = null
        const startLoop = () => {
            if (timer) return
            timer = setInterval(() => setCycle((c) => c + 1), LOOP_MS)
        }
        const stopLoop = () => {
            if (!timer) return
            clearInterval(timer)
            timer = null
        }

        const node = frameRef.current
        if (!node || typeof IntersectionObserver === 'undefined') {
            startLoop()
            return stopLoop
        }

        let everHidden = false
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    // Restart from step 1.0 when scrolling back to the hero.
                    if (everHidden) setCycle((c) => c + 1)
                    startLoop()
                } else {
                    everHidden = true
                    stopLoop()
                }
            },
            { threshold: 0.3 }
        )
        observer.observe(node)
        return () => {
            observer.disconnect()
            stopLoop()
        }
    }, [])

    return (
        <div
            ref={frameRef}
            className={styles.frame}
            aria-label="Example of a compiled workflow replaying and re-resolving UI drift"
        >
            <div className={styles.titlebar}>
                <span className={styles.dot} />
                <span className={styles.dot} />
                <span className={styles.dot} />
                <span className={styles.title}>referral-intake · compiled replay</span>
                <span className={styles.badge}>
                    <span className={styles.badgeDot} aria-hidden="true" />
                    local
                </span>
            </div>
            <div className={styles.body} key={cycle}>
                <div className={styles.rail} aria-hidden="true">
                    {Array.from({ length: STEP_COUNT }, (_, i) => (
                        <span
                            key={`${cycle}-tick-${i}`}
                            className={`${styles.tick} ${
                                i === DRIFT_INDEX ? styles.tickDrift : ''
                            }`}
                            style={{ animationDelay: `${ROW_DELAY_S(i)}s` }}
                        />
                    ))}
                </div>
                {ROWS.map((row, i) => (
                    <div
                        key={`${cycle}-${i}`}
                        className={`${styles.row} ${styles[row.status]}`}
                        style={{ animationDelay: `${ROW_DELAY_S(i)}s` }}
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
                    style={{ animationDelay: `${ROW_DELAY_S(ROWS.length)}s` }}
                >
                    <span>
                        total 2.4s &nbsp;·&nbsp; model calls: 0 &nbsp;·&nbsp;
                        cost per run: $0.00
                        <span className={styles.cursor} aria-hidden="true" />
                    </span>
                    <span className={styles.stamp}>
                        VERIFIED · 0 MODEL CALLS
                    </span>
                </div>
            </div>
        </div>
    )
}
