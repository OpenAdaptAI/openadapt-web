import { useEffect, useRef, useState } from 'react'

import styles from './EvidenceMediaPlayer.module.css'

const clock = (seconds) => {
    if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
    const whole = Math.floor(seconds)
    return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, '0')}`
}

export default function EvidenceMediaPlayer({
    media,
    application,
    phase,
    exactTimeline = null,
}) {
    const playerRef = useRef(null)
    const videoRef = useRef(null)
    const manuallyPaused = useRef(false)
    const [playing, setPlaying] = useState(false)
    const [visible, setVisible] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [motionAllowed, setMotionAllowed] = useState(false)
    const [activeFrame, setActiveFrame] = useState(null)

    useEffect(() => {
        const reduced = window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        ).matches
        const saveData = navigator.connection?.saveData === true
        setMotionAllowed(!reduced && !saveData)
    }, [])

    useEffect(() => {
        const player = playerRef.current
        if (!player || typeof IntersectionObserver === 'undefined') {
            setVisible(true)
            return undefined
        }
        const observer = new IntersectionObserver(
            ([entry]) => setVisible(entry.isIntersecting),
            { threshold: 0.4 }
        )
        observer.observe(player)
        return () => observer.disconnect()
    }, [])

    useEffect(() => {
        const shouldPlay = motionAllowed && visible && !manuallyPaused.current
        if (media.kind === 'gif') {
            setPlaying(shouldPlay)
            return undefined
        }

        const video = videoRef.current
        if (!video) return undefined
        if (shouldPlay) {
            void video.play().catch(() => setPlaying(false))
        } else {
            video.pause()
        }
        return undefined
    }, [media.kind, motionAllowed, visible])

    useEffect(() => {
        setActiveFrame(null)
        if (
            exactTimeline?.binding !== 'exact-decoded-frame' ||
            media.kind !== 'video'
        ) {
            return undefined
        }

        const video = videoRef.current
        if (!video?.requestVideoFrameCallback) return undefined

        const framesByTime = new Map(
            exactTimeline.frames.map((frame) => [frame.mediaTimeUs, frame])
        )
        let callbackId
        const onVideoFrame = (_now, metadata) => {
            // `mediaTime` comes from the decoded frame callback, not the coarse
            // playback clock. Missing events clear the target immediately: no
            // persistence or interpolation across frames.
            const mediaTimeUs = Math.round(metadata.mediaTime * 1_000_000)
            setActiveFrame(framesByTime.get(mediaTimeUs) ?? null)
            callbackId = video.requestVideoFrameCallback(onVideoFrame)
        }
        callbackId = video.requestVideoFrameCallback(onVideoFrame)
        return () => video.cancelVideoFrameCallback?.(callbackId)
    }, [exactTimeline, media.kind, media.src])

    const toggle = () => {
        if (media.kind === 'gif') {
            const next = !playing
            manuallyPaused.current = !next
            setMotionAllowed(next)
            setPlaying(next && visible)
            return
        }
        const video = videoRef.current
        if (!video) return
        if (video.paused) {
            manuallyPaused.current = false
            setMotionAllowed(true)
            void video.play().catch(() => setPlaying(false))
        } else {
            manuallyPaused.current = true
            video.pause()
        }
    }

    const syncVideo = () => {
        const video = videoRef.current
        if (!video) return
        setPlaying(!video.paused)
        setCurrentTime(video.currentTime)
        setDuration(Number.isFinite(video.duration) ? video.duration : 0)
    }

    const phaseLabel = phase === 'recording' ? 'Demonstration' : 'Compiled replay'
    const exactBound = exactTimeline?.binding === 'exact-decoded-frame'
    const targetRect = activeFrame?.targetRect
    const hasTarget =
        exactBound &&
        targetRect &&
        ['x', 'y', 'width', 'height'].every(
            (key) =>
                Number.isFinite(targetRect[key]) &&
                targetRect[key] >= 0 &&
                targetRect[key] <= 1
        ) &&
        targetRect.x + targetRect.width <= 1 &&
        targetRect.y + targetRect.height <= 1
    const statusLabel = activeFrame?.statusLabel ?? phaseLabel
    const contextLabel =
        activeFrame?.stepLabel ??
        exactTimeline?.context?.label ??
        (exactBound ? 'timeline-bound view' : 'raw footage')

    return (
        <div
            className={styles.player}
            ref={playerRef}
            data-testid="reference-evidence-player"
            data-media-kind={media.kind}
            data-target-tracking={
                exactBound
                    ? 'exact-decoded-frame-bound'
                    : 'omitted-without-exact-timeline'
            }
        >
            <div className={styles.stage} style={{ aspectRatio: `${media.width} / ${media.height}` }}>
                {media.kind === 'video' ? (
                    <video
                        ref={videoRef}
                        className={styles.media}
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        poster={media.poster}
                        aria-label={media.alt}
                        onLoadedMetadata={syncVideo}
                        onDurationChange={syncVideo}
                        onTimeUpdate={syncVideo}
                        onPlay={syncVideo}
                        onPause={syncVideo}
                    >
                        <source src={media.src} type="video/webm" />
                        {media.fallbackSrc && (
                            <source src={media.fallbackSrc} type="video/mp4" />
                        )}
                    </video>
                ) : (
                    <img
                        className={styles.media}
                        src={playing ? media.src : media.poster}
                        alt={media.alt}
                        width={media.width}
                        height={media.height}
                        decoding="async"
                    />
                )}

                {hasTarget && (
                    <span
                        className={styles.target}
                        aria-hidden="true"
                        data-decoded-frame-index={activeFrame.decodedFrameIndex}
                        style={{
                            left: `${targetRect.x * 100}%`,
                            top: `${targetRect.y * 100}%`,
                            width: `${targetRect.width * 100}%`,
                            height: `${targetRect.height * 100}%`,
                        }}
                    />
                )}

                <div
                    className={styles.capsule}
                    aria-label={`OpenAdapt ${phaseLabel.toLowerCase()}`}
                    data-overlay-kind="source-metadata"
                >
                    <span className={styles.brand}>
                        <i aria-hidden="true" /> OpenAdapt
                    </span>
                    <span className={styles.phase}>{statusLabel}</span>
                    <small>
                        {application} · {contextLabel}
                    </small>
                </div>
            </div>

            <div
                className={styles.controls}
                role="group"
                aria-label={`${application} ${phaseLabel.toLowerCase()} playback controls`}
            >
                <button
                    type="button"
                    onClick={toggle}
                    aria-label={playing ? 'Pause' : 'Play'}
                >
                    <span aria-hidden="true">{playing ? 'Ⅱ' : '▶'}</span>
                </button>
                {media.kind === 'video' ? (
                    <>
                        <input
                            type="range"
                            min={0}
                            max={duration || 0}
                            step={0.04}
                            value={Math.min(currentTime, duration || 0)}
                            aria-label="Playback position"
                            onChange={(event) => {
                                if (!videoRef.current) return
                                videoRef.current.currentTime = Number(
                                    event.currentTarget.value
                                )
                                syncVideo()
                            }}
                        />
                        <span className={styles.time}>
                            {clock(currentTime)} / {clock(duration)}
                        </span>
                    </>
                ) : (
                    <span className={styles.time}>Looping evidence clip</span>
                )}
                <button
                    type="button"
                    aria-label="Enter full screen"
                    onClick={() => void playerRef.current?.requestFullscreen?.()}
                >
                    <span aria-hidden="true">⛶</span>
                </button>
            </div>
        </div>
    )
}
