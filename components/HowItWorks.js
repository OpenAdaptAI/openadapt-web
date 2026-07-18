import { useState } from 'react'
import Link from 'next/link'

import Clip from './Clip'
import ReferenceStagePanel from './ReferenceStagePanel'
import manifest from '../public/how-it-works/MANIFEST.json'
import styles from './HowItWorks.module.css'

const referenceWorkflows = {
    healthcare: {
        key: 'healthcare',
        label: 'Healthcare',
        system: 'OpenEMR browser reference',
        href: '/solutions/healthcare',
        detail:
            'Recorded and replayed OpenEMR footage for a bounded healthcare browser workflow.',
        record: manifest.steps.record_openemr,
        replay: manifest.steps.run_openemr,
        stageMedia: {
            compile: {
                src: '/how-it-works/record_openemr.gif',
                alt: 'Live OpenEMR demonstration footage behind OpenAdapt’s animated compile view.',
                sourceLabel: 'OpenEMR demonstration',
            },
            resolve: {
                src: '/how-it-works/run_openemr.gif',
                alt: 'Live OpenEMR replay footage behind OpenAdapt’s animated target-resolution view.',
                sourceLabel: 'OpenEMR replay',
            },
            verify: {
                src: '/how-it-works/run_openemr.gif',
                alt: 'Live OpenEMR replay footage behind OpenAdapt’s animated audit-contract view.',
                sourceLabel: 'OpenEMR replay',
            },
        },
        compile: {
            workflow: 'openemr-browser-reference',
            parameters: 'workflow-defined inputs',
            target: 'bounded OpenEMR browser task',
            effect: 'deployment-specific oracle required',
        },
        resolve: {
            evidence: [
                'Recorded OpenEMR target evidence',
                'Configured identity and target constraints',
                'Unique actionable match required',
            ],
        },
        verify: {
            badge: 'qualification',
            status: 'qualification required',
            qualified: false,
            checks: [
                ['Recorded media', 'record and compiled-replay footage'],
                ['Effect oracle', 'not established by this media'],
                ['Identity policy', 'must be configured for the workflow'],
                ['Acceptance', 'halt until declared checks pass'],
            ],
            metrics: ['No application-specific audit result claimed'],
            caption:
                'Qualification contract for the OpenEMR reference. The footage does not establish an independent effect audit or production EMR reliability.',
        },
    },
    lending: {
        key: 'lending',
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
        stageMedia: {
            compile: {
                src: '/lending-demo/record-frappe.gif',
                alt: 'Frappe Lending demonstration footage behind OpenAdapt’s animated compile view.',
                sourceLabel: 'Frappe Lending demonstration',
            },
            resolve: {
                src: '/lending-demo/replay-frappe.gif',
                alt: 'Frappe Lending replay footage behind OpenAdapt’s animated target-resolution view.',
                sourceLabel: 'Frappe Lending replay',
            },
            verify: {
                src: '/lending-demo/replay-frappe.gif',
                alt: 'Frappe Lending replay footage behind OpenAdapt’s animated verified-effect audit view.',
                sourceLabel: 'Frappe Lending replay',
            },
        },
        compile: {
            workflow: 'create-loan-application',
            parameters: 'email · phone · product · amount · term',
            target: 'Frappe Lending Loan Application form',
            effect: 'exactly one matching Loan Application',
        },
        resolve: {
            evidence: [
                'Recorded Frappe Loan Application evidence',
                'Applicant and form-context constraints',
                'Unique actionable match required',
            ],
        },
        verify: {
            badge: 'bounded evidence',
            status: '6 / 6 verified',
            qualified: true,
            checks: [
                ['REST readback', 'exact fields matched'],
                ['SQL delta', '+1 Loan Application'],
                ['Collateral audit', 'non-target digest unchanged'],
                ['Execution', 'baseline and cosmetic-drift trials'],
            ],
            metrics: [
                '0 silent incorrect successes',
                '0 over-halts',
                '0 model calls',
            ],
            caption:
                'Published bounded local Frappe reference evidence: six compiled trials, not a customer deployment or production reliability claim.',
        },
    },
    insurance: {
        key: 'insurance',
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
        stageMedia: {
            compile: {
                src: '/insurance-demo/record-openimis.gif',
                alt: 'openIMIS claim-entry demonstration footage behind OpenAdapt’s animated compile view.',
                sourceLabel: 'openIMIS demonstration',
            },
            resolve: {
                src: '/insurance-demo/replay-openimis.gif',
                alt: 'openIMIS claim-entry replay footage behind OpenAdapt’s animated target-resolution view.',
                sourceLabel: 'openIMIS replay',
            },
            verify: {
                src: '/insurance-demo/replay-openimis.gif',
                alt: 'openIMIS claim-entry replay footage behind OpenAdapt’s animated verified-effect audit view.',
                sourceLabel: 'openIMIS replay',
            },
        },
        compile: {
            workflow: 'openimis-claim-intake',
            parameters: 'insuree no. · claim no. · explanation',
            target: 'openIMIS Health Facility Claim form',
            effect: 'exactly one claim row in status Entered',
        },
        resolve: {
            evidence: [
                'Recorded openIMIS claim-form evidence',
                'Policyholder, facility, and form context',
                'Unique actionable match required',
            ],
        },
        verify: {
            badge: 'bounded evidence',
            status: '3 / 3 verified',
            qualified: true,
            checks: [
                ['SQL claim readback', 'exactly one new claim row'],
                ['Claim status', 'Entered, ready for review'],
                ['Record context', 'insuree and facility matched'],
                ['Execution', 'three compiled replays verified'],
            ],
            metrics: [
                '0 duplicate claims',
                '0 wrong-policyholder writes',
                '0 model calls',
            ],
            caption:
                'Published bounded local openIMIS reference evidence: three compiled replays, not a customer deployment or production reliability claim.',
        },
    },
}

const executionEnvironments = {
    browser: {
        key: 'browser',
        label: 'Browser',
        system: 'DOM + Playwright',
        detail:
            'Structural browser execution with DOM targets, deterministic input, and configured effect checks.',
        mediaTruth:
            'Selected application footage with the browser execution path in context.',
        mediaCaption:
            'Browser execution · selected application footage',
        sourceKind: 'application-footage',
        pathLabel: 'structural execution',
        nodes: ['Flow', 'DOM target', 'Effect check'],
        motionClass: 'browser',
    },
    windows: {
        key: 'windows',
        label: 'Windows',
        system: 'UIA + native actions',
        detail:
            'Local Windows execution with UI Automation target evidence, native actions, and independent outcome checks.',
        mediaTruth:
            'Selected application footage with the native Windows execution path in context.',
        mediaCaption:
            'Windows execution view · UIA overlay over selected application footage',
        sourceKind: 'environment-visualization',
        pathLabel: 'native Windows path',
        nodes: ['Flow', 'UIA target', 'Outcome'],
        motionClass: 'windows',
    },
    macos: {
        key: 'macos',
        label: 'macOS',
        system: 'Accessibility + native',
        detail:
            'Local macOS execution with Accessibility element evidence, native input, and governed verification.',
        mediaTruth:
            'Selected application footage with the native macOS execution path in context.',
        mediaCaption:
            'macOS execution view · Accessibility overlay over selected application footage',
        sourceKind: 'environment-visualization',
        pathLabel: 'native macOS path',
        nodes: ['Flow', 'AX element', 'Outcome'],
        motionClass: 'macos',
    },
    linux: {
        key: 'linux',
        label: 'Linux',
        system: 'AT-SPI + portal',
        detail:
            'Native Linux execution uses AT-SPI structural evidence and an operator-approved desktop session for governed actions and verification.',
        mediaTruth:
            'Selected application footage with the native Linux execution path in context.',
        mediaCaption:
            'Linux execution view · AT-SPI and approved desktop session',
        sourceKind: 'environment-visualization',
        pathLabel: 'native Linux path',
        nodes: ['Flow', 'AT-SPI target', 'Outcome'],
        motionClass: 'runner',
    },
    rdp: {
        key: 'rdp',
        label: 'RDP',
        system: 'remote framebuffer',
        detail:
            'Remote execution binds the target session, maps framebuffer and input traffic, and checks the intended effect independently.',
        mediaTruth:
            'Selected application footage with the governed RDP transport path in context.',
        mediaCaption:
            'RDP execution view · governed remote transport path',
        sourceKind: 'transport-visualization',
        pathLabel: 'remote transport view',
        nodes: ['Flow', 'Frame + input', 'Remote app'],
        motionClass: 'remote',
    },
    citrix: {
        key: 'citrix',
        label: 'Citrix',
        system: 'ICA / HDX path',
        detail:
            'The customer-controlled execution path carries governed pixel/input observations across the Citrix boundary and verifies effects separately.',
        mediaTruth:
            'Selected application footage with the governed ICA/HDX transport path in context.',
        mediaCaption:
            'Citrix execution view · governed ICA/HDX path',
        sourceKind: 'transport-visualization',
        pathLabel: 'customer-controlled transport',
        nodes: ['Flow', 'ICA / HDX', 'Remote app'],
        motionClass: 'citrix',
    },
}

const steps = [
    {
        number: '1.0',
        name: 'Record',
        description:
            'Demonstrate one bounded instance. OpenAdapt captures the screen, input, and available structural evidence needed to compile it.',
        visualKey: 'record',
    },
    {
        number: '2.0',
        name: 'Compile',
        description:
            'Your recording becomes a script you can read, edit, and reuse.',
        visualKey: 'compile',
    },
    {
        number: '3.0',
        name: 'Replay',
        description:
            'Healthy runs execute the compiled steps locally without a model call.',
        visualKey: 'replay',
    },
    {
        number: '4.0',
        name: 'Resolve or halt',
        description:
            'Under drift, deterministic evidence re-finds the target, an optional model proposes a repair, or verification refuses to continue.',
        visualKey: 'resolve',
    },
    {
        number: '5.0',
        name: 'Verify and report',
        description:
            'Configured postconditions and effects are checked, and every run records what happened, changed, or halted.',
        visualKey: 'verify',
    },
]

export default function HowItWorks({ showUseCases = false }) {
    const [selectedUseCase, setSelectedUseCase] = useState('healthcare')
    const [selectedEnvironment, setSelectedEnvironment] =
        useState('browser')
    const selectedReference = referenceWorkflows[selectedUseCase]
    const environment = executionEnvironments[selectedEnvironment]

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
                        <p className={styles.selectorIntro}>
                            Choose a workflow and execution environment
                            independently.
                        </p>
                        <div className={styles.selectorBlock}>
                            <p className={styles.referenceLabel}>
                                Reference workflow
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
                                            aria-pressed={
                                                selectedUseCase === key
                                            }
                                            className={styles.tab}
                                            onClick={() =>
                                                setSelectedUseCase(key)
                                            }
                                        >
                                            <span>{reference.label}</span>
                                            <small>{reference.system}</small>
                                        </button>
                                    )
                                )}
                            </div>
                        </div>
                        <div className={styles.selectorBlock}>
                            <p className={styles.referenceLabel}>
                                Execution environment
                            </p>
                            <div
                                className={`${styles.tabs} ${styles.environmentTabs}`}
                                role="group"
                                aria-label="Execution environment"
                            >
                                {Object.entries(executionEnvironments).map(
                                    ([key, option]) => (
                                        <button
                                            key={key}
                                            type="button"
                                            aria-pressed={
                                                selectedEnvironment === key
                                            }
                                            className={`${styles.tab} ${styles.environmentTab}`}
                                            onClick={() =>
                                                setSelectedEnvironment(key)
                                            }
                                        >
                                            <span>{option.label}</span>
                                            <small>{option.system}</small>
                                        </button>
                                    )
                                )}
                            </div>
                        </div>
                        <div className={styles.selectionSummary}>
                            <div
                                className={styles.referenceSummary}
                                aria-live="polite"
                            >
                                <strong>
                                    {selectedReference.label} ×{' '}
                                    {environment.label}
                                </strong>
                                <span>
                                    {selectedReference.detail}{' '}
                                    <Link href={selectedReference.href}>
                                        View the bounded use case →
                                    </Link>
                                </span>
                            </div>
                            <div
                                className={styles.environmentSummary}
                                aria-live="polite"
                            >
                                <span>{environment.detail}</span>
                                <small>{environment.mediaTruth}</small>
                            </div>
                            <p className={styles.visualScopeNote}>
                                {
                                    'Every stage uses the selected reference application. '
                                }
                                Application footage and execution-environment
                                overlays are labeled separately.
                            </p>
                        </div>
                    </div>
                )}
                <ol className={styles.steps}>
                    {steps.map((step) => {
                        const isRecordedClip =
                            step.visualKey === 'record' ||
                            step.visualKey === 'replay'
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
                                <div className={styles.clip}>
                                    {isRecordedClip ? (
                                        <Clip
                                            key={`${selectedUseCase}-${selectedEnvironment}-${step.visualKey}`}
                                            clip={
                                                selectedReference[
                                                    step.visualKey
                                                ]
                                            }
                                            environment={environment}
                                            reference={selectedReference}
                                        />
                                    ) : (
                                        <ReferenceStagePanel
                                            key={`${selectedUseCase}-${selectedEnvironment}-${step.visualKey}`}
                                            reference={selectedReference}
                                            environment={environment}
                                            stage={step.visualKey}
                                        />
                                    )}
                                </div>
                            </li>
                        )
                    })}
                </ol>
            </div>
        </section>
    )
}
