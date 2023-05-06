import Link from "next/link"
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
                            <div>
                                <Link className="btn btn-primary ml-2 mt-2" href="#start"  scroll={false}>
                                    Get Started
                                </Link>
                            </div>
                            <h3 className="my-12 mb-20 font-light">
                                <span className="inline-block p-2">
                                    Automate your workflows.
                                </span>
                                <br/>
                                <span className="inline-block p-2 -my-2">
                                    Record, replay, and share.
                                </span>
                                <br />
                                <span className="bg-white bg-opacity-20 inline-block p-2">
                                    <b>No programming required.</b>
                                </span>
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
            <div className="relative flex items-center justify-center mb-2 mx-2 md-12">
                <div className="grid grid-cols-1 break-words">
                    <h2 id="start" className="text-2xl mt-10">Getting Started</h2>
                    <ol className="list-decimal list-inside">
                        <li className="mt-2">
                            <a href="https://git-scm.com/download/" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                                Download and install Git
                            </a>
                        </li>
                        <li className="mt-2">
                            <a href="https://www.python.org/downloads/" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                                Download and install Python
                            </a>
                        </li>
                        <li className="mt-2">
                            Download and install PuterBot:

                            <h3 className="mt-5"><b>Windows</b></h3>
                            <ul className="mt-5 list-disc list-inside">
                                <li>Download and install <a
                                    href="https://aka.ms/vs/17/release/vs_BuildTools.exe"
                                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                >Visual Studio Build Tools</a> (select "Desktop development with C++")</li>
                                <li>Press Windows Key, type "powershell", and press Enter</li>
                                <li>Copy and paste the following command into the terminal, and press Enter:</li>
                            </ul>
                            <pre className="whitespace-pre-wrap code bg-slate-100 p-3 m-2">
                                powershell -ExecutionPolicy Bypass -Command "iwr -UseBasicParsing -Uri 'https://raw.githubusercontent.com/OpenAdaptAI/install/HEAD/install_puterbot.ps1' | Invoke-Expression"
                            </pre>

                            <h3 className="mt-5"><b>MacOS</b></h3>
                            <ul className="mt-5 list-disc list-inside">
                                <li>Press Command+Space, type "terminal", and press Enter</li>
                                <li>Copy and paste the following command into the terminal, and press Enter:</li>
                            </ul>
                            <pre className="whitespace-pre-wrap code bg-slate-100 p-3 m-2">
                                /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/OpenAdaptAI/install/HEAD/install_puterbot.sh)"
                            </pre>

                        </li>
                    </ol> 
                    <h2 className="text-2xl mt-10">What's Next?</h2>
                        <li className="mt-2">
                            <a
                                className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                href="https://github.com/MLDSAI/puterbot#run"
                            >
                                Read our usage instructions
                            </a>
                        </li>
                        <li className="mt-2">
                            <a
                                className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                href="https://join.slack.com/t/mldsai/shared_invite/zt-1uf94nn7r-qcQnS~hinLPKftUapNzbuw"
                            >
                            Join us on Slack
                            </a>
                        </li>
                    <h2 className="text-2xl mt-10">Troubleshooting</h2>
                    <p>
                        If you have any questions, please <a
                            className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                            href="https://github.com/MLDSAI/puterbot/issues/new"
                        >
                            Submit an issue to our Github
                        </a>
                    </p>
                </div>
            </div>
        </div>
        </>
    )
}
