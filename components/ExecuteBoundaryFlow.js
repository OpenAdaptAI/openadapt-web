import styles from './ExecuteBoundaryFlow.module.css'

const stages = [
    {
        title: 'Your product',
        detail: 'Authorized structured input',
        kind: 'input',
    },
    {
        title: 'Customer-controlled runner',
        detail: 'Local observation and actuation',
        kind: 'runner',
    },
    {
        title: 'OpenAdapt',
        detail: 'Proof or typed exception',
        kind: 'proof',
    },
]

function StageIcon({ kind }) {
    if (kind === 'input') {
        return (
            <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
                <path d="M7 6h18v20H7zM11 11h10M11 16h10M11 21h6" />
            </svg>
        )
    }

    if (kind === 'runner') {
        return (
            <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
                <rect x="5" y="6" width="22" height="16" rx="2" />
                <path d="M12 27h8M16 22v5M10 14h12M16 10v8" />
            </svg>
        )
    }

    return (
        <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
            <path d="M16 4l9 4v7c0 6-3.8 10.4-9 13-5.2-2.6-9-7-9-13V8z" />
            <path d="M12 16l2.6 2.6L20.5 12" />
        </svg>
    )
}

function Connector({ returnPath = false }) {
    return (
        <div className={`${styles.connector} ${returnPath ? styles.returnPath : ''}`} aria-hidden="true">
            <svg viewBox="0 0 80 40" focusable="false">
                <path d="M4 20h64m0 0l-9-9m9 9l-9 9" />
            </svg>
            <span>{returnPath ? 'proof / exception' : 'authorized handoff'}</span>
        </div>
    )
}

// A static, semantic flow remains available when motion is reduced. The moving
// dash is presentation-only; the text defines the actual execution boundary.
export default function ExecuteBoundaryFlow() {
    return (
        <figure className={styles.figure} aria-labelledby="execute-boundary-flow-title">
            <figcaption id="execute-boundary-flow-title" className={styles.srOnly}>
                Authorized structured input moves from your product to a customer-controlled runner. The runner acts locally. OpenAdapt returns proof or a typed exception.
            </figcaption>
            <div className={styles.flow}>
                {stages.map((stage, index) => (
                    <div className={styles.part} key={stage.title}>
                        <article className={styles.stage}>
                            <span className={styles.icon}><StageIcon kind={stage.kind} /></span>
                            <span className={styles.stageCopy}>
                                <strong>{stage.title}</strong>
                                <span>{stage.detail}</span>
                            </span>
                        </article>
                        {index < stages.length - 1 && <Connector />}
                    </div>
                ))}
            </div>
            <div className={styles.returnLane}>
                <Connector returnPath />
                <p>Signed receipt returns to your product after verification or a governed stop.</p>
            </div>
        </figure>
    )
}
