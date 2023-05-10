import Link from "next/link"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBoxOpen, faBrain } from '@fortawesome/free-solid-svg-icons'
import { motion } from "framer-motion"
import Image from 'next/image';

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
                            <h1 className="text-6xl mb-6 md:text-7xl">
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
                                    {/*
                                    <FontAwesomeIcon icon={faBrain} className="text-5xl mb-2" />
                                    <Image
                                      className="hue-rotate-90 invert text-center inline absolute -ml-4 -mt-10"
                                      priority
                                      src="/images/favicon.svg"
                                      height={64}
                                      width={64}
                                      alt="Large Language Model"
                                    />
                                    */}
                                    <Image
                                      className="invert text-center inline"
                                      priority
                                      src="/images/favicon.svg"
                                      height={64}
                                      width={64}
                                      alt="Large Language Model"
                                    />
                                </motion.div>
                                <FontAwesomeIcon icon={faBoxOpen} className="text-5xl" />
                            </div>
                            <h2 className="text-4xl my-10 font-extralight">
                                AI for Humans.
                            </h2>
                            <div>
                                <Link className="btn btn-primary ml-2 mt-2" href="#start">
                                    Get Started
                                </Link>
                            </div>
                            <h3 className="my-10 font-light">
                                <span className="inline-block p-2">
                                    Automate your workflows.
                                </span>
                                <br/>
                                <span className="inline-block p-2 -my-2">
                                    Record, replay, and share.
                                </span>
                                <br />
                                <span className="bg-white bg-opacity-20 inline-block p-2 py-0">
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
                <div className="absolute top-0 right-0 z-50">
                    <div className="relative z-50 inline-block mr-2 mt-2">
                        <a className="github-button mr-2" href="https://github.com/MLDSAI/OpenAdaptAI/fork" data-color-scheme="no-preference: dark_high_contrast; light: dark_high_contrast; dark: dark;" data-icon="octicon-repo-forked" data-size="large" data-show-count="true" aria-label="Fork MLDSAI/OpenAdaptAI on GitHub">Fork</a>
                    </div>
                    <div className="relative z-50 inline-block mr-2 mt-2">
                        <a className="github-button" href="https://github.com/MLDSAI/OpenAdaptAI" data-color-scheme="no-preference: dark_high_contrast; light: dark_high_contrast; dark: dark;" data-icon="octicon-star" data-size="large" data-show-count="true" aria-label="Star MLDSAI/OpenAdaptAI on GitHub">Star</a>
                    </div>
                </div>
            </div>
            {/*
      <Footer />
      */}
        </div>
        <div className={styles.section}>
            <div className="relative flex items-center justify-center mb-2 mx-2 md-12">
                <div className="grid grid-cols-1 break-words">
                    <h2 id="start" className="text-2xl mt-10">Getting Started</h2>
                            <h3 className="mt-5"><b>Windows</b></h3>
                            <ul className="mt-2 list-disc list-inside">
                                <li>Press Windows Key, type "powershell", and press Enter</li>
                                <li>Copy and paste the following command into the terminal, and press Enter:</li>
                            </ul>
                            <pre className="whitespace-pre-wrap code text-slate-600 bg-slate-100 p-3 m-2">
                                powershell -noexit -ExecutionPolicy Bypass -Command "iwr -UseBasicParsing -Uri 'https://raw.githubusercontent.com/OpenAdaptAI/install/HEAD/install_puterbot.ps1' | Invoke-Expression"
                            </pre>
                            <h3 className="mt-5"><b>MacOS</b></h3>
                            <ul className="mt-2 list-disc list-inside">
                                <li>
                                    Download and install 
                                    <a href="https://git-scm.com/download/" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                                        Git
                                    </a>
                                    and
                                    <a href="https://www.python.org/downloads/" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                                        Python 3.10
                                    </a>
                                </li>
                                <li>Press Command+Space, type "terminal", and press Enter</li>
                                <li>Copy and paste the following command into the terminal, and press Enter:</li>
                            </ul>
                            <pre className="whitespace-pre-wrap code text-slate-600 bg-slate-100 p-3 m-2">
                                /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/OpenAdaptAI/install/HEAD/install_puterbot.sh)"
                            </pre>
                    <h2 className="text-2xl mt-10">What's Next?</h2>
                        <li className="mt-2">
                            <a
                                className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                href="https://github.com/MLDSAI/OpenAdapt#run"
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
                        Please <a
                            className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                            href="https://github.com/MLDSAI/OpenAdapt/issues/new"
                        >
                            submit an issue to our Github
                        </a>.
                    </p>
                </div>
            </div>
        </div>
          <footer className="grid grid-flow-row auto-rows-max">
            <Image
              className="m-auto my-6"
              priority
              src="/images/favicon.svg"
              height={32}
              width={32}
              alt="Large Language Model"
            />
          </footer>
        </>
    )
}
