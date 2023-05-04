import { useEffect, useRef } from 'react'

import Head from 'next/head'
import Header from '@components/Header'
import Footer from '@components/Footer'
import EmailForm from '@components/EmailForm'
import JokeBlock from '@components/JokeBlock'

import styles from './index.module.css'

export default function Home() {
    const videoRef = useRef()

    useEffect(() => {
        if (videoRef.current) {
            //videoRef.current.playbackRate = 0.5;
        }
    }, [])
    return (
        <div className={styles.section}>
            <header className="relative flex items-center justify-center h-screen mb-12 overflow-hidden">
                <div className="relative z-30 p-5 text-2xl">
                    <div className="hero-content text-center text-neutral-content">
                        <div className="grid grid-flow-row auto-rows-max">
                            <h1 className="text-7xl mb-8">
                                <span className="font-thin">Open</span>Adapt
                                <span className="font-thin">.AI</span>
                            </h1>
                            <h2 className="text-4xl my-12 font-extralight">
                                Empowering Humans to Build AI Solutions
                            </h2>
                            <h3 className="text-lg md:text-xl my-8 mb-12 font-light">
                                Unleash the power of cutting-edge AI with zero
                                effort.
                            </h3>
                            <EmailForm />
                            <p className="text-sm mt-2 font-light opacity-70">
                                Register for updates (we promise not to spam)
                            </p>
                        </div>
                    </div>
                </div>
                <video
                    autoPlay
                    loop
                    muted
                    ref={videoRef}
                    className="absolute z-10 object-cover w-full h-full opacity-50"
                >
                    <source
                        src="http://mldsai.com/static/vid/bg.mp4"
                        type="video/mp4"
                    />
                    Your browser does not support the video tag.
                </video>
            </header>
            {/*
      <Footer />
      */}
        </div>
    )
}
