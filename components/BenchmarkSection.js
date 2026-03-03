import React, { useState } from 'react'

import styles from './BenchmarkSection.module.css'

const EVALS_REPO_URL = 'https://github.com/OpenAdaptAI/openadapt-evals'

export default function BenchmarkSection() {
    const [animLoaded, setAnimLoaded] = useState(false)

    return (
        <div className={styles.background} id="benchmarks">
            <div className={styles.container}>
                <h2 className={styles.heading}>
                    Evaluation &amp; Benchmarks
                </h2>

                {/* Part A: Benchmark Viewer */}
                <div className={styles.viewer}>
                    <div className={styles.gifContainer}>
                        {!animLoaded && (
                            <div className={styles.gifPlaceholder}>
                                Loading benchmark viewer...
                            </div>
                        )}
                        <img
                            src="/images/benchmarks/benchmark-viewer.webp"
                            alt="Benchmark viewer showing multi-task evaluation with step-by-step screenshot replay, actions, and success rates"
                            className={styles.gif}
                            loading="lazy"
                            onLoad={() => setAnimLoaded(true)}
                            style={
                                animLoaded
                                    ? {}
                                    : {
                                          position: 'absolute',
                                          opacity: 0,
                                      }
                            }
                        />
                    </div>
                    <p className={styles.caption}>
                        Replay every step of an evaluation — screenshots,
                        actions, and execution logs.{' '}
                        <a
                            href={EVALS_REPO_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            View on GitHub
                        </a>
                    </p>
                </div>

                {/* Part B: Research Approach */}
                <div className={styles.research}>
                    <h3 className={styles.researchHeading}>
                        Demo-Conditioned Agents
                    </h3>
                    <p className={styles.researchText}>
                        Most AI agents start from scratch every time.
                        OpenAdapt&apos;s demo-conditioned approach retrieves
                        relevant past demonstrations to guide the agent —
                        like giving it a worked example before the test.
                    </p>
                    <p className={styles.researchText}>
                        We&apos;re building evaluation infrastructure to
                        measure this systematically across real Windows
                        desktop tasks.
                    </p>

                    <div className={styles.screenshotContainer}>
                        <img
                            src="/images/benchmarks/desktop-task-detail.png"
                            alt="Benchmark viewer task detail showing step-by-step screenshot replay with actions and execution logs"
                            className={styles.screenshot}
                            loading="lazy"
                        />
                    </div>

                    <a
                        href={EVALS_REPO_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.researchLink}
                    >
                        Learn more about our evaluation framework &rarr;
                    </a>
                </div>
            </div>
        </div>
    )
}
