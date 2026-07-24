import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { track, EVENTS } from 'utils/analytics'
import { BLOG_LINK, DEVELOPER_LINKS } from 'data/developerLinks'
import styles from './NavHeader.module.css'

// Map an external nav link to its funnel event, if any.
const externalEvent = (href) => {
    if (!href) return null
    if (href.includes('app.openadapt.ai')) return EVENTS.OPEN_CLOUD_APP_CLICK
    if (href.includes('github.com')) return EVENTS.GITHUB_CLICK
    if (href.includes('docs.openadapt.ai')) return EVENTS.DOCS_CLICK
    if (href.includes('discord.gg')) return EVENTS.DISCORD_CLICK
    return null
}

const isExternal = (href) => /^https?:\/\//.test(href)

// The hosted control plane. Kept in sync with NEXT_PUBLIC_CLOUD_APP_URL
// (.env.example) and the footer "Hosted dashboard" destination.
const CLOUD_APP_URL = 'https://app.openadapt.ai'

const SOLUTIONS_LINKS = [
    { label: 'Healthcare', href: '/solutions/healthcare' },
    { label: 'Lending', href: '/solutions/lending' },
    { label: 'Insurance', href: '/solutions/insurance' },
]

const PRODUCT_LINKS = [
    { label: 'How it works', href: '/how-it-works' },
    {
        label: 'Customer results',
        href: '/customers/rvu-audit-heart-care',
    },
    { label: 'Platforms & deployment', href: '/#product-status' },
    { label: 'Workflows', href: '/workflows' },
    { label: 'Safety', href: '/safety' },
    { label: 'Compare', href: '/compare' },
    { label: 'Templates', href: '/templates' },
    { label: 'Download', href: '/download' },
]

// The Developers dropdown consumes the canonical ecosystem list and adds
// the blog, so the engineering-facing content lives under one menu instead
// of scattering Blog across the top bar.
const DEVELOPER_MENU_LINKS = [...DEVELOPER_LINKS, BLOG_LINK]

const NAV_LINKS = [
    {
        label: 'Solutions',
        dropdown: SOLUTIONS_LINKS,
        menuId: 'nav-solutions-menu',
        align: 'left',
    },
    {
        label: 'Product',
        dropdown: PRODUCT_LINKS,
        menuId: 'nav-product-menu',
        align: 'left',
    },
    { label: 'Pricing', href: '/#pricing' },
    {
        label: 'Developers',
        dropdown: DEVELOPER_MENU_LINKS,
        menuId: 'nav-developers-menu',
        align: 'right',
    },
    {
        label: 'Open source',
        href: 'https://github.com/OpenAdaptAI/OpenAdapt',
        external: true,
    },
]

function ExternalNavLink({ item, className, location }) {
    return (
        <a
            href={item.href}
            className={className}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
                const ev = externalEvent(item.href)
                if (ev) track(ev, { location })
            }}
        >
            {item.label}
        </a>
    )
}

function DropdownLink({ item, className, location }) {
    if (isExternal(item.href)) {
        return (
            <ExternalNavLink
                item={item}
                className={className}
                location={location}
            />
        )
    }
    return (
        <Link href={item.href} className={className}>
            {item.label}
        </Link>
    )
}

function NavDropdown({ label, links, menuId, align }) {
    const [open, setOpen] = useState(false)
    const rootRef = useRef(null)
    const triggerRef = useRef(null)
    const panelRef = useRef(null)
    // Which item to focus once the panel opens: 'first' | 'last' | null.
    const pendingFocus = useRef(null)
    // True while the panel is open only because the pointer hovers it.
    // A click on the trigger then pins the panel open instead of
    // toggling it shut (clicks always follow the synthetic hover on
    // touch devices, and mouse users hover before they click).
    const hoverOpened = useRef(false)
    const router = useRouter()

    const close = () => {
        hoverOpened.current = false
        setOpen(false)
    }

    // Close whenever the route changes.
    useEffect(() => {
        hoverOpened.current = false
        setOpen(false)
    }, [router.asPath])

    // Close on any pointer press outside the dropdown.
    useEffect(() => {
        if (!open) return undefined
        const onPointerDown = (event) => {
            if (rootRef.current && !rootRef.current.contains(event.target)) {
                hoverOpened.current = false
                setOpen(false)
            }
        }
        document.addEventListener('pointerdown', onPointerDown)
        return () => document.removeEventListener('pointerdown', onPointerDown)
    }, [open])

    // Honor a queued keyboard focus request once the panel exists.
    useEffect(() => {
        if (!open || !pendingFocus.current || !panelRef.current) return
        const items = panelRef.current.querySelectorAll('a')
        if (items.length > 0) {
            const index = pendingFocus.current === 'last' ? items.length - 1 : 0
            items[index].focus()
        }
        pendingFocus.current = null
    }, [open])

    const moveFocus = (offset) => {
        if (!panelRef.current) return
        const items = Array.from(panelRef.current.querySelectorAll('a'))
        if (items.length === 0) return
        const current = items.indexOf(document.activeElement)
        const next =
            current === -1
                ? offset > 0
                    ? 0
                    : items.length - 1
                : (current + offset + items.length) % items.length
        items[next].focus()
    }

    const onKeyDown = (event) => {
        switch (event.key) {
            case 'Escape':
                event.preventDefault()
                close()
                triggerRef.current?.focus()
                break
            case 'ArrowDown':
                event.preventDefault()
                if (!open) {
                    pendingFocus.current = 'first'
                    setOpen(true)
                } else {
                    moveFocus(1)
                }
                break
            case 'ArrowUp':
                event.preventDefault()
                if (!open) {
                    pendingFocus.current = 'last'
                    setOpen(true)
                } else {
                    moveFocus(-1)
                }
                break
            default:
                break
        }
    }

    // Close when keyboard focus tabs out of the dropdown entirely.
    const onBlur = (event) => {
        if (rootRef.current && !rootRef.current.contains(event.relatedTarget)) {
            close()
        }
    }

    const onMouseEnter = () => {
        if (!open) {
            hoverOpened.current = true
            setOpen(true)
        }
    }

    // Only a hover-opened panel closes when the pointer leaves; a
    // click-pinned one stays until Escape, tab-out, or outside click.
    const onMouseLeave = () => {
        if (hoverOpened.current) close()
    }

    const onTriggerClick = () => {
        if (open && hoverOpened.current) {
            // The hover that precedes every click already opened the
            // panel; treat the click as intent to open, and pin it.
            hoverOpened.current = false
            return
        }
        if (open) {
            close()
        } else {
            setOpen(true)
        }
    }

    const panelClassName =
        align === 'left'
            ? `${styles.dropdownPanel} ${styles.dropdownPanelLeft}`
            : styles.dropdownPanel

    return (
        <div
            ref={rootRef}
            className={styles.dropdown}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onKeyDown={onKeyDown}
            onBlur={onBlur}
        >
            <button
                ref={triggerRef}
                type="button"
                className={styles.dropdownTrigger}
                aria-expanded={open}
                aria-haspopup="true"
                aria-controls={menuId}
                onClick={onTriggerClick}
            >
                {label}
                <span className={styles.caret} aria-hidden="true">
                    ▾
                </span>
            </button>
            {open && (
                <div
                    ref={panelRef}
                    id={menuId}
                    className={panelClassName}
                    aria-label={label}
                >
                    {links.map((item) => (
                        <DropdownLink
                            key={item.label}
                            item={item}
                            className={styles.dropdownItem}
                            location={`nav_${label.toLowerCase()}`}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default function NavHeader() {
    const router = useRouter()
    const [menuOpen, setMenuOpen] = useState(false)

    // Close the mobile menu whenever the route changes.
    useEffect(() => {
        setMenuOpen(false)
    }, [router.asPath])

    return (
        <header
            className={
                menuOpen
                    ? `${styles.header} ${styles.headerMenuOpen}`
                    : styles.header
            }
        >
            <div className={styles.inner}>
                <Link href="/" className={styles.wordmark}>
                    <span className="font-extralight">Open</span>
                    <span className="font-semibold">Adapt</span>
                </Link>
                <nav className={styles.links} aria-label="Primary">
                    {NAV_LINKS.map((item) => {
                        if (item.dropdown) {
                            return (
                                <NavDropdown
                                    key={item.label}
                                    label={item.label}
                                    links={item.dropdown}
                                    menuId={item.menuId}
                                    align={item.align}
                                />
                            )
                        }
                        return item.external ? (
                            <ExternalNavLink
                                key={item.label}
                                item={item}
                                className={styles.link}
                                location="nav"
                            />
                        ) : (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={styles.link}
                            >
                                {item.label}
                            </Link>
                        )
                    })}
                </nav>
                <div className={styles.actions}>
                    <a
                        href={CLOUD_APP_URL}
                        className={styles.signIn}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() =>
                            track(EVENTS.OPEN_CLOUD_APP_CLICK, {
                                location: 'nav',
                            })
                        }
                    >
                        Sign in
                    </a>
                    <Link
                        href="/#book"
                        className={styles.cta}
                        onClick={() =>
                            track(EVENTS.HERO_CTA_CLICK, {
                                location: 'nav',
                                cta: 'evaluate_workflow',
                            })
                        }
                    >
                        Evaluate a workflow
                    </Link>
                </div>
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
            </div>
            {menuOpen && (
                <nav
                    id="nav-mobile-menu"
                    className={styles.mobilePanel}
                    aria-label="Primary mobile"
                >
                    {NAV_LINKS.map((item) => {
                        if (item.dropdown) {
                            // Each desktop dropdown becomes a labeled
                            // group in the mobile panel.
                            return (
                                <div
                                    key={item.label}
                                    className={styles.mobileGroup}
                                >
                                    <span
                                        className={styles.mobileGroupLabel}
                                        aria-hidden="true"
                                    >
                                        {item.label}
                                    </span>
                                    {item.dropdown.map((link) => (
                                        <DropdownLink
                                            key={link.label}
                                            item={link}
                                            className={styles.mobileLink}
                                            location={`nav_mobile_${item.label.toLowerCase()}`}
                                        />
                                    ))}
                                </div>
                            )
                        }
                        return item.external ? (
                            <ExternalNavLink
                                key={item.label}
                                item={item}
                                className={styles.mobileLink}
                                location="nav_mobile"
                            />
                        ) : (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={styles.mobileLink}
                            >
                                {item.label}
                            </Link>
                        )
                    })}
                    <a
                        href={CLOUD_APP_URL}
                        className={styles.mobileLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() =>
                            track(EVENTS.OPEN_CLOUD_APP_CLICK, {
                                location: 'nav_mobile',
                            })
                        }
                    >
                        Sign in
                    </a>
                </nav>
            )}
        </header>
    )
}
