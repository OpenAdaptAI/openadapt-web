/* eslint-disable */
/**
 * GENERATED public projection from openadapt-types 0.5.0 at
 * 80708f5b8e87c87fc847bcf57d61b54a269087c4. Do not edit by hand.
 *
 * Schema SHA-256:
 * frame-v2    f1fc8b694600c28d331dfb0e8a21ea7ece62aa46f9c5130f8289f237ae9f73b6
 * timeline-v2 655f8060b7904d4bc02fced631af1f733f77dd30e7c186eda15b575e346f9748
 */

export const CONTROL_OVERLAY_FRAME_V2_SCHEMA =
    'openadapt.control-overlay-frame/v2'
export const CONTROL_OVERLAY_TIMELINE_V2_SCHEMA =
    'openadapt.control-overlay-timeline/v2'

export const CONTROL_OVERLAY_PHASES = Object.freeze([
    'idle',
    'observing',
    'recording',
    'executing',
    'pausing',
    'paused',
    'resuming',
    'stopping',
    'verifying',
    'verified',
    'completed_unverified',
    'halted',
    'failed',
    'rolled_back',
])
export const CONTROL_OVERLAY_MODES = Object.freeze([
    'demonstration',
    'replay',
    'governed',
    'managed',
])
export const CONTROL_OVERLAY_PROFILES = Object.freeze([
    'demo',
    'standard',
    'regulated',
])
export const CONTROL_OVERLAY_WORKFLOW_LABELS = Object.freeze([
    'Workflow demonstration',
    'Workflow replay',
    'Governed workflow',
    'Managed workflow',
])
export const CONTROL_OVERLAY_STATUS_BY_PHASE = Object.freeze({
    idle: 'Ready',
    observing: 'Observing the application',
    recording: 'Watching your demonstration',
    executing: 'Executing with verification gates',
    pausing: 'Pausing at a safe boundary',
    paused: 'Execution paused',
    resuming: 'Resuming at a safe boundary',
    stopping: 'Stopping at a safe boundary',
    verifying: 'Verifying the intended result',
    verified: 'Outcome verified',
    completed_unverified: 'Completed without sufficient verification',
    halted: 'Halted instead of guessing',
    failed: 'Execution failed',
    rolled_back: 'Compensating action completed',
})
export const CONTROL_OVERLAY_TARGET_ACTION_KINDS = Object.freeze([
    'click',
    'double_click',
    'right_click',
    'drag',
    'type',
    'select',
    'toggle',
    'invoke',
    'expand_collapse',
    'scroll',
    'hover',
])
