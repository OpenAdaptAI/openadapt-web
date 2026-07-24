import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faGithub,
    faXTwitter,
    faLinkedinIn,
    faDiscord,
} from '@fortawesome/free-brands-svg-icons'
import { useRouter } from 'next/router'

import {
    OPENADAPT_REPOSITORY_URL,
    OPENADAPT_STATS_SNAPSHOT,
} from 'data/repositoryStats'
import { BLOG_LINK, DEVELOPER_LINKS } from 'data/developerLinks'
import useRepositoryStats from 'hooks/useRepositoryStats'
import { track, EVENTS } from 'utils/analytics'
import repositoryStatsView from 'utils/repositoryStatsView'
import repositoryStatsSelection from 'utils/repositoryStatsSelection'
import styles from './Footer.module.css'

const { sourceLabel } = repositoryStatsView
const { validStats } = repositoryStatsSelection

// The hosted control plane. Mirrors NEXT_PUBLIC_CLOUD_APP_URL (.env.example)
// and the top-nav "Sign in" destination so the two surfaces never drift.
const CLOUD_APP_URL = 'https://app.openadapt.ai'

// Official GitHub octicons (MIT-licensed, 16px) so the star/fork widget is a
// faithful lookalike of GitHub's own star/fork buttons, rendered entirely in
// our own markup. We deliberately avoid the third-party embed widget, which
// makes every visitor's browser call api.github.com.
function StarOcticon() {
    return (
        <svg
            viewBox="0 0 16 16"
            width="16"
            height="16"
            aria-hidden="true"
            focusable="false"
        >
            <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
        </svg>
    )
}

function ForkOcticon() {
    return (
        <svg
            viewBox="0 0 16 16"
            width="16"
            height="16"
            aria-hidden="true"
            focusable="false"
        >
            <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z" />
        </svg>
    )
}

function usePrefersReducedMotion() {
    const [reduced, setReduced] = useState(false)
    useEffect(() => {
        if (typeof window === 'undefined' || !window.matchMedia) return
        const media = window.matchMedia('(prefers-reduced-motion: reduce)')
        const update = () => setReduced(media.matches)
        update()
        media.addEventListener?.('change', update)
        return () => media.removeEventListener?.('change', update)
    }, [])
    return reduced
}

// The honest, live-ticking "GitHub · updated Ns ago" line. The relative time
// is recomputed locally (no network) on a gentle cadence: 1s normally so the
// seconds counter reads true, or 30s under prefers-reduced-motion so there is
// no visible per-second animation. The tick pauses while the tab is hidden and
// snaps to the current time when it returns. `suppressHydrationWarning` is the
// documented escape hatch for timestamps whose server and client renders may
// legitimately differ by a second.
function RepositorySource({ stats }) {
    const reducedMotion = usePrefersReducedMotion()
    const [now, setNow] = useState(() => Date.now())

    useEffect(() => {
        const cadence = reducedMotion ? 30 * 1000 : 1000
        let timer = null
        const tick = () => setNow(Date.now())
        const start = () => {
            if (document.visibilityState === 'hidden') return
            timer = setInterval(tick, cadence)
        }
        const onVisibility = () => {
            clearInterval(timer)
            if (document.visibilityState === 'visible') {
                tick()
                start()
            }
        }
        start()
        document.addEventListener('visibilitychange', onVisibility)
        return () => {
            clearInterval(timer)
            document.removeEventListener('visibilitychange', onVisibility)
        }
    }, [reducedMotion])

    const label = sourceLabel(stats, now)
    return (
        <p
            className={styles.repositorySource}
            data-testid="footer-repository-source"
        >
            {stats.observedAt ? (
                <time dateTime={stats.observedAt} suppressHydrationWarning>
                    {label}
                </time>
            ) : (
                label
            )}
        </p>
    )
}

// Attach the right funnel event to an external footer destination.
function externalEvent(href) {
    if (!href) return null
    if (href.includes('app.openadapt.ai')) return EVENTS.OPEN_CLOUD_APP_CLICK
    if (href.includes('github.com')) return EVENTS.GITHUB_CLICK
    if (href.includes('docs.openadapt.ai')) return EVENTS.DOCS_CLICK
    if (href.includes('discord.gg')) return EVENTS.DISCORD_CLICK
    return null
}

function FooterLink({ href, children, external }) {
    const isExternal = external ?? /^https?:\/\//.test(href)
    const event = isExternal ? externalEvent(href) : null
    return (
        <a
            href={href}
            className={styles.columnLink}
            {...(isExternal
                ? { target: '_blank', rel: 'noopener noreferrer' }
                : {})}
            onClick={
                event ? () => track(event, { location: 'footer' }) : undefined
            }
        >
            {children}
        </a>
    )
}

// Developer ecosystem destinations come from the single canonical source
// (data/developerLinks) so the footer can never drift from the top nav.
const byLabel = (label) => DEVELOPER_LINKS.find((item) => item.label === label)

// Build-time guard: fail loudly if the canonical list is renamed out from
// under the footer instead of silently dropping a column entry.
const DEVELOPER_COLUMN = [
    'Compiler/runtime source',
    'Docs',
    'Technical paper',
    'Report an issue',
].map((label) => {
    const link = byLabel(label)
    if (!link) throw new Error(`Missing canonical developer link: ${label}`)
    return link
})

const CONNECT_COLUMN = [
    BLOG_LINK,
    byLabel('Discord'),
    { label: 'GitHub', href: OPENADAPT_REPOSITORY_URL },
]

export default function Footer({
    repositoryStats = OPENADAPT_STATS_SNAPSHOT,
    pollRepositoryStats = true,
}) {
    const router = useRouter()
    const currentYear = new Date().getFullYear()
    const isHome = router.pathname === '/'
    const bookHref = isHome ? '#book' : '/book'
    const contactHref = isHome ? '#book' : '/contact'
    const polledStats = useRepositoryStats(repositoryStats, {
        enabled: pollRepositoryStats,
    })
    const stats = pollRepositoryStats
        ? polledStats
        : validStats(repositoryStats)
          ? repositoryStats
          : OPENADAPT_STATS_SNAPSHOT

    return (
        <div className={styles.footerContainer}>
            <footer className={styles.footer}>
                <div className={styles.top}>
                    <div className={styles.brand}>
                        <a href="/" className={styles.wordmark}>
                            <span className="font-extralight">Open</span>
                            <span className="font-semibold">Adapt</span>
                        </a>
                        <p className={styles.tagline}>
                            OpenAdapt compiles demonstrated GUI workflows into
                            deterministic, locally executable programs, and
                            halts when it can’t verify the result.
                        </p>
                        <a
                            href={bookHref}
                            className={styles.brandCta}
                            onClick={() =>
                                track(EVENTS.BOOK_PILOT_CLICK, {
                                    location: 'footer',
                                })
                            }
                        >
                            Evaluate a workflow
                        </a>
                        <div
                            className={styles.repositoryProof}
                            data-testid="footer-repository-stats"
                        >
                            <a
                                href={OPENADAPT_REPOSITORY_URL}
                                className={styles.ghButton}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`${stats.stars.toLocaleString(
                                    'en-US'
                                )} stars on OpenAdapt`}
                                onClick={() =>
                                    track(EVENTS.GITHUB_CLICK, {
                                        location: 'footer_star',
                                    })
                                }
                            >
                                <StarOcticon />
                                <span>Star</span>
                                <span className={styles.ghCount}>
                                    <strong data-testid="footer-star-count">
                                        {stats.stars.toLocaleString('en-US')}
                                    </strong>
                                </span>
                            </a>
                            <a
                                href={`${OPENADAPT_REPOSITORY_URL}/fork`}
                                className={styles.ghButton}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`${stats.forks.toLocaleString(
                                    'en-US'
                                )} forks of OpenAdapt`}
                                onClick={() =>
                                    track(EVENTS.GITHUB_CLICK, {
                                        location: 'footer_fork',
                                    })
                                }
                            >
                                <ForkOcticon />
                                <span>Fork</span>
                                <span className={styles.ghCount}>
                                    <strong data-testid="footer-fork-count">
                                        {stats.forks.toLocaleString('en-US')}
                                    </strong>
                                </span>
                            </a>
                        </div>
                        <RepositorySource stats={stats} />
                    </div>

                    <nav className={styles.columns} aria-label="Footer">
                        <div className={styles.column}>
                            <h2 className={styles.columnTitle}>Product</h2>
                            <ul className={styles.columnList}>
                                <li>
                                    <FooterLink href="/#product-status">
                                        How it runs
                                    </FooterLink>
                                </li>
                                <li>
                                    <FooterLink href="/workflows">
                                        Workflows
                                    </FooterLink>
                                </li>
                                <li>
                                    <FooterLink href="/templates">
                                        Templates
                                    </FooterLink>
                                </li>
                                <li>
                                    <FooterLink href="/compare">
                                        Compare
                                    </FooterLink>
                                </li>
                                <li>
                                    <FooterLink href="/safety">
                                        Safety
                                    </FooterLink>
                                </li>
                                <li>
                                    <FooterLink href="/download">
                                        Download
                                    </FooterLink>
                                </li>
                                <li>
                                    <FooterLink href="/#pricing">
                                        Pricing
                                    </FooterLink>
                                </li>
                            </ul>
                        </div>

                        <div className={styles.column}>
                            <h2 className={styles.columnTitle}>Solutions</h2>
                            <ul className={styles.columnList}>
                                <li>
                                    <FooterLink href="/solutions/healthcare">
                                        Healthcare
                                    </FooterLink>
                                </li>
                                <li>
                                    <FooterLink href="/solutions/lending">
                                        Lending
                                    </FooterLink>
                                </li>
                                <li>
                                    <FooterLink href="/solutions/insurance">
                                        Insurance
                                    </FooterLink>
                                </li>
                            </ul>
                        </div>

                        <div className={styles.column}>
                            <h2 className={styles.columnTitle}>Developers</h2>
                            <ul className={styles.columnList}>
                                {DEVELOPER_COLUMN.map((item) => (
                                    <li key={item.label}>
                                        <FooterLink href={item.href}>
                                            {item.label}
                                        </FooterLink>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className={styles.column}>
                            <h2 className={styles.columnTitle}>Connect</h2>
                            <ul className={styles.columnList}>
                                {CONNECT_COLUMN.map((item) => (
                                    <li key={item.label}>
                                        <FooterLink href={item.href}>
                                            {item.label}
                                        </FooterLink>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className={styles.column}>
                            <h2 className={styles.columnTitle}>Company</h2>
                            <ul className={styles.columnList}>
                                <li>
                                    <FooterLink href="/about">About</FooterLink>
                                </li>
                                <li>
                                    <FooterLink href={CLOUD_APP_URL}>
                                        Hosted dashboard
                                    </FooterLink>
                                </li>
                                <li>
                                    <FooterLink href={contactHref}>
                                        Contact
                                    </FooterLink>
                                </li>
                                <li>
                                    <a
                                        href="mailto:hello@openadapt.ai"
                                        className={styles.columnLink}
                                    >
                                        Email
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div className={styles.column}>
                            <h2 className={styles.columnTitle}>
                                Trust &amp; legal
                            </h2>
                            <ul className={styles.columnList}>
                                <li>
                                    <FooterLink href="/security">
                                        Trust center
                                    </FooterLink>
                                </li>
                                <li>
                                    <FooterLink href="/privacy-policy">
                                        Privacy Notice
                                    </FooterLink>
                                </li>
                                <li>
                                    <FooterLink href="/terms-of-service">
                                        Terms of Service
                                    </FooterLink>
                                </li>
                            </ul>
                        </div>
                    </nav>
                </div>

                <div className={styles.bottom}>
                    <div className={styles.legal}>
                        <p className={styles.copyright}>
                            © 2023–{currentYear} OpenAdapt.AI and MLDSAI Inc.
                            All rights reserved.
                        </p>
                        <p className={styles.license}>
                            Our software is open source and licensed under the
                            MIT License.
                        </p>
                    </div>
                    <div className={styles.social} aria-label="Social links">
                        <a
                            href={OPENADAPT_REPOSITORY_URL}
                            className={styles.socialLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="OpenAdapt on GitHub"
                            onClick={() =>
                                track(EVENTS.GITHUB_CLICK, {
                                    location: 'footer_social',
                                })
                            }
                        >
                            <FontAwesomeIcon icon={faGithub} />
                        </a>
                        <a
                            href="https://x.com/OpenAdaptAI"
                            className={styles.socialLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="OpenAdapt on X"
                        >
                            <FontAwesomeIcon icon={faXTwitter} />
                        </a>
                        <a
                            href="https://www.linkedin.com/company/95677624"
                            className={styles.socialLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="OpenAdapt on LinkedIn"
                        >
                            <FontAwesomeIcon icon={faLinkedinIn} />
                        </a>
                        <a
                            href="https://discord.gg/yF527cQbDG"
                            className={styles.socialLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="OpenAdapt on Discord"
                            onClick={() =>
                                track(EVENTS.DISCORD_CLICK, {
                                    location: 'footer_social',
                                })
                            }
                        >
                            <FontAwesomeIcon icon={faDiscord} />
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    )
}
