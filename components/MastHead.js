import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBoxOpen, faBrain } from '@fortawesome/free-solid-svg-icons'
import { motion } from "framer-motion"

import EmailForm from '@components/EmailForm'

import styles from './MastHead.module.css'

export default function Home() {
    return (
        <>
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
                                Automate your workflows. <br/>
                                No programming required. <br />
                                Record, play, and share.
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
        <div className={styles.section}>
            <div className="relative flex items-center justify-center mb-20 mx-20">
                <div>
                    <h2 className="text-2xl mt-10">Getting Started</h2>
                    <ol className="list-decimal">
                        <li className="mt-2">
                            <a
                                className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                href="https://join.slack.com/t/mldsai/shared_invite/zt-1uf94nn7r-qcQnS~hinLPKftUapNzbuw"
                            >
                            Join us on Slack
                            </a>
                        </li>


                        <li className="mt-2">
                            Download and install Git:
                            <br/>
                            <a href="https://git-scm.com/download/" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                                https://git-scm.com/download/
                            </a>
                        </li>
                        <li className="mt-2">
                            Download and install Python:
                            <br/>
                            <a href="https://www.python.org/downloads/" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                                https://www.python.org/downloads/
                            </a>
                        </li>
                        <li className="mt-2">
                            Download and install PuterBot:

                            <h3 className="mt-5"><b>Windows</b></h3>
                            <ul className="mt-5">
                                <li>press WINKEY, type "powershell", and press Enter</li>
                                <li>copy and paste the following command into the terminal, then press Enter:</li>
                            </ul>
                            <pre className="whitespace-pre-wrap code bg-slate-100 p-5">
                                powershell -ExecutionPolicy Bypass -Command "iwr -UseBasicParsing -Uri 'https://raw.githubusercontent.com/OpenAdaptAI/install/HEAD/install_puterbot.ps1' | Invoke-Expression"
                            </pre>

                            <h3 className="mt-5"><b>MacOS</b></h3>
                            <ul className="mt-5">
                                <li>press CMD+Space, type "terminal" and press Enter</li>
                                <li>copy and paste the following command into the terminal, then press Enter:</li>
                            </ul>
                            <pre className="whitespace-pre-wrap code bg-slate-100 p-5">
                                /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/OpenAdaptAI/install/HEAD/install_puterbot.sh)"
                            </pre>

                        </li>
                    </ol> 
                    <h2 className="text-2xl mt-10">Troubleshooting</h2>

                    <p>If you experience any issue, please post an issue to our Github:</p>
                    <p>
                        <a href="https://github.com/MLDSAI/puterbot/issues/new"
                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline">https://github.com/MLDSAI/puterbot/issues/new</a></p>
                </div>
            </div>
        </div>
        </>
    )
}
