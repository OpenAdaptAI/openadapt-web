export const DESKTOP_REPO = 'OpenAdaptAI/openadapt-desktop'
// The releases API is only queried server-side (lib/githubApi.js). Visitor
// browsers must never call api.github.com.
export const DESKTOP_RELEASES_PAGE = `https://github.com/${DESKTOP_REPO}/releases`

const DESKTOP_TAG = /^desktop-v\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/
const RELEASE_PREFIXES = {
    beta: /^OpenAdapt-Desktop-Beta-/i,
    experimental: /^OpenAdapt-Desktop-Experimental-/i,
}
const RELEASE_ASSET_FAMILIES = {
    beta: 'Beta',
    experimental: 'Experimental',
}
const RELEASE_LIFECYCLES = ['beta', 'experimental']

function lifecycleForAsset(name) {
    return RELEASE_LIFECYCLES.find((lifecycle) =>
        RELEASE_PREFIXES[lifecycle].test(name || '')
    )
}

export const DESKTOP_PLATFORMS = [
    {
        id: 'windows',
        label: 'Windows',
        arch: 'x64',
        hint: '.msi installer (or .exe)',
        match: (name) =>
            Boolean(lifecycleForAsset(name)) &&
            /-windows-x86_64-(?:(?:unsigned|authenticode)\.msi|(?:unsigned|authenticode)-nsis-setup\.exe)$/i.test(
                name
            ),
        rank: (name) => (/\.msi$/i.test(name) ? 0 : 1),
    },
    {
        id: 'macos-arm',
        label: 'macOS',
        arch: 'Apple Silicon',
        hint: '.dmg for M1 and later',
        match: (name) =>
            Boolean(lifecycleForAsset(name)) &&
            /-macos-arm64-(?:adhoc|developer-id-notarized)\.dmg$/i.test(name),
        rank: () => 0,
    },
    {
        id: 'macos-x64',
        label: 'macOS',
        arch: 'Intel',
        hint: '.dmg for Intel Macs',
        match: (name) =>
            Boolean(lifecycleForAsset(name)) &&
            /-macos-x86_64-(?:adhoc|developer-id-notarized)\.dmg$/i.test(
                name
            ),
        rank: () => 0,
    },
    {
        id: 'linux',
        label: 'Linux',
        arch: 'x64',
        hint: '.AppImage (or .deb)',
        match: (name) =>
            Boolean(lifecycleForAsset(name)) &&
            /-linux-x86_64-unsigned\.(?:AppImage|deb)$/i.test(name),
        rank: (name) => (/\.AppImage$/i.test(name) ? 0 : 1),
    },
]

const REQUIRED_ASSETS = [
    /^-macos-arm64-(?:adhoc|developer-id-notarized)\.dmg$/i,
    /^-macos-x86_64-(?:adhoc|developer-id-notarized)\.dmg$/i,
    /^-windows-x86_64-(?:unsigned|authenticode)\.msi$/i,
    /^-windows-x86_64-(?:unsigned|authenticode)-nsis-setup\.exe$/i,
    /^-linux-x86_64-unsigned\.AppImage$/i,
    /^-linux-x86_64-unsigned\.deb$/i,
]

// Beta releases add one machine-readable provenance record for every platform
// build. Existing Experimental releases predate that contract and remain
// discoverable during the transition, but a new Beta set is never accepted
// without all four metadata records and the checksum manifest.
const BETA_PROVENANCE_ASSETS = [
    /^-macos-arm64-(?:adhoc|developer-id-notarized)-metadata\.json$/i,
    /^-macos-x86_64-(?:adhoc|developer-id-notarized)-metadata\.json$/i,
    /^-windows-x86_64-(?:unsigned|authenticode)-metadata\.json$/i,
    /^-linux-x86_64-unsigned-metadata\.json$/i,
]
export const DESKTOP_RELEASE_MANIFEST =
    'openadapt-desktop-release-manifest.json'

function hasDownloadUrl(asset) {
    return Boolean(
        asset &&
            typeof asset.name === 'string' &&
            typeof asset.browser_download_url === 'string' &&
            asset.browser_download_url.startsWith('https://')
    )
}

export function assetForPlatform(assets, platform, preferredLifecycle = null) {
    return assets
        .filter(hasDownloadUrl)
        .filter((asset) => platform.match(asset.name))
        .filter(
            (asset) =>
                !preferredLifecycle ||
                lifecycleForAsset(asset.name) === preferredLifecycle
        )
        .sort((a, b) => {
            const lifecycleRank =
                RELEASE_LIFECYCLES.indexOf(lifecycleForAsset(a.name)) -
                RELEASE_LIFECYCLES.indexOf(lifecycleForAsset(b.name))
            return lifecycleRank || platform.rank(a.name) - platform.rank(b.name)
        })[0]
}

function isCompleteDesktopReleaseForLifecycle(
    release,
    lifecycle,
    requireBetaManifest = true
) {
    if (
        !release ||
        release.draft ||
        release.prerelease !== true ||
        !DESKTOP_TAG.test(release.tag_name || '') ||
        !Array.isArray(release.assets)
    ) {
        return false
    }

    const version = release.tag_name.slice('desktop-v'.length)
    const expectedPrefix = `OpenAdapt-Desktop-${RELEASE_ASSET_FAMILIES[lifecycle]}-v${version}-`
    const assets = release.assets.filter(hasDownloadUrl)
    const hasChecksums = assets.some((asset) => asset.name === 'SHA256SUMS')
    const hasReleaseManifest = assets.some(
        (asset) => asset.name === DESKTOP_RELEASE_MANIFEST
    )
    const required =
        lifecycle === 'beta'
            ? [...REQUIRED_ASSETS, ...BETA_PROVENANCE_ASSETS]
            : REQUIRED_ASSETS
    return (
        hasChecksums &&
        (lifecycle !== 'beta' || !requireBetaManifest || hasReleaseManifest) &&
        required.every((pattern) =>
            assets.some(
                (asset) =>
                    asset.name.startsWith(expectedPrefix) &&
                    pattern.test(
                        asset.name.slice(expectedPrefix.length - 1)
                    )
            )
        )
    )
}

export function isLegacyBetaDesktopRelease(release) {
    return (
        isCompleteDesktopReleaseForLifecycle(release, 'beta', false) &&
        !release.assets.some(
            (asset) =>
                hasDownloadUrl(asset) &&
                asset.name === DESKTOP_RELEASE_MANIFEST
        )
    )
}

export function validateDesktopReleaseManifest(release, manifest) {
    if (
        !release ||
        !manifest ||
        manifest.schema_version !== 1 ||
        manifest.lifecycle !== 'Beta' ||
        manifest.native_tag !== release.tag_name ||
        manifest.native_version !== release.tag_name?.slice('desktop-v'.length) ||
        !/^[0-9a-f]{40}$/.test(manifest.source_commit || '') ||
        !Array.isArray(manifest.artifacts)
    ) {
        return null
    }
    const releaseAssets = new Map(
        (release.assets || []).filter(hasDownloadUrl).map((asset) => [asset.name, asset])
    )
    const expectedInstallerNames = new Set(
        [...releaseAssets.keys()].filter((name) =>
            DESKTOP_PLATFORMS.some((platform) => platform.match(name))
        )
    )
    const observed = new Set()
    for (const artifact of manifest.artifacts) {
        const expectedPlatform = artifact?.name?.includes('-macos-')
            ? 'macos'
            : artifact?.name?.includes('-windows-')
              ? 'windows'
              : artifact?.name?.includes('-linux-')
                ? 'linux'
                : null
        const expectedArchitecture = artifact?.name?.includes('-arm64-')
            ? 'arm64'
            : artifact?.name?.includes('-x86_64-')
              ? 'x86_64'
              : null
        const expectedSigning = artifact?.name?.match(
            /-(adhoc|developer-id-notarized|unsigned|authenticode)(?:\.|-nsis-setup\.exe$)/
        )?.[1]
        if (
            !artifact ||
            typeof artifact.name !== 'string' ||
            observed.has(artifact.name) ||
            !expectedInstallerNames.has(artifact.name) ||
            !/^[0-9a-f]{64}$/.test(artifact.sha256 || '') ||
            artifact.platform !== expectedPlatform ||
            artifact.architecture !== expectedArchitecture ||
            artifact.signing !== expectedSigning
        ) {
            return null
        }
        observed.add(artifact.name)
    }
    if (
        observed.size !== expectedInstallerNames.size ||
        [...expectedInstallerNames].some((name) => !observed.has(name))
    ) {
        return null
    }
    const expectedSbomName = `OpenAdapt-Desktop-${release.tag_name}.cyclonedx.json`
    if (
        manifest.sbom?.name !== expectedSbomName ||
        manifest.sbom?.format !== 'CycloneDX' ||
        !/^[0-9a-f]{64}$/.test(manifest.sbom?.sha256 || '') ||
        !releaseAssets.has(expectedSbomName)
    ) {
        return null
    }
    return {
        sourceCommit: manifest.source_commit,
        artifactCount: observed.size,
        sbom: {
            ...manifest.sbom,
            browser_download_url:
                releaseAssets.get(expectedSbomName).browser_download_url,
        },
    }
}

export function validateDesktopReleaseChecksums(
    release,
    manifest,
    checksumText,
    manifestDigest
) {
    if (
        !/^[0-9a-f]{64}$/.test(manifestDigest || '') ||
        typeof checksumText !== 'string'
    ) {
        return false
    }
    const checksums = new Map()
    for (const line of checksumText.split('\n').filter(Boolean)) {
        const match = line.match(/^([0-9a-f]{64})  ([^/\\]+)$/)
        if (!match || checksums.has(match[2])) return false
        checksums.set(match[2], match[1])
    }
    const expectedNames = new Set(
        (release.assets || [])
            .filter(hasDownloadUrl)
            .map((asset) => asset.name)
            .filter((name) => name !== 'SHA256SUMS')
    )
    if (
        checksums.size !== expectedNames.size ||
        [...expectedNames].some((name) => !checksums.has(name)) ||
        checksums.get(DESKTOP_RELEASE_MANIFEST) !== manifestDigest
    ) {
        return false
    }
    return (
        manifest.artifacts.every(
            (artifact) => checksums.get(artifact.name) === artifact.sha256
        ) && checksums.get(manifest.sbom.name) === manifest.sbom.sha256
    )
}

export function desktopReleaseLifecycle(release) {
    return (
        RELEASE_LIFECYCLES.find((lifecycle) =>
            isCompleteDesktopReleaseForLifecycle(release, lifecycle)
        ) || null
    )
}

export function isCompleteDesktopRelease(release) {
    return desktopReleaseLifecycle(release) !== null
}

export function selectDesktopRelease(releases) {
    if (!Array.isArray(releases)) return null
    const complete = releases.filter(isCompleteDesktopRelease)

    // Once a complete Beta exists, legacy Experimental compatibility releases
    // and pre-manifest Beta releases can never become primary again. This
    // makes the manifest transition monotonic while retaining the published
    // installer set until the first manifest-backed Beta is available.
    const beta = complete.filter(
        (release) => desktopReleaseLifecycle(release) === 'beta'
    )
    const candidates =
        beta.length > 0
            ? beta
            : [
                  ...complete,
                  ...releases.filter(isLegacyBetaDesktopRelease),
              ]
    if (candidates.length === 0) return null

    // The GitHub endpoint is normally newest-first, but select by publication
    // metadata so a stable release interleaved in the response or a changed
    // API ordering cannot make the download page advertise an older desktop
    // prerelease.
    return candidates.reduce((latest, candidate) => {
        const latestTime = Date.parse(
            latest.published_at || latest.created_at || ''
        )
        const candidateTime = Date.parse(
            candidate.published_at || candidate.created_at || ''
        )
        if (
            Number.isFinite(candidateTime) &&
            (!Number.isFinite(latestTime) || candidateTime > latestTime)
        ) {
            return candidate
        }
        return latest
    })
}

// Compatibility exports for consumers that still use the old names. Their
// behavior intentionally includes both Beta and legacy Experimental releases,
// avoiding a flag day while callers migrate to the lifecycle-neutral names.
export const isCompleteExperimentalDesktopRelease = isCompleteDesktopRelease
export const selectExperimentalDesktopRelease = selectDesktopRelease

export function detectDesktopPlatform(navigatorValue) {
    if (!navigatorValue) return null
    const fingerprint = `${navigatorValue.userAgent || ''} ${
        navigatorValue.platform || ''
    }`.toLowerCase()

    const isArm = /(?:^|[^a-z])(?:arm64|aarch64|armv8)(?:[^a-z]|$)/.test(
        fingerprint
    )
    const isX64 = /x86_64|x86-64|amd64|win64|wow64|x64/.test(fingerprint)
    if (/mac/.test(fingerprint)) {
        if (isArm) return 'macos-arm'
        if (isX64) return 'macos-x64'
        // Safari and several Chromium configurations deliberately report
        // Apple Silicon as MacIntel. We can still give a macOS-specific
        // two-button chooser instead of presenting detection as a failure.
        return 'macos'
    }
    if (/iphone|ipad/.test(fingerprint)) return null
    if (isArm || !isX64) return null
    if (/win/.test(fingerprint)) return 'windows'
    if (/linux/.test(fingerprint) && !/android/.test(fingerprint)) return 'linux'
    return null
}

export async function detectDesktopPlatformWithHints(navigatorValue) {
    const detected = detectDesktopPlatform(navigatorValue)
    if (detected !== 'macos') return detected

    const hints = navigatorValue?.userAgentData
    if (!hints || typeof hints.getHighEntropyValues !== 'function') {
        return detected
    }
    try {
        const values = await hints.getHighEntropyValues([
            'architecture',
            'bitness',
            'platform',
        ])
        const fingerprint =
            `${values.platform || ''} ${values.architecture || ''} ${values.bitness || ''}`.toLowerCase()
        if (!/mac/.test(fingerprint)) return detected
        if (/arm|aarch64/.test(fingerprint)) return 'macos-arm'
        if (/x86|x64|amd64/.test(fingerprint)) return 'macos-x64'
    } catch {
        // Client hints are optional. The explicit macOS chooser remains.
    }
    return detected
}

export function releaseSigningState(assets, lifecycle = null) {
    const names = Array.isArray(assets)
        ? assets
              .map((asset) => asset.name || '')
              .filter(
                  (name) =>
                      !lifecycle || lifecycleForAsset(name) === lifecycle
              )
        : []
    return {
        macosNotarized: ['arm64', 'x86_64'].every((architecture) =>
            names.some((name) =>
                new RegExp(
                    `-macos-${architecture}-developer-id-notarized\\.dmg$`,
                    'i'
                ).test(name)
            )
        ),
        windowsSigned: [
            /-windows-x86_64-authenticode\.msi$/i,
            /-windows-x86_64-authenticode-nsis-setup\.exe$/i,
        ].every((pattern) => names.some((name) => pattern.test(name))),
    }
}
