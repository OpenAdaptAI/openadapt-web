import { useState } from 'react'

import styles from './AttendedDecisionPreview.module.css'

const CLOUD_ATTENTION_DEMO = 'https://app.openadapt.ai/demo/attention'

const states = {
    request: {
        image: '/attended-decision/identity-request.png',
        alt: 'OpenAdapt mobile portal requesting an identity check before Save',
    },
    result: {
        image: '/attended-decision/identity-verified.png',
        alt: 'OpenAdapt mobile portal showing the runner-verified identity result',
    },
}

// The two images are exact headless captures of the public Cloud identity
// case. Their source, hashes, and capture sequence are in public/attended-decision.
export default function AttendedDecisionPreview() {
    const [state, setState] = useState('request')
    const current = states[state]

    return (
        <section className={styles.section} aria-labelledby="attended-decision-title">
            <figure className={styles.device}>
                <div
                    className={styles.toggle}
                    role="group"
                    aria-label="Mobile decision state"
                    data-testid="attended-decision-toggle"
                >
                    <button
                        type="button"
                        aria-pressed={state === 'request'}
                        onClick={() => setState('request')}
                    >
                        Request
                    </button>
                    <button
                        type="button"
                        aria-pressed={state === 'result'}
                        onClick={() => setState('result')}
                    >
                        Runner result
                    </button>
                </div>
                <img
                    key={state}
                    src={current.image}
                    alt={current.alt}
                    data-testid="attended-decision-capture"
                />
                <figcaption>
                    Exact public Cloud capture · synthetic OpenEMR data
                </figcaption>
            </figure>
            <div className={styles.copy}>
                <p className={styles.eyebrow}>Attended decisions · Cloud demo</p>
                <h2 id="attended-decision-title">
                    Keep a person in the loop. Keep the runner in control.
                </h2>
                <p>
                    When identity conflicts, OpenAdapt pauses before Save. The
                    phone shows only permitted answers. The customer runner
                    reads the live record again and returns the result.
                </p>
                <a
                    className={styles.demoLink}
                    href={CLOUD_ATTENTION_DEMO}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid="attended-decision-demo-link"
                >
                    Try all six mobile decision cases in Cloud
                    <span aria-hidden="true"> →</span>
                </a>
            </div>
        </section>
    )
}
