import { useEffect, useState } from 'react'
import styles from './Clip.module.css'

const BASE = '/how-it-works/'

/**
 * Clip renders one product-demo asset from the how-it-works MANIFEST.
 *
 * We display the animated GIF via an <img>: a GIF ALWAYS animates (it is an
 * image, so it is exempt from the browser's video-autoplay policy, which
 * silently blocks muted autoplay under Low Power Mode / data saver). The
 * <img> points DIRECTLY at the GIF and relies on native loading="lazy" for
 * deferral — no IntersectionObserver, no poster/gif state swap. An earlier
 * version gated the swap on an "in view" flag that could get stuck, leaving
 * the clip frozen on its static poster; pointing straight at the GIF removes
 * that failure mode entirely.
 *
 * Accessibility: under prefers-reduced-motion: reduce we do NOT autoplay.
 * Instead we show the static poster with an explicit Play control, so
 * motion-sensitive visitors still get a silent page by default but can opt in
 * to see the demonstration. (Freezing on the poster with no way to play it was
 * the previous, worse behavior.)
 *
 * @param {object} clip - a step (or variant) entry from MANIFEST.json
 */
export default function Clip({ clip }) {
    const [reducedMotion, setReducedMotion] = useState(false)
    const [optedIn, setOptedIn] = useState(false)

    // Respect the user's reduced-motion preference (and react to changes).
    useEffect(() => {
        if (typeof window === 'undefined' || !window.matchMedia) return
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
        const update = () => setReducedMotion(mq.matches)
        update()
        mq.addEventListener?.('change', update)
        return () => mq.removeEventListener?.('change', update)
    }, [])

    // Animate for everyone except reduced-motion visitors who haven't opted in.
    const animate = !reducedMotion || optedIn
    const src = BASE + (animate ? clip.gif : clip.poster)
    const aspectRatio = `${clip.width} / ${clip.height}`

    return (
        <figure className={styles.figure}>
            <div className={styles.media} style={{ aspectRatio }}>
                <img
                    className={styles.el}
                    src={src}
                    alt={clip.alt}
                    width={clip.width}
                    height={clip.height}
                    loading="lazy"
                    decoding="async"
                />
                {reducedMotion && !optedIn && (
                    <button
                        type="button"
                        className={styles.play}
                        onClick={() => setOptedIn(true)}
                        aria-label={`Play animation: ${clip.caption}`}
                    >
                        <span className={styles.playIcon} aria-hidden="true">
                            ▶
                        </span>
                        Play
                    </button>
                )}
            </div>
            <figcaption className={styles.caption}>{clip.caption}</figcaption>
        </figure>
    )
}
