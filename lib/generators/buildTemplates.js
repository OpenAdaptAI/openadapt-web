/**
 * Build-time generator for the workflow template gallery.
 *
 * Reads the structured evidence files in data/templates/*.json and merges
 * them with the copy registry in data/templates.js by slug:
 *
 * - registry slug + JSON entry -> registry copy enriched with structured
 *   runStats, media, provenance, and FAQ data
 * - JSON-only entry with "route": true  -> a standalone template rendered
 *   from the JSON file itself
 * - JSON-only entry with "route": false -> an honest "evidence in progress"
 *   card in the gallery grid; no detail route, no performance claims
 *
 * Every published number must come from the cited source. The validator
 * below enforces shape (counts, zero-model calls, bounded durations, HTTPS
 * provenance) and fails loudly at build time rather than rendering a card
 * that implies unmeasured evidence.
 */

const fs = require('node:fs')
const path = require('node:path')

const SURFACES = ['browser', 'native', 'remote']
const PROOF_LEVELS = ['reference', 'field', 'pattern']
const DATA_STATUSES = ['published', 'pending-evidence']

function assertHttpsUrl(url, label) {
    if (typeof url !== 'string' || !/^https:\/\/\S+$/.test(url)) {
        throw new Error(`${label}: provenance/source URLs must be https (${url})`)
    }
}

function validateEntry(entry, file) {
    const fail = (message) => {
        throw new Error(`data/templates/${file}: ${message}`)
    }

    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(entry.slug)) fail('slug must be kebab-case')
    if (!DATA_STATUSES.includes(entry.dataStatus)) fail('dataStatus must be published or pending-evidence')
    if (!SURFACES.includes(entry.surface)) fail(`surface must be one of ${SURFACES.join(', ')}`)
    if (!PROOF_LEVELS.includes(entry.proof)) fail(`proof must be one of ${PROOF_LEVELS.join(', ')}`)
    if (typeof entry.order !== 'number') fail('order must be a number')
    if (!entry.name) fail('name is required')

    const hasRoute = entry.route === true || entry.route === false
    if (!hasRoute) fail('route must be true or false')

    if (entry.route === false && entry.dataStatus !== 'pending-evidence') {
        fail('non-routed cards must be dataStatus "pending-evidence"')
    }
    if (entry.dataStatus === 'pending-evidence') {
        if (entry.runStats) fail('pending-evidence cards must not carry runStats')
        if (!entry.evidenceNote) fail('pending-evidence cards must explain what evidence is missing')
        if (entry.route !== false) fail('pending-evidence cards must not be routed pages')
    }

    if (entry.dataStatus === 'published') {
        if (!entry.summary && !entry.demonstrates) fail('published entries need summary or demonstrates')
        if (!Array.isArray(entry.provenance) || entry.provenance.length === 0) {
            fail('published entries need at least one provenance link')
        }
        entry.provenance.forEach((p) => {
            if (!p.label) fail('provenance needs a label')
            assertHttpsUrl(p.url, entry.slug)
        })
    }

    if ((entry.install && !entry.install.command) || (entry.install && !entry.install.note)) {
        fail('install requires command and note')
    }
    if (entry.tryItCommand && typeof entry.tryItCommand !== 'string') {
        fail('tryItCommand must be a string')
    }

    ;(entry.media || []).forEach((m) => {
        if (!m.label) fail('media needs a label')
        assertHttpsUrl(m.url, entry.slug)
    })

    ;(entry.faq || []).forEach((item) => {
        if (!item.question || !item.answer) fail('faq items need question and answer')
        ;(item.sources || []).forEach((s) => {
            if (!s.label) fail('faq sources need a label')
            assertHttpsUrl(s.url, entry.slug)
        })
    })

    if (entry.runStats) validateRunStats(entry.runStats, file)

    return entry
}

function validateRunStats(stats, file) {
    const fail = (message) => {
        throw new Error(`data/templates/${file}: runStats ${message}`)
    }

    const isCount = (n) => Number.isInteger(n) && n >= 0
    if (!stats.sourceLabel) fail('needs sourceLabel naming where the numbers were published')
    if (!isCount(stats.trials) || stats.trials < 1) fail('trials must be a positive integer')

    for (const key of [
        'verifiedRuns',
        'expectedHalts',
        'silentIncorrectSuccesses',
        'wrongTargetActions',
        'overHalts',
    ]) {
        if (stats[key] !== undefined && !isCount(stats[key])) fail(`${key} must be a non-negative integer`)
    }

    if (
        stats.verifiedRuns !== undefined &&
        stats.expectedHalts !== undefined &&
        stats.verifiedRuns + stats.expectedHalts > stats.trials
    ) {
        fail('verifiedRuns + expectedHalts cannot exceed trials')
    }

    if (stats.modelCallsPerRun !== undefined && stats.modelCallsPerRun !== 0 && stats.modelCallsPerRun !== null) {
        fail('modelCallsPerRun must be 0 or null; healthy runs make no model calls')
    }
    if (stats.silentIncorrectSuccesses > 0) {
        fail('silent incorrect successes above zero are never publishable marketing data')
    }

    const durations = ['medianVerifiedRunDurationMs', 'medianRunDurationSeconds', 'meanRunDurationSeconds']
    const hasDuration = durations.some((key) => typeof stats[key] === 'number' && stats[key] > 0)
    if (hasDuration && !stats.durationBasis) {
        fail('any quoted duration needs durationBasis explaining how it was computed/published')
    }

    if (!stats.measuredOn) fail('needs measuredOn naming the build/date the numbers come from')
}

function loadTemplateEntries(dataDir) {
    return fs
        .readdirSync(dataDir)
        .filter((file) => file.endsWith('.json'))
        .sort()
        .map((file) => {
            const raw = fs.readFileSync(path.join(dataDir, file), 'utf8')
            let parsed
            try {
                parsed = JSON.parse(raw)
            } catch (error) {
                throw new Error(`data/templates/${file}: invalid JSON (${error.message})`)
            }
            return validateEntry(parsed, file)
        })
        .sort((a, b) => a.order - b.order)
}

function toQuickstart(entry) {
    if (entry.quickstart) return entry.quickstart
    if (!entry.install || !entry.tryItCommand) return undefined
    return [
        { cmd: entry.install.command, what: entry.install.note },
        {
            cmd: entry.tryItCommand,
            what: 'Demonstrate or reuse the recording, compile it into a deterministic bundle, then replay locally.',
        },
    ]
}

function stripUndefined(value) {
    if (Array.isArray(value)) return value.map(stripUndefined)
    if (value && typeof value === 'object') {
        const clean = {}
        for (const [key, inner] of Object.entries(value)) {
            if (inner !== undefined) clean[key] = stripUndefined(inner)
        }
        return clean
    }
    return value
}

/**
 * Merge the copy registry (data/templates.js) with the structured JSON
 * evidence entries. Returns everything the two template pages need:
 *
 * - routableTemplates: full objects for /templates/[slug] (registry ∪ routed JSON)
 * - galleryEntries: ordered cards for the index grid, including the honest
 *   pending-evidence cards
 *
 * Every returned object is free of `undefined` values so getStaticProps can
 * serialize it directly.
 */
function buildTemplateGallery(registryTemplates, entries) {
    const registryBySlug = new Map(registryTemplates.map((t) => [t.slug, t]))
    const seenSlugs = new Set()

    const routableTemplates = []
    const galleryEntries = []

    for (const entry of entries) {
        if (seenSlugs.has(entry.slug)) {
            throw new Error(`duplicate slug across data/templates/*.json: ${entry.slug}`)
        }
        seenSlugs.add(entry.slug)

        const registry = registryBySlug.get(entry.slug)

        if (entry.route === false) {
            galleryEntries.push({
                slug: entry.slug,
                name: entry.name,
                application: entry.application,
                surface: entry.surface,
                vertical: entry.vertical,
                proof: entry.proof,
                dataStatus: entry.dataStatus,
                summary: entry.summary,
                evidenceNote: entry.evidenceNote,
                provenance: entry.provenance,
                runStats: null,
                href: null,
            })
            continue
        }

        if (registry) {
            const enriched = {
                ...registry,
                application: entry.application,
                surface: entry.surface,
                demonstrates: entry.demonstrates || registry.summary,
                install: entry.install,
                tryItCommand: entry.tryItCommand,
                runStats: entry.runStats || null,
                media: entry.media || [],
                provenance: entry.provenance || [],
                faq: entry.faq || [],
                dataStatus: entry.dataStatus,
            }
            routableTemplates.push(enriched)
            galleryEntries.push(toGalleryCard(enriched))
        } else {
            const standalone = {
                slug: entry.slug,
                title: entry.title || entry.name,
                metaDescription: entry.metaDescription,
                proof: entry.proof,
                vertical: entry.vertical,
                application: entry.application,
                surface: entry.surface,
                summary: entry.summary,
                runsOn: entry.runsOn,
                steps: entry.steps,
                parameters: entry.parameters || [],
                verification: entry.verification,
                verificationOracles: entry.verificationOracles || [],
                quickstart: toQuickstart(entry),
                source: (entry.provenance && entry.provenance[0] && entry.provenance[0].url) || undefined,
                anchors: entry.anchors || [],
                demonstrates: entry.demonstrates,
                install: entry.install,
                tryItCommand: entry.tryItCommand,
                runStats: entry.runStats || null,
                media: entry.media || [],
                provenance: entry.provenance || [],
                faq: entry.faq || [],
                dataStatus: entry.dataStatus,
            }
            if (!standalone.title || !standalone.metaDescription || !standalone.steps || !standalone.verification) {
                throw new Error(
                    `data/templates/${entry.slug}.json: routed JSON-only entries need title, metaDescription, steps, verification`
                )
            }
            if (!standalone.quickstart) {
                throw new Error(`data/templates/${entry.slug}.json: routed entries need install + tryItCommand or quickstart`)
            }
            routableTemplates.push(standalone)
            galleryEntries.push(toGalleryCard(standalone))
        }
    }

    // Registry patterns without a JSON evidence file still appear in the grid.
    for (const t of registryTemplates) {
        if (seenSlugs.has(t.slug)) continue
        galleryEntries.push({
            slug: t.slug,
            name: t.title,
            application: null,
            surface: null,
            vertical: t.vertical,
            proof: t.proof,
            dataStatus: 'pattern-shape',
            summary: t.summary,
            evidenceNote: null,
            provenance: [],
            runStats: null,
            href: `/templates/${t.slug}`,
        })
    }

    galleryEntries.sort((a, b) => {
        const orderA = (entries.find((e) => e.slug === a.slug) || {}).order || Number.MAX_SAFE_INTEGER
        const orderB = (entries.find((e) => e.slug === b.slug) || {}).order || Number.MAX_SAFE_INTEGER
        return orderA - orderB
    })

    return stripUndefined({ routableTemplates, galleryEntries })
}

function toGalleryCard(t) {
    return {
        slug: t.slug,
        name: t.title || t.name,
        application: t.application,
        surface: t.surface,
        vertical: t.vertical,
        proof: t.proof,
        dataStatus: t.dataStatus,
        summary: t.summary,
        evidenceNote: null,
        provenance: t.provenance || [],
        runStats: t.runStats || null,
        href: `/templates/${t.slug}`,
    }
}

module.exports = {
    SURFACES,
    PROOF_LEVELS,
    DATA_STATUSES,
    loadTemplateEntries,
    buildTemplateGallery,
    validateEntry,
}
