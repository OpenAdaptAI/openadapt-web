import styles from './ExecutionEnvironmentOverlay.module.css'

export default function ExecutionEnvironmentOverlay({
    environment,
    reference,
    stage,
}) {
    return (
        <div
            className={`${styles.overlay} ${
                stage === 'resolve' ? styles.resolve : ''
            }`}
            data-testid="execution-environment-overlay"
            data-execution-environment={environment.key}
            data-environment-source-kind={environment.sourceKind}
            data-reference-stage={stage}
            role="img"
            aria-label={`${environment.label} execution view for the ${reference.label} reference workflow`}
        >
            <div className={styles.badge}>
                <span className={styles.statusDot} aria-hidden="true" />
                <span>{environment.label}</span>
                <small>{environment.system}</small>
            </div>
            <div
                className={`${styles.path} ${styles[environment.motionClass]}`}
                aria-hidden="true"
            >
                <span className={styles.pathLabel}>
                    {environment.pathLabel}
                </span>
                <div className={styles.nodes}>
                    {environment.nodes.map((node, index) => (
                        <span className={styles.node} key={node}>
                            {node}
                            {index < environment.nodes.length - 1 && (
                                <i className={styles.link}>
                                    <b />
                                </i>
                            )}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    )
}
