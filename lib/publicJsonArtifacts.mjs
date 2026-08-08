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
        // status.json changes with routine releases. Keep its exact path
        // allowlisted and show the loaded digest, but do not make every status
        // update manually synchronize a second copy of the same hash.
        sha256: null,
    }),
    '/demos/rdp/qualification.json': Object.freeze({
        source: '/demos/rdp/qualification.json',
        fileName: 'qualification.json',
        format: 'json',
        title: 'RDP reference qualification evidence',
        description:
            'Exact trial outcomes, identity and effect checks, failure counts, and source versions for the accepted RDP reference batch.',
        sha256: '80f4fad81b27c6cbf8fecad0f8e7092b87d6943140d3eb0096dc2943b98bd173',
    }),
    '/demos/rdp/program-graph.json': Object.freeze({
        source: '/demos/rdp/program-graph.json',
        fileName: 'program-graph.json',
        format: 'json',
        title: 'RDP compiled workflow graph',
        description:
            'The exact exported program graph used in the accepted RDP reference presentation.',
        sha256: '7cb346cabe49b1077b9eaa960257d32f6a9262401fcf7443218e7726a7203570',
    }),
    '/demos/rdp/presentation.manifest.json': Object.freeze({
        source: '/demos/rdp/presentation.manifest.json',
        fileName: 'presentation.manifest.json',
        format: 'json',
        title: 'RDP presentation manifest',
        description:
            'Content hashes and exact retained-frame provenance for the paced RDP presentation video.',
        sha256: '766d3359f86b4ed34f038642cd7c10187010bb960a6d4d2cccf021f078e16c1d',
    }),
    '/demos/rdp/presentation.timeline.json': Object.freeze({
        source: '/demos/rdp/presentation.timeline.json',
        fileName: 'presentation.timeline.json',
        format: 'json',
        title: 'RDP hybrid presentation timeline',
        description:
            'Exact decoded-frame intervals, retained source-frame bindings, and public runtime facts for the RDP presentation.',
        sha256: 'bde3bdafd21867fe3353ee586256c032efb7c10efe9eac09792d9a88636cd831',
    }),
    '/desktop-preview/MANIFEST.json': Object.freeze({
        source: '/desktop-preview/MANIFEST.json',
        fileName: 'MANIFEST.json',
        format: 'json',
        title: 'Desktop preview media manifest',
        description:
            'Capture provenance and content hashes for the public Desktop screenshots.',
        sha256: '9619be09731ba16813ce23883521bf15e095581a67ccf0d64b27dd610aa01d43',
    }),
    '/attended-decision/provenance.json': Object.freeze({
        source: '/attended-decision/provenance.json',
        fileName: 'provenance.json',
        format: 'json',
        title: 'Attended decision capture provenance',
        description:
            'Source, action sequence, and content hashes for the public mobile decision captures.',
        sha256: '4a7d6283c9134f09c5018b36bf9dc4a5f41f963febe3b978ea12ed07af3f8ff6',
    }),
    '/qualification-judgment/provenance.json': Object.freeze({
        source: '/qualification-judgment/provenance.json',
        fileName: 'provenance.json',
        format: 'json',
        title: 'Qualification judgment capture provenance',
        description:
            'Source, synthetic-data boundary, and exact content hash for the public qualification judgment capture.',
        sha256: '1678daa7249aee7f5955522f1cb1c28e4c00921d1c594ce27db2d4cc511ae221',
    }),
    '/business-decision/provenance.json': Object.freeze({
        source: '/business-decision/provenance.json',
        fileName: 'provenance.json',
        format: 'json',
        title: 'Human judgment capture provenance',
        description:
            'Source, decision states, and content hashes for the public mobile human-judgment captures.',
        sha256: 'e29a26ee2992c461e9ce1202f29267af1715a022da155a48fc4e3a87893d5674',
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
    '/reference/openemr-patient-registration-standard-synthetic-v1/manifest.json': Object.freeze({
        source: '/reference/openemr-patient-registration-standard-synthetic-v1/manifest.json',
        fileName: 'manifest.json',
        format: 'json',
        title: 'OpenEMR Standard qualification pack',
        description:
            'Application boundary, fresh-trial outcomes, independent REST and SQL verification, media provenance, and exact runtime source for the OpenEMR reference qualification.',
        sha256: 'fe6a3e778f169cbacd169a71161626f06ffa2a90f9a7cae2421f4061ec30a646',
    }),
    '/reference/openemr-patient-registration-standard-synthetic-v1/inventory.json': Object.freeze({
        source: '/reference/openemr-patient-registration-standard-synthetic-v1/inventory.json',
        fileName: 'inventory.json',
        format: 'json',
        title: 'OpenEMR qualification pack inventory',
        description:
            'Content hashes and byte counts for every retained file in the OpenEMR public qualification pack.',
        sha256: '4a3e4cdcec7dd775877663174af31ae5e905551b8b023feeefdf0c1ff3033a52',
    }),
    '/reference/openemr-patient-registration-standard-synthetic-v1/replay/openemr-replay.control-overlay.v2.json': Object.freeze({
        source: '/reference/openemr-patient-registration-standard-synthetic-v1/replay/openemr-replay.control-overlay.v2.json',
        fileName: 'openemr-replay.control-overlay.v2.json',
        format: 'json',
        title: 'OpenEMR exact runtime timeline',
        description:
            'Presentation-safe runtime states and exact media-frame target bindings retained during the qualified OpenEMR replay.',
        sha256: '57a71f6652786dddb77b03d985be78323e4922a77fa14eded7b16d475dce17dc',
    }),
    '/reference/openemr-patient-registration-standard-synthetic-v1/replay/openemr-replay.media-binding.json': Object.freeze({
        source: '/reference/openemr-patient-registration-standard-synthetic-v1/replay/openemr-replay.media-binding.json',
        fileName: 'openemr-replay.media-binding.json',
        format: 'json',
        title: 'OpenEMR decoded-frame binding',
        description:
            'Media digest, dimensions, frame count, and complete decoded presentation-time inventory for the qualified replay.',
        sha256: '15d476ad1616b8ba15a213742ea841ef36babbdec12b565b83b54a92db949273',
    }),
    '/reference/openemr-patient-registration-standard-synthetic-v1/replay/openemr-replay.contexts.json': Object.freeze({
        source: '/reference/openemr-patient-registration-standard-synthetic-v1/replay/openemr-replay.contexts.json',
        fileName: 'openemr-replay.contexts.json',
        format: 'json',
        title: 'OpenEMR presentation contexts',
        description:
            'Consumer-neutral, exact-event runtime, surface, verification-tier, model, network, and terminal effect facts for the qualified OpenEMR replay.',
        sha256: '98c884953c4858e5451c0f686612657a1b4a9dc0941f335b6cd18b010329c39a',
    }),
    '/reference/frappe-lending-loan-application-standard-synthetic-v1/manifest.json': Object.freeze({
        source: '/reference/frappe-lending-loan-application-standard-synthetic-v1/manifest.json',
        fileName: 'manifest.json',
        format: 'json',
        title: 'Frappe Lending Standard qualification pack',
        description:
            'Application boundary, six fresh VERIFIED outcomes, independent REST and SQL verification, five fault-case refusals, and exact media provenance.',
        sha256: '66d18daded5405e4e7b2ffd724f1c5615272518f606f4493f1dee46ccbefeca2',
    }),
    '/reference/frappe-lending-loan-application-standard-synthetic-v1/inventory.json': Object.freeze({
        source: '/reference/frappe-lending-loan-application-standard-synthetic-v1/inventory.json',
        fileName: 'inventory.json',
        format: 'json',
        title: 'Frappe Lending qualification pack inventory',
        description:
            'Content hashes and byte counts for every retained public pack file.',
        sha256: '574eacdb1ce567f02b216db6bf865b1d4f6917589061f8496b8bcf212fa12ae0',
    }),
    '/reference/frappe-lending-loan-application-standard-synthetic-v1/replay/frappe-replay.control-overlay.v2.json': Object.freeze({
        source: '/reference/frappe-lending-loan-application-standard-synthetic-v1/replay/frappe-replay.control-overlay.v2.json',
        fileName: 'frappe-replay.control-overlay.v2.json',
        format: 'json',
        title: 'Frappe Lending exact runtime timeline',
        description:
            'Presentation-safe runtime states and exact media-frame target bindings retained during the qualified replay.',
        sha256: 'a26da6c18fb4047856e84ca572243d67e932b267b4d6983b6325808695591bf0',
    }),
    '/reference/frappe-lending-loan-application-standard-synthetic-v1/replay/frappe-replay.media-binding.json': Object.freeze({
        source: '/reference/frappe-lending-loan-application-standard-synthetic-v1/replay/frappe-replay.media-binding.json',
        fileName: 'frappe-replay.media-binding.json',
        format: 'json',
        title: 'Frappe Lending decoded-frame binding',
        description:
            'Media digest, dimensions, frame count, and complete decoded presentation-time inventory for the qualified replay.',
        sha256: '4f3148f1ae014dba6ea6af51abaafb3a8438a95f7bd5dbc79415040cfbb5d71e',
    }),
    '/reference/frappe-lending-loan-application-standard-synthetic-v1/replay/frappe-replay.contexts.json': Object.freeze({
        source: '/reference/frappe-lending-loan-application-standard-synthetic-v1/replay/frappe-replay.contexts.json',
        fileName: 'frappe-replay.contexts.json',
        format: 'json',
        title: 'Frappe Lending presentation contexts',
        description:
            'Exact-event runtime, verification-tier, model, network, and terminal effect facts for the qualified replay.',
        sha256: 'c0f2e887d77db347aaaca83ad7f359f028ace83a340118ca9d7bc1ececf755e9',
    }),
    '/reference/frappe-lending-loan-application-standard-synthetic-v1/replay/frappe-replay.frame-pts-us.json': Object.freeze({
        source: '/reference/frappe-lending-loan-application-standard-synthetic-v1/replay/frappe-replay.frame-pts-us.json',
        fileName: 'frappe-replay.frame-pts-us.json',
        format: 'json',
        title: 'Frappe Lending frame timestamps',
        description:
            'Complete decoded presentation timestamps for the exact VERIFIED replay media.',
        sha256: '6c41b1f2fcbad3cb7986334fb559b1a969cf68e678dd5437e77c2e91bd65edb1',
    }),
    '/reference/openimis-eligibility-standard-synthetic-v1/manifest.json': Object.freeze({
        source: '/reference/openimis-eligibility-standard-synthetic-v1/manifest.json',
        fileName: 'manifest.json',
        format: 'json',
        title: 'openIMIS eligibility qualification pack',
        description:
            'Application boundary, six fresh trial outcomes, independent SQL verification, exact replay and halt evidence, and source provenance.',
        sha256: '1a9e6b11dfbb1c99572f3d2e2f564d9dd4780e7b85a9c5868c9c4dac08827d1c',
    }),
    '/reference/openimis-eligibility-standard-synthetic-v1/inventory.json': Object.freeze({
        source: '/reference/openimis-eligibility-standard-synthetic-v1/inventory.json',
        fileName: 'inventory.json',
        format: 'json',
        title: 'openIMIS qualification pack inventory',
        description: 'Content hashes and byte counts for every retained public pack file.',
        sha256: '1fe5b9e75cb423dab6e8fe159d27bd50a81789b399cd0e264de7998bb3772266',
    }),
    '/reference/openimis-eligibility-standard-synthetic-v1/verified-replay/eligible-replay.control-overlay.v2.json': Object.freeze({
        source: '/reference/openimis-eligibility-standard-synthetic-v1/verified-replay/eligible-replay.control-overlay.v2.json',
        fileName: 'eligible-replay.control-overlay.v2.json',
        format: 'json',
        title: 'openIMIS VERIFIED runtime timeline',
        description: 'Exact runtime states and decoded-frame target bindings for the eligible-policy replay.',
        sha256: 'a99f52eb693d3d6096435596757aa6d9599babfc65d83b2293481879024df70d',
    }),
    '/reference/openimis-eligibility-standard-synthetic-v1/verified-replay/eligible-replay.media-binding.json': Object.freeze({
        source: '/reference/openimis-eligibility-standard-synthetic-v1/verified-replay/eligible-replay.media-binding.json',
        fileName: 'eligible-replay.media-binding.json',
        format: 'json',
        title: 'openIMIS VERIFIED decoded-frame binding',
        description: 'Media digest, dimensions, frame count, duration, and decoded presentation-time inventory.',
        sha256: '275d5e6ac10e5c3c516785a65a2cf52112b6150bb8003c8796b28be4f9997a4a',
    }),
    '/reference/openimis-eligibility-standard-synthetic-v1/verified-replay/eligible-replay.contexts.json': Object.freeze({
        source: '/reference/openimis-eligibility-standard-synthetic-v1/verified-replay/eligible-replay.contexts.json',
        fileName: 'eligible-replay.contexts.json',
        format: 'json',
        title: 'openIMIS VERIFIED presentation contexts',
        description: 'Exact-event runtime, effect, model, network, and terminal VERIFIED facts.',
        sha256: '0f90ad4e06f1bf24ccb9ca4473562914cd99fe411affa7f8fb0feffa9304618f',
    }),
    '/reference/openimis-eligibility-standard-synthetic-v1/verified-replay/eligible-replay.frame-pts-us.json': Object.freeze({
        source: '/reference/openimis-eligibility-standard-synthetic-v1/verified-replay/eligible-replay.frame-pts-us.json',
        fileName: 'eligible-replay.frame-pts-us.json',
        format: 'json',
        title: 'openIMIS VERIFIED frame timestamps',
        description: 'Complete decoded presentation timestamps for the exact VERIFIED replay media.',
        sha256: '2e8d32c3a84ff34b6728e0807386ae1f6e8ac8c32e7f2f65241eb2f580c62dc7',
    }),
    '/reference/openimis-eligibility-standard-synthetic-v1/fail-safe-halt/expired-halt.control-overlay.v2.json': Object.freeze({
        source: '/reference/openimis-eligibility-standard-synthetic-v1/fail-safe-halt/expired-halt.control-overlay.v2.json',
        fileName: 'expired-halt.control-overlay.v2.json',
        format: 'json',
        title: 'openIMIS HALTED runtime timeline',
        description: 'Exact runtime states and decoded-frame target bindings for the SQL-refuted policy check.',
        sha256: '7badf37d8da3efbaeddee12d6f5e549809289031c5baffa57321959309d7f62a',
    }),
    '/reference/openimis-eligibility-standard-synthetic-v1/fail-safe-halt/expired-halt.media-binding.json': Object.freeze({
        source: '/reference/openimis-eligibility-standard-synthetic-v1/fail-safe-halt/expired-halt.media-binding.json',
        fileName: 'expired-halt.media-binding.json',
        format: 'json',
        title: 'openIMIS HALTED decoded-frame binding',
        description: 'Media digest, dimensions, frame count, duration, and decoded presentation-time inventory.',
        sha256: '63a57ac0b15785ca5e6569f1b5243241934df60af92613998368a23c4d315a9c',
    }),
    '/reference/openimis-eligibility-standard-synthetic-v1/fail-safe-halt/expired-halt.contexts.json': Object.freeze({
        source: '/reference/openimis-eligibility-standard-synthetic-v1/fail-safe-halt/expired-halt.contexts.json',
        fileName: 'expired-halt.contexts.json',
        format: 'json',
        title: 'openIMIS HALTED presentation contexts',
        description: 'Exact-event runtime, refuted-effect, model, network, and terminal HALTED facts.',
        sha256: 'd0615c48ce87db0e910c4c51b3661d67502abe34ccc4eef6201975b3a07cd222',
    }),
    '/reference/openimis-eligibility-standard-synthetic-v1/fail-safe-halt/expired-halt.frame-pts-us.json': Object.freeze({
        source: '/reference/openimis-eligibility-standard-synthetic-v1/fail-safe-halt/expired-halt.frame-pts-us.json',
        fileName: 'expired-halt.frame-pts-us.json',
        format: 'json',
        title: 'openIMIS HALTED frame timestamps',
        description: 'Complete decoded presentation timestamps for the exact fail-safe halt media.',
        sha256: 'b49e1b31d0f11cbba208267116e040ccf2a0836f05e5b1ea971334bdb78fe257',
    }),
    '/product-preview/MANIFEST.json': Object.freeze({
        source: '/product-preview/MANIFEST.json',
        fileName: 'MANIFEST.json',
        format: 'json',
        title: 'Product preview media manifest',
        description:
            'Content hashes and capture provenance for the public product preview.',
        sha256: '4c9f90f03ee30c57d5878431d8489f317a7e02610edbfce0e3649014d7a475de',
    }),
    '/cloud-preview/provenance.json': Object.freeze({
        source: '/cloud-preview/provenance.json',
        fileName: 'provenance.json',
        format: 'json',
        title: 'Cloud preview provenance',
        description:
            'Capture provenance and public-data boundary for the Cloud dashboard preview.',
        sha256: 'b3c5a4d5f15a5586a41a96e95deb1065ad5bc21bd49d7d74356cba51375f038d',
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
