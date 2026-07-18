import ExecutionEnvironmentOverlay from './ExecutionEnvironmentOverlay'
import styles from './Clip.module.css'

const BASE = '/how-it-works/'

/**
 * Clip renders one product-demo asset from the how-it-works MANIFEST.
 *
 * We display the animated GIF via an <img> pointed DIRECTLY at the GIF: a GIF
 * in an <img> always animates (it is an image, so it is exempt from the
 * browser's video-autoplay policy, which silently blocks muted <video>
 * autoplay under Low Power Mode / data saver). native loading="lazy" defers
 * off-screen clips. There is deliberately no poster/gif swap and no
 * IntersectionObserver gate — an earlier version gated the swap on an "in
 * view" flag that could get stuck, leaving every clip frozen on its static
 * poster (the demos never animated on the live site).
 *
 * These clips ARE the primary content of the section, so they autoplay for
 * everyone (they loop by the GIF's own loop flag).
 *
 * @param {object} clip - a step (or variant) entry from MANIFEST.json
 */
export default function Clip({ clip, environment, reference }) {
    const aspectRatio = `${clip.width} / ${clip.height}`
    const src = clip.gif.startsWith('/') ? clip.gif : BASE + clip.gif
    return (
        <figure
            className={styles.figure}
            data-testid="execution-footage-panel"
            data-reference={reference?.key}
            data-execution-environment={environment?.key}
            data-environment-source-kind={environment?.sourceKind}
        >
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
                {environment && reference && (
                    <ExecutionEnvironmentOverlay
                        environment={environment}
                        reference={reference}
                    />
                )}
            </div>
            <figcaption className={styles.caption}>
                <span>{clip.caption}</span>
                {environment && (
                    <small>{environment.mediaCaption}</small>
                )}
            </figcaption>
        </figure>
    )
}
