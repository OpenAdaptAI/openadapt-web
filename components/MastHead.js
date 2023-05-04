import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBoxOpen, faBrain } from '@fortawesome/free-solid-svg-icons'
import { motion } from "framer-motion"



import EmailForm from '@components/EmailForm'


import styles from './MastHead.module.css'

export default function Home() {
    return (
        <div className={styles.section}>
            <div className="relative flex items-center justify-center h-screen overflow-hidden">
                <div className="relative z-30 p-5 text-2xl">
                    <div className="hero-content text-center">
                        <div className="grid grid-flow-row auto-rows-max">
                            <h1 className="text-6xl mb-8 md:text-7xl">
                                <span className="font-thin">Open</span>Adapt
                                <span className="font-thin">.AI</span>
                            </h1>
                            <div className="flex flex-col align-items-center justify-content-center mr-2">
                                <motion.div
                                    animate={{
                                        y: [-3, 3, -3]
                                    }}
                                    transition={{
                                      duration: 2,
                                      ease: "easeInOut",
                                      times: [0, .5, 1],
                                      repeat: Infinity,
                                      repeatDelay: 0,
                                    }}
                                >
                                    <FontAwesomeIcon icon={faBrain} className="text-5xl mb-2" />
                                </motion.div>
                                <FontAwesomeIcon icon={faBoxOpen} className="text-5xl" />
                            </div>
                            <h2 className="text-4xl my-12 font-extralight">
                                AI for Humans.
                            </h2>
                            <h3 className="my-12 mb-20 font-light">
                                Let's Adapt and Share.
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
