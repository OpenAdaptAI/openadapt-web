import { useEffect, useRef, useState } from 'react'
import styles from './Clip.module.css'

const BASE = '/how-it-works/'

/**
 * Clip renders one product-demo asset from the how-it-works MANIFEST.
 *
 * We display the animated GIF rather than a <video>: a GIF ALWAYS animates
 * (it is an image, so it is not subject to the browser's video-autoplay
 * policy, which silently blocks muted autoplay under Low Power Mode, data
 * saver, and several browsers — the cause of the clips showing as static).
 *
 * Behavior:
 *  - Lazy: the (heavier) GIF is only fetched once the element nears the
 *    viewport (IntersectionObserver); until then the small jpg poster holds
 *    the space, so the clips never block the landing page.
 *  - Zero layout shift: intrinsic width/height drive an aspect-ratio box.
 *  - Under prefers-reduced-motion: reduce, the static poster is shown and the
 *    GIF is never fetched.
 *
 * @param {object} clip - a step (or variant) entry from MANIFEST.json
 */
export default function Clip({ clip }) {
    const wrapRef = useRef(null)
    const [inView, setInView] = useState(false)
    const [reducedMotion, setReducedMotion] = useState(false)

    // Respect the user's reduced-motion preference (and react to changes).
    useEffect(() => {
        if (typeof window === 'undefined' || !window.matchMedia) return
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
        const update = () => setReducedMotion(mq.matches)
        update()
        mq.addEventListener?.('change', update)
        return () => mq.removeEventListener?.('change', update)
    }, [])

    // Lazily fetch the GIF only when it nears the viewport.
    useEffect(() => {
        const el = wrapRef.current
        if (!el) return
        if (typeof IntersectionObserver === 'undefined') {
            setInView(true)
            return
        }
        const io = new IntersectionObserver(
            (entries) => {
                if (entries.some((e) => e.isIntersecting)) {
                    setInView(true)
                    io.disconnect()
                }
            },
            { rootMargin: '300px 0px' }
        )
        io.observe(el)
        return () => io.disconnect()
    }, [])

    const poster = BASE + clip.poster
    // Show the static poster until in view, and always under reduced motion.
    const src = reducedMotion || !inView ? poster : BASE + clip.gif
    const aspectRatio = `${clip.width} / ${clip.height}`

    return (
        <figure className={styles.figure}>
            <div
                ref={wrapRef}
                className={styles.media}
                style={{ aspectRatio }}
            >
                <img
                    className={styles.el}
                    src={src}
                    alt={clip.alt}
                    width={clip.width}
                    height={clip.height}
                    decoding="async"
                />
            </div>
            <figcaption className={styles.caption}>{clip.caption}</figcaption>
        </figure>
    )
}
