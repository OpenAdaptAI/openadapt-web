/**
 * Build-time loader for the structured capability-dimension data behind
 * /compare/<slug>.
 *
 * Each file in data/compare/<slug>.json carries per-dimension facts about
 * OpenAdapt and one alternative, where every factual claim names its public
 * source URL. The renderer (pages/compare/[slug].js) shows each dimension
 * row with its citations; nothing here replaces the honesty rules enforced
 * by tests/comparisonPages.test.js on data/comparisons.js - it structures
 * and cites them.
 *
 * Validation fails the build loudly when a dimension is missing, a claim
 * has no source, or a priced claim lacks a citation.
 */

const fs = require('node:fs')
const path = require('node:path')

const REQUIRED_DIMENSIONS = [
    'determinism-on-drift',
    'cost-per-run',
    'verification-of-effects',
    'halting-behavior',
    'data-locality',
    'scope',
]

function assertHttpsUrl(url, label) {
    if (typeof url !== 'string' || !/^https:\/\/\S+$/.test(url)) {
        throw new Error(`${label}: source URLs must be https (${url})`)
    }
}

function validateSources(sources, label) {
    if (!Array.isArray(sources) || sources.length === 0) {
        throw new Error(`${label}: at least one source is required`)
    }
    sources.forEach((s) => {
        if (!s.label) throw new Error(`${label}: every source needs a label`)
        assertHttpsUrl(s.url, label)
    })
}

function validateComparison(data, file) {
    const fail = (message) => {
        throw new Error(`data/compare/${file}: ${message}`)
    }

    if (!data.slug || data.slug !== file.replace(/\.json$/, '')) {
        fail('slug must match the file name')
    }
    if (!data.competitor || !data.positioningSummary) {
        fail('competitor and positioningSummary are required')
    }
    if (!Array.isArray(data.dimensions)) fail('dimensions array is required')

    const ids = data.dimensions.map((d) => d.id)
    for (const required of REQUIRED_DIMENSIONS) {
        if (!ids.includes(required)) fail(`missing dimension: ${required}`)
    }
    if (new Set(ids).size !== ids.length) fail('duplicate dimension ids')
    if (ids.some((id) => !REQUIRED_DIMENSIONS.includes(id))) {
        fail(`unknown dimension ids; allowed: ${REQUIRED_DIMENSIONS.join(', ')}`)
    }

    for (const dimension of data.dimensions) {
        const label = `${data.slug}/${dimension.id}`
        if (!dimension.openadapt || !dimension.them) {
            fail(`${label}: both openadapt and them text are required`)
        }
        try {
            validateSources(dimension.sources, label)
        } catch (error) {
            fail(error.message)
        }
    }

    ;(data.strengths || []).forEach((strength, i) => {
        const label = `${data.slug}/strengths[${i}]`
        if (!strength.text) fail(`${label}: text is required`)
        // Priced claims must cite their published pricing source.
        if (/\$\d/.test(strength.text)) {
            try {
                validateSources([strength.source], label)
            } catch (error) {
                fail(`${label}: dollar figures require a cited source (${error.message})`)
            }
        } else if (strength.source) {
            try {
                validateSources([strength.source], label)
            } catch (error) {
                fail(error.message)
            }
        }
    })

    ;(data.faq || []).forEach((item, i) => {
        const label = `${data.slug}/faq[${i}]`
        if (!item.question || !item.answer) fail(`${label}: question and answer are required`)
        try {
            validateSources(item.sources || [], label)
        } catch (error) {
            fail(error.message)
        }
    })

    return data
}

function loadComparisons(dataDir) {
    return fs
        .readdirSync(dataDir)
        .filter((file) => file.endsWith('.json'))
        .sort()
        .map((file) => {
            let parsed
            try {
                parsed = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf8'))
            } catch (error) {
                throw new Error(`data/compare/${file}: invalid JSON (${error.message})`)
            }
            return validateComparison(parsed, file)
        })
}

function findComparison(comparisons, slug) {
    return comparisons.find((c) => c.slug === slug) || null
}

module.exports = {
    REQUIRED_DIMENSIONS,
    loadComparisons,
    findComparison,
    validateComparison,
}
