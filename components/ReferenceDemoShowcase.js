import { useEffect, useId, useRef, useState } from 'react'
import Link from 'next/link'

import EvidenceMediaPlayer from './EvidenceMediaPlayer'
import {
    getReferenceDemo,
    getExactBoundPresentation,
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
    const [modeId, setModeId] = useState(
        () => getReferenceDemo(initialIndustry).defaultModeId
    )
    const [mediaView, setMediaView] = useState('presentation')
    const tabRefs = useRef([])
    const idPrefix = useId().replace(/:/g, '')

    useEffect(() => {
        const initialDemo = getReferenceDemo(initialIndustry)
        setActiveId(initialDemo.id)
        setModeId(initialDemo.defaultModeId)
    }, [initialIndustry])

    const demo = getReferenceDemo(activeId)
    const selectedMode =
        demo.modes.find((candidate) => candidate.id === modeId) ??
        demo.modes.find((candidate) => candidate.id === demo.defaultModeId) ??
        demo.modes[0]
    const exactPresentation = getExactBoundPresentation(selectedMode)
    const hasPresentation = exactPresentation !== null
    const usePresentation = hasPresentation && mediaView === 'presentation'
    const media = usePresentation
        ? exactPresentation.media
        : selectedMode
    const playerPresentation = usePresentation
        ? exactPresentation
        : null
    const panelId = `${idPrefix}-reference-demo-panel`

    const selectApplication = (index) => {
        const next = REFERENCE_DEMOS[index]
        setActiveId(next.id)
        setModeId(next.defaultModeId)
        setMediaView('presentation')
        tabRefs.current[index]?.focus()
    }

    const handleApplicationKeyDown = (event, index) => {
        let nextIndex = null
        if (event.key === 'ArrowRight') {
            nextIndex = (index + 1) % REFERENCE_DEMOS.length
        } else if (event.key === 'ArrowLeft') {
            nextIndex =
                (index - 1 + REFERENCE_DEMOS.length) % REFERENCE_DEMOS.length
        } else if (event.key === 'Home') {
            nextIndex = 0
        } else if (event.key === 'End') {
            nextIndex = REFERENCE_DEMOS.length - 1
        }
        if (nextIndex === null) return
        event.preventDefault()
        selectApplication(nextIndex)
    }

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
                    {REFERENCE_DEMOS.map((item, index) => (
                        <button
                            key={item.id}
                            ref={(node) => {
                                tabRefs.current[index] = node
                            }}
                            id={`${idPrefix}-reference-tab-${item.id}`}
                            type="button"
                            role="tab"
                            aria-selected={item.id === demo.id}
                            aria-controls={panelId}
                            tabIndex={item.id === demo.id ? 0 : -1}
                            className={styles.applicationTab}
                            data-active={item.id === demo.id ? 'true' : undefined}
                            onClick={() => selectApplication(index)}
                            onKeyDown={(event) =>
                                handleApplicationKeyDown(event, index)
                            }
                        >
                            <span>{item.industry}</span>
                            <small>{item.application}</small>
                        </button>
                    ))}
                </div>

                <div
                    className={styles.phaseTabs}
                    role="group"
                    aria-label={`${demo.application} footage`}
                    style={{ '--mode-count': demo.modes.length }}
                >
                    {demo.modes.map((mode) => (
                        <button
                            key={mode.id}
                            type="button"
                            data-mode-id={mode.id}
                            data-mode-kind={mode.modeKind}
                            aria-pressed={selectedMode.id === mode.id}
                            onClick={() => {
                                setModeId(mode.id)
                                setMediaView('presentation')
                            }}
                        >
                            {mode.label}
                        </button>
                    ))}
                </div>

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
                            Guided view
                        </button>
                        <button
                            type="button"
                            aria-pressed={mediaView === 'source'}
                            onClick={() => setMediaView('source')}
                        >
                            Raw footage
                        </button>
                    </div>
                )}

                <div
                    id={panelId}
                    className={styles.panel}
                    role="tabpanel"
                    aria-labelledby={`${idPrefix}-reference-tab-${demo.id}`}
                >
                    <div className={styles.mediaColumn}>
                        <EvidenceMediaPlayer
                            key={`${demo.id}:${selectedMode.id}:${mediaView}:${media.kind}:${media.src}:${media.sha256 ?? 'raw'}`}
                            media={media}
                            application={demo.application}
                            phase={selectedMode.modeKind}
                            exactPresentation={playerPresentation}
                            evidenceHref={selectedMode.evidenceHref ?? demo.evidenceHref}
                        />
                        <p className={styles.mediaTruth}>
                            {usePresentation
                                ? 'Guided view synchronized to the exact retained runtime timeline; raw footage remains unchanged.'
                                : selectedMode.sourceCaption}
                        </p>
                    </div>

                    <aside className={styles.proof}>
                        <p className={styles.proofClass}>
                            {selectedMode.evidenceClass ?? demo.evidenceClass}
                        </p>
                        <h3>{demo.application}</h3>
                        <p className={styles.applicationDetail}>{demo.applicationDetail}</p>
                        <p className={styles.task}>{selectedMode.task ?? demo.task}</p>

                        {selectedMode.modeKind === 'recording' ? (
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
                                    {(selectedMode.metrics ?? demo.metrics).map((metric) => (
                                        <div key={metric.label}>
                                            <dt>{metric.label}</dt>
                                            <dd>{metric.value}</dd>
                                        </div>
                                    ))}
                                </dl>
                                <div className={styles.verification}>
                                    <strong>How the result was checked</strong>
                                    <span>{selectedMode.verification ?? demo.verification}</span>
                                </div>
                            </>
                        )}

                        <div className={styles.links}>
                            <Link href={selectedMode.evidenceHref ?? demo.evidenceHref}>
                                {selectedMode.evidenceLabel ?? demo.evidenceLabel}
                            </Link>
                            <a href={selectedMode.methodologyHref ?? demo.methodologyHref} target="_blank" rel="noopener noreferrer">
                                {selectedMode.methodologyLabel ?? demo.methodologyLabel}
                            </a>
                            <Link href={demo.route}>{demo.industry} use case</Link>
                            <a href="https://app.openadapt.ai/demo">Open the full Cloud demo</a>
                        </div>
                    </aside>
                </div>

                <ol className={styles.lifecycle} aria-label="Governed workflow lifecycle">
                    <li>
                        <span>1</span>
                        <div>
                            <strong>Demonstrate</strong>
                            <small>Capture the task and its evidence.</small>
                        </div>
                    </li>
                    <li>
                        <span>2</span>
                        <div>
                            <strong>Execute</strong>
                            <small>Replay the compiled workflow locally.</small>
                        </div>
                    </li>
                    <li>
                        <span>3</span>
                        <div>
                            <strong>Verify or halt</strong>
                            <small>Prove the effect, or stop for review.</small>
                        </div>
                    </li>
                </ol>
            </div>
        </section>
    )
}
