import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

import styles from './NavHeader.module.css'

const NAV_LINKS = [
    { label: 'Healthcare', href: '/solutions/healthcare' },
    { label: 'Lending', href: '/solutions/lending' },
    { label: 'Compare', href: '/compare' },
    { label: 'About', href: '/about' },
    {
        label: 'Open source',
        href: 'https://github.com/OpenAdaptAI/OpenAdapt',
        external: true,
    },
]

export default function NavHeader() {
    const router = useRouter()
    const [menuOpen, setMenuOpen] = useState(false)

    // Close the mobile menu whenever the route changes.
    useEffect(() => {
        setMenuOpen(false)
    }, [router.asPath])

    return (
        <header className={styles.header}>
            <div className={styles.inner}>
                <Link href="/" className={styles.wordmark}>
                    <span className="font-extralight">Open</span>
                    <span className="font-semibold">Adapt</span>
                </Link>
                <nav className={styles.links} aria-label="Primary">
                    {NAV_LINKS.map((item) =>
                        item.external ? (
                            <a
                                key={item.label}
                                href={item.href}
                                className={styles.link}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {item.label}
                            </a>
                        ) : (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={styles.link}
                            >
                                {item.label}
                            </Link>
                        )
                    )}
                </nav>
                <button
                    type="button"
                    className={styles.menuButton}
                    aria-expanded={menuOpen}
                    aria-controls="nav-mobile-menu"
                    aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                    onClick={() => setMenuOpen((open) => !open)}
                >
                    {menuOpen ? 'CLOSE' : 'MENU'}
                </button>
                <Link href="/#book" className={styles.cta}>
                    Book a demo
                </Link>
            </div>
            {menuOpen && (
                <nav
                    id="nav-mobile-menu"
                    className={styles.mobilePanel}
                    aria-label="Primary mobile"
                >
                    {NAV_LINKS.map((item) =>
                        item.external ? (
                            <a
                                key={item.label}
                                href={item.href}
                                className={styles.mobileLink}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {item.label}
                            </a>
                        ) : (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={styles.mobileLink}
                            >
                                {item.label}
                            </Link>
                        )
                    )}
                </nav>
            )}
        </header>
    )
}
