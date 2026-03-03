import React, { useState } from 'react'

import styles from './BenchmarkSection.module.css'

const BENCHMARK_GIF_URL =
    'https://raw.githubusercontent.com/OpenAdaptAI/openadapt-evals/main/animations/benchmark-viewer.gif'
const WAA_SCREENSHOT_URL =
    'https://raw.githubusercontent.com/OpenAdaptAI/openadapt-evals/main/screenshots/waa_libreoffice_desktop.png'
const EVALS_REPO_URL = 'https://github.com/OpenAdaptAI/openadapt-evals'

export default function BenchmarkSection() {
    const [gifLoaded, setGifLoaded] = useState(false)

    return (
        <div className={styles.background} id="benchmarks">
            <div className={styles.container}>
                <h2 className={styles.heading}>
                    Evaluation &amp; Benchmarks
                </h2>

                {/* Part A: Benchmark Viewer */}
                <div className={styles.viewer}>
                    <div className={styles.gifContainer}>
                        {!gifLoaded && (
                            <div className={styles.gifPlaceholder}>
                                Loading benchmark viewer...
                            </div>
                        )}
                        <img
                            src={BENCHMARK_GIF_URL}
                            alt="Benchmark viewer showing step-by-step evaluation replay with screenshots, actions, and execution logs"
                            className={styles.gif}
                            loading="lazy"
                            onLoad={() => setGifLoaded(true)}
                            style={
                                gifLoaded
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
                            src={WAA_SCREENSHOT_URL}
                            alt="Windows desktop showing a LibreOffice Calc evaluation task"
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
