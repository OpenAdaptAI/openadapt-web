import Image from 'next/image';

import styles from './Footer.module.css'

export default function Footer() {
    return (
        <div className={styles.section} style={{backgroundColor: '#00001c'}}>
            <div className="relative flex items-center justify-center mb-10 mx-10 md-12">
                <div className="grid grid-cols-1 break-words">
                    <h2 id="start" className="text-2xl mt-10 font-light">Getting Started</h2>
                        <h3 className="mt-5"><b>Windows</b></h3>
                        <ul className="mt-2 list-disc list-inside font-light">
                            <li>Press Windows Key, type "powershell", and press Enter</li>
                            <li>Copy and paste the following command into the terminal, and press Enter:</li>
                        </ul>
                        <pre className="whitespace-pre-wrap code text-slate-600 bg-slate-100 p-3 m-2" style={{backgroundColor: '#f8f6ff'}}>
                            powershell -noexit -ExecutionPolicy Bypass -Command "iwr -UseBasicParsing -Uri 'https://raw.githubusercontent.com/OpenAdaptAI/install/HEAD/install_puterbot.ps1' | Invoke-Expression"
                        </pre>
                        <h3 className="mt-5"><b>MacOS</b></h3>
                        <ul className="mt-2 list-disc list-inside font-light">
                            <li>
                                Download and install <a href="https://git-scm.com/download/" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                                    Git
                                </a> and <a href="https://www.python.org/downloads/" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                                    Python 3.10
                                </a>
                            </li>
                            <li>Press Command+Space, type "terminal", and press Enter</li>
                            <li>Copy and paste the following command into the terminal, and press Enter:</li>
                        </ul>
                        <pre className="whitespace-pre-wrap code text-slate-600 bg-slate-100 p-3 m-2" style={{backgroundColor: '#f8f6ff'}}>
                            /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/OpenAdaptAI/install/HEAD/install_puterbot.sh)"
                        </pre>
                    <h2 className="text-2xl mt-10 font-light">What's Next?</h2>
                        <li className="mt-2 font-light">
                            <a
                                className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                href="https://github.com/MLDSAI/OpenAdapt#run"
                            >
                                Read our usage instructions
                            </a>
                        </li>
                        <li className="mt-2 font-light">
                            <a
                                className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                href="https://join.slack.com/t/mldsai/shared_invite/zt-1uf94nn7r-qcQnS~hinLPKftUapNzbuw"
                            >
                            Join us on Slack
                            </a>
                        </li>
                    <h2 className="text-2xl mt-10 font-light">Troubleshooting</h2>
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
            <footer className="grid grid-flow-row auto-rows-max" style={{backgroundColor: '#00001a'}}>
				<Image
				className="invert m-auto my-6"
				priority
				src="/images/favicon.svg"
				height={32}
				width={32}
				alt="Large Language Model"
				/>
          </footer>
        </div>
    )
}
