import { useState } from 'react'

import styles from './AttendedDecisionPreview.module.css'

const CLOUD_ATTENTION_DEMO = 'https://app.openadapt.ai/demo/attention'

const states = {
    request: {
        image: '/attended-decision/identity-request.png',
        alt: 'OpenAdapt mobile portal requesting an identity check before Save',
    },
    pending: {
        image: '/attended-decision/decision-pending.png',
        alt: 'OpenAdapt mobile portal confirming that the answer was accepted while the customer runner checks the live application',
    },
    result: {
        image: '/attended-decision/identity-verified.png',
        alt: 'OpenAdapt mobile portal showing the runner-verified identity result',
    },
}

// The three images are exact production-build captures of the Cloud identity
// case. Their source, hashes, and capture sequence are in public/attended-decision.
export default function AttendedDecisionPreview({
    body =
        'When identity conflicts, OpenAdapt pauses before Save. The phone shows only permitted answers. The customer runner reads the live record again and returns the result.',
    eyebrow = 'Attended decisions · Cloud demo',
    linkLabel = 'Try all six mobile decision cases in Cloud',
    title = 'Keep a person in the loop. Keep the runner in control.',
    variant = 'default',
}) {
    const [state, setState] = useState('request')
    const current = states[state]

    return (
        <section
            className={styles.section}
            aria-label={title}
            data-variant={variant}
        >
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
                        aria-pressed={state === 'pending'}
                        onClick={() => setState('pending')}
                    >
                        Answer accepted
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
                    OpenEMR example · “patient record” is this workflow’s
                    qualified entity class · synthetic data
                </figcaption>
            </figure>
            <div className={styles.copy}>
                <p className={styles.eyebrow}>{eyebrow}</p>
                <h2>{title}</h2>
                <p>{body}</p>
                <a
                    className={styles.demoLink}
                    href={CLOUD_ATTENTION_DEMO}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid="attended-decision-demo-link"
                >
                    {linkLabel}
                    <span aria-hidden="true"> →</span>
                </a>
            </div>
        </section>
    )
}
