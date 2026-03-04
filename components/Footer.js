import React, { useState } from 'react'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowPointer } from '@fortawesome/free-solid-svg-icons'

import styles from './Footer.module.css'

export default function Footer() {
    const currentYear = new Date().getFullYear()

    // Function to handle the reveal of the email address
    const revealEmail = () => {
        // Construct the email address and open in mail client
        const user = 'hello'
        const domain = 'openadapt.ai'
        window.location.href = `mailto:${user}@${domain}`
    }

    return (
        <div className={styles.footerContainer}>
            <footer className="grid grid-flow-row auto-rows-max gap-3 max-w-4xl mx-auto">
                <div className="m-auto pb-4">
                    <div className="flex items-center justify-center z-10 opacity-60">
                        <Image
                            className="invert"
                            priority
                            src="/images/favicon.svg"
                            height={24}
                            width={24}
                            alt="OpenAdapt"
                        />
                        <FontAwesomeIcon
                            icon={faArrowPointer}
                            className="ml-1 text-white/65 text-sm"
                        />
                    </div>
                </div>
                <iframe
                    src="https://github.com/sponsors/OpenAdaptAI/button"
                    title="Sponsor OpenAdaptAI"
                    height="32"
                    width="114"
                    style={{ border: '0', borderRadius: '6px' }}
                    className="mx-auto mb-4"
                ></iframe>
                <div className={styles.footerContent}>
                    <div className={`${styles.footerLinks} pt-4`}>
                        <a onClick={revealEmail} className={styles.link}>
                            Contact
                        </a>
                    </div>
                    <div className={styles.footerLinks}>
                        <a href="/privacy-policy" className={styles.link}>
                            Privacy Policy
                        </a>{' '}
                        <a href="/terms-of-service" className={styles.link}>
                            Terms of Service
                        </a>
                    </div>
                    <div className={styles.footerLinks}>
                        <a
                            href="https://docs.openadapt.ai"
                            className={styles.link}
                        >
                            Docs
                        </a>
                        <a
                            href="https://blog.openadapt.ai"
                            className={styles.link}
                        >
                            Blog
                        </a>
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
                    <p className="mt-6 text-white/60 text-xs">
                        © 2023–{currentYear} OpenAdapt.AI and MLDSAI Inc. All
                        rights reserved.
                    </p>
                    <p className="text-white/60 text-xs">
                        Our software is open source and licensed under the MIT
                        License.
                    </p>
                </div>
            </footer>
        </div>
    )
}
