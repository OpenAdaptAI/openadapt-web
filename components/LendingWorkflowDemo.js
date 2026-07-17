import { useEffect, useState } from 'react'

import processStyles from './HowItWorks.module.css'
import styles from './LendingWorkflowDemo.module.css'

const clips = {
    record: {
        src: '/lending-demo/record-frappe.gif',
        poster: '/lending-demo/record-frappe.jpg',
        width: 880,
        height: 550,
        alt: 'Captured Frappe Lending frames showing a synthetic loan application demonstration being completed and saved.',
        caption:
            'Demonstrate — captured Frappe Lending frames · synthetic local fixture',
    },
    replay: {
        src: '/lending-demo/replay-frappe.gif',
        poster: '/lending-demo/replay-frappe.jpg',
        width: 880,
        height: 550,
        alt: 'OpenAdapt deterministically replaying the compiled synthetic loan application workflow in Frappe Lending.',
        caption:
            'Replay — real compiled run · local, model-free, independently checked',
    },
}

function LendingClip({ clip }) {
    const [playing, setPlaying] = useState(false)

    useEffect(() => {
        setPlaying(!window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    }, [])

    return (
        <figure className={styles.figure}>
            <div
                className={styles.media}
                style={{ aspectRatio: `${clip.width} / ${clip.height}` }}
            >
                <img
                    className={styles.image}
                    src={playing ? clip.src : clip.poster}
                    alt={clip.alt}
                    width={clip.width}
                    height={clip.height}
                    loading="lazy"
                    decoding="async"
                />
            </div>
            <div className={styles.clipFooter}>
                <figcaption className={styles.caption}>{clip.caption}</figcaption>
                <button
                    type="button"
                    className={styles.motionControl}
                    aria-pressed={playing}
                    onClick={() => setPlaying((current) => !current)}
                >
                    {playing ? 'Pause animation' : 'Play animation'}
                </button>
            </div>
        </figure>
    )
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
                    <dd>create-loan-application</dd>
                </div>
                <div>
                    <dt>parameters</dt>
                    <dd>email · phone · product · amount · term</dd>
                </div>
                <div>
                    <dt>target</dt>
                    <dd>Loan Application form</dd>
                </div>
                <div>
                    <dt>effect</dt>
                    <dd>exactly one matching record</dd>
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
        ['REST readback', 'exact fields matched'],
        ['SQL delta', '+1 Loan Application'],
        ['Collateral audit', 'non-target digest unchanged'],
        ['Execution', '6/6 compiled trials correct'],
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
                <span>0 silent incorrect successes</span>
                <span>0 over-halts</span>
                <span>0 model calls</span>
            </div>
            <figcaption className={styles.caption}>
                Verify — three baseline and three cosmetic-drift compiled trials;
                bounded local engineering evidence, not a customer deployment
            </figcaption>
        </figure>
    )
}

const steps = [
    {
        number: '1.0',
        name: 'Demonstrate',
        description:
            'Complete one synthetic Loan Application while OpenAdapt captures the browser evidence and input events.',
        visual: <LendingClip clip={clips.record} />,
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
            'Execute the compiled steps locally against Frappe Lending without asking a model to reinterpret the task.',
        visual: <LendingClip clip={clips.replay} />,
    },
    {
        number: '4.0',
        name: 'Verify the write',
        description:
            'Check the saved record through a separately authenticated read-only REST session and a direct SQL delta audit.',
        visual: <VerificationPanel />,
    },
]

export default function LendingWorkflowDemo() {
    return (
        <section
            data-testid="frappe-lending-workflow-demo"
            className={processStyles.section}
        >
            <div className={processStyles.inner}>
                <p className={processStyles.eyebrow}>Real reference workflow</p>
                <h2 className={processStyles.heading}>
                    From demonstration to verified Frappe write
                </h2>
                <p className={processStyles.subheading}>
                    Synthetic local data, real Frappe Lending interactions, and
                    an oracle outside the replay path.
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
                        Frappe Lending v16.2.0, Frappe v16.27.0, and ERPNext
                        v16.27.0 were pinned in a local fixture with fictional
                        values. The six compiled trials cover one task on one
                        environment under baseline and cosmetic-drift conditions;
                        they do not establish production lending reliability or
                        support for a proprietary LOS, Windows, RDP, or Citrix.
                        OpenAdapt is unaffiliated with Frappe Technologies Pvt.
                        Ltd.; Frappe is its registered trademark.
                    </p>
                    <a href="/lending-demo/provenance.json">
                        Inspect evidence manifest
                    </a>
                </div>
            </div>
        </section>
    )
}
