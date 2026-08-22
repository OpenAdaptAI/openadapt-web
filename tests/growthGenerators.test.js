const assert = require('node:assert/strict')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const test = require('node:test')

const { loadTemplateEntries, buildTemplateGallery, validateEntry } = require('../lib/generators/buildTemplates')
const {
    REQUIRED_DIMENSIONS,
    loadComparisons,
    findComparison,
    validateComparison,
} = require('../lib/generators/buildComparisons')
const { templates } = require('../data/templates')

const root = path.join(__dirname, '..')

// ---------------------------------------------------------------------------
// Structured template evidence entries (data/templates/*.json)
// ---------------------------------------------------------------------------

const entries = loadTemplateEntries(path.join(root, 'data', 'templates'))
const bySlug = new Map(entries.map((e) => [e.slug, e]))

test('ten structured template entries load with unique slugs and valid statuses', () => {
    assert.equal(entries.length, 10, 'gallery ships exactly ten structured entries')
    const slugs = entries.map((e) => e.slug)
    assert.equal(new Set(slugs).size, slugs.length, 'slugs are unique')

    const published = entries.filter((e) => e.dataStatus === 'published')
    const pending = entries.filter((e) => e.dataStatus === 'pending-evidence')
    assert.ok(published.length >= 6, 'at least six entries carry published evidence')
    assert.ok(pending.length >= 1, 'pending-evidence stubs are explicit')
    for (const entry of pending) {
        assert.equal(entry.route, false, `${entry.slug}: stubs are not routed`)
        assert.match(
            entry.evidenceNote,
            /[Ee]vidence in progress/,
            `${entry.slug}: stub states its evidence status`
        )
        assert.ok(!entry.runStats, `${entry.slug}: stubs carry no run stats`)
    }
})

test('published run stats stay inside the measured envelope', () => {
    for (const entry of entries.filter((e) => e.runStats)) {
        const s = entry.runStats
        assert.ok(s.trials >= 1, `${entry.slug}: trials counted`)
        assert.ok(
            s.modelCallsPerRun === 0 || s.modelCallsPerRun === null,
            `${entry.slug}: healthy runs make no model calls`
        )
        assert.equal(s.silentIncorrectSuccesses, 0, `${entry.slug}: silent incorrect successes are zero`)
        if (s.expectedHalts !== undefined) {
            assert.ok(
                s.verifiedRuns + s.expectedHalts <= s.trials,
                `${entry.slug}: outcomes fit inside trials`
            )
        }
        assert.ok(s.measuredOn, `${entry.slug}: names build/date of measurement`)
        assert.ok(s.sourceLabel, `${entry.slug}: names where numbers were published`)
    }
})

test('numbers match the immutable mockmed-triage-v3 pack exactly', () => {
    const triage = bySlug.get('patient-triage-note').runStats
    // Computed from artifacts/cases/*/trial-*/outcome.json at pack commit
    // 7cc518ee0b83dd571c0902423134a5525635e6b2: 3 representative VERIFIED +
    // 15 fault trials HALTED as expected; verified durations 4820.51,
    // 4706.64, 4697.14 ms -> median 4706.64 ms.
    assert.equal(triage.trials, 18)
    assert.equal(triage.verifiedRuns, 3)
    assert.equal(triage.expectedHalts, 15)
    assert.equal(triage.silentIncorrectSuccesses, 0)
    assert.equal(triage.wrongTargetActions, 0)
    assert.equal(triage.modelCallsPerRun, 0)
    assert.equal(triage.medianVerifiedRunDurationMs, 4706.64)
    assert.match(triage.measuredOn, /1\.23\.0/)
})

test('live-demo campaign numbers are quoted as published', () => {
    const openemr = bySlug.get('openemr-create-patient-record').runStats
    assert.equal(openemr.trials, 3)
    assert.equal(openemr.verifiedRuns, 3)
    assert.equal(openemr.silentIncorrectSuccesses, 0)
    assert.equal(openemr.modelCallsPerRun, 0)
    assert.equal(openemr.medianRunDurationSeconds, 59.8)

    const eligibility = bySlug.get('openimis-eligibility-enquiry').runStats
    assert.equal(eligibility.trials, 6)
    assert.equal(eligibility.verifiedRuns, 3)
    assert.equal(eligibility.expectedHalts, 3)
    assert.equal(eligibility.overHalts, 0)
    assert.equal(eligibility.meanRunDurationSeconds, 19.7)
})

test('every published entry cites https provenance', () => {
    for (const entry of entries.filter((e) => e.dataStatus === 'published')) {
        assert.ok(entry.provenance.length >= 1, `${entry.slug}: has provenance`)
        for (const p of entry.provenance) {
            assert.match(p.url, /^https:\/\//, `${entry.slug}: ${p.label} is https`)
        }
    }
})

// ---------------------------------------------------------------------------
// Gallery merge behavior
// ---------------------------------------------------------------------------

const { routableTemplates, galleryEntries } = (() => {
    const result = buildTemplateGallery(templates, entries)
    return result
})()

test('registry entries are enriched with structured evidence by slug', () => {
    const patientTriage = routableTemplates.find((t) => t.slug === 'patient-triage-note')
    assert.ok(patientTriage, 'registry entry survives the merge')
    assert.equal(patientTriage.runStats.trials, 18, 'run stats attached')
    assert.ok(patientTriage.quickstart.length >= 3, 'registry quickstart preserved')
    assert.ok(patientTriage.summary.length > 80, 'registry copy preserved')
    assert.ok(patientTriage.faq.length >= 1, 'faq attached')
})

test('JSON-only routed entries become complete template pages', () => {
    for (const slug of [
        'openemr-create-patient-record',
        'openimis-eligibility-enquiry',
        'batch-worklist-loop',
    ]) {
        const t = routableTemplates.find((x) => x.slug === slug)
        assert.ok(t, `${slug}: routed`)
        assert.ok(t.metaDescription && t.metaDescription.length > 60, `${slug}: meta description`)
        assert.ok(t.steps.length >= 3, `${slug}: real steps`)
        assert.ok(t.quickstart.length >= 2, `${slug}: quickstart synthesized`)
        assert.equal(
            t.quickstart[0].cmd,
            "pip install 'openadapt[browser]'",
            `${slug}: quickstart starts from the flagship package`
        )
    }
    // Registry pattern routes still exist even without a JSON file.
    for (const slug of ['dental-insurance-eligibility', 'report-export-verification']) {
        assert.ok(
            !routableTemplates.some((t) => t.slug === slug),
            `${slug}: stays registry-only in the merged set`
        )
    }
})

test('gallery grid contains every card exactly once with honest routing', () => {
    assert.equal(galleryEntries.length, templates.length + entries.length - 4,
        'grid = registry + JSON entries minus the four merged duplicates')
    const hrefs = galleryEntries.filter((g) => g.href).map((g) => g.href)
    assert.equal(new Set(hrefs).size, hrefs.length, 'no duplicate cards')
    for (const card of galleryEntries.filter((g) => !g.href)) {
        assert.equal(card.dataStatus, 'pending-evidence', `${card.slug}: unlinked means pending`)
    }
})

test('validator rejects fabricated or malformed evidence', () => {
    const base = bySlug.get('patient-triage-note')
    assert.throws(() => validateEntry({ ...base, runStats: { ...base.runStats, modelCallsPerRun: 2 } }, 'x'),
        /model calls/, 'nonzero model calls rejected')
    assert.throws(() => validateEntry({ ...base, runStats: { ...base.runStats, trials: 3, verifiedRuns: 5 } }, 'x'),
        /exceed/, 'overclaiming outcomes rejected')
    assert.throws(() => validateEntry({ ...base, provenance: [{ label: 'x', url: 'http://insecure' }] }, 'x'),
        /https/, 'insecure provenance rejected')
    assert.throws(
        () =>
            validateEntry(
                { ...base, dataStatus: 'pending-evidence', route: false, runStats: base.runStats },
                'x'
            ),
        /pending-evidence cards must not carry runStats/,
        'stubs cannot smuggle stats'
    )

    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'oa-templates-'))
    fs.writeFileSync(path.join(tmp, 'bad.json'), '{not json')
    assert.throws(() => loadTemplateEntries(tmp), /invalid JSON/)
    fs.rmSync(tmp, { recursive: true, force: true })
})

// ---------------------------------------------------------------------------
// Comparison dimension data (data/compare/*.json)
// ---------------------------------------------------------------------------

const comparisons = loadComparisons(path.join(root, 'data', 'compare'))

test('four comparison datasets cover the required dimensions with citations', () => {
    assert.deepEqual(
        comparisons.map((c) => c.slug).sort(),
        ['browser-agents', 'computer-use-agents', 'power-automate', 'uipath']
    )
    for (const comparison of comparisons) {
        const ids = comparison.dimensions.map((d) => d.id)
        assert.deepEqual([...ids].sort(), [...REQUIRED_DIMENSIONS].sort(), comparison.slug)
        for (const dimension of comparison.dimensions) {
            assert.ok(dimension.openadapt && dimension.them, `${comparison.slug}/${dimension.id}`)
            assert.ok(dimension.sources.length >= 1, `${comparison.slug}/${dimension.id}: cited`)
            for (const source of dimension.sources) {
                assert.match(source.url, /^https:\/\//, `${comparison.slug}: source https`)
            }
        }
        assert.ok(comparison.faq.length >= 1, `${comparison.slug}: faq present`)
    }
})

test('priced competitor claims always cite their published source', () => {
    for (const comparison of comparisons) {
        for (const strength of comparison.strengths || []) {
            if (/\$\d/.test(strength.text)) {
                assert.ok(strength.source, `${comparison.slug}: "$${strength.text}" needs a citation`)
                assert.match(strength.source.url, /^https:\/\//)
            }
        }
    }
    const powerAutomate = comparisons.find((c) => c.slug === 'power-automate')
    const costDimension = powerAutomate.dimensions.find((d) => d.id === 'cost-per-run')
    assert.match(costDimension.them, /\$15\.00 user\/month/)
    assert.match(costDimension.them, /\$215\.00 bot\/month/)
})

test('findComparison resolves by slug and validator fails closed', () => {
    assert.equal(findComparison(comparisons, 'uipath').competitor, 'UiPath')
    assert.equal(findComparison(comparisons, 'nonexistent'), null)

    const sample = comparisons[0]
    const missing = {
        ...sample,
        slug: 'broken',
        dimensions: sample.dimensions.slice(0, 2),
    }
    assert.throws(() => validateComparison(missing, 'broken.json'), /missing dimension/)
    assert.throws(() => validateComparison({ ...sample, slug: 'mismatch' }, 'other.json'), /file name/)
})
