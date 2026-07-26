const assert = require('node:assert/strict')
const test = require('node:test')

const digest = 'a'.repeat(64)

const frame = (sequence, phase = 'executing', target = null) => ({
    schema_version: 'openadapt.control-overlay-frame/v2',
    state_id: [
        'visible',
        phase,
        'governed',
        'standard',
        1,
        2,
        'no-pause',
        'no-resume',
        'no-stop',
        target ? `target-${'b'.repeat(16)}` : 'no-target',
    ].join(':'),
    event_sequence: sequence,
    observed_at_unix_ms: 1_785_000_000_000 + sequence,
    observed_at_monotonic_ms: 10_000 + sequence,
    visible: true,
    phase,
    workflow_label: 'Governed workflow',
    mode: 'governed',
    profile: 'standard',
    step: { current: 1, total: 2 },
    controls: { pause: false, resume: false, stop: false },
    status:
        phase === 'verified'
            ? 'Outcome verified'
            : 'Executing with verification gates',
    presentation: true,
    target_tracking: target,
})

const target = {
    coordinate_space: 'top_level_viewport_normalized',
    rect: { x: 0.25, y: 0.25, width: 0.5, height: 0.5 },
    source_viewport: {
        width_css_px: 1280,
        height_css_px: 720,
        device_pixel_ratio: 1,
    },
    binding: { kind: 'media_frame', media_sha256: digest, frame_index: 2 },
    action_kind: 'click',
}

const timeline = () => ({
    schema_version: 'openadapt.control-overlay-timeline/v2',
    data_classification: 'sanitized_public',
    evidence_pack_id: 'reference-pack-v2',
    media_sha256: digest,
    media_frame_count: 3,
    duration_ms: 67,
    events: [
        { at_ms: 0, media_frame_index: 0, frame: frame(1) },
        { at_ms: 67, media_frame_index: 2, frame: frame(2, 'verified', target) },
    ],
})

const binding = () => ({
    evidencePackId: 'reference-pack-v2',
    mediaSha256: digest,
    mediaFrameCount: 3,
    mediaFramePresentationTimesUs: [0, 33333, 66667],
    browserViewportIsExact: true,
})

test('canonical V2 parsing refuses unsafe fields and media/PTS mismatches', async () => {
    const { bindExecutionOverlayTimeline } = await import(
        '../lib/executionOverlayTimeline.js'
    )
    assert.doesNotThrow(() => bindExecutionOverlayTimeline(timeline(), binding()))

    const leaked = timeline()
    leaked.events[0].frame.patient_name = 'Jane Doe'
    assert.throws(
        () => bindExecutionOverlayTimeline(leaked, binding()),
        /unexpected field/
    )
    assert.throws(
        () =>
            bindExecutionOverlayTimeline(timeline(), {
                ...binding(),
                mediaSha256: 'c'.repeat(64),
            }),
        /exact media digest/
    )
    assert.throws(
        () =>
            bindExecutionOverlayTimeline(timeline(), {
                ...binding(),
                mediaFramePresentationTimesUs: [0, 33333, 65000],
            }),
        /inventoried decoded-frame PTS/
    )
})

test('status persists by bounded time while target exists only on its exact frame', async () => {
    const {
        bindExecutionOverlayTimeline,
        exactTargetForDecodedFrame,
        executionOverlayFrameAt,
        mapTargetToContainedVideo,
    } = await import('../lib/executionOverlayTimeline.js')
    const exact = bindExecutionOverlayTimeline(timeline(), binding())
    assert.equal(executionOverlayFrameAt(exact.timeline, 66).phase, 'executing')
    assert.equal(executionOverlayFrameAt(exact.timeline, 1000).phase, 'verified')
    assert.equal(exactTargetForDecodedFrame(exact.timeline, exact.binding, 1), null)
    const boundTarget = exactTargetForDecodedFrame(
        exact.timeline,
        exact.binding,
        2
    )
    assert.equal(boundTarget, target)
    assert.deepEqual(
        mapTargetToContainedVideo(boundTarget, {
            elementWidth: 640,
            elementHeight: 480,
            videoWidth: 1280,
            videoHeight: 720,
        }),
        { left: 160, top: 150, width: 320, height: 180 }
    )
    assert.equal(
        mapTargetToContainedVideo(boundTarget, {
            elementWidth: 640,
            elementHeight: 480,
            videoWidth: 1024,
            videoHeight: 768,
        }),
        null
    )
})

test('capsule placement is event-stable and rail requires exact bound context', async () => {
    const { chooseOverlayPlacement, executionRailForBoundContext } = await import(
        '../lib/executionOverlayTimeline.js'
    )
    const dimensions = {
        stageWidth: 800,
        stageHeight: 450,
        capsuleWidth: 300,
        capsuleHeight: 90,
    }
    assert.equal(chooseOverlayPlacement(dimensions), 'bottom-left')
    assert.equal(
        chooseOverlayPlacement({
            ...dimensions,
            currentPlacement: 'bottom-right',
        }),
        'bottom-right'
    )
    assert.equal(
        chooseOverlayPlacement({
            ...dimensions,
            avoidRegions: [{ left: 10, top: 350, width: 310, height: 90 }],
        }),
        'bottom-right'
    )
    assert.equal(
        chooseOverlayPlacement({
            ...dimensions,
            avoidRegions: [
                { left: 10, top: 350, width: 310, height: 90 },
                { left: 480, top: 350, width: 310, height: 90 },
            ],
        }),
        'hidden'
    )
    const activeFrame = frame(5)
    assert.deepEqual(executionRailForBoundContext(activeFrame, null), [])
    assert.deepEqual(
        executionRailForBoundContext(activeFrame, {
            state_id: activeFrame.state_id,
            event_sequence: activeFrame.event_sequence,
            execution_stage: 'act',
        }).map(({ state }) => state),
        ['complete', 'active', 'pending']
    )
})

test('exact presentation refuses an unbound fallback encoding', async () => {
    const { isSingleSourceExactPresentationMedia } = await import(
        '../lib/executionOverlayTimeline.js'
    )
    const exactMedia = {
        kind: 'video',
        src: '/presentation.webm',
        mimeType: 'video/webm',
        sha256: digest,
        fallbackSrc: '/presentation.mp4',
        fallbackMimeType: 'video/mp4',
    }
    assert.equal(isSingleSourceExactPresentationMedia(exactMedia), false)
    delete exactMedia.fallbackSrc
    delete exactMedia.fallbackMimeType
    assert.equal(isSingleSourceExactPresentationMedia(exactMedia), true)
})
