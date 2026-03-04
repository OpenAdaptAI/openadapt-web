import React, { useRef, useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { createNoise3D } from 'simplex-noise'

import styles from './IndustriesGrid.module.css'

/* Generate an SVG gear path with flat-topped trapezoidal teeth */
function gearPath(teeth, innerR, outerR) {
    const step = (2 * Math.PI) / teeth
    // Proportions within each tooth period
    const gap = 0.30      // fraction for valley between teeth
    const rise = 0.10     // fraction for rising edge
    const flat = 0.30     // fraction for flat tooth top
    const fall = 0.10     // fraction for falling edge
    // remaining 0.20 is second half of gap (auto-closed)
    const pt = (angle, r) => `${(r * Math.cos(angle)).toFixed(2)} ${(r * Math.sin(angle)).toFixed(2)}`
    let d = ''
    for (let i = 0; i < teeth; i++) {
        const base = i * step - Math.PI / 2
        const a0 = base                                            // gap start
        const a1 = base + gap * step                               // gap end / rise start
        const a2 = base + (gap + rise) * step                     // rise end / flat top start
        const a3 = base + (gap + rise + flat) * step              // flat top end / fall start
        const a4 = base + (gap + rise + flat + fall) * step       // fall end / next gap
        if (i === 0) d += `M${pt(a0, innerR)} `
        d += `L${pt(a1, innerR)} `  // along inner radius (gap)
        d += `L${pt(a2, outerR)} `  // rise to outer
        d += `L${pt(a3, outerR)} `  // flat top
        d += `L${pt(a4, innerR)} `  // fall to inner
    }
    return d + 'Z'
}

/*
 * BuildForYouSection — 3-node energy circuit: Demonstrate → Learn → Automate
 * Canvas: perspective wireframe mesh with noise deformation
 * SVG: SMIL-animated energy pulse traveling the circuit
 */
function BuildForYouSection() {
    const sectionRef = useRef(null)
    const canvasRef = useRef(null)
    const [isVisible, setIsVisible] = useState(false)

    // Eye tracking refs for Learn mascot only
    const eyeC0Ref = useRef(null)
    const eyeC1Ref = useRef(null)

    useEffect(() => {
        // Fallback visibility unlock in case IntersectionObserver misses this section
        // (e.g. reduced-motion/preview environments).
        const fallbackTimer = window.setTimeout(() => setIsVisible(true), 1200)
        if (!('IntersectionObserver' in window)) {
            setIsVisible(true)
            return () => window.clearTimeout(fallbackTimer)
        }
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                    window.clearTimeout(fallbackTimer)
                }
            },
            { threshold: 0.15 }
        )
        if (sectionRef.current) observer.observe(sectionRef.current)
        return () => {
            window.clearTimeout(fallbackTimer)
            observer.disconnect()
        }
    }, [])

    /* Mouse → eye tracking for Learn mascot */
    const handleMouseMove = useCallback((e) => {
        const svg = e.currentTarget
        const rect = svg.getBoundingClientRect()
        const mx = ((e.clientX - rect.left) / rect.width) * 800
        const my = ((e.clientY - rect.top) / rect.height) * 220
        const dx = mx - 400, dy = my - 100
        const d = Math.sqrt(dx * dx + dy * dy) || 1
        const ex = (dx / d) * 1.5, ey = (dy / d)
        if (eyeC0Ref.current) { eyeC0Ref.current.setAttribute('x', -8 + ex); eyeC0Ref.current.setAttribute('y', -2 + ey) }
        if (eyeC1Ref.current) { eyeC1Ref.current.setAttribute('x', 4 + ex); eyeC1Ref.current.setAttribute('y', -2 + ey) }
    }, [])

    const handleMouseLeave = useCallback(() => {
        if (eyeC0Ref.current) { eyeC0Ref.current.setAttribute('x', -8); eyeC0Ref.current.setAttribute('y', -2) }
        if (eyeC1Ref.current) { eyeC1Ref.current.setAttribute('x', 4); eyeC1Ref.current.setAttribute('y', -2) }
    }, [])

    /* Wireframe mesh canvas */
    useEffect(() => {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
        // In reduced-motion mode the section can still render as visible via CSS.
        // Keep a gentle mesh animation running so the preview never looks frozen.
        if (!isVisible && !mq.matches) return
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        const dpr = window.devicePixelRatio || 1
        const motionScale = mq.matches ? 0.35 : 1
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

        const noise3D = createNoise3D()

        // Grid parameters — reduce on mobile
        const isMobile = window.innerWidth < 640
        const COLS = isMobile ? 20 : 40
        const ROWS = isMobile ? 8 : 15
        const SPACING = 25

        // Perspective
        const PERSPECTIVE = 300
        const TILT = 0.3

        function project(wx, wy, wz, centerX, centerY) {
            const cosT = Math.cos(TILT), sinT = Math.sin(TILT)
            const ry = wy * cosT - wz * sinT
            const rz = wy * sinT + wz * cosT
            const scale = PERSPECTIVE / (rz + PERSPECTIVE)
            return { x: centerX + wx * scale, y: centerY + ry * scale, scale }
        }

        // Build grid points
        const grid = []
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                grid.push({
                    wx: (c - COLS / 2) * SPACING,
                    wz: r * SPACING + 50,
                    wy: 0,
                    projX: 0, projY: 0, depth: 0,
                })
            }
        }

        let time = 0

        // Energy pulse tracking — synced to SMIL heartbeat cycle
        // Lub (strong): D glow → D→L pulse (1.5s)
        // Processing: Learn glows + gears spin (1.5s)
        // Dub (snappy): L→A pulse (1.0s) → A glow
        // Return: faint A→D (1.5s) + pause (0.5s)
        // Total: 1.5 + 1.5 + 1.0 + 0.5 + 1.5 + 0.5 = 6.5s
        const CYCLE_DUR = 6.5
        let pulseX = 0, pulseY = 0, pulseActive = false

        function getNodeScreenPositions(w, h) {
            // Map SVG viewBox positions to canvas coords
            const svgEl = canvas.parentElement?.querySelector('svg')
            if (svgEl) {
                const svgRect = svgEl.getBoundingClientRect()
                const secRect = canvas.parentElement.getBoundingClientRect()
                const sx = svgRect.width / 800
                const sy = svgRect.height / 220
                const offX = svgRect.left - secRect.left
                const offY = svgRect.top - secRect.top
                return [
                    { x: offX + 150 * sx, y: offY + 110 * sy },  // Demonstrate
                    { x: offX + 400 * sx, y: offY + 100 * sy },  // Learn
                    { x: offX + 650 * sx, y: offY + 110 * sy },  // Automate
                ]
            }
            return [
                { x: w * 0.2, y: h * 0.3 },
                { x: w * 0.5, y: h * 0.28 },
                { x: w * 0.8, y: h * 0.3 },
            ]
        }

        // Quadratic bezier point interpolation
        function quadBezier(t, p0x, p0y, cpx, cpy, p1x, p1y) {
            const u = 1 - t
            return {
                x: u * u * p0x + 2 * u * t * cpx + t * t * p1x,
                y: u * u * p0y + 2 * u * t * cpy + t * t * p1y,
            }
        }

        const draw = () => {
            const w = canvas.width / dpr, h = canvas.height / dpr
            ctx.clearRect(0, 0, w, h)

            const nodes = getNodeScreenPositions(w, h)
            const [attrL, attrC, attrR] = nodes

            // Compute cycle phase (heartbeat rhythm)
            const ct = (time / 60) % CYCLE_DUR  // frames → approx seconds
            pulseActive = false

            // Pulse position tracks the energy comet
            if (ct < 1.5) {
                // Lub: D→L pulse
                const t = ct / 1.5
                const pt = quadBezier(t, attrL.x, attrL.y, (attrL.x + attrC.x) / 2, Math.min(attrL.y, attrC.y) - 30, attrC.x, attrC.y)
                pulseX = pt.x; pulseY = pt.y; pulseActive = true
            } else if (ct >= 3.0 && ct < 4.0) {
                // Dub: L→A pulse (faster/snappier)
                const t = (ct - 3.0) / 1.0
                const pt = quadBezier(t, attrC.x, attrC.y, (attrC.x + attrR.x) / 2, Math.min(attrC.y, attrR.y) - 30, attrR.x, attrR.y)
                pulseX = pt.x; pulseY = pt.y; pulseActive = true
            } else if (ct >= 4.5 && ct < 6.0) {
                // Return: faint A→D
                const t = (ct - 4.5) / 1.5
                const pt = quadBezier(t, attrR.x, attrR.y + 20, (attrL.x + attrR.x) / 2, Math.max(attrL.y, attrR.y) + 60, attrL.x, attrL.y + 20)
                pulseX = pt.x; pulseY = pt.y; pulseActive = true
            }

            // ── Heartbeat global displacement ──
            // Lub: strong pulse at cycle start, Dub: lighter pulse at t≈3
            let heartbeat = 0
            if (ct < 1.0) {
                heartbeat = Math.sin(ct * Math.PI) * Math.exp(-ct * 2.5) * 12 * motionScale
            }
            const dubT = ct - 3.0
            if (dubT > 0 && dubT < 0.7) {
                heartbeat += Math.sin(dubT * Math.PI / 0.7) * Math.exp(-dubT * 3) * 7 * motionScale
            }

            // ── Sequential node glow ──
            // Track which nodes are "lit" at this moment
            const nodeGlow = [0, 0, 0] // [Demonstrate, Learn, Automate]
            if (ct < 1.5) {
                nodeGlow[0] = ct < 0.5 ? Math.sin(ct * Math.PI / 0.5) : Math.max(0, 1 - (ct - 0.5) / 1.0)
            }
            if (ct >= 1.5 && ct < 3.0) {
                const lt = (ct - 1.5) / 1.5
                nodeGlow[1] = Math.sin(lt * Math.PI) // Learn peaks during processing
            }
            if (ct >= 3.0 && ct < 4.0) {
                nodeGlow[1] = Math.max(0, 1 - (ct - 3.0) / 0.5) // Learn fading
            }
            if (ct >= 4.0 && ct < 5.0) {
                const at = (ct - 4.0) / 1.0
                nodeGlow[2] = Math.sin(at * Math.PI * 0.5) // Automate peaks
            }

            // Update grid heights
            for (let i = 0; i < grid.length; i++) {
                const p = grid[i]
                // Base noise deformation + heartbeat throb
                p.wy = noise3D(p.wx * 0.008, p.wz * 0.008, time * 0.005) * (12 * motionScale) - heartbeat

                // Project to get screen coords
                const proj = project(p.wx, p.wy, p.wz, w / 2, h * 0.6)
                p.projX = proj.x
                p.projY = proj.y
                p.depth = proj.scale
            }

            // Second pass: reactive zones + pulse ripple
            for (let i = 0; i < grid.length; i++) {
                const p = grid[i]
                let uplift = 0

                // Uplift near active circuit nodes (stronger when node is glowing)
                const nodesArr = [attrL, attrC, attrR]
                for (let n = 0; n < 3; n++) {
                    const attr = nodesArr[n]
                    const dx = p.projX - attr.x, dy = p.projY - attr.y
                    const dist = Math.sqrt(dx * dx + dy * dy)
                    const baseUplift = dist < 100 ? (1 - dist / 100) * 5 : 0
                    const glowUplift = dist < 120 ? (1 - dist / 120) * nodeGlow[n] * 10 : 0
                    uplift += baseUplift + glowUplift
                }

                // Energy pulse ripple (stronger, wider)
                if (pulseActive) {
                    const dx = p.projX - pulseX, dy = p.projY - pulseY
                    const dist = Math.sqrt(dx * dx + dy * dy)
                    if (dist < 250) {
                        const wave = Math.sin(dist * 0.04 - time * 0.2) * (1 - dist / 250) * 10
                        uplift += wave
                    }
                }

                if (uplift !== 0) {
                    p.wy -= uplift
                    const proj = project(p.wx, p.wy, p.wz, w / 2, h * 0.6)
                    p.projX = proj.x
                    p.projY = proj.y
                    p.depth = proj.scale
                }
            }

            // Store node brightness per grid point for rendering
            const nodesArr = [attrL, attrC, attrR]

            // Draw grid lines
            for (let r = 0; r < ROWS; r++) {
                for (let c = 0; c < COLS; c++) {
                    const i = r * COLS + c
                    const p = grid[i]
                    const baseAlpha = Math.min(p.depth * 0.5, 0.4)

                    // Compute glow brightness from active nodes
                    let brightness = 0
                    for (let n = 0; n < 3; n++) {
                        if (nodeGlow[n] > 0.01) {
                            const dx = p.projX - nodesArr[n].x, dy = p.projY - nodesArr[n].y
                            const dist = Math.sqrt(dx * dx + dy * dy)
                            if (dist < 120) {
                                brightness += nodeGlow[n] * (1 - dist / 120)
                            }
                        }
                    }
                    // Pulse proximity brightness
                    if (pulseActive) {
                        const dx = p.projX - pulseX, dy = p.projY - pulseY
                        const dist = Math.sqrt(dx * dx + dy * dy)
                        if (dist < 100) brightness += (1 - dist / 100) * 0.6
                    }
                    brightness = Math.min(brightness, 1)

                    const alpha = baseAlpha + brightness * 0.5

                    // Color: purple → blue by depth, shifting toward cyan when bright
                    const rowT = r / ROWS
                    const cr = Math.round(86 + (96 - 86) * rowT + brightness * (0 - 86))
                    const cg = Math.round(13 + (165 - 13) * rowT + brightness * (220 - 13 - 152 * rowT))
                    const cb = Math.round(248 + (250 - 248) * rowT + brightness * (255 - 248))
                    const lineColor = `rgba(${Math.max(0, Math.min(255, cr))}, ${Math.max(0, Math.min(255, cg))}, ${Math.max(0, Math.min(255, cb))}, ${Math.min(alpha, 0.8)})`
                    const lineWidth = 0.5 + p.depth * 0.5 + brightness * 0.5

                    // Horizontal line to right neighbor
                    if (c < COLS - 1) {
                        const right = grid[i + 1]
                        ctx.beginPath()
                        ctx.moveTo(p.projX, p.projY)
                        ctx.lineTo(right.projX, right.projY)
                        ctx.strokeStyle = lineColor
                        ctx.lineWidth = lineWidth
                        ctx.stroke()
                    }
                    // Vertical line to next row
                    if (r < ROWS - 1) {
                        const below = grid[i + COLS]
                        ctx.beginPath()
                        ctx.moveTo(p.projX, p.projY)
                        ctx.lineTo(below.projX, below.projY)
                        ctx.strokeStyle = lineColor
                        ctx.lineWidth = lineWidth
                        ctx.stroke()
                    }
                }
            }

            // Draw intersection dots (brighter near active nodes / pulse)
            for (const p of grid) {
                let dotBrightness = 0
                for (let n = 0; n < 3; n++) {
                    if (nodeGlow[n] > 0.01) {
                        const dx = p.projX - nodesArr[n].x, dy = p.projY - nodesArr[n].y
                        const dist = Math.sqrt(dx * dx + dy * dy)
                        if (dist < 100) dotBrightness += nodeGlow[n] * (1 - dist / 100)
                    }
                }
                if (pulseActive) {
                    const dx = p.projX - pulseX, dy = p.projY - pulseY
                    const dist = Math.sqrt(dx * dx + dy * dy)
                    if (dist < 80) dotBrightness += (1 - dist / 80) * 0.8
                }
                dotBrightness = Math.min(dotBrightness, 1)
                const dotAlpha = Math.min(p.depth * 0.3 + dotBrightness * 0.5, 0.8)
                const dotR = p.depth * 1.5 + dotBrightness * 1.5
                const dotG = Math.round(165 + dotBrightness * 55)
                ctx.beginPath()
                ctx.arc(p.projX, p.projY, dotR, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(${Math.round(96 - dotBrightness * 96)}, ${dotG}, 250, ${dotAlpha})`
                ctx.fill()
            }

            time += motionScale
            raf = requestAnimationFrame(draw)
        }

        draw()

        return () => { window.removeEventListener('resize', resize); if (raf) cancelAnimationFrame(raf) }
    }, [isVisible])

    const gear1 = gearPath(8, 6, 10)
    const gear2 = gearPath(6, 4.5, 7)

    return (
        <div ref={sectionRef} className={`${styles.buildSection} ${isVisible ? styles.buildVisible : ''}`}>
            <canvas ref={canvasRef} className={styles.starfield} />
            <div className={styles.buildGlow} />

            <svg className={styles.buildSvg} viewBox="0 0 800 220" fill="none"
                onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
                <defs>
                    {/* Circuit paths */}
                    <path id="pathDL" d="M170 110 Q285 55 400 95" />
                    <path id="pathLA" d="M400 95 Q515 55 630 110" />
                    <path id="pathReturn" d="M630 130 Q400 185 170 130" />

                    {/* Energy glow filter */}
                    <filter id="glow-energy" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur">
                            <animate attributeName="stdDeviation" values="3;5;3" dur="4s" repeatCount="indefinite" />
                        </feGaussianBlur>
                        <feColorMatrix in="blur" type="matrix"
                            values="0 0 0 0 0
                                    0 0 0 0 0.9
                                    0 0 0 0 1
                                    0 0 0 0.5 0"
                            result="colorBlur" />
                        <feMerge>
                            <feMergeNode in="colorBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>

                    {/* Radial glow gradient for node spotlights */}
                    <radialGradient id="nodeSpot">
                        <stop offset="0%" stopColor="white" stopOpacity="0.5" />
                        <stop offset="50%" stopColor="white" stopOpacity="0.15" />
                        <stop offset="100%" stopColor="white" stopOpacity="0" />
                    </radialGradient>
                </defs>

                {/* ── Node glow spotlights (white, behind everything) ── */}
                <ellipse cx="150" cy="140" rx="55" ry="50" fill="url(#nodeSpot)" opacity="0.06">
                    <animate attributeName="opacity" values="0.06;0.22;0.22;0.06" keyTimes="0;0.1;0.6;1" dur="1.5s"
                        begin="0s; animReturn.end + 0.5s" />
                </ellipse>
                <ellipse cx="400" cy="138" rx="60" ry="55" fill="url(#nodeSpot)" opacity="0.06">
                    <animate attributeName="opacity" values="0.06;0.25;0.25;0.06" keyTimes="0;0.1;0.8;1" dur="1.5s"
                        begin="animDL.end" />
                </ellipse>
                <ellipse cx="650" cy="140" rx="55" ry="50" fill="url(#nodeSpot)" opacity="0.06">
                    <animate attributeName="opacity" values="0.06;0.22;0.22;0.06" keyTimes="0;0.1;0.5;1" dur="1s"
                        begin="animLA.end" />
                </ellipse>

                {/* ── Circuit paths with flowing dashes ── */}
                <use href="#pathDL" className={styles.pathLine} filter="url(#glow-energy)" />
                <use href="#pathLA" className={styles.pathLine} filter="url(#glow-energy)" />
                <use href="#pathReturn" className={styles.pathLineReturn} />

                {/* ── Energy pulse: D→L (Lub — strong, 1.5s) ── */}
                <circle r="4" fill="cyan" opacity="0" filter="url(#glow-energy)">
                    <animateMotion id="animDL" dur="1.5s" begin="0s; animReturn.end + 0.5s" fill="freeze">
                        <mpath href="#pathDL" />
                    </animateMotion>
                    <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.8;1" dur="1.5s"
                        begin="0s; animReturn.end + 0.5s" />
                </circle>

                {/* ── Energy pulse: L→A (Dub — snappy, 1.0s) ── */}
                <circle r="3" fill="cyan" opacity="0" filter="url(#glow-energy)">
                    <animateMotion id="animLA" dur="1s" begin="animDL.end + 1.5s" fill="freeze">
                        <mpath href="#pathLA" />
                    </animateMotion>
                    <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.8;1" dur="1s"
                        begin="animDL.end + 1.5s" />
                </circle>

                {/* ── Return pulse: A→D (faint, 1.5s) ── */}
                <circle r="2" fill="rgba(86,13,248,0.6)" opacity="0">
                    <animateMotion id="animReturn" dur="1.5s" begin="animLA.end + 0.5s" fill="freeze">
                        <mpath href="#pathReturn" />
                    </animateMotion>
                    <animate attributeName="opacity" values="0;0.3;0.3;0" keyTimes="0;0.1;0.8;1" dur="1.5s"
                        begin="animLA.end + 0.5s" />
                </circle>

                {/* ── Demonstrate node (left cursor) ── */}
                <g>
                    <animateTransform attributeName="transform" type="translate" values="150,110; 150,107; 150,110" dur="5s" repeatCount="indefinite" />
                    <g transform="scale(1.0)">
                        <path d="M0 -10 L0 10 L4 6 L8 14 L10 13 L6 5 L11 5 Z"
                            fill="rgba(255,255,255,0.9)" stroke="rgba(86,13,248,0.6)" strokeWidth="0.8" />
                    </g>
                    {/* REC dot */}
                    <circle cx="12" cy="-8" r="2.5" fill="#ef4444">
                        <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
                    </circle>
                    {/* Click ripple synced to pulse emission */}
                    <circle r="4" fill="none" stroke="rgba(96,165,250,0.5)" strokeWidth="1">
                        <animate attributeName="r" values="4;20;20" keyTimes="0;0.3;1" dur="1.5s"
                            begin="0s; animReturn.end + 0.5s" />
                        <animate attributeName="opacity" values="0.5;0;0" keyTimes="0;0.3;1" dur="1.5s"
                            begin="0s; animReturn.end + 0.5s" />
                    </circle>
                </g>

                {/* ── Learn node (center mascot with gears) ── */}
                <g transform="translate(400, 100)">
                    {/* Mascot body */}
                    <g transform="scale(1.8)">
                        <path d="M-12 -8 L12 -8 Q16 -8 16 -4 L16 8 Q16 12 12 12 L4 12 L-2 16 L-2 12 L-12 12 Q-16 12 -16 8 L-16 -4 Q-16 -8 -12 -8 Z"
                            fill="rgba(86, 13, 248, 0.15)" stroke="rgba(96, 165, 250, 0.5)" strokeWidth="0.8" />
                        {/* Eyes */}
                        <g className={styles.blinkC}>
                            <rect ref={eyeC0Ref} x="-8" y="-2" width="4" height="4" rx="0.5" fill="rgba(255,255,255,0.9)" />
                            <rect ref={eyeC1Ref} x="4" y="-2" width="4" height="4" rx="0.5" fill="rgba(255,255,255,0.9)" />
                        </g>
                        {/* Smile */}
                        <path d="M-5 6 Q0 10 5 6" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="1.2" strokeLinecap="round" />
                        {/* Antenna */}
                        <line x1="0" y1="-8" x2="0" y2="-14" stroke="rgba(96,165,250,0.5)" strokeWidth="1" />
                        <circle cx="0" cy="-15" r="2" fill="rgba(96,165,250,0.7)" className={styles.antennaPulse} />
                    </g>
                    {/* Gear 1 (8 teeth, CW) — spins when Learn is active */}
                    <g transform="translate(-13, 0)">
                        <g>
                            <animateTransform attributeName="transform" type="rotate"
                                from="0" to="360" dur="1.5s" begin="animDL.end" fill="remove" />
                            <path d={gear1} fill="rgba(96, 165, 250, 0.25)" stroke="rgba(96, 165, 250, 0.5)" strokeWidth="0.6" />
                            <circle r="3" fill="rgba(86, 13, 248, 0.3)" stroke="rgba(96, 165, 250, 0.4)" strokeWidth="0.4" />
                        </g>
                    </g>
                    {/* Gear 2 (6 teeth, CCW, interlocking) */}
                    <g transform="translate(11, 9)">
                        <g>
                            <animateTransform attributeName="transform" type="rotate"
                                from="0" to="-360" dur="1.5s" begin="animDL.end" fill="remove" />
                            <path d={gear2} fill="rgba(96, 165, 250, 0.25)" stroke="rgba(96, 165, 250, 0.5)" strokeWidth="0.6" />
                            <circle r="2.5" fill="rgba(86, 13, 248, 0.3)" stroke="rgba(96, 165, 250, 0.4)" strokeWidth="0.4" />
                        </g>
                    </g>
                    {/* Processing glow ring */}
                    <circle r="25" fill="none" stroke="cyan" strokeWidth="1.5" opacity="0">
                        <animate attributeName="opacity" values="0;0.6;0.6;0" keyTimes="0;0.1;0.8;1" dur="1.5s"
                            begin="animDL.end" fill="remove" />
                        <animate attributeName="r" values="22;35" dur="1.5s"
                            begin="animDL.end" fill="remove" />
                    </circle>
                </g>

                {/* ── Automate node (right cursor) ── */}
                <g>
                    <animateTransform attributeName="transform" type="translate" values="650,110; 650,107; 650,110" dur="4.5s" repeatCount="indefinite" />
                    <g transform="scale(1.0)">
                        <path d="M0 -10 L0 10 L4 6 L8 14 L10 13 L6 5 L11 5 Z"
                            fill="rgba(255,255,255,0.9)" stroke="rgba(96,165,250,0.6)" strokeWidth="0.8" />
                    </g>
                    {/* Play/lightning icon */}
                    <g transform="translate(12, -8)">
                        <path d="M-1.5 -3 L2 0 L-1.5 3 Z" fill="rgba(96,165,250,0.9)" stroke="none" />
                    </g>
                    {/* Click ripple synced to pulse arrival */}
                    <circle r="4" fill="none" stroke="rgba(96,165,250,0.5)" strokeWidth="1">
                        <animate attributeName="r" values="4;20;20" keyTimes="0;0.3;1" dur="1s"
                            begin="animLA.end" />
                        <animate attributeName="opacity" values="0.5;0;0" keyTimes="0;0.3;1" dur="1s"
                            begin="animLA.end" />
                    </circle>
                </g>

                {/* ── Labels ── */}
                <text x="150" y="175" className={styles.nodeLabel}>Demonstrate</text>
                <text x="400" y="180" className={styles.nodeLabel}>Learn</text>
                <text x="650" y="175" className={styles.nodeLabel}>Automate</text>
            </svg>

            <div className={styles.buildContent}>
                <h2 className={styles.buildTitle}>Let us build for you</h2>
                <p className={styles.buildDesc}>
                    If OpenAdapt doesn&#39;t fully automate your workflow out of the box, we&#39;ll work with you to fix that.
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
