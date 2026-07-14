import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowPointer } from '@fortawesome/free-solid-svg-icons'

import { track, EVENTS } from 'utils/analytics'
import styles from './Footer.module.css'

export default function Footer() {
    const router = useRouter()
    const currentYear = new Date().getFullYear()
    const isHome = router.pathname === '/'
    const bookHref = isHome ? '#book' : '/book'
    const contactHref = isHome ? '#book' : '/contact'

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
                    <div className="flex items-center justify-center z-10 opacity-70">
                        <Image
                            className=""
                            priority
                            src="/images/favicon.svg"
                            height={24}
                            width={24}
                            alt="OpenAdapt"
                        />
                        <FontAwesomeIcon
                            icon={faArrowPointer}
                            className="ml-1 text-ink-3 text-sm"
                        />
                    </div>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
                    <iframe
                        src="https://github.com/sponsors/OpenAdaptAI/button"
                        title="Sponsor OpenAdaptAI"
                        height="32"
                        width="114"
                        style={{ border: '0', borderRadius: '6px' }}
                    ></iframe>
                    <a
                        className="github-button"
                        href="https://github.com/OpenAdaptAI/OpenAdapt"
                        data-color-scheme="no-preference: light; light: light; dark: light;"
                        data-icon="octicon-star"
                        data-size="large"
                        data-show-count="true"
                        aria-label="Star OpenAdaptAI/OpenAdapt on GitHub"
                    >
                        Star
                    </a>
                    <a
                        className="github-button"
                        href="https://github.com/OpenAdaptAI/OpenAdapt/fork"
                        data-color-scheme="no-preference: light; light: light; dark: light;"
                        data-icon="octicon-repo-forked"
                        data-size="large"
                        data-show-count="true"
                        aria-label="Fork OpenAdaptAI/OpenAdapt on GitHub"
                    >
                        Fork
                    </a>
                </div>
                <div className={styles.footerContent}>
                    <div className={`${styles.footerLinks} pt-4`}>
                        <a
                            href={bookHref}
                            className={styles.link}
                            onClick={() =>
                                track(EVENTS.BOOK_PILOT_CLICK, {
                                    location: 'footer',
                                })
                            }
                        >
                            Book a Call
                        </a>
                        <a href={contactHref} className={styles.link}>
                            Contact
                        </a>
                        <a onClick={revealEmail} className={styles.link}>
                            Email
                        </a>
                    </div>
                    <div className={styles.footerLinks}>
                        <a href="/solutions/healthcare" className={styles.link}>
                            Healthcare
                        </a>
                        <a href="/solutions/lending" className={styles.link}>
                            Lending
                        </a>
                        <a href="/compare" className={styles.link}>
                            Compare
                        </a>
                        <a href="/about" className={styles.link}>
                            About
                        </a>
                    </div>
                    <div className={styles.footerLinks}>
                        <a href="/security" className={styles.link}>
                            Security
                        </a>{' '}
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
                            onClick={() =>
                                track(EVENTS.DOCS_CLICK, { location: 'footer' })
                            }
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
                            onClick={() =>
                                track(EVENTS.GITHUB_CLICK, {
                                    location: 'footer',
                                })
                            }
                        >
                            GitHub
                        </a>
                        <a
                            href="https://discord.gg/yF527cQbDG"
                            className={styles.link}
                            onClick={() =>
                                track(EVENTS.DISCORD_CLICK, {
                                    location: 'footer',
                                })
                            }
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
                    <p className="mt-6 text-ink-3 text-xs">
                        © 2023–{currentYear} OpenAdapt.AI and MLDSAI Inc. All
                        rights reserved.
                    </p>
                    <p className="text-ink-3 text-xs">
                        Our software is open source and licensed under the MIT
                        License.
                    </p>
                </div>
            </footer>
        </div>
    )
}
