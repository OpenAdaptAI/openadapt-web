import {
    CONTROL_OVERLAY_FRAME_V2_SCHEMA,
    CONTROL_OVERLAY_MODES,
    CONTROL_OVERLAY_PHASES,
    CONTROL_OVERLAY_PROFILES,
    CONTROL_OVERLAY_STATUS_BY_PHASE,
    CONTROL_OVERLAY_TARGET_ACTION_KINDS,
    CONTROL_OVERLAY_TIMELINE_V2_SCHEMA,
    CONTROL_OVERLAY_WORKFLOW_LABELS,
} from '../generated/controlOverlayContract.js'
import { sha256 } from '@noble/hashes/sha2.js'
import { bytesToHex, utf8ToBytes } from '@noble/hashes/utils.js'

const PHASES = new Set(CONTROL_OVERLAY_PHASES)
const MODES = new Set(CONTROL_OVERLAY_MODES)
const PROFILES = new Set(CONTROL_OVERLAY_PROFILES)
const LABELS = new Set(CONTROL_OVERLAY_WORKFLOW_LABELS)
const ACTIONS = new Set(CONTROL_OVERLAY_TARGET_ACTION_KINDS)
const LABEL_BY_MODE = Object.freeze({
    demonstration: 'Workflow demonstration',
    replay: 'Workflow replay',
    governed: 'Governed workflow',
    managed: 'Managed workflow',
})
const SHA256 = /^[a-f0-9]{64}$/u
const PACK_ID = /^[a-z0-9][a-z0-9._-]{0,95}$/u

export function isSingleSourceExactPresentationMedia(media) {
    return Boolean(
        media?.kind === 'video' &&
            typeof media.src === 'string' &&
            /^\/[A-Za-z0-9][A-Za-z0-9._/-]*$/u.test(media.src) &&
            Number.isSafeInteger(media.width) &&
            media.width > 0 &&
            Number.isSafeInteger(media.height) &&
            media.height > 0 &&
            typeof media.alt === 'string' &&
            media.alt.length > 0 &&
            media.alt.length <= 300 &&
            (media.poster === undefined ||
                (typeof media.poster === 'string' &&
                    /^\/[A-Za-z0-9][A-Za-z0-9._/-]*$/u.test(media.poster))) &&
            typeof media.sha256 === 'string' &&
            SHA256.test(media.sha256) &&
            // Exact public presentation assets use one browser-portable MP4.
            // Raw evidence may retain WebM and fallback encodings, but an exact
            // overlay must bind one byte-identical source whose decoded sample
            // inventory is verified during the production build.
            media.mimeType === 'video/mp4' &&
            !media.fallbackSrc
    )
}

function pythonJsonFloat(value) {
    if (!Number.isFinite(value)) throw new Error('canonical float must be finite')
    if (Object.is(value, -0)) return '-0.0'
    const negative = value < 0
    const source = Math.abs(value).toString().toLowerCase()
    if (source === '0') return '0.0'

    let digits
    let decimalPosition
    if (source.includes('e')) {
        const [coefficient, exponentText] = source.split('e')
        const point = coefficient.indexOf('.')
        const integerDigits = point === -1 ? coefficient.length : point
        digits = coefficient.replace('.', '')
        decimalPosition = integerDigits + Number(exponentText)
    } else {
        const point = source.indexOf('.')
        const integerDigits = point === -1 ? source.length : point
        const combined = source.replace('.', '')
        const leadingZeroes = combined.match(/^0*/u)[0].length
        digits = combined.slice(leadingZeroes) || '0'
        decimalPosition = integerDigits - leadingZeroes
    }

    const exponent = decimalPosition - 1
    let rendered
    if (exponent >= -4 && exponent < 16) {
        if (decimalPosition <= 0) {
            rendered = `0.${'0'.repeat(-decimalPosition)}${digits}`
        } else if (decimalPosition >= digits.length) {
            rendered = `${digits}${'0'.repeat(decimalPosition - digits.length)}.0`
        } else {
            rendered = `${digits.slice(0, decimalPosition)}.${digits.slice(decimalPosition)}`
        }
    } else {
        const significant = digits.replace(/0+$/u, '') || '0'
        const coefficient = significant.length === 1
            ? significant
            : `${significant[0]}.${significant.slice(1)}`
        const exponentDigits = Math.abs(exponent).toString().padStart(2, '0')
        rendered = `${coefficient}e${exponent >= 0 ? '+' : '-'}${exponentDigits}`
    }
    return negative ? `-${rendered}` : rendered
}

export function canonicalControlOverlayTargetJson(target) {
    const action = target.action_kind === null
        ? 'null'
        : JSON.stringify(target.action_kind)
    return [
        '{"action_kind":', action,
        ',"binding":{"frame_index":', String(target.binding.frame_index),
        ',"kind":', JSON.stringify(target.binding.kind),
        ',"media_sha256":', JSON.stringify(target.binding.media_sha256), '}',
        ',"coordinate_space":', JSON.stringify(target.coordinate_space),
        ',"rect":{"height":', pythonJsonFloat(target.rect.height),
        ',"width":', pythonJsonFloat(target.rect.width),
        ',"x":', pythonJsonFloat(target.rect.x),
        ',"y":', pythonJsonFloat(target.rect.y), '}',
        ',"source_viewport":{"device_pixel_ratio":',
        pythonJsonFloat(target.source_viewport.device_pixel_ratio),
        ',"height_css_px":', String(target.source_viewport.height_css_px),
        ',"width_css_px":', String(target.source_viewport.width_css_px), '}}',
    ].join('')
}

function targetStateDigest(target) {
    if (target === null) return 'no-target'
    const canonical = canonicalControlOverlayTargetJson(target)
    return `target-${bytesToHex(sha256(utf8ToBytes(canonical))).slice(0, 16)}`
}

function deepFreeze(value) {
    if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value
    Object.values(value).forEach(deepFreeze)
    return Object.freeze(value)
}

function immutableJsonValue(value) {
    return deepFreeze(JSON.parse(JSON.stringify(value)))
}

function record(value, field) {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        throw new Error(`${field} must be an object`)
    }
    return value
}

function exactKeys(value, keys, field) {
    const allowed = new Set(keys)
    const unexpected = Object.keys(value).find((key) => !allowed.has(key))
    if (unexpected) {
        throw new Error(`${field} contains an unexpected field: ${unexpected}`)
    }
}

function integer(value, field, minimum = 0) {
    if (!Number.isSafeInteger(value) || value < minimum) {
        throw new Error(`${field} must be an integer >= ${minimum}`)
    }
    return value
}

function number(value, field, { minimum = 0, maximum = Number.MAX_VALUE } = {}) {
    if (
        typeof value !== 'number' ||
        !Number.isFinite(value) ||
        value < minimum ||
        value > maximum
    ) {
        throw new Error(`${field} is outside its allowed range`)
    }
    return value
}

function parseTarget(value, field) {
    const target = record(value, field)
    exactKeys(
        target,
        ['coordinate_space', 'rect', 'source_viewport', 'binding', 'action_kind'],
        field
    )
    if (target.coordinate_space !== 'top_level_viewport_normalized') {
        throw new Error(`${field} has an unsupported coordinate space`)
    }
    const rect = record(target.rect, `${field}.rect`)
    exactKeys(rect, ['x', 'y', 'width', 'height'], `${field}.rect`)
    const x = number(rect.x, `${field}.rect.x`, { maximum: 1 })
    const y = number(rect.y, `${field}.rect.y`, { maximum: 1 })
    const width = number(rect.width, `${field}.rect.width`, {
        minimum: Number.EPSILON,
        maximum: 1,
    })
    const height = number(rect.height, `${field}.rect.height`, {
        minimum: Number.EPSILON,
        maximum: 1,
    })
    if (x + width > 1 || y + height > 1) {
        throw new Error(`${field}.rect is outside the source viewport`)
    }
    const viewport = record(target.source_viewport, `${field}.source_viewport`)
    exactKeys(
        viewport,
        ['width_css_px', 'height_css_px', 'device_pixel_ratio'],
        `${field}.source_viewport`
    )
    integer(viewport.width_css_px, `${field}.source_viewport.width_css_px`, 1)
    integer(viewport.height_css_px, `${field}.source_viewport.height_css_px`, 1)
    if (viewport.width_css_px > 32768 || viewport.height_css_px > 32768) {
        throw new Error(`${field}.source_viewport exceeds the schema maximum`)
    }
    number(viewport.device_pixel_ratio, `${field}.source_viewport.device_pixel_ratio`, {
        minimum: Number.EPSILON,
        maximum: 16,
    })
    const binding = record(target.binding, `${field}.binding`)
    exactKeys(binding, ['kind', 'media_sha256', 'frame_index'], `${field}.binding`)
    if (
        binding.kind !== 'media_frame' ||
        typeof binding.media_sha256 !== 'string' ||
        !SHA256.test(binding.media_sha256)
    ) {
        throw new Error(`${field}.binding is not an exact media frame`)
    }
    integer(binding.frame_index, `${field}.binding.frame_index`)
    if (
        target.action_kind !== null &&
        (typeof target.action_kind !== 'string' || !ACTIONS.has(target.action_kind))
    ) {
        throw new Error(`${field}.action_kind is invalid`)
    }
    return target
}

function parseFrame(value, field) {
    const frame = record(value, field)
    exactKeys(
        frame,
        [
            'schema_version',
            'state_id',
            'event_sequence',
            'observed_at_unix_ms',
            'observed_at_monotonic_ms',
            'visible',
            'phase',
            'workflow_label',
            'mode',
            'profile',
            'step',
            'controls',
            'status',
            'presentation',
            'target_tracking',
        ],
        field
    )
    if (frame.schema_version !== CONTROL_OVERLAY_FRAME_V2_SCHEMA) {
        throw new Error(`${field} has an unsupported frame schema`)
    }
    if (
        typeof frame.state_id !== 'string' ||
        frame.state_id.length < 1 ||
        frame.state_id.length > 280
    ) {
        throw new Error(`${field}.state_id is invalid`)
    }
    integer(frame.event_sequence, `${field}.event_sequence`)
    integer(frame.observed_at_unix_ms, `${field}.observed_at_unix_ms`)
    number(frame.observed_at_monotonic_ms, `${field}.observed_at_monotonic_ms`)
    if (typeof frame.visible !== 'boolean' || frame.presentation !== true) {
        throw new Error(`${field} is not presentation-safe`)
    }
    if (!PHASES.has(frame.phase)) throw new Error(`${field}.phase is invalid`)
    if (!MODES.has(frame.mode)) throw new Error(`${field}.mode is invalid`)
    if (frame.profile !== null && !PROFILES.has(frame.profile)) {
        throw new Error(`${field}.profile is invalid`)
    }
    if (!LABELS.has(frame.workflow_label) || frame.workflow_label !== LABEL_BY_MODE[frame.mode]) {
        throw new Error(`${field}.workflow_label does not match mode`)
    }
    if (frame.status !== CONTROL_OVERLAY_STATUS_BY_PHASE[frame.phase]) {
        throw new Error(`${field}.status is not canonical`)
    }
    const step = record(frame.step, `${field}.step`)
    exactKeys(step, ['current', 'total'], `${field}.step`)
    const current = step.current === null ? null : integer(step.current, `${field}.step.current`, 1)
    const total = step.total === null ? null : integer(step.total, `${field}.step.total`, 1)
    if ((current === null) !== (total === null) || (current !== null && current > total)) {
        throw new Error(`${field}.step is inconsistent`)
    }
    const controls = record(frame.controls, `${field}.controls`)
    exactKeys(controls, ['pause', 'resume', 'stop'], `${field}.controls`)
    if (['pause', 'resume', 'stop'].some((key) => typeof controls[key] !== 'boolean')) {
        throw new Error(`${field}.controls is invalid`)
    }
    const target = frame.target_tracking === null
        ? null
        : parseTarget(frame.target_tracking, `${field}.target_tracking`)
    const baseStateId = [
        frame.visible ? 'visible' : 'hidden',
        frame.phase,
        frame.mode,
        frame.profile ?? 'no-profile',
        current ?? 'no-step',
        total ?? 'no-total',
        controls.pause ? 'pause' : 'no-pause',
        controls.resume ? 'resume' : 'no-resume',
        controls.stop ? 'stop' : 'no-stop',
    ].join(':')
    const expectedStateId = `${baseStateId}:${targetStateDigest(target)}`
    if (frame.state_id !== expectedStateId) {
        throw new Error(`${field}.state_id does not match the semantic V2 frame state`)
    }
    return frame
}

export function parseExecutionOverlayTimeline(value) {
    const timeline = record(value, 'execution overlay timeline')
    exactKeys(
        timeline,
        [
            'schema_version',
            'data_classification',
            'evidence_pack_id',
            'media_sha256',
            'media_frame_count',
            'duration_ms',
            'events',
        ],
        'execution overlay timeline'
    )
    if (timeline.schema_version !== CONTROL_OVERLAY_TIMELINE_V2_SCHEMA) {
        throw new Error('unsupported execution overlay timeline schema')
    }
    if (!['synthetic', 'sanitized_public'].includes(timeline.data_classification)) {
        throw new Error('execution overlay timeline is not public-safe')
    }
    if (
        typeof timeline.evidence_pack_id !== 'string' ||
        !PACK_ID.test(timeline.evidence_pack_id)
    ) {
        throw new Error('evidence_pack_id is invalid')
    }
    if (typeof timeline.media_sha256 !== 'string' || !SHA256.test(timeline.media_sha256)) {
        throw new Error('media_sha256 is invalid')
    }
    const frameCount = integer(timeline.media_frame_count, 'media_frame_count', 1)
    const duration = integer(timeline.duration_ms, 'duration_ms', 1)
    if (!Array.isArray(timeline.events) || timeline.events.length === 0) {
        throw new Error('execution overlay timeline must contain events')
    }
    let previousAt = -1
    let previousFrame = -1
    let previousSequence = -1
    let previousMonotonic = -1
    const events = timeline.events.map((candidate, index) => {
        const event = record(candidate, `execution overlay event ${index}`)
        exactKeys(
            event,
            ['at_ms', 'media_frame_index', 'frame'],
            `execution overlay event ${index}`
        )
        const at = integer(event.at_ms, `execution overlay event ${index}.at_ms`)
        const mediaFrameIndex = integer(
            event.media_frame_index,
            `execution overlay event ${index}.media_frame_index`
        )
        if (at <= previousAt || at > duration) {
            throw new Error(`execution overlay event ${index} has invalid media timing`)
        }
        if (mediaFrameIndex <= previousFrame || mediaFrameIndex >= frameCount) {
            throw new Error(`execution overlay event ${index} has invalid frame binding`)
        }
        const frame = parseFrame(event.frame, `execution overlay event ${index}.frame`)
        if (
            frame.event_sequence <= previousSequence ||
            frame.observed_at_monotonic_ms < previousMonotonic
        ) {
            throw new Error(`execution overlay event ${index} is out of source order`)
        }
        const target = frame.target_tracking
        if (
            target !== null &&
            (target.binding.media_sha256 !== timeline.media_sha256 ||
                target.binding.frame_index !== mediaFrameIndex)
        ) {
            throw new Error(
                `execution overlay event ${index} target is not bound to its exact media frame`
            )
        }
        previousAt = at
        previousFrame = mediaFrameIndex
        previousSequence = frame.event_sequence
        previousMonotonic = frame.observed_at_monotonic_ms
        return candidate
    })
    if (events[0].at_ms !== 0 || events[0].media_frame_index !== 0) {
        throw new Error('execution overlay timeline must begin at media frame zero')
    }
    return { ...timeline, events }
}

export function bindExecutionOverlayTimeline(timelineValue, bindingValue) {
    const timeline = parseExecutionOverlayTimeline(timelineValue)
    const binding = record(bindingValue, 'execution overlay media binding')
    exactKeys(
        binding,
        [
            'evidencePackId',
            'mediaSha256',
            'mediaFrameCount',
            'mediaFramePresentationTimesUs',
            'browserViewportIsExact',
        ],
        'execution overlay media binding'
    )
    if (timeline.evidence_pack_id !== binding.evidencePackId) {
        throw new Error('execution overlay timeline belongs to a different evidence pack')
    }
    if (timeline.media_sha256 !== binding.mediaSha256) {
        throw new Error('execution overlay timeline does not match the exact media digest')
    }
    if (timeline.media_frame_count !== binding.mediaFrameCount) {
        throw new Error('execution overlay timeline does not match decoded frame count')
    }
    if (binding.browserViewportIsExact !== true) {
        throw new Error('presentation media is not an exact browser viewport')
    }
    const pts = binding.mediaFramePresentationTimesUs
    if (
        !Array.isArray(pts) ||
        pts.length !== timeline.media_frame_count ||
        pts.some(
            (value, index) =>
                !Number.isSafeInteger(value) ||
                value < 0 ||
                (index > 0 && value <= pts[index - 1])
        )
    ) {
        throw new Error('decoded frame presentation timestamps are invalid')
    }
    timeline.events.forEach((event, index) => {
        const inventoriedAtMs = Math.round(pts[event.media_frame_index] / 1000)
        if (event.at_ms !== inventoriedAtMs) {
            throw new Error(
                `execution overlay event ${index} does not match its inventoried decoded-frame PTS`
            )
        }
    })
    return Object.freeze({
        timeline: immutableJsonValue(timeline),
        binding: immutableJsonValue(binding),
    })
}

export function executionOverlayFrameAt(timeline, currentTimeMs) {
    const bounded = Math.max(0, Math.min(currentTimeMs, timeline.duration_ms))
    let low = 0
    let high = timeline.events.length - 1
    while (low < high) {
        const midpoint = Math.ceil((low + high) / 2)
        if (timeline.events[midpoint].at_ms <= bounded) low = midpoint
        else high = midpoint - 1
    }
    return timeline.events[low].frame
}

export function decodedMediaFrameIndex(mediaTimeSeconds, binding) {
    const pts = binding.mediaFramePresentationTimesUs
    if (!Number.isFinite(mediaTimeSeconds)) return null
    const targetUs = Math.round(mediaTimeSeconds * 1_000_000)
    let low = 0
    let high = pts.length - 1
    while (low <= high) {
        const midpoint = Math.floor((low + high) / 2)
        if (pts[midpoint] === targetUs) return midpoint
        if (pts[midpoint] < targetUs) low = midpoint + 1
        else high = midpoint - 1
    }
    return null
}

export function exactTargetForDecodedFrame(timeline, binding, frameIndex) {
    if (frameIndex === null || binding.browserViewportIsExact !== true) return null
    const event = timeline.events.find(
        (candidate) => candidate.media_frame_index === frameIndex
    )
    const target = event?.frame.target_tracking ?? null
    if (
        target?.binding.kind !== 'media_frame' ||
        target.binding.frame_index !== frameIndex ||
        target.binding.media_sha256 !== binding.mediaSha256
    ) {
        return null
    }
    return target
}

export function mapTargetToContainedVideo(target, metrics) {
    const { elementWidth, elementHeight, videoWidth, videoHeight } = metrics
    if (
        ![elementWidth, elementHeight, videoWidth, videoHeight].every(
            (value) => Number.isFinite(value) && value > 0
        )
    ) {
        return null
    }
    const sourceAspect =
        target.source_viewport.width_css_px /
        target.source_viewport.height_css_px
    const videoAspect = videoWidth / videoHeight
    if (Math.abs(sourceAspect - videoAspect) > 1e-6) return null
    const scale = Math.min(elementWidth / videoWidth, elementHeight / videoHeight)
    const contentWidth = videoWidth * scale
    const contentHeight = videoHeight * scale
    const contentLeft = (elementWidth - contentWidth) / 2
    const contentTop = (elementHeight - contentHeight) / 2
    return {
        left: contentLeft + target.rect.x * contentWidth,
        top: contentTop + target.rect.y * contentHeight,
        width: target.rect.width * contentWidth,
        height: target.rect.height * contentHeight,
    }
}

export function chooseOverlayPlacement({
    stageWidth,
    stageHeight,
    capsuleWidth,
    capsuleHeight,
    avoidRegions = [],
    currentPlacement = null,
    inset = 10,
    clearance = 8,
}) {
    if (
        ![stageWidth, stageHeight, capsuleWidth, capsuleHeight].every(
            (value) => Number.isFinite(value) && value > 0
        ) ||
        capsuleWidth + inset * 2 > stageWidth ||
        capsuleHeight + inset * 2 > stageHeight
    ) {
        return 'hidden'
    }
    const top = stageHeight - inset - capsuleHeight
    const candidates = {
        'bottom-left': {
            left: inset,
            top,
            width: capsuleWidth,
            height: capsuleHeight,
        },
        'bottom-right': {
            left: stageWidth - inset - capsuleWidth,
            top,
            width: capsuleWidth,
            height: capsuleHeight,
        },
    }
    const intersects = (left, right) =>
        !(
            left.left + left.width + clearance <= right.left ||
            right.left + right.width + clearance <= left.left ||
            left.top + left.height + clearance <= right.top ||
            right.top + right.height + clearance <= left.top
        )
    const order = [
        ...(['bottom-left', 'bottom-right'].includes(currentPlacement)
            ? [currentPlacement]
            : []),
        'bottom-left',
        'bottom-right',
    ]
    for (const placement of [...new Set(order)]) {
        if (!avoidRegions.some((region) => intersects(candidates[placement], region))) {
            return placement
        }
    }
    return 'hidden'
}

export function executionRailForBoundContext(frame, context) {
    if (
        !context ||
        context.state_id !== frame.state_id ||
        context.event_sequence !== frame.event_sequence ||
        !['resolve', 'act', 'verify'].includes(context.execution_stage)
    ) {
        return []
    }
    const stages = ['resolve', 'act', 'verify']
    const active = stages.indexOf(context.execution_stage)
    return stages.map((stage, index) => ({
        label: stage[0].toUpperCase() + stage.slice(1),
        state:
            index < active
                ? 'complete'
                : index > active
                  ? 'pending'
                  : frame.phase === 'halted'
                    ? 'halted'
                    : frame.phase === 'verified'
                      ? 'complete'
                      : 'active',
    }))
}

export function bindExecutionOverlayContext(frame, value) {
    const context = record(value, 'execution overlay presentation context')
    exactKeys(
        context,
        ['state_id', 'event_sequence', 'execution_stage'],
        'execution overlay presentation context'
    )
    if (
        context.state_id !== frame.state_id ||
        context.event_sequence !== frame.event_sequence ||
        !['resolve', 'act', 'verify'].includes(context.execution_stage)
    ) {
        throw new Error('execution overlay presentation context is not bound to the exact frame')
    }
    return Object.freeze({ ...context })
}
