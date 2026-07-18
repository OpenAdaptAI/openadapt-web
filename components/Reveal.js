import { useEffect, useRef } from 'react'

/**
 * Reveal — scroll-triggered entrance for a homepage section.
 *
 * Design contract (see styles/globals.css `.reveal-armed` / `.reveal-in`):
 * - Server HTML is fully visible. Hiding is only armed client-side after
 *   hydration, so crawlers, no-JS visitors, and reduced-motion users always
 *   get static content.
 * - Elements already in the viewport at mount are never armed, so nothing
 *   above the fold blinks on load.
 * - Pure IntersectionObserver + CSS transition; no animation library.
 */
export default function Reveal({ children, as: Tag = 'div', className = '' }) {
    const ref = useRef(null)

    useEffect(() => {
        const node = ref.current
        if (!node) return undefined
        if (typeof IntersectionObserver === 'undefined') return undefined
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return undefined
        }

        // Never arm content the visitor can already see.
        const rect = node.getBoundingClientRect()
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            return undefined
        }

        node.classList.add('reveal-armed')
        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        node.classList.add('reveal-in')
                        observer.disconnect()
                    }
                }
            },
            { rootMargin: '0px 0px -8% 0px', threshold: 0 }
        )
        observer.observe(node)
        return () => {
            observer.disconnect()
            node.classList.remove('reveal-armed', 'reveal-in')
        }
    }, [])

    return (
        <Tag ref={ref} className={className || undefined}>
            {children}
        </Tag>
    )
}
