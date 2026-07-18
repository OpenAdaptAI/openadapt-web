import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowPointer } from '@fortawesome/free-solid-svg-icons'

import {
    OPENADAPT_REPOSITORY_URL,
    OPENADAPT_STATS_SNAPSHOT,
} from 'data/repositoryStats'
import { track, EVENTS } from 'utils/analytics'
import styles from './Footer.module.css'

function validStats(value) {
    return (
        value &&
        Number.isInteger(value.stars) &&
        value.stars > 0 &&
        Number.isInteger(value.forks) &&
        value.forks >= 0
    )
}

function snapshotLabel(stats) {
    if (stats.source === 'github' && !stats.stale) {
        return 'GitHub · refreshed recently'
    }
    if (stats.source === 'stale') {
        return 'GitHub · last-known counts'
    }
    return 'GitHub snapshot · refreshed when available'
}

export default function Footer({ repositoryStats = OPENADAPT_STATS_SNAPSHOT }) {
    const router = useRouter()
    const currentYear = new Date().getFullYear()
    const isHome = router.pathname === '/'
    const bookHref = isHome ? '#book' : '/book'
    const contactHref = isHome ? '#book' : '/contact'
    const [stats, setStats] = useState(
        validStats(repositoryStats)
            ? repositoryStats
            : OPENADAPT_STATS_SNAPSHOT
    )

    useEffect(() => {
        const controller = new AbortController()
        fetch('/api/repository-stats', {
            headers: { Accept: 'application/json' },
            signal: controller.signal,
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(
                        `Repository stats request failed: ${response.status}`
                    )
                }
                return response.json()
            })
            .then((nextStats) => {
                if (validStats(nextStats)) setStats(nextStats)
            })
            .catch(() => {
                // Keep the server-rendered snapshot/last-known value.
            })
        return () => controller.abort()
    }, [])

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
                <div className={styles.repositoryProof}>
                    <iframe
                        src="https://github.com/sponsors/OpenAdaptAI/button"
                        title="Sponsor OpenAdaptAI"
                        height="32"
                        width="114"
                        style={{ border: '0', borderRadius: '6px' }}
                    ></iframe>
                    <div
                        className={styles.repositoryStats}
                        data-testid="footer-repository-stats"
                    >
                        <a
                            href={OPENADAPT_REPOSITORY_URL}
                            className={styles.repositoryStat}
                            aria-label={`${stats.stars.toLocaleString('en-US')} stars on OpenAdapt`}
                        >
                            <span aria-hidden="true">★</span>
                            <strong data-testid="footer-star-count">
                                {stats.stars.toLocaleString('en-US')}
                            </strong>
                            <small>stars on OpenAdapt</small>
                        </a>
                        <a
                            href={`${OPENADAPT_REPOSITORY_URL}/fork`}
                            className={styles.repositoryStat}
                            aria-label={`${stats.forks.toLocaleString('en-US')} forks of OpenAdapt`}
                        >
                            <span aria-hidden="true">⑂</span>
                            <strong data-testid="footer-fork-count">
                                {stats.forks.toLocaleString('en-US')}
                            </strong>
                            <small>forks</small>
                        </a>
                    </div>
                    <p
                        className={styles.repositorySource}
                        data-testid="footer-repository-source"
                    >
                        {snapshotLabel(stats)}
                    </p>
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
                            Evaluate a workflow
                        </a>
                        <a href={contactHref} className={styles.link}>
                            Contact
                        </a>
                        <a
                            href="mailto:hello@openadapt.ai"
                            className={styles.link}
                        >
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
                        <a href="/solutions/insurance" className={styles.link}>
                            Insurance
                        </a>
                        <a href="/compare" className={styles.link}>
                            Compare
                        </a>
                        <a href="/#product-status" className={styles.link}>
                            How it runs
                        </a>
                        <a href="/download" className={styles.link}>
                            Download
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
                            Privacy Notice
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
                            href="https://app.openadapt.ai"
                            className={styles.link}
                        >
                            Hosted dashboard (beta)
                        </a>
                        <a
                            href="https://github.com/OpenAdaptAI/OpenAdapt"
                            className={styles.link}
                            onClick={() =>
                                track(EVENTS.GITHUB_CLICK, {
                                    location: 'footer',
                                })
                            }
                        >
                            OpenAdapt project
                        </a>
                        <a
                            href="https://github.com/OpenAdaptAI/openadapt-flow"
                            className={styles.link}
                            onClick={() =>
                                track(EVENTS.GITHUB_CLICK, {
                                    location: 'footer_engine',
                                })
                            }
                        >
                            Compiler/runtime source
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
