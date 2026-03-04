import React, { useRef, useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import styles from './IndustriesGrid.module.css'

/*
 * BuildForYouSection — Two dancing pairs in hyperspace.
 * Uses direct DOM manipulation (refs) for smooth 60fps — no React state in the loop.
 */
function BuildForYouSection() {
    const sectionRef = useRef(null)
    const svgRef = useRef(null)
    const canvasRef = useRef(null)
    const [isVisible, setIsVisible] = useState(false)
    const animFrameRef = useRef(null)
    const mouseRef = useRef(null)
    const eyeSmoothRef = useRef([{ x: 0, y: 0 }, { x: 0, y: 0 }])

    // DOM refs for animated SVG elements
    const cursorLRef = useRef(null)
    const cursorRRef = useRef(null)
    const mascotLRef = useRef(null)
    const mascotRRef = useRef(null)
    const eyeL0Ref = useRef(null)
    const eyeL1Ref = useRef(null)
    const eyeR0Ref = useRef(null)
    const eyeR1Ref = useRef(null)
    const trailRef = useRef(null)
    const particleRefs = useRef([])
    const rippleLRef = useRef(null)
    const rippleRRef = useRef(null)

    const L = { cx: 240, cy: 100, radius: 80 }
    const R = { cx: 560, cy: 100, radius: 80 }

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setIsVisible(true) },
            { threshold: 0.15 }
        )
        if (sectionRef.current) observer.observe(sectionRef.current)
        return () => observer.disconnect()
    }, [])

    const handleMouseMove = useCallback((e) => {
        const svg = svgRef.current
        if (!svg) return
        const rect = svg.getBoundingClientRect()
        mouseRef.current = {
            x: ((e.clientX - rect.left) / rect.width) * 800,
            y: ((e.clientY - rect.top) / rect.height) * 220,
        }
    }, [])

    const handleMouseLeave = useCallback(() => { mouseRef.current = null }, [])

    /* ── Animation loop — direct DOM setAttribute, no React re-render ── */
    useEffect(() => {
        if (!isVisible) return
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
        if (mq.matches) return

        let startTime = null
        const tick = (now) => {
            if (!startTime) startTime = now
            const t = (now - startTime) / 1000
            const speed = 0.7
            const aL = t * speed, aR = -t * speed * 0.85

            const clx = L.cx + Math.cos(aL) * L.radius
            const cly = L.cy + Math.sin(aL) * L.radius * 0.6
            const mlx = L.cx + Math.cos(aL + Math.PI) * L.radius
            const mly = L.cy + Math.sin(aL + Math.PI) * L.radius * 0.6
            const mrx = R.cx + Math.cos(aR) * R.radius
            const mry = R.cy + Math.sin(aR) * R.radius * 0.6
            const crx = R.cx + Math.cos(aR + Math.PI) * R.radius
            const cry = R.cy + Math.sin(aR + Math.PI) * R.radius * 0.6

            // Move elements directly
            if (cursorLRef.current) cursorLRef.current.setAttribute('transform', `translate(${clx}, ${cly}) scale(0.8)`)
            if (cursorRRef.current) cursorRRef.current.setAttribute('transform', `translate(${crx}, ${cry}) scale(0.8)`)
            if (mascotLRef.current) mascotLRef.current.setAttribute('transform', `translate(${mlx}, ${mly}) scale(1.5)`)
            if (mascotRRef.current) mascotRRef.current.setAttribute('transform', `translate(${mrx}, ${mry}) scale(1.5)`)

            if (trailRef.current) trailRef.current.setAttribute('d',
                `M${mlx} ${mly} Q400 ${60 + Math.sin(t * 0.3) * 20} ${mrx} ${mry}`)

            particleRefs.current.forEach((el, i) => {
                if (!el) return
                const pt = ((t * 0.15 + i * 0.33) % 1)
                el.setAttribute('cx', mlx + (mrx - mlx) * pt)
                el.setAttribute('cy', mly + (mry - mly) * pt + Math.sin(pt * Math.PI) * (Math.sin(t * 0.3) * 20 - 20))
            })

            // Click ripples
            const cpL = (t % 3.5) / 3.5, cpR = (t % 4.2) / 4.2
            if (rippleLRef.current) {
                if (cpL < 0.4) {
                    rippleLRef.current.setAttribute('cx', clx); rippleLRef.current.setAttribute('cy', cly)
                    rippleLRef.current.setAttribute('r', 4 + cpL * 30)
                    rippleLRef.current.setAttribute('stroke-width', 1.5 * (1 - cpL / 0.4))
                    rippleLRef.current.setAttribute('opacity', 1 - cpL / 0.4)
                } else { rippleLRef.current.setAttribute('opacity', 0) }
            }
            if (rippleRRef.current) {
                if (cpR < 0.4) {
                    rippleRRef.current.setAttribute('cx', crx); rippleRRef.current.setAttribute('cy', cry)
                    rippleRRef.current.setAttribute('r', 4 + cpR * 30)
                    rippleRRef.current.setAttribute('stroke-width', 1.5 * (1 - cpR / 0.4))
                    rippleRRef.current.setAttribute('opacity', 1 - cpR / 0.4)
                } else { rippleRRef.current.setAttribute('opacity', 0) }
            }

            // Eye tracking
            const gazeTargets = mouseRef.current
                ? [mouseRef.current, mouseRef.current]
                : [{ x: clx, y: cly }, { x: crx, y: cry }]
            const eyeRefPairs = [[eyeL0Ref, eyeL1Ref], [eyeR0Ref, eyeR1Ref]]
            ;[{ x: mlx, y: mly }, { x: mrx, y: mry }].forEach((pos, i) => {
                const g = gazeTargets[i]
                const dx = g.x - pos.x, dy = g.y - pos.y
                const dist = Math.sqrt(dx * dx + dy * dy) || 1
                const prev = eyeSmoothRef.current[i]
                const ex = prev.x + (Math.max(-1, Math.min(1, dx / dist)) - prev.x) * 0.08
                const ey = prev.y + (Math.max(-1, Math.min(1, dy / dist)) - prev.y) * 0.08
                eyeSmoothRef.current[i] = { x: ex, y: ey }
                if (eyeRefPairs[i][0].current) { eyeRefPairs[i][0].current.setAttribute('x', -8 + ex * 1.5); eyeRefPairs[i][0].current.setAttribute('y', -2 + ey) }
                if (eyeRefPairs[i][1].current) { eyeRefPairs[i][1].current.setAttribute('x', 4 + ex * 1.5); eyeRefPairs[i][1].current.setAttribute('y', -2 + ey) }
            })

            animFrameRef.current = requestAnimationFrame(tick)
        }
        animFrameRef.current = requestAnimationFrame(tick)
        return () => { if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current) }
    }, [isVisible])

    /* ── Starfield canvas ── */
    useEffect(() => {
        if (!isVisible) return
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        const dpr = window.devicePixelRatio || 1
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
        let raf

        const resize = () => {
            const rect = canvas.parentElement.getBoundingClientRect()
            canvas.width = rect.width * dpr
            canvas.height = rect.height * dpr
            canvas.style.width = rect.width + 'px'
            canvas.style.height = rect.height + 'px'
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        }
        resize()
        window.addEventListener('resize', resize)

        const stars = Array.from({ length: 100 }, () => ({
            x: Math.random(), y: Math.random(), z: Math.random(),
            speed: 0.0002 + Math.random() * 0.0006,
        }))

        const draw = () => {
            const w = canvas.width / dpr, h = canvas.height / dpr
            ctx.clearRect(0, 0, w, h)
            for (const s of stars) {
                s.z -= s.speed
                if (s.z <= 0) { s.z = 1; s.x = Math.random(); s.y = Math.random() }
                const sx = (s.x - 0.5) / s.z * w * 0.4 + w * 0.5
                const sy = (s.y - 0.5) / s.z * h * 0.4 + h * 0.5
                const r = (1 - s.z) * 1.5, a = (1 - s.z) * 0.6
                const len = (1 - s.z) * 6
                const dx = (s.x - 0.5), dy = (s.y - 0.5)
                const mag = Math.sqrt(dx * dx + dy * dy) || 1
                ctx.beginPath()
                ctx.moveTo(sx, sy)
                ctx.lineTo(sx + dx / mag * len, sy + dy / mag * len)
                ctx.strokeStyle = `rgba(180, 200, 255, ${a})`
                ctx.lineWidth = r * 0.5
                ctx.stroke()
                ctx.beginPath()
                ctx.arc(sx, sy, r, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(200, 220, 255, ${a})`
                ctx.fill()
            }
            raf = requestAnimationFrame(draw)
        }

        if (!mq.matches) draw()
        else {
            const w = canvas.width / dpr, h = canvas.height / dpr
            for (const s of stars) {
                ctx.beginPath()
                ctx.arc(s.x * w, s.y * h, 0.7, 0, Math.PI * 2)
                ctx.fillStyle = 'rgba(200, 220, 255, 0.25)'
                ctx.fill()
            }
        }

        return () => { window.removeEventListener('resize', resize); if (raf) cancelAnimationFrame(raf) }
    }, [isVisible])

    return (
        <div ref={sectionRef} className={`${styles.buildSection} ${isVisible ? styles.buildVisible : ''}`} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
            <canvas ref={canvasRef} className={styles.starfield} />
            <div className={styles.buildGlow} />

            <svg ref={svgRef} className={styles.buildSvg} viewBox="0 0 800 220" fill="none" preserveAspectRatio="xMidYMid meet">
                {/* Energy trail */}
                <path ref={trailRef} d={`M${L.cx - L.radius} ${L.cy} Q400 60 ${R.cx + R.radius} ${R.cy}`} className={styles.pathLine} />

                {/* Particles */}
                {[0, 1, 2].map(i => (
                    <circle key={i} ref={el => particleRefs.current[i] = el} cx={L.cx} cy={L.cy} r="2" className={styles.particle} />
                ))}

                {/* Left cursor (leader) */}
                <g ref={cursorLRef} transform={`translate(${L.cx + L.radius}, ${L.cy}) scale(0.8)`}>
                    <path d="M0 -10 L0 10 L4 6 L8 14 L10 13 L6 5 L11 5 Z" fill="rgba(255,255,255,0.85)" stroke="rgba(86,13,248,0.5)" strokeWidth="0.8" />
                </g>
                <circle ref={rippleLRef} cx="0" cy="0" r="4" fill="none" stroke="rgba(96,165,250,0.4)" strokeWidth="1.5" opacity="0" />

                {/* Left mascot (follower) */}
                <g ref={mascotLRef} transform={`translate(${L.cx - L.radius}, ${L.cy}) scale(1.5)`}>
                    <path d="M-12 -8 L12 -8 Q16 -8 16 -4 L16 8 Q16 12 12 12 L4 12 L-2 16 L-2 12 L-12 12 Q-16 12 -16 8 L-16 -4 Q-16 -8 -12 -8 Z"
                        fill="rgba(96,165,250,0.15)" stroke="rgba(96,165,250,0.5)" strokeWidth="1" />
                    <g className={styles.blinkA}>
                        <rect ref={eyeL0Ref} x="-8" y="-2" width="4" height="4" rx="0.5" fill="rgba(255,255,255,0.9)" />
                        <rect ref={eyeL1Ref} x="4" y="-2" width="4" height="4" rx="0.5" fill="rgba(255,255,255,0.9)" />
                    </g>
                    <path d="M-5 6 Q0 10 5 6" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="1.2" strokeLinecap="round" />
                    <line x1="0" y1="-8" x2="0" y2="-14" stroke="rgba(96,165,250,0.5)" strokeWidth="1" />
                    <circle cx="0" cy="-15" r="2" fill="rgba(96,165,250,0.7)" className={styles.antennaPulse} />
                </g>
                <text x={L.cx} y="170" className={styles.nodeLabel}>Demonstrate</text>

                {/* Right mascot (leader) */}
                <g ref={mascotRRef} transform={`translate(${R.cx + R.radius}, ${R.cy}) scale(1.5)`}>
                    <path d="M-12 -8 L12 -8 Q16 -8 16 -4 L16 8 Q16 12 12 12 L4 12 L-2 16 L-2 12 L-12 12 Q-16 12 -16 8 L-16 -4 Q-16 -8 -12 -8 Z"
                        fill="rgba(86,13,248,0.2)" stroke="rgba(86,13,248,0.6)" strokeWidth="1" />
                    <g className={styles.blinkB}>
                        <rect ref={eyeR0Ref} x="-8" y="-2" width="4" height="4" rx="0.5" fill="rgba(255,255,255,0.9)" />
                        <rect ref={eyeR1Ref} x="4" y="-2" width="4" height="4" rx="0.5" fill="rgba(255,255,255,0.9)" />
                    </g>
                    <path d="M-5 6 Q0 10 5 6" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="1.2" strokeLinecap="round" />
                    <line x1="0" y1="-8" x2="0" y2="-14" stroke="rgba(86,13,248,0.6)" strokeWidth="1" />
                    <circle cx="0" cy="-15" r="2" fill="rgba(86,13,248,0.8)" className={styles.antennaPulse} style={{ animationDelay: '1.5s' }} />
                </g>

                {/* Right cursor (follower) */}
                <g ref={cursorRRef} transform={`translate(${R.cx - R.radius}, ${R.cy}) scale(0.8)`}>
                    <path d="M0 -10 L0 10 L4 6 L8 14 L10 13 L6 5 L11 5 Z" fill="rgba(255,255,255,0.85)" stroke="rgba(86,13,248,0.5)" strokeWidth="0.8" />
                </g>
                <circle ref={rippleRRef} cx="0" cy="0" r="4" fill="none" stroke="rgba(86,13,248,0.4)" strokeWidth="1.5" opacity="0" />

                <text x={R.cx} y="170" className={styles.nodeLabel}>Automate</text>
            </svg>

            <div className={styles.buildContent}>
                <h2 className={styles.buildTitle}>Let us build for you</h2>
                <p className={styles.buildDesc}>
                    If OpenAdapt doesn't fully automate your workflow out of the box, we'll work with you to fix that.
                </p>
                <Link
                    className={styles.buildBtn}
                    href="mailto:sales@openadapt.ai?subject=OpenAdapt%20Inquiry%3A%20Assistance%20with%20Automating%20%5BYour%20Use%20Case%5D"
                >
                    Contact Sales
                </Link>
            </div>
        </div>
    )
}

export default function IndustriesGrid({
    feedbackData,
    setFeedbackData,
    sectionRef,
}) {
    const gridData = [
        {
            title: 'HR',
            descriptions:
                'Boost team productivity in HR operations. Automate candidate sourcing using LinkedIn Recruiter, LinkedIn Talent Solutions, GetProspect, Reply.io, outreach.io, Gmail/Outlook, and more.',
            logo: '/images/noun-human-resources.svg',
        },
        {
            title: 'Law',
            descriptions:
                'Streamline legal procedures and case management. Automate tasks like generating legal documents, managing contracts, tracking cases, and conducting legal research with LexisNexis, Westlaw, Adobe Acrobat, Microsoft Excel, and more.',
            logo: '/images/noun-law.svg',
        },
        {
            title: 'Insurance',
            descriptions:
                'Optimize productivity in insurance. Automate policy management, claims processing, data analysis, and document collaboration with PolicyCenter, Xactimate, Excel, SharePoint, PowerBI, and more.',
            logo: '/images/noun-insurance.svg',
        },
        {
            title: 'Healthcare',
            descriptions:
                'Advance patient care and streamline operations. Automate revenue cycle management, clinical documentation, and scheduling in Cerner, Epic, and more.',
            logo: '/images/noun-healthcare.svg',
        },
        {
            title: 'Finance',
            descriptions:
                'Enhance efficiency and compliance in financial services. Automate tasks like data entry, reporting, and portfolio management using tools like Excel, Bloomberg, QuickBooks, and more.',
            logo: '/images/noun-finance.svg',
        },
        {
            title: 'Logistics',
            descriptions:
                'Automate tasks with Transportation Management Systems (TMS), Freight Management Systems (FMS), Load Tracking Systems, and Document Management Systems for efficient tracking, scheduling, and financial record-keeping.',
            logo: '/images/noun-freight.svg',
        },
        {
            title: 'Pharmacy',
            descriptions:
                'Enhance accuracy and inventory management. Automate prescription management, inventory control, medication dispensing, and patient records with Krol (Telus), Filware, Healthwatch, and more.',
            logo: '/images/noun-pharmacy.svg',
        },
        {
            title: 'Customer Support',
            descriptions:
                'Automate customer inquiries, ticket management, collaboration, data analysis, and communication using OracleHCM, Workday, SAP, Excel, SharePoint, Outlook, LinkedIn, Teams, PowerBI, and more.',
            logo: '/images/noun-customer-support.svg',
        },
        {
            title: 'Sales Development',
            descriptions:
                'Automate repetitive tasks in OracleHCM, LinkedIn, SalesForce, and Gmail for lead generation, prospecting, and communication to optimize revenue growth.',
            logo: '/images/noun-sales-development.svg',
        },
    ]

    const getDataFromTitle = (title) => {
        return {
            email: '',
            message:
                title === 'Let us build for you'
                    ? ''
                    : `I'm interested in how OpenAdapt can help me make ${title} better.`,
        }
    }

    const handleGetStartedButtonClick = (title) => {
        let data = getDataFromTitle(title)
        setFeedbackData(data)
    }

    return (
        <div className={styles.background} id="industries">
            <div className="flex flex-col items-center justify-center pt-10">
                <a
                    href="https://theresanaiforthat.com/ai/openadapt-ai/?ref=featured&v=2868434"
                    target="_blank"
                    rel="nofollow"
                    className="opacity-70 hover:opacity-100 transition-opacity duration-200"
                >
                    <img width="240" src="https://media.theresanaiforthat.com/featured-on-taaft.png?width=600"></img>
                </a>
            </div>
            <div className="mt-12">
                <h1 className="text-center text-xl font-medium text-white/95 mb-3 tracking-tight">
                    Transform Your Industry with OpenAdapt
                </h1>
                <p className={styles.p}>
                    From demonstration to automation in minutes. Just do the task once and OpenAdapt learns from watching.
                    No prompt engineering. No scripting. No brittle selectors.
                    <br />
                    <a href="https://github.com/OpenAdaptAI/openadapt-privacy">
                        Built-in PII/PHI scrubbing
                    </a>{' '}
                    keeps your sensitive data safe.
                </p>
            </div>
            <div className={styles.row}>
                {gridData.map((grid, index) => (
                    <div key={index} className={styles.card}>
                        <div className={styles.logo}>
                            <Image
                                className="invert text-center inline"
                                priority
                                src={grid.logo}
                                height={60}
                                width={60}
                                alt={grid.title}
                            />
                        </div>
                        <h2 className={styles.title}>{grid.title}</h2>
                        <ul className={styles.descriptions}>
                            {grid.descriptions
                                .split('\n')
                                .map((description) => (
                                    <li key={grid.title}>{description}</li>
                                ))}
                        </ul>
                        <div className="flex flex-row items-center justify-center mt-3 mb-2">
                            <Link
                                className="px-4 py-2 rounded-lg bg-[#5a1eac] hover:bg-[#7132d4] text-white text-sm font-medium transition-all duration-200"
                                href="#start"
                                onClick={() =>
                                    handleGetStartedButtonClick(grid.title)
                                }
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            <BuildForYouSection />
        </div>
    )
}
