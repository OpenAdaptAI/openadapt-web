import React from 'react'
import Link from 'next/link'

import ReplayHero from '@components/ReplayHero'
import AttendedDecisionPreview from '@components/AttendedDecisionPreview'
import { track, EVENTS } from 'utils/analytics'
import useLiveRepositoryStats from 'utils/useLiveRepositoryStats'

import styles from './MastHead.module.css'

export default function Home({ githubStats: initialGithubStats }) {
    // Same live source and same en-US formatting as the footer, so the hero
    // and the footer can never show two different star counts for the same
    // repository on the same page view.
    const githubStats = useLiveRepositoryStats(initialGithubStats)
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
                                    FREE TO RUN LOCALLY · MIT OPEN SOURCE
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
                                        {githubStats.stars.toLocaleString(
                                            'en-US'
                                        )}{' '}
                                        stars on OpenAdapt
                                        <span className="text-ink-3">
                                            · {githubStats.forks} forks
                                        </span>
                                    </a>
                                )}
                            </div>
                            <h1 className="font-display text-2xl md:text-3xl mt-0 mb-4 font-semibold tracking-tight text-ink">
                                Automate the UI-only work your APIs can&rsquo;t reach.
                            </h1>
                            <p className="mt-0 mb-4 mx-auto max-w-2xl font-sans font-normal text-base md:text-lg text-ink-2">
                                OpenAdapt compiles demonstrations into one
                                governed loop across browser, desktop, RDP, and
                                Citrix. Browser runs in production today;
                                desktop, RDP, and Citrix run through
                                customer-controlled qualification. It verifies
                                consequential results and halts when it cannot
                                prove the intended outcome.
                            </p>
                            <p className={styles.fitLine}>
                                Verified business effects · fail-closed execution ·
                                customer-controlled sensitive data
                            </p>
                            <div id="register">
                                <div className="flex flex-wrap items-center justify-center gap-3 mt-0 mb-4">
                                    <Link
                                        className={styles.heroCloud}
                                        href="/qualify"
                                        onClick={() =>
                                            track(EVENTS.HERO_CTA_CLICK, {
                                                cta: 'qualify_one_workflow',
                                            })
                                        }
                                    >
                                        Qualify one workflow
                                    </Link>
                                    <Link
                                        className="btn-ghost-ink"
                                        href="/book"
                                        data-testid="book-call-cta"
                                        onClick={() =>
                                            track(EVENTS.HERO_CTA_CLICK, {
                                                cta: 'book_call',
                                            })
                                        }
                                    >
                                        Book a 30-minute call
                                    </Link>
                                    <Link
                                        className="btn-ghost-ink"
                                        href="/start"
                                        data-testid="local-quickstart-cta"
                                        onClick={() =>
                                            track(EVENTS.HERO_CTA_CLICK, {
                                                cta: 'run_locally_free',
                                            })
                                        }
                                    >
                                        Run locally for free
                                    </Link>
                                    <a
                                        className="btn-ghost-ink"
                                        href="https://app.openadapt.ai/demo"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        data-testid="cloud-demo-cta"
                                        onClick={() =>
                                            track(EVENTS.HERO_CTA_CLICK, {
                                                cta: 'explore_cloud_demo',
                                            })
                                        }
                                    >
                                        Explore the app
                                    </a>
                                </div>
                                <p className="mb-8 text-sm leading-relaxed text-ink-3">
                                    <code className="rounded border border-hairline bg-panel px-2 py-1 text-ink">
                                        pip install openadapt
                                    </code>
                                    <span aria-hidden="true"> · </span>
                                    MIT licensed
                                    <span aria-hidden="true"> · </span>
                                    No account or Cloud required
                                </p>
                            </div>
                            <div className="flex flex-col align-center justify-center px-4 min-w-0 max-w-full overflow-hidden">
                                <ReplayHero />
                                <AttendedDecisionPreview />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
