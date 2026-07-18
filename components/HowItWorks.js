import { useState } from 'react'
import Link from 'next/link'

import Clip from './Clip'
import manifest from '../public/how-it-works/MANIFEST.json'
import styles from './HowItWorks.module.css'

const referenceWorkflows = {
    healthcare: {
        label: 'Healthcare',
        system: 'OpenEMR browser reference',
        href: '/solutions/healthcare',
        detail:
            'Recorded and replayed OpenEMR footage for a bounded healthcare browser workflow.',
        record: manifest.steps.record_openemr,
        replay: manifest.steps.run_openemr,
    },
    lending: {
        label: 'Lending',
        system: 'Frappe Lending reference',
        href: '/solutions/lending',
        detail:
            'Synthetic loan-application workflow with 6/6 compiled reference trials independently checked.',
        record: {
            gif: '/lending-demo/record-frappe.gif',
            width: 880,
            height: 550,
            alt: 'Captured Frappe Lending frames showing a synthetic loan application demonstration being completed and saved.',
            caption:
                'Record — Frappe Lending reference · synthetic local fixture',
        },
        replay: {
            gif: '/lending-demo/replay-frappe.gif',
            width: 880,
            height: 550,
            alt: 'OpenAdapt deterministically replaying the compiled synthetic loan application workflow in Frappe Lending.',
            caption:
                'Replay — Frappe Lending reference · model-free and independently checked',
        },
    },
    insurance: {
        label: 'Insurance',
        system: 'openIMIS claims reference',
        href: '/solutions/insurance',
        detail:
            'Synthetic claims-intake workflow with 3/3 compiled replays independently checked against the claims database.',
        record: {
            gif: '/insurance-demo/record-openimis.gif',
            width: 880,
            height: 550,
            alt: 'Captured openIMIS frames showing a synthetic health-facility claim being entered and saved.',
            caption:
                'Record — openIMIS claims reference · synthetic local fixture',
        },
        replay: {
            gif: '/insurance-demo/replay-openimis.gif',
            width: 880,
            height: 550,
            alt: 'OpenAdapt deterministically replaying the compiled claims-intake workflow in openIMIS with a fresh claim number.',
            caption:
                'Replay — openIMIS claims reference · model-free and independently checked',
        },
    },
}

const steps = [
    {
        number: '1.0',
        name: 'Record',
        description:
            'Demonstrate one bounded instance. OpenAdapt captures the browser evidence and input events needed to compile it.',
        clipKey: 'record',
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
        clipKey: 'replay',
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

export default function HowItWorks({ showUseCases = false }) {
    const [selectedUseCase, setSelectedUseCase] = useState('healthcare')
    const selectedReference = referenceWorkflows[selectedUseCase]

    return (
        <section id="how-it-works" className={styles.section}>
            <div className={styles.inner}>
                <p className={styles.eyebrow}>Process</p>
                <h2 className={styles.heading}>How it works</h2>
                <p className={styles.subheading}>
                    A demonstrated task becomes a reviewable program, not a
                    prompt that a model reinterprets on every run.
                </p>
                {showUseCases && (
                    <div className={styles.references}>
                        <p className={styles.referenceLabel}>
                            Choose a reference workflow
                        </p>
                        <div
                            className={styles.tabs}
                            role="group"
                            aria-label="Reference workflow use case"
                        >
                            {Object.entries(referenceWorkflows).map(
                                ([key, reference]) => (
                                    <button
                                        key={key}
                                        type="button"
                                        aria-pressed={selectedUseCase === key}
                                        className={styles.tab}
                                        onClick={() => setSelectedUseCase(key)}
                                    >
                                        <span>{reference.label}</span>
                                        <small>{reference.system}</small>
                                    </button>
                                )
                            )}
                        </div>
                        <div
                            className={styles.referenceSummary}
                            aria-live="polite"
                        >
                            <span>{selectedReference.detail}</span>{' '}
                            <Link href={selectedReference.href}>
                                View the bounded use case →
                            </Link>
                        </div>
                        <p className={styles.sharedVisualNote}>
                            Record and replay footage changes with the selected
                            use case. Compile, drift handling, and audit show the
                            shared engine lifecycle.
                        </p>
                    </div>
                )}
                <ol className={styles.steps}>
                    {steps.map((step) => {
                        const clip =
                            step.clipKey === 'record' || step.clipKey === 'replay'
                                ? selectedReference[step.clipKey]
                                : manifest.steps[step.clipKey]
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
                                        <Clip
                                            key={`${selectedUseCase}-${step.clipKey}`}
                                            clip={clip}
                                        />
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
