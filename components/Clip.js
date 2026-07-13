import { useEffect, useRef, useState } from 'react'
import styles from './Clip.module.css'

const BASE = '/how-it-works/'

/**
 * Clip renders one product-demo media asset from the how-it-works MANIFEST.
 *
 * Behavior:
 *  - Muted, looping, autoplay, playsinline <video> with webm then mp4 sources.
 *  - poster={jpg}, preload="none" and the <video> is only mounted once the
 *    element scrolls near the viewport (IntersectionObserver) — so the clips
 *    never block the landing page.
 *  - Intrinsic width/height drive an aspect-ratio box, so there is zero layout
 *    shift whether the poster or the video is showing.
 *  - Under prefers-reduced-motion: reduce, only the poster <img> renders.
 *  - GIF is a last-resort <video>-unsupported fallback, not the primary asset.
 *
 * @param {object} clip - a step entry from MANIFEST.json
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

    // Lazily mount the <video> only when it nears the viewport.
    useEffect(() => {
        if (reducedMotion) return
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
            { rootMargin: '200px 0px' }
        )
        io.observe(el)
        return () => io.disconnect()
    }, [reducedMotion])

    const poster = BASE + clip.poster
    const aspectRatio = `${clip.width} / ${clip.height}`

    return (
        <figure className={styles.figure}>
            <div
                ref={wrapRef}
                className={styles.media}
                style={{ aspectRatio }}
            >
                {reducedMotion || !inView ? (
                    <img
                        className={styles.el}
                        src={poster}
                        alt={clip.alt}
                        width={clip.width}
                        height={clip.height}
                        loading="lazy"
                        decoding="async"
                    />
                ) : (
                    <video
                        className={styles.el}
                        width={clip.width}
                        height={clip.height}
                        poster={poster}
                        preload="none"
                        autoPlay
                        loop
                        muted
                        playsInline
                        aria-label={clip.alt}
                    >
                        <source src={BASE + clip.webm} type="video/webm" />
                        <source src={BASE + clip.mp4} type="video/mp4" />
                        {/* GIF only reached if <video> itself is unsupported. */}
                        <img
                            src={BASE + clip.gif}
                            alt={clip.alt}
                            width={clip.width}
                            height={clip.height}
                        />
                    </video>
                )}
            </div>
            <figcaption className={styles.caption}>{clip.caption}</figcaption>
        </figure>
    )
}
