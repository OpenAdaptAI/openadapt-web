/*
 * TARGET-STATE COPY (HELD, do not publish until the product ships).
 * This file describes OpenAdapt as it will be once the deployment x substrate
 * matrix in .private/DESIGN_hosted_matrix_2026_07_14.md lands (web + Windows/Citrix
 * on one runner; our-cloud / BYOC / self-hosted deployment choice; fail-closed
 * regulated run; halt -> teach -> promote). See TARGET_STATE.md. Data-residency
 * claims are scoped per tier, never a blanket company-wide promise.
 */
import { useEffect, useState } from 'react'
import React from 'react'
import Link from 'next/link'

import ReplayHero from '@components/ReplayHero'
import { track, EVENTS } from 'utils/analytics'

import styles from './MastHead.module.css'

const CarouselSection = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const carouselItems = [
        "Show it once. It runs forever.",
        "Compiled replay. Zero per-run model cost.",
        "Self-healing: UI drift becomes a reviewable diff.",
        "Web and Windows. Citrix and legacy desktops.",
        "You choose where the data lives.",
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
                                        href="https://github.com/OpenAdaptAI/OpenAdapt"
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
                                        {formatStars(githubStats.stars)} on GitHub
                                        <span className="text-ink-3">
                                            · {githubStats.forks} forks
                                        </span>
                                    </a>
                                )}
                            </div>
                            <h1 className="font-display text-2xl md:text-3xl mt-0 mb-4 font-semibold tracking-tight text-ink">
                                Show it once. It runs forever.
                            </h1>
                            <p className="mt-0 mb-6 mx-auto max-w-3xl font-sans font-normal text-base md:text-lg text-ink-2">
                                OpenAdapt compiles a recorded demonstration into
                                a self-healing automation that verifies its own
                                effect on screen, confirms it is acting on the
                                right record, and halts rather than guessing.
                                It&apos;s open source and auditable, and you
                                choose where it runs.
                            </p>
                            <p className="mt-0 mb-6 mx-auto max-w-3xl font-sans font-normal text-base md:text-lg text-ink-3">
                                Every automation tool assumes an API. The
                                systems that actually run your business
                                don&apos;t: legacy EMRs, Citrix desktops, the
                                Windows line-of-business apps your team still
                                works by hand. OpenAdapt learns them from one
                                demonstration, on web and Windows alike, and runs
                                them where your data already lives: your machines,
                                your cloud, or ours.
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
                                        href="#book"
                                        onClick={() =>
                                            track(EVENTS.HERO_CTA_CLICK, {
                                                cta: 'book_a_demo',
                                            })
                                        }
                                    >
                                        Book a demo
                                    </Link>
                                    <Link
                                        className="btn-ghost-ink"
                                        href="#how-it-works"
                                        onClick={() =>
                                            track(EVENTS.HERO_CTA_CLICK, {
                                                cta: 'see_how_it_works',
                                            })
                                        }
                                    >
                                        See how it works
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
