
import Head from 'next/head'

import EmailForm from '@components/EmailForm'

import styles from './MastHead.module.css'

export default function Home() {
    return (
        <div className={styles.section}>
            <div className="relative flex items-center justify-center h-screen overflow-hidden">
                <div className="relative z-30 p-5 text-2xl">
                    <div className="hero-content text-center">
                        <div className="grid grid-flow-row auto-rows-max">
                            <h1 className="text-7xl mb-8">
                                <span className="font-thin">Open</span>Adapt
                                <span className="font-thin">.AI</span>
                            </h1>
                            <h2 className="text-4xl my-12 font-extralight">
                                Empowering Humans to Build AI Solutions
                            </h2>
                            <h3 className="my-12 mb-20 font-light">
                                Unleash the power of cutting-edge AI with zero
                                effort.
                            </h3>
                            <EmailForm />
                        </div>
                    </div>
                </div>
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute z-10 object-cover w-full h-full opacity-50"
                >
                    <source
                        src="./hero.mp4"
                        type="video/mp4"
                    />
                    Your browser does not support the video tag.
                </video>
            </div>
            {/*
      <Footer />
      */}
        </div>
    )
}
