import { useEffect, useMemo, useRef, useState } from 'react'

import styles from './RdpHybridPresentation.module.css'

const MISSING_TIMELINE =
    'The media timeline is unavailable. OpenAdapt shows the authenticated video and artifacts, but it does not infer a phase from playback time.'

// These labels only describe renderer phases. The runtime facts stay in the
// exporter payload and are rendered below without a frontend interpretation.
const PHASE_PRESENTATION = {
    execute_request: {
        label: 'Authorized request',
        detail: 'A qualified request enters the execution boundary.',
    },
    demonstration: {
        label: 'Demonstrate through RDP',
        detail: 'The presentation replays retained operator input.',
    },
    compiled_workflow: {
        label: 'Compiled workflow',
        detail: 'OpenAdapt exposes the exact exported workflow node.',
    },
    governed_replay: {
        label: 'Governed replay',
        detail: 'The runner replays the qualified workflow with fresh observations.',
    },
    independent_effect_check: {
        label: 'Independent effect proof',
        detail: 'The configured verifier determines the result.',
    },
    wrong_record_refusal: {
        label: 'Wrong-record refusal',
        detail: 'The qualified workflow stops before the consequential action.',
    },
    terminal_summary: {
        label: 'Execution result',
        detail: 'The presentation shows the retained terminal result.',
    },
}

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

function validTimeline(timeline, manifest) {
    if (!timeline || typeof timeline !== 'object') return null
    if (timeline.schema_version !== 'openadapt.rdp-hybrid-presentation.v1') {
        return null
    }
    const derivative = timeline.derivative
    if (!derivative || typeof derivative !== 'object') return null
    if (derivative.video_sha256 !== manifest?.video_sha256) return null
    if (derivative.video !== manifest?.video) return null
    if (!Number.isInteger(derivative.fps) || derivative.fps <= 0) return null
    if (!Number.isInteger(derivative.frame_count) || derivative.frame_count <= 0) {
        return null
    }
    if (timeline.program_graph_sha256 !== manifest?.program_graph_sha256) return null
    if (!Array.isArray(timeline.timeline) || !timeline.timeline.length) return null
    const duration = derivative.frame_count / derivative.fps
    let expectedStart = 0
    const valid = timeline.timeline.every((entry) => {
        if (!entry || typeof entry !== 'object') return false
        if (typeof entry.phase !== 'string' || !PHASE_PRESENTATION[entry.phase]) {
            return false
        }
        if (!Number.isInteger(entry.start_frame)) return false
        if (!Number.isInteger(entry.end_frame_exclusive)) return false
        if (
            entry.start_frame !== expectedStart ||
            entry.start_frame < 0 ||
            entry.end_frame_exclusive <= entry.start_frame
        ) {
            return false
        }
        if (entry.end_frame_exclusive > derivative.frame_count) return false
        if (!Number.isFinite(entry.start_pts_s) || !Number.isFinite(entry.end_pts_s)) {
            return false
        }
        if (entry.start_pts_s !== entry.start_frame / derivative.fps) return false
        if (entry.end_pts_s !== entry.end_frame_exclusive / derivative.fps) return false
        expectedStart = entry.end_frame_exclusive
        return entry.end_pts_s <= duration
    })
    if (!valid || expectedStart !== derivative.frame_count) return null
    return timeline
}

function activeEntry(timeline, currentMs) {
    if (!timeline) return null
    const frame = Math.min(
        timeline.derivative.frame_count - 1,
        Math.max(0, Math.floor((currentMs / 1000) * timeline.derivative.fps))
    )
    return (
        timeline.timeline.find(
            (entry) =>
                frame >= entry.start_frame && frame < entry.end_frame_exclusive
        ) ?? timeline.timeline.at(-1)
    )
}

function phaseChapters(timeline) {
    if (!timeline) return []
    const chapters = []
    for (const entry of timeline.timeline) {
        const previous = chapters.at(-1)
        if (previous?.phase === entry.phase) {
            previous.end_pts_s = entry.end_pts_s
            previous.end_frame_exclusive = entry.end_frame_exclusive
        } else {
            chapters.push({
                phase: entry.phase,
                start_pts_s: entry.start_pts_s,
                end_pts_s: entry.end_pts_s,
                start_frame: entry.start_frame,
                end_frame_exclusive: entry.end_frame_exclusive,
            })
        }
    }
    return chapters
}

function factsAsSignals(facts) {
    if (!facts || typeof facts !== 'object') return []
    const signals = []
    if (Object.hasOwn(facts, 'model_calls')) {
        signals.push({ type: 'flow', label: 'Model calls', value: String(facts.model_calls) })
    }
    if (typeof facts.identity === 'string') {
        signals.push({ type: 'identity', label: 'Identity', value: facts.identity })
    }
    if (typeof facts.effect === 'string') {
        signals.push({
            type: facts.effect === 'not_written' ? 'halt' : 'proof',
            label: 'Effect',
            value: facts.effect,
        })
    }
    if (typeof facts.effect_verifier_kind === 'string') {
        signals.push({ type: 'proof', label: 'Verifier', value: facts.effect_verifier_kind })
    }
    if (typeof facts.authorization === 'string') {
        signals.push({ type: 'identity', label: 'Authorization', value: facts.authorization })
    }
    if (typeof facts.outcome === 'string') {
        signals.push({ type: 'flow', label: 'Outcome', value: facts.outcome })
    }
    return signals
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
    const entry = activeEntry(timeline, currentMs)
    const chapters = useMemo(() => phaseChapters(timeline), [timeline])
    const chapter = chapters.find(
        (item) =>
            entry &&
            entry.start_frame >= item.start_frame &&
            entry.start_frame < item.end_frame_exclusive
    )
    const activeNodeIds = new Set(
        entry?.compiled_graph?.node_id ? [entry.compiled_graph.node_id] : []
    )
    const nodes = Array.isArray(graph?.nodes) ? graph.nodes : []
    const activeNode = nodes.find((node) => node.id === entry?.compiled_graph?.node_id)
    const parameterNames = Array.isArray(graph?.bundle?.params)
        ? graph.bundle.params
              .map((parameter) => parameter?.name)
              .filter((name) => typeof name === 'string')
        : []
    const phaseContent = entry ? PHASE_PRESENTATION[entry.phase] : null

    const toggle = () => {
        const video = videoRef.current
        if (!video) return
        if (video.paused) void video.play()
        else video.pause()
    }

    const seek = (milliseconds) => {
        const video = videoRef.current
        if (!video || !timeline) return
        const exactMs = clamp(
            milliseconds,
            0,
            Math.round(
                (timeline.derivative.frame_count / timeline.derivative.fps) * 1000
            )
        )
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
                    <div className={styles.phaseBadge} data-known={Boolean(entry)}>
                        <span>{phaseContent?.label ?? 'Authenticated media'}</span>
                        <strong>{entry?.facts?.outcome ?? 'Evidence view'}</strong>
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
                    {entry && phaseContent ? (
                        <>
                            <h3>{phaseContent.label}</h3>
                            <p>{phaseContent.detail}</p>
                            <div className={styles.signalList}>
                                {factsAsSignals(entry.facts).map((signal) => (
                                    <div key={`${entry.start_frame}-${signal.type}-${signal.label}`} className={styles.signal}>
                                        <Marker type={signal.type} />
                                        <div>
                                            <strong>{signal.label}</strong>
                                            <span>{signal.value}</span>
                                        </div>
                                    </div>
                                ))}
                                {activeNode && (
                                    <div className={styles.signal}>
                                        <Marker type="flow" />
                                        <div>
                                            <strong>Compiled node</strong>
                                            <span>{activeNode.title}</span>
                                        </div>
                                    </div>
                                )}
                                {entry.source_frame && (
                                    <div className={styles.signal}>
                                        <Marker type="flow" />
                                        <div>
                                            <strong>Retained source frame</strong>
                                            <span>
                                                {entry.source_frame.presentation_phase} · {entry.source_frame.file}
                                            </span>
                                        </div>
                                    </div>
                                )}
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
                {chapters.map((item, index) => {
                    const selected = item.phase === chapter?.phase
                    const presentation = PHASE_PRESENTATION[item.phase]
                    return (
                        <button
                            key={`${item.phase}-${item.start_frame}`}
                            type="button"
                            className={styles.chapter}
                            data-active={selected}
                            onClick={() => seek(Math.round(item.start_pts_s * 1000))}
                        >
                            <span>{String(index + 1).padStart(2, '0')}</span>
                            <strong>{presentation.label}</strong>
                            <small>{timeLabel(Math.round(item.start_pts_s * 1000))}</small>
                        </button>
                    )
                })}
                {!timeline && <p className={styles.contractNote}>{MISSING_TIMELINE}</p>}
            </div>

            <div className={styles.graph}>
                <div className={styles.graphHeader}>
                    <div>
                        <p>Compiled workflow</p>
                        <span>
                            {parameterNames.length
                                ? `Parameters: ${parameterNames.map((name) => `$${name}`).join(' · ')}`
                                : 'Only exact exported graph nodes appear here.'}
                        </span>
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
