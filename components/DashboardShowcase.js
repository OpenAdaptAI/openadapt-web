import { useEffect, useState } from 'react'
import styles from './DashboardShowcase.module.css'

// Real screenshots of the shipping OpenAdapt Cloud product (openadapt-cloud),
// captured from the actual dashboard UI. This is a rotating showcase: the large
// slot cycles through the real product frames (dashboard, run detail, halt
// evidence, program visualizer, workflow catalog) so each gets time on screen
// big enough to read. Every frame is the real interface running in its local
// mock-data mode with synthetic records (see /product-preview/MANIFEST.json and
// /cloud-preview/provenance.json). Nothing here is a hand-drawn or synthetic
// mockup of an app that does not exist.
//
// Order matters: the dashboard is first so it is the default (and SSR / no-JS)
// frame, which is why the browser address bar reads app.openadapt.ai/dashboard
// before any rotation. Aspect ratios differ a lot (the dashboard is wide, the
// program graph and catalog are very tall), so each slide carries an explicit
// object-position; the tall captures are top-anchored so their meaningful top
// content renders big.
const SLIDES = [
    {
        key: 'dashboard',
        src: '/product-preview/dashboard-workflows.png',
        width: 2880,
        height: 1800,
        focus: '50% 0%',
        address: 'app.openadapt.ai/dashboard',
        label: 'Dashboard',
        caption:
            'Approved workflows, compiled bundle versions, and run history in one hosted dashboard.',
        alt: 'The OpenAdapt Cloud workflows dashboard at app.openadapt.ai: approved workflows, compiled bundle versions, and run history in the real hosted product.',
    },
    {
        key: 'run',
        src: '/cloud-preview/healthcare-run.jpg',
        width: 2560,
        height: 1600,
        focus: '50% 0%',
        address: 'app.openadapt.ai/runs',
        label: 'Run detail',
        caption:
            'Step timeline and independently verified effects for a completed run.',
        alt: 'OpenAdapt Cloud run detail: step metrics and the timeline with verified effects for a completed synthetic OpenEMR run.',
    },
    {
        key: 'evidence',
        src: '/cloud-preview/healthcare-evidence.jpg',
        width: 2560,
        height: 1600,
        focus: '50% 0%',
        address: 'app.openadapt.ai/runs/evidence',
        label: 'Halt evidence',
        caption:
            'The locally reported stop, resolver metrics, and the governed repair page.',
        alt: 'OpenAdapt Cloud halt evidence: the locally reported stop, resolver metrics, and the governed repair page for a synthetic OpenEMR workflow.',
    },
    {
        key: 'program',
        src: '/cloud-preview/program-graph.png',
        width: 1800,
        height: 5096,
        // Tall full-page capture. Nudge past the empty grey app-chrome band at
        // the very top so the compiled-program header and stats fill the frame.
        focus: '50% 8%',
        address: 'app.openadapt.ai/workflows/program',
        label: 'Program visualizer',
        caption:
            'The compiled workflow rendered as an inspectable program graph.',
        alt: 'OpenAdapt Cloud program visualizer: a compiled workflow rendered as an inspectable program graph.',
    },
    {
        key: 'catalog',
        src: '/cloud-preview/workflow-catalog.png',
        width: 1280,
        height: 2200,
        // Tall full-page capture: top-anchored so the portfolio and ROI readout
        // lead the frame.
        focus: '50% 0%',
        address: 'app.openadapt.ai/workflows',
        label: 'Workflow catalog',
        caption:
            'Approved workflows and their compiled bundle versions in one catalog.',
        alt: 'OpenAdapt Cloud workflow catalog: approved workflows and their compiled bundle versions.',
    },
]

const ROTATE_MS = 4600

export default function DashboardShowcase() {
    const [active, setActive] = useState(0)
    const [paused, setPaused] = useState(false)
    // Bumping this restarts the auto-advance timer so a manual jump gives the
    // chosen slide its full dwell time instead of flipping a moment later.
    const [cycle, setCycle] = useState(0)
    const count = SLIDES.length

    // The showcase auto-advances for everyone, including visitors with
    // "reduce motion" enabled. This is a deliberate product decision (matching
    // the hero): the founder browses with reduced motion on and the section must
    // visibly rotate rather than look static or broken. The manual tabs are
    // always present so nothing depends on the timer, and the crossfade is a
    // gentle opacity fade rather than movement.
    useEffect(() => {
        if (paused) return undefined
        const id = setInterval(() => {
            setActive((index) => (index + 1) % count)
        }, ROTATE_MS)
        return () => clearInterval(id)
    }, [paused, cycle, count])

    const jumpTo = (index) => {
        setActive(index)
        setCycle((value) => value + 1)
    }

    const activeSlide = SLIDES[active]

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
                        This is the hosted product running today at
                        app.openadapt.ai. Workflows, runs, evidence, and
                        reports stay connected in one reviewable dashboard.
                    </p>
                </div>

                <figure
                    className={styles.figure}
                    data-testid="dashboard-product-preview"
                    onMouseEnter={() => setPaused(true)}
                    onMouseLeave={() => setPaused(false)}
                    onFocus={() => setPaused(true)}
                    onBlur={() => setPaused(false)}
                >
                    <div className={styles.browser}>
                        <div
                            className={styles.browserBar}
                            aria-hidden="true"
                        >
                            <span className={styles.dots}>
                                <i />
                                <i />
                                <i />
                            </span>
                            <span className={styles.address}>
                                {activeSlide.address}
                            </span>
                        </div>
                        <div
                            className={styles.stage}
                            id="cloud-stage"
                            data-testid="dashboard-stage"
                        >
                            {SLIDES.map((slide, index) => (
                                <img
                                    key={slide.key}
                                    className={styles.slide}
                                    src={slide.src}
                                    width={slide.width}
                                    height={slide.height}
                                    alt={slide.alt}
                                    loading="lazy"
                                    decoding="async"
                                    aria-hidden={index !== active}
                                    data-testid="dashboard-slide"
                                    data-slide={slide.key}
                                    data-active={
                                        index === active ? 'true' : undefined
                                    }
                                    style={{
                                        opacity: index === active ? 1 : 0,
                                        objectPosition: slide.focus,
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Clickable thumbnail strip: small real screenshots of every
                        frame, each a tab that jumps the large stage to that slide.
                        The active thumbnail is highlighted and carries a visible
                        countdown bar that fills over one dwell (ROTATE_MS) so the
                        visitor sees time-to-next-slide. The countdown restarts on
                        every slide change / manual jump / pause toggle (its React
                        key), staying in lockstep with the auto-advance timer, and
                        it deliberately keeps animating under reduced motion so the
                        rotation reads as live. */}
                    <div
                        className={styles.tabs}
                        role="tablist"
                        aria-label="OpenAdapt Cloud views"
                        data-testid="dashboard-tabs"
                    >
                        {SLIDES.map((slide, index) => (
                            <button
                                key={slide.key}
                                type="button"
                                role="tab"
                                id={`cloud-tab-${slide.key}`}
                                aria-selected={index === active}
                                aria-controls="cloud-stage"
                                className={styles.tab}
                                data-testid="dashboard-tab"
                                data-slide={slide.key}
                                data-active={
                                    index === active ? 'true' : undefined
                                }
                                onClick={() => jumpTo(index)}
                            >
                                <span className={styles.thumb}>
                                    <img
                                        className={styles.thumbImg}
                                        src={slide.src}
                                        width={slide.width}
                                        height={slide.height}
                                        alt=""
                                        loading="lazy"
                                        decoding="async"
                                        aria-hidden="true"
                                        style={{ objectPosition: slide.focus }}
                                    />
                                    {index === active && (
                                        <span
                                            key={`${active}-${cycle}-${paused}`}
                                            className={styles.timer}
                                            data-testid="dashboard-countdown"
                                            aria-hidden="true"
                                        >
                                            <span
                                                className={styles.timerFill}
                                                style={{
                                                    animationDuration: `${ROTATE_MS}ms`,
                                                    animationPlayState: paused
                                                        ? 'paused'
                                                        : 'running',
                                                }}
                                            />
                                        </span>
                                    )}
                                </span>
                                <span className={styles.thumbLabel}>
                                    {slide.label}
                                </span>
                            </button>
                        ))}
                    </div>

                    <div
                        className={styles.progress}
                        data-testid="dashboard-dots"
                    >
                        {SLIDES.map((slide, index) => (
                            <button
                                key={slide.key}
                                type="button"
                                className={styles.dot}
                                data-active={
                                    index === active ? 'true' : undefined
                                }
                                tabIndex={-1}
                                aria-hidden="true"
                                onClick={() => jumpTo(index)}
                            />
                        ))}
                    </div>

                    <p
                        className={styles.slideCaption}
                        aria-live="polite"
                        data-testid="dashboard-slide-caption"
                    >
                        <strong>{activeSlide.label}.</strong>{' '}
                        {activeSlide.caption}
                    </p>

                    <figcaption
                        className={styles.caption}
                        id="dashboard-preview-caption"
                    >
                        <strong>Real OpenAdapt Cloud interface</strong>
                    </figcaption>
                </figure>

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
