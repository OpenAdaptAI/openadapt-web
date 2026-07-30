import { useEffect, useMemo, useRef, useState } from 'react'

import styles from './RdpHybridPresentation.module.css'

const MISSING_TIMELINE =
    'The exported presentation has no exact media-time binding yet. OpenAdapt still shows the authenticated media and artifacts, but it does not infer a phase from playback time.'

const clamp = (value, minimum, maximum) =>
    Math.min(Math.max(value, minimum), maximum)

const timeLabel = (milliseconds) => {
    const seconds = Math.max(0, Math.floor(milliseconds / 1000))
    return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`
}

const readJson = async (source) => {
    const response = await fetch(source, { cache: 'force-cache' })
    if (!response.ok) throw new Error(`Could not load ${source}`)
    return response.json()
}

function Marker({ type }) {
    if (type === 'identity') {
        return (
            <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.icon}>
                <path d="M12 3 20 7v5c0 4.5-3.2 7.6-8 9-4.8-1.4-8-4.5-8-9V7l8-4Z" />
                <path d="m8.6 12.1 2.1 2.1 4.8-5" />
            </svg>
        )
    }
    if (type === 'proof') {
        return (
            <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.icon}>
                <circle cx="12" cy="12" r="8.5" />
                <path d="m8.4 12.2 2.3 2.3 5-5.2" />
            </svg>
        )
    }
    if (type === 'halt') {
        return (
            <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.icon}>
                <path d="M12 3.5 21 20H3l9-16.5Z" />
                <path d="M12 9v4.8M12 17.2h.01" />
            </svg>
        )
    }
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.icon}>
            <path d="M5 6.5h14M5 12h14M5 17.5h14" />
            <circle cx="7" cy="6.5" r="1" />
            <circle cx="12" cy="12" r="1" />
            <circle cx="17" cy="17.5" r="1" />
        </svg>
    )
}

function validChapter(chapter, durationMs) {
    if (!chapter || typeof chapter !== 'object') return false
    if (typeof chapter.id !== 'string' || !chapter.id) return false
    if (typeof chapter.start_ms !== 'number' || typeof chapter.end_ms !== 'number') {
        return false
    }
    if (chapter.start_ms < 0 || chapter.end_ms <= chapter.start_ms) return false
    if (chapter.end_ms > durationMs) return false
    if (!chapter.presentation || typeof chapter.presentation !== 'object') return false
    if (typeof chapter.presentation.phase !== 'string') return false
    if (!Array.isArray(chapter.presentation.graph_node_ids)) return false
    return true
}

function validTimeline(timeline, manifest) {
    if (!timeline || typeof timeline !== 'object') return null
    if (timeline.schema_version !== 'openadapt.rdp-media-timeline.v1') return null
    if (timeline.video_sha256 !== manifest?.video_sha256) return null
    if (!Number.isFinite(timeline.duration_ms) || timeline.duration_ms <= 0) return null
    if (!Array.isArray(timeline.chapters) || !timeline.chapters.length) return null
    if (!timeline.chapters.every((chapter) => validChapter(chapter, timeline.duration_ms))) {
        return null
    }
    return timeline
}

function activeChapter(timeline, currentMs) {
    if (!timeline) return null
    return (
        timeline.chapters.find(
            (chapter) => currentMs >= chapter.start_ms && currentMs < chapter.end_ms
        ) ?? timeline.chapters.at(-1)
    )
}

export default function RdpHybridPresentation({
    videoSrc = '/demos/rdp/openadapt-rdp-demo.mp4',
    poster = '/demos/rdp/poster.jpg',
    manifestSrc = '/demos/rdp/presentation.manifest.json',
    graphSrc = '/demos/rdp/program-graph.json',
    timelineSrc = '/demos/rdp/presentation.timeline.json',
}) {
    const videoRef = useRef(null)
    const [manifest, setManifest] = useState(null)
    const [graph, setGraph] = useState(null)
    const [timelinePayload, setTimelinePayload] = useState(null)
    const [loadError, setLoadError] = useState(null)
    const [currentMs, setCurrentMs] = useState(0)
    const [durationMs, setDurationMs] = useState(0)
    const [playing, setPlaying] = useState(false)
    const [reducedMotion, setReducedMotion] = useState(false)

    useEffect(() => {
        let active = true
        Promise.all([
            readJson(manifestSrc),
            readJson(graphSrc),
            readJson(timelineSrc).catch(() => null),
        ])
            .then(([nextManifest, nextGraph, nextTimeline]) => {
                if (!active) return
                setManifest(nextManifest)
                setGraph(nextGraph)
                setTimelinePayload(nextTimeline)
            })
            .catch((error) => {
                if (active) setLoadError(error.message)
            })
        return () => {
            active = false
        }
    }, [graphSrc, manifestSrc, timelineSrc])

    useEffect(() => {
        const media = window.matchMedia('(prefers-reduced-motion: reduce)')
        const update = () => setReducedMotion(media.matches)
        update()
        media.addEventListener?.('change', update)
        return () => media.removeEventListener?.('change', update)
    }, [])

    useEffect(() => {
        const video = videoRef.current
        if (!video?.requestVideoFrameCallback) return undefined
        let callbackId
        let mounted = true
        const update = (_now, metadata) => {
            if (!mounted) return
            setCurrentMs(Math.round(metadata.mediaTime * 1000))
            callbackId = video.requestVideoFrameCallback(update)
        }
        callbackId = video.requestVideoFrameCallback(update)
        return () => {
            mounted = false
            video.cancelVideoFrameCallback?.(callbackId)
        }
    }, [])

    const timeline = useMemo(
        () => validTimeline(timelinePayload, manifest),
        [manifest, timelinePayload]
    )
    const chapter = activeChapter(timeline, currentMs)
    const activeNodeIds = new Set(chapter?.presentation?.graph_node_ids ?? [])
    const nodes = Array.isArray(graph?.nodes) ? graph.nodes : []
    const progress = durationMs ? clamp((currentMs / durationMs) * 100, 0, 100) : 0

    const toggle = () => {
        const video = videoRef.current
        if (!video) return
        if (video.paused) void video.play()
        else video.pause()
    }

    const seek = (milliseconds) => {
        const video = videoRef.current
        if (!video || !timeline) return
        const exactMs = clamp(milliseconds, 0, timeline.duration_ms)
        video.currentTime = exactMs / 1000
        setCurrentMs(exactMs)
    }

    return (
        <section className={styles.shell} aria-label="RDP execution presentation">
            <div className={styles.topline}>
                <span className={styles.liveDot} aria-hidden="true" />
                <span>Provenance-bound presentation</span>
                <span className={styles.digest}>
                    {manifest?.workflow_digest
                        ? `bundle ${manifest.workflow_digest.slice(0, 12)}`
                        : 'loading bundle binding'}
                </span>
            </div>

            <div className={styles.grid}>
                <div className={styles.stage}>
                    <video
                        ref={videoRef}
                        className={styles.video}
                        controls={false}
                        muted
                        playsInline
                        poster={poster}
                        preload="metadata"
                        onLoadedMetadata={(event) => {
                            setDurationMs(Math.round(event.currentTarget.duration * 1000))
                        }}
                        onPlay={() => setPlaying(true)}
                        onPause={() => setPlaying(false)}
                        onTimeUpdate={(event) => {
                            if (!event.currentTarget.requestVideoFrameCallback) {
                                setCurrentMs(Math.round(event.currentTarget.currentTime * 1000))
                            }
                        }}
                    >
                        <source src={videoSrc} type="video/mp4" />
                        Your browser does not support this presentation.
                    </video>
                    <div className={styles.frame} aria-hidden="true" />
                    <div className={styles.phaseBadge} data-known={Boolean(chapter)}>
                        <span>{chapter?.presentation?.phase ?? 'Authenticated media'}</span>
                        <strong>{chapter?.presentation?.outcome ?? 'Evidence view'}</strong>
                    </div>
                    <button type="button" className={styles.playButton} onClick={toggle}>
                        <span aria-hidden="true">{playing ? 'Ⅱ' : '▶'}</span>
                        <span>{playing ? 'Pause presentation' : 'Play presentation'}</span>
                    </button>
                    <div className={styles.scrubWrap}>
                        <input
                            type="range"
                            min="0"
                            max={durationMs || 1}
                            value={clamp(currentMs, 0, durationMs || 1)}
                            aria-label="RDP presentation time"
                            onChange={(event) => seek(Number(event.target.value))}
                            disabled={!timeline}
                        />
                        <div className={styles.clock}>
                            <span>{timeLabel(currentMs)}</span>
                            <span>{timeLabel(durationMs)}</span>
                        </div>
                    </div>
                </div>

                <aside className={styles.console} aria-live="polite">
                    <div className={styles.consoleHeader}>
                        <p>Execution intelligence</p>
                        <span>{timeline ? 'exact timeline' : 'artifact-bound'}</span>
                    </div>
                    {chapter ? (
                        <>
                            <h3>{chapter.presentation.headline}</h3>
                            <p>{chapter.presentation.detail}</p>
                            <div className={styles.signalList}>
                                {(chapter.presentation.signals ?? []).map((signal) => (
                                    <div key={`${chapter.id}-${signal.type}-${signal.label}`} className={styles.signal}>
                                        <Marker type={signal.type} />
                                        <div>
                                            <strong>{signal.label}</strong>
                                            <span>{signal.value}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <>
                            <h3>Real media. No inferred state.</h3>
                            <p>{MISSING_TIMELINE}</p>
                        </>
                    )}
                    <div className={styles.provenance}>
                        <span>Media</span>
                        <code>{manifest?.video_sha256?.slice(0, 20) ?? 'loading'}…</code>
                        <span>Graph</span>
                        <code>{manifest?.program_graph_sha256?.slice(0, 20) ?? 'loading'}…</code>
                    </div>
                </aside>
            </div>

            <div className={styles.rail} aria-label="Presentation chapters">
                {(timeline?.chapters ?? []).map((item, index) => {
                    const selected = item.id === chapter?.id
                    return (
                        <button
                            key={item.id}
                            type="button"
                            className={styles.chapter}
                            data-active={selected}
                            onClick={() => seek(item.start_ms)}
                        >
                            <span>{String(index + 1).padStart(2, '0')}</span>
                            <strong>{item.presentation.nav_label}</strong>
                            <small>{item.presentation.outcome}</small>
                        </button>
                    )
                })}
                {!timeline && <p className={styles.contractNote}>{MISSING_TIMELINE}</p>}
            </div>

            <div className={styles.graph}>
                <div className={styles.graphHeader}>
                    <div>
                        <p>Compiled workflow</p>
                        <span>Only exact exported graph nodes appear here.</span>
                    </div>
                    <span className={styles.motion}>{reducedMotion ? 'Reduced motion' : 'Media-synced'}</span>
                </div>
                <ol>
                    {nodes.map((node) => (
                        <li key={node.id} data-active={activeNodeIds.has(node.id)}>
                            <span>{String(node.index + 1).padStart(2, '0')}</span>
                            <strong>{node.title}</strong>
                            <small>
                                {node.param
                                    ? `input: $${node.param}`
                                    : node.badges?.join(' · ') || node.kind}
                            </small>
                        </li>
                    ))}
                </ol>
            </div>

            {loadError && <p className={styles.error}>Evidence load error: {loadError}</p>}
        </section>
    )
}
