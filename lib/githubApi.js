// Server-only GitHub API access.
//
// Visitor browsers must NEVER call api.github.com: unauthenticated requests
// are limited to 60/hour per client IP, so anyone on a shared IP (offices,
// VPNs, CGNAT) gets 403s and sees broken release lists and social proof.
// All GitHub data is fetched here from server-side loaders or same-origin API
// routes at runtime (dynamic imports only — keep this module out of client
// bundles).
//
// An optional GITHUB_TOKEN environment variable raises the rate limit for
// server/build requests. It is never shipped to the client.

const GITHUB_API_BASE = 'https://api.github.com'

function githubHeaders() {
    const headers = {
        Accept: 'application/vnd.github+json',
        'User-Agent': 'OpenAdapt-Web/1.0 (https://openadapt.ai)',
    }
    const token = process.env.GITHUB_TOKEN
    if (token) {
        headers.Authorization = `Bearer ${token}`
    }
    return headers
}

async function fetchGitHubJson(pathname) {
    const response = await fetch(`${GITHUB_API_BASE}${pathname}`, {
        headers: githubHeaders(),
    })
    if (!response.ok) {
        throw new Error(`GitHub API ${response.status} for ${pathname}`)
    }
    return response.json()
}

async function fetchDesktopReleaseAssetText(assetUrl) {
    const expectedPrefix =
        'https://github.com/OpenAdaptAI/openadapt-desktop/releases/download/'
    if (typeof assetUrl !== 'string' || !assetUrl.startsWith(expectedPrefix)) {
        throw new Error('Desktop release asset URL is outside the release repository')
    }
    const response = await fetch(assetUrl, { headers: githubHeaders() })
    if (!response.ok) {
        throw new Error(`Desktop release asset returned ${response.status}`)
    }
    return response.text()
}

async function fetchDesktopTagCommit(tag) {
    const data = await fetchGitHubJson(
        `/repos/OpenAdaptAI/openadapt-desktop/commits/${encodeURIComponent(tag)}`
    )
    if (!data || !/^[0-9a-f]{40}$/.test(data.sha || '')) {
        throw new Error(`Desktop tag ${tag} did not resolve to one commit`)
    }
    return data.sha
}

/**
 * Fetch current star/fork social proof and throw on failure.
 * Server-side cache/fallback policy belongs to the caller.
 */
export async function fetchRepoSocialProof(repository) {
    const data = await fetchGitHubJson(`/repos/${repository}`)
    if (
        typeof data.stargazers_count !== 'number' ||
        typeof data.forks_count !== 'number'
    ) {
        throw new Error(`GitHub repository stats malformed for ${repository}`)
    }
    return {
        stars: data.stargazers_count,
        forks: data.forks_count,
    }
}

/**
 * Star/fork social proof for a repository.
 * Returns the provided verified fallback on any failure so a network miss
 * never becomes misleading 0/0 social proof.
 */
export async function getRepoSocialProof(repository, fallback) {
    try {
        return await fetchRepoSocialProof(repository)
    } catch (err) {
        // Fall through to the dated, verified fallback.
    }
    return { ...fallback }
}

/**
 * Open issues carrying a label (e.g. main-broken) as {id, url} objects.
 * Returns [] on any failure — the warning banner simply does not render.
 */
export async function getOpenIssuesByLabel(repository, label) {
    try {
        const issues = await fetchGitHubJson(
            `/repos/${repository}/issues?state=open&labels=${encodeURIComponent(label)}`
        )
        return (Array.isArray(issues) ? issues : [])
            .filter((issue) => issue && typeof issue.number === 'number')
            .map((issue) => ({ id: issue.number, url: issue.html_url }))
    } catch (err) {
        return []
    }
}

/**
 * The newest complete native desktop prerelease, slimmed to the fields
 * the download page renders (server-rendered props must stay small and
 * JSON-serializable). Beta sets are accepted only with their per-platform
 * provenance metadata and SHA256SUMS; complete legacy Experimental sets remain
 * discoverable during the transition.
 *
 * Returns { release, fetchFailed }:
 * - release: slim release object, or null
 * - fetchFailed: true when GitHub could not be reached (renders the
 *   "open releases on GitHub" fallback), false when GitHub answered but no
 *   complete prerelease exists yet.
 */
export async function resolveDesktopRelease(
    releases,
    {
        fetchAssetText = fetchDesktopReleaseAssetText,
        fetchTagCommit = fetchDesktopTagCommit,
    } = {}
) {
    const {
        DESKTOP_RELEASE_MANIFEST,
        desktopReleaseCandidates,
        desktopReleaseLifecycle,
        isLegacyBetaDesktopRelease,
        validateDesktopReleaseChecksums,
        validateDesktopReleaseManifest,
    } = await import('../utils/desktopRelease.js')
    const { createHash } = await import('node:crypto')
    for (const selected of desktopReleaseCandidates(releases)) {
        const strictLifecycle = desktopReleaseLifecycle(selected)
        const lifecycle =
            strictLifecycle ||
            (isLegacyBetaDesktopRelease(selected) ? 'beta' : null)
        const assets = (selected.assets || [])
            .filter(
                (asset) =>
                    asset &&
                    typeof asset.name === 'string' &&
                    typeof asset.browser_download_url === 'string'
            )
            .map((asset) => ({
                name: asset.name,
                size: typeof asset.size === 'number' ? asset.size : null,
                browser_download_url: asset.browser_download_url,
            }))
        if (strictLifecycle !== 'beta') {
            return {
                release: {
                    tag_name: selected.tag_name || null,
                    name: selected.name || null,
                    lifecycle,
                    manifest: null,
                    assets,
                },
                fetchFailed: false,
            }
        }
        try {
            const manifestAsset = selected.assets.find(
                (asset) => asset.name === DESKTOP_RELEASE_MANIFEST
            )
            const checksumAsset = selected.assets.find(
                (asset) => asset.name === 'SHA256SUMS'
            )
            const [manifestText, checksumText, tagSourceCommit] =
                await Promise.all([
                    fetchAssetText(manifestAsset?.browser_download_url),
                    fetchAssetText(checksumAsset?.browser_download_url),
                    fetchTagCommit(selected.tag_name),
                ])
            const manifestData = JSON.parse(manifestText)
            const manifest = validateDesktopReleaseManifest(
                selected,
                manifestData,
                tagSourceCommit
            )
            const manifestDigest = createHash('sha256')
                .update(manifestText)
                .digest('hex')
            if (
                !manifest ||
                !validateDesktopReleaseChecksums(
                    selected,
                    manifestData,
                    checksumText,
                    manifestDigest
                )
            ) {
                continue
            }
            return {
                release: {
                    tag_name: selected.tag_name || null,
                    name: selected.name || null,
                    lifecycle,
                    manifest: {
                        ...manifest,
                        browser_download_url:
                            manifestAsset.browser_download_url,
                    },
                    assets,
                },
                fetchFailed: false,
            }
        } catch (err) {
            // A malformed or unavailable candidate does not hide an older
            // valid strict Beta or the verified transition fallback.
        }
    }
    return { release: null, fetchFailed: false }
}

export async function getDesktopRelease() {
    const { DESKTOP_REPO } = await import('../utils/desktopRelease.js')
    try {
        const releases = await fetchGitHubJson(
            `/repos/${DESKTOP_REPO}/releases?per_page=20`
        )
        return await resolveDesktopRelease(releases)
    } catch (err) {
        return { release: null, fetchFailed: true }
    }
}

// Backward-compatible server API for older page code during rollout.
export const getExperimentalDesktopRelease = getDesktopRelease
