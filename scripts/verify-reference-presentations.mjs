import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { createFile } from 'mp4box'

import registry from '../data/referencePresentationAssets.mjs'
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

function publicJson(src) {
    return JSON.parse(fs.readFileSync(publicPath(src), 'utf8'))
}

function sha256(bytes) {
    return crypto.createHash('sha256').update(bytes).digest('hex')
}

function packFiles(directory, prefix = '') {
    const files = []
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
        const relative = prefix ? `${prefix}/${entry.name}` : entry.name
        const absolute = path.join(directory, entry.name)
        if (entry.isDirectory()) files.push(...packFiles(absolute, relative))
        else files.push(relative)
    }
    return files.sort()
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

assert.equal(registry.schemaVersion, 2, 'unsupported reference presentation registry')
assert.ok(Array.isArray(registry.assets), 'reference presentation assets must be an array')

const identities = new Set()
for (const asset of registry.assets) {
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
    const digest = sha256(bytes)
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

    const pack = asset.pack
    assert.ok(pack && typeof pack === 'object', `${label}: public pack is missing`)
    const inventoryPath = publicPath(pack.inventory)
    assert.equal(
        path.dirname(inventoryPath),
        path.dirname(publicPath(`${pack.root}/placeholder`)),
        `${label}: inventory is outside the declared pack root`
    )
    const manifestBytes = fs.readFileSync(publicPath(pack.manifest))
    const inventoryBytes = fs.readFileSync(inventoryPath)
    const packManifest = JSON.parse(manifestBytes.toString('utf8'))
    const inventory = JSON.parse(inventoryBytes.toString('utf8'))
    assert.equal(
        packManifest.schema_version,
        'openadapt.public-cross-surface-presentation/v1',
        `${label}: pack manifest schema mismatch`
    )
    assert.equal(
        inventory.schema_version,
        'openadapt.public-pack-inventory/v1',
        `${label}: pack inventory schema mismatch`
    )
    assert.equal(packManifest.pack_id, exact.timeline.evidence_pack_id, `${label}: pack id mismatch`)
    assert.equal(packManifest.data_classification, exact.timeline.data_classification, `${label}: data classification mismatch`)

    const expectedInventory = new Set()
    for (const entry of inventory.files) {
        assert.match(entry.path, /^(?!\/)(?!.*(?:^|\/)\.\.(?:\/|$))[A-Za-z0-9._/-]+$/u)
        assert.ok(!expectedInventory.has(entry.path), `${label}: duplicate inventory path`)
        expectedInventory.add(entry.path)
        const entryPath = path.resolve(path.dirname(inventoryPath), entry.path)
        assert.ok(
            entryPath.startsWith(`${path.dirname(inventoryPath)}${path.sep}`),
            `${label}: inventory path escapes the pack`
        )
        const entryBytes = fs.readFileSync(entryPath)
        assert.equal(entryBytes.byteLength, entry.bytes, `${label}: ${entry.path} byte count mismatch`)
        assert.equal(sha256(entryBytes), entry.sha256, `${label}: ${entry.path} digest mismatch`)
    }
    const actualPackFiles = packFiles(path.dirname(inventoryPath)).filter(
        (relative) => relative !== path.basename(inventoryPath)
    )
    assert.deepEqual(
        [...expectedInventory].sort(),
        actualPackFiles,
        `${label}: pack inventory does not account for every retained file`
    )
    assert.equal(
        sha256(manifestBytes),
        inventory.files.find((entry) => entry.path === 'manifest.json')?.sha256,
        `${label}: pack manifest is not inventory-bound`
    )

    const replay = packManifest.replay
    assert.equal(
        `${pack.root}/${replay.media.path}`,
        asset.media.src,
        `${label}: registry media differs from pack manifest`
    )
    assert.equal(replay.media.sha256, digest, `${label}: pack media digest mismatch`)
    assert.equal(replay.media.width, inspected.width, `${label}: pack media width mismatch`)
    assert.equal(replay.media.height, inspected.height, `${label}: pack media height mismatch`)
    assert.equal(replay.decoded_frame_count, inspected.frameCount, `${label}: pack frame count mismatch`)
    assert.deepEqual(
        replay.presentation_times_us,
        inspected.presentationTimesUs,
        `${label}: pack PTS inventory mismatch`
    )
    assert.equal(
        replay.declared_stream_duration_us,
        inspected.durationMs * 1000,
        `${label}: pack stream duration mismatch`
    )
    assert.equal(
        replay.declared_format_duration_us,
        inspected.durationMs * 1000,
        `${label}: pack format duration mismatch`
    )
    assert.equal(`${pack.root}/${replay.poster.path}`, asset.media.poster, `${label}: pack poster mismatch`)
    assert.equal(`${pack.root}/${replay.timeline.path}`, pack.timeline, `${label}: timeline path mismatch`)
    assert.equal(`${pack.root}/${replay.binding.path}`, pack.binding, `${label}: binding path mismatch`)
    assert.equal(`${pack.root}/${replay.contexts.path}`, pack.contexts, `${label}: contexts path mismatch`)

    const timelineDocument = publicJson(pack.timeline)
    const bindingDocument = publicJson(pack.binding)
    assert.deepEqual(timelineDocument, asset.timeline, `${label}: registry timeline differs from pack bytes`)
    assert.equal(bindingDocument.schema_version, 'openadapt.public-presentation-media-binding/v1')
    assert.equal(bindingDocument.media_sha256, exact.binding.mediaSha256)
    assert.equal(bindingDocument.decoded_frame_count, exact.binding.mediaFrameCount)
    assert.deepEqual(
        bindingDocument.presentation_times_us,
        exact.binding.mediaFramePresentationTimesUs,
        `${label}: registry binding differs from pack bytes`
    )
    assert.equal(bindingDocument.decoded_width, asset.media.width)
    assert.equal(bindingDocument.decoded_height, asset.media.height)

    const contextDocument = publicJson(pack.contexts)
    assert.equal(contextDocument.schema_version, 'openadapt.public-presentation-contexts/v2')
    assert.equal(contextDocument.data_classification, exact.timeline.data_classification)
    assert.equal(contextDocument.contexts.length, exact.timeline.events.length)
    const contextSequences = new Set()
    for (const [index, context] of contextDocument.contexts.entries()) {
        assert.ok(!contextSequences.has(context.event_sequence), `${label}: duplicate source context`)
        contextSequences.add(context.event_sequence)
        const event = exact.timeline.events[index]
        assert.equal(
            context.event_sequence,
            event.frame.event_sequence,
            `${label}: source context order differs from the timeline`
        )
        assert.equal(
            context.state_id,
            event.frame.state_id,
            `${label}: source context state differs from the timeline`
        )
        bindExecutionOverlayContext(event.frame, context)
    }
    assert.deepEqual(
        asset.contexts,
        contextDocument.contexts,
        `${label}: registry contexts differ from the exact pack bytes`
    )
}

console.log(`Verified ${registry.assets.length} exact reference presentation asset(s).`)
