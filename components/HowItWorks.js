import styles from './HowItWorks.module.css'

const steps = [
    {
        number: '1.0',
        name: 'Record',
        description:
            'Do the task once while OpenAdapt captures screens and inputs.',
    },
    {
        number: '2.0',
        name: 'Compile',
        description:
            'The demonstration becomes an editable script: visual anchors, per-step assertions, parameters.',
    },
    {
        number: '3.0',
        name: 'Run',
        description:
            'Compiled replay in milliseconds, locally, with no per-run model calls.',
    },
    {
        number: '4.0',
        name: 'Self-heal',
        description:
            'When the UI drifts, a fallback ladder finds the target and proposes the fix as a diff.',
    },
    {
        number: '5.0',
        name: 'Audit',
        description:
            'Every run produces an illustrated report: what ran, what it saw, what changed.',
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
                    {steps.map((step) => (
                        <li key={step.number} className={styles.step}>
                            <span className={styles.number}>{step.number}</span>
                            <div className={styles.body}>
                                <h3 className={styles.name}>{step.name}</h3>
                                <p className={styles.description}>
                                    {step.description}
                                </p>
                            </div>
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    )
}
