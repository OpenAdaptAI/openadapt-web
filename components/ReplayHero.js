import { useEffect, useState } from 'react'
import Link from 'next/link'

import benchmark from '../data/benchmark.json'
import styles from './ReplayHero.module.css'

/**
 * ReplayHero — real proof, not a stylized mockup (Primary v2).
 *
 * Left: real footage of a compiled OpenAdapt workflow replaying against
 * OpenEMR's live public demo (public/how-it-works/run_openemr.*, provenance in
 * public/how-it-works/MANIFEST.json — source "real"). The reduced-motion / poster
 * still is a rich late frame of the run — the patient-intake form with fields
 * populated (run_openemr_intake.jpg, derived from that same real footage), not
 * the empty landing calendar.
 *
 * Right: the measured OpenEMR benchmark numbers, read straight from
 * data/benchmark.json (figures copied verbatim from the openadapt-flow benchmark
 * results and guarded so the published numbers cannot drift from /compare), plus
 * the effect-verification thesis: success is judged by an arm-independent oracle
 * reading the record itself — not the application's own "saved" banner.
 *
 * Below the two-up: the governed drift beat — the most differentiated moment —
 * shown from the real reproducible drift drill (heal_resolve.jpg, a frame of the
 * MANIFEST "heal" capture, source "real"): a drifted target re-resolved via the
 * geometry rung and a governed repair proposed as a reviewable diff, applied only
 * after sign-off, with zero model calls. Then a real OpenAdapt Cloud capture.
 *
 * The footage is rendered as an animated GIF via an <img>, matching the
 * reference-workflow section (components/Clip.js). A GIF in an <img> always
 * animates: it is an image, so it is exempt from the browser's muted-<video>
 * autoplay policy, which silently blocks autoplay under Low Power Mode / data
 * saver and leaves only the poster frame (the earlier <video> hero froze on its
 * still for those users). It is gated on prefers-reduced-motion: when motion is
 * reduced we hold the static late-frame still instead. Nothing here is
 * illustrative.
 */

const em = benchmark.openemr
const usd = (n) => `$${Number(n).toFixed(2)}`
const secs = (n) => `${Math.round(Number(n))}s`
const per1k = Math.round(em.agent.cost_usd_per_run * 1000).toLocaleString()

export default function ReplayHero() {
    const [reduced, setReduced] = useState(false)

    // Track the user's motion preference so we can hold a static frame.
    // The GIF itself autoplays for everyone (no play/pause or IntersectionObserver
    // gate is needed, or wanted: an in-view gate can get stuck and freeze the
    // still). We only swap the source to the static frame when motion is reduced.
    useEffect(() => {
        if (typeof window === 'undefined' || !window.matchMedia) return undefined
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
        const apply = () => setReduced(mq.matches)
        apply()
        mq.addEventListener?.('change', apply)
        return () => mq.removeEventListener?.('change', apply)
    }, [])

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
                        {/*
                          Animated GIF via <img>: always animates (exempt from the
                          muted-<video> autoplay policy that silently blocks
                          playback under Low Power Mode / data saver). Under
                          prefers-reduced-motion we hold the static late-frame
                          still (the populated patient-intake form) instead.
                        */}
                        <img
                            className={styles.video}
                            src={
                                reduced
                                    ? '/how-it-works/run_openemr_intake.jpg'
                                    : '/how-it-works/run_openemr.gif'
                            }
                            width="880"
                            height="550"
                            decoding="async"
                            alt="Real footage: OpenAdapt replaying a compiled 18-step workflow against OpenEMR's live public demo, logging in and filling the patient-intake form, locally and with no per-run model calls."
                        />
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

                    {/* The effect-verification thesis: what "verified" means. */}
                    <p className={styles.effectPill}>
                        <span className={styles.effectMark} aria-hidden="true">
                            ✓
                        </span>
                        <span>
                            Effect-verified against the system of record. An{' '}
                            <b>arm-independent oracle reads OpenEMR itself</b>, not
                            the app&rsquo;s own &ldquo;saved&rdquo; banner.
                        </span>
                    </p>

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

            {/* Governed drift beat — the differentiated moment — from the real
                reproducible drift drill (MANIFEST "heal" capture, source "real"). */}
            <div className={styles.drift}>
                <div className={styles.driftBody}>
                    <span className={styles.driftEyebrow}>
                        Governed drift handling
                    </span>
                    <p className={styles.driftHead}>
                        When the interface drifts, OpenAdapt re-resolves from
                        retained evidence. It doesn&rsquo;t guess.
                    </p>
                    <p className={styles.driftCallout}>
                        <span className={styles.driftWarn} aria-hidden="true">
                            ⚠
                        </span>
                        UI drift → re-resolved via the geometry rung ·{' '}
                        <b>governed repair saved</b> · 0 model calls
                    </p>
                    <p className={styles.driftFoot}>
                        Real capture · reviewable diff · nothing is applied without
                        sign-off
                    </p>
                </div>
                <figure className={styles.driftShotWrap}>
                    <span className={styles.driftTag}>
                        <span className={styles.realDot} aria-hidden="true" />
                        Real capture
                    </span>
                    <img
                        className={styles.driftShot}
                        src="/how-it-works/heal_resolve.jpg"
                        width="880"
                        height="550"
                        alt="Real drift-drill capture: a drifted target re-resolved via the geometry rung. Identity confirmed as the same record, ocr_text 'Open' repaired to 'View', proposed as a reviewable anchor patch with zero model calls."
                        loading="lazy"
                        decoding="async"
                    />
                </figure>
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
                        shipping hosted product: app.openadapt.ai
                    </span>
                </span>
                <span className={styles.hostedArrow} aria-hidden="true">
                    →
                </span>
            </Link>
        </figure>
    )
}
