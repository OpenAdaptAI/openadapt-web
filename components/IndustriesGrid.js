import React, { useRef, useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import styles from './IndustriesGrid.module.css'

/*
 * BuildForYouSection — Two dancing pairs in hyperspace.
 * Left pair:  cursor leads, mascot follows (Demonstrate)
 * Right pair: mascot leads, cursor follows (Automate)
 * Everything moves autonomously. Eyes track the user's mouse as a bonus.
 */
function BuildForYouSection() {
    const sectionRef = useRef(null)
    const svgRef = useRef(null)
    const canvasRef = useRef(null)
    const [isVisible, setIsVisible] = useState(false)
    const [time, setTime] = useState(0)
    const [eyeTarget, setEyeTarget] = useState({ x: 400, y: 100 })
    const animFrameRef = useRef(null)
    const timeRef = useRef(0)
    const mouseRef = useRef(null) // null = no mouse yet, use autonomous gaze
    const eyeSmoothRef = useRef([{ x: 0, y: 0 }, { x: 0, y: 0 }])

    // Pair centers in SVG space (viewBox 0 0 800 220)
    const pairL = { cx: 240, cy: 100, radius: 80 }
    const pairR = { cx: 560, cy: 100, radius: 80 }

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setIsVisible(true) },
            { threshold: 0.15 }
        )
        if (sectionRef.current) observer.observe(sectionRef.current)
        return () => observer.disconnect()
    }, [])

    /* ── Mouse tracking for eyes ── */
    const handleMouseMove = useCallback((e) => {
        const svg = svgRef.current
        if (!svg) return
        const rect = svg.getBoundingClientRect()
        mouseRef.current = {
            x: ((e.clientX - rect.left) / rect.width) * 800,
            y: ((e.clientY - rect.top) / rect.height) * 220,
        }
    }, [])

    const handleMouseLeave = useCallback(() => {
        mouseRef.current = null // revert to autonomous gaze
    }, [])

    /* ── Main animation loop ── */
    useEffect(() => {
        if (!isVisible) return
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)')

        const tick = () => {
            timeRef.current += 0.016 // ~60fps
            const t = timeRef.current

            // Compute dance positions
            const speed = 0.7
            const angleL = t * speed
            const angleR = -t * speed * 0.85 // counter-rotate, slightly different speed

            // Eye target: mouse if present, otherwise the partner's position
            const mascotLx = pairL.cx + Math.cos(angleL + Math.PI) * pairL.radius
            const mascotLy = pairL.cy + Math.sin(angleL + Math.PI) * pairL.radius * 0.6
            const mascotRx = pairR.cx + Math.cos(angleR) * pairR.radius
            const mascotRy = pairR.cy + Math.sin(angleR) * pairR.radius * 0.6

            const cursorLx = pairL.cx + Math.cos(angleL) * pairL.radius
            const cursorLy = pairL.cy + Math.sin(angleL) * pairL.radius * 0.6
            const cursorRx = pairR.cx + Math.cos(angleR + Math.PI) * pairR.radius
            const cursorRy = pairR.cy + Math.sin(angleR + Math.PI) * pairR.radius * 0.6

            // Eye direction: toward mouse if hovering, otherwise toward partner cursor
            const gazeTargets = mouseRef.current
                ? [mouseRef.current, mouseRef.current]
                : [{ x: cursorLx, y: cursorLy }, { x: cursorRx, y: cursorRy }]

            const mascotPositions = [
                { x: mascotLx, y: mascotLy },
                { x: mascotRx, y: mascotRy },
            ]

            const newEyes = mascotPositions.map((pos, i) => {
                const target = gazeTargets[i]
                const dx = target.x - pos.x
                const dy = target.y - pos.y
                const dist = Math.sqrt(dx * dx + dy * dy) || 1
                const nx = Math.max(-1, Math.min(1, dx / dist))
                const ny = Math.max(-1, Math.min(1, dy / dist))
                const prev = eyeSmoothRef.current[i]
                return {
                    x: prev.x + (nx - prev.x) * 0.06,
                    y: prev.y + (ny - prev.y) * 0.06,
                }
            })
            eyeSmoothRef.current = newEyes

            setTime(t)

            if (!mq.matches) {
                animFrameRef.current = requestAnimationFrame(tick)
            }
        }

        if (mq.matches) {
            // One static frame
            timeRef.current = 0
            setTime(0)
        } else {
            animFrameRef.current = requestAnimationFrame(tick)
        }

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

    // Compute positions from time
    const t = time
    const speed = 0.7
    const aL = t * speed
    const aR = -t * speed * 0.85

    // Left pair: cursor leads (top of orbit), mascot follows (bottom)
    const cursorL = { x: pairL.cx + Math.cos(aL) * pairL.radius, y: pairL.cy + Math.sin(aL) * pairL.radius * 0.6 }
    const mascotL = { x: pairL.cx + Math.cos(aL + Math.PI) * pairL.radius, y: pairL.cy + Math.sin(aL + Math.PI) * pairL.radius * 0.6 }

    // Right pair: mascot leads, cursor follows
    const mascotR = { x: pairR.cx + Math.cos(aR) * pairR.radius, y: pairR.cy + Math.sin(aR) * pairR.radius * 0.6 }
    const cursorR = { x: pairR.cx + Math.cos(aR + Math.PI) * pairR.radius, y: pairR.cy + Math.sin(aR + Math.PI) * pairR.radius * 0.6 }

    const eyes = eyeSmoothRef.current

    // Click ripple: cursor "clicks" every few seconds
    const clickCycleL = 3.5, clickCycleR = 4.2
    const clickPhaseL = (t % clickCycleL) / clickCycleL
    const clickPhaseR = (t % clickCycleR) / clickCycleR

    return (
        <div ref={sectionRef} className={`${styles.buildSection} ${isVisible ? styles.buildVisible : ''}`} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
            <canvas ref={canvasRef} className={styles.starfield} />
            <div className={styles.buildGlow} />

            <svg ref={svgRef} className={styles.buildSvg} viewBox="0 0 800 220" fill="none" preserveAspectRatio="xMidYMid meet">
                {/* Energy trail between pairs */}
                <path
                    d={`M${mascotL.x} ${mascotL.y} Q400 ${60 + Math.sin(t * 0.3) * 20} ${mascotR.x} ${mascotR.y}`}
                    className={styles.pathLine}
                />

                {/* Flowing particles along the energy trail */}
                {[0, 1, 2].map(i => {
                    const pt = ((t * 0.15 + i * 0.33) % 1)
                    const px = mascotL.x + (mascotR.x - mascotL.x) * pt
                    const py = mascotL.y + (mascotR.y - mascotL.y) * pt + Math.sin(pt * Math.PI) * (Math.sin(t * 0.3) * 20 - 20)
                    return <circle key={i} cx={px} cy={py} r="2" className={styles.particle} />
                })}

                {/* ── Left pair: Demonstrate ── */}
                {/* Cursor (leader) */}
                <g transform={`translate(${cursorL.x}, ${cursorL.y}) scale(0.8)`}>
                    <path d="M0 -10 L0 10 L4 6 L8 14 L10 13 L6 5 L11 5 Z"
                        fill="rgba(255,255,255,0.85)" stroke="rgba(86, 13, 248, 0.5)" strokeWidth="0.8" />
                </g>
                {/* Click ripple from cursor */}
                {clickPhaseL < 0.4 && (
                    <circle cx={cursorL.x} cy={cursorL.y} r={4 + clickPhaseL * 30}
                        fill="none" stroke="rgba(96, 165, 250, 0.4)"
                        strokeWidth={1.5 * (1 - clickPhaseL / 0.4)}
                        opacity={1 - clickPhaseL / 0.4} />
                )}
                {/* Mascot (follower) */}
                <g transform={`translate(${mascotL.x}, ${mascotL.y}) scale(1.5)`}>
                    <path d="M-12 -8 L12 -8 Q16 -8 16 -4 L16 8 Q16 12 12 12 L4 12 L-2 16 L-2 12 L-12 12 Q-16 12 -16 8 L-16 -4 Q-16 -8 -12 -8 Z"
                        fill="rgba(96, 165, 250, 0.15)" stroke="rgba(96, 165, 250, 0.5)" strokeWidth="1" />
                    <g className={styles.blinkA}>
                        <rect x={-8 + eyes[0].x * 1.5} y={-2 + eyes[0].y} width="4" height="4" rx="0.5" fill="rgba(255,255,255,0.9)" />
                        <rect x={4 + eyes[0].x * 1.5} y={-2 + eyes[0].y} width="4" height="4" rx="0.5" fill="rgba(255,255,255,0.9)" />
                    </g>
                    <path d="M-5 6 Q0 10 5 6" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="1.2" strokeLinecap="round" />
                    <line x1="0" y1="-8" x2="0" y2="-14" stroke="rgba(96, 165, 250, 0.5)" strokeWidth="1" />
                    <circle cx="0" cy="-15" r="2" fill="rgba(96, 165, 250, 0.7)" className={styles.antennaPulse} />
                </g>
                {/* Label */}
                <text x={pairL.cx} y="170" className={styles.nodeLabel}>Demonstrate</text>

                {/* ── Right pair: Automate ── */}
                {/* Mascot (leader) */}
                <g transform={`translate(${mascotR.x}, ${mascotR.y}) scale(1.5)`}>
                    <path d="M-12 -8 L12 -8 Q16 -8 16 -4 L16 8 Q16 12 12 12 L4 12 L-2 16 L-2 12 L-12 12 Q-16 12 -16 8 L-16 -4 Q-16 -8 -12 -8 Z"
                        fill="rgba(86, 13, 248, 0.2)" stroke="rgba(86, 13, 248, 0.6)" strokeWidth="1" />
                    <g className={styles.blinkB}>
                        <rect x={-8 + eyes[1].x * 1.5} y={-2 + eyes[1].y} width="4" height="4" rx="0.5" fill="rgba(255,255,255,0.9)" />
                        <rect x={4 + eyes[1].x * 1.5} y={-2 + eyes[1].y} width="4" height="4" rx="0.5" fill="rgba(255,255,255,0.9)" />
                    </g>
                    <path d="M-5 6 Q0 10 5 6" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="1.2" strokeLinecap="round" />
                    <line x1="0" y1="-8" x2="0" y2="-14" stroke="rgba(86, 13, 248, 0.6)" strokeWidth="1" />
                    <circle cx="0" cy="-15" r="2" fill="rgba(86, 13, 248, 0.8)" className={styles.antennaPulse} style={{ animationDelay: '1.5s' }} />
                </g>
                {/* Cursor (follower) */}
                <g transform={`translate(${cursorR.x}, ${cursorR.y}) scale(0.8)`}>
                    <path d="M0 -10 L0 10 L4 6 L8 14 L10 13 L6 5 L11 5 Z"
                        fill="rgba(255,255,255,0.85)" stroke="rgba(86, 13, 248, 0.5)" strokeWidth="0.8" />
                </g>
                {/* Click ripple from cursor */}
                {clickPhaseR < 0.4 && (
                    <circle cx={cursorR.x} cy={cursorR.y} r={4 + clickPhaseR * 30}
                        fill="none" stroke="rgba(86, 13, 248, 0.4)"
                        strokeWidth={1.5 * (1 - clickPhaseR / 0.4)}
                        opacity={1 - clickPhaseR / 0.4} />
                )}
                {/* Label */}
                <text x={pairR.cx} y="170" className={styles.nodeLabel}>Automate</text>
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
