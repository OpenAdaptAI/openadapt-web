/**
 * OpenEMR governed-run film contracts.
 *
 * The film on /execute is an approved-egress artifact: the published bytes
 * must stay byte-identical to the hashes cleared against the private
 * provenance record, and the page must keep the honesty disclosures (real
 * application, synthetic data, synthesized narration). A recompressed film,
 * a swapped poster, or a dropped disclosure has to break a test first.
 */

const assert = require('node:assert/strict')
const crypto = require('node:crypto')
const fs = require('node:fs')
const path = require('node:path')
const test = require('node:test')

const root = path.join(__dirname, '..')
const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8')

// Approved-egress hashes from the private pre-publication provenance record.
const FLAGSHIP_MP4_SHA256 =
    'b60f10762b7d717f8387341c90b54b94d2f48ec2ee622500a9c7f5d7c237598b'
const POSTER_SHA256 =
    'eec7b18d83567b8b3dd98ff83c1935c3009f125267f095f1c57ea40b55d1c5b3'

test('OpenEMR film media stays byte-identical to the approved egress set', () => {
    const provenance = JSON.parse(read('public/media/openemr/provenance.json'))

    assert.equal(provenance.synthetic_fixture, true)
    assert.equal(
        provenance.media['openadapt_openemr_flagship.mp4'].sha256,
        FLAGSHIP_MP4_SHA256
    )
    assert.equal(provenance.media['poster.png'].sha256, POSTER_SHA256)

    for (const [filename, metadata] of Object.entries(provenance.media)) {
        const digest = crypto
            .createHash('sha256')
            .update(
                fs.readFileSync(path.join(root, 'public/media/openemr', filename))
            )
            .digest('hex')
        assert.equal(
            digest,
            metadata.sha256,
            `sha256 mismatch for openemr film media ${filename}`
        )
    }
})

test('WebVTT captions carry the approved cue text unchanged', () => {
    const vtt = read('public/media/openemr/openadapt_openemr_flagship.vtt')

    assert.match(vtt, /^WEBVTT\n/)
    // Timestamps use the WebVTT period decimal separator, never the SRT comma.
    assert.doesNotMatch(vtt, /\d\d:\d\d:\d\d,\d\d\d/)
    // First, centerpiece-halt, and closing cues from the approved captions.
    assert.match(vtt, /Every day, the same job\./)
    assert.match(vtt, /So it writes nothing\./)
    assert.match(vtt, /One identity check, and none confirmed\./)
    assert.match(vtt, /OpenAdapt\. Open source\. Runs on your own computer\./)
})

test('/execute embeds the film with controls, captions, and the disclosures', () => {
    const page = read('pages/execute.js')

    assert.match(page, /\/media\/openemr\/openadapt_openemr_flagship\.mp4/)
    assert.match(page, /\/media\/openemr\/openadapt_openemr_flagship\.vtt/)
    assert.match(page, /poster="\/media\/openemr\/poster\.png"/)
    assert.match(page, /preload="metadata"/)
    assert.match(page, /kind="captions"/)
    assert.doesNotMatch(
        page,
        /autoPlay/,
        'the narrated film must never autoplay'
    )
    // The published disclosure caption, verbatim.
    assert.match(
        page,
        /Real OpenEMR, synthetic data\. Narration is a synthesized voice\./
    )
})
