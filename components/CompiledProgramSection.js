import styles from './CompiledProgramSection.module.css'

// Two things you can see once a demonstration is compiled: the program graph
// (what the bundle actually became) and the catalog + halt map (how a
// portfolio of workflows is doing). Both screenshots are the real OpenAdapt
// Cloud app running its local mock mode over synthetic records, same capture
// discipline as the dashboard tour (see /cloud-preview/provenance.json).
const FIGURES = [
    {
        key: 'visualizer',
        eyebrow: 'Compiled-program visualizer',
        title: 'See what a demonstration compiled into.',
        body:
            'A recording under-specifies intent. The compiler turns it into a ' +
            'program you can read before it runs: each step, the resolution ' +
            'ladder, where an identity gate is armed, which writes carry an ' +
            'effect check, and every point the run can halt. Render it from the ' +
            'CLI as a self-contained page or Mermaid, or open the same graph in ' +
            'Cloud.',
        code: 'openadapt-flow visualize my-bundle --format html -o graph.html',
        image: '/cloud-preview/program-graph.png',
        alt:
            'OpenAdapt Cloud program-graph view of a compiled bundle: ' +
            'ordered steps, the per-step resolution ladder, armed identity ' +
            'gates, effect checks, and halt points.',
        caption: 'Program graph in Cloud · CLI writes the same view offline',
    },
    {
        key: 'catalog',
        eyebrow: 'Workflow catalog & halt map',
        title: 'Read the whole portfolio, halt by halt.',
        body:
            'The catalog is a read-only readout across every compiled ' +
            'workflow: what each one automates, how its trials went, and the ' +
            'return it stands to make. The step-level halt map shows where runs ' +
            'stop and why, so you fix the demonstration or policy at the exact ' +
            'step.',
        image: '/cloud-preview/workflow-catalog.png',
        alt:
            'OpenAdapt Cloud workflow catalog: a portfolio ROI readout with a ' +
            'step-level halt map showing where runs halt and why.',
        caption: 'Workflow catalog & halt map in Cloud',
    },
]

export default function CompiledProgramSection() {
    return (
        <section
            className={styles.section}
            id="compiled-program"
            aria-labelledby="compiled-program-heading"
        >
            <div className={styles.inner}>
                <div className={styles.intro}>
                    <p className="eyebrow">From trace to program</p>
                    <h2 className={styles.heading} id="compiled-program-heading">
                        A demonstration compiles into a program you can inspect.
                    </h2>
                    <p className={styles.summary}>
                        A single demonstration can become a governed loop that
                        runs once per record in a worklist: bounded,
                        identity-gated, and effect-verified per record, halting
                        on ambiguity instead of guessing. One recorded path
                        becomes governed execution over a queue.
                    </p>
                    <pre className={styles.queueCode}>
                        <code>
                            openadapt-flow for-each my-bundle --records
                            worklist.csv --out queue-bundle
                        </code>
                    </pre>
                </div>

                <div className={styles.figures}>
                    {FIGURES.map((figure) => (
                        <figure key={figure.key} className={styles.figure}>
                            <div className={styles.figureHead}>
                                <p className={styles.figureEyebrow}>
                                    {figure.eyebrow}
                                </p>
                                <h3 className={styles.figureTitle}>
                                    {figure.title}
                                </h3>
                                <p className={styles.figureBody}>
                                    {figure.body}
                                </p>
                                {figure.code && (
                                    <pre className={styles.figureCode}>
                                        <code>{figure.code}</code>
                                    </pre>
                                )}
                            </div>
                            <div className={styles.shot}>
                                <img
                                    src={figure.image}
                                    alt={figure.alt}
                                    loading="lazy"
                                    decoding="async"
                                />
                            </div>
                            <figcaption className={styles.caption}>
                                <span>{figure.caption}</span>
                                <small>
                                    Real OpenAdapt Cloud app · synthetic records
                                </small>
                            </figcaption>
                        </figure>
                    ))}
                </div>

                <div className={styles.actions}>
                    <a
                        className="btn-ink"
                        href="https://app.openadapt.ai/dashboard/catalog"
                    >
                        Open the catalog
                    </a>
                    <a
                        className="btn-ghost-ink"
                        href="https://github.com/OpenAdaptAI/openadapt-flow#from-trace-to-program"
                    >
                        How compiling works
                    </a>
                </div>
            </div>
        </section>
    )
}
