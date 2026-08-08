#!/usr/bin/env node
/**
 * Fail loudly when openadapt.ai states a version that is no longer true, or
 * publishes a measured number without saying which engine produced it.
 *
 * Two things went wrong at once and neither was detectable:
 *
 *   1. Every headline benchmark figure on this site was measured on 2026-07-08
 *      from an openadapt-flow source build declaring 0.1.0 -- before v0.2.0,
 *      the first release tag containing the pinned commit. None of the pages
 *      rendering those numbers said so. By 2026-07-27 the published engine was
 *      1.24.0, twenty-two minor releases later, and nothing could notice.
 *   2. public/status.json advertised flow 1.23.0 / launcher 1.7.3 /
 *      capture 1.1.1 / desktop 0.13.0 after all four had shipped newer
 *      releases -- and tests/statusManifest.test.js pinned those stale values,
 *      so the test suite actively enforced the wrong answer.
 *
 * data/published-version-claims.json is the machine-readable record of which
 * versions on this site must track the current release and which are frozen
 * historical measurements. This script enforces it. It deliberately reuses the
 * design of openadapt-ops/scripts/check_published_version_claims.py and
 * openadapt-evals/scripts/check_published_evidence_freshness.py rather than
 * inventing a third contract.
 *
 * Offline checks (every pull request; no network, cannot be flaky):
 *
 *   1. Every `pypi-latest` claim agrees with its source of truth in the repo
 *      (public/status.json), so the registry and the served file cannot drift
 *      apart.
 *   2. The `historical` claim for the headline benchmark agrees with
 *      data/benchmark.json's provenance block, which must carry both
 *      `flow_version` and `measured_on`.
 *   3. Every file registered under `attribution_required` still contains its
 *      exact recorded context. Dropping the measured-on label from a surface
 *      that renders a benchmark figure therefore cannot land silently.
 *   4. No acknowledged release lag is past its `review_by` date. An
 *      acknowledgement that can be renewed by silence is not an
 *      acknowledgement.
 *
 * Network checks (daily; PyPI is the authority):
 *
 *   5. Every `pypi-latest` version equals PyPI's newest non-yanked release.
 *   6. No `historical` claim has drifted further from the current release than
 *      its acknowledged lag allows. This is the drift alarm: the numbers are
 *      correctly frozen, but the gap between them and the shipping engine is
 *      not allowed to grow unattended.
 *
 * An unreachable PyPI warns rather than fails: an index outage is not evidence
 * of drift, and a guard that goes red for unrelated reasons stops being read.
 * Actual drift always exits non-zero.
 *
 * Node standard library only: no dependency install, no lockfile, no cache.
 *
 * Usage:
 *   node scripts/check_published_version_claims.mjs [--offline]
 *       [--current-version <package>=<version> ...] [--today YYYY-MM-DD]
 */

import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const REGISTRY_PATH = path.join(ROOT, 'data', 'published-version-claims.json')
const STATUS_PATH = process.env.OPENADAPT_STATUS_PATH
    ? path.resolve(process.env.OPENADAPT_STATUS_PATH)
    : path.join(ROOT, 'public', 'status.json')
const PYPI_BASE = process.env.OPENADAPT_PYPI_BASE ?? 'https://pypi.org/pypi'
const PYPI_URL = (pkg) => `${PYPI_BASE}/${pkg}/json`
const GITHUB_API_BASE =
    process.env.OPENADAPT_GITHUB_API_BASE ?? 'https://api.github.com'
const HTTP_TIMEOUT_MS = 20000

const errors = []
const warnings = []
const notes = []

const readJson = (relative) => {
    const source =
        relative === 'public/status.json'
            ? STATUS_PATH
            : path.join(ROOT, relative)
    return JSON.parse(fs.readFileSync(source, 'utf8'))
}

function readSourceOfTruth(source) {
    const [file, pointer] = String(source).split('#')
    const document = readJson(file)
    const value = pointer
        .split('/')
        .filter(Boolean)
        .reduce((node, key) => (node == null ? node : node[key]), document)
    return { file, pointer, value }
}

function releaseRecordsForClaim(claim) {
    if (!claim.release_source_of_truth) return {}
    return readSourceOfTruth(claim.release_source_of_truth).value ?? {}
}

function parseArgs(argv) {
    const args = { offline: false, versions: {}, releases: {}, today: null }
    for (let i = 0; i < argv.length; i += 1) {
        const arg = argv[i]
        if (arg === '--offline') args.offline = true
        else if (arg === '--today') args.today = argv[(i += 1)]
        else if (arg === '--current-version') {
            const [pkg, version] = String(argv[(i += 1)]).split('=')
            args.versions[pkg] = version
        } else if (arg === '--releases') {
            const [pkg, list] = String(argv[(i += 1)]).split('=')
            args.releases[pkg] = list.split(',').filter(Boolean)
        } else {
            throw new Error(`unknown argument: ${arg}`)
        }
    }
    return args
}

/** Numeric release segment, or null when the version is not comparable. */
function releaseTuple(version) {
    const parts = String(version).split('.')
    if (!parts.length || !parts.every((part) => /^\d+$/.test(part))) return null
    return parts.map(Number)
}

const compareVersions = (a, b) => {
    const left = releaseTuple(a) ?? []
    const right = releaseTuple(b) ?? []
    for (let i = 0; i < Math.max(left.length, right.length); i += 1) {
        const diff = (left[i] ?? 0) - (right[i] ?? 0)
        if (diff !== 0) return diff
    }
    return 0
}

/**
 * How many live published releases exist that are newer than `version`.
 *
 * Counting actual releases rather than doing semver arithmetic keeps the
 * number unambiguous across a major bump, and yanked releases are excluded
 * because nobody can install them.
 */
function releasesBehind(version, publishedVersions) {
    if (!publishedVersions) return null
    return publishedVersions.filter(
        (other) => compareVersions(other, version) > 0
    ).length
}

// ---------------------------------------------------------------------------
// Offline checks
// ---------------------------------------------------------------------------

function checkPypiLatestSourceOfTruth(claim) {
    const { file, value: container } = readSourceOfTruth(claim.source_of_truth)
    if (container == null) {
        errors.push(
            `${claim.id}: source of truth ${claim.source_of_truth} does not exist`
        )
        return
    }
    for (const [field, version] of Object.entries(claim.versions)) {
        if (container[field] !== version) {
            errors.push(
                `${claim.id}: registry records ${field} ${version} but ` +
                    `${claim.source_of_truth} says ${container[field]}. The ` +
                    `registry and the served file must not drift apart.`
            )
        }
    }

    const releaseRecords = releaseRecordsForClaim(claim)
    if (!Object.keys(releaseRecords).length) {
        errors.push(
            `${claim.id}: ${claim.release_source_of_truth} declares no releases`
        )
    }
    for (const [field, record] of Object.entries(releaseRecords)) {
        checkReleaseRecordStructure(claim, field, record)
    }
}

function checkReleaseRecordStructure(claim, field, record) {
    if (record.package !== claim.packages[field]) {
        errors.push(
            `${claim.id}: ${field} release package ${record.package} does not ` +
                `match ${claim.packages[field]}`
        )
    }
    if (record.version !== claim.versions[field]) {
        errors.push(
            `${claim.id}: ${field} release version ${record.version} does not ` +
                `match ${claim.versions[field]}`
        )
    }
    if (record.source !== 'pypi') {
        errors.push(`${claim.id}: ${field} release source must be pypi`)
    }
    if (record.tag !== `v${record.version}`) {
        errors.push(
            `${claim.id}: ${field} release tag ${record.tag} must be ` +
                `v${record.version}`
        )
    }
    if (!/^[0-9a-f]{40}$/.test(record.release_commit ?? '')) {
        errors.push(`${claim.id}: ${field} release_commit must be an exact SHA`)
    }
    if (!/^[0-9a-f]{40}$/.test(record.qualified_source_commit ?? '')) {
        errors.push(
            `${claim.id}: ${field} qualified_source_commit must be an exact SHA`
        )
    }
    if (!/^[^/]+\/[^/]+$/.test(record.github_repository ?? '')) {
        errors.push(
            `${claim.id}: ${field} github_repository must be owner/repository`
        )
    }
    if (!Array.isArray(record.artifacts) || record.artifacts.length === 0) {
        errors.push(`${claim.id}: ${field} release must list artifacts`)
        return
    }
    const filenames = new Set()
    for (const artifact of record.artifacts) {
        if (!artifact.type || !artifact.filename || !artifact.url) {
            errors.push(
                `${claim.id}: ${field} release artifact is missing its ` +
                    `type, filename, or URL`
            )
        }
        if (!/^[0-9a-f]{64}$/.test(artifact.sha256 ?? '')) {
            errors.push(
                `${claim.id}: ${field} artifact ${artifact.filename} must ` +
                    `carry an exact sha256 digest`
            )
        }
        if (filenames.has(artifact.filename)) {
            errors.push(
                `${claim.id}: ${field} repeats artifact ${artifact.filename}`
            )
        }
        filenames.add(artifact.filename)
    }
}

function checkHistoricalSourceOfTruth(claim) {
    if (claim.source_of_truth !== 'data/benchmark.json#/provenance') return
    const provenance = readJson('data/benchmark.json').provenance
    if (!provenance.flow_version || !provenance.measured_on) {
        errors.push(
            `${claim.id}: data/benchmark.json provenance must carry both ` +
                `flow_version and measured_on. A published figure with no ` +
                `engine build is a claim about no particular version.`
        )
        return
    }
    if (provenance.flow_version !== claim.version) {
        errors.push(
            `${claim.id}: registry records flow_version ${claim.version} but ` +
                `data/benchmark.json says ${provenance.flow_version}`
        )
    }
    if (provenance.measured_on !== claim.measured_on) {
        errors.push(
            `${claim.id}: registry records measured_on ${claim.measured_on} ` +
                `but data/benchmark.json says ${provenance.measured_on}`
        )
    }
}

function checkAttributionLocations(claim) {
    for (const location of claim.attribution_required ?? []) {
        const absolute = path.join(ROOT, location.file)
        if (!fs.existsSync(absolute)) {
            errors.push(
                `${claim.id}: ${location.file} is registered as carrying the ` +
                    `measured-on attribution but does not exist`
            )
            continue
        }
        const source = fs.readFileSync(absolute, 'utf8')
        if (!source.includes(location.context)) {
            errors.push(
                `${claim.id}: ${location.file} no longer contains its ` +
                    `measured-on attribution ${JSON.stringify(
                        location.context
                    )}. A surface that renders a measured number must say ` +
                    `which engine build produced it.`
            )
        }
    }
}

function checkAcknowledgementNotExpired(claim, today) {
    const lag = claim.acknowledged_release_lag
    if (!lag) return
    if (!lag.review_by) {
        errors.push(
            `${claim.id}: acknowledged_release_lag has no review_by. An ` +
                `acknowledgement that never expires is renewed by silence.`
        )
        return
    }
    if (lag.review_by < today) {
        errors.push(
            `${claim.id}: the acknowledged release lag expired on ` +
                `${lag.review_by} (today is ${today}). Decide explicitly: ` +
                `re-measure on the current engine and publish new numbers, ` +
                `retire the claim, or record a new dated acknowledgement.`
        )
    }
}

// ---------------------------------------------------------------------------
// Network checks
// ---------------------------------------------------------------------------

async function fetchReleases(pkg) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), HTTP_TIMEOUT_MS)
    try {
        const response = await fetch(PYPI_URL(pkg), {
            signal: controller.signal,
        })
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const document = await response.json()
        const live = Object.entries(document.releases ?? {})
            .filter(
                ([, files]) => files.length && !files.every((f) => f.yanked)
            )
            .map(([version]) => version)
        return {
            version: document.info.version,
            published: live,
            releases: document.releases ?? {},
        }
    } finally {
        clearTimeout(timer)
    }
}

function checkPypiLatestAgainstRelease(claim, latest) {
    for (const [field, version] of Object.entries(claim.versions)) {
        const pkg = claim.packages[field]
        const current = latest[pkg]?.version
        if (!current) continue
        if (current !== version) {
            errors.push(
                `${claim.id}: ${claim.source_of_truth} advertises ${pkg} ` +
                    `${version} as the current release, but PyPI's newest is ` +
                    `${current}. Update the manifest and this registry.`
            )
        }
    }

    for (const [field, record] of Object.entries(releaseRecordsForClaim(claim))) {
        const entry = latest[record.package]
        if (!entry?.releases) continue
        const files = entry.releases[record.version] ?? []
        const published = new Map(
            files.map((file) => [
                file.filename,
                {
                    type: file.packagetype,
                    url: file.url,
                    sha256: file.digests?.sha256,
                },
            ])
        )
        for (const artifact of record.artifacts) {
            const actual = published.get(artifact.filename)
            if (!actual) {
                errors.push(
                    `${claim.id}: ${field} artifact ${artifact.filename} is ` +
                        `not published on PyPI for ${record.version}`
                )
                continue
            }
            for (const key of ['type', 'url', 'sha256']) {
                if (artifact[key] !== actual[key]) {
                    errors.push(
                        `${claim.id}: ${field} artifact ${artifact.filename} ` +
                            `${key} does not match PyPI`
                    )
                }
            }
        }
    }
}

async function fetchGithubJson(pathname) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), HTTP_TIMEOUT_MS)
    try {
        const response = await fetch(`${GITHUB_API_BASE}${pathname}`, {
            signal: controller.signal,
            headers: {
                Accept: 'application/vnd.github+json',
                'User-Agent': 'openadapt-published-version-claims',
            },
        })
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        return response.json()
    } finally {
        clearTimeout(timer)
    }
}

async function checkGithubReleaseRecord(claim, field, record) {
    const repository = record.github_repository
    try {
        const ref = await fetchGithubJson(
            `/repos/${repository}/git/ref/tags/${encodeURIComponent(record.tag)}`
        )
        let releaseCommit
        if (ref.object?.type === 'tag') {
            const tag = await fetchGithubJson(
                `/repos/${repository}/git/tags/${ref.object.sha}`
            )
            if (tag.object?.type !== 'commit') {
                errors.push(
                    `${claim.id}: ${field} tag ${record.tag} does not resolve ` +
                        `to a commit`
                )
                return
            }
            releaseCommit = tag.object.sha
        } else if (ref.object?.type === 'commit') {
            releaseCommit = ref.object.sha
        } else {
            errors.push(
                `${claim.id}: ${field} tag ${record.tag} has unsupported target`
            )
            return
        }
        if (releaseCommit !== record.release_commit) {
            errors.push(
                `${claim.id}: ${field} release_commit ${record.release_commit} ` +
                    `does not match ${record.tag} target ${releaseCommit}`
            )
            return
        }
        const commit = await fetchGithubJson(
            `/repos/${repository}/git/commits/${releaseCommit}`
        )
        const qualifiedSource = commit.parents?.[0]?.sha
        if (qualifiedSource !== record.qualified_source_commit) {
            errors.push(
                `${claim.id}: ${field} qualified_source_commit ` +
                    `${record.qualified_source_commit} does not match the ` +
                    `release commit parent ${qualifiedSource}`
            )
        }
    } catch (error) {
        warnings.push(
            `could not verify ${repository} ${record.tag} (${error.message}); ` +
                `skipping its release-commit comparison`
        )
    }
}

function checkHistoricalLag(claim, latest) {
    const entry = latest[claim.package]
    if (!entry) return
    const current = entry.version
    const observed = releasesBehind(claim.version, entry.published)
    const lag = claim.acknowledged_release_lag
    if (observed == null) {
        warnings.push(
            `${claim.id}: no release list for ${claim.package}, so the lag ` +
                `behind ${current} could not be counted`
        )
        return
    }
    if (!lag) {
        notes.push(
            `${claim.id}: measured on ${claim.package} ${claim.version}, ` +
                `${observed} published releases behind ${current}; no lag is ` +
                `acknowledged for this claim.`
        )
        return
    }
    if (observed > lag.releases_behind) {
        errors.push(
            `${claim.id}: published evidence was measured on ${claim.package} ` +
                `${claim.version} and the current release is ${current} -- ` +
                `${observed} published releases behind, past the ` +
                `${lag.releases_behind} acknowledged on ${lag.acknowledged_on} ` +
                `against ${lag.as_of_release}. The numbers are correctly ` +
                `frozen; the GAP is what needs a decision. Re-measure and ` +
                `publish a new evidence set, or record a new dated ` +
                `acknowledgement.`
        )
    } else {
        notes.push(
            `${claim.id}: measured on ${claim.package} ${claim.version}, ` +
                `${observed} published releases behind ${current} ` +
                `(acknowledged ${lag.releases_behind}, review by ` +
                `${lag.review_by}).`
        )
    }
}

// ---------------------------------------------------------------------------

async function main() {
    const args = parseArgs(process.argv.slice(2))
    const today = args.today ?? new Date().toISOString().slice(0, 10)
    const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'))
    const claims = registry.claims ?? []
    if (!claims.length) {
        console.error('DRIFT: the registry declares no claims')
        return 1
    }

    for (const claim of claims) {
        if (claim.kind === 'pypi-latest') checkPypiLatestSourceOfTruth(claim)
        if (claim.kind === 'historical') checkHistoricalSourceOfTruth(claim)
        checkAttributionLocations(claim)
        checkAcknowledgementNotExpired(claim, today)
    }

    // `--current-version pkg=1.2.3` supplies a release out of band, which is
    // how the failure modes are exercised without waiting for a real release.
    const latest = {}
    for (const [pkg, published] of Object.entries(args.releases)) {
        const newest = [...published].sort(compareVersions).pop()
        latest[pkg] = { version: newest, published }
    }
    for (const [pkg, version] of Object.entries(args.versions)) {
        // No release list supplied: the newest release is known but the lag
        // cannot be counted, and checkHistoricalLag says so rather than
        // silently passing.
        latest[pkg] = latest[pkg] ?? { version, published: null }
    }
    if (!args.offline) {
        const wanted = new Set()
        for (const claim of claims) {
            if (claim.kind === 'pypi-latest')
                Object.values(claim.packages).forEach((p) => wanted.add(p))
            if (claim.kind === 'historical') wanted.add(claim.package)
        }
        for (const pkg of wanted) {
            if (latest[pkg]) continue
            try {
                latest[pkg] = await fetchReleases(pkg)
            } catch (error) {
                // An unreachable index is not evidence of drift.
                warnings.push(
                    `could not query PyPI for ${pkg} (${error.message}); ` +
                        `skipping its release comparison`
                )
            }
        }
    }

    if (Object.keys(latest).length) {
        for (const claim of claims) {
            if (claim.kind === 'pypi-latest')
                checkPypiLatestAgainstRelease(claim, latest)
            if (claim.kind === 'historical') checkHistoricalLag(claim, latest)
        }
    }

    if (!args.offline) {
        for (const claim of claims) {
            for (const [field, record] of Object.entries(
                releaseRecordsForClaim(claim)
            )) {
                await checkGithubReleaseRecord(claim, field, record)
            }
        }
    }

    for (const warning of warnings) console.warn(`WARNING: ${warning}`)
    for (const note of notes) console.log(note)
    if (errors.length) {
        for (const error of errors) console.error(`DRIFT: ${error}`)
        return 1
    }
    console.log(
        `Published version claims are consistent (${claims.length} claims` +
            `${args.offline ? ', offline checks only' : ''}).`
    )
    return 0
}

process.exitCode = await main()
