import { useEffect, useMemo, useRef, useState } from 'react'

import {
    chooseOverlayPlacement,
    decodedMediaFrameIndex,
    exactTargetForDecodedFrame,
    executionOverlayPresentation,
    executionOverlayFrameAt,
    mapTargetToContainedVideo,
} from '../lib/executionOverlayTimeline'
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
    modeLabel,
    exactPresentation = null,
    evidenceHref = null,
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
    const [ended, setEnded] = useState(false)
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
        const shouldPlay =
            motionAllowed && visible && !manuallyPaused.current && !ended
        if (media.kind === 'gif') {
            setPlaying(shouldPlay)
            return undefined
        }

        const video = videoRef.current
        if (!video) return undefined
        if (shouldPlay) void video.play().catch(() => setPlaying(false))
        else video.pause()
        return undefined
    }, [ended, media.kind, media.src, motionAllowed, visible])

    useEffect(() => {
        const video = videoRef.current
        if (!video || media.kind !== 'video') return undefined
        setDecodedFrameIndex(null)
        setCurrentTime(0)
        setEnded(false)
        manuallyPaused.current = false
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
        let active = true
        const onVideoFrame = (_now, metadata) => {
            if (!active) return
            setCurrentTime(metadata.mediaTime)
            setDecodedFrameIndex(
                decodedMediaFrameIndex(metadata.mediaTime, exactPresentation.binding)
            )
            if (active) {
                callbackId = video.requestVideoFrameCallback(onVideoFrame)
            }
        }
        callbackId = video.requestVideoFrameCallback(onVideoFrame)
        return () => {
            active = false
            video.cancelVideoFrameCallback?.(callbackId)
        }
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
        if (ended && exactPresentation) {
            const restartTime = 0
            manuallyPaused.current = false
            setEnded(false)
            video.currentTime = restartTime
            setCurrentTime(restartTime)
            setDecodedFrameIndex(
                decodedMediaFrameIndex(
                    restartTime,
                    exactPresentation.binding
                )
            )
            setMotionAllowed(true)
            void video.play().catch(() => setPlaying(false))
            return
        }
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
        // requestVideoFrameCallback is the sole automated clock for exact
        // presentations. Mixing it with timeupdate/seek events can apply an
        // older media time after a newer decoded frame.
        if (!exactPresentation || !video.requestVideoFrameCallback) {
            setCurrentTime(video.currentTime)
        }
        setDuration(Number.isFinite(video.duration) ? video.duration : 0)
    }

    const finishVideo = () => {
        const video = videoRef.current
        if (!video) return
        setPlaying(false)
        if (!exactPresentation) return

        // Guided evidence is a bounded run, not an ambient animation. Hold its
        // terminal frame until the viewer explicitly chooses Replay so the
        // visible workflow step never jumps backwards on an implicit loop.
        const finalTime = Number.isFinite(video.duration)
            ? video.duration
            : currentTime
        manuallyPaused.current = true
        setEnded(true)
        setCurrentTime(finalTime)
        setDecodedFrameIndex(
            decodedMediaFrameIndex(finalTime, exactPresentation.binding)
        )
    }

    const accessibleModeLabel =
        modeLabel ??
        (phase === 'recording'
            ? 'Demonstration'
            : phase === 'halt'
              ? 'Fail-safe halt'
              : 'Compiled replay')
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
    const boundContext = frame
        ? exactPresentation?.contextsBySequence?.[frame.event_sequence] ?? null
        : null
    const presentation = frame
        ? executionOverlayPresentation(
              frame,
              boundContext,
              currentTime * 1000,
              exactPresentation.networkObservation
          )
        : null
    const overlayEvidenceHref = presentation?.evidenceHref ?? evidenceHref

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
            data-decoded-frame-index={
                decodedFrameIndex === null ? 'unbound' : decodedFrameIndex
            }
            data-target-tracking={
                exactPresentation
                    ? 'exact-decoded-frame-bound'
                    : 'omitted-without-exact-timeline'
            }
            data-playback-state={
                ended ? 'ended' : playing ? 'playing' : 'paused'
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
                        loop={!exactPresentation}
                        playsInline
                        preload="metadata"
                        poster={media.poster}
                        aria-label={media.alt}
                        onLoadedMetadata={syncVideo}
                        onDurationChange={syncVideo}
                        onTimeUpdate={syncVideo}
                        onSeeking={() => setDecodedFrameIndex(null)}
                        onSeeked={syncVideo}
                        onPlay={syncVideo}
                        onPause={syncVideo}
                        onEnded={finishVideo}
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

                {exactPresentation && frame?.visible && (
                    <div
                        ref={capsuleRef}
                        className={styles.capsule}
                        aria-label={`OpenAdapt ${accessibleModeLabel.toLowerCase()} in ${application}`}
                        data-overlay-kind="canonical-runtime-state"
                    >
                        <span className={styles.header}>
                            <span className={styles.brand}>
                                <i aria-hidden="true" /> OpenAdapt
                            </span>
                            <span className={styles.phase} data-state={frame.phase}>
                                {presentation.phaseLabel}
                            </span>
                            <span className={styles.progressLabel}>
                                {presentation.progressLabel}
                            </span>
                        </span>
                        <strong
                            className={styles.status}
                            data-state={frame.phase}
                            title={presentation.safetyLabel}
                        >
                            {presentation.safetyLabel}
                        </strong>
                        {presentation.progressValue !== null &&
                            presentation.progressMax !== null && (
                                <progress
                                    className={styles.progress}
                                    value={presentation.progressValue}
                                    max={presentation.progressMax}
                                    aria-label={`Workflow progress: ${presentation.progressValue} of ${presentation.progressMax}`}
                                />
                            )}
                    </div>
                )}
            </div>

            <div
                className={styles.controls}
                role="group"
                aria-label={`${application} ${accessibleModeLabel.toLowerCase()} playback controls`}
            >
                <button
                    type="button"
                    onClick={toggle}
                    aria-label={ended ? 'Replay' : playing ? 'Pause' : 'Play'}
                >
                    <span aria-hidden="true">
                        {ended ? '↻' : playing ? 'Ⅱ' : '▶'}
                    </span>
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
                                setDecodedFrameIndex(null)
                                const nextTime = Number(
                                    event.currentTarget.value
                                )
                                videoRef.current.currentTime = nextTime
                                setCurrentTime(nextTime)
                                setEnded(false)
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
                {overlayEvidenceHref && (
                    <a
                        className={styles.evidenceLink}
                        href={overlayEvidenceHref}
                        aria-label={`View evidence for ${application} ${accessibleModeLabel.toLowerCase()}`}
                    >
                        Evidence
                    </a>
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
