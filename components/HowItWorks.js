import Clip from './Clip'
import manifest from '../public/how-it-works/MANIFEST.json'
import styles from './HowItWorks.module.css'

const steps = [
    {
        number: '1.0',
        name: 'Record',
        description:
            'Do the task once while OpenAdapt captures screens and inputs.',
        // Default to the live OpenEMR footage — the strongest wow.
        clipKey: 'record_openemr',
    },
    {
        number: '2.0',
        name: 'Compile',
        description:
            'The demonstration becomes an editable script: visual anchors, per-step assertions, parameters.',
        clipKey: 'compile',
    },
    {
        number: '3.0',
        name: 'Run',
        description:
            'Compiled replay in milliseconds, locally, with no per-run model calls.',
        // Default to the live OpenEMR footage — the strongest wow.
        clipKey: 'run_openemr',
    },
    {
        number: '4.0',
        name: 'Self-heal',
        description:
            'When the UI drifts, a fallback ladder finds the target and proposes the fix as a diff.',
        clipKey: 'heal',
    },
    {
        number: '5.0',
        name: 'Audit',
        description:
            'Every run produces an illustrated report: what ran, what it saw, what changed.',
        clipKey: 'audit',
    },
]

export default function HowItWorks() {
    return (
        <section id="how-it-works" className={styles.section}>
            <div className={styles.inner}>
                <p className={styles.eyebrow}>Process</p>
                <h2 className={styles.heading}>How it works</h2>
                <p className={styles.subheading}>
                    A demonstration compiler: one recording in, a runnable
                    automation out.
                </p>
                <ol className={styles.steps}>
                    {steps.map((step) => {
                        const clip = manifest.steps[step.clipKey]
                        return (
                            <li key={step.number} className={styles.step}>
                                <div className={styles.copy}>
                                    <span className={styles.number}>
                                        {step.number}
                                    </span>
                                    <div className={styles.body}>
                                        <h3 className={styles.name}>
                                            {step.name}
                                        </h3>
                                        <p className={styles.description}>
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                                {clip && (
                                    <div className={styles.clip}>
                                        <Clip clip={clip} />
                                    </div>
                                )}
                            </li>
                        )
                    })}
                </ol>
            </div>
        </section>
    )
}
