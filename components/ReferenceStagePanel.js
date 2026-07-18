import styles from './ReferenceStagePanel.module.css'

function PanelFrame({ reference, stage, badge, children, caption }) {
    return (
        <figure
            className={styles.figure}
            data-testid={`reference-${stage}-panel`}
            data-reference={reference.key}
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
            <div className={styles.content}>{children}</div>
            <figcaption className={styles.caption}>{caption}</figcaption>
        </figure>
    )
}

function CompilePanel({ reference }) {
    const contract = reference.compile

    return (
        <PanelFrame
            reference={reference}
            stage="compile"
            badge="contract"
            caption={`Crafted contract view for ${reference.system}. It illustrates the compiled structure; it is not captured application output.`}
        >
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
                    <dt>declared effect</dt>
                    <dd>{contract.effect}</dd>
                </div>
                <div>
                    <dt>healthy replay</dt>
                    <dd>deterministic · local · zero model calls</dd>
                </div>
            </dl>
        </PanelFrame>
    )
}

function ResolvePanel({ reference }) {
    return (
        <PanelFrame
            reference={reference}
            stage="resolve"
            badge="policy"
            caption={`Crafted governed-resolution policy for ${reference.system}. No application-specific drift trial is claimed.`}
        >
            <div className={styles.panelHeading}>
                <span>target resolution</span>
                <strong>fail closed</strong>
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
                <strong>HALT · propose reviewable repair</strong>
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
            <div className={styles.panelHeading}>
                <span>independent effect evidence</span>
                <strong>{verification.status}</strong>
            </div>
            <ul className={styles.checks}>
                {verification.checks.map(([label, value]) => (
                    <li key={label}>
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
