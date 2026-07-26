const assert = require('node:assert/strict')
const test = require('node:test')

const digest = 'a'.repeat(64)

const targetState = 'target-59b8e1f7cc3dedc6'

const frame = (sequence, phase = 'executing', target = null, visible = true) => ({
    schema_version: 'openadapt.control-overlay-frame/v2',
    state_id: [
        visible ? 'visible' : 'hidden',
        phase,
        'governed',
        'standard',
        1,
        2,
        'no-pause',
        'no-resume',
        'no-stop',
        target ? targetState : 'no-target',
    ].join(':'),
    event_sequence: sequence,
    observed_at_unix_ms: 1_785_000_000_000 + sequence,
    observed_at_monotonic_ms: 10_000 + sequence,
    visible,
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
    const { bindExecutionOverlayTimeline, canonicalControlOverlayTargetJson } = await import(
        '../lib/executionOverlayTimeline.js'
    )
    assert.doesNotThrow(() => bindExecutionOverlayTimeline(timeline(), binding()))
    assert.equal(
        canonicalControlOverlayTargetJson(target),
        '{"action_kind":"click","binding":{"frame_index":2,"kind":"media_frame","media_sha256":"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"},"coordinate_space":"top_level_viewport_normalized","rect":{"height":0.5,"width":0.5,"x":0.25,"y":0.25},"source_viewport":{"device_pixel_ratio":1.0,"height_css_px":720,"width_css_px":1280}}'
    )

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
    const forged = timeline()
    forged.events[1].frame.target_tracking = structuredClone(target)
    forged.events[1].frame.target_tracking.rect.x = 0.2
    assert.throws(
        () => bindExecutionOverlayTimeline(forged, binding()),
        /state_id does not match/
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
    assert.deepEqual(boundTarget, target)
    assert.equal(Object.isFrozen(exact.timeline.events[1].frame.target_tracking), true)
    assert.equal(Object.isFrozen(exact.binding.mediaFramePresentationTimesUs), true)
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

test('capsule placement is event-stable and presentation facts require exact bound context', async () => {
    const {
        bindExecutionOverlayContext,
        chooseOverlayPlacement,
        executionOverlayPresentation,
        executionRailForBoundContext,
    } = await import(
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
    const context = bindExecutionOverlayContext(activeFrame, {
        state_id: activeFrame.state_id,
        event_sequence: activeFrame.event_sequence,
        surface: 'browser',
        runtime: 'local',
        minimum_effect_tier: 1,
        effect_evidence: 'passed',
        execution_stage: 'act',
        model_calls: 0,
        external_network_calls: 'observed',
    })
    assert.deepEqual(
        executionRailForBoundContext(activeFrame, context).map(({ state }) => state),
        ['complete', 'active', 'pending']
    )
    const presentation = executionOverlayPresentation(activeFrame, context, 12_000)
    assert.equal(presentation.progressLabel, 'Step 1 of 2')
    assert.deepEqual(presentation.secondaryLabels, [
        'Browser',
        'Local runtime',
        'Standard profile',
        '0:12',
        'Independent system check (Tier 1)',
        'Effect evidence passed',
        '0 model calls',
        'External network activity observed',
    ])
    assert.throws(
        () => bindExecutionOverlayContext(activeFrame, {
            ...context,
            evidence_href: 'https://example.com/evidence',
        }),
        /unsafe evidence link/
    )
})

test('exact presentation refuses an unbound fallback encoding', async () => {
    const { isSingleSourceExactPresentationMedia } = await import(
        '../lib/executionOverlayTimeline.js'
    )
    const exactMedia = {
        kind: 'video',
        src: '/presentation.mp4',
        mimeType: 'video/mp4',
        sha256: digest,
        width: 1280,
        height: 720,
        alt: 'Exact presentation fixture',
        fallbackSrc: '/presentation.mp4',
        fallbackMimeType: 'video/mp4',
    }
    assert.equal(isSingleSourceExactPresentationMedia(exactMedia), false)
    delete exactMedia.fallbackSrc
    delete exactMedia.fallbackMimeType
    assert.equal(isSingleSourceExactPresentationMedia(exactMedia), true)
})
