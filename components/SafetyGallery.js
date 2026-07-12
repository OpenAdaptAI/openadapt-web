import { CASES } from 'data/safetyCases'
import styles from './SafetyGallery.module.css'

function Column({ side }) {
    return (
        <div className={styles.col}>
            <div className={styles.colLabel}>{side.label}</div>
            <img
                className={styles.row}
                src={`/safety/${side.row}`}
                alt={`${side.label}: patient row reading ${side.mrnText}`}
                loading="lazy"
                decoding="async"
            />
            <div className={styles.mrnWrap}>
                <span className={styles.mrnTag}>identifier, magnified</span>
                <img
                    className={styles.mrnCrop}
                    src={`/safety/${side.mrn}`}
                    alt={`Magnified record number: ${side.mrnText}`}
                    loading="lazy"
                    decoding="async"
                />
            </div>
            <div className={styles.ocrLabel}>What OCR reads</div>
            <code className={styles.ocr}>{side.ocr}</code>
        </div>
    )
}

function SafetyCase({ c }) {
    return (
        <section
            className={`${styles.card} ${styles[c.verdictKind]}`}
            aria-labelledby={`case-${c.id}`}
        >
            <header className={styles.cardHead}>
                <div>
                    <span className={styles.eyebrow}>{c.eyebrow}</span>
                    <h3 id={`case-${c.id}`} className={styles.title}>
                        {c.title}
                    </h3>
                </div>
                <div className={styles.mark}>
                    <span className={styles.markTick} aria-hidden="true">
                        ✓
                    </span>
                    {c.kind === 'danger' ? 'REFUSED' : 'CORRECT'}
                </div>
            </header>

            <p className={styles.summary}>{c.summary}</p>

            <div className={styles.cols}>
                <Column side={c.recorded} />
                <Column side={c.live} />
            </div>

            <div className={styles.badgeRow}>
                {c.ocrIdentical ? (
                    <span className={`${styles.badge} ${styles.badgeIdentical}`}>
                        OCR reads both rows byte-for-byte identically
                    </span>
                ) : (
                    <span className={`${styles.badge} ${styles.badgeDiffer}`}>
                        The two OCR strings differ
                    </span>
                )}
            </div>

            <p className={styles.diffNote}>{c.diffNote}</p>

            <div className={`${styles.verdict} ${styles[c.verdictKind]}`}>
                <span className={styles.vLabel}>{c.verdict}</span>
                <span className={styles.vText}>{c.verdictText}</span>
                <span className={styles.vCov}>coverage {c.coverage}</span>
            </div>
        </section>
    )
}

export default function SafetyGallery({ cases = CASES }) {
    return (
        <div className={styles.gallery}>
            {cases.map((c) => (
                <SafetyCase key={c.id} c={c} />
            ))}
        </div>
    )
}
