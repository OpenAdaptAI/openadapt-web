import React, { useRef, useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import styles from './IndustriesGrid.module.css'

/* ── The OpenAdapt mascot with living eyes ── */
function Mascot({ x, y, scale = 1, delay = 0, className = '', eyeOffset = { x: 0, y: 0 }, blinkClass = '' }) {
    const ex = eyeOffset.x * 1.5  // max ~1.5px shift
    const ey = eyeOffset.y * 1.0
    return (
        <g
            transform={`translate(${x}, ${y}) scale(${scale})`}
            className={className}
            style={{ animationDelay: `${delay}s` }}
        >
            {/* Body / speech-bubble shape */}
            <path
                d="M-12 -8 L12 -8 Q16 -8 16 -4 L16 8 Q16 12 12 12 L4 12 L-2 16 L-2 12 L-12 12 Q-16 12 -16 8 L-16 -4 Q-16 -8 -12 -8 Z"
                fill="rgba(96, 165, 250, 0.15)"
                stroke="rgba(96, 165, 250, 0.5)"
                strokeWidth="1"
            />
            {/* Eyes — shift with cursor, blink independently */}
            <g className={blinkClass}>
                <rect x={-8 + ex} y={-2 + ey} width="4" height="4" rx="0.5" fill="rgba(255,255,255,0.9)" />
                <rect x={4 + ex} y={-2 + ey} width="4" height="4" rx="0.5" fill="rgba(255,255,255,0.9)" />
            </g>
            {/* Smile */}
            <path
                d="M-5 6 Q0 10 5 6"
                fill="none"
                stroke="rgba(255,255,255,0.8)"
                strokeWidth="1.2"
                strokeLinecap="round"
            />
            {/* Antenna with pulse */}
            <line x1="0" y1="-8" x2="0" y2="-14" stroke="rgba(96, 165, 250, 0.5)" strokeWidth="1" />
            <circle cx="0" cy="-15" r="2" fill="rgba(96, 165, 250, 0.7)" className={styles.antennaPulse} style={{ animationDelay: `${delay * 2}s` }} />
        </g>
    )
}

/* ── Small cursor arrow SVG ── */
function Cursor({ x, y, scale = 0.6, delay = 0, className = '' }) {
    return (
        <g
            transform={`translate(${x}, ${y}) scale(${scale})`}
            className={className}
            style={{ animationDelay: `${delay}s` }}
        >
            <path
                d="M0 -10 L0 10 L4 6 L8 14 L10 13 L6 5 L11 5 Z"
                fill="rgba(255,255,255,0.85)"
                stroke="rgba(86, 13, 248, 0.5)"
                strokeWidth="0.8"
            />
        </g>
    )
}

function BuildForYouSection() {
    const sectionRef = useRef(null)
    const svgRef = useRef(null)
    const canvasRef = useRef(null)
    const [isVisible, setIsVisible] = useState(false)
    const [eyeOffsets, setEyeOffsets] = useState([
        { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }
    ])
    const animFrameRef = useRef(null)
    const mouseRef = useRef({ x: 0, y: 0 })
    const smoothRef = useRef([{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }])

    // Mascot positions in SVG coords
    const mascots = [
        { x: 120, y: 100 },
        { x: 400, y: 75 },
        { x: 680, y: 90 },
    ]

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setIsVisible(true) },
            { threshold: 0.15 }
        )
        if (sectionRef.current) observer.observe(sectionRef.current)
        return () => observer.disconnect()
    }, [])

    /* ── Eye tracking ── */
    const handleMouseMove = useCallback((e) => {
        const svg = svgRef.current
        if (!svg) return
        const rect = svg.getBoundingClientRect()
        // Convert mouse to SVG coordinate space (viewBox 0 0 800 200)
        const svgX = ((e.clientX - rect.left) / rect.width) * 800
        const svgY = ((e.clientY - rect.top) / rect.height) * 200
        mouseRef.current = { x: svgX, y: svgY }
    }, [])

    useEffect(() => {
        if (!isVisible) return
        let raf
        const tick = () => {
            const m = mouseRef.current
            const next = mascots.map((pos, i) => {
                const dx = m.x - pos.x
                const dy = m.y - pos.y
                const dist = Math.sqrt(dx * dx + dy * dy) || 1
                const maxShift = 1
                const nx = Math.max(-maxShift, Math.min(maxShift, dx / dist))
                const ny = Math.max(-maxShift, Math.min(maxShift, dy / dist))
                // Smooth damping
                const prev = smoothRef.current[i]
                const lerp = 0.08
                return {
                    x: prev.x + (nx - prev.x) * lerp,
                    y: prev.y + (ny - prev.y) * lerp,
                }
            })
            smoothRef.current = next
            setEyeOffsets(next)
            raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
        return () => cancelAnimationFrame(raf)
    }, [isVisible])

    /* ── Starfield canvas ── */
    const initStarfield = useCallback(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        const dpr = window.devicePixelRatio || 1

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

        // Stars
        const stars = Array.from({ length: 120 }, () => ({
            x: Math.random(),
            y: Math.random(),
            z: Math.random(),
            speed: 0.0002 + Math.random() * 0.0008,
        }))

        const draw = () => {
            const w = canvas.width / dpr
            const h = canvas.height / dpr
            ctx.clearRect(0, 0, w, h)

            for (const star of stars) {
                star.z -= star.speed
                if (star.z <= 0) { star.z = 1; star.x = Math.random(); star.y = Math.random() }

                const sx = (star.x - 0.5) / star.z * w * 0.5 + w * 0.5
                const sy = (star.y - 0.5) / star.z * h * 0.5 + h * 0.5
                const r = (1 - star.z) * 1.8
                const a = (1 - star.z) * 0.7

                // Streak effect
                const streakLen = (1 - star.z) * 8
                const dx = (star.x - 0.5)
                const dy = (star.y - 0.5)
                const mag = Math.sqrt(dx * dx + dy * dy) || 1
                const nx = dx / mag * streakLen
                const ny = dy / mag * streakLen

                ctx.beginPath()
                ctx.moveTo(sx, sy)
                ctx.lineTo(sx + nx, sy + ny)
                ctx.strokeStyle = `rgba(180, 200, 255, ${a})`
                ctx.lineWidth = r * 0.6
                ctx.stroke()

                ctx.beginPath()
                ctx.arc(sx, sy, r, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(200, 220, 255, ${a})`
                ctx.fill()
            }

            animFrameRef.current = requestAnimationFrame(draw)
        }

        // Respect reduced motion
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
        if (!mq.matches) {
            draw()
        } else {
            // Draw one static frame
            const w = canvas.width / dpr
            const h = canvas.height / dpr
            ctx.clearRect(0, 0, w, h)
            for (const star of stars) {
                const sx = star.x * w
                const sy = star.y * h
                ctx.beginPath()
                ctx.arc(sx, sy, 0.8, 0, Math.PI * 2)
                ctx.fillStyle = 'rgba(200, 220, 255, 0.3)'
                ctx.fill()
            }
        }

        return () => {
            window.removeEventListener('resize', resize)
            if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
        }
    }, [])

    useEffect(() => {
        if (isVisible) return initStarfield()
    }, [isVisible, initStarfield])

    return (
        <div ref={sectionRef} className={`${styles.buildSection} ${isVisible ? styles.buildVisible : ''}`} onMouseMove={handleMouseMove}>
            <canvas ref={canvasRef} className={styles.starfield} />
            <div className={styles.buildGlow} />

            {/* Characters floating in space */}
            <svg ref={svgRef} className={styles.buildSvg} viewBox="0 0 800 200" fill="none" preserveAspectRatio="xMidYMid meet">
                {/* Energy trails connecting characters */}
                <path id="trailA" d="M120 100 Q260 30 400 80" className={styles.pathLine} />
                <path id="trailB" d="M400 80 Q540 130 680 90" className={styles.pathLine} />

                {/* Flowing particles */}
                {[0, 1, 2].map(i => (
                    <React.Fragment key={i}>
                        <circle r="2.5" className={styles.particle}>
                            <animateMotion dur={`${2.5 + i * 0.5}s`} repeatCount="indefinite" begin={`${i * 0.7}s`}>
                                <mpath href="#trailA" />
                            </animateMotion>
                        </circle>
                        <circle r="2.5" className={styles.particle}>
                            <animateMotion dur={`${2.5 + i * 0.5}s`} repeatCount="indefinite" begin={`${i * 0.7}s`}>
                                <mpath href="#trailB" />
                            </animateMotion>
                        </circle>
                    </React.Fragment>
                ))}

                {/* Three mascots floating with gentle bob animation */}
                <Mascot x={120} y={100} scale={1.4} delay={0} className={styles.floatA} eyeOffset={eyeOffsets[0]} blinkClass={styles.blinkA} />
                <Mascot x={400} y={75} scale={1.6} delay={0.3} className={styles.floatB} eyeOffset={eyeOffsets[1]} blinkClass={styles.blinkB} />
                <Mascot x={680} y={90} scale={1.4} delay={0.6} className={styles.floatC} eyeOffset={eyeOffsets[2]} blinkClass={styles.blinkC} />

                {/* Cursors orbiting around mascots */}
                <Cursor x={170} y={78} scale={0.7} delay={0} className={styles.orbitA} />
                <Cursor x={450} y={55} scale={0.8} delay={0.4} className={styles.orbitB} />
                <Cursor x={730} y={68} scale={0.7} delay={0.8} className={styles.orbitC} />

                {/* Labels under each mascot */}
                <text x="120" y="140" className={styles.nodeLabel}>Demonstrate</text>
                <text x="400" y="118" className={styles.nodeLabel}>Learn</text>
                <text x="680" y="130" className={styles.nodeLabel}>Automate</text>
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
