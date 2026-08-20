import styles from './BusinessDecisionPreview.module.css'

const CLOUD_JUDGMENT_DEMO = 'https://app.openadapt.ai/demo/judgment'

// This is a direct capture of the public Cloud decision component. Its source
// route and SHA-256 are recorded in public/business-decision/provenance.json.
export default function BusinessDecisionPreview() {
    return (
        <section className={styles.section} aria-labelledby="business-decision-title">
            <figure className={styles.device}>
                <img
                    src="/business-decision/business-decision-request.png"
                    alt="OpenAdapt mobile interface asking an authorized operator to select an approved exception route"
                />
                <figcaption>
                    Exact public Cloud capture · synthetic exception-routing case
                </figcaption>
            </figure>
            <div className={styles.copy}>
                <p className={styles.eyebrow}>Human decision</p>
                <h2 id="business-decision-title">
                    Ask a person when the workflow reaches a real judgment call.
                </h2>
                <p>
                    OpenAdapt pauses at an approved policy choice and asks one
                    authorized person one clear question. Before it continues,
                    the runner checks the live application again.
                </p>
                <a
                    className={styles.demoLink}
                    href={CLOUD_JUDGMENT_DEMO}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    See the full human judgment demo
                    <span aria-hidden="true"> →</span>
                </a>
            </div>
        </section>
    )
}
