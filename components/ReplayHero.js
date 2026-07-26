import Link from 'next/link'

import ReferenceDemoShowcase from './ReferenceDemoShowcase'
import styles from './ReplayHero.module.css'

/**
 * The homepage proof surface uses the same data, media player, controls, and
 * source labels as every vertical page. Real application footage comes first;
 * the exact Cloud execution/evidence journey remains one click away.
 */
export default function ReplayHero() {
    return (
        <figure className={styles.figure}>
            <ReferenceDemoShowcase compact initialIndustry="healthcare" />

            <div className={styles.proofStrip}>
                <div>
                    <span>Three real applications</span>
                    <strong>OpenEMR · Frappe Lending · openIMIS</strong>
                </div>
                <div>
                    <span>One execution contract</span>
                    <strong>Demonstrate → replay → verify or halt</strong>
                </div>
                <div>
                    <span>Healthy compiled runs</span>
                    <strong>0 model calls</strong>
                </div>
            </div>

            <div className={styles.actions}>
                <a
                    className="btn-ink"
                    href="https://app.openadapt.ai/demo"
                >
                    Open the end-to-end demo
                </a>
                <Link className="btn-ghost-ink" href="/compare">
                    Compare methods and results
                </Link>
            </div>
        </figure>
    )
}
