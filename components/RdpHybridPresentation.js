import { useEffect, useMemo, useRef, useState } from 'react'

import JsonArtifactLink from './JsonArtifactLink'
import styles from './RdpHybridPresentation.module.css'

const MISSING_TIMELINE =
    'The media timeline is unavailable. OpenAdapt shows the authenticated video and artifacts, but it does not infer a phase from playback time.'

// These labels explain exact renderer phases. Runtime facts stay in the
// exported timeline and are never reconstructed from playback time.
const PHASE_PRESENTATION = {
    execute_request: {
        stage: 'request',
        label: 'The request arrives',
        detail:
            'The authorized appointment data enters the customer-controlled runner.',
    },
    demonstration: {
        stage: 'build',
        label: 'A person shows the task once',
        detail: 'The demonstration includes the real mouse, keyboard, and RDP timing.',
    },
    compiled_workflow: {
        stage: 'build',
        label: 'OpenAdapt builds a reusable workflow',
        detail: 'The video shows the exact exported program, not a drawn example.',
    },
    governed_replay: {
        stage: 'run',
        label: 'OpenAdapt completes the task',
        detail: 'The runner checks the live record before it enters the new request.',
    },
    independent_effect_check: {
        stage: 'verify',
        label: 'The saved result is checked',
        detail: 'A separate read-only database check confirms the appointment.',
        showOutcome: true,
    },
    wrong_record_refusal: {
        stage: 'verify',
        label: 'Wrong record. Save blocked.',
        detail: 'The record changed, so OpenAdapt stopped before the write.',
        showOutcome: true,
    },
    terminal_summary: {
        stage: 'verify',
        label: 'Verified result or safe stop',
        detail:
            'The correct run is verified. The wrong-record run stops before Save.',
    },
}

const STORY_STAGES = [
    { id: 'request', label: 'Request' },
    { id: 'build', label: 'Build once' },
    { id: 'run', label: 'Run' },
    { id: 'verify', label: 'Verify or stop' },
]

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

function storyChapters(timeline) {
    if (!timeline) return []
    return STORY_STAGES.flatMap((stage) => {
        const entries = timeline.timeline.filter(
            (entry) => PHASE_PRESENTATION[entry.phase]?.stage === stage.id
        )
        if (!entries.length) return []
        return [
            {
                ...stage,
                start_pts_s: entries[0].start_pts_s,
                end_pts_s: entries.at(-1).end_pts_s,
                start_frame: entries[0].start_frame,
                end_frame_exclusive: entries.at(-1).end_frame_exclusive,
            },
        ]
    })
}

function nodeFacts(node) {
    const facts = []
    if (node.param) facts.push(`Input: $${node.param}`)
    const resolutionRungs = Array.isArray(node.resolution?.rungs)
        ? node.resolution.rungs
              .filter((rung) => rung?.present && typeof rung.label === 'string')
              .map((rung) => rung.label)
        : []
    if (resolutionRungs.length) {
        facts.push(`Resolve: ${resolutionRungs.join(' + ')}`)
    }
    if (Array.isArray(node.postconditions) && node.postconditions.length) {
        facts.push(
            `Check: ${node.postconditions
                .map((condition) => condition.replaceAll('_', ' '))
                .join(' + ')}`
        )
    }
    if (Array.isArray(node.badges) && node.badges.length) {
        facts.push(`Policy: ${node.badges.join(' + ')}`)
    }
    if (Array.isArray(node.effects) && node.effects.length) {
        facts.push(
            `${node.effects.length} required effect ${
                node.effects.length === 1 ? 'check' : 'checks'
            }`
        )
    }
    if (!facts.length && node.kind) facts.push(node.kind)
    return facts
}

export default function RdpHybridPresentation({
    videoSrc = '/demos/rdp/openadapt-rdp-demo.mp4',
    poster = '/demos/rdp/poster.jpg',
    manifestSrc = '/demos/rdp/presentation.manifest.json',
    graphSrc = '/demos/rdp/program-graph.json',
    timelineSrc = '/demos/rdp/presentation.timeline.json',
    qualificationSrc = '/demos/rdp/qualification.json',
}) {
    const shellRef = useRef(null)
    const videoRef = useRef(null)
    const stageRef = useRef(null)
    const startedRef = useRef(false)
    const [manifest, setManifest] = useState(null)
    const [graph, setGraph] = useState(null)
    const [timelinePayload, setTimelinePayload] = useState(null)
    const [loadError, setLoadError] = useState(null)
    const [currentMs, setCurrentMs] = useState(0)
    const [durationMs, setDurationMs] = useState(0)
    const [playing, setPlaying] = useState(false)
    const [reducedMotion, setReducedMotion] = useState(true)
    const [frameBindingAvailable, setFrameBindingAvailable] = useState(false)

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
        const update = () => {
            setReducedMotion(media.matches)
            const video = videoRef.current
            if (media.matches && video) video.pause()
        }
        update()
        media.addEventListener?.('change', update)
        return () => media.removeEventListener?.('change', update)
    }, [])

    useEffect(() => {
        if (reducedMotion || startedRef.current) return undefined
        const shell = shellRef.current
        const video = videoRef.current
        if (!shell || !video || !window.IntersectionObserver) return undefined

        const observer = new window.IntersectionObserver(
            ([intersection]) => {
                if (
                    !intersection?.isIntersecting ||
                    intersection.intersectionRatio < 0.4
                ) {
                    return
                }
                startedRef.current = true
                void video.play().catch(() => {
                    startedRef.current = false
                })
                observer.disconnect()
            },
            { threshold: [0.4] }
        )
        observer.observe(shell)
        return () => observer.disconnect()
    }, [reducedMotion])

    useEffect(() => {
        const video = videoRef.current
        const available = Boolean(video?.requestVideoFrameCallback)
        setFrameBindingAvailable(available)
        if (!available) return undefined
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
        () =>
            frameBindingAvailable
                ? validTimeline(timelinePayload, manifest)
                : null,
        [frameBindingAvailable, manifest, timelinePayload]
    )
    const effectiveDurationMs =
        durationMs ||
        (timeline
            ? Math.round(
                  (timeline.derivative.frame_count / timeline.derivative.fps) * 1000
              )
            : 0)
    const entry = activeEntry(timeline, currentMs)
    const chapters = useMemo(() => storyChapters(timeline), [timeline])
    const phaseContent = entry ? PHASE_PRESENTATION[entry.phase] : null
    const activeChapter = chapters.find((item) => item.id === phaseContent?.stage)
    const activeStageIndex = STORY_STAGES.findIndex(
        (item) => item.id === phaseContent?.stage
    )
    const activeNodeIds = new Set(
        entry?.compiled_graph?.node_id ? [entry.compiled_graph.node_id] : []
    )
    const nodes = Array.isArray(graph?.nodes) ? graph.nodes : []
    const parameterNames = Array.isArray(graph?.bundle?.params)
        ? graph.bundle.params
              .map((parameter) => parameter?.name)
              .filter((name) => typeof name === 'string')
        : []

    const toggle = () => {
        const video = videoRef.current
        if (!video) return
        if (video.paused) {
            startedRef.current = true
            if (video.ended || video.currentTime >= video.duration - 0.1) {
                video.currentTime = 0
            }
            void video.play()
        } else {
            video.pause()
        }
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
    }

    const expand = () => {
        const stage = stageRef.current
        if (stage?.requestFullscreen) void stage.requestFullscreen()
    }

    return (
        <section
            ref={shellRef}
            className={styles.shell}
            aria-label="RDP execution presentation"
        >
            <div className={styles.topline}>
                <span>Real RDP demo</span>
                <span className={styles.boundLabel}>Customer-controlled runner</span>
            </div>

            <div className={styles.grid}>
                <div className={styles.stage} ref={stageRef}>
                    <video
                        ref={videoRef}
                        className={styles.video}
                        controls={false}
                        muted
                        playsInline
                        poster={poster}
                        preload="metadata"
                        onLoadedMetadata={(event) => {
                            setDurationMs(
                                Math.round(event.currentTarget.duration * 1000)
                            )
                        }}
                        onPlay={() => setPlaying(true)}
                        onPause={() => setPlaying(false)}
                    >
                        <source src={videoSrc} type="video/mp4" />
                        Your browser does not support this presentation.
                    </video>
                    <button
                        type="button"
                        className={styles.expandButton}
                        onClick={expand}
                    >
                        Full screen
                    </button>
                    <button
                        type="button"
                        className={styles.playButton}
                        onClick={toggle}
                    >
                        <span aria-hidden="true">{playing ? 'Ⅱ' : '▶'}</span>
                        <span>
                            {playing
                                ? 'Pause'
                                : effectiveDurationMs > 0 &&
                                    currentMs >= effectiveDurationMs - 120
                                  ? 'Replay'
                                  : 'Play'}
                        </span>
                    </button>
                    <div className={styles.scrubWrap}>
                        <input
                            type="range"
                            min="0"
                            max={effectiveDurationMs || 1}
                            value={clamp(currentMs, 0, effectiveDurationMs || 1)}
                            aria-label="RDP presentation time"
                            aria-valuetext={`${phaseContent?.label ?? 'Authenticated media'}, ${timeLabel(currentMs)}`}
                            onChange={(event) => seek(Number(event.target.value))}
                            disabled={!timeline}
                        />
                        <div className={styles.clock}>
                            <span>{timeLabel(currentMs)}</span>
                            <span>{timeLabel(effectiveDurationMs)}</span>
                        </div>
                    </div>
                </div>

                <aside className={styles.console}>
                    <p className={styles.srOnly} aria-live="polite">
                        {phaseContent?.label ?? 'Authenticated media'}
                    </p>
                    <div className={styles.consoleHeader}>
                        <p>What is happening</p>
                        <span>
                            {activeStageIndex >= 0
                                ? `Stage ${activeStageIndex + 1} of 4`
                                : 'Exact media'}
                        </span>
                    </div>
                    {entry && phaseContent ? (
                        <>
                            <h3>{phaseContent.label}</h3>
                            <p>{phaseContent.detail}</p>
                            {phaseContent.showOutcome &&
                                typeof entry.facts?.outcome === 'string' && (
                                    <p
                                        className={styles.outcome}
                                        data-outcome={entry.facts.outcome.toLowerCase()}
                                    >
                                        {entry.facts.outcome}
                                    </p>
                                )}
                        </>
                    ) : (
                        <>
                            <h3>Real media. No inferred state.</h3>
                            <p>{MISSING_TIMELINE}</p>
                        </>
                    )}
                </aside>
            </div>

            <div className={styles.rail} aria-label="Presentation stages">
                {chapters.map((item, index) => {
                    const selected = item.id === activeChapter?.id
                    return (
                        <button
                            key={item.id}
                            type="button"
                            className={styles.chapter}
                            data-active={selected}
                            aria-pressed={selected}
                            onClick={() =>
                                seek(Math.round(item.start_pts_s * 1000))
                            }
                        >
                            <span>{String(index + 1).padStart(2, '0')}</span>
                            <strong>{item.label}</strong>
                            <small>
                                {timeLabel(Math.round(item.start_pts_s * 1000))}
                            </small>
                        </button>
                    )
                })}
                {!timeline && (
                    <p className={styles.contractNote}>{MISSING_TIMELINE}</p>
                )}
            </div>

            <div className={styles.detailsStack}>
                <details className={styles.details} open>
                    <summary>
                        <span>
                            <strong>The workflow OpenAdapt built</strong>
                            <small>The exact nine-step program and its inputs</small>
                        </span>
                    </summary>
                    <div className={styles.graph}>
                        <div className={styles.graphHeader}>
                            <div>
                                <p>Compiled workflow</p>
                                <span>
                                    {parameterNames.length
                                        ? `Inputs: ${parameterNames
                                              .map((name) => `$${name}`)
                                              .join(' · ')}`
                                        : 'Only exact exported graph nodes appear here.'}
                                </span>
                            </div>
                            <span className={styles.motion}>
                                {reducedMotion ? 'Reduced motion' : 'Media-synced'}
                            </span>
                        </div>
                        <ol>
                            {nodes.map((node) => (
                                <li
                                    key={node.id}
                                    data-active={activeNodeIds.has(node.id)}
                                >
                                    <span>
                                        {String(node.index + 1).padStart(2, '0')}
                                    </span>
                                    <strong>{node.title}</strong>
                                    <ul className={styles.nodeFacts}>
                                        {nodeFacts(node).map((fact) => (
                                            <li key={fact}>{fact}</li>
                                        ))}
                                    </ul>
                                </li>
                            ))}
                        </ol>
                    </div>
                </details>

                <details className={styles.details}>
                    <summary>
                        <span>
                            <strong>Technical evidence</strong>
                            <small>
                                Open the reports, exact timeline, graph, and raw media
                            </small>
                        </span>
                    </summary>
                    <div className={styles.evidencePanel}>
                        <div className={styles.evidenceLinks}>
                            <JsonArtifactLink source={qualificationSrc}>
                                Qualification evidence
                            </JsonArtifactLink>
                            <JsonArtifactLink source={timelineSrc}>
                                Exact media timeline
                            </JsonArtifactLink>
                            <JsonArtifactLink source={graphSrc}>
                                Program graph
                            </JsonArtifactLink>
                            <JsonArtifactLink source={manifestSrc}>
                                Presentation manifest
                            </JsonArtifactLink>
                            <a href={videoSrc}>Raw MP4</a>
                            <a
                                href="https://github.com/OpenAdaptAI/openadapt-flow/blob/main/docs/backends/RDP.md"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                RDP architecture
                            </a>
                        </div>
                        <dl className={styles.provenance}>
                            <div>
                                <dt>Media hash</dt>
                                <dd>
                                    <code>
                                        {manifest?.video_sha256 ?? 'loading'}
                                    </code>
                                </dd>
                            </div>
                            <div>
                                <dt>Graph hash</dt>
                                <dd>
                                    <code>
                                        {manifest?.program_graph_sha256 ?? 'loading'}
                                    </code>
                                </dd>
                            </div>
                            {entry?.source_frame && (
                                <div>
                                    <dt>Current retained frame</dt>
                                    <dd>
                                        <code>
                                            {entry.source_frame.presentation_phase} ·{' '}
                                            {entry.source_frame.file}
                                        </code>
                                    </dd>
                                </div>
                            )}
                            {Object.hasOwn(entry?.facts ?? {}, 'model_calls') && (
                                <div>
                                    <dt>Model calls</dt>
                                    <dd>{entry.facts.model_calls}</dd>
                                </div>
                            )}
                        </dl>
                    </div>
                </details>
            </div>

            {loadError && (
                <p className={styles.error}>Evidence load error: {loadError}</p>
            )}
        </section>
    )
}
