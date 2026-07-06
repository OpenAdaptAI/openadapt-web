import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import React from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowPointer, faBook, faPen } from '@fortawesome/free-solid-svg-icons'
import {
    faLinkedin,
    faDiscord,
    faGithub,
    faXTwitter,
} from '@fortawesome/free-brands-svg-icons'
import { motion } from 'framer-motion'
import Image from 'next/image'

import AnimatedBackground from '@components/AnimatedBackground'
import AnimatedLogo from '@components/AnimatedLogo'
import ReplayHero from '@components/ReplayHero'
import EmailForm from '@components/EmailForm'
import ParticleField from '@components/ParticleField'

import styles from './MastHead.module.css'

// Import the Sketch component dynamically and set ssr to false
const SketchNoSSR = dynamic(() => import('./Sketch'), {
    ssr: false,
})

const CarouselSection = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const carouselItems = [
        "Show it once. It runs forever. On your premises.",
        "Deterministic replay. Zero per-run model cost.",
        "Self-healing: UI drift becomes a reviewable diff.",
        "Your data never leaves the building.",
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
                        <span className="inline-block py-1.5 px-3 w-full text-center text-white/75 text-sm">
                            {item}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default function Home() {
    return (
        <div className={styles.section}>
            <ParticleField />
            <div className="relative flex items-center justify-center">
                <div className="relative z-30 py-4 px-4 text-xl w-full max-w-5xl mx-auto">
                    <div className="text-center pt-6">
                        <div className="grid grid-flow-row auto-rows-max gap-0">
                            <h1 className="text-5xl mb-4 md:text-6xl tracking-tight">
                                <span className="font-extralight">Open</span><span className="font-semibold">Adapt</span>
                                <span className="font-extralight">.AI</span>
                            </h1>
                            <h2 className="text-2xl md:text-3xl mt-0 mb-4 font-light text-white/90">
                                Show it once. It runs forever. On your premises.
                            </h2>
                            <h3 className="mt-0 mb-6 mx-auto max-w-3xl font-light text-base md:text-lg text-white/70">
                                OpenAdapt compiles a recorded demonstration into
                                a deterministic, self-healing automation — open
                                source, auditable, and running entirely on your
                                own machines.
                            </h3>
                            <div className="flex flex-col align-center justify-center px-4">
                                <ReplayHero />
                            </div>
                            <div className="mt-6 font-light text-base md:text-lg">
                                <CarouselSection />
                            </div>
                            <div id="register">
                                <div className="flex items-center justify-center gap-3 mt-6 mb-4">
                                    <Link
                                        className="px-5 py-2.5 rounded-lg bg-[#560df8] text-white hover:bg-[#7132d4] transition-all duration-200 text-sm font-medium"
                                        href="#book"
                                    >
                                        Book a demo
                                    </Link>
                                    <Link
                                        className="px-5 py-2.5 rounded-lg border border-[#560df8]/50 text-[#60a5fa] hover:border-[#60a5fa] hover:text-white hover:bg-[#560df8]/10 transition-all duration-200 text-sm font-medium"
                                        href="#how-it-works"
                                    >
                                        See how it works
                                    </Link>
                                </div>
                            </div>
                            <EmailForm />
                        </div>
                    </div>
                </div>
                {/* <AnimatedBackground /> */}
                <div className="fixed top-0 right-0 z-50 flex flex-nowrap items-center justify-end gap-2 p-2">
                    {/* Docs Icon */}
                    <div className="relative z-50">
                        <a href="https://docs.openadapt.ai" aria-label="Documentation" title="Documentation">
                            <FontAwesomeIcon
                                icon={faBook}
                                className="text-xl sm:text-2xl"
                            />
                        </a>
                    </div>
                    {/* Blog Icon */}
                    <div className="relative z-50">
                        <a href="https://blog.openadapt.ai" aria-label="Blog" title="Blog">
                            <FontAwesomeIcon
                                icon={faPen}
                                className="text-xl sm:text-2xl"
                            />
                        </a>
                    </div>
                    {/* Github Icon */}
                    <div className="relative z-50">
                        <a href="https://github.com/OpenAdaptAI/OpenAdapt" aria-label="Join us on Github" title="Join us on Github">
                            <FontAwesomeIcon
                                icon={faGithub}
                                className="text-xl sm:text-2xl"
                            />
                        </a>
                    </div>
                    {/* Discord Icon */}
                    <div className="relative z-50">
                        <a href="https://discord.gg/yF527cQbDG" aria-label="Join us on Discord" title="Join us on Discord">
                            <FontAwesomeIcon
                                icon={faDiscord}
                                className="text-xl sm:text-2xl"
                            />
                        </a>
                    </div>
                    {/* X Icon */}
                    <div className="relative z-50">
                        <a href="https://x.com/OpenAdaptAI" aria-label="Join us on X" title="Join us on X">
                            <FontAwesomeIcon
                                icon={faXTwitter}
                                className="text-xl sm:text-2xl"
                            />
                        </a>
                    </div>
                    {/* LinkedIn Icon */}
                    <div className="relative z-50">
                        <a
                            href="https://www.linkedin.com/company/95677624"
                            aria-label="Join us on LinkedIn" title="Join us on LinkedIn"
                        >
                            <FontAwesomeIcon
                                icon={faLinkedin}
                                className="text-xl sm:text-2xl"
                            />
                        </a>
                    </div>
                    {/* Github Fork/Star buttons */}
                    <div className="relative z-50">
                        <a
                            className="github-button mr-2"
                            href="https://github.com/OpenAdaptAI/OpenAdapt/fork"
                            data-color-scheme="no-preference: dark_high_contrast; light: dark_high_contrast; dark: dark;"
                            data-icon="octicon-repo-forked"
                            data-size="large"
                            data-show-count="true"
                            aria-label="Fork OpenAdaptAI/OpenAdapt on GitHub"
                        >
                            Fork
                        </a>
                    </div>
                    <div className="relative z-50">
                        <a
                            className="github-button"
                            href="https://github.com/OpenAdaptAI/OpenAdapt"
                            data-color-scheme="no-preference: dark_high_contrast; light: dark_high_contrast; dark: dark;"
                            data-icon="octicon-star"
                            data-size="large"
                            data-show-count="true"
                            aria-label="Star OpenAdaptAI/OpenAdapt on GitHub"
                        >
                            Star
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}
