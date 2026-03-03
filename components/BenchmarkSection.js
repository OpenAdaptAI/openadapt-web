import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTerminal, faMagnifyingGlass, faFlask } from '@fortawesome/free-solid-svg-icons'

import styles from './BenchmarkSection.module.css'

const EVALS_REPO_URL = 'https://github.com/OpenAdaptAI/openadapt-evals'
const WAA_URL = 'https://github.com/microsoft/WindowsAgentArena'

export default function BenchmarkSection() {
    const [animLoaded, setAnimLoaded] = useState(false)

    return (
        <div className={styles.background} id="benchmarks">
            <div className={styles.container}>
                <h2 className={styles.heading}>
                    Evaluation &amp; Benchmarks
                </h2>
                <p className={styles.intro}>
                    We wrap official benchmarks like{' '}
                    <a href={WAA_URL} target="_blank" rel="noopener noreferrer">
                        Windows Agent Arena
                    </a>{' '}
                    in an easy-to-use CLI, so you can run, inspect, and debug
                    evaluations without modifying the original benchmarks.
                </p>

                <div className={styles.highlights}>
                    <div className={styles.highlight}>
                        <FontAwesomeIcon icon={faTerminal} className={styles.highlightIcon} />
                        <div>
                            <span className={styles.highlightTitle}>One-command evals</span>
                            <span className={styles.highlightDesc}>
                                VM lifecycle, agent execution, and scoring handled
                                by the <code>oa-vm</code> CLI
                            </span>
                        </div>
                    </div>
                    <div className={styles.highlight}>
                        <FontAwesomeIcon icon={faMagnifyingGlass} className={styles.highlightIcon} />
                        <div>
                            <span className={styles.highlightTitle}>Step-by-step inspection</span>
                            <span className={styles.highlightDesc}>
                                Replay every screenshot, click, and keystroke —
                                not just pass/fail
                            </span>
                        </div>
                    </div>
                    <div className={styles.highlight}>
                        <FontAwesomeIcon icon={faFlask} className={styles.highlightIcon} />
                        <div>
                            <span className={styles.highlightTitle}>Unmodified benchmarks</span>
                            <span className={styles.highlightDesc}>
                                Original tasks and scoring preserved — our
                                tooling wraps, not forks
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
                    Results coming soon — we're running evaluations on
                    Windows Agent Arena and will publish scores once validated.
                </div>
            </div>
        </div>
    )
}
