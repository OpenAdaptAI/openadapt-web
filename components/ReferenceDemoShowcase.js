import { useEffect, useState } from 'react'
import Link from 'next/link'

import EvidenceMediaPlayer from './EvidenceMediaPlayer'
import {
    getReferenceDemo,
    hasExactBoundPresentation,
    REFERENCE_DEMOS,
} from '../data/referenceDemos'
import styles from './ReferenceDemoShowcase.module.css'

export default function ReferenceDemoShowcase({
    initialIndustry = 'healthcare',
    heading = 'See the same governed loop in real applications',
    intro = 'Choose an application, then compare the captured demonstration with its compiled replay. Each result links to its exact evidence boundary.',
    compact = false,
}) {
    const [activeId, setActiveId] = useState(initialIndustry)
    const [phase, setPhase] = useState('replay')
    const [mediaView, setMediaView] = useState('source')

    useEffect(() => setActiveId(initialIndustry), [initialIndustry])

    const demo = getReferenceDemo(activeId)
    const phaseMedia = phase === 'recording' ? demo.recording : demo.replay
    const hasPresentation = hasExactBoundPresentation(phaseMedia)
    const usePresentation = hasPresentation && mediaView === 'presentation'
    const media = usePresentation
        ? phaseMedia.presentationMedia
        : phaseMedia
    const exactTimeline = usePresentation
        ? phaseMedia.presentationTimeline
        : null

    return (
        <section
            className={`${styles.section} ${compact ? styles.compact : ''}`}
            data-testid="reference-demo-showcase"
            data-active-reference={demo.id}
        >
            <div className={styles.inner}>
                {!compact && (
                    <div className={styles.intro}>
                        <p className={styles.eyebrow}>Real application footage</p>
                        <h2>{heading}</h2>
                        <p>{intro}</p>
                    </div>
                )}

                <div
                    className={styles.applicationTabs}
                    role="tablist"
                    aria-label="Reference application"
                >
                    {REFERENCE_DEMOS.map((item) => (
                        <button
                            key={item.id}
                            type="button"
                            role="tab"
                            aria-selected={item.id === demo.id}
                            aria-controls="reference-demo-panel"
                            className={styles.applicationTab}
                            data-active={item.id === demo.id ? 'true' : undefined}
                            onClick={() => setActiveId(item.id)}
                        >
                            <span>{item.industry}</span>
                            <small>{item.application}</small>
                        </button>
                    ))}
                </div>

                <div className={styles.phaseTabs} role="group" aria-label={`${demo.application} footage`}>
                    <button
                        type="button"
                        aria-pressed={phase === 'recording'}
                        onClick={() => setPhase('recording')}
                    >
                        Recorded demonstration
                    </button>
                    <button
                        type="button"
                        aria-pressed={phase === 'replay'}
                        onClick={() => setPhase('replay')}
                    >
                        Compiled replay
                    </button>
                </div>

                <ol className={styles.lifecycle} aria-label="Governed workflow lifecycle">
                    <li data-active={phase === 'recording' ? 'true' : undefined}>
                        <span>1</span>
                        <div>
                            <strong>Demonstrate</strong>
                            <small>Capture the task and its evidence.</small>
                        </div>
                    </li>
                    <li data-active={phase === 'replay' ? 'true' : undefined}>
                        <span>2</span>
                        <div>
                            <strong>Execute</strong>
                            <small>Replay the compiled workflow locally.</small>
                        </div>
                    </li>
                    <li data-active={phase === 'replay' ? 'true' : undefined}>
                        <span>3</span>
                        <div>
                            <strong>Verify or halt</strong>
                            <small>Prove the effect, or stop for review.</small>
                        </div>
                    </li>
                </ol>

                {hasPresentation && (
                    <div
                        className={styles.mediaViewTabs}
                        role="group"
                        aria-label={`${demo.application} media view`}
                    >
                        <button
                            type="button"
                            aria-pressed={mediaView === 'presentation'}
                            onClick={() => setMediaView('presentation')}
                        >
                            Timeline view
                        </button>
                        <button
                            type="button"
                            aria-pressed={mediaView === 'source'}
                            onClick={() => setMediaView('source')}
                        >
                            Raw source
                        </button>
                    </div>
                )}

                <div
                    id="reference-demo-panel"
                    className={styles.panel}
                    role="tabpanel"
                    aria-label={`${demo.application} ${phase}`}
                >
                    <div className={styles.mediaColumn}>
                        <EvidenceMediaPlayer
                            key={`${demo.id}-${phase}`}
                            media={media}
                            application={demo.application}
                            phase={phase}
                            exactTimeline={exactTimeline}
                        />
                        <p className={styles.mediaTruth}>
                            {usePresentation
                                ? 'Exact-frame presentation derived from the retained runtime timeline; raw evidence remains unchanged.'
                                : phase === 'recording'
                                  ? 'Raw source recording.'
                                  : 'Raw compiled replay footage.'}
                        </p>
                    </div>

                    <aside className={styles.proof}>
                        <p className={styles.proofClass}>{demo.evidenceClass}</p>
                        <h3>{demo.application}</h3>
                        <p className={styles.applicationDetail}>{demo.applicationDetail}</p>
                        <p className={styles.task}>{demo.task}</p>

                        {phase === 'recording' ? (
                            <div className={styles.recordingNote}>
                                <strong>Demonstrate once</strong>
                                <span>
                                    The recorder retains the screen, input timing,
                                    and available structural evidence used to compile
                                    the workflow.
                                </span>
                            </div>
                        ) : (
                            <>
                                <dl className={styles.metrics}>
                                    {demo.metrics.map((metric) => (
                                        <div key={metric.label}>
                                            <dt>{metric.label}</dt>
                                            <dd>{metric.value}</dd>
                                        </div>
                                    ))}
                                </dl>
                                <div className={styles.verification}>
                                    <strong>How the result was checked</strong>
                                    <span>{demo.verification}</span>
                                </div>
                            </>
                        )}

                        <div className={styles.links}>
                            <Link href={demo.evidenceHref}>{demo.evidenceLabel}</Link>
                            <a href={demo.methodologyHref} target="_blank" rel="noopener noreferrer">
                                {demo.methodologyLabel}
                            </a>
                            <Link href={demo.route}>{demo.industry} use case</Link>
                            <a href="https://app.openadapt.ai/demo">Open the full Cloud demo</a>
                        </div>
                    </aside>
                </div>
            </div>
        </section>
    )
}
