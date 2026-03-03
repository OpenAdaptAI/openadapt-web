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
                    <div className={styles.windowFrame}>
                        <div className={styles.windowFrameInner}>
                            <div className={styles.windowTitleBar}>
                                <span className={`${styles.windowDot} ${styles.windowDotRed}`} />
                                <span className={`${styles.windowDot} ${styles.windowDotYellow}`} />
                                <span className={`${styles.windowDot} ${styles.windowDotGreen}`} />
                                <span className={styles.windowTitle}>
                                    Benchmark Viewer
                                </span>
                            </div>
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
                        What we&apos;re researching
                    </h3>
                    <p className={styles.researchText}>
                        Can showing an AI agent a recording of a human
                        doing a task help it do the task better? We call
                        this demo conditioning, and we&apos;re running
                        experiments on real Windows desktop tasks to find
                        out.
                    </p>
                    <p className={styles.researchText}>
                        Early results are mixed. We&apos;re sharing
                        everything openly as we go.
                    </p>

                    <a
                        href={EVALS_REPO_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.researchLink}
                    >
                        Follow our progress on GitHub &rarr;
                    </a>
                </div>
            </div>
        </div>
    )
}
