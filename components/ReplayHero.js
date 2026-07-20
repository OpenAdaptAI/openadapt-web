import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

import benchmark from '../data/benchmark.json'
import styles from './ReplayHero.module.css'

/**
 * ReplayHero — real proof, not a stylized mockup.
 *
 * Left: real footage of a compiled OpenAdapt workflow replaying against
 * OpenEMR's live public demo (public/how-it-works/run_openemr.*, provenance in
 * public/how-it-works/MANIFEST.json — source "real"). Right: the measured
 * OpenEMR benchmark numbers, read straight from data/benchmark.json (figures
 * copied verbatim from the openadapt-flow benchmark results and guarded so the
 * published numbers cannot drift from /compare). Below: a real OpenAdapt Cloud
 * capture showing the same run in the shipping hosted product.
 *
 * The footage is gated on prefers-reduced-motion (static poster frame when
 * motion is reduced) and paused while off-screen. Nothing here is illustrative.
 */

const em = benchmark.openemr
const usd = (n) => `$${Number(n).toFixed(2)}`
const secs = (n) => `${Math.round(Number(n))}s`
const per1k = Math.round(em.agent.cost_usd_per_run * 1000).toLocaleString()

export default function ReplayHero() {
    const videoRef = useRef(null)
    const [reduced, setReduced] = useState(false)

    // Track the user's motion preference so we can hold a static frame.
    useEffect(() => {
        if (typeof window === 'undefined' || !window.matchMedia) return undefined
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
        const apply = () => setReduced(mq.matches)
        apply()
        mq.addEventListener?.('change', apply)
        return () => mq.removeEventListener?.('change', apply)
    }, [])

    // Play only while visible and only when motion is allowed.
    useEffect(() => {
        const video = videoRef.current
        if (!video) return undefined
        if (reduced) {
            video.pause()
            return undefined
        }
        if (typeof IntersectionObserver === 'undefined') {
            video.play?.().catch(() => {})
            return undefined
        }
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) video.play?.().catch(() => {})
                else video.pause?.()
            },
            { threshold: 0.25 }
        )
        observer.observe(video)
        return () => observer.disconnect()
    }, [reduced])

    const compiled = em.compiled
    const agent = em.agent

    return (
        <figure className={styles.figure}>
            <div className={styles.stage}>
                {/* Real footage: a compiled replay driving a live OpenEMR. */}
                <div className={styles.frame}>
                    <div className={styles.titlebar}>
                        <span className={`${styles.dot} ${styles.dotR}`} />
                        <span className={`${styles.dot} ${styles.dotY}`} />
                        <span className={`${styles.dot} ${styles.dotG}`} />
                        <span className={styles.urlPill}>
                            demo.openemr.io · referral-intake
                        </span>
                        <span className={styles.realTag}>
                            <span className={styles.realDot} aria-hidden="true" />
                            Real run
                        </span>
                    </div>
                    <div className={styles.screen}>
                        <video
                            ref={videoRef}
                            className={styles.video}
                            poster="/how-it-works/run_openemr.jpg"
                            width="880"
                            height="550"
                            autoPlay
                            muted
                            loop
                            playsInline
                            preload="metadata"
                            aria-label="Real footage: OpenAdapt replaying a compiled 18-step workflow against OpenEMR's live public demo, locally and with no per-run model calls."
                        >
                            <source
                                src="/how-it-works/run_openemr.webm"
                                type="video/webm"
                            />
                            <source
                                src="/how-it-works/run_openemr.mp4"
                                type="video/mp4"
                            />
                        </video>
                    </div>
                    <figcaption className={styles.frameCaption}>
                        A compiled workflow replaying against OpenEMR&rsquo;s live
                        public demo. The same governed loop runs across browser,
                        Windows, macOS, RDP, and Citrix.
                    </figcaption>
                </div>

                {/* Measured proof: numbers straight from data/benchmark.json. */}
                <aside
                    className={styles.ledger}
                    aria-label="Measured OpenEMR benchmark results"
                >
                    <div className={styles.ledgerHead}>
                        <span className={styles.eyebrow}>
                            Measured · OpenEMR public demo
                        </span>
                        <span className={styles.stamp}>Verified</span>
                    </div>

                    <div className={styles.statGrid}>
                        <div className={styles.stat}>
                            <span className={`${styles.statNum} tnum`}>
                                {compiled.success_count}/{compiled.n}
                            </span>
                            <span className={styles.statLabel}>runs verified</span>
                        </div>
                        <div className={styles.stat}>
                            <span className={`${styles.statNum} tnum`}>
                                {usd(compiled.cost_usd_per_run)}
                            </span>
                            <span className={styles.statLabel}>model cost / run</span>
                        </div>
                        <div className={styles.stat}>
                            <span className={`${styles.statNum} tnum`}>
                                {compiled.model_calls_per_run}
                            </span>
                            <span className={styles.statLabel}>model calls / run</span>
                        </div>
                    </div>

                    <div className={styles.compare}>
                        <div className={styles.compareRow}>
                            <span className={styles.compareWho}>
                                AI agent, same task
                            </span>
                            <span className={`${styles.compareVals} tnum`}>
                                {usd(agent.cost_usd_per_run)}/run ·{' '}
                                {agent.model_calls_per_run} model calls ·{' '}
                                {secs(agent.wall_s_p50)}
                            </span>
                        </div>
                        <div className={`${styles.compareRow} ${styles.compareUs}`}>
                            <span className={styles.compareWho}>
                                OpenAdapt, compiled
                            </span>
                            <span className={`${styles.compareVals} tnum`}>
                                {usd(compiled.cost_usd_per_run)}/run ·{' '}
                                {compiled.model_calls_per_run} model calls ·{' '}
                                {secs(compiled.wall_s_p50)}
                            </span>
                        </div>
                    </div>

                    <div className={styles.per1k}>
                        <span className={styles.per1kHead}>
                            Cost per 1,000 runs
                        </span>
                        <div className={styles.barRow}>
                            <span className={styles.barLabel}>AI agent</span>
                            <span className={styles.barTrack}>
                                <span className={styles.barFillAgent} />
                            </span>
                            <span className={`${styles.barVal} tnum`}>
                                ${per1k}
                            </span>
                        </div>
                        <div className={`${styles.barRow} ${styles.barRowUs}`}>
                            <span className={styles.barLabel}>OpenAdapt</span>
                            <span className={styles.barTrack}>
                                <span className={styles.barFillUs} />
                            </span>
                            <span className={`${styles.barVal} tnum`}>$0</span>
                        </div>
                    </div>

                    <div className={styles.ledgerFoot}>
                        <span>{em.workflow_steps}-step add-note workflow</span>
                        <Link href="/compare">Method &amp; raw results →</Link>
                    </div>
                </aside>
            </div>

            {/* Shipping product: the same run, inspectable in OpenAdapt Cloud. */}
            <Link href="#cloud-product" className={styles.hosted}>
                <span className={styles.hostedShotWrap}>
                    <img
                        className={styles.hostedShot}
                        src="/cloud-preview/healthcare-run.jpg"
                        width="880"
                        height="550"
                        alt="OpenAdapt Cloud run detail: per-step metrics and a verified-effect timeline in the hosted dashboard."
                        loading="lazy"
                        decoding="async"
                    />
                </span>
                <span className={styles.hostedText}>
                    <b>Every run is inspectable in OpenAdapt Cloud.</b>
                    <span className={styles.hostedSub}>
                        Run history, per-step evidence, and verified effects in the
                        shipping hosted product — app.openadapt.ai
                    </span>
                </span>
                <span className={styles.hostedArrow} aria-hidden="true">
                    →
                </span>
            </Link>
        </figure>
    )
}
