import { useEffect, useRef, useState } from 'react'

import styles from './DashboardShowcase.module.css'

const PREVIEW_LABEL = 'Product preview · demonstration data'

export default function DashboardShowcase() {
    const videoRef = useRef(null)
    const [paused, setPaused] = useState(true)
    const [reducedMotion, setReducedMotion] = useState(false)

    useEffect(() => {
        const preference = window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        )
        const syncPreference = () => setReducedMotion(preference.matches)

        syncPreference()
        preference.addEventListener?.('change', syncPreference)
        return () => preference.removeEventListener?.('change', syncPreference)
    }, [])

    useEffect(() => {
        if (reducedMotion) {
            videoRef.current?.pause()
        }
    }, [reducedMotion])

    const togglePlayback = async () => {
        const video = videoRef.current
        if (!video) return

        if (video.paused) {
            try {
                await video.play()
            } catch {
                setPaused(true)
            }
            return
        }

        video.pause()
    }

    return (
        <section
            className={styles.section}
            id="cloud-product"
            aria-labelledby="cloud-product-heading"
        >
            <div className={styles.inner}>
                <div className={styles.intro}>
                    <p className={styles.eyebrow}>OpenAdapt Cloud</p>
                    <h2
                        className={styles.heading}
                        id="cloud-product-heading"
                    >
                        From approved workflow to reviewable outcome.
                    </h2>
                    <p className={styles.summary}>
                        See how the Cloud app brings governed launches, run
                        evidence, and needs-attention signals into one operating
                        view. This guided product preview uses synthetic
                        demonstration data.
                    </p>
                </div>

                <figure
                    className={styles.figure}
                    data-testid="dashboard-product-preview"
                >
                    <div
                        className={styles.media}
                        data-reduced-motion={
                            reducedMotion ? 'true' : 'false'
                        }
                    >
                        <video
                            ref={videoRef}
                            className={styles.video}
                            autoPlay={!reducedMotion}
                            muted
                            loop
                            playsInline
                            preload="metadata"
                            poster="/product-preview/dashboard-workflows.png"
                            aria-label="OpenAdapt Cloud product walkthrough using synthetic demonstration data."
                            aria-describedby="dashboard-preview-caption"
                            onPause={() => setPaused(true)}
                            onPlay={() => setPaused(false)}
                        >
                            <source
                                src="/product-preview/dashboard-walkthrough.mp4"
                                type="video/mp4"
                            />
                        </video>
                        <img
                            className={styles.still}
                            src="/product-preview/dashboard-workflows.png"
                            width="2880"
                            height="1800"
                            alt="OpenAdapt Cloud workflow library populated with synthetic demonstration workflows."
                            loading="lazy"
                            decoding="async"
                        />
                        <span
                            className={styles.mediaLabel}
                            data-testid="dashboard-preview-media-label"
                        >
                            {PREVIEW_LABEL}
                        </span>
                        <button
                            className={styles.playback}
                            type="button"
                            onClick={togglePlayback}
                            aria-label={
                                paused
                                    ? 'Play product preview'
                                    : 'Pause product preview'
                            }
                        >
                            <span aria-hidden="true">
                                {paused ? '▶' : 'Ⅱ'}
                            </span>
                            {paused ? 'Play' : 'Pause'}
                        </button>
                    </div>
                    <figcaption
                        className={styles.caption}
                        id="dashboard-preview-caption"
                    >
                        <strong>
                            Workflow library → run evidence → needs-attention
                            queue
                        </strong>
                        <span>
                            Real OpenAdapt Cloud interface · synthetic local
                            demonstration data
                        </span>
                    </figcaption>
                </figure>

                <ul className={styles.capabilities}>
                    <li>
                        <span>01</span>
                        <div>
                            <strong>Launch approved work</strong>
                            <p>
                                Keep bounded workflows, schedules, and run
                                controls in one operating view.
                            </p>
                        </div>
                    </li>
                    <li>
                        <span>02</span>
                        <div>
                            <strong>Inspect the evidence</strong>
                            <p>
                                Review reported steps, identity coverage, and
                                effect-verification status for each run.
                            </p>
                        </div>
                    </li>
                    <li>
                        <span>03</span>
                        <div>
                            <strong>Resolve safe halts</strong>
                            <p>
                                Send ambiguous or unverifiable work to an
                                attended queue instead of letting execution
                                guess.
                            </p>
                        </div>
                    </li>
                </ul>

                <div className={styles.actions}>
                    <a
                        className="btn-ink"
                        href="https://app.openadapt.ai/dashboard"
                    >
                        Open the Cloud app
                    </a>
                    <a className="btn-ghost-ink" href="#pricing">
                        See launch plans
                    </a>
                </div>
            </div>
        </section>
    )
}
