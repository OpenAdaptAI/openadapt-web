import { useEffect, useState } from 'react'
import React from 'react'
import Link from 'next/link'

import ReplayHero from '@components/ReplayHero'
import { track, EVENTS } from 'utils/analytics'

import styles from './MastHead.module.css'

const CarouselSection = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const carouselItems = [
        "Record once. Replay deterministically and locally.",
        "Healthy runs make zero model calls.",
        "Drift is resolved, reviewed, or refused.",
        "Hosted browser execution is launching now.",
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex === carouselItems.length - 1 ? 0 : prevIndex + 1
            );
        }, 4000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative h-10 w-full overflow-hidden my-2">
            <div className="absolute w-full">
                {carouselItems.map((item, index) => (
                    <div
                        key={index}
                        className={`
                            absolute top-0 left-0 w-full
                            transform transition-all duration-500 ease-out
                            ${index === currentIndex ?
                                'opacity-100 translate-y-0' :
                                'opacity-0 translate-y-4'
                            }
                        `}
                    >
                        <span className="inline-block py-1.5 px-3 w-full text-center text-ink-3 text-sm">
                            {item}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

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
                                        href="https://github.com/OpenAdaptAI/openadapt-flow"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={() =>
                                            track(EVENTS.GITHUB_CLICK, {
                                                location: 'hero_stars',
                                            })
                                        }
                                        className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm text-ink-2 no-underline"
                                        style={{ border: '1px solid var(--hairline)' }}
                                    >
                                        <span aria-hidden="true">★</span>
                                        {formatStars(githubStats.stars)} on openadapt-flow
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
                                Record a repeated browser task once. Replay it
                                locally with no model calls on healthy runs. When
                                the interface changes, OpenAdapt re-resolves from
                                evidence, proposes a reviewable repair, or stops
                                for an operator.
                            </p>
                            <p className="mt-0 mb-6 mx-auto max-w-3xl font-sans font-normal text-base md:text-lg text-ink-3">
                                The browser workflow path is Beta and available
                                today. Windows is Experimental; macOS, RDP, and
                                Citrix remain Research.{' '}
                                <Link href="#product-status">See the maturity matrix.</Link>
                            </p>
                            <div className="flex flex-col align-center justify-center px-4 min-w-0 max-w-full overflow-hidden">
                                <ReplayHero />
                            </div>
                            <div className="mt-6 font-light text-base md:text-lg">
                                <CarouselSection />
                            </div>
                            <div id="register">
                                <div className="flex items-center justify-center gap-3 mt-6 mb-4">
                                    <Link
                                        className="btn-ink"
                                        href="#pricing"
                                        onClick={() =>
                                            track(EVENTS.HERO_CTA_CLICK, {
                                                cta: 'start_hosted',
                                            })
                                        }
                                    >
                                        Start hosted
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
                                        Run locally
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
