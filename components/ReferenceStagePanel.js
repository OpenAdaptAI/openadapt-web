import styles from './ReferenceStagePanel.module.css'

const stageLabels = {
    compile: 'compile',
    resolve: 'resolve or halt',
    verify: 'audit',
}

function PanelFrame({ reference, stage, badge, children, caption }) {
    const media = reference.stageMedia[stage]

    return (
        <figure
            className={styles.figure}
            data-testid={`reference-${stage}-panel`}
            data-reference={reference.key}
            data-stage-source={media.src}
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
                    className={styles.application}
                    src={media.src}
                    alt={media.alt}
                    width="880"
                    height="550"
                    loading="lazy"
                    decoding="async"
                />
                <span className={styles.sourceChip}>
                    <i aria-hidden="true" />
                    {media.sourceLabel}
                </span>
                <div className={styles.stageOverlay}>{children}</div>
            </div>
            <figcaption className={styles.caption}>
                <strong>
                    {stageLabels[stage]} — {media.sourceLabel}
                </strong>
                <span>{caption}</span>
            </figcaption>
        </figure>
    )
}

function CompilePanel({ reference }) {
    const contract = reference.compile

    return (
        <PanelFrame
            reference={reference}
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

function ResolvePanel({ reference }) {
    return (
        <PanelFrame
            reference={reference}
            stage="resolve"
            badge="resolving"
            caption="Selected-app replay footage with the target-evidence ladder and explicit halt path animated in context."
        >
            <span className={styles.targetMarker} aria-hidden="true">
                <i />
            </span>
            <div className={`${styles.glassCard} ${styles.resolveCard}`}>
                <div className={styles.panelHeading}>
                    <span>target evidence</span>
                    <strong>unique match required</strong>
                </div>
                <ol className={styles.ladder}>
                    {reference.resolve.evidence.map((item, index) => (
                        <li
                            key={item}
                            style={{ '--evidence-index': index }}
                        >
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

function VerifyPanel({ reference }) {
    const verification = reference.verify

    return (
        <PanelFrame
            reference={reference}
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

export default function ReferenceStagePanel({ reference, stage }) {
    if (stage === 'compile') {
        return <CompilePanel reference={reference} />
    }
    if (stage === 'resolve') {
        return <ResolvePanel reference={reference} />
    }
    if (stage === 'verify') {
        return <VerifyPanel reference={reference} />
    }
    return null
}
