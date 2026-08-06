import test from 'node:test'
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'

import {
    assetForPlatform,
    desktopReleaseCandidates,
    DESKTOP_PLATFORMS,
    desktopReleaseLifecycle,
    isCompleteDesktopRelease,
    isLegacyBetaDesktopRelease,
    selectDesktopRelease,
    validateDesktopReleaseChecksums,
    validateDesktopReleaseManifest,
} from '../utils/desktopRelease.js'
import { resolveDesktopRelease } from '../lib/githubApi.js'

const url = (name, tag = 'test') => ({
    name,
    size: 1024,
    browser_download_url: `https://github.com/OpenAdaptAI/openadapt-desktop/releases/download/${tag}/${name}`,
})

function binaryNames(lifecycle, version = '0.7.0') {
    const prefix = `OpenAdapt-Desktop-${lifecycle}-v${version}`
    return [
        `${prefix}-macos-arm64-adhoc.dmg`,
        `${prefix}-macos-x86_64-adhoc.dmg`,
        `${prefix}-windows-x86_64-unsigned.msi`,
        `${prefix}-windows-x86_64-unsigned-nsis-setup.exe`,
        `${prefix}-linux-x86_64-unsigned.AppImage`,
        `${prefix}-linux-x86_64-unsigned.deb`,
    ]
}

function betaMetadataNames(version = '0.7.0') {
    const prefix = `OpenAdapt-Desktop-Beta-v${version}`
    return [
        `${prefix}-macos-arm64-adhoc-metadata.json`,
        `${prefix}-macos-x86_64-adhoc-metadata.json`,
        `${prefix}-windows-x86_64-unsigned-metadata.json`,
        `${prefix}-linux-x86_64-unsigned-metadata.json`,
    ]
}

function release(lifecycle, version, publishedAt) {
    const tag = `desktop-v${version}`
    const names = [
        ...binaryNames(lifecycle, version),
        ...(lifecycle === 'Beta' ? betaMetadataNames(version) : []),
        ...(lifecycle === 'Beta'
            ? [`OpenAdapt-Desktop-${tag}.cyclonedx.json`]
            : []),
        ...(lifecycle === 'Beta'
            ? ['openadapt-desktop-release-manifest.json']
            : []),
        'SHA256SUMS',
    ]
    return {
        tag_name: tag,
        prerelease: true,
        draft: false,
        published_at: publishedAt,
        assets: names.map((name) => url(name, tag)),
    }
}

function manifestFor(candidate, sourceCommit = 'a'.repeat(40)) {
    const version = candidate.tag_name.slice('desktop-v'.length)
    const sbomName = `OpenAdapt-Desktop-${candidate.tag_name}.cyclonedx.json`
    return {
        schema_version: 1,
        lifecycle: 'Beta',
        native_tag: candidate.tag_name,
        native_version: version,
        source_commit: sourceCommit,
        verification: {
            github_artifact_attestation: 'required',
            installer_smoke: 'install, launch, and uninstall',
            sha256_manifest: 'SHA256SUMS',
        },
        artifacts: binaryNames('Beta', version).map((name) => ({
            name,
            platform: name.includes('-macos-')
                ? 'macos'
                : name.includes('-windows-')
                  ? 'windows'
                  : 'linux',
            architecture: name.includes('-arm64-') ? 'arm64' : 'x86_64',
            signing: name.includes('-adhoc.')
                ? 'adhoc'
                : name.includes('-windows-') || name.includes('-linux-')
                  ? 'unsigned'
                  : 'adhoc',
            sha256: 'b'.repeat(64),
        })),
        sbom: { name: sbomName, format: 'CycloneDX', sha256: 'c'.repeat(64) },
    }
}

function checksumsFor(candidate, manifest, manifestText) {
    const manifestDigest = createHash('sha256')
        .update(manifestText)
        .digest('hex')
    return candidate.assets
        .filter((asset) => asset.name !== 'SHA256SUMS')
        .map((asset) => {
            const described = manifest.artifacts.find(
                (artifact) => artifact.name === asset.name
            )
            const digest =
                asset.name === 'openadapt-desktop-release-manifest.json'
                    ? manifestDigest
                    : asset.name === manifest.sbom.name
                      ? manifest.sbom.sha256
                      : described?.sha256 || 'd'.repeat(64)
            return `${digest}  ${asset.name}`
        })
        .join('\n')
}

test('accepts a complete Beta set only with checksums and per-platform provenance', () => {
    const candidate = release('Beta', '0.7.0', '2026-07-21T12:00:00Z')
    assert.equal(isCompleteDesktopRelease(candidate), true)
    assert.equal(desktopReleaseLifecycle(candidate), 'beta')

    candidate.assets = candidate.assets.filter(
        (asset) => !asset.name.endsWith('windows-x86_64-unsigned-metadata.json')
    )
    assert.equal(isCompleteDesktopRelease(candidate), false)
})

test('requires the release manifest for every complete Beta set', () => {
    const candidate = release('Beta', '0.7.0', '2026-07-21T12:00:00Z')
    candidate.assets = candidate.assets.filter(
        (asset) => asset.name !== 'openadapt-desktop-release-manifest.json'
    )
    assert.equal(isCompleteDesktopRelease(candidate), false)
    assert.equal(isLegacyBetaDesktopRelease(candidate), true)
    assert.equal(selectDesktopRelease([candidate]), candidate)
})

test('validates and binds the fetched release manifest to GitHub assets', () => {
    const candidate = release('Beta', '0.7.0', '2026-07-21T12:00:00Z')
    const manifest = manifestFor(candidate)
    const validated = validateDesktopReleaseManifest(
        candidate,
        manifest,
        'a'.repeat(40)
    )
    assert.equal(validated.artifactCount, 6)
    assert.equal(validated.sourceCommit, 'a'.repeat(40))
    assert.equal(validated.sbom.name, manifest.sbom.name)

    const manifestText = JSON.stringify(manifest)
    const manifestDigest = createHash('sha256').update(manifestText).digest('hex')
    const checksumEntries = checksumsFor(candidate, manifest, manifestText)
    assert.equal(
        validateDesktopReleaseChecksums(
            candidate,
            manifest,
            checksumEntries,
            manifestDigest
        ),
        true
    )

    assert.equal(
        validateDesktopReleaseChecksums(
            candidate,
            manifest,
            checksumEntries.replace(manifestDigest, '0'.repeat(64)),
            manifestDigest
        ),
        false
    )

    manifest.artifacts[1] = { ...manifest.artifacts[0] }
    assert.equal(
        validateDesktopReleaseManifest(candidate, manifest, 'a'.repeat(40)),
        null
    )
})

test('rejects duplicate, extra, and combined-signing Beta asset sets', () => {
    const duplicate = release('Beta', '0.7.0', '2026-07-21T12:00:00Z')
    duplicate.assets.push({ ...duplicate.assets[0] })
    assert.equal(isCompleteDesktopRelease(duplicate), false)

    const extra = release('Beta', '0.7.0', '2026-07-21T12:00:00Z')
    extra.assets.push(url('bogus-checksum-asset.bin', extra.tag_name))
    const extraManifest = manifestFor(extra)
    const extraManifestText = JSON.stringify(extraManifest)
    const extraDigest = createHash('sha256')
        .update(extraManifestText)
        .digest('hex')
    assert.equal(
        validateDesktopReleaseManifest(extra, extraManifest, 'a'.repeat(40)),
        null
    )
    assert.equal(
        validateDesktopReleaseChecksums(
            extra,
            extraManifest,
            checksumsFor(extra, extraManifest, extraManifestText),
            extraDigest
        ),
        false
    )

    const combined = release('Beta', '0.7.0', '2026-07-21T12:00:00Z')
    const prefix = 'OpenAdapt-Desktop-Beta-v0.7.0-windows-x86_64'
    combined.assets.push(
        url(`${prefix}-authenticode.msi`, combined.tag_name),
        url(`${prefix}-authenticode-nsis-setup.exe`, combined.tag_name),
        url(`${prefix}-authenticode-metadata.json`, combined.tag_name)
    )
    assert.equal(isCompleteDesktopRelease(combined), false)
    assert.equal(
        validateDesktopReleaseManifest(
            combined,
            manifestFor(combined),
            'a'.repeat(40)
        ),
        null
    )
})

test('requires the manifest source commit and verification contract to match', () => {
    const candidate = release('Beta', '0.7.0', '2026-07-21T12:00:00Z')
    const manifest = manifestFor(candidate)
    assert.equal(
        validateDesktopReleaseManifest(candidate, manifest, 'f'.repeat(40)),
        null
    )
    manifest.verification.installer_smoke = 'started once'
    assert.equal(
        validateDesktopReleaseManifest(candidate, manifest, 'a'.repeat(40)),
        null
    )
})

test('keeps complete legacy Experimental sets discoverable during transition', () => {
    const candidate = release(
        'Experimental',
        '0.6.2',
        '2026-07-20T12:00:00Z'
    )
    assert.equal(isCompleteDesktopRelease(candidate), true)
    assert.equal(desktopReleaseLifecycle(candidate), 'experimental')
})

test('binds every Beta asset version to the release tag', () => {
    const candidate = release('Beta', '0.8.0', '2026-07-21T12:00:00Z')
    candidate.tag_name = 'desktop-v0.9.0'
    assert.equal(isCompleteDesktopRelease(candidate), false)
})

test('binds every legacy asset version to the release tag', () => {
    const candidate = release(
        'Experimental',
        '0.6.2',
        '2026-07-20T12:00:00Z'
    )
    candidate.tag_name = 'desktop-v0.6.3'
    assert.equal(isCompleteDesktopRelease(candidate), false)
})

test('never assembles a complete release by mixing lifecycle asset families', () => {
    const candidate = release('Beta', '0.7.0', '2026-07-21T12:00:00Z')
    const missing = candidate.assets.findIndex((asset) =>
        asset.name.endsWith('macos-arm64-adhoc.dmg')
    )
    candidate.assets[missing] = url(
        'OpenAdapt-Desktop-Experimental-v0.7.0-macos-arm64-adhoc.dmg'
    )
    assert.equal(isCompleteDesktopRelease(candidate), false)
})

test('selects the newest complete release and preserves Experimental fallback', () => {
    const legacy = release(
        'Experimental',
        '0.6.2',
        '2026-07-20T12:00:00Z'
    )
    const beta = release('Beta', '0.7.0', '2026-07-21T12:00:00Z')
    assert.equal(selectDesktopRelease([legacy, beta]), beta)
    assert.equal(selectDesktopRelease([legacy]), legacy)
})

test('selects desktop-v0.9.0 over desktop-v0.6.2 with package and runtime releases interleaved', () => {
    const legacy = release(
        'Experimental',
        '0.6.2',
        '2026-07-19T17:28:56Z'
    )
    const packageOnly = {
        tag_name: 'v0.9.0',
        prerelease: false,
        draft: false,
        published_at: '2026-07-24T02:34:42Z',
        assets: [url('openadapt_desktop-0.9.0-py3-none-any.whl')],
    }
    const ffmpegRuntime = {
        tag_name: 'ffmpeg-runtime-v8.1.2-r1',
        prerelease: true,
        draft: false,
        published_at: '2026-07-24T00:30:34Z',
        assets: [url('ffmpeg-8.1.2-source.tar.xz')],
    }
    const current = release('Beta', '0.9.0', '2026-07-24T02:52:30Z')

    assert.equal(
        selectDesktopRelease([
            packageOnly,
            ffmpegRuntime,
            legacy,
            current,
        ]),
        current
    )
})

test('a complete Beta remains primary when a legacy release is newer', () => {
    const beta = release('Beta', '0.7.0', '2026-07-21T12:00:00Z')
    const laterLegacy = release(
        'Experimental',
        '0.6.3',
        '2026-07-22T12:00:00Z'
    )
    assert.equal(selectDesktopRelease([laterLegacy, beta]), beta)
})

test('a pre-manifest Beta remains primary when Experimental is newer', () => {
    const beta = release('Beta', '0.7.0', '2026-07-21T12:00:00Z')
    beta.assets = beta.assets.filter(
        (asset) => asset.name !== 'openadapt-desktop-release-manifest.json'
    )
    const experimental = release(
        'Experimental',
        '0.8.0',
        '2026-07-22T12:00:00Z'
    )
    assert.deepEqual(desktopReleaseCandidates([experimental, beta]), [
        beta,
        experimental,
    ])
    assert.equal(selectDesktopRelease([experimental, beta]), beta)
})

test('a malformed newest strict Beta falls back to the next valid Beta', async () => {
    const current = release('Beta', '0.7.0', '2026-07-21T12:00:00Z')
    const malformed = release('Beta', '0.8.0', '2026-07-22T12:00:00Z')
    const manifests = new Map(
        [current, malformed].map((candidate) => {
            const manifest = manifestFor(candidate)
            if (candidate === malformed) {
                manifest.native_tag = 'desktop-v9.9.9'
            }
            const text = JSON.stringify(manifest)
            return [
                candidate.tag_name,
                {
                    manifest,
                    text,
                    checksums: checksumsFor(candidate, manifest, text),
                },
            ]
        })
    )
    const fetchAssetText = async (assetUrl) => {
        const tag = [...manifests.keys()].find((value) =>
            assetUrl.includes(`/download/${value}/`)
        )
        if (assetUrl.endsWith('/openadapt-desktop-release-manifest.json')) {
            return manifests.get(tag).text
        }
        if (assetUrl.endsWith('/SHA256SUMS')) {
            return manifests.get(tag).checksums
        }
        throw new Error('unexpected asset')
    }
    const result = await resolveDesktopRelease([malformed, current], {
        fetchAssetText,
        fetchTagCommit: async () => 'a'.repeat(40),
    })
    assert.equal(result.fetchFailed, false)
    assert.equal(result.release.tag_name, current.tag_name)
    assert.equal(result.release.manifest.sourceCommit, 'a'.repeat(40))
})

test('a malformed strict Beta preserves the current pre-manifest Beta', async () => {
    const current = release('Beta', '0.7.0', '2026-07-21T12:00:00Z')
    current.assets = current.assets.filter(
        (asset) => asset.name !== 'openadapt-desktop-release-manifest.json'
    )
    const malformed = release('Beta', '0.8.0', '2026-07-22T12:00:00Z')
    const manifest = manifestFor(malformed)
    manifest.source_commit = 'f'.repeat(40)
    const manifestText = JSON.stringify(manifest)
    const result = await resolveDesktopRelease([malformed, current], {
        fetchAssetText: async (assetUrl) =>
            assetUrl.endsWith('/SHA256SUMS')
                ? checksumsFor(malformed, manifest, manifestText)
                : manifestText,
        fetchTagCommit: async () => 'a'.repeat(40),
    })
    assert.equal(result.fetchFailed, false)
    assert.equal(result.release.tag_name, current.tag_name)
    assert.equal(result.release.lifecycle, 'beta')
    assert.equal(result.release.manifest, null)
})

test('platform selection stays in the chosen release lifecycle', () => {
    const assets = [
        ...release('Experimental', '0.6.2', '2026-07-20T12:00:00Z').assets,
        ...release('Beta', '0.7.0', '2026-07-21T12:00:00Z').assets,
    ]
    const windows = DESKTOP_PLATFORMS.find((platform) => platform.id === 'windows')
    assert.match(assetForPlatform(assets, windows, 'beta').name, /-Beta-/)
    assert.match(
        assetForPlatform(assets, windows, 'experimental').name,
        /-Experimental-/
    )
})

test('download copy leads with Beta without exposing the predecessor lifecycle', () => {
    const page = readFileSync(new URL('../pages/download.js', import.meta.url), 'utf8')
    assert.match(page, /Native desktop Beta/)
    assert.match(page, /Desktop release/)
    assert.doesNotMatch(page, /Experimental/)
})
