import { useEffect, useRef, useState } from 'react'

import ExecutionEnvironmentOverlay from './ExecutionEnvironmentOverlay'
import styles from './ReferenceStagePanel.module.css'

const stageLabels = {
    compile: 'compile',
    resolve: 'resolve or halt',
    verify: 'audit',
}

function PanelFrame({
    reference,
    environment,
    stage,
    badge,
    children,
    caption,
}) {
    const media = reference.stageMedia[stage]
    const figureRef = useRef(null)
    const [visibleRun, setVisibleRun] = useState(0)
    const [loadedMedia, setLoadedMedia] = useState(null)
    const mediaToken = `${media.src}:${visibleRun}`
    const mediaReady = loadedMedia === mediaToken

    useEffect(() => {
        const figure = figureRef.current
        if (!figure || typeof IntersectionObserver === 'undefined') {
            setVisibleRun(1)
            return undefined
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return
                setVisibleRun(1)
                observer.disconnect()
            },
            { rootMargin: '160px 0px' }
        )
        observer.observe(figure)
        return () => observer.disconnect()
    }, [])

    return (
        <figure
            ref={figureRef}
            className={styles.figure}
            data-testid={`reference-${stage}-panel`}
            data-reference={reference.key}
            data-stage-source={media.src}
            data-execution-environment={environment.key}
            data-environment-source-kind={environment.sourceKind}
            data-media-ready={mediaReady ? 'true' : 'false'}
        >
            <div className={styles.titlebar}>
                <span className={styles.dots} aria-hidden="true">
                    <i />
                    <i />
                    <i />
                </span>
                <span className={styles.system}>{reference.system}</span>
                <span className={styles.badge}>{badge}</span>
            </div>
            <div className={styles.scene}>
                <img
                    key={mediaToken}
                    className={styles.application}
                    src={media.src}
                    alt={media.alt}
                    width="880"
                    height="550"
                    loading="lazy"
                    decoding="async"
                    onLoad={() => setLoadedMedia(mediaToken)}
                />
                <div className={styles.stageOverlay}>{children}</div>
                <ExecutionEnvironmentOverlay
                    environment={environment}
                    reference={reference}
                    stage={stage}
                />
            </div>
            <figcaption className={styles.caption}>
                <strong>
                    {stageLabels[stage]} — {media.sourceLabel}
                </strong>
                <span>{caption}</span>
                <small>{environment.mediaCaption}</small>
            </figcaption>
        </figure>
    )
}

function CompilePanel({ reference, environment }) {
    const contract = reference.compile

    return (
        <PanelFrame
            reference={reference}
            environment={environment}
            stage="compile"
            badge="compiling"
            caption="Selected-app footage with an animated view of the inspectable workflow OpenAdapt produces."
        >
            <div className={`${styles.glassCard} ${styles.compileCard}`}>
                <div className={styles.panelHeading}>
                    <span>workflow.json</span>
                    <strong>inspectable</strong>
                </div>
                <dl className={styles.contract}>
                    <div>
                        <dt>workflow</dt>
                        <dd>{contract.workflow}</dd>
                    </div>
                    <div>
                        <dt>parameters</dt>
                        <dd>{contract.parameters}</dd>
                    </div>
                    <div>
                        <dt>target</dt>
                        <dd>{contract.target}</dd>
                    </div>
                    <div>
                        <dt>effect</dt>
                        <dd>{contract.effect}</dd>
                    </div>
                </dl>
                <div className={styles.compileProgress} aria-hidden="true">
                    <i />
                </div>
            </div>
        </PanelFrame>
    )
}

function ResolvePanel({ reference, environment }) {
    const track = reference.resolve.track

    return (
        <PanelFrame
            reference={reference}
            environment={environment}
            stage="resolve"
            badge="resolving"
            caption="Selected-app replay footage with the target-evidence ladder and explicit halt path animated in context."
        >
            <span
                className={`${styles.targetMarker} ${
                    styles[track.animationClass]
                }`}
                data-testid="resolve-target-track"
                data-resolve-track={track.animationClass}
                data-resolve-duration={track.duration}
                data-resolve-evidence={track.evidence}
                style={{ '--target-duration': track.duration }}
                aria-hidden="true"
            >
                <i />
                <b>target</b>
            </span>
            <div className={`${styles.glassCard} ${styles.resolveCard}`}>
                <div className={styles.panelHeading}>
                    <span>target evidence</span>
                    <strong>unique match required</strong>
                </div>
                <ol className={styles.ladder}>
                    {reference.resolve.evidence.map((item, index) => (
                        <li key={item}>
                            <span>{String(index + 1).padStart(2, '0')}</span>
                            <strong>{item}</strong>
                        </li>
                    ))}
                </ol>
                <div className={styles.haltRule}>
                    <span>ambiguous or unverifiable</span>
                    <strong>HALT · REVIEW</strong>
                </div>
            </div>
        </PanelFrame>
    )
}

function VerifyPanel({ reference, environment }) {
    const verification = reference.verify

    return (
        <PanelFrame
            reference={reference}
            environment={environment}
            stage="verify"
            badge={verification.badge}
            caption={verification.caption}
        >
            <div className={`${styles.glassCard} ${styles.verifyCard}`}>
                <div className={styles.panelHeading}>
                    <span>run audit</span>
                    <strong>{verification.status}</strong>
                </div>
                <ul className={styles.checks}>
                    {verification.checks.map(([label, value], index) => (
                        <li
                            key={label}
                            style={{ '--check-index': index }}
                        >
                            <span
                                className={
                                    verification.qualified
                                        ? styles.check
                                        : styles.pending
                                }
                                aria-hidden="true"
                            >
                                {verification.qualified ? '✓' : '—'}
                            </span>
                            <span>
                                <strong>{label}</strong>
                                <small>{value}</small>
                            </span>
                        </li>
                    ))}
                </ul>
                <div className={styles.metrics}>
                    {verification.metrics.map((metric) => (
                        <span key={metric}>{metric}</span>
                    ))}
                </div>
            </div>
        </PanelFrame>
    )
}

export default function ReferenceStagePanel({
    reference,
    environment,
    stage,
}) {
    if (stage === 'compile') {
        return (
            <CompilePanel
                reference={reference}
                environment={environment}
            />
        )
    }
    if (stage === 'resolve') {
        return (
            <ResolvePanel
                reference={reference}
                environment={environment}
            />
        )
    }
    if (stage === 'verify') {
        return (
            <VerifyPanel
                reference={reference}
                environment={environment}
            />
        )
    }
    return null
}
