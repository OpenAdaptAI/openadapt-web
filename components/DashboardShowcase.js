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
            record: {
                animated: '/how-it-works/record_openemr.gif',
                still: '/how-it-works/record_openemr.jpg',
                alt: 'OpenAdapt recording a bounded workflow in a live OpenEMR reference instance.',
            },
            replay: {
                animated: '/how-it-works/run_openemr.gif',
                still: '/how-it-works/run_openemr.jpg',
                alt: 'OpenAdapt replaying the compiled OpenEMR reference workflow.',
            },
        },
        views: {
            workflow: {
                eyebrow: 'Reference workflow',
                title: 'Patient note entry',
                status: 'Qualification required',
                tone: 'attention',
                summary:
                    'A recorded OpenEMR browser task retained as bounded target evidence.',
                details: [
                    ['Workflow', 'openemr-browser-reference'],
                    ['Inputs', 'Workflow-defined parameters'],
                    ['Target', 'Bounded OpenEMR browser task'],
                    ['Effect contract', 'Deployment-specific oracle required'],
                ],
            },
            run: {
                eyebrow: 'Compiled replay',
                title: 'OpenEMR reference run',
                status: 'Model-free',
                tone: 'good',
                summary:
                    'The retained demonstration is compiled and replayed locally without per-run model calls.',
                details: [
                    ['Execution', 'Compiled local replay'],
                    ['Targeting', 'Recorded OpenEMR evidence'],
                    ['Identity policy', 'Must be configured'],
                    ['Model calls', '0 per healthy run'],
                ],
            },
            evidence: {
                eyebrow: 'Run evidence',
                title: 'Effect verification',
                status: 'Needs attention',
                tone: 'attention',
                summary:
                    'The reference footage does not establish an independent application effect audit.',
                details: [
                    ['Recorded media', 'Demonstration and replay footage'],
                    ['Effect oracle', 'Not established by this media'],
                    ['Acceptance', 'Halt until declared checks pass'],
                    ['Claim boundary', 'No production reliability claim'],
                ],
            },
            report: {
                eyebrow: 'Qualification report',
                title: 'OpenEMR reference',
                status: 'Review required',
                tone: 'attention',
                summary:
                    'The report keeps the evidence boundary explicit before a deployment is approved.',
                details: [
                    ['Available', 'Recorded target evidence'],
                    ['Required', 'Identity and effect policy'],
                    ['Decision', 'Qualification required'],
                    ['Scope', 'Reference workflow only'],
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
            record: {
                animated: '/lending-demo/record-frappe.gif',
                still: '/lending-demo/record-frappe.jpg',
                alt: 'Captured Frappe Lending frames showing a synthetic loan application demonstration.',
            },
            replay: {
                animated: '/lending-demo/replay-frappe.gif',
                still: '/lending-demo/replay-frappe.jpg',
                alt: 'OpenAdapt replaying the compiled synthetic loan application workflow in Frappe Lending.',
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
            record: {
                animated: '/insurance-demo/record-openimis.gif',
                still: '/insurance-demo/record-openimis.jpg',
                alt: 'Captured openIMIS frames showing a synthetic health-facility claim demonstration.',
            },
            replay: {
                animated: '/insurance-demo/replay-openimis.gif',
                still: '/insurance-demo/replay-openimis.jpg',
                alt: 'OpenAdapt replaying the compiled synthetic claim-intake workflow in openIMIS.',
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
    const media =
        viewKey === 'workflow'
            ? reference.media.record
            : reference.media.replay
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
                                    <img
                                        key={`${reference.key}-${viewKey}-${tourPlaying}`}
                                        src={
                                            tourPlaying
                                                ? media.animated
                                                : media.still
                                        }
                                        width="880"
                                        height="550"
                                        alt={media.alt}
                                        loading="lazy"
                                        decoding="async"
                                        data-testid="dashboard-reference-media"
                                    />
                                    <span>
                                        Real {reference.application} reference
                                        footage
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
