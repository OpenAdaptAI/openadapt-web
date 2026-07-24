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
                                Compile repeated GUI work. Verify the result.
                                Halt when you can&rsquo;t.
                            </h1>
                            <p className="mt-0 mb-4 mx-auto max-w-2xl font-sans font-normal text-base md:text-lg text-ink-2">
                                Demonstrate a repeated task once. OpenAdapt
                                compiles it into a local program that replays at
                                $0 per healthy run across browser, Windows,
                                macOS, Linux, RDP, and Citrix. When the screen
                                changes, it re-checks its evidence, repairs with
                                AI when it can, and halts for a person instead
                                of guessing.{' '}
                                <Link href="#product-status">
                                    See how it runs across every interface.
                                </Link>
                            </p>
                            <p className={styles.fitLine}>
                                Purpose-built for repeated, high-stakes GUI work
                                with no clean API, where a wrong action is costly
                                and the result should be verified, not assumed.
                            </p>
                            <div id="register">
                                <div className="flex flex-wrap items-center justify-center gap-3 mt-0 mb-4">
                                    <Link
                                        className={styles.heroCloud}
                                        href="#cloud-product"
                                        onClick={() =>
                                            track(EVENTS.HERO_CTA_CLICK, {
                                                cta: 'start_cloud',
                                            })
                                        }
                                    >
                                        Start with OpenAdapt Cloud
                                    </Link>
                                    <Link
                                        className="btn-ghost-ink"
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
                                <p className="mb-2 text-sm text-ink-3">
                                    Hosted runs in minutes · or run it entirely on
                                    your own machine · zero per-run model cost ·
                                    deterministic replay you can audit
                                </p>
                                <p className="mb-8 text-sm text-ink-3">
                                    <Link href="/paper">
                                        Read the technical paper
                                    </Link>
                                </p>
                            </div>
                            <div className="flex flex-col align-center justify-center px-4 min-w-0 max-w-full overflow-hidden">
                                <ReplayHero />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
