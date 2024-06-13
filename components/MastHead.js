import dynamic from 'next/dynamic'
import React, { useState } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowPointer } from '@fortawesome/free-solid-svg-icons'
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
import EmailForm from '@components/EmailForm'

import styles from './MastHead.module.css'

// Import the Sketch component dynamically and set ssr to false
const SketchNoSSR = dynamic(() => import('./Sketch'), {
    ssr: false,
})

export default function Home() {
    const [feedbackData, setFeedbackData] = useState({
        name: '',
        email: '',
        message: '',
    })

    return (
        <div className={styles.section}>
            <div className="relative flex items-center justify-center">
                <div className="relative z-30 py-5 text-2xl">
                    <div className="text-center pt-6">
                        <div className="grid grid-flow-row auto-rows-max">
                            <h1 className="text-6xl mb-6 md:text-7xl">
                                <span className="font-thin">Open</span>Adapt
                                <span className="font-thin">.AI</span>
                            </h1>
                            <h2 className="text-4xl mt-0 mb-8 font-extralight">
                                AI for Desktops.
                            </h2>
                            <div className="flex flex-col align-items-center justify-content-center">
                                <div className="relative inline-block">
                                    {/* <AnimatedLogo /> */}
                                    <iframe
                                      width="560"
                                      height="315"
                                      src="https://www.youtube.com/embed/OVERugs50cQ?si=5Mh_B9V7NFV0aKY8"
                                      title="YouTube video player"
                                      frameborder="0"
                                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                      referrerpolicy="strict-origin-when-cross-origin"
                                      allowfullscreen>
                                    </iframe>
                                </div>
                            </div>
                            <h3 className="mt-8 font-light">
                                <span className="inline-block p-2">
                                    Automate your workflows.
                                </span>
                                <br />
                                <span className="inline-block p-2">
                                    Record, replay, and share.
                                </span>
                                <br />
                                <span className="bg-white bg-opacity-20 inline-block p-2">
                                    <b>No programming required.</b>
                                </span>
                            </h3>
                            <div id="register">
                                <div>
                                    <Link
                                        className="btn bg-transparent border-2 border-blue-400 text-blue-400 hover:border-blue-300 hover:text-blue-300 mt-10 mb-6 hover:bg-transparent"
                                        href="#industries"
                                    >
                                        Learn How
                                    </Link>
                                    <Link
                                        className="btn btn-primary mt-10 mb-6 ml-3"
                                        href="#start"
                                    >
                                        Get Started
                                    </Link>
                                </div>
                            </div>
                            <EmailForm />
                        </div>
                    </div>
                </div>
                {/* <AnimatedBackground /> */}
                <div className="fixed top-0 right-0 z-50">
                    {/* Github Icon */}
                    <div
                        className="relative z-50 inline-block mr-3"
                        style={{ transform: 'translateY(-5px)' }}
                    >
                        <a href="https://github.com/OpenAdaptAI" aria-label="X">
                            <FontAwesomeIcon
                                icon={faGithub}
                                className="text-2xl"
                            />
                        </a>
                    </div>
                    {/* Discord Icon */}
                    <div
                        className="relative z-50 inline-block mr-3"
                        style={{ transform: 'translateY(-5px)' }}
                    >
                        <a href="https://discord.gg/yF527cQbDG" aria-label="X">
                            <FontAwesomeIcon
                                icon={faDiscord}
                                className="text-2xl"
                            />
                        </a>
                    </div>
                    {/* X Icon */}
                    <div
                        className="relative z-50 inline-block mr-3"
                        style={{ transform: 'translateY(-5px)' }}
                    >
                        <a href="https://x.com/OpenAdaptAI" aria-label="X">
                            <FontAwesomeIcon
                                icon={faXTwitter}
                                className="text-2xl"
                            />
                        </a>
                    </div>
                    {/* LinkedIn Icon */}
                    <div
                        className="relative z-50 inline-block mr-3"
                        style={{ transform: 'translateY(-5px)' }}
                    >
                        <a
                            href="https://www.linkedin.com/company/95677624"
                            aria-label="LinkedIn"
                        >
                            <FontAwesomeIcon
                                icon={faLinkedin}
                                className="text-2xl"
                            />
                        </a>
                    </div>
                    {/* Github icons */}
                    <div className="relative z-50 inline-block mr-2 mt-2">
                        <a
                            className="github-button mr-2"
                            href="https://github.com/MLDSAI/OpenAdaptAI/fork"
                            data-color-scheme="no-preference: dark_high_contrast; light: dark_high_contrast; dark: dark;"
                            data-icon="octicon-repo-forked"
                            data-size="large"
                            data-show-count="true"
                            aria-label="Fork MLDSAI/OpenAdaptAI on GitHub"
                        >
                            Fork
                        </a>
                    </div>
                    <div className="relative z-50 inline-block mr-2 mt-2">
                        <a
                            className="github-button"
                            href="https://github.com/MLDSAI/OpenAdaptAI"
                            data-color-scheme="no-preference: dark_high_contrast; light: dark_high_contrast; dark: dark;"
                            data-icon="octicon-star"
                            data-size="large"
                            data-show-count="true"
                            aria-label="Star MLDSAI/OpenAdaptAI on GitHub"
                        >
                            Star
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}
