export const DESKTOP_REPO = 'OpenAdaptAI/openadapt-desktop'
// The releases API is only queried server-side (lib/githubApi.js, at
// build/revalidate time). Visitor browsers must never call api.github.com.
export const DESKTOP_RELEASES_PAGE = `https://github.com/${DESKTOP_REPO}/releases`

const DESKTOP_TAG = /^desktop-v\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/
const RELEASE_PREFIXES = {
    beta: /^OpenAdapt-Desktop-Beta-/i,
    experimental: /^OpenAdapt-Desktop-Experimental-/i,
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
    /-macos-arm64-(?:adhoc|developer-id-notarized)\.dmg$/i,
    /-macos-x86_64-(?:adhoc|developer-id-notarized)\.dmg$/i,
    /-windows-x86_64-(?:unsigned|authenticode)\.msi$/i,
    /-windows-x86_64-(?:unsigned|authenticode)-nsis-setup\.exe$/i,
    /-linux-x86_64-unsigned\.AppImage$/i,
    /-linux-x86_64-unsigned\.deb$/i,
]

// Beta releases add one machine-readable provenance record for every platform
// build. Existing Experimental releases predate that contract and remain
// discoverable during the transition, but a new Beta set is never accepted
// without all four metadata records and the checksum manifest.
const BETA_PROVENANCE_ASSETS = [
    /-macos-arm64-(?:adhoc|developer-id-notarized)-metadata\.json$/i,
    /-macos-x86_64-(?:adhoc|developer-id-notarized)-metadata\.json$/i,
    /-windows-x86_64-(?:unsigned|authenticode)-metadata\.json$/i,
    /-linux-x86_64-unsigned-metadata\.json$/i,
]

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

function isCompleteDesktopReleaseForLifecycle(release, lifecycle) {
    const prefix = RELEASE_PREFIXES[lifecycle]
    if (
        !release ||
        release.draft ||
        release.prerelease !== true ||
        !DESKTOP_TAG.test(release.tag_name || '') ||
        !Array.isArray(release.assets)
    ) {
        return false
    }

    const assets = release.assets.filter(hasDownloadUrl)
    const hasChecksums = assets.some((asset) => asset.name === 'SHA256SUMS')
    const required =
        lifecycle === 'beta'
            ? [...REQUIRED_ASSETS, ...BETA_PROVENANCE_ASSETS]
            : REQUIRED_ASSETS
    return (
        hasChecksums &&
        required.every((pattern) =>
            assets.some((asset) => prefix.test(asset.name) && pattern.test(asset.name))
        )
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
    if (complete.length === 0) return null

    // The GitHub endpoint is normally newest-first, but select by publication
    // metadata so a stable release interleaved in the response or a changed
    // API ordering cannot make the download page advertise an older desktop
    // prerelease.
    return complete.reduce((latest, candidate) => {
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
        if (
            candidateTime === latestTime &&
            desktopReleaseLifecycle(candidate) === 'beta' &&
            desktopReleaseLifecycle(latest) !== 'beta'
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
