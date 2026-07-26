export const MAX_JSON_ARTIFACT_BYTES = 5 * 1024 * 1024
export const MAX_INDEXED_JSON_NODES = 20_000
export const MAX_JSON_TREE_DEPTH = 100
export const MAX_JSON_SEARCH_RESULTS = 100

/**
 * Exact, committed public artifacts that may be opened by the interactive
 * viewer. This is deliberately a registry rather than a path-prefix rule: the
 * viewer must never become a general same-origin fetch surface.
 *
 * The matching test recomputes every digest from public/ so changing an
 * artifact requires an intentional registry update in the same review.
 */
export const PUBLIC_JSON_ARTIFACTS = Object.freeze({
    '/status.json': Object.freeze({
        source: '/status.json',
        fileName: 'status.json',
        format: 'json',
        title: 'OpenAdapt product status',
        description:
            'The canonical machine-readable release, capability, evidence, and deployment status.',
        sha256: '5b9a99e52a4e020d9a72b7747a52c522256b60c0b29a549eee215eb6ec5586b9',
    }),
    '/desktop-preview/MANIFEST.json': Object.freeze({
        source: '/desktop-preview/MANIFEST.json',
        fileName: 'MANIFEST.json',
        format: 'json',
        title: 'Desktop preview media manifest',
        description:
            'Capture provenance and content hashes for the public Desktop screenshots.',
        sha256: '8c0c67b7af7d4cedbf93175e4a74d1a7ac7f19b799e309dbeb044cf8dced30ee',
    }),
    '/lending-demo/provenance.json': Object.freeze({
        source: '/lending-demo/provenance.json',
        fileName: 'provenance.json',
        format: 'json',
        title: 'Frappe Lending reference evidence',
        description:
            'Application versions, trial scope, effect checks, and media hashes for the lending reference.',
        sha256: '14b8f6893a4a008f42d7b3f57152a41cfdf4fdad943a15be72c77bd328e5fe18',
    }),
    '/insurance-demo/provenance.json': Object.freeze({
        source: '/insurance-demo/provenance.json',
        fileName: 'provenance.json',
        format: 'json',
        title: 'openIMIS reference evidence',
        description:
            'Application version, trial scope, effect checks, and media hashes for the insurance reference.',
        sha256: '47b09adf7d96c2a206aa63349f147b3020ca68c982761cc80739ee880e9ef93e',
    }),
    '/how-it-works/MANIFEST.json': Object.freeze({
        source: '/how-it-works/MANIFEST.json',
        fileName: 'MANIFEST.json',
        format: 'json',
        title: 'Reference footage manifest',
        description:
            'Source and content-hash provenance for the public workflow footage.',
        sha256: '7e650141f3772d979cb58b83d162df7b7d1f4e530d93c2b64de53c48f5845029',
    }),
    '/product-preview/MANIFEST.json': Object.freeze({
        source: '/product-preview/MANIFEST.json',
        fileName: 'MANIFEST.json',
        format: 'json',
        title: 'Product preview media manifest',
        description:
            'Content hashes and capture provenance for the public product preview.',
        sha256: '852fc2edf84b6e27b4e62ba35d7b31fd3893a638c8a3eb2de79970ec3447cf31',
    }),
    '/cloud-preview/provenance.json': Object.freeze({
        source: '/cloud-preview/provenance.json',
        fileName: 'provenance.json',
        format: 'json',
        title: 'Cloud preview provenance',
        description:
            'Capture provenance and public-data boundary for the Cloud dashboard preview.',
        sha256: 'f2e2f947554a6173cc87a9d324544199de428a414d608417da526c6df0233a9d',
    }),
    '/images/frappe-lending-reference.provenance.json': Object.freeze({
        source: '/images/frappe-lending-reference.provenance.json',
        fileName: 'frappe-lending-reference.provenance.json',
        format: 'json',
        title: 'Frappe Lending image provenance',
        description:
            'Capture source and content hash for the Frappe Lending reference image.',
        sha256: 'e5d49793f4e953dafd3549b608d89f66c5bfd777fe39591c6690e94d51013b79',
    }),
})

export function getPublicJsonArtifact(source) {
    if (typeof source !== 'string') return null
    return PUBLIC_JSON_ARTIFACTS[source] || null
}

export function isJsonPointer(pointer) {
    return (
        pointer === '' ||
        (typeof pointer === 'string' &&
            pointer.startsWith('/') &&
            pointer.length <= 2048 &&
            !/[\u0000-\u001f\u007f]/.test(pointer) &&
            !/~(?:[^01]|$)/.test(pointer))
    )
}

export function publicJsonViewerHref({ source, pointer = '' }) {
    const artifact = getPublicJsonArtifact(source)
    if (!artifact || !isJsonPointer(pointer)) return null

    const params = new URLSearchParams({ source: artifact.source })
    if (pointer) params.set('pointer', pointer)
    return `/artifacts/json?${params.toString()}`
}

export function isExactPublicArtifactResponseUrl(responseUrl, origin, source) {
    const artifact = getPublicJsonArtifact(source)
    if (!artifact) return false
    try {
        const expected = new URL(artifact.source, origin)
        const actual = new URL(responseUrl)
        return (
            actual.origin === expected.origin &&
            actual.pathname === expected.pathname &&
            actual.search === '' &&
            actual.hash === ''
        )
    } catch {
        return false
    }
}

export function parseJsonArtifact(text, format) {
    if (format === 'json') return JSON.parse(text)
    if (format !== 'jsonl') throw new Error('Unsupported JSON artifact format.')

    const values = []
    for (const [index, line] of text.split(/\r?\n/).entries()) {
        if (!line.trim()) continue
        try {
            values.push(JSON.parse(line))
        } catch {
            throw new Error(`JSON Lines record ${index + 1} is not valid JSON.`)
        }
    }
    return values
}

function pointerToken(value) {
    return String(value).replaceAll('~', '~0').replaceAll('/', '~1')
}

function jsonPath(parent, key) {
    if (typeof key === 'number') return `${parent}[${key}]`
    if (/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(key)) return `${parent}.${key}`
    return `${parent}[${JSON.stringify(key)}]`
}

export function buildJsonArtifactIndex(
    data,
    limit = MAX_INDEXED_JSON_NODES
) {
    const nodes = []
    const byPointer = new Map()
    const objectPointers = new WeakMap()
    let maxDepth = 0
    let truncated = false
    const pending = [{ value: data, pointer: '', path: '$', depth: 0 }]

    while (pending.length) {
        if (nodes.length >= limit) {
            truncated = true
            break
        }
        const current = pending.pop()
        nodes.push(current)
        byPointer.set(current.pointer, current)
        maxDepth = Math.max(maxDepth, current.depth)

        if (!current.value || typeof current.value !== 'object') continue
        objectPointers.set(current.value, current.pointer)
        const entries = Array.isArray(current.value)
            ? current.value.map((value, index) => [index, value])
            : Object.entries(current.value)

        for (let index = entries.length - 1; index >= 0; index -= 1) {
            const [key, value] = entries[index]
            pending.push({
                value,
                pointer: `${current.pointer}/${pointerToken(key)}`,
                path: jsonPath(current.path, key),
                depth: current.depth + 1,
            })
        }
    }

    return { nodes, byPointer, objectPointers, maxDepth, truncated }
}

function valuePreview(value) {
    if (Array.isArray(value)) return `[${value.length} items]`
    if (value && typeof value === 'object') {
        return `{${Object.keys(value).length} fields}`
    }
    return JSON.stringify(value)
}

export function searchJsonIndex(
    index,
    query,
    limit = MAX_JSON_SEARCH_RESULTS
) {
    const needle = query.trim().toLocaleLowerCase()
    if (!needle) return { matches: [], hasMore: false }

    const matches = []
    let hasMore = false
    for (const node of index.nodes) {
        const haystack = `${node.path}\n${jsonValuePreview(
            node.value
        )}`.toLocaleLowerCase()
        if (!haystack.includes(needle)) continue
        if (matches.length >= limit) {
            hasMore = true
            break
        }
        matches.push(node)
    }
    return { matches, hasMore }
}

export function copyableJsonValue(value) {
    if (typeof value === 'string') return value
    if (value === null || typeof value !== 'object') return String(value)
    return JSON.stringify(value, null, 2)
}

export function jsonValuePreview(value) {
    const preview = valuePreview(value)
    return preview.length > 180 ? `${preview.slice(0, 177)}…` : preview
}
