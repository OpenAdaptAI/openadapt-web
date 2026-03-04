import React, { useRef, useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { createNoise3D } from 'simplex-noise'

import styles from './IndustriesGrid.module.css'

/*
 * BuildForYouSection — Two dancing pairs in hyperspace.
 * Uses SVG <animateMotion> for orbital motion — native browser animation,
 * immune to React re-render interference. Eyes track mouse via DOM refs.
 */
function BuildForYouSection() {
    const sectionRef = useRef(null)
    const canvasRef = useRef(null)
    const [isVisible, setIsVisible] = useState(false)

    // Eye tracking refs
    const eyeL0Ref = useRef(null)
    const eyeL1Ref = useRef(null)
    const eyeR0Ref = useRef(null)
    const eyeR1Ref = useRef(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setIsVisible(true) },
            { threshold: 0.15 }
        )
        if (sectionRef.current) observer.observe(sectionRef.current)
        return () => observer.disconnect()
    }, [])

    /* ── Mouse → eye tracking (direct DOM, no re-render) ── */
    const handleMouseMove = useCallback((e) => {
        const svg = e.currentTarget
        const rect = svg.getBoundingClientRect()
        const mx = ((e.clientX - rect.left) / rect.width) * 800
        const my = ((e.clientY - rect.top) / rect.height) * 220
        const update = (cx, cy, r0, r1) => {
            const dx = mx - cx, dy = my - cy
            const d = Math.sqrt(dx * dx + dy * dy) || 1
            const ex = (dx / d) * 1.5, ey = (dy / d)
            if (r0.current) { r0.current.setAttribute('x', -8 + ex); r0.current.setAttribute('y', -2 + ey) }
            if (r1.current) { r1.current.setAttribute('x', 4 + ex); r1.current.setAttribute('y', -2 + ey) }
        }
        update(240, 100, eyeL0Ref, eyeL1Ref)
        update(560, 100, eyeR0Ref, eyeR1Ref)
    }, [])

    const handleMouseLeave = useCallback(() => {
        [eyeL0Ref, eyeR0Ref].forEach(r => { if (r.current) { r.current.setAttribute('x', -8); r.current.setAttribute('y', -2) } })
        ;[eyeL1Ref, eyeR1Ref].forEach(r => { if (r.current) { r.current.setAttribute('x', 4); r.current.setAttribute('y', -2) } })
    }, [])

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

        const constellationNodes = Array.from({ length: 35 }, () => ({
            x: Math.random() * (canvas.width / dpr),
            y: Math.random() * (canvas.height / dpr),
            vx: (Math.random() - 0.5) * 0.15,
            vy: (Math.random() - 0.5) * 0.15,
            size: 0.8 + Math.random() * 0.7,
        }))
        const CONNECT_THRESHOLD = 140
        const CONNECT_THRESHOLD_SQ = CONNECT_THRESHOLD * CONNECT_THRESHOLD

        let wispTime = 0

        const wisps = [
            { baseY: 0.25, color: [86, 13, 248],  alpha: 0.14, freqs: [0.003, 0.007], amps: [40, 20], speeds: [0.002, 0.003],  offset: 0   },
            { baseY: 0.30, color: [96, 165, 250],  alpha: 0.12, freqs: [0.004, 0.005], amps: [35, 25], speeds: [0.0015, 0.0025], offset: 1.5 },
            { baseY: 0.22, color: [120, 40, 220],  alpha: 0.10, freqs: [0.002, 0.009], amps: [50, 15], speeds: [0.001, 0.004],  offset: 3.0 },
        ]

        // ── Flow field (Perlin noise cosmic dust) ──
        const noise3D = createNoise3D()
        const FLOW_PARTICLE_COUNT = 150
        const flowParticles = Array.from({ length: FLOW_PARTICLE_COUNT }, () => ({
            x: Math.random() * 800,
            y: Math.random() * 220,
            speed: 0.3 + Math.random() * 0.5,
            size: 0.4 + Math.random() * 0.8,
            color: Math.random() > 0.5
                ? [86, 13, 248]   // purple
                : [96, 165, 250], // blue
        }))
        let flowTime = 0
        let flowInitialized = false

        const draw = () => {
            const w = canvas.width / dpr, h = canvas.height / dpr
            ctx.clearRect(0, 0, w, h)

            // ── Aurora wisps (drawn before stars so stars appear on top) ──
            for (const wisp of wisps) {
                const baseY = wisp.baseY * h
                const [r, g, b] = wisp.color
                const ribbonHeight = (wisp.amps[0] + wisp.amps[1]) * 2

                ctx.beginPath()
                for (let x = 0; x <= w; x += 3) {
                    const y = baseY
                        + wisp.amps[0] * Math.sin(wisp.freqs[0] * x + wisp.offset + wispTime * wisp.speeds[0])
                        + wisp.amps[1] * Math.sin(wisp.freqs[1] * x + wisp.offset + wispTime * wisp.speeds[1])
                    if (x === 0) ctx.moveTo(x, y)
                    else ctx.lineTo(x, y)
                }
                // Close path downward to fill below the wave
                ctx.lineTo(w, baseY + ribbonHeight)
                ctx.lineTo(0, baseY + ribbonHeight)
                ctx.closePath()

                const grad = ctx.createLinearGradient(0, baseY - ribbonHeight, 0, baseY + ribbonHeight)
                grad.addColorStop(0,   `rgba(${r},${g},${b},0)`)
                grad.addColorStop(0.3, `rgba(${r},${g},${b},${wisp.alpha})`)
                grad.addColorStop(1,   `rgba(${r},${g},${b},0)`)

                ctx.fillStyle = grad
                ctx.fill()
            }

            wispTime++

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
            // Move constellation nodes
            for (const n of constellationNodes) {
                n.x += n.vx
                n.y += n.vy
                // Bounce off edges gently
                if (n.x < 0 || n.x > w) n.vx *= -1
                if (n.y < 0 || n.y > h) n.vy *= -1
                n.x = Math.max(0, Math.min(w, n.x))
                n.y = Math.max(0, Math.min(h, n.y))
            }

            // Draw connections (quadratic Bezier curves)
            for (let i = 0; i < constellationNodes.length; i++) {
                for (let j = i + 1; j < constellationNodes.length; j++) {
                    const a = constellationNodes[i], b = constellationNodes[j]
                    const dx = a.x - b.x, dy = a.y - b.y
                    const distSq = dx * dx + dy * dy
                    if (distSq < CONNECT_THRESHOLD_SQ) {
                        const dist = Math.sqrt(distSq)
                        const alpha = 0.15 * (1 - dist / CONNECT_THRESHOLD)
                        const mx = (a.x + b.x) / 2
                        const my = (a.y + b.y) / 2 - dist * 0.1 // slight upward arc
                        ctx.beginPath()
                        ctx.moveTo(a.x, a.y)
                        ctx.quadraticCurveTo(mx, my, b.x, b.y)
                        ctx.strokeStyle = `rgba(96, 165, 250, ${alpha})`
                        ctx.lineWidth = 0.7
                        ctx.stroke()
                    }
                }
            }

            // Draw nodes as tiny dots
            for (const n of constellationNodes) {
                ctx.beginPath()
                ctx.arc(n.x, n.y, n.size, 0, Math.PI * 2)
                ctx.fillStyle = 'rgba(180, 200, 255, 0.2)'
                ctx.fill()
            }

            // ── Flow field particles (cosmic dust, drawn on top of stars) ──
            // On first frame, scatter particles across actual canvas dimensions
            if (!flowInitialized) {
                for (const p of flowParticles) {
                    p.x = Math.random() * w
                    p.y = Math.random() * h
                }
                flowInitialized = true
            }
            const particleCount = w < 640 ? Math.floor(FLOW_PARTICLE_COUNT / 2) : FLOW_PARTICLE_COUNT
            const FLOW_SCALE = 0.003
            for (let i = 0; i < particleCount; i++) {
                const p = flowParticles[i]
                const angle = noise3D(p.x * FLOW_SCALE, p.y * FLOW_SCALE, flowTime) * Math.PI * 2
                p.x += Math.cos(angle) * p.speed
                p.y += Math.sin(angle) * p.speed

                // Wrap around edges
                if (p.x < 0) p.x = w
                if (p.x > w) p.x = 0
                if (p.y < 0) p.y = h
                if (p.y > h) p.y = 0

                ctx.beginPath()
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(${p.color[0]}, ${p.color[1]}, ${p.color[2]}, 0.2)`
                ctx.fill()
            }
            flowTime += 0.0008

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
            // Static constellation (no animation for reduced-motion)
            for (let i = 0; i < constellationNodes.length; i++) {
                for (let j = i + 1; j < constellationNodes.length; j++) {
                    const a = constellationNodes[i], b = constellationNodes[j]
                    const dx = a.x - b.x, dy = a.y - b.y
                    const distSq = dx * dx + dy * dy
                    if (distSq < CONNECT_THRESHOLD_SQ) {
                        const dist = Math.sqrt(distSq)
                        const alpha = 0.15 * (1 - dist / CONNECT_THRESHOLD)
                        const mx = (a.x + b.x) / 2
                        const my = (a.y + b.y) / 2 - dist * 0.1
                        ctx.beginPath()
                        ctx.moveTo(a.x, a.y)
                        ctx.quadraticCurveTo(mx, my, b.x, b.y)
                        ctx.strokeStyle = `rgba(96, 165, 250, ${alpha})`
                        ctx.lineWidth = 0.7
                        ctx.stroke()
                    }
                }
            }
            for (const n of constellationNodes) {
                ctx.beginPath()
                ctx.arc(n.x, n.y, n.size, 0, Math.PI * 2)
                ctx.fillStyle = 'rgba(180, 200, 255, 0.2)'
                ctx.fill()
            }
        }

        return () => { window.removeEventListener('resize', resize); if (raf) cancelAnimationFrame(raf) }
    }, [isVisible])

    return (
        <div ref={sectionRef} className={`${styles.buildSection} ${isVisible ? styles.buildVisible : ''}`}>
            <canvas ref={canvasRef} className={styles.starfield} />
            <div className={styles.buildGlow} />

            <svg className={styles.buildSvg} viewBox="0 0 800 220" fill="none"
                onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
                <defs>
                    {/* Elliptical orbit paths — rx=40 ry=22, gentle and unhurried */}
                    <path id="orbitL" d="M280 100 A40 22 0 0 1 200 100 A40 22 0 0 1 280 100" />
                    <path id="orbitR" d="M600 100 A40 22 0 0 0 520 100 A40 22 0 0 0 600 100" />
                    {/* Energy trail path */}
                    <path id="trailPath" d="M240 100 Q400 70 560 100" />

                    {/* ── Glow / bloom filters ── */}

                    {/* Blue glow for left (Demonstrate) pair */}
                    <filter id="glow-blue" x="-50%" y="-50%" width="200%" height="200%">
                        {/* Wide outer halo */}
                        <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blurWide">
                            <animate attributeName="stdDeviation" values="7;10;7" dur="4s" repeatCount="indefinite" />
                        </feGaussianBlur>
                        <feColorMatrix in="blurWide" type="matrix"
                            values="0 0 0 0 0.376
                                    0 0 0 0 0.647
                                    0 0 0 0 0.980
                                    0 0 0 0.2 0"
                            result="colorWide" />
                        {/* Tight inner glow */}
                        <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blurTight">
                            <animate attributeName="stdDeviation" values="2;4;2" dur="4s" repeatCount="indefinite" />
                        </feGaussianBlur>
                        <feColorMatrix in="blurTight" type="matrix"
                            values="0 0 0 0 0.376
                                    0 0 0 0 0.647
                                    0 0 0 0 0.980
                                    0 0 0 0.45 0"
                            result="colorTight" />
                        <feMerge>
                            <feMergeNode in="colorWide" />
                            <feMergeNode in="colorTight" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>

                    {/* Purple glow for right (Automate) pair */}
                    <filter id="glow-purple" x="-50%" y="-50%" width="200%" height="200%">
                        {/* Wide outer halo */}
                        <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blurWide">
                            <animate attributeName="stdDeviation" values="6;9;6" dur="3.5s" repeatCount="indefinite" />
                        </feGaussianBlur>
                        <feColorMatrix in="blurWide" type="matrix"
                            values="0 0 0 0 0.337
                                    0 0 0 0 0.051
                                    0 0 0 0 0.973
                                    0 0 0 0.18 0"
                            result="colorWide" />
                        {/* Tight inner glow */}
                        <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blurTight">
                            <animate attributeName="stdDeviation" values="2;4;2" dur="3.5s" repeatCount="indefinite" />
                        </feGaussianBlur>
                        <feColorMatrix in="blurTight" type="matrix"
                            values="0 0 0 0 0.337
                                    0 0 0 0 0.051
                                    0 0 0 0 0.973
                                    0 0 0 0.5 0"
                            result="colorTight" />
                        <feMerge>
                            <feMergeNode in="colorWide" />
                            <feMergeNode in="colorTight" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>

                    {/* Trail glow */}
                    <filter id="glow-trail" x="-20%" y="-200%" width="140%" height="500%">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur">
                            <animate attributeName="stdDeviation" values="2;3.5;2" dur="4s" repeatCount="indefinite" />
                        </feGaussianBlur>
                        <feColorMatrix in="blur" type="matrix"
                            values="0 0 0 0 0.376
                                    0 0 0 0 0.647
                                    0 0 0 0 0.980
                                    0 0 0 0.35 0"
                            result="colorBlur" />
                        <feMerge>
                            <feMergeNode in="colorBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Energy trail with flowing dashes */}
                <use href="#trailPath" className={styles.pathLine} filter="url(#glow-trail)" />

                {/* Particles flowing along the trail */}
                <g filter="url(#glow-trail)">
                {[0, 1, 2].map(i => (
                    <circle key={i} r="1.5" className={styles.particle}>
                        <animateMotion dur="7s" repeatCount="indefinite" begin={`${i * -2.33}s`}>
                            <mpath href="#trailPath" />
                        </animateMotion>
                    </circle>
                ))}
                </g>

                {/* ── Left pair: Demonstrate ── */}
                <g filter="url(#glow-blue)">

                {/* Cursor (leader) — orbits CW, 16s period */}
                <g>
                    <animateMotion dur="16s" repeatCount="indefinite">
                        <mpath href="#orbitL" />
                    </animateMotion>
                    <g transform="scale(0.8)">
                        <path d="M0 -10 L0 10 L4 6 L8 14 L10 13 L6 5 L11 5 Z"
                            fill="rgba(255,255,255,0.85)" stroke="rgba(86,13,248,0.5)" strokeWidth="0.8" />
                    </g>
                    {/* Click ripple pulses every 6s */}
                    <circle r="4" fill="none" stroke="rgba(96,165,250,0.3)" strokeWidth="1">
                        <animate attributeName="r" values="4;14;14" keyTimes="0;0.08;1" dur="6s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.4;0;0" keyTimes="0;0.08;1" dur="6s" repeatCount="indefinite" />
                    </circle>
                </g>

                {/* Mascot (follower) — same orbit, 180° offset */}
                <g>
                    <animateMotion dur="16s" repeatCount="indefinite" begin="-8s">
                        <mpath href="#orbitL" />
                    </animateMotion>
                    <g transform="scale(1.5)">
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
                </g>

                </g>{/* end glow-blue */}

                <text x="240" y="170" className={styles.nodeLabel}>Demonstrate</text>

                {/* ── Right pair: Automate ── */}
                <g filter="url(#glow-purple)">

                {/* Mascot (leader) — orbits CCW, 18.5s period */}
                <g>
                    <animateMotion dur="18.5s" repeatCount="indefinite">
                        <mpath href="#orbitR" />
                    </animateMotion>
                    <g transform="scale(1.5)">
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
                </g>

                {/* Cursor (follower) — same orbit, 180° offset */}
                <g>
                    <animateMotion dur="18.5s" repeatCount="indefinite" begin="-9.25s">
                        <mpath href="#orbitR" />
                    </animateMotion>
                    <g transform="scale(0.8)">
                        <path d="M0 -10 L0 10 L4 6 L8 14 L10 13 L6 5 L11 5 Z"
                            fill="rgba(255,255,255,0.85)" stroke="rgba(86,13,248,0.5)" strokeWidth="0.8" />
                    </g>
                    {/* Click ripple pulses every 7s */}
                    <circle r="4" fill="none" stroke="rgba(86,13,248,0.3)" strokeWidth="1">
                        <animate attributeName="r" values="4;14;14" keyTimes="0;0.07;1" dur="7s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.4;0;0" keyTimes="0;0.07;1" dur="7s" repeatCount="indefinite" />
                    </circle>
                </g>

                </g>{/* end glow-purple */}

                <text x="560" y="170" className={styles.nodeLabel}>Automate</text>
            </svg>

            <svg width="0" height="0" style={{ position: 'absolute' }}>
                <defs>
                    <filter id="shimmer" x="-5%" y="-5%" width="110%" height="110%">
                        <feTurbulence type="turbulence" baseFrequency="0.015" numOctaves="2" seed="1" result="noise">
                            <animate attributeName="baseFrequency" values="0.012;0.018;0.012" dur="8s" repeatCount="indefinite" />
                        </feTurbulence>
                        <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G">
                            <animate attributeName="scale" values="2;4;2" dur="6s" repeatCount="indefinite" />
                        </feDisplacementMap>
                    </filter>
                </defs>
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
