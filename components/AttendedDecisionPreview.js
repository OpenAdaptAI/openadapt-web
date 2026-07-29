import styles from './AttendedDecisionPreview.module.css'

const CLOUD_ATTENTION_DEMO = 'https://app.openadapt.ai/demo/attention'
const RETAINED_SCREEN =
    'https://app.openadapt.ai/demo/application-demos/openemr-standard-v1/replay/openemr-replay.poster.png'

/**
 * One real public Cloud case, kept deliberately smaller than the six-case
 * interaction. The Cloud page remains the place to try every decision type.
 */
export default function AttendedDecisionPreview() {
    return (
        <section className={styles.section} aria-labelledby="attended-decision-title">
            <div className={styles.copy}>
                <p className={styles.eyebrow}>Attended decisions · OpenEMR synthetic demo</p>
                <h2 id="attended-decision-title">
                    A person can resolve a pause without giving up runner checks.
                </h2>
                <p>
                    In this public Cloud case, OpenAdapt stops before Save when
                    the patient identity does not match. The operator can only
                    choose a permitted answer. The customer runner then reads
                    the live patient and target again.
                </p>
                <dl className={styles.decision}>
                    <div>
                        <dt>Pause reason</dt>
                        <dd>The record identity did not match. OpenAdapt stopped before Save.</dd>
                    </div>
                    <div>
                        <dt>Permitted operator action</dt>
                        <dd>Check identity — continue only if it matches.</dd>
                    </div>
                    <div>
                        <dt>Runner result</dt>
                        <dd><strong>VERIFIED</strong> — identity and target matched.</dd>
                    </div>
                </dl>
                <a
                    className={styles.demoLink}
                    href={CLOUD_ATTENTION_DEMO}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Try all six mobile decision cases in Cloud
                    <span aria-hidden="true"> →</span>
                </a>
            </div>
            <figure className={styles.evidence}>
                <img
                    src={RETAINED_SCREEN}
                    alt="Retained OpenEMR patient screen from the public identity-pause demo"
                />
                <figcaption>
                    Retained application screen when the run stopped. Real public
                    Cloud demo asset; synthetic patient data.
                </figcaption>
            </figure>
        </section>
    )
}
