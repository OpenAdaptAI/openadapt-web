import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import React from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowPointer, faBook } from '@fortawesome/free-solid-svg-icons'
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

const CarouselSection = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const carouselItems = [
        "Show it once. Let it handle the rest.",
        "Perform, don't prompt.",
        "Works with Claude, GPT-4V, Gemini, and more.",
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
        <div className="relative h-12 w-full overflow-hidden">
            <div className="absolute w-full">
                {carouselItems.map((item, index) => (
                    <div
                        key={index}
                        className={`
                            absolute top-0 left-0 w-full
                            transform transition-all duration-300 ease-in-out
                            ${index === currentIndex ? 
                                'opacity-100 translate-y-0' : 
                                'opacity-0 translate-y-8'
                            }
                        `}
                    >
                        <span className="inline-block p-2 w-full text-center">
                            {item}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default function Home() {
    const videoRef = useRef(null)
    const [poster, setPoster] = useState('')

    useEffect(() => {
        const videoElement = videoRef.current

        if (videoElement) {
            // Create a separate video element just for poster generation
            const posterVideo = document.createElement('video')
            posterVideo.src = './demo.mp4'

            // When poster video loads, seek to desired timestamp and capture frame
            posterVideo.addEventListener('loadeddata', () => {
                posterVideo.currentTime = 80 // Keep poster timestamp at 80 seconds
                posterVideo.addEventListener('seeked', () => {
                    const canvas = document.createElement('canvas')
                    canvas.width = posterVideo.videoWidth
                    canvas.height = posterVideo.videoHeight
                    const ctx = canvas.getContext('2d')
                    ctx.drawImage(posterVideo, 0, 0, canvas.width, canvas.height)
                    const dataURI = canvas.toDataURL('image/jpeg')
                    setPoster(dataURI)

                    // Clean up the poster video element
                    posterVideo.remove()
                })
            })
        }
    }, [])

    return (
        <div className={styles.section}>
            <div className="relative flex items-center justify-center">
                <div className="relative z-30 py-5 px-4 text-2xl w-full">
                    <div className="text-center pt-6">
                        <div className="grid grid-flow-row auto-rows-max">
                            <h1 className="text-6xl mb-6 md:text-7xl">
                                <span className="font-thin">Open</span>Adapt
                                <span className="font-thin">.AI</span>
                            </h1>
                            <h2 className="text-4xl mt-0 mb-8 font-extralight">
                                Teach AI to use any software.
                            </h2>
                            <div className="flex flex-col align-center justify-center">
                                <div className="relative inline-block">
                                    {/* <AnimatedLogo /> */}
                                    {/* Set poster image dynamically */}
                                    <video
                                        ref={videoRef}
                                        controls
                                        className="demo-video w-full max-w-[90%] sm:max-w-[80%] mx-auto"
                                        poster={poster} // Use the captured frame as the poster
                                    >
                                        <source src="./demo.mp4" type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                            </div>
                            <h3 className="mt-8 font-light">
                                <span className="bg-white bg-opacity-20 inline-block p-2">
                                    <b>Record demonstrations. Train models. Deploy agents.</b>
                                </span>
                                <br />
                                <CarouselSection />
                                <span className="bg-white bg-opacity-20 inline-block p-2">
                                    <b>Open source. Model agnostic. Run anywhere.</b>
                                </span>
                            </h3>
                            <div id="register">
                                <div>
                                    <Link
                                        className="btn btn-primary mt-10 mb-6"
                                        href="/demo"
                                    >
                                        Try It Now
                                    </Link>
                                    <Link
                                        className="btn bg-transparent border-2 border-blue-400 text-blue-400 hover:border-blue-300 hover:text-blue-300 mt-10 mb-6 ml-3 hover:bg-transparent"
                                        href="#industries"
                                    >
                                        Learn How
                                    </Link>
                                    <Link
                                        className="btn btn-outline mt-10 mb-6 ml-3"
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
                <div className="fixed top-0 right-0 z-50 flex flex-wrap items-center justify-end gap-2 p-2 max-w-full">
                    {/* Docs Icon */}
                    <div className="relative z-50">
                        <a href="https://docs.openadapt.ai" aria-label="Read our Documentation" title="Read our Documentation">
                            <FontAwesomeIcon
                                icon={faBook}
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
                        <a href="https://discord.gg/fEEBqRryep" aria-label="Join us on Discord" title="Join us on Discord">
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
                    {/* Github Fork/Star buttons - wrapped with flex */}
                    <div className="relative z-50 inline-block">
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
                    <div className="relative z-50 inline-block">
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
