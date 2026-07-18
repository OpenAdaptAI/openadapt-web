import Clip from './Clip'
import processStyles from './HowItWorks.module.css'
import styles from './LendingWorkflowDemo.module.css'

const clips = {
    record: {
        gif: '/insurance-demo/record-openimis.gif',
        width: 880,
        height: 550,
        alt: 'Captured openIMIS frames showing a synthetic health-facility claim being entered and saved.',
        caption:
            'Demonstrate — captured openIMIS frames · synthetic local fixture',
    },
    replay: {
        gif: '/insurance-demo/replay-openimis.gif',
        width: 880,
        height: 550,
        alt: 'OpenAdapt deterministically replaying the compiled claims-intake workflow in openIMIS with a fresh claim number.',
        caption:
            'Replay — real compiled run · local, model-free, independently checked',
    },
}

function CompilePanel() {
    return (
        <figure className={styles.evidenceFigure}>
            <div className={styles.panelHeader}>
                <span>workflow.json</span>
                <span className={styles.status}>compiled</span>
            </div>
            <dl className={styles.contract}>
                <div>
                    <dt>workflow</dt>
                    <dd>openimis-claim-intake</dd>
                </div>
                <div>
                    <dt>parameters</dt>
                    <dd>insuree no. · claim no. · explanation</dd>
                </div>
                <div>
                    <dt>target</dt>
                    <dd>Health Facility Claim form</dd>
                </div>
                <div>
                    <dt>effect</dt>
                    <dd>exactly one claim row, status Entered</dd>
                </div>
                <div>
                    <dt>healthy run</dt>
                    <dd>deterministic · zero model calls</dd>
                </div>
            </dl>
            <figcaption className={styles.caption}>
                Compile — inspectable task contract derived from the recorded
                synthetic workflow
            </figcaption>
        </figure>
    )
}

function VerificationPanel() {
    const checks = [
        ['SQL claim read-back', 'exactly one new claim row'],
        ['Claim status', 'Entered, ready for review'],
        ['Policyholder identity', 'insuree and facility matched'],
        ['Execution', 'recorded save + replays all verified'],
    ]

    return (
        <figure className={styles.evidenceFigure}>
            <div className={styles.panelHeader}>
                <span>independent effect evidence</span>
                <span className={styles.status}>verified</span>
            </div>
            <ul className={styles.checks}>
                {checks.map(([label, value]) => (
                    <li key={label}>
                        <span className={styles.checkmark} aria-hidden="true">
                            ✓
                        </span>
                        <span>
                            <strong>{label}</strong>
                            <small>{value}</small>
                        </span>
                    </li>
                ))}
            </ul>
            <div className={styles.metrics}>
                <span>0 duplicate claims</span>
                <span>0 wrong-policyholder writes</span>
                <span>0 model calls</span>
            </div>
            <figcaption className={styles.caption}>
                Verify — every run is accepted only by a direct SQL read of the
                claim row in the pinned local reference environment
            </figcaption>
        </figure>
    )
}

const steps = [
    {
        number: '1.0',
        name: 'Demonstrate',
        description:
            'Enter one synthetic health-facility claim — policyholder, claim number, diagnosis, service — while OpenAdapt captures the browser evidence and input events.',
        visual: <Clip clip={clips.record} />,
    },
    {
        number: '2.0',
        name: 'Compile',
        description:
            'Turn the demonstration into a parameterized, inspectable workflow with a declared business effect.',
        visual: <CompilePanel />,
    },
    {
        number: '3.0',
        name: 'Replay',
        description:
            'Execute the compiled steps locally against openIMIS with a fresh claim number, without asking a model to reinterpret the task.',
        visual: <Clip clip={clips.replay} />,
    },
    {
        number: '4.0',
        name: 'Verify the write',
        description:
            'Check the saved claim through a direct SQL read: exactly one new claim row in status Entered, for the demonstrated policyholder and facility.',
        visual: <VerificationPanel />,
    },
]

export default function InsuranceWorkflowDemo() {
    return (
        <section
            data-testid="openimis-claims-workflow-demo"
            className={processStyles.section}
        >
            <div className={processStyles.inner}>
                <p className={processStyles.eyebrow}>Real reference workflow</p>
                <h2 className={processStyles.heading}>
                    From demonstration to verified openIMIS claim
                </h2>
                <p className={processStyles.subheading}>
                    Synthetic local data, real openIMIS claims-intake
                    interactions, and an oracle outside the replay path.
                </p>
                <ol className={processStyles.steps}>
                    {steps.map((step) => (
                        <li key={step.number} className={processStyles.step}>
                            <div className={processStyles.copy}>
                                <span className={processStyles.number}>
                                    {step.number}
                                </span>
                                <div className={processStyles.body}>
                                    <h3 className={processStyles.name}>
                                        {step.name}
                                    </h3>
                                    <p className={processStyles.description}>
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                            <div className={processStyles.clip}>{step.visual}</div>
                        </li>
                    ))}
                </ol>
                <div className={styles.disclosure}>
                    <p>
                        openIMIS 25.10 (the open-source insurance management
                        system used by national health-insurance schemes) was
                        pinned by image digest in a local fixture loaded with
                        the upstream synthetic demo dataset plus one synthetic
                        policyholder. The clips show one recorded claims-intake
                        demonstration and a real compiled replay on that
                        environment. The evidence manifest records the exact
                        software, task, oracle, media hashes, and scope. OpenAdapt
                        is unaffiliated with the openIMIS Initiative.
                    </p>
                    <a href="/insurance-demo/provenance.json">
                        Inspect evidence manifest
                    </a>
                </div>
            </div>
        </section>
    )
}
