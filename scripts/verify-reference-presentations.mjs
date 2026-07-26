import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { createFile } from 'mp4box'

import manifest from '../data/referencePresentationAssets.json' with { type: 'json' }
import {
    bindExecutionOverlayContext,
    bindExecutionOverlayTimeline,
    isSingleSourceExactPresentationMedia,
} from '../lib/executionOverlayTimeline.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

function publicPath(src) {
    assert.match(src, /^\/[A-Za-z0-9][A-Za-z0-9._/-]*$/u)
    const resolved = path.resolve(root, 'public', src.slice(1))
    assert.ok(
        resolved.startsWith(`${path.resolve(root, 'public')}${path.sep}`),
        `presentation asset escapes public/: ${src}`
    )
    return resolved
}

function inspectMp4(bytes, label) {
    return new Promise((resolve, reject) => {
        const file = createFile()
        let settled = false
        file.onError = (module, message) =>
            reject(new Error(`${label}: MP4 parse failed in ${module}: ${message}`))
        file.onReady = (info) => {
            try {
                const tracks = info.videoTracks ?? info.tracks.filter((track) => track.video)
                assert.equal(tracks.length, 1, `${label}: expected exactly one video track`)
                const track = tracks[0]
                file.onSamples = (_id, _user, samples) => {
                    try {
                        assert.equal(
                            samples.length,
                            track.nb_samples,
                            `${label}: decoded sample inventory is incomplete`
                        )
                        const minimumCts = Math.min(...samples.map((sample) => sample.cts))
                        const presentationTimesUs = samples
                            .map((sample) =>
                                Math.round(
                                    ((sample.cts - minimumCts) / sample.timescale) *
                                        1_000_000
                                )
                            )
                            .sort((left, right) => left - right)
                        assert.equal(
                            new Set(presentationTimesUs).size,
                            presentationTimesUs.length,
                            `${label}: duplicate presentation timestamps are unsupported`
                        )
                        const endUs = Math.max(
                            ...samples.map((sample) =>
                                Math.round(
                                    ((sample.cts - minimumCts + sample.duration) /
                                        sample.timescale) *
                                        1_000_000
                                )
                            )
                        )
                        settled = true
                        resolve({
                            width: track.video.width,
                            height: track.video.height,
                            frameCount: track.nb_samples,
                            presentationTimesUs,
                            durationMs: Math.round(endUs / 1000),
                        })
                    } catch (error) {
                        reject(error)
                    }
                }
                file.setExtractionOptions(track.id, null, { nbSamples: track.nb_samples })
                file.start()
            } catch (error) {
                reject(error)
            }
        }

        const arrayBuffer = bytes.buffer.slice(
            bytes.byteOffset,
            bytes.byteOffset + bytes.byteLength
        )
        arrayBuffer.fileStart = 0
        file.appendBuffer(arrayBuffer, true)
        file.flush()
        queueMicrotask(() => {
            if (!settled && !file.readySent) {
                reject(new Error(`${label}: MP4 metadata was not found`))
            }
        })
    })
}

assert.equal(manifest.schemaVersion, 1, 'unsupported reference presentation manifest')
assert.ok(Array.isArray(manifest.assets), 'reference presentation assets must be an array')

const identities = new Set()
for (const asset of manifest.assets) {
    const label = `${asset.applicationId}:${asset.phase}`
    assert.match(asset.applicationId, /^[a-z0-9][a-z0-9-]*$/u, `${label}: invalid app id`)
    assert.ok(['recording', 'replay'].includes(asset.phase), `${label}: invalid phase`)
    assert.ok(!identities.has(label), `${label}: duplicate presentation asset`)
    identities.add(label)
    assert.ok(
        isSingleSourceExactPresentationMedia(asset.media),
        `${label}: exact media contract is invalid`
    )

    const mediaPath = publicPath(asset.media.src)
    const bytes = fs.readFileSync(mediaPath)
    const digest = crypto.createHash('sha256').update(bytes).digest('hex')
    assert.equal(digest, asset.media.sha256, `${label}: media SHA-256 mismatch`)
    if (asset.media.poster) {
        assert.ok(fs.statSync(publicPath(asset.media.poster)).isFile(), `${label}: poster missing`)
    }

    const exact = bindExecutionOverlayTimeline(asset.timeline, asset.binding)
    assert.equal(exact.binding.mediaSha256, digest, `${label}: binding digest mismatch`)
    const inspected = await inspectMp4(bytes, label)
    assert.equal(inspected.width, asset.media.width, `${label}: decoded width mismatch`)
    assert.equal(inspected.height, asset.media.height, `${label}: decoded height mismatch`)
    assert.equal(
        inspected.frameCount,
        exact.binding.mediaFrameCount,
        `${label}: decoded frame count mismatch`
    )
    assert.deepEqual(
        inspected.presentationTimesUs,
        exact.binding.mediaFramePresentationTimesUs,
        `${label}: decoded frame PTS inventory mismatch`
    )
    assert.equal(
        inspected.durationMs,
        exact.timeline.duration_ms,
        `${label}: decoded duration mismatch`
    )

    for (const context of asset.contexts ?? []) {
        const event = exact.timeline.events.find(
            (candidate) => candidate.frame.event_sequence === context.event_sequence
        )
        assert.ok(event, `${label}: context has no matching timeline event`)
        bindExecutionOverlayContext(event.frame, context)
    }
}

console.log(`Verified ${manifest.assets.length} exact reference presentation asset(s).`)
