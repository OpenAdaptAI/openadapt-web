const assert = require('node:assert/strict')
const crypto = require('node:crypto')
const fs = require('node:fs')
const path = require('node:path')
const test = require('node:test')

const root = path.join(__dirname, '..')

async function subject() {
    return import('../lib/publicJsonArtifacts.mjs')
}

function publicJsonFiles(directory = path.join(root, 'public')) {
    const files = []
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
        const absolute = path.join(directory, entry.name)
        if (entry.isDirectory()) files.push(...publicJsonFiles(absolute))
        else if (/\.jsonl?$/.test(entry.name)) {
            files.push(`/${path.relative(path.join(root, 'public'), absolute)}`)
        }
    }
    return files.sort()
}

test('the exact public JSON allowlist is complete and hash-bound', async () => {
    const {
        PUBLIC_JSON_ARTIFACTS,
        MAX_JSON_ARTIFACT_BYTES,
        parseJsonArtifact,
    } = await subject()
    assert.deepEqual(Object.keys(PUBLIC_JSON_ARTIFACTS).sort(), publicJsonFiles())

    for (const artifact of Object.values(PUBLIC_JSON_ARTIFACTS)) {
        const bytes = fs.readFileSync(
            path.join(root, 'public', artifact.source.slice(1))
        )
        assert.ok(bytes.byteLength <= MAX_JSON_ARTIFACT_BYTES)
        assert.equal(
            crypto.createHash('sha256').update(bytes).digest('hex'),
            artifact.sha256
        )
        assert.notEqual(
            parseJsonArtifact(bytes.toString('utf8'), artifact.format),
            undefined
        )
    }
})

test('viewer URLs reject remote, API, traversal, query, and unregistered paths', async () => {
    const { publicJsonViewerHref } = await subject()

    assert.equal(
        publicJsonViewerHref({ source: '/status.json' }),
        '/artifacts/json?source=%2Fstatus.json'
    )
    for (const source of [
        'https://example.com/status.json',
        '//example.com/status.json',
        '/api/repository-stats.json',
        '/../status.json',
        '/status.json?next=https://example.com',
        '/not-registered.json',
    ]) {
        assert.equal(publicJsonViewerHref({ source }), null, source)
    }
})

test('redirected artifact responses must retain the exact registered URL', async () => {
    const { isExactPublicArtifactResponseUrl } = await subject()
    const origin = 'https://openadapt.ai'

    assert.equal(
        isExactPublicArtifactResponseUrl(
            'https://openadapt.ai/status.json',
            origin,
            '/status.json'
        ),
        true
    )
    assert.equal(
        isExactPublicArtifactResponseUrl(
            'https://cdn.example/status.json',
            origin,
            '/status.json'
        ),
        false
    )
    assert.equal(
        isExactPublicArtifactResponseUrl(
            'https://openadapt.ai/status.json?raw=1',
            origin,
            '/status.json'
        ),
        false
    )
})

test('JSON pointers, JSON Lines, indexing, and search share one contract', async () => {
    const {
        buildJsonArtifactIndex,
        isJsonPointer,
        parseJsonArtifact,
        searchJsonIndex,
    } = await subject()
    const parsed = parseJsonArtifact(
        '{"outcome":"VERIFIED"}\n{"a/b":{"~key":2}}\n',
        'jsonl'
    )
    const index = buildJsonArtifactIndex(parsed)

    assert.equal(index.byPointer.get('/0/outcome').value, 'VERIFIED')
    assert.equal(index.byPointer.get('/1/a~1b/~0key').value, 2)
    assert.deepEqual(
        searchJsonIndex(index, 'verified').matches.map((node) => node.pointer),
        ['/0/outcome']
    )
    assert.equal(isJsonPointer('/1/a~1b/~0key'), true)
    assert.equal(isJsonPointer('/bad~escape'), false)
})
