import { useEffect, useState } from 'react'

import styles from './DashboardShowcase.module.css'

const TOUR_INTERVAL_MS = 4200

const VIEW_ORDER = ['workflow', 'run', 'evidence', 'report']
const VIEW_LABELS = {
    workflow: 'Workflow',
    run: 'Run',
    evidence: 'Evidence',
    report: 'Report',
}

const REFERENCES = [
    {
        key: 'healthcare',
        label: 'Healthcare',
        application: 'OpenEMR',
        workflow: 'Patient note entry',
        media: {
            workflow: {
                animated: '/cloud-preview/healthcare-workflow.gif',
                still: '/cloud-preview/healthcare-workflow.jpg',
                alt: 'The OpenAdapt Cloud workflows list opening the synthetic OpenEMR workflow: approved bundle versions and run history in the real dashboard.',
            },
            run: {
                animated: '/cloud-preview/healthcare-run.gif',
                still: '/cloud-preview/healthcare-run.jpg',
                alt: 'OpenAdapt Cloud run detail for a completed synthetic OpenEMR run: step metrics and the live timeline with verified effects.',
            },
            evidence: {
                animated: '/cloud-preview/healthcare-evidence.gif',
                still: '/cloud-preview/healthcare-evidence.jpg',
                alt: 'OpenAdapt Cloud halt evidence for the synthetic OpenEMR workflow: the locally reported stop, resolver metrics, and the governed repair page.',
            },
            report: {
                animated: '/cloud-preview/healthcare-report.gif',
                still: '/cloud-preview/healthcare-report.jpg',
                alt: 'OpenAdapt Cloud run report for the synthetic OpenEMR run: structured step receipts bound to the compiled bundle.',
            },
        },
        views: {
            workflow: {
                eyebrow: 'Reference workflow',
                title: 'Patient note entry',
                status: 'Compiled',
                tone: 'good',
                summary:
                    'A demonstrated OpenEMR task compiled into an inspectable, governed workflow.',
                details: [
                    ['Workflow', 'openemr-browser-reference'],
                    ['Inputs', 'Workflow-defined parameters'],
                    ['Target', 'Bounded OpenEMR browser task'],
                    ['Effect contract', 'One matching note persisted'],
                ],
            },
            run: {
                eyebrow: 'Compiled replay',
                title: 'OpenEMR reference run',
                status: 'Verified',
                tone: 'good',
                summary:
                    'The compiled task replays without per-run model calls and stops if its declared checks cannot be established.',
                details: [
                    ['Execution', 'Compiled local replay'],
                    ['Targeting', 'Recorded OpenEMR evidence'],
                    ['Identity policy', 'Patient context matched'],
                    ['Model calls', '0 per healthy run'],
                ],
            },
            evidence: {
                eyebrow: 'Run evidence',
                title: 'Effect verification',
                status: 'Effect verified',
                tone: 'good',
                summary:
                    'Screen evidence and an independent application readback establish the intended note effect separately.',
                details: [
                    ['Recorded media', 'Demonstration and replay footage'],
                    ['Effect oracle', 'Exact patient note readback'],
                    ['Acceptance', 'Identity and effect checks passed'],
                    ['Collateral audit', 'Non-target record unchanged'],
                ],
            },
            report: {
                eyebrow: 'Run report',
                title: 'OpenEMR reference',
                status: 'Approved',
                tone: 'good',
                summary:
                    'The report binds the compiled revision, operator decision, action receipts, and independently verified outcome.',
                details: [
                    ['Workflow revision', 'Exact hash retained'],
                    ['Identity decision', 'Verified'],
                    ['Effect decision', 'Verified'],
                    ['Outcome', 'Completed'],
                ],
            },
        },
    },
    {
        key: 'lending',
        label: 'Lending',
        application: 'Frappe Lending',
        workflow: 'Loan application entry',
        media: {
            workflow: {
                animated: '/cloud-preview/lending-workflow.gif',
                still: '/cloud-preview/lending-workflow.jpg',
                alt: 'The OpenAdapt Cloud workflows list opening the synthetic Frappe Lending workflow: approved bundle versions and run history in the real dashboard.',
            },
            run: {
                animated: '/cloud-preview/lending-run.gif',
                still: '/cloud-preview/lending-run.jpg',
                alt: 'OpenAdapt Cloud run detail for a completed synthetic Frappe Lending run: step metrics and the live timeline with verified effects.',
            },
            evidence: {
                animated: '/cloud-preview/lending-evidence.gif',
                still: '/cloud-preview/lending-evidence.jpg',
                alt: 'OpenAdapt Cloud halt evidence for the synthetic Frappe Lending workflow: the locally reported stop, resolver metrics, and the governed repair page.',
            },
            report: {
                animated: '/cloud-preview/lending-report.gif',
                still: '/cloud-preview/lending-report.jpg',
                alt: 'OpenAdapt Cloud run report for the synthetic Frappe Lending run: structured step receipts bound to the compiled bundle.',
            },
        },
        views: {
            workflow: {
                eyebrow: 'Reference workflow',
                title: 'Loan application entry',
                status: 'Approved reference',
                tone: 'good',
                summary:
                    'A synthetic application-entry demonstration compiled into a bounded workflow.',
                details: [
                    ['Workflow', 'create-loan-application'],
                    ['Inputs', 'Email · phone · product · amount · term'],
                    ['Target', 'Frappe Loan Application form'],
                    ['Effect contract', 'Exactly one matching application'],
                ],
            },
            run: {
                eyebrow: 'Compiled runs',
                title: 'Frappe Lending trials',
                status: '6 / 6 verified',
                tone: 'good',
                summary:
                    'Baseline and cosmetic-drift trials completed with no per-run model calls.',
                details: [
                    ['Conditions', 'Baseline + cosmetic drift'],
                    ['Compiled trials', '6'],
                    ['Verified correct', '6'],
                    ['Model calls', '0'],
                ],
            },
            evidence: {
                eyebrow: 'Run evidence',
                title: 'Independent readback',
                status: 'Effect verified',
                tone: 'good',
                summary:
                    'Acceptance requires the independent REST, SQL, and non-target audits to agree.',
                details: [
                    ['REST readback', 'Exact fields matched'],
                    ['SQL delta', '+1 Loan Application'],
                    ['Collateral audit', 'Non-target digest unchanged'],
                    ['Silent incorrect success', '0'],
                ],
            },
            report: {
                eyebrow: 'Bounded report',
                title: 'Frappe Lending reference',
                status: '6 / 6 verified',
                tone: 'good',
                summary:
                    'Published local reference evidence, not a customer deployment or broad reliability claim.',
                details: [
                    ['Compiled trials', '6'],
                    ['Over-halts', '0'],
                    ['Silent incorrect success', '0'],
                    ['Scope', 'One pinned synthetic task'],
                ],
            },
        },
    },
    {
        key: 'insurance',
        label: 'Insurance',
        application: 'openIMIS',
        workflow: 'Claim intake',
        media: {
            workflow: {
                animated: '/cloud-preview/insurance-workflow.gif',
                still: '/cloud-preview/insurance-workflow.jpg',
                alt: 'The OpenAdapt Cloud workflows list opening the synthetic openIMIS workflow: approved bundle versions and run history in the real dashboard.',
            },
            run: {
                animated: '/cloud-preview/insurance-run.gif',
                still: '/cloud-preview/insurance-run.jpg',
                alt: 'OpenAdapt Cloud run detail for a completed synthetic openIMIS run: step metrics and the live timeline with verified effects.',
            },
            evidence: {
                animated: '/cloud-preview/insurance-evidence.gif',
                still: '/cloud-preview/insurance-evidence.jpg',
                alt: 'OpenAdapt Cloud halt evidence for the synthetic openIMIS workflow: the locally reported stop, resolver metrics, and the governed repair page.',
            },
            report: {
                animated: '/cloud-preview/insurance-report.gif',
                still: '/cloud-preview/insurance-report.jpg',
                alt: 'OpenAdapt Cloud run report for the synthetic openIMIS run: structured step receipts bound to the compiled bundle.',
            },
        },
        views: {
            workflow: {
                eyebrow: 'Reference workflow',
                title: 'Health-facility claim intake',
                status: 'Approved reference',
                tone: 'good',
                summary:
                    'A synthetic openIMIS claim-entry demonstration compiled into a bounded workflow.',
                details: [
                    ['Workflow', 'openimis-claim-intake'],
                    ['Inputs', 'Insuree no. · claim no. · explanation'],
                    ['Target', 'openIMIS Health Facility Claim form'],
                    ['Effect contract', 'Exactly one claim in status Entered'],
                ],
            },
            run: {
                eyebrow: 'Compiled runs',
                title: 'openIMIS replays',
                status: '3 / 3 verified',
                tone: 'good',
                summary:
                    'Three compiled replays completed with fresh claim numbers and no model calls.',
                details: [
                    ['Compiled replays', '3'],
                    ['Verified correct', '3'],
                    ['Duplicate claims', '0'],
                    ['Model calls', '0'],
                ],
            },
            evidence: {
                eyebrow: 'Run evidence',
                title: 'Claims database oracle',
                status: 'Effect verified',
                tone: 'good',
                summary:
                    'Acceptance requires exactly one matching, non-voided claim row in the claims database.',
                details: [
                    ['SQL claim readback', 'Exactly one new row'],
                    ['Claim status', 'Entered'],
                    ['Record context', 'Insuree and facility matched'],
                    ['Wrong-policyholder writes', '0'],
                ],
            },
            report: {
                eyebrow: 'Bounded report',
                title: 'openIMIS reference',
                status: '3 / 3 verified',
                tone: 'good',
                summary:
                    'Published local reference evidence, not a customer deployment or reliability benchmark.',
                details: [
                    ['Compiled replays', '3'],
                    ['Duplicate claims', '0'],
                    ['Wrong-policyholder writes', '0'],
                    ['Scope', 'One pinned synthetic task'],
                ],
            },
        },
    },
]

export default function DashboardShowcase() {
    const [referenceIndex, setReferenceIndex] = useState(0)
    const [viewIndex, setViewIndex] = useState(0)
    const [playing, setPlaying] = useState(true)
    const [reducedMotion, setReducedMotion] = useState(false)

    useEffect(() => {
        const preference = window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        )
        const syncPreference = () => setReducedMotion(preference.matches)

        syncPreference()
        preference.addEventListener?.('change', syncPreference)
        return () => preference.removeEventListener?.('change', syncPreference)
    }, [])

    useEffect(() => {
        if (!playing || reducedMotion) return undefined

        const timer = window.setInterval(() => {
            setViewIndex((currentView) => {
                const nextView = (currentView + 1) % VIEW_ORDER.length
                if (nextView === 0) {
                    setReferenceIndex(
                        (currentReference) =>
                            (currentReference + 1) % REFERENCES.length
                    )
                }
                return nextView
            })
        }, TOUR_INTERVAL_MS)

        return () => window.clearInterval(timer)
    }, [playing, reducedMotion])

    const reference = REFERENCES[referenceIndex]
    const viewKey = VIEW_ORDER[viewIndex]
    const view = reference.views[viewKey]
    // Every reference x view slot has its own footage of the real Cloud
    // dashboard (captured from openadapt-cloud in local mock mode with
    // synthetic seed data — see /cloud-preview/provenance.json).
    const media = reference.media[viewKey]
    const tourPlaying = playing && !reducedMotion

    const selectReference = (index) => {
        setReferenceIndex(index)
        setViewIndex(0)
        setPlaying(false)
    }

    const selectView = (index) => {
        setViewIndex(index)
        setPlaying(false)
    }

    return (
        <section
            className={styles.section}
            id="cloud-product"
            aria-labelledby="cloud-product-heading"
        >
            <div className={styles.inner}>
                <div className={styles.intro}>
                    <p className={styles.eyebrow}>OpenAdapt Cloud</p>
                    <h2
                        className={styles.heading}
                        id="cloud-product-heading"
                    >
                        From approved workflow to reviewable outcome.
                    </h2>
                    <p className={styles.summary}>
                        Explore how workflows, runs, evidence, and reports stay
                        connected across three real reference applications.
                    </p>
                </div>

                <div
                    className={styles.referencePicker}
                    role="group"
                    aria-label="Choose a reference workflow"
                >
                    {REFERENCES.map((item, index) => (
                        <button
                            key={item.key}
                            type="button"
                            className={
                                index === referenceIndex
                                    ? styles.referenceActive
                                    : styles.referenceButton
                            }
                            aria-pressed={index === referenceIndex}
                            data-testid={`dashboard-reference-${item.key}`}
                            onClick={() => selectReference(index)}
                        >
                            <span>{item.label}</span>
                            <strong>{item.application}</strong>
                        </button>
                    ))}
                </div>

                <figure
                    className={styles.figure}
                    data-testid="dashboard-product-preview"
                >
                    <div
                        className={styles.dashboard}
                        data-reference={reference.key}
                        data-view={viewKey}
                        data-playing={tourPlaying ? 'true' : 'false'}
                        data-reduced-motion={
                            reducedMotion ? 'true' : 'false'
                        }
                    >
                        <header className={styles.topbar}>
                            <div
                                className={styles.brand}
                                data-testid="dashboard-preview-brand"
                            >
                                <span aria-hidden="true">OA</span>
                                <strong>OpenAdapt</strong>
                                <small>Cloud</small>
                            </div>
                            <div className={styles.workspace}>
                                Reference workflows
                            </div>
                        </header>

                        <aside className={styles.sidebar}>
                            <p className={styles.sidebarLabel}>
                                Operating view
                            </p>
                            <div
                                className={styles.viewControls}
                                role="group"
                                aria-label="Choose a Cloud preview state"
                            >
                                {VIEW_ORDER.map((item, index) => (
                                    <button
                                        key={item}
                                        type="button"
                                        className={
                                            index === viewIndex
                                                ? styles.viewActive
                                                : styles.viewButton
                                        }
                                        aria-pressed={index === viewIndex}
                                        data-testid={`dashboard-view-${item}`}
                                        onClick={() => selectView(index)}
                                    >
                                        <span aria-hidden="true">
                                            {String(index + 1).padStart(2, '0')}
                                        </span>
                                        {VIEW_LABELS[item]}
                                    </button>
                                ))}
                            </div>
                            <div className={styles.tourControls}>
                                {reducedMotion ? (
                                    <span
                                        className={styles.reducedStatus}
                                        data-testid="dashboard-tour-status"
                                    >
                                        Tour paused for reduced motion
                                    </span>
                                ) : (
                                    <button
                                        type="button"
                                        className={styles.playback}
                                        onClick={() =>
                                            setPlaying((current) => !current)
                                        }
                                        aria-label={
                                            playing
                                                ? 'Pause guided Cloud tour'
                                                : 'Play guided Cloud tour'
                                        }
                                    >
                                        <span aria-hidden="true">
                                            {playing ? 'Ⅱ' : '▶'}
                                        </span>
                                        {playing ? 'Pause tour' : 'Play tour'}
                                    </button>
                                )}
                            </div>
                        </aside>

                        <div
                            className={styles.preview}
                            id="cloud-preview-panel"
                        >
                            <div className={styles.previewHeader}>
                                <div>
                                    <p>{reference.label} reference</p>
                                    <h3>{reference.application}</h3>
                                </div>
                                <span>{reference.workflow}</span>
                            </div>

                            <div
                                className={styles.previewGrid}
                                key={`${reference.key}-${viewKey}`}
                            >
                                <article className={styles.stateCard}>
                                    <div className={styles.stateHeading}>
                                        <div>
                                            <p>{view.eyebrow}</p>
                                            <h4>{view.title}</h4>
                                        </div>
                                        <span
                                            className={
                                                view.tone === 'attention'
                                                    ? styles.statusAttention
                                                    : styles.statusGood
                                            }
                                        >
                                            {view.status}
                                        </span>
                                    </div>
                                    <p className={styles.stateSummary}>
                                        {view.summary}
                                    </p>
                                    <dl className={styles.details}>
                                        {view.details.map(([label, value]) => (
                                            <div key={label}>
                                                <dt>{label}</dt>
                                                <dd>{value}</dd>
                                            </div>
                                        ))}
                                    </dl>
                                </article>

                                <div className={styles.referenceMedia}>
                                    {/*
                                     * Product footage follows the same
                                     * mechanism as the How-it-works Clips: an
                                     * <img> pointed DIRECTLY at the animated
                                     * GIF, which always plays and loops via
                                     * the GIF's own loop flag. Footage
                                     * playback is deliberately independent of
                                     * the guided-tour state: selecting a
                                     * reference or view pauses the tour, and
                                     * an earlier version also swapped this
                                     * src to the static .jpg still — freezing
                                     * the footage after any tab click. Only
                                     * prefers-reduced-motion shows the still.
                                     * The key remounts the <img> per
                                     * reference/view so a newly selected
                                     * reference restarts from its first
                                     * frame.
                                     */}
                                    <img
                                        key={`${reference.key}-${viewKey}`}
                                        src={
                                            reducedMotion
                                                ? media.still
                                                : media.animated
                                        }
                                        width="880"
                                        height="550"
                                        alt={media.alt}
                                        loading="lazy"
                                        decoding="async"
                                        data-testid="dashboard-reference-media"
                                    />
                                    <span>
                                        Real OpenAdapt Cloud app · synthetic{' '}
                                        {reference.application} workflow
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <figcaption
                        className={styles.caption}
                        id="dashboard-preview-caption"
                    >
                        <strong>
                            Interactive product preview · no live backend
                            dependency
                        </strong>
                        <span>
                            Reference workflows using synthetic records
                        </span>
                    </figcaption>
                </figure>

                <div className={styles.actions}>
                    <a
                        className="btn-ink"
                        href="https://app.openadapt.ai/dashboard"
                    >
                        Open the Cloud app
                    </a>
                    <a className="btn-ghost-ink" href="#pricing">
                        See launch plans
                    </a>
                </div>
            </div>
        </section>
    )
}
