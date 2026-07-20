import styles from './DashboardShowcase.module.css'

// Real screenshots of the shipping OpenAdapt Cloud product (openadapt-cloud),
// captured from the actual dashboard UI. The primary shot is the workflows
// dashboard; the supporting tiles show run detail, halt evidence, the program
// visualizer, and the workflow catalog. Every frame is the real interface
// running in its local mock-data mode with synthetic records (see
// /product-preview/MANIFEST.json and /cloud-preview/provenance.json). Nothing
// here is a hand-drawn or synthetic mockup of an app that does not exist.
const SUPPORTING_SHOTS = [
    {
        src: '/cloud-preview/healthcare-run.jpg',
        width: 880,
        height: 550,
        label: 'Run detail',
        caption: 'Step timeline and independently verified effects for a completed run.',
        alt: 'OpenAdapt Cloud run detail: step metrics and the timeline with verified effects for a completed synthetic OpenEMR run.',
    },
    {
        src: '/cloud-preview/healthcare-evidence.jpg',
        width: 880,
        height: 550,
        label: 'Halt evidence',
        caption: 'The locally reported stop, resolver metrics, and the governed repair page.',
        alt: 'OpenAdapt Cloud halt evidence: the locally reported stop, resolver metrics, and the governed repair page for a synthetic OpenEMR workflow.',
    },
    {
        src: '/cloud-preview/program-graph.png',
        width: 1800,
        height: 5096,
        // Tall full-page capture: focus the thumbnail on the compiled-program
        // stats and step ladder rather than the pale header banner.
        focus: '50% 14%',
        label: 'Program visualizer',
        caption: 'The compiled workflow rendered as an inspectable program graph.',
        alt: 'OpenAdapt Cloud program visualizer: a compiled workflow rendered as an inspectable program graph.',
    },
    {
        src: '/cloud-preview/workflow-catalog.png',
        width: 1280,
        height: 2200,
        // Tall full-page capture: focus the thumbnail on the portfolio and ROI
        // readout rather than the pale header banner.
        focus: '50% 16%',
        label: 'Workflow catalog',
        caption: 'Approved workflows and their compiled bundle versions in one catalog.',
        alt: 'OpenAdapt Cloud workflow catalog: approved workflows and their compiled bundle versions.',
    },
]

export default function DashboardShowcase() {
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
                                app.openadapt.ai/dashboard
                            </span>
                        </div>
                        <img
                            className={styles.primaryShot}
                            src="/product-preview/dashboard-workflows.png"
                            width="2880"
                            height="1800"
                            alt="The OpenAdapt Cloud workflows dashboard at app.openadapt.ai: approved workflows, compiled bundle versions, and run history in the real hosted product."
                            loading="lazy"
                            decoding="async"
                            data-testid="dashboard-primary-shot"
                        />
                    </div>

                    <ul
                        className={styles.gallery}
                        data-testid="dashboard-gallery"
                    >
                        {SUPPORTING_SHOTS.map((shot) => (
                            <li key={shot.src} className={styles.tile}>
                                <div className={styles.tileFrame}>
                                    <img
                                        src={shot.src}
                                        width={shot.width}
                                        height={shot.height}
                                        alt={shot.alt}
                                        loading="lazy"
                                        decoding="async"
                                        style={
                                            shot.focus
                                                ? { objectPosition: shot.focus }
                                                : undefined
                                        }
                                        data-testid="dashboard-gallery-shot"
                                    />
                                </div>
                                <div className={styles.tileMeta}>
                                    <strong>{shot.label}</strong>
                                    <span>{shot.caption}</span>
                                </div>
                            </li>
                        ))}
                    </ul>

                    <figcaption
                        className={styles.caption}
                        id="dashboard-preview-caption"
                    >
                        <strong>Real OpenAdapt Cloud interface</strong>
                        <span>
                            Shown in mock-data mode with synthetic records, not
                            a customer or production run
                        </span>
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
