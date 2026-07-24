import { useEffect, useRef, useState } from 'react'
import styles from './DashboardShowcase.module.css'

// Real screenshots of the shipping OpenAdapt Cloud product (openadapt-cloud),
// captured from the actual dashboard UI. This is a rotating showcase: the large
// slot cycles through the real product frames (dashboard, run detail, halt
// evidence, program visualizer, workflow catalog) so each gets time on screen
// big enough to read. Every frame is a full-height capture of the real
// interface (see /product-preview/MANIFEST.json and /cloud-preview/provenance.json).
// Nothing here is a hand-drawn or synthetic mockup of an app that does not exist.
//
// The captures are full pages, not top crops, and the large stage reveals each
// one with a slow top-to-bottom vertical auto-pan over its dwell so the visitor
// sees the WHOLE page rather than just the first screenful. Under reduced motion
// the pan is dropped and the whole frame is shown at once (see the module CSS),
// so nothing depends on movement to be legible.
//
// Order matters: the dashboard is first so it is the default (and SSR / no-JS)
// frame, which is why the browser address bar reads app.openadapt.ai/dashboard
// before any rotation. Every capture is 2560px wide at the same device scale, so
// the five frames share one product look; their heights differ because each real
// page is a different length.
const SLIDES = [
    {
        key: 'dashboard',
        src: '/product-preview/dashboard-workflows.png',
        width: 2560,
        height: 1600,
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
        height: 4620,
        address: 'app.openadapt.ai/runs',
        label: 'Run detail',
        caption:
            'Step timeline and independently verified effects for a completed run.',
        alt: 'OpenAdapt Cloud run detail: run metrics, the verified-effect timeline, and the full machine-readable run report.',
    },
    {
        key: 'evidence',
        src: '/cloud-preview/healthcare-evidence.jpg',
        width: 2560,
        height: 6594,
        address: 'app.openadapt.ai/runs/evidence',
        label: 'Halt evidence',
        caption:
            'The locally reported stop, resolver metrics, and the governed repair page.',
        alt: 'OpenAdapt Cloud halt evidence: the locally reported stop, resolver metrics, and the governed repair page.',
    },
    {
        key: 'program',
        src: '/cloud-preview/program-graph.png',
        width: 2560,
        height: 3882,
        address: 'app.openadapt.ai/workflows/program',
        label: 'Program visualizer',
        caption:
            'The compiled workflow rendered as an inspectable program graph.',
        alt: 'OpenAdapt Cloud program visualizer: a compiled workflow rendered as an inspectable program graph.',
    },
    {
        key: 'catalog',
        src: '/cloud-preview/workflow-catalog.png',
        width: 2560,
        height: 4290,
        address: 'app.openadapt.ai/workflows',
        label: 'Workflow catalog',
        caption:
            'Approved workflows, their ROI readout, and a step-level halt map in one catalog.',
        alt: 'OpenAdapt Cloud workflow catalog: approved workflows, their ROI readout, and a step-level halt map.',
    },
]

// One dwell per frame. The vertical auto-pan runs slightly shorter so it settles
// at the bottom of the page before the rotation advances to the next frame.
const ROTATE_MS = 6200
const PAN_MS = 5600

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

    // Vertical auto-pan of the active full-height capture. The stage is a fixed
    // aspect-ratio viewport; the capture is taller, so we translate it upward
    // from its top edge to its bottom edge across the dwell (a slow downward
    // reveal). We use the Web Animations API because the pan distance depends on
    // the rendered image height, which is responsive and known only at runtime.
    const slideRefs = useRef([])
    const stageRef = useRef(null)
    const panRef = useRef(null)
    const pausedRef = useRef(paused)
    pausedRef.current = paused

    useEffect(() => {
        const img = slideRefs.current[active]
        const stage = stageRef.current
        if (!img || !stage) return undefined
        // Respect reduced motion: no auto-pan. The module CSS instead fits the
        // whole capture into the stage so the entire page stays visible.
        if (
            typeof window !== 'undefined' &&
            window.matchMedia &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ) {
            return undefined
        }
        let cancelled = false
        const start = () => {
            if (cancelled) return
            const shift =
                img.getBoundingClientRect().height -
                stage.getBoundingClientRect().height
            // Short captures (already fully visible) do not need a pan.
            if (shift <= 4) return
            const anim = img.animate(
                [
                    { transform: 'translateY(0)' },
                    { transform: `translateY(${-shift}px)` },
                ],
                { duration: PAN_MS, easing: 'linear', fill: 'forwards' }
            )
            panRef.current = anim
            if (pausedRef.current) anim.pause()
        }
        if (img.complete && img.naturalWidth) start()
        else img.addEventListener('load', start, { once: true })
        return () => {
            cancelled = true
            img.removeEventListener('load', start)
            if (panRef.current) {
                panRef.current.cancel()
                panRef.current = null
            }
            img.style.transform = ''
        }
    }, [active, cycle])

    // Pause and resume the pan in lockstep with the rotation timer (hover/focus)
    // without restarting it, so a visitor reading a frame keeps their position.
    useEffect(() => {
        const anim = panRef.current
        if (!anim) return undefined
        if (paused) anim.pause()
        else anim.play()
        return undefined
    }, [paused])

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
                        {/* Fixed aspect-ratio viewport. Each full-height capture
                            is taller than the viewport; the active one pans
                            top-to-bottom over its dwell. Under reduced motion the
                            viewport becomes scrollable and the capture is fit so
                            the whole page is reachable without any movement. */}
                        <div
                            className={styles.stage}
                            id="cloud-stage"
                            data-testid="dashboard-stage"
                            ref={stageRef}
                        >
                            {SLIDES.map((slide, index) => (
                                <img
                                    key={slide.key}
                                    ref={(node) => {
                                        slideRefs.current[index] = node
                                    }}
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
                    <a className="btn-ghost-ink" href="/pricing">
                        See launch plans
                    </a>
                </div>
            </div>
        </section>
    )
}
