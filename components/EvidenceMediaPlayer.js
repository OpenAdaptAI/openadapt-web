import { useEffect, useMemo, useRef, useState } from 'react'

import {
    chooseOverlayPlacement,
    decodedMediaFrameIndex,
    exactTargetForDecodedFrame,
    executionOverlayFrameAt,
    executionRailForBoundContext,
    mapTargetToContainedVideo,
} from '../lib/executionOverlayTimeline'
import styles from './EvidenceMediaPlayer.module.css'

const clock = (seconds) => {
    if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
    const whole = Math.floor(seconds)
    return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, '0')}`
}

const PHASE_LABELS = Object.freeze({
    idle: 'Ready',
    observing: 'Observing',
    recording: 'Recording',
    executing: 'Executing',
    pausing: 'Pausing',
    paused: 'Paused',
    resuming: 'Resuming',
    stopping: 'Stopping',
    verifying: 'Verifying',
    verified: 'Verified',
    completed_unverified: 'Unverified',
    halted: 'Halted',
    failed: 'Failed',
    rolled_back: 'Rolled back',
})

export default function EvidenceMediaPlayer({
    media,
    application,
    phase,
    exactPresentation = null,
}) {
    const playerRef = useRef(null)
    const stageRef = useRef(null)
    const capsuleRef = useRef(null)
    const videoRef = useRef(null)
    const manuallyPaused = useRef(false)
    const placementRef = useRef({ eventSequence: null, placement: null })
    const [playing, setPlaying] = useState(false)
    const [visible, setVisible] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [motionAllowed, setMotionAllowed] = useState(false)
    const [decodedFrameIndex, setDecodedFrameIndex] = useState(null)
    const [geometryVersion, setGeometryVersion] = useState(0)
    const [placement, setPlacement] = useState('hidden')

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
        if (shouldPlay) void video.play().catch(() => setPlaying(false))
        else video.pause()
        return undefined
    }, [media.kind, media.src, motionAllowed, visible])

    useEffect(() => {
        const video = videoRef.current
        if (!video || media.kind !== 'video') return undefined
        setDecodedFrameIndex(null)
        setCurrentTime(0)
        video.load()
        return undefined
    }, [media.kind, media.src])

    useEffect(() => {
        const stage = stageRef.current
        const capsule = capsuleRef.current
        if (!stage || !capsule || typeof ResizeObserver === 'undefined') {
            return undefined
        }
        const observer = new ResizeObserver(() =>
            setGeometryVersion((version) => version + 1)
        )
        observer.observe(stage)
        observer.observe(capsule)
        return () => observer.disconnect()
    }, [])

    useEffect(() => {
        setDecodedFrameIndex(null)
        if (
            !exactPresentation ||
            media.kind !== 'video' ||
            !videoRef.current?.requestVideoFrameCallback
        ) {
            return undefined
        }

        const video = videoRef.current
        let callbackId
        const onVideoFrame = (_now, metadata) => {
            setCurrentTime(metadata.mediaTime)
            setDecodedFrameIndex(
                decodedMediaFrameIndex(metadata.mediaTime, exactPresentation.binding)
            )
            callbackId = video.requestVideoFrameCallback(onVideoFrame)
        }
        callbackId = video.requestVideoFrameCallback(onVideoFrame)
        return () => video.cancelVideoFrameCallback?.(callbackId)
    }, [exactPresentation, media.kind, media.src])

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
        setDecodedFrameIndex(null)
        setDuration(Number.isFinite(video.duration) ? video.duration : 0)
    }

    const phaseLabel = phase === 'recording' ? 'Demonstration' : 'Compiled replay'
    const frame = exactPresentation
        ? executionOverlayFrameAt(
              exactPresentation.timeline,
              Math.round(currentTime * 1000)
          )
        : null
    const target = exactPresentation && frame?.visible
        ? exactTargetForDecodedFrame(
              exactPresentation.timeline,
              exactPresentation.binding,
              decodedFrameIndex
          )
        : null
    const mappedTarget = useMemo(() => {
        const video = videoRef.current
        if (!target || !video) return null
        return mapTargetToContainedVideo(target, {
            elementWidth: video.clientWidth,
            elementHeight: video.clientHeight,
            videoWidth: video.videoWidth,
            videoHeight: video.videoHeight,
        })
        // ResizeObserver increments geometryVersion when either box changes.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [target, geometryVersion])
    const protectedRegions = useMemo(
        () =>
            Array.isArray(media.protectedRegions)
                ? media.protectedRegions
                : [],
        [media.protectedRegions]
    )
    const statusLabel = frame?.status ?? phaseLabel
    const phaseChip = frame ? PHASE_LABELS[frame.phase] : phaseLabel
    const contextLabel = frame?.step?.current
        ? `Step ${frame.step.current} of ${frame.step.total}`
        : exactPresentation
          ? 'Exact runtime timeline'
          : 'Raw source media'
    const boundContext = frame
        ? exactPresentation?.contextsBySequence?.[frame.event_sequence] ?? null
        : null
    const rail = frame
        ? executionRailForBoundContext(frame, boundContext)
        : []

    useEffect(() => {
        const stage = stageRef.current
        const capsule = capsuleRef.current
        if (!stage || !capsule) return
        const eventSequence = frame?.event_sequence ?? null
        const retained =
            placementRef.current.eventSequence === eventSequence
                ? placementRef.current.placement
                : null
        const next = chooseOverlayPlacement({
            stageWidth: stage.clientWidth,
            stageHeight: stage.clientHeight,
            capsuleWidth: capsule.offsetWidth,
            capsuleHeight: capsule.offsetHeight,
            avoidRegions: mappedTarget
                ? [...protectedRegions, mappedTarget]
                : protectedRegions,
            currentPlacement: retained,
        })
        placementRef.current = { eventSequence, placement: next }
        setPlacement(next)
    }, [frame?.event_sequence, geometryVersion, mappedTarget, protectedRegions])

    return (
        <div
            className={styles.player}
            ref={playerRef}
            data-testid="reference-evidence-player"
            data-media-kind={media.kind}
            data-media-src={media.src}
            data-target-tracking={
                exactPresentation
                    ? 'exact-decoded-frame-bound'
                    : 'omitted-without-exact-timeline'
            }
        >
            <div
                ref={stageRef}
                className={styles.stage}
                style={{
                    aspectRatio: `${media.width} / ${media.height}`,
                    '--media-aspect': `${media.width} / ${media.height}`,
                }}
                data-overlay-placement={placement}
            >
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
                        onSeeked={syncVideo}
                        onPlay={syncVideo}
                        onPause={syncVideo}
                    >
                        <source src={media.src} type={media.mimeType} />
                        {media.fallbackSrc && (
                            <source
                                src={media.fallbackSrc}
                                type={media.fallbackMimeType}
                            />
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

                {mappedTarget && (
                    <span
                        className={styles.target}
                        aria-hidden="true"
                        data-decoded-frame-index={decodedFrameIndex}
                        style={{
                            left: `${mappedTarget.left}px`,
                            top: `${mappedTarget.top}px`,
                            width: `${mappedTarget.width}px`,
                            height: `${mappedTarget.height}px`,
                        }}
                    />
                )}

                {(frame?.visible ?? true) && (
                    <div
                        ref={capsuleRef}
                        className={styles.capsule}
                        aria-label={`OpenAdapt ${phaseLabel.toLowerCase()}`}
                        data-overlay-kind={
                            exactPresentation ? 'canonical-runtime-state' : 'source-metadata'
                        }
                    >
                        <span className={styles.brand}>
                            <i aria-hidden="true" /> OpenAdapt
                        </span>
                        <span className={styles.phase}>{phaseChip}</span>
                        <small>
                            {application} · {statusLabel} · {contextLabel}
                        </small>
                        {rail.length > 0 && (
                            <span className={styles.rail} aria-label="Execution stage">
                                {rail.map((item) => (
                                    <i key={item.label} data-state={item.state}>
                                        {item.label}
                                    </i>
                                ))}
                            </span>
                        )}
                    </div>
                )}
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
