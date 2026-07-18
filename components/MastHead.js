import React from 'react'
import Link from 'next/link'

import ReplayHero from '@components/ReplayHero'
import { track, EVENTS } from 'utils/analytics'

import styles from './MastHead.module.css'

const formatStars = (n) =>
    n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k` : String(n)

export default function Home({ githubStats }) {
    return (
        <div className={styles.section}>
            <div className="relative flex items-center justify-center">
                <div className="relative z-30 py-4 px-4 text-xl w-full max-w-5xl mx-auto">
                    <div className="text-center pt-6">
                        <div className="grid grid-flow-row auto-rows-max gap-0">
                            <div className="font-display text-4xl mb-4 sm:text-5xl md:text-6xl tracking-tight text-ink">
                                <span className="font-extralight">Open</span><span className="font-semibold">Adapt</span>
                                <span className="font-extralight">.AI</span>
                            </div>
                            <div className="mb-4 flex flex-wrap items-center justify-center gap-3">
                                <span className={styles.heroPill}>
                                    LOCAL-FIRST · MIT OPEN SOURCE
                                </span>
                                {githubStats && githubStats.stars > 0 && (
                                    <a
                                        href="https://github.com/OpenAdaptAI/OpenAdapt"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        data-testid="github-proof"
                                        onClick={() =>
                                            track(EVENTS.GITHUB_CLICK, {
                                                location: 'hero_stars',
                                            })
                                        }
                                        className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm text-ink-2 no-underline"
                                        style={{ border: '1px solid var(--hairline)' }}
                                    >
                                        <span aria-hidden="true">★</span>
                                        {formatStars(githubStats.stars)} stars on OpenAdapt
                                        <span className="text-ink-3">
                                            · {githubStats.forks} forks
                                        </span>
                                    </a>
                                )}
                            </div>
                            <h1 className="font-display text-2xl md:text-3xl mt-0 mb-4 font-semibold tracking-tight text-ink">
                                Compile repeated GUI work into governed,
                                deterministic workflows.
                            </h1>
                            <p className="mt-0 mb-6 mx-auto max-w-3xl font-sans font-normal text-base md:text-lg text-ink-2">
                                Demonstrate a bounded, repeated browser task.
                                Compile it into a locally executable workflow
                                whose healthy replay makes no model calls. When the
                                interface changes, OpenAdapt re-resolves from
                                retained evidence, proposes a governed repair, or
                                stops for an operator.
                            </p>
                            <p className="mt-0 mb-6 mx-auto max-w-3xl font-sans font-normal text-base md:text-lg text-ink-3">
                                Start with the supported browser path, then run
                                through the local engine, managed control plane,
                                or a qualified customer boundary.{' '}
                                <Link href="#product-status">See how deployment works.</Link>
                            </p>
                            <div className="flex flex-col align-center justify-center px-4 min-w-0 max-w-full overflow-hidden">
                                <ReplayHero />
                            </div>
                            <div id="register">
                                <div className="flex items-center justify-center gap-3 mt-6 mb-4">
                                    <Link
                                        className="btn-ink"
                                        href="#book"
                                        onClick={() =>
                                            track(EVENTS.HERO_CTA_CLICK, {
                                                cta: 'qualify_workflow',
                                            })
                                        }
                                    >
                                        Evaluate a workflow
                                    </Link>
                                    <Link
                                        className="btn-ghost-ink"
                                        href="#open-source"
                                        onClick={() =>
                                            track(EVENTS.HERO_CTA_CLICK, {
                                                cta: 'run_browser_quickstart',
                                            })
                                        }
                                    >
                                        Try locally
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
