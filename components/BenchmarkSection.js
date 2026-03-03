import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFlask, faDesktop, faListCheck } from '@fortawesome/free-solid-svg-icons'

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
                <p className={styles.intro}>
                    We evaluate AI agents on real Windows desktop tasks —
                    spreadsheets, file management, system settings — running
                    in actual VMs, not simulated environments.
                    Every screenshot, click, and keystroke is captured for
                    step-by-step inspection.
                </p>

                <div className={styles.highlights}>
                    <div className={styles.highlight}>
                        <FontAwesomeIcon icon={faDesktop} className={styles.highlightIcon} />
                        <div>
                            <span className={styles.highlightTitle}>Real desktop tasks</span>
                            <span className={styles.highlightDesc}>
                                Windows VMs running LibreOffice, Notepad, Settings, and more
                            </span>
                        </div>
                    </div>
                    <div className={styles.highlight}>
                        <FontAwesomeIcon icon={faListCheck} className={styles.highlightIcon} />
                        <div>
                            <span className={styles.highlightTitle}>Step-by-step replay</span>
                            <span className={styles.highlightDesc}>
                                Inspect every action the agent took, not just pass/fail
                            </span>
                        </div>
                    </div>
                    <div className={styles.highlight}>
                        <FontAwesomeIcon icon={faFlask} className={styles.highlightIcon} />
                        <div>
                            <span className={styles.highlightTitle}>Active development</span>
                            <span className={styles.highlightDesc}>
                                Expanding task suite and publishing results as they're validated
                            </span>
                        </div>
                    </div>
                </div>

                {/* Benchmark Viewer */}
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
                        The benchmark viewer lets you replay every step of an
                        evaluation — screenshots, actions, and execution logs.{' '}
                        <a
                            href={EVALS_REPO_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            View on GitHub
                        </a>
                    </p>
                </div>

                <div className={styles.status}>
                    <span className={styles.statusDot} />
                    Results coming soon — we're running evaluations now and
                    will publish scores as they're validated.
                </div>
            </div>
        </div>
    )
}
