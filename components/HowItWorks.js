import Clip from './Clip'
import manifest from '../public/how-it-works/MANIFEST.json'
import styles from './HowItWorks.module.css'

const steps = [
    {
        number: '1.0',
        name: 'Record',
        description:
            'Do the task once. OpenAdapt watches your screen and your clicks.',
        // Default to the live OpenEMR footage — the strongest wow.
        clipKey: 'record_openemr',
    },
    {
        number: '2.0',
        name: 'Compile',
        description:
            'Your recording becomes a script you can read, edit, and reuse.',
        clipKey: 'compile',
    },
    {
        number: '3.0',
        name: 'Replay',
        description:
            'Healthy runs execute the compiled steps locally without a model call.',
        // Default to the live OpenEMR footage — the strongest wow.
        clipKey: 'run_openemr',
    },
    {
        number: '4.0',
        name: 'Resolve or halt',
        description:
            'Under drift, deterministic evidence re-finds the target, an optional model proposes a repair, or verification refuses to continue.',
        clipKey: 'heal',
    },
    {
        number: '5.0',
        name: 'Verify and report',
        description:
            'Configured postconditions and effects are checked, and every run records what happened, changed, or halted.',
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
                    A demonstrated task becomes a reviewable program, not a
                    prompt that a model reinterprets on every run.
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
