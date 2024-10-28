import React, { useState } from 'react'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import AnimatedBackground from './AnimatedBackground'

import styles from './Footer.module.css'

export default function Footer() {
    const currentYear = new Date().getFullYear()

    const revealEmail = () => {
        const user = 'hello'
        const domain = 'openadapt.ai'
        window.location.href = `mailto:${user}@${domain}`
    }

    return (
        <div className={styles.footerContainer}>
            <AnimatedBackground /> {/* Background animation component */}
            <div className={styles.overlay}></div> {/* Dark overlay for readability */}
            <footer className="relative grid grid-flow-row auto-rows-max gap-4 z-30">
                <div className="m-auto pb-10">
                    <div className="flex items-center justify-center z-30">
                        <Image
                            className="invert"
                            priority
                            src="/images/favicon.svg"
                            height={32}
                            width={32}
                            alt="Large Language Model"
                        />
                        <FontAwesomeIcon
                            icon={faArrowPointer}
                            className="ml-1 text-white"
                        />
                    </div>
                </div>
                <iframe
                    src="https://github.com/sponsors/OpenAdaptAI/button"
                    title="Sponsor OpenAdaptAI"
                    height="32"
                    width="114"
                    style={{ border: '0', borderRadius: '6px' }}
                    className="mx-auto mb-10"
                ></iframe>
                <div className={styles.footerContent}>
                    <div className={`${styles.footerLinks} pt-20`}>
                        <a
                            href="https://github.com/OpenAdaptAI/OpenAdapt?tab=readme-ov-file#-open-contract-positions-at-openadaptai"
                            className={styles.link}
                        >
                            Careers
                        </a>
                        <a onClick={revealEmail} className={styles.link}>
                            Contact
                        </a>
                    </div>
                    <div className={styles.footerLinks}>
                        <a href="/privacy-policy" className={styles.link}>
                            Privacy Policy
                        </a>
                        <a href="/terms-of-service" className={styles.link}>
                            Terms of Service
                        </a>
                    </div>
                    <div className={styles.footerLinks}>
                        <a
                            href="https://github.com/OpenAdaptAI"
                            className={styles.link}
                        >
                            GitHub
                        </a>
                        <a
                            href="https://discord.gg/yF527cQbDG"
                            className={styles.link}
                        >
                            Discord
                        </a>
                        <a
                            href="https://x.com/OpenAdaptAI"
                            className={styles.link}
                        >
                            X
                        </a>
                        <a
                            href="https://www.linkedin.com/company/95677624"
                            className={styles.link}
                        >
                            LinkedIn
                        </a>
                    </div>
                    <p className="mt-10">
                        © 2023–{currentYear} OpenAdapt.AI and MLDSAI Inc. All
                        rights reserved.
                    </p>
                    <p>
                        Our software is open source and licensed under the MIT
                        License.
                    </p>
                </div>
            </footer>
        </div>
    )
}
