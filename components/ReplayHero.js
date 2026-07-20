import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

import styles from './ReplayHero.module.css'

/**
 * ReplayHero — a stylized, illustrative depiction of a compiled workflow
 * replaying as a run report. The same governed loop is shown running across
 * every interface the work is trapped behind (browser, Windows, macOS, RDP,
 * Citrix): a substrate strip cycles while steps resolve through the
 * deterministic ladder, one hits UI drift and re-resolves deterministically,
 * and the run closes with zero model calls. A cursor tracks the trace, a scan
 * sweep fires on the drift beat, and a VERIFIED stamp punches in as the
 * emotional peak. A real OpenAdapt Cloud screenshot sits alongside as
 * shipping-product proof.
 *
 * The numbers shown are an illustration of the intended behavior, not
 * captured benchmark data — a visible caption says so, and measured results
 * live on the Compare page.
 *
 * Pure DOM + CSS (no video, no canvas); plays while visible and restarts from
 * the top whenever it scrolls back into view, so every viewing starts at step
 * 1.0; static final frame under prefers-reduced-motion.
 */

// The substrate set OpenAdapt runs the one governed loop across. Target-state:
// every interface is first-class. The strip cycles through them so the hero
// reads as "the same loop, every interface," not a browser-only demo.
const SUBSTRATES = [
    { key: 'browser', label: 'Browser', chrome: 'app.openemr — referral-intake' },
    { key: 'windows', label: 'Windows', chrome: 'OpenEMR (Win32) — referral-intake' },
    { key: 'macos', label: 'macOS', chrome: 'OpenEMR.app — referral-intake' },
    { key: 'rdp', label: 'RDP', chrome: 'RDP · win-emr-01 — referral-intake' },
    { key: 'citrix', label: 'Citrix', chrome: 'Citrix HDX · EMR — referral-intake' },
]

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
    // The substrate label advances one notch per loop so the run visibly
    // repeats across every interface over successive plays.
    const [substrateIndex, setSubstrateIndex] = useState(0)

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
            timer = setInterval(() => {
                setCycle((c) => c + 1)
                setSubstrateIndex((s) => (s + 1) % SUBSTRATES.length)
            }, LOOP_MS)
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

    const substrate = SUBSTRATES[substrateIndex]

    return (
        <figure className={styles.figure}>
            <div className={styles.stage}>
                <div
                    ref={frameRef}
                    className={styles.frame}
                    aria-label="Illustrative example of one governed workflow replaying and re-resolving UI drift across every interface"
                >
                    <div className={styles.titlebar}>
                        <span className={styles.dot} />
                        <span className={styles.dot} />
                        <span className={styles.dot} />
                        <span className={styles.title}>{substrate.chrome}</span>
                        <span className={styles.badge}>
                            <span className={styles.badgeDot} aria-hidden="true" />
                            illustrative
                        </span>
                    </div>

                    {/* Substrate strip: the one governed loop, every interface. */}
                    <div
                        className={styles.substrates}
                        aria-label="Runs across every interface"
                    >
                        {SUBSTRATES.map((item, i) => (
                            <span
                                key={item.key}
                                className={`${styles.substrate} ${
                                    i === substrateIndex ? styles.substrateOn : ''
                                }`}
                            >
                                {item.label}
                            </span>
                        ))}
                        <span className={styles.substrateNote}>one loop</span>
                    </div>

                    <div className={styles.body} key={cycle}>
                        {/* Scan sweep fires on the drift beat. */}
                        <span className={styles.scan} aria-hidden="true" />

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

                {/* Shipping-product proof: a real OpenAdapt Cloud capture that
                    reads the same run out of the hosted dashboard. */}
                <aside
                    className={styles.proof}
                    aria-label="The same run in OpenAdapt Cloud"
                >
                    <div className={styles.proofChrome}>
                        <span className={styles.proofBrand}>
                            <b>OpenAdapt</b> Cloud
                        </span>
                        <span className={styles.proofUrl}>app.openadapt.ai</span>
                    </div>
                    <img
                        className={styles.proofShot}
                        src="/cloud-preview/healthcare-run.jpg"
                        width="880"
                        height="550"
                        alt="OpenAdapt Cloud run detail for a completed synthetic OpenEMR run: step metrics and a verified-effect timeline in the real hosted dashboard."
                        loading="lazy"
                        decoding="async"
                    />
                    <div className={styles.proofFoot}>
                        <span className={styles.proofPill}>Effect verified</span>
                        <Link href="#cloud-product" className={styles.proofLink}>
                            See the shipping product →
                        </Link>
                    </div>
                </aside>
            </div>

            <figcaption className={styles.illustrative}>
                Illustrative — a stylized depiction of a compiled replay, not
                captured benchmark data. See{' '}
                <Link href="/compare">measured results</Link>.
            </figcaption>
        </figure>
    )
}
