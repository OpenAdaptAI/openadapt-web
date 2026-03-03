import { useEffect, useRef } from 'react'

export default function ParticleField() {
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let animationId
        const particles = []
        const PARTICLE_COUNT = 60

        function resize() {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }

        function initParticles() {
            particles.length = 0
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.25,
                    vy: (Math.random() - 0.5) * 0.25,
                    size: Math.random() * 1.2 + 0.4,
                    opacity: Math.random() * 0.4 + 0.08,
                })
            }
        }

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            for (const p of particles) {
                p.x += p.vx
                p.y += p.vy
                if (p.x < 0) p.x = canvas.width
                if (p.x > canvas.width) p.x = 0
                if (p.y < 0) p.y = canvas.height
                if (p.y > canvas.height) p.y = 0

                ctx.beginPath()
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(129, 140, 248, ${p.opacity})`
                ctx.fill()
            }

            // Faint connection lines between nearby particles
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x
                    const dy = particles[i].y - particles[j].y
                    const dist = Math.sqrt(dx * dx + dy * dy)
                    if (dist < 100) {
                        ctx.beginPath()
                        ctx.moveTo(particles[i].x, particles[i].y)
                        ctx.lineTo(particles[j].x, particles[j].y)
                        ctx.strokeStyle = `rgba(99, 102, 241, ${0.04 * (1 - dist / 100)})`
                        ctx.lineWidth = 0.5
                        ctx.stroke()
                    }
                }
            }

            animationId = requestAnimationFrame(draw)
        }

        resize()
        initParticles()
        draw()

        const handleResize = () => { resize(); initParticles() }
        window.addEventListener('resize', handleResize)

        return () => {
            cancelAnimationFrame(animationId)
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                inset: 0,
                pointerEvents: 'none',
                zIndex: 0,
            }}
            aria-hidden="true"
        />
    )
}
