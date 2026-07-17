import styles from './Testimonials.module.css'

// Every testimonial on this page must be documented. `sourceUrl` points at
// the public record of the quote; the quote text must match that source
// verbatim. Do not add testimonials without a source.
const testimonials = [
    {
        figure: '$75K',
        figureCaption: 'in under-billed procedural RVUs recovered',
        quote:
            'My hospital had under-billed $75K worth of procedural RVUs ' +
            'which took me 20 hours of manual chart review over the course ' +
            'of 6 months to recover. OpenAdapt was able to do this job ' +
            'automatically with just a few clicks. The personalized service ' +
            'and support were phenomenal. I will definitely be using ' +
            'OpenAdapt to audit my procedures every month from now on.',
        name: 'Victor Abrich, MD, FHRS',
        role: 'Electrophysiologist, MercyOne Waterloo Heart Care',
        sourceUrl: 'https://github.com/OpenAdaptAI/openadapt-web/issues/9',
        sourceLabel: 'Documented on GitHub',
    },
]

export default function Testimonials() {
    return (
        <section className={styles.section} data-testid="testimonials">
            <div className={styles.inner}>
                <p className="eyebrow">From the people running the workflows</p>
                <h2 className={styles.heading}>
                    Real work, recovered in a few clicks.
                </h2>
                <div className={styles.grid}>
                    {testimonials.map((t) => (
                        <figure key={t.name} className={styles.card}>
                            <div className={styles.figure}>{t.figure}</div>
                            <div className={styles.figureCaption}>
                                {t.figureCaption}
                            </div>
                            <blockquote className={styles.quote}>
                                &ldquo;{t.quote}&rdquo;
                            </blockquote>
                            <figcaption className={styles.attribution}>
                                <span className={styles.name}>{t.name}</span>
                                <span className={styles.role}>{t.role}</span>
                                <a
                                    className={styles.source}
                                    href={t.sourceUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {t.sourceLabel}
                                </a>
                            </figcaption>
                        </figure>
                    ))}
                </div>
            </div>
        </section>
    )
}
